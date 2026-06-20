/* Scene configuration for last-mile-water.html, a top-down NEW DEVELOPMENT
   being connected to water and wastewater plot by plot, drawn in 720x520 scene
   coordinates: a connection to the incumbent water main, a clean-water spine main
   into the site (blue), street mains, a grid of plots that connect as they fill,
   and a wastewater return to the sewer (brown). Each operator carries its own
   signature: the development type, whether it also does wastewater, how fast it
   is filling, the plot mix, the host network / regulatory frame, and the area.
   kind the renderer understands:  housing · mixed · campus · city · rural */
var GEO={

  /* ---------- Independent Water Networks (Europe) · UK NAV ---------- */
  "iwnl":{ kind:'housing', growing:true, dense:false, waste:true, mix:[0.8,0.14,0.06], anchor:'school',
    area:'GB NEW-BUILD DEVELOPMENTS',
    footer:'New Appointment & Variation (NAV) · adopts new-build water & wastewater · Ofwat RPC-capped' },

  /* ---------- Global Water Resources (North America) · Arizona growth utility ---------- */
  "gwr":{ kind:'city', growing:true, dense:false, waste:true, mix:[0.7,0.2,0.1], anchor:'mall',
    area:'PHOENIX METRO, ARIZONA',
    footer:'Investor-owned water utility · growth-by-connections · Total Water Management · ACC' },

  /* ---------- Aegea Saneamento (South America) · universalisation ---------- */
  "aegea":{ kind:'rural', growing:true, dense:true, waste:true, mix:[0.84,0.1,0.06], anchor:'depot',
    area:'MULTIPLE STATES, BRAZIL',
    footer:'Private sanitation concession · universalisation connections · new sanitation framework' },

  /* ---------- Flow Systems (Oceania) · embedded recycled-water precinct ---------- */
  "flow":{ kind:'mixed', growing:true, dense:true, waste:true, mix:[0.72,0.2,0.08], anchor:'tower',
    area:'AUSTRALIAN PRECINCTS',
    footer:'Private precinct utility · potable + recycled water + sewer · IPART / state framework' },

  /* ---------- ENOWA / NEOM (Middle East) · greenfield-city water ---------- */
  "enowawater":{ kind:'city', growing:true, dense:false, waste:true, mix:[0.5,0.3,0.2], anchor:'plant',
    area:'NEOM, SAUDI ARABIA',
    footer:'Greenfield city utility · desalinated + recycled water last mile · state-backed' },

  /* ---------- China Water Affairs (China) · connections-led BOT ---------- */
  "cwa":{ kind:'city', growing:true, dense:true, waste:true, mix:[0.68,0.22,0.1], anchor:'tower',
    area:'CHINESE CITIES',
    footer:'Listed water group · BOT / concession · connections + volume growth' }
};
