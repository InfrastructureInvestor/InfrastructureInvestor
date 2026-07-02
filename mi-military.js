/* Military / defence estate (accommodation & facilities PPP), data-driven worked
   examples. Six defence-accommodation availability partnerships, one template. Scene
   config from mi-geo.js (GEO), drawn as a top-down / elevation defence ACCOMMODATION
   ESTATE in a 720x520 daytime scene: rows of uniform accommodation blocks / barracks
   behind a gated entrance with a flagpole and flag, a parade square, a mess / HQ
   building and a perimeter, with lit windows (the estate "available" and occupied).
   The interactive figures are illustrative: revenue is a contracted availability
   charge, an accommodation payment, (units × charge per unit × availability), with
   NO demand risk, reduced only by deductions for unavailability or performance
   failures; the returns model is a simplified DCF in which a public contribution or
   existing-estate transfer offsets the build cost. This is housing and estate
   availability, not weapons or operations. */
(function(){
  var CUR='£';
  var A=null;
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;
  var coins=[], _anim=false, demHist=[];
  function rnd(a,b){ return a+Math.random()*(b-a); }

  /* ---------------- formatting ---------------- */
  function money(v){ var n=v<0; v=Math.abs(v); var o;
    if(v>=1e9)o=(v/1e9).toFixed(2)+'bn'; else if(v>=1e6)o=(v/1e6).toFixed(0)+'m';
    else if(v>=1e3)o=Math.round(v/1e3)+'k'; else o=''+Math.round(v);
    return (n?'−':'')+CUR+o; }
  function m1(v){ return (v/1e6).toFixed(1); }
  function set(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; }
  function html(id,t){ var e=document.getElementById(id); if(e) e.innerHTML=t; }
  function pctS(v){ return (v>=0?'+':'')+(Math.round(v*10)/10)+'%'; }
  function kfmt(n){ return n>=1e6?(n/1e6).toFixed(n>=1e7?0:1)+'m':(n>=1e3?Math.round(n/1e3)+'k':''+Math.round(n)); }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · UK PROJECT ALLENBY/CONNAUGHT (Europe · army accommodation PFI) ---------- */
  allenby:{
    name:'UK Project Allenby/Connaught', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'allenby',
    lede:'A landmark army-accommodation <b>PFI</b>: a private consortium rebuilt and now maintains the living accommodation and estate for tens of thousands of soldiers, and the <b>Ministry of Defence</b> pays a single, inflation-indexed <b>availability charge</b> for keeping it available, with <b>no demand risk</b> whatsoever.',
    s1:'<p class="body"><b>Project Allenby/Connaught</b> is one of the UK\'s largest accommodation <b>Private Finance Initiative (PFI)</b> deals: a private consortium, a special-purpose vehicle (SPV), <b>rebuilt, financed and now maintains</b> the living accommodation, messes and working estate across several major army garrisons, and the <b>Ministry of Defence</b> pays a single, contracted <b>availability charge</b> over a roughly 35-year concession. The charge covers the capital, the financing, the lifecycle and the facilities management in one indexed payment.</p>'+
       '<p class="body">The economics are a <b>contracted government annuity</b>. Revenue does <b>not</b> depend on how the accommodation is used or how the army deploys. It is an <b>availability charge</b> per serviceperson place, paid in full so long as the estate is available and maintained to standard, reduced only by <b>deductions</b> for unavailable units or performance failures. That long, government-backed, inflation-linked, demand-risk-free cash flow is a canonical social-infrastructure asset, and defence-accommodation equity now trades in the <b>secondary market</b> at thin, stable yields.</p>',
    facts:[['PFI','Structure','rebuild·finance·maintain'],['Availability charge','Revenue','single indexed payment'],['No demand risk','Payment','availability, not use'],['~35yr','Concession','long government-backed'],['Deductions','Risk','unavailability / performance'],['Secondary','Market','traded at thin yields']],
    s2:'Watch the estate. The accommodation is <b>available</b>, blocks lit, the flag flying over a gated, maintained estate, and the <b style="color:#0c6b4f">Ministry of Defence</b> pays the <b>availability charge</b> for keeping it so. The SPV\'s money is the <b>availability charge on every unit kept available</b>, indexed each year; how the army uses the estate makes no difference. The real cost draining out is <b>facilities management, maintenance and lifecycle</b>. Drag the units, the charge per unit and the availability, and watch deductions bite if availability falls.',
    driverLab:'Charge / unit', availLab:'Availability', hrK:'Availability charge', yrS:'units × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & estate'}, demandLabel:'AVAILABILITY',
    preset:'Load Allenby/Connaught',
    try:'<b>Try this:</b> drop the <b>availability</b> a few points and watch the availability charge fall through <b>deductions</b>: a defence-accommodation PFI is paid for keeping the estate available and maintained, not for how it is used. Then remember the trick: there is <b>no demand risk</b> at all. An estate rebuilt once earns an <b>indexed availability charge for decades</b>, which is why these deals trade in the secondary market at thin, stable yields.',
    s3:'The Ministry pays an <b>availability charge per year</b> for the whole concession, indexed to inflation, covering capital, financing, lifecycle and facilities management. It is an <b>availability payment</b>: paid in full so long as the accommodation is available and maintained, reduced only by <b>deductions</b> for unavailable units or performance failures. There is <b>no demand risk</b>; the army\'s use of the estate is its own. The return is the spread between a long, indexed, government-backed charge and the cost of rebuilding and running the estate.',
    mb:{tag:'Model B · accommodation PFI', title:'A long army-accommodation annuity', body:'A private SPV rebuilds, finances and maintains the living accommodation and estate across army garrisons, and the Ministry of Defence pays a single, indexed availability charge over ~35 years for keeping it available: no demand risk, deductions for unavailability, FM and estate as the real cost. The canonical contracted government accommodation annuity. <b>This is UK Project Allenby/Connaught</b>, now traded in the secondary market.'},
    s4a:'A defence-accommodation PFI carries a real cost: <b>facilities management</b>, cleaning, grounds, security, response, and <b>lifecycle and estate maintenance</b>, replacing roofs, plant and fabric across the estate over the concession. These are sized into the charge, so the margin is moderate, not enormous. The number that matters is less the cost line than the <b>contracted, indexed availability charge and the availability</b> behind it.',
    wfNote:'Operating cost is the facilities management (response maintenance, grounds, security) and the lifecycle / estate provision that keeps the accommodation available over decades. It is a real, recurring cost sized into the availability charge, so the margin is moderate; the value is the long, indexed, government-backed payment.',
    s4b:'The capital is the <b>estate rebuild</b>, a capital-intensive accommodation programme funded through high-leverage project finance. A <b>public contribution</b> or the transfer of an <b>existing estate</b> may meet part of the cost, with the SPV financing the bulk and recovering it through the availability charge. That is the model: a large upfront rebuild turned into a long, contracted, indexed, demand-risk-free annuity backed by the defence ministry.',
    stackH:'The capital · the estate rebuild', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',12,'Public / estate transfer'],['s2',88,'SPV project finance']],
    finList:[['','Asset','army accommodation (DBFM)'],['sub','Structure','accommodation PFI'],['','Revenue','availability charge'],['sub','Indexation','inflation-linked'],['','Demand risk','none'],['rest','Owner','infra-fund SPV']],
    finNote:'A defence-accommodation PFI is the <b>canonical contracted government annuity</b>: an indexed availability charge over a long concession, no demand risk, a defence-ministry offtaker. FM and estate are real, so the margin is moderate; the value sits in the contracted, government-backed payment and the price paid in the secondary market.',
    timeline:[['1990s','<b>Accommodation PFI</b>, private finance for the defence estate.'],['2006','<b>Project agreement</b> for a major army-accommodation rebuild.'],['2000s-10s','<b>Rebuild &amp; upgrade</b> of living accommodation across garrisons.'],['Operational','<b>Availability charges</b> paid; FM and estate delivered.'],['Secondary','<b>Equity trades</b> to infra funds at thin yields.'],['Ongoing','<b>Hand-back</b> of the estate at concession end.']],
    calcNote:'A working model of a <b>UK army-accommodation PFI</b>. The build is the rebuild cost; a public contribution or estate transfer offsets part of it, so net capital is most of the build, geared high on project finance. Revenue is the indexed availability charge over a long hold; the exit multiple reflects a long, contracted, government-backed annuity.',
    s6:'Allenby/Connaught is the contracted accommodation annuity. What moves the return:',
    breakers:['<b>Availability</b>: the charge is paid for keeping the accommodation available; deductions bite for unavailability.','<b>Indexation</b>: the inflation-linked charge protects the real return over a long concession.','<b>FM &amp; estate</b>: facilities management and lifecycle are the real, recurring cost that sets the margin.','<b>Secondary-market price</b>: what the equity is bought and sold for sets the realised return.'],
    src:'Figures from public sources on the UK defence-estate <a href="https://www.nao.org.uk/" target="_blank" rel="noopener">accommodation PFI programme</a> and National Audit Office reviews. The figures are approximate and illustrative.',
    econ:{cur:'£', host:'Ministry of Defence', care:'army accommodation',
      unitsDef:18000,unitsMin:6000,unitsMax:34000,unitsStep:500, chargeDef:9000,chargeMin:5000,chargeMax:18000,chargeStep:250,
      availDef:98.5,availMin:90,availMax:100,availStep:0.5, fmPerUnit:3000, fixedOM:24},
    calc:{build:1300,grant:130,capex:3,revG:2.5,floor:140,cap:260,tax:25,exit:12,lev:4,rd:5,amort:3,hold:20},
    map:{footer:GEO.allenby.footer}
  },

  /* ---------- 2 · US MILITARY HOUSING PRIVATIZATION / MHPI (North America · the giant 50-year deals) ---------- */
  mhpi:{
    name:'US Military Housing Privatization (MHPI)', geo:'United States', continent:'North America', cur:'US$', geoKey:'mhpi',
    lede:'The giant US <b>Military Housing Privatization Initiative (MHPI)</b>: private partners own and operate on-base family housing under ~50-year ground leases, with rents funded by servicemembers\' <b>Basic Allowance for Housing</b>, a uniquely long, government-underpinned housing annuity.',
    s1:'<p class="body">The <b>Military Housing Privatization Initiative (MHPI)</b> transferred most US on-base family housing to private partners, names such as Balfour Beatty Communities, Lincoln Military Housing and Hunt, under <b>~50-year ground leases</b>. The partner <b>finances, builds, renovates and operates</b> the housing, and is repaid through <b>rents</b> that are funded by each servicemember\'s <b>Basic Allowance for Housing (BAH)</b>, a government housing allowance that effectively underpins the cash flow.</p>'+
       '<p class="body">It is an availability-style housing annuity at <b>enormous scale</b> and <b>extraordinary length</b>. The demand is structurally underpinned: service families occupy the housing and their BAH flows to the partner, so the model behaves like a contracted, government-backed annuity with very limited true demand risk. Three things set it apart: the <b>50-year term</b>, the <b>BAH-backed</b> revenue and the <b>covenant strength</b> of the Department of Defense behind it. New phases and renovations extend the estate. (Figures here are illustrative.)</p>',
    facts:[['MHPI','Structure','own·operate · ground lease'],['~50yr','Term','among the longest in infra'],['BAH-backed','Revenue','housing-allowance funded'],['Limited demand risk','Payment','service families occupy'],['DoD','Counterparty','federal covenant strength'],['Scale','Portfolio','hundreds of thousands of homes']],
    s2:'Watch the estate: rows of on-base family housing, blocks lit, the flag flying. The <b style="color:#0c6b4f">Department of Defense</b> underpins the rent through each family\'s <b>Basic Allowance for Housing</b>. The partner\'s money is the <b>charge on every home kept available and occupied</b>, indexed and underpinned by BAH rather than by speculative market demand. The cost draining out is <b>property management, maintenance and lifecycle</b>. Drag the homes, the charge and the availability to see a vast, very long, government-underpinned housing annuity at work.',
    driverLab:'Charge / home', availLab:'Availability', hrK:'BAH-backed charge', yrS:'homes × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & estate'}, demandLabel:'AVAILABILITY',
    preset:'Load MHPI',
    try:'<b>Try this:</b> push the <b>hold period</b>. MHPI ground leases run around 50 years, so the contracted, BAH-underpinned annuity compounds over an extraordinary horizon. Raise availability and the charge holds at the underpinned level; the revenue tracks the housing allowance, not speculative demand. The whole appeal is <b>length and covenant strength</b>: a federal-backed housing annuity over half a century.',
    s3:'The partner earns a <b>charge on every home kept available and occupied</b>, indexed over a ~50-year ground lease, underpinned by each family\'s <b>Basic Allowance for Housing</b>, a government housing allowance. True demand risk is limited because service families occupy on-base housing and the allowance flows through. The counterparty\'s strength is the <b>Department of Defense</b> behind the programme. So the income is a vast, very long, government-underpinned housing annuity, set by the homes, the charge and availability.',
    mb:{tag:'Model B · MHPI', title:'A 50-year BAH-backed housing annuity', body:'A privatisation in which a partner owns and operates on-base family housing under a ~50-year ground lease, repaid through rents funded by servicemembers\' Basic Allowance for Housing, with limited demand risk, federal covenant strength and an extraordinary term. A uniquely long, government-underpinned housing annuity. <b>This is the US Military Housing Privatization Initiative</b>.'},
    s4a:'The partner carries <b>full property management, maintenance and lifecycle</b> over the long lease, managing, repairing and renovating a large housing portfolio, sized so the BAH-backed charge covers it at a contracted margin. Because the revenue is housing-allowance underpinned and the term enormous, the margin is steady. The cost line counts for less than the <b>BAH-backed charge, the 50-year term</b> and the federal covenant behind it.',
    wfNote:'Operating cost is the property management and lifecycle of a large on-base housing portfolio, repairs, renovation, grounds and management, sized against a BAH-underpinned charge. Keeping homes available and occupied is the operational job; the value sits in the long, indexed, government-underpinned revenue.',
    s4b:'The capital is the <b>housing itself</b>, financed by the partner on high leverage and recovered over a ~50-year ground lease. The military often contributes the <b>land and the existing housing stock</b> through the ground lease, so the partner\'s net capital per home is moderated. The result is a vast, contracted, indexed, BAH-underpinned annuity backed by the Department of Defense: long, large and structurally underpinned.',
    stackH:'The capital · the housing build', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',22,'Land / estate transfer'],['s2',78,'Partner finance']],
    finList:[['','Asset','on-base family housing'],['sub','Structure','MHPI ground lease (~50yr)'],['','Revenue','BAH-backed charge'],['sub','Counterparty','Department of Defense'],['','Demand risk','limited (BAH-backed)'],['rest','Owner','housing partner']],
    finNote:'MHPI is a <b>uniquely long, government-underpinned housing annuity</b>: a BAH-backed charge over a ~50-year ground lease, limited demand risk, federal covenant strength. The residual risk is property management and lifecycle delivery and the structure of the long lease.',
    timeline:[['1996','<b>MHPI enacted</b>, Congress authorises housing privatisation.'],['2000s','<b>Ground leases</b> awarded, ~50-year deals with private partners.'],['Build','<b>Renovation &amp; new build</b> of on-base family housing.'],['Operate','<b>BAH-backed rents</b> over the long lease.'],['Phases','<b>New phases</b> extend the estate over time.'],['Long-term','<b>Hand-back</b> of the housing at lease end.']],
    calcNote:'A working model of <b>US military housing privatisation</b>, on an enterprise-value basis. Revenue is the BAH-underpinned charge over a very long hold; the floor binds when availability is high, so revenue is flat. A moderate cost of debt and high gearing reflect a long, federally underpinned housing annuity. Figures are illustrative.',
    s6:'MHPI is a uniquely long, BAH-backed housing annuity. What drives it:',
    breakers:['<b>Term</b>: a ~50-year ground lease compounds the contracted annuity over an extraordinary horizon.','<b>BAH backing</b>: the housing allowance underpins the rent and limits true demand risk.','<b>Federal covenant</b>: the Department of Defense behind the programme keeps the discount rate low.','<b>Property management &amp; lifecycle</b>: managing and renovating a large housing portfolio is the operational job.'],
    src:'Figures from public sources on the US <a href="https://www.gao.gov/" target="_blank" rel="noopener">Military Housing Privatization Initiative</a> and federal reviews of the programme. The figures are approximate and illustrative.',
    econ:{cur:'US$', host:'Department of Defense', care:'on-base family housing',
      unitsDef:24000,unitsMin:8000,unitsMax:50000,unitsStep:1000, chargeDef:13000,chargeMin:7000,chargeMax:24000,chargeStep:500,
      availDef:97.5,availMin:88,availMax:100,availStep:0.5, fmPerUnit:4200, fixedOM:34},
    calc:{build:2600,grant:520,capex:3,revG:2.5,floor:200,cap:380,tax:25,exit:12,lev:4,rd:5.5,amort:3,hold:16},
    map:{footer:GEO.mhpi.footer}
  },

  /* ---------- 3 · LATIN-AMERICAN DEFENCE ESTATE PPP (South America · emerging) ---------- */
  latam:{
    name:'Latin-American defence estate PPP', geo:'South America', continent:'South America', cur:'US$', geoKey:'latam',
    lede:'An emerging <b>defence-estate PPP</b> in which a private concessionaire builds and maintains serviceperson accommodation and supporting estate while the defence ministry pays a contracted, indexed availability charge, with no demand risk but emerging-market rates. (Illustrative.)',
    s1:'<p class="body">Several Latin-American states have begun using <b>PPP concessions</b> to deliver and maintain defence accommodation and supporting estate: a private concessionaire <b>builds, finances and maintains</b> serviceperson living accommodation, messes and facilities, while the <b>Ministerio de Defensa</b> keeps the operational mission. The concessionaire is remunerated through a contracted, inflation-indexed <b>availability charge</b> per accommodation unit over a long concession.</p>'+
       '<p class="body">This is the defence-accommodation availability PPP in <b>emerging-market</b> form. The concessionaire takes <b>no demand risk</b> (how the estate is used is the state\'s) and earns a <b>contracted charge</b> for keeping the accommodation available and the facilities delivered, with <b>deductions</b> for failures. The income is highly contracted, but it is priced against a <b>higher discount rate</b> than a developed-market deal, reflecting sovereign risk and a part-dollar, part-local cash mix. A new phase can extend the estate. (Names and figures here are illustrative.)</p>',
    facts:[['Concession','Structure','build·finance·maintain'],['Availability','Payment','contracted, indexed'],['No demand risk','Revenue','use stays with the state'],['US$ / local','Currency','part-dollar, part-local'],['EM rates','Pricing','higher discount rate'],['Emerging','Programme','early-stage']],
    s2:'The scene is a new estate: accommodation blocks behind a gated, maintained perimeter, the flag flying, the parade square. The <b style="color:#0c6b4f">defence ministry</b> pays the <b>availability charge</b> for keeping it available and the facilities delivered. The concessionaire\'s money is the <b>charge on every unit kept available</b>, indexed, regardless of how the estate is used. Drag the units, the charge and the availability; what you are pricing is a contracted annuity at an emerging-market discount rate.',
    driverLab:'Charge / unit', availLab:'Availability', hrK:'Availability charge', yrS:'units × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & estate'}, demandLabel:'AVAILABILITY',
    preset:'Load LatAm estate PPP',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the charge hold flat at the contracted level: a defence-estate concession pays for keeping the accommodation <b>available</b> rather than for how it is used, so above the threshold the revenue is contracted. Then push the cost of debt: a strong contracted number nets down once discounted like an emerging-market concession. The contract is solid; the debate is the discount rate.',
    s3:'The concessionaire earns a <b>contracted availability charge</b> for keeping the accommodation available and delivering the supporting facilities, indexed to inflation, with <b>deductions</b> for failures. How the estate is used is the state\'s affair, so there is <b>no demand risk</b>. The income is a fully contracted government annuity, set by the units, the charge and availability. The investor question is less the contract than the <b>discount rate</b>: sovereign risk and the dollar-local mix.',
    mb:{tag:'Model B · defence estate PPP', title:'Emerging-market availability estate', body:'A concession in which a private party builds, finances and maintains defence accommodation and supporting estate, paid a contracted, indexed availability charge by the defence ministry, with no demand risk and deductions for failures. A fully contracted annuity priced against emerging-market rates. <b>This is an illustrative Latin-American defence-estate PPP</b>.'},
    s4a:'The concessionaire carries <b>full facilities management and lifecycle</b>, accommodation upkeep, supporting facilities and estate renewal, sized into the availability charge. Margins are healthy because the charge is set to cover it; the swing factor is the <b>contracted charge and the discount rate</b> on an emerging-market concession.',
    wfNote:'Operating cost is the facilities management plus the lifecycle renewal of accommodation and estate; the cost is real, because deductions penalise failures. The charge is set to cover it at a contracted margin; the value driver is the indexed charge and the emerging-market discount rate.',
    s4b:'The capital is the <b>estate build</b>, financed under the concession on high leverage. A <b>public contribution</b> or existing-estate transfer typically funds part of the capital, with the concessionaire financing the balance and recovering it through the availability charge. Modelled on an enterprise-value basis, it is a contracted, indexed annuity carried against <b>emerging-market</b> rates; a new phase can extend it.',
    stackH:'The capital · the estate build', splitL:'Who funds the build', splitR:'EM',
    split:[['s1',22,'Public / estate transfer'],['s2',78,'Concessionaire finance']],
    finList:[['','Asset','defence accommodation (PPP)'],['sub','Structure','availability concession'],['','Revenue','contracted availability charge'],['sub','Demand risk','none (use stays public)'],['','Key risk','sovereign &amp; currency'],['rest','Owner','concession consortium']],
    finNote:'A defence-estate concession is a <b>fully contracted government annuity</b>: an indexed charge for keeping the accommodation available, with no demand risk. The investment debate centres on the <b>discount rate</b>, on sovereign risk and on the dollar-local mix more than on the contract.',
    timeline:[['2010s','<b>Defence-estate PPPs</b> piloted to build and maintain accommodation.'],['Build','<b>Greenfield construction</b> of accommodation under the concession.'],['Open','<b>Availability charges</b> begin as the estate enters service.'],['Operate','<b>Facilities</b> delivered; the operational mission stays public.'],['Indexed','<b>Payment indexation</b> over the concession.'],['Long-term','<b>Hand-back</b> of the estate at concession end.']],
    calcNote:'A working model of a <b>Latin-American defence-estate PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; the floor binds when availability is high. The cost of debt is higher to reflect emerging-market rates, so the same contracted number is worth less once discounted. Figures are illustrative.',
    s6:'A defence-estate concession is a contracted annuity at an EM discount rate. The moving parts:',
    breakers:['<b>Availability</b>: the charge is for keeping the accommodation available; deductions bite for failures.','<b>Contracted charge</b>: the indexed charge sets the revenue, whatever the estate\'s use.','<b>Country &amp; currency</b>: sovereign risk and the dollar-local mix set the discount rate.','<b>FM &amp; estate</b>: delivering the facilities and lifecycle is the operational risk.'],
    src:'Figures from public sources on Latin-American defence-estate and accommodation PPPs: ministry and multilateral disclosure. As an emerging-market PPP, all figures here are approximate and illustrative.',
    econ:{cur:'US$', host:'defence ministry', care:'defence accommodation',
      unitsDef:9000,unitsMin:3000,unitsMax:20000,unitsStep:500, chargeDef:7000,chargeMin:3500,chargeMax:14000,chargeStep:250,
      availDef:97.5,availMin:88,availMax:100,availStep:0.5, fmPerUnit:2400, fixedOM:11},
    calc:{build:580,grant:280,capex:3,revG:2.5,floor:60,cap:120,tax:27,exit:9,lev:4,rd:8.5,amort:3,hold:16},
    map:{footer:GEO.latam.footer}
  },

  /* ---------- 4 · DEFENCE HOUSING AUSTRALIA / ACCOMMODATION PPP (Oceania) ---------- */
  dha:{
    name:'Defence Housing Australia accommodation', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'dha',
    lede:'An Australian defence-<b>housing model</b>: homes are built and leased to provide serviceperson accommodation, and the <b>Department of Defence</b> underpins a contracted, indexed rent for keeping them available; a long, government-backed, demand-risk-free housing annuity.',
    s1:'<p class="body">Australia houses service families through a long-running defence-<b>housing model</b> in which homes are <b>built, owned and leased</b> to provide serviceperson accommodation, and the <b>Department of Defence</b> underpins the rent. Investors participate through <b>lease-back</b> and accommodation-PPP structures: a private party finances and maintains the housing, and Defence pays a contracted, inflation-indexed <b>availability-style rent</b> for keeping it available and maintained over a long term.</p>'+
       '<p class="body">Backed by an <b>investment-grade</b> sovereign and denominated in Australian dollars, the accommodation core is a clean social-infrastructure cash flow. The party takes <b>no demand risk</b> on the availability core, since how Defence allocates the housing is its own affair, and is paid for <b>availability and maintenance</b>, with adjustments for unavailable or sub-standard homes. It is a long, government-backed, indexed, demand-risk-free housing annuity, the kind of asset that anchors a core portfolio.</p>',
    facts:[['Housing model','Structure','build·own·lease·maintain'],['Availability rent','Payment','contracted, indexed'],['Lease-back','Access','investor participation'],['No demand risk','Availability core','availability, not use'],['Investment-grade','Counterparty','Australian government'],['Long term','Concession','25-30 years']],
    s2:'Watch the rows of defence housing behind a gated, maintained estate, the flag flying. <b style="color:#0c6b4f">The Department of Defence</b> underpins the <b>availability rent</b> for keeping the housing available and maintained. The party\'s money is the <b>rent on every home kept available</b>, indexed; how the housing is allocated sits with Defence. Drag the homes, the charge and the availability. This is a core, government-backed housing annuity.',
    driverLab:'Rent / home', availLab:'Availability', hrK:'Availability rent', yrS:'homes × rent × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & estate'}, demandLabel:'AVAILABILITY',
    preset:'Load defence housing',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the rent sit flat at the contracted level: Defence underpins the payment for keeping the housing <b>available and maintained</b>, whatever the allocation. With an investment-grade sovereign the discount rate is low and gearing high. Drop availability and adjustments bite; the result is a clean, contracted social-infrastructure cash flow.',
    s3:'The party earns a <b>contracted availability rent</b> for keeping the housing available and maintained to standard, indexed to inflation, with <b>adjustments</b> for unavailable or sub-standard homes. The availability core has <b>no demand risk</b>. How Defence allocates the housing sits with Defence. So the accommodation income is a clean, fully contracted government annuity backed by an <b>investment-grade</b> sovereign, set by the homes, the rent and availability.',
    mb:{tag:'Model B · defence housing', title:'Government-backed housing annuity', body:'An Australian defence-housing model in which a party finances, owns and maintains serviceperson housing and the Department of Defence underpins a contracted, indexed availability rent for keeping it available: no demand risk on the availability core, an investment-grade counterparty, adjustments for unavailable homes. The core housing annuity. <b>This is the Defence Housing Australia model</b>.'},
    s4a:'The party carries <b>full property maintenance and lifecycle</b> over the term, repairs, grounds and renewal of the housing stock, sized so the availability rent covers it at a contracted margin. With an investment-grade sovereign the margin is steady. The <b>contracted, indexed rent</b> and the low discount rate a sovereign counterparty permits count for more than the cost line.',
    wfNote:'Operating cost is the through-life maintenance and lifecycle of the housing stock plus grounds and management, sized against a contracted rent. Keeping homes available is the operational job; the value sits in the indexed, government-backed payment.',
    s4b:'The capital is the <b>housing</b>, financed by the party on high leverage and recovered over the long term through the availability rent. A portion may be met through an existing-estate transfer, but the party funds the bulk and recovers it through the rent. Backed by an investment-grade sovereign, the cash flow is contracted and indexed, so it gears well: a low-risk, long-life government housing annuity.',
    stackH:'The capital · the housing build', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',15,'Estate transfer'],['s2',85,'Party finance']],
    finList:[['','Asset','defence housing (lease-back)'],['sub','Structure','build·own·lease·maintain'],['','Revenue','availability rent'],['sub','Counterparty','Department of Defence'],['','Demand risk','none (availability core)'],['rest','Owner','infra-backed party']],
    finNote:'An Australian defence-housing model is the <b>core social-infrastructure housing annuity</b>: an indexed availability rent over a long term, no demand risk on the availability core, an investment-grade counterparty. The residual risk is maintenance and lifecycle delivery and adjustments.',
    timeline:[['1980s-90s','<b>Defence housing model</b> established to house service families.'],['Build','<b>Homes built &amp; owned</b> to provide accommodation.'],['Lease-back','<b>Investor participation</b> via lease-back and PPP.'],['Operate','<b>Availability rents</b> over the long maintenance term.'],['Indexed','<b>Payment indexation</b> tracks inflation.'],['Long-term','<b>Hand-back</b> of the housing at term end.']],
    calcNote:'A working model of an <b>Australian defence-housing model</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability rent; with availability high the floor binds and revenue sits flat. A low cost of debt and high gearing reflect an investment-grade sovereign.',
    s6:'Defence housing is a core, government-backed housing annuity. The return turns on:',
    breakers:['<b>Availability</b>: the rent is for keeping the housing available; adjustments bite for unavailability.','<b>Sovereign counterparty</b>: an investment-grade government keeps the discount rate low and gearing high.','<b>Indexation</b>: the inflation-linked rent protects the real return over a long term.','<b>Maintenance &amp; lifecycle</b>: maintaining the housing stock over decades is the operational risk.'],
    src:'Figures from public sources on Defence Housing Australia and Australian defence-accommodation arrangements: Commonwealth and programme disclosure. The figures are approximate and illustrative.',
    econ:{cur:'A$', host:'Department of Defence', care:'defence housing',
      unitsDef:14000,unitsMin:5000,unitsMax:28000,unitsStep:500, chargeDef:12000,chargeMin:6000,chargeMax:22000,chargeStep:500,
      availDef:98.5,availMin:90,availMax:100,availStep:0.5, fmPerUnit:3600, fixedOM:20},
    calc:{build:1250,grant:115,capex:3,revG:2.5,floor:120,cap:230,tax:30,exit:11,lev:4,rd:5,amort:3,hold:16},
    map:{footer:GEO.dha.footer}
  },

  /* ---------- 5 · GULF DEFENCE ESTATE PPP (Middle East · emerging) ---------- */
  gulf:{
    name:'Gulf defence estate PPP', geo:'Gulf region', continent:'Middle East', cur:'US$', geoKey:'gulf',
    lede:'An emerging Gulf <b>defence-estate PPP</b> where a private consortium builds and maintains serviceperson accommodation and estate and the defence ministry pays a contracted, often hard-currency-linked availability charge under sovereign backing, with FX and treasury considerations. (Illustrative.)',
    s1:'<p class="body">Gulf states have begun applying their growing <b>PPP</b> frameworks to the defence estate: a private consortium <b>designs, builds, finances and maintains</b> serviceperson living accommodation, messes and supporting facilities, while the <b>Ministry of Defence</b> keeps the operational mission and pays a contracted <b>availability charge</b> over a long concession, typically with <b>sovereign backing</b>.</p>'+
       '<p class="body">It is the defence-accommodation availability PPP with an <b>emerging-market, hard-currency</b> twist. Use of the estate stays with the state, so the consortium takes <b>no demand risk</b>; it earns a contracted, indexed <b>availability payment</b> for keeping the accommodation available and the facilities delivered, with <b>deductions</b> for failures. The two considerations that dominate are <b>FX and sovereign credit</b>: the payments are often hard-currency-linked and underpinned by a strong sovereign, so the credit and currency story drives the discount rate. A new phase extends the estate. (Names and figures here are illustrative.)</p>',
    facts:[['Concession','Structure','DBFM + FM'],['Availability','Payment','contracted, indexed'],['Sovereign-backed','Credit','strong sovereign'],['FX-linked','Currency','hard-currency considerations'],['No demand risk','Revenue','use stays with the state'],['Emerging','Programme','growing PPP framework']],
    s2:'Watch the estate take shape: new accommodation blocks behind a gated, maintained perimeter, the flag flying, a parade square. The <b style="color:#0c6b4f">defence ministry</b> pays the <b>availability charge</b> for keeping it available and the facilities delivered, under sovereign backing. The consortium\'s money is the <b>charge on every unit kept available</b>, indexed. Drag the units, the charge and the availability to price a contracted annuity with FX / sovereign considerations.',
    driverLab:'Charge / unit', availLab:'Availability', hrK:'Availability charge', yrS:'units × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & estate'}, demandLabel:'AVAILABILITY',
    preset:'Load Gulf estate PPP',
    try:'<b>Try this:</b> raise the <b>availability</b> and the charge holds at the contracted level, because the ministry pays for keeping the accommodation <b>available</b> rather than for how it is used. The credit and currency story (sovereign backing, hard-currency linkage) sets the discount rate: a contracted annuity priced against a strong but emerging-market sovereign. Push the cost of debt to see the FX / sovereign premium net the value down.',
    s3:'The consortium earns a <b>contracted availability payment</b> for keeping the accommodation available and delivering the facilities, indexed and often <b>hard-currency-linked</b>, with <b>deductions</b> for failures, and takes <b>no demand risk</b> because how the estate is used is the state\'s. The payment is underpinned by a <b>strong sovereign</b>. The income is a fully contracted government annuity; the investor question is the <b>FX and sovereign credit</b> that set the discount rate.',
    mb:{tag:'Model B · Gulf estate PPP', title:'Sovereign-backed availability estate', body:'A defence-estate PPP in which a consortium builds, finances and maintains accommodation and facilities, paid a contracted, indexed, often FX-linked availability charge by the defence ministry under sovereign backing, taking no demand risk and bearing deductions for failures. A contracted annuity with FX / sovereign considerations. <b>This is an illustrative Gulf defence-estate PPP</b>.'},
    s4a:'The consortium carries <b>full facilities management and lifecycle</b> across the estate, accommodation upkeep, supporting facilities and renewal, sized into the availability charge. The margin is healthy, but the swing factor is not the cost line so much as the <b>contracted charge, the FX linkage and the sovereign credit</b> behind the backing.',
    wfNote:'Operating cost is the facilities management plus the lifecycle renewal of accommodation and estate, and it is real: deductions penalise failures. The charge is set to cover it; the value driver is the indexed, often FX-linked payment and the sovereign credit behind the backing.',
    s4b:'The capital is the <b>estate build</b>, a capital-intensive accommodation programme, financed on high leverage, often with international lenders. A <b>sovereign contribution</b> may meet part of the cost, with the consortium financing the balance and recovering it through the availability charge under sovereign backing. A contracted, indexed annuity carried against <b>emerging-market sovereign</b> credit and FX.',
    stackH:'The capital · the estate build', splitL:'Who funds the build', splitR:'sovereign',
    split:[['s1',20,'Sovereign contribution'],['s2',80,'Consortium finance']],
    finList:[['','Asset','defence accommodation estate'],['sub','Structure','DBFM PPP'],['','Revenue','contracted availability charge'],['sub','Credit','sovereign-backed'],['','Key risk','FX &amp; sovereign'],['rest','Owner','PPP consortium']],
    finNote:'A Gulf defence-estate PPP is a <b>sovereign-backed contracted annuity</b>: an indexed, often FX-linked availability charge for keeping the accommodation available, no demand risk. The investment debate turns on the <b>FX and sovereign credit</b> behind the backing more than on the contract.',
    timeline:[['2010s-20s','<b>PPP frameworks</b> extended toward the defence estate.'],['Build','<b>DBFM</b> of accommodation and supporting estate.'],['Open','<b>Availability charges</b> begin as the estate enters service.'],['Backing','<b>Sovereign backing</b> underpins the payments.'],['Indexed','<b>Payment indexation</b> / FX linkage over the concession.'],['Transfer','<b>Transfer</b> of the estate to the state at term end.']],
    calcNote:'A working model of a <b>Gulf defence-estate PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; when availability is high the floor binds. A higher cost of debt reflects emerging-market sovereign and FX risk, so a strong contracted number shrinks once discounted. Figures are highly illustrative.',
    s6:'A Gulf estate PPP is a sovereign-backed contracted annuity. The levers:',
    breakers:['<b>Availability</b>: the charge is for keeping the accommodation available; deductions bite for failures.','<b>Sovereign backing</b>: the sovereign credit behind the payment is the security.','<b>FX &amp; sovereign</b>: hard-currency linkage and sovereign risk set the discount rate.','<b>FM &amp; estate</b>: maintaining the accommodation estate over decades is the operational job.'],
    src:'Figures from public sources on Gulf PPP programmes and defence-estate partnerships. As an emerging-market sovereign-backed PPP, all figures here are highly approximate and illustrative.',
    econ:{cur:'US$', host:'defence ministry', care:'defence estate',
      unitsDef:11000,unitsMin:4000,unitsMax:24000,unitsStep:500, chargeDef:9000,chargeMin:4500,chargeMax:18000,chargeStep:250,
      availDef:97.5,availMin:88,availMax:100,availStep:0.5, fmPerUnit:2800, fixedOM:14},
    calc:{build:880,grant:130,capex:3,revG:3,floor:95,cap:175,tax:25,exit:9,lev:4,rd:8.5,amort:3,hold:18},
    map:{footer:GEO.gulf.footer}
  },

  /* ---------- 6 · CHINESE / STATE DEFENCE ESTATE (China · illustrative / state contrast) ---------- */
  china:{
    name:'Chinese state defence estate', geo:'China', continent:'China', cur:'¥', geoKey:'china',
    lede:'An illustrative Chinese <b>state defence-estate</b> arrangement, state-backed capital builds and maintains serviceperson accommodation and is remunerated through a long, contracted, availability-style government payment, at a low state cost of capital. (Illustrative.)',
    s1:'<p class="body">China provides serviceperson accommodation and supporting estate largely through <b>state-backed</b> arrangements, here modelled as an availability-style partnership: state or state-linked capital <b>finances, builds and maintains</b> the accommodation and provides the supporting services, while the <b>state defence administration</b> keeps the operational mission and remunerates the partner through a long, contracted <b>government payment</b> over the term.</p>'+
       '<p class="body">Modelled here as an <b>availability-style</b> arrangement, the partner takes <b>limited demand risk</b>, the payment is structured around keeping the accommodation available and the services delivered, indexed and government-backed, with adjustments for performance. The lever is a very <b>low state cost of capital</b>: a long, contracted, government-backed payment financed cheaply on a state-supported balance sheet compounds into a large, stable return. A new phase extends the estate. (As a state contrast, names and figures here are illustrative.)</p>',
    facts:[['State capital','Structure','state finance · state mission'],['Availability-style','Payment','contracted, government-backed'],['Limited demand risk','Revenue','availability-structured'],['Low CoC','Funding','state-supported'],['Long term','Concession','25-30 years'],['State','Owner','state-linked partner']],
    s2:'Watch the estate, uniform accommodation blocks behind a gated perimeter, blocks lit, the flag flying, a parade square. The <b style="color:#0c6b4f">state defence administration</b> pays the <b>contracted government payment</b> for keeping it available and the services delivered. The partner\'s money is the <b>charge on every unit kept available</b>, indexed and government-backed. Drag the units, the charge and the availability, a large contracted annuity at a low state cost of capital.',
    driverLab:'Charge / unit', availLab:'Availability', hrK:'Government payment', yrS:'units × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & estate'}, demandLabel:'AVAILABILITY',
    preset:'Load China estate',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment hold at the contracted level, modelled as an availability arrangement, the state pays for keeping the accommodation <b>available and the services delivered</b>. With a very low state cost of capital the contracted annuity values richly. Push the units and the absolute payment balloons, scale and a low cost of capital are the model.',
    s3:'The partner earns a <b>contracted government payment</b> for keeping the accommodation available and delivering the supporting services, indexed and government-backed, with performance adjustments. Modelled as an <b>availability arrangement</b>, demand risk is limited. The counterparty is the state, so the payment is secure and the cost of capital low. The income is a large, contracted government annuity, set by the units, the charge and availability.',
    mb:{tag:'Model B · state defence estate', title:'State-backed availability estate', body:'A state defence-estate arrangement in which state-linked capital builds, finances and maintains serviceperson accommodation and is paid a long, contracted, availability-style government payment by the state, limited demand risk, a low cost of capital, indexed and government-backed. A large, secure annuity. <b>This is an illustrative Chinese state defence estate</b>.'},
    s4a:'The partner carries <b>facilities management and lifecycle</b> across a large accommodation estate, supporting services plus building and plant renewal, sized into the government payment. With a state counterparty the margin is steady. The defining feature is the <b>contracted payment and the low cost of capital</b>, not the cost line.',
    wfNote:'Operating cost is the facilities management and lifecycle of a large accommodation estate, supporting services plus building and plant renewal. The payment is set to cover it at a contracted margin; the value sits in the indexed, government-backed payment and the very low state cost of capital, not the cost line.',
    s4b:'The capital is the <b>estate build</b>, financed by the state-linked partner on a state-supported balance sheet at a very low cost of capital. A public contribution or estate transfer may meet part of the cost, with the partner financing the balance and recovering it through the government payment. A long, contracted, indexed, government-backed annuity, cheap to finance and large in absolute terms.',
    stackH:'The capital · the estate build', splitL:'Who funds the build', splitR:'state',
    split:[['s1',30,'State contribution'],['s2',70,'State-linked finance']],
    finList:[['','Asset','defence accommodation estate'],['sub','Structure','state availability arrangement'],['','Revenue','contracted government payment'],['sub','Counterparty','state defence administration'],['','Demand risk','limited (availability-style)'],['rest','Owner','state-linked partner']],
    finNote:'A Chinese state defence estate is a <b>large, state-backed contracted annuity</b>: an indexed, government-backed payment for keeping the accommodation available, limited demand risk, a low cost of capital. The residual risk is FM and lifecycle delivery and the term and structure of the arrangement.',
    timeline:[['2010s','<b>State arrangements</b> provide serviceperson accommodation and estate.'],['Build','<b>State-linked capital</b> finances and builds accommodation.'],['Open','<b>Government payments</b> begin as the estate enters service.'],['Services','<b>Supporting services</b> delivered; the mission stays with the state.'],['Indexed','<b>Payment indexation</b> over the term.'],['Long-term','<b>Hand-back</b> of the estate at term end.']],
    calcNote:'A working model of a <b>Chinese state defence estate</b>, on an enterprise-value basis. Revenue is the contracted, government-backed availability-style payment; the floor binds when availability is high. A low cost of capital reflects a state-supported balance sheet. Figures are highly illustrative.',
    s6:'A state defence estate is a large, state-backed contracted annuity. What drives it:',
    breakers:['<b>Availability</b>, the payment is structured around keeping the accommodation available and services delivered.','<b>State counterparty</b>, the state keeps the cost of capital low and the payment secure.','<b>Cost of capital</b>, a very low state-supported rate is what makes the contracted annuity value richly.','<b>FM &amp; estate</b>, maintaining a large accommodation estate over decades is the operational job.'],
    src:'Figures from public reporting on state provision of serviceperson accommodation and estate. Given limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', host:'state defence administration', care:'defence accommodation',
      unitsDef:16000,unitsMin:6000,unitsMax:32000,unitsStep:500, chargeDef:11000,chargeMin:6000,chargeMax:22000,chargeStep:500,
      availDef:98,availMin:90,availMax:100,availStep:0.5, fmPerUnit:3400, fixedOM:22},
    calc:{build:1450,grant:260,capex:2.5,revG:3,floor:130,cap:240,tax:25,exit:10,lev:4,rd:4,amort:3,hold:16},
    map:{footer:GEO.china.footer}
  }
  };
  var ORDER=['allenby','mhpi','latam','dha','gulf','china'];

  /* ===================================================================
     DEFENCE ACCOMMODATION ESTATE RENDERER  (canvas, 720x520), top-down /
     elevation, daytime. A defence accommodation estate: rows of uniform
     accommodation blocks / barracks with lit windows (the estate "available" and
     occupied), behind a gated entrance with a flagpole and flag, a parade square,
     and a mess / HQ building with a perimeter. A defence-ministry / government icon
     pays a contracted, indexed availability charge per unit to the SPV; FM & estate
     cost drains out at a maintenance entrance. When availability is high the blocks
     are fully lit; if availability drops, some windows dim and a − DEDUCTION marker
     shows. A + NEW QUARTERS / + PHASE 2 marker appears if GEO.growing. Neutral and
     architectural, housing and estate, not weapons or operations.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  function shade(hex,f){ var c=hex.replace('#',''); if(c.length===3)c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    var r=Math.min(255,Math.round(parseInt(c.substr(0,2),16)*f)), gg=Math.min(255,Math.round(parseInt(c.substr(2,2),16)*f)), b=Math.min(255,Math.round(parseInt(c.substr(4,2),16)*f));
    return 'rgb('+r+','+gg+','+b+')'; }

  /* ---- estate geometry ---- */
  var GATE={x:120,y:250,w:74,h:200};            // gated entrance (left)
  var SQUARE={x:212,y:392,w:330,h:108};         // parade square (front)
  var MESS={x:212,y:250,w:330,h:50};            // mess / HQ building (rear)
  var FLAG={x:150,y:222};                        // flagpole base (at the gate)
  var FMENT={x:556,y:432,w:140,h:48};           // FM / estate entrance (right)
  var AUTH={x:556,y:150,w:140,h:96};            // defence-ministry / government icon (right)
  // accommodation blocks (rows of uniform barracks/housing), built per asset
  var BLOCKS=[], WIN=[];
  function layout(){
    BLOCKS=[]; WIN=[];
    var cols=4, rows=2, ox=212, oy=308, bw=72, bh=36, gx=14, gy=12;
    for(var r=0;r<rows;r++) for(var c=0;c<cols;c++){
      var bx=ox+c*(bw+gx), by=oy+r*(bh+gy);
      BLOCKS.push({x:bx,y:by,w:bw,h:bh});
      // window strip per block
      var wc=4, ww=(bw-2*8)/wc;
      for(var k=0;k<wc;k++){
        WIN.push({x:bx+8+k*ww+1.5, y:by+bh-13, w:ww-3, h:8, ph:((r*7+c*5+k*3)%10)});
      }
    }
  }

  /* ---- base map: estate ground + parade square + approach road ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e3e9e1'); g.addColorStop(1,'#d6ddce');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // landscaped grounds patch (left of the gate)
    ctx.fillStyle='rgba(120,160,120,0.10)'; rr(20,250,92,200,16); ctx.fill();
    // estate forecourt / hardstanding
    ctx.fillStyle='rgba(150,158,150,0.16)'; rr(200,242,W-232,272,14); ctx.fill();
    // approach road up to the gate
    ctx.strokeStyle='rgba(120,128,120,0.5)'; ctx.lineWidth=14; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(40,H-20); ctx.quadraticCurveTo(110,470,GATE.x+GATE.w/2,GATE.y+GATE.h-6); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1; ctx.setLineDash([8,10]); ctx.lineDashOffset=-(T*1.0);
    ctx.beginPath(); ctx.moveTo(40,H-20); ctx.quadraticCurveTo(110,470,GATE.x+GATE.w/2,GATE.y+GATE.h-6); ctx.stroke(); ctx.setLineDash([]);
    ctx.lineCap='butt';
    // perimeter line around the estate
    ctx.strokeStyle='rgba(110,120,110,0.45)'; ctx.lineWidth=1.4; ctx.setLineDash([5,5]);
    rr(202,244,W-236,268,12); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- a window: lit (available) or dim (deduction) ---- */
  function win(w,lit){
    if(lit){
      var g=ctx.createLinearGradient(w.x,w.y,w.x,w.y+w.h); g.addColorStop(0,'rgba(255,228,160,0.95)'); g.addColorStop(1,'rgba(255,205,120,0.85)');
      ctx.fillStyle=g; rr(w.x,w.y,w.w,w.h,2); ctx.fill();
      if(Math.sin(T*0.06+w.ph)>0.5) glow(w.x+w.w/2,w.y+w.h/2,6,'rgba(255,210,120,0.30)');
    } else {
      ctx.fillStyle='rgba(96,108,104,0.55)'; rr(w.x,w.y,w.w,w.h,2); ctx.fill();
    }
    ctx.strokeStyle='rgba(60,72,66,0.25)'; ctx.lineWidth=0.6; ctx.stroke();
  }

  /* ---- a flag on a flagpole (at the gate) ---- */
  function flag(accent){
    var fx=FLAG.x, fy=FLAG.y;
    // pole
    ctx.strokeStyle='rgba(90,98,90,0.9)'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(fx,fy); ctx.lineTo(fx,fy+58); ctx.stroke();
    ctx.fillStyle='rgba(90,98,90,0.95)'; ctx.beginPath(); ctx.arc(fx,fy,2.4,0,Math.PI*2); ctx.fill();
    // a gently waving flag (illustrative, neutral)
    var wv=Math.sin(T*0.07)*3;
    ctx.fillStyle=accent; ctx.beginPath();
    ctx.moveTo(fx+1,fy+2);
    ctx.lineTo(fx+34,fy+4+wv);
    ctx.lineTo(fx+34,fy+18+wv);
    ctx.lineTo(fx+1,fy+16);
    ctx.closePath(); ctx.fill();
  }

  /* ---- mess / HQ building (rear) ---- */
  function mess(accent){
    var m=MESS;
    ctx.fillStyle='rgba(20,34,28,0.12)'; rr(m.x+5,m.y+m.h-3,m.w,10,5); ctx.fill();
    var g=ctx.createLinearGradient(m.x,m.y,m.x,m.y+m.h); g.addColorStop(0,'#f3f5f2'); g.addColorStop(1,'#dfe4dd');
    ctx.fillStyle=g; rr(m.x,m.y,m.w,m.h,7); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle=accent; rr(m.x,m.y,m.w,16,7); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='700 10px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('MESS / HQ',m.x+12,m.y+12);
  }

  /* ---- a single accommodation block (barracks / housing) ---- */
  function accomBlock(b,accent){
    ctx.fillStyle='rgba(20,34,28,0.13)'; rr(b.x+4,b.y+b.h-3,b.w,8,4); ctx.fill();
    var g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h); g.addColorStop(0,'#f1f4f0'); g.addColorStop(1,'#dde3db');
    ctx.fillStyle=g; rr(b.x,b.y,b.w,b.h,5); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // pitched-roof ridge line (architectural)
    ctx.strokeStyle='rgba(120,130,120,0.4)'; ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(b.x+3,b.y+9); ctx.lineTo(b.x+b.w-3,b.y+9); ctx.stroke();
    // accent eaves band
    ctx.fillStyle=accent; ctx.globalAlpha=0.85; rr(b.x,b.y,b.w,4,2); ctx.fill(); ctx.globalAlpha=1;
  }

  /* ---- the accommodation estate (rows of blocks + lit windows) ---- */
  function estate(accent,litFrac){
    for(var i=0;i<BLOCKS.length;i++) accomBlock(BLOCKS[i],accent);
    var nLit=Math.round(WIN.length*litFrac);
    for(var k=0;k<WIN.length;k++) win(WIN[k], k<nLit);
  }

  /* ---- parade square (front) ---- */
  function paradeSquare(){
    var s=SQUARE;
    ctx.fillStyle='rgba(150,156,148,0.20)'; rr(s.x,s.y,s.w,s.h,8); ctx.fill();
    ctx.strokeStyle='rgba(120,128,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // grid markings
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1;
    for(var gx=s.x+30; gx<s.x+s.w; gx+=44){ ctx.beginPath(); ctx.moveTo(gx,s.y+8); ctx.lineTo(gx,s.y+s.h-8); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(s.x+8,s.y+s.h/2); ctx.lineTo(s.x+s.w-8,s.y+s.h/2); ctx.stroke();
    ctx.fillStyle='rgba(90,98,90,0.7)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('PARADE SQUARE',s.x+8,s.y+s.h-8);
  }

  /* ---- gated entrance (left) ---- */
  function gate(accent){
    var gt=GATE;
    ctx.fillStyle='rgba(176,125,36,0.08)'; rr(gt.x,gt.y,gt.w,gt.h,8); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.5)'; ctx.lineWidth=1.2; ctx.stroke();
    // two gatehouse posts
    ctx.fillStyle='#e7ebe5'; rr(gt.x+8,gt.y+gt.h/2-22,12,44,3); ctx.fill();
    rr(gt.x+gt.w-20,gt.y+gt.h/2-22,12,44,3); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.strokeRect(gt.x+8,gt.y+gt.h/2-22,12,44); ctx.strokeRect(gt.x+gt.w-20,gt.y+gt.h/2-22,12,44);
    // barrier bar
    ctx.strokeStyle=accent; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(gt.x+20,gt.y+gt.h/2); ctx.lineTo(gt.x+gt.w-20,gt.y+gt.h/2); ctx.stroke();
    ctx.fillStyle='rgba(90,98,90,0.75)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('GATE',gt.x+gt.w/2,gt.y+gt.h-10);
  }

  /* ---- a maintenance / estate FM van ---- */
  function fmvan(x,y){
    ctx.fillStyle='rgba(20,34,28,0.16)'; rr(x+1,y+11,34,4,2); ctx.fill();
    ctx.fillStyle='#d8c47a'; rr(x,y,34,13,3); ctx.fill();
    ctx.strokeStyle='rgba(120,110,80,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
    ctx.fillStyle='rgba(60,72,66,0.7)'; rr(x+24,y+2,7,5,1); ctx.fill();
    ctx.fillStyle='rgba(90,80,55,0.8)'; ctx.font='700 6px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('FM',x+13,y+9);
  }
  /* ---- FM / estate entrance ---- */
  function fmentrance(){
    var f=FMENT;
    ctx.fillStyle='rgba(176,125,36,0.10)'; rr(f.x,f.y,f.w,f.h,7); ctx.fill();
    ctx.strokeStyle='rgba(176,125,36,0.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#9a7320'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('FM / ESTATE',f.x+8,f.y+13);
    fmvan(f.x+f.w-44, f.y+26);
  }

  /* ---- defence-ministry / government (offtaker) icon ---- */
  function authority(label,accent){
    var a=AUTH;
    ctx.fillStyle='rgba(20,34,28,0.10)'; rr(a.x+4,a.y+a.h-4,a.w,10,5); ctx.fill();
    var g=ctx.createLinearGradient(a.x,a.y,a.x,a.y+a.h); g.addColorStop(0,'#fbfcfb'); g.addColorStop(1,'#eef1ee');
    ctx.fillStyle=g; rr(a.x,a.y,a.w,a.h,8); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // a small civic-building pediment + columns (government)
    ctx.fillStyle=accent; ctx.beginPath(); ctx.moveTo(a.x+a.w/2-30,a.y+30); ctx.lineTo(a.x+a.w/2,a.y+16); ctx.lineTo(a.x+a.w/2+30,a.y+30); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(120,130,120,0.55)';
    for(var cx=a.x+a.w/2-26;cx<=a.x+a.w/2+22;cx+=12){ rr(cx,a.y+30,5,20,1); ctx.fill(); }
    ctx.fillStyle='rgba(70,82,76,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('DEFENCE MINISTRY',a.x+a.w/2,a.y+62);
    ctx.fillStyle=accent; ctx.font='700 8px Inter,sans-serif'; ctx.fillText(label,a.x+a.w/2,a.y+76);
    ctx.fillStyle='rgba(90,102,96,0.85)'; ctx.font='600 7px Inter,sans-serif'; ctx.fillText('pays availability charge',a.x+a.w/2,a.y+88);
  }

  /* ---- value-flow orbs (shared overlay) ---- */
  function spawnCoin(x,y,kind,dir){ if(coins.length<48) coins.push({x:x+rnd(-4,4),y:y, vy:(dir>0?(0.35+Math.random()*0.3):-(0.5+Math.random()*0.4)), life:1, kind:kind, dir:(dir>0?1:-1)}); }
  function coinCol(k){ return k==='ret'?'#0c8a57':(k==='rec'?'#c0902f':'#bc4733'); }
  function drawCoins(){
    for(var i=coins.length-1;i>=0;i--){ var c=coins[i];
      if(_anim){ c.y+=c.vy; if(c.dir>0) c.vy+=0.015; else c.vy*=0.99; c.life-=0.018; }
      if(c.life<=0){ coins.splice(i,1); continue; }
      var a=Math.max(0,Math.min(1,c.life)), col=coinCol(c.kind);
      ctx.save(); ctx.globalAlpha=a;
      ctx.fillStyle='rgba(20,30,25,0.18)'; ctx.beginPath(); ctx.arc(c.x+0.6,c.y+0.8,3.3,0,Math.PI*2); ctx.fill();
      var g=ctx.createRadialGradient(c.x-1,c.y-1.2,0,c.x,c.y,3.6); g.addColorStop(0,'#ffffff'); g.addColorStop(0.35,col); g.addColorStop(1,col);
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,3.2,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.95)'; ctx.lineWidth=0.9; ctx.beginPath();
      ctx.moveTo(c.x-1.5,c.y); ctx.lineTo(c.x+1.5,c.y); if(c.dir<0){ ctx.moveTo(c.x,c.y-1.5); ctx.lineTo(c.x,c.y+1.5); } ctx.stroke();
      ctx.restore(); }
  }
  /* ---- live P&L ledger ---- */
  function drawLedger(rev,eb,opex){
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ revenue',b:'+ income',c:'− opex'};
    ctx.save();
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,11); ctx.fill(); ctx.stroke();
    ctx.textAlign='left'; ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.fillText('LIVE ECONOMICS · PER YEAR',px+13,py+15);
    function dot(x,c){ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,py+27,2.6,0,Math.PI*2); ctx.fill(); }
    dot(px+15,'#0c8a57'); dot(px+92,'#c0902f'); dot(px+183,'#bc4733');
    ctx.fillStyle='rgba(70,82,76,0.85)'; ctx.font='600 7.5px Inter,sans-serif';
    ctx.fillText(L.a,px+21,py+30); ctx.fillText(L.b,px+98,py+30); ctx.fillText(L.c,px+189,py+30);
    var bx=px+13, bw=pw-26, rows=[['Revenue','+'+money(rev),'#0c6b4f',1],['Operating cost','−'+money(opex),'#bc4733',Math.max(0.02,oR)],['EBITDA',money(eb)+'  ·  '+Math.round(m*100)+'%','#0a5a42',Math.max(0.02,m)]];
    var ry=py+42;
    rows.forEach(function(r){ ctx.fillStyle='rgba(60,72,66,0.95)'; ctx.font='600 9px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(r[0],bx,ry+7);
      ctx.fillStyle=r[2]; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(r[1],px+pw-13,ry+7);
      ctx.fillStyle='rgba(20,30,25,0.07)'; rr(bx,ry+11,bw,3,1.5); ctx.fill(); ctx.fillStyle=r[2]; rr(bx,ry+11,bw*Math.min(1,r[3]),3,1.5); ctx.fill();
      ry+=20; });
    ctx.restore();
  }
  /* ---- live availability sparkline ---- */
  function drawDemand(occ){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'AVAILABILITY';
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(label,px+11,py+14);
    ctx.fillStyle='rgba(47,125,84,0.95)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText((Math.round(occ*1000)/10)+'%',px+pw-11,py+14);
    var gx=px+11, gw=pw-22, gy=py+ph-9, gh=18;
    ctx.strokeStyle='rgba(47,125,84,0.35)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+gw,gy); ctx.stroke();
    ctx.strokeStyle='#2f7d54'; ctx.lineWidth=1.6; ctx.beginPath();
    for(var i=0;i<demHist.length;i++){ var x=gx+gw*i/72, y=gy-demHist[i]*gh; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke();
    if(demHist.length){ var lx=gx+gw*(demHist.length-1)/72, ly=gy-demHist[demHist.length-1]*gh; glow(lx,ly,5,'rgba(47,125,84,0.5)'); ctx.fillStyle='#2f7d54'; ctx.beginPath(); ctx.arc(lx,ly,2.2,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }

  /* ===================================================================
     FRAME
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var G=GEO[A.geoKey], E=A.econ;
    var units=parseFloat(sCap.value), charge=parseFloat(sSpread.value), avail=parseFloat(sAvail.value)/100;
    var accent=G.accent||'#2f5fb0';

    ctx.clearRect(0,0,W,H);
    drawMap();

    // defence ministry (offtaker) + the estate
    authority(G.authority||'DEFENCE MINISTRY', accent);
    gate(accent);
    flag(accent);
    mess(accent);
    estate(accent, Math.max(0,Math.min(1,avail)));   // windows lit up to availability
    paradeSquare();
    fmentrance();

    // ---- economics (the availability PPP: a contracted government accommodation annuity, NO demand risk) ----
    var grossCharge=units*charge;
    var revenue=grossCharge*avail;            // deductions for unavailability/performance
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));      // floor = contracted minimum availability charge
    var opex= units*(E.fmPerUnit||0) + (E.fixedOM||0)*1e6;  // FM, maintenance, lifecycle, estate management
    var ebitda=revenue-opex;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // waterfall opex rows: FM & estate
    var c_fm=opex*0.38, c_maint=opex*0.30, c_life=opex*0.20, c_admin=opex*0.12;
    // share of "+cash" that is the contracted floor vs the indexation slice
    var floorBinds = floor>0 && revenue<=floor+1;
    var contractShare = floorBinds ? Math.min(0.5, floor/Math.max(1,revenue)) : 0.20;

    // deduction marker if availability is below the contracted threshold
    var deduct = avail < 0.97;

    // money-flow: +cash (availability charge) flows from the ministry to the SPV;
    //   amber = indexation slice; −cash (FM & estate) drains at the FM entrance
    if(_anim){
      if(Math.random()<0.75){ var fx=AUTH.x+10, fy=AUTH.y+AUTH.h-6;
        coins.push({x:fx,y:fy, vy:-(0.2+Math.random()*0.2), life:1, kind:Math.random()<contractShare?'rec':'ret', dir:-1}); }
      var mx=FMENT.x+FMENT.w*0.5; if(Math.random()<Math.max(0.1,Math.min(0.6, opex/Math.max(1,revenue)))) spawnCoin(mx,FMENT.y+6,'cost',1);
      demHist.push(Math.max(0,Math.min(1,avail))); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,avail)));

    // labels: estate caption, deduction marker, expansion marker
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText((G.phase==='greenfield'?'GREENFIELD · ':'OPERATIONAL · ')+(G.model||'PPP')+' · '+(G.kind||'estate').toUpperCase()+' · AVAILABLE',MESS.x,MESS.y-8); ctx.restore();
    if(deduct){
      ctx.save(); ctx.fillStyle='rgba(190,71,51,0.92)'; rr(SQUARE.x+SQUARE.w-128,MESS.y-22,118,16,4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('− DEDUCTION · UNAVAILABLE',SQUARE.x+SQUARE.w-69,MESS.y-11); ctx.restore();
    }
    if(G.growing){
      var ex=SQUARE.x+330+6, ey=308, pulse=0.5+0.5*Math.sin(T*0.08);
      var exLabel=(G.kind==='housing')?'+ NEW QUARTERS':'+ PHASE 2';
      ctx.save(); ctx.globalAlpha=0.55+0.4*pulse;
      ctx.fillStyle='rgba(12,107,79,0.9)'; rr(ex,ey,16,86,4); ctx.fill();
      ctx.strokeStyle='rgba(12,107,79,0.55)'; ctx.setLineDash([4,4]); ctx.lineWidth=1.2; rr(ex,ey,16,86,4); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      ctx.save(); ctx.translate(ex+11,ey+44); ctx.rotate(Math.PI/2);
      ctx.fillStyle='rgba(12,107,79,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText(exLabel,0,0); ctx.restore();
    }

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(units)+' units',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',kfmt(units)+' units'); set('ixSpreadV',CUR+kfmt(charge)+'/unit'); set('ixAvailV',(Math.round(avail*1000)/10)+'%');
    set('ixDir',kfmt(units)+' units'); set('ixDirS',(G.model||'PPP')+' · '+E.care);
    set('ixMW',(Math.round(avail*1000)/10)+'% available'); set('ixMWs',(deduct?'below threshold · deductions':'at contract · no demand risk')+' · '+(E.host||'ministry'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['FM',c_fm],['Maintenance',c_maint],['Lifecycle',c_life],['Admin',c_admin]], ebitda);
    set('wfMargin', revenue>0?Math.round(ebitda/revenue*100)+'%':'—');
  }
  function stripTags(s){ return s.replace(/&amp;/g,'&'); }

  /* ---------------- EBITDA waterfall (SVG) ---------------- */
  function drawWaterfall(rev, costs, ebitda){
    var el=document.getElementById('ixWaterfall'); if(!el) return;
    var Wd=600,Hd=200, padB=34, padT=22, h=Hd-padB-padT, max=Math.max(rev,1);
    var bars=costs.length+2, slot=Wd/bars, bw=Math.min(70,slot*0.62);
    function bx(i){ return slot*i+(slot-bw)/2; }
    function y(v){ return padT+h-(v/max)*h; }
    var s='', run=rev, i=0;
    function lbl(cx,topY,txt,val,col){ return '<text x="'+cx+'" y="'+(topY-6)+'" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="'+col+'">'+val+'</text>'+
      '<text x="'+cx+'" y="'+(Hd-padB+13)+'" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#6a7570">'+txt+'</text>'; }
    s+='<rect x="'+bx(0).toFixed(1)+'" y="'+y(rev).toFixed(1)+'" width="'+bw+'" height="'+(h*rev/max).toFixed(1)+'" rx="3" fill="#0c6b4f" opacity="0.92"/>';
    s+=lbl(bx(0)+bw/2, y(rev), 'Availability charge', money(rev), '#15201d');
    i=1;
    costs.forEach(function(c){ var top=run, bot=run-c[1]; if(bot<0)bot=0;
      var yTop=y(top), yBot=y(bot);
      s+='<rect x="'+bx(i).toFixed(1)+'" y="'+yTop.toFixed(1)+'" width="'+bw+'" height="'+Math.max(2,(yBot-yTop)).toFixed(1)+'" rx="3" fill="#ef8166" opacity="0.9"/>';
      s+='<line x1="'+(bx(i-1)+bw).toFixed(1)+'" y1="'+yTop.toFixed(1)+'" x2="'+bx(i).toFixed(1)+'" y2="'+yTop.toFixed(1)+'" stroke="#c9d2da" stroke-width="1" stroke-dasharray="2 2"/>';
      s+=lbl(bx(i)+bw/2, yTop, c[0], '−'+money(c[1]), '#bc4733');
      run=bot; i++;
    });
    s+='<line x1="'+(bx(i-1)+bw).toFixed(1)+'" y1="'+y(run).toFixed(1)+'" x2="'+bx(i).toFixed(1)+'" y2="'+y(run).toFixed(1)+'" stroke="#c9d2da" stroke-width="1" stroke-dasharray="2 2"/>';
    s+='<rect x="'+bx(i).toFixed(1)+'" y="'+y(Math.max(0,ebitda)).toFixed(1)+'" width="'+bw+'" height="'+Math.max(2,h*Math.max(0,ebitda)/max).toFixed(1)+'" rx="3" fill="#0a5a42"/>';
    s+=lbl(bx(i)+bw/2, y(Math.max(0,ebitda)), 'EBITDA', money(ebitda), '#0a5a42');
    el.innerHTML=s;
  }

  /* ===================================================================
     DCF / LBO CALCULATOR
  =================================================================== */
  function gv(id){ var v=parseFloat(document.getElementById(id).value); return isFinite(v)?v:0; }
  function irr(cf){ var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=3,flo=f(lo),fhi=f(hi); if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<140;k++){ var mid=(lo+hi)/2,fm=f(mid); if(flo*fm<=0){hi=mid;}else{lo=mid;flo=fm;} } return (lo+hi)/2; }
  function pctTxt(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }

  function computeModel(){
    var rev0=baseRevYr, eb0=baseEbYr, invest=netCapexG;
    if(eb0<=0 || rev0<=0 || invest<=0 || eb0/rev0<0.05) return null;
    var gR=gv('iRevG')/100, capexP=gv('iCapex')/100, daP=0.045, tax=gv('iTax')/100;
    var xMul=gv('iExit'), N=Math.max(3,Math.min(50,Math.round(gv('iHold'))));
    var lev=gv('iLev'), rd=gv('iRd')/100, amort=gv('iAmort')/100;
    var debt0=Math.max(0,Math.min(lev*eb0, invest*0.9));
    var equity0=invest-debt0;
    var rows=[], uCF=[-invest], eCF=[-equity0];
    var debtBal=debt0, amortAmt=amort*debt0, cum=-invest, payback=null;
    for(var t=1;t<=N;t++){
      var rev=rev0*Math.pow(1+gR,t-1), eb=eb0*Math.pow(1+gR,t-1);
      var capex=capexP*rev, da=daP*rev, ebit=eb-da;
      var fcff=eb-tax*Math.max(0,ebit)-capex;
      var interest=rd*debtBal, princ=Math.min(amortAmt,debtBal);
      var ebt=ebit-interest, fcfe=eb-tax*Math.max(0,ebt)-capex-interest-princ;
      debtBal=Math.max(0,debtBal-princ);
      var uAdd=fcff, eAdd=fcfe;
      if(t===N){ var exitEV=xMul*eb; uAdd+=exitEV; eAdd+=(exitEV-debtBal); }
      if(payback===null){ cum+=fcff; if(cum>=0) payback=t; }
      uCF.push(uAdd); eCF.push(eAdd);
      rows.push({t:t,rev:rev,eb:eb,capex:capex,fcff:fcff,debt:debtBal,fcfe:fcfe});
    }
    var exitEVf=xMul*rows[N-1].eb;
    var distrib=eCF.slice(1).reduce(function(a,b){return a+b;},0);
    var moic=equity0>0?distrib/equity0:NaN;
    return {eb0:eb0,invest:invest,debt0:debt0,equity0:equity0,N:N,rows:rows,uCF:uCF,eCF:eCF,uIRR:irr(uCF),lIRR:irr(eCF),exitEV:exitEVf,moic:moic,payback:payback};
  }
  function renderModel(){
    var m=computeModel();
    if(!m){ ['oUIRR','oLIRR','oMOIC','oPB'].forEach(function(id){ set(id,'—'); });
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the charge is too thin to value, raise the units, the charge per unit or the availability.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build cost</span> <b>'+money(capexGrossG)+'</b></span>'+
      '<span><span class="lbl">Net of contribution</span> <b>'+money(netCapexG)+'</b></span>'+
      '<span><span class="lbl">Debt</span> <b>'+money(m.debt0)+'</b> ('+ltv+'% gearing)</span>'+
      '<span><span class="lbl">Equity in</span> <b>'+money(m.equity0)+'</b></span>'+
      '<span><span class="lbl">Exit EV</span> <b>'+money(m.exitEV)+'</b></span>';
    var maxAbs=Math.max.apply(null,m.eCF.map(Math.abs).concat([1])), step=m.N>14?3:(m.N>8?2:1);
    var ch='<div class="jaxis"></div>';
    m.eCF.forEach(function(cf,i){ var hh=Math.max(2,Math.abs(cf)/maxAbs*60);
      var cls=cf>=0?(i===m.N?'pos exit':'pos'):'neg';
      ch+='<div class="jcol"><div class="jbar '+cls+'" style="height:'+hh+'px" title="Year '+i+': '+money(cf)+'"></div><span class="jlbl">'+(i%step===0?i:'')+'</span></div>'; });
    var jc=document.getElementById('jchart'); if(jc) jc.innerHTML=ch;
    var ph=document.getElementById('ptHead'); if(ph) ph.innerHTML='<tr><th>Year</th><th>Revenue</th><th>EBITDA</th><th>Capex</th><th>Unlev. FCF</th><th>Net debt</th><th>Equity FCF</th></tr>';
    var pb=document.getElementById('ptBody'); if(pb) pb.innerHTML=m.rows.map(function(r){
      return '<tr><td>'+r.t+'</td><td>'+m1(r.rev)+'</td><td>'+m1(r.eb)+'</td><td>'+m1(r.capex)+'</td><td>'+m1(r.fcff)+'</td><td>'+m1(r.debt)+'</td><td>'+m1(r.fcfe)+'</td></tr>'; }).join('');
  }

  /* ===================================================================
     RENDER an asset into the page
  =================================================================== */
  var sCap=document.getElementById('ixCap'), sSpread=document.getElementById('ixSpread'), sAvail=document.getElementById('ixAvail'),
      iBuild=document.getElementById('iBuild'), iGrant=document.getElementById('iGrant'), iCapex=document.getElementById('iCapex'),
      iFloor=document.getElementById('iFloor'), iCap=document.getElementById('iCap');

  function render(key){
    A=ASSETS[key]; CUR=A.cur; coins=[]; demHist=[];
    set('ixAssetName',A.name); set('ixAssetGeo',A.geo); set('ixCont',A.continent);
    set('ixBarName',A.name);
    html('ixLede',A.lede);
    html('s1body',A.s1);
    html('ixFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    html('s2intro',A.s2);
    set('ixDriverLab',A.driverLab); set('ixAvailLab',A.availLab); set('ixHrK',A.hrK); set('ixYrS',A.yrS);
    set('ixPreset',A.preset); html('ixTry',A.try);
    var E=A.econ;
    sCap.min=E.unitsMin; sCap.max=E.unitsMax; sCap.step=E.unitsStep; sCap.value=E.unitsDef;
    sSpread.min=E.chargeMin; sSpread.max=E.chargeMax; sSpread.step=E.chargeStep; sSpread.value=E.chargeDef;
    sAvail.min=E.availMin; sAvail.max=E.availMax; sAvail.step=E.availStep; sAvail.value=E.availDef;
    html('s3intro',A.s3);
    set('mbTag',A.mb.tag); set('mbTitle',A.mb.title); html('mbBody',A.mb.body);
    html('s4intro1',A.s4a); html('wfNote',A.wfNote); html('s4intro2',A.s4b);
    set('finStackH',A.stackH); html('finSplitL',A.splitL); html('finSplitR',A.splitR);
    html('finSplit',A.split.map(function(s){ return '<div class="seg '+s[0]+'" style="width:'+s[1]+'%">'+s[2]+'</div>'; }).join(''));
    html('finList',A.finList.map(function(r){ return '<li'+(r[0]?' class="'+r[0]+'"':'')+'><span class="fl">'+r[1]+'</span><span class="fa">'+r[2]+'</span></li>'; }).join(''));
    html('finNote',A.finNote);
    html('finTimeline',A.timeline.map(function(t){ return '<li><span class="yr">'+t[0]+'</span><span class="ev">'+t[1]+'</span></li>'; }).join(''));
    html('calcNote',A.calcNote);
    var c=A.calc;
    iBuild.value=c.build; iGrant.value=c.grant; iCapex.value=c.capex;
    document.getElementById('iRevG').value=c.revG; iFloor.value=c.floor; iCap.value=c.cap;
    document.getElementById('iTax').value=c.tax; document.getElementById('iExit').value=c.exit;
    document.getElementById('iLev').value=c.lev; document.getElementById('iRd').value=c.rd;
    document.getElementById('iAmort').value=c.amort; document.getElementById('iHold').value=c.hold;
    set('uBuild',CUR+'m'); set('uGrant',CUR+'m'); set('uFloor',CUR+'m'); set('uCap',CUR+'m');
    html('s6intro',A.s6);
    html('breakers',A.breakers.map(function(b){ return '<li>'+b+'</li>'; }).join(''));
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is a contracted availability charge, an accommodation payment (units × charge per unit × availability), with no demand risk, reduced only by deductions for unavailability or performance, and the returns model is a simplified DCF in which a public contribution or existing-estate transfer offsets the build cost; not a forecast of any specific year, and not investment advice. This is about housing and estate availability, not weapons or operations.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.unitsDef; sSpread.value=E.chargeDef; sAvail.value=E.availDef; frame(); renderModel(); });
    (function loop(){ T+=1; _anim=true; frame(); _anim=false; requestAnimationFrame(loop); })();
  }
  ['iRevG','iTax','iExit','iHold','iLev','iRd','iAmort'].forEach(function(id){
    var e=document.getElementById(id); if(e) e.addEventListener('input',renderModel); });

  function revealMap(){
    var stage=document.querySelector('.ix-stage');
    if(!stage || !stage.getBoundingClientRect || !window.scrollTo) return;
    var bar=document.querySelector('.ix-bar');
    var barH=(bar&&bar.getBoundingClientRect)?bar.getBoundingClientRect().height:0;
    var vh=window.innerHeight||800, r=stage.getBoundingClientRect(), gap=barH+12;
    if(r.top>=gap-2 && r.top<=vh*0.5) return;
    var target=(window.pageYOffset||window.scrollY||0)+r.top-gap;
    window.scrollTo({top:Math.max(0,target),behavior:'smooth'});
  }
  var sel=document.getElementById('ixSelect');
  if(sel) sel.addEventListener('change',function(){ render(sel.value); revealMap(); });
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'allenby');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
