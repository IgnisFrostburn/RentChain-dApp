# App Router Best Practices

The App Router uses React Server Components (RSC) by default. Mixing Client and Server components correctly is key.

## Server vs. Client Components

- **Server Components**: Default. Use for data fetching, secrets, and large dependencies.
- **Client Components**: Use `"use client"`. Use for interactivity (`useState`, `useEffect`), browser APIs, and event listeners.

### The Leaf Pattern
Keep Client Components at the "leaves" of your component tree to maximize Server Component benefits.

## Data Fetching

### 1. No local API calls
**Problem**: Calling `fetch('/api/data')` inside a Server Component.
**Fix**: Call the logic (database query) directly.

```tsx
// ❌ Bad (Server Component)
const res = await fetch('http://localhost:3000/api/posts');

// ✅ Good (Server Component)
const posts = await db.post.findMany();
```

### 2. Double Fetching (Deduping)
React automatically dedupes `fetch` calls across the component tree. For non-fetch libraries (Prisma, Axios), use React `cache`.

```tsx
import { cache } from 'react';
export const getPost = cache(async (id: string) => {
  return await db.post.findUnique({ where: { id } });
});
```

## Route Handlers
Route handlers should handle external requests (webhooks, mobile apps). For internal page data, prefer Server Components.

## Error Handling
Use `error.tsx` for runtime errors and `loading.tsx` for suspense boundaries. Avoid `try/catch` around `redirect()` in Server Components.

```tsx
// ❌ Bad
try {
  redirect('/login');
} catch (e) {
  // redirect throws an error, so this catch block prevents the redirect
}
```
