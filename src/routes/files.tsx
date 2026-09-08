import { createFileRoute } from "@tanstack/react-router";
import { Upload, Folder } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader, ResponsiveTable, Section, StatCard, StatGrid, type Column } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { files } from "@/data/mock";

export const Route = createFileRoute("/files")({
  head: () => ({
    meta: [
      { title: "Files — drawings, renders and documents" },
      { name: "description", content: "Every drawing, render, quotation and sheet stored against its project with version history." },
      { property: "og:title", content: "Files — drawings, renders and documents" },
      { property: "og:description", content: "Project drawings, renders and documents in one place." },
    ],
  }),
  component: FilesPage,
});

type FileRow = (typeof files)[number];

const columns: Column<FileRow>[] = [
  { key: "name", header: "File", primary: true, cell: (f) => f.name },
  { key: "project", header: "Project", cell: (f) => f.project },
  { key: "type", header: "Type", cell: (f) => f.type },
  { key: "size", header: "Size", cell: (f) => f.size, hide: "md" },
  { key: "by", header: "Uploaded by", cell: (f) => f.by, hide: "lg" },
  { key: "date", header: "Date", cell: (f) => f.date, hide: "xl" },
];

const folders = ["Drawings", "Renders", "Quotations", "Site photos", "Contracts", "Invoices"];

function FilesPage() {
  return (
    <AppShell>
      <PageHeader
        title="Files"
        subtitle="Shared storage for drawings, renders and documents, organised by project."
        actions={
          <Button size="sm">
            <Upload className="size-4" /> Upload
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Files" value="1,864" hint="128 this month" accent />
        <StatCard label="Storage used" value="42 GB" hint="of 200 GB" />
        <StatCard label="Shared links" value="18" hint="6 with clients" />
        <StatCard label="Latest upload" value="Today" hint="Kitchen GA drawings" />
      </StatGrid>

      <Section title="Folders" className="mb-4">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {folders.map((f) => (
            <li key={f} className="min-w-0 rounded-xl border border-border p-3 text-center">
              <Folder className="mx-auto size-6 text-brass" />
              <p className="mt-2 truncate text-sm font-medium">{f}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Recent files">
        <ResponsiveTable
          columns={columns}
          rows={files}
          renderCardAction={() => (
            <Button size="sm" variant="ghost">
              Open
            </Button>
          )}
        />
      </Section>
    </AppShell>
  );
}
