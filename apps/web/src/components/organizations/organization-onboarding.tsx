"use client";

import { useState } from "react";

import { Alert, Button, Paper, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";

const organizationSchema = z.object({
  name: z.string().min(2, "Informe o nome da organização."),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens."),
});

export function OrganizationOnboarding() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm({ initialValues: { name: "", slug: "" }, validate: zod4Resolver(organizationSchema) });

  async function createOrganization(values: z.infer<typeof organizationSchema>) {
    setError(null);
    const result = await authClient.organization.create(values);
    if (result.error || !result.data) {
      setError("Não foi possível criar a organização.");
      return;
    }

    const activeOrganization = await authClient.organization.setActive({ organizationId: result.data.id });
    if (activeOrganization.error) {
      setError("A organização foi criada, mas não pôde ser ativada.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <Paper withBorder maw={480} mx="auto" mt={{ base: "xl", sm: 96 }} p="xl" radius="sm">
      <Stack gap="xs" mb="xl">
        <Title order={1} fz="h3">Crie sua organização</Title>
        <Text c="dimmed" size="sm">Ela será o limite de dados e cobrança do seu produto.</Text>
      </Stack>
      {error && <Alert color="red" mb="md">{error}</Alert>}
      <form onSubmit={form.onSubmit(createOrganization)}>
        <Stack gap="md">
          <TextInput label="Nome" required {...form.getInputProps("name")} />
          <TextInput label="Identificador" description="Ex.: minha-empresa" required {...form.getInputProps("slug")} />
          <Button type="submit" color="dark" radius="sm">Criar organização</Button>
        </Stack>
      </form>
    </Paper>
  );
}