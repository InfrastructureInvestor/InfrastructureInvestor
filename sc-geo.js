/* Scene configuration for subsea-cables.html — a top-down OCEAN scene, drawn in
   720x520 scene coordinates: a blue sea, a landmass and a cable landing station on
   the LEFT edge and another on the RIGHT edge, and a submarine fibre cable laid
   across the seabed between them (with mid-ocean repeaters). Bright data PULSES
   travel along the cable in both directions; the number and brightness scale with
   FILL (the share of lit capacity that is sold). Several faint parallel lines are
   the fibre pairs, of which a fraction = fill light up. Capacity sales rise as
   +cash orbs near the landing stations and along the cable (amber when the revenue
   is contracted / IRU / hyperscaler), and O&M drains as −cash orbs.
   Each system carries its own scene signature: the commercial KIND
   (consortium · hyperscaler · wholesale · em), the two landing-point names, whether
   demand is growing, the route label and the footer caption.
   kinds the renderer understands:  consortium · hyperscaler · wholesale · em  */
var GEO={

  /* ---------- Aqua Comms (Europe) · transatlantic open-access wholesale ---------- */
  "aquacomms":{ kind:'wholesale', leftLand:'IRELAND', rightLand:'NEW YORK', growing:true,
    area:'TRANSATLANTIC · EUROPE ↔ US',
    footer:'Open-access wholesale transatlantic cable · carrier-neutral capacity · IRU + lease' },

  /* ---------- Google subsea (North America) · hyperscaler privately-owned ---------- */
  "google":{ kind:'hyperscaler', leftLand:'VIRGINIA', rightLand:'FRANCE', growing:true,
    area:'TRANSATLANTIC · HYPERSCALER-OWNED',
    footer:'Privately-owned hyperscaler cable · self-supply + contracted · steady, high-floor' },

  /* ---------- EllaLink (South America) · direct EU–LatAm system ---------- */
  "ellalink":{ kind:'consortium', leftLand:'PORTUGAL', rightLand:'BRAZIL', growing:true,
    area:'EUROPE ↔ BRAZIL · SOUTH ATLANTIC',
    footer:'Direct EU–LatAm system · anchor-tenant + wholesale · low-latency express route' },

  /* ---------- Southern Cross (Oceania) · trans-Pacific operator ---------- */
  "southerncross":{ kind:'wholesale', leftLand:'SYDNEY', rightLand:'LOS ANGELES', growing:true,
    area:'TRANS-PACIFIC · AU ↔ NZ ↔ US',
    footer:'Established trans-Pacific operator · Southern Cross NEXT · wholesale capacity' },

  /* ---------- 2Africa / PEACE (Middle East) · consortium mega-cable ---------- */
  "twoafrica":{ kind:'consortium', leftLand:'JEDDAH', rightLand:'MARSEILLE', growing:true,
    area:'MIDDLE EAST · AROUND AFRICA',
    footer:'Consortium mega-cable · multi-landing · ME / Africa capacity · long-haul backbone' },

  /* ---------- Asia Direct Cable / SEA-ME-WE 6 (China) · pan-Asian consortium ---------- */
  "asiacable":{ kind:'consortium', leftLand:'HONG KONG', rightLand:'SINGAPORE', growing:true,
    area:'PAN-ASIA · CHINA LANDINGS',
    footer:'Pan-Asian consortium cable · China + SE-Asia landings · regional backbone' }
};
