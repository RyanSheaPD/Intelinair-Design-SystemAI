# Design Tokens

Design variables and tokens derived from the Figma **Variable Design System (test)** file.

**Figma file:** [Variable Design System (test)](https://www.figma.com/design/0njyFuWX2qzunGeGrKHyHi/Variable-Design-System--test-?m=dev)

- **tokens.css** — CSS custom properties (colors, spacing, radius, typography). Use in your app via `@import` or `<link>`.
- **tokens.json** — Same tokens in JSON for build pipelines or JS.

Tokens were extracted from the Figma API (file + node 32-818). To get **Figma Variables** (named collections) via API, your Figma token needs the `file_variables:read` scope when generating a new token in Figma settings.

## WCAG contrast (legibility)

**Target: WCAG 2.1 Level AA.** We aim for at least **4.5:1** contrast for normal text and **3:1** for large text (18px+ or 14px+ bold). We may break from AA in specific cases (e.g. tertiary UI, decorative text); when we do, document the exception and keep it limited so most of the experience still meets AA.

- **Token pairings:** Use the predefined “text on X” tokens for any text on colored backgrounds so contrast is consistent and auditable:
  - `--color-text-on-brand`, `--color-text-on-success`, `--color-text-on-warning`, `--color-text-on-danger`, `--color-text-on-info`
  - For ramp-500 backgrounds (e.g. active pills): `--color-text-on-primitive-500`, `--color-text-on-success-500`, `--color-text-on-warning-500`, `--color-text-on-danger-500`
- **Body text:** Default text on surfaces uses `--color-text` (neutral-900) on `--color-surface` (neutral-0); this pairing meets AA.
- **Checking new colors:** When adding or changing colors, verify contrast with a checker (e.g. [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)) and update the corresponding “text on X” token in **tokens.css** so components stay accessible.
