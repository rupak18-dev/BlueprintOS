import {
  LayoutDashboard,
  CalendarDays,
  Target,
  FolderKanban,
  Users,
  Wallet,
  HardHat,
  Library,
  Ruler,
  Box,
  MonitorPlay,
  Truck,
  Files,
  MessagesSquare,
  ListChecks,
  Bell,
  CreditCard,
  UserCog,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; to: string; icon: LucideIcon };
export type NavGroup = { group: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    group: "Main",
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
    items: [
      { label: "Asset Library", to: "/assets", icon: Library },
      { label: "2D Planner", to: "/planner", icon: Ruler },
      { label: "3D / VR Studio", to: "/studio", icon: Box },
      { label: "Client Presentation", to: "/presentation", icon: MonitorPlay },
    ],
  },
  {
    group: "Operations",
    items: [
      { label: "Procurement", to: "/procurement", icon: Truck },
      { label: "Files", to: "/files", icon: Files },
      { label: "Communication", to: "/messages", icon: MessagesSquare },
      { label: "Tasks", to: "/tasks", icon: ListChecks },
      { label: "Notifications", to: "/notifications", icon: Bell },
    ],
  },
  {
    group: "Studio",
    items: [
      { label: "Studio Plan", to: "/studio-plan", icon: CreditCard },
      { label: "Profile", to: "/profile", icon: UserCog },
      { label: "Help Center", to: "/help", icon: LifeBuoy },
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
