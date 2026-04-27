# Data tables — default layout for tabular information

**Canonical reference:** Use this page plus [`components/data-table.css`](../components/data-table.css) whenever you build or refresh a **dense, scrollable list table** (weather lists, field/scout grids, CSV-style grids, retailer `mat-table` parity). New mocks and refactors should match the structure below unless the UI is intentionally non-tabular.

This design system treats those tables as one pattern. **Default:** use `data-table.css` with the structure below so static HTML stays aligned with Angular Material MDC tables in the app.

## When to use

- Grower/field/scout/weather **list views** and any **data grid** where rows are uniform height, text truncates with ellipsis, and the table scrolls inside the main pane.
- Prefer this over ad hoc `<table>` styles or bespoke grid layouts unless the UI is explicitly not tabular (e.g. card-only list).

## Canonical structure

```html
<section class="ds-data-table-region" aria-labelledby="…">
  <h2 id="…" class="visually-hidden">…</h2>
  <div class="ds-data-table-shell">
    <!-- optional: linear loading; link loading.css -->
    <!-- <div class="loading-linear loading-linear--indeterminate loading-linear--table" aria-hidden="true"></div> -->
    <div class="ds-data-table-shell__scroll">
      <table class="ds-data-table ds-data-table--fixed-height">
        <thead>
          <tr>
            <th class="ds-data-table__cell--sticky" scope="col">
              <div class="ds-data-table__cell-inner">
                <span class="ds-data-table__text">Column A</span>
              </div>
            </th>
            <th scope="col">
              <div class="ds-data-table__cell-inner">
                <span class="ds-data-table__text">Column B</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="ds-data-table__row--clickable">
            <td class="ds-data-table__cell--sticky">
              <div class="ds-data-table__cell-inner">
                <span class="ds-data-table__text">Primary label</span>
              </div>
            </td>
            <td>
              <div class="ds-data-table__cell-inner">
                <span class="ds-data-table__text">Supporting text</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
```

- **`.ds-data-table-region`** — Optional but recommended when the table sits in a flex column (main content). It sets `min-height: 0` so the inner scroll area receives a real height instead of growing past the viewport.
- **`.ds-data-table-shell` / `__scroll`** — Border, radius, and **only the table body scrolls**; headers stay at the top of the scroll container (use sticky column classes where needed).
- **`.ds-data-table--fixed-height`** — **50px** row band, single-line copy with ellipsis (matches `mat-mdc-row` behavior).
- **Cell content** — Always wrap display text in `__cell-inner` > `__text` so truncation and icons/chips align consistently.

## Styling tokens

Defined on `:root` in `data-table.css` (e.g. `--ds-table-row-min-height`, `--ds-table-border-row`). Override at page scope only when the product spec requires it (e.g. edge-to-edge list: `border: none; border-radius: 0` on the shell).

## Angular parity

In production, the same visual language is implemented with `mat-table` / MDC classes under `.retailer-table` (and weather-specific width rules). For Figma or static capture parity, see **`test/index.html`** (table-only MDC snapshot). For **maintainable** hand-authored examples using design-system classes, see **`pages/weather/agmri-weather.html`** and **`pages/scout/scout-list-view.html`** (multi-column scout list with pills, sort-header mock markup, and `ds-data-table-shell`).

## Related docs

- [Scout list: tables, pills, crop icons](./scout-list-table-pills-crop-icons.md) — pinned farm grid, scouting category pills, crop SVGs, tokens, and file index (reference page for AgMRI scout-style lists).
- [Standard page layout](./standard-page-layout.md) — table view in the full app shell.
- [Primary pages layout](./primary-pages-layout.md) — where tables sit in primary content.
- [Empty states](./empty-states.md) — when the table has no rows.
