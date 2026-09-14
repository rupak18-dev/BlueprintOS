import { Link } from "react-router-dom";
import { Plus, ChevronRight } from "lucide-react";

import { Seo } from "@/components/seo";
import {
  PageHeader,
  Section,
  StatCard,
  StatGrid,
  ResponsiveTable,
  type Column,
} from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clients, type Client } from "@/data/mock";

const columns: Column<Client>[] = [
  {
    key: "name",
    header: "Client",
    primary: true,
    cell: (c) => (
      <Link to={`/clients/${c.id}`} className="block min-w-0">
        <span className="block truncate">{c.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {c.id} · {c.company}
        </span>
      </Link>
    ),
  },
  { key: "email", header: "Email", cell: (c) => c.email, hide: "lg" },
  { key: "phone", header: "Phone", cell: (c) => c.phone, hide: "md" },
  { key: "city", header: "City", cell: (c) => c.city, hide: "xl" },
  { key: "projects", header: "Projects", cell: (c) => c.projects.join(", ") },
  { key: "value", header: "Value", cell: (c) => c.value },
];

export default function ClientsPage() {
  return (
    <>
      <Seo
        title="Clients — accounts and history"
        description="Client records with contact details, linked projects, lifetime value and notes."
      />

      <PageHeader
        title="Clients"
        subtitle="One record per client, linked to their leads, projects and payments."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Add client
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total clients" value="24" hint="4 added this quarter" accent />
        <StatCard label="Repeat clients" value="6" hint="25% of base" />
        <StatCard label="Lifetime value" value="₹3.9 Cr" hint="since 2024" />
        <StatCard label="Referrals" value="9" hint="from 5 clients" />
      </StatGrid>

      <div className="mb-4">
        <Input placeholder="Search clients" className="h-11 sm:max-w-xs" />
      </div>

      <Section title="All clients" description={`${clients.length} shown`}>
        <ResponsiveTable
          columns={columns}
          rows={clients}
          renderCardAction={(c) => (
            <Link to={`/clients/${c.id}`} aria-label={`Open ${c.name}`}>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          )}
        />
      </Section>
    </>
  );
}
