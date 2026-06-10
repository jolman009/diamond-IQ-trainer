# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Diamond IQ is an adaptive baseball/softball situational awareness trainer. Players practice decision-making through scenario drills powered by SM-2 spaced repetition. The app is offline-first with optional Supabase cloud sync.

## Commands

```bash
pnpm dev          # Start dev server on localhost:3000
pnpm build        # Type-check (tsc) then build with Vite
pnpm type-check   # TypeScript type checking only (tsc --noEmit)
pnpm lint         # ESLint for .ts/.tsx files
pnpm lint:fix     # ESLint with auto-fix
pnpm format       # Prettier formatting

# Tests
npx jest                                    # Run all tests
npx jest src/utils/__tests__/drillEngine.test.ts  # Run a single test file
```

## Architecture

### Routing & Layout

`App.tsx` defines all routes inside `BrowserRouter > AuthProvider > Routes`. Three route types:
- **Public**: `/welcome`, `/login`, `/preview` — no auth required, no sidebar
- **Onboarding**: `/onboarding` — protected but skips onboarding-complete check
- **Protected with Layout**: `/`, `/drill`, `/progress`, `/leaderboard`, `/teams` — wrapped in `ProtectedRoute > Layout` (sidebar + nav)

`ProtectedRoute` checks auth state from `AuthContext`, redirects unauthenticated users to `/welcome`, and redirects users who haven't completed onboarding to `/onboarding`.

### State Management

No global state library. State lives in:
- **AuthContext** (`contexts/AuthContext.tsx`) — user auth, profile, Supabase session. Falls back to localStorage demo mode when Supabase is not configured.
- **Page-level useState** — each page manages its own drill session, filters, etc.
- **localStorage** — filter preferences (`filterPersistence.ts`), session data (`sessionPersistence.ts`)
- **syncService** (singleton) — debounced (2s) sync between localStorage and Supabase. Queues progress updates and batch-saves. Emits sync status to UI.

### Offline-First Data Flow

```
User action → local state update → localStorage save → debounced Supabase sync
```

All features work without Supabase. Services gracefully degrade when env vars are missing.

### Core Domain Logic

- **drillEngine.ts** — scenario selection: picks due scenarios first (sorted by lowest correctness rate, then fewest repetitions), falls back to the soonest-due scenario.
- **leitnerAlgorithm.ts** — SM-2 spaced repetition: maps answer quality (best/ok/bad/timeout) to quality scores, adjusts interval and ease factor (1.3–2.5).
- **starterDataset.ts** — 50+ curated `ScenarioV2` objects validated by Zod schemas at app startup.

### Service Layer

Services in `src/services/` abstract all Supabase operations:
- `sessionService` — drill session CRUD, progress save/batch-save
- `profileService` — user profile CRUD, onboarding completion
- `syncService` — offline-first sync orchestration (singleton)
- `leaderboardService` — materialized view refresh (cloud-only)
- `teamService` — team management (premium feature)

### Type System

Domain types live in `src/types/` with Zod schemas for runtime validation. Key types: `ScenarioV2` (drill scenario with question + 3 answer tiers), `ScenarioProgress` (SM-2 tracking per scenario), `DrillSession` (progress map + best streak), `ScenarioFilter`.

## Path Aliases

Configured in both `tsconfig.json` and `vite.config.ts`:
- `@/` → `src/`
- `@components/`, `@hooks/`, `@utils/`, `@types/`, `@theme/`, `@data/`

## Styling

Hybrid approach: MUI components with Material Design 3 dark theme (`theme/m3Theme.ts`) plus Tailwind CSS utilities. Glass morphism effects and mobile-first responsive design.

## TypeScript

Strict mode with all strict checks enabled plus `noUncheckedIndexedAccess` and `noPropertyAccessFromIndexSignature`. Unused variables/params are errors (prefix with `_` to suppress). No `any` allowed (`@typescript-eslint/no-explicit-any: error`).

## Environment Variables

Optional — app works fully offline without them:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database

SQL schemas in repo root: `supabase-schema.sql` (core tables), `supabase-schema-roles.sql` (RLS policies), `supabase-schema-teams.sql` (team feature).

## Deployment

- **Hosting**: Vercel (project: `diamond-ai-performance`, team: `joel-guzmans-projects-f8aa100e`)
- **Domains**: `diamond-ai-performance.vercel.app`
- **Supabase env vars** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) must be set in both `.env.local` (local) and Vercel project settings (production)
- Pushes to `main` trigger Vercel auto-deploy

## Session Log

### 2026-06-10: Supabase project rebuild
- Original Supabase project `Diamond-IQ-Trainer` (id: `ppmcemxesjmxclvicile`, us-west-2) was paused >90 days and could not be restored (backup retrieval failed).
- Created new project `Diamond-IQ-Trainer-v2` (id: `jvxjfsqufiicclyeokms`, us-west-1).
- Applied all 3 SQL schemas in order: `supabase-schema.sql` → `supabase-schema-roles.sql` → `supabase-schema-teams.sql`.
- Created `.env.local` with new credentials.
- Updated Vercel env vars and redeployed.
- Old project `ppmcemxesjmxclvicile` still exists as INACTIVE and can be deleted from the Supabase dashboard.
- Also in this session: ran `pnpm install` (node_modules were missing), created `CLAUDE.md`.
