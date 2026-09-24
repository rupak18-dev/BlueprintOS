import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADD_MENU_TYPES, FIELD_TYPE_LABELS, type LeadFormFieldType } from "@/data/lead-form-config";

export function AddFieldMenu({ onAdd }: { onAdd: (type: LeadFormFieldType) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <Plus className="size-4" /> Add
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
        <DropdownMenuLabel>Field type</DropdownMenuLabel>
        {ADD_MENU_TYPES.map((t) => (
          <DropdownMenuItem key={t} onSelect={() => onAdd(t)}>
            {FIELD_TYPE_LABELS[t]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
