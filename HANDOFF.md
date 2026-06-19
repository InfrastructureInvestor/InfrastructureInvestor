# Handoff — Infrastructure Reference (theinfrastructureinvestor.com)

A status summary for whoever picks this up next. Last updated: 2026-06-19.

> **Latest session (read first):** **All six asset classes are COMPLETE** (every sub-sector is
> a full 3-file reference page — see "Suggested next steps" for the per-class engine map), plus
> two site-wide features were added on top:
> 1. **Prev/next pager** — `site.js` injects a `<nav class="pager">` before the footer on every
>    tour page (asset-class + sub-sector pages, in `INDEX` order); styled in `styles.css`. **(PR #75, merged.)**
> 2. **Contact** — a structured form (topic dropdown / name / reply-to email / message / honeypot,
>    posting to **Web3Forms**). It started as a form injected on every page (**PR #78, merged**), then
>    was **moved to a dedicated `contact.html`** with a "Contact" link in the **top nav** (beside
>    "Asset classes") and in the **footer** (beside "Community"), both injected by `site.js`. The
>    form now renders **only** into `#contact-mount` on `contact.html`. **⚠️ That move is in
>    `claude/contact-page` → PR #79, which is OPEN / not yet merged — merge it first.** The live
>    Web3Forms access key (`9e75f662-…`) is already wired into `site.js` (safe to be public by design).
>
> **Chatbot discussion (no code written):** the user asked about adding an AI chatbot and then said
> to **keep the site as low-cost as possible**. Conclusion documented in "Open items / decisions" #6:
> a chatbot can't be purely static (an Anthropic API key can't ship in client JS — needs a tiny
> serverless proxy, e.g. Cloudflare Workers free tier), and it's the only thing that would add a
> *variable* cost. Recommended NOT building it for now; instead lean on the existing ⌘K search +
> maybe a static FAQ. Current running cost of the whole site is ~**$10–15/yr (domain only)**;
> everything else (GitHub Pages, Web3Forms, Giscus, SVG assets) is free.

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

### Animation recipes (styles in use)
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
  (`drawFlows`, `flag`, `VF` paths).
- **Daytime economics-forward network scene** *(the current default — used for electricity
  transmission & distribution, gas transmission & distribution, water; the **economics overlay**
  was also retrofitted to ports & airports).* A bright, **legible** top-down (or side-elevation)
  scene of the asset, where the **economics are drawn on the canvas, not just the physical flow.**
  Two reusable pieces are shared **verbatim** across `tx-grid.js` / `ed-dist.js` / `gd-dist.js` /
  `gt-gas.js` / `wt-water.js` — copy them and only swap the scene-drawing + readout labels:
  - **RAB building-block engine.** Three sliders = **asset base (RAB, £bn) × allowed return
    (WACC %) × performance/incentive (%)**. `revenue = wacc·RAB + depRate·RAB + opexAllow + perf·RAB`;
    `EBITDA = revenue − opex`; the DCF uses the RAB as the entry/build cost. **Set maintenance capex
    HIGH (≈35–48% of revenue)** — regulated networks are capital-hungry, so the unlevered IRR lands
    near the allowed return instead of being absurdly high. Exit ≈ entry multiple (RAB ≈ EV); use a
    **lower** exit to express terminal-value / decline risk (e.g. gas distribution). Tune per the
    Node harness; margins: transmission ~70%+, distribution/gas ~45–65%, water ~42–59%.
  - **Economics overlay** (`drawLedger` + `drawCoins` + `drawDemand`): a top-left **LIVE ECONOMICS**
    P&L ledger (Revenue + / Operating cost − / EBITDA + margin, with proportional bars); glowing
    **+cash** orbs (green = return on RAB, amber = depreciation) rising from the assets vs **−cash**
    orbs (red = opex) draining, each with a +/− glyph; and a top-right **demand sparkline**
    (NETWORK LOAD / GAS THROUGHPUT / WATER DEMAND). Keep the ledger top-left clear of scene elements.
  - **Lessons from user feedback (important):** (1) keep it **daytime and legible** — a cinematic
    *dusk* version was explicitly rejected as too dark; only go dark if a day/night cycle itself
    carries information. (2) **Represent the project economics** (where +ve cash is made and −ve cash
    is spent), not merely the energy/physical flow. (3) Each region must be a genuinely **different
    ownership/regulatory model** (RAB / US cost-of-service / EM concession / privatised lease /
    state / listed), and the returns ladder must tell that story.

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
- **Water & wastewater** — `water-wastewater.html` + `wt-water.js` + `wt-geo.js`. United Utilities (UK Ofwat
  PR24 RAB), American Water (US IOU rate base + ROE, municipal roll-up), Sabesp (Brazil privatised 2024,
  universalisation), Sydney Water (Australia state-owned corp, IPART), National Water (Saudi state,
  desalination-fed), Beijing Enterprises Water (China listed BOT/concession). **Water-cycle animation**
  (top-down, daytime, economics-forward): source (reservoir / river / sea+desalination per `wt-geo.js`) →
  water treatment (rotating clarifier tanks) → blue clean main → town → brown sewer → wastewater treatment
  → teal treated discharge to river/sea; leakage droplets escape the clean main. Same economics overlay
  (LIVE ECONOMICS ledger, +cash/−cash orbs, WATER DEMAND + leakage). RAB building block; calibrated to
  water's low, capital-heavy returns (UK/Sydney core ~5%, US/EM/state higher) and lower margins (42–59%,
  opex-heavy). Replaced the old water sim page; links the cash-flow model.
