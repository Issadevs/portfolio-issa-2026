import "server-only";

import {
  IS_DEV,
  IS_PROD,
  isPlaceholderValue,
  isValidHttpUrl,
  readBooleanEnv,
} from "@/lib/env/shared";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/env/public";
import { PROFILE } from "@/lib/profile";

export interface ContactEmailConfig {
  apiKey: string;
  toEmail: string;
  fromEmail: string;
}

export interface GitHubFeedConfig {
  username: string;
  token?: string;
}

export function hasSupabaseServerConfig(): boolean {
  return hasSupabaseEnv();
}

export function getSupabaseServerConfig(): { url: string; key: string } {
  return getSupabaseEnv();
}

export function getContactEmailConfig(): ContactEmailConfig | null {
  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();

  if (!apiKey || isPlaceholderValue(apiKey)) {
    return null;
  }

  return {
    apiKey,
    toEmail: (process.env.CONTACT_TO_EMAIL ?? PROFILE.email).trim(),
    fromEmail: (
      process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev"
    ).trim(),
  };
}

export function getGitHubFeedConfig(): GitHubFeedConfig {
  const token = (process.env.GITHUB_TOKEN ?? "").trim();

  return {
    username: (process.env.GITHUB_USERNAME ?? "issadevs").trim() || "issadevs",
    token: token || undefined,
  };
}

export function getOptionalSiteUrl(): URL | undefined {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim();

  if (!raw) {
    return IS_DEV ? new URL("http://localhost:3000") : undefined;
  }

  if (!isValidHttpUrl(raw) || isPlaceholderValue(raw)) {
    return IS_DEV ? new URL("http://localhost:3000") : undefined;
  }

  return new URL(raw);
}

export function isAnalyticsEnabled(): boolean {
  return readBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_ANALYTICS, IS_PROD);
}

export function isSpeedInsightsEnabled(): boolean {
  return readBooleanEnv(
    process.env.NEXT_PUBLIC_ENABLE_SPEED_INSIGHTS,
    IS_PROD
  );
}
