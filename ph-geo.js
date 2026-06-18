/* Scene configuration for pumped-hydro.html — a pumped-hydro storage scheme
   drawn in 720x520 scene coordinates: an UPPER reservoir high on the canvas, a
   LOWER reservoir below, connected by a penstock / tunnel down a hillside, with a
   powerhouse / turbine hall between them and a grid switchyard with transmission
   lines. Water flows DOWN the penstock when generating (discharging — cyan/white
   flow, amber/green power pulses OUT to the grid) and UP when pumping (charging —
   cyan pulses IN) on a slow, alternating cycle; the upper-reservoir level rises
   and falls slightly with the cycle. Flow intensity scales with the revenue
   capture. Each scheme carries its own signature: contracted (cap-and-floor /
   capacity / regulated) vs more merchant, storage duration (in hours — pumped
   hydro is LONG, 6–24h+), whether it is growing/expanding, and the area label and
   footer. contracted=true → a cap-and-floor / capacity / regulated revenue floor
   dominates; contracted=false → a more merchant, market-exposed revenue stack. */
var GEO={

  /* ---------- Coire Glas / Cruachan (Scotland, UK · Europe) · seeking cap-and-floor ---------- */
  "coireglas":{ contracted:true, duration:20, growing:true, area:'SCOTTISH HIGHLANDS, UK',
    footer:'New-build pumped hydro · seeking a cap-and-floor regime · very deep storage · 60–100yr life' },

  /* ---------- Bath County (Virginia, USA · North America) · merchant + capacity (PJM) ---------- */
  "bathcounty":{ contracted:false, duration:11, growing:false, area:'VIRGINIA, USA (PJM)',
    footer:'World’s largest pumped hydro · merchant arbitrage + PJM capacity · long-life civil asset' },

  /* ---------- Espejo de Tarapacá (Chile · South America) · seawater PSH + solar ---------- */
  "espejo":{ contracted:true, duration:14, growing:true, area:'ATACAMA, CHILE',
    footer:'Seawater pumped hydro paired with solar · time-shifts the sun · contracted · EM rate · illustrative' },

  /* ---------- Snowy 2.0 (Australia · Oceania) · government-backed mega-scheme ---------- */
  "snowy":{ contracted:true, duration:175, growing:true, area:'SNOWY MOUNTAINS, NSW, AUSTRALIA',
    footer:'Flagship mega-scheme · government-backed · deep / long-duration storage · ~175h energy' },

  /* ---------- Hatta (Dubai, UAE · Middle East) · DEWA utility-owned ---------- */
  "hatta":{ contracted:true, duration:6, growing:false, area:'HATTA, DUBAI, UAE',
    footer:'DEWA utility-owned pumped hydro · firms Dubai’s solar · low cost of capital · 6h' },

  /* ---------- Fengning (Hebei, China · China) · state-owned, world’s largest by capacity ---------- */
  "fengning":{ contracted:true, duration:10, growing:true, area:'HEBEI, CHINA',
    footer:'World’s largest by capacity · state-owned · regulated two-part tariff · vast scale · ~10h' }
};
