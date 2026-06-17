# Handoff — Infrastructure Reference (theinfrastructureinvestor.com)

A status summary for whoever picks this up next. Last updated: 2026-06-17.

## What this site is

A static reference site for **global infrastructure investing**. Every
sub-sector has an interactive, self-contained HTML page with a live canvas
animation of the asset's physical flows plus an investor financial framing
(revenue → costs → EBITDA → a DCF/LBO style calculator). Audience: people who
**already work in the industry** — it is a reference, not a course (no quizzes).

- **Hosting:** GitHub Pages, custom domain `theinfrastructureinvestor.com` (see `CNAME`).
- **Stack:** plain HTML + one shared `styles.css` + vanilla JS. No build step, no
  framework, no dependencies. Pages are standalone `.html` files at repo root.
- **Repo scope in sessions:** `infrastructureinvestor/infrastructureinvestor`, default branch `main`.

## Conventions (important — keep these consistent)

- **Design system:** light theme, off-white `--bg:#f5f7f6`, green accent
  `--accent:#0c6b4f`, `Source Serif 4` headings + `Inter` body. CSS variables live
  in `styles.css :root`. Per-page styles are scoped under a unique `#id`
  (e.g. `#ix`, `#subsim`) so they never leak.
- **No emoji** in UI/headings — this is a premium publication. Use serif numerals,
  geometric marks, or nothing.
- **Each page includes:** `anim-guard.js` in `<head>` (freezes canvas loops for
  `prefers-reduced-motion`), `styles.css`, meta/OG/favicon block, and
  `<script src="site.js" defer></script>` before `</body>`.
- **`site.js`** = shared nav enhancement + ⌘K command palette. It has an embedded
  `INDEX` array — **add new pages to it** so search finds them.
- **`anim-guard.js`** is a no-op unless the user prefers reduced motion. Canvas
  loops use `requestAnimationFrame`; sliders also call the draw fn directly so the
  UI stays interactive when the loop is frozen.
- **Validation pattern:** there is no browser in the agent environment. Validate JS
  headlessly with Node by mocking `document`/canvas `ctx` (a Proxy returning no-ops;
  `createLinearGradient`/`createRadialGradient` → `{addColorStop}`; `measureText` →
  `{width}`), firing input handlers, and reading element `.textContent`. Then ask
  the user to eyeball the live page via githack (below).
- **Live preview of a branch (no merge):**
  `https://raw.githack.com/InfrastructureInvestor/InfrastructureInvestor/<branch>/<file>.html`
- **Git:** branch from `main`; one PR per piece of work. Commits/PRs end with the
  Claude Code trailer/links. Do not put model identifiers in artifacts.

## Where things stand

### Merged to `main`
- Interactive economic sims embedded across **all six asset classes** (31 sub-sectors).
- **`compare.html`** — sortable cross-asset returns table (base cases pulled from each sim).
- **`site.js` + ⌘K palette + real nav**; **`community.html`** (Giscus comments —
  see "Open items"); **SEO/social pass** (favicon `favicon.svg`, `og-image.svg`,
  per-page meta/OG, `404.html`, `robots.txt`, reduced-motion `anim-guard.js`).
