"use client";

import { useState } from "react";

import { Alert, Button, Paper, PasswordInput, Stack, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { resetPassword } from "@/lib/auth-flows";
import { resetPasswordSchema } from "@/models/auth";

export function ResetPasswordForm({ token }: { token: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    initialValues: { password: "" },
    validate: zod4Resolver(resetPasswordSchema),
  });

  async function submit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) {
      setError("O link de redefinição é inválido ou expirou.");
      return;
    }

    setError(null);
    const result = await resetPassword(token, values.password);
    if (result.error) {
      setError("O link de redefinição é inválido ou expirou.");
      return;
    }
    router.replace("/login");
  }

  return (
    <Paper withBorder maw={420} mx="auto" mt={{ base: "xl", sm: 96 }} p="xl" radius="sm">
      <Stack gap="xs" mb="xl">
        <Title order={1} fz="h3">Escolha uma nova senha</Title>
        <Text c="dimmed" size="sm">Use pelo menos 8 caracteres.</Text>
      </Stack>
      {error && <Alert color="red" mb="md">{error}</Alert>}
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="md">
          <PasswordInput label="Nova senha" required {...form.getInputProps("password")} />
          <Button type="submit" color="dark" radius="sm">Redefinir senha</Button>
        </Stack>
      </form>
    </Paper>
  );
}
