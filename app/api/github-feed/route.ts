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

  if (event.type === "PushEvent" && event.payload.commits?.length) {
    const commit = event.payload.commits[0];
    return {
      id: event.id,
      repo,
      message: commit.message.split("\n")[0].slice(0, 72),
      type: "push",
      date,
      url: `${url}/commit/${commit.sha}`,
    };
  }
  if (event.type === "CreateEvent") {
    return {
      id: event.id,
      repo,
      message: `Created ${event.payload.ref_type ?? "branch"}: ${event.payload.ref ?? ""}`,
      type: "create",
      date,
      url,
    };
  }
  if (event.type === "WatchEvent") {
    return { id: event.id, repo, message: "Starred", type: "star", date, url };
  }
  return null;
}

export async function GET() {
  const { username, token } = getGitHubFeedConfig();
  const log = createRequestLogger("github-feed");

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-issa-2026",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=8`,
      {
        headers,
        next: { revalidate: 60 }, // Cache 60s — reduces GitHub API calls in prod
        signal: AbortSignal.timeout(5000), // Évite les hangs si GitHub est lent
      }
    );

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

    const events = (await res.json()) as GitHubEvent[];
    const items = events
      .map(eventToFeedItem)
      .filter((item): item is FeedItem => item !== null)
      .slice(0, 8);

    log.info("github_feed_loaded", {
      username,
      itemCount: items.length,
    });
    return NextResponse.json({ items });
  } catch (err) {
    log.error("github_feed_fetch_failed", {
      username,
      error: err,
    });
    return NextResponse.json(
      { error: "Unable to fetch GitHub events" },
      { status: 502 }
    );
  }
}
