/* Scene configuration for recycling-infrastructure.html, a materials recovery
   facility (MRF) drawn in 720x520 scene coordinates: a collection truck tips
   mixed dry recycling onto an infeed, conveyor belts carry the material through
   a chain of sorting stages (a trommel screen, optical sorters, a magnet /
   eddy-current separator), and the output end stacks bales of sorted commodities
   in distinct colours (blue paper, clear/white plastic, red/green mixed, silver
   metal). A small residue skip catches the reject stream. Items move along the
   belts with the throughput; +cash orbs rise (gate-fee green at the infeed,
   commodity amber at the bales) and −cash drain (sorting / residue red).
   Each facility carries its own signature: the stream it takes, whether it is
   automated, whether it is growing, and the area / footer.
   stream the renderer understands:  dry-MRF · plastics · mixed */
var GEO={

  /* ---------- UK MRF (Europe) · council-contracted dry MRF ---------- */
  "ukmrf":{ stream:'dry-MRF', automated:true, growing:false,
    area:'UNITED KINGDOM',
    footer:'Council-contracted dry MRF · gate fee + commodity sales · paper / plastic / metal / glass' },

  /* ---------- US single-stream MRF (North America) ---------- */
  "usmrf":{ stream:'mixed', automated:true, growing:true,
    area:'UNITED STATES',
    footer:'Large single-stream MRF · gate fee + commodities · post-National-Sword offtake' },

  /* ---------- Brazilian recycling (South America) · formalising chain ---------- */
  "brmrf":{ stream:'mixed', automated:false, growing:true,
    area:'BRAZIL',
    footer:'Recycling / sorting plant · formalising the value chain · gate fee + commodities' },

  /* ---------- Australian MRF (Oceania) · council-contracted, onshoring ---------- */
  "aumrf":{ stream:'dry-MRF', automated:true, growing:true,
    area:'AUSTRALIA',
    footer:'Council-contracted MRF · onshoring post-China · gate fee + commodity sales' },

  /* ---------- Bee'ah / Sharjah (Middle East) · integrated recovery ---------- */
  "beeah":{ stream:'mixed', automated:true, growing:true,
    area:'SHARJAH, UAE',
    footer:'Integrated material recovery facility · flagship scale · gate fee + commodities' },

  /* ---------- Chinese recycling (China) · domestic build-out ---------- */
  "cnmrf":{ stream:'plastics', automated:true, growing:true,
    area:'CHINA',
    footer:'Domestic recycling build-out · post-import-ban scale · gate fee + commodities' }
};
