"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { navGroups } from "./nav-config";
import { SidebarLink } from "./sidebar-link";

export function Sidebar() {
  const { collapsed, toggleCollapsed, isMobile } = useSidebar();

  if (isMobile) return null; // mobile uses <MobileSidebar />

  return (
    <TooltipProvider delay={100}>
      <aside
        data-collapsed={collapsed}
        className={cn(
          "bg-sidebar text-sidebar-foreground border-sidebar-border fixed inset-y-0 left-0 z-30 hidden flex-col border-r transition-[width] duration-200 ease-out lg:flex",
          collapsed ? "w-[72px]" : "w-64"
        )}
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="border-sidebar-border/70 flex h-14 items-center gap-2 border-b px-4">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Hexagon className="size-4.5" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="font-heading text-base font-semibold tracking-tight">Nextify</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <h3 className="text-sidebar-foreground/40 mb-2 px-3 text-[11px] font-semibold tracking-wider uppercase">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <SidebarLink {...item} collapsed={collapsed} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer / Collapse toggle */}
        <div className="border-sidebar-border/70 border-t p-2">
          <Button
            variant="ghost"
            size="default"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full justify-start"
          >
            {collapsed ? (
              <ChevronRight className="mx-auto size-[18px]" />
            ) : (
              <>
                <ChevronLeft className="size-[18px]" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
