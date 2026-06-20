/* Scene configuration for mobile-towers.html, a landscape dotted with MOBILE
   TOWERS (masts), drawn in 720x520 scene coordinates: tapered lattice / monopole
   masts on small platforms, each carrying one or more sets of operator antenna
   panels (the tenants). More towers = more masts across the scene; a higher
   tenancy ratio = more antenna sets per mast, the colocation story made visible.
   Each towerco carries its own signature: the kind of business, whether it is
   growing (build-to-suit / lease-up), how dense the footprint is, and the area.
   kind the renderer understands:  independent · captive · em · state */
var GEO={

  /* ---------- Cellnex (Europe) · largest independent towerco ---------- */
  "cellnex":{ kind:'independent', growing:true, dense:false,
    area:'WESTERN EUROPE',
    footer:'Independent towerco · lease-up + build-to-suit · CPI-escalated tenancies' },

  /* ---------- American Tower (North America) · benchmark independent REIT ---------- */
  "amt":{ kind:'independent', growing:true, dense:true,
    area:'UNITED STATES',
    footer:'Independent towerco (REIT) · high tenancy ratio · long master leases' },

  /* ---------- Highline do Brasil (South America) · EM independent ---------- */
  "highline":{ kind:'em', growing:true, dense:false,
    area:'BRAZIL',
    footer:'EM independent towerco · build-to-suit + colocation · DigitalBridge-backed' },

  /* ---------- Amplitel (Oceania) · Telstra InfraCo carve-out ---------- */
  "amplitel":{ kind:'captive', growing:false, dense:false,
    area:'AUSTRALIA',
    footer:'Carve-out towerco · Telstra anchor tenant · long master lease agreement' },

  /* ---------- TASC Towers (Middle East) · regional build-out ---------- */
  "tasc":{ kind:'em', growing:true, dense:false,
    area:'MENA REGION',
    footer:'Regional towerco · build-out phase · lower tenancy · lease-up upside' },

  /* ---------- China Tower (China) · world's largest, state-owned ---------- */
  "chinatower":{ kind:'state', growing:true, dense:true,
    area:'CHINA',
    footer:'State-owned towerco · vast scale · thin per-tower economics · three-carrier anchors' }
};
