# Project Instructions — SaaS Architecture & Development Guide

This repository is a reusable foundation for rapidly building multiple SaaS products.

The primary goal is to keep the codebase **simple, secure, reusable, maintainable, and fast to develop**.

These instructions are mandatory unless there is a concrete technical reason to deviate.

---

# 1. Core Principles

## DO

* DO follow KISS (Keep It Simple, Stupid).
* DO prefer the simplest solution that correctly solves the problem.
* DO prioritize security.
* DO reuse existing project conventions and dependencies.
* DO prefer mature, actively maintained open-source software.
* DO keep business logic explicit and easy to understand.
* DO optimize for maintainability and rapid SaaS development.
* DO introduce abstractions only when they provide concrete value.

## DO NOT

* DO NOT introduce complexity without a concrete reason.
* DO NOT create abstractions for hypothetical future requirements.
* DO NOT over-engineer simple features.
* DO NOT introduce design patterns merely because they are available.
* DO NOT optimize prematurely.
* DO NOT sacrifice security for simplicity.

---

# 2. Technology Stack

The project uses:

* Runtime: **Bun**
* Monorepo: **Turborepo**
* Framework: **Next.js**
* Language: **TypeScript**
* UI: **Mantine**
* Database: **PostgreSQL on Neon**
* ORM: **Drizzle ORM**
* Validation: **Zod**
* Authentication: **Better Auth**
* Payments: **Stripe and AbacatePay**
* Email: **Resend**
* Analytics: **Himetrica**
* Deployment: **Vercel**
* Testing: **Vitest**

## DO

* DO use the existing stack whenever it solves the problem.
* DO prefer the existing project dependencies over introducing new dependencies.
* DO keep provider-specific integrations isolated.
* DO use the stack consistently across SaaS applications.

## DO NOT

* DO NOT replace an existing technology without a concrete technical reason.
* DO NOT introduce duplicate technologies with overlapping responsibilities.
* DO NOT introduce another UI component library.
* DO NOT introduce another ORM.
* DO NOT introduce another validation library.
* DO NOT introduce another authentication system unless explicitly required.

---

# 3. Monorepo — Turborepo

Use Turborepo to manage the monorepo.

A typical structure should be:

```text
apps/
  web/
    src/
      app/
      controllers/
      services/
      models/
      components/
        ui/
      lib/

packages/
  ...
```

## DO

* DO use `apps/` for deployable applications.
* DO use `packages/` for genuinely shared code.
* DO extract code into shared packages when it is reused by multiple applications.
* DO keep application-specific code inside its application.
* DO use Turborepo to coordinate builds, tests, linting, and development tasks.

## DO NOT

* DO NOT create shared packages prematurely.
* DO NOT create a package for every utility.
* DO NOT move application-specific code into `packages/`.
* DO NOT create abstractions merely because the repository is a monorepo.
* DO NOT force code sharing where there is no real reuse.

---

# 4. Application Structure

Each Next.js application should follow:

```text
src/
  app/
  controllers/
  services/
  models/
  components/
    ui/
  lib/
```

## DO

* DO keep responsibilities separated according to this structure.
* DO place code in the directory that owns its responsibility.
* DO keep dependencies flowing from application boundaries toward business logic and infrastructure.

## DO NOT

* DO NOT create random top-level directories without a clear responsibility.
* DO NOT mix business logic with UI code.
* DO NOT put database queries directly into React components.
* DO NOT put business logic directly into pages.

---

# 5. `src/app/` — Next.js

`src/app/` contains Next.js App Router routes, pages, layouts, loading states, error boundaries, and route handlers.

## DO

* DO use the Next.js App Router.
* DO prefer Server Components by default.
* DO use Client Components only when required.
* DO keep pages focused on composition and presentation.
* DO perform server-side data loading when appropriate.
* DO keep business logic in Services.

## DO NOT

* DO NOT put business rules inside pages.
* DO NOT put complex database queries inside pages.
* DO NOT make entire pages Client Components unnecessarily.
* DO NOT use React components as a replacement for Services.

---

# 6. `src/controllers/` — Controllers

Controllers contain Server Actions and Route Handlers.

## DO

Controllers SHOULD:

