import type { Lead } from "@/data/mock";

function escapeCell(value: string | number): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function formatDateDMY(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}-${m}-${y}` : iso;
}

export function exportLeadsCsv(rows: Lead[], filename = "leads-export.csv"): number {
  const header = [
    "ID",
    "Contact",
    "Project",
    "City",
    "Stage",
    "Source",
    "Owner",
    "Budget",
    "Created",
  ];
  const lines = rows.map((l) =>
    [
      l.id,
      l.contact,
      l.name,
      l.city,
      l.stage,
      l.source,
      l.owner,
      l.budget,
      formatDateDMY(l.createdAt),
    ]
      .map(escapeCell)
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");
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
