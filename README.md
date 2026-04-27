# Use Reactive Breakpoints

A React utility hook for tracking viewport width changes. It monitors current breakpoint and strictly matches [Tailwind CSS v4's default breakpoint](https://tailwindcss.com/docs/responsive-design#overview).

Under the hood, it leverages `useSyncExternalStore` for SSR safety and maximum performance with no unnecessary re-renders.

## Installation

```bash
npm install use-reactive-breakpoints
# or
yarn add use-reactive-breakpoints
# or
pnpm add use-reactive-breakpoints
```

## Usage

```tsx
import { useReactiveBreakpoints } from "use-reactive-breakpoints";

function App() {
  const breakpoint = useReactiveBreakpoints();

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

## Breakpoints

This hook provides boolean flags corresponding to the following viewport widths (matching Tailwind CSS defaults):

| Breakpoint | Width Range | CSS Media Query              |
| :--------- | :---------- | :--------------------------- |
| `xs`       | < 640px     | `@media (max-width: 639px)`  |
| `sm`       | >= 640px    | `@media (min-width: 640px)`  |
| `md`       | >= 768px    | `@media (min-width: 768px)`  |
| `lg`       | >= 1024px   | `@media (min-width: 1024px)` |
| `xl`       | >= 1280px   | `@media (min-width: 1280px)` |
| `2xl`      | >= 1536px   | `@media (min-width: 1536px)` |

_Note: On the server (SSR), the hook returns a mobile-first snapshot — `xs: true` and all other breakpoints `false`._

## API Reference

### `useReactiveBreakpoints()`

Returns an object of type `Breakpoints`:

```ts
type Breakpoints = {
  xs: boolean; /** width < 640px */
  sm: boolean; /** width >= 640px */
  md: boolean; /** width >= 768px */
  lg: boolean; /** width >= 1024px */
  xl: boolean; /** width >= 1280px */
  "2xl": boolean; /** width >= 1536px */
};
```

## License

Licensed under the [ISC License](https://github.com/hossam7amdy/reacthub/blob/main/LICENSE).
