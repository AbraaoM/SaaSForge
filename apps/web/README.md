# SaaS Forge Web

Aplicação Next.js que concentra a base de autenticação, organizações, assinatura e checkout dos produtos SaaS.

## Configuração local

```sh
cp .env.example .env.local
bun run db:generate
bun run db:migrate
bun run dev
```

Preencha `DATABASE_URL` com a connection string pooled do Neon. Gere `BETTER_AUTH_SECRET` com pelo menos 32 caracteres e mantenha todas as chaves apenas no ambiente local ou no provedor de deploy.

## Provedores

Better Auth atende em `/api/auth/[...all]`, com senha/e-mail, confirmação via Resend e organizações. A organização ativa é armazenada na sessão; Services devem obter o contexto com `OrganizationAccessService.requireActiveOrganization()` e nunca receber `organizationId` confiável do cliente.

Para Stripe, crie os preços recorrentes Starter e Pro e preencha os respectivos `STRIPE_*_PRICE_ID`. Cadastre o endpoint HTTPS `/api/webhooks/stripe` no Dashboard Stripe e informe o secret gerado em `STRIPE_WEBHOOK_SECRET`.

Para AbacatePay, crie os produtos recorrentes Starter e Pro, preencha os respectivos `ABACATEPAY_*_PRODUCT_ID` e cadastre `https://seu-dominio/api/webhooks/abacatepay` para eventos `subscription.completed`, `subscription.renewed` e `subscription.cancelled`. Configure o mesmo secret em `ABACATEPAY_WEBHOOK_SECRET`; o endpoint exige o header `X-Webhook-Signature` HMAC-SHA256.

O checkout autenticado recebe `POST /api/billing/checkout` com:

```json
{ "provider": "stripe", "plan": "pro" }
```

A resposta contém uma URL hospedada do provedor. Webhooks são a única fonte que altera o estado de uma assinatura; eventos duplicados são descartados por uma constraint única em `payment_event`.

## Comandos

```sh
bun run lint
bun run test
bun run build
bun run db:generate
bun run db:migrate
```
