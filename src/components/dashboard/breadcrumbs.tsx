"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { allNavItems } from "./nav-config";

/**
 * Convert a pathname like /dashboard/users/123/edit
 * into [{label: "Dashboard", href: "/dashboard"}, ...]
 */
interface Crumb {
  label: string;
  href: string;
  isLast: boolean;
}

function prettifySegment(segment: string): string {
  return segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean); // e.g. ["dashboard", "users", "123", "edit"]
  if (segments.length === 0) return [];

  // Build lookup from href → title for known pages
  const hrefToTitle = new Map(allNavItems.map((item) => [item.href, item.title]));

  const crumbs: Crumb[] = [];
  let cumulative = "";

  for (let i = 0; i < segments.length; i++) {
    cumulative += `/${segments[i]}`;
    const isLast = i === segments.length - 1;

    // Prefer the nav-config title if we have an exact match
    let label = hrefToTitle.get(cumulative) ?? prettifySegment(segments[i]);

    // For dynamic segments that look like IDs ("123", "abc-123", etc.) use generic label
    if (/^[a-zA-Z0-9-]{6,}$/.test(segments[i]) && !hrefToTitle.has(cumulative)) {
      label = `Detail`;
    }

    crumbs.push({ label, href: cumulative, isLast });
  }

  return crumbs;
}

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const crumbs = React.useMemo(() => buildCrumbs(pathname), [pathname]);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      <ol className="flex items-center gap-1">
        {crumbs.length > 1 && (
          <li className="flex items-center">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dashboard home"
            >
              <Home className="size-4" />
            </Link>
            <ChevronRight className="text-muted-foreground/60 mx-1 size-3.5" aria-hidden />
          </li>
        )}
        {crumbs.map((crumb, idx) => (
          <li key={crumb.href + idx} className="flex items-center">
            {crumb.isLast ? (
              <span aria-current="page" className="text-foreground font-medium">
                {crumb.label}
              </span>
            ) : (
              <>
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
                <ChevronRight className="text-muted-foreground/60 mx-1 size-3.5" aria-hidden />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
