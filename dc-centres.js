/* Data centres — data-driven worked examples. Six real assets, one template.
   The harbour-style scene is replaced by a live facility plan that shows where
   the value flows: $ in from the tenants/data, $ out for power and cooling.
   Figures are illustrative: revenue uses a stylised blended rent and the returns
   model is a simplified DCF, not a forecast. */
(function(){
  var HRS=8760;
  var CUR='US$';
  var A=null;
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;
  var coins=[], flows=[], _anim=false;
  function rnd(a,b){ return a+Math.random()*(b-a); }

  function money(v){ var n=v<0; v=Math.abs(v); var o;
    if(v>=1e9)o=(v/1e9).toFixed(2)+'bn'; else if(v>=1e6)o=(v/1e6).toFixed(0)+'m';
    else if(v>=1e3)o=Math.round(v/1e3)+'k'; else o=''+Math.round(v);
    return (n?'−':'')+CUR+o; }
  function m1(v){ return (v/1e6).toFixed(1); }
  function set(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; }
  function html(id,t){ var e=document.getElementById(id); if(e) e.innerHTML=t; }
  function fmtMW(v){ return v>=1000?(v/1000).toFixed(2)+' GW':Math.round(v)+' MW'; }
  function fmtRent(v){ return CUR+Math.round(v)+'/kW'; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · EQUINIX (Europe · retail colocation + interconnection) ---------- */
  equinix:{
    name:'Equinix', geo:'interconnection · Europe', continent:'Europe', cur:'US$', geoKey:'equinix',
    lede:'The world\'s biggest <b>interconnection</b> platform — many tenants per site, knitted together by cross-connects. Its moat is not megawatts but the <b>network effect</b>.',
    s1:'<p class="body">Most data centres sell space and power. <b>Equinix</b> sells <b>connection</b>. Its 260+ IBX data centres across 70+ metros are <b>retail colocation</b> — hundreds of tenants per building, from banks to cloud platforms — and the value is the dense web of <b>cross-connects</b> between them. Once a company\'s network, its cloud on-ramps and its partners all live in the same building, moving out is almost unthinkable.</p>'+
       '<p class="body">That stickiness shows in the numbers: <b>$8.75&nbsp;billion</b> of revenue in 2024 at a <b>~47% adjusted EBITDA margin</b>, growing every quarter for two decades. It is a NASDAQ-listed REIT, and the European metros — Frankfurt, Amsterdam, London — are some of the densest interconnection hubs on earth.</p>',
    facts:[['260+','IBX data centres','70+ metros'],['$8.75 bn','Revenue (2024)','+7% YoY'],['$4.1 bn','Adj. EBITDA','~47% margin'],['~475k','Cabinets','retail + xScale'],['REIT','NASDAQ: EQIX','since 2015'],['3,000+','Networks &amp; clouds','interconnected']],
    s2:'Inside, the facility is the same machine as any data centre — power feeding in from the grid through a substation, backup generators, a cooling plant, and halls full of racks. But the heart is the <b>meet-me room</b>, where a tenant pays a small monthly fee for each <b>cross-connect</b> to another tenant. Watch the value flow below: <span style="color:#0c6b4f">$</span> in from the data and the cross-connects, <span style="color:#bc4733">$</span> out for power and cooling.',
    driverLab:'Rent / kW·mo', availLab:'Occupancy', hrK:'Value earned /hr', yrS:'colocation + interconnection',
    preset:'Load Equinix',
    try:'<b>Try this:</b> a retail interconnection hub earns far more per megawatt than a wholesale shed, because it is selling cross-connects and proximity, not just space. Drag the rent — Equinix\'s effective revenue per cabinet is a multiple of a hyperscale lease, and that premium is the whole investment case.',
    s3:'Equinix earns three ways: <b>colocation</b> (renting cabinets and cages), <b>power</b> (billed by the kW), and — the prize — <b>interconnection</b> (a recurring fee for every cross-connect, of which there are hundreds of thousands). Interconnection is a small share of revenue but a large share of the <b>moat</b>: it is high-margin, sticky, and grows as the ecosystem grows. The investor question is whether that network effect can hold as hyperscalers build their own capacity.',
    mb:{tag:'Model B · interconnection', title:'Retail colocation + cross-connects', body:'Many tenants share a building and pay to interconnect with each other; the dense ecosystem makes the asset sticky and lets it charge a premium per megawatt. Capital-intensive but recurring and high-margin, with a genuine <b>network-effect moat</b>. <b>This is Equinix</b> — a NASDAQ REIT, the densest interconnection platform in the world.'},
    s4a:'A data centre\'s cost base is dominated by one thing: <b>power</b>. Even before the IT load, the cooling needed to keep the halls at temperature can add 20–50% on top — the <b>PUE</b> overhead. After power and cooling come the on-site staff and a heavy maintenance and SG&amp;A load. The waterfall below is live from the facility.',
    wfNote:'Power and cooling are the dominant operating costs of any data centre — which is exactly why the value-flow diagram flags the $ leaving the business for electricity. A retail platform carries more staff and overhead than a wholesale shed, which is why its margin, though healthy, sits below a hyperscale lease.',
    s4b:'Building interconnection-grade capacity is expensive — far more per megawatt than a wholesale shed, because of the redundancy, the fit-out and the meet-me-room density. Equinix carries that on a REIT balance sheet and funds a multi-year, multi-billion expansion programme, including hyperscale xScale joint ventures, from retained cash flow and debt.',
    stackH:'The capital base · REIT', splitL:'Structure', splitR:'listed',
    split:[['s1',100,'NASDAQ: EQIX — REIT since 2015']],
    finList:[['','2024 revenue','$8.75bn'],['sub','Adjusted EBITDA (~47%)','$4.1bn'],['','IBX data centres','260+'],['sub','Metros / countries','70+ / 30+'],['','Interconnection','recurring, high-margin'],['rest','Structure','REIT, investment-grade']],
    finNote:'Equinix is priced like the infrastructure it is — a high multiple for a recurring, sticky, inflation-linked cash flow with a network-effect moat. The risk is that the hyperscalers it interconnects increasingly self-build, and that the cheapest growth (wholesale) earns a lower return per megawatt than its prized retail core.',
    timeline:[['1998','<b>Founded</b> — a neutral place for networks to meet.'],['2000','<b>NASDAQ IPO.</b>'],['2007','<b>$2bn IXEurope acquisition</b> — the European hubs.'],['2010','<b>Revenue passes $1bn.</b>'],['2015','<b>Converts to a REIT.</b>'],['2024','<b>$8.75bn revenue</b>, ~47% EBITDA margin.']],
    calcNote:'A working model of the investment case, calibrated to a <b>retail interconnection</b> platform. Revenue is rent &times; leased capacity plus interconnection (captured as ancillary income); the high per-megawatt yield is the point. Power and cooling are the biggest costs, so the <b style="color:#0c6b4f">unlevered IRR</b> turns on rent, occupancy and the cost of electricity.',
    s6:'Equinix shows a data centre as a <b>network business</b> wearing real estate. What drives the return:',
    breakers:['<b>The interconnection moat</b> — cross-connect density is the stickiness; if it erodes, so does the premium.','<b>Power</b> — electricity is the dominant cost and, increasingly, the binding constraint on growth in core metros.','<b>Hyperscaler behaviour</b> — the same clouds it interconnects are building their own capacity.','<b>Rent &amp; occupancy</b> — the per-megawatt yield, far above wholesale, is what justifies the multiple.'],
    src:'Figures from public sources: <a href="https://investor.equinix.com/" target="_blank" rel="noopener">Equinix investor relations and FY2024 results</a>, and company disclosure on IBX count and interconnection. Per-cabinet and per-metro megawatt figures are industry estimates; Equinix reports cabinets and revenue, not metro-level MW.',
    econ:{cur:'US$',pue:1.4,anc:1200,fixed:0,
      capDef:1800,capMin:400,capMax:2600,capStep:50,
      rentDef:430,rentMin:200,rentMax:700,rentStep:10,
      occDef:80,occMin:50,occMax:95},
    opex:{powerPrice:95,facRate:0.10,staff:1000,sgaRate:0.10},
    calc:{build:62000,grant:0,capex:6,revG:5,floor:4000,cap:11000,tax:12,exit:15,lev:5,rd:5,amort:1,hold:15},
    map:{ footer:'Retail colocation + interconnection · the meet-me room is the moat' }
  },

  /* ---------- 2 · NORTHERN VIRGINIA (North America · hyperscale wholesale) ---------- */
  nova:{
    name:'Northern Virginia', geo:'Ashburn · USA', continent:'North America', cur:'US$', geoKey:'nova',
    lede:'"Data Center Alley" — the world\'s largest data-centre market, where <b>wholesale</b> halls are leased to the cloud giants by the megawatt, and the only thing in short supply is <b>power</b>.',
    s1:'<p class="body">More internet traffic passes through <b>Ashburn, Virginia</b> than almost anywhere on earth. The cluster grew from AOL\'s 1990s roots into the world\'s biggest data-centre market — roughly <b>3,000&nbsp;MW</b> in 2024, heading past 4,000&nbsp;MW in 2025. This is the <b>hyperscale wholesale</b> model: an operator like <b>Digital Realty</b> builds the shell, the power and the cooling, then leases huge multi-megawatt halls to AWS, Microsoft and Google on long contracts.</p>'+
       '<p class="body">The economics are bond-like — long leases to investment-grade tenants — which is why the whole AI build-out runs on this template. But there is a catch that defines the market today: <b>vacancy is near zero</b> (~0.5%), rents are spiking, and the binding constraint is no longer land or capital but <b>getting power connected to the grid</b>.</p>',
    facts:[['~3,000 MW','Market (2024)','→ ~4,000 in 2025'],['~0.5%','Vacancy','near zero'],['$185/kW','Wholesale rent','+13% YoY'],['632 MW','DLR Ashburn','+3,000 MW land'],['~38%','AWS+MSFT+GOOG','of active load'],['Power','The constraint','grid moratorium']],
    s2:'A wholesale facility is built for raw megawatts: a substation off the <b>Dominion</b> grid, banks of backup generators, a large central cooling plant (increasingly liquid for AI density), and a handful of vast halls leased whole to one tenant. The operator usually <b>passes power straight through</b> to the tenant. Watch the value flow: <span style="color:#0c6b4f">$</span> in from the lease, <span style="color:#bc4733">$</span> out for power and cooling — much of it reimbursed.',
    driverLab:'Rent / kW·mo', availLab:'Occupancy', hrK:'Value earned /hr', yrS:'long hyperscale leases',
    preset:'Load Northern Virginia',
    try:'<b>Try this:</b> push occupancy toward 100% — in Ashburn it already is. With vacancy near zero and AI demand surging, <b>rents are the story</b>: drag the rent from $130 toward $215 (the 2025 record) and watch the return move. This is a developer\'s market, and the scarce input is power.',
    s3:'Wholesale revenue is simple and durable: <b>contracted megawatts &times; rent</b>, on 10–15&nbsp;year leases, with <b>power passed through</b> to the tenant (so the operator is largely hedged on electricity). The margin is high and the cash flow is bond-like. The leverage in the model is <b>development</b>: secure land and — crucially — a power connection, build at ~$10m/MW, lease at a yield well above the build cost, and the value creation is enormous. The risk is concentration in a few giant tenants, and the grid.',
    mb:{tag:'Model A · wholesale lease', title:'Powered shell, leased by the MW', body:'Build the shell, the power and the cooling; lease whole halls to a handful of hyperscalers on long, investment-grade contracts, with power passed through. Bond-like, highly financeable, and the backbone of the AI build-out — but exposed to <b>tenant concentration and power availability</b>. <b>This is Northern Virginia</b> — the world\'s biggest market, vacancy near zero.'},
    s4a:'In wholesale the operator\'s own cost base is lean, because the biggest cost — <b>power</b> — is largely reimbursed by the tenant. What remains is cooling and facilities upkeep, a small operations team, and overhead. So the margin on net rent is high; the real work is in the <b>development</b>, not the running.',
    wfNote:'Power dominates a data centre\'s electricity bill, but in wholesale it is mostly passed through to the tenant — so the operator\'s retained cost base is thinner and the margin higher than retail colocation. The value-flow diagram still shows the $ moving for power, because the electrons (and the cost) really do flow.',
    s4b:'A hyperscale hall costs roughly <b>$10–15&nbsp;million per megawatt</b> to build, and far more for AI-ready liquid cooling. With rents spiking and vacancy near zero, a developer that can secure <b>land and power</b> earns a yield on cost well above its cost of capital — which is why every infrastructure fund on earth is chasing the sector. The scarce ingredient is the <b>grid connection</b>: Dominion\'s 2024 connection limits made power, not money, the constraint.',
    stackH:'The capital stack · development', splitL:'How it is funded', splitR:'developer',
    split:[['s1',55,'Debt &amp; JV capital'],['s2',45,'Sponsor equity']],
    finList:[['','Build cost','~$10–15m/MW'],['','DLR Ashburn IT load','632 MW'],['sub','+ development land','~3,000 MW'],['','DLR–Blackstone JV (2023)','$7bn'],['','Wholesale rent (2024)','$185/kW/mo'],['rest','2025 Ashburn record','~$215/kW/mo']],
    finNote:'A wholesale developer in a supply-constrained market is one of the best risk-adjusted trades in infrastructure right now: long leases to AAA-ish tenants, rents rising, and a yield on cost far above the cost of capital. The two risks that matter are <b>tenant concentration</b> and whether you can get the <b>power</b> at all.',
    timeline:[['1990s','<b>AOL roots</b> seed the Loudoun County cluster.'],['2000s','<b>Fibre convergence</b> makes Ashburn "Data Center Alley".'],['2010s','<b>Hyperscaler build-out</b> — AWS, Microsoft, Google.'],['2023','<b>Digital Realty–Blackstone $7bn JV.</b>'],['2024','<b>Dominion connection limits</b> — power becomes the constraint.'],['2025','<b>~4,000 MW</b>; record rents.']],
    calcNote:'A working model calibrated to a <b>wholesale developer</b>. Because power is largely passed through, the modelled cost base is thin and the margin high; the return is driven by the yield on build cost in a market where rents are rising and vacancy is near zero. This is what the AI build-out looks like in a spreadsheet.',
    s6:'Northern Virginia is the engine room of the cloud — and now of AI. What drives the return:',
    breakers:['<b>Power availability</b> — the grid connection, not land or capital, is the binding constraint on new capacity.','<b>Rents &amp; vacancy</b> — near-zero vacancy and AI demand are pushing rents to records; that is most of the upside.','<b>Tenant concentration</b> — a handful of hyperscalers are the whole demand side; their credit and behaviour are the risk.','<b>Development yield</b> — building at ~$10m/MW and leasing well above cost is where the value is created.'],
    src:'Figures from public sources: <a href="https://www.cbre.com/insights/reports" target="_blank" rel="noopener">CBRE North America Data Center Trends</a>, <a href="https://www.digitalrealty.com/" target="_blank" rel="noopener">Digital Realty</a> disclosure, and reporting on the Dominion Energy connection constraints. Some figures are market-level estimates.',
    econ:{cur:'US$',pue:1.2,anc:0,fixed:0,
      capDef:632,capMin:200,capMax:1500,capStep:20,
      rentDef:185,rentMin:100,rentMax:400,rentStep:5,
      occDef:95,occMin:60,occMax:100},
    opex:{powerPrice:35,facRate:0.08,staff:60,sgaRate:0.06},
    calc:{build:12000,grant:0,capex:5,revG:6,floor:600,cap:3000,tax:21,exit:15,lev:5,rd:5.5,amort:1,hold:12},
    map:{ footer:'Hyperscale wholesale · powered shells leased by the megawatt · the grid is the limit' }
  },

  /* ---------- 3 · ASCENTY (South America · emerging-market wholesale) ---------- */
  ascenty:{
    name:'Ascenty', geo:'São Paulo · Brazil', continent:'South America', cur:'US$', geoKey:'ascenty',
    lede:'Latin America\'s largest data-centre platform — a Brazilian wholesale operator on a famously <b>clean grid</b>, owned by Digital Realty and Brookfield.',
    s1:'<p class="body"><b>Ascenty</b> is the biggest data-centre operator in Latin America: ~34 facilities across Brazil, Chile, Mexico and Colombia, linked by its own <b>4,500&nbsp;km fibre network</b>. Its flagship at Vinhedo, near São Paulo, is the largest single data centre on the continent. The model is <b>wholesale colocation</b> — large halls leased to the global cloud and AI providers expanding into the region.</p>'+
       '<p class="body">It is owned 50/50-style by <b>Digital Realty and Brookfield Infrastructure</b>, who bought it for ~$1.8&nbsp;billion in 2018. Brazil\'s draw is a grid that is <b>~75% clean</b> (mostly hydro) — increasingly decisive for sustainability-led siting — plus capacity scaling from ~330 toward ~500&nbsp;MW, and a fresh <b>$1.2&nbsp;billion</b> AI-capacity programme.</p>',
    facts:[['~34','Data centres','LatAm\'s largest'],['~400 MW','Capacity','scaling to ~500'],['4,500 km','Own fibre','links the campuses'],['~75% clean','Brazil grid','mostly hydro'],['2018','DLR + Brookfield','~$1.8bn'],['$1.2 bn','AI programme','~150 MW (2026)']],
    s2:'The facility is a standard wholesale build — a grid substation, generators, a cooling plant and large leased halls — with one regional advantage: the power is unusually <b>clean</b>, and Ascenty\'s own fibre interconnects the campuses across the country. Watch the value flow: <span style="color:#0c6b4f">$</span> in from the leases, <span style="color:#bc4733">$</span> out for power and cooling — all earned and spent in a higher-risk, higher-return emerging market.',
    driverLab:'Rent / kW·mo', availLab:'Occupancy', hrK:'Value earned /hr', yrS:'wholesale colocation leases',
    preset:'Load Ascenty',
    try:'<b>Try this:</b> Brazil is a <b>value market</b> — rents sit below Sydney or Singapore — but build costs are also lower and demand is growing fast. Drag the rent and occupancy; the nominal return looks strong, but remember it is earned in reais against Brazilian rates, so the discount rate is high too.',
    s3:'Ascenty earns contracted wholesale rent on its leased megawatts, much like Northern Virginia, but in an <b>emerging market</b>: rents are lower, growth is faster, and the cash flow carries <b>currency and country risk</b>. Its edges are scale (the largest platform), its own fibre, deep-pocketed sponsors, and a clean grid that the hyperscalers increasingly demand. The risk is Brazilian macro — the real, interest rates and regulation — more than anything operational.',
    mb:{tag:'Model B · EM wholesale', title:'Emerging-market wholesale platform', body:'Wholesale colocation in a fast-growing, higher-risk market — lower rents and build costs, faster demand growth, but real <b>FX and country risk</b>. Backed here by global sponsors and a clean grid. <b>This is Ascenty</b> — Digital Realty + Brookfield, the largest platform in Latin America.'},
    s4a:'Ascenty\'s cost structure is a standard wholesale one — power, cooling and facilities, a lean team and overhead — but its power is cleaner and, in local terms, competitively priced. The margin is healthy; the swing factor for the investment case is not the cost line but the <b>currency</b> the cash flow is earned in.',
    wfNote:'Power and cooling dominate the cost base, as everywhere — the value-flow diagram flags the $ leaving for electricity. Brazil\'s clean, hydro-heavy grid lowers both the carbon and, often, the cost; the bigger variable for returns is the real, not the running cost.',
    s4b:'Latin American build costs run <b>~$7–10&nbsp;million per megawatt</b>, below the US and APAC. Ascenty funds expansion from its sponsors\' balance sheets and reinvested cash flow, including a <b>$1.2&nbsp;billion</b> programme announced in 2026 for ~150&nbsp;MW of new, AI-ready capacity. Modelled on an enterprise-value basis, it is a high-nominal emerging-market return.',
    stackH:'The capital stack · EM platform', splitL:'Ownership', splitR:'sponsors',
    split:[['s1',51,'Digital Realty 51%'],['s2',49,'Brookfield Infrastructure 49%']],
    finList:[['','2018 acquisition','~$1.8bn'],['sub','Brookfield for ~49%','~$613m'],['','Capacity','~400 MW → 500'],['','Own fibre network','4,500 km'],['','2026 AI programme','$1.2bn / ~150 MW'],['rest','Financials','private — illustrative']],
    finNote:'A privatised EM platform with global sponsors is a <b>high-nominal, higher-risk</b> wholesale play: strong demand, low build costs and a clean grid, set against Brazilian currency and rates. The sponsors\' balance sheets and the own-fibre moat are what make a sub-investment-grade country financeable.',
    timeline:[['2010','<b>Ascenty founded</b> in Brazil.'],['2018','<b>Digital Realty + Brookfield acquire</b> it for ~$1.8bn.'],['2020–23','<b>Expansion</b> into Chile and Mexico.'],['2025','<b>15 years</b>; new São Paulo capacity.'],['2026','<b>$1.2bn AI programme</b> — ~150 MW.'],['—','<b>Largest platform</b> in Latin America.']],
    calcNote:'A working model calibrated to an <b>emerging-market wholesale</b> platform, on an enterprise-value basis. Rents and build costs are lower than the US, growth is faster, and the cost of debt is high to reflect Brazilian rates. A strong nominal return nets down once discounted like an EM asset.',
    s6:'Ascenty is the cloud\'s landing point in Latin America. What drives the return:',
    breakers:['<b>Brazilian macro</b> — the real, interest rates and regulation set the discount rate more than any technical factor.','<b>Hyperscale demand</b> — the global clouds\' regional expansion is the demand engine.','<b>Clean power</b> — a hydro-heavy grid is an increasingly decisive siting advantage.','<b>Scale &amp; fibre</b> — the largest platform and its own network are the competitive moat.'],
    src:'Figures from public sources: <a href="https://ascenty.com/en/" target="_blank" rel="noopener">Ascenty</a>, <a href="https://www.datacenterdynamics.com/" target="_blank" rel="noopener">DatacenterDynamics</a> on the 2018 acquisition and 2026 AI programme, and <a href="https://www.brookfield.com/" target="_blank" rel="noopener">Brookfield</a> disclosure. The JV is private; revenue and EBITDA are illustrative estimates.',
    econ:{cur:'US$',pue:1.35,anc:0,fixed:0,
      capDef:400,capMin:150,capMax:900,capStep:20,
      rentDef:190,rentMin:100,rentMax:350,rentStep:5,
      occDef:85,occMin:50,occMax:100},
    opex:{powerPrice:45,facRate:0.09,staff:35,sgaRate:0.08},
    calc:{build:3300,grant:0,capex:6,revG:5,floor:300,cap:1100,tax:34,exit:8,lev:4,rd:11,amort:3,hold:20},
    map:{ footer:'Emerging-market wholesale · clean hydro grid · own 4,500 km fibre' }
  },

  /* ---------- 4 · AIRTRUNK (Australia · hyperscale at scale) ---------- */
  airtrunk:{
    name:'AirTrunk', geo:'Sydney · Australia', continent:'Oceania', cur:'A$', geoKey:'airtrunk',
    lede:'Asia-Pacific\'s hyperscale champion — gigawatt-scale campuses leased to the cloud giants, and the <b>A$24&nbsp;billion</b> Blackstone deal that crowned the sector.',
    s1:'<p class="body"><b>AirTrunk</b> builds data centres at a scale few can match: more than <b>800&nbsp;MW</b> committed and over a gigawatt of land across Australia, Japan, Singapore, Malaysia, Hong Kong and India. Its Sydney campuses are among the largest in the region — SYD3 alone is a <b>320+&nbsp;MW</b> site. The model is <b>hyperscale wholesale</b> at the extreme: a few enormous tenants, vast power-secured campuses, and design-led efficiency (a PUE of 1.15).</p>'+
       '<p class="body">In 2024 <b>Blackstone and CPP Investments</b> bought it for an implied <b>A$24&nbsp;billion</b> — the largest data-centre deal ever and Blackstone\'s biggest-ever APAC investment. That price, more than 20&nbsp;times earnings, is itself the story: the world\'s largest pools of capital paying up for AI-era infrastructure.</p>',
    facts:[['800+ MW','Committed','1+ GW of land'],['A$24 bn','2024 deal','Blackstone + CPP'],['1.15','PUE (SYD2)','design-led'],['320+ MW','SYD3','APAC\'s largest'],['6','Countries','APAC + Japan'],['2015','Founded','Robin Khuda']],
    s2:'An AirTrunk campus is hyperscale wholesale built for AI density: a high-voltage substation, banks of generators, a <b>liquid-and-air cooling</b> plant tuned to a class-leading PUE, and giant halls leased whole to cloud and AI tenants. Power is passed through. Watch the value flow: <span style="color:#0c6b4f">$</span> in from the long leases, <span style="color:#bc4733">$</span> out for power and cooling — at a scale where a single campus is a billion-dollar asset.',
    driverLab:'Rent / kW·mo', availLab:'Occupancy', hrK:'Value earned /hr', yrS:'long hyperscale leases',
    preset:'Load AirTrunk',
    try:'<b>Try this:</b> AirTrunk\'s return is dominated not by the rent but by the <b>price paid</b>. At more than 20&nbsp;times earnings, the A$24bn entry is the whole debate. Push the exit multiple and the hold — this is what buying scarce, GW-scale, AI-ready infrastructure at a full price looks like for an infrastructure fund.',
    s3:'AirTrunk earns contracted wholesale rent on enormous leased megawatts, with power passed through — bond-like cash flow, but concentrated in a handful of the world\'s largest tenants. Its edges are <b>scale</b> (gigawatt campuses few can permit or power), a class-leading <b>PUE</b>, and secured power and land. The model\'s vulnerability is the same concentration that makes it financeable: a few giant counterparties, and a very full purchase price to earn back.',
    mb:{tag:'Model B · hyperscale at scale', title:'Gigawatt-scale wholesale', body:'Wholesale colocation at the largest scale — GW campuses leased to a few cloud and AI giants, with design-led efficiency and secured power. Bond-like and scarce, but <b>concentrated</b> and, lately, <b>expensive to buy</b>. <b>This is AirTrunk</b> — bought by Blackstone and CPP for A$24bn, the largest data-centre deal ever.'},
    s4a:'At this scale the operator\'s retained cost base is thin — power is passed through, and a class-leading PUE keeps the cooling overhead low — so the margin on net rent is very high. The investment case is not about operating cost at all; it is about the <b>A$24&nbsp;billion entry price</b> and what it implies for the return.',
    wfNote:'Power is the dominant electricity cost but is passed through to the hyperscale tenants, so the operator keeps a high margin. AirTrunk\'s class-leading PUE (1.15) means less of the power goes to cooling — the value-flow diagram\'s cooling $ is smaller here than in a hot climate.',
    s4b:'The headline is the <b>A$24&nbsp;billion</b> Blackstone–CPP acquisition in 2024 — funded with equity from the largest infrastructure and pension pools and long-dated debt against the contracted cash flow. At more than 20&nbsp;times earnings it is a rich price for a wonderful asset; committed expansion (including ~US$3bn in Malaysia) sits on top.',
    stackH:'The capital stack · A$24 bn deal', splitL:'Ownership', splitR:'infra capital',
    split:[['s1',60,'Blackstone — RE, Infra, Tac Opps, PE'],['s2',40,'CPP Investments']],
    finList:[['','2024 acquisition (implied EV)','A$24bn'],['sub','Buyers','Blackstone + CPP'],['sub','Sellers','Macquarie + PSP'],['','Committed capacity','800+ MW'],['sub','PUE (SYD2)','1.15'],['rest','Malaysia (Johor) expansion','~US$3bn']],
    finNote:'A$24bn for a platform earning perhaps a billion or so of EBITDA is north of 20&times; — the price of scarce, GW-scale, AI-ready infrastructure to the deepest capital on earth. The return is reliable but unspectacular at that entry; the risks are tenant concentration and simply having overpaid.',
    timeline:[['2015','<b>AirTrunk founded</b> by Robin Khuda.'],['2017','<b>SYD1 and MEL1 open.</b>'],['2020–21','<b>Macquarie + PSP</b> take a majority; APAC expansion.'],['Sep 2024','<b>Blackstone + CPP agree to buy</b> for A$24bn.'],['Dec 2024','<b>Acquisition completes.</b>'],['2024–25','<b>SYD3 (320+ MW)</b>; ~US$3bn Malaysia build.']],
    calcNote:'A working model calibrated to a <b>hyperscale platform bought at a full price</b>. The A$24bn entry is the build/entry input and the hold is long — so the return is driven by the price paid, the regulated-like rent growth and the exit multiple, far more than by operating cost. This is infrastructure-fund investing in its purest, priciest form.',
    s6:'AirTrunk is the AI build-out at gigawatt scale, bought at the top of the cycle. What drives the return:',
    breakers:['<b>The price paid</b> — at 20-plus times earnings, entry and exit multiples dominate the return.','<b>Tenant concentration</b> — a few hyperscalers are the entire demand side; their credit is the risk.','<b>Power &amp; land</b> — securing gigawatts of power and permittable land is the scarce capability.','<b>Efficiency</b> — a class-leading PUE protects the margin as AI density rises.'],
    src:'Figures from public sources: <a href="https://www.blackstone.com/news/press/" target="_blank" rel="noopener">Blackstone</a> on the A$24bn acquisition, <a href="https://www.infrastructureinvestor.com/" target="_blank" rel="noopener">Infrastructure Investor</a>, and <a href="https://airtrunk.com/" target="_blank" rel="noopener">AirTrunk</a> disclosure on capacity and PUE. The company is private; revenue and EBITDA are illustrative estimates.',
    econ:{cur:'A$',pue:1.2,anc:0,fixed:0,
      capDef:800,capMin:300,capMax:1600,capStep:20,
      rentDef:220,rentMin:120,rentMax:400,rentStep:5,
      occDef:90,occMin:50,occMax:100},
    opex:{powerPrice:25,facRate:0.05,staff:80,sgaRate:0.04},
    calc:{build:24000,grant:0,capex:4,revG:4,floor:900,cap:3000,tax:30,exit:16,lev:7,rd:5.5,amort:1,hold:25},
    map:{ footer:'Hyperscale at scale · gigawatt campuses · PUE 1.15 · Blackstone + CPP' }
  },

  /* ---------- 5 · KHAZNA (Middle East · sovereign AI build-out) ---------- */
  khazna:{
    name:'Khazna Data Centers', geo:'Abu Dhabi · UAE', continent:'Middle East', cur:'US$', geoKey:'khazna',
    lede:'The UAE\'s national data-centre champion — a <b>sovereign-backed</b> platform at the centre of one of the world\'s most ambitious AI build-outs.',
    s1:'<p class="body"><b>Khazna</b> is Abu Dhabi\'s national data-centre operator — ~360&nbsp;MW today across 30 facilities, with a <b>1&nbsp;GW</b> expansion announced and a central role in the UAE\'s vast AI plans. It is <b>state-linked</b>: controlled by <b>G42</b> (the Abu Dhabi AI group), tied to <b>Mubadala</b> and the emirate, with Silver Lake and MGX as minority backers. A 2025 stake sale valued it at <b>~$5.5&nbsp;billion</b>.</p>'+
       '<p class="body">The headline is the <b>"Stargate UAE"</b> project — a 1&nbsp;GW AI compute cluster (first 200&nbsp;MW targeted for 2026) inside a planned <b>5&nbsp;GW</b> Abu Dhabi AI campus, built with OpenAI, Oracle, Nvidia and SoftBank. This is data centre as <b>statecraft</b>: capacity built to make the UAE an AI power, with the commercial return secondary to the strategic one.</p>',
    facts:[['~360 MW','Operational','30 facilities'],['1 GW','Expansion','announced 2025'],['$5.5 bn','Valuation','2025 stake sale'],['5 GW','UAE AI campus','"Stargate UAE"'],['G42','Controlled by','state-linked'],['AI','The thesis','sovereign compute']],
    s2:'A Gulf data centre faces one structural challenge — <b>desert heat</b> — so cooling is a bigger share of the power bill than in a temperate climate, pushing up the PUE. Khazna leans on a grid mixing <b>nuclear, solar and gas</b>, AI-ready liquid cooling, and heritage passive-cooling design. Watch the value flow: <span style="color:#0c6b4f">$</span> in from the (often state-linked) tenants, <span style="color:#bc4733">$</span> out for power and a heavier-than-usual <span style="color:#bc4733">$</span> for cooling.',
    driverLab:'Rent / kW·mo', availLab:'Occupancy', hrK:'Value earned /hr', yrS:'colocation + AI compute',
    preset:'Load Khazna',
    try:'<b>Try this:</b> notice how much of the power goes to <b>cooling</b> in a desert climate — the value-flow diagram\'s cooling $ is larger here. Then consider the real driver: Khazna\'s capacity is being built to a <b>strategic</b>, not a purely commercial, brief, underwritten by the state and a who\'s-who of AI partners.',
    s3:'Khazna earns colocation and AI-compute revenue from a tenant base that is heavily <b>state-linked</b> (the G42 ecosystem) plus global AI partners. Commercially it looks like a high-margin operator; strategically it is an instrument of national policy — privileged land and power, sovereign capital, and a mandate to build AI capacity at a scale the local market alone could not justify. The return is real but <b>concentrated and political</b>.',
    mb:{tag:'Model B · sovereign champion', title:'State-backed AI infrastructure', body:'A sovereign-backed national champion builds large-scale and AI-optimised capacity with privileged land, power and capital, anchored by state-linked tenants — the commercial return secondary to the strategic one. Strong backing, but <b>concentration and geopolitics</b> are the risks. <b>This is Khazna</b> — G42/Mubadala-linked, central to the UAE\'s AI ambitions.'},
    s4a:'Khazna\'s cost base is a data centre\'s usual one — dominated by power — but with a desert twist: <b>cooling</b> takes a larger slice, because keeping halls cold in 45°C heat is hard. Cheap gas and abundant solar offset some of it. The margin is healthy; the real distinctiveness is on the revenue and ownership side, not the cost line.',
    wfNote:'Power is the dominant cost, and in a hot climate cooling claims an unusually large share of it — which is why the value-flow diagram\'s cooling $ is heavier here. A grid mixing nuclear, solar and gas keeps the unit cost down despite the climate.',
    s4b:'AI-ready capacity is expensive — <b>$10–20&nbsp;million per megawatt</b> for high-density, liquid-cooled halls — and the UAE\'s ambitions are measured in gigawatts (~$45–55&nbsp;billion per GW at hyperscale). Khazna funds this with <b>sovereign and strategic capital</b>: Mubadala, G42, Silver Lake and MGX, plus the marquee AI partners underwriting demand. A 2025 stake sale set the valuation near $5.5&nbsp;billion.',
    stackH:'The capital stack · sovereign', splitL:'Ownership', splitR:'state-linked',
    split:[['s1',65,'G42 — state-linked'],['s2',35,'Silver Lake · MGX · minorities']],
    finList:[['','2025 valuation','~$5.5bn'],['sub','e& exits ~40% stake','$2.2bn'],['','Operational capacity','~360 MW'],['sub','Expansion announced','1 GW'],['','Stargate UAE / AI campus','up to 5 GW'],['rest','AI partners','OpenAI · Oracle · Nvidia']],
    finNote:'A sovereign AI champion is a <b>strategic</b> asset first: privileged land, power and capital, and demand underwritten by the state and global AI partners. The commercial return is real but the case is national — and the risks are concentration (the G42 ecosystem) and geopolitics (US export-control scrutiny).',
    timeline:[['2012','<b>Founded</b> with Mubadala backing.'],['2022','<b>Folded into the G42 / e& JV.</b>'],['Apr 2025','<b>Two new UAE sites</b> break ground.'],['May 2025','<b>Stargate UAE announced</b> — a 5 GW AI campus.'],['2025','<b>e& exits</b> for $2.2bn; ~$5.5bn valuation.'],['Oct 2025','<b>1 GW expansion</b> plan unveiled.']],
    calcNote:'A working model calibrated to a <b>sovereign AI champion</b>. Tax is low (the UAE\'s corporate tax is just 9%), cooling takes a larger share of power in the desert heat, and the capital is strategic. The modelled return looks healthy, but remember the brief is national, not purely commercial.',
    s6:'Khazna is data centre as national strategy. What drives the return:',
    breakers:['<b>AI demand &amp; policy</b> — capacity is built to a strategic brief, underwritten by the state and global AI partners.','<b>Cooling in the heat</b> — desert climate lifts the PUE; the power-and-cooling cost is structurally higher.','<b>Concentration</b> — a tenant base centred on the G42 ecosystem is the main commercial risk.','<b>Geopolitics</b> — US export-control scrutiny of AI chips and G42\'s ties is the tail risk.'],
    src:'Figures from public sources: <a href="https://www.khazna.ae/" target="_blank" rel="noopener">Khazna</a>, <a href="https://www.g42.ai/" target="_blank" rel="noopener">G42</a> and <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a> on Stargate UAE, and reporting on the 2025 stake sale. The company is private; revenue and EBITDA are illustrative estimates.',
    econ:{cur:'US$',pue:1.45,anc:0,fixed:0,
      capDef:360,capMin:120,capMax:1000,capStep:20,
      rentDef:200,rentMin:110,rentMax:380,rentStep:5,
      occDef:85,occMin:50,occMax:100},
    opex:{powerPrice:45,facRate:0.07,staff:30,sgaRate:0.06},
    calc:{build:5500,grant:0,capex:5,revG:6,floor:300,cap:1200,tax:9,exit:13,lev:4,rd:5.5,amort:2,hold:20},
    map:{ footer:'Sovereign AI champion · nuclear + solar grid · desert cooling · Stargate UAE' }
  },

  /* ---------- 6 · GDS (China · listed state-adjacent operator at scale) ---------- */
  gds:{
    name:'GDS Holdings', geo:'China', continent:'China', cur:'¥', geoKey:'gds',
    lede:'One of China\'s largest data-centre operators — a listed, carrier-neutral platform at vast scale, riding Chinese cloud and AI demand and the <b>"Eastern Data, Western Computing"</b> plan.',
    s1:'<p class="body"><b>GDS</b> is a giant of the Chinese data-centre market: ~630,000&nbsp;m² of committed space, concentrated in the Tier-1 hubs of <b>Shanghai, Beijing and Guangzhou</b>, plus low-cost compute bases in western China. It is <b>carrier-neutral wholesale</b> at scale — leasing halls to China\'s cloud and internet majors — and it is <b>listed</b> on both NASDAQ and Hong Kong.</p>'+
       '<p class="body">In 2024 it earned <b>RMB&nbsp;10.3&nbsp;billion</b> of revenue at a <b>~47% adjusted-EBITDA margin</b>. The growth story has two engines: AI demand at home, channelled by China\'s <b>"Eastern Data, Western Computing"</b> policy toward cheap-power western provinces, and an offshore arm (DayOne) expanding across Southeast Asia. The overhang is geopolitics — US–China tech tensions and chip export controls.</p>',
    facts:[['~630k m²','Committed area','China\'s largest'],['¥10.3 bn','Revenue (2024)','+5.5% YoY'],['¥4.88 bn','Adj. EBITDA','~47% margin'],['73.8%','Utilisation','of committed area'],['NASDAQ/HK','Listed','GDS · 9698'],['EDWC','Western bases','cheap power']],
    s2:'GDS\'s western-China bases enjoy a real advantage: <b>cheap power and a cold climate</b>, so <b>free cooling</b> (using outside air) cuts the PUE and the power bill. Its city hubs are carrier-neutral, interconnecting many networks. Watch the value flow: <span style="color:#0c6b4f">$</span> in from the cloud and internet tenants, <span style="color:#bc4733">$</span> out for power — but with a lighter <span style="color:#bc4733">$</span> for cooling where the climate does the work for free.',
    driverLab:'Rent / kW·mo', availLab:'Occupancy', hrK:'Value earned /hr', yrS:'wholesale colocation leases',
    preset:'Load GDS',
    try:'<b>Try this:</b> drag occupancy — GDS\'s committed area runs at ~74% utilisation, so there is built but un-let capacity that lifts the return as it fills. Then weigh the discount: the cash flow is real and growing, but it is Chinese, leveraged, and exposed to US export controls on AI chips.',
    s3:'GDS earns wholesale colocation rent from China\'s cloud and internet majors, at scale and with steady utilisation gains. Its advantages are scale leadership, carrier-neutral interconnection, and the <b>cheap-power western bases</b> that national policy is steering compute toward. Its risks are distinctly Chinese: high <b>leverage</b>, customer concentration, the <b>RMB</b> and macro, and the ever-present <b>US–China tech tension</b> that constrains the AI chips its tenants need.',
    mb:{tag:'Model B · listed at scale', title:'Carrier-neutral wholesale, China-scale', body:'A listed, state-adjacent operator runs wholesale colocation at vast scale, leasing to the domestic cloud and internet giants and pushing compute to cheap-power western bases under national policy. Scaled and profitable, but <b>leveraged and geopolitically exposed</b>. <b>This is GDS</b> — China\'s largest, listed on NASDAQ and Hong Kong.'},
    s4a:'GDS\'s cost base is power-dominated like any data centre, but its western bases turn the climate into an asset: <b>free cooling</b> with cold outside air lowers the PUE and the electricity bill. Set against that are the city hubs\' higher power costs and a heavy maintenance and overhead load at scale. The blended margin lands around the high-40s.',
    wfNote:'Power dominates the cost base; GDS\'s western-China free-cooling lowers the PUE so less power goes to cooling — the value-flow diagram\'s cooling $ is lighter here than in a hot climate. The heavier swing factor is the cost of debt on a capital-intensive, leveraged balance sheet.',
    s4b:'Chinese build costs run <b>~$10–12&nbsp;million per megawatt</b>, and GDS\'s expansion — funded on a heavily-<b>leveraged</b>, listed balance sheet — leans on cheap western-province power. It is a capital-intensive model: scale and utilisation drive the return, but the debt load and the cost of capital are as important as the rent.',
    stackH:'The capital base · listed', splitL:'Structure', splitR:'listed',
    split:[['s1',58,'Founder super-voting ~58%'],['s2',42,'Public &amp; strategic holders']],
    finList:[['','2024 revenue','¥10.3bn'],['sub','Adjusted EBITDA (~47%)','¥4.88bn'],['','Committed area','~630k m²'],['sub','Utilisation','73.8%'],['','Listings','NASDAQ: GDS · HKEX: 9698'],['rest','DayOne (offshore)','deconsolidated 2024']],
    finNote:'GDS is a <b>listed, leveraged scale play</b> on Chinese cloud and AI: real, growing cash flow at the country\'s largest platform, but carrying heavy debt and priced through the lens of US–China tech tension. The cheap-power western bases are the structural edge; the chip export controls are the structural risk.',
    timeline:[['2001','<b>GDS founded</b> by William Wei Huang.'],['2016','<b>NASDAQ IPO.</b>'],['2020','<b>Hong Kong listing</b> — ~$1.67bn raised.'],['2022','<b>GDS International</b> (later DayOne) for offshore growth.'],['2024','<b>RMB 10.3bn revenue</b>, ~47% EBITDA; DayOne deconsolidated.'],['—','<b>"Eastern Data, Western Computing"</b> steers AI compute west.']],
    calcNote:'A working model calibrated to a <b>listed China-scale</b> operator. Western-China free cooling lowers the power-and-cooling cost; growth is strong but the balance sheet is leveraged and the cost of capital and country risk matter as much as the rent. There is also built, un-let capacity (utilisation ~74%) that lifts the return as it fills.',
    s6:'GDS is the scale play on Chinese cloud and AI. What drives the return:',
    breakers:['<b>Chinese demand &amp; policy</b> — cloud/AI growth and the "Eastern Data, Western Computing" plan steer the build-out.','<b>Geopolitics</b> — US–China tech tension and chip export controls constrain the AI capacity its tenants can fill.','<b>Leverage</b> — a capital-intensive, heavily-geared balance sheet makes the cost of debt decisive.','<b>Free cooling</b> — cheap-power, cold-climate western bases are the structural cost advantage.'],
    src:'Figures from public sources: <a href="https://investors.gds-services.com/" target="_blank" rel="noopener">GDS Holdings FY2024 results</a>, and reporting on its listings and the DayOne deconsolidation. FY2024 figures are audited; facility counts are third-party estimates.',
    econ:{cur:'¥',pue:1.35,anc:500,fixed:0,
      capDef:1050,capMin:400,capMax:1800,capStep:50,
      rentDef:1100,rentMin:600,rentMax:1800,rentStep:20,
      occDef:74,occMin:40,occMax:95},
    opex:{powerPrice:350,facRate:0.10,staff:800,sgaRate:0.08},
    calc:{build:55000,grant:0,capex:6,revG:6,floor:7000,cap:16000,tax:25,exit:10,lev:5,rd:4,amort:2,hold:20},
    map:{ footer:'Listed carrier-neutral wholesale · western free-cooling · Eastern Data Western Computing' }
  }
  };
  var ORDER=['equinix','nova','ascenty','airtrunk','khazna','gds'];

  /* ===================================================================
     FACILITY SCENE RENDERER  (canvas, 720x520)
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }

  /* facility plan constants */
  var FENCE={x:20,y:38,w:680,h:444};
  var BLD={x:200,y:116,w:362,h:292};
  var SUB={x:108,y:300}, MMR={x:636,y:300}, CHY=92, GENY=452;
  var CHILL=[252,312,372,432,492], GEN=[58,96,134,172];
  /* value-flow paths: [fromX,fromY,toX,toY] */
  var VF={ data:[600,300,400,262], power:[252,330,150,300], cool:[372,150,372,100] };
  var RACKCOL=['#1f9e6a','#27a6c4','#3b82c4','#9a6cd0'];

  function drawGround(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#eef0ec'); g.addColorStop(1,'#e3e6e0');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(120,130,118,0.10)'; ctx.lineWidth=1;
    for(var x=0;x<W;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for(var y=0;y<H;y+=40){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    // perimeter security fence
    ctx.strokeStyle='rgba(90,104,96,0.55)'; ctx.lineWidth=1.4; ctx.setLineDash([6,4]);
    rr(FENCE.x,FENCE.y,FENCE.w,FENCE.h,8); ctx.stroke(); ctx.setLineDash([]);
  }
  function drawPower(util){
    // incoming HV line from the grid + animated power flowing IN
    ctx.strokeStyle='#8a949a'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(0,300); ctx.lineTo(BLD.x,300); ctx.stroke();
    for(var i=0;i<5;i++){ var p=((T*0.012+i/5)%1); var x=p*BLD.x; // flow toward building
      ctx.fillStyle='rgba(230,180,40,'+(0.5+0.5*Math.sin(T*0.2+i))+')'; ctx.beginPath(); ctx.arc(x,300,2.2,0,Math.PI*2); ctx.fill(); }
    // substation block + transformers
    ctx.save(); ctx.shadowColor='rgba(20,30,25,0.18)'; ctx.shadowBlur=8; ctx.shadowOffsetY=2;
    ctx.fillStyle='#cfd4d0'; rr(SUB.x-40,SUB.y-34,80,68,5); ctx.fill(); ctx.restore();
    ctx.strokeStyle='rgba(90,100,94,0.5)'; ctx.lineWidth=1; rr(SUB.x-40,SUB.y-34,80,68,5); ctx.stroke();
    for(var t=0;t<2;t++){ var tx=SUB.x-22+t*30; ctx.fillStyle='#9aa39c'; rr(tx-9,SUB.y-18,18,36,2); ctx.fill();
      ctx.strokeStyle='#6f7a72'; ctx.lineWidth=1; for(var b=0;b<3;b++){ ctx.beginPath(); ctx.moveTo(tx-6+b*6,SUB.y-18); ctx.lineTo(tx-6+b*6,SUB.y-24); ctx.stroke(); } }
    // backup generators row
    GEN.forEach(function(gx){ ctx.fillStyle='#b6bcb4'; rr(gx-13,GENY-9,26,18,2); ctx.fill();
      ctx.fillStyle='#8a918a'; rr(gx-13,GENY-9,26,5,2); ctx.fill();
      ctx.fillStyle='#6f766f'; ctx.fillRect(gx+9,GENY-14,3,6); });
  }
  function drawChillers(util,cool){
    CHILL.forEach(function(cx,i){
      ctx.save(); ctx.shadowColor='rgba(20,30,25,0.16)'; ctx.shadowBlur=6;
      ctx.fillStyle = cool==='free' ? '#c2c8c2' : '#cdd3cf'; ctx.beginPath(); ctx.arc(cx,CHY,15,0,Math.PI*2); ctx.fill(); ctx.restore();
      ctx.strokeStyle='rgba(90,100,94,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(cx,CHY,15,0,Math.PI*2); ctx.stroke();
      // spinning fan blades
      var spd = cool==='free'?0.04:0.12;
      ctx.save(); ctx.translate(cx,CHY); ctx.rotate(T*spd*(0.6+util)+i);
      ctx.strokeStyle = cool==='liquid'?'#3b82c4':'#7f8a82'; ctx.lineWidth=2.2;
      for(var b=0;b<4;b++){ ctx.rotate(Math.PI/2); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(11,3); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle='#5a635c'; ctx.beginPath(); ctx.arc(cx,CHY,2.4,0,Math.PI*2); ctx.fill();
      // cold-air pipe into the building
      ctx.strokeStyle = cool==='liquid'?'rgba(59,130,196,0.4)':'rgba(120,150,170,0.32)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(cx,CHY+15); ctx.lineTo(cx,BLD.y); ctx.stroke();
    });
  }
  function drawBuilding(cap,occ,ai){
    // dark data-hall shell
    ctx.save(); ctx.shadowColor='rgba(15,25,35,0.30)'; ctx.shadowBlur=16; ctx.shadowOffsetY=5;
    var g=ctx.createLinearGradient(0,BLD.y,0,BLD.y+BLD.h); g.addColorStop(0,'#1d2735'); g.addColorStop(1,'#141b26');
    ctx.fillStyle=g; rr(BLD.x,BLD.y,BLD.w,BLD.h,8); ctx.fill(); ctx.restore();
    ctx.strokeStyle='rgba(120,140,160,0.35)'; ctx.lineWidth=1.2; rr(BLD.x,BLD.y,BLD.w,BLD.h,8); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1; rr(BLD.x+3,BLD.y+3,BLD.w-6,BLD.h-6,6); ctx.stroke();
    // rack rows with hot/cold aisles; lit fraction = occupancy
    var padX=18, padY=20, aisleH=10, rowH=15, rackW=ai?7:9, gap=ai?2.5:3.5;
    var rows=Math.floor((BLD.h-2*padY)/(rowH+aisleH));
    var cols=Math.floor((BLD.w-2*padX)/(rackW+gap));
    var litRows=Math.round(rows*occ);
    for(var r=0;r<rows;r++){ var ry=BLD.y+padY+r*(rowH+aisleH);
      for(var c=0;c<cols;c++){ var rx=BLD.x+padX+c*(rackW+gap);
        var live = r<litRows;
        ctx.fillStyle = live? '#28323f' : '#1a212c'; rr(rx,ry,rackW,rowH,1); ctx.fill();
        // LED
        if(live){ var blink=0.55+0.45*Math.sin(T*0.25+r*2+c); var col=RACKCOL[(r+c)%RACKCOL.length];
          ctx.globalAlpha=blink; ctx.fillStyle=col; rr(rx+rackW/2-1,ry+1.5,2,2,0.5); ctx.fill();
          ctx.globalAlpha=Math.max(0,blink-0.4)*0.5; ctx.beginPath(); ctx.arc(rx+rackW/2,ry+2.5,3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
        else { ctx.fillStyle='rgba(120,130,140,0.25)'; rr(rx+rackW/2-1,ry+1.5,2,2,0.5); ctx.fill(); }
      } }
  }
  function drawNetwork(dense){
    // fibre conduit from the outside world + data packets flowing IN
    ctx.strokeStyle='#8a949a'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(W,300); ctx.lineTo(BLD.x+BLD.w,300); ctx.stroke();
    for(var i=0;i<6;i++){ var p=((T*0.016+i/6)%1); var x=W-(p*(W-(BLD.x+BLD.w))); // toward building
      ctx.fillStyle='rgba(39,166,196,'+(0.5+0.5*Math.sin(T*0.25+i))+')'; ctx.beginPath(); ctx.arc(x,300,2.2,0,Math.PI*2); ctx.fill(); }
    // meet-me room
    ctx.save(); ctx.shadowColor='rgba(20,30,25,0.18)'; ctx.shadowBlur=8; ctx.shadowOffsetY=2;
    ctx.fillStyle='#2a3340'; rr(MMR.x-34,MMR.y-34,72,68,5); ctx.fill(); ctx.restore();
    // cross-connect strands (denser for interconnection hubs)
    var n=dense?9:4; for(var s=0;s<n;s++){ var yy=MMR.y-26+s*(52/(n-1));
      ctx.strokeStyle=['#27a6c4','#1f9e6a','#c0902f','#b0392f'][s%4]; ctx.globalAlpha=0.8; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(MMR.x-34,yy); ctx.lineTo(MMR.x+38, MMR.y-26+((s*7)%52)); ctx.stroke(); ctx.globalAlpha=1; }
  }
  /* the value-flow flags: $ in for data, $ out for power & cooling */
  function spawnFlow(key){ var v=VF[key]; if(flows.length<60) flows.push({k:key,x:v[0],y:v[1],tx:v[2],ty:v[3],p:0,sp:rnd(0.018,0.028)}); }
  function drawFlows(rates){
    if(_anim){ if(Math.random()<rates.data) spawnFlow('data');
      if(Math.random()<rates.power) spawnFlow('power'); if(Math.random()<rates.cool) spawnFlow('cool'); }
    for(var i=flows.length-1;i>=0;i--){ var f=flows[i]; if(_anim) f.p+=f.sp; if(f.p>=1){ flows.splice(i,1); continue; }
      var x=f.x+(f.tx-f.x)*f.p, y=f.y+(f.ty-f.y)*f.p, a=Math.sin(f.p*Math.PI);
      var inflow=(f.k==='data'), col=inflow?'#0c6b4f':'#bc4733';
      ctx.save(); ctx.globalAlpha=a;
      var g=ctx.createRadialGradient(x,y,0,x,y,7); g.addColorStop(0,inflow?'rgba(12,107,79,0.5)':'rgba(188,71,51,0.5)'); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=col; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('$',x,y+3.2);
      ctx.restore(); }
    // static value-flow flags (always shown)
    flag(VF.data[0]+8, VF.data[1]-16,'$ data','#0c6b4f','in');
    flag(VF.power[0]+2, VF.power[1]+22,'$ power','#bc4733','out');
    flag(VF.cool[0], VF.cool[1]+6,'$ cooling','#bc4733','out');
  }
  function flag(x,y,txt,col,dir){
    ctx.save(); ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='center';
    var w=ctx.measureText(txt).width+(dir==='in'?16:16);
    ctx.fillStyle='rgba(255,255,255,0.82)'; rr(x-w/2,y-9,w,14,7); ctx.fill();
    ctx.strokeStyle=col; ctx.globalAlpha=0.5; ctx.lineWidth=1; rr(x-w/2,y-9,w,14,7); ctx.stroke(); ctx.globalAlpha=1;
    ctx.fillStyle=col; ctx.fillText((dir==='in'?'▸ ':'')+txt+(dir==='out'?' ▸':''),x,y+1);
    ctx.restore();
  }
  function spawnCoin(){}  // unused for DC

  /* ===================================================================
     FRAME
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var G=GEO[A.geoKey], M=A.map, E=A.econ;
    var cap=parseFloat(sCap.value), rent=parseFloat(sSpread.value), occ=parseFloat(sAvail.value)/100;

    // ---- economics (annual) ----
    var leasedMW=cap*occ;
    var rentRev=leasedMW*1000*rent*12;
    var grossRev=rentRev + (E.anc||0)*1e6 + (E.fixed||0)*1e6;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e12)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var O=A.opex, pue=E.pue;
    var c_power=leasedMW*8760*O.powerPrice;
    var c_cool=leasedMW*(pue-1)*8760*O.powerPrice + O.facRate*revenue;
    var c_staff=O.staff*1e6;
    var c_sga=O.sgaRate*revenue;
    var opex=c_power+c_cool+c_staff+c_sga, ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    var totalPowerMW=leasedMW*pue;

    // ---- draw scene ----
    ctx.clearRect(0,0,W,H);
    drawGround();
    drawPower(occ);
    drawChillers(occ, G.cooling);
    drawBuilding(cap, occ, G.ai);
    drawNetwork(G.dense);
    // value-flow rates scale with the magnitudes
    var rateData=Math.min(0.6, revenue/1e9*0.10+0.05);
    var rates={ data:rateData, power:Math.min(0.5,c_power/1e9*0.12+0.03), cool:Math.min(0.4,c_cool/1e9*0.10+0.02) };
    drawFlows(rates);

    // caption + vignette
    ctx.save(); ctx.shadowColor='rgba(255,255,255,0.65)'; ctx.shadowBlur=3;
    ctx.fillStyle='rgba(40,55,50,0.6)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(M.footer)+' · '+fmtMW(cap),W/2,H-12); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*0.98);
    vg.addColorStop(0,'rgba(10,20,30,0)'); vg.addColorStop(1,'rgba(10,20,30,0.12)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',fmtMW(cap)); set('ixSpreadV',fmtRent(rent)); set('ixAvailV',Math.round(occ*100)+'%');
    set('ixDir',fmtMW(cap)); set('ixDirS',Math.round(occ*100)+'% leased');
    set('ixMW',fmtMW(totalPowerMW)); set('ixMWs','at PUE '+pue.toFixed(2));
    set('ixHr', revenue<=0?CUR+'0 / hr':money(revenue/HRS)+' / hr');
    set('ixYr', revenue<=0?CUR+'0':'≈ '+money(revenue));

    drawWaterfall(revenue, [['Power',c_power],['Cooling &amp; facilities',c_cool],['Staff &amp; operations',c_staff],['SG&amp;A &amp; connectivity',c_sga]], ebitda);
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
    var gR=gv('iRevG')/100, capexP=gv('iCapex')/100, daP=0.04, tax=gv('iTax')/100;
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
    var exitEVf=xMul*rows[N-1].eb;
    var distrib=eCF.slice(1).reduce(function(a,b){return a+b;},0);
    var moic=equity0>0?distrib/equity0:NaN;
    return {eb0:eb0,invest:invest,debt0:debt0,equity0:equity0,N:N,rows:rows,uCF:uCF,eCF:eCF,uIRR:irr(uCF),lIRR:irr(eCF),exitEV:exitEVf,moic:moic,payback:payback};
  }
  function renderModel(){
    var m=computeModel();
    if(!m){ ['oUIRR','oLIRR','oMOIC','oPB'].forEach(function(id){ set(id,'—'); });
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the margin is too thin to value against the capital — raise the rent or the occupancy.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Invested capital</span> <b>'+money(capexGrossG)+'</b></span>'+
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
    A=ASSETS[key]; CUR=A.cur; coins=[]; flows=[];
    set('ixAssetName',A.name); set('ixAssetGeo',A.geo); set('ixCont',A.continent);
    set('ixBarName',A.name);
    html('ixLede',A.lede);
    html('s1body',A.s1);
    html('ixFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    html('s2intro',A.s2);
    set('ixDriverLab',A.driverLab); set('ixAvailLab',A.availLab); set('ixHrK',A.hrK); set('ixYrS',A.yrS);
    set('ixPreset',A.preset); html('ixTry',A.try);
    var E=A.econ;
    sCap.min=E.capMin; sCap.max=E.capMax; sCap.step=E.capStep; sCap.value=E.capDef;
    sSpread.min=E.rentMin; sSpread.max=E.rentMax; sSpread.step=E.rentStep; sSpread.value=E.rentDef;
    sAvail.min=E.occMin; sAvail.max=E.occMax; sAvail.value=E.occDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue uses a stylised blended rent and the returns model is a simplified DCF; not a forecast, and not investment advice.');
    frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.capDef; sSpread.value=E.rentDef; sAvail.value=E.occDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'equinix');

  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
