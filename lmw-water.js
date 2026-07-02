/* Last-mile water, data-driven worked examples.
   Six real water connection / adoption businesses, one template. Scene config
   from lmw-geo.js (GEO), drawn as a top-down new development being connected to
   water and wastewater plot by plot in 720x520 scene coords. NOT a big-RAB
   network: revenue is a connections annuity (live connections × regulated charge
   per connection), and the returns model is a simplified DCF in which developer
   contributions offset the build. */
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
  function kfmt(n){ return n>=1e6?(n/1e6).toFixed(n>=1e7?0:1)+'m':(n>=1e3?Math.round(n/1e3)+'k':''+Math.round(n)); }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · INDEPENDENT WATER NETWORKS (Europe · UK NAV) ---------- */
  iwnl:{
    name:'Independent Water Networks', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'iwnl',
    lede:'The water equivalent of an independent connections business, a <b>NAV</b> that builds and adopts the water and wastewater network inside new developments, then serves every plot for the life of the site.',
    s1:'<p class="body">When a developer builds a new estate, the water mains, sewers and connections can be provided not by the regional monopoly but by a <b>New Appointment &amp; Variation (NAV)</b>, a licensed water company appointed for that specific site. It builds and adopts the network and becomes the water and wastewater provider for every plot.</p>'+
       '<p class="body"><b>Independent Water Networks (IWNL)</b> is one of Britain\'s largest NAVs. The economics mirror an electricity IDNO: the <b>developer largely funds the build</b>, so the operator\'s net capital per plot is small, and in return it earns a regulated <b>per-connection charge</b>, capped at the incumbent\'s level by Ofwat\'s relative price rules and indexed, for the life of the development. Revenue turns on the <b>count of connections and how fast they fill</b> rather than on how much water flows.</p>',
    facts:[['NAV','Appointment','adopts the network'],['Water + sewer','Scope','full service'],['Developer','Funds the build','low net capex'],['Ofwat','Cap','at incumbent level'],['Indexed','Charge','inflation-linked'],['Infra-backed','Owner','long-life annuity']],
    s2:'Watch the development connect. Clean water arrives at the <b>connection</b> to the incumbent main, runs down the spine main into the site (blue), and each plot connects as it is built and occupied; wastewater drains back to the sewer (brown). The owner\'s <b style="color:#0c6b4f">money</b> is the regulated <b>charge on every live connection</b>, so the earnings follow how many connections are live and how quickly they fill; volume hardly matters. Drag the connections, the charge and the occupancy.',
    driverLab:'Charge / conn', availLab:'Occupancy', hrK:'Per-connection', yrS:'live connections × charge',
    ledge:{a:'+ water charge',b:'+ connection',c:'− opex'}, demandLabel:'OCCUPANCY',
    preset:'Load IWNL',
    try:'<b>Try this:</b> drop the <b>occupancy</b> and the revenue thins: a NAV is an <b>adoption ramp</b>, not a volume meter. Then remember the trick: the <b>developer funds most of the build</b>, so net capital per plot is small and the regulated charge is an inflation-linked annuity. That mix (low net capital, long indexed income) is why NAVs, like IDNOs, trade at high multiples.',
    s3:'IWNL earns a <b>regulated per-connection charge</b> on every plot it has adopted (plus a one-off connection income at build, largely developer-funded). The charge is set by reference to the <b>incumbent\'s tariff</b> and capped under Ofwat\'s relative price rules, then indexed. Because the developer pays for most of the assets, the return comes less from a return-on-RAB and more from the <b>spread between a small net capital cost and a very long, indexed annuity</b> over a growing connection base.',
    mb:{tag:'Model B · NAV adoption', title:'New Appointment & Variation (NAV)', body:'A licensed water company appointed to a specific development that <b>adopts</b> the water and sewer network, funded largely by the developer, and earns a regulated per-connection charge, capped at the incumbent level and indexed, for the life of the site. Low net capital, long annuity. <b>This is IWNL</b>, Ofwat-licensed.'},
    s4a:'A NAV is light on operating cost beyond the <b>wholesale water and sewerage</b> it buys from the incumbent and a small metering, billing and O&amp;M overhead, so the margin on the regulated charge is steady. The number that matters is the <b>connections pipeline</b> rather than opex: how many plots are contracted, built and connected, because each one adds an indexed annuity at very little net capital.',
    wfNote:'Operating cost is the wholesale water and sewerage bought from the incumbent, plus metering, billing and a small O&amp;M overhead. The value sits in the connections count and the pace of occupancy; the cost line is secondary.',
    s4b:'The capital is the network built into each development (mains, sewers and connections), but the <b>developer funds the bulk of it</b>, so the NAV\'s <b>net</b> capital per plot is small. A small net outlay buys a regulated, indexed annuity that runs for the life of the site and grows with every new development adopted.',
    stackH:'The capital · net of developer contributions', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',64,'Developer contributions'],['s2',36,'NAV net capital']],
    finList:[['','Appointment','NAV (adopts the network)'],['sub','Scope','water + wastewater'],['','Revenue','per-connection charge, indexed'],['sub','Cap','Ofwat at incumbent level'],['','Net capex / connection','low (developer-funded)'],['rest','Owner','infrastructure-backed']],
    finNote:'A NAV is a <b>connections annuity</b>: small net capital per plot, a long indexed regulated income, and growth from every development adopted. The risks are housebuilding volumes, the price-cap rules, and the price paid per connection at acquisition.',
    timeline:[['2005','<b>NAV regime</b> takes shape under Ofwat, competition for new connections.'],['2010s','<b>Independent water networks</b> scale across new-build housing.'],['2017','<b>Retail market</b> opens for non-household water in England.'],['2020s','<b>RPC-style caps</b> set NAV charges at incumbent level.'],['2020s','<b>Infra-fund consolidation</b> of NAV portfolios.'],['Ongoing','<b>Housebuilding volumes</b> drive the connections pipeline.']],
    calcNote:'A working model of a <b>NAV connections annuity</b>. The build is the network cost, but developer contributions offset most of it, so the <b>net</b> capital is small; revenue is the indexed per-connection charge over a growing base. The exit multiple is high because the income is long and indexed.',
    s6:'IWNL is the water connections layer of new housing. What moves the return:',
    breakers:['<b>Connections growth</b>: new-build volumes and the pipeline of adopted developments are the engine.','<b>Net capital per connection</b>: how much the developer funds vs the NAV sets the return.','<b>The price cap</b>: Ofwat\'s rules set the ceiling on the per-connection charge at incumbent level.','<b>Acquisition price</b>: NAV portfolios trade at high multiples; the price paid per connection is the risk.'],
    src:'Figures from public sources on the UK NAV market: <a href="https://water.org.uk/" target="_blank" rel="noopener">industry</a> and <a href="https://www.ofwat.gov.uk/" target="_blank" rel="noopener">Ofwat</a> NAV framework, and <a href="https://www.water-plus.co.uk/" target="_blank" rel="noopener">IWNL</a>-type disclosure. The figures are approximate and illustrative.',
    econ:{cur:'£', host:'incumbent', volt:'water + sewer',
      connDef:150,connMin:40,connMax:400,connStep:10, revDef:170,revMin:90,revMax:320,revStep:10,
      occDef:80,occMin:40,occMax:100,occStep:1, opexPer:78, fixedOpex:3},
    calc:{build:220,grant:70,capex:14,revG:5,floor:6,cap:60,tax:25,exit:16,lev:5,rd:5.5,amort:2,hold:25},
    map:{footer:GEO.iwnl.footer}
  },

  /* ---------- 2 · GLOBAL WATER RESOURCES (North America · Arizona growth utility) ---------- */
  gwr:{
    name:'Global Water Resources', geo:'Arizona, USA', continent:'North America', cur:'US$', geoKey:'gwr',
    lede:'A pure-play <b>growth-by-connections</b> water utility in one of America\'s fastest-growing regions, earning its return by connecting new homes across the Phoenix metro.',
    s1:'<p class="body"><b>Global Water Resources</b> is a regulated water utility built around <b>growth</b>: it owns water and wastewater systems in the fast-expanding communities around <b>Phoenix, Arizona</b>, and earns by connecting new homes as the desert metro sprawls. Its model, <b>Total Water Management</b>, recycles wastewater for irrigation, stretching scarce supply across a growing footprint.</p>'+
       '<p class="body">Like any US utility it is regulated by the state commission (the <b>Arizona Corporation Commission</b>) on rate base and allowed return, and new connections are part-funded by developers (a hook-up fee / contribution) with the balance entering the rate base. The investment case is the <b>connections tailwind</b>: a small utility compounding as one of the fastest-growing housing markets in the US fills in around it.</p>',
    facts:[['Phoenix metro','Footprint','high-growth desert'],['Water + sewer','Scope','+ recycled water'],['Connections','Engine','active service connections'],['ACC','Regulator','rate base + return'],['Hook-up fees','Funding','developer contribution'],['GWRS','Owner','Nasdaq-listed']],
    s2:'Picture the desert metro filling in, subdivisions connecting to water and sewer year after year, with wastewater recycled back for irrigation. Clean water arrives at the connection, the network extends, and each new home connects. The <b style="color:#0c6b4f">return</b> rises from the connections added to the rate base (part-funded by hook-up fees) rather than from the volume. Drag the connections, the charge and the occupancy.',
    driverLab:'Rev / conn', availLab:'Take-up', hrK:'Per-connection', yrS:'live connections × charge',
    ledge:{a:'+ water charge',b:'+ hook-up fee',c:'− opex'}, demandLabel:'TAKE-UP',
    preset:'Load Global Water',
    try:'<b>Try this:</b> raise the <b>connections</b>. In a fast-growing desert metro, customer growth is a structural tailwind. Each new connection is part-funded by a <b>hook-up fee</b> and part added to the rate base at the allowed return. Recycling stretches scarce water across more connections. The risk is rate-case timing and the cost of capital.',
    s3:'Global Water earns a <b>state-regulated charge</b> set by the ACC on rate base and allowed return, plus depreciation and opex recovery. The last-mile lever is <b>connections growth</b>: new service connections are part-funded by developer hook-up fees, with the balance entering the rate base. Total Water Management recycles wastewater for irrigation, so each connection supports more growth on the same scarce supply. The case is a small utility compounding with a high-growth housing market.',
    mb:{tag:'Model B · growth water utility', title:'Investor-owned water utility, growth region', body:'A regulated water and wastewater utility whose last-mile growth comes from <b>new connections</b>, part-funded by hook-up fees, part added to rate base at the allowed return, in a fast-growing region, with recycled water stretching supply. <b>This is Global Water Resources</b>, Nasdaq-listed, ACC-regulated.'},
    s4a:'A small utility carries real per-connection opex (water treatment, recycling, pumping and customer service), but the regulated charge and the growth tailwind keep the margin healthy and rising with scale. What sets the value is the <b>connections growth</b>; the cost line is a footnote.',
    wfNote:'Operating cost is treatment, recycling, pumping and customer service across a growing desert footprint. The swing factor for value is connections growth and the allowed return, not the volume in any one year.',
    s4b:'The capital is the water and wastewater systems plus the recycling that makes growth possible on scarce supply, a rate base that grows with every connection. New connections are part-funded by <b>hook-up fees</b> (so net capital per connection is lower than gross), with the balance recovered through the rate base at the allowed return.',
    stackH:'The capital · net of hook-up fees', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',40,'Developer hook-up fees'],['s2',60,'Rate base (net capital)']],
    finList:[['','Footprint','Phoenix metro, growing'],['sub','Regulator','Arizona Corporation Commission'],['','Model','Total Water Management (recycling)'],['sub','Connection funding','hook-up fees + rate base'],['','Tailwind','high housing growth'],['rest','Owner','Nasdaq-listed (GWRS)']],
    finNote:'A growth-region water utility is a <b>connections-compounding</b> asset: customer growth plus a regulated return on a rising rate base, with recycling stretching scarce supply. The risks are rate-case timing, water scarcity and the cost of capital, but the growth tailwind is rare.',
    timeline:[['2003','<b>Global Water</b> founded around Phoenix-area systems.'],['2010s','<b>Total Water Management</b>, recycling scales with growth.'],['2016','<b>Lists</b> on Nasdaq (GWRS).'],['2020s','<b>Phoenix housing boom</b> sustains connections growth.'],['Periodic','<b>ACC rate cases</b> reset the allowed return.'],['Ongoing','<b>Acquisitions</b> add systems and connections.']],
    calcNote:'A working model of a <b>growth water utility</b>, on an enterprise-value basis. Connections growth compounds both customers and rate base; hook-up fees offset part of the build. The return depends on growth and the allowed return; the risk is rate-case timing and scarcity.',
    s6:'Global Water is connections growth in the desert. What drives it:',
    breakers:['<b>Connections growth</b>: Phoenix-area housing growth is a structural tailwind.','<b>The allowed return</b>: the ACC\'s rate-case decision is the biggest lever.','<b>Hook-up fees vs rate base</b>: how much developers fund shapes the net return.','<b>Water scarcity</b>: recycling and supply are both the constraint and the moat.'],
    src:'Figures from public sources: <a href="https://www.gwresources.com/" target="_blank" rel="noopener">Global Water Resources</a> investor disclosure and Arizona Corporation Commission filings. Figures are approximate and illustrative.',
    econ:{cur:'US$', host:'incumbent main', volt:'water + sewer',
      connDef:90,connMin:30,connMax:220,connStep:5, revDef:470,revMin:250,revMax:800,revStep:10,
      occDef:92,occMin:60,occMax:100,occStep:1, opexPer:150, fixedOpex:8},
    calc:{build:300,grant:70,capex:26,revG:5,floor:10,cap:80,tax:25,exit:13,lev:5,rd:5,amort:1,hold:25},
    map:{footer:GEO.gwr.footer}
  },

  /* ---------- 3 · AEGEA SANEAMENTO (South America · universalisation) ---------- */
  aegea:{
    name:'Aegea Saneamento', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'aegea',
    lede:'Brazil\'s largest private water and sanitation company, built to <b>connect the unconnected</b> under a new legal framework that opened sanitation to private capital.',
    s1:'<p class="body"><b>Aegea Saneamento</b> is the largest private operator in Brazilian water and sanitation. The opportunity is enormous: tens of millions of Brazilians lack reliable water or sewerage, and the <b>2020 sanitation framework</b> opened the sector to private concessions with binding <b>universalisation</b> targets, connecting almost everyone to water and sewerage within a defined period.</p>'+
       '<p class="body">The last-mile story is therefore <b>mass connection</b>: Aegea wins long concessions and earns a regulated tariff that grows with every household connected to water and, especially, <b>sewerage</b> (where coverage is lowest). The cash flow is regulated and indexed, but priced in <b>reais</b> and discounted at high Brazilian rates, so a strong nominal return nets down like an emerging-market asset.</p>',
    facts:[['Largest','Private operator','Brazil sanitation'],['Universalisation','Targets','water + sewer'],['2020 framework','Catalyst','opened to private capital'],['Concessions','Structure','long-term'],['Sewerage','Lowest coverage','biggest upside'],['Sponsor-backed','Owner','infra + GIC']],
    s2:'Picture a city being connected, households joining water and, above all, sewerage, neighbourhood by neighbourhood. Clean water arrives at the connection, the network extends, wastewater drains to new sewers. The <b style="color:#0c6b4f">return</b> rises from the connections added on a regulated tariff. Drag the connections, the charge and the take-up: the cash flow is regulated and indexed; the risk is the Brazilian discount rate.',
    driverLab:'Tariff / conn', availLab:'Take-up', hrK:'Tariff revenue', yrS:'live connections × tariff',
    ledge:{a:'+ tariff',b:'+ connection',c:'− opex'}, demandLabel:'TAKE-UP',
    preset:'Load Aegea',
    try:'<b>Try this:</b> raise the <b>take-up</b>. Under universalisation, connecting households (especially to sewerage) is the entire growth engine, and the concession lets Aegea earn a regulated tariff on each. But the whole return is in reais: push the cost of debt and watch a strong nominal number net down once discounted like an emerging-market asset.',
    s3:'Aegea earns a <b>regulated tariff</b> under each concession, with binding universalisation targets. The last-mile lever is <b>connections growth</b>: every household connected to water and sewerage adds tariff revenue and grows the regulated base. Sewerage, where coverage is lowest, carries the most upside. The investor question is less the asset than the <b>discount rate</b>: Brazilian rates and the real.',
    mb:{tag:'Model B · universalisation concession', title:'Private sanitation concession', body:'A private operator wins long concessions with binding <b>universalisation</b> targets, earning a regulated tariff that grows as it connects households to water and sewerage. Regulated and indexed, with a mass-connection growth engine, priced against emerging-market rates. <b>This is Aegea Saneamento</b>.'},
    s4a:'Operating cost (treatment, pumping, network O&amp;M and a large field operation across a growing footprint) is real, but it sits against a regulated tariff that grows with every connection, so the margin builds with scale. The lever is the connections programme; the cost line in any one year counts for much less.',
    wfNote:'Operating cost is treatment, pumping and the field operation of connecting and serving households. The swing factor is the pace of connections, especially sewerage, on a regulated, indexed tariff.',
    s4b:'The capital is the network the concessions require: mains, sewers, treatment and the mass household connections of universalisation. Modelled on an enterprise-value basis, the return is a <b>high-nominal Brazilian</b> one on a regulated, indexed cash flow that grows with every connection, carried against local rates and the real.',
    stackH:'The capital · concession + universalisation', splitL:'Funding', splitR:'EM',
    split:[['s1',45,'Public / programme + debt'],['s2',55,'Sponsor equity']],
    finList:[['','Position','largest private operator'],['sub','Catalyst','2020 sanitation framework'],['','Targets','universalisation (water + sewer)'],['sub','Biggest upside','sewerage coverage'],['','Structure','long concessions'],['rest','Owner','sponsor + GIC-backed']],
    finNote:'A Brazilian sanitation concession is a <b>mass-connection growth story</b> on a regulated, indexed cash flow: connect households, grow the tariff base. The investment debate centres on the <b>discount rate</b> (Brazilian rates and the real) more than on the asset itself.',
    timeline:[['2010','<b>Aegea founded</b>, private water and sanitation.'],['2020','<b>Sanitation framework</b> opens the sector to private capital.'],['2021','<b>Rio de Janeiro concessions</b> (Cedae), landmark auctions won.'],['2020s','<b>Universalisation</b> programmes scale across states.'],['Periodic','<b>Tariff reviews</b> reset the regulated revenue.'],['Ongoing','<b>Sewerage connections</b> drive the growth.']],
    calcNote:'A working model of a <b>universalisation concession</b>, on an enterprise-value basis. Connections growth lifts tariff revenue; the cost of debt is high to reflect Brazilian rates. A strong nominal return nets down once discounted like an EM asset.',
    s6:'Aegea is mass connection, at an EM discount rate. What drives it:',
    breakers:['<b>Connections growth</b>: universalisation, especially sewerage, is the engine.','<b>Country &amp; currency</b>: Brazilian real rates and the real set the discount rate.','<b>The framework</b>: universalisation targets and concession terms shape the obligation and the return.','<b>Execution</b>: delivering mass connection across difficult areas is the risk.'],
    src:'Figures from public sources: <a href="https://www.aegea.com.br/" target="_blank" rel="noopener">Aegea Saneamento</a> disclosure and Brazil\'s 2020 sanitation framework. The figures are approximate and illustrative.',
    econ:{cur:'R$', host:'concession area', volt:'water + sewer',
      connDef:8000,connMin:3000,connMax:16000,connStep:200, revDef:320,revMin:180,revMax:600,revStep:10,
      occDef:72,occMin:45,occMax:100,occStep:1, opexPer:120, fixedOpex:200},
    calc:{build:24000,grant:10000,capex:24,revG:5,floor:2400,cap:7000,tax:34,exit:9,lev:4,rd:9,amort:2,hold:15},
    map:{footer:GEO.aegea.footer}
  },

  /* ---------- 4 · FLOW SYSTEMS (Oceania · embedded recycled-water precinct) ---------- */
  flow:{
    name:'Flow Systems', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'flow',
    lede:'An Australian <b>private precinct utility</b>, it owns the water, recycled-water and sewer networks inside master-planned communities and serves every lot directly.',
    s1:'<p class="body">In Australia, a developer can build a private water utility inside a master-planned community: the operator owns the potable, <b>recycled-water</b> and sewer networks within the precinct and serves each lot directly, often with a purple-pipe recycled-water system for irrigation and toilets that cuts potable demand.</p>'+
       '<p class="body"><b>Flow Systems</b> (now part of the Altogether group) pioneered this model in precincts such as Sydney\'s Central Park and Pitt Town. It earns a <b>per-connection</b> charge from every lot, regulated under state frameworks (in NSW, IPART price-monitoring and WICA licensing). The economics are a private connections annuity, small, with a recycled-water twist that improves the margin and the sustainability story, growing with every new precinct signed.</p>',
    facts:[['Precinct','Utility','private network'],['Recycled water','Twist','purple-pipe reuse'],['Per-lot','Revenue','water + recycled + sewer'],['IPART / WICA','Framework','NSW licensing'],['Master-planned','Growth','new precincts'],['Altogether','Owner','infrastructure-backed']],
    s2:'Picture a master-planned community, lots connecting to potable water, a purple-pipe recycled-water network and sewer, all privately owned. Lots connect as they are sold and occupied, and the operator earns a charge on each. The <b style="color:#0c6b4f">return</b> rises from the connections within the precinct. Drag the connections, the charge and the occupancy, a private, recycled-water connections annuity.',
    driverLab:'Charge / lot', availLab:'Occupancy', hrK:'Per-connection', yrS:'live lots × charge',
    ledge:{a:'+ water charge',b:'+ recycled & conn',c:'− opex'}, demandLabel:'OCCUPANCY',
    preset:'Load Flow Systems',
    try:'<b>Try this:</b> nudge the <b>charge per lot</b>, bundling potable water, recycled water and sewer lifts the charge per connection above a single-service network, and recycling cuts the bought-in potable cost. But the model lives on <b>occupancy and new precincts</b>: drop the occupancy and the annuity thins. State price-monitoring caps the upside.',
    s3:'Flow Systems earns a <b>per-connection charge</b> from every lot, potable water, recycled water and sewerage, regulated under state frameworks (IPART price-monitoring, WICA licensing in NSW). Recycling reduces bought-in potable water, improving the margin. The model is a private connections annuity: modest net capital per lot, a bundled charge, and growth from every new precinct adopted.',
    mb:{tag:'Model B · precinct utility', title:'Private precinct water utility', body:'A private operator owns the potable, recycled-water and sewer networks of a master-planned community and serves each lot directly, earning a per-connection charge under state licensing. Bundled, recycled-water-enhanced and growing with new precincts. <b>This is Flow Systems</b> (Altogether).'},
    s4a:'Operating cost is the bought-in potable water and the treatment, recycling, pumping and billing within the precinct, but recycling cuts the potable bill and the bundled charge keeps the margin healthy. The defining feature is the connections base and the pipeline of new precincts.',
    wfNote:'Operating cost is bought-in potable water, treatment and recycling, pumping and billing within the precinct. Recycling reduces the potable bill; the margin sits on the bundled per-lot charge over a growing base.',
    s4b:'The capital is the precinct networks and the recycled-water plant, much funded at development, so net capital per lot is modest. The return is a private, indexed annuity over the lots within each precinct, with a recycling twist that improves both economics and sustainability, compounding as new precincts are added.',
    stackH:'The capital · per precinct', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',58,'Developer / precinct funding'],['s2',42,'Operator net capital']],
    finList:[['','Networks','precinct (potable + recycled + sewer)'],['sub','Framework','IPART / WICA (NSW)'],['','Revenue','per-lot charge'],['sub','Twist','recycled water (purple pipe)'],['','Growth','new precincts signed'],['rest','Owner','Altogether (infra-backed)']],
    finNote:'A private precinct water utility is a <b>bundled, recycled-water connections annuity</b>: a per-lot charge over a growing base, with modest net capital and a sustainability edge. The risks are occupancy and new-precinct flow, price-monitoring and water-cost pass-through.',
    timeline:[['2004','<b>WICA</b> (NSW) enables private water utilities.'],['2012','<b>Central Park, Sydney</b>, landmark recycled-water precinct.'],['2010s','<b>Pitt Town &amp; others</b> scale the precinct model.'],['2021','<b>Altogether group</b> brings the businesses together.'],['2020s','<b>IPART price-monitoring</b> shapes the framework.'],['Ongoing','<b>Precinct pipeline</b> drives connections growth.']],
    calcNote:'A working model of a <b>private precinct utility</b>. Revenue is a bundled per-lot charge over a growing base; bought-in water (net of recycling) is the main cost. Net capital per lot is modest, and the exit multiple reflects a long but price-monitored private annuity.',
    s6:'Flow Systems is the private water utility inside the precinct. What drives it:',
    breakers:['<b>Occupancy &amp; precinct pipeline</b>, lots sold and new precincts signed are the engine.','<b>Recycled water</b>, cuts potable cost and lifts the bundled charge and the ESG story.','<b>Water-cost pass-through</b>, the spread over bought-in water and how much is recovered.','<b>Price-monitoring</b>, IPART / state frameworks shape pricing and the model.'],
    src:'Figures from public sources on Australian private water utilities: <a href="https://altogethergroup.com.au/" target="_blank" rel="noopener">Flow Systems / Altogether</a> and the <a href="https://www.ipart.nsw.gov.au/" target="_blank" rel="noopener">IPART</a> / WICA framework. As a private business, the figures are approximate and illustrative.',
    econ:{cur:'A$', host:'precinct main', volt:'water + recycled + sewer',
      connDef:60,connMin:15,connMax:180,connStep:5, revDef:680,revMin:350,revMax:1100,revStep:20,
      occDef:86,occMin:50,occMax:100,occStep:1, opexPer:380, fixedOpex:5},
    calc:{build:220,grant:95,capex:14,revG:6,floor:8,cap:70,tax:30,exit:13,lev:5,rd:6,amort:2,hold:20},
    map:{footer:GEO.flow.footer}
  },

  /* ---------- 5 · ENOWA / NEOM (Middle East · greenfield-city water) ---------- */
  enowawater:{
    name:'ENOWA · NEOM (water)', geo:'Saudi Arabia', continent:'Middle East', cur:'SAR', geoKey:'enowawater',
    lede:'The water side of <b>NEOM</b>\'s utility, building the entire last-mile water and wastewater network of a greenfield city from scratch, fed by desalination and recycling.',
    s1:'<p class="body"><b>ENOWA</b>, NEOM\'s energy and water company, is building a city\'s entire water system from <b>zero</b>: desalination (powered by renewables), distribution, the connection network for new districts, and full wastewater collection and <b>recycling</b>. Where most last-mile water networks extend an existing system, this one is laid ahead of the population.</p>'+
       '<p class="body">The last-mile economics are a pure <b>adoption ramp</b>: the network is built ahead of demand, and connections fill as districts, residences and businesses come online over years. As a <b>state-backed</b> entity the cost of capital is low and the build is large; the investment case is the pace of the ramp against the scale of capital committed upfront, with a design built around sustainable, recycled water from the start.</p>',
    facts:[['Greenfield','Network','built from zero'],['Desal + recycled','Supply','renewable-powered'],['Adoption ramp','Driver','connections fill over years'],['State-backed','Funding','low cost of capital'],['New districts','Footprint','phased build-out'],['Strategic','Owner','NEOM / PIF-backed']],
    s2:'Picture a city\'s water being switched on district by district, the network laid ahead of demand, connections filling as residents arrive, wastewater recycled from the start. Early on, much of the network is built but not yet earning; the <b style="color:#0c6b4f">return</b> arrives as occupancy climbs. Drag the connections, the charge and the occupancy to see a greenfield-city water utility ramp from a heavy upfront build into a populated network.',
    driverLab:'Charge / conn', availLab:'Occupancy', hrK:'Per-connection', yrS:'live connections × charge',
    ledge:{a:'+ water charge',b:'+ connection',c:'− opex'}, demandLabel:'OCCUPANCY',
    preset:'Load ENOWA water',
    try:'<b>Try this:</b> set the <b>occupancy</b> low and watch the network earn almost nothing, a greenfield city is built ahead of demand, so the early years are heavy capital with a thin connections base. Then raise occupancy and see the annuity arrive. The whole case is the <b>pace of the ramp</b> against the upfront build; state backing keeps the cost of capital low.',
    s3:'ENOWA will earn a <b>regulated water and wastewater charge</b> on its connections as the city populates, a charge per connection across new districts, fed by desalination and recycling. Unlike an established network, the base is built ahead of demand, so revenue lags the capital: the engine is <b>occupancy</b>, how fast districts, homes and businesses come online and connect. State backing funds the upfront build at a low cost of capital.',
    mb:{tag:'Model B · greenfield-city water', title:'Build-ahead-of-demand water network', body:'A utility building an entire city\'s water and wastewater network from zero, desalination, distribution, connections and recycling, ahead of demand, and earning a per-connection charge as occupancy climbs. Heavy upfront capital, a long ramp, a low state-backed cost of capital. <b>This is ENOWA / NEOM</b>.'},
    s4a:'In the early years the network is built but lightly used, so opex is small against a base that is not yet fully earning, the picture is dominated by <b>capital</b>, not cost. As occupancy climbs, a modern, recycling-designed network runs efficiently and the margin builds. The defining feature is the ramp, not the cost line.',
    wfNote:'Operating cost is desalination energy, treatment, recycling and customer operations, modest as the city populates. The swing factor is occupancy: how quickly the connections base fills against the upfront build.',
    s4b:'The capital is enormous and <b>upfront</b>: desalination, distribution, wastewater and recycling for a new city, laid ahead of the population. It is financed on a state-backed basis at a low cost of capital; the return depends on the city populating fast enough to fill the network it has built.',
    stackH:'The capital · upfront build', splitL:'Funding', splitR:'state-backed',
    split:[['s1',100,'State-backed (NEOM / PIF)']],
    finList:[['','Network','greenfield, built from zero'],['sub','Supply','desalination + recycling (renewable)'],['','Revenue','connections as occupancy climbs'],['sub','Driver','pace of the adoption ramp'],['','Cost of capital','low (state-backed)'],['rest','Owner','NEOM / PIF-backed']],
    finNote:'A greenfield-city water utility is an <b>adoption-ramp bet</b>: heavy upfront capital, a long occupancy ramp, and a low state-backed cost of capital. The risk is the pace of populating the city; the reward is owning the entire last mile of a new city\'s water, designed sustainable.',
    timeline:[['2021','<b>ENOWA established</b> as NEOM\'s energy &amp; water company.'],['2020s','<b>Desalination &amp; recycling</b> designed around renewables.'],['2020s','<b>Network build-out</b> ahead of the first districts.'],['2020s','<b>First connections</b> as early districts come online.'],['Phased','<b>Occupancy ramp</b> across the development.'],['Long-term','<b>Full city water network</b>, sustainably supplied.']],
    calcNote:'A working model of a <b>greenfield-city water utility</b>. The build is large and upfront; revenue ramps with occupancy, so early years are capital-heavy. A low state-backed cost of capital and a long hold reflect a build-ahead-of-demand asset. Figures are highly illustrative.',
    s6:'ENOWA water is the last mile of a city built from zero. What drives it:',
    breakers:['<b>Occupancy ramp</b>, how fast the city populates and connects is the whole case.','<b>Upfront capital</b>, desalination and the network are built ahead of demand.','<b>Cost of capital</b>, state backing keeps it low, essential for a long ramp.','<b>Sustainable supply</b>, renewable desalination and recycling are the prize and the execution risk.'],
    src:'Figures from public sources on <a href="https://www.neom.com/en-us/regions/enowa" target="_blank" rel="noopener">ENOWA / NEOM</a> announcements. As a greenfield, state-backed development, all figures here are highly approximate and illustrative.',
    econ:{cur:'SAR', host:'NEOM grid', volt:'water + sewer',
      connDef:120,connMin:30,connMax:350,connStep:10, revDef:450,revMin:250,revMax:800,revStep:20,
      occDef:35,occMin:10,occMax:100,occStep:1, opexPer:150, fixedOpex:25},
    calc:{build:8000,grant:1200,capex:30,revG:10,floor:120,cap:3000,tax:0,exit:12,lev:5,rd:4.5,amort:2,hold:30},
    map:{footer:GEO.enowawater.footer}
  },

  /* ---------- 6 · CHINA WATER AFFAIRS (China · connections-led BOT) ---------- */
  cwa:{
    name:'China Water Affairs', geo:'China', continent:'China', cur:'¥', geoKey:'cwa',
    lede:'A listed Chinese water group that grew by <b>connecting cities</b>, winning long concessions to supply water to fast-urbanising districts at scale.',
    s1:'<p class="body"><b>China Water Affairs Group</b> is one of China\'s largest listed water companies, supplying tap water (and increasingly wastewater and direct-drinking water) to cities across many provinces. It grew the classic Chinese way: winning long <b>build-operate-transfer (BOT)</b> and concession rights to supply water to urban districts, then connecting households as the cities filled.</p>'+
       '<p class="body">The last-mile story is <b>scale and urbanisation</b>: each new district is a wave of connections added to a large, growing base, plus rising volume as incomes rise. Tariffs are regulated within China\'s framework and the allowed margin is modest, but applied to a vast and growing connection count and financed at a low cost of capital, it compounds into a large, stable cash flow.</p>',
    facts:[['Listed','Water group','HK-listed'],['BOT / concession','Structure','long-term'],['Cities','Footprint','many provinces'],['Connections + volume','Engine','urbanisation'],['Regulated','Tariff','within China framework'],['Low','Cost of capital','scale + state context']],
    s2:'Picture cities filling in, districts connecting to a growing water network, volumes rising as incomes climb. Clean water arrives at the connection, the network extends, wastewater drains to new sewers. At this scale even a modest <b style="color:#0c6b4f">return</b> per connection is a large cash flow. Drag the connections, the charge and the take-up, scale and urbanisation, not price, are the model.',
    driverLab:'Tariff / conn', availLab:'Take-up', hrK:'Per-connection', yrS:'live connections × tariff',
    ledge:{a:'+ tariff',b:'+ connection',c:'− opex'}, demandLabel:'TAKE-UP',
    preset:'Load China Water',
    try:'<b>Try this:</b> push the <b>connections</b>, urbanisation adds districts and households to a growing base, and rising incomes lift volumes too. The tariff per connection is modest and regulated, but at this scale the absolute cash flow is large, and the cost of capital is low. The lever is scale and connections, not price.',
    s3:'China Water Affairs earns a <b>regulated tariff</b> within China\'s framework across its BOT and concession rights. The last-mile lever is <b>connections and urbanisation</b>: new districts add households to the base, and rising incomes lift volumes. The allowed margin is modest, but applied to a vast, growing connection count and financed at a low cost of capital, it compounds into a large, stable cash flow.',
    mb:{tag:'Model B · BOT / concession scale', title:'Listed water group, connections at scale', body:'A listed water group that wins long BOT and concession rights to supply cities, earning a regulated tariff on a large, fast-growing connection base, financed at a low cost of capital. Modest margin, vast scale, urbanisation-driven. <b>This is China Water Affairs</b>.'},
    s4a:'Operating cost is treatment, pumping, network O&amp;M and a large customer operation across many cities, significant in absolute terms but modest against the revenue from a vast connection base, so the margin is steady. The defining feature is the connections-and-volume growth of urbanisation, not the cost line.',
    wfNote:'Operating cost is treatment, pumping and customer operations across many cities, large in absolute terms but modest against the revenue from a vast base. The swing factor is connections and volume growth, not the tariff in any one year.',
    s4b:'The capital is the BOT and concession networks across many cities, mains, treatment and the connections of urbanisation, with wastewater and direct-drinking water added over time. Financed at a low cost of capital, the return is a modest-margin but large and growing cash flow that compounds with every district connected.',
    stackH:'The capital · BOT + concessions', splitL:'Financing', splitR:'scale',
    split:[['s1',55,'Project / corporate debt'],['s2',45,'Listed equity']],
    finList:[['','Position','large listed water group'],['sub','Structure','BOT / concession'],['','Footprint','many provinces'],['sub','Engine','urbanisation connections + volume'],['','Tariff','regulated (China framework)'],['rest','Owner','HK-listed']],
    finNote:'A Chinese listed water group is a <b>connections-and-volume scale story</b>: a modest regulated margin on a vast, growing base, financed at a low cost of capital. The return is steady and large in absolute terms; the risks are tariff regulation, gearing and execution across many cities.',
    timeline:[['1990s','<b>BOT water projects</b> open to private capital in China.'],['2000s','<b>China Water Affairs</b> consolidates urban water rights.'],['2010s','<b>Urbanisation</b> drives waves of new connections.'],['2020s','<b>Wastewater &amp; direct-drinking water</b> add new revenue.'],['Periodic','<b>Tariff adjustments</b> within the China framework.'],['Ongoing','<b>Connections + volume</b> compound the base.']],
    calcNote:'A working model of a <b>listed Chinese water group</b>, on an enterprise-value basis. Connections and volume growth lift revenue at a modest regulated margin; the cost of capital is low. The absolute cash flow is large and steady; the risks are tariff regulation and gearing.',
    s6:'China Water Affairs is connections at urban scale. What drives it:',
    breakers:['<b>Connections &amp; urbanisation</b>, new districts and rising volumes are the engine.','<b>Tariff regulation</b>, the allowed margin within China\'s framework caps the return.','<b>Cost of capital &amp; gearing</b>, low funding cost supports scale, but leverage is a risk.','<b>New services</b>, wastewater and direct-drinking water add revenue per connection.'],
    src:'Figures from public sources: <a href="https://www.chinawatergroup.com/" target="_blank" rel="noopener">China Water Affairs Group</a> investor disclosure. Figures are approximate and illustrative.',
    econ:{cur:'¥', host:'concession area', volt:'water + sewer',
      connDef:12000,connMin:5000,connMax:24000,connStep:500, revDef:230,revMin:120,revMax:450,revStep:10,
      occDef:88,occMin:60,occMax:100,occStep:1, opexPer:115, fixedOpex:500},
    calc:{build:26000,grant:6000,capex:24,revG:6,floor:3000,cap:8000,tax:25,exit:10,lev:5,rd:4.5,amort:2,hold:25},
    map:{footer:GEO.cwa.footer}
  }
  };
  var ORDER=['iwnl','gwr','aegea','flow','enowawater','cwa'];

  /* ===================================================================
     DEVELOPMENT RENDERER  (canvas, 720x520), top-down, daytime
     A new development being connected to water plot by plot: water connection →
     clean-water spine main (blue) → street mains → plots that connect with
     occupancy → wastewater return to the sewer (brown).
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var POC={x:78,y:236};            // water connection to the incumbent main
  var SEWER={x:78,y:300};          // wastewater connection to the sewer
  var TRUNKX=176;                  // clean-water spine main
  var STRUNKX=200;                 // wastewater trunk
  var PLOTS=[], ROWY=[], COLX=[], NPLOT=0;
  function layout(){
    var G=GEO[A.geoKey], dense=!!G.dense;
    ROWY=[110,182,254,326,398];
    COLX = dense ? [248,308,368,428,488,548,608] : [262,338,414,490,566];
    PLOTS=[]; var idx=0;
    var resShare=G.mix[0], comShare=G.mix[1];
    for(var r=0;r<ROWY.length;r++) for(var c=0;c<COLX.length;c++){
      var x=COLX[c], y=ROWY[r];
      var isAnchor=(r===ROWY.length-1 && c===COLX.length-1);
      var h=((c*7+r*13)%100)/100;
      var type = isAnchor?'anchor' : (h<resShare?'home' : (h<resShare+comShare?'com':'ind'));
      var d=Math.hypot(x-POC.x,y-POC.y);
      PLOTS.push({x:x,y:y,type:type,row:r,col:c,d:d,ph:(idx*0.7)%6.28}); idx++;
    }
    NPLOT=PLOTS.length;
    PLOTS.sort(function(a,b){ return a.d-b.d; });
    PLOTS.forEach(function(p,i){ p.rank=i; });
  }

  /* ---- base map: ground + streets ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(150,180,140,0.10)';
    [[210,80,470,150],[210,300,470,150]].forEach(function(b){ rr(b[0],b[1],b[2],b[3],10); ctx.fill(); });
    ctx.lineCap='round';
    road(TRUNKX,84,TRUNKX,420);
    ROWY.forEach(function(y){ road(TRUNKX,y,W-44,y); });
  }
  function road(x0,y0,x1,y1){
    ctx.strokeStyle='#c6cbc1'; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.setLineDash([6,8]); ctx.lineDashOffset=-(T*0.5);
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- water + sewer connection chambers ---- */
  function chamber(x,y,col,label){
    ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(x,y+16,18,3.5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#cfd3ca'; rr(x-18,y-15,36,30,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(label,x,y+26);
  }
  function connections(){
    // incoming mains from the left edge
    ctx.strokeStyle='rgba(90,140,190,0.55)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(20,POC.y); ctx.lineTo(POC.x-18,POC.y); ctx.stroke();
    ctx.strokeStyle='rgba(150,120,80,0.5)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(20,SEWER.y); ctx.lineTo(SEWER.x-18,SEWER.y); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='600 7px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('MAINS WATER',14,POC.y-22); ctx.fillText('PUBLIC SEWER',14,SEWER.y+30);
    chamber(POC.x,POC.y,'#3f7fb8','WATER IN');
    chamber(SEWER.x,SEWER.y,'#8a6a3a','SEWER');
  }

  /* ---- spine + street mains ---- */
  function mains(){
    // clean water (blue, dashed), POC → trunk → street mains
    ctx.strokeStyle='rgba(70,130,185,0.6)'; ctx.lineWidth=2.6; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(POC.x+18,POC.y); ctx.lineTo(TRUNKX,POC.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(TRUNKX,ROWY[0]); ctx.lineTo(TRUNKX,ROWY[ROWY.length-1]); ctx.stroke();
    ROWY.forEach(function(y){ ctx.beginPath(); ctx.moveTo(TRUNKX,y); ctx.lineTo(COLX[COLX.length-1],y); ctx.stroke(); });
    // wastewater (brown), sewer trunk back to the sewer connection
    ctx.strokeStyle='rgba(150,120,80,0.5)'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(SEWER.x+18,SEWER.y); ctx.lineTo(STRUNKX,SEWER.y); ctx.lineTo(STRUNKX,ROWY[ROWY.length-1]); ctx.stroke();
    ctx.setLineDash([]);
  }
  function flowPulses(pts,speed,load,col,gcol,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*4));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.4,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.5,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- plots ---- */
  function house(x,y,lit){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-7,y-5,15,12,1); ctx.fill();
    ctx.fillStyle=lit?'#d8d2c4':'#cdd2c8'; rr(x-7,y-7,14,13,1.5); ctx.fill();
    ctx.fillStyle=lit?'#7892a6':'#9aa097'; rr(x-7,y-7,14,5,1.5); ctx.fill();                 // roof
    ctx.fillStyle=lit?'rgba(120,180,225,0.95)':'rgba(90,100,90,0.35)'; ctx.fillRect(x-2,y,3,4);   // tap/window
  }
  function comUnit(x,y,lit){
    var g=ctx.createLinearGradient(x,y-10,x,y+10); g.addColorStop(0, lit?'#aeb6bd':'#a4aaa6'); g.addColorStop(1, lit?'#8f99a1':'#8a908c');
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-9,y+7,20,5,2); ctx.fill();
    ctx.fillStyle=g; rr(x-9,y-9,19,17,2); ctx.fill();
    for(var wy=y-6;wy<y+5;wy+=5) for(var wx=x-6;wx<x+7;wx+=5){ ctx.fillStyle=lit?'rgba(150,195,230,0.9)':'rgba(120,140,150,0.4)'; ctx.fillRect(wx,wy,2.6,2.6); }
  }
  function indUnit(x,y,lit){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-11,y+7,24,5,2); ctx.fill();
    ctx.fillStyle=lit?'#9aa0a0':'#959b97'; rr(x-11,y-7,23,15,2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1; for(var sx=x-9;sx<x+11;sx+=7){ ctx.beginPath(); ctx.moveTo(sx,y-7); ctx.lineTo(sx+3.5,y-11); ctx.lineTo(sx+7,y-7); ctx.stroke(); }
    ctx.fillStyle=lit?'rgba(150,195,230,0.85)':'rgba(120,140,150,0.4)'; ctx.fillRect(x-7,y-2,3,4);
  }
  var ANCHOR={school:'SCHOOL',mall:'RETAIL',tower:'TOWER',plant:'PLANT',depot:'DEPOT'};
  function anchorBld(x,y,lit,label){
    ctx.fillStyle='rgba(30,40,30,0.12)'; rr(x-16,y+10,38,6,2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-18,x,y+12); g.addColorStop(0, lit?'#5f93b8':'#a9ab9e'); g.addColorStop(1, lit?'#3e6f9c':'#8c8e84');
    ctx.fillStyle=g; rr(x-16,y-18,36,30,2); ctx.fill();
    for(var wy=y-13;wy<y+8;wy+=6) for(var wx=x-12;wx<x+16;wx+=7){ ctx.fillStyle=lit?'rgba(170,210,240,0.95)':'rgba(120,140,150,0.4)'; ctx.fillRect(wx,wy,3.2,3.2); }
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
    var occLive=Math.max(0,Math.min(1, occ));

    ctx.clearRect(0,0,W,H);
    drawMap(); connections(); mains();

    var liveCount=Math.round(NPLOT*occ);
    PLOTS.forEach(function(p){
      var lit = p.rank < liveCount;
      var edge = lit && (p.rank > liveCount-COLX.length-1);
      if(p.type==='home') house(p.x,p.y,lit);
      else if(p.type==='com') comUnit(p.x,p.y,lit);
      else if(p.type==='ind') indUnit(p.x,p.y,lit);
      else anchorBld(p.x,p.y,lit,ANCHOR[G.anchor]||'ANCHOR');
      if(edge && Math.sin(T*0.18+p.ph)>0.3) glow(p.x,p.y-2,7,'rgba(70,225,150,0.5)');
    });

    // clean water flowing in (blue); wastewater draining back (brown)
    var loadVis=0.3+0.6*occ;
    flowPulses([[POC.x+18,POC.y],[TRUNKX,POC.y]],0.9+loadVis,loadVis,'rgba(120,200,255,0.95)','rgba(120,200,255,0.6)',false);
    flowPulses([[TRUNKX,ROWY[0]],[TRUNKX,ROWY[ROWY.length-1]]],0.7+loadVis,loadVis,'rgba(120,200,255,0.95)','rgba(120,200,255,0.55)',false);
    ROWY.forEach(function(y){ flowPulses([[TRUNKX,y],[COLX[COLX.length-1],y]],0.8+loadVis,loadVis*0.8,'rgba(120,200,255,0.9)','rgba(120,200,255,0.5)',false); });
    flowPulses([[SEWER.x+18,SEWER.y],[STRUNKX,SEWER.y],[STRUNKX,ROWY[ROWY.length-1]]],0.6+loadVis,loadVis*0.7,'rgba(190,150,95,0.9)','rgba(170,130,80,0.5)',true);

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
    var c_whole=opex*0.40, c_om=opex*0.24, c_meter=opex*0.18, c_admin=opex*0.18;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    var connShare=Math.max(0.08,Math.min(0.45, grant/Math.max(1,buildTot)*0.5));

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

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(N)+' connections',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',kfmt(N)); set('ixSpreadV',CUR+Math.round(revPer)+'/yr'); set('ixAvailV',Math.round(occ*100)+'%');
    set('ixDir',kfmt(N)); set('ixDirS','connections adopted · '+E.volt);
    set('ixMW',kfmt(live)); set('ixMWs',Math.round(occ*100)+'% live · '+(G.host||'host'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Wholesale water',c_whole],['Network O&amp;M',c_om],['Metering',c_meter],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the connections base is too thin to value, raise the connections, the charge or the occupancy.</span>'; return; }
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is a connections annuity (live connections × regulated charge per connection) and the returns model is a simplified DCF in which developer contributions offset the build; not a forecast of any specific year, and not investment advice.');
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'iwnl');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
