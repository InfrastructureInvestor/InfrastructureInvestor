/* Courts / justice facilities (PPP / PFI) — data-driven worked examples.
   Six real courthouse public-private partnerships, one template. Scene config from
   ct-geo.js (GEO), drawn as a top-down / elevation COURTHOUSE in a 720x520 daytime
   scene: a dignified civic building with a columned / portico entrance and steps, a
   clock / pediment over the door, a scales-of-justice motif, rows of lit windows
   (the building "available"), and an FM / services entrance with a maintenance van.
   The interactive figures are illustrative: revenue is a contracted availability
   payment — the unitary charge — (courtrooms × charge per courtroom × availability),
   with NO demand risk (it does not depend on case volumes), reduced only by
   deductions for unavailability or performance failures; the returns model is a
   simplified DCF in which a public contribution offsets the courthouse build cost. */
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

  /* ---------- 1 · UK COURTS PFI (Europe · the original unitary-charge PFI) ---------- */
  uk:{
    name:'UK courts PFI', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'uk',
    lede:'A <b>PFI courthouse</b> — a private consortium designed, built, financed and now maintains a civil-justice centre, and the justice ministry pays a single, inflation-indexed <b>unitary charge</b> for keeping the building available, with <b>no demand risk</b> — the payment does not depend on case volumes.',
    s1:'<p class="body">The UK funded a number of new courts — civil-justice centres and combined court buildings — through the <b>Private Finance Initiative (PFI)</b>. A private consortium, a special-purpose vehicle (SPV), would <b>design, build, finance and maintain</b> the courthouse over a 25-30 year concession, and the justice ministry would pay a single, contracted <b>unitary charge</b>. The charge covers the capital, the financing, the lifecycle (hard FM) and the facilities management — security, cleaning, building services — in one indexed payment.</p>'+
       '<p class="body">The economics are a <b>contracted government annuity</b>. Revenue does <b>not</b> depend on how many cases are heard — judicial activity stays with the courts service — it is an <b>availability payment</b>, paid in full so long as the building is available and performing, and reduced only by <b>deductions</b> for unavailability or performance failures. A courthouse is a long-life, dignified civic building, and that long, government-backed, inflation-linked, demand-risk-free cash flow is a small, simple, low-risk PPP that now trades in the <b>secondary market</b> at thin, stable yields.</p>',
    facts:[['PFI','Structure','design·build·finance·maintain'],['Unitary charge','Revenue','single indexed payment'],['No demand risk','Payment','availability, not case volumes'],['25-30yr','Concession','long government-backed'],['Deductions','Risk','unavailability / performance'],['Secondary','Market','traded at thin yields']],
    s2:'Watch the courthouse. The building is <b>available</b> — windows lit, the portico open, the scales over the door — and the justice ministry pays the <b style="color:#0c6b4f">unitary charge</b> for keeping it so. The SPV\'s money is the <b>availability payment on every courtroom kept available</b>, indexed each year, not the number of cases heard. The real cost draining out is <b>facilities management — security, cleaning — and lifecycle</b>. Drag the courtrooms, the charge per courtroom and the availability — and watch deductions bite if availability falls.',
    driverLab:'Charge / room', availLab:'Availability', hrK:'Unitary charge', yrS:'rooms × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load UK courts PFI',
    try:'<b>Try this:</b> drop the <b>availability</b> a few points and watch the unitary charge fall through <b>deductions</b> — a courts PFI is paid for keeping the building available and performing, not for the number of cases heard. Then remember the trick: there is <b>no demand risk</b> at all. A civic building delivered once earns an <b>indexed availability payment for decades</b>, which is exactly why these courthouses trade in the secondary market at thin, stable yields.',
    s3:'The ministry pays a <b>unitary charge per year</b> for the whole concession, indexed to inflation, covering capital, financing, hard FM (lifecycle) and soft FM. It is an <b>availability payment</b>: paid in full so long as the courthouse is available and performing, reduced only by <b>deductions</b> for unavailable areas or performance failures. There is <b>no demand risk</b> — case volumes are the courts service\'s. The return is the spread between a long, indexed, government-backed payment and the cost of building and running a long-life civic asset.',
    mb:{tag:'Model B · UK courts PFI', title:'The original unitary-charge PFI', body:'A private SPV designs, builds, finances and maintains a courthouse, and the justice ministry pays a single, indexed unitary charge over 25-30 years for keeping it available — no demand risk, deductions for unavailability, FM and lifecycle as the real cost. A small, simple, low-risk contracted government annuity. <b>This is a UK courts PFI</b>, now traded in the secondary market.'},
    s4a:'A courts PFI carries a real cost: <b>facilities management (soft FM)</b> — security, cleaning, building services — and <b>lifecycle (hard FM)</b> — replacing roofs, plant, fabric over the concession. These are sized into the charge, so the margin is moderate, not enormous. A courthouse is a relatively light, simple building to run; the defining number is not the cost line but the <b>contracted, indexed unitary charge and the availability</b> behind it.',
    wfNote:'Operating cost is the facilities management (soft FM — security, cleaning, building services) and the lifecycle / hard-FM provision that keeps a long-life civic building available over decades. It is a real, recurring cost sized into the unitary charge, so the margin is moderate; the value is the long, indexed, government-backed payment.',
    s4b:'The capital is the <b>courthouse itself</b> — a capital-intensive, dignified civic building funded through high-leverage project finance. A <b>public capital contribution</b> may meet part of the cost, with the SPV financing the bulk and recovering it through the unitary charge. That is the model: a large upfront build turned into a long, contracted, indexed, demand-risk-free annuity backed by the justice ministry.',
    stackH:'The capital · the courthouse build', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',12,'Public contribution'],['s2',88,'SPV project finance']],
    finList:[['','Asset','courthouse (DBFM)'],['sub','Structure','PFI unitary charge'],['','Revenue','availability payment'],['sub','Indexation','inflation-linked'],['','Demand risk','none'],['rest','Owner','infra-fund SPV']],
    finNote:'A courts PFI is the <b>canonical contracted government annuity</b>: an indexed availability payment over a long concession, no demand risk, a justice-ministry offtaker. FM and lifecycle are real but light, so the margin is moderate; the value sits in the contracted, government-backed payment and the price paid in the secondary market.',
    timeline:[['1992','<b>PFI launched</b> — private finance for public assets.'],['1998-2010','<b>Courts wave</b> — civil-justice centres and combined courts built under PFI.'],['2000s','<b>Operational phase</b> — unitary charges paid, FM delivered.'],['2010s','<b>Secondary market</b> — equity trades to infra funds at thin yields.'],['2018','<b>PFI ended</b> for new projects; existing deals run on.'],['Ongoing','<b>Hand-back</b> of the courthouse at concession end.']],
    calcNote:'A working model of a <b>UK courts PFI</b>. The build is the capital cost of a civic building; a public contribution offsets part of it, so net capital is most of the build, geared high on project finance. Revenue is the indexed unitary charge over a long hold; the exit multiple reflects a long, contracted, government-backed annuity.',
    s6:'A courts PFI is the contracted courthouse annuity. What moves the return:',
    breakers:['<b>Availability</b> — the unitary charge is paid for keeping the courthouse available; deductions bite for unavailability.','<b>Indexation</b> — the inflation-linked charge protects the real return over a long concession.','<b>FM &amp; lifecycle</b> — soft and hard FM are the real, recurring cost that sets the margin.','<b>Secondary-market price</b> — what the equity is bought and sold for sets the realised return.'],
    src:'Figures from public sources on the UK <a href="https://www.nao.org.uk/" target="_blank" rel="noopener">PFI programme</a> and National Audit Office reviews of court and justice PFI deals. The figures are approximate and illustrative.',
    econ:{cur:'£', host:'justice ministry', care:'civil-justice centre',
      roomsDef:30,roomsMin:10,roomsMax:60,roomsStep:1, chargeDef:900000,chargeMin:450000,chargeMax:1800000,chargeStep:25000,
      availDef:98.5,availMin:90,availMax:100,availStep:0.5, fmPerRoom:280000, fixedOM:2},
    calc:{build:255,grant:45,capex:2.5,revG:2.5,floor:25,cap:48,tax:25,exit:12,lev:4,rd:5,amort:3,hold:18},
    map:{footer:GEO.uk.footer}
  },

  /* ---------- 2 · ONTARIO COURTHOUSE P3 (North America · Canadian DBFM) ---------- */
  ontario:{
    name:'Ontario courthouse P3', geo:'Ontario, Canada', continent:'North America', cur:'C$', geoKey:'ontario',
    lede:'A Canadian <b>P3</b> — a consolidated courthouse delivered design-build-finance-maintain, with Infrastructure Ontario paying a contracted, indexed <b>availability payment</b> for keeping it available, with <b>no demand risk</b> on case volumes.',
    s1:'<p class="body">Ontario has delivered new <b>consolidated courthouses</b> — in Toronto and across the province — as flagship <b>public-private partnerships (P3)</b>. A private consortium delivers the building on a <b>design-build-finance-maintain (DBFM)</b> basis, and the public authority, <b>Infrastructure Ontario</b>, pays a contracted, inflation-indexed <b>availability payment</b> over a long concession for keeping the courthouse available and maintained.</p>'+
       '<p class="body">The Canadian P3 model is the availability PPP at its most disciplined: the consortium takes <b>no demand risk</b> — court operations and case volumes are the province\'s — and is paid for <b>availability and performance</b>, with <b>deductions</b> for unavailable space or service failures. Backed by an <b>investment-grade</b> provincial offtaker and denominated in Canadian dollars, a courthouse is a small, simple, low-risk, fully contracted, indexed cash flow — the kind of long-life civic asset that anchors a core infrastructure portfolio.</p>',
    facts:[['P3 / DBFM','Structure','design·build·finance·maintain'],['Consolidated court','Asset','combined courthouse'],['Availability','Payment','contracted, indexed'],['No demand risk','Revenue','availability, not case volumes'],['Investment-grade','Offtaker','province of Ontario'],['Long concession','Term','25-30 years']],
    s2:'Watch the courthouse — a dignified civic building, windows lit, the columned portico open, the scales over the door, the FM entrance busy. <b>Infrastructure Ontario</b> pays the <b style="color:#0c6b4f">availability payment</b> for keeping it available and maintained. The consortium\'s money is the <b>contracted payment on every courtroom kept available</b>, indexed, not the cases heard. The cost draining out is <b>facilities management and lifecycle</b>. Drag the courtrooms, the charge and the availability — a core, government-backed annuity.',
    driverLab:'Charge / room', availLab:'Availability', hrK:'Availability payment', yrS:'rooms × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load Ontario P3',
    try:'<b>Try this:</b> raise the <b>availability</b> toward 100% and watch the payment hold at its contracted level — a Canadian P3 pays for keeping the courthouse <b>available and performing</b>, not for case activity. With an investment-grade provincial offtaker the discount rate is low and gearing high: this is what a clean, core, contracted infrastructure cash flow looks like. Drop availability and deductions bite.',
    s3:'The consortium earns a <b>contracted availability payment</b> for keeping the courthouse available and maintained to standard, indexed to inflation, with <b>deductions</b> for unavailable space or performance failures. There is <b>no demand risk</b> — court operations are the province\'s. So the income is a clean, fully contracted government annuity backed by an <b>investment-grade</b> provincial offtaker, set by the courtrooms, the charge and availability. Low risk, long term, indexed.',
    mb:{tag:'Model B · Canadian P3', title:'Government-backed availability courthouse', body:'A DBFM P3 in which a consortium designs, builds, finances and maintains a consolidated courthouse and Infrastructure Ontario pays a contracted, indexed availability payment for keeping it available — no demand risk, an investment-grade offtaker, deductions for unavailability. A small, simple, low-risk core-infrastructure annuity. <b>This is an Ontario courthouse P3</b>.'},
    s4a:'The consortium carries <b>full facilities management and lifecycle</b> over the term — building maintenance, plant renewal, security, cleaning — sized so the availability payment covers it at a contracted margin. A courthouse is a relatively light building to run, and with an investment-grade offtaker the margin is steady. The defining feature is not the cost line but the <b>contracted, indexed payment</b> and the low discount rate a provincial offtaker permits.',
    wfNote:'Operating cost is the through-life facilities management and lifecycle of a civic building — security, cleaning, building services plus hard-FM plant and fabric renewal — sized against a contracted payment. With deductions for unavailability, keeping the building available is the operational job; the value sits in the indexed, government-backed payment.',
    s4b:'The capital is the <b>courthouse build</b> — a dignified, capital-intensive civic building, financed by the consortium under DBFM and recovered over the long term. A portion may be publicly funded, but the consortium funds the bulk on high-leverage project finance and recovers it through the availability payment. Backed by an investment-grade offtaker, the cash flow is contracted and indexed, so it gears well — a low-risk, long-life government annuity.',
    stackH:'The capital · the courthouse build', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',14,'Public contribution'],['s2',86,'Consortium project finance']],
    finList:[['','Asset','consolidated courthouse (DBFM)'],['sub','Structure','Canadian P3'],['','Revenue','availability payment'],['sub','Offtaker','province of Ontario'],['','Demand risk','none'],['rest','Owner','infra-backed consortium']],
    finNote:'A Canadian P3 courthouse is the <b>core-infrastructure annuity</b>: an indexed availability payment over a long concession, no demand risk, an investment-grade provincial offtaker. It gears well and prices tight; the residual risk is FM and lifecycle delivery and deductions.',
    timeline:[['2010','<b>Project agreement</b> signed for a new consolidated courthouse.'],['2011','<b>Financial close</b> — DBFM P3 with a private consortium.'],['2015','<b>Courthouse opens</b> — combined courts under one roof.'],['Term','<b>Availability payments</b> over the long concession.'],['Indexed','<b>Payment indexation</b> tracks inflation.'],['Long-term','<b>Hand-back</b> of the building at term end.']],
    calcNote:'A working model of a <b>Canadian P3 courthouse</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high, so revenue is flat. A low cost of debt and high gearing reflect an investment-grade provincial offtaker.',
    s6:'An Ontario courthouse is a core, government-backed annuity. What drives it:',
    breakers:['<b>Availability</b> — the payment is for keeping the courthouse available; deductions bite for unavailability.','<b>Provincial offtaker</b> — an investment-grade counterparty keeps the discount rate low and gearing high.','<b>Indexation</b> — the inflation-linked payment protects the real return over a long term.','<b>FM &amp; lifecycle delivery</b> — maintaining a civic building over decades is the operational risk.'],
    src:'Figures from public sources on the <a href="https://www.infrastructureontario.ca/" target="_blank" rel="noopener">Infrastructure Ontario</a> P3 programme and Ontario courthouse projects. The figures are approximate and illustrative.',
    econ:{cur:'C$', host:'Infrastructure Ontario', care:'consolidated courthouse',
      roomsDef:36,roomsMin:12,roomsMax:70,roomsStep:1, chargeDef:1050000,chargeMin:550000,chargeMax:2100000,chargeStep:25000,
      availDef:99,availMin:90,availMax:100,availStep:0.5, fmPerRoom:330000, fixedOM:2.5},
    calc:{build:380,grant:60,capex:2.5,revG:2,floor:38,cap:70,tax:26,exit:11.5,lev:4,rd:5,amort:3,hold:18},
    map:{footer:GEO.ontario.footer}
  },

  /* ---------- 3 · CHILEAN / LATAM JUSTICE FACILITY PPP (South America · availability concession) ---------- */
  chile:{
    name:'Chilean justice facility PPP', geo:'Chile', continent:'South America', cur:'US$', geoKey:'chile',
    lede:'A Latin-American <b>availability concession</b> — a private concessionaire builds and maintains a public justice facility, and the justice ministry pays a contracted, indexed availability payment, with <b>no demand risk</b> but emerging-market rates.',
    s1:'<p class="body">Chile and other Latin-American states have used <b>concessions</b> to deliver and maintain public buildings, including justice facilities: a private concessionaire <b>builds, finances and maintains</b> the courthouse and provides the non-judicial services — the soft and hard FM around the judicial core — while the <b>Ministerio de Justicia</b> keeps court operations public. The concessionaire is remunerated through a contracted, inflation-indexed <b>availability payment</b> over a long concession.</p>'+
       '<p class="body">This is the availability PPP in <b>emerging-market</b> form. The concessionaire takes <b>no demand risk</b> — case volumes are the state\'s — and earns a <b>contracted payment</b> for keeping the courthouse available and the FM delivered, with <b>deductions</b> for failures. The income is highly contracted, but it is priced against a <b>higher discount rate</b> than a developed-market PPP, reflecting sovereign risk and a part-dollar, part-peso cash mix. A new wing or annex can extend the concession. (Figures here are illustrative.)</p>',
    facts:[['Concession','Structure','build·finance·maintain'],['Non-judicial FM','Services','FM bundled'],['Availability','Payment','contracted, indexed'],['No demand risk','Revenue','case volumes stay public'],['US$ / CLP','Currency','part-dollar, part-peso'],['EM rates','Pricing','higher discount rate']],
    s2:'Watch the courthouse — a new public justice building, windows lit, the portico open, the scales over the door, the FM entrance busy with a maintenance van. The <b>justice ministry</b> pays the <b style="color:#0c6b4f">availability payment</b> for keeping it available and the FM delivered. The concessionaire\'s money is the <b>contracted payment on every courtroom kept available</b>, indexed, not the cases heard. Drag the courtrooms, the charge and the availability — a contracted annuity at an emerging-market discount rate.',
    driverLab:'Charge / room', availLab:'Availability', hrK:'Availability payment', yrS:'rooms × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load Chile concession',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment hold flat at the contracted level — a justice-facility concession pays for keeping the building <b>available</b>, not for case activity, so above the threshold the revenue is contracted. Then push the cost of debt: a strong contracted number nets down once discounted like an emerging-market concession. The contract is solid; the debate is the discount rate.',
    s3:'The concessionaire earns a <b>contracted availability payment</b> for keeping the courthouse available and delivering the non-judicial FM, indexed to inflation, with <b>deductions</b> for failures. There is <b>no demand risk</b> — case volumes are the state\'s. So the income is a fully contracted government annuity, set by the courtrooms, the charge and availability. The investor question is less the contract than the <b>discount rate</b> — Chilean sovereign risk and the dollar-peso mix.',
    mb:{tag:'Model B · justice concession', title:'Emerging-market availability courthouse', body:'A concession in which a private party builds, finances and maintains a public justice facility and provides non-judicial FM, paid a contracted, indexed availability payment by the justice ministry — no demand risk, deductions for failures. A small, fully contracted annuity priced against emerging-market rates. <b>This is a Chilean justice facility PPP</b>.'},
    s4a:'The concessionaire carries <b>full facilities management and lifecycle</b> — the non-judicial services plus building and plant renewal — sized into the availability payment. Margins are healthy because a courthouse is light to run and the payment is set to cover it, but the swing factor is not the cost line — it is the <b>contracted payment and the discount rate</b> on an emerging-market concession.',
    wfNote:'Operating cost is the non-judicial FM — security, cleaning, building services — plus the lifecycle renewal of building and plant, real because deductions penalise failures. The payment is set to cover it at a contracted margin; the value driver is the indexed payment and the emerging-market discount rate.',
    s4b:'The capital is the <b>courthouse build</b>, financed under the concession on high leverage. A <b>public contribution</b> typically funds part of the capital, with the concessionaire financing the balance and recovering it through the availability payment. Modelled on an enterprise-value basis, it is a contracted, indexed annuity carried against <b>emerging-market</b> rates — a new wing or annex can extend it.',
    stackH:'The capital · the courthouse build', splitL:'Who funds the build', splitR:'EM',
    split:[['s1',28,'Public contribution'],['s2',72,'Concessionaire finance']],
    finList:[['','Asset','public courthouse (concession)'],['sub','Structure','availability concession'],['','Revenue','contracted availability payment'],['sub','Demand risk','none (case volumes public)'],['','Key risk','sovereign &amp; currency'],['rest','Owner','concession consortium']],
    finNote:'A justice-facility concession is a <b>fully contracted government annuity</b>: an indexed payment for keeping the courthouse available, with no demand risk. The whole investment debate is the <b>discount rate</b> — Chilean sovereign risk and the dollar-peso mix — more than the contract.',
    timeline:[['2010s','<b>Public-building concessions</b> awarded to build and maintain civic facilities.'],['Build','<b>Greenfield construction</b> of the courthouse under the concession.'],['Open','<b>Availability payments</b> begin as the facility enters service.'],['Services','<b>Non-judicial FM</b> delivered; court operations stay public.'],['Indexed','<b>Payment indexation</b> over the concession.'],['Long-term','<b>Hand-back</b> of the building at concession end.']],
    calcNote:'A working model of a <b>Latin-American justice-facility concession</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high. The cost of debt is higher to reflect emerging-market rates, so a strong contracted number nets down once discounted.',
    s6:'A Chilean concession is a contracted courthouse annuity at an EM discount rate. What drives it:',
    breakers:['<b>Availability</b> — the payment is for keeping the courthouse available; deductions bite for failures.','<b>Contracted payment</b> — the indexed charge, not case activity, sets the revenue.','<b>Country &amp; currency</b> — Chilean sovereign risk and the dollar-peso mix set the discount rate.','<b>FM delivery</b> — providing the non-judicial services and lifecycle is the operational risk.'],
    src:'Figures from public sources on Latin-American availability-based public-building PPPs and Chile\'s concession programme: ministry and multilateral disclosure. As an emerging-market PPP, all figures here are approximate and illustrative.',
    econ:{cur:'US$', host:'justice ministry', care:'public courthouse',
      roomsDef:24,roomsMin:8,roomsMax:50,roomsStep:1, chargeDef:680000,chargeMin:350000,chargeMax:1400000,chargeStep:25000,
      availDef:97.5,availMin:88,availMax:100,availStep:0.5, fmPerRoom:230000, fixedOM:1.5},
    calc:{build:150,grant:46,capex:2.5,revG:2.5,floor:13,cap:26,tax:27,exit:10,lev:4,rd:8,amort:3,hold:16},
    map:{footer:GEO.chile.footer}
  },

  /* ---------- 4 · AUSTRALIAN COURT PPP (Oceania · state justice-precinct availability PPP) ---------- */
  australia:{
    name:'Australian court PPP', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'australia',
    lede:'An Australian <b>PPP</b> — a private consortium financed, built and maintains a state justice precinct, and the state justice department pays a contracted, indexed availability payment for keeping it available, with <b>no demand risk</b>.',
    s1:'<p class="body">Australian states have delivered new <b>justice precincts</b> — consolidated court and tribunal complexes — as availability <b>PPPs</b>: a private consortium <b>finances, builds and maintains</b> the precinct, and the state justice department pays a contracted, inflation-indexed <b>availability payment</b> over a long term for keeping the building available and maintained. Backed by an <b>investment-grade</b> state government and denominated in Australian dollars, the availability core is a clean core-infrastructure cash flow.</p>'+
       '<p class="body">For the infrastructure investor, the part that matters is the <b>availability payment</b>: a contracted, indexed, demand-risk-free annuity for keeping a dignified, long-life civic building available, with <b>deductions</b> for unavailability. Court operations and case volumes sit with the state, not the FM/availability SPV. A small, simple, low-risk PPP, backed by a strong sub-sovereign, that anchors a core infrastructure portfolio.</p>',
    facts:[['PPP','Structure','finance·build·maintain'],['Justice precinct','Asset','courts &amp; tribunals'],['Availability','Payment','contracted, indexed'],['No demand risk','Revenue','availability, not case volumes'],['Investment-grade','Offtaker','state government'],['Long term','Concession','25-30 years']],
    s2:'Watch the precinct — a modern court complex, windows lit, the portico open, the scales over the door, the FM entrance busy. The <b>state justice department</b> pays the <b style="color:#0c6b4f">availability payment</b> for keeping the building available and maintained. The SPV\'s money is the <b>contracted payment on every courtroom kept available</b>, indexed — case volumes sit with the state. Drag the courtrooms, the charge and the availability — a core, government-backed annuity.',
    driverLab:'Charge / room', availLab:'Availability', hrK:'Availability payment', yrS:'rooms × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load Australian PPP',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment sit flat at the contracted level — the state pays for keeping the building <b>available and maintained</b>, not for the case activity that sits with the justice department. With an investment-grade state offtaker the discount rate is low and gearing high. Drop availability and deductions bite — a clean, contracted infrastructure cash flow.',
    s3:'The SPV earns a <b>contracted availability payment</b> for keeping the justice precinct available and maintained to standard, indexed to inflation, with <b>deductions</b> for unavailability. The availability core has <b>no demand risk</b> — court operations and case volumes sit with the state, not the FM/availability SPV. So the infrastructure income is a clean, fully contracted government annuity backed by an <b>investment-grade</b> state, set by the courtrooms, the charge and availability.',
    mb:{tag:'Model B · Australian PPP', title:'Government-backed availability precinct', body:'An Australian justice PPP in which a consortium finances, builds and maintains a court precinct and the state justice department pays a contracted, indexed availability payment for keeping it available — no demand risk, an investment-grade offtaker, deductions for unavailability. A small, simple, low-risk core annuity. <b>This is an Australian court PPP</b>.'},
    s4a:'The SPV carries <b>full facilities management and lifecycle</b> over the term — security, cleaning, building services plus plant renewal — sized so the availability payment covers it at a contracted margin. A courthouse is light to run, and with an investment-grade state offtaker the margin is steady. The defining feature is not the cost line but the <b>contracted, indexed payment</b> and the low discount rate a state government permits.',
    wfNote:'Operating cost is the through-life facilities management and lifecycle of a civic building plus soft FM, sized against a contracted payment. With deductions for unavailability, keeping the building available is the operational job; the value sits in the indexed, government-backed payment, not the case activity.',
    s4b:'The capital is the <b>precinct build</b>, financed by the consortium on high leverage and recovered over the long term. A portion may be state-funded, but the consortium funds the bulk and recovers it through the availability payment. Backed by an investment-grade state offtaker, the cash flow is contracted and indexed, so it gears well — a low-risk, long-life government annuity.',
    stackH:'The capital · the precinct build', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',12,'State contribution'],['s2',88,'Consortium project finance']],
    finList:[['','Asset','justice precinct (PPP)'],['sub','Structure','finance·build·maintain'],['','Revenue','availability payment'],['sub','Offtaker','state government'],['','Demand risk','none (availability core)'],['rest','Owner','infra-backed consortium']],
    finNote:'An Australian justice PPP is the <b>core-infrastructure annuity</b>: an indexed availability payment over a long term, no demand risk, an investment-grade state offtaker. Court operations sit with the state; the SPV\'s residual risk is FM and lifecycle delivery and deductions.',
    timeline:[['2014','<b>PPP contract</b> awarded for a new justice precinct.'],['2018','<b>Precinct opens</b> — consolidated courts and tribunals.'],['Term','<b>Availability payments</b> over the long maintenance term.'],['Operate','<b>State</b> runs court operations.'],['Indexed','<b>Payment indexation</b> tracks inflation.'],['Long-term','<b>Hand-back</b> of the building at term end.']],
    calcNote:'A working model of an <b>Australian justice PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high, so revenue is flat. A low cost of debt and high gearing reflect an investment-grade state offtaker.',
    s6:'An Australian court PPP is a core, government-backed annuity. What drives it:',
    breakers:['<b>Availability</b> — the payment is for keeping the building available; deductions bite for unavailability.','<b>State offtaker</b> — an investment-grade counterparty keeps the discount rate low and gearing high.','<b>Indexation</b> — the inflation-linked payment protects the real return over a long term.','<b>Case volumes</b> — court activity sits with the state, not the availability SPV — no demand risk.'],
    src:'Figures from public sources on Australian justice and court PPPs: state government and project disclosure. The figures are approximate and illustrative.',
    econ:{cur:'A$', host:'state justice dept', care:'justice precinct',
      roomsDef:34,roomsMin:12,roomsMax:68,roomsStep:1, chargeDef:1150000,chargeMin:600000,chargeMax:2300000,chargeStep:25000,
      availDef:98.5,availMin:90,availMax:100,availStep:0.5, fmPerRoom:350000, fixedOM:2.5},
    calc:{build:390,grant:55,capex:2.5,revG:2.5,floor:38,cap:72,tax:30,exit:11.5,lev:4,rd:5,amort:3,hold:18},
    map:{footer:GEO.australia.footer}
  },

  /* ---------- 5 · GULF JUSTICE COMPLEX PPP (Middle East · emerging availability PPP) ---------- */
  gulf:{
    name:'Gulf justice complex PPP', geo:'Gulf region', continent:'Middle East', cur:'US$', geoKey:'gulf',
    lede:'A Gulf <b>justice complex PPP</b> — a private consortium designs, builds, finances and maintains a flagship court complex, and the justice ministry pays a contracted availability charge, government-backed, with currency considerations.',
    s1:'<p class="body">Gulf states have begun to deliver social infrastructure — including flagship <b>justice complexes</b> — through availability <b>PPPs</b>. A private consortium <b>designs, builds, finances and maintains</b> the court complex and provides the FM services, while the <b>justice ministry</b> keeps court operations public and pays a contracted <b>availability charge</b> over a long concession, typically backed by the government.</p>'+
       '<p class="body">It is the availability PPP at <b>flagship scale</b>, with an emerging-market twist. The consortium takes <b>no demand risk</b> — case volumes are the state\'s — and earns a contracted, indexed <b>availability payment</b> for keeping the complex available and the FM delivered, with <b>deductions</b> for failures. The defining considerations are <b>FX and sovereign credit</b>: the payments may be hard-currency-linked and underpinned by a strong-but-emerging sovereign, so the credit and currency story drives the discount rate. A new block extends the complex. (The flag and figures here are illustrative.)</p>',
    facts:[['Justice complex','Asset','flagship court complex'],['DBFM + FM','Structure','design·build·finance·maintain'],['Availability','Payment','contracted, indexed'],['Government-backed','Credit','sovereign-backed'],['FX-linked','Currency','hard-currency considerations'],['No demand risk','Revenue','case volumes stay public']],
    s2:'Watch the complex — a flagship court building, windows lit, a grand columned portico, the scales over the door, a busy FM/services entrance. The <b>justice ministry</b> pays the <b style="color:#0c6b4f">availability charge</b> for keeping it available and the FM delivered, government-backed. The consortium\'s money is the <b>contracted payment on every courtroom kept available</b>, indexed. Drag the courtrooms, the charge and the availability — a contracted annuity with FX/sovereign considerations.',
    driverLab:'Charge / room', availLab:'Availability', hrK:'Availability charge', yrS:'rooms × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load Gulf complex',
    try:'<b>Try this:</b> push the <b>courtrooms</b> slider — a flagship complex is large, so the absolute availability charge balloons. Raise availability and the payment holds at the contracted level — the ministry pays for keeping the complex <b>available</b>, not for case activity. The credit and currency story (sovereign backing, FX linkage) sets the discount rate: a contracted annuity priced against an emerging-market sovereign.',
    s3:'The consortium earns a <b>contracted availability payment</b> for keeping the complex available and delivering the FM, indexed and often <b>hard-currency-linked</b>, with <b>deductions</b> for failures, and takes <b>no demand risk</b> — case volumes are the state\'s. The payment is underpinned by the <b>government</b>. The income is a flagship, fully contracted government annuity; the investor question is the <b>FX and sovereign credit</b> that set the discount rate.',
    mb:{tag:'Model B · justice complex PPP', title:'Sovereign-backed availability complex', body:'A flagship justice-complex PPP in which a consortium builds, finances and maintains a court complex and provides FM, paid a contracted, indexed, often FX-linked availability charge by the justice ministry under government backing — no demand risk, deductions for failures. A contracted annuity with FX/sovereign considerations. <b>This is a Gulf justice complex PPP</b>.'},
    s4a:'The consortium carries <b>full facilities management and lifecycle</b> across a flagship complex — FM services plus the renewal of building stock and plant — sized into the availability charge. A courthouse is light to run, so the margin is healthy, but the swing factor is not the cost line — it is the <b>contracted payment, the FX linkage and the sovereign credit</b> behind it.',
    wfNote:'Operating cost is the FM across a flagship complex plus the lifecycle renewal of building stock — real, because deductions penalise failures. The payment is set to cover it; the value driver is the indexed, often FX-linked payment and the sovereign credit behind the government backing.',
    s4b:'The capital is the <b>complex build</b> — a large, dignified, capital-intensive flagship building, financed on high leverage, often with international lenders. A <b>public or sovereign contribution</b> may meet part of the cost, with the consortium financing the balance and recovering it through the availability charge under government backing. A contracted, indexed annuity carried against <b>emerging-market sovereign</b> credit and FX.',
    stackH:'The capital · the complex build', splitL:'Who funds the build', splitR:'sovereign',
    split:[['s1',22,'Public / sovereign'],['s2',78,'Consortium finance']],
    finList:[['','Asset','flagship justice complex'],['sub','Structure','DBFM + FM PPP'],['','Revenue','contracted availability charge'],['sub','Credit','government-backed'],['','Key risk','FX &amp; sovereign'],['rest','Owner','PPP consortium']],
    finNote:'A Gulf justice-complex PPP is a <b>sovereign-backed contracted annuity</b>: an indexed, often FX-linked availability charge for keeping a flagship complex available, no demand risk. The whole investment debate is the <b>FX and sovereign credit</b> behind the government backing, more than the contract.',
    timeline:[['2020s','<b>Social-infrastructure PPP</b> programmes launched in the Gulf.'],['Build','<b>DBFM</b> of flagship justice complexes under PPP.'],['Open','<b>Availability charges</b> begin as complexes enter service.'],['Backing','<b>Government backing</b> underpins the payments.'],['Indexed','<b>Payment indexation</b> / FX linkage over the concession.'],['Transfer','<b>Transfer</b> of the complex to the state at term end.']],
    calcNote:'A working model of a <b>Gulf justice-complex PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; the floor binds when availability is high. A higher cost of debt reflects emerging-market sovereign and FX risk, so a strong contracted number nets down once discounted. Figures are highly illustrative.',
    s6:'A Gulf justice complex is a sovereign-backed contracted annuity. What drives it:',
    breakers:['<b>Availability</b> — the charge is for keeping the complex available; deductions bite for failures.','<b>Government backing</b> — the sovereign credit behind the payment is the security.','<b>FX &amp; sovereign</b> — hard-currency linkage and sovereign risk set the discount rate.','<b>FM &amp; lifecycle</b> — maintaining a flagship complex over decades is the operational job.'],
    src:'Figures from public sources on Gulf social-infrastructure and justice PPP programmes. As an emerging-market sovereign-backed PPP, all figures here — and the illustrative flag — are highly approximate.',
    econ:{cur:'US$', host:'justice ministry', care:'justice complex',
      roomsDef:42,roomsMin:14,roomsMax:80,roomsStep:1, chargeDef:850000,chargeMin:450000,chargeMax:1700000,chargeStep:25000,
      availDef:97.5,availMin:88,availMax:100,availStep:0.5, fmPerRoom:250000, fixedOM:3},
    calc:{build:330,grant:62,capex:2.5,revG:3,floor:34,cap:64,tax:20,exit:10,lev:4,rd:8,amort:3,hold:16},
    map:{footer:GEO.gulf.footer}
  },

  /* ---------- 6 · CHINESE SOCIAL-CAPITAL COURT COMPLEX (China · illustrative PPP) ---------- */
  china:{
    name:'Chinese social-capital court complex', geo:'China', continent:'China', cur:'¥', geoKey:'china',
    lede:'An illustrative Chinese <b>social-capital</b> court complex PPP — private (social) capital builds and maintains a public court complex and is remunerated through a long, contracted, availability-style government payment, at a low state cost of capital.',
    s1:'<p class="body">China has used <b>social-capital</b> (private-capital) participation to build and maintain public buildings under <b>PPP</b>-style arrangements, which can include <b>court complexes</b>: social capital <b>finances, builds and maintains</b> the building and provides the supporting services, while the <b>judicial authority</b> keeps court operations public and remunerates the partner through a long, contracted <b>government payment</b> over the concession.</p>'+
       '<p class="body">Modelled here as an <b>availability-style</b> PPP, the social-capital partner takes <b>limited demand risk</b> — the payment is structured around keeping the building available and the services delivered, indexed and government-backed, with adjustments for performance. The lever is a very <b>low state cost of capital</b>: a long, contracted, government-backed payment financed cheaply on a state-supported balance sheet compounds into a large, stable return. A new wing extends the asset. (Figures here are illustrative.)</p>',
    facts:[['Social capital','Structure','private finance · public mission'],['Availability-style','Payment','contracted, government-backed'],['Limited demand risk','Revenue','availability-structured'],['Low CoC','Funding','state-supported'],['Long concession','Term','25-30 years'],['State','Owner','social-capital partner']],
    s2:'Watch the complex — a large public court building, many windows lit, a grand portico, the scales over the door, a busy FM/services entrance. The <b>judicial authority</b> pays the <b style="color:#0c6b4f">contracted government payment</b> for keeping it available and the services delivered. The partner\'s money is the <b>contracted payment on every courtroom kept available</b>, indexed and government-backed. Drag the courtrooms, the charge and the availability — a large contracted annuity at a low state cost of capital.',
    driverLab:'Charge / room', availLab:'Availability', hrK:'Government payment', yrS:'rooms × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load China PPP',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment hold at the contracted level — modelled as an availability PPP, the judicial authority pays for keeping the complex <b>available and the services delivered</b>. With a very low state cost of capital the contracted annuity values richly. Push the courtrooms and the absolute payment balloons — scale and a low cost of capital are the model.',
    s3:'The social-capital partner earns a <b>contracted government payment</b> for keeping the court complex available and delivering the supporting services, indexed and government-backed, with performance adjustments. Modelled as an <b>availability PPP</b>, demand risk is limited. The counterparty is a state-backed judicial authority, so the payment is secure and the cost of capital low. The income is a large, contracted government annuity, set by the courtrooms, the charge and availability.',
    mb:{tag:'Model B · social-capital PPP', title:'State-backed availability court complex', body:'A social-capital court PPP in which private capital builds, finances and maintains a public court complex and is paid a long, contracted, availability-style government payment by a state-backed judicial authority — limited demand risk, a low cost of capital, indexed and government-backed. A large, secure annuity. <b>This is an illustrative Chinese social-capital court complex</b>.'},
    s4a:'The partner carries <b>facilities management and lifecycle</b> across a large court complex — supporting services plus building and plant renewal — sized into the government payment. A courthouse is light to run, and with a state-backed counterparty the margin is steady. The defining feature is the <b>contracted payment and the low cost of capital</b>, not the cost line.',
    wfNote:'Operating cost is the facilities management and lifecycle of a large court complex — supporting services plus building and plant renewal. The payment is set to cover it at a contracted margin; the value sits in the indexed, government-backed payment and the very low state cost of capital, not the cost line.',
    s4b:'The capital is the <b>complex build</b>, financed by the social-capital partner on a state-supported balance sheet at a very low cost of capital. A public contribution may meet part of the cost, with the partner financing the balance and recovering it through the government payment. A long, contracted, indexed, government-backed annuity — cheap to finance and large in absolute terms.',
    stackH:'The capital · the complex build', splitL:'Who funds the build', splitR:'state',
    split:[['s1',30,'Public contribution'],['s2',70,'Social-capital finance']],
    finList:[['','Asset','public court complex (PPP)'],['sub','Structure','social-capital PPP'],['','Revenue','contracted government payment'],['sub','Offtaker','state judicial authority'],['','Demand risk','limited (availability-style)'],['rest','Owner','social-capital partner']],
    finNote:'A Chinese social-capital court complex is a <b>large, state-backed contracted annuity</b>: an indexed, government-backed payment for keeping the building available, limited demand risk, a low cost of capital. The residual risk is FM and lifecycle delivery and the term and structure of the arrangement.',
    timeline:[['2010s','<b>Social-capital PPP</b> guidance encourages private participation in public buildings.'],['Build','<b>Social capital</b> finances and builds public court complexes.'],['Open','<b>Government payments</b> begin as buildings enter service.'],['Services','<b>Supporting services</b> delivered; court operations stay public.'],['Indexed','<b>Payment indexation</b> over the concession.'],['Long-term','<b>Hand-back</b> of the building at term end.']],
    calcNote:'A working model of a <b>Chinese social-capital court complex</b>, on an enterprise-value basis. Revenue is the contracted, government-backed availability-style payment; the floor binds when availability is high. A low cost of capital reflects a state-supported balance sheet. Figures are highly illustrative.',
    s6:'A social-capital court complex is a large, state-backed contracted annuity. What drives it:',
    breakers:['<b>Availability</b> — the payment is structured around keeping the building available and services delivered.','<b>State-backed offtaker</b> — a judicial authority keeps the cost of capital low and the payment secure.','<b>Cost of capital</b> — a very low state-supported rate is what makes the contracted annuity value richly.','<b>FM &amp; lifecycle</b> — maintaining a large court complex over decades is the operational job.'],
    src:'Figures from public sources and reporting on Chinese social-capital participation in public buildings and PPPs. Given limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', host:'judicial authority', care:'public court complex',
      roomsDef:46,roomsMin:16,roomsMax:90,roomsStep:1, chargeDef:780000,chargeMin:400000,chargeMax:1600000,chargeStep:25000,
      availDef:98,availMin:90,availMax:100,availStep:0.5, fmPerRoom:240000, fixedOM:3},
    calc:{build:400,grant:110,capex:2.5,revG:3,floor:36,cap:68,tax:25,exit:10,lev:4,rd:4,amort:3,hold:18},
    map:{footer:GEO.china.footer}
  }
  };
  var ORDER=['uk','ontario','chile','australia','gulf','china'];

  /* ===================================================================
     COURTHOUSE RENDERER  (canvas, 720x520) — top-down / elevation, daytime
     A dignified civic building: a columned / portico entrance with steps, a clock /
     pediment over the door, a small scales-of-justice motif, rows of lit windows
     (the building "available"), and an FM / services entrance with a maintenance
     van. A justice-ministry / government icon pays a contracted, indexed
     availability fee (the unitary charge) to the SPV; FM cost drains out. When
     availability is high the building is fully lit; if availability drops, some
     windows dim and a − DEDUCTION marker shows. A + EXTENSION marker appears if
     GEO.growing.
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

  /* ---- courthouse geometry ---- */
  var BLD={x:212,y:236,w:330,h:188};            // main courthouse building
  var PORT={x:286,y:424,w:182,h:54};            // columned portico + steps (below building)
  var FMENT={x:420,y:482,w:122,h:34};           // FM / services entrance
  var PED={cx:377,cy:262,r:34};                 // clock / pediment over the door
  var AUTH={x:556,y:150,w:140,h:96};            // justice-ministry icon (right)
  // courtroom window grid (built per asset)
  var WIN=[], NWIN=0;
  function layout(){
    WIN=[]; var cols=9, rows=4, gx=24, gy=24, cw=(BLD.w-2*gx)/cols, ch=(BLD.h-2*gy-34)/rows;
    for(var r=0;r<rows;r++) for(var c=0;c<cols;c++){
      WIN.push({x:BLD.x+gx+c*cw+2, y:BLD.y+gy+34+r*ch, w:cw-4, h:ch-5, ph:((r*5+c*7)%10)});
    }
    NWIN=WIN.length;
  }

  /* ---- base map: civic plaza ground + forecourt + approach path ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e3e9e1'); g.addColorStop(1,'#d6ddce');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // landscaped plaza patch
    ctx.fillStyle='rgba(120,160,120,0.10)'; rr(28,236,150,210,16); ctx.fill();
    // civic forecourt / plaza
    ctx.fillStyle='rgba(150,158,150,0.16)'; rr(200,228,W-232,288,14); ctx.fill();
    // approach path up to the portico steps
    ctx.strokeStyle='rgba(120,128,120,0.5)'; ctx.lineWidth=16; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(W/2-110,H-16); ctx.quadraticCurveTo(W/2-20,500,PORT.x+PORT.w/2,PORT.y+PORT.h-6); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1; ctx.setLineDash([8,10]); ctx.lineDashOffset=-(T*1.0);
    ctx.beginPath(); ctx.moveTo(W/2-110,H-16); ctx.quadraticCurveTo(W/2-20,500,PORT.x+PORT.w/2,PORT.y+PORT.h-6); ctx.stroke(); ctx.setLineDash([]);
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

  /* ---- scales-of-justice motif over the door ---- */
  function scales(cx,cy,col){
    ctx.save();
    ctx.strokeStyle=col; ctx.lineWidth=1.6; ctx.lineCap='round';
    // central post
    ctx.beginPath(); ctx.moveTo(cx,cy-9); ctx.lineTo(cx,cy+8); ctx.stroke();
    // beam
    ctx.beginPath(); ctx.moveTo(cx-11,cy-7); ctx.lineTo(cx+11,cy-7); ctx.stroke();
    // pans (small arcs) and hangers
    ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(cx-11,cy-7); ctx.lineTo(cx-11,cy-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+11,cy-7); ctx.lineTo(cx+11,cy-2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx-11,cy-2,3.4,0,Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+11,cy-2,3.4,0,Math.PI); ctx.stroke();
    // base
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(cx,cy+9,1.8,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  /* ---- the clock / pediment over the door ---- */
  function pediment(accent){
    var p=PED;
    // triangular pediment
    ctx.fillStyle=shade(accent,0.92); ctx.beginPath();
    ctx.moveTo(p.cx-46,p.cy+10); ctx.lineTo(p.cx,p.cy-18); ctx.lineTo(p.cx+46,p.cy+10); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1; ctx.stroke();
    // clock face
    ctx.fillStyle='#f6f7f4'; ctx.beginPath(); ctx.arc(p.cx,p.cy-1,9,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(60,72,66,0.6)'; ctx.lineWidth=1; ctx.stroke();
    // clock hands (slow live tick)
    var a=T*0.01;
    ctx.strokeStyle='rgba(40,52,46,0.85)'; ctx.lineWidth=1.3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(p.cx,p.cy-1); ctx.lineTo(p.cx+Math.cos(a)*6,p.cy-1+Math.sin(a)*6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p.cx,p.cy-1); ctx.lineTo(p.cx+Math.cos(a*12)*4,p.cy-1+Math.sin(a*12)*4); ctx.stroke();
    ctx.lineCap='butt';
    // scales motif under the pediment
    scales(p.cx,p.cy+16,'rgba(255,255,255,0.92)');
  }

  /* ---- main courthouse building (elevation-ish top-down) ---- */
  function building(accent,litFrac){
    var b=BLD;
    // shadow
    ctx.fillStyle='rgba(20,34,28,0.14)'; rr(b.x+6,b.y+b.h-4,b.w,12,6); ctx.fill();
    // body
    var g=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h); g.addColorStop(0,'#f3f5f2'); g.addColorStop(1,'#dfe4dd');
    ctx.fillStyle=g; rr(b.x,b.y,b.w,b.h,8); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // accent fascia band (the courthouse's livery)
    ctx.fillStyle=accent; rr(b.x,b.y,b.w,20,8); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='700 11px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('COURTHOUSE',b.x+14,b.y+14);
    // a small scales-of-justice plaque on the fascia
    scales(b.x+b.w-18,b.y+10,'#fff');
    // courtroom windows: lit up to litFrac
    var nLit=Math.round(NWIN*litFrac);
    for(var i=0;i<NWIN;i++) win(WIN[i], i<nLit);
    // clock / pediment + scales over the door
    pediment(accent);
  }

  /* ---- a maintenance / FM van ---- */
  function fmvan(x,y){
    ctx.fillStyle='rgba(20,34,28,0.16)'; rr(x+1,y+11,34,4,2); ctx.fill();
    ctx.fillStyle='#d8c47a'; rr(x,y,34,13,3); ctx.fill();
    ctx.strokeStyle='rgba(120,110,80,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
    ctx.fillStyle='rgba(60,72,66,0.7)'; rr(x+24,y+2,7,5,1); ctx.fill();
    ctx.fillStyle='rgba(90,80,55,0.8)'; ctx.font='700 6px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('FM',x+13,y+9);
  }

  /* ---- columned portico entrance + steps ---- */
  function portico(accent,live){
    var p=PORT;
    // steps (a few stacked bands)
    ctx.fillStyle='rgba(150,158,150,0.30)'; rr(p.x-6,p.y+p.h-8,p.w+12,8,3); ctx.fill();
    ctx.fillStyle='rgba(165,172,165,0.34)'; rr(p.x-2,p.y+p.h-14,p.w+4,8,3); ctx.fill();
    // portico base / plinth
    var g=ctx.createLinearGradient(p.x,p.y,p.x,p.y+p.h); g.addColorStop(0,'#f1f3ef'); g.addColorStop(1,'#dde2da');
    ctx.fillStyle=g; rr(p.x,p.y,p.w,p.h-12,6); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // entablature band
    ctx.fillStyle=accent; rr(p.x,p.y,p.w,9,5); ctx.fill();
    // columns
    ctx.fillStyle='rgba(120,130,120,0.55)';
    for(var cx=p.x+12;cx<=p.x+p.w-16;cx+=22){ rr(cx,p.y+11,7,p.h-26,1.5); ctx.fill(); }
    // a small triangular pediment cap on the portico
    ctx.fillStyle=shade(accent,0.9); ctx.beginPath();
    ctx.moveTo(p.x+p.w/2-22,p.y); ctx.lineTo(p.x+p.w/2,p.y-10); ctx.lineTo(p.x+p.w/2+22,p.y); ctx.closePath(); ctx.fill();
    // entrance glow if available
    if(live){ glow(p.x+p.w/2,p.y+p.h-14,12,'rgba(255,214,130,0.35)'); }
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('PORTICO ENTRANCE',p.x+p.w/2,p.y+p.h+4);
  }

  /* ---- FM / services entrance ---- */
  function fmentrance(){
    var f=FMENT;
    ctx.fillStyle='rgba(176,125,36,0.10)'; rr(f.x,f.y,f.w,f.h,7); ctx.fill();
    ctx.strokeStyle='rgba(176,125,36,0.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='#9a7320'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('FM / SERVICES',f.x+8,f.y+13);
    fmvan(f.x+f.w-44, f.y+15);
  }

  /* ---- justice-ministry (offtaker) icon ---- */
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
    // scales over the ministry icon
    scales(a.x+a.w/2,a.y+24,accent);
    ctx.fillStyle='rgba(70,82,76,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('JUSTICE MINISTRY',a.x+a.w/2,a.y+62);
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
    var rooms=parseFloat(sCap.value), charge=parseFloat(sSpread.value), avail=parseFloat(sAvail.value)/100;
    var accent=G.accent||'#2f5fb0';

    ctx.clearRect(0,0,W,H);
    drawMap();

    // justice ministry + the courthouse
    authority(G.authority||'JUSTICE MINISTRY', accent);
    building(accent, Math.max(0,Math.min(1,avail)));     // windows lit up to availability
    portico(accent, avail>0.5);
    fmentrance();

    // ---- economics (the availability PPP / PFI: a contracted government annuity, NO demand risk) ----
    var grossCharge=rooms*charge;
    var revenue=grossCharge*avail;            // deductions for unavailability/performance
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));      // floor = contracted minimum availability payment
    var opex= rooms*(E.fmPerRoom||0) + (E.fixedOM||0)*1e6;  // FM (security, cleaning, lifecycle)
    var ebitda=revenue-opex;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // waterfall opex rows: FM & lifecycle
    var c_sec=opex*0.34, c_clean=opex*0.28, c_life=opex*0.26, c_admin=opex*0.12;
    // share of "+cash" that is the contracted floor vs the indexation slice
    var floorBinds = floor>0 && revenue<=floor+1;
    var contractShare = floorBinds ? Math.min(0.5, floor/Math.max(1,revenue)) : 0.20;

    // deduction marker if availability is below the contracted threshold
    var deduct = avail < 0.97;

    // money-flow: +cash (availability fee) flows from the ministry to the SPV;
    //   amber = indexation slice; −cash (FM) drains at the FM entrance
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
    ctx.fillText((G.tier==='flagship'?'FLAGSHIP · ':'REGIONAL · ')+(G.model||'PPP')+' · AVAILABLE',BLD.x,BLD.y-8); ctx.restore();
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
      ctx.fillText('+ EXTENSION',0,0); ctx.restore();
    }

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+rooms+' courtrooms',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',rooms+' rooms'); set('ixSpreadV',CUR+kfmt(charge)+'/room'); set('ixAvailV',(Math.round(avail*1000)/10)+'%');
    set('ixDir',rooms+' courtrooms'); set('ixDirS',(G.model||'PPP')+' · '+E.care);
    set('ixMW',(Math.round(avail*1000)/10)+'% available'); set('ixMWs',(deduct?'below threshold · deductions':'at contract · no demand risk')+' · '+(E.host||'ministry'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Security',c_sec],['Cleaning',c_clean],['Lifecycle',c_life],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the charge is too thin to value — raise the courtrooms, the unitary charge or the availability.</span>'; return; }
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
    sCap.min=E.roomsMin; sCap.max=E.roomsMax; sCap.step=E.roomsStep; sCap.value=E.roomsDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is a contracted availability payment, the unitary charge (courtrooms × charge per courtroom × availability), with no demand risk (it does not depend on case volumes), reduced only by deductions for unavailability or performance, and the returns model is a simplified DCF in which a public capital contribution offsets the courthouse build cost; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.roomsDef; sSpread.value=E.chargeDef; sAvail.value=E.availDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'uk');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
