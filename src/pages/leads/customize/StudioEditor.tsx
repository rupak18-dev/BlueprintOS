import { useState } from "react";
import { Check, Save, Share } from "lucide-react";
import { toast } from "sonner";

import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studio } from "@/data/mock";
import { type LibraryImage, type StudioFormConfig } from "@/data/lead-form-config";
import { buildPublicUrl, loadFormConfig, saveFormConfig } from "@/lib/lead-form-storage";
import { BrandingTab } from "./tabs/branding-tab";
import { DesignTab } from "./tabs/design-tab";
import { FieldsTab } from "./tabs/fields-tab";
import { LinksTab } from "./tabs/links-tab";
import { PreviewCanvas } from "./preview-canvas";

function cleanReferences(config: StudioFormConfig, id: string): StudioFormConfig {
  return {
    ...config,
    library: config.library.filter((img) => img.id !== id),
    banner: {
      ...config.banner,
      image: config.banner.image === id ? "" : config.banner.image,
      imageMobile: config.banner.imageMobile === id ? "" : config.banner.imageMobile,
    },
    backgroundImage: config.backgroundImage === id ? "" : config.backgroundImage,
    portfolioSelected: config.portfolioSelected?.filter((x) => x !== id) ?? null,
  };
}

export default function StudioEditorPage() {
  const [config, setConfig] = useState<StudioFormConfig>(() => loadFormConfig(studio.name));
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const patch = (p: Partial<StudioFormConfig>) => setConfig((prev) => ({ ...prev, ...p }));

  const upload = (img: LibraryImage) =>
    setConfig((prev) => ({ ...prev, library: [...prev.library, img] }));

  const handleSave = () => {
    setSaving(true);
    saveFormConfig(config);
    window.setTimeout(() => {
      setSaving(false);
      toast.success("Form saved", { description: "Your public lead form is up to date." });
    }, 400);
  };

  const handleShare = async () => {
    const url = buildPublicUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard unavailable — still show the URL
    }
    setCopied(true);
    toast.success("Link copied", { description: url });
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo
        title="Customize Form — lead form studio"
        description="Brand, design and configure the public interior enquiry form."
      />

      <header className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold break-words sm:text-2xl lg:text-3xl">Customize Form</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Brand, design and configure the public enquiry form clients fill in.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleShare}>
            {copied ? <Check className="size-4" /> : <Share className="size-4" />}
            {copied ? "Copied" : "Share"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="size-4" /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Tabs defaultValue="branding" className="min-w-0 gap-4">
          <TabsList className="w-full overflow-x-auto sm:w-auto">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="branding">
            <BrandingTab config={config} onPatch={patch} />
          </TabsContent>
          <TabsContent value="design">
            <DesignTab
              config={config}
              onPatch={patch}
              onUpload={upload}
              onDeleteUpload={(id) => setConfig((prev) => cleanReferences(prev, id))}
            />
          </TabsContent>
          <TabsContent value="links">
            <LinksTab config={config} onPatch={patch} />
          </TabsContent>
          <TabsContent value="fields">
            <FieldsTab
              sections={[...config.sections].sort((a, b) => a.order - b.order)}
              onChange={(sections) =>
                setConfig((prev) => ({
                  ...prev,
                  sections: sections.map((s, i) => ({ ...s, order: i })),
                }))
              }
            />
          </TabsContent>
        </Tabs>

        <div className="min-w-0 xl:sticky xl:top-4">
          <PreviewCanvas config={config} />
        </div>
      </div>
    </>
  );
}
