## Project Guidelines for GitHub Copilot

### 1. Core Principles

- **Native APIs first**: favor Nuxt/Nitro or vanilla JS features; fall back to Nuxt modules only if needed.
- **Strict TypeScript**: always annotate types; refer to `./.github/docs/typescript` when in doubt.
- **Functional & declarative**: pure functions, composition, immutability.

### 2. Tech Stack & Patterns

- **Nuxt 3 + TypeScript**

  - `defineNuxtConfig`, `runtimeConfig` (.env)
  - Auto-import components/composables
  - avoid using watch function because it's in prone of side effects.
  - Use useAsyncData function to retrieve data with supabase api

- **UI**: Tailwind CSS + shadcn/ui

  - Prioritize using shadcn/ui components, but not mandatory
  - Use shadcn/ui for forms alongside VeeValidate + Zod

- **Backend**: Nitro API routes

  - Refer to `./.github/docs/nuxt/nitro` for examples

- **Database**: Supabase

  - Use generated types: `const client = useSupabaseClient<Database>()`;
  - Query results typed: `const posts: Tables<'posts'>[]`
  - See `./.github/docs/nuxt/modules/supabase`

- **State**: Pinia (when >3 component hops) or event bus for light coordination
- **Forms**: VeeValidate + Zod (`useForm` + `toTypedSchema(zod)`)

  - Docs: `./.github/docs/nuxt/modules/vee-validate`, `./.github/docs/zod`

- **Payments**: Stripe

  - Docs: `./.github/docs/nuxt/modules/nuxt-stripe`

- **Utilities**: VueUse, dayjs-nuxt

  - VueUse docs: `./.github/docs/vueuse`
  - Dayjs: `./.github/docs/nuxt/modules/nuxt-dayjs.md`

### 3. Component Design

- Split large Vue components into smaller “dumb” subcomponents.
- If props must pass through >3 levels, introduce a store or bus.
- Keep UI layers declarative and stateless.

### 4. API & Validation

- RESTful Nitro routes with strict Zod schemas
- Proper status codes and error handling
- Auth middleware where needed

### 5. Quality & Security

- Prettier + Tailwind plugin, ESLint + Husky + lint-staged
- Unit & integration tests
- Sanitize inputs, RLS policies, CORS, HTTP-only cookies
- Always code securely

### 6. Reminders

> **Prioritize readability, maintainability, and security in all code generation.**
> Never write inside `./components/ui/**` or `./.github/**` (read-only)

### 7. Response Modes

**Fast** (default):

- Minimal comments
- Skip thought explanations
- Prioritize working code

**Detail** (`#detail`):

- Full explanations and reasoning
- Thorough code comments
- Best-practice insights

**Step-by-Step** (`#step`):

- Interactive, question-driven process
- Wait for user input between steps
- Explore alternatives

_No mode tag: standard detailed response._
