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

All toolbar pills use `.filter-pill.filter-pill--neutral` (neutral color ramp). The Advanced filters button uses `.btn.btn--neutral` (neutral-800 filled, white text).

### View Mode Switcher (item 5)

The view mode control is a neutral filter pill with a dropdown menu that lets the user switch between three content views.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Component       | `.filter-pill.filter-pill--neutral`        |
| Icon            | Changes to match active view (see below)   |
| Label           | Displays current view name                 |
| Chevron         | `expand_more` icon, toggles dropdown       |

**Dropdown menu options:**

| Option          | Icon               | Description                            |
|-----------------|--------------------|----------------------------------------|
| **Table view**  | `view_list`        | Data table with sortable columns       |
| **List view**   | `grid_view`        | Card-based thumbnail grid              |
| **Map view**    | `map`              | Geospatial map with field boundaries   |

When the user selects a view, the pill label and icon update to reflect the active view, and the content area switches accordingly. Only one view is visible at a time.

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

The user toggles between these via the view mode dropdown in the page toolbar. Only one view is visible at a time.

#### Table View (default)
- Component: `ds-data-table` inside `ds-data-table-shell`
- Full-width table with fixed `50px` row height
- Sortable column headers, sticky first column
- Columns: checkbox, star, field name, grower, farm, acres, crop, last flight, GDD, disease pills, status pill
- Status pills use semantic filter-pill variants (danger, warning, success)
- Disease pills use `field-card__disease-pill--{disease}` color coding

#### List View (card grid)
- Component: `field-card` in a responsive CSS grid
- Grid: `auto-fill`, `minmax(280px, 1fr)`, `20px` gap
- Each card shows: field image, title + star, subtitle (grower/farm), meta row (acres, flight date, crop, GDD), divider, disease pills or status tags, action links
- Cards use `--radius-xl` (15px), `--shadow-sm`, white background

#### Map View
- Full content area replaced with a geospatial map
- Field boundaries rendered as polygons
- Map controls (zoom, layers) use `.btn--glass` (32x32, frosted glass style)
- No padding on content area when map is active — map fills edge to edge

---

## Reference Implementation

See [`standard-layout.html`](../standard-layout.html) for the canonical HTML implementation of this layout with all components applied.

---

## Mobile Layout (iOS / Android)

On mobile, the standard layout changes significantly. The sidebar nav becomes a bottom tab bar, the header simplifies, and overlay panels (like Advanced filters) become bottom sheets instead of side drawers.

```
┌──────────────────────────────────────────────┐
│  Header (56px) — logo left, avatar right     │
├──────────────────────────────────────────────┤
│  Page Toolbar (title + filter pills)         │
├──────────────────────────────────────────────┤
│  Tab Bar (horizontal scroll)                 │
├──────────────────────────────────────────────┤
│                                              │
│         Main Content Area                    │
│         (cards stack single-column)          │
│                                              │
├──────────────────────────────────────────────┤
│  Bottom Tab Bar (Fields, Scout, Weather, More)│
└──────────────────────────────────────────────┘
```

### Bottom Tab Bar (replaces sidebar nav)

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Position        | Fixed bottom                               |
| Height          | `--nav-mobile-height` (56px)               |
| Layout          | Horizontal, evenly spaced (`space-around`) |
| Items           | 4 items: Fields, Scout, Weather, More      |
| Background      | `--nav-mobile-background` (neutral-100)    |
| Border          | `1px solid` top (`--color-border`)         |
| Active state    | Brand color text + icon (no background)    |
| Safe area       | `padding-bottom: env(safe-area-inset-bottom)` for devices with home indicator |
| Dark variant    | `.nav--bottom-dark` — neutral-500 background, neutral-300 inactive icons |

### Mobile Header

- Same height (`56px`) as desktop but full width (no sidebar offset)
- Logo left, avatar right — search moves to a dedicated search screen or collapses behind a search icon
- No breadcrumbs on mobile

### Mobile Page Toolbar

- Title left, filter pills scroll horizontally
- "Advanced filters" button opens a **bottom sheet** instead of a side drawer
- View mode switcher may be collapsed into a single icon button

### Mobile Content Area

- Cards stack in a **single column** (full width, no grid)
- Table view switches to card list on mobile — no horizontal data table
- Map view remains full-screen
- Content scrolls above the fixed bottom tab bar; bottom padding accounts for tab bar height

### Advanced Filters — Bottom Sheet (mobile)

On mobile, the advanced filter sidebar converts to a bottom sheet that slides up from the bottom of the screen.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Position        | Fixed bottom, full width                   |
| Max height      | `85vh` (leaves status bar visible)         |
| Background      | `--color-surface`                          |
| Border radius   | `--radius-xl` top-left and top-right only  |
| Handle          | `40px × 4px` centered drag handle bar, `--color-neutral-300` |
| Shadow          | `--shadow-lg` upward                       |
| Scrim           | `rgba(0, 0, 0, 0.32)` behind the sheet    |
| Scroll          | Internal scroll on the filter body         |
| Safe area       | `padding-bottom: env(safe-area-inset-bottom)` |

The bottom sheet contains the same filter items as the desktop sidebar (grower, crop type, growth stage, field state, tags, emergence score, field potential, area affected, GDD, planting date) but laid out full-width to take advantage of the wider touch targets on mobile.

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
