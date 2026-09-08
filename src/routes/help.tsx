import { createFileRoute } from "@tanstack/react-router";
import { Search, LifeBuoy, Mail, MessageSquare } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader, Section } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { helpArticles } from "@/data/mock";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — guides and support" },
      { name: "description", content: "Step-by-step guides for leads, quotations, the 2D planner, 3D studio, procurement and team setup." },
      { property: "og:title", content: "Help Center — guides and support" },
      { property: "og:description", content: "Guides for every part of the studio workspace, plus support contacts." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  ["How do I turn a won lead into a project?", "Open the lead, go to the Quotation tab and mark it won. A project is created with the rooms and estimate already carried over."],
  ["Can clients comment without an account?", "Yes. A presentation link is view-only and password protected; clients can approve rooms and leave comments without signing up."],
  ["How are seats counted?", "Every staff member with a login uses one seat. Vendor crews and clients do not consume seats."],
  ["Does the 2D plan sync to the 3D studio?", "Walls, doors and windows carry across. Furniture placement stays editable separately in the 3D studio."],
];

function HelpPage() {
  return (
    <AppShell>
      <PageHeader
        title="Help Center"
        subtitle="Guides, answers and a direct line to support."
        actions={
          <Button size="sm">
            <MessageSquare className="size-4" /> Chat with support
          </Button>
        }
      />

      <div className="mb-6 relative sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search help articles" className="h-11 pl-9" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Section title="Popular guides" className="xl:col-span-2">
          <ul className="grid gap-3 sm:grid-cols-2">
            {helpArticles.map((a) => (
              <li key={a.title} className="min-w-0 rounded-xl border border-border p-3">
                <p className="text-sm font-semibold break-words">{a.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[11px]">
                    {a.cat}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{a.read} read</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Contact support">
          <ul className="space-y-3">
            <li className="flex gap-3 rounded-lg border border-border p-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-brass" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">Email</p>
                <p className="truncate text-xs text-muted-foreground">support@atelierverde.in</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-lg border border-border p-3">
              <LifeBuoy className="mt-0.5 size-5 shrink-0 text-brass" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">Priority support</p>
                <p className="text-xs text-muted-foreground">Included with Studio Pro · replies within 4 hours</p>
              </div>
            </li>
          </ul>
        </Section>

        <Section title="Frequently asked" className="xl:col-span-3">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left text-sm">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </div>
    </AppShell>
  );
}
