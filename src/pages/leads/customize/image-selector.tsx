import { useRef } from "react";
import { Check, ImagePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { newId, type LibraryImage } from "@/data/lead-form-config";
import type { GalleryItem } from "@/lib/lead-form-images";

export function Thumb({ item, className }: { item: GalleryItem; className?: string }) {
  if (item.src) {
    return (
      <img src={item.src} alt={item.title} className={cn("size-full object-cover", className)} />
    );
  }
  return (
    <span
      className={cn("grid size-full place-items-center bg-gradient-to-br to-card", item.tone)}
      aria-hidden
    >
      <span className="px-1 text-center text-[10px] font-semibold text-foreground/70">
        {item.title}
      </span>
    </span>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadButton({
  onUpload,
  label = "Upload Images",
}: {
  onUpload: (img: LibraryImage) => void;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-label={label}
        onChange={async (e) => {
          const files = [...(e.target.files ?? [])];
          for (const file of files) {
            const src = await readAsDataUrl(file);
            onUpload({ id: newId("img"), src, title: file.name });
          }
          e.target.value = "";
        }}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => ref.current?.click()}>
        <ImagePlus className="size-4" /> {label}
      </Button>
    </>
  );
}

export function SingleImageSelector({
  items,
  value,
  onChange,
  onUpload,
  onDeleteUpload,
  hint,
}: {
  items: GalleryItem[];
  value: string;
  onChange: (id: string) => void;
  onUpload: (img: LibraryImage) => void;
  onDeleteUpload: (id: string) => void;
  hint?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <UploadButton onUpload={onUpload} />
        <Button
          type="button"
          variant={value === "" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onChange("")}
        >
          None
        </Button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((item) => {
          const active = value === item.id;
          const uploaded = !item.id.startsWith("gallery-");
          return (
            <div key={item.id} className="group relative min-w-0">
              <button
                type="button"
                onClick={() => onChange(active ? "" : item.id)}
                aria-pressed={active}
                className={cn(
                  "relative block aspect-video w-full overflow-hidden rounded-md border",
                  active && "border-brass ring-2 ring-brass/40",
                )}
              >
                <Thumb item={item} />
                {active && (
                  <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-brass text-brass-foreground">
                    <Check className="size-3" />
                  </span>
                )}
              </button>
              {uploaded && (
                <button
                  type="button"
                  aria-label={`Delete ${item.title}`}
                  onClick={() => onDeleteUpload(item.id)}
                  className="absolute left-1 top-1 hidden size-6 place-items-center rounded-full bg-destructive text-destructive-foreground group-hover:grid"
                >
                  <Trash2 className="size-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MultiImageSelector({
  items,
  selected,
  onChange,
  emptyText = "No portfolio images uploaded yet",
}: {
  items: GalleryItem[];
  selected: string[] | null;
  onChange: (ids: string[] | null) => void;
  emptyText?: string;
}) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  const active = selected ?? items.map((i) => i.id);
  const toggle = (id: string) =>
    onChange(active.includes(id) ? active.filter((x) => x !== id) : [...active, id]);
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {active.length} of {items.length} selected
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
          Select All
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((item) => {
          const on = active.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              aria-pressed={on}
              className={cn(
                "relative block aspect-video w-full overflow-hidden rounded-md border",
                on && "border-brass ring-2 ring-brass/40",
              )}
            >
              <Thumb item={item} />
              {on && (
                <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-brass text-brass-foreground">
                  <Check className="size-3" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
