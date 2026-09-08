import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader, ResponsiveTable, Section, StatCard, StatGrid, StatusPill, type Column } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { purchaseOrders } from "@/data/mock";

export const Route = createFileRoute("/procurement")({
  head: () => ({
    meta: [
      { title: "Procurement — purchase orders and deliveries" },
      { name: "description", content: "Raise purchase orders to vendors and track items, amounts, delivery dates and site receipts." },
      { property: "og:title", content: "Procurement — purchase orders and deliveries" },
      { property: "og:description", content: "Vendor purchase orders, delivery tracking and site receipts." },
    ],
  }),
  component: ProcurementPage,
});

type PO = (typeof purchaseOrders)[number];

const columns: Column<PO>[] = [
  { key: "id", header: "PO", primary: true, cell: (p) => p.id },
  { key: "vendor", header: "Vendor", cell: (p) => p.vendor },
  { key: "project", header: "Project", cell: (p) => p.project },
  { key: "items", header: "Items", cell: (p) => `${p.items}`, hide: "md" },
  { key: "eta", header: "ETA", cell: (p) => p.eta, hide: "lg" },
  { key: "status", header: "Status", cell: (p) => <StatusPill value={p.status} /> },
  { key: "amount", header: "Amount", cell: (p) => p.amount, align: "right" },
];

function ProcurementPage() {
  return (
    <AppShell>
      <PageHeader
        title="Procurement"
        subtitle="Vendor orders for every project, from raising the PO to site delivery."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> New purchase order
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Open POs" value="9" hint="₹18.4 L committed" accent />
        <StatCard label="In transit" value="3" hint="next arrival 18 Sep" />
        <StatCard label="Delivered (30d)" value="14" hint="2 partial" />
        <StatCard label="Pending bills" value="5" hint="₹4.2 L unbilled" />
      </StatGrid>

      <Section title="Purchase orders">
        <ResponsiveTable columns={columns} rows={purchaseOrders} />
      </Section>
    </AppShell>
  );
}
