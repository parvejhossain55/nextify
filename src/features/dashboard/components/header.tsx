"use client";

import * as React from "react";
import { Menu, Search, Command as CmdIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";
import { Breadcrumbs } from "./breadcrumbs";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";
import { cn } from "@/lib/utils";

export function Header({
  user,
}: {
  user?:
    | {
        name: string | null;
        email: string | null;
        image?: string | null;
        role?: string;
      }
    | undefined;
}) {
  const { toggleCollapsed, isMobile, setMobileOpen } = useSidebar();
  const openCommandPalette = () => window.dispatchEvent(new CustomEvent("open-command-palette"));

  const handleMenuClick = () => {
    if (isMobile) setMobileOpen(true);
    else toggleCollapsed();
  };

  return (
    <header
      className={cn(
        "border-border/60 sticky top-0 z-20 h-14 border-b",
        "bg-background/75 backdrop-blur-md backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="flex h-full items-center gap-3 px-4 md:px-6">
        {/* Mobile menu or collapse toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleMenuClick}
          aria-label={isMobile ? "Open menu" : "Toggle sidebar"}
          className="text-muted-foreground hover:text-foreground lg:flex"
        >
          <Menu className="size-[18px]" />
        </Button>

        {/* Divider (desktop-only, visual nicety) */}
        <div className="bg-border/80 hidden h-6 w-px lg:block" aria-hidden />

        {/* Breadcrumbs */}
        <div className="min-w-0 flex-1">
          <Breadcrumbs />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">
          {/* Command palette trigger */}
          <Button
            variant="ghost"
            onClick={openCommandPalette}
            className="text-muted-foreground hover:text-foreground relative w-48 justify-start gap-2 sm:w-64"
            aria-label="Open command palette"
          >
            <Search className="size-4 shrink-0" />
            <span className="hidden truncate text-sm font-normal sm:inline">
              Search or type a command...
            </span>
            <span className="ml-auto hidden items-center gap-0.5 sm:flex">
              <kbd
                className={cn(
                  "pointer-events-none inline-flex h-5 items-center gap-0.5 rounded-md border",
                  "border-border/80 bg-background text-muted-foreground px-1.5 font-[inherit] text-[10px] font-medium shadow-sm"
                )}
              >
                <CmdIcon className="size-3" />
                <span>K</span>
              </kbd>
            </span>
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Mobile command-palette icon button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={openCommandPalette}
            aria-label="Search"
            className="text-muted-foreground hover:text-foreground sm:hidden"
          >
            <Search className="size-[18px]" />
          </Button>

          {/* User avatar */}
          <div className="pl-1">
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
