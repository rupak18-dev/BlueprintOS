import { Plus, Search } from "lucide-react";

import { Seo } from "@/components/seo";
import { PageHeader, Section, StatCard, StatGrid } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { assets } from "@/data/mock";

const categories = [
  "All",
  "Seating",
  "Storage",
  "Surfaces",
  "Soft furnishing",
  "Lighting",
  "Finishes",
];

export default function AssetsPage() {
  return (
    <>
      <Seo
        title="Asset Library — furniture, finishes and lighting"
        description="Searchable catalogue of furniture, materials, finishes and lighting with sizes, prices and vendors."
      />

      <PageHeader
        title="Asset Library"
        subtitle="Everything you can drop into a room: furniture, finishes, lighting and surfaces."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Add asset
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Assets" value="1,248" hint="86 added this month" accent />
        <StatCard label="Categories" value="14" hint="incl. custom joinery" />
        <StatCard label="Vendors" value="37" hint="22 with live pricing" />
        <StatCard label="3D ready" value="912" hint="73% of library" />
      </StatGrid>

      <div className="mb-4 grid gap-3 sm:flex sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search assets" className="h-11 pl-9" />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {categories.map((c, i) => (
            <Badge
              key={c}
              variant={i === 0 ? "default" : "outline"}
              className="shrink-0 cursor-pointer px-3 py-1.5 text-xs"
            >
              {c}
            </Badge>
          ))}
        </div>
      </div>

      <Section title="Catalogue" description={`${assets.length} shown`}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {assets.map((a) => (
            <li
              key={a.id}
              className="min-w-0 overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-brass/30 via-muted to-accent" />
              <div className="p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <span className="shrink-0 text-sm font-bold">{a.price}</span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {a.category} · {a.material} · {a.finish}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {a.size} · {a.vendor}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    Add to room
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
