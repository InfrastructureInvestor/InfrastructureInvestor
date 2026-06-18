/* Scene configuration for hydrogen.html — a top-down GREEN-HYDROGEN plant drawn
   in 720x520 scene coordinates: a renewable power source on one side (solar or
   wind) pushes power (cyan pulses) into a row of electrolyser stacks/modules in
   the middle, which split water and fizz with H2 bubbles when running (intensity
   scaling with the load factor). The hydrogen flows on to storage tanks and out
   to an offtake — a pipeline, a tanker truck, a ship or an ammonia plant
   (amber/green H2 pulses). More MW = more electrolyser modules; higher load
   factor = more bubbling and flow. Each project carries its own signature: the
   renewable power source, the offtake route, whether it is growing, and the area.
   power the renderer understands:   solar · wind · hybrid
   offtake the renderer understands: pipeline · ship · truck · ammonia */
var GEO={

  /* ---------- European electrolyser (Europe) · IPCEI / H2Global, dear power ---------- */
  "euroh2":{ power:'wind', offtake:'pipeline', growing:true, area:'NORTH-WEST EUROPE',
    footer:'Green hydrogen · IPCEI / H2Global offtake · expensive power, leans on subsidy' },

  /* ---------- US Gulf Coast green H2 (North America) · IRA 45V PTC ---------- */
  "gulfh2":{ power:'hybrid', offtake:'pipeline', growing:true, area:'US GULF COAST',
    footer:'Green hydrogen · IRA 45V production tax credit · pipeline & industrial offtake' },

  /* ---------- HIF / Atacama (South America) · cheap renewables, e-fuels/ammonia ---------- */
  "atacama":{ power:'hybrid', offtake:'ammonia', growing:true, area:'ATACAMA, CHILE',
    footer:'Green hydrogen → e-fuels / ammonia · cheap Atacama solar & wind · export' },

  /* ---------- Murchison / CWP (Oceania) · giant export-scale green ammonia ---------- */
  "murchison":{ power:'hybrid', offtake:'ship', growing:true, area:'MURCHISON, WEST AUSTRALIA',
    footer:'Export-scale green hydrogen / ammonia · giant solar + wind · ship offtake' },

  /* ---------- NEOM Green Hydrogen (Middle East) · the flagship, ammonia export ---------- */
  "neom":{ power:'hybrid', offtake:'ammonia', growing:true, area:'NEOM, SAUDI ARABIA',
    footer:'Green hydrogen → ammonia · cheap solar + wind · long offtake (the flagship)' },

  /* ---------- Chinese green hydrogen (China) · scale, coupled to renewables ---------- */
  "chinah2":{ power:'solar', offtake:'pipeline', growing:true, area:'INNER MONGOLIA / NW CHINA',
    footer:'Green hydrogen at scale · coupled to renewables & industry · vast build-out' }
};
