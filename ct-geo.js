/* Scene configuration for courts.html — a top-down / elevation COURTHOUSE,
   drawn in a 720x520 daytime scene: a dignified civic building with a columned /
   portico entrance and steps, a clock / pediment over the door, a small
   scales-of-justice motif, rows of lit windows (the building "available"), and an
   FM / services entrance with a maintenance van. A justice-ministry / government
   icon pays a contracted, inflation-indexed availability fee (the unitary charge)
   to the project SPV; the SPV drains FM (security, cleaning, lifecycle) cost. The
   model is the availability PPP / PFI: a long, government-backed, indexed,
   demand-risk-free annuity, reduced only by deductions for unavailability or
   performance failures. There is NO demand risk — revenue does not depend on case
   volumes.

   Each example carries its own signature:
     model   — 'PFI' | 'P3' | 'concession'      (the PPP structure)
     tier    — 'flagship' | 'regional'          (the standing of the courthouse)
     growing — bool                             (a + EXTENSION marker)
     area    — the area caption (top-down map label)
     footer  — the scene footer caption
*/
var GEO={

  /* ---------- 1 · UK courts PFI (Europe) · the original unitary-charge PFI ---------- */
  "uk":{ model:'PFI', tier:'flagship', growing:false,
    authority:'MINISTRY OF JUSTICE', accent:'#2f5fb0',
    area:'UNITED KINGDOM',
    footer:'UK courts PFI · unitary charge · availability payment · no demand risk · secondary market' },

  /* ---------- 2 · Ontario courthouse P3 (North America) · Canadian DBFM ---------- */
  "ontario":{ model:'P3', tier:'flagship', growing:false,
    authority:'INFRASTRUCTURE ONTARIO', accent:'#c0392b',
    area:'ONTARIO, CANADA',
    footer:'Canadian P3 · DBFM · availability payment · consolidated courthouse · investment-grade offtaker' },

  /* ---------- 3 · Chilean / LatAm justice facility PPP (South America) · availability concession ---------- */
  "chile":{ model:'concession', tier:'regional', growing:true,
    authority:'MINISTERIO DE JUSTICIA', accent:'#1f6f8b',
    area:'CHILE',
    footer:'Justice facility PPP · availability payment · no demand risk · emerging-market rates' },

  /* ---------- 4 · Australian court PPP (Oceania) · state justice-precinct availability PPP ---------- */
  "australia":{ model:'P3', tier:'flagship', growing:false,
    authority:'STATE JUSTICE DEPT', accent:'#1d6f4c',
    area:'AUSTRALIA',
    footer:'Australian PPP · justice precinct · availability payment · indexed · government-backed' },

  /* ---------- 5 · Gulf justice complex PPP (Middle East) · emerging availability PPP ---------- */
  "gulf":{ model:'concession', tier:'flagship', growing:true,
    authority:'MINISTRY OF JUSTICE', accent:'#b07d24',
    area:'GULF REGION',
    footer:'Gulf justice complex PPP · availability charge · government-backed · FX considerations' },

  /* ---------- 6 · Chinese social-capital court complex (China) · illustrative PPP ---------- */
  "china":{ model:'PFI', tier:'regional', growing:true,
    authority:'JUDICIAL AUTHORITY', accent:'#c0392b',
    area:'CHINA',
    footer:'Social-capital court complex · availability-style payment · long concession · state-backed' }
};
