# MyFS — MiTrials, treatments, and field-research flows

**Status:** Canonical pattern for static HTML demos and design handoff.  
**Product:** MyFS (retailer) — trials, treatments, protocols, plot/observation workflows.

---

## Entry point (not left navigation)

**MiTrials does not appear as its own item in the left sidebar.** Entry **replaces the fourth map layer chip** (the old four-square / grid control) in the top-left layer row — see [`pages/trials/myfs-mitrials.html`](../pages/trials/myfs-mitrials.html). The chip uses the product **inline SVG** (16×16 viewBox, trials / plot grid glyph, `currentColor`). Same **map-view layout** as [`pages/fields/map-view.html`](../pages/fields/map-view.html) (toolbar **Fields** + map + timeline). **Fields** is the active nav item; the chip toggles the MiTrials overlay / panel. (Legacy PNGs `assets/mitrials-map-fab-*.png` remain in repo for reference only.)

---

## Default starter

| Artifact | Role |
|----------|------|
| [`pages/trials/myfs-mitrials.html`](../pages/trials/myfs-mitrials.html) | **Copy this page** for new MiTrials- or treatment-related screens (MyFS + map shell). |
| [`components/field-map-view-shell.css`](../components/field-map-view-shell.css) | **Map layout:** `.page-shell`, `.page-toolbar`, `.map-container`, controls, timeline, layers. Shared with `map-view.html`. |
| [`components/myfs-trials-flow-shell.css`](../components/myfs-trials-flow-shell.css) | **MyFS brand** `:root` overrides (including `--color-brand-500` / `--color-brand-rgb` for map fields) and **`.myfs-trials-flow*`** content blocks (empty state, overlay on map). |

Do **not** duplicate the map layout CSS in page `<style>` — link `field-map-view-shell.css`. Do **not** duplicate MyFS `:root` blocks — use `myfs-trials-flow-shell.css`.

---

## Required CSS order (from `pages/`)

```html
<link rel="stylesheet" href="../design-tokens/tokens.css" />
<link rel="stylesheet" href="../components/typography.css" />
<link rel="stylesheet" href="../components/button.css" />
<link rel="stylesheet" href="../components/filter-pill.css" />
<link rel="stylesheet" href="../components/nav.css" />
<link rel="stylesheet" href="../components/counter-badge.css" />
<link rel="stylesheet" href="../components/header.css" />
<link rel="stylesheet" href="../components/view-switcher.css" />
<!-- MyFS + flow content (load before map shell so map uses MyFS brand tokens) -->
<link rel="stylesheet" href="../components/myfs-trials-flow-shell.css" />
<link rel="stylesheet" href="../components/field-map-view-shell.css" />
```

Add other `components/*.css` files as needed (`input.css`, `modal.css`, `data-table.css`, etc.).

---

## Structure contract

1. **Shell:** `.page-shell` → `.page-shell__side` (`nav.nav--myfs`, **no Mi Trials item**) + `.page-shell__main`.
2. **Header:** `header.header--myfs` with `header__left` / `header__center` / `header__right` (match map-view header shape; MyFS logo + search + user + notifications as needed).
3. **Toolbar:** `.page-toolbar` with title (e.g. **MiTrials**) and `.page-toolbar__controls` (filter pills, view switcher).
4. **Map:** `.map-container` → `.map-canvas` + absolute-positioned controls (see `field-map-view-shell.css`).
5. **Flow UI:** Inside `.map-container`, use **`.myfs-trials-flow.myfs-trials-flow--map-overlay`** for centered cards / empty states above the map. Extend with additional `myfs-trials-flow__*` blocks or replace overlay with side panels / modals as specs evolve.

---

## Voice & copy

MiTrials-specific strings (e.g. **single treatment zone** — weak results, non-blocking) are canonical in [**docs/system-voice.md**](./system-voice.md). Use that file for headings and helper text so demos and product stay aligned.

## Related docs

- [DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md) — tokens, components index.
- [docs/system-voice.md](./system-voice.md) — UI voice, tone, and approved copy blocks.
- [docs/empty-states.md](./empty-states.md) — zero-data patterns.

---

## Changelog

- **2026-04** — Switched canonical layout to map-view shell; MiTrials removed from left nav; added `field-map-view-shell.css`.
