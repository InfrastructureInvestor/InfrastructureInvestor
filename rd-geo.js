/* Scene configuration for roads.html — a top-down premium MOTORWAY, drawn in
   720x520 scene coordinates: a divided dual carriageway running full width with a
   central median, an interchange / slip road branching off for richness, traffic
   (cars and trucks) flowing along each carriageway, and — for toll concessions —
   an overhead TOLL GANTRY spanning the road that collects a toll from each vehicle
   that passes under it. Availability-payment PPP roads carry no demand risk: the
   government pays a fixed availability fee for the road being open and maintained,
   so instead of a gantry the scene shows an AVAILABILITY PAYMENT badge and earns
   at a steady rate independent of traffic. Each concession carries its own scene
   signature: the revenue model, the lane count, the truck (heavy-goods) share,
   the area label and the footer caption.
   model the renderer understands:  toll · availability  */
var GEO={

  /* ---------- Autostrade per l'Italia (Europe) · mature regulated toll network ---------- */
  "autostrade":{ model:'toll', lanes:3, trucks:0.30, area:'ITALY · A1 / A14 NETWORK',
    footer:'Regulated toll-motorway network · demand risk · five-year tariff formula (ART)' },

  /* ---------- 407 ETR (North America) · premium unregulated toll road ---------- */
  "etr407":{ model:'toll', lanes:5, trucks:0.16, area:'GREATER TORONTO, CANADA',
    footer:'Electronic open-road toll · UNREGULATED tolls · pure demand risk · 99-year lease' },

  /* ---------- CCR (South America) · EM toll-road concessions ---------- */
  "ccr":{ model:'toll', lanes:2, trucks:0.34, area:'SÃO PAULO & SOUTH-EAST BRAZIL',
    footer:'Toll-road concessions · demand risk · real-denominated · EM discount rate' },

  /* ---------- Transurban (Oceania) · urban toll roads ---------- */
  "transurban":{ model:'toll', lanes:4, trucks:0.12, area:'MELBOURNE & SYDNEY, AUSTRALIA',
    footer:'Urban toll roads · CityLink / WestConnex · demand risk · CPI-linked tolls · listed' },

  /* ---------- Gulf availability highway PPP (Middle East) · no demand risk ---------- */
  "gulfppp":{ model:'availability', lanes:3, trucks:0.22, area:'GULF · SAUDI ARABIA / UAE',
    footer:'Availability-payment highway PPP · NO demand risk · government pays for availability' },

  /* ---------- Chinese expressway operator (China) · listed toll expressway ---------- */
  "expressway":{ model:'toll', lanes:4, trucks:0.28, area:'YANGTZE DELTA, CHINA',
    footer:'Listed toll expressway · demand risk · vast scale · low state cost of capital' }
};
