/* Scene configuration for schools.html, a top-down / elevation SCHOOL CAMPUS,
   drawn in 720x520 scene coordinates: one or two school buildings with rows of lit
   classroom windows, a playground / sports pitch (a green field with markings), a
   covered entrance and a small bus drop-off, plus a local-authority icon that pays
   the availability fee. The buildings are "available" and lit; high availability =
   fully lit; dropping the availability slider dims classrooms and raises a deduction
   marker. Each schools PPP / PFI carries its own signature: the contract model, the
   livery colour, whether it is a batched bundle, whether the programme is still
   growing (a new school / batch joining), the area label and the footer.
   model the renderer understands:  PFI · BSF · P3 · concession */
var GEO={

  /* ---------- UK BSF / PF2 schools bundle (Europe) · batched PFI ---------- */
  "ukbsf":{ model:'BSF', livery:'#b5402f', bundle:true, growing:true,
    area:'UNITED KINGDOM',
    footer:'BSF / PFI schools bundle · indexed unitary charge · no demand risk · light FM · infra-fund owned' },

  /* ---------- Alberta Schools P3 (North America) · bundled P3 programme ---------- */
  "alberta":{ model:'P3', livery:'#1f6f8b', bundle:true, growing:false,
    area:'ALBERTA, CANADA',
    footer:'Bundled P3 schools · availability payment · design-build-finance-maintain · no demand risk' },

  /* ---------- Belo Horizonte / Brazil schools PPP (South America) · municipal, EM ---------- */
  "belo":{ model:'PPP', livery:'#2e8b57', bundle:true, growing:true,
    area:'BELO HORIZONTE, BRAZIL',
    footer:'Municipal schools PPP · availability + light FM · emerging-market · no demand risk' },

  /* ---------- NSW schools PPP (Oceania) · bundled new-schools availability PPP ---------- */
  "nsw":{ model:'PPP', livery:'#1d6f4c', bundle:true, growing:false,
    area:'NEW SOUTH WALES, AUSTRALIA',
    footer:'Bundled new-schools availability PPP · government offtaker · indexed · no demand risk' },

  /* ---------- Gulf / Egypt schools PPP (Middle East) · emerging programme ---------- */
  "egypt":{ model:'concession', livery:'#3a6ea5', bundle:true, growing:true,
    area:'EGYPT · GULF REGION',
    footer:'Emerging schools-PPP programme · availability concession · light FM · state-backed' },

  /* ---------- Chinese schools PPP (China) · illustrative social capital ---------- */
  "china":{ model:'PPP', livery:'#c0392b', bundle:true, growing:true,
    area:'CHINA',
    footer:'Social-capital schools PPP · availability-style payment · light FM · low cost of capital' }
};
