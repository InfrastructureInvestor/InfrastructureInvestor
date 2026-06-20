/* Subsea cables, data-driven worked examples.
   Six real submarine-cable systems, one template. Scene config from sc-geo.js (GEO),
   drawn as a top-down premium OCEAN scene in 720x520 scene coords: a blue sea, a
   landmass and a cable landing station on each edge, and a submarine fibre cable
   laid across the seabed between them with mid-ocean repeaters. Bright data pulses
   travel along the cable both ways, scaling with FILL; faint parallel fibre pairs
   light up in proportion to fill. The interactive figures are illustrative: a
   submarine cable has a large fixed build cost, then sells CAPACITY (lit Tbps ×
   fill × price per Gbps per month) to carriers and hyperscalers, increasingly on
   long-term / IRU contracts, so a large share of revenue is contracted (a high
   floor). Subsea is high-margin, O&M is mostly fixed against the capacity line,
   and the returns model is a simplified DCF in which a consortium / hyperscaler
   contribution offsets part of the build cost. */
(function(){
  var CUR='$';
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
  function tbps(gbps){ var t=gbps/1000; return (t>=100?Math.round(t):(t>=10?t.toFixed(0):t.toFixed(1)))+' Tbps'; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · AQUA COMMS (Europe · transatlantic open-access wholesale) ---------- */
  aquacomms:{
    name:'Aqua Comms', geo:'Ireland ↔ United States', continent:'Europe', cur:'€', geoKey:'aquacomms',
    lede:'A carrier-neutral, <b>open-access transatlantic cable</b>, fibre laid across the North Atlantic between Ireland and the US, selling wholesale capacity to carriers, content providers and hyperscalers. The pure-play wholesale subsea model: a huge fixed build, then sell the bandwidth.',
    s1:'<p class="body">A submarine cable is one of the most capital-intensive assets in infrastructure: lay thousands of kilometres of fibre across an ocean floor, light it with terminal equipment, and then sell the <b>capacity</b> it carries. <b>Aqua Comms</b> owns and operates transatlantic systems, fibre between Ireland and the eastern United States, on a <b>carrier-neutral, open-access</b> basis, meaning anyone can buy capacity rather than the cable being captive to one carrier.</p>'+
       '<p class="body">The economics are a fixed-cost business with a throughput line on top. The build, the cable, the marine lay, the landing stations and the lit equipment, is enormous and almost entirely sunk. Against that, revenue is <b>lit capacity × fill × price</b>: how many terabits per second are lit, how much of that is sold, and the price per gigabit per month. The catch is that <b>unit prices fall</b> every year as technology improves, even as demand for bandwidth grows, so the wholesale model lives on filling the cable and signing long-term <b>IRU</b> (indefeasible right of use) contracts to lock in revenue. Operating cost is low and largely fixed, so once the cable fills the margin is very high.</p>',
    facts:[['Transatlantic','Route','Ireland ↔ US east coast'],['Open access','Model','carrier-neutral wholesale'],['Tbps','Product','lit capacity sold per Gbps'],['IRU + lease','Contracts','long-term + short-term'],['~70%+','EBITDA margin','low, mostly-fixed O&M'],['Wholesale','Risk','fill & unit-price decline']],
    s2:'Watch the cable run across the Atlantic. Bright <b>data pulses</b> travel both ways between the two landing stations, and the more of the cable\'s lit capacity is sold, the more pulses light up, that is the <b>fill</b>. Every block of capacity sold drops a <b style="color:#0c6b4f">payment</b>, and the long-term IRU deals arrive as <b style="color:#c0902f">contracted</b> amber. A trickle of <b style="color:#bc4733">O&M</b> drains for marine maintenance. Drag the lit capacity, the price per Gbps and the fill.',
    driverLab:'Price / Gbps·mo', availLab:'Fill / utilisation', hrK:'Capacity revenue', yrS:'lit Tbps × fill × price',
    ledge:{a:'+ capacity',b:'+ IRU/contract',c:'− O&M'}, demandLabel:'FILL',
    preset:'Load Aqua Comms',
    try:'<b>Try this:</b> push the <b>fill</b> up and watch revenue climb almost one-for-one, a subsea cable is operationally geared, so every extra terabit sold drops straight to EBITDA at a very high margin against largely fixed O&M. Then drop the <b>price per Gbps</b> to feel the wholesale risk: unit prices fall year after year, so the operator has to keep filling the cable and signing long-term IRUs just to hold revenue flat. That is the whole tension of the open-access model.',
    s3:'Aqua Comms earns by <b>selling capacity</b> on its transatlantic fibre, terabits per second sold to carriers and content providers, priced per gigabit per month and falling over time. Revenue is lit capacity × the share sold (fill) × price, increasingly underpinned by long-term <b>IRU</b> contracts that lock in a block of revenue for years. Because the cable and its O&M are largely fixed, almost all incremental capacity sale falls to EBITDA; the value swings on how fully the cable fills and how fast unit prices decline.',
    mb:{tag:'Model A · open-access wholesale cable', title:'Pure-play wholesale subsea capacity', body:'A carrier-neutral transatlantic cable selling <b>capacity</b> on an open-access basis, lit Tbps × fill × price, to anyone who wants bandwidth. A huge fixed build, then a high-margin throughput line; the operator carries fill and unit-price risk, offset by long-term IRU contracts. <b>This is Aqua Comms</b>, the pure wholesale subsea model.'},
    s4a:'A submarine cable is cheap to operate relative to what it can earn: a small marine-maintenance reserve, the landing-station and lit-equipment operation, and a modest overhead, against a large capacity revenue. The big cost is not annual opex but the <b>marine maintenance and eventual repeater / upgrade</b> spend, and, every few years, lighting more capacity onto the same fibre. That low, mostly-fixed operating cost is why a full subsea cable runs at 70%+ EBITDA margins.',
    wfNote:'Operating cost is the marine-maintenance reserve (ships on standby to repair faults), the landing-station and terminal-equipment operation, and administration, modest against a large capacity revenue and largely fixed. The heavy spend is periodic upgrades to light more capacity, which sits in maintenance capex. The margin is high once the cable fills; the value is in fill and the price curve.',
    s4b:'The capital is the cable system itself, the wet plant (the cable and repeaters on the seabed), the marine lay, the landing stations and the dry plant (the lit terminal equipment), built once and almost entirely sunk. On a wholesale system the operator funds the build and recovers it by selling capacity; modelled on an enterprise-value basis, the return is a long capacity annuity against an asset that costs little to keep running, exposed to fill and the falling price per bit.',
    stackH:'The capital · net of pre-sales', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',22,'Anchor pre-sales / IRU'],['s2',78,'Operator capital']],
    finList:[['','Route','Ireland ↔ US transatlantic'],['sub','Model','open-access wholesale'],['','Revenue','lit Tbps × fill × price'],['sub','Contracts','IRU + short-term lease'],['','Margin','~70%+ EBITDA'],['rest','Owner','infrastructure-fund backed']],
    finNote:'A wholesale transatlantic cable is a <b>high-margin capacity annuity with merchant edges</b>: lit Tbps × fill × price, low fixed O&M, long IRU contracts. The risks are how fully the cable fills, the relentless decline in unit prices, and a marine fault on the seabed.',
    timeline:[['2015','<b>AEConnect-1</b> transatlantic system enters service.'],['2010s','<b>Open-access model</b>, carrier-neutral wholesale capacity.'],['2020','<b>America Europe Connect-2</b> adds a second system.'],['2020','<b>Digital9 Infrastructure</b> acquires Aqua Comms.'],['2020s','<b>Hyperscaler demand</b> drives transatlantic capacity.'],['Ongoing','<b>IRU contracting</b> locks in long-term revenue.']],
    calcNote:'A working model of an <b>open-access wholesale subsea cable</b>, on an enterprise-value basis. Revenue is lit Tbps × fill × price, with a modest contracted floor from IRU deals; the margin is high but unit prices decline, so demand growth nets to a low/modest figure. A pre-sale contribution offsets part of the build; the IRR sits a touch above towers/fibre to reflect price and obsolescence risk.',
    s6:'Aqua Comms is the pure wholesale subsea model. What drives the return:',
    breakers:['<b>Fill</b>, how fully the lit capacity is sold is the engine; an empty cable earns nothing.','<b>Unit-price decline</b>, price per Gbps falls every year, so volume has to grow just to stand still.','<b>IRU contracting</b>, long-term deals lock in revenue and turn a merchant cable into an annuity.','<b>Marine fault risk</b>, a cable break on the seabed is the operational tail risk of any subsea system.'],
    src:'Figures from public sources on the transatlantic subsea market: <a href="https://aquacomms.com/" target="_blank" rel="noopener">Aqua Comms</a> and submarine-cable industry data (e.g. <a href="https://www.submarinecablemap.com/" target="_blank" rel="noopener">TeleGeography</a>). The figures are approximate and illustrative.',
    econ:{cur:'€', kind:'Open-access wholesale cable',
      capDef:120,capMin:20,capMax:400,capStep:10, priceDef:240,priceMin:60,priceMax:600,priceStep:10,
      fillDef:62,fillMin:15,fillMax:100,fillStep:1, opexPerGbps:250, fixedOM:40},
    calc:{build:2400,grant:300,capex:9,revG:2,floor:120,cap:9e9,tax:13,exit:13,lev:5,rd:5,amort:2,hold:22},
    map:{footer:GEO.aquacomms.footer}
  },

  /* ---------- 2 · GOOGLE SUBSEA (North America · hyperscaler privately-owned) ---------- */
  google:{
    name:'Google subsea (Dunant / Grace Hopper)', geo:'United States ↔ Europe', continent:'North America', cur:'$', geoKey:'google',
    lede:'A <b>privately-owned hyperscaler cable</b>, Google\'s own transatlantic systems (Dunant, Grace Hopper) built to carry its own traffic. The capacity is largely <b>self-supply and contracted</b>, so the revenue is a steady, high-floor internal annuity rather than a merchant wholesale line.',
    s1:'<p class="body">The biggest change in subsea is who builds the cables. A decade ago they were consortia of carriers; today the <b>hyperscalers</b>, Google, Meta, Amazon, Microsoft, fund and own a growing share of new systems outright. <b>Google</b> owns transatlantic cables such as <b>Dunant</b> and <b>Grace Hopper</b>, built primarily to carry <b>its own traffic</b> between data centres on either side of the Atlantic.</p>'+
       '<p class="body">That flips the economics from merchant to <b>self-supply</b>. A hyperscaler does not need to fill the cable by selling to third parties, it consumes the capacity itself, valuing the cable as <b>avoided cost</b> and strategic control of its own network. So the revenue is, in effect, <b>contracted to a single very strong counterparty</b>: steady, high-floor, with little fill or price risk because the owner is also the customer. Modelled as an infrastructure asset, this looks like a long-term, investment-grade-contracted cable, lower returning than a merchant system, but far steadier. Increasingly hyperscalers also sell or swap spare capacity, but the core is self-supply.</p>',
    facts:[['Hyperscaler','Owner','Google · privately owned'],['Self-supply','Model','carries owner\'s own traffic'],['Dunant · GH','Systems','transatlantic cables'],['High floor','Revenue','contracted / avoided cost'],['~75%+','EBITDA margin','steady, contracted'],['Strategic','Driver','control of own network']],
    s2:'Watch the cable run, almost fully lit, a hyperscaler cable is built to be <b>full</b>, carrying the owner\'s own traffic between data centres. The data pulses are dense and constant, and the capacity arrives as <b style="color:#c0902f">contracted</b> amber rather than merchant green, because the owner is also the customer. A steady trickle of <b style="color:#bc4733">O&M</b> drains for marine maintenance. Drag the lit capacity, the implied price and the fill, but notice the high floor keeps revenue steady.',
    driverLab:'Price / Gbps·mo', availLab:'Fill / utilisation', hrK:'Capacity value', yrS:'self-supply × contracted floor',
    ledge:{a:'+ capacity',b:'+ contracted',c:'− O&M'}, demandLabel:'FILL',
    preset:'Load Google subsea',
    try:'<b>Try this:</b> drop the <b>fill</b> and the <b>price</b> right down, and watch the revenue barely move. That is the signature of a <b>hyperscaler self-supply cable</b>: the high contracted floor means the value is the avoided cost of carrying the owner\'s own traffic, not a merchant capacity sale, so it is steady regardless of the wholesale market. The trade-off is a lower headline return than a merchant cable, you are buying contracted steadiness, not fill upside.',
    s3:'Google\'s subsea cables earn, in economic terms, by <b>carrying the owner\'s own traffic</b>, the value is the avoided cost of buying that capacity from a third party, plus strategic control of the network. Because the owner is the customer, the revenue is effectively <b>contracted to a single very strong counterparty</b>: a high floor with little fill or price risk. Spare capacity may be sold or swapped, but the core is self-supply, which makes the cable behave like a long-term, investment-grade-contracted infrastructure asset.',
    mb:{tag:'Model A · hyperscaler self-supply cable', title:'Privately-owned, contracted subsea', body:'A cable funded and owned by a hyperscaler to carry <b>its own traffic</b>, self-supply, valued as avoided cost and network control. The revenue is effectively contracted to a single very strong counterparty: a high floor, little fill or price risk, steady and lower-returning than a merchant system. <b>This is Google\'s Dunant / Grace Hopper</b>.'},
    s4a:'A hyperscaler cable is run to be full and reliable: the marine-maintenance reserve, the landing-station and terminal-equipment operation, and a modest overhead, against the capacity value it carries. Because it is self-supply, there is no sales or churn cost, the customer is the owner, so the operating cost is low and the margin even higher than a merchant cable. The capital line is the marine maintenance and periodic upgrades to light more capacity.',
    wfNote:'Operating cost is the marine-maintenance reserve, the landing-station and terminal operation, and administration, low and largely fixed, with no third-party sales cost since the owner is the customer. The capital spend is periodic upgrades. The margin is very high and, unlike a merchant cable, predictable; the value is the contracted self-supply floor.',
    s4b:'The capital is the cable system, the wet plant on the seabed, the marine lay, the landing stations and the lit equipment, funded entirely by the hyperscaler. Modelled on an enterprise-value basis as if the capacity were contracted out, the return is a steady, high-floor annuity backed by a single investment-grade counterparty: closer to a long-dated contracted asset than a merchant cable, which is why it returns less but far more reliably.',
    stackH:'The capital · self-funded', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',0,'External'],['s2',100,'Hyperscaler capital']],
    finList:[['','Owner','Google (hyperscaler)'],['sub','Model','self-supply / privately owned'],['','Revenue','contracted / avoided cost'],['sub','Counterparty','single investment-grade owner'],['','Margin','~75%+ EBITDA'],['rest','Driver','network control']],
    finNote:'A hyperscaler self-supply cable is a <b>contracted, high-floor annuity backed by a single strong counterparty</b>: steady, very high margin, little fill or price risk. It returns less than a merchant cable but is far steadier; the risks are a marine fault and the owner\'s long-run network strategy.',
    timeline:[['2010s','<b>Hyperscalers begin</b> building their own cables.'],['2020','<b>Dunant</b> transatlantic system enters service.'],['2022','<b>Grace Hopper</b> lands in the UK and Spain.'],['2020s','<b>Self-supply</b> dominates new transatlantic capacity.'],['Ongoing','<b>Spare capacity</b> occasionally sold or swapped.'],['Ongoing','<b>Strategic control</b> of the owner\'s global network.']],
    calcNote:'A working model of a <b>hyperscaler self-supply cable</b>, on an enterprise-value basis, treating the self-supply as a contracted capacity sale. Revenue is set largely by a high <b>contracted floor</b>, independent of the wholesale market, so the return is steady and lower than a merchant cable. The build is self-funded; figures are illustrative of the model.',
    s6:'A hyperscaler cable is contracted steadiness, not merchant fill. What drives the return:',
    breakers:['<b>Self-supply</b>, the owner is the customer, so the value is avoided cost, not a market price.','<b>Contracted floor</b>, a high floor backed by a single strong counterparty makes it bond-like.','<b>Marine fault risk</b>, a seabed cable break is the main operational tail risk.','<b>Network strategy</b>, the owner\'s long-run routing and capacity plans frame the asset.'],
    src:'Figures illustrative of <a href="https://cloud.google.com/about/locations/subsea-cables" target="_blank" rel="noopener">Google\'s subsea cables</a> (Dunant, Grace Hopper) and the hyperscaler-owned model, with industry data from <a href="https://www.submarinecablemap.com/" target="_blank" rel="noopener">TeleGeography</a>. As a self-supply asset, all figures here are approximate and illustrative.',
    econ:{cur:'$', kind:'Hyperscaler self-supply cable',
      capDef:250,capMin:60,capMax:400,capStep:10, priceDef:180,priceMin:60,priceMax:500,priceStep:10,
      fillDef:80,fillMin:30,fillMax:100,fillStep:1, opexPerGbps:360, fixedOM:55},
    calc:{build:3500,grant:0,capex:8,revG:3,floor:330,cap:9e9,tax:21,exit:12,lev:5,rd:5,amort:2,hold:24},
    map:{footer:GEO.google.footer}
  },

  /* ---------- 3 · ELLALINK (South America · direct EU–LatAm system) ---------- */
  ellalink:{
    name:'EllaLink', geo:'Portugal ↔ Brazil', continent:'South America', cur:'€', geoKey:'ellalink',
    lede:'A <b>direct Europe–Latin America</b> express system, fibre straight across the South Atlantic between Portugal and Brazil, bypassing the US. Built on an <b>anchor-tenant plus wholesale</b> model: large pre-committed customers underwrite the build, with the rest sold as capacity.',
    s1:'<p class="body"><b>EllaLink</b> is a submarine cable that connects <b>Europe directly to Latin America</b>, Sines in Portugal to Fortaleza in Brazil, without routing traffic through the United States, cutting the latency between the two continents dramatically. It is the express subsea route that finally gave South America a direct, low-latency path to Europe.</p>'+
       '<p class="body">The commercial model is the common middle ground in subsea: an <b>anchor-tenant plus wholesale</b> system. Large customers, research networks, carriers and content providers, commit to big blocks of capacity up front under long-term <b>IRU</b> contracts, and that anchor revenue underwrites a meaningful share of the build before the cable is even lit. The remaining capacity is then sold wholesale as the cable fills. So part of the revenue is contracted and steady from day one (a floor), and part is merchant fill, exposed to demand growth and the usual decline in unit prices. The build is heavy, the O&M low and fixed, and the margin high once the anchor and wholesale capacity stack up.</p>',
    facts:[['EU ↔ Brazil','Route','direct, bypasses the US'],['Low latency','Edge','express South-Atlantic path'],['Anchor + wholesale','Model','pre-commit + capacity sale'],['IRU','Contracts','long-term anchor blocks'],['~70%+','EBITDA margin','low fixed O&M'],['Contracted floor','Risk','part fill, part contracted']],
    s2:'Watch the express cable run straight across the South Atlantic. The <b>anchor tenants</b> have pre-bought big blocks, so a base layer of pulses is always lit and arrives as <b style="color:#c0902f">contracted</b> amber; the rest of the fill is wholesale capacity sold as the cable ramps, dropping <b style="color:#0c6b4f">payments</b> in green. A trickle of <b style="color:#bc4733">O&M</b> drains for marine maintenance. Drag the lit capacity, the price per Gbps and the fill to see the anchor-plus-wholesale stack.',
    driverLab:'Price / Gbps·mo', availLab:'Fill / utilisation', hrK:'Capacity revenue', yrS:'anchor floor + wholesale fill',
    ledge:{a:'+ capacity',b:'+ anchor IRU',c:'− O&M'}, demandLabel:'FILL',
    preset:'Load EllaLink',
    try:'<b>Try this:</b> drop the <b>fill</b> down and watch revenue fall, but only to the anchor floor, not to zero. That is the point of the <b>anchor-tenant model</b>: the pre-committed IRU blocks give a contracted base that underwrites the build, while the wholesale capacity on top is the fill upside. Then push the fill back up: the express low-latency route to Brazil is the selling point that fills the rest of the cable.',
    s3:'EllaLink earns by <b>selling capacity</b> on its direct EU–Brazil fibre, split two ways. <b>Anchor tenants</b> commit to large blocks under long-term IRU contracts that underwrite the build and give a contracted revenue floor from day one; the remaining capacity is sold <b>wholesale</b> as the cable fills, priced per gigabit per month and falling over time. Revenue is therefore part contracted and steady, part merchant fill, a high-margin capacity annuity whose express low-latency route is its competitive edge.',
    mb:{tag:'Model A · anchor + wholesale cable', title:'Direct EU–LatAm capacity system', body:'A direct, low-latency cable between Europe and Brazil on an <b>anchor-tenant plus wholesale</b> model: big customers pre-commit under IRU to underwrite the build (a contracted floor), the rest sold as capacity fills. Part contracted, part merchant; high margin, with an express-route edge. <b>This is EllaLink</b>.'},
    s4a:'EllaLink is a high-margin throughput asset: the marine-maintenance reserve, the landing-station and terminal operation at Sines and Fortaleza, and a modest overhead, against the capacity revenue. The big cost is not annual opex but the marine maintenance and the periodic upgrades to light more capacity onto the fibre as demand grows. The low, mostly-fixed operating cost is why the margin is high once the anchor and wholesale capacity fill the cable.',
    wfNote:'Operating cost is the marine-maintenance reserve, the landing-station and terminal-equipment operation, and administration, modest against the capacity revenue and largely fixed. The heavy spend is periodic upgrades to light more capacity. The margin is high; the value is in the anchor contracts and how fully the wholesale capacity fills.',
    s4b:'The capital is the cable system, the wet plant across the South Atlantic, the marine lay, and the landing stations in Portugal and Brazil, part-underwritten by the anchor tenants\' pre-commitments before the cable is lit. Modelled on an enterprise-value basis, the return is part contracted anchor annuity, part wholesale fill, against an asset that costs little to keep running once built.',
    stackH:'The capital · net of anchor pre-sales', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',35,'Anchor pre-sales / IRU'],['s2',65,'Operator capital']],
    finList:[['','Route','Portugal ↔ Brazil, direct'],['sub','Model','anchor + wholesale'],['','Revenue','anchor floor + capacity fill'],['sub','Edge','low-latency express route'],['','Margin','~70%+ EBITDA'],['rest','Owner','infrastructure-backed']],
    finNote:'A direct EU–LatAm cable is a <b>hybrid contracted-plus-merchant capacity annuity</b>: an anchor IRU floor underwrites the build, wholesale fill gives the upside, the margin is high and the route low-latency. The risks are wholesale fill, unit-price decline and a marine fault on the South-Atlantic seabed.',
    timeline:[['2018','<b>EllaLink construction</b> begins on the EU–Brazil route.'],['2020','<b>Anchor tenants</b> (research networks, carriers) pre-commit.'],['2021','<b>Cable lands</b> at Sines and Fortaleza, enters service.'],['2021','<b>Direct low-latency path</b> EU–LatAm goes live.'],['2020s','<b>Wholesale capacity</b> sold as the cable fills.'],['Ongoing','<b>Branching units</b> extend reach to new landings.']],
    calcNote:'A working model of an <b>anchor-tenant plus wholesale subsea cable</b>, on an enterprise-value basis. Revenue is lit Tbps × fill × price with a meaningful contracted <b>floor</b> from anchor IRU deals; the margin is high but unit prices decline. The anchor pre-sales offset part of the build; the IRR reflects part-contracted, part-merchant capacity risk.',
    s6:'EllaLink is anchor contracts plus wholesale fill on an express route. What drives the return:',
    breakers:['<b>Anchor IRU floor</b>, pre-committed blocks underwrite the build and give a contracted base.','<b>Wholesale fill</b>, how fully the remaining capacity sells is the upside, and the merchant risk.','<b>Low-latency edge</b>, the direct EU–Brazil route is the competitive reason customers buy.','<b>Unit-price decline</b>, wholesale price per Gbps falls over time, so fill has to keep growing.'],
    src:'Figures from public sources on <a href="https://ella.link/" target="_blank" rel="noopener">EllaLink</a> and the EU–LatAm subsea market, with industry data from <a href="https://www.submarinecablemap.com/" target="_blank" rel="noopener">TeleGeography</a>. The figures are approximate and illustrative.',
    econ:{cur:'€', kind:'Anchor + wholesale cable',
      capDef:100,capMin:20,capMax:300,capStep:10, priceDef:280,priceMin:80,priceMax:600,priceStep:10,
      fillDef:55,fillMin:15,fillMax:100,fillStep:1, opexPerGbps:290, fixedOM:36},
    calc:{build:1900,grant:420,capex:9,revG:3,floor:95,cap:9e9,tax:21,exit:13,lev:5,rd:5.5,amort:2,hold:22},
    map:{footer:GEO.ellalink.footer}
  },

  /* ---------- 4 · SOUTHERN CROSS (Oceania · trans-Pacific operator) ---------- */
  southerncross:{
    name:'Southern Cross', geo:'Australia ↔ NZ ↔ US', continent:'Oceania', cur:'US$', geoKey:'southerncross',
    lede:'The established <b>trans-Pacific operator</b>, Southern Cross has carried Australia and New Zealand\'s traffic to the US for two decades, and now runs <b>Southern Cross NEXT</b>, a new high-capacity express system. A mature wholesale subsea franchise on a critical, capacity-constrained route.',
    s1:'<p class="body"><b>Southern Cross</b> operates the subsea cables that connect <b>Australia and New Zealand to the United States</b> across the Pacific, for two decades the backbone of trans-Pacific connectivity for the region. With <b>Southern Cross NEXT</b>, it added a new, lower-latency, high-capacity express system, refreshing the franchise on a route where demand keeps growing and landing options are limited.</p>'+
       '<p class="body">It is a mature <b>wholesale</b> subsea operator: revenue is capacity sold to carriers, content providers and increasingly hyperscalers, priced per gigabit per month and underpinned by long-term <b>IRU</b> contracts. What distinguishes the trans-Pacific route is that it is <b>long, capacity-constrained and strategically critical</b>, Australasia has relatively few paths to the world, so a well-placed cable enjoys strong, structural demand. The model is the familiar subsea one, lit capacity × fill × price, high fixed-cost build, low fixed O&M, but on a route with durable demand and an established operator with two generations of cable to sell.</p>',
    facts:[['Trans-Pacific','Route','AU ↔ NZ ↔ US'],['Two generations','Systems','legacy + Southern Cross NEXT'],['Wholesale','Model','capacity to carriers / hyperscalers'],['IRU','Contracts','long-term capacity'],['Constrained','Route','few paths from Australasia'],['~70%+','EBITDA margin','low fixed O&M']],
    s2:'Watch the long trans-Pacific cable run between Sydney and the US west coast. Data pulses travel both ways, and on a capacity-constrained route the cable fills steadily, every block of capacity sold drops a <b style="color:#0c6b4f">payment</b>, with the long-term IRU deals arriving as <b style="color:#c0902f">contracted</b> amber. A trickle of <b style="color:#bc4733">O&M</b> drains for marine maintenance across a very long span. Drag the lit capacity, the price per Gbps and the fill.',
    driverLab:'Price / Gbps·mo', availLab:'Fill / utilisation', hrK:'Capacity revenue', yrS:'lit Tbps × fill × price',
    ledge:{a:'+ capacity',b:'+ IRU/contract',c:'− O&M'}, demandLabel:'FILL',
    preset:'Load Southern Cross',
    try:'<b>Try this:</b> push the <b>fill</b> up, on a capacity-constrained trans-Pacific route, structural demand from Australasia keeps the cable filling, and each extra terabit sold drops to EBITDA at a high margin. Then drop the <b>price per Gbps</b>: even here unit prices fall, but a constrained route with few alternatives holds price better than a crowded one. Two generations of cable to sell is the franchise.',
    s3:'Southern Cross earns by <b>selling capacity</b> across the Pacific, terabits sold to carriers, content providers and hyperscalers, priced per gigabit per month and underpinned by long-term IRU contracts. Revenue is lit capacity × fill × price; what makes the franchise valuable is the route, not the price, Australasia has few paths to the world, so demand is structural and a well-placed cable fills reliably. With two generations of cable to sell and low fixed O&M, the operator runs a high-margin, durable wholesale capacity business.',
    mb:{tag:'Model A · trans-Pacific wholesale operator', title:'Mature subsea capacity franchise', body:'An established operator of trans-Pacific cables selling <b>capacity</b> to carriers and hyperscalers on a long, capacity-constrained route. Lit Tbps × fill × price, underpinned by IRU; high margin, low fixed O&M, durable structural demand from Australasia. <b>This is Southern Cross</b>, and Southern Cross NEXT.'},
    s4a:'Southern Cross is a high-margin throughput asset, though a long trans-Pacific span carries a heavier marine-maintenance reserve than a short cable: ships on standby across a vast ocean, the landing-station and terminal operation, and a modest overhead, against the capacity revenue. The big capital line is the marine maintenance and the periodic upgrades to light more capacity, and, periodically, a whole new generation of cable to refresh the franchise.',
    wfNote:'Operating cost is the marine-maintenance reserve across a very long span, the landing-station and terminal operation, and administration, modest against the capacity revenue but heavier than a short cable given the span. The capital spend is periodic upgrades and new-generation cable. The margin is high; the value is in the constrained route and how fully it fills.',
    s4b:'The capital is two generations of cable system, the wet plant across the Pacific, the marine lay, the landing stations in Australia, New Zealand and the US, built and refreshed over two decades. Modelled on an enterprise-value basis, the return is a durable wholesale capacity annuity on a strategically critical, capacity-constrained route, against an asset that costs little to keep running once built.',
    stackH:'The capital · net of pre-sales', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',25,'Anchor pre-sales / IRU'],['s2',75,'Operator capital']],
    finList:[['','Route','AU ↔ NZ ↔ US, trans-Pacific'],['sub','Model','wholesale capacity'],['','Systems','legacy + Southern Cross NEXT'],['sub','Contracts','long-term IRU'],['','Edge','capacity-constrained route'],['rest','Owner','operator / infra-backed']],
    finNote:'A trans-Pacific operator is a <b>durable wholesale capacity annuity on a constrained route</b>: lit Tbps × fill × price, IRU-underpinned, high margin, with structural demand from Australasia and two generations of cable to sell. The risks are unit-price decline, fill, and the marine maintenance of a very long span.',
    timeline:[['2000','<b>Southern Cross Cable Network</b> enters service.'],['2000s','<b>Backbone of Australasian</b> trans-Pacific connectivity.'],['2010s','<b>Capacity upgrades</b> on the legacy systems.'],['2020','<b>Southern Cross NEXT</b> announced, new express system.'],['2022','<b>Southern Cross NEXT</b> enters service.'],['2020s','<b>Hyperscaler demand</b> fills the new capacity.']],
    calcNote:'A working model of a <b>mature trans-Pacific wholesale operator</b>, on an enterprise-value basis. Revenue is lit Tbps × fill × price with an IRU-contracted <b>floor</b>; the margin is high and the route capacity-constrained, so price holds better than a crowded route. Two generations of cable and a long hold reflect a durable franchise; the IRR reflects merchant fill exposure.',
    s6:'Southern Cross is a constrained, strategic route with two cables to sell. What drives the return:',
    breakers:['<b>Route scarcity</b>, Australasia has few paths to the world, so demand is structural.','<b>Fill</b>, how fully the (now two generations of) capacity sells is the engine.','<b>IRU contracting</b>, long-term deals underpin the revenue and steady the cash flow.','<b>Long-span maintenance</b>, a vast Pacific cable carries a heavier marine-maintenance reserve.'],
    src:'Figures from public sources on <a href="https://www.southerncrosscables.com/" target="_blank" rel="noopener">Southern Cross Cable Network</a> and the trans-Pacific subsea market, with industry data from <a href="https://www.submarinecablemap.com/" target="_blank" rel="noopener">TeleGeography</a>. The figures are approximate and illustrative.',
    econ:{cur:'US$', kind:'Trans-Pacific wholesale operator',
      capDef:140,capMin:30,capMax:400,capStep:10, priceDef:230,priceMin:70,priceMax:600,priceStep:10,
      fillDef:60,fillMin:15,fillMax:100,fillStep:1, opexPerGbps:250, fixedOM:55},
    calc:{build:2400,grant:360,capex:9,revG:3,floor:120,cap:9e9,tax:28,exit:13,lev:5,rd:5.5,amort:2,hold:23},
    map:{footer:GEO.southerncross.footer}
  },

  /* ---------- 5 · 2AFRICA / PEACE (Middle East · consortium mega-cable) ---------- */
  twoafrica:{
    name:'2Africa / PEACE', geo:'Middle East / around Africa', continent:'Middle East', cur:'US$', geoKey:'twoafrica',
    lede:'A <b>consortium mega-cable</b>, vast systems such as 2Africa and PEACE that ring or cross Africa with multiple Middle-East landing points, jointly funded by a consortium of carriers and tech firms. Capacity is split among the members and sold wholesale at each landing.',
    s1:'<p class="body">The largest subsea systems are still built by <b>consortia</b>: groups of carriers, regional operators and tech firms that jointly fund an enormous cable and share its capacity. Mega-cables such as <b>2Africa</b> (which encircles the African continent) and <b>PEACE</b> link dozens of countries, with several <b>Middle-East landing points</b> serving the Gulf and the wider region (the flag here is illustrative of the model).</p>'+
       '<p class="body">The consortium model spreads the huge build cost, and the risk, across many members, each of whom takes a slice of capacity to use or resell. So the build is part-funded by the members\' contributions before the cable is lit, and each member earns by using or selling its share of capacity at the landings it cares about. For an investor in a landing or a member stake, the economics are the familiar subsea ones, lit capacity × fill × price, a huge fixed build, low fixed O&M, but with the build cost shared and demand driven by the rapid growth of Middle-East and African connectivity. Unit prices still fall; the volume growth on these emerging routes is the offset.</p>',
    facts:[['Mega-cable','Scale','2Africa rings the continent'],['Consortium','Funding','carriers + tech, shared cost'],['Multi-landing','Reach','many countries / ME points'],['Capacity share','Model','members use or resell'],['Growth','Demand','ME / Africa connectivity'],['~65%+','EBITDA margin','low fixed O&M']],
    s2:'Watch a vast consortium cable run to a Middle-East landing, with branches off to other countries. The capacity is shared among the consortium members, so a base of pulses is always lit and arrives as <b style="color:#c0902f">contracted</b> amber (members\' committed shares); the rest is wholesale capacity sold at the landing as the region\'s demand grows, dropping <b style="color:#0c6b4f">payments</b> in green. A trickle of <b style="color:#bc4733">O&M</b> drains. Drag the lit capacity, the price per Gbps and the fill.',
    driverLab:'Price / Gbps·mo', availLab:'Fill / utilisation', hrK:'Capacity revenue', yrS:'shared capacity × fill × price',
    ledge:{a:'+ capacity',b:'+ member share',c:'− O&M'}, demandLabel:'FILL',
    preset:'Load 2Africa / PEACE',
    try:'<b>Try this:</b> push the <b>fill</b> up, on a fast-growing Middle-East / Africa route, demand is rising quickly, so a consortium cable fills as new networks light up across the region. The shared build means the members\' committed capacity gives a contracted base; the wholesale fill on top is the growth. Drop the <b>price</b> to feel the usual unit-price decline, here the volume growth on emerging routes is what offsets it.',
    s3:'A consortium mega-cable earns at each landing by <b>using or selling capacity</b>, members take a committed share to use or resell, giving a contracted base, and additional capacity is sold wholesale as regional demand grows. Revenue at a landing is lit capacity × fill × price, with the build cost shared across the consortium so each member\'s net capital is lower. The driver is the rapid growth of Middle-East and African connectivity; unit prices still fall, but volume growth on these emerging routes is the offset.',
    mb:{tag:'Model A · consortium mega-cable', title:'Shared-build subsea capacity', body:'A vast cable jointly funded by a <b>consortium</b> of carriers and tech firms, each taking a share of capacity to use or resell at the landings they care about. Shared build, lower net capital per member, a contracted base from committed shares plus wholesale fill on fast-growing ME / Africa routes. <b>This is 2Africa / PEACE</b>.'},
    s4a:'A consortium landing is a high-margin throughput asset: the marine-maintenance reserve (shared across the consortium), the landing-station and terminal operation, and a modest overhead, against the capacity revenue. The big cost is the marine maintenance and the periodic upgrades to light more capacity, but with the build and the reserve shared across many members, each member\'s share of the cost is lower, which is the whole point of the consortium model.',
    wfNote:'Operating cost is the (shared) marine-maintenance reserve, the landing-station and terminal operation, and administration, modest against the capacity revenue and largely fixed. The capital spend is periodic upgrades. The margin is high; the value is in the shared build, the committed capacity and how fast the regional demand fills the rest.',
    s4b:'The capital is the cable system, a vast wet plant ringing or crossing Africa, the marine lay, and many landing stations, funded jointly by the consortium, with each member contributing before the cable is lit. Modelled on an enterprise-value basis for a member or landing, the return is a high-margin capacity annuity on a fast-growing emerging route, with the build cost shared and demand structurally rising.',
    stackH:'The capital · shared across consortium', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',45,'Consortium members'],['s2',55,'This member / landing'],['s2b',0,'']],
    finList:[['','Systems','2Africa · PEACE (illustrative)'],['sub','Model','consortium mega-cable'],['','Funding','shared across members'],['sub','Revenue','member share + wholesale fill'],['','Demand','ME / Africa growth'],['rest','Margin','~65%+ EBITDA']],
    finNote:'A consortium mega-cable is a <b>shared-build capacity annuity on a fast-growing route</b>: lit Tbps × fill × price, a committed-share floor plus wholesale fill, low fixed O&M, build cost spread across many members. The risks are unit-price decline, fill on emerging routes, and a marine fault on a very long system.',
    timeline:[['2010s','<b>Consortium model</b> dominates the largest cables.'],['2020','<b>2Africa announced</b>, a cable ringing the continent.'],['2020s','<b>PEACE cable</b> links Asia, ME, Africa and Europe.'],['2023','<b>2Africa landings</b> light up across the region.'],['2020s','<b>ME / Africa demand</b> grows rapidly.'],['Ongoing','<b>Wholesale capacity</b> sold at each landing.']],
    calcNote:'A working model of a <b>consortium mega-cable landing</b>, on an enterprise-value basis for one member / landing. Revenue is lit Tbps × fill × price with a contracted <b>floor</b> from committed member capacity; the build is shared so net capital is lower, and demand on ME / Africa routes grows quickly. Flags and figures are illustrative of the model.',
    s6:'A consortium mega-cable is a shared build on a fast-growing route. What drives the return:',
    breakers:['<b>Shared build</b>, spreading the huge cost across members lowers each one\'s net capital.','<b>Committed-share floor</b>, members\' contracted capacity gives a steady base of revenue.','<b>Regional growth</b>, rapidly rising ME / Africa connectivity demand is the volume engine.','<b>Unit-price decline</b>, price per Gbps still falls; volume growth on emerging routes offsets it.'],
    src:'Figures illustrative of consortium mega-cables such as <a href="https://www.submarinecablemap.com/" target="_blank" rel="noopener">2Africa and PEACE</a> with Middle-East landing points (flag illustrative), using submarine-cable industry data. All figures here are approximate and illustrative of the model.',
    econ:{cur:'US$', kind:'Consortium mega-cable',
      capDef:160,capMin:30,capMax:400,capStep:10, priceDef:200,priceMin:60,priceMax:550,priceStep:10,
      fillDef:48,fillMin:12,fillMax:100,fillStep:1, opexPerGbps:250, fixedOM:45},
    calc:{build:1900,grant:500,capex:9,revG:4,floor:90,cap:9e9,tax:15,exit:11,lev:5,rd:6,amort:2.5,hold:21},
    map:{footer:GEO.twoafrica.footer}
  },

  /* ---------- 6 · ASIA DIRECT CABLE / SEA-ME-WE 6 (China · pan-Asian consortium) ---------- */
  asiacable:{
    name:'Asia Direct Cable / SEA-ME-WE 6', geo:'Hong Kong ↔ Singapore', continent:'China', cur:'US$', geoKey:'asiacable',
    lede:'A <b>pan-Asian consortium cable</b>, systems such as Asia Direct Cable and SEA-ME-WE 6 that connect China and South-East Asia with the wider world, with <b>China landing points</b>. Consortium-funded, huge capacity, serving the busiest region for new subsea demand.',
    s1:'<p class="body">Asia is the centre of gravity for new subsea capacity, and systems such as the <b>Asia Direct Cable (ADC)</b> and <b>SEA-ME-WE 6</b> connect <b>China and South-East Asia</b>, Hong Kong, mainland China, Singapore and beyond, to each other and to Europe and the Middle East. These are large <b>consortium</b> cables with <b>China landing points</b> (the flag here is illustrative of the model), built to carry the colossal and fast-growing traffic of the region.</p>'+
       '<p class="body">The model is the pan-Asian consortium one: a group of regional carriers and operators jointly funds an enormous cable and shares its capacity, each using or reselling its slice at the landings it serves. The build cost is shared, demand is enormous and growing fast, and the routes, intra-Asia and Asia-to-the-world, are among the busiest for capacity. The economics are the familiar subsea ones: lit capacity × fill × price, a huge fixed build (shared), low fixed O&M, and a contracted base from members\' committed shares. As everywhere in subsea, unit prices fall, but in the busiest region on earth for bandwidth, the volume growth is the strongest offset of all.</p>',
    facts:[['Pan-Asia','Reach','China + SE-Asia landings'],['Consortium','Funding','regional carriers, shared'],['Huge demand','Driver','busiest region for capacity'],['Capacity share','Model','members use or resell'],['China landings','Geography','HK / mainland (illustrative)'],['~65%+','EBITDA margin','low fixed O&M']],
    s2:'Watch a busy pan-Asian cable run between Hong Kong and Singapore, with branches to other landings. The consortium members\' committed capacity keeps a base of pulses lit, arriving as <b style="color:#c0902f">contracted</b> amber; the rest fills fast as Asia\'s enormous demand lights up, dropping <b style="color:#0c6b4f">payments</b> in green. A trickle of <b style="color:#bc4733">O&M</b> drains for marine maintenance. Drag the lit capacity, the price per Gbps and the fill, in the busiest region on earth, the cable fills quickly.',
    driverLab:'Price / Gbps·mo', availLab:'Fill / utilisation', hrK:'Capacity revenue', yrS:'shared capacity × fill × price',
    ledge:{a:'+ capacity',b:'+ member share',c:'− O&M'}, demandLabel:'FILL',
    preset:'Load Asia Direct Cable',
    try:'<b>Try this:</b> push the <b>fill</b> right up, in the busiest region on earth for bandwidth, a pan-Asian cable fills fast, and each extra terabit sold drops to EBITDA at a high margin. The shared consortium build means the members\' committed capacity gives a contracted base. Drop the <b>price</b> to feel the unit-price decline, but Asia\'s sheer volume growth is the strongest offset of any route in subsea.',
    s3:'A pan-Asian consortium cable earns by <b>using or selling capacity</b> at its landings, members take a committed share (a contracted base) and additional capacity is sold as the region\'s demand grows. Revenue at a landing is lit capacity × fill × price, with the build shared across the consortium so net capital per member is lower. The driver is the enormous, fast-growing traffic of China and South-East Asia; unit prices fall, but the volume growth in the busiest region on earth is the strongest offset in subsea.',
    mb:{tag:'Model A · pan-Asian consortium cable', title:'Shared-build Asian capacity', body:'A large cable jointly funded by a <b>consortium</b> of regional carriers, connecting China and South-East Asia with the world, each member taking a share of capacity to use or resell. Shared build, contracted base from committed shares, wholesale fill on the busiest routes on earth. <b>This is Asia Direct Cable / SEA-ME-WE 6</b>.'},
    s4a:'A pan-Asian landing is a high-margin throughput asset: the (shared) marine-maintenance reserve, the landing-station and terminal operation, and a modest overhead, against the capacity revenue. The big cost is the marine maintenance and the periodic upgrades to light more capacity onto the fibre, but with the build and reserve shared across many consortium members, each member\'s share is lower. On the busiest routes, the cable fills fast and the margin is high.',
    wfNote:'Operating cost is the (shared) marine-maintenance reserve, the landing-station and terminal operation, and administration, modest against the capacity revenue and largely fixed. The capital spend is periodic upgrades. The margin is high; the value is in the shared build, the committed capacity and how fast Asia\'s demand fills the rest.',
    s4b:'The capital is the cable system, the wet plant across intra-Asian and Asia-to-world routes, the marine lay, and the landings in China, Hong Kong, Singapore and beyond, funded jointly by the consortium. Modelled on an enterprise-value basis for a member or landing, the return is a high-margin capacity annuity in the fastest-growing region for bandwidth, with the build cost shared and demand rising fastest of any route.',
    stackH:'The capital · shared across consortium', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',48,'Consortium members'],['s2',52,'This member / landing']],
    finList:[['','Systems','ADC · SEA-ME-WE 6 (illus.)'],['sub','Model','pan-Asian consortium'],['','Funding','shared across members'],['sub','Revenue','member share + wholesale fill'],['','Demand','busiest region on earth'],['rest','Margin','~65%+ EBITDA']],
    finNote:'A pan-Asian consortium cable is a <b>shared-build capacity annuity on the busiest routes on earth</b>: lit Tbps × fill × price, a committed-share floor plus wholesale fill, low fixed O&M, build cost spread across members. The risks are unit-price decline and fill, both softened by the fastest demand growth in subsea.',
    timeline:[['2010s','<b>Consortium cables</b> connect China and SE-Asia.'],['2020','<b>SEA-ME-WE 6</b> consortium forms (Asia–ME–Europe).'],['2021','<b>Asia Direct Cable</b> consortium announced.'],['2020s','<b>China + SE-Asia landings</b> built out.'],['2024+','<b>Systems enter service</b> on the busiest routes.'],['Ongoing','<b>Asia\'s demand</b> fills capacity fastest of all.']],
    calcNote:'A working model of a <b>pan-Asian consortium cable landing</b>, on an enterprise-value basis for one member / landing. Revenue is lit Tbps × fill × price with a contracted <b>floor</b> from committed member capacity; the build is shared so net capital is lower, and demand grows fastest of any subsea route. Flags and figures are illustrative of the model.',
    s6:'A pan-Asian consortium cable is a shared build on the busiest routes. What drives the return:',
    breakers:['<b>Shared build</b>, spreading the cost across consortium members lowers each one\'s net capital.','<b>Committed-share floor</b>, members\' contracted capacity gives a steady base of revenue.','<b>Asia\'s demand</b>, the fastest-growing bandwidth demand on earth fills the cable quickly.','<b>Unit-price decline</b>, price per Gbps still falls; Asia\'s volume growth is the strongest offset.'],
    src:'Figures illustrative of pan-Asian consortium cables such as <a href="https://www.submarinecablemap.com/" target="_blank" rel="noopener">Asia Direct Cable and SEA-ME-WE 6</a> with China landing points (flag illustrative), using submarine-cable industry data. All figures here are approximate and illustrative of the model.',
    econ:{cur:'US$', kind:'Pan-Asian consortium cable',
      capDef:180,capMin:40,capMax:400,capStep:10, priceDef:190,priceMin:60,priceMax:550,priceStep:10,
      fillDef:52,fillMin:12,fillMax:100,fillStep:1, opexPerGbps:250, fixedOM:50},
    calc:{build:2300,grant:560,capex:9,revG:4,floor:100,cap:9e9,tax:25,exit:12,lev:5,rd:5.5,amort:2.5,hold:22},
    map:{footer:GEO.asiacable.footer}
  }
  };
  var ORDER=['aquacomms','google','ellalink','southerncross','twoafrica','asiacable'];

  /* ===================================================================
     OCEAN + CABLE RENDERER  (canvas, 720x520), top-down sea
     A blue sea gradient, a landmass and a cable landing station on the left edge
     and another on the right, and a submarine fibre cable laid across the seabed
     between them with mid-ocean repeaters. Faint parallel fibre pairs run along the
     cable; a fraction = fill light up. Bright data pulses travel both directions,
     their number and brightness scaling with fill. Capacity sales rise as +cash
     orbs near the landing stations (amber when contracted / IRU), O&M drains as
     −cash orbs.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  // cable geometry: from left landing station to right landing station, gently curving
  var LX=86, RX=W-86, MY=H*0.5;             // station x's and mid-ocean y
  var CY=H*0.5;                              // baseline cable y
  // cable path is a quadratic curve LX..RX, dipping/rising at the middle
  function cablePt(t){                       // t in 0..1 along the cable
    var x=LX+(RX-LX)*t;
    // two-bend gentle curve (a smooth sweep across the seabed)
    var y=CY + Math.sin(t*Math.PI)* -46 + Math.sin(t*Math.PI*2)*22;
    return {x:x,y:y};
  }
  var REPEATERS=[0.34,0.66];                 // mid-ocean repeater positions
  var pulses=[];                             // data pulses travelling along the cable

  function layout(){
    pulses=[];
    // deterministic pulse pool; subset shown per fill
    for(var i=0;i<40;i++){
      pulses.push({ t:(i/40), dir:(i%2?1:-1), sp:0.0016+ (i%5)*0.0004, idx:i, hue:(i%3) });
    }
  }

  /* ---- base sea + coastlines + landing stations ---- */
  function drawMap(){
    // deep sea gradient
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#0e3a57'); g.addColorStop(0.5,'#125a7e'); g.addColorStop(1,'#0c3850');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // soft seabed shading band along the cable corridor
    ctx.fillStyle='rgba(8,30,46,0.30)'; ctx.fillRect(0,MY-70,W,140);
    // gentle surface caustics / light ripples (deterministic)
    ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1;
    for(var i=0;i<14;i++){ var ry=30+i*36, ph=(T*0.4+i*30)%W;
      ctx.beginPath();
      for(var x=0;x<=W;x+=24){ var yy=ry+Math.sin((x+ph)*0.018)*4; if(x===0)ctx.moveTo(x,yy); else ctx.lineTo(x,yy); }
      ctx.stroke(); }
    coast(true);   // left landmass + station
    coast(false);  // right landmass + station
  }

  /* ---- a coastline running off one edge, with a landing station ---- */
  function coast(left){
    var G=GEO[A.geoKey];
    var edge=left?0:W, sgn=left?1:-1, depth=120;     // how far the land reaches in
    // landmass shape: an irregular coast running the full height, off the edge
    ctx.save();
    var lg=ctx.createLinearGradient(edge, 0, edge+sgn*depth, 0);
    lg.addColorStop(0,'#caa86e'); lg.addColorStop(0.65,'#b89a62'); lg.addColorStop(1,'rgba(184,154,98,0)');
    ctx.fillStyle=lg;
    ctx.beginPath();
    ctx.moveTo(edge, -4);
    var pts=8;
    for(var i=0;i<=pts;i++){
      var fy=-4 + (H+8)*i/pts;
      var inset = 56 + Math.sin(i*1.7+ (left?0:2))*22 + ((i*37)%18);
      ctx.lineTo(edge+sgn*inset, fy);
    }
    ctx.lineTo(edge, H+4); ctx.closePath(); ctx.fill();
    // a soft green interior tint
    ctx.fillStyle='rgba(110,140,80,0.18)';
    ctx.beginPath(); ctx.moveTo(edge,-4);
    for(var j=0;j<=pts;j++){ var fy2=-4+(H+8)*j/pts; var ins2=(56+Math.sin(j*1.7)*22)*0.55; ctx.lineTo(edge+sgn*ins2,fy2); }
    ctx.lineTo(edge,H+4); ctx.closePath(); ctx.fill();
    ctx.restore();
    // shoreline foam line
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1.4;
    ctx.beginPath();
    for(var k=0;k<=pts;k++){ var fy3=-4+(H+8)*k/pts; var ins3=56+Math.sin(k*1.7+(left?0:2))*22+((k*37)%18);
      var px=edge+sgn*ins3; if(k===0)ctx.moveTo(px,fy3); else ctx.lineTo(px,fy3); }
    ctx.stroke();
    // landing station: a small coastal building + manhole where the cable meets land
    var p=left?cablePt(0):cablePt(1);
    landingStation(p.x, p.y, left, left?G.leftLand:G.rightLand);
  }

  function landingStation(x,y,left,label){
    ctx.save();
    // manhole / beach joint where the cable surfaces
    ctx.fillStyle='rgba(20,40,52,0.6)'; ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1d2c33'; ctx.beginPath(); ctx.arc(x,y,3.2,0,Math.PI*2); ctx.fill();
    // building set back on the land side
    var bx=x+(left?-30:30)-14, by=y-38, bw=28, bh=22;
    ctx.fillStyle='rgba(20,30,25,0.22)'; rr(bx+2,by+3,bw,bh,3); ctx.fill();
    ctx.fillStyle='#e8eef0'; rr(bx,by,bw,bh,3); ctx.fill();
    ctx.fillStyle='#c2ccd0'; rr(bx,by,bw,7,3); ctx.fill();             // roof band
    // windows
    ctx.fillStyle='rgba(60,110,140,0.55)';
    for(var i=0;i<3;i++){ rr(bx+4+i*8,by+11,5,6,1); ctx.fill(); }
    // small antenna / mast
    ctx.strokeStyle='#9aa6ab'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(bx+bw-5,by); ctx.lineTo(bx+bw-5,by-9); ctx.stroke();
    ctx.fillStyle=(Math.sin(T*0.2)>0?'#39d98a':'#2a8f5e'); ctx.beginPath(); ctx.arc(bx+bw-5,by-9,1.7,0,Math.PI*2); ctx.fill();
    // duct from building to manhole
    ctx.strokeStyle='rgba(230,238,240,0.4)'; ctx.lineWidth=2; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(bx+(left?bw:0),by+bh-2); ctx.lineTo(x,y); ctx.stroke(); ctx.setLineDash([]);
    // label
    ctx.fillStyle='rgba(235,242,245,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('▾ '+label, x+(left?-16:16), by-4);
    ctx.fillStyle='rgba(200,222,232,0.7)'; ctx.font='600 6.5px Inter,sans-serif';
    ctx.fillText('CABLE LANDING STATION', x+(left?-16:16), by+bh+10);
    ctx.restore();
  }

  /* ---- the submarine cable: faint fibre pairs, of which a fraction = fill light ---- */
  function cable(fill){
    var G=GEO[A.geoKey];
    // armoured cable base line (sweep)
    ctx.lineCap='round';
    ctx.strokeStyle='rgba(8,20,30,0.55)'; ctx.lineWidth=7;
    pathCable(); ctx.stroke();
    ctx.strokeStyle='rgba(60,90,110,0.6)'; ctx.lineWidth=4.5; pathCable(); ctx.stroke();
    // faint parallel fibre pairs; lit fraction = fill
    var pairs=6, lit=Math.round(pairs*fill);
    for(var fp=0;fp<pairs;fp++){
      var off=(fp-(pairs-1)/2)*2.0;
      var on=(fp<lit);
      ctx.strokeStyle= on ? 'rgba(120,225,255,0.55)' : 'rgba(150,180,200,0.16)';
      ctx.lineWidth= on?1.3:1;
      ctx.beginPath();
      for(var t=0;t<=1.0001;t+=0.04){ var p=cablePt(t); if(t===0)ctx.moveTo(p.x,p.y+off); else ctx.lineTo(p.x,p.y+off); }
      ctx.stroke();
    }
    ctx.lineCap='butt';
    // mid-ocean repeaters
    REPEATERS.forEach(function(rt){ var p=cablePt(rt);
      ctx.fillStyle='rgba(20,40,52,0.85)'; rr(p.x-6,p.y-4,12,8,3); ctx.fill();
      ctx.fillStyle='#3a5d6e'; rr(p.x-6,p.y-4,12,3,2); ctx.fill();
      var lit2=(Math.sin(T*0.18+rt*9)>0);
      ctx.fillStyle=(lit2?'#7be1ff':'#2a6f88'); ctx.beginPath(); ctx.arc(p.x,p.y+2,1.6,0,Math.PI*2); ctx.fill();
    });
  }
  function pathCable(){ ctx.beginPath(); for(var t=0;t<=1.0001;t+=0.03){ var p=cablePt(t); if(t===0)ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); } }

  /* ---- data pulses travelling along the cable ---- */
  function drawPulses(fill){
    var nShow=Math.round(4+fill*34);
    for(var i=0;i<pulses.length && i<nShow;i++){
      var pl=pulses[i];
      if(_anim){ pl.t += pl.dir*pl.sp*(0.7+fill*1.0); if(pl.t>1){pl.t-=1;} if(pl.t<0){pl.t+=1;} }
      var p=cablePt(pl.t);
      var bright=0.45+fill*0.55;
      var col = pl.hue===0?'rgba(123,225,255,':(pl.hue===1?'rgba(150,235,255,':'rgba(90,210,255,');
      glow(p.x,p.y,7,col+(0.5*bright)+')', 1);
      ctx.fillStyle=col+(0.9*bright)+')'; ctx.beginPath(); ctx.arc(p.x,p.y,1.8,0,Math.PI*2); ctx.fill();
    }
  }

  /* ---- value-flow orbs (shared overlay), IDENTICAL ---- */
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
  /* ---- live P&L ledger, IDENTICAL ---- */
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
  /* ---- live fill sparkline, IDENTICAL ---- */
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
    var capTbps=parseFloat(sCap.value), fill=parseFloat(sAvail.value)/100, price=parseFloat(sSpread.value);
    var soldGbps=capTbps*1000*fill;
    var revenue=soldGbps*price*12;              // annual; price is per Gbps per month

    ctx.clearRect(0,0,W,H);
    drawMap(); cable(fill); drawPulses(fill);

    // ---- economics (capacity fill + contracted floor) ----
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));   // floor = contracted IRU / long-term capacity (hyperscaler => high floor)
    var opex= (E.fixedOM||0)*1e6 + soldGbps*(E.opexPerGbps||0);   // O&M (cable + landing stations + marine maintenance) is mostly FIXED
    var ebitda=revenue-opex;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // waterfall split of opex
    var c_marine=opex*0.40, c_station=opex*0.24, c_capac=opex*0.22, c_admin=opex*0.14;
    // share of "+cash" that is amber (contracted / IRU) vs green (merchant wholesale)
    var floorBinds = floor>0 && revenue<=floor*1.001;
    var contractShare = (G.kind==='hyperscaler') ? 0.85
                      : (G.kind==='consortium') ? 0.5
                      : floorBinds ? 0.55 : 0.18;

    var dens=fill;

    // capacity-sale orbs near the landing stations (green merchant / amber contracted)
    if(_anim){
      var saleRate=Math.max(0.05,Math.min(0.6, fill));
      if(Math.random()<saleRate*0.6){
        var leftEnd=Math.random()<0.5; var p=leftEnd?cablePt(0.02):cablePt(0.98);
        var amber=Math.random()<contractShare;
        spawnCoin(p.x+(leftEnd?14:-14), p.y-6, amber?'rec':'ret', -1);
      }
      // −cash (O&M) drains along the cable at a low rate
      var outRate=Math.max(0.04,Math.min(0.4, opex/Math.max(1,revenue)));
      if(Math.random()<outRate*0.5){ var rp=cablePt(rnd(0.2,0.8)); spawnCoin(rp.x, rp.y+8, 'cost', 1); }
      demHist.push(Math.max(0,Math.min(1,fill))); if(demHist.length>73) demHist.shift();
    }

    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,fill)));

    // route label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(220,235,242,0.78)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(210,228,238,0.72)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+capTbps+' Tbps lit',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(4,18,30,0)'); vg.addColorStop(1,'rgba(4,18,30,0.28)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',capTbps+' Tbps'); set('ixSpreadV', CUR+price+'/Gbps·mo'); set('ixAvailV',Math.round(fill*100)+'%');
    set('ixDir',capTbps+' Tbps'); set('ixDirS','lit capacity · '+(E.kind||'cable'));
    set('ixMW',tbps(soldGbps)+' sold'); set('ixMWs',Math.round(fill*100)+'% fill · '+(G.kind==='hyperscaler'?'self-supply':'capacity sold'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Marine maintenance',c_marine],['Landing stations',c_station],['Capacity / lit',c_capac],['Admin',c_admin]], ebitda);
    set('wfMargin', revenue>0?Math.round(ebitda/revenue*100)+'%':'—');
  }
  function stripTags(s){ return s.replace(/&amp;/g,'&'); }

  /* ---------------- EBITDA waterfall (SVG), IDENTICAL ---------------- */
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
     DCF / LBO CALCULATOR, IDENTICAL
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the cable is too lightly sold to value, raise the lit capacity, the price per Gbps or the fill.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build</span> <b>'+money(capexGrossG)+'</b></span>'+
      '<span><span class="lbl">Net of contribution</span> <b>'+money(netCapexG)+'</b></span>'+
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
    sCap.min=E.capMin; sCap.max=E.capMax; sCap.step=E.capStep; sCap.value=E.capDef;
    sSpread.min=E.priceMin; sSpread.max=E.priceMax; sSpread.step=E.priceStep; sSpread.value=E.priceDef;
    sAvail.min=E.fillMin; sAvail.max=E.fillMax; sAvail.step=E.fillStep; sAvail.value=E.fillDef;
    html('s3intro',A.s3);
    set('mbTag',A.mb.tag); set('mbTitle',A.mb.title); html('mbBody',A.mb.body);
    html('s4intro1',A.s4a); html('wfNote',A.wfNote); html('s4intro2',A.s4b);
    set('finStackH',A.stackH); html('finSplitL',A.splitL); html('finSplitR',A.splitR);
    html('finSplit',A.split.filter(function(s){ return s[1]>0; }).map(function(s){ return '<div class="seg '+s[0]+'" style="width:'+s[1]+'%">'+s[2]+'</div>'; }).join(''));
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
    html('ixSrc',A.src+' The interactive figures are illustrative, a submarine cable has a large fixed build cost, then sells capacity (lit Tbps × fill × price per Gbps per month), increasingly on long-term / IRU contracts so a share of revenue is contracted; the returns model is a simplified DCF in which a consortium / pre-sale contribution offsets part of the build; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING, IDENTICAL
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.capDef; sSpread.value=E.priceDef; sAvail.value=E.fillDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'aquacomms');

  /* section rail scroll-spy, IDENTICAL */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
