# Cards — design system rules and callouts

Cards are used for **field summaries**, **field detail (information card)**, and **modals** when shown as inline panels. Use the same radius token for cards and modals.

---

## Rules

### Radius and container
- **Cards and modals** use **`var(--radius-xl)`** (15px). Do not use a different radius for cards.
- Card container: `background: var(--color-surface)`, `border: 1px solid var(--color-border)`, `box-shadow: var(--shadow-sm)`.

### Field card structure
- **Title:** Field name; optional star (favorite). Use `--font-weight-semibold` or title type style.
- **Subtitle:** Farm/grower line; optional. Muted text, small size.
- **Meta row:** Use separators (e.g. `|`) between: acreage, flight date (with airplane icon), crop (with icon), GDD. Use design tokens for text color (`--color-text-muted`).
- **Dividers:** Use a single 1px border (`--color-border`) between logical sections.
- **Actions row:** Two actions (e.g. “Field card”, “Virtual scout”) in the bottom row. Each action occupies equal space (`flex: 1`) and content is **centered** within its half. Use **semibold** for action text (`--font-weight-semibold`).

### Tags and pills on cards
- **Outline tag** (e.g. “Stand count 1”, “Weeds 2”): Use `.field-card__tag`. Border `--color-primitive-300`, background surface, text `--color-action`. Radius `--radius-pill`.
- **Status pill** (e.g. “Harvest ready”, “Replant”): Use `.field-card__status-pill`. Danger ramp (100 background, 400 border, 900 text). Radius `--radius-pill`. Include icon + label + value when needed.

### Do not
- Use different border-radius values for cards vs modals; keep both on `--radius-xl`.
- Use regular weight for card bottom actions; use semibold.
- Flush action links to far left/right; keep them distributed with content centered in each half.

---

## Callouts (usage)

| Context | Callout |
|--------|--------|
| **Radius** | Cards and modals: `--radius-xl` (15px). Pills/buttons: `--radius-pill` / `--radius-2xl` (20px). |
| **Actions** | Bottom actions are two equal-width areas; label + icon centered in each. Semibold. |
| **Tags** | Outline tags for report labels; status pills (danger) for Harvest ready / Replant. |
| **Detail card** | Use `.field-card--detail` when the card has a top image, caption, and status pills. |

---

## Related files

- **Component:** `components/field-card.css`
- **Modals:** `components/modal.css` (same radius token)
- **Tokens:** `design-tokens/tokens.css` (`--radius-xl`, `--radius-pill`, `--font-weight-semibold`)
