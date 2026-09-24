import { useState, type FormEvent, type ReactNode } from "react";
import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { LEAD_OWNERS, PROPERTY_TYPES } from "@/data/mock";

const ALL = "__all";

type Feedback = {
  contact: string;
  phone: string;
  email: string;
  propertyType: string;
  requirementSummary: string;
  budgetDiscussed: string;
  stage: string;
  capturedBy: string;
  feedback: string;
  followUp: string;
};

const initial: Feedback = {
  contact: "",
  phone: "",
  email: "",
  propertyType: ALL,
  requirementSummary: "",
  budgetDiscussed: "",
  stage: "New",
  capturedBy: ALL,
  feedback: "",
  followUp: "",
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

export function LeadFormDialog({
  open,
  onOpenChange,
  onSubmit,
  statuses,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: Feedback) => void;
  statuses: string[];
}) {
  const [form, setForm] = useState<Feedback>(initial);

  const set = (key: keyof Feedback) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => setForm(initial);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      propertyType: form.propertyType === ALL ? "" : form.propertyType,
      capturedBy: form.capturedBy === ALL ? "" : form.capturedBy,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) reset();
        onOpenChange(value);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lead form — client data & feedback</DialogTitle>
          <DialogDescription>
            Gather client details, requirements and feedback from the site visit or discovery call.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
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
            <Field label="Phone number">
              <Input
                type="tel"
                className="h-11"
                placeholder="+91 98450 00000"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
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
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Discovery
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Requirement summary">
                <Textarea
                  rows={3}
                  className="resize-none"
                  placeholder="What the client is looking for — rooms, style, timeline…"
                  value={form.requirementSummary}
                  onChange={(e) => set("requirementSummary")(e.target.value)}
                />
              </Field>
              <Field label="Budget discussed (₹)">
                <Input
                  type="number"
                  min={0}
                  className="h-11"
                  placeholder="Expected total budget in ₹"
                  value={form.budgetDiscussed}
                  onChange={(e) => set("budgetDiscussed")(e.target.value)}
                />
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
              <Field label="Captured by">
                <Select value={form.capturedBy} onValueChange={set("capturedBy")}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>Select owner</SelectItem>
                    {LEAD_OWNERS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-border pt-4">
            <Label className="text-xs">Client feedback / remarks</Label>
            <Textarea
              rows={3}
              className="resize-none"
              placeholder="Feedback from the call or site visit — concerns, priorities, competitive quotes…"
              value={form.feedback}
              onChange={(e) => set("feedback")(e.target.value)}
            />
          </div>

          <div className="sm:max-w-xs">
            <Field label="Follow-up date">
              <Input
                type="date"
                className="h-11"
                value={form.followUp}
                onChange={(e) => set("followUp")(e.target.value)}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <ClipboardList className="size-4" /> Save feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export type { Feedback as LeadFormData };
