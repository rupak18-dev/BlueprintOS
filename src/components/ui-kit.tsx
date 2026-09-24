import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="text-xl font-bold break-words sm:truncate sm:text-2xl lg:text-3xl">
          {title}
        </h1>
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
      <CardContent className="flex min-h-[104px] flex-col justify-center px-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground break-words">
          {label}
        </p>
        <p className="mt-3 text-xl font-bold sm:text-2xl">{value}</p>
        {hint && <p className="mt-2 truncate text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function StatGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4", className)}>{children}</div>
  );
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
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Hide this column below the given breakpoint on the desktop table. */
  hide?: "md" | "lg" | "xl";
  primary?: boolean;
  align?: "right";
};

/** Real table on all screen sizes with horizontal scroll. */
export function ResponsiveTable<T extends { id: string }>({
  columns,
  rows,
  empty = "Nothing here yet.",
  headerClassName,
}: {
  columns: Column<T>[];
  rows: T[];
  renderCardAction?: (row: T) => ReactNode;
  empty?: string;
  headerClassName?: string;
}) {
  const cellPad = "px-4 py-3";
  const headPad = "px-4 py-3";
  const hideClass = (hide?: Column<T>["hide"]) =>
    hide === "md"
      ? "hidden md:table-cell"
      : hide === "lg"
        ? "hidden lg:table-cell"
        : hide === "xl"
          ? "hidden xl:table-cell"
          : "";

  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[880px]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((c) => (
                <TableHead
                  key={c.key}
                  className={cn(
                    headerClassName,
                    hideClass(c.hide),
                    headPad,
                    "whitespace-nowrap",
                    c.align === "right" && "text-right",
                  )}
                >
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
                    className={cn(
                      hideClass(c.hide),
                      cellPad,
                      c.align === "right" && "text-right",
                      c.primary && "font-medium",
                    )}
                  >
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
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
  "In progress": "bg-brass/15 text-brass border-brass/30",
  "In transit": "bg-brass/15 text-brass border-brass/30",
  "In review": "bg-brass/15 text-brass border-brass/30",
  "In production": "bg-brass/15 text-brass border-brass/30",
  New: "bg-brass/15 text-brass border-brass/30",
  Qualified: "bg-warning/15 text-warning border-warning/30",
  "Site visit": "bg-warning/15 text-warning border-warning/30",
  Quotation: "bg-brass/15 text-brass border-brass/30",
  Negotiation: "bg-warning/15 text-warning border-warning/30",
};

export function statusToneClass(value: string): string {
  return toneMap[value] || "bg-muted text-muted-foreground border-border";
}

export function statusSoftStyle(color: string): CSSProperties {
  return {
    backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
    borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
    color,
  };
}

export function StatusPill({ value, color }: { value: string; color?: string | undefined }) {
  return (
    <Badge
      variant="outline"
      className={cn("whitespace-nowrap font-medium", !color && statusToneClass(value))}
      style={color ? statusSoftStyle(color) : undefined}
    >
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
