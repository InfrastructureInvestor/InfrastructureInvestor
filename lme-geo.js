/* Scene configuration for last-mile-electricity.html, a top-down NEW DEVELOPMENT
   being energised plot by plot, drawn in 720x520 scene coordinates: a point of
   connection (POC) to the host distribution grid, a spine cable into the site,
   street feeders, and a grid of plots (homes, commercial units, an anchor load)
   that light up as they are connected and occupied. Each operator carries its own
   signature: the development type, how fast it is filling (growing vs mature), the
   plot mix, the host network / regulatory frame it sits inside, and the area.
   kind the renderer understands:  housing · mixed · campus · city · rural */
var GEO={

  /* ---------- GTC (Europe) · UK IDNO / independent connections ---------- */
  "gtc":{ kind:'housing', growing:true, dense:false, mix:[0.78,0.16,0.06], anchor:'school',
    area:'GB NEW-BUILD DEVELOPMENTS',
    footer:'Independent DNO (IDNO) · adopts new-build connections · Ofgem RPC-capped DUoS' },

  /* ---------- Florida Power & Light (North America) · IOU new connections ---------- */
  "fpl":{ kind:'city', growing:true, dense:true, mix:[0.62,0.26,0.12], anchor:'mall',
    area:'FLORIDA, USA',
    footer:'Investor-owned utility · CIAC-funded line extensions into rate base · high-growth state' },

  /* ---------- Equatorial Energia (South America) · universalisation ---------- */
  "equatorial":{ kind:'rural', growing:true, dense:false, mix:[0.86,0.08,0.06], anchor:'depot',
    area:'NORTH & NORTH-EAST BRAZIL',
    footer:'Distribution concession · universalisation connections · loss reduction · ANEEL' },

  /* ---------- Altogether Group (Oceania) · private embedded network ---------- */
  "altogether":{ kind:'mixed', growing:true, dense:true, mix:[0.7,0.22,0.08], anchor:'tower',
    area:'AUSTRALIAN PRECINCTS',
    footer:'Private embedded network · master-metered precinct · AER exempt-seller framework' },

  /* ---------- ENOWA / NEOM (Middle East) · greenfield-city last mile ---------- */
  "enowa":{ kind:'city', growing:true, dense:false, mix:[0.5,0.3,0.2], anchor:'plant',
    area:'NEOM, SAUDI ARABIA',
    footer:'Greenfield city utility · 100% renewable last mile · state-backed build-out' },

  /* ---------- State Grid (China) · mass new-build urban connections ---------- */
  "stategrid":{ kind:'city', growing:true, dense:true, mix:[0.66,0.22,0.12], anchor:'tower',
    area:'EASTERN CHINA NEW DISTRICTS',
    footer:'State grid · mass new-district connections · very fast adoption · low cost of capital' }
};
