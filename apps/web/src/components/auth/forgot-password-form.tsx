"use client";

import { useState } from "react";

import { Alert, Button, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { requestPasswordReset } from "@/lib/auth-flows";
import { requestPasswordResetSchema } from "@/models/auth";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm({
    initialValues: { email: "" },
    validate: zod4Resolver(requestPasswordResetSchema),
  });

  async function submit(values: z.infer<typeof requestPasswordResetSchema>) {
    setError(null);
    const result = await requestPasswordReset(values.email, `${window.location.origin}/reset-password`);
    if (result.error) {
      setError("Não foi possível solicitar a redefinição de senha.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <Paper withBorder maw={420} mx="auto" mt={{ base: "xl", sm: 96 }} p="xl" radius="sm">
      <Stack gap="xs" mb="xl">
        <Title order={1} fz="h3">Redefinir senha</Title>
        <Text c="dimmed" size="sm">Informe seu e-mail para receber um link de redefinição.</Text>
      </Stack>
      {error && <Alert color="red" mb="md">{error}</Alert>}
      {submitted ? (
        <Text role="status">Se houver uma conta para este e-mail, enviaremos instruções para redefinir sua senha.</Text>
      ) : (
        <form onSubmit={form.onSubmit(submit)}>
          <Stack gap="md">
            <TextInput label="E-mail" type="email" required {...form.getInputProps("email")} />
            <Button type="submit" color="dark" radius="sm">Enviar instruções</Button>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
