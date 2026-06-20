/* Roads, data-driven worked examples.
   Six real road concessions, one template. Scene config from rd-geo.js (GEO),
   drawn as a top-down premium motorway in 720x520 scene coords: a divided dual
   carriageway with a central median, an interchange / slip road, traffic flowing
   along each carriageway, and a toll gantry (or, for availability PPPs, an
   availability-payment badge). The interactive figures are illustrative: a road
   concession earns EITHER toll revenue (traffic × toll per vehicle, demand risk)
   OR a fixed availability payment (PPP, no demand risk). Roads are high-margin,
   low operating cost against the toll line, and the returns model is a simplified
   DCF in which a public grant offsets part of the build cost. */
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

  /* ---------- 1 · AUTOSTRADE PER L'ITALIA (Europe · regulated toll network) ---------- */
  autostrade:{
    name:'Autostrade per l\'Italia', geo:'Italy', continent:'Europe', cur:'€', geoKey:'autostrade',
    lede:'The backbone of Italy\'s motorway system, a vast <b>regulated toll-road network</b> of more than 3,000&nbsp;km, earning a toll on every vehicle-kilometre under a tariff formula set by the regulator. The classic mature, demand-risk toll concession.',
    s1:'<p class="body">A toll road is one of the oldest infrastructure businesses there is: build and maintain a motorway, and charge the vehicles that use it. <b>Autostrade per l\'Italia (ASPI)</b> operates the largest network in Italy, the A1 spine from Milan to Naples, the A14 down the Adriatic and dozens more, under a long <b>concession</b> from the Italian state. It carries millions of vehicles a day and is the textbook example of a <b>demand-risk</b> toll network.</p>'+
       '<p class="body">The economics are simple to state and hard to beat: revenue is <b>traffic × toll</b>, the toll is set by a <b>regulated tariff formula</b> (linked to inflation, an investment plan and quality), and the operating cost of running an existing motorway is low against that revenue, so the EBITDA margin is very high. The capital is the build and the heavy <b>periodic resurfacing</b> of the carriageway; once built, a motorway is an inflation-linked annuity that runs for the life of the concession. The risk is traffic (recessions, fuel prices) and the regulator\'s tariff decisions.</p>',
    facts:[['3,000+ km','Network','A1 · A14 · core motorways'],['Demand risk','Model','traffic × regulated toll'],['ART','Regulator','five-year tariff formula'],['~70%+','EBITDA margin','low opex vs toll'],['Concession','Tenure','long-dated, state-granted'],['Mundys/infra','Owner','infrastructure-fund backed']],
    s2:'Watch the motorway run. Cars and heavy trucks flow along both carriageways, and every vehicle that passes under the <b>toll gantry</b> drops a <b style="color:#0c6b4f">toll</b> into the concession\'s account. The engine is therefore <b>traffic × toll</b>: the number of vehicles a day, the toll each one pays, and the ramp-up of the road. A trickle of <b style="color:#bc4733">cost</b> drains away for maintenance. Drag the traffic, the toll per vehicle and the ramp.',
    driverLab:'Toll / vehicle', availLab:'Ramp / avail', hrK:'Toll revenue', yrS:'traffic × toll per vehicle',
    ledge:{a:'+ toll',b:'+ tariff',c:'− maint'}, demandLabel:'TRAFFIC',
    preset:'Load Autostrade',
    try:'<b>Try this:</b> raise the <b>traffic</b> and watch revenue climb almost one-for-one, a mature toll road is operationally geared, so extra vehicles drop straight to EBITDA at a very high margin. Then drop the traffic to feel the <b>demand risk</b>: with no revenue floor, a recession or a fuel shock cuts the toll income directly. That demand risk is exactly what an availability PPP removes.',
    s3:'Autostrade earns a <b>toll on every vehicle</b> that uses its network, with the toll set by a <b>regulated tariff formula</b>, historically a price cap linked to inflation, the agreed investment plan and quality and safety targets, now overseen by the transport regulator <b>ART</b>. So revenue is traffic multiplied by a regulated per-vehicle toll. Because running an existing motorway costs little against that revenue, the margin is high; the value swings on traffic growth and on how generous the next tariff period is.',
    mb:{tag:'Model A · regulated toll network', title:'Mature demand-risk toll concession', body:'A long-dated concession to operate a motorway network, earning a toll on every vehicle under a <b>regulated tariff formula</b> linked to inflation and an investment plan. Demand risk sits with the operator, revenue is traffic × toll, but the margin is very high and the income inflation-linked. <b>This is Autostrade per l\'Italia</b>.'},
    s4a:'A toll road is cheap to operate relative to what it earns: routine maintenance, the toll and traffic-management systems, and a modest overhead, against a large toll revenue. The big cost is not annual opex but the <b>periodic resurfacing</b> and structural maintenance of the carriageway, captured here as maintenance capex. That low operating cost is why mature toll roads run at 70%+ EBITDA margins.',
    wfNote:'Operating cost is routine maintenance, operations and tolling systems, and administration, modest against a large toll revenue. The heavy spend is the periodic resurfacing of the carriageway, which sits in maintenance capex rather than opex. The margin is therefore high; the value is in traffic and the tariff formula.',
    s4b:'The capital is the motorway itself, the carriageways, structures, tunnels and tolling, built or acquired under the concession, with the state having funded part of the original build through grants and the concession award. Modelled on an enterprise-value basis, the return is a long, inflation-linked toll annuity over the life of the concession, against a network that costs relatively little to keep open.',
    stackH:'The capital · net of public grant', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',28,'Public grant / state'],['s2',72,'Concessionaire capital']],
    finList:[['','Network','3,000+ km of motorway'],['sub','Model','toll · demand risk'],['','Revenue','traffic × regulated toll'],['sub','Regulator','ART (five-year tariff)'],['','Margin','~70%+ EBITDA'],['rest','Owner','infrastructure-fund backed']],
    finNote:'A mature regulated toll network is a <b>high-margin, inflation-linked demand-risk annuity</b>: traffic × toll, low operating cost, long concession. The risks are traffic cycles, the tariff decision and the heavy periodic resurfacing of the carriageway.',
    timeline:[['1950s','<b>Autostrada del Sole</b> (A1), the Milan–Naples spine is built.'],['1999','<b>Autostrade privatised</b>, listed and later taken private.'],['2007','<b>Atlantia</b> formed as the holding company.'],['2018','<b>Genoa bridge collapse</b> reshapes the concession and oversight.'],['2021','<b>ART tariff regulation</b> and a renegotiated concession framework.'],['2022','<b>Mundys / infra-fund</b> consortium takes control of ASPI.']],
    calcNote:'A working model of a <b>mature regulated toll network</b>, on an enterprise-value basis. Revenue is traffic × toll with no floor (demand risk); the margin is high; the heavy spend is periodic resurfacing. A public grant offsets part of the build, and a long hold reflects a mature, inflation-linked concession.',
    s6:'Autostrade is the classic demand-risk toll network. What drives the return:',
    breakers:['<b>Traffic</b>, vehicle-kilometres are the engine; recessions and fuel prices are the demand risk.','<b>The tariff formula</b>, how much the regulator lets the toll rise sets the inflation linkage.','<b>Periodic resurfacing</b>, the heavy structural maintenance of the carriageway is the real capital line.','<b>Concession terms</b>, the length and conditions of the concession frame the whole return.'],
    src:'Figures from public sources on the Italian toll-motorway market: <a href="https://www.autostrade.it/" target="_blank" rel="noopener">Autostrade per l\'Italia</a> and the transport regulator <a href="https://www.autorita-trasporti.it/" target="_blank" rel="noopener">ART</a> tariff framework. The figures are approximate and illustrative.',
    econ:{cur:'€', model:'toll', kind:'Regulated toll network',
      aadtDef:120,aadtMin:50,aadtMax:200,aadtStep:5, tollDef:3.4,tollMin:1.0,tollMax:7.0,tollStep:0.1,
      rampDef:92,rampMin:50,rampMax:100,rampStep:1, opexPerVeh:0.25, fixedOM:30},
    calc:{build:1600,grant:350,capex:14,revG:2.5,floor:0,cap:9e9,tax:24,exit:13,lev:6,rd:5,amort:2,hold:28},
    map:{footer:GEO.autostrade.footer}
  },

  /* ---------- 2 · 407 ETR (North America · premium unregulated toll road) ---------- */
  etr407:{
    name:'407 ETR', geo:'Toronto, Canada', continent:'North America', cur:'C$', geoKey:'etr407',
    lede:'The gold-standard toll concession, a private, all-electronic express toll route around Toronto with <b>unregulated tolls</b> and pure demand risk. The operator sets the price, and drivers pay to save time.',
    s1:'<p class="body">The <b>407 ETR</b> is a 108&nbsp;km all-electronic express toll route running across the top of the Greater Toronto Area, leased to a private consortium until <b>2098</b>. It is famous in infrastructure circles for one reason: the operator can <b>set its own tolls</b>, with essentially no price regulation. Drivers choose to pay to avoid the congested free highways below it, they are buying <b>time</b>.</p>'+
       '<p class="body">That makes the 407 a near-pure expression of toll-road economics: revenue is <b>traffic × toll</b>, and because the operator controls the toll, it has repeatedly raised prices ahead of inflation while traffic kept growing, the rare road with both pricing power and volume growth. There are no toll booths; cameras and transponders bill every trip electronically, so operating cost is exceptionally low and the EBITDA margin is among the highest of any infrastructure asset. The risk is congestion on the free alternatives and the long-run value of time.</p>',
    facts:[['108 km','Route','all-electronic, no booths'],['Unregulated','Tolls','operator sets the price'],['to 2098','Concession','99-year lease'],['~80%+','EBITDA margin','exceptionally high'],['Demand risk','Model','pure traffic × toll'],['CPPIB / infra','Owner','blue-chip consortium']],
    s2:'Watch the express route run free-flowing while the alternatives clog below. Every transponder and licence-plate read under the open-road <b>gantry</b> bills a trip and drops a <b style="color:#0c6b4f">toll</b>, and because the operator sets the price, those tolls are high. The engine is <b>traffic × toll</b> with unusual pricing power. Drag the traffic, the toll per vehicle and the ramp to see how an unregulated express road compounds.',
    driverLab:'Toll / vehicle', availLab:'Ramp / avail', hrK:'Toll revenue', yrS:'traffic × toll per vehicle',
    ledge:{a:'+ toll',b:'+ pricing',c:'− maint'}, demandLabel:'TRAFFIC',
    preset:'Load 407 ETR',
    try:'<b>Try this:</b> push the <b>toll per vehicle</b> up hard, on the 407, unregulated pricing power is the whole story, and history shows tolls can rise well ahead of inflation while traffic still grows. Then watch the margin: with no toll booths and very low opex, almost all of that extra toll is EBITDA. The risk you can\'t model away is congestion on the free roads, the 407 only has pricing power because the alternatives are slow.',
    s3:'The 407 ETR earns a <b>toll on every trip</b>, billed electronically by transponder or licence plate, and crucially, the concession lets the operator <b>set its own tolls</b> with no price cap. So revenue is traffic multiplied by a toll the operator controls, varied by time of day and distance. With no booths and a lean operation, almost all incremental revenue falls to EBITDA. The investment case is pricing power plus volume growth in a congested metro, the gold standard of toll concessions.',
    mb:{tag:'Model A · unregulated toll road', title:'Premium demand-risk express road', body:'A private express toll route with <b>unregulated tolls</b>, the operator sets the price and bears demand risk. Drivers pay to save time, so the road has both pricing power and volume growth, and with all-electronic tolling the margin is exceptionally high. <b>This is the 407 ETR</b>, the gold-standard toll concession.'},
    s4a:'With no toll booths and an all-electronic billing system, the 407 is about as cheap to operate as a major road can be: maintenance, the imaging and billing systems, and a small overhead, against a very large toll revenue. The result is one of the highest EBITDA margins in infrastructure. The heavy spend is the periodic resurfacing of the carriageway, in maintenance capex.',
    wfNote:'Operating cost is routine maintenance, the all-electronic tolling and billing operation, and administration, very low against the toll revenue. With no booths and no fare collection on the road, the margin is exceptionally high; the capital spend is the periodic resurfacing.',
    s4b:'The capital is the express route and its electronic tolling, leased under a 99-year concession; the original build was part-funded by the province before the lease. Modelled on an enterprise-value basis, the return is a very long, high-margin toll annuity with rare pricing power, which is why the 407 trades at among the highest multiples of any infrastructure asset.',
    stackH:'The capital · net of public funding', splitL:'Who funded the build', splitR:'allocation',
    split:[['s1',22,'Province (original build)'],['s2',78,'Concessionaire capital']],
    finList:[['','Route','108 km, all-electronic'],['sub','Model','toll · pure demand risk'],['','Tolls','unregulated, operator sets price'],['sub','Concession','99-year lease to 2098'],['','Margin','~80%+ EBITDA'],['rest','Owner','CPPIB / infra consortium']],
    finNote:'The 407 is the <b>gold-standard demand-risk toll road</b>: unregulated pricing power, volume growth in a congested metro, very low opex and a 99-year lease. The risk is the speed of the free alternatives and the long-run value of time, both of which underpin its pricing power.',
    timeline:[['1997','<b>407 ETR opens</b> as an all-electronic toll road.'],['1999','<b>99-year lease</b> to a private consortium (to 2098).'],['2000s','<b>Repeated toll increases</b> ahead of inflation, traffic still grows.'],['2010s','<b>Extensions</b> lengthen the route eastward.'],['2019','<b>Cintra stake sale</b> values the road at a premium multiple.'],['Ongoing','<b>Pricing power</b> as GTA congestion deepens.']],
    calcNote:'A working model of a <b>premium unregulated toll road</b>, on an enterprise-value basis. Revenue is traffic × toll with no floor; pricing power and very low opex give an exceptionally high margin. A long hold and a high exit multiple reflect a 99-year, gold-standard concession.',
    s6:'The 407 is pricing power plus congestion. What drives the return:',
    breakers:['<b>Pricing power</b>, unregulated tolls are the defining feature; the operator sets the price.','<b>Congestion on free roads</b>, the value of time on the alternatives is what lets the 407 price.','<b>Traffic growth</b>, a growing, congested metro keeps both volume and pricing rising.','<b>Concession length</b>, a 99-year lease makes the annuity, and the multiple, very long.'],
    src:'Figures from public sources on <a href="https://www.407etr.com/" target="_blank" rel="noopener">407 ETR</a> and the consortium owners\' disclosure (including <a href="https://www.cppinvestments.com/" target="_blank" rel="noopener">CPP Investments</a>). Toll and traffic figures are approximate and illustrative.',
    econ:{cur:'C$', model:'toll', kind:'Unregulated toll road',
      aadtDef:115,aadtMin:60,aadtMax:180,aadtStep:5, tollDef:6.5,tollMin:3.0,tollMax:14.0,tollStep:0.25,
      rampDef:90,rampMin:50,rampMax:100,rampStep:1, opexPerVeh:0.18, fixedOM:35},
    calc:{build:4200,grant:550,capex:8,revG:4,floor:0,cap:9e9,tax:26,exit:18,lev:6,rd:5,amort:1.5,hold:30},
    map:{footer:GEO.etr407.footer}
  },

  /* ---------- 3 · CCR (South America · EM toll-road concessions) ---------- */
  ccr:{
    name:'CCR', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'ccr',
    lede:'One of Latin America\'s largest toll-road groups, a portfolio of <b>highway concessions</b> across Brazil\'s busiest corridors, earning a toll on heavy traffic, with cash flows in reais and an emerging-market discount rate.',
    s1:'<p class="body"><b>CCR</b> (Companhia de Concessões Rodoviárias) operates a large portfolio of toll-road concessions on Brazil\'s most heavily-used highways, the corridors around São Paulo and through the industrial south-east, carrying both commuter traffic and a high share of <b>heavy trucks</b> moving freight across the country. It is one of the largest private toll-road operators in Latin America.</p>'+
       '<p class="body">The model is the familiar one, revenue is <b>traffic × toll</b> on a demand-risk concession won at auction from the state, but two things distinguish it. First, the <b>truck share</b> is high, and trucks pay multiple-axle tolls, so freight is a big part of the revenue. Second, everything is in <b>reais</b>: a strong nominal toll cash flow is discounted at high Brazilian rates, so the investment debate is as much about the <b>country and the currency</b> as about the road. Concessions are won competitively and carry construction and capex obligations.</p>',
    facts:[['Largest','Toll group','in Latin America'],['Heavy trucks','Traffic mix','multi-axle freight tolls'],['Demand risk','Model','traffic × toll, auctioned'],['Real (R$)','Currency','EM discount rate'],['Concession','Tenure','competitively awarded'],['Listed','Owner','B3-listed']],
    s2:'Watch a busy Brazilian corridor, commuters and a heavy stream of <b>trucks</b> hauling freight. Every vehicle under the <b>toll plaza</b> pays a toll, trucks more than cars, dropping a <b style="color:#0c6b4f">toll</b> into the concession. The engine is <b>traffic × toll</b> with a heavy freight component. Drag the traffic, the toll per vehicle and the ramp, the cash flow is strong in reais; the risk is the Brazilian discount rate.',
    driverLab:'Toll / vehicle', availLab:'Ramp / avail', hrK:'Toll revenue', yrS:'traffic × toll per vehicle',
    ledge:{a:'+ toll',b:'+ freight',c:'− maint'}, demandLabel:'TRAFFIC',
    preset:'Load CCR',
    try:'<b>Try this:</b> raise the <b>traffic</b>, Brazil\'s freight corridors carry a heavy truck share, and multi-axle truck tolls make each one worth several cars, so a busy corridor throws off strong revenue. But the whole return is in reais: push the cost of debt up to Brazilian levels and watch a strong nominal toll cash flow net down once discounted like an emerging-market asset.',
    s3:'CCR earns a <b>toll on every vehicle</b> on its concessions, with cars and (at higher multi-axle rates) trucks paying a tariff set in the concession contract and adjusted for inflation. Revenue is traffic × toll on a demand-risk basis, with concessions won competitively at state auctions that carry construction and investment obligations. The road economics are strong; the investment question is the <b>discount rate</b>, Brazilian rates and the real, more than the asset.',
    mb:{tag:'Model A · EM toll concession', title:'Emerging-market demand-risk toll road', body:'A portfolio of competitively-awarded toll-road concessions on busy freight and commuter corridors, earning a toll on every vehicle (trucks at multi-axle rates) on a demand-risk basis. Strong nominal cash flows in reais, discounted at a high emerging-market rate. <b>This is CCR</b>, Latin America\'s largest toll group.'},
    s4a:'The roads themselves are high-margin, routine maintenance, tolling and operations against a large toll revenue, but EM concessions carry heavier obligations: construction commitments, capex programmes and a larger field operation across long corridors. The big capital line is the periodic resurfacing and the investment obligations attached to each concession award.',
    wfNote:'Operating cost is routine maintenance, operations and tolling across long corridors, and administration, modest against the toll revenue but heavier than a mature Western road given the field operation. The capital spend is periodic resurfacing plus the investment obligations of each concession.',
    s4b:'The capital is the highways under concession plus the construction and upgrade obligations won at auction, part-funded by the state through the concession terms. Modelled on an enterprise-value basis, the return is a strong nominal toll annuity in reais, carried against high Brazilian rates and a shorter hold than a Western road, reflecting the emerging-market cost of capital.',
    stackH:'The capital · concession + obligations', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',30,'State / concession terms'],['s2',70,'Concessionaire capital']],
    finList:[['','Portfolio','toll-road concessions'],['sub','Model','toll · demand risk'],['','Traffic mix','high truck / freight share'],['sub','Currency','real (R$)'],['','Key lever','country & currency'],['rest','Owner','B3-listed']],
    finNote:'A Brazilian toll group is a <b>strong nominal toll annuity at an EM discount rate</b>: traffic × toll with a heavy freight share, in reais. The whole investment debate is the discount rate, Brazilian rates and the real, and the obligations attached to each concession.',
    timeline:[['1998','<b>CCR founded</b> as Brazil privatises highway concessions.'],['2002','<b>Listed on the Bovespa</b> (now B3).'],['2000s','<b>Wins major São Paulo corridors</b> at auction.'],['2010s','<b>Diversifies</b> into urban mobility and airports.'],['Periodic','<b>Concession re-auctions</b> reset terms and tariffs.'],['2020s','<b>New federal &amp; state auctions</b> extend the portfolio.']],
    calcNote:'A working model of an <b>emerging-market toll concession</b>, on an enterprise-value basis. Revenue is traffic × toll with no floor (demand risk); the road is high-margin but the cost of debt is high to reflect Brazilian rates, and the hold is shorter. A strong nominal return nets down once discounted like an EM asset.',
    s6:'CCR is a strong toll road at an EM discount rate. What drives the return:',
    breakers:['<b>Traffic &amp; freight</b>, vehicle volumes and the high truck share are the engine.','<b>Country &amp; currency</b>, Brazilian real rates and the real, not the asset, set the discount rate.','<b>Concession terms</b>, auction obligations, tariff adjustment and re-auction risk.','<b>Truck tolls</b>, multi-axle tariffs make freight a disproportionate share of revenue.'],
    src:'Figures from public sources on the Brazilian toll-road market: <a href="https://www.grupoccr.com.br/" target="_blank" rel="noopener">CCR</a> and the federal concession agency <a href="https://www.gov.br/antt/" target="_blank" rel="noopener">ANTT</a>. The figures are approximate and illustrative.',
    econ:{cur:'R$', model:'toll', kind:'EM toll concession',
      aadtDef:60,aadtMin:25,aadtMax:110,aadtStep:5, tollDef:9.0,tollMin:4.0,tollMax:20.0,tollStep:0.5,
      rampDef:88,rampMin:50,rampMax:100,rampStep:1, opexPerVeh:1.0, fixedOM:45},
    calc:{build:1100,grant:250,capex:18,revG:4,floor:0,cap:9e9,tax:34,exit:9,lev:4,rd:9,amort:3,hold:15},
    map:{footer:GEO.ccr.footer}
  },

  /* ---------- 4 · TRANSURBAN (Oceania · urban toll roads) ---------- */
  transurban:{
    name:'Transurban', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'transurban',
    lede:'The world\'s pre-eminent <b>urban toll-road</b> operator, CityLink in Melbourne, WestConnex and the harbour links in Sydney, earning CPI-linked tolls on congested city motorways. Demand risk, but in the most defensive part of it: commuters who have to travel.',
    s1:'<p class="body"><b>Transurban</b> owns and operates a portfolio of <b>urban toll roads</b> in Australia\'s biggest cities, Melbourne\'s CityLink, Sydney\'s WestConnex, the harbour crossings and more, plus roads in North America. These are not inter-city motorways but congested <b>city</b> motorways and tunnels, where the alternative is gridlock on free roads, so the demand is unusually resilient: people pay to get to work.</p>'+
       '<p class="body">Revenue is <b>traffic × toll</b>, and Transurban\'s concessions typically allow tolls to rise with <b>CPI</b> (and on some roads faster), giving an inflation-linked, growing top line. Because urban roads are heavily used and largely electronic, the margin is high. As a listed company Transurban has built the model into a machine: win or build a new urban road, ramp the traffic, raise tolls with inflation, and recycle capital into the next concession. The demand risk is real but defensive, congestion is structural in a growing city.</p>',
    facts:[['Urban','Toll roads','CityLink · WestConnex'],['CPI-linked','Tolls','some roads faster'],['Defensive','Demand','commuters who must travel'],['Demand risk','Model','traffic × toll'],['Listed','Structure','ASX-listed, stapled'],['Multi-city','Footprint','AU + North America']],
    s2:'Watch a congested city motorway, dense commuter traffic in both directions, the free roads gridlocked. Every vehicle under the <b>gantry</b> pays a CPI-linked toll, dropping a <b style="color:#0c6b4f">toll</b> into the concession. The engine is <b>traffic × toll</b>, but the demand is defensive: people have to get to work. Drag the traffic, the toll per vehicle and the ramp to see how an urban toll road compounds with inflation.',
    driverLab:'Toll / vehicle', availLab:'Ramp / avail', hrK:'Toll revenue', yrS:'traffic × toll per vehicle',
    ledge:{a:'+ toll',b:'+ CPI',c:'− maint'}, demandLabel:'TRAFFIC',
    preset:'Load Transurban',
    try:'<b>Try this:</b> nudge the <b>toll per vehicle</b>, Transurban\'s concessions let tolls rise with CPI (and on some roads faster), so the top line grows with inflation even before traffic. Then drop the traffic only a little: urban commuter demand is defensive, which is why it falls less in a downturn than an inter-city road. The risk is paying too much for a new concession and a slow traffic ramp on opening.',
    s3:'Transurban earns a <b>toll on every vehicle</b> on its urban motorways, billed electronically, with concessions that allow tolls to escalate with <b>CPI</b>, and on several roads at a fixed rate above it. Revenue is traffic × toll on a demand-risk basis, but the demand is the defensive, structural congestion of a growing city. New roads are built or acquired, ramped, and the toll grown with inflation; the model recycles capital from mature roads into the next concession.',
    mb:{tag:'Model A · urban toll road', title:'Defensive demand-risk urban toll', body:'A portfolio of congested urban motorways earning CPI-linked tolls on every vehicle. Demand risk sits with the operator, revenue is traffic × toll, but city-commuter demand is defensive and the tolls grow with inflation. A listed machine for building, ramping and recycling toll roads. <b>This is Transurban</b>.'},
    s4a:'Urban toll roads are high-margin: largely electronic tolling, routine maintenance and traffic management, and a corporate overhead, against a large and inflation-linked toll revenue. The heavy spend is the periodic resurfacing and the tunnel and structure maintenance of city motorways, captured in maintenance capex. The defining feature is defensive, CPI-linked demand, not the cost line.',
    wfNote:'Operating cost is routine maintenance, electronic tolling and operations, and administration, modest against a large, CPI-linked toll revenue. The capital spend is periodic resurfacing and the maintenance of urban tunnels and structures. The margin is high; the value is in traffic and the toll escalation.',
    s4b:'The capital is the urban motorways and tunnels, heavy to build, especially the tunnelling, often part-funded by the state through the concession, then earned back over a long tenure. Modelled on an enterprise-value basis, the return is a defensive, CPI-linked toll annuity that Transurban recycles into the next urban concession, compounding the portfolio over time.',
    stackH:'The capital · net of public contribution', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',32,'State contribution'],['s2',68,'Concessionaire capital']],
    finList:[['','Roads','urban toll motorways'],['sub','Model','toll · defensive demand'],['','Tolls','CPI-linked (some faster)'],['sub','Structure','ASX-listed, stapled'],['','Footprint','AU + North America'],['rest','Owner','listed (ASX: TCL)']],
    finNote:'An urban toll-road operator is a <b>defensive, inflation-linked demand-risk annuity</b>: traffic × CPI-linked toll on congested city motorways, high margin, recycled into new concessions. The risks are the price paid for new roads, the traffic ramp on opening, and tunnel maintenance.',
    timeline:[['1996','<b>Transurban founded</b> to deliver Melbourne\'s CityLink.'],['2000','<b>CityLink opens</b>, the model is proven.'],['2007','<b>Sydney roads</b> added to the portfolio.'],['2014','<b>North American roads</b> diversify the footprint.'],['2018','<b>WestConnex</b> stake, Sydney\'s largest road project.'],['2020s','<b>Capital recycling</b> funds the next urban concessions.']],
    calcNote:'A working model of an <b>urban toll road</b>, on an enterprise-value basis. Revenue is traffic × toll with no floor (demand risk), escalating with CPI; the margin is high and the demand defensive. A long hold and a healthy exit multiple reflect a listed, capital-recycling toll-road machine.',
    s6:'Transurban is defensive urban demand plus inflation-linked tolls. What drives the return:',
    breakers:['<b>Urban congestion</b>, defensive commuter demand is more resilient than inter-city traffic.','<b>CPI-linked tolls</b>, toll escalation grows the top line with inflation, before any traffic growth.','<b>New-road economics</b>, the price paid and the opening traffic ramp on each new concession.','<b>Tunnel maintenance</b>, urban tunnels and structures are heavy to keep in good condition.'],
    src:'Figures from public sources on <a href="https://www.transurban.com/" target="_blank" rel="noopener">Transurban</a> investor disclosure on CityLink, WestConnex and its road portfolio. The figures are approximate and illustrative.',
    econ:{cur:'A$', model:'toll', kind:'Urban toll road',
      aadtDef:130,aadtMin:60,aadtMax:220,aadtStep:5, tollDef:4.2,tollMin:2.0,tollMax:9.0,tollStep:0.1,
      rampDef:90,rampMin:50,rampMax:100,rampStep:1, opexPerVeh:0.42, fixedOM:25},
    calc:{build:2400,grant:500,capex:12,revG:3.5,floor:0,cap:9e9,tax:30,exit:15,lev:6,rd:5.5,amort:2,hold:26},
    map:{footer:GEO.transurban.footer}
  },

  /* ---------- 5 · GULF AVAILABILITY HIGHWAY PPP (Middle East · no demand risk) ---------- */
  gulfppp:{
    name:'Gulf Highway PPP', geo:'Saudi Arabia / UAE', continent:'Middle East', cur:'SAR', geoKey:'gulfppp',
    lede:'An <b>availability-payment</b> highway PPP, a Gulf government pays a private partner a fixed fee for building, operating and keeping a highway open and well-maintained. <b>No demand risk</b>: the payment does not depend on how many vehicles use the road.',
    s1:'<p class="body">Not every road concession takes traffic risk. Across the Gulf, governments increasingly procure major highways as <b>availability-payment PPPs</b>: a private partner finances, builds, operates and maintains the road, and in return the government pays a fixed <b>availability fee</b>, for as long as the road is open, safe and maintained to standard. The driver does not pay a toll; the <b>government</b> pays for the road being available.</p>'+
       '<p class="body">This flips the economics. Revenue is <b>not</b> traffic × toll, it is a contracted annual payment, deducted only if the road is closed or sub-standard. So there is <b>no demand risk</b>: whether traffic is heavy or light, the payment is the same. The investment case becomes a contracted, government-backed annuity, closer to a long-dated bond than to a toll road, where the key risks are construction, maintenance performance (avoiding deductions) and the creditworthiness of the paying government. The figures here are illustrative of the model.</p>',
    facts:[['Availability','Model','government pays a fixed fee'],['No demand risk','Key feature','payment ≠ traffic'],['PPP','Structure','finance · build · operate · maintain'],['Deductions','Risk','for closures / sub-standard'],['Government','Counterparty','sovereign credit'],['Illustrative','Figures','model-representative']],
    s2:'Watch the highway run, well-maintained, free-flowing, but notice there is <b>no toll gantry</b>. Instead the <b style="color:#0c6b4f">availability fee</b> arrives at a steady rate from the government, whether traffic is heavy or light, as long as the road is open and to standard. The engine is <b>availability, not demand</b>. Drag the traffic and watch revenue stay flat, that is the whole point of an availability PPP, and use the ramp/availability slider to feel deductions.',
    driverLab:'Availability fee', availLab:'Ramp / avail', hrK:'Availability fee', yrS:'contracted fee × availability',
    ledge:{a:'+ avail fee',b:'+ contracted',c:'− maint'}, demandLabel:'TRAFFIC',
    preset:'Load Gulf PPP',
    try:'<b>Try this:</b> drop the <b>traffic</b> all the way down, and watch the revenue barely move. That is the signature of an <b>availability PPP</b>: the government pays for the road being open, not for how many vehicles use it, so there is no demand risk. Now drop the <b>availability</b> slider instead: that is the only thing that cuts the fee, deductions for closures or sub-standard maintenance. The risk here is performance and the government\'s credit, not traffic.',
    s3:'A Gulf availability highway PPP earns a <b>contracted availability payment</b> from the government, a fixed annual fee for financing, building, operating and maintaining the road, paid for as long as it is open and to standard. There is <b>no toll and no demand risk</b>: the payment is independent of traffic, reduced only by <b>deductions</b> if the road is closed or sub-standard. The return is a contracted, government-backed annuity; the levers are construction, maintenance performance and sovereign credit.',
    mb:{tag:'Model A · availability PPP', title:'Availability-payment road (no demand risk)', body:'A PPP in which a private partner finances, builds, operates and maintains a highway, and the <b>government pays a fixed availability fee</b> for the road being open and to standard, independent of traffic. No demand risk; deductions only for under-performance. A contracted, government-backed annuity. <b>This is a Gulf availability highway PPP</b>.'},
    s4a:'An availability road must be kept to a high standard to avoid deductions, so maintenance and operations are taken seriously, but against a contracted fee the margin is still high and, crucially, <b>predictable</b>. There is no traffic to chase and no toll to collect; the cost is the disciplined operations and maintenance that keep the road available, plus the periodic resurfacing in maintenance capex.',
    wfNote:'Operating cost is the operations and maintenance needed to keep the road available and to standard, routine maintenance, incident response and administration, against a contracted availability fee. The discipline is avoiding deductions; the capital spend is periodic resurfacing. The margin is high and, unlike a toll road, predictable.',
    s4b:'The capital is the highway, financed and built by the private partner under the PPP, with the government often contributing a capital grant or milestone payments during construction. Modelled on an enterprise-value basis, the return is a contracted availability annuity backed by the government\'s credit, closer to a long-dated inflation-linked bond than to a demand-risk toll road, which is why it can carry more leverage.',
    stackH:'The capital · net of public grant', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',40,'Government grant / milestones'],['s2',60,'Private partner capital']],
    finList:[['','Model','availability payment'],['sub','Demand risk','none, fee ≠ traffic'],['','Revenue','contracted government fee'],['sub','Deductions','closures / sub-standard'],['','Counterparty','sovereign credit'],['rest','Figures','illustrative of the model']],
    finNote:'An availability highway PPP is a <b>contracted, government-backed annuity</b>: a fixed fee for keeping the road open and to standard, with no demand risk. The risks are construction, maintenance performance (deductions) and the government\'s credit, so it behaves like a long-dated bond and can carry more debt.',
    timeline:[['2010s','<b>Gulf governments adopt PPP</b> frameworks for infrastructure.'],['2010s','<b>Availability-payment roads</b> procured to transfer build risk.'],['2020s','<b>Vision-2030-style</b> programmes scale road PPPs.'],['Build','<b>Finance, build</b> under the PPP contract.'],['Operate','<b>Availability fee</b> paid for the open, maintained road.'],['Long-term','<b>Contracted annuity</b> over the concession life.']],
    calcNote:'A working model of an <b>availability-payment highway PPP</b>, on an enterprise-value basis. Revenue is a contracted fee set by the <b>revenue floor</b>, independent of traffic, so demand risk is removed. The margin is high and predictable; higher leverage and a long hold reflect a government-backed annuity. Figures are illustrative.',
    s6:'A Gulf availability PPP is a contracted annuity, not a toll road. What drives the return:',
    breakers:['<b>Availability, not demand</b>, the fee is paid for the road being open, independent of traffic.','<b>Maintenance performance</b>, deductions for closures or sub-standard road are the real risk.','<b>Sovereign credit</b>, the government is the counterparty, so its creditworthiness is key.','<b>Leverage</b>, a contracted, bond-like cash flow supports more debt than a toll road.'],
    src:'Figures illustrative of <a href="https://www.ppp.gov.sa/" target="_blank" rel="noopener">Gulf availability-payment PPP</a> highway structures (e.g. Saudi and UAE programmes). As a model-representative example, all figures here are approximate and illustrative.',
    econ:{cur:'SAR', model:'availability', kind:'Availability PPP',
      aadtDef:70,aadtMin:20,aadtMax:160,aadtStep:5, tollDef:2.0,tollMin:0.5,tollMax:5.0,tollStep:0.1,
      rampDef:98,rampMin:70,rampMax:100,rampStep:1, opexPerVeh:0.15, fixedOM:180},
    calc:{build:9000,grant:2000,capex:10,revG:1.5,floor:760,cap:9e9,tax:0,exit:13,lev:7,rd:5,amort:3,hold:25},
    map:{footer:GEO.gulfppp.footer}
  },

  /* ---------- 6 · CHINESE EXPRESSWAY OPERATOR (China · listed toll expressway) ---------- */
  expressway:{
    name:'Jiangsu Expressway', geo:'Yangtze Delta, China', continent:'China', cur:'¥', geoKey:'expressway',
    lede:'A listed Chinese <b>toll-expressway</b> operator running core motorways through one of the world\'s busiest economic regions, huge traffic, a heavy freight share, demand risk, and a very low state cost of capital.',
    s1:'<p class="body">China built the world\'s largest expressway network in a generation, and listed operators such as <b>Jiangsu Expressway</b> run the core toll motorways through its richest, most industrial regions, here the <b>Yangtze River Delta</b> around Shanghai, Nanjing and Suzhou. These roads carry colossal volumes of both passenger cars and freight trucks moving goods across the manufacturing heartland.</p>'+
       '<p class="body">The model is a demand-risk toll road at vast scale: revenue is <b>traffic × toll</b>, set within China\'s regulated toll framework, on roads with enormous and growing volumes. The toll per vehicle is modest, but applied to immense traffic and financed at a very low <b>state-influenced cost of capital</b>, it compounds into large, stable cash flows. Listed operators return much of it as dividends. The defining features are scale and a low discount rate; the risk is the regulated toll regime and any policy that diverts traffic.</p>',
    facts:[['Core network','Expressways','Yangtze Delta motorways'],['Huge','Traffic','passenger + freight at scale'],['Demand risk','Model','traffic × regulated toll'],['Low','Cost of capital','state-influenced'],['Listed','Structure','HK / Shanghai-listed'],['Dividends','Return','high payout']],
    s2:'Watch a core Chinese expressway at scale, dense passenger traffic and a heavy stream of freight trucks through the Delta. Every vehicle under the <b>toll plaza</b> pays a modest toll, but the sheer volume drops a steady stream of <b style="color:#0c6b4f">tolls</b> into the operator. The engine is <b>traffic × toll</b> at immense scale. Drag the traffic, the toll per vehicle and the ramp, scale and a low cost of capital, not price, are the model.',
    driverLab:'Toll / vehicle', availLab:'Ramp / avail', hrK:'Toll revenue', yrS:'traffic × toll per vehicle',
    ledge:{a:'+ toll',b:'+ freight',c:'− maint'}, demandLabel:'TRAFFIC',
    preset:'Load Expressway',
    try:'<b>Try this:</b> the toll <b>per vehicle</b> is modest, but push the <b>traffic</b> slider and watch the absolute revenue balloon. Scale and the heavy freight share, not price, are the model. The cost of capital is very low because the owner is state-influenced and the income is stable, which is why even a modest toll on huge volumes is a valuable, dividend-paying asset. The risk is the regulated toll regime and traffic-diverting policy.',
    s3:'A Chinese toll-expressway operator earns a <b>toll on every vehicle</b> within China\'s regulated toll framework, a modest per-vehicle tariff on roads with enormous, growing traffic and a heavy freight share. Revenue is traffic × toll on a demand-risk basis, but the demand is the structural growth of one of the world\'s busiest economic regions. Financed at a very low state-influenced cost of capital, a modest toll on immense volume compounds into a large, stable, dividend-paying cash flow.',
    mb:{tag:'Model A · listed toll expressway', title:'Demand-risk toll road at scale', body:'A listed operator of core toll expressways through a major Chinese economic region, earning a modest regulated toll on enormous traffic with a heavy freight share. Demand risk, but at vast scale and a very low cost of capital, returned largely as dividends. <b>This is a Chinese expressway operator</b> such as Jiangsu Expressway.'},
    s4a:'At this scale the road is highly profitable: routine maintenance, tolling and operations against an immense toll revenue give a high margin. Opex is large in absolute terms, keeping core motorways and toll plazas running, but small against the revenue from colossal traffic. The big capital line is the periodic resurfacing of heavily-trafficked carriageways and any network expansion.',
    wfNote:'Operating cost is routine maintenance, the toll-plaza operation and administration of busy core expressways, large in absolute terms but small against an immense toll revenue. The capital spend is periodic resurfacing of heavily-used carriageways. The margin is high; the value is in scale and the low cost of capital.',
    s4b:'The capital is the core expressway network, built within China\'s vast road programme, often with state and provincial funding, and the heavy resurfacing that high traffic demands. Modelled on an enterprise-value basis, the return is a large, stable toll annuity at a low state-influenced cost of capital, much of which listed operators distribute as dividends.',
    stackH:'The capital · net of state funding', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',35,'State / provincial funding'],['s2',65,'Operator capital']],
    finList:[['','Network','core Delta expressways'],['sub','Model','toll · demand risk'],['','Traffic','huge, with heavy freight'],['sub','Cost of capital','very low (state-influenced)'],['','Return','high dividend payout'],['rest','Owner','HK / Shanghai-listed']],
    finNote:'A Chinese toll expressway is a <b>large, stable demand-risk annuity at a low cost of capital</b>: a modest toll on immense traffic, returned largely as dividends. The return is steady and large in absolute terms; the risks are the regulated toll regime and any policy that diverts traffic.',
    timeline:[['1990s','<b>China begins</b> building the national expressway network.'],['1990s','<b>Jiangsu Expressway lists</b> in Hong Kong and Shanghai.'],['2000s','<b>Delta industrialisation</b> drives huge traffic growth.'],['2010s','<b>Freight volumes</b> scale with the manufacturing economy.'],['Periodic','<b>Toll-policy reviews</b> set the regulated framework.'],['2020s','<b>Stable dividends</b> from a mature, busy network.']],
    calcNote:'A working model of a <b>listed Chinese toll expressway</b>, on an enterprise-value basis. Revenue is traffic × toll with no floor (demand risk); the toll is modest but the traffic immense, and the cost of capital very low (state-influenced). A long hold and steady cash flow reflect a mature, dividend-paying network.',
    s6:'A Chinese expressway is scale plus a low cost of capital. What drives the return:',
    breakers:['<b>Scale &amp; traffic</b>, a modest toll on enormous, growing traffic is the model.','<b>Cost of capital</b>, a very low state-influenced discount rate lifts the value of a stable cash flow.','<b>Freight share</b>, heavy goods traffic through an industrial region is a big part of revenue.','<b>Toll policy</b>, the regulated toll regime and any traffic-diverting policy are the key risks.'],
    src:'Figures from public sources on listed Chinese toll-expressway operators such as <a href="http://www.jsexpressway.com/" target="_blank" rel="noopener">Jiangsu Expressway</a> and the national expressway framework. Given scale and disclosure, all figures here are approximate and illustrative.',
    econ:{cur:'¥', model:'toll', kind:'Listed toll expressway',
      aadtDef:150,aadtMin:70,aadtMax:260,aadtStep:5, tollDef:2.6,tollMin:1.0,tollMax:6.0,tollStep:0.1,
      rampDef:93,rampMin:50,rampMax:100,rampStep:1, opexPerVeh:0.30, fixedOM:35},
    calc:{build:1300,grant:250,capex:12,revG:3,floor:0,cap:9e9,tax:25,exit:12,lev:5,rd:4,amort:2,hold:28},
    map:{footer:GEO.expressway.footer}
  }
  };
  var ORDER=['autostrade','etr407','ccr','transurban','gulfppp','expressway'];

  /* ===================================================================
     MOTORWAY RENDERER  (canvas, 720x520), top-down, daytime
     A divided dual carriageway running full width with a central median, an
     interchange / slip road, traffic (cars + trucks) flowing along each
     carriageway, and a toll gantry (or an availability-payment badge) that
     collects revenue. Traffic density scales with aadt × ramp.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  // carriageway geometry
  var GANTRYX=430;                 // x of the toll gantry / availability badge
  var CWA={y:232,h:30,dir:1};      // carriageway A → (eastbound)
  var CWB={y:270,h:30,dir:-1};     // carriageway B ← (westbound)
  var vehicles=[];                 // persistent vehicle pool
  var lastToll=0;                  // throttle availability coin spawns

  function layout(){
    // build a deterministic vehicle pool sized to the carriageways; the frame
    // shows a sliding subset according to traffic. cars + trucks per truck share.
    var G=GEO[A.geoKey]; vehicles=[];
    var pool=64;
    for(var i=0;i<pool;i++){
      var lane=(i%2===0); // alternate carriageway
      var cw=lane?CWA:CWB;
      var isTruck=((i*7)%100)/100 < (G.trucks||0.2);
      var sub=( (i*13)%2 ); // sub-lane within carriageway
      var col=carCol(i,isTruck);
      vehicles.push({
        lane:lane, dir:cw.dir, truck:isTruck, col:col,
        x:rnd(0,W), sub:sub, sp:rnd(0.9,1.35)*(isTruck?0.72:1),
        paid:false, idx:i
      });
    }
  }
  var CARCOLS=['#c9542f','#3a6ea5','#cdb24a','#5a7d52','#9a4f86','#d0d3cb','#7a8a96','#b86a3a'];
  function carCol(i,truck){ return truck?'#7c8088':CARCOLS[i%CARCOLS.length]; }

  /* ---- base map: ground ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // soft landscaped verges flanking the motorway
    ctx.fillStyle='rgba(150,180,140,0.10)';
    [[0,150,W,70],[0,312,W,72]].forEach(function(b){ rr(b[0],b[1],b[2],b[3],0); ctx.fill(); });
    // scattered soft trees / planting along the verges (deterministic)
    for(var i=0;i<26;i++){ var tx=((i*97)%720), ty=(i%2?120:402)+((i*31)%26);
      ctx.fillStyle='rgba(110,150,100,0.16)'; ctx.beginPath(); ctx.arc(tx,ty,4+((i*5)%4),0,Math.PI*2); ctx.fill(); }
  }

  /* ---- the divided carriageway ---- */
  function carriageway(){
    var top=CWA.y-2, bot=CWB.y+CWB.h+2;
    // shoulder / asphalt base spanning both carriageways + median
    ctx.fillStyle='#b6bbb1'; ctx.fillRect(0,top-4,W,(bot-top)+8);
    // carriageway A asphalt
    asphalt(CWA.y,CWA.h);
    // carriageway B asphalt
    asphalt(CWB.y,CWB.h);
    // central median (grass strip)
    var my=CWA.y+CWA.h, mh=CWB.y-my;
    ctx.fillStyle='rgba(120,160,110,0.45)'; ctx.fillRect(0,my,W,mh);
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,my+0.5); ctx.lineTo(W,my+0.5); ctx.moveTo(0,my+mh-0.5); ctx.lineTo(W,my+mh-0.5); ctx.stroke();
    // animated lane dashes per carriageway
    laneDashes(CWA.y,CWA.h);
    laneDashes(CWB.y,CWB.h);
    // solid edge lines
    ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=1.4;
    [CWA.y+1,CWA.y+CWA.h-1,CWB.y+1,CWB.y+CWB.h-1].forEach(function(y){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); });
  }
  function asphalt(y,h){
    var g=ctx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#c6cbc1'); g.addColorStop(0.5,'#bcc1b7'); g.addColorStop(1,'#c2c7bd');
    ctx.fillStyle=g; ctx.fillRect(0,y,W,h);
  }
  function laneDashes(y,h){
    var G=GEO[A.geoKey], lanes=Math.max(2,Math.min(5,G.lanes||3));
    ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=1.4; ctx.setLineDash([14,16]); ctx.lineDashOffset=-(T*1.6);
    for(var L=1;L<lanes;L++){ var ly=y+h*L/lanes; ctx.beginPath(); ctx.moveTo(0,ly); ctx.lineTo(W,ly); ctx.stroke(); }
    ctx.setLineDash([]);
  }

  /* ---- interchange / slip road branching off the bottom ---- */
  function slipRoad(){
    ctx.strokeStyle='#bcc1b7'; ctx.lineWidth=20; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(560,CWB.y+CWB.h);
    ctx.quadraticCurveTo(640,360,690,430); ctx.lineTo(720,470); ctx.stroke();
    // ramp edge dashes
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.2; ctx.setLineDash([10,12]); ctx.lineDashOffset=-(T*1.2);
    ctx.beginPath(); ctx.moveTo(560,CWB.y+CWB.h);
    ctx.quadraticCurveTo(640,360,690,430); ctx.lineTo(720,470); ctx.stroke(); ctx.setLineDash([]);
    ctx.lineCap='butt';
  }

  /* ---- a single vehicle (rounded rect; trucks are larger and grey) ---- */
  function drawVehicle(v){
    var cw=v.lane?CWA:CWB;
    var sub=v.sub, h=cw.h, laneH=h/2;
    var vy=cw.y+laneH*sub+laneH/2;
    var w=v.truck?20:11, hh=v.truck?9:6;
    var x=v.x;
    // shadow
    ctx.fillStyle='rgba(20,30,25,0.16)'; rr(x-w/2+1,vy-hh/2+1.4,w,hh,2.5); ctx.fill();
    // body
    ctx.fillStyle=v.col; rr(x-w/2,vy-hh/2,w,hh,v.truck?2:3); ctx.fill();
    if(v.truck){
      // cab + trailer split
      ctx.fillStyle='rgba(255,255,255,0.18)'; rr(x+(v.dir>0?w/2-5:-w/2+1),vy-hh/2,4,hh,1.5); ctx.fill();
      ctx.strokeStyle='rgba(40,46,44,0.25)'; ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(x-w/2+w*0.45,vy-hh/2); ctx.lineTo(x-w/2+w*0.45,vy+hh/2); ctx.stroke();
    } else {
      // windscreen highlight
      ctx.fillStyle='rgba(255,255,255,0.35)'; rr(x+(v.dir>0?1:-3.5),vy-hh/2+1,2.5,hh-2,1); ctx.fill();
    }
  }

  /* ---- toll gantry spanning the road ---- */
  function tollGantry(){
    var top=CWA.y-22, bot=CWB.y+CWB.h+4, x=GANTRYX;
    // posts
    ctx.fillStyle='#8a918c'; ctx.fillRect(x-1.5,top,3,(bot-top));
    ctx.fillStyle='#9aa19a'; rr(8,top-3,W-16,8,2); ctx.fill();            // overhead beam across the whole road
    ctx.fillStyle='#8a918c'; rr(W-12,top,3,(bot-top),0); ctx.fill();
    // toll heads / cameras along the beam
    for(var i=0;i<5;i++){ var hx=70+i*150; ctx.fillStyle='#6f766f'; rr(hx-7,top-1,14,9,2); ctx.fill();
      ctx.fillStyle=(Math.sin(T*0.2+i)>0?'#39d98a':'#2a8f5e'); ctx.beginPath(); ctx.arc(hx,top+3.5,1.6,0,Math.PI*2); ctx.fill(); }
    // label
    ctx.fillStyle='rgba(70,90,80,0.9)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('TOLL GANTRY',x,top-7);
  }

  /* ---- availability-payment badge (no demand risk) ---- */
  function availBadge(){
    var x=W/2,y=CWA.y-40, w=210,h=26;
    ctx.save();
    ctx.fillStyle='rgba(12,107,79,0.92)'; rr(x-w/2,y-h/2,w,h,8); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='700 10px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('AVAILABILITY PAYMENT',x,y+3.5);
    // small government / contract marker
    ctx.fillStyle='rgba(12,107,79,0.5)'; ctx.beginPath(); ctx.moveTo(x,y+h/2); ctx.lineTo(x-6,y+h/2+8); ctx.lineTo(x+6,y+h/2+8); ctx.closePath(); ctx.fill();
    ctx.restore();
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
  /* ---- live traffic sparkline, IDENTICAL ---- */
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
    var G=GEO[A.geoKey], E=A.econ, isAvail=(G.model==='availability');
    var aadt=parseFloat(sCap.value), toll=parseFloat(sSpread.value), ramp=parseFloat(sAvail.value)/100;
    var vehYr=aadt*1000*365;
    var tollRev=vehYr*toll*ramp;

    ctx.clearRect(0,0,W,H);
    drawMap(); carriageway(); slipRoad();

    // ---- economics (toll OR availability) ----
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,tollRev));     // floor = availability fee (high floor => revenue flat vs traffic)
    var opex= vehYr*(E.opexPerVeh||0) + (E.fixedOM||0)*1e6;  // roads are high-margin: low opex vs toll revenue
    var ebitda=revenue-opex;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // waterfall split of opex
    var c_routine=opex*0.40, c_resurf=opex*0.22, c_ops=opex*0.26, c_admin=opex*0.12;
    // share of "+cash" that is amber (availability / contracted) vs green (toll)
    var floorBinds = floor>0 && revenue<=floor*1.001;
    var connShare = floorBinds ? Math.min(0.6, floor/Math.max(1,revenue)) : 0.12;

    // ---- traffic density scales with aadt × ramp ----
    var dens=Math.max(0.12,Math.min(1, (aadt-E.aadtMin)/Math.max(1,(E.aadtMax-E.aadtMin)) ))*ramp;
    var nShow=Math.round(8+dens*52);

    // move + draw the visible vehicles
    if(_anim){
      vehicles.forEach(function(v){ v.x += v.dir*v.sp*(1.1+dens*1.4);
        if(v.dir>0 && v.x>W+24){ v.x=-24; v.paid=false; }
        if(v.dir<0 && v.x<-24){ v.x=W+24; v.paid=false; }
      });
    }
    for(var i=0;i<vehicles.length && i<nShow;i++){
      var v=vehicles[i]; drawVehicle(v);
      // toll model: spawn a green coin when a vehicle passes the gantry
      if(!isAvail && _anim && !v.paid){
        if((v.dir>0 && v.x>=GANTRYX) || (v.dir<0 && v.x<=GANTRYX)){
          v.paid=true; if(Math.random()<0.5) spawnCoin(GANTRYX, (v.lane?CWA:CWB).y+8, 'ret', -1);
        }
      }
    }

    // toll gantry OR availability badge
    if(isAvail){
      availBadge();
      // steady availability fee, independent of traffic
      if(_anim && (T-lastToll)>14){ lastToll=T; spawnCoin(W/2, CWA.y-30, 'rec', -1); }
    } else {
      tollGantry();
    }

    // −cash (maintenance) drains from the road at a low rate
    if(_anim){
      var outRate=Math.max(0.04,Math.min(0.4, opex/Math.max(1,revenue)));
      if(Math.random()<outRate*0.5){ spawnCoin(rnd(80,W-80), CWB.y+CWB.h+2, 'cost', 1); }
      var occLive=Math.max(0,Math.min(1, ramp));
      demHist.push(occLive); if(demHist.length>73) demHist.shift();
    }

    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,ramp)));

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+aadt+'k vehicles/day',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',aadt+'k/day'); set('ixSpreadV', isAvail?(CUR+toll.toFixed(2)):(CUR+toll.toFixed(2))); set('ixAvailV',Math.round(ramp*100)+'%');
    set('ixDir',aadt+'k veh/day'); set('ixDirS','traffic (AADT) · '+(E.kind||'concession'));
    set('ixMW',kfmt(vehYr)+' veh/yr'); set('ixMWs',Math.round(ramp*100)+'% '+(isAvail?'availability':'ramp')+' · '+(isAvail?'no demand risk':'demand risk'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Routine maintenance',c_routine],['Periodic resurfacing',c_resurf],['Operations &amp; tolling',c_ops],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the road is too lightly used to value, raise the traffic, the toll per vehicle or the ramp / availability.</span>'; return; }
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
    sCap.min=E.aadtMin; sCap.max=E.aadtMax; sCap.step=E.aadtStep; sCap.value=E.aadtDef;
    sSpread.min=E.tollMin; sSpread.max=E.tollMax; sSpread.step=E.tollStep; sSpread.value=E.tollDef;
    sAvail.min=E.rampMin; sAvail.max=E.rampMax; sAvail.step=E.rampStep; sAvail.value=E.rampDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, a road concession earns either toll revenue (traffic × toll per vehicle, demand risk) or a fixed availability payment (PPP, no demand risk), and the returns model is a simplified DCF in which a public grant offsets part of the build; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING, IDENTICAL
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.aadtDef; sSpread.value=E.tollDef; sAvail.value=E.rampDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'autostrade');

  /* section rail scroll-spy, IDENTICAL */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
