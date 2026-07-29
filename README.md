# Potodulu Photobooth

Frontend MVP for the Potodulu photobooth experience — Next.js App Router, Soft Neobrutalism design system, feature-first architecture.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui primitives (restyled) + Radix UI + CVA
- next-intl (default locale: `id`)
- TanStack Query, Zustand, nuqs
- Framer Motion, Sonner, next-themes
- ESLint, Prettier, Husky, lint-staged

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (`id` is default; English at `/en`).

## Scripts

| Script        | Description             |
| ------------- | ----------------------- |
| `pnpm dev`    | Dev server              |
| `pnpm build`  | Production build        |
| `pnpm start`  | Start production server |
| `pnpm lint`   | ESLint                  |
| `pnpm format` | Prettier write          |

## Architecture

```
app/[locale]/          # routes only — compose pages
components/
  ui/                  # design-system primitives (CVA)
  shared/              # feature-agnostic compositions
  layout/              # app layouts
  hoc/                 # providers
  page/                # page compositions
  module/              # feature modules (auth, session, …)
i18n/                  # next-intl routing + messages
libs/                  # cn, utils, constants, configs
config/ services/ stores/ types/ hooks/ assets/
```

Dependency direction: `ui` → `shared` → `module` → `page` → `app`.

## Design system

Soft Neobrutalism tokens live in `app/globals.css` (semantic colors, radius, hard shadows).

UI components expose variants via CVA:

```tsx
import { Button } from "@/components/ui/Button";

<Button variant="solid" color="primary" size="md" radius="lg" elevation="md" />;
```

Prefer props over ad-hoc `className` in pages.

## i18n

- Config: `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`
- Messages: `i18n/messages/id.json`, `i18n/messages/en.json`
- Default locale: `id` (`localePrefix: "as-needed"`)

Use `Link` / `useRouter` from `@/i18n/navigation`.

## Adding a UI component

1. Create `components/ui/Name/Name.tsx` + `index.ts`
2. Define CVA variants (`variant`, `color`, `size`, `radius`, `elevation`, …)
3. Use `cn()` from `@/libs/cn`
4. Support `forwardRef` + `className` override