- **Gas transmission / Gas distribution** — ⚠️ **OPEN PRs #67 / #68 — NOT yet on `main`.** Files live on
  branches `claude/gas-transmission` (`gt-geo.js`,`gt-gas.js`,`gas-transmission.html`) and
  `claude/gas-distribution` (`gd-geo.js`,`gd-dist.js`,`gas-distribution.html`). Merge those first (don't
  rebuild). Gas T: Snam, Williams/Transco, TGS, APA, Aramco Gas Pipelines, PipeChina — top-down pipeline
  scene (entries → trunk + compressor stations → offtakes). Gas D: Cadent, SoCalGas, Comgás, Australian Gas
  Networks, Town Gas Egypt, ENN — top-down town gas (city gate → mains → governors → boilers; green mains =
  hydrogen-ready). Same RAB engine + economics overlay; gas D uses a lower exit multiple for
  terminal-value/decline risk. Old sims kept (`ngt-sim.html`, `gd-sim.html`).
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
6. **AI chatbot — discussed, decided AGAINST for now (cost).** The user wants the site as
   low-cost as possible. A chatbot needs a serverless proxy to hold the Anthropic API key
   (Cloudflare Workers free tier) and would add a *variable* per-message cost (~1¢ Haiku /
   ~2–3¢ Sonnet / ~4–5¢ Opus, less with prompt caching). If revisited: cheapest viable build is
   **Cloudflare Workers + `claude-haiku-4-5` + prompt caching + per-visitor rate limit + a hard
   monthly spend cap in the Anthropic console**, grounded in the reference pages, widget injected
   via `site.js` like the pager/contact. Free alternatives that cover much of the intent:
   strengthen the existing **⌘K search** and/or add a **static FAQ page**. Cost guidance also
   given: keep hosting on GitHub Pages, use free analytics (Cloudflare Web Analytics / GoatCounter),
   register the domain at an at-cost registrar (Cloudflare Registrar), keep assets as SVG.
7. **Web3Forms first-submission verification** — the live key is wired in, but Web3Forms usually
   emails the owner to confirm on the first real submission; user should send a test message once
   PR #79 is merged/deployed to confirm delivery + Reply-To behaviour.

## Open PRs / recent merges — check before building

Run `git fetch origin main` then `git log --oneline origin/main..<branch>` to see what's stranded.
- **OPEN / not yet merged:** **PR #79** (`claude/contact-page`) — moves the contact form to a
  dedicated `contact.html` + adds the nav/footer "Contact" links. **Merge this first.**
