# Handoff — Infrastructure Reference (theinfrastructureinvestor.com)

A status summary for whoever picks this up next. Last updated: 2026-06-18.

## What this site is

A static reference site for **global infrastructure investing** (it began
UK-focused; it is now global — do **not** reintroduce UK scope framing). Every
sub-sector has an interactive, self-contained HTML page with a live canvas
animation of the asset plus an investor financial framing (revenue → costs →
EBITDA → a DCF/LBO calculator). Audience: people who **already work in the
industry** — a reference, not a course (no quizzes).

- **Hosting:** GitHub Pages, custom domain `theinfrastructureinvestor.com` (`CNAME`).
- **Stack:** plain HTML + one shared `styles.css` + vanilla JS. No build step, no
  framework, no dependencies. Pages are standalone `.html` files at repo root.
- **Repo:** `infrastructureinvestor/infrastructureinvestor`, default branch `main`.

## Workflow + environment gotchas (read this)

- Develop on your assigned feature branch; commit + push there; open **one PR per
  piece of work** via the GitHub **MCP tools** (no `gh` CLI). Don't open a PR
  unless asked — but the user routinely asks at the end of each task.
- **This repo auto-merges PRs within minutes.** So after a PR merges, any further
  commits you push sit on the branch with **no open PR** ("stranded"). After every
  push: `git fetch origin main` then `git log --oneline origin/main..<branch>`; if
  the previous PR already merged, **open a new PR** for the new commits.
- Commit trailer on every commit:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` + a `Claude-Session:` link.
  PR bodies end with the Claude Code line. **Never** put a model id in any artifact.
- No browser in the env. Validate headlessly (below); ask the user to eyeball via
  githack: `https://raw.githack.com/InfrastructureInvestor/InfrastructureInvestor/<branch>/<file>.html`

## Conventions (keep consistent)

- Design system in `styles.css :root`: off-white `--bg:#f5f7f6`, green
  `--accent:#0c6b4f`, `--cost:#bc4733`, `Source Serif 4` headings + `Inter` body.
  Per-page CSS scoped under a unique id. **No emoji** in UI.
- Every page: `anim-guard.js` in `<head>` (freezes canvas for reduced-motion),
  `styles.css`, meta/OG/favicon block, `site.js` before `</body>`.
- Add new pages to the `INDEX` array in `site.js` (powers ⌘K search) and to the
  parent category page's subtype-grid card (badge `Guide` for reference pages).
- Canvas loops use `requestAnimationFrame`; sliders **also call the draw fn
  directly** on `input` so the UI works when the loop is frozen. Gate
  particle/physics updates to real frames with an `_anim` flag (the loop sets
  `_anim=true` around `frame()`; slider-driven redraws leave it false) so dragging
  stays crisp.

## Validation (headless)

1. **Logic / no-throw:** Node harness that mocks `document` + canvas `ctx` (a Proxy
   returning no-op fns; `createLinearGradient`/`createRadialGradient` →
   `{addColorStop}`; `measureText` → `{width}`; `roundRect` present). Build a
   registry of fake elements by id with `value`/`textContent`/`addEventListener`,
   fire the `ixSelect` `change` handler per asset, read `.textContent` of the
   output ids. This prints revenue / margin / IRRs per asset — use it to **tune
   the returns ladder**.
2. **Visual:** `npm install canvas --no-save` (then `rm -rf node_modules` before
   committing — it must NOT be committed), run the engine with a real node-canvas
   bound to `#ixcv`, pump ~200 rAF frames, write a PNG, and Read it to eyeball the
   scene. There are throwaway harnesses in `/tmp` (`test-*.js`, `render-*.js`) you
   can adapt; rebuild them if gone.

## THE TEMPLATE — "practitioner reference" pages (the core pattern)

Prototype: `electricity-interconnectors.html`. Each reference page is **3 files**:

