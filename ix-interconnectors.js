/* Electricity interconnectors — data-driven worked examples.
   Six real assets, one template. Map geometry from ix-geo.js (GEO).
   The interactive figures are illustrative: revenue uses a stylised average
   assumption and the returns model is a simplified DCF, not a forecast. */
(function(){
  var HRS=8760;
  var CUR='€';
  var A=null;                 // current asset
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;

  /* ---------------- formatting ---------------- */
  function money(v){ var n=v<0; v=Math.abs(v); var o;
    if(v>=1e9)o=(v/1e9).toFixed(2)+'bn'; else if(v>=1e6)o=(v/1e6).toFixed(0)+'m';
    else if(v>=1e3)o=Math.round(v/1e3)+'k'; else o=''+Math.round(v);
    return (n?'−':'')+CUR+o; }
  function m1(v){ return (v/1e6).toFixed(1); }
  function set(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; }
  function html(id,t){ var e=document.getElementById(id); if(e) e.innerHTML=t; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · CELTIC (Europe · merchant cap-and-floor / regulated) ---------- */
  celtic:{
    name:'Celtic Interconnector', geo:'Ireland ⇄ France', continent:'Europe', cur:'€', geoKey:'celtic',
    lede:'Ireland\'s first direct link to the European mainland — 700&nbsp;MW of HVDC cable beneath the Celtic Sea, and the cleanest illustration of the merchant-versus-regulated question.',
    s1:'<p class="body">An <b>interconnector</b> is a high-voltage cable that joins two separate electricity grids so power can flow between them. Grids are otherwise islands: each balances its own supply and demand, and prices can differ sharply across a border at the same moment. A link lets electricity move to wherever it is scarcest — and therefore dearest.</p>'+
       '<p class="body">Three forces drive the build-out: <b>security of supply</b>, <b>integrating renewables</b> (exporting surplus wind instead of curtailing it, importing when it is calm), and <b>price convergence</b>. At 700&nbsp;MW the Celtic Interconnector can carry roughly the consumption of <b>450,000 homes</b>, and is Ireland\'s first direct link to the continental European grid — until now it was tethered only to Great Britain.</p>',
    facts:[['700 MW','Capacity','≈ 450,000 homes'],['575 km','Route length','~500 km on the seabed'],['±320 kV','HVDC','direct current'],['~€1.6 bn','Total cost','EirGrid &amp; RTÉ'],['€531 m','EU grant','CEF — largest ever'],['~2027','First power','building now']],
    s2:'Over a long sea crossing, ordinary <b>alternating current</b> won\'t reach — it wastes itself charging the cable\'s capacitance. So interconnectors use <b>high-voltage direct current (HVDC)</b>, with a <b>converter station</b> at each end turning grid AC into ±320&nbsp;kV DC for the crossing and back again. Celtic\'s converters sit at <b>Knockraha</b> near Cork and <b>La Martyre</b> in Brittany. The link carries at most its <b>rated capacity</b>, one direction at a time, and power always flows from the <b>cheaper</b> market to the <b>dearer</b> one. Set the price gap and watch.',
    driverLab:'Price gap IE−FR', availLab:'Availability', hrK:'Value captured /hr', yrS:'within the cap-and-floor band',
    preset:'Load the Celtic Interconnector',
    try:'<b>Try this:</b> drag the price gap to <b>0</b> — the flow stops, because there is no profit in moving power between two markets at the same price. Push it wide and the link pins at full capacity. A cable only earns when the two markets <i>disagree</i> on price.',
    s3:'An interconnector is an <b>arbitrage machine</b>. Its core revenue is <b>congestion rent</b>: the price gap between the two markets times the power flowing, every hour it flows. Capacity is auctioned to traders who pay roughly that price difference to ship power across, so the rent accrues to the cable\'s owner. The decisive question for an investor is <b>who keeps that rent</b> — set by the regulatory model.',
    mb:{tag:'Model B · regulated',title:'Regulated TSO asset',body:'The link sits in the national grid operators\' <b>regulated asset base</b>; they earn a <b>fixed allowed return</b> on the capital, while the congestion rent flows back to consumers through lower charges. Lowest risk, lowest but very stable return. <b>This is the Celtic Interconnector</b> — owned by EirGrid and RTÉ.'},
    s4a:'Once built, an interconnector is cheap to run — there is no fuel, just the upkeep of two converter stations and a cable on the seabed. So the <b>operating margin is high</b>, and most of the revenue drops through to EBITDA. The waterfall below is live from the model above.',
    wfNote:'Operating cost is dominated by the standing upkeep of the converters and the cable — a fixed base that barely moves with how much power flows, which is why a busy link is so profitable and a lightly-used one still pays its bills.',
    s4b:'Building it is the expensive part: years of converter stations, cable manufacture and marine installation — about <b>€1.62&nbsp;billion</b>, or roughly €2.3m per MW — all spent before a megawatt flows. Because the revenue is regulated and predictable, it carries a high share of <b>investment-grade debt</b>, topped up by an unusually large <b>EU grant</b>.',
    stackH:'The capital stack · ~€1.62 bn', splitL:'Who bears the cost', splitR:'cross-border allocation',
    split:[['s1',65,'Ireland · EirGrid 65%'],['s2',35,'France · RTÉ 35%']],
    finList:[['','EU grant — Connecting Europe Facility','€530.7m'],['','EirGrid debt package (close, Nov 2022)','€800m'],['sub','European Investment Bank — term loan','€300m'],['sub','Danske Bank — term loan','€300m'],['sub','Barclays + BNP Paribas — revolving facility','€200m'],['','RTÉ financing (France)','€404m'],['rest','Balance from regulated asset bases','balance']],
    finNote:'The <b>€530.7m</b> CEF award — split 65/35 in line with the cost allocation — was the <b>largest grant the EU had ever made to an energy project</b>, and lowers the capital the owners must recover.',
    timeline:[['2013–18','<b>EU Project of Common Interest</b> — fast-track permitting and funding eligibility.'],['Oct 2019','<b>€530.7m CEF grant awarded</b> — the EU\'s largest-ever energy grant.'],['2020–21','<b>Regulatory approvals</b> from CRU (Ireland) and CRE (France); planning consent.'],['Nov 2022','<b>Contracts &amp; financial close</b> — Nexans (cable), Siemens Energy (converters); €800m debt closes.'],['2023–25','<b>Manufacture &amp; installation</b> — cable made in Norway and Belgium; converters on both coasts.'],['~2026–27','<b>Commissioning &amp; first power</b> — testing then commercial operation.']],
    calcNote:'A working model of the investment case. Year-1 revenue and EBITDA flow from the live map above — change the <b>price gap</b>, capacity or availability and everything here moves. The <b style="color:#0c6b4f">unlevered IRR</b> (asset return) and <b style="color:var(--accent)">levered IRR</b> (return to equity, after debt) recompute instantly.',
    s6:'Move the price gap in the model and watch how violently the merchant case swings — that single sensitivity explains the industry. Pure congestion rent rarely justifies a billion-euro cable on its own, which is why interconnectors are built under cap-and-floor or full regulation. Celtic takes the regulated route, so its owners earn a steady allowed return and consumers take the spread risk.',
    breakers:['<b>The price spread</b> — its average level and, even more, its volatility. Decarbonising, converging grids may narrow it over decades.','<b>Availability</b> — a seabed fault can take a cable out for months, and an idle link earns nothing.','<b>The regime</b> — the width of the cap-and-floor band, or the size of the regulated allowed return, sets the floor and ceiling on outcomes.','<b>Build &amp; route risk</b> — fixed, front-loaded capex; overruns or delays bite before any revenue arrives.'],
    src:'Figures from the project\'s developers and public sources: <a href="https://www.eirgrid.ie/celticinterconnector" target="_blank" rel="noopener">EirGrid</a>, <a href="https://www.rte-france.com/en/projects/celtic-interconnector-interconnection-between-france-ireland" target="_blank" rel="noopener">RTÉ</a>, <a href="https://www.nexans.com/" target="_blank" rel="noopener">Nexans</a>, the <a href="https://energy.ec.europa.eu/" target="_blank" rel="noopener">European Commission (CEF / PCI)</a> and the <a href="https://www.eib.org/en/projects/all/20180149" target="_blank" rel="noopener">European Investment Bank</a>.',
    econ:{mode:'merchant',flow:'spread',flowFull:15,regRev:0,
      capDef:700,capMin:350,capMax:1400,capStep:50,
      driverDef:18,driverMin:-60,driverMax:60,driverStep:1,driverSigned:true,
      availDef:95,availMin:85,availMax:99},
    opex:{l1:'Converter &amp; cable O&amp;M',l2:'Marine repair reserve',f2:0.36,ins:0.0035,admin:3},
    calc:{build:2.31,grant:531,om:22,revG:1,floor:70,cap:180,tax:25,exit:14,lev:6,rd:5,amort:3,hold:15},
    map:{
      home:['Ireland','France'],
      labels:[['IRELAND',-8.0,53.35,'land'],['FRANCE',-1.55,48.1,'land'],['GREAT BRITAIN',-1.9,53.0,'context'],['CELTIC SEA',-6.7,50.3,'sea'],['ATLANTIC',-10.3,49.0,'seafaint']],
      nodeA:{lng:-8.00,lat:51.88,label:'Knockraha',sub:'Cork · converter',below:false},
      nodeB:{lng:-4.10,lat:48.62,label:'La Martyre',sub:'Brittany · converter',below:true},
      route:[[-8.0,51.88],[-7.3,50.6],[-5.6,49.4],[-4.1,48.62]],
      footer:'HVDC · ±320 kV · routed through the Celtic Sea, west of Britain',
      flowText:{toA:['France → Ireland','importing cheaper French power'],toB:['Ireland → France','exporting cheaper Irish power'],none:['No flow','prices are level']}}
  },

  /* ---------- 2 · CHAMPLAIN HUDSON (North America · contracted offtake) ---------- */
  chpe:{
    name:'Champlain Hudson Power Express', geo:'Québec ⇄ New York', continent:'North America', cur:'US$', geoKey:'chpe',
    lede:'1,250&nbsp;MW of clean Québec hydropower, buried and submerged the whole way into New York City — with the price locked in by a 25-year state contract.',
    s1:'<p class="body">The same machine — a high-voltage link joining two grids — but here the business model is the opposite of merchant. <b>CHPE</b> is a 1,250&nbsp;MW HVDC line that carries cheap Québec hydropower 545&nbsp;km south, entirely buried or underwater down Lake Champlain and the Hudson River, into the heart of <b>New York City</b>. No overhead lines: the route hides in a rail corridor and a riverbed, which is what made it permittable.</p>'+
       '<p class="body">It plugs the highest-priced corner of the US grid (NYC, "Zone J") into one of the cheapest, cleanest sources on the continent. At full output it can meet roughly <b>20% of New York City\'s electricity</b> — about a million homes — and displace fossil generation in the city.</p>',
    facts:[['1,250 MW','Capacity','≈ 1m NYC homes'],['545 km','Route length','~309 km underwater'],['±320 kV','HVDC VSC','buried &amp; subsea'],['~US$6 bn','Total cost','Blackstone / TDI'],['25 yr','Tier-4 contract','NYSERDA offtake'],['2026','First power','now operating']],
    s2:'CHPE uses <b>voltage-source HVDC</b> (Hitachi "HVDC Light"), with converter stations at <b>Hertel</b> near Montréal and <b>Astoria</b> in Queens. Physically it is one-directional: power runs north-to-south, from a low-cost hydro system into a high-cost city. The slider below is the <b>price gap</b> it monetises — New York\'s wholesale price minus the cost of the delivered Québec hydro — but, crucially, that spread is locked in by contract (next section), so the owner doesn\'t ride it raw.',
    driverLab:'Captured price', availLab:'Utilisation', hrK:'Contracted value /hr', yrS:'under the 25-year contract',
    preset:'Load Champlain Hudson',
    try:'<b>Try this:</b> the link runs flat-out, one direction, almost all year — that steady baseload is the point. Now look at section 5: because a 25-year contract fixes the price, the revenue barely flinches even if the raw market spread moves. Stability, not volatility, is what equity is buying here.',
    s3:'CHPE earns the same congestion rent in principle — but it has sold that rent forward. Under a <b>25-year Tier-4 contract</b> with New York State (NYSERDA), it receives an indexed strike price (~US$97.5/MWh in year one) for its clean energy: when the city\'s market price is lower, the state tops it up; when higher, value is handed back. The raw arbitrage is converted into a <b>fixed, investment-grade cash flow</b>. That is why Blackstone could fund it with ~US$4bn of green bonds rated Baa1/A−.',
    mb:{tag:'Model B · contracted',title:'Long-term offtake (PPA)',body:'A government counterparty buys the output under a <b>multi-decade fixed-price contract</b>, so the owner takes almost no price risk — only availability and construction risk. Returns are lower than merchant but bond-like and highly leverable. <b>This is CHPE</b>: a 25-year NYSERDA Tier-4 contract underwrites the whole asset.'},
    s4a:'A contracted asset turns the whole investment case into a question of <b>cost and uptime</b>. There is no fuel and little market exposure, so once the line is energised the operating margin is very high and remarkably stable. The waterfall below shows revenue, less the modest cost of running two converters and 545&nbsp;km of cable, leaving EBITDA.',
    wfNote:'Because the revenue is contracted, the EBITDA line is about as predictable as infrastructure gets — the main risk to it is an outage on the link, not a soft power market.',
    s4b:'Building it cost roughly <b>US$6&nbsp;billion</b> — about US$4.8m per MW for a fully buried/subsea route. The contracted cash flow let it carry an unusually thin equity cheque: financial close in 2022 was ~94% debt, later refinanced with a US$4bn investment-grade green bond.',
    stackH:'The capital stack · ~US$6.0 bn', splitL:'How it was funded', splitR:'at financial close (2022)',
    split:[['s1',93,'Senior debt 93%'],['s2',7,'Equity 7%']],
    finList:[['','Construction debt facility (2022)','~US$5.2bn'],['','Sponsor equity — Blackstone','~US$355m'],['sub','2024 refinancing — green bond','US$4.0bn'],['sub','· 2031 tranche @ 4.875%','US$1.0bn'],['sub','· 2033 tranche @ 5.10%','US$0.75bn'],['sub','· 2036 tranche @ 5.35%','US$1.25bn'],['rest','Ratings: Moody\'s Baa1 / Fitch A−','IG']],
    finNote:'Power is supplied by <b>Hydro-Québec</b>; the wire is owned by <b>Transmission Developers Inc.</b>, a Blackstone company. The 25-year state-backed offtake is what turned a merchant arbitrage into an investment-grade, highly-levered cash flow.',
    timeline:[['Apr 2013','<b>NY PSC Article VII certificate</b> — environmental compatibility &amp; public need.'],['2014','<b>US DOE Presidential Permit</b> — cross-border authorisation.'],['Nov 2021','<b>NYSERDA Tier-4 contract finalised</b> — 25-year indexed offtake.'],['Nov 2022','<b>Financial close</b> — ~US$5.6bn raised; construction begins.'],['2023–25','<b>Construction</b> — buried cable in rail corridor; subsea in Lake Champlain &amp; the Hudson.'],['May 2026','<b>Commercial operation</b> — clean power flowing into New York City.']],
    calcNote:'A working model of the investment case, calibrated to a <b>contracted</b> asset. The revenue is set by the captured price and utilisation above; the floor and cap are pulled close together because a long-term contract removes most price risk. Watch how high leverage lifts the <b style="color:var(--accent)">levered IRR</b> when the cash flow is this stable.',
    s6:'A contracted link inverts the merchant risk picture. The spread no longer drives returns — the <b>contract</b> does. What matters is keeping the line available and the counterparty paying. The levers:',
    breakers:['<b>The contract</b> — its strike price, indexation and 25-year term set the cash flow; the market spread is hedged away.','<b>Counterparty &amp; policy</b> — the value rests on a state agency honouring a multi-decade obligation.','<b>Availability</b> — the only operational way to miss the number is an outage on a buried/subsea cable that is slow to repair.','<b>Leverage</b> — bond-like cash flows support very high gearing, which is where most of the equity return is manufactured.'],
    src:'Figures from public sources: <a href="https://chpexpress.com/" target="_blank" rel="noopener">Transmission Developers / CHPE</a>, <a href="https://www.nyserda.ny.gov/" target="_blank" rel="noopener">NYSERDA</a>, <a href="https://www.hydroquebec.com/" target="_blank" rel="noopener">Hydro-Québec</a>, the <a href="https://www.governor.ny.gov/" target="_blank" rel="noopener">New York State Governor\'s office</a> and reporting on the 2022 financing and 2024 green-bond refinancing.',
    econ:{mode:'contracted',flow:'AtoB',flowFull:15,regRev:0,
      capDef:1250,capMin:600,capMax:1500,capStep:50,
      driverDef:57,driverMin:30,driverMax:140,driverStep:1,driverSigned:false,
      availDef:95,availMin:70,availMax:99},
    opex:{l1:'Converter &amp; cable O&amp;M',l2:'Spares &amp; reserve',f2:0.25,ins:0.0015,admin:8},
    calc:{build:4.8,grant:0,om:48,revG:2,floor:534,cap:712,tax:26,exit:12,lev:8,rd:5,amort:3,hold:25},
    map:{
      home:['United States of America'],
      labels:[['QUÉBEC · CANADA',-74.6,46.05,'context'],['NEW YORK',-75.2,42.6,'land'],['ATLANTIC',-72.0,40.7,'sea'],['Lake Champlain',-73.25,44.7,'seafaint'],['Hudson R.',-74.5,42.0,'seafaint']],
      nodeA:{lng:-73.49,lat:45.42,label:'Hertel',sub:'La Prairie · converter',below:false},
      nodeB:{lng:-73.93,lat:40.78,label:'Astoria',sub:'Queens · converter',below:true},
      route:[[-73.49,45.42],[-73.33,44.55],[-73.55,43.4],[-73.82,42.4],[-73.95,41.4],[-73.93,40.78]],
      footer:'HVDC · ±320 kV · buried &amp; subsea down Lake Champlain and the Hudson',
      flowText:{toA:['Québec → New York','firm clean hydro into the city'],toB:['Québec → New York','firm clean hydro into the city'],none:['Québec → New York','firm clean hydro into the city']}}
  },

  /* ---------- 3 · MARINUS LINK (Oceania · regulated) ---------- */
  marinus:{
    name:'Marinus Link', geo:'Tasmania ⇄ Victoria', continent:'Oceania', cur:'A$', geoKey:'marinus',
    lede:'A 750&nbsp;MW HVDC spine across the Bass Strait, built to firm the mainland on Tasmania\'s hydro — and remunerated like a regulated utility, not a trader.',
    s1:'<p class="body"><b>Marinus Link</b> is a planned 255&nbsp;km subsea HVDC connection across the Bass Strait, joining Tasmania to the Victorian mainland and tripling the link between the two. Its first stage is a single 750&nbsp;MW cable; a second would take it to 1,500&nbsp;MW. The case is renewables, not arbitrage: it lets the mainland lean on Tasmania\'s hydro and pumped storage — the "<b>Battery of the Nation</b>" — while exporting Tasmanian and offshore wind north.</p>'+
       '<p class="body">Stage 1 alone can shift the output of roughly <b>750,000 homes</b> across the strait, and is the spine of a plan to firm a renewable-heavy National Electricity Market with dispatchable storage.</p>',
    facts:[['750 MW','Capacity (Stage 1)','≈ 750,000 homes'],['345 km','Route length','~255 km subsea'],['±320 kV','HVDC VSC','Bass Strait'],['~A$3.5 bn','Cost (Stage 1)','cable + converters'],['A$3.8 bn','CEFC loan','concessional'],['~2030','First power','building']],
    s2:'Marinus is a <b>voltage-source HVDC</b> link with converters at <b>Heybridge</b> in Tasmania and <b>Hazelwood</b> in Victoria\'s Latrobe Valley, plus ~90&nbsp;km of underground cable on the Victorian side. Physically it is bidirectional — power flows whichever way the dispatch gap points — but, as a regulated asset, the owner doesn\'t keep that spread. The slider drives the flow on the map; watch the revenue stay almost flat below it.',
    driverLab:'Tas−Vic spread', availLab:'Availability', hrK:'Spread to consumers /hr', yrS:'a regulated allowed revenue',
    preset:'Load Marinus Link',
    try:'<b>Try this:</b> drag the spread back and forth — the cable reverses, the flow swells and fades, but the <b>revenue scarcely moves</b>. That is the regulated model: the owner earns a set return on the capital, and the value of the spread flows through to consumers, not to equity.',
    s3:'Marinus will be a <b>regulated transmission asset</b>. Rather than keeping congestion rent, the owner recovers an <b>allowed revenue</b> — the regulator\'s view of efficient costs plus a return on capital — through transmission charges. The congestion value accrues to the market and, ultimately, consumers. It is the lowest-risk model: returns are modest but set by formula, not by the weather or the spread.',
    mb:{tag:'Model B · regulated',title:'Regulated transmission asset',body:'The link earns an <b>allowed revenue</b> set by the regulator (the AER), covering efficient costs and a return on the regulated asset base. Consumers fund it through transmission tariffs and capture the market benefit. Stable and low-risk, underpinned here by <b>government equity and a A$3.8bn concessional loan</b> from the Clean Energy Finance Corporation.'},
    s4a:'For a regulated link the EBITDA is essentially engineered by the regulator: an allowed revenue, less efficient operating cost, leaves a return on the asset base. There is little to surprise on the way down the waterfall — which is exactly the appeal for low-cost, long-duration capital.',
    wfNote:'Operating cost is the standing upkeep of the converters and the subsea cable. With revenue set by formula and costs largely fixed, the EBITDA margin is stable across the regulatory period.',
    s4b:'Stage 1 is costed at about <b>A$3.5&nbsp;billion</b> (cable and converters), plus separate north-west Tasmanian network upgrades. It is funded by <b>government equity</b> across the Commonwealth, Victoria and Tasmania, and a record <b>A$3.8bn concessional loan</b> from the CEFC — public capital doing what merchant equity would not.',
    stackH:'The capital stack · ~A$3.5 bn (Stage 1)', splitL:'Government equity', splitR:'ownership split',
    split:[['s1',49,'Commonwealth 49%'],['s2',51,'Victoria 33% · Tasmania 18%']],
    finList:[['','CEFC concessional loan (to A$3.8bn)','A$3.8bn'],['','Commonwealth equity','49%'],['sub','Victoria equity','33.3%'],['sub','Tasmania equity (cash capped)','~17.7%'],['','AER revenue determination','2025–30'],['rest','Recovered via transmission tariffs','allowed rev.']],
    finNote:'The CEFC facility — its <b>largest-ever commitment</b> — and tri-government equity replace the private merchant equity that a pure-arbitrage case could not attract. The trade-off: consumers, not a sponsor, take the spread risk and the upside.',
    timeline:[['Jul 2018','<b>RIT-T begins</b> — the regulatory cost-benefit test for the link.'],['Jun 2021','<b>RIT-T concluded</b> — preferred option confirmed; reaffirmed 2024.'],['Aug 2025','<b>Final investment decision</b> on the 750 MW Stage 1; federal environmental approval.'],['Sep 2025','<b>Financial close</b> — contractors given notice to proceed.'],['Feb 2026','<b>AER final decision</b> on Stage 1 construction costs.'],['~2030','<b>Energisation</b> — Stage 1 enters service.']],
    calcNote:'A working model calibrated to a <b>regulated</b> asset. Revenue is an allowed revenue, so the floor and cap sit close together and the spread above changes the flow, not the cash. The <b style="color:#0c6b4f">unlevered IRR</b> sits near the regulator\'s allowed return; modest leverage lifts equity only gently.',
    s6:'A regulated link is the bond of the interconnector world: the return is set by formula, indexed to inflation, and the spread is someone else\'s problem. The variables that still matter:',
    breakers:['<b>The allowed return</b> — the regulator\'s WACC on the asset base is, more or less, the answer.','<b>Capex discipline</b> — overruns above the efficient allowance are borne by the owner, not recovered.','<b>Indexation</b> — the regulated asset base typically grows with inflation, quietly compounding the return.','<b>Policy &amp; concessional funding</b> — government equity and the CEFC loan are what make a thin regulated return financeable at all.'],
    src:'Figures from public sources: <a href="https://www.marinuslink.com.au/" target="_blank" rel="noopener">Marinus Link</a>, the <a href="https://www.aer.gov.au/" target="_blank" rel="noopener">Australian Energy Regulator</a>, the <a href="https://www.cefc.com.au/" target="_blank" rel="noopener">Clean Energy Finance Corporation</a> and Australian, Victorian and Tasmanian government announcements (FID and financial close, 2025).',
    econ:{mode:'regulated',flow:'spread',flowFull:14,regRev:305,
      capDef:750,capMin:375,capMax:1500,capStep:25,
      driverDef:20,driverMin:-50,driverMax:50,driverStep:1,driverSigned:true,
      availDef:95,availMin:80,availMax:99},
    opex:{l1:'Converter &amp; cable O&amp;M',l2:'Spares &amp; reserve',f2:0.20,ins:0.0015,admin:6},
    calc:{build:4.6,grant:0,om:55,revG:2.5,floor:275,cap:351,tax:30,exit:14,lev:7,rd:5.5,amort:3,hold:25},
    map:{
      home:['Australia'],
      labels:[['VICTORIA',146.0,-37.85,'land'],['TASMANIA',146.55,-42.0,'land'],['BASS STRAIT',145.5,-39.7,'sea']],
      nodeA:{lng:145.97,lat:-41.10,label:'Heybridge',sub:'Tasmania · converter',below:false},
      nodeB:{lng:146.40,lat:-38.27,label:'Hazelwood',sub:'Victoria · converter',below:true},
      route:[[145.97,-41.10],[146.05,-40.1],[146.2,-39.1],[146.40,-38.27]],
      footer:'HVDC · ±320 kV · 255 km subsea across Bass Strait',
      flowText:{toA:['Victoria → Tasmania','firming Tasmanian demand'],toB:['Tasmania → Victoria','exporting hydro &amp; wind'],none:['No flow','grids balanced']}}
  },

  /* ---------- 4 · GCC INTERCONNECTION (Asia · reserve-sharing) ---------- */
  gccia:{
    name:'GCC Interconnection', geo:'Gulf grid', continent:'Asia', cur:'US$', geoKey:'gccia',
    lede:'A 400&nbsp;kV backbone tying six Gulf states into one grid, where the payoff is the blackout that never happens — not the megawatt-hour traded.',
    s1:'<p class="body">Not every interconnector is a single cable. The <b>GCC Interconnection</b> is a 400&nbsp;kV backbone — about 913&nbsp;km of line plus a subsea cable to Bahrain — that ties together the national grids of <b>six Gulf states</b>: Saudi Arabia, Kuwait, Bahrain, Qatar, the UAE and Oman. Its purpose is not arbitrage at all. It is <b>reserve-sharing</b>: letting any member lean on the others\' spare capacity in an emergency, instead of each building its own costly standby plant.</p>'+
       '<p class="body">Because the Saudi grid runs at 60&nbsp;Hz and the others at 50&nbsp;Hz, the two are joined by a <b>back-to-back HVDC station at Al&nbsp;Fadhili</b>. In its first decade the grid is credited with averting more than <b>1,950 disturbances</b> across the region.</p>',
    facts:[['~2,000 MW','Exchange capacity','firm transfer'],['913 km','400 kV backbone','+ subsea to Bahrain'],['6','Member states','one shared grid'],['~US$1.5 bn','Phase-I cost','member equity'],['1,950+','Disturbances averted','in ~11 years'],['2009','Energised','Phase I']],
    s2:'The backbone runs as <b>400&nbsp;kV double-circuit AC at 50&nbsp;Hz</b> along the Arabian shore, with a <b>back-to-back HVDC converter at Al&nbsp;Fadhili</b> bridging it to Saudi Arabia\'s 60&nbsp;Hz system, and the whole exchange coordinated from a control centre at <b>Ghunan</b>. Power flows on demand to wherever a member is short — the slider stands in for that emergency-support gap, pushing shared reserves around the ring.',
    driverLab:'Support gap', availLab:'Availability', hrK:'Support value /hr', yrS:'transmission &amp; reserve service',
    preset:'Load the GCC grid',
    try:'<b>Try this:</b> the value here is not the energy traded — it is the blackout that <i>didn\'t</i> happen. Push the gap and reserves rush to the short member; the revenue line barely moves, because members pay for the <b>service and the security</b>, not the megawatt-hours.',
    s3:'GCCIA earns its keep differently again. There is some energy trading, but the dominant value is <b>avoided reserve</b>: with ~1,200&nbsp;MW of firm mutual support on tap, each state can hold less expensive standby generation of its own. The interconnection is credited with more than <b>US$2.6bn of economic savings</b> against a ~US$1.5bn cost. Revenue comes from <b>transmission-service and connection charges</b> levied on the member utilities.',
    mb:{tag:'Model B · reserve-sharing',title:'Regulated reserve pool',body:'A jointly-owned regulator-style operator earns <b>transmission and reserve-service charges</b> from its members; the real return is collective — the avoided cost of reserve plant that nobody now has to build alone. <b>This is GCCIA</b>, owned by the six states\' electricity authorities, rated <b>\'A\'</b> by S&amp;P on its sovereign-backed shareholder base.'},
    s4a:'A reserve-sharing operator recovers its costs from members rather than from a market, so its revenue is steady and its margin high — the assets are passive lines and substations with little to run. The waterfall is therefore unusually flat and predictable; the economics live in the avoided cost elsewhere in the system.',
    wfNote:'Operating cost is the upkeep of the backbone, the Al Fadhili converter and the control centre. With revenue recovered from members by formula, the margin is stable.',
    s4b:'Phase&nbsp;I cost roughly <b>US$1.5&nbsp;billion</b>, funded by <b>equity from the six member states</b> in a jointly-owned company, with Saudi Arabia the largest shareholder. Later extensions — a direct Oman link, a planned Iraq tie — increasingly use development-bank and commercial debt.',
    stackH:'The capital stack · ~US$1.5 bn (Phase I)', splitL:'Member ownership', splitR:'shareholding',
    split:[['s1',32,'Saudi Arabia 31.6%'],['s2',68,'Kuwait · UAE · Qatar · Bahrain · Oman']],
    finList:[['','Member-state equity','~US$1.5bn'],['sub','Saudi Arabia','31.6%'],['sub','Kuwait / UAE / Qatar','majority of balance'],['sub','Bahrain / Oman','remainder'],['','S&amp;P credit rating (Mar 2025)','\'A\' stable'],['rest','New links part debt-funded','dev. banks']],
    finNote:'The economic return is mostly off the balance sheet: more than <b>US$2.6bn</b> of avoided blackouts and deferred reserve plant, set against a ~US$1.5bn build. That is why a low cash return still made sense for six sovereign owners.',
    timeline:[['2001','<b>GCCIA established</b> — the six states agree to interconnect; company seated in Dammam.'],['2005','<b>Phase-I EPC contracts</b> awarded (>US$1bn); construction begins.'],['2009','<b>Phase I energised</b> — Kuwait, Saudi (via Al Fadhili HVDC), Bahrain, Qatar joined.'],['2011–14','<b>UAE &amp; Oman integrated</b> into the grid.'],['2016–19','<b>Energy-trade pilot</b> — a regional day-ahead market platform begins.'],['2025–27','<b>New direct links</b> — US$700m Oman tie under construction; Iraq link planned.']],
    calcNote:'A working model calibrated to a <b>regulated reserve-sharing</b> operator. Revenue is a transmission-service charge, so it is steady and the spread above only moves the flow. The headline return is modest — the real prize, the avoided cost of reserve plant, sits outside this model.',
    s6:'The GCC grid is a reminder that an interconnector\'s value can be reliability rather than rent. Its commercial return is deliberately low; the case is collective security. What moves it:',
    breakers:['<b>Avoided reserve</b> — the true return is the standby plant the members no longer each have to build.','<b>Membership &amp; cost-sharing</b> — the model only works while six sovereigns keep funding a shared asset.','<b>Emerging trade</b> — a regional market could layer energy-arbitrage revenue on top of the reliability base.','<b>Expansion</b> — new ties to Oman and Iraq stretch the grid and change its risk and funding mix.'],
    src:'Figures from public sources: <a href="https://gccia.com.sa/" target="_blank" rel="noopener">GCCIA</a>, its hosted <a href="https://gccia.com.sa/" target="_blank" rel="noopener">S&amp;P RatingsDirect report (2025)</a>, the <a href="https://www.oxfordenergy.org/" target="_blank" rel="noopener">Oxford Institute for Energy Studies</a> and trade reporting on the Al Fadhili converter and the Oman interconnection.',
    econ:{mode:'regulated',flow:'spread',flowFull:18,regRev:130,
      capDef:1200,capMin:600,capMax:2400,capStep:100,
      driverDef:25,driverMin:-50,driverMax:50,driverStep:1,driverSigned:true,
      availDef:92,availMin:80,availMax:99},
    opex:{l1:'Backbone &amp; substation O&amp;M',l2:'Control-centre &amp; dispatch',f2:0.30,ins:0.0015,admin:5},
    calc:{build:1.25,grant:0,om:22,revG:2,floor:117,cap:150,tax:9,exit:16,lev:5,rd:5,amort:3,hold:25},
    map:{
      home:['Saudi Arabia','United Arab Emirates','Qatar','Bahrain','Kuwait','Oman'],
      labels:[['SAUDI ARABIA',47.6,24.6,'land'],['IRAN',54.0,29.6,'context'],['U.A.E.',54.6,23.6,'land'],['OMAN',56.6,23.0,'land'],['QATAR',51.2,25.6,'land'],['KUWAIT',47.7,29.4,'land'],['THE GULF',52.0,27.2,'sea']],
      nodeA:{lng:49.0,lat:26.9,label:'Al Fadhili',sub:'back-to-back HVDC',below:false},
      nodeB:{lng:50.55,lat:26.05,label:'Ghunan',sub:'control centre',below:true},
      route:[[47.9,28.9],[49.0,26.9],[50.55,26.05],[51.3,25.4],[54.4,24.45],[56.3,24.3]],
      footer:'AC 400 kV double-circuit + back-to-back HVDC at Al Fadhili',
      flowText:{toA:['Shared reserves flowing','members supporting the grid'],toB:['Shared reserves flowing','members supporting the grid'],none:['Grids balanced','no support needed']}}
  },

  /* ---------- 5 · GARABI (South America · back-to-back, contracted) ---------- */
  garabi:{
    name:'Garabi', geo:'Brazil ⇄ Argentina', continent:'South America', cur:'US$', geoKey:'garabi',
    lede:'A 2,200&nbsp;MW back-to-back converter on the Brazil–Argentina border: a frequency firewall joining a 50&nbsp;Hz market to a 60&nbsp;Hz one, with no cable in between.',
    s1:'<p class="body">Argentina and Brazil run their grids at <b>different frequencies</b> — 50&nbsp;Hz and 60&nbsp;Hz — so they can never be wired together directly. <b>Garabi</b> solves this with a <b>back-to-back HVDC station</b> on the border at the Uruguay River: it converts incoming AC to DC and straight back to AC at the other frequency, in a single yard, with no long cable. It is a frequency firewall that lets controlled power cross between two otherwise-incompatible markets.</p>'+
       '<p class="body">At <b>2,200&nbsp;MW</b> across two 1,100&nbsp;MW phases, Garabi was for years the most powerful back-to-back link in the world — built to ship cheap Argentine power into Brazil.</p>',
    facts:[['2,200 MW','Capacity','2 × 1,100 MW'],['B2B','Back-to-back HVDC','50 ↔ 60 Hz'],['490 km','500 kV AC lines','either side'],['~US$0.7 bn','Total cost','CIEN / Endesa'],['2000–02','Commissioned','two phases'],['Taesa','Operator today','concession']],
    s2:'There is almost no cable here — the two converter halls sit side by side at <b>Garabi</b> on the Brazilian bank, fed by 500&nbsp;kV lines from <b>Rincón de Santa María</b> in Argentina and on into the Brazilian grid. Because the conversion is fully controllable, operators dial the flow up or down and reverse it at will. The slider sets that scheduled transfer; the link is used opportunistically, so it rarely runs full.',
    driverLab:'Contract price', availLab:'Utilisation', hrK:'Transfer value /hr', yrS:'a transmission concession',
    preset:'Load Garabi',
    try:'<b>Try this:</b> note the low utilisation — a back-to-back link earns on a thin slice of the hours, dispatched when the two markets diverge or one needs help. Its modern revenue, though, comes from a <b>regulated concession</b> that pays for availability, not for the energy it happens to carry.',
    s3:'Garabi was built on a <b>20-year firm-supply contract</b> to export Argentine power to Brazil — a merchant export play, by a private consortium (CIEN, led by Endesa). When Argentina restricted exports in its 2001–02 crisis, that base evaporated, and the asset shifted to <b>opportunistic, bidirectional</b> exchange. Today it sits inside Brazil\'s <b>regulated transmission framework</b> (operated by Taesa), earning an availability-based concession revenue rather than trading margin.',
    mb:{tag:'Model B · concession',title:'Regulated transmission concession',body:'The asset now earns a <b>concession revenue</b> — an availability payment under Brazil\'s regulated transmission regime — largely independent of how much power actually crosses. Stable and inflation-indexed, but exposed to <b>emerging-market</b> rates and currency. <b>This is Garabi today</b>, operated by Taesa; its original merchant export contract is long expired.'},
    s4a:'A back-to-back station is almost all converter and very little line, so its cost base is dominated by the valve halls — and so is its upkeep. On a concession, revenue is set by the regulator and the energy flow barely touches it; the waterfall below shows a steady availability revenue net of running two converter halls.',
    wfNote:'Operating cost centres on the converter valves — periodically refurbished, as in the 2023 control-and-protection upgrade — plus the 500 kV lines on either side. Flow volumes barely move the cost.',
    s4b:'The whole scheme cost roughly <b>US$0.7&nbsp;billion</b> — strikingly cheap per MW, because there is no expensive subsea cable, just two converter blocks and ~490&nbsp;km of 500&nbsp;kV line. It was originally financed by the <b>Endesa-led CIEN consortium</b> with IDB loans; the concession has since passed to Taesa.',
    stackH:'The capital stack · ~US$0.7 bn', splitL:'Original financing', splitR:'CIEN / Endesa',
    split:[['s1',65,'Debt — IDB A/B loans'],['s2',35,'Sponsor equity']],
    finList:[['','IDB A-loan','~US$74m'],['','IDB B-loan (syndicated)','~US$174m'],['','Sponsor equity — Endesa / CIEN','~US$150m'],['sub','Original 20-yr firm-supply contract','~1,000 MW'],['','Operator today — Taesa concession','BR regulated'],['rest','2023 control &amp; protection upgrade','Hitachi MACH']],
    finNote:'A back-to-back link is the cheapest way to join two grids — no cable to lay across a strait. Garabi\'s ~US$0.7bn bought 2,200&nbsp;MW of fully-controllable transfer; the catch is that its revenue model had to be rebuilt once the original export contract collapsed.',
    timeline:[['Apr 1997','<b>Argentina–Brazil energy-trade agreement</b> signed.'],['May 1998','<b>20-year firm-supply contract</b> — ~1,000 MW of exports to Brazil.'],['2000','<b>Garabi Phase I (1,100 MW)</b> enters service.'],['2002','<b>Garabi Phase II</b> — capacity doubled to 2,200 MW.'],['2001–02','<b>Argentine crisis</b> — export limits end the firm-supply model; use turns opportunistic.'],['2023','<b>Control-system upgrade</b> — Taesa modernises the converters (Hitachi MACH).']],
    calcNote:'A working model calibrated to an <b>emerging-market concession</b>. Utilisation is low — a back-to-back link runs only part of the hours — and the return carries a higher cost of debt to reflect country and currency risk. Even so, the very low build cost per MW keeps the project return respectable.',
    s6:'Garabi shows how a single asset can move between business models over its life — merchant export, then opportunistic exchange, then regulated concession. The levers that matter now:',
    breakers:['<b>The concession terms</b> — the regulated availability revenue, and its inflation indexation, set the cash flow.','<b>Country &amp; currency risk</b> — Argentine and Brazilian macro volatility lifts the discount rate more than any technical factor.','<b>Asset cost</b> — a back-to-back station is cheap to build, which flatters the return even at low utilisation.','<b>Ageing converters</b> — 20-year-old valves need periodic, lumpy refurbishment to stay available.'],
    src:'Figures from public sources: <a href="https://www.hitachienergy.com/" target="_blank" rel="noopener">Hitachi Energy (formerly ABB)</a> case studies, the <a href="https://www.esmap.org/" target="_blank" rel="noopener">ESMAP</a> Argentina–Brazil transmission study, <a href="https://www.taesa.com.br/" target="_blank" rel="noopener">Taesa</a> and IEEE commissioning papers. Some technical figures (DC voltage, exact coordinates) are not authoritatively published and are approximated.',
    econ:{mode:'contracted',flow:'AtoB',flowFull:15,regRev:0,
      capDef:2200,capMin:550,capMax:2200,capStep:50,
      driverDef:60,driverMin:20,driverMax:140,driverStep:2,driverSigned:false,
      availDef:10,availMin:4,availMax:40},
    opex:{l1:'Converter-station O&amp;M',l2:'Valve spares &amp; refurb',f2:0.20,ins:0.0015,admin:4},
    calc:{build:0.32,grant:0,om:14,revG:4,floor:99,cap:151,tax:34,exit:9.5,lev:3.5,rd:9,amort:4,hold:20},
    map:{
      home:['Brazil','Argentina'],
      labels:[['BRAZIL',-53.8,-27.4,'land'],['ARGENTINA',-57.4,-29.2,'land'],['PARAGUAY',-57.2,-26.1,'context'],['URUGUAY',-55.6,-31.0,'context'],['Río Uruguay',-55.6,-28.9,'seafaint']],
      nodeA:{lng:-55.7,lat:-28.2,label:'Garabi',sub:'back-to-back HVDC',below:true},
      nodeB:{lng:-56.75,lat:-27.5,label:'Rincón',sub:'Argentina · 500 kV',below:false},
      route:[[-55.7,-28.2],[-56.2,-27.85],[-56.75,-27.5]],
      footer:'Back-to-back HVDC · 50 Hz ↔ 60 Hz · at the Brazil–Argentina border',
      flowText:{toA:['Argentina → Brazil','exporting power to Brazil'],toB:['Brazil → Argentina','supporting the Argentine grid'],none:['No transfer','markets aligned']}}
  },

  /* ---------- 6 · CAHORA BASSA (Africa · long-term PPA export) ---------- */
  cahora:{
    name:'Cahora Bassa HVDC', geo:'Mozambique → South Africa', continent:'Africa', cur:'US$', geoKey:'cahora',
    lede:'One of the oldest and longest HVDC lines on Earth — 1,414&nbsp;km carrying Zambezi hydropower from Mozambique into South Africa under a decades-old export contract.',
    s1:'<p class="body">One of the oldest and longest HVDC links on earth, and a different species again: a <b>1,414&nbsp;km overhead line</b> that carries hydropower from the <b>Cahora Bassa dam</b> on the Zambezi, at Songo in northern Mozambique, all the way to the <b>Apollo</b> station near Johannesburg. Commissioned in 1979, it was the first HVDC scheme built with thyristor valves from the outset.</p>'+
       '<p class="body">At up to <b>1,920&nbsp;MW</b> it is a single-purpose export machine — Mozambican water turned into firm power sold across a border into South Africa. In 2024 it delivered <b>12.3&nbsp;TWh</b>, two-thirds of it to Eskom.</p>',
    facts:[['~1,920 MW','Capacity','≈ 2m homes'],['1,414 km','HVDC line','Songo → Apollo'],['±533 kV','HVDC bipole','overhead'],['1979','Commissioned','among the oldest'],['12.3 TWh','Delivered (2024)','66% to Eskom'],['~92.5%','Mozambique-owned','via HCB']],
    s2:'This is HVDC on land, not under the sea: a ±533&nbsp;kV bipole on overhead towers, with a <b>rectifier at Songo</b> beside the dam and an <b>inverter at Apollo</b> south of Pretoria, running close to the Zimbabwe border for much of its length. The line was built to do one thing — push power south — so flow direction is fixed; the slider sets the <b>PPA tariff</b> it earns on each delivered megawatt-hour.',
    driverLab:'PPA tariff', availLab:'Utilisation', hrK:'Export value /hr', yrS:'under a long-term PPA',
    preset:'Load Cahora Bassa',
    try:'<b>Try this:</b> the line runs one way, year in year out, at a tariff fixed by a long-term contract. Push the tariff and revenue moves in a straight line — there is no spread to ride, only a price per megawatt-hour and the politics of a cross-border export deal.',
    s3:'Cahora Bassa earns through a <b>long-term power-purchase agreement</b>: HCB, the Mozambican generator, sells the bulk of the output to <b>Eskom</b> in South Africa (with smaller volumes to Mozambique\'s EDM and Zimbabwe\'s ZESA) at a contracted tariff. It is a contracted export, like CHPE in shape — but wrapped in <b>emerging-market and counterparty risk</b>: a Mozambican sovereign asset selling to a financially-stretched South African utility, with the export contract due to be reshaped around 2030.',
    mb:{tag:'Model B · export PPA',title:'Long-term cross-border PPA',body:'The generator sells firm power across a border under a <b>multi-decade contract</b>, monetising a dedicated transmission link. The cash flow is contracted but the risks are sovereign: <b>country, counterparty and currency</b>. <b>This is Cahora Bassa</b> — HCB, ~92.5% Mozambique-owned, exporting to Eskom — a cash-generative legacy asset that paid ~US$114m of dividends in 2025.'},
    s4a:'A legacy hydro-export asset has a remarkable feature: most of its capital was sunk decades ago. With the dam and line long built, running cost is low and the EBITDA margin is very high — which is why a fully-amortised scheme like this throws off so much cash. The waterfall below is modelled on a replacement-cost basis to keep the return comparable to the newer assets.',
    wfNote:'Operating cost is the upkeep of an ageing overhead line, its towers and right-of-way, plus the converter valves. The margin is high; the risk is political and counterparty, not operational cost.',
    s4b:'Built in the 1970s for several hundred million dollars of its day, the link has since been refurbished (valves replaced 2006–09, converters upgraded 2012–14). Ownership <b>reverted to Mozambique in 2007</b>, when HCB bought out the Portuguese stake. Modelled at a modern replacement cost, it still clears a healthy return — the reward for taking real country risk.',
    stackH:'The capital stack · replacement basis', splitL:'Ownership (HCB)', splitR:'shareholding',
    split:[['s1',92,'Mozambique 92.5%'],['s2',8,'REN (Portugal) 7.5%']],
    finList:[['','Original scheme (1970s)','~US$0.5bn'],['','1990s line restoration','~US$125m'],['','Valve / converter refurbishment','~US$50m+'],['sub','2007 ownership buy-out','~US$950m'],['','Offtaker — Eskom (66% of 2024)','long-term PPA'],['rest','2024 dividends declared','~US$114m']],
    finNote:'A near-fully-depreciated asset selling cheap hydro under a legacy contract is a cash machine — HCB earned a record profit in 2024. The flip side is concentration: one line, one dam, one principal buyer, and a sovereign backdrop that a financial investor must price.',
    timeline:[['1969–74','<b>Cahora Bassa dam built</b> on the Zambezi (Portuguese-era consortium).'],['1979','<b>HVDC link commissioned</b> — Songo to Apollo, ±533 kV.'],['1980s','<b>Civil-war sabotage</b> — pylons destroyed; the line is out of service for years.'],['1997–98','<b>Rebuilt &amp; recommissioned</b> — exports to Eskom resume.'],['2006–09','<b>Apollo upgrade</b> — valves replaced; capacity raised toward 2,500 MW.'],['Nov 2007','<b>Ownership reverts to Mozambique</b> — HCB buys out the Portuguese stake.']],
    calcNote:'A working model calibrated to a <b>legacy emerging-market export</b>. Revenue is the PPA tariff times the energy delivered; the build cost is a modern replacement estimate (the real asset is largely written down). The high cost of debt reflects Mozambican country and Eskom counterparty risk.',
    s6:'Cahora Bassa is the contracted-export model stretched to its riskier extreme: dependable cash, undependable context. What decides the outcome:',
    breakers:['<b>The PPA tariff &amp; term</b> — the contracted price per MWh, and the 2030 contract reset, are the whole revenue story.','<b>Counterparty</b> — Eskom\'s ability to pay is the single largest credit question.','<b>Country &amp; currency</b> — Mozambican sovereign risk and FX swamp the operational risks and set the discount rate.','<b>Concentration</b> — one dam, one line, one principal buyer: little diversification to cushion a shock.'],
    src:'Figures from public sources: <a href="https://www.hcb.co.mz/" target="_blank" rel="noopener">Hidroeléctrica de Cahora Bassa</a>, <a href="https://www.eskom.co.za/heritage/" target="_blank" rel="noopener">Eskom Heritage</a>, <a href="https://www.hitachienergy.com/" target="_blank" rel="noopener">Hitachi Energy (ABB)</a> refurbishment case studies and trade reporting on 2024 deliveries and dividends. Replacement-cost and return inputs are illustrative.',
    econ:{mode:'contracted',flow:'AtoB',flowFull:15,regRev:0,
      capDef:1920,capMin:960,capMax:2500,capStep:20,
      driverDef:32,driverMin:15,driverMax:70,driverStep:1,driverSigned:false,
      availDef:73,availMin:40,availMax:95},
    opex:{l1:'Line &amp; converter O&amp;M',l2:'ROW &amp; tower upkeep',f2:0.20,ins:0.0015,admin:8},
    calc:{build:1.4,grant:0,om:30,revG:3,floor:314,cap:491,tax:32,exit:8.6,lev:2,rd:9.5,amort:4,hold:20},
    map:{
      home:['Mozambique','South Africa'],
      labels:[['MOZAMBIQUE',35.4,-17.6,'land'],['SOUTH AFRICA',26.6,-26.7,'land'],['ZIMBABWE',29.6,-19.2,'context'],['ZAMBIA',27.0,-15.2,'context'],['BOTSWANA',25.6,-22.6,'context'],['INDIAN OCEAN',36.4,-22.5,'sea']],
      nodeA:{lng:32.77,lat:-15.61,label:'Songo',sub:'Cahora Bassa · rectifier',below:false},
      nodeB:{lng:28.28,lat:-25.92,label:'Apollo',sub:'Pretoria · inverter',below:true},
      route:[[32.77,-15.61],[32.5,-18.6],[31.2,-21.3],[29.4,-24.1],[28.28,-25.92]],
      footer:'HVDC · ±533 kV · 1,414 km overhead, Songo to Apollo',
      flowText:{toA:['Mozambique → South Africa','exporting Zambezi hydro'],toB:['Mozambique → South Africa','exporting Zambezi hydro'],none:['Mozambique → South Africa','exporting Zambezi hydro']}}
  }
  };
  var ORDER=['celtic','chpe','marinus','gccia','garabi','cahora'];

  /* ===================================================================
     MAP RENDERER  (canvas)
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), MPAD=18, T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  var PROJ=null; // {LNG0,LAT0,LNG1,LAT1,COSL,MS,OX,OY}
  function setProj(bb){
    var LNG0=bb[0],LAT0=bb[1],LNG1=bb[2],LAT1=bb[3], cLat=(LAT0+LAT1)/2, COSL=Math.cos(cLat*Math.PI/180);
    var GW=(LNG1-LNG0)*COSL, GH=(LAT1-LAT0), MS=Math.min((W-2*MPAD)/GW,(H-2*MPAD)/GH);
    PROJ={LNG0:LNG0,LAT0:LAT0,LNG1:LNG1,LAT1:LAT1,COSL:COSL,MS:MS,OX:(W-GW*MS)/2,OY:(H-GH*MS)/2};
  }
  function PX(l){ return PROJ.OX+(l-PROJ.LNG0)*PROJ.COSL*PROJ.MS; }
  function PY(l){ return PROJ.OY+(PROJ.LAT1-l)*PROJ.MS; }
  function poly(a){ ctx.beginPath(); for(var i=0;i<a.length;i++){ var x=PX(a[i][0]),y=PY(a[i][1]); i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); }
  function projRoute(r){ return r.map(function(p){ return {x:PX(p[0]),y:PY(p[1])}; }); }
  function routeLen(pr){ var L=[0],t=0; for(var i=1;i<pr.length;i++){ t+=Math.hypot(pr[i].x-pr[i-1].x,pr[i].y-pr[i-1].y); L.push(t);} return {L:L,total:t}; }
  function ptAt(pr,meta,frac){ var d=frac*meta.total, i=1; while(i<meta.L.length-1 && meta.L[i]<d) i++;
    var a=pr[i-1],b=pr[i], seg=meta.L[i]-meta.L[i-1]||1, u=(d-meta.L[i-1])/seg;
    return {x:a.x+(b.x-a.x)*u, y:a.y+(b.y-a.y)*u}; }
  function drawRouteLine(pr){ ctx.beginPath(); ctx.moveTo(pr[0].x,pr[0].y); for(var i=1;i<pr.length;i++) ctx.lineTo(pr[i].x,pr[i].y); }
  function station(x,y,label,sub,below){
    ctx.save(); ctx.fillStyle='#fff'; ctx.strokeStyle='#15201d'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(x,y,6.5,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#0c6b4f'; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); ctx.restore();
    var ly=below?y+16:y-15, sy=below?y+27:y-5;
    ctx.fillStyle='#15201d'; ctx.font='700 10.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(label,x,ly);
    ctx.fillStyle='#6a7570'; ctx.font='8.5px Inter,sans-serif'; ctx.fillText(sub,x,sy);
  }
  function priceBadge(x,y,dearer){
    var txt=dearer?'DEARER':'CHEAPER', col=dearer?'#bc4733':'#0c6b4f';
    ctx.font='700 8.5px Inter,sans-serif'; ctx.textAlign='center'; var w=ctx.measureText(txt).width+16;
    ctx.fillStyle='#fff'; ctx.strokeStyle=col; ctx.lineWidth=1.2;
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(x-w/2,y-9,w,17,8.5); else ctx.rect(x-w/2,y-9,w,17); ctx.fill(); ctx.stroke();
    ctx.fillStyle=col; ctx.fillText(txt,x,y+2.5);
  }
  var LSTY={ land:['rgba(12,107,79,0.6)','700 13px Inter,sans-serif'],
            context:['rgba(120,135,128,0.65)','700 11px Inter,sans-serif'],
            sea:['rgba(70,110,150,0.5)','italic 600 13px "Source Serif 4",Georgia,serif'],
            seafaint:['rgba(70,110,150,0.32)','italic 600 11px "Source Serif 4",Georgia,serif'] };

  /* ===================================================================
     FRAME  (per animation tick)
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var M=A.map, E=A.econ;
    var cap=parseFloat(sCap.value), drv=parseFloat(sSpread.value), av=parseFloat(sAvail.value)/100;

    // ---- flow physics ----
    var dirTok, flowMW, absS=Math.abs(drv);
    if(E.flow==='spread'){
      flowMW = (drv===0)?0:Math.round(cap*Math.min(1,absS/E.flowFull));
      dirTok = (flowMW===0)?'none':(drv>0?'toA':'toB');
    } else { // fixed direction (AtoB / BtoA)
      flowMW = Math.round(cap*av);
      dirTok = (E.flow==='BtoA')?'toA':'toB';
    }

    // ---- draw ----
    ctx.clearRect(0,0,W,H);
    var sea=ctx.createLinearGradient(0,0,0,H); sea.addColorStop(0,'#e3eef4'); sea.addColorStop(1,'#cadeea');
    ctx.fillStyle=sea; ctx.fillRect(0,0,W,H);
    // graticule
    var span=PROJ.LNG1-PROJ.LNG0, gstep=span<6?1:(span<14?2:5);
    ctx.strokeStyle='rgba(90,140,180,0.10)'; ctx.lineWidth=1;
    for(var lg=Math.ceil(PROJ.LNG0/gstep)*gstep; lg<=PROJ.LNG1; lg+=gstep){ var gx=PX(lg); ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
    for(var la=Math.ceil(PROJ.LAT0/gstep)*gstep; la<=PROJ.LAT1; la+=gstep){ var gy=PY(la); ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }
    // land
    GEO[A.geoKey].polys.forEach(function(p){
      var homeP = M.home.indexOf(p[0])>=0;
      poly(p[1]); ctx.fillStyle = homeP?'#d8e8dc':'#e6e9e5';
      ctx.fill(); ctx.strokeStyle = homeP?'rgba(12,107,79,0.38)':'rgba(90,110,100,0.34)'; ctx.lineWidth=homeP?1.1:1; ctx.stroke();
    });
    // lake / inland water
    if(GEO[A.geoKey].lake){ poly(GEO[A.geoKey].lake); ctx.fillStyle='#d3e6f0'; ctx.fill(); ctx.strokeStyle='rgba(70,110,150,0.3)'; ctx.lineWidth=1; ctx.stroke(); }
    // labels
    M.labels.forEach(function(l){ var st=LSTY[l[3]]||LSTY.land; ctx.fillStyle=st[0]; ctx.font=st[1]; ctx.textAlign='center'; ctx.fillText(l[0],PX(l[1]),PY(l[2])); });

    // route
    var pr=projRoute(M.route), meta=routeLen(pr);
    ctx.lineCap='round';
    ctx.strokeStyle='rgba(20,32,29,0.16)'; ctx.lineWidth=7; drawRouteLine(pr); ctx.stroke();
    ctx.strokeStyle='#243a32'; ctx.lineWidth=2.5; drawRouteLine(pr); ctx.stroke();
    ctx.lineCap='butt';

    var na={x:PX(M.nodeA.lng),y:PY(M.nodeA.lat)}, nb={x:PX(M.nodeB.lng),y:PY(M.nodeB.lat)};
    if(flowMW>0){
      var toA=(dirTok==='toA');
      var n=Math.max(4,Math.round(flowMW/1400*30));
      for(var k=0;k<n;k++){ var base=(T*0.010+k/n)%1, t=toA?(1-base):base, p=ptAt(pr,meta,t), gl=0.5+0.5*Math.sin(T*0.1+k);
        ctx.save(); ctx.globalAlpha=0.9;
        var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,7); g.addColorStop(0,'rgba(12,107,79,0.85)'); g.addColorStop(1,'rgba(12,107,79,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,7,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#0c6b4f'; ctx.beginPath(); ctx.arc(p.x,p.y,2+gl*0.7,0,Math.PI*2); ctx.fill(); ctx.restore(); }
      var mid=ptAt(pr,meta,0.5), ah=ptAt(pr,meta,toA?0.42:0.58), ang=Math.atan2(mid.y-ah.y,mid.x-ah.x);
      ctx.save(); ctx.translate(mid.x,mid.y); ctx.rotate(ang);
      ctx.fillStyle='#0c6b4f'; ctx.beginPath(); ctx.moveTo(11,0); ctx.lineTo(-6,-6); ctx.lineTo(-6,6); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.fillStyle='#15201d'; ctx.font='700 12px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(flowMW+' MW',mid.x+16,mid.y-10);
    } else {
      var m0=ptAt(pr,meta,0.5); ctx.fillStyle='#8a948f'; ctx.font='700 11px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('no flow — prices level',m0.x+10,m0.y-10);
    }

    station(na.x,na.y,M.nodeA.label,M.nodeA.sub,M.nodeA.below);
    station(nb.x,nb.y,M.nodeB.label,M.nodeB.sub,M.nodeB.below);
    if(flowMW>0){ // dearer = sink (where flow arrives)
      var sinkA=(dirTok==='toA');
      priceBadge(na.x + (na.x<nb.x?-46:46), na.y-2, sinkA);
      priceBadge(nb.x + (nb.x<na.x?-46:46), nb.y+2, !sinkA);
    }

    // north arrow + caption
    ctx.save(); ctx.translate(W-28,32); ctx.strokeStyle='#6a7570'; ctx.fillStyle='#6a7570'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,-9); ctx.lineTo(0,8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(-3.5,-5); ctx.lineTo(3.5,-5); ctx.closePath(); ctx.fill();
    ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('N',0,18); ctx.restore();
    ctx.fillStyle='rgba(40,60,80,0.55)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(M.footer)+' · '+cap+' MW',W/2,H-10);

    // ---- economics ----
    var grossRev;
    if(E.mode==='merchant') grossRev=absS*cap*HRS*av;
    else if(E.mode==='contracted') grossRev=drv*cap*HRS*av;
    else grossRev=E.regRev*1e6;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e9)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));
    var buildPerMW=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=cap*buildPerMW; netCapexG=Math.max(0,capexGrossG-grant);
    var omRate=(parseFloat(iOM.value)||0)*1e3;
    var c_om=omRate*cap, c2=A.opex.f2*c_om, c_ins=A.opex.ins*capexGrossG, c_admin=A.opex.admin*1e6;
    var opex=c_om+c2+c_ins+c_admin, ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;

    set('ixCapV',cap+' MW'); set('ixSpreadV',fmtDriver(drv)); set('ixAvailV',Math.round(av*100)+'%');
    var ft=M.flowText[dirTok]||M.flowText.none;
    set('ixDir',ft[0]); set('ixDirS',ft[1]);
    set('ixMW',flowMW+' MW'); set('ixMWs', flowMW>=cap?'at full capacity':(flowMW===0?'idle':'part-loaded'));
    var hourly=(E.mode==='contracted'?drv:absS)*flowMW;
    set('ixHr', flowMW===0?CUR+'0 / hr':CUR+Math.round(hourly).toLocaleString()+' / hr');
    set('ixYr', revenue<=0?CUR+'0':'≈ '+money(revenue));

    drawWaterfall(revenue, [[A.opex.l1,c_om],[A.opex.l2,c2],['Insurance',c_ins],['Admin &amp; overhead',c_admin]], ebitda);
    set('wfMargin', revenue>0?Math.round(ebitda/revenue*100)+'%':'—');
  }
  function stripTags(s){ return s.replace(/&amp;/g,'&'); }
  function fmtDriver(v){ var sign=A.econ.driverSigned?(v>0?'+':(v<0?'−':'')):''; return sign+CUR+Math.abs(v); }

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
    s+=lbl(bx(0)+bw/2, y(rev), 'Revenue', money(rev), '#15201d');
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
    var gR=gv('iRevG')/100, capexP=0.04, daP=0.04, tax=gv('iTax')/100;
    var xMul=gv('iExit'), N=Math.max(3,Math.min(40,Math.round(gv('iHold'))));
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
    var exitEVf=xMul*rows[N-1].eb, exitEq=exitEVf-rows[N-1].debt;
    var distrib=eCF.slice(1).reduce(function(a,b){return a+b;},0);
    var moic=equity0>0?distrib/equity0:NaN;
    return {eb0:eb0,invest:invest,debt0:debt0,equity0:equity0,N:N,rows:rows,uCF:uCF,eCF:eCF,uIRR:irr(uCF),lIRR:irr(eCF),exitEV:exitEVf,exitEq:exitEq,moic:moic,payback:payback};
  }
  function renderModel(){
    var m=computeModel();
    if(!m){ ['oUIRR','oLIRR','oMOIC','oPB'].forEach(function(id){ set(id,'—'); });
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the EBITDA is too thin to value — widen the driver, or rely on the asset\'s regulated or contracted revenue floor.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build cost</span> <b>'+money(capexGrossG)+'</b></span>'+
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
      iBuild=document.getElementById('iBuild'), iGrant=document.getElementById('iGrant'), iOM=document.getElementById('iOM'),
      iFloor=document.getElementById('iFloor'), iCap=document.getElementById('iCap');

  function render(key){
    A=ASSETS[key]; CUR=A.cur;
    if(ctx) setProj(GEO[A.geoKey].bb);
    // header
    set('ixAssetName',A.name); set('ixAssetGeo',A.geo); set('ixCont',A.continent);
    html('ixLede',A.lede);
    // s1
    html('s1body',A.s1);
    html('ixFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    // s2
    html('s2intro',A.s2);
    set('ixDriverLab',A.driverLab); set('ixAvailLab',A.availLab); set('ixHrK',A.hrK); set('ixYrS',A.yrS);
    set('ixPreset',A.preset); html('ixTry',A.try);
    var E=A.econ;
    sCap.min=E.capMin; sCap.max=E.capMax; sCap.step=E.capStep; sCap.value=E.capDef;
    sSpread.min=E.driverMin; sSpread.max=E.driverMax; sSpread.step=E.driverStep; sSpread.value=E.driverDef;
    sAvail.min=E.availMin; sAvail.max=E.availMax; sAvail.value=E.availDef;
    // s3
    html('s3intro',A.s3);
    set('mbTag',A.mb.tag); set('mbTitle',A.mb.title); html('mbBody',A.mb.body);
    // s4
    html('s4intro1',A.s4a); html('wfNote',A.wfNote); html('s4intro2',A.s4b);
    set('finStackH',A.stackH); html('finSplitL',A.splitL); html('finSplitR',A.splitR);
    html('finSplit',A.split.map(function(s){ return '<div class="seg '+s[0]+'" style="width:'+s[1]+'%">'+s[2]+'</div>'; }).join(''));
    html('finList',A.finList.map(function(r){ return '<li'+(r[0]?' class="'+r[0]+'"':'')+'><span class="fl">'+r[1]+'</span><span class="fa">'+r[2]+'</span></li>'; }).join(''));
    html('finNote',A.finNote);
    html('finTimeline',A.timeline.map(function(t){ return '<li><span class="yr">'+t[0]+'</span><span class="ev">'+t[1]+'</span></li>'; }).join(''));
    // s5
    html('calcNote',A.calcNote);
    var c=A.calc;
    iBuild.value=c.build; iGrant.value=c.grant; iOM.value=c.om;
    document.getElementById('iRevG').value=c.revG; iFloor.value=c.floor; iCap.value=c.cap;
    document.getElementById('iTax').value=c.tax; document.getElementById('iExit').value=c.exit;
    document.getElementById('iLev').value=c.lev; document.getElementById('iRd').value=c.rd;
    document.getElementById('iAmort').value=c.amort; document.getElementById('iHold').value=c.hold;
    set('uBuild',CUR+'m/MW'); set('uGrant',CUR+'m'); set('uFloor',CUR+'m'); set('uCap',CUR+'m');
    // s6
    html('s6intro',A.s6);
    html('breakers',A.breakers.map(function(b){ return '<li>'+b+'</li>'; }).join(''));
    // sources
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue uses a stylised average assumption and the returns model is a simplified DCF; not a forecast of any specific hour\'s trading, and not investment advice.');
    // recompute
    frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iOM,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.capDef; sSpread.value=E.driverDef; sAvail.value=E.availDef; frame(); renderModel(); });
    (function loop(){ T+=1; frame(); requestAnimationFrame(loop); })();
  }
  ['iRevG','iTax','iExit','iHold','iLev','iRd','iAmort'].forEach(function(id){
    var e=document.getElementById(id); if(e) e.addEventListener('input',renderModel); });

  var sel=document.getElementById('ixSelect');
  if(sel) sel.addEventListener('change',function(){
    render(sel.value);
    var st=document.querySelector('.ix-stage');
    if(st && st.scrollIntoView) st.scrollIntoView({behavior:'smooth',block:'center'});
  });
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'celtic');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
