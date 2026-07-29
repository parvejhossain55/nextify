"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, BarChart3, HelpCircle, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { navGroups } from "./nav-config";

/**
 * Global CMD+K command palette. Use `<CommandPalette />` once in the layout.
 * Trigger via: `window.dispatchEvent(new CustomEvent("open-command-palette"))`
 *   or via CMD/CTRL+K automatically.
 */
export function CommandPalette() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    const handleCustom = () => setOpen(true);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("open-command-palette", handleCustom);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("open-command-palette", handleCustom);
    };
  }, []);

  const run = React.useCallback((cb: () => void) => {
    setOpen(false);
    // small delay so close animation can start
    window.setTimeout(cb, 50);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        {navGroups.map((group) => (
          <CommandGroup key={group.title} heading={group.title}>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.href}
                  value={`${item.title} ${item.href}`}
                  onSelect={() => run(() => router.push(item.href))}
                >
                  <Icon className="text-muted-foreground size-4" />
                  <span>{item.title}</span>
                  {item.label && (
                    <span className="text-primary ml-auto text-[10px] font-medium uppercase">
                      {item.label}
                    </span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem value="theme light" onSelect={() => run(() => setTheme("light"))}>
            <Sun className="text-muted-foreground size-4" />
            <span>Switch to Light Theme</span>
          </CommandItem>
          <CommandItem value="theme dark" onSelect={() => run(() => setTheme("dark"))}>
            <Moon className="text-muted-foreground size-4" />
            <span>Switch to Dark Theme</span>
          </CommandItem>
          <CommandItem value="theme system" onSelect={() => run(() => setTheme("system"))}>
            <Monitor className="text-muted-foreground size-4" />
            <span>Use System Theme</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Quick links">
          <CommandItem value="home" onSelect={() => run(() => router.push("/"))}>
            <LayoutDashboard className="text-muted-foreground size-4" />
            <span>Go to home page</span>
          </CommandItem>
          <CommandItem value="users" onSelect={() => run(() => router.push("/dashboard/users"))}>
            <Users className="text-muted-foreground size-4" />
            <span>Manage Users</span>
          </CommandItem>
          <CommandItem
            value="analytics"
            onSelect={() => run(() => router.push("/dashboard/analytics"))}
          >
            <BarChart3 className="text-muted-foreground size-4" />
            <span>View Analytics</span>
          </CommandItem>
          <CommandItem value="docs" onSelect={() => run(() => router.push("/dashboard/help"))}>
            <HelpCircle className="text-muted-foreground size-4" />
            <span>Documentation &amp; Help</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
