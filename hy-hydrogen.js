/* Green hydrogen — data-driven worked examples.
   Six real electrolytic (green) H2 projects, one continent each, one template.
   Scene config from hy-geo.js (GEO), drawn top-down in 720x520 scene coords: a
   renewable power source (solar / wind) feeds power into a row of electrolyser
   stacks that fizz with H2 bubbles when running, then on to storage tanks and an
   offtake (pipeline / truck / ship / ammonia). This is the GREEN-HYDROGEN SPREAD
   business: revenue is H2 sold (load factor × hours × electrolyser MW × kg/MWh)
   × the H2 price, with a contracted offtake floor; the dominant cost is the
   ELECTRICITY input, so the margin is the thin, power-cost-sensitive spread
   between the H2 price and the power needed. The returns model is a simplified
   DCF. Green H2 leans on grants/PTC/IPCEI and an offtake floor to work at all. */
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
  function h2t(kg){ // H2 mass per year: kt or t
    return kg>=1e6?(kg/1e6).toFixed(kg>=1e7?0:1)+' kt/yr':(kg>=1e3?Math.round(kg/1e3)+' t/yr':Math.round(kg)+' kg/yr'); }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · EUROPEAN ELECTROLYSER (Europe · IPCEI / H2Global) ---------- */
  euroh2:{
    name:'European electrolyser', geo:'Germany / Netherlands', continent:'Europe', cur:'€', geoKey:'euroh2',
    lede:'A European <b>green-hydrogen</b> plant — electrolysers run on renewable power to split water into hydrogen — that only works on a stack of support: <b>IPCEI grants</b>, an <b>H2Global-style offtake</b> contract and a relentless focus on cheap power, because Europe\'s power is dear.',
    s1:'<p class="body"><b>Green hydrogen</b> is made by running <b>electrolysers</b> on (renewable) electricity to split water into hydrogen and oxygen. The hydrogen can decarbonise industry — steel, refining, ammonia, chemicals — that cannot easily electrify. A European project couples electrolysers to wind and grid power, stores the H2, and pipes or trucks it to an industrial offtaker.</p>'+
       '<p class="body">The economics are a <b>spread</b> business, and a hard one: the dominant cost is <b>electricity</b>, and the margin is the gap between the <b>H2 sale price</b> and the power needed to make it (~55&nbsp;kWh per kg). In Europe power is expensive and the H2 price still emerging, so the spread is thin — the project leans on <b>capital grants</b> (the EU\'s IPCEI hydrogen schemes) and a <b>contracted offtake floor</b> (such as the H2Global auction, which pays a fixed price for green H2) to make the numbers work. It is an early-stage, subsidised, offtake-contracted asset.</p>',
    facts:[['Electrolysers','Plant','renewable-powered'],['H2 spread','Margin','price − power cost'],['IPCEI','Grant','EU capital subsidy'],['H2Global','Offtake','contracted floor'],['Dear power','Risk','the dominant cost'],['~30–45%','Load factor','renewable-tied']],
    s2:'Watch the plant. The <b>wind</b> feeds power (cyan pulses) into a row of <b>electrolyser modules</b> that fizz with hydrogen bubbles as they run — the harder they run (the <b>load factor</b>), the more they bubble. The H2 fills the storage tanks and leaves by pipeline (amber). The <b style="color:#0c6b4f">margin</b> is the thin spread of the H2 price over the power cost — and the red <b style="color:#bc4733">power-cost</b> orbs draining away show why it is so tight. Drag the electrolyser size, the H2 price and the load factor.',
    driverLab:'H2 price', availLab:'Load factor', hrK:'Hydrogen revenue', yrS:'H2 sold × price',
    ledge:{a:'+ H2 sales',b:'+ subsidy/PTC',c:'− power & opex'}, demandLabel:'LOAD FACTOR',
    preset:'Load European electrolyser',
    try:'<b>Try this:</b> drop the <b>H2 price</b> a notch and watch the spread collapse — at a low price the power cost swamps the revenue and EBITDA turns negative, and the model returns nothing to value. That is the whole green-H2 problem. Now lift the <b>load factor</b> (more renewable hours) and lean on the grant and the offtake floor: only the combination of cheap-ish power, a decent H2 price, the subsidy and the floor makes a European project clear a single-digit return.',
    s3:'A European electrolyser sells <b>hydrogen per kg</b> under a contracted offtake (an H2Global-style fixed price, or a long industrial contract) and earns the <b>spread</b> over its power cost. With expensive European power the spread is thin, so the project depends on <b>IPCEI capital grants</b> to cut the net build and on the <b>offtake floor</b> to underwrite the price. The levers are the power cost, the H2 price, the load factor (renewable availability) and the depth of subsidy.',
    mb:{tag:'Model B · subsidised European H2', title:'Grant-backed European electrolyser', body:'A renewable-powered electrolyser selling green hydrogen per kg under a contracted (H2Global-style) offtake, earning a thin spread over dear power — made bankable only by IPCEI capital grants and the offtake floor. <b>This is a European green-H2 project</b>.'},
    s4a:'The dominant cost is <b>electricity</b> — power is most of the cost base, which is why the margin is lower than wind or solar and so sensitive to the power price. Electrolyser O&amp;M (stack replacement, water treatment) and fixed costs are smaller. The spread over power sets the margin, and cheap renewable power is the whole game.',
    wfNote:'Operating cost is dominated by <b>electricity</b> — the power to run the electrolysers — plus electrolyser O&amp;M and fixed costs. The margin is the thin H2 spread (price minus power), which is why a low H2 price or dear power tips the project into loss.',
    s4b:'The capital is the <b>electrolyser stacks and balance-of-plant</b> (~€1–2m per MW) plus compression, storage and the offtake connection. <b>IPCEI capital grants</b> fund a meaningful slice, cutting the net entry; without them a European project does not clear its cost of capital. Each added module earns the same thin, subsidised spread.',
    stackH:'The capital · electrolysers + BoP', splitL:'Financing', splitR:'grant-backed',
    split:[['s1',55,'Project debt'],['s2',45,'Equity (post-grant)']],
    finList:[['','Plant','renewable-powered electrolysers'],['sub','Grant','IPCEI capital subsidy'],['','Offtake','H2Global-style floor'],['sub','Cost','electricity (dominant)'],['','Margin','thin H2 spread'],['rest','Stage','early, subsidised']],
    finNote:'A European green-H2 project is a <b>subsidised, offtake-contracted spread asset</b>: a thin margin over dear power, made bankable by IPCEI grants and a contracted floor. The risks are the power cost, the H2 price and the depth and durability of support.',
    timeline:[['2020','<b>EU Hydrogen Strategy</b> sets electrolyser targets.'],['2022','<b>IPCEI Hy2</b> waves approve state aid for projects.'],['2023','<b>H2Global</b> first auctions a fixed green-H2 offtake.'],['2024','<b>FID</b> on first large European electrolysers.'],['2020s','<b>Build-out</b> as grants and offtake mature.'],['2030','<b>Cost-down</b> target as scale and power costs improve.']],
    calcNote:'A working model of a <b>subsidised European electrolyser</b>. Revenue is H2 sold (MW × hours × load factor × kg/MWh) × the H2 price, with a contracted offtake floor; the dominant cost is electricity, so the margin is a thin, power-sensitive spread. A capital grant cuts the net build — without it the return does not clear.',
    s6:'A European electrolyser is a thin, subsidised H2 spread over dear power. What drives it:',
    breakers:['<b>The H2 spread</b> — price minus power; power is most of the cost, so the margin is thin.','<b>Power cost &amp; load factor</b> — cheap renewable power and high running hours are everything.','<b>Subsidy depth</b> — IPCEI grants cut the net build and make it bankable.','<b>Offtake floor</b> — an H2Global-style contracted price underwrites the revenue.'],
    src:'Figures are illustrative for a European green-hydrogen project under IPCEI and <a href="https://www.h2-global.org/" target="_blank" rel="noopener">H2Global</a>-style support. Green-H2 economics are early-stage and marginal; all figures here are approximate and illustrative.',
    econ:{cur:'€', power:'wind + grid', offtake:'pipeline',
      mwDef:200,mwMin:50,mwMax:600,mwStep:10, priceDef:6,priceMin:3,priceMax:11,priceStep:0.25,
      lfDef:42,lfMin:25,lfMax:60,lfStep:1, kgPerMWh:18, powerPrice:48, omPerMW:34, fixedOM:9},
    calc:{build:420,grant:120,capex:9,revG:2,floor:50,cap:600,tax:25,exit:10,lev:4,rd:5.5,amort:2,hold:20},
    map:{footer:GEO.euroh2.footer}
  },

  /* ---------- 2 · US GULF COAST GREEN H2 (North America · IRA 45V PTC) ---------- */
  gulfh2:{
    name:'US Gulf Coast green H2', geo:'Texas / Louisiana, USA', continent:'North America', cur:'US$', geoKey:'gulfh2',
    lede:'A US Gulf Coast <b>green-hydrogen</b> plant where the <b>IRA 45V production tax credit</b> transforms the economics — a per-kg credit on clean hydrogen that can be worth as much as the H2 itself, turning a marginal spread into a real return.',
    s1:'<p class="body">The US Gulf Coast is the natural home of American hydrogen: existing pipelines, salt-cavern storage and a wall of industrial offtake — refineries, ammonia and chemicals — already consume vast quantities of (grey) H2. A <b>green-hydrogen</b> project couples electrolysers to cheap Texan solar and wind and feeds clean H2 into that existing demand.</p>'+
       '<p class="body">What changes the maths is the <b>Inflation Reduction Act\'s 45V production tax credit</b> — a per-kilogram credit (up to ~$3/kg) paid on clean hydrogen for a decade. On a thin power-cost spread, a credit of that size is enormous: it is effectively a second revenue stream that can rival the H2 sale price itself. The model is still the green-H2 <b>spread</b> over power, but the PTC and cheap Gulf renewables lift it from marginal to genuinely investable.</p>',
    facts:[['Electrolysers','Plant','solar + wind powered'],['45V PTC','Subsidy','up to ~$3/kg'],['Gulf Coast','Location','pipelines + storage'],['Industrial','Offtake','refining · ammonia'],['Cheap power','Edge','Texan renewables'],['H2 spread','Margin','price + PTC − power']],
    s2:'Watch the plant. Cheap <b>solar and wind</b> feed power (cyan) into the <b>electrolyser modules</b>, which fizz with hydrogen as they run, fill the storage tanks and pipe H2 (amber) into the Gulf\'s industrial network. Here the green <b style="color:#0c6b4f">+ subsidy</b> orbs — the 45V PTC — are large and steady, lifting a thin power-cost spread into a real margin. Drag the electrolyser size, the H2 price and the load factor.',
    driverLab:'H2 price', availLab:'Load factor', hrK:'Hydrogen revenue', yrS:'H2 sold × price',
    ledge:{a:'+ H2 sales',b:'+ 45V PTC',c:'− power & opex'}, demandLabel:'LOAD FACTOR',
    preset:'Load Gulf Coast H2',
    try:'<b>Try this:</b> the magic here is the <b>PTC</b> (modelled as a high revenue floor). Even at a modest H2 price the contracted credit holds the revenue up, so the spread survives where a European project\'s would collapse. Push the load factor — more clean MWh means more PTC-eligible kg — and notice the Gulf works on cheaper power plus the credit, not on a high H2 price.',
    s3:'A US Gulf Coast green-H2 project sells <b>hydrogen per kg</b> into existing industrial demand and earns the <b>spread</b> over cheap Texan power — then stacks the <b>45V production tax credit</b> on top, a per-kg payment that can rival the H2 price itself. The PTC and low power cost are what turn a marginal green-H2 spread into a real return; the levers are the power cost, the load factor and the size and durability of the credit.',
    mb:{tag:'Model B · PTC-driven US H2', title:'45V-credit green-hydrogen plant', body:'A Gulf Coast electrolyser selling green hydrogen per kg into existing industrial demand, earning a spread over cheap power — and stacking the IRA 45V production tax credit, a per-kg payment that transforms the economics. <b>This is US Gulf Coast green H2</b>.'},
    s4a:'The dominant cost is still <b>electricity</b>, but cheap Gulf solar and wind make it lower than Europe\'s, and the <b>45V PTC</b> effectively adds to revenue rather than cutting cost. Electrolyser O&amp;M and fixed costs are modest. The spread plus the credit set the margin — higher and more durable than an unsubsidised project.',
    wfNote:'Operating cost is dominated by <b>electricity</b>, plus electrolyser O&amp;M and fixed costs. The margin is the H2 spread over cheap power — and the 45V PTC (modelled in the revenue floor) lifts the effective margin well above an unsubsidised project.',
    s4b:'The capital is the <b>electrolysers and balance-of-plant</b> plus compression and the tie-in to existing Gulf pipelines and storage — a real advantage, since the offtake infrastructure already exists. A modest capital grant and the per-kg <b>45V credit</b> over the hold underwrite the economics; each module earns the spread plus the credit.',
    stackH:'The capital · electrolysers + tie-in', splitL:'Financing', splitR:'PTC-backed',
    split:[['s1',60,'Project debt'],['s2',40,'Sponsor equity']],
    finList:[['','Plant','solar + wind electrolysers'],['sub','Subsidy','45V PTC (up to ~$3/kg)'],['','Offtake','Gulf industrial demand'],['sub','Cost','electricity (cheaper)'],['','Storage','salt caverns + pipelines'],['rest','Margin','spread + credit']],
    finNote:'A US Gulf Coast green-H2 project is a <b>PTC-transformed spread asset</b>: a thin power spread lifted into a real return by the 45V credit, cheap renewables and existing offtake. The risks are the durability of the credit, the power cost and the pace of clean-H2 demand.',
    timeline:[['2022','<b>IRA</b> creates the 45V clean-hydrogen PTC (up to ~$3/kg).'],['2023','<b>Gulf Coast projects</b> announced around existing demand.'],['2024','<b>45V guidance</b> defines clean-power qualification.'],['2024','<b>FID</b> on first PTC-backed electrolysers.'],['2020s','<b>Build-out</b> into refining and ammonia offtake.'],['2030s','<b>PTC step-down</b> as costs fall and scale builds.']],
    calcNote:'A working model of a <b>45V-credit green-H2 project</b>. Revenue is H2 sold × price, but a high revenue floor models the per-kg 45V PTC — so the spread survives a modest H2 price. The dominant cost is electricity (cheaper Gulf power); the credit lifts the effective margin.',
    s6:'US Gulf Coast green H2 is a thin spread transformed by the 45V credit. What drives it:',
    breakers:['<b>The 45V PTC</b> — a per-kg credit that can rival the H2 price and remakes the economics.','<b>Cheap power</b> — low Texan solar and wind costs widen the underlying spread.','<b>Existing offtake</b> — Gulf pipelines, storage and industrial demand de-risk the route.','<b>Credit durability</b> — the value hinges on the PTC holding for the hold period.'],
    src:'Figures are illustrative for a US Gulf Coast green-hydrogen project under the <a href="https://www.irs.gov/" target="_blank" rel="noopener">IRA 45V</a> production tax credit. Green-H2 economics are early-stage; all figures here are approximate and illustrative.',
    econ:{cur:'US$', power:'solar + wind', offtake:'pipeline',
      mwDef:300,mwMin:75,mwMax:800,mwStep:25, priceDef:5,priceMin:2.5,priceMax:9,priceStep:0.25,
      lfDef:48,lfMin:30,lfMax:62,lfStep:1, kgPerMWh:18, powerPrice:34, omPerMW:30, fixedOM:11},
    calc:{build:700,grant:120,capex:9,revG:2,floor:110,cap:800,tax:25,exit:10,lev:4.5,rd:6,amort:2,hold:20},
    map:{footer:GEO.gulfh2.footer}
  },

  /* ---------- 3 · HIF / ATACAMA (South America · cheap renewables, e-fuels) ---------- */
  atacama:{
    name:'HIF / Atacama green H2', geo:'Atacama, Chile', continent:'South America', cur:'US$', geoKey:'atacama',
    lede:'In Chile\'s <b>Atacama</b> — among the cheapest solar and best wind on Earth — green hydrogen is made not for pipelines but for <b>e-fuels and ammonia export</b>, turning world-class renewables into a shippable molecule.',
    s1:'<p class="body">Chile has a rare resource: the <b>Atacama</b> desert\'s record solar and Patagonian wind give some of the lowest renewable power costs anywhere. That cheap power is the key input to green hydrogen, and Chile\'s plan is to <b>export</b> it — but hydrogen is hard to ship, so projects such as <b>HIF</b> convert it into <b>e-fuels</b> (synthetic methanol/gasoline) or <b>ammonia</b>, which move by tanker.</p>'+
       '<p class="body">The economics are the green-H2 <b>spread</b> with the best possible input: when power is genuinely cheap, the gap between the product price and the power cost finally opens up. The H2 is an intermediate — the revenue comes from the e-fuel or ammonia sold to export markets under offtake — but the engine is the same: electrolysers, a power cost that is the dominant line, and a spread that, with Atacama power, can actually work.</p>',
    facts:[['Electrolysers','Plant','Atacama solar + wind'],['Cheapest power','Edge','world-class renewables'],['e-fuels / NH3','Product','shippable molecule'],['Export','Offtake','to global markets'],['H2 spread','Margin','wider on cheap power'],['~40–55%','Load factor','high solar + wind']],
    s2:'Watch the plant. World-class Atacama <b>solar and wind</b> pour power (cyan) into the <b>electrolyser modules</b>, which fizz hard with hydrogen, fill the tanks and feed an <b>ammonia / e-fuels</b> train that ships the molecule out (amber). With genuinely cheap power the <b style="color:#0c6b4f">spread</b> finally opens — fewer red power-cost orbs relative to revenue than Europe. Drag the electrolyser size, the H2 price and the load factor.',
    driverLab:'H2 price', availLab:'Load factor', hrK:'Hydrogen revenue', yrS:'H2 sold × price',
    ledge:{a:'+ H2 / e-fuel',b:'+ export premium',c:'− power & opex'}, demandLabel:'LOAD FACTOR',
    preset:'Load HIF Atacama',
    try:'<b>Try this:</b> Atacama\'s advantage is the <b>power cost</b> — it is low, so unlike Europe the spread is positive without leaning hard on subsidy. Push the load factor up (the sun and wind are abundant) and the kg pile up cheaply. But drop the H2 price far enough and even cheap power can\'t save it — green H2 is always a spread, and the spread can still collapse.',
    s3:'A Chilean Atacama project makes green hydrogen on <b>world-class cheap power</b>, then converts it to <b>e-fuels or ammonia</b> for export under offtake. Cheap power is what opens the <b>spread</b> that Europe lacks, so the project leans less on subsidy and more on its resource. The levers are the power cost (already low), the load factor (high solar and wind), the product price and the cost of shipping a green molecule to market.',
    mb:{tag:'Model B · cheap-power export H2', title:'Atacama green H2 → e-fuels / ammonia', body:'Electrolysers on world-class Atacama solar and wind making green hydrogen, converted to e-fuels or ammonia and exported under offtake — a wider spread because the power is genuinely cheap. <b>This is HIF / Atacama</b>.'},
    s4a:'The dominant cost is still <b>electricity</b> — but Atacama power is so cheap that the spread over it is wider than almost anywhere. Electrolyser and conversion (ammonia / e-fuel synthesis) O&amp;M add to the cost base. The low power cost is the whole edge: it is what lets a green-H2 spread clear without deep subsidy.',
    wfNote:'Operating cost is dominated by <b>electricity</b>, plus electrolyser and conversion O&amp;M. The margin is the H2 spread over Atacama\'s world-class cheap power — wider than Europe, which is why the project works more on resource than on subsidy.',
    s4b:'The capital is the <b>electrolysers and balance-of-plant</b> plus the e-fuel / ammonia conversion train and export logistics — heavier than a bare electrolyser, but the cheap power and export premium support it. A modest grant and a long export offtake underwrite the build; each module earns the wider Atacama spread.',
    stackH:'The capital · electrolysers + conversion', splitL:'Financing', splitR:'resource-backed',
    split:[['s1',55,'Project / export debt'],['s2',45,'Sponsor equity']],
    finList:[['','Plant','Atacama solar + wind electrolysers'],['sub','Product','e-fuels / ammonia'],['','Power cost','world-class low'],['sub','Offtake','export to global markets'],['','Margin','wider H2 spread'],['rest','Grant','modest']],
    finNote:'An Atacama green-H2 project is a <b>resource-backed spread asset</b>: a wider margin because the power is genuinely cheap, exported as a shippable molecule. The risks are the product price, the cost of conversion and shipping, and execution in a remote location.',
    timeline:[['2021','<b>Chile</b> launches its national green-hydrogen strategy.'],['2021','<b>HIF Haru Oni</b> pilot makes e-fuel from green H2.'],['2022','<b>Atacama / Patagonia</b> projects scale up.'],['2023','<b>Export offtake</b> contracts to Europe and Asia.'],['2020s','<b>Ammonia &amp; e-fuel</b> trains for shippable export.'],['2030s','<b>Scale</b> on world-class renewable cost.']],
    calcNote:'A working model of a <b>cheap-power export green-H2 project</b>. Revenue is H2 sold × price (as e-fuel / ammonia) with an export-offtake floor; the dominant cost is electricity, but Atacama\'s low power cost widens the spread so the project leans less on subsidy.',
    s6:'Atacama green H2 is a wider spread on world-class cheap power. What drives it:',
    breakers:['<b>Cheap power</b> — Atacama solar and Patagonian wind are the whole edge.','<b>The H2 spread</b> — wide because power is cheap, but still a spread that can collapse.','<b>Conversion &amp; shipping</b> — e-fuel / ammonia logistics are the cost of exporting a molecule.','<b>Export offtake</b> — long contracts to Europe and Asia underwrite the revenue.'],
    src:'Figures are illustrative for a Chilean Atacama green-hydrogen / e-fuels project (e.g. <a href="https://www.hifglobal.com/" target="_blank" rel="noopener">HIF</a>). Green-H2 export economics are early-stage; all figures here are approximate and illustrative.',
    econ:{cur:'US$', power:'solar + wind', offtake:'ammonia',
      mwDef:400,mwMin:100,mwMax:1000,mwStep:25, priceDef:5,priceMin:2.5,priceMax:9.5,priceStep:0.25,
      lfDef:50,lfMin:32,lfMax:65,lfStep:1, kgPerMWh:18, powerPrice:26, omPerMW:32, fixedOM:14},
    calc:{build:1040,grant:120,capex:9,revG:3,floor:80,cap:900,tax:27,exit:10,lev:4,rd:7,amort:2,hold:20},
    map:{footer:GEO.atacama.footer}
  },

  /* ---------- 4 · MURCHISON / CWP (Oceania · giant export-scale green H2/NH3) ---------- */
  murchison:{
    name:'Murchison / CWP green H2', geo:'Western Australia', continent:'Oceania', cur:'A$', geoKey:'murchison',
    lede:'In Western Australia\'s <b>Murchison</b>, green hydrogen is conceived at <b>giant export scale</b> — gigawatts of solar and wind feeding electrolysers to make green ammonia for shipment to Asia.',
    s1:'<p class="body">Western Australia pairs vast land with excellent, complementary <b>solar and wind</b>, and projects such as <b>Murchison</b> (developed by CWP) are designed to exploit it at <b>gigawatt scale</b>: enormous renewable arrays power large electrolyser fleets to make green hydrogen, which is converted to <b>green ammonia</b> and shipped to energy-importing Asia.</p>'+
       '<p class="body">The economics are the green-H2 <b>spread</b>, but the bet is <b>scale and resource</b>: huge, low-cost renewables widen the spread, and gigawatt volumes spread the fixed cost of conversion and export. The power cost is still the dominant line, and the project must contract long export offtake to be bankable. It is early-stage and capital-heavy, but the resource and the scale are what make Australia a leading green-ammonia export contender.</p>',
    facts:[['GW-scale','Plant','giant solar + wind'],['Green ammonia','Product','for shipment'],['Export','Offtake','to Asia'],['H2 spread','Margin','price − power cost'],['Scale','Edge','spreads fixed cost'],['~40–55%','Load factor','hybrid renewables']],
    s2:'Watch the plant. Gigawatts of <b>solar and wind</b> drive power (cyan) into a long row of <b>electrolyser modules</b> that fizz with hydrogen, fill huge tanks and feed an <b>ammonia</b> train and a waiting <b>ship</b> (amber) bound for Asia. At this scale the absolute spread is large even if the margin is thin. Drag the electrolyser size — more MW means more modules — the H2 price and the load factor.',
    driverLab:'H2 price', availLab:'Load factor', hrK:'Hydrogen revenue', yrS:'H2 sold × price',
    ledge:{a:'+ H2 / ammonia',b:'+ export offtake',c:'− power & opex'}, demandLabel:'LOAD FACTOR',
    preset:'Load Murchison',
    try:'<b>Try this:</b> push the <b>electrolyser size</b> to the top — Australia\'s bet is <b>scale</b>, and at gigawatts even a thin spread is a large absolute EBITDA. But the spread is still set by the power cost: the resource (cheap hybrid solar + wind) is what keeps it positive, and a low H2 price will still drag the margin down. Export offtake to Asia is what underwrites it.',
    s3:'A Western Australian project makes green hydrogen at <b>gigawatt scale</b> on huge, cheap solar and wind, converts it to <b>green ammonia</b> and ships it to Asia under long export offtake. The bet is scale and resource: low-cost renewables widen the <b>spread</b> and volume spreads the fixed cost. The power cost is still the dominant line; the levers are the power cost, the load factor, the H2 / ammonia price and the export contracts.',
    mb:{tag:'Model B · export-scale green NH3', title:'Gigawatt green hydrogen → ammonia', body:'Gigawatts of solar and wind powering large electrolyser fleets to make green hydrogen, converted to green ammonia and shipped to Asia under long offtake — a thin spread at giant scale. <b>This is Murchison / CWP</b>.'},
    s4a:'The dominant cost is <b>electricity</b>; at gigawatt scale the cheap, complementary solar-and-wind resource keeps the spread positive, and volume spreads the fixed cost of electrolysers, ammonia synthesis and export. Conversion and O&amp;M add to the base. The margin is thin but the absolute cash flow is large.',
    wfNote:'Operating cost is dominated by <b>electricity</b>, plus electrolyser and ammonia-synthesis O&amp;M. The margin is the H2 spread over cheap WA power — thin per kg, but at gigawatt scale the absolute EBITDA is large.',
    s4b:'The capital is enormous — <b>gigawatts of electrolysers and balance-of-plant</b>, ammonia synthesis, storage, port and export logistics. Scale and a long export offtake are what make it financeable; grants help at the margin. Each gigawatt earns the same thin spread over a vast volume.',
    stackH:'The capital · GW electrolysers + export', splitL:'Financing', splitR:'export-backed',
    split:[['s1',60,'Project / export-credit debt'],['s2',40,'Sponsor & partner equity']],
    finList:[['','Plant','GW solar + wind electrolysers'],['sub','Product','green ammonia'],['','Offtake','export to Asia'],['sub','Cost','electricity (dominant)'],['','Edge','scale + resource'],['rest','Stage','early, capital-heavy']],
    finNote:'A Murchison-scale green-H2 project is an <b>export-scale spread asset</b>: a thin per-kg margin over cheap WA power, large in absolute terms through gigawatt volume. The risks are the H2 / ammonia price, the power cost, the export offtake and the sheer scale of execution.',
    timeline:[['2020','<b>WA green-H2 hubs</b> announced at gigawatt scale.'],['2021','<b>Murchison / CWP</b> and peers begin development.'],['2022','<b>Green ammonia</b> export targets set for Asia.'],['2020s','<b>Renewable arrays</b> and electrolyser fleets scoped.'],['2020s','<b>Export offtake</b> with Asian buyers.'],['2030s','<b>Gigawatt FID</b> as offtake and cost align.']],
    calcNote:'A working model of an <b>export-scale green-H2 / ammonia project</b>. Revenue is H2 sold × price (as ammonia) with an export-offtake floor; the dominant cost is electricity. The spread is thin per kg, but gigawatt scale makes the absolute cash flow large.',
    s6:'Murchison is export-scale green ammonia — thin spread, giant volume. What drives it:',
    breakers:['<b>Scale</b> — gigawatt volume turns a thin spread into a large absolute cash flow.','<b>Cheap hybrid power</b> — complementary WA solar and wind keep the spread positive.','<b>The H2 / ammonia price</b> — the product price against the power cost is the margin.','<b>Export offtake</b> — long Asian contracts are what make giant scale bankable.'],
    src:'Figures are illustrative for a Western Australian export-scale green-hydrogen / ammonia project (e.g. <a href="https://www.cwp.global/" target="_blank" rel="noopener">CWP</a> Murchison). Such projects are early-stage; all figures here are approximate and illustrative.',
    econ:{cur:'A$', power:'solar + wind', offtake:'ship',
      mwDef:1000,mwMin:200,mwMax:3000,mwStep:100, priceDef:5,priceMin:2.5,priceMax:9.5,priceStep:0.25,
      lfDef:48,lfMin:30,lfMax:62,lfStep:1, kgPerMWh:18, powerPrice:30, omPerMW:30, fixedOM:30},
    calc:{build:2300,grant:240,capex:9,revG:3,floor:160,cap:2400,tax:30,exit:10,lev:4.5,rd:6.5,amort:2,hold:20},
    map:{footer:GEO.murchison.footer}
  },

  /* ---------- 5 · NEOM GREEN HYDROGEN (Middle East · the flagship) ---------- */
  neom:{
    name:'NEOM Green Hydrogen', geo:'NEOM, Saudi Arabia', continent:'Middle East', cur:'SAR', geoKey:'neom',
    lede:'The world\'s flagship green-hydrogen project — <b>NEOM</b> in Saudi Arabia pairs cheap desert <b>solar and wind</b> with gigawatt electrolysis to make <b>green ammonia</b>, sold under a long offtake: the project that set the benchmark for what green H2 can cost.',
    s1:'<p class="body"><b>NEOM Green Hydrogen</b> (a joint venture of ACWA Power, Air Products and NEOM) is the largest green-hydrogen project to reach financial close — gigawatts of <b>solar and wind</b> in the Saudi desert powering electrolysers to make hydrogen, converted on-site to <b>green ammonia</b> for export. It is the flagship: the project that proved a giant green-H2 plant could be financed and built.</p>'+
       '<p class="body">Its edge is the same as the best projects — <b>exceptionally cheap, complementary solar and wind</b> that widen the green-H2 <b>spread</b> — combined with a <b>long, contracted ammonia offtake</b> (Air Products as the offtaker) that underwrites the revenue. The power cost is still the dominant line, but cheap Gulf renewables and a bankable offtake are what made NEOM the reference for green-H2 cost. It is early-stage, capital-heavy, but contracted and at scale.</p>',
    facts:[['Flagship','Project','largest at FID'],['Solar + wind','Power','cheap desert hybrid'],['Green ammonia','Product','export'],['Long offtake','Revenue','Air Products'],['H2 spread','Margin','price − power cost'],['ACWA / AP','Owners','+ NEOM']],
    s2:'Watch the plant. Cheap desert <b>solar and wind</b> pour power (cyan) into a long bank of <b>electrolyser modules</b> that fizz hard with hydrogen, fill the tanks and feed an <b>ammonia</b> train and export (amber). NEOM\'s edge is cheap hybrid power plus a long contracted offtake — the <b style="color:#0c6b4f">spread</b> holds and the floor underwrites it. Drag the electrolyser size, the H2 price and the load factor.',
    driverLab:'H2 price', availLab:'Load factor', hrK:'Hydrogen revenue', yrS:'H2 sold × price',
    ledge:{a:'+ H2 / ammonia',b:'+ offtake floor',c:'− power & opex'}, demandLabel:'LOAD FACTOR',
    preset:'Load NEOM',
    try:'<b>Try this:</b> NEOM works on two things — <b>cheap hybrid power</b> (a positive spread without deep subsidy) and a <b>long contracted offtake</b> (the floor). Drop the load factor and watch the offtake floor hold the revenue up; push the H2 price and watch the spread. It is the benchmark because cheap Gulf renewables and a bankable contract make a gigawatt green-H2 plant actually clear.',
    s3:'NEOM makes green hydrogen at <b>gigawatt scale</b> on cheap desert solar and wind, converts it to <b>green ammonia</b>, and sells it under a <b>long contracted offtake</b> to Air Products. Cheap hybrid power widens the <b>spread</b> and the offtake floor underwrites the price — the combination that made it the first giant green-H2 plant to reach financial close. The levers are the power cost, the load factor, the ammonia price and the offtake.',
    mb:{tag:'Model B · flagship contracted H2', title:'NEOM green hydrogen → ammonia', body:'Gigawatts of cheap desert solar and wind powering electrolysers to make green hydrogen, converted to green ammonia and sold under a long contracted offtake to Air Products — the flagship that set the green-H2 cost benchmark. <b>This is NEOM</b>.'},
    s4a:'The dominant cost is <b>electricity</b>, but NEOM\'s cheap, complementary desert solar and wind keep it low and the spread positive. Electrolyser and ammonia-synthesis O&amp;M add to the base. The long contracted offtake stabilises revenue, so the margin is more durable than an unsubsidised, merchant project.',
    wfNote:'Operating cost is dominated by <b>electricity</b>, plus electrolyser and ammonia-synthesis O&amp;M. The margin is the H2 spread over cheap desert power — held up by a long contracted ammonia offtake (the floor), which is why NEOM could be financed.',
    s4b:'The capital is enormous — gigawatts of <b>electrolysers and balance-of-plant</b>, ammonia synthesis, storage and export. What made it bankable is the <b>long contracted offtake</b> and cheap power, with strong sponsors (ACWA Power, Air Products, NEOM). Each gigawatt earns the spread, underwritten by the offtake.',
    stackH:'The capital · GW electrolysers + ammonia', splitL:'Financing', splitR:'contracted',
    split:[['s1',60,'Project finance (contracted)'],['s2',40,'JV equity (ACWA / AP / NEOM)']],
    finList:[['','Plant','GW desert solar + wind electrolysers'],['sub','Product','green ammonia'],['','Offtake','long contract (Air Products)'],['sub','Cost','electricity (dominant)'],['','Owners','ACWA Power · Air Products · NEOM'],['rest','Status','first giant FID']],
    finNote:'NEOM is the <b>flagship contracted green-H2 asset</b>: a positive spread on cheap desert power, underwritten by a long ammonia offtake at gigawatt scale. The risks are the ammonia price, the power cost and execution — but the offtake and cheap power are what set the benchmark.',
    timeline:[['2020','<b>NEOM Green Hydrogen</b> JV announced (ACWA / Air Products / NEOM).'],['2023','<b>Financial close</b> — the largest green-H2 project to reach FID.'],['2020s','<b>Construction</b> of GW solar, wind and electrolysers.'],['2020s','<b>Air Products offtake</b> for green ammonia.'],['2026','<b>First production</b> targeted.'],['2030s','<b>Ramp</b> to full green-ammonia export.']],
    calcNote:'A working model of the <b>flagship contracted green-H2 / ammonia project</b>. Revenue is H2 sold × price (as ammonia) with a long offtake floor; the dominant cost is electricity, but cheap desert power keeps the spread positive and the contracted offtake underwrites it.',
    s6:'NEOM is the flagship — cheap power plus a long offtake. What drives it:',
    breakers:['<b>Cheap hybrid power</b> — complementary desert solar and wind keep the spread positive.','<b>Contracted offtake</b> — a long ammonia contract (Air Products) underwrites the revenue.','<b>The H2 / ammonia price</b> — the product price against the power cost is the margin.','<b>Scale &amp; sponsors</b> — gigawatt volume and strong owners made the first giant FID bankable.'],
    src:'Figures are illustrative for the <a href="https://www.neomgreenhydrogen.com/" target="_blank" rel="noopener">NEOM Green Hydrogen</a> project (ACWA Power · Air Products · NEOM). Green-H2 economics are early-stage; all figures here are approximate and illustrative.',
    econ:{cur:'SAR', power:'solar + wind', offtake:'ammonia',
      mwDef:1200,mwMin:300,mwMax:3000,mwStep:100, priceDef:5,priceMin:2.5,priceMax:9.5,priceStep:0.25,
      lfDef:50,lfMin:32,lfMax:64,lfStep:1, kgPerMWh:18, powerPrice:26, omPerMW:28, fixedOM:34},
    calc:{build:4400,grant:200,capex:9,revG:3,floor:200,cap:2600,tax:0,exit:10,lev:4.5,rd:5.5,amort:2,hold:22},
    map:{footer:GEO.neom.footer}
  },

  /* ---------- 6 · CHINESE GREEN HYDROGEN (China · scale, renewables/industry) ---------- */
  chinah2:{
    name:'Chinese green hydrogen', geo:'Inner Mongolia / NW China', continent:'China', cur:'¥', geoKey:'chinah2',
    lede:'China is building green hydrogen at <b>continental scale</b> — gigawatt electrolyser projects coupled directly to vast new solar and wind in the north and west, feeding industry and the world\'s biggest electrolyser supply chain.',
    s1:'<p class="body">China is the world\'s largest hydrogen producer and the largest maker of <b>electrolysers</b>, and it is now coupling them to its enormous renewable build-out. In <b>Inner Mongolia, Xinjiang and the north-west</b>, gigawatt green-hydrogen projects sit beside vast new solar and wind farms, feeding clean H2 into ammonia, methanol, refining and steel.</p>'+
       '<p class="body">The economics are the green-H2 <b>spread</b>, with two Chinese advantages: <b>very cheap electrolysers</b> (a fraction of Western capex) and <b>abundant cheap renewable power</b> in the resource-rich north and west, often curtailed and so available cheaply. The power cost is still the dominant line, but low capex and cheap power widen the spread, and policy support and captive industrial demand provide the offtake. The defining feature is <b>scale and cost-down</b>: modest spreads applied to colossal volume.</p>',
    facts:[['GW-scale','Plant','beside solar + wind'],['Cheap stacks','Capex','a fraction of West'],['Cheap power','Input','curtailed renewables'],['Industry','Offtake','ammonia · methanol · steel'],['H2 spread','Margin','price − power cost'],['Scale','Driver','cost-down at volume']],
    s2:'Watch the plant. Vast new <b>solar</b> arrays feed power (cyan) into a long bank of low-cost <b>electrolyser modules</b> that fizz with hydrogen, fill the tanks and pipe H2 (amber) into captive industry. China\'s edge is cheap stacks and cheap (often curtailed) power — the <b style="color:#0c6b4f">spread</b> holds at scale. Drag the electrolyser size, the H2 price and the load factor.',
    driverLab:'H2 price', availLab:'Load factor', hrK:'Hydrogen revenue', yrS:'H2 sold × price',
    ledge:{a:'+ H2 sales',b:'+ policy / scale',c:'− power & opex'}, demandLabel:'LOAD FACTOR',
    preset:'Load China green H2',
    try:'<b>Try this:</b> China\'s edge is <b>low capex</b> (cheap electrolysers cut the net build) and <b>cheap curtailed power</b>. Push the electrolyser size — at gigawatt scale a modest spread is a vast absolute cash flow — and the cheap-power, cheap-stack combination keeps the spread positive where the West needs deep subsidy. A low H2 price still bites: it is always a spread.',
    s3:'A Chinese green-H2 project makes hydrogen on <b>cheap curtailed renewable power</b> with <b>very cheap electrolysers</b>, and sells it into captive industrial demand — ammonia, methanol, refining, steel. Low capex and cheap power widen the <b>spread</b> and policy provides the support and offtake. The defining lever is <b>scale and cost-down</b>: a modest spread on colossal volume. The risks and levers are the power cost, the load factor and the H2 price.',
    mb:{tag:'Model B · scale + cost-down', title:'Chinese green hydrogen at scale', body:'Gigawatt electrolyser projects on cheap, often-curtailed renewable power, built with very cheap Chinese electrolysers and fed into captive industry — a modest spread at colossal scale, driving cost-down. <b>This is Chinese green hydrogen</b>.'},
    s4a:'The dominant cost is <b>electricity</b>, but cheap and often curtailed renewable power keeps it low. Very cheap electrolysers cut both capex and replacement cost. The spread is modest but applied at gigawatt scale, and cost-down is the structural story — China\'s manufacturing drives green-H2 capex down for everyone.',
    wfNote:'Operating cost is dominated by <b>electricity</b> (cheap, often curtailed power), plus low-cost electrolyser O&amp;M. The margin is a modest H2 spread, but at gigawatt scale on cheap stacks and cheap power the absolute cash flow is large.',
    s4b:'The capital is gigawatts of <b>electrolysers and balance-of-plant</b> — but at a fraction of Western capex thanks to domestic manufacturing — coupled to new solar and wind. Policy support and captive industrial offtake underwrite it. Cheap stacks and cheap power are what let a modest spread compound at vast scale.',
    stackH:'The capital · GW electrolysers (low capex)', splitL:'Financing', splitR:'policy-backed',
    split:[['s1',60,'State-linked / policy debt'],['s2',40,'Sponsor equity']],
    finList:[['','Plant','GW electrolysers beside renewables'],['sub','Capex','very low (Chinese stacks)'],['','Power','cheap, often curtailed'],['sub','Offtake','captive industry'],['','Margin','modest spread, vast scale'],['rest','Driver','cost-down']],
    finNote:'Chinese green hydrogen is a <b>scale-and-cost-down spread asset</b>: a modest margin over cheap power and cheap stacks, applied at colossal volume with policy support and captive offtake. The risks are the H2 price and the power cost; the story is the cost-down that China drives for everyone.',
    timeline:[['2022','<b>China</b> sets its first national hydrogen plan.'],['2023','<b>Inner Mongolia / NW</b> gigawatt projects approved.'],['2023','<b>Cheap electrolysers</b> undercut Western capex sharply.'],['2020s','<b>Curtailed renewables</b> feed coupled green-H2 plants.'],['2020s','<b>Industrial offtake</b> — ammonia, methanol, steel.'],['2030s','<b>Cost-down at scale</b> drives global green-H2 costs lower.']],
    calcNote:'A working model of a <b>scale-and-cost-down Chinese green-H2 project</b>, on an enterprise-value basis. Revenue is H2 sold × price with captive-offtake support; the dominant cost is electricity, but cheap curtailed power and very low-cost electrolysers widen the spread at gigawatt scale. Figures are highly illustrative.',
    s6:'Chinese green H2 is a modest spread at vast scale, driving cost-down. What drives it:',
    breakers:['<b>Low capex</b> — very cheap Chinese electrolysers cut the net build for everyone.','<b>Cheap power</b> — abundant, often curtailed renewables keep the spread positive.','<b>Scale</b> — a modest spread on gigawatt volume is a vast absolute cash flow.','<b>Captive offtake</b> — ammonia, methanol and steel demand and policy underwrite it.'],
    src:'Figures are illustrative for a Chinese green-hydrogen project coupled to renewables and industry. Given limited standalone disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', power:'solar', offtake:'pipeline',
      mwDef:800,mwMin:200,mwMax:2500,mwStep:100, priceDef:5,priceMin:2.5,priceMax:9,priceStep:0.25,
      lfDef:44,lfMin:28,lfMax:60,lfStep:1, kgPerMWh:18, powerPrice:26, omPerMW:20, fixedOM:24},
    calc:{build:2200,grant:160,capex:8,revG:3,floor:110,cap:1800,tax:25,exit:9,lev:4.5,rd:4,amort:2,hold:22},
    map:{footer:GEO.chinah2.footer}
  }
  };
  var ORDER=['euroh2','gulfh2','atacama','murchison','neom','chinah2'];

  /* ===================================================================
     GREEN-HYDROGEN PLANT RENDERER  (canvas, 720x520) — top-down, daytime
     A renewable power source (solar / wind) on the left feeds power into a row of
     electrolyser modules in the middle that fizz with H2 bubbles when running;
     the H2 fills storage tanks and leaves by an offtake (pipeline / truck / ship /
     ammonia). More MW = more modules; higher load factor = more bubbling + flow.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  /* layout: power source (left) → electrolyser row (mid) → tanks + offtake (right) */
  var POWERX=92;                   // renewable source column
  var BUSX=176;                    // power bus to electrolysers
  var STACKX0=236, STACKDX=58;     // electrolyser modules start + spacing
  var STACKY=[150,222,294,366];    // up to four rows of modules
  var TANKX=556, OFFX=668;         // storage tanks + offtake
  var MODS=[], NMOD=0;
  function layout(){
    var E=A.econ;
    // module count scales with electrolyser MW: ~6 to ~28 modules
    var norm=(parseFloat(sCap.value)-E.mwMin)/Math.max(1,(E.mwMax-E.mwMin));
    var cols=Math.max(2,Math.min(5,Math.round(2+norm*3)));
    var rows=Math.max(2,Math.min(4,Math.round(2+norm*2)));
    MODS=[]; var idx=0;
    for(var r=0;r<rows;r++) for(var c=0;c<cols;c++){
      MODS.push({x:STACKX0+c*STACKDX, y:STACKY[r%STACKY.length] + (rows<=2?36:0), col:c, row:r, ph:(idx*0.8)%6.28, bub:[]});
      idx++;
    }
    NMOD=MODS.length;
  }

  /* ---- base map: ground (arid daytime site) ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e6e3d6'); g.addColorStop(1,'#dcd8c8');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // plant apron
    ctx.fillStyle='rgba(150,160,150,0.10)'; rr(206,116,372,300,14); ctx.fill();
    // a faint horizon haze
    ctx.fillStyle='rgba(180,200,210,0.10)'; ctx.fillRect(0,0,W,70);
  }

  /* ---- renewable power source (solar panels / wind turbine / hybrid) ---- */
  function powerSource(lf){
    var G=GEO[A.geoKey], p=G.power, x=POWERX;
    ctx.save();
    if(p==='wind' || p==='hybrid'){
      // wind turbine(s)
      var ty=p==='hybrid'?160:240;
      drawTurbine(x, ty, 30, lf);
      if(p==='wind') drawTurbine(x+6, ty+150, 24, lf);
    }
    if(p==='solar' || p==='hybrid'){
      var sy0=p==='hybrid'?300:150;
      for(var i=0;i<4;i++) drawPanel(x-18+(i%2)*40, sy0+Math.floor(i/2)*46, lf);
    }
    ctx.fillStyle='rgba(60,80,70,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('RENEWABLE POWER', x, H-60);
    ctx.fillStyle='rgba(60,80,70,0.6)'; ctx.font='600 6.5px Inter,sans-serif';
    ctx.fillText((A.econ.power||'').toUpperCase(), x, H-50);
    ctx.restore();
  }
  function drawPanel(x,y,lf){
    ctx.save();
    ctx.fillStyle='rgba(40,55,40,0.12)'; ctx.beginPath(); ctx.ellipse(x+14,y+18,16,4,0,0,Math.PI*2); ctx.fill();
    var g=ctx.createLinearGradient(x,y,x+28,y+16); g.addColorStop(0,'#3a5b7a'); g.addColorStop(1,'#27405a');
    ctx.fillStyle=g; rr(x,y,28,16,2); ctx.fill();
    ctx.strokeStyle='rgba(120,150,180,0.5)'; ctx.lineWidth=0.6;
    for(var i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(x+i*7,y); ctx.lineTo(x+i*7,y+16); ctx.stroke(); }
    if(lf>0.05) glow(x+14,y+8,12+8*lf,'rgba(120,180,235,'+(0.10+0.18*lf)+')');
    ctx.restore();
  }
  function drawTurbine(x,y,r,lf){
    ctx.save();
    ctx.strokeStyle='#9aa0a0'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+r+10); ctx.stroke();
    ctx.translate(x,y); ctx.rotate(T*(0.02+0.05*lf));
    ctx.strokeStyle='#c4c9c6'; ctx.lineWidth=2.6; ctx.lineCap='round';
    for(var b=0;b<3;b++){ ctx.rotate(Math.PI*2/3); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-r); ctx.stroke(); }
    ctx.fillStyle='#8a908d'; ctx.beginPath(); ctx.arc(0,0,2.6,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  /* ---- electrolyser module (a container/cabinet that fizzes with H2 bubbles) ---- */
  function electrolyser(m,lf,on){
    var x=m.x, y=m.y;
    ctx.fillStyle='rgba(30,40,35,0.12)'; rr(x-18,y+13,36,5,2); ctx.fill();
    var g=ctx.createLinearGradient(x,y-15,x,y+15); g.addColorStop(0,'#cfd6d0'); g.addColorStop(1,'#aeb6b0');
    ctx.fillStyle=g; rr(x-18,y-15,36,30,3); ctx.fill();
    ctx.strokeStyle='rgba(110,125,115,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // ribs (containerised stack)
    ctx.strokeStyle='rgba(120,135,125,0.4)'; ctx.lineWidth=0.7;
    for(var i=1;i<5;i++){ ctx.beginPath(); ctx.moveTo(x-18+i*7.2,y-15); ctx.lineTo(x-18+i*7.2,y+15); ctx.stroke(); }
    // status light
    ctx.fillStyle = on ? 'rgba(40,180,120,'+(0.5+0.5*lf)+')' : 'rgba(150,160,150,0.5)';
    ctx.beginPath(); ctx.arc(x+12,y-10,2,0,Math.PI*2); ctx.fill();
    if(on && lf>0.04){
      glow(x,y,16+10*lf,'rgba(40,180,120,'+(0.06+0.14*lf)+')');
      // rising H2 bubbles, intensity scaling with load factor
      var nb=Math.round(1+lf*5);
      for(var k=0;k<nb;k++){
        var t=((T*(0.02+0.03*lf)+m.ph+k/nb)%1);
        var bx=x-10+((m.ph*31+k*13)%20), by=y+12-t*30, br=1+t*1.6;
        ctx.globalAlpha=(1-t)*0.6; ctx.fillStyle='rgba(220,245,235,0.9)';
        ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
      }
    }
  }

  /* ---- H2 storage tanks (cylindrical) ---- */
  function tanks(lf,on){
    var x=TANKX;
    [180,270,360].forEach(function(y,i){
      ctx.fillStyle='rgba(30,40,35,0.12)'; ctx.beginPath(); ctx.ellipse(x,y+30,18,5,0,0,Math.PI*2); ctx.fill();
      var g=ctx.createLinearGradient(x-16,y,x+16,y); g.addColorStop(0,'#dfe3df'); g.addColorStop(0.5,'#f2f4f1'); g.addColorStop(1,'#cdd2cd');
      ctx.fillStyle=g; rr(x-16,y-28,32,58,8); ctx.fill();
      ctx.strokeStyle='rgba(120,135,125,0.5)'; ctx.lineWidth=1; ctx.stroke();
      // fill band (rises a touch with load)
      ctx.fillStyle='rgba(70,200,150,'+(0.10+0.18*lf*(on?1:0.2))+')'; rr(x-16,y-28+58*(1-(0.4+0.5*lf)),32,58*(0.4+0.5*lf),8); ctx.fill();
    });
    ctx.fillStyle='rgba(60,80,70,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('H2 STORAGE',x,438);
  }

  /* ---- offtake (pipeline / truck / ship / ammonia plant) ---- */
  function offtake(lf,on){
    var G=GEO[A.geoKey], o=G.offtake, x=OFFX, y=270;
    ctx.save();
    ctx.fillStyle='rgba(60,80,70,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center';
    if(o==='ship'){
      ctx.fillStyle='rgba(120,160,200,0.18)'; ctx.fillRect(x-46,y+40,92,90); // water
      ctx.fillStyle='#9aa6ab'; rr(x-34,y-4,64,22,3); ctx.fill(); // hull
      ctx.fillStyle='#c2c8c4'; rr(x-6,y-22,18,18,2); ctx.fill();
      ctx.fillStyle='#8d9a86'; ctx.beginPath(); ctx.arc(x-20,y+4,5,0,Math.PI*2); ctx.arc(x-6,y+4,5,0,Math.PI*2); ctx.arc(x+8,y+4,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(60,80,70,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.fillText('SHIP EXPORT',x,y+42);
    } else if(o==='truck'){
      ctx.fillStyle='#9aa6ab'; rr(x-30,y-8,26,18,2); ctx.fill(); // cab
      ctx.fillStyle='#c2c8c4'; rr(x-4,y-12,34,22,4); ctx.fill(); // tank
      ctx.fillStyle='#5b6168'; ctx.beginPath(); ctx.arc(x-22,y+12,4,0,Math.PI*2); ctx.arc(x+12,y+12,4,0,Math.PI*2); ctx.arc(x+24,y+12,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(60,80,70,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.fillText('TANKER OFFTAKE',x,y+30);
    } else if(o==='ammonia'){
      // a small synthesis/ammonia train: vessel + stack
      ctx.fillStyle='#bcc2bd'; rr(x-22,y-26,30,52,5); ctx.fill();
      ctx.fillStyle='#aab0ab'; rr(x+10,y-14,16,40,3); ctx.fill();
      ctx.fillStyle='#8a908a'; rr(x-2,y-40,7,16,1); ctx.fill();
      if(on){ for(var i=0;i<3;i++){ var t=((T*0.03+i/3)%1); ctx.globalAlpha=(1-t)*0.4; ctx.fillStyle='rgba(210,215,210,0.7)';
        ctx.beginPath(); ctx.arc(x+1,y-40-t*14,2+t*2,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; } }
      ctx.fillStyle='rgba(60,80,70,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.fillText('NH3 / e-FUELS',x,y+40);
    } else { // pipeline
      ctx.strokeStyle='#9aa6ab'; ctx.lineWidth=8; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(x-30,y); ctx.lineTo(x+30,y); ctx.stroke();
      ctx.strokeStyle='#c2c8c4'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x-30,y); ctx.lineTo(x+30,y); ctx.stroke();
      ctx.fillStyle='#8d9a86'; rr(x-4,y-18,8,8,1); ctx.fill();
      ctx.fillStyle='rgba(60,80,70,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.fillText('PIPELINE OFFTAKE',x,y+30);
    }
    ctx.restore();
  }

  /* ---- flow pulses along a polyline (shared helper) ---- */
  function flowPulses(pts,speed,load,col,gcol,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*5));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.6,0,Math.PI*2); ctx.fill(); }
  }

  /* ---- power bus + H2 pipes ---- */
  function pipes(loadVis,on){
    // power feed: source → bus → each module row (cyan)
    ctx.strokeStyle='rgba(70,150,210,0.35)'; ctx.lineWidth=2.4; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(POWERX+24,260); ctx.lineTo(BUSX,260); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(BUSX,STACKY[0]); ctx.lineTo(BUSX,STACKY[STACKY.length-1]+36); ctx.stroke();
    STACKY.forEach(function(y){ ctx.beginPath(); ctx.moveTo(BUSX,y+18); ctx.lineTo(STACKX0-18,y+18); ctx.stroke(); });
    // H2 pipe: electrolysers → tanks → offtake (amber/green)
    ctx.strokeStyle='rgba(210,160,60,0.4)'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.moveTo(STACKX0+4*STACKDX,260); ctx.lineTo(TANKX-18,260); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(TANKX+18,260); ctx.lineTo(OFFX-30,260); ctx.stroke();
    ctx.setLineDash([]);
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ H2',b:'+ subsidy',c:'− power'};
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
    var G=GEO[A.geoKey], E=A.econ;
    var mw=parseFloat(sCap.value), h2price=parseFloat(sSpread.value), lf=parseFloat(sAvail.value)/100;
    // small wobble around the load factor for the sparkline + bubbling
    var lfVis=Math.max(0.02,Math.min(1, lf*(0.92+0.14*Math.sin(T*0.02))));

    ctx.clearRect(0,0,W,H);
    drawMap(); powerSource(lfVis); pipes(lfVis,lfVis>0.05);

    // electrolyser modules (count scales with MW; fizz with load factor)
    MODS.forEach(function(m){ electrolyser(m,lfVis,lfVis>0.04); });
    tanks(lfVis,lfVis>0.04); offtake(lfVis,lfVis>0.04);

    // power flow in (cyan) and H2 flow out (amber/green), intensity with load factor
    var loadVis=0.25+0.7*lfVis;
    flowPulses([[POWERX+24,260],[BUSX,260]],0.9+loadVis,loadVis,'rgba(90,180,235,0.95)','rgba(90,180,235,0.6)',false);
    flowPulses([[BUSX,STACKY[0]],[BUSX,STACKY[STACKY.length-1]+36]],0.7+loadVis,loadVis,'rgba(90,180,235,0.95)','rgba(90,180,235,0.6)',false);
    STACKY.forEach(function(y){ flowPulses([[BUSX,y+18],[STACKX0-18,y+18]],0.8+loadVis,loadVis*0.8,'rgba(90,180,235,0.9)','rgba(90,180,235,0.55)',false); });
    var hcol = (G.offtake==='ammonia')?'rgba(110,200,150,0.95)':'rgba(225,170,70,0.95)';
    var hglow= (G.offtake==='ammonia')?'rgba(110,200,150,0.55)':'rgba(255,180,70,0.6)';
    flowPulses([[STACKX0+4*STACKDX,260],[TANKX-18,260]],0.8+loadVis,loadVis,hcol,hglow,false);
    flowPulses([[TANKX+18,260],[OFFX-30,260]],0.7+loadVis,loadVis,hcol,hglow,false);

    if(G.growing){
      var mx=STACKX0+ (MODS.length? (MODS[MODS.length-1].col+1)*STACKDX : STACKDX), my=STACKY[STACKY.length-1]+36;
      var pul=0.5+0.5*Math.sin(T*0.12);
      ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('+ PHASE 2',Math.min(STACKX0+4*STACKDX,mx),my+6); ctx.restore();
      glow(Math.min(STACKX0+4*STACKDX,mx),my,8,'rgba(12,107,79,'+(0.25+0.3*pul)+')');
    }

    // ---- economics (the green-hydrogen spread: H2 price vs power cost) ----
    var mwhIn=mw*8760*lf;
    var kg=mwhIn*(E.kgPerMWh||18);                 // ~18 kg H2 per MWh (~55 kWh/kg)
    var grossRev=kg*h2price;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));   // floor = contracted offtake / PTC
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var powerCost=mwhIn*(E.powerPrice||0);          // electricity input — the dominant cost
    var omCost=mw*(E.omPerMW||0)*1000, fixedOM=(E.fixedOM||0)*1e6;
    var opex=powerCost + omCost + fixedOM;
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is subsidy/floor (PTC / offtake) vs H2 sales
    var subShare=Math.max(0.08,Math.min(0.6, revenue>grossRev?(revenue-grossRev)/Math.max(1,revenue)+0.12:0.12));

    if(_anim){
      var lit=MODS.length?MODS:[{x:380,y:260}];
      if(Math.random()<0.6){ var s1=lit[(Math.random()*lit.length)|0]; spawnCoin(TANKX+rnd(-10,10),200, Math.random()<subShare?'rec':'ret', -1); }
      // power-cost drains are PROMINENT (power is the big cost)
      var outRate=Math.max(0.1,Math.min(0.8, opex/Math.max(1,Math.abs(revenue)||1)));
      if(Math.random()<outRate){ var s2=lit[(Math.random()*lit.length)|0]; spawnCoin(s2.x,s2.y+8,'cost',1); }
      demHist.push(lfVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(lfVis);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+Math.round(mw)+' MW electrolyser',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',Math.round(mw)+' MW'); set('ixSpreadV',CUR+h2price+'/kg'); set('ixAvailV',Math.round(lf*100)+'%');
    set('ixDir',Math.round(mw)+' MW'); set('ixDirS','electrolyser · '+(E.power||''));
    set('ixMW',h2t(kg)); set('ixMWs',Math.round(lf*100)+'% load factor / yr');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Power (electricity)',powerCost],['Electrolyser O&amp;M',omCost],['Fixed costs',fixedOM]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the hydrogen spread is too thin to value — the power cost swamps the H2 price. Raise the H2 price or the load factor, lean on the subsidy / offtake floor, or lower the power cost.</span>'; return; }
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
    sCap.min=E.mwMin; sCap.max=E.mwMax; sCap.step=E.mwStep; sCap.value=E.mwDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is hydrogen sold (electrolyser MW × hours × load factor × kg/MWh) × the H2 price (with a floor for any contracted offtake / production credit) and the dominant cost is electricity; the returns model is a simplified DCF, not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    sCap.addEventListener('input',function(){ layout(); frame(); renderModel(); });
    [sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.mwDef; sSpread.value=E.priceDef; sAvail.value=E.lfDef; layout(); frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'euroh2');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
