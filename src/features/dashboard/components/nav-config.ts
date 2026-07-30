import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Receipt,
  FileText,
  Image,
  MessageSquare,
  TicketCheck,
  Bell,
  Activity,
  Key,
  Settings,
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
      },
      {
        title: "Reports & Sales",
        href: "/dashboard/reports",
        icon: TrendingUp,
        label: "Live",
      },
    ],
  },
  {
    title: "Core Features (CMS & Shop)",
    items: [
      {
        title: "Catalog / Products",
        href: "/dashboard/products",
        icon: ShoppingBag,
      },
      {
        title: "Content & Posts",
        href: "/dashboard/posts",
        icon: FileText,
      },
      {
        title: "Media Library",
        href: "/dashboard/media",
        icon: Image,
      },
    ],
  },
  {
    title: "Finance & Billing",
    items: [
      {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: CreditCard,
      },
      {
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Customer Relations",
    items: [
      {
        title: "Messages / Inbox",
        href: "/dashboard/messages",
        icon: MessageSquare,
        label: "12",
      },
      {
        title: "Support Tickets",
        href: "/dashboard/tickets",
        icon: TicketCheck,
      },
    ],
  },
  {
    title: "System & Developer",
    items: [
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Activity Logs",
        href: "/dashboard/logs",
        icon: Activity,
      },
      {
        title: "API Keys & Webhooks",
        href: "/dashboard/api-keys",
        icon: Key,
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
