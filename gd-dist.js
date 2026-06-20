/* Gas distribution, data-driven worked examples.
   Six real local gas networks, one template. Scene config from gd-geo.js (GEO),
   drawn as a top-down town network in 720x520 scene coords. Figures are illustrative:
   revenue uses the regulated building-block (return on RAB + depreciation + opex +
   incentive) and the returns model is a simplified DCF. */
(function(){
  var CUR='£';
  var A=null;
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;
  var coins=[], _anim=false, demHist=[];
  function rnd(a,b){ return a+Math.random()*(b-a); }

  function money(v){ var n=v<0; v=Math.abs(v); var o;
    if(v>=1e9)o=(v/1e9).toFixed(2)+'bn'; else if(v>=1e6)o=(v/1e6).toFixed(0)+'m';
    else if(v>=1e3)o=Math.round(v/1e3)+'k'; else o=''+Math.round(v);
    return (n?'−':'')+CUR+o; }
  function m1(v){ return (v/1e6).toFixed(1); }
  function set(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; }
  function html(id,t){ var e=document.getElementById(id); if(e) e.innerHTML=t; }
  function fmtBn(v){ return CUR+(v>=100?Math.round(v):(Math.round(v*10)/10))+'bn'; }
  function pctS(v){ return (v>=0?'+':'')+(Math.round(v*10)/10)+'%'; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  cadent:{
    name:'Cadent', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'cadent',
    lede:'Britain\'s largest gas distribution network, a <b>privatised, RAB-regulated</b> monopoly delivering gas to the door, now managing the slow question of how it decarbonises or declines.',
    s1:'<p class="body">Gas distribution is the <b>last mile of the gas system</b>: the medium- and low-pressure mains that take gas from the transmission grid at a <b>city gate</b>, step the pressure down through <b>district governors</b>, and pipe it under the streets to millions of homes and businesses for heating and cooking.</p>'+
       '<p class="body"><b>Cadent</b> runs four of Britain\'s gas distribution networks, serving ~11&nbsp;million connections. Its revenue is set by Ofgem under <b>RIIO-GD2</b> on a <b>Regulated Asset Base</b> basis, a return on capital, depreciation and an opex allowance, decoupled from how much gas flows. A huge chunk of its capex is the legally-mandated <b>iron-mains replacement</b> programme (swapping old metal pipes for plastic), which also makes the network <b>hydrogen-ready</b>, central to the debate over whether gas distribution has a long-term future or a managed decline.</p>',
    facts:[['~£9bn','Regulated Asset Base','RIIO-GD2'],['11m','Connections','four UK networks'],['Iron mains','Capex driver','replacement programme'],['~58%','EBITDA margin','regulated'],['Ofgem','Regulator','RIIO-GD2'],['H2 / decline','Long-run question','heat pumps vs hydrogen']],
    s2:'Watch the town. Gas enters at the <b>city gate</b>, flows along the mains to <b>district governors</b>, and reaches the boilers in every home. But the <b style="color:#0c6b4f">money</b> the owner earns rises from the <b>assets</b>, the mains and governors, not from the gas. Drag the RAB and allowed return; revenue tracks the <b>asset base and the regulator\'s return</b>, not the flow.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load Cadent',
    try:'<b>Try this:</b> the <b>flow doesn\'t move the revenue</b>, a GDN is paid for the network. Nudge the allowed return and watch revenue jump. The catch unique to gas distribution is the <b>terminal value</b>: if heating electrifies, the asset could decline, which is why the exit multiple sits lower than electricity, and why hydrogen-readiness matters.',
    s3:'Cadent earns a <b>regulated allowed revenue</b> recovered through distribution charges, on the RIIO-GD2 building blocks. Much of the capex is <b>mandated mains replacement</b>, which grows the RAB and keeps the return ticking even if gas demand falls. The decisive investor question is not this year\'s flow, it is the <b>long-run role of the network</b> (hydrogen conversion vs electrified heating) and the terminal value at the end of the asset\'s life.',
    mb:{tag:'Model B · RAB-regulated', title:'Privatised gas distribution monopoly', body:'A privately-owned local monopoly whose revenue is set by Ofgem as a <b>return on its Regulated Asset Base</b> plus depreciation and an opex allowance, decoupled from flow, with a mandated mains-replacement capex programme. The wildcard is the long-run role of gas. <b>This is Cadent</b>, Britain\'s largest GDN.'},
    s4a:'A GDN\'s costs are mains maintenance, the gas-emergency service (the 24-hour leak response), and a customer-facing overhead, modest against a RAB-based revenue, so the margin is high and stable. The real "question" in the case is not opex; it is the asset\'s long-run life.',
    wfNote:'Operating cost is mains maintenance, the statutory gas-emergency service, leakage management and customer service, modest against a RAB-based revenue. The margin is high; the swing factor for value is the allowed return and the long-run role of gas, not the throughput.',
    s4b:'The capital is the <b>~£9&nbsp;billion RAB</b>, tens of thousands of kilometres of mains and the governors that feed them. The mandated <b>iron-mains replacement</b> dominates the capex; it grows the RAB and, by laying hydrogen-capable plastic, keeps a conversion option alive. The unusual risk is the <b>terminal value</b>: a regulator could accelerate depreciation if gas is set to decline.',
    stackH:'The capital base · ~£9bn RAB', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',62,'Regulated debt'],['s2',38,'Equity (consortium)']],
    finList:[['','Regulated Asset Base','~£9bn'],['sub','Ofgem price control','RIIO-GD2'],['','Connections','11m'],['sub','Mandated capex','iron-mains replacement'],['','Long-run option','hydrogen conversion'],['rest','Risk','terminal value / accelerated depreciation']],
    finNote:'A RAB-regulated GDN is a <b>steady, inflation-linked cash flow with a tail risk</b>: the return is reliable and geared, but the long-run role of gas (and how the regulator depreciates the asset) governs the terminal value. Hence a lower exit multiple than electricity networks.',
    timeline:[['1990s','<b>British Gas distribution</b> privatised and unbundled.'],['2016','<b>Cadent created</b>, National Grid\'s gas distribution sold to a consortium.'],['2002+','<b>Iron-mains replacement</b> programme runs for decades.'],['2021','<b>RIIO-GD2</b> begins (2021–26).'],['2020s','<b>Hydrogen trials</b> (HyDeploy, village trials) test conversion.'],['Future','<b>Heat policy</b> decides decline vs hydrogen conversion.']],
    calcNote:'A working model of a <b>RAB-regulated GDN</b>. The build/entry cost is the RAB, the unlevered return tracks the <b>allowed WACC</b>, and growth is modest (mains replacement, not demand). Note the <b>lower exit multiple</b> than electricity, the price of terminal-value risk on gas.',
    s6:'Cadent is a steady regulated monopoly with a long-run question mark. What moves the return:',
    breakers:['<b>The allowed WACC</b>, Ofgem\'s cost-of-capital decision is the biggest near-term lever.','<b>Terminal value</b>, the long-run role of gas (hydrogen vs electrification) and depreciation policy.','<b>Mains replacement</b>, the mandated programme grows the RAB and keeps a hydrogen option open.','<b>Rates &amp; inflation</b>, a geared, inflation-linked RAB is sensitive to real rates.'],
    src:'Figures from public sources: <a href="https://cadentgas.com/" target="_blank" rel="noopener">Cadent</a> and Ofgem RIIO-GD2 disclosure. Figures are approximate and illustrative.',
    econ:{cur:'£',gw:28,cust:11,
      rabDef:9,rabMin:4,rabMax:16,rabStep:0.5, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.05, opexAllow:0.7, anc:0},
    calc:{build:9000,grant:0,capex:28,revG:1.5,floor:1100,cap:2200,tax:25,exit:9,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.cadent.footer}
  },

  socalgas:{
    name:'SoCalGas', geo:'Southern California, USA', continent:'North America', cur:'US$', geoKey:'socalgas',
    lede:'The largest gas distribution utility in the US, an <b>investor-owned utility</b> regulated by California on a <b>rate base × allowed return</b> basis, in the state most aggressively electrifying.',
    s1:'<p class="body"><b>Southern California Gas (SoCalGas)</b>, part of Sempra, distributes gas to ~22&nbsp;million people across Southern California, the biggest gas-distribution utility in America. Like a UK GDN it is a regulated monopoly on the pipes, but under the US <b>cost-of-service</b> model.</p>'+
       '<p class="body">The California PUC sets its revenue to recover its <b>rate base</b> at an allowed <b>return on equity</b> (~10%), plus depreciation and opex, in periodic rate cases. The allowed ROE is high, which supports heavy investment in safety and pipeline replacement, but California is also the state pushing hardest to <b>electrify buildings</b>, which makes SoCalGas the sharpest test of gas distribution\'s long-run value anywhere.</p>',
    facts:[['~$20bn','Rate base','largest US gas LDC'],['~6m','Meters','22m people'],['~10%','Allowed ROE','cost-of-service'],['~58%','EBITDA margin','regulated'],['CPUC','Regulator','rate cases'],['Electrify','Headwind','building electrification']],
    s2:'The town network is the same, city gate, mains, governors, homes, but the regulation is US cost-of-service: revenue recovers the <b>rate base × allowed return</b>. The <b style="color:#0c6b4f">return</b> rises from the assets. Drag the levers, a high allowed return drives investment, against the strongest electrification headwind in the country.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on rate base', yrS:'return + depreciation + opex',
    preset:'Load SoCalGas',
    try:'<b>Try this:</b> the US allowed return is <b>higher</b> than a UK GDN\'s, a ~10% ROE drives heavy safety and replacement capex. But California is electrifying buildings, so push the lens to the <b>terminal value</b>: the higher near-term return is set against the sharpest long-run decline risk in the sector.',
    s3:'SoCalGas earns a <b>state-regulated allowed revenue</b> set in rate cases: a return on rate base at the allowed ROE, plus depreciation and opex. The model rewards <b>investing</b>, safety, pipeline replacement, integrity management, each dollar entering the rate base. The case is rate-base growth at a high ROE, set against California\'s building-electrification policy and the long-run decline question.',
    mb:{tag:'Model B · cost-of-service', title:'Investor-owned gas utility', body:'A listed gas utility regulated on <b>cost-of-service</b>: a return on rate base at an allowed ROE, set in rate cases. Higher returns than European RAB, heavy investment, but the sharpest electrification headwind. <b>This is SoCalGas</b>, the largest US gas distributor, part of Sempra.'},
    s4a:'A vast urban gas network carries real O&M, safety and integrity costs, plus a large customer operation, but against a rate-base revenue the margin is healthy. The defining feature is the <b>rate base</b>: it grows with safety and replacement capital, and California allows a return on it.',
    wfNote:'Operating cost is mains and integrity management, the emergency service, leakage and customer operations, recovered in the rate case. The swing factor for value is the rate base, the allowed ROE, and the long-run electrification path.',
    s4b:'The capital is the <b>~$20&nbsp;billion rate base</b>, financed on an investment-grade balance sheet. Safety, integrity and replacement programmes drive a large capital plan, each project entering the rate base at the allowed return, even as policy questions the network\'s long-run role.',
    stackH:'The capital base · ~$20bn rate base', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',52,'Long-term debt'],['s2',48,'Equity (allowed ROE)']],
    finList:[['','Rate base','~$20bn'],['sub','Regulator','California PUC'],['','Allowed ROE','~10% (cost-of-service)'],['sub','Owner','Sempra'],['','Capex','safety + integrity + replacement'],['rest','Headwind','building electrification policy']],
    finNote:'A US gas IOU is a <b>higher-returning network with a policy headwind</b>: the same regulated, volume-decoupled cash flow at a higher ROE, but California\'s electrification drive makes the terminal value the central debate.',
    timeline:[['1867','<b>Los Angeles gas</b> supply begins; SoCalGas\'s roots.'],['1998','<b>Sempra Energy</b> formed; SoCalGas a core utility.'],['2015','<b>Aliso Canyon</b> leak reshapes safety and integrity spending.'],['2020s','<b>Building electrification</b> policy intensifies in California.'],['Periodic','<b>Rate cases</b> reset revenue and ROE.'],['Future','<b>Decarbonisation</b> path (hydrogen / RNG vs electrify).']],
    calcNote:'A working model of a <b>cost-of-service gas IOU</b>. The allowed return is higher than a European GDN, growth reflects safety/replacement capex, and the exit multiple sits lower, the price of California\'s electrification headwind.',
    s6:'SoCalGas is a high-return network against the strongest decline headwind. What drives it:',
    breakers:['<b>The allowed ROE</b>, the CPUC\'s rate-case decision is the biggest near-term lever.','<b>Electrification policy</b>, California\'s building-electrification drive sets the terminal value.','<b>Rate-base growth</b>, safety and replacement capex compound the base.','<b>Regulatory lag &amp; bills</b>, recovery timing and the politics of gas bills.'],
    src:'Figures from public sources: <a href="https://www.socalgas.com/" target="_blank" rel="noopener">SoCalGas</a> / <a href="https://www.sempra.com/" target="_blank" rel="noopener">Sempra</a> and CPUC disclosure. Figures are approximate and illustrative.',
    econ:{cur:'US$',gw:40,cust:6,
      rabDef:20,rabMin:8,rabMax:34,rabStep:0.5, waccDef:6.8,waccMin:4,waccMax:11,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:1.6, anc:0},
    calc:{build:20000,grant:0,capex:26,revG:2,floor:2400,cap:5000,tax:25,exit:9,lev:5,rd:5,amort:1,hold:25},
    map:{footer:GEO.socalgas.footer}
  },

  comgas:{
    name:'Comgás', geo:'São Paulo, Brazil', continent:'South America', cur:'R$', geoKey:'comgas',
    lede:'Brazil\'s largest gas distributor, a <b>privatised concession</b> in a still-growing market, where the prize is connecting new homes and industry, not managing decline.',
    s1:'<p class="body"><b>Comgás</b> distributes piped gas across the São Paulo metropolitan region, Brazil\'s largest gas distribution concession, owned by <b>Cosan</b>. Unlike mature Western networks, the Brazilian story is <b>growth</b>: gas penetration is still low, so the network is connecting new residential, commercial and industrial customers every year.</p>'+
       '<p class="body">It is a <b>concession</b> regulated by the São Paulo regulator (ARSESP) on a <b>price cap</b> with a defined regulatory asset base and allowed return. The model rewards efficient investment and connection growth; the cash flow is regulated and indexed, but priced against Brazilian interest rates and currency, so a strong nominal return nets down once discounted like an emerging-market asset.</p>',
    facts:[['~R$9bn','Regulatory asset base','indexed'],['~2.5m','Connections','growing fast'],['Growth','Story','low gas penetration'],['~55%','EBITDA margin','EM-regulated'],['ARSESP','Regulator','price-cap concession'],['Cosan','Owner','privatised']],
    s2:'The town is the same, city gate, mains, governors, homes, but here the network is <b>expanding</b>, connecting new customers across a growing city. The <b style="color:#0c6b4f">return</b> rises from a growing asset base; drag the levers, the upside is connections, the risk is the Brazilian discount rate.',
    driverLab:'Allowed return', availLab:'Efficiency gain', hrK:'Return on assets', yrS:'regulated tariff revenue',
    preset:'Load Comgás',
    try:'<b>Try this:</b> unlike a Western GDN, Comgás <b>grows the RAB by connecting customers</b>, penetration is still low. Wind the asset base up to see the growth compound. But push the cost of debt: a high nominal Brazilian return nets down once discounted like an EM asset.',
    s3:'Comgás earns a <b>regulated tariff</b> set by ARSESP on a price cap, a return on the regulatory asset base, depreciation and an efficient opex allowance, reset at tariff reviews. Growth is structural: <b>new connections</b> across a low-penetration market add to the base. Efficiency gains are kept between reviews. The investor question is the <b>discount rate</b>, Brazilian rates and the real, more than the asset, which is a growth story not a decline one.',
    mb:{tag:'Model B · growth concession', title:'Privatised gas concession (EM, growth)', body:'A private operator runs a distribution concession under an ARSESP <b>price cap</b>, growing the asset base by connecting a low-penetration market, keeping efficiency upside. Regulated and indexed with structural growth, but priced against EM rates and currency. <b>This is Comgás</b>, Brazil\'s largest, owned by Cosan.'},
    s4a:'A growing urban network carries the cost of laying mains and connecting customers, plus normal O&M, so the margin is a touch lower than a mature Western GDN, but the base is compounding. The real determinant of value is the tariff review and the Brazilian discount rate.',
    wfNote:'Operating cost is mains O&M, the emergency service, connections and customer operations across a growing network. The price cap rewards efficiency; the swing factors are connection growth and the macro, not the cost line.',
    s4b:'The capital is the network plus a steady build-out to connect new customers, financed by the sponsor against Brazilian conditions. Modelled on an enterprise-value basis, the return is a <b>high-nominal emerging-market</b> one on a growing, indexed cash flow.',
    stackH:'The capital stack · concession assets', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local debt (indexed)'],['s2',45,'Sponsor equity (Cosan)']],
    finList:[['','Regulatory asset base','~R$9bn'],['sub','Regulator','ARSESP (price cap)'],['','Connections','~2.5m, growing'],['sub','Story','low gas penetration'],['','Efficiency','kept between reviews'],['rest','Risk','tariff cycle + currency']],
    finNote:'A Brazilian gas concession is a <b>growth story at an EM discount rate</b>: the base compounds as the city connects, but the tariff cycle and the real dominate the valuation. Get the entry price right and the growth pays; misjudge the macro and it bites.',
    timeline:[['1999','<b>Comgás privatised</b>, São Paulo gas concession sold.'],['2012','<b>Cosan acquires</b> control.'],['2010s','<b>Connection growth</b> across the metro region.'],['Periodic','<b>ARSESP tariff reviews</b> reset the price cap.'],['2020s','<b>Penetration still rising</b>, structural growth runway.'],['Future','<b>Concession renewal</b> terms in focus.']],
    calcNote:'A working model of a <b>growth gas concession</b>, on an enterprise-value basis. The base grows with connections, the floor is high (regulated/indexed), but the cost of debt is high to reflect Brazilian rates, a strong nominal return nets down once discounted like an EM asset.',
    s6:'Comgás is a growth concession at an Argentine, sorry, Brazilian, discount rate. What drives it:',
    breakers:['<b>Connection growth</b>, adding customers in a low-penetration market compounds the base.','<b>Country &amp; currency</b>, Brazilian rates and the real set the discount rate.','<b>The tariff review</b>, ARSESP\'s price cap and how much efficiency is handed back.','<b>The entry price</b>, at an EM discount rate, what you pay decides the return.'],
    src:'Figures from public sources: <a href="https://www.comgas.com.br/" target="_blank" rel="noopener">Comgás</a> / Cosan and ARSESP disclosure. Figures are approximate and illustrative.',
    econ:{cur:'R$',gw:12,cust:2.5,
      rabDef:9,rabMin:4,rabMax:16,rabStep:0.5, waccDef:7.5,waccMin:4,waccMax:12,waccStep:0.25,
      perfDef:0.5,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:1.0, anc:0},
    calc:{build:9000,grant:0,capex:26,revG:5,floor:1300,cap:2800,tax:34,exit:9,lev:4,rd:9,amort:2,hold:25},
    map:{footer:GEO.comgas.footer}
  },

  agig:{
    name:'Australian Gas Networks', geo:'South Australia', continent:'Oceania', cur:'A$', geoKey:'agig',
    lede:'A privatised Australian gas distributor, a <b>regulated monopoly</b> under the AER, and a global pioneer of <b>blending hydrogen</b> into the existing network.',
    s1:'<p class="body"><b>Australian Gas Networks</b> (part of AGIG) distributes gas across South Australia and other states. It is a regulated monopoly under the <b>Australian Energy Regulator (AER)</b>, which sets a <b>revenue cap</b> on a RAB basis, the same building blocks as a UK GDN.</p>'+
       '<p class="body">Its distinctive feature is being a world leader in <b>hydrogen blending</b>: its Hydrogen Park (HyP) projects inject renewable hydrogen into the existing distribution network, testing whether the gas grid can decarbonise rather than be retired. Like all gas distributors it faces the long-run electrification question, but it is actively pursuing the hydrogen path, which, if it works, protects the terminal value of the asset.</p>',
    facts:[['~A$7bn','Regulated Asset Base','growing'],['~2m','Connections','South Australia +'],['HyP','Hydrogen Park','blending pioneer'],['~62%','EBITDA margin','regulated'],['AER','Regulator','revenue cap (RAB)'],['Privatised','Owner','infrastructure investors']],
    s2:'The town network is the same, city gate, mains, governors, homes, but here some of the gas is <b>blended hydrogen</b> (the green markers). The <b style="color:#0c6b4f">return</b> rises from the regulated asset base; drag the levers to see a regulated gas monopoly betting on hydrogen to protect its future.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load Australian Gas Networks',
    try:'<b>Try this:</b> the regulated mechanics are the same as a UK GDN, RAB × allowed return. The differentiator is <b>hydrogen blending</b>: if the network can decarbonise, the terminal value holds up; if heating electrifies instead, the exit multiple compresses. That option is the whole long-run story.',
    s3:'AGN earns a <b>regulated revenue cap</b> set by the AER on a RAB basis, a return on the asset base, depreciation and an opex allowance, with incentives. Capex covers mains, connections and the hydrogen-readiness programme. The case is a steady regulated monopoly whose <b>terminal value</b> hinges on whether hydrogen blending (and eventually conversion) keeps the network relevant.',
    mb:{tag:'Model B · RAB-regulated', title:'Privatised gas distribution monopoly', body:'A privatised local monopoly under an <b>AER revenue cap</b> on a RAB basis, pursuing hydrogen blending to protect its long-run role. Steady and inflation-linked, with a terminal-value question. <b>This is Australian Gas Networks</b>, an AGIG network and a hydrogen pioneer.'},
    s4a:'AGN runs a regulated network lean, so the margin is high and stable. The defining features are the steady RAB and the <b>hydrogen programme</b>, modest capex today, but a potentially decisive option on the asset\'s long-run value.',
    wfNote:'Operating cost is mains O&M, the emergency service and customer operations, modest against a RAB-based revenue. The margin is high; the swing factor for value is the allowed return and the hydrogen/terminal-value question.',
    s4b:'The capital is the <b>~A$7&nbsp;billion RAB</b> plus a hydrogen-readiness programme. The Hydrogen Park projects are small today but strategically large: they test whether the existing mains can carry blended (and ultimately pure) hydrogen, which would protect the network\'s terminal value against electrification.',
    stackH:'The capital base · ~A$7bn RAB', splitL:'Financing', splitR:'consortium',
    split:[['s1',60,'Regulated debt'],['s2',40,'Infrastructure-fund equity']],
    finList:[['','Regulated Asset Base','~A$7bn'],['sub','Regulator','AER (revenue cap)'],['','Connections','~2m'],['sub','Hydrogen','HyP blending projects'],['','Capex','mains + connections + H2-readiness'],['rest','Risk','terminal value vs electrification']],
    finNote:'A regulated gas monopoly with a hydrogen hedge is a <b>steady cash flow with an option on its own future</b>: the return is reliable, and the hydrogen programme is a relatively cheap call on the terminal value against electrification.',
    timeline:[['1860s','<b>Australian town gas</b> supply begins.'],['2017','<b>AGIG formed</b>; AGN a core network.'],['2019','<b>Hydrogen Park SA</b>, first blending into the network.'],['2020s','<b>HyP projects</b> expand across states.'],['Periodic','<b>AER determinations</b> reset the revenue cap.'],['Future','<b>Hydrogen conversion</b> decides the terminal value.']],
    calcNote:'A working model of a <b>RAB-regulated GDN</b> with a hydrogen hedge. The unlevered return tracks the allowed WACC; the exit multiple sits lower than electricity (terminal-value risk), partly offset by the hydrogen option.',
    s6:'AGN is a regulated monopoly with a hydrogen option on its future. What drives it:',
    breakers:['<b>The allowed WACC</b>, the AER\'s revenue-cap return is the biggest near-term lever.','<b>Hydrogen vs electrification</b>, whether the network decarbonises or declines sets the terminal value.','<b>RAB growth</b>, mains, connections and H2-readiness capex compound the base.','<b>Rates</b>, a geared, inflation-linked RAB is sensitive to interest rates.'],
    src:'Figures from public sources: <a href="https://www.agig.com.au/" target="_blank" rel="noopener">AGIG / Australian Gas Networks</a> and AER disclosure. Figures are approximate and illustrative.',
    econ:{cur:'A$',gw:9,cust:2,
      rabDef:7,rabMin:3,rabMax:13,rabStep:0.5, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.05, opexAllow:0.5, anc:0},
    calc:{build:7000,grant:0,capex:26,revG:1.5,floor:850,cap:1800,tax:30,exit:9,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.agig.footer}
  },

  egypt:{
    name:'Town Gas (Egypt)', geo:'Greater Cairo, Egypt', continent:'Middle East', cur:'US$', geoKey:'egypt',
    lede:'Egypt\'s household gas roll-out, a <b>state-led programme</b> connecting millions of homes from scratch, the purest <b>growth</b> story in gas distribution.',
    s1:'<p class="body">Where Western gas distribution debates decline, Egypt is doing the opposite: a <b>state-led programme</b> to connect tens of millions of homes to piped natural gas for the first time, replacing bottled LPG. Operators such as <b>Town Gas</b> build the city networks, city gates, mains, governors and service connections, across Cairo and beyond.</p>'+
       '<p class="body">The economics are <b>connection-driven growth</b>: revenue comes from a regulated distribution tariff plus connection fees, on an asset base that is expanding fast as new districts are reticulated. It is a developing-market story, high nominal growth, a low base, and real country and currency risk, and a reminder that, globally, gas distribution is still being built out as well as questioned.</p>',
    facts:[['~$4bn','Asset base','expanding fast'],['~14m','Connections','and rising'],['Growth','Story','household roll-out'],['~52%','EBITDA margin','developing market'],['State','Programme','EGAS / regulator'],['LPG → gas','Driver','replacing bottled gas']],
    s2:'Watch the network <b>grow</b>, new districts reticulated, homes connected to piped gas for the first time. The <b style="color:#0c6b4f">return</b> rises from a fast-expanding asset base; drag the levers, this is the growth end of gas distribution, with an emerging-market discount rate.',
    driverLab:'Allowed return', availLab:'Connection drive', hrK:'Return on assets', yrS:'tariff + connection revenue',
    preset:'Load Town Gas (Egypt)',
    try:'<b>Try this:</b> this is the <b>opposite of decline</b>, wind the asset base up and the connection-driven growth compounds. But push the cost of debt: the high nominal Egyptian return nets down hard once discounted like an emerging-market asset, and currency is a real risk.',
    s3:'The network earns a <b>regulated distribution tariff</b> plus <b>connection fees</b>, on an asset base that grows rapidly as new homes are connected. Growth, not terminal value, is the story: penetration is rising from a low base. The investor question is the <b>discount rate</b> (Egyptian rates and the pound) and the durability of the state programme, against a long runway of new connections.',
    mb:{tag:'Model B · growth roll-out', title:'State-led connection roll-out', body:'A state-led programme connecting millions of homes to piped gas for the first time, earning a regulated tariff plus connection fees on a fast-growing base. High nominal growth from a low base, but emerging-market rates, currency and execution risk. <b>This is Egypt\'s household gas roll-out</b>.'},
    s4a:'Building a network from scratch is capital-intensive, laying mains and connecting homes, and developing-market operating costs are real, so the margin is lower than a mature Western GDN. But the base is compounding fast, and connection fees help fund the build.',
    wfNote:'Operating cost is network O&M, the build-and-connect operation and customer service in a developing market. The margin is lower, but the asset base, and the revenue, is growing fast.',
    s4b:'The capital is the <b>build-out itself</b>, city gates, mains and millions of service connections, financed by the operators and the state programme against Egyptian conditions. Modelled on an enterprise-value basis, the return is a <b>high-nominal developing-market</b> one on a fast-growing base.',
    stackH:'The capital stack · network build-out', splitL:'Financing', splitR:'developing',
    split:[['s1',50,'Local / DFI debt'],['s2',50,'Operator + state equity']],
    finList:[['','Asset base','~$4bn, expanding'],['sub','Programme','state household roll-out'],['','Connections','~14m and rising'],['sub','Revenue','tariff + connection fees'],['','Driver','LPG → piped gas'],['rest','Risk','currency + execution']],
    finNote:'A developing-market gas roll-out is a <b>growth story at a high discount rate</b>: a long runway of new connections, but Egyptian rates, currency and execution dominate the valuation. The structural demand is real; the macro is the risk.',
    timeline:[['1980s','<b>Town Gas founded</b>; piped gas begins in Egypt.'],['2010s','<b>National household programme</b> accelerates connections.'],['2020s','<b>Millions of homes</b> connected, replacing LPG.'],['Ongoing','<b>New districts</b> reticulated across the country.'],['Ongoing','<b>Tariff + connection</b> revenue grows the base.'],['Future','<b>Penetration</b> continues rising from a low base.']],
    calcNote:'A working model of a <b>developing-market gas roll-out</b>, on an enterprise-value basis. Growth is high (connections), the base compounds, but the cost of debt is high to reflect Egyptian rates, a strong nominal return nets down once discounted like an EM asset.',
    s6:'Egypt is the growth end of gas distribution at a developing-market discount rate. What drives it:',
    breakers:['<b>Connection growth</b>, the household roll-out compounds the base from a low penetration.','<b>Country &amp; currency</b>, Egyptian rates and the pound set the discount rate.','<b>The state programme</b>, its durability and funding drive the build pace.','<b>Execution</b>, building and connecting at scale is the operational risk.'],
    src:'Figures from public sources: reporting on <a href="https://www.towngas.com.eg/" target="_blank" rel="noopener">Town Gas</a> and Egypt\'s household gas programme. Figures are approximate and illustrative.',
    econ:{cur:'US$',gw:18,cust:14,
      rabDef:4,rabMin:1.5,rabMax:9,rabStep:0.25, waccDef:8,waccMin:5,waccMax:14,waccStep:0.25,
      perfDef:0.4,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.05, opexAllow:0.5, anc:0},
    calc:{build:4000,grant:0,capex:35,revG:7,floor:600,cap:1300,tax:22,exit:9,lev:4,rd:9,amort:2,hold:25},
    map:{footer:GEO.egypt.footer}
  },

  enn:{
    name:'ENN Energy', geo:'China', continent:'China', cur:'¥', geoKey:'enn',
    lede:'One of China\'s largest city-gas distributors, a <b>listed</b> operator earning on both the regulated network and gas sales, riding a still-growing urban gas market.',
    s1:'<p class="body"><b>ENN Energy</b> is one of China\'s biggest city-gas distributors, holding hundreds of municipal concessions to build and operate local gas networks. The Chinese model blends two earnings streams: a <b>regulated distribution tariff</b> on the network, and a margin on <b>gas sales</b> to connected customers, plus <b>connection fees</b> as new users are added.</p>'+
       '<p class="body">Like other Chinese utilities it has operated in a <b>growth</b> market, urbanisation and the coal-to-gas switch have driven years of rising connections and volumes, though connection-fee growth is now maturing. It is <b>listed</b> (Hong Kong), more commercial than a pure state utility, and increasingly building out integrated energy and gas-sales services on top of the network.</p>',
    facts:[['~¥80bn','Asset base','hundreds of concessions'],['~30m','Connections','city-gas'],['Network + sales','Revenue','two streams'],['~58%','EBITDA margin','listed operator'],['Concessions','Model','municipal'],['Coal-to-gas','Driver','urbanisation']],
    s2:'A dense, growing city network, mains under the streets, governors, and gas to millions of homes and businesses. ENN earns on both the <b>network</b> and the <b>gas it sells</b>. The <b style="color:#0c6b4f">return</b> rises from a large, growing asset base; drag the levers, a listed city-gas operator in a still-expanding market.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on assets', yrS:'network + gas-sales revenue',
    preset:'Load ENN Energy',
    try:'<b>Try this:</b> the Chinese model adds a <b>gas-sales margin</b> and <b>connection fees</b> on top of the regulated network, so the business is more commercial than a pure RAB. Wind the base up to see the growth compound, though connection-fee growth is now maturing as penetration rises.',
    s3:'ENN earns a <b>regulated distribution tariff</b> plus a <b>margin on gas sales</b> and <b>connection fees</b>, across hundreds of municipal concessions. The model is part-regulated, part-commercial, and has ridden a <b>growth</b> market (urbanisation, coal-to-gas). Growth is now maturing as connection-fee income normalises and the company pivots to integrated energy services. The case is a listed, growing city-gas operator with more commercial upside than a Western GDN.',
    mb:{tag:'Model B · listed city-gas', title:'Listed city-gas distributor', body:'A listed operator of hundreds of municipal gas concessions, earning on a regulated network plus gas-sales margin and connection fees, in a still-growing market. More commercial than a pure RAB, with maturing connection growth. <b>This is ENN Energy</b>, Hong Kong-listed.'},
    s4a:'Running hundreds of city networks plus a gas-sales business carries real cost, procurement, O&M, customer operations, but scale and the sales margin keep the blended margin healthy. The defining feature is the mix of <b>regulated network</b> plus <b>commercial gas sales</b> and connections.',
    wfNote:'Operating cost is network O&M, gas procurement and customer operations across hundreds of concessions. The margin is healthy; the swing factors are the gas-sales margin, connection growth and the regulated tariff.',
    s4b:'The capital is the <b>~¥80&nbsp;billion</b> of networks across hundreds of concessions, financed on a listed balance sheet, plus a pivot into integrated energy services. Growth capex still adds connections, though the connection-fee tailwind is maturing.',
    stackH:'The capital base · ~¥80bn networks', splitL:'Financing', splitR:'listed',
    split:[['s1',50,'Debt'],['s2',50,'Equity (HK-listed)']],
    finList:[['','Asset base','~¥80bn'],['sub','Model','municipal concessions'],['','Connections','~30m'],['sub','Revenue','network + gas-sales + connection fees'],['','Pivot','integrated energy services'],['rest','Owner','Hong Kong-listed']],
    finNote:'A listed city-gas distributor is a <b>part-regulated, part-commercial growth compounder</b>: the network gives stability, gas-sales and connections give upside, and a still-growing market drives the base, with the connection tailwind now maturing.',
    timeline:[['1990s','<b>ENN founded</b>; wins early city-gas concessions.'],['2001','<b>Listed</b> in Hong Kong.'],['2000s–10s','<b>Coal-to-gas &amp; urbanisation</b> drive rapid growth.'],['2020s','<b>Connection-fee growth matures</b>; pivot to energy services.'],['Ongoing','<b>Gas-sales margin</b> and integrated services grow.'],['Ongoing','<b>Hundreds of concessions</b> across China.']],
    calcNote:'A working model of a <b>listed city-gas operator</b>, on an enterprise-value basis. The base is large and still growing (connections + sales), the allowed/blended return is moderate, and the cost of capital is market-based, a growth compounder with maturing connection income.',
    s6:'ENN is a listed city-gas compounder in a maturing growth market. What drives it:',
    breakers:['<b>Gas-sales margin</b>, the commercial layer on top of the regulated network.','<b>Connection growth</b>, still positive but maturing as penetration rises.','<b>The regulated tariff</b>, the network return underpins the stability.','<b>Energy-services pivot</b>, the next growth leg beyond connections.'],
    src:'Figures from public sources: <a href="https://www.ennenergy.com/" target="_blank" rel="noopener">ENN Energy</a> (HK-listed) disclosure. Figures are approximate and illustrative.',
    econ:{cur:'¥',gw:60,cust:30,
      rabDef:80,rabMin:30,rabMax:150,rabStep:1, waccDef:6,waccMin:3,waccMax:10,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:10, anc:0},
    calc:{build:80000,grant:0,capex:26,revG:6,floor:9000,cap:32000,tax:25,exit:10,lev:4,rd:5,amort:2,hold:25},
    map:{footer:GEO.enn.footer}
  }
  };
  var ORDER=['cadent','socalgas','comgas','agig','egypt','enn'];

  /* ===================================================================
     GAS DISTRIBUTION RENDERER  (canvas, 720x520), top-down town gas network
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var GATE={x:104,y:250};
  var MAINS=[
    {pts:[[104,250],[104,96],[300,96]], dt:[300,96]},
    {pts:[[104,250],[250,250],[440,250]], dt:[440,250]},
    {pts:[[104,250],[104,406],[316,406]], dt:[316,406]},
    {pts:[[104,250],[250,250],[250,150],[616,150]], dt:[616,150]}
  ];

  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#dfe7d8'); g.addColorStop(1,'#d2dccb');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(150,180,140,0.12)';
    [[150,30,180,120],[360,30,200,90],[470,300,200,150],[150,300,200,160]].forEach(function(b){ rr(b[0],b[1],b[2],b[3],8); ctx.fill(); });
    var rh=[96,250,406], rv=[104,250,440,616];
    rh.forEach(function(y){ road(0,y,W,y); }); rv.forEach(function(x){ road(x,40,x,H-30); });
  }
  function road(x0,y0,x1,y1){
    ctx.strokeStyle='#c2c7bd'; ctx.lineWidth=11; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.setLineDash([6,8]); ctx.lineDashOffset=-(T*0.5);
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); ctx.setLineDash([]);
  }
  function transmissionIn(){
    var x=44,y=40; ctx.strokeStyle='#9aa19a'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x-6,y); ctx.lineTo(x+8,y); ctx.stroke();
    ctx.strokeStyle='#9aa19a'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(GATE.x,GATE.y-26); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='600 7px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('FROM TRANSMISSION',x-6,y-4);
  }
  function cityGate(){
    var x=GATE.x,y=GATE.y; ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(x,y+28,30,3,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#cfd3ca'; rr(x-30,y-26,60,52,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    for(var i=0;i<2;i++){ var tx=x-18+i*22; var g=ctx.createLinearGradient(tx,0,tx+14,0); g.addColorStop(0,'#b79a55'); g.addColorStop(1,'#9c8038');
      ctx.fillStyle=g; rr(tx,y-14,14,24,2); ctx.fill();
      ctx.strokeStyle='rgba(40,40,30,0.3)'; ctx.lineWidth=0.7; for(var f=1;f<5;f++){ ctx.beginPath(); ctx.moveTo(tx,y-14+f*5); ctx.lineTo(tx+14,y-14+f*5); ctx.stroke(); } }
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('CITY GATE',x,y+38);
  }
  function governor(p){ ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(p[0],p[1]+8,9,2.4,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#b79a55'; rr(p[0]-7,p[1]-7,14,14,2); ctx.fill(); ctx.fillStyle='rgba(255,255,255,0.25)'; rr(p[0]-7,p[1]-7,14,4,2); ctx.fill(); }
  function mainLine(pts,h2){
    ctx.strokeStyle=h2?'rgba(40,150,90,0.6)':'rgba(190,140,50,0.65)'; ctx.lineWidth=2.6;
    ctx.setLineDash([6,4]); ctx.beginPath(); pts.forEach(function(p,i){ i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); }); ctx.stroke(); ctx.setLineDash([]);
  }
  function flowPulses(pts,speed,load){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    var n=Math.max(2,Math.round(2+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1), d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],4,'rgba(255,180,90,0.7)'); ctx.fillStyle='rgba(255,225,170,0.95)'; ctx.beginPath(); ctx.arc(p[0],p[1],1.6,0,Math.PI*2); ctx.fill(); }
  }
  function house(x,y,h2,lit){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-6,y-5,13,12,1); ctx.fill();
    ctx.fillStyle='#d8d2c4'; rr(x-6,y-6,12,12,1.5); ctx.fill();
    ctx.fillStyle='#b8755a'; rr(x-6,y-6,12,5,1.5); ctx.fill();
    if(lit){ glow(x,y+2,5,'rgba(255,150,60,0.5)'); ctx.fillStyle='rgba(255,170,80,0.95)'; ctx.fillRect(x-1,y+1,2,3); }
    else { ctx.fillStyle='rgba(80,90,80,0.4)'; ctx.fillRect(x-1,y+1,2,3); }
    if(h2){ ctx.fillStyle='#2f9d6a'; ctx.fillRect(x+3,y-5,3,3); }
  }
  function homeGrid(x0,y0,cols,rows,h2Share,load){
    var k=0; for(var r=0;r<rows;r++) for(var c=0;c<cols;c++,k++){ var x=x0+c*17, y=y0+r*15;
      var h2=((x*7+y*13)%100)/100 < h2Share; var lit=((x*3+y*5+k)%10)/10 < (0.3+0.55*load);
      house(x,y,h2,lit); }
  }
  function commercial(x,y,load){
    [[x,y,46,40],[x+54,y+8,34,32]].forEach(function(b){ ctx.fillStyle='rgba(30,40,30,0.10)'; rr(b[0]-2,b[1]+b[3]-2,b[2]+4,8,2); ctx.fill();
      var g=ctx.createLinearGradient(b[0],b[1],b[0],b[1]+b[3]); g.addColorStop(0,'#aeb6bd'); g.addColorStop(1,'#8f99a1');
      ctx.fillStyle=g; rr(b[0],b[1],b[2],b[3],2); ctx.fill();
      for(var wy=b[1]+5;wy<b[1]+b[3]-3;wy+=7) for(var wx=b[0]+4;wx<b[0]+b[2]-3;wx+=7){
        var lit=((wx*7+wy*13)%10)/10 < (0.3+0.6*load);
        ctx.fillStyle=lit?'rgba(255,200,120,0.9)':'rgba(120,140,150,0.5)'; ctx.fillRect(wx,wy,3,3); } });
    ctx.fillStyle='rgba(70,90,90,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('COMMERCIAL',x+40,y+52);
  }
  function industry(x,y,load){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-2,y+34,96,8,2); ctx.fill();
    ctx.fillStyle='#9aa0a0'; rr(x,y,92,36,2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1; for(var sx=x+6;sx<x+92;sx+=12){ ctx.beginPath(); ctx.moveTo(sx,y); ctx.lineTo(sx+6,y-5); ctx.lineTo(sx+12,y); ctx.stroke(); }
    ctx.fillStyle='#7e857f'; rr(x+6,y+10,16,22,1); ctx.fill();
    if(load>0.4) glow(x+70,y+6,5,'rgba(255,150,60,0.5)');   // process-heat flame
    ctx.fillStyle='rgba(70,90,90,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('INDUSTRY',x+46,y+50);
  }

  /* economic overlay (shared style) */
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
  function drawLedger(rev,eb,opex){
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0;
    ctx.save();
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,11); ctx.fill(); ctx.stroke();
    ctx.textAlign='left'; ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.fillText('LIVE ECONOMICS · PER YEAR',px+13,py+15);
    function dot(x,c){ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,py+27,2.6,0,Math.PI*2); ctx.fill(); }
    dot(px+15,'#0c8a57'); dot(px+92,'#c0902f'); dot(px+183,'#bc4733');
    ctx.fillStyle='rgba(70,82,76,0.85)'; ctx.font='600 7.5px Inter,sans-serif';
    ctx.fillText('+ return on RAB',px+21,py+30); ctx.fillText('+ depreciation',px+98,py+30); ctx.fillText('− opex',px+189,py+30);
    var bx=px+13, bw=pw-26, rows=[['Revenue','+'+money(rev),'#0c6b4f',1],['Operating cost','−'+money(opex),'#bc4733',Math.max(0.02,oR)],['EBITDA',money(eb)+'  ·  '+Math.round(m*100)+'%','#0a5a42',Math.max(0.02,m)]];
    var ry=py+42;
    rows.forEach(function(r){ ctx.fillStyle='rgba(60,72,66,0.95)'; ctx.font='600 9px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(r[0],bx,ry+7);
      ctx.fillStyle=r[2]; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(r[1],px+pw-13,ry+7);
      ctx.fillStyle='rgba(20,30,25,0.07)'; rr(bx,ry+11,bw,3,1.5); ctx.fill(); ctx.fillStyle=r[2]; rr(bx,ry+11,bw*Math.min(1,r[3]),3,1.5); ctx.fill();
      ry+=20; });
    ctx.restore();
  }
  function drawDemand(load){
    var pw=126,ph=44,px=W-pw-16,py=14;
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('GAS DEMAND',px+11,py+14);
    ctx.fillStyle='rgba(192,144,47,0.95)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(Math.round(load*100)+'%',px+pw-11,py+14);
    var gx=px+11, gw=pw-22, gy=py+ph-9, gh=18;
    ctx.strokeStyle='rgba(192,144,47,0.3)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+gw,gy); ctx.stroke();
    ctx.strokeStyle='#c0902f'; ctx.lineWidth=1.6; ctx.beginPath();
    for(var i=0;i<demHist.length;i++){ var x=gx+gw*i/72, y=gy-demHist[i]*gh; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke();
    if(demHist.length){ var lx=gx+gw*(demHist.length-1)/72, ly=gy-demHist[demHist.length-1]*gh; glow(lx,ly,5,'rgba(192,144,47,0.5)'); ctx.fillStyle='#c0902f'; ctx.beginPath(); ctx.arc(lx,ly,2.2,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }

  /* ===================================================================
     FRAME
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var G=GEO[A.geoKey], E=A.econ;
    var rabBn=parseFloat(sCap.value), wacc=parseFloat(sSpread.value)/100, perf=parseFloat(sAvail.value)/100;
    var RAB=rabBn*1e9;
    var load=0.5+0.4*Math.sin(T*0.012)+0.08*Math.sin(T*0.05); load=Math.max(0.12,Math.min(1,load));

    ctx.clearRect(0,0,W,H);
    drawMap(); transmissionIn();
    MAINS.forEach(function(F){ mainLine(F.pts,G.h2); });
    cityGate();
    MAINS.forEach(function(F){ governor(F.dt); });
    homeGrid(316,38,5,3,G.h2?0.35:0,load);
    commercial(474,214,load);
    homeGrid(330,420,5,2,G.h2?0.35:0,load);
    industry(560,64,load);
    if(G.growth==='grow'){ ctx.fillStyle='rgba(60,130,90,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('+ CONNECTING',300,470); }
    MAINS.forEach(function(F){ flowPulses(F.pts,0.8+load,load); });

    // ---- economics (annual, regulated building-block) ----
    var returnRev=wacc*RAB, depRev=E.depRate*RAB, opexAllow=E.opexAllow*1e9, incentive=perf*RAB;
    var allowedRev=returnRev+depRev+opexAllow+incentive+(E.anc||0)*1e9;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,allowedRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var actualOpex=opexAllow;
    var c_om=actualOpex*0.40, c_emerg=actualOpex*0.22, c_conn=actualOpex*0.16, c_admin=actualOpex*0.22;
    var ebitda=revenue-actualOpex;
    baseRevYr=revenue; baseCostYr=actualOpex; baseEbYr=ebitda;
    var retShare=(returnRev+incentive)/Math.max(1,(returnRev+incentive+depRev+opexAllow));

    if(_anim){
      var src=[[GATE.x,GATE.y-28]]; MAINS.forEach(function(F){ src.push([F.dt[0],F.dt[1]-10]); });
      if(Math.random()<0.6){ var s1=src[(Math.random()*src.length)|0]; spawnCoin(s1[0],s1[1], Math.random()<retShare?'ret':'rec', -1); }
      var outRate=Math.max(0.05,Math.min(0.6, actualOpex/Math.max(1,revenue)));
      if(Math.random()<outRate){ var s2=src[(Math.random()*src.length)|0]; spawnCoin(s2[0],s2[1]+6,'cost',1); }
      demHist.push(load); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, actualOpex);
    drawDemand(load);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · RAB '+fmtBn(rabBn),W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',fmtBn(rabBn)); set('ixSpreadV',(Math.round(wacc*1000)/10)+'%'); set('ixAvailV',pctS(perf*100));
    set('ixDir',fmtBn(rabBn)); set('ixDirS','inflation-protected · grows with capex');
    set('ixMW',E.cust+'m'); set('ixMWs','connections · '+E.gw+' GW peak');
    set('ixHr', money(returnRev)); set('ixYr','≈ '+money(allowedRev));

    drawWaterfall(revenue, [['Mains O&amp;M',c_om],['Emergency service',c_emerg],['Connections',c_conn],['Customer &amp; admin',c_admin]], ebitda);
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
    s+=lbl(bx(0)+bw/2, y(rev), 'Allowed rev', money(rev), '#15201d');
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the return is too thin to value against the asset base, raise the allowed return or the RAB.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">RAB / entry</span> <b>'+money(capexGrossG)+'</b></span>'+
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
    sCap.min=E.rabMin; sCap.max=E.rabMax; sCap.step=E.rabStep; sCap.value=E.rabDef;
    sSpread.min=E.waccMin; sSpread.max=E.waccMax; sSpread.step=E.waccStep; sSpread.value=E.waccDef;
    sAvail.min=E.perfMin; sAvail.max=E.perfMax; sAvail.step=E.perfStep; sAvail.value=E.perfDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue uses the regulated building-block (return on RAB + depreciation + opex + incentive) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.rabDef; sSpread.value=E.waccDef; sAvail.value=E.perfDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'cadent');

  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
