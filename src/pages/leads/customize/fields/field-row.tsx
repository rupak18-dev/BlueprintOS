import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  FIELD_TYPE_LABELS,
  supportsBranching,
  supportsOptions,
  supportsPlaceholder,
  type LeadFormField,
  type LeadFormFieldType,
  type LeadFormSection,
} from "@/data/lead-form-config";
import { OptionsEditor } from "./options-editor";

export function FieldRow({
  field,
  sections,
  onPatch,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  field: LeadFormField;
  sections: LeadFormSection[];
  onPatch: (patch: Partial<LeadFormField>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-3">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={() => onPatch({ enabled: !field.enabled })}
          aria-label={field.enabled ? `Hide ${field.label}` : `Show ${field.label}`}
        >
          {field.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </Button>
        <Input
          className="h-10 min-w-0 flex-1"
          value={field.label}
          onChange={(e) => onPatch({ label: e.target.value })}
          aria-label="Field label"
        />
        <Select
          value={field.type}
          disabled={field.builtin ?? false}
          onValueChange={(v) => onPatch({ type: v as LeadFormFieldType })}
        >
          <SelectTrigger className="h-10 w-36 shrink-0" aria-label="Field type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FIELD_TYPE_LABELS).map(([v, l]) => (
              <SelectItem key={v} value={v}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onMoveUp}
          aria-label="Move field up"
        >
          <ArrowUp className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onMoveDown}
          aria-label="Move field down"
        >
          <ArrowDown className="size-3.5" />
        </Button>
        {!field.builtin && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-destructive hover:text-destructive"
            onClick={onRemove}
            aria-label={`Remove ${field.label}`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>

      <div className="mt-2.5 grid gap-2.5">
        {supportsPlaceholder(field.type) && (
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Placeholder</Label>
            <Input
              className="h-10"
              value={field.placeholder ?? ""}
              onChange={(e) => onPatch({ placeholder: e.target.value })}
            />
          </div>
        )}
        {supportsOptions(field.type) && (
          <OptionsEditor
            options={field.options ?? []}
            branching={supportsBranching(field.type)}
            sections={sections}
            onChange={(options) => onPatch({ options })}
          />
        )}
        {field.type === "textarea" && (
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Rows</Label>
            <Input
              type="number"
              min={2}
              max={10}
              className="h-10 w-28"
              value={field.rows ?? 3}
              onChange={(e) => onPatch({ rows: Number(e.target.value) || 3 })}
            />
          </div>
        )}
        {field.type === "number" && (
          <div className="grid grid-cols-2 gap-2">
            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">Min</Label>
              <Input
                type="number"
                className="h-10"
                value={field.min ?? ""}
                onChange={(e) =>
                  onPatch({ min: e.target.value === "" ? undefined : Number(e.target.value) })
                }
              />
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">Max</Label>
              <Input
                type="number"
                className="h-10"
                value={field.max ?? ""}
                onChange={(e) =>
                  onPatch({ max: e.target.value === "" ? undefined : Number(e.target.value) })
                }
              />
            </div>
          </div>
        )}
        {field.type === "checkbox" && (
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Checkbox label</Label>
            <Input
              className="h-10"
              value={field.checkboxLabel ?? ""}
              onChange={(e) => onPatch({ checkboxLabel: e.target.value })}
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {field.builtin ? "Built-in field" : "Custom field"}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Label className="text-xs text-muted-foreground">Mandatory</Label>
            <Switch
              checked={field.mandatory && field.enabled}
              disabled={!field.enabled}
              onCheckedChange={(v) => onPatch({ mandatory: v })}
              aria-label={`Mandatory for ${field.label}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