1. Receive the request or action.
2. Authenticate the user when required.
3. Parse and validate input using Zod.
4. Call the appropriate Service.
5. Convert the Service result into an `ActionResult` or HTTP response.
6. Handle HTTP-specific concerns.
7. Validate webhook authenticity before processing webhook events.

## DO NOT

* DO NOT put business logic in Controllers.
* DO NOT put complex database operations in Controllers.
* DO NOT implement authorization rules directly in Controllers when they belong to the business operation.
* DO NOT implement billing rules in Controllers.
* DO NOT call external payment providers directly from arbitrary Controllers.
* DO NOT return `NextResponse` from Services.

Controllers must remain **thin**.

---

# 7. `src/services/` — Services

Services contain application business logic and use cases.

## DO

Services SHOULD:

* DO implement business rules.
* DO perform authorization.
* DO enforce tenant isolation.
* DO enforce billing restrictions.
* DO enforce quotas.
* DO perform database operations through Drizzle.
* DO coordinate external API calls.
* DO encapsulate application workflows.
* DO expose simple application-level operations.

Services may interact with:

* Drizzle
* Stripe
* AbacatePay
* Resend
* Better Auth
* Himetrica
* infrastructure utilities in `lib/`

## DO NOT

* DO NOT put HTTP response logic in Services.
* DO NOT return `NextResponse` from Services.
* DO NOT depend unnecessarily on Next.js request/response objects.
* DO NOT put UI logic in Services.
* DO NOT duplicate business rules across Controllers and Services.

---

# 8. `src/models/` — Models

Models contain data definitions and validation structures.

## DO

Use Models for:

* Drizzle schemas
* database table definitions
* Zod schemas
* DTOs
* domain-related TypeScript types
* shared data structures

## DO NOT

* DO NOT put HTTP logic in Models.
* DO NOT put application workflows in Models.
* DO NOT put UI logic in Models.
* DO NOT turn Models into Service objects.

Models describe data; Services implement behavior.

---

# 9. `src/components/ui/` — Generic UI

Use `src/components/ui/` for reusable generic UI components.

## DO

* DO build reusable components primarily with Mantine.
* DO reuse Mantine components.
* DO create project-specific wrappers around Mantine only when they provide real value.
* DO keep generic components independent of business domains.

## DO NOT

* DO NOT use shadcn/ui.
* DO NOT use another UI component library.
* DO NOT create custom components when Mantine already provides the required component.
* DO NOT put domain-specific business logic into generic UI components.

---

# 10. `src/components/` — Domain Components

Use `src/components/` for business and domain-specific components.

Examples:

```text
components/
  billing/
  organizations/
  users/
  projects/
  dashboard/
```

## DO

* DO keep business-specific UI here.
* DO compose domain components from reusable UI components.
* DO keep business logic in Services.

## DO NOT

* DO NOT put generic components here when they belong in `components/ui/`.
* DO NOT perform direct database operations from components.
* DO NOT put authorization logic solely in components.

---

# 11. `src/lib/` — Infrastructure

Use `src/lib/` for infrastructure and shared utilities.

Examples:

* database client
* authentication helpers
* environment configuration
* Stripe client
* AbacatePay client
* Resend client
* Himetrica client
* logging
* generic utilities

## DO

* DO isolate infrastructure integrations.
* DO keep provider-specific implementation details here when appropriate.
* DO expose simple interfaces to Services.

## DO NOT

* DO NOT use `lib/` as a replacement for Services.
* DO NOT put business workflows in `lib/`.
* DO NOT scatter provider-specific API calls throughout the application.

---

# 12. MVC-Inspired Architecture

Use this dependency direction:

```text
Controller
    ↓
Service
    ↓
Model / Database / External APIs
```

## DO

* DO keep Controllers responsible for application boundaries.
* DO keep Services responsible for business behavior.
* DO keep Models responsible for data structures.
* DO keep infrastructure concerns isolated.

## DO NOT

* DO NOT reverse the dependency direction unnecessarily.
* DO NOT make Models depend on Controllers.
* DO NOT make UI components responsible for business workflows.
* DO NOT make Controllers responsible for business rules.

---

# 13. Multi-Tenancy

The application is multi-tenant.

Every organization-owned entity MUST contain:

```text
organizationId
```

## DO

