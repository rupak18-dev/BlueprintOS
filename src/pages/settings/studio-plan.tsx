import { Check, CreditCard, Download } from "lucide-react";

import { Seo } from "@/components/seo";
import { PageHeader, Section, StatCard, StatGrid, StatusPill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { plans } from "@/data/mock";

const billing = [
  { id: "BL-4412", date: "01 Sep 2026", amount: "₹4,999", status: "Paid" },
  { id: "BL-4331", date: "01 Aug 2026", amount: "₹4,999", status: "Paid" },
  { id: "BL-4250", date: "01 Jul 2026", amount: "₹4,999", status: "Paid" },
];

export default function StudioPlanPage() {
  return (
    <>
      <Seo
        title="Studio Plan — subscription, seats and billing"
        description="Current plan, seat usage, invoices and upgrade options for your design studio."
      />

      <PageHeader
        title="Studio Plan"
        subtitle="You are on Studio Pro, billed monthly. Change plan or seats any time."
        actions={
          <Button size="sm">
            <CreditCard className="size-4" /> Manage payment
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Current plan" value="Studio Pro" hint="₹4,999 / month" accent />
        <StatCard label="Seats used" value="8 / 12" hint="4 available" />
        <StatCard label="Next renewal" value="01 Oct 2026" hint="auto-renew on" />
        <StatCard label="Storage" value="42 / 200 GB" hint="21% used" />
      </StatGrid>

      <Section title="Plans" description="Upgrade or downgrade instantly" className="mb-4">
        <ul className="grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <li
              key={p.name}
              className={`min-w-0 rounded-xl border p-4 ${p.highlight ? "border-brass/60 bg-accent/40" : "border-border"}`}
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="truncate text-base font-bold">{p.name}</p>
                {p.highlight && <Badge className="shrink-0">Current</Badge>}
              </div>
              <p className="mt-2 text-2xl font-bold">
                {p.price}{" "}
                <span className="text-sm font-normal text-muted-foreground">{p.period}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{p.for}</p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-brass" />
                    <span className="min-w-0 break-words">{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-4 w-full" variant={p.highlight ? "outline" : "default"}>
                {p.highlight ? "Current plan" : `Switch to ${p.name}`}
              </Button>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Billing history"
        actions={
          <Button size="sm" variant="outline">
            <Download className="size-4" /> Invoices
          </Button>
        }
      >
        <ul className="divide-y divide-border">
          {billing.map((b) => (
            <li
              key={b.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {b.id} · {b.amount}
                </p>
                <p className="truncate text-xs text-muted-foreground">{b.date}</p>
              </div>
              <StatusPill value={b.status} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
