import { authClient } from "@/lib/auth-client";
import type { signInSchema, signUpSchema } from "@/models/auth";
import type { z } from "zod";

export function signInWithEmail(values: z.infer<typeof signInSchema>) {
  return authClient.signIn.email({ ...values, callbackURL: "/" });
}

export function signUpWithEmail(values: z.infer<typeof signUpSchema>) {
  return authClient.signUp.email({ ...values, callbackURL: "/onboarding" });
}

export function requestPasswordReset(email: string, redirectTo: string) {
  return authClient.requestPasswordReset({ email, redirectTo });
}

export function resetPassword(token: string, password: string) {
  return authClient.resetPassword({ token, newPassword: password });
}
