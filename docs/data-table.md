# Data Table — design system rules

Data tables display structured field-level data in the main content area. The table system uses a fixed header bar above scrollable flex-based rows.

---

## Structure

```
┌──────────────────────────────────────────────────┐
│  Summary Bar (optional — stats centered)         │
├──────────────────────────────────────────────────┤
│  Table Header Bar (neutral-100 bg, sticky)       │
├──────────────────────────────────────────────────┤
│  Data Row                                        │
├──────────────────────────────────────────────────┤
│  Data Row                                        │
├──────────────────────────────────────────────────┤
│  Data Row                                        │
└──────────────────────────────────────────────────┘
```

---

## Summary Bar (optional — not on every page)

A stats bar that sits above the table header. Shows aggregate metrics for the current data set. **Only include when the page needs to surface key totals or averages that help the user prioritize before scanning the table** (e.g. total fields, average score, count above a threshold). Most pages will not need this — if the data is already obvious from the table itself, omit the summary bar.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Layout          | Flexbox, items centered horizontally       |
| Padding         | `10px 20px`                                |
| Background      | `--color-surface-muted` (neutral-100)      |
| Border          | None — no bottom border between summary and header |
| Stats layout    | Centered with `margin: 0 auto`             |
| Stat dividers   | `1px` wide, `32px` tall, `--color-border`  |

### When to use
- Page has a composite or derived metric not visible in the table (e.g. average stress score across all fields)
- User needs aggregate counts to prioritize (e.g. "38 high stress" out of 611 total)
- Data set is large enough that totals add scanning value

### When to omit
- Table data is self-explanatory without aggregates
- Page has few rows where totals are obvious at a glance
- Metrics would duplicate what the table already shows (e.g. row count is visible)

### Stat item
- **Value:** `18px`, weight `700`, `--color-text`
- **Label:** `12px`, `--color-text-muted`
- Items are stacked vertically (value above label), separated by vertical dividers

### Do not
- Include action buttons (e.g. "Bulk update") in the summary bar — it is for read-only aggregate data only
- Add a border-bottom to the summary bar — it flows directly into the header bar below
- Add a summary bar to every table by default — it is an opt-in element

---

## Table Header Bar

