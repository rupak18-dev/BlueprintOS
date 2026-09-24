# AI Task Plan — Revert to lucide icons + Leads "Manage columns"

- **Task:** Remove Majesticons, restore lucide-react across the whole app; convert the
  Leads toolbar popover "Manage filters" → "Manage columns" (circular check toggles,
  Client name/info locked, advanced filters kept, all dropdowns working). Iteration 2:
  split Filters into its own button, red Clear buttons, persistent bulk-select, bulk-bar
  Export + CSV honors visible columns, fully colored status pill, brass table header.
  Iteration 3 (dark-theme polish): readable table header (brass/40 always, dark-mode
  light text, no hover shift), lighter translucent status pills app-wide, vertically
  centered StatCard content, softer delete-dialog backdrop (black/50).

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