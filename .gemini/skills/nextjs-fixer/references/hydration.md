# Hydration Mismatch Fixes

Hydration errors occur when the initial HTML rendered on the server doesn't match what the React client produces on the first render.

## Common Causes & Fixes

### 1. Non-deterministic Values
**Problem**: Using `Date.now()`, `Math.random()`, or formatted dates that depend on the server's timezone.
**Fix**: Move calculation to `useEffect` or use a "mounted" state.

```tsx
// ❌ Bad
<div>{new Date().toLocaleTimeString()}</div>

// ✅ Good
const [time, setTime] = useState("");
useEffect(() => setTime(new Date().toLocaleTimeString()), []);
return <div>{time}</div>;
```

### 2. Browser-only APIs
**Problem**: Accessing `window`, `localStorage`, or `document` during the initial render.
**Fix**: Wrap in `useEffect` or a `typeof window` check.

```tsx
// ❌ Bad
const theme = localStorage.getItem("theme");

// ✅ Good
const [theme, setTheme] = useState("light");
useEffect(() => {
  setTheme(localStorage.getItem("theme") || "light");
}, []);
```

### 3. Invalid HTML Nesting
**Problem**: Browsers automatically "fix" invalid HTML (like `<div>` inside `<p>`), causing a mismatch.
**Fix**: Ensure semantic HTML.
- Don't put `<div>` or `<a>` inside `<p>`.
- Don't put `<button>` inside `<a>`.

### 4. Third-party Scripts
**Problem**: Google AdSense, Chrome Extensions, or other scripts modifying the DOM before React hydrates.
**Fix**: Use `suppressHydrationWarning` on the specific element if the mismatch is caused by an unavoidable external script.

```tsx
<body suppressHydrationWarning>
  {children}
</body>
```
