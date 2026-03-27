import { NextResponse } from "next/server";
import { getGitHubFeedConfig } from "@/lib/env/server";
import { createRequestLogger } from "@/lib/monitoring";

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: {
    commits?: Array<{ message: string; sha: string }>;
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { title: string; number: number; merged: boolean };
    issue?: { title: string; number: number };
    forkee?: { full_name: string };
    release?: { tag_name: string; name: string };
  };
  created_at: string;
}

interface FeedItem {
  id: string;
  repo: string;
  message: string;
  type: string;
  date: string;
  url: string;
}

function eventToFeedItem(event: GitHubEvent): FeedItem | null {
  const repo = event.repo.name;
  const date = event.created_at;
  const url = `https://github.com/${repo}`;

  switch (event.type) {
    case "PushEvent": {
      if (!event.payload.commits?.length) return null;
      const commit = event.payload.commits[event.payload.commits.length - 1];
      return {
        id: event.id,
        repo,
        message: commit.message.split("\n")[0].slice(0, 72),
        type: "push",
        date,
        url: `${url}/commit/${commit.sha}`,
      };
    }
    case "CreateEvent":
      return {
        id: event.id,
        repo,
        message: `Created ${event.payload.ref_type ?? "branch"}${event.payload.ref ? `: ${event.payload.ref}` : ""}`,
        type: "create",
        date,
        url,
      };
    case "PullRequestEvent": {
      const pr = event.payload.pull_request;
      if (!pr) return null;
      const action = pr.merged ? "Merged" : (event.payload.action === "opened" ? "Opened PR" : "PR");
      return {
        id: event.id,
        repo,
        message: `${action}: ${pr.title.slice(0, 60)}`,
        type: "pr",
        date,
        url: `${url}/pull/${pr.number}`,
      };
    }
    case "IssuesEvent": {
      const issue = event.payload.issue;
      if (!issue || event.payload.action !== "opened") return null;
      return {
        id: event.id,
        repo,
        message: `Issue: ${issue.title.slice(0, 60)}`,
        type: "issue",
        date,
        url: `${url}/issues/${issue.number}`,
      };
    }
    case "ForkEvent": {
      const forkee = event.payload.forkee;
      if (!forkee) return null;
      return {
        id: event.id,
        repo,
        message: `Forked → ${forkee.full_name}`,
        type: "fork",
        date,
        url: `https://github.com/${forkee.full_name}`,
      };
    }
    case "ReleaseEvent": {
      const release = event.payload.release;
      if (!release) return null;
      return {
        id: event.id,
        repo,
        message: `Released ${release.tag_name}${release.name ? ` — ${release.name}` : ""}`,
        type: "release",
        date,
        url: `${url}/releases/tag/${release.tag_name}`,
      };
    }
    case "WatchEvent":
      return { id: event.id, repo, message: "Starred", type: "star", date, url };
    default:
      return null;
  }
}

export async function GET() {
  const { username, token } = getGitHubFeedConfig();
  const log = createRequestLogger("github-feed");

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-issa-2026",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Avec token → /events (inclut les repos privés)
  // Sans token → /events/public (seulement les repos publics, rate limit 60/h)
  const endpoint = token
    ? `https://api.github.com/users/${username}/events?per_page=20`
    : `https://api.github.com/users/${username}/events/public?per_page=20`;

  try {
    const res = await fetch(endpoint, {
      headers,
      next: { revalidate: 300 }, // Cache 5min — réduit les appels GitHub API
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      log.error("github_api_error", {
        status: res.status,
        remainingRateLimit: remaining ?? "?",
        username,
      });
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status === 403 ? 429 : 502 }
      );
    }

    const raw = await res.json();
    // Sécurité : GitHub renvoie un objet (erreur) au lieu d'un tableau si rate limit
    if (!Array.isArray(raw)) {
      log.error("github_api_unexpected_response", { username, raw });
      return NextResponse.json({ error: "Unexpected GitHub response" }, { status: 502 });
    }

    const events = raw as GitHubEvent[];
    const items = events
      .map(eventToFeedItem)
      .filter((item): item is FeedItem => item !== null)
      .slice(0, 8);

    log.info("github_feed_loaded", { username, itemCount: items.length });
    return NextResponse.json({ items });
  } catch (err) {
    log.error("github_feed_fetch_failed", { username, error: err });
    return NextResponse.json(
      { error: "Unable to fetch GitHub events" },
      { status: 502 }
    );
  }
}
