/* Scene configuration for solar.html — a top-down utility-scale PV solar farm
   drawn in 720x520 scene coordinates: neat rows of tilted PV panel tables fill
   the scene, a sun glyph in the corner whose glow ties to the capacity factor
   casts light rays across the array, and a combiner/substation exports power out
   along an export line (cyan pulses scaling with output). More MWp fills the
   scene with more rows of panels; higher capacity factor brightens the sun and
   the export. Each project carries its own signature: contracted (PPA/CfD) vs
   merchant, the terrain (field or desert), single-axis tracking vs fixed-tilt,
   whether it is growing, the area label and the footer. */
var GEO={

  /* ---------- Iberian solar (Europe) · corporate-PPA + merchant ---------- */
  "iberia":{ contracted:true, terrain:'field', tracking:true, growing:true,
    area:'IBERIA · SPAIN',
    footer:'Utility-scale PV · corporate PPA + merchant · single-axis tracking' },

  /* ---------- US utility-scale solar (North America) · PPA + ITC tax-equity ---------- */
  "ussolar":{ contracted:true, terrain:'field', tracking:true, growing:true,
    area:'TEXAS / CALIFORNIA',
    footer:'Utility-scale PV · long PPA + ITC tax-equity · single-axis tracking' },

  /* ---------- Atacama solar (South America) · world-best irradiance, merchant + PPA ---------- */
  "atacama":{ contracted:false, terrain:'desert', tracking:true, growing:true,
    area:'ATACAMA · CHILE',
    footer:'Utility-scale PV · world-best irradiance · merchant + PPA · EM' },

  /* ---------- Australian solar farm (Oceania) · merchant + curtailment ---------- */
  "ausolar":{ contracted:false, terrain:'field', tracking:true, growing:false,
    area:'AUSTRALIA · NEM',
    footer:'Utility-scale PV · merchant + curtailment risk · single-axis tracking' },

  /* ---------- Al Dhafra / Sweihan (Middle East) · record-low tariff, single long PPA ---------- */
  "aldhafra":{ contracted:true, terrain:'desert', tracking:true, growing:false,
    area:'ABU DHABI · UAE',
    footer:'Utility-scale PV · record-low tariff · single 30yr PPA · low cost of capital' },

  /* ---------- Chinese desert mega-base (China) · vast scale, feed-in / grid-priority ---------- */
  "chinapv":{ contracted:true, terrain:'desert', tracking:false, growing:true,
    area:'GOBI / NW CHINA',
    footer:'Desert PV mega-base · feed-in / grid-priority · vast scale · fixed-tilt' }
};
