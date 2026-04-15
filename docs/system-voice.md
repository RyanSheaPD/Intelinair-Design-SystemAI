# System voice (UI copy)

How we write **in-product** strings: headings, helper text, warnings, and empty states. This complements [**Product language**](../pages/system/product-language.html) (what we *call* things) with **how we say them**.

---

## Principles

- **Progression:** Prefer **Detect → Investigate → Act** (surface the signal, help the user understand, then offer a clear next step). Aligned with trial/scouting UX notes in [docs/poma-trials-pilot-ui-requirements.md](./poma-trials-pilot-ui-requirements.md).
- **Tone:** Direct and calm. **Not** clinical, alarmist, or blamey.
- **Honest limitations:** If the user can proceed but **results will be weak or misleading**, say so plainly. Offer the fix (usually an action), then respect their choice if the product allows continuing.
- **Surface:** Sentence case for UI labels and body unless a proper noun requires otherwise.

---

## Non-blocking quality warnings

Use when the app **allows** a configuration but **science, statistics, or comparisons** break down.

| Do | Don’t |
|----|--------|
| State the **risk to outcomes** in plain language | Use panic words (“critical error,” “invalid trial”) unless it’s truly blocking |
| Offer a **single** recommended action (“Add another zone”) | Stack three competing CTAs |
| Acknowledge they **may still continue** if the product allows it | Imply they’re wrong or careless |

---

## MiTrials — treatments / zones (single zone)

**Context:** User has created or selected **exactly one** treatment zone. The product may still let them continue; outcomes are often unreliable.

**Do not use** plural-only framing when `zoneCount === 1` (e.g. “Multiple treatments” + “Add one or more zones…”).

### Canonical copy (recommended)

| Element | Copy |
|---------|------|
| **Heading** | Limited trial results |
| **Body** | With one zone, comparisons and trial metrics are usually unreliable. Add another zone for more trustworthy results—or continue if you need to. |

### Tight layout (one sentence)

**One zone often produces unclear trial results.** Add another zone for stronger comparisons, or continue.

### When there are multiple zones (`zoneCount > 1`)

Keep plural education separate, e.g. **Multiple treatment zones** / **Add one or more zones for this trial** — only when the UI state actually reflects multiple zones or the empty-add flow for several.

### Static demo (`pages/trials/myfs-mitrials.html`)

Choose protocol **Corn — single treatment zone (demo)** in the trial drawer to preview the canonical single-zone heading and body. Empty “no treatments” state uses: **Add treatment zones for this trial so you can compare products reliably.**

---

## Related

- [pages/system/product-language.html](../pages/system/product-language.html) — term definitions and product naming
- [docs/myfs-trials-treatments-flow.md](./myfs-trials-treatments-flow.md) — MiTrials layout and shell
- [docs/empty-states.md](./empty-states.md) — zero-data patterns (icon + one line)
