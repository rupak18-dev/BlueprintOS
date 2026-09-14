import { Link } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";

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
import { crew } from "@/data/mock";

type Member = (typeof crew)[number];

const columns: Column<Member>[] = [
  {
    key: "name",
    header: "Member",
    primary: true,
    cell: (m) => (
      <Link to={`/crew/${m.id}`} className="block min-w-0">
        <span className="block truncate">{m.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {m.id} · {m.role}
        </span>
      </Link>
    ),
  },
  { key: "type", header: "Type", cell: (m) => m.type },
  { key: "projects", header: "Projects", cell: (m) => `${m.projects} active` },
  { key: "rate", header: "Rate", cell: (m) => m.rate, hide: "lg" },
  { key: "phone", header: "Phone", cell: (m) => m.phone, hide: "xl" },
  { key: "status", header: "Status", cell: (m) => <StatusPill value={m.status} /> },
];

export default function CrewPage() {
  return (
    <>
      <Seo
        title="Crew & Staff — studio team"
        description="Designers, project managers, site supervisors and vendor crews with project assignments."
      />

      <PageHeader
        title="Crew & Staff"
        subtitle="Studio staff and vendor crews, with the projects they are working on."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Add member
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Studio seats" value="8 / 12" hint="Studio Pro plan" accent />
        <StatCard label="On site today" value="3" hint="2 projects" />
        <StatCard label="Vendor crews" value="6" hint="carpentry, electrical, paint" />
        <StatCard label="Utilisation" value="82%" hint="last 30 days" />
      </StatGrid>

      <Section title="Team" description={`${crew.length} members`}>
        <ResponsiveTable
          columns={columns}
          rows={crew}
          renderCardAction={(m) => (
            <Link to={`/crew/${m.id}`} aria-label={`Open ${m.name}`}>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          )}
        />
      </Section>
    </>
  );
}
