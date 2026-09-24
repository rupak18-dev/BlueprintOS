import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { newId, type FieldOption, type LeadFormSection } from "@/data/lead-form-config";

export function OptionsEditor({
  options,
  branching,
  sections,
  onChange,
}: {
  options: FieldOption[];
  branching: boolean;
  sections: LeadFormSection[];
  onChange: (options: FieldOption[]) => void;
}) {
  const move = (index: number, dir: -1 | 1) => {
    const next = [...options];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    const [item] = next.splice(index, 1);
    if (item) next.splice(j, 0, item);
    onChange(next);
  };

  return (
    <div className="min-w-0 space-y-2">
      <p className="text-xs font-medium">Options</p>
      {options.map((o, i) => (
        <div key={o.id} className="flex min-w-0 flex-wrap items-center gap-1.5">
          <Input
            className="h-10 min-w-0 flex-1"
            value={o.label}
            onChange={(e) =>
              onChange(options.map((x) => (x.id === o.id ? { ...x, label: e.target.value } : x)))
            }
          />
          {branching && (
            <Select
              value={o.jumpTo ?? "__none"}
              onValueChange={(v) =>
                onChange(
                  options.map((x) =>
                    x.id === o.id ? { ...x, jumpTo: v === "__none" ? undefined : v } : x,
                  ),
                )
              }
            >
              <SelectTrigger className="h-10 w-36" aria-label={`Go to for ${o.label}`}>
                <SelectValue placeholder="Go to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">No jump</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            disabled={i === 0}
            onClick={() => move(i, -1)}
            aria-label="Move option up"
          >
            <ArrowUp className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            disabled={i === options.length - 1}
            onClick={() => move(i, 1)}
            aria-label="Move option down"
          >
            <ArrowDown className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-destructive hover:text-destructive"
            onClick={() => onChange(options.filter((x) => x.id !== o.id))}
            aria-label={`Remove ${o.label}`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([...options, { id: newId("opt"), label: `Option ${options.length + 1}` }])
        }
      >
        <Plus className="size-4" /> Add option
      </Button>
      {branching && (
        <p className="text-[11px] text-muted-foreground">Go to: jump to a section per answer.</p>
      )}
    </div>
  );
}
