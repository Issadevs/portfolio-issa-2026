// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getContactEmailConfigMock, sendEmailMock } = vi.hoisted(() => ({
  getContactEmailConfigMock: vi.fn(),
  sendEmailMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = {
      send: sendEmailMock,
    };
  },
}));

vi.mock("@/lib/env/server", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/env/server")>("@/lib/env/server");

  return {
    ...actual,
    getContactEmailConfig: getContactEmailConfigMock,
  };
});

import { POST } from "@/app/api/contact/route";

function createRequest(
  body: Record<string, unknown>,
  ip = "203.0.113.10"
): NextRequest {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    getContactEmailConfigMock.mockReturnValue({
      apiKey: "re_test_key",
      toEmail: "issa.kane@efrei.net",
      fromEmail: "onboarding@resend.dev",
    });
    sendEmailMock.mockResolvedValue({ error: null });
  });

  it("accepts honeypot submissions silently", async () => {
    const response = await POST(
      createRequest({
        website: "filled-by-bot",
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("returns 503 when the contact service is not configured", async () => {
    getContactEmailConfigMock.mockReturnValue(null);

    const response = await POST(
      createRequest({
        name: "Issa",
        email: "issa@example.com",
        message: "Bonjour, je veux te contacter pour une opportunite.",
      })
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Contact service is not configured yet. Please try again later.",
    });
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the payload is invalid", async () => {
    const response = await POST(
      createRequest(
        {
          name: "I",
          email: "invalid-email",
          message: "short",
        },
        "203.0.113.11"
      )
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Name is required.",
    });
  });

  it("sends a message through Resend when the payload is valid", async () => {
    const response = await POST(
      createRequest(
        {
          name: "Issa Kane",
          email: "issa@example.com",
          company: "EFREI",
          message: "Bonjour, je te contacte pour une alternance en data et IA.",
        },
        "203.0.113.12"
      )
    );

    const payload = await response.json();

    expect({
      status: response.status,
      payload,
    }).toEqual({
      status: 200,
      payload: { ok: true },
    });
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["issa.kane@efrei.net"],
        replyTo: "issa@example.com",
        subject: "Portfolio — Message de Issa Kane (EFREI)",
      })
    );
  });
});
