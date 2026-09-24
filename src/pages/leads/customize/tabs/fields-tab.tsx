import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_SECTION_ID,
  LEAD_QUESTIONS_SECTION_ID,
  blankField,
  newId,
  type LeadFormSection,
} from "@/data/lead-form-config";
import { AddFieldMenu } from "../fields/add-field-menu";
import { SectionCard } from "../fields/section-card";

export function FieldsTab({
  sections,
  onChange,
}: {
  sections: LeadFormSection[];
  onChange: (sections: LeadFormSection[]) => void;
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        fields: s.fields.filter((fld) => fld.label.toLowerCase().includes(q)),
      }))
      .filter((s) => s.fields.length > 0 || s.title.toLowerCase().includes(q));
  }, [sections, query]);

  const patchSection = (id: string, p: Partial<LeadFormSection>) =>
    onChange(sections.map((s) => (s.id === id ? { ...s, ...p } : s)));

  const addSection = () =>
    onChange([
      ...sections,
      {
        id: newId("section"),
        title: `Section ${sections.length + 1}`,
        description: "",
        order: sections.length,
        fields: [],
      },
    ]);

  const removeSection = (id: string) => {
    if (id === LEAD_QUESTIONS_SECTION_ID) return;
    const rest = sections.filter((s) => s.id !== id);
    if (id === DEFAULT_SECTION_ID && rest.length === 0) return;
    onChange(rest);
  };

  const moveField = (sectionId: string, fieldId: string, dir: -1 | 1) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const next = [...section.fields];
    const i = next.findIndex((fld) => fld.id === fieldId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= next.length) return;
    const [item] = next.splice(i, 1);
    if (item) next.splice(j, 0, item);
    patchSection(sectionId, { fields: next });
  };

  return (
    <div className="grid gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 basis-48">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fields..."
            className="h-10 pl-8 text-sm"
          />
        </div>
        <AddFieldMenu
          onAdd={(type) => {
            const first = [...sections].sort((a, b) => a.order - b.order)[0];
            if (!first || first.locked) return;
            patchSection(first.id, { fields: [...first.fields, blankField(type)] });
          }}
        />
        <Button type="button" size="sm" onClick={addSection}>
          <Plus className="size-4" /> Add Section
        </Button>
      </div>

      {visible.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          sections={sections}
          canRemove={
            section.id !== LEAD_QUESTIONS_SECTION_ID &&
            !(section.id === DEFAULT_SECTION_ID && sections.length === 1)
          }
          onRename={(title) => patchSection(section.id, { title })}
          onRemove={() => removeSection(section.id)}
          onAddField={(field) => patchSection(section.id, { fields: [...section.fields, field] })}
          onPatchField={(id, p) =>
            patchSection(section.id, {
              fields: section.fields.map((fld) => (fld.id === id ? { ...fld, ...p } : fld)),
            })
          }
          onRemoveField={(id) =>
            patchSection(section.id, { fields: section.fields.filter((fld) => fld.id !== id) })
          }
          onMoveField={(id, dir) => moveField(section.id, id, dir)}
        />
      ))}
    </div>
  );
}
