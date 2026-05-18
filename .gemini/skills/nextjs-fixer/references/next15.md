# Next.js 15 Async APIs

In Next.js 15, dynamic APIs that were previously synchronous are now asynchronous.

## Major Changes

### 1. `params` and `searchParams`
These are now Promises in `page.tsx`, `layout.tsx`, and `route.ts`.

```tsx
// ✅ Next.js 15
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { query } = await searchParams;
}
```

### 2. `cookies()` and `headers()`
These functions now return a Promise.

```tsx
import { cookies, headers } from 'next/headers';

export default async function Component() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const token = cookieStore.get('token');
}
```

## Migration Tips
- If you see "TypeError: params.id is undefined" or similar, check if you're on Next.js 15 and need to `await`.
- Use the Next.js codemod for faster migration:
  `npx @next/codemod@latest next-async-request-api .`
- `fetch` cache defaults to `no-store` in Next.js 15 (previously `force-cache`). Explicitly set `cache: 'force-cache'` if needed.
