/* Prisons / custodial facilities (PPP) — data-driven worked examples.
   Six real custodial estates (PFI/DBFO, availability PPPs, private corrections and a
   state-run contrast), one template. Scene config from pr-geo.js (GEO), drawn as a
   top-down custodial facility in a 720x520 scene: a secure double perimeter enclosing
   cell-block wings radiating from a central control hub, a gatehouse, watch towers,
   an exercise yard and an FM/services building. The interactive figures are
   illustrative: revenue is a contracted government availability annuity (places ×
   fee per place × availability), most of it contracted/floored with no demand risk,
   and the returns model is a simplified DCF in which a public contribution offsets
   part of the secure construction cost. */
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

  /* ---------- 1 · UK CUSTODIAL PFI/DBFO (Europe · operator-run, unitary charge) ---------- */
  ukdbfo:{
    name:'UK custodial PFI/DBFO', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'ukdbfo',
    lede:'A textbook <b>custodial PFI/DBFO</b> — a private consortium designs, builds, finances and operates a prison under a long government contract, earning an indexed <b>unitary charge per available place</b> for ~25-30 years, with no demand risk.',
    s1:'<p class="body">When the UK began procuring prisons privately, several were delivered as <b>design-build-finance-operate (DBFO)</b> projects under the Private Finance Initiative. A consortium — typically an investor plus a custodial operator such as a Serco- or G4S-style firm — <b>builds the secure estate, finances it, maintains it and runs the custodial services</b>, and the Ministry of Justice pays a single, indexed <b>unitary charge</b> for the contract life.</p>'+
       '<p class="body">The economics are a <b>contracted government annuity</b>. The charge is paid <b>per available place</b> — a place kept secure, staffed and fit for use — and is reduced by <b>deductions</b> for unavailability or performance failures. Revenue does <b>not</b> depend on the prisoner population: it is availability, not occupancy. Because the operator also runs custodial services, the cost line is heavy — staffing dominates — so the margin is lower than a pure estate PPP, but the income is long, government-backed and inflation-linked.</p>',
    facts:[['DBFO','Structure','build-finance-operate'],['Per place','Charge','availability + operating'],['25-30yr','Contract','long, indexed'],['No demand risk','Revenue','availability, not occupancy'],['Operator-run','Services','staff-heavy opex'],['Deductions','Risk','unavailability / failure']],
    s2:'Watch the facility. The <b>cell-block wings</b> radiate from the central hub inside a <b>secure double perimeter</b>; when a wing is available it is lit and operational. The operator\'s <b style="color:#0c6b4f">money</b> is the <b>unitary charge on every available place</b> — so the engine is the number of places, the fee per place and how much of the estate is available, not how many prisoners are held. Drag the places, the fee per place and the availability.',
    driverLab:'Fee per place', availLab:'Availability', hrK:'Contract revenue', yrS:'places × fee × availability',
    ledge:{a:'+ availability',b:'+ operating fee',c:'− FM & staff'}, demandLabel:'AVAILABILITY',
    preset:'Load UK DBFO',
    try:'<b>Try this:</b> drop the <b>availability</b> and watch the contract revenue fall — a custodial PFI is paid on places kept <b>available and fit for use</b>, and deductions bite when a wing is out. Then remember the trick: an estate built once earns an <b>indexed unitary charge for decades</b>, with no demand risk — but because the operator runs custodial services, the staff cost is the heavy line, so the margin is lower than a bare availability hospital or school.',
    s3:'The consortium earns a <b>unitary charge per available place</b>, paid by the Ministry of Justice for every place kept secure, staffed and fit for use, indexed to inflation, with <b>deductions</b> for unavailability and performance failures. There is <b>no demand risk</b> — the charge does not vary with the prisoner count. Because this is a <b>DBFO</b>, the consortium also carries the <b>custodial operations</b>, so the cost line is staff-heavy and the margin lower than a pure estate PPP. The return is the spread between a long, contracted, indexed income and the cost of building and running a secure estate.',
    mb:{tag:'Model B · operated custodial DBFO', title:'Design-build-finance-operate prison', body:'A consortium builds, finances, maintains and runs a prison and is paid an indexed unitary charge per available place — no demand risk, deductions for unavailability and performance failure. Because custodial operations are bundled, staffing dominates the cost line, so the margin is lower than a pure availability PPP. <b>This is a UK custodial PFI/DBFO</b>.'},
    s4a:'An operated custodial DBFO carries a <b>heavy cost line</b>: custodial and operational <b>staffing</b> dominates, on top of facilities management, lifecycle maintenance and security systems. Staffing a secure estate around the clock is the largest single cost, so the margin is healthy but well below a pure estate PPP. The defining number is not any one cost but the <b>places and their availability</b>: each available place is a contracted, indexed annuity, with deductions behind it.',
    wfNote:'Operating cost is dominated by <b>custodial and operational staffing</b> — a secure estate must be staffed around the clock — plus facilities management, lifecycle maintenance and security systems. Where the operator runs custodial services, this staff cost is a much larger share than in a pure availability hospital or school, so the margin is lower; the value is the contracted, indexed charge.',
    s4b:'The capital is the <b>secure estate</b> — the perimeter, cell blocks, control systems and support buildings, built to a custodial standard at a high cost per place. A <b>public contribution</b> may offset part of the build, with the consortium financing the balance and recovering it through the unitary charge. That is the model: a large upfront secure construction turned into a long, contracted, indexed government annuity, with no demand risk.',
    stackH:'The capital · the secure estate', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',15,'Public contribution'],['s2',85,'Consortium capital']],
    finList:[['','Estate','secure custodial facility'],['sub','Structure','DBFO (operated)'],['','Revenue','unitary charge per available place'],['sub','Demand risk','none (availability)'],['','Key risk','performance deductions &amp; contract renewal'],['rest','Owner','PPP consortium']],
    finNote:'An operated custodial DBFO is a <b>contracted government annuity on a secure estate</b>: an indexed charge per available place over a long contract, with no demand risk. Because custodial operations are bundled, the margin is lower than a pure estate PPP. The risks are performance deductions, contract renewal and the political/ESG sensitivity of the asset class.',
    timeline:[['1990s','<b>First UK private prisons</b> procured under the PFI as DBFO contracts.'],['2000s','<b>Operator-run estates</b> open — build, finance, maintain and operate bundled.'],['2010s','<b>Unitary charges</b> paid and indexed over the contract; performance regimes tightened.'],['2010s','<b>Re-competition</b> of some operating contracts tests renewal risk.'],['2020s','<b>ESG scrutiny</b> of private custody raises headline and reputational risk.'],['Ongoing','<b>Hand-back</b> of the estate at contract end.']],
    calcNote:'A working model of an <b>operated custodial DBFO</b>. The build is the secure estate; a public contribution offsets part of it, so net capital is most of the build. Revenue is the indexed unitary charge over a long hold; the heavy staff cost (operations bundled) lowers the margin, and the exit multiple reflects a long, contracted, government-backed asset.',
    s6:'A UK custodial DBFO is a contracted government annuity with a heavy operating line. What moves the return:',
    breakers:['<b>Availability &amp; deductions</b> — the charge is paid on places kept fit for use; unavailability and performance failures cut it.','<b>Fee per place &amp; indexation</b> — the contracted charge per place, inflation-linked, is the income engine.','<b>Staff cost</b> — running custodial services is the heavy, partly fixed cost that sets the margin.','<b>Contract renewal &amp; ESG</b> — re-competition and the political/reputational sensitivity of private custody are the swing risks.'],
    src:'Figures from public sources on UK custodial PFI/DBFO procurement: <a href="https://www.gov.uk/government/organisations/ministry-of-justice" target="_blank" rel="noopener">Ministry of Justice</a> and <a href="https://www.nao.org.uk/" target="_blank" rel="noopener">National Audit Office</a> reporting on private prison contracts. The figures are approximate and illustrative.',
    econ:{cur:'£', host:'Ministry of Justice', volt:'operated custodial estate',
      placesDef:1000,placesMin:400,placesMax:2200,placesStep:50, chargeDef:42000,chargeMin:24000,chargeMax:70000,chargeStep:1000,
      availDef:98,availMin:80,availMax:100,availStep:1, fmPerPlace:16000, fixedOM:9},
    calc:{build:228,grant:20,capex:2.5,revG:2.5,floor:22,cap:60,tax:25,exit:11,lev:5,rd:5,amort:3,hold:16},
    map:{footer:GEO.ukdbfo.footer}
  },

  /* ---------- 2 · US PRIVATE CORRECTIONS (North America · per-diem + occupancy) ---------- */
  uscorr:{
    name:'US private corrections', geo:'United States', continent:'North America', cur:'US$', geoKey:'uscorr',
    lede:'A listed <b>private corrections</b> operator — firms like CoreCivic and the GEO Group own and run custodial facilities under a <b>per-diem</b> charge, often with an occupancy guarantee, so the revenue is more occupancy/demand-linked than a pure availability PPP.',
    s1:'<p class="body"><b>US private corrections</b> is a different shape of the same asset class. Large listed operators — historically structured as <b>REITs</b> — own and run custodial and detention facilities and are paid a <b>per-diem rate per prisoner held</b> by federal, state or local authorities. Where an availability PPP pays for places kept fit for use, the US model pays largely on <b>occupancy</b>: the number of prisoners actually held, subject in many contracts to an <b>occupancy guarantee</b> (a minimum paid floor).</p>'+
       '<p class="body">This is a useful contrast. Because revenue tracks the prisoner count, the operator carries genuine <b>demand risk</b> — policy, sentencing and immigration flows move the population, and contracts can be cancelled or not renewed. The occupancy guarantee softens this with a contracted floor, but the income is more <b>volume-linked</b> than a true availability PPP, and the operator runs the custodial services, so staffing is the heavy cost. (Figures here are illustrative.)</p>',
    facts:[['Per-diem','Charge','rate per prisoner held'],['Occupancy','Revenue','demand-linked'],['Guarantee','Floor','minimum paid in many contracts'],['Operator-run','Services','staff-heavy opex'],['REIT-listed','Owners','CoreCivic / GEO Group'],['Demand risk','Key risk','policy &amp; population']],
    s2:'Watch the facility. The <b>cell-block wings</b> radiate from the central hub inside a <b>secure double perimeter</b>; available, operational wings are lit. The operator\'s <b style="color:#0c6b4f">money</b> is the <b>per-diem on every place occupied</b> — closer to a volume charge than a fixed annuity. Drag the places, the per-diem fee and the occupancy: unlike an availability PPP, dropping the occupancy here cuts revenue toward the contracted guarantee floor.',
    driverLab:'Per-diem / place', availLab:'Occupancy', hrK:'Contract revenue', yrS:'places × per-diem × occupancy',
    ledge:{a:'+ per-diem',b:'+ guarantee',c:'− FM & staff'}, demandLabel:'OCCUPANCY',
    preset:'Load US corrections',
    try:'<b>Try this:</b> drop the <b>occupancy</b> and watch revenue fall toward the floor — unlike a pure availability PPP, the US per-diem model is paid largely on <b>prisoners held</b>, so the operator carries demand risk. The occupancy guarantee sets a contracted minimum, but policy, sentencing and immigration flows move the population. Then note the heavy staff cost: an operated estate is staffing-led.',
    s3:'The operator earns a <b>per-diem rate per prisoner held</b>, paid by the contracting authority, and in many contracts an <b>occupancy guarantee</b> sets a minimum paid level regardless of the actual count. So the income is <b>part volume, part floor</b>: above the guarantee it tracks occupancy; below it the floor binds. The operator runs the custodial services, so staffing dominates the cost. Unlike a contracted availability PPP, this carries real <b>demand and renewal risk</b> — and the political and ESG sensitivity is acute.',
    mb:{tag:'Model B · per-diem corrections', title:'Listed private corrections operator', body:'An operator that owns and runs custodial facilities and is paid a per-diem rate per prisoner held, often with an occupancy guarantee as a contracted floor — so revenue is more occupancy/demand-linked than a pure availability PPP. Staffing dominates the cost. A useful contrast to the availability model. <b>This is US private corrections</b> — REIT-listed.'},
    s4a:'A private corrections operator carries a <b>heavy cost line</b>: custodial <b>staffing</b> dominates, plus facilities, food, healthcare and security. Because revenue follows occupancy, a falling population squeezes the margin — costs are partly fixed but revenue moves with the count. The defining feature is the <b>per-diem and the occupancy</b>, with the guarantee as the floor — a more volume-linked, cyclical version of the custodial annuity.',
    wfNote:'Operating cost is dominated by <b>custodial staffing</b>, plus food, healthcare, facilities and security on an operated estate. Because the per-diem revenue follows occupancy while costs are partly fixed, the margin is sensitive to the prisoner count; the swing factors are occupancy, the per-diem rate and the guarantee floor.',
    s4b:'The capital is the <b>owned custodial estate</b>, built or acquired and held on a REIT-style balance sheet. There is little public subsidy — the operator funds the estate and recovers it through the per-diem income — so the model is closer to an owned, operated real-asset business than a financed PPP. The art is keeping facilities occupied under contract; an empty facility still costs, which is why occupancy guarantees matter.',
    stackH:'The capital · the owned estate', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',5,'Public / other'],['s2',95,'Operator capital']],
    finList:[['','Estate','owned custodial / detention'],['sub','Charge','per-diem per prisoner'],['','Revenue','occupancy-linked'],['sub','Floor','occupancy guarantee'],['','Key risk','demand, policy &amp; renewal'],['rest','Owner','NYSE-listed (CoreCivic / GEO)']],
    finNote:'US private corrections is a <b>more volume-linked custodial business</b>: a per-diem on prisoners held, an occupancy guarantee as the floor, and demand, policy and renewal risk. It is a useful contrast to a pure availability PPP — higher demand risk, with staffing the heavy cost and acute political/ESG sensitivity.',
    timeline:[['1980s','<b>Private corrections</b> emerges in the US — operators contract with authorities.'],['1990s','<b>Per-diem contracts</b> scale across federal, state and local custody.'],['2013','<b>REIT conversion</b> — major operators restructure as real-estate trusts.'],['2010s','<b>Occupancy guarantees</b> common in contracts as a paid floor.'],['2020s','<b>Policy &amp; ESG pressure</b> — bank financing and federal contracts contested.'],['Ongoing','<b>Demand &amp; renewal</b> drive the population and the revenue.']],
    calcNote:'A working model of a <b>per-diem corrections operator</b>, on an enterprise-value basis. The build is the owned estate; revenue is the per-diem income, more occupancy-linked than an availability PPP, with the guarantee as the floor. A heavy staff cost lowers the margin, and the exit multiple reflects demand and policy risk.',
    s6:'US private corrections is a per-diem, occupancy-linked custodial business. What drives it:',
    breakers:['<b>Occupancy</b> — the per-diem is paid on prisoners held; the population drives revenue above the guarantee.','<b>Per-diem rate</b> — the contracted rate per prisoner is the income engine.','<b>Occupancy guarantee</b> — a contracted minimum softens demand risk but does not remove it.','<b>Policy, demand &amp; ESG</b> — sentencing, immigration, renewal and reputational risk are the swing factors.'],
    src:'Figures from public sources on US private corrections: investor disclosure from listed operators such as <a href="https://www.corecivic.com/" target="_blank" rel="noopener">CoreCivic</a> and <a href="https://www.geogroup.com/" target="_blank" rel="noopener">The GEO Group</a> on the per-diem and occupancy-guarantee model. The figures are approximate and illustrative.',
    econ:{cur:'US$', host:'federal / state authorities', volt:'owned custodial estate',
      placesDef:1500,placesMin:600,placesMax:3000,placesStep:50, chargeDef:38000,chargeMin:22000,chargeMax:60000,chargeStep:1000,
      availDef:92,availMin:55,availMax:100,availStep:1, fmPerPlace:14500, fixedOM:11},
    calc:{build:240,grant:0,capex:2.5,revG:2,floor:24,cap:75,tax:25,exit:10,lev:4,rd:6,amort:3,hold:15},
    map:{footer:GEO.uscorr.footer}
  },

  /* ---------- 3 · CHILEAN / LATAM PRISON CONCESSION (South America · availability concession) ---------- */
  chile:{
    name:'Chilean prison concession', geo:'Chile / Latin America', continent:'South America', cur:'US$', geoKey:'chile',
    lede:'A custodial estate under a <b>Latin-American prison concession</b> — the concessionaire builds and maintains the facility (often leaving custody to the state) and is paid a contracted, indexed <b>availability charge</b> per place, at emerging-market rates.',
    s1:'<p class="body">Several Latin-American countries — Chile prominent among them — have procured prisons as <b>concessions</b>. A private concessionaire <b>designs, builds, finances and maintains</b> the custodial estate over a long term, while the <b>custodial function itself often stays with the state</b>. The authority pays a contracted, indexed <b>availability charge</b> per place — for an estate kept secure and fit for use — with deductions for unavailability.</p>'+
       '<p class="body">This is the custodial annuity in <b>availability-concession</b> form. The concessionaire takes <b>no demand risk</b> — the charge does not vary with the prisoner population — and, where custody stays with the state, the operating cost is <b>lighter</b> than an operator-run DBFO (facilities and lifecycle, not custodial staffing), so the margin is higher. But it is an <b>emerging-market</b> concession: the cash is discounted at a higher rate than a developed-market PPP, and the estate is often <b>growing</b> as new houseblocks are added. (Figures here are illustrative.)</p>',
    facts:[['Concession','Structure','build-finance-maintain'],['Availability','Charge','per place, indexed'],['Custody to state','Operations','lighter opex'],['No demand risk','Revenue','availability'],['EM rates','Discount','emerging-market'],['Growing','Estate','new houseblocks added']],
    s2:'Watch the facility. The <b>cell-block wings</b> sit inside a <b>secure double perimeter</b>; available wings are lit and operational, and an <b>+ EXPANSION</b> marker flags new houseblocks. The concessionaire\'s <b style="color:#0c6b4f">return</b> is the <b>availability charge on every place kept fit for use</b> — contracted and indexed, with deductions, and no demand risk. Drag the places, the charge per place and the availability — a contracted annuity at an emerging-market discount rate.',
    driverLab:'Charge per place', availLab:'Availability', hrK:'Contract revenue', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ operating fee',c:'− FM & staff'}, demandLabel:'AVAILABILITY',
    preset:'Load Chile concession',
    try:'<b>Try this:</b> raise the <b>availability</b> toward 100% and watch the charge hold at the contracted level — an availability concession pays for an estate kept <b>fit for use</b>, not for prisoners held, so above the threshold the revenue is contracted. Where custody stays with the state, the cost line is lighter than an operated DBFO, so the margin is higher — but push the cost of debt and a strong number nets down at emerging-market rates.',
    s3:'The concessionaire earns a <b>contracted availability charge</b> per place for keeping the estate secure and fit for use, indexed to inflation, with <b>deductions</b> for unavailability — and takes <b>no demand risk</b>. Where the custodial function stays with the state, the concessionaire carries <b>facilities and lifecycle</b>, not custodial staffing, so the cost line is lighter and the margin higher than an operated DBFO. The investor question is less the contract than the <b>discount rate</b> — emerging-market sovereign risk and the currency mix.',
    mb:{tag:'Model B · availability concession', title:'Latin-American prison concession', body:'A concession in which a private party builds, finances and maintains the custodial estate — often leaving custody to the state — and is paid a contracted, indexed availability charge per place, with no demand risk. With custody retained by the state, opex is lighter and the margin higher, but it is priced at emerging-market rates. <b>This is a Chilean / LatAm prison concession</b>.'},
    s4a:'Where custody stays with the state, the concessionaire\'s cost is <b>facilities management and lifecycle</b> of the secure estate — real but lighter than custodial staffing, so the margin is higher than an operator-run DBFO. The charge is set to cover it; the swing factor is not the cost line but the <b>contracted charge and the discount rate</b> on an emerging-market concession.',
    wfNote:'Operating cost is the facilities management and lifecycle of a secure estate — real, because availability deductions penalise an unfit facility — but lighter than an operated DBFO because the custodial staffing stays with the state. The charge covers it at a contracted margin; the value driver is the indexed charge and the emerging-market discount rate.',
    s4b:'The capital is the <b>secure estate</b>, built to a custodial standard and maintained over the concession. A <b>public contribution</b> often funds part of the build, with the concessionaire financing the balance and recovering it through the availability charge. Modelled on an enterprise-value basis, it is a contracted, indexed annuity carried against <b>emerging-market</b> rates, and the estate frequently grows as new houseblocks are added.',
    stackH:'The capital · the secure estate', splitL:'Who funds the build', splitR:'EM',
    split:[['s1',25,'Public contribution'],['s2',75,'Concessionaire capital']],
    finList:[['','Estate','secure custodial facility'],['sub','Structure','availability concession'],['','Revenue','contracted charge per place'],['sub','Custody','retained by the state'],['','Key risk','sovereign &amp; currency'],['rest','Owner','concession consortium']],
    finNote:'A Latin-American prison concession is a <b>contracted availability annuity</b>: an indexed charge per place for an estate kept fit for use, with no demand risk and (custody retained) a lighter cost line and higher margin. The whole investment debate is the <b>discount rate</b> — emerging-market sovereign risk and the currency mix.',
    timeline:[['2000s','<b>Prison concession programme</b> launched in Chile and across LatAm.'],['2000s','<b>Build-finance-maintain</b> contracts let; custody often retained by the state.'],['2010s','<b>Availability charges</b> paid and indexed over the concession.'],['2010s','<b>New houseblocks</b> added as estates expand.'],['Indexed','<b>Charge indexation</b> tracks inflation over the term.'],['Long-term','<b>Hand-back</b> of the estate at concession end.']],
    calcNote:'A working model of an <b>availability prison concession</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; the floor binds when availability is high. With custody retained by the state the margin is higher, but a higher cost of debt reflects emerging-market rates, so a strong number nets down once discounted.',
    s6:'A LatAm prison concession is a contracted availability annuity at an EM discount rate. What drives it:',
    breakers:['<b>Availability</b> — the charge is paid for an estate kept fit for use; deductions bite below the threshold.','<b>Contracted charge</b> — the indexed charge per place, not the prisoner count, sets the revenue.','<b>Country &amp; currency</b> — emerging-market sovereign risk and the currency mix set the discount rate.','<b>FM &amp; lifecycle delivery</b> — keeping a secure estate available is the operational risk where custody stays with the state.'],
    src:'Figures from public sources on Latin-American prison concessions (Chile prominent): concession-programme and multilateral disclosure on availability-based custodial PPPs. As an emerging-market concession, all figures here are approximate and illustrative.',
    econ:{cur:'US$', host:'state authority', volt:'availability custodial estate',
      placesDef:1600,placesMin:600,placesMax:3000,placesStep:50, chargeDef:26000,chargeMin:14000,chargeMax:44000,chargeStep:1000,
      availDef:97,availMin:78,availMax:100,availStep:1, fmPerPlace:9000, fixedOM:5},
    calc:{build:300,grant:55,capex:2.5,revG:2,floor:18,cap:48,tax:27,exit:9,lev:5,rd:9,amort:3,hold:17},
    map:{footer:GEO.chile.footer}
  },

  /* ---------- 4 · CLARENCE CORRECTIONAL CENTRE (Oceania · large availability PPP, operator-run) ---------- */
  clarence:{
    name:'Clarence Correctional Centre', geo:'New South Wales, Australia', continent:'Oceania', cur:'A$', geoKey:'clarence',
    lede:'A large modern <b>availability PPP</b> — a private consortium finances, builds, maintains and operates the facility, and the government pays a contracted, indexed <b>availability charge</b> per place, with no demand risk and an investment-grade offtaker.',
    s1:'<p class="body"><b>Clarence Correctional Centre</b> in New South Wales is one of the largest custodial facilities in the southern hemisphere, delivered as a modern <b>availability PPP</b>. A private consortium <b>finances, builds, maintains and operates</b> the estate over a long term, and the state pays a contracted <b>availability charge</b> per place for a facility kept secure, staffed and fit for use, indexed to inflation, with deductions for unavailability or performance failures.</p>'+
       '<p class="body">It is the cleanest developed-market form of the custodial annuity. The consortium takes <b>no demand risk</b> — the charge does not vary with the prisoner population — and is backed by an <b>investment-grade government</b> offtaker, so the cash flow is contracted, indexed and low-risk. Because the operator also runs custodial services, the cost line is staff-heavy and the margin lower than a pure estate PPP, but the income is the kind of long, government-backed annuity that anchors a core social-infrastructure portfolio.</p>',
    facts:[['Availability PPP','Structure','finance-build-maintain-operate'],['Per place','Charge','availability, indexed'],['No demand risk','Revenue','availability, not occupancy'],['Gov offtaker','Counterparty','investment-grade'],['Operator-run','Services','staff-heavy opex'],['Large','Scale','among the biggest in the region']],
    s2:'Watch the facility. The <b>cell-block wings</b> radiate from the central hub inside a <b>secure double perimeter</b>; available wings are lit and operational. The consortium\'s <b style="color:#0c6b4f">return</b> is the <b>availability charge on every place kept fit for use</b> — contracted, indexed, government-backed, with deductions for unavailability. Drag the places, the charge per place and the availability — a core, fully contracted annuity with a heavy operating line.',
    driverLab:'Charge per place', availLab:'Availability', hrK:'Contract revenue', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ operating fee',c:'− FM & staff'}, demandLabel:'AVAILABILITY',
    preset:'Load Clarence',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the charge sit flat at the contracted level — the government pays for a facility kept <b>fit for use</b>, not for prisoners held, so once you clear the threshold the revenue is locked. Drop availability and deductions bite. With an investment-grade offtaker the discount rate is low; note, though, that running custodial services makes the staff cost the heavy line.',
    s3:'The consortium earns a <b>contracted availability charge</b> per place for keeping the estate secure, staffed and fit for use, indexed to inflation, with <b>deductions</b> for unavailability or performance failures. There is <b>no demand risk</b> — the charge does not track the prisoner count — and the offtaker is an <b>investment-grade government</b>. Because the operator runs custodial services, the cost line is staff-heavy and the margin lower than a pure estate PPP, but the income is a clean, fully contracted, government-backed annuity.',
    mb:{tag:'Model B · operated availability PPP', title:'Government-backed availability prison', body:'An availability PPP in which a consortium finances, builds, maintains and operates a prison and the government pays a contracted, indexed availability charge per place — no demand risk, an investment-grade offtaker, deductions for unavailability. Operations are bundled, so staffing is the heavy cost and the margin lower than a pure estate PPP. <b>This is Clarence Correctional Centre</b>.'},
    s4a:'The consortium carries the <b>full custodial operation</b> over the term — staffing dominates — plus facilities management, lifecycle and security systems, sized so the availability charge covers it at a contracted margin. Because the offtaker is investment-grade and the charge is locked, the margin is steady but, with operations bundled, lower than a pure estate PPP. The defining feature is the <b>contracted, indexed charge</b> and the low discount rate a government offtaker permits.',
    wfNote:'Operating cost is dominated by <b>custodial staffing</b> on an operated estate, plus facilities management, lifecycle and security systems, sized against a contracted charge. With deductions for unavailability, keeping the estate fit and staffed is the operational job; the value sits in the indexed, government-backed charge, not the cost line.',
    s4b:'The capital is the <b>secure estate</b>, financed by the consortium and recovered over the long contract. A small public contribution may apply, but the consortium funds the bulk and recovers it through the availability charge. Backed by an investment-grade offtaker, the cash flow is contracted and indexed, so it gears well — a low-risk, long-life custodial annuity, with the heavy operating line the only drag on the margin.',
    stackH:'The capital · the secure estate', splitL:'Who funds the build', splitR:'allocation',
    split:[['s1',12,'Public contribution'],['s2',88,'Consortium capital']],
    finList:[['','Estate','secure custodial facility'],['sub','Structure','availability PPP (operated)'],['','Revenue','contracted charge per place'],['sub','Offtaker','investment-grade government'],['','Demand risk','none'],['rest','Owner','infra-backed consortium']],
    finNote:'A government-backed operated availability PPP is a <b>core social-infrastructure annuity</b>: an indexed charge per available place, no demand risk, an investment-grade offtaker. It gears well and prices tight; the margin is lower than a pure estate PPP because operations are bundled, and the residual risks are performance deductions and ESG sensitivity.',
    timeline:[['2017','<b>Clarence PPP</b> reaches financial close in New South Wales.'],['2020','<b>Facility opens</b> — among the largest in the southern hemisphere.'],['Term','<b>Availability charges</b> over the long maintenance-and-operate contract.'],['Indexed','<b>Charge indexation</b> tracks inflation.'],['2020s','<b>Performance regime</b> applies deductions for unavailability and failures.'],['Long-term','<b>Hand-back</b> of the estate at contract end.']],
    calcNote:'A working model of a <b>government-backed operated availability PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; the floor binds when availability is high, so revenue is flat. A low cost of debt and high gearing reflect an investment-grade offtaker; the heavy staff cost lowers the margin.',
    s6:'Clarence is the core contracted custodial annuity with a heavy operating line. What drives it:',
    breakers:['<b>Availability &amp; deductions</b> — the charge is paid on places kept fit for use; performance failures cut it.','<b>Government offtaker</b> — an investment-grade counterparty keeps the discount rate low and gearing high.','<b>Indexation</b> — the inflation-linked charge protects the real return over a long contract.','<b>Staff cost &amp; ESG</b> — running custodial services is the heavy cost; the political/reputational sensitivity is the watch item.'],
    src:'Figures from public sources on the Clarence Correctional Centre availability PPP: <a href="https://www.nsw.gov.au/" target="_blank" rel="noopener">NSW Government</a> and project disclosure on the finance-build-maintain-operate contract. The figures are approximate and illustrative.',
    econ:{cur:'A$', host:'NSW Government', volt:'operated custodial estate',
      placesDef:1700,placesMin:700,placesMax:3000,placesStep:50, chargeDef:48000,chargeMin:28000,chargeMax:76000,chargeStep:1000,
      availDef:98,availMin:82,availMax:100,availStep:1, fmPerPlace:18000, fixedOM:10},
    calc:{build:530,grant:60,capex:2.5,revG:2.5,floor:40,cap:110,tax:30,exit:12,lev:6,rd:5,amort:3,hold:16},
    map:{footer:GEO.clarence.footer}
  },

  /* ---------- 5 · GULF CUSTODIAL PPP (Middle East · availability, state-backed) ---------- */
  gulf:{
    name:'Gulf custodial PPP', geo:'Gulf / Middle East', continent:'Middle East', cur:'US$', geoKey:'gulf',
    lede:'An emerging <b>Gulf custodial PPP</b> — a secure estate built and maintained under a long availability arrangement, with custody typically retained by the state, paid a contracted, indexed charge per place at a low, state-backed cost of capital.',
    s1:'<p class="body">Across the <b>Gulf and wider Middle East</b>, custodial and detention estates are increasingly procured through <b>availability PPPs</b>, alongside the region\'s broader push to deliver social infrastructure with private finance. A private party <b>designs, builds, finances and maintains</b> the secure estate over a long term, while the <b>custodial function is typically retained by the state</b>, and the authority pays a contracted, indexed <b>availability charge</b> per place.</p>'+
       '<p class="body">The economics mirror an availability custodial concession, with a <b>state-backed</b> twist: the counterparty is a sovereign-wealthy government, so the cost of capital is low and the charge is secure. The provider takes <b>no demand risk</b> — the charge does not vary with the population — and, with custody retained by the state, the cost line is <b>lighter</b> (facilities and lifecycle, not custodial staffing), so the margin is higher. A flag illustrative of an emerging market. (Figures here are illustrative.)</p>',
    facts:[['Availability PPP','Structure','build-finance-maintain'],['Per place','Charge','contracted, indexed'],['Custody to state','Operations','lighter opex'],['State-backed','Offtaker','sovereign'],['Low CoC','Funding','strong counterparty'],['Emerging','Market','flag illustrative']],
    s2:'Watch the facility. The <b>cell-block wings</b> sit inside a <b>secure double perimeter</b>; available wings are lit and operational, and an <b>+ EXPANSION</b> marker flags new capacity. The provider\'s <b style="color:#0c6b4f">return</b> is the <b>availability charge on every place kept fit for use</b> — contracted, indexed, state-backed, with deductions for unavailability. Drag the places, the charge per place and the availability — a contracted annuity at a low, state-backed cost of capital.',
    driverLab:'Charge per place', availLab:'Availability', hrK:'Contract revenue', yrS:'places × charge × availability',
    ledge:{a:'+ availability',b:'+ operating fee',c:'− FM & staff'}, demandLabel:'AVAILABILITY',
    preset:'Load Gulf PPP',
    try:'<b>Try this:</b> raise the <b>availability</b> and watch the charge hold flat at the contracted level — the state pays for an estate kept <b>fit for use</b>, not for the population. With a sovereign offtaker the discount rate is low, so the contracted annuity values richly. With custody retained by the state, the cost line is lighter than an operated estate, so the margin is higher.',
    s3:'The provider earns a <b>contracted availability charge</b> per place for keeping the estate secure and fit for use, indexed, with <b>deductions</b> for unavailability — and takes <b>no demand risk</b>. The counterparty is a <b>sovereign-backed</b> government, so the charge is secure and the cost of capital low. Where custody stays with the state, the cost line is <b>facilities and lifecycle</b>, not custodial staffing, so the margin is higher. The income is a contracted, indexed annuity on a long-life secure estate.',
    mb:{tag:'Model B · state-backed availability', title:'Sovereign-backed availability prison', body:'A custodial PPP in which a provider builds, finances and maintains the secure estate — custody typically retained by the state — and is paid a contracted, indexed availability charge per place by a sovereign-backed government, at a low cost of capital. With custody retained, opex is lighter and the margin higher. <b>This is an emerging Gulf custodial PPP</b>.'},
    s4a:'Where custody stays with the state, the provider carries <b>facilities management and lifecycle</b> of a secure estate — real but lighter than custodial staffing, so the margin is higher than an operated estate. The charge is set to cover it; with a sovereign offtaker the margin is steady. The defining feature is the <b>contracted charge and the low cost of capital</b>, not the cost line.',
    wfNote:'Operating cost is the facilities management and lifecycle of a secure estate — real, because availability deductions penalise an unfit facility — but lighter than an operated estate because custodial staffing stays with the state. The charge covers it at a contracted margin; the value sits in the indexed, state-backed charge.',
    s4b:'The capital is the <b>secure estate</b>, procured at scale. As a flagship state programme much of the cost is often <b>state-funded</b>, with the provider\'s capital recovered through the availability charge. Backed by a sovereign counterparty, the cash flow is contracted and indexed at a low cost of capital — a large, secure, long-life custodial annuity, frequently with capacity added as the estate grows.',
    stackH:'The capital · the secure estate', splitL:'Who funds the build', splitR:'state-backed',
    split:[['s1',40,'State funding'],['s2',60,'Provider capital']],
    finList:[['','Estate','secure custodial facility'],['sub','Structure','availability PPP'],['','Revenue','contracted charge per place'],['sub','Custody','retained by the state'],['','Cost of capital','low (sovereign)'],['rest','Owner','provider consortium']],
    finNote:'A state-backed Gulf custodial PPP is a <b>large, secure availability annuity</b>: an indexed charge per place for an estate kept fit for use, a sovereign offtaker, and a low cost of capital. With custody retained by the state the margin is higher. The residual risks are FM delivery, the term of the arrangement and emerging-market execution.',
    timeline:[['2010s','<b>PPP frameworks</b> extended to social and custodial estates in the Gulf.'],['2010s','<b>Build-finance-maintain</b> custodial contracts let; custody retained by the state.'],['2020s','<b>Availability charges</b> paid and indexed over the term.'],['2020s','<b>Capacity added</b> as estates expand.'],['Indexed','<b>Charge indexation</b> over the concession.'],['Long-term','<b>Through-life maintenance</b> of the secure estate.']],
    calcNote:'A working model of a <b>state-backed availability custodial PPP</b>, on an enterprise-value basis. Revenue is the contracted, indexed availability charge; the floor binds when availability is high. A low cost of capital and zero tax reflect a sovereign-backed programme; with custody retained the margin is higher. Figures are highly illustrative.',
    s6:'A Gulf custodial PPP is a large, state-backed contracted availability annuity. What drives it:',
    breakers:['<b>Availability</b> — the charge is paid for an estate kept fit for use; deductions bite below the threshold.','<b>Sovereign offtaker</b> — a state counterparty keeps the cost of capital low and the charge secure.','<b>Indexation</b> — the inflation-linked charge protects the real return over a long term.','<b>FM delivery &amp; execution</b> — keeping a secure estate available, and emerging-market execution, are the risks.'],
    src:'Figures illustrative of emerging Gulf / Middle-East custodial PPPs, drawn from regional PPP-programme disclosure on availability-based social-infrastructure procurement. The flag is illustrative and all figures here are highly approximate.',
    econ:{cur:'US$', host:'state authority', volt:'availability custodial estate',
      placesDef:1400,placesMin:600,placesMax:2800,placesStep:50, chargeDef:30000,chargeMin:16000,chargeMax:50000,chargeStep:1000,
      availDef:97,availMin:80,availMax:100,availStep:1, fmPerPlace:9500, fixedOM:6},
    calc:{build:430,grant:110,capex:2.5,revG:2.5,floor:22,cap:55,tax:0,exit:11,lev:5,rd:4.5,amort:2,hold:18},
    map:{footer:GEO.gulf.footer}
  },

  /* ---------- 6 · CHINESE / STATE CUSTODIAL (China · state-run contrast) ---------- */
  china:{
    name:'Chinese state custodial', geo:'China', continent:'China', cur:'¥', geoKey:'china',
    lede:'An illustrative <b>state-run custodial estate</b> — financed, built and operated by the state with no private PPP charge, included as a contrast to the contracted availability and per-diem models elsewhere.',
    s1:'<p class="body">China runs a very large custodial estate, but it sits <b>outside the private-PPP model</b>: facilities are <b>financed, built and operated by the state</b>, not by a private consortium earning a contracted charge. There is no unitary charge, no per-diem and no concession — the estate is a <b>public asset run by public bodies</b>. It is included here as an <b>illustrative contrast</b>: the same physical asset class, but with the state on every side of it.</p>'+
       '<p class="body">For modelling, we treat it as a <b>notional cost-recovery</b>: were the estate run on a charge basis at a very low state cost of capital, the figures would resemble a thin, state-backed annuity with the operating cost carried directly. The point is the <b>contrast</b> — there is no investor, no contract and no demand or availability risk in the PPP sense, because the state both funds and runs the asset. (Figures here are entirely illustrative.)</p>',
    facts:[['State-run','Model','no private PPP'],['No charge','Revenue','public asset'],['State-financed','Capital','public funding'],['No investor','Owner','public bodies'],['Very low','Cost of capital','state-backed'],['Contrast','Purpose','illustrative comparison']],
    s2:'Watch the facility. The <b>cell-block wings</b> radiate from the central hub inside a <b>secure double perimeter</b>; the estate is fully operational. There is <b>no private charge</b> here — the <b style="color:#0c6b4f">notional</b> cost-recovery figure stands in for what a charge would be, at a very low state cost of capital. Drag the places, the notional charge per place and the availability — the contrast is that the state sits on both sides, so there is no investor and no contract risk.',
    driverLab:'Notional / place', availLab:'Availability', hrK:'Notional revenue', yrS:'places × notional × availability',
    ledge:{a:'+ notional',b:'+ state funding',c:'− FM & staff'}, demandLabel:'AVAILABILITY',
    preset:'Load China contrast',
    try:'<b>Try this:</b> treat the sliders as a <b>notional</b> cost-recovery — there is no real private charge here. The point is the contrast: a state-financed, state-run estate has <b>no investor, no contract and no demand or availability risk</b> in the PPP sense, because the state both funds and runs it. Note how a very low state cost of capital makes even a thin notional charge value richly.',
    s3:'There is <b>no private charge</b>: the estate is financed, built and operated by the state. For modelling we use a <b>notional cost-recovery</b> per place — what a charge might be if the estate were run on one — at a very low state cost of capital, with the operating cost (staffing dominates) carried directly. The contrast with the PPP models is the whole point: <b>no investor, no contract, no demand or availability risk</b>, because the state is on every side of the asset.',
    mb:{tag:'Model B · state-run estate', title:'State-financed custodial estate', body:'A custodial estate financed, built and operated by the state — no private consortium, no contracted charge, no per-diem and no concession. Included as a contrast to the availability and per-diem models elsewhere: the same physical asset, but with no investor, no contract and no PPP risk, because the state both funds and runs it. <b>This is a state-run custodial estate</b>.'},
    s4a:'A state-run estate carries the <b>full operating cost</b> directly — custodial staffing dominates, plus facilities and lifecycle — funded from the public purse rather than recovered through a charge. The notional margin is whatever a charge would imply over that cost. The defining feature is that there is <b>no investor and no contract</b>: the cost line is a public expense, not a counterparty to a private annuity.',
    wfNote:'Operating cost is the full custodial operation — staffing dominates — plus facilities and lifecycle, carried directly by the state rather than recovered through a contracted charge. The notional figures are a cost-recovery illustration only; there is no private revenue line, which is precisely the contrast with the PPP models.',
    s4b:'The capital is the <b>secure estate</b>, <b>state-financed</b> in full. There is no consortium and no contributions split in the PPP sense — the state funds the whole asset. We show it as state-funded to make the contrast clear: a public asset on a public balance sheet, with the notional charge standing in for what a private model would have priced, at a very low state cost of capital.',
    stackH:'The capital · the secure estate', splitL:'Ownership', splitR:'state',
    split:[['s1',100,'State funding']],
    finList:[['','Estate','state custodial facility'],['sub','Model','state-financed & operated'],['','Revenue','none (notional cost-recovery)'],['sub','Investor','none'],['','Cost of capital','very low (state)'],['rest','Owner','public bodies']],
    finNote:'A state-run custodial estate is the <b>contrast case</b>: the same physical asset, but financed and operated by the state with no investor, no contracted charge and no PPP demand or availability risk. The notional figures are a cost-recovery illustration; the real point is that there is no private annuity to value here.',
    timeline:[['—','<b>State estate</b> financed and built by public bodies.'],['—','<b>State operation</b> — custodial services run by the state.'],['—','<b>No private charge</b> — no unitary charge, per-diem or concession.'],['—','<b>No investor</b> — the asset sits on the public balance sheet.'],['Low CoC','<b>Very low state cost of capital</b> underpins the notional figure.'],['Contrast','<b>Included for comparison</b> with the PPP models elsewhere.']],
    calcNote:'A working <b>notional</b> model of a state-run custodial estate, on a cost-recovery basis. There is no real private charge; the figures stand in for what a charge would be at a very low state cost of capital, with the operating cost carried directly. Figures are entirely illustrative and not a forecast.',
    s6:'The Chinese state estate is the contrast — no investor, no contract. What the comparison shows:',
    breakers:['<b>No private charge</b> — there is no unitary charge, per-diem or concession to earn.','<b>State on both sides</b> — the state funds and runs the asset, so there is no counterparty risk.','<b>No demand or availability risk</b> — in the PPP sense, because there is no contract.','<b>Cost of capital</b> — a very low state rate is what makes even a notional figure value richly.'],
    src:'Figures are entirely illustrative. China runs a large custodial estate outside the private-PPP model; given the absence of a private charge and limited disclosure, the notional figures here are a cost-recovery comparison only, not a forecast or an investment view.',
    econ:{cur:'¥', host:'state', volt:'state custodial estate',
      placesDef:2000,placesMin:800,placesMax:4000,placesStep:100, chargeDef:34000,chargeMin:18000,chargeMax:56000,chargeStep:1000,
      availDef:99,availMin:85,availMax:100,availStep:1, fmPerPlace:13000, fixedOM:14},
    calc:{build:324,grant:0,capex:2,revG:3,floor:30,cap:80,tax:25,exit:10,lev:4,rd:3.5,amort:3,hold:16},
    map:{footer:GEO.china.footer}
  }
  };
  var ORDER=['ukdbfo','uscorr','chile','clarence','gulf','china'];

  /* ===================================================================
     CUSTODIAL-FACILITY RENDERER  (canvas, 720x520) — top-down, daytime
     A secure double perimeter (fence/wall) enclosing cell-block wings that radiate
     from a central control hub, a gatehouse on the approach, watch towers at the
     corners, an exercise yard and an FM/services building. A government icon pays
     the contract fee; the facility is "available" when its blocks are lit. Dropping
     the availability slider dims blocks and raises a deduction marker.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  /* ---- facility geometry ---- */
  var HUB={x:392,y:300,r:30};                  // central control hub
  var PERIM={x:240,y:150,w:340,h:300};         // secure perimeter (double fence/wall)
  var GATE={x:PERIM.x+PERIM.w/2-26,y:PERIM.y+PERIM.h-6,w:52,h:30}; // gatehouse on the south approach
  var TOWERS=[];                               // corner watch towers
  var FM={x:34,y:340,w:120,h:96};              // FM / services building (below ledger)
  var GOV={x:96,y:150,r:22};                   // government icon (pays the contract fee)
  var YARD={x:PERIM.x+24,y:PERIM.y+18,w:74,h:60}; // exercise yard
  // cell-block wings radiating from the hub
  var WINGS=[];
  function layout(){
    TOWERS=[ {x:PERIM.x+8,y:PERIM.y+8},{x:PERIM.x+PERIM.w-8,y:PERIM.y+8},
             {x:PERIM.x+8,y:PERIM.y+PERIM.h-8},{x:PERIM.x+PERIM.w-8,y:PERIM.y+PERIM.h-8} ];
    // four/five wings radiating from the hub at fixed angles
    WINGS=[];
    var angs=[-Math.PI*0.5,-Math.PI*0.18,Math.PI*0.18,Math.PI*0.82,-Math.PI*0.82];
    for(var i=0;i<angs.length;i++){ WINGS.push({a:angs[i], len:80, ph:(i*7)%10*0.5}); }
  }

  /* ---- base map: secure ground + perimeter ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#e2e8db'); g.addColorStop(1,'#d4ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // approach road from the gatehouse down off-canvas
    ctx.strokeStyle='rgba(150,140,120,0.30)'; ctx.lineWidth=14; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(GATE.x+GATE.w/2,GATE.y+GATE.h); ctx.lineTo(GATE.x+GATE.w/2,H-12); ctx.stroke(); ctx.lineCap='butt';
    // secure compound ground inside the perimeter
    ctx.fillStyle='rgba(150,150,135,0.14)'; rr(PERIM.x+6,PERIM.y+6,PERIM.w-12,PERIM.h-12,8); ctx.fill();
  }
  /* ---- the double secure perimeter (outer fence + inner wall) ---- */
  function perimeter(){
    // outer fence (dashed, chain-link feel)
    ctx.strokeStyle='rgba(96,108,100,0.75)'; ctx.lineWidth=2; ctx.setLineDash([5,4]);
    rr(PERIM.x,PERIM.y,PERIM.w,PERIM.h,10); ctx.stroke(); ctx.setLineDash([]);
    // inner wall (solid)
    ctx.strokeStyle='rgba(120,128,118,0.9)'; ctx.lineWidth=3;
    rr(PERIM.x+12,PERIM.y+12,PERIM.w-24,PERIM.h-24,8); ctx.stroke();
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.75)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('SECURE PERIMETER',PERIM.x+2,PERIM.y-7); ctx.restore();
  }
  /* ---- a corner watch tower ---- */
  function tower(t){
    ctx.fillStyle='rgba(20,30,25,0.16)'; ctx.beginPath(); ctx.arc(t.x+1.5,t.y+1.5,7,0,Math.PI*2); ctx.fill();
    var g=ctx.createRadialGradient(t.x-2,t.y-2,0,t.x,t.y,7); g.addColorStop(0,'#d7dbd1'); g.addColorStop(1,'#b4bab0');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(t.x,t.y,6,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.6)'; ctx.lineWidth=1; ctx.stroke();
    // slow sweeping light
    if(Math.sin(T*0.05+t.x)>0.4) glow(t.x,t.y,9,'rgba(255,210,120,0.35)');
  }
  /* ---- gatehouse / entrance ---- */
  function gatehouse(){
    var s=GATE;
    ctx.fillStyle='rgba(20,30,25,0.14)'; rr(s.x+2,s.y+2,s.w,s.h,3); ctx.fill();
    var g=ctx.createLinearGradient(s.x,s.y,s.x,s.y+s.h); g.addColorStop(0,'#cfd3ca'); g.addColorStop(1,'#bcc2b8');
    ctx.fillStyle=g; rr(s.x,s.y,s.w,s.h,4); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.6)'; ctx.lineWidth=1; ctx.stroke();
    // sally-port doors
    ctx.fillStyle='rgba(90,100,90,0.4)'; rr(s.x+s.w/2-6,s.y+s.h-9,12,7,1.5); ctx.fill();
    ctx.fillStyle='rgba(70,90,80,0.8)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('GATEHOUSE',s.x+s.w/2,s.y+s.h+10);
  }
  /* ---- FM / services building (off to the side, like the depot shed) ---- */
  function fmBuilding(busy){
    var s=FM;
    ctx.fillStyle='rgba(30,40,30,0.10)'; rr(s.x+4,s.y+s.h-6,s.w,8,3); ctx.fill();
    var g=ctx.createLinearGradient(s.x,s.y,s.x,s.y+s.h); g.addColorStop(0,'#cfd3ca'); g.addColorStop(1,'#bcc2b8');
    ctx.fillStyle=g; rr(s.x,s.y,s.w,s.h,5); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // roof bays
    ctx.fillStyle='rgba(255,255,255,0.32)';
    for(var bx=s.x+8;bx<s.x+s.w-8;bx+=24){ ctx.beginPath(); ctx.moveTo(bx,s.y+8); ctx.lineTo(bx+12,s.y+2); ctx.lineTo(bx+12,s.y+15); ctx.closePath(); ctx.fill(); }
    // service bays (lit where the FM/staff function is busy)
    var doors=3, dw=(s.w-20)/doors;
    for(var d=0;d<doors;d++){ var dx=s.x+10+d*dw, lit=d<busy;
      ctx.fillStyle=lit?'rgba(255,196,120,0.5)':'rgba(90,100,90,0.30)'; rr(dx,s.y+s.h-28,dw-7,22,2); ctx.fill();
      if(lit && Math.sin(T*0.12+d)>0.2) glow(dx+(dw-7)/2,s.y+s.h-17,8,'rgba(255,180,90,0.32)'); }
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('FM & SERVICES',s.x+s.w/2,s.y-6);
  }
  /* ---- the central control hub ---- */
  function hub(){
    ctx.fillStyle='rgba(20,30,25,0.16)'; ctx.beginPath(); ctx.arc(HUB.x+2,HUB.y+2,HUB.r,0,Math.PI*2); ctx.fill();
    var g=ctx.createRadialGradient(HUB.x-6,HUB.y-6,2,HUB.x,HUB.y,HUB.r);
    g.addColorStop(0,'#d9dcd2'); g.addColorStop(1,'#b9bfb4');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(HUB.x,HUB.y,HUB.r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.65)'; ctx.lineWidth=1.4; ctx.stroke();
    ctx.fillStyle='rgba(60,80,90,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('HUB',HUB.x,HUB.y+3);
  }
  /* ---- a cell-block wing radiating from the hub; lit when available ---- */
  function wing(w,available){
    var bx=HUB.x+Math.cos(w.a)*HUB.r, by=HUB.y+Math.sin(w.a)*HUB.r;
    var ex=HUB.x+Math.cos(w.a)*(HUB.r+w.len), ey=HUB.y+Math.sin(w.a)*(HUB.r+w.len);
    var bw=24; // wing width
    ctx.save(); ctx.translate(bx,by); ctx.rotate(w.a);
    // shadow
    ctx.fillStyle='rgba(20,30,25,0.14)'; rr(1.5,-bw/2+1.5,w.len,bw,4); ctx.fill();
    // block body — lit/operational vs dimmed
    var top=available?'#e7e3d6':'#c4c6bd', bot=available?'#cfcbb8':'#aeb0a6';
    var pg=ctx.createLinearGradient(0,-bw/2,0,bw/2); pg.addColorStop(0,top); pg.addColorStop(1,bot);
    ctx.fillStyle=pg; rr(0,-bw/2,w.len,bw,4); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.55)'; ctx.lineWidth=1; ctx.stroke();
    // cell windows along the wing (warm if available)
    ctx.fillStyle=available?'rgba(255,206,140,0.85)':'rgba(150,160,150,0.55)';
    for(var c=10;c<w.len-6;c+=11){ rr(c,-bw/2+4,5,4,1); ctx.fill(); rr(c,bw/2-8,5,4,1); ctx.fill(); }
    ctx.restore();
    if(available && Math.sin(T*0.08+w.ph)>0) glow((bx+ex)/2,(by+ey)/2,14,'rgba(255,190,110,0.18)');
    return {mx:(bx+ex)/2, my:(by+ey)/2, tipx:ex, tipy:ey};
  }
  /* ---- exercise yard ---- */
  function yard(){
    var s=YARD;
    ctx.fillStyle='rgba(120,150,110,0.30)'; rr(s.x,s.y,s.w,s.h,5); ctx.fill();
    ctx.strokeStyle='rgba(110,140,100,0.5)'; ctx.lineWidth=1; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
    // a running track oval
    ctx.strokeStyle='rgba(180,150,120,0.5)'; ctx.lineWidth=1.4;
    ctx.beginPath(); if(ctx.ellipse) ctx.ellipse(s.x+s.w/2,s.y+s.h/2,s.w/2-8,s.h/2-8,0,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(70,90,70,0.7)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('YARD',s.x+s.w/2,s.y+s.h+9);
  }
  /* ---- government icon (pays the contract fee) ---- */
  function govIcon(){
    var c=GOV;
    ctx.fillStyle='rgba(20,30,25,0.14)'; ctx.beginPath(); ctx.arc(c.x+1.5,c.y+1.5,c.r,0,Math.PI*2); ctx.fill();
    var g=ctx.createRadialGradient(c.x-5,c.y-5,2,c.x,c.y,c.r); g.addColorStop(0,'#eef0ea'); g.addColorStop(1,'#cdd2c8');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(110,120,110,0.6)'; ctx.lineWidth=1; ctx.stroke();
    // little classical pediment (government / treasury)
    ctx.fillStyle='rgba(80,95,88,0.85)';
    ctx.beginPath(); ctx.moveTo(c.x-11,c.y-2); ctx.lineTo(c.x,c.y-12); ctx.lineTo(c.x+11,c.y-2); ctx.closePath(); ctx.fill();
    for(var i=-1;i<=1;i++){ rr(c.x+i*7-1.5,c.y-1,3,10,0.5); ctx.fill(); }
    ctx.fillStyle='rgba(70,90,80,0.85)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('AUTHORITY',c.x,c.y+c.r+11);
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
    govIcon();

    // base map: perimeter, yard, hub
    perimeter();
    yard();
    hub();

    // cell-block wings: lit/available split by availability
    var nW=WINGS.length;
    var availWings=Math.round(nW*avail);
    var wingPts=[];
    for(var i=0;i<nW;i++){
      var av = i < availWings;
      var p=wing(WINGS[i], av);
      if(av) wingPts.push(p);
    }
    // a deduction marker appears when availability drops
    if(avail<0.999 && (nW-availWings)>0){
      var dwx=PERIM.x+PERIM.w-58, dwy=PERIM.y+24;
      ctx.save(); ctx.fillStyle='rgba(188,71,51,0.92)'; rr(dwx,dwy,52,16,4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('− DEDUCTION',dwx+26,dwy+11); ctx.restore();
    }

    // corner watch towers + gatehouse
    for(var t=0;t<TOWERS.length;t++) tower(TOWERS[t]);
    gatehouse();

    // FM / services building — bays busy with the FM/staff function (heavier when operated)
    var busyBays=G.operated ? Math.max(1,Math.min(3, Math.round(2 + Math.sin(T*0.07)*0.6))) : Math.max(0,Math.min(3, Math.round(1 + (1-avail)*2)));
    fmBuilding(busyBays);

    // labels
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='left';
    ctx.fillText('CELL-BLOCK WINGS',PERIM.x+2,PERIM.y+PERIM.h+13); ctx.restore();

    // expansion / new houseblock marker
    if(G.growing){
      var ex=HUB.x+50, ey=HUB.y+62;
      ctx.save(); ctx.fillStyle='rgba(12,107,79,0.92)'; rr(ex,ey,98,17,4); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
      ctx.fillText('+ NEW HOUSEBLOCK',ex+49,ey+12); ctx.restore();
    }

    // ---- economics (contracted government availability annuity, NO demand risk) ----
    var revenue=places*charge*avail;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));    // floor = contracted minimum (no demand risk)
    var opex= places*(E.fmPerPlace||0) + (E.fixedOM||0)*1e6;   // FM + custodial operations (staff-heavy where operated)
    var ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    // waterfall opex rows: staff-heavy where operated, FM-led otherwise
    var staffShare=G.operated?0.58:0.20;
    var c_staff=opex*staffShare, c_fm=opex*(0.66-staffShare), c_life=opex*0.22, c_admin=opex*0.12;
    // share of "+cash" that is the operating-fee (amber) slice vs availability (green)
    var floorBinds = floor>0 && revenue<=floor+1;
    var feeShare = G.operated?0.34:0.20;

    // money-flow: +cash (availability green / operating-fee amber) rises from lit wings to the SPV;
    // −cash (FM & staff red) drains from the FM building
    if(_anim){
      if(wingPts.length && Math.random()<0.7){ var s1=wingPts[(Math.random()*wingPts.length)|0];
        spawnCoin(s1.mx,s1.my-4, Math.random()<feeShare?'rec':'ret', -1); }
      var sx=FM.x+FM.w*0.5; if(Math.random()<Math.max(0.1,Math.min(0.7, opex/Math.max(1,revenue)))) spawnCoin(sx,FM.y+FM.h-14,'cost',1);
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
    set('ixDir',kfmt(places)+' places'); set('ixDirS','operational capacity · '+E.volt);
    set('ixMW',Math.round(avail*100)+'% available'); set('ixMWs',(floorBinds?'at contracted floor · ':'')+(G.host||'authority'));
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% EBITDA margin');

    drawWaterfall(revenue, [['Custodial staff',c_staff],['Facilities mgmt',c_fm],['Lifecycle',c_life],['Admin',c_admin]], ebitda);
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the contract is too thin to value — raise the places, the fee per place or the availability.</span>'; return; }
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
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is a contracted government availability annuity (places × fee per place × availability) and the returns model is a simplified DCF in which a public contribution offsets part of the secure construction cost; not a forecast of any specific year, and not investment advice.');
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'ukdbfo');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
