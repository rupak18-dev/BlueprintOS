import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader, Section } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studio } from "@/data/mock";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — your account and studio settings" },
      { name: "description", content: "Update your personal details, studio profile, notification preferences and security settings." },
      { property: "og:title", content: "Profile — your account and studio settings" },
      { property: "og:description", content: "Personal details, studio profile, notifications and security." },
    ],
  }),
  component: ProfilePage,
});

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} defaultValue={defaultValue} className="h-11" />
    </div>
  );
}

function ProfilePage() {
  return (
    <AppShell>
      <PageHeader
        title="Profile"
        subtitle="Your details and how the studio appears to clients."
        actions={
          <Button size="sm">
            <Save className="size-4" /> Save changes
          </Button>
        }
      />

      <Tabs defaultValue="personal" className="gap-4">
        <TabsList className="w-full overflow-x-auto sm:w-auto">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="studio">Studio</TabsTrigger>
          <TabsTrigger value="notify">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Section title="Personal details">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Field label="Full name" defaultValue="Devansh Shah" />
              <Field label="Role" defaultValue="Studio principal" />
              <Field label="Email" defaultValue="devansh@atelierverde.in" type="email" />
              <Field label="Phone" defaultValue="+91 98450 11223" type="tel" />
              <Field label="City" defaultValue="Bengaluru" />
              <Field label="Timezone" defaultValue="IST (GMT+5:30)" />
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="studio">
          <Section title="Studio profile" description="Shown on quotations and client presentations">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Field label="Studio name" defaultValue={studio.name} />
              <Field label="GSTIN" defaultValue="29ABCDE1234F1Z5" />
              <Field label="Website" defaultValue="atelierverde.in" />
            </div>
            <div className="mt-4 space-y-1.5">
              <Label>Studio address</Label>
              <Textarea
                rows={3}
                defaultValue="No. 14, 4th Cross, Indiranagar, Bengaluru 560038"
                className="resize-none"
              />
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="notify">
          <Section title="Notification preferences">
            <ul className="divide-y divide-border">
              {[
                ["Design approvals", "Email + in-app"],
                ["Overdue invoices", "Email + in-app"],
                ["Purchase order updates", "In-app"],
                ["New website leads", "Email + SMS"],
                ["Task reminders", "In-app"],
              ].map(([k, v]) => (
                <li key={k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 first:pt-0">
                  <span className="truncate text-sm font-medium">{k}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{v}</span>
                </li>
              ))}
            </ul>
          </Section>
        </TabsContent>

        <TabsContent value="security">
          <Section title="Security">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Field label="Current password" defaultValue="" type="password" />
              <Field label="New password" defaultValue="" type="password" />
              <Field label="Confirm new password" defaultValue="" type="password" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Two-factor authentication is off. Turn it on for studio-wide protection.
            </p>
            <Button variant="outline" className="mt-3">
              Enable two-factor
            </Button>
          </Section>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
