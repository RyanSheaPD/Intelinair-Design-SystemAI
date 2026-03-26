# Empty states — design system

Use a single, consistent pattern when a view has no data to show (e.g. no analytics for the selected company, sample, or trial).

---

## Pattern: message-only (Emergence / Advanced analytics)

- **When:** Nothing to show for the current selection; user can change filters, trial, or company.
- **Content:** One **icon** (light grey, thin stroke) + one **line of copy**. No heading, no CTA button.
- **Layout:** Centered in the content area, white/surface background, comfortable padding.

### Usage

1. Link `components/empty-state.css`.
2. Markup:

```html
<div class="empty-state">
  <div class="empty-state__icon" aria-hidden="true">
    <!-- SVG: line chart + magnifying glass, or your illustration -->
  </div>
  <p class="empty-state__message">No analytics data available for this sample and trial.</p>
</div>
```

### Copy examples

- **Emergence (company):** “No analytics data available for selected company.”
- **Advanced analytics (sample/trial):** “No analytics data available for this sample and trial.”
- **Generic:** “No data available for the current selection.”

### Icon

- **Analytics/data:** Line chart + magnifying glass (see `advanced-analytics-empty-state.html`).
- **Color:** `var(--color-neutral-300)`.
- **Stroke:** 1px, round caps/joins. On mobile, if the icon is inside a tappable area, keep graphic within 14×14 and stroke 0.5 per triangle-icon rules where applicable.

### Optional variant: with title

If the section already has a title (e.g. “Emergence”) and you still want a short heading inside the empty state:

```html
<div class="empty-state empty-state--with-title">
  <div class="empty-state__icon" aria-hidden="true">…</div>
  <h2 class="empty-state__title">No data yet</h2>
  <p class="empty-state__message">No analytics data available for this sample and trial.</p>
</div>
```

---

## Related

- **Component:** `components/empty-state.css`
- **Demo:** `advanced-analytics-empty-state.html`
- **Tokens:** `--color-neutral-300`, `--color-text-muted`, `--font-size-14`, `--spacing-2xl`, `--spacing-l`
