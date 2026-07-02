/* Anaerobic digestion, data-driven worked examples.
   Six real biogas / biomethane businesses, one template. Scene config from
   ad-geo.js (GEO), drawn as a top-down / elevation anaerobic-digestion plant in
   720x520 scene coords: digester tanks with breathing gas-holder domes, a
   feedstock reception, a gas-upgrading skid and a grid-injection point (or a CHP
   engine), and a digestate store. This is a production + incentive business:
   revenue is biomethane produced (capacity × hours × load factor) × an
   incentive-rich price, plus a gate fee for accepting feedstock, against the
   cost of feedstock and parasitic load, and the returns model is a simplified
   DCF. The green incentive (GGSS/RHI, LCFS/RIN/45Z) does most of the work in the
   price; a contracted/incentive-backed floor underpins it. */
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

  /* ---------- 1 · UK BIOMETHANE-TO-GRID (Europe · GGSS/RHI food & crop AD) ---------- */
  ukbio:{
    name:'UK biomethane-to-grid', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'ukbio',
    lede:'A UK <b>anaerobic-digestion</b> plant that digests food waste and energy crops into biogas, upgrades it to <b>biomethane</b> and injects it into the gas grid: a decarbonised-gas business built on a <b>green-gas incentive</b>.',
    s1:'<p class="body"><b>Anaerobic digestion</b> takes organic feedstock (food waste, farm slurry, energy crops) and lets microbes break it down in sealed, oxygen-free <b>digester tanks</b> to make <b>biogas</b> (mostly methane and CO₂). The gas is cleaned and upgraded in a <b>gas-upgrading skid</b> to pipeline-quality <b>biomethane</b>, then injected into the gas grid; the leftover <b>digestate</b> is sold as fertiliser. A UK plant like this runs baseload, all year.</p>'+
       '<p class="body">The economics are those of a <b>production + incentive</b> business rather than a network: it sells biomethane per MWh at the gas price <b>plus a green incentive</b> (the UK\'s Green Gas Support Scheme, formerly the RHI), which does most of the work in the price. On top of that it earns a <b>gate fee</b> for accepting waste feedstock and a little from digestate. The dominant cost is the <b>feedstock</b> and the parasitic power to run the plant. The whole return leans on the incentive holding, and on a secure, affordable feedstock supply.</p>',
    facts:[['Biomethane','Output','injected to grid'],['GGSS / RHI','Price','gas + green incentive'],['Gate fee','+ revenue','for taking waste'],['Feedstock','Main cost','food + crops'],['Baseload','Run profile','~85% load factor'],['Digestate','By-product','fertiliser sold']],
    s2:'Watch the plant. <b>Feedstock</b> is tipped at the reception and fed into the sealed <b>digester tanks</b>, whose green gas-holder domes gently breathe as biogas builds; bubbles rise inside with the <b>load factor</b>. The gas is upgraded and <b>injected into the gas grid</b> (green/amber pulses), while a digestate tanker leaves. Green <b style="color:#0c8a57">+biomethane</b> and amber <b style="color:#c0902f">+gate/digestate</b> orbs rise; red <b style="color:#bc4733">−feedstock</b> drains. Drag the capacity, the price+incentive and the load factor.',
    driverLab:'Price + incentive', availLab:'Load factor', hrK:'Biomethane + gate', yrS:'production × incentive',
    ledge:{a:'+ biomethane',b:'+ gate/digest',c:'− feedstock'}, demandLabel:'LOAD FACTOR',
    preset:'Load UK biomethane',
    try:'<b>Try this:</b> drop the <b>price + incentive</b> slider and watch the economics go thin almost at once. Most of that price is the green incentive, not the raw gas, so the GGSS/RHI is what makes the plant bankable. Then drop the load factor: AD wants to run flat-out baseload, and idle digesters still cost feedstock and O&amp;M. Feedstock cost and incentive support are the two swing factors.',
    s3:'A UK AD plant sells <b>biomethane per MWh</b> at the gas price plus a <b>green incentive</b>, plus a <b>gate fee</b> for accepting waste and a little digestate value. The margin is what is left after <b>feedstock</b> and the parasitic power to run the plant. Because the incentive supplies most of the price, the asset is genuinely incentive-dependent; the contracted/incentive-backed <b>floor</b> is what makes the cash flow financeable. The levers are the incentive, the feedstock cost and supply, and how hard the plant runs.',
    mb:{tag:'Model A · subsidy-backed processor', title:'Biomethane-to-grid AD plant', body:'A plant that digests food and crops into biogas, upgrades it to biomethane and injects it to the grid, paid the gas price plus a green incentive (GGSS/RHI), plus a gate fee for the waste, against feedstock cost. <b>This is UK biomethane-to-grid AD</b>, incentive-backed and baseload.'},
    s4a:'The dominant cost is the <b>feedstock</b> (buying or contracting food waste and energy crops), plus the <b>parasitic power</b> to run the digesters and upgrading, and fixed O&amp;M. Feedstock is a real, swinging cost (unlike a heat network\'s near-free waste heat), so the margin is meaningfully thinner than energy-from-waste, and feedstock price and supply are the operational risk.',
    wfNote:'Operating cost is feedstock (the big one), the parasitic power to run the plant, and O&amp;M. The margin is biomethane plus the green incentive plus a gate fee, less feedstock, and the floor reflects the incentive-backed contracted minimum.',
    s4b:'The capital is the <b>digester tanks</b>, the <b>gas-upgrading skid</b> and the <b>grid-injection</b> connection, typically a few million per MW-equivalent of capacity. Some build attracts a capital grant; the forward capital is more digesters and feedstock contracts. The return is an incentive-backed, mid-teen-life production asset, compounding as new plants are added.',
    stackH:'The capital · digesters + upgrading + grid', splitL:'Financing', splitR:'incentive-backed',
    split:[['s1',58,'Project / green debt'],['s2',42,'Sponsor equity']],
    finList:[['','Output','biomethane to grid'],['sub','Price','gas + green incentive (GGSS/RHI)'],['','+ revenue','gate fee + digestate'],['sub','Main cost','feedstock + parasitic power'],['','Run profile','baseload'],['rest','Driver','incentive + feedstock supply']],
    finNote:'A UK biomethane plant is an <b>incentive-backed production asset</b>: gas plus a green incentive plus a gate fee, less a real feedstock cost. The returns are decent but the risks are concentrated: the durability of the incentive, and the price and supply of feedstock.',
    timeline:[['2014','<b>RHI</b> supports the first wave of UK biomethane-to-grid plants.'],['2010s','<b>Food-waste &amp; crop AD</b> scales across the UK.'],['2021','<b>RHI closes</b> to new entrants and a gap opens.'],['2021','<b>GGSS</b> launches: a new tariff for green-gas injection.'],['2020s','<b>Feedstock security</b> becomes the binding constraint.'],['Ongoing','<b>Decarbonised gas</b> thesis drives new build.']],
    calcNote:'A working model of a <b>biomethane-to-grid AD plant</b>. Revenue is biomethane produced (capacity × hours × load factor) × an incentive-rich price, plus a gate fee; the margin is what is left after feedstock and parasitic power. A floor models the incentive-backed contracted minimum.',
    s6:'UK biomethane is incentive-backed decarbonised gas. What drives it:',
    breakers:['<b>The green incentive</b>: GGSS/RHI supplies most of the price; its durability carries the thesis.','<b>Feedstock cost &amp; supply</b> is the principal cost and the binding constraint on the plant.','<b>Load factor</b>: AD wants to run flat-out baseload, and an idle digester still burns feedstock and O&amp;M.','<b>Gate fee &amp; digestate</b>: taking waste and selling fertiliser add to a thin energy margin.'],
    src:'Figures are illustrative for a UK biomethane-to-grid AD plant under the <a href="https://www.ofgem.gov.uk/environmental-and-social-schemes/green-gas-support-scheme-ggss" target="_blank" rel="noopener">Green Gas Support Scheme</a> (formerly the RHI). All figures here are approximate and illustrative.',
    econ:{cur:'£', feedstock:'food + crop', output:'biomethane',
      gwhDef:120,gwhMin:40,gwhMax:320,gwhStep:5, priceDef:92,priceMin:45,priceMax:150,priceStep:1,
      lfDef:88,lfMin:55,lfMax:96,lfStep:1, gatePerMWh:14, feedPerMWh:29, fixedOM:2.3},
    calc:{build:56,grant:6,capex:10,revG:2,floor:8,cap:60,tax:25,exit:9.5,lev:4,rd:6,amort:4,hold:14},
    map:{footer:GEO.ukbio.footer}
  },

  /* ---------- 2 · US RNG (North America · dairy / landfill renewable natural gas) ---------- */
  usrng:{
    name:'US renewable natural gas (RNG)', geo:'United States', continent:'North America', cur:'US$', geoKey:'usrng',
    lede:'<b>Renewable natural gas</b>, biomethane from dairy manure and landfill gas, injected to the US pipeline and monetised through stacked <b>environmental credits</b> (LCFS, RINs, 45Z) that dwarf the raw gas value.',
    s1:'<p class="body"><b>Renewable natural gas (RNG)</b> is biomethane captured from dairy manure digesters or landfill gas, cleaned to pipeline spec and injected into the US gas grid. Physically it is identical to fossil gas; commercially it is something else entirely, because it carries <b>environmental attributes</b> that can be sold separately.</p>'+
       '<p class="body">The economics are a <b>production + incentive</b> business taken to the extreme: the gas itself is worth a few dollars, but a dairy RNG molecule can earn <b>California LCFS credits</b>, federal <b>RINs</b> (the RFS programme) and now the <b>45Z</b> clean-fuel tax credit on top: a stacked incentive that makes up the overwhelming majority of the price. A gate-fee-like avoided-cost and the avoided methane are part of the story. The cost is the digester feedstock (manure is cheap, but logistics are not) and parasitic load. This is the most <b>incentive-dependent</b> asset on the page, and the credit prices are volatile.</p>',
    facts:[['RNG','Output','pipeline biomethane'],['LCFS+RIN+45Z','Price','stacked credits'],['Dairy / landfill','Feedstock','low-cost methane'],['Credit-led','Economics','gas is a rounding error'],['Volatile','Risk','credit prices swing'],['Avoided CH₄','Driver','methane abatement']],
    s2:'Watch the plant. <b>Manure / landfill feedstock</b> is fed into the sealed <b>digesters</b>, whose green domes breathe as biogas builds; bubbles rise with the <b>load factor</b>. The gas is upgraded and <b>injected to the pipeline</b> (green/amber pulses), a digestate tanker leaves. The green <b style="color:#0c8a57">+biomethane</b> orbs are mostly <b>credits</b>, not gas; amber <b style="color:#c0902f">+gate</b> rise; red <b style="color:#bc4733">−feedstock</b> drains. Drag the capacity, the price+credits and the load factor.',
    driverLab:'Price + credits', availLab:'Load factor', hrK:'RNG + credits', yrS:'production × stacked credits',
    ledge:{a:'+ RNG/credit',b:'+ gate value',c:'− feedstock'}, demandLabel:'LOAD FACTOR',
    preset:'Load US RNG',
    try:'<b>Try this:</b> pull the <b>price + credits</b> slider down to the gas-only end and watch the economics collapse, because the gas is a rounding error and the <b>stacked credits</b> (LCFS, RINs, 45Z) are essentially the whole price. That is the RNG thesis and the RNG risk: the credit markets are volatile and policy-set. Feedstock logistics and load factor are the operational levers.',
    s3:'A US RNG project sells biomethane at a few dollars of gas <b>plus a stack of environmental credits</b>, LCFS, RINs and 45Z, that make up the overwhelming majority of the revenue. The cost is feedstock logistics (manure is cheap; collecting it is not) and parasitic load. The asset is therefore almost pure incentive: extraordinarily profitable when credits are high, thin when they fall. The contracted floor reflects offtake and any fixed-price credit sales; credit-market volatility overshadows every other risk.',
    mb:{tag:'Model A · subsidy-backed processor', title:'Dairy / landfill RNG project', body:'A digester that turns manure or landfill gas into pipeline biomethane, paid a few dollars of gas plus a stack of environmental credits (LCFS, RINs, 45Z) that dwarf it, against cheap but logistically costly feedstock. <b>This is US RNG</b>, credit-led and volatile.'},
    s4a:'Costs are led by the <b>feedstock and its logistics</b> (manure is nearly free at the farm but expensive to aggregate and digest), plus parasitic power and O&amp;M. Against that sits a price that is mostly <b>credits</b>, so the margin can be very wide when credit prices are high; the swing factor is the credit market rather than the cost base.',
    wfNote:'Operating cost is feedstock logistics, parasitic power and O&amp;M. The margin is gas plus a stack of environmental credits (LCFS/RIN/45Z), less feedstock, overwhelmingly driven by credit prices, which the floor only partly contracts.',
    s4b:'The capital is the dairy or landfill <b>digesters</b>, the <b>upgrading skid</b> and the <b>pipeline interconnect</b>, built per project, often with developer or strategic capital. The forward capital is more farm digesters and gathering. The return is high but credit-exposed; many projects sell forward to lock part of the credit stack.',
    stackH:'The capital · digesters + upgrading + interconnect', splitL:'Financing', splitR:'developer-backed',
    split:[['s1',50,'Project debt'],['s2',50,'Developer / strategic equity']],
    finList:[['','Output','pipeline RNG (biomethane)'],['sub','Price','gas + LCFS + RIN + 45Z'],['','Feedstock','dairy manure / landfill gas'],['sub','Main cost','feedstock logistics + parasitic'],['','Economics','credit-led'],['rest','Risk','credit-price volatility']],
    finNote:'US RNG is the <b>purest incentive asset</b> here: the gas is a rounding error and stacked credits are the price. Returns can be exceptional, but the credit markets are volatile and policy-set; that, alongside feedstock logistics, is the risk.',
    timeline:[['2011','<b>RIN pathways</b> open RNG to the federal RFS programme.'],['2010s','<b>California LCFS</b> makes dairy RNG extraordinarily valuable.'],['2020s','<b>Strategics &amp; majors</b> acquire RNG developers at scale.'],['2023','<b>Archaea-style platforms</b> consolidate landfill RNG.'],['2025','<b>45Z</b> clean-fuel credit adds to the stack.'],['Ongoing','<b>Credit-price volatility</b> drives the returns.']],
    calcNote:'A working model of a <b>dairy / landfill RNG project</b>, in US$. Revenue is RNG produced × a credit-rich price (gas + LCFS + RIN + 45Z); the margin is what survives feedstock logistics and parasitic load. The floor models contracted / fixed-price credit sales.',
    s6:'US RNG is credit-led decarbonised gas: high return, high credit risk. What drives it:',
    breakers:['<b>The credit stack</b>: LCFS, RINs and 45Z are almost the entire price; their level and durability are everything.','<b>Credit-price volatility</b>. The markets swing hard, so part of the stack is sold forward.','<b>Feedstock logistics</b>: manure is cheap but aggregating and digesting it is not.','<b>Methane abatement</b> is the underlying environmental driver: capturing dairy/landfill methane.'],
    src:'Figures are illustrative for a US RNG project monetising LCFS, RINs and the 45Z clean-fuel credit (the model of platforms such as Archaea/RNG developers). All figures here are approximate and illustrative.',
    econ:{cur:'US$', feedstock:'dairy + landfill', output:'biomethane',
      gwhDef:90,gwhMin:30,gwhMax:240,gwhStep:5, priceDef:135,priceMin:50,priceMax:240,priceStep:1,
      lfDef:85,lfMin:50,lfMax:95,lfStep:1, gatePerMWh:8, feedPerMWh:31, fixedOM:2.1},
    calc:{build:64,grant:7,capex:10,revG:3,floor:8,cap:80,tax:25,exit:9.5,lev:4,rd:6.5,amort:4,hold:13},
    map:{footer:GEO.usrng.footer}
  },

  /* ---------- 3 · BRAZILIAN AGRI-BIOGAS (South America · vinasse / agri) ---------- */
  brbio:{
    name:'Brazilian agri-biogas', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'brbio',
    lede:'Brazil\'s vast sugar-and-ethanol sector throws off <b>vinasse and bagasse</b>, and a wave of <b>agri-biogas</b> plants now digests that residue into biomethane and turns an effluent into decarbonised gas.',
    s1:'<p class="body">Brazil produces enormous volumes of agricultural residue: <b>vinasse</b> (the liquid effluent from ethanol distillation), filter cake and bagasse from sugarcane, plus livestock and crop waste. Left alone these are a disposal problem; digested in <b>anaerobic digesters</b> they become <b>biogas</b> that is upgraded to biomethane for the grid or burned in a CHP engine, with the digestate returned to the cane fields as fertiliser.</p>'+
       '<p class="body">The economics are the familiar <b>production + incentive</b> shape, in an emerging market. The plant sells biomethane (or power) at a price supported by Brazil\'s <b>decarbonisation programmes</b> (RenovaBio CBIO credits and biomethane offtake), and avoids the cost of disposing the effluent (an embedded gate value). Feedstock is cheap and on-site at the mill, which helps the margin; but the whole return is carried at an <b>emerging-market</b> discount rate, in reais.</p>',
    facts:[['Vinasse / agri','Feedstock','on-site at the mill'],['Biomethane','Output','grid / CHP'],['RenovaBio','Incentive','CBIO credits'],['On-site','Feedstock cost','low, a residue'],['EM rate','Discount','reais, local rates'],['Effluent → gas','Driver','waste valorisation']],
    s2:'Watch the plant. <b>Vinasse and cane residue</b> feed the sealed <b>digesters</b> next to the mill; their green domes breathe as biogas builds and bubbles rise with the <b>load factor</b>. The gas is upgraded to biomethane (green/amber pulses) or burned in a CHP engine; digestate returns to the fields. Green <b style="color:#0c8a57">+biomethane</b> and amber <b style="color:#c0902f">+gate/digestate</b> rise; red <b style="color:#bc4733">−feedstock</b> drains. Drag the capacity, the price+incentive and the load factor, at an EM discount rate.',
    driverLab:'Price + incentive', availLab:'Load factor', hrK:'Biomethane + gate', yrS:'production × incentive',
    ledge:{a:'+ biomethane',b:'+ gate/digest',c:'− feedstock'}, demandLabel:'LOAD FACTOR',
    preset:'Load Brazil agri-biogas',
    try:'<b>Try this:</b> feedstock is a cheap on-site residue here, so the margin starts healthy; push the price+incentive to see RenovaBio and the gas value compound. But the whole return is at an <b>EM discount rate</b>: raise the cost of debt and watch a solid plant net down once discounted like a Brazilian asset. The reais cost of capital, not the plant, is the investor question.',
    s3:'A Brazilian agri-biogas plant digests vinasse and cane residue into <b>biomethane</b> (or power), sold at a price supported by RenovaBio CBIO credits and biomethane offtake, while avoiding the cost of disposing the effluent. Feedstock is cheap and on-site, which keeps the margin healthy. The investor question is less the asset than the <b>discount rate</b>: local reais rates and currency, and the pace at which the market and the incentive regime develop.',
    mb:{tag:'Model A · subsidy-backed processor', title:'Agri-biogas plant (EM)', body:'A digester beside a sugar-ethanol mill that turns vinasse and cane residue into biomethane (or power), paid the gas/power value plus RenovaBio credits and an embedded effluent-disposal saving, against cheap on-site feedstock, at an emerging-market discount rate. <b>This is Brazilian agri-biogas</b>.'},
    s4a:'<b>Feedstock and parasitic load</b> still lead the costs, but the feedstock is a cheap on-site residue, so the cost base is light and the margin healthy. Plant O&amp;M is modest. The structural feature is the incentive regime (RenovaBio) and the avoided cost of effluent disposal, carried in reais.',
    wfNote:'Operating cost is feedstock handling, parasitic power and O&amp;M, all light because the feedstock is an on-site residue. The margin is biomethane plus RenovaBio incentive plus an embedded gate value, less a low feedstock cost.',
    s4b:'The capital is the <b>digesters</b>, the <b>upgrading skid</b> (or CHP engine) and the interconnect, sited at the mill. Modelled on an enterprise-value basis, the return is carried at <b>local rates and currency</b>, in a developing but fast-growing market where the discount rate and the incentive regime do most of the work.',
    stackH:'The capital · digesters + upgrading', splitL:'Financing', splitR:'EM',
    split:[['s1',52,'Local / project debt'],['s2',48,'Mill / operator equity']],
    finList:[['','Feedstock','vinasse + cane residue (on-site)'],['sub','Output','biomethane / CHP'],['','Incentive','RenovaBio (CBIO)'],['sub','Gate value','avoided effluent disposal'],['','Discount rate','EM (reais)'],['rest','Driver','waste valorisation + market growth']],
    finNote:'A Brazilian agri-biogas plant is a <b>cheap-feedstock production asset at an EM discount rate</b>: a healthy margin on an on-site residue, supported by RenovaBio. The whole investment debate turns on the <b>discount rate</b>, the currency and the pace of market and incentive development.',
    timeline:[['2017','<b>RenovaBio</b>, Brazil\'s biofuels decarbonisation policy, launched.'],['2010s','<b>Vinasse biogas</b> pilots at sugar-ethanol mills.'],['2020s','<b>Biomethane offtake</b> and CBIO credits scale the model.'],['2020s','<b>Agri-biogas wave</b> across the cane belt.'],['Periodic','<b>CBIO prices</b> reset the incentive value.'],['Long-term','<b>Market growth</b> as residue valorisation spreads.']],
    calcNote:'A working model of a <b>Brazilian agri-biogas plant</b>, in reais and on an enterprise-value basis. Revenue is biomethane produced × an incentive-supported price plus a gate value; the margin is healthy on cheap on-site feedstock. The cost of debt is high to reflect EM rates.',
    s6:'Brazilian agri-biogas is cheap-feedstock decarbonised gas at an EM rate. What drives it:',
    breakers:['<b>On-site feedstock</b>: a cheap residue at the mill keeps the cost base light and the margin healthy.','<b>The incentive regime</b>: RenovaBio CBIO credits and biomethane offtake support the price.','<b>Country &amp; currency</b>. Local reais rates set the discount rate and most of the return.','<b>
    src:'Figures are illustrative for a Brazilian agri-biogas plant under <a href="https://www.gov.br/" target="_blank" rel="noopener">RenovaBio</a>. The flag and example are illustrative; all figures here are approximate and illustrative.',
    econ:{cur:'R$', feedstock:'vinasse + agri', output:'biomethane',
      gwhDef:80,gwhMin:25,gwhMax:200,gwhStep:5, priceDef:90,priceMin:45,priceMax:150,priceStep:1,
      lfDef:84,lfMin:50,lfMax:94,lfStep:1, gatePerMWh:12, feedPerMWh:24, fixedOM:1.6},
    calc:{build:38,grant:4,capex:10,revG:4,floor:6,cap:55,tax:30,exit:9,lev:4,rd:9,amort:4,hold:14},
    map:{footer:GEO.brbio.footer}
  },

  /* ---------- 4 · AUSTRALIAN FOOD-WASTE AD (Oceania · emerging organics) ---------- */
  ausfw:{
    name:'Australian food-waste AD', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'ausfw',
    lede:'Australia is rolling out <b>organics diversion</b> from landfill, and a new wave of <b>food-waste anaerobic digestion</b> plants now turn separated food and green waste into biogas and renewable power.',
    s1:'<p class="body">Australian states are mandating <b>organics diversion</b>, separating food and garden waste out of landfill, which creates a feedstock stream looking for a home. <b>Anaerobic digestion</b> is the answer: separated food waste is digested in sealed tanks to make <b>biogas</b>, which is usually burned in a <b>CHP engine</b> to make renewable electricity and heat, with the digestate used as a soil improver.</p>'+
       '<p class="body">The economics are a <b>production + incentive</b> business in an early-stage market. The plant earns a <b>gate fee</b> for accepting the food waste (often the largest single line, because councils pay to divert it from landfill), sells the <b>power</b> generated, and captures renewable certificates (LGCs) and avoided landfill emissions. Feedstock and parasitic load are the cost. It is emerging in Australia, so the volumes are modest and the contracts, gate fees and power offtake, are what make it bankable.</p>',
    facts:[['Food waste','Feedstock','diverted from landfill'],['CHP power','Output','renewable electricity'],['Gate fee','Big revenue','councils pay to divert'],['LGCs','Incentive','renewable certificates'],['Emerging','Market','organics mandates'],['Digestate','By-product','soil improver']],
    s2:'Watch the plant. A truck tips <b>food waste</b> at the reception; it feeds the sealed <b>digesters</b>, whose green domes breathe as biogas builds and bubbles rise with the <b>load factor</b>. The biogas runs a <b>CHP engine</b> making renewable power; digestate leaves by tanker. Green <b style="color:#0c8a57">+power</b> and amber <b style="color:#c0902f">+gate/digestate</b> orbs rise, the gate fee is large here; red <b style="color:#bc4733">−feedstock</b> drains. Drag the capacity, the price+incentive and the load factor.',
    driverLab:'Price + incentive', availLab:'Load factor', hrK:'Power + gate', yrS:'production × incentive',
    ledge:{a:'+ power',b:'+ gate/digest',c:'− feedstock'}, demandLabel:'LOAD FACTOR',
    preset:'Load Australian AD',
    try:'<b>Try this:</b> here the <b>gate fee</b> is unusually important, councils pay to divert food waste from landfill, so accepting waste is itself a revenue. Push the price+incentive (power + LGCs) to see the energy side; but notice the plant leans on the gate fee and the offtake contracts as much as the energy. Feedstock supply and contract durability are the swing factors in a young market.',
    s3:'An Australian food-waste AD plant earns a <b>gate fee</b> for taking diverted food waste (often the largest line), sells the <b>renewable power</b> from its CHP engine, and captures LGCs and avoided landfill emissions, against the cost of feedstock and parasitic load. In an emerging market the volumes are modest and the economics lean on the <b>contracts</b>, the gate fees and the power offtake, which the floor models. The levers are feedstock supply, the gate fee and how hard the engine runs.',
    mb:{tag:'Model A · subsidy-backed processor', title:'Food-waste AD with CHP', body:'A digester that takes food waste diverted from landfill, earning a gate fee plus renewable power and certificates from a CHP engine, against feedstock cost. In an early-stage market the gate fee and offtake contracts carry the return. <b>This is Australian food-waste AD</b>.'},
    s4a:'The dominant cost is the <b>feedstock handling and parasitic load</b>; against it, the gate fee for accepting waste is a large positive, so the net cost of feedstock can be modest. Plant O&amp;M and the CHP engine maintenance are the rest. In a young market the contracts, not the cost base, are the binding feature.',
    wfNote:'Operating cost is feedstock handling, parasitic power and CHP O&amp;M. The margin is renewable power plus certificates plus a large gate fee, less feedstock, and in an emerging market the gate fee and offtake contracts, modelled by the floor, carry the cash flow.',
    s4b:'The capital is the <b>reception and digesters</b>, the <b>CHP engine</b> and the grid connection, a modest plant for an emerging market. The forward capital is more plants as more councils mandate diversion. The return is contract-backed but young-market, so execution and feedstock security are the risks.',
    stackH:'The capital · reception + digesters + CHP', splitL:'Financing', splitR:'contract-backed',
    split:[['s1',50,'Project debt'],['s2',50,'Sponsor equity']],
    finList:[['','Feedstock','food waste (diverted)'],['sub','Output','renewable power (CHP)'],['','Big revenue','gate fee'],['sub','Incentive','LGCs + avoided landfill'],['','Market','emerging (organics mandates)'],['rest','Driver','diversion policy + contracts']],
    finNote:'An Australian food-waste AD plant is a <b>contract-backed processor in a young market</b>: a large gate fee plus renewable power and certificates, against feedstock cost. The returns lean on the gate fees and offtake contracts; feedstock security and execution are the risks.',
    timeline:[['2010s','<b>State organics targets</b> begin diverting food waste from landfill.'],['2020s','<b>FOGO collections</b> create separated food-waste feedstock.'],['2020s','<b>Food-waste AD plants</b> open with CHP engines.'],['2020s','<b>Gate fees &amp; LGCs</b> underpin the early projects.'],['Ongoing','<b>Landfill levies</b> rise, improving the gate fee.'],['Long-term','<b>Mandated diversion</b> scales the feedstock.']],
    calcNote:'A working model of an <b>Australian food-waste AD plant with CHP</b>, in A$. Revenue is renewable power produced × an incentive price plus a large gate fee; the margin is what is left after feedstock and parasitic load. A floor models the gate-fee and offtake contracts.',
    s6:'Australian food-waste AD is a contract-backed processor in a young market. What drives it:',
    breakers:['<b>The gate fee</b>, councils pay to divert food waste, so accepting it is itself a large revenue.','<b>Power &amp; certificates</b>, the CHP engine\'s renewable power plus LGCs is the energy side.','<b>Feedstock security</b>, a young market means feedstock supply and contracts are the binding risk.','<b>Diversion policy</b>, landfill levies and organics mandates drive the feedstock and the gate fee.'],
    src:'Figures are illustrative for an emerging Australian food-waste anaerobic-digestion plant with CHP. All figures here are approximate and illustrative.',
    econ:{cur:'A$', feedstock:'food waste', output:'chp',
      gwhDef:55,gwhMin:18,gwhMax:150,gwhStep:5, priceDef:95,priceMin:50,priceMax:160,priceStep:1,
      lfDef:82,lfMin:48,lfMax:92,lfStep:1, gatePerMWh:30, feedPerMWh:31, fixedOM:1.5},
    calc:{build:34,grant:4,capex:10,revG:3.5,floor:6,cap:42,tax:30,exit:9.5,lev:4,rd:6.5,amort:4,hold:15},
    map:{footer:GEO.ausfw.footer}
  },

  /* ---------- 5 · GULF FOOD-WASTE AD (Middle East · emerging diversion) ---------- */
  gulffw:{
    name:'Gulf food-waste AD', geo:'Gulf / GCC', continent:'Middle East', cur:'AED', geoKey:'gulffw',
    lede:'The Gulf generates huge volumes of food waste and is beginning to <b>divert it from landfill</b>, early <b>anaerobic-digestion</b> plants now turn that waste into biogas and renewable power under new diversion mandates.',
    s1:'<p class="body">Gulf cities produce some of the world\'s highest food waste per head, almost all of it landfilled. New <b>waste-diversion mandates</b> and net-zero commitments are starting to change that, and <b>anaerobic digestion</b> is a natural fit: separated food waste is digested into <b>biogas</b>, burned in a <b>CHP engine</b> for renewable power (and sometimes cooling), with the digestate used on landscaping and agriculture.</p>'+
       '<p class="body">The economics are a <b>production + incentive</b> business at a very early stage. The plant earns a <b>gate fee</b> for accepting the waste, central to the model where landfill is being priced or capped, sells the power, and benefits from the emirate\'s decarbonisation and diversion targets. Feedstock and parasitic load are the cost. It is emerging in the Gulf, so the project is small and the <b>contracts</b>, municipal gate fees and power offtake, are what make it bankable. The example flag is illustrative.</p>',
    facts:[['Food waste','Feedstock','diverted from landfill'],['CHP power','Output','renewable electricity'],['Gate fee','Core revenue','municipal diversion'],['Net-zero','Driver','emirate targets'],['Emerging','Market','very early-stage'],['Digestate','By-product','landscaping use']],
    s2:'Watch the plant. A truck tips <b>food waste</b> at the reception; it feeds the sealed <b>digesters</b>, whose green domes breathe as biogas builds and bubbles rise with the <b>load factor</b>. The biogas runs a <b>CHP engine</b> for renewable power; digestate leaves by tanker. Green <b style="color:#0c8a57">+power</b> and amber <b style="color:#c0902f">+gate/digestate</b> orbs rise, the gate fee is central here; red <b style="color:#bc4733">−feedstock</b> drains. Drag the capacity, the price+incentive and the load factor.',
    driverLab:'Price + incentive', availLab:'Load factor', hrK:'Power + gate', yrS:'production × incentive',
    ledge:{a:'+ power',b:'+ gate/digest',c:'− feedstock'}, demandLabel:'LOAD FACTOR',
    preset:'Load Gulf AD',
    try:'<b>Try this:</b> in a very young market the <b>gate fee</b> and the offtake contracts carry the project, accepting waste is the core revenue as landfill is priced. Push the price+incentive to see the power side, but notice the plant leans on the municipal contracts and the diversion mandate. Feedstock supply, contract durability and the discount rate are the swing factors here.',
    s3:'A Gulf food-waste AD plant earns a <b>gate fee</b> for accepting diverted food waste (central to the model as landfill is priced), sells the <b>renewable power</b> from its CHP engine, and benefits from the emirate\'s decarbonisation targets, against the cost of feedstock and parasitic load. At a very early stage the volumes are small and the economics lean on the <b>municipal contracts</b>, which the floor models. The levers are the gate fee, feedstock supply and the pace of the diversion mandate.',
    mb:{tag:'Model A · subsidy-backed processor', title:'Food-waste AD with CHP (emerging)', body:'A digester that takes food waste diverted from Gulf landfill, earning a gate fee plus renewable power from a CHP engine, against feedstock cost, under new net-zero and diversion mandates. The municipal contracts carry the early-stage return. <b>This is Gulf food-waste AD</b> (flag illustrative).'},
    s4a:'The dominant cost is the <b>feedstock handling and parasitic load</b>; against it, the gate fee for accepting waste is central, so the net feedstock cost can be modest. Plant and CHP O&amp;M are the rest. In a nascent market the municipal contracts, not the cost base, are the binding feature.',
    wfNote:'Operating cost is feedstock handling, parasitic power and CHP O&amp;M. The margin is renewable power plus a central gate fee, less feedstock, and in a very early market the gate fee and offtake contracts, modelled by the floor, carry the cash flow at an EM-tinged discount rate.',
    s4b:'The capital is the <b>reception and digesters</b>, the <b>CHP engine</b> and the connection, a small plant for an emerging market. The forward capital is more plants as diversion mandates spread across the GCC. The return is contract-backed but very young-market, carried at a discount rate that reflects an emerging regime.',
    stackH:'The capital · reception + digesters + CHP', splitL:'Financing', splitR:'contract-backed',
    split:[['s1',50,'Project debt'],['s2',50,'Sponsor equity']],
    finList:[['','Feedstock','food waste (diverted)'],['sub','Output','renewable power (CHP)'],['','Core revenue','gate fee'],['sub','Driver','net-zero / diversion mandate'],['','Market','very early-stage'],['rest','Risk','feedstock + contract durability']],
    finNote:'A Gulf food-waste AD plant is a <b>contract-backed processor in a nascent market</b>: a central gate fee plus renewable power, against feedstock cost, under new diversion mandates. The returns lean on the municipal contracts; feedstock security and the discount rate are the risks.',
    timeline:[['2020s','<b>Net-zero targets</b> set across Gulf states.'],['2020s','<b>Waste-diversion mandates</b> begin pricing landfill.'],['2020s','<b>Pilot AD plants</b> take separated food waste.'],['2020s','<b>Municipal gate fees</b> underpin early projects.'],['Ongoing','<b>Landfill caps</b> improve the gate fee.'],['Long-term','<b>Diversion scale-up</b> grows the feedstock.']],
    calcNote:'A working model of an <b>emerging Gulf food-waste AD plant with CHP</b>, in AED and on an enterprise-value basis. Revenue is renewable power × an incentive price plus a central gate fee; the margin is what is left after feedstock and parasitic load. A floor models the municipal contracts.',
    s6:'Gulf food-waste AD is a contract-backed processor in a nascent market. What drives it:',
    breakers:['<b>The gate fee</b>, accepting diverted waste is the core revenue as landfill is priced.','<b>Diversion mandates</b>, net-zero targets and landfill caps drive the feedstock and the gate fee.','<b>Contract durability</b>, a very young market means the municipal and offtake contracts are everything.','<b>Feedstock &amp; discount rate</b>, feedstock security and the cost of capital are the swing factors.'],
    src:'Figures are illustrative for an emerging Gulf food-waste anaerobic-digestion plant with CHP. The flag and example are illustrative; all figures here are approximate and illustrative.',
    econ:{cur:'AED', feedstock:'food waste', output:'chp',
      gwhDef:45,gwhMin:15,gwhMax:130,gwhStep:5, priceDef:88,priceMin:48,priceMax:155,priceStep:1,
      lfDef:80,lfMin:45,lfMax:92,lfStep:1, gatePerMWh:32, feedPerMWh:31, fixedOM:1.3},
    calc:{build:30,grant:3,capex:10,revG:4,floor:5,cap:40,tax:9,exit:9.5,lev:4,rd:7,amort:4,hold:14},
    map:{footer:GEO.gulffw.footer}
  },

  /* ---------- 6 · CHINESE LARGE-SCALE BIOGAS (China · agri / food-waste) ---------- */
  cnbio:{
    name:'Chinese large-scale biogas', geo:'China', continent:'China', cur:'¥', geoKey:'cnbio',
    lede:'China is building <b>biogas at industrial scale</b>, large agricultural and food-waste anaerobic-digestion plants that make biomethane and grid gas, backed by rural-energy and decarbonisation subsidies.',
    s1:'<p class="body">China has the world\'s largest biogas programme, scaling from village digesters to <b>large industrial plants</b> that digest livestock manure, crop straw and urban food waste. The biogas is upgraded to <b>biomethane</b> for the gas grid or for vehicles, or burned for power; the digestate returns to farmland. The scale is enormous and the plants are often state-linked or backed by large agribusiness.</p>'+
       '<p class="body">The economics are a <b>production + incentive</b> business at scale. The plant sells biomethane (or power) at a price supported by <b>rural-energy and decarbonisation subsidies</b> and a gate value for taking agricultural and food waste, against the cost of feedstock and parasitic load. A modest supported price applied to a very large plant is a large absolute cash flow, financed at a low <b>state-linked</b> cost of capital. Feedstock logistics across a wide collection area are the operational challenge.</p>',
    facts:[['Agri + food','Feedstock','manure · straw · food'],['Biomethane','Output','grid gas / power'],['Subsidy-backed','Price','rural-energy support'],['Industrial scale','Plant','large digesters'],['State-linked','Owner','low cost of capital'],['Decarbonising','Driver','rural + urban methane']],
    s2:'Watch the plant. <b>Manure, straw and food waste</b> feed the large sealed <b>digesters</b>, whose green domes breathe as biogas builds and bubbles rise with the <b>load factor</b>. The gas is upgraded to <b>biomethane</b> and injected to the grid (green/amber pulses); a digestate tanker leaves. At this scale even a modest supported <b style="color:#0c8a57">+biomethane</b> price is a large cash flow; amber <b style="color:#c0902f">+gate/digestate</b> rise; red <b style="color:#bc4733">−feedstock</b> drains. Drag the capacity, the price+incentive and the load factor.',
    driverLab:'Price + incentive', availLab:'Load factor', hrK:'Biomethane + gate', yrS:'production × incentive',
    ledge:{a:'+ biomethane',b:'+ gate/digest',c:'− feedstock'}, demandLabel:'LOAD FACTOR',
    preset:'Load China biogas',
    try:'<b>Try this:</b> push the <b>capacity</b>, at industrial scale even a modest subsidy-supported price is an enormous absolute cash flow, financed at a low state-linked cost of capital. The lever is <b>scale and feedstock logistics</b>, not price: collecting manure, straw and food waste across a wide area is the operational challenge. Drop the incentive to see how subsidy-dependent the unit economics still are.',
    s3:'A large Chinese biogas plant sells <b>biomethane</b> (or power) at a subsidy-supported price plus a gate value for taking agricultural and food waste, against the cost of feedstock and parasitic load. The lever is <b>scale and source</b>: a very large plant turns a modest supported price into a large absolute cash flow, financed at a low state-linked cost of capital. Feedstock logistics across a wide collection area and the durability of the rural-energy subsidy are the swing factors.',
    mb:{tag:'Model A · subsidy-backed processor', title:'Industrial-scale biogas plant', body:'A large state-linked digester that turns manure, straw and food waste into biomethane (or power), paid a subsidy-supported price plus a gate value, against feedstock and logistics, at industrial scale and a low cost of capital. <b>This is Chinese large-scale biogas</b>.'},
    s4a:'The dominant cost is the <b>feedstock and its logistics</b> across a wide collection area, plus parasitic power and O&amp;M at scale. The supported price is modest but applied to a very large plant it is a large, stable margin; aggregating and transporting feedstock is the operational challenge, and the subsidy regime sets the price.',
    wfNote:'Operating cost is feedstock and logistics, parasitic power and O&amp;M at industrial scale. The margin is biomethane plus a rural-energy subsidy plus a gate value, less feedstock, modest per unit, but vast in absolute terms given the plant size.',
    s4b:'The capital is the <b>large digesters</b>, the <b>upgrading skid</b> and the grid or vehicle-gas interconnect, major, long-life infrastructure. Financed at a low <b>state-linked</b> cost of capital, it compounds with rural and urban waste growth; the forward capital is more large plants and feedstock gathering.',
    stackH:'The capital · large digesters + upgrading', splitL:'Financing', splitR:'state-linked',
    split:[['s1',58,'State-linked / project debt'],['s2',42,'Operator / agribusiness equity']],
    finList:[['','Feedstock','manure · straw · food waste'],['sub','Output','biomethane / power'],['','Price','rural-energy subsidy supported'],['sub','Gate value','agri & food-waste intake'],['','Cost of capital','low (state-linked)'],['rest','Driver','scale + feedstock logistics']],
    finNote:'A Chinese large-scale biogas plant is a <b>modest-price, vast-scale subsidy-backed processor</b>: a supported price over a real feedstock cost, at industrial scale and a low cost of capital. The return is steady and large in absolute terms; feedstock logistics and the subsidy regime are the swing factors.',
    timeline:[['2000s','<b>Rural biogas</b> programme scales from village digesters.'],['2010s','<b>Large industrial plants</b> digest manure and food waste.'],['2015','<b>Biomethane-to-grid</b> and vehicle-gas pathways open.'],['2020s','<b>Rural-energy &amp; decarbonisation subsidies</b> back new build.'],['2060','<b>Carbon-neutrality</b> target drives methane capture.'],['Ongoing','<b>Feedstock logistics</b> remain the binding constraint.']],
    calcNote:'A working model of an <b>industrial-scale Chinese biogas plant</b>, in renminbi and on an enterprise-value basis. Revenue is biomethane produced × a subsidy-supported price plus a gate value; the margin is modest per unit but vast at scale. The cost of capital is low.',
    s6:'Chinese biogas is modest-price decarbonised gas at vast scale. What drives it:',
    breakers:['<b>Scale</b>, a modest supported price on a very large plant is a large absolute cash flow.','<b>Feedstock logistics</b>, aggregating manure, straw and food waste across a wide area is the challenge.','<b>The subsidy regime</b>, rural-energy and decarbonisation support sets the price.','<b>Cost of capital</b>, low state-linked funding supports the scale.'],
    src:'Figures are illustrative for a large-scale Chinese agricultural / food-waste biogas plant. Given the scale and limited standalone disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', feedstock:'manure + straw + food', output:'biomethane',
      gwhDef:180,gwhMin:60,gwhMax:420,gwhStep:10, priceDef:78,priceMin:40,priceMax:135,priceStep:1,
      lfDef:84,lfMin:50,lfMax:94,lfStep:1, gatePerMWh:10, feedPerMWh:24, fixedOM:3.2},
    calc:{build:82,grant:10,capex:10,revG:4,floor:10,cap:110,tax:25,exit:9,lev:5,rd:4.5,amort:4,hold:16},
    map:{footer:GEO.cnbio.footer}
  }
  };
  var ORDER=['ukbio','usrng','brbio','ausfw','gulffw','cnbio'];

  /* ===================================================================
     ANAEROBIC-DIGESTION PLANT RENDERER  (canvas, 720x520), elevation, daytime
     A feedstock reception (truck/tractor tips waste) feeds large digester tanks
     with breathing green gas-holder domes (bubbles rise with the load factor);
     the gas goes to a gas-upgrading skid and a grid-injection point (biomethane,
     green/amber pulses) OR a CHP engine; a digestate store / tanker leaves.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var GROUND=410;                  // ground line (elevation)
  var RECEP={x:118,y:GROUND};      // feedstock reception
  var DIG=[{x:300,y:GROUND,R:64},{x:430,y:GROUND,R:54}];  // digester tanks
  var SKID={x:540,y:GROUND};       // gas-upgrading skid
  var INJECT={x:640,y:GROUND};     // grid-injection / CHP

  /* ---- base map: sky + ground ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#dbe6ec'); g.addColorStop(0.62,'#e6ecdf'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // distant fields / hills
    ctx.fillStyle='rgba(150,180,140,0.18)';
    ctx.beginPath(); ctx.moveTo(0,GROUND-40); ctx.quadraticCurveTo(180,GROUND-78,360,GROUND-44); ctx.quadraticCurveTo(560,GROUND-72,W,GROUND-46); ctx.lineTo(W,GROUND); ctx.lineTo(0,GROUND); ctx.closePath(); ctx.fill();
    // ground
    var gg=ctx.createLinearGradient(0,GROUND,0,H); gg.addColorStop(0,'#cdd6c4'); gg.addColorStop(1,'#c2ccb8');
    ctx.fillStyle=gg; ctx.fillRect(0,GROUND,W,H-GROUND);
    // hardstanding apron
    ctx.fillStyle='rgba(150,160,150,0.22)'; rr(70,GROUND+4,W-110,70,6); ctx.fill();
    // pipe run along the ground connecting reception → digesters → skid → inject
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(RECEP.x+30,GROUND-14); ctx.lineTo(INJECT.x,GROUND-14); ctx.stroke();
  }

  /* ---- feedstock reception (truck/tractor tips waste, or a farm pile) ---- */
  function reception(feedFlow){
    var x=RECEP.x,y=RECEP.y, fs=GEO[A.geoKey].feedstock;
    // shadow
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x,y+2,46,7,0,0,Math.PI*2); ctx.fill();
    // reception bay / hopper
    ctx.fillStyle='#c2c8bf'; rr(x-44,y-30,58,30,3); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // feedstock pile colour by type
    var pile = (fs==='farm') ? '#8a6a3a' : (fs==='crop' ? '#7f9a3e' : (fs==='sewage' ? '#7a7150' : '#9a7a3c'));
    ctx.fillStyle=pile; ctx.beginPath(); ctx.moveTo(x-40,y); ctx.lineTo(x-26,y-18-3*feedFlow); ctx.lineTo(x-8,y); ctx.closePath(); ctx.fill();
    // a tipping truck/tractor cab
    ctx.fillStyle='#5f7264'; rr(x+16,y-22,28,22,3); ctx.fill();        // tipper body
    ctx.fillStyle='#4a5a4f'; rr(x+40,y-16,14,16,2); ctx.fill();        // cab
    ctx.fillStyle='rgba(40,50,45,0.8)'; ctx.beginPath(); ctx.arc(x+24,y+1,4,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(x+44,y+1,4,0,Math.PI*2); ctx.fill();
    // tipped feed dropping into hopper
    ctx.fillStyle=pile; for(var i=0;i<3;i++){ var t=((T*0.05+i/3)%1); ctx.globalAlpha=0.6*(1-t); ctx.beginPath(); ctx.arc(x+12-t*8,y-18+t*16,2,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1;
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('FEEDSTOCK',x-12,y+18);
    ctx.fillStyle='rgba(70,90,80,0.6)'; ctx.font='600 6.5px Inter,sans-serif'; ctx.fillText((A.econ.feedstock||'').toUpperCase(),x-12,y+27);
  }

  /* ---- digester tank: cylinder with a breathing green gas-holder dome ---- */
  function digester(d,lf,breath){
    var x=d.x,y=d.y,R=d.R;
    // shadow
    ctx.fillStyle='rgba(40,55,40,0.16)'; ctx.beginPath(); ctx.ellipse(x,y+3,R*0.9,8,0,0,Math.PI*2); ctx.fill();
    // tank body (cylinder wall)
    var wallH=R*0.95, top=y-wallH;
    var g=ctx.createLinearGradient(x-R,0,x+R,0); g.addColorStop(0,'#b6bcb2'); g.addColorStop(0.5,'#cdd2c8'); g.addColorStop(1,'#a9afa5');
    ctx.fillStyle=g; rr(x-R,top,R*2,wallH,4); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.45)'; ctx.lineWidth=1; ctx.stroke();
    // bubbles rising inside (scale with load factor)
    var nb=Math.round(3+lf*9);
    for(var b=0;b<nb;b++){ var ph=(T*0.03 + b*0.37)%1; var bx=x-R*0.6+((b*53)%(Math.round(R*1.2)));
      var by=y-2 - ph*wallH*0.9; var br=1.2+1.8*((b%3)/3);
      ctx.fillStyle='rgba(120,200,150,'+(0.18+0.4*lf)*(1-ph)+')'; ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fill(); }
    // breathing gas-holder dome (green), rises and falls
    var lift = R*0.30 + breath*R*0.16;        // dome height "breathes"
    var domeTop=top-lift;
    var dg=ctx.createLinearGradient(x,domeTop,x,top); dg.addColorStop(0,'#3f8f5c'); dg.addColorStop(1,'#2f7d54');
    ctx.fillStyle=dg; ctx.beginPath(); ctx.moveTo(x-R,top); ctx.quadraticCurveTo(x,domeTop,x+R,top); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(20,70,45,0.4)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x-R,top); ctx.quadraticCurveTo(x,domeTop,x+R,top); ctx.stroke();
    // dome highlight + gentle gas glow scaling with load
    glow(x-R*0.25,domeTop+lift*0.4, R*0.5, 'rgba(150,220,170,'+(0.10+0.18*lf)+')');
    // gas off-take pipe from the dome
    ctx.strokeStyle='rgba(110,120,110,0.55)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x+R*0.7,top-lift*0.3); ctx.lineTo(x+R+10,top-lift*0.3); ctx.stroke();
  }

  /* ---- gas-upgrading skid ---- */
  function upgradeSkid(){
    var x=SKID.x,y=SKID.y;
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x,y+2,30,6,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#bcc2b8'; rr(x-26,y-44,52,44,3); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // membrane / PSA columns
    ctx.fillStyle='#9aa39a'; for(var i=0;i<3;i++){ rr(x-20+i*16,y-58,9,16,2); ctx.fill(); }
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('UPGRADING',x,y+14);
  }

  /* ---- grid-injection point OR CHP engine ---- */
  function outputUnit(lf){
    var x=INJECT.x,y=INJECT.y, chp=(GEO[A.geoKey].output==='chp');
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x,y+2,28,6,0,0,Math.PI*2); ctx.fill();
    if(chp){
      // CHP engine container + stack with exhaust shimmer
      ctx.fillStyle='#b0b6ac'; rr(x-28,y-40,52,40,3); ctx.fill(); ctx.strokeStyle='rgba(110,120,110,0.5)'; ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle='#8a908a'; rr(x+14,y-58,9,22,1); ctx.fill();
      for(var i=0;i<3;i++){ var t=((T*0.05+i/3)%1); ctx.globalAlpha=(1-t)*0.4; ctx.fillStyle='rgba(200,200,200,0.7)';
        ctx.beginPath(); ctx.arc(x+18,y-58-t*14,2+t*2,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
      glow(x-6,y-18,14+6*lf,'rgba(255,170,70,'+(0.18+0.3*lf)+')');
      ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('CHP ENGINE',x-2,y+14);
    } else {
      // grid-injection kiosk + pipeline going off to the right
      ctx.fillStyle='#b0b6ac'; rr(x-22,y-34,40,34,3); ctx.fill(); ctx.strokeStyle='rgba(110,120,110,0.5)'; ctx.lineWidth=1; ctx.stroke();
      ctx.strokeStyle='rgba(120,130,120,0.6)'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(x+16,y-14); ctx.lineTo(W-8,y-14); ctx.stroke();
      glow(x,y-16,12+5*lf,'rgba(120,200,150,'+(0.16+0.3*lf)+')');
      ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('GRID INJECTION',x-2,y+14);
    }
  }

  /* ---- biomethane / gas pulses along a path (green→amber) ---- */
  function gasPulses(pts,speed,load,col,gcol){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.6,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- digestate store + tanker leaving ---- */
  function digestate(){
    var x=205,y=GROUND;
    ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(x,y+2,22,5,0,0,Math.PI*2); ctx.fill();
    // lagoon / store
    ctx.fillStyle='#7f8a6f'; ctx.beginPath(); ctx.ellipse(x,y-6,22,9,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(60,80,55,0.5)'; ctx.beginPath(); ctx.ellipse(x,y-7,18,6,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='600 6px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('DIGESTATE',x,y+15);
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ biomethane',b:'+ gate',c:'− feedstock'};
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
    var G=GEO[A.geoKey], E=A.econ, chp=(G.output==='chp');
    var gwhV=parseFloat(sCap.value), price=parseFloat(sSpread.value), lf=parseFloat(sAvail.value)/100;
    // gentle wobble around the load factor for the sparkline + glow
    var lfVis=Math.max(0.02,Math.min(1, lf*(0.94+0.10*Math.sin(T*0.02))));
    var breath=0.5+0.5*Math.sin(T*0.035);     // gas-holder dome "breathing"

    ctx.clearRect(0,0,W,H);
    drawMap();
    digestate();
    reception(lfVis);
    DIG.forEach(function(d){ digester(d,lfVis,breath); });
    upgradeSkid();
    outputUnit(lfVis);

    // gas pulses: digester domes → skid → output (green to amber)
    var loadVis=0.25+0.7*lfVis;
    gasPulses([[DIG[0].x+DIG[0].R+8,GROUND-DIG[0].R*0.3],[SKID.x-26,SKID.y-30],[SKID.x,SKID.y-40]],0.9+loadVis,loadVis,'rgba(120,200,150,0.95)','rgba(120,200,150,0.6)');
    gasPulses([[SKID.x+26,SKID.y-30],[INJECT.x-22,INJECT.y-20]],0.8+loadVis,loadVis,'rgba(210,170,80,0.95)','rgba(210,170,80,0.6)');
    if(!chp) gasPulses([[INJECT.x+16,INJECT.y-14],[W-8,INJECT.y-14]],0.8+loadVis,loadVis,'rgba(120,200,150,0.9)','rgba(120,200,150,0.55)');

    if(G.growing){
      var nx=DIG[1].x+DIG[1].R+60, ny=GROUND-34, pul=0.5+0.5*Math.sin(T*0.12);
      // dashed footprint for a new digester
      ctx.save(); ctx.globalAlpha=0.5+0.4*pul; ctx.strokeStyle='#0c6b4f'; ctx.setLineDash([4,4]); ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.ellipse(nx,GROUND,30,9,0,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('+ NEW DIGESTER',nx,ny);
      ctx.restore(); glow(nx,GROUND-6,9,'rgba(12,107,79,'+(0.2+0.3*pul)+')');
    }

    // ---- economics (production × incentive-rich price + gate − feedstock) ----
    var mwh=gwhV*1000*lf;                            // biomethane produced (MWh/yr)
    var energyRev=mwh*price;                          // gas/power + green incentive (the core)
    var gateRev=(E.gatePerMWh||0)*mwh;                // gate fee + digestate
    var grossRev=energyRev+gateRev;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));   // floor = contracted / incentive-backed minimum
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var feedCost=mwh*(E.feedPerMWh||0), fixedOM=(E.fixedOM||0)*1e6, opex=feedCost+fixedOM;  // feedstock + parasitic + O&M
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is the gate fee / digestate (amber) vs energy+incentive
    var gateShare=grossRev>0?Math.max(0.08,Math.min(0.55, gateRev/grossRev)):0.14;
    var c_feed=feedCost, c_para=fixedOM*0.45, c_om=fixedOM*0.35, c_admin=fixedOM*0.20;

    if(_anim){
      var srcPts=[RECEP].concat(DIG).concat([SKID,INJECT]);
      if(Math.random()<0.66){ var s1=srcPts[(Math.random()*srcPts.length)|0]; spawnCoin(s1.x,s1.y-40, Math.random()<gateShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.7, opex/Math.max(1,revenue)));
      if(Math.random()<outRate){ spawnCoin(RECEP.x+rnd(-10,10),RECEP.y-6,'cost',1); }
      demHist.push(lfVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(lfVis);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+gwhV+' GWh/yr',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',gwhV+' GWh/yr'); set('ixSpreadV',CUR+Math.round(price)+'/MWh'); set('ixAvailV',Math.round(lf*100)+'%');
    set('ixDir',gwhV+' GWh/yr'); set('ixDirS',(chp?'CHP power':'biomethane')+' · '+(E.feedstock||''));
    set('ixMW',Math.round(mwh/1000)+' GWh produced'); set('ixMWs',Math.round(lf*100)+'% load factor / yr');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Feedstock',c_feed],['Parasitic power',c_para],['Plant O&amp;M',c_om],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the margin is too thin to value, raise the price/incentive or the load factor, or lower the feedstock cost.</span>'; return; }
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
    sCap.min=E.gwhMin; sCap.max=E.gwhMax; sCap.step=E.gwhStep; sCap.value=E.gwhDef;
    sSpread.min=E.priceMin; sSpread.max=E.priceMax; sSpread.step=E.priceStep; sSpread.value=E.priceDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is biomethane produced (capacity × hours × load factor) × an incentive-rich price, plus a gate fee (with a floor for the contracted / incentive-backed minimum), less feedstock and parasitic cost; the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }
  function layout(){}

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.gwhDef; sSpread.value=E.priceDef; sAvail.value=E.lfDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'ukbio');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
