import { PROPERTY_TYPES, STYLE_OPTIONS, WORK_TYPES } from "./mock";

export type LeadFormFieldType =
  | "text"
  | "number"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "multi"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "file"
  | "yesno";

export const FIELD_TYPE_LABELS: Record<LeadFormFieldType, string> = {
  text: "Text",
  number: "Number",
  email: "Email",
  tel: "Phone",
  textarea: "Long Text",
  select: "Dropdown",
  multi: "Multi-Select",
  checkbox: "Checkbox",
  radio: "Radio Group",
  date: "Date",
  time: "Time",
  file: "File Upload",
  yesno: "Yes/No",
};

export const ADD_MENU_TYPES: LeadFormFieldType[] = [
  "text",
  "number",
  "email",
  "tel",
  "textarea",
  "select",
  "multi",
  "checkbox",
  "radio",
  "date",
  "time",
  "file",
];

const OPTION_TYPES: LeadFormFieldType[] = ["select", "multi", "radio", "checkbox", "yesno"];
const PLACEHOLDER_TYPES: LeadFormFieldType[] = [
  "text",
  "number",
  "email",
  "tel",
  "textarea",
  "select",
  "multi",
  "time",
];

export function supportsOptions(type: LeadFormFieldType): boolean {
  return OPTION_TYPES.includes(type);
}

export function supportsPlaceholder(type: LeadFormFieldType): boolean {
  return PLACEHOLDER_TYPES.includes(type);
}

export function supportsBranching(type: LeadFormFieldType): boolean {
  return type === "select" || type === "multi" || type === "radio" || type === "yesno";
}

export type FieldOption = {
  id: string;
  label: string;
  jumpTo?: string | undefined;
};

export type LeadFormField = {
  id: string;
  type: LeadFormFieldType;
  label: string;
  placeholder?: string;
  enabled: boolean;
  mandatory: boolean;
  builtin?: boolean;
  options?: FieldOption[];
  rows?: number;
  min?: number | undefined;
  max?: number | undefined;
  checkboxLabel?: string;
};

export type LeadFormSection = {
  id: string;
  title: string;
  description?: string;
  order: number;
  fields: LeadFormField[];
  locked?: boolean;
};

export type YoutubeLink = {
  id: string;
  url: string;
  title: string;
  subtitle: string;
};

export type LibraryImage = {
  id: string;
  src: string;
  title: string;
};

export type StudioFormConfig = {
  studioName: string;
  tagline: string;
  logo: string;
  aboutUs: { title: string; description: string };
  form: { title: string; description: string };
  accentColor: string;
  banner: {
    show: boolean;
    image: string;
    imageMobile: string;
    height: "Small" | "Medium" | "Large";
    overlay: number;
    objectPosition: "Top" | "Center" | "Bottom";
    showGradient: boolean;
  };
  backgroundImage: string;
  library: LibraryImage[];
  portfolioSelected: string[] | null;
  youtubeLinks: YoutubeLink[];
  socials: { instagram: string; houzz: string; website: string };
  sections: LeadFormSection[];
};

export const DEFAULT_SECTION_ID = "section_default";
export const LEAD_QUESTIONS_SECTION_ID = "section_lead_questions";

export const ACCENT_PRESETS = [
  "#8B00FF",
  "#9563B9",
  "#7171E3",
  "#62C362",
  "#F1F154",
  "#FFA500",
  "#E66363",
];

export const DEFAULT_ACCENT = "#B08D57";

function opt(id: string, label: string): FieldOption {
  return { id, label };
}

function f(field: LeadFormField): LeadFormField {
  return field;
}

