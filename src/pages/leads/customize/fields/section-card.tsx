import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ADD_MENU_TYPES,
  FIELD_TYPE_LABELS,
  blankField,
  type LeadFormField,
  type LeadFormSection,
} from "@/data/lead-form-config";
import { FieldRow } from "./field-row";

export function SectionCard({
  section,
  sections,
  canRemove,
  onRename,
  onRemove,
  onAddField,
  onPatchField,
  onRemoveField,
  onMoveField,
}: {
  section: LeadFormSection;
  sections: LeadFormSection[];
  canRemove: boolean;
  onRename: (title: string) => void;
  onRemove: () => void;
  onAddField: (field: LeadFormField) => void;
  onPatchField: (id: string, patch: Partial<LeadFormField>) => void;
  onRemoveField: (id: string) => void;
  onMoveField: (id: string, dir: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);

  if (section.locked) {
    return (
      <div className="min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{section.title}</p>
            {section.description && (
              <p className="truncate text-xs text-muted-foreground">{section.description}</p>
            )}
          </div>
          <Badge variant="outline" className="shrink-0">
            {section.fields.filter((fld) => fld.enabled).length} live · read-only
          </Badge>
        </div>
        <ul className="mt-3 space-y-1.5">
          {section.fields.map((fld) => (
            <li
              key={fld.id}
              className="flex min-w-0 items-center justify-between gap-2 rounded-md bg-muted/40 px-2.5 py-2"
            >
              <span className="min-w-0 truncate text-xs font-medium">{fld.label}</span>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0",
                  fld.enabled
                    ? "bg-success/15 text-success border-success/30"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {fld.enabled ? "Live" : "Off"}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4">
      <div className="flex min-w-0 items-center gap-2">
        {editing ? (
          <Input
            className="h-9 min-w-0 flex-1"
            autoFocus
            defaultValue={section.title}
            aria-label="Section title"
            onBlur={(e) => {
              onRename(e.target.value.trim() || section.title);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="min-w-0 flex-1 truncate text-left text-sm font-semibold hover:underline"
          >
            {section.title}
          </button>
        )}
        <Badge variant="outline" className="shrink-0">
          {section.fields.length} fields
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse section" : "Expand section"}
        >
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </Button>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-destructive hover:text-destructive"
            onClick={onRemove}
            aria-label={`Remove ${section.title}`}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      {open && (
        <div className="mt-3 grid gap-2.5">
          {section.fields.map((fld) => (
            <FieldRow
              key={fld.id}
              field={fld}
              sections={sections}
              onPatch={(p) => onPatchField(fld.id, p)}
              onRemove={() => onRemoveField(fld.id)}
              onMoveUp={() => onMoveField(fld.id, -1)}
              onMoveDown={() => onMoveField(fld.id, 1)}
            />
          ))}
          <div className="flex flex-wrap gap-1.5">
            {ADD_MENU_TYPES.slice(0, 4).map((t) => (
              <Button
                key={t}
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => onAddField(blankField(t))}
              >
                <Plus className="size-3.5" /> {FIELD_TYPE_LABELS[t]}
              </Button>
            ))}
            <span className="inline-flex items-center px-1 text-xs text-muted-foreground">
              + {ADD_MENU_TYPES.length - 4} more in Add
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
