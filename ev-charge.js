/* EV charging, data-driven worked examples.
   Six real charge-point operators (CPOs), one template. Scene config from
   ev-geo.js (GEO), drawn as a top-down charging hub / forecourt in a 720x520
   scene: a grid connection (substation) feeding a canopy of charging stalls that
   fill with cars as utilisation rises. The interactive figures are illustrative:
   a CPO's profitability is ALL about UTILISATION, fixed costs per charger mean
   low utilisation is a loss and high utilisation is a strong margin. Revenue here
   is modelled on a GROSS-MARGIN basis (energy delivered × the cents-per-kWh margin
   over wholesale power), and the returns model is a simplified DCF in which a
   public subsidy offsets part of the charger and grid-connection build. */
(function(){
  var CUR='€';
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
  function gwh(kwh){ var g=kwh/1e6; return (g>=100?Math.round(g):(g>=10?g.toFixed(0):g.toFixed(1)))+' GWh/yr'; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · FASTNED (Europe · premium highway ultra-rapid) ---------- */
  fastned:{
    name:'Fastned', geo:'Netherlands · Europe', continent:'Europe', cur:'€', geoKey:'fastned',
    lede:'A textbook <b>charge-point operator (CPO)</b>, premium, solar-canopied <b>ultra-rapid</b> stations on Europe\'s busiest motorways. Listed, loss-making until the cars came, and now a live demonstration of the <b>utilisation flywheel</b>.',
    s1:'<p class="body">A charge-point operator owns the physical chargers and sells energy at them. Its economics are unlike a fuel retailer or a regulated wire: the capital is sunk into the charger and its grid connection, and the costs that follow, site rent, network capacity charges, payment fees, maintenance, are <b>largely fixed per charger</b>. That single fact dominates everything. A charger sitting idle still costs money, so at low <b>utilisation</b> a CPO loses money; as utilisation climbs, the same fixed base spreads over far more kilowatt-hours and the margin turns sharply positive. This is the <b>utilisation flywheel</b>.</p>'+
       '<p class="body"><b>Fastned</b> builds and operates premium ultra-rapid stations, solar canopies, many high-power stalls per site, on the strategic locations along European motorways. It is publicly listed (Euronext Amsterdam) and for years ran at a loss while it built ahead of demand. As EV penetration rose, per-station <b>utilisation</b> climbed, and the early sites flipped from loss to strong contribution. The investment case is not the price of a charger but the <b>pace of the utilisation ramp</b> on a premium, hard-to-replicate network of locations.</p>',
    facts:[['Ultra-rapid','Power','up to 400 kW'],['Euronext','Listed','Amsterdam'],['Solar','Canopy','own-generation shade'],['Utilisation','The lever','idle = loss'],['Motorway','Locations','premium, scarce'],['Ramp','Stage','loss → contribution']],
    s2:'Watch the forecourt fill. Power arrives from the <b>grid connection</b>, flows under the canopy, and each stall that has a car plugged in lights up with a charging glow. The owner\'s <b style="color:#0c6b4f">money</b> is the <b>gross margin on every kWh delivered</b>, the retail price less the wholesale power, and that depends on how many of the stalls are actually in use. Drag the number of chargers, the margin per kWh, and the utilisation, and watch a near-empty forecourt lose money while a busy one prints.',
    driverLab:'Margin /kWh', availLab:'Utilisation', hrK:'Gross profit', yrS:'energy × margin /kWh',
    ledge:{a:'+ energy margin',b:'+ ancillary',c:'− site & power'}, demandLabel:'UTILISATION',
    preset:'Load Fastned',
    try:'<b>Try this:</b> drop the <b>utilisation</b> to the bottom and the station turns red, the fixed cost of each charger overwhelms the thin energy it sells, and the model reports it is too thin to value. Now raise utilisation back up: the same chargers, the same margin, but the fixed base spreads and EBITDA turns sharply positive. <b>Utilisation, not the charger, is the asset.</b>',
    s3:'Fastned earns a <b>gross margin per kilowatt-hour</b>, the retail charging price less the wholesale cost of the power, on every session, plus a little from ancillary services and grid flexibility. Because the station\'s costs are fixed per charger, that margin only becomes profit once enough cars use it: the return is driven by <b>throughput</b>, which is utilisation × the energy a charger can deliver. A premium location with high utilisation and a healthy margin per kWh is a strong asset; a quiet one is a liability until the cars arrive.',
    mb:{tag:'Model A · the utilisation flywheel', title:'Premium ultra-rapid CPO', body:'A charge-point operator owning premium ultra-rapid stations on scarce motorway locations, earning a gross margin per kWh that only becomes profit as <b>utilisation</b> ramps. High fixed cost per charger means a quiet site loses money and a busy one is highly profitable. <b>This is Fastned</b>, listed, building ahead of demand, riding the utilisation ramp.'},
    s4a:'A CPO\'s operating cost is <b>fixed per charger</b>, site rent, the grid capacity charge, payment and billing fees, networks and maintenance, and it is incurred whether or not a car ever plugs in. That is the whole story: at low utilisation these fixed costs swamp the thin energy margin and the station loses money; as utilisation climbs the same cost base spreads over far more kilowatt-hours, and the margin turns sharply positive. The defining number is not the cost line but <b>utilisation</b>.',
    wfNote:'Operating cost is dominated by fixed, per-charger items, site rent and grid connection, network and standing charges, payment and billing fees, and maintenance, incurred whether the charger is busy or idle. Against a thin per-kWh margin, that fixed base is exactly why utilisation, not cost-cutting, is the lever.',
    s4b:'The capital is the <b>charger hardware and its grid connection</b>, high-power units and the often-expensive upgrade to bring enough capacity to a motorway site. A <b>public subsidy</b> frequently part-funds the build, since governments want the network rolled out ahead of demand, so the operator\'s net capital is lower than the gross. That net outlay only earns its return once the location\'s utilisation ramps.',
    stackH:'The capital · charger + grid, net of subsidy', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',20,'Public subsidy'],['s2',80,'CPO net capital']],
    finList:[['','Power class','ultra-rapid (to 400 kW)'],['sub','Listing','Euronext Amsterdam'],['','Revenue','gross margin per kWh'],['sub','Key lever','utilisation ramp'],['','Locations','premium motorway sites'],['rest','Stage','loss → contribution as cars arrive']],
    finNote:'A premium CPO is a <b>utilisation ramp on a scarce network</b>: heavy fixed cost per charger, a thin per-kWh margin, and a return that arrives only as the cars do. The risks are the pace of EV adoption, the wholesale power cost squeezing the margin, and the price paid for locations.',
    timeline:[['2012','<b>Fastned founded</b> in the Netherlands to build motorway fast-charging.'],['2019','<b>Lists on Euronext Amsterdam</b>, raising capital to build ahead of demand.'],['2020s','<b>Network expands</b> into Germany, France, the UK and beyond.'],['2020s','<b>Utilisation ramps</b> as EV penetration rises, early stations turn profitable.'],['Ongoing','<b>Ultra-rapid upgrades</b> push power per stall higher.'],['Ongoing','<b>Station-level contribution</b> compounds as the flywheel turns.']],
    calcNote:'A working model of a <b>premium ultra-rapid CPO</b>, on an enterprise-value basis. The build is the charger and grid connection, with a public subsidy offsetting part; revenue is the gross margin on energy delivered, which lives or dies on utilisation. Throughput growth and a healthy margin per kWh drive the ramp from loss to return.',
    s6:'Fastned is the utilisation flywheel made visible. What moves the return:',
    breakers:['<b>Utilisation</b>, the dominant lever; idle chargers lose money, busy ones print.','<b>Margin per kWh</b>, the retail-minus-wholesale spread, squeezed when power prices spike.','<b>Location quality</b>, scarce, high-traffic motorway sites are the moat.','<b>EV adoption pace</b>, how fast the cars arrive sets the speed of the ramp.'],
    src:'Figures from public sources on the European fast-charging market: <a href="https://www.fastnedcharging.com/" target="_blank" rel="noopener">Fastned</a> investor disclosure and the broader CPO sector. The figures are approximate and illustrative.',
    econ:{cur:'€', power:'ultra-rapid', volt:'to 400 kW',
      cpDef:300,cpMin:60,cpMax:900,cpStep:10, marginDef:38,marginMin:15,marginMax:70,marginStep:1,
      utilDef:32,utilMin:5,utilMax:80,utilStep:1, kwhFull:165000, fixedPerCP:7, fixedOM:1.6},
    calc:{build:40,grant:8,capex:6,revG:8,floor:2,cap:200,tax:25,exit:10,lev:4,rd:5,amort:5,hold:16},
    map:{footer:GEO.fastned.footer}
  },

  /* ---------- 2 · EVGO (North America · public fast-charging network) ---------- */
  evgo:{
    name:'EVgo', geo:'United States', continent:'North America', cur:'US$', geoKey:'evgo',
    lede:'One of America\'s largest public <b>fast-charging</b> networks, listed, building density in metros, and turning the corner on the same <b>utilisation flywheel</b> as it adds grid-services revenue on top.',
    s1:'<p class="body"><b>EVgo</b> operates a large public fast-charging network across US metropolitan areas, often co-located at retail and grocery sites. Like every charge-point operator, its profitability is governed by <b>utilisation</b>: the chargers and their grid connections are a heavy, sunk cost, and the running costs, site agreements, demand charges, networks, payment fees, are largely fixed per charger. Until enough drivers use a station, those fixed costs swamp the thin per-kWh margin and the site loses money.</p>'+
       '<p class="body">EVgo (NASDAQ-listed) has leaned into two things to turn the flywheel: <b>density</b> in high-traffic metros to lift utilisation, and <b>grid services</b>, using its chargers and batteries to provide flexibility to the grid, to add a second, less utilisation-dependent revenue line. American demand charges make the fixed cost per charger especially punishing at low use, so the utilisation ramp matters even more here than in Europe. The investment case is the pace of that ramp plus the optionality of grid-services income.</p>',
    facts:[['Fast','Power','rapid DC'],['NASDAQ','Listed','public CPO'],['Metros','Footprint','US urban density'],['Demand charges','The drag','fixed per charger'],['Grid services','Upside','flexibility revenue'],['Utilisation','The lever','ramp to profit']],
    s2:'Picture a metro fast-charging hub filling through the day. Power arrives from the <b>grid connection</b>, and each stall with a car lights up as it charges. The owner\'s <b style="color:#0c6b4f">money</b> is the <b>gross margin per kWh</b>, retail less wholesale and the demand charge, plus grid-services income. It only becomes profit as the stalls fill. Drag the chargers, the margin per kWh and the utilisation to see a quiet network bleed and a busy one earn.',
    driverLab:'Margin /kWh', availLab:'Utilisation', hrK:'Gross profit', yrS:'energy × margin /kWh',
    ledge:{a:'+ energy margin',b:'+ grid svc',c:'− site & power'}, demandLabel:'UTILISATION',
    preset:'Load EVgo',
    try:'<b>Try this:</b> drop the <b>utilisation</b> and the network turns red, US demand charges make the fixed cost per charger brutal at low use. Now raise it and the same chargers turn profitable. Then nudge the margin per kWh: grid services and density are how EVgo defends it. <b>Utilisation, not the charger count, is the asset.</b>',
    s3:'EVgo earns a <b>gross margin per kilowatt-hour</b> on every session, the retail price less wholesale power and the utility demand charge, plus <b>grid-services</b> income from providing flexibility. Because the cost base is fixed per charger, the margin only becomes profit once utilisation is high enough. The US lever is <b>density</b>: clustering chargers in high-traffic metros to lift utilisation, and stacking grid-services revenue that does not depend on cars plugging in.',
    mb:{tag:'Model A · the utilisation flywheel', title:'Public fast-charging network + grid services', body:'A listed CPO building fast-charging density in US metros, earning a gross margin per kWh that only profits as <b>utilisation</b> ramps, with grid-services revenue stacked on top. Punishing demand charges make the fixed cost per charger high, so utilisation is everything. <b>This is EVgo</b>, riding the ramp and the grid-flexibility upside.'},
    s4a:'EVgo\'s operating cost is <b>fixed per charger</b>, site agreements, the utility <b>demand charge</b>, networks, payment fees and maintenance, and US demand charges make that fixed base especially heavy. At low utilisation it swamps the energy margin and the network loses money; as utilisation ramps, the same costs spread over far more kilowatt-hours and the margin turns positive. Grid-services revenue helps because it earns without a car plugging in.',
    wfNote:'Operating cost is fixed per charger, site agreements, the utility demand charge, network and payment fees, and maintenance, heavy in the US because of demand charges. Against a thin per-kWh margin, utilisation and grid-services revenue, not cost-cutting, are what turn the network profitable.',
    s4b:'The capital is the <b>fast chargers and their grid connections</b>, plus the batteries that enable grid services. A <b>public subsidy</b>, federal and state programmes such as NEVI, part-funds the build, lowering the operator\'s net capital. That net outlay earns its return only as metro utilisation ramps and grid-services income builds on top.',
    stackH:'The capital · chargers + grid, net of subsidy', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',23,'Public subsidy (NEVI etc.)'],['s2',77,'CPO net capital']],
    finList:[['','Power class','rapid DC'],['sub','Listing','NASDAQ'],['','Revenue','margin per kWh + grid services'],['sub','Key lever','metro utilisation + density'],['','Drag','US demand charges'],['rest','Stage','ramping to profitability']],
    finNote:'A US public CPO is a <b>utilisation ramp with a grid-services kicker</b>: heavy fixed cost per charger (demand charges), a thin per-kWh margin, and a return that arrives with density and adoption. The risks are the pace of EV uptake, demand-charge economics and the wholesale power cost.',
    timeline:[['2010','<b>EVgo founded</b> as one of the first US public fast-charging networks.'],['2021','<b>Lists on NASDAQ</b> via SPAC, funding network expansion.'],['2020s','<b>Metro density</b> strategy lifts per-charger utilisation.'],['2020s','<b>Grid-services</b> revenue added on top of charging.'],['2020s','<b>NEVI &amp; state programmes</b> co-fund build-out.'],['Ongoing','<b>Utilisation ramp</b> turns the network profitable.']],
    calcNote:'A working model of a <b>US public fast-charging network</b>, on an enterprise-value basis. The build is chargers and grid connections, with public subsidy offsetting part; revenue is the gross margin on energy plus grid services, and the whole return turns on the utilisation ramp against heavy demand-charge-driven fixed costs.',
    s6:'EVgo is the US utilisation ramp plus grid-services optionality. What drives it:',
    breakers:['<b>Utilisation &amp; density</b>, clustering chargers in busy metros is the core lever.','<b>Demand charges</b>, the US fixed-cost drag that makes low utilisation so punishing.','<b>Grid services</b>, flexibility revenue that earns without cars plugging in.','<b>EV adoption &amp; subsidy</b>, the pace of uptake and NEVI-style support set the ramp.'],
    src:'Figures from public sources on the US fast-charging market: <a href="https://www.evgo.com/" target="_blank" rel="noopener">EVgo</a> investor disclosure and the NEVI programme. The figures are approximate and illustrative.',
    econ:{cur:'US$', power:'rapid DC', volt:'to 350 kW',
      cpDef:900,cpMin:200,cpMax:2400,cpStep:20, marginDef:32,marginMin:12,marginMax:60,marginStep:1,
      utilDef:28,utilMin:5,utilMax:75,utilStep:1, kwhFull:150000, fixedPerCP:4, fixedOM:4},
    calc:{build:95,grant:22,capex:6,revG:9,floor:4,cap:600,tax:21,exit:10,lev:4,rd:6,amort:5,hold:15},
    map:{footer:GEO.evgo.footer}
  },

  /* ---------- 3 · ENEL X WAY (South America · nascent network) ---------- */
  enelx:{
    name:'Enel X Way', geo:'Latin America', continent:'South America', cur:'US$', geoKey:'enelx',
    lede:'A <b>nascent</b> charging network in a region where EV adoption is just beginning, early, <b>low utilisation</b>, building ahead of demand. The clearest illustration of why a CPO loses money until the cars come.',
    s1:'<p class="body">In much of Latin America the EV transition is early: fleets are small, fast-charging is sparse, and a charge-point operator that builds now is betting on a ramp that has barely started. <b>Enel X Way</b> (the e-mobility arm of the Enel group) deploys public and fleet charging across several Latin American markets. The economics are the same utilisation flywheel as everywhere else, but caught at its hardest point, the <b>early, low-utilisation</b> phase where the fixed cost per charger dominates and most sites lose money.</p>'+
       '<p class="body">This is the teaching case for the whole sector. A CPO\'s chargers and grid connections are a sunk, fixed cost; the running costs are fixed per charger; and until enough EVs exist to use them, the thin energy margin cannot cover that base. In a nascent market, utilisation is low by definition, so the early years are a deliberate <b>loss leading a ramp</b>, financed against an emerging-market cost of capital, in the hope that adoption accelerates. (This profile is illustrative of an early Latin American network rather than disclosed figures.)</p>',
    facts:[['Nascent','Market','adoption just starting'],['Low','Utilisation','the hard phase'],['Enel group','Parent','global e-mobility'],['Fixed cost','The drag','per charger, sunk'],['Build-ahead','Strategy','ahead of demand'],['EM rate','Discount','higher cost of capital']],
    s2:'Picture a forecourt with most stalls empty, a network built before the cars arrived. Power waits at the <b>grid connection</b>; only a few stalls glow. The owner\'s <b style="color:#0c6b4f">money</b> is the <b>gross margin per kWh</b>, but at this low utilisation it barely exists, and the fixed cost per charger drains the rest. Drag the utilisation up and watch the same network cross from loss into profit, that crossing is the entire investment case.',
    driverLab:'Margin /kWh', availLab:'Utilisation', hrK:'Gross profit', yrS:'energy × margin /kWh',
    ledge:{a:'+ energy margin',b:'+ ancillary',c:'− site & power'}, demandLabel:'UTILISATION',
    preset:'Load Enel X Way',
    try:'<b>Try this:</b> at the base case the network barely clears the fixed cost, drop the <b>utilisation</b> a little and it tips into loss and the model reports it is too thin to value. That is the nascent-market reality. Now imagine adoption accelerating: raise utilisation and the same chargers ramp into real profit. The whole bet is the <b>pace of that crossing</b>.',
    s3:'Enel X Way earns a <b>gross margin per kilowatt-hour</b> on the energy it sells, but in a nascent market the volume is small, so that margin barely covers the fixed cost of the chargers. The lever is the same as everywhere, <b>utilisation</b>, but here it is the difference between a loss and a return, and it depends on a market-wide adoption ramp the operator cannot control. The return is a <b>build-ahead bet</b> on EV growth, discounted at an emerging-market cost of capital.',
    mb:{tag:'Model A · the utilisation flywheel', title:'Nascent build-ahead CPO', body:'A charging network built ahead of demand in an early-adoption market, where low <b>utilisation</b> means the fixed cost per charger swamps the thin energy margin and most sites lose money until the cars arrive. The clearest form of the flywheel: a deliberate early loss leading a ramp. <b>This is an early Latin American network (illustrative)</b>.'},
    s4a:'The operating cost is <b>fixed per charger</b>, site rent, grid charges, networks, payment fees and maintenance, and in a nascent market it dwarfs the tiny energy margin a lightly-used charger earns. This is the flywheel at its hardest: the cost base is there from day one, but the utilisation that would spread it is years away. The only thing that turns this network profitable is <b>adoption lifting utilisation</b>.',
    wfNote:'Operating cost is fixed per charger and incurred from day one, while the energy margin in a nascent market is tiny. The waterfall here often shows costs swallowing revenue, the whole point of the early phase. Only the utilisation ramp, driven by market-wide EV adoption, can close the gap.',
    s4b:'The capital is the <b>chargers and grid connections</b> deployed across an early market, sunk before the demand exists. <b>Public and parent-group funding</b> offsets part of the build, since the roll-out is strategic, but the operator\'s net capital still has to wait for the utilisation ramp. Carried against an emerging-market cost of capital, the return depends entirely on how fast adoption arrives.',
    stackH:'The capital · chargers + grid, net of support', splitL:'Who funds the build', splitR:'EM',
    split:[['s1',37,'Public / parent support'],['s2',63,'Operator net capital']],
    finList:[['','Power class','rapid DC'],['sub','Parent','Enel group e-mobility'],['','Revenue','margin per kWh (thin, early)'],['sub','Key lever','adoption-driven utilisation'],['','Stage','nascent, build-ahead'],['rest','Discount','emerging-market cost of capital']],
    finNote:'A nascent CPO is the <b>utilisation flywheel at its hardest</b>: fixed cost from day one, a thin margin, and a return that waits on a market-wide adoption ramp. The risks are the pace of EV uptake, the country and currency discount rate, and the patience of the capital funding the build-ahead.',
    timeline:[['2018','<b>Enel X</b> begins deploying e-mobility infrastructure in Latin America.'],['2021','<b>Enel X Way</b> formed as the dedicated e-mobility line.'],['2020s','<b>Public &amp; fleet charging</b> rolled out across early markets.'],['2020s','<b>Low utilisation</b> as EV adoption is still nascent.'],['Future','<b>Adoption ramp</b>, the awaited crossing into profit.'],['Long-term','<b>Network density</b> as the regional fleet grows.']],
    calcNote:'A working model of a <b>nascent build-ahead CPO</b>, on an enterprise-value basis. The build is chargers and grid connections, part-funded by support; revenue is a thin energy margin that barely covers the fixed cost base. The cost of debt is high to reflect emerging-market rates, and the whole return is a bet on the utilisation ramp. Figures are illustrative.',
    s6:'Enel X Way is the flywheel before it has spun up. What drives it:',
    breakers:['<b>Adoption pace</b>, the market-wide EV ramp the operator is waiting on is everything.','<b>Utilisation crossing</b>, the point where energy margin finally covers the fixed cost.','<b>Country &amp; currency</b>, an emerging-market discount rate weighs heavily on a long ramp.','<b>Patience of capital</b>, funding a build-ahead loss until utilisation arrives.'],
    src:'Figures are illustrative of an early Latin American charging network and the broader e-mobility roll-out of the <a href="https://www.enelx.com/" target="_blank" rel="noopener">Enel X</a> group; they are not disclosed company figures. All numbers here are approximate and illustrative, and the regional flag is used for illustration only.',
    econ:{cur:'US$', power:'rapid DC', volt:'to 180 kW',
      cpDef:350,cpMin:80,cpMax:1000,cpStep:10, marginDef:28,marginMin:10,marginMax:55,marginStep:1,
      utilDef:22,utilMin:4,utilMax:70,utilStep:1, kwhFull:130000, fixedPerCP:3.5, fixedOM:0.7},
    calc:{build:30,grant:11,capex:6,revG:11,floor:1,cap:200,tax:34,exit:9,lev:3,rd:9,amort:5,hold:14},
    map:{footer:GEO.enelx.footer}
  },

  /* ---------- 4 · EVIE NETWORKS (Oceania · highway fast-charging build-out) ---------- */
  evie:{
    name:'Evie Networks', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'evie',
    lede:'An Australian <b>highway fast-charging</b> build-out, infrastructure-backed, stringing rapid chargers along the long corridors between cities, riding a utilisation ramp as the EV fleet grows.',
    s1:'<p class="body"><b>Evie Networks</b> builds and operates public fast-charging across Australia, with a focus on the <b>highway corridors</b> that make long-distance EV travel possible. It is backed by infrastructure capital (St Baker Energy / ienergy), which suits a business that must build ahead of demand across vast distances. The economics are the standard CPO flywheel: chargers and grid connections are a sunk, fixed cost, and the running costs are fixed per charger, so <b>utilisation</b> decides whether each site loses or makes money.</p>'+
       '<p class="body">Australia\'s geography sharpens the model. Highway sites are essential, they unlock intercity travel and the network effect, but they start with <b>low utilisation</b> because traffic is thin until the fleet grows. So Evie is a build-ahead infrastructure play: deploy the corridor now, accept early losses on quiet sites, and ride the <b>utilisation ramp</b> as Australian EV adoption accelerates. The infrastructure backing provides the patient capital that ramp requires.</p>',
    facts:[['Fast','Power','rapid DC'],['Highway','Focus','intercity corridors'],['Infra-backed','Capital','patient, build-ahead'],['Distances','Challenge','thin early traffic'],['Utilisation','The lever','ramp to profit'],['Australia','Market','growing EV fleet']],
    s2:'Picture a highway charging site between cities, a few rapid stalls under a canopy, fed from the <b>grid connection</b>. Cars arrive in waves; each plugged-in stall glows as it charges. The owner\'s <b style="color:#0c6b4f">money</b> is the <b>gross margin per kWh</b>, and on a quiet corridor it barely covers the fixed cost. Drag the utilisation up and watch the site cross into profit as the fleet grows and the corridor fills.',
    driverLab:'Margin /kWh', availLab:'Utilisation', hrK:'Gross profit', yrS:'energy × margin /kWh',
    ledge:{a:'+ energy margin',b:'+ ancillary',c:'− site & power'}, demandLabel:'UTILISATION',
    preset:'Load Evie',
    try:'<b>Try this:</b> drop the <b>utilisation</b> to reflect a thin highway corridor and the site tips into loss, the fixed cost per charger doesn\'t care that the road is quiet. Raise it as the EV fleet grows and the same chargers turn profitable. A highway network is the <b>utilisation flywheel</b> spread across long distances and patient capital.',
    s3:'Evie earns a <b>gross margin per kilowatt-hour</b> on the energy delivered at each site, plus a little ancillary income. On a highway corridor the volume is lumpy and starts low, so the margin only becomes profit as <b>utilisation</b> ramps with the fleet. The lever is the same as every CPO, utilisation against a fixed cost base, but stretched over Australian distances, which is why the model needs infrastructure-grade patient capital and a build-ahead corridor strategy.',
    mb:{tag:'Model A · the utilisation flywheel', title:'Highway fast-charging build-out', body:'An infrastructure-backed CPO stringing rapid chargers along intercity highway corridors, where low early <b>utilisation</b> means the fixed cost per charger swamps the energy margin until the fleet grows. A build-ahead play on the utilisation ramp, funded by patient infrastructure capital. <b>This is Evie Networks</b>.'},
    s4a:'Evie\'s operating cost is <b>fixed per charger</b>, site rent, grid connection and capacity charges, networks, payment fees and maintenance, and on a thin highway corridor it dwarfs the energy margin until the traffic builds. The flywheel is the same: the cost base is there from the day the site opens, and only rising <b>utilisation</b> spreads it into profit. Distance makes the early phase longer and the patient capital essential.',
    wfNote:'Operating cost is fixed per charger, site rent, grid and capacity charges, networks, payment fees and maintenance, incurred whether the corridor is busy or quiet. Against a thin per-kWh margin on lumpy highway traffic, only the utilisation ramp closes the gap.',
    s4b:'The capital is the <b>rapid chargers and their grid connections</b> along the corridors, often in remote spots where the grid upgrade is costly. A <b>public subsidy</b> part-funds the strategic build-out, and infrastructure backing provides the rest as patient capital. That net outlay earns its return as corridor utilisation ramps with the Australian EV fleet.',
    stackH:'The capital · chargers + grid, net of subsidy', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',33,'Public subsidy'],['s2',67,'Infra-backed net capital']],
    finList:[['','Power class','rapid DC'],['sub','Backing','infrastructure capital'],['','Revenue','gross margin per kWh'],['sub','Key lever','corridor utilisation ramp'],['','Focus','intercity highway sites'],['rest','Stage','build-ahead, ramping']],
    finNote:'A highway CPO is a <b>build-ahead utilisation ramp across distance</b>: fixed cost per charger, a thin margin, and a return that arrives as the fleet fills the corridors. The risks are the pace of Australian EV adoption, the cost of grid upgrades in remote sites, and the patience of the capital.',
    timeline:[['2018','<b>Evie Networks</b> launched to build Australian fast-charging.'],['2019','<b>Highway corridor</b> roll-out begins with government co-funding.'],['2020s','<b>Network extends</b> across intercity routes.'],['2020s','<b>Low early utilisation</b> on thin corridors.'],['2020s','<b>EV fleet grows</b>, utilisation ramps.'],['Ongoing','<b>Corridor density</b> as long-distance EV travel normalises.']],
    calcNote:'A working model of an <b>Australian highway fast-charging build-out</b>, on an enterprise-value basis. The build is chargers and grid connections along corridors, part-funded by subsidy; revenue is the gross margin on energy, thin until utilisation ramps with the fleet. Patient infrastructure capital and a long hold reflect the build-ahead profile.',
    s6:'Evie is the utilisation flywheel stretched across a continent. What drives it:',
    breakers:['<b>Corridor utilisation</b>, the lever, ramping as the EV fleet grows.','<b>Grid-upgrade cost</b>, remote highway sites can be expensive to connect.','<b>EV adoption pace</b>, how fast Australian uptake fills the corridors.','<b>Patient capital</b>, infrastructure backing to fund the build-ahead losses.'],
    src:'Figures from public sources on the Australian fast-charging market: <a href="https://www.evie.com.au/" target="_blank" rel="noopener">Evie Networks</a> and the broader CPO sector. As a private business, the figures are approximate and illustrative.',
    econ:{cur:'A$', power:'rapid DC', volt:'to 350 kW',
      cpDef:280,cpMin:60,cpMax:800,cpStep:10, marginDef:32,marginMin:12,marginMax:60,marginStep:1,
      utilDef:28,utilMin:5,utilMax:75,utilStep:1, kwhFull:150000, fixedPerCP:5, fixedOM:1},
    calc:{build:33,grant:11,capex:6,revG:8,floor:1,cap:200,tax:30,exit:11,lev:4,rd:6,amort:5,hold:16},
    map:{footer:GEO.evie.footer}
  },

  /* ---------- 5 · EVIQ (Middle East · state-backed national roll-out) ---------- */
  eviq:{
    name:'EVIQ', geo:'Saudi Arabia', continent:'Middle East', cur:'SAR', geoKey:'eviq',
    lede:'A <b>state-backed</b> national charging company building Saudi Arabia\'s EV-charging network from scratch, an early ramp, funded at a low cost of capital, designed to be ready before the fleet arrives.',
    s1:'<p class="body"><b>EVIQ</b> is a Saudi joint venture (between the Public Investment Fund and the Saudi Electricity Company) created to roll out a national network of fast and ultra-rapid chargers across the Kingdom. Like ENOWA in the energy space, it is a build-ahead-of-demand play: deploy the chargers and grid connections now, ahead of an EV fleet that is only beginning to grow, so the infrastructure is ready when adoption accelerates.</p>'+
       '<p class="body">The economics are the CPO utilisation flywheel, financed at a <b>state cost of capital</b>. Early on, <b>utilisation is low</b>, the fleet is small, so the fixed cost per charger dominates and many sites would lose money on a commercial basis. But state backing both funds the upfront build and tolerates the early ramp, betting that a low cost of capital plus a fast national adoption push tips the network into profit. The investment case is the pace of the ramp against a large, subsidised upfront build. (This profile is illustrative.)</p>',
    facts:[['Ultra-rapid','Power','national roll-out'],['PIF + SEC','Owners','state-backed JV'],['Build-ahead','Strategy','ready before the fleet'],['Low','Cost of capital','state-funded'],['Early','Utilisation','ramp ahead'],['Strategic','Mandate','national network']],
    s2:'Picture a national network being switched on, ultra-rapid stalls under canopies, fed from new <b>grid connections</b>, built ahead of the cars. Early on most stalls are empty and only a few glow. The <b style="color:#0c6b4f">return</b> arrives as the fleet grows and utilisation climbs. Drag the utilisation up and watch a subsidised, state-backed network cross from a build-ahead loss into profit as the Kingdom\'s EV adoption ramps.',
    driverLab:'Margin /kWh', availLab:'Utilisation', hrK:'Gross profit', yrS:'energy × margin /kWh',
    ledge:{a:'+ energy margin',b:'+ ancillary',c:'− site & power'}, demandLabel:'UTILISATION',
    preset:'Load EVIQ',
    try:'<b>Try this:</b> set the <b>utilisation</b> low and the network earns almost nothing against its fixed cost, a national grid built before the fleet. Then raise utilisation and watch the ramp arrive. State backing keeps the cost of capital low and funds the build-ahead, so the whole case is the <b>pace of national adoption</b> against the upfront subsidy.',
    s3:'EVIQ earns a <b>gross margin per kilowatt-hour</b> on the energy it sells, but as a build-ahead national network its early utilisation is low, so that margin barely covers the fixed cost per charger. The lever is the same <b>utilisation</b> flywheel, but here funded and tolerated by the state, which provides a low cost of capital and a subsidy for the upfront build. The return depends on how fast the Kingdom\'s EV fleet grows and lifts utilisation across the network.',
    mb:{tag:'Model A · the utilisation flywheel', title:'State-backed national CPO', body:'A state-backed company rolling out a national charging network ahead of demand, where early low <b>utilisation</b> means the fixed cost per charger swamps the energy margin until the fleet grows. A subsidised build-ahead bet funded at a low state cost of capital. <b>This is EVIQ (illustrative)</b>, Saudi Arabia\'s national charging roll-out.'},
    s4a:'EVIQ\'s operating cost is <b>fixed per charger</b>, site, grid capacity, networks, payment fees and maintenance, and on a build-ahead national network it dwarfs the thin energy margin while utilisation is low. The flywheel is the same as any CPO; what differs is that the state funds the upfront build and accepts the early ramp. Only rising <b>utilisation</b>, as the national fleet grows, spreads the fixed base into profit.',
    wfNote:'Operating cost is fixed per charger and incurred from the day each site opens, while early utilisation on a build-ahead national network is low. The waterfall reflects the ramp: costs heavy against a thin early margin, closing only as national EV adoption lifts utilisation.',
    s4b:'The capital is the <b>chargers and grid connections</b> for an entire national network, built ahead of demand, large and upfront. <b>State funding</b> (PIF / SEC) provides a meaningful subsidy and a low cost of capital, so the operator\'s net capital is lower and more patient than a commercial CPO could bear. That outlay earns its return as national utilisation ramps.',
    stackH:'The capital · national build, net of state funding', splitL:'Who funds the build', splitR:'state',
    split:[['s1',35,'State funding (PIF / SEC)'],['s2',65,'Net capital']],
    finList:[['','Power class','fast &amp; ultra-rapid'],['sub','Owners','PIF + Saudi Electricity Co.'],['','Revenue','gross margin per kWh'],['sub','Key lever','national utilisation ramp'],['','Cost of capital','low (state-backed)'],['rest','Stage','build-ahead, early ramp']],
    finNote:'A state-backed national CPO is a <b>subsidised build-ahead utilisation ramp</b>: large upfront capital at a low cost of capital, low early utilisation, and a return that arrives as the national fleet grows. The risks are the pace of Saudi EV adoption and the scale of capital committed ahead of demand.',
    timeline:[['2024','<b>EVIQ established</b> as a PIF / SEC joint venture.'],['2020s','<b>National roll-out</b> of fast and ultra-rapid chargers begins.'],['2020s','<b>Grid connections</b> built ahead of demand across the Kingdom.'],['2020s','<b>Early, low utilisation</b> as the EV fleet is small.'],['Future','<b>Adoption ramp</b> lifts utilisation toward profit.'],['Long-term','<b>National network</b> ready as EVs scale.']],
    calcNote:'A working model of a <b>state-backed national CPO</b>, on an enterprise-value basis. The build is a national charger and grid roll-out, heavily part-funded by the state; revenue is the gross margin on energy, thin until utilisation ramps. A low cost of capital and a long hold reflect a build-ahead, state-backed asset. Figures are illustrative.',
    s6:'EVIQ is a national utilisation ramp funded by the state. What drives it:',
    breakers:['<b>National adoption pace</b>, how fast the Saudi EV fleet grows and lifts utilisation.','<b>Build-ahead capital</b>, a large upfront network built before the demand.','<b>Cost of capital</b>, state backing keeps it low, essential for a long ramp.','<b>Subsidy share</b>, how much of the build the state funds shapes the net return.'],
    src:'Figures are illustrative of <a href="https://www.eviq.com.sa/" target="_blank" rel="noopener">EVIQ</a>, the Saudi state-backed national charging roll-out; they are not disclosed company figures. All numbers here are highly approximate and illustrative, and the flag is used for illustration only.',
    econ:{cur:'SAR', power:'fast & ultra-rapid', volt:'to 400 kW',
      cpDef:400,cpMin:100,cpMax:1200,cpStep:10, marginDef:34,marginMin:12,marginMax:65,marginStep:1,
      utilDef:26,utilMin:5,utilMax:75,utilStep:1, kwhFull:170000, fixedPerCP:5, fixedOM:2},
    calc:{build:62,grant:22,capex:6,revG:10,floor:1,cap:400,tax:0,exit:12,lev:4,rd:5,amort:5,hold:18},
    map:{footer:GEO.eviq.footer}
  },

  /* ---------- 6 · STAR CHARGE (China · vast-scale high-utilisation) ---------- */
  starcharge:{
    name:'Star Charge', geo:'China', continent:'China', cur:'¥', geoKey:'starcharge',
    lede:'One of the world\'s largest charging operators, in the world\'s largest EV market, vast scale and <b>high utilisation</b>, the flywheel fully spun up where the cars already are.',
    s1:'<p class="body"><b>Star Charge</b> (Wanbang) operates one of the largest charging networks on earth, in China, the world\'s biggest EV market by far. Where Western and emerging networks are still climbing the utilisation ramp, China is the case where the flywheel is <b>already spinning fast</b>: a huge installed EV fleet means chargers are heavily used, so the fixed cost per charger is spread over enormous throughput and the margin is strong.</p>'+
       '<p class="body">The per-kWh margin in China is thinner than in premium Western markets, competition and policy keep prices keen, but it is applied to <b>very high utilisation</b> across a vast fleet of chargers, and financed at a low domestic cost of capital. The model is scale and utilisation, not price: a modest margin on heavy throughput, compounded across an immense network. Star Charge shows what a mature CPO looks like once the cars have arrived and the flywheel is at full speed.</p>',
    facts:[['Vast','Scale','one of the largest'],['China','Market','world\'s largest EV fleet'],['High','Utilisation','flywheel spun up'],['Thin','Margin /kWh','but huge volume'],['Low','Cost of capital','domestic'],['Mature','Stage','profitable at scale']],
    s2:'Picture an urban charging hub running near-full all day, stall after stall with a car plugged in, glowing as it charges, fed from a heavy <b>grid connection</b>. At this <b>utilisation</b> even a thin <b style="color:#0c6b4f">margin per kWh</b> becomes a large, steady profit, because the fixed cost per charger is spread over enormous throughput. Drag the utilisation down to see how dependent even China is on it; drag it back up to watch the flywheel print.',
    driverLab:'Margin /kWh', availLab:'Utilisation', hrK:'Gross profit', yrS:'energy × margin /kWh',
    ledge:{a:'+ energy margin',b:'+ ancillary',c:'− site & power'}, demandLabel:'UTILISATION',
    preset:'Load Star Charge',
    try:'<b>Try this:</b> the margin <b>per kWh</b> is thin, but push the <b>utilisation</b> up and watch the absolute profit balloon, because the fixed cost is spread over so many kilowatt-hours. Then drop utilisation and even China\'s giant network thins. Scale and utilisation, not price, are the Chinese model. The cost of capital is low because the fleet and the financing are domestic.',
    s3:'Star Charge earns a <b>gross margin per kilowatt-hour</b> that is thin by Western standards, Chinese competition and policy keep retail prices keen, but it is applied to <b>very high utilisation</b> across an immense charger base. Because the fixed cost per charger is spread over enormous throughput, that thin margin compounds into a large, steady profit. The lever is the same utilisation flywheel as everywhere, caught at full speed: heavy volume, low price, low cost of capital.',
    mb:{tag:'Model A · the utilisation flywheel', title:'Vast-scale, high-utilisation CPO', body:'A charging operator at vast scale in the world\'s largest EV market, where very high <b>utilisation</b> spreads the fixed cost per charger over enormous throughput, turning even a thin per-kWh margin into a strong profit. The flywheel fully spun up. <b>This is Star Charge</b>, scale and utilisation, not price.'},
    s4a:'At Star Charge\'s scale the operating cost is immense in absolute terms, site, grid, networks, payment and maintenance across a vast charger base, but the <b>fixed cost per charger is spread over very high utilisation</b>, so the margin is strong. This is the flywheel at full speed: heavy throughput, a thin per-kWh margin, and a fixed base that becomes small relative to the kilowatt-hours sold. Utilisation, here at its highest, is still the defining number.',
    wfNote:'Operating cost is large in absolute terms but small relative to the enormous throughput at high utilisation, site, grid, networks, payment fees and maintenance across a vast charger base. With the fixed cost spread thin, even a keen per-kWh margin leaves a healthy bottom line.',
    s4b:'The capital is on a national scale, a vast fleet of chargers and their grid connections across Chinese cities, financed at a low <b>domestic cost of capital</b>, often with state and policy support for the build-out. A modest <b>subsidy</b> offsets part of the build. Spread over very high utilisation, that capital earns a strong, steady return at the scale only the Chinese market allows.',
    stackH:'The capital · national build, net of subsidy', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',27,'Subsidy / policy support'],['s2',73,'Operator net capital']],
    finList:[['','Power class','fast (dense urban)'],['sub','Market','China, largest EV fleet'],['','Revenue','thin margin × high volume'],['sub','Key lever','high utilisation at scale'],['','Cost of capital','low (domestic)'],['rest','Stage','mature, profitable at scale']],
    finNote:'A Chinese mega-CPO is the <b>utilisation flywheel at full speed</b>: a thin per-kWh margin on very high utilisation across a vast charger base, financed at a low cost of capital. The return is strong and steady; the risks are competition compressing the margin and policy direction.',
    timeline:[['2014','<b>Star Charge (Wanbang)</b> enters the Chinese charging market.'],['2010s','<b>China\'s EV market</b> grows to the world\'s largest.'],['2020s','<b>High utilisation</b> as the installed fleet drives heavy use.'],['2020s','<b>Vast network scale</b> across Chinese cities.'],['Ongoing','<b>Thin margins, heavy volume</b>, scale, not price.'],['Ongoing','<b>Grid &amp; flexibility</b> services layered on the base.']],
    calcNote:'A working model of a <b>vast-scale, high-utilisation CPO</b>, on an enterprise-value basis. The build is a national charger and grid base, part-funded by subsidy; revenue is a thin per-kWh margin applied to very high utilisation, which is what makes it profitable. A low domestic cost of capital lifts the value. Figures are highly illustrative given the scale.',
    s6:'Star Charge is the flywheel at full speed, scale and utilisation, not price. What drives it:',
    breakers:['<b>Utilisation at scale</b>, very high use spreads the fixed cost and is the whole model.','<b>Thin margin, heavy volume</b>, keen per-kWh pricing on enormous throughput.','<b>Cost of capital</b>, a low domestic rate lifts the value of a steady return.','<b>Competition &amp; policy</b>, the principal risks to the per-kWh margin.'],
    src:'Figures from public sources and reporting on the Chinese charging market: <a href="https://www.starcharge.com/" target="_blank" rel="noopener">Star Charge</a> and the broader sector. Given the scale and limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', power:'fast (urban)', volt:'to 250 kW',
      cpDef:9000,cpMin:3000,cpMax:20000,cpStep:100, marginDef:20,marginMin:8,marginMax:45,marginStep:1,
      utilDef:46,utilMin:10,utilMax:85,utilStep:1, kwhFull:110000, fixedPerCP:3, fixedOM:18},
    calc:{build:620,grant:170,capex:6,revG:7,floor:30,cap:4000,tax:25,exit:11,lev:4,rd:4,amort:5,hold:15},
    map:{footer:GEO.starcharge.footer}
  }
  };
  var ORDER=['fastned','evgo','enelx','evie','eviq','starcharge'];

  /* ===================================================================
     CHARGING HUB RENDERER  (canvas, 720x520), top-down, daytime
     A charging forecourt under a canopy: a grid connection (substation) at one
     side feeds power to a grid of charging stalls. A share of stalls equal to
     utilisation is occupied by a car plugged into a post with an animated charging
     glow; empty stalls show just the post. Cars arrive and leave for life.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var SUB={x:74,y:262};            // grid connection / substation feeding the site
  var SPINEX=150;                  // power spine into the forecourt
  // stall layout (built once per asset from GEO)
  var STALLS=[], ROWY=[], COLX=[], NST=0, _carCols=['#5b7fb0','#b06a5b','#6a9a78','#a98fc0','#c2a25a','#6f7a86','#b0708f'];
  function layout(){
    var G=GEO[A.geoKey], hw=(G.kind==='highway');
    // highway corridors are longer/sparser rows; urban hubs are denser
    ROWY = hw ? [120,210,300,390] : [104,172,240,308,376];
    COLX = (G.kind==='urban') ? [250,308,366,424,482,540,598] : [262,338,414,490,566];
    STALLS=[]; var idx=0;
    for(var r=0;r<ROWY.length;r++) for(var c=0;c<COLX.length;c++){
      var x=COLX[c], y=ROWY[r];
      var d=Math.hypot(x-SUB.x,y-SUB.y);   // fill order = distance from grid connection
      STALLS.push({x:x,y:y,row:r,col:c,d:d,ph:(idx*0.7)%6.28, car:_carCols[idx%_carCols.length],
        occ:false, swap:rnd(0,400)}); idx++;
    }
    NST=STALLS.length;
    STALLS.sort(function(a,b){ return a.d-b.d; });   // rank by distance from connection
    STALLS.forEach(function(p,i){ p.rank=i; });
  }

  /* ---- base map: forecourt ground + canopy + lane markings ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // forecourt apron behind the stalls
    ctx.fillStyle='rgba(120,140,150,0.12)';
    rr(206,72,494,H-150,16); ctx.fill();
    // canopy outline over the forecourt (premium / ultra get a stronger canopy)
    var ultra=(GEO[A.geoKey].power==='ultra');
    ctx.strokeStyle=ultra?'rgba(70,120,110,0.5)':'rgba(110,130,130,0.4)'; ctx.lineWidth=ultra?2.4:1.6;
    rr(214,80,478,H-166,14); ctx.stroke();
    // lane markings to each stall row
    ctx.lineCap='round';
    lane(SPINEX,84,SPINEX,420);
    ROWY.forEach(function(y){ lane(SPINEX,y,W-44,y); });
  }
  function lane(x0,y0,x1,y1){
    ctx.strokeStyle='#c6cbc1'; ctx.lineWidth=9; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.setLineDash([6,8]); ctx.lineDashOffset=-(T*0.5);
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- grid connection / substation feeding the site ---- */
  function substation(){
    var x=44,y=66; ctx.strokeStyle='#8a918c'; ctx.lineWidth=1.4;        // small pylon
    ctx.beginPath(); ctx.moveTo(x-8,y+28); ctx.lineTo(x,y); ctx.lineTo(x+8,y+28); ctx.moveTo(x-6,y+12); ctx.lineTo(x+6,y+12); ctx.stroke();
    ctx.strokeStyle='#7d847f'; ctx.beginPath(); ctx.moveTo(x,y+4); ctx.lineTo(SUB.x,SUB.y-24); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='600 7px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('GRID',x-6,y-4);
    // transformer box
    ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(SUB.x,SUB.y+26,24,4,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#cfd3ca'; rr(SUB.x-26,SUB.y-24,52,48,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    var tg=ctx.createLinearGradient(SUB.x-13,0,SUB.x+13,0); tg.addColorStop(0,'#7e857f'); tg.addColorStop(1,'#9aa19a');
    ctx.fillStyle=tg; rr(SUB.x-13,SUB.y-13,26,26,2); ctx.fill();
    // cooling fins
    ctx.strokeStyle='rgba(40,46,44,0.32)'; ctx.lineWidth=0.7; for(var f=1;f<5;f++){ ctx.beginPath(); ctx.moveTo(SUB.x-13,SUB.y-13+f*5.2); ctx.lineTo(SUB.x+13,SUB.y-13+f*5.2); ctx.stroke(); }
    // small ⚡ on the transformer
    ctx.strokeStyle='rgba(60,150,120,0.8)'; ctx.lineWidth=1.4; ctx.beginPath();
    ctx.moveTo(SUB.x+2,SUB.y-7); ctx.lineTo(SUB.x-3,SUB.y); ctx.lineTo(SUB.x+1,SUB.y); ctx.lineTo(SUB.x-2,SUB.y+7); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('GRID CONNECTION',SUB.x,SUB.y+40);
  }

  /* ---- power spine + feeders to the stall rows ---- */
  function feeders(){
    ctx.strokeStyle='rgba(90,110,150,0.5)'; ctx.lineWidth=2.4; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(SUB.x,SUB.y-24); ctx.lineTo(SUB.x,254); ctx.lineTo(SPINEX,254); ctx.stroke();   // sub → spine
    ctx.beginPath(); ctx.moveTo(SPINEX,ROWY[0]); ctx.lineTo(SPINEX,ROWY[ROWY.length-1]); ctx.stroke();          // spine
    ROWY.forEach(function(y){ ctx.beginPath(); ctx.moveTo(SPINEX,y); ctx.lineTo(COLX[COLX.length-1],y); ctx.stroke(); });
    ctx.setLineDash([]);
  }
  function flowPulses(pts,speed,load){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*4));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,'rgba(90,210,200,0.6)'); ctx.fillStyle='rgba(120,235,210,0.95)'; ctx.beginPath(); ctx.arc(p[0],p[1],1.5,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- a charging stall: post (+ canopy shade) and, if occupied, a car + glow ---- */
  function stall(p,occ,power){
    var ultra=(power==='ultra'), big=ultra||power==='rapid';
    // shade pad under the stall
    ctx.fillStyle='rgba(30,40,30,0.07)'; rr(p.x-13,p.y-12,26,26,4); ctx.fill();
    // car (drawn first, post sits beside it)
    if(occ){
      ctx.fillStyle='rgba(20,30,25,0.16)'; rr(p.x-9,p.y-6,20,13,3); ctx.fill();
      var cg=ctx.createLinearGradient(p.x,p.y-7,p.x,p.y+7); cg.addColorStop(0,p.car); cg.addColorStop(1,shade(p.car));
      ctx.fillStyle=cg; rr(p.x-9,p.y-8,19,15,3.5); ctx.fill();
      ctx.fillStyle='rgba(210,225,230,0.85)'; rr(p.x-5,p.y-5,11,8,2); ctx.fill();           // cabin glass
      ctx.fillStyle='rgba(255,255,255,0.55)'; rr(p.x-5,p.y-5,11,2,1); ctx.fill();
    }
    // charger post beside the stall
    var px=p.x+(big?12:11), py=p.y;
    ctx.fillStyle=occ?'#3f6f5e':'#9aa19a'; rr(px-2,py-(big?9:7),5,(big?18:14),1.6); ctx.fill();
    ctx.fillStyle=occ?'#2f7d54':'#8a918c'; rr(px-2.4,py-(big?9:7),5.6,(big?5:4),1.4); ctx.fill();  // screen head
    if(occ){
      // charging cable from post to car
      ctx.strokeStyle='rgba(50,110,90,0.7)'; ctx.lineWidth=1.4; ctx.beginPath();
      ctx.moveTo(px-1,py-2); ctx.quadraticCurveTo(px-5,py+3,p.x+6,py+1); ctx.stroke();
      // pulsing charging glow / bolt (brighter & bigger for ultra)
      var pul=0.55+0.45*Math.sin(T*0.16+p.ph), gr=(ultra?11:big?9:7)*(0.85+0.25*pul);
      glow(p.x,p.y-1, gr, 'rgba(70,'+(ultra?235:215)+','+(ultra?200:160)+','+(0.32+0.34*pul)+')');
      // little ⚡ above the car
      ctx.strokeStyle='rgba(40,150,120,'+(0.6+0.4*pul)+')'; ctx.lineWidth=1.3; ctx.beginPath();
      ctx.moveTo(p.x+2,p.y-12); ctx.lineTo(p.x-2,p.y-7); ctx.lineTo(p.x+1,p.y-7); ctx.lineTo(p.x-2,p.y-2); ctx.stroke();
    }
  }
  function shade(hex){ // darken a hex colour for the car body gradient
    var n=parseInt(hex.slice(1),16), r=(n>>16)&255, g=(n>>8)&255, b=n&255;
    return 'rgb('+Math.round(r*0.7)+','+Math.round(g*0.7)+','+Math.round(b*0.7)+')'; }

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
    var bx=px+13, bw=pw-26, rows=[['Gross profit','+'+money(rev),'#0c6b4f',1],['Operating cost','−'+money(opex),'#bc4733',Math.max(0.02,oR)],['EBITDA',money(eb)+'  ·  '+Math.round(m*100)+'%','#0a5a42',Math.max(0.02,m)]];
    var ry=py+42;
    rows.forEach(function(r){ ctx.fillStyle='rgba(60,72,66,0.95)'; ctx.font='600 9px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(r[0],bx,ry+7);
      ctx.fillStyle=r[2]; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(r[1],px+pw-13,ry+7);
      ctx.fillStyle='rgba(20,30,25,0.07)'; rr(bx,ry+11,bw,3,1.5); ctx.fill(); ctx.fillStyle=r[2]; rr(bx,ry+11,bw*Math.min(1,r[3]),3,1.5); ctx.fill();
      ry+=20; });
    ctx.restore();
  }
  /* ---- live utilisation sparkline ---- */
  function drawDemand(occ){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'UTILISATION';
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(label,px+11,py+14);
    ctx.fillStyle='rgba(47,125,84,0.95)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(Math.round(occ*100)+'%',px+pw-11,py+14);
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
    var cp=parseFloat(sCap.value), margin=parseFloat(sSpread.value), util=parseFloat(sAvail.value)/100;

    ctx.clearRect(0,0,W,H);
    drawMap(); substation(); feeders();

    // a share of stalls equal to utilisation is occupied & charging
    var occCount=Math.round(NST*util);
    // life: occasionally swap which stalls are occupied
    if(_anim){ STALLS.forEach(function(p){ p.swap-=1; if(p.swap<0){ p.swap=rnd(120,420); p.car=_carCols[(Math.random()*_carCols.length)|0]; } }); }
    STALLS.forEach(function(p){ var occ=p.rank<occCount; p.occ=occ; stall(p,occ,G.power); });

    // power flowing in from the grid connection to the busy stalls (scales with utilisation)
    var loadVis=0.3+0.6*util;
    flowPulses([[SUB.x,SUB.y-24],[SUB.x,254],[SPINEX,254]],0.9+loadVis,loadVis);
    flowPulses([[SPINEX,ROWY[0]],[SPINEX,ROWY[ROWY.length-1]]],0.7+loadVis,loadVis);
    ROWY.forEach(function(y){ flowPulses([[SPINEX,y],[COLX[COLX.length-1],y]],0.8+loadVis,loadVis*0.85); });

    // "+ NEW SITE" growth marker on the next empty stall
    if(G.growing && occCount<NST){
      var nxt=STALLS[Math.min(NST-1,occCount)];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ NEW SITE',nxt.x,nxt.y-16); ctx.restore();
        glow(nxt.x,nxt.y-2,8,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    }

    // ---- economics (utilisation-driven gross-margin ramp) ----
    var kwhPerCPatFull=(E.kwhFull||160000);    // kWh/charger/yr at 100% utilisation
    var kwhYr=cp*kwhPerCPatFull*util;
    var grossProfit=kwhYr*(margin/100);        // margin is in currency CENTS per kWh -> /100 to currency units
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossProfit));   // GROSS-MARGIN basis (after wholesale power)
    var opex= cp*(E.fixedPerCP||0)*1000 + (E.fixedOM||0)*1e6;  // site rent, network, O&M, payment fees, FIXED per charger
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var c_site=opex*0.36, c_om=opex*0.30, c_pay=opex*0.18, c_admin=opex*0.16;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is ancillary / grant-linked vs energy margin
    var ancShare=Math.max(0.08,Math.min(0.30, grant/Math.max(1,buildTot)*0.4));

    // money-flow: +cash rises from charging stalls; −cash (opex) drains
    if(_anim){
      var busy=STALLS.slice(0,Math.max(1,occCount));
      if(busy.length && Math.random()<0.6){ var s1=busy[(Math.random()*busy.length)|0]; spawnCoin(s1.x,s1.y-6, Math.random()<ancShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.7, opex/Math.max(1,Math.abs(revenue)+opex)));
      var anyStall=STALLS[(Math.random()*NST)|0];
      if(Math.random()<outRate && anyStall){ spawnCoin(anyStall.x,anyStall.y+4,'cost',1); }
      demHist.push(Math.max(0,Math.min(1,util))); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,util)));

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(cp)+' charge points',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',kfmt(cp)+' CP'); set('ixSpreadV',CUR+Math.round(margin)+'/kWh'); set('ixAvailV',Math.round(util*100)+'%');
    set('ixDir',kfmt(cp)); set('ixDirS','charge points · '+E.power);
    set('ixMW',gwh(kwhYr)); set('ixMWs',Math.round(util*100)+'% utilisation · '+(E.volt||''));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% of gross profit');

    drawWaterfall(revenue, [['Site rent &amp; grid',c_site],['O&amp;M &amp; networks',c_om],['Payment &amp; billing',c_pay],['Admin',c_admin]], ebitda);
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
    s+=lbl(bx(0)+bw/2, y(rev), 'Gross profit', money(rev), '#15201d');
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting utilisation is too low to value, the fixed cost per charger swamps the energy margin. Raise the utilisation, the margin per kWh or the charger count.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build</span> <b>'+money(capexGrossG)+'</b></span>'+
      '<span><span class="lbl">Net of subsidy</span> <b>'+money(netCapexG)+'</b></span>'+
      '<span><span class="lbl">Debt</span> <b>'+money(m.debt0)+'</b> ('+ltv+'% gearing)</span>'+
      '<span><span class="lbl">Equity in</span> <b>'+money(m.equity0)+'</b></span>'+
      '<span><span class="lbl">Exit EV</span> <b>'+money(m.exitEV)+'</b></span>';
    var maxAbs=Math.max.apply(null,m.eCF.map(Math.abs).concat([1])), step=m.N>14?3:(m.N>8?2:1);
    var ch='<div class="jaxis"></div>';
    m.eCF.forEach(function(cf,i){ var hh=Math.max(2,Math.abs(cf)/maxAbs*60);
      var cls=cf>=0?(i===m.N?'pos exit':'pos'):'neg';
      ch+='<div class="jcol"><div class="jbar '+cls+'" style="height:'+hh+'px" title="Year '+i+': '+money(cf)+'"></div><span class="jlbl">'+(i%step===0?i:'')+'</span></div>'; });
    var jc=document.getElementById('jchart'); if(jc) jc.innerHTML=ch;
    var ph=document.getElementById('ptHead'); if(ph) ph.innerHTML='<tr><th>Year</th><th>Gross profit</th><th>EBITDA</th><th>Capex</th><th>Unlev. FCF</th><th>Net debt</th><th>Equity FCF</th></tr>';
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
    sCap.min=E.cpMin; sCap.max=E.cpMax; sCap.step=E.cpStep; sCap.value=E.cpDef;
    sSpread.min=E.marginMin; sSpread.max=E.marginMax; sSpread.step=E.marginStep; sSpread.value=E.marginDef;
    sAvail.min=E.utilMin; sAvail.max=E.utilMax; sAvail.step=E.utilStep; sAvail.value=E.utilDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is modelled on a gross-margin basis (energy delivered × the margin per kWh over wholesale power) and the returns model is a simplified DCF in which a public subsidy offsets part of the build; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.cpDef; sSpread.value=E.marginDef; sAvail.value=E.utilDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'fastned');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
