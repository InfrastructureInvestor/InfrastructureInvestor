/* Scene configuration for fibre-networks.html, a top-down FIBRE ACCESS NETWORK
   (FTTH/FTTP) drawn in 720x520 scene coordinates: a headend / exchange (OLT) at
   one side feeds a fibre spine down the streets to a grid of homes. The fibre
   PASSES every home (the fixed cost), but only a share equal to PENETRATION is
   actually CONNECTED, a lit window, a short drop fibre and a glow. Light pulses
   flow from the headend along the fibre to the connected homes. Each operator
   carries its own signature: the network model (altnet overbuild, incumbent,
   neutral wholesale, regulated national), whether it is still building / ramping
   (growing), how dense the footprint is, and the area / footer caption.
   kind the renderer understands:  altnet · incumbent · wholesale · national */
var GEO={

  /* ---------- CityFibre (Europe) · wholesale altnet overbuild ---------- */
  "cityfibre":{ kind:'altnet', growing:true, dense:true,
    area:'UNITED KINGDOM, ALTNET FOOTPRINT',
    footer:'Wholesale altnet overbuild · penetration ramp is the whole case' },

  /* ---------- Frontier Communications (North America) · incumbent FTTH ---------- */
  "frontier":{ kind:'incumbent', growing:true, dense:false,
    area:'UNITED STATES, COPPER-TO-FIBRE',
    footer:'Incumbent copper-to-fibre FTTH build-out · penetration on conversion' },

  /* ---------- FiBrasil (South America) · neutral / wholesale fibre, EM ---------- */
  "fibrasil":{ kind:'wholesale', growing:true, dense:false,
    area:'BRAZIL, NEUTRAL FIBRE NETWORK',
    footer:'Neutral wholesale fibre · emerging-market penetration build' },

  /* ---------- Chorus (Oceania) · regulated national wholesale fibre ---------- */
  "chorus":{ kind:'national', growing:false, dense:true,
    area:'NEW ZEALAND, REGULATED UFB',
    footer:'Regulated national wholesale fibre · utility-like, high penetration' },

  /* ---------- e& / Etisalat (Middle East) · incumbent FTTH ---------- */
  "etisalat":{ kind:'incumbent', growing:false, dense:true,
    area:'UNITED ARAB EMIRATES, FTTH',
    footer:'Incumbent FTTH · among the world\'s highest penetration' },

  /* ---------- China Telecom (China) · vast-scale near-universal FTTH ---------- */
  "chinatel":{ kind:'national', growing:false, dense:true,
    area:'CHINA, NEAR-UNIVERSAL FTTH',
    footer:'Vast-scale near-universal FTTH · penetration flywheel fully spun up' }
};
