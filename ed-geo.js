/* Scene configuration for electricity-distribution.html, a top-down town
   distribution network drawn in 720x520 scene coordinates: a primary substation
   fed from the grid, medium-voltage feeders branching out to distribution
   transformers, then low-voltage spurs to clusters of customers (homes, shops,
   an EV hub and industry). Each network carries its real signature: voltage
   levels, whether it is mostly underground or overhead, how much rooftop solar
   sits behind the meter, how many EV chargers, and the area it serves. */
var GEO={

  /* ---------- UK Power Networks (Europe) · privatised RIIO-ED2 DNO ---------- */
  "ukpn":{
    volt:'132 / 33 / 11 kV', gridkv:'132 kV', underground:true, solar:0.28, ev:4,
    area:'LONDON & SOUTH-EAST',
    footer:'Privatised DNO · RIIO-ED2 RAB · mostly underground urban network' },

  /* ---------- Con Edison (North America) · investor-owned utility, NYC ---------- */
  "coned":{
    volt:'13.8 / 4.16 kV', gridkv:'138 kV', underground:true, solar:0.12, ev:3,
    area:'NEW YORK CITY',
    footer:'Investor-owned utility · state PUC rate base + ROE · dense underground network' },

  /* ---------- Enel Distribución (South America) · privatised concession, São Paulo ---------- */
  "enelbr":{
    volt:'13.8 kV', gridkv:'88 kV', underground:false, solar:0.18, ev:2,
    area:'SÃO PAULO',
    footer:'Privatised concession · ANEEL price cap · overhead urban network · loss reduction' },

  /* ---------- Ausgrid (Oceania) · privatised lease, very high rooftop solar ---------- */
  "ausgrid":{
    volt:'132 / 33 / 11 kV', gridkv:'132 kV', underground:false, solar:0.55, ev:3,
    area:'SYDNEY',
    footer:'Privatised 99-yr lease · AER revenue cap · very high rooftop solar' },

  /* ---------- DEWA (Middle East) · state-owned (listed), smart grid, Dubai ---------- */
  "dewa":{
    volt:'132 / 11 kV', gridkv:'400 kV', underground:true, solar:0.30, ev:5,
    area:'DUBAI',
    footer:'State-owned (listed) · smart grid · utility + rooftop solar · EV-ready' },

  /* ---------- China Southern Power Grid (China) · state-owned, EV-heavy ---------- */
  "csg":{
    volt:'110 / 10 kV', gridkv:'220 kV', underground:true, solar:0.20, ev:6,
    area:'SHENZHEN · GUANGDONG',
    footer:'State-owned · rapid urbanisation · world-leading EV adoption' }
};