* DO derive the organization context from the authenticated server-side session.
* DO explicitly scope every organization-owned database operation.
* DO use the trusted `organizationId` for inserts.
* DO include `organizationId` in `find`, `select`, `update`, and `delete` operations.
* DO enforce tenant isolation inside Services.
* DO add appropriate tenant-scoped database indexes.

Example:

```text
WHERE id = requestedId
AND organizationId = session.organizationId
```

For inserts:

```text
organizationId = session.organizationId
```

## DO NOT

* DO NOT trust a client-provided `organizationId`.
* DO NOT allow the frontend to determine resource ownership.
* DO NOT query an organization-owned resource by ID alone.
* DO NOT update an organization-owned resource by ID alone.
* DO NOT delete an organization-owned resource by ID alone.
* DO NOT assume authentication automatically guarantees tenant isolation.

Tenant isolation is a mandatory security boundary.

---

# 14. Authentication — Better Auth

Use Better Auth for authentication and session management.

## DO

* DO authenticate users server-side.
* DO use `auth.api.getSession(...)` or the project's established authentication helper.
* DO authenticate at the Controller/application boundary.
* DO authorize business operations inside Services.
* DO derive the organization context from the trusted session.
* DO treat session information as the trusted source of user and organization identity.

## DO NOT

* DO NOT trust client-provided user IDs.
* DO NOT trust client-provided organization IDs.
* DO NOT trust client-provided roles.
* DO NOT trust client-provided permissions.
* DO NOT rely exclusively on frontend authorization.

---

# 15. Payments — Stripe and AbacatePay

The application supports both:

* **Stripe**
* **AbacatePay**

Both are payment providers.

The application architecture must not become unnecessarily coupled to either provider.

## DO

* DO encapsulate Stripe integration.
* DO encapsulate AbacatePay integration.
* DO use a `BillingService` for billing-related business logic.
* DO keep provider-specific API calls isolated.
* DO allow the application to reason in terms of plans, subscriptions, payments, quotas, and billing state.
* DO perform billing checks server-side.
* DO verify payment state using trusted provider information.
* DO make webhook processing idempotent whenever possible.

Example application-level operations:

```text
BillingService.createPayment()
BillingService.getSubscription()
BillingService.canUseFeature()
BillingService.checkQuota()
BillingService.handleWebhook()
```

The exact API should remain as small as necessary.

## DO NOT

* DO NOT scatter Stripe API calls throughout the application.
* DO NOT scatter AbacatePay API calls throughout the application.
* DO NOT put billing business logic in React components.
* DO NOT rely on frontend payment state.
* DO NOT trust payment status supplied by the client.
* DO NOT make the rest of the application depend directly on provider-specific objects unless necessary.

---

# 16. Billing and Authorization

Billing restrictions are business rules.

## DO

Before protected operations, Services SHOULD verify:

* organization is active
* subscription is valid
* plan includes the requested feature
* quota has not been exceeded
* subscription has not expired
* subscription has not been canceled when cancellation prevents access
* account is not suspended
* required payment state is satisfied

## DO NOT

* DO NOT enforce billing restrictions only in the frontend.
* DO NOT assume hidden UI elements provide security.
* DO NOT allow a protected write before server-side billing checks.
* DO NOT duplicate billing rules across multiple unrelated components.

---

# 17. Payment Webhooks

Payment webhooks are Controllers.

This applies to both Stripe and AbacatePay.

## DO

Webhook Controllers SHOULD:

1. Receive the webhook.
2. Validate the provider's webhook signature/authenticity.
3. Parse and validate the payload.
4. Delegate event processing to `BillingService`.
5. Return the correct HTTP response.

## DO NOT

* DO NOT put billing business logic directly in webhook handlers.
* DO NOT trust webhook payloads without authenticity verification.
* DO NOT assume webhooks are delivered exactly once.
* DO NOT make webhook processing non-idempotent when duplicate events are possible.

Architecture:

```text
Payment Provider
      ↓
Webhook Controller
      ↓
Verify Signature
      ↓
Validate Payload
      ↓
BillingService
      ↓
Update Billing State
```

---

# 18. Action Results

Use a consistent `ActionResult<T>` for Server Actions and application-level actions:

```ts
type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };
```

