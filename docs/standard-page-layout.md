# Standard Page Layout

Every screen in the AgMRI platform shares a consistent shell composed of three structural elements: the **sidebar nav**, the **top header**, and the **main content area**. This document defines what is always present on every page.

---

## Layout Structure

```
┌──────┬──────────────────────────────────────────┐
│      │  Header (56px)                           │
│      ├──────────────────────────────────────────┤
│ Nav  │                                          │
│ 80px │         Main Content Area                │
│      │                                          │
│      │                                          │
│      │                                          │
│      │                                          │
└──────┴──────────────────────────────────────────┘
```

- **Nav** is flush left, full height (top to bottom), z-index above all content
- **Header** sits to the right of the nav, spanning the remaining width
- **Main Content Area** fills the remaining space below the header

---

## 1. Sidebar Nav (always present)

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Width           | `80px` (`--nav-width`)                     |
| Height          | Full viewport height — top to bottom       |
| Background      | Brand primary (`--nav-background`)         |
| Position        | Fixed left, z-index above content          |
| Padding         | `10px` top/bottom (`--spacing-m`)          |
| Item gap        | `4px` (`--spacing-xs`)                     |

### Nav Items
- Each item: `60px` wide × `56px` tall, `10px` border-radius
- Stacked vertically: icon above label
- **Default state:** white icon + white text on brand background
- **Active state:** white background, brand-colored icon + text (`aria-current="page"`)
- **Hover state:** `rgba(255, 255, 255, 0.12)` overlay
- Icon size: `24px` (`--nav-icon-size`)
- Label font: `10px` (`--nav-font-size`), weight `500`

### Nav Content (three tiers, single flat list — no dividers)
- **Tier 1 (Core — always present):** Home, Growers, Fields, Scout, Weather, Settings
- **Tier 2 (Optional — per subscription):** AI Chat, Groups, Analyze, Disease, Library, Crop Plan, Connect Machine Data
- **Tier 3 (Client-specific):** Custom branded modules, third-party integrations
- If a client doesn't have access to a module, it is **not shown** — no greyed/locked states

### Brand Variants
- **AgMRI:** Default blue (`--color-brand-500: #3c84c7`)
- **MyFS:** Red (`--color-myfs-500: #c41e3a`) via `.nav--myfs`

---

## 2. Top Header (always present)

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Height          | `56px` min-height                          |
| Background      | White (`--color-surface`)                  |
| Border          | `1px solid` bottom (`--color-border`)      |
| Padding         | `5px 20px`                                 |
| Layout          | Flexbox, space-between, center-aligned     |

### Header Zones (left → center → right)

**Left zone** (`header__left`):
- Brand logo image (28px tall) — links to home
- Optional: Back button (secondary style, arrow + "Back" text)
- Optional: Breadcrumb

**Center zone** (`header__center`):
- Search bar: rounded pill shape (`border-radius: 30px`), max-width `360px`
- Search icon positioned inside left of input
- Placeholder text in `--color-text-muted`

**Right zone** (`header__right`):
- User name (12px, weight 500, max-width 120px, truncates)
- Avatar circle (38×38px, brand background, white initials)
- Notifications bell (38×38px, circular, muted background, with optional red count badge)
- Flag/locale dropdown (flag icon + dropdown arrow, underline style)

### Brand Variants
- **MyFS:** Logo and avatar use `--color-myfs-500` via `.header--myfs`

---

## 3. Page Toolbar (Growers, Fields, Scout, Disease)

A horizontal bar immediately below the header. Present on Growers, Fields, Scout, and Disease pages.

```
┌──────┬──────────────────────────────────────────┐
│      │  Header (56px)                           │
│      ├──────────────────────────────────────────┤
│      │  Page Toolbar                            │
│ Nav  ├──────────────────────────────────────────┤
│ 80px │  Tab Bar (20px top padding)              │
│      ├──────────────────────────────────────────┤
│      │  Content Area (table / list / map)       │
│      │                                          │
└──────┴──────────────────────────────────────────┘
```

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Layout          | Flexbox, space-between, center-aligned     |
| Padding         | `10px 20px` (`--spacing-m` / `--spacing-l`)|
| Border          | `1px solid` bottom (`--color-border`)      |
| Background      | White (`--color-surface`)                  |

### Toolbar Layout (left → right)

**Left side:**
- Page title (`18px`, weight `600`, `--color-text`)

**Right side (filter controls), in order:**
1. Settings/filter dropdown pill — icon + label + chevron (e.g. "Affected only")
2. Starred filter pills — star icon (warning-500 color) + label (e.g. "Favorite fields", "Favorite growers")
3. "Advanced filters" button — filled/primary style (`btn` class), icon + label
4. Vertical divider — `1px` wide, `24px` tall, `--color-border`
5. View mode dropdown pill — icon + label + chevron (e.g. "List view") — controls table, list, or map
6. Vertical divider
7. Collapse/expand chevron — `30px` square button, `--radius-sm`, border `--color-border`