- A first Celtic Interconnector deep-dive was merged onto `subsea-cables.html`
  (PRs #44/#45) — **then deliberately removed** (see below).

### Open PR — the current focus
**PR #46 · branch `claude/interconnector-explainer`** — this is the live work.
- Adds **`electricity-interconnectors.html`**: a new dedicated page (interconnectors
  are a different asset species from data cables, so they got their own page).
- **Reverts `subsea-cables.html`** to the data-cable model only (Celtic moved off it).
- Adds the sub-sector to `energy-utilities.html` (now 9 sub-sectors) and to the
  `site.js` search index.
- **Not yet merged.** Preview:
  `https://raw.githack.com/InfrastructureInvestor/InfrastructureInvestor/claude/interconnector-explainer/electricity-interconnectors.html`

## The page template (the agreed direction)

`electricity-interconnectors.html` is the **prototype template** for "make the asset
real." It is a practitioner reference that fuses the how-it-works explainer with the
real asset and a working model. Sections (with a sticky section rail):

1. **What it is & why it exists** — incl. translating capacity to something tangible
   (700 MW ≈ 450,000 homes). Key-facts strip.
2. **How it works** — the interactive **map** (real Ireland/GB/France coastlines via
   equirectangular projection; HVDC cable; converter stations; flow follows the price
   gap) + a **"Try this"** prompt. The map is well-liked — keep its quality bar.
3. **How it earns** — congestion rent; the two business models (cap-and-floor vs regulated).
4. **What it costs & how it's financed** — a live **EBITDA waterfall** (revenue → each
   operating cost → EBITDA) + the **capital stack** (€1.62bn, €530.7m EU grant, EirGrid
   €800m debt, RTÉ €404m, 65/35 split) + **build timeline**.
5. **Cash flows & returns** — a **working DCF/LBO** driven by the live inputs (price
   gap €/MWh, capacity, availability, build cost, grant, O&M, growth, tax, exit
   multiple, leverage, cost of debt, hold). Anchored to **net build cost** so IRR moves
   with price/MWh. Includes a **cap-and-floor revenue band** (floor/cap inputs) that
   keeps returns credible. Outputs unlevered & levered IRR, MOIC, payback, an equity
   cash-flow chart, and an expandable year-by-year schedule.
6. **What drives the return** — the key sensitivities.

The "Celtic Interconnector · Ireland ⇄ France" header is framed as **"In focus"** to
anticipate a **global library** of example assets (US, Australia, Asia, Africa).

### Base-case sanity (defaults, validated headlessly)
700 MW, €18/MWh gap → ~€105m revenue, ~€75m EBITDA (72% margin), ~5.7% unlevered /
~6.7% levered IRR. Widening the gap lifts returns (collared by the cap); narrowing
floors them; removing the €531m grant drops IRR to ~2.1%.

## Open items / decisions for the user

1. **PR #46 merge** — awaiting the user's live review + merge.
2. **Two questions raised on #46:** (a) should the calculator default to the
   **cap-and-floor merchant** view (current) or Celtic's **regulated allowed-return**
   view? (b) the wide-spread case still shows a racy levered IRR — tighten the default cap?
3. **Community/Giscus** (`community.html`) is built but **not connected**: needs the
   repo public + Discussions enabled + the Giscus app installed, then paste the two IDs
   (`data-repo-id`, `data-category-id`) into the `GISCUS` config in `community.html`.
4. **OG image** is an SVG (no rasteriser available); converting `og-image.svg` to a
   1200×630 PNG would maximise social-card compatibility.

## Suggested next steps

- Merge #46 once the interconnector template is approved.
- Roll the **template** out: a **data-cable worked example** back on `subsea-cables.html`
  (same shape), then other sub-sectors, each with a real "in focus" asset.
- Build out the **global library** (multiple example assets per sub-sector, by region).
- Tier-2 polish still open from earlier: shareable sim state via URL, CSV export,
  a risk–return scatter on `compare.html`, dark mode, a glossary/methodology layer.

## Map of key files

- `index.html` — landing (asset classes, cross-sector tools, compare/community cards).
- `styles.css` — shared design system + nav/palette CSS.
- `site.js` — shared nav + ⌘K palette (embedded search `INDEX`).
- `anim-guard.js` — reduced-motion guard (loaded in every page `<head>`).
- `<asset-class>.html` — 6 category pages (e.g. `energy-utilities.html`).
- `<sub-sector>.html` — sub-sector pages with embedded sims.
- `*-sim.html` — standalone sim source files (also embedded into their sub-sector page).
- `electricity-interconnectors.html` — the new template prototype (on PR #46).
- `compare.html`, `community.html`, `404.html`, `robots.txt`, `favicon.svg`, `og-image.svg`.
