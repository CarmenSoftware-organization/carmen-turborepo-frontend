# NEXT.JS APP ROUTER & VERCEL BEST PRACTICES

You are an expert Next.js developer. You must strictly follow these rules when auditing, refactoring, or writing code.

## 1. RSC Boundaries & Component Architecture (from rsc-boundaries)

- **Default to Server Components:** All components are Server Components by default. Only add `"use client"` when absolutely necessary.
- **Client Component Criteria:** Use `"use client"` ONLY when:
  - Using interactive hooks (`useState`, `useEffect`, `useReducer`).
  - Using event listeners (`onClick`, `onChange`).
  - Using browser-only APIs (`window`, `document`, `localStorage`).
- **Pattern:** Push Client Components down the tree (Leaf nodes). Keep layouts and pages as Server Components.
- **Prop Passing:** Pass serializable data (JSON) from Server to Client components. Pass Server Components as `children` or props to Client Components to avoid "waterfalls" and bundle bloat.

## 2. Data Patterns (from data-patterns)

- **Fetching:** Fetch data directly in Server Components using `await`. Do NOT use `useEffect` or client-side fetching libraries (like SWR/TanStack Query) unless specifically needed for real-time updates.
- **Mutations:** Use **Server Actions** (`"use server"`) for all data mutations. Do NOT use API Routes (`app/api/...`) for internal app mutations.
- **DB Access:** Call the database/ORM directly in Server Components or Server Actions.
- **Waterfalls:** Avoid sequential fetching. Use `Promise.all` for parallel data fetching where possible.

## 3. File Conventions & Structure (from file-conventions)

- **Colocation:** Keep related files (components, styles, tests) grouped together inside feature folders within `app/`.
- **Special Files:** Use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` effectively.
- **Route Groups:** Use parenthesis folders e.g., `(dashboard)` or `(marketing)` to organize routes without affecting the URL path.
- **Filenames:** Use `kebab-case` for folders/URLs and `PascalCase` for Component files.

## 4. Coding Standards

- **Images:** ALWAYS use `next/image` with proper sizing. Never use `<img>`.
- **Links:** ALWAYS use `next/link`. Never use `<a>` tags for internal navigation.
- **TypeScript:** Use strict types. Avoid `any`.
- **UI Library:** (ถ้าคุณใช้ Shadcn หรือ Tailwind ให้ระบุตรงนี้ เช่น "Use Shadcn UI components and Tailwind CSS for styling.")

## IMPORTANT: WHAT TO AVOID

- ❌ **AVOID:** Fetching data in Client Components using `fetch()` inside `useEffect`.
- ❌ **AVOID:** Using API Routes for internal backend logic (Use Server Actions instead).
- ❌ **AVOID:** Importing Server Code (DB connection, Secrets) into Client Components.
