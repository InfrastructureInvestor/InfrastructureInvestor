/* Offshore wind — data-driven worked examples.
   Six real (and a couple of illustrative, early-stage) offshore wind generators,
   one template. Scene config from of-geo.js (GEO), drawn as a sea-level / top-down
   offshore wind farm in 720x520 scene coords: an array of turbines standing in the
   sea, an offshore substation platform collecting the array, and a subsea export
   cable to a shore connection. This is a CONTRACTED, CAPITAL-HEAVY generator:
   revenue is generation (capacity × hours × capacity factor) × power price/strike,
   floored by a CfD / long PPA (so revenue holds when the price slider drops), and
   the returns model is a simplified DCF. Offshore is capital-intensive (high
   capex per MW), so the unlevered IRR is modest but project finance / high
   leverage lifts the levered return. */
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
  function mw(v){ return v>=1000?(v/1000).toFixed(v>=10000?0:1)+' GW':Math.round(v)+' MW'; }
  function gwh(mwh){ return mwh>=1e6?(mwh/1e6).toFixed(1)+' TWh':(mwh>=1e3?(mwh/1e3).toFixed(mwh>=1e4?0:1)+' GWh':Math.round(mwh)+' MWh'); }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · DOGGER BANK / HORNSEA (Europe · UK · CfD) ---------- */
  dogger:{
    name:'Dogger Bank / Hornsea', geo:'North Sea, United Kingdom', continent:'Europe', cur:'£', geoKey:'dogger',
    lede:'The benchmark of <b>offshore wind</b> — the world\'s largest wind farms, built far out in the North Sea on a <b>Contract for Difference</b>, financed by an enormous slug of project debt and equity, then spinning for thirty years on a price guaranteed by the state.',
    s1:'<p class="body"><b>Offshore wind</b> turns the steady, strong wind over the sea into electricity at vast scale: hundreds of turbines, each over 200 metres tall, stand on the seabed, cabled together to an <b>offshore substation</b> and brought ashore by a subsea <b>export cable</b>. <b>Dogger Bank</b> (an SSE/Equinor/Vårgrønn project) and <b>Hornsea</b> (Ørsted) are the largest such farms on earth, off the UK\'s east coast.</p>'+
       '<p class="body">The economics are a <b>contracted generator</b>: revenue is generation (capacity × hours × <b>capacity factor</b>) sold at a price, but a UK <b>Contract for Difference</b> tops the wholesale price up (or claws it back) to a fixed, inflation-linked <b>strike price</b> — so the cash flow is contracted and price-insulated. The asset is <b>capital-heavy</b>: most of the value is the multi-billion build, funded by <b>project finance</b> (high leverage against a contracted offtake), which is why the unlevered return is modest but the levered return is real.</p>',
    facts:[['~3–5GW','Scale','world\'s largest'],['CfD','Offtake','strike-priced'],['~50–58%','Capacity factor','strong North Sea wind'],['£3–4.5m/MW','Capex','capital-heavy'],['Project finance','Funding','high leverage'],['25–30y','Life','long, contracted']],
    s2:'Watch the array. The <b>turbines</b> spin with the <b>capacity factor</b> — faster wind, faster rotors, more power. The cabled array feeds the <b>offshore substation</b> and the subsea <b>export cable</b> carries it ashore (cyan pulses scale with output). Crucially, the <b>CfD</b> floors the revenue: drop the power-price slider and watch the cash flow hold, because the strike price tops it back up. The <b style="color:#0c6b4f">margin</b> is generation revenue minus O&amp;M. Drag the capacity, the power price/strike and the capacity factor.',
    driverLab:'Power price / strike', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ CfD/ROC',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>power price</b> right down — and watch the revenue barely move, because the <b>CfD strike</b> (the floor) holds it up. That price insulation is the whole offshore story: a contracted, bond-like cash flow on a capital-heavy asset. Now push the <b>capacity factor</b> — the North Sea\'s strong, steady wind (50%+) is what makes the economics work, and the rotors spin faster as you do.',
    s3:'Dogger Bank and Hornsea sell <b>generation</b> (capacity × hours × capacity factor) under a <b>CfD</b> that fixes the price at a strike, inflation-linked, for fifteen years and beyond. So the revenue is contracted and price-insulated; the <b>margin</b> is generation revenue minus O&amp;M (which offshore is higher than onshore — heavy maintenance vessels, subsea cables). The defining feature is <b>capital-intensity</b>: the build is the asset, funded by project finance, so the unlevered return is modest (~6–8%) but high leverage lifts the equity return.',
    mb:{tag:'Model A · contracted & capital-heavy', title:'CfD-backed offshore wind', body:'Hundreds of turbines far out at sea, selling generation under a Contract for Difference that fixes the price at an inflation-linked strike — a contracted, price-insulated cash flow on a multi-billion, project-financed, capital-heavy asset. <b>This is Dogger Bank / Hornsea</b> — the world\'s largest offshore wind.'},
    s4a:'The dominant cost offshore is <b>O&amp;M</b> — heavy-maintenance vessels, blade and cable repairs, an offshore base — which is far higher per MW than onshore; seabed lease and transmission charges sit alongside. But the margin is very high (75–88%): a contracted price on cheap-to-run wind. The whole capital story is the multi-billion <b>build</b>.',
    wfNote:'Operating cost is offshore O&amp;M (vessels, heavy maintenance, subsea cables), plus seabed lease, transmission and insurance. The margin is wide — a contracted CfD price on zero-fuel wind — but the cash flow services a very large project-finance debt against a capital-heavy build.',
    s4b:'The capital is the <b>build</b>: turbines, foundations, the offshore substation and the subsea export cable — billions, at roughly £3–4.5m per MW, far above onshore. It is funded by <b>project finance</b>: a high slug of debt against the contracted CfD offtake, with equity behind it. The forward capital is the <b>next phase</b> — these farms are built in gigawatt stages, each adding contracted generation.',
    stackH:'The capital · the multi-billion build', splitL:'Project financing', splitR:'high leverage',
    split:[['s1',70,'Project-finance debt'],['s2',30,'Sponsor equity']],
    finList:[['','Scale','world\'s largest (3–5GW)'],['sub','Offtake','CfD (strike-priced, indexed)'],['','Capex','£3–4.5m/MW (capital-heavy)'],['sub','Funding','project finance (high leverage)'],['','Capacity factor','~50–58% (strong North Sea wind)'],['rest','Sponsors','SSE · Equinor · Ørsted']],
    finNote:'A CfD offshore wind farm is a <b>contracted, capital-heavy generator</b>: a price-insulated cash flow on a multi-billion build, project-financed at high leverage. The unlevered return is modest because of the capex, but the contracted offtake supports the debt that lifts the equity return.',
    timeline:[['2000','<b>North Hoyle</b> — the UK\'s first offshore wind farm.'],['2014','<b>CfD regime</b> replaces ROCs as the offtake mechanism.'],['2019','<b>Hornsea One</b> — then the world\'s largest, comes online.'],['2023','<b>Dogger Bank</b> first power; built in gigawatt phases.'],['2020s','<b>Strike prices fall</b> as the supply chain matures.'],['2030s','<b>Floating &amp; deeper water</b> extend the resource.']],
    calcNote:'A working model of a <b>CfD offshore wind generator</b>. Revenue is generation (capacity × hours × capacity factor) × price; a high revenue floor models the CfD strike, so the cash flow holds even when the power-price slider falls. The margin is wide, but the capital-heavy build and project-finance leverage shape the return.',
    s6:'Dogger Bank is contracted, capital-heavy offshore wind. What drives it:',
    breakers:['<b>The CfD strike</b> — a fixed, indexed price floors the revenue and insulates it from the market.','<b>Capacity factor</b> — strong, steady North Sea wind (50%+) is what makes the capex pay.','<b>Capital intensity</b> — a multi-billion build means the unlevered return is modest.','<b>Project-finance leverage</b> — a contracted offtake supports the debt that lifts the equity return.'],
    src:'Figures from public sources on <a href="https://doggerbank.com/" target="_blank" rel="noopener">Dogger Bank</a> (SSE / Equinor / Vårgrønn) and <a href="https://orsted.com/" target="_blank" rel="noopener">Hornsea</a> (Ørsted), and the UK CfD scheme. Figures are approximate and illustrative.',
    econ:{cur:'£', source:'CfD · North Sea wind',
      mwDef:3600,mwMin:600,mwMax:6000,mwStep:100, priceDef:65,priceMin:35,priceMax:130,priceStep:1,
      cfDef:54,cfMin:38,cfMax:60,cfStep:1, omPerMW:56, fixedOM:30},
    calc:{build:13800,grant:0,capex:3,revG:1.5,floor:1300,cap:3000,tax:25,exit:11,lev:6,rd:5,amort:4,hold:15},
    map:{footer:GEO.dogger.footer}
  },

  /* ---------- 2 · VINEYARD WIND / REVOLUTION (North America · USA · PPA) ---------- */
  vineyard:{
    name:'Vineyard Wind / Revolution', geo:'US East Coast', continent:'North America', cur:'US$', geoKey:'vineyard',
    lede:'The first big <b>US offshore wind</b> — projects off the north-east coast selling power under long contracts, opening a vast new market with high capex and a developing supply chain.',
    s1:'<p class="body"><b>Vineyard Wind</b> (off Massachusetts) and <b>Revolution Wind</b> (off Rhode Island/Connecticut) are among the first utility-scale offshore wind farms in the United States — a market that lagged Europe but holds enormous resource off the Atlantic seaboard. Turbines stand on the seabed, cabled to an offshore substation and brought ashore to feed the New England grid.</p>'+
       '<p class="body">The model is a <b>contracted generator</b>: power is sold under long <b>power-purchase agreements</b> (and offshore renewable energy credits) to utilities and states at a fixed, escalating price — so the revenue is contracted, like a CfD in effect. The challenge is <b>capital cost</b>: a young US supply chain, Jones Act vessels and rising rates pushed early budgets up, which is exactly why the returns hinge on the contracted price and the cost of capital.</p>',
    facts:[['~700–800MW','Scale','first US utility-scale'],['Long PPA','Offtake','+ OREC'],['~45–52%','Capacity factor','Atlantic wind'],['High','Capex','young US supply chain'],['Project finance','Funding','leveraged'],['Avangrid · Ørsted','Sponsors','/ utilities']],
    s2:'Watch the array. The <b>turbines</b> spin with the <b>capacity factor</b> off the Atlantic coast, the array feeds the <b>offshore substation</b>, and the export cable runs ashore to the grid (cyan pulses). The long <b>PPA</b> floors the revenue at a fixed, escalating price — drop the power-price slider and the cash flow holds. The <b style="color:#0c6b4f">margin</b> is generation revenue minus O&amp;M. Drag the capacity, the price and the capacity factor.',
    driverLab:'Power price / PPA', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ PPA/OREC',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> the long <b>PPA</b> fixes the price, so drop the power slider and the revenue barely moves — the contract floors it. The US story is the <b>cost of capital</b>: push the cost of debt and watch a solid contracted return net down, because a capital-heavy asset with a young supply chain is sensitive to financing. The Atlantic capacity factor is the upside.',
    s3:'Vineyard Wind and Revolution sell <b>generation</b> under long <b>PPAs</b> (and OREC contracts) at a fixed, escalating price — a contracted, price-insulated cash flow. The <b>margin</b> is generation revenue minus O&amp;M, which is high. The investor question is <b>capital cost</b>: a young US supply chain, Jones Act constraints and higher rates lift the build and the financing cost, so the return turns on the contracted price and the cost of capital as much as the wind.',
    mb:{tag:'Model A · contracted & capital-heavy', title:'PPA-backed US offshore wind', body:'The first big US offshore wind farms, selling power under long PPAs and OREC contracts at a fixed, escalating price — a contracted cash flow on a capital-heavy build, project-financed against a young supply chain. <b>This is Vineyard Wind / Revolution</b> — opening the US market.'},
    s4a:'The dominant cost is <b>O&amp;M</b> (vessels, heavy maintenance, cables) and an offshore base; seabed lease and transmission sit alongside. The margin is high — a contracted price on zero-fuel wind — but the build is expensive and the financing sensitive, so the cost base that matters most is the <b>capital</b> cost.',
    wfNote:'Operating cost is offshore O&amp;M, seabed lease, transmission and insurance. The margin is wide on a contracted PPA price, but the cash flow services a large, relatively expensive project-finance debt — a young US supply chain and higher rates lift the build and the financing cost.',
    s4b:'The capital is the <b>build</b>: turbines, foundations, substation and export cable — expensive in the US given a nascent supply chain and Jones Act vessels. It is funded by <b>project finance</b> with equity from utilities and developers. The forward capital is the <b>next phase</b> and the broader US pipeline, each adding contracted generation as the market and supply chain mature.',
    stackH:'The capital · the offshore build', splitL:'Project financing', splitR:'leveraged',
    split:[['s1',65,'Project-finance debt'],['s2',35,'Sponsor / utility equity']],
    finList:[['','Scale','first US utility-scale (~700–800MW)'],['sub','Offtake','long PPA + OREC'],['','Capex','high (young US supply chain)'],['sub','Funding','project finance'],['','Capacity factor','~45–52% (Atlantic wind)'],['rest','Sponsors','Avangrid · Ørsted · Eversource']],
    finNote:'US offshore wind is a <b>contracted, capital-heavy generator at a higher cost of capital</b>: a price-insulated PPA cash flow on an expensive build with a developing supply chain. The return turns on the contracted price and the financing cost as much as on the wind.',
    timeline:[['2016','<b>Block Island</b> — the first small US offshore wind farm.'],['2021','<b>Vineyard Wind</b> reaches financial close.'],['2023','<b>First US utility-scale</b> turbines spin off the north-east.'],['2023','<b>Cost pressure</b> — supply chain and rates strain early contracts.'],['2024','<b>Revolution Wind</b> and others build out.'],['2030s','<b>Scaling the market</b> as the supply chain matures.']],
    calcNote:'A working model of a <b>PPA offshore wind generator</b> in the US. Revenue is generation × a contracted price; a high floor models the PPA/OREC, so the cash flow holds when the power slider falls. A higher cost of debt reflects a young supply chain and higher rates, netting a solid contracted return down.',
    s6:'US offshore wind is contracted generation at a higher cost of capital. What drives it:',
    breakers:['<b>The PPA price</b> — a fixed, escalating contract floors the revenue and insulates it.','<b>Capital cost</b> — a young US supply chain and Jones Act vessels lift the build.','<b>Cost of capital</b> — a capital-heavy asset is sensitive to financing and rates.','<b>Capacity factor</b> — strong Atlantic wind is what makes the expensive build pay.'],
    src:'Figures from public sources on <a href="https://www.vineyardwind.com/" target="_blank" rel="noopener">Vineyard Wind</a> and Revolution Wind (Avangrid / Ørsted / Eversource) and US offshore PPA/OREC contracts. Figures are approximate and illustrative.',
    econ:{cur:'US$', source:'PPA · Atlantic wind',
      mwDef:800,mwMin:200,mwMax:1600,mwStep:50, priceDef:90,priceMin:50,priceMax:170,priceStep:1,
      cfDef:48,cfMin:36,cfMax:55,cfStep:1, omPerMW:55, fixedOM:18},
    calc:{build:3500,grant:0,capex:3,revG:2,floor:340,cap:800,tax:25,exit:10.5,lev:5,rd:6.5,amort:4,hold:14},
    map:{footer:GEO.vineyard.footer}
  },

  /* ---------- 3 · BRAZIL OFFSHORE (South America · illustrative) ---------- */
  brazil:{
    name:'Brazil offshore wind', geo:'Brazil (NE coast)', continent:'South America', cur:'R$', geoKey:'brazil',
    lede:'Offshore wind is <b>pre-commercial in Brazil</b> — but the north-east coast has world-class wind, and a pipeline of projects is forming, to be contracted and discounted at <b>emerging-market</b> rates.',
    s1:'<p class="body">Brazil has some of the best wind in the world off its north-east coast, and a vast offshore <b>pipeline</b> in environmental licensing — but no large offshore wind farm is yet operating. It is an <b>early-stage, pre-commercial</b> market: the legal framework for seabed leasing is still being finalised, and the first projects are years away.</p>'+
       '<p class="body">When they come, the model will be a <b>contracted generator</b>: power sold under long auctions or corporate <b>PPAs</b> at a fixed, indexed price, so the revenue is contracted. The defining feature for an investor is the <b>discount rate</b>: a capital-heavy build, priced and financed at Brazilian rates and in reais, nets a solid contracted return down once discounted like an emerging-market asset. <b>The figures here are illustrative</b> — there is no operating project to draw on.</p>',
    facts:[['Pre-commercial','Stage','illustrative'],['Auction / PPA','Offtake','contracted'],['~50–55%','Capacity factor','world-class NE wind'],['High','Capex','capital-heavy + EM'],['Project finance','Funding','EM rates'],['R$','Currency','emerging-market']],
    s2:'Watch the array — an illustration of what a north-east Brazil farm could look like. The <b>turbines</b> spin with the strong coastal <b>capacity factor</b>, feed the <b>offshore substation</b>, and the cable runs ashore. A long auction or <b>PPA</b> would floor the revenue. The whole return, though, is at an <b>EM discount rate</b>: raise the cost of debt and watch a solid contracted return net down. Drag the capacity, the price and the capacity factor.',
    driverLab:'Power price / PPA', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ auction/PPA',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> the wind is the upside — push the <b>capacity factor</b> to north-east Brazil\'s world-class 50%+ and watch the rotors and the output climb. But the return is at an <b>EM discount rate</b>: raise the cost of debt and a strong contracted asset nets down once discounted like a Brazilian project. Pre-commercial, so the figures are illustrative.',
    s3:'A Brazilian offshore wind farm would sell <b>generation</b> under long auctions or corporate <b>PPAs</b> at a fixed, indexed price — a contracted cash flow. The <b>margin</b> is generation revenue minus O&amp;M, and the capacity factor off the north-east coast is world-class. The investor question is the <b>discount rate</b>: a capital-heavy build, financed at Brazilian rates and in reais, nets the contracted return down. It is a pre-commercial market, so these figures are illustrative.',
    mb:{tag:'Model A · contracted & capital-heavy', title:'EM offshore wind (illustrative)', body:'A pre-commercial offshore wind farm off Brazil\'s world-class north-east coast, to be contracted under auctions or PPAs at a fixed price — a capital-heavy build priced and discounted at emerging-market rates. <b>This is Brazil offshore wind</b> — illustrative, early-stage.'},
    s4a:'The dominant cost would be <b>O&amp;M</b> (vessels, heavy maintenance, cables) and an offshore base; seabed lease and transmission alongside. The margin is high on a contracted price, but the build is capital-heavy and the financing is at <b>EM rates</b> — so the cost of capital, not the operating cost, is what shapes the return.',
    wfNote:'Operating cost would be offshore O&amp;M, seabed lease, transmission and insurance. The margin is wide on a contracted price and world-class wind, but the capital-heavy build is financed at emerging-market rates — the discount rate is the swing factor. Illustrative.',
    s4b:'The capital is the <b>build</b>: turbines, foundations, substation and export cable — capital-heavy, and financed at <b>Brazilian rates</b> in reais. The forward capital is the broader north-east <b>pipeline</b> as the leasing framework matures. The whole investment debate is the cost of capital and the pace at which a pre-commercial market develops.',
    stackH:'The capital · the offshore build (illustrative)', splitL:'Project financing', splitR:'EM',
    split:[['s1',60,'Local / project debt'],['s2',40,'Sponsor equity']],
    finList:[['','Stage','pre-commercial (illustrative)'],['sub','Offtake','auction / corporate PPA'],['','Capex','high (capital-heavy + EM)'],['sub','Funding','project finance, EM rates'],['','Capacity factor','~50–55% (world-class NE wind)'],['rest','Currency','reais — EM discount rate']],
    finNote:'Brazilian offshore wind is a <b>contracted, capital-heavy generator at an EM discount rate</b>: a price-insulated cash flow on world-class wind, but financed at Brazilian rates and pre-commercial. The whole debate is the cost of capital and the pace of market development. Illustrative.',
    timeline:[['2020s','<b>Vast pipeline</b> enters environmental licensing.'],['2022','<b>Decree</b> begins to define offshore seabed use.'],['2020s','<b>Legal framework</b> for leasing still being finalised.'],['Future','<b>First auctions / PPAs</b> to contract early projects.'],['Future','<b>First construction</b> — years away.'],['Long-term','<b>World-class resource</b> drives the opportunity.']],
    calcNote:'A working model of a <b>pre-commercial EM offshore wind generator</b>. Revenue is generation × a contracted price; a floor models the auction/PPA. A high cost of debt reflects Brazilian rates, netting a solid contracted return down once discounted. The figures are illustrative — there is no operating project.',
    s6:'Brazil offshore is a world-class, pre-commercial resource at an EM rate. What drives it:',
    breakers:['<b>The contracted price</b> — auctions or PPAs would floor and insulate the revenue.','<b>Country &amp; currency</b> — Brazilian rates and the real set the discount rate.','<b>Capacity factor</b> — world-class north-east wind is the resource upside.','<b>Market development</b> — a pre-commercial market means execution risk and a licensing timeline.'],
    src:'Figures are illustrative for a pre-commercial Brazilian offshore wind project (north-east coast). No large offshore wind farm is yet operating in Brazil; all figures here are approximate and illustrative.',
    econ:{cur:'R$', source:'auction · NE coast wind',
      mwDef:600,mwMin:200,mwMax:1400,mwStep:50, priceDef:340,priceMin:200,priceMax:600,priceStep:5,
      cfDef:52,cfMin:40,cfMax:58,cfStep:1, omPerMW:300, fixedOM:90},
    calc:{build:13500,grant:0,capex:3,revG:4,floor:1300,cap:3600,tax:34,exit:9,lev:5,rd:11,amort:4,hold:14},
    map:{footer:GEO.brazil.footer}
  },

  /* ---------- 4 · STAR OF THE SOUTH (Oceania · Australia · illustrative) ---------- */
  starsouth:{
    name:'Star of the South', geo:'Bass Strait, Australia', continent:'Oceania', cur:'A$', geoKey:'starsouth',
    lede:'Australia\'s most advanced <b>offshore wind</b> proposal — a large early-stage project in the windy waters of Bass Strait, to be built with state support as the country opens its first offshore zones.',
    s1:'<p class="body"><b>Star of the South</b>, off Gippsland in Victoria, is Australia\'s most advanced offshore wind proposal — a multi-gigawatt project in the strong, consistent winds of <b>Bass Strait</b>, connecting into the Latrobe Valley where coal generation is retiring. Australia only declared its first offshore wind zones in the 2020s, so the project is <b>early-stage</b> but well-developed.</p>'+
       '<p class="body">The model will be a <b>contracted generator</b>: power sold under a long offtake — a state-backed <b>support scheme</b> or corporate PPAs — at a fixed, indexed price, so the revenue is contracted. As an early-stage project in a new market, it is capital-heavy and its return turns on the <b>offtake price and the cost of capital</b>. <b>Figures here are illustrative</b> where the project is not yet financed.</p>',
    facts:[['Multi-GW','Scale','early-stage'],['Support / PPA','Offtake','state-backed'],['~48–55%','Capacity factor','Bass Strait wind'],['High','Capex','capital-heavy'],['Project finance','Funding','leveraged'],['Cbus · others','Sponsors','/ developers']],
    s2:'Watch the array — an illustration of a Bass Strait farm. The <b>turbines</b> spin with the strong southern <b>capacity factor</b>, feed the <b>offshore substation</b>, and the cable runs ashore into the Latrobe Valley grid. A state <b>support scheme</b> or PPA would floor the revenue. The <b style="color:#0c6b4f">margin</b> is generation revenue minus O&amp;M. Drag the capacity, the price and the capacity factor.',
    driverLab:'Power price / offtake', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ support/PPA',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> a state <b>support scheme</b> or PPA fixes the price, so drop the power slider and the revenue holds — the offtake floors it. Push the <b>capacity factor</b> to Bass Strait\'s strong, steady wind and watch the output climb. As an early-stage project, the return turns on the offtake price and the cost of capital; the figures are illustrative.',
    s3:'Star of the South would sell <b>generation</b> under a long offtake — a state support scheme or corporate <b>PPAs</b> — at a fixed, indexed price, a contracted cash flow. The <b>margin</b> is generation revenue minus O&amp;M, and Bass Strait\'s wind gives a strong capacity factor. As an early-stage project in a new market, it is capital-heavy and its return turns on the offtake price and the cost of capital. Figures are illustrative where it is not yet financed.',
    mb:{tag:'Model A · contracted & capital-heavy', title:'State-supported offshore wind', body:'A large early-stage offshore wind project in Bass Strait, to be contracted under a state support scheme or PPAs at a fixed price — a capital-heavy build in a new market, project-financed against a contracted offtake. <b>This is Star of the South</b> — Australia\'s most advanced offshore proposal.'},
    s4a:'The dominant cost is <b>O&amp;M</b> (vessels, heavy maintenance, cables) and an offshore base; seabed lease and transmission alongside. The margin is high on a contracted price, but as a first-of-kind in a new market the build is capital-heavy and the financing is the swing factor — the <b>cost of capital</b> shapes the return.',
    wfNote:'Operating cost would be offshore O&amp;M, seabed lease, transmission and insurance. The margin is wide on a contracted offtake and strong Bass Strait wind, but a first-of-kind, capital-heavy build in a new market is sensitive to the cost of capital. Illustrative.',
    s4b:'The capital is the <b>build</b>: turbines, foundations, substation and export cable into the Latrobe Valley — capital-heavy, project-financed against a contracted offtake. The forward capital is the broader Australian offshore <b>pipeline</b> as zones open. The return turns on the offtake price and the cost of capital in a developing market.',
    stackH:'The capital · the offshore build', splitL:'Project financing', splitR:'leveraged',
    split:[['s1',62,'Project-finance debt'],['s2',38,'Sponsor / fund equity']],
    finList:[['','Scale','multi-GW (early-stage)'],['sub','Offtake','state support / PPA'],['','Capex','high (capital-heavy)'],['sub','Funding','project finance'],['','Capacity factor','~48–55% (Bass Strait wind)'],['rest','Sponsors','Cbus & developers']],
    finNote:'Star of the South is a <b>contracted, capital-heavy generator in a new market</b>: a price-insulated offtake cash flow on a first-of-kind build, project-financed at high leverage. The return turns on the offtake price and the cost of capital. Illustrative where not yet financed.',
    timeline:[['2019','<b>Exploration licence</b> granted off Gippsland.'],['2022','<b>Offshore wind law</b> — Australia declares its first zones.'],['2023','<b>Gippsland zone</b> declared; feasibility licences issued.'],['2020s','<b>Development &amp; consenting</b> advance.'],['Future','<b>Financial close</b> and construction.'],['Future','<b>First power</b> as coal retires in the Latrobe Valley.']],
    calcNote:'A working model of an <b>early-stage state-supported offshore wind generator</b>. Revenue is generation × a contracted price; a floor models the support scheme/PPA. The cost of capital reflects a first-of-kind project in a new market. Figures are illustrative where not yet financed.',
    s6:'Star of the South is contracted, capital-heavy offshore wind in a new market. What drives it:',
    breakers:['<b>The offtake price</b> — a state support scheme or PPA floors and insulates the revenue.','<b>Capacity factor</b> — strong, steady Bass Strait wind is the resource.','<b>Capital intensity</b> — a first-of-kind, multi-GW build is expensive.','<b>Cost of capital &amp; market</b> — a new market means financing sensitivity and execution risk.'],
    src:'Figures are illustrative for an early-stage Australian offshore wind project (<a href="https://www.starofthesouth.com.au/" target="_blank" rel="noopener">Star of the South</a>, Bass Strait). The project is not yet financed; all figures here are approximate and illustrative.',
    econ:{cur:'A$', source:'support · Bass Strait wind',
      mwDef:1200,mwMin:400,mwMax:2200,mwStep:50, priceDef:110,priceMin:60,priceMax:200,priceStep:2,
      cfDef:50,cfMin:38,cfMax:57,cfStep:1, omPerMW:58, fixedOM:22},
    calc:{build:5600,grant:0,capex:3,revG:2,floor:520,cap:1100,tax:30,exit:10.5,lev:5,rd:7,amort:4,hold:14},
    map:{footer:GEO.starsouth.footer}
  },

  /* ---------- 5 · GREATER CHANGHUA (Asia · Taiwan · corporate PPA) ---------- */
  changhua:{
    name:'Greater Changhua', geo:'Taiwan Strait', continent:'Asia', cur:'US$', geoKey:'changhua',
    lede:'Asia\'s offshore wind at scale — large farms in the strong winds of the <b>Taiwan Strait</b>, selling power to manufacturers under long <b>corporate PPAs</b> in one of the world\'s best offshore resources.',
    s1:'<p class="body">The <b>Taiwan Strait</b> has some of the best offshore wind in the world, and Taiwan has built a substantial industry around it. <b>Greater Changhua</b> (Ørsted) is among the largest farms — gigawatt-scale arrays off the west coast, feeding a grid hungry for clean power as Taiwan phases out nuclear and decarbonises its huge semiconductor sector.</p>'+
       '<p class="body">The model is a <b>contracted generator</b>: early Taiwanese projects took a feed-in tariff, but the large new farms increasingly sell under long <b>corporate PPAs</b> — notably to chipmakers like TSMC that need clean power at scale — at a fixed, contracted price. So the revenue is contracted; the asset is capital-heavy and project-financed; and the strong strait wind gives a high capacity factor. It is offshore wind at full industrial scale in Asia.</p>',
    facts:[['GW-scale','Scale','large Asian offshore'],['Corporate PPA','Offtake','to chipmakers'],['~45–50%','Capacity factor','Taiwan Strait wind'],['High','Capex','capital-heavy'],['Project finance','Funding','leveraged'],['Ørsted','Sponsor','+ partners']],
    s2:'Watch the array. The <b>turbines</b> spin with the strait\'s strong <b>capacity factor</b>, feed the <b>offshore substation</b>, and the cable runs ashore to Taiwan\'s grid (cyan pulses). A long <b>corporate PPA</b> — to a chipmaker — floors the revenue at a fixed price; drop the power slider and the cash flow holds. The <b style="color:#0c6b4f">margin</b> is generation revenue minus O&amp;M. Drag the capacity, the price and the capacity factor.',
    driverLab:'Power price / PPA', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ corporate PPA',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> a long <b>corporate PPA</b> to a chipmaker fixes the price, so drop the power slider and the revenue holds. Push the <b>capacity factor</b> to the Taiwan Strait\'s strong wind and watch the output climb — the strait is one of the world\'s best resources. The asset is capital-heavy and project-financed, so the cost of capital and the contracted price drive the return.',
    s3:'Greater Changhua sells <b>generation</b> increasingly under long <b>corporate PPAs</b> — to manufacturers like TSMC that need clean power at scale — at a fixed, contracted price (early projects took a feed-in tariff). So the revenue is contracted; the <b>margin</b> is generation revenue minus O&amp;M, and the strait\'s strong wind gives a high capacity factor. The asset is capital-heavy and project-financed: a contracted, industrial-scale generator in Asia.',
    mb:{tag:'Model A · contracted & capital-heavy', title:'Corporate-PPA offshore wind', body:'Gigawatt-scale offshore wind in the Taiwan Strait, selling power under long corporate PPAs to manufacturers that need clean power at scale — a contracted, price-insulated cash flow on a capital-heavy, project-financed build. <b>This is Greater Changhua</b> — Asian offshore wind at full scale.'},
    s4a:'The dominant cost is <b>O&amp;M</b> (vessels, heavy maintenance, cables) and an offshore base; seabed lease and transmission alongside. The margin is high on a contracted PPA price, but the build is capital-heavy and project-financed, so the <b>cost of capital</b> and the contracted price shape the return.',
    wfNote:'Operating cost is offshore O&amp;M, seabed lease, transmission and insurance. The margin is wide on a contracted corporate-PPA price and strong strait wind, but the cash flow services a large project-finance debt against a capital-heavy build.',
    s4b:'The capital is the <b>build</b>: turbines, foundations, substation and export cable — gigawatt-scale and capital-heavy, project-financed against a contracted offtake. The forward capital is the <b>next phase</b> and Taiwan\'s wider auction rounds, each adding contracted generation as chipmakers and the grid demand more clean power.',
    stackH:'The capital · the offshore build', splitL:'Project financing', splitR:'leveraged',
    split:[['s1',66,'Project-finance debt'],['s2',34,'Sponsor / partner equity']],
    finList:[['','Scale','GW-scale (large Asian offshore)'],['sub','Offtake','corporate PPA (+ early FiT)'],['','Capex','high (capital-heavy)'],['sub','Funding','project finance'],['','Capacity factor','~45–50% (Taiwan Strait wind)'],['rest','Sponsor','Ørsted + partners']],
    finNote:'Greater Changhua is a <b>contracted, capital-heavy generator at industrial scale</b>: a price-insulated corporate-PPA cash flow on a gigawatt build, project-financed at high leverage. The return turns on the contracted price, the strong strait wind and the cost of capital.',
    timeline:[['2016','<b>Taiwan</b> sets ambitious offshore wind targets.'],['2018','<b>Feed-in tariff</b> contracts the first large farms.'],['2022','<b>Greater Changhua 1 &amp; 2a</b> come online (Ørsted).'],['2020s','<b>Corporate PPAs</b> — chipmakers buy clean power at scale.'],['2020s','<b>Auction rounds</b> add gigawatts in zonal development.'],['Long-term','<b>Industrial scale</b> as the grid decarbonises.']],
    calcNote:'A working model of a <b>corporate-PPA offshore wind generator</b> in Asia. Revenue is generation × a contracted price; a high floor models the corporate PPA, so the cash flow holds when the power slider falls. The margin is wide; the capital-heavy build and project-finance leverage shape the return.',
    s6:'Greater Changhua is contracted, capital-heavy offshore wind at scale. What drives it:',
    breakers:['<b>The corporate PPA</b> — a long contract to a chipmaker floors and insulates the revenue.','<b>Capacity factor</b> — the Taiwan Strait is one of the world\'s best offshore resources.','<b>Capital intensity</b> — a gigawatt build means the unlevered return is modest.','<b>Project-finance leverage</b> — a contracted offtake supports the debt that lifts the equity return.'],
    src:'Figures from public sources on <a href="https://orsted.com/" target="_blank" rel="noopener">Greater Changhua</a> (Ørsted) and Taiwan\'s offshore wind regime and corporate PPAs. Figures are approximate and illustrative.',
    econ:{cur:'US$', source:'corporate PPA · strait wind',
      mwDef:900,mwMin:300,mwMax:1800,mwStep:50, priceDef:95,priceMin:55,priceMax:175,priceStep:1,
      cfDef:47,cfMin:36,cfMax:54,cfStep:1, omPerMW:52, fixedOM:20},
    calc:{build:4000,grant:0,capex:3,revG:1.5,floor:380,cap:900,tax:20,exit:10.5,lev:6,rd:5.5,amort:4,hold:14},
    map:{footer:GEO.changhua.footer}
  },

  /* ---------- 6 · CHINA OFFSHORE AT SCALE (China · feed-in / regulated) ---------- */
  china:{
    name:'China offshore wind', geo:'China east coast', continent:'China', cur:'¥', geoKey:'china',
    lede:'Offshore wind at <b>continental scale</b> — China has built more offshore capacity than the rest of the world combined, at extraordinary speed and falling cost, under feed-in and regulated offtake.',
    s1:'<p class="body">China is by far the world\'s largest offshore wind market — it has installed more capacity than every other country combined, in barely a decade, along its long east coast from the Yellow Sea to the South China Sea. The build-out is <b>fast and vast</b>: huge state-linked developers, a domestic supply chain and turbines of ever-increasing size.</p>'+
       '<p class="body">The model is a <b>contracted generator</b>: projects have been built under a national or provincial <b>feed-in tariff</b> and increasingly regulated or auctioned offtake, so the revenue is contracted at a fixed price. The defining features are <b>scale and speed</b> — a domestic supply chain has driven capex down sharply — and a <b>low cost of capital</b> from state-linked financing, which is what makes a capital-heavy asset work at continental scale.</p>',
    facts:[['World #1','Scale','> rest of world combined'],['Feed-in / reg.','Offtake','contracted'],['~40–48%','Capacity factor','coastal wind'],['Falling','Capex','domestic supply chain'],['Low','Cost of capital','state-linked'],['State developers','Owners','vast build-out']],
    s2:'Watch the array. The <b>turbines</b> spin with the coastal <b>capacity factor</b>, feed the <b>offshore substation</b>, and the cable runs ashore to the grid (cyan pulses). A <b>feed-in</b> or regulated offtake floors the revenue at a fixed price. At this scale, with falling capex and a low cost of capital, even a contracted price builds an enormous fleet. The <b style="color:#0c6b4f">margin</b> is generation revenue minus O&amp;M. Drag the capacity, the price and the capacity factor.',
    driverLab:'Power price / FiT', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ feed-in/reg',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> push the <b>capacity</b> — China builds offshore wind at a scale no one else matches, with falling capex from a domestic supply chain. A <b>feed-in</b> or regulated price floors the revenue, so drop the power slider and the cash flow holds. The low <b>cost of capital</b> from state-linked financing is what makes a capital-heavy asset pay at continental scale.',
    s3:'A Chinese offshore wind farm sells <b>generation</b> under a national or provincial <b>feed-in tariff</b> or regulated/auctioned offtake at a fixed price — a contracted cash flow. The <b>margin</b> is generation revenue minus O&amp;M. The levers are <b>scale and cost</b>: a domestic supply chain has driven capex down sharply, and a low cost of capital from state-linked financing makes a capital-heavy asset work. It is offshore wind at a scale the rest of the world cannot match.',
    mb:{tag:'Model A · contracted & capital-heavy', title:'Feed-in offshore wind at scale', body:'Offshore wind built at continental scale and extraordinary speed, under a feed-in or regulated offtake at a fixed price — a contracted cash flow on a capital-heavy build, but with falling capex and a low, state-linked cost of capital. <b>This is China offshore wind</b> — more than the rest of the world combined.'},
    s4a:'The dominant cost is <b>O&amp;M</b> (vessels, heavy maintenance, cables) and an offshore base; seabed and transmission alongside. The margin is high on a contracted price, and a domestic supply chain has driven the capital cost down. With a low cost of capital, the model is <b>scale and falling capex</b> rather than a high price.',
    wfNote:'Operating cost is offshore O&amp;M, seabed and transmission. The margin is wide on a contracted feed-in price, and a domestic supply chain has cut the capital cost sharply — the model is scale, falling capex and a low, state-linked cost of capital.',
    s4b:'The capital is the <b>build</b>: turbines, foundations, substation and export cable — but a domestic supply chain has driven capex down sharply, and state-linked financing carries it at a <b>low cost of capital</b>. The forward capital is the relentless <b>next phase</b> — China adds gigawatts every year, each a contracted, low-cost-of-capital generator.',
    stackH:'The capital · the offshore build', splitL:'Financing', splitR:'state-linked',
    split:[['s1',68,'State-linked / policy debt'],['s2',32,'Developer equity']],
    finList:[['','Scale','world #1 (> rest combined)'],['sub','Offtake','feed-in / regulated / auction'],['','Capex','falling (domestic supply chain)'],['sub','Cost of capital','low (state-linked)'],['','Capacity factor','~40–48% (coastal wind)'],['rest','Owners','state-linked developers']],
    finNote:'China offshore wind is a <b>contracted, capital-heavy generator at continental scale</b>: a price-insulated feed-in cash flow on a build whose capex keeps falling, carried at a low, state-linked cost of capital. The model is scale and cost, not price — and the build-out is relentless.',
    timeline:[['2010s','<b>Offshore wind</b> begins along the east coast.'],['2019','<b>Feed-in rush</b> — a surge before tariff cuts.'],['2021','<b>Record installs</b> — more than the rest of the world that year.'],['2020s','<b>Capex falls</b> as the domestic supply chain scales.'],['2020s','<b>Provincial offtake</b> replaces the national feed-in.'],['2030s','<b>Continental scale</b> — gigawatts added every year.']],
    calcNote:'A working model of a <b>feed-in offshore wind generator</b> at scale, on an enterprise-value basis. Revenue is generation × a contracted price; a floor models the feed-in/regulated offtake. Capex is lower (a domestic supply chain) and the cost of capital is low (state-linked), so a capital-heavy asset works at continental scale. Figures are illustrative.',
    s6:'China offshore is contracted, capital-heavy wind at vast scale. What drives it:',
    breakers:['<b>The feed-in / regulated price</b> — a fixed offtake floors and insulates the revenue.','<b>Scale &amp; speed</b> — China builds offshore wind faster and larger than anyone.','<b>Falling capex</b> — a domestic supply chain cuts the capital cost sharply.','<b>Low cost of capital</b> — state-linked financing makes a capital-heavy asset pay.'],
    src:'Figures are illustrative for a Chinese offshore wind project. Given the scale, speed and limited standalone disclosure, all figures here are approximate and illustrative.',
    econ:{cur:'¥', source:'feed-in · coastal wind',
      mwDef:1000,mwMin:300,mwMax:2400,mwStep:50, priceDef:420,priceMin:250,priceMax:700,priceStep:5,
      cfDef:44,cfMin:34,cfMax:50,cfStep:1, omPerMW:300, fixedOM:110},
    calc:{build:17000,grant:0,capex:3,revG:1.5,floor:1800,cap:4800,tax:25,exit:10,lev:6,rd:4,amort:4,hold:15},
    map:{footer:GEO.china.footer}
  }
  };
  var ORDER=['dogger','vineyard','brazil','starsouth','changhua','china'];

  /* ===================================================================
     OFFSHORE WIND RENDERER  (canvas, 720x520) — sea-level / top-down
     A blue ocean with a hint of coastline; an array of offshore turbines (mast +
     3 rotating blades + foundation + reflection) feeds an offshore substation
     platform; a subsea export cable runs to a shore connection (cyan power pulses
     scale with output). Rotor spin scales with the capacity factor; more MW =
     more turbines.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var HORIZON=54;                  // a hint of coastline strip along the top edge
  var OSP={x:556,y:300};           // offshore substation platform
  var SHORE={x:700,y:96};          // shore connection (top-right coast)
  var TSLOTS=[], TURB=[], NTURB=0, spinAng=0;
  /* candidate turbine positions across the sea (x, baseY, scale) */
  function buildSlots(){
    TSLOTS=[
      {x:84,by:188,s:1.30},{x:150,by:262,s:1.14},{x:120,by:338,s:1.22},{x:206,by:212,s:1.02},
      {x:236,by:300,s:1.12},{x:188,by:392,s:1.00},{x:300,by:250,s:1.06},{x:284,by:346,s:0.98},
      {x:352,by:300,s:1.04},{x:340,by:410,s:0.92},{x:418,by:236,s:0.98},{x:430,by:332,s:0.96},
      {x:402,by:404,s:0.88},{x:488,by:286,s:0.94},{x:476,by:378,s:0.86},{x:128,by:436,s:1.06},
      {x:262,by:430,s:0.94},{x:368,by:206,s:0.96}
    ];
  }
  function layout(){
    buildSlots();
    var E=A.econ, mwv=parseFloat(sCap.value);
    var norm=(mwv-E.mwMin)/Math.max(1,(E.mwMax-E.mwMin));
    var n=Math.max(4,Math.min(TSLOTS.length,Math.round(4+norm*(TSLOTS.length-4))));
    // sort by distance to substation so the densest part is nearest the collector
    TSLOTS.sort(function(a,b){ return Math.hypot(a.x-OSP.x,a.by-OSP.y)-Math.hypot(b.x-OSP.x,b.by-OSP.y); });
    TURB=TSLOTS.slice(0,n).map(function(t,i){ return {x:t.x,by:t.by,s:t.s,ph:(i*0.6)%6.28}; });
    NTURB=TURB.length;
  }

  /* ---- ocean + a hint of coastline ---- */
  function drawSea(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#9fc4d8'); g.addColorStop(0.18,'#5b94b8'); g.addColorStop(1,'#1f4f6e');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // coastline strip along the top edge (a hint of shore)
    var lg=ctx.createLinearGradient(0,0,0,HORIZON); lg.addColorStop(0,'#cdd6bf'); lg.addColorStop(1,'rgba(160,180,150,0)');
    ctx.fillStyle=lg; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W,0); ctx.lineTo(W,HORIZON-6);
    for(var x=W;x>=0;x-=36){ ctx.lineTo(x,HORIZON-6+Math.sin(x*0.02+1)*5); } ctx.closePath(); ctx.fill();
    // shore connection node (top-right coast)
    ctx.fillStyle='rgba(120,140,110,0.55)'; ctx.beginPath(); ctx.ellipse(SHORE.x-16,SHORE.y-12,40,26,0,0,Math.PI*2); ctx.fill();
    // moving sea sheen / wave streaks (speed tracks the capacity factor via _cfVis)
    ctx.strokeStyle='rgba(255,255,255,0.10)'; ctx.lineWidth=1.3;
    for(var k=0;k<22;k++){ var yy=HORIZON+18+k*20, xx=((k*97 + T*(0.5+_cfVis*4))%(W+120))-70;
      ctx.beginPath(); ctx.moveTo(xx,yy); ctx.lineTo(xx+30,yy); ctx.stroke(); }
    ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1;
    for(var y=HORIZON+10;y<H;y+=26){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y+5); ctx.stroke(); }
  }
  var _cfVis=0.5;

  /* ---- array collector cables (turbines → substation) ---- */
  function cables(){
    ctx.strokeStyle='rgba(20,50,70,0.35)'; ctx.lineWidth=1.3; ctx.setLineDash([4,4]); ctx.lineDashOffset=-(T*0.4);
    TURB.forEach(function(t){ ctx.beginPath(); ctx.moveTo(t.x,t.by); ctx.lineTo(OSP.x,OSP.y); ctx.stroke(); });
    ctx.setLineDash([]);
  }

  /* ---- offshore substation platform ---- */
  function substation(){
    var x=OSP.x,y=OSP.y, fl=(GEO[A.geoKey].foundation==='floating');
    // reflection / shadow on the sea
    ctx.fillStyle='rgba(10,30,45,0.22)'; ctx.beginPath(); ctx.ellipse(x,y+18,30,7,0,0,Math.PI*2); ctx.fill();
    if(fl){ // floating platform — a pontoon
      ctx.fillStyle='#3a4654'; rr(x-24,y-4,48,12,3); ctx.fill();
      ctx.fillStyle='#586878'; rr(x-22,y+8,8,5,1); ctx.fill(); rr(x+14,y+8,8,5,1); ctx.fill();
    } else { // fixed jacket legs
      ctx.strokeStyle='#3a4654'; ctx.lineWidth=2.4;
      [-18,18].forEach(function(dx){ ctx.beginPath(); ctx.moveTo(x+dx,y+16); ctx.lineTo(x+dx*0.55,y-8); ctx.stroke(); });
    }
    // topside
    ctx.fillStyle='#48586a'; rr(x-22,y-22,44,22,2); ctx.fill();
    ctx.strokeStyle='rgba(150,170,190,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
    ctx.fillStyle='#6a7d90'; rr(x-16,y-30,10,9,1); ctx.fill(); rr(x+5,y-28,9,7,1); ctx.fill();
    glow(x,y-10,12+8*_cfVis,'rgba(127,208,255,'+(0.18+0.3*_cfVis)+')');
    ctx.fillStyle='rgba(160,195,220,0.9)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('SUBSTATION',x,y+30);
  }

  /* ---- a single offshore turbine (mast + 3 blades + foundation + reflection) ---- */
  function turbine(t){
    var s=t.s, x=t.x, wY=t.by;
    // reflection on the water
    ctx.save(); ctx.globalAlpha=0.16; ctx.fillStyle='#0b3349';
    ctx.beginPath(); ctx.ellipse(x,wY+5,4.5*s,2.4*s,0,0,Math.PI*2); ctx.fill(); ctx.restore();
    // foundation / transition piece (yellow) at the waterline
    ctx.fillStyle='#d9b53e'; rr(x-2.6*s,wY-4*s,5.2*s,8*s,1); ctx.fill();
    // tower (tapered)
    var towerH=46*s, topY=wY-4*s-towerH;
    ctx.fillStyle='#eef2f6'; ctx.beginPath();
    ctx.moveTo(x-2.2*s,wY-4*s); ctx.lineTo(x-1.0*s,topY); ctx.lineTo(x+1.0*s,topY); ctx.lineTo(x+2.2*s,wY-4*s); ctx.closePath(); ctx.fill();
    // nacelle
    ctx.fillStyle='#dbe3ea'; rr(x-1.5*s,topY-2.4*s,6.5*s,4.2*s,1); ctx.fill();
    // rotor — spin scales with the capacity factor (spinAng advanced in frame)
    var hx=x+5*s, hy=topY-0.3*s;
    ctx.save(); ctx.translate(hx,hy); ctx.rotate(spinAng+t.ph);
    ctx.fillStyle='#f6f9fc';
    for(var b=0;b<3;b++){ ctx.rotate(Math.PI*2/3);
      ctx.beginPath(); ctx.moveTo(-1.3*s,0); ctx.lineTo(-0.5*s,-22*s); ctx.lineTo(1.5*s,-21*s); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle='#b7c2cc'; ctx.beginPath(); ctx.arc(hx,hy,1.8*s,0,Math.PI*2); ctx.fill();
  }

  /* ---- subsea export cable (substation → shore) with power pulses ---- */
  function exportCable(out){
    var pts=[[OSP.x,OSP.y-22],[OSP.x+60,OSP.y-90],[SHORE.x-30,SHORE.y+30],[SHORE.x-14,SHORE.y]];
    ctx.strokeStyle='rgba(20,55,78,0.5)'; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
    for(var i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]); ctx.stroke();
    flowPulses(pts,1.0+out*1.6,out,'rgba(127,208,255,0.95)','rgba(127,208,255,0.6)',false);
    // shore pylon
    var x=SHORE.x-14,y=SHORE.y;
    ctx.strokeStyle='#3a4a58'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x,y-22); ctx.lineTo(x,y+10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-7,y-16); ctx.lineTo(x+7,y-16); ctx.moveTo(x-9,y-9); ctx.lineTo(x+9,y-9); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('SHORE',x,y+22);
  }
  function flowPulses(pts,speed,load,col,gcol,reverse){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+load*6));
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); if(reverse) f=1-f; var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],3.6,gcol); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(p[0],p[1],1.6,0,Math.PI*2); ctx.fill(); }
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ power',b:'+ CfD',c:'− O&M'};
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
    var mwv=parseFloat(sCap.value), price=parseFloat(sSpread.value), cf=parseFloat(sAvail.value)/100;
    // slight wobble around the capacity factor for the sparkline + spin + output
    var cfVis=Math.max(0.02,Math.min(1, cf*(0.92+0.14*Math.sin(T*0.02))));
    _cfVis=cfVis;
    // rotor spin scales with the capacity factor
    spinAng += 0.02 + cfVis*0.16;

    ctx.clearRect(0,0,W,H);
    drawSea(); cables(); substation();
    // draw turbines back-to-front (further up = behind)
    TURB.slice().sort(function(a,b){ return a.by-b.by; }).forEach(function(t){ turbine(t); });
    var out=0.2+0.75*cfVis;
    exportCable(out);

    if(G.growing && NTURB<TSLOTS.length){
      var nxt=TSLOTS[NTURB];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ NEXT PHASE',nxt.x,nxt.by-52); ctx.restore();
        glow(nxt.x,nxt.by-20,9,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    }

    // ---- economics (contracted, capital-heavy generation) ----
    var generation=mwv*8760*cf;                  // MWh/yr
    var grossRev=generation*price;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));    // floor = CfD/PPA contracted revenue
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var opex= mwv*(E.omPerMW||0)*1000 + (E.fixedOM||0)*1e6;   // O&M per MW + fixed
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is contracted-floor (CfD/PPA) vs market
    var fixShare=Math.max(0.5,Math.min(0.95, revenue>grossRev?(revenue-grossRev)/revenue+0.6:0.6));
    var c_om = mwv*(E.omPerMW||0)*1000, c_fix=(E.fixedOM||0)*1e6;
    var c_lease=c_fix*0.30, c_trans=c_fix*0.40, c_ins=c_fix*0.30;

    if(_anim){
      var litT=TURB.length?TURB:[{x:OSP.x,by:OSP.y}];
      if(Math.random()<0.6){ var s1=litT[(Math.random()*litT.length)|0]; spawnCoin(s1.x,s1.by-50, Math.random()<fixShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.5, opex/Math.max(1,revenue)));
      if(Math.random()<outRate){ var s2=litT[(Math.random()*litT.length)|0]; spawnCoin(s2.x,s2.by-6,'cost',1); }
      demHist.push(cfVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(cfVis);

    ctx.save(); ctx.fillStyle='rgba(235,245,250,0.85)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(220,236,244,0.7)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+mw(mwv),W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(8,28,42,0)'); vg.addColorStop(1,'rgba(8,28,42,0.16)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',mw(mwv)); set('ixSpreadV',CUR+Math.round(price)+'/MWh'); set('ixAvailV',Math.round(cf*100)+'%');
    set('ixDir',mw(mwv)); set('ixDirS',(G.foundation==='floating'?'floating':'fixed-bottom')+' · '+(E.source||''));
    set('ixMW',gwh(generation)); set('ixMWs',Math.round(cf*100)+'% capacity factor / yr');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Turbine O&amp;M',c_om],['Seabed lease',c_lease],['Transmission',c_trans],['Insurance',c_ins]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the EBITDA is too thin to value — raise the power price or the capacity factor, or lower the build cost.</span>'; return; }
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is generation (capacity × hours × capacity factor) × power price (with a floor for the CfD / PPA contracted price) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ layout(); frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.mwDef; sSpread.value=E.priceDef; sAvail.value=E.cfDef; layout(); frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'dogger');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
