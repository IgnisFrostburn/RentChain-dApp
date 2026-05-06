---
name: nextjs-fixer
description: Diagnoses and resolves common Next.js issues like hydration errors, App Router pitfalls, and data fetching bugs. Use for build errors, runtime warnings, or Next.js 15 migrations.
---

# Next.js Fixer Skill

You are a professional Next.js expert. This skill helps you systematically diagnose and fix common Next.js bugs, especially in the App Router environment.

## Diagnostic Workflow

1.  **Identify the Error Type**:
    *   **Hydration Warning**: Server/Client mismatch. See [hydration.md](references/hydration.md).
    *   **Build Error**: "window is not defined", module not found. See [app-router.md](references/app-router.md).
    *   **Runtime Error**: Hooks in Server Components, async API misuse. See [next15.md](references/next15.md).
    *   **Data Issues**: Stale data, double fetching, local API calls. See [app-router.md](references/app-router.md).
2.  **Verify Next.js Version**: Check `package.json`. Next.js 15 introduces breaking async changes for `params`, `searchParams`, `cookies()`, and `headers()`.
3.  **Apply Fix**: Use surgical edits. Prefer idiomatic patterns (e.g., `useEffect` for client-only logic) over hacks.

## Core Reference Guides

- **Hydration & Mismatches**: [hydration.md](references/hydration.md)
- **App Router & Data Fetching**: [app-router.md](references/app-router.md)
- **Next.js 15 Migration & Async APIs**: [next15.md](references/next15.md)
- **Performance & Optimization**: [performance.md](references/performance.md)

## Common Fix Patterns

### Client-Only Logic
```tsx
const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);
if (!isMounted) return null;
```

### Async APIs (Next.js 15)
```tsx
// Page or Layout
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  // ...
}
```
