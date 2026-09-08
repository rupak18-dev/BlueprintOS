import { createFileRoute } from "@tanstack/react-router";
import { Box, Glasses, Sun, Palette, Camera, Play, Share2 } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/mock";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "3D / VR Studio — walkthroughs and renders" },
      { name: "description", content: "Turn floor plans into 3D scenes, set materials and lighting, then share a VR walkthrough with clients." },
      { property: "og:title", content: "3D / VR Studio — walkthroughs and renders" },
      { property: "og:description", content: "3D scenes, materials, lighting and VR walkthroughs for client review." },
    ],
  }),
  component: StudioPage,
});

const views = ["Perspective", "Top", "Front", "Walkthrough"];
const materials = ["Fluted oak", "Micro-cement", "Terrazzo", "Antique brass", "Ivory linen", "Walnut veneer"];

function StudioPage() {
  const project = projects[0];

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${project.id} · ${project.name}`}
        title="3D / VR Studio"
        subtitle="Review the scene, swap materials and light it for the client presentation."
        actions={
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="lg:hidden">
                  <Palette className="size-4" /> Scene
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>Scene controls</SheetTitle>
                </SheetHeader>
                <div className="space-y-5 px-4 pb-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Views</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {views.map((v, i) => (
                        <Badge key={v} variant={i === 0 ? "default" : "outline"} className="px-3 py-1.5 text-xs">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Materials</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {materials.map((m) => (
                        <Badge key={m} variant="outline" className="px-3 py-1.5 text-xs">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button size="sm" variant="outline">
              <Glasses className="size-4" /> VR mode
            </Button>
            <Button size="sm">
              <Share2 className="size-4" /> Share link
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border bg-card px-3 py-2">
            <div className="-mx-1 hidden gap-2 overflow-x-auto px-1 lg:flex">
              {views.map((v, i) => (
                <Badge key={v} variant={i === 0 ? "default" : "outline"} className="shrink-0 cursor-pointer px-3 py-1.5 text-xs">
                  {v}
                </Badge>
              ))}
            </div>
            <p className="truncate text-xs text-muted-foreground lg:hidden">Perspective · Living & dining</p>
            <div className="flex shrink-0 gap-1">
              <Button size="icon" variant="ghost" title="Sun angle">
                <Sun className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" title="Snapshot">
                <Camera className="size-4" />
              </Button>
            </div>
          </div>
          <div className="relative flex h-[50vh] items-center justify-center bg-gradient-to-br from-sidebar via-muted to-accent sm:h-[58vh] lg:h-[66vh]">
            <div className="px-6 text-center">
              <Box className="mx-auto size-10 text-brass" />
              <p className="mt-3 text-sm font-semibold">Living & dining — walkthrough ready</p>
              <p className="mt-1 text-xs text-muted-foreground">Sample scene preview for this phase</p>
              <Button size="sm" className="mt-4">
                <Play className="size-4" /> Play walkthrough
              </Button>
            </div>
          </div>
        </div>

        <aside className="min-w-0 space-y-4">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rooms</p>
            <ul className="mt-3 space-y-2">
              {project.rooms.map((r) => (
                <li key={r.room} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border px-3 py-2">
                  <span className="truncate text-sm">{r.room}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden rounded-xl border border-border bg-card p-3 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Materials</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {materials.map((m) => (
                <Badge key={m} variant="outline" className="px-3 py-1.5 text-xs">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lighting</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between gap-2">
                <span className="truncate">Time of day</span>
                <span className="shrink-0 text-muted-foreground">4:30 pm</span>
              </li>
              <li className="flex justify-between gap-2">
                <span className="truncate">Warmth</span>
                <span className="shrink-0 text-muted-foreground">2700 K</span>
              </li>
              <li className="flex justify-between gap-2">
                <span className="truncate">Render quality</span>
                <span className="shrink-0 text-muted-foreground">High</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
