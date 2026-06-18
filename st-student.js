/* Student accommodation (PBSA) — data-driven worked examples.
   Six real / illustrative purpose-built student accommodation businesses, one
   template. Scene config from st-geo.js (GEO), drawn as an elevation of a student
   accommodation block in a 720x520 scene: a grid of room windows where OCCUPIED
   rooms are lit (a warm desk lamp) and empty rooms dark, so the lit fraction is
   occupancy; a ground-floor common room / reception / gym amenity; a courtyard;
   and a few students and bikes outside. The interactive figures are illustrative:
   PBSA is OPERATIONAL REAL ESTATE, not an availability PPP — revenue is
   occupancy × rent (beds × rent per week × tenancy weeks), so there is genuine
   demand / re-letting risk as well as rental growth and operating leverage. The
   returns model is a simplified DCF / LBO with a cap-rate-based (multiple) exit. */
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

  /* ---------- 1 · UNITE STUDENTS (Europe · listed UK PBSA REIT) ---------- */
  unite:{
    name:'Unite Students', geo:'United Kingdom', continent:'Europe', cur:'£', geoKey:'unite',
    lede:'The textbook <b>purpose-built student accommodation (PBSA)</b> business — the listed UK REIT that builds and owns halls in prime city locations and lets the beds to students through <b>nomination agreements</b> with universities and direct to students.',
    s1:'<p class="body">A student needs somewhere to live, and a university can only house a fraction of its intake. <b>Purpose-built student accommodation</b> fills the gap: a private operator builds, owns and runs a hall of en-suite rooms and studios, lets the beds for the academic year, and runs the building as a service — reception, security, gym, study spaces and a common room.</p>'+
       '<p class="body"><b>Unite Students</b> is the UK\'s largest PBSA owner-operator, a listed REIT with tens of thousands of beds across the strongest university cities. Crucially this is <b>operational real estate, not an availability PPP</b>: revenue depends on <b>occupancy and rent</b>, so there is genuine demand and re-letting risk — but also <b>rental growth</b> and operating leverage. Unite de-risks part of that with <b>nomination agreements</b>, where a university block-books beds for several years (a partial contracted floor), with the balance let directly to students at a premium.</p>',
    facts:[['~70k','Beds','UK-wide'],['Listed REIT','Owner','LSE: UTG'],['Nominations','+ direct-let','partial floor'],['~97%+','Occupancy','prime PBSA'],['Annual','Re-letting','academic-year cycle'],['Rental growth','Driver','meaningful, multi-year']],
    s2:'Watch the building fill. Each lit window is an <b>occupied room</b> — a student in residence paying rent — and each dark window is an empty bed. The lit fraction is the <b>occupancy</b>. The owner\'s <b style="color:#0c6b4f">money</b> is the rent on every let bed (green) plus ancillary income (amber), against the real <b style="color:#bc4733">operating cost</b> of running the building. Drag the beds, the weekly rent and the occupancy.',
    driverLab:'Rent / wk', availLab:'Occupancy', hrK:'Rental income', yrS:'beds × rent × occupancy',
    ledge:{a:'+ rent',b:'+ ancillary',c:'− operating'}, demandLabel:'OCCUPANCY',
    preset:'Load Unite',
    try:'<b>Try this:</b> drop the <b>occupancy</b> and watch the margin fall faster than the revenue — the building has fixed running costs (staff, utilities, R&M), so empty beds bite through <b>operating leverage</b>, unlike a PPP whose revenue is contracted. Then push the <b>rent</b>: PBSA has had strong rental growth, and nomination agreements protect part of the income while direct-let captures the upside.',
    s3:'Unite earns <b>rent on every let bed</b>, week by week through the academic year, plus ancillary income (summer lets, bookings, services). Part of the income is de-risked through <b>nomination agreements</b> — a university block-books beds for a multi-year term, a partial contracted floor — and the rest is <b>direct-let</b> to students, which carries demand risk but captures rental growth. The engine is therefore <b>occupancy × rent</b>: how full the building is and what each bed pays, re-set every year in the annual letting cycle.',
    mb:{tag:'Model A · operational real estate', title:'PBSA REIT (occupancy × rent)', body:'A listed owner-operator that builds and runs halls in prime cities, letting beds through nomination agreements (a partial contracted floor) and direct to students. Revenue is occupancy × rent — genuine demand risk, but rental growth and operating leverage too, with a tight cap-rate exit. <b>This is Unite Students</b> — the UK PBSA leader.'},
    s4a:'Unlike a PPP, a hall is a <b>real operating business</b>: staff, utilities, repairs and maintenance, marketing and re-letting, and the management of the building all cost money every year. Many of those costs are <b>fixed</b>, so the margin swings with occupancy — full halls earn a high NOI margin, and a soft letting year compresses it through operating leverage. The defining number is the spread of occupancy × rent over a largely fixed cost base.',
    wfNote:'Operating cost is staff and reception, utilities, repairs and maintenance, cleaning, marketing and re-letting, and a management overhead. Much of it is fixed against the building, so the NOI margin is high when full (mid-60s to high-70s per cent) but compresses sharply if occupancy slips — the operating-leverage point.',
    s4b:'The capital is the building itself — land and construction of a prime-city hall — at a substantial <b>capex per bed</b> (roughly £60–120k for prime city PBSA). There is rarely a grant; the developer-investor funds the build and earns its return from the rental income and the value of the standing asset. Because PBSA trades on tight yields, the <b>exit</b> is cap-rate-based — a high multiple of stabilised EBITDA / NOI.',
    stackH:'The capital · per bed', splitL:'How it is funded', splitR:'allocation',
    split:[['s1',35,'Debt'],['s2',65,'Equity']],
    finList:[['','Beds','~70k, UK-wide'],['sub','Owner','Unite Group (LSE: UTG)'],['','Revenue','occupancy × rent'],['sub','Letting','nominations + direct-let'],['','Occupancy','~97%+ (prime)'],['rest','Exit','cap-rate / tight yield']],
    finNote:'A PBSA REIT is <b>operational real estate</b>: occupancy × rent over a largely fixed cost base, with rental growth and a tight cap-rate exit. The risks are the annual re-letting cycle and demand (international and domestic intake), development cost, and the exit yield — but nomination agreements provide a partial contracted floor.',
    timeline:[['1991','<b>Unite founded</b> in Bristol — early purpose-built student housing.'],['2000','<b>Lists on the London Stock Exchange</b>.'],['2017','<b>Converts to a REIT</b> — the income-vehicle structure.'],['2010s','<b>Nomination agreements</b> with universities scale the contracted floor.'],['2020s','<b>Strong rental growth</b> as supply lags student demand.'],['Annual','<b>Academic-year re-letting</b> cycle re-sets occupancy and rent.']],
    calcNote:'A working model of a <b>PBSA scheme</b> as operational real estate. Revenue is beds × weekly rent × occupancy over the tenancy weeks; a largely fixed operating cost gives the operating leverage. The build is the capex per bed; the exit is a high multiple (a tight cap rate) on stabilised EBITDA / NOI.',
    s6:'Unite is the UK PBSA leader — operational real estate with a partial contracted floor. What moves the return:',
    breakers:['<b>Occupancy &amp; the re-letting cycle</b> — how full the halls let each academic year is the engine, and the demand risk.','<b>Rental growth</b> — PBSA has had strong rent growth where supply lags student numbers.','<b>Operating leverage</b> — fixed running costs mean the NOI margin swings with occupancy.','<b>The exit yield</b> — PBSA trades on tight cap rates, so the exit multiple is high but rate-sensitive.'],
    src:'Figures from public sources on the UK PBSA market: <a href="https://www.unitestudents.com/" target="_blank" rel="noopener">Unite Students</a> and <a href="https://www.unitegroup.com/" target="_blank" rel="noopener">Unite Group</a> (LSE: UTG) investor disclosure on beds, occupancy, nomination agreements and rental growth. The figures are approximate and illustrative.',
    econ:{cur:'£', tier:'prime', market:'UK cities', weeks:51,
      bedDef:600,bedMin:200,bedMax:1400,bedStep:10, rentDef:220,rentMin:120,rentMax:380,rentStep:5,
      occDef:97,occMin:70,occMax:100,occStep:1, opexPerBed:1900, fixedOM:0.55},
    calc:{build:120,grant:0,capex:3,revG:3,floor:0,cap:120,tax:25,exit:17,lev:5,rd:5.5,amort:2,hold:12},
    map:{footer:GEO.unite.footer}
  },

  /* ---------- 2 · AMERICAN CAMPUS COMMUNITIES (North America · US PBSA leader) ---------- */
  acc:{
    name:'American Campus Communities', geo:'United States', continent:'North America', cur:'US$', geoKey:'acc',
    lede:'The <b>US student-housing leader</b> — on- and near-campus communities at scale, taken private by <b>Blackstone</b>. The American model leans on the annual academic-year leasing cycle and the pull of the campus.',
    s1:'<p class="body"><b>American Campus Communities (ACC)</b> built the US student-housing business into an institutional asset class — owning, developing and operating communities <b>on and immediately around</b> university campuses, often under long ground leases or partnerships with the universities themselves. In 2022 it was <b>taken private by Blackstone</b> in a multi-billion-dollar deal, the clearest signal that PBSA had arrived as core real estate.</p>'+
       '<p class="body">The US model is <b>operational real estate</b> driven by the <b>annual leasing cycle</b>: each spring the next academic year\'s beds are leased, and the whole portfolio re-sets its occupancy and rent. On- and near-campus assets enjoy a structural demand pull — proximity to the university — but they still carry real <b>demand and re-letting risk</b>, and the running cost of a managed community. The reward is rental growth and the value of an irreplaceable location.</p>',
    facts:[['~165k','Beds','US-wide'],['Blackstone','Owner','taken private 2022'],['On/near','Campus','demand pull'],['Annual','Leasing cycle','spring pre-lease'],['~95%+','Occupancy','stabilised'],['P3','Partnerships','on-campus, ground-leased']],
    s2:'Picture a community across the street from the stadium — each lit window an occupied bed leased for the academic year. The lit fraction is the <b>occupancy</b>, set in the spring pre-leasing season. The owner\'s <b style="color:#0c6b4f">return</b> is the rent on every let bed (green) plus ancillary (amber), against the <b style="color:#bc4733">operating cost</b> of running the community. Drag the beds, the weekly rent and the occupancy.',
    driverLab:'Rent / wk', availLab:'Occupancy', hrK:'Rental income', yrS:'beds × rent × occupancy',
    ledge:{a:'+ rent',b:'+ ancillary',c:'− operating'}, demandLabel:'OCCUPANCY',
    preset:'Load ACC',
    try:'<b>Try this:</b> drop the <b>occupancy</b> — even with a campus right next door, a community that under-leases in the spring carries empty beds all year, and fixed running costs bite through <b>operating leverage</b>. Then push the <b>rent</b>: proximity to campus gives pricing power, which is why Blackstone paid up for an irreplaceable, demand-pulled portfolio.',
    s3:'ACC earns <b>rent on every leased bed</b> across the academic year, plus ancillary income, with the whole portfolio re-pricing in the <b>annual pre-leasing cycle</b> each spring. On- and near-campus locations give a structural <b>demand pull</b> — students want to be close to the university — and many on-campus assets sit under <b>P3 partnerships</b> or ground leases with the institution. The engine is occupancy × rent, set every year, over a managed community with a real running cost.',
    mb:{tag:'Model A · operational real estate', title:'On/near-campus communities', body:'The US PBSA leader: on- and near-campus communities leased each academic year, with a structural demand pull from proximity to the university. Revenue is occupancy × rent, with real re-letting risk and operating leverage but strong location value — taken private by Blackstone as core real estate. <b>This is American Campus Communities</b>.'},
    s4a:'A US student community is a <b>managed operating business</b>: on-site staff, utilities, repairs, turn costs between leases, marketing and the spring leasing push. Many of those costs are fixed against the building, so the margin moves with how fully the community pre-leases. Full at a good rent, the NOI margin is strong; a soft leasing year compresses it through operating leverage.',
    wfNote:'Operating cost is on-site staff and management, utilities, repairs and maintenance, the turn and re-leasing each year, and marketing. Largely fixed against the asset, so the NOI margin is high when fully leased and falls if pre-leasing disappoints — operating leverage on a demand-driven asset.',
    s4b:'The capital is the community — land (or a ground lease) and construction near campus — at a substantial <b>capex per bed</b>. There is rarely a grant; the sponsor funds the build and earns from rent and the value of an irreplaceable location. PBSA trades on tight US cap rates, so the <b>exit</b> is cap-rate-based — a high multiple of stabilised NOI, the basis on which Blackstone bought the platform.',
    stackH:'The capital · per bed', splitL:'How it is funded', splitR:'allocation',
    split:[['s1',55,'Debt'],['s2',45,'Equity']],
    finList:[['','Beds','~165k, US-wide'],['sub','Owner','Blackstone (private, 2022)'],['','Revenue','occupancy × rent'],['sub','Locations','on / near campus, P3'],['','Occupancy','~95%+ stabilised'],['rest','Exit','cap-rate / tight yield']],
    finNote:'The US PBSA leader is <b>operational real estate</b> with a campus demand pull: occupancy × rent set in the annual leasing cycle, over a largely fixed cost base, with a tight cap-rate exit. The risks are the spring pre-lease, enrolment and the exit yield — partly offset by irreplaceable on-campus locations.',
    timeline:[['1993','<b>American Campus Communities</b> founded.'],['2004','<b>Lists on the NYSE</b> — the first US student-housing REIT.'],['2010s','<b>On-campus P3 partnerships</b> scale with universities.'],['Annual','<b>Spring pre-leasing</b> re-sets occupancy and rent each year.'],['2022','<b>Taken private by Blackstone</b> in a ~$13bn deal.'],['2020s','<b>PBSA as core real estate</b> — institutional ownership.']],
    calcNote:'A working model of a <b>US student community</b> as operational real estate, on an enterprise-value basis. Revenue is beds × weekly rent × occupancy across the leasing year; a largely fixed running cost gives the operating leverage. The exit is a high multiple (tight cap rate) on stabilised NOI.',
    s6:'ACC is the US PBSA leader — demand-pulled by the campus, priced as core real estate. What drives it:',
    breakers:['<b>Spring pre-leasing</b> — how fully each community leases for the academic year is the engine.','<b>Campus demand pull</b> — proximity to the university gives occupancy and pricing power.','<b>Operating leverage</b> — fixed running costs mean a soft leasing year compresses the NOI margin.','<b>The exit yield</b> — tight US cap rates set the exit; the price Blackstone paid reflects them.'],
    src:'Figures from public sources on US student housing: <a href="https://www.americancampus.com/" target="_blank" rel="noopener">American Campus Communities</a> historical disclosure and the 2022 <a href="https://www.blackstone.com/" target="_blank" rel="noopener">Blackstone</a> take-private. Bed and occupancy figures are approximate and illustrative.',
    econ:{cur:'US$', tier:'value', market:'US campuses', weeks:50,
      bedDef:800,bedMin:300,bedMax:1800,bedStep:10, rentDef:230,rentMin:130,rentMax:420,rentStep:5,
      occDef:96,occMin:65,occMax:100,occStep:1, opexPerBed:2300, fixedOM:0.9},
    calc:{build:120,grant:0,capex:3,revG:3,floor:0,cap:200,tax:25,exit:17,lev:6,rd:5.5,amort:2,hold:12},
    map:{footer:GEO.acc.footer}
  },

  /* ---------- 3 · ULIVING / BRAZIL (South America · emerging PBSA) ---------- */
  uliving:{
    name:'Uliving · Brazil PBSA', geo:'Brazil', continent:'South America', cur:'R$', geoKey:'uliving',
    lede:'Emerging-market PBSA — a <b>Brazilian student-housing</b> platform building the first institutional halls in a market of millions of students and almost no purpose-built supply. Strong growth, in reais, at emerging-market rates.',
    s1:'<p class="body">Brazil has millions of university students and almost no <b>purpose-built student accommodation</b> — most students live with family or in informal shared housing. Platforms such as <b>Uliving</b> are building the first institutional halls near the big universities, often with international capital, into a market of structural <b>under-supply</b>.</p>'+
       '<p class="body">The economics are the same operational-real-estate model — <b>occupancy × rent</b> over a managed building — but with an emerging-market twist: <b>strong growth</b> and rental upside as the asset class is created, set against cash flows in <b>reais</b> discounted at high Brazilian rates. The demand is there; the questions are the letting ramp of new schemes, the local cost base, and the discount rate, not the existence of students.</p>',
    facts:[['Millions','Students','near-zero PBSA'],['Under-supply','Structural','the opportunity'],['Growth','Driver','asset class being created'],['Direct-let','Model','few nominations yet'],['R$','Currency','EM discount rate'],['Intl capital','Backing','funds + developers']],
    s2:'Picture a brand-new hall lighting up near a São Paulo campus — rooms filling as the first cohorts move in, each lit window a let bed. The lit fraction is the <b>occupancy</b> as the scheme leases up. The <b style="color:#0c6b4f">return</b> is the rent on each let bed (green) plus ancillary (amber), against a real <b style="color:#bc4733">operating cost</b>. Drag the beds, the weekly rent and the occupancy — strong nominal growth, discounted like an EM asset.',
    driverLab:'Rent / wk', availLab:'Occupancy', hrK:'Rental income', yrS:'beds × rent × occupancy',
    ledge:{a:'+ rent',b:'+ ancillary',c:'− operating'}, demandLabel:'OCCUPANCY',
    preset:'Load Uliving',
    try:'<b>Try this:</b> push the <b>rent</b> and the <b>occupancy</b> up — into structural under-supply, a well-located hall fills and prices grow fast, which is the EM PBSA thesis. But the whole return is in reais: raise the cost of debt and watch a strong nominal number net down once discounted like an emerging-market asset. The early-year <b>lease-up</b> is the real risk, not the demand.',
    s3:'A Brazilian PBSA platform earns <b>rent on every let bed</b> over the academic year, mostly <b>direct-let</b> (nomination agreements are still rare in the market). Into structural under-supply, new schemes <b>lease up</b> and rents grow as the asset class matures — the upside. But the cash flow is in <b>reais</b>, so the investor question is less the demand than the <b>discount rate</b>: Brazilian rates and the real. The engine is occupancy × rent on a building leasing into a deep, unmet need.',
    mb:{tag:'Model A · operational real estate', title:'Emerging-market PBSA', body:'A platform creating institutional student housing in a market of millions of students and near-zero supply, earning occupancy × rent on direct-let halls. Strong growth and rental upside as the asset class is built — priced against emerging-market rates and a lease-up ramp. <b>This is Brazilian PBSA (e.g. Uliving)</b>.'},
    s4a:'A new hall in Brazil is a real operating business — staff, utilities, repairs, security and marketing — and in the lease-up years the fixed costs sit over a building that is not yet full, so <b>operating leverage</b> is sharp: margin builds as occupancy climbs. Once stabilised, a full hall earns a healthy NOI margin; the journey there is the early-year risk.',
    wfNote:'Operating cost is on-site staff, utilities, repairs and maintenance, security and marketing — largely fixed against the building. In the lease-up years that cost sits over fewer let beds, so the margin is thin until the hall fills, then expands as occupancy climbs.',
    s4b:'The capital is the building — land and construction near a major campus — at a local <b>capex per bed</b> below prime Western levels but financed at high local rates. There is no grant; international capital and developers fund the build. The <b>exit</b> is cap-rate-based, but at a wider EM yield than prime markets, and a strong nominal return nets down once discounted in reais.',
    stackH:'The capital · per bed', splitL:'How it is funded', splitR:'EM',
    split:[['s1',40,'Debt (local rates)'],['s2',60,'Equity (intl capital)']],
    finList:[['','Students','millions, near-zero PBSA'],['sub','Backing','international capital + developers'],['','Revenue','occupancy × rent (direct-let)'],['sub','Driver','lease-up + rental growth'],['','Currency','R$ (EM discount rate)'],['rest','Exit','cap-rate (wider EM yield)']],
    finNote:'Emerging-market PBSA is <b>operational real estate into structural under-supply</b>: occupancy × rent with strong growth, but carried against Brazilian rates and the real. The risks are the lease-up of new schemes, the local cost base and — above all — the <b>discount rate</b>, more than the demand itself.',
    timeline:[['2010s','<b>Brazilian PBSA emerges</b> — first institutional halls near campuses.'],['2018','<b>Uliving</b> and peers scale with international capital.'],['2020s','<b>Structural under-supply</b> drives lease-up and rental growth.'],['Annual','<b>Academic-year letting</b> re-sets occupancy and rent.'],['Periodic','<b>EM rate cycles</b> set the discount rate on the asset.'],['Ongoing','<b>Asset class maturing</b> toward institutional ownership.']],
    calcNote:'A working model of an <b>emerging-market PBSA</b> scheme, on an enterprise-value basis. Revenue is beds × weekly rent × occupancy; the cost of debt is high to reflect Brazilian rates, and the exit yield is wider than prime. A strong nominal return nets down once discounted like an EM asset.',
    s6:'Brazilian PBSA is operational real estate into deep under-supply — at an EM discount rate. What drives it:',
    breakers:['<b>Lease-up</b> — how fast a new hall fills is the controllable risk, not whether students exist.','<b>Rental growth</b> — into structural under-supply, rents grow strongly as the asset class matures.','<b>Country &amp; currency</b> — Brazilian real rates and the real set the discount rate, not the building.','<b>The exit yield</b> — a wider EM cap rate sets the exit; rate moves swing the value.'],
    src:'Figures from public sources on emerging Latin-American PBSA, e.g. <a href="https://www.uliving.com.br/" target="_blank" rel="noopener">Uliving</a> and reporting on Brazilian student-housing under-supply. As an emerging asset class, all figures here are approximate and illustrative.',
    econ:{cur:'R$', tier:'value', market:'Brazil', weeks:46,
      bedDef:500,bedMin:150,bedMax:1200,bedStep:10, rentDef:300,rentMin:160,rentMax:600,rentStep:10,
      occDef:90,occMin:55,occMax:100,occStep:1, opexPerBed:3000, fixedOM:0.45},
    calc:{build:115,grant:0,capex:3,revG:5,floor:0,cap:300,tax:34,exit:14,lev:4,rd:10,amort:2,hold:12},
    map:{footer:GEO.uliving.footer}
  },

  /* ---------- 4 · SCAPE / AUSTRALIA (Oceania · prime amenity-rich) ---------- */
  scape:{
    name:'Scape · Australia PBSA', geo:'Australia', continent:'Oceania', cur:'A$', geoKey:'scape',
    lede:'Prime <b>amenity-rich PBSA</b> — the largest owner of purpose-built student accommodation in Australia, built around the pull of <b>international students</b> in the big capital cities, with a heavy direct-let premium.',
    s1:'<p class="body">Australia is one of the world\'s great <b>international-student</b> destinations, and its capital cities have a deep, under-supplied market for high-quality student housing. <b>Scape</b> is the largest owner-operator of <b>purpose-built student accommodation</b> in Australia — prime, <b>amenity-rich</b> towers (gyms, study lounges, cinemas, rooftops) in central locations close to the major universities.</p>'+
       '<p class="body">The model is operational real estate at the premium end: mostly <b>direct-let</b> to students who pay up for location and amenity, with revenue driven by <b>occupancy × rent</b>. The demand engine is the flow of international students, which gives strong rental growth in good years but also makes occupancy sensitive to border and visa policy — a vivid example of <b>demand risk</b> in PBSA, rewarded by a premium rent and a tight exit yield.</p>',
    facts:[['Largest','AU PBSA','owner-operator'],['Amenity-rich','Prime','gyms · lounges · rooftops'],['International','Students','the demand engine'],['Direct-let','Premium','pricing power'],['~96%+','Occupancy','stabilised prime'],['A$','Currency','developed market']],
    s2:'Picture a prime tower in central Melbourne or Sydney — lit windows are occupied rooms, an amenity floor glowing at the base. The lit fraction is the <b>occupancy</b>, driven by the flow of international students. The <b style="color:#0c6b4f">return</b> is a premium rent on each let bed (green) plus ancillary (amber), against the <b style="color:#bc4733">operating cost</b> of a serviced building. Drag the beds, the weekly rent and the occupancy.',
    driverLab:'Rent / wk', availLab:'Occupancy', hrK:'Rental income', yrS:'beds × rent × occupancy',
    ledge:{a:'+ rent',b:'+ ancillary',c:'− operating'}, demandLabel:'OCCUPANCY',
    preset:'Load Scape',
    try:'<b>Try this:</b> drop the <b>occupancy</b> to see the demand risk that defines Australian PBSA — when borders close or visa policy tightens, international-student arrivals fall and a prime tower can suddenly carry empty beds, with fixed costs compressing the margin. Then push the <b>rent</b>: in the good years, amenity-rich direct-let towers command a premium and strong rental growth.',
    s3:'Scape earns a <b>premium rent on every let bed</b>, mostly <b>direct-let</b> to international and domestic students who pay up for prime location and amenity, plus ancillary income. The demand engine is the <b>flow of international students</b>, which drives strong rental growth — and makes occupancy sensitive to border and visa policy. The engine is occupancy × rent at the premium end, re-set each academic year, over a heavily serviced building.',
    mb:{tag:'Model A · operational real estate', title:'Prime amenity-rich PBSA', body:'The largest Australian PBSA owner, building prime amenity-rich towers in capital cities and letting mostly direct to international and domestic students. Revenue is occupancy × rent at a premium — strong rental growth, but real demand risk tied to international-student flows, and a tight exit yield. <b>This is Scape</b>.'},
    s4a:'A prime amenity-rich tower is an <b>intensive operating business</b>: front-of-house staff, gyms and lounges, utilities, repairs, cleaning and marketing — more service than a basic hall, and largely fixed. So the NOI margin is strong when the tower is full at a premium rent, but the <b>operating leverage</b> is real: a soft international-student year compresses it sharply.',
    wfNote:'Operating cost is the staff and management of a serviced amenity-rich building, utilities, repairs and maintenance, cleaning and marketing — higher than a basic hall and largely fixed. Full at a premium rent the NOI margin is high; a demand dip compresses it through operating leverage.',
    s4b:'The capital is a prime central tower — land and construction in a capital city — at a high <b>capex per bed</b>, reflecting the location and the amenity. There is no grant; institutional capital funds the build. PBSA trades on tight Australian yields, so the <b>exit</b> is cap-rate-based — a high multiple of stabilised NOI on an irreplaceable prime asset.',
    stackH:'The capital · per bed', splitL:'How it is funded', splitR:'allocation',
    split:[['s1',45,'Debt'],['s2',55,'Equity']],
    finList:[['','Beds','prime, capital cities'],['sub','Owner','institutional (Scape platform)'],['','Revenue','occupancy × rent (direct-let)'],['sub','Demand','international students'],['','Occupancy','~96%+ stabilised'],['rest','Exit','cap-rate / tight yield']],
    finNote:'Prime Australian PBSA is <b>operational real estate at the premium end</b>: occupancy × rent with strong rental growth, but a vivid demand risk tied to international-student flows and border policy. Operating leverage on a heavily serviced building, with a tight cap-rate exit on an irreplaceable location.',
    timeline:[['2010s','<b>Scape</b> builds prime amenity-rich PBSA in Australian capitals.'],['2019','<b>Acquires Urbanest</b> — becomes the largest AU PBSA owner.'],['2020','<b>Border closures</b> hit international-student arrivals — the demand risk made real.'],['2022','<b>Borders reopen</b> — international students return, occupancy recovers.'],['Annual','<b>Academic-year letting</b> re-sets occupancy and rent.'],['2020s','<b>Strong rental growth</b> in under-supplied capital cities.']],
    calcNote:'A working model of a <b>prime Australian PBSA</b> tower as operational real estate, on an enterprise-value basis. Revenue is beds × premium weekly rent × occupancy; a heavily serviced, largely fixed cost base gives sharp operating leverage. The exit is a high multiple (tight cap rate) on stabilised NOI.',
    s6:'Scape is prime amenity-rich PBSA — premium rent against a real, visible demand risk. What drives it:',
    breakers:['<b>International-student flows</b> — the demand engine, and the occupancy risk when borders or visas tighten.','<b>Premium rent &amp; rental growth</b> — prime amenity-rich towers command pricing power in under-supplied cities.','<b>Operating leverage</b> — a heavily serviced building means fixed costs and sharp margin swings with occupancy.','<b>The exit yield</b> — tight Australian cap rates set the exit on an irreplaceable prime asset.'],
    src:'Figures from public sources on Australian PBSA: <a href="https://au.scape.com/" target="_blank" rel="noopener">Scape</a> and reporting on international-student demand and the 2019 Urbanest acquisition. As a private platform, the figures are approximate and illustrative.',
    econ:{cur:'A$', tier:'amenity-rich', market:'Australia', weeks:48,
      bedDef:700,bedMin:250,bedMax:1600,bedStep:10, rentDef:340,rentMin:200,rentMax:600,rentStep:10,
      occDef:96,occMin:60,occMax:100,occStep:1, opexPerBed:3500, fixedOM:0.5},
    calc:{build:140,grant:0,capex:3,revG:4,floor:0,cap:300,tax:30,exit:16,lev:5,rd:6,amort:2,hold:12},
    map:{footer:GEO.scape.footer}
  },

  /* ---------- 5 · GULF STUDENT HOUSING (Middle East · emerging) ---------- */
  gulf:{
    name:'Gulf student housing', geo:'UAE / Saudi Arabia', continent:'Middle East', cur:'AED', geoKey:'gulf',
    lede:'Emerging <b>Gulf student housing</b> — purpose-built halls serving fast-growing university hubs in the UAE and Saudi Arabia, often through partnerships with the universities, built ahead of a fast-rising student population.',
    s1:'<p class="body">The Gulf has invested heavily in higher education — international branch campuses, new national universities and education free-zones — and a fast-growing, partly international student population needs housing. <b>Purpose-built student accommodation</b> is emerging, often developed in <b>partnership with the universities</b> or education authorities and let to their students.</p>'+
       '<p class="body">The model is the same operational real estate — <b>occupancy × rent</b> over a managed hall — but in an emerging market where supply is being <b>built ahead of demand</b> as student numbers rise. University partnerships can provide a partial contracted floor (akin to a nomination agreement), de-risking the lease-up; the upside is growth as the hubs scale. Figures here are illustrative.</p>',
    facts:[['Growing','Students','education hubs'],['University','Partnerships','partial floor'],['Build-ahead','Of demand','emerging supply'],['International','+ national','mixed demand'],['AED','Currency','USD-pegged'],['Illustrative','Figures','emerging market']],
    s2:'Picture a new hall beside a Gulf university hub — rooms filling as the student population grows, each lit window a let bed. The lit fraction is the <b>occupancy</b> as the scheme leases up, partly underpinned by a university partnership. The <b style="color:#0c6b4f">return</b> is the rent on each let bed (green) plus ancillary (amber), against the <b style="color:#bc4733">operating cost</b>. Drag the beds, the weekly rent and the occupancy.',
    driverLab:'Rent / wk', availLab:'Occupancy', hrK:'Rental income', yrS:'beds × rent × occupancy',
    ledge:{a:'+ rent',b:'+ ancillary',c:'− operating'}, demandLabel:'OCCUPANCY',
    preset:'Load Gulf PBSA',
    try:'<b>Try this:</b> set the <b>occupancy</b> low and watch the hall earn little against its fixed costs — built ahead of demand, the early years are a <b>lease-up ramp</b>. Then raise occupancy as the hub grows and the margin builds. A <b>university partnership</b> can underpin part of the income like a nomination agreement, softening the demand risk of an emerging market.',
    s3:'A Gulf student-housing scheme earns <b>rent on every let bed</b> over the academic year, often partly underpinned by a <b>university partnership</b> that block-books beds (a partial contracted floor, akin to a nomination agreement), with the balance let directly. Built ahead of a rising student population, the engine is the <b>lease-up</b> — how fast the hall fills as the hub grows — and then occupancy × rent on a managed building. The currency is broadly USD-linked.',
    mb:{tag:'Model A · operational real estate', title:'Emerging Gulf student housing', body:'Purpose-built halls serving fast-growing Gulf university hubs, often via university partnerships that provide a partial contracted floor, with the balance direct-let. Operational real estate built ahead of demand: occupancy × rent with a lease-up ramp and emerging-market growth. <b>This is Gulf student housing</b> (figures illustrative).'},
    s4a:'A Gulf hall is a real operating business — staff, heavy cooling and utilities, repairs and marketing — and built ahead of demand, the fixed costs sit over a building still filling, so the early <b>operating leverage</b> is sharp. As the hub grows and occupancy climbs, the margin builds toward a healthy stabilised NOI; a university partnership steadies the ramp.',
    wfNote:'Operating cost is staff, utilities and cooling (a real cost in the Gulf climate), repairs and maintenance, and marketing — largely fixed. In the lease-up years that cost sits over fewer let beds, so the margin is thin until the hall fills, then expands with occupancy.',
    s4b:'The capital is the hall — land and construction near a university hub — at a moderate <b>capex per bed</b>, often co-developed with the institution or an education authority. A university partnership can de-risk part of the income. The <b>exit</b> is cap-rate-based, at an emerging-market yield wider than prime Western PBSA but tightening as the market institutionalises.',
    stackH:'The capital · per bed', splitL:'How it is funded', splitR:'EM',
    split:[['s1',45,'Debt'],['s2',55,'Equity / partner']],
    finList:[['','Students','growing education hubs'],['sub','Structure','university partnership + direct-let'],['','Revenue','occupancy × rent'],['sub','Driver','lease-up + population growth'],['','Currency','AED (USD-pegged)'],['rest','Exit','cap-rate (EM yield)']],
    finNote:'Emerging Gulf student housing is <b>operational real estate built ahead of demand</b>: occupancy × rent with a lease-up ramp, partly underpinned by university partnerships. The risks are the pace of the ramp and the maturity of the market; the reward is growth as the hubs scale. Figures are illustrative.',
    timeline:[['2010s','<b>Gulf higher-education hubs</b> scale — branch campuses, national universities.'],['2010s','<b>Education free-zones</b> draw international students and providers.'],['2020s','<b>PBSA emerges</b> via university and authority partnerships.'],['Phased','<b>Build-ahead-of-demand</b> as student numbers rise.'],['Annual','<b>Academic-year letting</b> re-sets occupancy and rent.'],['Ongoing','<b>Market institutionalising</b> toward tighter yields.']],
    calcNote:'A working model of an <b>emerging Gulf PBSA</b> scheme, on an enterprise-value basis. Revenue is beds × weekly rent × occupancy; built ahead of demand, the early years are a lease-up. A university partnership steadies the income; the exit is a cap-rate at a wider emerging-market yield. Figures are highly illustrative.',
    s6:'Gulf student housing is operational real estate built ahead of a rising student population. What drives it:',
    breakers:['<b>Lease-up</b> — how fast the hall fills as the hub grows is the controllable risk.','<b>University partnerships</b> — block-booked beds provide a partial contracted floor through the ramp.','<b>Population growth</b> — rising student numbers in the education hubs are the demand engine.','<b>Market maturity</b> — the exit yield tightens as the asset class institutionalises.'],
    src:'Figures from public sources on Gulf higher education and emerging student housing (UAE and Saudi Arabia education hubs and university partnerships). As an emerging market with limited disclosure, all figures here are highly approximate and illustrative; the flag is illustrative.',
    econ:{cur:'AED', tier:'value', market:'Gulf', weeks:44,
      bedDef:500,bedMin:150,bedMax:1200,bedStep:10, rentDef:280,rentMin:150,rentMax:520,rentStep:10,
      occDef:92,occMin:45,occMax:100,occStep:1, opexPerBed:3200, fixedOM:0.25},
    calc:{build:120,grant:0,capex:3,revG:5,floor:0,cap:240,tax:0,exit:16,lev:5,rd:6,amort:2,hold:12},
    map:{footer:GEO.gulf.footer}
  },

  /* ---------- 6 · CHINESE STUDENT / CO-LIVING (China · illustrative scale) ---------- */
  china:{
    name:'Chinese student / co-living', geo:'China', continent:'China', cur:'¥', geoKey:'china',
    lede:'Student and graduate <b>co-living at scale</b> — illustrative of the vast Chinese market, where mass demand from students and young graduates fills purpose-built rental housing at thin rents but on a colossal occupancy base.',
    s1:'<p class="body">China has the world\'s largest higher-education system and a huge population of students and young graduates moving to the big cities for study and work. Purpose-built <b>student and graduate co-living</b> — managed rental housing with shared amenities — has scaled rapidly to meet that mass demand, blending student accommodation with young-professional rental.</p>'+
       '<p class="body">The model is the same operational real estate — <b>occupancy × rent</b> over a managed building — but the Chinese signature is <b>scale</b>: rents per bed are thin by Western standards, but applied to an immense, fast-filling occupancy base and financed at a low local cost of capital, they compound into a large, stable cash flow. The figures here are illustrative given the scale and limited disclosure.</p>',
    facts:[['Largest','HE system','on earth'],['Mass','Demand','students + graduates'],['Co-living','Model','student + young-professional'],['Thin rent','Per bed','vast occupancy base'],['Scale','Driver','not price'],['Illustrative','Figures','limited disclosure']],
    s2:'Picture a large co-living block in a Chinese university city — most windows lit, rooms filling fast from a deep pool of students and graduates. The lit fraction is the <b>occupancy</b>, which stays high on mass demand. At this scale even a thin <b style="color:#0c6b4f">rent</b> per bed (green) plus ancillary (amber) is a large cash flow, against the <b style="color:#bc4733">operating cost</b>. Drag the beds, the weekly rent and the occupancy.',
    driverLab:'Rent / wk', availLab:'Occupancy', hrK:'Rental income', yrS:'beds × rent × occupancy',
    ledge:{a:'+ rent',b:'+ ancillary',c:'− operating'}, demandLabel:'OCCUPANCY',
    preset:'Load China co-living',
    try:'<b>Try this:</b> the <b>rent</b> per bed is thin — but push the <b>beds</b> slider and watch the absolute cash flow balloon. Scale and high occupancy on mass demand, not price, are the model. Occupancy holds high because the demand pool is deep; the operating leverage still bites if a block under-fills, but at this scale the base is enormous.',
    s3:'A Chinese student / co-living operator earns a <b>thin rent on every let bed</b> across a large, fast-filling building, plus ancillary services. Mass demand from students and young graduates keeps <b>occupancy high</b>, and the engine is <b>scale</b>: a thin per-bed rent on an immense occupancy base, financed at a low local cost of capital, compounds into a large, stable cash flow. The model is occupancy × rent — the same as elsewhere, applied at continental scale.',
    mb:{tag:'Model A · operational real estate', title:'Co-living at scale', body:'Managed student and graduate co-living at vast scale, earning a thin rent per bed on an immense, fast-filling occupancy base, financed at a low local cost of capital. The same occupancy × rent model as elsewhere, but driven by scale and mass demand rather than price. <b>This is Chinese student / co-living</b> (figures illustrative).'},
    s4a:'At this scale operating cost is large in absolute terms — running co-living for a huge bed count — but small relative to the revenue from a colossal occupancy base, so the NOI margin is healthy when blocks fill. The dominant feature is <b>scale and high occupancy</b> on mass demand; the operating leverage still applies, but the deep demand pool keeps occupancy high.',
    wfNote:'Operating cost is staff, utilities, repairs and the management of co-living at scale — large in absolute terms but small against the revenue from a vast occupancy base. High mass-demand occupancy keeps the NOI margin healthy; an under-filled block would still compress it through operating leverage.',
    s4b:'The capital is the building at scale — land and construction in a Chinese university city — at a moderate local <b>capex per bed</b>, financed at a low local cost of capital. There is no grant. The <b>exit</b> is cap-rate-based on stabilised NOI; the absolute cash flow is large and steady because the occupancy base is immense, even though the per-bed rent is thin.',
    stackH:'The capital · per bed', splitL:'How it is funded', splitR:'allocation',
    split:[['s1',50,'Debt (low local rate)'],['s2',50,'Equity']],
    finList:[['','Demand','mass — students + graduates'],['sub','Model','student / graduate co-living'],['','Revenue','occupancy × (thin) rent'],['sub','Driver','scale, not price'],['','Cost of capital','low (local)'],['rest','Exit','cap-rate on stabilised NOI']],
    finNote:'Chinese student / co-living is <b>operational real estate at continental scale</b>: a thin rent per bed on an immense, high-occupancy base, financed cheaply. The absolute cash flow is large and steady on mass demand; the operating leverage is real but the deep demand pool keeps occupancy high. Figures are illustrative.',
    timeline:[['2010s','<b>Co-living scales</b> in Chinese cities for students and young graduates.'],['2010s','<b>Mass urbanisation</b> drives rental-housing demand.'],['2020s','<b>Managed rental / co-living</b> consolidates at scale.'],['Annual','<b>High occupancy</b> on a deep demand pool.'],['Ongoing','<b>Thin rents, vast base</b> — scale, not price.'],['Ongoing','<b>Institutionalising</b> rental housing.']],
    calcNote:'A working model of <b>Chinese student / co-living</b> at scale, on an enterprise-value basis. Revenue is beds × a thin weekly rent × high occupancy; the base is vast and the cost of capital low, so the absolute return is large and steady. Figures are highly illustrative given the scale and limited disclosure.',
    s6:'Chinese co-living is scale plus mass demand — a thin rent on a colossal, high-occupancy base. What drives it:',
    breakers:['<b>Scale &amp; occupancy</b> — a thin rent on a vast, high-occupancy base is the model; mass demand keeps it full.','<b>Cost of capital</b> — a low local cost of capital lifts the value of a thin per-bed return.','<b>Operating leverage</b> — it still applies, but the deep demand pool keeps occupancy high.','<b>Rental policy &amp; supply</b> — local rental rules and the pace of supply shape the per-bed rent.'],
    src:'Figures from public sources and reporting on Chinese student and graduate co-living / managed rental housing. Given the scale and limited disclosure, all figures here are highly approximate and illustrative.',
    econ:{cur:'¥', tier:'value', market:'China', weeks:50,
      bedDef:1000,bedMin:400,bedMax:2400,bedStep:20, rentDef:200,rentMin:100,rentMax:420,rentStep:10,
      occDef:95,occMin:60,occMax:100,occStep:1, opexPerBed:2700, fixedOM:0.15},
    calc:{build:90,grant:0,capex:3,revG:4,floor:0,cap:400,tax:25,exit:17,lev:5,rd:4,amort:2,hold:12},
    map:{footer:GEO.china.footer}
  }
  };
  var ORDER=['unite','acc','uliving','scape','gulf','china'];

  /* ===================================================================
     STUDENT ACCOMMODATION RENDERER  (canvas, 720x520) — daytime elevation
     A purpose-built student accommodation block: a grid of room windows where
     OCCUPIED rooms glow warm (a desk lamp) and empty rooms are dark, so the lit
     fraction = occupancy; a ground-floor amenity (common room / reception / gym);
     a courtyard; and a few students and bikes outside.
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }
  function glow(x,y,r,col,a){ ctx.save(); ctx.globalAlpha=(a==null?1:a); var g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.restore(); }

  // building footprint (two blocks framing a courtyard) and the room-window grid
  var BLOCKS=[];               // {x,y,w,h,cols,rows}
  var ROOMS=[], NROOM=0;       // every lettable room window
  function layout(){
    var G=GEO[A.geoKey];
    // two blocks: a tall main block and a shorter wing, framing a courtyard
    BLOCKS=[
      {x:70, y:96,  w:300, h:360, cols:6, rows:8, floorH:0},   // main block (left)
      {x:430,y:150, w:236, h:306, cols:5, rows:6, floorH:0}    // wing (right)
    ];
    ROOMS=[]; var idx=0;
    BLOCKS.forEach(function(b,bi){
      var padX=18, padTop=20, padBot=64;                 // bottom band reserved for the amenity / entrance
      var gx0=b.x+padX, gx1=b.x+b.w-padX;
      var gy0=b.y+padTop, gy1=b.y+b.h-padBot;
      var cw=(gx1-gx0)/b.cols, rh=(gy1-gy0)/b.rows;
      for(var r=0;r<b.rows;r++) for(var c=0;c<b.cols;c++){
        var x=gx0+c*cw+cw/2, y=gy0+r*rh+rh/2;
        // deterministic letting order: fill top-down, with a stable per-room phase
        var rank=(r*b.cols+c)+bi*1000;
        ROOMS.push({x:x,y:y,w:cw,h:rh,block:bi,row:r,col:c,order:rank,ph:(idx*0.7)%6.28}); idx++;
      }
    });
    // letting order = a gentle scatter so the lit fraction reads as occupancy, not a sweep
    ROOMS.forEach(function(p){ p.key=(Math.sin(p.order*12.9898)*43758.5453); p.key-=Math.floor(p.key); });
    ROOMS.sort(function(a,b){ return a.key-b.key; });
    ROOMS.forEach(function(p,i){ p.rank=i; });
    NROOM=ROOMS.length;
  }

  /* ---- base scene: sky, ground, courtyard ---- */
  function drawMap(){
    var g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#dbe6ef'); g.addColorStop(0.55,'#e6ecdf'); g.addColorStop(1,'#d6ddcc');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // ground / paving band
    ctx.fillStyle='#cdd5c6'; ctx.fillRect(0,H-78,W,78);
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1; ctx.setLineDash([7,9]); ctx.lineDashOffset=-(T*0.4);
    ctx.beginPath(); ctx.moveTo(0,H-52); ctx.lineTo(W,H-52); ctx.stroke(); ctx.setLineDash([]);
    // courtyard between the blocks
    ctx.fillStyle='rgba(150,180,140,0.16)'; rr(376,180,52,260,10); ctx.fill();
    // a couple of courtyard trees
    [388,402,416].forEach(function(tx,i){ ctx.fillStyle='rgba(70,120,70,0.5)'; ctx.beginPath(); ctx.arc(tx,300+i*44,9,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(90,70,50,0.5)'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(tx,300+i*44+8); ctx.lineTo(tx,300+i*44+18); ctx.stroke(); });
  }

  /* ---- one accommodation block: facade + window grid; lit windows = occupied ---- */
  function drawBlock(b,litCount,occ){
    // ground shadow
    ctx.fillStyle='rgba(30,40,30,0.12)'; ctx.beginPath(); ctx.ellipse(b.x+b.w/2,b.y+b.h+6,b.w*0.52,12,0,0,Math.PI*2); ctx.fill();
    // facade
    var fg=ctx.createLinearGradient(b.x,b.y,b.x,b.y+b.h); fg.addColorStop(0,'#d3d8cf'); fg.addColorStop(1,'#c2c8bd');
    ctx.fillStyle=fg; rr(b.x,b.y,b.w,b.h,6); ctx.fill();
    ctx.strokeStyle='rgba(120,130,120,0.5)'; ctx.lineWidth=1; ctx.stroke();
    // roof cap
    ctx.fillStyle='#b6bdb0'; rr(b.x-4,b.y-7,b.w+8,9,3); ctx.fill();
    // floor lines
    ctx.strokeStyle='rgba(120,130,120,0.28)'; ctx.lineWidth=1;
    var padTop=20, padBot=64, gy0=b.y+padTop, gy1=b.y+b.h-padBot, rh=(gy1-gy0)/b.rows;
    for(var r=1;r<b.rows;r++){ ctx.beginPath(); ctx.moveTo(b.x+6,gy0+r*rh); ctx.lineTo(b.x+b.w-6,gy0+r*rh); ctx.stroke(); }
  }
  // a single room window — lit (occupied: warm desk-lamp glow) or dark (empty)
  function drawRoom(p,lit){
    var ww=Math.min(20,p.w*0.62), wh=Math.min(20,p.h*0.6), x=p.x-ww/2, y=p.y-wh/2;
    // frame
    ctx.fillStyle='rgba(70,80,72,0.55)'; rr(x-1.4,y-1.4,ww+2.8,wh+2.8,2); ctx.fill();
    if(lit){
      var g=ctx.createLinearGradient(x,y,x,y+wh); g.addColorStop(0,'#ffe7b0'); g.addColorStop(1,'#ffcf72');
      ctx.fillStyle=g; rr(x,y,ww,wh,1.5); ctx.fill();
      // warm desk-lamp glow + a little desk-lamp dot in the corner
      glow(p.x,p.y,ww*0.95,'rgba(255,205,110,0.5)');
      ctx.fillStyle='rgba(255,170,60,0.95)'; ctx.beginPath(); ctx.arc(x+ww-3.5,y+wh-3.5,1.5,0,Math.PI*2); ctx.fill();
    } else {
      ctx.fillStyle='#9aa39a'; rr(x,y,ww,wh,1.5); ctx.fill();
      ctx.fillStyle='rgba(60,70,64,0.18)'; rr(x,y,ww,wh*0.5,1.5); ctx.fill();   // dark glass reflection
    }
    // mullion
    ctx.strokeStyle='rgba(70,80,72,0.4)'; ctx.lineWidth=0.8;
    ctx.beginPath(); ctx.moveTo(x+ww/2,y); ctx.lineTo(x+ww/2,y+wh); ctx.stroke();
  }

  /* ---- ground-floor amenity: common room / reception / gym ---- */
  var AMEN={prime:'COMMON ROOM',value:'RECEPTION','amenity-rich':'GYM · LOUNGE'};
  function amenity(b,label){
    var ay=b.y+b.h-56, ax=b.x+10, aw=b.w-20, ah=46;
    var g=ctx.createLinearGradient(ax,ay,ax,ay+ah); g.addColorStop(0,'#cdb478'); g.addColorStop(1,'#bda05e');
    ctx.fillStyle=g; rr(ax,ay,aw,ah,4); ctx.fill();
    // big glazed amenity windows — always lit warm (the social heart of the building)
    var n=Math.max(3,Math.round(aw/40));
    for(var i=0;i<n;i++){ var wx=ax+8+i*((aw-16)/n), ww=(aw-16)/n-6;
      var wg=ctx.createLinearGradient(wx,ay+8,wx,ay+ah-8); wg.addColorStop(0,'#fff0c8'); wg.addColorStop(1,'#ffd98a');
      ctx.fillStyle=wg; rr(wx,ay+8,ww,ah-16,2); ctx.fill();
      glow(wx+ww/2,ay+ah/2,16,'rgba(255,210,120,0.35)'); }
    // entrance canopy
    ctx.fillStyle='rgba(60,72,66,0.85)'; rr(ax+aw/2-16,ay+ah-4,32,5,2); ctx.fill();
    ctx.fillStyle='rgba(70,90,80,0.9)'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(label,ax+aw/2,ay+ah-12);
  }

  /* ---- stylised students & bikes outside ---- */
  function person(x,y,c){
    ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,y-7,2.4,0,Math.PI*2); ctx.fill();           // head
    rr(x-2.2,y-5,4.4,8,1.6); ctx.fill();                                                     // body
  }
  function bike(x,y){
    ctx.strokeStyle='rgba(70,80,72,0.7)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.arc(x-5,y,3.4,0,Math.PI*2); ctx.arc(x+5,y,3.4,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-5,y); ctx.lineTo(x,y-5); ctx.lineTo(x+5,y); ctx.moveTo(x,y-5); ctx.lineTo(x+2,y-8); ctx.stroke();
  }
  function street(occ){
    var py=H-40;
    // a few students milling near the entrance, scaled gently with occupancy
    var cols=['#3f6fb0','#0c8a57','#bc7733','#7a5fb0','#b04f6a'];
    var n=Math.max(2,Math.round(2+occ*5));
    for(var i=0;i<n;i++){ var px=130+i*64+Math.sin(T*0.03+i)*6; person(px,py,cols[i%cols.length]); }
    bike(96,py+4); bike(600,py+4); bike(636,py+2);
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
    var bx=px+13, bw=pw-26, rows=[['Rental income','+'+money(rev),'#0c6b4f',1],['Operating cost','−'+money(opex),'#bc4733',Math.max(0.02,oR)],['EBITDA / NOI',money(eb)+'  ·  '+Math.round(m*100)+'%','#0a5a42',Math.max(0.02,m)]];
    var ry=py+42;
    rows.forEach(function(r){ ctx.fillStyle='rgba(60,72,66,0.95)'; ctx.font='600 9px Inter,sans-serif'; ctx.textAlign='left'; ctx.fillText(r[0],bx,ry+7);
      ctx.fillStyle=r[2]; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(r[1],px+pw-13,ry+7);
      ctx.fillStyle='rgba(20,30,25,0.07)'; rr(bx,ry+11,bw,3,1.5); ctx.fill(); ctx.fillStyle=r[2]; rr(bx,ry+11,bw*Math.min(1,r[3]),3,1.5); ctx.fill();
      ry+=20; });
    ctx.restore();
  }
  /* ---- live occupancy sparkline ---- */
  function drawDemand(occ){
    var pw=126,ph=44,px=W-pw-16,py=14, label=A.demandLabel||'OCCUPANCY';
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
    var beds=parseFloat(sCap.value), rentWk=parseFloat(sSpread.value), occ=parseFloat(sAvail.value)/100;
    var letBeds=beds*occ;
    var weeks=(E.weeks||44);
    var occLive=Math.max(0,Math.min(1, occ));

    ctx.clearRect(0,0,W,H);
    drawMap();

    // draw the blocks and light the occupied fraction of the rooms
    var litCount=Math.round(NROOM*occ);
    BLOCKS.forEach(function(b){ drawBlock(b,litCount,occ); });
    ROOMS.forEach(function(p){
      var lit = p.rank < litCount;
      drawRoom(p,lit);
      // shimmer on the most-recently-let room (the letting frontier)
      var edge = lit && (p.rank > litCount-3);
      if(edge && Math.sin(T*0.18+p.ph)>0.3) glow(p.x,p.y,9,'rgba(70,225,150,0.4)');
    });
    // ground-floor amenity on each block + students/bikes outside
    BLOCKS.forEach(function(b,i){ amenity(b, AMEN[G.tier]||'COMMON ROOM'); });
    street(occ);

    // ---- economics (operational real estate: occupancy × rent) ----
    var revenue=letBeds*rentWk*weeks;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e15)*1e6;
    revenue=Math.max(floor,Math.min(capR,revenue));
    var opex= beds*(E.opexPerBed||0) + (E.fixedOM||0)*1e6;   // staff, utilities, R&M, marketing — a real cost per bed
    var ebitda=revenue-opex;
    // build cost: iBuild is capex PER BED in thousands → total build = beds × iBuild × 1e3
    var buildTot=(parseFloat(iBuild.value)||0)*1e3*beds;
    var grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;
    // split of "+cash": mostly rent, a slice ancillary
    var ancShare=0.12;

    // waterfall cost components (staff / utilities / R&M / marketing & re-letting)
    var c_staff=opex*0.40, c_util=opex*0.24, c_rm=opex*0.22, c_mkt=opex*0.14;

    // money-flow: +cash (rent green, ancillary amber) rise from the building; −cash (operating red) drain
    if(_anim){
      var litRooms=ROOMS.slice(0,Math.max(1,litCount));
      if(litRooms.length && Math.random()<0.6){ var s1=litRooms[(Math.random()*litRooms.length)|0]; spawnCoin(s1.x,s1.y-4, Math.random()<ancShare?'rec':'ret', -1); }
      var outRate=Math.max(0.05,Math.min(0.6, opex/Math.max(1,revenue)));
      if(litRooms.length && Math.random()<outRate){ var s2=litRooms[(Math.random()*litRooms.length)|0]; spawnCoin(s2.x,s2.y+6,'cost',1); }
      demHist.push(occLive); if(demHist.length>73) demHist.shift();
    }
    drawCoins();
    drawLedger(revenue, ebitda, opex);
    drawDemand(occLive);

    // "+ LEASE-UP" / "+ NEW SCHEME" marker on the letting frontier if growing
    if(G.growing && litCount<NROOM){
      var nxt=ROOMS[Math.min(NROOM-1,litCount)];
      if(nxt){ var pul=0.5+0.5*Math.sin(T*0.12); var mk=(occ<0.6?'+ NEW SCHEME':'+ LEASE-UP');
        ctx.save(); ctx.globalAlpha=0.55+0.4*pul; ctx.fillStyle='#0c6b4f'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
        ctx.fillText(mk,nxt.x,nxt.y-12); ctx.restore();
        glow(nxt.x,nxt.y,8,'rgba(12,107,79,'+(0.25+0.3*pul)+')'); }
    }

    // area label + footer caption + soft vignette
    ctx.save(); ctx.fillStyle='rgba(70,90,80,0.7)'; ctx.font='700 9px Inter,sans-serif'; ctx.textAlign='right'; ctx.fillText(G.area||'',W-20,H-26); ctx.restore();
    ctx.save(); ctx.fillStyle='rgba(60,80,90,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(A.map.footer)+' · '+Math.round(beds)+' beds',W/2,H-9); ctx.restore();
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.5,W/2,H/2,H*1.02);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.10)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- readouts ----
    set('ixCapV',Math.round(beds)+' beds'); set('ixSpreadV',CUR+Math.round(rentWk)+'/wk'); set('ixAvailV',Math.round(occ*100)+'%');
    set('ixDir',Math.round(beds)+' beds'); set('ixDirS',(E.tier||'')+' · '+(E.market||''));
    set('ixMW',kfmt(Math.round(letBeds))+' let'); set('ixMWs',Math.round(occ*100)+'% occupancy · '+weeks+' wks');
    set('ixHr', money(revenue)); set('ixYr', money(ebitda));
    set('ixYrS', (revenue>0?Math.round(ebitda/revenue*100):0)+'% NOI margin');

    drawWaterfall(revenue, [['Staff &amp; mgmt',c_staff],['Utilities',c_util],['Repairs &amp; maint.',c_rm],['Marketing &amp; re-let',c_mkt]], ebitda);
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
    s+=lbl(bx(0)+bw/2, y(rev), 'Rental income', money(rev), '#15201d');
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
    s+=lbl(bx(i)+bw/2, y(Math.max(0,ebitda)), 'EBITDA / NOI', money(ebitda), '#0a5a42');
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
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the occupancy or rent is too low to value — raise the beds, the rent or the occupancy.</span>'; return; }
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
    var ph=document.getElementById('ptHead'); if(ph) ph.innerHTML='<tr><th>Year</th><th>Rental income</th><th>EBITDA / NOI</th><th>Capex</th><th>Unlev. FCF</th><th>Net debt</th><th>Equity FCF</th></tr>';
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
    sCap.min=E.bedMin; sCap.max=E.bedMax; sCap.step=E.bedStep; sCap.value=E.bedDef;
    sSpread.min=E.rentMin; sSpread.max=E.rentMax; sSpread.step=E.rentStep; sSpread.value=E.rentDef;
    sAvail.min=E.occMin; sAvail.max=E.occMax; sAvail.step=E.occStep; sAvail.value=E.occDef;
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
    set('uBuild',CUR+'k'); set('uGrant',CUR+'m'); set('uFloor',CUR+'m'); set('uCap',CUR+'m');
    html('s6intro',A.s6);
    html('breakers',A.breakers.map(function(b){ return '<li>'+b+'</li>'; }).join(''));
    html('ixSrc',A.src+' The interactive figures are illustrative — revenue is operational real estate (beds × weekly rent × occupancy over the tenancy weeks) and the returns model is a simplified DCF with a cap-rate-based (multiple) exit; not a forecast of any specific year, and not investment advice.');
    layout(); frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.bedDef; sSpread.value=E.rentDef; sAvail.value=E.occDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'unite');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
