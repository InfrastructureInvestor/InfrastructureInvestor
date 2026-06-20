/* Waste-to-energy (Energy-from-Waste / EfW), data-driven worked examples.
   Six real energy-from-waste businesses, one template. Scene config from
   we-geo.js (GEO), drawn as a top-down / elevation EfW plant in 720x520 scene
   coords: a tipping hall takes residual waste from a truck into a bunker, a
   furnace/boiler burns it (warm glow scaling with throughput), a turbine hall
   makes power, and a switchyard exports it over the grid. NOT a RAB network:
   this is a throughput, dual-revenue processing asset, revenue is a contracted
   GATE FEE per tonne of waste accepted, plus merchant POWER sold from the
   electricity generated, against O&M, ash disposal and reagents; the returns
   model is a simplified DCF. */
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

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · UK / EUROPEAN EfW (Europe · municipal gate fee + power) ---------- */
  ukefw:{
    name:'UK / European energy-from-waste', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'ukefw',
    lede:'The European workhorse of residual-waste treatment, an <b>energy-from-waste</b> plant that burns the rubbish recycling cannot take, earning a <b>contracted gate fee</b> for every tonne it accepts and selling the <b>power</b> it generates into the grid.',
    s1:'<p class="body">An <b>energy-from-waste</b> (EfW) plant burns <b>residual waste</b>, the non-recyclable rubbish left after collection and recycling, to raise steam, drive a turbine and make electricity (and, where there is a heat offtake, hot water for a district network). It diverts waste from landfill and recovers energy from it, and is a long-life, capital-heavy piece of municipal infrastructure.</p>'+
       '<p class="body">The economics are a <b>throughput, dual-revenue</b> business. The stable core is the <b>gate fee</b>, a charge per tonne of waste accepted, usually under long, contracted <b>municipal supply agreements</b> with take-or-pay protection. On top sits a more merchant stream: selling the <b>electricity</b> (and sometimes heat) the plant generates. A UK / European EfW (a Viridor- or Covanta-style plant) is therefore a contracted processing asset with a power kicker.</p>',
    facts:[['Residual waste','Feedstock','non-recyclable'],['Gate fee','Core revenue','£/tonne, contracted'],['Power','Swing revenue','merchant export'],['Take-or-pay','Contract','long municipal'],['Capital-heavy','Build','long-life'],['Gate + power','Margin','dual revenue']],
    s2:'Watch the plant. A <b>truck</b> tips residual waste into the bunker; the <b>furnace</b> glows with the throughput; the <b>turbine</b> spins and the <b>switchyard</b> exports power over the line (cyan pulses). Two cash streams rise, a contracted <b style="color:#0c8a57">gate fee</b> (green, from the tipping hall) and merchant <b style="color:#c0902f">power</b> (amber, from the turbine), against O&amp;M draining out. Drag the capacity, the gate fee and the availability.',
    driverLab:'Gate fee', availLab:'Availability', hrK:'Gate + power', yrS:'gate fee + power',
    ledge:{a:'+ gate fee',b:'+ power',c:'− O&M'}, demandLabel:'THROUGHPUT',
    preset:'Load UK EfW',
    try:'<b>Try this:</b> drop the <b>gate fee</b> a notch and watch the revenue hold, the <b>contracted floor</b> (the take-or-pay municipal supply agreement) catches it. That contracted gate fee is the stable core; the <b>power</b> is the swing. Push the capacity to see the dual revenue scale, but remember the build is capital-heavy, a 600kt plant costs hundreds of millions.',
    s3:'A UK / European EfW earns a <b>gate fee</b> on every tonne of residual waste it accepts, contracted, often take-or-pay, under long municipal supply agreements, and sells the <b>electricity</b> it generates into the grid (and heat, where there is an offtake). The gate fee is the stable core; the power is the merchant swing. The asset is capital-heavy and long-life, so the return is a contracted processing annuity with a power kicker.',
    mb:{tag:'Model B · contracted EfW', title:'Energy-from-waste plant (UK / Europe)', body:'A plant that burns residual waste under long, contracted municipal gate-fee agreements (often take-or-pay) and sells the power it generates, earning a dual revenue against O&amp;M and ash disposal. Capital-heavy, long-life and contracted. <b>This is a UK / European EfW</b>, a Viridor / Covanta-style plant.'},
    s4a:'The dominant costs are <b>O&amp;M, ash disposal, flue-gas reagents and labour</b>, the cost of running a combustion plant hard and to strict emissions limits. Against a contracted gate fee plus merchant power, the margin is healthy; the swing factor is the power price and the plant\'s availability (EfW runs hard, near base-load).',
    wfNote:'Operating cost is plant O&amp;M, ash disposal, flue-gas reagents and labour. The margin is the gate fee (contracted) plus merchant power, less those costs, over a plant that runs near base-load at high availability.',
    s4b:'The capital is the plant itself, the tipping hall and bunker, the furnace/boiler, the turbine hall and the flue-gas cleaning, a long-life, capital-heavy civil and mechanical asset. A 600kt plant runs to hundreds of millions; the long municipal gate-fee contract is what makes that capital bankable, with the power as upside.',
    stackH:'The capital · the EfW plant', splitL:'Financing', splitR:'project-financed',
    split:[['s1',65,'Project / infrastructure debt'],['s2',35,'Sponsor equity']],
    finList:[['','Feedstock','residual (non-recyclable) waste'],['sub','Core revenue','gate fee (£/tonne, contracted)'],['','Swing revenue','merchant power'],['sub','Contract','long municipal, take-or-pay'],['','Build','capital-heavy, long-life'],['rest','Owner','EfW operator / infra fund']],
    finNote:'A UK / European EfW is a <b>contracted, capital-heavy processing asset with a power kicker</b>: a stable gate-fee core under long municipal contracts, plus merchant power. The risks are the power price, plant availability and the long-run recycling / decarbonisation debate around burning waste.',
    timeline:[['1990s','<b>Landfill tax</b> and EU rules push waste up the hierarchy toward EfW.'],['2000s','<b>PFI / long municipal contracts</b> underpin a wave of UK EfW build.'],['2010s','<b>Merchant power</b> exposure grows as contracts mature.'],['2020s','<b>CHP &amp; heat offtake</b> add a second energy stream where networks exist.'],['2020s','<b>Recycling debate</b> &amp; carbon pricing question EfW\'s long-run role.'],['Ongoing','<b>Carbon capture</b> trials aim to decarbonise the stack.']],
    calcNote:'A working model of a <b>contracted EfW plant</b>. Revenue is the gate fee per tonne (capacity × availability) plus merchant power from the energy generated; a floor models the take-or-pay municipal contract. Cost is O&amp;M, ash disposal and reagents. The build is capital-heavy and the hold long.',
    s6:'A UK / European EfW is a contracted processing asset with a power kicker. What drives it:',
    breakers:['<b>The gate fee</b>, contracted, often take-or-pay, the stable core of the revenue.','<b>The power price</b>, the merchant swing on top of the gate fee.','<b>Availability</b>, EfW runs hard, near base-load; uptime is throughput.','<b>The recycling / carbon debate</b>, the long-run question over burning waste.'],
    src:'Figures are illustrative for a UK / European energy-from-waste plant (operators such as <a href="https://www.viridor.co.uk/" target="_blank" rel="noopener">Viridor</a> and Covanta). All figures here are approximate and illustrative.',
    econ:{cur:'£', source:'residual waste',
      ktDef:600,ktMin:200,ktMax:1100,ktStep:25, gateDef:95,gateMin:55,gateMax:160,gateStep:1,
      availDef:90,availMin:70,availMax:96,availStep:1, powerPerTonne:35, procPerTonne:34, fixedOM:14},
    calc:{build:380,grant:0,capex:9,revG:2.5,floor:48,cap:300,tax:25,exit:10,lev:5,rd:5,amort:2,hold:15},
    map:{footer:GEO.ukefw.footer}
  },

  /* ---------- 2 · COVANTA (North America · US WtE operator) ---------- */
  covanta:{
    name:'Covanta', geo:'United States', continent:'North America', cur:'US$', geoKey:'covanta',
    lede:'The largest <b>waste-to-energy</b> operator in North America, a fleet of plants that take municipal residual waste under <b>tip-fee contracts</b>, generate power, and recover metals from the ash for an extra revenue stream.',
    s1:'<p class="body"><b>Covanta</b> (now part of Reworld) owns and operates a large fleet of <b>waste-to-energy</b> plants across the US, taking residual municipal solid waste from cities and counties, burning it to generate electricity, and diverting it from landfill. It is the scaled US incumbent in the sector, with long operating relationships with the communities it serves.</p>'+
       '<p class="body">The revenue is the classic dual stream, a <b>tip fee</b> (the US name for the gate fee) per tonne accepted, usually under long municipal contracts, plus the <b>power</b> sold, with a valuable third leg: <b>metals recovery</b>, extracting ferrous and non-ferrous metals from the ash to sell as scrap. A fleet operator spreads the capital and the contract book across many plants, smoothing the merchant power exposure of any one site.</p>',
    facts:[['Fleet','Scale','many US plants'],['Tip fee','Core revenue','per tonne, contracted'],['Power','Revenue','merchant export'],['Metals','Extra revenue','recovered from ash'],['Municipal','Customers','cities & counties'],['Reworld','Owner','EQT-backed']],
    s2:'Watch the plant. A <b>truck</b> tips municipal waste into the bunker; the <b>furnace</b> glows with the throughput; the <b>turbine</b> spins and the <b>switchyard</b> exports power. The contracted <b style="color:#0c8a57">tip fee</b> (green) is the core; merchant <b style="color:#c0902f">power</b> (amber) and recovered metals add to it, against O&amp;M draining out. Drag the capacity, the tip fee and the availability, and picture a whole fleet of these.',
    driverLab:'Tip fee', availLab:'Availability', hrK:'Tip fee + power', yrS:'tip fee + power',
    ledge:{a:'+ tip fee',b:'+ power',c:'− O&M'}, demandLabel:'THROUGHPUT',
    preset:'Load Covanta',
    try:'<b>Try this:</b> drop the <b>tip fee</b> and the revenue holds on the contracted floor, the municipal tip-fee contracts are the stable base. The power and the recovered <b>metals</b> are the swing on top. As a fleet operator, Covanta spreads the capital and the merchant exposure across many plants, push the capacity to see one plant\'s dual revenue scale.',
    s3:'Covanta earns a <b>tip fee</b> per tonne of waste accepted, long, contracted municipal agreements, plus the <b>power</b> it sells and the <b>metals</b> it recovers from the ash. The tip fee is the contracted core; power and metals are the swing. As a scaled fleet operator it spreads the capital and the merchant power exposure across many plants, making the aggregate cash flow steadier than any single site.',
    mb:{tag:'Model B · WtE fleet', title:'US waste-to-energy operator', body:'A scaled fleet of waste-to-energy plants taking municipal residual waste under long tip-fee contracts, selling power and recovering metals from the ash, against O&amp;M and ash disposal. Capital-heavy, contracted, diversified across plants. <b>This is Covanta</b>, now Reworld, EQT-backed.'},
    s4a:'The dominant costs are <b>O&amp;M, ash disposal, reagents and labour</b> across the fleet. Against contracted tip fees plus power and metals, the margin is healthy; metals recovery is a useful extra that partly offsets ash-disposal cost, and scale spreads the merchant power swing.',
    wfNote:'Operating cost is plant O&amp;M, ash disposal, reagents and labour across the fleet. The margin is the tip fee (contracted) plus merchant power and recovered metals, less those costs, diversified across many plants.',
    s4b:'The capital is the fleet of plants, each a tipping hall, furnace/boiler, turbine and flue-gas cleaning, a large, long-life capital base. A fleet spreads that capital and the contract book, so the platform is bankable on long municipal tip-fee contracts with power and metals as upside.',
    stackH:'The capital · the plant fleet', splitL:'Financing', splitR:'sponsor-backed',
    split:[['s1',60,'Corporate / project debt'],['s2',40,'EQT / Reworld equity']],
    finList:[['','Scale','large US fleet'],['sub','Core revenue','tip fee (per tonne, contracted)'],['','Swing revenue','power + recovered metals'],['sub','Customers','cities & counties'],['','Build','capital-heavy, long-life'],['rest','Owner','Reworld (EQT-backed)']],
    finNote:'Covanta is a <b>scaled, contracted WtE fleet</b>: long municipal tip-fee contracts as the core, plus merchant power and metals recovery, diversified across many plants. The risks are the power price, plant availability and the long-run recycling / carbon debate.',
    timeline:[['1980s','<b>US WtE build-out</b> under municipal tip-fee contracts.'],['2000s','<b>Covanta</b> consolidates into the leading US operator.'],['2010s','<b>Metals recovery</b> scaled as a third revenue stream.'],['2021','<b>EQT acquires</b> Covanta, taking it private.'],['2023','<b>Rebranded Reworld</b>, broadening into materials management.'],['Ongoing','<b>Decarbonisation &amp; capture</b> studied across the fleet.']],
    calcNote:'A working model of a <b>US waste-to-energy operator</b>, on a per-plant basis. Revenue is the tip fee per tonne plus merchant power (and recovered metals); a floor models the contracted municipal tip fee. Cost is O&amp;M, ash disposal and reagents. The build is capital-heavy.',
    s6:'Covanta is a scaled, contracted WtE fleet. What drives it:',
    breakers:['<b>The tip fee</b>, contracted municipal agreements, the stable core.','<b>Power &amp; metals</b>, the merchant swing and the ash-recovery kicker.','<b>Fleet scale</b>, diversifies the capital and the merchant power exposure.','<b>The recycling / carbon debate</b>, the long-run question over WtE.'],
    src:'Figures are illustrative for a US waste-to-energy operator (<a href="https://www.reworldwaste.com/" target="_blank" rel="noopener">Covanta / Reworld</a>). As a private business, all figures here are approximate and illustrative.',
    econ:{cur:'US$', source:'municipal waste',
      ktDef:550,ktMin:200,ktMax:1000,ktStep:25, gateDef:70,gateMin:40,gateMax:130,gateStep:1,
      availDef:91,availMin:72,availMax:96,availStep:1, powerPerTonne:38, procPerTonne:30, fixedOM:13},
    calc:{build:265,grant:0,capex:9,revG:2.5,floor:42,cap:280,tax:25,exit:10,lev:5,rd:5.5,amort:2,hold:15},
    map:{footer:GEO.covanta.footer}
  },

  /* ---------- 3 · BRAZILIAN / LatAm WtE (South America · emerging) ---------- */
  brazilwte:{
    name:'Brazilian / Latin American WtE', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'brazilwte',
    lede:'Waste-to-energy is <b>nascent in Latin America</b>, but with vast cities still landfilling, the first <b>EfW plants</b> are emerging, earning a gate fee on residual waste and selling the power, priced at emerging-market rates.',
    s1:'<p class="body">Most of Latin America still sends its municipal waste to landfill, but the largest cities are reaching the limits of that model. <b>Energy-from-waste</b> is the emerging alternative: burn the residual, non-recyclable waste to recover energy and divert it from overflowing landfills. Brazil and its neighbours are an <b>early-stage</b> market, with the first plants now being developed under municipal concessions.</p>'+
       '<p class="body">The model is the same dual-revenue one, a <b>gate fee</b> per tonne of waste accepted, under a long municipal concession, plus the <b>power</b> sold into the grid (often supported by a clean-energy auction or incentive). The cash flow is contracted and indexed, but it is priced and discounted at <b>emerging-market</b> rates: local currency, local cost of capital, and the execution risk of a young market.</p>',
    facts:[['Residual waste','Feedstock','non-recyclable'],['Nascent','Market','early-stage LatAm'],['Gate fee','Core revenue','R$/tonne, concession'],['Power','Revenue','+ clean-energy auction'],['Concession','Structure','long municipal'],['EM rate','Discount','local currency']],
    s2:'Watch the plant. A <b>truck</b> tips residual waste into the bunker; the <b>furnace</b> glows with the throughput; the <b>turbine</b> spins and the <b>switchyard</b> exports power. The contracted <b style="color:#0c8a57">gate fee</b> (green) is the core; merchant <b style="color:#c0902f">power</b> (amber) is the swing, against O&amp;M draining out. Drag the capacity, the gate fee and the availability, a contracted concession at an EM discount rate.',
    driverLab:'Gate fee', availLab:'Availability', hrK:'Gate + power', yrS:'gate fee + power',
    ledge:{a:'+ gate fee',b:'+ power',c:'− O&M'}, demandLabel:'THROUGHPUT',
    preset:'Load Brazil WtE',
    try:'<b>Try this:</b> the gate fee is set under a long <b>municipal concession</b>, so dropping the slider holds on the contracted floor. But the whole return is at an <b>EM discount rate</b>, raise the cost of debt and watch a solid contracted return net down once discounted like a Latin American asset. The market is young: growth upside, execution risk.',
    s3:'A Latin American EfW earns a <b>gate fee</b> per tonne of residual waste under a long municipal concession, plus the <b>power</b> it sells (often via a clean-energy auction). The gate fee is the contracted core; the power is the swing. The cash flow is contracted and indexed, but the investor question is less the asset than the <b>discount rate</b>, local currency and rates, and the pace at which a nascent market develops.',
    mb:{tag:'Model B · EM concession', title:'Latin American EfW (emerging)', body:'A first-of-its-kind plant burning residual waste under a long municipal gate-fee concession, selling power into the grid, in an early-stage but growing market, priced at emerging-market rates. <b>This is waste-to-energy in Latin America</b> (e.g. Brazil).'},
    s4a:'The dominant costs are <b>O&amp;M, ash disposal, reagents and labour</b>. Against a contracted gate fee plus power, the margin is healthy, but the return is carried at an <b>EM discount rate</b>, so a solid contracted cash flow nets down once discounted like a Latin American asset. Execution and market development are the real risks.',
    wfNote:'Operating cost is plant O&amp;M, ash disposal, reagents and labour. The margin is the gate fee (contracted concession) plus merchant power, less those costs, carried against local rates and currency.',
    s4b:'The capital is the plant, tipping hall, furnace/boiler, turbine and flue-gas cleaning, capital-heavy and long-life. Modelled on an enterprise-value basis, the return is a <b>contracted, indexed</b> one in a developing market, carried against local rates and currency, with growth as the market matures.',
    stackH:'The capital · the EfW plant', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local / project debt'],['s2',45,'Sponsor equity']],
    finList:[['','Feedstock','residual waste'],['sub','Market','nascent LatAm'],['','Core revenue','gate fee (concession)'],['sub','Swing revenue','power + clean-energy auction'],['','Structure','long municipal concession'],['rest','Discount','emerging-market rate']],
    finNote:'A Latin American EfW is a <b>contracted processing asset at an EM discount rate</b>: a gate-fee concession plus merchant power, in a developing market. The whole investment debate is the <b>discount rate</b>, the currency and the pace of market growth.',
    timeline:[['2010s','<b>Landfill pressure</b> in big LatAm cities builds the case for EfW.'],['2020s','<b>First concessions</b> tendered for energy-from-waste plants.'],['2020s','<b>Clean-energy auctions</b> support the power offtake.'],['2020s','<b>First plants</b> reach financial close and construction.'],['Periodic','<b>Indexed gate fees</b> reset under the concession.'],['Long-term','<b>Market growth</b> as cities move off landfill.']],
    calcNote:'A working model of an <b>EM energy-from-waste concession</b>, on an enterprise-value basis. Revenue is the gate fee per tonne plus merchant power; a floor models the contracted concession. The cost of debt is high to reflect EM rates, netting a solid contracted return down once discounted.',
    s6:'LatAm WtE is a contracted processing asset at an EM rate. What drives it:',
    breakers:['<b>The gate fee</b>, set under a long municipal concession, the contracted core.','<b>Country &amp; currency</b>, local rates and the currency set the discount rate.','<b>Power &amp; auctions</b>, the merchant swing, often auction-supported.','<b>Market development</b>, a nascent market means growth upside and execution risk.'],
    src:'Figures are illustrative for an emerging-market energy-from-waste concession in Latin America (e.g. Brazil). WtE is nascent in the region; all figures here are approximate and illustrative (flag illustrative).',
    econ:{cur:'R$', source:'residual waste',
      ktDef:400,ktMin:150,ktMax:800,ktStep:25, gateDef:130,gateMin:70,gateMax:220,gateStep:2,
      availDef:88,availMin:68,availMax:94,availStep:1, powerPerTonne:55, procPerTonne:50, fixedOM:18},
    calc:{build:330,grant:60,capex:9,revG:4,floor:50,cap:320,tax:34,exit:9,lev:4,rd:9,amort:2,hold:14},
    map:{footer:GEO.brazilwte.footer}
  },

  /* ---------- 4 · KWINANA / AVERTAS (Oceania · Australia first big EfW) ---------- */
  kwinana:{
    name:'Kwinana / Avertas Energy', geo:'Western Australia', continent:'Oceania', cur:'A$', geoKey:'kwinana',
    lede:"Australia's first large-scale <b>energy-from-waste</b> plant, Kwinana, near Perth, diverting Perth's residual waste from landfill under <b>long council contracts</b> and exporting power to the grid.",
    s1:'<p class="body">Australia has historically landfilled most of its waste, but that is changing. <b>Kwinana</b>, near Perth in Western Australia, is the country\'s first large-scale <b>energy-from-waste</b> plant (developed by Avertas Energy / Macquarie and partners): it takes residual municipal waste that would otherwise go to landfill, burns it to generate electricity, and exports the power to the grid.</p>'+
       '<p class="body">The model is the dual-revenue EfW one, a <b>gate fee</b> per tonne under <b>long council waste-supply contracts</b> (the stable, contracted core), plus the <b>power</b> sold into the WA grid. Long council agreements underpin the throughput, making the gate-fee revenue durable; the power is the merchant swing. As a first-of-its-kind asset in a new market, it is a template for Australian EfW.</p>',
    facts:[['Residual waste','Feedstock','Perth municipal'],['First big EfW','Status',"Australia's first"],['Gate fee','Core revenue','long council contracts'],['Power','Revenue','WA grid export'],['Council','Customers','long waste supply'],['Macquarie','Backer','Avertas Energy']],
    s2:'Watch the plant. A <b>truck</b> tips Perth\'s residual waste into the bunker; the <b>furnace</b> glows with the throughput; the <b>turbine</b> spins and the <b>switchyard</b> exports power to the WA grid. The contracted <b style="color:#0c8a57">gate fee</b> (green) under long council contracts is the core; merchant <b style="color:#c0902f">power</b> (amber) is the swing, against O&amp;M draining out. Drag the capacity, the gate fee and the availability.',
    driverLab:'Gate fee', availLab:'Availability', hrK:'Gate + power', yrS:'gate fee + power',
    ledge:{a:'+ gate fee',b:'+ power',c:'− O&M'}, demandLabel:'THROUGHPUT',
    preset:'Load Kwinana',
    try:'<b>Try this:</b> the throughput is underpinned by <b>long council waste-supply contracts</b>, so dropping the gate fee holds on the contracted floor, the council-contract story. The power is the merchant swing. As Australia\'s first big EfW, it is the template; push the capacity to see one plant\'s dual revenue in a new market.',
    s3:'Kwinana earns a <b>gate fee</b> per tonne of Perth\'s residual waste under <b>long council waste-supply contracts</b>, plus the <b>power</b> it sells into the WA grid. The council contracts make the gate-fee throughput durable, the contracted core, while the power is the merchant swing. As Australia\'s first large EfW it is capital-heavy and long-life, and a template for further Australian plants.',
    mb:{tag:'Model B · contracted EfW', title:'Australian energy-from-waste (Kwinana)', body:"Australia's first large EfW, burning Perth's residual waste under long council waste-supply contracts and exporting power to the WA grid, against O&amp;M and ash disposal. Capital-heavy, contracted, first-of-its-kind. <b>This is Kwinana / Avertas Energy</b>, Macquarie-backed.",},
    s4a:'The dominant costs are <b>O&amp;M, ash disposal, reagents and labour</b>. Against a gate fee under long council contracts plus power, the margin is healthy; the council contracts make the throughput and gate-fee revenue durable, with the power price as the swing factor.',
    wfNote:'Operating cost is plant O&amp;M, ash disposal, reagents and labour. The margin is the gate fee (long council contracts) plus merchant power, less those costs, over a plant running near base-load.',
    s4b:'The capital is the plant, tipping hall, furnace/boiler, turbine and flue-gas cleaning, capital-heavy and long-life, funded at development behind long council contracts. The return is a contracted processing annuity with a power kicker; as the first of its kind it opens a pipeline of further Australian EfW.',
    stackH:'The capital · the EfW plant', splitL:'Financing', splitR:'project-financed',
    split:[['s1',60,'Project / infrastructure debt'],['s2',40,'Macquarie / Avertas equity']],
    finList:[['','Feedstock','Perth residual waste'],['sub','Status',"Australia's first big EfW"],['','Core revenue','gate fee (long council contracts)'],['sub','Swing revenue','power (WA grid)'],['','Build','capital-heavy, long-life'],['rest','Backer','Macquarie / Avertas']],
    finNote:'Kwinana is a <b>first-of-its-kind contracted EfW</b>: a gate fee under long council waste-supply contracts as the core, plus merchant power. The risks are the power price, plant availability and the recycling / carbon debate, but the council contracts make the throughput durable.',
    timeline:[['2018','<b>Kwinana EfW</b> reaches financial close, Australia\'s first big plant.'],['2010s','<b>Long council contracts</b> underpin the waste supply.'],['2022','<b>Commissioning</b> begins at the plant.'],['2020s','<b>Power export</b> to the WA grid ramps up.'],['2020s','<b>Template effect</b>, further Australian EfW developed.'],['Ongoing','<b>Recycling &amp; carbon</b> debate shapes the long-run role.']],
    calcNote:'A working model of an <b>Australian energy-from-waste plant</b>. Revenue is the gate fee per tonne under long council contracts plus merchant power; a floor models the contracted council supply. Cost is O&amp;M, ash disposal and reagents. The build is capital-heavy.',
    s6:'Kwinana is Australia\'s first big EfW, contracted, capital-heavy. What drives it:',
    breakers:['<b>Long council contracts</b>, the contracted gate-fee core and durable throughput.','<b>The power price</b>, the merchant swing into the WA grid.','<b>Availability</b>, EfW runs near base-load; uptime is throughput.','<b>The recycling / carbon debate</b>, the long-run question over burning waste.'],
    src:'Figures are illustrative for the Kwinana / Avertas Energy energy-from-waste plant in Western Australia (Macquarie-backed). All figures here are approximate and illustrative.',
    econ:{cur:'A$', source:'residual waste',
      ktDef:400,ktMin:150,ktMax:700,ktStep:25, gateDef:120,gateMin:70,gateMax:200,gateStep:2,
      availDef:90,availMin:70,availMax:95,availStep:1, powerPerTonne:48, procPerTonne:46, fixedOM:16},
    calc:{build:300,grant:23,capex:9,revG:2.5,floor:46,cap:300,tax:30,exit:10,lev:5,rd:6,amort:2,hold:15},
    map:{footer:GEO.kwinana.footer}
  },

  /* ---------- 5 · WARSAN / DUBAI (Middle East · flagship mega-plant) ---------- */
  warsan:{
    name:'Warsan waste-to-energy (Dubai)', geo:'Dubai, UAE', continent:'Middle East', cur:'AED', geoKey:'warsan',
    lede:"One of the world's largest <b>energy-from-waste</b> plants, Warsan in Dubai, a flagship mega-facility burning the emirate's residual waste at vast scale and exporting power to the grid.",
    s1:'<p class="body"><b>Warsan</b>, in Dubai, is one of the world\'s largest <b>energy-from-waste</b> facilities, a flagship mega-plant built to take a huge share of the emirate\'s municipal residual waste, burn it to generate electricity, and divert it from landfill at vast scale. It is a statement asset: very large lines, very high throughput, and a centrepiece of Dubai\'s waste and clean-energy strategy.</p>'+
       '<p class="body">The model is the dual-revenue EfW one at flagship scale, a <b>gate fee</b> per tonne of waste accepted, under a long government-backed supply arrangement (the contracted core), plus the <b>power</b> exported to the grid. The sheer throughput means even a moderate gate fee and power price produce a very large absolute cash flow; the capital is correspondingly enormous, and the contract is what makes it bankable.</p>',
    facts:[['Flagship','Scale',"world's largest class"],['Residual waste','Feedstock','Dubai municipal'],['Gate fee','Core revenue','government-backed'],['Power','Revenue','grid export'],['Mega-plant','Build','vast capital'],['Statement','Driver','clean-energy strategy']],
    s2:'Watch the plant. A <b>truck</b> tips Dubai\'s residual waste into the bunker; the <b>furnace</b> glows with the throughput; the <b>turbine</b> spins and the <b>switchyard</b> exports power. At flagship scale the contracted <b style="color:#0c8a57">gate fee</b> (green) and merchant <b style="color:#c0902f">power</b> (amber) are vast in absolute terms, against O&amp;M draining out. Drag the capacity, the gate fee and the availability, and picture one of the world\'s largest plants.',
    driverLab:'Gate fee', availLab:'Availability', hrK:'Gate + power', yrS:'gate fee + power',
    ledge:{a:'+ gate fee',b:'+ power',c:'− O&M'}, demandLabel:'THROUGHPUT',
    preset:'Load Warsan',
    try:'<b>Try this:</b> push the <b>capacity</b>, at flagship scale, even a moderate gate fee and power price produce an enormous absolute cash flow. The gate fee is government-backed, so dropping the slider holds on the contracted floor. The trade is the vast capital against a very large, contracted, dual-revenue throughput.',
    s3:'Warsan earns a <b>gate fee</b> per tonne of Dubai\'s residual waste under a long government-backed supply arrangement, plus the <b>power</b> it exports to the grid, at one of the largest scales in the world. The gate fee is the contracted core; the power is the swing. The throughput is so large that even moderate prices produce a vast absolute cash flow, against an enormous but bankable capital cost.',
    mb:{tag:'Model B · flagship EfW', title:'Flagship energy-from-waste (Warsan)', body:"One of the world's largest EfW plants, burning Dubai's residual waste at vast scale under a government-backed gate-fee arrangement and exporting power, against O&amp;M and ash disposal. Enormous capital, flagship throughput, contracted. <b>This is Warsan</b>, Dubai.",},
    s4a:'The dominant costs are <b>O&amp;M, ash disposal, reagents and labour</b> at a very large plant. Against a government-backed gate fee plus power, the margin is healthy, and the sheer throughput makes the absolute EBITDA very large; the power price is the swing factor on top of the contracted core.',
    wfNote:'Operating cost is plant O&amp;M, ash disposal, reagents and labour at flagship scale. The margin is the gate fee (government-backed) plus merchant power, less those costs, over a very large, near-base-load throughput.',
    s4b:'The capital is the mega-plant, very large tipping hall and bunker, multiple furnace lines, turbine halls and flue-gas cleaning, an enormous, long-life asset. It is financed against a long government-backed gate-fee arrangement, which is what makes capital of this size bankable, with the power as upside.',
    stackH:'The capital · the mega-plant', splitL:'Financing', splitR:'government-backed',
    split:[['s1',65,'Project / sovereign-backed debt'],['s2',35,'Sponsor equity']],
    finList:[['','Scale',"one of world's largest"],['sub','Feedstock','Dubai residual waste'],['','Core revenue','gate fee (government-backed)'],['sub','Swing revenue','power (grid export)'],['','Build','vast capital, long-life'],['rest','Driver','clean-energy strategy']],
    finNote:'Warsan is a <b>flagship, contracted EfW at vast scale</b>: a government-backed gate-fee core plus merchant power, on enormous throughput. The risks are the power price, availability and the long-run carbon debate, but the scale and the government backing make the cash flow very large and bankable.',
    timeline:[['2019','<b>Warsan EfW</b> begins construction in Dubai.'],['2020s','<b>Among the largest</b> EfW facilities in the world by capacity.'],['2020s','<b>Commissioning</b> of the multiple combustion lines.'],['2020s','<b>Power export</b> to the Dubai grid ramps up.'],['2020s','<b>Landfill diversion</b> at a large share of the emirate\'s waste.'],['Ongoing','<b>Clean-energy strategy</b> centrepiece for Dubai.']],
    calcNote:'A working model of a <b>flagship energy-from-waste plant</b>. Revenue is the gate fee per tonne (very large throughput) plus merchant power; a floor models the government-backed supply arrangement. Cost is O&amp;M, ash disposal and reagents. The build is enormous and the hold long.',
    s6:'Warsan is a flagship, contracted EfW at vast scale. What drives it:',
    breakers:['<b>Scale</b>, flagship throughput makes the absolute cash flow vast.','<b>The gate fee</b>, government-backed, the contracted core.','<b>The power price</b>, the merchant swing on top.','<b>Availability &amp; carbon</b>, uptime is throughput; the carbon debate is the long-run question.'],
    src:'Figures are illustrative for the Warsan energy-from-waste plant in Dubai, one of the world\'s largest EfW facilities. All figures here are approximate and illustrative.',
    econ:{cur:'AED', source:'residual waste',
      ktDef:1900,ktMin:800,ktMax:2700,ktStep:50, gateDef:280,gateMin:150,gateMax:450,gateStep:5,
      availDef:91,availMin:72,availMax:96,availStep:1, powerPerTonne:130, procPerTonne:120, fixedOM:60},
    calc:{build:4450,grant:0,capex:9,revG:2.5,floor:380,cap:2400,tax:0,exit:10,lev:6,rd:5,amort:2,hold:11},
    map:{footer:GEO.warsan.footer}
  },

  /* ---------- 6 · CHINA EVERBRIGHT-STYLE WtE (China · vast fleet) ---------- */
  chinawte:{
    name:'China Everbright-style WtE', geo:'China', continent:'China', cur:'¥', geoKey:'chinawte',
    lede:'Waste-to-energy at <b>continental scale</b>, China has built the world\'s largest <b>EfW fleet</b>, burning the residual waste of hundreds of cities under gate fees and power-tariff subsidies, in a vast, fast-growing platform.',
    s1:'<p class="body">China has built the world\'s largest fleet of <b>energy-from-waste</b> plants in barely two decades, driven by rapid urbanisation and a policy push off landfill. Operators such as <b>China Everbright Environment</b> own hundreds of WtE plants across the country, each taking a city\'s residual municipal waste, burning it to generate electricity, and diverting it from overflowing landfills. The scale is enormous and still growing.</p>'+
       '<p class="body">The revenue is the dual EfW stream with a Chinese twist, a <b>gate fee</b> per tonne of waste accepted under long municipal concessions, plus the <b>power</b> sold, the latter supported by a <b>renewable power-tariff subsidy</b>. A modest gate fee and subsidised power tariff, applied across hundreds of plants and a colossal waste stream, make a vast and growing cash flow, though the subsidy regime and the recycling agenda are the watch items.</p>',
    facts:[['Vast fleet','Scale',"world's largest"],['Residual waste','Feedstock','city municipal'],['Gate fee','Core revenue','municipal concession'],['Power','Revenue','+ tariff subsidy'],['Everbright','Operator','China Everbright Env.'],['Growing','Driver','urbanisation']],
    s2:'Watch the plant. A <b>truck</b> tips a city\'s residual waste into the bunker; the <b>furnace</b> glows with the throughput; the <b>turbine</b> spins and the <b>switchyard</b> exports power. The contracted <b style="color:#0c8a57">gate fee</b> (green) plus subsidised <b style="color:#c0902f">power</b> (amber) are the dual revenue, against O&amp;M draining out. Drag the capacity, the gate fee and the availability, and multiply by hundreds of plants.',
    driverLab:'Gate fee', availLab:'Availability', hrK:'Gate + power', yrS:'gate fee + power',
    ledge:{a:'+ gate fee',b:'+ power',c:'− O&M'}, demandLabel:'THROUGHPUT',
    preset:'Load China WtE',
    try:'<b>Try this:</b> push the <b>capacity</b>, across a fleet of hundreds of plants, even a modest gate fee and subsidised power tariff make a vast absolute cash flow. The gate fee is set under municipal concessions, so dropping the slider holds on the contracted floor. The subsidy regime and the recycling agenda are the watch items.',
    s3:'A China Everbright-style WtE earns a <b>gate fee</b> per tonne of a city\'s residual waste under a long municipal concession, plus the <b>power</b> it sells, supported by a renewable power-tariff <b>subsidy</b>. The gate fee is the contracted core; the subsidised power is the swing. The lever is scale: a modest gate fee and tariff across hundreds of plants and a colossal waste stream is a vast, growing cash flow.',
    mb:{tag:'Model B · WtE at scale', title:'China waste-to-energy fleet', body:'A vast fleet of EfW plants burning hundreds of cities\' residual waste under municipal gate-fee concessions and selling subsidised power, against O&amp;M and ash disposal, at colossal, growing scale. <b>This is China Everbright-style WtE</b>.'},
    s4a:'The dominant costs are <b>O&amp;M, ash disposal, reagents and labour</b> across a vast fleet. Against a modest gate fee plus subsidised power, the per-plant margin is healthy and the absolute cash flow is vast given the scale; the watch item is the <b>power-tariff subsidy</b> and how it evolves.',
    wfNote:'Operating cost is plant O&amp;M, ash disposal, reagents and labour across the fleet. The margin is the gate fee (municipal concession) plus subsidised power, less those costs, modest per tonne but vast in aggregate across hundreds of plants.',
    s4b:'The capital is the fleet of plants, hundreds of tipping halls, furnaces, turbines and flue-gas cleaning systems, a colossal, long-life capital base built at a low cost of capital. Growth comes from new city concessions; the subsidy regime and the recycling agenda shape the forward economics.',
    stackH:'The capital · the WtE fleet', splitL:'Financing', splitR:'state-linked',
    split:[['s1',60,'Bank / state-linked debt'],['s2',40,'Listed / state equity']],
    finList:[['','Scale',"world's largest fleet"],['sub','Feedstock','city residual waste'],['','Core revenue','gate fee (municipal concession)'],['sub','Swing revenue','power + tariff subsidy'],['','Cost of capital','low (state-linked)'],['rest','Driver','urbanisation + landfill diversion']],
    finNote:'A China Everbright-style WtE is a <b>vast, contracted, subsidised fleet</b>: a modest gate-fee core under municipal concessions, plus subsidised power, at colossal scale and low cost of capital. The risks are the subsidy regime, the recycling agenda and the pace of new concessions.',
    timeline:[['2000s','<b>WtE build-out</b> begins as China urbanises off landfill.'],['2010s','<b>China Everbright</b> and peers scale to hundreds of plants.'],['2010s','<b>Renewable tariff subsidy</b> supports the power offtake.'],['2020s','<b>Subsidy reform</b> tightens the power-tariff support.'],['2020s','<b>World\'s largest</b> EfW fleet by capacity.'],['Ongoing','<b>Recycling &amp; circular-economy</b> agenda shapes the role.']],
    calcNote:'A working model of a <b>China waste-to-energy plant</b>, on an enterprise-value basis. Revenue is the gate fee per tonne plus subsidised power; a floor models the municipal concession. Cost is O&amp;M, ash disposal and reagents. The cost of capital is low; figures are highly illustrative.',
    s6:'China WtE is a vast, contracted, subsidised fleet. What drives it:',
    breakers:['<b>Scale</b>, a modest gate fee and tariff across hundreds of plants is the model.','<b>The gate fee</b>, set under municipal concessions, the contracted core.','<b>The power-tariff subsidy</b>, the swing, and the key reform watch item.','<b>Cost of capital</b>, low, state-linked funding supports the vast build.'],
    src:'Figures are illustrative for a China Everbright-style waste-to-energy plant within the world\'s largest WtE fleet. Given the scale and limited per-plant disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', source:'residual waste',
      ktDef:700,ktMin:250,ktMax:1400,ktStep:50, gateDef:90,gateMin:50,gateMax:180,gateStep:2,
      availDef:91,availMin:72,availMax:96,availStep:1, powerPerTonne:135, procPerTonne:70, fixedOM:28},
    calc:{build:820,grant:120,capex:9,revG:3,floor:95,cap:600,tax:25,exit:10,lev:5,rd:4,amort:2,hold:13},
    map:{footer:GEO.chinawte.footer}
  }
  };
  var ORDER=['ukefw','covanta','brazilwte','kwinana','warsan','chinawte'];

  /* ===================================================================
     ENERGY-FROM-WASTE PLANT RENDERER  (canvas, 720x520), elevation, daytime
     A tipping hall takes residual waste from a truck into a bunker, a furnace /
     boiler burns it (warm glow scaling with throughput), a turbine hall makes
     power, and a switchyard exports it over the grid (cyan pulses with
     throughput). A tall stack emits a slow steam plume.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  /* key scene anchors (elevation, ground at GROUND) */
  var GROUND=430;
  var TIP={x:150,y:300};            // tipping hall (truck tips here)
  var BUNK={x:255,y:330};           // bunker
  var FURN={x:340,y:300};           // furnace / boiler
  var STACK={x:430,y:130};          // stack base near top
  var TURB={x:480,y:330};           // turbine hall
  var YARD={x:618,y:320};           // switchyard
  var EXPORTX=700;                  // export line leaves right

  /* ---- base map: sky + ground ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#dfe8e0'); g.addColorStop(0.62,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // distant haze band
    ctx.fillStyle='rgba(150,180,140,0.10)'; rr(0,GROUND-6,W,200,0); ctx.fill();
    // ground
    var gg=ctx.createLinearGradient(0,GROUND,0,H); gg.addColorStop(0,'#cdd6c6'); gg.addColorStop(1,'#c2ccb9');
    ctx.fillStyle=gg; ctx.fillRect(0,GROUND,W,H-GROUND);
    // access apron / road in front of the tipping hall
    ctx.strokeStyle='#c6cbc1'; ctx.lineWidth=14; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,GROUND+34); ctx.lineTo(W,GROUND+34); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.4; ctx.setLineDash([8,10]); ctx.lineDashOffset=-(T*0.6);
    ctx.beginPath(); ctx.moveTo(0,GROUND+34); ctx.lineTo(W,GROUND+34); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- the main industrial building (boiler / turbine halls) ---- */
  function plantHall(throughput){
    // big boiler hall (tall, behind the furnace)
    var g=ctx.createLinearGradient(0,150,0,GROUND); g.addColorStop(0,'#c2c8c0'); g.addColorStop(1,'#a7aea6');
    ctx.fillStyle=g; rr(300,180,150,GROUND-180,4); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // turbine hall (lower, to the right)
    var g2=ctx.createLinearGradient(0,250,0,GROUND); g2.addColorStop(0,'#c8cec6'); g2.addColorStop(1,'#aeb5ad');
    ctx.fillStyle=g2; rr(452,252,118,GROUND-252,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.45)'; ctx.stroke();
    // tipping hall (left, where the truck tips)
    var g3=ctx.createLinearGradient(0,240,0,GROUND); g3.addColorStop(0,'#ccd2ca'); g3.addColorStop(1,'#b2b9b1');
    ctx.fillStyle=g3; rr(96,240,150,GROUND-240,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.45)'; ctx.stroke();
    // tipping-hall door
    ctx.fillStyle='rgba(70,82,76,0.5)'; rr(108,GROUND-66,40,66,2); ctx.fill();
    // roof ribs (boiler hall)
    ctx.strokeStyle='rgba(120,130,120,0.35)'; ctx.lineWidth=1;
    for(var rx=312;rx<446;rx+=16){ ctx.beginPath(); ctx.moveTo(rx,182); ctx.lineTo(rx,GROUND-2); ctx.stroke(); }
    // window strips on turbine hall
    for(var wy=270;wy<GROUND-20;wy+=22){ ctx.fillStyle='rgba(150,170,175,0.5)'; rr(462,wy,98,9,2); ctx.fill(); }
    // labels
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('TIPPING HALL',171,GROUND-8);
    ctx.fillText('BOILER',375,196); ctx.fillText('TURBINE HALL',511,266);
  }

  /* ---- the furnace / boiler with a warm internal glow scaling with throughput ---- */
  function furnace(thru){
    var x=FURN.x,y=FURN.y;
    // furnace opening (dark)
    ctx.fillStyle='rgba(40,30,25,0.9)'; rr(x-22,y-30,44,80,3); ctx.fill();
    // grate
    ctx.strokeStyle='rgba(20,15,12,0.6)'; ctx.lineWidth=1;
    for(var gy=y-20;gy<y+44;gy+=10){ ctx.beginPath(); ctx.moveTo(x-20,gy); ctx.lineTo(x+20,gy); ctx.stroke(); }
    // warm combustion glow, intensity with throughput
    glow(x,y+10, 24+34*thru, 'rgba(255,120,40,'+(0.45+0.45*thru)+')');
    glow(x,y+18, 14+18*thru, 'rgba(255,200,90,'+(0.4+0.5*thru)+')');
    // flickering ember licks
    for(var i=0;i<4;i++){ var t=((T*0.05+i/4)%1); ctx.globalAlpha=(1-t)*0.5*thru; ctx.fillStyle='rgba(255,170,70,0.8)';
      ctx.beginPath(); ctx.arc(x-12+i*8,y+20-t*30,2+t*3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
  }

  /* ---- the bunker (waste pile) ---- */
  function bunker(fill){
    var x=BUNK.x,y=BUNK.y;
    ctx.fillStyle='rgba(60,55,45,0.5)'; rr(x-44,y-20,88,90,3); ctx.fill();
    // waste heap, height with fill
    var hh=12+44*fill;
    ctx.fillStyle='#7d7460'; ctx.beginPath(); ctx.moveTo(x-40,y+66);
    ctx.lineTo(x-26,y+66-hh*0.8); ctx.lineTo(x-6,y+66-hh); ctx.lineTo(x+16,y+66-hh*0.7); ctx.lineTo(x+38,y+66-hh*0.5); ctx.lineTo(x+40,y+66); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(120,110,90,0.6)'; ctx.beginPath(); ctx.moveTo(x-26,y+66-hh*0.8); ctx.lineTo(x-6,y+66-hh); ctx.lineTo(x+4,y+66-hh*0.85); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('BUNKER',x,y+82);
  }

  /* ---- the waste truck (tips into the tipping hall) ---- */
  function truck(thru){
    // truck drives in on a slow cycle, then tips
    var cyc=(T*0.006)%1; var tx;
    if(cyc<0.5){ tx=-60+ (TIP.x-60-(-60))*(cyc/0.5); } else { tx=TIP.x-60; }
    var y=GROUND-20, tipping=cyc>=0.5;
    ctx.save();
    // shadow
    ctx.fillStyle='rgba(30,40,30,0.14)'; ctx.beginPath(); ctx.ellipse(tx+18,y+12,30,4,0,0,Math.PI*2); ctx.fill();
    // cab
    ctx.fillStyle='#5b7d6a'; rr(tx,y-14,16,18,2); ctx.fill();
    // bed (tilts up when tipping)
    ctx.save(); ctx.translate(tx+18,y+2);
    if(tipping){ ctx.rotate(-0.35-0.12*Math.sin(T*0.1)); }
    ctx.fillStyle='#8a8f87'; rr(0,-16,40,16,2); ctx.fill();
    if(tipping){ // waste spilling out the back
      for(var i=0;i<4;i++){ ctx.fillStyle='rgba(125,116,96,'+(0.8-i*0.15)+')'; ctx.beginPath(); ctx.arc(40+i*4,-2+i*3,2.2,0,Math.PI*2); ctx.fill(); } }
    ctx.restore();
    // wheels
    ctx.fillStyle='#3a3a3a'; ctx.beginPath(); ctx.arc(tx+6,y+4,4,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(tx+30,y+4,4,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  /* ---- the stack / chimney with a slow steam / flue plume ---- */
  function stack(thru){
    var x=STACK.x;
    // stack body
    var g=ctx.createLinearGradient(x-12,0,x+12,0); g.addColorStop(0,'#c4cac2'); g.addColorStop(1,'#a9b0a8');
    ctx.fillStyle=g; rr(x-11,STACK.y,22,GROUND-STACK.y,2); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // banding
    ctx.fillStyle='rgba(200,90,70,0.55)'; rr(x-11,STACK.y+10,22,6,1); ctx.fill();
    // slow steam / flue plume rising and drifting, density with throughput
    for(var i=0;i<7;i++){ var t=((T*0.012+i/7)%1);
      var py=STACK.y - t*78, drift=Math.sin(T*0.02+i)*8*t + 6*t;
      var r=4+t*16; ctx.globalAlpha=(1-t)*(0.32+0.22*thru);
      ctx.fillStyle='rgba(232,236,232,0.95)'; ctx.beginPath(); ctx.arc(x+drift,py,r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
    ctx.fillStyle='rgba(70,90,80,0.75)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('STACK',x,STACK.y-6);
  }

  /* ---- switchyard + export line (cyan pulses with throughput) ---- */
  function switchyard(){
    var x=YARD.x,y=YARD.y;
    // transformer block
    ctx.fillStyle='#b3bab2'; rr(x-26,y-18,52,40,3); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // bushings
    for(var i=0;i<3;i++){ ctx.fillStyle='#9aa19a'; rr(x-18+i*16,y-30,6,14,1); ctx.fill(); }
    // pylon to the right
    ctx.strokeStyle='rgba(90,100,95,0.8)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x+40,y-34); ctx.lineTo(x+40,y+24); ctx.moveTo(x+30,y-22); ctx.lineTo(x+50,y-22); ctx.moveTo(x+30,y-10); ctx.lineTo(x+50,y-10); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.75)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('SWITCHYARD',x,y+34);
  }

  /* ---- moving pulses along a polyline ---- */
  function flowPulses(pts,speed,load,col,gcol,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.6,0,Math.PI*2); ctx.fill(); }
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ gate fee',b:'+ power',c:'− O&M'};
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
  /* ---- live throughput sparkline ---- */
  function drawDemand(load){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'THROUGHPUT';
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
    var G=GEO[A.geoKey], E=A.econ;
    var kt=parseFloat(sCap.value), gate=parseFloat(sSpread.value), avail=parseFloat(sAvail.value)/100;
    // throughput visual (uptime wobble for the sparkline + glow)
    var thruVis=Math.max(0.02,Math.min(1, avail*(0.94+0.1*Math.sin(T*0.02))));
    // normalised capacity for furnace / bunker intensity
    var norm=(kt-E.ktMin)/Math.max(1,(E.ktMax-E.ktMin));
    var intensity=Math.max(0.18,Math.min(1, 0.28+0.7*norm)) * (0.7+0.3*avail);

    ctx.clearRect(0,0,W,H);
    drawMap();
    // sky vignette behind the plant
    plantHall(intensity);
    stack(intensity);
    bunker(Math.max(0.2,Math.min(1,norm)));
    furnace(intensity);
    switchyard();
    truck(intensity);

    // waste conveyor: bunker -> furnace (warm pulses with throughput)
    var loadVis=0.25+0.7*thruVis;
    flowPulses([[BUNK.x+30,BUNK.y+6],[FURN.x-18,FURN.y+10]],0.7+loadVis,loadVis,'rgba(140,120,90,0.95)','rgba(160,140,100,0.6)',false);
    // steam line: furnace -> turbine
    flowPulses([[FURN.x+22,FURN.y-10],[TURB.x,TURB.y-30]],0.9+loadVis,loadVis,'rgba(235,235,235,0.95)','rgba(220,220,220,0.6)',false);
    // export line: turbine -> switchyard -> grid (cyan pulses with throughput)
    flowPulses([[TURB.x+30,TURB.y-20],[YARD.x-26,YARD.y-6]],0.9+loadVis,loadVis,'rgba(70,200,235,0.95)','rgba(70,200,235,0.6)',false);
    flowPulses([[YARD.x+40,YARD.y-16],[EXPORTX,YARD.y-30]],1.0+loadVis,loadVis,'rgba(70,200,235,0.95)','rgba(70,200,235,0.6)',false);

    if(G.growing){
      var pul=0.5+0.5*Math.sin(T*0.12);
      ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('+ NEW LINE',452,168); ctx.restore();
      glow(452,176,9,'rgba(12,107,79,'+(0.22+0.3*pul)+')');
    }

    // ---- economics (dual revenue: contracted gate fee + merchant power) ----
    var tonnes=kt*1000*avail;                       // waste processed per year
    var gateRev=tonnes*gate;                         // contracted gate fee
    var powerRev=tonnes*(E.powerPerTonne||0);        // power sold (£/tonne of waste)
    var grossRev=gateRev+powerRev;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));   // floor = contracted gate-fee take-or-pay
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var opex= tonnes*(E.procPerTonne||0) + (E.fixedOM||0)*1e6;   // O&M, ash disposal, reagents, labour
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // split of "+cash" between gate fee and power (for orb colour mix)
    var gateShare=grossRev>0?gateRev/grossRev:0.5;
    // waterfall cost components
    var c_proc=tonnes*(E.procPerTonne||0)*0.55, c_ash=tonnes*(E.procPerTonne||0)*0.25, c_reag=tonnes*(E.procPerTonne||0)*0.20, c_fix=(E.fixedOM||0)*1e6;

    if(_anim){
      // gate-fee orbs from the tipping hall (green 'ret'), power orbs from turbine (amber 'rec')
      if(Math.random()<0.62){ if(Math.random()<gateShare) spawnCoin(TIP.x+rnd(-6,6),TIP.y-6,'ret',-1); else spawnCoin(TURB.x+rnd(-6,6),TURB.y-30,'rec',-1); }
      var outRate=Math.max(0.05,Math.min(0.65, opex/Math.max(1,revenue)));
      if(Math.random()<outRate){ spawnCoin(FURN.x+rnd(-10,10),FURN.y+40,'cost',1); }
      demHist.push(thruVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(thruVis);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kt+' kt/yr',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',kt+' kt/yr'); set('ixSpreadV',CUR+Math.round(gate)+'/t'); set('ixAvailV',Math.round(avail*100)+'%');
    set('ixDir',kt+' kt/yr'); set('ixDirS','residual waste · '+(E.source||''));
    set('ixMW',Math.round(tonnes/1000)+' kt processed'); set('ixMWs',Math.round(avail*100)+'% availability / yr');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['O&amp;M',c_proc],['Ash disposal',c_ash],['Reagents',c_reag],['Fixed &amp; labour',c_fix]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the margin is too thin to value, raise the gate fee or the availability, or lower the operating cost.</span>'; return; }
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
    sCap.min=E.ktMin; sCap.max=E.ktMax; sCap.step=E.ktStep; sCap.value=E.ktDef;
    sSpread.min=E.gateMin; sSpread.max=E.gateMax; sSpread.step=E.gateStep; sSpread.value=E.gateDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is a contracted gate fee (capacity × availability × £/tonne, with a floor for the take-or-pay municipal contract) plus merchant power, against O&amp;M and ash disposal; the returns model is a simplified DCF, not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }
  function layout(){ /* elevation scene, no per-asset layout grid needed */ }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.ktDef; sSpread.value=E.gateDef; sAvail.value=E.availDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'ukefw');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
