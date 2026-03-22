export type AppEnv = "development" | "test" | "production";

const nodeEnv = process.env.NODE_ENV;

export const APP_ENV: AppEnv =
  nodeEnv === "production"
    ? "production"
    : nodeEnv === "test"
      ? "test"
      : "development";

export const IS_DEV = APP_ENV === "development";
export const IS_PROD = APP_ENV === "production";

export function previewEnvValue(value: string, visibleChars = 12): string {
  if (!value) return "(non définie)";
  if (value.length <= visibleChars) return value;
  return `${value.slice(0, visibleChars)}…`;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isPlaceholderValue(value: string): boolean {
  return (
    value.includes("xxxx") ||
    value.includes("your-") ||
    value.includes("example") ||
    value.endsWith("...")
  );
}

export function readBooleanEnv(
  value: string | undefined,
  fallback: boolean
): boolean {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return fallback;
  }

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
}
