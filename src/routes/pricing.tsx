import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { SiteShell } from "@/components/site-shell";
import { plans } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Atelier Verde studio plans" },
      {
        name: "description",
        content: "Solo, Studio Pro and Enterprise plans for interior design studios, with 2D planning and 3D/VR included.",
      },
      { property: "og:title", content: "Pricing — Atelier Verde studio plans" },
      { property: "og:description", content: "Plans for solo designers, growing studios and multi-branch firms." },
    ],
  }),
  component: PricingPage,
});

const faqs = [
  ["Can I switch plans later?", "Yes — plans change from the Studio Plan screen and pricing is prorated."],
  ["Are VR walkthroughs included?", "Studio Pro and Enterprise include VR walkthrough sharing with clients."],
  ["Do clients need an account?", "No. Presentation links open in any browser on phone, tablet or laptop."],
  ["Is there a free trial?", "Every plan starts with a 14-day trial of the full workspace."],
];

function PricingPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Pricing</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          One price per studio. Every plan includes the CRM, 2D planner and asset library.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={p.highlight ? "border-brass/60 shadow-panel" : ""}>
              <CardContent className="flex min-w-0 flex-col px-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="truncate text-base font-bold">{p.name}</p>
                  {p.highlight && (
                    <Badge className="shrink-0 bg-brass text-brass-foreground">Most popular</Badge>
                  )}
                </div>
                <p className="mt-3 text-3xl font-extrabold">
                  {p.price} <span className="text-sm font-normal text-muted-foreground">{p.period}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{p.for}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      <span className="min-w-0">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full" variant={p.highlight ? "default" : "outline"}>
                  <Link to="/signup">Start 14-day trial</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-xl font-bold sm:text-2xl">Common questions</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {faqs.map(([q, a]) => (
              <Card key={q}>
                <CardContent className="px-5">
                  <p className="font-semibold">{q}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
