import type { Lead } from "@/data/mock";

function escapeCell(value: string | number): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function formatDateDMY(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}-${m}-${y}` : iso;
}

type CsvField = { header: string; value: (l: Lead) => string | number };

const COLUMN_FIELDS: Record<string, CsvField> = {
  name: { header: "Client name", value: (l) => l.contact },
  info: { header: "Client info", value: (l) => l.email },
  source: { header: "Source", value: (l) => l.source },
  status: { header: "Stage", value: (l) => l.stage },
  budget: { header: "Budget", value: (l) => l.budget },
  owner: { header: "Assigned to", value: (l) => l.owner },
  description: { header: "Description", value: (l) => l.description },
};

export function exportLeadsCsv(
  rows: Lead[],
  filename = "leads-export.csv",
  columns: string[] = [],
): number {
  const fields: CsvField[] = [{ header: "ID", value: (l) => l.id }];
  if (columns.length > 0) {
    for (const key of columns) {
      const field = COLUMN_FIELDS[key];
      if (field) fields.push(field);
    }
  } else {
    fields.push(
      { header: "Contact", value: (l) => l.contact },
      { header: "Project", value: (l) => l.name },
      { header: "City", value: (l) => l.city },
      { header: "Stage", value: (l) => l.stage },
      { header: "Source", value: (l) => l.source },
      { header: "Owner", value: (l) => l.owner },
      { header: "Budget", value: (l) => l.budget },
    );
  }
  fields.push({ header: "Created", value: (l) => formatDateDMY(l.createdAt) });

  const header = fields.map((f) => f.header).join(",");
  const lines = rows.map((l) => fields.map((f) => escapeCell(f.value(l))).join(","));
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return rows.length;
}
