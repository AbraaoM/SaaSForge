import {
  ActionIcon,
  Badge,
  Box,
  Button,
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
  IconArrowUpRight,
  IconBuildingStore,
  IconChartBar,
  IconDots,
  IconPlus,
  IconRocket,
  IconUsers,
} from "@tabler/icons-react";

const products = [
  { name: "ClientFlow", description: "CRM para equipes de atendimento", status: "Em rascunho", color: "gray" },
  { name: "Pulse", description: "Indicadores de produto e receita", status: "Planejado", color: "yellow" },
] as const;

const foundations = [
  { label: "Autenticação", detail: "Better Auth", icon: IconUsers },
  { label: "Dados", detail: "PostgreSQL + Drizzle", icon: IconBuildingStore },
  { label: "Cobrança", detail: "Stripe + AbacatePay", icon: IconChartBar },
];

export function SaaSForgeDashboard() {
  return (
    <Box maw={1280} mx="auto" px={{ base: "md", sm: "xl" }} py={{ base: "lg", sm: 40 }} w="100%">
      <Group justify="space-between" align="center" mb={48}>
        <Group gap="sm">
          <ThemeIcon size={36} radius="sm" variant="filled" color="dark">
            <IconRocket size={20} stroke={1.8} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={1} fz="h3" fw={650}>SaaS Forge</Title>
            <Text c="dimmed" size="xs">Fábrica de produtos</Text>
          </Stack>
        </Group>
        <Button leftSection={<IconPlus size={16} />} color="dark" radius="sm">
          Novo produto
        </Button>
      </Group>

      <Stack gap={8} mb={32}>
        <Text c="dimmed" fw={600} size="sm">VISÃO GERAL</Text>
        <Title order={2} fz={{ base: 28, sm: 34 }} fw={650}>Construa o próximo produto.</Title>
        <Text c="dimmed" maw={560} size="md">
          Uma base única para tirar ideias do papel, operar organizações e escalar SaaS com consistência.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb={40}>
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

      <Group justify="space-between" mb="md">
        <Title order={2} fz="h4" fw={650}>Produtos</Title>
        <Button variant="subtle" color="dark" size="compact-sm" rightSection={<IconArrowUpRight size={14} />}>
          Ver todos
        </Button>
      </Group>

      <Paper withBorder radius="sm">
        {products.map((product, index) => (
          <Box key={product.name} px="lg" py="md">
            {index > 0 && <Divider mb="md" />}
            <Group justify="space-between" wrap="nowrap">
              <Group gap="md" wrap="nowrap">
                <ThemeIcon variant="light" color="dark" radius="sm" size={38}>
                  <IconRocket size={19} stroke={1.7} />
                </ThemeIcon>
                <div>
                  <Text fw={600}>{product.name}</Text>
                  <Text c="dimmed" size="sm">{product.description}</Text>
                </div>
              </Group>
              <Group gap="xs" wrap="nowrap">
                <Badge color={product.color} variant="light" radius="sm">{product.status}</Badge>
                <ActionIcon variant="subtle" color="gray" aria-label={`Opções de ${product.name}`}>
                  <IconDots size={18} />
                </ActionIcon>
              </Group>
            </Group>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}