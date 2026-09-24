import { Plus, Trash2 } from "lucide-react";

import { Section } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newId, type StudioFormConfig, type YoutubeLink } from "@/data/lead-form-config";

export function LinksTab({
  config,
  onPatch,
}: {
  config: StudioFormConfig;
  onPatch: (patch: Partial<StudioFormConfig>) => void;
}) {
  const patchLink = (id: string, p: Partial<YoutubeLink>) =>
    onPatch({
      youtubeLinks: config.youtubeLinks.map((l) => (l.id === id ? { ...l, ...p } : l)),
    });

  return (
    <div className="grid gap-4">
      <Section
        title="YouTube Links"
        description="1–2 cinematic films work best here"
        actions={
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              onPatch({
                youtubeLinks: [
                  ...config.youtubeLinks,
                  { id: newId("yt"), url: "", title: "", subtitle: "" },
                ],
              })
            }
          >
            <Plus className="size-4" /> Add Link
          </Button>
        }
      >
        {config.youtubeLinks.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No YouTube links added yet.
          </p>
        ) : (
          <div className="grid gap-3">
            {config.youtubeLinks.map((link) => (
              <div key={link.id} className="rounded-lg border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="min-w-0 space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">YouTube URL</Label>
                    <Input
                      className="h-11"
                      placeholder="https://youtube.com/watch?v=..."
                      value={link.url}
                      onChange={(e) => patchLink(link.id, { url: e.target.value })}
                    />
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <Label className="text-xs">Title</Label>
                    <Input
                      className="h-11"
                      placeholder="Video Title"
                      value={link.title}
                      onChange={(e) => patchLink(link.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <Label className="text-xs">Subtitle</Label>
                    <Input
                      className="h-11"
                      placeholder="Subtitle / Role"
                      value={link.subtitle}
                      onChange={(e) => patchLink(link.id, { subtitle: e.target.value })}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive hover:text-destructive"
                  onClick={() =>
                    onPatch({ youtubeLinks: config.youtubeLinks.filter((l) => l.id !== link.id) })
                  }
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Social Links" description="Portfolio selection lives under the Design tab">
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["instagram", "Instagram URL"],
              ["houzz", "Houzz URL"],
              ["website", "Website URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="min-w-0 space-y-1.5">
              <Label className="text-xs">{label}</Label>
              <Input
                className="h-11"
                placeholder="https://…"
                value={config.socials[key]}
                onChange={(e) => onPatch({ socials: { ...config.socials, [key]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
