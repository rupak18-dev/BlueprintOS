import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Check,
  Circle,
  CircleCheckBig,
  ClipboardList,
  Download,
  Funnel,
  Lock,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Tags,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Seo } from "@/components/seo";
import {
  PageHeader,
  StatCard,
  StatGrid,
  ResponsiveTable,
  statusSoftStyle,
  statusToneClass,
  type Column,
} from "@/components/ui-kit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BUDGET_RANGES,
  LEAD_OWNERS,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_STATUS_COLORS,
  formatBudget,
  leads as seedLeads,
  type Lead,
} from "@/data/mock";
import { CreateLeadPanel } from "./create-lead-panel";
import { ManageStatusesPanel } from "./manage-statuses-panel";
import { DateRangePopover, type DateRange } from "./date-range-popover";
import { exportLeadsCsv } from "@/lib/export-csv";
import { loadExtraLeads, saveExtraLead } from "@/lib/lead-form-storage";
import { cn } from "@/lib/utils";
import {
  DEFAULT_STATUS_COLOR,
  loadCustomStatuses,
  saveCustomStatuses,
  loadDefaultColorOverrides,
  saveDefaultColorOverrides,
} from "@/lib/lead-storage";

const ALL = "__all";
const PAGE_SIZE_OPTIONS = [10, 15, 20];

const DIMS = [
  { value: "status", label: "Status" },
  { value: "source", label: "Source" },
  { value: "owner", label: "Assigned to" },
  { value: "location", label: "Location" },
  { value: "budget", label: "Budget" },
] as const;

const COLUMN_OPTIONS = [
  { key: "name", label: "Client name", locked: true },
  { key: "info", label: "Client info", locked: true },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "budget", label: "Budget" },
  { key: "owner", label: "Assigned to" },
  { key: "description", label: "Description" },
] as const;

type FilterBy = (typeof DIMS)[number]["value"];
type AdvancedFilters = {
  statuses: string[];
  sources: string[];
  owners: string[];
  locations: string[];
};

const emptyAdvanced: AdvancedFilters = { statuses: [], sources: [], owners: [], locations: [] };

function valueOptions(
  statuses: string[],
  cities: string[],
  dim: FilterBy,
): { value: string; label: string }[] {
  switch (dim) {
    case "status":
      return statuses.map((o) => ({ value: o, label: o }));
    case "source":
      return LEAD_SOURCES.map((o) => ({ value: o, label: o }));
    case "owner":
      return LEAD_OWNERS.map((o) => ({ value: o, label: o }));
    case "location":
      return cities.map((o) => ({ value: o, label: o }));
    case "budget":
      return BUDGET_RANGES.map((r) => ({ value: r.label, label: r.label }));
  }
}

function clientMatches(lead: Lead, q: string) {
  return [
    lead.contact,
    lead.name,
    lead.email,
    lead.phone,
    lead.city,
    lead.scope,
    lead.description,
  ].some((v) => v?.toLowerCase().includes(q));
}

function inBudgetRange(lead: Lead, label: string) {
  const range = BUDGET_RANGES.find((r) => r.label === label);
  return range ? lead.budgetValue >= range.min && lead.budgetValue < range.max : false;
}

