import { Link } from "react-router-dom";
import { Plus, Filter, ChevronRight } from "lucide-react";

import { Seo } from "@/components/seo";
import {
  PageHeader,
  Section,
  StatCard,
  StatGrid,
  StatusPill,
  ResponsiveTable,
  type Column,
} from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { leads, type Lead } from "@/data/mock";

const columns: Column<Lead>[] = [
  {
    key: "name",
    header: "Lead",
    primary: true,
    cell: (l) => (
      <Link to={`/leads/${l.id}`} className="block min-w-0">
        <span className="block truncate">{l.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {l.id} · {l.contact}
        </span>
      </Link>
    ),
  },
  { key: "scope", header: "Scope", cell: (l) => l.scope, hide: "md" },
  { key: "budget", header: "Budget", cell: (l) => l.budget },
  { key: "stage", header: "Stage", cell: (l) => <StatusPill value={l.stage} /> },
  { key: "source", header: "Source", cell: (l) => l.source, hide: "lg" },
  { key: "owner", header: "Owner", cell: (l) => l.owner, hide: "lg" },
  { key: "updated", header: "Updated", cell: (l) => l.updated, hide: "xl" },
];

function Filters() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input placeholder="Search leads" className="h-11" />
      {[
        ["Stage", ["New", "Qualified", "Site visit", "Quotation", "Negotiation"]],
        ["Owner", ["Meera Nair", "Devansh Shah", "Priya Das"]],
        ["Source", ["Website", "Referral", "Instagram", "Walk-in"]],
      ].map(([label, opts]) => (
        <Select key={label as string}>
          <SelectTrigger className="h-11 w-full">
            <SelectValue placeholder={label as string} />
          </SelectTrigger>
          <SelectContent>
            {(opts as string[]).map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <>
      <Seo
        title="Leads — enquiry pipeline"
        description="Track interior design enquiries from first contact through requirements, estimate and quotation."
      />

      <PageHeader
        title="Leads"
        subtitle="Capture the enquiry, understand requirements, quote, and convert to a project."
        actions={
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="lg:hidden">
                  <Filter className="size-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
                <SheetTitle className="px-4 pt-4">Filter leads</SheetTitle>
                <div className="p-4">
                  <Filters />
                </div>
              </SheetContent>
            </Sheet>
            <Button size="sm">
              <Plus className="size-4" /> New lead
            </Button>
          </>
        }
      />

      <StatGrid>
        <StatCard label="Open leads" value="18" hint="+4 this week" accent />
        <StatCard label="Pipeline value" value="₹4.36 Cr" hint="across all stages" />
        <StatCard label="Quotations out" value="6" hint="₹1.42 Cr awaiting" />
        <StatCard label="Win rate" value="34%" hint="last 90 days" />
      </StatGrid>

      <div className="mb-4 hidden lg:block">
        <Filters />
      </div>

      <Section title="All leads" description={`${leads.length} shown`}>
        <ResponsiveTable
          columns={columns}
          rows={leads}
          renderCardAction={(l) => (
            <Link to={`/leads/${l.id}`} aria-label={`Open ${l.name}`}>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          )}
        />
      </Section>
    </>
  );
}
