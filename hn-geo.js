/* Scene configuration for heat-networks.html — a top-down district thermal
   network drawn in 720x520 scene coordinates: a central energy centre (the heat
   or cooling source) feeds a flow main (warm, orange) out to connected buildings
   and a return main (cool, blue) back — the classic flow/return loop. Buildings
   glow warm with the load factor (how much thermal energy is actually being
   delivered). Each operator carries its own signature: heating vs cooling, the
   energy source, whether it is growing, the building mix, and the area.
   source the renderer understands:  chp · waste · biomass · heatpump · chiller · geo */
var GEO={

  /* ---------- Copenhagen (Europe) · municipal district heating ---------- */
  "copen":{ service:'heat', source:'waste', growing:false, dense:true, mix:[0.6,0.28,0.12], anchor:'tower',
    area:'COPENHAGEN',
    footer:'Municipal district heating · CHP + waste-heat + waste-to-energy · near-universal' },

  /* ---------- Vicinity Energy (North America) · district steam, electrifying ---------- */
  "vicinity":{ service:'heat', source:'chp', growing:true, dense:true, mix:[0.5,0.34,0.16], anchor:'hospital',
    area:'US CITIES (e.g. BOSTON)',
    footer:'District steam & hot water · electrifying ("eSteam") · infrastructure-fund owned' },

  /* ---------- Veolia (South America) · Latin American district energy ---------- */
  "veolia":{ service:'cooling', source:'chiller', growing:true, dense:false, mix:[0.45,0.4,0.15], anchor:'mall',
    area:'LATIN AMERICA',
    footer:'District cooling / energy concession · operator-owned · nascent but growing' },

  /* ---------- Sydney precinct (Oceania) · precinct trigeneration / cooling ---------- */
  "sydney":{ service:'cooling', source:'chiller', growing:true, dense:true, mix:[0.55,0.32,0.13], anchor:'tower',
    area:'SYDNEY PRECINCTS',
    footer:'Precinct district cooling / trigeneration · private · long building contracts' },

  /* ---------- Tabreed (Middle East) · district cooling ---------- */
  "tabreed":{ service:'cooling', source:'chiller', growing:true, dense:false, mix:[0.4,0.42,0.18], anchor:'mall',
    area:'UAE & GCC',
    footer:'District cooling · take-or-pay capacity charges · listed (Mubadala / Engie)' },

  /* ---------- Municipal district heating (China) · northern-city CHP ---------- */
  "chinadh":{ service:'heat', source:'chp', growing:true, dense:true, mix:[0.66,0.22,0.12], anchor:'tower',
    area:'NORTHERN CHINA CITIES',
    footer:'Municipal / CHP district heating · coal-to-gas + waste heat · vast scale' }
};
