"use client";

import * as React from "react";
import { Hexagon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "./sidebar-context";
import { navGroups } from "./nav-config";
import { SidebarLink } from "./sidebar-link";

export function MobileSidebar() {
  const { isMobile, mobileOpen, setMobileOpen } = useSidebar();
  const close = React.useCallback(() => setMobileOpen(false), [setMobileOpen]);

  if (!isMobile) return null;

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent
        side="left"
        showCloseButton
        className="w-72 !border-r !p-0"
        aria-describedby={undefined}
      >
        <SheetHeader className="border-sidebar-border/70 !border-b !p-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <Hexagon className="size-4.5" strokeWidth={2.5} />
            </div>
            <span className="font-heading text-base font-semibold tracking-tight">Nextify</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sidebar-foreground/40 mb-2 px-3 text-[11px] font-semibold tracking-wider uppercase">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <SidebarLink {...item} onClick={close} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
