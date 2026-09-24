import { useEffect, useState, type FormEvent } from "react";
import { Check, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusPill } from "@/components/ui-kit";
import { cn } from "@/lib/utils";
import { LEAD_STATUSES, LEAD_STATUS_COLORS } from "@/data/mock";
import { DEFAULT_STATUS_COLOR, loadSavedColors, saveSavedColors } from "@/lib/lead-storage";

const SUGGESTED_COLORS = [
  { label: "Gold", hex: "#B98A2F" },
  { label: "Emerald", hex: "#16A34A" },
  { label: "Sky", hex: "#0284C7" },
  { label: "Violet", hex: "#7C3AED" },
  { label: "Rose", hex: "#E11D48" },
  { label: "Orange", hex: "#EA580C" },
  { label: "Teal", hex: "#0D9488" },
  { label: "Slate", hex: "#64748B" },
  { label: "Stone", hex: "#78716C" },
];

function normalizeHex(value: string): string | null {
  const trimmed = value.trim().replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(trimmed) ? `#${trimmed.toUpperCase()}` : null;
}

export function ManageStatusesPanel({
  open,
  onOpenChange,
  statuses,
  colors,
  counts,
  onCreate,
  onRename,
  onDelete,
  defaultOverrides,
  onRecolorDefault,
  onResetDefaultColor,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statuses: string[];
  colors: Record<string, string>;
  counts: Record<string, number>;
  onCreate: (name: string, color: string) => void;
  onRename: (oldName: string, newName: string) => void;
  onDelete: (name: string) => void;
  defaultOverrides: Record<string, string>;
  onRecolorDefault: (name: string, hex: string) => void;
  onResetDefaultColor: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_STATUS_COLOR);
  const [customHex, setCustomHex] = useState("");
  const [savedColors, setSavedColors] = useState<string[]>(loadSavedColors);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  useEffect(() => {
    saveSavedColors(savedColors);
  }, [savedColors]);

  const resetCreate = () => {
    setName("");
    setCustomHex("");
  };

  const submitCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (statuses.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`"${trimmed}" already exists`);
      return;
    }
    onCreate(trimmed, color);
    resetCreate();
  };

  const saveCustomColor = () => {
    const normalized = normalizeHex(customHex);
    if (!normalized) {
      toast.error("Enter a valid hex color", { description: "e.g. #7C3AED" });
      return;
    }
    setSavedColors((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    setColor(normalized);
    setCustomHex("");
    toast.success(`Color ${normalized} saved`);
  };

  const removeSavedColor = (hex: string) => {
    setSavedColors((prev) => prev.filter((c) => c !== hex));
    if (color === hex) setColor(DEFAULT_STATUS_COLOR);
  };

  const submitRename = (oldName: string) => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === oldName) {
      setEditing(null);
      return;
    }
    if (statuses.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(`"${trimmed}" already exists`);
      return;
    }
    onRename(oldName, trimmed);
    setEditing(null);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          resetCreate();
          setEditing(null);
          setPendingDelete(null);
        }
        onOpenChange(value);
      }}
    >
      <SheetContent side="right" className="flex w-[min(420px,92vw)] flex-col gap-4 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Manage statuses</SheetTitle>
          <SheetDescription>
            All pipeline stages in one place. Add new ones, rename or remove custom ones. Default
            colors can be changed, but names are fixed.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 gap-2 overflow-y-auto pr-0.5">
          {statuses.map((status) => {
            const isDefault = LEAD_STATUSES.includes(status);
            const inUse = (counts[status] ?? 0) > 0;
            const isEditing = editing === status;
            return (
              <div
                key={status}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2.5"
              >
                {isEditing ? (
                  <form
                    className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitRename(status);
                    }}
                  >
                    <Input
                      autoFocus
                      className="h-9 min-w-0 flex-1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      aria-label={`Rename ${status}`}
                    />
                    <Button type="submit" size="sm" disabled={!editValue.trim()}>
                      <Check className="size-4" /> Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditing(null)}
                    >
                      <X className="size-4" /> Cancel
                    </Button>
                  </form>
                ) : (
                  <>
                    <StatusPill value={status} color={colors[status]} />
                    {isDefault && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Default
                      </span>
                    )}
                    {isDefault && (
                      <span className="ml-auto flex shrink-0 items-center gap-1">
                        <input
                          type="color"
                          value={
                            colors[status] ?? LEAD_STATUS_COLORS[status] ?? DEFAULT_STATUS_COLOR
                          }
                          onChange={(e) => onRecolorDefault(status, e.target.value)}
                          aria-label={`Change color for ${status}`}
                          className="h-7 w-8 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-1"
                        />
                        {defaultOverrides[status] && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label={`Reset ${status} color`}
                            title="Reset to default color"
                            onClick={() => onResetDefaultColor(status)}
                          >
                            <RotateCcw className="size-3.5" />
                          </Button>
                        )}
                      </span>
                    )}
                    {!isDefault && (
                      <span className="ml-auto flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label={`Rename ${status}`}
                          onClick={() => {
                            setEditing(status);
                            setEditValue(status);
                            setPendingDelete(null);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        {pendingDelete === status ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              disabled={inUse}
                              title={inUse ? "Move leads away first" : `Delete ${status}`}
                              onClick={() => {
                                onDelete(status);
                                setPendingDelete(null);
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setPendingDelete(null)}
                            >
                              Keep
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            aria-label={`Delete ${status}`}
                            disabled={inUse}
                            title={inUse ? "Move leads away first" : `Delete ${status}`}
                            onClick={() => setPendingDelete(status)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={submitCreate} className="grid gap-3 border-t border-border pt-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Add a new status</Label>
            <div className="flex flex-col gap-2">
              <Input
                className="h-9 min-w-0 flex-1 text-sm"
                placeholder="e.g. Follow-up"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button type="submit" size="sm" className="shrink-0" disabled={!name.trim()}>
                <Plus className="size-4" /> Add status
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Suggested colors:</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {SUGGESTED_COLORS.map((option) => (
                <button
                  key={option.hex}
                  type="button"
                  onClick={() => setColor(option.hex)}
                  title={option.label}
                  aria-label={`${option.label} color`}
                  aria-pressed={color === option.hex}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 transition",
                    color === option.hex
                      ? "border-foreground/60 scale-105"
                      : "border-transparent hover:scale-105",
                  )}
                  style={{ backgroundColor: option.hex }}
                >
                  {color === option.hex && <Check className="size-4 text-white" />}
                </button>
              ))}
            </div>
            {savedColors.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">My colors:</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {savedColors.map((hex) => (
                    <span key={hex} className="relative inline-flex">
                      <button
                        type="button"
                        onClick={() => setColor(hex)}
                        title={`Use ${hex}`}
                        aria-label={`Use saved color ${hex}`}
                        aria-pressed={color === hex}
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full border-2 transition",
                          color === hex
                            ? "border-foreground/60 scale-105"
                            : "border-transparent hover:scale-105",
                        )}
                        style={{ backgroundColor: hex }}
                      >
                        {color === hex && <Check className="size-4 text-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSavedColor(hex)}
                        title={`Remove ${hex}`}
                        aria-label={`Remove saved color ${hex}`}
                        className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value.toUpperCase())}
                aria-label="Pick a custom color"
                className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-1"
              />
              <Input
                className="h-9 min-w-0 flex-1 font-mono text-xs uppercase"
                placeholder="#7C3AED"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveCustomColor();
                  }
                }}
                aria-label="Custom hex color"
              />
              <Button type="button" size="sm" variant="outline" onClick={saveCustomColor}>
                Save color
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Preview:</span>
              <StatusPill value={name.trim() || "New status"} color={color} />
            </div>
          </div>
        </form>

        <SheetFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
