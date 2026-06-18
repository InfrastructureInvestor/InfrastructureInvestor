/* Electricity transmission — data-driven worked examples.
   Six real transmission networks, one template. Scene configuration from tx-geo.js
   (GEO), drawn as a side-elevation grid landscape in 720x520 scene coords. The
   interactive figures are illustrative: revenue uses the regulated building-block
   (return on RAB + depreciation + opex + incentive) and the returns model is a
   simplified DCF. */
(function(){
  var CUR='£';
  var A=null;
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;
  var coins=[], _anim=false;
  function rnd(a,b){ return a+Math.random()*(b-a); }

  /* ---------------- formatting ---------------- */
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

  /* ---------- 1 · NATIONAL GRID ET (Europe · RAB-regulated) ---------- */
  nationalgrid:{
    name:'National Grid ET', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'nationalgrid',
    lede:'The owner of England &amp; Wales\'s high-voltage backbone and the textbook <b>RAB-regulated monopoly</b> — it doesn\'t sell power, it owns the wires and earns a regulated return on its asset base.',
    s1:'<p class="body">A transmission network is the <b>motorway of the power system</b>: the 400&nbsp;kV and 275&nbsp;kV overhead lines, cables and substations that carry bulk electricity from power stations and offshore wind farms to the regional distribution networks that feed homes. It is a <b>natural monopoly</b> — you only build one — so it is regulated.</p>'+
       '<p class="body"><b>National Grid Electricity Transmission</b> owns that backbone in England &amp; Wales. Crucially, its revenue is <b>decoupled from how much power flows</b>: under Ofgem\'s <b>RIIO</b> price control it earns an <b>allowed revenue</b> built from a <b>return on its Regulated Asset Base (RAB)</b> at an allowed cost of capital, plus recovery of <b>depreciation</b> and an <b>opex allowance</b>, with incentives. The RAB is inflation-protected and <b>grows as the network invests</b> — which, in the net-zero build-out, is the whole story.</p>',
    facts:[['~£17bn','Regulated Asset Base','inflation-linked'],['RIIO-T2/T3','Price control','Ofgem'],['400 / 275 kV','Backbone','+ HVDC links'],['~72%','EBITDA margin','high, stable'],['Single buyer','Revenue','decoupled from flow'],['Net zero','Capex driver','RAB grows fast']],
    s2:'Watch the grid. Generation on the left — offshore wind, nuclear, gas — steps up through a substation onto the high-voltage corridor of pylons, flows across the country, steps down, and lights the city. But the <b style="color:#0c6b4f">money</b> the owner earns rises from the <b>assets</b> — the substations and lines themselves — not from the electrons. Drag the RAB and the allowed return; the revenue moves with the <b>asset base and the regulator\'s return</b>, barely at all with the power flowing.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load National Grid ET',
    try:'<b>Try this:</b> push the <b>power flow</b> in your mind — it doesn\'t matter. Now nudge the <b>allowed return</b> by half a point and watch the revenue jump. That is the single most important fact about a regulated network: the return is set by the regulator\'s cost-of-capital decision on the RAB, not by usage. The second lever is RAB <i>growth</i> — every pound of net-zero capex compounds the base.',
    s3:'National Grid ET earns a <b>regulated allowed revenue</b>, not a market price. The building blocks: a <b>return on the RAB</b> at Ofgem\'s allowed WACC; <b>depreciation</b> (return <i>of</i> capital); an <b>opex allowance</b>; and <b>incentives</b> for beating (or penalties for missing) cost and reliability targets under the <b>totex</b> framework. The decisive investor questions are the size of the RAB, the allowed return Ofgem sets each price control, and how fast the RAB grows with the net-zero build-out.',
    mb:{tag:'Model B · RAB-regulated', title:'Regulated transmission owner', body:'A monopoly network whose revenue is set by an economic regulator as a <b>return on its Regulated Asset Base</b> plus depreciation and an opex allowance, reset every price control. Inflation-protected, decoupled from volume, and growing with capex — the lowest-risk infrastructure cash flow there is. <b>This is National Grid ET</b> — regulated by Ofgem under RIIO.'},
    s4a:'A transmission owner\'s costs are surprisingly small against its revenue: the network is built and then maintained — inspections, fault response, vegetation, a lean overhead — so the <b>EBITDA margin is very high and stable</b> (~70%+). The big number is not opex at all; it is the <b>capital</b> that builds the RAB, on which the regulator allows a return for decades.',
    wfNote:'Operating cost (totex opex) is network maintenance, fault response and overhead — small against a revenue built mostly from the return on, and depreciation of, the asset base. Beating the allowance earns an incentive; the margin is high and remarkably steady through any demand cycle.',
    s4b:'The capital is the <b>~£17&nbsp;billion RAB</b> — lines, cables and substations built over decades and financed on an investment-grade, geared balance sheet. The net-zero transition means an enormous forward capex programme (offshore connections, network reinforcement), every pound of which is added to the RAB and earns the allowed return — so the RAB, and the revenue, compound.',
    stackH:'The capital base · ~£17bn RAB', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',60,'Regulated debt (~60% gearing)'],['s2',40,'Equity']],
    finList:[['','Regulated Asset Base','~£17bn'],['sub','Ofgem price control','RIIO-T2 / T3'],['','Allowed revenue','return + dep + opex + incentives'],['sub','Notional gearing','~60%'],['','Net-zero capex','large, RAB-additive'],['rest','Owner','National Grid plc (listed)']],
    finNote:'A RAB-regulated network is the <b>archetypal core-infrastructure cash flow</b>: inflation-linked, volume-decoupled, investment-grade, and growing with capex. The equity return is steady and geared but capped — the perennial debate is the <b>allowed WACC</b> Ofgem sets and the deliverability of the build-out.',
    timeline:[['1990','<b>National Grid created</b> at privatisation of the CEGB.'],['1995','<b>Listed</b> on the London Stock Exchange.'],['2013','<b>RIIO-T1</b> price control begins — the modern RAB framework.'],['2021','<b>RIIO-T2</b> begins (2021–26).'],['2024','<b>Net-zero capex</b> ramps; large equity raise to fund the build-out.'],['2026','<b>RIIO-T3</b> — the allowed return reset for the build decade.']],
    calcNote:'A working model of a <b>RAB-regulated network</b>. The build/entry cost is the RAB itself, the unlevered return tracks the <b>allowed WACC</b>, and growth reflects the RAB compounding with net-zero capex. The revenue floor is high (regulation guarantees it) — this is what a core, regulated infrastructure return looks like.',
    s6:'National Grid ET is the clearest case of infrastructure as a <b>regulated, growing asset base</b>. What moves the return:',
    breakers:['<b>The allowed WACC</b> — Ofgem\'s cost-of-capital decision each price control is the single biggest lever on the return.','<b>RAB growth</b> — the net-zero capex programme compounds the base; deliverability and financing of it is the upside and the risk.','<b>Incentives</b> — out- or under-performance against totex and reliability targets adds or subtracts a few points.','<b>Rates &amp; inflation</b> — a geared, inflation-linked RAB is sensitive to real rates and the cost of debt.'],
    src:'Figures from the company and regulator: <a href="https://www.nationalgrid.com/" target="_blank" rel="noopener">National Grid plc</a> reporting and RAB disclosure, and the <a href="https://www.ofgem.gov.uk/energy-policy-and-regulation/policy-and-regulatory-programmes/network-price-controls-2021-2028-riio-2" target="_blank" rel="noopener">Ofgem RIIO-T2/T3</a> price controls. Figures are approximate and illustrative.',
    econ:{cur:'£',gw:60,volt:'400 / 275 kV',
      rabDef:17,rabMin:5,rabMax:30,rabStep:0.5, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.4,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:0.7, anc:0},
    calc:{build:17000,grant:0,capex:40,revG:4,floor:2200,cap:3600,tax:25,exit:10,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.nationalgrid.footer}
  },

  /* ---------- 2 · ITC HOLDINGS (North America · FERC formula rates) ---------- */
  itc:{
    name:'ITC Holdings', geo:'US Midwest', continent:'North America', cur:'US$', geoKey:'itc',
    lede:'The largest independent transmission company in the US — regulated by <b>FERC on formula rates</b>, earning an allowed return on a fast-growing rate base across the Midwest.',
    s1:'<p class="body"><b>ITC Holdings</b> is the biggest pure-play transmission company in America, owning and operating high-voltage networks across Michigan and the Midwest. Like a UK transmission owner it is a regulated monopoly that <b>owns the wires and earns a return on its capital</b> — but under a different mechanism.</p>'+
       '<p class="body">US transmission is regulated by the <b>Federal Energy Regulatory Commission (FERC)</b> on <b>formula rates</b>: rather than a fixed multi-year settlement, the allowed revenue is recalculated annually from the actual <b>rate base</b> and an allowed <b>return on equity (ROE)</b>, with a true-up. The allowed ROE is comparatively <b>high</b> (~10%), and there are <b>incentive adders</b> for new build — which makes US transmission an attractive, growing regulated asset. ITC is owned by <b>Fortis</b> (with a GIC minority).</p>',
    facts:[['~$10bn','Rate base','growing'],['FERC','Regulator','formula rates'],['~10%','Allowed ROE','+ incentive adders'],['345 / 765 kV','Backbone','AC'],['Fortis / GIC','Owner','utility + sovereign fund'],['~75%','EBITDA margin','regulated']],
    s2:'The picture is the same — generation steps up, flows across the pylon corridor, steps down to the city — but the regulation differs. Under <b>formula rates</b> the revenue is trued up to the actual <b>rate base × allowed ROE</b> each year, so the owner is largely insulated from cost swings. The <b style="color:#0c6b4f">return</b> rises from the assets; drag the rate base and the allowed return to see what really drives a US transmission owner.',
    driverLab:'Allowed return', availLab:'Incentive adder', hrK:'Return on rate base', yrS:'return + depreciation + opex',
    preset:'Load ITC Holdings',
    try:'<b>Try this:</b> the US allowed return is <b>higher</b> than the UK\'s — FERC ROEs around 10% (versus RIIO\'s lower allowed return) are why US transmission attracts so much capital. Push the allowed-return slider up and compare: the same rate base earns materially more. The trade-off is that formula rates are recalculated annually and the ROE is periodically litigated.',
    s3:'ITC earns a <b>FERC-regulated allowed revenue</b> trued up annually: a <b>return on rate base</b> at the allowed ROE (on the equity layer) plus a debt return, recovery of <b>depreciation</b>, and an <b>opex allowance</b>, with <b>incentive adders</b> for constructing new transmission. The model rewards <b>building</b> — every dollar of prudently-incurred capital enters the rate base and earns the allowed return — so the case is rate-base growth at a high allowed ROE.',
    mb:{tag:'Model B · formula rate', title:'FERC formula-rate transmission', body:'An independent transmission owner regulated by FERC on <b>formula rates</b>: allowed revenue is recalculated annually from the actual rate base and an allowed ROE, with incentive adders for new build. Higher allowed returns than European RAB, annual true-ups, and a strong build incentive. <b>This is ITC</b> — the largest US pure-play, owned by Fortis with a GIC minority.'},
    s4a:'Like any transmission owner ITC runs lean — the network is maintained, not operated like a power plant — so the margin is high and the cash flow stable. The defining feature is the <b>rate base</b>: it grows with every prudent capital project, and FERC allows a return on it, so the value compounds with the build programme.',
    wfNote:'Operating cost is maintenance, fault response and overhead — modest against a revenue built from the return on, and depreciation of, the rate base. Formula rates true this up annually, so the margin is high and very stable.',
    s4b:'The capital is the <b>~$10&nbsp;billion rate base</b>, financed on an investment-grade balance sheet. FERC\'s build incentives and the Midwest\'s grid-expansion needs (interconnecting wind, relieving congestion) drive a large forward capex pipeline — each project entering the rate base at the allowed return.',
    stackH:'The capital base · ~$10bn rate base', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',60,'Regulated debt'],['s2',40,'Equity (Fortis / GIC)']],
    finList:[['','Rate base','~$10bn'],['sub','Regulator','FERC (formula rates)'],['','Allowed ROE','~10% + incentive adders'],['sub','Owner','Fortis (~80%) / GIC (~20%)'],['','Capex pipeline','Midwest grid expansion'],['rest','EBITDA margin','~75%']],
    finNote:'US formula-rate transmission is a <b>higher-returning cousin</b> of European RAB: the same regulated, volume-decoupled cash flow, but with a higher allowed ROE and a strong build incentive — which is why utilities and sovereign funds prize it. The risk is ROE litigation and the annual true-up.',
    timeline:[['2003','<b>ITC formed</b> from DTE Energy\'s transmission system.'],['2005','<b>IPO</b> — the first independent listed US transmission company.'],['2007','<b>ITC Midwest</b> acquired — Iowa/Midwest expansion.'],['2016','<b>Acquired by Fortis</b> (with GIC taking a minority).'],['2020s','<b>Grid-expansion build-out</b> to interconnect Midwest renewables.'],['Annual','<b>Formula-rate true-up</b> resets revenue to actual rate base.']],
    calcNote:'A working model of a <b>FERC formula-rate</b> network. The allowed return is higher than a European RAB, the floor is high (formula rates true up annually), and growth reflects an expanding rate base. A higher allowed ROE lifts the whole return relative to RIIO.',
    s6:'ITC is the US take on regulated transmission — higher returns, build incentives, annual true-ups. What drives it:',
    breakers:['<b>The allowed ROE</b> — FERC\'s return decision (and its periodic litigation) is the biggest single lever.','<b>Rate-base growth</b> — the build pipeline to connect Midwest renewables compounds the base.','<b>Incentive adders</b> — FERC bonuses for new transmission lift the return on qualifying projects.','<b>Cost of capital</b> — a geared regulated asset is sensitive to interest rates and credit spreads.'],
    src:'Figures from public sources: <a href="https://www.itc-holdings.com/" target="_blank" rel="noopener">ITC Holdings</a> and <a href="https://www.fortisinc.com/" target="_blank" rel="noopener">Fortis</a> disclosure, and FERC formula-rate filings. Rate base and ROE figures are approximate and illustrative.',
    econ:{cur:'US$',gw:26,volt:'345 / 765 kV',
      rabDef:10,rabMin:3,rabMax:18,rabStep:0.5, waccDef:7,waccMin:4,waccMax:11,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.035, opexAllow:0.35, anc:0},
    calc:{build:10000,grant:0,capex:38,revG:5,floor:1100,cap:2300,tax:25,exit:10,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.itc.footer}
  },

  /* ---------- 3 · ISA CTEEP (South America · ANEEL availability concession) ---------- */
  cteep:{
    name:'ISA CTEEP', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'cteep',
    lede:'Brazil\'s largest transmission company — an <b>availability-based concession</b> won at auction, paid a fixed, inflation-indexed annual revenue (RAP) regardless of how much power flows.',
    s1:'<p class="body"><b>ISA CTEEP</b> operates the largest slice of Brazil\'s high-voltage transmission, concentrated in São Paulo and stretching nationwide. Brazil runs transmission through <b>competitive concession auctions</b> overseen by the regulator <b>ANEEL</b>: a company bids to build and operate a line for ~30 years, and the winner is whoever accepts the lowest annual revenue.</p>'+
       '<p class="body">That revenue — the <b>RAP (Receita Anual Permitida)</b> — is <b>availability-based</b>: the concessionaire is paid a fixed sum each year for keeping the line <b>available</b>, almost entirely <b>independent of how much electricity actually flows</b>. The RAP is <b>indexed to inflation</b>. The result is one of the most stable, bond-like cash flows in infrastructure — carried, however, against Brazilian interest rates and currency.</p>',
    facts:[['~R$22bn','Net regulatory assets','indexed'],['ANEEL','Regulator','auction concessions'],['RAP','Revenue','availability-based'],['IPCA-linked','Indexation','inflation-protected'],['~30 yr','Concessions','then renewal'],['500 kV','Backbone','+ ±600 kV HVDC nationally']],
    s2:'The grid behaves identically — hydro and wind step up, cross the long 500&nbsp;kV corridor, step down to São Paulo — but the revenue is the purest form of decoupling on this list. The concessionaire is paid the <b>RAP for keeping the line available</b>; flow is almost irrelevant. The <b style="color:#0c6b4f">money</b> rises from the asset for simply being there and working. Drag the levers — the cash flow is fixed and indexed, the risk is Brazilian rates.',
    driverLab:'Allowed return', availLab:'Availability bonus', hrK:'Return on assets', yrS:'RAP — availability revenue',
    preset:'Load ISA CTEEP',
    try:'<b>Try this:</b> the RAP barely flexes with anything operational — it is an <b>availability payment</b>, inflation-indexed for the concession life. That makes the cash flow extraordinarily stable. So why isn\'t the return tiny? Because it is priced in <b>reais</b> against high Brazilian interest rates — push the cost of debt in the model and watch a high nominal return net down once you discount it like an EM asset.',
    s3:'CTEEP earns the <b>RAP</b> — a fixed, inflation-indexed annual revenue for keeping its lines available, won at ANEEL auction and locked for the concession term. There is essentially <b>no volume risk</b>; the operational lever is <b>availability</b> (penalties for outages). New growth comes from <b>winning new auction lots</b> and reinforcement projects. The investor question is less about the asset — it is rock-solid — and more about the <b>discount rate</b>: Brazilian rates and the real.',
    mb:{tag:'Model B · availability concession', title:'Auction concession (RAP)', body:'A transmission concession won at competitive auction and paid a fixed, inflation-indexed <b>availability revenue (RAP)</b> for ~30 years, independent of power flow. Bond-like and indexed, with growth from winning new lots — but priced against emerging-market rates and currency. <b>This is CTEEP</b> — Brazil\'s largest, regulated by ANEEL.'},
    s4a:'An availability concession is almost pure margin: keep the line energised and you collect the RAP. Costs are maintenance and a lean overhead, so the EBITDA margin is very high. The real determinants of value are the <b>RAP locked at auction</b>, the inflation indexation, and the rate at which you discount a long, stable, real-denominated stream.',
    wfNote:'Operating cost is line maintenance and overhead — small against an availability revenue. Outages bring penalties, so reliability is the operational focus; the margin is among the highest in the sector.',
    s4b:'The capital is the network the concessions were won to build — financed by the sponsor and reinforced over time, with new RAP added each time CTEEP wins an auction lot. Modelled on an enterprise-value basis, the return is a <b>high-nominal Brazilian</b> one on a very stable, indexed cash flow.',
    stackH:'The capital stack · concession assets', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local debt (indexed)'],['s2',45,'Sponsor equity (ISA / Eletrobras-linked)']],
    finList:[['','Net regulatory assets','~R$22bn'],['sub','Regulator','ANEEL (auctions)'],['','Revenue','RAP — availability, IPCA-indexed'],['sub','Concession term','~30 years'],['','Growth','new auction lots + reinforcements'],['rest','Volume risk','essentially none']],
    finNote:'A Brazilian transmission concession is a <b>bond in disguise</b>: a fixed, inflation-indexed availability payment for decades, with negligible volume risk. The entire investment debate is the <b>discount rate</b> — Brazilian real rates and the currency — not the asset, which is about as safe as infrastructure gets.',
    timeline:[['1999','<b>CTEEP created</b> from São Paulo\'s state transmission system.'],['2006','<b>Privatised / listed</b>; ISA (Colombia) becomes controlling shareholder.'],['2012','<b>Concession renewal</b> reshapes RAP — a landmark regulatory event.'],['2016+','<b>Wins new auction lots</b> nationwide, growing the RAP.'],['2020s','<b>Indexed RAP</b> delivers stable, inflation-linked cash flow.'],['Ongoing','<b>Greenfield auctions</b> remain the main growth channel.']],
    calcNote:'A working model of an <b>availability concession (RAP)</b>, on an enterprise-value basis. The revenue floor is very high (availability payments are near-guaranteed and indexed), but the cost of debt is high to reflect Brazilian rates. A strong nominal return nets down once discounted like an EM asset.',
    s6:'CTEEP is the most bond-like asset here — fixed, indexed, availability-based — with the risk all in the discount rate. What drives it:',
    breakers:['<b>The RAP</b> — what was locked at auction, and its inflation indexation, is the cash flow.','<b>Country &amp; currency</b> — Brazilian real rates and the real, not anything operational, set the discount rate.','<b>New auction lots</b> — winning greenfield concessions is the main growth lever (at competitive, thin returns).','<b>Availability</b> — outage penalties are the only real operational risk to the RAP.'],
    src:'Figures from public sources: <a href="https://www.isacteep.com.br/" target="_blank" rel="noopener">ISA CTEEP</a> and <a href="https://www.gov.br/aneel/" target="_blank" rel="noopener">ANEEL</a> disclosure on the RAP and concession framework. Figures are approximate and illustrative.',
    econ:{cur:'R$',gw:40,volt:'500 kV',
      rabDef:22,rabMin:8,rabMax:36,rabStep:0.5, waccDef:7.5,waccMin:4,waccMax:12,waccStep:0.25,
      perfDef:0.4,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:1.2, anc:0},
    calc:{build:22000,grant:0,capex:34,revG:5,floor:3000,cap:6000,tax:34,exit:9,lev:5,rd:10,amort:2,hold:25},
    map:{footer:GEO.cteep.footer}
  },

  /* ---------- 4 · TRANSGRID (Oceania · privatised, AER revenue cap) ---------- */
  transgrid:{
    name:'TransGrid', geo:'New South Wales, Australia', continent:'Oceania', cur:'A$', geoKey:'transgrid',
    lede:'New South Wales\'s transmission network — a <b>privatised, regulated monopoly</b> leased to an infrastructure consortium, now building the backbone for Australia\'s renewable transition.',
    s1:'<p class="body"><b>TransGrid</b> owns and operates the high-voltage transmission network of New South Wales — the lines linking generators to the distribution networks of Sydney and the state. It is a regulated monopoly under the <b>Australian Energy Regulator (AER)</b>, which sets a <b>revenue cap</b> on a RAB basis.</p>'+
       '<p class="body">In 2015 the NSW government <b>leased it for 99 years</b> for <b>A$10.3&nbsp;billion</b> to a consortium of infrastructure investors. The investment case has since been transformed: TransGrid is building the <b>backbone of the energy transition</b> — major interconnectors (EnergyConnect to South Australia, HumeLink, VNI West) and Renewable Energy Zones — a huge capex programme that grows the RAB and the regulated return.</p>',
    facts:[['~A$8bn','Regulated Asset Base','growing fast'],['A$10.3bn','99-year lease','2015 privatisation'],['AER','Regulator','revenue cap (RAB)'],['330 / 500 kV','Backbone','AC'],['REZ build','Capex driver','renewable zones'],['Consortium','Owner','infrastructure funds']],
    s2:'The grid does what grids do — renewables step up, flow across the corridor, step down to Sydney — but TransGrid\'s story is <b>growth</b>: the transition needs vast new transmission to connect wind and solar zones, and every kilometre built enters the RAB. The <b style="color:#0c6b4f">return</b> rises from that growing asset base. Drag the RAB and allowed return to see how a build-out compounds a regulated monopoly.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load TransGrid',
    try:'<b>Try this:</b> wind the RAB up — TransGrid\'s whole thesis is <b>RAB growth</b> from the renewable build-out, compounding the regulated return on a bigger and bigger base. But remember the entry: the consortium paid <b>A$10.3bn</b> in 2015, a premium to the then-RAB, so the return also depends on growing into the price paid.',
    s3:'TransGrid earns a <b>regulated revenue cap</b> set by the AER on a RAB basis — a return on the asset base at the allowed WACC, plus depreciation and an opex allowance, with incentive schemes. The transformational lever is <b>capex</b>: the energy transition requires major new interconnectors and Renewable Energy Zone links, each adding to the RAB. The case is a <b>regulated monopoly in a strong growth phase</b> — bought, however, at a privatisation premium.',
    mb:{tag:'Model B · privatised RAB', title:'Privatised regulated monopoly', body:'A government-owned transmission network leased to private capital for decades, kept under an <b>AER revenue cap</b> on a RAB basis. Low-risk and inflation-linked, with strong RAB growth from the renewable transition — but bought at a privatisation premium. <b>This is TransGrid</b> — leased for A$10.3bn in 2015 to an infrastructure consortium.'},
    s4a:'TransGrid runs lean like any transmission owner, so the margin is high and stable. The defining feature is the <b>capex pipeline</b>: the transition build-out grows the RAB rapidly, lifting the regulated return — but it must be delivered on time and on budget, and financed, against the price the consortium paid in 2015.',
    wfNote:'Operating cost is network maintenance and overhead — small against a RAB-based revenue. The swing factor is not cost but the pace of RAB growth from the transition build-out, on which the regulator allows a return.',
    s4b:'The headline capital number is the <b>A$10.3&nbsp;billion</b> 99-year lease paid in 2015, plus the multi-billion forward capex of EnergyConnect, HumeLink and the REZ links. At privatisation the price was a premium to RAB; the bet is that the transition build-out grows the RAB enough to justify it.',
    stackH:'The capital stack · A$10.3bn lease', splitL:'Financing', splitR:'consortium',
    split:[['s1',60,'Long-dated debt'],['s2',40,'Infrastructure-fund equity']],
    finList:[['','99-year lease (2015)','A$10.3bn'],['sub','Regulator','AER (revenue cap)'],['','Regulated Asset Base','~A$8bn, growing'],['sub','Major projects','EnergyConnect · HumeLink · VNI West'],['','Backbone','330 / 500 kV'],['rest','Owner','infrastructure consortium']],
    finNote:'A privatised, growing transmission monopoly is a <b>classic infrastructure-fund asset</b>: regulated, inflation-linked, and compounding with the transition build-out. The risks are overpaying at privatisation, and delivering an enormous capex programme on time, on budget and financeable.',
    timeline:[['1950s','<b>NSW transmission</b> built out as a state utility.'],['2015','<b>Leased for 99 years</b> for A$10.3bn to an infrastructure consortium.'],['2021','<b>EnergyConnect approved</b> — SA–NSW interconnector.'],['2022','<b>HumeLink &amp; REZ</b> programme — major transition capex.'],['2024','<b>RAB growth</b> accelerates with the build-out.'],['2020s','<b>Backbone of the transition</b> — the central investment thesis.']],
    calcNote:'A working model of a <b>privatised, growing RAB</b>. The entry price (A$10.3bn) is the build/entry input — a premium to the then-RAB — and growth is high to reflect the transition build-out. The return depends on RAB growth justifying the price paid.',
    s6:'TransGrid is a regulated monopoly turbo-charged by the energy transition — and bought at a premium. What drives it:',
    breakers:['<b>RAB growth</b> — the transition capex programme is the thesis; deliverability is the risk.','<b>The price paid</b> — a 2015 privatisation premium to RAB means the build-out has to justify the entry.','<b>The allowed WACC</b> — the AER\'s revenue-cap return decision sets the base return.','<b>Delivery &amp; financing</b> — executing EnergyConnect, HumeLink and the REZ links on time and budget.'],
    src:'Figures from public sources: <a href="https://www.transgrid.com.au/" target="_blank" rel="noopener">TransGrid</a> and <a href="https://www.aer.gov.au/" target="_blank" rel="noopener">AER</a> revenue-determination disclosure, and the 2015 lease announcements. RAB and figures are approximate and illustrative.',
    econ:{cur:'A$',gw:14,volt:'330 / 500 kV',
      rabDef:8,rabMin:4,rabMax:16,rabStep:0.5, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:0.3, anc:0},
    calc:{build:10300,grant:0,capex:45,revG:7,floor:900,cap:2200,tax:30,exit:11,lev:6,rd:5,amort:1,hold:30},
    map:{footer:GEO.transgrid.footer}
  },

  /* ---------- 5 · NATIONAL GRID SA (Middle East · state-owned) ---------- */
  saudi:{
    name:'National Grid SA', geo:'Saudi Arabia', continent:'Middle East', cur:'SR', geoKey:'saudi',
    lede:'Saudi Arabia\'s state-owned transmission monopoly — building out a vast 380&nbsp;kV and HVDC backbone to wire the kingdom\'s Vision&nbsp;2030 solar mega-projects into the grid.',
    s1:'<p class="body"><b>National Grid SA</b>, the transmission arm of the state-controlled <b>Saudi Electricity Company (SEC)</b>, owns and operates the kingdom\'s high-voltage network. It is a <b>regulated, state-owned monopoly</b> — its tariffs overseen by the regulator (WERA) — and, increasingly, the enabler of Saudi Arabia\'s energy strategy.</p>'+
       '<p class="body"><b>Vision&nbsp;2030</b> is driving an enormous transmission build-out: gigascale solar parks (Sudair, NEOM), giant battery projects and new HVDC links (domestic, plus interconnections to Egypt and the GCC) all need wires to reach demand centres like Riyadh. The network is being expanded and reinforced at pace, growing the asset base. As a state asset, the return is regulated and the cost of capital low — but the strategic objective is national, not purely financial.</p>',
    facts:[['~SR 90bn','Network asset base','growing fast'],['WERA','Regulator','state-owned (SEC)'],['380 kV','Backbone','+ HVDC links'],['Vision 2030','Capex driver','solar + interconnection'],['NEOM','Mega-project','new transmission'],['State','Ownership','low cost of capital']],
    s2:'The grid carries the kingdom\'s power — giant solar farms and gas plants step up, cross the desert corridor, step down to Riyadh — and the network is being built out to connect the Vision&nbsp;2030 renewables. The <b style="color:#0c6b4f">return</b> rises from a regulated, state-backed asset base. Drag the levers: a state monopoly with a low cost of capital, building hard.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on assets', yrS:'regulated network revenue',
    preset:'Load National Grid SA',
    try:'<b>Try this:</b> the allowed return on a <b>state-backed</b> network sits lower than an emerging-market private concession — sovereign ownership means a low cost of capital. But the RAB is growing fast: wind it up to see how the Vision&nbsp;2030 build-out compounds the base. The trade-off is a strategic, state owner rather than a financial one, and lighter disclosure.',
    s3:'National Grid SA earns a <b>regulated network revenue</b> — a return on its asset base, recovery of depreciation, and an opex allowance — set within the kingdom\'s regulated tariff framework. The dominant lever is <b>capex</b>: the Vision&nbsp;2030 build-out (solar connection, HVDC, NEOM) is expanding the asset base rapidly. As a state asset the cost of capital is low and the financing sovereign-backed; the objective is to enable the energy strategy as much as to earn a return.',
    mb:{tag:'Model B · state-owned', title:'State-owned transmission monopoly', body:'A state-controlled transmission monopoly, regulated within the national tariff framework, building out the network to deliver the country\'s energy strategy. Low cost of capital and sovereign backing, fast RAB growth — but a strategic, not purely financial, owner and lighter disclosure. <b>This is National Grid SA</b> — the transmission arm of state-controlled SEC.'},
    s4a:'A state transmission monopoly runs the same lean cost base as any network — maintenance and overhead — so the margin is high. The dominant number is the <b>capital</b> of the Vision&nbsp;2030 build-out, financed on sovereign-backed terms and earning a regulated return as it enters the asset base.',
    wfNote:'Operating cost is network maintenance and overhead — small against a regulated revenue. The swing factor is the pace of the build-out and the asset base it creates, on which a regulated return is allowed.',
    s4b:'The capital programme is vast: hundreds of billions of riyals of generation, storage and transmission under Vision&nbsp;2030, of which the transmission build-out — 380&nbsp;kV reinforcement, new HVDC links, NEOM\'s network — grows National Grid SA\'s asset base. It is financed on the state utility\'s sovereign-backed balance sheet, which keeps the cost of capital low.',
    stackH:'The capital base · state network', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Saudi state (via SEC) — sovereign-backed']],
    finList:[['','Network asset base','~SR 90bn, growing'],['sub','Regulator','WERA (state framework)'],['','Owner','Saudi Electricity Company (state)'],['sub','Backbone','380 kV + HVDC'],['','Capex driver','Vision 2030 solar + interconnection'],['rest','Cost of capital','low (sovereign-backed)']],
    finNote:'A state transmission monopoly is a <b>strategic asset first</b>: it earns a regulated return at a low, sovereign-backed cost of capital, and its purpose is to deliver the national energy strategy. The flip side is a state — not financial — owner, lighter disclosure, and returns set by policy.',
    timeline:[['2000','<b>SEC formed</b> by merging Saudi electricity utilities.'],['2012','<b>National Grid SA</b> established as the transmission arm.'],['2021','<b>Vision 2030</b> renewables programme accelerates.'],['2023','<b>Sudair solar</b> and new HVDC links connect.'],['2024','<b>NEOM &amp; mega-projects</b> drive network expansion.'],['2030','<b>Target grid</b> for a transformed energy mix.']],
    calcNote:'A working model of a <b>state-owned regulated network</b>. The cost of capital is low (sovereign-backed), the tax rate is low, and growth is high to reflect the Vision&nbsp;2030 build-out. A state asset earns a steady regulated return on a fast-growing base.',
    s6:'National Grid SA is state-backed transmission building for a national energy transformation. What drives it:',
    breakers:['<b>RAB growth</b> — the Vision 2030 build-out compounds the asset base; deliverability is the lever.','<b>Cost of capital</b> — sovereign backing keeps it low, lifting the value of a regulated return.','<b>Policy direction</b> — a strategic state owner sets the agenda; returns are policy-driven.','<b>Interconnection</b> — HVDC links to Egypt and the GCC extend the network\'s role and asset base.'],
    src:'Figures from public sources: <a href="https://www.se.com.sa/" target="_blank" rel="noopener">Saudi Electricity Company</a> disclosure and reporting on National Grid SA and Vision 2030 transmission. As a state asset, disclosure is limited; figures are approximate and illustrative.',
    econ:{cur:'SR',gw:70,volt:'380 kV',
      rabDef:90,rabMin:40,rabMax:160,rabStep:1, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:3.5, anc:0},
    calc:{build:90000,grant:0,capex:48,revG:6,floor:10000,cap:20000,tax:5,exit:9.5,lev:5,rd:4.5,amort:2,hold:25},
    map:{footer:GEO.saudi.footer}
  },

  /* ---------- 6 · STATE GRID (China · state-owned UHV) ---------- */
  stategrid:{
    name:'State Grid (UHV)', geo:'China', continent:'China', cur:'¥', geoKey:'stategrid',
    lede:'The world\'s largest utility — a <b>state-owned</b> giant whose ultra-high-voltage backbone carries power thousands of kilometres from the west\'s hydro, coal and renewables to the eastern megacities.',
    s1:'<p class="body"><b>State Grid Corporation of China</b> is the biggest electric utility on earth, serving over a billion people. Its defining engineering achievement is <b>ultra-high-voltage (UHV) transmission</b>: ±800&nbsp;kV and ±1,100&nbsp;kV HVDC lines, and 1,000&nbsp;kV UHV AC, that move bulk power <b>thousands of kilometres</b> with low losses — from the hydro of the southwest, the coal and wind of the north, and the solar of the Gobi, to the load centres of the eastern seaboard.</p>'+
       '<p class="body">It is a <b>state-owned monopoly</b>, with transmission tariffs regulated by the national authority (NDRC/NEA). The model is the same regulated building-block — a return on a vast asset base — but at a scale, and a cost of capital, that only a state giant can command. The strategic purpose is national: balancing a continental power system and integrating the world\'s largest renewable build-out.</p>',
    facts:[['vast','Asset base','world\'s largest utility'],['±1100 kV','UHV DC','world record voltage'],['1000 kV','UHV AC','low-loss long distance'],['NDRC / NEA','Regulator','state framework'],['West→East','Mega-transfer','thousands of km'],['State','Ownership','very low cost of capital']],
    s2:'The picture is the same but the distances are continental: western hydro, coal and wind step up to <b>ultra-high voltage</b>, race across the country on the UHV corridor with minimal loss, step down, and power Shanghai. The <b style="color:#0c6b4f">return</b> rises from a colossal regulated asset base. Drag the levers — at this scale even a thin allowed return on the asset base is an enormous absolute cash flow.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on assets', yrS:'regulated network revenue',
    preset:'Load State Grid (UHV)',
    try:'<b>Try this:</b> the allowed return on a <b>state-backed</b> Chinese network is <b>thin</b> by Western standards — but the asset base is vast, so the absolute return is huge. Scale, not the percentage, is the model, just like the Chinese ports and airports. The cost of capital is very low because the owner is the state.',
    s3:'State Grid earns a <b>regulated transmission tariff</b> — a return on its enormous asset base, recovery of depreciation, and an opex allowance — within China\'s regulated framework. The dominant lever is <b>scale and capex</b>: the UHV build-out and the integration of the world\'s largest renewable fleet keep the asset base growing. The allowed return is thin, but applied to a colossal base and financed at a state cost of capital, it compounds into a vast, stable cash flow.',
    mb:{tag:'Model B · state-owned scale', title:'State-owned UHV monopoly', body:'A state-owned national transmission monopoly operating at continental scale, earning a thin regulated return on a colossal asset base, financed at a very low state cost of capital, and reinvesting in UHV and renewable integration. Strategically central and immense, but tied to state direction. <b>This is State Grid</b> — the world\'s largest utility.'},
    s4a:'At this scale the cost base is immense in absolute terms — maintaining a continental UHV network — but small relative to the revenue, so the margin is high. The dominant number is the <b>capital</b>: the UHV build-out and renewable integration grow the asset base, on which the state allows a regulated return at a very low cost of capital.',
    wfNote:'Operating cost is the maintenance and operation of a continental UHV network — large in absolute terms but small against the revenue from a colossal asset base. State backing keeps the cost of capital, and so the allowed return, low.',
    s4b:'The capital is on a national scale — the world\'s largest network of lines and substations, plus the flagship UHV DC and AC corridors that are engineering records in their own right. It is financed on a state-backed balance sheet that can mobilise capital at a scale and cost few utilities on earth can match.',
    stackH:'The capital base · national grid', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Chinese state — sovereign-backed']],
    finList:[['','Asset base','vast — world\'s largest utility'],['sub','Regulator','NDRC / NEA (state framework)'],['','UHV records','±1100 kV DC · 1000 kV AC'],['sub','Mission','west-to-east mega-transfer'],['','Capex driver','UHV + renewable integration'],['rest','Cost of capital','very low (state)']],
    finNote:'State Grid is a <b>state asset at continental scale</b>: a thin regulated return on a colossal, growing asset base, financed at a very low cost of capital, and central to China\'s energy strategy. The return is steady and immense in absolute terms; the owner and the strategy are the state\'s.',
    timeline:[['2002','<b>State Grid established</b> in China\'s power-sector reform.'],['2009','<b>First 1,000 kV UHV AC</b> line commissioned.'],['2010','<b>±800 kV UHV DC</b> lines begin moving western power east.'],['2019','<b>±1,100 kV UHV DC</b> (Changji–Guquan) — world record voltage.'],['2020s','<b>Renewable integration</b> — Gobi solar/wind bases connected by UHV.'],['Ongoing','<b>West-to-east transfer</b> at continental scale.']],
    calcNote:'A working model of a <b>state-owned network at scale</b>, on an enterprise-value basis. The allowed return is thin and the cost of capital very low (state-backed), but the asset base is vast — so the absolute return is enormous and steady. Figures are highly illustrative given the company\'s scale.',
    s6:'State Grid is scale as a strategy — a thin return on a colossal, state-backed base. What drives it:',
    breakers:['<b>Scale &amp; asset base</b> — a thin return on a vast base is the model; growth comes from UHV and renewable integration.','<b>Cost of capital</b> — state backing keeps it very low, lifting the value of even a thin allowed return.','<b>State direction</b> — policy, not shareholders, sets strategy and the allowed return.','<b>Renewable integration</b> — connecting the world\'s largest wind and solar build-out drives the forward capex.'],
    src:'Figures from public sources: reporting on <a href="http://www.sgcc.com.cn/" target="_blank" rel="noopener">State Grid Corporation of China</a> and its UHV programme. Given the company\'s scale and limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥',gw:250,volt:'±1100 kV UHV',
      rabDef:800,rabMin:300,rabMax:1500,rabStep:10, waccDef:5,waccMin:3,waccMax:8,waccStep:0.25,
      perfDef:0.2,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:25, anc:0},
    calc:{build:800000,grant:0,capex:40,revG:5,floor:80000,cap:160000,tax:25,exit:11,lev:4,rd:4,amort:2,hold:25},
    map:{footer:GEO.stategrid.footer}
  }
  };
  var ORDER=['nationalgrid','itc','cteep','transgrid','saudi','stategrid'];

  /* ===================================================================
     GRID LANDSCAPE RENDERER  (canvas, 720x520 scene coords, side elevation)
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }

  var GY=432;                          // ground baseline
  var SUBL_X=232, SUBR_X=576;          // step-up / step-down substations
  var PX0=262, PX1=552, TY=150;        // pylon corridor span + tower-top y
  var GENXS=[28,80,132,180];           // generation cluster x positions

  /* ---- sky, hills, ground ---- */
  function drawSky(){
    var g=ctx.createLinearGradient(0,0,0,GY);
    g.addColorStop(0,'#cfe0ee'); g.addColorStop(0.6,'#dcebf2'); g.addColorStop(1,'#eaf1ee');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,GY);
    // sun
    var sx=600,sy=70; var sg=ctx.createRadialGradient(sx,sy,0,sx,sy,60);
    sg.addColorStop(0,'rgba(255,244,214,0.9)'); sg.addColorStop(1,'rgba(255,244,214,0)');
    ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(sx,sy,60,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#f7eecb'; ctx.beginPath(); ctx.arc(sx,sy,15,0,Math.PI*2); ctx.fill();
    // drifting clouds
    ctx.fillStyle='rgba(255,255,255,0.5)';
    [120,330,500].forEach(function(cx,i){ var x=(cx+T*0.15*(i+1)*0.2)%(W+120)-60, cy=46+i*16;
      ctx.beginPath(); ctx.ellipse(x,cy,40,11,0,0,Math.PI*2); ctx.ellipse(x+26,cy-5,26,9,0,0,Math.PI*2); ctx.fill(); });
  }
  function drawHills(){
    ctx.fillStyle='#cdd9cd'; ctx.beginPath(); ctx.moveTo(0,GY);
    for(var x=0;x<=W;x+=40) ctx.lineTo(x,GY-40-26*Math.sin(x*0.012+1)); ctx.lineTo(W,GY); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#c2cfbf'; ctx.beginPath(); ctx.moveTo(0,GY);
    for(var x2=0;x2<=W;x2+=40) ctx.lineTo(x2,GY-18-16*Math.sin(x2*0.02+3)); ctx.lineTo(W,GY); ctx.closePath(); ctx.fill();
  }
  function drawGround(){
    var g=ctx.createLinearGradient(0,GY,0,H); g.addColorStop(0,'#b9c6ad'); g.addColorStop(1,'#a9b79c');
    ctx.fillStyle=g; ctx.fillRect(0,GY,W,H-GY);
    ctx.strokeStyle='rgba(120,140,110,0.18)'; ctx.lineWidth=1;
    for(var y=GY+10;y<H;y+=14){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  }

  /* ---- generation sources ---- */
  function turbine(cx,baseY,s,phase,offshore){
    if(offshore){ ctx.fillStyle='rgba(90,150,200,0.45)'; ctx.fillRect(cx-16,baseY,32,8); }
    ctx.strokeStyle='#e8ecee'; ctx.lineWidth=3*s; ctx.beginPath(); ctx.moveTo(cx,baseY); ctx.lineTo(cx,baseY-46*s); ctx.stroke();
    var hx=cx, hy=baseY-46*s;
    ctx.fillStyle='#cfd6da'; ctx.beginPath(); ctx.arc(hx,hy,3*s,0,Math.PI*2); ctx.fill();
    for(var b=0;b<3;b++){ var a=phase+b*Math.PI*2/3;
      ctx.save(); ctx.translate(hx,hy); ctx.rotate(a);
      ctx.fillStyle='#eef2f4'; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-2.2*s,-22*s); ctx.lineTo(2.2*s,-20*s); ctx.closePath(); ctx.fill();
      ctx.restore(); }
  }
  function solarArray(cx,baseY,s){
    for(var i=0;i<3;i++){ var x=cx-14+i*14;
      ctx.fillStyle='#22324a'; ctx.beginPath(); ctx.moveTo(x-6,baseY-2); ctx.lineTo(x+6,baseY-10); ctx.lineTo(x+6,baseY-3); ctx.lineTo(x-6,baseY+5); ctx.closePath(); ctx.fill();
      var gl=(Math.sin(T*0.05+i)>0.7)?0.6:0.2; ctx.fillStyle='rgba(150,200,255,'+gl+')';
      ctx.beginPath(); ctx.moveTo(x-3,baseY-3); ctx.lineTo(x+3,baseY-7); ctx.lineTo(x+4,baseY-5); ctx.lineTo(x-2,baseY-1); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#3a4a5a'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x,baseY+1); ctx.lineTo(x,baseY+5); ctx.stroke(); }
  }
  function coolingTower(cx,baseY,s){
    ctx.fillStyle='#cfd2d0'; ctx.beginPath();
    ctx.moveTo(cx-15*s,baseY); ctx.quadraticCurveTo(cx-7*s,baseY-26*s,cx-11*s,baseY-40*s);
    ctx.lineTo(cx+11*s,baseY-40*s); ctx.quadraticCurveTo(cx+7*s,baseY-26*s,cx+15*s,baseY); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(120,130,128,0.6)'; ctx.lineWidth=1; ctx.stroke();
    // steam
    for(var i=0;i<3;i++){ var t=(T*0.4+i*30)%60, yy=baseY-40*s-t*0.8, a=Math.max(0,0.4-t*0.006);
      ctx.fillStyle='rgba(255,255,255,'+a+')'; ctx.beginPath(); ctx.arc(cx-4+Math.sin(t*0.1)*4,yy,6+t*0.12,0,Math.PI*2); ctx.fill(); }
  }
  function stacks(cx,baseY,s,smoke){
    ctx.fillStyle='#8a8f8c'; rr(cx-14,baseY-22*s,28,22*s,1); ctx.fill();   // plant block
    for(var i=0;i<2;i++){ var x=cx-8+i*16; ctx.fillStyle='#9aa0a0'; rr(x-2.5,baseY-40*s,5,40*s,1); ctx.fill();
      ctx.fillStyle='#c0463a'; ctx.fillRect(x-2.5,baseY-40*s,5,3);
      if(smoke){ for(var k=0;k<2;k++){ var t=(T*0.5+k*22+i*11)%44, yy=baseY-40*s-t*0.7, a=Math.max(0,0.32-t*0.007);
        ctx.fillStyle='rgba(120,120,120,'+a+')'; ctx.beginPath(); ctx.arc(x+Math.sin(t*0.12)*3,yy,3+t*0.1,0,Math.PI*2); ctx.fill(); } } }
  }
  function hydroDam(cx,baseY,s){
    // reservoir
    ctx.fillStyle='rgba(90,150,200,0.5)'; ctx.fillRect(cx-20,baseY-26,18,26);
    // dam wall
    ctx.fillStyle='#b6bbb8'; ctx.beginPath(); ctx.moveTo(cx-2,baseY-30); ctx.lineTo(cx+6,baseY-30); ctx.lineTo(cx+12,baseY); ctx.lineTo(cx+2,baseY); ctx.closePath(); ctx.fill();
    // spillway water
    ctx.strokeStyle='rgba(180,215,235,0.8)'; ctx.lineWidth=2;
    for(var i=0;i<3;i++){ var off=(T*1.2+i*7)%14; ctx.beginPath(); ctx.moveTo(cx+2,baseY-26+off); ctx.lineTo(cx+6,baseY-22+off); ctx.stroke(); }
  }
  function drawGeneration(G){
    var gens=G.gen||[];
    for(var i=0;i<gens.length && i<4;i++){ var x=GENXS[i], t=gens[i], ph=T*0.06+i;
      if(t==='offshore') turbine(x,GY-2,1,ph,true);
      else if(t==='wind') turbine(x,GY-2,1,ph,false);
      else if(t==='solar') solarArray(x,GY-2,1);
      else if(t==='nuclear') coolingTower(x,GY-2,1);
      else if(t==='coal') stacks(x,GY-2,1,true);
      else if(t==='gas') stacks(x,GY-2,1,false);
      else if(t==='hydro') hydroDam(x,GY-2,1);
    }
    ctx.fillStyle='rgba(60,80,72,0.7)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('GENERATION',104,GY+18);
  }

  /* ---- substations ---- */
  function substation(cx,label,hvdc){
    // pad
    ctx.fillStyle='#c7ccc6'; rr(cx-30,GY-40,60,40,3); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // transformers with cooling fins
    for(var i=0;i<2;i++){ var x=cx-18+i*22;
      ctx.fillStyle='#7d8480'; rr(x,GY-26,14,24,2); ctx.fill();
      ctx.strokeStyle='rgba(40,46,44,0.4)'; ctx.lineWidth=1; for(var f=1;f<5;f++){ ctx.beginPath(); ctx.moveTo(x,GY-26+f*5); ctx.lineTo(x+14,GY-26+f*5); ctx.stroke(); }
      // bushings
      ctx.strokeStyle='#9aa0a0'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x+4,GY-26); ctx.lineTo(x+4,GY-34); ctx.moveTo(x+10,GY-26); ctx.lineTo(x+10,GY-34); ctx.stroke(); }
    // gantry busbar
    ctx.strokeStyle='#8b9290'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(cx-26,GY-40); ctx.lineTo(cx-26,GY-58); ctx.moveTo(cx+26,GY-40); ctx.lineTo(cx+26,GY-58); ctx.moveTo(cx-26,GY-56); ctx.lineTo(cx+26,GY-56); ctx.stroke();
    // occasional arc flicker
    if((Math.sin(T*0.3+cx)>0.96)){ ctx.strokeStyle='rgba(180,220,255,0.8)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(cx-4,GY-34); ctx.lineTo(cx+2,GY-30); ctx.lineTo(cx-2,GY-28); ctx.stroke(); }
    if(hvdc){ ctx.fillStyle='#5566a0'; rr(cx-12,GY-38,24,16,2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='700 6px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('HVDC',cx,GY-28); }
    ctx.fillStyle='rgba(60,80,72,0.7)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(label,cx,GY+12);
  }

  /* ---- pylons + conductors + flowing current ---- */
  function pylonXs(G){ var n=G.pylons||5,a=[]; for(var i=0;i<n;i++) a.push(PX0+(PX1-PX0)*i/(n-1)); return a; }
  function pylon(x){
    var baseW=14, topW=5;
    ctx.strokeStyle='#7a817d'; ctx.lineWidth=1.6;
    // legs
    ctx.beginPath(); ctx.moveTo(x-baseW,GY); ctx.lineTo(x-topW,TY+4); ctx.moveTo(x+baseW,GY); ctx.lineTo(x+topW,TY+4); ctx.stroke();
    // cross braces
    ctx.lineWidth=0.8; ctx.strokeStyle='rgba(110,118,114,0.8)';
    for(var s=0;s<5;s++){ var y0=GY-(GY-TY-4)*s/5, y1=GY-(GY-TY-4)*(s+1)/5;
      var w0=baseW-(baseW-topW)*s/5, w1=baseW-(baseW-topW)*(s+1)/5;
      ctx.beginPath(); ctx.moveTo(x-w0,y0); ctx.lineTo(x+w1,y1); ctx.moveTo(x+w0,y0); ctx.lineTo(x-w1,y1); ctx.stroke(); }
    // cross arms
    ctx.strokeStyle='#7a817d'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(x-18,TY+8); ctx.lineTo(x+18,TY+8); ctx.moveTo(x-14,TY+22); ctx.lineTo(x+14,TY+22); ctx.stroke();
    // insulator strings (small)
    ctx.strokeStyle='rgba(90,98,94,0.9)'; ctx.lineWidth=1;
    [-18,18,-14,14].forEach(function(dx,i){ var ay=i<2?TY+8:TY+22; ctx.beginPath(); ctx.moveTo(x+dx,ay); ctx.lineTo(x+dx,ay+5); ctx.stroke(); });
  }
  function conductor(nodes,sag,col,lw){
    ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.beginPath();
    for(var i=0;i<nodes.length-1;i++){ var a=nodes[i],b=nodes[i+1], mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2+sag;
      if(i===0) ctx.moveTo(a[0],a[1]); ctx.quadraticCurveTo(mx,my,b[0],b[1]); }
    ctx.stroke();
  }
  function flowPulses(nodes,sag,speed,col,load){
    // sample points along the catenary polyline, draw moving bright dots
    var pts=[]; for(var i=0;i<nodes.length-1;i++){ var a=nodes[i],b=nodes[i+1], mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+sag;
      for(var t=0;t<1;t+=0.12){ var u=1-t; pts.push([u*u*a[0]+2*u*t*mx+t*t*b[0], u*u*a[1]+2*u*t*my+t*t*b[1]]); } }
    var n=Math.max(3,Math.round(6+load*8));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1)*(pts.length-1); var idx=f|0; var p=pts[idx]||pts[0];
      ctx.fillStyle=col; ctx.globalAlpha=0.85; ctx.beginPath(); ctx.arc(p[0],p[1],1.8,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
  }
  function drawCorridor(G,load){
    var pxs=pylonXs(G);
    // top + (optional) lower conductor nodes across gantry-pylons-gantry
    function nodesAt(off){ var a=[[SUBL_X+26,GY-56]]; pxs.forEach(function(x){ a.push([x,TY+off]); }); a.push([SUBR_X-26,GY-56]); return a; }
    var c1=nodesAt(8), c2=nodesAt(22);
    // conductors (AC circuits)
    conductor(c1,10,'#5a615d',1.4); conductor(c2,12,'#5a615d',1.2);
    if((G.circuits||2)>=2){ /* both drawn */ }
    // pylons on top of conductors? draw pylons then pulses
    pxs.forEach(function(x){ pylon(x); });
    // flowing current (blue/white) — speed and density scale with load
    flowPulses(c1,10,0.9+load,'rgba(120,200,255,0.95)',load);
    flowPulses(c2,12,0.8+load,'rgba(150,210,255,0.9)',load);
    // HVDC line (distinct bipole, lower) + converter note
    if(G.hvdc){ var dc=[[SUBL_X+26,GY-30]]; pxs.forEach(function(x){ dc.push([x,GY-30]); }); dc.push([SUBR_X-26,GY-30]);
      conductor(dc,4,'#b0552f',1.6); flowPulses(dc,4,1.0+load,'rgba(255,170,90,0.95)',load); }
    // voltage label
    ctx.fillStyle='rgba(40,60,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(A.econ.volt,(PX0+PX1)/2,TY-6);
  }

  /* ---- demand city ---- */
  function drawCity(G,load){
    var x0=600,x1=708, base=GY;
    var heights=[58,82,46,96,64,74,52,88,60];
    ctx.fillStyle='rgba(40,60,80,0.06)'; ctx.fillRect(x0-4,base-100,x1-x0+8,100);
    var bx=x0;
    for(var i=0;i<heights.length && bx<x1;i++){ var bw=10+ (i%3)*3, bh=heights[i]*(G.cityH||1);
      ctx.fillStyle=i%2?'#3a4a5e':'#445469'; rr(bx,base-bh,bw,bh,1); ctx.fill();
      // lit windows — brightness pulses with delivered load
      for(var wy=base-bh+5; wy<base-4; wy+=7){ for(var wx=bx+2; wx<bx+bw-2; wx+=4){
        var lit=((wx*7+wy*13+i)%10)/10 < (0.3+0.6*load); var fl=lit?(0.5+0.4*load):0.08;
        ctx.fillStyle='rgba(255,225,150,'+fl+')'; ctx.fillRect(wx,wy,2,3); } }
      bx+=bw+4; }
    ctx.fillStyle='rgba(60,80,72,0.75)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(G.city||'CITY',(x0+x1)/2,base+18);
  }

  /* ---- value-flow coins: green = return on RAB, amber = depreciation & recovery ---- */
  function spawnCoin(x,y,kind){ if(coins.length<54) coins.push({x:x+rnd(-4,4),y:y-2,vy:-0.5-Math.random()*0.4,life:1,kind:kind}); }
  function drawCoins(){
    for(var i=coins.length-1;i>=0;i--){ var c=coins[i];
      if(_anim){ c.y+=c.vy; c.vy*=0.985; c.life-=0.017; }
      if(c.life<=0){ coins.splice(i,1); continue; }
      ctx.save(); ctx.globalAlpha=Math.max(0,Math.min(1,c.life));
      var g=ctx.createRadialGradient(c.x-1,c.y-1,0,c.x,c.y,4);
      if(c.kind==='ret'){ g.addColorStop(0,'#9be8c4'); g.addColorStop(1,'#0c6b4f'); }
      else { g.addColorStop(0,'#fbe9a0'); g.addColorStop(1,'#c0902f'); }
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,3,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=c.kind==='ret'?'rgba(10,70,52,0.5)':'rgba(140,92,22,0.5)'; ctx.lineWidth=0.7; ctx.stroke();
      ctx.restore(); }
  }

  /* ===================================================================
     FRAME
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var G=GEO[A.geoKey], E=A.econ;
    var rabBn=parseFloat(sCap.value), wacc=parseFloat(sSpread.value)/100, perf=parseFloat(sAvail.value)/100;
    var RAB=rabBn*1e9;
    var load=0.5+0.42*Math.sin(T*0.012)+0.06*Math.sin(T*0.05);    // daily-ish demand swing (visual)
    load=Math.max(0.12,Math.min(1,load));

    ctx.clearRect(0,0,W,H);
    drawSky(); drawHills();
    drawCorridor(G,load);
    drawGround();
    drawGeneration(G);
    substation(SUBL_X,'STEP-UP',G.hvdc);
    substation(SUBR_X,'STEP-DOWN',G.hvdc);
    drawCity(G,load);

    // ---- economics (annual, regulated building-block) ----
    var returnRev=wacc*RAB, depRev=E.depRate*RAB, opexAllow=E.opexAllow*1e9, incentive=perf*RAB;
    var allowedRev=returnRev+depRev+opexAllow+incentive+(E.anc||0)*1e9;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,allowedRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    // opex split (sums to actual opex = opexAllow)
    var actualOpex=opexAllow;
    var c_om=actualOpex*0.46, c_fault=actualOpex*0.20, c_sys=actualOpex*0.16, c_admin=actualOpex*0.18;
    var ebitda=revenue-actualOpex;
    baseRevYr=revenue; baseCostYr=actualOpex; baseEbYr=ebitda;
    var retShare = (returnRev+incentive)/Math.max(1,(returnRev+incentive+depRev+opexAllow));

    // ---- value-flow coins (green return / amber depreciation+recovery) ----
    if(_anim){
      // sources: the two substations and the pylon bases (the RAB assets)
      var srcs=[[SUBL_X,GY-40],[SUBR_X,GY-40]]; pylonXs(G).forEach(function(x){ srcs.push([x,GY-10]); });
      if(Math.random()<0.55){ var s1=srcs[(Math.random()*srcs.length)|0];
        spawnCoin(s1[0],s1[1], Math.random()<retShare?'ret':'rec'); }
    }
    drawCoins();

    // legend
    ctx.save(); ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; var lx=30,ly=GY-8;
    ctx.fillStyle='rgba(255,255,255,0.55)'; rr(lx-6,ly-22,176,30,5); ctx.fill();
    ctx.fillStyle='#0c6b4f'; ctx.beginPath(); ctx.arc(lx,ly-12,3.4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(40,60,55,0.82)'; ctx.fillText('return on RAB '+Math.round(retShare*100)+'%',lx+8,ly-9);
    ctx.fillStyle='#c0902f'; ctx.beginPath(); ctx.arc(lx,ly,3.4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(40,60,55,0.82)'; ctx.fillText('depreciation & cost recovery '+Math.round((1-retShare)*100)+'%',lx+8,ly+3);
    ctx.restore();

    // footer caption + vignette
    ctx.save(); ctx.shadowColor='rgba(255,255,255,0.6)'; ctx.shadowBlur=3;
    ctx.fillStyle='rgba(40,60,80,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · RAB '+fmtBn(rabBn),W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.46,W/2,H/2,H*0.98);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.12)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',fmtBn(rabBn)); set('ixSpreadV',(Math.round(wacc*1000)/10)+'%'); set('ixAvailV',pctS(perf*100));
    set('ixDir',fmtBn(rabBn)); set('ixDirS','inflation-protected · grows with capex');
    set('ixMW',E.gw+' GW'); set('ixMWs',E.volt+' backbone');
    set('ixHr', money(returnRev)); set('ixYr','≈ '+money(allowedRev));

    drawWaterfall(revenue, [['Network O&amp;M',c_om],['Faults &amp; outages',c_fault],['System operation',c_sys],['Admin &amp; overhead',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the return is too thin to value against the asset base — raise the allowed return or the RAB.</span>'; return; }
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
     RENDER an asset into the page
  =================================================================== */
  var sCap=document.getElementById('ixCap'), sSpread=document.getElementById('ixSpread'), sAvail=document.getElementById('ixAvail'),
      iBuild=document.getElementById('iBuild'), iGrant=document.getElementById('iGrant'), iCapex=document.getElementById('iCapex'),
      iFloor=document.getElementById('iFloor'), iCap=document.getElementById('iCap');

  function render(key){
    A=ASSETS[key]; CUR=A.cur; coins=[];
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue uses the regulated building-block (return on RAB + depreciation + opex + incentive) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'nationalgrid');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
