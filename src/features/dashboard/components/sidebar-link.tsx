"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  title: string;
  label?: string;
  matchPrefixes?: string[];
  collapsed?: boolean;
  onClick?: () => void;
}

function isActive(pathname: string, href: string, matchPrefixes: string[] = []): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  const checks = [href, ...matchPrefixes];
  return checks.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function SidebarLink({
  href,
  icon: Icon,
  title,
  label,
  matchPrefixes,
  collapsed,
  onClick,
}: SidebarLinkProps) {
  const pathname = usePathname();
  const active = isActive(pathname, href, matchPrefixes);

  const linkContent = (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        "focus-visible:ring-sidebar-ring focus-visible:ring-2 focus-visible:outline-none",
        active &&
          "bg-sidebar-accent text-sidebar-foreground [box-shadow:inset_2px_0_0_0_var(--sidebar-primary)]"
      )}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active
            ? "text-sidebar-primary"
            : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
        )}
        aria-hidden
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{title}</span>
          {label && (
            <Badge
              variant="default"
              className="ml-auto h-5 rounded-md px-1.5 text-[10px] font-medium"
            >
              {label}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">{linkContent}</div>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {title}
          {label ? ` · ${label}` : ""}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
