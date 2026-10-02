import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));
vi.mock("@/lib/env", () => ({
  getEmailEnv: () => ({ RESEND_API_KEY: "re_test", EMAIL_FROM: "support@example.com" }),
}));

import { sendPasswordResetEmail } from "@/lib/email";

describe("password reset email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.send.mockResolvedValue({ data: { id: "email-id" }, error: null });
  });

  it("sends the reset link through Resend", async () => {
    await sendPasswordResetEmail("user@example.com", "https://example.com/reset?token=abc");

    expect(mocks.send).toHaveBeenCalledWith({
      from: "support@example.com",
      to: "user@example.com",
      subject: "Redefina sua senha",
      html: expect.stringContaining('href="https://example.com/reset?token=abc"'),
    });
  });
});
