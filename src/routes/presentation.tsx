import { createFileRoute } from "@tanstack/react-router";
import { Share2, Check, MessageSquare } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader, Section, StatCard, StatGrid, StatusPill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { gallery, projects } from "@/data/mock";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Client Presentation — share designs for approval" },
      { name: "description", content: "Build a shareable presentation of renders, walkthroughs and costs, and collect client approvals." },
      { property: "og:title", content: "Client Presentation — share designs for approval" },
      { property: "og:description", content: "Renders, walkthroughs and costs in one shareable client link." },
    ],
  }),
  component: PresentationPage,
});

function PresentationPage() {
  const project = projects[0];

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${project.id} · ${project.client}`}
        title="Client Presentation"
        subtitle="One link with renders, walkthrough and costs — with approval and comments per room."
        actions={
          <>
            <Button size="sm" variant="outline">
              Preview as client
            </Button>
            <Button size="sm">
              <Share2 className="size-4" /> Share link
            </Button>
          </>
        }
      />

      <StatGrid>
        <StatCard label="Rooms shared" value="4" hint="2 approved" accent />
        <StatCard label="Client views" value="17" hint="last opened yesterday" />
        <StatCard label="Comments" value="6" hint="2 unresolved" />
        <StatCard label="Link expiry" value="30 Sep" hint="password protected" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Section title="Slides" description="Renders and walkthroughs in presentation order" className="xl:col-span-2">
          <ul className="grid gap-3 sm:grid-cols-2">
            {gallery.slice(0, 4).map((g, i) => (
              <li key={g.title} className="min-w-0 overflow-hidden rounded-xl border border-border">
                <div className={`aspect-video w-full bg-gradient-to-br ${g.tone} via-muted to-accent`} />
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{g.title}</p>
                    <p className="truncate text-xs text-muted-foreground">Slide {i + 1} · {g.tag}</p>
                  </div>
                  <StatusPill value={i < 2 ? "Approved" : "In review"} />
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Approvals & comments">
          <ul className="space-y-3">
            {project.rooms.map((r) => (
              <li key={r.room} className="min-w-0 rounded-lg border border-border p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="truncate text-sm font-semibold">{r.room}</p>
                  <StatusPill value={r.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="size-4" /> Comments
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Check className="size-4" /> Mark approved
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </AppShell>
  );
}
