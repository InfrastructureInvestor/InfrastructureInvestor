/* Stylised but characteristic top-down airfield layouts for airports.html — drawn in
   scene coordinates (720 x 520). North is up. The vertical stratification is fixed by
   the engine: runways across the top, an apron taxiway, a row of contact stands at the
   terminal, then the landside forecourt, access road and car park at the bottom.
   Each airport carries its real signature: the number and arrangement of runways
   (a genuinely characteristic fingerprint), the terminal width and stand count, plus
   labelled features. The active runway (the one the scheduler works) is the lowest. */
var GEO={

  /* ---------- Heathrow · two close-parallel runways, west London ---------- */
  "heathrow":{
    runways:[[92,44,694,'09R / 27L'],[150,44,694,'09L / 27R']],
    termX:158, termW:404, nStands:8, piers:[[300,'T5'],[470,'T2']],
    carpark:true, rail:true,
    labels:[['LONDON',636,470,'land'],['T5',300,344,'feat'],['T2 / T3',470,344,'feat'],['CARGO',96,360,'feat']],
    footer:'RAB-regulated single-till monopoly · two close parallels · west London' },

  /* ---------- Atlanta · five parallel runways, the world's busiest ---------- */
  "atlanta":{
    runways:[[60,40,696,'08L / 26R'],[88,40,696,'08R / 26L'],[120,40,696,'09L / 27R'],[150,40,696,'09R / 27L'],[182,40,696,'10 / 28']],
    termX:150, termW:430, nStands:10, piers:[[250,'T'],[360,'A-B'],[470,'C-D'],[560,'E-F']],
    carpark:true, rail:true,
    labels:[['ATLANTA',640,470,'land'],['DOMESTIC',236,346,'feat'],['INTERNATIONAL',560,346,'feat']],
    footer:'City-owned · five parallel runways · residual airline-use agreement · Delta hub' },

  /* ---------- Lima · a new second runway and terminal, Pacific coast ---------- */
  "lima":{
    runways:[[100,44,694,'16 / 34'],[148,44,694,'15 / 33']],
    termX:182, termW:356, nStands:6, piers:[[300,'NEW TERMINAL']],
    carpark:true, rail:false,
    labels:[['LIMA',638,470,'land'],['NEW TERMINAL (2025)',330,346,'feat'],['PACIFIC',96,210,'skyfaint']],
    footer:'Privatised Fraport concession · second runway + new terminal (2025) · Pacific coast' },

  /* ---------- Sydney · two parallels plus an east-west cross runway, on the bay ---------- */
  "sydney":{
    runways:[[96,150,694,'16R / 34L'],[150,150,694,'16L / 34R']],
    cross:[[150,40],[470,200],'07 / 25'],
    termX:200, termW:360, nStands:7, piers:[[320,'T1 INTL'],[470,'T2/T3 DOM']],
    carpark:true, rail:true,
    labels:[['SYDNEY',640,470,'land'],['BOTANY BAY',96,250,'skyfaint'],['T1 INTL',320,346,'feat']],
    footer:'Privatised · light-handed ACCC monitoring · three runways · 99-year lease · Botany Bay' },

  /* ---------- Dubai · two parallels, the world's busiest international hub ---------- */
  "dubai":{
    runways:[[94,44,694,'12L / 30R'],[150,44,694,'12R / 30L']],
    termX:150, termW:430, nStands:9, piers:[[260,'T3 · EMIRATES'],[440,'T1'],[560,'CONCOURSE']],
    carpark:true, rail:true,
    labels:[['DUBAI',640,470,'land'],['T3 · EMIRATES',280,346,'feat'],['DUTY FREE',470,346,'feat']],
    footer:'Government-owned strategic hub · two parallels · Emirates base · huge duty-free till' },

  /* ---------- Beijing Capital · three parallel runways, the listed state hub ---------- */
  "beijing":{
    runways:[[78,40,696,'01 / 19'],[120,40,696,'18L / 36R'],[164,40,696,'18R / 36L']],
    termX:158, termW:404, nStands:9, piers:[[300,'T3'],[470,'T1 / T2']],
    carpark:true, rail:true,
    labels:[['BEIJING',638,470,'land'],['T3',300,346,'feat'],['T1 / T2',470,346,'feat']],
    footer:'HK-listed, state-controlled operator · three parallel runways · Terminal 3' }
};
