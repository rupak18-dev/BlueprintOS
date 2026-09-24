import { defaultFormConfig, type StudioFormConfig } from "@/data/lead-form-config";
import type { Lead } from "@/data/leads";

const CONFIG_KEY = "blueprint.leadFormConfig";
const SUBMISSIONS_KEY = "blueprint.leadFormSubmissions";
const EXTRA_LEADS_KEY = "blueprint.leadExtraRows";

export type FormSubmission = {
  id: string;
  at: string;
  values: Record<string, string | string[]>;
};

function readKey<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeKey(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — config stays session-only
  }
}

function isConfig(value: unknown): value is StudioFormConfig {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c["studioName"] === "string" &&
    typeof c["tagline"] === "string" &&
    Array.isArray(c["sections"])
  );
}

export function loadFormConfig(studioName: string): StudioFormConfig {
  const raw = readKey<unknown>(CONFIG_KEY);
  if (isConfig(raw)) return raw;
  return defaultFormConfig(studioName);
}

export function saveFormConfig(config: StudioFormConfig) {
  writeKey(CONFIG_KEY, config);
}

export function buildPublicUrl(): string {
  return `${window.location.origin}/leadform`;
}

export function loadSubmissions(): FormSubmission[] {
  const raw = readKey<unknown>(SUBMISSIONS_KEY);
  return Array.isArray(raw) ? (raw as FormSubmission[]) : [];
}

export function saveSubmission(entry: FormSubmission) {
  const next = [entry, ...loadSubmissions()].slice(0, 200);
  writeKey(SUBMISSIONS_KEY, next);
}

export function loadExtraLeads(): Lead[] {
  const raw = readKey<unknown>(EXTRA_LEADS_KEY);
  return Array.isArray(raw) ? (raw as Lead[]) : [];
}

export function saveExtraLead(lead: Lead) {
  const next = [lead, ...loadExtraLeads()].slice(0, 200);
  writeKey(EXTRA_LEADS_KEY, next);
}
