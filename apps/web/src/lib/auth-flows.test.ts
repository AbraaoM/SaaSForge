import { beforeEach, describe, expect, it, vi } from "vitest";

const authMethods = vi.hoisted(() => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: { email: authMethods.signIn },
    signUp: { email: authMethods.signUp },
    requestPasswordReset: authMethods.requestPasswordReset,
    resetPassword: authMethods.resetPassword,
  },
}));

import {
  requestPasswordReset,
  resetPassword,
  signInWithEmail,
  signUpWithEmail,
} from "@/lib/auth-flows";

describe("authentication flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs in and returns users to the application", async () => {
    authMethods.signIn.mockResolvedValue({ data: { token: "session" }, error: null });

    await signInWithEmail({ email: "user@example.com", password: "password" });

    expect(authMethods.signIn).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
      callbackURL: "/",
    });
  });

  it("creates accounts and directs users to organization onboarding", async () => {
    authMethods.signUp.mockResolvedValue({ data: { token: "session" }, error: null });

    await signUpWithEmail({ name: "User Name", email: "user@example.com", password: "password" });

    expect(authMethods.signUp).toHaveBeenCalledWith({
      name: "User Name",
      email: "user@example.com",
      password: "password",
      callbackURL: "/onboarding",
    });
  });

  it("requests a password reset using the configured return route", async () => {
    authMethods.requestPasswordReset.mockResolvedValue({ data: {}, error: null });

    await requestPasswordReset("user@example.com", "https://example.com/reset-password");

    expect(authMethods.requestPasswordReset).toHaveBeenCalledWith({
      email: "user@example.com",
      redirectTo: "https://example.com/reset-password",
    });
  });

  it("submits the reset token and new password to Better Auth", async () => {
    authMethods.resetPassword.mockResolvedValue({ data: {}, error: null });

    await resetPassword("reset-token", "new-password");

    expect(authMethods.resetPassword).toHaveBeenCalledWith({
      token: "reset-token",
      newPassword: "new-password",
    });
  });
});
