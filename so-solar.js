/* Solar (utility-scale PV) — data-driven worked examples.
   Six real utility-scale solar businesses, one template. Scene config from
   so-geo.js (GEO), drawn as a top-down solar farm in 720x520 scene coords: neat
   rows of tilted PV panel tables fill the scene, a sun glyph whose glow ties to
   the capacity factor casts light rays, and a combiner/substation exports power
   out along an export line. The economics are a generation business with a
   contracted floor: revenue is capacity × hours × capacity factor × power price,
   bounded by a PPA/CfD floor and a revenue cap, against a very low operating
   cost (solar O&M is tiny), and the returns model is a simplified DCF. */
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
  function mwp(mw){ return mw>=1000?(mw/1000).toFixed(mw>=10000?0:1)+' GWp':Math.round(mw)+' MWp'; }
  function gwh(mwh){ return mwh>=1e6?(mwh/1e6).toFixed(1)+' TWh':(mwh>=1e3?(mwh/1e3).toFixed(mwh>=1e4?0:1)+' GWh':Math.round(mwh)+' MWh'); }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · IBERIAN SOLAR (Europe · corporate-PPA + merchant) ---------- */
  iberia:{
    name:'Iberian solar', geo:'Spain', continent:'Europe', cur:'€', geoKey:'iberia',
    lede:'The engine of Europe\'s solar boom — vast <b>utility-scale PV</b> on the Iberian plateau, sold partly under <b>corporate power-purchase agreements</b> and partly into a <b>merchant</b> market exposed to solar\'s own midday price cannibalisation.',
    s1:'<p class="body"><b>Utility-scale solar</b> is the simplest infrastructure asset there is: thousands of PV panel tables in neat rows, a combiner and substation, and an export line carrying power to the grid. There is no fuel, almost no moving parts, and very little operating cost — the panels generate whenever the sun shines, and the output is set by the <b>capacity factor</b> (how much of nameplate capacity is realised over the year, a function of irradiance and tracking).</p>'+
       '<p class="body"><b>Iberia</b> — Spain and Portugal — has Europe\'s best irradiance and has become the continent\'s solar workshop. Developers sell the output in two ways: long <b>corporate PPAs</b> (a tech company or utility buys the power at a fixed price for 10–15 years, giving a contracted floor) and the rest <b>merchant</b>, into the wholesale market. The merchant slice carries a particular solar risk — <b>price cannibalisation</b>: when every plant generates at midday, the pool price at solar hours falls, so each extra MWp earns a little less.</p>',
    facts:[['~22%','Capacity factor','single-axis tracking'],['PPA + merchant','Offtake','contracted floor + spot'],['Very low','Opex','no fuel · tiny O&M'],['Cannibalisation','Merchant risk','midday price drop'],['€/MWh','Revenue','price × generation'],['Tracking','Tech','+ output vs fixed-tilt']],
    s2:'Watch the array. Rows of <b>PV panel tables</b> fill the scene; the <b>sun</b> in the corner brightens with the <b>capacity factor</b>, casting rays across the field, and the export line carries power out to the grid (cyan pulses scale with output). More <b>MWp</b> means more rows; a higher <b>capacity factor</b> means a brighter sun and stronger export. The owner\'s <b style="color:#0c6b4f">margin</b> is almost the whole revenue — opex is tiny. Drag the capacity, the power price and the capacity factor.',
    driverLab:'Power price / PPA', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ green cert',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>power price</b> right down — and watch the revenue stop falling at the <b>floor</b>, which is the contracted PPA. That floor is the whole point of a corporate PPA: it caps the downside of merchant price cannibalisation. Now push the <b>capacity factor</b> (better irradiance, tracking) and see generation — and, with such low opex, almost all of it drops to EBITDA.',
    s3:'An Iberian solar plant sells <b>generation × price</b>. Part is contracted under <b>corporate PPAs</b> — a fixed price that sets a floor — and part is <b>merchant</b>, exposed to the wholesale pool. Because solar has no fuel and tiny O&amp;M, the <b>EBITDA margin is very high</b> (80–90%); almost all of revenue is margin. The risks are the power price and, specifically, solar\'s <b>cannibalisation</b> — the more solar on the system, the lower the price during sunny hours. The PPA floor and a touch of storage are the answers.',
    mb:{tag:'Model A · the low-cost generator', title:'Iberian PPA-plus-merchant solar', body:'A large PV plant on Europe\'s best irradiance, sold partly under long corporate PPAs (a contracted floor) and partly merchant, with very low opex and a high EBITDA margin — the catch is merchant price cannibalisation at midday. <b>This is Iberian utility-scale solar</b>.'},
    s4a:'There is almost no operating cost: no fuel, and <b>O&amp;M</b> (panel cleaning, inverter and tracker maintenance, land lease, grid charges) is a few percent of revenue. So the waterfall is short and the <b>margin is wide</b> — the whole investment is the capex and the price the power earns.',
    wfNote:'Operating cost is just O&amp;M — panel cleaning, inverters, trackers, land lease and grid charges — a few percent of revenue. With no fuel, the EBITDA margin is very high; the swing factor is the power price (and solar\'s midday cannibalisation on the merchant slice).',
    s4b:'The capital is the panels, trackers, inverters, the combiner/substation and the grid connection — cheap per MWp by infrastructure standards (solar capex has fallen dramatically) and quick to build. Much is funded with project debt against the contracted PPA; the merchant slice carries more equity. Growth is simply building more MWp as irradiance and grid capacity allow.',
    stackH:'The capital · panels + grid connection', splitL:'Financing', splitR:'project-financed',
    split:[['s1',62,'Project debt (against PPA)'],['s2',38,'Sponsor equity']],
    finList:[['','Capacity factor','~22% (single-axis tracking)'],['sub','Offtake','corporate PPA + merchant'],['','Revenue','price × generation'],['sub','Opex','very low (no fuel)'],['','Merchant risk','midday cannibalisation'],['rest','Growth','more MWp + storage']],
    finNote:'Iberian solar is a <b>low-cost, high-margin generation asset</b>: cheap capex, tiny opex, and a wide margin on whatever price the power earns. The PPA gives a contracted floor; the merchant slice carries price and cannibalisation risk. Returns are solid mid-single-digit to high-single-digit equity IRRs.',
    timeline:[['2018','<b>Subsidy-free</b> solar takes off in Spain.'],['2019','<b>Corporate PPAs</b> become the standard offtake.'],['2020s','<b>Single-axis tracking</b> lifts capacity factors.'],['2023','<b>Cannibalisation</b> emerges as midday pool prices fall.'],['2020s','<b>Co-located storage</b> begins to shift output off-peak.'],['Ongoing','<b>Build-out</b> continues across the peninsula.']],
    calcNote:'A working model of a <b>PPA-plus-merchant solar plant</b>. Revenue is capacity × hours × capacity factor × power price, with a floor for the contracted PPA and a cap. Opex is very low (no fuel), so the margin is very high; the returns model is a simplified DCF.',
    s6:'Iberian solar is cheap, high-margin generation — with a merchant catch. What drives it:',
    breakers:['<b>The power price</b> — the PPA floor caps the downside; the merchant slice is the upside and the risk.','<b>Capacity factor</b> — irradiance and single-axis tracking set how much each MWp earns.','<b>Cannibalisation</b> — more solar lowers the price during sunny hours; storage and shape are the answer.','<b>Capex per MWp</b> — solar is cheap and getting cheaper, the key to the return.'],
    src:'Figures are illustrative for an Iberian utility-scale solar plant, drawn from public solar PPA and merchant-market data. The figures are approximate and illustrative.',
    econ:{cur:'€', omPerMW:13, fixedOM:0.6,
      mwDef:300,mwMin:80,mwMax:800,mwStep:10, priceDef:42,priceMin:22,priceMax:90,priceStep:1,
      cfDef:22,cfMin:14,cfMax:28,cfStep:1, capexPerMW:0.95},
    calc:{build:255,grant:0,capex:1.5,revG:1.5,floor:18,cap:160,tax:25,exit:11,lev:5,rd:5,amort:3,hold:25},
    map:{footer:GEO.iberia.footer}
  },

  /* ---------- 2 · US UTILITY-SCALE SOLAR (North America · PPA + ITC) ---------- */
  ussolar:{
    name:'US utility-scale solar', geo:'Texas / California, USA', continent:'North America', cur:'US$', geoKey:'ussolar',
    lede:'The world\'s most bankable solar market — vast <b>utility-scale PV</b> in Texas and California, sold under long <b>power-purchase agreements</b> and financed with <b>investment tax credit</b> tax-equity.',
    s1:'<p class="body"><b>US utility-scale solar</b> is built at enormous scale across the sun-belt — Texas (ERCOT) and California (CAISO) above all. The asset is the same: rows of single-axis-tracking PV, a substation, and a grid connection. What makes the US distinctive is the <b>financing</b>: the federal <b>investment tax credit (ITC)</b> funds a large share of the capital through <b>tax-equity</b>, lowering the sponsor\'s net cost per MWp.</p>'+
       '<p class="body">Most output is sold under long <b>PPAs</b> to utilities and corporates, giving a contracted, indexed revenue for 15–20 years — a clean infrastructure annuity. A merchant tail and, increasingly, <b>co-located battery storage</b> add upside and shift output to higher-value hours. With no fuel and very low O&amp;M, the EBITDA margin is high; the return is a function of the PPA price, the capacity factor and the tax-credit-reduced capex.</p>',
    facts:[['~25%','Capacity factor','sun-belt + tracking'],['Long PPA','Offtake','15–20yr, indexed'],['ITC','Financing','tax-equity'],['Very low','Opex','no fuel · tiny O&M'],['+ storage','Upside','shift to peak hours'],['US$/MWh','Revenue','price × generation']],
    s2:'Watch the array. Rows of tracking <b>PV panels</b> fill the scene; the <b>sun</b> brightens with the <b>capacity factor</b>, and the export line carries power out to the grid (cyan pulses scale with output). More <b>MWp</b> means more rows. With a long PPA the price is locked, so the <b style="color:#0c6b4f">margin</b> — almost the whole revenue, since opex is tiny — is contracted. Drag the capacity, the PPA price and the capacity factor.',
    driverLab:'PPA price', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ green cert',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> the offtake is a long <b>PPA</b>, so the price barely moves — drop it and the <b>floor</b> holds the revenue up. The return lever is the <b>capacity factor</b> (sun-belt irradiance plus single-axis tracking) and the ITC-reduced capex. Push the capacity factor and watch generation rise — with such low opex, nearly all of it becomes EBITDA.',
    s3:'A US utility-scale solar plant sells <b>generation × price</b> under a long PPA — a contracted, indexed annuity. The <b>ITC</b> funds much of the capital through tax-equity, cutting the sponsor\'s net capex per MWp and lifting the equity return. Opex is tiny (no fuel), so the <b>EBITDA margin is very high</b>. Storage co-location adds value by shifting output to peak hours. The levers are the PPA price, the capacity factor and the tax-equity structure.',
    mb:{tag:'Model A · the low-cost generator', title:'US PPA solar with ITC tax-equity', body:'A sun-belt PV plant selling power under a long indexed PPA, with the investment tax credit funding much of the build through tax-equity — a contracted, high-margin generation annuity, with storage co-location as upside. <b>This is US utility-scale solar</b>.'},
    s4a:'There is no fuel and very little operating cost — <b>O&amp;M</b> (cleaning, inverters, trackers, land lease, insurance) is a few percent of revenue. The waterfall is short and the <b>margin wide</b>; the investment is the (ITC-reduced) capex and the PPA price the power earns.',
    wfNote:'Operating cost is just O&amp;M — cleaning, inverters, trackers, land lease and insurance — a few percent of revenue. With no fuel and a contracted PPA, the EBITDA margin is very high and stable; the ITC reduces the net capital.',
    s4b:'The capital is the panels, trackers, inverters, substation and grid connection. The <b>ITC</b> funds a large share through tax-equity, with the rest project debt against the PPA and sponsor equity — so the sponsor\'s net cost per MWp is low. Growth is more MWp and co-located batteries, each adding contracted, high-margin output.',
    stackH:'The capital · panels + tax-equity', splitL:'Financing', splitR:'ITC-supported',
    split:[['s1',58,'Tax-equity + project debt'],['s2',42,'Sponsor equity']],
    finList:[['','Capacity factor','~25% (sun-belt + tracking)'],['sub','Offtake','long indexed PPA'],['','Financing','ITC tax-equity + debt'],['sub','Opex','very low (no fuel)'],['','Upside','co-located storage'],['rest','Growth','more MWp + batteries']],
    finNote:'US utility-scale solar is a <b>contracted, high-margin generation annuity</b>: a long PPA, tiny opex, and an ITC that cuts the net capital. Returns are solid mid-to-high single-digit equity IRRs; storage and the tax-equity structure are the swing factors.',
    timeline:[['2010s','<b>Sun-belt solar</b> scales in California and the Southwest.'],['2016','<b>ITC extension</b> underpins the build-out.'],['2020s','<b>Texas / ERCOT</b> becomes the largest growth market.'],['2022','<b>Inflation Reduction Act</b> extends and expands the ITC.'],['2020s','<b>Co-located storage</b> shifts output to peak hours.'],['Ongoing','<b>Record build</b> across the sun-belt.']],
    calcNote:'A working model of a <b>US PPA solar plant</b>. Revenue is capacity × hours × capacity factor × PPA price, with a floor for the contract. Opex is very low; the ITC reduces the net capital. The margin is very high and the returns model is a simplified DCF.',
    s6:'US solar is a long-PPA, tax-credit-financed annuity. What drives it:',
    breakers:['<b>The PPA price</b> — a long indexed contract sets a stable, high-margin revenue.','<b>Capacity factor</b> — sun-belt irradiance and tracking set how much each MWp earns.','<b>ITC / tax-equity</b> — the investment tax credit cuts the net capital and lifts the equity return.','<b>Storage co-location</b> — shifting output to peak hours adds value and shapes the merchant tail.'],
    src:'Figures are illustrative for a US utility-scale solar plant (ERCOT / CAISO), drawn from public solar PPA and tax-equity data. The figures are approximate and illustrative.',
    econ:{cur:'US$', omPerMW:14, fixedOM:0.7,
      mwDef:350,mwMin:100,mwMax:900,mwStep:10, priceDef:35,priceMin:20,priceMax:75,priceStep:1,
      cfDef:25,cfMin:18,cfMax:30,cfStep:1, capexPerMW:1.00},
    calc:{build:315,grant:0,capex:1.5,revG:2,floor:20,cap:140,tax:21,exit:11,lev:5,rd:5.5,amort:3,hold:25},
    map:{footer:GEO.ussolar.footer}
  },

  /* ---------- 3 · ATACAMA SOLAR (South America · world-best irradiance) ---------- */
  atacama:{
    name:'Atacama solar', geo:'Atacama Desert, Chile', continent:'South America', cur:'US$', geoKey:'atacama',
    lede:'The best place on Earth to build solar — the <b>Atacama Desert</b> has the world\'s highest irradiance, giving exceptional <b>capacity factors</b>, sold into a mix of <b>merchant</b> and PPA at emerging-market rates.',
    s1:'<p class="body">The <b>Atacama Desert</b> in northern Chile has the highest solar irradiance on the planet — clear skies, high altitude, dry air. A PV plant here achieves a <b>capacity factor</b> far above a typical European or US site, so each MWp generates much more energy per year. That is the whole investment thesis: build cheap solar where the sun is strongest.</p>'+
       '<p class="body">Chile\'s market is part <b>merchant</b> (the spot market) and part <b>PPA</b> (long contracts to mines and distributors). The merchant exposure carries price risk — including solar cannibalisation and, historically, transmission constraints between the desert and the load centres. And the whole return is discounted at <b>emerging-market</b> rates: a superb asset, carried against Chilean cost of capital and currency. The combination of world-best irradiance and EM pricing is what makes Atacama distinctive.</p>',
    facts:[['~28%','Capacity factor','world-best irradiance'],['Merchant + PPA','Offtake','spot + mine contracts'],['Desert','Terrain','high altitude, dry'],['EM rate','Discount','Chilean cost of capital'],['Very low','Opex','no fuel · tiny O&M'],['US$/MWh','Revenue','price × generation']],
    s2:'Watch the array. Rows of <b>PV panels</b> spread across the desert; the <b>sun</b> blazes — the capacity factor here is the world\'s best — casting strong rays, and the export line carries power out (cyan pulses scale with output). Push the <b>capacity factor</b> to the top of its range and see generation soar. The <b style="color:#0c6b4f">margin</b> is almost the whole revenue, but the return is discounted at an EM rate. Drag the capacity, the price and the capacity factor.',
    driverLab:'Power price / PPA', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ green cert',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> push the <b>capacity factor</b> to the top — the Atacama\'s world-best irradiance means each MWp generates far more than elsewhere, and with tiny opex it nearly all becomes EBITDA. But raise the <b>cost of debt</b> in the model and watch a superb asset net down once discounted like a Chilean one — the EM rate, not the sun, is the swing on the return.',
    s3:'An Atacama solar plant generates exceptional energy from the world\'s best irradiance — a high <b>capacity factor</b> on cheap capex. Output is sold part <b>merchant</b> (spot) and part <b>PPA</b> (to mines and distributors), so the price carries spot, cannibalisation and historically transmission risk. Opex is tiny, so the margin is very high — but the return is discounted at <b>emerging-market</b> rates. The investor question is less the asset than the discount rate, the offtake mix and grid access.',
    mb:{tag:'Model A · the low-cost generator', title:'Atacama merchant-plus-PPA solar', body:'A desert PV plant on the world\'s best irradiance — exceptional capacity factor, tiny opex, very high margin — sold part merchant and part PPA, but carried at emerging-market rates and exposed to spot price and grid access. <b>This is Atacama solar</b>.'},
    s4a:'There is no fuel and almost no operating cost — <b>O&amp;M</b> (cleaning, inverters, land) is a few percent of revenue; in the dry desert even cleaning is modest. The waterfall is short, the <b>margin wide</b>; the investment is the capex, the price the power earns, and the EM discount rate.',
    wfNote:'Operating cost is just O&amp;M — cleaning, inverters, trackers, land — a few percent of revenue. With world-best irradiance and no fuel, the margin is very high; the swing factors are the spot/PPA price and the emerging-market discount rate.',
    s4b:'The capital is the panels, trackers, inverters, substation and a long grid connection to the load centres. Capex per MWp is low and the energy yield high, so the asset is excellent — but it is financed at Chilean rates and currency, and the return is carried at an emerging-market cost of capital. Growth is more desert MWp as transmission allows.',
    stackH:'The capital · panels + grid connection', splitL:'Financing', splitR:'EM',
    split:[['s1',55,'Local / project debt'],['s2',45,'Sponsor equity']],
    finList:[['','Capacity factor','~28% (world-best)'],['sub','Offtake','merchant + PPA'],['','Terrain','high-altitude desert'],['sub','Opex','very low (no fuel)'],['','Discount','EM (Chilean) rate'],['rest','Risk','spot price + grid access']],
    finNote:'Atacama solar is a <b>world-best generation asset at an EM discount rate</b>: exceptional capacity factor and tiny opex, but spot-price and grid risk, carried against Chilean cost of capital. The whole debate is the discount rate and the offtake mix, not the sun.',
    timeline:[['2010s','<b>Atacama solar</b> begins at scale on world-best irradiance.'],['2010s','<b>Mining PPAs</b> anchor early projects.'],['2016','<b>Record-low tariffs</b> set in Chilean auctions.'],['2020s','<b>Transmission</b> upgrades ease desert-to-load constraints.'],['2020s','<b>Storage</b> begins to firm the merchant output.'],['Ongoing','<b>Build-out</b> across the northern desert.']],
    calcNote:'A working model of an <b>EM desert-solar plant</b>. Revenue is capacity × hours × capacity factor × price, with a floor for any PPA. The capacity factor is world-best; opex is tiny. The cost of debt is higher to reflect EM rates, netting a superb asset down once discounted.',
    s6:'Atacama is the world\'s best solar, at an EM rate. What drives it:',
    breakers:['<b>Capacity factor</b> — the world\'s best irradiance means each MWp generates far more.','<b>Country &amp; currency</b> — Chilean rates set the discount rate on a superb asset.','<b>Offtake mix</b> — merchant spot exposure vs mining/distributor PPAs.','<b>Grid access</b> — transmission between the desert and load centres, and curtailment.'],
    src:'Figures are illustrative for an Atacama (Chile) utility-scale solar plant, drawn from public Chilean solar and auction data. The figures are approximate and illustrative.',
    econ:{cur:'US$', omPerMW:11, fixedOM:0.5,
      mwDef:250,mwMin:80,mwMax:700,mwStep:10, priceDef:34,priceMin:16,priceMax:75,priceStep:1,
      cfDef:28,cfMin:20,cfMax:33,cfStep:1, capexPerMW:0.92},
    calc:{build:205,grant:0,capex:1.5,revG:1.5,floor:14,cap:120,tax:27,exit:10,lev:4,rd:8.5,amort:3,hold:22},
    map:{footer:GEO.atacama.footer}
  },

  /* ---------- 4 · AUSTRALIAN SOLAR FARM (Oceania · merchant + curtailment) ---------- */
  ausolar:{
    name:'Australian solar farm', geo:'Australia (NEM)', continent:'Oceania', cur:'A$', geoKey:'ausolar',
    lede:'A <b>merchant solar farm</b> in Australia\'s National Electricity Market — high irradiance and a fast build-out, but exposed to <b>negative midday prices</b> and grid <b>curtailment</b> as solar saturates the system.',
    s1:'<p class="body">Australia has world-class irradiance and has built solar faster than almost anywhere — rooftop and utility-scale together. A utility-scale plant in the <b>National Electricity Market (NEM)</b> sells most of its output <b>merchant</b>, into a regional spot market, often without a long PPA. The asset is cheap to build and tiny to run, with a strong capacity factor.</p>'+
       '<p class="body">But Australia is the textbook case of solar\'s own success becoming a risk. So much solar generates at midday that the spot price during sunny hours can fall to zero or <b>negative</b>, and weak grids in some regions force <b>curtailment</b> — the plant is told to stop exporting. Together these mean the realised price (and effective capacity factor) is below the theoretical one. The lever is shifting output off the midday peak — through <b>storage</b> — and securing firmer offtake.</p>',
    facts:[['~24%','Capacity factor','strong irradiance'],['Merchant','Offtake','NEM spot'],['Negative prices','Risk','midday cannibalisation'],['Curtailment','Risk','weak grid / oversupply'],['Very low','Opex','no fuel · tiny O&M'],['A$/MWh','Revenue','price × generation']],
    s2:'Watch the array. Rows of <b>PV panels</b> fill the scene; the <b>sun</b> brightens with the <b>capacity factor</b>, and the export line carries power out (cyan pulses scale with output) — except when the grid curtails it. Drop the <b>power price</b> toward zero to see the merchant downside; with no PPA floor, the revenue follows it down. The <b style="color:#0c6b4f">margin</b> is wide when prices hold, thin when they don\'t. Drag the capacity, the price and the capacity factor.',
    driverLab:'Power price', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × price',
    ledge:{a:'+ power',b:'+ green cert',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> drop the <b>power price</b> right down — with a low floor (little contracted offtake), the revenue follows it, because this is a <b>merchant</b> plant exposed to midday cannibalisation and even negative prices. That is the Australian solar risk: a cheap, high-capacity-factor asset whose realised price is hammered by its own success. Storage and firmer offtake are the answer.',
    s3:'An Australian solar farm generates strongly from good irradiance but sells <b>merchant</b> into the NEM spot market. Its risk is solar <b>cannibalisation</b> — so much midday solar that the spot price falls to zero or negative — and grid <b>curtailment</b> in weak regions. So while opex is tiny and the gross margin wide, the <b>realised price</b> can be low. The investment lever is shaping the output away from the midday glut through co-located <b>storage</b>, and contracting firmer offtake to add a floor.',
    mb:{tag:'Model A · the low-cost generator', title:'Australian merchant solar farm', body:'A cheap, high-capacity-factor PV plant selling merchant into the NEM — wide gross margin, but exposed to negative midday prices and grid curtailment, so the realised price is the risk. Storage and firmer offtake are the answer. <b>This is an Australian solar farm</b>.'},
    s4a:'There is no fuel and almost no operating cost — <b>O&amp;M</b> is a few percent of revenue. The waterfall is short and the <b>gross margin wide</b>; the whole risk is not on the cost side but on the <b>realised price</b> — cannibalisation and curtailment in a merchant market.',
    wfNote:'Operating cost is just O&amp;M — a few percent of revenue. The margin is wide on the cost side; the real swing factor is the realised merchant price, hit by midday cannibalisation and curtailment.',
    s4b:'The capital is the panels, trackers, inverters and grid connection — cheap per MWp. But with merchant offtake the equity carries the price risk, so the financing is more conservative (less debt) than a contracted plant. The value-add is co-located <b>storage</b> to shift output and firmer PPAs to add a floor; growth is more MWp where the grid can take it.',
    stackH:'The capital · panels + grid connection', splitL:'Financing', splitR:'merchant',
    split:[['s1',48,'Project debt (merchant-sized)'],['s2',52,'Sponsor equity']],
    finList:[['','Capacity factor','~24% (strong irradiance)'],['sub','Offtake','merchant (NEM spot)'],['','Risk','negative midday prices'],['sub','Risk','grid curtailment'],['','Opex','very low (no fuel)'],['rest','Answer','storage + firmer offtake']],
    finNote:'An Australian solar farm is a <b>cheap, high-yield merchant asset with price risk</b>: wide gross margin, but realised price hit by cannibalisation and curtailment. Returns are more variable than a contracted plant; storage and firmer offtake are the levers.',
    timeline:[['2017','<b>Utility-scale solar</b> booms across the NEM.'],['2019','<b>Marginal loss factors</b> and curtailment bite in weak grids.'],['2020s','<b>Negative midday prices</b> become common.'],['2020s','<b>Co-located storage</b> begins to firm output.'],['2020s','<b>Firming PPAs</b> add contracted floors.'],['Ongoing','<b>Build-out</b> continues where grid allows.']],
    calcNote:'A working model of a <b>merchant solar farm</b>. Revenue is capacity × hours × capacity factor × spot price, with only a low floor (little contracted offtake). Opex is tiny, but the realised price carries cannibalisation and curtailment risk; the returns model is a simplified DCF.',
    s6:'Australian solar is cheap, high-yield, and merchant-exposed. What drives it:',
    breakers:['<b>The realised price</b> — merchant exposure to negative midday prices is the core risk.','<b>Curtailment</b> — weak grids and oversupply cut effective output.','<b>Storage &amp; shape</b> — shifting output off the midday glut is the value-add.','<b>Offtake</b> — firmer PPAs add a floor and de-risk the merchant exposure.'],
    src:'Figures are illustrative for an Australian (NEM) utility-scale solar farm, drawn from public AEMO and merchant-market data. The figures are approximate and illustrative.',
    econ:{cur:'A$', omPerMW:14, fixedOM:0.5,
      mwDef:200,mwMin:60,mwMax:600,mwStep:10, priceDef:44,priceMin:10,priceMax:100,priceStep:1,
      cfDef:24,cfMin:16,cfMax:29,cfStep:1, capexPerMW:0.92},
    calc:{build:184,grant:0,capex:1.5,revG:1,floor:8,cap:130,tax:30,exit:9,lev:4,rd:6.5,amort:3,hold:22},
    map:{footer:GEO.ausolar.footer}
  },

  /* ---------- 5 · AL DHAFRA / SWEIHAN (Middle East · record-low tariff) ---------- */
  aldhafra:{
    name:'Al Dhafra / Sweihan solar', geo:'Abu Dhabi, UAE', continent:'Middle East', cur:'AED', geoKey:'aldhafra',
    lede:'The plants that set the <b>world\'s lowest solar tariffs</b> — giant single-site PV in Abu Dhabi, sold under one very long <b>power-purchase agreement</b> at record-low prices, made possible by huge irradiance and a very low cost of capital.',
    s1:'<p class="body"><b>Al Dhafra</b> (2 GW) and <b>Sweihan / Noor Abu Dhabi</b> (1.2 GW) are among the largest single-site solar plants in the world. They sit in a near-ideal environment: vast flat desert, very high irradiance, and a government offtaker. The headline is the <b>tariff</b>: these projects set successive <b>world records for the lowest solar power price</b> ever contracted — well under US 2 cents per kWh.</p>'+
       '<p class="body">How is that possible at a profit? Three things: <b>enormous irradiance</b> (a high capacity factor), <b>scale</b> (cheap capex per MWp), and — decisively — a <b>very low cost of capital</b>. The output is sold under a single, very long (30-year) <b>PPA</b> to a state-backed offtaker, so the revenue is contracted and bond-like, and the equity is financed at low rates. A record-low tariff still clears a solid return when the discount rate is low and the asset runs for 30 years.</p>',
    facts:[['~26%','Capacity factor','huge irradiance'],['Record-low','Tariff','<2¢/kWh contracted'],['Single 30yr PPA','Offtake','state-backed'],['Very low','Cost of capital','the decisive lever'],['GW-scale','Size','among world\'s largest'],['AED/MWh','Revenue','price × generation']],
    s2:'Watch the array. Endless rows of <b>PV panels</b> across the desert; the <b>sun</b> blazes with the high <b>capacity factor</b>, casting strong rays, and the export line carries power out (cyan pulses scale with output). The price is locked under one very long PPA — so even at a record-low tariff (a low floor), the revenue is contracted and bond-like. The <b style="color:#0c6b4f">margin</b> is almost the whole revenue. Drag the capacity, the tariff and the capacity factor.',
    driverLab:'PPA tariff', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × tariff',
    ledge:{a:'+ power',b:'+ green cert',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> set the <b>tariff</b> very low — a record-low price — and notice the return can still clear, because the <b>capacity factor</b> is huge, the capex per MWp tiny, and (in the model) the <b>cost of debt</b> is very low. That is the Gulf solar formula: irradiance plus scale plus a low cost of capital turn a record-low tariff into a solid 30-year annuity.',
    s3:'Al Dhafra and Sweihan sell power under a single, very long <b>PPA</b> at a record-low tariff to a state-backed offtaker — a contracted, bond-like annuity for 30 years. The record price works because of <b>huge irradiance</b> (high capacity factor), <b>GW-scale</b> cheap capex, and a <b>very low cost of capital</b>. Opex is tiny, so the margin is very high. The levers are the cost of capital and the capacity factor; the offtake risk is minimal given the long state-backed PPA.',
    mb:{tag:'Model A · the low-cost generator', title:'Record-low-tariff Gulf solar', body:'A GW-scale desert PV plant selling power under a single 30-year PPA at a world-record-low tariff to a state-backed offtaker — made profitable by huge irradiance, scale and a very low cost of capital. A contracted, bond-like generation annuity. <b>This is Al Dhafra / Sweihan</b>.'},
    s4a:'There is no fuel and almost no operating cost — <b>O&amp;M</b> (cleaning, inverters) is a few percent of even a record-low revenue. The waterfall is short and the <b>margin wide</b>; the whole story is the (very cheap) capex, the high capacity factor, and the very low cost of capital against a 30-year PPA.',
    wfNote:'Operating cost is just O&amp;M — cleaning and inverters — a few percent of revenue. With a record-low tariff the absolute revenue is modest, but the margin is still very high; the return comes from scale, capacity factor and a very low cost of capital.',
    s4b:'The capital is GW-scale panels, inverters, substation and grid connection — very cheap per MWp at this size. It is financed almost entirely with low-cost project debt against the state-backed 30-year PPA, with a thin, low-cost equity slice. That low cost of capital is precisely what lets a record-low tariff clear a return — the financing, as much as the sun, is the asset.',
    stackH:'The capital · GW-scale panels + grid', splitL:'Financing', splitR:'low-cost',
    split:[['s1',75,'Low-cost project debt'],['s2',25,'Sponsor equity']],
    finList:[['','Capacity factor','~26% (huge irradiance)'],['sub','Tariff','record-low (<2¢/kWh)'],['','Offtake','single 30yr PPA (state-backed)'],['sub','Cost of capital','very low (decisive)'],['','Scale','GW-scale, cheap capex'],['rest','Opex','very low (no fuel)']],
    finNote:'Al Dhafra / Sweihan are <b>record-low-tariff, bond-like generation annuities</b>: huge irradiance, GW-scale cheap capex, a 30-year state-backed PPA, and a very low cost of capital. The return is solid and stable; the cost of capital is the decisive lever.',
    timeline:[['2017','<b>Sweihan / Noor Abu Dhabi</b> (1.2 GW) sets a record-low tariff.'],['2019','<b>Al Dhafra</b> (2 GW) auction breaks the record again.'],['2020s','<b>GW-scale single-site</b> solar becomes the Gulf norm.'],['2020s','<b>30-year PPAs</b> to state offtakers underpin the financing.'],['2020s','<b>Low cost of capital</b> drives ever-lower tariffs.'],['Ongoing','<b>Build-out</b> across the UAE and the Gulf.']],
    calcNote:'A working model of a <b>record-low-tariff Gulf solar plant</b>. Revenue is capacity × hours × capacity factor × a low PPA tariff, with a floor for the contract. The capacity factor is high and opex tiny; the cost of debt is very low, which is what lets a record-low tariff clear a return.',
    s6:'Gulf solar is record-low tariffs made to work by cheap capital. What drives it:',
    breakers:['<b>Cost of capital</b> — a very low discount rate is what lets a record-low tariff clear a return.','<b>Capacity factor</b> — huge desert irradiance lifts the energy per MWp.','<b>Scale</b> — GW-scale single sites cut capex per MWp.','<b>The 30-year PPA</b> — a single state-backed contract makes the cash flow bond-like.'],
    src:'Figures are illustrative for Abu Dhabi GW-scale solar (Al Dhafra / Sweihan-type), drawn from public auction and tariff disclosure. The figures are approximate and illustrative.',
    econ:{cur:'AED', omPerMW:9, fixedOM:1.2,
      mwDef:1200,mwMin:300,mwMax:2400,mwStep:50, priceDef:28,priceMin:18,priceMax:90,priceStep:1,
      cfDef:26,cfMin:20,cfMax:31,cfStep:1, capexPerMW:0.82},
    calc:{build:984,grant:0,capex:1.2,revG:1,floor:40,cap:300,tax:0,exit:9,lev:6,rd:4,amort:3,hold:28},
    map:{footer:GEO.aldhafra.footer}
  },

  /* ---------- 6 · CHINESE DESERT MEGA-BASE (China · vast scale, feed-in) ---------- */
  chinapv:{
    name:'Chinese desert mega-base', geo:'Gobi / NW China', continent:'China', cur:'¥', geoKey:'chinapv',
    lede:'Solar at <b>continental scale</b> — China\'s desert "mega-bases" combine vast PV (and wind) across the Gobi and the northwest, feeding power to the load centres under grid-priority dispatch.',
    s1:'<p class="body">China builds solar at a scale no other country approaches. Its flagship is the <b>desert mega-base</b> programme: gigawatt-upon-gigawatt of PV (often paired with wind and storage) across the Gobi and the arid northwest, where land is plentiful and irradiance is high. A single base can be tens of GW. The panels are the same; the difference is sheer <b>scale</b>.</p>'+
       '<p class="body">The output is sold under a mix of <b>feed-in / benchmark tariffs</b>, provincial PPAs and increasingly the market, with <b>grid-priority dispatch</b> for renewables and vast new <b>ultra-high-voltage transmission</b> lines carrying the power thousands of kilometres to the eastern load centres. Tariffs are modest, but applied to a colossal installed base — and financed at a low, often state-linked cost of capital — the absolute cash flow is enormous. Curtailment in the remote west is the historic risk, eased by the new transmission.</p>',
    facts:[['~20%','Capacity factor','desert, fixed-tilt'],['Feed-in + market','Offtake','grid-priority dispatch'],['Vast','Scale','tens of GW per base'],['UHV lines','Export','to eastern load'],['Low','Cost of capital','state-linked'],['¥/MWh','Revenue','price × generation']],
    s2:'Watch the array. Endless rows of <b>fixed-tilt PV panels</b> fill the desert; the <b>sun</b> brightens with the <b>capacity factor</b>, and long export lines carry power out (cyan pulses scale with output) to the distant load centres. At this scale even a modest tariff is a vast absolute cash flow. The <b style="color:#0c6b4f">margin</b> is almost the whole revenue — opex is tiny. Drag the capacity (push it high), the tariff and the capacity factor.',
    driverLab:'Feed-in tariff', availLab:'Capacity factor', hrK:'Generation revenue', yrS:'generation × tariff',
    ledge:{a:'+ power',b:'+ green cert',c:'− O&M'}, demandLabel:'OUTPUT',
    preset:'Reset to base case',
    try:'<b>Try this:</b> push the <b>capacity</b> to the top of its range — at desert-mega-base scale, even a modest feed-in tariff is an enormous absolute cash flow, and with tiny opex nearly all of it is EBITDA. Scale and a low, state-linked cost of capital — not price — are the model. The historic risk is curtailment in the remote west, eased by the new UHV transmission.',
    s3:'A Chinese desert mega-base sells power under <b>feed-in / benchmark tariffs</b> and increasingly the market, with <b>grid-priority dispatch</b> and vast UHV transmission to the load centres. Tariffs are modest, but the lever is <b>scale</b>: a colossal installed base means a modest tariff is a vast cash flow, financed at a low, state-linked cost of capital. Opex is tiny, so the margin is very high. The historic risk is curtailment in the remote west, eased by new transmission.',
    mb:{tag:'Model A · the low-cost generator', title:'Desert PV mega-base (scale)', body:'Gigawatt-upon-gigawatt of desert PV under feed-in / market tariffs with grid-priority dispatch and UHV transmission to the load centres — modest tariffs, but a colossal base financed cheaply, a vast and stable cash flow. Curtailment is the historic risk. <b>This is a Chinese desert mega-base</b>.'},
    s4a:'There is no fuel and almost no operating cost — <b>O&amp;M</b> across a vast fixed-tilt array is a few percent of revenue. The waterfall is short and the <b>margin wide</b>; at this scale, even a modest tariff over a colossal base is a large, stable absolute cash flow.',
    wfNote:'Operating cost is just O&amp;M across a vast array — a few percent of revenue. The margin is very high; at mega-base scale the absolute cash flow is enormous even at a modest tariff. Curtailment in the remote west is the historic risk.',
    s4b:'The capital is gigawatt-scale fixed-tilt panels, inverters, substations and — critically — the long <b>UHV transmission</b> to the eastern load centres. Capex per MWp is very low at this scale, and the financing is at a low, often state-linked cost of capital. Growth is simply more bases; the binding constraint is transmission and curtailment, not the panels.',
    stackH:'The capital · GW-scale PV + UHV lines', splitL:'Financing', splitR:'state-linked',
    split:[['s1',65,'State-linked / project debt'],['s2',35,'Equity']],
    finList:[['','Capacity factor','~20% (desert, fixed-tilt)'],['sub','Offtake','feed-in + market (grid-priority)'],['','Scale','tens of GW per base'],['sub','Export','UHV to eastern load'],['','Cost of capital','low (state-linked)'],['rest','Risk','curtailment in the west']],
    finNote:'A Chinese desert mega-base is a <b>modest-tariff, vast-scale generation asset</b>: a modest tariff over a colossal base, financed cheaply, for a large stable cash flow. The agenda is scale and transmission; curtailment is the historic risk. Figures are highly illustrative.',
    timeline:[['2021','<b>Desert mega-base</b> programme launched at scale.'],['2020s','<b>Grid-priority dispatch</b> for renewables.'],['2020s','<b>UHV transmission</b> carries power to eastern load.'],['2020s','<b>Storage</b> added to firm and reduce curtailment.'],['2025','<b>Market reforms</b> move output toward spot pricing.'],['2060','<b>Carbon-neutrality</b> target drives ongoing build.']],
    calcNote:'A working model of a <b>desert PV mega-base</b>, on an enterprise-value basis. Revenue is capacity × hours × capacity factor × a modest feed-in tariff. Opex is tiny; at this scale the absolute cash flow is vast and the cost of capital is low. Figures are highly illustrative.',
    s6:'China\'s mega-bases are modest-tariff solar at vast scale. What drives it:',
    breakers:['<b>Scale</b> — a modest tariff over a colossal installed base is the model.','<b>Cost of capital</b> — low, state-linked funding supports the build.','<b>Transmission</b> — UHV lines to the load centres are the binding constraint.','<b>Curtailment</b> — oversupply in the remote west is the historic risk, eased by new lines.'],
    src:'Figures are illustrative for a Chinese desert PV mega-base, drawn from public Chinese renewable and grid data. Given the scale and limited standalone disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', omPerMW:18, fixedOM:60,
      mwDef:3000,mwMin:1000,mwMax:8000,mwStep:100, priceDef:200,priceMin:120,priceMax:380,priceStep:5,
      cfDef:20,cfMin:14,cfMax:26,cfStep:1, capexPerMW:4.0},
    calc:{build:12000,grant:0,capex:1.2,revG:1,floor:300,cap:5000,tax:25,exit:8,lev:5,rd:4,amort:3,hold:25},
    map:{footer:GEO.chinapv.footer}
  }
  };
  var ORDER=['iberia','ussolar','atacama','ausolar','aldhafra','chinapv'];

  /* ===================================================================
     SOLAR FARM RENDERER  (canvas, 720x520) — top-down, daytime
     Neat rows of tilted PV panel tables fill the scene; a sun glyph in the
     corner whose glow ties to the capacity factor casts light rays; a
     combiner/substation exports power out along an export line (cyan pulses
     scaling with output). More MWp = more rows; higher cf = brighter sun.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  var SUN={x:646,y:74};            // sun glyph (corner)
  var SUB={x:96,y:430};            // combiner / substation
  var ARRAY={x0:150,y0:96,x1:632,y1:404};  // panel field bounds
  var ROWS=[], NPANEL=0;
  function layout(){
    // build a grid of panel tables; tables filled in by capacity later
    ROWS=[]; var rowH=34, gap=10, tableW=58, tgap=10;
    var ax0=ARRAY.x0, ay0=ARRAY.y0, ax1=ARRAY.x1, ay1=ARRAY.y1;
    var nrows=Math.floor((ay1-ay0)/rowH);
    var idx=0;
    for(var r=0;r<nrows;r++){
      var y=ay0+r*rowH;
      var cols=[];
      for(var x=ax0;x+tableW<=ax1;x+=tableW+tgap){ cols.push({x:x,y:y,w:tableW,h:rowH-gap,i:idx}); idx++; }
      ROWS.push({y:y,cols:cols});
    }
    // flatten and assign a fill rank (left-to-right, top-to-bottom) so MWp fills the scene
    var flat=[]; ROWS.forEach(function(row){ row.cols.forEach(function(t){ flat.push(t); }); });
    flat.forEach(function(t,i){ t.rank=i; });
    NPANEL=flat.length;
  }

  /* ---- base map: ground (field or desert) ---- */
  function drawMap(){
    var G=GEO[A.geoKey], desert=(G.terrain==='desert');
    var g=ctx.createLinearGradient(0,0,0,H);
    if(desert){ g.addColorStop(0,'#e9dcc2'); g.addColorStop(1,'#dcc9a6'); }
    else { g.addColorStop(0,'#dde7cf'); g.addColorStop(1,'#cdd9bc'); }
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // subtle ground texture bands
    ctx.fillStyle = desert?'rgba(190,170,130,0.10)':'rgba(150,180,120,0.10)';
    for(var y=120;y<H;y+=64){ rr(20,y,W-40,28,8); ctx.fill(); }
    // perimeter fence
    ctx.strokeStyle='rgba(120,130,110,0.35)'; ctx.lineWidth=1.4; ctx.setLineDash([4,5]);
    rr(ARRAY.x0-14,ARRAY.y0-14,(ARRAY.x1-ARRAY.x0)+28,(ARRAY.y1-ARRAY.y0)+28,12); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- sun glyph (glow ties to capacity factor) + light rays ---- */
  function sun(cf){
    var x=SUN.x,y=SUN.y, b=0.4+0.6*cf;  // brightness
    // outer halo
    glow(x,y,60+40*cf,'rgba(255,224,140,'+(0.30+0.4*cf)+')');
    glow(x,y,30+18*cf,'rgba(255,238,180,'+(0.5+0.4*cf)+')');
    // rays
    ctx.save(); ctx.translate(x,y); ctx.strokeStyle='rgba(255,210,90,'+(0.30+0.45*cf)+')'; ctx.lineWidth=2; ctx.lineCap='round';
    for(var i=0;i<12;i++){ var a=(i/12)*Math.PI*2 + T*0.004; var r0=22+4*cf, r1=r0+10+14*cf+4*Math.sin(T*0.05+i);
      ctx.beginPath(); ctx.moveTo(Math.cos(a)*r0,Math.sin(a)*r0); ctx.lineTo(Math.cos(a)*r1,Math.sin(a)*r1); ctx.stroke(); }
    ctx.restore();
    // disc
    var sg=ctx.createRadialGradient(x-4,y-4,2,x,y,20); sg.addColorStop(0,'#fff7d6'); sg.addColorStop(0.5,'#ffe27a'); sg.addColorStop(1,'#ffca52');
    ctx.fillStyle=sg; ctx.globalAlpha=b; ctx.beginPath(); ctx.arc(x,y,18+2*cf,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle='rgba(120,95,30,0.7)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(Math.round(cf*100)+'% CF',x,y+34);
  }

  /* ---- a single PV panel table (dark blue, subtle tilt + shading) ---- */
  function panelTable(t,on,cf,tracking){
    if(!on){ // empty plot / cleared ground marker
      ctx.fillStyle='rgba(120,120,100,0.08)'; rr(t.x,t.y,t.w,t.h,2); ctx.fill(); return;
    }
    var x=t.x,y=t.y,w=t.w,h=t.h;
    // shadow (offset, longer when sun lower / cf — keep subtle)
    ctx.fillStyle='rgba(30,40,55,0.16)'; rr(x-2,y+h-2,w,4,1.5); ctx.fill();
    // panel face: tilted dark-blue gradient (top lighter = sky reflection)
    var g=ctx.createLinearGradient(x,y,x,y+h);
    g.addColorStop(0,'#3a5f9e'); g.addColorStop(0.5,'#1f3f72'); g.addColorStop(1,'#16305a');
    ctx.fillStyle=g; rr(x,y,w,h,2); ctx.fill();
    // cell grid lines
    ctx.strokeStyle='rgba(150,180,225,0.35)'; ctx.lineWidth=0.5;
    for(var cx=x+w/4;cx<x+w;cx+=w/4){ ctx.beginPath(); ctx.moveTo(cx,y+1); ctx.lineTo(cx,y+h-1); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x+1,y+h/2); ctx.lineTo(x+w-1,y+h/2); ctx.stroke();
    // sun-glint sheen across the face, brighter with cf
    var sheen=ctx.createLinearGradient(x,y,x+w,y);
    var sa=0.10+0.35*cf, ph=(t.i*0.3 + T*0.02)%1;
    sheen.addColorStop(Math.max(0,ph-0.1),'rgba(255,255,255,0)');
    sheen.addColorStop(Math.min(1,ph),'rgba(220,235,255,'+sa+')');
    sheen.addColorStop(Math.min(1,ph+0.1),'rgba(255,255,255,0)');
    ctx.fillStyle=sheen; rr(x,y,w,h,2); ctx.fill();
    // tracking post hint
    if(tracking){ ctx.fillStyle='rgba(70,80,90,0.5)'; ctx.fillRect(x+w/2-0.6,y+h,1.2,2); }
  }

  /* ---- combiner / substation + export line ---- */
  function substation(){
    var x=SUB.x,y=SUB.y;
    ctx.fillStyle='rgba(40,50,40,0.16)'; ctx.beginPath(); ctx.ellipse(x,y+18,28,5,0,0,Math.PI*2); ctx.fill();
    // pad
    ctx.fillStyle='#c8cdc2'; rr(x-30,y-18,60,36,4); ctx.fill(); ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // transformer blocks
    ctx.fillStyle='#9aa39a'; rr(x-24,y-12,18,24,2); ctx.fill(); rr(x-2,y-12,16,24,2); ctx.fill();
    // pylon hint
    ctx.strokeStyle='rgba(90,100,95,0.7)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(x+18,y-12); ctx.lineTo(x+24,y-26); ctx.lineTo(x+30,y-12); ctx.moveTo(x+21,y-19); ctx.lineTo(x+27,y-19); ctx.stroke();
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('SUBSTATION',x,y+30);
  }

  /* ---- export pulses out along the line (cyan, scale with output) ---- */
  function exportLine(pts,speed,out){
    var seg=[],tot=0,i; for(i=1;i<pts.length;i++){ var L=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); seg.push(L); tot+=L; }
    if(tot<1) return; var n=Math.max(2,Math.round(2+out*6));
    // static line
    ctx.strokeStyle='rgba(70,150,170,0.5)'; ctx.lineWidth=2.4; ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]); for(i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]); ctx.stroke(); ctx.setLineDash([]);
    for(var k=0;k<n;k++){ var f=((T*speed*0.01+k/n)%1); var d=f*tot, acc=0, p=pts[0];
      for(i=1;i<pts.length;i++){ if(d<=acc+seg[i-1]){ var t=(d-acc)/seg[i-1]; p=[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; break; } acc+=seg[i-1]; }
      glow(p[0],p[1],4,'rgba(90,210,235,0.6)'); ctx.fillStyle='rgba(120,230,250,0.95)'; ctx.beginPath(); ctx.arc(p[0],p[1],1.8,0,Math.PI*2); ctx.fill(); }
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
    // daytime output wobble around the capacity factor for the sparkline + sun
    var cfVis=Math.max(0.02,Math.min(1, cf*(0.92+0.14*Math.sin(T*0.02))));
    // how full the array is (more MWp = more rows of panels)
    var norm=(mw-E.mwMin)/Math.max(1,(E.mwMax-E.mwMin));
    var fillFrac=Math.max(0.20,Math.min(1,0.24+0.78*norm));
    var liveCount=Math.round(NPANEL*fillFrac);

    ctx.clearRect(0,0,W,H);
    drawMap(); sun(cfVis);

    // panels
    ROWS.forEach(function(row){ row.cols.forEach(function(t){
      panelTable(t, t.rank<liveCount, cfVis, !!G.tracking);
    }); });

    substation();

    // export line: substation → off the left edge (out to grid)
    var out=0.25+0.7*cfVis;
    exportLine([[ARRAY.x0,ARRAY.y1-20],[SUB.x+30,SUB.y-6],[SUB.x,SUB.y-6],[SUB.x-70,SUB.y-6]],0.9+out,out);

    // + EXPANSION marker if growing
    if(G.growing && liveCount<NPANEL){
      var flat=[]; ROWS.forEach(function(r){ r.cols.forEach(function(t){ flat.push(t); }); });
      flat.sort(function(a,b){ return a.rank-b.rank; });
      var nxt=flat[Math.min(NPANEL-1,liveCount)];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ EXPANSION',nxt.x+nxt.w/2,nxt.y-6); ctx.restore();
        glow(nxt.x+nxt.w/2,nxt.y+nxt.h/2,9,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    }

    // ---- economics (solar generation, contracted floor) ----
    var mwh=mw*8760*cf;                          // MWh/yr
    var grossRev=mwh*price;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));   // floor = PPA/CfD contracted revenue
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var opex= mw*(E.omPerMW||0)*1000 + (E.fixedOM||0)*1e6;  // solar O&M is LOW
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // share of "+cash" that is the contracted floor (PPA) vs merchant + a green-cert sliver
    var fixShare=Math.max(0.08,Math.min(0.6, revenue>grossRev?(revenue-grossRev)/revenue+0.12:0.14));
    var c_om=opex*0.55, c_inv=opex*0.25, c_land=opex*0.20;

    if(_anim){
      var flat2=[]; ROWS.forEach(function(r){ r.cols.forEach(function(t){ if(t.rank<liveCount) flat2.push(t); }); });
      if(flat2.length && Math.random()<0.62){ var s1=flat2[(Math.random()*flat2.length)|0]; spawnCoin(s1.x+s1.w/2,s1.y-2, Math.random()<fixShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.65, opex/Math.max(1,revenue)));
      if(flat2.length && Math.random()<outRate){ var s2=flat2[(Math.random()*flat2.length)|0]; spawnCoin(s2.x+s2.w/2,s2.y+s2.h,'cost',1); }
      demHist.push(cfVis); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(cfVis);

    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+mw+' MWp',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    set('ixCapV',mw+' MWp'); set('ixSpreadV',CUR+Math.round(price)+'/MWh'); set('ixAvailV',Math.round(cf*100)+'%');
    set('ixDir',mw+' MWp'); set('ixDirS',(G.contracted?'contracted':'merchant')+' · '+(G.terrain==='desert'?'desert':'field'));
    set('ixMW',gwh(mwh)); set('ixMWs',Math.round(cf*100)+'% capacity factor');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['O&amp;M',c_om],['Inverters &amp; trackers',c_inv],['Land &amp; grid',c_land]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the margin is too thin to value — raise the power price or the capacity factor, or lower the build cost.</span>'; return; }
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is generation (capacity × hours × capacity factor) × power price (with a floor for any PPA / contracted offtake) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'iberia');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
