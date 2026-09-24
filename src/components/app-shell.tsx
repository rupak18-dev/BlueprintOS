import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  CreditCard,
  LifeBuoy,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plug,
  Settings,
  UserCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { navGroups, mobileBarItems, type NavItem } from "@/components/nav-config";
import { useAuth } from "@/context/auth-context";
import { studio } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Sparkles className="size-4.5" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-sidebar-foreground">
            {studio.name}
          </span>
          <span className="block truncate text-[11px] text-sidebar-foreground/60">
            {studio.plan}
          </span>
        </span>
      )}
    </Link>
  );
}

function useActivePath() {
  return useLocation().pathname;
}

function NavLink({
  item,
  compact,
  onNavigate,
}: {
  item: NavItem;
  compact?: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const pathname = useActivePath();
  const active = pathname === item.to || pathname.startsWith(item.to + "/");
  const Icon = item.icon;

  const content = (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        "flex min-h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors",
        compact && "justify-center px-0",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
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

function getActiveGroup(pathname: string): string | null {
  for (const group of navGroups) {
    if (group.items.some((item) => pathname === item.to || pathname.startsWith(item.to + "/"))) {
      return group.group;
    }
  }
  return null;
}

function GroupToggle({
  group,
  icon: Icon,
  open,
}: {
  group: string;
  icon: LucideIcon;
  open: boolean;
}) {
  return (
    <CollapsibleTrigger asChild>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40 transition-colors",
          "hover:text-sidebar-foreground focus-visible:bg-sidebar-accent/60 focus-visible:outline-none",
        )}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          <Icon className="size-3.5 shrink-0 text-sidebar-primary/80" />
          {group}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
    </CollapsibleTrigger>
  );
}

function SettingsGroup({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useActivePath();
  const [open, setOpen] = useState(() => pathname === "/integrations" || pathname === "/profile");

  useEffect(() => {
    if (pathname === "/integrations" || pathname === "/profile") setOpen(true);
  }, [pathname]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40 transition-colors",
            "hover:text-sidebar-foreground focus-visible:bg-sidebar-accent/60 focus-visible:outline-none",
          )}
        >
          <span className="flex min-w-0 items-center gap-2 truncate">
            <Settings className="size-3.5 shrink-0 text-sidebar-primary/80" />
            Settings
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        <NavLink
          item={{ label: "Profile", to: "/profile", icon: UserCog }}
          onNavigate={onNavigate}
        />
        <NavLink
          item={{ label: "Integrations", to: "/integrations", icon: Plug }}
          onNavigate={onNavigate}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

function ProfileCard({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const name = user?.name ?? "Meera Nair";
  const emailOrRole = user?.email ?? "Principal designer";

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg border border-sidebar-border/60 p-2",
        compact && "justify-center border-0 p-1",
      )}
    >
      <Avatar className="size-9 shrink-0 ring-2 ring-sidebar-primary/30">
        <AvatarFallback className="bg-sidebar-accent text-xs text-sidebar-accent-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!compact && (
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-sidebar-foreground">{name}</p>
          <p className="truncate text-[10px] text-sidebar-foreground/60">{emailOrRole}</p>
        </div>
      )}
    </div>
  );
}

function SidebarBody({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  const pathname = useActivePath();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const active = getActiveGroup(pathname);
    const init: Record<string, boolean> = {};
    for (const group of navGroups) {
      init[group.group] = group.group === "Overview" || group.group === active;
    }
    return init;
  });

  useEffect(() => {
    const active = getActiveGroup(pathname);
    if (active) {
      setOpenGroups((prev) => (prev[active] ? prev : { ...prev, [active]: true }));
    }
  }, [pathname]);

  const setGroupOpen = (group: string, open: boolean) =>
    setOpenGroups((prev) => ({ ...prev, [group]: open }));

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border px-4",
          compact && "justify-center px-0",
        )}
      >
        <Brand compact={compact} />
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {compact ? (
          <div className="space-y-1">
            {navGroups
              .flatMap((group) => group.items)
              .map((item) => (
                <NavLink key={item.to} item={item} compact onNavigate={onNavigate} />
              ))}
            <div className="mx-3 my-2 h-px bg-sidebar-border/40" />
            <NavLink
              item={{ label: "Profile", to: "/profile", icon: UserCog }}
              compact
              onNavigate={onNavigate}
            />
            <NavLink
              item={{ label: "Integrations", to: "/integrations", icon: Plug }}
              compact
              onNavigate={onNavigate}
            />
          </div>
        ) : (
          <div className="space-y-5">
            {navGroups.map((group) => {
              const open = !!openGroups[group.group];
              return (
                <Collapsible
                  key={group.group}
                  open={open}
                  onOpenChange={(isOpen) => setGroupOpen(group.group, isOpen)}
                  className="space-y-1"
                >
                  <GroupToggle group={group.group} icon={group.icon} open={open} />
                  <CollapsibleContent className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink key={item.to} item={item} onNavigate={onNavigate} />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}

            <div className="space-y-1">
              <div className="mx-3 my-2 h-px bg-sidebar-border/40" />
              <SettingsGroup onNavigate={onNavigate} />
            </div>
          </div>
        )}
      </nav>

      <footer className="shrink-0 space-y-1 border-t border-sidebar-border p-2">
        <ProfileCard compact={compact} />
        <NavLink
          item={{ label: "Studio Plan", to: "/studio-plan", icon: CreditCard }}
          compact={compact}
          onNavigate={onNavigate}
        />
        <NavLink
          item={{ label: "Help Center", to: "/help", icon: LifeBuoy }}
          compact={compact}
          onNavigate={onNavigate}
        />
        {compact ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                className="flex size-10 w-full items-center justify-center rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              >
                <LogOut className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Log out</span>
          </button>
        )}
      </footer>
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background">
        {/* Tablet icon rail */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 border-r border-sidebar-border md:block lg:hidden">
          <SidebarBody compact />
        </aside>
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r border-sidebar-border transition-[width] duration-300 ease-in-out lg:block",
            collapsed ? "w-16" : "w-72",
          )}
        >
          <SidebarBody compact={collapsed} />
        </aside>

        <div
          className={cn(
            "transition-[padding] duration-300 ease-in-out md:pl-16",
            collapsed ? "lg:pl-16" : "lg:pl-72",
          )}
        >
          <header className="sticky top-0 z-20 border-b border-border bg-background">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5">
              <div className="flex items-center gap-2">
                <div className="md:hidden">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:inline-flex"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  onClick={() => setCollapsed((value) => !value)}
                >
                  {collapsed ? (
                    <PanelLeftOpen className="size-4.5" />
                  ) : (
                    <PanelLeftClose className="size-4.5" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-end gap-1">
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
            <div className="w-full">{children}</div>
          </main>
        </div>

        {/* Mobile bottom bar */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
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
