import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ArrowRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";

import { AppShell } from "@/components/app-shell";
import { PageHeader, Section, StatCard, StatGrid, StatusPill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { events, kpis, notifications, pipeline, projects, revenueSeries, tasks } from "@/data/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — studio overview" },
      { name: "description", content: "Pipeline, active projects, upcoming visits and collections at a glance." },
      { property: "og:title", content: "Dashboard — studio overview" },
      { property: "og:description", content: "Pipeline, active projects, upcoming visits and collections at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Tuesday, 8 September 2026"
        title="Studio overview"
        subtitle="Where the business stands today across leads, projects and money."
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link to="/projects">New project</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/leads">
                <Plus className="size-4" /> New lead
              </Link>
            </Button>
          </>
        }
      />

      <StatGrid>
        {kpis.map((k, i) => (
          <StatCard key={k.label} label={k.label} value={k.value} hint={k.delta} accent={i === 0} />
        ))}
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-3">
        <Section
          title="Quoted vs collected"
          description="₹ lakh, last six months"
          className="xl:col-span-2"
        >
          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="q" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <RTooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area dataKey="quoted" stroke="var(--color-chart-1)" fill="url(#q)" strokeWidth={2} />
                <Area dataKey="collected" stroke="var(--color-chart-3)" fill="url(#c)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Lead pipeline" description="Count and value by stage">
          <ul className="space-y-3">
            {pipeline.map((p) => (
              <li key={p.stage} className="min-w-0">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <span className="truncate text-sm font-medium">{p.stage}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {p.count} · {p.value}
                  </span>
                </div>
                <Progress value={p.count * 14} className="mt-2 h-2" />
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Active projects"
          className="xl:col-span-2"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to="/projects">
                All <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        >
          <ul className="divide-y divide-border">
            {projects.slice(0, 3).map((p) => (
              <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                <Link
                  to="/projects/$projectId"
                  params={{ projectId: p.id }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.client} · {p.stage} · handover {p.handover}
                    </p>
                    <Progress value={p.progress} className="mt-2 h-1.5" />
                  </div>
                  <span className="shrink-0 text-sm font-semibold">{p.value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Today & next"
          actions={
            <Button asChild size="sm" variant="ghost">
              <Link to="/calendar">Calendar</Link>
            </Button>
          }
        >
          <ul className="space-y-3">
            {events.slice(0, 4).map((e) => (
              <li key={e.id} className="min-w-0 rounded-lg border border-border p-3">
                <p className="truncate text-sm font-medium">{e.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {e.day} · {e.time} · {e.with}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="My tasks" className="xl:col-span-2">
          <ul className="divide-y divide-border">
            {tasks.slice(0, 4).map((t) => (
              <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.project} · due {t.due}
                  </p>
                </div>
                <StatusPill value={t.state} />
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Recent activity">
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.meta}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </AppShell>
  );
}