1. **`<segment>.html`** — markup + a big `<style>` block scoped to `#ix`. **Clone an
   existing reference page** (e.g. `data-centres.html` or `ports.html`) and adapt:
   title/meta/OG, breadcrumb + hero (`<section class="hero brhero">`), the `<select
   id="ixSelect">` options, three slider labels, the four readout-card labels, the
   "Model A" card, the standalone-sim link, and the two `<script>` srcs. **Linear
   single-column layout already baked in**: `#ix`, `.ix-bar .wrap`, `.brhero .wrap`
   all `max-width:880px;margin:0 auto`, and `.ix-lede`/`p.body` have **no**
   max-width (text and figures share one 880px column — don't reintroduce text caps).
2. **`<segment>-geo.js`** (or feature-config) — geometry/scene data keyed by asset:
   `var GEO = { key:{...}, ... }`. Loaded as a plain `<script>` (NOT defer) before
   the engine.
3. **`<segment>-<engine>.js`** (defer) — the IIFE: the `ASSETS` data library, the
   canvas renderer, the EBITDA waterfall, the DCF, `render(key)`, and the wiring.

### Element ids the engine reads/writes (shared across all clones)
- Sliders `ixCap`, `ixSpread`, `ixAvail`; labels `ixDriverLab`,`ixAvailLab`;
  value spans `ixCapV`,`ixSpreadV`,`ixAvailV`. Picker `ixSelect`. Canvas `ixcv`.
- Hero: `ixAssetName`,`ixAssetGeo`,`ixCont`,`ixBarName`,`ixLede`,`ixFacts`,`ixTry`.
- Readouts: `ixDir`/`ixDirS`, `ixMW`/`ixMWs`, `ixHrK`/`ixHr`, `ixYr`/`ixYrS`.
- Body: `s1body`,`s2intro`,`s3intro`, `mbTag`/`mbTitle`/`mbBody`,
  `s4intro1`/`wfNote`/`s4intro2`, `ixWaterfall`/`wfMargin`,
  `finStackH`/`finSplitL`/`finSplitR`/`finSplit`/`finList`/`finNote`,`finTimeline`,
  `calcNote`,`s6intro`,`breakers`,`ixSrc`.
- Calculator inputs: `iBuild`/`uBuild`, `iGrant`/`uGrant`, `iCapex`, `iRevG`,
  `iFloor`/`uFloor`, `iCap`/`uCap`, `iTax`, `iExit`, `iLev`, `iRd`, `iAmort`, `iHold`.
- Outputs: `oUIRR`,`oLIRR`,`oMOIC`,`oPB`,`calcSum`,`jchart`,`ptHead`,`ptBody`.
- Sticky rail anchors: `#explore #story #earn #cost #returns #drivers`.

### `ASSETS[key]` shape
`name, geo, continent, cur, geoKey, lede, s1(html), facts[[n,label,detail]…],
s2, driverLab, availLab, hrK, yrS, preset, try, s3, mb{tag,title,body},
s4a, wfNote, s4b, stackH, splitL, splitR, split[[segCls,pct,label]…],
finList[[rowCls,label,amount]…], finNote, timeline[[year,event]…], calcNote,
s6, breakers[…], src, econ{…}, opex{…}, calc{…}, map{labels,footer}`. Plus an
`ORDER` array of keys and a scroll-spy at the bottom.

### Economics conventions
- Three sliders = (capacity/throughput) × (price/driver) × (third lever). Revenue
  is annual; build the gross, then clamp to a `floor`/`cap` band (the `iFloor`/`iCap`
  inputs — used for MRG / regulated tariff / pass-through bands).
- Opex = **four lines** drawn in the EBITDA waterfall, the largest tied to volume.
- DCF: `invest = (iBuild − iGrant) × 1e6` (build cost OR acquisition/lease price,
  per asset — labelled "Build / entry cost"; calc-sum says "Invested capital").
  `computeModel()` grows revenue/EBITDA at `iRevG`, taxes EBIT, subtracts maint
  capex `iCapex`, layers debt (`iLev`,`iRd`,`iAmort`), adds an exit at `iExit ×`
  final EBITDA. Outputs unlevered/levered IRR, MOIC, payback.
- **Calibrate the returns ladder** with the Node harness: set `exit ≈` the implied
  entry multiple (build/EBITDA) and keep growth moderate, or you get absurd
  MOICs/IRRs. Make `floor`/`cap` not bind at base case. Make each region's IRR tell
  a story (core/landlord low; EM/operator higher; "bought at a full price" deals low).

### Animation recipes (two styles in use)
- **Geographic map** (interconnectors, bridges, ports): animated sea background +
  `land` polygons on top + a route/quay + moving units (vehicles/vessels) + a
  toll/value point + coins, with shadows/gradients/vignette and a compass+caption.
  Bridges/ports use real-ish coastlines/harbours; ports add a **ship berth/scheduler**
  (vessels visibly arrive → berth → depart, tied to the throughput slider) and
  gantry cranes with a clear **pick→carry→drop** box cycle.
- **Facility plan** (data centres): a campus plan (substation+grid feed, generators,
  chillers, dark data halls of blinking racks lit by occupancy, meet-me room) PLUS
  the **value-flow diagram** the user asked for: `$` tokens flagged by source —
  green **"$ data"** flowing IN (revenue), red **"$ power"/"$ cooling"** flowing OUT
  (cost) — at rates that scale with the live economics. See `dc-centres.js`
  (`drawFlows`, `flag`, `VF` paths). **This `$`-in/out value-flow is a candidate to
  retrofit onto the ports & bridges maps for consistency.**

### Real map geometry — use Natural Earth, don't hand-author (learned on rail)

For any geographic map, **do not draw country/region outlines by hand** — they look blocky
and the user will (rightly) reject them. The interconnector and rail maps use **real
Natural Earth coastlines**. Repeatable recipe (the env has outbound network):

1. `curl` the GeoJSON from the `nvkelso/natural-earth-vector` repo, e.g.
   `…/geojson/ne_50m_admin_0_countries.geojson` (countries) and
   `…/ne_50m_admin_1_states_provinces.geojson` (states/provinces, for sub-national like Florida).
   50m is the sweet spot; 110m is too coarse, 10m is heavy.
2. In Python: match the feature by **`ADMIN`/`NAME`** (NOT `SOVEREIGNT` — that pulls in
   overseas territories; matching UK on SOVEREIGNT returned **South Georgia**). Pick the
   largest-area feature among matches. Take outer rings; keep the big landmass(es); for
   multi-island countries window-filter by lng/lat (e.g. Japan → Honshū/Shikoku/Kyushu).
3. Simplify each ring with **Douglas–Peucker** to a point budget (~60–340 pts/landmass),
   round coords to 3 dp. Emit `var GEO={ key:{bb, home:[name], polys:[[name,ring],…]} }`.
4. **Framing:** for a small country show the whole thing; for a large one (China, Saudi)
   set `bb` to the relevant region — the rest of the polygon just runs off the canvas edge.
5. Renderer (`rl-rail.js`): `drawSea()` fills the canvas, `drawLand()` draws the polys
   (host country = `home` shaded green) — copied straight from `br-bridges.js`.
   Throwaway extract/gen scripts lived in `/tmp` (`gen.py`); rebuild from this recipe if gone.

## Segments completed (all merged unless noted)

Each is the 3-file template with a **6-example regional library** (one per region —
Europe, North America, South America, Australia/Oceania, Middle East, China — each a
**different business model**), researched figures (operator/regulator/filings; private
assets flagged illustrative), and headless-validated returns.

- **Electricity interconnectors** — `electricity-interconnectors.html` + `ix-interconnectors.js` + `ix-geo.js`. The prototype. (Celtic, Champlain-Hudson, Marinus, GCC, Garabi, Cahora Bassa.)
- **Electricity distribution** — `electricity-distribution.html` + `ed-dist.js` + `ed-geo.js`. UK Power Networks
  (UK RIIO-ED2 RAB), Con Edison (US IOU, state PUC rate base + ROE), Enel São Paulo (Brazil ANEEL price-cap
  concession), Ausgrid (Australia privatised lease, AER, very high rooftop solar), DEWA (Dubai state/listed,
  smart grid), China Southern Power Grid (China state, EV-heavy). **Top-down town-network animation**
  (daytime, economics-forward — same style as the latest transmission/airports): primary substation →
  MV feeders (dashed=underground, solid+poles=overhead per `ed-geo.js`) → distribution transformers → customer
  clusters (homes with rooftop **solar**, commercial, industry, an **EV** hub). Power flows out (cyan) and
  rooftop-solar exports back (amber, bidirectional). Carries the shared economics overlay: **LIVE ECONOMICS**
  P&L ledger + green/amber **+cash** (return on RAB / depreciation) vs red **−cash** (opex) orbs + a NETWORK
  LOAD sparkline. Economics = the RAB building block (RAB × allowed return × performance), same as transmission
  but with distribution-appropriate (lower) margins; calibrated headlessly. Links the RIIO-ED2 calculator + the
  cash-flow model as "See also". Replaced the old stub page.
- **Electricity transmission** — `electricity-transmission.html` + `tx-grid.js` + `tx-geo.js`. National Grid ET
  (UK RAB), ITC (US FERC formula rates), ISA CTEEP (Brazil ANEEL availability/RAP concession), TransGrid
  (Australia, privatised AER revenue-cap), National Grid SA (Saudi state), State Grid (China state UHV).
  **Cinematic dusk grid-landscape animation** (not geographic): a twilight scene — generation cluster
  (spinning turbine,
  solar, cooling-tower steam, coal/gas stacks, hydro dam — mix varies per network from `tx-geo.js`) →
  step-up substation → a corridor of lattice **pylons** carrying catenary HV conductors with animated
  **current pulses** (plus a distinct orange **HVDC** bipole where the network runs DC) → step-down
  substation → a lit **demand city** skyline. The **value-flow** here is the regulated **building block**:
  green coins = *return on RAB*, amber = *depreciation & cost recovery*, at the live split, rising from the
  substations/pylons (the assets) — teaching that revenue is earned on the **asset base, decoupled from the
  power flowing**. Per-network signatures: pylon count, headline **voltage** (e.g. ±1100 kV UHV for China),
  HVDC on/off, generation mix, city. Sliders are **RAB × allowed return (WACC) × performance** (incentive);
  revenue = WACC·RAB + depreciation + opex allowance + incentive. Returns calibrated headlessly to the
  regulated band (UK ~6% asset return; US/ITC higher on its allowed ROE; Brazil where ~10% debt ≈ asset
  return so leverage barely helps; TransGrid muted by its 2015 privatisation premium). Old single-asset sim
  kept and linked as `et-sim.html`.
- **Bridges** — `bridges.html` + `br-bridges.js` + `br-geo.js`. Øresund, Confederation, Rio–Niterói, Sydney Harbour, King Fahd Causeway, HZMB. (`bridge-sim.html` standalone sim kept.)
- **Ports** — `ports.html` + `pt-ports.js` + `pt-geo.js`. Rotterdam, Los Angeles, Cartagena, Melbourne, Jebel Ali, Shanghai/Yangshan. (`ports-sim.html` kept.)
- **Airports** — `airports.html` + `ap-airports.js` + `ap-geo.js`. Heathrow (RAB single-till), Atlanta
  (city-owned residual), Lima (Fraport EM concession), Sydney (privatised, light-handed, infra-fund),
  Dubai/DXB (state hub), Beijing Capital (listed state). **New top-down airfield animation** built for
  this segment: per-airport **characteristic runway configuration** (Heathrow 2 parallels, Atlanta 5,
  Sydney 2+cross, Beijing 3 …) drawn from `ap-geo.js`; a full **aircraft lifecycle scheduler** (approach →
  land → taxi → stand turnaround with jet bridge + service + progress ring → pushback → take-off, tied to
  the passenger slider via stand occupancy); ambient traffic on the inactive runways; landside forecourt,
  access-road cars/buses, multi-storey car park and rail link. The **value-flow `$` retrofit** is realised
  here as a **two-till** flow — <b>green</b> aeronautical coins from the stands/runway, <b>gold</b>
  commercial coins from the terminal/car park, at frequencies that track the live aero/commercial revenue
  mix, with an on-canvas legend showing the split %. The three sliders are passengers × **aero charge/pax**
  × **commercial/pax** (slider 3 is a £/pax value, not a %); revenue = pax·(aero+comm)+anc. Converted from
  the old single-asset sim, kept as `airport-sim.html` ("See also"). Returns ladder calibrated headlessly
  (Sydney lowest ~6.5% = "bought at a full price"; Beijing/Lima highest as listed-state / EM concession).
- **Data centres** — `data-centres.html` + `dc-centres.js` + `dc-geo.js`. Equinix, Northern Virginia, Ascenty, AirTrunk, Khazna, GDS. Includes the **value-flow `$` diagram**. (`data-centre-sim.html` kept.)
- **High-speed rail** — `rail-infrastructure.html` + `rl-rail.js` + `rail-geo.js`. HS2,
  TGV (Paris–Lyon–Marseille), Tōkaidō Shinkansen, Brightline, Haramain, Beijing–Shanghai.
  Map is the bridge-style **land-on-sea geographic map** but each corridor sits inside the
  **real outline of its country** (animated sea, host country shaded green, the rail line +
  moving trains + station stops + a `FARES` gantry). Sliders are riders/day × avg fare ×
  premium-class share; `econ.fixed`/`anc` carry the network-fee / ancillary lines. Outlines
  are **real Natural Earth 50m** coastlines (see the recipe below) — *don't* hand-author map
  polygons again. Converted from the old single-asset sim, which is kept as the standalone
  `rail-sim.html` and linked "See also". **PR #59** (auto-merges).
- **Layout/animation passes:** centred the reference pages on one linear 880px
  column (interconnectors + all the above); cinematic upgrade of the bridge/port maps.
- **Globalisation:** removed UK scope/positioning across the site (homepage now
  "Global Infrastructure"; category heroes + meta; tool framing). **Kept** the named
  regulators/frameworks the UK tools are *about* (Ofgem, Ofwat, RIIO, PR24, NESO,
  gilts, UK ETS), their `.gov.uk`/`.co.uk` source URLs/data feeds, and all assets.

## Open items / decisions for the user

1. **UK-specific tools** (`riio_ed2_calculator.html`, `regulatory_tracker.html`
   "Ofgem & Ofwat", `macro_dashboard.html`, `wacc-calculator.html`) are inherently
   UK in substance even after de-UK'ing the wording. Decide whether to keep them as
   regional tools, generalise them, or retire them now the site is global.
2. **Retrofit the value-flow `$` diagram** (data centres) onto ports/bridges maps?
3. **Community/Giscus** (`community.html`) still not connected: needs repo public +
   Discussions + Giscus app, then paste the two ids into the `GISCUS` config.
4. **OG image** is an SVG; a 1200×630 PNG would maximise social-card compatibility.
5. **`compare.html`** base-case table predates the new reference pages — refresh its
   rows from the bridges/ports/data-centres models when convenient.

## Suggested next steps

- Other transport sub-sectors still on the old sim/tool pattern and ripe for conversion:
  `roads.html`, `rolling-stock.html`, `ev-charging.html` (each has a `*-sim.html`).
- **If the segment is geographic, use the Natural Earth recipe above** for the map —
  reuse `rl-rail.js`'s `drawSea`/`drawLand` and the bridge map renderer wholesale.
- Keep rolling the template across remaining sub-sectors with real "in focus" assets.

## Map of key files

- `index.html` — landing. `styles.css` — design system + nav/palette CSS.
- `site.js` — shared nav + ⌘K palette (embedded search `INDEX`). `anim-guard.js` — reduced-motion guard.
- `<asset-class>.html` — 6 category pages (energy-utilities, transport, digital-infrastructure, social-infrastructure, energy-transition, environmental-waste).
- `<sub-sector>.html` — sub-sector pages; `*-sim.html` — standalone sims.
- **Reference pages (the template):** `electricity-interconnectors.html`/`ix-*.js`,
  `bridges.html`/`br-*.js`, `ports.html`/`pt-*.js`, `airports.html`/`ap-*.js`,
  `data-centres.html`/`dc-*.js`, `rail-infrastructure.html`/`rl-rail.js`/`rail-geo.js`.
- **Cross-sector tools:** `cashflow-model.html`/`cf-model.js` — generic asset-aware **cash-flow & DCF
  template** (8 asset presets, every major revenue/cost line on a slider, a full projection grid with
  line items down and years across — sticky first column — plus unlevered/levered IRR, NPV, MOIC,
  payback). Also `wacc-calculator.html`, `macro_dashboard.html`, `riio_ed2_calculator.html`, etc.
  (linked from the homepage "Cross-Sector Tools" grid + `site.js` INDEX, group `Tool`).
- `compare.html`, `community.html`, `404.html`, `robots.txt`, `favicon.svg`, `og-image.svg`, `sitemap.xml`.
