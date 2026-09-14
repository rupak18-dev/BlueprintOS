import { Plus, Download } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { expenses, invoices, payments } from "@/data/mock";

type Invoice = (typeof invoices)[number];
type Payment = (typeof payments)[number];
type Expense = (typeof expenses)[number];

const invoiceCols: Column<Invoice>[] = [
  { key: "id", header: "Invoice", primary: true, cell: (i) => i.id },
  { key: "client", header: "Client", cell: (i) => i.client },
  { key: "project", header: "Project", cell: (i) => i.project, hide: "md" },
  { key: "due", header: "Due", cell: (i) => i.due, hide: "lg" },
  { key: "status", header: "Status", cell: (i) => <StatusPill value={i.status} /> },
  { key: "amount", header: "Amount", cell: (i) => i.amount, align: "right" },
];

const paymentCols: Column<Payment>[] = [
  { key: "id", header: "Receipt", primary: true, cell: (p) => p.id },
  { key: "date", header: "Date", cell: (p) => p.date },
  { key: "client", header: "Client", cell: (p) => p.client },
  { key: "mode", header: "Mode", cell: (p) => p.mode, hide: "md" },
  { key: "amount", header: "Amount", cell: (p) => p.amount, align: "right" },
];

const expenseCols: Column<Expense>[] = [
  { key: "id", header: "Entry", primary: true, cell: (e) => e.id },
  { key: "date", header: "Date", cell: (e) => e.date },
  { key: "head", header: "Head", cell: (e) => e.head },
  { key: "project", header: "Project", cell: (e) => e.project, hide: "md" },
  { key: "amount", header: "Amount", cell: (e) => e.amount, align: "right" },
];

export default function AccountsPage() {
  return (
    <>
      <Seo
        title="Accounts — invoices, payments and expenses"
        description="Studio finances: invoices raised, payments received, project expenses and margin."
      />

      <PageHeader
        title="Accounts"
        subtitle="Money in and money out, tied to the projects that generated it."
        actions={
          <>
            <Button size="sm" variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New invoice
            </Button>
          </>
        }
      />

      <StatGrid>
        <StatCard label="Invoiced (FY)" value="₹1.86 Cr" hint="42 invoices" accent />
        <StatCard label="Collected" value="₹1.47 Cr" hint="79% of invoiced" />
        <StatCard label="Outstanding" value="₹38.6 L" hint="₹12.4 L overdue" />
        <StatCard label="Gross margin" value="27.4%" hint="after site costs" />
      </StatGrid>

      <Tabs defaultValue="invoices" className="gap-4">
        <TabsList className="w-full overflow-x-auto sm:w-auto">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profit">Profit</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Section title="Invoices">
            <ResponsiveTable columns={invoiceCols} rows={invoices} />
          </Section>
        </TabsContent>
        <TabsContent value="payments">
          <Section title="Payments received">
            <ResponsiveTable columns={paymentCols} rows={payments} />
          </Section>
        </TabsContent>
        <TabsContent value="expenses">
          <Section title="Project expenses">
            <ResponsiveTable columns={expenseCols} rows={expenses} />
          </Section>
        </TabsContent>
        <TabsContent value="profit">
          <Section title="Profit by project" description="Contract value less booked cost">
            <ul className="space-y-3">
              {[
                ["PRJ-118 Prestige Lakeside", "₹34.8 L", "₹9.1 L", "26%"],
                ["PRJ-115 Brew Lane Cafe", "₹41.2 L", "₹12.4 L", "30%"],
                ["PRJ-109 Kapoor Villa", "₹62.5 L", "₹14.8 L", "24%"],
                ["PRJ-104 Iyer Studio", "₹8.6 L", "₹2.1 L", "24%"],
              ].map(([name, value, profit, pct]) => (
                <li
                  key={name}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      Value {value} · profit {profit}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold">{pct}</span>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
