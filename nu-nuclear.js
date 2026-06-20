/* Nuclear power, data-driven worked examples.
   Six real (and one illustrative) nuclear generation businesses, one template.
   Scene config from nu-geo.js (GEO), drawn as a nuclear power station in 720x520
   scene coords: one or two reactor containment domes beside a turbine hall and a
   body of cooling water, big cooling towers emitting slow rising steam, and a
   switchyard with transmission lines carrying the steady output away.

   The economics are firm baseload generation: an enormous up-front capex and a
   long build, then decades of near-constant output (a very high, steady capacity
   factor) sold under a long contract, a CfD, a RAB, a regulated cost-of-service
   tariff or a long PPA. Revenue is capacity × hours × capacity factor × price,
   floored by the contract; fuel cost is low per MWh but fixed O&M is substantial.
   The returns model is a simplified DCF: the huge capex is the story, and the
   contract is what makes it financeable. */
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

  /* ---------- 1 · HINKLEY POINT C (Europe · EPR · CfD + RAB) ---------- */
  hinkley:{
    name:'Hinkley Point C', geo:'Somerset, United Kingdom', continent:'Europe', cur:'£', geoKey:'hinkley',
    lede:'The UK\'s flagship new nuclear plant, two <b>EPR reactors</b> built under a <b>Contract for Difference</b>, the most capital-intensive infrastructure project in the country, and the template for how a megaproject becomes financeable.',
    s1:'<p class="body"><b>Hinkley Point C</b> is two <b>EPR reactors</b> (~3.2 GW) being built on the Somerset coast by EDF (with CGN). It is <b>firm baseload</b>: once running, it produces near-constant low-carbon power for ~60 years at a very high capacity factor. The defining feature is its scale, an enormous up-front capex (well above £30bn) and a long, difficult construction.</p>'+
       '<p class="body">What makes that capex financeable is the <b>contract</b>. Hinkley sells its output under a <b>Contract for Difference (CfD)</b>, a 35-year indexed strike price that removes wholesale price risk. The UK\'s next plant, <b>Sizewell C</b>, switches to a <b>Regulated Asset Base (RAB)</b> model, letting the project earn a return on capital <i>during</i> construction and so lowering the cost of capital. Either way the lesson is the same: nuclear\'s economics live or die on the contract, and its risk is <b>construction cost overruns</b>.</p>',
    facts:[['~3.2 GW','Capacity','two EPR units'],['CfD','Contract','35-yr indexed strike'],['~60 yrs','Life','firm baseload'],['£30bn+','Capex','most capital-intensive'],['~90%','Capacity factor','very high, steady'],['Overruns','Risk','construction cost']],
    s2:'Watch the station. The <b>reactor domes</b> and turbine hall sit beside the sea, the <b>cooling system</b> rejects heat to the water, and the <b>switchyard</b> sends a near-constant stream of power out along the transmission lines (cyan), steady because the capacity factor is high and flat. The owner\'s <b style="color:#0c6b4f">margin</b> is the contracted power revenue less fuel and a substantial fixed O&amp;M. Drag the capacity, the strike price and the capacity factor.',
    driverLab:'Price / strike', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'capacity × hours × CF × price',
    ledge:{a:'+ power (CfD)',b:'+ capacity',c:'− fuel & O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> the <b>CfD floor</b> is the whole point. Drop the price slider and watch revenue hold, the contract removes wholesale price risk, which is what lets a £30bn build be financed. Then notice the capacity factor: nuclear runs flat at ~90%, so the output barely moves. The lever is not price or volume but the <b>capex</b> and the cost of capital the contract unlocks.',
    s3:'Hinkley earns a contracted <b>strike price</b> on every MWh, indexed to inflation for 35 years under its <b>CfD</b>. Output is firm and steady at a high capacity factor, so revenue is a long, predictable annuity. Fuel cost per MWh is low; the substantial cost is <b>fixed O&amp;M</b> and the colossal up-front capex. The investor question is not the margin, it is whether the capex and the build risk can be carried at a cost of capital the contract supports.',
    mb:{tag:'Model B · contract for difference', title:'EPR new-build under a CfD', body:'Two EPR reactors selling firm baseload under a 35-year indexed strike price that removes wholesale price risk, an enormous capex made financeable by a long contract, with construction cost overruns as the defining risk. <b>This is Hinkley Point C</b>; Sizewell C moves to a RAB model.'},
    s4a:'Fuel is a <b>low</b> cost per MWh, nuclear fuel is cheap relative to output, so the dominant operating cost is <b>fixed O&amp;M</b>: a large, skilled operating workforce, security, waste and decommissioning provisions. The result is a high EBITDA margin on the contracted revenue; the real cost story is the up-front capital, not the running cost.',
    wfNote:'Operating cost is mostly fixed O&amp;M (operations, security, waste, decommissioning provisions) plus a low per-MWh fuel cost. The margin is high, but the economics are dominated by the up-front capex, financed against the CfD.',
    s4b:'The capital is the reactors, turbine hall, cooling system and grid connection, tens of billions, over a long build. The state contribution and the contract structure (CfD here, RAB at Sizewell) are what make it financeable: RAB in particular lets the project earn a return on capital during construction, lowering the cost of capital on the largest capex in UK infrastructure.',
    stackH:'The capital · reactors + build', splitL:'Financing', splitR:'contracted',
    split:[['s1',60,'Project / RAB debt'],['s2',40,'Equity (EDF / CGN)']],
    finList:[['','Reactors','two EPR (~3.2 GW)'],['sub','Contract','35-yr CfD (indexed strike)'],['','Capex','£30bn+ (most capital-intensive)'],['sub','Capacity factor','~90%, firm baseload'],['','Owner','EDF (with CGN)'],['rest','Next','Sizewell C on a RAB model']],
    finNote:'Hinkley is a <b>contracted megaproject</b>: a vast capex made financeable by a 35-year CfD on firm baseload output. The margin is high and the revenue certain; the return lives on the capex, the build risk and the cost of capital the contract unlocks.',
    timeline:[['2008','<b>EDF</b> acquires British Energy; new-build programme begins.'],['2013','<b>CfD strike</b> agreed (~£92.50/MWh, 2012 prices, indexed).'],['2016','<b>Final investment decision</b>, construction starts.'],['2020s','<b>Cost &amp; schedule overruns</b> push capex above £30bn.'],['2022','<b>Sizewell C</b> advanced on a RAB model.'],['Mid-2020s+','<b>First power</b> targeted; ~60-year operating life.']],
    calcNote:'A working model of a <b>CfD-backed nuclear new-build</b>. Revenue is capacity × hours × capacity factor × strike price, floored by the CfD so price risk is removed. Fuel is low per MWh; fixed O&amp;M is high. The huge capex (net of any state contribution) is the story, the contract is what finances it.',
    s6:'Hinkley is the contracted megaproject. What drives it:',
    breakers:['<b>The contract</b>, a 35-year indexed CfD (or a RAB) removes price risk and finances the capex.','<b>Capex &amp; overruns</b>, the build cost and schedule are the dominant risk and value driver.','<b>Capacity factor</b>, firm, high, steady output is what makes the annuity reliable.','<b>Cost of capital</b>, the lower the financing rate (RAB helps), the more valuable the asset.'],
    src:'Figures from public sources on <a href="https://www.edfenergy.com/energy/nuclear-new-build-projects/hinkley-point-c" target="_blank" rel="noopener">Hinkley Point C</a> and the UK CfD / RAB nuclear frameworks. Figures are approximate and illustrative.',
    econ:{cur:'£', source:'EPR · CfD',
      mwDef:3200,mwMin:1600,mwMax:3400,mwStep:50, priceDef:128,priceMin:70,priceMax:180,priceStep:1,
      cfDef:90,cfMin:75,cfMax:93,cfStep:1, fuelCost:7, omPerMW:0, fixedOM:680},
    calc:{build:35000,grant:6000,capex:3,revG:2,floor:2900,cap:5200,tax:25,exit:12,lev:4,rd:5,amort:3,hold:20},
    map:{footer:GEO.hinkley.footer}
  },

  /* ---------- 2 · VOGTLE 3 & 4 (North America · AP1000 · regulated) ---------- */
  vogtle:{
    name:'Vogtle 3 & 4', geo:'Georgia, USA', continent:'North America', cur:'US$', geoKey:'vogtle',
    lede:'The first new US nuclear units in decades, two <b>AP1000 reactors</b> built under a <b>regulated cost-of-service</b> utility, on-budget on paper but badly overrun in practice.',
    s1:'<p class="body"><b>Vogtle Units 3 &amp; 4</b> are two <b>AP1000 reactors</b> (~2.2 GW) at the Vogtle site in Georgia, completed in 2023–24, the first newly-built US nuclear units in a generation. They are firm baseload, running at a very high capacity factor for ~60–80 years.</p>'+
       '<p class="body">The financing model is a <b>regulated cost-of-service utility</b>: Georgia Power (a Southern Company subsidiary) builds the plant into its <b>rate base</b> and earns a regulated return on the prudently-incurred capital, recovered from ratepayers. That is the US analogue of a RAB, it lets a regulated utility finance an enormous capex. The cautionary tale is the <b>cost overrun</b>: the project ran years late and more than doubled in cost, a textbook case of nuclear construction risk.</p>',
    facts:[['~2.2 GW','Capacity','two AP1000 units'],['Cost-of-service','Model','rate base return'],['First in decades','Milestone','US new-build'],['Overran badly','Risk','years late, 2× cost'],['~90%+','Capacity factor','firm baseload'],['Georgia Power','Owner','Southern Company']],
    s2:'Watch the station. Two <b>AP1000 domes</b> beside the turbine hall, big <b>cooling towers</b> venting slow steam, and a <b>switchyard</b> sending steady power out (cyan) at a high, flat capacity factor. The owner earns a <b style="color:#0c6b4f">regulated return</b> on the capital in its rate base, less low fuel and substantial fixed O&amp;M. Drag the capacity, the price and the capacity factor.',
    driverLab:'Price / tariff', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'capacity × hours × CF × tariff',
    ledge:{a:'+ power (reg.)',b:'+ capacity',c:'− fuel & O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> in a <b>cost-of-service</b> model the recovery is set to the rate base, so revenue is contracted-like (the floor binds) regardless of the wholesale price, drop the price and watch it hold. The capacity factor is high and flat. The story, as Vogtle showed, is the <b>capex</b>: a project that doubled in cost still earns on the prudently-recovered base, but the overrun is the risk.',
    s3:'Vogtle recovers its cost through a <b>regulated rate base</b>: the utility earns an allowed return on the prudently-incurred capital, recovered from customers, so the revenue is stable and contracted-like rather than merchant. Output is firm at a high capacity factor; fuel is cheap, fixed O&amp;M substantial. The investor question is the <b>capex and whether it is recovered</b>, Vogtle\'s overruns tested exactly that.',
    mb:{tag:'Model B · regulated cost-of-service', title:'AP1000 in a regulated rate base', body:'Two AP1000 reactors built into a regulated utility\'s rate base, earning an allowed return on prudently-incurred capital recovered from ratepayers, the US analogue of a RAB. Firm baseload, stable revenue, but a costly, much-delayed build. <b>This is Vogtle 3 &amp; 4</b>, Georgia Power / Southern Company.'},
    s4a:'Fuel is a <b>low</b> per-MWh cost; the dominant operating cost is <b>fixed O&amp;M</b>, a large operating workforce, security, and waste/decommissioning provisions. The regulated return is set on the capital base, so the margin is high and the value question is the size of the recovered capex, not the running cost.',
    wfNote:'Operating cost is mostly fixed O&amp;M plus a low per-MWh fuel cost. Revenue is set by a regulated return on the rate base, so the margin is high and stable, the economics are about the recovered capex.',
    s4b:'The capital is two AP1000 reactors, turbine hall and cooling towers, a capex that more than doubled to well over US$30bn for the two units. In a cost-of-service model that prudently-incurred capital enters the rate base and earns a regulated return; the overrun is the risk, since regulators may disallow imprudent spend.',
    stackH:'The capital · reactors + rate base', splitL:'Financing', splitR:'regulated',
    split:[['s1',55,'Regulated utility debt'],['s2',45,'Equity (Southern Co.)']],
    finList:[['','Reactors','two AP1000 (~2.2 GW)'],['sub','Model','regulated cost-of-service'],['','Capex','US$30bn+ (overran)'],['sub','Capacity factor','~90%+, firm baseload'],['','Owner','Georgia Power (Southern Co.)'],['rest','Milestone','first US new-build in decades']],
    finNote:'Vogtle is a <b>regulated cost-of-service megaproject</b>: an enormous capex recovered through the rate base at an allowed return. The margin is high and the recovery stable; the cautionary tale is the cost overrun and the prudence test that governs recovery.',
    timeline:[['2009','<b>AP1000</b> units licensed for the Vogtle site.'],['2013','<b>Construction</b> of Units 3 &amp; 4 begins.'],['2017','<b>Westinghouse bankruptcy</b> disrupts the build.'],['2020s','<b>Cost &amp; schedule overruns</b>, capex more than doubles.'],['2023','<b>Unit 3</b> enters commercial operation.'],['2024','<b>Unit 4</b> online, the project is complete.']],
    calcNote:'A working model of a <b>regulated cost-of-service nuclear plant</b>. Revenue is capacity × hours × capacity factor × tariff, floored by the regulated recovery on the rate base. Fuel is low per MWh; fixed O&amp;M is high. The huge (overrun) capex, net of any contribution, is recovered at an allowed return.',
    s6:'Vogtle is regulated new-build, and a lesson in overruns. What drives it:',
    breakers:['<b>Rate-base recovery</b>, an allowed return on prudently-incurred capital makes the revenue stable.','<b>Capex &amp; overruns</b>, Vogtle more than doubled in cost; the build risk is the story.','<b>Prudence test</b>, regulators decide how much overrun the ratepayer (vs equity) absorbs.','<b>Capacity factor</b>, firm, high output underpins decades of stable recovery.'],
    src:'Figures from public sources on <a href="https://www.georgiapower.com/company/about-us/facilities/vogtle.html" target="_blank" rel="noopener">Plant Vogtle Units 3 &amp; 4</a> (Georgia Power / Southern Company). Figures are approximate and illustrative.',
    econ:{cur:'US$', source:'AP1000 · regulated',
      mwDef:2200,mwMin:1100,mwMax:2400,mwStep:50, priceDef:110,priceMin:60,priceMax:160,priceStep:1,
      cfDef:91,cfMin:78,cfMax:94,cfStep:1, fuelCost:8, omPerMW:0, fixedOM:520},
    calc:{build:21000,grant:4500,capex:3,revG:2,floor:2000,cap:3600,tax:25,exit:12,lev:4,rd:5.25,amort:3,hold:20},
    map:{footer:GEO.vogtle.footer}
  },

  /* ---------- 3 · ANGRA / BRAZIL (South America · state nuclear · regulated) ---------- */
  angra:{
    name:'Angra (Eletronuclear)', geo:'Angra dos Reis, Brazil', continent:'South America', cur:'R$', geoKey:'angra',
    lede:'Brazil\'s state nuclear programme, the Angra plants on the coast, run by <b>Eletronuclear</b> under a <b>regulated tariff</b>, with the long-stalled Angra 3 finally being completed.',
    s1:'<p class="body"><b>Angra dos Reis</b> hosts Brazil\'s nuclear fleet: Angra 1 and Angra 2 (~2 GW together) are operating, and <b>Angra 3</b>, begun decades ago, long mothballed, is being completed. They are firm baseload on the coast, cooled by the sea, run by <b>Eletronuclear</b>, a state-controlled operator.</p>'+
       '<p class="body">The model is <b>state nuclear under a regulated tariff</b>: the output is sold at a regulated price set to recover the cost of the asset, so the revenue is contracted-like rather than merchant. Fuel is low; fixed O&amp;M is substantial. The story is twofold, a long-life regulated baseload asset, and the difficulty (and capital) of finishing a stalled megaproject in an <b>emerging market</b> at a higher cost of capital.</p>',
    facts:[['~2 GW','Operating','Angra 1 & 2'],['Angra 3','Completing','long-stalled unit'],['Regulated','Tariff','cost recovery'],['Eletronuclear','Owner','state-controlled'],['~80%+','Capacity factor','firm baseload'],['EM rate','Discount','higher cost of capital']],
    s2:'Watch the station. The <b>reactor domes</b> sit on the coast, cooled by the <b>sea</b>, and the <b>switchyard</b> sends steady power out (cyan) at a high, flat capacity factor. Eletronuclear earns a <b style="color:#0c6b4f">regulated tariff</b> on the output, less low fuel and substantial fixed O&amp;M. Drag the capacity, the tariff and the capacity factor, a state baseload asset at an emerging-market rate.',
    driverLab:'Price / tariff', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'capacity × hours × CF × tariff',
    ledge:{a:'+ power (reg.)',b:'+ capacity',c:'− fuel & O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> the <b>regulated tariff</b> floors the revenue, so price moves do little, drop the price and watch it hold. The capacity factor is high and steady. Then raise the cost of debt: a solid regulated baseload asset nets down once discounted at an <b>emerging-market rate</b>, which, with the capital to finish Angra 3, is the real swing factor.',
    s3:'Angra sells firm baseload at a <b>regulated tariff</b> set to recover the asset\'s cost, so the revenue is stable and contracted-like. Output runs at a high capacity factor; fuel is cheap, fixed O&amp;M substantial. The investment debate is less the asset than the <b>cost of capital</b>, Brazilian rates and currency, and the capital and execution risk of completing the long-stalled Angra 3.',
    mb:{tag:'Model B · state nuclear (regulated)', title:'State nuclear at a regulated tariff', body:'A state-controlled operator running coastal baseload reactors under a regulated cost-recovery tariff, while finishing a long-stalled unit, a stable regulated annuity, but at an emerging-market cost of capital. <b>This is Angra</b>, run by Eletronuclear in Brazil.'},
    s4a:'Fuel is a <b>low</b> per-MWh cost; the dominant operating cost is <b>fixed O&amp;M</b>, operations, security, and waste/decommissioning. The regulated tariff is set to recover cost, so the margin is high; the value question is the cost of capital and the capex to complete Angra 3.',
    wfNote:'Operating cost is mostly fixed O&amp;M plus a low per-MWh fuel cost. The regulated tariff recovers cost, so the margin is high, but the return is discounted at an emerging-market rate, and Angra 3 needs capital to finish.',
    s4b:'The capital is the operating reactors plus the heavy spend to <b>complete Angra 3</b>, a unit begun decades ago. In a regulated model that capital is recovered through the tariff; the risk is execution and the higher cost of capital of an emerging-market sovereign-linked project.',
    stackH:'The capital · reactors + Angra 3', splitL:'Financing', splitR:'state / EM',
    split:[['s1',55,'State / development-bank debt'],['s2',45,'State equity']],
    finList:[['','Operating','Angra 1 &amp; 2 (~2 GW)'],['sub','Completing','Angra 3 (long-stalled)'],['','Tariff','regulated cost recovery'],['sub','Capacity factor','~80%+, firm baseload'],['','Owner','Eletronuclear (state)'],['rest','Discount','emerging-market cost of capital']],
    finNote:'Angra is a <b>state regulated baseload asset at an EM rate</b>: a stable cost-recovery tariff on firm output, plus the capital and execution risk of finishing a stalled megaproject. The whole investment debate is the cost of capital and the completion of Angra 3.',
    timeline:[['1985','<b>Angra 1</b> enters commercial operation.'],['2001','<b>Angra 2</b> online after a long build.'],['1980s','<b>Angra 3</b> started, then mothballed for decades.'],['2020s','<b>Angra 3 completion</b> restarted with new financing.'],['Periodic','<b>Regulated tariff</b> resets recover cost.'],['Long-term','<b>~80%+ capacity factor</b> on a long-life fleet.']],
    calcNote:'A working model of a <b>state, regulated nuclear plant in an emerging market</b>. Revenue is capacity × hours × capacity factor × a regulated tariff, floored by cost recovery. Fuel is low; fixed O&amp;M high. The cost of debt is higher to reflect EM rates, netting a stable return down once discounted.',
    s6:'Angra is state baseload at an emerging-market rate. What drives it:',
    breakers:['<b>Regulated tariff</b>, cost-recovery pricing makes the revenue stable and contracted-like.','<b>Cost of capital</b>, Brazilian rates and currency set the discount rate and the value.','<b>Angra 3 completion</b>, the capital and execution risk of finishing a stalled unit.','<b>Capacity factor</b>, firm, high output underpins the regulated annuity.'],
    src:'Figures are illustrative for Brazil\'s nuclear programme (<a href="https://www.eletronuclear.gov.br/" target="_blank" rel="noopener">Eletronuclear</a>, Angra dos Reis). As a state asset with limited standalone disclosure, all figures here are approximate and illustrative.',
    econ:{cur:'R$', source:'PWR · regulated',
      mwDef:1900,mwMin:600,mwMax:2100,mwStep:50, priceDef:520,priceMin:300,priceMax:780,priceStep:5,
      cfDef:84,cfMin:70,cfMax:92,cfStep:1, fuelCost:35, omPerMW:0, fixedOM:2450},
    calc:{build:66000,grant:9000,capex:3,revG:3,floor:7600,cap:13000,tax:34,exit:10,lev:3.5,rd:11,amort:3,hold:20},
    map:{footer:GEO.angra.footer}
  },

  /* ---------- 4 · BARAKAH (Middle East · APR1400 · long PPA) ---------- */
  barakah:{
    name:'Barakah', geo:'Al Dhafra, United Arab Emirates', continent:'Middle East', cur:'AED', geoKey:'barakah',
    lede:'The Arab world\'s first nuclear plant, four <b>APR1400 reactors</b> built by KEPCO <b>on time and on budget</b>, selling firm baseload to the UAE under a <b>long power-purchase agreement</b>.',
    s1:'<p class="body"><b>Barakah</b>, on the UAE\'s Al Dhafra coast, is four <b>APR1400 reactors</b> (~5.6 GW), the Arab world\'s first nuclear plant and one of the largest single nuclear projects in the world. It is the standout counter-example to nuclear\'s reputation for overruns: built by a <b>KEPCO</b>-led Korean consortium, it came in broadly <b>on time and on budget</b>.</p>'+
       '<p class="body">The model is a <b>long power-purchase agreement</b>: the plant (Nawah operates it; ENEC owns it) sells firm baseload to the UAE under a long contract that removes price risk, financed on the strength of that offtake and a sovereign-backed structure. Four units running at a very high capacity factor make it a vast, stable, low-carbon annuity, the case study for delivering nuclear capex on schedule.</p>',
    facts:[['~5.6 GW','Capacity','four APR1400 units'],['Long PPA','Contract','firm offtake'],['On time/budget','Delivery','KEPCO-built'],['First in region','Milestone','Arab-world nuclear'],['~90%+','Capacity factor','firm baseload'],['ENEC / Nawah','Owner','sovereign-backed']],
    s2:'Watch the station. <b>Four APR1400 domes</b> line the coast, cooled by the <b>sea</b>, and the <b>switchyard</b> sends a huge, steady stream of power out (cyan) at a high, flat capacity factor. The plant earns a <b style="color:#0c6b4f">long PPA</b> on its output, less low fuel and substantial fixed O&amp;M. Drag the capacity, the price and the capacity factor, four units, delivered on budget.',
    driverLab:'Price / PPA', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'capacity × hours × CF × PPA',
    ledge:{a:'+ power (PPA)',b:'+ capacity',c:'− fuel & O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> the <b>PPA floor</b> removes price risk, drop the price and revenue holds. Push the capacity up to four units and watch the absolute scale: ~5.6 GW of firm output is a vast annuity. Barakah\'s lesson is that the capex was delivered <b>on budget</b>, so the return is the clean case, a contracted megaproject without the overrun.',
    s3:'Barakah sells firm baseload under a <b>long PPA</b> that removes price risk, across four large APR1400 units at a high capacity factor. Fuel is cheap, fixed O&amp;M substantial, and, crucially, the <b>capex was delivered on time and on budget</b>, so the return is the clean version of the contracted-megaproject case. The story is execution: KEPCO\'s standardised, repeated build is what de-risked the capital.',
    mb:{tag:'Model B · long PPA (on-budget)', title:'APR1400 fleet under a long PPA', body:'Four APR1400 reactors selling firm baseload to the UAE under a long power-purchase agreement, built by KEPCO on time and on budget, the standout case of nuclear capex delivered to plan, financed on a sovereign-backed offtake. <b>This is Barakah</b> (ENEC / Nawah).'},
    s4a:'Fuel is a <b>low</b> per-MWh cost; the dominant operating cost is <b>fixed O&amp;M</b> across four units, operations, security, waste and decommissioning. With the capex delivered on budget and a long PPA, the margin is high and the cash flow stable, the clean contracted-baseload case.',
    wfNote:'Operating cost is mostly fixed O&amp;M plus a low per-MWh fuel cost. The long PPA floors the revenue, so the margin is high and stable, and, uniquely, the underlying capex was delivered on time and on budget.',
    s4b:'The capital is four APR1400 reactors and shared coastal infrastructure, a vast capex, but one delivered broadly to plan by a standardised KEPCO build. Financed on a sovereign-backed structure and the long PPA, it is the case study for how repetition and disciplined delivery make nuclear capex bankable.',
    stackH:'The capital · four reactors', splitL:'Financing', splitR:'sovereign-backed',
    split:[['s1',60,'Sovereign-backed / export-credit debt'],['s2',40,'Equity (ENEC / KEPCO)']],
    finList:[['','Reactors','four APR1400 (~5.6 GW)'],['sub','Contract','long PPA (firm offtake)'],['','Delivery','on time &amp; on budget (KEPCO)'],['sub','Capacity factor','~90%+, firm baseload'],['','Owner','ENEC (Nawah operates)'],['rest','Milestone','first nuclear in the Arab world']],
    finNote:'Barakah is the <b>on-budget contracted megaproject</b>: four units of firm baseload under a long PPA, with the capex delivered to plan. The margin is high, the revenue certain, and the return is the clean case, capital de-risked by standardised, disciplined delivery.',
    timeline:[['2009','<b>KEPCO</b> wins the UAE nuclear contract.'],['2012','<b>Construction</b> of four APR1400 units begins.'],['2020','<b>Unit 1</b> reaches first criticality / start-up.'],['2021–23','<b>Units 2 &amp; 3</b> enter commercial operation.'],['2024','<b>Unit 4</b> online, all four units running.'],['Long-term','<b>~90%+ capacity factor</b> under a long PPA.']],
    calcNote:'A working model of a <b>long-PPA nuclear fleet delivered on budget</b>. Revenue is capacity × hours × capacity factor × the PPA price, floored by the contract. Fuel is low; fixed O&amp;M high across four units. The huge capex, net of any state contribution, was delivered to plan, the clean contracted case.',
    s6:'Barakah is the on-budget contracted megaproject. What drives it:',
    breakers:['<b>The long PPA</b>, a firm offtake removes price risk and finances the capex.','<b>On-budget delivery</b>, KEPCO\'s standardised build is the standout de-risking of nuclear capex.','<b>Scale</b>, four large units make a vast, stable, firm-baseload annuity.','<b>Capacity factor</b>, high, steady output underpins decades of contracted revenue.'],
    src:'Figures from public sources on <a href="https://www.enec.gov.ae/" target="_blank" rel="noopener">Barakah</a> (ENEC / Nawah Energy / KEPCO). Figures are approximate and illustrative.',
    econ:{cur:'AED', source:'APR1400 · PPA',
      mwDef:5600,mwMin:1400,mwMax:5800,mwStep:100, priceDef:175,priceMin:90,priceMax:260,priceStep:1,
      cfDef:91,cfMin:78,cfMax:94,cfStep:1, fuelCost:20, omPerMW:0, fixedOM:1700},
    calc:{build:86000,grant:13000,capex:3,revG:2,floor:6800,cap:12500,tax:0,exit:12,lev:4,rd:4.75,amort:3,hold:20},
    map:{footer:GEO.barakah.footer}
  },

  /* ---------- 5 · CGN / CHINA NUCLEAR (China · standardised fleet) ---------- */
  cgn:{
    name:'CGN (China nuclear)', geo:'Coastal China', continent:'China', cur:'¥', geoKey:'cgn',
    lede:'Nuclear at <b>fleet scale</b>, China\'s standardised, repeated reactor build-out (the Hualong One and others), delivered fast and at a <b>low cost of capital</b>, the opposite of the Western overrun.',
    s1:'<p class="body"><b>CGN</b> (China General Nuclear) and its peers are building reactors as a <b>standardised fleet</b>: many near-identical units (the domestic <b>Hualong One</b> design and others) along China\'s coast, cooled by the sea, each a firm-baseload generator running at a very high capacity factor.</p>'+
       '<p class="body">The model is the inverse of the Western megaproject. By building the <b>same design repeatedly</b>, China compresses construction time and cost, and finances at a <b>low, state-linked cost of capital</b>. Output is sold into a managed market with regulated/contracted pricing. A standardised build at low financing cost, repeated across a large fleet, is what makes nuclear capex economic at scale, the lesson the West is trying to relearn.</p>',
    facts:[['Fleet','Build','standardised, repeated'],['Hualong One','Design','domestic reactor'],['Low CoC','Financing','state-linked'],['Fast build','Delivery','compressed schedule'],['~90%','Capacity factor','firm baseload'],['CGN / CNNC','Owner','state nuclear']],
    s2:'Watch the station. Standardised <b>reactor domes</b> line the coast, cooled by the <b>sea</b>, and the <b>switchyard</b> sends steady power out (cyan) at a high, flat capacity factor, one of many near-identical units in the fleet. The owner earns a <b style="color:#0c6b4f">regulated/contracted price</b>, less low fuel and fixed O&amp;M, financed at a low cost of capital. Drag the capacity, the price and the capacity factor.',
    driverLab:'Price / tariff', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'capacity × hours × CF × tariff',
    ledge:{a:'+ power (reg.)',b:'+ capacity',c:'− fuel & O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> the magic is the <b>cost of capital</b>. Drop the cost of debt right down and watch a modestly-priced baseload asset turn into a strong return, a low financing rate is what makes nuclear capex economic. Standardised, repeated builds compress the capex too; the regulated price floors the revenue, and the capacity factor is high and flat.',
    s3:'China\'s nuclear fleet sells firm baseload at a <b>regulated/contracted price</b>, run at a high capacity factor across many standardised units. The defining lever is the <b>cost of capital</b>: a low, state-linked financing rate, applied to a capex compressed by repetition, is what makes the enormous up-front cost economic. Fuel is cheap, fixed O&amp;M substantial, but the value is set by the financing and the standardised build.',
    mb:{tag:'Model B · standardised fleet', title:'Standardised reactor fleet (low CoC)', body:'A large, repeated build-out of near-identical reactors, delivered fast and financed at a low, state-linked cost of capital, selling firm baseload at a regulated/contracted price, the inverse of the Western one-off megaproject. <b>This is China\'s nuclear fleet</b> (CGN / CNNC, Hualong One).'},
    s4a:'Fuel is a <b>low</b> per-MWh cost; the dominant operating cost is <b>fixed O&amp;M</b>. With a standardised fleet and a low cost of capital, the margin is high and the capex compressed, the economics are driven by repetition and financing, not the running cost.',
    wfNote:'Operating cost is mostly fixed O&amp;M plus a low per-MWh fuel cost. The margin is high and stable; the value is set by a compressed, standardised capex financed at a low, state-linked cost of capital.',
    s4b:'The capital is a fleet of near-identical reactors. Building the <b>same design repeatedly</b> drives down both schedule and unit cost, and a low, state-linked cost of capital does the rest. This is the structural answer to nuclear\'s capex problem, standardisation plus cheap financing, compounded across a growing fleet.',
    stackH:'The capital · standardised fleet', splitL:'Financing', splitR:'low cost of capital',
    split:[['s1',65,'State-linked / policy-bank debt'],['s2',35,'State equity']],
    finList:[['','Build','standardised, repeated fleet'],['sub','Design','Hualong One (domestic)'],['','Cost of capital','low (state-linked)'],['sub','Capacity factor','~90%, firm baseload'],['','Pricing','regulated / contracted'],['rest','Owner','CGN / CNNC (state)']],
    finNote:'China\'s nuclear fleet is a <b>standardised, low-cost-of-capital baseload machine</b>: a compressed, repeated capex financed cheaply, earning a regulated price on firm output. The return is driven by standardisation and financing, the structural answer to the capex problem.',
    timeline:[['1990s','<b>First reactors</b> built with imported designs.'],['2000s','<b>Fleet build-out</b> accelerates along the coast.'],['2015','<b>Hualong One</b>, a standardised domestic design.'],['2020s','<b>Repeated builds</b> compress schedule and cost.'],['Ongoing','<b>Low cost of capital</b> finances the fleet.'],['Long-term','<b>~90% capacity factor</b> across a large fleet.']],
    calcNote:'A working model of a <b>standardised nuclear fleet at a low cost of capital</b>. Revenue is capacity × hours × capacity factor × a regulated/contracted price, floored by the contract. Fuel is low; fixed O&amp;M high. The compressed capex and a low cost of debt are what make the return economic.',
    s6:'China nuclear is standardised baseload at a low cost of capital. What drives it:',
    breakers:['<b>Cost of capital</b>, a low, state-linked financing rate is what makes the capex economic.','<b>Standardisation</b>, repeating the same design compresses schedule and unit cost.','<b>Regulated price</b>, a contracted/regulated tariff floors the revenue on firm output.','<b>Fleet scale</b>, many near-identical units compound the model.'],
    src:'Figures are illustrative for China\'s standardised nuclear fleet (<a href="https://en.cgnpc.com.cn/" target="_blank" rel="noopener">CGN</a> / CNNC, Hualong One). Given limited standalone disclosure, all figures here are approximate and illustrative.',
    econ:{cur:'¥', source:'Hualong One · fleet',
      mwDef:2400,mwMin:1000,mwMax:6000,mwStep:100, priceDef:400,priceMin:240,priceMax:600,priceStep:5,
      cfDef:90,cfMin:78,cfMax:93,cfStep:1, fuelCost:30, omPerMW:0, fixedOM:2200},
    calc:{build:67000,grant:7000,capex:3,revG:2,floor:6600,cap:11000,tax:25,exit:11,lev:3.5,rd:3.5,amort:3,hold:20},
    map:{footer:GEO.cgn.footer}
  },

  /* ---------- 6 · SMALL MODULAR REACTOR (global · new-build SMR) ---------- */
  smr:{
    name:'Small modular reactor (SMR)', geo:'Global (illustrative)', continent:'Oceania', cur:'£', geoKey:'smr',
    lede:'The new-build model, a <b>factory-built small modular reactor</b> (Rolls-Royce SMR, NuScale and others): smaller units, repeated and shipped to site, aiming to make nuclear capex predictable. Figures here are <b>illustrative</b>.',
    s1:'<p class="body">A <b>small modular reactor (SMR)</b> is a smaller nuclear unit (typically ~70–470 MW) whose major components are <b>built in a factory</b> and shipped to site, rather than constructed bespoke on a riverbank. The bet is that <b>modularity and repetition</b> turn nuclear\'s biggest weakness, unpredictable on-site construction cost, into a manufactured, learnable product.</p>'+
       '<p class="body">The model is a <b>new-build, first-of-a-kind</b> one: an enormous development effort to license and build the first units, then (in theory) falling cost as the production line repeats. Offtake is typically <b>contracted</b>, a long PPA or a CfD-style support, to make the early units financeable. We use the SMR as the sixth case because it is a genuinely distinct model, and because countries without commercial nuclear (such as Australia) view SMRs as their possible entry point. The figures here are <b>illustrative</b>.</p>',
    facts:[['~70–470 MW','Unit','factory-built'],['Modular','Build','shipped to site'],['First-of-a-kind','Stage','new-build'],['Contracted','Offtake','PPA / CfD-style'],['~90%','Capacity factor','firm baseload'],['Illustrative','Note','emerging model']],
    s2:'Watch the station. A <b>compact reactor unit</b> sits beside a river, with a small cooling tower venting steam, and the <b>switchyard</b> sends steady power out (cyan) at a high, flat capacity factor. The first unit earns a <b style="color:#0c6b4f">contracted price</b>, less low fuel and fixed O&amp;M; a <b>+ SMR FLEET</b> marker shows the production line repeating. Drag the capacity, the price and the capacity factor, an illustrative new-build model.',
    driverLab:'Price / strike', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'capacity × hours × CF × price',
    ledge:{a:'+ power (contract)',b:'+ capacity',c:'− fuel & O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> the SMR bet is on <b>capex per MW</b> falling as the line repeats, set a high build cost (first-of-a-kind) and watch the return strain, then lower it (nth-of-a-kind) and watch it work. The contracted offtake floors the revenue, and the capacity factor is high. The whole thesis is whether modular repetition makes the capex predictable.',
    s3:'An SMR sells firm baseload at a <b>contracted price</b> (a long PPA or CfD-style support) on a smaller unit, run at a high capacity factor. Fuel is cheap, fixed O&amp;M substantial. The investment thesis is the <b>capex per MW</b>: first-of-a-kind units are expensive, but the bet is that factory-building the same design repeatedly drives the cost down a learning curve, making nuclear capex, finally, predictable. The figures are illustrative.',
    mb:{tag:'Model B · new-build SMR', title:'Factory-built modular reactor', body:'A smaller, factory-built reactor shipped to site and sold under a contracted offtake, betting that modular repetition turns unpredictable on-site capex into a manufactured, learnable product, first-of-a-kind expensive, nth-of-a-kind economic. <b>This is the SMR model</b> (Rolls-Royce SMR, NuScale and others); figures illustrative.'},
    s4a:'Fuel is a <b>low</b> per-MWh cost; the dominant operating cost is <b>fixed O&amp;M</b>, which for a smaller unit is proportionally higher. The margin is healthy on the contracted price, but the case lives on the <b>capex per MW</b>, and whether factory-building drives it down with each unit.',
    wfNote:'Operating cost is mostly fixed O&amp;M plus a low per-MWh fuel cost. The contract floors the revenue, so the margin is healthy, but the whole thesis is the capex per MW falling along a manufacturing learning curve.',
    s4b:'The capital is the reactor module and balance-of-plant, high per MW for the first unit (first-of-a-kind), then, the thesis goes, falling as the factory repeats the same design. A contracted offtake and any state/development support make the early units financeable; the value is the slope of that learning curve.',
    stackH:'The capital · modular unit(s)', splitL:'Financing', splitR:'first-of-a-kind',
    split:[['s1',50,'Project / development-backed debt'],['s2',50,'Equity + state support']],
    finList:[['','Unit','~70–470 MW (factory-built)'],['sub','Build','modular, shipped to site'],['','Stage','first-of-a-kind new-build'],['sub','Offtake','contracted (PPA / CfD-style)'],['','Capacity factor','~90%, firm baseload'],['rest','Note','illustrative emerging model']],
    finNote:'The SMR is a <b>new-build bet on manufacturable capex</b>: a contracted offtake on firm output, with the value resting on whether factory repetition drives capex per MW down a learning curve. First-of-a-kind expensive; the thesis is nth-of-a-kind economic. Figures illustrative.',
    timeline:[['2010s','<b>SMR designs</b> advance (NuScale, Rolls-Royce SMR, others).'],['2020s','<b>Licensing &amp; first orders</b> for first-of-a-kind units.'],['2020s','<b>Contracted offtake</b> structures emerge to finance early units.'],['Late 2020s','<b>First units</b> targeted to come online.'],['2030s','<b>Factory repetition</b>, the bet on a falling cost curve.'],['Long-term','<b>Fleet roll-out</b> if the learning curve delivers.']],
    calcNote:'A working (and <b>illustrative</b>) model of a <b>new-build SMR</b>. Revenue is capacity × hours × capacity factor × a contracted price, floored by the offtake. Fuel is low; fixed O&amp;M proportionally high for a small unit. The whole case is the capex per MW, first-of-a-kind high, the bet being a falling learning curve.',
    s6:'The SMR is a bet on manufacturable nuclear capex. What drives it:',
    breakers:['<b>Capex per MW</b>, first-of-a-kind expensive; the thesis is a falling cost curve with repetition.','<b>The contract</b>, a long PPA or CfD-style support finances the early units.','<b>Learning curve</b>, does factory-building the same design actually drive cost down?','<b>Capacity factor</b>, high, steady output makes even a small unit a firm annuity.'],
    src:'Figures are <b>illustrative</b> for a new-build small modular reactor (e.g. <a href="https://www.rolls-royce-smr.com/" target="_blank" rel="noopener">Rolls-Royce SMR</a>, NuScale). SMRs are an emerging, largely pre-commercial model; all figures here are approximate and illustrative, not a forecast of any specific project.',
    econ:{cur:'£', source:'SMR · contract',
      mwDef:470,mwMin:70,mwMax:990,mwStep:10, priceDef:120,priceMin:70,priceMax:200,priceStep:1,
      cfDef:90,cfMin:75,cfMax:93,cfStep:1, fuelCost:8, omPerMW:0, fixedOM:140},
    calc:{build:4000,grant:600,capex:3,revG:2,floor:380,cap:720,tax:25,exit:11,lev:3.5,rd:6,amort:3,hold:20},
    map:{footer:GEO.smr.footer}
  }
  };
  var ORDER=['hinkley','vogtle','angra','barakah','cgn','smr'];

  /* ===================================================================
     NUCLEAR POWER STATION RENDERER  (canvas, 720x520), elevation, daytime
     One or two reactor containment domes beside a turbine hall and a body of
     cooling water; cooling towers emit slow rising steam plumes; a switchyard
     and transmission lines carry the steady output away (near-constant cyan
     pulses). More MW = a second reactor unit; higher CF = more steam + output.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var GROUND=372;                  // horizon / ground line
  var SWITCH={x:636,y:300};        // switchyard
  var steam=[];                    // steam puff particles

  /* ---- two reactor unit slots; second appears with capacity ---- */
  function unitSlots(){ return [ {x:206}, {x:330} ]; }

  /* ---- sky + water + ground ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#cfe0ec'); g.addColorStop(0.55,'#dde9ef'); g.addColorStop(1,'#e6ede8');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // distant hills
    ctx.fillStyle='rgba(150,175,150,0.30)';
    ctx.beginPath(); ctx.moveTo(0,GROUND); ctx.quadraticCurveTo(180,GROUND-46,360,GROUND-14); ctx.quadraticCurveTo(560,GROUND-40,W,GROUND-20); ctx.lineTo(W,GROUND); ctx.closePath(); ctx.fill();
    // ground
    var gg=ctx.createLinearGradient(0,GROUND,0,H); gg.addColorStop(0,'#d6ddcd'); gg.addColorStop(1,'#c7d0bd');
    ctx.fillStyle=gg; ctx.fillRect(0,GROUND,W,H-GROUND);
    // body of cooling water (foreground strip)
    var coolKind=GEO[A.geoKey].cooling;
    var wy=H-92;
    var wg=ctx.createLinearGradient(0,wy,0,H); wg.addColorStop(0,'#7fb6cf'); wg.addColorStop(1,'#5e9cbb');
    ctx.fillStyle=wg; ctx.fillRect(0,wy,W,H-wy);
    // shimmer lines on the water (animated)
    ctx.strokeStyle='rgba(255,255,255,0.32)'; ctx.lineWidth=1;
    for(var i=0;i<6;i++){ var ly=wy+10+i*12; ctx.beginPath();
      for(var x=0;x<=W;x+=18){ var yy=ly+Math.sin((x*0.04)+(T*0.03)+i)*1.6; if(x===0)ctx.moveTo(x,yy); else ctx.lineTo(x,yy); } ctx.stroke(); }
    // bank label for the water body
    ctx.fillStyle='rgba(30,70,90,0.55)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText(coolKind==='sea'?'COOLING WATER · SEA':(coolKind==='river'?'COOLING WATER · RIVER':'COOLING WATER'),16,wy+14);
  }

  /* ---- a reactor containment dome (cylinder + hemisphere) ---- */
  function reactor(x,lf,active){
    var baseY=GROUND, w=64, bodyH=58, domeR=w/2;
    var topY=baseY-bodyH;
    ctx.fillStyle='rgba(40,55,55,0.14)'; ctx.beginPath(); ctx.ellipse(x,baseY+4,w/2+6,6,0,0,Math.PI*2); ctx.fill();
    // cylindrical containment body
    var bg=ctx.createLinearGradient(x-domeR,0,x+domeR,0); bg.addColorStop(0,'#b9c1c4'); bg.addColorStop(0.5,'#e2e7e8'); bg.addColorStop(1,'#a7b0b3');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.rect(x-domeR,topY,w,bodyH); ctx.fill();
    // hemispherical dome
    var dg=ctx.createLinearGradient(x-domeR,topY-domeR,x+domeR,topY); dg.addColorStop(0,'#cdd4d6'); dg.addColorStop(0.5,'#eef2f2'); dg.addColorStop(1,'#b2bbbd');
    ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(x,topY,domeR,Math.PI,0,false); ctx.fill();
    ctx.strokeStyle='rgba(120,132,134,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(x,topY,domeR,Math.PI,0,false); ctx.moveTo(x-domeR,topY); ctx.lineTo(x-domeR,baseY); ctx.moveTo(x+domeR,topY); ctx.lineTo(x+domeR,baseY); ctx.stroke();
    // warm core glow (reactor running) keyed to capacity factor
    if(active){ var core='rgba(120,210,170,'; glow(x,topY+6,18+10*lf,'rgba(120,210,170,0.55)',0.35+0.4*lf);
      ctx.fillStyle=core+(0.45+0.4*lf)+')'; ctx.beginPath(); ctx.arc(x,topY+10,4+2*lf,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- a hyperbolic cooling tower with rising steam ---- */
  function coolingTower(x,lf,active){
    var baseY=GROUND, h=84, topW=44, botW=58, waistW=34, topY=baseY-h;
    ctx.fillStyle='rgba(40,55,55,0.13)'; ctx.beginPath(); ctx.ellipse(x,baseY+3,botW/2+4,5,0,0,Math.PI*2); ctx.fill();
    var g=ctx.createLinearGradient(x-botW/2,0,x+botW/2,0); g.addColorStop(0,'#aab2b4'); g.addColorStop(0.5,'#d9dedf'); g.addColorStop(1,'#9ba4a6');
    ctx.fillStyle=g; ctx.beginPath();
    ctx.moveTo(x-botW/2,baseY); ctx.quadraticCurveTo(x-waistW/2,baseY-h*0.55,x-topW/2,topY);
    ctx.lineTo(x+topW/2,topY); ctx.quadraticCurveTo(x+waistW/2,baseY-h*0.55,x+botW/2,baseY); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(120,132,134,0.45)'; ctx.lineWidth=1; ctx.stroke();
    // rim
    ctx.fillStyle='rgba(90,100,100,0.45)'; ctx.beginPath(); ctx.ellipse(x,topY,topW/2,4,0,0,Math.PI*2); ctx.fill();
    // emit steam from the top (rate keyed to capacity factor)
    if(active && _anim && Math.random()<0.35+0.5*lf){ steam.push({x:x+rnd(-8,8),y:topY-2,r:rnd(9,15),vy:-(0.25+0.35*lf+Math.random()*0.2),vx:rnd(-0.15,0.25),life:1}); }
  }

  /* ---- turbine hall ---- */
  function turbineHall(x){
    var baseY=GROUND, w=120, h=40, topY=baseY-h;
    ctx.fillStyle='rgba(40,55,55,0.12)'; ctx.beginPath(); ctx.ellipse(x,baseY+3,w/2,5,0,0,Math.PI*2); ctx.fill();
    var g=ctx.createLinearGradient(0,topY,0,baseY); g.addColorStop(0,'#b6bdba'); g.addColorStop(1,'#969e9b');
    ctx.fillStyle=g; rr(x-w/2,topY,w,h,3); ctx.fill();
    // curved roof
    ctx.fillStyle='#aab2af'; ctx.beginPath(); ctx.ellipse(x,topY,w/2,7,0,Math.PI,0,true); ctx.fill();
    // window strip
    for(var wx=x-w/2+8;wx<x+w/2-6;wx+=12){ ctx.fillStyle='rgba(150,190,210,0.6)'; ctx.fillRect(wx,topY+12,7,16); }
    ctx.fillStyle='rgba(70,86,84,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('TURBINE HALL',x,baseY-4);
  }

  /* ---- switchyard + transmission lines (steady output) ---- */
  function pylon(x,y,s){ ctx.strokeStyle='rgba(90,100,100,0.7)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(x-6*s,y); ctx.lineTo(x,y-26*s); ctx.lineTo(x+6*s,y);
    ctx.moveTo(x-9*s,y-12*s); ctx.lineTo(x+9*s,y-12*s); ctx.moveTo(x-7*s,y-20*s); ctx.lineTo(x+7*s,y-20*s); ctx.stroke(); }
  function switchyard(){
    var x=SWITCH.x,y=GROUND;
    // fenced yard
    ctx.strokeStyle='rgba(110,120,118,0.5)'; ctx.lineWidth=1; rr(x-54,y-30,104,30,2); ctx.stroke();
    // transformers / bus
    for(var i=0;i<3;i++){ ctx.fillStyle='#9aa3a0'; rr(x-46+i*30,y-22,18,20,2); ctx.fill(); }
    pylon(x+6,y-2,0.9);
    ctx.fillStyle='rgba(70,86,84,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('SWITCHYARD',x-2,y-34);
    // pylons marching off to the right edge
    pylon(W-34,GROUND-4,1.05);
  }

  /* ---- steady output pulses along the transmission line ---- */
  function outputPulses(load){
    var pts=[[unitSlots()[0].x,GROUND-50],[SWITCH.x-30,GROUND-26],[SWITCH.x+6,GROUND-26],[W-34,GROUND-28]];
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(3,Math.round(3+load*5));
    // faint line
    ctx.strokeStyle='rgba(90,170,200,0.35)'; ctx.lineWidth=1.4; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]); for(i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]); ctx.stroke(); ctx.setLineDash([]);
    for(var k=0;k<n;k++){ var f=((T*0.012+k/n)%1); var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],4,'rgba(90,200,230,0.6)'); ctx.fillStyle='rgba(120,225,245,0.95)'; ctx.beginPath(); ctx.arc(p[0],p[1],1.8,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- steam particles ---- */
  function drawSteam(){
    for(var i=steam.length-1;i>=0;i--){ var s=steam[i];
      if(_anim){ s.y+=s.vy; s.x+=s.vx; s.r+=0.18; s.life-=0.011; }
      if(s.life<=0){ steam.splice(i,1); continue; }
      ctx.save(); ctx.globalAlpha=Math.max(0,s.life*0.5); ctx.fillStyle='rgba(245,248,250,0.9)';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ power',b:'+ capacity',c:'− fuel & O&M'};
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
  /* ---- live output sparkline ---- */
  function drawDemand(load){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'OUTPUT';
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
    var mw=parseFloat(sCap.value), price=parseFloat(sSpread.value), cf=parseFloat(sAvail.value)/100;
    // tiny visual wobble around the (high, flat) capacity factor for the sparkline
    var cfVis=Math.max(0.02,Math.min(1, cf*(0.985+0.02*Math.sin(T*0.02))));
    // a second reactor unit appears as capacity rises
    var norm=(mw-E.mwMin)/Math.max(1,(E.mwMax-E.mwMin));
    var twoUnits = norm>0.45;
    var slots=unitSlots();

    ctx.clearRect(0,0,W,H);
    drawMap();

    // cooling towers (behind, between reactors and switchyard) for tower-cooled sites
    var coolTower = (G.cooling==='tower');
    if(coolTower){ coolingTower(452,cfVis,true); if(twoUnits) coolingTower(520,cfVis,true); }
    drawSteam(); // draw accumulated steam (also for sea/river sites: a small vent plume)

    turbineHall(twoUnits?268:206);
    reactor(slots[0].x, cfVis, true);
    if(twoUnits) reactor(slots[1].x, cfVis, true);
    // non-tower sites still vent a modest steam plume from the turbine hall area
    if(!coolTower && _anim && Math.random()<0.25+0.4*cfVis){ steam.push({x:(twoUnits?268:206)+rnd(-10,10),y:GROUND-46,r:rnd(6,10),vy:-(0.2+0.3*cfVis),vx:rnd(-0.1,0.2),life:1}); }

    switchyard();
    outputPulses(0.25+0.7*cfVis);

    if(G.growing){
      var mxLabel = (G.type==='SMR') ? '+ SMR FLEET' : '+ UNIT 2';
      var mx = twoUnits ? (W-150) : (slots[1].x);
      var my = twoUnits ? (GROUND-118) : (GROUND-30);
      var pul=0.5+0.5*Math.sin(T*0.12);
      ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText(mxLabel,mx,my); ctx.restore();
      glow(mx,my+4,9,'rgba(12,107,79,'+(0.22+0.3*pul)+')');
    }

    // ---- economics (firm baseload generation) ----
    var mwh=mw*8760*cf;                         // MWh/yr
    var grossRev=mwh*price;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));    // floor = CfD/RAB/regulated contracted revenue
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var fuelCost=mwh*(E.fuelCost||0), omMW=mw*(E.omPerMW||0)*1000, fixedOM=(E.fixedOM||0)*1e6;
    var opex=omMW+fuelCost+fixedOM;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // split of "+cash" that is fixed/contracted (CfD floor) vs energy
    var fixShare=Math.max(0.1,Math.min(0.7, revenue>grossRev?(revenue-grossRev)/revenue+0.3:0.5));
    var c_om=fixedOM+omMW, c_fuel=fuelCost;
    var c_staff=c_om*0.5, c_secwaste=c_om*0.3, c_other=c_om*0.2;

    if(_anim){
      var src=[{x:slots[0].x,y:GROUND-44}]; if(twoUnits) src.push({x:slots[1].x,y:GROUND-44});
      if(Math.random()<0.7){ var s1=src[(Math.random()*src.length)|0]; spawnCoin(s1.x,s1.y, Math.random()<fixShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.65, opex/Math.max(1,revenue)));
      if(Math.random()<outRate){ var s2=src[(Math.random()*src.length)|0]; spawnCoin(s2.x,s2.y+30,'cost',1); }
      demHist.push(cfVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(cfVis);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+gw(mw),W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',gw(mw)); set('ixSpreadV',CUR+Math.round(price)+'/MWh'); set('ixAvailV',Math.round(cf*100)+'%');
    set('ixDir',gw(mw)); set('ixDirS',(E.source||'')+' · firm baseload');
    set('ixMW',gwh(mwh)); set('ixMWs',Math.round(cf*100)+'% capacity factor / yr');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Operations &amp; staff',c_staff],['Security &amp; waste',c_secwaste],['Fuel',c_fuel],['Other O&amp;M',c_other]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the contracted revenue is too thin to value against the capex, raise the price or the capacity factor, or lower the build cost.</span>'; return; }
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
    A=ASSETS[key]; CUR=A.cur; coins=[]; demHist=[]; steam=[];
    set('ixAssetName',A.name); set('ixAssetGeo',A.geo); set('ixCont',A.continent);
    set('ixBarName',A.name);
    html('ixLede',A.lede);
    html('s1body',A.s1);
    html('ixFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    html('s2intro',A.s2);
    set('ixDriverLab',A.driverLab); set('ixAvailLab',A.availLab); set('ixHrK',A.hrK); set('ixYrS',A.yrS);
    set('ixPreset',A.preset); html('ixTry',A.try);
    var E=A.econ;
    sCap.min=E.mwMin; sCap.max=E.mwMax; sCap.step=E.mwStep; sCap.value=E.mwDef;
    sSpread.min=E.priceMin; sSpread.max=E.priceMax; sSpread.step=E.priceStep; sSpread.value=E.priceDef;
    sAvail.min=E.cfMin; sAvail.max=E.cfMax; sAvail.step=E.cfStep; sAvail.value=E.cfDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is firm generation (capacity × hours × capacity factor × price, with a floor for the CfD / RAB / regulated / PPA contract) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }
  function layout(){ steam=[]; } // no precomputed scene geometry needed; reset steam

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.mwDef; sSpread.value=E.priceDef; sAvail.value=E.cfDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'hinkley');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
