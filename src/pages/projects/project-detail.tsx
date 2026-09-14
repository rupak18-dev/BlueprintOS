import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Box, MonitorPlay } from "lucide-react";

import { Seo } from "@/components/seo";
import { NotFoundPage } from "@/pages/NotFound";
import {
  DetailList,
  PageHeader,
  Section,
  StatCard,
  StatGrid,
  StatusPill,
} from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { files, projects, purchaseOrders, tasks, type Project } from "@/data/mock";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | undefined>(() =>
    projects.find((p) => p.id === projectId),
  );

  useEffect(() => {
    setProject(projects.find((p) => p.id === projectId));
  }, [projectId]);

  if (!project) return <NotFoundPage />;

  const projectTasks = tasks.filter((t) => t.project === project.id);
  const projectFiles = files.filter((f) => f.project === project.id);
  const projectPOs = purchaseOrders.filter((p) => p.project === project.id);

  return (
    <>
      <Seo
        title={`${project.name} — project detail`}
        description={`Rooms, timeline, budget and team for ${project.name}.`}
      />

      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/projects">
          <ArrowLeft className="size-4" /> All projects
        </Link>
      </Button>

      <PageHeader
        eyebrow={`${project.id} · ${project.type}`}
        title={project.name}
        subtitle={`${project.client} · manager ${project.manager} · handover ${project.handover}`}
        actions={
          <>
            <Button asChild size="sm" variant="outline">
              <Link to="/studio">
                <Box className="size-4" /> Open 3D studio
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/presentation">
                <MonitorPlay className="size-4" /> Present
              </Link>
            </Button>
          </>
        }
      />

      <StatGrid>
        <StatCard label="Stage" value={project.stage} hint={`started ${project.start}`} accent />
        <StatCard label="Progress" value={`${project.progress}%`} hint="overall completion" />
        <StatCard label="Contract value" value={project.value} hint="incl. taxes" />
        <StatCard label="Rooms" value={String(project.rooms.length)} hint="in scope" />
      </StatGrid>

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList className="w-full overflow-x-auto sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 xl:grid-cols-3">
          <Section title="Project details" className="xl:col-span-2">
            <DetailList
              items={[
                { label: "Client", value: project.client },
                { label: "Type", value: project.type },
                { label: "Manager", value: project.manager },
                { label: "Start", value: project.start },
                { label: "Handover", value: project.handover },
                { label: "Stage", value: <StatusPill value={project.stage} /> },
              ]}
            />
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Completion</p>
              <Progress value={project.progress} className="mt-2 h-2.5" />
            </div>
          </Section>
          <Section title="Open tasks">
            {projectTasks.length ? (
              <ul className="space-y-3">
                {projectTasks.map((t) => (
                  <li key={t.id} className="min-w-0 rounded-lg border border-border p-3">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {t.assignee} · due {t.due}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No open tasks.</p>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="rooms">
          <Section title="Rooms" description="Design status per room">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {project.rooms.map((r) => (
                <li key={r.room} className="min-w-0 rounded-lg border border-border p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <p className="truncate text-sm font-semibold">{r.room}</p>
                    <StatusPill value={r.status} />
                  </div>
                  <p className="mt-2 truncate text-xs text-muted-foreground">
                    Designer: {r.designer}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="timeline" className="grid gap-4 xl:grid-cols-2">
          <Section title="Milestones">
            <ol className="relative space-y-5 border-l border-border pl-5">
              {project.milestones.map((m) => (
                <li key={m.name} className="min-w-0">
                  <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-brass" />
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <p className="truncate text-sm font-semibold">{m.name}</p>
                    <StatusPill value={m.state} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.date}</p>
                </li>
              ))}
            </ol>
          </Section>
          <Section title="Purchase orders">
            {projectPOs.length ? (
              <ul className="space-y-3">
                {projectPOs.map((p) => (
                  <li key={p.id} className="min-w-0 rounded-lg border border-border p-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <p className="truncate text-sm font-semibold">
                        {p.id} · {p.vendor}
                      </p>
                      <StatusPill value={p.status} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {p.items} items · {p.amount} · ETA {p.eta}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No purchase orders yet.</p>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="budget">
          <Section title="Budget vs actual">
            <ul className="space-y-4">
              {project.budget.map((b) => (
                <li key={b.head} className="min-w-0">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <span className="truncate text-sm font-medium">{b.head}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      planned {b.planned} · actual {b.actual}
                    </span>
                  </div>
                  <Progress value={70} className="mt-2 h-2" />
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="team">
          <Section title="Project team">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {project.team.map((t) => (
                <li key={t.name} className="min-w-0 rounded-lg border border-border p-3">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="files">
          <Section title="Project files">
            {projectFiles.length ? (
              <ul className="divide-y divide-border">
                {projectFiles.map((f) => (
                  <li
                    key={f.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{f.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {f.type} · {f.size} · {f.by} · {f.date}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0">
                      Open
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No files uploaded.</p>
            )}
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
