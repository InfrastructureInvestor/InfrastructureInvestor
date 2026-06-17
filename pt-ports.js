/* Container ports & terminals — data-driven worked examples.
   Six real ports, one template. Harbour scene geometry from pt-geo.js (GEO),
   drawn in 720x520 scene coordinates. The interactive figures are illustrative:
   revenue uses a stylised blended yield and the returns model is a simplified DCF. */
(function(){
  var HRS=8760;
  var CUR='€';
  var A=null;
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;
  var coins=[], transit=[], berthFill=[], schedT=0, _anim=false;
  function rnd(a,b){ return a+Math.random()*(b-a); }
  function lerpA(a,b,f){ var d=((b-a+Math.PI)%(Math.PI*2))-Math.PI; return a+d*f; }

  /* ---------------- formatting ---------------- */
  function money(v){ var n=v<0; v=Math.abs(v); var o;
    if(v>=1e9)o=(v/1e9).toFixed(2)+'bn'; else if(v>=1e6)o=(v/1e6).toFixed(0)+'m';
    else if(v>=1e3)o=Math.round(v/1e3)+'k'; else o=''+Math.round(v);
    return (n?'−':'')+CUR+o; }
  function m1(v){ return (v/1e6).toFixed(1); }
  function set(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; }
  function html(id,t){ var e=document.getElementById(id); if(e) e.innerHTML=t; }
  function fmtTEU(v){ return v>=1e6?(v/1e6).toFixed(1)+'M TEU':(v/1e3).toFixed(0)+'k TEU'; }
  function fmtTariff(v){ var s=(Math.abs(v)<30)?(Math.round(v*100)/100).toString():Math.round(v).toString(); return CUR+s; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · ROTTERDAM (Europe · landlord port authority) ---------- */
  rotterdam:{
    name:'Port of Rotterdam', geo:'Netherlands', continent:'Europe', cur:'€', geoKey:'rotterdam',
    lede:'Europe\'s largest port and the textbook <b>landlord</b> — the public authority builds the land and the deep water, then rents it to the terminal operators who handle the boxes.',
    s1:'<p class="body">A modern container port is really two businesses. One <b>operates the terminal</b> — the quay cranes, the yard, the labour that moves the boxes. The other is the <b>landlord</b>: the public authority that reclaims the land, dredges the deep water and the approach channel, builds the road and rail, and then <b>leases</b> it all to the operators on long concessions.</p>'+
       '<p class="body">The <b>Port of Rotterdam Authority</b> is that landlord, owned by the City of Rotterdam (~70%) and the Dutch State (~30%). It handles <b>13.8&nbsp;million TEU</b> a year across terminals it does not itself run — its money comes from <b>land lease and concession contracts</b> plus <b>seaport dues</b>. Maasvlakte&nbsp;2, ~2,000&nbsp;hectares reclaimed from the North Sea, is where the deep-water, automated container terminals sit.</p>',
    facts:[['13.8M TEU','Containers (2024)','+2.8% YoY'],['€882m','Revenue (2024)','dues + land lease'],['€563m','EBITDA','64% margin'],['~€3 bn','Maasvlakte 2','land reclaimed 2013'],['70/30','Ownership','City / Dutch State'],['436 Mt','Total cargo','all commodities']],
    s2:'On the quay the work is the same everywhere: a ship berths, <b>ship-to-shore gantry cranes</b> lift containers off and on, straddle carriers and AGVs shuttle them to the <b>yard</b>, and trucks and trains carry them inland. The landlord\'s revenue, though, barely touches a single box — it is the <b>rent on the land</b> and the <b>dues on the ship</b>. Drag the throughput and yield below; the land-lease income underneath holds the revenue steady even when volumes wobble.',
    driverLab:'Yield / TEU', availLab:'Reefer &amp; special', hrK:'Value handled /hr', yrS:'dues + land lease',
    preset:'Load the Port of Rotterdam',
    try:'<b>Try this:</b> pull the throughput right down — revenue falls, but nowhere near proportionally, because most of it is <b>contracted land rent</b> that the operators owe whether their terminals are busy or not. That is the quiet strength of the landlord model: the cash flow is a property portfolio with a port on top.',
    s3:'The landlord earns two ways. <b>Seaport dues</b> are charged on every ship that calls, scaled by its tonnage — volume-linked, so they rise and fall with trade. <b>Contract revenue</b> is the rent on long, often inflation-linked <b>land-lease concessions</b> with the terminal operators — stable, and the larger of the two. The decisive investor question is the mix: the more of the cash flow that is contracted rent rather than throughput-linked dues, the more the port behaves like core infrastructure.',
    mb:{tag:'Model B · landlord', title:'Public landlord authority', body:'A government-owned authority owns the land, channel and basins and <b>leases terminals to private operators</b> on multi-decade concessions, earning rent plus ship dues. It carries the heavy, long-life civil capex (reclamation, dredging) but takes little operating risk. Stable, inflation-linked, infrastructure-like. <b>This is Rotterdam</b> — 70% city, 30% state.'},
    s4a:'A landlord port\'s costs are not labour and cranes — those sit with the operators — but the upkeep of the <b>civil estate</b>: dredging the channel and basins, maintaining quay walls, roads and locks, and a large overhead. The margin is high and stable, which is exactly what a property-like cash flow should look like.',
    wfNote:'Operating cost is dominated by the standing upkeep of the estate — dredging, quay walls and infrastructure — plus overhead. It barely moves with how many boxes cross the quay, which is why the landlord margin is so steady through the trade cycle.',
    s4b:'The capital is enormous and very long-lived: <b>Maasvlakte&nbsp;2</b> alone cost about <b>€3&nbsp;billion</b> to reclaim from the sea, financed in part by a €900m European Investment Bank loan. The authority carries that civil capex on an investment-grade balance sheet and recovers it through decades of land lease — the operators fund their own cranes and automation on top.',
    stackH:'The capital base · civil estate', splitL:'Ownership', splitR:'public',
    split:[['s1',70,'City of Rotterdam 70%'],['s2',30,'Dutch State 30%']],
    finList:[['','Maasvlakte 2 reclamation','~€3.0bn'],['sub','European Investment Bank loan (2008)','€900m'],['sub','3.5 km sea defence + 20 m deep water','2,000 ha'],['','2024 revenue','€882m'],['sub','· contract (land lease) revenue','larger, stable'],['sub','· seaport dues','volume-linked'],['rest','2024 gross investment','€321m']],
    finNote:'The landlord\'s balance sheet is essentially a <b>reclaimed-land portfolio</b>: spend billions once to make deep-water real estate, then collect inflation-linked rent for decades. The operators\' cranes and automation are <i>their</i> capex, not the authority\'s — which keeps the landlord\'s risk low and its margin high.',
    timeline:[['1932','<b>Municipal port authority established.</b>'],['Jan 2004','<b>Corporatised</b> — becomes Havenbedrijf Rotterdam N.V.'],['2008','<b>Maasvlakte 2 construction begins</b>; €900m EIB loan.'],['May 2013','<b>Maasvlakte 2 opens</b> — ~€3bn of new deep-water land.'],['2015','<b>APM Terminals MVII</b> — a fully automated terminal — goes live.'],['2024','<b>13.8m TEU</b>; revenue €882m, EBITDA €563m.']],
    calcNote:'A working model of the investment case, calibrated to a <b>landlord</b>. Year-1 revenue and EBITDA flow from the live harbour above — but most of the revenue is contracted land lease (captured as a high floor), so the cash flow is steady and the <b style="color:#0c6b4f">unlevered IRR</b> sits in the core-infrastructure range.',
    s6:'Rotterdam is the clearest case of a port as <b>real estate plus a moat</b>: deep water you cannot replicate, long leases, and a captive northwest-European hinterland. What moves the return:',
    breakers:['<b>The lease book</b> — the duration, indexation and renewal terms of the concessions are the bedrock cash flow.','<b>Trade volumes</b> — seaport dues track the cycle, and ultimately so does demand for terminal land.','<b>Energy transition</b> — a huge legacy oil and chemicals cluster must be reinvented (hydrogen, CCS), a multi-decade capex and revenue shift.','<b>Automation</b> — the operators\' efficiency keeps Rotterdam competitive against Antwerp and the German ports.'],
    src:'Figures from the authority and public sources: <a href="https://www.portofrotterdam.com/en/about-port-authority/finance/annual-reports" target="_blank" rel="noopener">Port of Rotterdam Authority 2024 Annual Report</a>, its <a href="https://www.portofrotterdam.com/" target="_blank" rel="noopener">tariff and throughput releases</a>, and <a href="https://en.wikipedia.org/wiki/Maasvlakte_2" target="_blank" rel="noopener">Maasvlakte 2</a> project material. The revenue split is described qualitatively by the authority.',
    econ:{cur:'€',premMult:1.6,anc:130,fixed:560,
      capDef:13800000,capMin:6000000,capMax:20000000,capStep:100000,
      tariffDef:14,tariffMin:5,tariffMax:40,tariffStep:1,
      premDef:8,premMin:2,premMax:25},
    opex:{labour:8,equip:90,concession:0,admin:130},
    calc:{build:9000,grant:0,capex:4,revG:2,floor:400,cap:1500,tax:25,exit:12,lev:5,rd:4,amort:2,hold:25},
    map:{ labels:[['NORTH SEA',120,300,'sea'],['SEA WALL',150,108,'seafaint'],['MAASVLAKTE 2',470,44,'land'],['DEEP-WATER TERMINALS',636,220,'feat'],['ROTTERDAM',636,300,'land']],
      footer:'Landlord port authority · Maasvlakte 2 deep-water terminals · North Sea mouth' }
  },

  /* ---------- 2 · LOS ANGELES (North America · municipal landlord) ---------- */
  la:{
    name:'Port of Los Angeles', geo:'San Pedro Bay, USA', continent:'North America', cur:'US$', geoKey:'la',
    lede:'America\'s busiest container port — a <b>municipal</b> landlord owned by the City of Los Angeles, where the surplus funds the public realm, not a shareholder.',
    s1:'<p class="body">The Port of Los Angeles is the western hemisphere\'s busiest container gateway, handling <b>10.3&nbsp;million TEU</b> in 2024 across the San Pedro Bay. Like Rotterdam it is a <b>landlord</b> — it leases its terminals to operators such as APM (Pier&nbsp;400), Fenix and Yusen — but with a twist: it is owned outright by the <b>City of Los Angeles</b>, run as a self-supporting public enterprise.</p>'+
       '<p class="body">That changes the investment lens. There is no equity and no dividend in the private sense; the port is a <b>proprietary department</b> that funds itself from dockage, wharfage and rents, issues its own revenue bonds, and ploughs the surplus back into the harbour and the city\'s waterfront. The "return" is public.</p>',
    facts:[['10.3M TEU','Containers (2024)','+~20% YoY'],['~$707m','Revenue (2024)','dockage + rents'],['~$430m','EBITDA','≈60% margin'],['1907','Founded','City of LA'],['$298m','Bonds','AA-rated, low debt'],['Pier 400','Largest terminal','APM · 484 acres']],
    s2:'San Pedro Bay sits behind a <b>federal breakwater</b>; ships enter through the Main Channel, berth at the terminals, and the boxes leave by truck or down the <b>Alameda Corridor</b> rail expressway to the inland rail yards. The port charges <b>wharfage</b> on the cargo and <b>dockage</b> on the ship, and rents the land — it does not run the cranes. Drag the levers; as a public landlord, the surplus is recycled, not paid out.',
    driverLab:'Yield / TEU', availLab:'Reefer &amp; special', hrK:'Value handled /hr', yrS:'to the City of LA',
    preset:'Load the Port of Los Angeles',
    try:'<b>Try this:</b> push throughput up and revenue climbs with the wharfage on every box — LA\'s revenue is more volume-linked than Rotterdam\'s, because shipping-service fees are ~80% of the take and land rent only ~17%. That makes it more cyclical: a trade war or an import slump is felt quickly.',
    s3:'LA\'s revenue is roughly <b>four-fifths shipping services</b> (wharfage on the cargo, dockage on the ship) and <b>one-fifth land rents</b>. So it is a more <b>volume-exposed</b> landlord than Rotterdam — closer to the trade cycle, with the 2024 import surge lifting it ~20% in a year. As a city enterprise it is also a <b>policy instrument</b>: it prices congestion (a per-box mitigation fee), funds zero-emission mandates, and competes hard with neighbouring Long Beach for the same boxes.',
    mb:{tag:'Model B · municipal', title:'City-owned landlord', body:'A self-supporting <b>city department</b> owns the harbour and leases terminals, funding itself from fees and rents and its own revenue bonds — with surpluses recycled into the port and waterfront rather than paid to equity. Stable and highly-rated, but the objective is civic, not a hurdle rate. <b>This is Los Angeles</b> — owned by the City, AA-rated, ~$298m of debt.'},
    s4a:'A municipal landlord runs lean: the operators carry the labour and the cranes, and the port maintains the channel, the wharves and the public works. Costs scale modestly with activity, so the operating margin is healthy — though lower than a pure-rent landlord because the volume-linked fee base brings some variable cost with it.',
    wfNote:'Operating cost is harbour maintenance, dredging, security and overhead, plus the city\'s public-works obligations. It is mostly fixed; the swing factor for a municipal port is the volume that drives the wharfage line above, not the cost line.',
    s4b:'The port funds itself: no city taxes, just <b>revenue bonds</b> (only ~$298m outstanding, AA-rated) and retained surpluses. Big-ticket capital — terminal modernisation, on-dock rail, the zero-emission transition (helped by a $412m federal EPA grant in 2024) — is paid from cash flow and grants, which is why leverage stays low.',
    stackH:'The capital base · public enterprise', splitL:'Ownership', splitR:'municipal',
    split:[['s1',100,'City of Los Angeles — 100%']],
    finList:[['','Outstanding revenue bonds (2025)','~$298m'],['sub','Fitch rating','AA / stable'],['','FY capital improvement programme','~$231m'],['sub','Zero-emission EPA grant (2024)','$412m'],['','Alameda Corridor rail link (2002)','$2.5bn'],['rest','Surpluses recycled into the port','no dividend']],
    finNote:'A self-supporting public port is a <b>low-leverage, AA-rated</b> cash machine whose surplus is reinvested rather than distributed. For a private investor it is mostly a benchmark — what a prime US gateway <i>would</i> be worth — since the City is not selling. The value is civic: jobs, trade and a funded waterfront.',
    timeline:[['1907','<b>Port founded</b> — Board of Harbor Commissioners created.'],['2002','<b>Alameda Corridor opens</b> — a $2.5bn rail expressway inland.'],['2002+','<b>Pier 400 (APM)</b> developed — the hemisphere\'s largest terminal.'],['2014','<b>TraPac automates</b> — first automated terminal in North America.'],['2024','<b>10.3m TEU</b> — second-busiest year ever; $412m EPA grant.'],['2025+','<b>Zero-emission transition</b> and trade-war volume caution.']],
    calcNote:'A working model on a <b>municipal landlord</b>. Note the <b>zero tax</b> — a city enterprise is tax-exempt, which flatters the return relative to a private operator. The revenue is more volume-linked than a pure landlord, so the floor sits lower and throughput does more of the work.',
    s6:'Los Angeles shows a port as <b>civic infrastructure</b> that also happens to throw off cash. The variables that decide it:',
    breakers:['<b>Trans-Pacific trade</b> — heavy exposure to Chinese imports; tariffs and inventory cycles swing volume hard.','<b>Long Beach next door</b> — the twin ports compete for the same boxes on rate, capacity and automation.','<b>Landside &amp; dwell</b> — the Alameda Corridor and truck/rail capacity govern how much cargo can actually clear.','<b>Decarbonisation</b> — zero-emission mandates are a large capex and operating-cost overhang, partly grant-funded.'],
    src:'Figures from the port and public sources: <a href="https://portoflosangeles.org/business/statistics/facts-and-figures" target="_blank" rel="noopener">Port of Los Angeles statistics</a>, its <a href="https://portoflosangeles.org/business/finance/financial-statements" target="_blank" rel="noopener">budget and financial statements</a>, and Fitch revenue-bond disclosure. Several figures are budget/forecast rather than audited actuals.',
    econ:{cur:'US$',premMult:1.5,anc:90,fixed:130,
      capDef:10300000,capMin:5000000,capMax:16000000,capStep:100000,
      tariffDef:46,tariffMin:20,tariffMax:90,tariffStep:1,
      premDef:10,premMin:3,premMax:25},
    opex:{labour:14,equip:70,concession:0,admin:73},
    calc:{build:7000,grant:0,capex:5,revG:2,floor:300,cap:1200,tax:0,exit:12,lev:4,rd:4.5,amort:2,hold:25},
    map:{ labels:[['PACIFIC',56,300,'sea'],['FEDERAL BREAKWATER',116,54,'seafaint'],["ANGEL'S GATE",170,206,'seafaint'],['SAN PEDRO BAY',262,300,'sea'],['LOS ANGELES',636,110,'land'],['LONG BEACH',636,300,'feat'],['PIER 400',636,432,'land']],
      footer:'Municipal landlord port · San Pedro Bay · behind the federal breakwater' }
  },

  /* ---------- 3 · CARTAGENA (South America · privatised operator) ---------- */
  cartagena:{
    name:'Port of Cartagena', geo:'Colombia', continent:'South America', cur:'US$', geoKey:'cartagena',
    lede:'The Caribbean\'s leading transshipment hub — a <b>privatised operator</b> that turned a failing state port into one of the most efficient terminals on earth.',
    s1:'<p class="body">When Colombia broke up its bankrupt state ports monopoly in the early 1990s, the terminal at Cartagena was handed to a private operator on a long concession. Three decades later, <b>Grupo Puerto de Cartagena</b> (the SPRC and Contecar terminals) handles <b>~3.3&nbsp;million TEU</b> a year and ranks among the <b>most efficient ports in the world</b>.</p>'+
       '<p class="body">This is the opposite of the landlord model: the operator <b>takes the throughput risk</b> and keeps the handling fee on every box. Its edge is <b>transshipment</b> — sitting beside the Panama Canal, it transfers containers between deep-sea services for hundreds of connecting ports, so much of its volume never leaves the terminal. That makes it a global node, but one exposed to where the shipping lines choose to switch boxes.</p>',
    facts:[['~3.3M TEU','Throughput','SPRC + Contecar'],['1993','Privatised','40-year concession'],['>6.2M TEU','Capacity','expanding'],['Top 3','World efficiency','CPPI 2023'],['Caribbean','#1 transship hub','800+ ports'],['Private','Ownership','Grupo Puerto']],
    s2:'Inside the sheltered Bahía de Cartagena, ships berth and the <b>ship-to-shore cranes</b> work them around the clock; boxes are stacked in the yard, then either trucked inland or — for transshipment — held and reloaded onto a connecting vessel. Every move earns a fee. Drag the levers below: this is a pure <b>operator</b>, so revenue rises and falls almost one-for-one with the boxes it handles.',
    driverLab:'Handling / TEU', availLab:'Reefer &amp; special', hrK:'Handling value /hr', yrS:'a terminal concession',
    preset:'Load the Port of Cartagena',
    try:'<b>Try this:</b> raise the reefer share — Colombia ships a lot of refrigerated fruit and flowers, and reefer boxes pay a premium. But notice the whole revenue line swings with throughput: an operator lives and dies by volume, and transshipment volume can be re-routed by a single shipping-line decision.',
    s3:'Cartagena earns a <b>handling tariff</b> on every container move — lift off the ship, yard, lift onto a truck or a connecting vessel. Local import/export boxes pay more; transshipment boxes pay less but come in huge numbers and use no inland infrastructure. The art is the <b>mix and the efficiency</b>: world-class crane productivity lets it underprice rivals for transshipment while still earning a margin. The risk is that the same boxes can move to Panama, Kingston or the Dominican Republic overnight.',
    mb:{tag:'Model B · operator', title:'Privatised terminal operator', body:'A private company wins a long concession, invests in cranes and yard, and <b>takes the full throughput risk</b>, keeping the handling fee on every box. Returns track volume and efficiency and are geared to global trade and transshipment flows — with real <b>emerging-market</b> currency and country risk. <b>This is Cartagena</b> — privatised in 1993, now a top-ranked Caribbean hub.'},
    s4a:'An operator\'s costs are the opposite of a landlord\'s: <b>labour and equipment</b> dominate, and they scale with the boxes. Crane maintenance, yard handling, the gangs on the quay, power for the reefers — every move has a cost as well as a fee. Efficiency is everything, because it sets both the margin and the price the terminal can win volume at.',
    wfNote:'Operating cost is mostly labour and equipment that scales with throughput, plus the concession fee to the grantor and power for refrigerated boxes. A highly efficient terminal keeps this low per move — which is precisely Cartagena\'s competitive weapon.',
    s4b:'The capital is the terminal itself — quay, yard, and a growing fleet of ship-to-shore and yard cranes (Contecar is expanding toward ~4.5M TEU). It is funded by the private group and reinvested cash flow under the concession. Modelled on an enterprise-value basis, the return is a <b>high-nominal emerging-market</b> one, carried against Colombian rates and currency.',
    stackH:'The capital stack · terminal EV', splitL:'Ownership', splitR:'private',
    split:[['s1',55,'Debt &amp; reinvested cash'],['s2',45,'Sponsor equity']],
    finList:[['','Concession (1993, extended to 40 yrs)','to ~2030s'],['','Contecar expansion','toward 4.5M TEU'],['sub','Additional ship-to-shore cranes','toward 17'],['','Combined design capacity','>6.2M TEU'],['','World efficiency rank (CPPI 2023)','top 3'],['rest','Financials — privately held','not disclosed']],
    finNote:'A privatised hub is a <b>throughput-risk equity play</b>: get the volume and the efficiency right and the returns are excellent, because the capital per box is low. The catch is that transshipment is footloose — it follows price and reliability — and the whole thing is priced in pesos against Colombian country risk.',
    timeline:[['1991','<b>Colombia breaks up</b> the state ports monopoly (Colpuertos).'],['1993','<b>SPRC granted the concession</b> to run the former state port.'],['1998','<b>Concession extended</b> toward a 40-year term.'],['2000s','<b>Contecar developed</b> into the group\'s main container terminal.'],['2023','<b>Ranked a top-3 most efficient</b> port worldwide (World Bank / S&amp;P CPPI).'],['2025','<b>Carriers reshuffle calls</b> across the terminals as the hub grows.']],
    calcNote:'A working model calibrated to an <b>emerging-market operator</b>, on an enterprise-value basis. There is no land-rent floor — revenue is almost all throughput-linked — so the cash flow is more cyclical, and the cost of debt is high to reflect Colombian rates. A strong nominal return nets down once you discount it like an EM asset.',
    s6:'Cartagena is the purest throughput-risk case here: world-class efficiency, footloose transshipment, and real country risk. What drives it:',
    breakers:['<b>Transshipment competition</b> — Panama, Kingston and Caucedo fight for the same switchable boxes on price and reliability.','<b>Canal &amp; trade flows</b> — Panama Canal throughput, draft limits and vessel size reshape Caribbean routing.','<b>Efficiency</b> — crane productivity sets both the margin and the price at which volume can be won.','<b>Country &amp; currency</b> — Colombian rates and the peso, not any technical factor, set the discount rate.'],
    src:'Figures from public sources: <a href="https://www.puertocartagena.com/en" target="_blank" rel="noopener">Grupo Puerto de Cartagena</a>, the <a href="https://www.porteconomics.eu/" target="_blank" rel="noopener">PortEconomics</a> Caribbean rankings and the World Bank / S&amp;P <a href="https://www.worldbank.org/" target="_blank" rel="noopener">Container Port Performance Index</a>. The group is privately held, so revenue and EBITDA are illustrative estimates, not disclosed figures.',
    econ:{cur:'US$',premMult:1.5,anc:30,fixed:0,
      capDef:3300000,capMin:1000000,capMax:6000000,capStep:100000,
      tariffDef:100,tariffMin:50,tariffMax:180,tariffStep:2,
      premDef:18,premMin:5,premMax:35},
    opex:{labour:35,equip:30,concession:0.05,admin:11},
    calc:{build:1700,grant:0,capex:6,revG:4,floor:120,cap:500,tax:30,exit:8,lev:4,rd:9,amort:4,hold:25},
    map:{ labels:[['CARIBBEAN SEA',62,150,'sea'],['TIERRABOMBA',150,210,'feat'],['BOCACHICA',150,402,'seafaint'],['BAHÍA DE CARTAGENA',272,290,'sea'],['CARTAGENA',638,108,'land'],['CONTECAR',638,300,'land'],['SPRC',638,400,'feat']],
      footer:'Privatised terminal operator · Caribbean transshipment hub · sheltered bay' }
  },

  /* ---------- 4 · MELBOURNE (Oceania · privatised long lease) ---------- */
  melbourne:{
    name:'Port of Melbourne', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'melbourne',
    lede:'Australia\'s biggest container port and a landmark of infrastructure investing — leased to a fund consortium for <b>A$9.7&nbsp;billion</b> over 50 years.',
    s1:'<p class="body">In 2016 the State of Victoria leased the <b>Port of Melbourne</b> — the country\'s largest container port — to the <b>Lonsdale Consortium</b> for <b>A$9.7&nbsp;billion</b>, one of the largest infrastructure deals in the region\'s history. The buyers were exactly who you\'d expect: long-horizon infrastructure capital — <b>Australia\'s Future Fund, QIC, Global Infrastructure Partners and OMERS</b>.</p>'+
       '<p class="body">It is a <b>landlord</b> on a <b>50-year lease</b>: the consortium owns the right to the port\'s land, channels and charges until 2066, and leases the terminals to operators like Patrick, DP World and the automated VICT. The investment case is the classic infrastructure one — a monopoly gateway with regulated-but-growing cash flows over a very long horizon — and the question is simply what you pay for it.</p>',
    facts:[['~3.4M TEU','Containers','Australia\'s #1'],['A$9.7 bn','2016 lease','50 years to 2066'],['50 yr','Lease term','landlord rights'],['ESC','Regulator','price-monitored'],['Future Fund','+ QIC · GIP · OMERS','Lonsdale Consortium'],['VICT','Automated terminal','Webb Dock']],
    s2:'On Port Phillip Bay at the mouth of the Yarra, ships berth at Swanson and Webb docks and the operators work the boxes; the port company\'s money is the <b>wharfage and channel fees</b> on the cargo and the <b>rent</b> on the terminals. Its prices are <b>monitored by the Essential Services Commission</b> under a pricing order, so it cannot simply charge what it likes. Drag the levers — the rent underneath keeps the revenue steady, while the regulator caps the upside.',
    driverLab:'Yield / TEU', availLab:'Reefer &amp; special', hrK:'Value handled /hr', yrS:'rent + regulated charges',
    preset:'Load the Port of Melbourne',
    try:'<b>Try this:</b> the throughput moves the wharfage, but the big, steady leg is the <b>rent on a 50-year monopoly</b>. That is what an infrastructure fund pays for — a very long, inflation-linked, low-risk cash flow. Push the exit multiple in the model and watch how much of the return is simply the price paid and the price assumed on the way out.',
    s3:'Melbourne earns rent on its terminal leases plus <b>regulated wharfage and channel charges</b> on the cargo. Because it is a near-monopoly — the only large container port for a big, growing state — its prices are <b>monitored by a regulator (the ESC)</b> rather than set freely. The result is a classic infrastructure profile: <b>stable, inflation-linked, modestly growing</b> cash flow, with the upside capped by regulation and the downside cushioned by a captive hinterland.',
    mb:{tag:'Model B · privatised lease', title:'Long-lease landlord monopoly', body:'A government leases a monopoly port to private capital for decades, keeping a <b>price-monitoring regulator</b> over its charges; the lessee earns rent and regulated fees and takes terminal-value risk at handback. Low-risk, long-duration, inflation-linked — the infrastructure-fund staple. <b>This is Melbourne</b> — A$9.7bn, 50 years, owned by Future Fund, QIC, GIP and OMERS.'},
    s4a:'As a landlord, Melbourne\'s costs are light — channel dredging, asset maintenance and overhead — so the margin is very high, among the best on this list. The operators carry the labour and the cranes. The real "cost" in the investment case is not opex at all; it is the <b>A$9.7bn entry price</b> and what it implies for the return.',
    wfNote:'Operating cost is channel and asset maintenance plus a lean overhead — the operators bear the handling cost. The margin is high and stable; the determinant of the return is the price paid for the 50-year lease, not the running cost.',
    s4b:'The headline number is the <b>A$9.7&nbsp;billion lease premium</b> paid in 2016 — funded by the consortium with equity from its members and long-dated debt against the stable cash flow. Committed capital to expand capacity sits on top. At that price the port changed hands at a rich multiple, which is the whole debate: a wonderful asset, but bought at a wonderful-asset price.',
    stackH:'The capital stack · A$9.7 bn lease', splitL:'The Lonsdale Consortium', splitR:'ownership',
    split:[['s1',60,'Future Fund · QIC · GIP · OMERS — equity'],['s2',40,'Long-dated debt']],
    finList:[['','2016 lease premium','A$9.7bn'],['sub','Lease term','50 years (to 2066)'],['sub','Future Fund · QIC · GIP · OMERS','equity'],['','Regulator — Essential Services Commission','price-monitored'],['','Terminal operators','Patrick · DP World · VICT'],['rest','VICT automated terminal (Webb Dock)','26-yr concession']],
    finNote:'A$9.7bn for a port earning a few hundred million of EBITDA is a <b>20-plus times multiple</b> — the price of a 50-year, inflation-linked monopoly to the lowest-cost, longest-horizon capital on earth. The return is unspectacular but extraordinarily reliable; the risk is overpaying and the terminal value at handback in 2066.',
    timeline:[['2014','<b>VICT signs</b> a 26-year deal for an automated terminal at Webb Dock.'],['Sep 2016','<b>Lonsdale Consortium wins the 50-year lease</b> for A$9.7bn.'],['2017','<b>VICT opens</b> — Australia\'s first fully automated container terminal.'],['2021','<b>First ESC pricing review</b> under the lease.'],['2024','<b>Record throughput</b> — ~3.4m TEU.'],['2066','<b>Lease expiry</b> — the port returns to the State.']],
    calcNote:'A working model calibrated to a <b>privatised long lease</b>. The entry price (A$9.7bn) is the build/entry input, and the hold is long to match the lease — so the return is driven by the <b>price paid</b>, the regulated growth, and the exit multiple, far more than by year-to-year volume. This is what buying an infrastructure monopoly actually looks like.',
    s6:'Melbourne is the infrastructure-fund archetype: a long, regulated, monopoly cash flow bought at a full price. The levers that decide it:',
    breakers:['<b>The price paid</b> — at 20-plus times EBITDA, the entry and exit multiples dominate the return.','<b>Regulated charges</b> — the ESC pricing order caps how fast the port can lift its tariffs.','<b>Trade &amp; population growth</b> — Victoria\'s growth underpins the slow, steady volume compounding.','<b>The second-port question</b> — a future Victorian container port could one day cap the monopoly and the terminal value.'],
    src:'Figures from public sources: <a href="https://www.portofmelbourne.com/about-us/trade-statistics/" target="_blank" rel="noopener">Port of Melbourne</a>, the <a href="https://www.esc.vic.gov.au/transport/port-melbourne" target="_blank" rel="noopener">Essential Services Commission</a>, and the 2016 lease announcements from the <a href="https://www.futurefund.gov.au/" target="_blank" rel="noopener">Future Fund</a> and <a href="https://www.omersinfrastructure.com/" target="_blank" rel="noopener">OMERS</a>. The port is privately held; revenue and EBITDA are illustrative estimates.',
    econ:{cur:'A$',premMult:1.4,anc:30,fixed:280,
      capDef:3400000,capMin:1500000,capMax:6000000,capStep:100000,
      tariffDef:60,tariffMin:25,tariffMax:120,tariffStep:1,
      premDef:10,premMin:3,premMax:25},
    opex:{labour:10,equip:40,concession:0,admin:41},
    calc:{build:9700,grant:0,capex:4,revG:3,floor:250,cap:800,tax:30,exit:22,lev:7,rd:5,amort:1,hold:40},
    map:{ labels:[['PORT PHILLIP BAY',150,300,'sea'],['YARRA RIVER',472,60,'seafaint'],['SWANSON DOCK',468,108,'feat'],['MELBOURNE',640,300,'land'],['WEBB DOCK',640,420,'land']],
      footer:'Privatised 50-year lease · Swanson & Webb docks · Port Phillip Bay' }
  },

  /* ---------- 5 · JEBEL ALI (Middle East · DP World hub operator) ---------- */
  jebelali:{
    name:'Jebel Ali Port', geo:'Dubai, UAE', continent:'Middle East', cur:'US$', geoKey:'jebelali',
    lede:'The world\'s largest man-made harbour and DP World\'s flagship — a <b>global hub operator</b> fused to a free zone, and the engine of Dubai\'s trade economy.',
    s1:'<p class="body">Built from nothing on the Gulf coast in 1979, <b>Jebel Ali</b> is the world\'s largest man-made harbour and the home port of <b>DP World</b>, one of the three global terminal operators. It handles <b>~15.5&nbsp;million TEU</b> a year and, unlike a pure terminal, it is welded to the <b>JAFZA free zone</b> behind it — 11,000+ companies whose cargo flows straight through the quay.</p>'+
       '<p class="body">This is an <b>operator</b> at the largest scale, and a strategic one: DP World is owned by <b>Port &amp; Free Zone World</b>, ultimately the Government of Dubai, which took the company private off the Nasdaq in 2020. Jebel Ali is both a commercial profit centre and the physical foundation of Dubai\'s position as a trade and logistics capital.</p>',
    facts:[['15.5M TEU','Throughput (2024)','highest since 2015'],['1979','Opened','built as artificial harbour'],['~19.4M TEU','Capacity','Terminal 4 → ~22M'],['JAFZA','Free zone','11,000+ companies'],['DP World','Operator','state-linked'],['Hub','Gulf transshipment','+ gateway']],
    s2:'Behind the breakwaters, four container terminals work the world\'s biggest ships around the clock — <b>ship-to-shore cranes</b>, automated and conventional yards, and a free zone immediately landward so a box can be unloaded, processed and re-exported without leaving the estate. DP World keeps the <b>handling fee</b> on every move, plus the value of the logistics around it. Drag the levers; this is a large, efficient operator geared to global trade.',
    driverLab:'Handling / TEU', availLab:'Reefer &amp; special', hrK:'Handling value /hr', yrS:'handling + free-zone logistics',
    preset:'Load Jebel Ali',
    try:'<b>Try this:</b> Jebel Ali is part gateway, part <b>transshipment hub</b> — a big slice of its boxes are switched between deep-sea services and never enter the UAE. That volume is efficient and high, but footloose: it follows the shipping alliances. The free-zone cargo, by contrast, is sticky — which is the strategic point of bolting a port to a free zone.',
    s3:'Jebel Ali earns a <b>handling tariff</b> on every container, at the scale of one of the world\'s busiest ports, plus the <b>logistics and free-zone</b> value that DP World layers on top — warehousing, customs, distribution. The hub volume is price-competitive and re-routable; the <b>free-zone and gateway</b> volume is stickier and higher-value. The blend, at 15.5m TEU, throws off a large, dollar-denominated cash flow — and underpins a chunk of Dubai\'s GDP.',
    mb:{tag:'Model B · hub operator', title:'State-linked global operator', body:'A government-linked operator runs a mega-hub at scale, keeping the handling fee and the logistics value, and using the port strategically to anchor a trade and free-zone economy. Commercially strong and dollar-denominated, but exposed to <b>hub competition and geopolitics</b>, with lighter disclosure since going private. <b>This is Jebel Ali</b> — DP World, owned by the Government of Dubai.'},
    s4a:'At this scale the operator\'s costs are large and largely variable — the labour, power and equipment to move 15&nbsp;million boxes — but the efficiency of a purpose-built mega-terminal keeps the cost per move low, and the free-zone logistics carry a high margin. The result is a strong operating margin on a very large revenue base.',
    wfNote:'Operating cost is the labour, power and equipment to handle the boxes, scaling with throughput, plus the upkeep of an enormous artificial harbour. Scale and automation keep the unit cost low; the free-zone logistics layer lifts the blended margin.',
    s4b:'The capital is vast: an entirely artificial harbour, four terminals, and <b>Terminal&nbsp;4</b> under construction on reclaimed land to lift capacity toward <b>22m TEU</b>. As a DP World asset it is funded on the group\'s balance sheet — the group earns ~$5.5bn of EBITDA across its global network — and Jebel Ali is its single most important node.',
    stackH:'The capital stack · mega-terminal', splitL:'Ownership', splitR:'state-linked',
    split:[['s1',100,'DP World — Government of Dubai']],
    finList:[['','DP World group revenue (2024)','$20.0bn'],['sub','Group adjusted EBITDA','$5.5bn (27%)'],['','Jebel Ali capacity','~19.4M TEU'],['sub','Terminal 4 (reclaimed island)','toward ~22M TEU'],['','Taken private (PFZW, 2020)','~$2.7bn float'],['rest','JAFZA free zone trade (2024)','$190bn']],
    finNote:'Jebel Ali is the rare port that is <b>both a profit centre and a piece of statecraft</b>: it earns a large commercial return, and it underpins Dubai\'s entire trade-and-logistics model. The flip side of state ownership is lighter disclosure and a strategic, rather than purely financial, owner.',
    timeline:[['1979','<b>Jebel Ali Port opens</b> — built as an artificial harbour.'],['1985','<b>JAFZA free zone established</b> behind the port.'],['2005','<b>DP World formed</b> from Dubai\'s port entities.'],['2007','<b>DP World IPO</b> on Nasdaq Dubai — then the largest ME listing.'],['2020','<b>Taken private</b> by Port & Free Zone World.'],['2024','<b>15.5m TEU</b> — highest since 2015; group revenue $20bn.']],
    calcNote:'A working model calibrated to a <b>large hub operator</b>. The tax rate is low (the UAE introduced a 9% corporate tax only recently), which lifts the return, and the revenue is throughput-linked with a free-zone logistics layer captured in ancillary income. A prime, dollar-denominated operator earns a strong unlevered return.',
    s6:'Jebel Ali is scale, efficiency and strategy combined. What drives the return:',
    breakers:['<b>Hub competition</b> — Jeddah, Khalifa, Salalah and Hamad fight for the same switchable Gulf transshipment.','<b>Geopolitics</b> — Red Sea and Hormuz disruption can both help (rerouting) and threaten (closure) the flows.','<b>The free-zone flywheel</b> — JAFZA cargo is the sticky, high-value volume that a pure hub cannot replicate.','<b>Capex &amp; automation</b> — Terminal 4 and continued automation set future capacity and unit cost.'],
    src:'Figures from public sources: <a href="https://www.dpworld.com/" target="_blank" rel="noopener">DP World FY2024 results</a>, reporting on <a href="https://en.wikipedia.org/wiki/Port_of_Jebel_Ali" target="_blank" rel="noopener">Jebel Ali</a> volumes and the 2020 take-private, and JAFZA trade releases. Jebel Ali standalone revenue and EBITDA are illustrative estimates split from group figures.',
    econ:{cur:'US$',premMult:1.4,anc:200,fixed:0,
      capDef:15500000,capMin:8000000,capMax:25000000,capStep:100000,
      tariffDef:150,tariffMin:70,tariffMax:260,tariffStep:2,
      premDef:12,premMin:4,premMax:30},
    opex:{labour:55,equip:200,concession:0,admin:160},
    calc:{build:15000,grant:0,capex:5,revG:3,floor:800,cap:3500,tax:9,exit:11,lev:5,rd:5,amort:2,hold:25},
    map:{ labels:[['ARABIAN GULF',72,262,'sea'],['BREAKWATER',150,92,'seafaint'],['JEBEL ALI',640,110,'land'],['JAFZA FREE ZONE',636,300,'feat'],['TERMINAL 4',636,430,'feat']],
      footer:'World\'s largest man-made harbour · DP World · JAFZA free zone behind' }
  },

  /* ---------- 6 · SHANGHAI (China · state-owned automated mega-port) ---------- */
  shanghai:{
    name:'Port of Shanghai', geo:'Yangshan, China', continent:'China', cur:'¥', geoKey:'shanghai',
    lede:'The busiest port on earth — the first ever to cross <b>50&nbsp;million TEU</b> in a year — and a showcase of state-owned scale and full automation at Yangshan.',
    s1:'<p class="body">No port moves more. In 2024 the <b>Port of Shanghai</b>, run by <b>SIPG</b> (Shanghai International Port Group), handled <b>51.5&nbsp;million TEU</b> — the first port in history to pass 50&nbsp;million in a single year, and world number one for fifteen straight years.</p>'+
       '<p class="body">Its crown jewel is <b>Yangshan</b>, a deep-water terminal built on reclaimed offshore islands and linked to the mainland by the 32.5&nbsp;km <b>Donghai Bridge</b>. Yangshan\'s Phase&nbsp;IV is the world\'s largest fully <b>automated</b> terminal — driverless cranes and AGVs under AI control. SIPG is <b>state-owned but stock-market listed</b>: majority-held by Shanghai\'s government, with minority public shareholders, and highly profitable.</p>',
    facts:[['51.5M TEU','Throughput (2024)','world #1, first past 50M'],['¥38.1 bn','Revenue (2024)','SIPG group'],['¥15.0 bn','Net profit','+13% YoY'],['2017','Yangshan Phase IV','largest automated terminal'],['32.5 km','Donghai Bridge','to offshore islands'],['SSE-listed','SIPG','state majority']],
    s2:'Out at Yangshan the terminal runs itself: <b>automated cranes</b> lift boxes from the ship to <b>driverless AGVs</b> that thread the yard, all coordinated by software, around the clock. The deep water takes the largest vessels afloat. SIPG keeps the <b>handling fee</b> on every one of 50&nbsp;million-plus boxes, plus a large business in port logistics and services. Drag the levers; at this scale even a small per-box fee compounds into an enormous cash flow.',
    driverLab:'Handling / TEU', availLab:'Reefer &amp; special', hrK:'Handling value /hr', yrS:'handling + port services',
    preset:'Load the Port of Shanghai',
    try:'<b>Try this:</b> the per-box handling fee in China is <b>low</b> — a fraction of a Western terminal\'s — yet the revenue is vast, because the volume is unmatched. Scale, not price, is the model. Push throughput toward 60&nbsp;million and watch the cash flow: this is what owning the world\'s busiest gateway looks like.',
    s3:'Shanghai earns a <b>handling tariff</b> on every move — modest per box by global standards, set in a regulated, competitive Chinese market — but multiplied by the largest container volume on earth. On top sits a substantial business in <b>port logistics, bulk and services</b>. The model is <b>scale and efficiency</b>: automation at Yangshan drives the unit cost down, and sheer throughput turns a thin per-box fee into ~¥38&nbsp;billion of revenue and ~¥15&nbsp;billion of net profit.',
    mb:{tag:'Model B · state-owned scale', title:'Listed state mega-operator', body:'A state-controlled but stock-listed operator runs the world\'s busiest port at vast scale, earning a thin per-box fee across enormous volume and reinvesting in automation. Strategically backed and highly profitable, but tied to <b>Chinese trade</b> and to a state majority owner. <b>This is SIPG</b> — Shanghai\'s government majority, with minority public shareholders.'},
    s4a:'At 50&nbsp;million boxes the costs are immense in absolute terms — labour, power and equipment — but Yangshan\'s automation pushes the cost per move to among the lowest anywhere. Across the group\'s revenue base the operating margin is healthy, and the scale makes even small efficiency gains worth a fortune.',
    wfNote:'Operating cost is the labour, power and equipment to handle an unmatched box volume, plus the upkeep of an offshore island terminal and a 32.5 km bridge. Automation holds the unit cost down; at this scale a cent per box is material.',
    s4b:'The capital is on a national scale: deep-water reclamation, the Donghai Bridge, and <b>Yangshan Phase&nbsp;IV</b> (~¥13.9bn / ~US$2.2bn for the automated terminal alone). It is funded on SIPG\'s listed, state-backed balance sheet — which can mobilise capital at a scale and cost of capital few operators can match.',
    stackH:'The capital base · SIPG group', splitL:'Ownership', splitR:'state-listed',
    split:[['s1',44,'Shanghai SASAC ~44%'],['s2',56,'Other &amp; public shareholders']],
    finList:[['','SIPG revenue (2024)','¥38.1bn'],['sub','Net profit','¥15.0bn (+13%)'],['','Yangshan Phase IV (automated)','~¥13.9bn'],['sub','2,350 m quay · 7 deep-water berths','AGVs + AI'],['','Donghai Bridge (2005)','32.5 km'],['rest','World #1 throughput','15 years running']],
    finNote:'SIPG is a <b>state asset that also answers to the market</b>: listed, profitable and dividend-paying, but majority-owned by Shanghai\'s government and strategically central to Chinese trade. The thin per-box fee is more than offset by unrivalled scale — and by a cost of capital that state backing keeps low.',
    timeline:[['2003','<b>SIPG established</b> from the Shanghai Port Authority.'],['2005','<b>Yangshan Phase I + Donghai Bridge</b> open — deep water offshore.'],['2006','<b>SIPG lists</b> on the Shanghai Stock Exchange.'],['2010','<b>Shanghai overtakes Singapore</b> as world #1.'],['2017','<b>Yangshan Phase IV</b> — the largest automated terminal — opens.'],['2024','<b>51.5m TEU</b> — first port ever past 50m in a year.']],
    calcNote:'A working model calibrated to a <b>state-owned operator at scale</b>, on an enterprise-value basis. The per-box fee is low but the volume is vast, and a large port-services business is captured as ancillary income. State backing supports a low cost of debt; the result is a solid return on an enormous base.',
    s6:'Shanghai is scale as a strategy: the world\'s busiest gateway, automated, and state-backed. What drives the return:',
    breakers:['<b>Chinese trade</b> — earnings are geared to China\'s exports; tariffs, reshoring and the cycle swing volume.','<b>Automation</b> — Yangshan\'s driverless terminal sets the unit-cost and capacity frontier.','<b>State ownership</b> — stability and cheap capital, but policy direction and minority-alignment risk.','<b>Concentration</b> — the earnings rest on a single, vast container complex and its cyclicality.'],
    src:'Figures from public sources: <a href="https://en.portshanghai.com.cn/" target="_blank" rel="noopener">SIPG</a> results and throughput releases, <a href="https://english.news.cn/" target="_blank" rel="noopener">Xinhua</a> on the 50m TEU record, and reporting on <a href="https://en.wikipedia.org/wiki/Yangshan_Port" target="_blank" rel="noopener">Yangshan Phase IV</a>. Some figures rest on secondary sourcing and are approximate.',
    econ:{cur:'¥',premMult:1.3,anc:17000,fixed:0,
      capDef:51500000,capMin:25000000,capMax:60000000,capStep:500000,
      tariffDef:370,tariffMin:200,tariffMax:600,tariffStep:5,
      premDef:8,premMin:2,premMax:20},
    opex:{labour:250,equip:2500,concession:0,admin:2100},
    calc:{build:130000,grant:0,capex:5,revG:3,floor:12000,cap:60000,tax:25,exit:9,lev:3,rd:4,amort:2,hold:25},
    map:{ labels:[['HANGZHOU BAY',110,180,'sea'],['GREATER YANGSHAN',418,424,'land'],['LESSER YANGSHAN',214,348,'feat'],['DONGHAI BRIDGE',598,286,'seafaint'],['SHANGHAI',705,180,'feat'],['MAINLAND',705,360,'land']],
      footer:'State-owned automated mega-port · offshore Yangshan island · 32.5 km Donghai Bridge' }
  }
  };
  var ORDER=['rotterdam','la','cartagena','melbourne','jebelali','shanghai'];

  /* ===================================================================
     HARBOUR SCENE RENDERER  (canvas, 720x520 scene coords)
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function polyPath(a){ ctx.beginPath(); for(var i=0;i<a.length;i++){ i?ctx.lineTo(a[i][0],a[i][1]):ctx.moveTo(a[i][0],a[i][1]); } ctx.closePath(); }

  var BOXCOLS=['#b0392f','#246a86','#2f7d54','#c0902f','#7a8088','#3a4048','#9c5a2a','#4a6f8a'];
  function boxCol(i){ return BOXCOLS[((i%BOXCOLS.length)+BOXCOLS.length)%BOXCOLS.length]; }
  var LSTY={ land:['rgba(70,90,80,0.7)','700 12px Inter,sans-serif'],
            feat:['rgba(70,92,82,0.66)','600 9px Inter,sans-serif'],
            sea:['rgba(70,110,150,0.5)','italic 600 12px "Source Serif 4",Georgia,serif'],
            seafaint:['rgba(70,110,150,0.34)','italic 600 10px "Source Serif 4",Georgia,serif'] };

  function drawSea(){
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#e1eef6'); g.addColorStop(0.55,'#cfe5f0'); g.addColorStop(1,'#b9d8e8');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.save();
    for(var i=0;i<5;i++){ var yy=((T*0.22+i*150)%(H+260))-130;
      var lg=ctx.createLinearGradient(0,yy,0,yy+90);
      lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(0.5,'rgba(255,255,255,0.15)'); lg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=lg; ctx.fillRect(0,yy,W,90); }
    ctx.strokeStyle='rgba(118,162,198,0.11)'; ctx.lineWidth=1;
    for(var j=0;j<9;j++){ var ly=26+j*((H-30)/9), off=(T*0.6+j*33)%48;
      ctx.beginPath(); for(var x=-off;x<W;x+=48){ ctx.moveTo(x,ly+Math.sin((x+T)*0.02)*2.2); ctx.lineTo(x+22,ly+Math.sin((x+22+T)*0.02)*2.2); } ctx.stroke(); }
    ctx.restore();
  }
  function drawLand(G){
    (G.land||[]).forEach(function(p){
      ctx.save(); ctx.shadowColor='rgba(20,42,32,0.22)'; ctx.shadowBlur=15; ctx.shadowOffsetY=4;
      polyPath(p);
      var lg=ctx.createLinearGradient(0,0,0,H); lg.addColorStop(0,'#eceee8'); lg.addColorStop(1,'#dfe3dc');
      ctx.fillStyle=lg; ctx.fill(); ctx.restore();
      polyPath(p); ctx.strokeStyle='rgba(96,114,104,0.45)'; ctx.lineWidth=1.1; ctx.stroke();
      polyPath(p); ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=0.6; ctx.stroke();
    });
  }
  function drawBreakwaters(G){
    (G.breakwaters||[]).forEach(function(b){
      ctx.save(); ctx.lineCap='round';
      ctx.strokeStyle='rgba(20,32,29,0.18)'; ctx.lineWidth=b[4]+4; ctx.beginPath(); ctx.moveTo(b[0],b[1]); ctx.lineTo(b[2],b[3]); ctx.stroke();
      ctx.strokeStyle='#b9bcb4'; ctx.lineWidth=b[4]; ctx.beginPath(); ctx.moveTo(b[0],b[1]); ctx.lineTo(b[2],b[3]); ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(b[0],b[1]); ctx.lineTo(b[2],b[3]); ctx.stroke();
      ctx.restore();
    });
  }
  function drawBridge(G){
    if(!G.bridge) return; var b=G.bridge;
    ctx.save(); ctx.lineCap='round';
    ctx.strokeStyle='rgba(20,32,29,0.16)'; ctx.lineWidth=7; ctx.beginPath(); ctx.moveTo(b[0][0],b[0][1]); ctx.lineTo(b[1][0],b[1][1]); ctx.stroke();
    ctx.strokeStyle='#3a4048'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(b[0][0],b[0][1]); ctx.lineTo(b[1][0],b[1][1]); ctx.stroke();
    for(var x=b[0][0]+10;x<b[1][0];x+=18){ ctx.strokeStyle='rgba(40,60,55,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x,b[0][1]-3); ctx.lineTo(x,b[0][1]+3); ctx.stroke(); }
    ctx.restore();
  }
  function drawQuay(G){
    ctx.save();
    ctx.strokeStyle='rgba(20,32,29,0.16)'; ctx.lineWidth=9; ctx.beginPath(); ctx.moveTo(G.quayX,G.quayTop); ctx.lineTo(G.quayX,G.quayBot); ctx.stroke();
    ctx.strokeStyle='#54606a'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(G.quayX,G.quayTop); ctx.lineTo(G.quayX,G.quayBot); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(G.quayX+2.4,G.quayTop); ctx.lineTo(G.quayX+2.4,G.quayBot); ctx.stroke();
    ctx.fillStyle='#3c454c'; for(var y=G.quayTop+8;y<G.quayBot;y+=20){ ctx.beginPath(); ctx.arc(G.quayX-2,y,2,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
  function drawYard(G,util){
    var Y=G.yard; if(!Y) return;
    // apron / paved terminal
    ctx.fillStyle='#d6d8d2'; rr(Y.x-6,Y.y-6,Y.w+12,Y.h+12,4); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.4)'; ctx.lineWidth=1; ctx.stroke();
    // container stacks grouped into blocks with service lanes between
    var gap=2, bw=11, bh=7, cols=Math.floor(Y.w/(bw+gap)), rows=Math.floor(Y.h/(bh+gap));
    var fill=0.5+0.45*util;
    for(var r=0;r<rows;r++){ if(r%5===4) continue;            // cross service lanes
      for(var c=0;c<cols;c++){ if(c%7===6) continue;          // longitudinal lanes
        var seed=(r*73+c*131+(G.quayX|0))%100;
        if(seed/100 > fill) continue;
        var x=Y.x+c*(bw+gap), y=Y.y+r*(bh+gap);
        ctx.fillStyle=boxCol(r*7+c*3); ctx.globalAlpha=0.86; rr(x,y,bw,bh,1.2); ctx.fill();
        ctx.globalAlpha=0.25; ctx.fillStyle='rgba(255,255,255,1)'; rr(x,y,bw,2,1); ctx.fill();
        ctx.globalAlpha=1;
      } }
    // yard gantries (RTG) sliding over the blocks
    var rtgN=Math.max(1,Math.round(util*3));
    for(var k=0;k<rtgN;k++){
      var ry=Y.y+12+((k+0.5)/rtgN)*Y.h*0.9;
      var rx=Y.x+ (0.5+0.5*Math.sin(T*0.012+k*2))*Y.w;
      ctx.save(); ctx.strokeStyle='rgba(60,72,80,0.85)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(rx-9,ry-7); ctx.lineTo(rx-9,ry+7); ctx.moveTo(rx+9,ry-7); ctx.lineTo(rx+9,ry+7); ctx.moveTo(rx-9,ry-7); ctx.lineTo(rx+9,ry-7); ctx.stroke();
      ctx.fillStyle='#c0902f'; rr(rx-3,ry-3,6,5,1); ctx.fill(); ctx.restore();
    }
  }
  /* a gate + haul road on the outer land, with trucks leaving for the hinterland */
  function drawGateRoad(G,util){
    var Y=G.yard; if(!Y) return;
    var x0=Y.x+Y.w+4, x1=(G.roadEnd||706), ry=Y.y+Y.h*0.52;
    if(x1-x0<30) return;
    ctx.save();
    ctx.strokeStyle='#3a4048'; ctx.lineWidth=8; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x0,ry); ctx.lineTo(x1,ry); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.setLineDash([4,5]); ctx.lineDashOffset=-(T*0.8); ctx.beginPath(); ctx.moveTo(x0,ry); ctx.lineTo(x1,ry); ctx.stroke(); ctx.setLineDash([]);
    // gate posts near the yard
    ctx.fillStyle='#0c6b4f'; rr(x0-1,ry-12,3,8,1); ctx.fill(); rr(x0-1,ry+4,3,8,1); ctx.fill();
    // trucks hauling boxes out
    var nT=Math.max(1,Math.round(util*3));
    for(var i=0;i<nT;i++){ var p=((T*0.004*(0.6+util)+i/nT)%1); var tx=x0+(x1-x0)*p, ty=ry+(i%2?3:-3);
      ctx.fillStyle='#454c52'; rr(tx-5,ty-2.4,10,4.8,1); ctx.fill();
      ctx.fillStyle=boxCol(i*3+2); rr(tx-3,ty-1.8,6,3.6,0.8); ctx.fill(); }
    ctx.restore();
  }
  /* container vessel, top-down, bow toward +y in local frame */
  function vessel(cx,cy,len,wid,ang,seed,alpha){
    ctx.save(); ctx.globalAlpha=(alpha==null?1:alpha); ctx.translate(cx,cy); ctx.rotate(ang);
    ctx.fillStyle='rgba(0,0,0,0.16)'; rr(-wid/2+1.5,-len/2+3,wid,len,wid*0.4); ctx.fill();   // shadow
    // hull with a tapered bow
    ctx.beginPath();
    ctx.moveTo(0,-len/2);
    ctx.lineTo(wid/2,-len/2+wid*0.7);
    ctx.lineTo(wid/2,len/2-3); ctx.quadraticCurveTo(wid/2,len/2,wid/2-3,len/2);
    ctx.lineTo(-wid/2+3,len/2); ctx.quadraticCurveTo(-wid/2,len/2,-wid/2,len/2-3);
    ctx.lineTo(-wid/2,-len/2+wid*0.7); ctx.closePath();
    ctx.fillStyle='#33414b'; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.15)'; ctx.lineWidth=0.8; ctx.stroke();
    // container stacks on deck
    var cols=2, cbw=(wid-6)/cols, rows=Math.floor((len-wid)/5);
    for(var r=0;r<rows;r++) for(var c=0;c<cols;c++){
      ctx.fillStyle=boxCol(seed+r*3+c*5); ctx.globalAlpha=0.9;
      rr(-wid/2+3+c*cbw, -len/2+wid*0.7+r*5, cbw-1.4, 4, 0.8); ctx.fill();
    }
    ctx.globalAlpha=(alpha==null?1:alpha);
    // superstructure near stern
    ctx.fillStyle='#aeb8c0'; rr(-wid/2+2,len/2-9,wid-4,6,1); ctx.fill();
    ctx.restore();
  }
  /* ship-to-shore gantry crane: trolley picks a box at the ship, carries it to the
     landside, drops it (into the yard), then returns empty — a clear directional move */
  function gantryCrane(qx,cy,reach,phase,speed){
    var legBack=qx+14, tipX=qx-reach;
    ctx.save();
    ctx.strokeStyle='#6b7680'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(qx-2,cy-9); ctx.lineTo(qx-2,cy+9); ctx.moveTo(legBack,cy-9); ctx.lineTo(legBack,cy+9); ctx.stroke();
    ctx.strokeStyle='#7d8893'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.moveTo(legBack,cy-7); ctx.lineTo(tipX,cy-7); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(legBack,cy-8.4); ctx.lineTo(tipX,cy-8.4); ctx.stroke();
    var ph=(T*speed+phase)%(Math.PI*2);
    var u=(1-Math.cos(ph))/2;                         // 0 = ship side, 1 = landside, and back
    var tx=tipX+(legBack-tipX)*u;
    var carrying = ph<Math.PI;                         // box only on the ship→land leg
    ctx.strokeStyle='rgba(40,50,55,0.6)'; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.moveTo(tx,cy-7); ctx.lineTo(tx,cy-(carrying?1.5:5)); ctx.stroke();
    if(carrying){ ctx.fillStyle=boxCol((phase*7+(cy|0))|0); rr(tx-3.2,cy-2.4,6.4,4,1); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.25)'; rr(tx-3.2,cy-2.4,6.4,1.3,0.6); ctx.fill(); }
    ctx.fillStyle='#2b3338'; rr(tx-2.2,cy-8.6,4.4,3.2,1); ctx.fill();
    ctx.restore();
    return {drop:(ph>Math.PI-0.18 && ph<Math.PI+0.18), x:legBack+2, y:cy};
  }
  function tug(x,y,ang){
    ctx.save(); ctx.translate(x,y); ctx.rotate(ang);
    ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.moveTo(-5,0); ctx.lineTo(-18,-3); ctx.lineTo(-18,3); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#b0392f'; rr(-6,-3,12,6,2); ctx.fill();
    ctx.fillStyle='#e8ebee'; rr(-1,-2,4,4,1); ctx.fill();
    ctx.restore();
  }
  function spawnCoin(x,y){ if(coins.length<46) coins.push({x:x+rnd(-5,5),y:y-2,vy:-0.55-Math.random()*0.45,life:1}); }
  function drawCoins(){
    for(var i=coins.length-1;i>=0;i--){ var c=coins[i];
      if(_anim){ c.y+=c.vy; c.vy*=0.985; c.life-=0.02; }
      if(c.life<=0){ coins.splice(i,1); continue; }
      ctx.save(); ctx.globalAlpha=Math.max(0,Math.min(1,c.life));
      var g=ctx.createRadialGradient(c.x-1,c.y-1,0,c.x,c.y,4); g.addColorStop(0,'#fbe9a0'); g.addColorStop(1,'#d6a528');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,3.1,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(140,92,22,0.55)'; ctx.lineWidth=0.7; ctx.stroke(); ctx.restore(); }
  }
  function drawChannelBuoys(G){
    var y=G.channelY||300;
    for(var x=24;x<G.quayX-130;x+=70){ var blink=(Math.sin(T*0.05+x)>0.6);
      ctx.fillStyle = ((x/70)|0)%2 ? '#2f7d54' : '#b0392f';
      ctx.globalAlpha=blink?1:0.7; ctx.beginPath(); ctx.arc(x,y-22+((x/70|0)%2?44:0),3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
  }
  /* inland waterways / dredged basins drawn as sea on top of the land (rivers, fingers) */
  function drawWater(G){
    (G.water||[]).forEach(function(p){
      polyPath(p); var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#cfe5f0'); g.addColorStop(1,'#bcdcea');
      ctx.fillStyle=g; ctx.fill();
      polyPath(p); ctx.strokeStyle='rgba(96,128,150,0.35)'; ctx.lineWidth=1; ctx.stroke();
    });
  }

  /* ---- ship traffic: visible arrivals, berthing and departures ---- */
  function posOnPath(path,d){
    var total=0,i; for(i=1;i<path.length;i++) total+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);
    var acc=0;
    for(i=1;i<path.length;i++){ var a=path[i-1],b=path[i], L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;
      if(d<=acc+L || i===path.length-1){ var f=Math.max(0,Math.min(1,(d-acc)/L));
        return {x:a[0]+(b[0]-a[0])*f, y:a[1]+(b[1]-a[1])*f, ang:Math.atan2(b[0]-a[0],-(b[1]-a[1])), seg:i, frac:f, total:total}; }
      acc+=L; }
    return {x:path[path.length-1][0],y:path[path.length-1][1],ang:0,seg:path.length-1,frac:1,total:total};
  }
  function berthPt(G,i){ return [G.quayX-18, G.berths[i]]; }
  function spawnArr(G,i){ var b=berthPt(G,i), cy=G.channelY||300;
    transit.push({kind:'arr',berth:i,d:0,speed:rnd(0.9,1.3),len:rnd(50,70),wid:21,seed:(i*5+3)|0,
      path:[[-72,cy],[G.quayX-90,cy],[b[0],b[1]]],x:-72,y:cy,ang:Math.PI/2}); }
  function spawnDep(G,i){ var b=berthPt(G,i), cy=G.channelY||300; berthFill[i]=false;
    transit.push({kind:'dep',berth:i,d:0,speed:rnd(0.9,1.3),len:rnd(50,70),wid:21,seed:(i*5+3)|0,
      path:[[b[0],b[1]],[G.quayX-90,cy],[-72,cy]],x:b[0],y:b[1],ang:0}); }
  function hasArr(i){ return transit.some(function(t){return t.kind==='arr'&&t.berth===i;}); }
  function hasDep(i){ return transit.some(function(t){return t.kind==='dep'&&t.berth===i;}); }
  function pickFree(G){ var c=[]; for(var i=0;i<G.berths.length;i++) if(!berthFill[i]&&!hasArr(i)) c.push(i); return c.length?c[(Math.random()*c.length)|0]:-1; }
  function pickOcc(G){ var c=[]; for(var i=0;i<G.berths.length;i++) if(berthFill[i]&&!hasDep(i)) c.push(i); return c.length?c[(Math.random()*c.length)|0]:-1; }
  function updateTransit(){
    transit.forEach(function(t){ t.d+=t.speed;
      var r=posOnPath(t.path,t.d); t.x=r.x; t.y=r.y;
      var head=r.ang, last=t.path.length-1;
      if(t.kind==='arr' && r.seg===last) head=lerpA(r.ang,0,r.frac);     // swing into the berth (face north)
      if(t.kind==='dep' && r.seg===1)   head=lerpA(0,r.ang,r.frac);      // pull out of the berth
      t.ang=head;
      if(t.d>=r.total){ if(t.kind==='arr') berthFill[t.berth]=true; t.done=true; }
    });
    transit=transit.filter(function(t){return !t.done;});
  }
  function drawTransit(G){
    transit.forEach(function(t){
      var a=Math.max(0,Math.min(1,(t.x+64)/36));                         // fade in/out at the sea edge
      vessel(t.x,t.y,t.len,t.wid,t.ang,t.seed,a);
      if(t.x>G.quayX-150 && t.x<G.quayX-10){                             // a tug nudging alongside
        tug(t.x-16, t.y+13, t.kind==='arr'?0.25:Math.PI-0.25);
      }
    });
  }

  /* ===================================================================
     FRAME
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var G=GEO[A.geoKey], M=A.map, E=A.econ;
    var cap=parseFloat(sCap.value), tariff=parseFloat(sSpread.value), prem=parseFloat(sAvail.value)/100;
    var util=Math.max(0.06,Math.min(1,(cap-E.capMin)/(E.capMax-E.capMin)));

    ctx.clearRect(0,0,W,H);
    drawSea();
    drawBreakwaters(G);
    drawBridge(G);
    drawLand(G);
    drawWater(G);
    drawChannelBuoys(G);
    drawYard(G,util);
    drawGateRoad(G,util);
    drawQuay(G);

    // ---- ship traffic: schedule arrivals / departures toward the throughput target ----
    var berths=G.berths||[];
    if(berthFill.length!==berths.length){ berthFill=berths.map(function(_,i){ return i<Math.max(1,Math.round(util*berths.length)); }); }
    var target=Math.max(1,Math.min(berths.length,Math.round(util*berths.length)));
    var occ=0; for(var bi=0;bi<berths.length;bi++) if(berthFill[bi]) occ++;
    var effective=occ + transit.filter(function(t){return t.kind==='arr';}).length - transit.filter(function(t){return t.kind==='dep';}).length;
    if(_anim){ schedT--;
      if(schedT<=0){
        if(effective<target){ var fi=pickFree(G); if(fi>=0){ spawnArr(G,fi); schedT=rnd(55,130); } else schedT=40; }
        else if(effective>target){ var oi=pickOcc(G); if(oi>=0){ spawnDep(G,oi); schedT=rnd(55,130); } else schedT=40; }
        else { if(occ>0 && Math.random()<0.6){ var ci2=pickOcc(G); if(ci2>=0) spawnDep(G,ci2); } schedT=rnd(120,260); }
      }
      updateTransit();
    }

    // berthed ships + working cranes
    var cranesPer=2+Math.round(util*2), cspeed=0.05*(0.6+util);
    var shipLen=Math.min(70,(G.quayBot-G.quayTop)/Math.max(berths.length,1)-6);
    var reach=42;
    for(var b2=0;b2<berths.length;b2++){ if(!berthFill[b2]) continue; var by=berths[b2];
      vessel(G.quayX-18, by, shipLen, 22, 0, b2*4+2, 1);
      for(var ci=0;ci<cranesPer;ci++){
        var cy=by-shipLen*0.34 + (cranesPer>1? ci/(cranesPer-1)*shipLen*0.68 : 0);
        var cr=gantryCrane(G.quayX, cy, reach, b2*1.7+ci*2.1, cspeed);
        if(_anim && cr.drop && Math.random()<0.5) spawnCoin(cr.x+4, cr.y-6);
      }
    }
    // arrivals / departures sailing the channel, with tugs
    drawTransit(G);
    drawCoins();

    // labels last, with a backing plate over the busy terminal
    M.labels.forEach(function(l){ var st=LSTY[l[3]]||LSTY.land;
      ctx.save(); ctx.font=st[1]; ctx.textAlign='center';
      if(l[3]==='land'){ var w=ctx.measureText(l[0]).width;
        ctx.fillStyle='rgba(255,255,255,0.7)'; rr(l[1]-w/2-5,l[2]-10,w+10,15,4); ctx.fill(); }
      ctx.shadowColor='rgba(255,255,255,0.7)'; ctx.shadowBlur=3; ctx.fillStyle=st[0];
      ctx.fillText(l[0],l[1],l[2]+1); ctx.restore(); });

    // compass + caption + vignette
    ctx.save(); ctx.translate(W-30,34); ctx.strokeStyle='#5a6b76'; ctx.fillStyle='#5a6b76'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,-9); ctx.lineTo(0,8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(-3.5,-5); ctx.lineTo(3.5,-5); ctx.closePath(); ctx.fill();
    ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('N',0,18); ctx.restore();
    ctx.save(); ctx.shadowColor='rgba(255,255,255,0.65)'; ctx.shadowBlur=3;
    ctx.fillStyle='rgba(40,60,80,0.6)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(M.footer)+' · '+fmtTEU(cap),W/2,H-11); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.45,W/2,H/2,H*0.96);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.15)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- economics (annual) ----
    var local=cap*(1-prem), premV=cap*prem;
    var handle=local*tariff + premV*tariff*E.premMult;
    var grossRev=handle + (E.anc||0)*1e6 + (E.fixed||0)*1e6;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e12)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var O=A.opex;
    var c_labour=O.labour*cap, c_equip=O.equip*1e6, c_conc=(O.concession||0)*revenue, c_admin=O.admin*1e6;
    var opex=c_labour+c_equip+c_conc+c_admin, ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;

    set('ixCapV',fmtTEU(cap)); set('ixSpreadV',fmtTariff(tariff)); set('ixAvailV',Math.round(prem*100)+'%');
    set('ixDir',fmtTEU(cap)); set('ixDirS',Math.round(prem*100)+'% reefer / special');
    set('ixMW',Math.round(cap/HRS).toLocaleString()+' /hr'); set('ixMWs','average boxes per hour');
    set('ixHr', revenue<=0?CUR+'0 / hr':money(revenue/HRS)+' / hr');
    set('ixYr', revenue<=0?CUR+'0':'≈ '+money(revenue));

    drawWaterfall(revenue, [['Labour &amp; handling',c_labour],['Equipment &amp; upkeep',c_equip],['Concession / lease fee',c_conc],['Admin &amp; insurance',c_admin]], ebitda);
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
    var gR=gv('iRevG')/100, capexP=gv('iCapex')/100, daP=0.03, tax=gv('iTax')/100;
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the margin is too thin to value against the capital — raise the yield or the throughput.</span>'; return; }
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
    A=ASSETS[key]; CUR=A.cur; coins=[]; transit=[]; berthFill=[];
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
    sSpread.min=E.tariffMin; sSpread.max=E.tariffMax; sSpread.step=E.tariffStep; sSpread.value=E.tariffDef;
    sAvail.min=E.premMin; sAvail.max=E.premMax; sAvail.value=E.premDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue uses a stylised blended yield and the returns model is a simplified DCF; not a forecast of any specific year\'s trade, and not investment advice.');
    frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.capDef; sSpread.value=E.tariffDef; sAvail.value=E.premDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'rotterdam');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
