import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
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
 *
 * Server-side auth guard: redirects unauthenticated users to /login before any
 * dashboard route renders, so nested pages don't need to repeat the check.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Pick only the fields the shell needs so we never accidentally leak the
  // raw access token or session internals into client props.
  //
  // Note: NextAuth session user has `avatar` (not `image`) after adapter mapping;
  // accept either to stay compatible with auth configs.
  const sessionUser = session.user as
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        avatar?: string | null;
        role?: string;
      }
    | undefined;
  const user = {
    name: sessionUser?.name ?? null,
    email: sessionUser?.email ?? null,
    image: sessionUser?.image ?? sessionUser?.avatar ?? null,
    role: sessionUser?.role,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
