"use client";

import * as React from "react";

/* -------------------------------------------------------------------------- */
/*  Types — same shape as next-themes for drop-in compatibility.             */
/* -------------------------------------------------------------------------- */

type DataAttribute = `data-${string}`;
export type Attribute = DataAttribute | "class";

interface ValueObject {
  [themeName: string]: string;
}

export interface ThemeProviderProps extends React.PropsWithChildren {
  themes?: string[];
  forcedTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  storageKey?: string;
  defaultTheme?: string;
  attribute?: Attribute | Attribute[];
  value?: ValueObject;
  nonce?: string;
  /** @deprecated next-themes compat; this provider never injects scripts */
  scriptProps?: never;
}

export interface UseThemeProps {
  themes: string[];
  forcedTheme?: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  theme?: string;
  resolvedTheme?: string;
  systemTheme?: "dark" | "light";
}

/* -------------------------------------------------------------------------- */
/*  Internals                                                                 */
/* -------------------------------------------------------------------------- */

const DEFAULT_STORAGE_KEY = "theme";
const DEFAULT_THEMES = ["light", "dark", "system"];

type AttributeList = Exclude<ThemeProviderProps["attribute"], undefined>;

function normalizeAttributes(attr?: AttributeList): Attribute[] {
  if (!attr) return ["class"];
  return Array.isArray(attr) ? attr : [attr];
}

function resolveThemeName(theme: string, valueMap?: ValueObject): string | undefined {
  if (!valueMap) return theme;
  return valueMap[theme] ?? theme;
}

function attributesFor(
  theme: string | null,
  resolved: "dark" | "light",
  attributes: Attribute[],
  valueMap?: ValueObject
): Map<Attribute, string | null> {
  const out = new Map<Attribute, string | null>();
  for (const attr of attributes) {
    if (theme === null) {
      out.set(attr, null);
    } else if (attr === "class") {
      out.set(attr, resolveThemeName(theme, valueMap) ?? null);
    } else {
      out.set(attr, resolveThemeName(theme, valueMap) ?? null);
    }
  }
  // Force class presence for dark/light even when system theme resolves that way
  // (so consumers can rely on `.dark` in CSS for both modes).
  if (attributes.includes("class")) {
    const cls = out.get("class") ?? "";
    const parts = new Set(cls ? cls.split(/\s+/).filter(Boolean) : []);
    if (theme === "system") {
      parts.add(resolved);
    }
    out.set("class", Array.from(parts).join(" ") || null);
  }
  return out;
}

function applyAttributesToDocument(
  next: Map<Attribute, string | null>,
  prev?: Map<Attribute, string | null>
) {
  const root = document.documentElement;
  for (const [attr, val] of next) {
    const oldVal = prev?.get(attr);
    if (oldVal === val) continue;
    if (attr === "class") {
      const oldSet = new Set((oldVal ?? "").split(/\s+/).filter(Boolean));
      const newSet = new Set((val ?? "").split(/\s+/).filter(Boolean));
      for (const c of oldSet) if (!newSet.has(c)) root.classList.remove(c);
      for (const c of newSet) if (!oldSet.has(c)) root.classList.add(c);
    } else if (val == null) {
      root.removeAttribute(attr);
    } else {
      root.setAttribute(attr, val);
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Context                                                                   */
/* -------------------------------------------------------------------------- */

type ThemeContextValue = UseThemeProps;

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function useTheme(): UseThemeProps {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

export function ThemeProvider({
  children,
  themes = DEFAULT_THEMES,
  forcedTheme,
  enableSystem = true,
  disableTransitionOnChange = false,
  defaultTheme = enableSystem ? "system" : "light",
  storageKey = DEFAULT_STORAGE_KEY,
  attribute,
  value,
}: ThemeProviderProps) {
  const attributes = React.useMemo(() => normalizeAttributes(attribute), [attribute]);

  // Stored user theme (one of `themes`, e.g. "light" | "dark" | "system")
  const [theme, setThemeState] = React.useState<string>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored && themes.includes(stored)) return stored;
    } catch {
      /* ignore */
    }
    return defaultTheme;
  });

  // System theme (only used when theme === "system")
  const [systemTheme, setSystemTheme] = React.useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Listen for system color-scheme changes
  React.useEffect(() => {
    if (!enableSystem) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [enableSystem]);

  // Persist theme changes
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      /* ignore */
    }
  }, [theme, storageKey]);

  // Effective theme:
  const appliedTheme = forcedTheme ?? theme;
  const resolvedTheme: "dark" | "light" =
    appliedTheme === "system" ? systemTheme : (appliedTheme as "dark" | "light");

  // Apply attributes to <html> whenever they change.
  // When disableTransitionOnChange=true, briefly disable all CSS transitions
  // so the theme flip isn't animated.
  const prevAttrsRef = React.useRef<Map<Attribute, string | null> | undefined>(undefined);

  React.useEffect(() => {
    const attrs = attributesFor(appliedTheme, resolvedTheme, attributes, value);
    let restoreTransitions: (() => void) | undefined;
    if (disableTransitionOnChange) {
      const style = document.documentElement.style;
      const prev = style.cssText;
      style.setProperty("transition", "none", "important");
      const root = document.documentElement as HTMLElement;
      // Force reflow so browsers skip animation on the attribute change
      void root.offsetHeight;
      restoreTransitions = () => {
        // Reset in a new frame so transitions re-enable cleanly
        window.requestAnimationFrame(() => {
          if (prev === "") {
            style.removeProperty("transition");
          } else {
            style.cssText = prev;
          }
        });
      };
    }
    applyAttributesToDocument(attrs, prevAttrsRef.current);
    prevAttrsRef.current = attrs;
    restoreTransitions?.();
  }, [appliedTheme, resolvedTheme, attributes, value, disableTransitionOnChange]);

  const setTheme: ThemeContextValue["setTheme"] = React.useCallback(
    (next) => {
      setThemeState((prev) => {
        const resolved = typeof next === "function" ? (next as (p: string) => string)(prev) : next;
        return themes.includes(resolved) ? resolved : prev;
      });
    },
    [themes]
  );

  const ctxValue = React.useMemo<ThemeContextValue>(
    () => ({
      themes,
      forcedTheme,
      setTheme,
      theme: forcedTheme ?? theme,
      resolvedTheme: forcedTheme
        ? forcedTheme === "system"
          ? systemTheme
          : (forcedTheme as "dark" | "light")
        : resolvedTheme,
      systemTheme,
    }),
    [themes, forcedTheme, setTheme, theme, resolvedTheme, systemTheme]
  );

  return <ThemeContext.Provider value={ctxValue}>{children}</ThemeContext.Provider>;
}

ThemeProvider.displayName = "ThemeProvider";
