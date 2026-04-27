# Use Reactive Breakpoints

A React utility hook for tracking viewport width changes. It monitors current breakpoint and strictly matches [Tailwind CSS v4's default breakpoint](https://tailwindcss.com/docs/responsive-design#overview).

Under the hood, it leverages `useSyncExternalStore` for SSR safety and maximum performance with no unnecessary re-renders.

## Installation

```bash
npm install use-reactive-breakpoint
# or
yarn add use-reactive-breakpoint
# or
pnpm add use-reactive-breakpoint
```

## Usage

```tsx
import { useBreakpoint } from "use-reactive-breakpoint";

function App() {
  const breakpoint = useBreakpoint();

  return (
    <div>
      {/* Conditionally render components based on viewport width */}
      {breakpoint.sm && <p>Screen is at least 640px wide.</p>}
      {breakpoint.md && <p>Screen is at least 768px wide.</p>}
      {breakpoint.lg && <p>Screen is at least 1024px wide.</p>}

      {/* Output current matches state */}
      <pre>{JSON.stringify(breakpoint, null, 2)}</pre>
    </div>
  );
}

export default App;
```

## breakpoint

This hook provides boolean flags corresponding to the following minimum viewport widths (matching Tailwind CSS defaults):

| Breakpoint | Minimum Width | CSS Media Query              |
| :--------- | :------------ | :--------------------------- |
| `sm`       | 640px         | `@media (min-width: 640px)`  |
| `md`       | 768px         | `@media (min-width: 768px)`  |
| `lg`       | 1024px        | `@media (min-width: 1024px)` |
| `xl`       | 1280px        | `@media (min-width: 1280px)` |
| `2xl`      | 1536px        | `@media (min-width: 1536px)` |

_Note: The object returned defaults to `false` for all breakpoint on the server (SSR)._

## API Reference

### `useBreakpoint()`

Returns an object of type `breakpoint`:

```ts
type breakpoint = {
  sm: boolean; /** matches width >= 640px */
  md: boolean; /** matches width >= 768px */
  lg: boolean; /** matches width >= 1024px */
  xl: boolean; /** matches width >= 1280px */
  "2xl": boolean; /** matches width >= 1536px */
};
```

## License

Licensed under the [ISC License](https://github.com/hossam7amdy/reacthub/blob/main/LICENSE).
