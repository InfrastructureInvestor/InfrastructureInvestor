/* Heat networks — data-driven worked examples.
   Six real district thermal-energy businesses (heating and cooling), one
   template. Scene config from hn-geo.js (GEO), drawn as a top-down district
   network in 720x520 scene coords: a central energy centre feeds a flow main to
   connected buildings and a return main back. NOT a RAB network: this is an
   ESCO / concession model — revenue is thermal energy sold (load × hours × load
   factor) × tariff, against the cost of the heat/cooling source (a 'heat
   spread'), and the returns model is a simplified DCF. */
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
  function gw(mw){ return mw>=1000?(mw/1000).toFixed(mw>=10000?0:1)+' GW':Math.round(mw)+' MW'; }
  function gwh(mwh){ return mwh>=1e6?(mwh/1e6).toFixed(1)+' TWh':(mwh>=1e3?Math.round(mwh/1e3)+' GWh':Math.round(mwh)+' MWh'); }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · COPENHAGEN (Europe · municipal district heating) ---------- */
  copen:{
    name:'Copenhagen district heating', geo:'Copenhagen, Denmark', continent:'Europe', cur:'€', geoKey:'copen',
    lede:'The world\'s benchmark <b>district heating</b> system — a near-universal municipal network that heats almost every building in the city with waste heat and combined heat and power, at low cost and low carbon.',
    s1:'<p class="body"><b>District heating</b> replaces thousands of individual boilers with one network: a central energy centre produces hot water, which is pumped through insulated <b>flow and return</b> mains to heat exchangers in every connected building. <b>Copenhagen</b> has done this at city scale — its network (run by HOFOR/CTR and partners) heats the overwhelming majority of buildings, fed by <b>combined heat and power, waste-to-energy and waste heat</b>.</p>'+
       '<p class="body">The economics are an <b>energy-services</b> business, not a RAB: the network sells <b>heat per MWh</b> (plus standing charges) and its margin is the <b>spread</b> between the heat tariff and the cost of the heat source. Because Copenhagen\'s heat comes largely from waste heat and CHP that would otherwise be lost, the source cost is very low — which is why the city\'s heat is cheap, low-carbon and a textbook municipal asset.</p>',
    facts:[['~98%','City coverage','near-universal'],['CHP + waste','Source','low-cost heat'],['Per-MWh','Revenue','+ standing charge'],['Heat spread','Margin','tariff − source cost'],['Municipal','Owner','HOFOR / CTR'],['Low-carbon','Driver','waste heat + W2E']],
    s2:'Watch the loop. The <b>energy centre</b> pushes hot water out through the flow main (orange) to every connected building, and cooler water returns (blue). The buildings glow with the <b>load factor</b> — how much heat is actually being drawn, which peaks in winter. The owner\'s <b style="color:#0c6b4f">margin</b> is the spread between the heat tariff and the cheap waste-heat source. Drag the connected load, the tariff and the load factor.',
    driverLab:'Heat tariff', availLab:'Load factor', hrK:'Heat revenue', yrS:'heat sold × tariff',
    ledge:{a:'+ heat sold',b:'+ standing chg',c:'− fuel & opex'}, demandLabel:'HEAT LOAD',
    preset:'Load Copenhagen',
    try:'<b>Try this:</b> the magic is the <b>source cost</b>. Because the heat is waste heat and CHP, the cost per MWh is very low, so the <b>spread</b> — and the margin — is wide even at a modest tariff. Drop the load factor to see the seasonality (heat demand collapses in summer); the standing charge and a long, near-universal customer base are what make the cash flow stable.',
    s3:'Copenhagen sells <b>heat per MWh</b> plus a standing charge, and earns the <b>spread</b> over its source cost. With waste heat, waste-to-energy and CHP as the source, that cost is very low, so even a regulated, affordable tariff leaves a healthy margin. Demand is seasonal (a low annual load factor), but near-universal coverage and standing charges make the revenue stable. It is a municipal energy-services business: low-carbon, low-cost, and central to the city\'s climate plan.',
    mb:{tag:'Model B · municipal ESCO', title:'Municipal district-heating network', body:'A city-owned network that sells heat per MWh (plus standing charges) and earns the spread over a very low-cost source — waste heat, waste-to-energy and CHP. Near-universal, low-carbon and affordable, run for the city as much as for profit. <b>This is Copenhagen</b> — the benchmark.'},
    s4a:'The dominant cost is the <b>heat source</b> — but Copenhagen\'s is waste heat and CHP, so it is cheap, leaving a wide spread; pumping, network O&amp;M and a customer overhead are modest. The result is a stable margin on a near-universal base, with the investment story being decarbonising the last of the source and expanding the network.',
    wfNote:'Operating cost is the heat source (here cheap waste heat / CHP), plus pumping power, network O&amp;M and customer service. The margin is the heat spread — tariff minus source cost — over a near-universal, seasonally-varying load.',
    s4b:'The capital is the energy centre(s) and the insulated flow-and-return network across the whole city — long-life civil assets. Much was built over decades by the municipality; the forward capital is decarbonising the source (more waste heat, large heat pumps) and extending and densifying the network, each addition earning the heat spread.',
    stackH:'The capital · network + energy centres', splitL:'Financing', splitR:'municipal',
    split:[['s1',65,'Municipal / utility debt'],['s2',35,'Municipal equity']],
    finList:[['','Coverage','~98% of the city'],['sub','Source','CHP + waste-to-energy + waste heat'],['','Revenue','heat per MWh + standing charge'],['sub','Margin','heat spread'],['','Owner','HOFOR / CTR (municipal)'],['rest','Driver','decarbonisation + density']],
    finNote:'A municipal district-heating network is a <b>low-cost, low-carbon energy-services asset</b>: a stable spread over a cheap source on a near-universal base. The returns are steady and municipal; the agenda is decarbonising the source and the city\'s climate targets, not maximising profit.',
    timeline:[['1920s','<b>District heating</b> begins in Copenhagen using power-station waste heat.'],['1980s','<b>CTR/HOFOR networks</b> integrate the metro-area system.'],['2000s','<b>Waste-to-energy</b> becomes a core heat source.'],['2010s','<b>Coal phase-out</b> — biomass and waste heat replace coal CHP.'],['2025','<b>Large heat pumps</b> add low-carbon source capacity.'],['Ongoing','<b>Carbon-neutral heat</b> target drives source decarbonisation.']],
    calcNote:'A working model of a <b>municipal district-heating ESCO</b>. Revenue is heat sold (load × hours × load factor) × tariff; the margin is the spread over a very low-cost source. A low annual load factor reflects seasonality; standing charges and near-universal coverage stabilise it.',
    s6:'Copenhagen is the district-heating benchmark — cheap, low-carbon, near-universal. What drives it:',
    breakers:['<b>The heat spread</b> — tariff minus source cost; a cheap waste-heat source is the whole advantage.','<b>Source decarbonisation</b> — replacing the last fossil CHP with heat pumps and waste heat.','<b>Network density &amp; coverage</b> — more connections per km of main lift utilisation and returns.','<b>Affordability &amp; policy</b> — a municipal, regulated tariff balances returns against public goals.'],
    src:'Figures from public sources on Copenhagen district heating (<a href="https://www.hofor.dk/" target="_blank" rel="noopener">HOFOR</a> / CTR) and Danish district-heating data. The figures are approximate and illustrative.',
    econ:{cur:'€', service:'heat', source:'waste · CHP',
      loadDef:2200,loadMin:800,loadMax:3500,loadStep:50, tariffDef:58,tariffMin:35,tariffMax:110,tariffStep:1,
      lfDef:30,lfMin:12,lfMax:55,lfStep:1, srcCost:22, fixedOM:70},
    calc:{build:3200,grant:1000,capex:12,revG:2,floor:80,cap:600,tax:22,exit:13,lev:6,rd:4.5,amort:2,hold:25},
    map:{footer:GEO.copen.footer}
  },

  /* ---------- 2 · VICINITY ENERGY (North America · district steam) ---------- */
  vicinity:{
    name:'Vicinity Energy', geo:'US cities (e.g. Boston)', continent:'North America', cur:'US$', geoKey:'vicinity',
    lede:'A US <b>district energy</b> operator that pipes steam and hot water to downtown buildings — an old, dense network now being electrified to sell <b>green heat</b>.',
    s1:'<p class="body"><b>Vicinity Energy</b> owns district <b>steam and hot-water</b> systems in major US cities, including the historic Boston/Cambridge network. Downtown buildings — hospitals, universities, offices, labs — take heat from the network instead of running their own boilers, drawing it from a central plant through underground mains.</p>'+
       '<p class="body">The model is an energy-services concession: it sells heat per unit (plus demand charges) and earns the <b>spread</b> over its fuel cost. The investment story is <b>decarbonisation</b> — Vicinity (owned by infrastructure investor Antin) is electrifying its plants with industrial-scale heat pumps to sell <b>carbon-free "eSteam"</b>, turning a legacy fossil asset into a green-heat platform. The customer base is sticky: switching off district steam is expensive and disruptive.</p>',
    facts:[['Steam + HW','Network','dense downtown'],['Hospitals + labs','Anchors','sticky demand'],['Per-unit','Revenue','+ demand charge'],['Electrifying','Driver','carbon-free "eSteam"'],['Antin','Owner','infrastructure fund'],['Heat spread','Margin','tariff − fuel']],
    s2:'Watch the loop. The <b>plant</b> sends steam and hot water out through the flow main (orange) to dense downtown buildings, and condensate returns. The anchors — hospitals, universities, labs — draw heat year-round, so the load factor is steadier than a residential heating system. The <b style="color:#0c6b4f">margin</b> is the spread over fuel. Drag the connected load, the tariff and the load factor.',
    driverLab:'Heat tariff', availLab:'Load factor', hrK:'Heat revenue', yrS:'heat sold × tariff',
    ledge:{a:'+ heat sold',b:'+ demand chg',c:'− fuel & opex'}, demandLabel:'HEAT LOAD',
    preset:'Load Vicinity',
    try:'<b>Try this:</b> the customers are <b>sticky</b> — a hospital or lab on district steam is expensive to disconnect, so the base is durable and the load factor steady. Push the tariff to see the spread; the decarbonisation story is converting cheap-but-dirty fossil steam into premium <b>carbon-free heat</b> that institutions will pay up for. Fuel cost (and electrification) is the swing factor.',
    s3:'Vicinity sells <b>heat per unit</b> (plus capacity/demand charges) and earns the <b>spread</b> over its fuel cost. Its anchors — hospitals, universities and labs — give a sticky, year-round load. The decarbonisation play is electrifying the plants with heat pumps to sell carbon-free heat at a premium, which both protects the franchise and can lift the tariff. The risk and the lever are the <b>fuel/power cost</b> and the capital cost of electrifying.',
    mb:{tag:'Model B · district-energy ESCO', title:'District steam / hot-water concession', body:'A privately-owned downtown network that sells steam and hot water per unit (plus demand charges) and earns the spread over fuel, to sticky institutional anchors — now electrifying to sell carbon-free heat at a premium. <b>This is Vicinity Energy</b> — owned by Antin.'},
    s4a:'The dominant cost is <b>fuel</b> (gas today, electricity as it electrifies); pumping, plant O&amp;M and customer service are smaller. The spread over fuel sets the margin, and electrification reshapes both the cost base and the product — carbon-free heat that institutions will pay a premium for.',
    wfNote:'Operating cost is fuel (and increasingly power for heat pumps), plus plant and network O&amp;M. The margin is the heat spread over a sticky, year-round institutional load; electrification is the structural swing factor.',
    s4b:'The capital is the central plants and the underground steam/hot-water network — long-life, hard-to-replicate downtown infrastructure — plus the forward capital of <b>electrifying</b> the plants with industrial heat pumps. Each green upgrade protects the franchise and can command a premium tariff.',
    stackH:'The capital · plant + network', splitL:'Financing', splitR:'infra-backed',
    split:[['s1',60,'Infrastructure debt'],['s2',40,'Antin equity']],
    finList:[['','Network','district steam + hot water'],['sub','Anchors','hospitals · universities · labs'],['','Revenue','per-unit + demand charge'],['sub','Driver','electrification ("eSteam")'],['','Margin','heat spread over fuel'],['rest','Owner','Antin (infrastructure)']],
    finNote:'A US district-energy network is a <b>sticky, decarbonising ESCO</b>: a durable institutional base, a spread over fuel, and an electrification upgrade that turns a legacy asset into premium green heat. The risks are fuel/power cost and the capital of electrifying.',
    timeline:[['1880s','<b>District steam</b> begins heating US downtowns.'],['1900s','<b>Boston/Cambridge network</b> built out over the century.'],['2020','<b>Antin acquires</b> the business — renamed Vicinity Energy.'],['2023','<b>eSteam</b> — industrial heat pumps for carbon-free steam.'],['2020s','<b>Electrification</b> programme across plants.'],['Ongoing','<b>Green-heat premium</b> to institutional customers.']],
    calcNote:'A working model of a <b>district-energy ESCO</b>. Revenue is heat sold × tariff plus demand charges; the margin is the spread over fuel. A steadier load factor reflects institutional anchors; electrification reshapes the cost base and can lift the tariff.',
    s6:'Vicinity is sticky district heat, going green. What drives it:',
    breakers:['<b>The heat spread</b> — tariff minus fuel/power; electrification reshapes both.','<b>Sticky anchors</b> — hospitals and labs make the base durable and the load steady.','<b>Decarbonisation premium</b> — carbon-free heat protects the franchise and can lift price.','<b>Fuel &amp; power cost</b> — the principal swing factor on the margin.'],
    src:'Figures from public sources on <a href="https://www.vicinityenergy.us/" target="_blank" rel="noopener">Vicinity Energy</a> and its electrification programme. As a private business, the figures are approximate and illustrative.',
    econ:{cur:'US$', service:'heat', source:'CHP → heat pumps',
      loadDef:1500,loadMin:600,loadMax:2600,loadStep:50, tariffDef:80,tariffMin:45,tariffMax:140,tariffStep:1,
      lfDef:34,lfMin:18,lfMax:60,lfStep:1, srcCost:36, fixedOM:65},
    calc:{build:1800,grant:300,capex:14,revG:4,floor:60,cap:600,tax:25,exit:14,lev:5,rd:5,amort:2,hold:25},
    map:{footer:GEO.vicinity.footer}
  },

  /* ---------- 3 · VEOLIA (South America · district cooling / energy) ---------- */
  veolia:{
    name:'Veolia district energy', geo:'Latin America', continent:'South America', cur:'US$', geoKey:'veolia',
    lede:'District energy is <b>nascent in Latin America</b> — but in hot cities, <b>district cooling</b> concessions are emerging, selling chilled water to clusters of buildings in place of thousands of individual chillers.',
    s1:'<p class="body">In hot, humid cities, the thermal-network opportunity is <b>cooling</b>: a central plant chills water and pumps it to commercial clusters — malls, offices, hotels — which use it for air-conditioning instead of running their own chillers. It is the cooling analogue of district heating, and it is far more efficient at scale.</p>'+
       '<p class="body">Latin America is an <b>early-stage</b> market, but operators such as <b>Veolia</b> develop and own district-cooling and district-energy concessions in the region. The model is the same energy-services one: sell <b>cooling per MWh</b> (plus capacity charges) and earn the <b>spread</b> over the electricity cost of running the chillers. The cash flow is contracted and indexed, but priced and discounted at <b>emerging-market</b> rates.</p>',
    facts:[['District cooling','Product','chilled water'],['Nascent','Market','early-stage LatAm'],['Per-MWh','Revenue','+ capacity charge'],['Electricity','Source cost','chiller power'],['Concession','Structure','long contracts'],['Operator','Owner','e.g. Veolia']],
    s2:'Watch the loop. The <b>cooling plant</b> sends chilled water out (cyan) to a cluster of commercial buildings, and warmer water returns. The buildings draw cooling with the load factor — high and steady in a hot climate. The <b style="color:#0c6b4f">margin</b> is the spread between the cooling tariff and the electricity cost of the chillers. Drag the connected load, the tariff and the load factor — a contracted concession at an EM discount rate.',
    driverLab:'Cooling tariff', availLab:'Load factor', hrK:'Cooling revenue', yrS:'cooling sold × tariff',
    ledge:{a:'+ cooling sold',b:'+ capacity chg',c:'− power & opex'}, demandLabel:'COOLING LOAD',
    preset:'Load Veolia',
    try:'<b>Try this:</b> in a hot climate the <b>load factor</b> stays high and steady all year, which is what makes district cooling bankable. Push the tariff to see the spread over chiller power. But the whole return is at an <b>EM discount rate</b>: raise the cost of debt and watch a solid contracted return net down once discounted like a Latin American asset.',
    s3:'A Latin American district-cooling concession sells <b>cooling per MWh</b> (plus capacity charges to anchor buildings) and earns the <b>spread</b> over the electricity that runs the chillers. Long building contracts make the cash flow contracted and indexed; a hot climate keeps the load factor high. The investor question is less the asset than the <b>discount rate</b> — local rates and currency — and the pace at which the nascent market develops.',
    mb:{tag:'Model B · cooling concession', title:'District-cooling concession (EM)', body:'A central plant sells chilled water per MWh (plus capacity charges) to a cluster of buildings under long contracts, earning the spread over chiller electricity, in an early-stage but growing market — priced at emerging-market rates. <b>This is district cooling in Latin America</b> (e.g. Veolia).'},
    s4a:'The dominant cost is the <b>electricity</b> that runs the chillers; plant and network O&amp;M are smaller. The spread over power sets the margin, and efficiency (chiller COP, thermal storage) is the operational lever. A steady, hot-climate load and capacity charges keep the cash flow stable.',
    wfNote:'Operating cost is chiller electricity, plus plant and network O&amp;M. The margin is the cooling spread over power, over a high, steady, hot-climate load; capacity charges underpin the revenue.',
    s4b:'The capital is the cooling plant (chillers, often with thermal storage) and the chilled-water network to the building cluster. Modelled on an enterprise-value basis, the return is a <b>contracted, indexed</b> one in a developing market — carried against local rates and currency.',
    stackH:'The capital · plant + network', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local / project debt'],['s2',45,'Operator equity']],
    finList:[['','Product','district cooling (chilled water)'],['sub','Market','nascent LatAm'],['','Revenue','per-MWh + capacity charge'],['sub','Source cost','chiller electricity'],['','Structure','long concessions'],['rest','Owner','operator (e.g. Veolia)']],
    finNote:'A Latin American district-cooling concession is a <b>contracted ESCO at an EM discount rate</b>: a steady spread over power on a hot-climate load, in a developing market. The whole investment debate is the <b>discount rate</b> and the pace of market growth.',
    timeline:[['2010s','<b>District cooling</b> appears in hot LatAm cities.'],['2010s','<b>Veolia &amp; peers</b> develop concessions in the region.'],['2020s','<b>Commercial clusters</b> anchor early schemes.'],['2020s','<b>Efficiency &amp; storage</b> improve the economics.'],['Periodic','<b>Indexed contracts</b> reset the tariff.'],['Long-term','<b>Market growth</b> as cities densify.']],
    calcNote:'A working model of an <b>EM district-cooling concession</b>, on an enterprise-value basis. Revenue is cooling sold × tariff plus capacity charges; the margin is the spread over chiller power. The cost of debt is high to reflect EM rates, netting a solid contracted return down once discounted.',
    s6:'District cooling in LatAm is a contracted ESCO at an EM rate. What drives it:',
    breakers:['<b>The cooling spread</b> — tariff minus chiller power; efficiency and storage are the levers.','<b>Country &amp; currency</b> — local rates and the currency set the discount rate.','<b>Anchor contracts</b> — long building contracts and capacity charges underpin the cash flow.','<b>Market development</b> — a nascent market means growth upside and execution risk.'],
    src:'Figures are illustrative for an emerging-market district-cooling concession (operators such as <a href="https://www.veolia.com/" target="_blank" rel="noopener">Veolia</a>). District energy is nascent in Latin America; all figures here are approximate and illustrative.',
    econ:{cur:'US$', service:'cooling', source:'chiller power',
      loadDef:500,loadMin:150,loadMax:1100,loadStep:25, tariffDef:72,tariffMin:40,tariffMax:130,tariffStep:1,
      lfDef:48,lfMin:25,lfMax:75,lfStep:1, srcCost:38, fixedOM:24},
    calc:{build:700,grant:150,capex:14,revG:6,floor:30,cap:300,tax:30,exit:11,lev:4,rd:9,amort:2,hold:20},
    map:{footer:GEO.veolia.footer}
  },

  /* ---------- 4 · SYDNEY PRECINCT (Oceania · precinct cooling / trigen) ---------- */
  sydney:{
    name:'Sydney precinct thermal', geo:'Sydney, Australia', continent:'Oceania', cur:'A$', geoKey:'sydney',
    lede:'A <b>precinct thermal network</b> — a private central plant that heats, cools and powers a master-planned precinct, selling thermal energy to every building under long contracts.',
    s1:'<p class="body">In Australian master-planned precincts — Sydney\'s Central Park, Barangaroo and others — a developer can build a central <b>thermal plant</b> (trigeneration, district cooling, or both) that serves the whole precinct: chilled water for air-conditioning, hot water, and sometimes power, piped to every building instead of each running its own plant.</p>'+
       '<p class="body">A private operator owns the plant and network and sells <b>thermal energy per MWh</b> (plus capacity charges) to the buildings under <b>long contracts</b> embedded in the precinct. The economics are an energy-services concession: the margin is the <b>spread</b> over the electricity (and gas) that runs the plant, and the cash flow is a contracted, indexed annuity over the life of the precinct.</p>',
    facts:[['Precinct','Plant','trigeneration / cooling'],['Per-MWh','Revenue','+ capacity charge'],['Long contracts','Structure','embedded in precinct'],['Electricity','Source cost','+ gas (trigen)'],['Private','Owner','infrastructure-backed'],['Heat spread','Margin','tariff − energy cost']],
    s2:'Watch the loop. The precinct <b>plant</b> sends chilled (and hot) water out (cyan) to the towers and buildings, and warmer water returns. Buildings draw thermal energy with the load factor. The <b style="color:#0c6b4f">margin</b> is the spread over the energy that runs the plant, on long contracts. Drag the connected load, the tariff and the load factor — a private, contracted precinct annuity.',
    driverLab:'Thermal tariff', availLab:'Load factor', hrK:'Thermal revenue', yrS:'thermal sold × tariff',
    ledge:{a:'+ thermal sold',b:'+ capacity chg',c:'− energy'}, demandLabel:'THERMAL LOAD',
    preset:'Load Sydney precinct',
    try:'<b>Try this:</b> the buildings are on <b>long contracts</b> embedded in the precinct, so the load and the cash flow are durable. Push the tariff to see the spread over plant energy; trigeneration can improve the spread by making power and heat together. The model lives on the energy cost and the length and stickiness of the building contracts.',
    s3:'A Sydney precinct thermal network sells <b>thermal energy per MWh</b> (plus capacity charges) to the precinct\'s buildings under long contracts, and earns the <b>spread</b> over the electricity and gas that run the plant. Trigeneration (making power, heating and cooling together) can widen the spread. The cash flow is a contracted, indexed annuity over the precinct; the levers are energy cost, plant efficiency and the building contracts.',
    mb:{tag:'Model B · precinct ESCO', title:'Private precinct thermal network', body:'A private central plant heats, cools and sometimes powers a master-planned precinct, selling thermal energy per MWh (plus capacity charges) to every building under long embedded contracts, earning the spread over energy. <b>This is a Sydney precinct thermal network</b>.'},
    s4a:'The dominant cost is the <b>energy</b> (electricity and gas) that runs the plant; plant and network O&amp;M are smaller. The spread over energy sets the margin, trigeneration and efficiency improve it, and long building contracts keep the cash flow durable.',
    wfNote:'Operating cost is plant energy (electricity and gas), plus plant and network O&amp;M. The margin is the thermal spread over energy, over a contracted precinct load; efficiency and trigeneration are the levers.',
    s4b:'The capital is the central plant (chillers, engines, thermal storage) and the precinct network — much funded at development, so it sits behind long building contracts. The return is a private, contracted, indexed annuity over the life of the precinct, compounding as new precincts are added.',
    stackH:'The capital · plant + precinct network', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',55,'Developer / precinct funding'],['s2',45,'Operator equity']],
    finList:[['','Plant','trigeneration / district cooling'],['sub','Revenue','per-MWh + capacity charge'],['','Contracts','long, embedded in precinct'],['sub','Source cost','electricity + gas'],['','Growth','new precincts'],['rest','Owner','infrastructure-backed']],
    finNote:'A precinct thermal network is a <b>private, contracted ESCO annuity</b>: a spread over energy on long building contracts, with growth from new precincts. The risks are energy cost, plant efficiency and the length and renewal of the contracts.',
    timeline:[['2012','<b>Central Park, Sydney</b> — landmark precinct trigeneration / thermal.'],['2010s','<b>Barangaroo &amp; others</b> add precinct district cooling.'],['2010s','<b>Embedded thermal contracts</b> standardise the model.'],['2020s','<b>Electrification</b> shifts trigen toward low-carbon cooling.'],['Ongoing','<b>New precincts</b> add contracted load.'],['Long-term','<b>Contract renewals</b> extend the annuity.']],
    calcNote:'A working model of a <b>precinct thermal ESCO</b>. Revenue is thermal energy sold × tariff plus capacity charges; the margin is the spread over plant energy. Long contracts and a high, steady load factor reflect an embedded precinct annuity.',
    s6:'A Sydney precinct thermal network is a contracted private ESCO. What drives it:',
    breakers:['<b>The thermal spread</b> — tariff minus plant energy; trigeneration and efficiency widen it.','<b>Contract length &amp; renewal</b> — long embedded building contracts are the durability.','<b>Energy cost</b> — electricity and gas are the principal swing factor.','<b>New precincts</b> — the pipeline of developments drives growth.'],
    src:'Figures are illustrative for an Australian precinct thermal network (e.g. Central Park / Barangaroo-type schemes). As private assets, the figures here are approximate and illustrative.',
    econ:{cur:'A$', service:'cooling', source:'electricity + gas',
      loadDef:350,loadMin:100,loadMax:800,loadStep:25, tariffDef:88,tariffMin:50,tariffMax:150,tariffStep:1,
      lfDef:46,lfMin:25,lfMax:75,lfStep:1, srcCost:42, fixedOM:18},
    calc:{build:640,grant:40,capex:14,revG:4,floor:24,cap:240,tax:30,exit:13,lev:5,rd:6,amort:2,hold:18},
    map:{footer:GEO.sydney.footer}
  },

  /* ---------- 5 · TABREED (Middle East · district cooling) ---------- */
  tabreed:{
    name:'Tabreed', geo:'United Arab Emirates', continent:'Middle East', cur:'AED', geoKey:'tabreed',
    lede:'The Gulf\'s district-cooling champion — a listed network that cools entire districts of a scorching region, earning most of its revenue from <b>take-or-pay capacity charges</b>.',
    s1:'<p class="body">In the Gulf, cooling is not a comfort but a necessity, and <b>district cooling</b> is the efficient way to deliver it: a central plant chills water and pipes it to whole districts — malls, towers, airports, masterplans — which use it for air-conditioning. It uses far less power than thousands of individual chillers, and the buildings avoid the capital and space of their own plant.</p>'+
       '<p class="body"><b>Tabreed</b> (National Central Cooling Company) is the regional leader — listed, with Mubadala and Engie as major shareholders. Its revenue model is the key feature: a large share is a <b>fixed, take-or-pay capacity charge</b> (the building pays for the cooling capacity reserved for it, used or not), with a smaller consumption charge on top. That makes the cash flow remarkably stable and bond-like — the volume barely matters.</p>',
    facts:[['District cooling','Product','chilled water'],['Take-or-pay','Revenue','capacity charge'],['Listed','Owner','Mubadala / Engie'],['GCC','Footprint','UAE + region'],['Capacity-led','Cash flow','volume-insensitive'],['Heat spread','Margin','tariff − power']],
    s2:'Watch the loop. The <b>cooling plant</b> sends chilled water out (cyan) to whole districts, and warmer water returns. Crucially, much of the revenue is a <b>fixed capacity charge</b> — so even as the load factor moves, the cash flow holds (watch the floor hold the ledger up). The <b style="color:#0c6b4f">margin</b> is the spread over chiller power. Drag the connected load, the tariff and the load factor — and notice how the take-or-pay floor stabilises it.',
    driverLab:'Cooling tariff', availLab:'Load factor', hrK:'Cooling revenue', yrS:'capacity + consumption',
    ledge:{a:'+ consumption',b:'+ capacity (ToP)',c:'− power & opex'}, demandLabel:'COOLING LOAD',
    preset:'Load Tabreed',
    try:'<b>Try this:</b> drop the <b>load factor</b> right down — and watch the revenue barely move, because the <b>take-or-pay capacity charge</b> (the floor) holds it up. That volume-insensitivity is what makes Tabreed\'s cash flow bond-like and so prized by infrastructure investors. The spread over chiller power and the growth of new districts are the upside.',
    s3:'Tabreed sells <b>cooling</b> under contracts that are mostly a <b>fixed capacity charge</b> (take-or-pay) plus a consumption charge. The capacity charge means the building pays for the cooling reserved for it regardless of use, so the cash flow is stable and volume-insensitive — bond-like. The <b>margin</b> is the spread over the electricity that runs the chillers. Growth comes from connecting new districts and masterplans across the Gulf.',
    mb:{tag:'Model B · take-or-pay cooling', title:'District-cooling utility (capacity-led)', body:'A listed district-cooling network whose revenue is mostly a fixed take-or-pay capacity charge plus a consumption charge, earning the spread over chiller power — a stable, volume-insensitive, bond-like cash flow. <b>This is Tabreed</b> — Mubadala / Engie-backed.'},
    s4a:'The dominant cost is the <b>electricity</b> running the chillers; plant and network O&amp;M are smaller. Because so much revenue is a fixed capacity charge, the margin is stable through the cooling season, and efficiency (chiller COP, thermal storage) is the operational lever on the consumption spread.',
    wfNote:'Operating cost is chiller electricity, plus plant and network O&amp;M. The margin is the spread over power — but the take-or-pay capacity charge means revenue, and so cash flow, holds even when the load factor falls.',
    s4b:'The capital is the cooling plants (large chiller arrays, often with thermal storage) and the chilled-water network across many districts. It is financed on a strong, listed balance sheet; growth is connecting new districts and masterplans, each adding take-or-pay capacity to a stable, bond-like cash flow.',
    stackH:'The capital · plants + network', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',55,'Investment-grade debt'],['s2',45,'Equity (Mubadala / Engie + free float)']],
    finList:[['','Product','district cooling'],['sub','Revenue','take-or-pay capacity + consumption'],['','Cash flow','volume-insensitive (bond-like)'],['sub','Owner','Mubadala / Engie + listed'],['','Footprint','UAE + GCC'],['rest','Growth','new districts & masterplans']],
    finNote:'Tabreed is a <b>capacity-led, bond-like infrastructure cash flow</b>: a take-or-pay revenue base, a spread over power, and growth from new districts. The risks are power cost, the pace of new connections, and the cost of capital — but the volume-insensitivity is rare and prized.',
    timeline:[['1998','<b>Tabreed founded</b> in the UAE.'],['2000s','<b>District-cooling roll-out</b> across the Gulf.'],['2008','<b>Mubadala</b> becomes a cornerstone shareholder.'],['2020','<b>Engie</b> takes a major stake (with Mubadala).'],['2020s','<b>Regional expansion</b> — new districts and masterplans.'],['Ongoing','<b>Efficiency &amp; storage</b> improve the consumption spread.']],
    calcNote:'A working model of a <b>take-or-pay district-cooling utility</b>. Revenue is consumption × tariff, but a high revenue floor models the fixed capacity charge — so the cash flow holds even at low load factor. The margin is the spread over chiller power.',
    s6:'Tabreed is take-or-pay cooling — bond-like and growing. What drives it:',
    breakers:['<b>Take-or-pay capacity</b> — the fixed charge makes the cash flow volume-insensitive.','<b>The cooling spread</b> — tariff minus chiller power; efficiency and storage are the levers.','<b>New districts</b> — connecting masterplans adds capacity-charge revenue.','<b>Power cost &amp; cost of capital</b> — the principal risks to the spread and the value.'],
    src:'Figures from public sources: <a href="https://www.tabreed.ae/" target="_blank" rel="noopener">Tabreed</a> (National Central Cooling Company) investor disclosure. Figures are approximate and illustrative.',
    econ:{cur:'AED', service:'cooling', source:'chiller power',
      loadDef:1300,loadMin:500,loadMax:2400,loadStep:50, tariffDef:55,tariffMin:30,tariffMax:100,tariffStep:1,
      lfDef:50,lfMin:25,lfMax:80,lfStep:1, srcCost:22, fixedOM:55},
    calc:{build:2600,grant:500,capex:12,revG:4,floor:330,cap:700,tax:0,exit:12,lev:6,rd:5,amort:2,hold:25},
    map:{footer:GEO.tabreed.footer}
  },

  /* ---------- 6 · MUNICIPAL DISTRICT HEATING (China · northern cities) ---------- */
  chinadh:{
    name:'Municipal district heating', geo:'Northern China', continent:'China', cur:'¥', geoKey:'chinadh',
    lede:'District heating at <b>continental scale</b> — northern China heats whole cities from central CHP and waste heat, a vast municipal thermal network being switched from coal to cleaner sources.',
    s1:'<p class="body">North of the Qin–Huai line, Chinese cities are heated by <b>district heating</b> as a matter of policy: central plants and combined heat and power feed hot water and steam through city-wide networks to hundreds of millions of people over a long, cold winter. The scale is enormous and the networks are municipal or state-linked.</p>'+
       '<p class="body">The model is an energy-services one — sell <b>heat per unit of floor area or MWh</b> (tariffs are regulated and often subsidised for affordability) and earn the <b>spread</b> over the source cost. The defining story is <b>decarbonisation at scale</b>: switching the source from coal to gas CHP, industrial <b>waste heat</b> and increasingly large heat pumps. A modest regulated spread, applied to a colossal heated area, is a vast and stable cash flow.</p>',
    facts:[['City-scale','Network','whole northern cities'],['CHP + waste','Source','coal → gas → waste heat'],['Per-area / MWh','Revenue','regulated tariff'],['Vast','Scale','hundreds of millions'],['Municipal','Owner','/ state-linked'],['Decarbonising','Driver','coal-to-clean']],
    s2:'Watch the loop. The <b>energy centre</b> pushes hot water out (orange) across a city-scale network, and cooler water returns. Buildings glow with the winter load factor. At this scale even a modest regulated <b style="color:#0c6b4f">spread</b> over a cheap source is a vast cash flow. Drag the connected load, the tariff and the load factor — scale and decarbonisation, not price, are the model.',
    driverLab:'Heat tariff', availLab:'Load factor', hrK:'Heat revenue', yrS:'heat sold × tariff',
    ledge:{a:'+ heat sold',b:'+ subsidy / std',c:'− fuel & opex'}, demandLabel:'HEAT LOAD',
    preset:'Load China DH',
    try:'<b>Try this:</b> push the <b>connected load</b> — at city scale, even a thin regulated spread is an enormous absolute cash flow. The decarbonisation story is switching the source from coal to gas CHP and waste heat, which changes the cost base. Tariffs are regulated and affordability-driven, so scale and source cost, not price, are the levers.',
    s3:'A northern-China district-heating network sells <b>heat</b> at a regulated (often subsidised) tariff and earns the <b>spread</b> over its source cost. The lever is <b>scale and source</b>: a colossal heated area means a modest spread is a vast cash flow, and switching the source from coal to gas CHP and waste heat reshapes the cost base and the carbon footprint. It is a municipal energy-services business at continental scale.',
    mb:{tag:'Model B · municipal scale', title:'City-scale district heating', body:'A municipal / state-linked network heating whole cities from central CHP and waste heat, selling regulated heat and earning a modest spread over a cheap source — at colossal scale. Decarbonising from coal. <b>This is northern-China district heating</b>.'},
    s4a:'The dominant cost is the <b>heat source</b> — historically coal, now shifting to gas CHP and waste heat — plus pumping and network O&amp;M across a vast system. The spread is modest and regulated, but applied to an enormous heated area it is a large, stable margin; decarbonising the source is the structural change.',
    wfNote:'Operating cost is the heat source (coal → gas → waste heat), plus pumping and network O&amp;M at city scale. The margin is a modest regulated spread, but the absolute cash flow is vast given the heated area.',
    s4b:'The capital is the central plants and the city-wide flow-and-return networks — vast, long-life municipal infrastructure — plus the forward capital of <b>switching the source</b> from coal to gas CHP, waste heat and heat pumps. Financed at a low municipal / state-linked cost of capital, it compounds with urban growth.',
    stackH:'The capital · city networks + plants', splitL:'Financing', splitR:'municipal',
    split:[['s1',60,'Municipal / state-linked debt'],['s2',40,'Municipal equity']],
    finList:[['','Network','whole northern cities'],['sub','Source','coal → gas CHP → waste heat'],['','Revenue','regulated heat tariff'],['sub','Scale','hundreds of millions served'],['','Cost of capital','low (municipal / state)'],['rest','Driver','decarbonisation + urban growth']],
    finNote:'A Chinese city-scale district-heating network is a <b>modest-spread, vast-scale municipal ESCO</b>: a regulated spread over a cheap (and decarbonising) source, financed at a low cost of capital. The return is steady and large in absolute terms; affordability and the coal-to-clean switch are the agenda.',
    timeline:[['1950s','<b>District heating</b> established as policy in northern China.'],['2000s','<b>CHP build-out</b> heats fast-growing cities.'],['2010s','<b>Coal-to-gas</b> switch begins for air quality.'],['2020s','<b>Industrial waste heat</b> and heat pumps add clean source.'],['2060','<b>Carbon-neutrality</b> target drives source decarbonisation.'],['Ongoing','<b>Urban growth</b> expands the heated area.']],
    calcNote:'A working model of a <b>city-scale district-heating ESCO</b>, on an enterprise-value basis. Revenue is heat sold × a regulated tariff; the margin is a modest spread over a cheap source. At this scale the absolute cash flow is vast; the cost of capital is low. Figures are highly illustrative.',
    s6:'China DH is modest-spread heating at vast scale, going clean. What drives it:',
    breakers:['<b>Scale</b> — a modest spread on a colossal heated area is the model.','<b>Source cost &amp; decarbonisation</b> — coal-to-gas-to-waste-heat reshapes the cost base.','<b>Regulated tariff</b> — affordability-driven pricing caps the spread.','<b>Cost of capital</b> — low municipal / state funding supports the scale.'],
    src:'Figures are illustrative for a northern-China municipal district-heating network. Given the scale and limited standalone disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', service:'heat', source:'CHP · coal→gas',
      loadDef:6000,loadMin:2500,loadMax:12000,loadStep:100, tariffDef:48,tariffMin:28,tariffMax:90,tariffStep:1,
      lfDef:28,lfMin:12,lfMax:50,lfStep:1, srcCost:18, fixedOM:180},
    calc:{build:6000,grant:1500,capex:12,revG:5,floor:300,cap:1200,tax:25,exit:10,lev:5,rd:4,amort:2,hold:25},
    map:{footer:GEO.chinadh.footer}
  }
  };
  var ORDER=['copen','vicinity','veolia','sydney','tabreed','chinadh'];

  /* ===================================================================
     DISTRICT THERMAL RENDERER  (canvas, 720x520) — top-down, daytime
     A central energy centre feeds a flow main to connected buildings and a
     return main back; buildings glow with the load factor (heat/cooling drawn).
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var CENTRE={x:96,y:254};         // energy centre (heat / cooling source)
  var TRUNKX=190;                  // flow main spine
  var PLOTS=[], ROWY=[], COLX=[], NPLOT=0;
  function layout(){
    var G=GEO[A.geoKey], dense=!!G.dense;
    ROWY=[110,182,254,326,398];
    COLX = dense ? [256,316,376,436,496,556,616] : [270,346,422,498,574];
    PLOTS=[]; var idx=0;
    var resShare=G.mix[0], comShare=G.mix[1];
    for(var r=0;r<ROWY.length;r++) for(var c=0;c<COLX.length;c++){
      var x=COLX[c], y=ROWY[r];
      var isAnchor=(r===ROWY.length-1 && c===COLX.length-1);
      var h=((c*7+r*13)%100)/100;
      var type = isAnchor?'anchor' : (h<resShare?'home' : (h<resShare+comShare?'com':'ind'));
      var d=Math.hypot(x-CENTRE.x,y-CENTRE.y);
      PLOTS.push({x:x,y:y,type:type,row:r,col:c,d:d,ph:(idx*0.7)%6.28}); idx++;
    }
    NPLOT=PLOTS.length;
    PLOTS.sort(function(a,b){ return a.d-b.d; });
    PLOTS.forEach(function(p,i){ p.rank=i; });
  }
  function thermalCols(){ // [flow, flowGlow, return] by service
    return (GEO[A.geoKey].service==='cooling')
      ? ['rgba(90,180,235,0.95)','rgba(90,180,235,0.6)','rgba(210,120,90,0.7)']
      : ['rgba(240,150,70,0.95)','rgba(255,150,70,0.6)','rgba(110,150,210,0.7)']; }
  function buildingGlow(){ return GEO[A.geoKey].service==='cooling'?'rgba(90,180,235,':'rgba(255,160,70,'; }

  /* ---- base map: ground + streets ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(150,180,140,0.10)';
    [[224,80,460,150],[224,300,460,150]].forEach(function(b){ rr(b[0],b[1],b[2],b[3],10); ctx.fill(); });
    ctx.lineCap='round';
    road(TRUNKX,84,TRUNKX,420);
    ROWY.forEach(function(y){ road(TRUNKX,y,W-44,y); });
  }
  function road(x0,y0,x1,y1){
    ctx.strokeStyle='#c6cbc1'; ctx.lineWidth=10; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.setLineDash([6,8]); ctx.lineDashOffset=-(T*0.5);
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- energy centre (the heat / cooling source) ---- */
  function energyCentre(lf){
    var x=CENTRE.x,y=CENTRE.y, cool=(GEO[A.geoKey].service==='cooling');
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x,y+30,34,5,0,0,Math.PI*2); ctx.fill();
    // plant building
    ctx.fillStyle='#cbd0c7'; rr(x-34,y-30,62,60,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    var g=ctx.createLinearGradient(x-30,y-26,x-30,y+26); g.addColorStop(0,'#aeb4ac'); g.addColorStop(1,'#959b93');
    ctx.fillStyle=g; rr(x-30,y-26,40,52,3); ctx.fill();
    // stack(s)
    ctx.fillStyle='#8a908a'; rr(x+4,y-40,8,22,1); ctx.fill(); rr(x+15,y-34,7,16,1); ctx.fill();
    // source-coloured warm/cool core glow
    var core = cool ? 'rgba(90,180,235,0.7)' : 'rgba(255,150,70,0.75)';
    glow(x-10,y, 16+6*lf, core, 0.5+0.4*lf);
    if(!cool){ // rising heat shimmer from the stack
      for(var i=0;i<3;i++){ var t=((T*0.04+i/3)%1); ctx.globalAlpha=(1-t)*0.4; ctx.fillStyle='rgba(200,200,200,0.6)';
        ctx.beginPath(); ctx.arc(x+8,y-40-t*16,2+t*2,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; } }
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('ENERGY CENTRE',x-3,y+42);
    ctx.fillStyle='rgba(70,90,80,0.6)'; ctx.font='600 6.5px Inter,sans-serif'; ctx.fillText((A.econ.source||'').toUpperCase(),x-3,y+51);
  }

  /* ---- flow + return mains ---- */
  function mains(){
    var C=thermalCols();
    ctx.setLineDash([5,4]);
    // flow (warm/cool) — centre → trunk → street mains
    ctx.strokeStyle = (GEO[A.geoKey].service==='cooling')?'rgba(90,160,215,0.55)':'rgba(225,140,70,0.5)'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.moveTo(CENTRE.x+28,CENTRE.y-4); ctx.lineTo(TRUNKX,CENTRE.y-4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(TRUNKX,ROWY[0]); ctx.lineTo(TRUNKX,ROWY[ROWY.length-1]); ctx.stroke();
    ROWY.forEach(function(y){ ctx.beginPath(); ctx.moveTo(TRUNKX,y); ctx.lineTo(COLX[COLX.length-1],y); ctx.stroke(); });
    // return (opposite temperature), offset slightly
    ctx.strokeStyle = (GEO[A.geoKey].service==='cooling')?'rgba(200,120,90,0.4)':'rgba(110,150,210,0.4)'; ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.moveTo(CENTRE.x+28,CENTRE.y+4); ctx.lineTo(TRUNKX+8,CENTRE.y+4); ctx.lineTo(TRUNKX+8,ROWY[ROWY.length-1]); ctx.stroke();
    ctx.setLineDash([]);
  }
  function flowPulses(pts,speed,load,col,gcol,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.6,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- buildings (glow warm/cool with load factor when connected) ---- */
  function bld(x,y,w,h,connected,lf,warm){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-w/2,y+h/2-2,w,6,2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-h/2,x,y+h/2); g.addColorStop(0,'#aeb6bd'); g.addColorStop(1,'#8f99a1');
    ctx.fillStyle=g; rr(x-w/2,y-h/2,w,h,2); ctx.fill();
    for(var wy=y-h/2+4;wy<y+h/2-2;wy+=5) for(var wx=x-w/2+3;wx<x+w/2-2;wx+=5){
      ctx.fillStyle = connected ? warm+(0.3+0.6*lf)+')' : 'rgba(120,140,150,0.4)'; ctx.fillRect(wx,wy,2.6,2.6); }
    if(connected && lf>0.05) glow(x,y,w*0.6+8*lf, warm+(0.10+0.22*lf)+')');
  }
  function house(x,y,connected,lf,warm){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-7,y-5,15,12,1); ctx.fill();
    ctx.fillStyle='#d5d0c2'; rr(x-7,y-7,14,13,1.5); ctx.fill();
    ctx.fillStyle=connected? (warm+(0.4+0.5*lf)+')'):'#9aa097'; rr(x-7,y-7,14,5,1.5); ctx.fill();
    ctx.fillStyle = connected ? warm+(0.4+0.5*lf)+')' : 'rgba(90,100,90,0.35)'; ctx.fillRect(x-2,y,3,4);
    if(connected && lf>0.05) glow(x,y-1,9+6*lf, warm+(0.10+0.20*lf)+')');
  }
  var ANCHOR={school:'SCHOOL',mall:'RETAIL',tower:'TOWER',plant:'PLANT',depot:'DEPOT',hospital:'HOSPITAL'};
  function anchorBld(x,y,connected,lf,label,warm){
    ctx.fillStyle='rgba(30,40,30,0.12)'; rr(x-16,y+10,38,6,2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-18,x,y+12); g.addColorStop(0,'#aeb4b8'); g.addColorStop(1,'#8c9296');
    ctx.fillStyle=g; rr(x-16,y-18,36,30,2); ctx.fill();
    for(var wy=y-13;wy<y+8;wy+=6) for(var wx=x-12;wx<x+16;wx+=7){ ctx.fillStyle=connected?warm+(0.35+0.55*lf)+')':'rgba(120,140,150,0.4)'; ctx.fillRect(wx,wy,3.2,3.2); }
    if(connected && lf>0.05) glow(x+2,y-2,22+8*lf, warm+(0.10+0.20*lf)+')');
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ heat',b:'+ standing',c:'− fuel'};
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
  /* ---- live load-factor sparkline ---- */
  function drawDemand(load){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'LOAD';
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(label,px+11,py+14);
    ctx.fillStyle='rgba(47,125,84,0.95)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(Math.round(load*100)+'%',px+pw-11,py+14);
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
    var G=GEO[A.geoKey], E=A.econ, C=thermalCols(), warm=buildingGlow();
    var load=parseFloat(sCap.value), tariff=parseFloat(sSpread.value), lf=parseFloat(sAvail.value)/100;
    // seasonal-ish wobble around the load factor for the sparkline + glow
    var lfVis=Math.max(0.02,Math.min(1, lf*(0.9+0.18*Math.sin(T*0.02))));
    // connected fraction grows with the connected load
    var norm=(load-E.loadMin)/Math.max(1,(E.loadMax-E.loadMin));
    var connFrac=Math.max(0.25,Math.min(1,0.32+0.7*norm));
    var liveCount=Math.round(NPLOT*connFrac);

    ctx.clearRect(0,0,W,H);
    drawMap(); energyCentre(lfVis); mains();

    PLOTS.forEach(function(p){
      var on = p.rank < liveCount;
      if(p.type==='home') house(p.x,p.y,on,lfVis,warm);
      else if(p.type==='com') bld(p.x,p.y,20,18,on,lfVis,warm);
      else if(p.type==='ind') bld(p.x,p.y,24,16,on,lfVis,warm);
      else anchorBld(p.x,p.y,on,lfVis,ANCHOR[G.anchor]||'ANCHOR',warm);
    });

    // flow out (warm/cool) and return back, intensity with the load factor
    var loadVis=0.25+0.7*lfVis;
    flowPulses([[CENTRE.x+28,CENTRE.y-4],[TRUNKX,CENTRE.y-4]],0.9+loadVis,loadVis,C[0],C[1],false);
    flowPulses([[TRUNKX,ROWY[0]],[TRUNKX,ROWY[ROWY.length-1]]],0.7+loadVis,loadVis,C[0],C[1],false);
    ROWY.forEach(function(y){ flowPulses([[TRUNKX,y],[COLX[COLX.length-1],y]],0.8+loadVis,loadVis*0.85,C[0],C[1],false); });
    flowPulses([[TRUNKX+8,ROWY[ROWY.length-1]],[TRUNKX+8,CENTRE.y+4],[CENTRE.x+28,CENTRE.y+4]],0.6+loadVis,loadVis*0.7,C[2],C[2],false);

    if(G.growing && liveCount<NPLOT){
      var nxt=PLOTS[Math.min(NPLOT-1,liveCount)];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ CONNECTING',nxt.x,nxt.y-14); ctx.restore();
        glow(nxt.x,nxt.y-2,8,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    }

    // ---- economics (heat-spread / ESCO) ----
    var heatSold=load*8760*lf;                 // MWh/yr
    var grossRev=heatSold*tariff;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var fuelCost=heatSold*E.srcCost, fixedOM=(E.fixedOM||0)*1e6, opex=fuelCost+fixedOM;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is fixed (standing / take-or-pay) vs energy
    var fixShare=Math.max(0.08,Math.min(0.6, revenue>grossRev?(revenue-grossRev)/revenue+0.12:0.14));
    var c_fuel=opex>0?fuelCost:0, c_om=fixedOM*0.55, c_pump=fixedOM*0.25, c_admin=fixedOM*0.20;

    if(_anim){
      var litPlots=PLOTS.slice(0,Math.max(1,liveCount));
      if(litPlots.length && Math.random()<0.62){ var s1=litPlots[(Math.random()*litPlots.length)|0]; spawnCoin(s1.x,s1.y-6, Math.random()<fixShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.65, opex/Math.max(1,revenue)));
      if(litPlots.length && Math.random()<outRate){ var s2=litPlots[(Math.random()*litPlots.length)|0]; spawnCoin(s2.x,s2.y+4,'cost',1); }
      demHist.push(lfVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(lfVis);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+gw(load)+' connected',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',gw(load)); set('ixSpreadV',CUR+Math.round(tariff)+'/MWh'); set('ixAvailV',Math.round(lf*100)+'%');
    set('ixDir',gw(load)); set('ixDirS',(G.service==='cooling'?'cooling':'heat')+' · '+(E.source||''));
    set('ixMW',gwh(heatSold)); set('ixMWs',Math.round(lf*100)+'% load factor / yr');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    var srcLabel=(G.service==='cooling'?'Chiller power':'Heat source');
    drawWaterfall(revenue, [[srcLabel,c_fuel],['Network O&amp;M',c_om],['Pumping &amp; power',c_pump],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the heat spread is too thin to value — raise the tariff or the load factor, or lower the source cost.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build</span> <b>'+money(capexGrossG)+'</b></span>'+
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
    sCap.min=E.loadMin; sCap.max=E.loadMax; sCap.step=E.loadStep; sCap.value=E.loadDef;
    sSpread.min=E.tariffMin; sSpread.max=E.tariffMax; sSpread.step=E.tariffStep; sSpread.value=E.tariffDef;
    sAvail.min=E.lfMin; sAvail.max=E.lfMax; sAvail.step=E.lfStep; sAvail.value=E.lfDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is thermal energy sold (load × hours × load factor) × tariff (with a floor for any take-or-pay / standing charge) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.loadDef; sSpread.value=E.tariffDef; sAvail.value=E.lfDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'copen');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
