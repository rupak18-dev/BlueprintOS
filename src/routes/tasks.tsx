import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader, ResponsiveTable, Section, StatCard, StatGrid, StatusPill, type Column } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tasks } from "@/data/mock";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — studio to-dos by project" },
      { name: "description", content: "Assign, prioritise and track tasks across designers, managers and site crew." },
      { property: "og:title", content: "Tasks — studio to-dos by project" },
      { property: "og:description", content: "Assign and track tasks across the studio and site crew." },
    ],
  }),
  component: TasksPage,
});

type Task = (typeof tasks)[number];

const columns: Column<Task>[] = [
  { key: "title", header: "Task", primary: true, cell: (t) => t.title },
  { key: "project", header: "Project", cell: (t) => t.project },
  { key: "assignee", header: "Assignee", cell: (t) => t.assignee },
  { key: "due", header: "Due", cell: (t) => t.due, hide: "md" },
  { key: "priority", header: "Priority", cell: (t) => t.priority, hide: "lg" },
  { key: "state", header: "Status", cell: (t) => <StatusPill value={t.state} /> },
];

const boards = ["To do", "In progress", "Done"] as const;

function TasksPage() {
  return (
    <AppShell>
      <PageHeader
        title="Tasks"
        subtitle="What needs doing today, and who owns it."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> New task
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Open tasks" value="18" hint="4 due today" accent />
        <StatCard label="Overdue" value="2" hint="both high priority" />
        <StatCard label="Completed (7d)" value="23" hint="across 5 projects" />
        <StatCard label="Unassigned" value="3" hint="needs an owner" />
      </StatGrid>

      <Tabs defaultValue="list" className="gap-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="list" className="flex-1 sm:flex-none">
            List
          </TabsTrigger>
          <TabsTrigger value="board" className="flex-1 sm:flex-none">
            Board
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Section title="All tasks">
            <ResponsiveTable columns={columns} rows={tasks} />
          </Section>
        </TabsContent>

        <TabsContent value="board">
          <div className="grid gap-3 lg:grid-cols-3">
            {boards.map((b) => (
              <Section key={b} title={b} description={`${tasks.filter((t) => t.state === b).length} tasks`}>
                <ul className="space-y-3">
                  {tasks
                    .filter((t) => t.state === b)
                    .map((t) => (
                      <li key={t.id} className="min-w-0 rounded-lg border border-border p-3">
                        <p className="text-sm font-medium break-words">{t.title}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {t.project} · {t.assignee}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <StatusPill value={t.priority} />
                          <span className="text-xs text-muted-foreground">due {t.due}</span>
                        </div>
                      </li>
                    ))}
                  {tasks.filter((t) => t.state === b).length === 0 && (
                    <li className="py-6 text-center text-sm text-muted-foreground">Nothing here.</li>
                  )}
                </ul>
              </Section>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
