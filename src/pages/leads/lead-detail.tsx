import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Phone, MessageSquare } from "lucide-react";

import { Seo } from "@/components/seo";
import { NotFoundPage } from "@/pages/NotFound";
import { DetailList, PageHeader, Section, StatusPill } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { leads, type Lead } from "@/data/mock";
import { formatDateDMY } from "@/lib/export-csv";
import { loadExtraLeads } from "@/lib/lead-form-storage";

function findLead(leadId?: string): Lead | undefined {
  if (!leadId) return undefined;
  return loadExtraLeads().find((l) => l.id === leadId) ?? leads.find((l) => l.id === leadId);
}

export default function LeadDetailPage() {
  const { leadId } = useParams();
  const [lead, setLead] = useState<Lead | undefined>(() => findLead(leadId));

  useEffect(() => {
    setLead(findLead(leadId));
  }, [leadId]);

  if (!lead) return <NotFoundPage />;

  return (
    <>
      <Seo
        title={`${lead.name} — lead detail`}
        description={`Requirements, room notes and estimate for ${lead.name}.`}
      />

      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/leads">
          <ArrowLeft className="size-4" /> All leads
        </Link>
      </Button>

      <PageHeader
        eyebrow={`${lead.id} · ${lead.source}`}
        title={lead.name}
        subtitle={`${lead.scope} · ${lead.city} · owner ${lead.owner}`}
        actions={
          <>
            <Button size="sm" variant="outline">
              <Phone className="size-4" /> Call
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="size-4" /> Message
            </Button>
            <Button size="sm">
              <FileText className="size-4" /> Send quotation
            </Button>
          </>
        }
      />

      <div className="mb-4">
        <StatusPill value={lead.stage} />
      </div>

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList className="w-full overflow-x-auto sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="estimate">Estimate</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-4 xl:grid-cols-3">
          <Section title="Contact & scope" className="xl:col-span-2">
            <DetailList
              items={[
                { label: "Contact", value: lead.contact },
                { label: "Role", value: lead.role || "—" },
                { label: "Phone", value: lead.phone },
                {
                  label: "Alt. numbers",
                  value:
                    lead.alternatePhones && lead.alternatePhones.length > 0
                      ? lead.alternatePhones.join(", ")
                      : "—",
                },
                { label: "Email", value: lead.email || "—" },
                { label: "City", value: lead.city },
                { label: "Scope", value: lead.scope },
                { label: "Budget", value: lead.budget },
                { label: "Sales owner", value: lead.salesOwner || "—" },
                { label: "Assigned to", value: lead.owner },
                {
                  label: "Tentative start",
                  value: lead.tentativeStart ? formatDateDMY(lead.tentativeStart) : "—",
                },
                { label: "Financial year", value: lead.financialYear || "—" },
                { label: "Latest remark", value: lead.latestRemark || "—" },
                { label: "Meta details", value: lead.metaDetails || "—" },
                { label: "Rating", value: lead.rating ? `${lead.rating} / 5` : "—" },
                { label: "Tags", value: lead.tags?.length ? lead.tags.join(", ") : "—" },
                { label: "Tax IDs", value: lead.taxIds || "—" },
                { label: "Last update", value: lead.updated },
              ]}
            />
          </Section>
          <Section title="Requirements">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {lead.requirements.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="rooms">
          <Section title="Rooms in scope">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {lead.rooms.map((r) => (
                <li key={r.room} className="min-w-0 rounded-lg border border-border p-3">
                  <p className="truncate text-sm font-semibold">{r.room}</p>
                  <p className="text-xs text-muted-foreground">{r.area}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{r.note}</p>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="estimate">
          <Section title="Room-wise estimate" description="Rolls up into the quotation">
            <div className="hidden overflow-x-auto sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lead.estimate.map((e) => (
                    <TableRow key={e.item}>
                      <TableCell className="font-medium">{e.item}</TableCell>
                      <TableCell>{e.qty}</TableCell>
                      <TableCell>{e.rate}</TableCell>
                      <TableCell className="text-right">{e.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ul className="space-y-3 sm:hidden">
              {lead.estimate.map((e) => (
                <li key={e.item} className="rounded-lg border border-border p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <p className="truncate text-sm font-semibold">{e.item}</p>
                    <p className="shrink-0 text-sm font-semibold">{e.amount}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {e.qty} @ {e.rate}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="quotation">
          <Section
            title="Quotation"
            description="Generated from the estimate, shared with the client"
            actions={<Button size="sm">Share link</Button>}
          >
            <DetailList
              items={[
                { label: "Quotation no.", value: `QT-${lead.id.slice(3)}` },
                { label: "Version", value: "v2 (revised)" },
                { label: "Valid till", value: "30 Sep 2026" },
                { label: "Total", value: lead.budget },
                { label: "Payment terms", value: "50% advance, 40% dispatch, 10% handover" },
                { label: "Status", value: <StatusPill value="In review" /> },
              ]}
            />
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
