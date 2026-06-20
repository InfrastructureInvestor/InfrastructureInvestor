/* High-speed rail, data-driven worked examples.
   Six real corridors, one template. Map geometry from rail-geo.js (GEO).
   The interactive figures are illustrative: revenue uses a stylised blended fare and the
   returns model is a simplified DCF, not a forecast of any operator's accounts. */
(function(){
  var HRS=8760;
  var CUR='£';
  var A=null;                 // current asset
  var baseRevYr=0, baseCostYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;

  /* ---------------- formatting ---------------- */
  function money(v){ var n=v<0; v=Math.abs(v); var o;
    if(v>=1e9)o=(v/1e9).toFixed(2)+'bn'; else if(v>=1e6)o=(v/1e6).toFixed(0)+'m';
    else if(v>=1e3)o=Math.round(v/1e3)+'k'; else o=''+Math.round(v);
    return (n?'−':'')+CUR+o; }
  function m1(v){ return (v/1e6).toFixed(1); }
  function set(id,t){ var e=document.getElementById(id); if(e) e.textContent=t; }
  function html(id,t){ var e=document.getElementById(id); if(e) e.innerHTML=t; }
  function fmtFare(v){ var s=(Math.abs(v)<30)?(Math.round(v*100)/100).toString():Math.round(v).toLocaleString(); return CUR+s; }

  /* ===================================================================
     ASSET LIBRARY
  =================================================================== */
  var ASSETS={

  /* ---------- 1 · HS2 (Europe · UK · government mega-project) ---------- */
  hs2:{
    name:'HS2 · High Speed 2', geo:'London ⇄ Birmingham', continent:'Europe', cur:'£', geoKey:'hs2',
    lede:'Britain\'s new high-speed spine, a ~140&nbsp;mile line from London to Birmingham built and funded by the <b>state</b>, where the payoff is capacity on the West Coast corridor, not a commercial return on the build.',
    s1:'<p class="body"><b>High Speed 2</b> is a new 360&nbsp;km/h railway being built by the public company <b>HS2 Ltd</b> on behalf of the UK government. Phase 1 runs from <b>London Euston</b> via a new station at <b>Old Oak Common</b> and an interchange near Solihull to <b>Birmingham Curzon Street</b>, about 225&nbsp;km of new track, much of it in tunnel or cutting to limit its footprint.</p>'+
       '<p class="body">Its purpose is not speed for its own sake but <b>capacity</b>: by taking fast inter-city trains off the congested West Coast Main Line, it frees the existing network for commuter and freight services. It is the clearest example here of a railway justified on <b>strategic and network grounds</b>, the cost will never be recovered from fares alone.</p>',
    facts:[['~225 km','Phase 1 route','London → Birmingham'],['360 km/h','Design speed','one of the fastest'],['£45–66 bn','Phase 1 cost','est., 2024 prices'],['~2029–33','First services','window (delayed)'],['Public','Owner','HS2 Ltd / DfT'],['WCP','Train operator','access-charge payer']],
    s2:'A railway like HS2 separates the <b>infrastructure</b> (track, tunnels, stations, the regulated asset) from the <b>train operator</b> that runs the trains and pays a track-access charge for every path. The model below runs on the line\'s projected fare-box once open. Drag the sliders, ridership, the average fare and the premium-class share, but keep one eye on the capital: against a £45–66bn build, the commercial return stays deeply negative. That is the point.',
    driverLab:'Avg fare', availLab:'Premium share', hrK:'Fares captured /hr', yrS:'projected fare-box',
    preset:'Load HS2',
    try:'<b>Try this:</b> wind ridership and the fare to their maximum and watch the returns model, the IRR stays dismal, because <b>~£60&nbsp;billion</b> of capital cannot be repaid by a fast train between two cities. HS2\'s return is the capacity it releases on the rest of the network, not its own fare-box. The figures here are <i>projected</i>: the line is not yet open.',
    s3:'Once running, HS2 earns the way every railway does, a <b>fare</b> on every passenger, weighted up for premium seats, plus station retail. But the revenue is trivial against the capital. Its value is <b>strategic</b>: released paths for commuters and freight on the West Coast corridor, faster city-to-city links, and regional regeneration around the new stations. Demand is real and inelastic on a flagship route, yet no fare can carry a £60bn build, which is exactly why the state, not a fund, paid for it.',
    mb:{tag:'Model B · government build',title:'State-funded strategic line',body:'The government funds a nation-building railway whose payoff is <b>network capacity and regional growth</b>, not fare cash; the commercial return is explicitly negative, and a separate train operator pays access charges to run the trains. <b>This is HS2</b>, built by HS2 Ltd for the Department for Transport, repeatedly rescoped on cost, justified on the paths it frees up elsewhere rather than a hurdle rate.'},
    s4a:'A new high-speed railway is among the most expensive things a state can build, tunnels, viaducts, slab track and city-centre stations, and it is costly to keep, with renewals, energy and signalling running into the hundreds of millions a year. So even on optimistic ridership the operating margin sits well below the fare-box you might expect, and the capital dwarfs everything. The waterfall makes the mismatch visible.',
    wfNote:'Operating cost is the upkeep of track, structures and signalling, traction energy, and station operations across the whole route, a heavy, largely fixed base. On a brand-new asset the renewals bill is modest at first but the capital charge underneath is enormous, which is why the fare-box can never carry it.',
    s4b:'Phase 1 is now estimated at <b>£45–66&nbsp;billion</b> (2024 prices), up from an original ~£20bn-era budget, the textbook cost-overrun cautionary tale, after the eastern leg to Leeds and the Manchester leg were cancelled. It is funded almost entirely by <b>government grant</b>: there is no private equity in the line itself, and no expectation that fares repay the build.',
    stackH:'The capital stack · £45–66 bn', splitL:'How it is funded', splitR:'public grant',
    split:[['s1',100,'UK government grant, 100%']],
    finList:[['','UK government funding (HM Treasury / DfT)','£45–66bn'],['sub','Phase 1 only, Birmingham legs descoped','2023'],['','Old Oak Common opens first; Euston staged','phasing'],['sub','Train operator, West Coast Partnership','access charges'],['','Private equity in the line','none'],['rest','Benefit–cost ratio (official, incl. wider)','~0.8–1.2×']],
    finNote:'There is no equity and no commercial repayment plan: HS2 is a <b>public-spending decision</b>, not a project-financed asset. The "stack" is the taxpayer\'s balance sheet, and the case rests on released network capacity and regional growth, benefits that sit outside any single fare-box P&amp;L.',
    timeline:[['2009','<b>HS2 Ltd formed</b> to develop the scheme.'],['2017','<b>Phase 1 Act</b> receives Royal Assent, powers to build London–Birmingham.'],['2020','<b>Main civils start</b>, tunnels and viaducts begin.'],['2021/23','<b>Eastern (Leeds) and Manchester legs cancelled</b>, scope cut to Phase 1.'],['2024','<b>Cost reset</b> to £45–66bn (2024 prices); Euston funding revisited.'],['~2029–33','<b>First services</b> targeted (Old Oak Common → Birmingham window).']],
    calcNote:'A working model that deliberately shows a <b>strategic</b> asset failing the commercial test. Push ridership and the fare as hard as you like: against ~£60bn of capital the <b style="color:#0c6b4f">IRR</b> stays far below any hurdle. The grant input captures the government funding; even net of it, the fare-box cannot carry the build. The return here is national, not financial, and the figures are projected, since the line is not yet open.',
    s6:'HS2 is the limit case of the strategic railway: transformational capacity, immaterial fare economics. What actually drives its value:',
    breakers:['<b>Scope &amp; cost</b>, the budget has trebled and the network has shrunk; what gets built is a political decision, not a market one.','<b>Released capacity</b>, the real benefit is paths freed for commuters and freight on the West Coast corridor.','<b>Ridership</b>, once open, demand on a London–Birmingham flagship is reliable, but can never repay the capital.','<b>Strategic, not financial</b>, the case is national: regeneration, connectivity and decarbonised long-distance travel.'],
    src:'Figures from public sources: <a href="https://www.gov.uk/government/organisations/high-speed-two-limited" target="_blank" rel="noopener">HS2 Ltd / DfT</a>, the <a href="https://www.nao.org.uk/" target="_blank" rel="noopener">National Audit Office</a> on cost, and the <a href="https://committees.parliament.uk/" target="_blank" rel="noopener">Public Accounts Committee</a>. Ridership and fare inputs are <b>projected</b> illustrative values, the line is not yet open, and costs vary widely by source and scope.',
    econ:{cur:'£',hgvMult:2.2,anc:120,fixed:0,
      trafficDef:200000,trafficMin:80000,trafficMax:360000,trafficStep:5000,
      tollDef:38,tollMin:15,tollMax:90,tollStep:1,
      heavyDef:15,heavyMin:5,heavyMax:30},
    opex:{inspect:430,major:320,collect:1.6,admin:170,concRate:0.03},
    calc:{build:60000,grant:8000,capex:6,revG:2,floor:0,cap:8000,tax:25,exit:6,lev:2,rd:5,amort:2,hold:30},
    map:{
      labels:[['GREAT BRITAIN',-1.70,53.30,'land'],['NORTH SEA',0.95,54.10,'sea'],['CELTIC SEA',-5.30,51.00,'seafaint']],
      route:[[-0.133,51.529],[-0.30,51.55],[-0.58,51.64],[-0.90,51.80],[-1.20,52.00],[-1.50,52.22],[-1.74,52.42],[-1.886,52.481]],
      stops:[{lng:-0.133,lat:51.529,label:'London Euston',sub:'central terminus',below:true},
             {lng:-1.72,lat:52.42,label:'Interchange',sub:'Solihull · Birmingham Airport',below:true},
             {lng:-1.886,lat:52.481,label:'Curzon Street',sub:'Birmingham',below:false}],
      fareAt:0.5,
      footer:'New 360 km/h line · London → Birmingham · Phase 1 ~225 km'}
  },

  /* ---------- 2 · TGV (Europe · France · state incumbent operator) ---------- */
  tgv:{
    name:'TGV · LGV Sud-Est & Méditerranée', geo:'Paris ⇄ Lyon ⇄ Marseille', continent:'Europe', cur:'€', geoKey:'tgv',
    lede:'The line that invented modern high-speed rail, Paris to Lyon and on to Marseille, run by the state operator <b>SNCF</b> as a genuinely <b>profitable</b> flagship, and now the first to face open-access competition.',
    s1:'<p class="body">The <b>LGV Sud-Est</b>, opened in 1981, was the world\'s first modern high-speed line: Paris to Lyon in two hours, cutting the journey in half. The <b>LGV Méditerranée</b> later extended fast running to Marseille. Together they form France\'s busiest TGV axis, operated by <b>SNCF Voyageurs</b> over track owned by <b>SNCF Réseau</b>.</p>'+
       '<p class="body">Unusually for a railway, the Paris–Lyon corridor has been <b>reliably profitable</b> for decades, dense demand, premium pricing and trains that turn around fast. That profitability is exactly why it now draws <b>competition</b>: open-access operators like Trenitalia run their own high-speed trains on the same tracks, paying SNCF Réseau for access.</p>',
    facts:[['1981','LGV Sud-Est opens','Paris → Lyon'],['~2 hr','Paris–Lyon','from ~4 hr'],['320 km/h','Top speed','TGV / Avelia'],['~40 m+','Passengers / yr','Paris–Lyon axis'],['SNCF','Operator','+ open access'],['€','Profitable','flagship corridor']],
    s2:'A TGV corridor blends two businesses: the <b>operator</b> (SNCF Voyageurs) that sells tickets and takes ridership risk, and the <b>infrastructure manager</b> (SNCF Réseau) that owns the track and earns access charges. The model below looks at the corridor as a commercial operator. Drag ridership, the average fare and the first-class share, and notice how a dense, premium-priced flagship line throws off real margin, unlike most railways.',
    driverLab:'Avg fare', availLab:'1st-class share', hrK:'Fares captured /hr', yrS:'a profitable flagship line',
    preset:'Load the TGV corridor',
    try:'<b>Try this:</b> nudge the first-class share up, TGV pricing is strongly <b>yield-managed</b>, so a richer premium mix lifts revenue faster than volume alone. The corridor\'s edge is density and turnaround: the same trainset runs Paris–Lyon several times a day, spreading the fixed cost of the rolling stock and the line across a huge number of paid seats.',
    s3:'On a flagship like Paris–Lyon the operator earns a <b>fare</b> on every seat, sharply yield-managed by time and demand, with a premium for first class and ancillary income on top. Because the corridor is dense and the trains turn fast, the fixed cost of the rolling stock and access charges is spread across enormous volume, so the line earns a genuine <b>operating profit</b>. The new risk is <b>competition</b>: open access narrows the incumbent\'s margin even as it grows the market.',
    mb:{tag:'Model B · incumbent operator',title:'State operator, open to competition',body:'A national operator runs the trains over state-owned track, takes the <b>ridership risk</b> and keeps the fares, paying a regulated access charge to the infrastructure manager, on a corridor dense enough to be reliably profitable, now opening to <b>open-access</b> rivals. <b>This is the TGV</b>, SNCF Voyageurs over SNCF Réseau track, with Trenitalia and others entering the same Paris–Lyon market.'},
    s4a:'A high-speed operator\'s biggest costs are <b>access charges</b> for the paths it runs, <b>traction energy</b>, and the financing and maintenance of its rolling stock, plus crews and stations. Much of this scales with the service it runs rather than the seats it sells, so a full train is dramatically more profitable than a half-empty one. The waterfall shows fares net of those costs.',
    wfNote:'Operating cost is dominated by track-access charges and energy that scale with the trains run, plus rolling-stock maintenance, crews and station costs. Load factor is everything: the same path costs the same whether the train is full or half-empty, so yield management to fill premium seats is what protects the margin.',
    s4b:'The corridor was built by the French state, but the relevant capital for an operator today is the <b>rolling stock and the franchise/access rights</b>, a TGV/Avelia trainset runs into the tens of millions of euros, and a fleet to serve the axis is a multi-billion-euro commitment. Modelled on an enterprise-value basis, the line is one of the few railways that comfortably clears a commercial return.',
    stackH:'The capital stack · operator basis', splitL:'How it is funded', splitR:'EV basis',
    split:[['s1',55,'Debt / leasing 55%'],['s2',45,'Equity / SNCF capital 45%']],
    finList:[['','Rolling stock (TGV / Avelia Horizon fleet)','€ multi-bn'],['sub','New double-deck sets ~€25–30m each','Alstom'],['','Track-access charges to SNCF Réseau','per path'],['sub','Among the highest in Europe','regulated'],['','Open-access entrants (Trenitalia, others)','since 2021'],['rest','Corridor operating margin','genuinely positive']],
    finNote:'Unlike most of this list, the Paris–Lyon corridor <b>makes money</b>: dense, premium demand over a fixed cost base produces real margin, which is why SNCF historically used it to cross-subsidise thinner routes. The threat to the stack is competition, open access transfers some of that surplus to passengers and rivals.',
    timeline:[['1976','<b>Construction begins</b> on the LGV Sud-Est.'],['Sep 1981','<b>Paris–Lyon opens</b>, the first modern high-speed line.'],['2001','<b>LGV Méditerranée</b> extends fast running to Marseille.'],['2010s','<b>Record volumes</b>, the axis becomes SNCF\'s profit engine.'],['Dec 2021','<b>Trenitalia enters</b> Paris–Lyon–Milan, open-access competition begins.'],['2020s','<b>Avelia Horizon</b> next-generation double-deck sets ordered.']],
    calcNote:'A working model calibrated to a <b>profitable incumbent operator</b>. The fare and load factor do the work; the cost of debt reflects French rates and the leasing of rolling stock. Watch the <b style="color:var(--accent)">levered IRR</b>, a dependable, growing fare-box supports gearing, but remember open-access competition is now eroding the very margin that makes this line exceptional.',
    s6:'TGV Paris–Lyon is the rare railway that pays its way. What moves the result:',
    breakers:['<b>Load factor &amp; yield</b>, filling premium seats on a dense corridor is the whole game; aggressive yield management protects margin.','<b>Competition</b>, open access (Trenitalia and others) grows the market but transfers surplus to passengers and rivals.','<b>Access charges &amp; energy</b>, French track-access charges are among Europe\'s highest, and traction energy moves with power prices.','<b>Rolling stock</b>, fleet renewal (Avelia Horizon) is a multi-billion commitment that sets the capital base.'],
    src:'Figures from public sources: <a href="https://www.sncf.com/en" target="_blank" rel="noopener">SNCF</a> and <a href="https://www.sncf-reseau.com/en" target="_blank" rel="noopener">SNCF Réseau</a>, the regulator <a href="https://www.autorite-transports.fr/en/" target="_blank" rel="noopener">ART</a> on access charges and open access, and <a href="https://www.alstom.com/" target="_blank" rel="noopener">Alstom</a> on the Avelia Horizon fleet. Corridor revenue and margin figures are illustrative and not SNCF\'s reported segment accounts.',
    econ:{cur:'€',hgvMult:1.8,anc:90,fixed:0,
      trafficDef:100000,trafficMin:40000,trafficMax:180000,trafficStep:5000,
      tollDef:62,tollMin:25,tollMax:140,tollStep:1,
      heavyDef:20,heavyMin:8,heavyMax:40},
    opex:{inspect:120,major:160,collect:9,admin:140,concRate:0.18},
    calc:{build:16000,grant:0,capex:8,revG:2,floor:0,cap:4000,tax:25,exit:11,lev:4,rd:4,amort:3,hold:25},
    map:{
      labels:[['FRANCE',0.95,46.70,'land'],['MEDITERRANEAN',5.30,42.55,'sea'],['ATLANTIC',-3.60,45.40,'seafaint']],
      route:[[2.373,48.844],[2.80,47.95],[3.55,47.15],[4.25,46.45],[4.78,45.95],[4.859,45.760],[4.86,45.10],[4.82,44.45],[4.80,43.98],[5.12,43.58],[5.380,43.303]],
      stops:[{lng:2.373,lat:48.844,label:'Paris Gare de Lyon',sub:'origin',below:false},
             {lng:4.859,lat:45.760,label:'Lyon Part-Dieu',sub:'hub',below:true},
             {lng:5.380,lat:43.303,label:'Marseille St-Charles',sub:'Mediterranean',below:true}],
      fareAt:0.32,
      footer:'LGV Sud-Est + Méditerranée · Paris → Lyon → Marseille · 320 km/h'}
  },

  /* ---------- 3 · TŌKAIDŌ SHINKANSEN (Asia · Japan · privatised operator) ---------- */
  tokaido:{
    name:'Tōkaidō Shinkansen', geo:'Tokyo ⇄ Nagoya ⇄ Osaka', continent:'Asia · Japan', cur:'¥', geoKey:'tokaido',
    lede:'The original bullet train and the most intensively used high-speed line on earth, Tokyo to Osaka, run by privatised <b>JR Central</b> as a formidably profitable, self-funding business.',
    s1:'<p class="body">The <b>Tōkaidō Shinkansen</b>, opened for the 1964 Olympics, links the three great cities of Japan\'s Pacific coast, <b>Tokyo, Nagoya and Osaka</b>, over 515&nbsp;km. It is the busiest high-speed line in the world, running trains as often as every few minutes at up to 285&nbsp;km/h with legendary punctuality measured in seconds.</p>'+
       '<p class="body">It is owned and run by <b>Central Japan Railway (JR Central)</b>, privatised out of Japanese National Railways in 1987 and listed on the Tokyo Stock Exchange. JR Central is <b>vertically integrated</b>, it owns the track, the trains and the stations, and the Tōkaidō line alone generates the great majority of its profit, funding everything from station property to the new maglev.</p>',
    facts:[['515 km','Tokyo → Osaka','via Nagoya'],['1964','Opened','first bullet train'],['~285 km/h','Top speed','N700S sets'],['~450,000','Passengers / day','busiest HSR'],['JR Central','Owner','listed, private'],['~0.9 min','Avg delay','famous punctuality']],
    s2:'JR Central is a <b>vertically integrated</b> railway: it owns the track and the trains and keeps every fare, so there is no access-charge split, the whole value chain sits in one P&amp;L. The model below runs on the line\'s fare-box. Drag ridership, the average fare and the Green-car (premium) share; because the corridor is so dense and the cost base so well-spread, an extraordinarily high share of each extra fare drops to profit.',
    driverLab:'Avg fare', availLab:'Green-car share', hrK:'Fares captured /hr', yrS:'to JR Central',
    preset:'Load the Tōkaidō Shinkansen',
    try:'<b>Try this:</b> push ridership up, the Tōkaidō line carries around <b>450,000 people a day</b>, and the operating leverage is dramatic. The track, signalling and trains cost roughly the same whether they run full or not, so on the world\'s densest high-speed corridor the margin is among the best in all of transport infrastructure.',
    s3:'A vertically integrated operator earns the <b>full fare</b>, no charge to a separate track owner, weighted up for Green-car seats, plus very large <b>station retail and property</b> income at Tokyo, Nagoya and Osaka. With demand dense and inelastic and the cost base highly fixed, JR Central converts an exceptional share of revenue into profit and cash, which it has historically reinvested, most dramatically into the <b>Chūō Shinkansen maglev</b> being built largely off its own balance sheet.',
    mb:{tag:'Model B · privatised operator',title:'Vertically integrated, listed railway',body:'A privatised, stock-exchange-listed company <b>owns the track, the trains and the stations</b> and keeps every fare, running the world\'s busiest high-speed line at a margin most infrastructure can only envy, and self-funding huge new projects from the cash it throws off. <b>This is JR Central</b>, privatised from Japanese National Railways in 1987, with the Tōkaidō line as its profit engine.'},
    s4a:'Even the busiest railway is costly to run, track and structures renewals, traction energy, train maintenance and station operations across 515&nbsp;km, but JR Central spreads that almost-fixed base across a colossal number of fares, so the margin is exceptional. The waterfall shows the fare-box net of those operating costs.',
    wfNote:'Operating cost is renewals of track and structures, traction energy, maintenance of a large fleet, and station operations. It is heavy in absolute terms but spread across ~450,000 daily passengers, so the margin is among the highest in transport, the dividend of extreme density and operating leverage.',
    s4b:'The original line was built by the state in the 1960s; the relevant capital for JR Central today is the <b>enterprise value</b> of a listed, cash-generative railway, and, looming over it, the ~¥7&nbsp;trillion <b>Chūō Shinkansen maglev</b> it is funding largely itself. Modelled on an EV basis, the Tōkaidō line is one of the most attractive transport assets in the world, which is why it trades accordingly.',
    stackH:'The capital stack · listed company', splitL:'How it is funded', splitR:'EV basis',
    split:[['s1',45,'Bonds / debt 45%'],['s2',55,'Listed equity 55%']],
    finList:[['','JR Central, listed (Tokyo Stock Exchange)','¥ multi-tn'],['sub','Tōkaidō line, bulk of group profit','vertically integrated'],['','Self-funded maglev (Chūō Shinkansen)','~¥7tn'],['sub','Built largely off balance sheet + state loan','to ~2030s'],['','Station property &amp; retail income','large, stable'],['rest','Operating margin','exceptionally high']],
    finNote:'JR Central\'s stack is a conventional <b>listed-equity-plus-bonds</b> structure, but the cash generation is anything but ordinary: the Tōkaidō line funds the dividend, the renewals <i>and</i> a multi-trillion-yen maglev. The chief risk is the scale of that self-funded build against a single, mature corridor.',
    timeline:[['Oct 1964','<b>Tōkaidō Shinkansen opens</b> for the Tokyo Olympics.'],['1987','<b>JNR privatised</b>, JR Central created and the line transferred.'],['1990s–2000s','<b>JR Central lists</b>; N700-series sets raise speed and capacity.'],['2020','<b>N700S</b> enters service, latest-generation trains.'],['2020–21','<b>COVID</b> slashes ridership; rapid recovery follows.'],['2027+','<b>Chūō Shinkansen maglev</b> (Tokyo–Nagoya) targeted, self-funded.']],
    calcNote:'A working model on a <b>privatised, vertically integrated</b> railway. With the full fare retained and a vast, dense ridership, the modelled return is strong and the cash flow stable, note the low cost of debt (Japanese rates) and the high exit multiple a scarce, dominant corridor commands. The swing factor a real investor watches is the self-funded maglev sitting behind these numbers.',
    s6:'The Tōkaidō line is the gold standard of high-speed rail economics. What drives it:',
    breakers:['<b>Density &amp; operating leverage</b>, ~450,000 passengers a day over a fixed cost base is the source of the margin.','<b>Pricing &amp; mix</b>, fares are stable and the Green-car premium adds yield; demand is inelastic on the core corridor.','<b>The maglev</b>, the self-funded Chūō Shinkansen is the great call on future cash and the main balance-sheet risk.','<b>Macro &amp; shocks</b>, Japanese rates keep financing cheap, but the line is exposed to recession, disasters and demographics.'],
    src:'Figures from public sources: <a href="https://global.jr-central.co.jp/en/" target="_blank" rel="noopener">JR Central (Central Japan Railway)</a> investor and company data, and reporting on Tōkaidō ridership and the <a href="https://global.jr-central.co.jp/en/company/about_maglev/" target="_blank" rel="noopener">Chūō Shinkansen maglev</a>. Per-passenger fare and margin inputs are illustrative, not JR Central\'s reported segment accounts.',
    econ:{cur:'¥',hgvMult:1.4,anc:60000,fixed:0,
      trafficDef:420000,trafficMin:200000,trafficMax:520000,trafficStep:10000,
      tollDef:9000,tollMin:4000,tollMax:14000,tollStep:200,
      heavyDef:12,heavyMin:5,heavyMax:25},
    opex:{inspect:260000,major:230000,collect:1200,admin:140000,concRate:0.05},
    calc:{build:5400000,grant:0,capex:10,revG:1.5,floor:0,cap:2500000,tax:30,exit:9,lev:3,rd:1.5,amort:3,hold:25},
    map:{
      labels:[['JAPAN',138.40,36.70,'land'],['PACIFIC OCEAN',138.60,33.30,'sea'],['SEA OF JAPAN',134.40,37.40,'seafaint']],
      route:[[139.767,35.681],[139.45,35.34],[138.70,35.12],[137.85,34.97],[137.20,35.07],[136.882,35.170],[136.25,35.10],[135.768,34.986],[135.60,34.82],[135.500,34.733]],
      stops:[{lng:139.767,lat:35.681,label:'Tokyo',sub:'eastern terminus',below:false},
             {lng:136.882,lat:35.170,label:'Nagoya',sub:'midpoint hub',below:false},
             {lng:135.500,lat:34.733,label:'Shin-Osaka',sub:'western terminus',below:true}],
      fareAt:0.5,
      footer:'Tōkaidō Shinkansen · Tokyo → Nagoya → Osaka · 515 km · ~285 km/h'}
  },

  /* ---------- 4 · BRIGHTLINE (North America · USA · private operator) ---------- */
  brightline:{
    name:'Brightline Florida', geo:'Miami ⇄ Orlando', continent:'North America', cur:'$', geoKey:'brightline',
    lede:'America\'s only private intercity passenger railroad, Miami to Orlando, built and run for profit by a developer, with station real estate as much a part of the case as the fares.',
    s1:'<p class="body"><b>Brightline</b> is a privately owned and operated higher-speed railway linking <b>Miami</b>, Fort Lauderdale and West Palm Beach up the Florida coast, then turning inland to <b>Orlando International Airport</b>, about 378&nbsp;km, with trains up to 200&nbsp;km/h on the Orlando segment. It is the only privately run intercity passenger service in the United States.</p>'+
       '<p class="body">It was developed by <b>Fortress Investment Group</b> (Florida East Coast Industries), reusing a freight corridor and adding new track to Orlando. The model is deliberately commercial and <b>real-estate-led</b>: stations anchor mixed-use development, and the railway is financed largely with <b>tax-exempt private activity bonds</b> rather than government grant.</p>',
    facts:[['~378 km','Miami → Orlando','coast then inland'],['200 km/h','Top speed','Orlando segment'],['~$6 bn','Build cost','incl. Orlando extension'],['2018 / 2023','Opened','Miami leg / Orlando'],['Private','Owner','Fortress / FECI'],['PABs','Financing','tax-exempt bonds']],
    s2:'Brightline takes the <b>full commercial risk</b> of a railway in a car-dominated market: it owns the trains and the corridor, sells the tickets, and lives or dies by ridership. The model below runs on its ramping fare-box plus ancillary and real-estate income. Drag ridership, the average fare and the premium-class share, and note that as a young service still scaling, the capital sits well ahead of the cash, so the returns hinge on the ramp.',
    driverLab:'Avg fare', availLab:'Premium share', hrK:'Fares captured /hr', yrS:'fares + ancillary',
    preset:'Load Brightline',
    try:'<b>Try this:</b> push ridership up the range, Brightline is a <b>ramp story</b>, growing passengers and revenue fast off a low base. The premium "SMART vs PREMIUM" fare split matters: a richer premium mix lifts the average fare quickly. But against ~$6bn of build cost and US-rate debt, the line needs both volume <i>and</i> its station real estate to clear a return.',
    s3:'Brightline earns a <b>fare</b> on every passenger, with a meaningful premium cabin, plus ancillary income (food, parking, partnerships) and, central to the thesis, <b>real-estate value</b> created around its stations. As the only private intercity railroad in the US it has no fare regulation and full pricing freedom, but it carries the whole demand risk in a market built around the car, so the ramp in ridership is the make-or-break variable.',
    mb:{tag:'Model B · private operator',title:'For-profit, real-estate-led railway',body:'A private developer builds and runs an intercity railway entirely for profit, taking <b>full ridership risk</b>, pricing freely, and capturing value through <b>station real estate</b> as much as fares, financed with tax-exempt private activity bonds, not government grant. <b>This is Brightline</b>, Fortress/FECI, Miami–Orlando, with a Las Vegas–Southern California line in construction.'},
    s4a:'A private railway carries the costs every operator does, train crews and maintenance, energy, track and station O&amp;M, and grade-crossing safety, but on a still-ramping line those costs are spread over a thin, growing ridership, so early margins are slim. The waterfall shows fares and ancillary income net of operating costs; the margin improves sharply as the ramp fills the trains.',
    wfNote:'Operating cost is train operations and maintenance, energy, station and corridor upkeep, and safety/insurance. On a young service the fixed element dominates a still-thin ridership, so the margin is modest today and improves with every point of ridership growth, operating leverage working in the company\'s favour as it scales.',
    s4b:'Miami–Orlando cost roughly <b>$6&nbsp;billion</b> including the new Orlando extension, funded largely with <b>tax-exempt private activity bonds</b> plus sponsor equity from Fortress, not government grant. That heavy, US-priced debt load is the central tension: the railway must ramp ridership and realise station real-estate value fast enough to service it.',
    stackH:'The capital stack · ~$6 bn', splitL:'How it is funded', splitR:'private + bonds',
    split:[['s1',70,'Private activity bonds 70%'],['s2',30,'Sponsor equity 30%']],
    finList:[['','Tax-exempt private activity bonds (PABs)','majority'],['sub','Issued through state conduits','high-yield'],['','Sponsor equity, Fortress / FECI','balance'],['sub','Station real estate &amp; development','value capture'],['','Government grant in the line','none / minimal'],['rest','Las Vegas–SoCal line','in construction']],
    finNote:'Brightline\'s stack is genuinely <b>private</b>, bonds and equity, not grant, which makes it the closest thing the US has to a market-financed railway. The risk is that the debt is large and the ridership young: the case leans heavily on the ramp and on monetising station real estate, not on fares alone.',
    timeline:[['2012','<b>Project launched</b> by Florida East Coast Industries (Fortress).'],['2018','<b>Miami–West Palm Beach opens</b> (as Brightline).'],['2023','<b>Orlando extension opens</b>, 200 km/h running, ridership jumps.'],['2023','<b>Las Vegas–SoCal line</b> breaks ground.'],['2024','<b>Ridership and revenue ramp</b> sharply on the full Florida line.'],['2020s','<b>Station real estate</b> developed to capture land value.']],
    calcNote:'A working model on a <b>private, ramping</b> railway. Revenue growth is set high to reflect the early ridership ramp, and the cost of debt is high to reflect US rates on the PABs. Watch how sensitive the <b style="color:var(--accent)">levered IRR</b> is to ridership growth, and remember the real case includes station real estate that this fare-box model only partly captures.',
    s6:'Brightline is the test of whether intercity rail can be a private business in a car market. What drives it:',
    breakers:['<b>The ramp</b>, ridership growth off a low base is everything; the whole return hinges on filling the trains.','<b>Real estate</b>, station-anchored development is core to the thesis, not a side benefit.','<b>Cost of capital</b>, a large, US-priced tax-exempt bond load sets a high bar the fare-box must clear.','<b>Mode shift</b>, persuading drivers and flyers onto the train in a car-dominated market is the demand risk.'],
    src:'Figures from public sources: <a href="https://www.gobrightline.com/" target="_blank" rel="noopener">Brightline</a>, bond disclosures via the <a href="https://emma.msrb.org/" target="_blank" rel="noopener">MSRB EMMA</a> system, and reporting on the Orlando extension and ridership ramp. Ridership, fare and real-estate inputs are illustrative and approximate.',
    econ:{cur:'$',hgvMult:1.7,anc:260,fixed:0,
      trafficDef:12000,trafficMin:3000,trafficMax:32000,trafficStep:500,
      tollDef:36,tollMin:12,tollMax:90,tollStep:1,
      heavyDef:20,heavyMin:8,heavyMax:40},
    opex:{inspect:120,major:75,collect:1.8,admin:75,concRate:0.04},
    calc:{build:6000,grant:0,capex:8,revG:7,floor:0,cap:1500,tax:25,exit:14,lev:5,rd:8,amort:1,hold:20},
    map:{
      labels:[['FLORIDA',-81.70,28.80,'land'],['ATLANTIC OCEAN',-79.85,27.30,'sea'],['GULF OF MEXICO',-83.10,27.10,'seafaint']],
      route:[[-80.191,25.779],[-80.16,26.00],[-80.143,26.122],[-80.10,26.45],[-80.054,26.712],[-80.05,27.30],[-80.20,27.95],[-80.62,28.32],[-81.05,28.42],[-81.308,28.429]],
      stops:[{lng:-80.191,lat:25.779,label:'MiamiCentral',sub:'southern terminus',below:true},
             {lng:-80.054,lat:26.712,label:'West Palm Beach',sub:'coast',below:false},
             {lng:-81.308,lat:28.429,label:'Orlando',sub:'airport terminus',below:true}],
      fareAt:0.4,
      footer:'Brightline · Miami → West Palm Beach → Orlando · ~378 km · up to 200 km/h'}
  },

  /* ---------- 5 · HARAMAIN (Middle East · Saudi Arabia · sovereign + O&M concession) ---------- */
  haramain:{
    name:'Haramain High-Speed Railway', geo:'Mecca ⇄ Jeddah ⇄ Medina', continent:'Middle East', cur:'SAR ', geoKey:'haramain',
    lede:'The pilgrims\' express, 450&nbsp;km from Mecca to Medina via Jeddah and KAEC, a <b>sovereign-funded</b> railway whose demand is the Hajj and Umrah, run under a foreign <b>operations &amp; maintenance concession</b>.',
    s1:'<p class="body">The <b>Haramain High-Speed Railway</b> links Islam\'s two holiest cities, <b>Mecca and Medina</b>, via <b>Jeddah</b> (and its airport) and <b>King Abdullah Economic City</b>, 450&nbsp;km of 300&nbsp;km/h railway across the western desert. It was built to move the enormous, intensely <b>seasonal</b> flows of pilgrims performing the Hajj and Umrah, off the roads and into air-conditioned trains.</p>'+
       '<p class="body">It was funded by the <b>Saudi state</b> and built by international consortia; a <b>Spanish-led group (Al Shoula, including Renfe)</b> won the contract to operate and maintain it for twelve years. So the asset splits cleanly: a sovereign owner of the railway, and a foreign operator paid to run it, its payoff measured in pilgrim throughput and national prestige, not an equity IRR.</p>',
    facts:[['450 km','Mecca → Medina','via Jeddah / KAEC'],['300 km/h','Top speed','desert running'],['~US$16 bn','Project cost','phases 1 + 2'],['2018','Opened','full service'],['60 m/yr','Design capacity','pilgrim peaks'],['Renfe-led','Operator','12-yr O&amp;M']],
    s2:'Haramain separates a <b>sovereign owner</b> from a contracted <b>operator</b>: the Saudi state owns the railway and pays the Al Shoula/Renfe consortium to run and maintain it, while fares are kept modest to serve pilgrims. The model below runs on the fare-box. Drag ridership, the average fare and the business-class share, but the defining feature is <b>seasonality</b>: demand swells enormously around Hajj and Ramadan and is thin in between.',
    driverLab:'Avg fare', availLab:'Business share', hrK:'Fares captured /hr', yrS:'fares + commercial',
    preset:'Load the Haramain railway',
    try:'<b>Try this:</b> swing ridership across its range to feel the <b>seasonality</b>, the line is built for 60 million passengers a year at Hajj and Umrah peaks, yet runs far quieter between them. Because the operator is paid under an O&amp;M contract and the state owns the asset, the fare-box is about serving pilgrims affordably, not maximising a return.',
    s3:'Haramain earns a <b>fare</b> on every pilgrim, with a business-class premium and some commercial income at stations, but fares are deliberately <b>moderate</b>, the asset exists to serve the Hajj, not to maximise revenue. Its value is partly commercial and largely <b>strategic and religious</b>: moving millions of pilgrims safely and fast is a sovereign duty. The operator earns a contracted O&amp;M margin; the demand risk and the capital sit with the state.',
    mb:{tag:'Model B · sovereign + O&M',title:'State-owned, contractor-operated line',body:'The state funds and owns a strategic railway and pays a specialist consortium to <b>operate and maintain</b> it for a fixed term, keeping fares affordable for the public purpose it serves. The contractor earns an O&amp;M margin; the state carries the capital and demand risk. <b>This is Haramain</b>, Saudi-funded, run by the Al Shoula/Renfe-led group under a 12-year concession.'},
    s4a:'Running a 450&nbsp;km railway across the desert is demanding, sand, heat and extreme peak loads, but the cost is largely the contracted <b>O&amp;M</b> plus energy, and the state carries the capital. Against a fare-box swollen at Hajj and thin between, the margin is volatile. The waterfall shows fares net of operating costs at the current setting.',
    wfNote:'Operating cost is the O&amp;M contract, maintenance of track, trains and stations in a harsh desert environment, plus traction energy and station operations. Much of it is fixed regardless of season, so the margin is feast-or-famine: strong at pilgrim peaks, thin in the quiet months.',
    s4b:'The project cost roughly <b>US$16&nbsp;billion</b> across its phases, funded by the <b>Saudi government</b>: stations by one consortium, the rail systems and operations by the Spanish-led Al Shoula group. There is no private equity in the line, it is a sovereign asset, and the operator\'s capital at risk is essentially its O&amp;M performance, not the railway itself.',
    stackH:'The capital stack · ~US$16 bn', splitL:'How it is funded', splitR:'sovereign',
    split:[['s1',100,'Saudi state, funded; contractor-operated']],
    finList:[['','Saudi government funding (construction)','~US$16bn'],['sub','Phase 1 stations + Phase 2 rail systems','two consortia'],['','O&amp;M concession, Al Shoula (incl. Renfe)','12 years'],['sub','Spanish-led; ~SAR billions contract','operate &amp; maintain'],['','Fares, kept moderate for pilgrims','public purpose'],['rest','Saudi Railways / SAR','public owner']],
    finNote:'There is no return hurdle on the railway itself: it was <b>funded by the state</b> and is run by a contractor for a fee. The investable angle is the <b>O&amp;M concession</b>, a service margin, not asset ownership, while the strategic payoff (pilgrim mobility, Vision 2030 connectivity) accrues to the Kingdom.',
    timeline:[['2009','<b>Contracts awarded</b>, Saudi Binladin (stations) and Al Shoula (rail systems).'],['2018','<b>Full service opens</b> Mecca–Jeddah–KAEC–Medina.'],['2019','<b>Ramp-up</b>, services scale toward pilgrim demand.'],['2020–21','<b>COVID</b> suspends services during pilgrimage restrictions.'],['2022+','<b>Recovery</b> as Hajj and Umrah volumes rebound.'],['2020s','<b>Vision 2030</b> integration, feeder links and tourism growth.']],
    calcNote:'A working model on a <b>sovereign</b> railway with a contracted operator. Tax is nil and fares are moderate, so the modelled return is shaped by the grant (state funding) and the seasonal ridership, push it to a pilgrim peak and the economics look healthy, but the line is not run for that return. The investable return here is the O&amp;M margin, not the asset.',
    s6:'Haramain is a sovereign railway with a religious purpose and a contractor\'s margin. What moves it:',
    breakers:['<b>Seasonality</b>, Hajj, Umrah and Ramadan dominate demand; the line is feast-or-famine through the year.','<b>The O&amp;M contract</b>, the investable return is the operator\'s service margin, not ownership of the asset.','<b>Strategic, not financial</b>, the case is pilgrim mobility and national prestige, with fares kept affordable.','<b>Vision 2030</b>, tourism, feeder links and economic-city growth shape future ridership beyond the pilgrimage.'],
    src:'Figures from public sources: <a href="https://www.sar.com.sa/en" target="_blank" rel="noopener">Saudi Arabia Railways (SAR)</a>, <a href="https://www.renfe.com/" target="_blank" rel="noopener">Renfe</a> on the Al Shoula O&amp;M concession, and reporting on the ~US$16bn project cost and capacity. Ridership and fare inputs are illustrative and approximate.',
    econ:{cur:'SAR ',hgvMult:2.0,anc:80,fixed:0,
      trafficDef:30000,trafficMin:8000,trafficMax:90000,trafficStep:1000,
      tollDef:90,tollMin:35,tollMax:220,tollStep:5,
      heavyDef:15,heavyMin:5,heavyMax:30},
    opex:{inspect:120,major:90,collect:1.0,admin:70,concRate:0.06},
    calc:{build:60000,grant:30000,capex:5,revG:3,floor:0,cap:6000,tax:0,exit:11,lev:2,rd:5,amort:3,hold:30},
    map:{
      labels:[['SAUDI ARABIA',42.30,26.30,'land'],['RED SEA',36.30,21.40,'sea']],
      route:[[39.826,21.423],[39.55,21.49],[39.20,21.54],[39.10,22.00],[39.08,22.40],[39.18,23.10],[39.40,23.85],[39.611,24.467]],
      stops:[{lng:39.826,lat:21.423,label:'Mecca',sub:'southern terminus',below:true},
             {lng:39.10,lat:22.40,label:'KAEC / Jeddah',sub:'airport · economic city',below:false},
             {lng:39.611,lat:24.467,label:'Medina',sub:'northern terminus',below:false}],
      fareAt:0.28,
      footer:'Haramain HSR · Mecca → Jeddah → Medina · 450 km · 300 km/h'}
  },

  /* ---------- 6 · BEIJING–SHANGHAI (China · listed trunk line) ---------- */
  beijingshanghai:{
    name:'Beijing–Shanghai HSR', geo:'Beijing ⇄ Jinan ⇄ Shanghai', continent:'China', cur:'RMB ', geoKey:'beijingshanghai',
    lede:'The most profitable high-speed line in the world, 1,318&nbsp;km between China\'s two greatest cities, run by a <b>listed</b> company on an asset-light model that charges for every train that uses its track.',
    s1:'<p class="body">The <b>Beijing–Shanghai High-Speed Railway</b> is the flagship of China\'s vast HSR network: 1,318&nbsp;km of 350&nbsp;km/h railway across the densely populated North China Plain, linking <b>Beijing, Tianjin, Jinan, Nanjing and Shanghai</b>. It carries its own trains and, crucially, the trains of other operators that run onto its tracks.</p>'+
       '<p class="body">It is owned by a <b>listed company</b>, Beijing–Shanghai High Speed Railway Co., floated on the Shanghai Stock Exchange in 2020, and is famously the world\'s most profitable high-speed line. Its model is partly <b>asset-light</b>: alongside its own ticket revenue, it earns large <b>network-usage fees</b> from cross-line trains, a toll-like income on the busiest corridor in the country.</p>',
    facts:[['1,318 km','Beijing → Shanghai','5 provinces'],['350 km/h','Top speed','among fastest'],['2011','Opened','listed 2020'],['~RMB 40 bn','Revenue / yr','pre-COVID peak'],['Listed','Owner','Shanghai exchange'],['Two tills','Tickets + access','network-usage fees']],
    s2:'Beijing–Shanghai earns on <b>two tills</b>: tickets from passengers on its own trains, and a <b>network-usage fee</b> from every cross-line train of other railways that runs on its track, a toll on the busiest corridor in China. The model below blends both. Drag ridership, the average fare and the first/business-class share; the corridor is so dense that the operating leverage, like the Tōkaidō line\'s, is dramatic.',
    driverLab:'Avg fare', availLab:'1st/business share', hrK:'Fares captured /hr', yrS:'tickets + network fees',
    preset:'Load Beijing–Shanghai',
    try:'<b>Try this:</b> raise ridership toward the top of the range, this single line moves staggering volumes, and because its cost base is largely fixed, the margin is extraordinary. The steady <b>network-usage fee</b> underneath (from other operators\' trains) is the asset-light twist: revenue that arrives whether or not the company\'s own trains are full.',
    s3:'The company runs <b>two businesses</b> on one track. First, its own <b>ticket revenue</b>, fares from passengers, weighted up for first and business class. Second, a <b>network-usage fee</b> charged to other railways whose trains run onto the corridor, an asset-light, toll-like stream independent of its own ridership. With demand immense and the cost base fixed, both convert into exceptional profit, which is why it is the most profitable HSR on earth and a rare listed pure-play on Chinese passenger rail.',
    mb:{tag:'Model B · listed trunk line',title:'Asset-light, two-till monopoly',body:'A listed company owns a flagship trunk line and earns on two tills, <b>ticket revenue</b> from its own trains and a <b>network-usage fee</b> from every other operator\'s train that uses its track, a near-monopoly on the country\'s densest corridor. <b>This is Beijing–Shanghai HSR Co.</b>, floated in 2020, the most profitable high-speed railway in the world.'},
    s4a:'Even the most profitable railway is costly to run, track and structures, energy, train maintenance and the fees it pays to the national network for staff and services, but spread across colossal volume, the margin is exceptional. The waterfall shows blended ticket-plus-network revenue net of operating costs.',
    wfNote:'Operating cost is renewals and maintenance of track and structures, traction energy, train operations, and entrusted-operation fees paid to regional railways. Heavy in absolute terms but spread across enormous volume, and partly covered by the steady network-usage fee, which is why this is the highest-margin high-speed line anywhere.',
    s4b:'The line cost on the order of <b>RMB 220&nbsp;billion</b> to build and now trades as a listed company with a market value in the hundreds of billions of renminbi. Its 2020 IPO raised ~RMB 30&nbsp;billion. Modelled on an <b>enterprise-value</b> basis, it is the asset every infrastructure investor would want, a dominant, two-till corridor, and it is priced as such on the exchange.',
    stackH:'The capital stack · listed company', splitL:'How it is funded', splitR:'EV basis',
    split:[['s1',40,'Debt 40%'],['s2',60,'Listed equity 60%']],
    finList:[['','Beijing–Shanghai HSR Co., listed (SSE)','RMB 100s bn'],['sub','IPO 2020 raised','~RMB 30bn'],['','Ticket revenue (own trains)','till one'],['sub','Network-usage fee (cross-line trains)','till two'],['','Entrusted-operation fees to regional railways','cost line'],['rest','Operating margin','world\'s highest HSR']],
    finNote:'The stack is a conventional <b>listed-equity-plus-debt</b> structure, but the economics are exceptional because of the two tills: ticket revenue <i>and</i> a toll on every other operator\'s train. That asset-light network fee is what makes Beijing–Shanghai more profitable than any vertically integrated rival.',
    timeline:[['2008','<b>Construction begins</b> on the Beijing–Shanghai corridor.'],['Jun 2011','<b>Line opens</b>, 1,318 km at up to 350 km/h.'],['2014','<b>Turns profitable</b>, among the first HSR lines in China to do so.'],['Jan 2020','<b>IPO on the Shanghai Stock Exchange</b> raises ~RMB 30bn.'],['2020–21','<b>COVID</b> dents ridership; rapid recovery follows.'],['2023+','<b>Record volumes</b> reaffirm it as the world\'s most profitable HSR.']],
    calcNote:'A working model on a <b>listed, asset-light</b> trunk line. With two tills and a vast, dense ridership the modelled return is strong and stable. The network-usage fee is captured in the fixed revenue underneath the fare-box, so even at lower ridership the income holds up, which is exactly why the market prizes it. Cost of debt reflects Chinese rates.',
    s6:'Beijing–Shanghai is the most profitable railway in the world. What drives it:',
    breakers:['<b>Density &amp; operating leverage</b>, immense volume over a fixed cost base is the engine of the margin.','<b>The second till</b>, network-usage fees from other operators\' trains are steady, asset-light income.','<b>Pricing reform</b>, China\'s gradual move to market-based, flexible HSR fares is a key upside lever.','<b>Macro &amp; competition</b>, the economy, air competition and the cost of the wider network shape the result.'],
    src:'Figures from public sources: <a href="https://www.sse.com.cn/" target="_blank" rel="noopener">Shanghai Stock Exchange</a> disclosures of Beijing–Shanghai HSR Co., <a href="http://www.china-railway.com.cn/" target="_blank" rel="noopener">China State Railway Group</a>, and reporting on the IPO and profitability. Per-passenger fare and network-fee inputs are illustrative, not the company\'s reported segment accounts.',
    econ:{cur:'RMB ',hgvMult:2.2,anc:0,fixed:12000,
      trafficDef:400000,trafficMin:150000,trafficMax:650000,trafficStep:10000,
      tollDef:230,tollMin:90,tollMax:560,tollStep:10,
      heavyDef:18,heavyMin:6,heavyMax:35},
    opex:{inspect:9000,major:7000,collect:25,admin:6000,concRate:0.12},
    calc:{build:290000,grant:0,capex:6,revG:4,floor:0,cap:60000,tax:25,exit:12,lev:2,rd:4,amort:2,hold:25},
    map:{
      labels:[['CHINA',114.60,34.30,'land'],['YELLOW SEA',122.80,35.00,'sea'],['BOHAI',118.60,39.50,'seafaint']],
      route:[[116.378,39.865],[116.80,39.40],[117.21,39.13],[117.10,38.00],[117.00,36.67],[117.10,35.40],[117.28,34.26],[117.95,33.20],[118.80,32.06],[119.85,31.72],[120.85,31.40],[121.32,31.20]],
      stops:[{lng:116.378,lat:39.865,label:'Beijing South',sub:'northern terminus',below:false},
             {lng:117.00,lat:36.67,label:'Jinan West',sub:'midpoint hub',below:false},
             {lng:121.32,lat:31.20,label:'Shanghai Hongqiao',sub:'southern terminus',below:true}],
      fareAt:0.5,
      footer:'Beijing–Shanghai HSR · 1,318 km · 350 km/h · two-till trunk line'}
  }
  };
  var ORDER=['hs2','tgv','tokaido','brightline','haramain','beijingshanghai'];

  /* ===================================================================
     MAP RENDERER  (canvas)
  =================================================================== */
  var cv=document.getElementById('ixcv'), ctx=cv?cv.getContext('2d'):null;
  var W=720,H=520,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1))), MPAD=24, T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  var coins=[], _anim=false;
  function rnd(a,b){ return a+Math.random()*(b-a); }
  var PROJ=null;
  function setProj(bb){
    var LNG0=bb[0],LAT0=bb[1],LNG1=bb[2],LAT1=bb[3], cLat=(LAT0+LAT1)/2, COSL=Math.cos(cLat*Math.PI/180);
    var GW=(LNG1-LNG0)*COSL, GH=(LAT1-LAT0), MS=Math.min((W-2*MPAD)/GW,(H-2*MPAD)/GH);
    PROJ={LNG0:LNG0,LAT0:LAT0,LNG1:LNG1,LAT1:LAT1,COSL:COSL,MS:MS,OX:(W-GW*MS)/2,OY:(H-GH*MS)/2};
  }
  function PX(l){ return PROJ.OX+(l-PROJ.LNG0)*PROJ.COSL*PROJ.MS; }
  function PY(l){ return PROJ.OY+(PROJ.LAT1-l)*PROJ.MS; }
  function poly(a){ ctx.beginPath(); for(var i=0;i<a.length;i++){ var x=PX(a[i][0]),y=PY(a[i][1]); i?ctx.lineTo(x,y):ctx.moveTo(x,y);} ctx.closePath(); }
  function projRoute(r){ return r.map(function(p){ return {x:PX(p[0]),y:PY(p[1])}; }); }
  function routeLen(pr){ var L=[0],t=0; for(var i=1;i<pr.length;i++){ t+=Math.hypot(pr[i].x-pr[i-1].x,pr[i].y-pr[i-1].y); L.push(t);} return {L:L,total:t}; }
  function ptAt(pr,meta,frac){ var d=frac*meta.total, i=1; while(i<meta.L.length-1 && meta.L[i]<d) i++;
    var a=pr[i-1],b=pr[i], seg=meta.L[i]-meta.L[i-1]||1, u=(d-meta.L[i-1])/seg;
    return {x:a.x+(b.x-a.x)*u, y:a.y+(b.y-a.y)*u}; }
  function drawRouteLine(pr){ ctx.beginPath(); ctx.moveTo(pr[0].x,pr[0].y); for(var i=1;i<pr.length;i++) ctx.lineTo(pr[i].x,pr[i].y); }
  function station(x,y,label,sub,below){
    ctx.save();
    var hg=ctx.createRadialGradient(x,y,0,x,y,13); hg.addColorStop(0,'rgba(12,107,79,0.28)'); hg.addColorStop(1,'rgba(12,107,79,0)');
    ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(x,y,13,0,Math.PI*2); ctx.fill();
    ctx.shadowColor='rgba(15,32,29,0.35)'; ctx.shadowBlur=6; ctx.shadowOffsetY=1;
    ctx.fillStyle='#fff'; ctx.strokeStyle='#15201d'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(x,y,6.5,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.shadowBlur=0; ctx.shadowOffsetY=0;
    ctx.fillStyle='#0c6b4f'; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
    ctx.restore();
    var ly=below?y+16:y-15, sy=below?y+27:y-5;
    ctx.save(); ctx.shadowColor='rgba(255,255,255,0.85)'; ctx.shadowBlur=4; ctx.textAlign='center';
    ctx.fillStyle='#15201d'; ctx.font='700 10.5px Inter,sans-serif'; ctx.fillText(label,x,ly);
    ctx.fillStyle='#5a655f'; ctx.font='8.5px Inter,sans-serif'; ctx.fillText(sub,x,sy); ctx.restore();
  }
  function rr(x,y,w,h,r){ if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); } else { ctx.beginPath(); ctx.rect(x,y,w,h); } }

  /* animated sea background: depth gradient + drifting light bands + fine caustics */
  function drawSea(){
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#e1eef6'); g.addColorStop(0.55,'#cfe5f0'); g.addColorStop(1,'#b9d8e8');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    ctx.save();
    for(var i=0;i<5;i++){
      var yy=((T*0.22 + i*150)%(H+260))-130;
      var lg=ctx.createLinearGradient(0,yy,0,yy+90);
      lg.addColorStop(0,'rgba(255,255,255,0)'); lg.addColorStop(0.5,'rgba(255,255,255,0.16)'); lg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=lg; ctx.fillRect(0,yy,W,90);
    }
    ctx.strokeStyle='rgba(118,162,198,0.12)'; ctx.lineWidth=1;
    for(var j=0;j<9;j++){ var ly=26+j*((H-30)/9), off=(T*0.6+j*33)%48;
      ctx.beginPath();
      for(var x=-off;x<W;x+=48){ ctx.moveTo(x,ly+Math.sin((x+T)*0.02)*2.2); ctx.lineTo(x+22,ly+Math.sin((x+22+T)*0.02)*2.2); }
      ctx.stroke(); }
    ctx.restore();
  }

  /* land: the real country/region outline, soft drop shadow, subtle gradient,
     crisp coast + inner highlight (host country shaded green) */
  function drawLand(){
    var home=(A.map.home||GEO[A.geoKey].home||[]);
    GEO[A.geoKey].polys.forEach(function(p){
      var homeP = home.indexOf(p[0])>=0;
      ctx.save(); ctx.shadowColor='rgba(20,42,32,0.20)'; ctx.shadowBlur=15; ctx.shadowOffsetY=4;
      poly(p[1]);
      var lg=ctx.createLinearGradient(0,0,0,H);
      if(homeP){ lg.addColorStop(0,'#e9f2ea'); lg.addColorStop(1,'#d3e5d6'); }
      else { lg.addColorStop(0,'#eef0ec'); lg.addColorStop(1,'#e0e4de'); }
      ctx.fillStyle=lg; ctx.fill(); ctx.restore();
      poly(p[1]); ctx.strokeStyle= homeP?'rgba(12,107,79,0.42)':'rgba(96,114,104,0.4)'; ctx.lineWidth=homeP?1.4:1.05; ctx.stroke();
      poly(p[1]); ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=0.6; ctx.stroke();
    });
  }

  /* the rail line: soft glow, dark trackbed, twin steel rails + animated sleeper ticks */
  function drawRail(pr,meta){
    ctx.save(); ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.shadowColor='rgba(12,107,79,0.28)'; ctx.shadowBlur=9;
    ctx.strokeStyle='rgba(20,32,29,0.20)'; ctx.lineWidth=9; drawRouteLine(pr); ctx.stroke();
    ctx.shadowBlur=0;
    /* trackbed */
    var grd=ctx.createLinearGradient(pr[0].x,pr[0].y,pr[pr.length-1].x,pr[pr.length-1].y);
    grd.addColorStop(0,'#39433b'); grd.addColorStop(0.5,'#2b362e'); grd.addColorStop(1,'#39433b');
    ctx.strokeStyle=grd; ctx.lineWidth=5; drawRouteLine(pr); ctx.stroke();
    /* sleeper ticks */
    ctx.strokeStyle='rgba(210,216,210,0.5)'; ctx.lineWidth=3.4; ctx.setLineDash([1.5,6]); ctx.lineDashOffset=-(T*0.4);
    drawRouteLine(pr); ctx.stroke(); ctx.setLineDash([]);
    /* twin steel rails (thin bright centre) */
    ctx.strokeStyle='rgba(190,205,214,0.85)'; ctx.lineWidth=1.1; drawRouteLine(pr); ctx.stroke();
    ctx.restore();
  }

  var TRAIN_COLS=['#1f7a59','#236981','#2f6f9c'];
  /* a sleek high-speed train, nosed in its direction of travel */
  function train(p,ang,col){
    var L=22, h=6.4;
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(ang);
    ctx.fillStyle='rgba(0,0,0,0.16)'; rr(-L/2+1,-h/2+1.8,L,h,2.2); ctx.fill();                 // shadow
    var bg=ctx.createLinearGradient(0,-h/2,0,h/2);
    bg.addColorStop(0,'#f2f5f7'); bg.addColorStop(0.5,'#dde3e8'); bg.addColorStop(1,'#b9c2ca');
    ctx.fillStyle=bg; rr(-L/2,-h/2,L,h,2.4); ctx.fill();                                        // body
    ctx.fillStyle='#cdd5dc'; ctx.beginPath();                                                   // streamlined nose (leading end +x)
    ctx.moveTo(L/2-5,-h/2); ctx.quadraticCurveTo(L/2+6,0,L/2-5,h/2); ctx.closePath(); ctx.fill();
    ctx.fillStyle=col; rr(-L/2+1,-1.3,L-3,2.6,1.2); ctx.fill();                                  // livery stripe
    ctx.fillStyle='rgba(40,54,64,0.85)';                                                        // window band
    for(var wx=-L/2+4; wx<L/2-6; wx+=4.4) rr(wx,-h/2+1.4,2.6,2.2,0.6), ctx.fill();
    ctx.restore();
    var hx=p.x+Math.cos(ang)*(L*0.55), hy=p.y+Math.sin(ang)*(L*0.55);                            // headlight glow
    ctx.save(); ctx.globalAlpha=0.5;
    var hgl=ctx.createRadialGradient(hx,hy,0,hx,hy,8); hgl.addColorStop(0,'rgba(255,247,210,0.8)'); hgl.addColorStop(1,'rgba(255,247,210,0)');
    ctx.fillStyle=hgl; ctx.beginPath(); ctx.arc(hx,hy,8,0,Math.PI*2); ctx.fill(); ctx.restore();
  }

  /* a fares gantry at the hub station, with a sweeping scan light and pulse ring */
  function fareGantry(p,nrm){
    ctx.save();
    var ex=nrm.x*12, ey=nrm.y*12;
    var pr2=(T%72)/72;
    ctx.globalAlpha=(1-pr2)*0.45; ctx.strokeStyle='#0c6b4f'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(p.x,p.y,4+pr2*18,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1;
    ctx.strokeStyle='#0c6b4f'; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(p.x-ex,p.y-ey); ctx.lineTo(p.x+ex,p.y+ey); ctx.stroke();
    ctx.fillStyle='#0c6b4f';
    ctx.beginPath(); ctx.arc(p.x-ex,p.y-ey,2.4,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(p.x+ex,p.y+ey,2.4,0,Math.PI*2); ctx.fill();
    var sw=Math.sin(T*0.06), sx=p.x+ex*sw, sy=p.y+ey*sw;
    var sg=ctx.createRadialGradient(sx,sy,0,sx,sy,8); sg.addColorStop(0,'rgba(95,200,150,0.7)'); sg.addColorStop(1,'rgba(95,200,150,0)');
    ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(sx,sy,8,0,Math.PI*2); ctx.fill();
    ctx.shadowColor='rgba(12,107,79,0.4)'; ctx.shadowBlur=5;
    ctx.fillStyle='#0c6b4f'; rr(p.x-17,p.y-26,34,13,3); ctx.fill(); ctx.shadowBlur=0;
    ctx.fillStyle='#dff3ea'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('FARES',p.x,p.y-16.5);
    ctx.restore();
  }

  function spawnCoin(p){ if(coins.length<42) coins.push({x:p.x+rnd(-7,7),y:p.y-3,vy:-0.55-Math.random()*0.45,life:1}); }
  function drawCoins(){
    for(var i=coins.length-1;i>=0;i--){ var c=coins[i];
      if(_anim){ c.y+=c.vy; c.vy*=0.985; c.life-=0.02; }
      if(c.life<=0){ coins.splice(i,1); continue; }
      ctx.save(); ctx.globalAlpha=Math.max(0,Math.min(1,c.life));
      var g=ctx.createRadialGradient(c.x-1,c.y-1,0,c.x,c.y,4); g.addColorStop(0,'#fbe9a0'); g.addColorStop(1,'#d6a528');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(c.x,c.y,3.1,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(140,92,22,0.55)'; ctx.lineWidth=0.7; ctx.stroke(); ctx.restore();
    }
  }
  var LSTY={ land:['rgba(12,107,79,0.55)','700 13px Inter,sans-serif'],
            context:['rgba(120,135,128,0.7)','700 11px Inter,sans-serif'],
            sea:['rgba(70,110,150,0.55)','italic 600 13px "Source Serif 4",Georgia,serif'],
            seafaint:['rgba(70,110,150,0.32)','italic 600 11px "Source Serif 4",Georgia,serif'] };

  /* ===================================================================
     FRAME  (per animation tick)
  =================================================================== */
  function frame(){
    if(!ctx||!A) return;
    var M=A.map, E=A.econ;
    var cap=parseFloat(sCap.value), fare=parseFloat(sSpread.value), prem=parseFloat(sAvail.value)/100;

    // ---- scene ----
    ctx.clearRect(0,0,W,H);
    drawSea();
    drawLand();
    M.labels.forEach(function(l){ var st=LSTY[l[3]]||LSTY.land; ctx.save();
      ctx.shadowColor='rgba(255,255,255,0.7)'; ctx.shadowBlur=4; ctx.fillStyle=st[0]; ctx.font=st[1];
      ctx.textAlign='center'; ctx.fillText(l[0],PX(l[1]),PY(l[2])); ctx.restore(); });

    var pr=projRoute(M.route), meta=routeLen(pr);
    var fAt=(M.fareAt==null?0.5:M.fareAt);
    var hub=ptAt(pr,meta,fAt);
    var ha=ptAt(pr,meta,Math.max(0,fAt-0.04)), hb=ptAt(pr,meta,Math.min(1,fAt+0.04)), dang=Math.atan2(hb.y-ha.y,hb.x-ha.x);
    var nrm={x:Math.cos(dang+Math.PI/2),y:Math.sin(dang+Math.PI/2)};

    drawRail(pr,meta);

    // ---- trains: run both ways along the line ----
    var n=Math.max(3,Math.min(16,Math.round(cap/30000)+2));
    var spd=0.0042*(0.6+Math.min(1,cap/450000));
    for(var k=0;k<n;k++){
      var dir=k%2;                                   // 0 = forward, 1 = reverse
      var vf=0.85+0.32*(((k*53)%9)/9);
      var base=(T*spd*vf + k/n)%1, t=dir?base:1-base;
      var pp=ptAt(pr,meta,t), p2=ptAt(pr,meta,Math.min(1,Math.max(0,t+(dir?0.012:-0.012))));
      var ang=Math.atan2(p2.y-pp.y,p2.x-pp.x);
      var off=dir?2.4:-2.4, ox=Math.cos(ang+Math.PI/2)*off, oy=Math.sin(ang+Math.PI/2)*off;
      train({x:pp.x+ox,y:pp.y+oy},ang,TRAIN_COLS[k%3]);
    }
    if(_anim && Math.random()< Math.min(0.5, cap/350000)) spawnCoin(hub);

    fareGantry(hub,nrm);
    drawCoins();

    M.stops.forEach(function(s){ station(PX(s.lng),PY(s.lat),s.label,s.sub,s.below); });

    // compass + caption
    ctx.save(); ctx.translate(W-30,34); ctx.strokeStyle='#5a6b76'; ctx.fillStyle='#5a6b76'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,-9); ctx.lineTo(0,8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(-3.5,-5); ctx.lineTo(3.5,-5); ctx.closePath(); ctx.fill();
    ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('N',0,18); ctx.restore();
    ctx.save(); ctx.shadowColor='rgba(255,255,255,0.65)'; ctx.shadowBlur=3;
    ctx.fillStyle='rgba(40,60,80,0.62)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(stripTags(M.footer)+' · '+Math.round(cap).toLocaleString()+' riders/day',W/2,H-11); ctx.restore();
    // cinematic vignette
    var vg=ctx.createRadialGradient(W/2,H/2,H*0.45,W/2,H/2,H*0.96);
    vg.addColorStop(0,'rgba(10,30,45,0)'); vg.addColorStop(1,'rgba(10,30,45,0.13)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H);

    // ---- economics ----
    var paxYr=cap*365, std=cap*(1-prem), premV=cap*prem;
    var fareRev=(std*fare + premV*fare*E.hgvMult)*365;
    var grossRev=fareRev + (E.anc||0)*1e6 + (E.fixed||0)*1e6;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e9)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));
    var buildTot=(parseFloat(iBuild.value)||0)*1e6, grant=(parseFloat(iGrant.value)||0)*1e6;
    capexGrossG=buildTot; netCapexG=Math.max(0,buildTot-grant);
    var O=A.opex;
    var c_track=O.inspect*1e6, c_energy=O.collect*paxYr, c_staff=O.major*1e6,
        c_admin=O.admin*1e6 + (O.concRate||0)*revenue;
    var opex=c_track+c_energy+c_staff+c_admin, ebitda=revenue-opex;
    baseRevYr=revenue; baseCostYr=opex; baseEbYr=ebitda;

    set('ixCapV',Math.round(cap).toLocaleString()+' /day'); set('ixSpreadV',fmtFare(fare)); set('ixAvailV',Math.round(prem*100)+'%');
    set('ixDir','≈ '+Math.round(cap).toLocaleString()); set('ixDirS',Math.round(prem*100)+'% premium seats');
    set('ixMW',Math.round(cap/19).toLocaleString()+' /hr'); set('ixMWs','riders in the peak hours');
    set('ixHr', revenue<=0?CUR+'0 / hr':money(revenue/HRS)+' / hr');
    set('ixYr', revenue<=0?CUR+'0':'≈ '+money(revenue));

    drawWaterfall(revenue, [['Track &amp; structures renewals',c_track],['Energy &amp; traction',c_energy],['Train ops &amp; stations',c_staff],['Insurance, admin &amp; access fee',c_admin]], ebitda);
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
    var gR=gv('iRevG')/100, capexP=gv('iCapex')/100, daP=0.03, tax=gv('iTax')/100;
    var xMul=gv('iExit'), N=Math.max(3,Math.min(40,Math.round(gv('iHold'))));
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
    var exitEVf=xMul*rows[N-1].eb, exitEq=exitEVf-rows[N-1].debt;
    var distrib=eCF.slice(1).reduce(function(a,b){return a+b;},0);
    var moic=equity0>0?distrib/equity0:NaN;
    return {eb0:eb0,invest:invest,debt0:debt0,equity0:equity0,N:N,rows:rows,uCF:uCF,eCF:eCF,uIRR:irr(uCF),lIRR:irr(eCF),exitEV:exitEVf,exitEq:exitEq,moic:moic,payback:payback};
  }
  function renderModel(){
    var m=computeModel();
    if(!m){ ['oUIRR','oLIRR','oMOIC','oPB'].forEach(function(id){ set(id,'—'); });
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this setting the fare-box is too thin to value against the capital, raise the fare or ridership, or note that on this asset the return is strategic rather than commercial.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—');
    set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100);
    var cs2=document.getElementById('calcSum'); if(cs2) cs2.innerHTML=
      '<span><span class="lbl">Invested capital</span> <b>'+money(capexGrossG)+'</b></span>'+
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
    A=ASSETS[key]; CUR=A.cur;
    if(ctx) setProj(GEO[A.geoKey].bb);
    set('ixAssetName',A.name); set('ixAssetGeo',A.geo); set('ixCont',A.continent);
    set('ixBarName',A.name);
    html('ixLede',A.lede);
    html('s1body',A.s1);
    html('ixFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    html('s2intro',A.s2);
    set('ixDriverLab',A.driverLab); set('ixAvailLab',A.availLab); set('ixHrK',A.hrK); set('ixYrS',A.yrS);
    set('ixPreset',A.preset); html('ixTry',A.try);
    var E=A.econ;
    sCap.min=E.trafficMin; sCap.max=E.trafficMax; sCap.step=E.trafficStep; sCap.value=E.trafficDef;
    sSpread.min=E.tollMin; sSpread.max=E.tollMax; sSpread.step=E.tollStep; sSpread.value=E.tollDef;
    sAvail.min=E.heavyMin; sAvail.max=E.heavyMax; sAvail.value=E.heavyDef;
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
    html('ixSrc',A.src+' The interactive figures are illustrative, revenue uses a stylised blended fare and the returns model is a simplified DCF; not a forecast of any specific year\'s ridership, and not investment advice.');
    frame(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sCap,sSpread,sAvail].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    [iBuild,iGrant,iCapex,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ frame(); renderModel(); }); });
    var preset=document.getElementById('ixPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sCap.value=E.trafficDef; sSpread.value=E.tollDef; sAvail.value=E.heavyDef; frame(); renderModel(); });
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
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'hs2');

  /* section rail scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
