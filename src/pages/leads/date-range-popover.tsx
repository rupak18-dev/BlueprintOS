import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateDMY } from "@/lib/export-csv";

export type DateRange = { from?: string | undefined; to?: string | undefined };

function toISODate(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

function parseISODate(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function todayISO(): string {
  return toISODate(new Date());
}

export function DateRangePopover({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  const { from, to } = value;
  const active = Boolean(from || to);

  const label =
    from && to
      ? `${formatDateDMY(from)} – ${formatDateDMY(to)}`
      : from
        ? `From ${formatDateDMY(from)}`
        : to
          ? `Until ${formatDateDMY(to)}`
          : "Date range";

  const pickFrom = (date?: Date) => {
    const next = date ? toISODate(date) : undefined;
    onChange({ from: next, to: next && to && next > to ? next : to });
  };

  const pickTo = (date?: Date) => {
    const next = date ? toISODate(date) : undefined;
    onChange({ from: next && from && next < from ? next : from, to: next });
  };

  const presetLast7 = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    onChange({ from: toISODate(start), to: toISODate(end) });
  };

  const presetMonth = () => {
    const now = new Date();
    onChange({ from: toISODate(new Date(now.getFullYear(), now.getMonth(), 1)), to: todayISO() });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 w-full text-sm sm:w-auto">
          <CalendarDays className="size-4" />
          <span className="truncate">{label}</span>
          {active && (
            <span className="ml-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brass text-[11px] font-semibold text-brass-foreground">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-3" align="end">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onChange({ from: todayISO(), to: todayISO() })}
          >
            Today
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={presetLast7}>
            Last 7 days
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={presetMonth}>
            This month
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            onClick={() => onChange({})}
          >
            Clear
          </Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="min-w-0">
            <p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              From
            </p>
            <Calendar mode="single" selected={parseISODate(from)} onSelect={pickFrom} />
          </div>
          <div className="min-w-0 border-t border-border pt-2 sm:border-l sm:border-t-0 sm:pl-2 sm:pt-0">
            <p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              To
            </p>
            <Calendar mode="single" selected={parseISODate(to)} onSelect={pickTo} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
