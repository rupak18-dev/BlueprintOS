import {
  LayoutDashboard,
  Home,
  CalendarDays,
  Target,
  FolderKanban,
  Users,
  Wallet,
  HardHat,
  Library,
  PenTool,
  Ruler,
  Box,
  MonitorPlay,
  Truck,
  ListChecks,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; to: string; icon: LucideIcon };
export type NavGroup = { group: string; icon: LucideIcon; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    group: "Overview",
    icon: Home,
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "Calendar", to: "/calendar", icon: CalendarDays },
      { label: "Leads", to: "/leads", icon: Target },
      { label: "Projects", to: "/projects", icon: FolderKanban },
      { label: "Clients", to: "/clients", icon: Users },
      { label: "Accounts", to: "/accounts", icon: Wallet },
      { label: "Crew & Staff", to: "/crew", icon: HardHat },
    ],
  },
  {
    group: "Design",
    icon: PenTool,
    items: [
      { label: "Asset Library", to: "/assets", icon: Library },
      { label: "2D Planner", to: "/planner", icon: Ruler },
      { label: "3D / VR Studio", to: "/studio", icon: Box },
      { label: "Client Presentation", to: "/presentation", icon: MonitorPlay },
    ],
  },
  {
    group: "Production",
    icon: Wrench,
    items: [
      { label: "Procurement", to: "/procurement", icon: Truck },
      { label: "Tasks", to: "/tasks", icon: ListChecks },
    ],
  },
];

export const mobileBarItems: NavItem[] = [
  { label: "Home", to: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", to: "/leads", icon: Target },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Tasks", to: "/tasks", icon: ListChecks },
  { label: "Studio", to: "/studio", icon: Box },
];
