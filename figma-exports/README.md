# Figma / HTML→Design export pages

Static capture targets for **html.to.design**, Figma MCP, or similar tools. They are **not** product surfaces and **not** required for the app shell or area demos under `pages/`.

## Lifecycle

- **Safe to delete or replace** when captures are stale; regenerate from live pages under `pages/<area>/` as needed.
- Paths assume you serve the **repository root** (e.g. `python3 -m http.server`) so `../design-tokens/`, `../pages/css/`, and `../data/` resolve correctly.

## Merges

`.gitattributes` sets `figma-exports/** merge=ours`: when you merge another branch **into** the branch you have checked out, Git resolves conflicts in this folder using **your current branch’s** `figma-exports` copy so bulk HTML export diffs do not block merging real UI work.

If you intentionally want to take the **incoming** branch’s exports instead, resolve those paths manually after merge (or temporarily remove the `merge=ours` rule).

## Related

- Live weather / hover gallery: `pages/weather/weather-hover-states.html`
- Design system overview: `DESIGN-SYSTEM.md` → **System core** and demos tables
