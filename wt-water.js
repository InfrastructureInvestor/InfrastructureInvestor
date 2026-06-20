/* Water & wastewater, data-driven worked examples.
   Six real water utilities, one template. Scene config from wt-geo.js (GEO),
   drawn as a top-down water cycle in 720x520. Figures are illustrative: revenue
   uses the regulated building-block (return on RAB + depreciation + opex +
   incentive) and the returns model is a simplified DCF. */
(function(){
  var CUR='£';
  var A=null;
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;
  var coins=[], _anim=false, demHist=[], drops=[];
  function rnd(a,b){ return a+Math.random()*(b-a); }

  function money(v){ var n=v<0; v=Math.abs(v); var o;
    if(v>=1e9)o=(v/1e9).toFixed(2)+'bn'; else if(v>=1e6)o=(v/1e6).toFixed(0)+'m';
    else if(v>=1e3)o=Math.round(v/1e3)+'k'; else o=''+Math.round(v);
    return (n?'−':'')+CUR+o; }
  function m1(v){ return (v/1e6).toFixed(1); }
  function set(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; }
  function html(id,t){ var e=document.getElementById(id); if(e) e.innerHTML=t; }
  function fmtBn(v){ return CUR+(v>=100?Math.round(v):(Math.round(v*10)/10))+'bn'; }
  function pctS(v){ return (v>=0?'+':'')+(Math.round(v*10)/10)+'%'; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  unitedutils:{
    name:'United Utilities', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'unitedutils',
    lede:'A listed UK water and sewerage company, the textbook <b>RAB-regulated</b> water monopoly, earning a return on its asset base under Ofwat, now in a record investment cycle.',
    s1:'<p class="body">A water utility runs the whole <b>water cycle</b>: it abstracts raw water from reservoirs and rivers, treats it, and pipes it to homes; then it collects the wastewater, treats it, and returns it cleanly to the environment. A <b>water and sewerage company (WaSC)</b> does both halves; it is a regional <b>natural monopoly</b>, so it is regulated.</p>'+
       '<p class="body"><b>United Utilities</b> serves the North-West of England, ~7&nbsp;million people. Its revenue is set by <b>Ofwat</b> on a <b>Regulated Asset Base</b> basis: a return on capital at an allowed rate, plus depreciation and an opex allowance, with outcome incentives (ODIs). Revenue is decoupled from volume. The defining feature of the current period (<b>PR24</b>) is a step-change in capex, for storm overflows, leakage, resilience and new supply, which grows the RAB sharply but stretches financing and customer bills.</p>',
    facts:[['~£15bn','Regulated Asset Base','Ofwat PR24'],['~7m','People served','North-West England'],['WaSC','Scope','water + wastewater'],['~53%','EBITDA margin','regulated'],['Ofwat','Regulator','PR24 (2025–30)'],['Record capex','Driver','overflows · leakage · resilience']],
    s2:'Watch the cycle. Raw water is drawn from a <b>reservoir</b>, cleaned at a <b>treatment works</b>, and piped to the town; wastewater drains through the sewers to a <b>wastewater works</b> and is returned, treated, to the river. But the <b style="color:#0c6b4f">money</b> the owner earns rises from the <b>assets</b>, the works, mains and sewers, not from the litres. Drag the RAB and allowed return; revenue tracks the <b>asset base and the regulator\'s return</b>.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load United Utilities',
    try:'<b>Try this:</b> the <b>volume doesn\'t move the revenue</b>, water is paid for the network. Nudge the allowed return. The dominant force in PR24 is RAB <i>growth</i>: a record capex programme compounds the base, but watch the financing, because the gearing and customer bills are exactly what got <b>Thames Water</b> into trouble.',
    s3:'United Utilities earns a <b>regulated allowed revenue</b> on the Ofwat building blocks, a return on the RAB, depreciation, an opex allowance, and outcome-delivery incentives (rewards/penalties for leakage, pollution, supply interruptions). Revenue is decoupled from volume. The PR24 programme grows the RAB fast; the investor question is the <b>allowed WACC</b>, the deliverability and financeability of the capex, and the regulatory/political pressure on bills and performance.',
    mb:{tag:'Model B · RAB-regulated', title:'Listed water & sewerage monopoly', body:'A listed regional monopoly whose revenue is set by Ofwat as a <b>return on its Regulated Asset Base</b> plus depreciation, opex and outcome incentives, decoupled from volume, in a record investment cycle. <b>This is United Utilities</b>, a UK WaSC under PR24.'},
    s4a:'A water utility\'s costs are real, power for pumping, chemicals, sludge, and a large workforce across treatment works and a vast pipe network, so the margin is lower than electricity or gas networks. But against a RAB-based revenue it is still healthy and stable; the swing factor is the capex programme, not the running cost.',
    wfNote:'Operating cost is power, chemicals, sludge treatment and a large workforce across the cycle, heavier than electricity/gas networks, so the margin is lower. The value driver is RAB growth and the allowed return, not the volume of water.',
    s4b:'The capital is the <b>~£15&nbsp;billion RAB</b>, reservoirs, treatment works, and tens of thousands of kilometres of water mains and sewers. PR24 mandates a record capital programme (storm-overflow reduction, leakage, resilience, new supply); each pound is added to the RAB and earns the allowed return, but it must be financed without the over-gearing that sank Thames Water.',
    stackH:'The capital base · ~£15bn RAB', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',60,'Regulated debt (~60% gearing)'],['s2',40,'Equity (listed)']],
    finList:[['','Regulated Asset Base','~£15bn'],['sub','Ofwat price control','PR24 (2025–30)'],['','Allowed revenue','return + dep + opex + ODIs'],['sub','PR24 capex','record programme'],['','Incentives','leakage · pollution · supply'],['rest','Owner','listed (LSE)']],
    finNote:'A RAB-regulated water company is a <b>steady, inflation-linked cash flow with a financing test</b>: the return is reliable and geared, but the record capex and the politics of bills and performance make financeability and the allowed WACC the live debates, with Thames Water the cautionary tale of over-gearing.',
    timeline:[['1989','<b>Water privatised</b> in England & Wales.'],['1990s+','<b>Periodic Ofwat price reviews</b> set allowed revenue.'],['2020s','<b>Storm-overflow scandal</b> drives political and regulatory pressure.'],['2024','<b>Thames Water</b> crisis spotlights gearing and resilience.'],['2025','<b>PR24</b> begins (2025–30), a record capex step-up.'],['Future','<b>Financeability &amp; bills</b> dominate the debate.']],
    calcNote:'A working model of a <b>RAB-regulated water company</b>. The build/entry cost is the RAB, the unlevered return tracks the <b>allowed WACC</b>, and growth is high (the PR24 capex step-up). Margins are lower than electricity/gas networks, water is opex-heavy.',
    s6:'United Utilities is a steady regulated monopoly in a record investment cycle. What moves the return:',
    breakers:['<b>The allowed WACC</b>, Ofwat\'s cost-of-capital decision is the biggest near-term lever.','<b>RAB growth &amp; financeability</b>, the PR24 capex compounds the base, but must be financed prudently.','<b>Outcome incentives</b>, leakage, pollution and supply performance add or subtract.','<b>Politics &amp; bills</b>, public and regulatory pressure on bills and performance (the Thames Water shadow).'],
    src:'Figures from public sources: <a href="https://www.unitedutilities.com/corporate/" target="_blank" rel="noopener">United Utilities</a> and <a href="https://www.ofwat.gov.uk/" target="_blank" rel="noopener">Ofwat PR24</a> disclosure. Figures are approximate and illustrative.',
    econ:{cur:'£',gw:0,cust:7,
      rabDef:15,rabMin:6,rabMax:26,rabStep:0.5, waccDef:5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:1.3, anc:0},
    calc:{build:15000,grant:0,capex:38,revG:5,floor:1900,cap:4000,tax:25,exit:10,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.unitedutils.footer}
  },

  amwater:{
    name:'American Water', geo:'US (multi-state)', continent:'North America', cur:'US$', geoKey:'amwater',
    lede:'The largest listed water utility in the US, an <b>investor-owned utility</b> regulated state-by-state on a <b>rate base × allowed return</b> basis, growing by acquiring municipal systems.',
    s1:'<p class="body"><b>American Water</b> serves ~14&nbsp;million people across many US states. American water is highly <b>fragmented</b>, most systems are small and municipal, so the investor-owned model is partly a <b>roll-up</b>: buying ageing municipal water and wastewater systems, bringing them up to standard, and earning a regulated return on the invested capital.</p>'+
       '<p class="body">Each state regulates on <b>cost-of-service</b>: a return on <b>rate base</b> at an allowed <b>ROE</b> (~9–10%), set in rate cases. The growth engine is twofold, the huge <b>infrastructure-replacement</b> need (much US water pipe is a century old) and <b>acquisitions</b> of municipal systems, both of which grow the rate base at a high allowed return. It is one of the most reliable compounding stories in regulated infrastructure.</p>',
    facts:[['~$20bn','Rate base','multi-state'],['~14m','People served','many states'],['Roll-up','Growth','municipal acquisitions'],['~59%','EBITDA margin','regulated'],['State PUCs','Regulator','rate cases'],['~9.5%','Allowed ROE','cost-of-service']],
    s2:'The cycle is the same, abstract, treat, distribute, collect, treat, discharge, but American Water replicates it across many states, and grows by buying municipal systems and replacing ageing pipe. The <b style="color:#0c6b4f">return</b> rises from the rate base. Drag the levers, a high allowed return on a steadily growing base.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on rate base', yrS:'return + depreciation + opex',
    preset:'Load American Water',
    try:'<b>Try this:</b> the US allowed return is <b>higher</b> than a UK water company\'s, a ~9.5% ROE rewards heavy pipe-replacement and acquisitions. Wind the rate base up: the compounding from infrastructure renewal plus municipal roll-up is the whole thesis, at a high allowed ROE.',
    s3:'American Water earns a <b>state-regulated allowed revenue</b> in rate cases: a return on rate base at the allowed ROE, plus depreciation and opex. Growth comes from <b>pipe replacement</b> (a vast, decades-long need) and <b>acquiring municipal systems</b>, both entering the rate base at the allowed return. The case is reliable rate-base compounding at a high ROE, against rate-case and political-affordability risk.',
    mb:{tag:'Model B · cost-of-service', title:'Investor-owned water utility', body:'A listed water utility regulated state-by-state on <b>cost-of-service</b>, growing the rate base through pipe replacement and municipal acquisitions at a high allowed ROE. Reliable compounding, with rate-case and affordability risk. <b>This is American Water</b>, the largest US listed water utility.'},
    s4a:'Running water and wastewater across many states carries real power, chemical and workforce costs, but against a large rate base the margin is healthy. The defining feature is the <b>rate base</b>, it grows with replacement and acquisitions, and each state allows a return on it.',
    wfNote:'Operating cost is power, chemicals, treatment and workforce across many systems, recovered in rate cases. The swing factor for value is the rate base, the allowed ROE and the pace of acquisitions, not the volume.',
    s4b:'The capital is the <b>~$20&nbsp;billion rate base</b>, financed investment-grade, plus a steady stream of acquisitions and a multi-decade pipe-replacement programme, each project entering the rate base at the allowed return. The runway is long: most US water infrastructure needs renewal.',
    stackH:'The capital base · ~$20bn rate base', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',55,'Long-term debt'],['s2',45,'Equity (allowed ROE)']],
    finList:[['','Rate base','~$20bn'],['sub','Regulator','state PUCs'],['','Allowed ROE','~9.5% (cost-of-service)'],['sub','Growth','pipe replacement + acquisitions'],['','People served','~14m'],['rest','Owner','NYSE-listed (AWK)']],
    finNote:'A US water IOU is a <b>reliable compounder</b>: the same regulated cash flow at a higher ROE, with a long runway from infrastructure renewal and municipal roll-up. The risks are rate-case timing and the affordability politics of water bills.',
    timeline:[['1886','<b>American Water</b> founded.'],['2008','<b>IPO</b>, emerges as the largest US listed water utility.'],['2010s','<b>Municipal acquisitions</b> accelerate the roll-up.'],['2020s','<b>Pipe-replacement</b> programme runs for decades.'],['Periodic','<b>Rate cases</b> reset revenue and ROE state-by-state.'],['Future','<b>Affordability</b> and lead-pipe replacement in focus.']],
    calcNote:'A working model of a <b>cost-of-service water IOU</b>. The allowed return is higher than a UK water company, growth reflects replacement plus acquisitions, and the exit multiple is robust, a reliable compounder.',
    s6:'American Water is reliable regulated compounding. What drives it:',
    breakers:['<b>The allowed ROE</b>, state rate-case decisions are the biggest near-term lever.','<b>Rate-base growth</b>, pipe replacement and municipal acquisitions compound the base.','<b>Acquisition pipeline</b>, the fragmented US market is a long roll-up runway.','<b>Affordability</b>, the politics of water bills and regulatory lag.'],
    src:'Figures from public sources: <a href="https://www.amwater.com/" target="_blank" rel="noopener">American Water</a> investor disclosure and state rate-case filings. Figures are approximate and illustrative.',
    econ:{cur:'US$',gw:0,cust:14,
      rabDef:20,rabMin:8,rabMax:34,rabStep:0.5, waccDef:7,waccMin:4,waccMax:11,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:1.6, anc:0},
    calc:{build:20000,grant:0,capex:42,revG:5,floor:2600,cap:5500,tax:25,exit:11,lev:5,rd:5,amort:1,hold:25},
    map:{footer:GEO.amwater.footer}
  },

  sabesp:{
    name:'Sabesp', geo:'São Paulo, Brazil', continent:'South America', cur:'R$', geoKey:'sabesp',
    lede:'One of the world\'s largest water utilities, <b>recently privatised</b>, serving São Paulo, with a mandate to reach universal water and sewerage access.',
    s1:'<p class="body"><b>Sabesp</b> provides water and sewerage to the São Paulo metropolitan region, tens of millions of people, one of the largest water utilities on earth. Long a state company, it was <b>privatised</b> in 2024 (the state sold down to a reference shareholder and the market), a landmark deal in global water.</p>'+
       '<p class="body">The investment case is <b>universalisation</b>: under Brazil\'s sanitation framework, the company is committed to bringing water and especially <b>sewerage</b> to everyone in its area, a vast capex programme that grows the regulatory asset base. Regulated by the state regulator on a tariff/RAB basis, the cash flow is regulated and indexed, but priced against Brazilian rates and currency, a growth story at an emerging-market discount rate.</p>',
    facts:[['large','Regulatory asset base','one of the world\'s biggest'],['~28m','People served','metro São Paulo'],['2024','Privatised','state sold down'],['~48%','EBITDA margin','EM-regulated'],['Universalisation','Driver','water + sewerage for all'],['ARSESP','Regulator','tariff / RAB']],
    s2:'The cycle runs at huge scale across a megacity, and the story is <b>expansion</b>, especially extending sewerage to areas that never had it. The <b>return</b> rises from a growing asset base; drag the levers, the upside is universalisation capex, the risk is the Brazilian discount rate.',
    driverLab:'Allowed return', availLab:'Efficiency gain', hrK:'Return on assets', yrS:'regulated tariff revenue',
    preset:'Load Sabesp',
    try:'<b>Try this:</b> Sabesp\'s thesis is <b>universalisation</b>, a huge capex programme to connect everyone to water and sewerage, growing the RAB. Wind it up to see the compounding. But push the cost of debt: a strong nominal Brazilian return nets down once discounted like an EM asset, and privatisation execution is the swing factor.',
    s3:'Sabesp earns a <b>regulated tariff</b> on a RAB/tariff basis, set by the state regulator, plus efficiency upside post-privatisation. The dominant lever is the <b>universalisation capex</b>, extending water and sewerage, which grows the base. Privatisation is expected to unlock efficiency and faster delivery. The investor question is the discount rate (Brazilian rates and the real), the regulatory framework, and execution of the build-out.',
    mb:{tag:'Model B · privatised growth', title:'Privatised water utility (EM, growth)', body:'A recently privatised, regulated water utility serving a megacity, with a universalisation capex mandate that grows the asset base, plus efficiency upside. Regulated and indexed with structural growth, but priced against EM rates and currency, with privatisation-execution risk. <b>This is Sabesp</b>.'},
    s4a:'A megacity water utility carries large power, chemical and workforce costs across an enormous network, so the margin is on the lower side, with efficiency upside as privatisation bites. The real determinants of value are the universalisation capex and the Brazilian discount rate.',
    wfNote:'Operating cost is power, chemicals, treatment and a large workforce across a megacity. Privatisation targets efficiency gains; the swing factors are the universalisation capex and the macro, not the running cost.',
    s4b:'The capital is the network plus a <b>universalisation programme</b>, extending water and especially sewerage across the metro region, financed by the privatised company against Brazilian conditions. Modelled on an enterprise-value basis, the return is a <b>high-nominal emerging-market</b> one on a growing, indexed base.',
    stackH:'The capital stack · privatised utility', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local debt (indexed)'],['s2',45,'Equity (reference shareholder + market)']],
    finList:[['','Regulatory asset base','among the world\'s largest'],['sub','Regulator','state (ARSESP)'],['','People served','~28m'],['sub','Mandate','universal water + sewerage'],['','Privatised','2024'],['rest','Risk','execution + currency']],
    finNote:'A privatised megacity water utility is a <b>universalisation growth story at an EM discount rate</b>: the base compounds as access expands, efficiency rises post-privatisation, but Brazilian rates and execution dominate the valuation.',
    timeline:[['1973','<b>Sabesp created</b> as São Paulo\'s state water company.'],['2002','<b>Listed</b> (with the state in control).'],['2020','<b>Brazil\'s sanitation framework</b> sets universalisation targets.'],['2024','<b>Privatised</b>, state sells down to a reference shareholder + market.'],['2020s','<b>Universalisation capex</b> accelerates.'],['Future','<b>Efficiency &amp; access</b> delivery in focus.']],
    calcNote:'A working model of a <b>privatised EM water utility</b>, on an enterprise-value basis. The base grows with universalisation capex, the floor is high (regulated/indexed), but the cost of debt is high to reflect Brazilian rates, a strong nominal return nets down once discounted like an EM asset.',
    s6:'Sabesp is a universalisation growth story at a Brazilian discount rate. What drives it:',
    breakers:['<b>Universalisation capex</b>, extending water and sewerage compounds the base.','<b>Privatisation execution</b>, delivering efficiency and faster build-out post-sale.','<b>Country &amp; currency</b>, Brazilian rates and the real set the discount rate.','<b>The regulatory framework</b>, tariff/RAB rules and access targets.'],
    src:'Figures from public sources: <a href="https://ri.sabesp.com.br/en/" target="_blank" rel="noopener">Sabesp</a> and the 2024 privatisation disclosure. Figures are approximate and illustrative.',
    econ:{cur:'R$',gw:0,cust:28,
      rabDef:60,rabMin:25,rabMax:100,rabStep:1, waccDef:7.5,waccMin:4,waccMax:12,waccStep:0.25,
      perfDef:0.5,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:8, anc:0},
    calc:{build:60000,grant:0,capex:28,revG:6,floor:9000,cap:19000,tax:34,exit:9,lev:4,rd:9,amort:2,hold:25},
    map:{footer:GEO.sabesp.footer}
  },

  sydneywater:{
    name:'Sydney Water', geo:'Sydney, Australia', continent:'Oceania', cur:'A$', geoKey:'sydneywater',
    lede:'Sydney\'s water and wastewater utility, a <b>state-owned corporation</b> regulated by IPART, balancing drought resilience (desalination) with a fast-growing city.',
    s1:'<p class="body"><b>Sydney Water</b> supplies water and wastewater services to ~5&nbsp;million people across Greater Sydney. Unlike the UK or US, Australian urban water is mostly <b>publicly owned</b>: Sydney Water is a <b>state-owned corporation</b>, run commercially but owned by the NSW government, with prices regulated by <b>IPART</b> on a building-block (RAB) basis.</p>'+
       '<p class="body">The defining challenges are <b>drought resilience</b>, Sydney built a major desalination plant for dry years, and <b>growth</b>: servicing a fast-expanding city with new water and wastewater infrastructure. The cash flow is regulated and stable; as a state asset the cost of capital is low and the objective blends commercial return with public service, but the model is the same RAB building block.</p>',
    facts:[['~A$20bn','Regulated Asset Base','growing'],['~5m','People served','Greater Sydney'],['Desal','Resilience','drought backup'],['~55%','EBITDA margin','regulated'],['IPART','Regulator','price determination'],['State-owned','Ownership','NSW government']],
    s2:'The cycle runs across a growing city, with a <b>desalination</b> plant as drought insurance. The <b>return</b> rises from the regulated asset base; drag the levers, a state-owned, IPART-regulated utility building for growth and resilience at a low cost of capital.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load Sydney Water',
    try:'<b>Try this:</b> the mechanics are the same RAB building block, but the allowed return on a <b>state-owned</b> utility sits at a low cost of capital. Wind the RAB up: growth and drought-resilience capex compound the base. The owner is the state, so the objective blends return with public service.',
    s3:'Sydney Water earns a <b>regulated revenue</b> set by IPART on a building-block (RAB) basis, a return on the asset base, depreciation and an opex allowance. The levers are <b>growth capex</b> (servicing new suburbs) and <b>resilience</b> (desalination, recycling). As a state-owned corporation the cost of capital is low; the case is a stable regulated utility whose objective blends commercial return with public service.',
    mb:{tag:'Model B · state-owned', title:'State-owned water corporation', body:'A government-owned, commercially-run water utility regulated by IPART on a RAB building-block basis, building for growth and drought resilience. Low cost of capital, stable and regulated, but a state owner blending return with public service. <b>This is Sydney Water</b>.'},
    s4a:'Sydney Water carries normal water-utility costs, power, treatment, workforce, plus the energy of running desalination when needed, so the margin is solid but not high. The defining feature is the growth-and-resilience capex on which IPART allows a return.',
    wfNote:'Operating cost is power, chemicals, treatment and workforce, plus desalination energy in dry years. The swing factor for value is the growth and resilience capex, on which IPART allows a return.',
    s4b:'The capital is the <b>~A$20&nbsp;billion RAB</b> plus a large growth-and-resilience programme, new-suburb servicing, desalination, recycling and renewals, financed on a state-backed balance sheet. Each project grows the base and earns the IPART-allowed return.',
    stackH:'The capital base · ~A$20bn RAB', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'NSW government, state-owned corporation']],
    finList:[['','Regulated Asset Base','~A$20bn'],['sub','Regulator','IPART'],['','People served','~5m'],['sub','Resilience','desalination + recycling'],['','Driver','city growth + renewals'],['rest','Cost of capital','low (state-backed)']],
    finNote:'A state-owned water corporation is a <b>stable regulated utility at a low cost of capital</b>: the return is reliable and the base grows with the city, but the owner is the state, blending commercial return with public-service objectives.',
    timeline:[['1888','<b>Sydney water board</b> established.'],['1995','<b>Corporatised</b> as a state-owned corporation.'],['2010','<b>Sydney desalination plant</b> opens for drought resilience.'],['2020s','<b>Growth servicing</b> for a fast-expanding city.'],['Periodic','<b>IPART determinations</b> reset prices.'],['Future','<b>Resilience &amp; recycling</b> investment grows the RAB.']],
    calcNote:'A working model of a <b>state-owned, IPART-regulated</b> water utility. The cost of capital is low (state-backed), growth reflects city expansion and resilience capex, and the return is steady on a growing base.',
    s6:'Sydney Water is state-backed regulated water building for growth and resilience. What drives it:',
    breakers:['<b>The allowed WACC</b>, IPART\'s determination is the biggest near-term lever.','<b>RAB growth</b>, city growth, renewals and resilience capex compound the base.','<b>Drought &amp; resilience</b>, desalination and recycling investment.','<b>State ownership</b>, low cost of capital, but public-service objectives.'],
    src:'Figures from public sources: <a href="https://www.sydneywater.com.au/" target="_blank" rel="noopener">Sydney Water</a> and IPART determinations. Figures are approximate and illustrative.',
    econ:{cur:'A$',gw:0,cust:5,
      rabDef:20,rabMin:8,rabMax:34,rabStep:0.5, waccDef:5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:1.6, anc:0},
    calc:{build:20000,grant:0,capex:36,revG:4,floor:2600,cap:5500,tax:30,exit:10,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.sydneywater.footer}
  },

  nwc:{
    name:'National Water (Saudi)', geo:'Saudi Arabia', continent:'Middle East', cur:'SR', geoKey:'nwc',
    lede:'Saudi Arabia\'s urban water utility, a <b>state system</b> supplied largely by <b>desalination</b>, investing heavily to serve fast-growing cities in one of the most water-scarce places on earth.',
    s1:'<p class="body">In a country with almost no rivers, water means <b>desalination</b>: Saudi Arabia is the world\'s largest desalinator, and its urban water utility (the National Water Company) distributes that desalinated and groundwater supply to cities like Riyadh and Jeddah, and collects and treats the wastewater.</p>'+
       '<p class="body">It is a <b>state system</b>, regulated within the kingdom\'s framework, and investing heavily under Vision&nbsp;2030, expanding desalination, transmission, distribution and wastewater treatment for fast-growing cities. Energy is the dominant cost (desalination is power-hungry), so margins are tighter; but as a state asset the cost of capital is low and the build-out is enormous, growing the asset base. Increasingly, private capital enters through <b>desalination IWPs</b> on long take-or-pay water contracts.</p>',
    facts:[['~SR 80bn','Asset base','growing fast'],['~12m','People served','major cities'],['Desal','Source','world\'s largest desalinator'],['~49%','EBITDA margin','energy-heavy'],['State','Ownership','+ private IWPs'],['Vision 2030','Driver','capacity build-out']],
    s2:'Here the water cycle starts at the <b>sea</b>: a desalination plant turns seawater into supply, piped to thirsty cities; wastewater is collected and treated. The <b>return</b> rises from a fast-growing, state-backed asset base; drag the levers, a state water system building hard, with energy as the big cost.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on assets', yrS:'regulated water revenue',
    preset:'Load National Water (Saudi)',
    try:'<b>Try this:</b> desalination is <b>energy-intensive</b>, so the margin is tighter than a reservoir-fed utility. But the asset base is growing fast under Vision 2030; wind it up to see the build-out compound at a low, state-backed cost of capital. Private capital increasingly enters via desalination take-or-pay IWPs.',
    s3:'The system earns a <b>regulated water revenue</b> within the kingdom\'s framework, a return on a fast-growing asset base, depreciation and an opex allowance (with energy the dominant line). The lever is <b>capex</b>: desalination, transmission, distribution and wastewater for growing cities. As a state asset the cost of capital is low; private investors mostly access the sector through <b>desalination IWPs</b> on long take-or-pay water-purchase agreements.',
    mb:{tag:'Model B · state + IWPs', title:'State water system (desal-fed)', body:'A state-owned, desalination-fed water system investing heavily for fast-growing, water-scarce cities, with energy the dominant cost and a low state cost of capital. Private capital enters via desalination IWPs on take-or-pay contracts. <b>This is Saudi Arabia\'s urban water system</b>.'},
    s4a:'Desalination is power-hungry, so energy dominates the cost base and the margin is tighter than a gravity-fed, reservoir-based utility. But the asset base is expanding fast, and the state cost of capital is low, so the regulated return compounds on a growing base.',
    wfNote:'Operating cost is dominated by the <b>energy</b> to desalinate seawater, plus treatment, distribution and workforce. The margin is tighter than a reservoir-fed utility; the swing factor is the build-out and the asset base it creates.',
    s4b:'The capital is on a national scale, desalination plants, giant water-transmission lines, distribution and wastewater treatment for growing cities. It is financed on a state-backed balance sheet and increasingly through <b>private IWPs</b> (build-own-operate desalination on 25-year take-or-pay contracts), which bring in investor capital at a contracted return.',
    stackH:'The capital base · state water system', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Saudi state, + private desalination IWPs']],
    finList:[['','Asset base','~SR 80bn, growing'],['sub','Source','desalination (world\'s largest)'],['','People served','~12m'],['sub','Cost driver','desalination energy'],['','Private capital','desalination IWPs (take-or-pay)'],['rest','Cost of capital','low (state-backed)']],
    finNote:'A state, desalination-fed water system is a <b>strategic, energy-heavy asset</b>: a regulated return on a fast-growing base at a low cost of capital, with private capital entering via contracted desalination IWPs. Energy cost and scarcity define it.',
    timeline:[['1970s','<b>Desalination</b> build-out begins in earnest.'],['2008','<b>National Water Company</b> established for urban water.'],['2020s','<b>Vision 2030</b> drives a capacity step-up.'],['2020s','<b>Desalination IWPs</b> bring in private capital.'],['Ongoing','<b>Wastewater treatment</b> expansion.'],['Ongoing','<b>City growth</b> drives the build-out.']],
    calcNote:'A working model of a <b>state, desalination-fed water system</b>. The cost of capital is low (state-backed), tax is low, energy makes the margin tighter, and growth is high (Vision 2030 build-out), a steady return on a fast-growing base.',
    s6:'National Water is state-backed, desalination-fed water building for scarce, growing cities. What drives it:',
    breakers:['<b>Energy cost</b>, desalination is power-hungry; energy dominates the margin.','<b>RAB growth</b>, the Vision 2030 build-out compounds the base.','<b>Desalination IWPs</b>, contracted take-or-pay projects are how private capital enters.','<b>Scarcity &amp; policy</b>, water security is a strategic, state-set priority.'],
    src:'Figures from public sources: reporting on Saudi Arabia\'s <a href="https://www.nwc.com.sa/" target="_blank" rel="noopener">National Water Company</a> and desalination programme. Figures are approximate and illustrative.',
    econ:{cur:'SR',gw:0,cust:12,
      rabDef:80,rabMin:35,rabMax:150,rabStep:1, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.05, opexAllow:9, anc:0},
    calc:{build:80000,grant:0,capex:45,revG:7,floor:11000,cap:24000,tax:0,exit:10,lev:5,rd:4.5,amort:2,hold:25},
    map:{footer:GEO.nwc.footer}
  },

  bewg:{
    name:'Beijing Enterprises Water', geo:'China', continent:'China', cur:'¥', geoKey:'bewg',
    lede:'A leading listed Chinese water group, earning on <b>BOT/concession</b> water and wastewater plants across hundreds of Chinese cities, in a market still building out treatment capacity.',
    s1:'<p class="body"><b>Beijing Enterprises Water Group (BEWG)</b> is one of China\'s largest water companies, operating water-supply and especially <b>wastewater-treatment</b> plants across hundreds of cities, mostly on <b>BOT</b> (build-operate-transfer) and concession contracts won from municipalities.</p>'+
       '<p class="body">China spent two decades building out water and (more urgently) <b>wastewater treatment</b> to catch up with rapid urbanisation, so the story has been <b>growth</b>: winning concessions, building plants, and earning a contracted return over the concession life, plus construction margin. It is <b>listed</b> (Hong Kong) and state-linked. The model blends regulated/contracted operating returns with a maturing build-out, as the easy growth in new plants slows and the focus shifts to operating efficiency and upgrades.</p>',
    facts:[['~¥90bn','Asset base','hundreds of plants'],['~50m','People served','many cities'],['BOT','Model','build-operate-transfer'],['~42%','EBITDA margin','contracted'],['Listed','Ownership','HK-listed, state-linked'],['Wastewater','Driver','treatment build-out']],
    s2:'The cycle runs across hundreds of Chinese cities, but BEWG\'s heart is <b>wastewater treatment</b>, the plants that clean a fast-urbanising country\'s effluent. The <b>return</b> rises from a large, contracted asset base; drag the levers, a listed water group in a maturing build-out.',
    driverLab:'Allowed / contracted return', availLab:'Performance', hrK:'Return on assets', yrS:'concession + treatment revenue',
    preset:'Load Beijing Enterprises Water',
    try:'<b>Try this:</b> the Chinese model is <b>BOT/concession</b>, build a treatment plant, earn a contracted return over the concession, plus construction margin. Wind the base up to see the build-out compound, though new-plant growth is maturing, shifting the focus to operating efficiency and upgrades.',
    s3:'BEWG earns a <b>contracted/regulated return</b> on its water and wastewater plants under BOT and concession agreements, plus construction margin during the build phase and operating fees thereafter. The story has been <b>growth</b>, winning concessions across urbanising China, now maturing toward operating efficiency, tariff upgrades and higher-standard treatment. The case is a listed water compounder with a long concession book and a maturing build-out.',
    mb:{tag:'Model B · BOT/concession', title:'Listed water concession operator', body:'A listed operator of water and wastewater plants under BOT/concession contracts across hundreds of cities, earning a contracted return plus construction margin, in a maturing build-out. State-linked, growth-oriented. <b>This is Beijing Enterprises Water</b>.'},
    s4a:'Operating hundreds of plants carries real energy, chemical and workforce cost, and wastewater treatment is energy-intensive, so the margin is on the lower side. The defining feature is the <b>concession book</b>: contracted returns over long terms, plus the construction margin on new build.',
    wfNote:'Operating cost is power, chemicals and workforce across hundreds of treatment plants, energy-heavy, so the margin is lower. The swing factors are the concession returns, construction margin and tariff upgrades.',
    s4b:'The capital is the <b>~¥90&nbsp;billion</b> portfolio of plants across hundreds of concessions, financed on a listed, state-linked balance sheet. New-plant growth is maturing; the focus shifts to operating efficiency, tariff increases and upgrading plants to higher discharge standards.',
    stackH:'The capital base · concession portfolio', splitL:'Financing', splitR:'listed',
    split:[['s1',55,'Debt'],['s2',45,'Equity (HK-listed, state-linked)']],
    finList:[['','Asset base','~¥90bn'],['sub','Model','BOT / concession'],['','People served','~50m'],['sub','Focus','wastewater treatment'],['','Stage','maturing build-out'],['rest','Owner','HK-listed, state-linked']],
    finNote:'A listed Chinese water group is a <b>contracted compounder with a maturing build-out</b>: long concession returns plus construction margin, now shifting from new-plant growth to operating efficiency and upgrades. State linkage supports a moderate cost of capital.',
    timeline:[['2008','<b>BEWG</b> formed; rapid concession wins begin.'],['2010s','<b>Wastewater build-out</b> across urbanising China.'],['2010s','<b>Hundreds of plants</b> under BOT/concession.'],['2020s','<b>New-plant growth matures</b>; focus on efficiency.'],['2020s','<b>Higher discharge standards</b> drive upgrades.'],['Ongoing','<b>Tariff &amp; efficiency</b> the next growth leg.']],
    calcNote:'A working model of a <b>listed BOT/concession water operator</b>, on an enterprise-value basis. The base is large and was fast-growing (now maturing), the contracted return is moderate, and the cost of capital is market-based, a compounder with a maturing build-out.',
    s6:'BEWG is a listed water concession compounder in a maturing market. What drives it:',
    breakers:['<b>Concession returns</b>, the contracted return over plant concession life.','<b>Build-out maturity</b>, new-plant growth is slowing; efficiency and upgrades take over.','<b>Tariffs &amp; standards</b>, tariff increases and higher discharge standards drive upgrades.','<b>Cost of capital</b>, state linkage supports financing for a capital-heavy model.'],
    src:'Figures from public sources: <a href="https://www.bewg.net.cn/" target="_blank" rel="noopener">Beijing Enterprises Water Group</a> (HK-listed) disclosure. Figures are approximate and illustrative.',
    econ:{cur:'¥',gw:0,cust:50,
      rabDef:90,rabMin:35,rabMax:160,rabStep:1, waccDef:6,waccMin:3,waccMax:10,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:13, anc:0},
    calc:{build:90000,grant:0,capex:28,revG:5,floor:11000,cap:30000,tax:25,exit:10,lev:4,rd:5,amort:2,hold:25},
    map:{footer:GEO.bewg.footer}
  }
  };
  var ORDER=['unitedutils','amwater','sabesp','sydneywater','nwc','bewg'];

  /* ===================================================================
     WATER-CYCLE RENDERER  (canvas, 720x520), top-down, daytime
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var WTW={x:196,y:150}, TOWN={x:452,y:236}, WWTW={x:330,y:430};
  var CLEAN=[[WTW.x+22,WTW.y],[330,WTW.y],[330,TOWN.y-26],[TOWN.x-40,TOWN.y-26]];
  var SEWER=[[TOWN.x+10,TOWN.y+40],[TOWN.x+10,WWTW.y-10],[WWTW.x+26,WWTW.y-10]];
  var DISCH=[[WWTW.x+26,WWTW.y+14],[560,WWTW.y+14],[560,498]];

  function drawBase(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8df'); g.addColorStop(1,'#d6ddcf');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // river / sea strip along the bottom-right (outfall) + a bit of left sea for desal
    var rs=ctx.createLinearGradient(0,486,0,H); rs.addColorStop(0,'#bcdcea'); rs.addColorStop(1,'#a9d0e2');
    ctx.fillStyle=rs; ctx.fillRect(360,492,W-360,H-492);
    ctx.fillStyle='rgba(120,160,190,0.25)'; ctx.font='italic 600 9px "Source Serif 4",Georgia,serif'; ctx.textAlign='left'; ctx.fillText('RIVER / SEA',560,508);
  }
  function ripple(x0,x1,y){ ctx.strokeStyle='rgba(120,160,190,0.3)'; ctx.lineWidth=1;
    for(var x=x0;x<x1;x+=18){ ctx.beginPath(); ctx.moveTo(x,y+Math.sin((x+T)*0.06)*1.4); ctx.lineTo(x+9,y+Math.sin((x+9+T)*0.06)*1.4); ctx.stroke(); } }

  function source(G){
    if(G.source==='desal'){
      // sea on the left + a desalination plant (kept clear of the top-left ledger)
      var sg=ctx.createLinearGradient(0,0,86,0); sg.addColorStop(0,'#aacfe0'); sg.addColorStop(1,'rgba(170,207,224,0)');
      ctx.fillStyle=sg; ctx.fillRect(0,140,86,260); for(var i=0;i<7;i++) ripple(0,80,168+i*26);
      ctx.fillStyle='#9aa0a0'; rr(94,182,54,58,3); ctx.fill();
      for(var m=0;m<3;m++){ ctx.fillStyle='#c2c7c4'; rr(100+m*16,190,11,42,2); ctx.fill(); }   // membrane racks
      lab('DESALINATION',121,176);
    } else {
      // reservoir / river, a blue body (below the ledger)
      ctx.fillStyle='rgba(120,170,205,0.6)'; ctx.beginPath(); ctx.ellipse(82,214,60,42,0,0,Math.PI*2); ctx.fill();
      for(var r=0;r<5;r++) ripple(34,134,196+r*9);
      lab(G.source==='river'?'RIVER INTAKE':'RESERVOIR',82,166);
    }
  }
  function tankRow(x,y,n,col){ for(var i=0;i<n;i++){ var cx=x+i*22;
    ctx.fillStyle=col||'#9fb4c2'; ctx.beginPath(); ctx.arc(cx,y,9,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(cx,y,5.5,0,Math.PI*2); ctx.stroke();
    ctx.save(); ctx.translate(cx,y); ctx.rotate(T*0.04+i); ctx.strokeStyle='rgba(60,80,90,0.55)'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.moveTo(-9,0); ctx.lineTo(9,0); ctx.stroke(); ctx.restore(); } }
  function wtw(){ ctx.fillStyle='rgba(40,55,40,0.10)'; rr(WTW.x-30,WTW.y-18,76,40,3); ctx.fill();
    ctx.fillStyle='#cfd3ca'; rr(WTW.x-30,WTW.y-20,76,40,3); ctx.fill();
    tankRow(WTW.x-14,WTW.y,2,'#9fc0d2'); lab('WATER TREATMENT',WTW.x+6,WTW.y-26); }
  function wwtw(){ ctx.fillStyle='rgba(40,55,40,0.10)'; rr(WWTW.x-26,WWTW.y-16,92,36,3); ctx.fill();
    ctx.fillStyle='#cfd3ca'; rr(WWTW.x-26,WWTW.y-18,92,36,3); ctx.fill();
    tankRow(WWTW.x-8,WWTW.y,3,'#a9bca0'); lab('WASTEWATER TREATMENT',WWTW.x+18,WWTW.y-24); }
  function town(load){
    // a compact block of homes + commercial
    for(var r=0;r<3;r++) for(var c=0;c<4;c++){ var x=TOWN.x-30+c*17, y=TOWN.y-18+r*15;
      ctx.fillStyle='#d8d2c4'; rr(x-6,y-6,12,12,1.5); ctx.fill(); ctx.fillStyle='#b8755a'; rr(x-6,y-6,12,5,1.5); ctx.fill();
      ctx.fillStyle=((x*3+y*5)%10)/10<(0.3+0.5*load)?'rgba(120,180,235,0.9)':'rgba(80,90,80,0.4)'; ctx.fillRect(x-1,y+1,2,3); }
    ctx.fillStyle='#aeb6bd'; rr(TOWN.x+44,TOWN.y-16,26,32,2); ctx.fill();
    lab('TOWN',TOWN.x+4,TOWN.y+34);
  }
  function lab(t,x,y){ ctx.fillStyle='rgba(70,90,90,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(t,x,y); }

  function pipe(pts,col,w){ ctx.strokeStyle=col; ctx.lineWidth=w; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); pts.forEach(function(p,i){ i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); }); ctx.stroke(); }
  function flowPulses(pts,speed,load,col,gcol){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    var n=Math.max(2,Math.round(3+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1), d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],4,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.7,0,Math.PI*2); ctx.fill(); }
  }
  /* leakage droplets escaping the clean main */
  function leak(rate){
    if(_anim && Math.random()<rate*0.5){ var i=1+((Math.random()*(CLEAN.length-1))|0); var a=CLEAN[i-1],b=CLEAN[i],t=Math.random();
      drops.push({x:a[0]+(b[0]-a[0])*t, y:a[1]+(b[1]-a[1])*t, vy:0.3, life:1}); }
    for(var d=drops.length-1;d>=0;d--){ var o=drops[d]; if(_anim){ o.y+=o.vy; o.vy+=0.03; o.life-=0.02; } if(o.life<=0){ drops.splice(d,1); continue; }
      ctx.save(); ctx.globalAlpha=Math.max(0,o.life); ctx.fillStyle='#5aa0d8'; ctx.beginPath(); ctx.arc(o.x,o.y,1.6,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  }

  /* economic overlay (shared style) */
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
  function drawLedger(rev,eb,opex){
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0;
    ctx.save();
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,11); ctx.fill(); ctx.stroke();
    ctx.textAlign='left'; ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.fillText('LIVE ECONOMICS · PER YEAR',px+13,py+15);
    function dot(x,c){ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,py+27,2.6,0,Math.PI*2); ctx.fill(); }
    dot(px+15,'#0c8a57'); dot(px+92,'#c0902f'); dot(px+183,'#bc4733');
    ctx.fillStyle='rgba(70,82,76,0.85)'; ctx.font='600 7.5px Inter,sans-serif';
    ctx.fillText('+ return on RAB',px+21,py+30); ctx.fillText('+ depreciation',px+98,py+30); ctx.fillText('− opex',px+189,py+30);
    var bx=px+13, bw=pw-26, rows=[['Revenue','+'+money(rev),'#0c6b4f',1],['Operating cost','−'+money(opex),'#bc4733',Math.max(0.02,oR)],['EBITDA',money(eb)+'  ·  '+Math.round(m*100)+'%','#0a5a42',Math.max(0.02,m)]];
    var ry=py+42;
    rows.forEach(function(r){ ctx.fillStyle='rgba(60,72,66,0.95)'; ctx.font='600 9px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(r[0],bx,ry+7);
      ctx.fillStyle=r[2]; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(r[1],px+pw-13,ry+7);
      ctx.fillStyle='rgba(20,30,25,0.07)'; rr(bx,ry+11,bw,3,1.5); ctx.fill(); ctx.fillStyle=r[2]; rr(bx,ry+11,bw*Math.min(1,r[3]),3,1.5); ctx.fill();
      ry+=20; });
    ctx.restore();
  }
  function drawDemand(load,leakpct){
    var pw=132,ph=44,px=W-pw-16,py=14;
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('WATER DEMAND',px+11,py+14);
    ctx.fillStyle='rgba(47,110,160,0.95)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(Math.round(load*100)+'%',px+pw-11,py+14);
    var gx=px+11, gw=pw-22, gy=py+ph-9, gh=18;
    ctx.strokeStyle='rgba(47,110,160,0.3)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+gw,gy); ctx.stroke();
    ctx.strokeStyle='#2f7ea8'; ctx.lineWidth=1.6; ctx.beginPath();
    for(var i=0;i<demHist.length;i++){ var x=gx+gw*i/72, y=gy-demHist[i]*gh; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.7)'; ctx.font='600 7px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('leakage '+leakpct+'%',px+11,py+ph-1);
    ctx.restore();
  }

  /* ===================================================================
     FRAME
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var G=GEO[A.geoKey], E=A.econ;
    var rabBn=parseFloat(sCap.value), wacc=parseFloat(sSpread.value)/100, perf=parseFloat(sAvail.value)/100;
    var RAB=rabBn*1e9;
    var load=0.5+0.4*Math.sin(T*0.012)+0.08*Math.sin(T*0.05); load=Math.max(0.12,Math.min(1,load));

    ctx.clearRect(0,0,W,H);
    drawBase();
    pipe(CLEAN,'rgba(90,160,210,0.6)',4); pipe(SEWER,'rgba(150,130,90,0.6)',4); pipe(DISCH,'rgba(90,170,160,0.6)',3.4);
    pipe([[120,214],[196,214],[196,170]],'rgba(110,165,205,0.55)',3.4);
    source(G); wtw(); town(load); wwtw();
    ripple(360,W,494);
    flowPulses(CLEAN,0.8+load,load,'rgba(180,225,255,0.95)','rgba(110,180,235,0.7)');   // clean water out
    flowPulses(SEWER,0.7+load,load,'rgba(200,180,120,0.95)','rgba(170,140,80,0.6)');     // wastewater back
    flowPulses(DISCH,0.8+load,load,'rgba(170,230,210,0.95)','rgba(110,200,180,0.6)');    // treated discharge
    leak(G.leakage||0.15);

    // ---- economics (annual, regulated building-block) ----
    var returnRev=wacc*RAB, depRev=E.depRate*RAB, opexAllow=E.opexAllow*1e9, incentive=perf*RAB;
    var allowedRev=returnRev+depRev+opexAllow+incentive+(E.anc||0)*1e9;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,allowedRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var actualOpex=opexAllow;
    var c_pow=actualOpex*0.34, c_chem=actualOpex*0.20, c_treat=actualOpex*0.22, c_admin=actualOpex*0.24;
    var ebitda=revenue-actualOpex;
    baseRevYr=revenue; baseCostYr=actualOpex; baseEbYr=ebitda;
    var retShare=(returnRev+incentive)/Math.max(1,(returnRev+incentive+depRev+opexAllow));

    if(_anim){
      var src=[[WTW.x,WTW.y-22],[WWTW.x,WWTW.y-20],[TOWN.x,TOWN.y-24]];
      if(Math.random()<0.6){ var s1=src[(Math.random()*src.length)|0]; spawnCoin(s1[0],s1[1], Math.random()<retShare?'ret':'rec', -1); }
      var outRate=Math.max(0.05,Math.min(0.6, actualOpex/Math.max(1,revenue)));
      if(Math.random()<outRate){ var s2=src[(Math.random()*src.length)|0]; spawnCoin(s2[0],s2[1]+6,'cost',1); }
      demHist.push(load); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, actualOpex);
    drawDemand(load, Math.round((G.leakage||0.15)*100));

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · RAB '+fmtBn(rabBn),W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',fmtBn(rabBn)); set('ixSpreadV',(Math.round(wacc*1000)/10)+'%'); set('ixAvailV',pctS(perf*100));
    set('ixDir',fmtBn(rabBn)); set('ixDirS','inflation-protected · grows with capex');
    set('ixMW',E.cust+'m'); set('ixMWs','people served · leakage '+Math.round((G.leakage||0.15)*100)+'%');
    set('ixHr', money(returnRev)); set('ixYr','≈ '+money(allowedRev));

    drawWaterfall(revenue, [['Power &amp; pumping',c_pow],['Chemicals',c_chem],['Treatment &amp; sludge',c_treat],['Admin &amp; workforce',c_admin]], ebitda);
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
    s+=lbl(bx(0)+bw/2, y(rev), 'Allowed rev', money(rev), '#15201d');
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the return is too thin to value against the asset base, raise the allowed return or the RAB.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">RAB / entry</span> <b>'+money(capexGrossG)+'</b></span>'+
      '<span><span class="lbl">Net of grant</span> <b>'+money(netCapexG)+'</b></span>'+
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
     RENDER + WIRING
  =================================================================== */
  var sCap=document.getElementById('ixCap'), sSpread=document.getElementById('ixSpread'), sAvail=document.getElementById('ixAvail'),
      iBuild=document.getElementById('iBuild'), iGrant=document.getElementById('iGrant'), iCapex=document.getElementById('iCapex'),
      iFloor=document.getElementById('iFloor'), iCap=document.getElementById('iCap');

  function render(key){
    A=ASSETS[key]; CUR=A.cur; coins=[]; demHist=[]; drops=[];
    set('ixAssetName',A.name); set('ixAssetGeo',A.geo); set('ixCont',A.continent);
    set('ixBarName',A.name);
    html('ixLede',A.lede);
    html('s1body',A.s1);
    html('ixFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    html('s2intro',A.s2);
    set('ixDriverLab',A.driverLab); set('ixAvailLab',A.availLab); set('ixHrK',A.hrK); set('ixYrS',A.yrS);
    set('ixPreset',A.preset); html('ixTry',A.try);
    var E=A.econ;
    sCap.min=E.rabMin; sCap.max=E.rabMax; sCap.step=E.rabStep; sCap.value=E.rabDef;
    sSpread.min=E.waccMin; sSpread.max=E.waccMax; sSpread.step=E.waccStep; sSpread.value=E.waccDef;
    sAvail.min=E.perfMin; sAvail.max=E.perfMax; sAvail.step=E.perfStep; sAvail.value=E.perfDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue uses the regulated building-block (return on RAB + depreciation + opex + incentive) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    frame(); renderModel();
  }

  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.rabDef; sSpread.value=E.waccDef; sAvail.value=E.perfDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'unitedutils');

  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
