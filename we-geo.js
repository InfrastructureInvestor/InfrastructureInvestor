/* Scene configuration for waste-to-energy.html — a top-down / elevation view of
   an energy-from-waste (EfW) plant drawn in 720x520 scene coordinates: a large
   industrial building with a tall chimney/stack emitting a slow steam plume, a
   tipping hall where a waste truck tips residual waste into a bunker, a
   furnace/boiler with a warm internal glow (intensity scaling with throughput),
   a turbine hall, and a grid switchyard + export line carrying power out (cyan
   pulses scaling with throughput). +cash orbs rise (gate-fee green from the
   tipping hall, power amber from the turbine); −cash (O&M red) drain. Each
   operator carries its own signature: whether it also exports heat (CHP), how
   contracted the gate fee is, whether the fleet is growing, and the area. */
var GEO={

  /* ---------- UK / European EfW (Europe) · municipal gate fee + power ---------- */
  "ukefw":{ heat:true, contracted:true, growing:false,
    area:'UNITED KINGDOM',
    footer:'Energy-from-waste · long municipal gate-fee contracts + merchant power · CHP-ready' },

  /* ---------- Covanta (North America) · US WtE operator ---------- */
  "covanta":{ heat:false, contracted:true, growing:true,
    area:'UNITED STATES',
    footer:'US waste-to-energy · tip fees + power + metals recovery · large fleet operator' },

  /* ---------- Brazilian / LatAm WtE (South America) · emerging ---------- */
  "brazilwte":{ heat:false, contracted:true, growing:true,
    area:'BRAZIL',
    footer:'Emerging WtE · gate fee + power · early-stage market, EM discount rate' },

  /* ---------- Kwinana / Avertas (Oceania) · Australia first big EfW ---------- */
  "kwinana":{ heat:false, contracted:true, growing:false,
    area:'WESTERN AUSTRALIA',
    footer:"Avertas / Kwinana · Australia's first big EfW · long council contracts + power" },

  /* ---------- Warsan / Dubai (Middle East) · flagship mega-plant ---------- */
  "warsan":{ heat:false, contracted:true, growing:true,
    area:'DUBAI, UAE',
    footer:"Warsan · one of the world's largest EfW plants · flagship gate fee + power" },

  /* ---------- China Everbright-style WtE (China) · vast fleet ---------- */
  "chinawte":{ heat:true, contracted:true, growing:true,
    area:'CHINA',
    footer:'Everbright-style WtE fleet · subsidy + gate fee + power · vast scale' }
};
