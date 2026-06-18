/* Fibre networks (FTTH/FTTP) — data-driven worked examples.
   Six real fibre builders, one template. Scene config from fb-geo.js (GEO),
   drawn as a top-down fibre access network in a 720x520 scene: a headend /
   exchange (OLT) at one side feeds a fibre spine down the streets to a grid of
   homes. The fibre PASSES every home — a large, fixed cost — but the operator
   earns only on the homes that actually CONNECT (take-up / penetration). The
   interactive figures are illustrative: a fibre builder's profitability is ALL
   about PENETRATION — most network opex is per-home-PASSED, so at low penetration
   the fixed cost swamps the revenue (the altnet risk) and at high penetration the
   margin re-rates. This is the PENETRATION FLYWHEEL. Revenue here is modelled as
   connected homes × ARPU; the returns model is a simplified DCF in which a public
   or rural subsidy offsets part of the cost of passing the homes. */
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

  /* ---------- 1 · CITYFIBRE (Europe · wholesale altnet overbuild) ---------- */
  cityfibre:{
    name:'CityFibre', geo:'United Kingdom · Europe', continent:'Europe', cur:'£', geoKey:'cityfibre',
    lede:'The UK\'s largest independent <b>altnet</b> — a wholesale fibre builder <b>overbuilding</b> the incumbent across dozens of towns. It has spent billions to <b>pass</b> homes; the entire risk and return now lives in the <b>penetration ramp</b>.',
    s1:'<p class="body">A fibre builder spends a large, fixed cost to <b>pass</b> a home — running fibre down the street past the door — and then earns nothing until that home actually <b>connects</b> (take-up, or penetration). Most of the network opex is incurred per home <b>passed</b>, not per home connected, so at low penetration the fixed cost of the build swamps the thin revenue and the network loses money. As penetration climbs, the same passed-homes base spreads over far more paying connections and the margin re-rates sharply. This is the <b>penetration flywheel</b>, and for an altnet it is the whole story.</p>'+
       '<p class="body"><b>CityFibre</b> is the UK\'s leading independent <b>altnet</b> — a wholesale-only network builder <b>overbuilding</b> the Openreach incumbent across dozens of British towns and cities. It has raised and spent billions to pass millions of homes, selling access wholesale to retail ISPs rather than to consumers directly. Because the capital to pass the homes is already sunk, the investment case is not the build — it is <b>how fast take-up ramps</b> on a network that, at low penetration, is deeply loss-making. The altnet bet is that penetration crosses the threshold where the fixed cost is covered and the annuity compounds.</p>',
    facts:[['Altnet','Model','wholesale overbuild'],['Millions','Homes passed','built ahead'],['Penetration','The lever','low = loss'],['Wholesale','Customers','retail ISPs'],['Overbuild','Strategy','vs Openreach'],['Ramp','Stage','take-up is the case']],
    s2:'Watch the streets fill. Light leaves the <b>exchange (OLT)</b> and runs along the fibre spine, which <b>passes every home</b> — that is the fixed cost, already spent. But only the <b>connected</b> homes light up, take a drop fibre and glow; the connected fraction is the <b>penetration</b>. The owner\'s <b style="color:#0c6b4f">money</b> is connected homes × ARPU, and at low penetration it barely exists. Drag the homes passed, the ARPU and the penetration, and watch a freshly-passed, near-empty network bleed while a well-penetrated one prints.',
    driverLab:'ARPU', availLab:'Penetration', hrK:'Service revenue', yrS:'connected × ARPU',
    ledge:{a:'+ broadband',b:'+ wholesale',c:'− network opex'}, demandLabel:'PENETRATION',
    preset:'Load CityFibre',
    try:'<b>Try this:</b> drop the <b>penetration</b> toward a freshly-passed network and it turns red — the fixed cost of passing the homes overwhelms the few connections, and the model reports it is too thin to value. Now raise penetration: the same homes passed, the same ARPU, but the fixed base spreads over many connections and EBITDA turns sharply positive. <b>Penetration, not the homes passed, is the asset.</b>',
    s3:'CityFibre earns a wholesale <b>charge per connected home</b> — paid by the retail ISPs that ride its network — on every home that takes service. Because the cost of <b>passing</b> the homes is fixed and already sunk, that revenue only becomes profit once enough homes <b>connect</b>: the return is driven by <b>penetration</b> × ARPU. A well-penetrated town is a long, indexed annuity; a freshly-passed one is a liability until the customers migrate across from the incumbent.',
    mb:{tag:'Model A · the penetration flywheel', title:'Wholesale altnet overbuild', body:'A wholesale fibre builder overbuilding the incumbent, having sunk billions to <b>pass</b> homes and now earning only on the homes that <b>connect</b>. High fixed cost per home passed means a freshly-built network loses money and a well-penetrated one re-rates sharply. <b>This is CityFibre</b> — the altnet bet that take-up ramps across the threshold.'},
    s4a:'A fibre network\'s operating cost is largely <b>fixed per home passed</b> — maintaining the spine, powering the exchange, leasing duct and poles, and overheads — incurred whether or not a single home on the street ever connects. That is the whole story: at low penetration these costs swamp the thin connected revenue and the network loses money; as penetration climbs the same cost base spreads over far more paying connections, and the margin turns sharply positive. The defining number is not the cost line but <b>penetration</b>.',
    wfNote:'Operating cost is dominated by fixed, per-home-passed items — spine and network maintenance, exchange power, duct and pole rental, and overheads — incurred whether or not the home connects, plus a smaller cost that scales with each active connection. Against revenue that only arrives with take-up, that fixed base is exactly why penetration, not cost-cutting, is the lever.',
    s4b:'The capital is the cost of <b>passing the homes</b> — the civils, fibre, duct and the exchange equipment to run fibre down every street in the footprint. It is heavy and almost entirely upfront. An altnet typically gets <b>little public subsidy</b> in dense towns, so its net capital is close to its gross build, and that outlay only earns its return once penetration ramps. A modest grant applies in the harder-to-reach edges of the footprint.',
    stackH:'The capital · passing the homes, net of subsidy', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',8,'Public subsidy'],['s2',92,'Altnet net capital']],
    finList:[['','Model','wholesale altnet'],['sub','Customers','retail ISPs'],['','Revenue','charge per connected home'],['sub','Key lever','penetration ramp'],['','Strategy','overbuild the incumbent'],['rest','Stage','built ahead, ramping take-up']],
    finNote:'An altnet is a <b>penetration ramp on a sunk overbuild</b>: heavy fixed cost per home passed, revenue only on the homes that connect, and a return that arrives only as take-up climbs. The risks are the pace of migration from the incumbent, overbuild competition compressing penetration, and the cost of capital funding a long ramp.',
    timeline:[['2011','<b>CityFibre</b> formed to build independent fibre in UK cities.'],['2018','<b>Taken private</b> by Antin / West Street to fund a national build.'],['2020s','<b>Billions raised</b> to pass millions of homes wholesale.'],['2020s','<b>Overbuild</b> of Openreach across dozens of towns.'],['2020s','<b>Penetration ramp</b> begins as ISPs migrate customers.'],['Ongoing','<b>Take-up climbs</b> toward the threshold where the annuity compounds.']],
    calcNote:'A working model of a <b>wholesale altnet</b>, on an enterprise-value basis. The build is the cost of passing the homes, with little subsidy in dense towns; revenue is the wholesale charge on connected homes, which lives or dies on penetration. ARPU and penetration growth drive the ramp from deep loss to a long annuity.',
    s6:'CityFibre is the penetration flywheel before it has fully spun up. What moves the return:',
    breakers:['<b>Penetration</b> — the dominant lever; a freshly-passed network loses money, a well-penetrated one re-rates.','<b>Migration pace</b> — how fast ISPs move customers off the incumbent sets the ramp.','<b>Overbuild competition</b> — rival altnets and Openreach on the same streets cap take-up.','<b>Cost of capital</b> — funding a long penetration ramp on a sunk build.'],
    src:'Figures from public sources on the UK altnet market: <a href="https://www.cityfibre.com/" target="_blank" rel="noopener">CityFibre</a> investor disclosure and the broader full-fibre sector. The figures are approximate and illustrative.',
    econ:{cur:'£', model:'wholesale altnet',
      hpDef:3.8,hpMin:0.5,hpMax:8,hpStep:0.1, arpuDef:17,arpuMin:8,arpuMax:35,arpuStep:1,
      penDef:34,penMin:5,penMax:90,penStep:1, opexPerHP:14, opexPerConn:26, fixedOM:24},
    calc:{build:2130,grant:140,capex:11,revG:4,floor:60,cap:1400,tax:25,exit:12,lev:5,rd:7,amort:3,hold:16},
    map:{footer:GEO.cityfibre.footer}
  },

  /* ---------- 2 · FRONTIER COMMUNICATIONS (North America · incumbent FTTH) ---------- */
  frontier:{
    name:'Frontier Communications', geo:'United States', continent:'North America', cur:'US$', geoKey:'frontier',
    lede:'A US <b>incumbent</b> rebuilding itself by converting copper to <b>fibre-to-the-home</b> — passing millions of homes with FTTH and re-rating each one as customers take the faster service. The same penetration flywheel, on an existing footprint.',
    s1:'<p class="body"><b>Frontier Communications</b> is a US incumbent telco that emerged from bankruptcy with a single strategy: convert its legacy <b>copper</b> footprint to <b>fibre-to-the-home</b>. It spends a large fixed cost to <b>pass</b> each home with new fibre, then earns a much higher ARPU on the homes that <b>connect</b> to the fibre service. Because it already owns the footprint, the customer relationships and the existing copper revenue, the conversion is a re-rating: the same home, passed with fibre, is worth far more once it takes the faster product.</p>'+
       '<p class="body">The economics are the <b>penetration flywheel</b> on an incumbent base. The cost of passing a home with fibre is fixed and upfront; the return depends on the <b>fibre penetration</b> — how many passed homes migrate from copper (or a rival cable operator) onto the new fibre. Frontier targets a high terminal penetration because it can convert its own existing base, which gives it a steadier ramp than a greenfield altnet. The investment case is the pace and the terminal level of fibre take-up across millions of converted homes.</p>',
    facts:[['Incumbent','Model','copper-to-fibre'],['Millions','Homes passed','FTTH conversion'],['Penetration','The lever','migration to fibre'],['Higher','ARPU','fibre re-rates copper'],['Existing','Base','owns the footprint'],['Ramp','Stage','converting + filling']],
    s2:'Picture an existing town being rebuilt with fibre. Light leaves the <b>exchange (OLT)</b> and runs along new fibre that <b>passes every home</b> — the fixed conversion cost. The homes that migrate onto fibre <b>connect</b>, take a drop and glow; the connected fraction is the fibre <b>penetration</b>. The owner\'s <b style="color:#0c6b4f">money</b> is connected homes × a higher fibre ARPU. Drag the homes passed, the ARPU and the penetration to see a freshly-converted town earn little and a well-migrated one re-rate.',
    driverLab:'ARPU', availLab:'Penetration', hrK:'Service revenue', yrS:'connected × ARPU',
    ledge:{a:'+ broadband',b:'+ video/voice',c:'− network opex'}, demandLabel:'PENETRATION',
    preset:'Load Frontier',
    try:'<b>Try this:</b> drop the <b>penetration</b> to a just-converted town and it earns little against the fixed conversion cost. Now raise penetration as the base migrates from copper onto fibre and the same passed homes re-rate sharply — a higher ARPU on far more connections. <b>Penetration of the fibre, not the copper footprint, is the asset.</b>',
    s3:'Frontier earns a <b>service charge per connected home</b> — broadband, plus some video and voice — and the fibre product carries a materially higher ARPU than the copper it replaces. Because the cost of passing a home with fibre is fixed and sunk, the return is driven by the <b>fibre penetration</b>: how many passed homes migrate onto the new service. Converting its own existing base gives Frontier a steadier ramp and a higher terminal penetration than a greenfield builder could expect.',
    mb:{tag:'Model A · the penetration flywheel', title:'Incumbent copper-to-fibre FTTH', body:'An incumbent telco converting its copper footprint to fibre, paying a fixed cost to <b>pass</b> each home with FTTH and re-rating it as customers <b>connect</b> to the higher-ARPU fibre service. The penetration flywheel on an owned base, with a steadier ramp and a higher terminal take-up. <b>This is Frontier</b> — copper-to-fibre at national scale.'},
    s4a:'Frontier\'s operating cost is largely <b>fixed per home passed</b> — maintaining the fibre plant, exchange power, pole and duct, and the overhead of running a national network — incurred whether or not a passed home migrates onto fibre. At low fibre penetration the fixed base swamps the connected revenue; as the base migrates from copper, the same costs spread over more high-ARPU connections and the margin re-rates. Owning the existing base makes the migration steadier than a greenfield ramp.',
    wfNote:'Operating cost is dominated by fixed, per-home-passed items — fibre plant maintenance, exchange power, pole and duct, and network overhead — plus a smaller cost per active connection. Against revenue that re-rates only as homes migrate onto fibre, the fixed base is why penetration, not cost-cutting, is the lever.',
    s4b:'The capital is the cost of <b>passing each home with new fibre</b> — overlaying the copper plant with FTTH across an existing footprint. It is heavy and upfront, though cheaper per home than greenfield because the poles, ducts and right-of-way already exist. A modest <b>public subsidy</b> (federal and state broadband programmes) part-funds the harder-to-reach rural homes. That net outlay re-rates as the converted base migrates onto fibre.',
    stackH:'The capital · fibre conversion, net of subsidy', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',16,'Public subsidy'],['s2',84,'Incumbent net capital']],
    finList:[['','Model','incumbent copper-to-fibre'],['sub','Product','FTTH broadband + video'],['','Revenue','higher ARPU per fibre home'],['sub','Key lever','fibre penetration ramp'],['','Advantage','owns existing footprint'],['rest','Stage','converting + filling fibre']],
    finNote:'An incumbent FTTH conversion is a <b>penetration re-rating on an owned base</b>: fixed cost to pass each home with fibre, a higher ARPU on each that migrates, and a steadier ramp than greenfield. The risks are the pace of migration, cable-operator competition for the same homes, and the cost of capital on a multi-year conversion.',
    timeline:[['2021','<b>Frontier exits bankruptcy</b> and pivots to a fibre-first strategy.'],['2020s','<b>Copper-to-fibre</b> conversion of millions of homes begins.'],['2020s','<b>Higher fibre ARPU</b> re-rates the converted base.'],['2020s','<b>Federal &amp; state subsidy</b> co-funds rural passings.'],['2024','<b>Verizon agrees to acquire Frontier</b>, validating the fibre build.'],['Ongoing','<b>Penetration ramps</b> as the base migrates onto fibre.']],
    calcNote:'A working model of an <b>incumbent copper-to-fibre FTTH build</b>, on an enterprise-value basis. The build is the cost of passing homes with new fibre, cheaper than greenfield and part-subsidised in rural areas; revenue is a higher ARPU on connected fibre homes, and the return turns on the fibre penetration ramp across an owned base.',
    s6:'Frontier is the penetration flywheel on an incumbent base. What drives it:',
    breakers:['<b>Fibre penetration</b> — how many passed homes migrate from copper onto fibre is the core lever.','<b>ARPU uplift</b> — the fibre product re-rates each home above the copper it replaces.','<b>Cable competition</b> — the cable operators fight for the same homes, capping take-up.','<b>Conversion pace &amp; subsidy</b> — how fast the footprint converts and how much rural support arrives.'],
    src:'Figures from public sources on the US fibre market: <a href="https://www.frontier.com/" target="_blank" rel="noopener">Frontier Communications</a> investor disclosure and the broader FTTH sector. The figures are approximate and illustrative.',
    econ:{cur:'US$', model:'incumbent copper-to-fibre',
      hpDef:7,hpMin:1,hpMax:15,hpStep:0.5, arpuDef:62,arpuMin:35,arpuMax:95,arpuStep:1,
      penDef:43,penMin:10,penMax:90,penStep:1, opexPerHP:38, opexPerConn:150, fixedOM:200},
    calc:{build:18700,grant:1500,capex:11,revG:3.5,floor:300,cap:9000,tax:21,exit:11,lev:5,rd:7,amort:4,hold:14},
    map:{footer:GEO.frontier.footer}
  },

  /* ---------- 3 · FIBRASIL (South America · neutral wholesale fibre, EM) ---------- */
  fibrasil:{
    name:'FiBrasil', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'fibrasil',
    lede:'A <b>neutral</b>, wholesale-only fibre network in Brazil — a joint venture of Telefônica Brasil and the Canadian pension fund CDPQ — building FTTH and selling open access to all comers. The penetration flywheel at an emerging-market cost of capital.',
    s1:'<p class="body"><b>FiBrasil</b> is a <b>neutral network</b> — a wholesale-only fibre operator that builds FTTH and sells open access to any retail provider, owning no end customers itself. It is a joint venture between Telefônica Brasil (Vivo) and the Canadian pension investor <b>CDPQ</b>, created to expand fibre into Brazilian cities and towns beyond Telefônica\'s own footprint. As a neutral host it passes homes with fibre and earns a wholesale charge on each home a retail ISP connects across its network.</p>'+
       '<p class="body">The economics are the same <b>penetration flywheel</b>, financed at an <b>emerging-market cost of capital</b>. The cost of passing the homes is fixed and upfront; the return depends on how many passed homes are <b>connected</b> by the ISPs that ride the network. Brazil has strong fibre demand and rising take-up, but a neutral model means penetration is shared across multiple retail partners, and the discount rate is high. The investment case is a penetration ramp on a wholesale network, anchored by a strategic anchor tenant (Vivo) and a long-term pension backer.</p>',
    facts:[['Neutral','Model','open-access wholesale'],['Vivo + CDPQ','Owners','JV, pension-backed'],['FTTH','Build','Brazilian cities'],['Penetration','The lever','shared across ISPs'],['Anchor','Tenant','Telefônica / Vivo'],['EM rate','Discount','higher cost of capital']],
    s2:'Picture a Brazilian city being passed with neutral fibre. Light leaves the <b>exchange (OLT)</b> and runs along fibre that <b>passes every home</b> — the fixed cost. Homes that any retail ISP <b>connects</b> light up and glow; the connected fraction is the <b>penetration</b>, shared across all the partners. The owner\'s <b style="color:#0c6b4f">money</b> is connected homes × a wholesale ARPU. Drag the homes passed, the ARPU and the penetration to see a freshly-passed network thin and a well-penetrated one earn.',
    driverLab:'ARPU', availLab:'Penetration', hrK:'Service revenue', yrS:'connected × ARPU',
    ledge:{a:'+ wholesale',b:'+ anchor',c:'− network opex'}, demandLabel:'PENETRATION',
    preset:'Load FiBrasil',
    try:'<b>Try this:</b> drop the <b>penetration</b> on a freshly-passed neutral network and it tips into loss — the fixed cost of passing the homes doesn\'t care how many ISPs are selling on it. Raise penetration as the retail partners fill the network and the same passed homes earn. Then note the high cost of debt: an <b>emerging-market discount rate</b> weighs on a long ramp.',
    s3:'FiBrasil earns a <b>wholesale charge per connected home</b> from the retail ISPs that ride its neutral network, plus the anchor commitment from Telefônica. Because the cost of passing the homes is fixed and sunk, the return is driven by <b>penetration</b> — but on a neutral model that take-up is shared across multiple partners rather than captured by one. Strong Brazilian fibre demand supports the ramp; the emerging-market cost of capital is the offsetting weight.',
    mb:{tag:'Model A · the penetration flywheel', title:'Neutral wholesale fibre (EM)', body:'A neutral, open-access fibre network passing homes with FTTH and earning a wholesale charge on each home the retail ISPs <b>connect</b>. The penetration flywheel shared across partners, anchored by Telefônica and backed by a pension investor, financed at an emerging-market cost of capital. <b>This is FiBrasil</b> — Vivo + CDPQ.'},
    s4a:'FiBrasil\'s operating cost is largely <b>fixed per home passed</b> — maintaining the fibre plant, powering exchanges, leasing infrastructure and overheads — incurred whether or not a retail ISP connects a given home. At low penetration the fixed base swamps the thin wholesale revenue; as the partners fill the network the same costs spread over more connections and the margin re-rates. On a neutral model the take-up that drives that ramp is shared across all the retail providers.',
    wfNote:'Operating cost is dominated by fixed, per-home-passed items — fibre plant and exchange maintenance, power, infrastructure lease and overhead — plus a smaller cost per active connection. Against wholesale revenue that only arrives as ISPs connect homes, the fixed base is why penetration is the lever.',
    s4b:'The capital is the cost of <b>passing the homes</b> with fibre across Brazilian cities — heavy and upfront. The joint-venture structure brings <b>long-term pension capital</b> (CDPQ) alongside the operator, and an anchor commitment from Telefônica de-risks the early ramp. Little direct subsidy applies, so the net capital is close to the gross build, carried at an emerging-market cost of capital until penetration ramps.',
    stackH:'The capital · passing the homes, net of support', splitL:'Who funds the build', splitR:'EM',
    split:[['s1',10,'Subsidy / support'],['s2',90,'JV net capital']],
    finList:[['','Model','neutral wholesale fibre'],['sub','Owners','Telefônica + CDPQ'],['','Revenue','wholesale charge per connection'],['sub','Key lever','shared penetration ramp'],['','Anchor','Vivo commitment'],['rest','Discount','emerging-market cost of capital']],
    finNote:'A neutral EM fibre network is a <b>shared penetration ramp on a sunk build</b>: fixed cost per home passed, wholesale revenue split across retail partners, and a return weighed by an emerging-market discount rate. The risks are the pace of take-up, the country and currency rate, and competition from other neutral and retail builders.',
    timeline:[['2021','<b>FiBrasil established</b> as a Telefônica / CDPQ neutral-network JV.'],['2020s','<b>FTTH build</b> extends into Brazilian cities and towns.'],['2020s','<b>Open access</b> sold wholesale to retail ISPs.'],['2020s','<b>Penetration ramps</b> as partners connect homes.'],['2020s','<b>Anchor commitment</b> from Vivo underpins the early load.'],['Ongoing','<b>Take-up climbs</b> on strong Brazilian fibre demand.']],
    calcNote:'A working model of a <b>neutral wholesale fibre network</b> in an emerging market, on an enterprise-value basis. The build is the cost of passing the homes, lightly subsidised; revenue is a wholesale charge on connected homes, shared across retail partners. The cost of debt is high to reflect emerging-market rates, and the return turns on the penetration ramp. Figures are illustrative.',
    s6:'FiBrasil is the penetration flywheel on a neutral, emerging-market network. What drives it:',
    breakers:['<b>Penetration</b> — shared take-up across the retail partners is the core lever.','<b>Anchor tenant</b> — Telefônica\'s commitment underpins the early load on the network.','<b>Country &amp; currency</b> — an emerging-market discount rate weighs on a long ramp.','<b>Competition</b> — other neutral and retail builders contesting the same homes.'],
    src:'Figures from public sources on the Brazilian neutral-network market: <a href="https://www.telefonica.com/" target="_blank" rel="noopener">Telefônica</a> / <a href="https://www.cdpq.com/" target="_blank" rel="noopener">CDPQ</a> disclosure on FiBrasil and the broader FTTH sector. The figures are approximate and illustrative, and the flag is used for illustration only.',
    econ:{cur:'R$', model:'neutral wholesale fibre',
      hpDef:6,hpMin:1,hpMax:14,hpStep:0.5, arpuDef:55,arpuMin:25,arpuMax:110,arpuStep:1,
      penDef:38,penMin:8,penMax:85,penStep:1, opexPerHP:42, opexPerConn:110, fixedOM:170},
    calc:{build:10400,grant:300,capex:11,revG:5.5,floor:200,cap:6000,tax:34,exit:10,lev:4,rd:12,amort:4,hold:14},
    map:{footer:GEO.fibrasil.footer}
  },

  /* ---------- 4 · CHORUS (Oceania · regulated national wholesale fibre) ---------- */
  chorus:{
    name:'Chorus', geo:'New Zealand', continent:'Oceania', cur:'NZ$', geoKey:'chorus',
    lede:'New Zealand\'s <b>regulated national wholesale</b> fibre network — the bulk of the government\'s Ultra-Fast Broadband build. High penetration, a regulated revenue cap, and a utility-like return: the penetration flywheel at its mature, steady end.',
    s1:'<p class="body"><b>Chorus</b> is New Zealand\'s national fibre wholesaler — the company that built most of the government\'s <b>Ultra-Fast Broadband (UFB)</b> programme and now operates it under a regulated framework. It is wholesale-only: it passes homes with fibre and earns a regulated charge on each connected home from the retail ISPs, with its revenues governed by a regulated asset base and a <b>price-quality path</b>. The build is largely complete and penetration is high, so Chorus sits at the <b>mature, steady end</b> of the penetration flywheel.</p>'+
       '<p class="body">The economics are the same flywheel, now spun up and regulated. The cost of passing the homes was incurred over the UFB build (part-funded by the Crown); penetration across the fibre footprint is among the highest in the world, so the fixed cost base is well spread and the margin is healthy. Regulation caps the upside but also <b>floors the revenue</b>, making Chorus look like a utility: a regulated, inflation-linked annuity on a near-fully-penetrated national network. The investment case is steady regulated cash flows, not a take-up ramp.</p>',
    facts:[['National','Model','regulated wholesale'],['UFB','Build','government programme'],['High','Penetration','near mature'],['Regulated','Revenue','RAB + price path'],['Utility-like','Profile','floored + capped'],['Crown','Co-funded','public + private']],
    s2:'Picture a near-fully-connected national network. Light leaves the <b>exchange (OLT)</b> and runs along fibre that <b>passed every home</b> long ago — the fixed cost, now sunk. Most homes are <b>connected</b>, lit and glowing; the connected fraction — the <b>penetration</b> — is high and steady. The owner\'s <b style="color:#0c6b4f">money</b> is connected homes × a regulated wholesale charge. Drag the sliders to see how, at high penetration, even a regulated charge produces a healthy, utility-like margin.',
    driverLab:'ARPU', availLab:'Penetration', hrK:'Service revenue', yrS:'connected × regulated charge',
    ledge:{a:'+ wholesale',b:'+ regulated',c:'− network opex'}, demandLabel:'PENETRATION',
    preset:'Load Chorus',
    try:'<b>Try this:</b> Chorus sits at high <b>penetration</b>, so the fixed cost is already well spread and the margin is healthy — drop penetration to see how a half-empty network would have looked during the build. The regulated <b>revenue floor and cap</b> narrow the range: this is the flywheel at its mature, utility-like end, where the ramp is done and the annuity is steady.',
    s3:'Chorus earns a <b>regulated charge per connected home</b> from the retail ISPs, set by a regulated asset base and a price-quality path rather than by the market. Because penetration across its fibre footprint is high and the cost of passing the homes is sunk, that charge produces a healthy, well-spread margin. The return is not a take-up ramp but a <b>regulated, inflation-linked annuity</b> — the penetration flywheel after it has fully spun up, governed by a revenue floor and cap.',
    mb:{tag:'Model A · the penetration flywheel', title:'Regulated national wholesale fibre', body:'A national wholesale fibre network at high, mature <b>penetration</b>, earning a regulated charge on each connected home under a revenue cap and floor. The penetration flywheel fully spun up and regulated — a utility-like, inflation-linked annuity rather than a take-up ramp. <b>This is Chorus</b> — the backbone of New Zealand\'s UFB.'},
    s4a:'Chorus\'s operating cost is largely <b>fixed per home passed</b> — maintaining a national fibre network, powering exchanges, infrastructure and overhead — but at high penetration that fixed base is spread over a near-complete set of connections, so the margin is healthy and steady. Regulation sets the framework: a price-quality path that caps the charge but also protects the revenue. The flywheel here is at its mature end, where penetration is high and the cost base is well covered.',
    wfNote:'Operating cost is dominated by fixed, per-home-passed network items — maintenance, exchange power, infrastructure and overhead — spread, at high penetration, over a near-complete set of connections. Within a regulated revenue cap and floor, the result is a steady, utility-like margin.',
    s4b:'The capital — passing the homes across the UFB build — is largely <b>behind it</b>, and was part-funded by the <b>Crown</b> through the UFB programme, so the public share of the original build was meaningful. What remains is maintenance and the occasional extension. The regulated asset base earns a regulated return, and the net capital now in the ground supports a steady, inflation-linked annuity rather than a build-ahead bet.',
    stackH:'The capital · UFB build, net of Crown funding', splitL:'Who funded the build', splitR:'allocation',
    split:[['s1',28,'Crown / public funding'],['s2',72,'Chorus net capital']],
    finList:[['','Model','regulated national wholesale'],['sub','Programme','Ultra-Fast Broadband (UFB)'],['','Revenue','regulated charge per connection'],['sub','Framework','RAB + price-quality path'],['','Penetration','high, mature'],['rest','Profile','utility-like, inflation-linked']],
    finNote:'A regulated national fibre wholesaler is the <b>penetration flywheel at its mature end</b>: a sunk, part-publicly-funded build, high steady penetration, and a regulated, inflation-linked annuity. The risks are the regulated price reset, maintenance capex, and modest competition at the edges — but the cash flows are utility-steady.',
    timeline:[['2011','<b>Chorus demerged</b> from Telecom NZ to build the UFB network.'],['2010s','<b>UFB build</b> passes the great majority of New Zealand homes.'],['2020s','<b>High penetration</b> achieved across the fibre footprint.'],['2022','<b>New regulated framework</b> (RAB + price-quality path) begins.'],['2020s','<b>Utility-like cash flows</b> on a near-complete network.'],['Ongoing','<b>Regulated annuity</b> compounds with inflation indexation.']],
    calcNote:'A working model of a <b>regulated national wholesale fibre network</b>, on an enterprise-value basis. The build — passing the homes — is largely complete and was part-funded by the Crown; revenue is a regulated charge on a high, steady penetration, floored and capped by the price-quality path. A long hold and a low cost of capital reflect the utility-like profile.',
    s6:'Chorus is the penetration flywheel after it has spun up — regulated and steady. What drives it:',
    breakers:['<b>Penetration (mature)</b> — high and stable, so the fixed cost is already well spread.','<b>Regulated price path</b> — the cap and floor set the revenue band rather than the market.','<b>Maintenance capex</b> — keeping a national network in service is the main ongoing cost.','<b>Inflation indexation</b> — the regulated annuity re-rates with the price path over time.'],
    src:'Figures from public sources on New Zealand\'s fibre market: <a href="https://www.chorus.co.nz/" target="_blank" rel="noopener">Chorus</a> investor disclosure and the UFB regulated framework. The figures are approximate and illustrative.',
    econ:{cur:'NZ$', model:'regulated national wholesale',
      hpDef:1.5,hpMin:0.5,hpMax:2.2,hpStep:0.1, arpuDef:46,arpuMin:30,arpuMax:65,arpuStep:1,
      penDef:72,penMin:20,penMax:95,penStep:1, opexPerHP:36, opexPerConn:78, fixedOM:90},
    calc:{build:5900,grant:1400,capex:10,revG:3,floor:380,cap:1200,tax:28,exit:13,lev:6,rd:6,amort:3,hold:20},
    map:{footer:GEO.chorus.footer}
  },

  /* ---------- 5 · e& / ETISALAT (Middle East · incumbent FTTH, top penetration) ---------- */
  etisalat:{
    name:'e& (Etisalat)', geo:'United Arab Emirates', continent:'Middle East', cur:'AED', geoKey:'etisalat',
    lede:'The UAE incumbent — operator of one of the world\'s most complete <b>fibre-to-the-home</b> footprints, at <b>among the highest penetration anywhere</b>. The penetration flywheel at full speed, on a wealthy, dense, near-universal network.',
    s1:'<p class="body"><b>e&</b> (formerly Etisalat) is the UAE incumbent and operator of one of the most complete <b>FTTH</b> footprints on earth. The UAE was an early, aggressive fibre adopter: the network <b>passes</b> essentially all urban homes, and <b>penetration is among the highest anywhere</b> — most passed homes take fibre service. So the heavy fixed cost of passing the homes is spread over a near-complete set of high-ARPU connections, and the margin is strong.</p>'+
       '<p class="body">This is the <b>penetration flywheel</b> caught at full speed in a wealthy market. The cost of passing the homes was incurred years ago; what makes the network valuable is the combination of <b>very high penetration</b> and a <b>high ARPU</b> — premium broadband bundles in a high-income market. With take-up close to its ceiling, the fixed cost is fully covered and the network throws off strong, steady cash. The investment case is a mature, high-penetration, high-ARPU fibre annuity — the opposite end of the spectrum from a building altnet.</p>',
    facts:[['Incumbent','Model','national FTTH'],['Near-universal','Homes passed','urban UAE'],['Top-tier','Penetration','among world\'s highest'],['High','ARPU','premium bundles'],['Wealthy','Market','high-income'],['Mature','Stage','flywheel at full speed']],
    s2:'Picture a near-universal, high-income fibre network. Light leaves the <b>exchange (OLT)</b> and runs along fibre that <b>passes every home</b> — the fixed cost, long sunk. Almost every home is <b>connected</b>, lit and glowing; the connected fraction — the <b>penetration</b> — is near its ceiling. The owner\'s <b style="color:#0c6b4f">money</b> is connected homes × a high ARPU. At this penetration the fixed cost is fully spread, so even drag the sliders and the network stays strongly profitable.',
    driverLab:'ARPU', availLab:'Penetration', hrK:'Service revenue', yrS:'connected × ARPU',
    ledge:{a:'+ broadband',b:'+ bundles',c:'− network opex'}, demandLabel:'PENETRATION',
    preset:'Load e&',
    try:'<b>Try this:</b> e& sits near the top of the <b>penetration</b> range — drop it sharply and watch how much a half-penetrated network would have given up. Then restore it: at near-universal penetration and a high ARPU, the fixed cost of passing the homes is fully spread and the margin is strong. This is the flywheel at full speed in a wealthy market.',
    s3:'e& earns a <b>service charge per connected home</b> — premium broadband bundles at a high ARPU in a high-income market — across a near-universal footprint. Because penetration is among the highest anywhere and the cost of passing the homes is sunk, that high ARPU is applied to almost every passed home and the fixed base is fully covered. The return is a <b>mature, high-penetration, high-ARPU annuity</b> — the penetration flywheel at the top of its range.',
    mb:{tag:'Model A · the penetration flywheel', title:'Incumbent FTTH at top-tier penetration', body:'A national incumbent operating a near-universal FTTH footprint at among the world\'s highest <b>penetration</b>, applying a high ARPU to almost every passed home. The penetration flywheel at full speed in a wealthy market — the fixed cost fully spread, the margin strong. <b>This is e& (Etisalat)</b> — the UAE incumbent.'},
    s4a:'e&\'s operating cost is largely <b>fixed per home passed</b> — maintaining a national fibre network, exchange power, infrastructure and overhead — but at near-universal penetration that fixed base is spread over almost every home, so the margin is strong. With take-up close to its ceiling and a high ARPU, there is little ramp left to climb: the flywheel is at full speed, and the cost base is comfortably covered by a near-complete set of high-value connections.',
    wfNote:'Operating cost is dominated by fixed, per-home-passed network items — maintenance, exchange power, infrastructure and overhead — spread, at near-universal penetration, over almost every passed home. Against a high ARPU, the result is a strong, well-covered margin.',
    s4b:'The capital — passing the homes with fibre across the UAE — was incurred during an early, aggressive national roll-out and is largely <b>behind the network</b>. As an incumbent in a wealthy market, e& funded most of the build itself with limited subsidy. What remains is maintenance on a near-complete network whose net capital is comfortably covered by a high-penetration, high-ARPU annuity.',
    stackH:'The capital · national FTTH build, net of support', splitL:'Who funded the build', splitR:'allocation',
    split:[['s1',10,'Public / support'],['s2',90,'Incumbent net capital']],
    finList:[['','Model','incumbent national FTTH'],['sub','Footprint','near-universal urban UAE'],['','Revenue','high ARPU per connected home'],['sub','Key lever','penetration (near ceiling)'],['','Penetration','among world\'s highest'],['rest','Stage','mature, fully spun up']],
    finNote:'A top-penetration incumbent FTTH network is the <b>penetration flywheel at full speed</b>: a sunk build, near-universal take-up, and a high ARPU applied to almost every passed home. The return is strong and steady; the risks are ARPU competition and a market already near its penetration ceiling.',
    timeline:[['2000s','<b>Etisalat</b> begins an early, aggressive national FTTH roll-out.'],['2010s','<b>Near-universal</b> urban fibre coverage achieved.'],['2020s','<b>Among the world\'s highest</b> FTTH penetration.'],['2022','<b>Rebrands to e&</b> as a diversified technology group.'],['2020s','<b>High-ARPU bundles</b> on a near-complete network.'],['Ongoing','<b>Mature annuity</b> — the flywheel at full speed.']],
    calcNote:'A working model of an <b>incumbent FTTH network at top-tier penetration</b>, on an enterprise-value basis. The build — passing the homes — is largely complete with limited subsidy; revenue is a high ARPU on a near-universal penetration, so the fixed cost is fully spread. A low cost of capital and a long hold reflect the mature, wealthy-market profile.',
    s6:'e& is the penetration flywheel at full speed in a wealthy market. What drives it:',
    breakers:['<b>Penetration (near ceiling)</b> — among the highest anywhere, so the fixed cost is fully spread.','<b>High ARPU</b> — premium bundles in a high-income market lift every connected home.','<b>Mature footprint</b> — the build is behind it; the network is near-universal.','<b>ARPU competition</b> — the main risk in a market already near its penetration ceiling.'],
    src:'Figures from public sources on the UAE fibre market: <a href="https://www.eand.com/" target="_blank" rel="noopener">e& (Etisalat)</a> investor disclosure and global FTTH penetration rankings. The figures are approximate and illustrative.',
    econ:{cur:'AED', model:'incumbent national FTTH',
      hpDef:3,hpMin:0.8,hpMax:6,hpStep:0.1, arpuDef:130,arpuMin:70,arpuMax:220,arpuStep:5,
      penDef:88,penMin:30,penMax:98,penStep:1, opexPerHP:130, opexPerConn:260, fixedOM:300},
    calc:{build:30800,grant:600,capex:9,revG:2.5,floor:600,cap:12000,tax:9,exit:11,lev:4,rd:5,amort:4,hold:18},
    map:{footer:GEO.etisalat.footer}
  },

  /* ---------- 6 · CHINA TELECOM (China · vast-scale near-universal FTTH) ---------- */
  chinatel:{
    name:'China Telecom', geo:'China', continent:'China', cur:'¥', geoKey:'chinatel',
    lede:'One of the world\'s largest fibre operators, in the world\'s largest broadband market — <b>near-universal FTTH</b> at vast scale and high penetration. The penetration flywheel fully spun up across hundreds of millions of homes.',
    s1:'<p class="body"><b>China Telecom</b> operates one of the largest fibre access networks on earth, in the world\'s largest broadband market. China rolled out <b>FTTH</b> at a pace and scale no other country has matched: the network <b>passes</b> the vast majority of homes, and <b>penetration is high</b> — fibre is the standard broadband. So the immense fixed cost of passing hundreds of millions of homes is spread over an enormous base of connected homes, and the network is solidly profitable at scale.</p>'+
       '<p class="body">The per-home ARPU in China is <b>low</b> by Western standards — competition and policy keep retail prices keen — but it is applied to a <b>vast, high-penetration</b> base of connected homes, and financed at a low domestic cost of capital. The model is scale and penetration, not price: a modest ARPU on near-universal take-up across hundreds of millions of homes, compounded into a large, steady cash flow. China Telecom shows what the penetration flywheel looks like once it is fully spun up at national, near-universal scale.</p>',
    facts:[['Vast','Scale','hundreds of millions'],['China','Market','world\'s largest'],['High','Penetration','fibre is standard'],['Low','ARPU','but huge base'],['Low','Cost of capital','domestic'],['Mature','Stage','fully spun up']],
    s2:'Picture a vast urban district near-fully connected. Light leaves the <b>exchange (OLT)</b> and runs along fibre that <b>passed every home</b> — the fixed cost, sunk at national scale. Almost every home is <b>connected</b>, lit and glowing; the connected fraction — the <b>penetration</b> — is high. The owner\'s <b style="color:#0c6b4f">money</b> is connected homes × a modest ARPU, which at this scale and penetration becomes a large, steady profit because the fixed cost is spread so thin.',
    driverLab:'ARPU', availLab:'Penetration', hrK:'Service revenue', yrS:'connected × ARPU',
    ledge:{a:'+ broadband',b:'+ bundles',c:'− network opex'}, demandLabel:'PENETRATION',
    preset:'Load China Telecom',
    try:'<b>Try this:</b> the <b>ARPU</b> is low — but push the <b>penetration</b> up across a vast base of homes passed and watch the absolute profit balloon, because the fixed cost is spread over so many connections. Then drop penetration and even China\'s giant network thins. Scale and penetration, not price, are the Chinese model. The cost of capital is low because the financing is domestic.',
    s3:'China Telecom earns a <b>service charge per connected home</b> that is low by Western standards — Chinese competition and policy keep retail prices keen — but it is applied to a <b>vast, high-penetration</b> base of connected homes. Because the immense fixed cost of passing the homes is spread over so many connections, that modest ARPU compounds into a large, steady profit. The lever is the same penetration flywheel as everywhere, caught at full speed and national scale: low price, high take-up, low cost of capital.',
    mb:{tag:'Model A · the penetration flywheel', title:'Vast-scale near-universal FTTH', body:'A fibre operator at vast scale in the world\'s largest broadband market, where high <b>penetration</b> across hundreds of millions of passed homes spreads the immense fixed cost so thin that even a low ARPU becomes a large profit. The penetration flywheel fully spun up. <b>This is China Telecom</b> — scale and penetration, not price.'},
    s4a:'At China Telecom\'s scale the operating cost is immense in absolute terms — maintaining a national fibre network, powering exchanges, infrastructure and overhead across hundreds of millions of passed homes — but the <b>fixed cost per home passed is spread over very high penetration</b>, so the margin is solid. This is the flywheel at full speed and national scale: a modest ARPU, very high take-up, and a fixed base that becomes small relative to the enormous number of connected homes.',
    wfNote:'Operating cost is large in absolute terms but small relative to the enormous base of connected homes at high penetration — network maintenance, exchange power, infrastructure and overhead. With the fixed cost spread so thin, even a low ARPU leaves a healthy bottom line.',
    s4b:'The capital is on a national scale — passing hundreds of millions of homes with fibre across China — financed at a low <b>domestic cost of capital</b>, with state and policy support for the build-out. A modest <b>subsidy / policy support</b> offset part of the cost of passing the homes. Spread over very high penetration, that immense capital earns a solid, steady return at the scale only the Chinese market allows.',
    stackH:'The capital · national FTTH build, net of subsidy', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',22,'Subsidy / policy support'],['s2',78,'Operator net capital']],
    finList:[['','Model','national near-universal FTTH'],['sub','Market','China — largest broadband'],['','Revenue','low ARPU × vast connected base'],['sub','Key lever','high penetration at scale'],['','Cost of capital','low (domestic)'],['rest','Stage','mature, fully spun up']],
    finNote:'A vast-scale near-universal fibre network is the <b>penetration flywheel at full speed and national scale</b>: a modest ARPU on very high penetration across hundreds of millions of passed homes, financed at a low cost of capital. The return is solid and steady; the risks are competition and policy compressing the ARPU.',
    timeline:[['2000s','<b>China Telecom</b> begins a national fibre roll-out at scale.'],['2010s','<b>FTTH becomes standard</b> as China builds fibre faster than anyone.'],['2020s','<b>High penetration</b> across hundreds of millions of homes.'],['2020s','<b>Low ARPU, huge base</b> — scale, not price.'],['2020s','<b>Low domestic cost of capital</b> funds the network.'],['Ongoing','<b>Mature annuity</b> — the flywheel fully spun up.']],
    calcNote:'A working model of a <b>vast-scale near-universal FTTH network</b>, on an enterprise-value basis. The build — passing the homes — is at national scale, part-funded by policy support; revenue is a low ARPU on very high penetration, which is what makes it profitable at scale. A low domestic cost of capital lifts the value. Figures are highly illustrative given the scale.',
    s6:'China Telecom is the penetration flywheel at full speed and national scale. What drives it:',
    breakers:['<b>Penetration at scale</b> — very high take-up across hundreds of millions of homes spreads the fixed cost.','<b>Low ARPU, huge base</b> — keen pricing on a vast number of connected homes.','<b>Cost of capital</b> — a low domestic rate lifts the value of a steady return.','<b>Competition &amp; policy</b> — the principal risks to the per-home ARPU.'],
    src:'Figures from public sources and reporting on the Chinese broadband market: <a href="https://www.chinatelecom-h.com/" target="_blank" rel="noopener">China Telecom</a> disclosure and the broader FTTH sector. Given the scale and limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', model:'national near-universal FTTH',
      hpDef:200,hpMin:50,hpMax:400,hpStep:10, arpuDef:42,arpuMin:25,arpuMax:75,arpuStep:1,
      penDef:78,penMin:25,penMax:95,penStep:1, opexPerHP:34, opexPerConn:72, fixedOM:12000},
    calc:{build:620000,grant:90000,capex:9,revG:3.5,floor:20000,cap:600000,tax:25,exit:9,lev:4,rd:4,amort:4,hold:15},
    map:{footer:GEO.chinatel.footer}
  }
  };
  var ORDER=['cityfibre','frontier','fibrasil','chorus','etisalat','chinatel'];

  /* ===================================================================
     FIBRE ACCESS NETWORK RENDERER  (canvas, 720x520) — top-down, daytime
     A headend / exchange (OLT) on the left feeds a fibre spine down the streets
     to a grid of homes. The fibre PASSES every home; a share of homes equal to
     penetration is CONNECTED — a lit window, a short drop fibre and a glow. Light
     pulses flow from the headend along the fibre to the connected homes. Homes
     occasionally churn (connect / disconnect) for life.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var OLT={x:74,y:262};            // headend / exchange (OLT) feeding the network
  var SPINEX=150;                  // fibre spine into the streets
  // home layout (built once per asset from GEO)
  var HOMES=[], ROWY=[], COLX=[], NH=0, _roofCols=['#b08a6a','#a86a5b','#7a8a9a','#9a8470','#8a9078','#94706a','#6f7a86'];
  function layout(){
    var G=GEO[A.geoKey];
    // denser footprints (urban incumbents / national) pack more homes per street
    ROWY = G.dense ? [104,172,240,308,376] : [120,210,300,390];
    COLX = G.dense ? [250,308,366,424,482,540,598] : [262,338,414,490,566];
    HOMES=[]; var idx=0;
    for(var r=0;r<ROWY.length;r++) for(var c=0;c<COLX.length;c++){
      var x=COLX[c], y=ROWY[r];
      var d=Math.hypot(x-OLT.x,y-OLT.y);   // connect order = distance from the exchange
      HOMES.push({x:x,y:y,row:r,col:c,d:d,ph:(idx*0.7)%6.28, roof:_roofCols[idx%_roofCols.length],
        conn:false, swap:rnd(0,400)}); idx++;
    }
    NH=HOMES.length;
    HOMES.sort(function(a,b){ return a.d-b.d; });   // rank by distance from the exchange
    HOMES.forEach(function(p,i){ p.rank=i; });
  }

  /* ---- base map: streets ground + street grid + footways ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // residential block behind the homes
    ctx.fillStyle='rgba(120,140,150,0.12)';
    rr(206,72,494,H-150,16); ctx.fill();
    // block outline (dense footprints get a stronger frame)
    var dense=GEO[A.geoKey].dense;
    ctx.strokeStyle=dense?'rgba(70,120,110,0.5)':'rgba(110,130,130,0.4)'; ctx.lineWidth=dense?2.4:1.6;
    rr(214,80,478,H-166,14); ctx.stroke();
    // street markings down each home row
    ctx.lineCap='round';
    street(SPINEX,84,SPINEX,420);
    ROWY.forEach(function(y){ street(SPINEX,y,W-44,y); });
  }
  function street(x0,y0,x1,y1){
    ctx.strokeStyle='#c6cbc1'; ctx.lineWidth=9; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.setLineDash([6,8]); ctx.lineDashOffset=-(T*0.5);
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- headend / exchange (OLT) feeding the network ---- */
  function headend(){
    var x=44,y=66; ctx.strokeStyle='#8a918c'; ctx.lineWidth=1.4;        // small comms mast
    ctx.beginPath(); ctx.moveTo(x-8,y+28); ctx.lineTo(x,y); ctx.lineTo(x+8,y+28); ctx.moveTo(x-6,y+12); ctx.lineTo(x+6,y+12); ctx.stroke();
    ctx.strokeStyle='#7d847f'; ctx.beginPath(); ctx.moveTo(x,y+4); ctx.lineTo(OLT.x,OLT.y-24); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='600 7px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('BACKHAUL',x-10,y-4);
    // exchange building
    ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(OLT.x,OLT.y+26,24,4,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#cfd3ca'; rr(OLT.x-26,OLT.y-24,52,48,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    var tg=ctx.createLinearGradient(OLT.x-13,0,OLT.x+13,0); tg.addColorStop(0,'#7e857f'); tg.addColorStop(1,'#9aa19a');
    ctx.fillStyle=tg; rr(OLT.x-13,OLT.y-13,26,26,2); ctx.fill();
    // rack lines (the OLT line cards)
    ctx.strokeStyle='rgba(40,46,44,0.32)'; ctx.lineWidth=0.7; for(var f=1;f<5;f++){ ctx.beginPath(); ctx.moveTo(OLT.x-13,OLT.y-13+f*5.2); ctx.lineTo(OLT.x+13,OLT.y-13+f*5.2); ctx.stroke(); }
    // small fibre / light symbol on the exchange
    ctx.strokeStyle='rgba(60,150,170,0.8)'; ctx.lineWidth=1.4; ctx.beginPath();
    ctx.arc(OLT.x,OLT.y,5,-0.6,0.6); ctx.moveTo(OLT.x-2,OLT.y); ctx.lineTo(OLT.x+6,OLT.y); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('EXCHANGE · OLT',OLT.x,OLT.y+40);
  }

  /* ---- fibre spine + feeders down the streets (PASSES every home) ---- */
  function fibre(){
    ctx.strokeStyle='rgba(70,150,170,0.5)'; ctx.lineWidth=2.4; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(OLT.x,OLT.y-24); ctx.lineTo(OLT.x,254); ctx.lineTo(SPINEX,254); ctx.stroke();   // exchange → spine
    ctx.beginPath(); ctx.moveTo(SPINEX,ROWY[0]); ctx.lineTo(SPINEX,ROWY[ROWY.length-1]); ctx.stroke();          // spine
    ROWY.forEach(function(y){ ctx.beginPath(); ctx.moveTo(SPINEX,y); ctx.lineTo(COLX[COLX.length-1],y); ctx.stroke(); });
    ctx.setLineDash([]);
  }
  function flowPulses(pts,speed,load){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*4));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,'rgba(90,200,220,0.6)'); ctx.fillStyle='rgba(150,235,245,0.95)'; ctx.beginPath(); ctx.arc(p[0],p[1],1.5,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- a home: roof + footprint; if CONNECTED, a drop fibre, a lit window and a glow ---- */
  function home(p,conn){
    // shade pad under the home
    ctx.fillStyle='rgba(30,40,30,0.07)'; rr(p.x-12,p.y-11,24,24,4); ctx.fill();
    // house body
    var hg=ctx.createLinearGradient(p.x,p.y-9,p.x,p.y+8); hg.addColorStop(0,p.roof); hg.addColorStop(1,shade(p.roof));
    ctx.fillStyle=hg; rr(p.x-9,p.y-8,18,17,2.5); ctx.fill();
    // roof ridge line
    ctx.strokeStyle='rgba(30,40,35,0.25)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(p.x,p.y-8); ctx.lineTo(p.x,p.y+9); ctx.stroke();
    // window — dim if not connected, lit if connected
    if(conn){
      // drop fibre from the street feeder to the home
      ctx.strokeStyle='rgba(70,170,190,0.7)'; ctx.lineWidth=1.3; ctx.beginPath();
      ctx.moveTo(p.x,p.y-12); ctx.quadraticCurveTo(p.x-3,p.y-13,p.x-5,p.y-8); ctx.stroke();
      // lit window
      var pul=0.55+0.45*Math.sin(T*0.16+p.ph);
      ctx.fillStyle='rgba(255,'+Math.round(220+20*pul)+','+Math.round(150+40*pul)+',0.92)'; rr(p.x-5,p.y-4,10,7,1.5); ctx.fill();
      // connection glow (warm amber)
      var gr=8*(0.85+0.25*pul);
      glow(p.x,p.y-1, gr, 'rgba(255,190,90,'+(0.30+0.30*pul)+')');
    } else {
      // dark window — passed but not connected
      ctx.fillStyle='rgba(70,82,80,0.5)'; rr(p.x-5,p.y-4,10,7,1.5); ctx.fill();
    }
  }
  function shade(hex){ // darken a hex colour for the house body gradient
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
    var bx=px+13, bw=pw-26, rows=[['Service revenue','+'+money(rev),'#0c6b4f',1],['Operating cost','−'+money(opex),'#bc4733',Math.max(0.02,oR)],['EBITDA',money(eb)+'  ·  '+Math.round(m*100)+'%','#0a5a42',Math.max(0.02,m)]];
    var ry=py+42;
    rows.forEach(function(r){ ctx.fillStyle='rgba(60,72,66,0.95)'; ctx.font='600 9px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(r[0],bx,ry+7);
      ctx.fillStyle=r[2]; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(r[1],px+pw-13,ry+7);
      ctx.fillStyle='rgba(20,30,25,0.07)'; rr(bx,ry+11,bw,3,1.5); ctx.fill(); ctx.fillStyle=r[2]; rr(bx,ry+11,bw*Math.min(1,r[3]),3,1.5); ctx.fill();
      ry+=20; });
    ctx.restore();
  }
  /* ---- live penetration sparkline ---- */
  function drawDemand(occ){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'PENETRATION';
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
    var hp=parseFloat(sCap.value)*1e6;          // homes passed
    var arpu=parseFloat(sSpread.value);         // per home per MONTH
    var pen=parseFloat(sAvail.value)/100;

    ctx.clearRect(0,0,W,H);
    drawMap(); headend(); fibre();

    // a share of homes equal to penetration is connected & lit
    var connCount=Math.round(NH*pen);
    // life: occasionally churn which homes are connected
    if(_anim){ HOMES.forEach(function(p){ p.swap-=1; if(p.swap<0){ p.swap=rnd(120,420); p.roof=_roofCols[(Math.random()*_roofCols.length)|0]; } }); }
    HOMES.forEach(function(p){ var conn=p.rank<connCount; p.conn=conn; home(p,conn); });

    // light flowing from the exchange along the fibre to the connected homes (scales with penetration)
    var loadVis=0.3+0.6*pen;
    flowPulses([[OLT.x,OLT.y-24],[OLT.x,254],[SPINEX,254]],0.9+loadVis,loadVis);
    flowPulses([[SPINEX,ROWY[0]],[SPINEX,ROWY[ROWY.length-1]]],0.7+loadVis,loadVis);
    ROWY.forEach(function(y){ flowPulses([[SPINEX,y],[COLX[COLX.length-1],y]],0.8+loadVis,loadVis*0.85); });

    // "+ CONNECTING" take-up frontier marker on the next home to connect
    if(G.growing && connCount<NH){
      var nxt=HOMES[Math.min(NH-1,connCount)];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ CONNECTING',nxt.x,nxt.y-16); ctx.restore();
        glow(nxt.x,nxt.y-2,8,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    }

    // ---- economics (penetration-driven flywheel) ----
    var connected=hp*pen;
    var revenue=connected*arpu*12;              // annual
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));
    var opex= hp*(E.opexPerHP||0) + connected*(E.opexPerConn||0) + (E.fixedOM||0)*1e6;  // per-home-passed + per-connection + fixed O&M
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var c_net=opex*0.40, c_pwr=opex*0.22, c_lease=opex*0.22, c_admin=opex*0.16;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is wholesale / anchor-linked vs core broadband
    var ancShare=Math.max(0.08,Math.min(0.30, grant/Math.max(1,buildTot)*0.4));

    // money-flow: +cash rises from connected homes; −cash (opex) drains
    if(_anim){
      var live=HOMES.slice(0,Math.max(1,connCount));
      if(live.length && Math.random()<0.6){ var s1=live[(Math.random()*live.length)|0]; spawnCoin(s1.x,s1.y-6, Math.random()<ancShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.7, opex/Math.max(1,Math.abs(revenue)+opex)));
      var anyHome=HOMES[(Math.random()*NH)|0];
      if(Math.random()<outRate && anyHome){ spawnCoin(anyHome.x,anyHome.y+4,'cost',1); }
      demHist.push(Math.max(0,Math.min(1,pen))); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,pen)));

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(hp)+' homes passed',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',kfmt(hp)+' passed'); set('ixSpreadV',CUR+Math.round(arpu)+'/mo'); set('ixAvailV',Math.round(pen*100)+'%');
    set('ixDir',kfmt(hp)); set('ixDirS','homes passed · '+E.model);
    set('ixMW',kfmt(connected)+' connected'); set('ixMWs',Math.round(pen*100)+'% penetration · '+CUR+Math.round(arpu)+'/mo ARPU');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% margin');

    drawWaterfall(revenue, [['Network maint.',c_net],['Exchange power',c_pwr],['Duct &amp; pole lease',c_lease],['Admin',c_admin]], ebitda);
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
    s+=lbl(bx(0)+bw/2, y(rev), 'Service revenue', money(rev), '#15201d');
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting penetration is too low to value — the fixed cost of passing the homes swamps the connected revenue. Raise the penetration, the ARPU or the homes passed.</span>'; return; }
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
    var ph=document.getElementById('ptHead'); if(ph) ph.innerHTML='<tr><th>Year</th><th>Service rev</th><th>EBITDA</th><th>Capex</th><th>Unlev. FCF</th><th>Net debt</th><th>Equity FCF</th></tr>';
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
    sCap.min=E.hpMin; sCap.max=E.hpMax; sCap.step=E.hpStep; sCap.value=E.hpDef;
    sSpread.min=E.arpuMin; sSpread.max=E.arpuMax; sSpread.step=E.arpuStep; sSpread.value=E.arpuDef;
    sAvail.min=E.penMin; sAvail.max=E.penMax; sAvail.step=E.penStep; sAvail.value=E.penDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is modelled as connected homes × ARPU and the returns model is a simplified DCF in which a public or rural subsidy offsets part of the cost of passing the homes; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.hpDef; sSpread.value=E.arpuDef; sAvail.value=E.penDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'cityfibre');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