function columnDefs(
  statuses: string[],
  colors: Record<string, string>,
  onChangeStatus: (id: string, stage: string) => void,
): Column<Lead>[] {
  return [
    {
      key: "name",
      header: "Client name",
      primary: true,
      cell: (l: Lead) => (
        <Link to={`/leads/${l.id}`} className="block min-w-0">
          <span className="block truncate">{l.contact}</span>
          <span className="block truncate text-xs text-muted-foreground">{l.name}</span>
        </Link>
      ),
    },
    {
      key: "info",
      header: "Client info",
      hide: "md",
      cell: (l: Lead) => (
        <div className="min-w-0">
          <span className="block truncate text-xs">{l.email || "—"}</span>
          <span className="block truncate text-xs text-muted-foreground">{l.phone}</span>
        </div>
      ),
    },
    { key: "source", header: "Source", cell: (l: Lead) => l.source, hide: "lg" },
    {
      key: "status",
      header: "Status",
      cell: (l: Lead) => {
        const color = colors[l.stage];
        return (
          <Select value={l.stage} onValueChange={(v) => onChangeStatus(l.id, v)}>
            <SelectTrigger
              className={cn("h-8 gap-1.5 px-2 font-medium", !color && statusToneClass(l.stage))}
              style={color ? statusSoftStyle(color) : undefined}
              aria-label={`Change status for ${l.contact}`}
            >
              <span className="max-w-40 truncate">{l.stage}</span>
            </SelectTrigger>
            <SelectContent>
              {statuses.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    { key: "budget", header: "Budget", cell: (l: Lead) => l.budget },
    { key: "owner", header: "Assigned to", cell: (l: Lead) => l.owner, hide: "lg" },
    {
      key: "description",
      header: "Description",
      hide: "xl",
      cell: (l: Lead) => (
        <span className="line-clamp-2 block max-w-[280px] text-xs text-muted-foreground">
          {l.description}
        </span>
      ),
    },
  ];
}

function ManageColumnsPopover({
  hidden,
  onToggleColumn,
}: {
  hidden: ReadonlySet<string>;
  onToggleColumn: (key: string) => void;
}) {
  const showAllColumns = () =>
    COLUMN_OPTIONS.filter((c) => !c.locked && hidden.has(c.key)).forEach((c) =>
      onToggleColumn(c.key),
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 w-full text-sm sm:w-auto">
          <Funnel className="size-4" /> Manage columns
          {hidden.size > 0 && (
            <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-brass text-[11px] font-semibold text-brass-foreground">
              {hidden.size}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[85vh] w-80 overflow-y-auto" align="end">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Manage columns</h3>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={showAllColumns}>
            Show all
          </Button>
        </div>

        <div>
          {COLUMN_OPTIONS.map((col) => {
            const locked = col.locked;
            const visible = !hidden.has(col.key);
            return (
              <label
                key={col.key}
                className={cn(
                  "flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-xs",
                  locked && "cursor-not-allowed",
                  !visible && "text-muted-foreground",
                )}
              >
                <Checkbox
                  checked={visible}
                  disabled={locked}
                  onCheckedChange={() => onToggleColumn(col.key)}
                  className="size-4 rounded-full data-[state=checked]:bg-brass data-[state=checked]:text-brass-foreground"
                />
                <span className={cn("min-w-0 truncate", locked && "font-medium")}>{col.label}</span>
                {locked && <Lock className="ml-auto size-3.5 shrink-0 text-muted-foreground" />}
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FiltersPopover({
  value,
  onChange,
  statuses,
  cities,
}: {
  value: AdvancedFilters;
  onChange: (filters: AdvancedFilters) => void;
  statuses: string[];
  cities: string[];
}) {
  const [draft, setDraft] = useState<AdvancedFilters>(value);

  const activeCount =
    value.statuses.length + value.sources.length + value.owners.length + value.locations.length;

  const isChecked = (group: keyof AdvancedFilters, option: string) => draft[group].includes(option);

  const toggle = (group: keyof AdvancedFilters, option: string) =>
    setDraft((prev) => ({
      ...prev,
      [group]: prev[group].includes(option)
        ? prev[group].filter((o) => o !== option)
        : [...prev[group], option],
    }));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 w-full text-sm sm:w-auto">
          <SlidersHorizontal className="size-4" /> Filters
          {activeCount > 0 && (
            <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-brass text-[11px] font-semibold text-brass-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[85vh] w-80 overflow-y-auto" align="end">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            onClick={() => setDraft(emptyAdvanced)}
          >
            Clear all
          </Button>
        </div>

        {(
          [
            ["Status", "statuses", statuses],
            ["Source", "sources", LEAD_SOURCES],
            ["Assigned to", "owners", LEAD_OWNERS],
            ["Location", "locations", cities],
          ] as const
        ).map(([label, key, options]) => (
          <div key={key} className="mb-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {options.map((option) => (
                <label key={option} className="flex cursor-pointer items-center gap-1.5 text-xs">
                  <Checkbox
                    checked={isChecked(key, option)}
                    onCheckedChange={() => toggle(key, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-2 border-t border-border pt-3">
          <Button variant="ghost" size="sm" onClick={() => setDraft(value)}>
            Reset
          </Button>
          <Button size="sm" onClick={() => onChange(draft)}>
            Apply filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function LeadSettingsMenu({
  selectMode,
  onToggleSelectMode,
  onManageStatuses,
  onExport,
}: {
  selectMode: boolean;
  onToggleSelectMode: () => void;
  onManageStatuses: () => void;
  onExport: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Lead settings">
          <Settings2 className="size-4.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>View & data</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onToggleSelectMode}>
          {selectMode ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
          <span className="text-xs font-semibold">Bulk select</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onManageStatuses}>
          <Tags className="size-4" />
          <span className="text-xs font-semibold">Manage statuses</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onExport}>
          <Download className="size-4" />
          <span className="text-xs font-semibold">Export CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, 2, current - 1, current, current + 1, total - 1, total]);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const n of sorted) {
    if (n - prev > 1) out.push("…");
    out.push(n);
    prev = n;
  }
  return out;
}

const storedCustomStatuses = loadCustomStatuses(LEAD_STATUSES);
const storedDefaultOverrides = loadDefaultColorOverrides(LEAD_STATUSES);

export default function LeadsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Lead[]>(() => [...loadExtraLeads(), ...seedLeads]);
  const [statuses, setStatuses] = useState<string[]>(() => [
    ...LEAD_STATUSES,
    ...storedCustomStatuses.map((s) => s.name),
  ]);
  const [statusColors, setStatusColors] = useState<Record<string, string>>(() => ({
    ...LEAD_STATUS_COLORS,
    ...storedDefaultOverrides,
    ...Object.fromEntries(storedCustomStatuses.map((s) => [s.name, s.color])),
  }));
  const [defaultOverrides, setDefaultOverrides] =
    useState<Record<string, string>>(storedDefaultOverrides);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState<FilterBy>("status");
  const [filterValue, setFilterValue] = useState<string>(ALL);
  const [advanced, setAdvanced] = useState<AdvancedFilters>(emptyAdvanced);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0] ?? 10);
  const [dateRange, setDateRange] = useState<DateRange>({});

  const allCities = useMemo(() => [...new Set(rows.map((r) => r.city))].sort(), [rows]);

  const filtered = useMemo(() => {
    let next = rows;
    const q = query.trim().toLowerCase();
    if (q) next = next.filter((l) => clientMatches(l, q));
    if (advanced.statuses.length) next = next.filter((l) => advanced.statuses.includes(l.stage));
    if (advanced.sources.length) next = next.filter((l) => advanced.sources.includes(l.source));
    if (advanced.owners.length) next = next.filter((l) => advanced.owners.includes(l.owner));
    if (advanced.locations.length) next = next.filter((l) => advanced.locations.includes(l.city));
    if (dateRange.from) next = next.filter((l) => l.createdAt >= dateRange.from!);
    if (dateRange.to) next = next.filter((l) => l.createdAt <= dateRange.to!);
    if (filterValue !== ALL) {
      next =
        filterBy === "status"
          ? next.filter((l) => l.stage === filterValue)
          : filterBy === "source"
            ? next.filter((l) => l.source === filterValue)
            : filterBy === "owner"
              ? next.filter((l) => l.owner === filterValue)
              : filterBy === "location"
                ? next.filter((l) => l.city === filterValue)
                : next.filter((l) => inBudgetRange(l, filterValue));
    }
    return next;
  }, [rows, query, filterBy, filterValue, advanced, dateRange]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const pageRowIds = pageRows.map((r) => r.id);
  const allPageSelected = pageRows.length > 0 && pageRowIds.every((id) => selected.has(id));
  const startIndex = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, filtered.length);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of statuses) counts[s] = 0;
    for (const l of rows) counts[l.stage] = (counts[l.stage] ?? 0) + 1;
    return counts;
  }, [rows, statuses]);

  const totalValue = useMemo(() => rows.reduce((sum, l) => sum + l.budgetValue, 0), [rows]);
  const openCount = rows.filter((l) => l.stage !== "Won" && l.stage !== "Junk").length;
  const wonCount = rows.filter((l) => l.stage === "Won").length;
  const conversionRate = rows.length ? Math.round((wonCount / rows.length) * 100) : 0;

  useEffect(() => {
    setPage(1);
  }, [query, filterBy, filterValue, advanced, dateRange, pageSize]);

  useEffect(() => {
    saveCustomStatuses(
      statuses
        .filter((s) => !LEAD_STATUSES.includes(s))
        .map((name) => ({ name, color: statusColors[name] ?? DEFAULT_STATUS_COLOR })),
    );
  }, [statuses, statusColors]);

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const changeStatus = useCallback((id: string, stage: string) => {
    setRows((prev) => prev.map((l) => (l.id === id ? { ...l, stage, updated: "Just now" } : l)));
  }, []);

  const toggleColumn = (key: string) => {
    const locked = COLUMN_OPTIONS.find((c) => c.key === key)?.locked;
    if (locked) return;
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSelectMode = () => {
    setBulkStatus("");
    setSelectMode((v) => !v);
  };

  const clearSelection = () => {
    setSelected(new Set());
    setBulkStatus("");
    setSelectMode(false);
  };

  const applyBulkStatus = () => {
    if (!bulkStatus || selected.size === 0) return;
    const count = selected.size;
    setRows((prev) =>
      prev.map((l) => (selected.has(l.id) ? { ...l, stage: bulkStatus, updated: "Just now" } : l)),
    );
    toast.success("Status updated", { description: `${count} lead(s) moved to ${bulkStatus}.` });
    setSelected(new Set());
    setBulkStatus("");
  };

  const deleteSelected = () => {
    const count = selected.size;
    setRows((prev) => prev.filter((l) => !selected.has(l.id)));
    setSelected(new Set());
    setBulkStatus("");
    setDeleteConfirmOpen(false);
    toast.success("Leads deleted", { description: `${count} lead(s) removed.` });
  };

  const createStatus = (name: string, color: string) => {
    setStatuses((prev) => [...prev, name]);
    setStatusColors((prev) => ({ ...prev, [name]: color }));
    toast.success(`Status "${name}" created`);
  };

  const recolorDefaultStatus = (name: string, hex: string) => {
    if (!LEAD_STATUSES.includes(name)) return;
    const nextHex = hex.toUpperCase();
    const next = { ...defaultOverrides, [name]: nextHex };
    setDefaultOverrides(next);
    saveDefaultColorOverrides(next);
    setStatusColors((prev) => ({ ...prev, [name]: nextHex }));
  };

  const resetDefaultStatusColor = (name: string) => {
    if (!LEAD_STATUSES.includes(name)) return;
    const next = { ...defaultOverrides };
    delete next[name];
    setDefaultOverrides(next);
    saveDefaultColorOverrides(next);
    setStatusColors((prev) => ({ ...prev, [name]: LEAD_STATUS_COLORS[name] ?? prev[name] }));
  };

  const renameStatus = (oldName: string, newName: string) => {
    if (LEAD_STATUSES.includes(oldName)) {
      toast.error("Default statuses can't be renamed");
      return;
    }
    setStatuses((prev) => prev.map((s) => (s === oldName ? newName : s)));
    setStatusColors((prev) => {
      const next = { ...prev };
      if (next[oldName]) {
        next[newName] = next[oldName];
        delete next[oldName];
      }
      return next;
    });
    setRows((prev) => prev.map((l) => (l.stage === oldName ? { ...l, stage: newName } : l)));
    setAdvanced((prev) => ({
      ...prev,
      statuses: prev.statuses.map((s) => (s === oldName ? newName : s)),
    }));
    setFilterValue((prev) => (prev === oldName ? newName : prev));
    setBulkStatus((prev) => (prev === oldName ? newName : prev));
    toast.success(`Status renamed to "${newName}"`);
  };

  const exportFiltered = () => {
    const visibleColumns = COLUMN_OPTIONS.filter((c) => !hiddenCols.has(c.key)).map((c) => c.key);
    const count = exportLeadsCsv(filtered, "leads-export.csv", visibleColumns);
    toast.success("Leads exported", { description: `${count} lead(s) saved to CSV.` });
  };

  const exportSelected = () => {
    const selectedRows = rows.filter((l) => selected.has(l.id));
    const visibleColumns = COLUMN_OPTIONS.filter((c) => !hiddenCols.has(c.key)).map((c) => c.key);
    const count = exportLeadsCsv(selectedRows, "leads-selected.csv", visibleColumns);
    toast.success("Selected leads exported", {
      description: `${count} selected lead(s) saved to CSV.`,
    });
  };

  const deleteStatus = (name: string) => {
    if (LEAD_STATUSES.includes(name)) {
      toast.error("Default statuses can't be deleted");
      return;
    }
    if (rows.some((l) => l.stage === name)) {
      toast.error("Move leads away first", {
        description: `There are still leads with status "${name}".`,
      });
      return;
    }
    setStatuses((prev) => prev.filter((s) => s !== name));
    setStatusColors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setAdvanced((prev) => ({ ...prev, statuses: prev.statuses.filter((s) => s !== name) }));
    if (filterValue === name) setFilterValue(ALL);
    if (bulkStatus === name) setBulkStatus("");
    toast.success(`Status "${name}" deleted`);
  };

  const tableColumns = useMemo(() => {
    const cols: Column<Lead>[] = [];
    if (selectMode) {
      cols.push({
        key: "select",
        header: (
          <Checkbox
            checked={allPageSelected && pageRows.length > 0}
            onCheckedChange={() => {
              setSelected((prev) => {
                const next = new Set(prev);
                if (allPageSelected) pageRowIds.forEach((id) => next.delete(id));
                else pageRowIds.forEach((id) => next.add(id));
                return next;
              });
            }}
            aria-label="Select all leads on this page"
          />
        ),
        cell: (l) => (
          <Checkbox
            checked={selected.has(l.id)}
            onCheckedChange={(value) => {
              const id = l.id;
              setSelected((prev) => {
                const next = new Set(prev);
                if (value === true) next.add(id);
                else next.delete(id);
                return next;
              });
            }}
            aria-label={`Select ${l.contact}`}
          />
        ),
      });
    }
    cols.push(
      ...columnDefs(statuses, statusColors, changeStatus).filter((c) => !hiddenCols.has(c.key)),
    );
    return cols;
  }, [
    selectMode,
    allPageSelected,
    pageRows.length,
    pageRowIds,
    selected,
    statuses,
    statusColors,
    changeStatus,
    hiddenCols,
  ]);

  const nextLeadId = () =>
    "LD-" + (Math.max(0, ...rows.map((r) => parseInt(r.id.replace("LD-", ""), 10) || 0)) + 1);

  const handleCreate = (lead: Lead) => {
    saveExtraLead(lead);
    setRows((prev) => [lead, ...prev]);
    toast.success(`Lead created`, { description: `${lead.name} added to the pipeline.` });
  };

  return (
    <>
      <Seo
        title="Leads — enquiry pipeline"
        description="Track interior design enquiries from first contact through requirements, estimate and quotation."
      />

      <PageHeader
        title="Leads"
        subtitle="Turn client interest into your next signature project."
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => navigate("/leads/customize")}>
              <ClipboardList className="size-4" /> Lead form
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" /> New lead
            </Button>
            <LeadSettingsMenu
              selectMode={selectMode}
              onToggleSelectMode={toggleSelectMode}
              onManageStatuses={() => setStatusOpen(true)}
              onExport={exportFiltered}
            />
          </>
        }
      />

      <StatGrid>
        <StatCard
          label="Lead count"
          value={`${rows.length}`}
          hint="enquiries currently being explored"
          accent
        />
        <StatCard
          label="Lead value"
          value={formatBudget(totalValue)}
          hint="estimated across active leads"
        />
        <StatCard label="Open leads" value={`${openCount}`} hint="in active pipeline" />
        <StatCard label="Won leads" value={`${wonCount}`} hint={`${conversionRate}% conversion`} />
      </StatGrid>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-3 sm:p-4 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
          <div className="relative w-full min-w-0 xl:max-w-md xl:flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients, email, phone…"
              className="h-9 pl-8 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="mr-1 hidden text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
              Filter by
            </span>
            <div className="min-w-0 grow basis-full sm:basis-auto sm:grow-0">
              <Select
                value={filterBy}
                onValueChange={(value) => {
                  setFilterBy(value as FilterBy);
                  setFilterValue(ALL);
                }}
              >
                <SelectTrigger className="h-9 w-full text-sm sm:w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIMS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0 grow basis-full sm:basis-auto sm:grow-0">
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="h-9 w-full text-sm sm:w-[170px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>
                    <span className="flex items-center gap-1.5">
                      {filterValue !== ALL && <Check className="size-3.5" />} All
                    </span>
                  </SelectItem>
                  {valueOptions(statuses, allCities, filterBy).map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0 grow basis-full sm:basis-auto sm:grow-0">
              <ManageColumnsPopover hidden={hiddenCols} onToggleColumn={toggleColumn} />
            </div>

            <div className="min-w-0 grow basis-full sm:basis-auto sm:grow-0">
              <FiltersPopover
                value={advanced}
                onChange={setAdvanced}
                statuses={statuses}
                cities={allCities}
              />
            </div>

            <div className="min-w-0 grow basis-full sm:basis-auto sm:grow-0">
              <DateRangePopover value={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-3 py-2.5 sm:px-4">
            <span className="text-sm font-medium">{selected.size} selected</span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <div className="flex min-w-0 grow items-center gap-2">
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger
                  className="h-9 w-full sm:w-44"
                  aria-label="Change status for selected"
                >
                  <SelectValue placeholder="Change status…" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                disabled={!bulkStatus}
                onClick={applyBulkStatus}
              >
                Apply
              </Button>
            </div>
            <Button size="sm" variant="outline" className="shrink-0" onClick={exportSelected}>
              <Download className="size-4" /> Export
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="shrink-0"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
            <Button size="sm" variant="ghost" className="shrink-0" onClick={clearSelection}>
              Done
            </Button>
          </div>
        )}

        <ResponsiveTable
          columns={tableColumns}
          rows={pageRows}
          empty="No leads match your filters."
          headerClassName="bg-brass/40 font-semibold text-brass-foreground dark:text-brass"
        />
      </div>

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <p className="text-xs text-muted-foreground">
              Showing {startIndex}–{endIndex} of {filtered.length} leads
            </p>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <Select value={`${pageSize}`} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="h-8 w-auto gap-1.5 text-xs" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Pagination className="m-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  aria-disabled={safePage <= 1}
                  onClick={(e) => {
                    e.preventDefault();
                    if (safePage > 1) setPage(safePage - 1);
                  }}
                  className={safePage <= 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              {pageNumbers(safePage, pageCount).map((item, i) => (
                <PaginationItem key={i}>
                  {item === "…" ? (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-muted-foreground">
                      …
                    </span>
                  ) : (
                    <PaginationLink
                      isActive={item === safePage}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  aria-disabled={safePage >= pageCount}
                  onClick={(e) => {
                    e.preventDefault();
                    if (safePage < pageCount) setPage(safePage + 1);
                  }}
                  className={safePage >= pageCount ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <CreateLeadPanel
        open={createOpen}
        onOpenChange={setCreateOpen}
        nextId={nextLeadId()}
        statuses={statuses}
        onCreate={handleCreate}
      />
      <ManageStatusesPanel
        open={statusOpen}
        onOpenChange={setStatusOpen}
        statuses={statuses}
        colors={statusColors}
        counts={statusCounts}
        onCreate={createStatus}
        onRename={renameStatus}
        onDelete={deleteStatus}
        defaultOverrides={defaultOverrides}
        onRecolorDefault={recolorDefaultStatus}
        onResetDefaultColor={resetDefaultStatusColor}
      />
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} selected lead(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the selected leads from the pipeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteSelected}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