export function defaultFormConfig(studioName: string): StudioFormConfig {
  return {
    studioName,
    tagline: "Designing spaces that feel like home",
    logo: "",
    aboutUs: { title: "Our Story", description: "" },
    form: {
      title: "Tell us about your space",
      description: "Share your floor plan, scope and budget — we’ll call back within 24 hours.",
    },
    accentColor: DEFAULT_ACCENT,
    banner: {
      show: true,
      image: "",
      imageMobile: "",
      height: "Medium",
      overlay: 30,
      objectPosition: "Center",
      showGradient: true,
    },
    backgroundImage: "",
    library: [],
    portfolioSelected: null,
    youtubeLinks: [],
    socials: { instagram: "", houzz: "", website: "" },
    sections: [
      {
        id: DEFAULT_SECTION_ID,
        title: "Basic Details",
        description: "",
        order: 0,
        fields: [
          f({
            id: "name",
            type: "text",
            label: "Name",
            placeholder: "Your full name",
            enabled: true,
            mandatory: true,
            builtin: true,
          }),
          f({
            id: "email",
            type: "email",
            label: "Email",
            placeholder: "your.email@example.com",
            enabled: true,
            mandatory: true,
            builtin: true,
          }),
          f({
            id: "contactNumber",
            type: "tel",
            label: "Contact Number",
            placeholder: "9876543210",
            enabled: true,
            mandatory: true,
            builtin: true,
          }),
          f({
            id: "whatsappNumber",
            type: "tel",
            label: "WhatsApp Number",
            placeholder: "9876543210",
            enabled: true,
            mandatory: true,
            builtin: true,
          }),
          f({
            id: "propertyType",
            type: "select",
            label: "Property Type",
            placeholder: "Select property type",
            enabled: true,
            mandatory: true,
            builtin: true,
            options: PROPERTY_TYPES.map((o, i) => opt(`pt-${i}`, o)),
          }),
          f({
            id: "workType",
            type: "select",
            label: "Work Type",
            placeholder: "Select work type",
            enabled: true,
            mandatory: true,
            builtin: true,
            options: WORK_TYPES.map((o, i) => opt(`wt-${i}`, o)),
          }),
          f({
            id: "city",
            type: "text",
            label: "City / Site Location",
            placeholder: "Whitefield, Bengaluru",
            enabled: true,
            mandatory: true,
            builtin: true,
          }),
          f({
            id: "startDate",
            type: "date",
            label: "Expected Start / Possession",
            enabled: true,
            mandatory: true,
            builtin: true,
          }),
          f({
            id: "preferredStyle",
            type: "select",
            label: "Preferred Style",
            placeholder: "Select style",
            enabled: true,
            mandatory: false,
            builtin: true,
            options: STYLE_OPTIONS.map((o, i) => opt(`st-${i}`, o)),
          }),
          f({
            id: "budget",
            type: "text",
            label: "Budget",
            placeholder: "₹28,00,000",
            enabled: true,
            mandatory: false,
            builtin: true,
          }),
        ],
      },
      {
        id: LEAD_QUESTIONS_SECTION_ID,
        title: "Lead Questions",
        description: "Qualifiers that help us understand your requirement.",
        order: 1,
        locked: true,
        fields: [
          f({
            id: "q_designer_engaged",
            type: "yesno",
            label: "Are you currently working with an interior designer?",
            enabled: true,
            mandatory: true,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
          f({
            id: "q_requirement_finalized",
            type: "yesno",
            label: "Have you finalized your interior requirement?",
            enabled: true,
            mandatory: true,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
          f({
            id: "q_site_ready",
            type: "yesno",
            label: "Is your site ready for measurement?",
            enabled: true,
            mandatory: true,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
          f({
            id: "q_timeline_six_months",
            type: "yesno",
            label: "Is your project starting within the next 6 months?",
            enabled: false,
            mandatory: false,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
          f({
            id: "q_turnkey_need",
            type: "yesno",
            label: "Do you need a full-home turnkey package?",
            enabled: false,
            mandatory: false,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
          f({
            id: "q_budget_decided",
            type: "yesno",
            label: "Have you already decided on a budget for interiors?",
            enabled: false,
            mandatory: false,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
          f({
            id: "q_floor_plan_ready",
            type: "yesno",
            label: "Do you have a floor plan ready to share?",
            enabled: false,
            mandatory: false,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
          f({
            id: "q_loan_approved",
            type: "yesno",
            label: "Is your home loan / funding approved?",
            enabled: false,
            mandatory: false,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
          f({
            id: "q_contact_design_services",
            type: "yesno",
            label: "Would you like us to contact you about our design services?",
            enabled: false,
            mandatory: false,
            builtin: true,
            options: [opt("yes", "Yes"), opt("no", "No")],
          }),
        ],
      },
    ],
  };
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

export function blankField(type: LeadFormFieldType): LeadFormField {
  return {
    id: newId("fld"),
    type,
    label: `New ${FIELD_TYPE_LABELS[type] ?? type}`,
    placeholder: "",
    enabled: true,
    mandatory: false,
    ...(supportsOptions(type) ? { options: [{ id: newId("opt"), label: "Option 1" }] } : {}),
  };
}
