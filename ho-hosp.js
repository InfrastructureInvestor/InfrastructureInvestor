/* Hospitals (PPP / PFI) — data-driven worked examples.
   Six real hospital public-private partnerships, one template. Scene config from
   ho-geo.js (GEO), drawn as a top-down / elevation hospital campus in a 720x520
   daytime scene: a main hospital building with a rooftop H / helipad, lit wards
   and windows, an emergency / ambulance bay, and an FM / services entrance with a
   maintenance van. The interactive figures are illustrative: revenue is a
   contracted availability payment — the unitary charge — (beds × charge per bed ×
   availability), with NO demand risk, reduced only by deductions for unavailability
   or performance failures; the returns model is a simplified DCF in which a public
   capital contribution offsets the hospital build cost. */
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

  /* ---------- 1 · UK NHS PFI HOSPITAL (Europe · the original unitary-charge PFI) ---------- */
  nhs:{
    name:'UK NHS PFI hospital', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'nhs',
    lede:'The original <b>PFI</b> — a private consortium designed, built, financed and now operates an NHS hospital, and the NHS trust pays a single, inflation-indexed <b>unitary charge</b> for keeping the building available, with <b>no demand risk</b> whatsoever.',
    s1:'<p class="body">In the late 1990s the UK funded a wave of new hospitals through the <b>Private Finance Initiative (PFI)</b>. A private consortium — a special-purpose vehicle (SPV) — would <b>design, build, finance and maintain</b> a hospital, and the NHS trust would pay a single, contracted <b>unitary charge</b> over a 25-30 year concession. The charge covers the capital, the financing, the lifecycle (hard FM) and the facilities management (soft FM) in one indexed payment.</p>'+
       '<p class="body">The economics are a <b>contracted government annuity</b>. Revenue does <b>not</b> depend on how many patients are treated — clinical services stay with the NHS — it is an <b>availability payment</b>, paid in full so long as the building is available and performing, and reduced only by <b>deductions</b> for unavailability or performance failures. That long, government-backed, inflation-linked, demand-risk-free cash flow is the canonical core-infrastructure asset, and most UK PFI hospitals now trade in the <b>secondary market</b> at thin, stable yields.</p>',
    facts:[['PFI','Structure','design·build·finance·maintain'],['Unitary charge','Revenue','single indexed payment'],['No demand risk','Payment','availability, not patients'],['25-30yr','Concession','long government-backed'],['Deductions','Risk','unavailability / performance'],['Secondary','Market','traded at thin yields']],
    s2:'Watch the campus. The hospital is <b>available</b> — wards lit, ambulances at A&E, the helipad live — and the NHS trust pays the <b style="color:#0c6b4f">unitary charge</b> for keeping it so. The SPV\'s money is the <b>availability payment on every bed kept available</b>, indexed each year, not the number of patients treated. The real cost draining out is <b>facilities management and lifecycle</b>. Drag the beds, the charge per bed and the availability — and watch deductions bite if availability falls.',
    driverLab:'Charge / bed', availLab:'Availability', hrK:'Unitary charge', yrS:'beds × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & lifecycle'}, demandLabel:'AVAILABILITY',
    preset:'Load NHS PFI',
    try:'<b>Try this:</b> drop the <b>availability</b> a few points and watch the unitary charge fall through <b>deductions</b> — a PFI is paid for keeping the hospital available and performing, not for treating patients. Then remember the trick: there is <b>no demand risk</b> at all. A building delivered once earns an <b>indexed availability payment for decades</b>, which is exactly why these hospitals trade in the secondary market at thin, stable yields.',
    s3:'The trust pays a <b>unitary charge per year</b> for the whole concession, indexed to inflation, covering capital, financing, hard FM (lifecycle) and soft FM. It is an <b>availability payment</b>: paid in full so long as the hospital is available and performing, reduced only by <b>deductions</b> for unavailable areas or performance failures. There is <b>no demand risk</b> — clinical activity is the NHS\'s. The return is the spread between a long, indexed, government-backed payment and the cost of building and running the asset.',
    mb:{tag:'Model B · NHS PFI', title:'The original unitary-charge PFI', body:'A private SPV designs, builds, finances and maintains an NHS hospital, and the trust pays a single, indexed unitary charge over 25-30 years for keeping it available — no demand risk, deductions for unavailability, FM and lifecycle as the real cost. The canonical contracted government annuity. <b>This is the UK NHS PFI</b>, now traded in the secondary market.'},
    s4a:'A PFI hospital carries a real cost: <b>facilities management (soft FM)</b> — cleaning, catering, security, portering — and <b>lifecycle (hard FM)</b> — replacing roofs, plant, fabric over the concession. These are sized into the charge, so the margin is moderate, not enormous. The defining number is not the cost line but the <b>contracted, indexed unitary charge and the availability</b> behind it.',
    wfNote:'Operating cost is the facilities management (soft FM — cleaning, catering, security) and the lifecycle / hard-FM provision that keeps the building and plant available over decades. It is a real, recurring cost sized into the unitary charge, so the margin is moderate; the value is the long, indexed, government-backed payment.',
    s4b:'The capital is the <b>hospital itself</b> — a capital-intensive building funded through high-leverage project finance. A <b>public capital contribution</b> may meet part of the cost, with the SPV financing the bulk and recovering it through the unitary charge. That is the model: a large upfront build turned into a long, contracted, indexed, demand-risk-free annuity backed by an NHS trust.',
    stackH:'The capital · the hospital build', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',10,'Public contribution'],['s2',90,'SPV project finance']],
    finList:[['','Asset','NHS hospital (DBFM)'],['sub','Structure','PFI unitary charge'],['','Revenue','availability payment'],['sub','Indexation','inflation-linked'],['','Demand risk','none'],['rest','Owner','infra-fund SPV']],
    finNote:'An NHS PFI is the <b>canonical contracted government annuity</b>: an indexed availability payment over a long concession, no demand risk, an NHS offtaker. FM and lifecycle are real, so the margin is moderate; the value sits in the contracted, government-backed payment and the price paid in the secondary market.',
    timeline:[['1992','<b>PFI launched</b> — private finance for public assets.'],['1997-2007','<b>Hospital wave</b> — most new NHS hospitals built under PFI.'],['2000s','<b>Operational phase</b> — unitary charges paid, FM delivered.'],['2010s','<b>Secondary market</b> — equity trades to infra funds at thin yields.'],['2018','<b>PFI ended</b> for new projects; existing deals run on.'],['Ongoing','<b>Hand-back</b> of the hospital at concession end.']],
    calcNote:'A working model of a <b>NHS PFI hospital</b>. The build is the capital cost; a public contribution offsets part of it, so net capital is most of the build, geared high on project finance. Revenue is the indexed unitary charge over a long hold; the exit multiple reflects a long, contracted, government-backed annuity.',
    s6:'A NHS PFI is the contracted hospital annuity. What moves the return:',
    breakers:['<b>Availability</b> — the unitary charge is paid for keeping the hospital available; deductions bite for unavailability.','<b>Indexation</b> — the inflation-linked charge protects the real return over a long concession.','<b>FM &amp; lifecycle</b> — soft and hard FM are the real, recurring cost that sets the margin.','<b>Secondary-market price</b> — what the equity is bought and sold for sets the realised return.'],
    src:'Figures from public sources on the UK <a href="https://www.nao.org.uk/" target="_blank" rel="noopener">PFI hospital programme</a> and the National Audit Office reviews of PF1/PF2. The figures are approximate and illustrative.',
    econ:{cur:'£', host:'NHS trust', care:'acute hospital',
      bedDef:600,bedMin:200,bedMax:1200,bedStep:20, chargeDef:120000,chargeMin:60000,chargeMax:240000,chargeStep:5000,
      availDef:98.5,availMin:90,availMax:100,availStep:0.5, fmPerBed:46000, fixedOM:9},
    calc:{build:490,grant:50,capex:3,revG:2.5,floor:60,cap:110,tax:25,exit:12,lev:4,rd:5,amort:3,hold:18},
    map:{footer:GEO.nhs.footer}
  },

  /* ---------- 2 · HUMBER RIVER HOSPITAL (North America · Canadian P3 / DBFM) ---------- */
  humber:{
    name:'Humber River Hospital', geo:'Toronto, Canada', continent:'North America', cur:'C$', geoKey:'humber',
    lede:'A Canadian <b>P3</b> — North America\'s first fully digital hospital, delivered design-build-finance-maintain, with Infrastructure Ontario paying a contracted, indexed <b>availability payment</b> for keeping it available.',
    s1:'<p class="body"><b>Humber River Hospital</b> in Toronto is a flagship Canadian <b>public-private partnership (P3)</b> — promoted as North America\'s first fully <b>digital hospital</b>. A private consortium delivered it on a <b>design-build-finance-maintain (DBFM)</b> basis, and the public authority, <b>Infrastructure Ontario</b>, pays a contracted, inflation-indexed <b>availability payment</b> over a long concession for keeping the facility available and maintained.</p>'+
       '<p class="body">The Canadian P3 model is the availability PPP at its most disciplined: the consortium takes <b>no demand risk</b> — clinical operations are the hospital corporation\'s — and is paid for <b>availability and performance</b>, with <b>deductions</b> for unavailable space or service failures. Backed by an <b>investment-grade</b> provincial offtaker and denominated in Canadian dollars, it is a low-risk, fully contracted, indexed cash flow — the kind of asset that anchors a core infrastructure portfolio.</p>',
    facts:[['P3 / DBFM','Structure','design·build·finance·maintain'],['Digital hospital','Asset','first fully digital in N.A.'],['Availability','Payment','contracted, indexed'],['No demand risk','Revenue','availability, not patients'],['Investment-grade','Offtaker','province of Ontario'],['Long concession','Term','25-30 years']],
    s2:'Watch the campus — a modern digital hospital, wards lit, ambulances at emergency, the helipad live. <b>Infrastructure Ontario</b> pays the <b style="color:#0c6b4f">availability payment</b> for keeping it available and maintained. The consortium\'s money is the <b>contracted payment on every bed kept available</b>, indexed, not the patients treated. The cost draining out is <b>facilities management and lifecycle</b>. Drag the beds, the charge and the availability — a core, government-backed annuity.',
    driverLab:'Charge / bed', availLab:'Availability', hrK:'Availability payment', yrS:'beds × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & lifecycle'}, demandLabel:'AVAILABILITY',
    preset:'Load Humber River',
    try:'<b>Try this:</b> raise the <b>availability</b> toward 100% and watch the payment hold at its contracted level — a Canadian P3 pays for keeping the hospital <b>available and performing</b>, not for activity. With an investment-grade provincial offtaker the discount rate is low and gearing high: this is what a clean, core, contracted infrastructure cash flow looks like. Drop availability and deductions bite.',
    s3:'The consortium earns a <b>contracted availability payment</b> for keeping the digital hospital available and maintained to standard, indexed to inflation, with <b>deductions</b> for unavailable space or performance failures. There is <b>no demand risk</b> — clinical operations are the hospital corporation\'s. So the income is a clean, fully contracted government annuity backed by an <b>investment-grade</b> provincial offtaker, set by the beds, the charge and availability. Low risk, long term, indexed.',
    mb:{tag:'Model B · Canadian P3', title:'Government-backed availability hospital', body:'A DBFM P3 in which a consortium designs, builds, finances and maintains a digital hospital and Infrastructure Ontario pays a contracted, indexed availability payment for keeping it available — no demand risk, an investment-grade offtaker, deductions for unavailability. The core-infrastructure annuity. <b>This is Humber River Hospital</b>.'},
    s4a:'The consortium carries <b>full facilities management and lifecycle</b> over the term — building maintenance, plant renewal, soft FM — sized so the availability payment covers it at a contracted margin. Because the offtaker is investment-grade and the payment locked, the margin is steady. The defining feature is not the cost line but the <b>contracted, indexed payment</b> and the low discount rate a provincial offtaker permits.',
    wfNote:'Operating cost is the through-life facilities management and lifecycle of a complex digital hospital — soft FM plus hard-FM plant and fabric renewal — sized against a contracted payment. With deductions for unavailability, keeping the building available is the operational job; the value sits in the indexed, government-backed payment.',
    s4b:'The capital is the <b>hospital and its digital systems</b>, financed by the consortium under DBFM and recovered over the long term. A portion may be publicly funded, but the consortium funds the bulk on high-leverage project finance and recovers it through the availability payment. Backed by an investment-grade offtaker, the cash flow is contracted and indexed, so it gears well — a low-risk, long-life government annuity.',
    stackH:'The capital · the hospital build', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',12,'Public contribution'],['s2',88,'Consortium project finance']],
    finList:[['','Asset','digital hospital (DBFM)'],['sub','Structure','Canadian P3'],['','Revenue','availability payment'],['sub','Offtaker','province of Ontario'],['','Demand risk','none'],['rest','Owner','infra-backed consortium']],
    finNote:'A Canadian P3 is the <b>core-infrastructure hospital annuity</b>: an indexed availability payment over a long concession, no demand risk, an investment-grade provincial offtaker. It gears well and prices tight; the residual risk is FM and lifecycle delivery and deductions.',
    timeline:[['2010','<b>Project agreement</b> signed for the new digital hospital.'],['2011','<b>Financial close</b> — DBFM P3 with a private consortium.'],['2015','<b>Hospital opens</b> — first fully digital hospital in North America.'],['Term','<b>Availability payments</b> over the long concession.'],['Indexed','<b>Payment indexation</b> tracks inflation.'],['Long-term','<b>Hand-back</b> of the facility at term end.']],
    calcNote:'A working model of a <b>Canadian P3 hospital</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high, so revenue is flat. A low cost of debt and high gearing reflect an investment-grade provincial offtaker.',
    s6:'Humber River is a core, government-backed hospital annuity. What drives it:',
    breakers:['<b>Availability</b> — the payment is for keeping the hospital available; deductions bite for unavailability.','<b>Provincial offtaker</b> — an investment-grade counterparty keeps the discount rate low and gearing high.','<b>Indexation</b> — the inflation-linked payment protects the real return over a long term.','<b>FM &amp; lifecycle delivery</b> — maintaining a complex digital hospital over decades is the operational risk.'],
    src:'Figures from public sources on the <a href="https://www.infrastructureontario.ca/" target="_blank" rel="noopener">Infrastructure Ontario</a> P3 programme and Humber River Hospital. The figures are approximate and illustrative.',
    econ:{cur:'C$', host:'Infrastructure Ontario', care:'digital hospital',
      bedDef:660,bedMin:250,bedMax:1100,bedStep:20, chargeDef:150000,chargeMin:80000,chargeMax:280000,chargeStep:5000,
      availDef:99,availMin:90,availMax:100,availStep:0.5, fmPerBed:58000, fixedOM:10},
    calc:{build:760,grant:80,capex:3,revG:2,floor:85,cap:150,tax:26,exit:11,lev:4,rd:5,amort:3,hold:18},
    map:{footer:GEO.humber.footer}
  },

  /* ---------- 3 · CHILEAN HOSPITAL CONCESSION (South America · LatAm availability concession) ---------- */
  chile:{
    name:'Chilean hospital concession', geo:'Chile', continent:'South America', cur:'US$', geoKey:'chile',
    lede:'A Latin-American <b>availability concession</b> — a private concessionaire builds and maintains a public hospital, and the health ministry pays a contracted, indexed availability payment, with no demand risk but emerging-market rates.',
    s1:'<p class="body">Chile has used <b>concessions</b> to deliver and maintain public hospitals: a private concessionaire <b>builds, finances and maintains</b> the facility (and provides "<b>bata blanca</b>" non-clinical services — the soft and hard FM around the medical core), while the <b>Ministerio de Salud</b> keeps clinical services public. The concessionaire is remunerated through a contracted, inflation-indexed <b>availability payment</b> over a long concession.</p>'+
       '<p class="body">This is the availability PPP in <b>emerging-market</b> form. The concessionaire takes <b>no demand risk</b> — patients are the state\'s — and earns a <b>contracted payment</b> for keeping the hospital available and the FM delivered, with <b>deductions</b> for failures. The income is highly contracted, but it is priced against a <b>higher discount rate</b> than a developed-market PPP, reflecting sovereign risk and a part-dollar, part-peso cash mix. A new wing or phase can extend the concession. (Figures here are illustrative.)</p>',
    facts:[['Concession','Structure','build·finance·maintain'],['Bata blanca','Services','non-clinical FM bundled'],['Availability','Payment','contracted, indexed'],['No demand risk','Revenue','patients stay public'],['US$ / CLP','Currency','part-dollar, part-peso'],['EM rates','Pricing','higher discount rate']],
    s2:'Watch the campus — a new public hospital, wards lit, an ambulance at emergency, the FM entrance busy with a maintenance van. The <b>health ministry</b> pays the <b style="color:#0c6b4f">availability payment</b> for keeping it available and the FM delivered. The concessionaire\'s money is the <b>contracted payment on every bed kept available</b>, indexed, not the patients treated. Drag the beds, the charge and the availability — a contracted annuity at an emerging-market discount rate.',
    driverLab:'Charge / bed', availLab:'Availability', hrK:'Availability payment', yrS:'beds × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & lifecycle'}, demandLabel:'AVAILABILITY',
    preset:'Load Chile concession',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment hold flat at the contracted level — a hospital concession pays for keeping the facility <b>available</b>, not for activity, so above the threshold the revenue is contracted. Then push the cost of debt: a strong contracted number nets down once discounted like an emerging-market concession. The contract is solid; the debate is the discount rate.',
    s3:'The concessionaire earns a <b>contracted availability payment</b> for keeping the hospital available and delivering the non-clinical FM ("bata blanca"), indexed to inflation, with <b>deductions</b> for failures. There is <b>no demand risk</b> — patients are the state\'s. So the income is a fully contracted government annuity, set by the beds, the charge and availability. The investor question is less the contract than the <b>discount rate</b> — Chilean sovereign risk and the dollar-peso mix.',
    mb:{tag:'Model B · hospital concession', title:'Emerging-market availability hospital', body:'A concession in which a private party builds, finances and maintains a public hospital and provides non-clinical FM, paid a contracted, indexed availability payment by the health ministry — no demand risk, deductions for failures. A fully contracted annuity priced against emerging-market rates. <b>This is a Chilean hospital concession</b>.'},
    s4a:'The concessionaire carries <b>full facilities management and lifecycle</b> — the "bata blanca" non-clinical services plus building and plant renewal — sized into the availability payment. Margins are healthy because the payment is set to cover it, but the swing factor is not the cost line — it is the <b>contracted payment and the discount rate</b> on an emerging-market concession.',
    wfNote:'Operating cost is the non-clinical FM ("bata blanca") plus the lifecycle renewal of building and plant — real, because deductions penalise failures. The payment is set to cover it at a contracted margin; the value driver is the indexed payment and the emerging-market discount rate.',
    s4b:'The capital is the <b>hospital build</b>, financed under the concession on high leverage. A <b>public contribution</b> typically funds part of the capital, with the concessionaire financing the balance and recovering it through the availability payment. Modelled on an enterprise-value basis, it is a contracted, indexed annuity carried against <b>emerging-market</b> rates — a new wing or phase can extend it.',
    stackH:'The capital · the hospital build', splitL:'Who funds the build', splitR:'EM',
    split:[['s1',25,'Public contribution'],['s2',75,'Concessionaire finance']],
    finList:[['','Asset','public hospital (concession)'],['sub','Structure','availability concession'],['','Revenue','contracted availability payment'],['sub','Demand risk','none (patients public)'],['','Key risk','sovereign &amp; currency'],['rest','Owner','concession consortium']],
    finNote:'A hospital concession is a <b>fully contracted government annuity</b>: an indexed payment for keeping the hospital available, with no demand risk. The whole investment debate is the <b>discount rate</b> — Chilean sovereign risk and the dollar-peso mix — more than the contract.',
    timeline:[['2010s','<b>Hospital concessions</b> awarded to build and maintain public hospitals.'],['Build','<b>Greenfield construction</b> of the facility under the concession.'],['Open','<b>Availability payments</b> begin as the hospital enters service.'],['Bata blanca','<b>Non-clinical FM</b> delivered; clinical services stay public.'],['Indexed','<b>Payment indexation</b> over the concession.'],['Long-term','<b>Hand-back</b> of the hospital at concession end.']],
    calcNote:'A working model of a <b>Latin-American hospital concession</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high. The cost of debt is higher to reflect emerging-market rates, so a strong contracted number nets down once discounted.',
    s6:'A Chilean concession is a contracted hospital annuity at an EM discount rate. What drives it:',
    breakers:['<b>Availability</b> — the payment is for keeping the hospital available; deductions bite for failures.','<b>Contracted payment</b> — the indexed charge, not patient activity, sets the revenue.','<b>Country &amp; currency</b> — Chilean sovereign risk and the dollar-peso mix set the discount rate.','<b>FM delivery</b> — providing the non-clinical services and lifecycle is the operational risk.'],
    src:'Figures from public sources on Chile\'s hospital concession programme and Latin-American availability-based health PPPs: ministry and multilateral disclosure. As an emerging-market PPP, all figures here are approximate and illustrative.',
    econ:{cur:'US$', host:'health ministry', care:'public hospital',
      bedDef:500,bedMin:150,bedMax:900,bedStep:20, chargeDef:90000,chargeMin:45000,chargeMax:180000,chargeStep:5000,
      availDef:97.5,availMin:88,availMax:100,availStep:0.5, fmPerBed:34000, fixedOM:6},
    calc:{build:330,grant:65,capex:3,revG:2.5,floor:38,cap:70,tax:27,exit:9,lev:4,rd:8.5,amort:3,hold:16},
    map:{footer:GEO.chile.footer}
  },

  /* ---------- 4 · NORTHERN BEACHES HOSPITAL (Oceania · Australian PPP, blended operating model) ---------- */
  northern:{
    name:'Northern Beaches Hospital', geo:'New South Wales, Australia', continent:'Oceania', cur:'A$', geoKey:'northern',
    lede:'An Australian <b>PPP</b> — a private consortium financed, built and maintains the hospital, and NSW Health pays a contracted, indexed availability payment; note its <b>blended</b> public/private operating model alongside the availability core.',
    s1:'<p class="body"><b>Northern Beaches Hospital</b> in Sydney is an Australian health <b>PPP</b>: a private consortium <b>financed, built and maintains</b> the facility, and the public authority, <b>NSW Health</b>, pays a contracted, inflation-indexed <b>availability payment</b> over a long term for keeping the hospital available and maintained. Backed by an <b>investment-grade</b> state government and denominated in Australian dollars, the availability core is a clean core-infrastructure cash flow.</p>'+
       '<p class="body">Northern Beaches is also notable for its <b>blended operating model</b> — the hospital serves both public and private patients under the operator, layered on top of the availability-and-maintenance PPP. For the infrastructure investor, the part that matters is the <b>availability payment</b>: a contracted, indexed, demand-risk-free annuity for keeping the building available, with <b>deductions</b> for unavailability. The blended clinical model sits with the operator, not the FM/availability SPV.</p>',
    facts:[['PPP','Structure','finance·build·maintain'],['Availability','Payment','contracted, indexed'],['Blended model','Operations','public &amp; private patients'],['No demand risk','Availability core','availability, not activity'],['Investment-grade','Offtaker','NSW government'],['Long term','Concession','25-30 years']],
    s2:'Watch the campus — a modern hospital, wards lit, ambulances at emergency, the helipad live, the FM entrance busy. <b>NSW Health</b> pays the <b style="color:#0c6b4f">availability payment</b> for keeping the building available and maintained. The SPV\'s money is the <b>contracted payment on every bed kept available</b>, indexed — the blended public/private clinical model sits with the operator. Drag the beds, the charge and the availability — a core, government-backed annuity.',
    driverLab:'Charge / bed', availLab:'Availability', hrK:'Availability payment', yrS:'beds × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & lifecycle'}, demandLabel:'AVAILABILITY',
    preset:'Load Northern Beaches',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment sit flat at the contracted level — NSW Health pays for keeping the building <b>available and maintained</b>, not for the blended clinical activity that sits with the operator. With an investment-grade state offtaker the discount rate is low and gearing high. Drop availability and deductions bite — a clean, contracted infrastructure cash flow.',
    s3:'The SPV earns a <b>contracted availability payment</b> for keeping the hospital available and maintained to standard, indexed to inflation, with <b>deductions</b> for unavailability. The availability core has <b>no demand risk</b> — the blended public/private clinical activity sits with the operator, not the FM/availability SPV. So the infrastructure income is a clean, fully contracted government annuity backed by an <b>investment-grade</b> state, set by the beds, the charge and availability.',
    mb:{tag:'Model B · Australian PPP', title:'Government-backed availability hospital', body:'An Australian health PPP in which a consortium finances, builds and maintains the hospital and NSW Health pays a contracted, indexed availability payment for keeping it available — no demand risk on the availability core, an investment-grade offtaker, a blended clinical model that sits with the operator. <b>This is Northern Beaches Hospital</b>.'},
    s4a:'The SPV carries <b>full facilities management and lifecycle</b> over the term — soft FM plus building and plant renewal — sized so the availability payment covers it at a contracted margin. With an investment-grade state offtaker the margin is steady. The defining feature is not the cost line but the <b>contracted, indexed payment</b> and the low discount rate a state government permits.',
    wfNote:'Operating cost is the through-life facilities management and lifecycle of the building plus soft FM, sized against a contracted payment. With deductions for unavailability, keeping the building available is the operational job; the value sits in the indexed, government-backed payment, not the blended clinical model.',
    s4b:'The capital is the <b>hospital build</b>, financed by the consortium on high leverage and recovered over the long term. A portion may be state-funded, but the consortium funds the bulk and recovers it through the availability payment. Backed by an investment-grade state offtaker, the cash flow is contracted and indexed, so it gears well — a low-risk, long-life government annuity.',
    stackH:'The capital · the hospital build', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',12,'State contribution'],['s2',88,'Consortium project finance']],
    finList:[['','Asset','acute hospital (PPP)'],['sub','Structure','finance·build·maintain'],['','Revenue','availability payment'],['sub','Operating model','blended public / private'],['','Demand risk','none (availability core)'],['rest','Owner','infra-backed consortium']],
    finNote:'An Australian health PPP is the <b>core-infrastructure hospital annuity</b>: an indexed availability payment over a long term, no demand risk on the availability core, an investment-grade state offtaker. The blended clinical model sits with the operator; the SPV\'s residual risk is FM and lifecycle delivery and deductions.',
    timeline:[['2014','<b>PPP contract</b> awarded for the new hospital.'],['2018','<b>Hospital opens</b> — blended public/private operating model.'],['Term','<b>Availability payments</b> over the long maintenance term.'],['Operate','<b>Operator</b> runs the blended clinical model.'],['Indexed','<b>Payment indexation</b> tracks inflation.'],['Long-term','<b>Hand-back</b> of the facility at term end.']],
    calcNote:'A working model of an <b>Australian health PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high, so revenue is flat. A low cost of debt and high gearing reflect an investment-grade state offtaker.',
    s6:'Northern Beaches is a core, government-backed hospital annuity. What drives it:',
    breakers:['<b>Availability</b> — the payment is for keeping the building available; deductions bite for unavailability.','<b>State offtaker</b> — an investment-grade counterparty keeps the discount rate low and gearing high.','<b>Indexation</b> — the inflation-linked payment protects the real return over a long term.','<b>Blended model</b> — the public/private clinical activity sits with the operator, not the availability SPV.'],
    src:'Figures from public sources on the Northern Beaches Hospital PPP and Australian health public-private partnerships: NSW Health and project disclosure. The figures are approximate and illustrative.',
    econ:{cur:'A$', host:'NSW Health', care:'acute hospital',
      bedDef:480,bedMin:200,bedMax:900,bedStep:20, chargeDef:170000,chargeMin:90000,chargeMax:300000,chargeStep:5000,
      availDef:98.5,availMin:90,availMax:100,availStep:0.5, fmPerBed:62000, fixedOM:9},
    calc:{build:640,grant:70,capex:3,revG:2.5,floor:68,cap:130,tax:30,exit:11,lev:4,rd:5,amort:3,hold:18},
    map:{footer:GEO.northern.footer}
  },

  /* ---------- 5 · TURKISH CITY HOSPITAL / ŞEHİR HASTANESİ (Middle East · giant integrated campus PPP) ---------- */
  turkey:{
    name:'Turkish city hospital (şehir hastanesi)', geo:'Türkiye', continent:'Middle East', cur:'US$', geoKey:'turkey',
    lede:'A giant integrated <b>health-campus PPP</b> — a şehir hastanesi delivered build-lease-transfer, with the health ministry paying a contracted availability charge under a treasury guarantee, with currency and treasury considerations.',
    s1:'<p class="body">Türkiye built a wave of vast <b>city hospitals (şehir hastanesi)</b> — integrated health campuses of several thousand beds — through a large <b>build-lease-transfer PPP</b> programme. A private consortium <b>designs, builds, finances and maintains</b> the campus and provides the non-clinical (FM) services, while the <b>Sağlık Bakanlığı</b> (health ministry) keeps clinical services public and pays a contracted <b>availability charge</b> over a long concession, typically backed by a <b>treasury guarantee</b>.</p>'+
       '<p class="body">It is the availability PPP at <b>enormous scale</b>, with an emerging-market twist. The consortium takes <b>no demand risk</b> — patients are the state\'s — and earns a contracted, indexed <b>availability payment</b> for keeping the campus available and the FM delivered, with <b>deductions</b> for failures. The defining considerations are <b>FX and treasury</b>: the payments are often hard-currency-linked and underpinned by a sovereign guarantee, so the credit and currency story drives the discount rate. A new block extends the campus. (Figures here are illustrative.)</p>',
    facts:[['Integrated campus','Asset','several thousand beds'],['Build-lease-transfer','Structure','DBFM + FM'],['Availability','Payment','contracted, indexed'],['Treasury guarantee','Credit','sovereign-backed'],['FX-linked','Currency','hard-currency considerations'],['No demand risk','Revenue','patients stay public']],
    s2:'Watch the campus — a giant integrated health complex, many wards lit, ambulances at emergency, the helipad live, a busy FM/services entrance. The <b>health ministry</b> pays the <b style="color:#0c6b4f">availability charge</b> for keeping it available and the FM delivered, under a treasury guarantee. The consortium\'s money is the <b>contracted payment on every bed kept available</b>, indexed. Drag the beds, the charge and the availability — a vast contracted annuity with FX/treasury considerations.',
    driverLab:'Charge / bed', availLab:'Availability', hrK:'Availability charge', yrS:'beds × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & lifecycle'}, demandLabel:'AVAILABILITY',
    preset:'Load city hospital',
    try:'<b>Try this:</b> push the <b>beds</b> slider — a şehir hastanesi is enormous, so the absolute availability charge balloons. Raise availability and the payment holds at the contracted level — the ministry pays for keeping the campus <b>available</b>, not for patient activity. The credit and currency story (treasury guarantee, FX linkage) sets the discount rate: a contracted annuity priced against an emerging-market sovereign.',
    s3:'The consortium earns a <b>contracted availability payment</b> for keeping the integrated campus available and delivering the non-clinical FM, indexed and often <b>hard-currency-linked</b>, with <b>deductions</b> for failures, and takes <b>no demand risk</b> — patients are the state\'s. The payment is underpinned by a <b>treasury guarantee</b>. The income is a vast, fully contracted government annuity; the investor question is the <b>FX and sovereign credit</b> that set the discount rate.',
    mb:{tag:'Model B · integrated campus PPP', title:'Sovereign-guaranteed availability campus', body:'A giant city-hospital PPP in which a consortium builds, finances and maintains an integrated health campus and provides FM, paid a contracted, indexed, often FX-linked availability charge by the health ministry under a treasury guarantee — no demand risk, deductions for failures. A vast contracted annuity with FX/treasury considerations. <b>This is a Turkish şehir hastanesi</b>.'},
    s4a:'The consortium carries <b>full facilities management and lifecycle</b> across a vast campus — non-clinical services plus the renewal of a huge building stock and plant — sized into the availability charge. The margin is healthy, but the swing factor is not the cost line — it is the <b>contracted payment, the FX linkage and the sovereign credit</b> behind the treasury guarantee.',
    wfNote:'Operating cost is the non-clinical FM across a giant campus plus the lifecycle renewal of an enormous building stock — real, because deductions penalise failures. The payment is set to cover it; the value driver is the indexed, often FX-linked payment and the sovereign credit behind the treasury guarantee.',
    s4b:'The capital is the <b>campus build</b> — a very large, capital-intensive integrated complex, financed on high leverage, often with international lenders. A <b>public or sovereign contribution</b> may meet part of the cost, with the consortium financing the balance and recovering it through the availability charge under a treasury guarantee. A contracted, indexed annuity carried against <b>emerging-market sovereign</b> credit and FX.',
    stackH:'The capital · the campus build', splitL:'Who funds the build', splitR:'sovereign',
    split:[['s1',20,'Public / sovereign'],['s2',80,'Consortium finance']],
    finList:[['','Asset','integrated health campus'],['sub','Structure','build-lease-transfer PPP'],['','Revenue','contracted availability charge'],['sub','Credit','treasury guarantee'],['','Key risk','FX &amp; sovereign'],['rest','Owner','PPP consortium']],
    finNote:'A Turkish city-hospital PPP is a <b>vast, sovereign-guaranteed contracted annuity</b>: an indexed, often FX-linked availability charge for keeping a giant campus available, no demand risk. The whole investment debate is the <b>FX and sovereign credit</b> behind the treasury guarantee, more than the contract.',
    timeline:[['2010s','<b>City hospital programme</b> launched — integrated health campuses.'],['Build','<b>Build-lease-transfer</b> of giant campuses under PPP.'],['Open','<b>Availability charges</b> begin as campuses enter service.'],['Guarantee','<b>Treasury guarantee</b> underpins the payments.'],['Indexed','<b>Payment indexation</b> / FX linkage over the concession.'],['Transfer','<b>Transfer</b> of the campus to the state at term end.']],
    calcNote:'A working model of a <b>Turkish city-hospital PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; the floor binds when availability is high. A higher cost of debt reflects emerging-market sovereign and FX risk, so a strong contracted number nets down once discounted. Figures are highly illustrative.',
    s6:'A city hospital is a vast, sovereign-guaranteed contracted annuity. What drives it:',
    breakers:['<b>Availability</b> — the charge is for keeping the campus available; deductions bite for failures.','<b>Treasury guarantee</b> — the sovereign credit behind the payment is the security.','<b>FX &amp; sovereign</b> — hard-currency linkage and sovereign risk set the discount rate.','<b>FM &amp; lifecycle</b> — maintaining a giant integrated campus over decades is the operational job.'],
    src:'Figures from public sources on Türkiye\'s city-hospital (şehir hastanesi) PPP programme and integrated health-campus partnerships. As an emerging-market sovereign-backed PPP, all figures here are highly approximate and illustrative.',
    econ:{cur:'US$', host:'health ministry', care:'integrated campus',
      bedDef:1500,bedMin:600,bedMax:3500,bedStep:50, chargeDef:80000,chargeMin:40000,chargeMax:160000,chargeStep:5000,
      availDef:97.5,availMin:88,availMax:100,availStep:0.5, fmPerBed:30000, fixedOM:14},
    calc:{build:870,grant:100,capex:3,revG:3,floor:100,cap:175,tax:25,exit:9,lev:4,rd:8.5,amort:3,hold:16},
    map:{footer:GEO.turkey.footer}
  },

  /* ---------- 6 · CHINESE SOCIAL-CAPITAL HOSPITAL (China · illustrative PPP / social-capital model) ---------- */
  china:{
    name:'Chinese social-capital hospital', geo:'China', continent:'China', cur:'¥', geoKey:'china',
    lede:'An illustrative Chinese <b>social-capital</b> hospital PPP — private (social) capital builds and maintains a public hospital and is remunerated through a long, contracted, availability-style government payment, at a low state cost of capital.',
    s1:'<p class="body">China has used <b>social-capital</b> (private-capital) participation to build and operate public hospitals under <b>PPP</b>-style arrangements: social capital <b>finances, builds and maintains</b> the facility and provides the supporting services, while the <b>health authority</b> keeps the public-service mission and remunerates the partner through a long, contracted <b>government payment</b> over the concession.</p>'+
       '<p class="body">Modelled here as an <b>availability-style</b> PPP, the social-capital partner takes <b>limited demand risk</b> — the payment is structured around keeping the hospital available and the services delivered, indexed and government-backed, with adjustments for performance. The lever is a very <b>low state cost of capital</b>: a long, contracted, government-backed payment financed cheaply on a state-supported balance sheet compounds into a large, stable return. A new wing extends the asset. (Figures here are illustrative.)</p>',
    facts:[['Social capital','Structure','private finance · public mission'],['Availability-style','Payment','contracted, government-backed'],['Limited demand risk','Revenue','availability-structured'],['Low CoC','Funding','state-supported'],['Long concession','Term','25-30 years'],['State','Owner','social-capital partner']],
    s2:'Watch the campus — a large public hospital, many wards lit, ambulances at emergency, a busy FM/services entrance. The <b>health authority</b> pays the <b style="color:#0c6b4f">contracted government payment</b> for keeping it available and the services delivered. The partner\'s money is the <b>contracted payment on every bed kept available</b>, indexed and government-backed. Drag the beds, the charge and the availability — a large contracted annuity at a low state cost of capital.',
    driverLab:'Charge / bed', availLab:'Availability', hrK:'Government payment', yrS:'beds × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM & lifecycle'}, demandLabel:'AVAILABILITY',
    preset:'Load China PPP',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment hold at the contracted level — modelled as an availability PPP, the health authority pays for keeping the hospital <b>available and the services delivered</b>. With a very low state cost of capital the contracted annuity values richly. Push the beds and the absolute payment balloons — scale and a low cost of capital are the model.',
    s3:'The social-capital partner earns a <b>contracted government payment</b> for keeping the hospital available and delivering the supporting services, indexed and government-backed, with performance adjustments. Modelled as an <b>availability PPP</b>, demand risk is limited. The counterparty is a state-backed health authority, so the payment is secure and the cost of capital low. The income is a large, contracted government annuity, set by the beds, the charge and availability.',
    mb:{tag:'Model B · social-capital PPP', title:'State-backed availability hospital', body:'A social-capital hospital PPP in which private capital builds, finances and maintains a public hospital and is paid a long, contracted, availability-style government payment by a state-backed health authority — limited demand risk, a low cost of capital, indexed and government-backed. A large, secure annuity. <b>This is an illustrative Chinese social-capital hospital</b>.'},
    s4a:'The partner carries <b>facilities management and lifecycle</b> across a large hospital — supporting services plus building and plant renewal — sized into the government payment. With a state-backed counterparty the margin is steady. The defining feature is the <b>contracted payment and the low cost of capital</b>, not the cost line.',
    wfNote:'Operating cost is the facilities management and lifecycle of a large hospital — supporting services plus building and plant renewal. The payment is set to cover it at a contracted margin; the value sits in the indexed, government-backed payment and the very low state cost of capital, not the cost line.',
    s4b:'The capital is the <b>hospital build</b>, financed by the social-capital partner on a state-supported balance sheet at a very low cost of capital. A public contribution may meet part of the cost, with the partner financing the balance and recovering it through the government payment. A long, contracted, indexed, government-backed annuity — cheap to finance and large in absolute terms.',
    stackH:'The capital · the hospital build', splitL:'Who funds the build', splitR:'state',
    split:[['s1',30,'Public contribution'],['s2',70,'Social-capital finance']],
    finList:[['','Asset','public hospital (PPP)'],['sub','Structure','social-capital PPP'],['','Revenue','contracted government payment'],['sub','Offtaker','state health authority'],['','Demand risk','limited (availability-style)'],['rest','Owner','social-capital partner']],
    finNote:'A Chinese social-capital hospital is a <b>large, state-backed contracted annuity</b>: an indexed, government-backed payment for keeping the hospital available, limited demand risk, a low cost of capital. The residual risk is FM and lifecycle delivery and the term and structure of the arrangement.',
    timeline:[['2010s','<b>Social-capital PPP</b> guidance encourages private participation in hospitals.'],['Build','<b>Social capital</b> finances and builds public hospitals.'],['Open','<b>Government payments</b> begin as hospitals enter service.'],['Services','<b>Supporting services</b> delivered; public mission stays public.'],['Indexed','<b>Payment indexation</b> over the concession.'],['Long-term','<b>Hand-back</b> of the hospital at term end.']],
    calcNote:'A working model of a <b>Chinese social-capital hospital</b>, on an enterprise-value basis. Revenue is the contracted, government-backed availability-style payment; the floor binds when availability is high. A low cost of capital reflects a state-supported balance sheet. Figures are highly illustrative.',
    s6:'A social-capital hospital is a large, state-backed contracted annuity. What drives it:',
    breakers:['<b>Availability</b> — the payment is structured around keeping the hospital available and services delivered.','<b>State-backed offtaker</b> — a government health authority keeps the cost of capital low and the payment secure.','<b>Cost of capital</b> — a very low state-supported rate is what makes the contracted annuity value richly.','<b>FM &amp; lifecycle</b> — maintaining a large hospital over decades is the operational job.'],
    src:'Figures from public sources and reporting on Chinese social-capital participation in public hospitals and health PPPs. Given limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', host:'health authority', care:'public hospital',
      bedDef:900,bedMin:300,bedMax:2000,bedStep:50, chargeDef:120000,chargeMin:60000,chargeMax:240000,chargeStep:5000,
      availDef:98,availMin:90,availMax:100,availStep:0.5, fmPerBed:42000, fixedOM:12},
    calc:{build:900,grant:150,capex:2.5,revG:3,floor:90,cap:160,tax:25,exit:10,lev:4,rd:4,amort:3,hold:18},
    map:{footer:GEO.china.footer}
  }
  };
  var ORDER=['nhs','humber','chile','northern','turkey','china'];

  /* ===================================================================
     HOSPITAL RENDERER  (canvas, 720x520) — top-down / elevation, daytime
     A hospital campus: a main hospital building with a rooftop H / helipad and lit
     ward windows (the hospital "available" and operating), an emergency / ambulance
     bay with an ambulance, and an FM / services entrance with a maintenance van. A
     public-authority icon pays a contracted, indexed availability fee (the unitary
     charge) to the SPV; FM & lifecycle cost drains out. When availability is high
     the building is fully lit; if availability drops, some windows dim and a
     deduction marker shows. A + NEW WING marker appears if GEO.growing.
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

  /* ---- campus geometry ---- */
  var BLD={x:212,y:250,w:330,h:196};            // main hospital building
  var EBAY={x:212,y:456,w:188,h:44};            // emergency / ambulance bay (below building)
  var FMENT={x:420,y:456,w:122,h:44};           // FM / services entrance
  var HELI={cx:300,cy:300,r:34};                // rooftop helipad / H
  var AUTH={x:556,y:150,w:140,h:96};            // public-authority icon (right)
  // ward window grid (built per asset)
  var WIN=[], NWIN=0;
  function layout(){
    WIN=[]; var cols=9, rows=4, gx=24, gy=24, cw=(BLD.w-2*gx)/cols, ch=(BLD.h-2*gy-34)/rows;
    for(var r=0;r<rows;r++) for(var c=0;c<cols;c++){
      WIN.push({x:BLD.x+gx+c*cw+2, y:BLD.y+gy+34+r*ch, w:cw-4, h:ch-5, ph:((r*5+c*7)%10)});
    }
    NWIN=WIN.length;
  }

  /* ---- base map: campus ground + apron + driveway ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e3e9e1'); g.addColorStop(1,'#d6ddce');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // landscaped grounds patch
    ctx.fillStyle='rgba(120,160,120,0.10)'; rr(28,250,150,200,16); ctx.fill();
    // hospital apron / forecourt
    ctx.fillStyle='rgba(150,158,150,0.16)'; rr(200,242,W-232,272,14); ctx.fill();
    // approach driveway up to emergency bay
    ctx.strokeStyle='rgba(120,128,120,0.5)'; ctx.lineWidth=14; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(120,H-20); ctx.quadraticCurveTo(220,500,EBAY.x+34,EBAY.y+EBAY.h-6); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1; ctx.setLineDash([8,10]); ctx.lineDashOffset=-(T*1.0);
    ctx.beginPath(); ctx.moveTo(120,H-20); ctx.quadraticCurveTo(220,500,EBAY.x+34,EBAY.y+EBAY.h-6); ctx.stroke(); ctx.setLineDash([]);
    ctx.lineCap='butt';
  }

  /* ---- a window: lit (available) or dim (deduction) ---- */
  function win(w,lit){
    if(lit){
      var g=ctx.createLinearGradient(w.x,w.y,w.x,w.y+w.h); g.addColorStop(0,'rgba(255,228,160,0.95)'); g.addColorStop(1,'rgba(255,205,120,0.85)');
      ctx.fillStyle=g; rr(w.x,w.y,w.w,w.h,2); ctx.fill();
      if(Math.sin(T*0.06+w.ph)>0.5) glow(w.x+w.w/2,w.y+w.h/2,7,'rgba(255,210,120,0.30)');
    } else {
      ctx.fillStyle='rgba(96,108,104,0.55)'; rr(w.x,w.y,w.w,w.h,2); ctx.fill();
    }
    ctx.strokeStyle='rgba(60,72,66,0.25)'; ctx.lineWidth=0.6; ctx.stroke();
  }

  /* ---- main hospital building (elevation-ish top-down) ---- */
  function building(accent,litFrac){
    var b=BLD;
    // shadow
    ctx.fillStyle='rgba(20,34,28,0.14)'; rr(b.x+6,b.y+b.h-4,b.w,12,6); ctx.fill();
    // body
    var g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h); g.addColorStop(0,'#f3f5f2'); g.addColorStop(1,'#dfe4dd');
    ctx.fillStyle=g; rr(b.x,b.y,b.w,b.h,8); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // accent fascia band (the hospital's livery)
    ctx.fillStyle=accent; rr(b.x,b.y,b.w,20,8); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='700 11px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('HOSPITAL',b.x+14,b.y+14);
    // a red-cross plaque on the fascia
    ctx.fillStyle='#fff'; rr(b.x+b.w-30,b.y+4,12,12,2); ctx.fill();
    ctx.fillStyle='#c0392b'; rr(b.x+b.w-26.5,b.y+6,5,8,1); ctx.fill(); rr(b.x+b.w-28.5,b.y+8,9,4,1); ctx.fill();
    // ward windows: lit up to litFrac
    var nLit=Math.round(NWIN*litFrac);
    for(var i=0;i<NWIN;i++) win(WIN[i], i<nLit);
    // rooftop helipad / H marker
    var hp=HELI;
    ctx.fillStyle='rgba(60,72,66,0.85)'; ctx.beginPath(); ctx.arc(hp.cx,hp.cy,hp.r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.92)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(hp.cx,hp.cy,hp.r-5,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='#fff'; ctx.lineWidth=5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hp.cx-11,hp.cy-13); ctx.lineTo(hp.cx-11,hp.cy+13);
    ctx.moveTo(hp.cx+11,hp.cy-13); ctx.lineTo(hp.cx+11,hp.cy+13);
    ctx.moveTo(hp.cx-11,hp.cy); ctx.lineTo(hp.cx+11,hp.cy); ctx.stroke(); ctx.lineCap='butt';
    // a slow rotating helipad beacon
    if(litFrac>0.5){ var ba=T*0.05; glow(hp.cx+Math.cos(ba)*(hp.r-5),hp.cy+Math.sin(ba)*(hp.r-5),6,'rgba(120,200,255,0.45)'); }
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('ROOFTOP HELIPAD',hp.cx,hp.cy+hp.r+12);
  }

  /* ---- an ambulance (small van with a livery stripe + blue light) ---- */
  function ambulance(x,y,live){
    ctx.fillStyle='rgba(20,34,28,0.16)'; rr(x+1,y+12,40,5,2); ctx.fill();
    ctx.fillStyle='#f4f6f3'; rr(x,y,40,15,3); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
    // battenburg-ish stripe
    ctx.fillStyle='#1d6f4c'; rr(x,y+6,40,4,1); ctx.fill();
    // red cross
    ctx.fillStyle='#c0392b'; rr(x+17,y+2,4,3,1); ctx.fill(); rr(x+16,y+2.7,6,1.6,0.5); ctx.fill();
    // cab
    ctx.fillStyle='rgba(180,210,235,0.9)'; rr(x+31,y+2,7,5,1); ctx.fill();
    // blue light
    if(live && Math.sin(T*0.3)>0){ glow(x+4,y-1,6,'rgba(70,140,255,0.7)'); }
    ctx.fillStyle='rgba(70,140,255,0.9)'; rr(x+2,y-2,5,2,1); ctx.fill();
  }
  /* ---- a maintenance / FM van ---- */
  function fmvan(x,y){
    ctx.fillStyle='rgba(20,34,28,0.16)'; rr(x+1,y+11,34,4,2); ctx.fill();
    ctx.fillStyle='#d8c47a'; rr(x,y,34,13,3); ctx.fill();
    ctx.strokeStyle='rgba(120,110,80,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
    ctx.fillStyle='rgba(60,72,66,0.7)'; rr(x+24,y+2,7,5,1); ctx.fill();
    ctx.fillStyle='rgba(90,80,55,0.8)'; ctx.font='700 6px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('FM',x+13,y+9);
  }

  /* ---- emergency / ambulance bay ---- */
  function ebay(live){
    var e=EBAY;
    ctx.fillStyle='rgba(190,71,51,0.10)'; rr(e.x,e.y,e.w,e.h,7); ctx.fill();
    ctx.strokeStyle='rgba(190,71,51,0.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#bc4733'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('A&E · AMBULANCE BAY',e.x+8,e.y+13);
    ambulance(e.x+e.w-52, e.y+22, live);
  }
  /* ---- FM / services entrance ---- */
  function fmentrance(){
    var f=FMENT;
    ctx.fillStyle='rgba(176,125,36,0.10)'; rr(f.x,f.y,f.w,f.h,7); ctx.fill();
    ctx.strokeStyle='rgba(176,125,36,0.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#9a7320'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('FM / SERVICES',f.x+8,f.y+13);
    fmvan(f.x+f.w-44, f.y+24);
  }

  /* ---- public-authority (offtaker) icon ---- */
  function authority(label,accent){
    var a=AUTH;
    ctx.fillStyle='rgba(20,34,28,0.10)'; rr(a.x+4,a.y+a.h-4,a.w,10,5); ctx.fill();
    var g=ctx.createLinearGradient(a.x,a.y,a.x,a.y+a.h); g.addColorStop(0,'#fbfcfb'); g.addColorStop(1,'#eef1ee');
    ctx.fillStyle=g; rr(a.x,a.y,a.w,a.h,8); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // a small civic-building pediment + columns
    ctx.fillStyle=accent; ctx.beginPath(); ctx.moveTo(a.x+a.w/2-30,a.y+30); ctx.lineTo(a.x+a.w/2,a.y+16); ctx.lineTo(a.x+a.w/2+30,a.y+30); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(120,130,120,0.55)';
    for(var cx=a.x+a.w/2-26;cx<=a.x+a.w/2+22;cx+=12){ rr(cx,a.y+30,5,20,1); ctx.fill(); }
    ctx.fillStyle='rgba(70,82,76,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('PUBLIC AUTHORITY',a.x+a.w/2,a.y+62);
    ctx.fillStyle=accent; ctx.font='700 8.5px Inter,sans-serif'; ctx.fillText(label,a.x+a.w/2,a.y+76);
    ctx.fillStyle='rgba(90,102,96,0.85)'; ctx.font='600 7px Inter,sans-serif'; ctx.fillText('pays unitary charge',a.x+a.w/2,a.y+88);
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
    var beds=parseFloat(sCap.value), charge=parseFloat(sSpread.value), avail=parseFloat(sAvail.value)/100;
    var accent=G.accent||'#2f5fb0';

    ctx.clearRect(0,0,W,H);
    drawMap();

    // public authority + the campus
    authority(G.authority||'PUBLIC AUTHORITY', accent);
    building(accent, Math.max(0,Math.min(1,avail)));     // windows lit up to availability
    ebay(true);
    fmentrance();

    // ---- economics (the availability PPP / PFI: a contracted government annuity, NO demand risk) ----
    var grossCharge=beds*charge;
    var revenue=grossCharge*avail;            // deductions for unavailability/performance
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));      // floor = contracted minimum availability payment
    var opex= beds*(E.fmPerBed||0) + (E.fixedOM||0)*1e6;  // facilities management (soft + hard FM) + lifecycle
    var ebitda=revenue-opex;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // waterfall opex rows: FM & lifecycle
    var c_soft=opex*0.40, c_hard=opex*0.30, c_life=opex*0.18, c_admin=opex*0.12;
    // share of "+cash" that is the contracted floor vs the indexation slice
    var floorBinds = floor>0 && revenue<=floor+1;
    var contractShare = floorBinds ? Math.min(0.5, floor/Math.max(1,revenue)) : 0.20;

    // deduction marker if availability is below the contracted threshold
    var deduct = avail < 0.97;

    // money-flow: +cash (availability fee) flows from the authority to the SPV;
    //   amber = indexation slice; −cash (FM & lifecycle) drains at the FM entrance
    if(_anim){
      if(Math.random()<0.75){ var fx=AUTH.x+10, fy=AUTH.y+AUTH.h-6;
        coins.push({x:fx,y:fy, vy:-(0.2+Math.random()*0.2), life:1, kind:Math.random()<contractShare?'rec':'ret', dir:-1}); }
      var mx=FMENT.x+FMENT.w*0.5; if(Math.random()<Math.max(0.1,Math.min(0.6, opex/Math.max(1,revenue)))) spawnCoin(mx,FMENT.y+6,'cost',1);
      demHist.push(Math.max(0,Math.min(1,avail))); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,avail)));

    // labels: building caption, deduction marker, expansion marker
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText((G.phase==='greenfield'?'GREENFIELD · ':'OPERATIONAL · ')+(G.model||'PPP')+' · AVAILABLE',BLD.x,BLD.y-8); ctx.restore();
    if(deduct){
      ctx.save(); ctx.fillStyle='rgba(190,71,51,0.92)'; rr(BLD.x+BLD.w-128,BLD.y-22,118,16,4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('− DEDUCTION · UNAVAILABLE',BLD.x+BLD.w-69,BLD.y-11); ctx.restore();
    }
    if(G.growing){
      var ex=BLD.x+BLD.w+6, ey=BLD.y+40, pulse=0.5+0.5*Math.sin(T*0.08);
      ctx.save(); ctx.globalAlpha=0.55+0.4*pulse;
      ctx.fillStyle='rgba(12,107,79,0.9)'; rr(ex,ey,16,86,4); ctx.fill();
      ctx.strokeStyle='rgba(12,107,79,0.55)'; ctx.setLineDash([4,4]); ctx.lineWidth=1.2; rr(ex,ey,16,86,4); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      ctx.save(); ctx.translate(ex+11,ey+44); ctx.rotate(Math.PI/2);
      ctx.fillStyle='rgba(12,107,79,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('+ NEW WING',0,0); ctx.restore();
    }

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(beds)+' beds',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',kfmt(beds)+' beds'); set('ixSpreadV',CUR+kfmt(charge)+'/bed'); set('ixAvailV',(Math.round(avail*1000)/10)+'%');
    set('ixDir',kfmt(beds)+' beds'); set('ixDirS',(G.model||'PPP')+' · '+E.care);
    set('ixMW',(Math.round(avail*1000)/10)+'% available'); set('ixMWs',(deduct?'below threshold · deductions':'at contract · no demand risk')+' · '+(E.host||'authority'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Soft FM',c_soft],['Hard FM',c_hard],['Lifecycle',c_life],['Admin',c_admin]], ebitda);
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
    s+=lbl(bx(0)+bw/2, y(rev), 'Unitary charge', money(rev), '#15201d');
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the charge is too thin to value — raise the beds, the unitary charge or the availability.</span>'; return; }
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
    sCap.min=E.bedMin; sCap.max=E.bedMax; sCap.step=E.bedStep; sCap.value=E.bedDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is a contracted availability payment, the unitary charge (beds × charge per bed × availability), with no demand risk, reduced only by deductions for unavailability or performance, and the returns model is a simplified DCF in which a public capital contribution offsets the hospital build cost; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.bedDef; sSpread.value=E.chargeDef; sAvail.value=E.availDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'nhs');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
