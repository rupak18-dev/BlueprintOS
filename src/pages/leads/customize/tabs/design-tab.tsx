import { Check } from "lucide-react";

import { Section } from "@/components/ui-kit";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ACCENT_PRESETS, type LibraryImage, type StudioFormConfig } from "@/data/lead-form-config";
import { MultiImageSelector, SingleImageSelector, Thumb, UploadButton } from "../image-selector";
import { libraryItems } from "@/lib/lead-form-images";

export function DesignTab({
  config,
  onPatch,
  onUpload,
  onDeleteUpload,
}: {
  config: StudioFormConfig;
  onPatch: (patch: Partial<StudioFormConfig>) => void;
  onUpload: (img: LibraryImage) => void;
  onDeleteUpload: (id: string) => void;
}) {
  const items = libraryItems(config.library);
  const bannerSet = config.banner.show !== false && config.banner.image !== "";
  const patchBanner = (b: Partial<StudioFormConfig["banner"]>) =>
    onPatch({ banner: { ...config.banner, ...b } });

  return (
    <div className="grid gap-4">
      <Section title="Accent Color">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="color"
            aria-label="Pick accent color"
            value={config.accentColor}
            onChange={(e) => onPatch({ accentColor: e.target.value })}
            className="h-11 w-14 cursor-pointer rounded-md border border-border bg-card p-1"
          />
          <Input
            className="h-11 w-32"
            value={config.accentColor}
            onChange={(e) => onPatch({ accentColor: e.target.value })}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {ACCENT_PRESETS.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Use ${hex}`}
                onClick={() => onPatch({ accentColor: hex })}
                className={cn(
                  "grid size-8 place-items-center rounded-full border",
                  config.accentColor === hex && "ring-2 ring-offset-2 ring-brass/60",
                )}
                style={{ backgroundColor: hex }}
              >
                {config.accentColor === hex && (
                  <Check className="size-3.5 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section
        title="Header Banner"
        actions={
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">
              {config.banner.show === false ? "Hidden" : "Shown"}
            </Label>
            <Switch
              checked={config.banner.show !== false}
              onCheckedChange={(v) => patchBanner({ show: v })}
              aria-label="Show banner"
            />
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <UploadButton onUpload={onUpload} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => patchBanner({ image: "", imageMobile: "" })}
          >
            None
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="min-w-0 rounded-md border border-border p-1.5">
              <span
                className={cn(
                  "block aspect-video w-full overflow-hidden rounded",
                  (config.banner.image === item.id || config.banner.imageMobile === item.id) &&
                    "ring-2 ring-brass/60",
                )}
              >
                <Thumb item={item} />
              </span>
              <span className="mt-1 block truncate text-[11px] text-muted-foreground">
                {item.title}
                {config.banner.image === item.id && " · Desktop"}
                {config.banner.imageMobile === item.id && " · Mobile"}
              </span>
              <span className="mt-1 flex gap-1">
                <Button
                  type="button"
                  variant={config.banner.image === item.id ? "secondary" : "outline"}
                  size="sm"
                  className="h-7 flex-1 px-1 text-[11px]"
                  onClick={() => patchBanner({ image: item.id })}
                >
                  Desktop
                </Button>
                <Button
                  type="button"
                  variant={config.banner.imageMobile === item.id ? "secondary" : "outline"}
                  size="sm"
                  className="h-7 flex-1 px-1 text-[11px]"
                  onClick={() => patchBanner({ imageMobile: item.id })}
                >
                  Mobile
                </Button>
              </span>
            </div>
          ))}
        </div>
      </Section>

      {bannerSet && (
        <Section title="Banner Settings">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">Height</Label>
              <Select
                value={config.banner.height}
                onValueChange={(v) =>
                  patchBanner({ height: v as StudioFormConfig["banner"]["height"] })
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Small", "Medium", "Large"].map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">Image Position</Label>
              <Select
                value={config.banner.objectPosition}
                onValueChange={(v) =>
                  patchBanner({ objectPosition: v as StudioFormConfig["banner"]["objectPosition"] })
                }
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Top", "Center", "Bottom"].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 space-y-1.5">
              <Label className="text-xs">Overlay Darkness — {config.banner.overlay}%</Label>
              <Slider
                value={[config.banner.overlay]}
                min={0}
                max={80}
                step={5}
                onValueChange={([v]) => patchBanner({ overlay: v ?? 30 })}
              />
            </div>
            <div className="flex min-w-0 items-center justify-between gap-2 rounded-md border border-border px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-medium">Bottom Gradient</p>
                <p className="text-xs text-muted-foreground">Fade effect</p>
              </div>
              <Switch
                checked={config.banner.showGradient}
                onCheckedChange={(v) => patchBanner({ showGradient: v })}
                aria-label="Bottom gradient"
              />
            </div>
          </div>
        </Section>
      )}

      <Section title="Page Background Image">
        <SingleImageSelector
          items={items}
          value={config.backgroundImage}
          onChange={(id) => onPatch({ backgroundImage: id })}
          onUpload={onUpload}
          onDeleteUpload={onDeleteUpload}
          hint="Optional: Adds a subtle background pattern behind all content"
        />
      </Section>

      <Section title="Portfolio Images">
        <MultiImageSelector
          items={items}
          selected={config.portfolioSelected}
          onChange={(ids) => onPatch({ portfolioSelected: ids })}
        />
      </Section>
    </div>
  );
}
