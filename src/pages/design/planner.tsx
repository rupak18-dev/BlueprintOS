import {
  MousePointer2,
  Minus,
  DoorOpen,
  Blinds,
  Ruler,
  Sofa,
  Layers,
  Save,
  Box,
} from "lucide-react";

import { Seo } from "@/components/seo";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const tools = [
  { label: "Select", icon: MousePointer2 },
  { label: "Wall", icon: Minus },
  { label: "Door", icon: DoorOpen },
  { label: "Window", icon: Blinds },
  { label: "Dimension", icon: Ruler },
  { label: "Furniture", icon: Sofa },
  { label: "Layers", icon: Layers },
];

const layers = ["Walls", "Openings", "Furniture", "Electrical", "Dimensions"];

export default function PlannerPage() {
  return (
    <>
      <Seo
        title="2D Planner — draw walls, doors and layouts"
        description="Draw floor plans room by room: walls, doors, windows, dimensions and furniture placement."
      />

      <PageHeader
        eyebrow="PRJ-118 · Prestige Lakeside 4BHK"
        title="2D Planner"
        subtitle="Sketch the plan, then push it straight into the 3D studio."
        actions={
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="lg:hidden">
                  Tools
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>Tools & layers</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-3 gap-2 px-4 pb-6">
                  {tools.map((t) => (
                    <Button key={t.label} variant="outline" className="h-16 flex-col gap-1 text-xs">
                      <t.icon className="size-5" />
                      {t.label}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 px-4 pb-8">
                  {layers.map((l) => (
                    <Badge key={l} variant="outline" className="px-3 py-1.5 text-xs">
                      {l}
                    </Badge>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <Button size="sm" variant="outline">
              <Save className="size-4" /> Save
            </Button>
            <Button size="sm">
              <Box className="size-4" /> To 3D
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[64px_minmax(0,1fr)_260px]">
        <aside className="hidden flex-col gap-2 rounded-xl border border-border bg-card p-2 lg:flex">
          {tools.map((t) => (
            <Button key={t.label} variant="ghost" size="icon" title={t.label} className="size-11">
              <t.icon className="size-5" />
            </Button>
          ))}
        </aside>

        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-muted">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border bg-card px-3 py-2">
            <p className="truncate text-xs text-muted-foreground">
              Living & dining · 1:50 · grid 100 mm
            </p>
            <div className="flex shrink-0 gap-1">
              <Button size="sm" variant="ghost">
                −
              </Button>
              <Button size="sm" variant="ghost">
                +
              </Button>
            </div>
          </div>
          <div
            className="h-[52vh] w-full sm:h-[60vh] lg:h-[68vh]"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklab, var(--color-border) 60%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-border) 60%, transparent) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            <svg viewBox="0 0 600 400" className="h-full w-full">
              <rect
                x="60"
                y="50"
                width="480"
                height="300"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-foreground/70"
              />
              <line
                x1="330"
                y1="50"
                x2="330"
                y2="230"
                stroke="currentColor"
                strokeWidth="6"
                className="text-foreground/70"
              />
              <line
                x1="330"
                y1="230"
                x2="540"
                y2="230"
                stroke="currentColor"
                strokeWidth="6"
                className="text-foreground/70"
              />
              <rect x="120" y="44" width="90" height="12" className="fill-brass" />
              <rect x="534" y="120" width="12" height="80" className="fill-brass" />
              <text x="160" y="200" className="fill-muted-foreground text-[16px]">
                Living
              </text>
              <text x="400" y="150" className="fill-muted-foreground text-[16px]">
                Dining
              </text>
              <text x="400" y="300" className="fill-muted-foreground text-[16px]">
                Kitchen
              </text>
            </svg>
          </div>
        </div>

        <aside className="min-w-0 rounded-xl border border-border bg-card p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Layers
          </p>
          <ul className="mt-3 space-y-2">
            {layers.map((l) => (
              <li
                key={l}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span className="truncate">{l}</span>
                <span className="shrink-0 text-xs text-muted-foreground">visible</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Room area
          </p>
          <p className="mt-2 text-2xl font-bold">412 sq ft</p>
          <p className="text-xs text-muted-foreground">Carpet area, living & dining</p>
        </aside>
      </div>
    </>
  );
}