- **Merged to `main` (this session):** prev/next pager (#75), site-wide contact form + Web3Forms
  key (#78). Earlier (all merged): the six asset classes' sub-sector PRs, electricity transmission
  (#63), ports/airports economics overlay (#64), cash-flow tool (#65), electricity distribution
  (#66), gas transmission (#67), gas distribution (#68), water & wastewater (#69), E&U last-mile +
  heat (#71).
- **Branch note:** the designated dev branch was `claude/airport-animation-46ykuy`, but recent
  features each used their own branch (`claude/contact-form`, `claude/contact-page`) per the
  one-PR-per-feature workflow. The repo auto-merges, so push to a fresh feature branch and open a PR.

## Suggested next steps

- **Energy & Utilities is DONE** ✅ — last-mile electricity (`lme-geo.js`/`lme-grid.js`), last-mile
  water (`lmw-geo.js`/`lmw-water.js`) and heat networks (`hn-geo.js`/`hn-heat.js`) are full reference
  pages (PR #71). These are the **non-RAB** template variants: copy `lme-grid.js` for a
  **connections/adoption annuity** (live connections × regulated charge, developer contributions
  offset the build) or `hn-heat.js` for a **heat-spread ESCO** (thermal sold × tariff − source cost,
  revenue floor = take-or-pay/standing). Both reuse the shared economics overlay (`drawLedger`/
  `drawCoins`/`drawDemand`) and the model-agnostic DCF; only the `frame()` economics block, the scene
  renderer and the `ASSETS` content change. Calibration lesson: net entry must be a *fair multiple of
  EBITDA* or MOIC explodes — set contributions/grant so net capex ≈ a sensible EV, and keep EM holds
  short (~15y).
- **Transport is DONE** ✅ — `roads.html` (`rd-geo.js`/`rd-roads.js`, toll-vs-availability engine: traffic
  × toll with a revenue floor = availability payment), `rolling-stock.html` (`rs-geo.js`/`rs-fleet.js`,
  contracted leasing annuity: fleet × lease rate × availability), `ev-charging.html`
  (`ev-geo.js`/`ev-charge.js`, the utilisation flywheel: fixed cost per charger, so low utilisation =
  loss). Bespoke top-down scenes (motorway+toll gantry / depot+running-line+shed / charging forecourt),
- **Digital infrastructure is DONE** ✅ — `fibre-networks.html` (`fb-geo.js`/`fb-fibre.js`, the penetration
  flywheel: pass homes at fixed cost, earn on take-up × ARPU), `mobile-towers.html`
  (`tw-geo.js`/`tw-towers.js`, the colocation/tenancy-ratio annuity: fixed per-tower opex, so added
  tenants are ~100% margin; calibrated to towercos' ~18–24× multiples), `subsea-cables.html`
  (`sc-geo.js`/`sc-cables.js`, capacity-fill with a contracted/IRU floor; an ocean + landing-stations +
  cable scene). Data centres were already a Guide. Bespoke scenes, shared overlay + DCF, old `*-sim.html`
  linked. **Energy & Utilities, Transport and Digital infrastructure are now all complete.**
- **Energy transition is DONE** ✅ — all 7 sub-sectors: `onshore-wind.html` (`ow-*`) and `offshore-wind.html`
  (`of-*`) and `solar.html` (`so-*`) and `nuclear.html` (`nu-*`) use the **generation engine**
  (capacity × 8760 × capacity-factor × price, with a CfD/PPA/RAB contracted floor — the merchant-vs-
  contracted story; copy `hn-heat.js`); `hydrogen.html` (`hy-*`) is the **spread engine** (H2 output ×
  price − power cost; power ≈ 65% of opex, subsidy-dependent, tips to a loss at a low H2 price);
  `battery-storage.html` (`bt-*`) and `pumped-hydro.html` (`ph-*`) use the **storage engine** (MW ×
  revenue-per-MW × capture, with a tolling/capacity floor — merchant batteries higher-return/riskier,
  pumped hydro long-life/contracted/steadier). Bespoke scenes per asset (turbines / PV+sun / reactor
  domes+steam / electrolyser+H2 tanks / battery compound / reservoirs+penstock). Old `*-sim.html` linked.
- **Social infrastructure is DONE** ✅ — all 6 sub-sectors. Five are the **availability-PPP/PFI** model
  (a contracted, indexed government annuity with NO demand risk — revenue = units × charge × availability,
  cut only by performance deductions; copy `ho-hosp.js`, itself a copy of the rolling-stock availability
  engine `rs-fleet.js`): `hospitals.html` (`ho-*`), `schools.html` (`sk-*`, lowest-risk/light-FM),
  `prisons.html` (`pr-*`, heavier operations + the availability-vs-per-diem contrast), `courts.html`
  (`ct-*`), `military.html` (`mi-*`, long-dated defence-accommodation estate). The 6th,
  `student-accommodation.html` (`st-*`, copy of `lme-grid.js`), is the **demand-driven outlier** —
  operational real estate (beds × rent × occupancy, operating leverage, the demand-risk contrast).
  Distinct building scenes per asset, a government/offtaker icon paying the fee. **CALIBRATION LESSON:
  for availability PPPs the net entry (build−grant) must be ≈ 12–14× EBITDA over a realistic 15–20y hold,
  not the full 25–30y concession — a too-cheap entry over a long hold blows MOIC up to 5–8×.**
  **Five asset classes now complete.**
- **Environmental & waste is DONE** ✅ — all 3 sub-sectors, all "processing throughput" assets (a contracted
  **gate fee** per tonne + **output sales**; copy `hn-heat.js`): `waste-to-energy.html` (`we-*`, gate fee +
  merchant power, capital-heavy), `anaerobic-digestion.html` (`ad-*`, biomethane × an incentive-rich price +
  feedstock gate fee − feedstock cost — subsidy-driven), `recycling-infrastructure.html` (`rc-*`, gate fee +
  merchant commodity sales — thin commodity-exposed margins). Distinct scenes (EfW plant + chimney/furnace /
  digester domes + grid injection / MRF sorting line + commodity bales). Old `*-sim.html` linked.
- **🎉 ALL SIX ASSET CLASSES ARE NOW COMPLETE** — every sub-sector across Energy & Utilities, Transport,
  Digital infrastructure, Energy transition, Social infrastructure and Environmental & waste is a full
  3-file reference page (badge "Guide"). Plus the site-wide **prev/next pager** (`site.js` + `styles.css`)
  walks the whole library. Future work is refinement: refresh figures, add new sub-sectors if the taxonomy
  grows, or deepen any single page — the engine families to reuse are catalogued above
  (RAB / connections / ESCO-spread / generation / storage / availability-PPP / penetration / throughput).
- **If a segment is geographic, use the Natural Earth recipe above**; if it's a regulated/contracted
  network, **reuse the daytime economics-forward RAB engine + overlay** (copy `wt-water.js` or
  `ed-dist.js` and swap the scene). Keep one PR per segment; the repo auto-merges within minutes.

## Map of key files

- `index.html` — landing. `styles.css` — design system + nav/palette CSS + `.pager` + `.contact` blocks.
- `site.js` — shared nav + ⌘K palette (embedded search `INDEX`) **+ prev/next pager IIFE + footer
  "Contact" link IIFE + Web3Forms contact-form IIFE (renders only into `#contact-mount` on
  `contact.html`) + the top-nav "Contact" link**. `anim-guard.js` — reduced-motion guard.
- `contact.html` — dedicated contact page (hero + `#contact-mount` where `site.js` mounts the form;
  has a `<noscript>` fallback). In `INDEX` as a `Page`.
- `<asset-class>.html` — 6 category pages (energy-utilities, transport, digital-infrastructure, social-infrastructure, energy-transition, environmental-waste).
- `<sub-sector>.html` — sub-sector pages; `*-sim.html` — standalone sims.
- **Reference pages (the template):** `electricity-interconnectors.html`/`ix-*.js`,
  `bridges.html`/`br-*.js`, `ports.html`/`pt-*.js`, `airports.html`/`ap-*.js`,
  `data-centres.html`/`dc-*.js`, `rail-infrastructure.html`/`rl-rail.js`/`rail-geo.js`,
  and the **regulated-network family** (daytime economics-forward RAB engine + overlay):
  `electricity-transmission.html`/`tx-*.js`, `electricity-distribution.html`/`ed-*.js`,
  `water-wastewater.html`/`wt-*.js`, plus (in open PRs #67/#68) `gas-transmission.html`/`gt-*.js`
  and `gas-distribution.html`/`gd-*.js`.
- **Cross-sector tools:** `cashflow-model.html`/`cf-model.js` — generic asset-aware **cash-flow & DCF
  template** (8 asset presets, every major revenue/cost line on a slider, a full projection grid with
  line items down and years across — sticky first column — plus unlevered/levered IRR, NPV, MOIC,
  payback). Also `wacc-calculator.html`, `macro_dashboard.html`, `riio_ed2_calculator.html`, etc.
  (linked from the homepage "Cross-Sector Tools" grid + `site.js` INDEX, group `Tool`).
- `compare.html`, `community.html`, `404.html`, `robots.txt`, `favicon.svg`, `og-image.svg`, `sitemap.xml`.
