/* Last-mile electricity — data-driven worked examples.
   Six real connection / adoption businesses, one template. Scene config from
   lme-geo.js (GEO), drawn as a top-down new development being energised plot by
   plot in 720x520 scene coords. The interactive figures are illustrative: this is
   NOT a big-RAB network — revenue is a connections annuity (live connections ×
   regulated revenue per connection), and the returns model is a simplified DCF in
   which developer contributions offset the build cost. */
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

  /* ---------- 1 · GTC (Europe · UK IDNO / independent connections) ---------- */
  gtc:{
    name:'GTC', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'gtc',
    lede:'A textbook <b>last-mile connections business</b> — an Independent DNO that builds and adopts the wires inside new housing and commercial developments, then earns a regulated charge on every connection for decades.',
    s1:'<p class="body">When a developer builds a new estate, someone has to lay the cables, set the substation and connect every plot to the grid. That work — the <b>last mile</b> between the regional distribution network and the meter — is increasingly done not by the incumbent DNO but by an <b>Independent Connection Provider (ICP)</b> that builds it and an <b>Independent DNO (IDNO)</b> that <b>adopts</b> and owns it.</p>'+
       '<p class="body"><b>GTC</b> is one of Britain\'s largest, building multi-utility connections (electricity, gas, water, fibre) into new developments and adopting the electricity network as a licensed IDNO. The economics are unusual and attractive: the <b>developer largely funds the build</b>, so the IDNO\'s net capital per connection is small, and in return it earns the regulated <b>use-of-system</b> charge — capped at the host DNO\'s level under Ofgem\'s relative price control — on every connection, indexed, for the life of the asset.</p>',
    facts:[['IDNO','Licence','adopts the network'],['400k+','Connections','and growing'],['Developer','Funds the build','low net capex'],['Ofgem RPC','Cap','at host DNO level'],['Multi-utility','Scope','power · gas · water · fibre'],['Infra fund','Owner','long-life annuity']],
    s2:'Watch the development fill. Power arrives at the <b>point of connection</b> to the host grid, runs down the spine cable into the site, and each plot lights up as it is <b>connected and occupied</b>. The owner\'s <b style="color:#0c6b4f">money</b> is the regulated <b>use-of-system charge on every live connection</b> — so the engine is the count of connections and how fast they fill, not how much power flows. Drag the connections, the revenue per connection and the occupancy.',
    driverLab:'Revenue / conn', availLab:'Occupancy', hrK:'Use-of-system', yrS:'live connections × charge',
    ledge:{a:'+ use-of-sys',b:'+ connection',c:'− opex'}, demandLabel:'OCCUPANCY',
    preset:'Load GTC',
    try:'<b>Try this:</b> drop the <b>occupancy</b> and watch revenue fall away — a connections business is an <b>adoption ramp</b>, not a flow meter. Then remember the trick: the <b>developer funds most of the build</b>, so net capex per connection is small and the regulated charge is an inflation-linked annuity. That mix — low net capital, long indexed income — is why IDNOs trade at high multiples.',
    s3:'GTC earns a <b>regulated use-of-system charge</b> on every connection it has adopted (plus a one-off connection income at the point of build, largely funded by the developer). The charge is set by reference to the <b>host DNO\'s published tariff</b> and capped under Ofgem\'s <b>relative price control</b>, then indexed. Because the developer pays for most of the assets, the IDNO\'s return comes less from a return-on-RAB and more from the <b>spread between a small net capital cost and a very long, indexed annuity</b> over a growing connection base.',
    mb:{tag:'Model B · IDNO adoption', title:'Independent DNO (connections annuity)', body:'A licensed independent network that <b>adopts</b> new-build connections funded largely by developers, then earns a regulated use-of-system charge — capped at the host DNO level and indexed — on every connection for the life of the asset. Low net capital, long annuity, volume-light. <b>This is GTC</b> — Ofgem-licensed, infra-fund owned.'},
    s4a:'A connections business is light on operating cost — there is little generation, just the metering, faults and customer service on the adopted network — so the margin on the use-of-system charge is high. The defining number is not opex but the <b>connections pipeline</b>: how many plots are contracted, built and energised, because each one adds an indexed annuity at very little net capital.',
    wfNote:'Operating cost is metering and data, fault response on the adopted network, and a small customer and adoption overhead. It is modest against the use-of-system charge, so the margin is high — but the value is in the connections count and the pace of energisation, not the cost line.',
    s4b:'The capital is the network built into each development — cables, substations and connection assets — but the <b>developer funds the bulk of it</b> through connection charges, so the IDNO\'s <b>net</b> capital per connection is small. That is the whole point: a small net outlay buys a regulated, indexed annuity that runs for decades and grows with every new development adopted.',
    stackH:'The capital · net of developer contributions', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',68,'Developer contributions'],['s2',32,'IDNO net capital']],
    finList:[['','Connections','400k+, growing'],['sub','Licence','IDNO (adopts the network)'],['','Revenue','use-of-system charge, indexed'],['sub','Cap','Ofgem RPC at host DNO level'],['','Net capex / connection','low (developer-funded)'],['rest','Owner','infrastructure fund']],
    finNote:'An IDNO is a <b>connections annuity</b>: small net capital per connection, a long indexed regulated income, and growth from every new development adopted. The risks are housebuilding volumes, the relative-price-control cap, and the price paid per connection at acquisition.',
    timeline:[['2001','<b>Competition in connections</b> opens under Ofgem — ICPs can build new networks.'],['2004','<b>IDNO licences</b> created — independents can adopt and own the network.'],['2010s','<b>Multi-utility connections</b> (power, gas, water, fibre) consolidate the model.'],['2018','<b>Relative price control</b> caps IDNO charges at host DNO level.'],['2020s','<b>Infra-fund consolidation</b> — IDNOs change hands at high multiples.'],['Ongoing','<b>EV &amp; heat-pump loads</b> raise the value of each connection.']],
    calcNote:'A working model of an <b>IDNO connections annuity</b>. The build is the network cost, but developer contributions offset most of it, so the <b>net</b> capital is small; revenue is the indexed use-of-system charge over a growing connection base. The exit multiple is high because the income is long and indexed.',
    s6:'GTC is the connections layer of the energy transition. What moves the return:',
    breakers:['<b>Connections growth</b> — new-build volumes and the pipeline of adopted developments are the engine.','<b>Net capital per connection</b> — how much the developer funds vs the IDNO sets the return.','<b>The RPC cap</b> — Ofgem\'s relative price control sets the ceiling on the use-of-system charge.','<b>Acquisition price</b> — IDNO portfolios trade at high multiples; the price paid per connection is the risk.'],
    src:'Figures from public sources on the UK independent connections / IDNO market: <a href="https://www.gtc-uk.co.uk/" target="_blank" rel="noopener">GTC</a> and the <a href="https://www.ofgem.gov.uk/" target="_blank" rel="noopener">Ofgem</a> framework for competition in connections and the relative price control. The figures are approximate and illustrative.',
    econ:{cur:'£', host:'host DNO', volt:'11 / 0.4 kV',
      connDef:400,connMin:100,connMax:900,connStep:10, revDef:115,revMin:60,revMax:220,revStep:5,
      occDef:82,occMin:40,occMax:100,occStep:1, opexPer:36, fixedOpex:4},
    calc:{build:480,grant:150,capex:12,revG:4,floor:16,cap:90,tax:25,exit:17,lev:6,rd:5.5,amort:2,hold:25},
    map:{footer:GEO.gtc.footer}
  },

  /* ---------- 2 · FLORIDA POWER & LIGHT (North America · IOU new connections) ---------- */
  fpl:{
    name:'Florida Power & Light', geo:'Florida, USA', continent:'North America', cur:'US$', geoKey:'fpl',
    lede:'America\'s largest electric utility, viewed through its growth engine — <b>new connections</b>. In the fastest-growing big state, every new home and business is a connection added to the rate base.',
    s1:'<p class="body"><b>Florida Power &amp; Light (FPL)</b>, the principal subsidiary of <b>NextEra Energy</b>, serves more customers than any US electric utility — roughly <b>6&nbsp;million</b> accounts across Florida. Its last-mile story is <b>growth</b>: Florida adds population and housing faster than almost any state, so FPL is constantly extending the local network and <b>connecting new customers</b>.</p>'+
       '<p class="body">In the US model, a new connection or line extension is part-funded by the customer or developer through a <b>Contribution in Aid of Construction (CIAC)</b>, and the rest enters the utility\'s <b>rate base</b>, earning the allowed return. So each new connection both brings a paying customer and grows the base. FPL is famous for low rates and high reliability achieved through scale and relentless capital deployment — hardening, undergrounding and connecting an ever-larger footprint.</p>',
    facts:[['~6m','Customer accounts','largest in the US'],['Fastest','State growth','new connections'],['CIAC','Funding','customer / developer share'],['Rate base','Recovery','allowed return'],['~10.6%','Allowed ROE','high, settled'],['NEE','Owner','NYSE-listed']],
    s2:'Picture Florida filling in — subdivisions, malls and towers connecting to the grid year after year. Power arrives at the point of connection, the local network extends, and each new account lights up. The owner\'s <b style="color:#0c6b4f">return</b> rises from the connections added to the <b>rate base</b> (part-funded by CIAC), not from how much power flows. Drag the connections, the revenue per connection and the occupancy of the served footprint.',
    driverLab:'Rev / customer', availLab:'Take-up', hrK:'Distribution rev', yrS:'live customers × charge',
    ledge:{a:'+ network rev',b:'+ CIAC',c:'− opex'}, demandLabel:'TAKE-UP',
    preset:'Load FPL',
    try:'<b>Try this:</b> raise the <b>connections</b> — in a high-growth state, customer growth is a structural tailwind no mature utility has. Each new connection is part-funded by <b>CIAC</b> and part added to the rate base at the allowed ROE. Then push the allowed return (rev per customer): the US ~10.6% ROE is why utilities invest so hard. The risk is rate-case settlements and the cost of capital.',
    s3:'FPL earns a <b>state-regulated network revenue</b> set by the Florida PSC on cost-of-service: a return on rate base at the allowed ROE, plus depreciation and opex recovery. The last-mile lever is <b>connections growth</b>: new line extensions are part-funded by customers and developers through CIAC, with the balance entering the rate base. So growth both adds paying customers and compounds the base — the structural advantage of operating in a fast-growing state.',
    mb:{tag:'Model B · IOU connections growth', title:'Investor-owned utility, growth state', body:'A cost-of-service utility whose last-mile growth comes from <b>new connections</b> — part-funded by CIAC, part added to rate base at the allowed ROE. Customer growth is a structural tailwind, and the allowed return is high by global standards. <b>This is FPL / NextEra</b> — the US connections-growth utility.'},
    s4a:'At FPL\'s scale opex is large in absolute terms, but the company is a byword for efficiency — among the lowest cost-per-customer in the US — so the margin is healthy. The defining feature is not the cost line but the <b>connections tailwind</b>: a growing customer base and rate base in a state that keeps adding people.',
    wfNote:'Operating cost is the O&M of a vast network plus storm response and customer service — large in absolute terms but low per customer at FPL\'s scale. The swing factor for value is connections growth and the allowed ROE, not the cost line.',
    s4b:'The capital is an enormous, growing rate base — local network, hardening, undergrounding and the line extensions that connect new customers. New connections are part-funded by <b>CIAC</b> (so the net capital per connection is lower than the gross), with the balance recovered through the rate base at the allowed return over decades.',
    stackH:'The capital · net of CIAC', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',45,'Customer / developer CIAC'],['s2',55,'Rate base (net capital)']],
    finList:[['','Customer accounts','~6m, growing'],['sub','Regulator','Florida PSC (cost-of-service)'],['','Allowed ROE','~10.6%'],['sub','Connection funding','CIAC + rate base'],['','Tailwind','high state population growth'],['rest','Owner','NextEra Energy (NYSE: NEE)']],
    finNote:'A US growth-state IOU is a <b>connections-compounding</b> machine: customer growth plus a high allowed ROE on a rising rate base. The risks are rate-case settlements, storm exposure and the cost of capital — but the demographic tailwind is rare.',
    timeline:[['1925','<b>Florida Power &amp; Light</b> incorporated.'],['1985','<b>Becomes part of FPL Group</b> — later NextEra Energy.'],['2000s','<b>Florida population boom</b> drives sustained connections growth.'],['2010s','<b>Storm hardening &amp; undergrounding</b> programmes scale up.'],['2021','<b>Four-year rate settlement</b> sets the allowed ROE and capital plan.'],['2020s','<b>Continued in-migration</b> sustains the connections tailwind.']],
    calcNote:'A working model of a <b>growth-state IOU</b> through its connections lens, on an enterprise-value basis. Connection growth compounds both customers and rate base; CIAC offsets part of the build. A high allowed ROE lifts the whole return; the risk is the rate case and cost of capital.',
    s6:'FPL is the US connections-growth utility. What drives it:',
    breakers:['<b>Connections growth</b> — Florida\'s in-migration is a structural tailwind few utilities have.','<b>The allowed ROE</b> — the PSC\'s return decision is the biggest lever on value.','<b>CIAC vs rate base</b> — how much of each connection the customer funds shapes the net return.','<b>Storms &amp; cost of capital</b> — hurricane exposure and interest rates are the principal risks.'],
    src:'Figures from public sources: <a href="https://www.fpl.com/" target="_blank" rel="noopener">FPL</a> and <a href="https://www.nexteraenergy.com/" target="_blank" rel="noopener">NextEra Energy</a> investor disclosure, and Florida PSC rate settlements. Distribution-only and connection figures are approximate and illustrative.',
    econ:{cur:'US$', host:'FPL network', volt:'13.8 / 4.16 kV',
      connDef:6000,connMin:3000,connMax:9000,connStep:100, revDef:360,revMin:200,revMax:600,revStep:10,
      occDef:96,occMin:70,occMax:100,occStep:1, opexPer:95, fixedOpex:200},
    calc:{build:24000,grant:6000,capex:30,revG:4,floor:1600,cap:3600,tax:25,exit:12,lev:5,rd:5,amort:1,hold:25},
    map:{footer:GEO.fpl.footer}
  },

  /* ---------- 3 · EQUATORIAL ENERGIA (South America · universalisation) ---------- */
  equatorial:{
    name:'Equatorial Energia', geo:'North & North-East Brazil', continent:'South America', cur:'R$', geoKey:'equatorial',
    lede:'A Brazilian distributor that turned <b>connecting the unconnected</b> into a business — taking on struggling concessions and earning its return by adding connections and cutting losses.',
    s1:'<p class="body"><b>Equatorial Energia</b> built itself by acquiring difficult distribution concessions in the north and north-east of Brazil — regions with lower incomes, high <b>losses</b> (technical and theft) and large numbers of homes not properly connected — and turning them around. The last-mile story here is <b>universalisation</b>: connecting households across a vast, often rural footprint, formalising informal connections, and driving down losses.</p>'+
       '<p class="body">Under <b>ANEEL</b>\'s price-cap concession framework, the operator earns a regulated tariff on its asset base and keeps the upside from beating its loss and cost targets. Government programmes (such as <b>Luz para Todos</b>) co-fund rural electrification. So the value levers are <b>connections growth and loss reduction</b> — but the cash flow is in <b>reais</b>, discounted at high Brazilian rates.</p>',
    facts:[['~10m+','Customers','multi-state'],['Universalisation','Strategy','connect + formalise'],['Losses','Key lever','technical + theft'],['ANEEL','Regulator','price-cap concession'],['Luz para Todos','Co-funding','rural electrification'],['Listed','Owner','B3-listed']],
    s2:'Picture a sprawling, partly-rural footprint slowly being connected and formalised — household by household, with losses falling as informal connections come onto the meter. The <b style="color:#0c6b4f">return</b> rises from the connections added and the losses cut, on a regulated tariff. Drag the connections, the revenue per connection and the take-up — the cash flow is regulated and indexed; the risk is the Brazilian discount rate.',
    driverLab:'Rev / conn', availLab:'Take-up', hrK:'Tariff revenue', yrS:'live connections × tariff',
    ledge:{a:'+ tariff rev',b:'+ connection',c:'− opex'}, demandLabel:'TAKE-UP',
    preset:'Load Equatorial',
    try:'<b>Try this:</b> raise the <b>take-up</b> — in Equatorial\'s regions, bringing households onto the meter and cutting losses is the entire turnaround playbook, and the price cap lets the operator keep the gain. But the whole return is in reais: push the cost of debt and watch a strong nominal number net down once discounted like an emerging-market asset.',
    s3:'Equatorial earns a <b>regulated tariff</b> set by ANEEL on a price cap — a return on the regulatory asset base plus depreciation and an efficient opex allowance, reset at tariff reviews. The last-mile levers are <b>connections growth</b> (universalisation, often co-funded by federal programmes) and <b>loss reduction</b>, both of which the operator keeps between reviews. The investor question is less the asset than the <b>discount rate</b> — Brazilian rates and the real.',
    mb:{tag:'Model B · turnaround concession', title:'Universalisation distributor', body:'A distribution concessionaire that earns its return by <b>connecting the unconnected</b> and cutting losses across difficult regions, under an ANEEL price cap that lets it keep the efficiency gain. Regulated and indexed, with a connections-and-losses turnaround upside — priced against emerging-market rates. <b>This is Equatorial Energia</b>.'},
    s4a:'Operating cost is heavy here — a vast, partly-rural network, high losses to fight and a large field operation — but the price cap means every loss cut and efficiency gain drops to the bottom line between reviews, so a well-run turnaround lifts its margin over time. The defining lever is the connections-and-losses programme, not the cost line in any one year.',
    wfNote:'Operating cost includes network O&M, the field operation and the cost of losses across a difficult footprint. The price cap rewards cutting it — connections and loss reduction are kept by the operator until the next tariff review.',
    s4b:'The capital is the network the concessions were won to fix and extend, plus the rural electrification co-funded by federal programmes. Modelled on an enterprise-value basis, the return is a <b>high-nominal Brazilian</b> one on a regulated, indexed cash flow that grows with every household connected — carried against local rates and the real.',
    stackH:'The capital · concession + electrification', splitL:'Funding', splitR:'EM',
    split:[['s1',40,'Federal / programme co-funding'],['s2',60,'Concessionaire capital']],
    finList:[['','Customers','~10m+, growing'],['sub','Regulator','ANEEL (price cap)'],['','Strategy','universalisation + loss reduction'],['sub','Co-funding','Luz para Todos'],['','Key lever','connections + losses'],['rest','Owner','B3-listed']],
    finNote:'A Brazilian universalisation distributor is a <b>connections-and-losses turnaround</b> on a regulated, indexed cash flow: connect households, cut losses, keep the gain. The whole investment debate is the <b>discount rate</b> — Brazilian rates and the real — more than the asset.',
    timeline:[['2004','<b>Equatorial acquires CEMAR</b> (Maranhão) — the turnaround template.'],['2012','<b>Acquires CELPA</b> (Pará) out of difficulty.'],['2018','<b>Wins north-east concessions</b> (e.g. Piauí, Alagoas).'],['2020s','<b>Universalisation &amp; loss-reduction</b> programmes scale.'],['Periodic','<b>ANEEL tariff reviews</b> reset the price cap.'],['2020s','<b>Diversification</b> into transmission and sanitation.']],
    calcNote:'A working model of a <b>universalisation concession</b>, on an enterprise-value basis. Connections growth and loss reduction lift revenue and margin; the cost of debt is high to reflect Brazilian rates. A strong nominal return nets down once discounted like an EM asset.',
    s6:'Equatorial is connections-and-losses turnaround — at an EM discount rate. What drives it:',
    breakers:['<b>Connections growth</b> — universalisation across a vast footprint adds customers and base.','<b>Loss reduction</b> — cutting technical and non-technical losses is the biggest controllable lever.','<b>Country &amp; currency</b> — Brazilian real rates and the real, not the asset, set the discount rate.','<b>The tariff review</b> — ANEEL\'s price cap and how much efficiency is handed back.'],
    src:'Figures from public sources: <a href="https://www.equatorialenergia.com.br/" target="_blank" rel="noopener">Equatorial Energia</a> and <a href="https://www.gov.br/aneel/" target="_blank" rel="noopener">ANEEL</a> disclosure on the concessions and price-cap framework. The figures are approximate and illustrative.',
    econ:{cur:'R$', host:'concession area', volt:'13.8 kV',
      connDef:10000,connMin:4000,connMax:16000,connStep:200, revDef:520,revMin:300,revMax:900,revStep:20,
      occDef:84,occMin:55,occMax:100,occStep:1, opexPer:170, fixedOpex:300},
    calc:{build:26000,grant:6000,capex:24,revG:4,floor:3000,cap:7000,tax:34,exit:9,lev:4,rd:9,amort:2,hold:15},
    map:{footer:GEO.equatorial.footer}
  },

  /* ---------- 4 · ALTOGETHER GROUP (Oceania · private embedded network) ---------- */
  altogether:{
    name:'Altogether Group', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'altogether',
    lede:'An Australian <b>embedded-network</b> utility — it owns the private wires inside apartment towers and master-planned precincts and sells energy directly to the residents behind a single master meter.',
    s1:'<p class="body">In Australia, a developer can build a private <b>embedded network</b> inside a building or precinct: the site takes a single bulk connection from the grid at a master meter, and a private operator owns the internal wires and <b>on-sells</b> electricity (often with hot water, recycled water and data) to each apartment or unit. It is the last mile turned into a self-contained private utility.</p>'+
       '<p class="body"><b>Altogether Group</b> (which brought together embedded-network and recycled-water businesses such as Flow Systems and WINconnect) owns and operates these networks across residential and mixed-use precincts. The operator earns a <b>per-connection</b> charge from every unit; the model sits under the AER\'s <b>exempt-seller</b> framework with consumer-protection rules. The economics are a private connections annuity — small, high-margin, and growing with every new precinct signed.</p>',
    facts:[['Embedded','Network','private behind a master meter'],['Per-unit','Revenue','energy + services'],['AER exempt','Framework','seller exemptions'],['Multi-utility','Scope','power · hot/recycled water · data'],['Precincts','Growth','apartments + master-planned'],['Private','Owner','infrastructure-backed']],
    s2:'Picture a precinct — towers and townhouses behind one master connection — with each unit a private customer of the embedded network. Units light up as they are sold and occupied, and the operator earns a charge on each. The <b style="color:#0c6b4f">return</b> rises from the connections behind the master meter. Drag the connections, the revenue per unit and the occupancy — a private, high-margin connections annuity.',
    driverLab:'Rev / unit', availLab:'Occupancy', hrK:'Energy + services', yrS:'live units × charge',
    ledge:{a:'+ energy',b:'+ service',c:'− opex'}, demandLabel:'OCCUPANCY',
    preset:'Load Altogether',
    try:'<b>Try this:</b> nudge the <b>revenue per unit</b> — an embedded network bundles energy with hot water, recycled water and data, so the charge per connection is higher than a pure wires business, lifting the margin. But the model lives or dies on <b>occupancy and new precincts</b>: drop the occupancy and the annuity thins. Consumer-protection rules under the exempt-seller framework cap the upside.',
    s3:'Altogether earns a <b>per-connection charge</b> from every unit behind the master meter — energy on-sold from a bulk supply, plus hot water, recycled water and data where bundled. It buys energy at the master meter and sells it on within the consumer-protection rules of the AER\'s <b>exempt-seller</b> framework. The model is a private connections annuity: small net capital per unit, a bundled charge, and growth from every new precinct adopted.',
    mb:{tag:'Model B · embedded network', title:'Private embedded-network utility', body:'A private operator owns the internal wires of a building or precinct behind a single master meter and on-sells energy and services to each unit, earning a per-connection charge under the AER\'s exempt-seller framework. High-margin, bundled, and growing with new precincts. <b>This is Altogether Group</b>.'},
    s4a:'The big cost in an embedded network is the <b>bulk energy</b> bought at the master meter and on-sold to units; metering, billing and O&M are light. Because the charge bundles services, the margin over bulk supply is healthy. The defining feature is the connections base — units sold and occupied — and the pipeline of new precincts.',
    wfNote:'Operating cost is dominated by the bulk energy bought at the master meter, plus metering, billing and a small O&M and compliance overhead. The margin sits on the spread between the bundled per-unit charge and the bulk supply, over a growing connections base.',
    s4b:'The capital is the internal network and plant in each precinct — wires, metering, and the hot- and recycled-water plant where bundled. Much is funded at development, so net capital per connection is modest; the return is a private, indexed annuity over the units behind each master meter, compounding as new precincts are added.',
    stackH:'The capital · per precinct', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',55,'Developer / precinct funding'],['s2',45,'Operator net capital']],
    finList:[['','Networks','embedded precincts'],['sub','Framework','AER exempt-seller'],['','Revenue','per-unit energy + services'],['sub','Scope','power · hot/recycled water · data'],['','Growth','new precincts signed'],['rest','Owner','infrastructure-backed']],
    finNote:'A private embedded network is a <b>bundled connections annuity</b>: a high-margin per-unit charge over a growing base, with modest net capital. The risks are occupancy and new-precinct flow, consumer-protection rules, and energy-cost pass-through.',
    timeline:[['2000s','<b>Embedded networks</b> emerge in Australian apartments and precincts.'],['2014','<b>Flow Systems</b> pioneers recycled-water + energy precinct utilities.'],['2010s','<b>WINconnect &amp; peers</b> scale embedded electricity on-selling.'],['2021','<b>Altogether Group</b> brings the businesses together.'],['2020s','<b>AER consumer-protection</b> rules tighten the framework.'],['Ongoing','<b>Precinct pipeline</b> drives connections growth.']],
    calcNote:'A working model of a <b>private embedded network</b>. Revenue is a bundled per-unit charge over a growing connections base; bulk energy is the dominant cost. Net capital per connection is modest, and the exit multiple reflects a long but consumer-protected private annuity.',
    s6:'Altogether is the private last mile inside the building. What drives it:',
    breakers:['<b>Occupancy &amp; precinct pipeline</b> — units sold and new precincts signed are the engine.','<b>Bundled charge</b> — energy plus hot/recycled water and data lifts revenue per connection.','<b>Energy cost pass-through</b> — the spread over bulk supply, and how much can be recovered.','<b>Exempt-seller rules</b> — AER consumer protections cap pricing and shape the model.'],
    src:'Figures from public sources on the Australian embedded-network market: <a href="https://altogethergroup.com.au/" target="_blank" rel="noopener">Altogether Group</a> and the <a href="https://www.aer.gov.au/" target="_blank" rel="noopener">AER</a> exempt-selling framework. As a private business, the figures are approximate and illustrative.',
    econ:{cur:'A$', host:'master meter', volt:'0.4 kV',
      connDef:90,connMin:20,connMax:220,connStep:5, revDef:520,revMin:300,revMax:900,revStep:20,
      occDef:88,occMin:50,occMax:100,occStep:1, opexPer:300, fixedOpex:6},
    calc:{build:240,grant:105,capex:14,revG:6,floor:10,cap:70,tax:30,exit:13,lev:5,rd:6,amort:2,hold:20},
    map:{footer:GEO.altogether.footer}
  },

  /* ---------- 5 · ENOWA / NEOM (Middle East · greenfield-city last mile) ---------- */
  enowa:{
    name:'ENOWA · NEOM', geo:'Saudi Arabia', continent:'Middle East', cur:'SAR', geoKey:'enowa',
    lede:'The energy and water utility of <b>NEOM</b> — building the entire last-mile network of a greenfield city from scratch, designed for 100% renewable power and connected as the city is built.',
    s1:'<p class="body"><b>ENOWA</b> is the energy and water company of <b>NEOM</b>, the giant greenfield development on Saudi Arabia\'s Red Sea coast. Where most last-mile networks extend an existing system, ENOWA is building one from <b>zero</b> — generation, transmission and the full distribution and connection network for new districts, designed around <b>100% renewable</b> power and green hydrogen.</p>'+
       '<p class="body">The last-mile economics are a pure <b>adoption ramp</b>: the network is built ahead of demand, and connections fill as districts, residences and businesses come online over years. As a <b>state-backed</b> entity the cost of capital is low and the build is large; the investment case is the pace of the ramp — how quickly the city populates and the connections energise — against the scale of capital committed upfront.</p>',
    facts:[['Greenfield','Network','built from zero'],['100% renewable','Design','solar · wind · hydrogen'],['Adoption ramp','Driver','connections fill over years'],['State-backed','Funding','low cost of capital'],['New districts','Footprint','phased build-out'],['Strategic','Owner','NEOM / PIF-backed']],
    s2:'Picture a city being switched on district by district — the network laid ahead of demand, connections energising as residents and businesses arrive. Early on, much of the network is built but not yet earning; the <b style="color:#0c6b4f">return</b> arrives as occupancy climbs. Drag the connections, the revenue per connection and the occupancy to see how a greenfield-city utility ramps from a heavy upfront build into a populated network.',
    driverLab:'Rev / conn', availLab:'Occupancy', hrK:'Network revenue', yrS:'live connections × charge',
    ledge:{a:'+ network rev',b:'+ connection',c:'− opex'}, demandLabel:'OCCUPANCY',
    preset:'Load ENOWA',
    try:'<b>Try this:</b> set the <b>occupancy</b> low and watch the network earn almost nothing — a greenfield city is built ahead of demand, so the early years are heavy capital with a thin connections base. Then raise occupancy and see the annuity arrive. The whole investment case is the <b>pace of the ramp</b> against the upfront build; state backing keeps the cost of capital low.',
    s3:'ENOWA will earn a <b>regulated network revenue</b> on its connections as the city populates — a charge per connection across new districts, designed around 100% renewable supply. Unlike an established network, the base is built ahead of demand, so revenue lags the capital: the engine is <b>occupancy</b> — how fast districts, homes and businesses come online and energise. State backing funds the upfront build at a low cost of capital.',
    mb:{tag:'Model B · greenfield-city utility', title:'Build-ahead-of-demand network', body:'A utility building an entire city\'s last-mile network from zero, ahead of demand, and earning a connections charge as occupancy climbs over years. Heavy upfront capital, a long adoption ramp, and a low state-backed cost of capital. <b>This is ENOWA / NEOM</b> — designed for 100% renewable power.'},
    s4a:'In the early years the network is built but lightly used, so opex is small against a base that is not yet fully earning — the picture is dominated by <b>capital</b>, not cost. As occupancy climbs, a modern, renewable-designed network runs efficiently and the margin builds. The defining feature is the ramp, not the cost line.',
    wfNote:'Operating cost is the O&M of a new, automated network plus customer operations — modest as the city populates. The swing factor is occupancy: how quickly the connections base fills and starts earning against the upfront build.',
    s4b:'The capital is enormous and <b>upfront</b>: the full generation, network and connection build for a new city, designed around renewables and hydrogen, laid ahead of the population. It is financed on a state-backed basis at a low cost of capital; the return depends on the city populating fast enough to fill the network it has built.',
    stackH:'The capital · upfront build', splitL:'Funding', splitR:'state-backed',
    split:[['s1',100,'State-backed (NEOM / PIF)']],
    finList:[['','Network','greenfield, built from zero'],['sub','Design','100% renewable + hydrogen'],['','Revenue','connections as occupancy climbs'],['sub','Driver','pace of the adoption ramp'],['','Cost of capital','low (state-backed)'],['rest','Owner','NEOM / PIF-backed']],
    finNote:'A greenfield-city utility is an <b>adoption-ramp bet</b>: heavy upfront capital, a long occupancy ramp, and a low state-backed cost of capital. The risk is the pace of populating the city; the reward is owning the entire last mile of a new city designed for net zero.',
    timeline:[['2021','<b>ENOWA established</b> as NEOM\'s energy &amp; water company.'],['2022','<b>Green-hydrogen JV</b> (with ACWA Power and Air Products) announced.'],['2020s','<b>Network build-out</b> ahead of the first districts.'],['2020s','<b>First connections</b> as early districts come online.'],['Phased','<b>Occupancy ramp</b> across the development.'],['Long-term','<b>Full city network</b> on 100% renewable supply.']],
    calcNote:'A working model of a <b>greenfield-city utility</b>. The build is large and upfront; revenue ramps with occupancy, so early years are capital-heavy. A low state-backed cost of capital and a long hold reflect a build-ahead-of-demand asset. Figures are highly illustrative.',
    s6:'ENOWA is the last mile of a city built from zero. What drives it:',
    breakers:['<b>Occupancy ramp</b> — how fast the city populates and connections energise is the whole case.','<b>Upfront capital</b> — the network is built ahead of demand, so timing dominates the return.','<b>Cost of capital</b> — state backing keeps it low, which is essential for a long ramp.','<b>Renewable design</b> — a 100%-renewable city is the strategic prize and the execution risk.'],
    src:'Figures from public sources on <a href="https://www.neom.com/en-us/regions/enowa" target="_blank" rel="noopener">ENOWA / NEOM</a> announcements. As a greenfield, state-backed development, all figures here are highly approximate and illustrative.',
    econ:{cur:'SAR', host:'NEOM grid', volt:'33 / 0.4 kV',
      connDef:150,connMin:40,connMax:400,connStep:10, revDef:380,revMin:200,revMax:700,revStep:20,
      occDef:35,occMin:10,occMax:100,occStep:1, opexPer:90, fixedOpex:30},
    calc:{build:8000,grant:1500,capex:30,revG:10,floor:120,cap:3000,tax:0,exit:12,lev:5,rd:4.5,amort:2,hold:30},
    map:{footer:GEO.enowa.footer}
  },

  /* ---------- 6 · STATE GRID (China · mass new-build urban connections) ---------- */
  stategrid:{
    name:'State Grid', geo:'Eastern China', continent:'China', cur:'¥', geoKey:'stategrid',
    lede:'The world\'s largest utility, viewed through its last mile — <b>connecting new urban districts</b> at a scale and speed no one else matches, at a state cost of capital.',
    s1:'<p class="body"><b>State Grid Corporation of China</b> is the largest utility on earth, distributing power to the great majority of the country. Its last-mile story is <b>scale and speed</b>: as China builds new urban districts, State Grid lays the distribution network and connects millions of new homes, businesses and EV chargers — faster than any other system.</p>'+
       '<p class="body">Each new district is a wave of connections added to a colossal, fast-growing base. The allowed return per connection is thin by Western standards, but applied to an immense and rapidly growing connection count, and financed at a very low <b>state cost of capital</b>, it compounds into a vast, stable cash flow. The model is the same as the Chinese grid generally: not price, but scale.</p>',
    facts:[['Largest','Utility','on earth'],['Mass','Connections','new districts'],['Very fast','Adoption','urbanisation + EVs'],['Thin','Return / connection','but immense scale'],['State','Cost of capital','very low'],['State-owned','Owner','sovereign-backed']],
    s2:'Picture new districts switching on at speed — towers, malls and EV-ready streets connected in waves. At this scale even a thin <b style="color:#0c6b4f">return</b> per connection is an enormous cash flow. Drag the connections, the revenue per connection and the take-up — scale and adoption, not price, are the model, just like the Chinese transmission grid.',
    driverLab:'Rev / conn', availLab:'Take-up', hrK:'Network revenue', yrS:'live connections × charge',
    ledge:{a:'+ network rev',b:'+ connection',c:'− opex'}, demandLabel:'TAKE-UP',
    preset:'Load State Grid',
    try:'<b>Try this:</b> the return <b>per connection</b> is thin — but push the <b>connections</b> slider and watch the absolute cash flow balloon. Scale and the speed of urbanisation, not price, are the model. The cost of capital is very low because the owner is the state; the trade-off is that strategy and returns are state-directed.',
    s3:'State Grid\'s last mile earns a <b>regulated network charge</b> within China\'s framework — a thin return per connection on a colossal, fast-growing base. The lever is <b>scale and the pace of urbanisation</b>: new districts, mass housing and the world\'s largest EV roll-out keep the connection count climbing. Financed at a very low state cost of capital, a thin per-connection return compounds into a large, stable cash flow.',
    mb:{tag:'Model B · state-owned scale', title:'State grid, connections at scale', body:'A state-owned network connecting new urban districts at vast scale, earning a thin regulated return per connection on a colossal, fast-growing base, financed at a very low state cost of capital. Immense and strategically central, but state-directed. <b>This is State Grid</b> — the world\'s largest utility.'},
    s4a:'At this scale opex is immense in absolute terms — running the last mile for hundreds of millions of connections — but small relative to the revenue from a colossal base, so the margin is healthy. The dominant number is the <b>capital</b> of urbanisation and the EV build-out, on which the state allows a thin return at a very low cost of capital.',
    wfNote:'Operating cost is the O&M and customer operation of a vast network — large in absolute terms but small against the revenue from a colossal connection base. State backing keeps the cost of capital, and so the allowed return, low.',
    s4b:'The capital is on a national scale — the distribution and connection networks for new districts across the country, plus the charging infrastructure for the world\'s largest EV fleet. It is financed on a state-backed balance sheet that can mobilise capital at a scale and cost few utilities can match, and the connection count grows every year.',
    stackH:'The capital · national build', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Chinese state — sovereign-backed']],
    finList:[['','Footprint','most of China'],['sub','Regulator','NDRC / NEA (state framework)'],['','Connections','mass, fast-growing'],['sub','Defining feature','urbanisation + EV scale'],['','Cost of capital','very low (state)'],['rest','Owner','state-owned']],
    finNote:'A state grid\'s last mile is a <b>connections machine at continental scale</b>: a thin return per connection on a colossal, fast-growing base, financed at a very low cost of capital. The return is steady and immense in absolute terms; the owner and strategy are the state\'s.',
    timeline:[['2002','<b>State Grid established</b> in China\'s power-sector reform.'],['2010s','<b>Mass urbanisation</b> drives waves of new-district connections.'],['2020s','<b>EV adoption</b> in China leads the world.'],['2020s','<b>New-district build-out</b> for dense urban load.'],['Ongoing','<b>Charging infrastructure</b> expands with EV growth.'],['Ongoing','<b>State-directed</b> investment and tariffs.']],
    calcNote:'A working model of a <b>state grid\'s connections</b>, on an enterprise-value basis. The return per connection is thin and the cost of capital very low (state-backed), but the base is vast and growing fast — so the absolute return is enormous and steady. Figures are highly illustrative given the scale.',
    s6:'State Grid is scale plus urbanisation — a thin return on a colossal, fast-growing base. What drives it:',
    breakers:['<b>Scale &amp; connections growth</b> — a thin return on a vast, growing base is the model; urbanisation and EVs drive it.','<b>Cost of capital</b> — state backing keeps it very low, lifting the value of even a thin return.','<b>EV adoption</b> — the world\'s largest EV fleet drives connection and charging build-out.','<b>State direction</b> — policy, not shareholders, sets strategy and the allowed return.'],
    src:'Figures from public sources and reporting on <a href="http://www.sgcc.com.cn/" target="_blank" rel="noopener">State Grid Corporation of China</a> and its distribution and EV-charging build-out. Given the company\'s scale and limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', host:'State Grid', volt:'10 / 0.4 kV',
      connDef:40000,connMin:15000,connMax:80000,connStep:1000, revDef:240,revMin:120,revMax:500,revStep:10,
      occDef:90,occMin:60,occMax:100,occStep:1, opexPer:70, fixedOpex:2000},
    calc:{build:120000,grant:40000,capex:35,revG:6,floor:9000,cap:24000,tax:25,exit:11,lev:4,rd:4,amort:2,hold:25},
    map:{footer:GEO.stategrid.footer}
  }
  };
  var ORDER=['gtc','fpl','equatorial','altogether','enowa','stategrid'];

  /* ===================================================================
     DEVELOPMENT RENDERER  (canvas, 720x520) — top-down, daytime
     A new development energising plot by plot: point of connection → spine
     cable → street feeders → a grid of plots that light up with occupancy.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var POC={x:78,y:262};            // point of connection to the host grid
  var TRUNKX=176;                  // spine cable into the site
  // plot layout (built once per asset from GEO)
  var PLOTS=[], ROWY=[], COLX=[], NPLOT=0;
  function layout(){
    var G=GEO[A.geoKey], dense=!!G.dense;
    ROWY=[110,182,254,326,398];
    COLX = dense ? [248,308,368,428,488,548,608] : [262,338,414,490,566];
    PLOTS=[]; var idx=0;
    var resShare=G.mix[0], comShare=G.mix[1];
    for(var r=0;r<ROWY.length;r++) for(var c=0;c<COLX.length;c++){
      var x=COLX[c], y=ROWY[r];
      // deterministic type spread: anchor occupies the far bottom-right cell
      var isAnchor=(r===ROWY.length-1 && c===COLX.length-1);
      var h=((c*7+r*13)%100)/100;
      var type = isAnchor?'anchor' : (h<resShare?'home' : (h<resShare+comShare?'com':'ind'));
      // fill order = distance from the point of connection (network energises outward)
      var d=Math.hypot(x-POC.x,y-POC.y);
      PLOTS.push({x:x,y:y,type:type,row:r,col:c,d:d,ph:(idx*0.7)%6.28}); idx++;
    }
    NPLOT=PLOTS.length;
    PLOTS.sort(function(a,b){ return a.d-b.d; });   // rank by distance from POC
    PLOTS.forEach(function(p,i){ p.rank=i; });
  }

  /* ---- base map: ground + streets ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // soft parcel blocks behind the plots
    ctx.fillStyle='rgba(150,180,140,0.10)';
    [[210,80,470,150],[210,300,470,150]].forEach(function(b){ rr(b[0],b[1],b[2],b[3],10); ctx.fill(); });
    // streets: the trunk corridor + a horizontal street per row
    ctx.lineCap='round';
    road(TRUNKX,84,TRUNKX,420);
    ROWY.forEach(function(y){ road(TRUNKX,y,W-44,y); });
  }
  function road(x0,y0,x1,y1){
    ctx.strokeStyle='#c6cbc1'; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.setLineDash([6,8]); ctx.lineDashOffset=-(T*0.5);
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- point of connection to the host grid ---- */
  function poc(){
    var x=44,y=66; ctx.strokeStyle='#8a918c'; ctx.lineWidth=1.4;        // small pylon
    ctx.beginPath(); ctx.moveTo(x-8,y+28); ctx.lineTo(x,y); ctx.lineTo(x+8,y+28); ctx.moveTo(x-6,y+12); ctx.lineTo(x+6,y+12); ctx.stroke();
    ctx.strokeStyle='#7d847f'; ctx.beginPath(); ctx.moveTo(x,y+4); ctx.lineTo(POC.x,POC.y-22); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='600 7px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('HOST GRID',x-6,y-4);
    // connection cabinet / metering point
    ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(POC.x,POC.y+24,22,4,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#cfd3ca'; rr(POC.x-24,POC.y-22,48,44,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    var tg=ctx.createLinearGradient(POC.x-12,0,POC.x+12,0); tg.addColorStop(0,'#7e857f'); tg.addColorStop(1,'#9aa19a');
    ctx.fillStyle=tg; rr(POC.x-12,POC.y-12,24,24,2); ctx.fill();
    ctx.strokeStyle='rgba(40,46,44,0.32)'; ctx.lineWidth=0.7; for(var f=1;f<5;f++){ ctx.beginPath(); ctx.moveTo(POC.x-12,POC.y-12+f*5); ctx.lineTo(POC.x+12,POC.y-12+f*5); ctx.stroke(); }
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('POINT OF CONNECTION',POC.x,POC.y+38);
  }

  /* ---- spine + street feeders ---- */
  function feeders(){
    ctx.strokeStyle='rgba(90,110,150,0.5)'; ctx.lineWidth=2.4; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(POC.x,POC.y-22); ctx.lineTo(POC.x,254); ctx.lineTo(TRUNKX,254); ctx.stroke();    // POC → trunk
    ctx.beginPath(); ctx.moveTo(TRUNKX,ROWY[0]); ctx.lineTo(TRUNKX,ROWY[ROWY.length-1]); ctx.stroke();           // trunk
    ROWY.forEach(function(y){ ctx.beginPath(); ctx.moveTo(TRUNKX,y); ctx.lineTo(COLX[COLX.length-1],y); ctx.stroke(); });
    ctx.setLineDash([]);
  }
  function flowPulses(pts,speed,load){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*4));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,'rgba(120,200,255,0.6)'); ctx.fillStyle='rgba(120,200,255,0.95)'; ctx.beginPath(); ctx.arc(p[0],p[1],1.5,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- plots ---- */
  function house(x,y,lit){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-7,y-5,15,12,1); ctx.fill();
    ctx.fillStyle=lit?'#d8d2c4':'#cdd2c8'; rr(x-7,y-7,14,13,1.5); ctx.fill();
    ctx.fillStyle=lit?'#b8755a':'#9aa097'; rr(x-7,y-7,14,5,1.5); ctx.fill();                 // roof
    ctx.fillStyle=lit?'rgba(255,210,120,0.95)':'rgba(90,100,90,0.35)'; ctx.fillRect(x-2,y,3,4);   // window
  }
  function comUnit(x,y,lit){
    var g=ctx.createLinearGradient(x,y-10,x,y+10); g.addColorStop(0, lit?'#aeb6bd':'#a4aaa6'); g.addColorStop(1, lit?'#8f99a1':'#8a908c');
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-9,y+7,20,5,2); ctx.fill();
    ctx.fillStyle=g; rr(x-9,y-9,19,17,2); ctx.fill();
    for(var wy=y-6;wy<y+5;wy+=5) for(var wx=x-6;wx<x+7;wx+=5){ ctx.fillStyle=lit?'rgba(255,214,150,0.9)':'rgba(120,140,150,0.4)'; ctx.fillRect(wx,wy,2.6,2.6); }
  }
  function indUnit(x,y,lit){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-11,y+7,24,5,2); ctx.fill();
    ctx.fillStyle=lit?'#9aa0a0':'#959b97'; rr(x-11,y-7,23,15,2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1; for(var sx=x-9;sx<x+11;sx+=7){ ctx.beginPath(); ctx.moveTo(sx,y-7); ctx.lineTo(sx+3.5,y-11); ctx.lineTo(sx+7,y-7); ctx.stroke(); }
    ctx.fillStyle=lit?'rgba(255,214,150,0.85)':'rgba(120,140,150,0.4)'; ctx.fillRect(x-7,y-2,3,4);
  }
  var ANCHOR={school:'SCHOOL',mall:'RETAIL',tower:'TOWER',plant:'PLANT',depot:'DEPOT'};
  function anchorBld(x,y,lit,label){
    ctx.fillStyle='rgba(30,40,30,0.12)'; rr(x-16,y+10,38,6,2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-18,x,y+12); g.addColorStop(0, lit?'#c2a25a':'#a9ab9e'); g.addColorStop(1, lit?'#9c7f3e':'#8c8e84');
    ctx.fillStyle=g; rr(x-16,y-18,36,30,2); ctx.fill();
    for(var wy=y-13;wy<y+8;wy+=6) for(var wx=x-12;wx<x+16;wx+=7){ ctx.fillStyle=lit?'rgba(255,224,160,0.95)':'rgba(120,140,150,0.4)'; ctx.fillRect(wx,wy,3.2,3.2); }
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(label,x+2,y+22);
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
  /* ---- live occupancy sparkline ---- */
  function drawDemand(occ){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'OCCUPANCY';
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
    var conns=parseFloat(sCap.value), revPer=parseFloat(sSpread.value), occ=parseFloat(sAvail.value)/100;
    var N=conns*1000, live=N*occ;
    // a gentle daily wobble on occupancy for the sparkline only
    var occLive=Math.max(0,Math.min(1, occ));

    ctx.clearRect(0,0,W,H);
    drawMap(); poc(); feeders();

    // energise plots up to the occupancy rank, with a soft wavefront on the frontier
    var liveCount=Math.round(NPLOT*occ);
    var frontier=(T*0.06)%1;
    PLOTS.forEach(function(p){
      var lit = p.rank < liveCount;
      // frontier shimmer: the most-recently-energised ring pulses
      var edge = lit && (p.rank > liveCount-COLX.length-1);
      if(p.type==='home') house(p.x,p.y,lit);
      else if(p.type==='com') comUnit(p.x,p.y,lit);
      else if(p.type==='ind') indUnit(p.x,p.y,lit);
      else anchorBld(p.x,p.y,lit,ANCHOR[G.anchor]||'ANCHOR');
      if(edge && Math.sin(T*0.18+p.ph)>0.3) glow(p.x,p.y-2,7,'rgba(70,225,150,0.5)');
    });

    // power flowing in from the POC to the live network (scales with live load)
    var loadVis=0.3+0.6*occ;
    flowPulses([[POC.x,POC.y-22],[POC.x,254],[TRUNKX,254]],0.9+loadVis,loadVis);
    flowPulses([[TRUNKX,ROWY[0]],[TRUNKX,ROWY[ROWY.length-1]]],0.7+loadVis,loadVis);
    ROWY.forEach(function(y,i){ if(i%1===0) flowPulses([[TRUNKX,y],[COLX[COLX.length-1],y]],0.8+loadVis,loadVis*0.8); });

    // "+ CONNECTING" marker on the growth frontier
    if(G.growing && liveCount<NPLOT){
      var nxt=PLOTS[Math.min(NPLOT-1,liveCount)];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ CONNECTING',nxt.x,nxt.y-14); ctx.restore();
        glow(nxt.x,nxt.y-2,8,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    }

    // ---- economics (connections annuity) ----
    var useRev=live*revPer, opexPer=E.opexPer, opex=live*opexPer+(E.fixedOpex||0)*1e6;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,useRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var c_om=opex*0.34, c_meter=opex*0.26, c_fault=opex*0.18, c_admin=opex*0.22;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is recurring use-of-system vs one-off connection income
    var connShare=Math.max(0.08,Math.min(0.45, grant/Math.max(1,buildTot)*0.5));

    // money-flow: +cash rises from energised plots; −cash (opex) drains
    if(_anim){
      var litPlots=PLOTS.slice(0,Math.max(1,liveCount));
      if(litPlots.length && Math.random()<0.6){ var s1=litPlots[(Math.random()*litPlots.length)|0]; spawnCoin(s1.x,s1.y-6, Math.random()<connShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.6, opex/Math.max(1,revenue)));
      if(litPlots.length && Math.random()<outRate){ var s2=litPlots[(Math.random()*litPlots.length)|0]; spawnCoin(s2.x,s2.y+4,'cost',1); }
      demHist.push(occLive); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(occLive);

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(N)+' connections',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',kfmt(N)); set('ixSpreadV',CUR+Math.round(revPer)+'/yr'); set('ixAvailV',Math.round(occ*100)+'%');
    set('ixDir',kfmt(N)); set('ixDirS','connections adopted · '+E.volt);
    set('ixMW',kfmt(live)); set('ixMWs',Math.round(occ*100)+'% live · '+(G.host||'host'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Network O&amp;M',c_om],['Metering &amp; billing',c_meter],['Faults',c_fault],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the connections base is too thin to value — raise the connections, the revenue per connection or the occupancy.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build</span> <b>'+money(capexGrossG)+'</b></span>'+
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
    sCap.min=E.connMin; sCap.max=E.connMax; sCap.step=E.connStep; sCap.value=E.connDef;
    sSpread.min=E.revMin; sSpread.max=E.revMax; sSpread.step=E.revStep; sSpread.value=E.revDef;
    sAvail.min=E.occMin; sAvail.max=E.occMax; sAvail.step=E.occStep; sAvail.value=E.occDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is a connections annuity (live connections × regulated revenue per connection) and the returns model is a simplified DCF in which developer contributions offset the build; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.connDef; sSpread.value=E.revDef; sAvail.value=E.occDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'gtc');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
