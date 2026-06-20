/* Gas transmission, data-driven worked examples.
   Six real high-pressure gas networks, one template. Scene config from gt-geo.js
   (GEO), drawn as a top-down pipeline network in 720x520 scene coords. Figures are
   illustrative: revenue uses the regulated/contracted building-block (return on the
   asset base + depreciation + opex + incentive) and the returns model is a simplified DCF. */
(function(){
  var CUR='€';
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

  snam:{
    name:'Snam', geo:'Italy', continent:'Europe', cur:'€', geoKey:'snam',
    lede:'Europe\'s largest gas transmission operator and a textbook <b>listed, RAB-regulated TSO</b>, it owns the high-pressure pipelines and earns a regulated return, decoupled from how much gas flows.',
    s1:'<p class="body">Gas transmission is the <b>motorway of the gas system</b>: the large-diameter, high-pressure pipelines and <b>compressor stations</b> that move bulk gas from entry points, LNG terminals, import interconnectors and domestic fields, across the country to power stations, industry, storage and the <b>city gates</b> where the local distribution networks take over.</p>'+
       '<p class="body"><b>Snam</b> owns the Italian network and stakes in TSOs across Europe. Its revenue is set by the regulator (ARERA) on a <b>Regulated Asset Base (RAB)</b> basis: a return on capital at an allowed rate, plus depreciation and an opex allowance, with incentives. Capacity is booked by shippers on a <b>ship-or-pay</b> basis, so the cash flow is decoupled from actual flow. The forward story is <b>hydrogen and biomethane</b>, repurposing the grid, and a capex programme that grows the RAB.</p>',
    facts:[['~€22bn','Regulated Asset Base','inflation-linked'],['~75 bar','Pressure','high-pressure trunk'],['Ship-or-pay','Revenue','capacity-based'],['~72%','EBITDA margin','high, stable'],['ARERA','Regulator','RAB price control'],['H2-ready','Capex driver','hydrogen + biomethane']],
    s2:'Watch the network. Gas enters from an <b>LNG terminal</b>, an <b>interconnector</b> and a domestic field, is pushed along the trunk by <b>compressor stations</b>, and is drawn off to power, industry and the city gate. But the <b style="color:#0c6b4f">money</b> the owner earns rises from the <b>assets</b>, the pipelines and compressors, not from the molecules. Drag the RAB and allowed return; revenue tracks the <b>asset base and the regulator\'s return</b>, not the flow.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load Snam',
    try:'<b>Try this:</b> the <b>flow doesn\'t move the revenue</b>, capacity is booked ship-or-pay and the return is set on the RAB. Nudge the allowed return and watch revenue jump; the second engine is RAB <i>growth</i> as the grid is repurposed for hydrogen and biomethane.',
    s3:'Snam earns a <b>regulated allowed revenue</b> recovered through capacity charges, not a market price. The building blocks: a <b>return on the RAB</b> at the allowed WACC, <b>depreciation</b>, an <b>opex allowance</b>, and <b>incentives</b>. Because gas transmission is capital-heavy and lightly staffed, the margin is high and the cash flow, booked on long capacity contracts, is among the most stable in infrastructure. The question is the allowed return and the long-run role of gas (and hydrogen) in the energy mix.',
    mb:{tag:'Model B · RAB-regulated', title:'Listed regulated gas TSO', body:'A listed monopoly whose revenue is set by a regulator as a <b>return on its Regulated Asset Base</b> plus depreciation and an opex allowance, with capacity booked ship-or-pay. Inflation-protected, volume-decoupled, and repurposing for hydrogen. <b>This is Snam</b>, Europe\'s largest gas TSO.'},
    s4a:'A gas TSO\'s costs are pipeline and compressor maintenance, the energy to run the compressors, and a lean overhead, small against a revenue built mostly from the return on, and depreciation of, the asset base. The result is a high, stable margin and a cash flow that barely flexes with how much gas moves.',
    wfNote:'Operating cost is pipeline and compressor-station maintenance, compressor fuel/energy and overhead, modest against a RAB-based revenue. The margin is high and steady; the swing factor for value is the allowed return and RAB growth, not the throughput.',
    s4b:'The capital is the <b>~€22&nbsp;billion RAB</b>, thousands of kilometres of large-diameter pipeline, compressor stations and storage. The transition is reshaping the capex: repurposing for hydrogen and biomethane, plus security-of-supply investment (new LNG capacity), each pound added to the RAB and earning the allowed return.',
    stackH:'The capital base · ~€22bn RAB', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',60,'Regulated debt (~60% gearing)'],['s2',40,'Equity (listed)']],
    finList:[['','Regulated Asset Base','~€22bn'],['sub','Regulator','ARERA (RAB control)'],['','Allowed revenue','return + dep + opex + incentives'],['sub','Capacity','booked ship-or-pay'],['','Transition capex','hydrogen + biomethane + LNG'],['rest','Owner','listed (Borsa Italiana)']],
    finNote:'A RAB-regulated gas TSO is a <b>core-infrastructure cash flow</b>: inflation-linked, volume-decoupled, investment-grade. The equity return is steady and geared but capped, the debate is the <b>allowed WACC</b> and the long-run role of gas, against a hydrogen-repurposing upside.',
    timeline:[['1941','<b>Snam founded</b> as part of Italy\'s energy sector.'],['2001','<b>Listed</b> on the Italian exchange.'],['2012','<b>Unbundled from Eni</b>, an independent regulated TSO.'],['2020s','<b>European TSO stakes</b> and security-of-supply investment.'],['2022','<b>LNG &amp; supply diversification</b> after the energy crisis.'],['2020s','<b>Hydrogen-ready</b> network investment grows the RAB.']],
    calcNote:'A working model of a <b>RAB-regulated gas TSO</b>. The build/entry cost is the RAB, the unlevered return tracks the <b>allowed WACC</b>, and growth reflects the RAB compounding with transition capex. The revenue floor is high, core, regulated infrastructure.',
    s6:'Snam is a regulated monopoly with a hydrogen option. What moves the return:',
    breakers:['<b>The allowed WACC</b>, the regulator\'s cost-of-capital decision is the biggest lever.','<b>RAB growth</b>, hydrogen/biomethane repurposing and LNG capex compound the base.','<b>The role of gas</b>, the long-run demand for gas (and the hydrogen transition) sets the terminal value.','<b>Rates &amp; inflation</b>, a geared, inflation-linked RAB is sensitive to real rates.'],
    src:'Figures from public sources: <a href="https://www.snam.it/en/" target="_blank" rel="noopener">Snam</a> and ARERA disclosure. Figures are approximate and illustrative.',
    econ:{cur:'€',tp:75,press:'75 bar',
      rabDef:22,rabMin:8,rabMax:36,rabStep:0.5, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.4,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:0.9, anc:0},
    calc:{build:22000,grant:0,capex:35,revG:3,floor:2600,cap:4800,tax:24,exit:11,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.snam.footer}
  },

  williams:{
    name:'Williams (Transco)', geo:'US Gulf → North-East', continent:'North America', cur:'US$', geoKey:'williams',
    lede:'Owner of Transco, the largest gas pipeline in America, a <b>FERC-regulated</b> system that earns on <b>long-term contracted capacity</b> moving shale gas from the Gulf to the demand of the North-East.',
    s1:'<p class="body"><b>Williams</b> owns and operates <b>Transco</b>, the highest-throughput natural-gas pipeline in the United States, running from the Gulf Coast to New York. US interstate pipelines are regulated by the <b>Federal Energy Regulatory Commission (FERC)</b>, but the commercial model leans on <b>long-term firm contracts</b>: shippers book capacity for years or decades on a <b>take-or-pay</b> basis.</p>'+
       '<p class="body">That makes the cash flow look like a <b>toll on a contracted asset</b>: revenue is the capacity reservation charge, largely independent of how much gas actually flows, underpinned by investment-grade counterparties. The shale revolution turned the US into the world\'s biggest gas producer and LNG exporter, and Williams expands the system (compression, looping) to move it, each project entering the rate base under FERC oversight.</p>',
    facts:[['~$20bn','Asset base','Transco system'],['~1,000 psi','Pressure','high-pressure trunk'],['Take-or-pay','Revenue','long-term contracts'],['~65%','EBITDA margin','contracted'],['FERC','Regulator','cost-of-service + negotiated'],['Shale','Driver','Gulf → North-East']],
    s2:'The network is the same shape, entries, a trunk pushed by compressor stations, offtakes to power, industry and city gates, but here the revenue is <b>contracted capacity</b>: shippers pay to reserve space whether they use it or not. The <b style="color:#0c6b4f">return</b> rises from the contracted asset; drag the asset base and return to see what drives a US contracted pipeline.',
    driverLab:'Allowed / contracted return', availLab:'Recontracting', hrK:'Return on asset base', yrS:'contracted capacity revenue',
    preset:'Load Williams (Transco)',
    try:'<b>Try this:</b> the US model is <b>contracted capacity</b>, not a pure RAB, the return is set by long-term take-or-pay deals with investment-grade shippers. Push the recontracting lever: the key risk and lever is what happens when those contracts roll, and whether expansions get FERC approval and firm commitments.',
    s3:'Williams earns a <b>capacity reservation charge</b> on Transco under long-term firm contracts, overseen by FERC. Revenue is largely <b>decoupled from flow</b> (take-or-pay), underpinned by strong counterparties. Growth comes from <b>expansions</b>, compression and looping to move more shale gas, each requiring firm shipper commitments and FERC certificates. The case is a contracted, toll-like asset with recontracting and regulatory risk.',
    mb:{tag:'Model B · contracted pipeline', title:'FERC contracted pipeline', body:'An interstate pipeline regulated by FERC but earning on <b>long-term take-or-pay capacity contracts</b> with investment-grade shippers, toll-like, volume-decoupled cash flow, growing with FERC-approved expansions. <b>This is Williams</b>, owner of Transco, the largest US gas pipeline.'},
    s4a:'A long-haul pipeline runs lean, compressor fuel and maintenance against a large contracted revenue, so the margin is high. The defining feature is the <b>contract book</b>: long-dated take-or-pay deals that make the cash flow toll-like, and the expansions that grow the asset base.',
    wfNote:'Operating cost is compressor fuel, pipeline maintenance and overhead, modest against contracted capacity revenue. The swing factor is recontracting and expansion, not the gas that flows on any given day.',
    s4b:'The capital is the <b>~$20&nbsp;billion Transco system</b> plus a pipeline of expansion projects, financed on an investment-grade balance sheet. Each expansion needs firm shipper commitments and a FERC certificate; once built, it adds long-dated contracted cash flow.',
    stackH:'The capital base · Transco system', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',55,'Long-term debt'],['s2',45,'Equity (NYSE: WMB)']],
    finList:[['','Asset base (Transco)','~$20bn'],['sub','Regulator','FERC'],['','Revenue','long-term take-or-pay capacity'],['sub','Counterparties','investment-grade shippers'],['','Growth','compression + looping expansions'],['rest','Owner','NYSE-listed (WMB)']],
    finNote:'A US contracted pipeline is a <b>toll on a critical asset</b>: long-dated take-or-pay contracts make it bond-like, with upside from expansions. The risks are recontracting at scale, FERC approvals, and the long-run role of gas.',
    timeline:[['1950','<b>Transco pipeline</b> begins moving Gulf gas north.'],['1995','<b>Williams</b> consolidates major interstate systems.'],['2010s','<b>Shale boom</b> drives expansions to move Marcellus/Gulf gas.'],['2020s','<b>LNG export</b> growth lifts long-haul demand.'],['Ongoing','<b>Expansion projects</b> under firm contracts + FERC certificates.'],['Ongoing','<b>Recontracting</b> of long-term capacity.']],
    calcNote:'A working model of a <b>contracted US pipeline</b>. The return is set by long-term contracts (a touch higher than European RAB), the floor is high (take-or-pay), and growth reflects FERC-approved expansions.',
    s6:'Williams is a contracted toll on America\'s busiest gas highway. What drives it:',
    breakers:['<b>Recontracting</b>, rolling long-term capacity contracts is the central lever and risk.','<b>Expansions</b>, compression and looping projects (with firm commitments) grow the asset base.','<b>Counterparty credit</b>, take-or-pay is only as good as the shippers behind it.','<b>The role of gas</b>, long-run gas and LNG-export demand set the terminal value.'],
    src:'Figures from public sources: <a href="https://www.williams.com/" target="_blank" rel="noopener">Williams</a> and FERC disclosure on Transco. Figures are approximate and illustrative.',
    econ:{cur:'US$',tp:90,press:'1,000 psi',
      rabDef:20,rabMin:8,rabMax:36,rabStep:0.5, waccDef:7,waccMin:4,waccMax:11,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:1.2, anc:0},
    calc:{build:20000,grant:0,capex:25,revG:4,floor:2400,cap:4800,tax:25,exit:11,lev:5,rd:5,amort:1,hold:25},
    map:{footer:GEO.williams.footer}
  },

  tgs:{
    name:'TGS', geo:'Argentina', continent:'South America', cur:'US$', geoKey:'tgs',
    lede:'Argentina\'s largest gas pipeline operator, a <b>privatised, regulated</b> system that is the main takeaway for the giant <b>Vaca Muerta</b> shale play, priced against emerging-market risk.',
    s1:'<p class="body"><b>Transportadora de Gas del Sur (TGS)</b> owns the largest gas transmission network in Argentina and the southern cone, regulated by <b>ENARGAS</b>. It is the critical takeaway for <b>Vaca Muerta</b>, one of the world\'s largest shale gas resources, moving gas from Patagonia to Buenos Aires and, increasingly, toward export.</p>'+
       '<p class="body">The model is a privatised, regulated pipeline, but in an <b>emerging market</b>: tariffs have at times been frozen and then unfrozen with the political cycle, and the cash flow is carried against Argentine inflation, interest rates and currency. The upside is structural, Vaca Muerta volumes are growing fast and need pipes, but the discount rate is high, so a strong nominal return nets down once valued like an EM asset.</p>',
    facts:[['~$3bn','Asset base','largest in Argentina'],['~70 bar','Pressure','high-pressure trunk'],['Vaca Muerta','Driver','shale takeaway'],['~55%','EBITDA margin','EM-regulated'],['ENARGAS','Regulator','tariff (cycle risk)'],['Export','Upside','LNG / regional']],
    s2:'The pipeline shape is familiar, shale fields feed a trunk pushed by compressors to city gates and power, but here the prize is moving fast-growing <b>Vaca Muerta</b> gas, and the risk is the Argentine tariff and currency cycle. The <b style="color:#0c6b4f">return</b> rises from the asset; drag the levers, the upside is volumes, the risk is the discount rate.',
    driverLab:'Allowed return', availLab:'Tariff cycle', hrK:'Return on assets', yrS:'regulated tariff revenue',
    preset:'Load TGS',
    try:'<b>Try this:</b> the asset is structurally good, Vaca Muerta needs takeaway, but push the cost of debt and watch a high nominal Argentine return net down hard once discounted like an EM asset. In Argentina the tariff <i>cycle</i> (freezes and catch-ups) matters as much as the asset.',
    s3:'TGS earns a <b>regulated tariff</b> set by ENARGAS, plus a substantial <b>midstream / liquids</b> business. Revenue is capacity-based and decoupled from daily flow, but the <b>tariff has political-cycle risk</b> (freezes, then real-terms catch-ups). Growth is structural: Vaca Muerta expansion and potential LNG export need new pipe. The investor question is the <b>discount rate</b>, Argentine rates and the peso, far more than the asset.',
    mb:{tag:'Model B · EM pipeline', title:'Privatised regulated pipeline (EM)', body:'A privatised, regulated gas pipeline in an emerging market: capacity-based, regulated tariffs with political-cycle risk, structural volume upside from a giant shale play, but priced against high local rates and currency. <b>This is TGS</b>, Argentina\'s largest, the Vaca Muerta takeaway.'},
    s4a:'A long pipeline across Patagonia runs lean, but EM operating and a volatile macro mean the margin is lower and more variable than a developed TSO. The real determinant of value is not opex, it is the <b>tariff cycle</b> and the rate at which you discount an Argentine cash flow.',
    wfNote:'Operating cost is compressor fuel, maintenance and overhead across a long network. The margin is decent but the swing factors are the tariff cycle and the macro, not the cost line.',
    s4b:'The capital is the network plus Vaca Muerta expansion, financed by the sponsor and reinvested cash flow, against Argentine financing conditions. Modelled on an enterprise-value basis, the return is a <b>high-nominal emerging-market</b> one carried against local rates and the peso.',
    stackH:'The capital stack · EM pipeline', splitL:'Financing', splitR:'EM',
    split:[['s1',45,'Local / hard-currency debt'],['s2',55,'Sponsor equity']],
    finList:[['','Asset base','~$3bn'],['sub','Regulator','ENARGAS (tariff)'],['','Driver','Vaca Muerta takeaway'],['sub','Midstream / liquids','additional business'],['','Upside','LNG / regional export'],['rest','Risk','tariff cycle + currency']],
    finNote:'An Argentine pipeline is a <b>structurally good asset at an EM discount rate</b>: the volumes are coming, but the tariff cycle and the peso dominate the valuation. Get the entry price right and the upside is large; misjudge the macro and it bites.',
    timeline:[['1992','<b>Argentina privatises</b> gas; TGS created.'],['2000s','<b>Tariff freezes</b> through the macro crises.'],['2017','<b>Vaca Muerta</b> ramp begins to lift takeaway demand.'],['2023','<b>Néstor Kirchner pipeline</b> and expansions add capacity.'],['2024','<b>Tariff normalisation</b> under a new macro regime.'],['Ongoing','<b>Export ambitions</b> (LNG) shape long-run demand.']],
    calcNote:'A working model of an <b>EM regulated pipeline</b>, on an enterprise-value basis. The volume upside is real but the cost of debt is high to reflect Argentine rates, a strong nominal return nets down once discounted like an EM asset.',
    s6:'TGS is a structurally good asset at an Argentine discount rate. What drives it:',
    breakers:['<b>The tariff cycle</b>, ENARGAS freezes and catch-ups swing the regulated revenue.','<b>Country &amp; currency</b>, Argentine rates and the peso set the discount rate.','<b>Vaca Muerta volumes</b>, shale growth and export demand drive expansion.','<b>The entry price</b>, at an EM discount rate, what you pay decides the return.'],
    src:'Figures from public sources: <a href="https://www.tgs.com.ar/en" target="_blank" rel="noopener">TGS</a> and ENARGAS disclosure. Figures are approximate and illustrative.',
    econ:{cur:'US$',tp:30,press:'70 bar',
      rabDef:3,rabMin:1,rabMax:7,rabStep:0.25, waccDef:9,waccMin:5,waccMax:14,waccStep:0.25,
      perfDef:0.5,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.05, opexAllow:0.35, anc:0},
    calc:{build:3000,grant:0,capex:22,revG:6,floor:450,cap:1000,tax:35,exit:8,lev:3,rd:12,amort:3,hold:25},
    map:{footer:GEO.tgs.footer}
  },

  apa:{
    name:'APA Group', geo:'East-coast Australia', continent:'Oceania', cur:'A$', geoKey:'apa',
    lede:'Australia\'s largest gas-pipeline owner, a <b>listed</b> energy-infrastructure company earning mostly on <b>long-term contracts</b> under light-handed regulation.',
    s1:'<p class="body"><b>APA Group</b> owns and operates the bulk of Australia\'s gas-transmission pipelines, connecting the gas basins to the demand centres of the east coast and the LNG export plants of Queensland. It is <b>listed</b>, and most of its pipelines are <b>not heavily regulated</b>: revenue comes from <b>long-term contracts</b> with shippers, with the regulator (AER/ACCC) providing light-handed oversight and an information/arbitration backstop.</p>'+
       '<p class="body">That makes APA a <b>contracted energy-infrastructure</b> play: long-dated, inflation-linked revenue from creditworthy counterparties, plus a growing book of electricity transmission and renewables. The cash flow is toll-like and stable; the debates are recontracting, the long-run role of gas in Australia\'s transition, and APA\'s pivot into electricity and renewables.</p>',
    facts:[['~A$25bn','Asset base','largest gas network'],['~15 MPa','Pressure','high-pressure trunk'],['Contracts','Revenue','long-term, indexed'],['~72%','EBITDA margin','contracted'],['Light-handed','Regulation','AER / ACCC backstop'],['Diversifying','Strategy','+ electricity & renewables']],
    s2:'The shape is the same, basins feed a trunk pushed by compressors to power, industry and city gates, but APA\'s revenue is <b>contracted</b> and indexed, not a RAB. The <b style="color:#0c6b4f">return</b> rises from the contracted asset; drag the levers to see a listed, contracted pipeline business.',
    driverLab:'Contracted return', availLab:'Recontracting', hrK:'Return on asset base', yrS:'contracted pipeline revenue',
    preset:'Load APA Group',
    try:'<b>Try this:</b> APA is mostly <b>contracted, not regulated</b>, long-dated, inflation-linked deals set the return, with only light-handed oversight. Push the recontracting lever: the key questions are rolling those contracts and the long-run role of gas as Australia decarbonises (hence APA\'s pivot into electricity).',
    s3:'APA earns mostly <b>long-term contracted revenue</b> (inflation-linked, take-or-pay-like) from shippers, with light-handed regulation rather than a RAB. The cash flow is toll-like and stable. Growth comes from <b>expansions</b>, acquisitions, and a deliberate diversification into <b>electricity transmission and renewables</b>. The case is a contracted infrastructure compounder, with recontracting and energy-transition questions over the gas core.',
    mb:{tag:'Model B · contracted', title:'Listed contracted pipeline owner', body:'A listed owner of mostly-unregulated pipelines earning on <b>long-term, inflation-linked contracts</b> under light-handed oversight, diversifying into electricity and renewables. Toll-like and stable, with recontracting and transition risk on the gas core. <b>This is APA Group</b>.'},
    s4a:'APA runs an enormous network lean, so the margin is high. The defining feature is the <b>contract book</b>, long-dated, indexed revenue, and a growing pipeline of organic expansions and an electricity/renewables pivot that extends the asset\'s life beyond gas.',
    wfNote:'Operating cost is compressor fuel, maintenance and overhead, modest against contracted revenue. The swing factor is recontracting and growth capex, not daily throughput.',
    s4b:'The capital is the <b>~A$25&nbsp;billion</b> network, financed on a listed, investment-grade balance sheet, plus expansions and a deliberate build-out into electricity transmission and renewables, diversifying away from a pure-gas terminal value.',
    stackH:'The capital base · ~A$25bn network', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',60,'Long-dated debt'],['s2',40,'Equity (ASX: APA)']],
    finList:[['','Asset base','~A$25bn'],['sub','Regulation','light-handed (AER/ACCC)'],['','Revenue','long-term indexed contracts'],['sub','Diversification','electricity + renewables'],['','Growth','expansions + acquisitions'],['rest','Owner','ASX-listed (APA)']],
    finNote:'A listed contracted pipeline is a <b>toll-like compounder</b>: long-dated, indexed cash flow from strong counterparties, with growth from expansions and a transition pivot. The risks are recontracting and the long-run role of gas.',
    timeline:[['2000','<b>APA Group</b> formed and listed on the ASX.'],['2015','<b>Becomes the dominant</b> east-coast gas-transmission owner.'],['2018','<b>Foreign-takeover blocked</b>, APA stays Australian-listed.'],['2020s','<b>Diversifies</b> into electricity transmission and renewables.'],['2024','<b>Contract recontracting</b> and transition strategy in focus.'],['Ongoing','<b>Organic expansions</b> across the network.']],
    calcNote:'A working model of a <b>listed contracted pipeline</b>. The return is set by long-term indexed contracts, the floor is high (take-or-pay-like), and growth reflects expansions and the electricity/renewables pivot.',
    s6:'APA is a contracted compounder navigating the transition. What drives it:',
    breakers:['<b>Recontracting</b>, rolling long-term contracts is the central lever.','<b>The role of gas</b>, Australia\'s transition sets the gas terminal value; hence the electricity pivot.','<b>Growth capex</b>, expansions and the renewables build-out compound the base.','<b>Rates</b>, a geared, indexed cash flow is sensitive to interest rates.'],
    src:'Figures from public sources: <a href="https://www.apa.com.au/" target="_blank" rel="noopener">APA Group</a> and AER/ACCC disclosure. Figures are approximate and illustrative.',
    econ:{cur:'A$',tp:55,press:'15 MPa',
      rabDef:25,rabMin:10,rabMax:40,rabStep:0.5, waccDef:6,waccMin:3,waccMax:10,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:1.0, anc:0},
    calc:{build:25000,grant:0,capex:25,revG:4,floor:2800,cap:5500,tax:30,exit:12,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.apa.footer}
  },

  aramco:{
    name:'Aramco Gas Pipelines', geo:'Saudi Arabia', continent:'Middle East', cur:'US$', geoKey:'aramco',
    lede:'The backbone of Saudi Arabia\'s gas system, a <b>state network</b> whose usage rights were leased to an investor consortium on a 20-year <b>take-or-pay</b> deal, a landmark of infrastructure investing.',
    s1:'<p class="body">Saudi Aramco owns the kingdom\'s vast <b>gas-pipeline network</b>, moving processed gas to the power plants and petrochemical complexes that run the economy. In 2021 Aramco did a landmark deal: it leased the <b>usage rights</b> to the network to a consortium led by <b>EIG</b> (Aramco Gas Pipelines Company) for <b>$15.5&nbsp;billion</b>, while keeping ownership and operation.</p>'+
       '<p class="body">For the investors this is a near-perfect infrastructure cash flow: a <b>20-year take-or-pay tariff</b> paid by Aramco (an investment-grade counterparty) on the volumes shipped, with a floor, so the revenue is contracted, dollar-denominated and largely volume-insulated. It is the classic "lease the cash flow of a critical state asset" structure, and one of the largest energy-infrastructure deals ever done.</p>',
    facts:[['$15.5bn','2021 lease','EIG-led consortium'],['~100 bar','Pressure','national network'],['20-yr','Take-or-pay','tariff with floor'],['~79%','EBITDA margin','minimal opex'],['Aramco','Counterparty','investment-grade, state'],['US$','Currency','dollar-denominated']],
    s2:'The network moves the kingdom\'s gas to industry and power, but the investor doesn\'t run it, it holds a <b>20-year tariff</b> on the throughput, paid by Aramco with a floor. The <b style="color:#0c6b4f">return</b> is a contracted toll on a critical state asset. Drag the levers, this is about as stable a cash flow as infrastructure offers, dollar-denominated.',
    driverLab:'Contracted return', availLab:'Volume floor', hrK:'Tariff revenue', yrS:'20-year take-or-pay tariff',
    preset:'Load Aramco Gas Pipelines',
    try:'<b>Try this:</b> the cash flow barely flexes, it is a <b>take-or-pay tariff with a floor</b>, paid by an investment-grade counterparty for 20 years. So why isn\'t the return tiny? Because the consortium paid a keen entry price and used leverage; push the leverage and exit to see how a contracted toll is engineered into an equity return.',
    s3:'The consortium earns a <b>20-year take-or-pay tariff</b> on the gas shipped through the network, paid by Aramco, with a <b>minimum-volume floor</b> that insulates it from demand swings. There is essentially no operating business, Aramco operates the pipes, so the margin is extremely high and the cash flow contracted and dollar-denominated. The return is engineered through the entry price, leverage and the residual value at the end of the lease.',
    mb:{tag:'Model B · leased cash flow', title:'Leased usage-rights (take-or-pay)', body:'A consortium leases the <b>usage rights</b> to a critical state network for 20 years, earning a take-or-pay tariff with a volume floor from an investment-grade counterparty, while the state keeps ownership and operation. Bond-like, dollar-denominated, minimal opex. <b>This is Aramco Gas Pipelines</b>, the EIG-led $15.5bn deal.'},
    s4a:'There is almost no operating cost to the investor, Aramco runs the network, so the structure is nearly pure margin: the tariff in, a thin management cost, the rest is cash to service debt and equity. The "cost" in the case is the entry price and the financing, not opex.',
    wfNote:'Operating cost is minimal, the investor holds usage rights, not the operations. The structure is close to pure margin; the return is engineered through entry price, leverage and the lease residual, not through running cost.',
    s4b:'The headline is the <b>$15.5&nbsp;billion</b> paid in 2021 for the lease, funded with consortium equity and a large, long-dated debt package against the contracted tariff. At that price the deal was engineered to a target equity return; the residual value at the end of the 20-year lease is a key variable.',
    stackH:'The capital stack · $15.5bn lease', splitL:'Consortium', splitR:'ownership',
    split:[['s1',60,'Long-dated debt'],['s2',40,'EIG-led equity']],
    finList:[['','2021 lease','$15.5bn'],['sub','Term','20-year take-or-pay'],['sub','Counterparty','Aramco (investment-grade)'],['','Volume floor','demand insulation'],['','Operation','retained by Aramco'],['rest','Currency','US$']],
    finNote:'A leased usage-rights deal is a <b>bond-like equity</b>: a 20-year take-or-pay tariff from a strong counterparty, geared into an equity return. The risks are the residual value at handback, the counterparty, and refinancing the debt.',
    timeline:[['—','<b>Aramco builds</b> the kingdom\'s national gas network over decades.'],['2021','<b>Usage rights leased</b> for $15.5bn to an EIG-led consortium.'],['2021','<b>20-year take-or-pay tariff</b> with a volume floor begins.'],['2020s','<b>Gas expansion</b> (Jafurah) lifts long-run volumes.'],['Ongoing','<b>Dollar-denominated</b> contracted cash flow.'],['~2041','<b>Lease residual</b> / handback, a key terminal value.']],
    calcNote:'A working model of a <b>leased take-or-pay tariff</b>. Opex is minimal, the floor is high (volume floor), tax is low, and the return is engineered through the entry price, leverage and the lease residual. A near-bond cash flow turned into an equity return.',
    s6:'Aramco Gas Pipelines is a contracted toll on a critical state asset. What drives it:',
    breakers:['<b>The entry price &amp; leverage</b>, at a contracted tariff, the price paid and gearing set the equity return.','<b>The residual value</b>, what the lease is worth at handback in ~20 years.','<b>Counterparty</b>, the tariff is only as good as Aramco\'s credit (strong).','<b>Refinancing</b>, a large, long-dated debt package must be refinanced over the life.'],
    src:'Figures from public sources: reporting on the 2021 <a href="https://www.eigpartners.com/" target="_blank" rel="noopener">EIG-led Aramco Gas Pipelines</a> lease. Figures are approximate and illustrative.',
    econ:{cur:'US$',tp:120,press:'100 bar',
      rabDef:30,rabMin:12,rabMax:48,rabStep:0.5, waccDef:6.5,waccMin:3,waccMax:10,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:0.6, anc:0},
    calc:{build:30000,grant:0,capex:18,revG:2,floor:3600,cap:6500,tax:5,exit:9,lev:5,rd:4.5,amort:3,hold:20},
    map:{footer:GEO.aramco.footer}
  },

  pipechina:{
    name:'PipeChina', geo:'China', continent:'China', cur:'¥', geoKey:'pipechina',
    lede:'China\'s national gas-pipeline champion, a <b>state-owned</b> network created to consolidate the country\'s trunk pipelines, LNG terminals and storage into one open-access system.',
    s1:'<p class="body"><b>PipeChina</b> (National Pipeline Network Group) was created in 2019 to consolidate the gas (and oil) trunk pipelines, LNG import terminals and storage previously owned by the state oil majors into a single, <b>open-access</b> national network. It moves imported LNG, piped imports and domestic gas across the country, including the great <b>west-to-east</b> pipelines.</p>'+
       '<p class="body">It is <b>state-owned</b>, with tariffs regulated by the national authorities (NDRC/NEA). The strategic purpose is to <b>separate transport from supply</b>, letting any shipper book capacity, and to build out the infrastructure for a fast-growing gas market and security of supply. The allowed return is set by the state, the cost of capital is low, and the build-out (pipelines, LNG, storage) is enormous, growing the asset base.</p>',
    facts:[['vast','Asset base','national network'],['~10 MPa','Pressure','west–east trunks'],['Open access','Model','transport unbundled'],['~71%','EBITDA margin','regulated'],['NDRC / NEA','Regulator','state framework'],['LNG + imports','Drivers','+ storage build-out']],
    s2:'A national network moving LNG, piped imports and domestic gas across the country, open-access, so any shipper can book capacity. The <b style="color:#0c6b4f">return</b> rises from a colossal regulated asset base; at this scale a thin return is an enormous cash flow. Drag the levers, scale and build-out, not price, are the model.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on assets', yrS:'regulated transport revenue',
    preset:'Load PipeChina',
    try:'<b>Try this:</b> the allowed return on a <b>state-backed</b> network is thin, but the asset base is vast and growing fast (LNG terminals, storage, west-to-east pipe). Scale and the build-out, not price, are the model. The cost of capital is very low because the owner is the state.',
    s3:'PipeChina earns a <b>regulated transport tariff</b> within China\'s framework, a return on a colossal asset base, depreciation and an opex allowance, with capacity booked open-access. The dominant lever is <b>scale and capex</b>: building out pipelines, LNG terminals and storage for a fast-growing gas market. The allowed return is thin, but applied to a vast, growing base at a state cost of capital, it compounds into a large, stable cash flow.',
    mb:{tag:'Model B · state-owned scale', title:'State-owned national network', body:'A state-owned, open-access national pipeline network earning a thin regulated return on a colossal, fast-growing asset base, financed at a very low state cost of capital, and building out LNG, storage and west-to-east capacity. Immense and strategically central, but state-directed. <b>This is PipeChina</b>.'},
    s4a:'At national scale the cost base is large in absolute terms but small relative to a colossal asset base, so the margin is high. The dominant number is the <b>capital</b> of the build-out, pipelines, LNG terminals, storage, on which the state allows a regulated return at a very low cost of capital.',
    wfNote:'Operating cost is the O&M of a national network plus compressor energy, large in absolute terms but small against the revenue from a colossal asset base. State backing keeps the cost of capital, and so the allowed return, low.',
    s4b:'The capital is on a national scale, trunk pipelines, LNG import terminals and storage consolidated into one network, with a vast forward build-out. It is financed on a state-backed balance sheet that can mobilise capital at a scale few can match, and the build-out adds to the base every year.',
    stackH:'The capital base · national network', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Chinese state, sovereign-backed']],
    finList:[['','Asset base','vast, national network'],['sub','Regulator','NDRC / NEA (state framework)'],['','Model','open-access (transport unbundled)'],['sub','Drivers','LNG + imports + storage'],['','Mission','west-to-east + security of supply'],['rest','Cost of capital','very low (state)']],
    finNote:'A state national pipeline is a <b>strategic asset at continental scale</b>: a thin regulated return on a colossal, fast-growing base, financed at a very low cost of capital, central to China\'s gas market and security of supply. The return is steady and immense in absolute terms; the owner is the state.',
    timeline:[['2019','<b>PipeChina established</b> to consolidate the national network.'],['2020','<b>Assets transferred</b> from the state oil majors.'],['2020s','<b>Open access</b> opens capacity to all shippers.'],['2020s','<b>LNG &amp; storage build-out</b> for a growing gas market.'],['Ongoing','<b>West-to-east</b> pipeline expansion.'],['Ongoing','<b>State-directed</b> investment and tariffs.']],
    calcNote:'A working model of a <b>state-owned national network</b>, on an enterprise-value basis. The allowed return is thin and the cost of capital very low (state-backed), but the asset base is vast and growing fast, so the absolute return is enormous and steady. Figures are highly illustrative.',
    s6:'PipeChina is scale plus build-out under state ownership. What drives it:',
    breakers:['<b>Scale &amp; asset base</b>, a thin return on a vast, growing base; growth from LNG, storage and pipe.','<b>Cost of capital</b>, state backing keeps it very low, lifting the value of a thin return.','<b>Open access</b>, unbundling transport from supply reshapes how capacity is booked.','<b>State direction</b>, policy, not shareholders, sets strategy and the allowed return.'],
    src:'Figures from public sources: reporting on <a href="http://www.pipechina.com.cn/" target="_blank" rel="noopener">PipeChina</a>. Given the scale and limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥',tp:300,press:'10 MPa',
      rabDef:600,rabMin:250,rabMax:1100,rabStep:10, waccDef:5,waccMin:3,waccMax:8,waccStep:0.25,
      perfDef:0.2,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:22, anc:0},
    calc:{build:600000,grant:0,capex:30,revG:5,floor:60000,cap:120000,tax:25,exit:11,lev:4,rd:4,amort:2,hold:25},
    map:{footer:GEO.pipechina.footer}
  }
  };
  var ORDER=['snam','williams','tgs','apa','aramco','pipechina'];

  /* ===================================================================
     GAS NETWORK RENDERER  (canvas, 720x520), top-down pipeline, daytime
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var TRUNK_Y=256, TX0=150, TX1=662;
  var ENTRY_X=64;

  function drawBase(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e3e8dd'); g.addColorStop(1,'#d6decf');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // sea strip on the left (for LNG terminal / offshore field)
    var sg=ctx.createLinearGradient(0,0,120,0); sg.addColorStop(0,'#bcdcea'); sg.addColorStop(1,'rgba(188,220,234,0)');
    ctx.fillStyle=sg; ctx.fillRect(0,0,120,H);
    ctx.strokeStyle='rgba(120,160,190,0.25)'; ctx.lineWidth=1;
    for(var y=24;y<H;y+=26){ ctx.beginPath(); for(var x=0;x<116;x+=20){ ctx.moveTo(x,y+Math.sin((x+T)*0.05)*1.5); ctx.lineTo(x+10,y+Math.sin((x+10+T)*0.05)*1.5);} ctx.stroke(); }
  }

  /* ---- pipes ---- */
  function pipe(pts,w){
    ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.strokeStyle='rgba(20,30,28,0.16)'; ctx.lineWidth=w+3; stroke(pts);
    ctx.strokeStyle='#9aa19a'; ctx.lineWidth=w; stroke(pts);
    ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=Math.max(1,w*0.3); stroke(pts);
  }
  function stroke(pts){ ctx.beginPath(); pts.forEach(function(p,i){ i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); }); ctx.stroke(); }
  function flowPulses(pts,speed,load,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    var n=Math.max(2,Math.round(3+load*6));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],4,'rgba(255,180,90,0.7)'); ctx.fillStyle='rgba(255,225,170,0.95)'; ctx.beginPath(); ctx.arc(p[0],p[1],1.6,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- entries ---- */
  function lngTerminal(x,y){
    for(var i=0;i<2;i++){ var tx=x-10+i*20; ctx.fillStyle='rgba(20,30,28,0.12)'; ctx.beginPath(); ctx.ellipse(tx,y+12,9,2.4,0,0,Math.PI*2); ctx.fill();
      var g=ctx.createLinearGradient(tx-8,0,tx+8,0); g.addColorStop(0,'#cfd6d2'); g.addColorStop(1,'#aeb5b0'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(tx,y,8,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(120,130,125,0.6)'; ctx.lineWidth=0.8; ctx.stroke(); }
    // jetty + tanker on the sea (left)
    ctx.strokeStyle='#8a918c'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x-18,y); ctx.lineTo(40,y); ctx.stroke();
    ctx.fillStyle='#3a4048'; rr(20,y-4,22,8,2); ctx.fill(); ctx.fillStyle='#b0392f'; rr(24,y-2.5,14,3,1); ctx.fill();
    label('LNG TERMINAL',x,y-16);
  }
  function gasField(x,y){
    // offshore platform on the sea
    ctx.fillStyle='#7d847f'; rr(x-9,y-4,18,12,1); ctx.fill();
    ctx.strokeStyle='#6b726b'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x-9,y+8); ctx.lineTo(x-6,y+16); ctx.moveTo(x+9,y+8); ctx.lineTo(x+6,y+16); ctx.stroke();
    ctx.strokeStyle='#9aa19a'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(x,y-4); ctx.lineTo(x,y-14); ctx.stroke();   // derrick
    if(Math.sin(T*0.1+x)>0.5){ glow(x,y-15,5,'rgba(255,140,60,0.7)'); }  // flare
    label('GAS FIELD',x,y-20);
  }
  function interconnectorIn(x,y){
    ctx.fillStyle='#0c6b4f'; rr(x-2,y-10,4,8,1); ctx.fill();
    ctx.strokeStyle='#9aa19a'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(x-14,y); ctx.lineTo(x,y); ctx.stroke();
    label('INTERCONNECTOR',x,y-14);
  }
  function label(t,x,y){ ctx.fillStyle='rgba(70,90,80,0.78)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(t,x,y); }

  /* ---- compressor station ---- */
  function compressor(x){
    ctx.fillStyle='rgba(20,30,28,0.12)'; ctx.beginPath(); ctx.ellipse(x,TRUNK_Y+13,12,3,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#cfd3ca'; rr(x-12,TRUNK_Y-13,24,26,3); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // rotating turbine symbol
    ctx.save(); ctx.translate(x,TRUNK_Y-2); ctx.strokeStyle='#5a615d'; ctx.lineWidth=1.4;
    for(var b=0;b<4;b++){ ctx.save(); ctx.rotate(T*0.18+b*Math.PI/2); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-6); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle='#3a4048'; ctx.beginPath(); ctx.arc(0,0,1.6,0,Math.PI*2); ctx.fill(); ctx.restore();
    glow(x,TRUNK_Y-2,7,'rgba(120,200,255,0.18)');
    label('COMPRESSOR',x,TRUNK_Y+24);
  }

  /* ---- offtakes ---- */
  function powerStation(x,y){
    ctx.fillStyle='#10182c'; // (kept light) override:
    ctx.fillStyle='#cfd2d0'; ctx.beginPath();
    ctx.moveTo(x-10,y); ctx.quadraticCurveTo(x-4,y-16,x-7,y-26); ctx.lineTo(x+7,y-26); ctx.quadraticCurveTo(x+4,y-16,x+10,y); ctx.closePath(); ctx.fill();
    for(var i=0;i<3;i++){ var t=(T*0.5+i*22)%66, yy=y-26-t*0.8, a=Math.max(0,0.3-t*0.004); ctx.fillStyle='rgba(255,255,255,'+a+')'; ctx.beginPath(); ctx.arc(x-2+Math.sin(t*0.1)*4,yy,4+t*0.1,0,Math.PI*2); ctx.fill(); }
    ctx.fillStyle='#8a8f8c'; rr(x+10,y-16,16,16,1); ctx.fill();
    label('POWER',x+4,y+12);
  }
  function industryGas(x,y){
    ctx.fillStyle='#9aa0a0'; rr(x-16,y-18,46,18,2); ctx.fill();
    ctx.fillStyle='#8a8f8c'; for(var i=0;i<2;i++){ rr(x-12+i*16,y-30,5,12,1); ctx.fill(); }
    label('INDUSTRY',x+7,y+12);
  }
  function cityGate(x,y){
    // pressure-reduction + a little town
    ctx.fillStyle='#8a8f86'; rr(x-12,y-8,10,10,1.5); ctx.fill();
    ctx.fillStyle='#b8755a'; rr(x+2,y-12,8,14,1); ctx.fill(); ctx.fillStyle='#cfae8a'; rr(x+12,y-9,7,11,1); ctx.fill();
    label('CITY GATE',x+2,y+12);
  }
  function storage(x,y){
    for(var i=0;i<2;i++){ var sx=x-8+i*16; ctx.fillStyle='rgba(20,30,28,0.10)'; ctx.beginPath(); ctx.ellipse(sx,y+6,7,2,0,0,Math.PI*2); ctx.fill();
      var g=ctx.createLinearGradient(sx-7,0,sx+7,0); g.addColorStop(0,'#cfd6d2'); g.addColorStop(1,'#a8afaa'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(sx,y,7,Math.PI,0); ctx.fill(); rr(sx-7,y,14,6,0); ctx.fill(); }
    label('STORAGE',x,y-14);
  }

  /* ---- economic overlay (shared style) ---- */
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
  function drawThru(load){
    var pw=130,ph=44,px=W-pw-16,py=14;
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('GAS THROUGHPUT',px+11,py+14);
    ctx.fillStyle='rgba(47,125,84,0.95)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(Math.round(load*100)+'%',px+pw-11,py+14);
    var gx=px+11, gw=pw-22, gy=py+ph-9, gh=18;
    ctx.strokeStyle='rgba(47,125,84,0.35)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+gw,gy); ctx.stroke();
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
    var load=0.55+0.35*Math.sin(T*0.011)+0.06*Math.sin(T*0.05); load=Math.max(0.15,Math.min(1,load));

    ctx.clearRect(0,0,W,H);
    drawBase();

    // entries on the left, feeding a manifold into the trunk
    var ents=G.entries||['lng'], eys=[]; var n=ents.length;
    for(var i=0;i<n;i++){ var ey=TRUNK_Y-70+ (n>1? i/(n-1)*140 : 0); eys.push(ey);
      pipe([[ENTRY_X,ey],[TX0,ey],[TX0,TRUNK_Y]],4); }
    // trunk
    pipe([[TX0,TRUNK_Y],[TX1,TRUNK_Y]],7);

    // offtakes along the trunk
    var offs=G.offtakes||['power','industry','citygate'];
    var oxs=[]; for(var o=0;o<offs.length;o++){ var ox=TX0+90+ (TX1-TX0-150)*(offs.length>1?o/(offs.length-1):0.5); oxs.push(ox);
      var up=(o%2===0); var oy=up?TRUNK_Y-86:TRUNK_Y+86;
      pipe([[ox,TRUNK_Y],[ox,oy]],3); }
    if(G.storage) pipe([[TX1-30,TRUNK_Y],[TX1-30,TRUNK_Y+90]],3);

    // compressor stations spaced along the trunk
    var cN=G.compressors||3; for(var c=0;c<cN;c++){ var cx=TX0+70+(TX1-TX0-140)*(cN>1?c/(cN-1):0.5); compressor(cx); }

    // gas flow: along entries → trunk → offtakes
    for(i=0;i<n;i++){ flowPulses([[ENTRY_X,eys[i]],[TX0,eys[i]],[TX0,TRUNK_Y]],0.8+load,load,false); }
    flowPulses([[TX0,TRUNK_Y],[TX1,TRUNK_Y]],0.7+load,load,false);
    for(o=0;o<offs.length;o++){ var up2=(o%2===0); var oy2=up2?TRUNK_Y-86:TRUNK_Y+86; flowPulses([[oxs[o],TRUNK_Y],[oxs[o],oy2]],0.9+load,load,false); }

    // draw entries
    for(i=0;i<n;i++){ var t=ents[i], ex=ENTRY_X, ey3=eys[i];
      if(t==='lng') lngTerminal(ex,ey3); else if(t==='field') gasField(ex,ey3); else interconnectorIn(ex,ey3); }
    // draw offtakes
    for(o=0;o<offs.length;o++){ var ot=offs[o], oxx=oxs[o], up3=(o%2===0), oyy=up3?TRUNK_Y-86:TRUNK_Y+86;
      if(ot==='power') powerStation(oxx,oyy); else if(ot==='industry') industryGas(oxx,oyy); else cityGate(oxx,oyy); }
    if(G.storage) storage(TX1-30,TRUNK_Y+96);

    // ---- economics (annual, regulated/contracted building-block) ----
    var returnRev=wacc*RAB, depRev=E.depRate*RAB, opexAllow=E.opexAllow*1e9, incentive=perf*RAB;
    var allowedRev=returnRev+depRev+opexAllow+incentive+(E.anc||0)*1e9;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,allowedRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var actualOpex=opexAllow;
    var c_om=actualOpex*0.40, c_fuel=actualOpex*0.26, c_maint=actualOpex*0.18, c_admin=actualOpex*0.16;
    var ebitda=revenue-actualOpex;
    baseRevYr=revenue; baseCostYr=actualOpex; baseEbYr=ebitda;
    var retShare=(returnRev+incentive)/Math.max(1,(returnRev+incentive+depRev+opexAllow));

    if(_anim){
      var src=[]; for(c=0;c<cN;c++){ src.push([TX0+70+(TX1-TX0-140)*(cN>1?c/(cN-1):0.5),TRUNK_Y-14]); } src.push([TX0,TRUNK_Y-14]);
      if(Math.random()<0.6){ var s1=src[(Math.random()*src.length)|0]; spawnCoin(s1[0],s1[1], Math.random()<retShare?'ret':'rec', -1); }
      var outRate=Math.max(0.04,Math.min(0.5, actualOpex/Math.max(1,revenue)));
      if(Math.random()<outRate){ var s2=src[(Math.random()*src.length)|0]; spawnCoin(s2[0],s2[1]+6,'cost',1); }
      demHist.push(load); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, actualOpex);
    drawThru(load);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+(E.press||'')+' · RAB '+fmtBn(rabBn),W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // readouts
    set('ixCapV',fmtBn(rabBn)); set('ixSpreadV',(Math.round(wacc*1000)/10)+'%'); set('ixAvailV',pctS(perf*100));
    set('ixDir',fmtBn(rabBn)); set('ixDirS','inflation-protected · grows with capex');
    set('ixMW',E.tp+' bcm'); set('ixMWs',(E.press||'')+' · firm capacity');
    set('ixHr', money(returnRev)); set('ixYr','≈ '+money(allowedRev));

    drawWaterfall(revenue, [['Network O&amp;M',c_om],['Compressor fuel',c_fuel],['Maintenance',c_maint],['Admin &amp; overhead',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the return is too thin to value against the asset base, raise the allowed return or the asset base.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Asset base / entry</span> <b>'+money(capexGrossG)+'</b></span>'+
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue uses the regulated/contracted building-block (return on the asset base + depreciation + opex + incentive) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'snam');

  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
