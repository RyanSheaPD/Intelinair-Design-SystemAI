# Imagery issues (Tier 1 / Tier 2) — acceptance criteria

This document defines **acceptance criteria** for design deliverables: timeline indicators, in-map banners, timeline filter toggles, cross-platform coverage, design system alignment, and redline/spec handoff.

**Scope surfaces:** Virtual Scout timeline, Field Card timeline, Compare Mode timeline, Virtual Scout map view, Field Card map view.

**Platforms:** Web, iOS, Android (including asset formats per platform where applicable).

---

## AC-1 — Timeline indicator: cloud icon assets

| ID | Criterion | Status |
|----|-----------|--------|
| AC-1.1 | **Web:** Tier 1 and Tier 2 imagery-issue states use a **cloud icon** delivered as **SVG**, suitable for inline or sprite use at chicklet scale. | ☐ |
| AC-1.2 | **iOS / Android:** The same semantic icons are delivered as **PDF** (iOS) and **PNG** (Android) at resolutions required for **@1x/@2x/@3x** (or project-standard export set). | ☐ |
| AC-1.3 | **Tier 1** uses a **yellow** cloud treatment; **Tier 2** uses a **red** cloud treatment. Colors map to design tokens (or documented hex + dark/light variants) — no ad hoc one-offs. | ☐ |
| AC-1.4 | Icons are **visually distinct** from each other and from non-issue states when rendered at **chicklet size (~20–24px)** (legible silhouette, sufficient contrast on chicklet background). | ☐ |
| AC-1.5 | **Placement** on the chicklet is **specified relative to** existing elements: **provider icon**, **resolution label**, and **date** (order, alignment, spacing). Redlines or a spec sheet defines offsets. | ☐ |
| AC-1.6 | Designs are provided for all three contexts: **Virtual Scout** timeline chicklet, **Field Card** timeline chicklet, and **Compare Mode** timeline chicklet (including any layout deltas between them). | ☐ |

---

## AC-2 — Tier 1 banner (in-map)

| ID | Criterion | Status |
|----|-----------|--------|
| AC-2.1 | Mockup(s) show the banner **positioned at the top of the map window** (Web, iOS, Android) with **exact or min/max dimensions** documented. | ☐ |
| AC-2.2 | **Background color**, **text style** (font family per platform, size, weight, color), and **padding** (internal and from map edge) are specified and token-linked where possible. | ☐ |
| AC-2.3 | The banner **does not overlap** primary **map controls** (e.g. zoom, compass, attribution, overflow menus) per platform patterns. | ☐ |
| AC-2.4 | The banner **does not block interaction** with the map or controls: hit targets remain tappable/clickable; banner placement or dismiss behavior documented if interactive. | ☐ |
| AC-2.5 | Variants exist for **Virtual Scout** and **Field Card** map contexts if layout or chrome differs. | ☐ |

---

## AC-3 — Tier 2 banner (in-map, drastic issues)

| ID | Criterion | Status |
|----|-----------|--------|
| AC-3.1 | Mockup(s) show Tier 2 banner **position consistent with Tier 1** unless a documented exception is required for severity. | ☐ |
| AC-3.2 | Tier 2 is **visually distinct** from Tier 1 (e.g. **different background and/or severity indicator** — color, icon, border — documented in spec). | ☐ |
| AC-3.3 | Same non-overlap and non-blocking rules as **AC-2.3** and **AC-2.4**. | ☐ |
| AC-3.4 | Covers **Virtual Scout** and **Field Card** (and platform variants as needed). | ☐ |

---

## AC-4 — Filter toggle: “Imagery Issues” in timeline filter menu

| ID | Criterion | Status |
|----|-----------|--------|
| AC-4.1 | Mockup shows **placement** of the **“Imagery Issues”** option inside the existing timeline filter menu (**Abacus** icon entry point), including order relative to other filters. | ☐ |
| AC-4.2 | **Toggle control style** (switch, checkbox, or pattern used by sibling filters) matches **existing filter options** in the same menu. | ☐ |
| AC-4.3 | **Label** copy and typography match menu conventions (sentence case, truncation, accessibility label if icon-only elsewhere). | ☐ |
| AC-4.4 | Behavior note: toggling filters the timeline per product rules (on/off states illustrated or described in spec). | ☐ |

---

## AC-5 — Cross-view and cross-platform coverage

| ID | Criterion | Status |
|----|-----------|--------|
| AC-5.1 | Banner and filter designs account for **Virtual Scout** and **Field Card** views (not one generic screen only, unless formally signed off as shared). | ☐ |
| AC-5.2 | Deliverables explicitly cover **Web**, **iOS**, and **Android** **viewports** (breakpoints or device frames named: e.g. desktop web, tablet, phone). | ☐ |
| AC-5.3 | **Compare Mode** timeline receives the same **timeline indicator** treatment as other timelines, or a justified delta is documented. | ☐ |

---

## AC-6 — Design system and specifications

| ID | Criterion | Status |
|----|-----------|--------|
| AC-6.1 | Colors, typography, spacing, radius, and elevation follow **existing design system** conventions (e.g. `design-tokens/tokens.css` / Figma variables — link file + collections in handoff). | ☐ |
| AC-6.2 | **Redlines** or a **specification sheet** is provided for **spacing**, **colors**, and **typography** for: chicklet icon placement, Tier 1 banner, Tier 2 banner, and filter row. | ☐ |
| AC-6.3 | Any new tokens (e.g. Tier 1 yellow, Tier 2 red foreground/background) are proposed as **semantic names** and added to the token source of truth or flagged for token task. | ☐ |

---

## Definition of done (summary)

Design is acceptable when:

1. Cloud icons exist in **SVG (web)** and **PDF/PNG (iOS/Android)** with **yellow vs red** Tier 1 vs Tier 2 semantics, readable at **~20–24px**.
2. Chicklet **layout relative to provider icon, resolution, and date** is specified for **Virtual Scout, Field Card, and Compare Mode** timelines.
3. **Tier 1** and **Tier 2** map banners are mocked with **position, size, color, type, padding**; **no overlap** with map controls and **no blocked map interaction**.
4. **“Imagery Issues”** appears in the **Abacus timeline filter** menu with **consistent toggle and label**.
5. **Web, iOS, and Android** viewports are covered for **Virtual Scout and Field Card**.
6. **Redlines/specs** and **token alignment** are delivered with the file set.

---

## Related

- **Design tokens:** `design-tokens/tokens.css`, Variable Design System (Figma)
- **Timeline / chicklets:** `components/activity-chicklet.css`, Activity timeline sections in `index.html`
- **Figma workflow:** `docs/figma-mcp.md`
