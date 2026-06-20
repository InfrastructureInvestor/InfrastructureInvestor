/* Pumped-hydro storage (long-duration storage), data-driven worked examples.
   Six real pumped-hydro schemes, one template. Scene config from ph-geo.js (GEO),
   drawn as a pumped-hydro scheme in 720x520 scene coords: an upper reservoir high
   on the canvas, a lower reservoir below, a penstock / tunnel down a hillside, a
   powerhouse / turbine hall between them, and a grid switchyard with transmission
   lines. Water flows DOWN the penstock when generating (discharging, cyan/white;
   power OUT to the grid, amber/green pulses) and UP when pumping (charging, cyan
   pulses IN) on a slow, alternating cycle; the upper-reservoir level rises and
   falls slightly. Flow intensity scales with the revenue capture.
   The economics are a per-MW revenue-stack model, annual revenue PER MW of power
   from energy arbitrage, capacity payments and system services, against a light
   O&M cost base, with a strong contracted (cap-and-floor / capacity / regulated)
   floor reflecting pumped hydro's very long life; the returns model is a
   simplified DCF. Pumped hydro is the long-duration, long-life cousin of a
   battery: huge power AND many hours of duration, very high civil capex, very low
   opex, and a lower, steadier return than a merchant battery. */
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
  function mw(p){ return p>=1000?(p/1000).toFixed(p>=10000?0:1)+' GW':Math.round(p)+' MW'; }
  function mwh(e){ return e>=1000?(e/1000).toFixed(e>=10000?0:1)+' GWh':Math.round(e)+' MWh'; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · COIRE GLAS / CRUACHAN (Europe · new-build, seeking cap-and-floor) ---------- */
  coireglas:{
    name:'Coire Glas / Cruachan', geo:'Scottish Highlands, UK', continent:'Europe', cur:'£', geoKey:'coireglas',
    lede:'New British <b>pumped hydro</b> in the Highlands, SSE\'s <b>Coire Glas</b> and Drax\'s <b>Cruachan</b> expansion, long-duration storage with a 50–100-year life, waiting on a <b>cap-and-floor</b> regime to make a per-MW revenue bankable.',
    s1:'<p class="body"><b>Pumped hydro</b> stores energy by pumping water from a lower reservoir up to a higher one when power is cheap or plentiful, then releasing it back down through turbines when power is scarce, huge <b>power</b> and many hours of <b>duration</b>, in a civil asset that can run for <b>50–100 years</b>. Britain\'s new schemes, <b>SSE\'s Coire Glas</b> (a vast new loch-to-loch scheme) and <b>Drax\'s Cruachan</b> expansion (the "Hollow Mountain"), are long-duration storage that can hold tens of GWh.</p>'+
       '<p class="body">The economics are a <b>per-MW</b> revenue model: revenue is the MW of power × the revenue captured per MW per year × how fully that stack is captured, against a very light O&amp;M cost base. The stack is the same as a battery, arbitrage, capacity, system services, but pumped hydro is the <b>long-duration, long-life</b> cousin: the civil capex is high (~£1.5–3m/MW) and the asset lasts generations, so developers are seeking a <b>cap-and-floor</b> regime (a contracted floor with an upside cap) to make the very long payback bankable.</p>',
    facts:[['Per MW','Revenue','annual stack'],['Cap-and-floor','Regime','contracted floor'],['50–100yr','Life','generational asset'],['Long','Duration','deep storage (hrs)'],['~£1.5–3m','Capex /MW','high civil cost'],['SSE / Drax','Owner','UK utilities']],
    s2:'Watch the cycle. Water flows <b>up</b> the penstock (cyan) as the scheme <b>pumps / charges</b> on cheap power, then back <b>down</b> through the turbines (cyan/white) as it <b>generates / discharges</b>, power out to the grid (amber/green) is the arbitrage. The upper-reservoir level rises and falls; the cycling gets brighter with the <b style="color:#0c6b4f">revenue capture</b>. Drag the power, the revenue per MW and the capture, and watch the cap-and-floor hold the ledger up at low capture.',
    driverLab:'Revenue / MW', availLab:'Revenue capture', hrK:'Storage revenue', yrS:'stack captured per MW',
    ledge:{a:'+ arbitrage',b:'+ capacity',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>revenue capture</b> and watch the <b>cap-and-floor</b> hold the revenue up, that contracted floor is exactly what Coire Glas needs to finance a 50–100-year asset against today\'s merchant uncertainty. Push the revenue per MW to see a strong arbitrage year. The lever here is the <b>regime</b>: a cap-and-floor turns a deep, long-life store into a bankable, infrastructure-grade return.',
    s3:'A British pumped-hydro scheme earns a <b>stack</b>: arbitrage (the spread between pumping cheap and generating dear), a capacity payment for being available at peak, and balancing / system services. Expressed per MW, that stack times the capture is the revenue; a very light O&amp;M is the cost. Unlike a merchant battery, the case for a 50–100-year asset rests on a <b>cap-and-floor</b> regime, a contracted floor that removes most of the merchant downside while capping the upside, which is why the regime, not the market, is the swing factor.',
    mb:{tag:'Model A · long-duration storage', title:'New pumped hydro, seeking a cap-and-floor', body:'A long-duration, long-life (50–100yr) pumped-hydro scheme earning a per-MW stack of arbitrage, capacity and system services, with a cap-and-floor regime as a strong contracted floor that makes the very long payback bankable. High civil capex, very low opex. <b>This is Coire Glas / Cruachan</b> (SSE / Drax).'},
    s4a:'The cost base is very light, pumped hydro is a civil asset with few moving parts, so <b>O&amp;M</b> and a small fixed overhead are a small share of revenue and EBITDA margins are high. There is no cell augmentation as in a battery (the "fuel" is water and gravity); the swing factor is on the revenue side, the capture and, above all, the cap-and-floor regime.',
    wfNote:'Operating cost is O&amp;M and a small fixed overhead on a long-life civil asset, there is no battery-style augmentation, so margins are high. The volatility is in the revenue capture, which a cap-and-floor regime largely removes by flooring the revenue.',
    s4b:'The capital is the dam, the reservoirs, the tunnels and penstock, the powerhouse and turbines, and the grid connection, a very high civil capex of roughly <b>£1.5–3m/MW</b>, but for an asset that lasts <b>50–100 years</b>. The cap-and-floor regime is the form of government support that underwrites the floor. Each added scheme is another long, deep, indexed store of energy.',
    stackH:'The capital · dam + tunnels + powerhouse', splitL:'Financing', splitR:'cap-and-floor',
    split:[['s1',55,'Long-dated project debt'],['s2',45,'Equity (infra, contracted)']],
    finList:[['','Revenue','arbitrage + capacity + services'],['sub','Unit','annual stack per MW'],['','Floor','cap-and-floor (contracted)'],['sub','Life','50–100 years'],['','Capex','~£1.5–3m/MW (civil)'],['rest','Owner','SSE (Coire Glas) / Drax (Cruachan)']],
    finNote:'New British pumped hydro is a <b>long-duration, long-life, contracted storage asset</b>: a per-MW stack of arbitrage, capacity and services against a very light cost base, with a cap-and-floor regime as the floor that makes a 50–100-year, high-capex scheme bankable. Lower-return but far steadier than a merchant battery.',
    timeline:[['1965','<b>Cruachan</b>, the "Hollow Mountain", opens in Argyll.'],['2020','<b>Coire Glas</b> consented by the Scottish Government.'],['2023','<b>Cruachan expansion</b> (a second underground station) advances.'],['2024','<b>Cap-and-floor</b> regime for long-duration storage announced.'],['2020s','<b>Final investment decisions</b> await the floor mechanism.'],['Ongoing','<b>Deep storage</b> seen as essential to a renewables-heavy grid.']],
    calcNote:'A working model of a <b>new pumped-hydro scheme</b>. Revenue is power (MW) × revenue per MW × capture; a strong contracted floor models the cap-and-floor regime. Cost is a light O&amp;M on a long-life civil asset. Drop the capture and watch the floor hold the return up, the regime is what makes a 50–100-year asset bankable.',
    s6:'New British pumped hydro is deep, long-life storage waiting on a regime. What drives it:',
    breakers:['<b>The revenue stack</b>, arbitrage + capacity + system services, expressed per MW.','<b>The cap-and-floor regime</b>, the contracted floor that makes a 50–100-year asset bankable.','<b>Duration &amp; depth</b>, many hours of storage, far longer than any battery.','<b>Civil capex</b>, high upfront cost (~£1.5–3m/MW) for a generational asset.'],
    src:'Figures from public sources on <a href="https://www.sse.com/" target="_blank" rel="noopener">SSE\'s Coire Glas</a> and <a href="https://www.drax.com/" target="_blank" rel="noopener">Drax\'s Cruachan</a> schemes and the GB long-duration-storage cap-and-floor consultation. Figures are approximate and illustrative.',
    econ:{cur:'£', duration:20, omPerMW:30, fixedOM:6,
      mwDef:1000,mwMin:300,mwMax:1500,mwStep:25, revDef:215,revMin:110,revMax:360,revStep:5, capDef:80,capMin:25,capMax:100,capStep:1},
    calc:{build:1850,grant:200,capex:2,revG:1,floor:150,cap:360,tax:25,exit:12,lev:3,rd:5.5,amort:3,hold:25},
    map:{footer:GEO.coireglas.footer}
  },

  /* ---------- 2 · BATH COUNTY (North America · merchant + capacity, PJM) ---------- */
  bathcounty:{
    name:'Bath County', geo:'Virginia, USA (PJM)', continent:'North America', cur:'US$', geoKey:'bathcounty',
    lede:'The world\'s largest, <b>Bath County</b> in Virginia, over 3&nbsp;GW of pumped hydro running since 1985, earning <b>merchant arbitrage and PJM capacity</b> payments from a vast, long-life civil asset.',
    s1:'<p class="body"><b>Bath County</b> in Virginia is the world\'s largest pumped-hydro station, over <b>3&nbsp;GW</b> of power and roughly 11 hours of storage, operating since 1985 in the <b>PJM</b> market. It pumps water uphill at night and on cheap-power days and generates into the peaks, the textbook long-duration store, now decades into a 50–100-year life that gives it a very low remaining cost base.</p>'+
       '<p class="body">The economics are a <b>per-MW</b> revenue stack, but more <b>merchant</b> than the UK\'s cap-and-floor model: energy <b>arbitrage</b> in PJM plus a <b>capacity-market</b> payment for being available at peak, and ancillary / balancing services on top. Against a very light O&amp;M on a long-since-built civil asset, margins are high. There is a partial floor from the capacity market, but the arbitrage capture is market-exposed, higher return and more variance than a contracted scheme.</p>',
    facts:[['>3 GW','Power','world\'s largest'],['Arb + cap','Stack','PJM merchant'],['~11h','Duration','long-duration store'],['Since 1985','Life','decades run'],['Per MW','Revenue','annual stack'],['Dominion etc','Owner','utility-owned']],
    s2:'Watch the cycle. Water flows <b>up</b> the penstock (cyan) as Bath County <b>pumps</b> on cheap PJM power, then back <b>down</b> through the turbines as it <b>generates</b> into the peak, power out to the grid (amber/green) is the arbitrage. The upper-reservoir level rises and falls. The cycling brightens with the <b style="color:#0c6b4f">merchant capture</b>. Drag the power, the revenue per MW and the capture, and watch the capacity floor hold a base of revenue up.',
    driverLab:'Revenue / MW', availLab:'Revenue capture', hrK:'Storage revenue', yrS:'stack captured per MW',
    ledge:{a:'+ arbitrage',b:'+ capacity',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> push the <b>revenue per MW</b> up to a strong PJM arbitrage year, then drop the <b>capture</b>, the revenue softens but the <b>capacity-market</b> floor holds a base up. At over 3&nbsp;GW even a modest per-MW stack is an enormous absolute cash flow, on a civil asset that was paid down decades ago. The merchant arbitrage is the upside; the capacity payment is the partial floor.',
    s3:'Bath County earns a <b>per-MW</b> stack in PJM: energy <b>arbitrage</b> (pump cheap, generate dear), a <b>capacity-market</b> payment, and ancillary / balancing services. The capture is more merchant than a UK cap-and-floor scheme, so the arbitrage line is market-exposed, but the capacity payment is a partial floor, and the cost base is tiny on a civil asset built in 1985. The result is a high-margin, large-scale store with merchant upside and a capacity floor.',
    mb:{tag:'Model A · long-duration storage', title:'World\'s largest pumped hydro (PJM)', body:'A &gt;3&nbsp;GW, ~11-hour pumped-hydro store running since 1985, earning a per-MW stack of PJM merchant arbitrage plus a capacity-market payment, on a long-life civil asset with a tiny remaining cost base. Merchant upside with a capacity floor. <b>This is Bath County, Virginia</b>.'},
    s4a:'The cost base is very light, a long-life civil asset with few moving parts means <b>O&amp;M</b> and a small overhead are a small share of revenue, so margins are high. There is no battery-style augmentation; the swing factor is the merchant arbitrage capture in PJM, with the capacity payment as the partial floor.',
    wfNote:'Operating cost is O&amp;M and a small overhead on a civil asset built in 1985, no augmentation, so margins are high. The volatility is in the merchant arbitrage capture; the PJM capacity payment floors part of the revenue.',
    s4b:'The capital was the dam, reservoirs, tunnels, powerhouse and turbines, a vast civil build long since complete, so today the asset trades on its enterprise value rather than a fresh capex. Maintenance capex is modest; the partial capacity floor and the very long remaining life support a steady valuation, with upgrades adding capacity over time.',
    stackH:'The capital · dam + powerhouse (built 1985)', splitL:'Financing', splitR:'merchant + capacity',
    split:[['s1',45,'Project / utility debt'],['s2',55,'Equity (merchant upside)']],
    finList:[['','Revenue','arbitrage + PJM capacity'],['sub','Unit','annual stack per MW'],['','Power','&gt;3 GW (world\'s largest)'],['sub','Duration','~11 hours'],['','Floor','capacity market (partial)'],['rest','Owner','Dominion / utility partners']],
    finNote:'Bath County is a <b>vast, long-life, partly merchant storage asset</b>: a per-MW stack of PJM arbitrage and capacity on a civil asset paid down decades ago, with a tiny cost base and a capacity floor. Higher-return and more variable than a contracted UK scheme, but anchored by the capacity market.',
    timeline:[['1985','<b>Bath County</b> commissioned, the world\'s largest pumped-hydro station.'],['2004','<b>Generation upgrades</b> raise the installed capacity above 3 GW.'],['2007','<b>PJM capacity market</b> (RPM) gives a capacity payment.'],['2010s','<b>Renewables growth</b> raises the value of long-duration storage.'],['2020s','<b>Merchant arbitrage</b> remains the swing line on top of capacity.'],['Ongoing','<b>Decades of remaining life</b> on a long-since-built asset.']],
    calcNote:'A working model of the <b>world\'s largest pumped-hydro store</b>, on an enterprise-value basis. Revenue is MW × revenue per MW × capture, with a capacity floor for the PJM payment. Cost is a light O&amp;M on a civil asset built in 1985. Drop the capture and watch the capacity floor hold a base of the return up.',
    s6:'Bath County is the world\'s largest long-duration store, merchant with a capacity floor. What drives it:',
    breakers:['<b>The revenue stack</b>, PJM arbitrage + a capacity-market payment + ancillary services.','<b>Merchant capture</b>, the market-exposed arbitrage line, the swing factor.','<b>Capacity floor</b>, the PJM capacity payment as a partial contracted floor.','<b>Scale &amp; long life</b>, &gt;3 GW on a civil asset paid down since 1985.'],
    src:'Figures are illustrative for <a href="https://www.dominionenergy.com/" target="_blank" rel="noopener">Bath County</a> pumped-storage station in PJM, drawing on public market data. As a long-life merchant asset, all figures here are approximate and illustrative.',
    econ:{cur:'US$', duration:11, omPerMW:32, fixedOM:8,
      mwDef:3000,mwMin:1000,mwMax:3600,mwStep:50, revDef:200,revMin:100,revMax:340,revStep:5, capDef:80,capMin:20,capMax:100,capStep:1},
    calc:{build:4900,grant:0,capex:2.5,revG:1,floor:320,cap:980,tax:25,exit:11,lev:4,rd:6.5,amort:3,hold:25},
    map:{footer:GEO.bathcounty.footer}
  },

  /* ---------- 3 · ESPEJO DE TARAPACÁ (South America · seawater PSH + solar) ---------- */
  espejo:{
    name:'Espejo de Tarapacá', geo:'Atacama, Chile', continent:'South America', cur:'US$', geoKey:'espejo',
    lede:'Pumped hydro that uses the <b>sea</b>, Chile\'s <b>Espejo de Tarapacá</b>, a seawater pumped-hydro scheme paired with Atacama solar that stores the midday sun in a coastal cliff-top reservoir (illustrative).',
    s1:'<p class="body">Chile\'s Atacama has the world\'s best solar resource, but the power arrives at midday when prices can collapse to zero. <b>Espejo de Tarapacá</b> is an illustrative <b>seawater pumped-hydro</b> scheme: it pumps Pacific seawater up to a natural cliff-top reservoir using cheap midday solar, then releases it back down to the sea through turbines into the evening peak, a long-duration store that needs no dam-fed river, only the ocean and the cliff.</p>'+
       '<p class="body">The economics are a <b>per-MW</b> revenue model, paired with solar and largely <b>contracted</b>: a PPA or capacity arrangement pays a stable revenue per MW for time-shifting the sun, which gives the scheme a meaningful <b>floor</b> rather than full merchant exposure. The long <b>duration</b> moves a lot of energy across the day. As ever in an emerging market, a solid contracted return is then carried at a <b>Chilean discount rate</b>, so the country and currency carry the value.</p>',
    facts:[['Seawater','Source','no river needed'],['Solar-paired','Service','store midday → peak'],['PPA / cap','Floor','contracted'],['Long','Duration','deep daily shift'],['EM rate','Discount','Chilean cost of capital'],['Illustrative','Note','scheme shown']],
    s2:'Watch the cycle. Water flows <b>up</b> the penstock (cyan) as the scheme <b>pumps</b> seawater on cheap midday solar, then back <b>down</b> through the turbines as it <b>generates</b> into the evening peak, the time-shift, power out (amber/green). Because it is <b>PPA / contracted</b>, the revenue holds even as capture moves (watch the floor hold the ledger). The <b style="color:#0c6b4f">capture</b> sets the cycling. Drag the power, the revenue per MW and the capture.',
    driverLab:'Revenue / MW', availLab:'Revenue capture', hrK:'Storage revenue', yrS:'contracted per MW',
    ledge:{a:'+ shift / PPA',b:'+ capacity',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>revenue capture</b>, and watch the revenue barely move, because the <b>PPA / capacity floor</b> holds it up. That contracted floor is what makes a seawater pumped-hydro scheme bankable in an emerging market. Then raise the cost of debt and watch a solid contracted return net down once discounted at a Chilean rate, the EM discount is the real lever here.',
    s3:'Espejo de Tarapacá is paid, largely under <b>contract</b>, to time-shift Atacama solar from midday to the evening peak using a long-duration seawater store. A PPA or capacity arrangement gives a stable revenue per MW, a meaningful floor, so the cash flow is more bond-like than a merchant scheme. The long duration moves a lot of energy across the day; the investor question is less the asset than the <b>discount rate</b>, Chilean rates and currency carry the value.',
    mb:{tag:'Model A · long-duration storage', title:'Seawater pumped hydro, solar-paired (EM)', body:'A seawater pumped-hydro scheme that stores midday Atacama solar in a cliff-top reservoir and generates into the evening peak under a PPA or capacity contract, a contracted, floored per-MW revenue on a long-life civil asset, but priced at an emerging-market discount rate. <b>This is Espejo de Tarapacá</b> (illustrative).'},
    s4a:'The cost base is light, <b>O&amp;M</b> and a small overhead on a long-life civil asset, so margins are high. Because the revenue is contracted (PPA / capacity), the margin is stable through the year; the operational lever is round-trip efficiency and how much energy the long duration can shift between midday and the evening.',
    wfNote:'Operating cost is O&amp;M and a small overhead on a long-life civil asset. The margin is high and, crucially, the PPA / capacity floor holds the revenue even when capture falls, but the whole return is discounted at an emerging-market rate.',
    s4b:'The capital is the cliff-top reservoir, the seawater intake, the penstock and powerhouse, and the connection to the paired solar, a high civil capex, modelled on an enterprise-value basis. The return is a <b>contracted</b> one, carried against Chilean rates and currency, with expansion as more solar-plus-storage is added across the Atacama.',
    stackH:'The capital · reservoir + powerhouse', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local / project debt'],['s2',45,'Developer equity']],
    finList:[['','Service','time-shift solar to peak'],['sub','Revenue','PPA / capacity (contracted)'],['','Source','seawater (no river)'],['sub','Floor','meaningful, contracted'],['','Discount','emerging-market rate'],['rest','Note','illustrative scheme']],
    finNote:'Espejo de Tarapacá is a <b>contracted, floored, long-duration store at an EM discount rate</b>: a stable per-MW revenue for shifting solar, a high margin and a meaningful floor, but the whole investment debate is the discount rate and the currency.',
    timeline:[['2010s','<b>Atacama solar</b> grows to world-leading scale.'],['2016','<b>Espejo de Tarapacá</b> proposed, seawater pumped hydro plus solar.'],['2020','<b>Midday curtailment</b> makes the case for long-duration storage.'],['2020s','<b>PPA / capacity</b> arrangements underpin the cash flow.'],['2020s','<b>Solar-plus-storage</b> tenders support the model.'],['Ongoing','<b>Build-out</b> across the Atacama and central grid.']],
    calcNote:'A working model of a <b>seawater pumped-hydro, contracted scheme</b>, on an enterprise-value basis. Revenue is MW × revenue per MW × capture, but the contracted floor holds it up even at low capture. The cost of debt is high to reflect EM rates, netting a solid contracted return down once discounted.',
    s6:'Espejo de Tarapacá is a contracted seawater store at an EM rate. What drives it:',
    breakers:['<b>The shift</b>, storing midday solar and generating into the evening peak is the service.','<b>Contracted floor</b>, a PPA or capacity deal makes the cash flow bond-like.','<b>Long duration</b>, deep storage moves a lot of energy across the day.','<b>Country &amp; currency</b>, the Chilean discount rate carries the whole valuation.'],
    src:'Figures are illustrative for a seawater pumped-hydro scheme in the Atacama (e.g. Espejo de Tarapacá), drawing on public Chilean energy data. As an illustrative project-level asset at an EM rate, all figures here are approximate and illustrative.',
    econ:{cur:'US$', duration:14, omPerMW:30, fixedOM:3,
      mwDef:300,mwMin:100,mwMax:700,mwStep:25, revDef:215,revMin:110,revMax:360,revStep:5, capDef:80,capMin:25,capMax:100,capStep:1},
    calc:{build:680,grant:60,capex:2.5,revG:2,floor:46,cap:120,tax:27,exit:11,lev:4,rd:8.5,amort:3,hold:26},
    map:{footer:GEO.espejo.footer}
  },

  /* ---------- 4 · SNOWY 2.0 (Oceania · government-backed mega-scheme) ---------- */
  snowy:{
    name:'Snowy 2.0', geo:'Snowy Mountains, NSW, Australia', continent:'Oceania', cur:'A$', geoKey:'snowy',
    lede:'The flagship mega-scheme, <b>Snowy 2.0</b>, a government-backed expansion of the Snowy Hydro scheme linking two existing reservoirs with deep tunnels to add 2&nbsp;GW of power and a week of <b>deep storage</b> to the NEM.',
    s1:'<p class="body"><b>Snowy 2.0</b> is the flagship of Australia\'s energy transition, a government-backed expansion of the historic Snowy Mountains Scheme that links two existing reservoirs, Tantangara and Talbingo, with 27&nbsp;km of deep tunnels and a vast underground power station. It adds about <b>2&nbsp;GW of power</b> and an enormous <b>~350&nbsp;GWh</b> of storage, roughly a week of deep, long-duration storage to firm a renewables-heavy National Electricity Market.</p>'+
       '<p class="body">The economics are a <b>per-MW</b> revenue stack, arbitrage, capacity / reliability and system services in the volatile NEM, but as a <b>government-owned</b> scheme (Snowy Hydro is Commonwealth-owned), the cash flow is underwritten by the state and the reliability mandate rather than left fully merchant, giving a strong contracted-style <b>floor</b>. The civil capex is very high and the project famously complex, but the asset is generational and the storage uniquely deep.</p>',
    facts:[['~2 GW','Power','mega-scheme'],['~350 GWh','Storage','a week of energy'],['Gov-backed','Floor','Commonwealth-owned'],['Deep','Duration','very long-duration'],['Per MW','Revenue','annual stack'],['Snowy Hydro','Owner','government']],
    s2:'Watch the cycle. Water flows <b>up</b> the penstock (cyan) as Snowy 2.0 <b>pumps</b> between its reservoirs on cheap power, then back <b>down</b> through the turbines as it <b>generates</b> into the NEM peaks, power out (amber/green) is the arbitrage and firming. The upper-reservoir level rises and falls. A <b>government-backed</b> floor holds a base of revenue up (watch the ledger). The <b style="color:#0c6b4f">capture</b> sets the cycling. Drag the power, the revenue per MW and the capture.',
    driverLab:'Revenue / MW', availLab:'Revenue capture', hrK:'Storage revenue', yrS:'stack captured per MW',
    ledge:{a:'+ arbitrage',b:'+ reliability',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> push the <b>power</b> up toward 2&nbsp;GW, a mega-scheme where even a modest per-MW stack is a vast absolute cash flow. Drop the <b>capture</b> and watch the <b>government-backed floor</b> hold the revenue up; as a Commonwealth-owned, reliability-mandated scheme, Snowy 2.0 is underwritten by the state rather than left fully merchant, the deepest, longest-duration store on this site.',
    s3:'Snowy 2.0 earns a <b>per-MW</b> stack, arbitrage, capacity / reliability and system services in the volatile NEM, but as a government-owned scheme it is underwritten by the state and a reliability mandate, giving a strong contracted-style floor rather than full merchant exposure. The storage is uniquely deep (about a week), the civil capex very high, and the asset generational. The lever is the <b>reliability mandate and the state backstop</b>, with NEM arbitrage as the upside on top.',
    mb:{tag:'Model A · long-duration storage', title:'Government-backed mega-scheme (Snowy 2.0)', body:'A ~2 GW, ~350 GWh pumped-hydro mega-scheme linking two reservoirs with deep tunnels, earning a per-MW stack of NEM arbitrage, reliability and system services, underwritten by Commonwealth ownership and a reliability mandate as a strong floor. Very deep, long-duration storage. <b>This is Snowy 2.0</b>.'},
    s4a:'The cost base is light relative to revenue, a vast civil asset with few moving parts means <b>O&amp;M</b> and overhead are a small share, so margins are high. There is no battery-style augmentation; the swing factor is the NEM capture, with the government backstop and reliability mandate flooring a base of the revenue.',
    wfNote:'Operating cost is O&amp;M and overhead on a generational civil asset, no augmentation, so margins are high. The volatility is in the NEM capture, which the government-owned, reliability-mandated structure largely backstops.',
    s4b:'The capital is enormous, 27&nbsp;km of tunnels, a deep underground power station, the link between Tantangara and Talbingo, and the transmission to connect it, a very high, much-debated civil capex, but for a uniquely deep, generational store. As a government scheme the equity is the Commonwealth\'s; the growth is more deep storage as coal retires from the NEM.',
    stackH:'The capital · tunnels + underground station', splitL:'Financing', splitR:'government',
    split:[['s1',55,'State-backed debt'],['s2',45,'Commonwealth equity']],
    finList:[['','Revenue','arbitrage + reliability + services'],['sub','Unit','annual stack per MW'],['','Power','~2 GW · ~350 GWh storage'],['sub','Floor','government-backed (strong)'],['','Duration','about a week (deep)'],['rest','Owner','Snowy Hydro (Commonwealth)']],
    finNote:'Snowy 2.0 is a <b>government-backed, very deep, long-duration storage mega-scheme</b>: a per-MW stack of NEM arbitrage, reliability and services on a generational civil asset, underwritten by the state. Lower-return but very steady; the deepest store here, with real NEM upside on top of the floor.',
    timeline:[['1949','<b>Snowy Mountains Scheme</b> begins, the original nation-building project.'],['2017','<b>Snowy 2.0</b> announced as a 2 GW pumped-hydro expansion.'],['2019','<b>Construction starts</b> on the tunnels and underground station.'],['2020s','<b>Cost and schedule</b> grow as the project proves complex.'],['2020s','<b>Coal retirements</b> raise the value of deep, long-duration storage.'],['Ongoing','<b>Commissioning</b> toward full ~2 GW / ~350 GWh operation.']],
    calcNote:'A working model of a <b>government-backed pumped-hydro mega-scheme</b>. Revenue is MW × revenue per MW × capture, with a strong government-backed floor for the reliability mandate. Cost is a light O&amp;M on a generational civil asset. The floor steadies the return; NEM arbitrage provides the upside.',
    s6:'Snowy 2.0 is a government-backed, very deep store. What drives it:',
    breakers:['<b>Deep storage</b>, about a week of energy, far longer than any battery or shorter scheme.','<b>Government backstop</b>, Commonwealth ownership and a reliability mandate floor the revenue.','<b>NEM volatility</b>, arbitrage and reliability capture provide the upside.','<b>Coal retirements</b>, raise the value of deep, long-duration storage as the NEM decarbonises.'],
    src:'Figures are illustrative for <a href="https://www.snowyhydro.com.au/" target="_blank" rel="noopener">Snowy 2.0</a>, drawing on public Snowy Hydro and AEMO data. As a government-owned mega-scheme, all figures here are approximate and illustrative.',
    econ:{cur:'A$', duration:175, omPerMW:34, fixedOM:10,
      mwDef:2000,mwMin:700,mwMax:2200,mwStep:50, revDef:230,revMin:120,revMax:380,revStep:5, capDef:80,capMin:25,capMax:100,capStep:1},
    calc:{build:4700,grant:600,capex:2,revG:1,floor:280,cap:620,tax:30,exit:12,lev:3,rd:5.5,amort:3,hold:30},
    map:{footer:GEO.snowy.footer}
  },

  /* ---------- 5 · HATTA (Middle East · DEWA utility-owned) ---------- */
  hatta:{
    name:'Hatta', geo:'Hatta, Dubai, UAE', continent:'Middle East', cur:'AED', geoKey:'hatta',
    lede:'The Gulf\'s pumped hydro, <b>DEWA\'s Hatta</b> scheme in the Dubai mountains, a utility-owned store that uses an existing dam to firm Dubai\'s vast solar at a very low, state-backed cost of capital.',
    s1:'<p class="body"><b>DEWA\'s Hatta</b> pumped-hydro scheme is the Gulf\'s pioneering long-duration store, 250&nbsp;MW built into the Hatta mountains, using the water of an existing dam as the lower reservoir and a new upper reservoir above it. It pumps on cheap daytime solar and generates into the evening, firming Dubai\'s enormous solar build (the Mohammed bin Rashid Al Maktoum Solar Park) with a long-life civil asset.</p>'+
       '<p class="body">The economics are a <b>per-MW</b> revenue model, but as a <b>utility-owned</b> asset of DEWA the revenue is effectively a regulated / availability arrangement rather than merchant, a strong contracted <b>floor</b>, indexed and bond-like, with little market exposure. Combined with a very <b>low, state-backed cost of capital</b>, the return is lower but very secure: a contracted infrastructure annuity that firms solar, rather than a merchant bet.</p>',
    facts:[['250 MW','Power','utility store'],['Utility-owned','Revenue','DEWA regulated'],['Existing dam','Source','lower reservoir'],['6h','Duration','firms solar'],['Low','Cost of capital','state-backed'],['Per MW','Unit','fixed / regulated']],
    s2:'Watch the cycle. Water flows <b>up</b> the penstock (cyan) as Hatta <b>pumps</b> from the existing dam on cheap daytime solar, then back <b>down</b> through the turbines as it <b>generates</b> into the evening, power out (amber/green). But the revenue is a <b>regulated / availability</b> arrangement, so it barely moves with capture (watch the floor hold the ledger right up). The <b style="color:#0c6b4f">capture</b> sets the cycling, not the cash. Drag the power, the revenue per MW and the capture.',
    driverLab:'Revenue / MW', availLab:'Revenue capture', hrK:'Storage revenue', yrS:'regulated per MW',
    ledge:{a:'+ availability',b:'+ (small merchant)',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>revenue capture</b> right down, and watch the revenue hardly move, because the <b>regulated / availability floor</b> holds it up almost entirely. That contracted, volume-insensitive cash flow plus a very low, state-backed cost of capital is what makes DEWA\'s Hatta a low-risk, lower-return infrastructure annuity that firms Dubai\'s solar.',
    s3:'DEWA\'s Hatta is paid an effectively <b>regulated / availability</b> revenue per MW as a utility-owned asset, regardless of dispatch, so the revenue is almost entirely a contracted floor, with little merchant exposure. The margin is high and the cash flow bond-like; combined with a very low, state-backed cost of capital, the return is lower but very secure. The lever is the <b>regulated arrangement and the cost of capital</b>, not the market, a long-life store that firms solar.',
    mb:{tag:'Model A · long-duration storage', title:'Utility-owned pumped hydro (DEWA Hatta)', body:'A 250 MW, utility-owned pumped-hydro store using an existing dam to firm Dubai\'s solar, paid an effectively regulated / availability revenue per MW regardless of dispatch, almost entirely contracted, bond-like, at a very low state-backed cost of capital. Lower-return but very secure. <b>This is DEWA\'s Hatta scheme</b>.'},
    s4a:'The cost base is light, <b>O&amp;M</b> and a small overhead on a long-life civil asset, so margins are very high. Because the revenue is a regulated / availability arrangement, the margin is essentially fixed; there is no merchant volatility to manage, only availability on a civil asset with few moving parts.',
    wfNote:'Operating cost is O&amp;M and a small overhead on a long-life civil asset. Margins are very high; the regulated / availability arrangement means revenue, and so cash flow, is fixed and bond-like regardless of how the scheme is dispatched.',
    s4b:'The capital is the new upper reservoir, the penstock and powerhouse, and the connection, using the existing Hatta dam as the lower reservoir keeps the civil scope down. As a DEWA asset it is financed at a very <b>low cost of capital</b> against a state-backed, investment-grade utility. The return is a secure, regulated annuity; growth is the Gulf\'s pipeline of storage to firm solar.',
    stackH:'The capital · upper reservoir + powerhouse', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',70,'Low-cost project debt'],['s2',30,'Equity (secure, regulated)']],
    finList:[['','Revenue','regulated / availability'],['sub','Floor','dominates, bond-like'],['','Cost of capital','very low (state-backed)'],['sub','Duration','6h (firms solar)'],['','Source','existing dam (lower reservoir)'],['rest','Owner','DEWA (utility)']],
    finNote:'DEWA\'s Hatta is a <b>contracted, bond-like, long-life storage annuity</b>: a regulated / availability revenue per MW, a very high margin and a very low cost of capital. The lowest-risk and lowest-return scheme here, a utility-owned store that firms solar.',
    timeline:[['2019','<b>DEWA</b> launches the Hatta pumped-hydro project.'],['2020','<b>Construction begins</b> using the existing Hatta dam.'],['2020s','<b>Mohammed bin Rashid Solar Park</b> grows the need to firm solar.'],['2020s','<b>250 MW · 6h</b> store firms daytime solar into the evening.'],['2020s','<b>Low cost of capital</b> reflects state-backed DEWA ownership.'],['Ongoing','<b>Commissioning</b> as the Gulf\'s pioneering pumped-hydro store.']],
    calcNote:'A working model of a <b>utility-owned, regulated pumped-hydro store</b>, on an enterprise-value basis. Revenue is an effectively regulated / availability arrangement, the floor dominates, so the cash flow holds regardless of capture. Cost is a light O&amp;M. A low cost of capital gives a secure, lower return.',
    s6:'DEWA\'s Hatta is a regulated, bond-like store that firms solar. What drives it:',
    breakers:['<b>The regulated arrangement</b>, an availability / regulated revenue makes the cash flow bond-like.','<b>Cost of capital</b>, a very low, state-backed rate is the principal value driver.','<b>Existing dam</b>, using the Hatta dam as the lower reservoir keeps the civil scope down.','<b>Firming solar</b>, shifting daytime solar into the evening is the service it provides.'],
    src:'Figures are illustrative for <a href="https://www.dewa.gov.ae/" target="_blank" rel="noopener">DEWA\'s Hatta</a> pumped-hydro scheme. As a utility-owned, regulated asset, all figures here are approximate and illustrative.',
    econ:{cur:'AED', duration:6, omPerMW:30, fixedOM:3,
      mwDef:250,mwMin:100,mwMax:600,mwStep:25, revDef:215,revMin:110,revMax:340,revStep:5, capDef:78,capMin:25,capMax:100,capStep:1},
    calc:{build:600,grant:60,capex:2,revG:1,floor:34,cap:90,tax:0,exit:11,lev:5,rd:5,amort:3,hold:28},
    map:{footer:GEO.hatta.footer}
  },

  /* ---------- 6 · FENGNING (China · state-owned, world's largest by capacity) ---------- */
  fengning:{
    name:'Fengning', geo:'Hebei, China', continent:'China', cur:'¥', geoKey:'fengning',
    lede:'Pumped hydro at <b>continental scale</b>, China\'s <b>Fengning</b> station in Hebei, the world\'s largest by capacity at 3.6&nbsp;GW, a state-owned store firming Beijing\'s wind and solar under a regulated two-part tariff.',
    s1:'<p class="body"><b>Fengning</b> in Hebei is the world\'s largest pumped-hydro station by capacity, <b>3.6&nbsp;GW</b> across twelve units, built to firm the wind and solar of northern China and support Beijing and the grid. China builds more pumped hydro than the rest of the world combined, with a vast pipeline of stations under a national plan, all state-owned and central to a renewables-heavy system.</p>'+
       '<p class="body">The economics are a <b>per-MW</b> revenue, weighted to a <b>regulated</b> floor: China pays pumped hydro through a <b>two-part tariff</b>, a capacity payment for being available plus an energy payment for arbitrage, set by the regulator, which makes the revenue contracted-ish and stable rather than merchant. A modest but stable per-MW revenue applied at colossal scale, against a low cost base and a low, state-linked cost of capital. The story is <b>scale and a regulated tariff</b>, not market price.</p>',
    facts:[['3.6 GW','Power','world\'s largest'],['Two-part','Tariff','capacity + energy'],['State-owned','Owner','regulated'],['~10h','Duration','firms renewables'],['Vast','Scale','national pipeline'],['Per MW','Unit','modest, stable']],
    s2:'Watch the cycle. Water flows <b>up</b> the penstock (cyan) as Fengning <b>pumps</b> on cheap wind and solar, then back <b>down</b> through the turbines as it <b>generates</b> into the peak, power out (amber/green). But much of the revenue is a <b>regulated two-part tariff</b> (a capacity payment), so it holds even as capture moves (watch the floor hold the ledger). At 3.6&nbsp;GW a modest per-MW revenue is enormous. The <b style="color:#0c6b4f">capture</b> sets the cycling. Drag the power, the revenue per MW and the capture.',
    driverLab:'Revenue / MW', availLab:'Revenue capture', hrK:'Storage revenue', yrS:'tariff + arbitrage per MW',
    ledge:{a:'+ capacity',b:'+ arbitrage',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> push the <b>power</b> up toward 3.6&nbsp;GW, at China\'s scale, even a modest per-MW revenue is a vast absolute cash flow. Drop the capture and watch the <b>regulated two-part tariff</b> (the capacity payment) hold the revenue up; the model is a regulated tariff and continental scale, not merchant price, a state-owned store firming the renewables of northern China.',
    s3:'Fengning earns a <b>regulated</b> per-MW revenue: a two-part tariff of a capacity payment (for being available) plus an energy payment (for arbitrage), set by the regulator, so the revenue is contracted-ish and stable rather than merchant. Applied at colossal scale against a low cost base and a low, state-linked cost of capital, a modest revenue per MW is a vast, stable cash flow. The lever is <b>scale and the regulated tariff</b>, with merchant arbitrage a secondary line as power markets reform.',
    mb:{tag:'Model A · long-duration storage', title:'State-owned, regulated pumped hydro (China)', body:'The world\'s largest pumped-hydro station by capacity at 3.6 GW, state-owned and paid through a regulated two-part tariff (capacity + energy), firming northern China\'s wind and solar at a low cost base and low cost of capital. Scale and a regulated tariff, not merchant price. <b>This is Fengning, Hebei</b>.'},
    s4a:'The cost base is very light, <b>O&amp;M</b> and a small overhead on a long-life civil asset, so margins are high. The revenue is mostly a regulated two-part tariff and so the margin is stable; the swing line is the emerging energy / arbitrage component as China\'s power markets reform.',
    wfNote:'Operating cost is O&amp;M and a small overhead on a long-life civil asset. Margins are high; the regulated two-part tariff (the capacity payment) floors the cash flow, with the energy / arbitrage component a growing secondary line.',
    s4b:'The capital is the dam, the upper and lower reservoirs, the tunnels and the vast underground power station, a high civil capex, financed at a low, state-linked cost of capital. The build-out is enormous and policy-driven; each station adds another slice of regulated, capacity-led revenue to a vast, growing national fleet.',
    stackH:'The capital · dam + underground station', splitL:'Financing', splitR:'state-linked',
    split:[['s1',60,'State-linked debt'],['s2',40,'Equity (low cost of capital)']],
    finList:[['','Driver','firms wind &amp; solar'],['sub','Revenue','two-part tariff (capacity + energy)'],['','Floor','regulated (contracted-ish)'],['sub','Power','3.6 GW (world\'s largest)'],['','Cost of capital','low (state-linked)'],['rest','Story','scale &amp; regulated tariff']],
    finNote:'Fengning is a <b>state-owned, regulated, vast-scale long-duration store</b>: a modest but stable per-MW revenue (a two-part tariff) at colossal scale, a low cost base and a low cost of capital. The return is steady and large in absolute terms; merchant arbitrage is a growing secondary line as markets reform.',
    timeline:[['2013','<b>Fengning</b> construction approved in Hebei.'],['2021','<b>First units</b> of the station enter service.'],['2023','<b>Full 3.6 GW</b>, the world\'s largest by capacity, completed.'],['2021','<b>Two-part tariff</b> policy underpins pumped-hydro revenue nationally.'],['2020s','<b>National pipeline</b> of pumped hydro expands rapidly.'],['Ongoing','<b>Market reform</b> grows the energy / arbitrage component.']],
    calcNote:'A working model of a <b>state-owned, regulated pumped-hydro station</b>, on an enterprise-value basis. Revenue is MW × revenue per MW × capture, with a regulated two-part-tariff floor that holds it at low capture. A low cost base and low cost of capital give a steady, large-scale return. Figures are highly illustrative.',
    s6:'Fengning is state-owned, regulated pumped hydro at vast scale. What drives it:',
    breakers:['<b>The regulated tariff</b>, a two-part tariff (capacity + energy) is the contracted floor.','<b>Scale &amp; low cost</b>, 3.6 GW and a low cost base make a modest per-MW revenue vast.','<b>Firming renewables</b>, storing northern China\'s wind and solar is the purpose.','<b>Market reform</b>, the energy / arbitrage component is a growing secondary line.'],
    src:'Figures are illustrative for the <a href="http://www.sgcc.com.cn/" target="_blank" rel="noopener">Fengning</a> pumped-storage station in Hebei, drawing on public Chinese energy data. Given the scale and regulated structure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', duration:10, omPerMW:34, fixedOM:10,
      mwDef:3600,mwMin:1000,mwMax:3600,mwStep:50, revDef:200,revMin:110,revMax:340,revStep:5, capDef:78,capMin:25,capMax:100,capStep:1},
    calc:{build:6100,grant:0,capex:2,revG:1,floor:360,cap:980,tax:25,exit:11,lev:4,rd:4,amort:3,hold:28},
    map:{footer:GEO.fengning.footer}
  }
  };
  var ORDER=['coireglas','bathcounty','espejo','snowy','hatta','fengning'];

  /* ===================================================================
     PUMPED-HYDRO RENDERER  (canvas, 720x520), elevation / hillside, daytime
     An UPPER reservoir high on the canvas, a LOWER reservoir below, a penstock /
     tunnel down a hillside, a powerhouse / turbine hall between them, and a grid
     switchyard with transmission lines. Water flows DOWN the penstock when
     generating (discharging, cyan/white; power OUT to the grid, amber/green) and
     UP when pumping (charging, cyan IN) on a slow cycle; the upper-reservoir level
     rises and falls. Intensity scales with the revenue capture.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  /* scheme geometry: upper reservoir (top) → penstock down the hill → powerhouse →
     lower reservoir (bottom), with a grid switchyard + pylon to the right. */
  var UPPER={x:150,y:118,w:300,h:88};     // upper reservoir (high on canvas)
  var LOWER={x:300,y:402,w:340,h:96};     // lower reservoir (lower down)
  var HOUSE={x:262,y:300};                 // powerhouse / turbine hall
  var PYLON={x:648,y:236};                 // grid switchyard / pylon
  var COL_IN='rgba(70,190,225,', COL_OUT='rgba(120,200,110,';   // pump (cyan) / generate (green)
  var PENSTOCKS=[];                        // list of {x} penstock lines down the hill
  var NPEN=2;

  function layout(){
    // number of penstocks scales with the MW (slider range) → bigger powerhouse
    var E=A.econ;
    var norm=(E.mwDef-E.mwMin)/Math.max(1,(E.mwMax-E.mwMin));
    NPEN=Math.max(1,Math.min(4,Math.round(1+3*norm)));
    PENSTOCKS=[]; var cx=HOUSE.x, span=14;
    for(var i=0;i<NPEN;i++){ PENSTOCKS.push({dx:(i-(NPEN-1)/2)*span}); }
  }

  /* ---- base map: sky + hillside + reservoirs ---- */
  function drawMap(upLevel){
    // sky
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#cfe0ee'); g.addColorStop(0.5,'#dfe7dd'); g.addColorStop(1,'#cdd8c6');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // distant hillside band behind the upper reservoir
    ctx.fillStyle='rgba(150,165,148,0.30)';
    ctx.beginPath(); ctx.moveTo(0,170); ctx.lineTo(W*0.42,96); ctx.lineTo(W*0.78,150); ctx.lineTo(W,110); ctx.lineTo(W,360); ctx.lineTo(0,360); ctx.closePath(); ctx.fill();
    // hillside slope from upper reservoir down to the lower
    var hg=ctx.createLinearGradient(0,180,0,420); hg.addColorStop(0,'#bcc8b4'); hg.addColorStop(1,'#a9b6a0');
    ctx.fillStyle=hg;
    ctx.beginPath(); ctx.moveTo(UPPER.x-30,UPPER.y+UPPER.h-6); ctx.lineTo(UPPER.x+UPPER.w+30,UPPER.y+UPPER.h-6);
    ctx.lineTo(LOWER.x+LOWER.w+30,LOWER.y); ctx.lineTo(LOWER.x-60,LOWER.y); ctx.closePath(); ctx.fill();
    // upper reservoir dam wall
    ctx.fillStyle='#9aa496'; rr(UPPER.x-8,UPPER.y+UPPER.h-10,UPPER.w+16,14,3); ctx.fill();
    // upper reservoir water (level varies slightly with the cycle)
    var uh=UPPER.h*(0.62+0.30*upLevel), uy=UPPER.y+UPPER.h-uh;
    var ug=ctx.createLinearGradient(0,uy,0,uy+uh); ug.addColorStop(0,'#5fa9c8'); ug.addColorStop(1,'#3f7fa6');
    ctx.fillStyle=ug; rr(UPPER.x,uy,UPPER.w,uh,5); ctx.fill();
    // upper water surface shimmer
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1; ctx.beginPath();
    for(var sx=UPPER.x+6;sx<UPPER.x+UPPER.w-4;sx+=12){ ctx.moveTo(sx,uy+3+Math.sin((sx+T)*0.12)*1.2); ctx.lineTo(sx+6,uy+3+Math.sin((sx+6+T)*0.12)*1.2); } ctx.stroke();
    ctx.strokeStyle='rgba(80,110,120,0.4)'; ctx.lineWidth=1; rr(UPPER.x,UPPER.y+8,UPPER.w,UPPER.h-8,5); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('UPPER RESERVOIR',UPPER.x+UPPER.w/2,UPPER.y-4);
    // lower reservoir water
    var lg=ctx.createLinearGradient(0,LOWER.y,0,LOWER.y+LOWER.h); lg.addColorStop(0,'#5aa3c2'); lg.addColorStop(1,'#3a78a0');
    ctx.fillStyle=lg; rr(LOWER.x,LOWER.y,LOWER.w,LOWER.h,7); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1; ctx.beginPath();
    for(var lx=LOWER.x+8;lx<LOWER.x+LOWER.w-4;lx+=14){ ctx.moveTo(lx,LOWER.y+4+Math.sin((lx-T)*0.1)*1.4); ctx.lineTo(lx+7,LOWER.y+4+Math.sin((lx+7-T)*0.1)*1.4); } ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('LOWER RESERVOIR',LOWER.x+LOWER.w/2,LOWER.y+LOWER.h+13);
  }

  /* ---- penstock / tunnel down the hill (one per PENSTOCKS entry) ---- */
  function penstock(p){
    var x0=UPPER.x+UPPER.w/2+p.dx, y0=UPPER.y+UPPER.h-4;
    var x1=HOUSE.x+p.dx, y1=HOUSE.y-14;
    ctx.strokeStyle='rgba(110,120,112,0.85)'; ctx.lineWidth=7; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.strokeStyle='rgba(150,160,150,0.7)'; ctx.lineWidth=3.4;
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    // support bands
    ctx.strokeStyle='rgba(90,100,92,0.5)'; ctx.lineWidth=1;
    for(var t=0.2;t<1;t+=0.22){ var bx=x0+(x1-x0)*t, by=y0+(y1-y0)*t;
      ctx.beginPath(); ctx.moveTo(bx-5,by-3); ctx.lineTo(bx+5,by+3); ctx.stroke(); }
  }

  /* ---- powerhouse / turbine hall ---- */
  function powerhouse(intensity){
    var x=HOUSE.x,y=HOUSE.y, w=66+10*Math.min(1,(NPEN-1)/3), h=44;
    ctx.fillStyle='rgba(40,55,40,0.16)'; ctx.beginPath(); ctx.ellipse(x,y+h/2+5,w*0.55,6,0,0,Math.PI*2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-h/2,x,y+h/2); g.addColorStop(0,'#b8beb6'); g.addColorStop(1,'#969c94');
    ctx.fillStyle=g; rr(x-w/2,y-h/2,w,h,4); ctx.fill();
    ctx.strokeStyle='rgba(110,120,112,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // roof
    ctx.fillStyle='#8a908a'; ctx.beginPath(); ctx.moveTo(x-w/2-3,y-h/2); ctx.lineTo(x,y-h/2-12); ctx.lineTo(x+w/2+3,y-h/2); ctx.closePath(); ctx.fill();
    // turbine windows / units
    ctx.fillStyle='rgba(70,90,90,0.6)';
    var nu=Math.max(2,Math.min(5,NPEN+1)), uw=(w-12)/nu;
    for(var i=0;i<nu;i++){ rr(x-w/2+6+i*uw,y-h/2+10,uw-4,h-18,2); ctx.fill(); }
    glow(x,y,18+12*intensity,'rgba(255,210,120,0.5)',0.3+0.5*intensity);
    ctx.fillStyle='rgba(70,90,80,0.9)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('POWERHOUSE',x,y+h/2+18);
  }

  /* ---- grid connection: switchyard + pylon + line ---- */
  function pylon(){
    var x=PYLON.x,y=PYLON.y;
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x,y+44,18,4,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(110,120,115,0.85)'; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(x-12,y+44); ctx.lineTo(x-4,y-44); ctx.moveTo(x+12,y+44); ctx.lineTo(x+4,y-44); ctx.stroke();
    ctx.lineWidth=1.4;
    for(var i=-30;i<40;i+=14){ ctx.beginPath(); ctx.moveTo(x-9+ (i+44)*0.09,y+i); ctx.lineTo(x+9-(i+44)*0.09,y+i); ctx.stroke(); }
    ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(x-22,y-30); ctx.lineTo(x+22,y-30); ctx.moveTo(x-26,y-12); ctx.lineTo(x+26,y-12); ctx.stroke();
    // line from the powerhouse to the pylon
    ctx.strokeStyle='rgba(90,100,95,0.6)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(HOUSE.x+34,HOUSE.y-30); ctx.quadraticCurveTo((HOUSE.x+x)/2,HOUSE.y-46,x-22,y-30); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('GRID',x,y+58);
  }

  /* ---- flow pulses along a path ---- */
  function flowPulses(pts,speed,load,col,gcol,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.8,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.8,0,Math.PI*2); ctx.fill(); }
  }

  /* charge(pump)/discharge(generate) cycle state (set in frame) */
  var _charging=true;

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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ arbitrage',b:'+ capacity',c:'− O&M'};
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
  /* ---- live revenue-capture sparkline ---- */
  function drawDemand(load){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'CAPTURE';
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
    var powerMW=parseFloat(sCap.value), revPerMW=parseFloat(sSpread.value), cap=parseFloat(sAvail.value)/100;
    var dur=(E.duration||G.duration||1);
    // slow pump/generate cycle; capture sets the cycling intensity
    var cyc=Math.sin(T*0.013);           // +ve = generate (discharge), -ve = pump (charge)
    _charging=(cyc<0);                   // pumping = charging
    // upper-reservoir level: high when pumped full, drops as it generates
    var upLevel=0.5+0.42*Math.sin(T*0.013);
    var captureVis=Math.max(0.02,Math.min(1, cap*(0.94+0.12*Math.sin(T*0.02))));
    var active=captureVis*(0.45+0.55*Math.abs(cyc));   // how busy the cycling is

    ctx.clearRect(0,0,W,H);
    drawMap(upLevel); pylon();
    PENSTOCKS.forEach(penstock);
    powerhouse(captureVis*Math.abs(cyc));

    // flow paths: penstock (upper→powerhouse) and grid line (powerhouse→pylon).
    // generate = water DOWN the penstock + power OUT to grid; pump = water UP + power IN.
    var loadVis=0.25+0.7*active;
    PENSTOCKS.forEach(function(p){
      var up=[[UPPER.x+UPPER.w/2+p.dx,UPPER.y+UPPER.h-4],[HOUSE.x+p.dx,HOUSE.y-14]];
      if(_charging){ flowPulses(up,0.8+loadVis,loadVis,COL_IN+'0.95)',COL_IN+'0.6)',true); }     // water UP (pump)
      else { flowPulses(up,0.9+loadVis,loadVis,COL_OUT+'0.95)','rgba(230,245,255,0.6)',false); }  // water DOWN (generate)
    });
    var gridLine=[[HOUSE.x+34,HOUSE.y-30],[PYLON.x-22,PYLON.y-30]];
    if(_charging){ flowPulses(gridLine,0.8+loadVis,loadVis,COL_IN+'0.95)',COL_IN+'0.6)',true); }   // power IN from grid
    else { flowPulses(gridLine,0.9+loadVis,loadVis,COL_OUT+'0.95)',COL_OUT+'0.6)',false); }         // power OUT to grid

    // ---- economics (per-MW revenue stack, capture + strong contracted floor) ----
    var revenue=powerMW*revPerMW*1000*cap;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));      // floor = cap-and-floor / capacity / regulated contracted revenue
    var grossRev=powerMW*revPerMW*1000*cap;              // uncapped/unfloored, for the fixed-share heuristic
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var omCost=powerMW*(E.omPerMW||0)*1000, fixedOM=(E.fixedOM||0)*1e6, opex=omCost+fixedOM;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is contracted/capacity (floor) vs merchant
    var fixShare=Math.max(0.1,Math.min(0.75, revenue>grossRev?(revenue-grossRev)/revenue+0.2:(G.contracted?0.5:0.22)));
    var c_om=opex*0.46, c_water=opex*0.32, c_admin=opex*0.22;

    if(G.growing){
      // + EXPANSION marker above the upper reservoir
      var ex=UPPER.x+UPPER.w-30, ey=UPPER.y-18, pul=0.5+0.5*Math.sin(T*0.12);
      ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('+ EXPANSION',ex,ey); ctx.restore();
      glow(ex,ey-2,9,'rgba(12,107,79,'+(0.25+0.3*pul)+')');
    }

    if(_anim){
      if(Math.random()<0.4+0.5*captureVis){ spawnCoin(HOUSE.x+rnd(-20,20),HOUSE.y-18, Math.random()<fixShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.55, opex/Math.max(1,revenue)));
      if(Math.random()<outRate){ spawnCoin(HOUSE.x+rnd(-20,20),HOUSE.y+8,'cost',1); }
      demHist.push(captureVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(captureVis);

    // phase label
    ctx.save(); ctx.fillStyle=(_charging?'rgba(40,120,150,0.85)':'rgba(60,120,55,0.85)'); ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText(_charging?'PUMPING ▲ (charging)':'GENERATING ▼ (discharging)', 18, H-40); ctx.restore();

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+Math.round(powerMW)+' MW / '+dur+'h',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',Math.round(powerMW)+' MW'); set('ixSpreadV',CUR+Math.round(revPerMW)+'k/MW'); set('ixAvailV',Math.round(cap*100)+'%');
    set('ixDir',Math.round(powerMW)+' MW'); set('ixDirS',(G.contracted?'contracted / cap-and-floor':'merchant + capacity')+' · '+dur+'h');
    set('ixMW',mwh(powerMW*dur)+' · '+dur+'h'); set('ixMWs',Math.round(cap*100)+'% revenue capture');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['O&amp;M',c_om],['Water / civil',c_water],['Admin',c_admin]], ebitda);
    set('wfMargin', revenue>0?Math.round(ebitda/revenue*100)+'%':'—');
  }
  function stripTags(s){ return s.replace(/&amp;/g,'&').replace(/&nbsp;/g,' '); }

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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the captured revenue is too thin to value, raise the revenue per MW or the revenue capture, or lower the cost base.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build</span> <b>'+money(capexGrossG)+'</b></span>'+
      '<span><span class="lbl">Net of support</span> <b>'+money(netCapexG)+'</b></span>'+
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
    var E=A.econ, G=GEO[A.geoKey], dur=(E.duration||G.duration||1);
    sCap.min=E.mwMin; sCap.max=E.mwMax; sCap.step=E.mwStep; sCap.value=E.mwDef;
    sSpread.min=E.revMin; sSpread.max=E.revMax; sSpread.step=E.revStep; sSpread.value=E.revDef;
    sAvail.min=E.capMin; sAvail.max=E.capMax; sAvail.step=E.capStep; sAvail.value=E.capDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is the per-MW stack (power × revenue per MW × revenue capture, with a strong contracted floor for any cap-and-floor / capacity / regulated payment) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.mwDef; sSpread.value=E.revDef; sAvail.value=E.capDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'coireglas');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
