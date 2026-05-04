# [ADR] Frontend Tech Stack and Architecture Decision Record

## 1. Framework & Language

- **Technology**: Next.js 16 (App Router) · React 19 · TypeScript 5.9
- **Reason**:
  - Automatic optimization (Memoization) via React Compiler
  - Enhanced Developer Experience (DX) and runtime performance
  - Efficient data fetching centered on React Server Components (RSC)
  - [Optional] Flexible adoption of `next/cache` based on data invalidation requirements

## 2. Package Manager

- **Technology**: pnpm
- **Reason**:
  - Utilization of global store and hard links
  - Disk space savings and overwhelmingly fast installation speed
  - Strict symlink structure
  - Prevention of phantom dependencies and ensuring project stability

## 3. Architecture

- **Technology**: Feature-Sliced Design (FSD)
- **Reason**:
  - Separation of concerns: `app/` (pure routing) vs. `src/` (business logic)
  - Increased cohesion by domain (Feature)
  - Maximized code reusability and maintainability
  - Reduced context-switching cognitive load compared to flat structures (Optimized LLM token usage for identical feature development)

## 4. Styling

- **Technology**: Tailwind CSS v4
- **Reason**:
  - Fundamental elimination of Hydration issues in SSR environments
  - Elimination of class naming fatigue via Utility-first approach
  - Reduced overhead in managing common styles
  - Increased focus on business logic development rather than styling

## 5. State & Data Management

- **Technology**: Zustand · TanStack React Query · React Hook Form + Zod
- **Reason**:
  - Zustand: Lightweight client state management with minimal boilerplate
  - React Query: Server state synchronization and caching optimization
  - RHF + Zod: Render-optimized form handling and stable schema validation

## 6. Authentication

- **Technology**: NextAuth.js
- **Reason**:
  - Optimized integration with the Next.js ecosystem
  - [Optional] Simplification of complex authentication logic if OAuth is adopted
  - [Optional] If OAuth is not used, exclude library in favor of lightweight custom cookie handling logic

## 7. Build System

- **Technology**: Turbopack
- **Reason**:
  - Ultra-fast bundling based on Rust
  - Overwhelmingly fast Hot Module Replacement (HMR) optimized for Next.js
  - Maximized initial dev server startup speed and productivity

## 8. Testing

- **Technology**: Vitest · Testing Library · Playwright
- **Reason**:
  - Dual-layer testing strategy (Unit/Integration vs. E2E)
  - Vitest: Lightweight, fast-executing module/component testing
  - Playwright: Browser-based user scenario (E2E) validation and securing core service flow stability

## 9. Development Environment

- **Technology**: ESLint · Prettier · Husky · Commitlint · Steiger
- **Reason**:
  - ESLint / Prettier: Maintenance of consistent code conventions and formatting
  - Husky / Commitlint: Enforcement of commit message rules and quality control via Git hooks
  - Steiger: FSD architectural rule validation and structural stability assurance
