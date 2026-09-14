import { Send, Plus } from "lucide-react";

import { Seo } from "@/components/seo";
import { PageHeader, Section, StatCard, StatGrid } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { threads } from "@/data/mock";

const conversation = [
  {
    from: "Ananya Rao",
    text: "Can we see the fluted option in walnut?",
    when: "12 min ago",
    mine: false,
  },
  {
    from: "You",
    text: "Yes — sharing a render in walnut and oak by evening.",
    when: "9 min ago",
    mine: true,
  },
  {
    from: "Ananya Rao",
    text: "Perfect. Also confirm the counter height.",
    when: "6 min ago",
    mine: false,
  },
];

export default function MessagesPage() {
  const thread0 = threads[0]!;

  return (
    <>
      <Seo
        title="Communication — client and team conversations"
        description="Project-linked conversations with clients, crew and vendors so nothing lives in personal chats."
      />

      <PageHeader
        title="Communication"
        subtitle="Every message tied to a project, so context stays with the work."
        actions={
          <Button size="sm">
            <Plus className="size-4" /> New thread
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Open threads" value="12" hint="3 unread" accent />
        <StatCard label="Awaiting client" value="4" hint="oldest 2 days" />
        <StatCard label="Vendor threads" value="5" hint="2 need pricing" />
        <StatCard label="Avg response" value="2.4 h" hint="last 30 days" />
      </StatGrid>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Section title="Threads">
          <ul className="space-y-2">
            {threads.map((t, i) => (
              <li
                key={t.id}
                className={`min-w-0 rounded-lg border p-3 ${i === 0 ? "border-brass/50 bg-accent/40" : "border-border"}`}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="truncate text-sm font-semibold">{t.subject}</p>
                  {t.unread > 0 && <Badge className="shrink-0">{t.unread}</Badge>}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {t.with} · {t.project}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{t.last}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{t.when}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={thread0.subject} description={`${thread0.with} · ${thread0.project}`}>
          <ul className="space-y-3">
            {conversation.map((m, i) => (
              <li key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-2.5 sm:max-w-[70%] ${
                    m.mine ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm break-words">{m.text}</p>
                  <p
                    className={`mt-1 text-[11px] ${m.mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {m.from} · {m.when}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <form className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <Input placeholder="Write a message" className="h-11" />
            <Button type="button" size="icon" className="size-11 shrink-0">
              <Send className="size-4" />
            </Button>
          </form>
        </Section>
      </div>
    </>
  );
}
