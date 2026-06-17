/* Tolled bridges & fixed links — data-driven worked examples.
   Six real assets, one template. Map geometry from br-geo.js (GEO).
   The interactive figures are illustrative: revenue uses a stylised blended toll
   and the returns model is a simplified DCF, not a forecast. */
(function(){
  var HRS=8760;
  var CUR='DKK ';
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
  function fmtToll(v){ var s=(Math.abs(v)<30)?(Math.round(v*100)/100).toString():Math.round(v).toString(); return CUR+s; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · ØRESUND (Europe · state consortium, self-financing) ---------- */
  oresund:{
    name:'Øresund Bridge', geo:'Denmark ⇄ Sweden', continent:'Europe', cur:'DKK ', geoKey:'oresund',
    lede:'A 16&nbsp;km bridge-and-tunnel between Copenhagen and Malmö, built by a 50/50 Danish–Swedish state consortium and repaid entirely by its own tolls — the textbook <b>self-financing</b> fixed link.',
    s1:'<p class="body">A <b>fixed link</b> replaces a ferry with a permanent crossing — a bridge, a tunnel, or both. The Øresund link runs <b>15.9&nbsp;km</b> coast to coast: a 7.8&nbsp;km cable-stayed bridge from Sweden onto the artificial island of <b>Peberholm</b>, then a 4&nbsp;km immersed tunnel under the Drogden shipping channel into Denmark — the tunnel keeps the crossing clear of Copenhagen Airport\'s flight paths.</p>'+
       '<p class="body">It carries a four-lane motorway over a double-track railway, and turned two cities into one labour market: the <b>Øresund region</b>. The investment question is unusually clean, because the link was deliberately built to <b>pay for itself</b> — no operating subsidy, just toll and rail income retiring the debt that built it.</p>',
    facts:[['15.9 km','Coast to coast','bridge + tunnel'],['7.8 km','Cable-stayed bridge','490 m main span'],['4.0 km','Drogden tunnel','immersed tube'],['~DKK 19.6 bn','All-in cost','state-guaranteed debt'],['~20,700','Vehicles / day','record 2024'],['Jul 2000','Opened','road &amp; rail']],
    s2:'Physically it is the simplest asset on this list: cars and trucks pay at the toll plaza on the Swedish side and drive across. The owner, <b>Øresundsbro Konsortiet</b>, is split 50/50 between the Danish and Swedish states. Its genius is financial, not structural — it was built with <b>government-guaranteed market loans</b> and repays them out of <b>road tolls plus a fixed, indexed payment for the railway</b>. Drag the toll and traffic below; the rail payment stays put while the road revenue swings.',
    driverLab:'Toll / car', availLab:'Heavy share', hrK:'Toll value /hr', yrS:'road tolls + rail payment',
    preset:'Load the Øresund Bridge',
    try:'<b>Try this:</b> the list price for a car is about <b>DKK 470</b>, but most drivers use the discounted ØresundGO subscription, so the <i>realised</i> toll is far lower — the slider sits at that blended level. Push traffic up and watch revenue climb almost one-for-one: with costs nearly fixed, an extra crossing is almost pure margin.',
    s3:'A fixed link is a near-perfect monopoly: there is no parallel route across the strait but a slow ferry. So the model is a <b>real-toll</b> one — the owner keeps every crossing\'s toll and takes the traffic risk. Øresund layers on a second, steadier stream: the rail operators pay a <b>fixed, inflation-indexed charge</b> (DKK&nbsp;589m in 2024) for use of the railway, independent of how many trains run. Road tolls (DKK&nbsp;1,767m) plus that rail payment are what retire the debt.',
    mb:{tag:'Model B · state consortium',title:'Self-financing state link',body:'Two governments build the link through a jointly-owned company using <b>market debt that they guarantee</b> — so it borrows cheaply — then repay it purely from user revenue, with <b>no subsidy</b>. There is no private equity and no fixed concession end: the consortium simply runs until the debt is gone (projected ~2035). <b>This is Øresund</b> — owned 50/50 by Denmark and Sweden.'},
    s4a:'Once built, a bridge is astonishingly cheap to run — inspection, maintenance, a major-works reserve and toll collection, and little else. So the operating margin is very high and most of the revenue drops to EBITDA. The waterfall below is live from the model above.',
    wfNote:'Operating cost is the standing upkeep of the bridge, tunnel and toll plaza — a fixed base that barely moves with traffic. That is why a busy crossing is so profitable and a quiet one still covers its costs; the swing factor is the debt service, not the running cost.',
    s4b:'Building it was the expensive part: about <b>DKK 19.6&nbsp;billion</b> all-in for the coast-to-coast link (plus separate land works on each side). Because both states <b>guarantee the debt jointly and severally</b>, the consortium borrows at near-sovereign rates and carries almost no equity — the whole structure is engineered to be repaid by tolls.',
    stackH:'The capital stack · ~DKK 19.6 bn', splitL:'Ownership', splitR:'state consortium',
    split:[['s1',50,'Denmark · A/S Øresund 50%'],['s2',50,'Sweden · Svedab 50%']],
    finList:[['','State-guaranteed market loans (bonds + banks)','~DKK 19.6bn'],['sub','Jointly &amp; severally guaranteed by both states','near-sovereign rate'],['','Net interest-bearing debt (end-2024)','~DKK 5.3bn'],['sub','Road revenue 2024','DKK 1,767m'],['sub','Rail payment 2024 (indexed, fixed)','DKK 589m'],['rest','Projected debt-free','~2035'],['rest','Danish land works (financed separately)','~DKK 5.4bn']],
    finNote:'There is essentially <b>no equity and no subsidy</b> — the guarantee is the trick. The states lend their credit, not their cash; tolls and the rail payment do the rest, and the surplus each year retires debt. By end-2024 net debt was down to ~DKK&nbsp;5.3bn, from a build cost near DKK&nbsp;20bn.',
    timeline:[['Mar 1991','<b>Danish–Swedish treaty</b> to build the Fixed Link; the consortium is established.'],['1995','<b>Construction starts</b> — bridge, the Peberholm island and the Drogden tunnel.'],['1999','<b>Structurally complete</b> — bridge and tunnel joined; rail link laid.'],['Jul 2000','<b>Opened to road and rail traffic.</b>'],['2017 / 2024','<b>Successive traffic records</b> — 2024 a new high at ~7.6m vehicles.'],['~2035','<b>Projected debt repayment</b> for the bridge consortium (estimate).']],
    calcNote:'A working model of the investment case. Year-1 revenue and EBITDA flow from the live map above — change the <b>toll</b>, traffic or heavy share and everything here moves. Because the rail payment and a near-fixed cost base sit underneath, the cash flow is stable; the <b style="color:#0c6b4f">unlevered IRR</b> sits in the core-infrastructure range.',
    s6:'Øresund is the cleanest illustration of why a critical crossing is prized: a monopoly cash flow, a tiny fixed cost base, and a financing structure built to retire its own debt. What still moves the result:',
    breakers:['<b>Traffic</b> — cross-border commuting and tourism drive the road toll; a soft economy on either side bites directly.','<b>The toll vs elasticity</b> — Øresund\'s headline price is among the world\'s highest; discounting (ØresundGO) trades price for volume.','<b>Rates &amp; inflation</b> — debt service and the indexed rail payment both move with rates, and lower inflation in 2024 accelerated deleveraging.','<b>Competition</b> — ferries, and one day the Fehmarn Belt link to Germany, could reshape regional flows.'],
    src:'Figures from the operator and public sources: <a href="https://www.oresundsbron.com/en/about-oresundsbron/about-us/facts-about-oresundsbron" target="_blank" rel="noopener">Øresundsbron — Facts</a>, its <a href="https://www.oresundsbron.com/en/about-oresundsbron/about-us/financing" target="_blank" rel="noopener">financing pages</a> and <a href="https://www.oresundsbron.com/" target="_blank" rel="noopener">2024 Annual Report</a> (Øresundsbro Konsortiet), <a href="https://sundogbaelt.dk/en/" target="_blank" rel="noopener">Sund &amp; Bælt</a> on construction cost, and the <a href="https://www.gihub.org/" target="_blank" rel="noopener">Global Infrastructure Hub</a> case study.',
    econ:{cur:'DKK ',hgvMult:2.4,anc:0,fixed:589,
      trafficDef:20700,trafficMin:8000,trafficMax:35000,trafficStep:500,
      tollDef:205,tollMin:100,tollMax:470,tollStep:5,
      heavyDef:13,heavyMin:5,heavyMax:25},
    opex:{inspect:120,major:80,collect:0.004,admin:45,concRate:0},
    calc:{build:19600,grant:0,capex:4,revG:2,floor:1500,cap:4500,tax:22,exit:10,lev:6,rd:4,amort:2,hold:25},
    map:{
      home:['Denmark','Sweden'],
      labels:[['DENMARK',12.54,55.66,'land'],['SWEDEN',12.995,55.70,'land'],['COPENHAGEN',12.575,55.71,'context'],['MALMÖ',13.02,55.59,'context'],['ØRESUND',12.80,55.49,'sea']],
      nodeA:{lng:12.708,lat:55.619,label:'Kastrup',sub:'Copenhagen · tunnel portal',below:false},
      nodeB:{lng:12.899,lat:55.566,label:'Lernacken',sub:'Malmö · landing',below:true},
      route:[[12.708,55.619],[12.745,55.601],[12.80,55.585],[12.86,55.574],[12.899,55.566]],
      footer:'Cable-stayed bridge + immersed tunnel · road over rail · 15.9 km'}
  },

  /* ---------- 2 · CONFEDERATION (North America · DBFO P3 + subsidy) ---------- */
  confed:{
    name:'Confederation Bridge', geo:'New Brunswick ⇄ PEI', continent:'North America', cur:'C$', geoKey:'confed',
    lede:'A 12.9&nbsp;km concrete crossing of the ice-choked Northumberland Strait — Canada\'s first big modern <b>P3</b>, where a fixed federal subsidy and toll revenue together repaid 30-year bonds.',
    s1:'<p class="body">When Prince Edward Island swapped its constitutional right to a ferry for a bridge, it created a textbook <b>public-private partnership</b>. The Confederation Bridge is a <b>12.9&nbsp;km</b> post-tensioned concrete box-girder structure — the longest bridge over ice-covered water anywhere — linking PEI to the mainland at Cape Jourimain, New Brunswick.</p>'+
       '<p class="body">A private consortium, <b>Strait Crossing</b>, designed, built, financed and now operates it under a <b>35-year concession</b>. In 2032 it reverts to the Government of Canada. The clever part is how it was paid for: the old ferry subsidy was <b>monetised</b> into a fixed annual payment that, with the tolls, services the debt.</p>',
    facts:[['12.9 km','Length','longest over sea ice'],['35 yr','Concession','reverts to Crown 2032'],['~C$1.0 bn','Build cost','~1997'],['C$41.9 m','Federal subsidy /yr','CPI-indexed'],['~C$661 m','Real-return bonds','30-year'],['1997','Opened','31 May']],
    s2:'Tolls are collected only when you <b>leave</b> the Island — a single charge for the round trip — so the bridge is free to enter PEI and tolled to leave. The car toll was <b>C$50.25</b> until the federal government cut it to <b>C$20</b> in August 2025. The model below runs on the effective per-crossing toll; the headline rate sits behind the facts strip. Drag traffic and toll, and notice the federal subsidy underneath holds the revenue up even when the tolls are thin.',
    driverLab:'Toll (effective)', availLab:'Heavy share', hrK:'Toll + subsidy /hr', yrS:'toll + federal subvention',
    preset:'Load the Confederation Bridge',
    try:'<b>Try this:</b> drag the toll down to the floor — revenue doesn\'t collapse, because the <b>CPI-indexed C$41.9m federal payment</b> sits underneath it. That subsidy is what made the bonds financeable: it converts a low-traffic rural crossing into a near-availability cash flow.',
    s3:'Confederation earns two ways. First, <b>real tolls</b> from a captive market — there is no other fixed link to the Island. Second, a <b>fixed federal subsidy</b> of C$41.9m a year (in 1992 dollars, indexed to inflation), which is the monetised value of the ferry service the Crown was constitutionally bound to provide. Together they repay <b>30-year real-return bonds</b>. It is a hybrid: part traffic-risk toll road, part availability-style P3.',
    mb:{tag:'Model B · DBFO concession',title:'P3 with a fixed subvention',body:'A private consortium <b>designs, builds, finances and operates</b> the asset for a fixed term, repaid by a blend of user tolls and a <b>government availability payment</b>, then hands it back with no residual value to itself. Returns are bond-like and front-loaded into the concession window. <b>This is Confederation</b> — Strait Crossing, 35 years to 2032, then the Crown.'},
    s4a:'A long marine bridge in a harsh climate costs more to keep than a sheltered one — ice loading, salt, and a 12.9&nbsp;km deck to inspect — but the cost base is still small against the revenue, and largely fixed. The waterfall shows toll-plus-subsidy revenue, less that upkeep, leaving EBITDA.',
    wfNote:'Operating cost is structural inspection, a major-works reserve for an ageing marine structure, toll collection and insurance. It barely moves with traffic; the real variable underneath EBITDA is the bond amortisation schedule, not the running cost.',
    s4b:'It cost about <b>C$1.0&nbsp;billion</b> to build in the mid-1990s. The financing was the innovation: <b>~C$661m of 30-year real-return bonds</b> (inflation-linked, ~4.5% real) issued through a New Brunswick Crown corporation, serviced by the indexed federal payment and tolls. Equity took the construction and traffic risk; the subsidy de-risked the debt.',
    stackH:'The capital stack · ~C$1.0 bn', splitL:'How it was funded', splitR:'DBFO structure',
    split:[['s1',66,'Real-return bonds 66%'],['s2',34,'Equity + toll revenue']],
    finList:[['','30-year real-return bonds (Strait Crossing Finance)','~C$661m'],['sub','Inflation-linked, ~4.5% real coupon','IG'],['','Federal subsidy (monetised ferry obligation)','C$41.9m/yr'],['sub','In 1992 dollars, indexed to CPI, 35 years','availability-style'],['','Sponsor equity — Strait Crossing','balance'],['rest','2025 toll cut C$50.25 → C$20','federal cost ~C$100m/yr']],
    finNote:'The whole structure turns on one idea: a government that owed a perpetual ferry service instead promised a <b>fixed annual payment</b>, and that promise — not the traffic — is what the bonds were really lent against. The catch for equity: <b>no residual</b>, since the bridge reverts to the Crown in 2032.',
    timeline:[['Jan 1988','<b>PEI plebiscite</b> — 59.4% vote yes to a fixed link.'],['Dec 1992','<b>Project approved</b> after environmental and legal challenges clear.'],['1993','<b>Financial close &amp; construction start</b> — agreement with Strait Crossing.'],['May 1997','<b>Opened to traffic</b> — the ferry service ends.'],['Aug 2025','<b>Federal toll cut</b> from C$50.25 to C$20 per car.'],['2032','<b>Concession ends</b> — ownership reverts to the Government of Canada.']],
    calcNote:'A working model calibrated to a <b>hybrid P3</b>. The federal subsidy is captured as a fixed revenue floor, so the cash flow is steadier than the tolls alone — watch the <b style="color:var(--accent)">levered IRR</b>, since bond-like cash flows support the gearing that manufactures the equity return. Remember the asset reverts to the Crown, so the residual is modest by design.',
    s6:'Confederation shows how a subsidy can turn an uneconomic rural crossing into a financeable asset. The levers that decide the outcome:',
    breakers:['<b>The subsidy</b> — the indexed federal payment is the bedrock cash flow and the reason the bonds priced.','<b>Toll policy</b> — the 2025 cut to C$20 showed how political the toll is; revenue risk sits increasingly with the Crown.','<b>Traffic</b> — tourism and the Island economy drive the toll line; COVID cut it ~74% at its trough.','<b>Reversion</b> — no residual value to equity, so the entire return must be earned inside the 35-year window.'],
    src:'Figures from public sources: <a href="https://www.confederationbridge.com/tolls-fees/" target="_blank" rel="noopener">Confederation Bridge (operator)</a>, <a href="https://tc.canada.ca/en/" target="_blank" rel="noopener">Transport Canada</a> briefings, the <a href="https://www.pbo-dpb.ca/en/publications/LEG-2526-004-S" target="_blank" rel="noopener">Parliamentary Budget Officer</a> on the 2025 toll cut, and a <a href="https://cupe.ca/" target="_blank" rel="noopener">P3 case study</a> on the bond financing. Cost and traffic figures vary by source and are approximate.',
    econ:{cur:'C$',hgvMult:3.0,anc:0,fixed:41.9,
      trafficDef:4500,trafficMin:1500,trafficMax:8000,trafficStep:100,
      tollDef:22,tollMin:4,tollMax:60,tollStep:1,
      heavyDef:14,heavyMin:5,heavyMax:30},
    opex:{inspect:8,major:6,collect:0.5,admin:4,concRate:0},
    calc:{build:1000,grant:0,capex:6,revG:2,floor:50,cap:300,tax:26,exit:6,lev:7,rd:5,amort:3,hold:30},
    map:{
      home:['New Brunswick','Prince Edward Island'],
      labels:[['NEW BRUNSWICK',-64.02,46.00,'land'],['PRINCE EDWARD ISLAND',-63.62,46.41,'land'],['NORTHUMBERLAND STRAIT',-63.93,46.31,'sea']],
      nodeA:{lng:-63.81,lat:46.16,label:'Cape Jourimain',sub:'New Brunswick',below:true},
      nodeB:{lng:-63.69,lat:46.25,label:'Borden-Carleton',sub:'Prince Edward Island',below:false},
      route:[[-63.81,46.16],[-63.78,46.185],[-63.746,46.215],[-63.715,46.237],[-63.69,46.25]],
      footer:'Post-tensioned concrete box-girder · 12.9 km · longest over ice-covered water'}
  },

  /* ---------- 3 · RIO–NITERÓI (South America · privatised toll concession) ---------- */
  rioniteroi:{
    name:'Rio–Niterói Bridge', geo:'Rio de Janeiro ⇄ Niterói', continent:'South America', cur:'R$', geoKey:'rioniteroi',
    lede:'A 13.3&nbsp;km box-girder crossing of Guanabara Bay carrying ~140,000 vehicles a day — and a textbook <b>privatised, traffic-risk</b> toll concession run under a regulated tariff.',
    s1:'<p class="body">Officially the Ponte Presidente Costa e Silva, the <b>Rio–Niterói Bridge</b> spans <b>13.3&nbsp;km</b> across Guanabara Bay, with an 8.8&nbsp;km over-water section and a 300&nbsp;m central navigation span high enough for shipping. Opened in 1974, it is the only fixed road link between Rio de Janeiro and Niterói; the alternative is a ferry.</p>'+
       '<p class="body">Since 2015 it has been operated under a <b>30-year federal concession</b> by <b>Ecoponte</b> (the EcoRodovias group). This is the model most investors mean by a "toll road": a private operator takes the <b>traffic risk</b>, charges a regulated tariff, and is held to a committed investment programme by the regulator, ANTT.</p>',
    facts:[['13.3 km','Length','8.8 km over water'],['~140,000','Vehicles / day','only fixed link'],['30 yr','Concession','2015 → ~2045'],['R$ 1.3 bn','Committed capex','over the term'],['R$ 6.60','Car toll','one-way, ANTT-set'],['1974','Opened','operator Ecoponte']],
    s2:'The toll is charged one way and the bridge is otherwise an ordinary multi-lane crossing — the interest is the <b>concession</b>, not the structure. EcoRodovias won a 2015 auction by bidding the <b>lowest tariff</b>: R$3.28, a 37% discount to the ceiling. The regulated car toll today is about <b>R$6.60</b>, adjusted annually by ANTT. Drag traffic and toll below — but remember the tariff is set by the regulator, so an owner cannot simply raise it.',
    driverLab:'Toll / car', availLab:'Heavy share', hrK:'Toll value /hr', yrS:'a regulated toll concession',
    preset:'Load Rio–Niterói',
    try:'<b>Try this:</b> the heavy-vehicle share matters here — trucks and buses pay by axle, up to ~R$40, several times a car. Nudge the heavy share up and revenue climbs faster than the traffic does. In a real concession, though, the <b>tariff</b> is the regulator\'s to set, so the live lever for an owner is volume, not price.',
    s3:'Rio–Niterói is a <b>real-toll, traffic-risk</b> concession. The operator keeps the toll and lives or dies by the traffic — and with no competing fixed crossing, that traffic is exceptionally reliable. The discipline comes from the regulator: ANTT sets the <b>tariff</b>, adjusts it annually for inflation, and enforces a <b>committed capex programme</b> (~R$1.3bn) in exchange. Upside is volume growth; the price is not the owner\'s to move.',
    mb:{tag:'Model B · regulated concession',title:'Traffic-risk toll concession',body:'A private operator wins a fixed-term concession by competitive auction, takes the <b>full traffic risk</b>, and charges a <b>regulated tariff</b> that the state adjusts for inflation — in return for a binding investment programme. Returns track volume growth and are exposed to <b>emerging-market</b> rates and currency. <b>This is Ecoponte</b> — EcoRodovias, 30 years to ~2045, overseen by ANTT.'},
    s4a:'A toll bridge\'s cost base is small and mostly fixed, so margins are high — but a privatised concession carries two extra running costs a state asset does not: a <b>concession fee</b> to the granting authority and the financing of a committed capex plan. The waterfall shows toll revenue net of those.',
    wfNote:'Operating cost is inspection and maintenance, a major-works reserve, toll collection that scales with traffic, and the regulated concession fee charged on revenue. The margin is high but lower than a sheltered crossing, because the concession itself takes a slice.',
    s4b:'The bridge was built in the 1970s; the relevant capital today is the concessionaire\'s <b>committed investment of ~R$1.3&nbsp;billion</b> over the term, front-loaded into the first years. It was funded with a <b>BNDES</b> long-term loan (~R$417m) plus debentures — financed in reais, which is the point: the return is a high nominal one carried against high local interest rates.',
    stackH:'The capital stack · ~R$1.3 bn committed', splitL:'How it was funded', splitR:'concession financing',
    split:[['s1',60,'BNDES + debentures 60%'],['s2',40,'Sponsor equity']],
    finList:[['','BNDES long-term loan','~R$417m'],['sub','Cost ~ TJLP + 3.48% p.a.','5 sub-credits'],['','Debentures','balance of debt'],['','Sponsor equity — EcoRodovias','~40%'],['sub','Winning bid tariff (2015)','R$3.28 (−37%)'],['rest','Net debt / EBITDA (2024)','~3.9×']],
    finNote:'The committed <b>R$1.3bn</b> capex is the concession\'s real capital base, not the 1974 build cost. Financed in reais against a double-digit cost of debt, the headline nominal return looks racy — but a Brazilian investor discounts it at a double-digit rate too, so the <i>real</i> return is more sober.',
    timeline:[['1969','<b>Construction begins</b> across Guanabara Bay.'],['Mar 1974','<b>Bridge opens</b> — the Rio–Niterói ferry monopoly ends.'],['Mar 2015','<b>ANTT auction</b> won by EcoRodovias (Ecoponte) on the lowest-tariff bid.'],['May 2015','<b>30-year concession signed</b> — committed capex programme begins.'],['2016–20','<b>BNDES financing</b> (~R$417m) and debentures fund the front-loaded works.'],['~2045','<b>Concession ends</b> — the asset returns to the Crown.']],
    calcNote:'A working model calibrated to an <b>emerging-market toll concession</b>, modelled on the concession\'s enterprise value (a multiple of EBITDA) rather than just the committed capex. The tariff floor and cap sit close together because the regulator sets the price; traffic and the heavy-vehicle mix do the work. The cost of debt is high to reflect Brazilian rates, and tax is heavy — so a high nominal return nets down to a sensible real one.',
    s6:'Rio–Niterói is the purest traffic-risk case on this list: a captive market, a regulated price, and a committed capex deal with the state. What drives it:',
    breakers:['<b>Traffic &amp; the economy</b> — with no competing fixed link, volume is reliable but tracks Rio\'s economic cycle and fuel prices.','<b>The tariff &amp; regulator</b> — ANTT sets and indexes the toll; toll rises are politically sensitive, and rebalancing happens through the contract.','<b>Country &amp; currency risk</b> — Brazilian rates and the real, not any technical factor, set the discount rate.','<b>Capex obligations</b> — the committed investment programme and end-of-term rebalancing shape the cash profile.'],
    src:'Figures from public sources: <a href="https://www.ecoviasponte.com.br/" target="_blank" rel="noopener">Ecoponte / Ecovias Ponte (operator)</a>, <a href="https://portal.antt.gov.br/" target="_blank" rel="noopener">ANTT (regulator)</a>, the Brazilian <a href="https://www.gov.br/transportes/" target="_blank" rel="noopener">Ministry of Transport</a> on the 2015 auction, and <a href="https://ri.ecorodovias.com.br/en/" target="_blank" rel="noopener">EcoRodovias</a> investor disclosure on the BNDES financing. Some engineering and revenue figures are approximate.',
    econ:{cur:'R$',hgvMult:2.5,anc:10,fixed:0,
      trafficDef:140000,trafficMin:60000,trafficMax:200000,trafficStep:5000,
      tollDef:6.6,tollMin:2,tollMax:12,tollStep:0.1,
      heavyDef:15,heavyMin:5,heavyMax:30},
    opex:{inspect:30,major:25,collect:0.10,admin:25,concRate:0.05},
    calc:{build:2200,grant:0,capex:5,revG:4,floor:250,cap:600,tax:34,exit:8,lev:3.5,rd:12,amort:4,hold:20},
    map:{
      home:['Rio de Janeiro','Niteroi'],
      labels:[['RIO DE JANEIRO',-43.26,-22.90,'land'],['NITERÓI',-43.078,-22.86,'land'],['GUANABARA BAY',-43.16,-22.805,'sea'],['ATLANTIC',-43.175,-22.96,'seafaint']],
      nodeA:{lng:-43.196,lat:-22.882,label:'Caju',sub:'Rio de Janeiro',below:true},
      nodeB:{lng:-43.123,lat:-22.893,label:'São Domingos',sub:'Niterói',below:true},
      route:[[-43.196,-22.882],[-43.172,-22.868],[-43.148,-22.874],[-43.123,-22.893]],
      footer:'Prestressed-concrete &amp; steel box-girder · 13.3 km · 300 m navigation span'}
  },

  /* ---------- 4 · SYDNEY HARBOUR (Oceania · government-owned tolling) ---------- */
  sydney:{
    name:'Sydney Harbour Bridge', geo:'Sydney, Australia', continent:'Oceania', cur:'A$', geoKey:'sydney',
    lede:'The world\'s most famous steel arch — and a reminder that on a <b>government-owned</b> crossing the toll is a public revenue and congestion lever, not a private return.',
    s1:'<p class="body">The <b>Sydney Harbour Bridge</b> is a 503&nbsp;m steel through-arch carrying eight road lanes, two rail tracks and a footway across Port Jackson, between Dawes Point in the south and Milsons Point in the north. Opened in 1932, it is owned by the <b>New South Wales government</b> and operated by Transport for NSW — not a private concession.</p>'+
       '<p class="body">That ownership changes the investment lens entirely. The original construction debt was finally repaid in <b>1988</b>, yet the toll stayed — redirected to fund the parallel Harbour Tunnel and as ongoing state revenue. Here the toll is a <b>policy instrument</b>: a way to manage congestion and raise money for the network, not to earn an equity return.</p>',
    facts:[['503 m','Arch span','single steel arch'],['1,149 m','Total length','8 lanes + 2 rail'],['~160,000','Vehicles / day','all crossings'],['1932','Opened','debt repaid 1988'],['A$ 4.41','Peak toll','southbound only'],['NSW','Owner','public asset']],
    s2:'Only <b>southbound</b> traffic is tolled (since 1970), and the price varies by time of day — A$4.41 at peak, less off-peak — a deliberate congestion lever. Unusually, there is <b>no heavy-vehicle premium</b>: trucks pay the same flat toll as cars. The model below runs on the tolled southbound flow. Drag it, but remember the owner is a government setting price for policy, not profit.',
    driverLab:'Toll (southbound)', availLab:'Heavy share', hrK:'Toll value /hr', yrS:'to the State of NSW',
    preset:'Load the Sydney Harbour Bridge',
    try:'<b>Try this:</b> raise the heavy-vehicle share and revenue barely moves — because the Bridge charges trucks the <b>same flat toll</b> as cars, almost uniquely among major crossings. The toll itself was frozen for over a decade for political reasons: on a public asset, the price follows policy, not the market.',
    s3:'A government-owned crossing earns the same toll, but the money flows to the <b>state, not an equity owner</b>. The toll is set to <b>manage demand and fund the wider network</b> — southbound-only, time-of-day pricing, a weekly toll cap for relief — rather than to maximise revenue. Tolling has continued long after the build debt was repaid, which a private concession could never do; here the "return" is public, captured as state revenue and reduced congestion.',
    mb:{tag:'Model B · public asset',title:'Government-owned crossing',body:'The state owns and operates the bridge and keeps the toll, which it sets as a <b>congestion and revenue tool</b>, not to clear a hurdle rate. There is no concession, no equity, and tolling can persist indefinitely. <b>This is Sydney</b> — owned by NSW, tolls flagged to move to two-way charging from 2028 and capped at A$60/week for relief.'},
    s4a:'A 1930s steel structure is a different cost animal: continuous repainting, corrosion control and heritage maintenance make the upkeep materially heavier than a modern concrete bridge. So the operating margin, while still healthy, is the lowest of our examples — much of the toll goes back into keeping the arch standing.',
    wfNote:'Operating cost is dominated by maintaining an ageing heritage steel structure — repainting and corrosion control never stop — plus toll-system and insurance costs. It is a heavier, more fixed cost base than a modern crossing, which compresses the margin.',
    s4b:'The bridge cost about <b>£6.25&nbsp;million</b> in 1932 — a figure that means little today. Modelled on a modern <b>replacement-cost</b> basis (a comparable arch would run into the billions), the toll stream is modest against the capital, which is precisely why no private investor would build it for the return: its value is civic, not financial.',
    stackH:'The capital stack · replacement basis', splitL:'Ownership', splitR:'public',
    split:[['s1',100,'New South Wales — public 100%']],
    finList:[['','Original construction (1932)','~£6.25m'],['sub','Government debt, finally repaid','1988'],['','Tolls retained after repayment','state revenue'],['sub','Cashless tolling since','2009'],['','Weekly toll cap (relief scheme)','A$60/week'],['rest','Two-way tolling flagged','from 2028']],
    finNote:'On a public asset the "capital stack" is really the taxpayer\'s balance sheet. The bridge has been debt-free since 1988, so today\'s tolls are <b>pure revenue to the state</b> — the clearest illustration that a toll can outlive the debt it was meant to repay, because the owner is a government, not a fund.',
    timeline:[['1924','<b>Construction begins</b> on the steel arch.'],['Mar 1932','<b>Bridge opens</b> — tolling begins at sixpence a car.'],['1970','<b>Toll switched to southbound only</b> — a demand-management measure.'],['1988','<b>Construction debt repaid</b> — but the toll is retained.'],['2009','<b>Cashless tolling</b> — cash booths removed.'],['2025 / 2028','<b>Toll rises</b>, weekly cap, and two-way tolling flagged from 2028.']],
    calcNote:'A working model on a <b>replacement-cost</b> basis. Because a government sets the toll for policy, the floor and cap are wide and the revenue is what it is; the point of the exercise is to show how a modest toll values against a large capital base — a <b style="color:#0c6b4f">return</b> that only makes sense when the owner is the public.',
    s6:'The Harbour Bridge is the case where the financial return is almost beside the point. The variables that actually matter here are political:',
    breakers:['<b>Toll policy</b> — the rate is a government decision; it was frozen for ~14 years, then raised, with two-way tolling coming in 2028.','<b>Demand management</b> — southbound-only and time-of-day pricing trade revenue for congestion control against the parallel tunnel.','<b>Heritage maintenance</b> — a 1932 steel arch is a permanent, heavy upkeep liability on the state.','<b>Public value</b> — the real "return" is civic: mobility and network revenue, not an equity IRR.'],
    src:'Figures from public sources: <a href="https://www.myetoll.transport.nsw.gov.au/" target="_blank" rel="noopener">Transport for NSW</a> on tolls, <a href="https://www.transport.nsw.gov.au/" target="_blank" rel="noopener">TfNSW</a> on ownership and the precinct, <a href="https://www.linkt.com.au/" target="_blank" rel="noopener">Linkt</a> on the toll schedule, and <a href="https://www.britannica.com/topic/Sydney-Harbour-Bridge" target="_blank" rel="noopener">Britannica</a> on history and dimensions. Replacement-cost and return inputs are illustrative.',
    econ:{cur:'A$',hgvMult:1.0,anc:0,fixed:0,
      trafficDef:80000,trafficMin:40000,trafficMax:120000,trafficStep:5000,
      tollDef:3.5,tollMin:1,tollMax:8,tollStep:0.1,
      heavyDef:10,heavyMin:3,heavyMax:25},
    opex:{inspect:20,major:18,collect:0.05,admin:10,concRate:0},
    calc:{build:1500,grant:0,capex:8,revG:2.5,floor:0,cap:300,tax:30,exit:16,lev:5,rd:5,amort:2,hold:25},
    map:{
      home:['Australia'],
      labels:[['SYDNEY',151.185,-33.872,'land'],['NORTH SYDNEY',151.185,-33.832,'land'],['SYDNEY HARBOUR',151.244,-33.852,'sea']],
      nodeA:{lng:151.211,lat:-33.856,label:'Dawes Point',sub:'The Rocks · south',below:true},
      nodeB:{lng:151.212,lat:-33.850,label:'Milsons Point',sub:'North Sydney',below:false},
      route:[[151.211,-33.856],[151.2113,-33.8543],[151.2117,-33.8517],[151.212,-33.850]],
      footer:'Steel through-arch · 503 m span · road + rail across Port Jackson'}
  },

  /* ---------- 5 · KING FAHD CAUSEWAY (Middle East · sovereign cross-border) ---------- */
  kingfahd:{
    name:'King Fahd Causeway', geo:'Saudi Arabia ⇄ Bahrain', continent:'Middle East', cur:'SAR ', geoKey:'kingfahd',
    lede:'A 25&nbsp;km sovereign causeway joining Saudi Arabia to the island of Bahrain — a <b>jointly-owned, toll-funded</b> link whose payoff is bilateral trade and tourism, not an IRR.',
    s1:'<p class="body">The <b>King Fahd Causeway</b> is a 25&nbsp;km sequence of bridges and earth-fill embankments across the Gulf of Bahrain, linking the Saudi mainland near Al&nbsp;Khobar to the island nation of Bahrain. Midway sits <b>Passport Island</b>, a man-made island carrying the two countries\' joint border, customs and immigration posts.</p>'+
       '<p class="body">Opened in 1986, it is owned and run by the <b>King Fahd Causeway Authority</b>, a joint Saudi–Bahraini body. It is a <b>sovereign</b> asset: built by Saudi Arabia, operated bilaterally, and tolled — but its real return is the weekend tide of shoppers, tourists and trade between the two Gulf states.</p>',
    facts:[['25 km','Length','bridges + causeway'],['1986','Opened','26 November'],['~US$0.8 bn','Build cost','mid-1980s'],['SAR 35','Car toll','one-way'],['~25,000+','Vehicles / day','seasonal peaks'],['2','Owner states','Saudi · Bahrain']],
    s2:'Most of the route is solid embankment between seven islets, with bridge spans over the navigable channels — cheap to build and to maintain. Drivers pay a toll on crossing and clear the joint border on Passport Island. The car toll is <b>SAR 35</b> one way; heavy vehicles pay more, and there is commercial income on the island (duty-free, restaurants). Drag the sliders — but this is a sovereign asset, so the financial return is a side-effect of the connection it provides.',
    driverLab:'Toll / car', availLab:'Heavy share', hrK:'Toll value /hr', yrS:'toll + island commercial',
    preset:'Load the King Fahd Causeway',
    try:'<b>Try this:</b> push traffic up and down — the causeway\'s flows are intensely <b>seasonal</b>, swelling on Bahraini weekends and holidays. Because the structure is mostly cheap embankment, the cost base hardly moves, so almost the entire toll swing drops to EBITDA. The real "return", though, is the trade and tourism it unlocks.',
    s3:'King Fahd earns a <b>toll</b> on every crossing, plus commercial income on Passport Island. But like the Gulf\'s shared power grid, its value is mostly <b>strategic</b>: a fixed land link between an island state and the Arabian mainland, carrying shoppers, workers and freight that a ferry never could. The toll funds operations and maintenance comfortably; the wider economic return — to two national economies — sits outside any single P&amp;L.',
    mb:{tag:'Model B · sovereign link',title:'Jointly-owned cross-border causeway',body:'Two states build and jointly operate a strategic land link, tolled to cover its costs, with the larger economic payoff — trade, tourism, labour mobility — accruing to the nations, not to a fund. <b>This is King Fahd</b> — funded by Saudi Arabia, run with Bahrain through the Causeway Authority. A second crossing (King Hamad Causeway, road + rail) is planned to relieve it.'},
    s4a:'An embankment causeway is the cheapest way to cross shallow water — there is far less structure to maintain than a long bridge — so the cost base is low and the operating margin very high. The waterfall shows toll-plus-commercial revenue, less the modest upkeep of the bridges, embankments and border facilities.',
    wfNote:'Operating cost is the upkeep of the bridge spans, the embankments and the joint border complex on Passport Island. With most of the route being solid fill rather than structure, maintenance is light and the margin is high.',
    s4b:'It cost roughly <b>US$0.8&nbsp;billion</b> in the mid-1980s, funded by <b>Saudi Arabia</b> as a gift-of-state gesture and run jointly thereafter. There is no concession and no private equity — it is a balance-sheet asset of two governments, where the toll exists to keep the link self-sustaining rather than to clear a return hurdle.',
    stackH:'The capital stack · ~US$0.8 bn', splitL:'Funding &amp; ownership', splitR:'sovereign',
    split:[['s1',100,'Saudi Arabia — funded; jointly operated']],
    finList:[['','Saudi state funding (construction)','~US$0.8bn'],['sub','Lead contractor — Ballast Nedam','1981–86'],['','Operated by King Fahd Causeway Authority','Saudi · Bahrain'],['sub','Joint border on Passport Island','customs &amp; immigration'],['','Toll — car one-way','SAR 35'],['rest','King Hamad Causeway (road + rail)','planned relief']],
    finNote:'There is no return hurdle here: the causeway was <b>funded by one sovereign</b> and operated by two. The toll keeps it self-sustaining, but the investment thesis is national, not financial — which is why a planned second crossing is justified on capacity and connectivity, not on a projected IRR.',
    timeline:[['Jul 1981','<b>Saudi–Bahrain agreement</b> signed to build the causeway.'],['1981','<b>Construction begins</b> — lead contractor Ballast Nedam.'],['1986','<b>Completed</b> across the Gulf of Bahrain.'],['Nov 1986','<b>Opened to traffic</b> — the first fixed link to Bahrain.'],['2010s','<b>Traffic growth</b> — heavy seasonal weekend and holiday peaks.'],['2020s','<b>King Hamad Causeway</b> (road + rail) planned to relieve capacity.']],
    calcNote:'A working model on a <b>sovereign</b> asset, modelled on a modern replacement-cost basis (the 1980s build figure means little today). With tax effectively nil and a very low cost base, the modelled return looks healthy — but the causeway is not run for that return; the figures simply show how comfortably the toll covers a cheaply-built crossing. The real case is bilateral connectivity.',
    s6:'The King Fahd Causeway is a reminder that a crossing\'s value can be geopolitical. Its commercial return is incidental; the case is connection. What moves it:',
    breakers:['<b>Bilateral demand</b> — weekend and holiday flows between Saudi Arabia and Bahrain dominate, so revenue is seasonal and relations-sensitive.','<b>Capacity</b> — the single corridor is near saturation; the planned King Hamad Causeway would divert future toll share.','<b>Cost base</b> — a cheap embankment causeway keeps maintenance low and the margin high.','<b>Strategic, not financial</b> — the asset exists for connectivity; tolls fund operations, not a market IRR.'],
    src:'Figures from public sources: the <a href="https://www.kfca.com.sa/" target="_blank" rel="noopener">King Fahd Causeway Authority</a>, <a href="https://saudipedia.com/en/article/1130/government-and-politics/transport/king-fahd-causeway" target="_blank" rel="noopener">Saudipedia</a>, regional reporting on the toll schedule, and the contractor <a href="https://www.ballast-nedam.com/" target="_blank" rel="noopener">Ballast Nedam</a>. Traffic figures are dated (2010-era) and approximate; current volumes are higher.',
    econ:{cur:'SAR ',hgvMult:2.0,anc:30,fixed:0,
      trafficDef:30000,trafficMin:10000,trafficMax:60000,trafficStep:1000,
      tollDef:35,tollMin:10,tollMax:70,tollStep:1,
      heavyDef:12,heavyMin:5,heavyMax:25},
    opex:{inspect:25,major:20,collect:0.5,admin:30,concRate:0},
    calc:{build:4000,grant:0,capex:4,revG:2,floor:0,cap:900,tax:0,exit:11,lev:3,rd:5,amort:3,hold:25},
    map:{
      home:['Saudi Arabia','Bahrain'],
      labels:[['SAUDI ARABIA',50.00,26.40,'land'],['BAHRAIN',50.55,26.31,'land'],['GULF OF BAHRAIN',50.30,26.40,'sea']],
      nodeA:{lng:50.10,lat:26.18,label:'Al Khobar',sub:'Saudi Arabia',below:true},
      nodeB:{lng:50.44,lat:26.15,label:'Jasra',sub:'Bahrain',below:true},
      route:[[50.10,26.18],[50.20,26.19],[50.285,26.20],[50.36,26.17],[50.44,26.15]],
      footer:'Bridges + earth-fill causeway · 25 km · joint border on Passport Island'}
  },

  /* ---------- 6 · HONG KONG–ZHUHAI–MACAU (China · strategic megaproject) ---------- */
  hzmb:{
    name:'Hong Kong–Zhuhai–Macau Bridge', geo:'Pearl River Estuary', continent:'China', cur:'¥', geoKey:'hzmb',
    lede:'The world\'s longest sea crossing — 55&nbsp;km of bridge, tunnel and artificial islands across the Pearl River — and the clearest case where the return is <b>strategic, not commercial</b>.',
    s1:'<p class="body">The <b>Hong Kong–Zhuhai–Macau Bridge</b> is a 55&nbsp;km link system across the Pearl River Estuary: a ~29.6&nbsp;km main bridge, a <b>6.7&nbsp;km immersed undersea tunnel</b> dipping between <b>two artificial islands</b> to keep the main shipping channel clear, and link roads to boundary ports in three jurisdictions — Hong Kong, Macau and mainland Zhuhai.</p>'+
       '<p class="body">Opened in 2018, it was built and funded by the <b>three governments</b>. It is the most expensive crossing on this list by far, yet carries modest traffic — because private cars need permits and the three sides run different systems. Its purpose is <b>regional integration</b> of the Greater Bay Area; toll cash was never going to repay it.</p>',
    facts:[['55 km','Link system','longest sea crossing'],['6.7 km','Undersea tunnel','between 2 islands'],['~¥120 bn','Total cost','tripartite + loans'],['¥150','Car toll','one-way'],['~11,000','Vehicles / day','ramping post-2023'],['2018','Opened','24 October']],
    s2:'Driving it is not like any other bridge here: <b>private-car access is permit-and-quota based</b>, and a "Northbound Travel" scheme from 2023 has only recently let eligible Hong Kong and Macau cars drive to Guangdong freely. The car toll is <b>¥150</b>, with holiday toll-free promotions. Drag the sliders — but the structural cost is so vast that even strong traffic leaves the financial return deeply underwater. That is the lesson.',
    driverLab:'Toll / car', availLab:'Heavy share', hrK:'Toll value /hr', yrS:'a strategic, non-commercial return',
    preset:'Load the HZMB',
    try:'<b>Try this:</b> wind the toll and traffic to their maximum and watch the returns model — the IRR stays dismal, because <b>¥120&nbsp;billion</b> of capital simply cannot be repaid by a modest toll on a few thousand cars a day. This is the point: HZMB was never a toll business. Its return is the Greater Bay Area it stitches together.',
    s3:'HZMB does earn a toll — ¥150 a car, more for buses and trucks — but the revenue is trivial against the capital. Its value is <b>strategic</b>: binding Hong Kong, Macau and the mainland into one economic zone, cutting a four-hour road trip to forty minutes, and serving logistics, tourism and integration. Traffic upside is <b>policy-driven</b> (quota liberalisation), not organic. The "return" is regional GDP, captured by governments, not a P&amp;L.',
    mb:{tag:'Model B · strategic asset',title:'Government-funded megaproject',body:'Three governments fund a nation-building crossing whose payoff is <b>economic integration</b>, not toll cash; commercial returns are explicitly low, and demand is shaped by cross-border policy and quotas. <b>This is HZMB</b> — funded ~42% by tripartite government contributions and ~58% by bank loans, operated by the HZMB Authority for the Greater Bay Area, not for a hurdle rate.'},
    s4a:'A 55&nbsp;km crossing with an immersed tunnel and two artificial islands, in a typhoon-exposed, heavily-trafficked estuary, is an enormous thing to maintain — so the operating cost base is large and the margin, against a modest toll, is the thinnest on this list. The waterfall makes the mismatch visible.',
    wfNote:'Operating cost is the upkeep of 55 km of structure — bridge, immersed tunnel, two islands and boundary facilities — in a harsh marine, typhoon-prone setting. It is a heavy, largely fixed base that swallows much of a modest toll, which is why the margin is so much lower than a simple bridge.',
    s4b:'The link cost roughly <b>¥120&nbsp;billion</b>. About <b>42%</b> came as direct contributions from the mainland, Hong Kong and Macau governments; the remaining <b>~58%</b> as commercial bank loans. There is no private equity and no expectation of a market return — the contributions are, in effect, public capital written off against a strategic objective.',
    stackH:'The capital stack · ~¥120 bn', splitL:'How it was funded', splitR:'tripartite + debt',
    split:[['s1',42,'Government contributions 42%'],['s2',58,'Bank loans 58%']],
    finList:[['','Government contributions (tripartite)','~42%'],['sub','Mainland + Guangdong','largest share'],['sub','Hong Kong','~HK$6.75bn'],['sub','Macau','~MOP1.98bn'],['','Commercial bank loans','~58%'],['rest','Toll — car one-way','¥150']],
    finNote:'The funding structure says it all: <b>two-fifths is a government grant in all but name</b>, and the toll was never sized to repay the loans on commercial terms. HZMB is a sovereign investment in regional integration; the financial "stack" is really a public-spending decision dressed as infrastructure.',
    timeline:[['Dec 2009','<b>Construction begins</b> on the link system.'],['Feb 2018','<b>Main bridge completed</b> and handed over.'],['Oct 2018','<b>Opened to traffic</b> — three jurisdictions joined.'],['2020','<b>COVID border closures</b> suppress cross-boundary traffic.'],['2023','<b>Borders reopen; "Northbound Travel" scheme</b> launches — traffic surges.'],['2024–25','<b>Record volumes</b> — ~93m cumulative trips by 2025.']],
    calcNote:'A working model that deliberately shows a <b>strategic</b> asset failing the commercial test. Push traffic and toll as hard as you like: against ~¥120bn of capital, the <b style="color:#0c6b4f">IRR</b> stays far below any hurdle. The grant input captures the government contributions; even net of those, the toll cannot carry the structure. The return here is national, not financial.',
    s6:'HZMB is the limit case of the strategic crossing: magnificent engineering, immaterial toll economics. What actually drives its value:',
    breakers:['<b>Policy &amp; quotas</b> — traffic is liberated by cross-border schemes, not organic growth; the demand lever is political.','<b>Strategic payoff</b> — the return is Greater Bay Area integration — logistics, tourism, GDP — not toll cash.','<b>Cost base</b> — 55 km of bridge, tunnel and islands in a typhoon-exposed estuary is a permanent, heavy maintenance liability.','<b>Governance</b> — three legal, customs and currency systems add friction that a single-jurisdiction bridge never faces.'],
    src:'Figures from public sources: the <a href="https://www.hzmb.gov.hk/en/" target="_blank" rel="noopener">HZMB Authority</a> and <a href="https://www.info.gov.hk/" target="_blank" rel="noopener">Hong Kong government</a> on tolls and access, and trade reporting on traffic and the cost split. Cost figures vary with scope (main bridge vs whole link) and are approximate.',
    econ:{cur:'¥',hgvMult:1.3,anc:0,fixed:0,
      trafficDef:11000,trafficMin:3000,trafficMax:40000,trafficStep:500,
      tollDef:150,tollMin:60,tollMax:300,tollStep:5,
      heavyDef:25,heavyMin:8,heavyMax:40},
    opex:{inspect:200,major:150,collect:0.5,admin:80,concRate:0},
    calc:{build:120000,grant:50000,capex:6,revG:5,floor:0,cap:3000,tax:25,exit:10,lev:2,rd:4,amort:2,hold:30},
    map:{
      home:['Hong Kong','Zhuhai'],
      labels:[['HONG KONG',113.985,22.20,'land'],['ZHUHAI',113.45,22.30,'land'],['MACAU',113.555,22.135,'context'],['LANTAU',113.905,22.225,'context'],['PEARL RIVER ESTUARY',113.71,22.37,'sea']],
      nodeA:{lng:113.95,lat:22.31,label:'HK Port',sub:'Chek Lap Kok',below:false},
      nodeB:{lng:113.53,lat:22.13,label:'Zhuhai–Macau',sub:'boundary port',below:true},
      route:[[113.95,22.31],[113.86,22.25],[113.79,22.20],[113.73,22.21],[113.64,22.17],[113.53,22.13]],
      footer:'Bridge · 6.7 km immersed tunnel · two artificial islands · 55 km'}
  }
  };
  var ORDER=['oresund','confed','rioniteroi','sydney','kingfahd','hzmb'];

  /* ===================================================================
     MAP RENDERER  (canvas)
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), MPAD=22, T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  var PROJ=null;
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
  function vehicle(p,ang,heavy,col){
    var w=heavy?12:7, h=heavy?5:4;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(ang);
    ctx.fillStyle=col; if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(-w/2,-h/2,w,h,1.4); ctx.fill(); }
    else ctx.fillRect(-w/2,-h/2,w,h);
    ctx.fillStyle='rgba(255,244,210,0.9)'; ctx.fillRect(w/2-1.4,-h/2+0.4,1.4,h-0.8); // headlight
    ctx.restore();
  }
  function tollBadge(x,y){
    var pulse=0.5+0.5*Math.sin(T*0.08);
    ctx.save();
    ctx.strokeStyle='rgba(12,107,79,'+(0.25+0.35*pulse)+')'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(x,y,11+pulse*3,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#0c6b4f'; if(ctx.roundRect){ctx.beginPath(); ctx.roundRect(x-17,y-22,34,13,3); ctx.fill();} else ctx.fillRect(x-17,y-22,34,13);
    ctx.fillStyle='#dff3ea'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('TOLL',x,y-12.5);
    ctx.fillStyle='#fff'; ctx.strokeStyle='#0c6b4f'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.restore();
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
    var cap=parseFloat(sCap.value), toll=parseFloat(sSpread.value), heavy=parseFloat(sAvail.value)/100;

    // ---- draw base ----
    ctx.clearRect(0,0,W,H);
    var sea=ctx.createLinearGradient(0,0,0,H); sea.addColorStop(0,'#e3eef4'); sea.addColorStop(1,'#cadeea');
    ctx.fillStyle=sea; ctx.fillRect(0,0,W,H);
    var span=PROJ.LNG1-PROJ.LNG0, gstep=span<0.2?0.05:(span<1?0.1:(span<6?1:2));
    ctx.strokeStyle='rgba(90,140,180,0.10)'; ctx.lineWidth=1;
    for(var lg=Math.ceil(PROJ.LNG0/gstep)*gstep; lg<=PROJ.LNG1; lg+=gstep){ var gx=PX(lg); ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }
    for(var la=Math.ceil(PROJ.LAT0/gstep)*gstep; la<=PROJ.LAT1; la+=gstep){ var gy=PY(la); ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke(); }
    // land
    GEO[A.geoKey].polys.forEach(function(p){
      var homeP = M.home.indexOf(p[0])>=0;
      poly(p[1]); ctx.fillStyle = homeP?'#d8e8dc':'#e6e9e5';
      ctx.fill(); ctx.strokeStyle = homeP?'rgba(12,107,79,0.38)':'rgba(90,110,100,0.34)'; ctx.lineWidth=homeP?1.1:1; ctx.stroke();
    });
    // labels
    M.labels.forEach(function(l){ var st=LSTY[l[3]]||LSTY.land; ctx.fillStyle=st[0]; ctx.font=st[1]; ctx.textAlign='center'; ctx.fillText(l[0],PX(l[1]),PY(l[2])); });

    // route (the deck)
    var pr=projRoute(M.route), meta=routeLen(pr);
    ctx.lineCap='round';
    ctx.strokeStyle='rgba(20,32,29,0.16)'; ctx.lineWidth=8; drawRouteLine(pr); ctx.stroke();
    ctx.strokeStyle='#243a32'; ctx.lineWidth=3; drawRouteLine(pr); ctx.stroke();
    ctx.strokeStyle='rgba(232,236,240,0.5)'; ctx.lineWidth=1; drawRouteLine(pr); ctx.stroke();
    ctx.lineCap='butt';

    // ---- traffic: vehicles both ways ----
    var n=Math.max(5,Math.min(46,Math.round(cap/1100)));
    var spd=0.006*(0.55+Math.min(1,cap/40000));
    var eps=0.012;
    for(var k=0;k<n;k++){
      var dir=k%2;                                   // 0 = A→B, 1 = B→A
      var base=(T*spd + k/n)%1, t=dir?base:1-base;
      var p=ptAt(pr,meta,t), p2=ptAt(pr,meta,Math.min(1,Math.max(0,t+(dir?eps:-eps))));
      var ang=Math.atan2(p2.y-p.y,p2.x-p.x);
      var isHeavy=((k*37)%100) < heavy*100;
      var off=dir?3:-3, nx=Math.cos(ang+Math.PI/2)*off, ny=Math.sin(ang+Math.PI/2)*off;
      vehicle({x:p.x+nx,y:p.y+ny},ang,isHeavy,isHeavy?'#b07d24':'#0c6b4f');
    }

    // toll plaza at mid-span
    var mid=ptAt(pr,meta,0.5);
    tollBadge(mid.x,mid.y);

    station(PX(M.nodeA.lng),PY(M.nodeA.lat),M.nodeA.label,M.nodeA.sub,M.nodeA.below);
    station(PX(M.nodeB.lng),PY(M.nodeB.lat),M.nodeB.label,M.nodeB.sub,M.nodeB.below);

    // north arrow + caption
    ctx.save(); ctx.translate(W-28,32); ctx.strokeStyle='#6a7570'; ctx.fillStyle='#6a7570'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,-9); ctx.lineTo(0,8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(-3.5,-5); ctx.lineTo(3.5,-5); ctx.closePath(); ctx.fill();
    ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('N',0,18); ctx.restore();
    ctx.fillStyle='rgba(40,60,80,0.55)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(M.footer)+' · '+cap.toLocaleString()+' /day',W/2,H-10);

    // ---- economics ----
    var txnsYr=cap*365, light=cap*(1-heavy), heavyV=cap*heavy;
    var tollRev=(light*toll + heavyV*toll*E.hgvMult)*365;
    var grossRev=tollRev + (E.anc||0)*1e6 + (E.fixed||0)*1e6;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e9)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var O=A.opex;
    var c_inspect=O.inspect*1e6, c_major=O.major*1e6, c_collect=O.collect*txnsYr,
        c_admin=O.admin*1e6 + (O.concRate||0)*revenue;
    var opex=c_inspect+c_major+c_collect+c_admin, ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;

    set('ixCapV',cap.toLocaleString()+' /day'); set('ixSpreadV',fmtToll(toll)); set('ixAvailV',Math.round(heavy*100)+'%');
    set('ixDir','≈ '+cap.toLocaleString()); set('ixDirS',Math.round(heavy*100)+'% heavy vehicles');
    set('ixMW',Math.round(cap/24).toLocaleString()+' /hr'); set('ixMWs','average vehicles per hour');
    set('ixHr', revenue<=0?CUR+'0 / hr':money(revenue/HRS)+' / hr');
    set('ixYr', revenue<=0?CUR+'0':'≈ '+money(revenue));

    drawWaterfall(revenue, [['Inspection &amp; maintenance',c_inspect],['Major-works provision',c_major],['Toll collection',c_collect],['Insurance, admin &amp; fee',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the toll revenue is too thin to value against the capital — raise the toll or the traffic, or note that on this asset the return is strategic rather than commercial.</span>'; return; }
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
    A=ASSETS[key]; CUR=A.cur;
    if(ctx) setProj(GEO[A.geoKey].bb);
    set('ixAssetName',A.name); set('ixAssetGeo',A.geo); set('ixCont',A.continent);
    set('ixBarName',A.name);
    html('ixLede',A.lede);
    html('s1body',A.s1);
    html('ixFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    html('s2intro',A.s2);
    set('ixDriverLab',A.driverLab); set('ixAvailLab',A.availLab); set('ixHrK',A.hrK); set('ixYrS',A.yrS);
    set('ixPreset',A.preset); html('ixTry',A.try);
    var E=A.econ;
    sCap.min=E.trafficMin; sCap.max=E.trafficMax; sCap.step=E.trafficStep; sCap.value=E.trafficDef;
    sSpread.min=E.tollMin; sSpread.max=E.tollMax; sSpread.step=E.tollStep; sSpread.value=E.tollDef;
    sAvail.min=E.heavyMin; sAvail.max=E.heavyMax; sAvail.value=E.heavyDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue uses a stylised blended toll and the returns model is a simplified DCF; not a forecast of any specific year\'s traffic, and not investment advice.');
    frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.trafficDef; sSpread.value=E.tollDef; sAvail.value=E.heavyDef; frame(); renderModel(); });
    (function loop(){ T+=1; frame(); requestAnimationFrame(loop); })();
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'oresund');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
