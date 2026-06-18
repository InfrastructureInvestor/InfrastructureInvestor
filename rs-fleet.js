/* Rolling stock — data-driven worked examples.
   Six real rail-leasing businesses (ROSCOs and availability rolling-stock PPPs),
   one template. Scene config from rs-geo.js (GEO), drawn as a top-down train depot
   and running line in a 720x520 scene: a stabling depot with sidings and a
   maintenance shed on the left, and a mainline running line where in-service trains
   loop. The interactive figures are illustrative: revenue is a contracted leasing
   annuity (fleet × lease rate × availability), most of it contracted/floored, and
   the returns model is a simplified DCF in which manufacturer/public contributions
   offset the fleet capital cost. */
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

  /* ---------- 1 · ANGEL TRAINS (Europe · UK ROSCO, full-service passenger leasing) ---------- */
  angel:{
    name:'Angel Trains', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'angel',
    lede:'A textbook <b>ROSCO</b> — a rolling-stock leasing company that owns the trains Britain runs and leases them, fully maintained, to the train operators, earning a lease rate on every available unit for decades.',
    s1:'<p class="body">When British Rail was privatised, the trains were separated from the operators and placed in three <b>rolling-stock leasing companies (ROSCOs)</b>. <b>Angel Trains</b> is one of the largest. It <b>owns the fleet</b> — electric and diesel multiple units, locomotives and coaches — and leases each unit to a <b>train operating company (TOC)</b> on a lease that, for most passenger stock, is <b>full-service</b>: Angel carries the heavy maintenance and overhaul as well as the ownership.</p>'+
       '<p class="body">The economics are a <b>contracted leasing annuity</b>. The ROSCO buys the train, then earns a <b>lease rate per unit per year</b> for the life of the asset — paid so long as the unit is available for service. Because trains last 30-40 years but franchises are short, the ROSCO carries the <b>residual-value risk</b>: what the fleet is worth, and re-leasable for, once the first lease ends. That long-life, contracted income on an owned hard asset is why infrastructure funds prize ROSCOs.</p>',
    facts:[['ROSCO','Owner of trains','leases to TOCs'],['Full-service','Lease type','maintenance bundled'],['30-40yr','Asset life','long-lived stock'],['Residual','Key risk','re-lease value'],['Indexed','Lease rate','£ per unit p.a.'],['Infra fund','Owner','long-life annuity']],
    s2:'Watch the depot and the line. Trains stable in the <b>sidings</b>, the available fleet runs on the <b>mainline</b>, and the unavailable units sit in the <b>maintenance shed</b>. The owner\'s <b style="color:#0c6b4f">money</b> is the <b>lease rate on every available unit</b> — so the engine is the size of the fleet, the rate per unit, and how much of it is available, not how many passengers ride. Drag the fleet, the lease rate and the availability.',
    driverLab:'Lease rate', availLab:'Availability', hrK:'Lease revenue', yrS:'available units × lease rate',
    ledge:{a:'+ lease',b:'+ contracted',c:'− maintenance'}, demandLabel:'AVAILABILITY',
    preset:'Load Angel Trains',
    try:'<b>Try this:</b> drop the <b>availability</b> and watch lease revenue fall — a full-service ROSCO is paid on units <b>available</b> for service, and it carries the maintenance to keep them that way. Then remember the trick: a fleet bought once earns an <b>indexed lease rate for decades</b>, and the real question is the <b>residual value</b> — what the trains are worth and re-leasable for when the first lease ends.',
    s3:'Angel earns a <b>lease rate per unit per year</b> on every train it owns, paid by the TOC for so long as the unit is available. On most passenger stock the lease is <b>full-service</b>, so Angel also carries the heavy maintenance and overhaul — a real cost that makes the margin lower than a bare finance lease. The return comes from the spread between a <b>contracted, indexed lease income</b> over a very long life and the cost of the fleet, plus the <b>residual value</b> when the first lease rolls off.',
    mb:{tag:'Model B · full-service ROSCO', title:'Rolling-stock leasing company', body:'A ROSCO owns the fleet and leases each unit, fully maintained, to a train operator for a lease rate per available unit — a long, indexed annuity on an owned hard asset, with residual-value risk at re-lease. Maintenance is real, so the margin is moderate. <b>This is Angel Trains</b> — infra-fund owned.'},
    s4a:'A full-service ROSCO carries a real cost: <b>heavy maintenance, overhaul and component renewal</b> to keep the fleet available, plus depot and admin. So the margin is healthy but not enormous — lower than a bare finance lease. The defining number is not opex but the <b>fleet and its availability</b>: each available unit is a contracted, indexed annuity, and the residual value sits behind it.',
    wfNote:'Operating cost is the heavy maintenance, overhaul and component renewal that a full-service lease bundles in, plus depot and a small admin overhead. It is real — trains are mechanical — so the margin is moderate; the value is the contracted lease income and the residual value of the fleet.',
    s4b:'The capital is the <b>fleet itself</b> — the trains Angel buys to lease out. A manufacturer or public party may contribute a small share (an order subsidy or a procurement contribution), but the ROSCO funds the bulk and recovers it through the lease and the residual. That is the model: a large upfront fleet purchase turned into a long, contracted, indexed annuity on an owned, re-leasable asset.',
    stackH:'The capital · the fleet', splitL:'Who funds the fleet', splitR:'allocation',
    split:[['s1',12,'Manufacturer / public'],['s2',88,'ROSCO capital']],
    finList:[['','Fleet','owned, leased to TOCs'],['sub','Lease type','full-service (maintenance bundled)'],['','Revenue','lease rate per available unit'],['sub','Indexation','inflation-linked'],['','Key risk','residual value at re-lease'],['rest','Owner','infrastructure fund']],
    finNote:'A full-service ROSCO is a <b>contracted leasing annuity on an owned hard asset</b>: an indexed lease rate per available unit over a very long life, with maintenance carried and residual value behind it. The risks are availability, the residual value, and the price paid for the fleet.',
    timeline:[['1994','<b>ROSCOs created</b> at rail privatisation — trains split from operators.'],['1996','<b>Angel Trains</b> sold as one of the three original ROSCOs.'],['2008','<b>Acquired by an infrastructure consortium</b> — long-life owner.'],['2010s','<b>New fleets</b> (electric multiple units) ordered and leased to TOCs.'],['2020s','<b>Decarbonisation</b> — battery and bi-mode conversions extend asset life.'],['Ongoing','<b>Re-leasing</b> of cascaded stock tests the residual value.']],
    calcNote:'A working model of a <b>full-service ROSCO</b>. The build is the fleet cost; a small manufacturer/public contribution offsets part of it, so net capital is most of the fleet. Revenue is the indexed lease income over a long hold; the exit multiple reflects a long-lived, contracted, re-leasable asset.',
    s6:'Angel Trains is the contracted train annuity. What moves the return:',
    breakers:['<b>Availability</b> — the lease is paid on units available for service; full-service maintenance keeps them running.','<b>Lease rate &amp; indexation</b> — the contracted rate per unit, inflation-linked, is the income engine.','<b>Residual value</b> — what the fleet is worth and re-leasable for at the end of the first lease is the swing risk.','<b>Fleet price</b> — what was paid to buy the trains sets the spread over the lease income.'],
    src:'Figures from public sources on the UK ROSCO market: <a href="https://www.angeltrains.co.uk/" target="_blank" rel="noopener">Angel Trains</a> and the <a href="https://www.orr.gov.uk/" target="_blank" rel="noopener">Office of Rail and Road</a> framework for rolling-stock leasing. The figures are approximate and illustrative.',
    econ:{cur:'£', host:'TOC lessees', volt:'EMU / passenger',
      fleetDef:320,fleetMin:80,fleetMax:700,fleetStep:10, rateDef:430,rateMin:200,rateMax:800,rateStep:10,
      availDef:93,availMin:60,availMax:100,availStep:1, maintPerUnit:150, fixedOM:14},
    calc:{build:1450,grant:120,capex:3,revG:2.5,floor:95,cap:170,tax:25,exit:13,lev:6,rd:5,amort:2,hold:28},
    map:{footer:GEO.angel.footer}
  },

  /* ---------- 2 · GATX (North America · freight railcar leasing) ---------- */
  gatx:{
    name:'GATX', geo:'United States', continent:'North America', cur:'US$', geoKey:'gatx',
    lede:'A listed <b>railcar lessor</b> — it owns tank cars and freight wagons and leases them to shippers and railroads on operating leases, a cyclical, residual-risk version of the leasing model.',
    s1:'<p class="body"><b>GATX</b> is one of the world\'s largest railcar lessors, owning a fleet of <b>tank cars, hoppers and freight wagons</b> and leasing them to chemical producers, refiners, shippers and railroads across North America (and, through a European arm, beyond). Where a passenger ROSCO leases to a handful of operators, GATX leases a vast, fungible fleet of <b>railcars</b> to thousands of customers.</p>'+
       '<p class="body">The model is the <b>operating lease</b>: GATX owns the car, leases it for a few years at a market rate, maintains it, and re-leases or sells it when the lease ends. So GATX carries genuine <b>residual-value and re-leasing risk</b>, and lease rates are <b>cyclical</b> — they rise and fall with freight demand and the supply of cars. The return is the spread between a fleet bought across the cycle and the lease rates it can command, plus gains on selling cars into a strong market.</p>',
    facts:[['Railcars','Fleet','tank · hopper · freight'],['Operating','Lease type','market-rate, re-leased'],['Cyclical','Lease rates','freight cycle'],['Residual','Key risk','re-lease &amp; resale'],['Listed','Owner','NYSE: GATX'],['Maintenance','Service','GATX maintains the fleet']],
    s2:'Picture a yard of railcars — tank cars and hoppers stabled in the sidings, the leased fleet out running on the network, and cars in the shop for maintenance and repair. The owner\'s <b style="color:#0c6b4f">return</b> is the <b>lease rate on every car on hire</b>, plus gains when cars are sold. Drag the fleet, the lease rate and the utilisation — a cyclical, residual-risk leasing fleet, not a fixed-income annuity.',
    driverLab:'Lease rate', availLab:'Utilisation', hrK:'Lease revenue', yrS:'cars on hire × lease rate',
    ledge:{a:'+ lease',b:'+ resale',c:'− maintenance'}, demandLabel:'UTILISATION',
    preset:'Load GATX',
    try:'<b>Try this:</b> push the <b>lease rate</b> up and down — unlike a contracted passenger ROSCO, GATX\'s rates are <b>cyclical</b>, set by freight demand and the supply of cars. Then drop the <b>utilisation</b>: idle cars earn nothing and still cost to store and maintain. The upside is real residual gains when cars are sold into a tight market; the risk is the cycle turning.',
    s3:'GATX earns a <b>lease rate per car on hire</b>, set at the prevailing market rate when each operating lease is signed, and it maintains the fleet. Because leases are short relative to a car\'s 30-40 year life, GATX continually <b>re-leases and sells</b> cars — so the return blends recurring lease income with <b>residual gains</b> on disposals, and is <b>cyclical</b>: lease rates and utilisation track the freight market. It carries the full residual and re-leasing risk that a finance lease avoids.',
    mb:{tag:'Model B · operating-lease lessor', title:'Cyclical railcar leasing fleet', body:'A lessor that owns a fungible fleet of railcars and leases them on short, market-rate operating leases, maintaining them and re-leasing or selling at the end — so it carries residual-value and re-leasing risk and rides the freight cycle. Higher return, more cyclical than a contracted ROSCO. <b>This is GATX</b> — NYSE-listed.'},
    s4a:'GATX maintains its own fleet — <b>repair, qualification and component work</b> on tank and freight cars — plus storage of idle cars and a fleet-management overhead. The margin is healthy but the cost is real and partly fixed, so utilisation matters: idle cars still cost. The defining feature is the <b>cycle and the residual</b> — lease rates and resale gains, not the cost line in any one year.',
    wfNote:'Operating cost is the maintenance and qualification of tank and freight cars, the storage of idle cars, and a fleet-management overhead. It is real and partly fixed, so utilisation drives the margin; the swing factor for value is the freight cycle and gains on selling cars.',
    s4b:'The capital is the <b>railcar fleet</b>, bought across the cycle and held for its long life. Manufacturers do not subsidise it, so GATX funds essentially the whole fleet and recovers it through lease income and disposals. The art is buying cars when they are cheap and leasing or selling into strength — a hard-asset leasing book whose value is the fleet and the residual behind every lease.',
    stackH:'The capital · the railcar fleet', splitL:'Who funds the fleet', splitR:'allocation',
    split:[['s1',5,'Manufacturer / other'],['s2',95,'Lessor capital']],
    finList:[['','Fleet','tank · hopper · freight cars'],['sub','Lease type','operating (market-rate)'],['','Revenue','lease rate per car on hire'],['sub','Plus','gains on car disposals'],['','Key risk','residual &amp; the freight cycle'],['rest','Owner','NYSE: GATX']],
    finNote:'A railcar lessor is a <b>cyclical hard-asset leasing book</b>: recurring lease income plus residual gains on a fungible fleet, with full re-leasing and residual risk and exposure to the freight cycle. The levers are utilisation, market lease rates, and disciplined buying and selling of cars.',
    timeline:[['1898','<b>GATX founded</b> — tank-car leasing in the US.'],['1900s','<b>Fleet expansion</b> across chemicals, petroleum and agriculture.'],['2000s','<b>European railcar</b> leasing arm built out.'],['2010s','<b>Tank-car requalification</b> cycle drives maintenance capital.'],['2020s','<b>Fleet renewal</b> and disciplined buying across the cycle.'],['Ongoing','<b>Re-leasing &amp; disposals</b> capture residual value.']],
    calcNote:'A working model of an <b>operating-lease railcar lessor</b>, on an enterprise-value basis. The build is the fleet; revenue is the market lease income over the hold. A slightly higher exit multiple and shorter-feeling cycle reflect residual gains, but the income is cyclical — push the lease rate to see it.',
    s6:'GATX is the cyclical railcar fleet — lease income plus residuals. What drives it:',
    breakers:['<b>Lease rates</b> — set by the freight cycle and car supply; the biggest swing on revenue.','<b>Utilisation</b> — idle cars earn nothing and still cost to store and maintain.','<b>Residual value</b> — gains on re-leasing and selling cars are a real part of the return.','<b>The freight cycle</b> — chemicals, energy and agriculture demand drive the whole book.'],
    src:'Figures from public sources: <a href="https://www.gatx.com/" target="_blank" rel="noopener">GATX</a> investor disclosure on its railcar leasing fleet and the operating-lease model. The figures are approximate and illustrative.',
    econ:{cur:'US$', host:'shippers / railroads', volt:'freight railcars',
      fleetDef:120000,fleetMin:40000,fleetMax:300000,fleetStep:5000, rateDef:6,rateMin:3,rateMax:14,rateStep:0.5,
      availDef:99,availMin:70,availMax:100,availStep:1, maintPerUnit:2.0, fixedOM:40},
    calc:{build:4800,grant:0,capex:5,revG:3,floor:0,cap:9e9,tax:25,exit:11,lev:5,rd:5.5,amort:2,hold:22},
    map:{footer:GEO.gatx.footer}
  },

  /* ---------- 3 · LIMA METRO LINE 2 (South America · availability rolling-stock PPP) ---------- */
  lima:{
    name:'Lima Metro Line 2', geo:'Lima, Peru', continent:'South America', cur:'US$', geoKey:'lima',
    lede:'A driverless metro under a <b>transport PPP</b> — the rolling stock is provided and maintained under an availability concession, with the state paying for trains kept available, not for passengers carried.',
    s1:'<p class="body"><b>Lima Metro Line 2</b> is a large driverless metro built under a long <b>public-private partnership (PPP)</b>. Within it, the <b>rolling stock</b> — the train fleet — is procured, financed, provided and maintained by the concessionaire, and remunerated under an <b>availability-based payment</b>: the Peruvian state pays for trains kept available and fit for service to an agreed timetable, regardless of how many passengers ride.</p>'+
       '<p class="body">This is the rolling-stock leasing model in <b>availability-PPP</b> form. The concessionaire takes no demand risk — fares flow to the state — and instead earns a <b>contracted, indexed availability payment</b> for keeping the fleet running, with deductions if trains are not available. The income is highly contracted, but it is an <b>emerging-market</b> concession: the cash is part US-dollar, part sol, and discounted at a higher rate than a developed-market PPP. (Figures here are illustrative.)</p>',
    facts:[['Metro PPP','Structure','availability concession'],['No demand risk','Payment','state pays for availability'],['Driverless','Stock','automated metro'],['Indexed','Payment','contracted, inflation-linked'],['US$ / PEN','Currency','part-dollar, part-sol'],['Concession','Owner','PPP consortium']],
    s2:'Picture a metro depot — automated trains stabled in the sidings, the available fleet running the line, and units in the maintenance shed. The concessionaire\'s <b style="color:#0c6b4f">return</b> is the <b>availability payment on every train kept fit for service</b> — contracted and indexed, with deductions for unavailability. Drag the fleet, the payment rate and the availability — no demand risk, but an emerging-market discount rate.',
    driverLab:'Avail. payment', availLab:'Availability', hrK:'Availability payment', yrS:'available units × payment',
    ledge:{a:'+ availability',b:'+ contracted',c:'− maintenance'}, demandLabel:'AVAILABILITY',
    preset:'Load Lima Line 2',
    try:'<b>Try this:</b> raise the <b>availability</b> toward 100% and watch the payment hold flat at the contracted level — an availability PPP pays for keeping trains <b>fit for service</b>, so once you are above the threshold the revenue is contracted and stable. Then push the cost of debt: a strong contracted number nets down once discounted like an emerging-market concession.',
    s3:'The concessionaire earns a <b>contracted availability payment</b> for providing and maintaining the metro fleet to an agreed timetable, indexed to inflation, with <b>deductions</b> if trains are not available. There is <b>no demand risk</b> — fares go to the state. So the income is a highly contracted leasing annuity, set by the fleet, the payment rate and availability. The investor question is less the contract than the <b>discount rate</b> — Peruvian sovereign risk and the dollar-sol mix.',
    mb:{tag:'Model B · availability PPP', title:'Availability rolling-stock concession', body:'A transport PPP in which the concessionaire provides and maintains the train fleet and is paid a contracted, indexed availability payment for keeping trains fit for service — no demand risk, deductions for unavailability. A fully contracted leasing annuity, priced against emerging-market rates. <b>This is Lima Metro Line 2</b>.'},
    s4a:'The concessionaire carries <b>full maintenance and overhaul</b> of an automated metro fleet plus depot operations — a real cost, because availability deductions bite if trains are not fit for service. Margins on availability PPPs are healthy because the payment is set to cover it, but the swing factor is not the cost line — it is the <b>contracted payment and the discount rate</b> on an EM concession.',
    wfNote:'Operating cost is the heavy maintenance and overhaul of an automated metro fleet plus depot operations — real, because availability deductions penalise unfit trains. The payment is set to cover it at a contracted margin; the value driver is the indexed payment and the emerging-market discount rate.',
    s4b:'The capital is the <b>metro fleet and its depot equipment</b>, procured under the concession. A public or multilateral contribution typically funds part of the rolling-stock package, with the concessionaire financing the balance and recovering it through the availability payment. Modelled on an enterprise-value basis, it is a contracted, indexed annuity carried against <b>emerging-market</b> rates.',
    stackH:'The capital · the fleet + depot', splitL:'Who funds the fleet', splitR:'EM',
    split:[['s1',30,'Public / multilateral'],['s2',70,'Concessionaire capital']],
    finList:[['','Stock','driverless metro fleet'],['sub','Structure','availability PPP'],['','Revenue','contracted availability payment'],['sub','Demand risk','none (fares to state)'],['','Key risk','sovereign &amp; currency'],['rest','Owner','PPP consortium']],
    finNote:'An availability rolling-stock PPP is a <b>fully contracted leasing annuity</b>: an indexed payment for keeping trains fit for service, with no demand risk. The whole investment debate is the <b>discount rate</b> — Peruvian sovereign risk and the dollar-sol mix — more than the contract.',
    timeline:[['2014','<b>Line 2 PPP awarded</b> to a private concession consortium.'],['2010s','<b>Rolling-stock procurement</b> — driverless metro fleet ordered.'],['2020s','<b>Phased opening</b> of the line and tunnelling completion.'],['Term','<b>Availability payments</b> begin as sections enter service.'],['Indexed','<b>Payment indexation</b> tracks inflation over the concession.'],['Long-term','<b>Hand-back</b> of the fleet at concession end.']],
    calcNote:'A working model of an <b>availability rolling-stock PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high. The cost of debt is higher to reflect emerging-market rates, so a strong contracted number nets down once discounted.',
    s6:'Lima Line 2 is a contracted train annuity at an EM discount rate. What drives it:',
    breakers:['<b>Availability</b> — the payment is for trains fit for service; deductions bite below the threshold.','<b>Contracted payment</b> — the indexed rate, not passenger demand, sets the revenue.','<b>Country &amp; currency</b> — Peruvian sovereign risk and the dollar-sol mix set the discount rate.','<b>Maintenance delivery</b> — keeping an automated fleet available is the operational risk.'],
    src:'Figures from public sources on the Lima Metro Line 2 PPP and availability-based rolling-stock concessions: project and multilateral disclosure. As an emerging-market PPP, all figures here are approximate and illustrative.',
    econ:{cur:'US$', host:'state offtaker', volt:'driverless metro',
      fleetDef:35,fleetMin:15,fleetMax:60,fleetStep:1, rateDef:1900,rateMin:1000,rateMax:3200,rateStep:50,
      availDef:96,availMin:75,availMax:100,availStep:1, maintPerUnit:520, fixedOM:7},
    calc:{build:620,grant:180,capex:3,revG:2,floor:50,cap:80,tax:30,exit:10,lev:5,rd:9,amort:3,hold:18},
    map:{footer:GEO.lima.footer}
  },

  /* ---------- 4 · SYDNEY GROWTH TRAINS (Oceania · availability-payment PPP) ---------- */
  sydney:{
    name:'Sydney Growth Trains', geo:'New South Wales, Australia', continent:'Oceania', cur:'A$', geoKey:'sydney',
    lede:'An Australian <b>availability-payment PPP</b> — a private consortium finances, supplies and maintains a fleet of suburban trains, and the government pays for trains kept available, with no demand risk.',
    s1:'<p class="body">In Australia, new commuter fleets are increasingly delivered through a <b>rolling-stock PPP</b>: a private consortium finances, builds and maintains the trains over a long term, and the state transport authority pays a <b>contracted availability charge</b> for trains kept fit and available to the timetable. The <b>Sydney Growth Trains</b> programme (and its Melbourne counterpart, the High Capacity Metro Trains) follow this model.</p>'+
       '<p class="body">It is the cleanest form of the leasing annuity. The consortium takes <b>no demand risk</b> — passenger revenue is the government\'s — and instead earns an <b>availability payment</b> over a 25-30 year maintenance term, with deductions for unavailable or defective trains. Backed by a strong investment-grade government offtaker and denominated in Australian dollars, it is a low-risk, fully contracted, inflation-linked cash flow — the kind of asset that anchors a core infrastructure portfolio.</p>',
    facts:[['Availability PPP','Structure','finance · supply · maintain'],['No demand risk','Payment','government pays availability'],['25-30yr','Maintenance term','long contract'],['Gov offtaker','Counterparty','investment-grade'],['Indexed','Payment','inflation-linked'],['Consortium','Owner','infra-backed PPP']],
    s2:'Picture a stabling yard — new suburban trains parked in the sidings, the available fleet running the suburban line, and units in the maintenance shed. The consortium\'s <b style="color:#0c6b4f">return</b> is the <b>availability payment on every train kept fit for service</b> — contracted, indexed, government-backed, with deductions for unavailability. Drag the fleet, the payment and the availability — a core, fully contracted annuity.',
    driverLab:'Avail. payment', availLab:'Availability', hrK:'Availability payment', yrS:'available units × payment',
    ledge:{a:'+ availability',b:'+ contracted',c:'− maintenance'}, demandLabel:'AVAILABILITY',
    preset:'Load Sydney Trains',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment sit flat at the contracted level — the government pays for trains kept <b>fit for service</b>, so once you clear the threshold the revenue is locked. Drop availability below it and deductions bite. With an investment-grade government offtaker, the discount rate is low: this is what a core, contracted infrastructure cash flow looks like.',
    s3:'The consortium earns a <b>contracted availability payment</b> for supplying and maintaining the fleet to the timetable, indexed to inflation, with <b>deductions</b> for unavailable or defective trains. There is <b>no demand risk</b> — fares are the government\'s. So the income is a clean, fully contracted leasing annuity backed by an <b>investment-grade government</b> offtaker, set by the fleet, the payment rate and availability. Low risk, long term, indexed — the core-infrastructure archetype.',
    mb:{tag:'Model B · availability PPP', title:'Government-backed availability fleet', body:'A rolling-stock PPP in which a consortium finances, supplies and maintains a commuter fleet and the government pays a contracted, indexed availability charge for trains kept fit for service — no demand risk, an investment-grade offtaker, deductions for unavailability. The core-infrastructure annuity. <b>This is Sydney Growth Trains</b>.'},
    s4a:'The consortium carries <b>full fleet maintenance and overhaul</b> over the term, plus depot operations — sized so the availability payment covers it at a contracted margin. Because the offtaker is investment-grade and the payment is locked, the margin is steady. The defining feature is not the cost line but the <b>contracted, indexed payment</b> and the low discount rate a government offtaker permits.',
    wfNote:'Operating cost is the through-life maintenance and overhaul of the fleet plus depot operations, sized against a contracted payment. With deductions for unavailability, keeping the fleet fit is the operational job; the value sits in the indexed, government-backed payment, not the cost line.',
    s4b:'The capital is the <b>train fleet and depot</b>, financed by the consortium and recovered over the long maintenance term. A small portion may be government-funded, but the consortium funds the bulk and recovers it through the availability payment. Backed by an investment-grade offtaker, the cash flow is contracted and indexed, so it gears well — a low-risk, long-life leasing annuity.',
    stackH:'The capital · the fleet + depot', splitL:'Who funds the fleet', splitR:'allocation',
    split:[['s1',15,'Government contribution'],['s2',85,'Consortium capital']],
    finList:[['','Stock','suburban commuter fleet'],['sub','Structure','availability PPP'],['','Revenue','contracted availability payment'],['sub','Offtaker','investment-grade government'],['','Demand risk','none'],['rest','Owner','infra-backed consortium']],
    finNote:'A government-backed availability PPP is the <b>core-infrastructure leasing annuity</b>: an indexed payment for keeping trains fit for service, no demand risk, an investment-grade offtaker. It gears well and prices tight; the residual risk is maintenance delivery and deductions.',
    timeline:[['2016','<b>Sydney Growth Trains</b> order placed for additional suburban fleet.'],['2017','<b>HCMT (Melbourne)</b> availability PPP financial close — the model.'],['2019','<b>First trains</b> enter passenger service.'],['Term','<b>Availability payments</b> over the 25-30 year maintenance term.'],['Indexed','<b>Payment indexation</b> tracks inflation.'],['Long-term','<b>Hand-back</b> of the fleet at term end.']],
    calcNote:'A working model of a <b>government-backed availability PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high, so revenue is flat. A low cost of debt and high gearing reflect an investment-grade offtaker.',
    s6:'Sydney Growth Trains is the core contracted train annuity. What drives it:',
    breakers:['<b>Availability</b> — the payment is for trains fit for service; deductions bite below the threshold.','<b>Government offtaker</b> — an investment-grade counterparty keeps the discount rate low and gearing high.','<b>Indexation</b> — the inflation-linked payment protects the real return over a long term.','<b>Maintenance delivery</b> — keeping the fleet available over decades is the operational risk.'],
    src:'Figures from public sources on Australian rolling-stock availability PPPs (Sydney Growth Trains and the Melbourne High Capacity Metro Trains): NSW and Victorian transport and project disclosure. The figures are approximate and illustrative.',
    econ:{cur:'A$', host:'state offtaker', volt:'suburban EMU',
      fleetDef:24,fleetMin:8,fleetMax:60,fleetStep:1, rateDef:3600,rateMin:2000,rateMax:6000,rateStep:100,
      availDef:97,availMin:80,availMax:100,availStep:1, maintPerUnit:900, fixedOM:6},
    calc:{build:780,grant:120,capex:3,revG:2.5,floor:64,cap:95,tax:30,exit:13,lev:7,rd:5,amort:3,hold:28},
    map:{footer:GEO.sydney.footer}
  },

  /* ---------- 5 · RIYADH METRO (Middle East · availability metro PPP, state-backed) ---------- */
  riyadh:{
    name:'Riyadh Metro', geo:'Saudi Arabia', continent:'Middle East', cur:'SAR', geoKey:'riyadh',
    lede:'A vast driverless metro whose <b>rolling stock</b> is supplied and maintained under a long availability arrangement — a state-backed fleet kept fit for service for a contracted, indexed payment.',
    s1:'<p class="body"><b>Riyadh Metro</b> is one of the largest driverless metro systems built in a single programme — six lines across the Saudi capital, fully automated. The <b>rolling stock</b> — a large fleet of driverless trains — is supplied and maintained under long-term arrangements in which the operator is remunerated for keeping the fleet <b>available and fit for service</b>, an availability model layered onto an operations-and-maintenance concession.</p>'+
       '<p class="body">The economics mirror an availability rolling-stock PPP, with a <b>state-backed</b> twist: the counterparty is a sovereign-wealthy government, so the cost of capital is low and the payment is secure. The provider takes <b>no demand risk</b> and earns a <b>contracted, indexed payment</b> for keeping the driverless fleet running to the timetable, with deductions for unavailability. Long-life automated stock, a strong offtaker, and a contracted annuity. (Figures here are illustrative.)</p>',
    facts:[['Driverless','Metro','fully automated'],['Availability','Payment','contracted, indexed'],['No demand risk','Structure','O&amp;M + availability'],['State-backed','Offtaker','sovereign'],['Low CoC','Funding','strong counterparty'],['Concession','Owner','operator consortium']],
    s2:'Picture an automated metro depot — driverless trains stabled in the sidings, the available fleet running the line, and units in the maintenance shed. The provider\'s <b style="color:#0c6b4f">return</b> is the <b>availability payment on every train kept fit for service</b> — contracted, indexed, state-backed, with deductions for unavailability. Drag the fleet, the payment and the availability — a large, contracted, low-cost-of-capital annuity.',
    driverLab:'Avail. payment', availLab:'Availability', hrK:'Availability payment', yrS:'available units × payment',
    ledge:{a:'+ availability',b:'+ contracted',c:'− maintenance'}, demandLabel:'AVAILABILITY',
    preset:'Load Riyadh Metro',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment hold flat at the contracted level — the state pays for a driverless fleet kept <b>fit for service</b>, not for ridership. With a sovereign offtaker the discount rate is low, so the contracted annuity values richly. The operational job is keeping a large automated fleet available; deductions bite if it is not.',
    s3:'The provider earns a <b>contracted availability payment</b> for supplying and maintaining the driverless fleet to the timetable, indexed, with <b>deductions</b> for unavailability — and takes <b>no demand risk</b>. The counterparty is a <b>sovereign-backed</b> government, so the payment is secure and the cost of capital low. The income is a large, fully contracted leasing annuity on long-life automated stock, set by the fleet, the payment rate and availability.',
    mb:{tag:'Model B · state-backed availability', title:'Sovereign-backed availability fleet', body:'A driverless-metro rolling-stock arrangement in which a provider supplies and maintains the fleet and is paid a contracted, indexed availability payment by a sovereign-backed government — no demand risk, a low cost of capital, deductions for unavailability. A large, secure leasing annuity. <b>This is Riyadh Metro</b>.'},
    s4a:'The provider carries <b>full maintenance and overhaul</b> of a large driverless fleet plus depot and control-system operations — real and technical, because an automated metro must run to a tight timetable. The payment is set to cover it; with a sovereign offtaker the margin is steady. The defining feature is the <b>contracted payment and the low cost of capital</b>, not the cost line.',
    wfNote:'Operating cost is the maintenance and overhaul of a large driverless fleet plus depot and control-system operations — technical and real. Availability deductions penalise downtime; the payment covers it at a contracted margin, and the value sits in the indexed, state-backed payment.',
    s4b:'The capital is the <b>driverless fleet and its systems</b>, procured at scale. As a flagship state programme much of the cost is <b>state-funded</b>, with the provider\'s capital recovered through the availability payment. Backed by a sovereign counterparty, the cash flow is contracted and indexed at a low cost of capital — a large, secure, long-life leasing annuity.',
    stackH:'The capital · the fleet + systems', splitL:'Who funds the fleet', splitR:'state-backed',
    split:[['s1',45,'State funding'],['s2',55,'Provider capital']],
    finList:[['','Stock','driverless metro fleet'],['sub','Structure','availability + O&amp;M'],['','Revenue','contracted availability payment'],['sub','Offtaker','sovereign-backed'],['','Cost of capital','low'],['rest','Owner','operator consortium']],
    finNote:'A state-backed availability metro is a <b>large, secure leasing annuity</b>: an indexed payment for keeping a driverless fleet fit for service, a sovereign offtaker, and a low cost of capital. The residual risk is maintenance delivery on a complex automated fleet and the term of the arrangement.',
    timeline:[['2013','<b>Riyadh Metro</b> contracts awarded — six driverless lines.'],['2010s','<b>Rolling-stock manufacture</b> — large driverless fleet ordered.'],['2024','<b>Phased opening</b> of the network begins.'],['Term','<b>Availability / O&amp;M payments</b> for keeping the fleet running.'],['Indexed','<b>Payment indexation</b> over the concession.'],['Long-term','<b>Through-life maintenance</b> of the automated fleet.']],
    calcNote:'A working model of a <b>state-backed availability metro</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high. A low cost of capital and zero tax reflect a sovereign-backed programme. Figures are highly illustrative.',
    s6:'Riyadh Metro is a large, state-backed contracted train annuity. What drives it:',
    breakers:['<b>Availability</b> — the payment is for a driverless fleet kept fit for service; deductions bite below it.','<b>Sovereign offtaker</b> — a state counterparty keeps the cost of capital low and the payment secure.','<b>Indexation</b> — the inflation-linked payment protects the real return over a long term.','<b>Maintenance delivery</b> — keeping a complex automated fleet available is the operational risk.'],
    src:'Figures from public sources on the <a href="https://www.rcrc.gov.sa/" target="_blank" rel="noopener">Riyadh Metro</a> programme and availability-based rolling-stock arrangements. As a flagship state programme, all figures here are highly approximate and illustrative.',
    econ:{cur:'SAR', host:'state offtaker', volt:'driverless metro',
      fleetDef:90,fleetMin:30,fleetMax:180,fleetStep:5, rateDef:6500,rateMin:3500,rateMax:11000,rateStep:100,
      availDef:96,availMin:78,availMax:100,availStep:1, maintPerUnit:1800, fixedOM:30},
    calc:{build:7800,grant:3500,capex:3,revG:2.5,floor:560,cap:820,tax:0,exit:12,lev:5,rd:4.5,amort:2,hold:25},
    map:{footer:GEO.riyadh.footer}
  },

  /* ---------- 6 · CRRC FINANCIAL LEASING (China · finance leasing at scale) ---------- */
  crrc:{
    name:'CRRC Financial Leasing', geo:'China', continent:'China', cur:'¥', geoKey:'crrc',
    lede:'A Chinese <b>rolling-stock finance-leasing</b> business at vast scale — funding locomotives and railcars on finance leases for railways and operators, at a very low state cost of capital.',
    s1:'<p class="body">China runs the largest rail system on earth, and its rolling-stock manufacturer, <b>CRRC</b>, is the largest in the world. Around it sits a large <b>financial-leasing</b> activity that funds locomotives, railcars and multiple units on <b>finance leases</b> — providing the capital so railways, operators and leasing platforms can take delivery of vast fleets, and recovering it through lease payments over the asset\'s life.</p>'+
       '<p class="body">This is the <b>finance-lease</b> end of the spectrum. Unlike a full-service ROSCO, the lessor does not carry maintenance — the lessee does — so the cost line is thin and the <b>margin is high</b>; the income is closer to a financing spread than an operating annuity, and residual risk is limited. The model is scale at a very <b>low state cost of capital</b>: a thin spread on an immense, fast-growing book compounds into a large, stable return. (Figures here are illustrative.)</p>',
    facts:[['Finance lease','Type','lessee maintains'],['Vast scale','Book','immense fleet funded'],['Thin','Maintenance cost','high margin'],['Very low','Cost of capital','state-backed'],['CRRC-linked','Origination','world\'s largest builder'],['State','Owner','sovereign-backed']],
    s2:'Picture a national depot — locomotives and railcars stabled across the sidings, the financed fleet out on the network, only a few units in the shed (the lessee maintains them). The lessor\'s <b style="color:#0c6b4f">return</b> is the <b>finance-lease payment on every unit funded</b> — a thin spread on an immense book. Drag the fleet, the lease rate and the in-service share — scale and a low cost of capital, not maintenance, are the model.',
    driverLab:'Lease rate', availLab:'In-service', hrK:'Lease income', yrS:'units funded × lease rate',
    ledge:{a:'+ lease',b:'+ financing',c:'− admin'}, demandLabel:'IN-SERVICE',
    preset:'Load CRRC Leasing',
    try:'<b>Try this:</b> note how thin the <b>cost line</b> is — a finance lease leaves maintenance with the lessee, so the margin is high and the income is a financing spread. The return <b>per unit</b> is modest, but push the <b>fleet</b> slider and the absolute book balloons. Scale and a very low state cost of capital, not maintenance or residual gains, are the model.',
    s3:'CRRC\'s leasing arm earns a <b>finance-lease payment per unit funded</b> — a financing spread over its very low cost of capital — and, being a finance lease, leaves <b>maintenance with the lessee</b>. So the cost line is thin and the margin high, closer to a bank\'s net interest margin than an operating annuity. The lever is <b>scale and the cost of capital</b>: a thin spread on a colossal, fast-growing book, financed by the state, compounds into a large, steady return.',
    mb:{tag:'Model B · finance leasing', title:'Rolling-stock finance lease at scale', body:'A lessor that funds locomotives and railcars on finance leases — the lessee maintains them, so the cost line is thin and the margin high, and the income is a financing spread rather than an operating annuity. Scale at a very low state cost of capital is the model. <b>This is CRRC-linked financial leasing</b>.'},
    s4a:'A finance-lease book is <b>light on operating cost</b> — the lessee carries the maintenance, so the lessor\'s cost is essentially origination, servicing and a small admin overhead. The margin is therefore high, close to a financing spread. The dominant feature is the <b>scale of the book and the cost of capital</b>: a thin per-unit return on an immense fleet, funded at a very low state rate.',
    wfNote:'Operating cost is thin — a finance lease leaves maintenance with the lessee, so the lessor carries only origination, servicing and admin. The margin is high, close to a financing spread; the value is the scale of the book and the very low state cost of capital, not the cost line.',
    s4b:'The capital is the <b>fleet funded</b> — locomotives, railcars and units the lessor finances for others to operate. There is little subsidy; the lessor funds the asset and recovers it through the lease. The art is the <b>cost of capital</b>: financed on a state-backed balance sheet at a very low rate, a thin lease spread on an immense, fast-growing book is a large, stable return.',
    stackH:'The capital · the funded fleet', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'State-backed balance sheet']],
    finList:[['','Book','locomotives · railcars · units'],['sub','Lease type','finance lease (lessee maintains)'],['','Revenue','finance-lease spread per unit'],['sub','Origination','CRRC-linked'],['','Cost of capital','very low (state)'],['rest','Owner','state-backed']],
    finNote:'A finance-leasing book at scale is a <b>financing spread on an immense fleet</b>: a thin per-unit return, a high margin (no maintenance), and a very low state cost of capital. The return is steady and large in absolute terms; the risks are credit, the book\'s growth, and state direction.',
    timeline:[['2015','<b>CRRC formed</b> from the merger of China\'s two big train builders.'],['2010s','<b>Financial-leasing platforms</b> scale alongside fleet delivery.'],['2010s','<b>High-speed &amp; freight fleets</b> funded on finance leases.'],['2020s','<b>Belt-and-Road</b> rolling-stock exports add leasing volume.'],['Ongoing','<b>Low state cost of capital</b> underpins the spread.'],['Ongoing','<b>Scale</b> drives the absolute return.']],
    calcNote:'A working model of a <b>rolling-stock finance-leasing book</b>, on an enterprise-value basis. Maintenance sits with the lessee, so the margin is high and the cost line thin; the return per unit is a thin spread but the book is vast and the cost of capital very low. Figures are highly illustrative.',
    s6:'CRRC leasing is scale plus a low cost of capital — a thin spread on a vast book. What drives it:',
    breakers:['<b>Scale of the book</b> — a thin spread on an immense, fast-growing fleet is the model.','<b>Cost of capital</b> — a very low state rate is what makes a thin spread worth funding.','<b>Finance vs full-service</b> — leaving maintenance with the lessee keeps the margin high.','<b>State direction</b> — policy and the state balance sheet, not shareholders, set the strategy.'],
    src:'Figures from public sources and reporting on <a href="https://www.crrcgc.cc/en" target="_blank" rel="noopener">CRRC</a> and Chinese rolling-stock financial leasing. Given the scale and limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', host:'railways / operators', volt:'loco / railcar',
      fleetDef:1200,fleetMin:400,fleetMax:2600,fleetStep:50, rateDef:600,rateMin:300,rateMax:1100,rateStep:20,
      availDef:99,availMin:85,availMax:100,availStep:1, maintPerUnit:30, fixedOM:300},
    calc:{build:9000,grant:0,capex:1.5,revG:5,floor:550,cap:900,tax:25,exit:10,lev:4,rd:3.5,amort:3,hold:25},
    map:{footer:GEO.crrc.footer}
  }
  };
  var ORDER=['angel','gatx','lima','sydney','riyadh','crrc'];

  /* ===================================================================
     ROLLING-STOCK RENDERER  (canvas, 720x520) — top-down, daytime
     A train depot + running line: a stabling depot of parallel sidings and a
     maintenance shed on the left (where the unavailable fleet sits), and a mainline
     running line across the canvas where in-service trains run and loop. Trains are
     drawn as short coupled sets of cars with a livery colour; the in-service vs
     in-shed split tracks availability.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  /* ---- depot / line geometry ---- */
  var SHED={x:36,y:140,w:150,h:118};          // maintenance shed (below the ledger)
  var SIDINGS=[252,290,328,366,404];         // y of stabling sidings (left depot)
  var SIDX0=210, SIDX1=470;                   // x extent of sidings
  var LINEY=[150,196];                        // running line lies between these (twin tracks)
  var LINEX0=200, LINEX1=W-40;
  // per-asset slot allocation (built once per asset)
  var SLOTS=[], NSLOT=0;
  function layout(){
    // stabling slots: a grid of parked positions across the sidings
    SLOTS=[]; var perRow=6, gap=(SIDX1-SIDX0)/perRow;
    for(var r=0;r<SIDINGS.length;r++) for(var c=0;c<perRow;c++){
      SLOTS.push({x:SIDX0+18+c*gap, y:SIDINGS[r], ph:((r*7+c*5)%10)*0.6});
    }
    NSLOT=SLOTS.length;
  }

  /* ---- base map: depot ground + tracks ---- */
  function sleepers(x0,y,x1){
    ctx.strokeStyle='rgba(120,110,95,0.45)'; ctx.lineWidth=2;
    for(var x=x0;x<x1;x+=11){ ctx.beginPath(); ctx.moveTo(x,y-5); ctx.lineTo(x,y+5); ctx.stroke(); }
  }
  function rail(x0,y,x1,moving){
    sleepers(x0,y,x1);
    ctx.strokeStyle='#9aa19a'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(x0,y-3); ctx.lineTo(x1,y-3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x0,y+3); ctx.lineTo(x1,y+3); ctx.stroke();
    if(moving){ ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=1; ctx.setLineDash([7,9]); ctx.lineDashOffset=-(T*1.1);
      ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x1,y); ctx.stroke(); ctx.setLineDash([]); }
  }
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // ballast bed under the depot sidings + the running line
    ctx.fillStyle='rgba(150,140,120,0.12)';
    rr(SIDX0-6,SIDINGS[0]-16,SIDX1-SIDX0+30,SIDINGS[SIDINGS.length-1]-SIDINGS[0]+32,10); ctx.fill();
    rr(LINEX0-10,LINEY[0]-16,LINEX1-LINEX0+18,LINEY[1]-LINEY[0]+32,10); ctx.fill();
    // running line (twin mainline tracks, animated)
    rail(LINEX0,LINEY[0],LINEX1,true);
    rail(LINEX0,LINEY[1],LINEX1,true);
    // throat: curved lead from depot up to the running line
    ctx.strokeStyle='#9aa19a'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(SIDX0+10,SIDINGS[0]); ctx.quadraticCurveTo(190,224,LINEX0,LINEY[1]); ctx.stroke();
    // stabling sidings
    SIDINGS.forEach(function(y){ rail(SIDX0,y,SIDX1,false); });
  }

  /* ---- maintenance shed ---- */
  function shed(busy){
    var s=SHED;
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(s.x+4,s.y+s.h-6,s.w,8,3); ctx.fill();
    var g=ctx.createLinearGradient(s.x,s.y,s.x,s.y+s.h); g.addColorStop(0,'#cfd3ca'); g.addColorStop(1,'#bcc2b8');
    ctx.fillStyle=g; rr(s.x,s.y,s.w,s.h,5); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // saw-tooth roof bays
    ctx.fillStyle='rgba(255,255,255,0.35)';
    for(var bx=s.x+8;bx<s.x+s.w-8;bx+=26){ ctx.beginPath(); ctx.moveTo(bx,s.y+8); ctx.lineTo(bx+13,s.y+2); ctx.lineTo(bx+13,s.y+16); ctx.closePath(); ctx.fill(); }
    // bay doors (a train sits behind each occupied bay)
    var doors=3, dw=(s.w-20)/doors;
    for(var d=0;d<doors;d++){ var dx=s.x+10+d*dw, lit=d<busy;
      ctx.fillStyle=lit?'rgba(255,196,120,0.5)':'rgba(90,100,90,0.30)'; rr(dx,s.y+s.h-30,dw-7,24,2); ctx.fill();
      if(lit && Math.sin(T*0.12+d)>0.2) glow(dx+(dw-7)/2,s.y+s.h-18,9,'rgba(255,180,90,0.35)'); }
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('MAINTENANCE SHED',s.x+s.w/2,s.y-6);
  }

  /* ---- a train: a short coupled set of cars, top-down, with livery ---- */
  function train(x,y,n,len,livery,stock,running){
    var carW=len, carH=(stock==='freight'?13:11), gap=3, totalW=n*(carW+gap)-gap;
    for(var i=0;i<n;i++){
      var cx=x+i*(carW+gap);
      // shadow
      ctx.fillStyle='rgba(20,30,25,0.16)'; rr(cx+0.8,y-carH/2+1.4,carW,carH,carH/2.4); ctx.fill();
      if(stock==='freight'){
        // open/tank wagon: flat body, neutral with livery ends
        var fg=ctx.createLinearGradient(cx,y-carH/2,cx,y+carH/2); fg.addColorStop(0,'#b7b3a6'); fg.addColorStop(1,'#9a978c');
        ctx.fillStyle=fg; rr(cx,y-carH/2,carW,carH,2); ctx.fill();
        ctx.fillStyle=livery; rr(cx,y-carH/2,carW,3,1.5); ctx.fill();                         // livery stripe
        ctx.strokeStyle='rgba(60,60,55,0.4)'; ctx.lineWidth=0.7;
        for(var rb=cx+5;rb<cx+carW-3;rb+=6){ ctx.beginPath(); ctx.moveTo(rb,y-carH/2+1); ctx.lineTo(rb,y+carH/2-1); ctx.stroke(); }
      } else {
        // passenger / metro car: livery body with a window strip
        var pg=ctx.createLinearGradient(cx,y-carH/2,cx,y+carH/2);
        pg.addColorStop(0,livery); pg.addColorStop(0.5,shade(livery,1.18)); pg.addColorStop(1,shade(livery,0.82));
        ctx.fillStyle=pg; rr(cx,y-carH/2,carW,carH,carH/2.6); ctx.fill();
        // window strip
        ctx.fillStyle=running?'rgba(225,240,255,0.92)':'rgba(180,195,205,0.7)';
        rr(cx+3,y-2,carW-6,4,1.5); ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=0.6;
        for(var w=cx+5;w<cx+carW-3;w+=5){ ctx.beginPath(); ctx.moveTo(w,y-2); ctx.lineTo(w,y+2); ctx.stroke(); }
        // nose highlight on the lead car
        if(i===n-1 && running){ ctx.fillStyle='rgba(255,255,255,0.5)'; rr(cx+carW-3,y-carH/2+1,2.4,carH-2,1); ctx.fill(); }
      }
    }
    if(running) glow(x+totalW,y,8,'rgba(120,200,255,0.28)');
    return {cx:x+totalW/2, top:y-carH/2, bot:y+carH/2};
  }
  function shade(hex,f){ var c=hex.replace('#',''); if(c.length===3)c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    var r=Math.min(255,Math.round(parseInt(c.substr(0,2),16)*f)), gg=Math.min(255,Math.round(parseInt(c.substr(2,2),16)*f)), b=Math.min(255,Math.round(parseInt(c.substr(4,2),16)*f));
    return 'rgb('+r+','+gg+','+b+')'; }

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
    var fleet=parseFloat(sCap.value), rate=parseFloat(sSpread.value), avail=parseFloat(sAvail.value)/100;

    ctx.clearRect(0,0,W,H);
    drawMap();

    // how many trains to draw (capped) and the in-service / in-shed split
    var drawN=Math.max(3,Math.min(NSLOT, Math.round(6+fleet/ (E.fleetMax/ (NSLOT-6)) )));
    drawN=Math.max(4,Math.min(NSLOT, Math.round(NSLOT*Math.min(1,fleet/E.fleetMax)+3)));
    var running=Math.round(drawN*avail), inShed=drawN-running;
    var carsPer=(G.stock==='loco')?2:(G.stock==='freight'?3:3);
    var carLen=(G.stock==='metro')?15:(G.stock==='freight'?16:17);

    // maintenance shed (occupied bays scale with the unavailable fraction)
    var busyBays=Math.max(0,Math.min(3, Math.round(3*(1-avail)+ (inShed>0?0.5:0)) ));
    shed(busyBays);

    // stabled trains in the sidings (the fleet at rest) — fill slots up to drawN
    var stabledTops=[];
    for(var si=0; si<Math.min(drawN,NSLOT); si++){
      var slot=SLOTS[si];
      var t=train(slot.x, slot.y, 2, 11, G.livery, G.stock, false);
      stabledTops.push(t);
    }

    // in-service trains on the running line (move left→right and loop)
    var runTops=[];
    for(var k=0;k<running;k++){
      var laneY=LINEY[k%2];
      var setW=carsPer*(carLen+3)-3;
      var span=LINEX1-LINEX0-setW-10;
      var phase=((T*0.6 + k*220)% (span+260)) ;     // spacing between sets
      var tx=LINEX0+ (phase % span);
      var rt=train(tx, laneY, carsPer, carLen, G.livery, G.stock, true);
      runTops.push(rt);
    }

    // running-line label + service marker
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('RUNNING LINE · IN SERVICE',LINEX0,LINEY[0]-16); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('STABLING DEPOT',SIDX0,SIDINGS[0]-16); ctx.restore();

    // ---- economics (contracted leasing annuity) ----
    var grossRev=fleet*rate*1000*avail;       // rate is £'000/unit/yr
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));   // floor = contracted minimum
    var opex= fleet*(E.maintPerUnit||0)*1000 + (E.fixedOM||0)*1e6;   // full-service maintenance + overhead
    var ebitda=revenue-opex;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // waterfall opex rows
    var c_heavy=opex*0.40, c_over=opex*0.26, c_depot=opex*0.20, c_admin=opex*0.14;
    // share of "+cash" that is contracted/floor vs residual/merchant slice
    var floorBinds = floor>0 && revenue<=floor+1;
    var contractShare = floorBinds ? Math.min(0.5, floor/Math.max(1,revenue)) : 0.18;

    // money-flow: +cash (lease) rises from in-service trains; amber contracted; −cash maintenance from shed
    if(_anim){
      if(runTops.length && Math.random()<0.7){ var s1=runTops[(Math.random()*runTops.length)|0];
        spawnCoin(s1.cx,s1.top-4, Math.random()<contractShare?'rec':'ret', -1); }
      var sx=SHED.x+SHED.w*0.5; if(Math.random()<Math.max(0.1,Math.min(0.6, opex/Math.max(1,revenue)))) spawnCoin(sx,SHED.y+SHED.h-14,'cost',1);
      demHist.push(Math.max(0,Math.min(1,avail))); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,avail)));

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(fleet)+' units',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',kfmt(fleet)+' units'); set('ixSpreadV',CUR+Math.round(rate)+'k/yr'); set('ixAvailV',Math.round(avail*100)+'%');
    set('ixDir',kfmt(fleet)+' units'); set('ixDirS','owned fleet · '+E.volt);
    set('ixMW',kfmt(Math.round(fleet*avail))+' in service'); set('ixMWs',Math.round(avail*100)+'% available · '+(G.host||'lessees'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Heavy maintenance',c_heavy],['Overhaul &amp; components',c_over],['Depot &amp; opex',c_depot],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the fleet is too thin to value — raise the fleet, the lease rate or the availability.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross fleet cost</span> <b>'+money(capexGrossG)+'</b></span>'+
      '<span><span class="lbl">Net of contributions</span> <b>'+money(netCapexG)+'</b></span>'+
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
    sCap.min=E.fleetMin; sCap.max=E.fleetMax; sCap.step=E.fleetStep; sCap.value=E.fleetDef;
    sSpread.min=E.rateMin; sSpread.max=E.rateMax; sSpread.step=E.rateStep; sSpread.value=E.rateDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is a contracted leasing annuity (fleet × lease rate × availability) and the returns model is a simplified DCF in which manufacturer or public contributions offset the fleet capital cost; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.fleetDef; sSpread.value=E.rateDef; sAvail.value=E.availDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'angel');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
