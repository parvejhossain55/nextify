import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  /** Items that visually activate this nav entry (e.g. nested subroutes) */
  matchPrefixes?: string[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        matchPrefixes: ["/dashboard"],
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        label: "New",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
        matchPrefixes: ["/dashboard/users"],
      },
      {
        title: "Roles & Permissions",
        href: "/dashboard/roles",
        icon: ShieldCheck,
      },
      {
        title: "Documents",
        href: "/dashboard/documents",
        icon: FileText,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Help & Support",
        href: "/dashboard/help",
        icon: HelpCircle,
      },
    ],
  },
];

/** Flat list — useful for command palette & breadcrumb lookups */
export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
