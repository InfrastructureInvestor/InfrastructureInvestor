/* Recycling infrastructure (Materials Recovery Facilities / MRFs), data-driven
   worked examples. Six real materials-recovery businesses, one template. Scene
   config from rc-geo.js (GEO), drawn as a materials recovery facility in 720x520
   scene coords: a collection truck tips mixed dry recycling onto an infeed, a
   chain of conveyor belts carries the material through sorting stages (a trommel
   screen, optical sorters, a magnet / eddy-current separator) to an output end
   of stacked bales of sorted commodities, with a residue skip for the reject
   stream. An MRF earns TWO revenue streams: a contracted GATE FEE on every tonne
   it accepts (the stable core, often under contract with councils / collectors)
   and merchant COMMODITY sales of the recovered materials (paper, baled plastics,
   aluminium, steel, whose prices are volatile). Revenue is tonnes × (gate fee +
   commodity value × recovery), against the cost of sorting (labour, power, residue
   disposal, transport), with a contracted gate-fee floor; the returns model is a
   simplified DCF. The investment story is the gate fee + a commodity-price call. */
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
  function kt(t){ return Math.round(t/1000)+' kt'; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · UK MRF (Europe · council-contracted dry MRF) ---------- */
  ukmrf:{
    name:'UK materials recovery facility', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'ukmrf',
    lede:'A council-contracted <b>materials recovery facility</b> takes mixed dry recycling, sorts it into paper, card, plastics, metals and glass, and earns two streams: a <b>contracted gate fee</b> on every tonne and the <b>merchant sale</b> of the recovered commodities.',
    s1:'<p class="body">A <b>materials recovery facility (MRF)</b> is a sorting plant. Councils and collectors deliver <b>mixed dry recycling</b>, and the MRF separates it: a trommel screen, optical sorters, a magnet and an eddy-current separator pull out paper, card, plastics, ferrous and non-ferrous metal and glass, baling each into a saleable commodity. In the UK these plants are run by operators such as <b>Viridor</b> and <b>Biffa</b> under long contracts with local authorities.</p>'+
       '<p class="body">The economics are a <b>processor with two revenue streams</b>. First, a <b>gate fee</b>: a charge per tonne accepted, usually contracted with the council, which forms the stable core of the business. Second, the <b>sale of the recovered commodities</b> at merchant prices set by volatile global markets for paper, plastic and metal. The gate fee is effectively the margin; the commodity revenue largely offsets the cost of sorting. The thin margin and the commodity-price exposure are what make it an investment with a call option attached.</p>',
    facts:[['Gate + sales','Revenue','two streams'],['Contracted','Gate fee','the stable core'],['Merchant','Commodities','volatile prices'],['Trommel + optical','Sorting','+ magnet / eddy'],['Council','Counterparty','long contracts'],['Thin','Margin','commodity-sensitive']],
    s2:'Watch the line. A <b>collection truck</b> tips mixed recycling onto the infeed; the conveyors carry it through the trommel, optical sorters and the magnet, and out the far end as <b>baled commodities</b> (blue paper, white plastic, red/green mixed, silver metal), with a small <b>residue</b> skip for what can\'t be recovered. <b style="color:#0c8a57">Gate-fee</b> orbs rise at the infeed and <b style="color:#c0902f">commodity</b> orbs at the bales; the <b style="color:#0c6b4f">margin</b> is what\'s left after sorting. Drag the capacity, the gate fee and the utilisation.',
    driverLab:'Gate fee', availLab:'Utilisation', hrK:'Gate + commodities', yrS:'gate + commodity sales',
    ledge:{a:'+ gate fee',b:'+ commodities',c:'− sorting'}, demandLabel:'THROUGHPUT',
    preset:'Load UK MRF',
    try:'<b>Try this:</b> the <b>gate fee is the margin</b>. Pull the gate fee down and watch the thin EBITDA compress, because the merchant commodity revenue largely just offsets the cost of sorting. The <b>floor</b> (the contracted gate-fee minimum) is what protects the downside when commodity prices fall. Push utilisation to see operating leverage: a sorting line has high fixed cost, so filling it is what lifts the return.',
    s3:'A UK MRF sells a <b>service and a set of commodities</b>. It charges a <b>gate fee</b> per tonne (contracted with the council, indexed, and the stable core) and sells the <b>recovered materials</b> into volatile global markets. The gate fee is effectively the margin; commodity revenue largely offsets the sorting cost. The risks are <b>contamination and residue</b> (material that can\'t be recovered and must be disposed of) and <b>commodity prices</b>. The investment is a gate fee with a commodity-price call.',
    mb:{tag:'Model A · processor with a commodity call', title:'Council-contracted dry MRF', body:'A sorting plant that earns a contracted gate fee on every tonne accepted (the stable core / margin) plus merchant sales of the recovered commodities (the swing), against the cost of sorting and residue. The gate fee protects the downside; the commodity price is the upside. <b>This is a UK MRF</b> (Viridor / Biffa-style).'},
    s4a:'The cost is <b>sorting</b>, labour and power on the line, residue disposal, and transport of the bales to market, and it largely scales with the tonnes processed. Because commodity revenue tends to offset this cost, the <b>gate fee is the margin</b>, and the margin is thin and commodity-sensitive. Contamination lifts the residue cost and erodes both revenue streams.',
    wfNote:'Operating cost is sorting (labour and power), residue disposal and transport, scaling with tonnes. The gate fee is the margin; commodity sales offset the cost. The margin is thin and swings with commodity prices and contamination.',
    s4b:'The capital is the <b>sorting line</b>, the building, the conveyors, the trommel, the optical sorters and the magnet / eddy-current separators. An MRF is <b>less capital-heavy</b> than energy-from-waste: capex is a few hundred pounds per annual tonne, not thousands. Public grant or a council contribution can defray part of the build; the forward capital is upgrading the line (more optical sorting, robotics) to lift recovery and cut contamination.',
    stackH:'The capital · the sorting line', splitL:'Financing', splitR:'allocation',
    split:[['s1',55,'Project / corporate debt'],['s2',45,'Operator equity']],
    finList:[['','Revenue','gate fee + commodity sales'],['sub','Gate fee','contracted (council)'],['','Commodities','merchant · paper / plastic / metal'],['sub','Cost','sorting + residue + transport'],['','Margin','thin · commodity-sensitive'],['rest','Owner','operator (Viridor / Biffa-style)']],
    finNote:'A UK MRF is a <b>dual-revenue processor</b>: a contracted gate fee (the stable margin) plus a merchant commodity-price call. The downside is held by the gate-fee floor; the upside is commodity prices. The risks are contamination, residue cost and offtake markets.',
    timeline:[['1990s','<b>Kerbside recycling</b> drives the first UK MRFs.'],['2000s','<b>Single-stream collection</b> scales MRF throughput.'],['2014','<b>MRF Code of Practice</b> sets quality / sampling rules.'],['2018','<b>China\'s National Sword</b> closes the export market.'],['2020s','<b>Optical / robotic sorting</b> lifts recovery and quality.'],['Ongoing','<b>EPR &amp; consistency</b> reform reshapes the gate fee.']],
    calcNote:'A working model of a <b>council-contracted dry MRF</b>. Revenue is tonnes (capacity × utilisation) × (gate fee + commodity value × recovery); the contracted gate fee sets a floor. The cost of sorting and residue makes the margin thin, so the gate fee and commodity price are the swing.',
    s6:'A UK MRF is a gate fee with a commodity call. What drives it:',
    breakers:['<b>The gate fee</b>, contracted with the council, is effectively the margin and the stable core.','<b>Commodity prices</b>: merchant paper, plastic and metal prices are the swing and the risk.','<b>Contamination &amp; residue</b>: dirty input lifts disposal cost and erodes recovery.','<b>Offtake markets</b>: post-National-Sword, where the bales can be sold is the key constraint.'],
    src:'Figures from public sources on UK MRFs (operators such as <a href="https://www.viridor.co.uk/" target="_blank" rel="noopener">Viridor</a> and <a href="https://www.biffa.co.uk/" target="_blank" rel="noopener">Biffa</a>) and the WRAP / MRF Code of Practice. Figures are approximate and illustrative.',
    econ:{cur:'£', stream:'dry recycling', off:'paper / plastic / metal',
      ktDef:200,ktMin:60,ktMax:450,ktStep:10, gateDef:35,gateMin:10,gateMax:90,gateStep:1,
      utilDef:85,utilMin:45,utilMax:98,utilStep:1, commodityPerTonne:60, recovery:0.9, procPerTonne:52, fixedOM:1.5},
    calc:{build:44,grant:8,capex:9,revG:2,floor:7,cap:60,tax:25,exit:8.5,lev:4,rd:6,amort:3,hold:12},
    map:{footer:GEO.ukmrf.footer}
  },

  /* ---------- 2 · US SINGLE-STREAM MRF (North America) ---------- */
  usmrf:{
    name:'US single-stream MRF', geo:'United States', continent:'North America', cur:'US$', geoKey:'usmrf',
    lede:'A large <b>single-stream MRF</b> run by a national operator: it takes everything in one bin, sorts it at high speed, and earns a gate fee plus commodity sales in a market reshaped by <b>China\'s National Sword</b>.',
    s1:'<p class="body">In the US, recycling is mostly <b>single-stream</b> (every recyclable in one cart), which is convenient for households but harder to sort. Large operators such as <b>Republic Services</b> and <b>WM (Waste Management)</b> run high-throughput MRFs that take this mixed stream and separate it at speed with trommels, optical sorters, magnets and increasingly <b>robotics</b>.</p>'+
       '<p class="body">The model is the same dual-revenue processor: a <b>gate fee</b> (or processing fee) per tonne, plus the sale of recovered commodities. China\'s <b>National Sword</b> policy (2018), which banned most imported scrap, upended the economics: commodity prices fell and contamination limits tightened, so US operators rebuilt their contracts to share commodity risk and lift the gate fee. The result is a business where the <b>gate fee carries the margin</b> and the commodity price is a volatile call.</p>',
    facts:[['Single-stream','Input','one cart'],['Gate + sales','Revenue','two streams'],['National operator','Owner','Republic / WM-style'],['Post-Sword','Market','rebuilt contracts'],['Robotics','Sorting','high throughput'],['Thin','Margin','commodity-sensitive']],
    s2:'Watch the line. A <b>collection truck</b> tips a single-stream load onto the infeed; the conveyors run it fast through the trommel, optical sorters and the magnet, baling <b>paper, plastic and metal</b> at the far end, with a residue skip for the reject. <b style="color:#0c8a57">Gate-fee</b> orbs rise at the infeed, <b style="color:#c0902f">commodity</b> orbs at the bales. The <b style="color:#0c6b4f">margin</b> is what the gate fee leaves after sorting. Drag the capacity, the gate fee and the utilisation.',
    driverLab:'Gate fee', availLab:'Utilisation', hrK:'Gate + commodities', yrS:'gate + commodity sales',
    ledge:{a:'+ gate fee',b:'+ commodities',c:'− sorting'}, demandLabel:'THROUGHPUT',
    preset:'Load US MRF',
    try:'<b>Try this:</b> after <b>National Sword</b>, the contracts were rebuilt so the <b>gate fee</b> carries more of the margin. Pull the gate fee down and watch the thin EBITDA compress; raise the commodity assumption and the swing reappears. The floor (the contracted processing fee) is what holds the downside when paper and plastic prices fall, as they did in 2018-19.',
    s3:'A US single-stream MRF charges a <b>gate / processing fee</b> per tonne and sells the recovered commodities. The single-stream input is high-volume but contaminated, so contamination and residue are a real cost. After National Sword, operators rebuilt contracts to lift the gate fee and share commodity risk, making the gate fee the margin and the commodity price the call. Scale, automation and offtake markets are the levers.',
    mb:{tag:'Model A · processor with a commodity call', title:'Large single-stream MRF', body:'A high-throughput plant that takes single-stream recycling, charges a gate fee per tonne (the margin) and sells recovered commodities (the swing), against the cost of high-speed sorting and residue. Post-National-Sword contracts lifted the gate fee. <b>This is a US MRF</b> (Republic / WM-style).'},
    s4a:'The cost is high-speed <b>sorting</b>, labour, power and maintenance on a fast line, plus residue disposal and bale transport, scaling with tonnes. Single-stream input is contaminated, so residue is higher. Commodity revenue offsets much of the cost, leaving the <b>gate fee as the margin</b>, thin, and rebuilt after National Sword to carry more of the load.',
    wfNote:'Operating cost is high-speed sorting (labour, power, maintenance), residue disposal and transport. The gate fee carries the margin, with commodity sales offsetting the cost. Single-stream contamination lifts residue; the margin is thin and commodity-sensitive.',
    s4b:'The capital is the <b>sorting line</b>, building, conveyors, optical sorters, magnets and robots, sized for high single-stream volume. It is less capital-heavy than incineration; the forward capital is <b>automation</b> (robotic sorting) to cut labour and contamination, and new lines as collection grows.',
    stackH:'The capital · the sorting line', splitL:'Financing', splitR:'allocation',
    split:[['s1',58,'Corporate / operator debt'],['s2',42,'Operator equity']],
    finList:[['','Input','single-stream'],['sub','Revenue','gate fee + commodities'],['','Owner','national operator'],['sub','Market','post-National-Sword'],['','Sorting','optical + robotics'],['rest','Margin','thin · commodity-sensitive']],
    finNote:'A US single-stream MRF is a <b>scale dual-revenue processor</b>: a rebuilt gate fee that carries the margin, plus a commodity-price call. The risks are contamination, residue cost and offtake markets; automation is the lever on cost.',
    timeline:[['2000s','<b>Single-stream collection</b> spreads across the US.'],['2010s','<b>National operators</b> consolidate MRF capacity.'],['2018','<b>National Sword</b> bans most scrap imports to China.'],['2019','<b>Commodity prices fall</b>; contracts rebuilt to lift gate fees.'],['2020s','<b>Robotic sorting</b> cuts labour and contamination.'],['Ongoing','<b>Domestic offtake</b> and EPR reshape the market.']],
    calcNote:'A working model of a <b>large single-stream MRF</b>. Revenue is tonnes × (gate fee + commodity value × recovery); the contracted processing fee sets a floor. After National Sword the gate fee carries the margin and the commodity price is the call.',
    s6:'A US MRF is a rebuilt gate fee with a commodity call. What drives it:',
    breakers:['<b>The gate fee</b> was rebuilt post-Sword to carry the margin and the contracted floor.','<b>Commodity prices</b> supply the swing and the risk: paper, plastic and metal all sell merchant.','<b>Contamination &amp; residue</b>: single-stream input lifts residue and erodes recovery.','<b>Offtake &amp; automation</b>: domestic markets and robotics drive value and cost.'],
    src:'Figures from public sources on US MRFs (operators such as <a href="https://www.republicservices.com/" target="_blank" rel="noopener">Republic Services</a> and <a href="https://www.wm.com/" target="_blank" rel="noopener">WM</a>) and the post-National-Sword market. Figures are approximate and illustrative.',
    econ:{cur:'US$', stream:'single-stream', off:'paper / plastic / metal',
      ktDef:250,ktMin:80,ktMax:550,ktStep:10, gateDef:48,gateMin:15,gateMax:110,gateStep:1,
      utilDef:86,utilMin:45,utilMax:98,utilStep:1, commodityPerTonne:65, recovery:0.88, procPerTonne:56, fixedOM:2.0},
    calc:{build:70,grant:0,capex:9,revG:3,floor:9,cap:75,tax:25,exit:8.5,lev:4,rd:6.5,amort:3,hold:12},
    map:{footer:GEO.usmrf.footer}
  },

  /* ---------- 3 · BRAZILIAN RECYCLING (South America) ---------- */
  brmrf:{
    name:'Brazilian recycling plant', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'brmrf',
    lede:'Recycling in Brazil is <b>formalising</b>, moving from informal waste-pickers (catadores) to mechanised sorting plants that earn a gate fee and sell recovered commodities, with a developing-market discount on the return.',
    s1:'<p class="body">Brazil recovers a great deal of material (it is a world leader in aluminium-can recycling), but much of the value chain has been <b>informal</b>, run by cooperatives of waste-pickers (<i>catadores</i>) who hand-sort material. The opportunity is <b>formalisation</b>: building mechanised <b>sorting plants</b> that take mixed recycling, separate it at scale, and integrate the cooperatives into a contracted supply chain.</p>'+
       '<p class="body">The model is the familiar dual-revenue one: a <b>gate fee</b> per tonne (from municipalities or producers under emerging extended-producer-responsibility rules) plus the <b>sale of recovered commodities</b>. The cash flow is real but the return is carried at an <b>emerging-market discount rate</b>, reflecting local rates, currency and a developing regulatory framework. The investment case is the gate fee, a commodity call, and the formalisation of a large, under-served market.</p>',
    facts:[['Formalising','Chain','catadores → plants'],['Gate + sales','Revenue','two streams'],['Aluminium','Strength','world-leading recovery'],['EPR emerging','Driver','producer responsibility'],['EM rate','Return','developing-market'],['Thin','Margin','commodity-sensitive']],
    s2:'Watch the line. A <b>collection truck</b> tips mixed recycling onto the infeed; the conveyors carry it through the sorting stages to baled <b>commodities</b> at the far end, with a residue skip for the reject. <b style="color:#0c8a57">Gate-fee</b> orbs rise at the infeed, <b style="color:#c0902f">commodity</b> orbs at the bales. The <b style="color:#0c6b4f">margin</b> is thin, and the whole return is discounted at an <b>EM rate</b>. Drag the capacity, the gate fee and the utilisation.',
    driverLab:'Gate fee', availLab:'Utilisation', hrK:'Gate + commodities', yrS:'gate + commodity sales',
    ledge:{a:'+ gate fee',b:'+ commodities',c:'− sorting'}, demandLabel:'THROUGHPUT',
    preset:'Load Brazil MRF',
    try:'<b>Try this:</b> the asset works, but the return is at an <b>EM discount rate</b>. Raise the cost of debt and watch a solid gate-fee-plus-commodity return net down once discounted like a Brazilian asset. Pull the gate fee down to see the thin margin compress; aluminium and metal prices are the strongest part of the commodity call here.',
    s3:'A Brazilian recycling plant charges a <b>gate fee</b> per tonne and sells recovered commodities, with aluminium a particular strength. The model lives on <b>formalising</b> the value chain: integrating cooperatives, contracting supply, and capturing value that informal hand-sorting leaves on the table. The investor question is less the asset than the <b>discount rate</b> (local rates and currency) and the pace at which EPR and formalisation develop.',
    mb:{tag:'Model A · processor with a commodity call', title:'Formalising recycling plant (EM)', body:'A mechanised sorting plant that earns a gate fee (the margin) and sells recovered commodities (the swing), formalising a chain run by informal waste-pickers, priced at emerging-market rates. The gate fee holds the downside; commodity prices and EM rates set the value. <b>This is recycling in Brazil</b> (flag illustrative).'},
    s4a:'The cost is <b>sorting</b>, labour (lower-cost than the West), power, residue disposal and transport, scaling with tonnes. Commodity revenue, led by aluminium, offsets much of it, leaving a <b>thin gate-fee margin</b>. Formalising the supply (integrating cooperatives) is the operational lever on both quality and cost.',
    wfNote:'Operating cost is sorting (labour, power), residue disposal and transport. The gate fee is the margin; commodity sales, aluminium strongest, offset the cost. The margin is thin; the return carries an EM discount.',
    s4b:'The capital is the <b>sorting line</b>, modest by Western standards and less capital-heavy than incineration. Public and producer (EPR) contributions can defray part of the build. The return is carried on an enterprise-value basis at an <b>EM discount rate</b>; growth is formalising more of a large, under-served market.',
    stackH:'The capital · the sorting line', splitL:'Financing', splitR:'EM',
    split:[['s1',50,'Local / project debt'],['s2',50,'Operator equity']],
    finList:[['','Chain','formalising (catadores)'],['sub','Revenue','gate fee + commodities'],['','Strength','aluminium recovery'],['sub','Driver','emerging EPR'],['','Return','EM discount rate'],['rest','Margin','thin · commodity-sensitive']],
    finNote:'A Brazilian recycling plant is a <b>dual-revenue processor at an EM rate</b>: a gate fee plus a commodity call (aluminium-led), formalising an informal chain. The whole investment debate is the <b>discount rate</b>, the currency and the pace of formalisation.',
    timeline:[['1990s','<b>Catadores cooperatives</b> drive informal recovery.'],['2010','<b>National Solid Waste Policy</b> sets the framework.'],['2010s','<b>Aluminium recycling</b> reaches world-leading rates.'],['2020s','<b>EPR rules</b> begin to formalise producer responsibility.'],['2020s','<b>Mechanised plants</b> integrate the cooperatives.'],['Long-term','<b>Formalisation</b> of a large, under-served market.']],
    calcNote:'A working model of an <b>EM formalising recycling plant</b>, on an enterprise-value basis. Revenue is tonnes × (gate fee + commodity value × recovery); the gate fee sets a floor. The cost of debt is high to reflect EM rates, netting a solid dual-revenue return down once discounted.',
    s6:'Brazilian recycling is a dual-revenue processor at an EM rate. What drives it:',
    breakers:['<b>The gate fee</b> is the contracted margin and the stable core of a thin-margin business.','<b>Commodity prices</b>, with aluminium and metal the strongest part of the call.','<b>Country &amp; currency</b>: local rates and the currency set the discount rate.','<b>Formalisation &amp; EPR</b>: integrating cooperatives and producer rules drives growth.'],
    src:'Figures are illustrative for a Brazilian recycling / sorting plant in a formalising market. The flag is illustrative; all figures here are approximate and illustrative.',
    econ:{cur:'R$', stream:'mixed recycling', off:'aluminium / paper / plastic',
      ktDef:120,ktMin:40,ktMax:300,ktStep:10, gateDef:120,gateMin:40,gateMax:280,gateStep:5,
      utilDef:80,utilMin:40,utilMax:96,utilStep:1, commodityPerTonne:240, recovery:0.88, procPerTonne:205, fixedOM:3.5},
    calc:{build:78,grant:14,capex:9,revG:4,floor:14,cap:130,tax:34,exit:8,lev:3,rd:13,amort:3,hold:12},
    map:{footer:GEO.brmrf.footer}
  },

  /* ---------- 4 · AUSTRALIAN MRF (Oceania) ---------- */
  aumrf:{
    name:'Australian MRF', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'aumrf',
    lede:'A council-contracted Australian <b>MRF</b>. After China stopped taking the country\'s recyclables, Australia is <b>onshoring</b> sorting and reprocessing, with operators such as Cleanaway and Visy building modern lines.',
    s1:'<p class="body">Australia exported much of its recycling to China, until <b>National Sword</b> closed that door, leaving material stranded. The policy response was an <b>export ban</b> on unprocessed waste and a drive to <b>onshore</b> sorting and reprocessing. Operators such as <b>Cleanaway</b> and <b>Visy</b> (and council partnerships) are building modern MRFs to sort domestically and feed Australian reprocessors.</p>'+
       '<p class="body">The model is the dual-revenue processor: a <b>gate fee</b> per tonne under council contract (the stable core) plus the <b>sale of recovered commodities</b> into now largely domestic markets. Onshoring changes the offtake, bales are sold to local reprocessors rather than exported, which can steady prices but requires the plants and the reprocessing capacity to exist. The gate fee carries the margin; the commodity price and the onshoring build-out are the story.</p>',
    facts:[['Onshoring','Driver','post-China ban'],['Gate + sales','Revenue','two streams'],['Council','Counterparty','long contracts'],['Cleanaway / Visy','Operators','modern lines'],['Domestic','Offtake','local reprocessors'],['Thin','Margin','commodity-sensitive']],
    s2:'Watch the line. A <b>collection truck</b> tips kerbside recycling onto the infeed; the conveyors carry it through the trommel, optical sorters and the magnet to baled <b>commodities</b> for domestic reprocessors, with a residue skip for the reject. <b style="color:#0c8a57">Gate-fee</b> orbs rise at the infeed, <b style="color:#c0902f">commodity</b> orbs at the bales. The <b style="color:#0c6b4f">margin</b> is the gate fee after sorting. Drag the capacity, the gate fee and the utilisation.',
    driverLab:'Gate fee', availLab:'Utilisation', hrK:'Gate + commodities', yrS:'gate + commodity sales',
    ledge:{a:'+ gate fee',b:'+ commodities',c:'− sorting'}, demandLabel:'THROUGHPUT',
    preset:'Load Australia MRF',
    try:'<b>Try this:</b> <b>onshoring</b> shifts the offtake to domestic reprocessors, which can steady the commodity revenue but depends on local capacity existing. Pull the gate fee down and watch the thin margin compress; the contracted gate fee is the floor that holds the downside. Push utilisation: a modern line has high fixed cost, so filling it is the return.',
    s3:'An Australian MRF charges a <b>gate fee</b> per tonne under council contract and sells recovered commodities into largely <b>domestic</b> markets after the export ban. Onshoring is the structural change: it builds the sorting and reprocessing capacity the country needs, and steadies offtake. The gate fee is the margin; commodity prices and the pace of the onshoring build-out are the swing. Contamination and residue remain the operating risk.',
    mb:{tag:'Model A · processor with a commodity call', title:'Council-contracted MRF (onshoring)', body:'A modern sorting plant that earns a contracted gate fee (the margin) and sells recovered commodities to domestic reprocessors (the swing), built to onshore sorting after China stopped taking Australia\'s recyclables. The contracted gate fee cushions the downside; onshoring steadies offtake. <b>This is an Australian MRF</b> (Cleanaway / Visy-style).'},
    s4a:'The cost is <b>sorting</b>, labour and power on the line, residue disposal and transport to domestic reprocessors, scaling with tonnes. Commodity revenue offsets much of it, leaving a <b>thin gate-fee margin</b>. Onshoring shortens transport and can steady the commodity price; contamination is the operating risk.',
    wfNote:'Operating cost is sorting (labour, power), residue disposal and transport to domestic reprocessors. Commodity sales cover most of the sorting cost, leaving the gate fee as the margin. Onshoring steadies offtake; the margin stays thin and commodity-sensitive.',
    s4b:'The capital is a <b>modern sorting line</b>, building, conveyors, optical sorters and magnets, often co-funded with councils and government onshoring grants. It is less capital-heavy than energy-from-waste; the forward capital is more domestic reprocessing capacity to close the loop the export ban created.',
    stackH:'The capital · the sorting line', splitL:'Financing', splitR:'allocation',
    split:[['s1',52,'Project / corporate debt'],['s2',48,'Operator + council equity']],
    finList:[['','Driver','onshoring (export ban)'],['sub','Revenue','gate fee + commodities'],['','Counterparty','council contracts'],['sub','Offtake','domestic reprocessors'],['','Operators','Cleanaway / Visy-style'],['rest','Margin','thin · commodity-sensitive']],
    finNote:'An Australian MRF is a <b>dual-revenue processor with an onshoring story</b>: a contracted gate fee (the margin) plus a commodity call, feeding domestic reprocessors. The gate fee holds the downside; the build-out of local capacity and commodity prices are the swing.',
    timeline:[['2010s','<b>Recyclables exported</b> to China at scale.'],['2018','<b>National Sword</b> strands Australia\'s exports.'],['2020','<b>Export ban</b> on unprocessed waste announced.'],['2020s','<b>Onshoring grants</b> fund new MRFs and reprocessors.'],['2020s','<b>Cleanaway / Visy</b> build modern sorting lines.'],['Ongoing','<b>Domestic reprocessing</b> closes the loop.']],
    calcNote:'A working model of a <b>council-contracted onshoring MRF</b>. Revenue is tonnes × (gate fee + commodity value × recovery); the contracted gate fee sets a floor. Onshoring steadies offtake; the gate fee is the margin and the commodity price is the call.',
    s6:'An Australian MRF is a gate fee with an onshoring story. What drives it:',
    breakers:['<b>The gate fee</b>, contracted with the council, doubles as margin and floor.','<b>Commodity prices</b> for merchant paper, plastic and metal are the swing and the risk.','<b>Onshoring &amp; offtake</b>: domestic reprocessing capacity steadies the commodity revenue.','<b>Contamination &amp; residue</b>: kerbside contamination lifts disposal cost.'],
    src:'Figures from public sources on Australian MRFs (operators such as <a href="https://www.cleanaway.com.au/" target="_blank" rel="noopener">Cleanaway</a> and <a href="https://www.visy.com.au/" target="_blank" rel="noopener">Visy</a>) and the post-China onshoring drive. Figures are approximate and illustrative.',
    econ:{cur:'A$', stream:'kerbside recycling', off:'paper / plastic / metal',
      ktDef:160,ktMin:50,ktMax:380,ktStep:10, gateDef:55,gateMin:18,gateMax:120,gateStep:1,
      utilDef:84,utilMin:45,utilMax:97,utilStep:1, commodityPerTonne:62, recovery:0.89, procPerTonne:55, fixedOM:1.8},
    calc:{build:52,grant:9,capex:9,revG:2,floor:9,cap:70,tax:30,exit:8.5,lev:4,rd:6,amort:3,hold:13},
    map:{footer:GEO.aumrf.footer}
  },

  /* ---------- 5 · BEE'AH / SHARJAH (Middle East · integrated recovery) ---------- */
  beeah:{
    name:'Bee\'ah material recovery facility', geo:'Sharjah, UAE', continent:'Middle East', cur:'AED', geoKey:'beeah',
    lede:'The Gulf\'s flagship recovery facility, <b>Bee\'ah</b>\'s integrated MRF in Sharjah is one of the largest in the region, sorting the emirate\'s waste at scale and driving it toward near-zero landfill.',
    s1:'<p class="body"><b>Bee\'ah</b> (the Sharjah Environment Company) runs one of the Middle East\'s largest <b>material recovery facilities</b>, a flagship, highly automated plant that sorts the emirate\'s mixed waste and recyclables at scale, recovering paper, plastics, metals and more, as part of a drive toward <b>near-zero landfill</b> (a "waste-to-zero" ambition) alongside energy-from-waste and other recovery.</p>'+
       '<p class="body">The economics are the dual-revenue processor at flagship scale: a <b>gate fee</b> per tonne (contracted with the municipality / the emirate, the stable core) plus the <b>sale of recovered commodities</b>. The scale and automation are the differentiator: a large, modern line with low labour cost and high recovery. The gate fee carries the margin; the commodity price is the call; and the strategic driver is the emirate\'s landfill-diversion target rather than commodity markets alone.</p>',
    facts:[['Flagship','Scale','one of the largest'],['Gate + sales','Revenue','two streams'],['Bee\'ah','Operator','Sharjah Environment'],['Near-zero','Target','landfill diversion'],['Automated','Sorting','high recovery'],['Thin','Margin','commodity-sensitive']],
    s2:'Watch the line. A <b>collection truck</b> tips the emirate\'s mixed waste onto the infeed; the conveyors run it through the trommel, optical sorters and the magnet to baled <b>commodities</b> at the far end, with a residue skip for the reject. <b style="color:#0c8a57">Gate-fee</b> orbs rise at the infeed, <b style="color:#c0902f">commodity</b> orbs at the bales. The <b style="color:#0c6b4f">margin</b> is the gate fee after sorting, at flagship scale. Drag the capacity, the gate fee and the utilisation.',
    driverLab:'Gate fee', availLab:'Utilisation', hrK:'Gate + commodities', yrS:'gate + commodity sales',
    ledge:{a:'+ gate fee',b:'+ commodities',c:'− sorting'}, demandLabel:'THROUGHPUT',
    preset:'Load Bee\'ah MRF',
    try:'<b>Try this:</b> at <b>flagship scale</b>, the gate fee on a very large tonnage is a substantial absolute margin even when thin. Pull the gate fee down to see the sensitivity; push capacity and utilisation to see operating leverage on a big automated line. The strategic driver here is the emirate\'s <b>landfill-diversion target</b> as much as the commodity price.',
    s3:'Bee\'ah\'s MRF charges a <b>gate fee</b> per tonne (contracted with the emirate) and sells recovered commodities, at flagship scale. The differentiator is <b>scale and automation</b> (a large, modern, low-labour line with high recovery), together with the strategic anchor of a <b>near-zero-landfill</b> target that underpins the throughput. The gate fee is the margin; the commodity price is the call; the diversion mandate is the durable demand.',
    mb:{tag:'Model A · processor with a commodity call', title:'Integrated recovery facility (flagship)', body:'A large, highly automated MRF that earns a contracted gate fee (the margin) and sells recovered commodities (the swing), anchored by an emirate-wide near-zero-landfill target. Scale and automation lift recovery and lower labour. The gate fee anchors the downside; the diversion mandate underpins the throughput. <b>This is Bee\'ah, Sharjah</b>.'},
    s4a:'The cost is <b>sorting</b> at scale, power and maintenance on a large automated line (low labour given the automation), residue disposal and transport, scaling with tonnes. Commodity revenue offsets much of it, leaving a <b>thin gate-fee margin</b>, but the very large tonnage makes the absolute margin substantial.',
    wfNote:'Operating cost is sorting at scale (power, maintenance, modest labour), residue disposal and transport. Once commodity sales have offset the cost, the gate fee is what remains as margin. Automation lowers labour; the margin is thin but the absolute base is large.',
    s4b:'The capital is a <b>large, automated sorting line</b>, building, conveyors, optical sorters, magnets and eddy-current separators, financed on a strong sponsor balance sheet and underpinned by the emirate\'s diversion target. It is less capital-heavy than energy-from-waste; the forward capital is further automation and integration across the recovery complex.',
    stackH:'The capital · the sorting line', splitL:'Financing', splitR:'sponsor-backed',
    split:[['s1',55,'Sponsor / project debt'],['s2',45,'Bee\'ah equity']],
    finList:[['','Scale','one of the largest in the region'],['sub','Revenue','gate fee + commodities'],['','Operator','Bee\'ah (Sharjah Environment)'],['sub','Anchor','near-zero-landfill target'],['','Sorting','large, automated, high recovery'],['rest','Margin','thin · large absolute base']],
    finNote:'Bee\'ah\'s MRF is a <b>flagship-scale dual-revenue processor</b>: a contracted gate fee (the margin) plus a commodity call, anchored by an emirate-wide diversion mandate. The thin margin on a very large tonnage is a substantial absolute cash flow; automation is the cost lever.',
    timeline:[['2007','<b>Bee\'ah founded</b> in Sharjah.'],['2010s','<b>Flagship MRF</b> built, among the region\'s largest.'],['2010s','<b>High diversion rates</b> achieved across the emirate.'],['2020s','<b>Waste-to-energy</b> added to the recovery complex.'],['2020s','<b>Automation</b> lifts recovery and lowers labour.'],['Ongoing','<b>Near-zero landfill</b> drives the throughput.']],
    calcNote:'A working model of a <b>flagship integrated MRF</b>. Revenue is tonnes × (gate fee + commodity value × recovery); the contracted gate fee sets a floor. Scale and automation give operating leverage; the margin sits in the gate fee and the upside in the commodity price.',
    s6:'Bee\'ah is a flagship-scale gate fee with a commodity call. What drives it:',
    breakers:['<b>The gate fee</b> is contracted with the emirate and serves as both margin and floor.','<b>Commodity prices</b>: merchant paper, plastic and metal are the swing.','<b>Scale &amp; automation</b>: a large, low-labour line gives operating leverage and recovery.','<b>Diversion mandate</b>: the near-zero-landfill target underpins durable throughput.'],
    src:'Figures from public sources on <a href="https://www.beeah.ae/" target="_blank" rel="noopener">Bee\'ah</a> (Sharjah Environment Company) and its material recovery facility. Figures are approximate and illustrative.',
    econ:{cur:'AED', stream:'mixed waste', off:'paper / plastic / metal',
      ktDef:300,ktMin:120,ktMax:600,ktStep:20, gateDef:90,gateMin:30,gateMax:200,gateStep:5,
      utilDef:88,utilMin:50,utilMax:98,utilStep:1, commodityPerTonne:120, recovery:0.9, procPerTonne:108, fixedOM:5},
    calc:{build:184,grant:34,capex:8,revG:2,floor:24,cap:240,tax:0,exit:7,lev:4,rd:5,amort:3,hold:12},
    map:{footer:GEO.beeah.footer}
  },

  /* ---------- 6 · CHINESE RECYCLING (China · domestic build-out) ---------- */
  cnmrf:{
    name:'Chinese recycling plant', geo:'China', continent:'China', cur:'¥', geoKey:'cnmrf',
    lede:'Having banned imported scrap, China is building <b>domestic recycling</b> at scale: modern sorting and reprocessing plants that take the country\'s own material, earning a gate fee and selling recovered commodities into a vast home market.',
    s1:'<p class="body">In 2018 China\'s <b>National Sword</b> banned most imported scrap, the policy that upended recycling worldwide. The flip side is a vast <b>domestic build-out</b>: with imports gone, China is building modern sorting and reprocessing capacity to recover its own waste, supported by a national push on the <b>circular economy</b> and sorting at source in major cities.</p>'+
       '<p class="body">The model is the dual-revenue processor at enormous scale: a <b>gate fee</b> per tonne (often municipal / policy-driven) plus the <b>sale of recovered commodities</b> into a huge domestic manufacturing market that needs the feedstock. What defines it is <b>scale</b>: a modest gate fee and a thin margin, applied to a colossal tonnage, add up to a vast cash flow, financed at a low cost of capital and driven by policy as much as by commodity markets.</p>',
    facts:[['Domestic','Build-out','post-import-ban'],['Gate + sales','Revenue','two streams'],['Vast','Scale','colossal tonnage'],['Circular economy','Driver','national policy'],['Low','Cost of capital','policy-backed'],['Thin','Margin','commodity-sensitive']],
    s2:'Watch the line. A <b>collection truck</b> tips sorted-at-source recycling onto the infeed; the conveyors run it through the sorting stages to baled <b>commodities</b> for domestic manufacturers, with a residue skip for the reject. <b style="color:#0c8a57">Gate-fee</b> orbs rise at the infeed, <b style="color:#c0902f">commodity</b> orbs at the bales. At this scale even a thin <b style="color:#0c6b4f">margin</b> is a vast cash flow. Drag the capacity, the gate fee and the utilisation.',
    driverLab:'Gate fee', availLab:'Utilisation', hrK:'Gate + commodities', yrS:'gate + commodity sales',
    ledge:{a:'+ gate fee',b:'+ commodities',c:'− sorting'}, demandLabel:'THROUGHPUT',
    preset:'Load China MRF',
    try:'<b>Try this:</b> push the <b>capacity</b>: at Chinese scale, even a thin margin is an enormous absolute cash flow, and a vast domestic market absorbs the recovered commodities. Pull the gate fee down to see the sensitivity; the build-out replaces the lost imports with the country\'s own material. Scale and policy, not price, are the levers.',
    s3:'A Chinese recycling plant charges a <b>gate fee</b> per tonne (often policy-driven) and sells recovered commodities into a vast domestic manufacturing market. The lever is <b>scale and policy</b>: a colossal tonnage means a thin margin is a vast cash flow, and the circular-economy push and sorting-at-source provide the feedstock. The gate fee is the margin; the commodity price is the call; the build-out replacing lost imports is the story.',
    mb:{tag:'Model A · processor with a commodity call', title:'Domestic recycling at scale', body:'A modern, large-scale sorting and reprocessing plant that earns a gate fee (the margin) and sells recovered commodities into a vast home market (the swing), built to recover China\'s own waste after the import ban. Scale and policy drive it; the gate fee limits the downside. <b>This is China\'s domestic recycling build-out</b>.'},
    s4a:'The cost is <b>sorting</b> at scale, power and labour on the line, residue disposal and transport, scaling with tonnes. Commodity revenue, absorbed by a huge domestic manufacturing base, offsets much of it, leaving a <b>thin gate-fee margin</b>, but applied to a colossal tonnage it is a large absolute margin.',
    wfNote:'Operating cost is sorting at scale (power, labour), residue disposal and transport. The gate fee is the margin; commodity sales, into a vast home market, offset the cost. The margin is thin, but the absolute cash flow is vast at this scale.',
    s4b:'The capital is the <b>sorting and reprocessing line</b> at scale, building, conveyors, optical sorters and magnets, financed at a low, policy-backed cost of capital. It is less capital-heavy than incineration; the forward capital is more domestic capacity to replace the lost imports and feed the circular economy.',
    stackH:'The capital · the sorting line', splitL:'Financing', splitR:'policy-backed',
    split:[['s1',58,'Bank / policy debt'],['s2',42,'Sponsor equity']],
    finList:[['','Build-out','domestic, post-import-ban'],['sub','Revenue','gate fee + commodities'],['','Scale','colossal tonnage'],['sub','Driver','circular-economy policy'],['','Cost of capital','low (policy-backed)'],['rest','Margin','thin · large absolute base']],
    finNote:'A Chinese recycling plant is a <b>vast-scale dual-revenue processor</b>: a thin gate-fee margin plus a commodity call, on a colossal tonnage, financed at a low cost of capital. The return is steady and large in absolute terms; the agenda is set by scale and policy rather than price.',
    timeline:[['2017','<b>National Sword</b> announced, scrap-import ban.'],['2018','<b>Import ban</b> takes effect; global recycling reshaped.'],['2019','<b>Domestic sorting-at-source</b> mandated in major cities.'],['2020s','<b>Circular-economy plans</b> drive domestic capacity.'],['2020s','<b>Modern plants</b> recover the country\'s own material.'],['Ongoing','<b>Vast home market</b> absorbs the recovered commodities.']],
    calcNote:'A working model of a <b>domestic recycling build-out plant</b>, on an enterprise-value basis. Revenue is tonnes × (gate fee + commodity value × recovery); the gate fee sets a floor. At this scale the absolute cash flow is vast and the cost of capital is low. Figures are highly illustrative.',
    s6:'Chinese recycling is a thin margin at vast scale. What drives it:',
    breakers:['<b>Scale</b>: a thin margin on a colossal tonnage is the model.','<b>The gate fee</b>, often policy-driven, is the margin and the contracted floor.','<b>Commodity prices &amp; home demand</b>: a vast manufacturing base absorbs the bales.','<b>Cost of capital &amp; policy</b>: low policy-backed funding and the circular-economy push.'],
    src:'Figures are illustrative for China\'s domestic recycling build-out after the National Sword import ban. Given the scale and limited standalone disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', stream:'sorted recycling', off:'paper / plastic / metal',
      ktDef:350,ktMin:120,ktMax:800,ktStep:20, gateDef:300,gateMin:120,gateMax:650,gateStep:10,
      utilDef:86,utilMin:50,utilMax:98,utilStep:1, commodityPerTonne:620, recovery:0.9, procPerTonne:540, fixedOM:12},
    calc:{build:720,grant:140,capex:8,revG:2,floor:55,cap:520,tax:25,exit:6,lev:4,rd:4,amort:3,hold:13},
    map:{footer:GEO.cnmrf.footer}
  }
  };
  var ORDER=['ukmrf','usmrf','brmrf','aumrf','beeah','cnmrf'];

  /* ===================================================================
     MRF RENDERER  (canvas, 720x520), elevation, daytime
     A collection truck tips mixed recycling onto an infeed; conveyor belts
     carry items through sorting stages (trommel, optical, magnet) to stacked
     bales of sorted commodities, with a residue skip. Item flow scales with
     throughput.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  /* belt geometry: a single conveyor line running left→right across the plant */
  var BELT_Y=300, BELT_X0=150, BELT_X1=560;       // main belt run
  var INFEED={x:118,y:296};                         // infeed hopper (truck tips here)
  var STAGES=[                                      // sorting stages along the belt
    {x:236,y:BELT_Y,label:'TROMMEL'},
    {x:330,y:BELT_Y,label:'OPTICAL'},
    {x:424,y:BELT_Y,label:'OPTICAL'},
    {x:512,y:BELT_Y,label:'MAGNET'}
  ];
  /* output bales: distinct commodity colours */
  var BALES=[
    {x:606,y:236,col:'#3f6ea8',label:'PAPER'},      // blue paper
    {x:654,y:236,col:'#e3e6ea',label:'PLASTIC'},    // clear / white plastic
    {x:606,y:300,col:'#b5483a',label:'MIXED'},      // red/green mixed
    {x:654,y:300,col:'#9aa0a6',label:'METAL'}       // silver metal
  ];
  var RESIDUE={x:600,y:392};                         // residue skip
  var items=[];                                      // travelling items on the belt

  function streamCols(){
    var s=GEO[A.geoKey].stream;
    return (s==='plastics') ? ['#d9883c','#3f8fc0','#c8543e','#9aa0a6']
         : (s==='dry-MRF')  ? ['#3f6ea8','#d9d2bf','#c8543e','#9aa0a6']
         :                    ['#3f6ea8','#cf9a4a','#c8543e','#9aa0a6'];
  }

  /* ---- base: factory floor + building shell ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e4e9e1'); g.addColorStop(1,'#d6dfce');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // yard / apron outside the shed
    ctx.fillStyle='rgba(150,160,150,0.10)'; rr(20,430,W-40,70,8); ctx.fill();
    // the shed (building shell)
    ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.strokeStyle='rgba(120,130,120,0.4)'; ctx.lineWidth=1.4;
    rr(96,150,560,272,14); ctx.fill(); ctx.stroke();
    // roof trusses (faint)
    ctx.strokeStyle='rgba(120,135,120,0.12)'; ctx.lineWidth=1;
    for(var x=130;x<650;x+=46){ ctx.beginPath(); ctx.moveTo(x,150); ctx.lineTo(x+28,168); ctx.stroke(); }
    // floor seam under the line
    ctx.strokeStyle='rgba(120,135,120,0.10)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(110,404); ctx.lineTo(642,404); ctx.stroke();
  }

  /* ---- collection truck at the infeed (tipping) ---- */
  function truck(load){
    var x=44, y=296, tip=Math.min(1,0.35+0.65*load), ang=-0.18*tip;
    ctx.save();
    // shadow
    ctx.fillStyle='rgba(40,55,40,0.14)'; ctx.beginPath(); ctx.ellipse(x+24,y+30,40,6,0,0,Math.PI*2); ctx.fill();
    // cab
    ctx.fillStyle='#5f7384'; rr(x-6,y-2,22,30,3); ctx.fill();
    ctx.fillStyle='rgba(190,210,225,0.7)'; rr(x-2,y+2,14,10,2); ctx.fill();
    // tipping body (rotated)
    ctx.save(); ctx.translate(x+20,y+26); ctx.rotate(ang);
    var bg=ctx.createLinearGradient(0,-30,0,4); bg.addColorStop(0,'#8a9aa6'); bg.addColorStop(1,'#6e808d');
    ctx.fillStyle=bg; rr(0,-30,48,34,3); ctx.fill();
    ctx.strokeStyle='rgba(60,75,80,0.4)'; ctx.lineWidth=1; ctx.stroke();
    ctx.restore();
    // wheels
    ctx.fillStyle='#3a4248'; [x+2,x+18,x+40].forEach(function(wx){ ctx.beginPath(); ctx.arc(wx,y+30,5,0,Math.PI*2); ctx.fill(); });
    // tipping stream of mixed material into the hopper
    if(load>0.05){ for(var i=0;i<5;i++){ var t=((T*0.05+i/5)%1); var sx=x+58+t*40, sy=y-6+t*t*30;
      ctx.fillStyle=['#3f6ea8','#cf9a4a','#c8543e','#9aa0a6','#d9d2bf'][i%5]; ctx.globalAlpha=0.6+0.4*(1-t);
      rr(sx,sy,3.4,3.4,1); ctx.fill(); } ctx.globalAlpha=1; }
    ctx.restore();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('COLLECTION',x+22,y-18);
  }

  /* ---- infeed hopper ---- */
  function infeed(load){
    var x=INFEED.x,y=INFEED.y;
    ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(x,y+26,24,5,0,0,Math.PI*2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-22,x,y+22); g.addColorStop(0,'#b9c0bb'); g.addColorStop(1,'#969d97');
    ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(x-22,y-22); ctx.lineTo(x+22,y-22); ctx.lineTo(x+12,y+22); ctx.lineTo(x-12,y+22); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.5)'; ctx.lineWidth=1; ctx.stroke();
    glow(x,y,12+8*load,'rgba(12,138,87,0.30)',0.4+0.4*load);
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 6.5px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('INFEED',x,y+34);
  }

  /* ---- conveyor belts + sorting stages ---- */
  function belt(load){
    // main belt
    ctx.fillStyle='#7c858c'; rr(BELT_X0,BELT_Y-9,BELT_X1-BELT_X0,18,4); ctx.fill();
    ctx.fillStyle='#5f676d'; rr(BELT_X0,BELT_Y-9,BELT_X1-BELT_X0,4,2); ctx.fill();
    // moving belt cleats
    ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=1.4; ctx.setLineDash([4,9]); ctx.lineDashOffset=-(T*(1.2+load*3));
    ctx.beginPath(); ctx.moveTo(BELT_X0,BELT_Y); ctx.lineTo(BELT_X1,BELT_Y); ctx.stroke(); ctx.setLineDash([]);
    // diverter belts to bales (up) and residue (down) near the end
    ctx.strokeStyle='rgba(124,133,140,0.7)'; ctx.lineWidth=8; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(548,BELT_Y); ctx.lineTo(590,256); ctx.stroke();   // up to bales
    ctx.beginPath(); ctx.moveTo(548,BELT_Y); ctx.lineTo(590,384); ctx.stroke();   // down to residue
    ctx.lineCap='butt';
    // sorting stages
    STAGES.forEach(function(s,i){
      ctx.fillStyle='rgba(40,55,40,0.10)'; ctx.beginPath(); ctx.ellipse(s.x,s.y+20,22,4,0,0,Math.PI*2); ctx.fill();
      if(s.label==='TROMMEL'){ // rotating drum
        var g=ctx.createLinearGradient(s.x-22,s.y-22,s.x+22,s.y+10); g.addColorStop(0,'#aab1ac'); g.addColorStop(1,'#878e89');
        ctx.fillStyle=g; rr(s.x-22,s.y-22,44,26,8); ctx.fill();
        ctx.strokeStyle='rgba(90,100,95,0.5)'; ctx.lineWidth=1; for(var k=-18;k<22;k+=6){ ctx.beginPath(); ctx.moveTo(s.x+k,s.y-22); ctx.lineTo(s.x+k-6,s.y+4); ctx.stroke(); }
      } else if(s.label==='MAGNET'){ // magnet drum (eddy / magnet)
        ctx.fillStyle='#7a838a'; rr(s.x-16,s.y-26,32,18,4); ctx.fill();
        ctx.fillStyle='#c8543e'; rr(s.x-12,s.y-22,10,8,2); ctx.fill(); ctx.fillStyle='#3a4248'; rr(s.x+2,s.y-22,10,8,2); ctx.fill();
        glow(s.x,s.y-16,10+6*load,'rgba(200,84,62,0.35)',0.3+0.3*load);
      } else { // optical sorter cabin with a scan-line glow
        var g2=ctx.createLinearGradient(s.x-18,s.y-30,s.x-18,s.y-6); g2.addColorStop(0,'#9aa6ae'); g2.addColorStop(1,'#7d878e');
        ctx.fillStyle=g2; rr(s.x-18,s.y-30,36,22,4); ctx.fill();
        var sc=(T*0.06+i)%1; ctx.strokeStyle='rgba(90,200,255,'+(0.4+0.4*load)+')'; ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.moveTo(s.x-16,s.y-8); ctx.lineTo(s.x-16+32*sc,s.y-8); ctx.stroke();
      }
      ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 6px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(s.label,s.x,s.y+28);
    });
  }

  /* ---- travelling items on the belt (intensity scales with throughput) ---- */
  function flowItems(load){
    var C=streamCols(), target=Math.round(4+load*22);
    // spawn / maintain item population
    while(items.length<target){ items.push({f:Math.random(),lane:(Math.random()*3-1),col:C[(Math.random()*C.length)|0],sz:2+Math.random()*2.4}); }
    while(items.length>target) items.pop();
    var speed=0.0016+load*0.006;
    items.forEach(function(it){
      if(_anim){ it.f+=speed; if(it.f>1){ it.f-=1; it.col=C[(Math.random()*C.length)|0]; it.lane=(Math.random()*3-1); } }
      var x=BELT_X0+(BELT_X1-BELT_X0)*it.f, y=BELT_Y-3+it.lane*2.6;
      ctx.fillStyle=it.col; ctx.globalAlpha=0.92; rr(x,y-it.sz/2,it.sz,it.sz,1); ctx.fill();
    });
    ctx.globalAlpha=1;
  }

  /* ---- output bales (stacked, distinct commodity colours) ---- */
  function bales(load){
    BALES.forEach(function(b){
      ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(b.x,b.y+16,18,4,0,0,Math.PI*2); ctx.fill();
      // a stack of three baled cubes
      for(var r=0;r<3;r++){ for(var c=0;c<2;c++){
        var bx=b.x-16+c*17, by=b.y+10-r*11;
        var g=ctx.createLinearGradient(bx,by-9,bx,by); g.addColorStop(0,b.col); g.addColorStop(1,shade(b.col,-22));
        ctx.fillStyle=g; rr(bx,by-9,15,10,1.5); ctx.fill();
        ctx.strokeStyle='rgba(40,45,40,0.25)'; ctx.lineWidth=0.7; ctx.stroke();
        // baling wires
        ctx.strokeStyle='rgba(60,60,60,0.35)'; ctx.beginPath(); ctx.moveTo(bx+5,by-9); ctx.lineTo(bx+5,by); ctx.moveTo(bx+10,by-9); ctx.lineTo(bx+10,by); ctx.stroke();
      } }
      ctx.fillStyle='rgba(70,90,80,0.75)'; ctx.font='700 6px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(b.label,b.x-1,b.y+26);
      if(load>0.05) glow(b.x-1,b.y-2,14+8*load,'rgba(192,144,47,'+(0.10+0.18*load)+')');
    });
  }
  function shade(hex,amt){
    var h=hex.replace('#',''); if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);
    r=Math.max(0,Math.min(255,r+amt)); g=Math.max(0,Math.min(255,g+amt)); b=Math.max(0,Math.min(255,b+amt));
    return 'rgb('+r+','+g+','+b+')';
  }

  /* ---- residue skip ---- */
  function residue(load){
    var x=RESIDUE.x,y=RESIDUE.y;
    ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(x,y+14,26,4,0,0,Math.PI*2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-14,x,y+12); g.addColorStop(0,'#8a8278'); g.addColorStop(1,'#6e675e');
    ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(x-26,y-14); ctx.lineTo(x+26,y-14); ctx.lineTo(x+20,y+12); ctx.lineTo(x-20,y+12); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(80,72,64,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // residue heap
    ctx.fillStyle='rgba(110,98,84,0.8)'; for(var i=0;i<6;i++){ var rx=x-16+i*6+((i*7)%5), ry=y-12-((i*3)%5); rr(rx,ry,4,4,1); ctx.fill(); }
    ctx.fillStyle='rgba(80,72,64,0.75)'; ctx.font='700 6px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('RESIDUE',x,y+24);
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ gate fee',b:'+ commodities',c:'− sorting'};
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
    var ktCap=parseFloat(sCap.value), gate=parseFloat(sSpread.value), util=parseFloat(sAvail.value)/100;
    // visual load: throughput intensity (slightly breathing for life)
    var loadVis=Math.max(0.05,Math.min(1, util*(0.92+0.12*Math.sin(T*0.02))));

    ctx.clearRect(0,0,W,H);
    drawMap();
    truck(loadVis); infeed(loadVis); belt(loadVis); flowItems(loadVis); bales(loadVis); residue(loadVis);

    // ---- economics (gate fee + commodity sales) ----
    var tonnes=ktCap*1000*util;                          // material processed per year
    var gateRev=tonnes*gate;                              // contracted gate fee (the stable core)
    var commodityRev=tonnes*(E.commodityPerTonne||0)*(E.recovery||0.9);  // recovered-commodity sales (merchant)
    var grossRev=gateRev+commodityRev;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));  // floor = contracted gate-fee minimum
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var procCost=tonnes*(E.procPerTonne||0), fixedOM=(E.fixedOM||0)*1e6, opex=procCost+fixedOM;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // split of "+cash": gate fee vs commodities
    var gateShare=grossRev>0?Math.max(0.1,Math.min(0.9,gateRev/grossRev)):0.5;
    var c_proc=opex>0?procCost*0.62:0, c_resid=procCost*0.22, c_trans=procCost*0.16+0, c_fix=fixedOM;

    if(_anim){
      // gate-fee (green) orbs at the infeed, commodity (amber) at the bales
      if(Math.random()<0.55){ if(Math.random()<gateShare) spawnCoin(INFEED.x,INFEED.y-6,'ret',-1);
        else { var b=BALES[(Math.random()*BALES.length)|0]; spawnCoin(b.x,b.y-8,'rec',-1); } }
      var outRate=Math.max(0.05,Math.min(0.65, opex/Math.max(1,revenue)));
      if(Math.random()<outRate){ var src=Math.random()<0.5?STAGES[(Math.random()*STAGES.length)|0]:RESIDUE;
        spawnCoin(src.x,src.y+6,'cost',1); }
      demHist.push(loadVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(loadVis);

    // growth marker
    if(G.growing){ var pul=0.5+0.5*Math.sin(T*0.12);
      ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText(G.automated?'+ NEW LINE':'+ UPGRADE',410,176); ctx.restore();
      glow(410,184,8,'rgba(12,107,79,'+(0.22+0.28*pul)+')'); }

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+ktCap+' kt/yr',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',ktCap+' kt/yr'); set('ixSpreadV',CUR+Math.round(gate)+'/t'); set('ixAvailV',Math.round(util*100)+'%');
    set('ixDir',ktCap+' kt/yr'); set('ixDirS',(E.stream||'')+' · '+(E.off||''));
    set('ixMW',Math.round(tonnes/1000)+' kt sorted'); set('ixMWs',Math.round(util*100)+'% utilisation / yr');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Sorting',c_proc],['Residue disposal',c_resid],['Transport',c_trans],['Fixed O&amp;M',c_fix]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the margin is too thin to value: raise the gate fee or the utilisation, or lower the sorting cost.</span>'; return; }
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
    A=ASSETS[key]; CUR=A.cur; coins=[]; demHist=[]; items=[];
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
    sAvail.min=E.utilMin; sAvail.max=E.utilMax; sAvail.step=E.utilStep; sAvail.value=E.utilDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative: revenue is material processed (capacity × utilisation) × (gate fee + recovered-commodity value) (with a floor for the contracted gate fee) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }
  function layout(){ items=[]; }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.ktDef; sSpread.value=E.gateDef; sAvail.value=E.utilDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'ukmrf');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
