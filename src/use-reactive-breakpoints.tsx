import { useSyncExternalStore } from "react";

// Match tailwind's v4 default breakpoints https://tailwindcss.com/docs/responsive-design#overview
const breakpoints = {
  xs: "(max-width: 639px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

export type Breakpoints = {
  /** width < 640px */
  xs: boolean;
  /** width >= 640px */
  sm: boolean;
  /** width >= 768px */
  md: boolean;
  /** width >= 1024px */
  lg: boolean;
  /** width >= 1280px */
  xl: boolean;
  /** width >= 1536px */
  "2xl": boolean;
};

const SERVER_SNAPSHOT: Breakpoints = {
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  "2xl": false,
};

// https://react.dev/reference/react/useSyncExternalStore#im-getting-an-error-the-result-of-getsnapshot-should-be-cached
let cachedSnapshot: Breakpoints = SERVER_SNAPSHOT;

function subscribe(callback: () => void) {
  const mqls = Object.values(breakpoints).map((query) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return mql;
  });
  return () =>
    mqls.forEach((mql) => mql.removeEventListener("change", callback));
}

function getSnapshot(): Breakpoints {
  const next = {} as Breakpoints;
  for (const [key, query] of Object.entries(breakpoints)) {
    next[key as keyof Breakpoints] = window.matchMedia(query).matches;
  }

  const keys = Object.keys(next) as (keyof Breakpoints)[];
  const changed = keys.some((key) => cachedSnapshot[key] !== next[key]);
  if (!changed) return cachedSnapshot;

  cachedSnapshot = next;
  return cachedSnapshot;
}

export function useReactiveBreakpoints(): Breakpoints {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
