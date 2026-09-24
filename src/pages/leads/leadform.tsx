import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Send } from "lucide-react";

import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LEAD_OWNERS, formatBudget, studio } from "@/data/mock";
import type { Lead } from "@/data/leads";
import type { LeadFormField } from "@/data/lead-form-config";
import {
  loadExtraLeads,
  loadFormConfig,
  saveExtraLead,
  saveSubmission,
} from "@/lib/lead-form-storage";
import { Thumb } from "./customize/image-selector";
import { libraryItems } from "@/lib/lead-form-images";

type Values = Record<string, string | string[] | undefined>;

function FieldInput({
  field,
  inputId,
  value,
  onChange,
}: {
  field: LeadFormField;
  inputId: string;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) {
  const str = Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={inputId}
          rows={field.rows ?? 3}
          className="resize-none"
          placeholder={field.placeholder}
          required={field.mandatory}
          value={str}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "select": {
      const none = "__none";
      return (
        <Select
          value={str || none}
          onValueChange={(v) => onChange(v === none ? "" : v)}
          required={field.mandatory}
        >
          <SelectTrigger id={inputId} aria-label={field.label} className="h-11 w-full">
            <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={none}>{field.placeholder || `Select ${field.label}`}</SelectItem>
            {(field.options ?? []).map((o) => (
              <SelectItem key={o.id} value={o.label}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case "multi": {
      const arr = Array.isArray(value) ? value : [];
      return (
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {(field.options ?? []).map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-2.5 py-2 text-xs"
            >
              <Checkbox
                checked={arr.includes(o.label)}
                onCheckedChange={(c) =>
                  onChange(c === true ? [...arr, o.label] : arr.filter((x) => x !== o.label))
                }
                className="mt-0.5 shrink-0"
              />
              <span className="min-w-0 break-words leading-snug">{o.label}</span>
            </label>
          ))}
        </div>
      );
    }
    case "checkbox":
      return (
        <label className="flex cursor-pointer items-start gap-2 rounded-md border border-border px-2.5 py-2.5 text-sm">
          <Checkbox
            checked={str === "yes"}
            onCheckedChange={(c) => onChange(c === true ? "yes" : "")}
            className="mt-0.5 shrink-0"
          />
          <span className="min-w-0 break-words leading-snug">
            {field.checkboxLabel || field.label}
          </span>
        </label>
      );
    case "radio":
    case "yesno": {
      const opts =
        field.type === "yesno" ? ["Yes", "No"] : (field.options ?? []).map((o) => o.label);
      return (
        <RadioGroup value={str} onValueChange={onChange} required={field.mandatory}>
          <div className="flex flex-wrap gap-4">
            {opts.map((o) => (
              <label key={o} className="flex cursor-pointer items-center gap-1.5 text-sm">
                <RadioGroupItem value={o} />
                {o}
              </label>
            ))}
          </div>
        </RadioGroup>
      );
    }
    case "number":
      return (
        <Input
          id={inputId}
          type="number"
          min={field.min}
          max={field.max}
          className="h-11"
          placeholder={field.placeholder}
          required={field.mandatory}
          value={str}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "date":
    case "time":
      return (
        <Input
          id={inputId}
          type={field.type}
          className="h-11"
          required={field.mandatory}
          value={str}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "file":
      return <Input id={inputId} type="file" className="h-11" required={field.mandatory} />;
    default:
      return (
        <Input
          id={inputId}
          type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"}
          className="h-11"
          placeholder={field.placeholder}
          required={field.mandatory}
          value={str}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

function toLead(values: Values, nextId: string): Lead {
  const get = (id: string) => {
    const v = values[id];
    return Array.isArray(v) ? v.join(", ") : (v ?? "");
  };
  const budgetDigits = Number(String(get("budget")).replace(/[^\d]/g, "")) || 0;
  const city = get("city");
  const workType = get("workType") || "Interior enquiry";
  const summary = Object.entries(values)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .filter((line) => !line.endsWith(": "));
  return {
    id: nextId,
    name: [city, workType].filter(Boolean).join(" "),
    contact: get("name") || "Website enquiry",
    email: get("email"),
    phone: get("contactNumber"),
    city,
    scope: workType,
    budget: budgetDigits > 0 ? formatBudget(budgetDigits) : "—",
    budgetValue: budgetDigits,
    stage: "Created",
    source: "Lead form",
    owner: LEAD_OWNERS[0] ?? "Unassigned",
    updated: "Just now",
    createdAt: new Date().toISOString().slice(0, 10),
    description: summary.join("\n"),
    requirements: summary,
    rooms: [],
    estimate: [],
  };
}

export default function LeadFormPage() {
  const config = useMemo(() => loadFormConfig(studio.name), []);
  const [values, setValues] = useState<Values>({});
  const [done, setDone] = useState(false);
  const items = useMemo(() => libraryItems(config.library), [config.library]);
  const banner = config.banner.image ? items.find((i) => i.id === config.banner.image) : undefined;
  const portfolio = config.portfolioSelected
    ? items.filter((i) => config.portfolioSelected?.includes(i.id))
    : items;
  const ordered = useMemo(
    () => [...config.sections].sort((a, b) => a.order - b.order),
    [config.sections],
  );

  const set = (id: string) => (v: string | string[]) => setValues((prev) => ({ ...prev, [id]: v }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    for (const s of ordered) {
      for (const fld of s.fields) {
        if (!fld.enabled || !fld.mandatory) continue;
        const v = values[fld.id];
        const empty = v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
        if (empty) return;
      }
    }
    const ids = loadExtraLeads().map((l) => parseInt(l.id.replace("LD-", ""), 10) || 0);
    const nextId = `LD-${Math.max(2045, ...ids) + 1}`;
    saveSubmission({
      id: nextId,
      at: new Date().toISOString(),
      values: values as Record<string, string | string[]>,
    });
    saveExtraLead(toLead(values, nextId));
    setDone(true);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <Seo
        title={`${config.studioName} — enquiry form`}
        description={config.form.description || "Send an interior enquiry."}
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {done ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <CheckCircle2 className="mx-auto size-10 text-success" />
            <h1 className="mt-3 text-xl font-bold">Enquiry received</h1>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Thanks for reaching out to {config.studioName}. We’ll call back within 24 hours.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        ) : (
          <>
            {config.banner.show !== false && (banner || config.studioName) && (
              <div className="relative h-44 overflow-hidden rounded-xl bg-gradient-to-br from-brass/50 to-card sm:h-56">
                {banner?.src && (
                  <img
                    src={banner.src}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                    style={{ objectPosition: config.banner.objectPosition.toLowerCase() }}
                  />
                )}
                {banner && !banner.src && (
                  <span
                    className={`absolute inset-0 bg-gradient-to-br to-card ${banner.tone ?? ""}`}
                  />
                )}
                <span
                  className="absolute inset-0 bg-black"
                  style={{ opacity: config.banner.overlay / 100 }}
                />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
                  <span className="text-xl font-bold text-white drop-shadow sm:text-2xl">
                    {config.studioName}
                  </span>
                  <span className="text-xs text-white/85 drop-shadow sm:text-sm">
                    {config.tagline}
                  </span>
                </span>
              </div>
            )}

            {(config.aboutUs.title || config.aboutUs.description) && (
              <div className="mt-6 text-center">
                <h2 className="text-base font-bold">{config.aboutUs.title}</h2>
                {config.aboutUs.description && (
                  <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
                    {config.aboutUs.description}
                  </p>
                )}
              </div>
            )}

            {portfolio.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-2 text-base font-bold">Selected Work</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {portfolio.map((item) => (
                    <span
                      key={item.id}
                      className="block aspect-video w-full overflow-hidden rounded-md border border-border"
                    >
                      <Thumb item={item} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {config.youtubeLinks.length > 0 && (
              <div className="mt-6 grid gap-2">
                {config.youtubeLinks
                  .filter((l) => l.url)
                  .map((l) => (
                    <a
                      key={l.id}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg border border-border p-3 hover:bg-accent"
                    >
                      <span className="block truncate text-sm font-semibold">
                        {l.title || l.url}
                      </span>
                      {l.subtitle && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {l.subtitle}
                        </span>
                      )}
                    </a>
                  ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-6"
            >
              <h1 className="text-lg font-bold">{config.form.title}</h1>
              {config.form.description && (
                <p className="mt-1 text-sm text-muted-foreground">{config.form.description}</p>
              )}
              <div className="mt-4 grid gap-5">
                {ordered.map((s) => {
                  const fields = s.fields.filter((fld) => fld.enabled);
                  if (fields.length === 0) return null;
                  return (
                    <fieldset key={s.id} className="min-w-0">
                      <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {s.title}
                      </legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {fields.map((fld) => (
                          <div
                            key={fld.id}
                            className={
                              fld.type === "textarea" || fld.type === "multi"
                                ? "min-w-0 sm:col-span-2"
                                : "min-w-0"
                            }
                          >
                            <Label htmlFor={`lead-${fld.id}`} className="mb-1.5 block text-xs">
                              {fld.label}
                              {fld.mandatory && <span className="text-destructive"> *</span>}
                            </Label>
                            <FieldInput
                              field={fld}
                              inputId={`lead-${fld.id}`}
                              value={values[fld.id]}
                              onChange={set(fld.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  );
                })}
              </div>
              <Button
                type="submit"
                className="mt-5 h-11 w-full"
                style={{ backgroundColor: config.accentColor, borderColor: config.accentColor }}
              >
                <Send className="size-4" /> Send Enquiry
              </Button>
              {(config.socials.instagram || config.socials.houzz || config.socials.website) && (
                <p className="mt-3 truncate text-center text-xs text-muted-foreground">
                  {[config.socials.instagram, config.socials.houzz, config.socials.website]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </>
  );
}