A single fixed row of column labels above the scrollable data rows. This replaces `<thead>` — do not duplicate headers inside the data rows.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Layout          | Flexbox, items center-aligned              |
| Padding         | `10px 20px`                                |
| Background      | `--color-neutral-100` (#f5f5f5)            |
| Border          | `1px solid` bottom (`--color-border`)      |
| Font size       | `12px`                                     |
| Font weight     | `400` (normal), `500` for active sort col  |
| Color           | `--color-text-muted`                       |

### Column cells
- Each column uses `flex: 0 0 <width%>` to set a fixed percentage width
- Last column uses `flex: 1` to fill remaining space
- Columns are separated by `border-right: 1px solid --color-border`
- Last column has no right border
- Padding: `0 12px` per cell
- Text: `white-space: nowrap`

### Sortable columns
- Add a down/up arrow icon (`arrow_downward` / `arrow_upward`) after the label
- Active sort column: `--color-text` color, weight `500`
- Only one column is actively sorted at a time

---

## Data Rows

Flex-based rows that align to the header bar column widths. Each row is a `div.data-row`, not a `<tr>`.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Layout          | Flexbox, items center-aligned              |
| Padding         | `0 20px`                                   |
| Min height      | `50px`                                     |
| Background      | `--color-surface` (white)                  |
| Hover           | `--color-neutral-50` (#fafafa)             |
| Border          | `1px solid` bottom (`--color-border`)      |
| Font size       | `13px`                                     |
| Color           | `--color-text`                             |

### Row cells
- Each cell uses the same `flex` width as the corresponding header column
- Cells are separated by `border-right: 1px solid --color-border` (matching header separators)
- Last cell has no right border
- Padding: `8px 12px` per cell
- Text: `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`

### Cell content patterns
- **Field name:** weight `500`, includes boundary thumbnail image (24×24), favorite star (`app-favorite`), and scout icon link
- **Grower / Farm:** plain text, grower row may include a favorite star
- **Crop:** `--color-brand` text color
- **Numeric values (acres, GDD, precipitation):** plain text, right-aligned or left-aligned depending on context
- **N/A state:** text "N/A", color `text-black-opacity-4` (40% opacity black), no italic — used when data is unavailable
- **Field potential:** icon + label together (e.g. circle icon + "N/A", "Good", "Poor")
- **Growth stage:** may include a visual range indicator component alongside the text label
- **Precipitation columns:** value + unit suffix (e.g. "6.67 in")
- **Score/metric with bar:** inline badge + horizontal bar track (see page-specific component docs)
- **Action link:** right-aligned within the last cell, uses `field-card__action` style

---

## Sticky Columns

Tables with many columns use horizontal scrolling with sticky left columns so the user always sees the field identity while scrolling right.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Sticky columns  | Field, Farm, Grower (first 3 data columns) |
| Header z-index  | `101` for sticky columns, `100` for others |
| Row z-index     | `1` for sticky cells                       |
| Last sticky col | Has a left border to visually separate sticky from scrollable area |
| Table width     | Fixed pixel width (e.g. `2688px`) when columns exceed viewport; enables horizontal scroll |

### Sticky column rules
- Sticky columns are always the leftmost identity columns (field, farm, grower)
- The last sticky column gets a visible left border separator
- Checkbox column (if present) is sticky but hidden by default (`d-none`)
- Sticky columns maintain their position while the rest of the table scrolls horizontally

---

## Sort Behavior

- All columns are sortable by default unless explicitly disabled (e.g. Growth stage, Crops, Variety)
- Non-sortable columns use `mat-sort-header-disabled` and have no sort arrow
- Only one column is actively sorted at a time
- Sort arrow appears on hover (opacity transition) and stays visible when active (opacity 1)
- Active sort column shows the arrow direction: ascending (up) or descending (down)
- Default sort column varies by page (e.g. Area affected descending on the Fields page)

---

## Virtual Scrolling

Large data sets use `cdk-virtual-scroll-viewport` for performant rendering. Only visible rows are rendered in the DOM.

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Component       | `cdk-virtual-scroll-viewport`              |
| Header height   | `40px` (passed as attribute)               |
| Orientation     | Vertical                                   |
| Scroll class    | `table-scroll`, `table-height`             |

---

## Do not

- Duplicate column headers in both a header bar and a `<thead>` — use only one
- Add checkboxes or row selection unless the page has a bulk action feature that requires it
- Wrap the data rows in an unnecessary extra scroll container — the viewport handles scrolling
- Add padding to the content area when displaying a data table — rows should go edge to edge with no gap
- Use different column widths between the header and data rows — they must match exactly
- Show "0" or blank for missing data — always display "N/A" with muted styling

---

## Column width guidelines

Column widths are set as flex percentages and must be identical between the header bar and every data row.

| Column type       | Suggested width |
|-------------------|-----------------|
| Field name        | `18%`           |
| Grower / Farm     | `12–14%`        |
| Numeric (acres)   | `8–10%`         |
| Short text (crop) | `8–10%`         |
| Growth stage      | `10–12%`        |
| Score with bar    | `20–22%`        |
| Date / last col   | `flex: 1` (fill)|

These are guidelines — adjust proportions based on the data set, but always keep header and row widths in sync.

---

## Production Column Catalog

The existing AgMRI Fields table uses a wide, horizontally scrollable layout (2688px+) with sticky left columns. All columns are sortable unless noted.

### Sticky columns (pinned left, z-index 101)

| Column        | Key              | Sortable | Notes                                      |
|---------------|------------------|----------|--------------------------------------------|
| Checkbox      | `checkbox`       | —        | Row selection for bulk actions; hidden by default |
| Field         | `fieldName`      | Yes      | Field name + boundary thumbnail + favorite star + scout link |
| Farm          | `farmName`       | Yes      | Farm name                                  |
| Grower        | `growerName`     | Yes      | Grower name + favorite star; last sticky col (has left border) |

### Scrollable columns

| Column               | Key                | Sortable | Notes                                      |
|----------------------|--------------------|----------|--------------------------------------------|
| Dry yield            | `dryYield`         | Yes      | Displays "N/A" when unavailable            |
| Yield forecast       | `yieldForecast`    | Yes      | Displays "N/A" when unavailable            |
| Emergence            | `emergenceScore`   | Yes      | Emergence score; "N/A" when unavailable    |
| Field potential      | `fieldHealth`      | Yes      | Icon + label (e.g. "N/A", "Good", "Poor") |
| Growth stage         | `growthStage`      | **No**   | Corn stages (VE–R6); not sortable          |
| Planted              | `plantingDate`     | Yes      | Planting date; "N/A" when unavailable      |
| GDD                  | `growingDegreeDays` | Yes     | Growing degree days                        |
| Area affected        | `acresAffected`    | Yes      | Acres affected; common default sort column |
| YTD precip.          | `ytdPrecip`        | Yes      | Year-to-date precipitation (in)            |
| Precip. since planting | `seasonPrecip`   | Yes      | Precipitation since planting; "N/A" pre-plant |
| Last 72h precip.     | `last72Precip`     | Yes      | Rolling 72-hour precipitation (in)         |
| Last 48h precip.     | `last48Precip`     | Yes      | Rolling 48-hour precipitation (in)         |
| Last 24h precip.     | `last24Precip`     | Yes      | Rolling 24-hour precipitation (in)         |
| 12h forecast         | `forecast12H`      | Yes      | 12-hour precipitation forecast             |
| 24h forecast         | `forecast24H`      | Yes      | 24-hour precipitation forecast             |
| 48h forecast         | `forecast48H`      | Yes      | 48-hour precipitation forecast             |
| Area                 | `fieldArea`        | Yes      | Total field acreage                        |
| Crops                | `cropTypes`        | **No**   | Crop type(s); not sortable                 |
| Variety              | `variety`          | **No**   | Seed variety; not sortable                 |
| Last scouting date   | `lastScoutingDate` | Yes      | Most recent scouting report date           |
| Last flight          | `latestFlight`     | Yes      | Most recent imagery flight date            |

### Sticky column behavior
- First 3 data columns (Field, Farm, Grower) are sticky left with `z-index: 101` (header) / `z-index: 1` (rows)
- Grower column has a left border (`mat-mdc-table-sticky-border-elem-left`) to visually separate sticky from scrollable
- Header row uses `z-index: 100` for non-sticky columns, `101` for sticky columns

### Column visibility
- Not all columns are visible by default — pages show a subset based on context
- Each page defines its own column set appropriate to the data being displayed
- The full column catalog above represents the superset; individual pages pick from it

---

## Related files

- **Component CSS:** `components/data-table.css`
- **Tokens:** `design-tokens/tokens.css` (`--color-neutral-100`, `--color-border`, `--color-text-muted`)
