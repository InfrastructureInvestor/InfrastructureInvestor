/* Scene configuration for military.html, a top-down / elevation DEFENCE
   ACCOMMODATION ESTATE, drawn in a 720x520 daytime scene: rows of uniform
   accommodation blocks / barracks behind a gated entrance with a flagpole and
   flag, a parade square, a mess / HQ building and a perimeter, lit windows (the
   estate "available" and occupied). A defence-ministry / government icon pays a
   contracted, inflation-indexed availability charge per accommodation unit to the
   project SPV; the SPV drains facilities-management and estate cost. The model is
   the availability PPP (defence accommodation / housing privatisation): a long,
   government-backed, indexed, demand-risk-free annuity, reduced only by deductions
   for unavailability or performance failures.

   This is housing and estate availability, not weapons or operations: it is about
   keeping serviceperson accommodation built, maintained and available.

   Each example carries its own signature:
     model  , 'PFI' | 'MHPI' | 'concession'        (the PPP / privatisation structure)
     kind   , 'housing' | 'barracks' | 'estate'     (the accommodation type)
     phase  , 'greenfield' | 'operational'          (build or operating)
     growing, bool                                  (a + NEW QUARTERS / + PHASE 2 marker)
     authority, the government payer label shown on the offtaker icon
     area   , the area caption (top-down map label)
     footer , the scene footer caption
*/
var GEO={

  /* ---------- 1 · UK Project Allenby/Connaught (Europe) · army accommodation PFI ---------- */
  "allenby":{ model:'PFI', kind:'barracks', phase:'operational', growing:false,
    authority:'MINISTRY OF DEFENCE', accent:'#2f5fb0',
    area:'UNITED KINGDOM',
    footer:'Army accommodation PFI · availability charge · no demand risk · 35-year concession' },

  /* ---------- 2 · US Military Housing Privatization / MHPI (North America) · 50-year housing deals ---------- */
  "mhpi":{ model:'MHPI', kind:'housing', phase:'operational', growing:true,
    authority:'U.S. DEPARTMENT OF DEFENSE', accent:'#1d3f7a',
    area:'UNITED STATES',
    footer:'Military Housing Privatization · 50-year ground lease · BAH-backed · availability' },

  /* ---------- 3 · Latin-American defence estate PPP (South America) · emerging ---------- */
  "latam":{ model:'concession', kind:'estate', phase:'greenfield', growing:true,
    authority:'MINISTERIO DE DEFENSA', accent:'#1f6f8b',
    area:'SOUTH AMERICA (ILLUSTRATIVE)',
    footer:'Defence estate PPP · availability charge · emerging-market rates · illustrative' },

  /* ---------- 4 · Defence Housing Australia / accommodation PPP (Oceania) ---------- */
  "dha":{ model:'concession', kind:'housing', phase:'operational', growing:false,
    authority:'DEPARTMENT OF DEFENCE', accent:'#1d6f4c',
    area:'AUSTRALIA',
    footer:'Defence housing model · lease-back · availability + indexation · government-backed' },

  /* ---------- 5 · Gulf defence estate PPP (Middle East) · emerging ---------- */
  "gulf":{ model:'concession', kind:'estate', phase:'greenfield', growing:true,
    authority:'MINISTRY OF DEFENCE', accent:'#b07d24',
    area:'GULF REGION (ILLUSTRATIVE)',
    footer:'Gulf defence estate PPP · availability charge · sovereign-backed · illustrative' },

  /* ---------- 6 · Chinese / state defence estate (China) · illustrative / state contrast ---------- */
  "china":{ model:'PFI', kind:'barracks', phase:'operational', growing:true,
    authority:'STATE DEFENCE ADMINISTRATION', accent:'#c0392b',
    area:'CHINA (ILLUSTRATIVE)',
    footer:'State defence estate · availability-style payment · long term · state-backed' }
};
