# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `@next/eslint-plugin-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
bun exec turbo build
bun exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
bun exec turbo build --filter=docs
bun exec turbo build --filter=docs
```

### Develop

# SaaS Forge

Base monorepo para criar e operar produtos SaaS com uma arquitetura simples, segura e reutilizável.

## Stack

- Bun e Turborepo
- Next.js com App Router e TypeScript
- Mantine para a interface
- PostgreSQL/Neon e Drizzle para dados
- Better Auth para autenticação
- Stripe e AbacatePay para cobrança
- Zod para validação e Vitest para testes

## Estrutura

```text
apps/
	web/                  Aplicação inicial e painel operacional
packages/
	eslint-config/        Configuração compartilhada de lint
	typescript-config/    Configurações TypeScript compartilhadas
```

No `web`, mantenha as responsabilidades em `src/app`, `src/controllers`, `src/services`, `src/models`, `src/components` e `src/lib`. Regras de negócio, autorização, isolamento por organização e cobrança vivem em Services; páginas e Controllers apenas compõem e encaminham o fluxo.

## Desenvolvimento

```sh
bun install
bun run dev --filter=web
```

O painel estará disponível em `http://localhost:3000`. Para rodar somente o app web:

```sh
cd apps/web
bun run dev
```

## Verificação

```sh
bun run lint
bun run build
```

Antes de criar uma funcionalidade de produto, modele os dados e sua validação em `models`, crie o caso de uso em `services`, exponha-o por um Controller e componha a interface com Mantine. Toda entidade pertencente a uma organização deve ser consultada e alterada com `organizationId` obtido da sessão confiável.
```
