import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { DetailList, PageHeader, Section, StatusPill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { crew, projects, tasks } from "@/data/mock";

export const Route = createFileRoute("/crew/$memberId")({
  loader: ({ params }) => {
    const member = crew.find((m) => m.id === params.memberId);
    if (!member) throw notFound();
    return { member };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Team member not found" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.member.name} — team member`;
    const description = `Role, assignments and open tasks for ${loaderData.member.name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: MemberDetail,
});

function MemberDetail() {
  const { member } = Route.useLoaderData();
  const assigned = projects.filter((p) => p.team.some((t) => t.name === member.name) || p.manager === member.name);
  const myTasks = tasks.filter((t) => t.assignee === member.name);

  return (
    <AppShell>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/crew">
          <ArrowLeft className="size-4" /> Crew & Staff
        </Link>
      </Button>

      <PageHeader
        eyebrow={`${member.id} · ${member.type}`}
        title={member.name}
        subtitle={member.role}
        actions={
          <Button size="sm" variant="outline">
            <Phone className="size-4" /> Call
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Section title="Details" className="xl:col-span-2">
          <DetailList
            items={[
              { label: "Role", value: member.role },
              { label: "Type", value: member.type },
              { label: "Phone", value: member.phone },
              { label: "Rate", value: member.rate },
              { label: "Active projects", value: `${member.projects}` },
              { label: "Status", value: <StatusPill value={member.status} /> },
            ]}
          />
        </Section>

        <Section title="Open tasks">
          {myTasks.length ? (
            <ul className="space-y-3">
              {myTasks.map((t) => (
                <li key={t.id} className="min-w-0 rounded-lg border border-border p-3">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {t.project} · due {t.due}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No open tasks.</p>
          )}
        </Section>

        <Section title="Assigned projects" className="xl:col-span-3">
          {assigned.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {assigned.map((p) => (
                <li key={p.id} className="min-w-0 rounded-lg border border-border p-3">
                  <Link to="/projects/$projectId" params={{ projectId: p.id }} className="block min-w-0">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <StatusPill value={p.stage} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{p.client}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Not assigned to a project yet.</p>
          )}
        </Section>
      </div>
    </AppShell>
  );
}
