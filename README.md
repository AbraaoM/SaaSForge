# SaaS Forge

Starter kit para iniciar um SaaS com fundamentos de autenticação, multi-tenancy, cobrança e dados já resolvidos. Use este repositório como ponto de partida de um produto; ele não é uma plataforma para criar ou operar outros SaaS.

## Incluído

- Next.js App Router, TypeScript, Bun e Turborepo
- Mantine para interface
- PostgreSQL no Neon e Drizzle ORM
- Better Auth com senha/e-mail, verificação de e-mail e organizações
- Stripe e AbacatePay para assinaturas e webhooks idempotentes
- Resend para e-mail transacional
- Zod, ESLint e Vitest

## Começar um Produto

1. Use este repositório como template ou clone-o para o novo produto.
2. Renomeie o app, metadados, identidade visual e a página inicial em `apps/web`.
3. Copie `apps/web/.env.example` para `apps/web/.env.local` e forneça as credenciais dos provedores.
4. Gere e aplique o schema: `cd apps/web && bun run db:migrate`.
5. Modele o domínio do produto e implemente os primeiros casos de uso.

## Estrutura

```text
apps/
  web/                  Aplicação SaaS inicial
packages/
  eslint-config/        Configuração compartilhada de lint
  typescript-config/    Configurações TypeScript compartilhadas
```

Dentro de `apps/web/src`, o domínio de cada SaaS deve seguir esta organização:

```text
app/                    Rotas, páginas, layouts e route handlers
controllers/            Server Actions e limites HTTP
services/               Casos de uso, regras de negócio e autorização
models/                 Schemas Drizzle, Zod e tipos do domínio
components/             Componentes específicos do produto
lib/                    Clientes de infraestrutura e utilitários
```

Toda entidade pertencente a uma organização deve ser consultada e alterada com o `organizationId` derivado da sessão no servidor. Use `OrganizationAccessService.requireActiveOrganization()` nos Services; nunca aceite esse identificador como uma fonte confiável do cliente.

## Desenvolvimento

```sh
bun install
bun run dev --filter=web
```

O app fica disponível em `http://localhost:3000`. Consulte [apps/web/README.md](apps/web/README.md) para a configuração de banco, autenticação, e-mail e provedores de pagamento.

## Verificação

```sh
bun run lint
cd apps/web && bun run test
cd apps/web && bun run build
```
