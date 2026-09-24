import { Link } from "react-router-dom";
import { ArrowRight, Boxes, LineChart, Ruler, Users, Wallet, MonitorPlay } from "lucide-react";

import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { gallery, plans } from "@/data/mock";

const steps = [
  {
    icon: Users,
    title: "Capture the lead",
    text: "Enquiry details, requirements and site notes in one record.",
  },
  {
    icon: Wallet,
    title: "Quote and win",
    text: "Room-wise estimates roll up into a client-ready quotation.",
  },
  {
    icon: Ruler,
    title: "Plan in 2D",
    text: "Accurate floor plans with walls, openings and room areas.",
  },
  {
    icon: Boxes,
    title: "Design in 3D / VR",
    text: "Furnish from your asset library and walk the space.",
  },
  {
    icon: MonitorPlay,
    title: "Present and approve",
    text: "Share a link, collect comments, get sign-off.",
  },
  {
    icon: LineChart,
    title: "Execute and track",
    text: "Procurement, crew, payments and margin per project.",
  },
];

export default function HomePage() {
  return (
    <>
      <Seo
        title="Canvas — interior design studio workspace"
        description="One workspace for interior designers: capture leads, quote, design in 2D and 3D/VR, present to clients, and manage procurement and accounts."
      />

      <section className="border-b border-border bg-gradient-to-b from-accent/50 to-background">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="min-w-0">
              <Badge
                variant="outline"
                className="border-brass/50 bg-brass/15 text-brass-foreground"
              >
                CRM + 2D + 3D / VR
              </Badge>
              <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl">
                Run the whole design business, not just the drawings.
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                Canvas takes an interior project from first enquiry to final handover — quotations,
                floor plans, VR walkthroughs, client approvals, procurement and accounts in a single
                studio workspace.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/dashboard">
                    Open the studio <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/gallery">See sample work</Link>
                </Button>
              </div>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
                {[
                  ["9", "active projects"],
                  ["₹2.05 Cr", "won this year"],
                  ["12", "studio seats"],
                ].map(([v, l]) => (
                  <div key={l} className="min-w-0">
                    <dt className="text-lg font-bold sm:text-xl">{v}</dt>
                    <dd className="truncate text-xs text-muted-foreground sm:text-sm">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {gallery.slice(0, 4).map((g) => (
                <div
                  key={g.title}
                  className={`flex min-h-32 flex-col justify-end rounded-2xl bg-gradient-to-br ${g.tone} to-muted p-4 shadow-panel sm:min-h-44`}
                >
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {g.tag}
                  </p>
                  <p className="truncate text-sm font-semibold">{g.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">The full business loop</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Design is the visual layer. The platform keeps the commercial workflow around it.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title}>
              <CardContent className="min-w-0 px-5">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-muted-foreground">Step {i + 1}</p>
                    <h3 className="truncate text-base font-semibold">{s.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold sm:text-3xl">Plans that fit the studio</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start solo, grow into a full studio team.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link to="/pricing">All plans</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.name} className={p.highlight ? "border-brass/60 shadow-panel" : ""}>
                <CardContent className="px-5">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="mt-2 text-2xl font-bold">
                    {p.price}{" "}
                    <span className="text-sm font-normal text-muted-foreground">{p.period}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.for}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
