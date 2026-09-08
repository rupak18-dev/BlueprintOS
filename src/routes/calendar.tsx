import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader, Section, StatusPill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { events } from "@/data/mock";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — site visits, meetings and deadlines" },
      { name: "description", content: "Month, week and day views of site visits, client presentations and project deadlines." },
      { property: "og:title", content: "Calendar — site visits, meetings and deadlines" },
      { property: "og:description", content: "Month, week and day views for the whole studio." },
    ],
  }),
  component: CalendarPage,
});

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthCells = Array.from({ length: 35 }, (_, i) => i - 1);
const dayEvents: Record<number, string[]> = {
  8: ["Site visit — Whitefield", "Design presentation"],
  9: ["Factory dispatch review"],
  10: ["Snag walkthrough"],
  11: ["Lead call — Hebbal"],
  16: ["Client approval due"],
  22: ["Invoice INV-2261 due"],
};

function CalendarPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="September 2026"
        title="Calendar"
        subtitle="Everything scheduled across leads, projects and the studio team."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> New event
          </Button>
        }
      />

      <Tabs defaultValue="month" className="gap-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="month" className="flex-1 sm:flex-none">
            Month
          </TabsTrigger>
          <TabsTrigger value="week" className="flex-1 sm:flex-none">
            Week
          </TabsTrigger>
          <TabsTrigger value="day" className="flex-1 sm:flex-none">
            Day
          </TabsTrigger>
        </TabsList>

        <TabsContent value="month">
          {/* Phone: agenda list. Tablet and up: month grid. */}
          <div className="sm:hidden">
            <Section title="Agenda" description="Upcoming this month">
              <ul className="space-y-3">
                {events.map((e) => (
                  <li key={e.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {e.day} · {e.time}
                    </p>
                    <div className="mt-2">
                      <StatusPill value={e.type} />
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-border bg-card sm:block">
            <div className="grid grid-cols-7 border-b border-border">
              {weekDays.map((d) => (
                <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {monthCells.map((day) => (
                <div
                  key={day}
                  className="min-h-24 min-w-0 border-b border-r border-border p-2 last:border-r-0 lg:min-h-28"
                >
                  <p className="text-xs font-semibold text-muted-foreground">{day > 0 && day <= 30 ? day : ""}</p>
                  <ul className="mt-1 space-y-1">
                    {(dayEvents[day] ?? []).map((e) => (
                      <li
                        key={e}
                        className="truncate rounded bg-accent px-1.5 py-1 text-[11px] font-medium text-accent-foreground"
                      >
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week">
          <Section title="Week of 7 – 13 September">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {events.map((e) => (
                <div key={e.id} className="min-w-0 rounded-lg border border-border p-3">
                  <p className="truncate text-sm font-semibold">{e.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {e.day} · {e.time}
                  </p>
                  <p className="mt-2 truncate text-xs text-muted-foreground">With {e.with}</p>
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="day">
          <Section title="Tuesday, 8 September">
            <ul className="divide-y divide-border">
              {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map((slot) => {
                const match = events.find((e) => e.day === "Tue 8 Sep" && e.time.startsWith(slot.slice(0, 2)));
                return (
                  <li key={slot} className="grid grid-cols-[4rem_minmax(0,1fr)] gap-3 py-3">
                    <span className="text-xs text-muted-foreground">{slot}</span>
                    {match ? (
                      <div className="min-w-0 rounded-lg bg-accent px-3 py-2">
                        <p className="truncate text-sm font-medium text-accent-foreground">{match.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{match.time}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Section>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
