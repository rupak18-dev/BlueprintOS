import { useState } from "react";
import { Plug, ExternalLink } from "lucide-react";

import { Seo } from "@/components/seo";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";

const integrations = [
  {
    id: "gdrive",
    name: "Google Drive",
    desc: "Attach plans, BOQs and invoices straight from Drive.",
    connected: true,
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Post project updates and PO approvals to a channel.",
    connected: false,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    desc: "Keep the asset library synced to an existing folder.",
    connected: false,
  },
  {
    id: "figma",
    name: "Figma",
    desc: "Import moodboards and finish references.",
    connected: false,
  },
  {
    id: "gtag",
    name: "Google Calendar",
    desc: "Mirror site visits and handovers into your calendar.",
    connected: true,
  },
];

export default function IntegrationsPage() {
  const [active, setActive] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(integrations.map((i) => [i.id, i.connected])),
  );

  const toggle = (id: string) => setActive((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <Seo
        title="Integrations — connect your tools"
        description="Connect Google Drive, Slack, Dropbox and more to BlueprintOS."
      />

      <PageHeader
        title="Integrations"
        subtitle="Connect the tools your studio already uses."
        actions={
          <Button size="sm" variant="outline">
            <ExternalLink className="size-4" /> Developer API
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((i) => {
          const on = !!active[i.id];
          return (
            <div key={i.id} className="min-w-0 rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  <Plug className="size-5" />
                </span>
                <p className="min-w-0 truncate text-sm font-semibold">{i.name}</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{i.desc}</p>
              <Button
                variant={on ? "outline" : "default"}
                size="sm"
                className="mt-4"
                onClick={() => toggle(i.id)}
              >
                {on ? "Disconnect" : "Connect"}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
