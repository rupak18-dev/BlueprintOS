import { Outlet } from "react-router-dom";

import { SiteShell } from "@/components/site-shell";

export default function SiteLayout() {
  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}
