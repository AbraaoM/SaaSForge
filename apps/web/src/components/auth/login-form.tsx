"use client";

import { useState } from "react";

import { Alert, Button, Paper, PasswordInput, Stack, Tabs, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(2, "Informe seu nome."),
  password: z.string().min(8, "Use pelo menos 8 caracteres."),
});

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const signInForm = useForm({ initialValues: { email: "", password: "" }, validate: zod4Resolver(signInSchema) });
  const signUpForm = useForm({ initialValues: { name: "", email: "", password: "" }, validate: zod4Resolver(signUpSchema) });

  async function signIn(values: z.infer<typeof signInSchema>) {
    setError(null);
    const result = await authClient.signIn.email({ ...values, callbackURL: "/" });
    if (result.error) setError("Não foi possível entrar com estas credenciais.");
  }

  async function signUp(values: z.infer<typeof signUpSchema>) {
    setError(null);
    const result = await authClient.signUp.email({ ...values, callbackURL: "/onboarding" });
    if (result.error) setError("Não foi possível criar a conta.");
  }

  return (
    <Paper withBorder maw={420} mx="auto" mt={{ base: "xl", sm: 96 }} p="xl" radius="sm">
      <Title order={1} fz="h3" mb="xl">SaaS Forge</Title>
      {error && <Alert color="red" mb="md">{error}</Alert>}
      <Tabs defaultValue="sign-in">
        <Tabs.List grow mb="lg">
          <Tabs.Tab value="sign-in">Entrar</Tabs.Tab>
          <Tabs.Tab value="sign-up">Criar conta</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="sign-in">
          <form onSubmit={signInForm.onSubmit(signIn)}>
            <Stack gap="md">
              <TextInput label="E-mail" type="email" required {...signInForm.getInputProps("email")} />
              <PasswordInput label="Senha" required {...signInForm.getInputProps("password")} />
              <Button type="submit" color="dark" radius="sm">Entrar</Button>
            </Stack>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="sign-up">
          <form onSubmit={signUpForm.onSubmit(signUp)}>
            <Stack gap="md">
              <TextInput label="Nome" required {...signUpForm.getInputProps("name")} />
              <TextInput label="E-mail" type="email" required {...signUpForm.getInputProps("email")} />
              <PasswordInput label="Senha" required {...signUpForm.getInputProps("password")} />
              <Button type="submit" color="dark" radius="sm">Criar conta</Button>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}