All filter pills use the `.filter-pill` component. The Advanced filters button uses `.btn` (primary filled).

---

## 4. Tab Bar (Growers, Fields, Scout, Disease)

A horizontal tab row below the page toolbar. Runs full width, flush left against the sidebar nav and flush right to the edge.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Top padding     | `20px` (`--spacing-l`) — space above tabs  |
| Border          | `1px solid` bottom (`--color-border`)      |
| Background      | White (`--color-surface`)                  |
| Overflow        | Horizontal scroll when tabs exceed width   |

### Tab Structure
- Always starts with an **"All"** tab
- Remaining tabs are page-specific (e.g. Disease has Tar spot, Gray leaf spot, Southern rust, N. corn leaf blight, Frogeye Leaf Spot, Target spot, Septoria brown spot)
- Each tab: icon/badge image above label, with a count badge (colored circle) at top-right of the icon
- Active tab: `--color-primitive-500` underline indicator, `--color-text` label color
- Tab dimensions: `110px` wide, `90px` tall, icon `42×42px`, `4px` gap between icon and label
- Count badge overlays: positioned `top: -4px`, `right: -8px` relative to the icon, `16px` tall, `18px` min-width

### Count Badge Colors per Disease
| Disease             | Badge variant              |
|---------------------|----------------------------|
| All                 | `counter-badge--warning`   |
| Tar spot            | `counter-badge--info`      |
| Gray leaf spot      | `counter-badge--info`      |
| Southern rust       | `counter-badge--danger`    |
| N. corn leaf blight | `counter-badge--info`      |
| Frogeye Leaf Spot   | `counter-badge--info`      |
| Target spot         | `counter-badge--info`      |
| Septoria brown spot | `counter-badge--info`      |

### Optional Right-Aligned Content
- Contextual notes can appear right-aligned within the tab row (e.g. "Weather data collected at noon ET")
- Font: `12px`, `--color-text-muted`, right-padded `20px`

---

## 5. Main Content Area

The remaining viewport space below the tab bar (or below the header on pages without a toolbar/tabs). Content is controlled by the **view mode** selector in the toolbar.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Position        | Right of nav, below tabs/header            |
| Padding         | `20px` (`--spacing-l`)                     |
| Background      | `--color-background` (white)               |
| Overflow        | Scrollable (page content scrolls here)     |

### View Modes (Growers, Fields, Scout, Disease)

| Mode       | Description                                           |
|------------|-------------------------------------------------------|
| **Table**  | Data table (`ds-data-table`) with rows and columns    |
| **List**   | Card-based grid layout (`field-card` components)      |
| **Map**    | Map view with geospatial data                         |

The user toggles between these via the view mode dropdown in the page toolbar.

---

## Reference Implementation

See [`standard-layout.html`](../standard-layout.html) for the canonical HTML implementation of this layout with all components applied.

---

## Mobile Layout (iOS / Android)

On mobile, the sidebar nav moves to a **bottom tab bar**:

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Position        | Fixed bottom                               |
| Height          | `--nav-mobile-height`                      |
| Layout          | Horizontal, evenly spaced                  |
| Items           | 4 items: Fields, Scout, Weather, More      |
| Background      | `--nav-mobile-background` (light or dark)  |
| Border          | `1px solid` top (`--color-border`)         |
| Active state    | Brand color text + icon (no background)    |

---

## Global Tokens Applied to All Screens

| Token                   | Value         | Usage                          |
|-------------------------|---------------|--------------------------------|
| `--font-family`         | Figtree       | All UI text                    |
| `--color-background`    | `#ffffff`     | Page canvas                    |
| `--color-text`          | Neutral 900   | Primary text                   |
| `--color-text-muted`    | Neutral 500   | Secondary/placeholder text     |
| `--color-border`        | Neutral 200   | Dividers, input borders        |
| `--color-surface`       | `#ffffff`     | Card/panel backgrounds         |
| `--color-surface-muted` | Neutral 100   | Muted surface backgrounds      |

---

## Exceptions

The following pages **do not** use this standard layout (no sidebar nav + header shell):
- **Connect Devices / Machine Data**
- **Settings**

These pages have their own standalone layouts.

---

## Rules

1. The nav is **never** inside a card or content panel — it is a top-level page element
2. The header is **never** inside a card — it is a top-level page element
3. The nav **always** runs full height, flush left — it never wraps to content height
4. All three tiers of nav items appear in a **single flat list** with no visual separation
5. Brand tokens (`--color-brand-*`) are used for nav background, avatar, and primary CTAs — **not** for semantic UI elements like links or tags (those use `--color-primitive-*`)
