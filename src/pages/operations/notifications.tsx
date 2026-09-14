import { CheckCheck, Bell } from "lucide-react";

import { Seo } from "@/components/seo";
import { PageHeader, Section, StatCard, StatGrid } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/data/mock";

export default function NotificationsPage() {
  return (
    <>
      <Seo
        title="Notifications — approvals, finance and site alerts"
        description="Design approvals, overdue invoices, dispatches and new leads in one activity feed."
      />

      <PageHeader
        title="Notifications"
        subtitle="Approvals, money and site updates as they happen."
        actions={
          <Button size="sm" variant="outline">
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Unread" value="4" hint="1 needs action" accent />
        <StatCard label="Approvals" value="2" hint="client design sign-off" />
        <StatCard label="Finance alerts" value="1" hint="overdue invoice" />
        <StatCard label="This week" value="27" hint="across all modules" />
      </StatGrid>

      <Section title="Activity feed">
        <ul className="divide-y divide-border">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-4 first:pt-0"
            >
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-accent">
                <Bell className="size-4 text-brass" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium break-words">{n.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{n.meta}</p>
              </div>
              <Badge variant="outline" className="shrink-0 text-[11px]">
                {n.type}
              </Badge>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
