import { useState, type FormEvent, type ReactNode } from "react";
import { CalendarDays, ChevronDown, Plus } from "lucide-react";

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
  LEAD_OWNERS,
  LEAD_SOURCES,
  PROPERTY_TYPES,
  ROOM_OPTIONS,
  STYLE_OPTIONS,
  WORK_TYPES,
  formatBudget,
  type Lead,
} from "@/data/mock";

const ALL = "__all";

type FormState = {
  contact: string;
  email: string;
  phone: string;
  city: string;
  locality: string;
  propertyType: string;
  areaSqft: string;
  workType: string;
  budgetValue: string;
  source: string;
  stage: string;
  owner: string;
  startDate: string;
  preferredStyle: string;
  followUp: string;
  description: string;
};

const initial: FormState = {
  contact: "",
  email: "",
  phone: "",
  city: "",
  locality: "",
  propertyType: "",
  areaSqft: "",
  workType: "",
  budgetValue: "",
  source: ALL,
  stage: "New",
  owner: ALL,
  startDate: "",
  preferredStyle: ALL,
  followUp: "",
  description: "",
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

type SectionId = "client" | "property" | "scope" | "budget" | "notes";

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
  const [rooms, setRooms] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    client: true,
    property: true,
    scope: true,
    budget: true,
    notes: true,
  });

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleRoom = (room: string, checked: boolean) =>
    setRooms((prev) => (checked ? [...prev, room] : prev.filter((r) => r !== room)));

  const setSection = (id: SectionId) => (value: boolean) =>
    setOpenSections((prev) => ({ ...prev, [id]: value }));

  const expandAllSections = () =>
    setOpenSections({ client: true, property: true, scope: true, budget: true, notes: true });

  const reset = () => {
    setForm(initial);
    setRooms([]);
    expandAllSections();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const budgetValue = Number(form.budgetValue) || 0;
    const title = [form.locality || form.city, form.workType || "Interior enquiry"]
      .filter(Boolean)
      .join(" ");

    onCreate({
      id: nextId,
      name: title,
      contact: form.contact,
      email: form.email,
      phone: form.phone,
      city: form.city,
      scope: form.workType || "Interior design",
      budget: budgetValue > 0 ? formatBudget(budgetValue) : "₹0",
      budgetValue,
      stage: form.stage,
      source: form.source === ALL ? "Website" : form.source,
      owner: form.owner === ALL ? LEAD_OWNERS[0] : form.owner,
      updated: "Just now",
      createdAt: new Date().toISOString().slice(0, 10),
      description: form.description,
      requirements: form.description
        ? form.description
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
        : [],
      rooms: rooms.map((room) => ({
        room,
        area: form.areaSqft ? `${form.areaSqft} sq ft` : "—",
        note: [
          form.preferredStyle === ALL ? "" : form.preferredStyle,
          form.startDate ? `Start ${formatDateDMY(form.startDate)}` : "",
        ]
          .filter(Boolean)
          .join(" · "),
      })),
      estimate: [],
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
            Capture the interior enquiry — client, property, scope and budget.
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
              <Field label="Client email">
                <Input
                  type="email"
                  className="h-11"
                  placeholder="client@email.com"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                />
              </Field>
              <Field label="Phone number" required>
                <Input
                  required
                  type="tel"
                  className="h-11"
                  placeholder="+91 98450 00000"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                />
              </Field>
              <Field label="City">
                <Input
                  className="h-11"
                  placeholder="e.g. Bengaluru"
                  value={form.city}
                  onChange={(e) => set("city")(e.target.value)}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            id="lead-section-property"
            title="Property"
            open={openSections.property}
            onOpenChange={setSection("property")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Property type">
                <Select value={form.propertyType} onValueChange={set("propertyType")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Site locality / address">
                <Input
                  className="h-11"
                  placeholder="e.g. Whitefield, Bengaluru"
                  value={form.locality}
                  onChange={(e) => set("locality")(e.target.value)}
                />
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
            </div>
          </FormSection>

          <FormSection
            id="lead-section-scope"
            title="Scope of work"
            open={openSections.scope}
            onOpenChange={setSection("scope")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Work type">
                <Select value={form.workType} onValueChange={set("workType")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_TYPES.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Preferred style">
                <Select value={form.preferredStyle} onValueChange={set("preferredStyle")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Select style</SelectItem>
                    {STYLE_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-3 space-y-1.5">
              <Label className="text-xs">Rooms of interest</Label>
              <div className="grid grid-cols-2 gap-2">
                {ROOM_OPTIONS.map((room) => (
                  <label
                    key={room}
                    className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-2.5 py-2 text-xs"
                  >
                    <Checkbox
                      checked={rooms.includes(room)}
                      onCheckedChange={(checked) => toggleRoom(room, checked === true)}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="min-w-0 break-words leading-snug">{room}</span>
                  </label>
                ))}
              </div>
            </div>
          </FormSection>

          <FormSection
            id="lead-section-budget"
            title="Budget & pipeline"
            open={openSections.budget}
            onOpenChange={setSection("budget")}
          >
            <div className="grid gap-4 sm:grid-cols-2">
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
                  </p>
                )}
              </Field>
              <Field label="Budget range">
                <div className="flex h-11 items-center rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
                  {form.budgetValue
                    ? (BUDGET_RANGES.find(
                        (r) =>
                          Number(form.budgetValue) >= r.min && Number(form.budgetValue) < r.max,
                      )?.label ?? "—")
                    : "Set a budget to see the range"}
                </div>
              </Field>
              <Field label="Lead status">
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
              <div className="grid gap-4 sm:grid-cols-2">
                <DateField
                  label="Expected start"
                  value={form.startDate}
                  onChange={set("startDate")}
                />
                <DateField
                  label="Follow-up date"
                  value={form.followUp}
                  onChange={set("followUp")}
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            id="lead-section-notes"
            title="Description / requirements"
            open={openSections.notes}
            onOpenChange={setSection("notes")}
          >
            <Textarea
              rows={3}
              className="resize-none"
              placeholder="One requirement per line — e.g. modular kitchen with island, warm wood palette, possesion in 12 weeks…"
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              aria-label="Description / requirements"
            />
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