## DO

* DO return predictable Action Results.
* DO use typed results.
* DO expose safe errors.
* DO return structured validation errors when appropriate.

## DO NOT

* DO NOT expose stack traces.
* DO NOT expose database errors.
* DO NOT expose provider internals.
* DO NOT expose secrets.
* DO NOT expose internal implementation details.

API Route Handlers should still respect HTTP semantics and appropriate status codes.

---

# 19. Validation — Zod

Use Zod for input validation.

## DO

* DO validate all untrusted input server-side.
* DO validate Server Action input.
* DO validate API requests.
* DO validate route parameters.
* DO validate query parameters.
* DO validate webhook payloads.
* DO reuse schemas when practical.
* DO capture Zod errors safely.

## DO NOT

* DO NOT trust client-side validation.
* DO NOT duplicate validation rules unnecessarily.
* DO NOT accept arbitrary unvalidated input into Services.
* DO NOT expose raw validation internals to users.

---

# 20. Forms — Mantine Form + Zod

Use:

```text
@mantine/form
mantine-form-zod-resolver
Zod
```

## DO

* DO use Mantine Form for application forms.
* DO integrate forms with Zod.
* DO validate on the server as well.
* DO reuse validation schemas when practical.
* DO provide useful field-level errors.

## DO NOT

* DO NOT create a second form system.
* DO NOT rely only on client-side validation.
* DO NOT duplicate business validation unnecessarily.

---

# 21. UI — Mantine

Mantine is the primary UI system.

## DO

* DO use Mantine components.
* DO use Mantine theme tokens.
* DO use Mantine component props.
* DO use `classNames` and `styles` when appropriate.
* DO use CSS Modules when Mantine's styling system is insufficient.
* DO prefer Mantine components over native HTML when an equivalent exists.
* DO build a small reusable UI layer when repeated project-specific patterns emerge.

## DO NOT

* DO NOT use shadcn/ui.
* DO NOT use another UI component library.
* DO NOT use raw Tailwind utility classes for UI.
* DO NOT reinvent Mantine components unnecessarily.
* DO NOT create arbitrary styling systems.
* DO NOT inject inline CSS unnecessarily.

---

# 22. Styling

## DO

* DO prefer Mantine theme tokens.
* DO use consistent spacing.
* DO use consistent typography.
* DO reuse established visual patterns.
* DO use CSS Modules when genuinely necessary.
* DO keep styling restrained and consistent.

## DO NOT

* DO NOT use arbitrary one-off styles without a reason.
* DO NOT introduce a second styling system.
* DO NOT use raw Tailwind utility classes.
* DO NOT create excessive visual variations of the same component.
* DO NOT rely on decorative styling to compensate for poor information architecture.

---

# 23. Visual Design Language

The default design should be:

* minimalist
* clean
* professional
* functional
* calm
* dense when appropriate
* timeless
* highly readable

The visual direction is inspired by:

* Notion
* Rocket.Chat Fuselage
* GitHub
* modern productivity software

## DO

* DO use mostly black, white, and neutral grays.
* DO use one or two accent colors when useful.
* DO prioritize hierarchy and readability.
* DO use subtle borders.
* DO use restrained visual effects.
* DO make interfaces feel like serious software products.
* DO follow the project's brand identity.

## DO NOT

* DO NOT create generic "startup template" aesthetics.
* DO NOT overuse rounded corners.
* DO NOT overuse shadows.
* DO NOT overuse gradients.
* DO NOT use excessive icons.
* DO NOT add unnecessary animations.
* DO NOT use oversized typography.
* DO NOT create excessive whitespace.
* DO NOT create noisy dashboards.
* DO NOT add decorative elements without functional value.

---

# 24. Database — PostgreSQL + Neon + Drizzle

Use PostgreSQL hosted on Neon.

Use Drizzle ORM.

## DO

* DO perform database operations through Drizzle.
* DO perform application database operations in Services.
* DO use foreign keys where appropriate.
* DO use unique constraints where appropriate.
* DO use indexes where appropriate.
* DO enforce database integrity where practical.
* DO scope organization-owned queries by `organizationId`.
* DO optimize indexes based on real query patterns.

## DO NOT

