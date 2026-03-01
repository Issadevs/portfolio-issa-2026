import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// In-memory rate limiting — resets on cold start, acceptable for a portfolio
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1h

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const resend = new Resend(process.env.RESEND_API_KEY);

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

// Minimal HTML escaping to prevent injection in email body
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    // Honeypot — bots fill this hidden field, humans don't
    if (typeof body.website === "string" && body.website.length > 0) {
      // Silently accept to not reveal the trap
      return NextResponse.json({ ok: true });
    }

    // Rate limiting
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Validation
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const company =
      typeof body.company === "string" ? body.company.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }
    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    const toEmail = process.env.CONTACT_TO_EMAIL ?? "issa.kane@efrei.net";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

    const { error } = await resend.emails.send({
      from: `Portfolio Issa KANE <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,
      subject: `Portfolio — Message de ${name}${company ? ` (${company})` : ""}`,
      html: `
        <div style="font-family: monospace; max-width: 600px; padding: 20px; background: #ffffff;">
          <h2 style="color: #1E40AF; margin: 0 0 16px;">Nouveau message — Portfolio</h2>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 16px; font-weight: bold; width: 120px; border-bottom: 1px solid #e5e7eb;">Nom</td>
              <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email</td>
              <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb;">
                <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
              </td>
            </tr>
            ${
              company
                ? `<tr style="background: #f9fafb;">
              <td style="padding: 10px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Entreprise</td>
              <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(company)}</td>
            </tr>`
                : ""
            }
            <tr ${company ? "" : 'style="background: #f9fafb;"'}>
              <td style="padding: 10px 16px; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 10px 16px; white-space: pre-wrap;">${escapeHtml(message)}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #6B7280; font-size: 12px;">
            Envoyé depuis le portfolio — issa-kane.vercel.app
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error.name);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    console.info(`[contact] Message sent — from=${email} ip=${ip}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "[contact] Unexpected error:",
      err instanceof Error ? err.message : "unknown"
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
