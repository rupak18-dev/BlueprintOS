import { Card } from "@/components/ui/card";
import { gallery } from "@/data/mock";
import type { GalleryItem } from "@/lib/lead-form-images";
import { libraryItems } from "@/lib/lead-form-images";
import { Thumb } from "./image-selector";
import type { StudioFormConfig } from "@/data/lead-form-config";

const BANNER_H = { Small: "h-28", Medium: "h-44", Large: "h-64" } as const;

function findItem(config: StudioFormConfig, id: string): GalleryItem | undefined {
  return libraryItems(config.library).find((i) => i.id === id);
}

export function PreviewCanvas({ config }: { config: StudioFormConfig }) {
  const banner = config.banner.image ? findItem(config, config.banner.image) : undefined;
  const items = libraryItems(config.library);
  const portfolio = config.portfolioSelected
    ? items.filter((i) => config.portfolioSelected?.includes(i.id))
    : items;
  const accent = config.accentColor;
  const enabledSections = config.sections.filter((s) => s.fields.some((fld) => fld.enabled));

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Live Preview
        </p>
      </div>
      <div className="max-h-[80vh] space-y-5 overflow-y-auto p-4">
        {config.banner.show !== false && (
          <div
            className={`relative ${BANNER_H[config.banner.height]} overflow-hidden rounded-lg bg-gradient-to-br from-brass/50 to-card`}
          >
            {banner &&
              (banner.src ? (
                <img
                  src={banner.src}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  style={{ objectPosition: config.banner.objectPosition.toLowerCase() }}
                />
              ) : (
                <span
                  className={`absolute inset-0 bg-gradient-to-br to-card ${banner.tone ?? ""}`}
                />
              ))}
            <span
              className="absolute inset-0 bg-black"
              style={{ opacity: config.banner.overlay / 100 }}
            />
            {config.banner.showGradient && (
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
            )}
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
              <span className="text-lg font-bold text-white drop-shadow">{config.studioName}</span>
              <span className="text-xs text-white/85 drop-shadow">{config.tagline}</span>
            </span>
          </div>
        )}

        {(config.aboutUs.title || config.aboutUs.description) && (
          <div className="min-w-0 text-center">
            <p className="text-sm font-bold">{config.aboutUs.title}</p>
            {config.aboutUs.description && (
              <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                {config.aboutUs.description}
              </p>
            )}
          </div>
        )}

        {portfolio.length > 0 && (
          <div className="min-w-0">
            <p className="mb-2 text-sm font-bold">Selected Work</p>
            <div className="grid grid-cols-3 gap-2">
              {portfolio.slice(0, 6).map((item) => (
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
          <div className="min-w-0 space-y-2">
            {config.youtubeLinks.map((l) => (
              <div key={l.id} className="rounded-md border border-border p-2.5">
                <p className="truncate text-xs font-semibold">{l.title || "Untitled film"}</p>
                {l.subtitle && (
                  <p className="truncate text-[11px] text-muted-foreground">{l.subtitle}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="min-w-0 rounded-lg border border-border p-4">
          <p className="text-sm font-bold">{config.form.title}</p>
          {config.form.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{config.form.description}</p>
          )}
          <div className="mt-3 grid gap-2.5">
            {enabledSections.map((s) => (
              <div key={s.id} className="min-w-0">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.title}
                </p>
                <div className="grid gap-2">
                  {s.fields
                    .filter((fld) => fld.enabled)
                    .map((fld) => (
                      <div key={fld.id} className="min-w-0">
                        <p className="mb-0.5 text-[11px] font-medium">
                          {fld.label}
                          {fld.mandatory && <span className="text-destructive"> *</span>}
                        </p>
                        <span className="block h-9 w-full rounded-md border border-border bg-muted/40 px-2.5 text-xs leading-9 text-muted-foreground">
                          {fld.placeholder || fld.type}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
            <span
              className="mt-1 block h-10 w-full rounded-md text-center text-sm font-semibold leading-10 text-white"
              style={{ backgroundColor: accent }}
            >
              Send Enquiry
            </span>
          </div>
        </div>

        {(config.socials.instagram || config.socials.houzz || config.socials.website) && (
          <p className="truncate text-center text-[11px] text-muted-foreground">
            {[config.socials.instagram, config.socials.houzz, config.socials.website]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        {gallery.length === 0 && portfolio.length === 0 && null}
      </div>
    </Card>
  );
}
