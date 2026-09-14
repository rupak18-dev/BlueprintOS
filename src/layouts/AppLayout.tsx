import { Outlet } from "react-router-dom";

import { AppShell } from "@/components/app-shell";

export default function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
