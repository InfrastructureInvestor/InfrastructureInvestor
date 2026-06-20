/* Scene configuration for prisons.html, a top-down CUSTODIAL FACILITY drawn in
   720x520 scene coordinates: a secure double perimeter (fence/wall) enclosing
   cell-block wings that radiate from a central control hub, a gatehouse on the
   approach, watch towers at the corners, an exercise yard and an FM/services
   building. The facility is "available" when its blocks are lit and operational;
   dropping the availability slider dims blocks and raises a deduction marker. Each
   custodial PPP carries its own signature: the contract model (DBFO / operated /
   availability / concession), whether the operator also runs custodial services
   (operated), whether the estate is growing (a new houseblock / expansion), the
   area label and the footer.
   model the renderer understands:  DBFO · operated · availability · concession */
var GEO={

  /* ---------- UK custodial PFI/DBFO (Europe) · operator-run, unitary charge ---------- */
  "ukdbfo":{ model:'DBFO', operated:true, growing:false,
    area:'UNITED KINGDOM',
    footer:'Custodial PFI/DBFO · design-build-finance-operate · operator-run · indexed unitary charge' },

  /* ---------- US private corrections (North America) · per-diem + occupancy ---------- */
  "uscorr":{ model:'operated', operated:true, growing:false,
    area:'UNITED STATES',
    footer:'Private corrections · per-diem + occupancy guarantee · listed REIT operators · demand-linked' },

  /* ---------- Chilean / Latin-American prison concession (South America) ---------- */
  "chile":{ model:'concession', operated:false, growing:true,
    area:'CHILE / LATIN AMERICA',
    footer:'Prison concession · availability-based · estate provided & maintained · emerging-market rates' },

  /* ---------- Clarence Correctional Centre (Oceania) · large availability PPP ---------- */
  "clarence":{ model:'availability', operated:true, growing:false,
    area:'NEW SOUTH WALES, AUSTRALIA',
    footer:'Availability PPP · finance-build-maintain-operate · government-backed · no demand risk' },

  /* ---------- Gulf custodial PPP (Middle East) · emerging, state-backed ---------- */
  "gulf":{ model:'availability', operated:false, growing:true,
    area:'GULF / MIDDLE EAST',
    footer:'Custodial PPP · availability-based estate provision · state-backed · low cost of capital' },

  /* ---------- Chinese / state custodial (China) · illustrative state-run contrast ---------- */
  "china":{ model:'operated', operated:true, growing:false,
    area:'CHINA',
    footer:'State custodial estate · state-financed & operated · no private PPP charge · illustrative contrast' }
};
