/* Scene configuration for ev-charging.html — a top-down EV CHARGING HUB /
   FORECOURT drawn in 720x520 scene coordinates: a grid connection (substation /
   transformer) at one side feeding power into a canopy forecourt of charging
   stalls. The number of stalls scales with the charger count; a share of stalls
   equal to utilisation is occupied by a car plugged into a charger post with an
   animated charging glow. Each operator carries its own signature: the site type
   (highway corridor, urban hub, destination forecourt), the charger power class
   (fast / rapid / ultra-rapid), whether the network is still rolling out
   (growing), and the area / footer caption.
   kind the renderer understands:  highway · urban · destination
   power the renderer understands: fast · rapid · ultra */
var GEO={

  /* ---------- Fastned (Europe) · premium highway ultra-rapid ---------- */
  "fastned":{ kind:'highway', power:'ultra', growing:true,
    area:'EUROPEAN MOTORWAY NETWORK',
    footer:'Premium highway ultra-rapid charging · listed CPO · ramping utilisation' },

  /* ---------- EVgo (North America) · public fast-charging network ---------- */
  "evgo":{ kind:'urban', power:'rapid', growing:true,
    area:'UNITED STATES METROS',
    footer:'Public fast-charging network · listed CPO · utilisation ramp + grid services' },

  /* ---------- Enel X Way (South America) · nascent network ---------- */
  "enelx":{ kind:'destination', power:'rapid', growing:true,
    area:'LATIN AMERICA (ILLUSTRATIVE)',
    footer:'Nascent charging network · early / low utilisation · growth build-out' },

  /* ---------- Evie Networks (Oceania) · highway fast-charging build-out ---------- */
  "evie":{ kind:'highway', power:'rapid', growing:true,
    area:'AUSTRALIAN HIGHWAY CORRIDORS',
    footer:'Highway fast-charging build-out · infra-backed CPO · ramping utilisation' },

  /* ---------- EVIQ (Middle East) · state-backed national roll-out ---------- */
  "eviq":{ kind:'highway', power:'ultra', growing:true,
    area:'SAUDI ARABIA (ILLUSTRATIVE)',
    footer:'State-backed national charging roll-out · early ramp · low cost of capital' },

  /* ---------- Star Charge (China) · vast-scale high-utilisation urban ---------- */
  "starcharge":{ kind:'urban', power:'fast', growing:true,
    area:'CHINA — URBAN CHARGING',
    footer:'Vast-scale urban charging · high utilisation · world\'s largest EV market' }
};
