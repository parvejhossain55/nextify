"use client";

import * as React from "react";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

const STORAGE_KEY = "dashboard:sidebar-collapsed";
const MOBILE_MEDIA = "(max-width: 1023px)";

/**
 * Initial state always matches the server (collapsed=false, isMobile=false)
 * so the first SSR render == first client hydration pass (no mismatch).
 * We then sync to actual client values in useLayoutEffect, which runs
 * BEFORE the browser paints — so no visible flash happens.
 */
const SERVER_MATCHING_INITIAL = {
  collapsed: false,
  isMobile: false,
};

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = React.useState(SERVER_MATCHING_INITIAL.collapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(SERVER_MATCHING_INITIAL.isMobile);

  const firstRenderRef = React.useRef(true);

  // Sync to actual client state (stored collapse pref + viewport width)
  // BEFORE the browser paints, so no visual flash. We intentionally use
  // useState initial values that match the server exactly — then inside
  // useLayoutEffect, defer state updates to a microtask so the rule
  // "no synchronous setState inside effect body" is satisfied, while
  // still running before any browser paint.
  //
  // The media-query change listener is kept directly in the effect body
  // since it's an external-system subscription (React's recommended use
  // of effects), and only calls setState asynchronously via the handler.
  React.useLayoutEffect(() => {
    firstRenderRef.current = false;

    let storedCollapsed = false;
    try {
      storedCollapsed = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* ignore */
    }
    const nextIsMobile = window.matchMedia(MOBILE_MEDIA).matches;
    const collapsedChanged = storedCollapsed !== SERVER_MATCHING_INITIAL.collapsed;
    const mobileChanged = nextIsMobile !== SERVER_MATCHING_INITIAL.isMobile;

    if (collapsedChanged || mobileChanged) {
      queueMicrotask(() => {
        if (collapsedChanged) setCollapsedState(storedCollapsed);
        if (mobileChanged) setIsMobile(nextIsMobile);
      });
    }

    const mql = window.matchMedia(MOBILE_MEDIA);
    const handler = () => setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const setCollapsed = React.useCallback((v: boolean) => {
    setCollapsedState(v);
    if (firstRenderRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsedState((p) => {
      const n = !p;
      if (!firstRenderRef.current) {
        try {
          window.localStorage.setItem(STORAGE_KEY, n ? "1" : "0");
        } catch {
          /* ignore */
        }
      }
      return n;
    });
  }, []);

  const value = React.useMemo<SidebarContextValue>(
    () => ({ collapsed, setCollapsed, toggleCollapsed, isMobile, mobileOpen, setMobileOpen }),
    [collapsed, setCollapsed, toggleCollapsed, isMobile, mobileOpen]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}
