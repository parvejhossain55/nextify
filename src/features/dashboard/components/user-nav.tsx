"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export interface UserNavProps {
  user?: {
    name: string | null;
    email: string | null;
    image?: string | null;
    role?: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const go = React.useCallback((href: string) => router.push(href), [router]);

  // Fallback demo user when no session available (useful during development)
  const display = {
    name: user?.name ?? "Jane Cooper",
    email: user?.email ?? "jane@acme.com",
    role: user?.role ?? "Administrator",
    initials:
      (user?.name ?? "Jane Cooper")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("") || "JC",
  };

  const handleSignOut = React.useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted relative flex h-9 items-center justify-start gap-2 px-1.5"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-semibold">{display.initials}</AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 flex-col items-start text-left md:flex">
            <span className="truncate text-sm leading-none font-medium">{display.name}</span>
            <span className="text-muted-foreground mt-0.5 truncate text-xs leading-none">
              {display.email}
            </span>
          </div>
          <ChevronsUpDown className="text-muted-foreground ml-1 size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-54">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => go(ROUTES.SETTINGS)}>
            <Sparkles className="size-4" />
            Upgrade to Pro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => go(`${ROUTES.DASHBOARD}/settings`)}>
            <Settings className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => go(`${ROUTES.DASHBOARD}/notifications`)}>
            <Bell className="size-4" />
            Notifications
            <span className="bg-primary/10 text-primary ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium">
              3
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => go(`${ROUTES.DASHBOARD}/billing`)}>
            <CreditCard className="size-4" />
            Billing &amp; Plans
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled className="cursor-default opacity-100">
            <BadgeCheck className="text-primary size-4" />
            Role: <span className="font-medium">{display.role}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => void handleSignOut()}
            className="text-destructive focus:text-destructive w-full cursor-pointer"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
