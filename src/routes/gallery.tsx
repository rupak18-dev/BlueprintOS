import { createFileRoute } from "@tanstack/react-router";

import { SiteShell } from "@/components/site-shell";
import { gallery } from "@/data/mock";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — interior projects by Atelier Verde" },
      {
        name: "description",
        content: "Sample residential and commercial interiors designed and delivered through the Atelier Verde workspace.",
      },
      { property: "og:title", content: "Gallery — interior projects by Atelier Verde" },
      { property: "og:description", content: "Residential and commercial interiors, room by room." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Gallery</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          A selection of spaces designed in the 3D / VR studio and delivered on site. Placeholder visuals for now.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...gallery, ...gallery].map((g, i) => (
            <figure
              key={`${g.title}-${i}`}
              className={`flex min-h-52 flex-col justify-end rounded-2xl bg-gradient-to-br ${g.tone} to-muted p-5 shadow-panel sm:min-h-64`}
            >
              <Badge variant="outline" className="w-fit bg-background/70">
                {g.tag}
              </Badge>
              <figcaption className="mt-2 truncate text-base font-semibold">{g.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
