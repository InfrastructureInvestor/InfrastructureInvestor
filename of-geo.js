/* Scene configuration for offshore-wind.html, a top-down / sea-level view of an
   offshore wind farm drawn in 720x520 scene coordinates: a blue ocean with a
   hint of coastline on one edge, an array of offshore wind turbines standing in
   the sea (mast + three rotating blades + a small foundation + reflection), an
   offshore substation (a platform) collecting the array, and a subsea export
   cable running to a shore connection (cyan power pulses scale with output).
   More capacity (MW) = more turbines across the scene; higher capacity factor =
   faster rotor spin and stronger output pulses. Each asset carries its own
   signature: contracted (CfD / long PPA) or merchant-exposed, fixed-bottom or
   floating foundations, whether it is growing (a next phase being built out),
   the sea area and the footer caption.
   foundation the renderer understands:  fixed · floating  */
var GEO={

  /* ---------- Dogger Bank / Hornsea (UK, Europe) · CfD, world's largest ---------- */
  "dogger":{ contracted:true, foundation:'fixed', growing:true,
    area:'NORTH SEA (UK)',
    footer:'Dogger Bank / Hornsea · CfD · project-financed · the world’s largest offshore wind' },

  /* ---------- Vineyard Wind / Revolution (USA, North America) · long PPA ---------- */
  "vineyard":{ contracted:true, foundation:'fixed', growing:true,
    area:'US EAST COAST',
    footer:'Vineyard Wind / Revolution · long PPA / OREC · first big US offshore' },

  /* ---------- Brazil offshore (South America) · pre-commercial (illustrative) ---------- */
  "brazil":{ contracted:true, foundation:'fixed', growing:true,
    area:'BRAZIL (NE COAST)',
    footer:'Brazil offshore (illustrative) · early-stage / pre-commercial · contracted at EM rates' },

  /* ---------- Star of the South (Australia, Oceania) · early-stage, state-supported ---------- */
  "starsouth":{ contracted:true, foundation:'fixed', growing:true,
    area:'BASS STRAIT (AU)',
    footer:'Star of the South (illustrative) · early-stage · state-supported offtake' },

  /* ---------- Greater Changhua / Asian offshore (Taiwan) · CPPA, scaling ---------- */
  "changhua":{ contracted:true, foundation:'fixed', growing:true,
    area:'TAIWAN STRAIT',
    footer:'Greater Changhua · corporate PPA · large Asian offshore at scale' },

  /* ---------- China offshore at scale (China) · regulated / feed-in ---------- */
  "china":{ contracted:true, foundation:'fixed', growing:true,
    area:'CHINA EAST COAST',
    footer:'China offshore · feed-in / regulated · vast, fast build-out at scale' }
};
