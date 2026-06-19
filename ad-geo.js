/* Scene configuration for anaerobic-digestion.html — a top-down / elevation
   anaerobic-digestion plant drawn in 720x520 scene coordinates: one or two
   large digester tanks with green gas-holder domes that gently "breathe" (rise
   and fall), a feedstock reception where a truck or tractor tips organic waste,
   a gas-upgrading skid and a grid-injection point (biomethane to the gas grid,
   amber/green gas pulses) OR a CHP engine, and a digestate store with a tanker
   leaving. Bubbles rise inside the digesters scaling with the load factor.
   Each operator carries its own signature: the feedstock, the output route
   (biomethane-to-grid vs CHP), whether it is growing (a + NEW DIGESTER marker),
   and the area.
   feedstock the renderer understands:  food · crop · farm · sewage
   output:    biomethane (grid injection)  ·  chp (engine) */
var GEO={

  /* ---------- UK biomethane-to-grid (Europe) · GGSS/RHI food & crop AD ---------- */
  "ukbio":{ feedstock:'food', output:'biomethane', growing:true, area:'UNITED KINGDOM',
    footer:'Food & crop anaerobic digestion · biomethane to the gas grid · GGSS/RHI-backed' },

  /* ---------- US RNG (North America) · dairy / landfill renewable natural gas ---------- */
  "usrng":{ feedstock:'farm', output:'biomethane', growing:true, area:'UNITED STATES',
    footer:'Dairy & landfill RNG · pipeline biomethane · LCFS / RIN / 45Z credits' },

  /* ---------- Brazilian agri-biogas (South America) · vinasse / agri feedstock ---------- */
  "brbio":{ feedstock:'crop', output:'biomethane', growing:true, area:'BRAZIL',
    footer:'Sugarcane vinasse & agri biogas · biomethane / CHP · emerging market' },

  /* ---------- Australian food-waste AD (Oceania) · emerging organics-to-biogas ---------- */
  "ausfw":{ feedstock:'food', output:'chp', growing:true, area:'AUSTRALIA',
    footer:'Food-waste anaerobic digestion · biogas to CHP · emerging organics diversion' },

  /* ---------- Gulf food-waste AD (Middle East) · emerging ---------- */
  "gulffw":{ feedstock:'food', output:'chp', growing:true, area:'GULF / GCC',
    footer:'Food-waste anaerobic digestion · biogas to CHP · emerging diversion mandate' },

  /* ---------- Chinese large-scale biogas (China) · agri / food-waste at scale ---------- */
  "cnbio":{ feedstock:'farm', output:'biomethane', growing:true, area:'CHINA',
    footer:'Large-scale agri & food-waste biogas · biomethane / grid gas · subsidy-backed' }
};