* DO NOT access the database directly from React components.
* DO NOT access the database directly from generic UI components.
* DO NOT put complex database logic in Controllers.
* DO NOT create a Repository layer automatically.
* DO NOT create abstractions around Drizzle without a concrete benefit.
* DO NOT create speculative indexes.

---

# 25. External APIs

External providers must be isolated.

Providers include:

* Stripe
* AbacatePay
* Resend
* Himetrica
* Better Auth

## DO

* DO encapsulate provider-specific implementations.
* DO expose application-level operations to Services.
* DO keep secrets server-side.
* DO make provider replacement possible without rewriting the entire application.

## DO NOT

* DO NOT scatter SDK calls throughout the application.
* DO NOT expose provider credentials to clients.
* DO NOT couple unrelated business logic directly to provider-specific APIs.

---

# 26. Email — Resend

Use Resend for transactional email.

## DO

* DO send email server-side.
* DO encapsulate Resend integration.
* DO keep email templates organized.
* DO use Services for business operations that trigger email.
* DO keep API keys in environment variables.

## DO NOT

* DO NOT send emails directly from React components.
* DO NOT expose Resend credentials.
* DO NOT scatter Resend API calls throughout the application.

---

# 27. Analytics — Himetrica

Use Himetrica for product analytics.

## DO

* DO track meaningful product events.
* DO keep analytics implementation isolated.
* DO fail gracefully when analytics is unavailable.
* DO avoid coupling core business operations to analytics availability.
* DO avoid sending secrets or sensitive internal data.

## DO NOT

* DO NOT make critical operations depend on analytics succeeding.
* DO NOT indiscriminately track every possible event.
* DO NOT send secrets to analytics.
* DO NOT put analytics provider-specific logic throughout business code.

---

# 28. Deployment — Vercel

Use Vercel as the primary deployment platform.

## DO

* DO keep applications compatible with Vercel.
* DO use environment variables for configuration and secrets.
* DO keep deployment configuration explicit.
* DO design server-side operations according to Vercel's execution model.

## DO NOT

* DO NOT commit secrets.
* DO NOT depend on persistent local server state.
* DO NOT introduce infrastructure requirements without a concrete reason.

---

# 29. Testing — Vitest

Use Vitest for automated tests.

## DO

Prioritize tests for:

* Services
* business rules
* authorization
* tenant isolation
* billing rules
* validation
* critical utilities

Explicitly test:

```text
Organization A cannot access Organization B data.

A user cannot update another organization's resource.

A client-provided organizationId cannot bypass tenant isolation.

A user without the required plan cannot execute a protected operation.

An expired or invalid subscription cannot access protected functionality.

Invalid input is rejected.

Invalid webhook events are rejected.
```

## DO NOT

* DO NOT write tests only to increase coverage numbers.
* DO NOT test implementation details unnecessarily.
* DO NOT ignore security-critical business rules.
* DO NOT rely exclusively on frontend tests for authorization.

---

# 30. Dependency Management

## DO

Before adding a dependency:

1. DO check whether Next.js already provides the functionality.
2. DO check whether React already provides the functionality.
3. DO check whether Mantine already provides the functionality.
4. DO check whether an existing dependency already solves the problem.
5. DO prefer mature open-source alternatives.
6. DO prefer dependencies with a clear and limited responsibility.
7. DO consider maintenance and licensing.
8. DO consider whether the dependency creates unnecessary vendor lock-in.

## DO NOT

* DO NOT add a dependency for trivial functionality.
* DO NOT introduce duplicate libraries.
* DO NOT add dependencies merely for convenience when a simple implementation is sufficient.
* DO NOT add large libraries to solve tiny problems.
* DO NOT introduce vendor lock-in without a concrete benefit.

---

# 31. Open Source

## DO

* DO prefer mature, actively maintained open-source software.
* DO prefer permissive licenses when appropriate.
* DO evaluate project activity and maintenance.
* DO reuse existing open-source solutions when they provide real value.

## DO NOT

* DO NOT introduce proprietary dependencies when an adequate OSS solution already exists.
* DO NOT replace a good existing dependency simply because another OSS alternative exists.
* DO NOT pursue OSS purity at the expense of practicality.

The goal is a maintainable SaaS foundation, not ideological purity.

---

# 32. Security

