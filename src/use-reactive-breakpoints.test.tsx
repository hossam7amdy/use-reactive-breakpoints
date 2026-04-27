import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useReactiveBreakpoints } from "./use-reactive-breakpoints";

function mockMatchMedia(width: number) {
  return (query: string): MediaQueryList => {
    const match = query.match(/\(min-width:\s*(\d+)px\)/);
    const matches = match ? width >= parseInt(match[1]!, 10) : false;
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  };
}

describe("useReactiveBreakpoints", () => {
  it("returns all false when viewport is 0px", () => {
    window.matchMedia = mockMatchMedia(0);
    const { result } = renderHook(() => useReactiveBreakpoints());
    expect(result.current).toEqual({
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      "2xl": false,
    });
  });

  it("returns sm: true when viewport is exactly 640px", () => {
    window.matchMedia = mockMatchMedia(640);
    const { result } = renderHook(() => useReactiveBreakpoints());
    expect(result.current).toEqual({
      xs: false,
      sm: true,
      md: false,
      lg: false,
      xl: false,
      "2xl": false,
    });
  });

  it("returns sm, md, lg true when viewport is 1024px", () => {
    window.matchMedia = mockMatchMedia(1024);
    const { result } = renderHook(() => useReactiveBreakpoints());
    expect(result.current).toEqual({
      xs: false,
      sm: true,
      md: true,
      lg: true,
      xl: false,
      "2xl": false,
    });
  });

  it("returns all true when viewport is 1536px", () => {
    window.matchMedia = mockMatchMedia(1536);
    const { result } = renderHook(() => useReactiveBreakpoints());
    expect(result.current).toEqual({
      xs: false,
      sm: true,
      md: true,
      lg: true,
      xl: true,
      "2xl": true,
    });
  });

  it("reacts when a single breakpoint change event fires", async () => {
    const callbacks: (() => void)[] = [];
    let currentWidth = 500;

    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      const match = query.match(/\(min-width:\s*(\d+)px\)/);
      return {
        get matches() {
          return match ? currentWidth >= parseInt(match[1]!, 10) : false;
        },
        media: query,
        onchange: null,
        addEventListener: vi.fn((_: string, cb: () => void) =>
          callbacks.push(cb),
        ),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as MediaQueryList;
    });

    const { result } = renderHook(() => useReactiveBreakpoints());
    expect(result.current.sm).toBe(false);

    currentWidth = 640;
    await act(async () => {
      callbacks.forEach((cb) => cb());
    });

    expect(result.current).toEqual({
      xs: false,
      sm: true,
      md: false,
      lg: false,
      xl: false,
      "2xl": false,
    });
  });

  it("updates consistently when multiple breakpoint change simultaneously", async () => {
    const callbacks: (() => void)[] = [];
    let currentWidth = 500;

    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      const match = query.match(/\(min-width:\s*(\d+)px\)/);
      return {
        get matches() {
          return match ? currentWidth >= parseInt(match[1]!, 10) : false;
        },
        media: query,
        onchange: null,
        addEventListener: vi.fn((_: string, cb: () => void) =>
          callbacks.push(cb),
        ),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as MediaQueryList;
    });

    const { result } = renderHook(() => useReactiveBreakpoints());
    expect(result.current.sm).toBe(false);
    expect(result.current.md).toBe(false);
    expect(result.current.lg).toBe(false);

    // Jump 500px → 1024px: crosses sm (640), md (768), lg (1024) at once.
    currentWidth = 1024;
    await act(async () => {
      callbacks.forEach((cb) => cb());
    });

    expect(result.current).toEqual({
      xs: false,
      sm: true,
      md: true,
      lg: true,
      xl: false,
      "2xl": false,
    });
  });

  it("removes all 5 event listeners on unmount", () => {
    const removeEventListener = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
      dispatchEvent: vi.fn(),
    });
    const { unmount } = renderHook(() => useReactiveBreakpoints());
    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(6);
  });
});
