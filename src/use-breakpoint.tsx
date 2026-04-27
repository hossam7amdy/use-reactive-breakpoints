import { useSyncExternalStore } from "react";

// Match tailwind's v4 default breakpoint https://tailwindcss.com/docs/responsive-design#overview
const breakpoint = {
  xs: "(max-width: 639px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

export type breakpoint = {
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

const SERVER_SNAPSHOT: breakpoint = {
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  "2xl": false,
};

// https://react.dev/reference/react/useSyncExternalStore#im-getting-an-error-the-result-of-getsnapshot-should-be-cached
let cachedSnapshot: breakpoint = SERVER_SNAPSHOT;

function subscribe(callback: () => void) {
  const mqls = Object.values(breakpoint).map((query) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return mql;
  });
  return () =>
    mqls.forEach((mql) => mql.removeEventListener("change", callback));
}

function getSnapshot(): breakpoint {
  const next = {} as breakpoint;
  for (const [key, query] of Object.entries(breakpoint)) {
    next[key as keyof breakpoint] = window.matchMedia(query).matches;
  }

  const keys = Object.keys(next) as (keyof breakpoint)[];
  const changed = keys.some((key) => cachedSnapshot[key] !== next[key]);
  if (!changed) return cachedSnapshot;

  cachedSnapshot = next;
  return cachedSnapshot;
}

export function useBreakpoint(): breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
