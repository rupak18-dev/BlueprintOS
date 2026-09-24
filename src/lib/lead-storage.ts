export const DEFAULT_STATUS_COLOR = "#B98A2F";

const CUSTOM_STATUSES_KEY = "blueprint.leadCustomStatuses";
const SAVED_COLORS_KEY = "blueprint.leadSavedColors";
const DEFAULT_COLOR_OVERRIDES_KEY = "blueprint.leadDefaultColors";

export type StoredStatus = { name: string; color: string };

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value);
}

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
    // storage full or unavailable — customizations stay session-only
  }
}

export function loadCustomStatuses(defaults: string[]): StoredStatus[] {
  const raw = readKey<unknown>(CUSTOM_STATUSES_KEY);
  if (!Array.isArray(raw)) return [];
  const seen = new Set(defaults.map((d) => d.toLowerCase()));
  const out: StoredStatus[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const { name, color } = item as { name?: unknown; color?: unknown };
    if (typeof name !== "string" || !name.trim()) continue;
    const trimmed = name.trim();
    const lower = trimmed.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);
    out.push({
      name: trimmed,
      color: isHexColor(color) ? color.toUpperCase() : DEFAULT_STATUS_COLOR,
    });
  }
  return out;
}

export function saveCustomStatuses(items: StoredStatus[]) {
  writeKey(CUSTOM_STATUSES_KEY, items);
}

export function loadSavedColors(): string[] {
  const raw = readKey<unknown>(SAVED_COLORS_KEY);
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (!isHexColor(item)) continue;
    const hex = item.toUpperCase();
    if (seen.has(hex)) continue;
    seen.add(hex);
    out.push(hex);
  }
  return out;
}

export function saveSavedColors(colors: string[]) {
  writeKey(SAVED_COLORS_KEY, colors);
}

export function loadDefaultColorOverrides(validNames: string[]): Record<string, string> {
  const raw = readKey<unknown>(DEFAULT_COLOR_OVERRIDES_KEY);
  if (!raw || typeof raw !== "object" || raw === null) return {};
  const allowed = new Set(validNames);
  const out: Record<string, string> = {};
  for (const [name, color] of Object.entries(raw as Record<string, unknown>)) {
    if (allowed.has(name) && isHexColor(color)) out[name] = color.toUpperCase();
  }
  return out;
}

export function saveDefaultColorOverrides(overrides: Record<string, string>) {
  writeKey(DEFAULT_COLOR_OVERRIDES_KEY, overrides);
}
