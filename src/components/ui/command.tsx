"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Search as SearchIcon } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────── *
 *  Lightweight command palette — a filterable list of commands inside a
 *  Dialog. Doesn't use Combobox's value-selection semantics; just filters
 *  children by query and lets CommandItem handle click actions.
 * ────────────────────────────────────────────────────────────────────────── */

type CommandContextValue = {
  query: string;
  setQuery: (q: string) => void;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommandCtx() {
  const ctx = React.useContext(CommandContext);
  if (!ctx) throw new Error("Command parts must be used within <Command>");
  return ctx;
}

function Command({ children, className }: { children: React.ReactNode; className?: string }) {
  const [query, setQuery] = React.useState("");
  const value = React.useMemo(() => ({ query, setQuery }), [query]);

  return (
    <CommandContext.Provider value={value}>
      <div
        data-slot="command"
        className={cn(
          "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-xl outline-none",
          className
        )}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command or navigate...",
  children,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        className="overflow-hidden !p-0 sm:!max-w-lg [&>button:last-child]:hidden"
        aria-describedby={undefined}
      >
        <Command className="min-h-[360px]">
          <div className="border-b p-3">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { query, setQuery } = useCommandCtx();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // auto-focus the input whenever the dialog opens (it remounts → effect runs)
  React.useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div data-slot="command-input-wrapper" className="flex items-center gap-2 border-b px-3">
      <SearchIcon className="text-muted-foreground size-4 shrink-0" aria-hidden />
      <input
        ref={inputRef}
        data-slot="command-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a command or search..."
        spellCheck={false}
        autoComplete="off"
        className={cn(
          "placeholder:text-muted-foreground flex h-11 w-full rounded-lg bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
          props.className
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, children }: { className?: string; children: React.ReactNode }) {
  const { query } = useCommandCtx();

  type SlotName = "command-group" | "command-item" | "command-separator" | string;

  interface CommandElementProps {
    "data-slot"?: SlotName;
    children?: React.ReactNode;
    value?: unknown;
    searchable?: string;
  }

  // Walk children and filter Groups / Items by query
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return children;

    const walk = (nodes: React.ReactNode): React.ReactNode[] => {
      return React.Children.toArray(nodes).flatMap((child) => {
        if (!React.isValidElement(child)) return [];
        const el = child as React.ReactElement<CommandElementProps>;
        const slot = el.props["data-slot"];
        const type = el.type as { displayName?: string; name?: string };
        const tname =
          typeof type === "function" || typeof type === "object"
            ? (type?.displayName ?? type?.name ?? "")
            : "";

        if (slot === "command-group" || tname === "CommandGroup") {
          const innerItems = walk(el.props.children);
          if (innerItems.length === 0) return [];
          return [
            React.cloneElement<CommandElementProps>(el, {} as CommandElementProps, innerItems),
          ];
        }

        if (slot === "command-item" || tname === "CommandItem") {
          const p = el.props;
          const haystack = [
            React.Children.toArray(p.children).join(" "),
            typeof p.value === "string" ? p.value : "",
            typeof p.searchable === "string" ? p.searchable : "",
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q) ? [child] : [];
        }

        if (slot === "command-separator" || tname === "CommandSeparator") {
          return [];
        }

        return [child];
      });
    };

    return walk(children);
  }, [children, query]);

  const hasItems = React.Children.toArray(filtered).some((c) => {
    if (!React.isValidElement(c)) return false;
    const slot = (c.props as CommandElementProps)["data-slot"];
    return slot === "command-group" || slot === "command-item";
  });

  return (
    <div
      data-slot="command-list"
      className={cn("max-h-[300px] overflow-x-hidden overflow-y-auto p-2 outline-none", className)}
      role="menu"
    >
      {hasItems ? (
        filtered
      ) : (
        <p className="text-muted-foreground py-8 text-center text-sm">No results found.</p>
      )}
    </div>
  );
}

function CommandGroup({
  heading,
  className,
  children,
}: {
  heading?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-slot="command-group" className={cn("overflow-hidden p-1", className)} role="group">
      {heading && (
        <div className="text-muted-foreground py-1.5 pr-1 pl-2 text-xs font-medium">{heading}</div>
      )}
      <div className="space-y-0.5 [&_[data-slot=command-item]]:pl-8">{children}</div>
    </div>
  );
}
CommandGroup.displayName = "CommandGroup";

function CommandItem({
  className,
  children,
  onSelect,
  value,
}: {
  className?: string;
  children: React.ReactNode;
  onSelect?: () => void;
  value?: string;
}) {
  const handleAction = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (
      (e.type === "keydown" &&
        (e as React.KeyboardEvent).key !== "Enter" &&
        (e as React.KeyboardEvent).key !== " ") ||
      !onSelect
    ) {
      return;
    }
    if (e.type === "keydown") e.preventDefault();
    onSelect();
  };

  return (
    <div
      data-slot="command-item"
      data-value={value}
      tabIndex={0}
      role="menuitem"
      onClick={onSelect}
      onKeyDown={handleAction}
      className={cn(
        "group relative flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute left-2 hidden size-3.5 items-center justify-center group-focus:flex"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-3.5"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {children}
    </div>
  );
}
CommandItem.displayName = "CommandItem";

function CommandSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}
CommandSeparator.displayName = "CommandSeparator";

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-wider", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
