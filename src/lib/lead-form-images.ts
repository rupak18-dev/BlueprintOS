import { gallery } from "@/data/mock";
import type { LibraryImage } from "@/data/lead-form-config";

export type GalleryItem = { id: string; title: string; tone?: string; src?: string };

export function libraryItems(uploads: LibraryImage[]): GalleryItem[] {
  return [
    ...uploads.map((u) => ({ id: u.id, title: u.title, src: u.src })),
    ...gallery.map((g, i) => ({ id: `gallery-${i}`, title: g.title, tone: g.tone })),
  ];
}
