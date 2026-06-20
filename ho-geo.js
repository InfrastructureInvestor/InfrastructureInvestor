/* Scene configuration for hospitals.html, a top-down / elevation HOSPITAL CAMPUS,
   drawn in a 720x520 daytime scene: a main hospital building with a rooftop H /
   helipad, lit wards and windows (the hospital "available" and operating), an
   emergency / ambulance bay with an ambulance, and an FM / services entrance with
   a maintenance van. A public authority ("NHS"-style icon) pays a contracted,
   inflation-indexed availability fee (the unitary charge) to the project SPV; the
   SPV drains FM & lifecycle cost. The model is the availability PPP / PFI: a long,
   government-backed, indexed, demand-risk-free annuity, reduced only by deductions
   for unavailability or performance failures.

   Each example carries its own signature:
     model  , 'PFI' | 'P3' | 'concession' | 'integrated'   (the PPP structure)
     phase  , 'greenfield' | 'operational'                  (build or secondary)
     growing, bool                                          (a + NEW WING marker)
     authority, the public payer label shown on the offtaker icon
     area   , the area caption (top-down map label)
     footer , the scene footer caption
*/
var GEO={

  /* ---------- 1 · UK NHS PFI hospital (Europe) · the original unitary-charge PFI ---------- */
  "nhs":{ model:'PFI', phase:'operational', growing:false,
    authority:'NHS TRUST', accent:'#2f5fb0',
    area:'UNITED KINGDOM',
    footer:'NHS PFI · unitary charge · availability payment · no demand risk · secondary market' },

  /* ---------- 2 · Humber River Hospital (North America) · Canadian P3 / DBFM ---------- */
  "humber":{ model:'P3', phase:'operational', growing:false,
    authority:'INFRASTRUCTURE ONTARIO', accent:'#c0392b',
    area:'TORONTO, CANADA',
    footer:'Canadian P3 · DBFM · availability payment · digital hospital · investment-grade offtaker' },

  /* ---------- 3 · Chilean hospital concession (South America) · LatAm availability concession ---------- */
  "chile":{ model:'concession', phase:'greenfield', growing:true,
    authority:'MINISTERIO DE SALUD', accent:'#1f6f8b',
    area:'CHILE',
    footer:'Hospital concession · availability payment · bata blanca · emerging-market rates' },

  /* ---------- 4 · Northern Beaches Hospital (Oceania) · Australian PPP, blended operating model ---------- */
  "northern":{ model:'P3', phase:'operational', growing:false,
    authority:'NSW HEALTH', accent:'#1d6f4c',
    area:'NEW SOUTH WALES, AUSTRALIA',
    footer:'Australian PPP · availability + blended operating model · indexed · government-backed' },

  /* ---------- 5 · Turkish city hospital / şehir hastanesi (Middle East) · giant integrated campus PPP ---------- */
  "turkey":{ model:'integrated', phase:'greenfield', growing:true,
    authority:'SAĞLIK BAKANLIĞI', accent:'#b07d24',
    area:'TÜRKİYE',
    footer:'City hospital PPP · integrated health campus · availability + treasury guarantee · FX' },

  /* ---------- 6 · Chinese social-capital hospital (China) · illustrative PPP / social-capital model ---------- */
  "china":{ model:'PFI', phase:'operational', growing:true,
    authority:'HEALTH AUTHORITY', accent:'#c0392b',
    area:'CHINA',
    footer:'Social-capital hospital PPP · availability-style payment · long concession · state-backed' }
};
