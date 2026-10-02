import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Informe seu nome."),
  password: z.string().min(8, "Use pelo menos 8 caracteres."),
});

export const requestPasswordResetSchema = z.object({
  email: z.email("Informe um e-mail válido."),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Use pelo menos 8 caracteres."),
});
