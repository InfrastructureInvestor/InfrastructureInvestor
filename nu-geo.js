/* Scene configuration for nuclear.html — a nuclear power station drawn in
   720x520 scene coordinates beside a body of water used for cooling. One or two
   reactor containment domes (large hemispherical buildings) sit beside a turbine
   hall; big cooling towers emit slow, rising steam plumes; a switchyard and
   transmission lines carry the steady output away as near-constant cyan pulses
   (capacity factor is high and flat). More capacity (MW) brings a second reactor
   unit; a higher capacity factor brings more steam and stronger output. Each
   project carries its own signature: reactor type, how it is cooled, whether the
   programme is growing (a new unit / SMR fleet), its area label and footer.

   type:    'EPR' | 'AP1000' | 'APR1400' | 'fleet' | 'SMR'
   cooling: 'tower' (hyperbolic cooling towers) | 'sea' (coastal, direct seawater)
            | 'river' (river/lake, direct/once-through)
   growing: true draws a "+ UNIT 2" / "+ SMR FLEET" marker (new-build pipeline)  */
var GEO={

  /* ---------- Hinkley Point C (UK · Europe) · EPR, CfD + RAB (Sizewell) ---------- */
  "hinkley":{ type:'EPR', cooling:'sea', growing:true,
    area:'SOMERSET, UK',
    footer:'EPR · CfD (Hinkley) + RAB (Sizewell C) · firm baseload · cost overruns' },

  /* ---------- Vogtle 3 & 4 (Georgia, USA · North America) · AP1000, regulated ---------- */
  "vogtle":{ type:'AP1000', cooling:'tower', growing:false,
    area:'GEORGIA, USA',
    footer:'AP1000 · regulated cost-of-service utility · the first US new-build in decades' },

  /* ---------- Angra (Brazil · South America) · state nuclear, regulated ---------- */
  "angra":{ type:'fleet', cooling:'sea', growing:true,
    area:'ANGRA DOS REIS, BRAZIL',
    footer:'State nuclear (Eletronuclear) · regulated · Angra 1·2, Angra 3 completing' },

  /* ---------- Barakah (UAE · Middle East) · APR1400, four units, long PPA ---------- */
  "barakah":{ type:'APR1400', cooling:'sea', growing:false,
    area:'AL DHAFRA, UAE',
    footer:'APR1400 · four units · KEPCO-built on-time/on-budget · long PPA (ENEC)' },

  /* ---------- CGN / China nuclear (China) · standardised fleet, low CoC ---------- */
  "cgn":{ type:'fleet', cooling:'sea', growing:true,
    area:'COASTAL CHINA',
    footer:'Standardised fleet build-out (Hualong One) · low cost of capital · firm baseload' },

  /* ---------- Small modular reactor (global / Oceania-relevant) · new-build SMR ---------- */
  "smr":{ type:'SMR', cooling:'river', growing:true,
    area:'GLOBAL (illustrative)',
    footer:'Small modular reactor · factory-built · first-of-a-kind · contracted offtake' }
};
