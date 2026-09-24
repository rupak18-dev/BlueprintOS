# AI Task Plan — Leads: saved colors + collapsible lead form + rooms + AntD dates

- **Task:** Save-then-use color flow with My colors + localStorage (custom statuses persisted too, backend later); collapsible sections in Create Lead (sidebar pattern); rooms 2-col wrap full names; Expected start + Follow-up as Calendar popovers with DD-MM-YYYY.

## Steps

- [x] Update plan.md checklist
- [x] Saved colors (My colors + localStorage) + persist custom statuses
- [x] Collapsible sections in Create Lead panel
- [x] Rooms 2-col wrap + AntD date pickers
- [x] `npm run lint` + `npm run build` + Playwright

## Verification results

- Save-then-use color flow: hex field + Save color -> My colors row (select/remove); saved to `blueprint.leadSavedColors`; custom statuses + colors in `blueprint.leadCustomStatuses` (validated, backend-ready keys)
- Create Lead sections collapsible (sidebar Chevron pattern, default open); submit expands all first so required validation never hides
- Rooms 2-col wrap, all 10 full names visible, no truncation
- Expected start + Follow-up are Calendar popovers with DD-MM-YYYY labels + Clear; rooms note uses formatted date
- Playwright 20/20: save/use/remove color, reload persistence, collapse/expand, rooms, both pickers, submit with collapsed sections, 0px overflow at 480/768, no page errors; screenshots verified
- lint: 0 errors · build: passed · tsc: no new errors (1 pre-existing)
