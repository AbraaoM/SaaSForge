import { describe, expect, it } from "vitest";

import {
  requestPasswordResetSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/models/auth";
import { organizationSchema } from "@/models/organization";

describe("authentication and organization validation", () => {
  it("accepts valid sign-in and sign-up details", () => {
    expect(signInSchema.safeParse({ email: "user@example.com", password: "secret" }).success).toBe(true);
    expect(signUpSchema.safeParse({
      name: "User Name",
      email: "user@example.com",
      password: "long-enough",
    }).success).toBe(true);
  });

  it("rejects malformed e-mail and weak or missing passwords", () => {
    expect(signInSchema.safeParse({ email: "not-an-email", password: "secret" }).success).toBe(false);
    expect(signInSchema.safeParse({ email: "user@example.com", password: "" }).success).toBe(false);
    expect(signUpSchema.safeParse({
      name: "User",
      email: "user@example.com",
      password: "short",
    }).success).toBe(false);
    expect(requestPasswordResetSchema.safeParse({ email: "invalid" }).success).toBe(false);
    expect(resetPasswordSchema.safeParse({ password: "short" }).success).toBe(false);
  });

  it("accepts password recovery details only when valid", () => {
    expect(requestPasswordResetSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ password: "long-enough" }).success).toBe(true);
  });

  it("rejects invalid organization names and slugs", () => {
    expect(organizationSchema.safeParse({ name: "Acme", slug: "acme-2" }).success).toBe(true);
    expect(organizationSchema.safeParse({ name: "A", slug: "Acme Team" }).success).toBe(false);
  });
});
