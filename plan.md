# AI Task Plan — Revert to lucide icons + Leads "Manage columns"

- **Task:** Remove Majesticons, restore lucide-react across the whole app; convert the
  Leads toolbar popover "Manage filters" → "Manage columns" (circular check toggles,
  Client name/info locked, advanced filters kept, all dropdowns working). Iteration 2:
  split Filters into its own button, red Clear buttons, persistent bulk-select, bulk-bar
  Export + CSV honors visible columns, fully colored status pill, brass table header.
  Iteration 3 (dark-theme polish): readable table header (brass/40 always, dark-mode
  light text, no hover shift), lighter translucent status pills app-wide, vertically
  centered StatCard content, softer delete-dialog backdrop (black/50).
  Iteration 4: new default lead statuses (Created, Visit planned, Requirement gathered,
  Pending on client decision, On hold, Junk, Won) with global brass-family hex colors
  (`LEAD_STATUS_COLORS` single source of truth). Iteration 5: replace all-brass
  defaults with work-meaningful colors (sky/violet/teal/orange/slate/stone/emerald)
  and let users recolor default statuses in Manage statuses (persisted overrides + reset).
  Iteration 6: date-range presets as checkable text list; Create-lead form restructured
  into Client / Project / Additional sections (role, multiple numbers, sales owner,
  FY, latest remark, meta, rating, tags, tax IDs) with Lead model + detail extended.

## Steps

- [x] Update plan.md checklist
- [x] package.json: re-add lucide-react, drop majesticons; npm install
- [x] Swap 61 files back to lucide-react imports
- [x] Type swap AppIcon → LucideIcon (app-shell + nav-config)
- [x] Delete src/components/icons/
- [x] Leads: Manage columns popover (circular checks, locked name+info, keep advanced filters)
- [x] Wire hiddenCols → table columns + trigger badge
- [x] lint + build, fix errors
- [x] Split Manage columns & Filters into two popovers
- [x] Red Clear buttons (date-range + filters Clear all)
- [x] Persistent bulk-select (until removed)
- [x] Bulk-bar Export button + CSV honors visible columns
- [x] StatusPill fully solid color (ui-kit)
- [x] Brass table header (ResponsiveTable headerClassName)
- [x] lint + build, fix errors
- [x] Dark-theme polish: header `bg-brass/40` + `dark:text-brass`, no hover shift;
      header row `hover:bg-transparent`
- [x] Dark-theme polish: status pills → translucent (toneMap `/15` + `statusSoftStyle`
      color-mix) in ui-kit + leads status dropdown trigger
- [x] Dark-theme polish: StatCard content vertically centered (min-h-[104px], justify-center)
- [x] Dark-theme polish: AlertDialog overlay `bg-black/50 dark:bg-black/60`
- [x] lint + build, fix errors
- [x] New default LEAD_STATUSES + global LEAD_STATUS_COLORS (brass hex map) in mock.ts;
      dashboard pipeline relabeled to new funnel
- [x] ui-kit: StatusPill/statusToneClass resolve LEAD_STATUS_COLORS first (old toneMap
      kept for non-lead modules); leads statusColors seeded from global map
- [x] Remap 13 seed leads to new stages; defaults "Created" in create-lead-panel +
      leadform; Open-leads KPI excludes Won + Junk
- [x] lint + build, fix errors
- [x] New default color palette in LEAD_STATUS_COLORS (sky/violet/teal/orange/
      slate/stone/emerald); Stone added to suggested colors
- [x] lead-storage: blueprint.leadDefaultColors override store (load/save, hex-validated)
- [x] leads.tsx: statusColors merges globals → overrides → customs; recolor/reset
      handlers persisted; ManageStatusesPanel gets color picker + reset on defaults
- [x] lint + build, fix errors
- [x] Date-range popover: presets as full-width text rows with checkmark + active
      state; Clear as red text row
- [x] mock.ts: ROLE_OPTIONS + FINANCIAL_YEARS; Lead type extended with optional
      role/alternatePhones/salesOwner/tentativeStart/financialYear/latestRemark/
      metaDetails/rating/tags/taxIds
- [x] create-lead-panel rebuilt: Client details (name/number/email/role + multiple
      numbers checkbox), Project details (project/sales owner/assigned/status/budget/
      scope/start/FY/description/remark), Additional information (source/city/locality/
      property/area/meta/rating/tags/tax IDs)
- [x] lead-detail Overview shows all new fields
- [x] lint + build, fix errors
- [x] Fix: created leads persist (saveExtraLead) + lead-detail finds extra leads
- [x] Browser verify: presets, 3 sections, multi-number, created lead, detail fields
- [x] lint + build, fix errors

## Verification results

- `npm run lint` → 0 errors (9 pre-existing shadcn react-refresh warnings).
- `npm run build` → success.
- Browser (Playwright @ 1440px, dark theme, /leads): header bg stays
  `brass/40` before and after hover (no darkening), header text = light brass
  `oklch(0.75 0.11 78)`; status trigger bg = `/0.15` translucent; 4 StatCards
  render with centered content (`min-h-[104px]`); delete AlertDialog opens with
  overlay `oklab(0 0 0 / 0.6)` (was black/80) — background clearly visible.
- Prior iteration results: bulk-select selections persist after leaving select
  mode and after re-entering, clear on Apply/Done/Delete; bulk bar shows Export.
- Iteration 4 (Playwright @ 1440px, dark): table stages = new defaults; first
  trigger bg `#8C6A2A @ 16%` with `#8C6A2A` text; KPIs = 13 total / 10 open
  (Won+Junk excluded) / 2 won / 15%; Manage-statuses shows all 7 defaults with
  "Default" badges; dashboard pipeline lists Created → Visit planned →
  Requirement gathered → Pending on client decision → On hold → Won.
- Iteration 6 (Playwright @ 1440px): preset checkmark toggles 0↔1 correctly
  (Today vs Last 7 days exclusive), trigger shows `18-09-2026 – 24-09-2026` + badge;
  create panel renders Client/Project/Additional sections; checkbox seeds one alt
  number row, "Add number" appends; created lead appears in table and detail page
  shows Role, Alt. numbers (both), Sales owner, Tentative start, FY, Latest remark,
  Meta details, Rating, Tags, Tax IDs with `—` fallbacks. Also fixed: created leads
  now persist via `saveExtraLead` and lead-detail reads extra leads (was 404 before).