Security is mandatory.

## DO

* DO authenticate server-side.
* DO authorize server-side.
* DO validate input with Zod.
* DO enforce tenant isolation.
* DO derive organization identity from the trusted session.
* DO enforce billing restrictions server-side.
* DO verify payment webhooks.
* DO protect secrets.
* DO validate external input.
* DO use safe error messages.
* DO test security-critical behavior.

## DO NOT

* DO NOT trust the frontend.
* DO NOT trust client-provided organization IDs.
* DO NOT trust client-provided permissions.
* DO NOT trust client-provided payment status.
* DO NOT expose secrets.
* DO NOT expose stack traces or internal errors.
* DO NOT rely on UI restrictions for security.

---

# 33. Code Quality

## DO

* DO use clear names.
* DO keep functions reasonably small.
* DO use explicit control flow.
* DO prefer simple code.
* DO use strong TypeScript types.
* DO reuse code when reuse is real.
* DO keep modules focused.
* DO write boring, predictable code.
* DO make the code understandable to another developer six months later.

## DO NOT

* DO NOT write clever code when simple code works.
* DO NOT create giant components.
* DO NOT create giant utility modules.
* DO NOT create deep abstraction chains.
* DO NOT use inheritance unnecessarily.
* DO NOT create generic frameworks inside the application.
* DO NOT duplicate business rules.

---

# 34. Architectural Decision Priority

When choosing between possible implementations, use this priority:

1. **KISS**
2. **Security**
3. **Existing project conventions**
4. **Existing technology stack**
5. **Open Source**
6. **Maintainability**
7. **Developer Experience**
8. **Performance optimization when justified**

## DO

* DO choose the simplest secure solution.
* DO reuse existing infrastructure.
* DO consider long-term maintainability.
* DO optimize only when there is a justified performance requirement.

## DO NOT

* DO NOT sacrifice security for simplicity.
* DO NOT sacrifice maintainability for short-term convenience.
* DO NOT optimize prematurely.
* DO NOT introduce architecture merely to demonstrate technical sophistication.

---

# 35. Golden Rules

## DO

* DO keep the architecture simple.
* DO use Mantine for UI.
* DO use Next.js App Router.
* DO prefer Server Components.
* DO use Drizzle with PostgreSQL.
* DO use Zod for validation.
* DO use Better Auth for authentication.
* DO use Stripe and AbacatePay for payments.
* DO isolate payment providers behind billing infrastructure.
* DO use Resend for transactional email.
* DO use Himetrica for analytics.
* DO use Vitest for testing.
* DO keep Controllers thin.
* DO put business logic in Services.
* DO keep data definitions in Models.
* DO keep infrastructure in `lib/`.
* DO tenant-scope every organization-owned entity.
* DO derive organization ownership from the trusted session.
* DO enforce authorization server-side.
* DO enforce billing server-side.
* DO validate all untrusted input.
* DO prefer mature open-source software.
* DO avoid unnecessary vendor lock-in.
* DO introduce complexity only when justified.

## DO NOT

* DO NOT use shadcn/ui.
* DO NOT use another UI component library.
* DO NOT use raw Tailwind utility classes for UI.
* DO NOT put business logic in Controllers.
* DO NOT put business logic in React components.
* DO NOT put database operations directly in UI components.
* DO NOT trust client-provided organization IDs.
* DO NOT trust client-provided permissions.
* DO NOT rely on frontend billing checks.
* DO NOT put billing logic in webhook handlers.
* DO NOT scatter Stripe or AbacatePay calls throughout the application.
* DO NOT expose provider credentials.
* DO NOT create unnecessary repositories.
* DO NOT create unnecessary abstractions.
* DO NOT create packages prematurely.
* DO NOT add dependencies without justification.
* DO NOT optimize prematurely.
* DO NOT over-engineer.

---

# 36. Final Objective

This repository is a **SaaS factory**.

Its architecture exists to make the next SaaS easier to build.

Every technical decision should be evaluated against this objective:

```text
Simple
   ↓
Secure
   ↓
Reusable
   ↓
Maintainable
   ↓
Fast to build
```

The goal is not architectural sophistication.

The goal is a **small, secure, reusable foundation capable of repeatedly producing real SaaS products quickly.**
