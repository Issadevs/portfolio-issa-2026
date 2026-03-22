import "server-only";

import { APP_ENV } from "@/lib/env/shared";

type LogLevel = "info" | "warn" | "error";
type LogPayload = Record<string, unknown>;

function sanitizeValue(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
    };
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        sanitizeValue(item),
      ])
    );
  }

  return value;
}

function log(level: LogLevel, scope: string, event: string, payload: LogPayload) {
  const sanitizedPayload = sanitizeValue(payload) as LogPayload;

  console[level](`[${scope}] ${event}`, {
    env: APP_ENV,
    timestamp: new Date().toISOString(),
    ...sanitizedPayload,
  });
}

export function createRequestLogger(scope: string) {
  const startedAt = Date.now();

  function write(level: LogLevel, event: string, payload: LogPayload = {}) {
    log(level, scope, event, {
      durationMs: Date.now() - startedAt,
      ...payload,
    });
  }

  return {
    info(event: string, payload?: LogPayload) {
      write("info", event, payload);
    },
    warn(event: string, payload?: LogPayload) {
      write("warn", event, payload);
    },
    error(event: string, payload?: LogPayload) {
      write("error", event, payload);
    },
  };
}
