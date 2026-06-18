/* Scene configuration for onshore-wind.html — a top-down / landscape view of an
   onshore wind farm drawn in 720x520 scene coordinates: rolling green terrain
   dotted with wind turbines (a mast and three rotating blades each), a
   substation on one side and an export line carrying the power out (cyan pulses
   scale with output). More capacity (MW) = more turbines across the scene;
   higher capacity factor = faster rotor spin and stronger output. Each asset
   carries its own signature: whether it is contracted (a CfD/PPA that removes
   price risk via a revenue floor) or merchant, the terrain, whether it is
   growing (repowering / new phases), the area label and the footer.
   terrain the renderer understands:  plains · hills · desert */
var GEO={

  /* ---------- Markbygden / Nordic onshore (Europe) · corporate-PPA + merchant tail ---------- */
  "markbygden":{ contracted:true, terrain:'hills', growing:true,
    area:'NORTHERN SWEDEN',
    footer:'Nordic onshore wind · corporate PPAs + merchant tail · cold-climate, high-load sites' },

  /* ---------- ERCOT wind (North America) · largely merchant + hedges/PPAs ---------- */
  "ercot":{ contracted:false, terrain:'plains', growing:true,
    area:'TEXAS · ERCOT',
    footer:'Texas onshore wind · merchant ERCOT + hedges/PPAs · price-risk exposed' },

  /* ---------- Casa dos Ventos (South America) · PPA + merchant, EM ---------- */
  "casadosventos":{ contracted:true, terrain:'plains', growing:true,
    area:'NORTHEAST BRAZIL',
    footer:'Brazilian onshore wind · PPA + merchant · emerging-market discount rate' },

  /* ---------- Golden Plains / Macarthur (Oceania) · state-supported + merchant ---------- */
  "goldenplains":{ contracted:true, terrain:'plains', growing:true,
    area:'VICTORIA, AUSTRALIA',
    footer:'Australian onshore wind · state CfD-style support + merchant · grid-firmed' },

  /* ---------- Dumat Al Jandal (Middle East) · single long PPA, low cost of capital ---------- */
  "dumat":{ contracted:true, terrain:'desert', growing:false,
    area:'AL JOUF, SAUDI ARABIA',
    footer:'Saudi onshore wind · single 20-year sovereign PPA · very low cost of capital' },

  /* ---------- Longyuan onshore (China) · vast scale, regulated/feed-in + grid priority ---------- */
  "longyuan":{ contracted:true, terrain:'plains', growing:true,
    area:'NORTHERN CHINA',
    footer:'Chinese onshore wind · regulated feed-in / grid-priority · vast scale' }
};
