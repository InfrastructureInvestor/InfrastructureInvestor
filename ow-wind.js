/* Onshore wind, data-driven worked examples.
   Six real onshore-wind generation businesses, one template. Scene config from
   ow-geo.js (GEO), drawn as a top-down / landscape wind farm in 720x520 scene
   coords: rolling green terrain dotted with wind turbines (a mast and three
   rotating blades each), a substation and an export line carrying the power
   out. More capacity (MW) = more turbines; higher capacity factor = faster
   rotor spin and stronger output. The economics are renewable generation:
   capacity × hours × capacity factor × power price, against a small operating
   cost (O&M), with a contracted revenue floor (a CfD/PPA that removes price
   risk). The returns model is a simplified DCF. */
(function(){
  var CUR='€';
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

  /* ---------- 1 · MARKBYGDEN (Europe · Nordic onshore, corporate PPA + merchant tail) ---------- */
  markbygden:{
    name:'Markbygden / Nordic onshore', geo:'Northern Sweden', continent:'Europe', cur:'€', geoKey:'markbygden',
    lede:'One of Europe\'s largest <b>onshore wind</b> complexes: a vast cold-climate Nordic site selling power partly on <b>long corporate PPAs</b> and partly into the Nordic market, where high, steady winds drive a strong <b>capacity factor</b>.',
    s1:'<p class="body"><b>Onshore wind</b> is the cheapest form of new generation in much of the world: turbines convert wind into electricity, and the economics are simple: installed <b>capacity (MW)</b> × the hours in a year × the <b>capacity factor</b> (how much of nameplate the site actually produces) gives the energy, which is sold at the <b>power price</b>. <b>Markbygden</b>, in northern Sweden, is one of Europe\'s largest onshore complexes, with hundreds of turbines across cold, windy uplands.</p>'+
       '<p class="body">The revenue is part <b>contracted</b> and part <b>merchant</b>. A long <b>corporate power-purchase agreement</b> (Markbygden\'s landmark deal was with an aluminium buyer, Norsk Hydro) fixes the price on much of the output, removing price risk and acting as a <b>revenue floor</b>, while the balance sells into the Nordic spot market for a <b>merchant tail</b>. Operating cost is tiny (wind is free; only O&amp;M), so the margin is very high; the whole investment story is the <b>capacity factor</b> and the <b>price</b>, contracted or merchant.</p>',
    facts:[['~28–48%','Capacity factor','physical driver'],['Corporate PPA','Contracted','+ merchant tail'],['€/MWh','Revenue','price × output'],['~80%+','EBITDA margin','tiny O&amp;M'],['Cold-climate','Site','high, steady wind'],['Floor','PPA','removes price risk']],
    s2:'Watch the farm. Each <b>turbine</b> spins with the <b>capacity factor</b> (faster wind, faster rotor, more output), and the <b>substation</b> exports the power out along the line (cyan pulses scale with generation). More <b>MW</b> puts more turbines across the hills. The owner\'s <b style="color:#0c6b4f">margin</b> is almost the whole revenue, because the only cost is O&amp;M. Drag the capacity, the power price and the capacity factor, and drop the price to see the <b>PPA floor</b> hold the revenue up.',
    driverLab:'Power price', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'output × price',
    ledge:{a:'+ power',b:'+ green cert',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Load Markbygden',
    try:'<b>Try this:</b> drop the <b>power price</b> right down, and watch the revenue stop falling at the <b>floor</b>, because a long corporate PPA fixes the price on most of the output. That is what contracted wind buys: price certainty. Then push the <b>capacity factor</b>: the cold, windy Nordic site is the physical engine, and because O&amp;M is tiny, almost all of the extra revenue drops straight to EBITDA.',
    s3:'Markbygden sells its power partly on a <b>long corporate PPA</b> (a fixed price that removes price risk and floors the revenue) and partly into the Nordic <b>merchant</b> market. The physical driver is the <b>capacity factor</b>, a high, steady cold-climate wind resource, and the cost base is tiny, so the <b>EBITDA margin is very high</b>. The investor question is the split: how much is contracted (safe, lower return) versus merchant (higher, price-exposed), and where the Nordic power price settles.',
    mb:{tag:'Model A · merchant vs contracted', title:'Nordic onshore wind (PPA + merchant)', body:'A vast cold-climate onshore wind complex that sells power partly on a long corporate PPA, a fixed price that floors the revenue and removes price risk, and partly into the Nordic merchant market, at a very high margin because the only cost is O&amp;M. <b>This is Markbygden</b>.'},
    s4a:'The operating cost of onshore wind is remarkably small: there is <b>no fuel</b>, the wind is free, so the cost is essentially <b>O&amp;M per MW</b> (servicing, parts, land and grid charges). That leaves a very high margin: the revenue waterfall drops only a thin sliver to costs. The whole value sits in the <b>capacity factor</b> and the <b>price</b>, contracted or merchant.',
    wfNote:'There is no fuel cost; wind is free. Operating cost is O&amp;M per MW (turbine servicing, parts), land and grid charges, leaving a very high margin. Revenue is capacity × hours × capacity factor × price, floored by the PPA.',
    s4b:'The capital is the turbines, foundations, internal cabling and the grid connection, a large up-front build (~€1.3–1.8m per MW), funded largely by project debt against the contracted cash flow. The forward capital is small maintenance capex, and the upside is <b>repowering</b>, replacing ageing turbines with bigger, higher-capacity-factor machines on the same windy land.',
    stackH:'The capital · turbines + grid connection', splitL:'Financing', splitR:'project-financed',
    split:[['s1',65,'Project debt (against PPA)'],['s2',35,'Sponsor equity']],
    finList:[['','Capacity factor','~28–48% (high, cold-climate)'],['sub','Contracted','corporate PPA (price floor)'],['','Merchant tail','Nordic spot market'],['sub','Revenue','capacity × hours × CF × price'],['','Margin','very high (tiny O&amp;M)'],['rest','Upside','repowering + new phases']],
    finNote:'Markbygden is a <b>part-contracted, part-merchant onshore wind asset</b>: a long corporate PPA floors most of the revenue and removes price risk, the cold-climate site delivers a high capacity factor, and the margin is very high. The investor question is the contracted/merchant split and the Nordic power price.',
    timeline:[['2008','<b>Markbygden</b> conceived as one of Europe\'s largest onshore projects.'],['2017','<b>Norsk Hydro PPA</b>, a landmark long corporate offtake.'],['2019','<b>Markbygden ETT</b> commissions ~650 MW.'],['2020s','<b>Phased build-out</b> across the uplands continues.'],['2020s','<b>Merchant tail</b> exposes the balance to Nordic prices.'],['Long-term','<b>Repowering</b> lifts capacity factor on the same land.']],
    calcNote:'A working model of a <b>part-contracted Nordic onshore wind farm</b>. Revenue is capacity × hours × capacity factor × power price, with a <b>floor</b> for the corporate PPA so the revenue holds when the merchant price falls. The only operating cost is O&amp;M, so the EBITDA margin is very high.',
    s6:'Markbygden is high-capacity-factor Nordic wind, part-contracted. What drives it:',
    breakers:['<b>Capacity factor</b>: the cold, windy site is the physical engine of output and value.','<b>The PPA floor</b>: a long corporate offtake fixes the price and removes downside.','<b>The merchant tail</b> leaves the uncontracted balance exposed to Nordic prices.','<b>Repowering</b>: bigger turbines lift the capacity factor on the same land.'],
    src:'Figures from public sources on the <a href="https://en.wikipedia.org/wiki/Markbygden_Wind_Farm" target="_blank" rel="noopener">Markbygden</a> wind complex and Nordic onshore wind. The figures are approximate and illustrative.',
    econ:{cur:'€', contracted:'corporate PPA',
      mwDef:1100,mwMin:300,mwMax:2000,mwStep:50, priceDef:42,priceMin:18,priceMax:90,priceStep:1,
      cfDef:38,cfMin:28,cfMax:48,cfStep:1, omPerMW:33, varCost:0, fixedOM:0},
    calc:{build:1450,grant:0,capex:5,revG:2,floor:165,cap:600,tax:21,exit:10,lev:5,rd:4.5,amort:3,hold:13},
    map:{footer:GEO.markbygden.footer}
  },

  /* ---------- 2 · ERCOT WIND (North America · merchant + hedges) ---------- */
  ercot:{
    name:'ERCOT wind', geo:'Texas, USA', continent:'North America', cur:'US$', geoKey:'ercot',
    lede:'Texas is the wind capital of the US: vast onshore farms selling into the <b>ERCOT merchant market</b>, where output is huge but the <b>power price</b> swings, so revenue is shaped with hedges and PPAs.',
    s1:'<p class="body"><b>Texas</b> generates more wind power than any US state, on great plains with a strong, reliable wind resource. The turbines sell into <b>ERCOT</b>, an energy-only market with no capacity payment, so revenue is <b>capacity × hours × capacity factor × the spot price</b>, and the spot price is volatile: low in windy off-peak hours, occasionally spiking in scarcity.</p>'+
       '<p class="body">That price risk shapes the whole investment. Owners manage it with <b>financial hedges</b> and corporate <b>PPAs</b>: a buyer takes the price risk on part of the output in exchange for a fixed price, acting as a partial <b>floor</b>. The physics (capacity factor) make the output; the <b>price and the hedge</b> make the return. It is the textbook <b>merchant-versus-contracted</b> wind story: more merchant means higher expected return but real price risk; more PPA means lower, safer cash flow.</p>',
    facts:[['~32–45%','Capacity factor','great-plains wind'],['ERCOT','Market','energy-only, merchant'],['Hedges + PPA','Shaping','partial price floor'],['US$/MWh','Revenue','price × output'],['Volatile','Power price','the swing factor'],['~80%+','EBITDA margin','tiny O&amp;M']],
    s2:'Watch the turbines. Each one spins with the <b>capacity factor</b>; the great-plains wind drives the output, and the <b>substation</b> exports the power along the line (cyan pulses scale with generation). More <b>MW</b> means more turbines. But the <b>price</b> is the swing factor: drag it and watch the revenue move, then see how far the <b>hedge/PPA floor</b> holds it up when the merchant price falls.',
    driverLab:'Power price', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'output × price',
    ledge:{a:'+ power',b:'+ hedge gain',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Load ERCOT wind',
    try:'<b>Try this:</b> drag the <b>power price</b> hard; ERCOT is an energy-only merchant market, so unhedged revenue swings with it. Now notice the <b>floor</b>: hedges and PPAs fix the price on part of the output, putting a partial floor under the revenue. That is the whole merchant-versus-contracted trade: more merchant = higher expected return but more risk; more PPA = safer, lower cash flow.',
    s3:'ERCOT wind sells into an <b>energy-only merchant market</b>, so revenue is output × a volatile spot price. The capacity factor (a strong plains resource) makes the energy; the <b>price and the hedging</b> make the return. Owners shape the price risk with financial hedges and corporate PPAs, which floor part of the revenue. The return is higher than a fully contracted asset but carries genuine <b>price risk</b>, which is inseparable from merchant wind.',
    mb:{tag:'Model A · merchant vs contracted', title:'Texas merchant wind (ERCOT)', body:'Vast plains wind selling into the energy-only ERCOT market, where output is large but the spot price swings, with revenue shaped by hedges and corporate PPAs that floor part of the price. Higher expected return than contracted wind, but real price risk. <b>This is ERCOT wind</b>.'},
    s4a:'The operating cost is <b>tiny</b> (no fuel, just O&amp;M per MW, land and grid charges), so the margin is very high and the revenue waterfall drops only a sliver to costs. The whole story is on the revenue side: the capacity factor sets the volume, and the <b>price</b> (merchant, hedged or PPA) sets the value and the risk.',
    wfNote:'No fuel, only O&amp;M per MW, land and grid charges, so the margin is very high. The volatility sits in revenue: output × a swinging ERCOT spot price, partly fixed by hedges and PPAs.',
    s4b:'The capital is the turbines, foundations, collection system and the grid interconnection, a large up-front build (~$1.3–1.6m per MW). It is project-financed, but because the cash flow is partly merchant, lenders size debt conservatively against the hedged/contracted portion. The upside is repowering and the option value of merchant price spikes.',
    stackH:'The capital · turbines + interconnection', splitL:'Financing', splitR:'merchant-aware',
    split:[['s1',55,'Project debt (against hedge/PPA)'],['s2',45,'Sponsor / tax-equity']],
    finList:[['','Capacity factor','~32–45% (plains wind)'],['sub','Market','ERCOT energy-only (merchant)'],['','Shaping','hedges + corporate PPAs'],['sub','Revenue','output × volatile spot price'],['','Margin','very high (tiny O&amp;M)'],['rest','Return','higher, but price-exposed']],
    finNote:'ERCOT wind is the <b>merchant-versus-contracted</b> question made concrete: a strong capacity factor and a tiny cost base, but revenue exposed to a volatile spot price, partly floored by hedges and PPAs. More merchant lifts the expected return and the risk together.',
    timeline:[['2000s','<b>Texas wind</b> scales on the great plains.'],['2013','<b>CREZ lines</b> connect West Texas wind to load.'],['2010s','<b>Corporate PPAs</b> become a core offtake route.'],['2020s','<b>ERCOT volatility</b> (incl. 2021) reprices price risk.'],['2020s','<b>Hedges &amp; shapes</b> manage the merchant exposure.'],['Long-term','<b>Repowering</b> lifts output on existing sites.']],
    calcNote:'A working model of a <b>merchant ERCOT wind farm</b>. Revenue is capacity × hours × capacity factor × a volatile power price, with a <b>floor</b> for the hedged/PPA portion so part of the revenue is fixed. The only operating cost is O&amp;M, so the EBITDA margin is very high; the risk is the price.',
    s6:'ERCOT wind is high-output merchant wind, price-exposed. What drives it:',
    breakers:['<b>Capacity factor</b>: the plains wind resource sets the volume of output.','<b>The power price</b>: a volatile, energy-only merchant market is the swing factor.','<b>Hedges &amp; PPAs</b> floor part of the price and shape the risk.','<b>Merchant vs contracted</b>: the split sets both the expected return and the risk.'],
    src:'Figures are illustrative for a Texas (ERCOT) merchant onshore wind farm; ERCOT market data and US wind disclosures inform the ranges. All figures here are approximate and illustrative.',
    econ:{cur:'US$', contracted:'hedges + PPA',
      mwDef:300,mwMin:100,mwMax:800,mwStep:25, priceDef:34,priceMin:14,priceMax:80,priceStep:1,
      cfDef:40,cfMin:30,cfMax:48,cfStep:1, omPerMW:33, varCost:0, fixedOM:0},
    calc:{build:285,grant:0,capex:6,revG:2,floor:30,cap:160,tax:25,exit:9,lev:4,rd:5.5,amort:4,hold:13},
    map:{footer:GEO.ercot.footer}
  },

  /* ---------- 3 · CASA DOS VENTOS (South America · PPA + merchant, EM) ---------- */
  casadosventos:{
    name:'Casa dos Ventos', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'casadosventos',
    lede:'Brazil\'s leading onshore wind developer: superb northeast trade-wind sites with very high <b>capacity factors</b>, selling on long <b>PPAs</b> plus merchant, but valued at an <b>emerging-market</b> discount rate.',
    s1:'<p class="body">Northeast <b>Brazil</b> has some of the best onshore wind in the world: steady trade winds give <b>capacity factors</b> well above the global average, so a megawatt of turbine there produces far more energy than the same machine elsewhere. <b>Casa dos Ventos</b> is the country\'s leading wind developer, with a large operating and development pipeline.</p>'+
       '<p class="body">The revenue mix is long <b>power-purchase agreements</b> (with utilities, the regulated auctions and corporate buyers) plus a <b>merchant</b> component, with the PPAs acting as a <b>revenue floor</b>. The physics are outstanding (a very high capacity factor) and the margin is high, but the asset is carried at an <b>emerging-market discount rate</b>: local rates and the real make the cost of capital high, so a strong contracted cash flow nets down to a moderate return once discounted. TotalEnergies took a major stake, validating the platform.</p>',
    facts:[['~45–55%','Capacity factor','world-class wind'],['PPA + merchant','Revenue','floored by PPAs'],['R$/MWh','Price','auction + corporate'],['EM rate','Discount','local cost of capital'],['TotalEnergies','Partner','platform stake'],['~80%+','EBITDA margin','tiny O&amp;M']],
    s2:'Watch the rotors. The northeast trade winds drive a <b>very high capacity factor</b>: they spin fast, the output is large, and the <b>substation</b> exports the power along the line. More <b>MW</b> means more turbines. The <b style="color:#0c6b4f">margin</b> is high (tiny O&amp;M), and the <b>PPAs floor</b> the revenue. Drag the price down to see the floor hold, but remember the whole return is then discounted at an <b>EM rate</b>.',
    driverLab:'Power price', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'output × price',
    ledge:{a:'+ power',b:'+ PPA fixed',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Load Casa dos Ventos',
    try:'<b>Try this:</b> push the <b>capacity factor</b> up toward the high end; northeast Brazil\'s trade winds are world-class, and because O&amp;M is tiny, that output drops almost entirely to EBITDA. Drop the price and watch the <b>PPA floor</b> hold the revenue. Then raise the <b>cost of debt</b> to feel the EM discount: a superb physical asset nets to a moderate return once carried at a local cost of capital.',
    s3:'Casa dos Ventos pairs <b>world-class wind</b> (a very high capacity factor) with long <b>PPAs</b> that floor the revenue plus a merchant component. The asset itself is excellent (high output, tiny cost, high margin), but it is valued at an <b>emerging-market discount rate</b>: local rates and currency raise the cost of capital, so the strong contracted cash flow nets to a moderate return. The investment debate is the <b>discount rate</b> and the strength of the offtake, not the wind.',
    mb:{tag:'Model A · merchant vs contracted', title:'Brazilian onshore wind (PPA + merchant, EM)', body:'World-class northeast trade-wind sites with very high capacity factors, sold on long PPAs (a revenue floor) plus merchant: an excellent physical asset carried at an emerging-market discount rate. <b>This is Casa dos Ventos</b>, partnered with TotalEnergies.'},
    s4a:'Operating cost is barely there: no fuel, just O&amp;M per MW, so the margin is very high and costs claim only a sliver of the waterfall. The exceptional capacity factor makes the volume large; the question for value is the <b>price</b> (PPA-floored plus merchant) and, above all, the <b>discount rate</b> at which a Brazilian cash flow is carried.',
    wfNote:'Wind costs nothing to run beyond O&amp;M per MW, so the margin is very high. The output is exceptional (world-class capacity factor); revenue is output × price, floored by PPAs, then discounted at an emerging-market rate.',
    s4b:'The capital is the turbines, foundations, collection system and grid connection (~R$ per MW). It is project-financed against the PPAs, but the cost of debt and equity reflect <b>local rates and currency</b>. The platform compounds by building out a large pipeline; the value lever is as much the discount rate and offtake quality as the build cost.',
    stackH:'The capital · turbines + grid connection', splitL:'Financing', splitR:'EM',
    split:[['s1',60,'Local / project debt'],['s2',40,'Sponsor equity (incl. TotalEnergies)']],
    finList:[['','Capacity factor','~45–55% (world-class)'],['sub','Revenue','long PPAs (floor) + merchant'],['','Price','auctions + corporate PPAs'],['sub','Discount rate','high (EM, local currency)'],['','Partner','TotalEnergies'],['rest','Growth','large development pipeline']],
    finNote:'Casa dos Ventos is a <b>world-class physical asset at an emerging-market discount rate</b>: a very high capacity factor and high margin, floored by PPAs, but carried at a high local cost of capital. The debate centres on the discount rate and the offtake rather than the wind resource.',
    timeline:[['2000s','<b>Casa dos Ventos</b> founded; northeast Brazil wind develops.'],['2010s','<b>Regulated auctions</b> and corporate PPAs anchor offtake.'],['2010s','<b>High capacity factors</b> make Brazil a wind leader.'],['2022','<b>TotalEnergies</b> takes a major platform stake.'],['2020s','<b>Pipeline build-out</b> across the northeast.'],['Ongoing','<b>Merchant + PPA</b> mix and EM rates set the value.']],
    calcNote:'A working model of a <b>Brazilian onshore wind farm</b>, on an enterprise-value basis. Revenue is capacity × hours × a very high capacity factor × price, floored by PPAs; O&amp;M is tiny, so the margin is high. The cost of debt is high to reflect EM rates, netting a strong cash flow down to a moderate return.',
    s6:'Casa dos Ventos is world-class wind at an EM rate. What drives it:',
    breakers:['<b>Capacity factor</b>: northeast trade winds give a world-class physical output.','<b>The PPA floor</b>: long offtakes fix the price and underpin the cash flow.','<b>Discount rate</b>: local rates and currency are the principal lever on value.','<b>Pipeline</b>: a large development pipeline drives the platform\'s growth.'],
    src:'Figures are illustrative for a Brazilian onshore wind platform (e.g. <a href="https://www.casadosventos.com.br/" target="_blank" rel="noopener">Casa dos Ventos</a>). All figures here are approximate and illustrative.',
    econ:{cur:'R$', contracted:'long PPAs',
      mwDef:600,mwMin:200,mwMax:1400,mwStep:50, priceDef:200,priceMin:90,priceMax:380,priceStep:5,
      cfDef:50,cfMin:42,cfMax:58,cfStep:1, omPerMW:180, varCost:0, fixedOM:0},
    calc:{build:5300,grant:0,capex:6,revG:5,floor:510,cap:2400,tax:30,exit:9,lev:5,rd:11,amort:4,hold:13},
    map:{footer:GEO.casadosventos.footer}
  },

  /* ---------- 4 · GOLDEN PLAINS / MACARTHUR (Oceania · state-supported + merchant) ---------- */
  goldenplains:{
    name:'Golden Plains / Macarthur', geo:'Victoria, Australia', continent:'Oceania', cur:'A$', geoKey:'goldenplains',
    lede:'Among the largest wind farms in the Southern Hemisphere: Victorian onshore wind backed by <b>state support</b> (a CfD-style contract) plus a merchant tail, in a high-priced but volatile grid.',
    s1:'<p class="body"><b>Victoria</b> hosts some of the largest onshore wind farms in the Southern Hemisphere: Macarthur, and the very large Golden Plains. The wind resource is good, the grid (the NEM) has high but volatile prices, and the state has actively <b>supported</b> new wind to meet renewable targets.</p>'+
       '<p class="body">The revenue is part <b>contracted</b> through state support, a <b>CfD-style contract</b> or a long government-backed offtake that fixes the price (a <b>revenue floor</b>), and part <b>merchant</b>, selling into the NEM. State support de-risks the build; the merchant tail keeps upside to high spot prices. As more wind and solar enter the NEM, daytime prices can fall, so <b>firming</b> and the structure of the offtake matter. It is a state-supported-plus-merchant onshore wind asset in a high-priced grid.</p>',
    facts:[['~32–42%','Capacity factor','good Victorian wind'],['State support','Contracted','CfD-style floor'],['NEM','Market','high but volatile'],['A$/MWh','Revenue','price × output'],['Merchant tail','Upside','spot exposure'],['~80%+','EBITDA margin','tiny O&amp;M']],
    s2:'The Victorian wind drives the <b>capacity factor</b> and the rotors spin; the <b>substation</b> exports the power along the line. More <b>MW</b> means more turbines across the plains. The <b style="color:#0c6b4f">margin</b> is high (tiny O&amp;M), and the <b>state-support floor</b> fixes the price on part of the output. Drag the price down to see the floor hold; push the capacity factor for output.',
    driverLab:'Power price', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'output × price',
    ledge:{a:'+ power',b:'+ state CfD',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Load Golden Plains',
    try:'<b>Try this:</b> drop the <b>power price</b>. The NEM is volatile and daytime prices can fall as more renewables enter, but the <b>state-support floor</b> (a CfD-style contract) holds the contracted portion up. Then push the <b>capacity factor</b> for the good Victorian wind. The merchant tail keeps upside to high spot prices; firming and the offtake structure are the swing factors.',
    s3:'Golden Plains / Macarthur sells part of its power under <b>state support</b>, a CfD-style contract that fixes the price and floors the revenue, and part <b>merchant</b> into the NEM. State support de-risks the build and the contracted cash flow; the merchant tail keeps upside to high spot prices. As renewables grow in the NEM, daytime prices can fall, so <b>firming</b> and the offtake structure matter. A high capacity factor and tiny O&amp;M keep the margin high.',
    mb:{tag:'Model A · merchant vs contracted', title:'Victorian onshore wind (state-supported + merchant)', body:'Among the largest wind farms in the Southern Hemisphere, selling part of its output under a state CfD-style contract that floors the price and part merchant into the volatile NEM. State support de-risks the build; the merchant tail keeps the upside. <b>This is Golden Plains / Macarthur</b>.'},
    s4a:'With no fuel to buy, the operating cost is just <b>O&amp;M per MW</b> and the margin is very high. The value sits in the capacity factor (the volume) and the <b>price</b>: a state-support floor on part of the output plus a merchant tail, in a high-but-volatile NEM where firming increasingly matters.',
    wfNote:'The only operating cost is O&amp;M per MW (no fuel), so the margin is very high. Revenue is output × price, with a state CfD-style floor on the contracted portion and a merchant tail in the volatile NEM.',
    s4b:'The capital is the turbines, foundations, collection system and grid connection (~A$ per MW), a large build, de-risked by state support and project-financed against the contracted cash flow. The forward question is firming (storage, contracts) as the NEM fills with renewables, and the value of the merchant tail.',
    stackH:'The capital · turbines + grid connection', splitL:'Financing', splitR:'state-supported',
    split:[['s1',60,'Project debt (against CfD)'],['s2',40,'Sponsor equity']],
    finList:[['','Capacity factor','~32–42% (Victorian wind)'],['sub','Contracted','state CfD-style support (floor)'],['','Market','NEM (high but volatile)'],['sub','Merchant tail','spot upside'],['','Margin','very high (tiny O&amp;M)'],['rest','Forward','firming as renewables grow']],
    finNote:'Golden Plains / Macarthur is a <b>state-supported-plus-merchant onshore wind asset</b>: a CfD-style floor de-risks the build, a merchant tail keeps the upside, and the margin is high. The forward swing factors are NEM prices, firming and the offtake structure.',
    timeline:[['2013','<b>Macarthur</b> commissions, then among the largest in the hemisphere.'],['2020s','<b>Golden Plains</b> builds out as a very large Victorian project.'],['2020s','<b>State support</b> (CfD-style auctions) backs new wind.'],['2020s','<b>NEM renewables</b> grow; daytime prices soften.'],['2020s','<b>Firming</b> (storage, contracts) becomes central.'],['Long-term','<b>Merchant tail</b> exposes the balance to NEM prices.']],
    calcNote:'A working model of a <b>state-supported Victorian onshore wind farm</b>. Revenue is capacity × hours × capacity factor × price, with a <b>floor</b> for the state CfD-style support so the contracted portion holds when the NEM price falls. O&amp;M is tiny, so the margin is high.',
    s6:'Golden Plains / Macarthur is state-supported wind in a volatile grid. What drives it:',
    breakers:['<b>Capacity factor</b>: the Victorian wind sets the volume of output.','<b>State-support floor</b>: a CfD-style contract fixes the price and de-risks the build.','<b>NEM prices &amp; firming</b>: volatile spot prices and the need to firm are swing factors.','<b>Merchant tail</b>: the uncontracted balance keeps upside to high prices.'],
    src:'Figures are illustrative for large Victorian onshore wind farms (e.g. Golden Plains, Macarthur) and the Australian NEM. All figures here are approximate and illustrative.',
    econ:{cur:'A$', contracted:'state CfD-style',
      mwDef:700,mwMin:200,mwMax:1400,mwStep:50, priceDef:60,priceMin:25,priceMax:130,priceStep:1,
      cfDef:38,cfMin:30,cfMax:44,cfStep:1, omPerMW:48, varCost:0, fixedOM:0},
    calc:{build:1560,grant:0,capex:6,revG:3,floor:160,cap:700,tax:30,exit:10,lev:5,rd:6,amort:3,hold:13},
    map:{footer:GEO.goldenplains.footer}
  },

  /* ---------- 5 · DUMAT AL JANDAL (Middle East · single long PPA, low cost of capital) ---------- */
  dumat:{
    name:'Dumat Al Jandal', geo:'Saudi Arabia', continent:'Middle East', cur:'SAR', geoKey:'dumat',
    lede:'Saudi Arabia\'s first wind farm: a single large desert project on a <b>20-year sovereign PPA</b>, where the whole price is fixed and the very low cost of capital is the story.',
    s1:'<p class="body"><b>Dumat Al Jandal</b>, in northern Saudi Arabia, is the kingdom\'s first utility-scale wind farm (~400 MW), developed under the national renewable programme. It sits in open desert with a good wind resource and a high capacity factor by Gulf standards.</p>'+
       '<p class="body">Its revenue model is the cleanest possible: a <b>single, long power-purchase agreement</b>, a 20-year offtake with the government buyer, fixes the price on <b>all</b> the output. There is no merchant exposure at all: the <b>floor and the cap are effectively the same</b>, so the cash flow is a fixed, contracted annuity. That, plus a <b>very low cost of capital</b> (sovereign-backed, competitively tendered), is what produced one of the lowest wind tariffs in the world. The return is modest but very secure: bond-like contracted generation.</p>',
    facts:[['~35–43%','Capacity factor','good desert wind'],['Single PPA','Revenue','20-year, all output'],['No merchant','Price risk','fully contracted'],['Very low','Cost of capital','sovereign-backed'],['SAR/MWh','Tariff','fixed for 20 yrs'],['~85%+','EBITDA margin','tiny O&amp;M']],
    s2:'Watch the desert farm. The wind drives the <b>capacity factor</b> and the rotors spin; the <b>substation</b> exports the power along the line. The whole output sells under a <b>single 20-year PPA</b>, so the revenue is fixed: drag the price slider and watch the <b>floor</b> hold it flat, because there is no merchant exposure at all. The margin is very high; the story is the very low cost of capital.',
    driverLab:'Power price', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'fully-contracted PPA',
    ledge:{a:'+ PPA power',b:'+ fixed price',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Load Dumat Al Jandal',
    try:'<b>Try this:</b> drag the <b>power price</b> anywhere and the revenue barely moves, because a single 20-year PPA fixes the price on <b>all</b> the output (the floor holds it). That is fully-contracted wind: no price risk at all. The return is modest but secure, and the magic is the <b>very low cost of capital</b>: drop the cost of debt and watch a thin tariff still clear a sovereign-backed return.',
    s3:'Dumat Al Jandal sells <b>all</b> its output under a <b>single 20-year PPA</b> with the government buyer, so there is no merchant exposure, the revenue is a fixed, contracted annuity (the floor and cap coincide). A good desert capacity factor and tiny O&amp;M keep the margin very high. The return is modest but very secure, and it was made possible by a <b>very low cost of capital</b>, sovereign-backed and competitively tendered, which produced one of the world\'s lowest wind tariffs.',
    mb:{tag:'Model A · merchant vs contracted', title:'Fully-contracted desert wind (single PPA)', body:'Saudi Arabia\'s first wind farm, selling all its output under a single 20-year sovereign PPA, no merchant exposure, a fixed price, a bond-like contracted annuity. The story is the very low cost of capital that produced a record-low tariff. <b>This is Dumat Al Jandal</b>.'},
    s4a:'The operating cost is <b>tiny</b>, no fuel, just O&amp;M per MW, so the margin is very high and the waterfall drops only a sliver to costs. With the whole price fixed by a single PPA, there is no revenue volatility at all; the value lever is purely the <b>cost of capital</b> at which a fully-contracted annuity is discounted.',
    wfNote:'No fuel, only O&amp;M per MW, so the margin is very high. The whole output is on a single fixed-price PPA, so revenue is a flat contracted annuity; the floor and cap coincide and there is no merchant exposure.',
    s4b:'The capital is the turbines, foundations, collection system and grid connection (~SAR per MW), financed at a very <b>low cost of capital</b> on the back of a 20-year sovereign PPA. That low discount rate, against a fully-contracted cash flow, is precisely what allowed a record-low winning tariff. The return is modest, secure and bond-like.',
    stackH:'The capital · turbines + grid connection', splitL:'Financing', splitR:'investment-grade',
    split:[['s1',75,'Low-cost project debt'],['s2',25,'Sponsor equity']],
    finList:[['','Capacity factor','~35–43% (desert wind)'],['sub','Revenue','single 20-year PPA (all output)'],['','Price risk','none (fully contracted)'],['sub','Cost of capital','very low (sovereign-backed)'],['','Tariff','record-low, fixed'],['rest','Return','modest but very secure']],
    finNote:'Dumat Al Jandal is <b>fully-contracted, bond-like wind</b>: a single 20-year PPA fixes the whole price, the margin is very high, and a very low cost of capital produced a record tariff. The return is modest but secure; the only real variable is the discount rate.',
    timeline:[['2019','<b>Dumat Al Jandal</b> tendered at a record-low wind tariff.'],['2019','<b>20-year PPA</b> signed with the government buyer.'],['2021','<b>Construction</b> of the kingdom\'s first wind farm.'],['2022','<b>~400 MW commissions</b>, first Saudi utility wind.'],['2020s','<b>Fixed PPA</b> delivers a flat contracted annuity.'],['Long-term','<b>Low cost of capital</b> underpins the economics.']],
    calcNote:'A working model of a <b>fully-contracted desert wind farm</b>. Revenue is capacity × hours × capacity factor × a fixed PPA price; the <b>floor</b> and <b>cap</b> are set close together so the revenue is flat regardless of the price slider, no merchant exposure. O&amp;M is tiny; the cost of capital is very low.',
    s6:'Dumat Al Jandal is fully-contracted, low-cost-of-capital wind. What drives it:',
    breakers:['<b>The single PPA</b>, a 20-year fixed price on all output removes price risk entirely.','<b>Cost of capital</b>, a very low, sovereign-backed discount rate is the whole story.','<b>Capacity factor</b>, a good desert wind resource sets the (fixed-price) volume.','<b>Tariff</b>, the record-low winning price reflects the low cost of capital.'],
    src:'Figures from public sources on <a href="https://en.wikipedia.org/wiki/Dumat_Al-Jandal_wind_farm" target="_blank" rel="noopener">Dumat Al Jandal</a> and the Saudi renewable programme. The figures are approximate and illustrative.',
    econ:{cur:'SAR', contracted:'single 20-yr PPA',
      mwDef:400,mwMin:150,mwMax:700,mwStep:25, priceDef:75,priceMin:40,priceMax:140,priceStep:1,
      cfDef:39,cfMin:33,cfMax:45,cfStep:1, omPerMW:40, varCost:0, fixedOM:0},
    calc:{build:1060,grant:0,capex:5,revG:0,floor:96,cap:108,tax:0,exit:11,lev:6,rd:4,amort:4,hold:14},
    map:{footer:GEO.dumat.footer}
  },

  /* ---------- 6 · LONGYUAN ONSHORE (China · regulated feed-in + grid priority) ---------- */
  longyuan:{
    name:'Longyuan onshore', geo:'Northern China', continent:'China', cur:'¥', geoKey:'longyuan',
    lede:'The world\'s largest wind operator, Chinese onshore wind at <b>continental scale</b>, historically on a <b>regulated feed-in tariff</b> with grid-priority dispatch, now blending into the market.',
    s1:'<p class="body"><b>China</b> has more onshore wind than any other country, much of it operated by state-linked giants such as <b>Longyuan</b>, the world\'s largest wind operator. Vast fleets of turbines across the windy north and the deserts feed power into the grid at <b>continental scale</b>.</p>'+
       '<p class="body">The revenue model has historically been a <b>regulated feed-in tariff</b> with <b>grid-priority dispatch</b>, a fixed price (a <b>revenue floor</b>) for renewable output that the grid is obliged to take, which made the cash flow stable and bond-like. As reforms proceed, newer capacity blends feed-in support with <b>market trading</b>, but the model remains heavily contracted/regulated. A good capacity factor and tiny O&amp;M, applied across a colossal fleet, make an enormous and stable cash flow at a low cost of capital.</p>',
    facts:[['~25–35%','Capacity factor','vast fleet'],['Feed-in','Tariff','regulated (floor)'],['Grid priority','Dispatch','obliged offtake'],['¥/MWh','Revenue','price × output'],['Vast scale','Fleet','world\'s largest'],['Low','Cost of capital','state-linked']],
    s2:'Watch the farm. The turbines spin with the <b>capacity factor</b>, and the <b>substation</b> exports the power along the line, at this scale even a modest per-MWh price is an enormous absolute cash flow. More <b>MW</b> means more turbines. A regulated <b>feed-in tariff floor</b> with grid priority fixes the price, so drag the price down and watch the floor hold. The <b style="color:#0c6b4f">margin</b> is high (tiny O&amp;M).',
    driverLab:'Power price', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'output × tariff',
    ledge:{a:'+ power',b:'+ feed-in',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Load Longyuan',
    try:'<b>Try this:</b> push the <b>capacity</b>, at fleet scale, even a modest regulated price is a vast absolute cash flow. Drop the <b>power price</b> and watch the <b>feed-in floor</b> hold the revenue (the grid is obliged to take the output at a fixed price). Newer capacity blends in market trading, but the model is heavily contracted; scale, a low cost of capital and grid priority are the levers.',
    s3:'Longyuan onshore wind has historically earned a <b>regulated feed-in tariff</b> with <b>grid-priority dispatch</b>, a fixed price the grid must take, which floors the revenue and makes the cash flow bond-like. Newer capacity blends feed-in with market trading, but the model stays heavily contracted/regulated. A decent capacity factor and tiny O&amp;M, across a <b>colossal fleet</b>, make an enormous, stable cash flow at a low, state-linked cost of capital. Scale and the tariff regime are the levers, not merchant price.',
    mb:{tag:'Model A · merchant vs contracted', title:'Chinese onshore wind (feed-in + grid priority)', body:'The world\'s largest wind operator, a colossal fleet on a regulated feed-in tariff with grid-priority dispatch (a revenue floor), now blending into market trading, at a low state-linked cost of capital. Scale, not price, is the model. <b>This is Longyuan onshore</b>.'},
    s4a:'The operating cost is <b>tiny</b>, no fuel, just O&amp;M per MW, so the margin is high and the waterfall drops only a sliver to costs. The feed-in tariff and grid priority fix the price and the offtake; at fleet scale, a modest regulated price is an enormous absolute cash flow. The levers are <b>scale</b>, the tariff regime and the cost of capital.',
    wfNote:'No fuel, only O&amp;M per MW, so the margin is high. A regulated feed-in tariff with grid-priority dispatch floors the revenue; at colossal fleet scale the absolute cash flow is vast even at a modest per-MWh price.',
    s4b:'The capital is the turbines, foundations, collection systems and grid connections across a vast fleet (~¥ per MW), financed at a <b>low, state-linked cost of capital</b>. The forward capital is repowering and continued build-out; the cash flow compounds with the scale of the fleet and the security of grid-priority, regulated offtake.',
    stackH:'The capital · fleet turbines + grid', splitL:'Financing', splitR:'state-linked',
    split:[['s1',62,'State-linked / project debt'],['s2',38,'State / listed equity']],
    finList:[['','Capacity factor','~25–35% (vast fleet)'],['sub','Tariff','regulated feed-in (floor)'],['','Dispatch','grid priority (obliged offtake)'],['sub','Revenue','output × tariff (+ market tail)'],['','Cost of capital','low (state-linked)'],['rest','Driver','scale + build-out']],
    finNote:'Longyuan onshore is a <b>regulated, grid-priority fleet at vast scale</b>: a feed-in tariff floors the price, grid priority secures the offtake, and a low cost of capital supports the scale. The return is steady and large in absolute terms; reform gradually adds a market tail.',
    timeline:[['1990s','<b>Longyuan</b> pioneers Chinese wind power.'],['2000s','<b>Feed-in tariffs</b> and grid priority drive a vast build-out.'],['2009','<b>Longyuan lists</b> in Hong Kong; scales rapidly.'],['2010s','<b>World\'s largest</b> wind operator by capacity.'],['2020s','<b>Market reform</b> blends feed-in with trading.'],['2060','<b>Carbon-neutrality</b> target drives continued build-out.']],
    calcNote:'A working model of a <b>regulated Chinese onshore wind fleet</b>, on an enterprise-value basis. Revenue is capacity × hours × capacity factor × a regulated feed-in tariff; a <b>floor</b> models the fixed feed-in price with grid priority. At fleet scale the absolute cash flow is vast; the cost of capital is low. Figures are highly illustrative.',
    s6:'Longyuan onshore is regulated, grid-priority wind at vast scale. What drives it:',
    breakers:['<b>Scale</b>, a colossal fleet makes a modest per-MWh price an enormous cash flow.','<b>Feed-in floor</b>, a regulated tariff fixes the price and grid priority secures offtake.','<b>Cost of capital</b>, a low, state-linked discount rate supports the scale.','<b>Reform</b>, market trading gradually adds a tail to the regulated base.'],
    src:'Figures are illustrative for a Chinese onshore wind fleet (e.g. <a href="https://www.clypg.com.cn/" target="_blank" rel="noopener">Longyuan Power</a>). Given the scale and regulated structure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', contracted:'feed-in tariff',
      mwDef:4000,mwMin:1500,mwMax:9000,mwStep:100, priceDef:340,priceMin:200,priceMax:550,priceStep:5,
      cfDef:30,cfMin:22,cfMax:38,cfStep:1, omPerMW:150, varCost:0, fixedOM:0},
    calc:{build:34000,grant:0,capex:5,revG:3,floor:3450,cap:14000,tax:25,exit:10,lev:6,rd:3.5,amort:3,hold:12},
    map:{footer:GEO.longyuan.footer}
  }
  };
  var ORDER=['markbygden','ercot','casadosventos','goldenplains','dumat','longyuan'];

  /* ===================================================================
     ONSHORE WIND FARM RENDERER  (canvas, 720x520), landscape, daytime
     Rolling green terrain dotted with wind turbines (a mast + 3 rotating
     blades each, spin scaling with capacity factor); a substation and an
     export line carrying the power out (cyan pulses scale with output).
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var SUB={x:636,y:300};            // substation (export point), on the right
  var TURBS=[], NTURB=0, MAXTURB=22;
  /* fixed turbine grid across the terrain (sorted by export distance so more
     MW lights them from the export side outward) */
  function layout(){
    TURBS=[];
    var rows=[[150,360,540],[230,420,610],[140,330,520],[210,400,590],[160,350,560],[420,300,470,210]];
    // build a clean staggered field of slots
    var slots=[];
    var ys=[120,176,232,288,344,400,452];
    var xsByRow=[
      [120,250,380,500],
      [185,315,445,560],
      [120,250,380,500],
      [185,315,445,560],
      [120,250,380,500],
      [185,315,445,560],
      [250,380]
    ];
    for(var r=0;r<ys.length;r++){ var xs=xsByRow[r]; for(var c=0;c<xs.length;c++){
      slots.push({x:xs[c], y:ys[r], scale:0.82+0.36*((ys[r]-100)/360), ph:(slots.length*0.9)%6.28}); } }
    // distance from substation: nearer the export gets lit first
    slots.forEach(function(s){ s.d=Math.hypot(s.x-SUB.x,s.y-SUB.y); });
    slots.sort(function(a,b){ return b.d-a.d; });   // far first, fills toward export as MW grows... invert so near-export lights first
    slots.reverse();
    TURBS=slots.slice(0,MAXTURB);
    NTURB=TURBS.length;
  }

  /* ---- base map: rolling green terrain ---- */
  function terrainCols(){
    var t=GEO[A.geoKey].terrain;
    if(t==='desert') return ['#e7ddc4','#dcceac','rgba(180,160,110,0.16)'];
    if(t==='hills')  return ['#cfe0c6','#bcd2b0','rgba(120,160,110,0.16)'];
    return ['#d6e4cb','#c6d8b8','rgba(130,170,120,0.14)'];   // plains
  }
  function drawMap(){
    var C=terrainCols();
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,C[0]); g.addColorStop(1,C[1]);
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // soft rolling contour bands
    ctx.fillStyle=C[2];
    for(var i=0;i<4;i++){ var yy=120+i*110, amp=18+i*4;
      ctx.beginPath(); ctx.moveTo(0,yy);
      for(var x=0;x<=W;x+=40){ ctx.lineTo(x, yy+Math.sin(x*0.012+i*1.3+T*0.002)*amp); }
      ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill(); }
    // faint field hedgerows
    ctx.strokeStyle='rgba(110,140,100,0.12)'; ctx.lineWidth=1.4;
    [170,300,430].forEach(function(yy){ ctx.beginPath(); ctx.moveTo(20,yy);
      for(var x=20;x<=W-60;x+=30){ ctx.lineTo(x, yy+Math.sin(x*0.02)*5); } ctx.stroke(); });
  }

  /* ---- a single wind turbine: mast + 3 rotating blades ---- */
  function turbine(tu,cf,outVis){
    var x=tu.x, y=tu.y, s=tu.scale, mast=46*s, hub=y-mast;
    // shadow
    ctx.fillStyle='rgba(40,55,40,0.10)'; ctx.beginPath(); ctx.ellipse(x,y+2,10*s,3*s,0,0,Math.PI*2); ctx.fill();
    // mast (tapered)
    var mg=ctx.createLinearGradient(x-2,hub,x+2,y); mg.addColorStop(0,'#fbfcfb'); mg.addColorStop(1,'#d3d9d2');
    ctx.fillStyle=mg; ctx.beginPath();
    ctx.moveTo(x-1.2*s,hub); ctx.lineTo(x+1.2*s,hub); ctx.lineTo(x+2.2*s,y); ctx.lineTo(x-2.2*s,y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(120,135,120,0.4)'; ctx.lineWidth=0.6; ctx.stroke();
    // nacelle
    ctx.fillStyle='#eef1ee'; rr(x-3*s,hub-2.4*s,8*s,4.8*s,1.6*s); ctx.fill();
    // rotor, spin speed scales with capacity factor; output glow scales with output
    var spin=T*(0.05+0.16*cf)+tu.ph, R=24*s;
    if(outVis>0.04) glow(x,hub,R*0.7+5*outVis, 'rgba(120,200,235,'+(0.05+0.12*outVis)+')');
    ctx.save(); ctx.translate(x,hub); ctx.rotate(spin);
    for(var b=0;b<3;b++){ ctx.rotate(Math.PI*2/3);
      var bg=ctx.createLinearGradient(0,0,0,-R); bg.addColorStop(0,'#fbfcfb'); bg.addColorStop(1,'#e2e7e2');
      ctx.fillStyle=bg; ctx.beginPath();
      ctx.moveTo(-1.4*s,0); ctx.quadraticCurveTo(-2.4*s,-R*0.6, -1.0*s,-R); ctx.quadraticCurveTo(0.6*s,-R*0.95, 1.4*s,0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(120,135,120,0.35)'; ctx.lineWidth=0.5; ctx.stroke(); }
    ctx.restore();
    // hub cap
    ctx.fillStyle='#cfd5cf'; ctx.beginPath(); ctx.arc(x,hub,2.2*s,0,Math.PI*2); ctx.fill();
  }

  /* ---- substation + export line ---- */
  function substation(outVis){
    var x=SUB.x,y=SUB.y;
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x,y+22,30,5,0,0,Math.PI*2); ctx.fill();
    // fenced yard
    ctx.fillStyle='#cdd2c9'; rr(x-26,y-20,52,42,4); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.55)'; ctx.lineWidth=1; ctx.stroke();
    // transformer + busbars
    ctx.fillStyle='#aeb4ac'; rr(x-18,y-10,16,24,2); ctx.fill(); rr(x+2,y-10,16,24,2); ctx.fill();
    ctx.strokeStyle='rgba(90,105,95,0.5)'; ctx.lineWidth=1;
    [-12,0,12].forEach(function(dx){ ctx.beginPath(); ctx.moveTo(x+dx,y-18); ctx.lineTo(x+dx,y-26); ctx.stroke(); });
    // export glow
    glow(x,y-2,18+8*outVis,'rgba(120,200,235,'+(0.12+0.22*outVis)+')');
    // export pylons + line heading off-canvas to the right
    ctx.strokeStyle='rgba(110,125,115,0.7)'; ctx.lineWidth=1.4;
    var py=[ [x+34,y-24],[x+72,y-30],[W-6,y-34] ];
    for(var i=0;i<py.length;i++){ var p=py[i];
      ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(p[0],p[1]+30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(p[0]-6,p[1]+6); ctx.lineTo(p[0]+6,p[1]+6); ctx.stroke(); }
    ctx.strokeStyle='rgba(90,105,95,0.55)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x+8,y-22); ctx.lineTo(py[0][0],py[0][1]+4);
    for(var j=1;j<py.length;j++) ctx.lineTo(py[j][0],py[j][1]+4); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('SUBSTATION',x,y+34);
  }
  function exportPulses(pts,speed,out,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+out*6));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,'rgba(120,200,235,0.6)'); ctx.fillStyle='rgba(150,225,255,0.95)'; ctx.beginPath(); ctx.arc(p[0],p[1],1.6,0,Math.PI*2); ctx.fill(); }
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ power',b:'+ green cert',c:'− O&M'};
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
    // slight wind gusting around the capacity factor for the spin/sparkline
    var cfVis=Math.max(0.02,Math.min(1, cf*(0.9+0.16*Math.sin(T*0.025))));
    // how many turbines are lit grows with capacity (MW)
    var norm=(mw-E.mwMin)/Math.max(1,(E.mwMax-E.mwMin));
    var liveCount=Math.max(3,Math.round(NTURB*(0.28+0.72*Math.max(0,Math.min(1,norm)))));
    var outVis=Math.max(0.04,Math.min(1, cfVis));   // output intensity

    ctx.clearRect(0,0,W,H);
    drawMap();

    // turbines (lit ones spin; unlit are faint/idle)
    TURBS.forEach(function(tu,i){
      var on=i<liveCount;
      ctx.save(); if(!on) ctx.globalAlpha=0.28;
      turbine(tu, on?cfVis:0.05, on?outVis:0);
      ctx.restore();
    });

    substation(outVis);

    // export pulses from each lit turbine toward the substation, then out the line
    TURBS.slice(0,liveCount).forEach(function(tu){
      exportPulses([[tu.x,tu.y-30*tu.scale],[SUB.x-20,SUB.y]],0.7+outVis,outVis*0.7,false);
    });
    exportPulses([[SUB.x+8,SUB.y-22],[SUB.x+34,SUB.y-20],[SUB.x+72,SUB.y-26],[W-6,SUB.y-30]],1.0+outVis,outVis,false);

    // repowering / new-phase marker
    if(G.growing && liveCount<NTURB){
      var nxt=TURBS[Math.min(NTURB-1,liveCount)];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ NEW PHASE',nxt.x,nxt.y-58*nxt.scale); ctx.restore();
        glow(nxt.x,nxt.y-46*nxt.scale,9,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    }

    // ---- economics (renewable generation with a contracted floor) ----
    var mwh=mw*8760*cf;
    var grossRev=mwh*price;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));        // floor = CfD/PPA contracted revenue (price-risk removed)
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var opex= mw*(E.omPerMW||0)*1000 + mwh*(E.varCost||0) + (E.fixedOM||0)*1e6;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is a fixed contracted top-up (green cert / fixed price) vs spot power
    var contracted = revenue>grossRev+1;   // floor is biting
    var fixShare=Math.max(0.08,Math.min(0.55, contracted?(revenue-grossRev)/revenue+0.12:0.12));
    var c_om=mw*(E.omPerMW||0)*1000, c_land=c_om*0.18, c_grid=c_om*0.16, c_admin=c_om*0.12;
    var c_servicing=Math.max(0,opex-c_land-c_grid-c_admin);

    if(_anim){
      var lit=TURBS.slice(0,Math.max(1,liveCount));
      if(lit.length && Math.random()<0.62){ var s1=lit[(Math.random()*lit.length)|0]; spawnCoin(s1.x,s1.y-46*s1.scale, Math.random()<fixShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.5, opex/Math.max(1,revenue)));
      if(lit.length && Math.random()<Math.max(0.06,outRate)){ var s2=lit[(Math.random()*lit.length)|0]; spawnCoin(s2.x,s2.y, 'cost',1); }
      demHist.push(cfVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(cfVis);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+Math.round(mw)+' MW',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',Math.round(mw)+' MW'); set('ixSpreadV',CUR+Math.round(price)+'/MWh'); set('ixAvailV',Math.round(cf*100)+'%');
    set('ixDir',Math.round(mw)+' MW'); set('ixDirS',(G.contracted?'contracted':'merchant')+' · '+(E.contracted||''));
    set('ixMW',gwh(mwh)+'/yr'); set('ixMWs',Math.round(cf*100)+'% capacity factor');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Turbine O&amp;M',c_servicing],['Land &amp; lease',c_land],['Grid charges',c_grid],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the margin is too thin to value, raise the power price or the capacity factor, or lower the net build cost.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Total build</span> <b>'+money(capexGrossG)+'</b></span>'+
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is generation (capacity × hours × capacity factor) × power price (with a floor for any CfD/PPA contracted revenue) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'markbygden');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
