<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules (mandatory for all AI work)

### Workflow — always start with plan.md

- This file is auto-loaded into every AI session. After reading it, ALWAYS begin
  each new task by opening the project root `plan.md` and writing a concrete step
  checklist for that task before touching any code.
- Keep `plan.md` updated as the task progresses; mark items done (`- [x]`) as you finish them.
- Finish each task with verification (see "Quality gates") and report results to the user.

### Code rules

- **File size:** no single file may exceed 1000 lines. Split pages, components,
  hooks and data into smaller, focused units BEFORE the limit is reached.
  Pre-existing near-limit files (e.g. `src/data/mock.ts`, ~931 lines) must be split
  into modules the next time an AI modifies them.
- **No redundant code:**
  - Reuse existing components instead of re-creating them: `src/components/ui-kit.tsx`
    (PageHeader, StatCard, StatGrid, Section, ResponsiveTable, StatusPill, DetailList)
    and the shadcn primitives in `src/components/ui/*`.
  - Keep a single source of truth for shared types, option lists (statuses, sources,
    owners, scopes, rooms, styles, budget ranges) and formatting helpers in
    `src/data/mock.ts` and `src/lib/utils.ts` — import them, never copy-paste.
  - Extract shared fields/components when the same pattern repeats (dialogs, filters,
    table cells) rather than duplicating markup and logic.
- **Mobile responsive:**
  - Every page and component must look right and behave at 480 / 640 / 768 / 1024 /
    1280 / 1440 px widths.
  - Tables stay tabular everywhere: a real table with horizontal scroll, never
    stacked cards (unless explicitly requested).
  - Toolbars and filter rows must wrap cleanly without horizontal overflow; avoid
    fixed widths that break small screens; use responsive Tailwind breakpoints.
- **Quality gates:** after every change run `npm run lint` and `npm run build`, and
  fix all errors (not just warnings caused by shadcn boilerplate) before finishing.

### Conventions

- Stack: React + Vite + TypeScript, shadcn/ui (new-york), Tailwind CSS v4, lucide icons.
- Match existing patterns: `h-11` inputs, `size-4` icons, page structure from ui-kit.
- Do not add code comments unless the user asks for them.
- Do not modify `<!-- LOVABLE:... -->` regions or rewrite published git history.
