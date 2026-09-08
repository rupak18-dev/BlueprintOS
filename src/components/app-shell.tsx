import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, Bell, Plus, Sun, Moon, Sparkles } from "lucide-react";

import { navGroups, mobileBarItems, type NavItem } from "@/components/nav-config";
import { studio } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles className="size-4.5" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-sidebar-foreground">{studio.name}</span>
          <span className="block truncate text-[11px] text-sidebar-foreground/60">{studio.plan}</span>
        </span>
      )}
    </Link>
  );
}

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function NavLink({ item, compact, onNavigate }: { item: NavItem; compact?: boolean; onNavigate?: () => void }) {
  const pathname = useActivePath();
  const active = pathname === item.to || pathname.startsWith(item.to + "/");
  const Icon = item.icon;

  const content = (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
        compact && "justify-center px-0",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className={cn("size-4.5 shrink-0", active && "text-sidebar-primary")} />
      {!compact && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (!compact) return content;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarBody({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-1 bg-sidebar">
      <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", compact && "justify-center px-0")}>
        <Brand compact={compact} />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {!compact && (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40">
                {group.group}
              </p>
            )}
            {group.items.map((item) => (
              <NavLink key={item.to} item={item} compact={compact} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>
      <div className={cn("border-t border-sidebar-border p-3", compact && "px-2")}>
        <div className={cn("flex min-w-0 items-center gap-3", compact && "justify-center")}>
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-sidebar-accent text-xs text-sidebar-accent-foreground">MN</AvatarFallback>
          </Avatar>
          {!compact && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Meera Nair</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">Principal designer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
      }}
    >
      {dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </Button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        {/* Tablet icon rail */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 border-r border-sidebar-border md:block lg:hidden">
          <SidebarBody compact />
        </aside>
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
          <SidebarBody />
        </aside>

        <div className="md:pl-16 lg:pl-64">
          <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5">
              <div className="flex items-center gap-2 md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open navigation">
                      <Menu className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <SidebarBody onNavigate={() => setOpen(false)} />
                  </SheetContent>
                </Sheet>
              </div>
              <div className="hidden md:block" />
              <div className="min-w-0">
                <label className="relative flex items-center">
                  <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads, projects, clients…"
                    className="h-10 w-full pl-9 md:max-w-md"
                    aria-label="Search"
                  />
                </label>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button asChild size="sm" className="hidden sm:inline-flex">
                  <Link to="/leads">
                    <Plus className="size-4" /> New lead
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" aria-label="Notifications">
                  <Link to="/notifications">
                    <Bell className="size-4.5" />
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="px-4 pb-24 pt-5 sm:px-6 sm:pb-10 lg:px-8">
            <div className="mx-auto w-full max-w-[1400px]">{children}</div>
          </main>
        </div>

        {/* Mobile bottom bar */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          <ul className="grid grid-cols-5">
            {mobileBarItems.map((item) => (
              <li key={item.to}>
                <MobileBarLink item={item} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </TooltipProvider>
  );
}

function MobileBarLink({ item }: { item: NavItem }) {
  const pathname = useActivePath();
  const active = pathname === item.to || pathname.startsWith(item.to + "/");
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={cn(
        "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
