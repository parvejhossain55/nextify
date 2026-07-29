import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — Nextify",
    template: "%s — Nextify",
  },
  description: "Nextify administration dashboard",
};

/**
 * (dashboard) Route Group layout —
 * Wraps all dashboard routes in the shared App Shell (Sidebar + Header + CMD+K).
 * Does NOT affect URL paths.
 */
export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
