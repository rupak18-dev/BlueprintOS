import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ChevronRight } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader, Section, StatCard, StatGrid, StatusPill, ResponsiveTable, type Column } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects, type Project } from "@/data/mock";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — design and execution" },
      { name: "description", content: "Every live interior project with stage, progress, value, team and handover date." },
      { property: "og:title", content: "Projects — design and execution" },
      { property: "og:description", content: "Stage, progress, budget and handover across all projects." },
    ],
  }),
  component: ProjectsPage,
});

const columns: Column<Project>[] = [
  {
    key: "name",
    header: "Project",
    primary: true,
    cell: (p) => (
      <Link to="/projects/$projectId" params={{ projectId: p.id }} className="block min-w-0">
        <span className="block truncate">{p.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {p.id} · {p.client}
        </span>
      </Link>
    ),
  },
  { key: "type", header: "Type", cell: (p) => p.type, hide: "lg" },
  { key: "stage", header: "Stage", cell: (p) => <StatusPill value={p.stage} /> },
  {
    key: "progress",
    header: "Progress",
    cell: (p) => (
      <div className="min-w-24">
        <Progress value={p.progress} className="h-2" />
        <span className="mt-1 block text-xs text-muted-foreground">{p.progress}%</span>
      </div>
    ),
  },
  { key: "value", header: "Value", cell: (p) => p.value },
  { key: "manager", header: "Manager", cell: (p) => p.manager, hide: "xl" },
  { key: "handover", header: "Handover", cell: (p) => p.handover, hide: "md" },
];

function ProjectsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Projects"
        subtitle="Design, production and site execution for every won client."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> New project
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Active" value="9" hint="2 nearing handover" accent />
        <StatCard label="In design" value="4" hint="3 awaiting approval" />
        <StatCard label="On site" value="3" hint="1 delayed" />
        <StatCard label="Order book" value="₹1.47 Cr" hint="unbilled ₹52 L" />
      </StatGrid>

      <div className="mb-4 grid grid-cols-[minmax(0,1fr)] gap-3 sm:flex sm:items-center sm:justify-between">
        <Tabs defaultValue="all">
          <TabsList className="w-full overflow-x-auto sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="handover">Handover</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input placeholder="Search projects" className="h-11 sm:max-w-xs" />
      </div>

      <Section title="All projects" description={`${projects.length} shown`}>
        <ResponsiveTable
          columns={columns}
          rows={projects}
          renderCardAction={(p) => (
            <Link to="/projects/$projectId" params={{ projectId: p.id }} aria-label={`Open ${p.name}`}>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          )}
        />
      </Section>
    </AppShell>
  );
}
