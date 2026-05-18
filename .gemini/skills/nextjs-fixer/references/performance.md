# Performance & Optimization

## Suspense & Streaming
- Wrap individual slow components in `<Suspense>` rather than the whole page.
- Use `loading.tsx` for page-level transitions.

## Image Optimization
- Use `next/image` for automatic resizing and format conversion.
- Always provide `width` and `height` (or `fill`) to prevent Cumulative Layout Shift (CLS).
- For hero images, add `priority`.

## Middleware
- Avoid heavy logic in Middleware as it runs for every request.
- Use the `matcher` to exclude static assets.

```ts
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Font Optimization
Use `next/font/google` or `next/font/local`. It automatically optimizes fonts and removes external network requests for better privacy and performance.
