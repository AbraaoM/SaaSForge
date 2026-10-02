import "server-only";

import { Resend } from "resend";

import { getEmailEnv } from "@/lib/env";

export async function sendVerificationEmail(email: string, url: string) {
  const env = getEmailEnv();
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Confirme seu e-mail",
    html: `<p>Confirme seu e-mail para acessar sua conta:</p><p><a href="${url}">Confirmar e-mail</a></p>`,
  });
}

export async function sendPasswordResetEmail(email: string, url: string) {
  const env = getEmailEnv();
  const resend = new Resend(env.RESEND_API_KEY);

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Redefina sua senha",
    html: `<p>Use o link abaixo para redefinir sua senha:</p><p><a href="${url}">Redefinir senha</a></p>`,
  });
}