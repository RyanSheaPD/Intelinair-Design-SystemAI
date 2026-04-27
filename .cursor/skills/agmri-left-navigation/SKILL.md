---
name: agmri-left-navigation
description: >-
  Applies the canonical AgMRI retailer left sidebar (aside.app-nav + nav.nav with
  SVG icons and labels) to full-page static HTML shells. Use when adding or editing
  any non-overlay page under pages/ (scout, weather, fields, demos, home, etc.),
  when the user mentions left nav, sidebar, app-shell chrome, or aligning with
  fields-map / weather-map-view. Do not use for modal-only HTML, CDK overlay
  fragments, isolated popovers, or embedded partials that intentionally omit chrome.
---

# AgMRI left navigation (full pages)

## When this applies

**Use** for full-viewport **app shells**: `app-shell` layouts with persistent left rail navigation.

**Skip** for: modal dialogs, `cdk-overlay` panes, dropdown-only markup, Figma export slices, email templates, or any document that is not meant to carry the main app chrome.

## Source of truth

1. **Gold copy (DOM):** Copy the first `<aside class="app-nav">` … `</aside>` block from  
   `pages/scout/scout-map-layers-multiselect.html` (starts near the `<body>` / `app-shell` open).  
   That block matches the Fields map / retailer shell icons and order.

2. **Workspace rule (shell + behavior):** Read `.cursor/rules/agmri-retailer-screen-shell.mdc` for header, flex layout, Weather default link, and Scout active-state rules.

3. **Path cheat sheet:** See [reference.md](reference.md) for common `href` rewrites from different `pages/` subtrees.

## After pasting: required edits

1. **Relative `href`s** — Every `<a href="...">` in the nav must resolve from the **file being edited**. Paths that are correct in `pages/scout/` are wrong in `pages/weather/` (and vice versa). Update Home, Growers, Groups, Fields, Scout, Weather, and bottom actions consistently.

2. **Active item** — Exactly one primary item should have `nav__item--active` and `aria-current="page"` (usually the screen you are building). Remove those attributes from all other items.

3. **Weather link** — Default Weather nav target is `pages/weather-map-view.html` (see retailer shell rule). **Exception:** list-only weather screens may keep `aria-current` on Weather and point `href` at that list page instead.

4. **SVG `mask` / `clip-path`** — Never leave `url('/retailer/mapView?...')`-style URLs from snapshots. Use **same-document fragment** IDs (`mask="url(#your-id)"`) and unique `id`s on `<mask>` / `<clipPath>` so icons render offline.

5. **Accessibility** — Keep `aria-hidden="true"` on decorative `span.nav__icon` wrappers; keep `aria-label="Main navigation"` on `<nav class="nav">`.

6. **Styles** — Full shells need at least `design-tokens/tokens.css` and `components/nav.css` (plus `header.css` / `button.css` when the page has the standard header). Add Angular Material CSS only if the page body uses Material markup.

## Consistency check

Before finishing:

- [ ] Nav order matches the gold copy (Home → AI Chat → Growers → Groups → Fields → Scout → Weather → Analyze → Disease → Library → Crop plan → spacer → Connect machine data → Settings).
- [ ] No placeholder `#` on items that have real targets in this repo (unless the product page truly does not exist yet).
- [ ] Active state matches the current route, not the template reference page.

## If the nav drifts

Re-copy `<aside class="app-nav">` from `scout-map-layers-multiselect.html` and re-apply the steps above rather than hand-fixing individual icons.
