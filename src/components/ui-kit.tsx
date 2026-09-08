import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PageHeader({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="text-xl font-bold break-words sm:truncate sm:text-2xl lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <Card className={cn("gap-0 py-4", accent && "border-brass/50 bg-accent/40")}>
      <CardContent className="px-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground break-words">{label}</p>
        <p className="mt-2 text-xl font-bold sm:text-2xl">{value}</p>
        {hint && <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>;
}

export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="truncate text-base">{title}</CardTitle>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="min-w-0">{children}</CardContent>
    </Card>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Hide this column below the given breakpoint on the desktop table. */
  hide?: "md" | "lg" | "xl";
  primary?: boolean;
  align?: "right";
};

/**
 * Desktop/tablet: real table. Phone: stacked cards built from the same columns.
 */
export function ResponsiveTable<T extends { id: string }>({
  columns,
  rows,
  renderCardAction,
  empty = "Nothing here yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  renderCardAction?: (row: T) => ReactNode;
  empty?: string;
}) {
  const hideClass = (hide?: Column<T>["hide"]) =>
    hide === "md" ? "hidden md:table-cell" : hide === "lg" ? "hidden lg:table-cell" : hide === "xl" ? "hidden xl:table-cell" : "";

  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>;
  }

  const primary = columns.find((c) => c.primary) ?? columns[0];
  if (!primary) return null;
  const rest = columns.filter((c) => c !== primary);

  return (
    <>
      <div className="-mx-2 hidden overflow-x-auto sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key} className={cn(hideClass(c.hide), c.align === "right" && "text-right")}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell
                    key={c.key}
                    className={cn(hideClass(c.hide), c.align === "right" && "text-right", c.primary && "font-medium")}
                  >
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="space-y-3 sm:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-xl border border-border bg-card p-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0 text-sm font-semibold">{primary.cell(row)}</div>
              {renderCardAction && <div className="shrink-0">{renderCardAction(row)}</div>}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              {rest.map((c) => (
                <div key={c.key} className="min-w-0">
                  <dt className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">{c.header}</dt>
                  <dd className="mt-0.5 truncate text-sm">{c.cell(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

const toneMap: Record<string, string> = {
  Paid: "bg-success/15 text-success border-success/30",
  Done: "bg-success/15 text-success border-success/30",
  Approved: "bg-success/15 text-success border-success/30",
  Delivered: "bg-success/15 text-success border-success/30",
  Won: "bg-success/15 text-success border-success/30",
  Overdue: "bg-destructive/15 text-destructive border-destructive/30",
  Lost: "bg-destructive/15 text-destructive border-destructive/30",
  "In progress": "bg-brass/20 text-brass-foreground border-brass/40",
  "In transit": "bg-brass/20 text-brass-foreground border-brass/40",
  "In review": "bg-brass/20 text-brass-foreground border-brass/40",
  "In production": "bg-brass/20 text-brass-foreground border-brass/40",
};

export function StatusPill({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap font-medium", toneMap[value] ?? "bg-muted text-muted-foreground")}>
      {value}
    </Badge>
  );
}

export function DetailList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((i) => (
        <div key={i.label} className="min-w-0">
          <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{i.label}</dt>
          <dd className="mt-1 text-sm font-medium break-words">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
