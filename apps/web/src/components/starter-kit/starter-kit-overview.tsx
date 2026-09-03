import {
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBuildingStore,
  IconChartBar,
  IconCircleCheck,
  IconRocket,
  IconUsers,
} from "@tabler/icons-react";

const foundations = [
  { label: "Autenticação", detail: "Better Auth e organizações", icon: IconUsers },
  { label: "Dados", detail: "Neon PostgreSQL e Drizzle", icon: IconBuildingStore },
  { label: "Cobrança", detail: "Stripe e AbacatePay", icon: IconChartBar },
];

const nextSteps = [
  "Definir as variáveis em .env.local",
  "Aplicar a migration no Neon",
  "Trocar nome, identidade e página inicial",
  "Implementar o domínio do seu SaaS em Services",
];

export function StarterKitOverview() {
  return (
    <Box maw={1040} mx="auto" px={{ base: "md", sm: "xl" }} py={{ base: "lg", sm: 40 }} w="100%">
      <Group justify="space-between" align="center" mb={56}>
        <Group gap="sm">
          <ThemeIcon size={36} radius="sm" variant="filled" color="dark">
            <IconRocket size={20} stroke={1.8} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={1} fz="h3" fw={650}>SaaS Forge</Title>
            <Text c="dimmed" size="xs">Starter kit</Text>
          </Stack>
        </Group>
        <Badge color="teal" variant="light" leftSection={<IconCircleCheck size={12} />} radius="sm">
          Base pronta
        </Badge>
      </Group>

      <Stack gap={8} mb={36}>
        <Text c="dimmed" fw={600} size="sm">SEU PONTO DE PARTIDA</Text>
        <Title order={2} fz={{ base: 28, sm: 34 }} fw={650}>Comece o seu SaaS daqui.</Title>
        <Text c="dimmed" maw={650} size="md">
          Uma estrutura segura e opinativa para você concentrar energia no domínio do produto, não na infraestrutura repetitiva.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb={48}>
        {foundations.map(({ label, detail, icon: Icon }) => (
          <Paper key={label} withBorder p="lg" radius="sm">
            <ThemeIcon variant="light" color="dark" radius="sm" size={34} mb="md">
              <Icon size={18} stroke={1.7} />
            </ThemeIcon>
            <Text fw={600}>{label}</Text>
            <Text c="dimmed" size="sm" mt={4}>{detail}</Text>
          </Paper>
        ))}
      </SimpleGrid>

      <Paper withBorder p="xl" radius="sm">
        <Group justify="space-between" align="flex-start" mb="lg" gap="md">
          <div>
            <Title order={2} fz="h4" fw={650}>Antes de construir</Title>
            <Text c="dimmed" size="sm" mt={4}>Configure a infraestrutura uma vez e comece pelo caso de uso do seu produto.</Text>
          </div>
          <Button component="a" href="/login" variant="light" color="dark" radius="sm" rightSection={<IconArrowRight size={16} />}>
            Abrir autenticação
          </Button>
        </Group>
        <Stack gap="sm">
          {nextSteps.map((step, index) => (
            <Group key={step} gap="sm" wrap="nowrap">
              <ThemeIcon size={24} radius="sm" variant="light" color="gray">
                <Text size="xs" fw={700}>{index + 1}</Text>
              </ThemeIcon>
              <Text size="sm">{step}</Text>
            </Group>
          ))}
        </Stack>
        <Divider my="lg" />
        <Text c="dimmed" size="sm">
          Comece por <Code>src/models</Code>, <Code>src/services</Code> e <Code>src/controllers</Code> ao introduzir o domínio do produto.
        </Text>
      </Paper>
    </Box>
  );
}