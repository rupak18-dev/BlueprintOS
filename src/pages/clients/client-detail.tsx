import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";

import { Seo } from "@/components/seo";
import { NotFoundPage } from "@/pages/NotFound";
import { DetailList, PageHeader, Section, StatusPill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { clients, invoices, projects, threads, type Client } from "@/data/mock";

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const [client, setClient] = useState<Client | undefined>(() =>
    clients.find((c) => c.id === clientId),
  );

  useEffect(() => {
    setClient(clients.find((c) => c.id === clientId));
  }, [clientId]);

  if (!client) return <NotFoundPage />;

  const clientProjects = projects.filter((p) => client.projects.includes(p.id));
  const clientInvoices = invoices.filter((i) => i.client === client.name);
  const clientThreads = threads.filter((t) => t.with === client.name);

  return (
    <>
      <Seo
        title={`${client.name} — client record`}
        description={`Projects, invoices and conversation history for ${client.name}.`}
      />

      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/clients">
          <ArrowLeft className="size-4" /> All clients
        </Link>
      </Button>

      <PageHeader
        eyebrow={`${client.id} · client since ${client.since}`}
        title={client.name}
        subtitle={client.company !== "—" ? client.company : client.city}
        actions={
          <>
            <Button size="sm" variant="outline">
              <Phone className="size-4" /> Call
            </Button>
            <Button size="sm" variant="outline">
              <Mail className="size-4" /> Email
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Section title="Contact details" className="xl:col-span-2">
          <DetailList
            items={[
              { label: "Email", value: client.email },
              { label: "Phone", value: client.phone },
              { label: "City", value: client.city },
              { label: "Company", value: client.company },
              { label: "Lifetime value", value: client.value },
              { label: "Client since", value: client.since },
            ]}
          />
          <p className="mt-6 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            {client.notes}
          </p>
        </Section>

        <Section title="Projects">
          <ul className="space-y-3">
            {clientProjects.map((p) => (
              <li key={p.id} className="min-w-0 rounded-lg border border-border p-3">
                <Link to={`/projects/${p.id}`} className="block min-w-0">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <StatusPill value={p.stage} />
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {p.value} · handover {p.handover}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Invoices" className="xl:col-span-2">
          {clientInvoices.length ? (
            <ul className="divide-y divide-border">
              {clientInvoices.map((i) => (
                <li
                  key={i.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {i.id} · {i.amount}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {i.project} · due {i.due}
                    </p>
                  </div>
                  <StatusPill value={i.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No invoices raised.</p>
          )}
        </Section>

        <Section title="Conversations">
          {clientThreads.length ? (
            <ul className="space-y-3">
              {clientThreads.map((t) => (
                <li key={t.id} className="min-w-0 rounded-lg border border-border p-3">
                  <p className="truncate text-sm font-semibold">{t.subject}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{t.last}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{t.when}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No conversations yet.</p>
          )}
        </Section>
      </div>
    </>
  );
}
