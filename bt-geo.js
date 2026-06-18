/* Scene configuration for battery-storage.html — a grid-scale battery energy
   storage system (BESS) drawn in 720x520 scene coordinates: rows of battery
   container units in a fenced compound, a transformer / inverter skid, and a
   grid connection with a pylon and overhead line. Power pulses flow IN from the
   grid (charging, cyan) and OUT to the grid (discharging, amber/green) on a slow
   cycle; intensity and brightness scale with the merchant capture. Each project
   carries its own signature: tolled/contracted vs merchant, storage duration (in
   hours), whether it is growing/expanding, and the area label and footer.
   contracted=true → a tolled / capacity-contracted revenue floor dominates;
   contracted=false → a merchant, market-exposed revenue stack (higher risk). */
var GEO={

  /* ---------- GB grid-scale battery (Europe) · merchant + capacity + FR ---------- */
  "gbbess":{ contracted:false, duration:2, growing:true, area:'GREAT BRITAIN',
    footer:'GB grid-scale battery · merchant + capacity market + frequency response · 2h duration' },

  /* ---------- ERCOT / CAISO battery (North America) · high-volatility merchant ---------- */
  "ercot":{ contracted:false, duration:2, growing:true, area:'ERCOT / CAISO, USA',
    footer:'US merchant battery · arbitrage + ancillary services · high-volatility markets · 2h' },

  /* ---------- Chilean solar-paired battery (South America) · PPA / tolled ---------- */
  "chile":{ contracted:true, duration:4, growing:true, area:'ATACAMA, CHILE',
    footer:'Solar-paired battery · time-shifts solar · PPA / tolled · 4h duration · EM rate' },

  /* ---------- Victorian Big Battery / Hornsdale (Oceania) · system services ---------- */
  "australia":{ contracted:true, duration:2, growing:true, area:'VICTORIA / SA, AUSTRALIA',
    footer:'Grid-stability battery · system services + merchant · grid-services contract · ~2h' },

  /* ---------- Saudi / UAE battery (Middle East) · utility-tolled ---------- */
  "gulf":{ contracted:true, duration:4, growing:true, area:'SAUDI ARABIA / UAE',
    footer:'Utility-tolled battery · long contract · low cost of capital · 4h · illustrative' },

  /* ---------- Chinese grid-scale battery (China) · mandated / capacity-led ---------- */
  "china":{ contracted:true, duration:2, growing:true, area:'CHINA (NATIONAL)',
    footer:'Mandated grid-scale battery · capacity-led build-out · scale · ~2h duration' }
};
