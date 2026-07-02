/* Mobile towers (towercos), data-driven worked examples.
   Six real tower companies, one template. Scene config from tw-geo.js (GEO),
   drawn as a daytime landscape dotted with mobile towers (masts) in a 720x520
   scene. The interactive figures are illustrative: a towerco is a colocation /
   tenancy annuity, it owns the towers and leases space to mobile-operator
   tenants. Per-tower opex (ground lease, power, maintenance) is largely fixed,
   so each ADDED tenant drops to EBITDA at close to 100% incremental margin. The
   engine is the tenancy ratio (tenants per tower) × rent per tenancy × towers,
   and the returns model is a simplified DCF on a long, indexed, near-zero-churn
   lease book that trades at a very high EBITDA multiple. */
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
  function pctS(v){ return (v>=0?'+':'')+(Math.round(v*10)/10)+'%'; }
  function kfmt(n){ return n>=1e6?(n/1e6).toFixed(n>=1e7?0:1)+'m':(n>=1e3?Math.round(n/1e3)+'k':''+Math.round(n)); }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · CELLNEX (Europe · largest independent towerco) ---------- */
  cellnex:{
    name:'Cellnex', geo:'Western Europe', continent:'Europe', cur:'€', geoKey:'cellnex',
    lede:'Europe\'s largest independent <b>tower company</b>, it owns tens of thousands of masts and leases space on each to mobile operators, turning every added tenant into almost pure margin and every lease into a long, inflation-linked annuity.',
    s1:'<p class="body">A mobile network needs sites, masts, rooftops and the antennas that hang on them. Historically each operator built and owned its own. The modern model splits that apart: an independent <b>tower company (towerco)</b> owns the passive infrastructure (the mast, the platform, the power and the ground lease) and <b>leases space on it to the operators</b> as tenants. <b>Cellnex</b> is the largest independent towerco in Europe, built by buying tower portfolios from carriers across Spain, Italy, France, the UK and beyond.</p>'+
       '<p class="body">The magic is the <b>tenancy ratio</b>, the number of tenants per tower. The cost of running a tower (ground lease, power, maintenance) is largely <b>fixed per tower</b>, so the first tenant covers the site and every <b>additional tenant drops to EBITDA at close to 100% incremental margin</b>. Leases are long (often 10–20 years with renewals), indexed to inflation, and churn is near zero because moving a network off a mast is painful. Cellnex layers <b>build-to-suit</b> programmes on top, building new towers against anchor commitments, so the base keeps growing.</p>',
    facts:[['~110k','Towers','across Europe'],['Independent','Towerco','carve-out buyer'],['Tenancy','The lever','tenants per tower'],['CPI-linked','Leases','long, indexed'],['~Zero','Churn','sticky sites'],['Listed','Owner','Madrid-listed']],
    s2:'Watch the landscape fill with masts. Each tower carries one or more sets of <b>operator antenna panels</b>; these are the tenants, and the more of them share a mast, the more of the rent drops straight to the bottom line. The owner\'s <b style="color:#0c6b4f">money</b> is the rent on every tenancy, and the prize is the <b>tenancy ratio</b>: adding a second or third tenant to a tower that is already built and staffed is almost pure profit. Drag the towers, the rent per tenancy and the tenancy ratio.',
    driverLab:'Rent / tenancy', availLab:'Tenancy ratio', hrK:'Lease revenue', yrS:'tenancies × rent',
    ledge:{a:'+ anchor rent',b:'+ colocation',c:'− site opex'}, demandLabel:'TENANCY',
    preset:'Load Cellnex',
    try:'<b>Try this:</b> raise the <b>tenancy ratio</b> from one to two tenants per tower and watch EBITDA jump far faster than revenue, because the second tenant arrives at near-100% margin on a tower whose costs are already covered. The investment case rests on that colocation flywheel. Then remember the leases are long and CPI-indexed with almost no churn, which is why towercos trade at very high multiples.',
    s3:'Cellnex earns <b>rent on every tenancy</b>, a fee per operator per tower, set in long master lease agreements that are <b>indexed to inflation</b> and renew almost automatically. Revenue is simply <b>towers × tenancy ratio × rent</b>. Because the cost of a tower is fixed, everything turns on the tenancy ratio: <b>lease-up</b> (adding tenants to existing towers) is the high-margin growth, and <b>build-to-suit</b> (new towers against anchor commitments) extends the base. Long, indexed, near-zero churn: a prized annuity.',
    mb:{tag:'Model B · independent towerco', title:'Independent tower company (colocation annuity)', body:'An independent owner of passive tower infrastructure that leases space to multiple mobile operators, earning long, CPI-indexed rents with near-zero churn. The value engine is the tenancy ratio (added tenants arrive at almost 100% incremental margin), plus build-to-suit growth. <b>This is Cellnex</b>, Europe\'s largest independent towerco.'},
    s4a:'A towerco is light on operating cost relative to its rent: per tower there is the ground lease, the power and a little maintenance, and that cost is broadly <b>fixed regardless of how many tenants share the mast</b>. So margins are very high and rise with the tenancy ratio: the first tenant covers the site, the second and third are almost pure EBITDA. What matters is how many tenancies sit on each tower rather than the cost line.',
    wfNote:'Operating cost per tower is the ground lease, power and maintenance, largely fixed whether one tenant or three share the mast. That is why the EBITDA margin is so high and climbs with the tenancy ratio: every added tenant is incremental rent on a cost base that barely moves.',
    s4b:'The capital is the towers themselves, bought from carriers in big portfolio deals or built to suit. A towerco typically pays a high multiple of tower cash flow because the income is so long and certain; modelled on an enterprise-value basis, the return is the spread between that entry and a long, indexed, lease-up-driven annuity. The net build below nets any anchor build-to-suit contribution against the cost.',
    stackH:'The capital · towers acquired & built', splitL:'How the base is built', splitR:'allocation',
    split:[['s1',72,'Acquired carrier portfolios'],['s2',28,'Build-to-suit (new towers)']],
    finList:[['','Towers','~110k, growing'],['sub','Model','independent towerco'],['','Revenue','rent per tenancy, CPI-indexed'],['sub','Key lever','tenancy ratio (lease-up)'],['','Churn','near zero (sticky sites)'],['rest','Owner','Madrid-listed']],
    finNote:'An independent towerco is a <b>colocation annuity</b>: long, indexed rents on a base of towers, where every added tenant is near-100% incremental margin. The risks are the price paid per tower at acquisition, carrier consolidation, and the cost of debt against a high entry multiple.',
    timeline:[['2015','<b>Cellnex IPO</b> in Madrid, spun out of Abertis.'],['2016–19','<b>Portfolio acquisitions</b> across Italy, France, Spain, the UK.'],['2020','<b>CK Hutchison towers</b>, a transformational European deal.'],['2021','<b>Build-to-suit programmes</b> scale against anchor commitments.'],['2020s','<b>Tenancy ratio</b> lease-up becomes the value driver.'],['Ongoing','<b>CPI escalators</b> lift rents through high inflation.']],
    calcNote:'A working model of an <b>independent towerco</b>, on an enterprise-value basis. Revenue is towers × tenancy ratio × rent; per-tower opex is fixed, so lifting the tenancy ratio lifts margin sharply. The exit multiple is high because the income is long, indexed and almost churn-free; towercos trade rich.',
    s6:'Cellnex is the colocation flywheel at European scale. What moves the return:',
    breakers:['<b>Tenancy ratio</b>: adding tenants to existing towers is near-100%-margin growth and the core lever.','<b>Build-to-suit</b>: new towers against anchor commitments extend the base.','<b>CPI escalators</b>: inflation-linked rents lift revenue with almost no extra cost.','<b>Entry multiple &amp; cost of debt</b>: towers trade rich, so the price paid and rates are the risk.'],
    src:'Figures from public sources on the European tower market: <a href="https://www.cellnex.com/" target="_blank" rel="noopener">Cellnex Telecom</a> investor disclosure and tower-sector reporting. Tower counts, tenancy and rent figures are approximate and illustrative.',
    econ:{cur:'€', host:'European carriers', volt:'colocation',
      twDef:110,twMin:40,twMax:140,twStep:2, rentDef:22000,rentMin:12000,rentMax:34000,rentStep:500,
      tenDef:1.8,tenMin:1.0,tenMax:2.6,tenStep:0.05, opexPerTower:11500, fixedOM:60},
    calc:{build:68970,grant:1500,capex:6,revG:5,floor:1500,cap:8300,tax:25,exit:21,lev:6,rd:4.5,amort:2,hold:20},
    map:{footer:GEO.cellnex.footer}
  },

  /* ---------- 2 · AMERICAN TOWER (North America · benchmark independent REIT) ---------- */
  amt:{
    name:'American Tower', geo:'United States', continent:'North America', cur:'US$', geoKey:'amt',
    lede:'The benchmark independent <b>tower company</b>, a US REIT that owns tens of thousands of towers at high tenancy and earns long, escalating master-lease rents from every carrier sharing each mast.',
    s1:'<p class="body"><b>American Tower</b> is the company that defined the independent towerco model and the one every other towerco is measured against. A US <b>REIT</b>, it owns a vast portfolio of communications sites and leases space to the major carriers, historically AT&amp;T, Verizon and T-Mobile, under long <b>master lease agreements</b> with fixed annual escalators (commonly around 3%).</p>'+
       '<p class="body">The US market is the textbook case for the <b>tenancy ratio</b>: mature towers often carry two to three tenants, and because per-tower cost is fixed, the incremental margin on each added tenant and each amendment (more antennas, more equipment) is extraordinary. Master leases run for years with multiple renewal terms, churn is minimal, and the built-in escalators give organic growth without lifting a finger. That combination (long, escalating, high-margin, sticky) is why American Tower trades at a premium multiple.</p>',
    facts:[['~43k','US towers','plus global'],['REIT','Structure','tax-efficient'],['~2x+','Tenancy','high in the US'],['~3%','Escalators','fixed annual'],['Master','Leases','multi-year, renewing'],['NYSE','Owner','listed (AMT)']],
    s2:'Picture the US grid of masts, each one carrying the panels of two or three carriers. The owner\'s <b style="color:#0c6b4f">return</b> is the master-lease rent on every tenancy, escalating a few percent a year automatically. The upside sits in the <b>tenancy ratio</b>: at two-plus tenants per tower the economics are exceptional, because the tower\'s cost was covered by the first. Drag the towers, the rent per tenancy and the tenancy ratio to see the colocation flywheel.',
    driverLab:'Rent / tenancy', availLab:'Tenancy ratio', hrK:'Lease revenue', yrS:'tenancies × rent',
    ledge:{a:'+ anchor rent',b:'+ colocation',c:'− site opex'}, demandLabel:'TENANCY',
    preset:'Load American Tower',
    try:'<b>Try this:</b> push the <b>tenancy ratio</b> toward the high US level and watch the margin widen: at two-plus tenants per tower, most of the incremental rent is pure EBITDA because the site cost is fixed. Then note the fixed escalators: revenue grows a few percent a year with no extra cost. That mix of high tenancy and built-in growth is why American Tower is the benchmark and trades at a premium.',
    s3:'American Tower earns <b>master-lease rent</b> from every carrier on every tower, multi-year contracts with fixed annual <b>escalators</b> and near-automatic renewals. Revenue is towers × tenancy ratio × rent, and the engine is the <b>tenancy ratio</b>: because per-tower cost is fixed, the second and third tenants (and amendments for extra equipment) are almost pure margin. As a REIT it passes income through tax-efficiently, which supports the premium multiple on a long, escalating, sticky cash flow.',
    mb:{tag:'Model B · tower REIT', title:'Benchmark tower REIT (high tenancy)', body:'A US REIT owning tens of thousands of towers at high tenancy, earning long master-lease rents with fixed annual escalators and minimal churn. The tenancy ratio drives near-100%-margin incremental rent, and the REIT structure is tax-efficient. <b>This is American Tower</b>, the benchmark independent towerco.'},
    s4a:'Per tower the cost is the ground lease, power and maintenance, fixed whether one carrier or three share the mast, so American Tower runs at a very high EBITDA margin that climbs with the tenancy ratio. At US tenancy levels the incremental tenant and each lease amendment are close to pure profit. The tenancy ratio and the fixed escalator matter far more than the cost line.',
    wfNote:'Operating cost per tower is the ground lease, power and a little maintenance, fixed regardless of how many carriers share the mast. With US towers often at two-plus tenants, the margin is exceptional and the fixed escalators add growth at no extra cost.',
    s4b:'The capital is the tower portfolio, built and acquired over decades, held in a REIT. American Tower trades at a high multiple of tower cash flow because the income is so long, escalating and sticky; on an enterprise-value basis the return is the spread between that entry and a high-tenancy, escalating annuity, with build and selective acquisition extending the base.',
    stackH:'The capital · tower portfolio', splitL:'How the base is built', splitR:'allocation',
    split:[['s1',80,'Built & acquired towers'],['s2',20,'New build / amendments']],
    finList:[['','US towers','~43k (plus global)'],['sub','Structure','REIT (tax-efficient)'],['','Revenue','master-lease rent + escalators'],['sub','Key lever','high tenancy ratio'],['','Escalators','~3% fixed annual'],['rest','Owner','NYSE: AMT']],
    finNote:'A tower REIT is the <b>premium colocation annuity</b>: high tenancy, fixed escalators, minimal churn, tax-efficient pass-through. The risks are carrier consolidation, the price paid per tower and the cost of capital against a high entry multiple, but the income is about as certain as infrastructure gets.',
    timeline:[['1995','<b>American Tower</b> founded; spun from American Radio.'],['2000s','<b>Master lease agreements</b> with the big US carriers scale.'],['2012','<b>Converts to a REIT</b>, tax-efficient income pass-through.'],['2010s','<b>Tenancy ratio</b> rises as carriers colocate.'],['2020s','<b>5G amendments</b> add equipment and rent per site.'],['Ongoing','<b>Fixed escalators</b> compound organic growth.']],
    calcNote:'A working model of the <b>benchmark tower REIT</b>, on an enterprise-value basis. Revenue is towers × tenancy ratio × rent; per-tower opex is fixed, so high US tenancy yields very high margins. Fixed escalators add organic growth and the exit multiple is high; towers trade rich on long, escalating, sticky income.',
    s6:'American Tower is the colocation flywheel at its purest. What drives it:',
    breakers:['<b>Tenancy ratio</b>: high US tenancy means most incremental rent is pure margin.','<b>Fixed escalators</b>: ~3% annual increases compound organic growth at no extra cost.','<b>5G amendments</b>: added equipment per site lifts rent without new towers.','<b>Carrier consolidation &amp; rates</b>: fewer tenants or higher rates are the principal risks.'],
    src:'Figures from public sources: <a href="https://www.americantower.com/" target="_blank" rel="noopener">American Tower</a> (NYSE: AMT) investor disclosure and US tower-sector reporting. Tower counts, tenancy and rent figures are approximate and illustrative.',
    econ:{cur:'US$', host:'US carriers', volt:'colocation',
      twDef:43,twMin:20,twMax:60,twStep:1, rentDef:26000,rentMin:16000,rentMax:40000,rentStep:500,
      tenDef:2.1,tenMin:1.2,tenMax:2.8,tenStep:0.05, opexPerTower:13500, fixedOM:120},
    calc:{build:41500,grant:1000,capex:5,revG:5,floor:800,cap:4500,tax:0,exit:22,lev:6,rd:4.75,amort:2,hold:20},
    map:{footer:GEO.amt.footer}
  },

  /* ---------- 3 · HIGHLINE DO BRASIL (South America · EM independent) ---------- */
  highline:{
    name:'Highline do Brasil', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'highline',
    lede:'A Brazilian independent <b>towerco</b>, DigitalBridge-backed, that builds and colocates towers across a fast-growing mobile market, where the lease-up upside is large and the cash flow is priced against emerging-market rates.',
    s1:'<p class="body"><b>Highline do Brasil</b> is an independent tower company in one of the world\'s most dynamic mobile markets. Backed by <b>DigitalBridge</b>, it owns and builds towers and leases space to Brazil\'s mobile operators (Vivo, Claro, TIM) under long, indexed contracts. It grew through <b>build-to-suit</b> programmes and the acquisition of carrier sites as Brazilian operators carved out their passive infrastructure.</p>'+
       '<p class="body">The model is the same colocation annuity, with an emerging-market twist. Brazil is still <b>building out mobile coverage and 4G/5G density</b>, so there is a long runway of new towers and a large <b>lease-up</b> opportunity: many towers start with a single anchor tenant and add colocation over time, each added tenant arriving at near-100% margin. Leases are long and inflation-indexed (to Brazilian indices). The catch is the <b>discount rate</b>: a strong nominal return in reais nets down once carried at emerging-market rates.</p>',
    facts:[['Independent','Towerco','DigitalBridge-backed'],['Build-to-suit','Growth','new towers'],['Lease-up','Upside','colocation runway'],['Indexed','Leases','to Brazilian CPI'],['3 carriers','Tenants','Vivo · Claro · TIM'],['Private','Owner','infra-backed']],
    s2:'Towers are rising across a fast-growing market, many starting with one anchor tenant, then adding a second and third as networks densify. The <b style="color:#0c6b4f">return</b> rises with the tenancy ratio; each added tenant is near-pure margin. Drag the towers, the rent per tenancy and the tenancy ratio. The lease-up runway is large, but the whole return is in reais, discounted like an emerging-market asset.',
    driverLab:'Rent / tenancy', availLab:'Tenancy ratio', hrK:'Lease revenue', yrS:'tenancies × rent',
    ledge:{a:'+ anchor rent',b:'+ colocation',c:'− site opex'}, demandLabel:'TENANCY',
    preset:'Load Highline',
    try:'<b>Try this:</b> raise the <b>tenancy ratio</b>: in an emerging market many towers start single-tenant, so the lease-up upside (adding a second or third carrier at near-100% margin) carries the growth case. But the whole return is in reais: push the cost of debt and watch a strong nominal number net down once discounted like a Brazilian asset. That tension is the EM towerco trade.',
    s3:'Highline earns <b>rent per tenancy</b> on long, inflation-indexed contracts with Brazil\'s carriers: towers × tenancy ratio × rent. The growth comes two ways: <b>build-to-suit</b> (new towers as coverage and 5G density extend) and <b>lease-up</b> (adding colocation tenants to single-tenant towers, each at near-100% margin). The asset economics are excellent; the investor question is less the towers than the <b>discount rate</b>, Brazilian rates and the real, applied to a long, indexed cash flow.',
    mb:{tag:'Model B · EM independent towerco', title:'Emerging-market independent towerco', body:'An independent towerco in a fast-growing mobile market, building towers and leasing colocation to carriers under long, indexed contracts. A large lease-up runway lifts the tenancy ratio at near-100% incremental margin, priced against emerging-market rates. <b>This is Highline do Brasil</b>, DigitalBridge-backed.'},
    s4a:'Per tower the cost is the ground lease, power and maintenance, fixed regardless of tenants, so the margin is high and climbs with the tenancy ratio. With many towers starting single-tenant, the lease-up upside is large: each added carrier is almost pure EBITDA. The levers are the tenancy ratio and the build-to-suit pipeline, carried against Brazilian rates.',
    wfNote:'Operating cost per tower is the ground lease, power and maintenance, fixed whether one carrier or three share the mast. The margin is high and rises with lease-up; the swing factor for value is the tenancy ratio and the build pipeline, set against an emerging-market discount rate.',
    s4b:'The capital is the towers built and acquired across Brazil, funded on an infrastructure basis. Modelled on an enterprise-value basis, the return is a <b>high-nominal Brazilian</b> one on a long, indexed, lease-up-driven annuity, strong before discounting, then carried at local rates and the real. Build-to-suit against anchor commitments offsets part of the cost.',
    stackH:'The capital · towers built & acquired', splitL:'How the base is built', splitR:'EM',
    split:[['s1',55,'Build-to-suit (new towers)'],['s2',45,'Acquired carrier sites']],
    finList:[['','Model','independent towerco'],['sub','Sponsor','DigitalBridge-backed'],['','Revenue','rent per tenancy, indexed'],['sub','Growth','build-to-suit + lease-up'],['','Tenants','Vivo · Claro · TIM'],['rest','Owner','infrastructure-backed']],
    finNote:'An EM towerco is a <b>colocation annuity with a long runway</b>: build towers, lease up the tenancy ratio, keep the near-100%-margin upside. The whole investment debate is the <b>discount rate</b>: Brazilian rates and the real, applied to an otherwise excellent, indexed cash flow.',
    timeline:[['2015','<b>Highline</b> emerges as an independent Brazilian towerco.'],['2018','<b>DigitalBridge</b> (then Digital Colony) backs the platform.'],['2019–21','<b>Build-to-suit</b> programmes scale with carrier rollouts.'],['2020s','<b>4G/5G densification</b> drives new towers and colocation.'],['2020s','<b>Lease-up</b> lifts the tenancy ratio on the existing base.'],['Ongoing','<b>CPI indexation</b> to Brazilian indices on long leases.']],
    calcNote:'A working model of an <b>EM independent towerco</b>, on an enterprise-value basis. Revenue is towers × tenancy ratio × rent; per-tower opex is fixed, so lease-up lifts margin. The cost of debt is high to reflect Brazilian rates; a strong nominal return nets down once discounted like an EM asset.',
    s6:'Highline is colocation upside at an EM discount rate. The moving parts:',
    breakers:['<b>Lease-up</b>: adding colocation tenants to single-tenant towers is the near-100%-margin upside.','<b>Build-to-suit</b>: coverage and 5G density extend the tower base.','<b>Country &amp; currency</b>: Brazilian rates and the real set the discount rate, not the towers.','<b>Carrier health</b>: three large tenants underpin demand; their capex plans matter.'],
    src:'Figures from public sources on the Brazilian tower market: <a href="https://www.highlinedobrasil.com.br/" target="_blank" rel="noopener">Highline do Brasil</a> and <a href="https://www.digitalbridge.com/" target="_blank" rel="noopener">DigitalBridge</a> disclosure. As a private business, tower, tenancy and rent figures are approximate and illustrative.',
    econ:{cur:'R$', host:'Brazilian carriers', volt:'colocation',
      twDef:18,twMin:6,twMax:30,twStep:1, rentDef:42000,rentMin:24000,rentMax:64000,rentStep:1000,
      tenDef:1.5,tenMin:1.0,tenMax:2.4,tenStep:0.05, opexPerTower:18500, fixedOM:40},
    calc:{build:16400,grant:400,capex:7,revG:6,floor:400,cap:2150,tax:34,exit:18,lev:5,rd:9,amort:2,hold:15},
    map:{footer:GEO.highline.footer}
  },

  /* ---------- 4 · AMPLITEL (Oceania · Telstra InfraCo carve-out) ---------- */
  amplitel:{
    name:'Amplitel', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'amplitel',
    lede:'Australia\'s carve-out <b>towerco</b>, the Telstra InfraCo tower estate, anchored by a long master lease from Telstra itself, a captive annuity with lease-up upside from other carriers.',
    s1:'<p class="body"><b>Amplitel</b> is the tower company carved out of <b>Telstra</b>, Australia\'s largest operator, through Telstra InfraCo. Telstra sold a stake to a consortium of infrastructure investors (including the Future Fund and a Commonwealth Super Corporation vehicle) and retained a stake, while signing a long <b>master lease agreement</b> as the anchor tenant on the towers.</p>'+
       '<p class="body">This is the <b>captive carve-out</b> flavour of the towerco model: the estate comes with a single dominant anchor tenant already in place, on a long, indexed lease, which makes the base cash flow extremely secure but starts the <b>tenancy ratio</b> close to one. The upside is <b>lease-up</b>, colocating Optus, TPG and others onto Telstra\'s towers, each added tenant arriving at near-100% incremental margin, plus build-to-suit for new coverage. Anchor-heavy and low-risk, with tenancy upside to come.</p>',
    facts:[['~8.4k','Towers','Telstra estate'],['Telstra','Anchor','long master lease'],['Carve-out','Structure','InfraCo towerco'],['Future Fund','Investor','+ super consortium'],['Lease-up','Upside','colocate others'],['Indexed','Leases','CPI-linked']],
    s2:'This is the Telstra tower estate, every mast already carrying the anchor\'s panels under a long master lease. The base <b style="color:#0c6b4f">return</b> is secure; the upside is colocation, adding a second carrier\'s antennas to lift the tenancy ratio toward two. Drag the towers, the rent per tenancy and the tenancy ratio: anchor-heavy and low-risk today, with lease-up to come.',
    driverLab:'Rent / tenancy', availLab:'Tenancy ratio', hrK:'Lease revenue', yrS:'tenancies × rent',
    ledge:{a:'+ anchor rent',b:'+ colocation',c:'− site opex'}, demandLabel:'TENANCY',
    preset:'Load Amplitel',
    try:'<b>Try this:</b> notice the <b>tenancy ratio</b> starts close to one: the anchor master lease makes the base cash flow rock-solid but leaves the colocation upside untapped. Nudge it up and watch the high-margin lease-up arrive as other carriers join the towers. The anchor lease is the safety; the tenancy ratio is the growth. That is the captive carve-out trade.',
    s3:'Amplitel earns <b>rent per tenancy</b>, anchored by a long, indexed <b>master lease from Telstra</b> that covers most towers and underpins the cash flow. Revenue is towers × tenancy ratio × rent. The base is exceptionally secure because the anchor is contracted for years; the growth is <b>lease-up</b>, colocating other carriers to lift the tenancy ratio from near one toward two, plus build-to-suit. Each added tenant is near-100% margin on a tower the anchor already pays for.',
    mb:{tag:'Model B · captive carve-out', title:'Anchor-tenant carve-out towerco', body:'A tower estate carved out of an operator with a long, indexed anchor master lease already in place, making the base cash flow very secure but starting the tenancy ratio near one. The upside is lease-up, colocating other carriers at near-100% margin. <b>This is Amplitel</b>, the Telstra InfraCo towerco.'},
    s4a:'Per tower the cost is fixed (ground lease, power, maintenance), so the anchor master lease already covers it and the margin is high. The colocation upside is almost pure EBITDA: a second carrier on a Telstra tower adds rent against a cost the anchor pays. The secure anchor base defines it today; the growth lever is the tenancy ratio.',
    wfNote:'Operating cost per tower is the ground lease, power and maintenance, fixed and already covered by the anchor master lease. So the margin is high, and any colocation tenant added on top is near-100% incremental EBITDA.',
    s4b:'The capital is the Telstra tower estate, carved out and recapitalised with infrastructure investors alongside Telstra\'s retained stake. The return is a low-risk, indexed annuity off the anchor lease, with upside from lifting the tenancy ratio. On an enterprise-value basis it trades at a high multiple, appropriate for a secure, anchored, indexed cash flow with lease-up to come.',
    stackH:'The capital · carved-out estate', splitL:'Ownership of the carve-out', splitR:'allocation',
    split:[['s1',51,'Infrastructure consortium'],['s2',49,'Telstra (retained stake)']],
    finList:[['','Towers','~8.4k (Telstra estate)'],['sub','Anchor','Telstra master lease'],['','Revenue','rent per tenancy, CPI-indexed'],['sub','Investors','Future Fund + super consortium'],['','Upside','lease-up (colocation)'],['rest','Owner','Telstra + consortium']],
    finNote:'A captive carve-out is the <b>safest flavour of the colocation annuity</b>: a long anchor master lease secures the base, and lease-up adds near-100%-margin upside. The risks are the anchor\'s creditworthiness, how much colocation actually arrives, and the price paid at carve-out.',
    timeline:[['2020','<b>Telstra InfraCo</b> set up to house passive infrastructure.'],['2021','<b>Amplitel</b> formed; 49% sold to an investor consortium.'],['2021','<b>Anchor master lease</b> signed with Telstra on the towers.'],['2020s','<b>Lease-up</b>, colocating Optus, TPG and others.'],['2020s','<b>Build-to-suit</b> for new coverage and 5G.'],['Ongoing','<b>CPI indexation</b> on the long master lease.']],
    calcNote:'A working model of a <b>captive carve-out towerco</b>, on an enterprise-value basis. The anchor master lease secures most revenue at a tenancy near one; lease-up lifts the ratio and the margin. The exit multiple is high: a secure, anchored, indexed annuity trades rich.',
    s6:'Amplitel is the anchored carve-out with lease-up to come. The levers:',
    breakers:['<b>Anchor master lease</b>: Telstra\'s long, indexed lease secures the base cash flow.','<b>Lease-up</b>: colocating other carriers lifts the tenancy ratio at near-100% margin.','<b>Anchor credit</b>: the security of the cash flow rests on Telstra\'s covenant.','<b>Carve-out price</b>: what the consortium paid against a high multiple is the return risk.'],
    src:'Figures from public sources on the Australian tower market: <a href="https://www.amplitel.com.au/" target="_blank" rel="noopener">Amplitel</a> and <a href="https://www.telstra.com.au/" target="_blank" rel="noopener">Telstra</a> InfraCo disclosure. Tower, tenancy and rent figures are approximate and illustrative.',
    econ:{cur:'A$', host:'Telstra + carriers', volt:'colocation',
      twDef:8.4,twMin:4,twMax:14,twStep:0.2, rentDef:30000,rentMin:18000,rentMax:46000,rentStep:1000,
      tenDef:1.3,tenMin:1.0,tenMax:2.2,tenStep:0.05, opexPerTower:8000, fixedOM:30},
    calc:{build:6151,grant:400,capex:5,revG:4,floor:115,cap:620,tax:30,exit:24,lev:6,rd:5,amort:2,hold:20},
    map:{footer:GEO.amplitel.footer}
  },

  /* ---------- 5 · TASC TOWERS (Middle East · regional build-out) ---------- */
  tasc:{
    name:'TASC Towers', geo:'MENA region', continent:'Middle East', cur:'US$', geoKey:'tasc',
    lede:'A regional <b>towerco</b> across the Middle East and North Africa, still in its <b>build-out phase</b>: lower tenancy today, but a large runway as carriers carve out infrastructure and networks densify. (Figures illustrative.)',
    s1:'<p class="body"><b>TASC Towers</b> is one of the largest independent tower companies in the Middle East and North Africa, assembling a portfolio across markets such as Jordan, the Gulf and beyond as regional operators move toward the carve-out model that reshaped Europe and the US. It owns towers and leases space to MENA carriers under long, indexed contracts.</p>'+
       '<p class="body">The MENA tower market is <b>earlier in its development</b> than the US or Europe: tower sharing and independent towercos are still scaling, so the <b>tenancy ratio is lower</b> and the business is in a <b>build-out phase</b>. That is precisely the opportunity: a long runway of new towers (build-to-suit for 4G/5G coverage) and a large <b>lease-up</b> ahead as carriers consolidate sites and colocate. The economics follow the same colocation annuity logic; the value is in the ratio climbing from a low base. Figures here are especially illustrative given limited disclosure.</p>',
    facts:[['Regional','Towerco','MENA markets'],['Build-out','Phase','early-stage'],['Lower','Tenancy','runway ahead'],['Build-to-suit','Growth','4G/5G coverage'],['Indexed','Leases','long contracts'],['Private','Owner','infra-backed']],
    s2:'This is a region early in tower sharing: masts going up for coverage, many still single-tenant. The <b style="color:#0c6b4f">return</b> today is anchored by build-to-suit rent; the payoff is the <b>tenancy ratio</b> climbing as carriers colocate. Drag the towers, the rent per tenancy and the tenancy ratio: a low base with a long lease-up runway. Figures are illustrative.',
    driverLab:'Rent / tenancy', availLab:'Tenancy ratio', hrK:'Lease revenue', yrS:'tenancies × rent',
    ledge:{a:'+ anchor rent',b:'+ colocation',c:'− site opex'}, demandLabel:'TENANCY',
    preset:'Load TASC',
    try:'<b>Try this:</b> start with the <b>tenancy ratio</b> low; that is the MENA reality, a young market where most towers are single-tenant. Then raise it and see the colocation flywheel begin: each added carrier is near-100% margin. The whole investment case is the ratio climbing from a low base over years as the market matures, on top of a steady build-to-suit pipeline.',
    s3:'TASC earns <b>rent per tenancy</b> on long, indexed contracts with MENA carriers: towers × tenancy ratio × rent. Because the market is young, the tenancy ratio starts low, so revenue today leans on <b>build-to-suit</b> (new towers for coverage) while the big prize is <b>lease-up</b>: as carriers colocate, the ratio climbs and each added tenant arrives at near-100% margin. It is the early innings of the same colocation annuity that matured in Europe and the US.',
    mb:{tag:'Model B · build-out towerco', title:'Regional build-out towerco', body:'A regional independent towerco in a young market, scaling through build-to-suit with a lower tenancy ratio today and a long lease-up runway ahead. The colocation annuity in its early innings: value comes from the ratio climbing from a low base. <b>This is TASC Towers</b> in the MENA region. Figures illustrative.'},
    s4a:'Per tower the cost is fixed (ground lease, power, maintenance), so even at a lower tenancy the first tenant covers the site and the margin is healthy. The upside is the lease-up runway: as the ratio climbs from a low base, each added carrier is almost pure EBITDA. The case rests on the build-out pipeline today and the tenancy ratio climbing tomorrow.',
    wfNote:'Operating cost per tower is the ground lease, power and maintenance, fixed regardless of tenants. At a young market\'s lower tenancy the margin is healthy but below the mature majors; the swing factor is the tenancy ratio climbing as colocation arrives.',
    s4b:'The capital is the towers being built and acquired across MENA, funded on an infrastructure basis. The return is a long, indexed annuity with a lower starting tenancy and a large lease-up runway. On an enterprise-value basis it trades at a high multiple, though a touch below the most mature majors given the earlier-stage, lower-tenancy starting point. Figures are illustrative.',
    stackH:'The capital · towers built & acquired', splitL:'How the base is built', splitR:'allocation',
    split:[['s1',60,'Build-to-suit (new towers)'],['s2',40,'Acquired carrier sites']],
    finList:[['','Model','regional towerco'],['sub','Markets','MENA region'],['','Revenue','rent per tenancy, indexed'],['sub','Phase','build-out (early-stage)'],['','Upside','lease-up runway'],['rest','Owner','infrastructure-backed']],
    finNote:'A build-out towerco is the <b>colocation annuity in its early innings</b>: a lower tenancy today, a steady build pipeline, and a long lease-up runway. The risks are the pace of carrier carve-outs and colocation, market maturity, and the price paid. Figures here are especially illustrative.',
    timeline:[['2010s','<b>MENA carriers</b> begin exploring tower sharing.'],['2020','<b>TASC Towers</b> scales as a regional independent towerco.'],['2021','<b>Portfolio assembly</b> across Jordan and Gulf markets.'],['2020s','<b>Build-to-suit</b> for 4G/5G coverage extends the base.'],['2020s','<b>Lease-up</b> begins as carriers colocate.'],['Ongoing','<b>Market maturing</b> toward European/US tenancy levels.']],
    calcNote:'A working model of a <b>regional build-out towerco</b>, on an enterprise-value basis. Revenue is towers × tenancy ratio × rent; a lower starting tenancy leaves a long lease-up runway. The exit multiple is high but slightly below the mature majors given the earlier stage. Figures are illustrative.',
    s6:'TASC is the colocation flywheel at the start. What sets the trajectory:',
    breakers:['<b>Lease-up runway</b>: the tenancy ratio climbing from a low base is the core upside.','<b>Build-to-suit</b>: new towers for 4G/5G coverage extend the base today.','<b>Market maturity</b>: the pace of carrier carve-outs and tower sharing sets the trajectory.','<b>Entry price</b>: paying a high multiple for an early-stage base is the principal risk.'],
    src:'Figures from public sources on the MENA tower market: <a href="https://tasctowers.com/" target="_blank" rel="noopener">TASC Towers</a> and regional tower-sector reporting. Given limited disclosure and the early stage, all figures here are especially approximate and illustrative.',
    econ:{cur:'US$', host:'MENA carriers', volt:'colocation',
      twDef:12,twMin:4,twMax:24,twStep:0.5, rentDef:14000,rentMin:8000,rentMax:24000,rentStep:500,
      tenDef:1.25,tenMin:1.0,tenMax:2.2,tenStep:0.05, opexPerTower:4000, fixedOM:25},
    calc:{build:3600,grant:200,capex:7,revG:6,floor:74,cap:400,tax:15,exit:19,lev:5,rd:6.5,amort:2,hold:18},
    map:{footer:GEO.tasc.footer}
  },

  /* ---------- 6 · CHINA TOWER (China · world's largest, state-owned) ---------- */
  chinatower:{
    name:'China Tower', geo:'China', continent:'China', cur:'¥', geoKey:'chinatower',
    lede:'The world\'s largest <b>tower company</b>, state-owned, with around two million towers shared by China\'s three carriers. Vast scale and high tenancy, but thin per-tower economics at a state cost of capital.',
    s1:'<p class="body"><b>China Tower</b> is, by a wide margin, the largest tower company on earth, roughly <b>two million towers</b>, more than every other towerco in the world combined. It was created by pooling the passive infrastructure of China\'s three state carriers, <b>China Mobile, China Unicom and China Telecom</b>, who are simultaneously its <b>owners and its anchor tenants</b>.</p>'+
       '<p class="body">The colocation logic still holds (three carriers sharing towers gives a structurally high <b>tenancy ratio</b>), but the economics are different from the Western majors. The carrier-shareholders negotiated <b>low, sharing-discounted rents</b>, so the rent per tenancy is thin and the return per tower modest. The value is in the <b>vast scale</b> and a very low <b>state cost of capital</b>: a thin per-tower margin multiplied across two million towers is an enormous, stable cash flow. It is the colocation annuity at continental scale, with state-directed pricing.</p>',
    facts:[['~2m','Towers','largest on earth'],['3 carriers','Tenants','+ owners'],['High','Tenancy','sharing by design'],['Thin','Rent','sharing-discounted'],['State','Cost of capital','very low'],['HK-listed','Owner','state-controlled']],
    s2:'Picture towers at continental scale, millions of masts, most shared by two or three state carriers, so the tenancy ratio is structurally high. But the rent per tenancy is thin, set by carrier-shareholders. The <b style="color:#0c6b4f">return</b> per tower is modest; the cash flow is vast because the base is. Drag the towers, the rent per tenancy and the tenancy ratio: the model runs on scale and a low state cost of capital rather than on price.',
    driverLab:'Rent / tenancy', availLab:'Tenancy ratio', hrK:'Lease revenue', yrS:'tenancies × rent',
    ledge:{a:'+ anchor rent',b:'+ colocation',c:'− site opex'}, demandLabel:'TENANCY',
    preset:'Load China Tower',
    try:'<b>Try this:</b> the rent <b>per tenancy</b> is thin, but push the <b>towers</b> slider toward two million and watch the absolute cash flow balloon. Scale and a high tenancy ratio, not price, are the model. The cost of capital is very low because the carrier-shareholders are the state; the trade-off is that they set the rents, so the per-tower return is capped by design.',
    s3:'China Tower earns <b>rent per tenancy</b> from its three carrier-shareholders, towers × tenancy ratio × rent, but the rent is set low under sharing arrangements the carriers themselves negotiated. The tenancy ratio is structurally high because three operators share masts by design. The return per tower is thin; the value is the <b>vast scale</b> and a very low <b>state cost of capital</b>, which turn a modest per-tower margin into an enormous, stable cash flow. Colocation at continental scale.',
    mb:{tag:'Model B · state-owned towerco', title:'State towerco, colocation at scale', body:'A state-controlled towerco pooling the passive infrastructure of three carrier-shareholders, with a structurally high tenancy ratio but thin, sharing-discounted rents. The value lies in vast scale and a very low state cost of capital rather than in the price per tower. <b>This is China Tower</b>, the world\'s largest towerco.'},
    s4a:'At this scale operating cost is immense in absolute terms, running two million towers, but per tower it is the same fixed ground-lease-and-power line, so the high tenancy ratio still drives a healthy margin. The difference is the thin rent: the per-tower return is modest by design. The dominant number is the <b>scale</b> of the base and the very low cost of capital rather than the margin on any one tower.',
    wfNote:'Operating cost per tower is the ground lease, power and maintenance, fixed, and at a high tenancy ratio the margin is healthy. But rents are thin and sharing-discounted, so the return per tower is modest; the value is in the vast base and a very low state cost of capital.',
    s4b:'The capital is the largest tower estate on earth, pooled from the three state carriers and held in a state-controlled, HK-listed vehicle. Financed on a state-backed basis at a very low cost of capital, a thin per-tower return compounds across two million towers into a vast, steady cash flow. The owner and the rents are the state\'s; the scale is unmatched.',
    stackH:'The capital · national tower estate', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'Chinese state carriers, pooled']],
    finList:[['','Towers','~2m (largest on earth)'],['sub','Tenants','China Mobile · Unicom · Telecom'],['','Revenue','rent per tenancy (thin)'],['sub','Tenancy','structurally high (sharing)'],['','Cost of capital','very low (state)'],['rest','Owner','state-controlled, HK-listed']],
    finNote:'China Tower is the <b>colocation annuity at continental scale</b>: a structurally high tenancy ratio on a vast base, but thin, sharing-discounted rents and a very low state cost of capital. The return per tower is modest; the absolute cash flow is enormous and steady. The owner and the pricing are the state\'s.',
    timeline:[['2014','<b>China Tower</b> created by pooling the three carriers\' sites.'],['2015','<b>Tower estate consolidated</b> into a single national vehicle.'],['2018','<b>Hong Kong IPO</b>, partial listing of the state towerco.'],['2010s','<b>Sharing arrangements</b> set low, discounted rents.'],['2020s','<b>5G build-out</b> adds towers and equipment at scale.'],['Ongoing','<b>State-directed</b> pricing and strategy.']],
    calcNote:'A working model of the <b>world\'s largest towerco</b>, on an enterprise-value basis. Revenue is towers × tenancy ratio × rent; the tenancy is high but the rent thin and sharing-discounted, so the per-tower return is modest. A very low state cost of capital and vast scale make the absolute cash flow enormous. Figures are highly illustrative given the scale.',
    s6:'China Tower is scale plus sharing at a state cost of capital. The drivers:',
    breakers:['<b>Scale</b>: a thin return on ~2m towers is the model; the value sits in the base rather than the rent.','<b>Tenancy ratio</b>: three carriers sharing by design keeps tenancy structurally high.','<b>Sharing-discounted rents</b>: carrier-shareholders set low rents, capping the per-tower return.','<b>State cost of capital</b>: very low funding lifts the value of even a thin margin.'],
    src:'Figures from public sources and reporting on <a href="https://www.china-tower.com/" target="_blank" rel="noopener">China Tower Corporation</a> (HK-listed) and the Chinese tower market. Given the company\'s scale and state ownership, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', host:'three state carriers', volt:'colocation',
      twDef:2000,twMin:1200,twMax:2200,twStep:50, rentDef:5800,rentMin:3500,rentMax:9000,rentStep:100,
      tenDef:1.7,tenMin:1.2,tenMax:2.4,tenStep:0.05, opexPerTower:1750, fixedOM:4000},
    calc:{build:230958,grant:0,capex:8,revG:4,floor:6900,cap:37500,tax:25,exit:18,lev:4,rd:3.5,amort:2,hold:25},
    map:{footer:GEO.chinatower.footer}
  }
  };
  var ORDER=['cellnex','amt','highline','amplitel','tasc','chinatower'];

  /* ===================================================================
     TOWER RENDERER  (canvas, 720x520), daytime, elevation/top-down hybrid
     A landscape dotted with mobile towers (masts): more towers = more masts;
     a higher tenancy ratio = more antenna sets per mast (colocation made
     visible), drawn in 2–3 operator colours. Faint coverage glow around active
     masts; +cash orbs rise (anchor rent + amber colocation), −cash site-opex
     orbs drain; a build-to-suit / new-tenant marker if GEO.growing.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  // operator (tenant) colours, distinct carriers sharing a mast
  var TENCOL=['#2f6fb0','#c0902f','#7a4fb0'];
  // mast grid layout (built once per asset from GEO)
  var MASTS=[], COLX=[], ROWY=[], NMAST=0;
  function layout(){
    var G=GEO[A.geoKey], dense=!!G.dense;
    ROWY = dense ? [150,236,322,408] : [176,300,424];
    COLX = dense ? [96,176,256,336,416,496,576,656] : [110,210,310,410,510,610];
    MASTS=[]; var idx=0;
    for(var r=0;r<ROWY.length;r++) for(var c=0;c<COLX.length;c++){
      // gentle deterministic jitter so the field doesn't look gridded
      var jx=(((c*13+r*7)%9)-4)*2.2, jy=(((c*5+r*11)%7)-3)*2.0;
      var x=COLX[c]+jx, y=ROWY[r]+jy;
      var mono=((c*3+r*5)%5===0);          // a few monopoles, the rest lattice
      // build order = left-to-right, top-to-bottom (so "more towers" reveals across)
      var rank=r*COLX.length+c;
      MASTS.push({x:x,y:y,mono:mono,row:r,col:c,rank:rank,ph:(idx*0.7)%6.28}); idx++;
    }
    NMAST=MASTS.length;
  }

  /* ---- base map: ground + soft terrain ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e3e9dd'); g.addColorStop(1,'#d3ddc9');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // soft rolling terrain bands
    ctx.fillStyle='rgba(150,180,140,0.10)';
    [[0,120,W,140],[0,330,W,150]].forEach(function(b){ rr(b[0],b[1],b[2],b[3],0); ctx.fill(); });
    // faint horizon line of distant hills
    ctx.strokeStyle='rgba(120,150,120,0.18)'; ctx.lineWidth=1; ctx.beginPath();
    for(var x=0;x<=W;x+=24){ var y=104+Math.sin(x*0.012)*8; if(x===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke();
  }

  /* ---- one antenna panel set (a tenant) on a mast ---- */
  function antennaSet(x,y,col,r){
    // three small panels radiating from the platform, in the tenant's colour
    ctx.save();
    for(var k=0;k<3;k++){ var a=(-Math.PI/2)+(k-1)*0.95;
      var px=x+Math.cos(a)*r, py=y+Math.sin(a)*r;
      ctx.strokeStyle='rgba(60,70,66,0.55)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(px,py); ctx.stroke();
      ctx.save(); ctx.translate(px,py); ctx.rotate(a+Math.PI/2);
      ctx.fillStyle=col; rr(-1.6,-3.4,3.2,6.8,1); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=0.5; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  /* ---- one mast: tapered lattice / monopole with platform + tenant antennas ---- */
  function mast(m,sets,active){
    var x=m.x, baseY=m.y, topY=m.y-58, midY=m.y-30;
    // coverage glow around active masts
    if(active) glow(x,topY+6,30,'rgba(90,170,235,0.16)');
    // shadow on the ground
    ctx.fillStyle='rgba(30,45,35,0.10)'; ctx.beginPath(); ctx.ellipse(x,baseY+3,14,4,0,0,Math.PI*2); ctx.fill();
    // small concrete platform / compound
    ctx.fillStyle='#c7ccc1'; rr(x-11,baseY-2,22,6,2); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=0.8; ctx.stroke();
    if(m.mono){
      // monopole: a single tapered pole
      var grd=ctx.createLinearGradient(x-3,0,x+3,0); grd.addColorStop(0,'#9aa19a'); grd.addColorStop(0.5,'#bcc2bb'); grd.addColorStop(1,'#8c948d');
      ctx.fillStyle=grd; ctx.beginPath();
      ctx.moveTo(x-3.2,baseY); ctx.lineTo(x-1.4,topY); ctx.lineTo(x+1.4,topY); ctx.lineTo(x+3.2,baseY); ctx.closePath(); ctx.fill();
    } else {
      // lattice: two tapering legs + cross-bracing
      var lw=10, tw=3.2;
      ctx.strokeStyle='rgba(120,128,120,0.92)'; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(x-lw/2,baseY); ctx.lineTo(x-tw/2,topY); ctx.moveTo(x+lw/2,baseY); ctx.lineTo(x+tw/2,topY); ctx.stroke();
      // cross bracing, width tapers with height
      ctx.strokeStyle='rgba(140,148,140,0.7)'; ctx.lineWidth=0.7;
      var steps=6;
      for(var s=0;s<steps;s++){ var f0=s/steps, f1=(s+1)/steps;
        var y0=baseY+(topY-baseY)*f0, y1=baseY+(topY-baseY)*f1;
        var w0=(lw/2)*(1-f0)+(tw/2)*f0, w1=(lw/2)*(1-f1)+(tw/2)*f1;
        ctx.beginPath(); ctx.moveTo(x-w0,y0); ctx.lineTo(x+w1,y1); ctx.moveTo(x+w0,y0); ctx.lineTo(x-w1,y1); ctx.stroke();
      }
    }
    // platform at the top where antennas mount
    ctx.fillStyle='rgba(120,128,120,0.95)'; rr(x-5,topY-1,10,2.4,1); ctx.fill();
    // aviation light blip
    if(active && Math.sin(T*0.1+m.ph)>0.6){ ctx.fillStyle='rgba(220,80,70,0.9)'; ctx.beginPath(); ctx.arc(x,topY-2,1.3,0,Math.PI*2); ctx.fill(); }
    // tenant antenna sets, stacked down the top of the mast, one per tenant, in operator colours
    for(var t=0;t<sets;t++){ var ay=topY+4+t*11; antennaSet(x,ay,TENCOL[t%TENCOL.length], 7); }
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
    var px=16,py=14,pw=236,ph=104, m=rev>0?eb/rev:0, oR=rev>0?opex/rev:0, L=A.ledge||{a:'+ revenue',b:'+ income',c:'− opex'};
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
  /* ---- live tenancy sparkline ---- */
  function drawDemand(occ){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'TENANCY';
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(label,px+11,py+14);
    ctx.fillStyle='rgba(47,125,84,0.95)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText((A.econ.tenMin+occ*(A.econ.tenMax-A.econ.tenMin)).toFixed(2)+'\u00d7',px+pw-11,py+14);
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
    var towers=parseFloat(sCap.value)*1000;
    var rent=parseFloat(sSpread.value);
    var tenancy=parseFloat(sAvail.value);          // ratio, NOT /100

    ctx.clearRect(0,0,W,H);
    drawMap();

    // how many masts to draw "active" = scale of the tower base (relative to slider span)
    var twSpan=Math.max(1,E.twMax-E.twMin), twFrac=(parseFloat(sCap.value)-E.twMin)/twSpan;
    var activeCount=Math.max(1,Math.round(NMAST*(0.18+0.82*twFrac)));
    // antenna sets per mast = round(tenancy ratio), clamped 1..3 for the visual
    var setsPer=Math.max(1,Math.min(3,Math.round(tenancy)));
    // fractional remainder lets an extra tenant "fade in" on some masts as the ratio climbs
    var frac=tenancy-Math.floor(tenancy);

    MASTS.forEach(function(mm){
      if(mm.rank>=activeCount){ // distant / not-yet-built: draw faint
        ctx.save(); ctx.globalAlpha=0.16; mast(mm,1,false); ctx.restore(); return;
      }
      // some masts carry the extra (fractional) tenant, deterministically
      var extra = (frac>0.15 && ((mm.rank*7)%10)/10 < frac) ? 1 : 0;
      var sets=Math.max(1,Math.min(3, Math.floor(tenancy)+extra));
      mast(mm,sets,true);
    });

    // ---- economics (colocation / tenancy annuity) ----
    var revenue=towers*tenancy*rent;
    var opex= towers*(E.opexPerTower||0) + (E.fixedOM||0)*1e6;   // PER TOWER (fixed), so extra tenants are ~100% margin
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    // waterfall cost split (illustrative): ground lease, power, maintenance, admin
    var c_ground=opex*0.42, c_power=opex*0.26, c_maint=opex*0.18, c_admin=opex*0.14;
    // share of "+cash" that is amber colocation (extra tenants) vs anchor rent
    var colocShare=Math.max(0.08,Math.min(0.6,(tenancy-1)/1.6));

    // money-flow: +cash rises from active masts (anchor + amber colocation); −cash (site opex) drains
    if(_anim){
      var live=MASTS.slice(0,Math.max(1,Math.min(NMAST,activeCount)));
      if(live.length && Math.random()<0.6){ var s1=live[(Math.random()*live.length)|0]; spawnCoin(s1.x,s1.y-50, Math.random()<colocShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.6, opex/Math.max(1,revenue)));
      if(live.length && Math.random()<outRate){ var s2=live[(Math.random()*live.length)|0]; spawnCoin(s2.x,s2.y-2,'cost',1); }
      demHist.push(Math.max(0,Math.min(1,(tenancy-E.tenMin)/Math.max(0.1,E.tenMax-E.tenMin)))); if(demHist.length>73) demHist.shift();
    }

    // "+ BUILD-TO-SUIT" / "+ NEW TENANT" marker on the growth frontier
    if(G.growing && activeCount<NMAST){
      var nxt=MASTS[Math.min(NMAST-1,activeCount)];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ BUILD-TO-SUIT',nxt.x,nxt.y-66); ctx.restore();
        glow(nxt.x,nxt.y-50,9,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    } else if(G.growing && setsPer<3){
      // base full: signal the lease-up / new tenant story on a built mast
      var lm=MASTS[Math.min(NMAST-1,Math.max(0,activeCount-1))];
      if(lm){ var pul2=0.5+0.5*Math.sin(T*0.12);
        ctx.save(); ctx.globalAlpha=0.5+0.4*pul2; ctx.fillStyle='#c0902f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText('+ NEW TENANT',lm.x,lm.y-66); ctx.restore();
        glow(lm.x,lm.y-44,8,'rgba(192,144,47,'+(0.2+0.3*pul2)+')'); }
    }

    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,(tenancy-E.tenMin)/Math.max(0.1,E.tenMax-E.tenMin))));

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(towers)+' towers',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    var tenancies=Math.round(towers*tenancy);
    set('ixCapV',kfmt(towers)+' towers'); set('ixSpreadV',CUR+kfmt(rent)+'/yr'); set('ixAvailV',tenancy.toFixed(2)+'×');
    set('ixDir',kfmt(towers)); set('ixDirS','towers owned · '+(G.area||''));
    set('ixMW',kfmt(tenancies)+' tenancies'); set('ixMWs',tenancy.toFixed(2)+'× tenancy · '+(E.host||'carriers'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Ground lease',c_ground],['Power',c_power],['Maintenance',c_maint],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the tower cash flow is too thin to value: raise the towers, the rent per tenancy or the tenancy ratio.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build</span> <b>'+money(capexGrossG)+'</b></span>'+
      '<span><span class="lbl">Net of contributions</span> <b>'+money(netCapexG)+'</b></span>'+
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
    sCap.min=E.twMin; sCap.max=E.twMax; sCap.step=E.twStep; sCap.value=E.twDef;
    sSpread.min=E.rentMin; sSpread.max=E.rentMax; sSpread.step=E.rentStep; sSpread.value=E.rentDef;
    sAvail.min=E.tenMin; sAvail.max=E.tenMax; sAvail.step=E.tenStep; sAvail.value=E.tenDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is a colocation / tenancy annuity (towers × tenancy ratio × rent per tenancy) and the returns model is a simplified DCF; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.twDef; sSpread.value=E.rentDef; sAvail.value=E.tenDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'cellnex');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
