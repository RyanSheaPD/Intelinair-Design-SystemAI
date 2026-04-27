# Primary pages — standard layout

**Primary pages** are full-app views users reach from global navigation: dashboards, field lists, analytics, settings shells, and similar. They are not one-off modals, marketing pages, or the design-system gallery itself.

This document describes the **standard desktop app shell** and optional regions inside it. Implementations should use design tokens (`design-tokens/tokens.css`) and the linked components.

---

## Desktop: app shell

Use a **fixed-height viewport shell** so the global chrome stays visible while only the main content scrolls.

| Layer | Role |
|--------|------|
| **Left rail** | **Web left nav** — `aside.app-nav` + `nav.nav` from `nav.css` (vertical icons + labels). First column, full viewport height, flush left. Markup parity: [.cursor/skills/agmri-left-navigation/SKILL.md](../.cursor/skills/agmri-left-navigation/SKILL.md). |
| **Main column** | Global header + scrollable page body. |

### Structure (conceptual)

1. **Shell container** — `display: flex`, `height: 100vh` (or `min-height: 100vh` where appropriate), `overflow: hidden` on the shell so nested panes control scrolling.
2. **Sidebar wrapper** — Shrink `0`, full height, `overflow-y: auto` if the nav list can grow. The inner `.nav` should stretch to at least full height (`height: 100%`, `min-height: 100vh` in demos).
3. **Main column** — `flex: 1`, `display: flex`, `flex-direction: column`, `overflow: hidden`. Typical background: neutral surface (`--color-neutral-50` or `--color-surface`) per product context.
4. **Global header** — The app bar from `header.css` (`.header`): brand, optional back, centered search, user area. Stays **outside** the scrollable region (sibling above `.app-content`).
5. **Page content** — A single scrollable region (`flex: 1`, `overflow-y: auto`) with horizontal padding consistent with the product (demos often use roughly `20px 24px` bottom `32px`).

### Sidebar stacking

When the nav is the left sidebar, it must sit **above** main content in stacking order so headers, toolbars, and overlays do not paint over it. See the comment block at the top of `components/nav.css`.

### Reference markup pattern

Demos use wrapper class names such as `.app-shell`, `.app-nav`, `.app-main`, and `.app-content`. Names may differ in product code, but the **flex hierarchy and scroll ownership** should match:

```html
<div class="app-shell">
  <aside class="app-nav" aria-label="Primary">
    <nav class="nav" aria-label="Main navigation">…</nav>
  </aside>
  <div class="app-main">
    <header class="header">…</header>
    <div class="app-content">
      <!-- Page title, toolbars, sections -->
    </div>
  </div>
</div>
```

**Live references:** `pages/home/dashboard.html`, `pages/fields/grower-fields.html`.

---

## Inside the scrollable page body

Order regions top to bottom as needed; common patterns:

1. **Page header** — Title, optional subtitle or metadata, optional actions (primary CTA belongs here or in a toolbar, not duplicated without reason). Use `typography.css` scale; keep hierarchy clear (one dominant title per view).
2. **Secondary navigation** — Horizontal tabs or a sub-nav bar under the global header (see `tabs.css` or page-local tab bars). Fixed/sticky behavior is optional; if fixed, keep height stable to avoid layout shift.
3. **Toolbars** — Filters, search scoped to the page, bulk actions. Align with `filter-pill.css`, `dropdown.css`, `input.css` as appropriate.
4. **Primary content** — Cards, tables (`data-table.css` + loading bar rules from `loading.css`; default table contract in [data-tables.md](./data-tables.md)), charts, maps. For empty data, follow [empty-states.md](./empty-states.md).

Use spacing tokens (`--spacing-*`) between sections rather than arbitrary pixels, except where matching a spec’d demo exactly.

---

## Mobile: primary navigation

For small viewports, primary nav often moves to a **bottom bar** instead of a left rail. Use `nav.css` modifiers:

- `.nav.nav--bottom` — horizontal bar, safe-area padding.
- `.nav.nav--bottom.nav--bottom-dark` — darker bar variant.
- Brand variants (e.g. `.nav--myfs`) apply to rail or bottom nav as needed.

**Reference:** `pages/analytics/agmri-advanced-analytics.html` (bottom nav example), `pages/scout/myfs-scouting.html` (full-height rail with MyFS variant).

---

## Related components and docs

| Resource | Use |
|----------|-----|
| `components/header.css` | Global app header |
| `components/nav.css` | **Web left rail** + mobile bottom nav (`nav.css`) |
| `components/tabs.css` | Tabbed sections inside a page |
| [DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md) | Tokens, typography, component index |
| [empty-states.md](./empty-states.md) | Zero-data views inside primary content |
| [scout-list-table-pills-crop-icons.md](./scout-list-table-pills-crop-icons.md) | Scout-style **list tables** + **category pills** + **crop column SVGs** (single reference) |

---

## Checklist (new primary page)

- [ ] App shell: sidebar + main column; only **one** primary vertical scroll (usually `.app-content`).
- [ ] Global `.header` is not inside the scrollable content unless a product spec explicitly requires it.
- [ ] Left nav stacking order respects `nav.css` guidance.
- [ ] Typography and color use tokens; brand accents follow **Brands** / **Primitives vs brand** in DESIGN-SYSTEM.md.
- [ ] Loading states follow component rules (e.g. table linear bar vs spinner).
- [ ] Accessible landmarks: `header`, `nav` with `aria-label`, main content appropriately scoped where the framework allows.
