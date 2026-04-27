# Left nav `href` examples

Assume gold-copy `href` values are written for a file in **`pages/scout/`** (same as `scout-map-layers-multiselect.html`). Retarget from your page’s directory.

Canonical targets (from repo root):

| Destination | Path |
|---------------|------|
| Home | `pages/home.html` |
| Growers | `pages/growers.html` |
| Groups | `pages/groups.html` |
| Fields (map shell) | `pages/scout/fields-map-view.html` |
| Scout (list shell) | `pages/scout/scout-list-view.html` |
| Weather (map shell) | `pages/weather-map-view.html` |

## From `pages/scout/*.html`

Usually unchanged from gold copy:

- `../home.html`, `../growers.html`, `../groups.html`
- `fields-map-view.html`
- `../weather-map-view.html`

Scout row: point `href` at the specific scout page under test, or `scout-list-view.html` for the main list; set `nav__item--active` only on the current file.

## From `pages/weather/*.html`

- Home / Growers / Groups: `../home.html`, `../growers.html`, `../groups.html`
- Fields: `../scout/fields-map-view.html`
- Scout: `../scout/scout-list-view.html`
- Weather (map): `../weather-map-view.html`
- Current list-only weather page: e.g. `agmri-weather.html` with active state when appropriate

## From `pages/fields/*.html`

Typically one level up to `pages/`, then into scout:

- `../scout/fields-map-view.html`, `../scout/scout-list-view.html`, `../weather-map-view.html`, etc.

## From `pages/demos/**` (nested)

Count `../` to reach `pages/`, then append the remainder (e.g. `../../scout/fields-map-view.html` from `pages/demos/some-folder/page.html`).

## Relative URL rule

For any target file `T` and current file `C`, set each nav `href` to the relative path from `C`’s directory to `T` (same as you would for an `<a>` in static HTML). When unsure, derive it instead of guessing.
