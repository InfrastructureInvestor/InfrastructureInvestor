/* Electricity distribution, data-driven worked examples.
   Six real distribution networks, one template. Scene config from ed-geo.js (GEO),
   drawn as a top-down town network in 720x520 scene coords. The interactive figures
   are illustrative: revenue uses the regulated building-block (return on RAB +
   depreciation + opex + incentive) and the returns model is a simplified DCF. */
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
  function fmtBn(v){ return CUR+(v>=100?Math.round(v):(Math.round(v*10)/10))+'bn'; }
  function pctS(v){ return (v>=0?'+':'')+(Math.round(v*10)/10)+'%'; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · UK POWER NETWORKS (Europe · privatised RIIO-ED2 DNO) ---------- */
  ukpn:{
    name:'UK Power Networks', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'ukpn',
    lede:'Britain\'s busiest distribution network operator and a textbook <b>privatised, RAB-regulated DNO</b>, it owns the local wires and earns a regulated return, decoupled from how much power flows.',
    s1:'<p class="body">Distribution is the <b>last mile of the power system</b>: the 132&nbsp;kV, 33&nbsp;kV and 11&nbsp;kV network that takes bulk power from the transmission grid at a primary substation and steps it down, feeder by feeder, to the streets, homes and businesses. Like transmission it is a <b>natural monopoly</b>, so it is regulated.</p>'+
       '<p class="body"><b>UK Power Networks</b> runs three of Britain\'s fourteen distribution licences, London, the South-East and the East, serving over <b>8&nbsp;million</b> connections. Its revenue is set by Ofgem under <b>RIIO-ED2</b>: a <b>return on its Regulated Asset Base (RAB)</b> at an allowed cost of capital, plus depreciation and an opex allowance, with incentives. The modern story is <b>electrification</b>, EVs, heat pumps and rooftop solar are turning a one-way network into a two-way one and driving a wave of capex that grows the RAB.</p>',
    facts:[['~£8.5bn','Regulated Asset Base','RIIO-ED2'],['8m+','Connections','London · SE · East'],['132/33/11 kV','Network','mostly underground'],['~60%','EBITDA margin','high, stable'],['Ofgem','Regulator','RIIO-ED2 (2023–28)'],['CKI / PAH','Owner','privately held']],
    s2:'Watch the town. Power arrives from the grid at the <b>primary substation</b>, then medium-voltage <b>feeders</b> branch out to the distribution transformers that serve each street; rooftop solar pushes power back the other way. But the <b style="color:#0c6b4f">money</b> the owner earns rises from the <b>assets</b>, the substations and feeders themselves, not from the electrons. Drag the RAB and allowed return; revenue tracks the <b>asset base and the regulator\'s return</b>, not the flow.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load UK Power Networks',
    try:'<b>Try this:</b> the <b>flow doesn\'t move the revenue</b>, a DNO is paid for the network, not the units. Nudge the allowed return and watch revenue jump; then remember the second engine is RAB <i>growth</i>: every pound of EV/heat-pump/solar reinforcement is added to the base and earns the allowed return for decades.',
    s3:'UKPN earns a <b>regulated allowed revenue</b> (recovered through DUoS charges on suppliers), not a market price. The building blocks under RIIO-ED2: a <b>return on the RAB</b> at Ofgem\'s allowed WACC; <b>depreciation</b>; an <b>opex allowance</b>; and <b>incentives</b> for reliability, connections and cost performance. Distribution carries more customer-facing opex than transmission, metering, faults, connections, so the margin is a little lower, but the cash flow is just as decoupled and inflation-protected.',
    mb:{tag:'Model B · RAB-regulated', title:'Privatised distribution monopoly', body:'A privately-owned local monopoly whose revenue is set by an economic regulator as a <b>return on its Regulated Asset Base</b> plus depreciation and an opex allowance, reset each price control. Inflation-protected, volume-decoupled, and growing fast with electrification capex. <b>This is UK Power Networks</b>, Ofgem-regulated under RIIO-ED2.'},
    s4a:'A DNO\'s costs are network O&M, fault response, connections and a customer-facing overhead, larger as a share of revenue than transmission, but still modest against a revenue built mostly from the return on, and depreciation of, the asset base. The result is a high, stable margin and a cash flow that barely flexes with demand.',
    wfNote:'Operating cost (totex opex) is fault response, maintenance, connections and customer service. It is larger relative to RAB than transmission, so the distribution margin is a touch lower, but the revenue is just as decoupled from how much power flows.',
    s4b:'The capital is the <b>~£8.5&nbsp;billion RAB</b>, primary and secondary substations, transformers and tens of thousands of kilometres of cable, mostly underground. Electrification (EVs, heat pumps, distributed solar) is driving a large RIIO-ED2 capex programme; each pound is added to the RAB and earns the allowed return, so the base, and the revenue, compound.',
    stackH:'The capital base · ~£8.5bn RAB', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',60,'Regulated debt (~60% gearing)'],['s2',40,'Equity (CKI / Power Assets)']],
    finList:[['','Regulated Asset Base','~£8.5bn'],['sub','Ofgem price control','RIIO-ED2 (2023–28)'],['','Allowed revenue','return + dep + opex + incentives'],['sub','Connections','8m+'],['','Electrification capex','large, RAB-additive'],['rest','Owner','CK Infrastructure / Power Assets']],
    finNote:'A RAB-regulated DNO is a <b>core-infrastructure cash flow</b>: inflation-linked, volume-decoupled, investment-grade, and now compounding with the electrification build-out. The equity return is steady and geared but capped, the debate is the <b>allowed WACC</b> and the pace and financeability of net-zero capex.',
    timeline:[['1990','<b>Distribution privatised</b> with the regional electricity companies.'],['2010','<b>UK Power Networks formed</b>, CKI-led consortium buys EDF\'s UK networks.'],['2015','<b>RIIO-ED1</b> price control begins.'],['2023','<b>RIIO-ED2</b> begins (2023–28), the net-zero control.'],['2024','<b>EV &amp; heat-pump connections</b> drive a step-up in capex.'],['2028','<b>RIIO-ED3</b>, the allowed return reset for the build decade.']],
    calcNote:'A working model of a <b>RAB-regulated DNO</b>. The build/entry cost is the RAB, the unlevered return tracks the <b>allowed WACC</b>, and growth reflects the RAB compounding with electrification capex. The revenue floor is high, this is what a core, regulated distribution network looks like.',
    s6:'UKPN is the local monopoly that the energy transition runs through. What moves the return:',
    breakers:['<b>The allowed WACC</b>, Ofgem\'s cost-of-capital decision each price control is the biggest lever on the return.','<b>RAB growth</b>, EV, heat-pump and solar reinforcement compounds the base; deliverability and financeability are the risk.','<b>Incentives</b>, reliability, connections and cost performance add or subtract a few points.','<b>Rates &amp; inflation</b>, a geared, inflation-linked RAB is sensitive to real rates and the cost of debt.'],
    src:'Figures from public sources: <a href="https://www.ukpowernetworks.co.uk/" target="_blank" rel="noopener">UK Power Networks</a> regulatory disclosure and the <a href="https://www.ofgem.gov.uk/energy-policy-and-regulation/policy-and-regulatory-programmes/network-price-controls-2021-2028-riio-2" target="_blank" rel="noopener">Ofgem RIIO-ED2</a> price control. Figures are approximate and illustrative.',
    econ:{cur:'£',gw:18,cust:8.3,volt:'132 / 33 / 11 kV',
      rabDef:8.5,rabMin:3,rabMax:16,rabStep:0.5, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.4,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:0.6, anc:0},
    calc:{build:8500,grant:0,capex:40,revG:5,floor:1100,cap:2200,tax:25,exit:10,lev:6,rd:5,amort:1,hold:25},
    map:{footer:GEO.ukpn.footer}
  },

  /* ---------- 2 · CON EDISON (North America · investor-owned utility) ---------- */
  coned:{
    name:'Con Edison', geo:'New York City, USA', continent:'North America', cur:'US$', geoKey:'coned',
    lede:'The utility that keeps the lights on in New York, an <b>investor-owned utility</b> whose distribution network is regulated by the state on a <b>rate base × allowed return</b> basis.',
    s1:'<p class="body"><b>Consolidated Edison</b> distributes electricity to one of the densest, most demanding load centres on earth, New York City and Westchester, across a heavily <b>underground</b> network (Manhattan runs on interconnected secondary "networks" for reliability). Like a UK DNO it is a regulated monopoly on the wires, but under a different mechanism.</p>'+
       '<p class="body">US distribution sits inside <b>investor-owned utilities (IOUs)</b> regulated by a <b>state Public Service Commission</b> on <b>cost-of-service</b>: the company earns a return on its <b>rate base</b> at an allowed <b>return on equity</b> (~9–9.5%), set in periodic rate cases, plus recovery of depreciation and opex. The allowed ROE is comparatively high, and the rate base grows with grid modernisation and electrification, which is the investment case.</p>',
    facts:[['~$25bn','Electric rate base','growing'],['3.6m','Customers','NYC + Westchester'],['13.8/4.16 kV','Network','dense underground'],['NY PSC','Regulator','rate cases'],['~9.5%','Allowed ROE','cost-of-service'],['IOU','Owner','NYSE-listed (ED)']],
    s2:'The picture is the same, grid supply, primary substation, feeders to the streets, but in NYC almost all of it is buried, and reliability is everything. Under <b>cost-of-service</b> the revenue is set to recover the <b>rate base × allowed return</b> plus costs, so the <b style="color:#0c6b4f">return</b> rises from the assets, not the flow. Drag the rate base and allowed return to see what really drives a US distribution utility.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on rate base', yrS:'return + depreciation + opex',
    preset:'Load Con Edison',
    try:'<b>Try this:</b> the US allowed return is <b>higher</b> than a UK DNO\'s, a ~9.5% ROE (on roughly half-equity capital) is why US utilities attract so much capital and invest so heavily. Push the allowed-return slider up and compare; the same rate base earns materially more. The trade-off is rate-case risk and regulatory lag.',
    s3:'Con Edison earns a <b>state-regulated allowed revenue</b> set in rate cases: a <b>return on rate base</b> at the allowed ROE (on the equity layer) plus a debt return, recovery of <b>depreciation</b>, and an <b>opex allowance</b>. The model rewards <b>investing</b>, every prudent dollar of grid modernisation, storm hardening and electrification enters the rate base and earns the allowed return. The case is rate-base growth at a high allowed ROE, against rate-case and political risk.',
    mb:{tag:'Model B · cost-of-service', title:'Investor-owned utility (IOU)', body:'A listed utility whose distribution network is regulated by a state commission on <b>cost-of-service</b>: a return on rate base at an allowed ROE, set in periodic rate cases. Higher allowed returns than European RAB, but rate-case risk and regulatory lag. <b>This is Con Edison</b>, NYSE-listed, regulated by the New York PSC.'},
    s4a:'A dense urban utility carries heavy O&M, an ageing, buried network in a city that cannot tolerate outages, plus storm hardening and a large customer operation. Costs are real, but set against a revenue built from the return on, and depreciation of, a large rate base, the margin is healthy and the cash flow stable.',
    wfNote:'Operating cost is maintenance of a dense underground network, storm response, metering and customer service, recovered in the rate case. The swing factor for value is the rate base and allowed ROE, not the units delivered.',
    s4b:'The capital is the <b>~$25&nbsp;billion electric rate base</b>, financed on an investment-grade balance sheet. Grid modernisation, storm hardening and the electrification of heating and transport drive a large multi-year capital plan, each project entering the rate base at the allowed return, and recovered from customers over decades.',
    stackH:'The capital base · ~$25bn rate base', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',52,'Long-term debt'],['s2',48,'Equity (allowed ROE)']],
    finList:[['','Electric rate base','~$25bn'],['sub','Regulator','NY Public Service Commission'],['','Allowed ROE','~9.5% (cost-of-service)'],['sub','Customers','3.6m'],['','Capital plan','grid modernisation + electrification'],['rest','Owner','NYSE-listed (ED)']],
    finNote:'A US IOU is a <b>higher-returning, listed</b> cousin of the European DNO: the same regulated, volume-decoupled cash flow, but a higher allowed ROE and a strong incentive to invest. The risks are the rate case, regulatory lag, and the politics of customer bills.',
    timeline:[['1823','<b>New York Gas Light Company</b>, Con Edison\'s earliest ancestor.'],['1936','<b>Consolidated Edison</b> formed from NYC\'s utilities.'],['2012','<b>Superstorm Sandy</b>, drives a decade of storm hardening capex.'],['2019','<b>Reforming the Energy Vision</b> (NY) reshapes the distribution model.'],['2020s','<b>Electrification capex</b>, EVs and building electrification.'],['Periodic','<b>Rate cases</b> reset the allowed revenue and ROE.']],
    calcNote:'A working model of a <b>cost-of-service IOU</b>. The allowed return is higher than a European DNO, the floor is high (rate cases recover cost), and growth reflects an expanding rate base. A higher allowed ROE lifts the whole return relative to RIIO.',
    s6:'Con Edison is the US take on distribution, higher returns, heavy investment, rate-case risk. What drives it:',
    breakers:['<b>The allowed ROE</b>, the PSC\'s return decision in each rate case is the biggest single lever.','<b>Rate-base growth</b>, modernisation, hardening and electrification compound the base.','<b>Regulatory lag &amp; bills</b>, the gap between spend and recovery, and the politics of customer bills, are the risk.','<b>Cost of capital</b>, a geared, regulated asset is sensitive to interest rates.'],
    src:'Figures from public sources: <a href="https://www.coned.com/" target="_blank" rel="noopener">Con Edison</a> and <a href="https://investor.conedison.com/" target="_blank" rel="noopener">investor</a> disclosure, and New York PSC rate-case filings. Rate base and ROE figures are approximate and illustrative.',
    econ:{cur:'US$',gw:13,cust:3.6,volt:'13.8 / 4.16 kV',
      rabDef:25,rabMin:10,rabMax:45,rabStep:0.5, waccDef:6.8,waccMin:4,waccMax:11,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.035, opexAllow:1.8, anc:0},
    calc:{build:25000,grant:0,capex:30,revG:4,floor:2800,cap:5500,tax:25,exit:11,lev:5,rd:5,amort:1,hold:25},
    map:{footer:GEO.coned.footer}
  },

  /* ---------- 3 · ENEL DISTRIBUCIÓN (South America · privatised concession) ---------- */
  enelbr:{
    name:'Enel Distribución Brasil', geo:'São Paulo, Brazil', continent:'South America', cur:'R$', geoKey:'enelbr',
    lede:'A privatised distribution concession in one of the world\'s largest cities, regulated by ANEEL on a <b>price cap</b>, where the prize is cutting losses and the risk is the discount rate.',
    s1:'<p class="body"><b>Enel Distribución São Paulo</b> serves the metropolitan region of São Paulo, millions of customers across a sprawling, largely <b>overhead</b> urban network. Brazil distributes through long <b>concessions</b> overseen by the regulator <b>ANEEL</b>, awarded for ~30 years and regulated on a <b>price cap</b> with a defined regulatory asset base and allowed return.</p>'+
       '<p class="body">The model rewards <b>efficiency</b>: the regulator sets the tariff, and the concessionaire keeps the upside from beating its cost and <b>loss</b> targets (Brazilian networks fight significant technical and non-technical losses, including theft). The cash flow is regulated and indexed, but it is priced in <b>reais</b> against high Brazilian interest rates, so a strong nominal return nets down once discounted like an emerging-market asset.</p>',
    facts:[['~R$16bn','Regulatory asset base','indexed'],['8m+','Customers','metro São Paulo'],['13.8 kV','Network','mostly overhead'],['ANEEL','Regulator','price cap concession'],['Losses','Key lever','technical + non-technical'],['~30 yr','Concession','then renewal']],
    s2:'The town network looks the same, substation, feeders, transformers, streets, but here it is mostly overhead, dense, and fighting losses. Under a <b>price cap</b> the concessionaire keeps what it saves by cutting losses and running efficiently, so the <b style="color:#0c6b4f">return</b> rises from the assets and the efficiency gains. Drag the levers, the cash flow is regulated and indexed; the risk is the Brazilian discount rate.',
    driverLab:'Allowed return', availLab:'Efficiency gain', hrK:'Return on assets', yrS:'regulated tariff revenue',
    preset:'Load Enel Distribución',
    try:'<b>Try this:</b> raise the <b>efficiency gain</b>, in Brazil, cutting <b>losses</b> (technical and theft) is the single biggest value lever a distributor controls, and the price cap lets you keep the saving. But the whole return is priced in reais: push the cost of debt and watch a high nominal number net down once discounted like an EM asset.',
    s3:'Enel São Paulo earns a <b>regulated tariff</b> set by ANEEL on a price cap, a return on the regulatory asset base, depreciation and an efficient opex allowance, reset at periodic tariff reviews. The dominant operational lever is <b>loss reduction</b> and efficiency, which the cap lets the operator keep between reviews. New growth comes from connections and reinforcement. The investor question is less the asset, it is the <b>discount rate</b>: Brazilian rates and the real.',
    mb:{tag:'Model B · price-cap concession', title:'Privatised distribution concession', body:'A private operator wins a long concession to run a distribution network under an ANEEL <b>price cap</b>, keeping the upside from beating cost and loss targets and handing the asset back at expiry. Regulated and indexed, with efficiency upside, but priced against emerging-market rates and currency. <b>This is Enel São Paulo</b>.'},
    s4a:'A dense overhead network in a megacity carries heavy O&M and a constant battle against losses and faults, distribution\'s costs are higher here than in a mature European network. But the price cap means efficiency drops straight to the bottom line between reviews, so a well-run concession lifts its margin over time.',
    wfNote:'Operating cost is network O&M, fault and loss management, and customer service across a vast overhead network. The price cap rewards cutting this (and losses), efficiency gains are kept by the operator until the next tariff review.',
    s4b:'The capital is the network the concession was won to run and expand, financed by the sponsor and reinforced over time. Modelled on an enterprise-value basis, the return is a <b>high-nominal Brazilian</b> one on a regulated, indexed cash flow, carried against local rates and the real.',
    stackH:'The capital stack · concession assets', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local debt (indexed)'],['s2',45,'Sponsor equity (Enel)']],
    finList:[['','Regulatory asset base','~R$16bn'],['sub','Regulator','ANEEL (price cap)'],['','Customers','8m+'],['sub','Key lever','loss reduction + efficiency'],['','Concession term','~30 years'],['rest','Owner','Enel (Italy)']],
    finNote:'A Brazilian distribution concession is a <b>regulated, indexed cash flow with an efficiency kicker</b>: cut losses and costs and you keep the gain until the next review. The whole investment debate is the <b>discount rate</b>, Brazilian rates and the real, far more than the asset.',
    timeline:[['1998','<b>Eletropaulo privatised</b>, São Paulo distribution sold.'],['2018','<b>Enel acquires</b> the São Paulo distributor.'],['2020s','<b>Loss-reduction &amp; modernisation</b> programme accelerates.'],['Periodic','<b>ANEEL tariff reviews</b> reset the price cap.'],['2024','<b>Connections growth</b> across the metro region.'],['~2028','<b>Concession milestones</b> and renewal terms in focus.']],
    calcNote:'A working model of a <b>price-cap concession</b>, on an enterprise-value basis. The revenue floor is high (regulated and indexed), efficiency lifts the margin, but the cost of debt is high to reflect Brazilian rates. A strong nominal return nets down once discounted like an EM asset.',
    s6:'Enel São Paulo is regulated distribution with an efficiency prize, and an EM discount rate. What drives it:',
    breakers:['<b>Loss reduction</b>, cutting technical and non-technical losses is the biggest controllable value lever.','<b>Country &amp; currency</b>, Brazilian real rates and the real, not the asset, set the discount rate.','<b>The tariff review</b>, ANEEL\'s price cap and how much efficiency is handed back to customers.','<b>Connections growth</b>, metro expansion adds customers and RAB.'],
    src:'Figures from public sources: <a href="https://www.enel.com.br/" target="_blank" rel="noopener">Enel Brasil</a> and <a href="https://www.gov.br/aneel/" target="_blank" rel="noopener">ANEEL</a> disclosure on the concession and price-cap framework. The figures are approximate and illustrative.',
    econ:{cur:'R$',gw:14,cust:8,volt:'13.8 kV',
      rabDef:16,rabMin:6,rabMax:28,rabStep:0.5, waccDef:7.5,waccMin:4,waccMax:12,waccStep:0.25,
      perfDef:0.6,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:2.2, anc:0},
    calc:{build:16000,grant:0,capex:24,revG:5,floor:2400,cap:5000,tax:34,exit:9,lev:4,rd:9,amort:2,hold:25},
    map:{footer:GEO.enelbr.footer}
  },

  /* ---------- 4 · AUSGRID (Oceania · privatised lease, rooftop-solar heavy) ---------- */
  ausgrid:{
    name:'Ausgrid', geo:'New South Wales, Australia', continent:'Oceania', cur:'A$', geoKey:'ausgrid',
    lede:'Australia\'s largest distribution network, a <b>privatised, regulated monopoly</b> reinventing itself for a grid where over a third of homes have <b>rooftop solar</b>.',
    s1:'<p class="body"><b>Ausgrid</b> runs the distribution network across Sydney, the Central Coast and the Hunter, the biggest in Australia by customers. It is a regulated monopoly under the <b>Australian Energy Regulator (AER)</b>, which sets a <b>revenue cap</b> on a RAB basis. In 2016 the NSW government leased <b>50.4%</b> of it for <b>A$16.2&nbsp;billion</b> to a consortium led by IFM Investors and AustralianSuper.</p>'+
       '<p class="body">Australia is the world\'s rooftop-solar laboratory: in Ausgrid\'s territory a huge and growing share of homes export power back into the low-voltage network at midday. That turns distribution into a genuinely <b>two-way</b> business, managing reverse flows, voltage and, increasingly, household batteries and EVs, and drives a wave of network investment that grows the RAB.</p>',
    facts:[['~A$17bn','Regulated Asset Base','growing'],['4m','Customers','Sydney · Hunter'],['132/33/11 kV','Network','urban + overhead'],['AER','Regulator','revenue cap (RAB)'],['Rooftop solar','Defining feature','two-way flows'],['IFM / AusSuper','Owner','50.4% leased 2016']],
    s2:'Look at the rooftops, a large share are solar, pushing power <b>back</b> into the network at midday. The substation and feeders are the same regulated assets, but the flows now run both ways. The <b style="color:#0c6b4f">return</b> rises from the asset base; drag the RAB and allowed return to see how a regulated monopoly, reshaped by rooftop solar, compounds with the transition build-out.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on RAB', yrS:'return + depreciation + opex',
    preset:'Load Ausgrid',
    try:'<b>Try this:</b> Ausgrid\'s defining feature is <b>rooftop solar</b> and two-way flows, which create a whole new category of network investment (voltage management, flexibility, batteries). Wind the RAB up to see how that build-out compounds the regulated return. But remember the entry: the consortium paid a <b>premium to RAB</b> in 2016, so the growth has to justify the price.',
    s3:'Ausgrid earns a <b>regulated revenue cap</b> set by the AER on a RAB basis, a return on the asset base at the allowed WACC, plus depreciation and an opex allowance, with incentives. The transformational lever is <b>capex</b>: integrating rooftop solar, batteries and EVs requires reinforcing and digitising the low-voltage network, each dollar adding to the RAB. The case is a <b>regulated monopoly in a transition-driven growth phase</b>, bought at a privatisation premium.',
    mb:{tag:'Model B · privatised RAB', title:'Privatised distribution monopoly', body:'A government network leased to private capital for decades, kept under an <b>AER revenue cap</b> on a RAB basis. Low-risk and inflation-linked, with strong RAB growth from integrating rooftop solar, batteries and EVs, but bought at a privatisation premium. <b>This is Ausgrid</b>, 50.4% leased for A$16.2bn in 2016.'},
    s4a:'Ausgrid runs a large urban-and-overhead network, so O&M and vegetation, plus a growing job of managing two-way flows, are real costs, but modest against a RAB-based revenue, so the margin is high and stable. The defining feature in the investment case is the <b>capex pipeline</b> that the solar/EV transition is driving.',
    wfNote:'Operating cost is network O&M, vegetation and the growing task of managing two-way flows and voltage. The swing factor is not cost but the pace of RAB growth from the transition build-out, on which the AER allows a return.',
    s4b:'The headline capital number is the <b>A$16.2&nbsp;billion</b> paid in 2016 for 50.4%, a premium to the then-RAB, plus the forward capex of integrating distributed solar, batteries and EVs. The bet is that the transition build-out grows the RAB enough to justify the price paid.',
    stackH:'The capital stack · A$16.2bn (50.4%)', splitL:'Financing', splitR:'consortium',
    split:[['s1',60,'Long-dated debt'],['s2',40,'IFM · AustralianSuper equity']],
    finList:[['','2016 lease (50.4%)','A$16.2bn'],['sub','Regulator','AER (revenue cap)'],['','Regulated Asset Base','~A$17bn, growing'],['sub','Defining feature','rooftop solar · two-way flows'],['','Network','132 / 33 / 11 kV'],['rest','Owner','IFM / AustralianSuper (+ NSW)']],
    finNote:'A privatised, transition-driven distribution monopoly is a <b>classic infrastructure-fund asset</b>: regulated, inflation-linked, and compounding with the solar/EV build-out. The risks are overpaying at privatisation and delivering an enormous low-voltage modernisation programme.',
    timeline:[['1890s','<b>Sydney electricity supply</b> begins; network built out over a century.'],['2016','<b>50.4% leased</b> for A$16.2bn to IFM / AustralianSuper.'],['2019','<b>Rooftop-solar penetration</b> passes a third of homes in parts of the network.'],['2022','<b>Two-way tariffs &amp; flexibility</b> reshape the AER framework.'],['2024','<b>RAB growth</b> accelerates with solar/EV integration.'],['2024','<b>AER determination</b> sets the revenue cap for the period.']],
    calcNote:'A working model of a <b>privatised, transition-driven RAB</b>. The entry price (A$16.2bn for 50.4%) is a premium to the then-RAB, and growth is high to reflect the solar/EV build-out. The return depends on RAB growth justifying the price paid.',
    s6:'Ausgrid is a regulated monopoly remade by rooftop solar, and bought at a premium. What drives it:',
    breakers:['<b>RAB growth</b>, the low-voltage modernisation for solar, batteries and EVs is the thesis; deliverability is the risk.','<b>The price paid</b>, a 2016 privatisation premium means the build-out has to justify the entry.','<b>The allowed WACC</b>, the AER\'s revenue-cap return sets the base return.','<b>Two-way flows</b>, managing reverse solar flows and flexibility is the new operational frontier.'],
    src:'Figures from public sources: <a href="https://www.ausgrid.com.au/" target="_blank" rel="noopener">Ausgrid</a> and <a href="https://www.aer.gov.au/" target="_blank" rel="noopener">AER</a> revenue-determination disclosure, and the 2016 lease announcements. RAB and figures are approximate and illustrative.',
    econ:{cur:'A$',gw:13,cust:4,volt:'132 / 33 / 11 kV',
      rabDef:17,rabMin:7,rabMax:28,rabStep:0.5, waccDef:5.5,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:1.0, anc:0},
    calc:{build:20000,grant:0,capex:30,revG:4,floor:1900,cap:3800,tax:30,exit:11,lev:6,rd:5,amort:1,hold:30},
    map:{footer:GEO.ausgrid.footer}
  },

  /* ---------- 5 · DEWA (Middle East · state-owned, smart grid) ---------- */
  dewa:{
    name:'DEWA', geo:'Dubai, UAE', continent:'Middle East', cur:'Dh', geoKey:'dewa',
    lede:'Dubai\'s integrated power and water utility, a <b>state-owned (now listed)</b> distributor building one of the world\'s most advanced smart grids to wire a fast-growing, solar-and-EV city.',
    s1:'<p class="body"><b>Dubai Electricity &amp; Water Authority (DEWA)</b> owns the whole electricity chain in Dubai, including the <b>distribution</b> network that delivers to the city\'s homes, towers and businesses. It is <b>state-owned</b> by the Government of Dubai, though since its <b>2022 IPO</b> a minority trades on the Dubai Financial Market.</p>'+
       '<p class="body">DEWA runs a modern, almost entirely <b>underground</b> network with one of the world\'s highest smart-meter penetrations, and is wiring a rapidly growing city for <b>rooftop solar</b> (the Shams Dubai programme) and <b>EVs</b> (the EV Green Charger network). Tariffs are set within Dubai\'s regulated framework; as a state utility its cost of capital is low and the build-out is large, but the owner is strategic, not purely financial.</p>',
    facts:[['~Dh 90bn','Network asset base','growing fast'],['1.2m','Customers','Dubai'],['132/11 kV','Network','underground · smart'],['State','Owner','Govt of Dubai (listed minority)'],['Smart grid','Defining feature','near-100% smart meters'],['Solar + EV','Drivers','Shams Dubai · Green Charger']],
    s2:'A modern, fully underground network with smart meters everywhere, wiring a city that is adding solar rooftops and EV chargers fast. The substation and feeders are the regulated assets; the <b style="color:#0c6b4f">return</b> rises from that base. Drag the levers, a state-backed distributor with a low cost of capital, building hard for a growing, electrifying city.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on assets', yrS:'regulated network revenue',
    preset:'Load DEWA',
    try:'<b>Try this:</b> the allowed return on a <b>state-backed</b> network sits lower than a private EM concession, sovereign ownership means a low cost of capital. But the asset base is growing fast as Dubai electrifies; wind it up to see the build-out compound. The trade-off is a strategic, state owner and a partly-listed structure.',
    s3:'DEWA\'s distribution earns a <b>regulated network revenue</b> within Dubai\'s tariff framework, a return on the asset base, depreciation and an opex allowance. The dominant lever is <b>capex</b>: a fast-growing city, a world-leading smart-grid programme, rooftop solar and EV charging all expand the asset base. As a state utility the cost of capital is low and the financing sovereign-backed; the objective is to power Dubai\'s growth as much as to earn a return.',
    mb:{tag:'Model B · state-owned', title:'State-owned utility (listed minority)', body:'A state-controlled, vertically-integrated utility whose distribution network is regulated within the national tariff framework, building out a smart grid for a fast-growing city. Low cost of capital, sovereign backing and fast RAB growth, but a strategic owner, with only a minority listed. <b>This is DEWA</b>, owned by the Government of Dubai.'},
    s4a:'A modern underground smart network runs efficiently, automation and smart meters hold opex down, so the margin is high. The dominant number is the <b>capital</b> of the build-out: substations, cables and the smart-grid layer for a growing, electrifying city, financed on sovereign-backed terms and earning a regulated return.',
    wfNote:'Operating cost is the maintenance of a modern, automated underground network plus customer operations. Smart metering and automation keep it low; the swing factor is the pace of the build-out and the asset base it creates.',
    s4b:'The capital programme is large: distribution substations, underground cable, near-universal smart meters, and the grid integration of rooftop solar and EV charging across a fast-growing city. It is financed on DEWA\'s state-backed (and now partly listed) balance sheet, which keeps the cost of capital low.',
    stackH:'The capital base · state network', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Government of Dubai (minority listed on DFM)']],
    finList:[['','Network asset base','~Dh 90bn, growing'],['sub','Regulator','Dubai tariff framework'],['','Customers','1.2m'],['sub','Smart meters','near-100%'],['','Drivers','solar (Shams Dubai) · EV (Green Charger)'],['rest','Cost of capital','low (sovereign-backed)']],
    finNote:'A state distribution utility is a <b>strategic asset first</b>: it earns a regulated return at a low, sovereign-backed cost of capital, and its purpose is to power the city\'s growth. The flip side is a state owner (with only a listed minority) and policy-set returns.',
    timeline:[['1992','<b>DEWA established</b> by merging Dubai\'s electricity and water authorities.'],['2014','<b>Shams Dubai</b> launches, rooftop-solar connections.'],['2018','<b>Smart-meter roll-out</b> reaches near-universal coverage.'],['2021','<b>EV Green Charger</b> network expands.'],['2022','<b>DEWA IPO</b>, a minority lists on the Dubai Financial Market.'],['2024','<b>Smart-grid &amp; electrification</b> build-out continues.']],
    calcNote:'A working model of a <b>state-owned distributor</b>. The cost of capital is low (sovereign-backed), tax is low, and growth is high to reflect a fast-growing, electrifying city. A state asset earns a steady regulated return on a fast-growing base.',
    s6:'DEWA is state-backed distribution wiring a fast-growing, electrifying city. What drives it:',
    breakers:['<b>RAB growth</b>, a fast-growing city plus smart-grid, solar and EV build-out compounds the asset base.','<b>Cost of capital</b>, sovereign backing keeps it low, lifting the value of a regulated return.','<b>Policy direction</b>, a strategic state owner sets the agenda; returns are policy-driven.','<b>Electrification</b>, solar integration and EV charging are the new investment frontier.'],
    src:'Figures from public sources: <a href="https://www.dewa.gov.ae/" target="_blank" rel="noopener">DEWA</a> annual and investor disclosure (listed on the DFM since 2022). As a state utility, distribution-only figures are approximate and illustrative.',
    econ:{cur:'Dh',gw:19,cust:1.2,volt:'132 / 11 kV',
      rabDef:90,rabMin:40,rabMax:160,rabStep:1, waccDef:6,waccMin:3,waccMax:9,waccStep:0.25,
      perfDef:0.3,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.045, opexAllow:4.5, anc:0},
    calc:{build:90000,grant:0,capex:42,revG:4,floor:11000,cap:22000,tax:0,exit:10,lev:5,rd:4.5,amort:2,hold:25},
    map:{footer:GEO.dewa.footer}
  },

  /* ---------- 6 · CHINA SOUTHERN POWER GRID (China · state-owned, EV-heavy) ---------- */
  csg:{
    name:'China Southern Power Grid', geo:'Guangdong, China', continent:'China', cur:'¥', geoKey:'csg',
    lede:'One of the two giants of Chinese power, a <b>state-owned</b> distributor wiring the booming cities of the south for the world\'s fastest EV adoption.',
    s1:'<p class="body"><b>China Southern Power Grid (CSG)</b> distributes electricity across five southern provinces, including the megacities of the Pearl River Delta (Guangzhou, Shenzhen), to roughly <b>100&nbsp;million</b> customer accounts. It is one of China\'s two state grid giants, <b>state-owned</b> and vertically integrated.</p>'+
       '<p class="body">The distribution story here is <b>scale and speed</b>: rapid urbanisation, dense high-rise load, and the <b>world\'s fastest EV adoption</b> (Shenzhen electrified its entire bus and taxi fleets years ago). CSG is building out a modern, largely <b>underground</b> urban network and the charging infrastructure to match. The allowed return is thin by Western standards, but applied to a colossal, fast-growing asset base and financed at a state cost of capital, it compounds into a vast, stable cash flow.</p>',
    facts:[['vast','Asset base','5 southern provinces'],['~100m','Customer accounts','Pearl River Delta +'],['110 / 10 kV','Network','dense underground'],['NDRC / NEA','Regulator','state framework'],['EV','Defining feature','world-leading adoption'],['State','Owner','state-owned giant']],
    s2:'Dense high-rise cities, a modern underground network, and EV chargers everywhere, the south of China is electrifying transport faster than anywhere on earth. The substation and feeders are the regulated assets; at this scale even a thin <b style="color:#0c6b4f">return</b> on the base is an enormous cash flow. Drag the levers, scale, not price, is the model, just like the Chinese transmission grid.',
    driverLab:'Allowed return', availLab:'Performance', hrK:'Return on assets', yrS:'regulated network revenue',
    preset:'Load China Southern',
    try:'<b>Try this:</b> the allowed return on a <b>state-backed</b> Chinese distributor is <b>thin</b>, but the asset base is vast and growing fast, so the absolute return is huge. Scale and electrification, not price, are the model. The cost of capital is very low because the owner is the state.',
    s3:'CSG\'s distribution earns a <b>regulated network charge</b> within China\'s framework, a return on a colossal asset base, depreciation and an opex allowance. The dominant lever is <b>scale and capex</b>: urbanisation and the fastest EV roll-out on earth keep the asset base growing. The allowed return is thin, but applied to a vast, fast-growing base and financed at a state cost of capital, it compounds into a large, stable cash flow.',
    mb:{tag:'Model B · state-owned scale', title:'State-owned distribution giant', body:'A state-owned, vertically-integrated network distributing to ~100m accounts at vast scale, earning a thin regulated return on a colossal, fast-growing asset base, financed at a very low state cost of capital, and reinvesting in urbanisation and EV charging. Immense and strategically central, but state-directed. <b>This is China Southern Power Grid</b>.'},
    s4a:'At this scale the cost base is immense in absolute terms, running distribution for 100m accounts across five provinces, but small relative to the revenue from a colossal asset base, so the margin is healthy. The dominant number is the <b>capital</b> of urbanisation and EV build-out, on which the state allows a regulated return at a very low cost of capital.',
    wfNote:'Operating cost is the O&M and customer operation of a vast urban network, large in absolute terms but small against the revenue from a colossal asset base. State backing keeps the cost of capital, and so the allowed return, low.',
    s4b:'The capital is on a national scale, distribution networks and charging infrastructure for the booming cities of the south. It is financed on a state-backed balance sheet that can mobilise capital at a scale and cost few utilities on earth can match, and the EV build-out adds to the base every year.',
    stackH:'The capital base · national network', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Chinese state, sovereign-backed']],
    finList:[['','Asset base','vast, 5 southern provinces'],['sub','Regulator','NDRC / NEA (state framework)'],['','Customer accounts','~100m'],['sub','Defining feature','world-leading EV adoption'],['','Capex driver','urbanisation + EV charging'],['rest','Cost of capital','very low (state)']],
    finNote:'A state distribution giant is a <b>strategic asset at continental scale</b>: a thin regulated return on a colossal, fast-growing base, financed at a very low cost of capital, and central to China\'s urbanisation and electrification. The return is steady and immense in absolute terms; the owner and strategy are the state\'s.',
    timeline:[['2002','<b>China Southern Power Grid established</b> in the power-sector reform.'],['2010s','<b>Shenzhen electrifies</b> its entire bus and taxi fleets.'],['2020s','<b>EV adoption</b> in the south leads the world.'],['2020s','<b>Urban network build-out</b> for dense high-rise load.'],['Ongoing','<b>Charging infrastructure</b> expands with EV growth.'],['Ongoing','<b>State-directed</b> investment and tariffs.']],
    calcNote:'A working model of a <b>state-owned distributor at scale</b>, on an enterprise-value basis. The allowed return is thin and the cost of capital very low (state-backed), but the asset base is vast and growing fast, so the absolute return is enormous and steady. Figures are highly illustrative given the scale.',
    s6:'CSG is scale plus electrification, a thin return on a colossal, fast-growing base. What drives it:',
    breakers:['<b>Scale &amp; asset base</b>, a thin return on a vast, growing base is the model; growth comes from urbanisation and EVs.','<b>Cost of capital</b>, state backing keeps it very low, lifting the value of even a thin allowed return.','<b>EV adoption</b>, the world\'s fastest EV roll-out drives the distribution and charging build-out.','<b>State direction</b>, policy, not shareholders, sets strategy and the allowed return.'],
    src:'Figures from public sources: reporting on <a href="https://www.csg.cn/" target="_blank" rel="noopener">China Southern Power Grid</a> and its distribution and EV-charging build-out. Given the company\'s scale and limited distribution-only disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥',gw:200,cust:100,volt:'110 / 10 kV',
      rabDef:600,rabMin:250,rabMax:1100,rabStep:10, waccDef:5,waccMin:3,waccMax:8,waccStep:0.25,
      perfDef:0.2,perfMin:-1,perfMax:2,perfStep:0.1, depRate:0.04, opexAllow:28, anc:0},
    calc:{build:600000,grant:0,capex:35,revG:5,floor:60000,cap:120000,tax:25,exit:11,lev:4,rd:4,amort:2,hold:25},
    map:{footer:GEO.csg.footer}
  }
  };
  var ORDER=['ukpn','coned','enelbr','ausgrid','dewa','csg'];

  /* ===================================================================
     DISTRIBUTION NETWORK RENDERER  (canvas, 720x520), top-down town, daytime
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var SUB={x:104,y:250};
  // medium-voltage feeders (orthogonal polylines from the substation) + their distribution transformers
  var FEEDERS=[
    {pts:[[104,250],[104,96],[300,96]], dt:[300,96]},                 // north, homes
    {pts:[[104,250],[250,250],[440,250]], dt:[440,250]},              // east , shops
    {pts:[[104,250],[104,406],[316,406]], dt:[316,406]},              // south, homes + EV
    {pts:[[104,250],[250,250],[250,150],[616,150]], dt:[616,150]}     // far  , industry
  ];

  /* ---- base map: roads + verges ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#dfe7d8'); g.addColorStop(1,'#d2dccb');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // green verges (subtle blocks)
    ctx.fillStyle='rgba(150,180,140,0.12)';
    [[150,30,180,120],[360,30,200,90],[470,300,200,150],[150,300,200,160]].forEach(function(b){ rr(b[0],b[1],b[2],b[3],8); ctx.fill(); });
    // roads along the network corridors
    var roadsH=[96,250,406], roadsV=[104,250,440,616];
    ctx.lineCap='round';
    roadsH.forEach(function(y){ road(0,y,W,y); }); roadsV.forEach(function(x){ road(x,40,x,H-30); });
  }
  function road(x0,y0,x1,y1){
    ctx.strokeStyle='#c2c7bd'; ctx.lineWidth=11; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=1; ctx.setLineDash([6,8]); ctx.lineDashOffset=-(T*0.5);
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- incoming transmission from the grid ---- */
  function gridIn(){
    var x=44,y=40; ctx.strokeStyle='#8a918c'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(x-8,y+30); ctx.lineTo(x,y); ctx.lineTo(x+8,y+30); ctx.moveTo(x-6,y+12); ctx.lineTo(x+6,y+12); ctx.stroke();
    ctx.strokeStyle='#7d847f'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(x,y+6); ctx.lineTo(SUB.x,SUB.y-26); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='600 7px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('FROM GRID · '+(A.econ.gridkv||'132 kV'),x-6,y-4);
  }

  /* ---- primary substation ---- */
  function primarySub(){
    var x=SUB.x,y=SUB.y; gshadow(x,30);
    ctx.fillStyle='#cfd3ca'; rr(x-30,y-26,60,52,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    for(var i=0;i<2;i++){ var tx=x-18+i*22; var tg=ctx.createLinearGradient(tx,0,tx+14,0); tg.addColorStop(0,'#7e857f'); tg.addColorStop(1,'#9aa19a');
      ctx.fillStyle=tg; rr(tx,y-14,14,24,2); ctx.fill();
      ctx.strokeStyle='rgba(40,46,44,0.35)'; ctx.lineWidth=0.7; for(var f=1;f<5;f++){ ctx.beginPath(); ctx.moveTo(tx,y-14+f*5); ctx.lineTo(tx+14,y-14+f*5); ctx.stroke(); }
      ctx.strokeStyle='#aab0ad'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(tx+4,y-14); ctx.lineTo(tx+4,y-22); ctx.moveTo(tx+10,y-14); ctx.lineTo(tx+10,y-22); ctx.stroke(); }
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('PRIMARY SUBSTATION',x,y+38);
  }
  function gshadow(x,w){ ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(x,SUB.y+28,w,3,0,0,Math.PI*2); ctx.fill(); }
  function distTx(p){ ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(p[0],p[1]+8,9,2.4,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#8a8f86'; rr(p[0]-7,p[1]-7,14,14,2); ctx.fill(); ctx.fillStyle='rgba(255,255,255,0.25)'; rr(p[0]-7,p[1]-7,14,4,2); ctx.fill();
    ctx.strokeStyle='#aab0ad'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(p[0]-3,p[1]-7); ctx.lineTo(p[0]-3,p[1]-11); ctx.moveTo(p[0]+3,p[1]-7); ctx.lineTo(p[0]+3,p[1]-11); ctx.stroke(); }

  /* ---- feeders + flowing power ---- */
  function feederLine(pts,underground){
    ctx.strokeStyle=underground?'rgba(90,110,150,0.55)':'#6b726b'; ctx.lineWidth=2.4;
    if(underground) ctx.setLineDash([5,4]); ctx.beginPath();
    pts.forEach(function(p,i){ i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); }); ctx.stroke(); ctx.setLineDash([]);
    if(!underground){ // overhead poles at vertices
      pts.forEach(function(p){ ctx.fillStyle='#7d847f'; ctx.fillRect(p[0]-1,p[1]-1,2,5); }); }
  }
  function flowPulses(pts,speed,col,gcol,load,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    var n=Math.max(2,Math.round(2+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],4,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.5,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- customers ---- */
  function house(x,y,solar,lit){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-6,y-5,13,12,1); ctx.fill();
    ctx.fillStyle='#d8d2c4'; rr(x-6,y-6,12,12,1.5); ctx.fill();
    ctx.fillStyle=solar?'#22436e':'#b8755a'; rr(x-6,y-6,12,5,1.5); ctx.fill();       // roof (solar = blue)
    if(solar){ ctx.strokeStyle='rgba(150,190,235,0.5)'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(x-4,y-3.5); ctx.lineTo(x+4,y-3.5); ctx.stroke(); }
    ctx.fillStyle=lit?'rgba(255,210,120,0.95)':'rgba(80,90,80,0.4)'; ctx.fillRect(x-2,y+1,2,3);
  }
  function homeGrid(x0,y0,cols,rows,solarShare,load){
    var k=0; for(var r=0;r<rows;r++) for(var c=0;c<cols;c++,k++){ var x=x0+c*17, y=y0+r*15;
      var solar=((x*7+y*13)%100)/100 < solarShare; var lit=((x*3+y*5+k)%10)/10 < (0.25+0.55*load);
      house(x,y,solar,lit); }
  }
  function commercial(x,y,load){
    [[x,y,46,40],[x+54,y+8,34,32]].forEach(function(b){ ctx.fillStyle='rgba(30,40,30,0.10)'; rr(b[0]-2,b[1]+b[3]-2,b[2]+4,8,2); ctx.fill();
      var g=ctx.createLinearGradient(b[0],b[1],b[0],b[1]+b[3]); g.addColorStop(0,'#aeb6bd'); g.addColorStop(1,'#8f99a1');
      ctx.fillStyle=g; rr(b[0],b[1],b[2],b[3],2); ctx.fill();
      for(var wy=b[1]+5;wy<b[1]+b[3]-3;wy+=7) for(var wx=b[0]+4;wx<b[0]+b[2]-3;wx+=7){
        var lit=((wx*7+wy*13)%10)/10 < (0.3+0.6*load);
        ctx.fillStyle=lit?'rgba(255,214,150,0.9)':'rgba(120,140,150,0.5)'; ctx.fillRect(wx,wy,3,3); } });
    ctx.fillStyle='rgba(70,90,90,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('COMMERCIAL',x+40,y+52);
  }
  function industry(x,y,load){
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(x-2,y+34,96,8,2); ctx.fill();
    ctx.fillStyle='#9aa0a0'; rr(x,y,92,36,2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1; for(var sx=x+6;sx<x+92;sx+=12){ ctx.beginPath(); ctx.moveTo(sx,y); ctx.lineTo(sx+6,y-5); ctx.lineTo(sx+12,y); ctx.stroke(); } // sawtooth roof
    ctx.fillStyle='#7e857f'; rr(x+6,y+10,16,22,1); ctx.fill(); // office
    for(var wy=y+13;wy<y+30;wy+=6){ ctx.fillStyle=load>0.4?'rgba(255,214,150,0.85)':'rgba(120,140,150,0.5)'; ctx.fillRect(x+9,wy,3,3); ctx.fillRect(x+15,wy,3,3); }
    ctx.fillStyle='rgba(70,90,90,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('INDUSTRY',x+46,y+50);
  }
  function evHub(x,y,n,load){
    for(var i=0;i<n;i++){ var cx=x+i*18;
      ctx.fillStyle='#3a4048'; rr(cx-6,y-3,11,6,1.5); ctx.fill();                    // car
      ctx.fillStyle=['#b0392f','#246a86','#2f7d54','#c0902f'][i%4]; rr(cx-5,y-2.4,9,4.8,1); ctx.fill();
      ctx.fillStyle='#0c6b4f'; rr(cx+7,y-7,3,11,1); ctx.fill();                       // charger post
      if(load>0.3 && Math.sin(T*0.2+i)>0){ glow(cx+8.5,y-7,5,'rgba(70,225,150,0.6)'); } }
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('EV CHARGING',x+(n*18)/2-4,y+16);
  }

  /* ---- value-flow orbs: +cash made (green return / amber depreciation), −cash spent (red opex) ---- */
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
  /* ---- live network-load sparkline ---- */
  function drawDemand(load){
    var pw=126,ph=44,px=W-pw-16,py=14;
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText('NETWORK LOAD',px+11,py+14);
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
    var rabBn=parseFloat(sCap.value), wacc=parseFloat(sSpread.value)/100, perf=parseFloat(sAvail.value)/100;
    var RAB=rabBn*1e9;
    var load=0.5+0.4*Math.sin(T*0.012)+0.08*Math.sin(T*0.05); load=Math.max(0.12,Math.min(1,load));
    var solarOn=Math.sin(T*0.012)>-0.2;   // solar exports around the middle of the demand day

    ctx.clearRect(0,0,W,H);
    drawMap(); gridIn();
    // feeders (under the customers)
    FEEDERS.forEach(function(F){ feederLine(F.pts,G.underground); });
    primarySub();
    FEEDERS.forEach(function(F){ distTx(F.dt); });
    // customers
    homeGrid(316,38,5,3,G.solar,load);                 // north homes (DT1)
    commercial(474,214,load);                          // east shops (DT2)
    homeGrid(330,420,5,2,G.solar,load);                // south homes (DT3)
    if(G.ev) evHub(286,432,Math.min(3,G.ev),load);     // EV hub by south homes
    industry(560,64,load);                             // far industry (DT4)
    // flowing power: delivery outward (cyan); rooftop-solar export back (amber) on the home feeders
    FEEDERS.forEach(function(F,i){
      var solarFeeder=(i===0||i===2) && G.solar>0.15 && solarOn;
      if(solarFeeder) flowPulses(F.pts,0.7+load,'rgba(255,210,120,0.95)','rgba(255,180,90,0.7)',load,true);
      else flowPulses(F.pts,0.8+load,'rgba(120,200,255,0.95)','rgba(120,200,255,0.6)',load,false);
    });

    // ---- economics (annual, regulated building-block) ----
    var returnRev=wacc*RAB, depRev=E.depRate*RAB, opexAllow=E.opexAllow*1e9, incentive=perf*RAB;
    var allowedRev=returnRev+depRev+opexAllow+incentive+(E.anc||0)*1e9;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,allowedRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var actualOpex=opexAllow;
    var c_om=actualOpex*0.42, c_fault=actualOpex*0.20, c_conn=actualOpex*0.16, c_admin=actualOpex*0.22;
    var ebitda=revenue-actualOpex;
    baseRevYr=revenue; baseCostYr=actualOpex; baseEbYr=ebitda;
    var retShare = (returnRev+incentive)/Math.max(1,(returnRev+incentive+depRev+opexAllow));

    // money-flow: +cash from the network assets (substation + transformers); −cash (opex) drains
    if(_anim){
      var src=[[SUB.x,SUB.y-28]]; FEEDERS.forEach(function(F){ src.push([F.dt[0],F.dt[1]-10]); });
      if(Math.random()<0.6){ var s1=src[(Math.random()*src.length)|0]; spawnCoin(s1[0],s1[1], Math.random()<retShare?'ret':'rec', -1); }
      var outRate=Math.max(0.05,Math.min(0.6, actualOpex/Math.max(1,revenue)));
      if(Math.random()<outRate){ var s2=src[(Math.random()*src.length)|0]; spawnCoin(s2[0],s2[1]+6,'cost',1); }
      demHist.push(load); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, actualOpex);
    drawDemand(load);

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · RAB '+fmtBn(rabBn),W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',fmtBn(rabBn)); set('ixSpreadV',(Math.round(wacc*1000)/10)+'%'); set('ixAvailV',pctS(perf*100));
    set('ixDir',fmtBn(rabBn)); set('ixDirS','inflation-protected · grows with capex');
    set('ixMW',E.cust+'m'); set('ixMWs','customers · '+E.gw+' GW peak');
    set('ixHr', money(returnRev)); set('ixYr','≈ '+money(allowedRev));

    drawWaterfall(revenue, [['Network O&amp;M',c_om],['Faults &amp; outages',c_fault],['Connections',c_conn],['Customer &amp; admin',c_admin]], ebitda);
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'ukpn');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
