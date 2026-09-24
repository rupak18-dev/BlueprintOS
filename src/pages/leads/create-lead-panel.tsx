import { useState, type FormEvent, type ReactNode } from "react";
import { CalendarDays, ChevronDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateDMY } from "@/lib/export-csv";
import { cn } from "@/lib/utils";
import {
  BUDGET_RANGES,
  FINANCIAL_YEARS,
  LEAD_OWNERS,
  LEAD_SOURCES,
  PROPERTY_TYPES,
  ROLE_OPTIONS,
  WORK_TYPES,
  formatBudget,
  type Lead,
} from "@/data/mock";

const ALL = "__all";

type FormState = {
  contact: string;
  phone: string;
  email: string;
  role: string;
  projectName: string;
  salesOwner: string;
  owner: string;
  stage: string;
  budgetValue: string;
  workType: string;
  tentativeStart: string;
  financialYear: string;
  description: string;
  latestRemark: string;
  source: string;
  city: string;
  locality: string;
  propertyType: string;
  areaSqft: string;
  metaDetails: string;
  rating: string;
  tags: string;
  taxIds: string;
};

const initial: FormState = {
  contact: "",
  phone: "",
  email: "",
  role: ALL,
  projectName: "",
  salesOwner: ALL,
  owner: ALL,
  stage: "Created",
  budgetValue: "",
  workType: ALL,
  tentativeStart: "",
  financialYear: FINANCIAL_YEARS[0] ?? ALL,
  description: "",
  latestRemark: "",
  source: ALL,
  city: "",
  locality: "",
  propertyType: ALL,
  areaSqft: "",
  metaDetails: "",
  rating: ALL,
  tags: "",
  taxIds: "",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="text-xs">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

type SectionId = "client" | "project" | "additional";

function FormSection({
  id,
  title,
  open,
  onOpenChange,
  children,
}: {
  id: `lead-section-${SectionId}`;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className="border-t border-border pt-4 first:border-t-0 first:pt-0"
    >
      <CollapsibleTrigger asChild>
        <button
          type="button"
          aria-controls={id}
          className="mb-3 flex w-full items-center justify-between gap-2 text-left"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent id={id}>{children}</CollapsibleContent>
    </Collapsible>
  );
}

function toISODate(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const parsed = value ? new Date(`${value}T00:00:00`) : undefined;
  const selected = parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-11 w-full justify-start gap-2 font-normal",
              !selected && "text-muted-foreground",
            )}
          >
            <CalendarDays className="size-4 shrink-0" />
            <span className="truncate">{selected ? formatDateDMY(value) : "Pick a date"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) onChange(toISODate(date));
            }}
          />
          {selected && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-7 w-full px-2 text-xs"
              onClick={() => onChange("")}
            >
              Clear
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function CreateLeadPanel({
  open,
  onOpenChange,
  nextId,
  onCreate,
  statuses,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextId: string;
  onCreate: (lead: Lead) => void;
  statuses: string[];
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [showMultiple, setShowMultiple] = useState(false);
  const [altPhones, setAltPhones] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    client: true,
    project: true,
    additional: true,
  });

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setSection = (id: SectionId) => (value: boolean) =>
    setOpenSections((prev) => ({ ...prev, [id]: value }));

  const expandAllSections = () =>
    setOpenSections({ client: true, project: true, additional: true });

  const reset = () => {
    setForm(initial);
    setShowMultiple(false);
    setAltPhones([]);
    expandAllSections();
  };

  const setAltPhone = (index: number, value: string) =>
    setAltPhones((prev) => prev.map((p, i) => (i === index ? value : p)));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const budgetValue = Number(form.budgetValue) || 0;
    const title =
      form.projectName.trim() ||
      [form.locality || form.city, form.workType === ALL ? "" : form.workType]
        .filter(Boolean)
        .join(" ") ||
      "Interior enquiry";
    const primaryPhone = form.phone.trim();

    onCreate({
      id: nextId,
      name: title,
      contact: form.contact,
      email: form.email,
      phone: form.phone,
      city: form.city,
      scope: form.workType === ALL ? "Interior design" : form.workType,
      budget: budgetValue > 0 ? formatBudget(budgetValue) : "₹0",
      budgetValue,
      stage: form.stage,
      source: form.source === ALL ? "Website" : form.source,
      owner: form.owner === ALL ? (LEAD_OWNERS[0] ?? "Unassigned") : form.owner,
      updated: "Just now",
      createdAt: new Date().toISOString().slice(0, 10),
      description: form.description,
      requirements: form.description
        ? form.description
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
        : [],
      rooms: [],
      estimate: [],
      role: form.role === ALL ? "" : form.role,
      alternatePhones: altPhones.map((p) => p.trim()).filter((p) => p && p !== primaryPhone),
      salesOwner: form.salesOwner === ALL ? "" : form.salesOwner,
      tentativeStart: form.tentativeStart,
      financialYear: form.financialYear,
      latestRemark: form.latestRemark,
      metaDetails: form.metaDetails,
      rating: form.rating === ALL ? undefined : Number(form.rating),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      taxIds: form.taxIds,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!value) reset();
        onOpenChange(value);
      }}
    >
      <SheetContent side="right" className="flex w-[min(640px,94vw)] flex-col gap-4 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Create new lead</SheetTitle>
          <SheetDescription>
            Capture the enquiry — client, project and additional information.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid flex-1 gap-4 overflow-y-auto pr-0.5">
          <FormSection
            id="lead-section-client"
            title="Client details"
            open={openSections.client}
            onOpenChange={setSection("client")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client name" required>
                <Input
                  required
                  className="h-11"
                  placeholder="e.g. Ananya Rao"
                  value={form.contact}
                  onChange={(e) => set("contact")(e.target.value)}
                />
              </Field>
              <Field label="Client number" required>
                <Input
                  required
                  type="tel"
                  className="h-11"
                  placeholder="+91 98450 00000"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                />
              </Field>
              <Field label="Primary email">
                <Input
                  type="email"
                  className="h-11"
                  placeholder="client@email.com"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                />
              </Field>
              <Field label="Role">
                <Select value={form.role} onValueChange={set("role")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Select role</SelectItem>
                    {ROLE_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs">
                <Checkbox
                  checked={showMultiple}
                  onCheckedChange={(checked) => {
                    if (checked === true) {
                      setShowMultiple(true);
                      setAltPhones((prev) => (prev.length ? prev : [""]));
                    } else {
                      setShowMultiple(false);
                      setAltPhones([]);
                    }
                  }}
                  className="size-4"
                />
                <span className="min-w-0">Add multiple numbers for this client</span>
              </label>
              {showMultiple && (
                <div className="mt-2 grid gap-2">
                  {altPhones.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="tel"
                        className="h-11 min-w-0 flex-1"
                        placeholder="Alternative number"
                        value={value}
                        onChange={(e) => setAltPhone(index, e.target.value)}
                        aria-label={`Alternative number ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-11 shrink-0"
                        aria-label={`Remove number ${index + 1}`}
                        onClick={() => setAltPhones((prev) => prev.filter((_, i) => i !== index))}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="justify-self-start"
                    onClick={() => setAltPhones((prev) => [...prev, ""])}
                  >
                    <Plus className="size-4" /> Add number
                  </Button>
                </div>
              )}
            </div>
          </FormSection>

          <FormSection
            id="lead-section-project"
            title="Project details"
            open={openSections.project}
            onOpenChange={setSection("project")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project name">
                <Input
                  className="h-11"
                  placeholder="e.g. Whitefield 3BHK turnkey"
                  value={form.projectName}
                  onChange={(e) => set("projectName")(e.target.value)}
                />
              </Field>
              <Field label="Sales owner">
                <Select value={form.salesOwner} onValueChange={set("salesOwner")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select sales owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Select sales owner</SelectItem>
                    {LEAD_OWNERS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Assigned to">
                <Select value={form.owner} onValueChange={set("owner")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Unassigned</SelectItem>
                    {LEAD_OWNERS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Status">
                <Select value={form.stage} onValueChange={set("stage")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Budget (₹)">
                <Input
                  type="number"
                  min={0}
                  className="h-11"
                  placeholder="e.g. 2800000"
                  value={form.budgetValue}
                  onChange={(e) => set("budgetValue")(e.target.value)}
                />
                {Number(form.budgetValue) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ≈ {formatBudget(Number(form.budgetValue))}
                    {" · "}
                    {BUDGET_RANGES.find(
                      (r) => Number(form.budgetValue) >= r.min && Number(form.budgetValue) < r.max,
                    )?.label ?? "—"}
                  </p>
                )}
              </Field>
              <Field label="Scope">
                <Select value={form.workType} onValueChange={set("workType")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Select scope</SelectItem>
                    {WORK_TYPES.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <DateField
                label="Tentative start date"
                value={form.tentativeStart}
                onChange={set("tentativeStart")}
              />
              <Field label="Financial year">
                <Select value={form.financialYear} onValueChange={set("financialYear")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FINANCIAL_YEARS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Description">
                <Textarea
                  rows={3}
                  className="resize-none"
                  placeholder="One requirement per line — e.g. modular kitchen with island, warm wood palette, possession in 12 weeks…"
                  value={form.description}
                  onChange={(e) => set("description")(e.target.value)}
                  aria-label="Description"
                />
              </Field>
              <Field label="Latest remark">
                <Textarea
                  rows={2}
                  className="resize-none"
                  placeholder="e.g. Client asked for a revised quotation by Friday…"
                  value={form.latestRemark}
                  onChange={(e) => set("latestRemark")(e.target.value)}
                  aria-label="Latest remark"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            id="lead-section-additional"
            title="Additional information"
            open={openSections.additional}
            onOpenChange={setSection("additional")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Source">
                <Select value={form.source} onValueChange={set("source")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Select source</SelectItem>
                    {LEAD_SOURCES.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="City">
                <Input
                  className="h-11"
                  placeholder="e.g. Bengaluru"
                  value={form.city}
                  onChange={(e) => set("city")(e.target.value)}
                />
              </Field>
              <Field label="Site locality / address">
                <Input
                  className="h-11"
                  placeholder="e.g. Whitefield, Bengaluru"
                  value={form.locality}
                  onChange={(e) => set("locality")(e.target.value)}
                />
              </Field>
              <Field label="Property type">
                <Select value={form.propertyType} onValueChange={set("propertyType")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Select property type</SelectItem>
                    {PROPERTY_TYPES.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Estimated area (sq ft)">
                <Input
                  type="number"
                  min={0}
                  className="h-11"
                  placeholder="e.g. 1850"
                  value={form.areaSqft}
                  onChange={(e) => set("areaSqft")(e.target.value)}
                />
              </Field>
              <Field label="Meta details">
                <Input
                  className="h-11"
                  placeholder="e.g. Meta lead ad, campaign Spring26"
                  value={form.metaDetails}
                  onChange={(e) => set("metaDetails")(e.target.value)}
                />
              </Field>
              <Field label="Rating">
                <Select value={form.rating} onValueChange={set("rating")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Not rated</SelectItem>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={`${n}`}>
                        {n} / 5
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Tags">
                <Input
                  className="h-11"
                  placeholder="e.g. premium, referral, hot"
                  value={form.tags}
                  onChange={(e) => set("tags")(e.target.value)}
                />
              </Field>
              <Field label="Tax IDs">
                <Input
                  className="h-11"
                  placeholder="e.g. 29ABCDE1234F1Z5, ABCDE1234F"
                  value={form.taxIds}
                  onChange={(e) => set("taxIds")(e.target.value)}
                />
              </Field>
            </div>
          </FormSection>

          <SheetFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" onClick={expandAllSections}>
              <Plus className="size-4" /> Create lead
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
