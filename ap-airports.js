/* Airports, data-driven worked examples.
   Six real airports, one template. Airfield scene geometry from ap-geo.js (GEO),
   drawn top-down in 720x520 scene coordinates. The interactive figures are
   illustrative: revenue uses a stylised aero + commercial per-passenger build and
   the returns model is a simplified DCF. */
(function(){
  var OPHRS=6570;                 // ~18 operating hours x 365 days (for per-hour figures)
  var CUR='£';
  var A=null;
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;
  var coins=[], transit=[], standFill=[], standTurn=[], schedT=0, _anim=false;
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
  function fmtPax(v){ return v>=1e6?(v/1e6).toFixed(1)+'m pax':(v/1e3).toFixed(0)+'k pax'; }
  function fmtCharge(v){ var s=(Math.abs(v)<10)?(Math.round(v*10)/10).toString():Math.round(v).toString(); return CUR+s; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · HEATHROW (Europe · RAB-regulated single-till monopoly) ---------- */
  heathrow:{
    name:'London Heathrow', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'heathrow',
    lede:'Western Europe\'s busiest hub and the textbook <b>RAB-regulated monopoly</b>, a privately-owned airport whose charges are set by an economic regulator on a single-till basis.',
    s1:'<p class="body">An airport is really <b>two businesses sharing one site</b>. The <b>aeronautical</b> business charges airlines to land, park and process passengers, a near-monopoly, and so regulated. The <b>commercial</b> business, retail, food &amp; beverage, car parking, property and advertising, is unregulated, higher-margin, and the place where value is created.</p>'+
       '<p class="body"><b>Heathrow</b> handled <b>83.9&nbsp;million passengers</b> in 2024 across two close-parallel runways that run at ~98% full. Its charges are capped by the <b>Civil Aviation Authority</b> under a <b>Regulatory Asset Base (RAB)</b> model: the CAA sets an allowed return on a ~£20&nbsp;billion asset base, and, crucially, on a <b>single till</b>, so the airport\'s commercial profits are netted off against what it can charge airlines. It is owned by a consortium of long-horizon infrastructure investors.</p>',
    facts:[['83.9m','Passengers (2024)','record; runways ~98% full'],['£3.6bn','Revenue (2024)','aero + commercial'],['~£2.0bn','EBITDA','≈56% margin'],['~£20bn','Regulatory Asset Base','CAA-set return'],['2','Runways','close parallels, capacity-constrained'],['Single till','Regulation','commercial nets off aero']],
    s2:'Watch the airfield. Aircraft land on the active runway, taxi in and park nose-in at a contact stand; passengers flow through the terminal to the kerb, the car park and the rail link. Two streams of cash rise from the scene: <b style="color:#0c6b4f">green</b> aeronautical income from every aircraft and passenger, and <b style="color:#c0902f">gold</b> commercial income from the terminal and car park. At Heathrow the regulator caps the green and lets the gold run, but on a single till, so even the gold ultimately feeds back into the price control.',
    driverLab:'Aero charge / pax', availLab:'Commercial / pax', hrK:'Revenue / hour', yrS:'aero + commercial',
    preset:'Load London Heathrow',
    try:'<b>Try this:</b> lift the <b>commercial / pax</b> slider, duty-free, parking and food are the real profit engine of an airport, far higher margin than the regulated aero charge. But note the single-till twist: at Heathrow, growing the gold till lets the CAA <i>lower</i> the aero charge, so the passenger benefits as much as the shareholder. Under a <b>dual till</b> (Dubai, Sydney) the airport keeps that commercial upside.',
    s3:'Heathrow earns a <b>regulated aeronautical charge</b> per passenger (landing, parking and passenger-service fees) set by the CAA, plus a large <b>unregulated commercial</b> business, the busiest airport retail in Europe, plus parking, property and a rail premium. Because the UK uses a <b>single till</b>, the commercial profits are assumed to subsidise the aero charge, keeping headline fees lower than a dual-till airport would. The investor question is the allowed return (WACC) on the RAB, traffic recovery, and the capex programme.',
    mb:{tag:'Model B · RAB-regulated', title:'Privatised regulated monopoly', body:'A privately-owned monopoly airport whose aeronautical charges are capped by an economic regulator on a <b>Regulatory Asset Base</b>, an allowed return on invested capital, reset every five years. Stable and inflation-linked, but the return is effectively dialled by the regulator, and a <b>single till</b> shares commercial upside with passengers. <b>This is Heathrow</b>, CAA-regulated, ~£20bn RAB.'},
    s4a:'An airport\'s costs are heavy and largely <b>fixed</b>: a vast estate of runways, terminals, baggage systems and security to run whether the planes are full or not. Staff and security scale with passengers; airfield and terminal maintenance and overhead barely move. That operating leverage is the whole story, a near-full Heathrow converts a high share of marginal revenue into EBITDA, but an empty one bleeds.',
    wfNote:'Operating cost is dominated by staff and security (which scale with passengers) plus the standing upkeep of an enormous fixed estate. High operating leverage means the margin swings hard with traffic, which is exactly why the 2020–21 collapse and the 2024 record both mattered so much.',
    s4b:'The capital base is the <b>£20&nbsp;billion RAB</b>, runways, five terminals, baggage and surface access built up over decades and financed on an investment-grade, highly-geared balance sheet. The CAA allows a return on that base; the owners fund expansion (and the long-debated third runway) against it. At ~10× EBITDA the enterprise is worth roughly its RAB, which is the point of RAB regulation: value tracks the asset base, not the traffic cycle.',
    stackH:'The capital base · ~£20bn RAB', splitL:'Ownership', splitR:'consortium',
    split:[['s1',60,'Ardian · Saudi PIF · Qatar · GIC · others'],['s2',40,'Investment-grade debt']],
    finList:[['','Regulatory Asset Base','~£20bn'],['sub','CAA price control (H7)','allowed WACC × RAB'],['','2024 revenue','£3.6bn'],['sub','· aeronautical (regulated)','single till'],['sub','· retail, parking, property','higher margin'],['rest','Third-runway expansion','long-debated capex']],
    finNote:'A RAB-regulated airport is a <b>bond-like infrastructure asset</b>: the regulator sets an allowed return on the asset base, so the equity return is steady and geared, but capped. The debate is always the <b>WACC the CAA allows</b>, how fast traffic recovers, and whether a £15bn+ third runway earns its keep.',
    timeline:[['1946','<b>Heathrow opens</b> to civil aviation.'],['1987','<b>BAA privatised</b> by the UK government.'],['2006','<b>Ferrovial-led consortium</b> acquires BAA.'],['2008','<b>Terminal 5 opens</b>, £4.3bn, the largest free-standing UK building.'],['2024','<b>83.9m passengers</b>, a record; Ferrovial sells its 25% stake.'],['2025','<b>Third-runway expansion</b> revived in policy debate.']],
    calcNote:'A working model calibrated to a <b>RAB-regulated monopoly</b>. The entry/exit multiples sit near the RAB (≈10× EBITDA), the revenue floor is high (regulation + a captive hub make the cash flow stable), and leverage is heavy, exactly the profile of a core, regulated European airport. The return is reliable but capped by the allowed WACC.',
    s6:'Heathrow is the clearest case of an airport as a <b>regulated utility with a retail mall attached</b>. What moves the return:',
    breakers:['<b>The allowed WACC</b>, the CAA\'s cost-of-capital decision at each price control is the single biggest lever on equity returns.','<b>Traffic &amp; capacity</b>, two full runways cap volume; the third-runway question governs the long-run growth (and capex risk).','<b>Single vs dual till</b>, how much commercial upside the airport keeps versus hands back to airlines.','<b>Leverage &amp; rates</b>, a highly-geared RAB asset is sensitive to the cost and availability of debt.'],
    src:'Figures from the airport, regulator and public sources: <a href="https://www.heathrow.com/company/investor-centre" target="_blank" rel="noopener">Heathrow investor centre</a> and 2024 traffic/financial releases, the <a href="https://www.caa.co.uk/" target="_blank" rel="noopener">CAA H7 price control</a>, and reporting on the 2024 ownership changes. The RAB and single-till framework are as described by the CAA; some figures are approximate.',
    econ:{cur:'£',anc:150,paxPerAtm:175,
      paxDef:83900000,paxMin:40000000,paxMax:95000000,paxStep:100000,
      aeroDef:25,aeroMin:8,aeroMax:45,aeroStep:1,
      commDef:16,commMin:4,commMax:35,commStep:1},
    opex:{ops:10,sec:4,maint:250,admin:170},
    calc:{build:20000,grant:0,capex:12,revG:3,floor:2800,cap:5000,tax:25,exit:10,lev:7,rd:5,amort:1,hold:25},
    map:{ footer:GEO.heathrow.footer }
  },

  /* ---------- 2 · ATLANTA (North America · city-owned, residual model) ---------- */
  atlanta:{
    name:'Hartsfield–Jackson Atlanta', geo:'Georgia, USA', continent:'North America', cur:'US$', geoKey:'atlanta',
    lede:'The world\'s busiest airport by passengers, and a <b>city-owned</b> public enterprise, not a private asset: it runs at cost recovery, funded by airline agreements and tax-exempt bonds.',
    s1:'<p class="body"><b>Hartsfield–Jackson</b> handled <b>108.1&nbsp;million passengers</b> in 2024, the busiest airport on earth for most of the last quarter-century. Its <b>five parallel runways</b> and a compact hub-and-spoke layout make it the most efficient connecting machine in aviation, and the fortress hub of <b>Delta Air Lines</b>.</p>'+
       '<p class="body">But the investment lens is completely different from Heathrow\'s. Atlanta is owned and run by the <b>City of Atlanta\'s Department of Aviation</b>. There is no equity and no profit motive: charges are set by a <b>residual airline-use agreement</b> to recover just enough to cover costs and debt service, topped up by federal <b>Passenger Facility Charges</b> and funded with <b>tax-exempt revenue bonds</b>. The "return" is civic, connectivity and jobs, not a hurdle rate.</p>',
    facts:[['108.1m','Passengers (2024)','world #1'],['City of Atlanta','Owner','Dept of Aviation'],['5','Runways','parallel, high-capacity'],['Delta','Fortress hub','~75% of traffic'],['$4.50','PFC per pax','federal cap'],['Residual','Airline agreement','cost-recovery charges']],
    s2:'The scene is the same, land, taxi, turn the aircraft round, board, depart, but the cash works differently. Under a <b>residual</b> agreement the airlines collectively guarantee the airport breaks even, so the <b style="color:#0c6b4f">green</b> aero charge is whatever\'s left to recover costs, and it is <b>low</b> per passenger. The <b style="color:#c0902f">gold</b> commercial income (concessions, the world\'s busiest airport parking) reduces what the airlines owe. Drag the levers: a public airport optimises for low cost, not profit.',
    driverLab:'Aero charge / pax', availLab:'Commercial / pax', hrK:'Revenue / hour', yrS:'to the City of Atlanta',
    preset:'Load Atlanta',
    try:'<b>Try this:</b> push the aero charge down and the commercial up, that\'s the residual US model in a nutshell. Low landing fees keep Delta\'s fortress hub cheap to operate; concession and parking income covers the rest and is shared back with the airlines. For a private investor it\'s mostly a benchmark: a prime US hub <i>would</i> be enormously valuable, but the city isn\'t selling.',
    s3:'Atlanta\'s aeronautical charges are set to <b>recover cost and debt service</b>, not to earn a margin, so per-passenger fees are far below a privatised European or Asian hub. The big commercial lines, concessions and the world\'s busiest airport <b>parking</b> operation, flow into the same till and reduce the net airline bill. As a city enterprise it is also <b>tax-exempt</b>, which flatters any return you try to impute, and it funds capital from bonds and federal grants rather than equity.',
    mb:{tag:'Model B · municipal', title:'City-owned residual airport', body:'A public airport run by a city department at <b>cost recovery</b>: a residual airline-use agreement guarantees break-even, charges are low, and capital comes from tax-exempt revenue bonds and federal grants, not equity. Stable and strategically vital, but the objective is civic, not a return. <b>This is Atlanta</b>, owned by the City, the world\'s busiest, Delta\'s fortress hub.'},
    s4a:'A hub this size is a large fixed plant, five runways, a domestic terminal and four concourses, a people-mover, the world\'s biggest parking operation. Staff and security scale with the 108m passengers; the airfield and facilities are mostly fixed. As a cost-recovery enterprise the "margin" is really the surplus over operating cost that services the bonds and funds reinvestment.',
    wfNote:'Operating cost is staff, security and the upkeep of an enormous fixed plant. Because charges are set residually to recover exactly this (plus debt service), the airport runs lean; any surplus is recycled into capital, not distributed.',
    s4b:'Capital is funded with <b>tax-exempt revenue bonds</b> secured on airport charges, plus <b>PFCs</b> and federal AIP grants, never city taxes and never equity. Atlanta\'s multi-billion-dollar capital programme (concourse extensions, a new runway rehab, the ATL Next plan) is paid this way, which keeps a strong, investment-grade credit and a low cost of capital.',
    stackH:'The capital base · public enterprise', splitL:'Ownership', splitR:'municipal',
    split:[['s1',100,'City of Atlanta, Department of Aviation']],
    finList:[['','Owner','City of Atlanta'],['','Funding','tax-exempt revenue bonds'],['sub','Passenger Facility Charge','$4.50 / pax (federal cap)'],['sub','Federal AIP grants','capital top-up'],['','ATL Next capital programme','multi-$bn'],['rest','Surplus','recycled, no dividend']],
    finNote:'A US hub is a <b>credit, not an equity</b>: investors buy the revenue bonds, not the airport. The residual agreement and a near-monopoly hub make the bonds very safe, which is why the cost of capital is low, but there is no private upside to capture, only a benchmark of what a prime gateway is worth.',
    timeline:[['1925','<b>Candler Field</b> established on an old racetrack.'],['1980','<b>Maynard H. Jackson terminal</b> opens, the modern midfield hub.'],['1998','<b>Becomes the world\'s busiest</b> airport by passengers.'],['2006','<b>Fifth runway</b> opens, lifting capacity.'],['2012','<b>Maynard H. Jackson Jr. International Terminal</b> opens.'],['2024','<b>108.1m passengers</b>, reclaims the world #1 spot.']],
    calcNote:'A working model on a <b>city-owned residual airport</b>. Note the <b>zero tax</b> (a municipal enterprise is tax-exempt) and the <b>low aero charge</b>, the model imputes what a private owner <i>would</i> earn, which is mostly academic since the City is not selling. Leverage is modest and debt is cheap, reflecting investment-grade revenue bonds.',
    s6:'Atlanta shows an airport as <b>civic infrastructure</b> run at cost, vital, vast, and not for sale. The variables that decide its economics:',
    breakers:['<b>The airline agreement</b>, residual (break-even, airline-aligned) versus compensatory (airport keeps the upside) sets who bears risk and reward.','<b>Hub concentration</b>, ~75% Delta means the hub\'s fate is tied to one carrier\'s network strategy.','<b>PFCs &amp; grants</b>, the federal funding toolkit, and any change to the PFC cap, drives the capital programme.','<b>Connectivity, not profit</b>, the objective function is jobs and access, which caps how "investable" it ever becomes.'],
    src:'Figures from the airport and public sources: <a href="https://www.atl.com/about-atl/" target="_blank" rel="noopener">Hartsfield–Jackson facts</a>, City of Atlanta Department of Aviation budget and bond disclosure, and FAA/ACI traffic data. Revenue and EBITDA are illustrative estimates framed on a cost-recovery basis, not audited private accounts.',
    econ:{cur:'US$',anc:60,paxPerAtm:150,
      paxDef:108100000,paxMin:50000000,paxMax:115000000,paxStep:100000,
      aeroDef:4,aeroMin:1,aeroMax:12,aeroStep:0.5,
      commDef:2.5,commMin:1,commMax:10,commStep:0.5},
    opex:{ops:1.6,sec:0.9,maint:40,admin:33},
    calc:{build:4500,grant:0,capex:12,revG:2,floor:450,cap:1500,tax:0,exit:10,lev:4,rd:4.5,amort:2,hold:25},
    map:{ footer:GEO.atlanta.footer }
  },

  /* ---------- 3 · LIMA (South America · privatised Fraport concession) ---------- */
  lima:{
    name:'Lima Jorge Chávez', geo:'Peru', continent:'South America', cur:'US$', geoKey:'lima',
    lede:'The Andean gateway and a textbook <b>privatised concession</b>, a private operator builds and runs the airport for a fixed term under a regulated tariff, then hands it back.',
    s1:'<p class="body"><b>Jorge Chávez International</b> is Peru\'s primary gateway and one of South America\'s busiest, handling roughly <b>24&nbsp;million passengers</b> a year. In 2025 it opened an entirely <b>new terminal and a second runway</b>, a multi-billion-dollar expansion that roughly doubles capacity.</p>'+
       '<p class="body">It is run by <b>Lima Airport Partners</b>, a <b>Fraport</b>-led consortium, under a <b>concession</b> won in 2001: the operator finances, builds and runs the airport for a fixed term and keeps the revenue, but its aeronautical tariffs are <b>regulated by OSITRAN</b> and it hands the asset back at expiry. This is the emerging-market concession model, private efficiency and capital, a regulated tariff, and real country and currency risk layered on top.</p>',
    facts:[['~24m','Passengers','Peru\'s main gateway'],['2001','Concession won','Fraport-led'],['2025','New terminal + 2nd runway','capacity ~doubled'],['$2bn+','Expansion','privately financed'],['OSITRAN','Regulator','tariff-setting'],['USD','Tariffs','dollar-denominated']],
    s2:'The airfield runs as everywhere, land, taxi, turn round, depart, but on a brand-new second runway and into a brand-new terminal. The operator keeps the <b style="color:#0c6b4f">aeronautical</b> tariff (regulated, USD-denominated) and the <b style="color:#c0902f">commercial</b> income from a much-expanded retail and parking offer. Drag the levers: a greenfield expansion is a bet that traffic fills the new capacity fast enough to earn back $2bn of build cost over the concession.',
    driverLab:'Aero tariff / pax', availLab:'Commercial / pax', hrK:'Revenue / hour', yrS:'a regulated concession',
    preset:'Load Lima',
    try:'<b>Try this:</b> the commercial slider matters more after the expansion, a bigger, better terminal sells far more retail per passenger. But the whole case rests on <b>traffic growth filling new capacity</b>: push passengers up toward 30m+ and the returns on the $2bn build improve fast; leave them flat and a half-empty new terminal drags. That ramp risk, plus the sol and Peruvian rates, is the EM concession bet.',
    s3:'Lima earns a <b>regulated aeronautical tariff</b> per passenger (set in dollars, reviewed by OSITRAN) plus growing <b>commercial</b> income from the new terminal\'s retail, food and parking. The concession structure means the operator takes <b>construction and traffic risk</b> in exchange for the cash flows for a fixed term, so the return depends on building to budget, ramping traffic into the new capacity, and the tariff the regulator allows.',
    mb:{tag:'Model B · concession', title:'Privatised airport concession', body:'A private operator wins a fixed-term concession to <b>finance, build and run</b> an airport under a regulated tariff, taking construction and traffic risk and handing the asset back at expiry. Returns track traffic growth and build discipline, geared to an emerging market, with real <b>currency and country risk</b>. <b>This is Lima</b>, a Fraport-led concession with a new 2025 terminal and runway.'},
    s4a:'A greenfield expansion front-loads the cost: the build is enormous, and once open the new terminal and runway are a large fixed plant to operate even before the traffic arrives. Staff and handling scale with passengers; the airfield and a shiny new terminal are fixed. Until the ramp fills the capacity, the margin is thinner than a mature hub\'s.',
    wfNote:'Operating cost is staff, security and the upkeep of a brand-new, larger plant. The expansion adds fixed cost immediately but traffic ramps over years, so the margin is depressed at opening and improves as the new capacity fills.',
    s4b:'The <b>$2bn+ expansion</b>, a new terminal and Peru\'s second parallel runway, is financed privately by the Fraport-led consortium against the concession cash flows and long-dated debt. Modelled on an enterprise-value basis, the return is a <b>high-nominal emerging-market</b> one, carried against Peruvian rates and the sol, with the build cost as the entry capital.',
    stackH:'The capital stack · concession EV', splitL:'Ownership', splitR:'private',
    split:[['s1',60,'Long-dated debt'],['s2',40,'Fraport-led sponsor equity']],
    finList:[['','Concession won','2001 (Fraport-led)'],['','New terminal + 2nd runway','opened 2025'],['sub','Expansion capital','$2bn+'],['sub','Capacity after expansion','~30m+ pax'],['','Regulator','OSITRAN (USD tariff)'],['rest','Financials','privately held, illustrative']],
    finNote:'A greenfield concession is a <b>build-and-ramp equity play</b>: get the construction and the traffic ramp right and the returns are strong, because the regulated tariff plus a bigger commercial offer compounds on a growing base. The catch is doing $2bn of construction on time and filling it, all priced in soles against Peruvian country risk.',
    timeline:[['1965','<b>Jorge Chávez</b> opens as Peru\'s main airport.'],['2001','<b>Lima Airport Partners</b> (Fraport-led) wins the concession.'],['2009','<b>Concession extended</b>; commercial revenues grow.'],['2023','<b>Second runway</b> enters service.'],['2025','<b>New terminal opens</b>, capacity roughly doubled.'],['2025+','<b>Traffic ramp</b> into the new capacity begins.']],
    calcNote:'A working model calibrated to an <b>emerging-market concession</b>, on an enterprise-value basis. The build cost is the $2bn+ expansion, growth is high (a traffic ramp into new capacity), the floor is low (no regulated guarantee on volume), and the cost of debt is high to reflect Peruvian rates. A strong nominal return nets down once discounted like an EM asset.',
    s6:'Lima is the purest emerging-market concession here: private build-and-operate, a regulated tariff, and a fresh expansion to fill. What drives it:',
    breakers:['<b>Traffic ramp</b>, filling the new terminal and runway is the central bet; the build cost is sunk, the volume is not.','<b>The OSITRAN tariff</b>, the regulated aeronautical charge, and its periodic review, set the aero ceiling.','<b>Construction risk</b>, delivering a $2bn expansion on time and on budget is where concessions are won or lost.','<b>Country &amp; currency</b>, Peruvian rates and the sol, more than any technical factor, set the discount rate.'],
    src:'Figures from public sources: <a href="https://www.lima-airport.com/eng" target="_blank" rel="noopener">Lima Airport Partners</a> and Fraport disclosure, <a href="https://www.ositran.gob.pe/" target="_blank" rel="noopener">OSITRAN</a> tariff material, and reporting on the 2023 runway and 2025 terminal openings. The concession is privately held; revenue and EBITDA are illustrative estimates.',
    econ:{cur:'US$',anc:30,paxPerAtm:110,
      paxDef:24000000,paxMin:8000000,paxMax:35000000,paxStep:100000,
      aeroDef:14,aeroMin:5,aeroMax:30,aeroStep:1,
      commDef:8,commMin:3,commMax:22,commStep:1},
    opex:{ops:6,sec:2,maint:50,admin:38},
    calc:{build:2100,grant:0,capex:8,revG:4,floor:150,cap:900,tax:30,exit:9,lev:4,rd:8.5,amort:4,hold:25},
    map:{ footer:GEO.lima.footer }
  },

  /* ---------- 4 · SYDNEY (Oceania · privatised, light-handed, infra-fund) ---------- */
  sydney:{
    name:'Sydney Airport', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'sydney',
    lede:'Australia\'s primary gateway and a landmark of infrastructure investing, taken private in 2022 for <b>A$23.6&nbsp;billion</b> by a fund consortium, under light-handed regulation.',
    s1:'<p class="body"><b>Sydney Airport</b> is Australia\'s busiest, handling roughly <b>41&nbsp;million passengers</b> a year across three runways, two parallels and an east-west cross runway, on a constrained site beside Botany Bay, under a curfew and an 80-movements-per-hour cap.</p>'+
       '<p class="body">In 2022 it was <b>taken private</b> for <b>A$23.6&nbsp;billion</b>, one of the largest deals in the region\'s history, by the <b>Sydney Aviation Alliance</b>: IFM Investors, AustralianSuper, Global Infrastructure Partners, QSuper and UniSuper. Unlike Heathrow it is <b>lightly regulated</b>: the ACCC <b>monitors</b> prices rather than capping them, and the airport keeps its commercial upside on a <b>dual till</b>. The investment case is the classic one, a monopoly gateway with long-duration, growing, inflation-linked cash flow, and the debate is simply the price paid.</p>',
    facts:[['~41m','Passengers','Australia\'s #1'],['A$23.6bn','2022 take-private','Sydney Aviation Alliance'],['3','Runways','two parallels + cross'],['ACCC','Regulation','price monitoring (light-handed)'],['Dual till','Model','keeps commercial upside'],['2026','Western Sydney opens','a second airport']],
    s2:'The airfield works like any other, land, taxi, turn round, depart, but on a curfew-bound, slot-constrained site, so every movement is precious. As a <b>dual-till</b> airport, Sydney keeps both the <b style="color:#0c6b4f">aeronautical</b> charge and the full <b style="color:#c0902f">commercial</b> upside (some of the best retail and parking yields in the world). Drag the levers, the stable, monopoly cash flow underneath is what an infrastructure fund pays a 20-plus multiple for; the question is the price.',
    driverLab:'Aero charge / pax', availLab:'Commercial / pax', hrK:'Revenue / hour', yrS:'rent of a monopoly gateway',
    preset:'Load Sydney Airport',
    try:'<b>Try this:</b> Sydney runs at a very high <b>EBITDA margin</b>, it keeps both tills and its commercial yields are world-class. But push the exit multiple in the model and watch how much of the return is simply the price paid and assumed on the way out. At A$23.6bn for an airport earning ~A$1.3bn of EBITDA, you bought a wonderful asset, at a wonderful-asset price.',
    s3:'Sydney earns an <b>aeronautical charge</b> per passenger, negotiated with airlines under ACCC <b>price monitoring</b> rather than a hard cap, plus a large, high-margin <b>commercial</b> business it keeps in full under the dual till. The slot and curfew constraints make it a near-perfect monopoly for the basin\'s traffic, which is exactly what long-horizon capital wants: a stable, inflation-linked, modestly growing cash flow. The wildcard is the <b>second airport</b> at Western Sydney opening in 2026.',
    mb:{tag:'Model B · light-handed', title:'Privatised dual-till monopoly', body:'A privatised monopoly airport under <b>light-handed regulation</b>, the regulator monitors prices rather than capping them, and a <b>dual till</b> lets the airport keep its commercial upside. Low-risk, long-duration, inflation-linked, world-class commercial yields, the infrastructure-fund staple. <b>This is Sydney</b>, taken private for A$23.6bn by IFM, AustralianSuper, GIP and others.'},
    s4a:'On a constrained site Sydney runs lean and very profitable, among the highest EBITDA margins of any large airport, because it keeps both tills and the commercial yields are exceptional. Staff and security scale with passengers; the fixed estate is comparatively small for the revenue. The real "cost" in the investment case is not opex at all, it is the <b>A$23.6bn entry price</b> and what it implies for the return.',
    wfNote:'Operating cost is staff, security and the upkeep of a compact, constrained estate, modest against a very large, dual-till revenue base. The margin is among the best in the sector; the determinant of the return is the price paid, not the running cost.',
    s4b:'The headline is the <b>A$23.6&nbsp;billion</b> 2022 take-private, funded by the consortium with equity from its pension and infrastructure members and long-dated debt against the stable cash flow. At that price the airport changed hands at a rich multiple, which is the whole debate: a brilliant monopoly asset, bought when long-duration capital was paying peak prices for exactly this kind of cash flow.',
    stackH:'The capital stack · A$23.6bn deal', splitL:'Sydney Aviation Alliance', splitR:'ownership',
    split:[['s1',55,'IFM · AustralianSuper · GIP · QSuper · UniSuper'],['s2',45,'Long-dated debt']],
    finList:[['','2022 take-private','A$23.6bn'],['sub','Sydney Aviation Alliance','pension + infra funds'],['','Regulation','ACCC price monitoring'],['sub','Till','dual (keeps commercial)'],['','Constraints','curfew · 80 movements/hr cap'],['rest','Western Sydney Airport','opens 2026']],
    finNote:'A$23.6bn for an airport earning ~A$1.3bn of EBITDA is an <b>18–20× multiple</b>, the price of a long-duration, inflation-linked monopoly to the lowest-cost, longest-horizon capital on earth. The return is unspectacular but reliable; the risks are overpaying and the new Western Sydney airport eroding the monopoly.',
    timeline:[['1920','<b>Mascot aerodrome</b> established.'],['2002','<b>Privatised</b>, Macquarie-led Southern Cross consortium, 99-year lease.'],['2013','<b>Dual-till light-handed</b> framework entrenched under ACCC monitoring.'],['2021','<b>A$23.6bn takeover</b> agreed by the Sydney Aviation Alliance.'],['2022','<b>Taken private</b>, delisted from the ASX.'],['2026','<b>Western Sydney Airport</b> due to open, the monopoly question.']],
    calcNote:'A working model calibrated to a <b>privatised, light-handed monopoly</b>. The entry price (A$23.6bn) is the build/entry input and the hold is long, so the return is driven by the <b>price paid</b>, the commercial growth and the exit multiple far more than by year-to-year volume. This is what buying an airport monopoly at the top of the market looks like.',
    s6:'Sydney is the infrastructure-fund archetype: a long, lightly-regulated, dual-till monopoly bought at a full price. The levers that decide it:',
    breakers:['<b>The price paid</b>, at ~18–20× EBITDA, the entry and exit multiples dominate the return.','<b>Dual-till commercial</b>, keeping world-class retail and parking yields is where the value compounds.','<b>Western Sydney</b>, a second airport from 2026 is the live threat to the monopoly and the terminal value.','<b>Curfew &amp; slots</b>, the movement cap constrains growth but also entrenches the scarcity that makes it valuable.'],
    src:'Figures from public sources: <a href="https://www.sydneyairport.com.au/corporate" target="_blank" rel="noopener">Sydney Airport</a> historical disclosure, the <a href="https://www.accc.gov.au/" target="_blank" rel="noopener">ACCC airport monitoring reports</a>, and the 2021–22 takeover announcements from IFM, AustralianSuper and GIP. The airport is now privately held; revenue and EBITDA are illustrative estimates.',
    econ:{cur:'A$',anc:60,paxPerAtm:120,
      paxDef:41000000,paxMin:20000000,paxMax:50000000,paxStep:100000,
      aeroDef:18,aeroMin:6,aeroMax:40,aeroStep:1,
      commDef:23,commMin:6,commMax:45,commStep:1},
    opex:{ops:6,sec:1.5,maint:40,admin:35},
    calc:{build:30000,grant:0,capex:12,revG:4,floor:800,cap:2500,tax:30,exit:22,lev:8,rd:5,amort:1,hold:40},
    map:{ footer:GEO.sydney.footer }
  },

  /* ---------- 5 · DUBAI (Middle East · government-owned strategic hub) ---------- */
  dubai:{
    name:'Dubai International (DXB)', geo:'Dubai, UAE', continent:'Middle East', cur:'US$', geoKey:'dubai',
    lede:'The world\'s busiest international airport and the engine of Dubai\'s economy, a <b>government-owned strategic hub</b> fused to Emirates, with a vast commercial till.',
    s1:'<p class="body"><b>Dubai International</b> handled a record <b>92.3&nbsp;million passengers</b> in 2024, the world\'s <b>busiest airport for international traffic</b>, across two parallel runways and three terminals, with Terminal 3 built for and dominated by <b>Emirates</b>.</p>'+
       '<p class="body">DXB is owned by the <b>Government of Dubai</b> and operated by <b>Dubai Airports</b>. It is both a commercial powerhouse and a piece of statecraft: the physical foundation of Dubai\'s position as a global connecting hub and a duty-free shopping capital (<b>Dubai Duty Free</b> alone turns over ~$2bn). It is run on a <b>dual till</b>, keeps its enormous commercial upside, and is being prepared for an eventual move to the new <b>Al Maktoum</b> mega-airport.</p>',
    facts:[['92.3m','Passengers (2024)','world #1 international'],['Govt of Dubai','Owner','Dubai Airports'],['2','Runways','two parallels'],['Emirates','Anchor hub','T3 dedicated'],['~$2bn','Dubai Duty Free','sales'],['Al Maktoum','Future hub','$35bn, ~260m capacity']],
    s2:'The airfield is one of the most intensively used on earth, two runways turning over widebodies around the clock. As a <b>dual-till</b> hub, Dubai keeps both the <b style="color:#0c6b4f">aeronautical</b> charge and a <b style="color:#c0902f">commercial</b> till that is among the largest in aviation (the world\'s top airport for duty-free sales). Drag the levers: the commercial slider does enormous work here, a connecting passenger with hours to spend is a retail goldmine.',
    driverLab:'Aero charge / pax', availLab:'Commercial / pax', hrK:'Revenue / hour', yrS:'hub + duty-free till',
    preset:'Load Dubai (DXB)',
    try:'<b>Try this:</b> crank the commercial / pax slider, Dubai is the clearest case where the <b>commercial till</b> rivals or beats the aero charge. A transfer hub fills the terminal with high-dwell connecting passengers, and Dubai Duty Free monetises them better than almost anyone. That retail flywheel, fused to Emirates\' network, is the strategic point of the whole airport.',
    s3:'Dubai earns an <b>aeronautical charge</b> per passenger at the scale of one of the world\'s busiest hubs, plus a <b>commercial</b> till, duty-free, food, lounges, parking and property, that is among the largest in the industry. The <b>dual till</b> means the airport keeps all of it. The model is <b>scale × connectivity × retail</b>: Emirates funnels global transfer traffic through DXB, and the airport monetises the dwell time. The earnings are large and dollar-denominated, and underpin a big slice of Dubai\'s GDP.',
    mb:{tag:'Model B · state hub', title:'Government-owned strategic hub', body:'A government-owned airport run as a strategic asset and a commercial powerhouse, keeping both tills and using the hub to anchor a trade, tourism and aviation economy. Commercially strong and dollar-denominated, but exposed to <b>hub competition and geopolitics</b>, with a state, not a financial, owner. <b>This is Dubai</b>, owned by the Government of Dubai, the world\'s busiest international airport.'},
    s4a:'Running the world\'s busiest international airport at near-capacity is expensive, the labour, security, energy and equipment to turn over widebodies around the clock, but the scale and the huge commercial till keep the blended margin strong. The two-runway site is worked harder than almost any on earth, which is exactly why the $35bn Al Maktoum move is being planned.',
    wfNote:'Operating cost is the staff, security and energy to handle 90m+ passengers on a constrained two-runway site, plus the upkeep of three large terminals. Scale keeps the unit cost down and the vast duty-free till lifts the blended margin well above a typical hub.',
    s4b:'DXB is funded by the <b>Government of Dubai</b> through Dubai Airports, and the strategic capital story is now the move to <b>Al Maktoum International</b>, a planned <b>$35&nbsp;billion</b> mega-airport with up to five runways and ~260m passenger capacity, intended to take over from DXB within roughly a decade. That is one of the largest single infrastructure commitments in aviation.',
    stackH:'The capital stack · state hub', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Government of Dubai, Dubai Airports']],
    finList:[['','Owner','Government of Dubai'],['','Operator','Dubai Airports'],['sub','Anchor carrier','Emirates (T3)'],['sub','Dubai Duty Free sales','~$2bn'],['','Al Maktoum mega-airport','$35bn'],['rest','Al Maktoum capacity','~260m pax']],
    finNote:'DXB is both a <b>profit centre and statecraft</b>: it earns a large commercial return and it underpins Dubai\'s entire aviation-and-tourism model. The flip side of state ownership is lighter disclosure and a strategic owner, and a once-in-a-generation capital bet on relocating the whole hub to Al Maktoum.',
    timeline:[['1960','<b>Dubai Airport opens</b> with a single runway.'],['2000','<b>Dubai Duty Free</b> and terminal expansion accelerate.'],['2008','<b>Terminal 3</b> opens, dedicated to Emirates, then the world\'s largest building by floor area.'],['2014','<b>Becomes the world\'s busiest</b> for international passengers.'],['2024','<b>92.3m passengers</b>, a new record.'],['2024+','<b>Al Maktoum</b> $35bn expansion approved, the future hub.']],
    calcNote:'A working model calibrated to a <b>large state hub</b>. The tax rate is low (the UAE introduced a 9% corporate tax only recently), the commercial till is huge (captured in a high commercial-per-pax), and the dual till lets the airport keep it all. A prime, dollar-denominated hub earns a strong unlevered return on a large base.',
    s6:'Dubai is scale, connectivity and retail fused into statecraft. What drives the return:',
    breakers:['<b>Emirates &amp; transfer traffic</b>, the hub\'s fortunes are tied to one carrier\'s global network and the connecting model.','<b>The commercial flywheel</b>, duty-free and retail yields on high-dwell passengers are the profit engine.','<b>Geopolitics</b>, Gulf and regional disruption can both help (rerouting) and threaten the flows.','<b>The Al Maktoum move</b>, a $35bn relocation is the defining capital decision and the long-run capacity story.'],
    src:'Figures from public sources: <a href="https://www.dubaiairports.ae/" target="_blank" rel="noopener">Dubai Airports</a> traffic releases, reporting on the 2024 record and the <a href="https://en.wikipedia.org/wiki/Al_Maktoum_International_Airport" target="_blank" rel="noopener">Al Maktoum</a> expansion, and Dubai Duty Free sales disclosure. DXB standalone revenue and EBITDA are illustrative estimates.',
    econ:{cur:'US$',anc:200,paxPerAtm:220,
      paxDef:92300000,paxMin:50000000,paxMax:100000000,paxStep:100000,
      aeroDef:12,aeroMin:4,aeroMax:28,aeroStep:1,
      commDef:18,commMin:5,commMax:38,commStep:1},
    opex:{ops:8,sec:2,maint:120,admin:100},
    calc:{build:21000,grant:0,capex:8,revG:3,floor:800,cap:4000,tax:9,exit:11,lev:5,rd:5,amort:2,hold:25},
    map:{ footer:GEO.dubai.footer }
  },

  /* ---------- 6 · BEIJING CAPITAL (China · listed state operator) ---------- */
  beijing:{
    name:'Beijing Capital (PEK)', geo:'Beijing, China', continent:'China', cur:'¥', geoKey:'beijing',
    lede:'China\'s flagship capital-city hub, a <b>state-controlled but stock-listed</b> operator, earning a thin regulated aero fee across vast volume plus a commercial leasing business.',
    s1:'<p class="body"><b>Beijing Capital International Airport</b> was for years the world\'s second-busiest, and it remains China\'s flagship hub, handling roughly <b>67&nbsp;million passengers</b> a year across three parallel runways and Terminal&nbsp;3, once the largest airport terminal on earth.</p>'+
       '<p class="body">It is operated by <b>Beijing Capital International Airport Co.</b>, which is <b>listed in Hong Kong</b> but <b>controlled by the state</b> (Capital Airports Holding). The model is the listed-state hybrid: aeronautical charges are <b>regulated by the CAAC</b> and thin per passenger, while a large <b>commercial leasing and franchise</b> business, retail, advertising, ground services, drives the profit. It also competes with Beijing\'s second mega-airport, <b>Daxing</b>, which opened in 2019.</p>',
    facts:[['~67m','Passengers','China\'s flagship hub'],['HK-listed','Operator','Beijing Capital Intl Airport Co (0694)'],['State','Control','Capital Airports Holding'],['3','Runways','parallel'],['T3','Terminal','once world\'s largest'],['Daxing','Competition','2nd Beijing mega-hub (2019)']],
    s2:'The airfield runs at vast scale across three runways into Terminal 3. The <b style="color:#0c6b4f">aeronautical</b> fee per passenger is <b>low</b>, set in a regulated Chinese framework, but multiplied by enormous volume; the <b style="color:#c0902f">commercial</b> till is a large leasing and franchise business (retail, advertising, ground services). Drag the levers: like the Chinese ports, the model is <b>scale over price</b>, a thin fee on a huge base.',
    driverLab:'Aero fee / pax', availLab:'Commercial / pax', hrK:'Revenue / hour', yrS:'aero fee + leasing',
    preset:'Load Beijing Capital',
    try:'<b>Try this:</b> the per-passenger aero fee in China is <b>low</b> by global standards, yet the revenue is large because the volume is vast and the commercial leasing till is substantial. Push the commercial slider, retail and advertising franchises in a 67m-passenger terminal are the real profit lever, just as duty-free is at Dubai, but on a regulated, state-controlled base.',
    s3:'Beijing earns a <b>regulated aeronautical fee</b> per passenger (modest, CAAC-set) multiplied by huge volume, plus a substantial <b>commercial</b> business, concession and leasing income from retail, advertising and ground-handling franchises. The model is <b>scale and leasing</b>: a thin per-passenger fee, an enormous base, and a high-margin commercial layer. The complication is <b>Daxing</b>, the second Beijing mega-airport, which split the capital\'s traffic from 2019.',
    mb:{tag:'Model B · listed state', title:'Listed state airport operator', body:'A state-controlled but stock-listed operator runs a flagship hub at vast scale, earning a thin regulated aero fee across enormous volume plus a high-margin commercial leasing business, and reinvesting under state direction. Strategically backed and profitable, but tied to <b>Chinese travel demand</b>, regulated fees and a state majority owner. <b>This is Beijing Capital</b>, HK-listed (0694), Capital Airports Holding control.'},
    s4a:'A hub this size is a large fixed plant, three runways and Terminal 3, one of the biggest buildings in the world. Staff, security and energy scale with passengers; the estate is fixed and the depreciation heavy. The EBITDA margin is healthy but lower than a duty-free-led Gulf hub, because the regulated aero fee is thin and Chinese airports carry large facilities.',
    wfNote:'Operating cost is staff, security, energy and the upkeep of an enormous terminal and three runways. The regulated aero fee is thin, so the margin leans on the commercial leasing till and on sheer scale to cover a large fixed-cost base.',
    s4b:'The capital is on a national scale, three runways and the vast Terminal 3 (built for the 2008 Olympics), funded on the listed company\'s state-backed balance sheet. State backing supports a low cost of capital and patient reinvestment; the strategic overhang is <b>Daxing</b>, the rival Beijing mega-airport that the state also controls and into which it has steered some traffic.',
    stackH:'The capital base · listed state co', splitL:'Ownership', splitR:'state-listed',
    split:[['s1',57,'Capital Airports Holding (state)'],['s2',43,'Public &amp; H-share holders']],
    finList:[['','Operator','Beijing Capital Intl Airport Co (0694.HK)'],['sub','Controlling shareholder','Capital Airports Holding'],['','Terminal 3 (2008)','once world\'s largest'],['sub','Runways','three parallel'],['','Aero fee','CAAC-regulated, thin'],['rest','Daxing','rival Beijing hub (2019)']],
    finNote:'A listed Chinese airport is a <b>state asset that also answers to the market</b>: listed and profitable, but majority state-controlled and strategically directed, including the decision to build a rival hub at Daxing. The thin regulated fee is offset by scale and a commercial leasing till, on a low, state-supported cost of capital.',
    timeline:[['1958','<b>Beijing Capital opens.</b>'],['2008','<b>Terminal 3</b> opens for the Olympics, then the world\'s largest terminal.'],['2008','<b>Listed company</b> operates the airport; H-shares in Hong Kong.'],['2019','<b>Daxing opens</b>, a second Beijing mega-airport splits traffic.'],['2020–22','<b>Traffic collapses</b> under China\'s travel restrictions.'],['2024','<b>~67m passengers</b> as domestic and international travel recover.']],
    calcNote:'A working model calibrated to a <b>listed state operator</b>, on an enterprise-value basis. The per-passenger aero fee is low but volume is vast, and a large commercial leasing business is captured in the commercial-per-pax. State backing supports a low cost of debt; the result is a solid return on a large base, with heavy depreciation.',
    s6:'Beijing is scale, regulation and state backing combined, with a self-inflicted rival next door. What drives the return:',
    breakers:['<b>Chinese travel demand</b>, earnings are geared to domestic and outbound Chinese travel and the recovery cycle.','<b>The regulated aero fee</b>, CAAC pricing sets a thin aeronautical ceiling; the commercial leasing till does the heavy lifting.','<b>Daxing</b>, the rival state-controlled mega-hub splits the capital\'s traffic and caps Beijing Capital\'s growth.','<b>State direction</b>, stability and cheap capital, but policy, not shareholders, sets the strategy.'],
    src:'Figures from public sources: <a href="https://www.bcia.com.cn/" target="_blank" rel="noopener">Beijing Capital International Airport</a> and the <a href="https://www1.hkexnews.hk/" target="_blank" rel="noopener">HKEX-listed company (0694)</a> disclosure, plus CAAC traffic data and reporting on Daxing. Some figures rest on secondary sourcing and are approximate.',
    econ:{cur:'¥',anc:600,paxPerAtm:130,
      paxDef:67000000,paxMin:30000000,paxMax:80000000,paxStep:100000,
      aeroDef:45,aeroMin:15,aeroMax:90,aeroStep:1,
      commDef:40,commMin:10,commMax:90,commStep:1},
    opex:{ops:28,sec:10,maint:450,admin:350},
    calc:{build:24000,grant:0,capex:6,revG:4,floor:1500,cap:9000,tax:25,exit:10,lev:3,rd:4,amort:2,hold:25},
    map:{ footer:GEO.beijing.footer }
  }
  };
  var ORDER=['heathrow','atlanta','lima','sydney','dubai','beijing'];

  /* ===================================================================
     AIRFIELD SCENE RENDERER  (canvas, 720x520 scene coords, north up)
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }

  /* fixed vertical strata (apply to every airport) */
  var APRON_Y=224, STAND_Y=288, TERM_Y=302, TERM_H=46, FORE_Y=360, ROAD_Y=398, CP_Y=414, CP_H=64;
  var EXIT_X=602;                       // runway high-speed exit (arrivals)
  var LIVERY=['#b0392f','#246a86','#2f7d54','#c0902f','#7a4f9c','#cc6a2a','#3a6ea5','#39786a'];
  var LSTY={ land:['rgba(60,80,70,0.82)','700 12px Inter,sans-serif'],
            feat:['rgba(70,92,82,0.7)','600 9px Inter,sans-serif'],
            sky:['rgba(70,110,150,0.5)','italic 600 12px "Source Serif 4",Georgia,serif'],
            skyfaint:['rgba(70,110,150,0.34)','italic 600 10px "Source Serif 4",Georgia,serif'] };

  function actRwy(G){ return G.runways[G.runways.length-1]; }      // lowest runway = active
  function standXs(G){ var n=G.nStands, x0=G.termX+24, x1=G.termX+G.termW-24, a=[];
    for(var i=0;i<n;i++) a.push(n>1? x0+(x1-x0)*i/(n-1) : (x0+x1)/2); return a; }

  /* ---- ground: airfield + paved apron ---- */
  function drawGround(){
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#dfe6df'); g.addColorStop(0.5,'#d7e0d8'); g.addColorStop(1,'#cdd8cf');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // faint grass striping on the airfield (north half)
    ctx.save(); ctx.strokeStyle='rgba(120,150,120,0.10)'; ctx.lineWidth=1;
    for(var y=18;y<APRON_Y-8;y+=15){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.restore();
    // paved apron slab around the stands + taxiways
    var ag=ctx.createLinearGradient(0,APRON_Y-20,0,FORE_Y);
    ag.addColorStop(0,'#c9cdc9'); ag.addColorStop(1,'#bcc2bd');
    ctx.fillStyle=ag; rr(20,APRON_Y-22,W-40,FORE_Y-(APRON_Y-22),10); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.4)'; ctx.lineWidth=1; ctx.stroke();
  }

  function drawRunway(rw,active){
    var y=rw[0],x0=rw[1],x1=rw[2];
    ctx.save();
    // asphalt
    ctx.shadowColor='rgba(20,30,28,0.18)'; ctx.shadowBlur=6; ctx.shadowOffsetY=2;
    rr(x0,y-11,x1-x0,22,4); var rg=ctx.createLinearGradient(0,y-11,0,y+11);
    rg.addColorStop(0,active?'#3b4047':'#41464d'); rg.addColorStop(0.5,active?'#33373d':'#3a3f45'); rg.addColorStop(1,active?'#2c3036':'#33373d');
    ctx.fillStyle=rg; ctx.fill(); ctx.restore();
    // threshold piano keys (left end)
    ctx.fillStyle='rgba(255,255,255,0.8)';
    for(var k=0;k<6;k++) ctx.fillRect(x0+5,y-8+k*2.9,16,1.7);
    // centreline dashes
    ctx.fillStyle='rgba(255,255,255,0.55)'; for(var x=x0+30;x<x1-10;x+=40) ctx.fillRect(x,y-1.2,24,2.4);
    // edge lights
    for(var lx=x0+6;lx<x1;lx+=46){ var bl=(Math.sin(T*0.06+lx)>0.4)?1:0.45;
      ctx.fillStyle='rgba(255,210,120,'+bl+')'; ctx.fillRect(lx,y-11,2,1.6); ctx.fillRect(lx,y+9.4,2,1.6); }
    // designation
    ctx.fillStyle='rgba(230,236,240,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText(rw[3],x0+26,y+3);
  }
  function drawCross(G){ if(!G.cross) return; var c=G.cross;
    ctx.save(); ctx.lineCap='round';
    ctx.strokeStyle='#3a3f45'; ctx.lineWidth=18; ctx.beginPath(); ctx.moveTo(c[0][0],c[0][1]); ctx.lineTo(c[1][0],c[1][1]); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.6; ctx.setLineDash([10,12]);
    ctx.beginPath(); ctx.moveTo(c[0][0],c[0][1]); ctx.lineTo(c[1][0],c[1][1]); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }
  /* ambient aircraft on the non-active runways (shows multi-runway capacity) */
  function drawAmbient(rw,seed){
    var span=(rw[2]-rw[1])+320, p=((T*0.7+seed*167)%span), x=rw[1]-160+p, prog=p/span;
    var alt = prog<0.55?0:(prog-0.55)/0.45;            // takeoff profile toward the right
    plane(x, rw[0]-alt*26, 0.82, Math.PI/2, LIVERY[seed%LIVERY.length], alt, false);
  }

  /* ---- taxiways: from runway exit down to apron, the apron lane, and the hold ---- */
  function drawTaxiways(G){
    var ay=actRwy(G)[0], x0=actRwy(G)[1];
    ctx.save();
    function tline(pts){ ctx.strokeStyle='#aab0ab'; ctx.lineWidth=9; ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.beginPath(); pts.forEach(function(p,i){ i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); }); ctx.stroke();
      ctx.strokeStyle='rgba(245,200,70,0.7)'; ctx.lineWidth=1; ctx.setLineDash([7,7]); ctx.lineDashOffset=-(T*0.6);
      ctx.beginPath(); pts.forEach(function(p,i){ i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); }); ctx.stroke(); ctx.setLineDash([]); }
    tline([[EXIT_X,ay],[EXIT_X,APRON_Y]]);          // arrivals exit down
    tline([[x0+12,ay],[x0+12,APRON_Y]]);            // departures hold up
    tline([[40,APRON_Y],[W-40,APRON_Y]]);           // apron parallel taxiway
    ctx.restore();
  }

  function drawTerminal(G){
    var sx=standXs(G);
    // main terminal building
    ctx.save();
    ctx.shadowColor='rgba(20,40,32,0.22)'; ctx.shadowBlur=12; ctx.shadowOffsetY=4;
    var tg=ctx.createLinearGradient(0,TERM_Y,0,TERM_Y+TERM_H);
    tg.addColorStop(0,'#46566b'); tg.addColorStop(1,'#37445a');
    ctx.fillStyle=tg; rr(G.termX,TERM_Y,G.termW,TERM_H,6); ctx.fill();
    ctx.restore();
    // roof glazing highlight + window strip
    ctx.fillStyle='rgba(150,190,235,0.18)'; rr(G.termX+4,TERM_Y+4,G.termW-8,8,3); ctx.fill();
    for(var wx=G.termX+10; wx<G.termX+G.termW-10; wx+=14){ var fl=0.12+0.12*((Math.sin(wx*0.6+T*0.012))*0.5+0.5);
      ctx.fillStyle='rgba(150,205,255,'+fl+')'; ctx.fillRect(wx,TERM_Y+16,9,TERM_H-24); }
    // piers / concourse fingers reaching up into the apron, with labels
    (G.piers||[]).forEach(function(p){
      var px=p[0];
      ctx.fillStyle='#3f4d61'; rr(px-9,STAND_Y-6,18,TERM_Y-(STAND_Y-6)+6,4); ctx.fill();
      ctx.fillStyle='rgba(190,210,235,0.16)'; rr(px-6,STAND_Y-4,12,6,2); ctx.fill();
    });
    // contact-stand jet bridges + empty-stand markers
    for(var i=0;i<sx.length;i++){
      var x=sx[i];
      // jet bridge from terminal to stand
      ctx.strokeStyle='rgba(150,160,170,0.85)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(x,TERM_Y); ctx.lineTo(x,STAND_Y-2); ctx.stroke();
      if(!standFill[i]){                               // lead-in line for a free stand
        ctx.strokeStyle='rgba(245,200,70,0.6)'; ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.moveTo(x,STAND_Y-26); ctx.lineTo(x,STAND_Y-2); ctx.stroke();
      }
    }
  }

  /* ---- landside: forecourt, access road with cars/buses, multi-storey car park, rail ---- */
  function drawLandside(G,util){
    // forecourt kerb
    ctx.fillStyle='#b3b9b4'; ctx.fillRect(20,FORE_Y,W-40,ROAD_Y-FORE_Y-2);
    // access road
    var rgd=ctx.createLinearGradient(0,ROAD_Y-4,0,ROAD_Y+14); rgd.addColorStop(0,'#33373d'); rgd.addColorStop(1,'#2a2e33');
    ctx.fillStyle=rgd; ctx.fillRect(0,ROAD_Y-4,W,18);
    ctx.strokeStyle='rgba(245,210,90,0.5)'; ctx.lineWidth=1.4; ctx.setLineDash([16,14]); ctx.lineDashOffset=-(T*1.1);
    ctx.beginPath(); ctx.moveTo(0,ROAD_Y+5); ctx.lineTo(W,ROAD_Y+5); ctx.stroke(); ctx.setLineDash([]);
    // vehicles (commercial kerbside + parking demand), count scales with traffic
    var nV=Math.max(2,Math.round(util*7));
    for(var i=0;i<nV;i++){ var dir=i%2?1:-1; var sp=0.6+util*0.7;
      var p=((T*0.004*sp+i/nV)%1); var vx=dir>0? p*W : W-p*W; var vy=ROAD_Y+(dir>0?0:9);
      var bus=(i%4===0);
      ctx.fillStyle=bus?'#2f7d54':LIVERY[(i+2)%LIVERY.length]; rr(vx-(bus?7:4),vy-2,(bus?14:8),4,1); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillRect(vx-(bus?7:4),vy-2,(bus?14:8),1.1); }
    // multi-storey car park (commercial income)
    ctx.save(); ctx.shadowColor='rgba(20,30,28,0.2)'; ctx.shadowBlur=8; ctx.shadowOffsetY=3;
    var cg=ctx.createLinearGradient(0,CP_Y,0,CP_Y+CP_H); cg.addColorStop(0,'#8f9690'); cg.addColorStop(1,'#7c837d');
    ctx.fillStyle=cg; rr(G.termX+G.termW-150,CP_Y,140,CP_H,5); ctx.fill(); ctx.restore();
    var cpx=G.termX+G.termW-150;
    for(var fl=0;fl<4;fl++){ ctx.strokeStyle='rgba(40,50,48,0.4)'; ctx.lineWidth=1; var fy=CP_Y+8+fl*((CP_H-10)/4);
      ctx.beginPath(); ctx.moveTo(cpx+4,fy); ctx.lineTo(cpx+136,fy); ctx.stroke();
      for(var cx=cpx+9;cx<cpx+132;cx+=12){ if((cx*7+fl*13)%100/100 < (0.4+0.5*util)){ ctx.fillStyle=LIVERY[(cx+fl)%LIVERY.length]; ctx.fillRect(cx,fy+1.5,7,3); } } }
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('CAR PARK',cpx+70,CP_Y-3);
    // rail link (stylised) on the far landside
    if(G.rail){ var ry=CP_Y+CP_H+10;
      ctx.strokeStyle='#7a8088'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(28,ry); ctx.lineTo(G.termX+G.termW-160,ry); ctx.stroke();
      for(var tx=34;tx<G.termX+G.termW-160;tx+=10){ ctx.strokeStyle='rgba(60,70,66,0.4)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(tx,ry-2.5); ctx.lineTo(tx,ry+2.5); ctx.stroke(); }
      var trx=34+((T*0.9)%(G.termX+G.termW-200)); ctx.fillStyle='#2f5fb0'; rr(trx,ry-3,26,6,2); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillRect(trx+2,ry-1.6,22,1.4);
      ctx.fillStyle='rgba(60,80,76,0.6)'; ctx.font='600 7px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('RAIL LINK',34,ry-5); }
  }

  /* ---- aircraft (top-down, nose toward -y at ang=0) ---- */
  function planeBody(s,col,acc,tail){
    // wings (swept back)
    ctx.fillStyle=acc; ctx.beginPath();
    ctx.moveTo(0,-1.5*s); ctx.lineTo(-18*s,8.5*s); ctx.lineTo(-14*s,10*s); ctx.lineTo(0,2.5*s);
    ctx.lineTo(14*s,10*s); ctx.lineTo(18*s,8.5*s); ctx.closePath(); ctx.fill();
    // tailplane
    ctx.beginPath(); ctx.moveTo(0,9.5*s); ctx.lineTo(-7*s,13.5*s); ctx.lineTo(-5*s,14.5*s); ctx.lineTo(0,12.5*s);
    ctx.lineTo(5*s,14.5*s); ctx.lineTo(7*s,13.5*s); ctx.closePath(); ctx.fill();
    // fuselage
    ctx.fillStyle=col; rr(-2.5*s,-13*s,5*s,27*s,2.5*s); ctx.fill();
    // nose taper
    ctx.beginPath(); ctx.moveTo(0,-15*s); ctx.lineTo(-2.5*s,-11*s); ctx.lineTo(2.5*s,-11*s); ctx.closePath(); ctx.fill();
    // tail fin (livery tint)
    ctx.fillStyle=tail; rr(-1.6*s,9*s,3.2*s,5*s,1*s); ctx.fill();
  }
  function plane(cx,cy,s,ang,livery,alt,coin){
    alt=alt||0;
    ctx.save();
    // shadow on the ground, displaced down-right with altitude
    var off=3+alt*20;
    ctx.save(); ctx.translate(cx+off,cy+off); ctx.rotate(ang); ctx.globalAlpha=Math.max(0.05,0.26-alt*0.18);
    planeBody(s,'#0a160f','#0a160f','#0a160f'); ctx.restore();
    // body (slightly larger when high, to read as "near")
    var sc=s*(1+alt*0.12);
    ctx.translate(cx,cy); ctx.rotate(ang);
    planeBody(sc,'#eef1f4','#c2cad2','#'+( ['b0392f','246a86','2f7d54','c0902f'][((livery||'').length)%4] ));
    // give it a real livery tail
    ctx.fillStyle=livery||'#246a86'; rr(-1.6*sc,9*sc,3.2*sc,5*sc,1*sc); ctx.fill();
    ctx.restore();
  }

  /* ---- economic money-flow: +cash in (green aero / gold commercial), −cash out (red opex) ---- */
  function spawnCoin(x,y,kind,dir){ if(coins.length<56) coins.push({x:x+rnd(-4,4),y:y, vy:(dir>0?(0.35+Math.random()*0.3):-(0.5+Math.random()*0.4)), life:1, kind:kind, dir:(dir>0?1:-1)}); }
  function coinCol(k){ return k==='aero'?'#0c8a57':(k==='comm'?'#c0902f':'#bc4733'); }
  function drawCoins(){
    for(var i=coins.length-1;i>=0;i--){ var c=coins[i];
      if(_anim){ c.y+=c.vy; if(c.dir>0) c.vy+=0.015; else c.vy*=0.99; c.life-=0.018; }
      if(c.life<=0){ coins.splice(i,1); continue; }
      var a=Math.max(0,Math.min(1,c.life)), col=coinCol(c.kind);
      ctx.save(); ctx.globalAlpha=a;
      ctx.fillStyle='rgba(20,30,25,0.18)'; ctx.beginPath(); ctx.arc(c.x+0.6,c.y+0.8,3.3,0,Math.PI*2); ctx.fill();
      var g=ctx.createRadialGradient(c.x-1,c.y-1.2,0,c.x,c.y,3.6); g.addColorStop(0,'#ffffff'); g.addColorStop(0.35,col); g.addColorStop(1,col);
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,3.3,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.95)'; ctx.lineWidth=0.9; ctx.beginPath();
      ctx.moveTo(c.x-1.5,c.y); ctx.lineTo(c.x+1.5,c.y); if(c.dir<0){ ctx.moveTo(c.x,c.y-1.5); ctx.lineTo(c.x,c.y+1.5); } ctx.stroke();
      ctx.restore(); }
  }
  /* ---- live P&L ledger (the two-till revenue, opex and EBITDA the figures imply) ---- */
  function drawLedger(rev,eb,opex){
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0;
    ctx.save();
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,11); ctx.fill(); ctx.stroke();
    ctx.textAlign='left'; ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.fillText('LIVE ECONOMICS · PER YEAR',px+13,py+15);
    function dot(x,c){ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,py+27,2.6,0,Math.PI*2); ctx.fill(); }
    dot(px+15,'#0c8a57'); dot(px+72,'#c0902f'); dot(px+170,'#bc4733');
    ctx.fillStyle='rgba(70,82,76,0.85)'; ctx.font='600 7.5px Inter,sans-serif';
    ctx.fillText('+ aero',px+21,py+30); ctx.fillText('+ commercial',px+78,py+30); ctx.fillText('− opex',px+176,py+30);
    var bx=px+13, bw=pw-26, rows=[['Revenue','+'+money(rev),'#0c6b4f',1],['Operating cost','−'+money(opex),'#bc4733',Math.max(0.02,oR)],['EBITDA',money(eb)+'  ·  '+Math.round(m*100)+'%','#0a5a42',Math.max(0.02,m)]];
    var ry=py+42;
    rows.forEach(function(r){ ctx.fillStyle='rgba(60,72,66,0.95)'; ctx.font='600 9px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(r[0],bx,ry+7);
      ctx.fillStyle=r[2]; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(r[1],px+pw-13,ry+7);
      ctx.fillStyle='rgba(20,30,25,0.07)'; rr(bx,ry+11,bw,3,1.5); ctx.fill(); ctx.fillStyle=r[2]; rr(bx,ry+11,bw*Math.min(1,r[3]),3,1.5); ctx.fill();
      ry+=20; });
    ctx.restore();
  }

  /* ---- parked aircraft + turnaround service at occupied stands ---- */
  function drawParked(G){
    var sx=standXs(G);
    for(var i=0;i<sx.length;i++){ if(!standFill[i]) continue;
      var x=sx[i], y=STAND_Y-14, st=standTurn[i]||0, prog=1-Math.min(1,st/standTurnMax);
      plane(x,y,1,Math.PI,LIVERY[(i*3+1)%LIVERY.length],0,false);     // nose toward terminal (south)
      // ground service vehicles around it (aero / ground-handling income)
      ctx.fillStyle='#c0902f'; rr(x-15,y+2,5,3,1); ctx.fill();        // belt loader
      ctx.fillStyle='#2f7d54'; rr(x+11,y-2,5,3,1); ctx.fill();        // fuel/catering
      // turnaround progress ring at the tail
      ctx.save(); ctx.translate(x,y-15); ctx.strokeStyle='rgba(60,72,80,0.35)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle='#0c6b4f'; ctx.beginPath(); ctx.arc(0,0,5,-Math.PI/2,-Math.PI/2+prog*Math.PI*2); ctx.stroke();
      ctx.restore();
    }
  }

  /* ---- aircraft scheduler: approach → land → taxi → stand → pushback → take-off ---- */
  var standTurnMax=260;
  function posOnPath(path,d){
    var total=0,i; for(i=1;i<path.length;i++) total+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);
    var acc=0;
    for(i=1;i<path.length;i++){ var a=path[i-1],b=path[i], L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;
      if(d<=acc+L || i===path.length-1){ var f=Math.max(0,Math.min(1,(d-acc)/L));
        return {x:a[0]+(b[0]-a[0])*f, y:a[1]+(b[1]-a[1])*f, ang:Math.atan2(b[0]-a[0],-(b[1]-a[1])), seg:i, frac:f, total:total}; }
      acc+=L; }
    return {x:path[path.length-1][0],y:path[path.length-1][1],ang:0,seg:path.length-1,frac:1,total:total};
  }
  function arrPath(G,i){ var sx=standXs(G)[i], rw=actRwy(G), ay=rw[0], x0=rw[1];
    return [[-110,ay-72],[x0+34,ay],[x0+300,ay],[EXIT_X,ay],[EXIT_X,APRON_Y],[sx,APRON_Y],[sx,STAND_Y-14]]; }
  function depPath(G,i){ var sx=standXs(G)[i], rw=actRwy(G), ay=rw[0], x0=rw[1], x1=rw[2];
    return [[sx,STAND_Y-14],[sx,APRON_Y],[x0+12,APRON_Y],[x0+12,ay],[x0+40,ay],[x0+360,ay],[x1+180,ay-130]]; }
  function spawnArr(G,i){ transit.push({kind:'arr',stand:i,d:0,speed:rnd(1.5,2.0),alt:1,
      path:arrPath(G,i),x:-110,y:actRwy(G)[0]-72,ang:Math.PI/2,liv:LIVERY[(i*3+1)%LIVERY.length]}); }
  function spawnDep(G,i){ standFill[i]=false; transit.push({kind:'dep',stand:i,d:0,speed:rnd(1.3,1.9),alt:0,
      path:depPath(G,i),x:standXs(G)[i],y:STAND_Y-14,ang:Math.PI,liv:LIVERY[(i*3+1)%LIVERY.length]}); }
  function hasArr(i){ return transit.some(function(t){return t.kind==='arr'&&t.stand===i;}); }
  function hasDep(i){ return transit.some(function(t){return t.kind==='dep'&&t.stand===i;}); }
  function pickFree(G){ var c=[]; for(var i=0;i<G.nStands;i++) if(!standFill[i]&&!hasArr(i)) c.push(i); return c.length?c[(Math.random()*c.length)|0]:-1; }
  function pickReady(G){ var c=[]; for(var i=0;i<G.nStands;i++) if(standFill[i]&&!hasDep(i)&&(standTurn[i]||0)<=0) c.push(i); return c.length?c[(Math.random()*c.length)|0]:-1; }
  function updateTransit(G){
    transit.forEach(function(t){ t.d+=t.speed; var r=posOnPath(t.path,t.d);
      t.x=r.x; t.y=r.y; t.seg=r.seg; t.frac=r.frac;
      // altitude profile: arrivals descend on the first leg; departures climb after rotation
      if(t.kind==='arr') t.alt = (r.seg===1)? (1-r.frac) : 0;
      else t.alt = (r.seg>=6)? r.frac : 0;
      t.ang = lerpA(t.ang, r.ang, 0.16);           // smooth turning through every corner
      if(t.d>=r.total){
        if(t.kind==='arr'){ standFill[t.stand]=true; standTurn[t.stand]=standTurnMax; spawnCoin(t.x,t.y,'aero'); }
        t.done=true;
      }
    });
    transit=transit.filter(function(t){return !t.done;});
  }
  function drawTransit(G){
    transit.forEach(function(t){
      var a=1; if(t.kind==='arr'&&t.seg===1) a=Math.max(0,Math.min(1,(t.x+110)/60));   // fade in on approach
      if(t.kind==='dep'&&t.seg>=6) a=Math.max(0,Math.min(1,1-(t.frac-0.5)*1.6));        // fade out on climb
      ctx.save(); ctx.globalAlpha=a; plane(t.x,t.y,1,t.ang,t.liv,t.alt,false); ctx.restore();
      // touchdown puff + aero coins at the moment of landing
      if(t.kind==='arr'&&t.seg===2&&t.frac<0.12){ ctx.fillStyle='rgba(230,230,235,0.5)';
        ctx.beginPath(); ctx.arc(t.x-8,t.y+6,3+Math.random()*2,0,Math.PI*2); ctx.fill();
        if(_anim&&Math.random()<0.4) spawnCoin(t.x,t.y,'aero'); }
      // takeoff-roll aero coins
      if(t.kind==='dep'&&t.seg===5&&_anim&&Math.random()<0.3) spawnCoin(t.x,t.y,'aero');
    });
  }

  /* ===================================================================
     FRAME
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var G=GEO[A.geoKey], E=A.econ;
    var pax=parseFloat(sCap.value), aero=parseFloat(sSpread.value), comm=parseFloat(sAvail.value);
    var util=Math.max(0.06,Math.min(1,(pax-E.paxMin)/(E.paxMax-E.paxMin)));

    ctx.clearRect(0,0,W,H);
    drawGround();
    // runways (ambient traffic on the inactive ones)
    var act=G.runways.length-1;
    drawCross(G);
    G.runways.forEach(function(rw,idx){ drawRunway(rw, idx===act); });
    G.runways.forEach(function(rw,idx){ if(idx!==act) drawAmbient(rw,idx+1); });
    drawTaxiways(G);
    drawTerminal(G);
    drawLandside(G,util);

    // ---- aircraft scheduling toward a target stand occupancy ----
    var n=G.nStands;
    if(standFill.length!==n){ standFill=[]; standTurn=[]; for(var z=0;z<n;z++){ var occ0=z<Math.max(1,Math.round(util*n)); standFill[z]=occ0; standTurn[z]=occ0?rnd(0,standTurnMax):0; } }
    var target=Math.max(1,Math.min(n,Math.round(util*n)));
    var occ=0; for(var bi=0;bi<n;bi++) if(standFill[bi]) occ++;
    var effective=occ + transit.filter(function(t){return t.kind==='arr';}).length - transit.filter(function(t){return t.kind==='dep';}).length;
    if(_anim){
      for(var si=0;si<n;si++) if(standFill[si]&&standTurn[si]>0) standTurn[si]--;
      schedT--;
      if(schedT<=0){
        if(effective<target){ var fi=pickFree(G); if(fi>=0){ spawnArr(G,fi); schedT=rnd(50,110); } else schedT=35; }
        else if(effective>target){ var di=pickReady(G); if(di>=0){ spawnDep(G,di); schedT=rnd(50,110); } else schedT=35; }
        else { var rd2=pickReady(G); if(rd2>=0 && Math.random()<0.6){ spawnDep(G,rd2); schedT=rnd(90,180); } else schedT=rnd(60,120); }
      }
      updateTransit(G);
    }
    drawParked(G);
    drawTransit(G);

    // ---- economics (annual) ----
    var aeroRev=pax*aero, commRev=pax*comm;
    var grossRev=aeroRev+commRev+(E.anc||0)*1e6;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e12)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));
    var aeroShare = grossRev>0? aeroRev/(aeroRev+commRev+ (E.anc||0)*1e6) : 0.5;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var O=A.opex;
    var c_ops=O.ops*pax, c_sec=O.sec*pax, c_maint=O.maint*1e6, c_admin=O.admin*1e6;
    var opex=c_ops+c_sec+c_maint+c_admin, ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;

    // ---- economic money-flow: +cash in (aero + commercial) rises; −cash out (opex) drains ----
    if(_anim){
      var sx=standXs(G), occList=[]; for(var oi=0;oi<n;oi++) if(standFill[oi]) occList.push(oi);
      var commS=1-aeroShare;
      if(occList.length && Math.random()<0.5*aeroShare+0.12){ var st=occList[(Math.random()*occList.length)|0]; spawnCoin(sx[st],STAND_Y-22,'aero',-1); }
      if(Math.random()<0.5*commS+0.10){ // commercial: from the terminal retail or the car park
        if(Math.random()<0.55) spawnCoin(G.termX+G.termW*Math.random(),TERM_Y+10,'comm',-1);
        else spawnCoin(G.termX+G.termW-80+rnd(-60,60),CP_Y+10,'comm',-1); }
      var outRate=Math.max(0.05,Math.min(0.6, opex/Math.max(1,revenue)));   // costs out, scaled by margin
      if(Math.random()<outRate){ var oc = Math.random()<0.5 ? [G.termX+G.termW*Math.random(),TERM_Y+8] : [sx[(Math.random()*sx.length)|0],STAND_Y-6];
        spawnCoin(oc[0],oc[1],'cost',1); }
    }
    drawCoins();

    // labels (with backing plates on land labels)
    (G.labels||[]).forEach(function(l){ var st=LSTY[l[3]]||LSTY.land;
      ctx.save(); ctx.font=st[1]; ctx.textAlign='center';
      if(l[3]==='land'||l[3]==='feat'){ var w=ctx.measureText(l[0]).width;
        ctx.fillStyle='rgba(255,255,255,0.62)'; rr(l[1]-w/2-5,l[2]-10,w+10,14,4); ctx.fill(); }
      ctx.shadowColor='rgba(255,255,255,0.6)'; ctx.shadowBlur=3; ctx.fillStyle=st[0];
      ctx.fillText(l[0],l[1],l[2]+1); ctx.restore(); });

    // live P&L ledger (revenue split across the two tills, opex out, EBITDA)
    drawLedger(revenue, ebitda, opex);

    // compass + caption + vignette
    ctx.save(); ctx.translate(W-30,30); ctx.strokeStyle='#5a6b76'; ctx.fillStyle='#5a6b76'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,-9); ctx.lineTo(0,8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(-3.5,-5); ctx.lineTo(3.5,-5); ctx.closePath(); ctx.fill();
    ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('N',0,18); ctx.restore();
    ctx.save(); ctx.shadowColor='rgba(255,255,255,0.65)'; ctx.shadowBlur=3;
    ctx.fillStyle='rgba(40,60,80,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+fmtPax(pax),W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.46,W/2,H/2,H*0.98);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.13)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    var atmsYr=pax/(E.paxPerAtm||130), fph=atmsYr/OPHRS;
    set('ixCapV',fmtPax(pax)); set('ixSpreadV',fmtCharge(aero)); set('ixAvailV',fmtCharge(comm));
    set('ixDir',fmtPax(pax)); set('ixDirS',Math.round(aeroShare*100)+'% aero / '+Math.round((1-aeroShare)*100)+'% commercial');
    set('ixMW',Math.round(fph)+' /hr'); set('ixMWs','≈ '+Math.round(atmsYr/1000)+'k movements p.a.');
    set('ixHr', revenue<=0?CUR+'0 / hr':money(revenue/OPHRS)+' / hr');
    set('ixYr', revenue<=0?CUR+'0':'≈ '+money(revenue));

    drawWaterfall(revenue, [['Staff &amp; operations',c_ops],['Security &amp; utilities',c_sec],['Maintenance &amp; infrastructure',c_maint],['Admin &amp; overhead',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the margin is too thin to value against the capital, raise the charges or the passenger volume.</span>'; return; }
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
    A=ASSETS[key]; CUR=A.cur; coins=[]; transit=[]; standFill=[]; standTurn=[];
    set('ixAssetName',A.name); set('ixAssetGeo',A.geo); set('ixCont',A.continent);
    set('ixBarName',A.name);
    html('ixLede',A.lede);
    html('s1body',A.s1);
    html('ixFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    html('s2intro',A.s2);
    set('ixDriverLab',A.driverLab); set('ixAvailLab',A.availLab); set('ixHrK',A.hrK); set('ixYrS',A.yrS);
    set('ixPreset',A.preset); html('ixTry',A.try);
    var E=A.econ;
    sCap.min=E.paxMin; sCap.max=E.paxMax; sCap.step=E.paxStep; sCap.value=E.paxDef;
    sSpread.min=E.aeroMin; sSpread.max=E.aeroMax; sSpread.step=E.aeroStep; sSpread.value=E.aeroDef;
    sAvail.min=E.commMin; sAvail.max=E.commMax; sAvail.step=E.commStep||1; sAvail.value=E.commDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue uses a stylised aero + commercial per-passenger build and the returns model is a simplified DCF; not a forecast of any specific year\'s traffic, and not investment advice.');
    frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.paxDef; sSpread.value=E.aeroDef; sAvail.value=E.commDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'heathrow');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
