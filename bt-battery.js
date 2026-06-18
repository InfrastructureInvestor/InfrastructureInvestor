/* Battery storage (grid-scale BESS) — data-driven worked examples.
   Six real grid-scale battery businesses, one template. Scene config from
   bt-geo.js (GEO), drawn as a top-down / elevation battery storage site in
   720x520 scene coords: rows of battery container units in a fenced compound, a
   transformer / inverter skid, and a grid connection (pylon + line). Power
   pulses flow IN from the grid (charging) and OUT (discharging) on a slow cycle.
   The economics are a revenue-stack model — annual gross margin PER MW from
   energy arbitrage, frequency / ancillary services, and capacity-market /
   tolling payments — against O&M and an augmentation reserve, with a contracted
   (tolling / capacity) floor; the returns model is a simplified DCF. */
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

  /* ---------- 1 · GB GRID-SCALE BATTERY (Europe · merchant + capacity + FR) ---------- */
  gbbess:{
    name:'GB grid-scale battery', geo:'Great Britain', continent:'Europe', cur:'£', geoKey:'gbbess',
    lede:'The model market for the merchant battery — a <b>grid-scale BESS</b> in Great Britain that stacks <b>energy arbitrage, frequency response and capacity-market</b> payments into an annual margin per MW, with the merchant volatility that goes with it.',
    s1:'<p class="body">A <b>grid-scale battery</b> charges when power is cheap or plentiful and discharges when it is expensive or scarce, earning the spread; alongside that <b>arbitrage</b> it provides fast <b>frequency response</b> and other ancillary services the grid pays for, and it can bid a <b>capacity-market</b> contract for being available at peak. In Great Britain, developers such as <b>Zenobē</b> and <b>Gresham House</b> have built large fleets that earn from this <b>revenue stack</b>, expressed as an annual gross margin <b>per MW</b>.</p>'+
       '<p class="body">The economics are a <b>per-MW</b> revenue model, not a RAB: revenue is the MW of power × the revenue captured per MW per year × how fully the available stack is captured, against O&amp;M and an <b>augmentation</b> reserve (cells degrade, so capacity must be topped up). The build cost depends on <b>duration</b> — a 1–2 hour battery is roughly £0.5–1.0m/MW. The merchant revenue is <b>volatile</b> — that is the risk — and a capacity or frequency-response contract gives a partial floor.</p>',
    facts:[['Per MW','Revenue','annual margin'],['Arb + FR + cap','Stack','three revenue lines'],['Merchant','Risk','volatile capture'],['~2h','Duration','£0.5–1.0m/MW'],['Augment','Opex','degradation reserve'],['Zenobē / GH','Owner','infra-backed']],
    s2:'Watch the cycle. Power pulses flow <b>in</b> from the grid (cyan) as the battery <b>charges</b>, then flow back <b>out</b> (amber/green) as it <b>discharges</b> — the arbitrage. The state-of-charge bars rise and fall, and the cycling gets brighter and busier with the <b style="color:#0c6b4f">merchant capture</b>. Drag the power, the revenue per MW and the capture — and watch the margin at low capture, where merchant batteries hurt.',
    driverLab:'Revenue / MW', availLab:'Merchant capture', hrK:'Service revenue', yrS:'stack captured per MW',
    ledge:{a:'+ arbitrage',b:'+ services/cap',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>merchant capture</b> right down and watch the EBITDA and the returns collapse — that is the merchant-revenue risk that defines an uncontracted battery. Push the revenue per MW to see a strong year (high spreads, scarce capacity). The capacity-market and frequency-response income is the partial floor that stops a bad year going to zero.',
    s3:'A GB battery earns a <b>stack</b>: arbitrage (the price spread between charging and discharging), frequency response and other ancillary services, and a capacity-market payment for being available at peak. Expressed per MW, that stack times the <b>merchant capture</b> is the revenue; O&amp;M and an augmentation reserve are the cost. The capture is volatile — saturation as more batteries enter can erode arbitrage and service prices — so the return is higher but riskier than a tolled battery.',
    mb:{tag:'Model A · the revenue stack', title:'Merchant battery — arbitrage + services + capacity', body:'A grid-scale battery that stacks energy arbitrage, frequency / ancillary services and a capacity-market payment into an annual margin per MW — high-return but merchant-volatile, with the capacity and frequency contracts as a partial floor. <b>This is a GB grid-scale battery</b> (Zenobē / Gresham House style).'},
    s4a:'The cost base is light: <b>O&amp;M</b> and an <b>augmentation</b> reserve to replace degrading cells, plus a small fixed overhead — so EBITDA margins are high (services revenue is almost all margin). The swing factor is on the revenue side: the merchant capture and the saturation of the arbitrage and ancillary markets.',
    wfNote:'Operating cost is O&amp;M and an augmentation reserve (cells degrade and must be topped up), plus a fixed overhead. Margins are high because the revenue stack is almost all margin; the volatility is in the merchant capture, not the cost base.',
    s4b:'The capital is the batteries, the inverters and transformer, the grid connection and the site — roughly <b>£0.5–1.0m/MW for a 1–2 hour</b> battery, more for longer duration. There is little or no grant; the forward capital is augmentation and the option to expand the site. Each added MW earns another share of the revenue stack.',
    stackH:'The capital · batteries + connection', splitL:'Financing', splitR:'merchant',
    split:[['s1',45,'Project / merchant debt'],['s2',55,'Equity (higher, for risk)']],
    finList:[['','Revenue','arbitrage + FR + capacity'],['sub','Unit','annual margin per MW'],['','Risk','merchant capture (volatile)'],['sub','Floor','capacity + FR contracts'],['','Duration','~2h (£0.5–1.0m/MW)'],['rest','Owner','Zenobē / Gresham House']],
    finNote:'A GB merchant battery is a <b>high-return, merchant-volatile revenue-stack asset</b>: a per-MW margin from arbitrage, services and capacity, against a light cost base. The capacity and frequency contracts give a partial floor; the risk and the upside are the merchant capture and market saturation.',
    timeline:[['2016','<b>Enhanced Frequency Response</b> tenders kick-start GB batteries.'],['2018','<b>Capacity market</b> opens to storage.'],['2020','<b>Dynamic frequency services</b> (DC/DM/DR) launch.'],['2021','<b>Zenobē &amp; Gresham House</b> scale large GB fleets.'],['2023','<b>Longer-duration</b> (2h+) batteries become the norm.'],['Ongoing','<b>Market saturation</b> erodes early frequency-service prices.']],
    calcNote:'A working model of a <b>merchant battery</b>. Revenue is power (MW) × revenue per MW × merchant capture; a contracted floor models any capacity / frequency contract. Cost is O&amp;M and an augmentation reserve. Drop the capture to see the merchant-revenue risk — the return collapses at low capture.',
    s6:'A GB battery is the merchant revenue stack, with a partial floor. What drives it:',
    breakers:['<b>The revenue stack</b> — arbitrage + frequency / services + capacity; three lines that move together.','<b>Merchant capture</b> — the volatile share of the stack actually earned; the principal risk.','<b>Market saturation</b> — more batteries erode arbitrage and service prices over time.','<b>Duration &amp; augmentation</b> — longer duration captures more arbitrage; cells must be topped up.'],
    src:'Figures from public sources on the GB battery market and developers such as <a href="https://www.zenobe.com/" target="_blank" rel="noopener">Zenobē</a> and <a href="https://greshamhouse.com/" target="_blank" rel="noopener">Gresham House Energy Storage</a>. Merchant revenues are volatile; figures are approximate and illustrative.',
    econ:{cur:'£', duration:2, omPerMW:18, fixedOM:2,
      mwDef:200,mwMin:50,mwMax:600,mwStep:10, revDef:120,revMin:50,revMax:240,revStep:5, capDef:75,capMin:15,capMax:100,capStep:1},
    calc:{build:95,grant:0,capex:6,revG:1,floor:8,cap:60,tax:25,exit:9,lev:3,rd:6,amort:4,hold:12},
    map:{footer:GEO.gbbess.footer}
  },

  /* ---------- 2 · ERCOT / CAISO BATTERY (North America · high-volatility merchant) ---------- */
  ercot:{
    name:'ERCOT / CAISO battery', geo:'Texas / California, USA', continent:'North America', cur:'US$', geoKey:'ercot',
    lede:'The highest-octane merchant battery — a <b>BESS in ERCOT or CAISO</b>, where extreme price volatility and deep ancillary-service markets make arbitrage hugely valuable in good years, and thin in saturated ones.',
    s1:'<p class="body">In <b>ERCOT</b> (Texas) and <b>CAISO</b> (California), wholesale power prices are exceptionally volatile — scarcity events can send prices to thousands of dollars, and a battery that discharges into them captures enormous arbitrage. Both markets also have deep <b>ancillary-service</b> markets (regulation, reserves, fast frequency response) that a battery can stack on top. It is the most merchant of merchant battery markets.</p>'+
       '<p class="body">The model is a <b>per-MW</b> revenue stack: arbitrage plus ancillary services, captured against O&amp;M and an augmentation reserve. The revenue is <b>highly volatile</b> — a record year can be followed by a saturated one as more batteries enter and compress spreads. Returns are high but the dispersion is wide; this is the textbook case of merchant battery risk, with little contracted floor.</p>',
    facts:[['Per MW','Revenue','arbitrage + AS'],['Extreme','Volatility','scarcity pricing'],['Merchant','Risk','little floor'],['~2h','Duration','~US$0.6–1.1m/MW'],['Saturating','Trend','spreads compress'],['Funds','Owner','merchant developers']],
    s2:'Watch the cycle. Power flows <b>in</b> (cyan) as the battery charges off cheap or surplus power, then <b>out</b> (amber/green) into the price spikes — the arbitrage. In ERCOT/CAISO the spikes are huge, so the <b style="color:#0c6b4f">capture</b> can be very high in a good year. Drag the revenue per MW to a record year, then drop the capture to a saturated one — the dispersion is the whole story.',
    driverLab:'Revenue / MW', availLab:'Merchant capture', hrK:'Service revenue', yrS:'stack captured per MW',
    ledge:{a:'+ arbitrage',b:'+ ancillary',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> set the revenue per MW high and the capture high — a record ERCOT year, where a battery earns a fortune on scarcity arbitrage. Then drop both: a saturated year where the spreads have compressed. The swing between those two is far wider than any other asset on this site — that is the merchant battery risk in its purest form.',
    s3:'An ERCOT or CAISO battery earns <b>arbitrage</b> on extreme price volatility plus <b>ancillary services</b> — all merchant, with little contracted floor. Per MW, the captured stack is the revenue; O&amp;M and augmentation are the cost. The upside is real (record arbitrage years), but so is the downside: as more batteries enter, spreads and service prices compress. It is the highest-return and highest-variance battery market.',
    mb:{tag:'Model A · the revenue stack', title:'High-volatility merchant battery (ERCOT/CAISO)', body:'A grid-scale battery in the most volatile US markets, stacking scarcity-driven arbitrage and deep ancillary services into a per-MW margin — very high-return in good years, thin in saturated ones, with almost no contracted floor. <b>This is an ERCOT / CAISO battery</b>.'},
    s4a:'The cost base is light — <b>O&amp;M</b> and an <b>augmentation</b> reserve — so margins are high and almost all of the captured stack drops to EBITDA. The entire risk sits on the revenue side: the merchant capture, set by price volatility and how saturated the market has become.',
    wfNote:'Operating cost is O&amp;M and an augmentation reserve, plus a small overhead. Margins are high; the volatility is all in the merchant capture, which in ERCOT/CAISO can swing dramatically year to year.',
    s4b:'The capital is the batteries, power electronics, transformer and interconnection — roughly <b>US$0.6–1.1m/MW</b> for a 1–2 hour battery. There is no grant and no floor; the return depends wholly on the merchant capture. Expansion is the option to add MW where the interconnection allows.',
    stackH:'The capital · batteries + interconnection', splitL:'Financing', splitR:'merchant',
    split:[['s1',40,'Merchant project debt'],['s2',60,'Equity (high, for variance)']],
    finList:[['','Revenue','arbitrage + ancillary services'],['sub','Unit','annual margin per MW'],['','Markets','ERCOT (TX) · CAISO (CA)'],['sub','Risk','merchant, little floor'],['','Volatility','extreme scarcity pricing'],['rest','Owner','merchant developers / funds']],
    finNote:'An ERCOT/CAISO battery is the <b>purest merchant battery</b>: a per-MW stack of volatile arbitrage and ancillary revenue, almost no floor, a light cost base and a wide dispersion of outcomes. The highest-return and highest-variance case on this site.',
    timeline:[['2018','<b>Early batteries</b> enter CAISO ancillary markets.'],['2021','<b>Winter Storm Uri</b> shows the value of ERCOT scarcity.'],['2022','<b>Record arbitrage</b> years for well-sited batteries.'],['2023','<b>Rapid build-out</b> begins compressing spreads.'],['2024','<b>Ancillary saturation</b> in CAISO pushes batteries to arbitrage.'],['Ongoing','<b>Wide dispersion</b> of outcomes year to year.']],
    calcNote:'A working model of a <b>high-volatility merchant battery</b>. Revenue is MW × revenue per MW × capture; there is little or no floor. Cost is O&amp;M and augmentation. The base case is a healthy year — drop the capture to model a saturated one and watch the return fall away.',
    s6:'An ERCOT/CAISO battery is high-octane merchant arbitrage. What drives it:',
    breakers:['<b>Price volatility</b> — scarcity events drive the arbitrage that makes the money.','<b>Merchant capture</b> — the share of the volatile stack actually earned; wide dispersion.','<b>Ancillary depth</b> — deep regulation / reserve markets stack on top of arbitrage.','<b>Saturation</b> — a rapid build-out compresses both arbitrage spreads and service prices.'],
    src:'Figures are illustrative for an ERCOT / CAISO grid-scale battery, drawing on public ISO market data. Merchant battery revenues are highly volatile; all figures here are approximate and illustrative.',
    econ:{cur:'US$', duration:2, omPerMW:20, fixedOM:2,
      mwDef:200,mwMin:50,mwMax:600,mwStep:10, revDef:140,revMin:40,revMax:280,revStep:5, capDef:78,capMin:10,capMax:100,capStep:1},
    calc:{build:108,grant:0,capex:6,revG:0,floor:5,cap:80,tax:25,exit:8,lev:2.5,rd:7,amort:5,hold:10},
    map:{footer:GEO.ercot.footer}
  },

  /* ---------- 3 · CHILEAN SOLAR-PAIRED BATTERY (South America · PPA / tolled) ---------- */
  chile:{
    name:'Chilean solar-paired battery', geo:'Atacama, Chile', continent:'South America', cur:'US$', geoKey:'chile',
    lede:'A battery built to <b>shift the sun</b> — a solar-paired BESS in Chile\'s Atacama that stores midday solar and discharges into the evening peak, under a <b>PPA or tolling</b> contract, priced at an emerging-market rate.',
    s1:'<p class="body">Chile\'s Atacama has the world\'s best solar resource, but the power arrives at midday when prices can collapse to zero (or be curtailed). A <b>solar-paired battery</b> solves the timing: it stores cheap midday solar and discharges it into the evening peak, time-shifting the energy to when it is worth most. Longer <b>duration</b> (often 4 hours) lets it move more energy across the day.</p>'+
       '<p class="body">The economics are largely <b>contracted</b>: a power-purchase agreement or a <b>tolling</b> arrangement pays a stable revenue per MW for the shifting service, which gives the battery a meaningful <b>floor</b> rather than full merchant exposure. That makes the cash flow more bond-like — but the whole return is carried at an <b>emerging-market</b> discount rate, so a solid contracted return nets down once discounted like a Chilean asset.</p>',
    facts:[['Solar-shift','Service','store midday → peak'],['PPA / tolled','Revenue','contracted floor'],['4h','Duration','more energy shifted'],['Per MW','Unit','annual margin'],['EM rate','Discount','Chilean cost of capital'],['Atacama','Site','best solar resource']],
    s2:'Watch the cycle. Power flows <b>in</b> (cyan) as the battery charges on midday solar, then <b>out</b> (amber/green) into the evening peak — the time-shift. Because it is <b>tolled / PPA</b>, the revenue holds even when capture moves (watch the floor hold the ledger up). The <b style="color:#0c6b4f">capture</b> sets the cycling. Drag the power, the revenue per MW and the capture — a contracted battery at an EM rate.',
    driverLab:'Revenue / MW', availLab:'Merchant capture', hrK:'Service revenue', yrS:'contracted per MW',
    ledge:{a:'+ shift / PPA',b:'+ services',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>merchant capture</b> — and watch the revenue barely move, because the <b>PPA / tolling floor</b> holds it up. That contracted floor is what makes a solar-paired battery bankable in an emerging market. Then raise the cost of debt and watch a solid contracted return net down once discounted at a Chilean rate — the EM discount is the real lever here.',
    s3:'A Chilean solar-paired battery is paid, largely under <b>contract</b>, to time-shift solar from midday to the evening peak. A PPA or tolling arrangement gives a stable revenue per MW — a meaningful floor — so the cash flow is more bond-like than a merchant battery. The 4-hour duration moves more energy across the day. The investor question is less the asset than the <b>discount rate</b>: Chilean rates and currency carry the value.',
    mb:{tag:'Model A · the revenue stack', title:'Solar-paired, PPA / tolled battery (EM)', body:'A battery that stores midday solar and discharges into the evening peak under a PPA or tolling contract — a contracted, floored per-MW revenue, more bond-like than merchant, but priced at an emerging-market discount rate. <b>This is a Chilean solar-paired battery</b>.'},
    s4a:'The cost base is light — <b>O&amp;M</b> and an <b>augmentation</b> reserve — so margins are high. Because the revenue is contracted (PPA / tolling), the margin is stable through the year; the operational lever is round-trip efficiency and how much energy the 4-hour duration can shift.',
    wfNote:'Operating cost is O&amp;M and an augmentation reserve. The margin is high and, crucially, the PPA / tolling floor holds the revenue even when merchant capture falls — but the whole return is discounted at an emerging-market rate.',
    s4b:'The capital is the battery and inverters (a longer 4-hour system), the connection to the paired solar farm and the grid — modelled on an enterprise-value basis. The return is a <b>contracted</b> one, carried against Chilean rates and currency, with expansion as more solar-plus-storage is added across the Atacama.',
    stackH:'The capital · battery + solar link', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local / project debt'],['s2',45,'Developer equity']],
    finList:[['','Service','time-shift solar to peak'],['sub','Revenue','PPA / tolling (contracted)'],['','Duration','4h'],['sub','Floor','meaningful — contracted'],['','Discount','emerging-market rate'],['rest','Site','Atacama (best solar)']],
    finNote:'A Chilean solar-paired battery is a <b>contracted, floored battery at an EM discount rate</b>: a stable per-MW revenue for shifting solar, a high margin and a meaningful floor — but the whole investment debate is the discount rate and the currency.',
    timeline:[['2010s','<b>Atacama solar</b> grows to world-leading scale.'],['2020','<b>Midday curtailment</b> makes the case for storage.'],['2021','<b>Storage mandates &amp; tenders</b> support solar-plus-storage.'],['2023','<b>4-hour batteries</b> paired with large solar farms.'],['2020s','<b>PPA / tolling</b> contracts underpin the cash flow.'],['Ongoing','<b>Build-out</b> across the Atacama and central grid.']],
    calcNote:'A working model of a <b>solar-paired, contracted battery</b>, on an enterprise-value basis. Revenue is MW × revenue per MW × capture, but the contracted floor holds it up even at low capture. The cost of debt is high to reflect EM rates, netting a solid contracted return down once discounted.',
    s6:'A Chilean solar-paired battery is a contracted shift at an EM rate. What drives it:',
    breakers:['<b>The shift</b> — storing midday solar and discharging into the evening peak is the service.','<b>Contracted floor</b> — a PPA or tolling deal makes the cash flow bond-like.','<b>Duration</b> — 4 hours lets the battery move more energy across the day.','<b>Country &amp; currency</b> — the Chilean discount rate carries the whole valuation.'],
    src:'Figures are illustrative for a Chilean solar-paired battery in the Atacama, drawing on public Chilean energy data. As a project-level asset at an EM rate, all figures here are approximate and illustrative.',
    econ:{cur:'US$', duration:4, omPerMW:16, fixedOM:1.5,
      mwDef:150,mwMin:40,mwMax:500,mwStep:10, revDef:120,revMin:50,revMax:220,revStep:5, capDef:80,capMin:15,capMax:100,capStep:1},
    calc:{build:120,grant:10,capex:6,revG:2,floor:11,cap:30,tax:27,exit:9,lev:5,rd:8.5,amort:3,hold:14},
    map:{footer:GEO.chile.footer}
  },

  /* ---------- 4 · VICTORIAN BIG BATTERY / HORNSDALE (Oceania · system services) ---------- */
  australia:{
    name:'Victorian Big Battery / Hornsdale', geo:'Victoria / South Australia', continent:'Oceania', cur:'A$', geoKey:'australia',
    lede:'The batteries that proved the model — Australia\'s <b>Hornsdale Power Reserve</b> and the <b>Victorian Big Battery</b>, earning system-services and grid-stability contracts alongside merchant arbitrage in the volatile NEM.',
    s1:'<p class="body">Australia\'s Hornsdale Power Reserve (the original "Tesla big battery") and the Victorian Big Battery showed that grid-scale storage could earn real money providing <b>system services</b> — fast frequency response, inertia and grid stability — that the ageing, renewables-heavy National Electricity Market (NEM) badly needs. Some of this is paid through <b>grid-stability contracts</b> (e.g. system integrity protection schemes) that give a partial floor; the rest is merchant.</p>'+
       '<p class="body">The model is a <b>per-MW</b> revenue stack weighted toward <b>system services</b>: a contracted services payment plus merchant arbitrage and frequency markets (FCAS) in a volatile market, against O&amp;M and an augmentation reserve. The grid-services contracts make the cash flow steadier than a pure merchant battery, while the NEM\'s volatility provides the merchant upside.</p>',
    facts:[['System services','Core','FFR · inertia · stability'],['Grid contract','Floor','partial, contracted'],['Per MW','Revenue','annual margin'],['~2h','Duration','services-led'],['NEM','Market','volatile + FCAS'],['Hornsdale / VBB','Asset','landmark batteries']],
    s2:'Watch the cycle. Power flows <b>in</b> (cyan) and <b>out</b> (amber/green) as the battery charges and discharges — but much of its value is in fast <b>system services</b> that hold the grid stable. A <b>grid-services contract</b> floors part of the revenue (watch the floor hold the ledger). The <b style="color:#0c6b4f">capture</b> sets the merchant cycling. Drag the power, the revenue per MW and the capture.',
    driverLab:'Revenue / MW', availLab:'Merchant capture', hrK:'Service revenue', yrS:'services + merchant per MW',
    ledge:{a:'+ services',b:'+ merchant/FCAS',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>merchant capture</b> — the revenue softens but the <b>grid-services contract</b> (the floor) holds a base of it up, because the system needs the stability service regardless. Push the revenue per MW to see a volatile NEM year where FCAS and arbitrage spike. The mix of contracted services and merchant upside is the signature.',
    s3:'An Australian grid-stability battery earns a <b>stack</b> weighted to <b>system services</b>: a contracted services payment (a partial floor) plus merchant arbitrage and frequency-control (FCAS) revenue in the volatile NEM. Per MW, the captured stack is the revenue; O&amp;M and augmentation are the cost. The grid-services contract makes it steadier than a pure merchant battery, while the NEM provides upside — the model Hornsdale and the VBB proved.',
    mb:{tag:'Model A · the revenue stack', title:'System-services battery (Hornsdale / VBB)', body:'A landmark grid-scale battery earning a per-MW stack weighted to contracted system services — fast frequency response, inertia, grid stability — plus merchant arbitrage and FCAS in the volatile NEM. A partial contracted floor with merchant upside. <b>This is Hornsdale / the Victorian Big Battery</b>.'},
    s4a:'The cost base is light — <b>O&amp;M</b> and an <b>augmentation</b> reserve — so margins are high. A good share of revenue is a <b>contracted services</b> payment, which steadies the margin; the merchant FCAS and arbitrage capture is the swing factor on top.',
    wfNote:'Operating cost is O&amp;M and an augmentation reserve. Margins are high; the contracted system-services payment floors part of the revenue, while merchant FCAS and arbitrage capture provides the volatile upside.',
    s4b:'The capital is the batteries, inverters and grid connection — financed against a partial contracted floor, which lowers the cost of equity versus a pure merchant battery. The growth is more system-services storage as the NEM retires coal and adds renewables that need fast stabilising.',
    stackH:'The capital · batteries + connection', splitL:'Financing', splitR:'part-contracted',
    split:[['s1',50,'Project debt'],['s2',50,'Equity (services floor lowers risk)']],
    finList:[['','Core','system services (FFR · inertia)'],['sub','Floor','grid-services contract (partial)'],['','Merchant','arbitrage + FCAS (NEM)'],['sub','Unit','annual margin per MW'],['','Duration','~2h'],['rest','Asset','Hornsdale / Victorian Big Battery']],
    finNote:'An Australian grid-stability battery is a <b>part-contracted, part-merchant revenue-stack asset</b>: a contracted system-services floor plus merchant FCAS and arbitrage upside, on a light cost base. Steadier than a pure merchant battery, with real NEM upside.',
    timeline:[['2017','<b>Hornsdale Power Reserve</b> — the original big battery — switches on.'],['2019','<b>Hornsdale expansion</b> adds capacity and inertia services.'],['2021','<b>Victorian Big Battery</b> commissioned.'],['2020s','<b>System-services contracts</b> (SIPS / stability) underpin revenue.'],['2020s','<b>Coal retirements</b> raise the value of fast stabilising.'],['Ongoing','<b>More grid-scale storage</b> across the NEM.']],
    calcNote:'A working model of a <b>system-services battery</b>. Revenue is MW × revenue per MW × capture, with a contracted floor for the grid-services payment. Cost is O&amp;M and augmentation. The floor steadies the return; merchant FCAS and arbitrage provide the volatile upside.',
    s6:'An Australian grid-stability battery is contracted services plus merchant upside. What drives it:',
    breakers:['<b>System services</b> — fast frequency response, inertia and stability the NEM needs.','<b>Grid-services contract</b> — a partial contracted floor that steadies the cash flow.','<b>NEM volatility</b> — merchant FCAS and arbitrage provide the upside capture.','<b>Coal retirements</b> — raise the value of fast stabilising as renewables grow.'],
    src:'Figures from public sources on the <a href="https://hornsdalepowerreserve.com.au/" target="_blank" rel="noopener">Hornsdale Power Reserve</a> and the Victorian Big Battery, and AEMO NEM data. Figures are approximate and illustrative.',
    econ:{cur:'A$', duration:2, omPerMW:19, fixedOM:2,
      mwDef:250,mwMin:50,mwMax:600,mwStep:10, revDef:130,revMin:50,revMax:240,revStep:5, capDef:78,capMin:15,capMax:100,capStep:1},
    calc:{build:175,grant:15,capex:6,revG:1,floor:16,cap:80,tax:30,exit:9,lev:4,rd:6.5,amort:4,hold:13},
    map:{footer:GEO.australia.footer}
  },

  /* ---------- 5 · SAUDI / UAE BATTERY (Middle East · utility-tolled) ---------- */
  gulf:{
    name:'Saudi / UAE utility battery', geo:'Saudi Arabia / UAE', continent:'Middle East', cur:'SAR', geoKey:'gulf',
    lede:'The bond-like battery — a <b>utility-tolled BESS</b> in Saudi Arabia or the UAE, signed under a long contract to a national utility at a very low cost of capital, with little merchant exposure.',
    s1:'<p class="body">Gulf utilities are deploying very large batteries to firm their fast-growing solar and to shift cheap daytime solar into the evening — but the procurement model is the opposite of a merchant battery. The battery is <b>tolled</b>: it signs a long contract with the national utility (Saudi\'s SEC / a developer like ACWA Power, or the UAE\'s EWEC/DEWA) that pays a fixed <b>availability / capacity</b> charge per MW, regardless of how it is dispatched.</p>'+
       '<p class="body">That makes the revenue almost entirely a <b>contracted floor</b>: stable, indexed and bond-like, with little merchant capture. Combined with a very <b>low cost of capital</b> (state-backed, investment-grade offtake), the return is lower but very secure — a contracted infrastructure annuity rather than a merchant bet. Figures here are illustrative of a Gulf utility-scale tolling structure.</p>',
    facts:[['Utility-tolled','Revenue','availability charge'],['Contracted','Floor','dominates revenue'],['Low','Cost of capital','state-backed'],['4h','Duration','firms solar'],['Per MW','Unit','fixed per MW'],['Illustrative','Note','structure shown']],
    s2:'Watch the cycle. Power flows <b>in</b> (cyan) on cheap daytime solar and <b>out</b> (amber/green) into the evening — but the revenue is a <b>fixed tolling charge</b>, so it barely moves with capture (watch the floor hold the ledger right up). The <b style="color:#0c6b4f">capture</b> sets the cycling, not the cash. Drag the power, the revenue per MW and the capture — a tolled, bond-like battery.',
    driverLab:'Revenue / MW', availLab:'Merchant capture', hrK:'Service revenue', yrS:'tolling charge per MW',
    ledge:{a:'+ availability',b:'+ (small merchant)',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>merchant capture</b> right down — and watch the revenue hardly move, because the <b>tolling floor</b> (a fixed availability charge) holds it up almost entirely. That contracted, volume-insensitive cash flow plus a very low cost of capital is what makes a Gulf tolled battery a low-risk, lower-return infrastructure annuity.',
    s3:'A Gulf utility-tolled battery is paid a <b>fixed availability / capacity charge</b> per MW under a long contract to a national utility, regardless of dispatch — so the revenue is almost entirely a contracted floor, with little merchant exposure. The margin is high and the cash flow bond-like; combined with a very low, state-backed cost of capital, the return is lower but very secure. The lever is the contract and the cost of capital, not the market.',
    mb:{tag:'Model A · the revenue stack', title:'Utility-tolled battery (Gulf)', body:'A grid-scale battery signed under a long tolling contract to a national utility, paid a fixed availability charge per MW regardless of dispatch — almost entirely contracted, bond-like, at a very low state-backed cost of capital. Lower-return but very secure. <b>This is a Saudi / UAE utility battery</b> (illustrative).'},
    s4a:'The cost base is light — <b>O&amp;M</b> and an <b>augmentation</b> reserve — so margins are very high. Because the revenue is a fixed tolling charge, the margin is essentially fixed; there is no merchant volatility to manage, only availability and the augmentation of the cells.',
    wfNote:'Operating cost is O&amp;M and an augmentation reserve. Margins are very high; the tolling charge means revenue, and so cash flow, is fixed and bond-like regardless of how the battery is dispatched.',
    s4b:'The capital is the battery (a longer 4-hour system to firm solar), inverters and connection — financed at a very <b>low cost of capital</b> against an investment-grade utility offtake. The return is a secure, contracted annuity; growth is the Gulf\'s huge pipeline of solar-plus-storage tenders.',
    stackH:'The capital · battery + connection', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',70,'Low-cost project debt'],['s2',30,'Equity (secure, contracted)']],
    finList:[['','Revenue','utility tolling (availability)'],['sub','Floor','dominates — bond-like'],['','Cost of capital','very low (state-backed)'],['sub','Duration','4h (firms solar)'],['','Merchant','minimal'],['rest','Note','illustrative structure']],
    finNote:'A Gulf utility-tolled battery is a <b>contracted, bond-like infrastructure annuity</b>: a fixed availability charge per MW, a very high margin and a very low cost of capital. The lowest-risk and lowest-return battery here — the opposite of a merchant battery.',
    timeline:[['2019','<b>Gulf solar</b> reaches record-low tariffs.'],['2021','<b>Storage tenders</b> begin to firm solar.'],['2023','<b>Large utility-tolled batteries</b> procured (SEC / EWEC / DEWA).'],['2024','<b>4-hour systems</b> shift solar into the evening.'],['2020s','<b>Low cost of capital</b> reflects state-backed offtake.'],['Ongoing','<b>Huge pipeline</b> of solar-plus-storage.']],
    calcNote:'A working model of a <b>utility-tolled battery</b>, on an enterprise-value basis. Revenue is a fixed availability charge — the floor dominates, so the cash flow holds regardless of capture. Cost is O&amp;M and augmentation. A low cost of capital gives a secure, lower return.',
    s6:'A Gulf utility battery is a tolled, bond-like annuity. What drives it:',
    breakers:['<b>The tolling contract</b> — a fixed availability charge makes the cash flow bond-like.','<b>Cost of capital</b> — a very low, state-backed rate is the principal value driver.','<b>Availability</b> — keeping the battery available, not dispatch, earns the charge.','<b>Pipeline</b> — the Gulf\'s vast solar-plus-storage tender programme drives growth.'],
    src:'Figures are illustrative of a Gulf utility-tolled battery structure (e.g. SEC / ACWA Power in Saudi Arabia, EWEC / DEWA in the UAE). As an illustrative tolling structure, all figures here are approximate.',
    econ:{cur:'SAR', duration:4, omPerMW:15, fixedOM:1.5,
      mwDef:300,mwMin:50,mwMax:800,mwStep:10, revDef:115,revMin:50,revMax:200,revStep:5, capDef:75,capMin:15,capMax:100,capStep:1},
    calc:{build:250,grant:20,capex:5,revG:1,floor:22,cap:40,tax:0,exit:10,lev:6,rd:5,amort:3,hold:15},
    map:{footer:GEO.gulf.footer}
  },

  /* ---------- 6 · CHINESE GRID-SCALE BATTERY (China · mandated / capacity-led) ---------- */
  china:{
    name:'Chinese grid-scale battery', geo:'China (national)', continent:'China', cur:'¥', geoKey:'china',
    lede:'Battery storage at <b>continental scale</b> — China is building grid-scale storage faster than anywhere on earth, much of it <b>mandated</b> alongside renewables and paid through capacity-led mechanisms rather than pure merchant arbitrage.',
    s1:'<p class="body">China builds more grid-scale storage than the rest of the world combined. A large share is <b>mandated</b>: renewable projects are required to pair a percentage of storage, and provinces set capacity targets. The revenue model is therefore <b>capacity-led</b> — capacity payments, shared-storage leasing and emerging spot-market arbitrage — rather than the pure merchant stack of a GB or ERCOT battery, though China\'s power markets are reforming toward more market-based dispatch.</p>'+
       '<p class="body">The economics are a <b>per-MW</b> revenue, weighted to a <b>contracted / capacity</b> floor: a modest but stable revenue per MW applied at colossal scale, against a low manufacturing cost base (China makes most of the world\'s cells) and a low cost of capital. The story is <b>scale and mandate</b>, not price — a vast, contracted-ish build-out, with merchant arbitrage a growing but secondary line.</p>',
    facts:[['Mandated','Driver','storage with renewables'],['Capacity-led','Revenue','+ shared storage'],['Vast','Scale','world-leading build'],['~2h','Duration','capacity-sized'],['Low cost','Cells','China makes them'],['Per MW','Unit','modest, stable']],
    s2:'Watch the cycle. Power flows <b>in</b> (cyan) and <b>out</b> (amber/green) as the battery charges and discharges — but much of the revenue is a <b>capacity / contracted</b> payment, so it holds even as capture moves (watch the floor hold the ledger). At vast scale, a modest per-MW revenue is an enormous absolute cash flow. The <b style="color:#0c6b4f">capture</b> sets the cycling. Drag the power, the revenue per MW and the capture.',
    driverLab:'Revenue / MW', availLab:'Merchant capture', hrK:'Service revenue', yrS:'capacity + arbitrage per MW',
    ledge:{a:'+ capacity',b:'+ arbitrage',c:'− O&M'}, demandLabel:'REVENUE CAPTURE',
    preset:'Reset to base case',
    try:'<b>Try this:</b> push the <b>power</b> up — at China\'s scale, even a modest per-MW revenue is a vast absolute cash flow. Drop the capture and watch the <b>capacity / contracted floor</b> hold the revenue up; the merchant arbitrage line is growing as the power markets reform, but the model today is scale and mandate, not price.',
    s3:'A Chinese grid-scale battery earns a <b>capacity-led</b> per-MW revenue: capacity payments, shared-storage leasing and a growing slice of spot arbitrage, mostly contracted-ish rather than fully merchant. Applied at colossal scale against a low cell-manufacturing cost base and a low cost of capital, a modest revenue per MW is a vast, stable cash flow. The lever is <b>scale and mandate</b>, with merchant arbitrage a secondary, growing line as markets reform.',
    mb:{tag:'Model A · the revenue stack', title:'Mandated, capacity-led battery (China)', body:'A grid-scale battery built at vast scale, much of it mandated alongside renewables, earning a capacity-led per-MW revenue (capacity payments + shared storage + emerging arbitrage) at a low cost base and low cost of capital. Scale and mandate, not merchant price. <b>This is a Chinese grid-scale battery</b>.'},
    s4a:'The cost base is very light — <b>O&amp;M</b> and an <b>augmentation</b> reserve, both low because China manufactures the cells — so margins are high. The revenue is mostly capacity-led and contracted, so the margin is stable; the swing line is the emerging merchant arbitrage as power markets reform.',
    wfNote:'Operating cost is O&amp;M and an augmentation reserve, low given domestic cell manufacturing. Margins are high; the capacity / contracted revenue floors the cash flow, with merchant arbitrage a growing secondary line.',
    s4b:'The capital is the batteries (cheap, domestically made), inverters and connection — financed at a low, state-linked cost of capital. The build-out is enormous and policy-driven; each mandated MW adds another slice of capacity-led, contracted-ish revenue to a vast, growing fleet.',
    stackH:'The capital · batteries + connection', splitL:'Financing', splitR:'state-linked',
    split:[['s1',60,'State-linked debt'],['s2',40,'Equity (low cost of capital)']],
    finList:[['','Driver','mandated with renewables'],['sub','Revenue','capacity + shared storage + arbitrage'],['','Floor','capacity-led (contracted-ish)'],['sub','Cost base','low (domestic cells)'],['','Cost of capital','low (state-linked)'],['rest','Story','scale &amp; mandate']],
    finNote:'A Chinese grid-scale battery is a <b>mandated, capacity-led, vast-scale asset</b>: a modest but stable per-MW revenue at colossal scale, a low cost base and a low cost of capital. The return is steady and large in absolute terms; merchant arbitrage is a growing secondary line as markets reform.',
    timeline:[['2021','<b>Storage mandates</b> attached to renewable projects.'],['2022','<b>Provincial capacity targets</b> drive build-out.'],['2023','<b>Shared / independent storage</b> leasing models emerge.'],['2024','<b>Spot-market reforms</b> begin to add arbitrage value.'],['2020s','<b>World-leading scale</b> of grid-scale storage.'],['Ongoing','<b>Market reform</b> grows the merchant arbitrage line.']],
    calcNote:'A working model of a <b>mandated, capacity-led battery</b>, on an enterprise-value basis. Revenue is MW × revenue per MW × capture, with a capacity floor that holds it at low capture. A low cost base and low cost of capital give a steady, large-scale return. Figures are highly illustrative.',
    s6:'A Chinese battery is mandated, capacity-led storage at vast scale. What drives it:',
    breakers:['<b>Mandates</b> — storage required alongside renewables drives the build-out.','<b>Capacity-led revenue</b> — capacity payments and shared storage are the contracted floor.','<b>Scale &amp; low cost</b> — domestic cells and vast volume make modest per-MW revenue large.','<b>Market reform</b> — spot-market arbitrage is a growing secondary revenue line.'],
    src:'Figures are illustrative for a Chinese grid-scale battery, drawing on public Chinese storage data. Given the scale and reforming market structure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', duration:2, omPerMW:14, fixedOM:1.5,
      mwDef:400,mwMin:50,mwMax:1000,mwStep:25, revDef:110,revMin:40,revMax:200,revStep:5, capDef:72,capMin:15,capMax:100,capStep:1},
    calc:{build:280,grant:30,capex:5,revG:1,floor:26,cap:60,tax:25,exit:8,lev:5,rd:4,amort:4,hold:12},
    map:{footer:GEO.china.footer}
  }
  };
  var ORDER=['gbbess','ercot','chile','australia','gulf','china'];

  /* ===================================================================
     BATTERY STORAGE RENDERER  (canvas, 720x520) — top-down / elevation, daytime
     A fenced compound of battery container rows, a transformer / inverter skid,
     and a grid connection (pylon + line). Power pulses flow IN from the grid
     (charging, cyan) and OUT (discharging, amber/green) on a slow cycle;
     intensity scales with the merchant capture.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  /* site geometry: grid connection (right) → skid → battery compound (left) */
  var PYLON={x:660,y:250};          // grid connection point
  var SKID={x:516,y:250};           // transformer / inverter skid
  var COMPOUND={x:60,y:96,w:404,h:330};  // fenced battery compound
  var UNITS=[], ROWY=[], NUNIT=0;
  var COL_IN='rgba(70,190,225,', COL_OUT='rgba(120,200,110,';   // charge (cyan) / discharge (green)

  function layout(){
    // rows of battery container units scale with the MW (slider range)
    var E=A.econ;
    ROWY=[140,196,252,308,364];
    UNITS=[]; var idx=0;
    var cols=7, x0=COMPOUND.x+30, gap=54;
    for(var r=0;r<ROWY.length;r++) for(var c=0;c<cols;c++){
      var x=x0+c*gap, y=ROWY[r];
      UNITS.push({x:x,y:y,row:r,col:c,ph:(idx*0.6)%6.28}); idx++;
    }
    NUNIT=UNITS.length;
  }

  /* ---- base map: ground + compound ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // compound pad
    ctx.fillStyle='rgba(150,160,150,0.18)'; rr(COMPOUND.x,COMPOUND.y,COMPOUND.w,COMPOUND.h,8); ctx.fill();
    // fence
    ctx.strokeStyle='rgba(120,130,120,0.55)'; ctx.lineWidth=1.4; ctx.setLineDash([3,4]);
    rr(COMPOUND.x,COMPOUND.y,COMPOUND.w,COMPOUND.h,8); ctx.stroke(); ctx.setLineDash([]);
    // access road from skid to compound gate
    ctx.strokeStyle='#c6cbc1'; ctx.lineWidth=9; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(COMPOUND.x+COMPOUND.w,250); ctx.lineTo(SKID.x-20,250); ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1; ctx.setLineDash([6,8]); ctx.lineDashOffset=-(T*0.5);
    ctx.beginPath(); ctx.moveTo(COMPOUND.x+COMPOUND.w,250); ctx.lineTo(SKID.x-20,250); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- transformer / inverter skid ---- */
  function skid(intensity){
    var x=SKID.x,y=SKID.y;
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x,y+30,30,5,0,0,Math.PI*2); ctx.fill();
    var g=ctx.createLinearGradient(x-26,y-28,x-26,y+28); g.addColorStop(0,'#b6bcb4'); g.addColorStop(1,'#9aa098');
    ctx.fillStyle=g; rr(x-26,y-28,52,56,4); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // cooling fins
    ctx.strokeStyle='rgba(120,130,120,0.45)'; ctx.lineWidth=1;
    for(var i=-20;i<=20;i+=6){ ctx.beginPath(); ctx.moveTo(x+i,y-22); ctx.lineTo(x+i,y+22); ctx.stroke(); }
    // bushings
    ctx.fillStyle='#8a908a'; rr(x-14,y-38,5,12,1); ctx.fill(); rr(x-2,y-38,5,12,1); ctx.fill(); rr(x+10,y-38,5,12,1); ctx.fill();
    glow(x,y,16+10*intensity,'rgba(255,210,120,0.5)',0.3+0.5*intensity);
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('INVERTER / TX',x,y+42);
  }

  /* ---- grid connection: pylon + overhead line ---- */
  function pylon(){
    var x=PYLON.x,y=PYLON.y;
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x,y+44,18,4,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(110,120,115,0.85)'; ctx.lineWidth=2.4;
    // tower
    ctx.beginPath(); ctx.moveTo(x-12,y+44); ctx.lineTo(x-4,y-44); ctx.moveTo(x+12,y+44); ctx.lineTo(x+4,y-44); ctx.stroke();
    ctx.lineWidth=1.4;
    for(var i=-30;i<40;i+=14){ ctx.beginPath(); ctx.moveTo(x-9+ (i+44)*0.09,y+i); ctx.lineTo(x+9-(i+44)*0.09,y+i); ctx.stroke(); }
    // cross-arms
    ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(x-22,y-30); ctx.lineTo(x+22,y-30); ctx.moveTo(x-26,y-12); ctx.lineTo(x+26,y-12); ctx.stroke();
    // line into the skid
    ctx.strokeStyle='rgba(90,100,95,0.6)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(x-22,y-30); ctx.quadraticCurveTo((x+SKID.x)/2,y-6,SKID.x,y-30); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('GRID',x,y+58);
  }

  /* ---- a battery container unit (with cooling vents + SoC bar on some) ---- */
  function unit(u,on,soc,active,showSoc){
    var x=u.x,y=u.y, w=44, h=30;
    ctx.fillStyle='rgba(30,40,30,0.12)'; rr(x-w/2,y+h/2-2,w,6,2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-h/2,x,y+h/2);
    if(on){ g.addColorStop(0,'#9fb2b8'); g.addColorStop(1,'#7f9298'); } else { g.addColorStop(0,'#b3b9b1'); g.addColorStop(1,'#969c94'); }
    ctx.fillStyle=g; rr(x-w/2,y-h/2,w,h,2.5); ctx.fill();
    ctx.strokeStyle='rgba(90,100,95,0.4)'; ctx.lineWidth=0.8; ctx.stroke();
    // cooling vents
    ctx.strokeStyle='rgba(80,92,88,0.45)'; ctx.lineWidth=0.7;
    for(var vx=x-w/2+6;vx<x+w/2-4;vx+=4){ ctx.beginPath(); ctx.moveTo(vx,y-h/2+4); ctx.lineTo(vx,y+h/2-7); ctx.stroke(); }
    // active glow (charging cyan / discharging green) on the units
    if(on && active>0.02){ var col=(_charging? COL_IN:COL_OUT)+(0.35+0.4*active)+')'; glow(x,y,w*0.55+6*active,col); }
    // state-of-charge bar on a couple of units (front-row left two)
    if(showSoc){
      var bx=x-w/2+4, by=y+h/2-5, bw=w-8;
      ctx.fillStyle='rgba(20,30,25,0.25)'; rr(bx,by,bw,3,1.5); ctx.fill();
      ctx.fillStyle=(_charging?COL_IN:COL_OUT)+'0.95)'; rr(bx,by,bw*Math.max(0.04,soc),3,1.5); ctx.fill();
    }
  }

  /* ---- flow pulses along the grid → skid → compound path ---- */
  function flowPulses(pts,speed,load,col,gcol,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.8,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.8,0,Math.PI*2); ctx.fill(); }
  }

  /* charge/discharge cycle state (set in frame) */
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ arbitrage',b:'+ services',c:'− O&M'};
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
  /* ---- live merchant-capture sparkline ---- */
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
    // slow charge/discharge cycle; capture sets the cycling intensity
    var cyc=Math.sin(T*0.013);           // +ve = discharge phase, -ve = charge phase
    _charging=(cyc<0);
    var soc=0.5+0.42*Math.cos(T*0.013);  // state of charge oscillates with the cycle
    var captureVis=Math.max(0.02,Math.min(1, cap*(0.94+0.12*Math.sin(T*0.02))));
    var active=captureVis*(0.45+0.55*Math.abs(cyc));   // how busy the cycling is

    // number of battery rows lit scales with MW
    var norm=(powerMW-(sCap.min?parseFloat(sCap.min):0))/Math.max(1,(parseFloat(sCap.max)-parseFloat(sCap.min)));
    var rowsLit=Math.max(2,Math.round(ROWY.length*(0.4+0.6*norm)));
    var unitLit=function(u){ return u.row < rowsLit; };

    ctx.clearRect(0,0,W,H);
    drawMap(); pylon(); skid(captureVis*Math.abs(cyc));

    // battery units
    var socShown=0;
    UNITS.forEach(function(u){
      var on=unitLit(u);
      var showSoc=(on && u.row===0 && u.col<2);   // SoC bar on a couple of front units
      unit(u,on, soc, on?active:0, showSoc);
    });

    // flow path: grid pylon → skid → compound. Charge = into compound, discharge = out to grid.
    var gridToSkid=[[PYLON.x-22,PYLON.y-30],[SKID.x,SKID.y-30]];
    var skidToComp=[[SKID.x-20,250],[COMPOUND.x+COMPOUND.w,250]];
    var loadVis=0.25+0.7*active;
    if(_charging){
      flowPulses(gridToSkid,0.8+loadVis,loadVis,COL_IN+'0.95)',COL_IN+'0.6)',true);   // grid → skid
      flowPulses(skidToComp,0.9+loadVis,loadVis,COL_IN+'0.95)',COL_IN+'0.6)',true);   // skid → compound
    } else {
      flowPulses(skidToComp,0.9+loadVis,loadVis,COL_OUT+'0.95)',COL_OUT+'0.6)',false); // compound → skid
      flowPulses(gridToSkid,0.8+loadVis,loadVis,COL_OUT+'0.95)',COL_OUT+'0.6)',false); // skid → grid
    }

    // ---- economics (per-MW revenue stack, merchant capture + contracted floor) ----
    var revenue=powerMW*revPerMW*1000*cap;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));      // floor = tolling / capacity-market contracted revenue
    var grossRev=powerMW*revPerMW*1000*cap;              // uncapped/unfloored, for the fixed-share heuristic
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var omCost=powerMW*(E.omPerMW||0)*1000, fixedOM=(E.fixedOM||0)*1e6, opex=omCost+fixedOM;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is contracted/capacity (floor) vs merchant
    var fixShare=Math.max(0.1,Math.min(0.7, revenue>grossRev?(revenue-grossRev)/revenue+0.18:(G.contracted?0.42:0.16)));
    var c_aug=opex*0.42, c_om=opex*0.40, c_admin=opex*0.18;

    if(G.growing){
      // + EXPANSION marker at the next (unlit) row
      if(rowsLit<ROWY.length){
        var ry=ROWY[rowsLit], pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ EXPANSION',COMPOUND.x+COMPOUND.w/2,ry); ctx.restore();
        glow(COMPOUND.x+COMPOUND.w/2,ry-2,9,'rgba(12,107,79,'+(0.25+0.3*pul)+')');
      }
    }

    if(_anim){
      var lit=UNITS.filter(unitLit);
      if(lit.length && Math.random()<0.4+0.5*captureVis){ var s1=lit[(Math.random()*lit.length)|0]; spawnCoin(s1.x,s1.y-6, Math.random()<fixShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.55, opex/Math.max(1,revenue)));
      if(lit.length && Math.random()<outRate){ var s2=lit[(Math.random()*lit.length)|0]; spawnCoin(s2.x,s2.y+4,'cost',1); }
      demHist.push(captureVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(captureVis);

    // phase label
    ctx.save(); ctx.fillStyle=(_charging?'rgba(40,120,150,0.85)':'rgba(60,120,55,0.85)'); ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText(_charging?'CHARGING ◀':'DISCHARGING ▶', COMPOUND.x+8, COMPOUND.y+COMPOUND.h+22); ctx.restore();

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+Math.round(powerMW)+' MW / '+dur+'h',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',Math.round(powerMW)+' MW'); set('ixSpreadV',CUR+Math.round(revPerMW)+'k/MW'); set('ixAvailV',Math.round(cap*100)+'%');
    set('ixDir',Math.round(powerMW)+' MW'); set('ixDirS',(G.contracted?'contracted / tolled':'merchant')+' · '+dur+'h');
    set('ixMW',mwh(powerMW*dur)+' · '+dur+'h'); set('ixMWs',Math.round(cap*100)+'% merchant capture');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Augmentation',c_aug],['O&amp;M',c_om],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the captured revenue is too thin to value — raise the revenue per MW or the merchant capture, or lower the cost base.</span>'; return; }
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is the per-MW stack (power × revenue per MW × merchant capture, with a contracted floor for any tolling / capacity payment) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'gbbess');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
