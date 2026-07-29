"use client";

import * as React from "react";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { Header } from "./header";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";

function ShellContents({ children }: { children: React.ReactNode }) {
  const { collapsed, isMobile } = useSidebar();
  // Calculate left padding for desktop based on sidebar state
  const desktopPad = isMobile ? "" : collapsed ? "lg:pl-[72px]" : "lg:pl-64";
  return (
    <div className="bg-background min-h-dvh">
      <Sidebar />
      <MobileSidebar />
      <div className={cn("flex min-h-dvh flex-col", desktopPad)}>
        <Header />
        <main
          id="content"
          className="flex-1 px-4 py-6 focus:outline-none md:px-6 md:py-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ShellContents>{children}</ShellContents>
    </SidebarProvider>
  );
}
