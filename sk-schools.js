/* Schools (PPP / PFI), data-driven worked examples.
   Six real schools public-private partnerships (availability PPPs / PFIs and
   P3 programmes), one template. Scene config from sk-geo.js (GEO), drawn as a
   top-down / elevation school campus in a 720x520 scene: one or two school
   buildings with rows of lit classroom windows, a playground / sports pitch, a
   covered entrance and a small bus drop-off, with a local-authority icon paying
   the availability fee. The interactive figures are illustrative: revenue is a
   contracted government annuity (pupil places × unitary charge × availability),
   with NO demand risk, it is an availability payment, cut only by deductions for
   unavailability or performance, and floored at the contracted minimum. The returns
   model is a simplified DCF in which a public contribution offsets the capital. */
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
  function pctS(v){ return (v>=0?'+':'')+(Math.round(v*10)/10)+'%'; }
  function kfmt(n){ return n>=1e6?(n/1e6).toFixed(n>=1e7?0:1)+'m':(n>=1e3?Math.round(n/1e3)+'k':''+Math.round(n)); }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · UK BSF / PF2 SCHOOLS BUNDLE (Europe · batched PFI) ---------- */
  ukbsf:{
    name:'UK BSF / PF2 schools bundle', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'ukbsf',
    lede:'The textbook <b>schools PFI</b>, a bundle of secondary schools, built once under a batched public-private partnership and paid for through a fixed, indexed <b>unitary charge</b> over 25-30 years, with no demand risk.',
    s1:'<p class="body">Under <b>Building Schools for the Future (BSF)</b> and its successor <b>PF2</b>, English secondary schools were rebuilt in <b>batches</b>: a private consortium designed, built, financed and now maintains a bundle of several schools, and the local authority pays a single, fixed <b>unitary charge</b> for each year the schools are available and fit to teach in. The charge is contracted for <b>25-30 years</b> and indexed to inflation.</p>'+
       '<p class="body">The economics are a <b>contracted government annuity</b>. Revenue does <b>not</b> depend on pupil numbers, it is an <b>availability payment</b>, cut only by <b>deductions</b> if a building is unavailable or a service fails to perform. The consortium carries the <b>facilities-management (FM)</b> obligation, cleaning, caretaking, lifecycle renewal, but for schools this is <b>light</b>: simple buildings, daytime use. Long, government-backed, inflation-linked and demand-risk-free, a schools PFI is the <b>lowest-risk PPP</b> there is.</p>',
    facts:[['PFI / PF2','Structure','batched bundle'],['No demand risk','Payment','availability only'],['25-30yr','Term','indexed unitary charge'],['Light FM','Service','simple buildings'],['Deductions','Risk','unavailability / performance'],['Infra fund','Owner','lowest-risk PPP']],
    s2:'Watch the campus. The schools stand <b>lit and available</b>; the playground and sports pitch sit alongside. The owner\'s <b style="color:#0c6b4f">money</b> is the <b>unitary charge on every available place</b>, so the engine is the pupil places, the charge per place and how fully available the buildings are, not how many pupils enrol. Drop the availability and classrooms dim as a <b>deduction</b> bites. Drag the places, the charge and the availability.',
    driverLab:'Charge / place', availLab:'Availability', hrK:'Unitary charge', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load UK BSF bundle',
    try:'<b>Try this:</b> drop the <b>availability</b> and watch the unitary charge fall as a <b>deduction</b> bites, a schools PFI is paid only for buildings <b>available and fit to teach in</b>, never for pupil numbers. Then push the <b>places</b> slider: the bundle scales by batching more schools into one contract. The cash is contracted, indexed and government-backed, the lowest-risk PPP in the market.',
    s3:'The consortium earns a fixed, indexed <b>unitary charge</b> for each year the bundle of schools is available, covering capital, financing, lifecycle and FM. There is <b>no demand risk</b>, the charge is paid regardless of enrolment, and it is cut only by <b>deductions</b> for unavailability or poor performance. So the income is a clean, fully contracted government annuity, set by the places, the charge per place and availability. Light FM keeps the margin healthy; the swing factor is availability and the discount rate.',
    mb:{tag:'Model B · batched schools PFI', title:'Bundled PFI / PF2 schools', body:'A consortium designs, builds, finances and maintains a bundle of secondary schools and is paid a fixed, indexed unitary charge for keeping them available, no demand risk, light FM, deductions only for unavailability. A long, government-backed, inflation-linked annuity batched across several schools. <b>This is a UK BSF / PF2 bundle</b>, infra-fund owned.'},
    s4a:'The consortium carries the <b>facilities-management</b> obligation over the term, cleaning, caretaking, grounds and <b>lifecycle renewal</b> of plant and fabric, plus a hard-FM and admin overhead. For schools this is <b>light</b>: simple, daytime buildings. So the margin is high and the cost line thin and predictable. The defining feature is not opex but the <b>contracted, indexed unitary charge</b> and the availability behind it.',
    wfNote:'Operating cost is the light facilities management a schools PFI bundles in, cleaning, caretaking, grounds and the periodic lifecycle renewal of plant and fabric, plus a small admin overhead. It is real but light for simple daytime buildings, so the margin is high; the value is the contracted, indexed unitary charge, not the cost line.',
    s4b:'The capital is the <b>school buildings</b>, the bundle built once under the contract. A <b>public contribution</b> (capital grant or PFI credits) typically funds a share, with the consortium financing the balance at high leverage and recovering it through the unitary charge. That is the model: a batched upfront build turned into a long, contracted, indexed, government-backed annuity at very little equity.',
    stackH:'The capital · the school buildings', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',30,'Public contribution'],['s2',70,'Consortium capital']],
    finList:[['','Assets','bundle of secondary schools'],['sub','Structure','PFI / PF2, batched'],['','Revenue','indexed unitary charge'],['sub','Demand risk','none (availability only)'],['','Key risk','deductions &amp; lifecycle'],['rest','Owner','infrastructure fund']],
    finNote:'A schools PFI is the <b>lowest-risk PPP</b>: a fixed, indexed unitary charge for keeping a bundle of schools available, no demand risk, light FM, an investment-grade government offtaker. It gears highly and prices tight; the residual risk is availability deductions and lifecycle delivery, and the value is set on the secondary market.',
    timeline:[['2004','<b>Building Schools for the Future</b> launched, secondary schools rebuilt in batches.'],['2010s','<b>BSF wound down</b>; <b>PF2</b> becomes the successor schools-PPP route.'],['Operational','<b>Unitary charge</b> paid for each available, fit-to-teach school year.'],['Indexed','<b>Charge indexation</b> tracks inflation over the 25-30 year term.'],['Secondary','<b>Bundles trade</b> to infrastructure funds at a repriced yield.'],['Hand-back','<b>Schools returned</b> to the authority at term end in defined condition.']],
    calcNote:'A working model of a <b>batched schools PFI</b>. The build is the bundle\'s cost; a public contribution offsets part of it, so net capital is the balance. Revenue is the indexed unitary charge over a long hold, floored at the contracted minimum (no demand risk). High leverage and a moderate exit multiple reflect a contracted, government-backed annuity.',
    s6:'A UK schools PFI is the contracted, government-backed annuity. What moves the return:',
    breakers:['<b>Availability</b>, the charge is paid for schools available and fit to teach; deductions bite when they are not.','<b>Indexation</b>, the inflation-linked charge protects the real return over a 25-30 year term.','<b>Light FM &amp; lifecycle</b>, keeping simple buildings maintained is the operational job; lifecycle renewal is the cost.','<b>Secondary-market repricing</b>, what an infra fund pays for the bundle sets the equity return.'],
    src:'Figures from public sources on UK schools PFI / PF2 and Building Schools for the Future: <a href="https://www.nao.org.uk/" target="_blank" rel="noopener">National Audit Office</a> and Treasury PFI data. The figures are approximate and illustrative.',
    econ:{cur:'£', host:'local authority', volt:'secondary schools',
      placesDef:8000,placesMin:2000,placesMax:20000,placesStep:500, chargeDef:1800,chargeMin:900,chargeMax:3200,chargeStep:50,
      availDef:99,availMin:88,availMax:100,availStep:1, fmPerPlace:420, fixedOM:3},
    calc:{build:200,grant:50,capex:2,revG:2.5,floor:8,cap:28,tax:25,exit:16,lev:5,rd:5,amort:4,hold:25},
    map:{footer:GEO.ukbsf.footer}
  },

  /* ---------- 2 · ALBERTA SCHOOLS P3 (North America · bundled P3) ---------- */
  alberta:{
    name:'Alberta Schools P3', geo:'Alberta, Canada', continent:'North America', cur:'C$', geoKey:'alberta',
    lede:'A Canadian <b>bundled P3</b> schools programme, dozens of new schools delivered in batches under design-build-finance-maintain contracts, paid for through an availability charge with no demand risk.',
    s1:'<p class="body">Alberta delivered successive waves of new schools through <b>public-private partnerships (P3s)</b>, bundling <b>dozens of schools</b> into a single design-build-finance-maintain contract. A private consortium builds the batch to a standard design, finances it, and maintains it over a long term, while the province pays a contracted <b>availability charge</b> for each year the schools are available and fit for use.</p>'+
       '<p class="body">It is the North American form of the schools availability PPP. The consortium takes <b>no demand risk</b>, enrolment is the province\'s concern, and earns a fixed, indexed payment for keeping the bundle available, with <b>deductions</b> for unavailability. Standardised designs and <b>batching</b> drive efficiency; FM is <b>light</b>. Backed by an investment-grade provincial offtaker and denominated in Canadian dollars, it is a low-risk, contracted, inflation-linked annuity.</p>',
    facts:[['P3','Structure','design-build-finance-maintain'],['Bundled','Delivery','dozens of schools'],['No demand risk','Payment','availability charge'],['Gov offtaker','Counterparty','investment-grade province'],['Standardised','Design','batch efficiency'],['Consortium','Owner','infra-backed P3']],
    s2:'Picture a campus of standardised schools, the buildings stand lit and available, the sports pitch and drop-off alongside. The consortium\'s <b style="color:#0c6b4f">return</b> is the <b>availability charge on every available place</b>, contracted, indexed, province-backed, with deductions for unavailability. Drag the places, the charge and the availability, a batched, fully contracted annuity with no demand risk.',
    driverLab:'Charge / place', availLab:'Availability', hrK:'Availability charge', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load Alberta P3',
    try:'<b>Try this:</b> push the <b>places</b> slider, the P3 scales by batching more schools into one contract at a standard design, so the annuity grows at little extra cost. Then drop <b>availability</b> and watch the charge fall as a deduction bites. With an investment-grade province paying, the discount rate is low: this is a core, contracted, inflation-linked cash flow.',
    s3:'The consortium earns a contracted, indexed <b>availability charge</b> for keeping the bundle of schools available and fit for use, with <b>deductions</b> for unavailability. There is <b>no demand risk</b>, enrolment is the province\'s. So the income is a clean, fully contracted annuity backed by an <b>investment-grade province</b>, set by the places, the charge per place and availability. Standardised designs and batching keep FM light and the margin healthy; the swing factor is availability and the discount rate.',
    mb:{tag:'Model B · bundled P3', title:'Design-build-finance-maintain schools', body:'A P3 in which a consortium designs, builds, finances and maintains a bundle of standardised schools and the province pays a contracted, indexed availability charge for keeping them available, no demand risk, light FM, deductions for unavailability. Batching and standard designs drive efficiency. <b>This is the Alberta Schools P3</b>.'},
    s4a:'The consortium carries the <b>facilities-management</b> obligation over the term, cleaning, caretaking, grounds and <b>lifecycle renewal</b>, across a batch of standardised schools, plus admin. Standard designs make the FM efficient and predictable, and for schools it is <b>light</b>. The margin is steady; the defining feature is not the cost line but the <b>contracted, indexed availability charge</b> and the low discount rate a provincial offtaker permits.',
    wfNote:'Operating cost is the light facilities management across a batch of standardised schools, cleaning, caretaking, grounds and periodic lifecycle renewal, plus admin. Standard designs make it efficient and predictable; the margin is high, and the value sits in the indexed, province-backed availability charge, not the cost line.',
    s4b:'The capital is the <b>bundle of school buildings</b>, built once to a standard design. A <b>provincial contribution</b> typically funds a share, with the consortium financing the balance and recovering it through the availability charge. Backed by an investment-grade offtaker and a contracted, indexed cash flow, it gears well, a low-risk, long-life annuity delivered at batch efficiency.',
    stackH:'The capital · the school buildings', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',25,'Provincial contribution'],['s2',75,'Consortium capital']],
    finList:[['','Assets','bundle of new schools'],['sub','Structure','P3 (DBFM)'],['','Revenue','indexed availability charge'],['sub','Offtaker','investment-grade province'],['','Demand risk','none'],['rest','Owner','infra-backed consortium']],
    finNote:'A bundled schools P3 is a <b>core-infrastructure annuity</b>: an indexed availability charge for keeping a batch of standardised schools available, no demand risk, an investment-grade provincial offtaker. It gears well and prices tight; the residual risk is availability deductions and lifecycle delivery across the bundle.',
    timeline:[['2008','<b>Alberta Schools Alternative Procurement (ASAP I)</b>, first bundled P3 schools wave.'],['2010','<b>ASAP II</b> bundles more schools into a single P3 contract.'],['2012','<b>Further waves</b> extend the standardised-design programme.'],['Operational','<b>Availability charge</b> paid for each available school year.'],['Indexed','<b>Charge indexation</b> tracks inflation over the term.'],['Hand-back','<b>Schools returned</b> to the province in defined condition.']],
    calcNote:'A working model of a <b>bundled schools P3</b>. The build is the batch\'s cost; a provincial contribution offsets part of it. Revenue is the indexed availability charge over a long hold, floored at the contracted minimum (no demand risk). A low cost of debt and high gearing reflect an investment-grade provincial offtaker.',
    s6:'The Alberta Schools P3 is the core, province-backed annuity. What drives it:',
    breakers:['<b>Availability</b>, the charge is paid for schools available and fit for use; deductions bite when they are not.','<b>Batching</b>, bundling many schools into one contract at a standard design drives efficiency.','<b>Provincial offtaker</b>, an investment-grade counterparty keeps the discount rate low and gearing high.','<b>Lifecycle delivery</b>, maintaining the batch to standard over decades is the operational risk.'],
    src:'Figures from public sources on Alberta\'s bundled schools P3 programme (ASAP) and Canadian schools P3s: provincial and Auditor General disclosure. The figures are approximate and illustrative.',
    econ:{cur:'C$', host:'province', volt:'new schools',
      placesDef:12000,placesMin:3000,placesMax:28000,placesStep:500, chargeDef:2200,chargeMin:1100,chargeMax:3800,chargeStep:50,
      availDef:99,availMin:88,availMax:100,availStep:1, fmPerPlace:560, fixedOM:4},
    calc:{build:340,grant:80,capex:2,revG:2,floor:16,cap:55,tax:26,exit:15,lev:5,rd:5,amort:4,hold:25},
    map:{footer:GEO.alberta.footer}
  },

  /* ---------- 3 · BELO HORIZONTE / BRAZIL SCHOOLS PPP (South America · municipal, EM) ---------- */
  belo:{
    name:'Belo Horizonte schools PPP', geo:'Belo Horizonte, Brazil', continent:'South America', cur:'R$', geoKey:'belo',
    lede:'A pioneering Brazilian <b>municipal schools PPP</b>, a private partner builds and maintains a network of early-years and basic-education units, paid through an availability charge, with no demand risk.',
    s1:'<p class="body"><b>Belo Horizonte</b> ran one of Brazil\'s first municipal <b>schools PPPs</b>: a private partner built and now operates and maintains a <b>network of early-years and basic-education units</b> (creches and schools), while the municipality pays a contracted <b>availability charge</b> for keeping the units available and the non-pedagogical services running. Teaching stays public; the partner provides the buildings and the facilities.</p>'+
       '<p class="body">It is the schools availability PPP in <b>emerging-market</b> form. The partner takes <b>no demand risk</b>, enrolment is the city\'s, and earns an indexed payment for keeping the network available, with <b>deductions</b> for unavailability or service failure. The units are bundled and standardised; FM is light. The contract is highly contracted, but it is an EM municipal concession: the cash is in reais and discounted at a higher rate than a developed-market PPP. (Figures here are illustrative.)</p>',
    facts:[['Municipal PPP','Structure','build &amp; maintain'],['No demand risk','Payment','availability charge'],['Early-years','Units','creches &amp; schools'],['Indexed','Payment','inflation-linked (reais)'],['Light FM','Service','non-pedagogical'],['EM','Discount','municipal concession']],
    s2:'Picture a network of standardised units, early-years and basic-education buildings, lit and available, with playgrounds alongside. The partner\'s <b style="color:#0c6b4f">return</b> is the <b>availability charge on every available place</b>, contracted and indexed, with deductions for unavailability. Drag the places, the charge and the availability, no demand risk, but an emerging-market discount rate.',
    driverLab:'Charge / place', availLab:'Availability', hrK:'Availability charge', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load Belo Horizonte',
    try:'<b>Try this:</b> raise the <b>availability</b> toward 100% and watch the charge hold near the contracted level, a schools PPP pays for keeping units <b>available</b>, not for enrolment. Then push the cost of debt: a strong contracted number nets down once discounted like an emerging-market municipal concession. The contract is clean; the swing is the discount rate.',
    s3:'The partner earns a contracted, indexed <b>availability charge</b> for keeping the network of units available and the non-pedagogical services running, with <b>deductions</b> for unavailability or service failure. There is <b>no demand risk</b>, enrolment is the city\'s. So the income is a fully contracted availability annuity, set by the places, the charge per place and availability. The investor question is less the contract than the <b>discount rate</b>, Brazilian municipal and currency risk.',
    mb:{tag:'Model B · municipal schools PPP', title:'Build-and-maintain schools network', body:'A municipal PPP in which a partner builds and maintains a network of early-years and basic-education units and is paid a contracted, indexed availability charge for keeping them available, no demand risk, light non-pedagogical FM, deductions for unavailability. A fully contracted annuity priced against emerging-market rates. <b>This is the Belo Horizonte schools PPP</b>.'},
    s4a:'The partner carries the <b>non-pedagogical facilities</b>, cleaning, caretaking, security, grounds and <b>lifecycle renewal</b> of a network of standardised units, plus admin. Teaching stays public, so the FM is light and predictable. Margins on availability PPPs are healthy because the charge is set to cover it; the swing factor is not the cost line but the <b>contracted charge and the discount rate</b> on an EM concession.',
    wfNote:'Operating cost is the non-pedagogical facilities management, cleaning, caretaking, security, grounds and lifecycle renewal of a network of standardised units. Teaching stays public, so it is light; the charge covers it at a contracted margin, and the value driver is the indexed charge and the emerging-market discount rate.',
    s4b:'The capital is the <b>network of units</b>, creches and schools built under the PPP to a standard design. A <b>municipal contribution</b> may fund part, with the partner financing the balance and recovering it through the availability charge. Modelled on an enterprise-value basis, it is a contracted, indexed annuity carried against <b>emerging-market</b> rates.',
    stackH:'The capital · the school network', splitL:'Who funds the build', splitR:'EM',
    split:[['s1',20,'Municipal contribution'],['s2',80,'Partner capital']],
    finList:[['','Assets','early-years &amp; basic-education units'],['sub','Structure','municipal schools PPP'],['','Revenue','indexed availability charge'],['sub','Demand risk','none (enrolment to city)'],['','Key risk','municipal &amp; currency'],['rest','Owner','PPP partner']],
    finNote:'A municipal schools PPP is a <b>fully contracted availability annuity</b>: an indexed charge for keeping a network of units available, with no demand risk and light non-pedagogical FM. The whole investment debate is the <b>discount rate</b>, Brazilian municipal and currency risk, more than the contract.',
    timeline:[['2012','<b>Belo Horizonte schools PPP</b> signed, one of Brazil\'s first municipal schools partnerships.'],['2010s','<b>Network construction</b>, early-years and basic-education units delivered.'],['Operational','<b>Availability charge</b> begins as units enter service.'],['Indexed','<b>Charge indexation</b> tracks inflation in reais.'],['Light FM','<b>Non-pedagogical services</b> run by the partner; teaching stays public.'],['Long-term','<b>Hand-back</b> of the network at concession end.']],
    calcNote:'A working model of a <b>municipal schools PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; the floor binds when availability is high. The cost of debt is higher to reflect emerging-market municipal rates, so a strong contracted number nets down once discounted. Figures are illustrative.',
    s6:'Belo Horizonte is a contracted schools annuity at an EM discount rate. What drives it:',
    breakers:['<b>Availability</b>, the charge is for units available and serviced; deductions bite below the threshold.','<b>Contracted charge</b>, the indexed payment, not enrolment, sets the revenue.','<b>Municipality &amp; currency</b>, Brazilian municipal credit and the real set the discount rate.','<b>FM delivery</b>, keeping a network of units available and serviced is the operational risk.'],
    src:'Figures from public sources on the Belo Horizonte municipal schools PPP and Brazilian social-infrastructure PPPs: municipal and project disclosure. As an emerging-market PPP, all figures here are approximate and illustrative.',
    econ:{cur:'R$', host:'municipality', volt:'creches &amp; schools',
      placesDef:14000,placesMin:4000,placesMax:30000,placesStep:500, chargeDef:2600,chargeMin:1400,chargeMax:4400,chargeStep:50,
      availDef:97,availMin:84,availMax:100,availStep:1, fmPerPlace:760, fixedOM:4},
    calc:{build:280,grant:46,capex:2.5,revG:3,floor:18,cap:60,tax:30,exit:9,lev:4,rd:9,amort:4,hold:20},
    map:{footer:GEO.belo.footer}
  },

  /* ---------- 4 · NSW SCHOOLS PPP (Oceania · bundled availability PPP) ---------- */
  nsw:{
    name:'NSW schools PPP', geo:'New South Wales, Australia', continent:'Oceania', cur:'A$', geoKey:'nsw',
    lede:'An Australian <b>bundled new-schools PPP</b>, a consortium finances, builds and maintains a batch of new schools, and the state pays a contracted availability charge for keeping them available, with no demand risk.',
    s1:'<p class="body">New South Wales delivers batches of new schools through <b>availability PPPs</b>: a private consortium finances, builds and maintains a <b>bundle of new schools</b> over a long term, and the state education authority pays a contracted <b>availability charge</b> for each year the schools are available and fit to teach in. The consortium provides the buildings and facilities; teaching stays public.</p>'+
       '<p class="body">It is the cleanest form of the schools annuity. The consortium takes <b>no demand risk</b>, enrolment is the state\'s, and earns an indexed availability charge over a 25-30 year term, with <b>deductions</b> for unavailable or under-performing buildings. Backed by a strong <b>investment-grade government offtaker</b> and denominated in Australian dollars, it is a low-risk, fully contracted, inflation-linked cash flow, the kind of social-infrastructure asset that anchors a core portfolio.</p>',
    facts:[['Availability PPP','Structure','finance · build · maintain'],['Bundled','Delivery','batch of new schools'],['No demand risk','Payment','government pays availability'],['Gov offtaker','Counterparty','investment-grade'],['25-30yr','Term','indexed charge'],['Consortium','Owner','infra-backed PPP']],
    s2:'Picture a campus of new schools, the buildings lit and available, sports pitch and bus drop-off alongside. The consortium\'s <b style="color:#0c6b4f">return</b> is the <b>availability charge on every available place</b>, contracted, indexed, government-backed, with deductions for unavailability. Drag the places, the charge and the availability, a core, fully contracted annuity with no demand risk.',
    driverLab:'Charge / place', availLab:'Availability', hrK:'Availability charge', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load NSW schools',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the charge sit flat at the contracted level, the government pays for schools kept <b>available and fit to teach</b>, so once you clear the threshold the revenue is locked. Drop availability below it and deductions bite. With an investment-grade government offtaker, the discount rate is low: this is what a core, contracted social-infrastructure cash flow looks like.',
    s3:'The consortium earns a contracted, indexed <b>availability charge</b> for keeping the bundle of schools available and fit to teach in, with <b>deductions</b> for unavailable or under-performing buildings. There is <b>no demand risk</b>, enrolment is the state\'s. So the income is a clean, fully contracted annuity backed by an <b>investment-grade government</b> offtaker, set by the places, the charge per place and availability. Low risk, long term, indexed, the core social-infrastructure archetype.',
    mb:{tag:'Model B · availability PPP', title:'Government-backed schools availability', body:'A bundled schools PPP in which a consortium finances, builds and maintains a batch of new schools and the government pays a contracted, indexed availability charge for keeping them available, no demand risk, an investment-grade offtaker, light FM, deductions for unavailability. The core social-infrastructure annuity. <b>This is a NSW schools PPP</b>.'},
    s4a:'The consortium carries the <b>facilities-management</b> obligation over the term, cleaning, caretaking, grounds and <b>lifecycle renewal</b> across the bundle, plus admin, sized so the availability charge covers it at a contracted margin. Because the offtaker is investment-grade and the charge is locked, the margin is steady. The defining feature is not the cost line but the <b>contracted, indexed charge</b> and the low discount rate a government offtaker permits.',
    wfNote:'Operating cost is the facilities management of the bundle, cleaning, caretaking, grounds and periodic lifecycle renewal, plus admin, sized against a contracted charge. For simple daytime buildings it is light; the value sits in the indexed, government-backed availability charge, not the cost line.',
    s4b:'The capital is the <b>bundle of school buildings</b>, financed by the consortium and recovered over the long term. A <b>government contribution</b> may fund a portion, but the consortium funds the bulk and recovers it through the availability charge. Backed by an investment-grade offtaker and a contracted, indexed cash flow, it gears well, a low-risk, long-life annuity.',
    stackH:'The capital · the school buildings', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',20,'Government contribution'],['s2',80,'Consortium capital']],
    finList:[['','Assets','bundle of new schools'],['sub','Structure','availability PPP'],['','Revenue','indexed availability charge'],['sub','Offtaker','investment-grade government'],['','Demand risk','none'],['rest','Owner','infra-backed consortium']],
    finNote:'A government-backed schools PPP is the <b>core social-infrastructure annuity</b>: an indexed availability charge for keeping a bundle of schools available, no demand risk, an investment-grade offtaker, light FM. It gears well and prices tight; the residual risk is availability deductions and lifecycle delivery.',
    timeline:[['2017','<b>NSW schools PPP</b> bundles new schools into an availability partnership.'],['2019','<b>First schools</b> reach completion and open.'],['Operational','<b>Availability charge</b> over the 25-30 year maintenance term.'],['Indexed','<b>Charge indexation</b> tracks inflation.'],['Secondary','<b>Bundles trade</b> to infrastructure investors at a repriced yield.'],['Hand-back','<b>Schools returned</b> to the state in defined condition.']],
    calcNote:'A working model of a <b>government-backed schools PPP</b>. Revenue is the contracted, indexed availability charge; the floor binds when availability is high, so revenue is flat (no demand risk). A low cost of debt and high gearing reflect an investment-grade government offtaker.',
    s6:'A NSW schools PPP is the core, contracted social-infrastructure annuity. What drives it:',
    breakers:['<b>Availability</b>, the charge is paid for schools available and fit to teach; deductions bite below the threshold.','<b>Government offtaker</b>, an investment-grade counterparty keeps the discount rate low and gearing high.','<b>Indexation</b>, the inflation-linked charge protects the real return over a long term.','<b>Lifecycle delivery</b>, keeping the bundle maintained over decades is the operational risk.'],
    src:'Figures from public sources on Australian schools availability PPPs (New South Wales and Victorian new-schools partnerships): state and project disclosure. The figures are approximate and illustrative.',
    econ:{cur:'A$', host:'state authority', volt:'new schools',
      placesDef:10000,placesMin:2500,placesMax:24000,placesStep:500, chargeDef:2400,chargeMin:1200,chargeMax:4000,chargeStep:50,
      availDef:99,availMin:88,availMax:100,availStep:1, fmPerPlace:600, fixedOM:4},
    calc:{build:320,grant:70,capex:2,revG:2.5,floor:13,cap:50,tax:30,exit:15,lev:5,rd:5,amort:4,hold:25},
    map:{footer:GEO.nsw.footer}
  },

  /* ---------- 5 · GULF / EGYPT SCHOOLS PPP (Middle East · emerging programme) ---------- */
  egypt:{
    name:'Egypt / Gulf schools PPP', geo:'Egypt · Gulf region', continent:'Middle East', cur:'US$', geoKey:'egypt',
    lede:'An emerging Middle Eastern <b>schools-PPP programme</b>, a private partner builds and maintains a batch of new schools under an availability concession, paid for keeping them available, with no demand risk.',
    s1:'<p class="body">Across the Gulf and in <b>Egypt</b>, governments have begun to deliver new schools through <b>availability PPPs</b>: a private partner designs, builds, finances and maintains a <b>batch of new schools</b>, and the state pays a contracted <b>availability charge</b> for keeping them available and fit for use. It applies the established schools-PPP model to a fast-growing, young population that needs new capacity quickly. (Flag and figures here are illustrative.)</p>'+
       '<p class="body">The economics mirror a schools availability PPP, with a <b>state-backed</b> twist: the counterparty is a sovereign or sovereign-backed government, so the cost of capital is moderate-to-low and the payment is secure. The partner takes <b>no demand risk</b>, enrolment is the state\'s, and earns an indexed charge for keeping the batch available, with <b>deductions</b> for unavailability. New, standardised buildings, light FM, and a contracted annuity in an emerging programme.</p>',
    facts:[['Schools PPP','Structure','build &amp; maintain'],['Emerging','Programme','new capacity at scale'],['No demand risk','Payment','availability charge'],['State-backed','Offtaker','sovereign'],['Standardised','Design','batch delivery'],['Concession','Owner','partner consortium']],
    s2:'Picture a batch of new schools, standardised buildings, lit and available, with sports pitches and drop-offs alongside. The partner\'s <b style="color:#0c6b4f">return</b> is the <b>availability charge on every available place</b>, contracted, indexed, state-backed, with deductions for unavailability. Drag the places, the charge and the availability, a contracted annuity in an emerging schools programme.',
    driverLab:'Charge / place', availLab:'Availability', hrK:'Availability charge', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load Egypt / Gulf PPP',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the charge hold flat at the contracted level, the state pays for schools kept <b>available</b>, not for enrolment. With a sovereign-backed offtaker the discount rate is moderate, so the contracted annuity values reasonably. The operational job is keeping a batch of new buildings available; deductions bite if it is not.',
    s3:'The partner earns a contracted, indexed <b>availability charge</b> for keeping the batch of schools available and fit for use, with <b>deductions</b> for unavailability, and takes <b>no demand risk</b>. The counterparty is a <b>sovereign-backed</b> government, so the payment is secure and the cost of capital moderate. The income is a fully contracted availability annuity on new, standardised buildings, set by the places, the charge per place and availability.',
    mb:{tag:'Model B · emerging schools PPP', title:'State-backed schools availability', body:'A schools availability PPP in which a partner builds and maintains a batch of new schools and is paid a contracted, indexed availability charge by a sovereign-backed government, no demand risk, light FM, deductions for unavailability. The established model applied to an emerging, fast-growing programme. <b>This is an Egypt / Gulf schools PPP</b>.'},
    s4a:'The partner carries the <b>facilities-management</b> obligation over the term, cleaning, caretaking, grounds and <b>lifecycle renewal</b> across a batch of standardised schools, plus admin. New buildings and standard designs make the FM efficient, and for schools it is <b>light</b>. The charge is set to cover it; with a sovereign offtaker the margin is steady. The defining feature is the <b>contracted charge and the cost of capital</b>, not the cost line.',
    wfNote:'Operating cost is the light facilities management across a batch of new, standardised schools, cleaning, caretaking, grounds and lifecycle renewal, plus admin. New buildings make it efficient; the charge covers it at a contracted margin, and the value sits in the indexed, state-backed availability charge.',
    s4b:'The capital is the <b>batch of new school buildings</b>, procured at scale to a standard design. As an emerging state programme a <b>public contribution</b> may fund part, with the partner financing the balance and recovering it through the availability charge. Backed by a sovereign counterparty, the cash flow is contracted and indexed at a moderate cost of capital, a contracted annuity in a growing programme.',
    stackH:'The capital · the school buildings', splitL:'Who funds the build', splitR:'state-backed',
    split:[['s1',30,'Public contribution'],['s2',70,'Partner capital']],
    finList:[['','Assets','batch of new schools'],['sub','Structure','availability PPP'],['','Revenue','indexed availability charge'],['sub','Offtaker','sovereign-backed'],['','Demand risk','none'],['rest','Owner','partner consortium']],
    finNote:'An emerging schools PPP is a <b>contracted availability annuity</b>: an indexed charge for keeping a batch of new schools available, no demand risk, a sovereign-backed offtaker, light FM. The residual risk is delivery and lifecycle on a new programme, and the cost of capital sets the value.',
    timeline:[['2010s','<b>Gulf and Egyptian governments</b> pilot schools availability PPPs.'],['Programme','<b>Batches of new schools</b> procured to standard designs.'],['Operational','<b>Availability charge</b> paid for each available school year.'],['Indexed','<b>Charge indexation</b> over the concession.'],['Light FM','<b>Facilities</b> run by the partner; teaching stays public.'],['Long-term','<b>Hand-back</b> of the schools at concession end.']],
    calcNote:'A working model of a <b>state-backed schools PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; the floor binds when availability is high. A moderate cost of capital reflects a sovereign-backed emerging programme. Figures are highly illustrative.',
    s6:'An Egypt / Gulf schools PPP is a contracted, state-backed annuity. What drives it:',
    breakers:['<b>Availability</b>, the charge is paid for schools available and fit for use; deductions bite below it.','<b>Sovereign offtaker</b>, a state counterparty keeps the cost of capital moderate and the payment secure.','<b>Programme scale</b>, batching new schools to a standard design meets fast-growing demand efficiently.','<b>Delivery &amp; lifecycle</b>, building and maintaining a new programme is the operational risk.'],
    src:'Figures from public sources on emerging schools-PPP programmes in Egypt and the Gulf, and the availability-PPP model for social infrastructure. As an emerging programme, all figures here are highly approximate and illustrative; the regional framing is illustrative.',
    econ:{cur:'US$', host:'state authority', volt:'new schools',
      placesDef:11000,placesMin:3000,placesMax:26000,placesStep:500, chargeDef:1500,chargeMin:800,chargeMax:2800,chargeStep:50,
      availDef:98,availMin:86,availMax:100,availStep:1, fmPerPlace:380, fixedOM:3},
    calc:{build:185,grant:50,capex:2.5,revG:2.5,floor:11,cap:38,tax:22,exit:11,lev:4.5,rd:7,amort:4,hold:23},
    map:{footer:GEO.egypt.footer}
  },

  /* ---------- 6 · CHINESE SCHOOLS PPP (China · illustrative social capital) ---------- */
  china:{
    name:'Chinese schools PPP', geo:'China', continent:'China', cur:'¥', geoKey:'china',
    lede:'An illustrative Chinese <b>social-capital schools PPP</b>, a partner builds and maintains a batch of schools, paid through an availability-style payment by a local government, with no demand risk.',
    s1:'<p class="body">China has used <b>public-private partnerships</b> to mobilise <b>social capital</b> for public facilities, including <b>schools</b>: a private partner builds and maintains a batch of school buildings, and the local government pays an <b>availability-style payment</b> over the contract term for keeping them available and serviced. The buildings and facilities are provided by the partner; teaching stays public. (Figures here are illustrative.)</p>'+
       '<p class="body">The economics mirror a schools availability PPP, at a very <b>low cost of capital</b>: the counterparty is a local government and the partner is often state-linked, so the payment is secure and financing cheap. The partner takes <b>no demand risk</b>, enrolment is the government\'s, and earns an indexed payment for keeping the batch available, with <b>deductions</b> for unavailability. Standardised buildings at scale, light FM, and a contracted annuity funded cheaply.</p>',
    facts:[['Social capital','Structure','PPP for public schools'],['Bundled','Delivery','batch at scale'],['No demand risk','Payment','availability-style'],['Local gov','Offtaker','government counterparty'],['Light FM','Service','non-pedagogical'],['Low CoC','Funding','state-linked']],
    s2:'Picture a batch of standardised schools, buildings lit and available, sports pitches and drop-offs alongside. The partner\'s <b style="color:#0c6b4f">return</b> is the <b>availability-style payment on every available place</b>, contracted, indexed, government-backed, with deductions for unavailability. Drag the places, the charge and the availability, a contracted annuity funded at a low cost of capital.',
    driverLab:'Charge / place', availLab:'Availability', hrK:'Availability payment', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ indexation',c:'− FM'}, demandLabel:'AVAILABILITY',
    preset:'Load China schools PPP',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the payment hold flat at the contracted level, the government pays for schools kept <b>available</b>, not for enrolment. With a state-linked partner and a low cost of capital, the contracted annuity values richly. Push the <b>places</b> slider and the batch scales; the operational job is keeping the buildings available.',
    s3:'The partner earns a contracted, indexed <b>availability-style payment</b> for keeping the batch of schools available and serviced, with <b>deductions</b> for unavailability, and takes <b>no demand risk</b>. The counterparty is a <b>local government</b> and financing is cheap, so the payment is secure and the cost of capital low. The income is a fully contracted availability annuity on standardised buildings, set by the places, the charge per place and availability.',
    mb:{tag:'Model B · social-capital PPP', title:'Low-cost-of-capital schools PPP', body:'A schools PPP in which a state-linked partner builds and maintains a batch of standardised schools and is paid a contracted, indexed availability-style payment by a local government, no demand risk, light FM, deductions for unavailability, and a very low cost of capital. A contracted annuity funded cheaply. <b>This is an illustrative Chinese schools PPP</b>.'},
    s4a:'The partner carries the <b>facilities-management</b> obligation, cleaning, caretaking, security, grounds and <b>lifecycle renewal</b> across a batch of standardised schools, plus admin. Standard designs at scale make the FM efficient, and for schools it is <b>light</b>. With a government counterparty the margin is steady. The defining feature is the <b>contracted payment and the low cost of capital</b>, not the cost line.',
    wfNote:'Operating cost is the light facilities management across a batch of standardised schools, cleaning, caretaking, security, grounds and lifecycle renewal, plus admin. Standard designs at scale make it efficient; the payment covers it at a contracted margin, and the value sits in the indexed, government-backed payment.',
    s4b:'The capital is the <b>batch of school buildings</b>, procured at scale to standard designs. A <b>government contribution</b> may fund part, with the state-linked partner financing the balance cheaply and recovering it through the availability payment. Backed by a government counterparty at a low cost of capital, the cash flow is contracted and indexed, a large, secure annuity funded cheaply.',
    stackH:'The capital · the school buildings', splitL:'Who funds the build', splitR:'low CoC',
    split:[['s1',35,'Government contribution'],['s2',65,'Partner capital']],
    finList:[['','Assets','batch of standardised schools'],['sub','Structure','social-capital PPP'],['','Revenue','indexed availability payment'],['sub','Offtaker','local government'],['','Cost of capital','low (state-linked)'],['rest','Owner','partner consortium']],
    finNote:'A Chinese schools PPP is a <b>contracted availability annuity at a low cost of capital</b>: an indexed payment for keeping a batch of schools available, no demand risk, a government offtaker, light FM. The return is steady; the risks are delivery, lifecycle and government direction.',
    timeline:[['2014','<b>PPP reform</b> opens public facilities, including schools, to social capital.'],['2010s','<b>Schools PPPs</b> deliver batches of standardised buildings.'],['Operational','<b>Availability-style payment</b> for keeping the batch available.'],['Indexed','<b>Payment indexation</b> over the contract term.'],['Light FM','<b>Facilities</b> run by the partner; teaching stays public.'],['Long-term','<b>Hand-back</b> of the schools at term end.']],
    calcNote:'A working model of a <b>social-capital schools PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability payment; the floor binds when availability is high. A low cost of debt reflects a government counterparty and state-linked partner. Figures are highly illustrative.',
    s6:'A Chinese schools PPP is a contracted annuity funded cheaply. What drives it:',
    breakers:['<b>Availability</b>, the payment is for schools available and serviced; deductions bite below it.','<b>Cost of capital</b>, a low state-linked financing rate is what makes the contracted annuity value richly.','<b>Programme scale</b>, batching standardised schools meets demand efficiently.','<b>Government direction</b>, policy and the local-government counterparty, not enrolment, set the strategy.'],
    src:'Figures from public sources and reporting on Chinese PPPs for public facilities and social-capital schools. Given the scale and limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', host:'local government', volt:'standardised schools',
      placesDef:16000,placesMin:5000,placesMax:34000,placesStep:500, chargeDef:5200,chargeMin:2800,chargeMax:8800,chargeStep:100,
      availDef:99,availMin:88,availMax:100,availStep:1, fmPerPlace:1500, fixedOM:8},
    calc:{build:1050,grant:300,capex:2,revG:3,floor:34,cap:120,tax:25,exit:10,lev:4,rd:4,amort:4,hold:22},
    map:{footer:GEO.china.footer}
  }
  };
  var ORDER=['ukbsf','alberta','belo','nsw','egypt','china'];

  /* ===================================================================
     SCHOOL-CAMPUS RENDERER  (canvas, 720x520), top-down / elevation, daytime
     A school campus (or a small cluster representing a bundle): one or two school
     buildings with rows of lit classroom windows, a playground / sports pitch (a
     green field with markings), a covered entrance and a small bus drop-off, plus
     a local-authority icon that pays the availability fee. The buildings are
     "available" and lit; high availability = fully lit; dropping availability dims
     classrooms and raises a deduction marker.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  /* ---- campus geometry ---- */
  var PITCH={x:300,y:300,w:300,h:170};            // sports pitch / playground (green field)
  var AUTH={x:40,y:300,w:118,h:96};               // local-authority icon (pays the fee)
  var BLD=[                                        // school buildings (rows of classroom windows)
    {x:300,y:120,w:300,h:120, cols:7, rows:2},     // main school block
    {x:300,y:120,w:300,h:120, cols:5, rows:1}       // second block (bundle), placed at draw time
  ];
  var DOOR={x:430,y:240,w:46,h:14};               // covered entrance
  // per-asset classroom slots (built once per asset)
  var WINS=[], NWIN=0;
  function layout(){
    WINS=[];
    // main block: a grid of classroom windows
    var b=BLD[0], padX=20, padY=22, gw=(b.w-2*padX)/b.cols, gh=(b.h-2*padY)/b.rows;
    for(var r=0;r<b.rows;r++) for(var c=0;c<b.cols;c++){
      WINS.push({x:b.x+padX+c*gw+6, y:b.y+padY+r*gh+6, w:gw-12, h:gh-12, ph:((r*5+c*3)%10)*0.6});
    }
    NWIN=WINS.length;
  }

  /* ---- base map: campus ground + paths ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e6eadf'); g.addColorStop(1,'#dde3d2');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // campus apron / hard standing under the buildings
    ctx.fillStyle='rgba(150,150,140,0.12)';
    rr(280,96,340,170,14); ctx.fill();
    // a path connecting the authority to the campus
    ctx.strokeStyle='rgba(140,135,120,0.4)'; ctx.lineWidth=6; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(AUTH.x+AUTH.w,AUTH.y+AUTH.h/2); ctx.quadraticCurveTo(240,300,300,232); ctx.stroke();
    // bus drop-off lane along the bottom of the campus
    ctx.fillStyle='rgba(120,120,110,0.16)'; rr(280,250,300,22,6); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.4; ctx.setLineDash([10,8]); ctx.lineDashOffset=-(T*0.4);
    ctx.beginPath(); ctx.moveTo(284,261); ctx.lineTo(576,261); ctx.stroke(); ctx.setLineDash([]);
  }

  /* ---- sports pitch / playground (green field with markings) ---- */
  function pitch(){
    var p=PITCH;
    ctx.fillStyle='rgba(20,40,25,0.10)'; rr(p.x+4,p.y+p.h-4,p.w,8,6); ctx.fill();
    var g=ctx.createLinearGradient(p.x,p.y,p.x,p.y+p.h); g.addColorStop(0,'#7fb069'); g.addColorStop(1,'#5d9150');
    ctx.fillStyle=g; rr(p.x,p.y,p.w,p.h,10); ctx.fill();
    // mown stripes
    ctx.fillStyle='rgba(255,255,255,0.06)';
    for(var sx=p.x;sx<p.x+p.w;sx+=30){ rr(sx,p.y,15,p.h,0); ctx.fill(); }
    // pitch markings
    ctx.strokeStyle='rgba(255,255,255,0.75)'; ctx.lineWidth=1.6;
    rr(p.x+12,p.y+12,p.w-24,p.h-24,4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p.x+p.w/2,p.y+12); ctx.lineTo(p.x+p.w/2,p.y+p.h-12); ctx.stroke();
    ctx.beginPath(); ctx.arc(p.x+p.w/2,p.y+p.h/2,22,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('PLAYGROUND · SPORTS PITCH',p.x+p.w/2,p.y+p.h+13);
  }

  /* ---- local-authority icon (pays the availability fee) ---- */
  function authority(){
    var a=AUTH;
    ctx.fillStyle='rgba(20,30,25,0.12)'; rr(a.x+4,a.y+a.h-5,a.w,8,4); ctx.fill();
    var g=ctx.createLinearGradient(a.x,a.y,a.x,a.y+a.h); g.addColorStop(0,'#d6dae0'); g.addColorStop(1,'#c2c8d0');
    ctx.fillStyle=g; rr(a.x,a.y+18,a.w,a.h-18,5); ctx.fill();
    ctx.strokeStyle='rgba(110,120,130,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // pediment + columns (a civic / town-hall look)
    ctx.fillStyle='#ccd2da'; ctx.beginPath();
    ctx.moveTo(a.x+6,a.y+18); ctx.lineTo(a.x+a.w/2,a.y+2); ctx.lineTo(a.x+a.w-6,a.y+18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(110,120,130,0.5)'; ctx.stroke();
    ctx.fillStyle='rgba(150,158,168,0.7)';
    for(var cx=a.x+14;cx<a.x+a.w-12;cx+=20){ rr(cx,a.y+26,6,a.h-40,1); ctx.fill(); }
    ctx.fillStyle='rgba(70,80,90,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('LOCAL AUTHORITY',a.x+a.w/2,a.y+a.h+12);
    ctx.fillStyle='rgba(47,125,84,0.8)'; ctx.font='700 7px Inter,sans-serif';
    ctx.fillText('pays availability fee',a.x+a.w/2,a.y+a.h+22);
  }

  /* ---- a school building: a block with rows of classroom windows ---- */
  function building(b,livery,litFrac,running){
    // shadow + body
    ctx.fillStyle='rgba(20,30,25,0.14)'; rr(b.x+5,b.y+b.h-5,b.w,9,5); ctx.fill();
    var bg=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h);
    bg.addColorStop(0,shade(livery,1.05)); bg.addColorStop(1,shade(livery,0.78));
    ctx.fillStyle=bg; rr(b.x,b.y,b.w,b.h,7); ctx.fill();
    ctx.strokeStyle='rgba(40,50,45,0.28)'; ctx.lineWidth=1; ctx.stroke();
    // flat-roof parapet line
    ctx.strokeStyle='rgba(255,255,255,0.22)'; ctx.lineWidth=1; ctx.beginPath();
    ctx.moveTo(b.x+4,b.y+6); ctx.lineTo(b.x+b.w-4,b.y+6); ctx.stroke();
    return b;
  }
  function classroomWindows(litFrac){
    // draw the classroom windows; lit fraction follows availability
    var litN=Math.round(NWIN*litFrac);
    for(var i=0;i<NWIN;i++){
      var w=WINS[i], lit=i<litN;
      ctx.fillStyle=lit?'rgba(255,221,140,0.92)':'rgba(120,132,128,0.55)';
      rr(w.x,w.y,w.w,w.h,2); ctx.fill();
      // window mullions
      ctx.strokeStyle='rgba(60,60,55,0.30)'; ctx.lineWidth=0.7;
      ctx.beginPath(); ctx.moveTo(w.x+w.w/2,w.y); ctx.lineTo(w.x+w.w/2,w.y+w.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w.x,w.y+w.h/2); ctx.lineTo(w.x+w.w,w.y+w.h/2); ctx.stroke();
      if(lit && Math.sin(T*0.06+w.ph)>0.4) glow(w.x+w.w/2,w.y+w.h/2,7,'rgba(255,210,120,0.30)');
    }
  }
  function entrance(){
    var d=DOOR;
    ctx.fillStyle='rgba(70,80,75,0.7)'; rr(d.x-4,d.y-2,d.w+8,5,2); ctx.fill();   // canopy
    ctx.fillStyle='rgba(40,50,45,0.6)'; rr(d.x,d.y,d.w,d.h,2); ctx.fill();        // doorway
    ctx.fillStyle='rgba(255,221,140,0.7)'; rr(d.x+4,d.y+3,d.w-8,d.h-6,1); ctx.fill();
    ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('COVERED ENTRANCE',d.x+d.w/2,d.y+d.h+10);
  }
  function bus(x,y,livery){
    ctx.fillStyle='rgba(20,30,25,0.16)'; rr(x+2,y+9,40,5,2); ctx.fill();
    ctx.fillStyle='#f0c419'; rr(x,y,40,12,3); ctx.fill();                          // yellow school bus
    ctx.fillStyle='rgba(225,240,255,0.9)'; for(var w=x+4;w<x+34;w+=8){ rr(w,y+2,5,4,1); ctx.fill(); }
    ctx.fillStyle='rgba(40,40,40,0.7)'; ctx.beginPath(); ctx.arc(x+9,y+12,2.6,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+31,y+12,2.6,0,Math.PI*2); ctx.fill();
  }
  function shade(hex,f){ var c=hex.replace('#',''); if(c.length===3)c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    var r=Math.min(255,Math.round(parseInt(c.substr(0,2),16)*f)), gg=Math.min(255,Math.round(parseInt(c.substr(2,2),16)*f)), b=Math.min(255,Math.round(parseInt(c.substr(4,2),16)*f));
    return 'rgb('+r+','+gg+','+b+')'; }

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
  /* ---- live availability sparkline ---- */
  function drawDemand(occ){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'AVAILABILITY';
    ctx.save(); ctx.fillStyle='rgba(255,255,255,0.88)'; ctx.strokeStyle='rgba(120,140,130,0.35)'; ctx.lineWidth=1; rr(px,py,pw,ph,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle='rgba(90,102,96,0.95)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(label,px+11,py+14);
    ctx.fillStyle='rgba(47,125,84,0.95)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(Math.round(occ*100)+'%',px+pw-11,py+14);
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
    var places=parseFloat(sCap.value), charge=parseFloat(sSpread.value), avail=parseFloat(sAvail.value)/100;

    ctx.clearRect(0,0,W,H);
    drawMap();
    pitch();
    authority();

    // ---- the school campus: building(s) with lit classroom windows ----
    var litFrac=Math.max(0,Math.min(1,avail));
    var bundle=G.bundle;
    // second block to represent a bundle (smaller, set behind/right)
    if(bundle){ building({x:300,y:96,w:300,h:20},G.livery,litFrac,true); }   // ridge of a second block
    building(BLD[0],G.livery,litFrac,true);
    classroomWindows(litFrac);
    entrance();
    bus(300,250,G.livery);

    // school label
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('SCHOOL CAMPUS'+(bundle?' · BUNDLE':''),BLD[0].x,BLD[0].y-8); ctx.restore();

    // deduction marker when availability is below full
    if(litFrac<0.995){
      var dmx=BLD[0].x+BLD[0].w-70, dmy=BLD[0].y+8;
      ctx.save(); ctx.fillStyle='rgba(188,71,51,0.92)'; rr(dmx,dmy,64,16,4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('− DEDUCTION',dmx+32,dmy+11); ctx.restore();
    }
    // new-school / batch-2 marker if the programme is still growing
    if(G.growing){
      var nx=600, ny=120;
      ctx.save(); ctx.setLineDash([4,3]); ctx.strokeStyle='rgba(47,125,84,0.7)'; ctx.lineWidth=1.4;
      rr(nx,ny,86,54,8); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='rgba(47,125,84,0.92)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText(bundle?'+ BATCH 2':'+ NEW SCHOOL',nx+43,ny+30); ctx.restore();
    }

    // ---- economics (the availability PPP / PFI: a contracted government annuity) ----
    var revenue=places*charge*avail;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));       // floor = contracted minimum (NO demand risk)
    var opex= places*(E.fmPerPlace||0) + (E.fixedOM||0)*1e6;   // light FM (cleaning, caretaking, lifecycle)
    var ebitda=revenue-opex;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // waterfall opex rows
    var c_clean=opex*0.30, c_care=opex*0.24, c_life=opex*0.32, c_admin=opex*0.14;
    // share of "+cash" that is contracted/floor vs indexation/amber slice
    var floorBinds = floor>0 && revenue<=floor+1;
    var contractShare = floorBinds ? Math.min(0.5, floor/Math.max(1,revenue)) : 0.20;

    // money-flow: +cash (availability) rises from the authority; amber indexation; −cash FM drain
    if(_anim){
      if(Math.random()<0.7){ spawnCoin(AUTH.x+AUTH.w*0.5,AUTH.y+10, Math.random()<contractShare?'rec':'ret', -1); }
      var sx=BLD[0].x+BLD[0].w*0.5; if(Math.random()<Math.max(0.1,Math.min(0.5, opex/Math.max(1,revenue)))) spawnCoin(sx,BLD[0].y+BLD[0].h-10,'cost',1);
      demHist.push(Math.max(0,Math.min(1,avail))); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(Math.max(0,Math.min(1,avail)));

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+kfmt(places)+' places',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',kfmt(places)+' places'); set('ixSpreadV',CUR+kfmt(charge)+'/place'); set('ixAvailV',Math.round(avail*100)+'%');
    set('ixDir',kfmt(places)+' places'); set('ixDirS','contracted bundle · '+E.volt);
    set('ixMW',Math.round(avail*100)+'% available'); set('ixMWs','availability payment · '+(G.host||'authority'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Cleaning &amp; grounds',c_clean],['Caretaking',c_care],['Lifecycle renewal',c_life],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the bundle is too thin to value, raise the places, the unitary charge or the availability.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Gross build cost</span> <b>'+money(capexGrossG)+'</b></span>'+
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
    sCap.min=E.placesMin; sCap.max=E.placesMax; sCap.step=E.placesStep; sCap.value=E.placesDef;
    sSpread.min=E.chargeMin; sSpread.max=E.chargeMax; sSpread.step=E.chargeStep; sSpread.value=E.chargeDef;
    sAvail.min=E.availMin; sAvail.max=E.availMax; sAvail.step=E.availStep; sAvail.value=E.availDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue is a contracted government annuity (pupil places × unitary charge × availability) with no demand risk, floored at the contracted minimum, and the returns model is a simplified DCF in which a public contribution offsets the capital cost; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.placesDef; sSpread.value=E.chargeDef; sAvail.value=E.availDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'ukbsf');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
