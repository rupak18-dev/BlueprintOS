import { Link } from "react-router-dom";

import { Section } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { StudioFormConfig } from "@/data/lead-form-config";

export function BrandingTab({
  config,
  onPatch,
}: {
  config: StudioFormConfig;
  onPatch: (patch: Partial<StudioFormConfig>) => void;
}) {
  return (
    <div className="grid gap-4">
      <Section title="Studio Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Studio Name</Label>
            <Input className="h-11" value={config.studioName} disabled />
            <p className="text-xs text-muted-foreground">Studio name cannot be changed here</p>
          </div>
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Tagline</Label>
            <Input
              className="h-11"
              placeholder="Capturing moments that last forever"
              value={config.tagline}
              onChange={(e) => onPatch({ tagline: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4 flex min-w-0 items-center gap-3">
          {config.logo ? (
            <img
              src={config.logo}
              alt="Studio logo"
              className="size-12 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted text-xs text-muted-foreground">
              No logo
            </span>
          )}
          <p className="min-w-0 text-xs text-muted-foreground">
            Studio logo is managed in{" "}
            <Link to="/profile" className="font-medium text-foreground underline">
              Studio Profile
            </Link>
            , not here.
          </p>
        </div>
      </Section>

      <Section title="About Us Section">
        <div className="grid gap-4">
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Title</Label>
            <Input
              className="h-11"
              placeholder="Our Story"
              value={config.aboutUs.title}
              onChange={(e) => onPatch({ aboutUs: { ...config.aboutUs, title: e.target.value } })}
            />
          </div>
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea
              rows={4}
              className="resize-none"
              placeholder="Tell clients what your studio stands for…"
              value={config.aboutUs.description}
              onChange={(e) =>
                onPatch({ aboutUs: { ...config.aboutUs, description: e.target.value } })
              }
            />
          </div>
        </div>
      </Section>

      <Section title="Contact Form">
        <div className="grid gap-4">
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Form Title</Label>
            <Input
              className="h-11"
              value={config.form.title}
              onChange={(e) => onPatch({ form: { ...config.form, title: e.target.value } })}
            />
          </div>
          <div className="min-w-0 space-y-1.5">
            <Label className="text-xs">Form Description</Label>
            <Textarea
              rows={2}
              className="resize-none"
              value={config.form.description}
              onChange={(e) => onPatch({ form: { ...config.form, description: e.target.value } })}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
