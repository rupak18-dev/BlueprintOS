# VR Interior Design Platform — Phase 1

Build the full platform shell from the uploaded architecture: every section and every page, filled with realistic sample content, and laid out so it works well on laptop, tablet and phone. Desktop is the primary target; smaller screens get simplified but complete versions of the same screens.

## Design direction

Professional studio tool, not a furniture shop. Deep charcoal/ink neutrals with a warm brass accent, one clean sans-serif family, generous spacing, calm cards and tables. Light and dark mode both supported. All colours defined as shared design tokens so the look stays consistent.

## Pages

Marketing and entry
- Home, Gallery, Pricing
- Login, Sign up (visual only in phase 1)

Main workspace
- Dashboard — activity summary, pipeline, upcoming work, quick actions
- Calendar — month / week / day views, site visits, meetings, deadlines
- Leads — list, filters, lead detail with requirements, estimate and quotation view
- Projects — list, project detail with overview, rooms, timeline, budget, team, files, approvals
- Clients — list and client detail with linked leads, projects and history
- Accounts — invoices, payments, expenses, profit summary
- Crew & Staff — team list, member detail, project assignments

Design
- Asset Library — searchable catalogue of furniture, materials and finishes with metadata
- 2D Planner — plan canvas layout with tool rail, layers and room list (interface shell)
- 3D / VR Studio — viewport layout with camera, material and lighting panels (interface shell)
- Client Presentation — shareable presentation view with comments and approve/request-change flow

Operations
- Procurement — purchase orders, vendors, delivery tracking
- Files & Documents
- Communication — threads per project/client
- Tasks — board and list
- Notifications

Studio and support
- Studio Plan — plan tiers, usage, billing
- Profile — user and studio settings
- Help Center — articles and contact

## Responsive behaviour

- Laptop/desktop: fixed left sidebar with grouped navigation, wide multi-column layouts, full data tables.
- Tablet: collapsible icon sidebar, two-column layouts, tables reduced to key columns.
- Phone: bottom or slide-in navigation, single column, tables become stacked cards, filters move into a sheet, all tap targets comfortably sized.
- The 2D Planner and 3D/VR Studio show the canvas full-width on phone with tool panels in slide-up sheets.

## Data

Sample content throughout — no logins or database yet. Data lives in shared mock files so real accounts and saved data can replace it later without redesigning pages.

## Technical notes

- TanStack Start with file-based routes; one route file per page listed above, plus a shared app shell layout for workspace pages.
- Tailwind v4 tokens in `src/styles.css`; shadcn components for tables, sheets, dialogs, tabs, forms.
- Each page defines its own title and description metadata.
- Mock data modules under `src/data/`, shared UI under `src/components/`.
- Responsive rules applied with grid + `min-w-0` + `shrink-0` patterns on every header row so nothing clips on narrow screens.

## Not in this phase

Real 3D/VR rendering, actual floor-plan drawing engine, payments, authentication and persistence. Those pages ship as complete, interactive-looking interfaces ready to be wired up next.

## Delivery order

1. Design tokens, app shell, navigation, home/gallery/pricing, auth screens
2. Dashboard, Leads, Projects, Clients, Calendar
3. Accounts, Crew, Procurement, Tasks, Files, Communication, Notifications
4. Asset Library, 2D Planner, 3D/VR Studio, Client Presentation
5. Studio Plan, Profile, Help Center, plus a pass over every page on phone and tablet widths
