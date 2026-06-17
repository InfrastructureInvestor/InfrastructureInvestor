/* Bridges — data-driven worked examples (mirrors the interconnectors template).
   Six real crossings, one template; a side-elevation drawn to each structure's
   real type/proportions with animated traffic. The interactive figures are
   illustrative: revenue is a stylised traffic×toll model and the returns model
   is a simplified DCF, not a forecast. */
(function(){
  var DAYS=365;
  var CUR='€', A=null;
  var baseRevYr=0, baseEbYr=0, capexGrossG=0, netCapexG=0;

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

  /* ---------- 1 · ØRESUND (Europe · state-owned toll, debt-funded) ---------- */
  oresund:{
    name:'Øresund Bridge', geo:'Denmark ⇄ Sweden', continent:'Europe', cur:'€',
    lede:'The 16&nbsp;km fixed link from Copenhagen to Malmö — a cable-stayed bridge that dives into a tunnel — whose tolls quietly repay the debt that built it.',
    s1:'<p class="body">A <b>bridge</b> turns a barrier — a strait, a bay, a river — into a road, and a road that someone must pay to cross is one of the oldest infrastructure businesses there is. The Øresund link joins <b>Copenhagen</b> to <b>Malmö</b> across the strait between Denmark and Sweden: an 8&nbsp;km cable-stayed bridge, an artificial island, and a 4&nbsp;km immersed tunnel, carrying a motorway and a twin-track railway.</p>'+
       '<p class="body">It is the textbook <b>state-owned toll concession</b>. No taxpayer money built it: the two governments lent their credit, the consortium borrowed, and <b>tolls and rail charges repay the debt</b> over decades. Cross it once at full price and you pay one of the dearest tolls per kilometre in the world.</p>',
    facts:[['490 m','Main span','cable-stayed'],['16 km','Total link','bridge + island + tunnel'],['204 m','Pylons','twin concrete'],['~€2.6 bn','Cost (2000)','bridge &amp; tunnel'],['2000','Opened','road + rail'],['~21k','Vehicles/day','+ rail']],
    s2:'Øresund is really three structures in series. From Sweden a <b>cable-stayed bridge</b> — a 490&nbsp;m main span hung from two 204&nbsp;m concrete pylons — carries road over rail for 8&nbsp;km, then steps down onto the artificial island of <b>Peberholm</b>, and finally drops into the 4&nbsp;km <b>Drogden tunnel</b> so ships and aircraft (Copenhagen airport is next door) pass freely above. Revenue is simple: <b>every vehicle that crosses pays</b>, and rail operators pay to run trains. Set the traffic and the toll and watch the money accrue.',
    driverLab:'Avg toll /car', trafLab:'Crossings/day', heavyLab:'Heavy share', hrK:'Toll collected /day', yrS:'tolls + rail charges',
    preset:'Load the Øresund Bridge',
    try:'<b>Try this:</b> the toll here is famously high, yet the link still took two decades to pay down. Drag the toll up and revenue climbs — but a bridge that prices itself too dear loses the traffic that justified it. The whole game is the balance between price and volume.',
    s3:'A toll bridge earns the most basic infrastructure revenue: <b>volume × price</b>. Every crossing pays, so the cash flow tracks traffic and the toll, escalated over time. The decisive question for an investor is <b>who carries the risk that the traffic disappoints</b> — and that is set by the ownership model.',
    mb:{tag:'Model B · state concession',title:'State-owned toll, debt-funded',body:'The two governments own the link 50/50 and guarantee its debt; <b>user tolls and rail charges service that debt</b> over decades, after which the crossing is effectively free to the public. Very low cost of capital (near-sovereign), very long horizon, modest return. <b>This is Øresund</b> — owned by Denmark and Sweden, repaying its build cost into the 2050s.'},
    s4a:'A bridge is almost all capital cost and very little running cost — no fuel, just the upkeep of a structure designed to last a century. So once it is open the <b>operating margin is very high</b>, and the cash flows are remarkably steady. The waterfall below is live from the model above.',
    wfNote:'Operating cost is dominated by maintenance and renewals — inspection, corrosion protection, deck and cable upkeep — a largely fixed base. With revenue this stable and costs this low, the margin barely moves.',
    s4b:'Building it cost about <b>€2.6&nbsp;billion</b> for the coast-to-coast bridge and tunnel (closer to €4&nbsp;bn including the land connections). Because the revenue is predictable and state-guaranteed, the link carries an <b>unusually high share of low-cost debt</b> — there is almost no equity in the conventional sense.',
    stackH:'The capital stack · ~€2.6 bn', splitL:'How it was funded', splitR:'state-guaranteed',
    split:[['s1',50,'Denmark · A/S Øresund 50%'],['s2',50,'Sweden · SVEDAB 50%']],
    finList:[['','State-guaranteed debt (capital markets)','~€2.6bn'],['sub','Repaid by road tolls','~85%'],['sub','Repaid by rail access charges','~15%'],['','Net debt outstanding (recent)','~€1bn'],['','Repayment horizon','~2050'],['rest','Equity from the two states','nominal']],
    finNote:'The trick is the <b>joint state guarantee</b>: it lets the consortium borrow at near-sovereign rates and gear almost entirely with debt, which only a government-backed toll could support. Consumers — the drivers — repay it, not taxpayers.',
    timeline:[['Mar 1991','<b>Denmark–Sweden treaty</b> signed to build the fixed link.'],['1995','<b>Construction begins</b> — dredging, the island, the tunnel.'],['1999','<b>Spans joined</b>; Peberholm island completed.'],['Jul 2000','<b>Opens to road &amp; rail</b> — Copenhagen to Malmö in minutes.'],['2023–24','<b>Record traffic</b>; debt steadily amortising.'],['~2050','<b>Debt fully repaid</b> (projected, incl. land works).']],
    calcNote:'A working model of the crossing as an investment. Year-1 revenue and EBITDA flow from the live elevation above — change the <b>traffic</b>, toll or heavy-vehicle mix and everything moves. The <b style="color:#0c6b4f">unlevered IRR</b> (asset return) and <b style="color:var(--accent)">levered IRR</b> (return to equity, after debt) recompute instantly.',
    s6:'A toll bridge lives or dies on one number — how many vehicles cross — and a state-owned one trades most of the upside for a rock-bottom cost of capital. The levers that decide the outcome:',
    breakers:['<b>Traffic</b> — the single biggest driver; a bridge that misjudges demand never recovers its capital.','<b>The toll &amp; its escalation</b> — pricing power, usually indexed to inflation, set against the risk of pricing out drivers.','<b>Cost of capital</b> — a state guarantee turns a thin toll into a financeable asset; without it the sums rarely work.','<b>Maintenance</b> — a 100-year structure needs continuous, lumpy reinvestment that quietly eats the margin.'],
    src:'Figures from public sources: <a href="https://www.oresundsbron.com/en/about-oresundsbron/about-us/financing" target="_blank" rel="noopener">Øresundsbro Konsortiet</a>, its annual reports, the <a href="https://www.gihub.org/connectivity-across-borders/case-studies/the-%C3%B8resund-fixed-link/" target="_blank" rel="noopener">Global Infrastructure Hub</a> case study, and engineering references (<a href="https://www.ingenia.org.uk/articles/the-oeresund-bridge-linking-scandinavia-to-the-continent/" target="_blank" rel="noopener">Ingenia</a>, <a href="https://www.ice.org.uk/" target="_blank" rel="noopener">ICE</a>).',
    econ:{mode:'toll',availPay:0,
      trafDef:21000,trafMin:8000,trafMax:60000,trafStep:1000,
      tollDef:31,tollMin:8,tollMax:70,tollStep:1,
      heavyDef:6,heavyMin:2,heavyMax:25},
    opex:{maintLab:'Maintenance &amp; renewals',opLab:'Operations &amp; tolling',f2:0.04,ins:0.0010,admin:6},
    calc:{build:2800,grant:0,om:24,revG:2,floor:150,cap:340,tax:22,exit:12,lev:7,rd:3.5,amort:3,hold:25},
    struct:{leftShore:'DENMARK',rightShore:'SWEDEN',water:'Ø R E S U N D',span:'490 m cable-stayed main span · 4 km Drogden tunnel',
      footer:'Cable-stayed bridge + immersed tunnel · 16 km · road + rail',
      segs:[{t:'approach',f0:0,f1:0.12,deck:0.30},{t:'tunnel',f0:0.12,f1:0.4,deck:0.30},{t:'island',f0:0.4,f1:0.5,deck:0.30},{t:'approach',f0:0.5,f1:0.62,deck:0.30},{t:'cableStay',f0:0.62,f1:0.9,deck:0.30,tower:0.62,pylons:[0.7,0.82],pylonStyle:'H'},{t:'approach',f0:0.9,f1:1,deck:0.30}]}
  },

  /* ---------- 2 · GORDIE HOWE (North America · availability-payment P3) ---------- */
  gordie:{
    name:'Gordie Howe International Bridge', geo:'Detroit ⇄ Windsor', continent:'North America', cur:'C$',
    lede:'The longest cable-stayed span in North America — and a textbook of the opposite risk to a toll road: the builder is paid to keep it open, not for who drives across.',
    s1:'<p class="body">Spanning the Detroit River between <b>Detroit</b> and <b>Windsor</b>, the Gordie Howe is a six-lane <b>cable-stayed bridge</b> with the longest main span of its kind in North America. It links one of the continent\'s busiest trade corridors — Michigan\'s I-75 to Ontario\'s Highway 401 — beside the ageing, privately-owned Ambassador Bridge.</p>'+
       '<p class="body">What makes it a different investment from every other bridge here is how the private partner is paid. It was built as a <b>public-private partnership with availability payments</b>: the consortium designs, builds, finances, operates and maintains the bridge for ~30 years and is paid for <b>keeping it open and in good condition</b> — not for the traffic. The public authority collects the tolls and carries the demand risk.</p>',
    facts:[['853 m','Main span','longest in N. America'],['2.5 km','Bridge length','+ approaches'],['220 m','Towers','A-shaped'],['~C$5.7 bn','Project cost','Canada-funded'],['2026','Opened','June'],['Availability','Payment P3','no traffic risk']],
    s2:'The structure is a classic <b>cable-stayed</b> design: two 220&nbsp;m A-shaped towers, with cables fanning down to an 853&nbsp;m deck that clears the shipping channel by ~45&nbsp;m. Physically it carries six lanes of road and a multi-use path. But the slider below is a teaching device: traffic crosses the bridge, yet — because the concessionaire is paid <b>availability payments</b> — the owner-operator\'s revenue barely responds to it. Watch the revenue line stay flat as the traffic swells.',
    driverLab:'Avg toll /car', trafLab:'Crossings/day', heavyLab:'Truck share', hrK:'Toll collected /day', yrS:'a fixed availability payment',
    preset:'Load the Gordie Howe Bridge',
    try:'<b>Try this:</b> drag the traffic and toll all you like — the <b>revenue scarcely moves</b>. That is the availability-payment model: the partner is paid to keep the bridge open and safe, and the government keeps the tolls and the traffic risk. It is the bridge world\'s version of a contracted, bond-like cash flow.',
    s3:'On a toll bridge the owner keeps <b>volume × price</b> and rides the traffic. An availability-payment P3 severs that link entirely: the private partner receives a <b>fixed periodic payment</b> for meeting availability and performance standards, regardless of how many vehicles cross. The public authority collects the tolls and takes the demand risk. It is the lowest-risk way to invest in a road asset — and the most leverable.',
    mb:{tag:'Model B · availability P3',title:'Availability-payment PPP',body:'The concessionaire designs-builds-finances-operates-maintains the bridge and is paid <b>availability payments</b> by the public owner for keeping it open to standard — <b>no traffic or toll risk</b>. Returns are lower than a merchant toll but bond-like and highly leverable. <b>This is Gordie Howe</b>: built by Bridging North America, paid by the Windsor-Detroit Bridge Authority, which collects the tolls itself.'},
    s4a:'For an availability-payment asset the whole investment case is <b>construction and uptime</b>: deliver on time, then keep the bridge available to specification for thirty years. There is no demand exposure, so the cash flow is about as predictable as infrastructure gets. The waterfall shows the availability payment, less the cost of operating and maintaining the structure.',
    wfNote:'Operating cost is maintenance and lifecycle renewals on a brand-new structure engineered for 125 years — heavy but scheduled and known. With revenue fixed by contract, the EBITDA is highly predictable.',
    s4b:'The overall project is costed at about <b>C$5.7&nbsp;billion</b>, funded by the Government of Canada. The private partner raised roughly <b>C$1.1&nbsp;billion</b> of long-term debt and equity at financial close in 2018; the contracted availability payments make that cash flow investment-grade and support very high leverage.',
    stackH:'The capital stack · ~C$5.7 bn project', splitL:'How it was funded', splitR:'at financial close (2018)',
    split:[['s1',85,'Senior debt ~85%'],['s2',15,'Equity ~15%']],
    finList:[['','Government of Canada (project cost)','~C$5.7bn'],['','Private finance package (BNA)','~C$1.1bn'],['sub','Bonds + bank debt','majority'],['sub','Sponsor equity (Fluor &amp; partners)','balance'],['','Lenders: RBC, HSBC, MUFG, TD, Desjardins','syndicate'],['rest','Repaid via availability payments','~30 yr']],
    finNote:'Because the cash flow is a contracted availability payment rather than uncertain tolls, the deal supports a thin equity cheque and a high share of investment-grade debt — the defining feature of the PPP model.',
    timeline:[['2012','<b>WDBA created</b> — the Canadian Crown corporation that owns the bridge.'],['May 2015','<b>Named</b> for hockey legend Gordie Howe.'],['Sep 2018','<b>P3 financial close</b> — C$5.7bn contract to Bridging North America.'],['2018–25','<b>Construction</b> — towers, deck and the 853 m span erected.'],['Jun 2026','<b>Opens to traffic</b> — a new binational trade route.'],['~2056','<b>Concession ends</b> — the bridge reverts fully to public hands.']],
    calcNote:'A working model calibrated to an <b>availability-payment P3</b>. Revenue is the contracted payment, so the floor and cap sit close together and the traffic above changes the picture, not the cash. Watch how high leverage lifts the <b style="color:var(--accent)">levered IRR</b> when the cash flow is this stable.',
    s6:'An availability bridge inverts the toll-road risk picture: the traffic no longer drives returns — the <b>contract</b> does. What matters is delivering and then keeping the bridge open. The levers:',
    breakers:['<b>The contract</b> — the availability payment, its term and indexation set the cash flow; tolls and traffic are the government\'s problem.','<b>Construction &amp; uptime</b> — the only ways to miss the number are to build late or fail an availability standard.','<b>Lifecycle cost</b> — thirty years of scheduled maintenance must be delivered within the bid; overruns are the partner\'s.','<b>Leverage</b> — contracted, bond-like cash flows support very high gearing, where most of the equity return is made.'],
    src:'Figures from public sources: <a href="https://www.gordiehoweinternationalbridge.com/" target="_blank" rel="noopener">Windsor-Detroit Bridge Authority</a>, the <a href="https://www.canada.ca/" target="_blank" rel="noopener">Government of Canada</a>, the <a href="https://www.pppcouncil.ca/" target="_blank" rel="noopener">Canadian Council for PPPs</a> and the <a href="https://www.gihub.org/" target="_blank" rel="noopener">Global Infrastructure Hub</a>. Opening June 2026.',
    econ:{mode:'availability',availPay:430,
      trafDef:26500,trafMin:8000,trafMax:80000,trafStep:1000,
      tollDef:6,tollMin:2,tollMax:14,tollStep:0.5,
      heavyDef:22,heavyMin:5,heavyMax:40},
    opex:{maintLab:'Maintenance &amp; lifecycle',opLab:'Operations',f2:0.05,ins:0.0010,admin:8},
    calc:{build:5700,grant:0,om:55,revG:2,floor:380,cap:480,tax:26.5,exit:15,lev:12,rd:4.5,amort:3,hold:30},
    struct:{leftShore:'DETROIT · USA',rightShore:'WINDSOR · CANADA',water:'D E T R O I T   R I V E R',span:'853 m main span — longest cable-stayed in North America',
      footer:'Cable-stayed bridge · 853 m main span · 6 lanes',
      segs:[{t:'approach',f0:0,f1:0.28,deck:0.32},{t:'cableStay',f0:0.28,f1:0.72,deck:0.32,tower:0.66,pylons:[0.4,0.6],pylonStyle:'A'},{t:'approach',f0:0.72,f1:1,deck:0.32}]}
  },

  /* ---------- 3 · RIO–NITERÓI (South America · private merchant toll) ---------- */
  rio:{
    name:'Rio–Niterói Bridge', geo:'Rio de Janeiro ⇄ Niterói', continent:'South America', cur:'R$',
    lede:'13&nbsp;km of box-girder across Guanabara Bay, rising to a 72&nbsp;m hump for the ships — and the purest merchant toll in this set: a private concession that lives or dies on the traffic.',
    s1:'<p class="body">The <b>Rio–Niterói Bridge</b> sweeps 13&nbsp;km across Guanabara Bay, most of it a low concrete <b>box-girder</b> deck on hundreds of piers, rising to a single 300&nbsp;m steel span 72&nbsp;m above the shipping channel so vessels can reach the Port of Rio. Opened in 1974, it carries some of the heaviest urban traffic in Brazil.</p>'+
       '<p class="body">It is the clearest <b>private toll concession</b> here. In 2015 <b>Ecoponte</b> (the EcoRodovias group) won a 30-year concession to operate it and collect the tolls, committing billions of reais of investment — and bearing the <b>full risk that the traffic shows up</b>. This is the merchant toll model in its rawest form.</p>',
    facts:[['300 m','Navigation span','steel box-girder'],['13.3 km','Total length','~8.8 km over water'],['72 m','Clearance','shipping channel'],['2015','Concession','Ecoponte · 30 yr'],['~140k','Vehicles/day','two-way'],['1974','Opened','Costa e Silva']],
    s2:'The structure is not glamorous and that is the point: a long <b>box-girder beam bridge</b> on 400-plus piers, engineered cheaply for length, with one tall hump where the deck climbs to 72&nbsp;m over the navigation channel. There are no towers or cables for most of its run. Commercially it is a pure toll machine — <b>every paying crossing is revenue</b>, and a private concessionaire keeps it. Set the traffic and the toll and watch.',
    driverLab:'Avg toll /car', trafLab:'Paying crossings/day', heavyLab:'Heavy share', hrK:'Toll collected /day', yrS:'kept by the concessionaire',
    preset:'Load the Rio–Niterói Bridge',
    try:'<b>Try this:</b> this is the one where the slider really bites. Drag the traffic down and the whole investment case sags — there is no availability payment or state guarantee to catch it. A private toll concession is a <b>leveraged bet on the traffic forecast</b>.',
    s3:'A private toll concession is the merchant model: the concessionaire pays for the right to operate, invests in the asset, and keeps <b>every toll</b> — but owns the downside if traffic disappoints. Revenue is <b>volume × price</b>, the price is inflation-indexed under the regulator (ANTT), and the concession runs a fixed term before the asset returns to the state. Higher risk, higher reward — and very exposed to the local economy.',
    mb:{tag:'Model B · private concession',title:'Private toll concession',body:'A private operator wins a fixed-term concession, invests in the crossing and <b>keeps the tolls, bearing full traffic risk</b>. The tariff is regulated and inflation-indexed; returns are higher than a state toll but swing with the economy and the accuracy of the traffic forecast. <b>This is Rio–Niterói</b> — operated by Ecoponte (EcoRodovias) on a 30-year concession won in 2015.'},
    s4a:'A toll concession is cheap to run and highly cash-generative once the traffic is there — collection and maintenance are the main costs. The waterfall below shows toll revenue, less the cost of operating and maintaining a long marine structure, leaving EBITDA. In emerging markets the margin is high but the discount rate is higher still.',
    wfNote:'Operating cost is maintenance of a long, salt-exposed concrete deck plus toll-collection and operations. The margin is high; the risk sits in the traffic line above and the cost of capital, not in opex.',
    s4b:'The concessionaire committed roughly <b>R$3.3&nbsp;billion</b> of investment over the life of the deal — toll systems, widening, maintenance and the concession itself. It is funded by a mix of equity and Brazilian debt; the model below shows how emerging-market financing costs shape the return.',
    stackH:'The capital stack · ~R$3.3 bn committed', splitL:'Concession investment', splitR:'Ecoponte · 30 yr',
    split:[['s1',60,'Debt ~60%'],['s2',40,'Equity ~40%']],
    finList:[['','Committed investment programme','~R$3.3bn'],['sub','Infrastructure capex','~R$1.3bn'],['sub','Concession &amp; systems','balance'],['','Toll revenue (2024)','~R$179m'],['','Concession term','30 yr (to ~2045)'],['rest','Tariff — inflation-indexed (ANTT)','IPCA']],
    finNote:'The whole case rests on a traffic forecast and an inflation-indexed toll. With no state guarantee, the concessionaire funds it with a balance of equity and local debt — and Brazil\'s cost of debt does much of the work in the return.',
    timeline:[['1969–74','<b>Built</b> over Guanabara Bay; opened March 1974.'],['2009','<b>Widened</b> — an extra lane each way.'],['Mar 2015','<b>Concession auctioned</b> — Ecoponte (EcoRodovias) wins among six bidders.'],['Jun 2015','<b>Operations begin</b>; the car toll is cut to R$3.70.'],['2015–26','<b>Tariff revisions</b> — ANTT inflation-indexed adjustments; toll now ~R$6.60.'],['~2045','<b>Concession ends</b> — the bridge reverts to the federal government.']],
    calcNote:'A working model calibrated to an <b>emerging-market merchant toll</b>. Revenue is traffic × toll, with real downside if either falls; the cost of debt is higher to reflect Brazilian country and currency risk. Even so, the operating leverage of a busy, low-cost bridge makes the merchant return the highest in this set.',
    s6:'Rio–Niterói is the merchant toll in full: no guarantee, no availability payment, just a private bet on how many cars cross a bridge in a volatile economy. The levers:',
    breakers:['<b>Traffic</b> — the make-or-break variable; a merchant concession has nothing to cushion a demand shortfall.','<b>The toll &amp; indexation</b> — regulated pricing power, indexed to inflation, against the risk of pricing out drivers.','<b>Country &amp; currency risk</b> — Brazil\'s cost of debt and FX move the return more than any engineering factor.','<b>Concession length</b> — a fixed term to recover capital, after which the asset hands back to the state.'],
    src:'Figures from public sources: <a href="https://www.gov.br/antt/" target="_blank" rel="noopener">ANTT</a> (the regulator), <a href="https://www.ecorodovias.com.br/" target="_blank" rel="noopener">EcoRodovias / Ecoponte</a> financials, <a href="https://www.britannica.com/place/Rio-Niteroi-Bridge" target="_blank" rel="noopener">Britannica</a> and engineering references. Some original-era cost figures are inconsistent across sources and are omitted.',
    econ:{mode:'toll',availPay:0,
      trafDef:66000,trafMin:25000,trafMax:120000,trafStep:1000,
      tollDef:6.6,tollMin:3,tollMax:16,tollStep:0.2,
      heavyDef:10,heavyMin:3,heavyMax:25},
    opex:{maintLab:'Maintenance &amp; renewals',opLab:'Operations &amp; tolling',f2:0.10,ins:0.0012,admin:8},
    calc:{build:1500,grant:0,om:30,revG:6,floor:120,cap:330,tax:34,exit:12,lev:3.5,rd:11,amort:4,hold:19},
    struct:{leftShore:'RIO',rightShore:'NITERÓI',water:'G U A N A B A R A   B A Y',span:'300 m steel box-girder · 72 m clearance over the channel',
      footer:'Box-girder beam bridge · 13.3 km · 72 m navigation clearance',
      segs:[{t:'girder',f0:0,f1:0.4,deck:0.22},{t:'hump',f0:0.4,f1:0.6,deck:0.22,peak:0.52},{t:'girder',f0:0.6,f1:1,deck:0.22}]}
  },

  /* ---------- 4 · SYDNEY HARBOUR (Australia · public toll) ---------- */
  sydney:{
    name:'Sydney Harbour Bridge', geo:'Sydney · north ⇄ south', continent:'Australia', cur:'A$',
    lede:'The great steel arch over Sydney Harbour — long since paid off, still tolled, and the clearest example of a public bridge run for the city rather than for a return.',
    s1:'<p class="body">The <b>Sydney Harbour Bridge</b> is a single 503&nbsp;m <b>steel through-arch</b> — the "Coathanger" — carrying eight road lanes, two rail tracks and a footway between the north shore and the city. Opened in 1932, its arch rises 134&nbsp;m above the water; the four granite pylons are decorative, the real work done by the steel and its abutments.</p>'+
       '<p class="body">It is the <b>public toll</b> archetype. Owned by the New South Wales government, its original construction debt was repaid in 1988 — yet the toll stayed, now funding maintenance and the wider transport network rather than a return to any investor. It is run for the city, not for a yield.</p>',
    facts:[['503 m','Arch span','steel through-arch'],['1,149 m','Total length','one great arch'],['134 m','Arch height','above water'],['1932','Opened','Dorman Long'],['~160k','Vehicles/day','+ 2 rail tracks'],['1988','Debt repaid','tolls retained']],
    s2:'A <b>through-arch</b> carries its deck partway up the inside of the arch, hung from vertical hangers, with the arch thrust driven down into massive abutments at each end (the stone pylons are essentially ornamental). It is a 1930s structure that demands constant care — there is famously always painting to be done. Commercially it is a public toll: a <b>government-set charge</b>, now electronic and time-of-day, levied southbound into the city. Set the traffic and toll to see the scale.',
    driverLab:'Avg toll /car', trafLab:'Tolled crossings/day', heavyLab:'Heavy share', hrK:'Toll collected /day', yrS:'retained by the state',
    preset:'Load the Sydney Harbour Bridge',
    try:'<b>Try this:</b> the toll here is deliberately modest and the debt is long gone — so the "return" is really just maintenance funding and demand management. A public bridge optimises for the <b>city\'s</b> outcome, not a financial one; the model shows what that looks like as numbers.',
    s3:'A public toll bridge earns <b>volume × price</b> like any other, but the owner is the state and the objective is different: keep a critical crossing maintained and manage demand, not maximise a return. The toll is <b>set by government</b>, escalated with inflation, and the cash funds upkeep and the wider network. It is the lowest-return, lowest-risk end of the spectrum — closer to a regulated utility than an investment.',
    mb:{tag:'Model B · public toll',title:'Public / government toll',body:'The state owns the bridge and sets the toll; the revenue funds maintenance and the transport network rather than an investor return. Lowest risk, lowest (often non-commercial) return, near-perpetual life. <b>This is Sydney Harbour Bridge</b> — owned by Transport for NSW, its 1932 debt repaid in 1988, the toll retained to keep the structure and the city moving.'},
    s4a:'An old steel bridge inverts the usual infrastructure cost profile: the capital was spent generations ago, but the <b>maintenance is relentless</b> — corrosion control, painting, deck and bearing renewal on a structure approaching a century old. The waterfall is modelled on a modern replacement-cost basis so the economics are comparable to the others.',
    wfNote:'Maintenance dominates: an ageing steel arch needs continuous, heavy upkeep. For a public asset that cost is the point — the toll exists largely to fund it.',
    s4b:'It cost about <b>£10&nbsp;million</b> all-in in the 1930s — long since repaid — so there is no real capital stack today. Modelled at a modern replacement value, a structure like this would run to a couple of billion dollars; the return that implies is low, which is exactly why such bridges are public.',
    stackH:'The capital stack · replacement basis', splitL:'Ownership', splitR:'public',
    split:[['s1',100,'New South Wales — Transport for NSW']],
    finList:[['','Original cost (1930s)','~£10m'],['','Construction debt repaid','1988'],['','Owner','Transport for NSW'],['','Tolling','electronic, southbound'],['','Combined bridge + tunnel toll revenue','~A$180m'],['rest','Modelled on replacement value','illustrative']],
    finNote:'There is no investor here to pay: the debt is gone and the toll funds upkeep and the network. The model uses a replacement value purely to express what a structure like this is "worth" and what return that implies — which is, deliberately, modest.',
    timeline:[['1924','<b>Construction begins</b> — Dorman Long of Middlesbrough.'],['Mar 1932','<b>Opens</b> — then the world\'s widest long-span bridge.'],['1988','<b>Original debt repaid</b> — after 56 years of tolls; the toll stays.'],['2009','<b>Cashless tolling</b> — electronic only, southbound.'],['2023–25','<b>Toll rises</b> with inflation; two-way tolling proposed.'],['ongoing','<b>Perpetual upkeep</b> — there is always painting to do.']],
    calcNote:'A working model on a <b>public-toll</b> basis. Revenue is traffic × toll, but the asset is run for the city, not a return — so the modelled IRR is low by design, and the build cost is a modern replacement estimate (the real structure was paid off in 1988).',
    s6:'Sydney shows the public end of the spectrum: a critical crossing run for the city, the toll funding upkeep rather than equity. What still matters:',
    breakers:['<b>The toll regime</b> — a government-set, inflation-linked charge, balanced against political tolerance for raising it.','<b>Maintenance burden</b> — an old steel structure\'s upkeep is the dominant, ever-present cost.','<b>Traffic</b> — mature and near capacity, so revenue grows by escalation, not volume.','<b>Public objective</b> — the asset optimises for mobility and demand management, not a financial return.'],
    src:'Figures from public sources: <a href="https://www.transport.nsw.gov.au/" target="_blank" rel="noopener">Transport for NSW</a>, the <a href="https://www.nma.gov.au/defining-moments/resources/sydney-harbour-bridge-opens" target="_blank" rel="noopener">National Museum of Australia</a> and NSW Government tolling releases. Bridge-only toll revenue is not separately published (reported with the Harbour Tunnel).',
    econ:{mode:'toll',availPay:0,
      trafDef:90000,trafMin:30000,trafMax:160000,trafStep:5000,
      tollDef:3.3,tollMin:1.5,tollMax:9,tollStep:0.1,
      heavyDef:7,heavyMin:2,heavyMax:20},
    opex:{maintLab:'Maintenance &amp; painting',opLab:'Operations &amp; tolling',f2:0.06,ins:0.0012,admin:8},
    calc:{build:1100,grant:0,om:35,revG:2.5,floor:80,cap:200,tax:30,exit:14,lev:5,rd:5,amort:3,hold:25},
    struct:{leftShore:'NORTH SHORE',rightShore:'SYDNEY CBD',water:'S Y D N E Y   H A R B O U R',span:'503 m steel arch · deck hung 49 m above the water',
      footer:'Steel through-arch · 503 m span · 8 lanes + 2 rail tracks',
      segs:[{t:'approach',f0:0,f1:0.2,deck:0.34},{t:'arch',f0:0.2,f1:0.8,deck:0.34,peak:0.84},{t:'approach',f0:0.8,f1:1,deck:0.34}]}
  },

  /* ---------- 5 · KING FAHD CAUSEWAY (Middle East · government toll) ---------- */
  kingfahd:{
    name:'King Fahd Causeway', geo:'Saudi Arabia ⇄ Bahrain', continent:'Middle East', cur:'US$',
    lede:'25&nbsp;km of causeway and bridges linking Saudi Arabia to the island of Bahrain — a strategic, government-owned border crossing that prints cash from a long-paid-off asset.',
    s1:'<p class="body">The <b>King Fahd Causeway</b> runs 25&nbsp;km across the Gulf of Bahrain, joining the Saudi mainland near Al-Khobar to the island kingdom of <b>Bahrain</b>. It is not one great span but a <b>chain of low embankments and bridge sections</b> hopping between artificial islands, with a customs-and-border island at the midpoint where the two countries meet.</p>'+
       '<p class="body">Opened in 1986 and built entirely with Saudi money, it is a <b>government-owned toll crossing</b> of real strategic weight — the only land link between Bahrain and the mainland. Decades on, with the capital long sunk, it carries tens of millions of travellers a year and is a quietly formidable cash machine.</p>',
    facts:[['25 km','Total length','causeway + bridges'],['5','Bridge sections','+ embankments'],['1986','Opened','Ballast Nedam'],['~US$1.2 bn','Cost (1980s)','Saudi-funded'],['~13m','Vehicles/year','~36k/day'],['2 govts','Owned by','KFCA']]
    ,s2:'Most of the crossing is a <b>causeway</b> — a low road on embankment and short viaduct spans just above the water — punctuated by taller <b>bridge sections</b> over the navigable channels and the central <b>Passport Island</b>, where border and customs facilities sit. There is no signature tower; the engineering achievement is length and durability in a corrosive marine environment. Commercially it is a government toll: <b>every vehicle pays</b> to cross a border. Set the traffic and toll to see the scale.',
    driverLab:'Avg toll /car', trafLab:'Crossings/day', heavyLab:'Heavy share', hrK:'Toll collected /day', yrS:'to the joint authority',
    preset:'Load the King Fahd Causeway',
    try:'<b>Try this:</b> the capital here was spent in the 1980s and is long gone, so almost every toll dollar drops through to cash. That is why a mature, paid-off crossing on a busy border is such a strong asset — and why a second causeway is now planned alongside it.',
    s3:'A government-owned toll crossing earns <b>volume × price</b> and keeps it for the state — here, jointly for two states. On a strategic border with no alternative land route, demand is unusually sticky and pricing power is real. With the original capital fully depreciated, the economics are dominated by how much traffic crosses and how cheaply the marine structure can be maintained. A planned <b>second causeway</b> would add capacity — and competition.',
    mb:{tag:'Model B · government toll',title:'Government-owned border toll',body:'Two states jointly own and operate the crossing and keep the tolls; on a strategic border with no land alternative, demand is resilient and pricing administered. Low cost of capital, very long life, strong cash conversion on a depreciated asset. <b>This is the King Fahd Causeway</b> — run by the joint King Fahd Causeway Authority, with a second link (King Hamad Causeway) in planning.'},
    s4a:'A paid-off causeway is almost pure cash: no remaining build cost, just the upkeep of a long structure in salt water. The waterfall below shows toll revenue, less maintenance and operations, leaving a very high EBITDA — the reward, and the temptation, of a mature strategic crossing.',
    wfNote:'Operating cost is the maintenance of 25&nbsp;km of marine structure — corrosion protection above all — plus border-crossing operations. Against strong toll revenue the margin is very high.',
    s4b:'It cost on the order of <b>US$0.8–1.2&nbsp;billion</b> in the 1980s, funded entirely by Saudi Arabia, and is long since paid off. Modelled at a modern replacement value, the strong traffic on a captive border crossing throws off a healthy return even in a low-tax Gulf setting.',
    stackH:'The capital stack · replacement basis', splitL:'Ownership', splitR:'two governments',
    split:[['s1',50,'Saudi Arabia'],['s2',50,'Bahrain']],
    finList:[['','Original cost (1980s)','~US$0.8–1.2bn'],['','Funded by','Saudi Arabia'],['','Owner/operator','King Fahd Causeway Authority'],['','Traffic (2024)','~13m vehicles'],['','Second link (King Hamad)','planned · PPP'],['rest','Modelled on replacement value','illustrative']],
    finNote:'With the original capital long sunk and no debt, the asset is effectively all equity throwing off cash. The model uses a replacement value to express the economics; the real story is a captive border crossing with decades of paid-off cash flow.',
    timeline:[['Jul 1981','<b>Saudi–Bahrain agreement</b> to build the causeway.'],['Nov 1982','<b>Construction begins</b> — Ballast Nedam.'],['Nov 1986','<b>Opens to traffic</b> — Bahrain\'s only land link.'],['2019','<b>~29m passengers/year</b> pre-pandemic.'],['2023–24','<b>Record traffic</b> — ~30m travellers; ~13m vehicles.'],['planned','<b>King Hamad Causeway</b> — a second road + rail link, PPP-financed.']],
    calcNote:'A working model on a <b>government-toll</b> basis. Revenue is traffic × toll; the Gulf\'s low tax and a long-paid-off, captive border crossing make the cash conversion strong. The build cost is a modern replacement estimate — the real causeway was paid off decades ago.',
    s6:'King Fahd shows the strength of a mature, strategic, government-owned crossing — and the one cloud on the horizon. The levers:',
    breakers:['<b>Captive demand</b> — the only land route to an island makes traffic unusually resilient and pricing sticky.','<b>Depreciated capital</b> — with the build long paid off, almost every toll drops to cash.','<b>Marine maintenance</b> — 25&nbsp;km of salt-exposed structure is the main recurring cost.','<b>Future competition</b> — the planned King Hamad Causeway would add capacity and split the traffic.'],
    src:'Figures from public sources: <a href="https://saudipedia.com/en/king-fahd-causeway" target="_blank" rel="noopener">Saudipedia</a>, <a href="https://www.britannica.com/place/King-Fahd-Causeway" target="_blank" rel="noopener">Britannica</a>, builder <a href="https://www.ballast-nedam.com/" target="_blank" rel="noopener">Ballast Nedam</a> and traffic reporting (Argaam). Original cost figures vary (~US$0.8–1.2bn); toll revenue is not publicly disclosed and is modelled.',
    econ:{mode:'toll',availPay:0,
      trafDef:35600,trafMin:12000,trafMax:90000,trafStep:1000,
      tollDef:9.3,tollMin:3,tollMax:20,tollStep:0.3,
      heavyDef:10,heavyMin:3,heavyMax:25},
    opex:{maintLab:'Marine maintenance',opLab:'Border operations',f2:0.07,ins:0.0012,admin:6},
    calc:{build:1400,grant:0,om:25,revG:4,floor:90,cap:260,tax:5,exit:14,lev:4,rd:6,amort:4,hold:25},
    struct:{leftShore:'SAUDI ARABIA',rightShore:'BAHRAIN',water:'G U L F   O F   B A H R A I N',span:'25 km of causeway, viaduct and five bridge sections',
      footer:'Causeway + bridge sections · 25 km · 4 lanes',
      segs:[{t:'causeway',f0:0,f1:0.4,deck:0.13},{t:'cableStay',f0:0.4,f1:0.5,deck:0.13,tower:0.34,pylons:[0.45],pylonStyle:'single'},{t:'island',f0:0.5,f1:0.58,deck:0.13},{t:'cableStay',f0:0.58,f1:0.68,deck:0.13,tower:0.34,pylons:[0.63],pylonStyle:'single'},{t:'causeway',f0:0.68,f1:1,deck:0.13}]}
  },

  /* ---------- 6 · HZMB (China · government mega-crossing, low utilisation) ---------- */
  hzmb:{
    name:'Hong Kong–Zhuhai–Macau Bridge', geo:'Hong Kong · Zhuhai · Macau', continent:'China', cur:'US$',
    lede:'The 55&nbsp;km sea crossing of the Pearl River Delta — the longest in the world, and a cautionary tale of a magnificent asset built far ahead of its traffic.',
    s1:'<p class="body">The <b>Hong Kong–Zhuhai–Macau Bridge</b> is the longest sea crossing on Earth: 55&nbsp;km of cable-stayed bridges and viaduct, a 6.7&nbsp;km <b>undersea tunnel</b>, and two artificial islands where the road dives beneath the shipping lanes and rises again. It stitches together three jurisdictions across the Pearl River estuary and was a signature feat of Chinese engineering when it opened in 2018.</p>'+
       '<p class="body">It is also the clearest <b>cautionary tale</b> in this set. Government-owned and tolled, it was built to a demand forecast that never arrived: for years it ran at a small fraction of capacity, and even after a policy-driven recovery the traffic remains far below what its ~US$19&nbsp;billion cost assumed. A brilliant asset is not automatically a good investment.</p>',
    facts:[['55 km','Total length','world\'s longest sea crossing'],['6.7 km','Undersea tunnel','+ 2 islands'],['458 m','Main span','Qingzhou cable-stayed'],['~US$19 bn','Project cost','3 governments'],['2018','Opened','October'],['~15k','Vehicles/day','far below capacity']],
    s2:'The crossing is a <b>bridge–island–tunnel</b> system: long cable-stayed and viaduct sections carry the road across open water, then dip through a 6.7&nbsp;km immersed <b>tunnel</b> between two artificial islands so that ocean shipping passes overhead, before climbing back to the bridge. Three cable-stayed navigation spans (the largest 458&nbsp;m) carry sculptural towers. It is tolled — but the slider that matters most is traffic, because the asset was sized for far more of it.',
    driverLab:'Avg toll /car', trafLab:'Vehicles/day', heavyLab:'Heavy share', hrK:'Toll collected /day', yrS:'to the three governments',
    preset:'Load the HZMB',
    try:'<b>Try this:</b> at the default traffic the returns are dismal — revenue barely covers the cost of running such a vast structure. Now drag the traffic up toward the capacity it was built for and watch the economics transform. The bridge isn\'t the problem; the <b>missing traffic</b> is.',
    s3:'HZMB earns <b>volume × price</b> like any toll crossing, kept by its government owners. But it is the case study in <b>demand risk realised</b>: the structure is magnificent and the cost colossal, yet the traffic arrived at a fraction of forecast, so the toll take is tiny against the capital. Returns on a toll asset are made or lost on the traffic line — and here, for years, that line simply was not there.',
    mb:{tag:'Model B · government mega-crossing',title:'Government toll · over-built',body:'Three governments jointly own and toll the crossing, but it was sized for demand that has not materialised — for years it ran far below capacity, so toll revenue is small relative to a ~US$19bn cost. Strategic and political value, weak commercial return. <b>This is HZMB</b>: an engineering triumph and an investment cautionary tale about traffic forecasts.'},
    s4a:'Even a lightly-used mega-bridge is enormously expensive to keep open — tunnel systems, marine structures and three sets of border facilities. The waterfall below shows the problem starkly: at low traffic the toll revenue barely clears the cost of operating and maintaining the asset, leaving a thin or negative margin until volumes rise.',
    wfNote:'Operating cost is unusually high for a bridge — an undersea tunnel, artificial islands and 55&nbsp;km of marine structure carry a large fixed maintenance bill, which a small toll take struggles to cover.',
    s4b:'The whole project cost about <b>US$19&nbsp;billion</b>, funded by the three governments (~31% equity, split Hong Kong / Guangdong / Macau) and ~69% bank debt. Against that, the toll revenue from current traffic is a rounding error — which is the entire lesson of the asset.',
    stackH:'The capital stack · ~US$19 bn project', splitL:'How it was funded', splitR:'three governments',
    split:[['s1',31,'Government equity ~31%'],['s2',69,'Bank loans ~69%']],
    finList:[['','Whole project cost','~US$19bn'],['sub','Main bridge','~US$7.2bn'],['','Government equity','~31%'],['sub','Hong Kong 50% · Guangdong 35% · Macau 15%','of equity'],['','Bank loans (BoC-led syndicate)','~69%'],['rest','Toll revenue vs cost','far below build']],
    finNote:'The capital stack is conventional; the problem is the asset side. A ~US$19bn structure carrying ~15,000 vehicles a day cannot, on tolls alone, earn a commercial return — its value is strategic and political, not financial.',
    timeline:[['2008','<b>Three governments agree</b> the financing and plan.'],['Dec 2009','<b>Construction begins</b> across the Pearl River estuary.'],['Jul 2017','<b>Main bridge connected</b> — deck closure.'],['Oct 2018','<b>Opens to traffic</b> — the world\'s longest sea crossing.'],['2018–22','<b>Traffic far below forecast</b>; toll waivers; Covid collapse.'],['2023–25','<b>Recovery</b> via northbound-vehicle schemes — still under capacity.']],
    calcNote:'A working model of a <b>magnificent over-build</b>. Revenue is traffic × toll, but the default traffic is a fraction of what a ~US$19bn asset needs, so the base-case return is poor. Drag the traffic toward its real capacity to see how a demand problem — not an engineering one — drives the result.',
    s6:'HZMB is the lesson that an engineering triumph and a sound investment are different things. The levers — really, the one lever — that decide it:',
    breakers:['<b>Traffic</b> — everything. The asset was sized for demand that has not come; the entire return question is whether it eventually does.','<b>Policy</b> — cross-boundary vehicle quotas and access rules, not the market, set how much traffic the bridge gets.','<b>Fixed cost</b> — a tunnel-and-island mega-structure is hugely expensive to run regardless of how few cross it.','<b>Strategic vs commercial</b> — its value is political and regional integration, which a toll-based DCF will never capture.'],
    src:'Figures from public sources: the <a href="https://www.hzmb.gov.hk/en/" target="_blank" rel="noopener">HZMB Authority</a>, Hong Kong / Guangdong / Macau government releases, and reporting on traffic and utilisation (<a href="https://macaonews.org/" target="_blank" rel="noopener">Macao News</a>, China Daily, Asia Times). Several official pages are access-restricted; some figures rest on consistent secondary reporting.',
    econ:{mode:'toll',availPay:0,
      trafDef:22000,trafMin:3000,trafMax:60000,trafStep:1000,
      tollDef:21,tollMin:8,tollMax:40,tollStep:1,
      heavyDef:12,heavyMin:3,heavyMax:30},
    opex:{maintLab:'Tunnel &amp; marine upkeep',opLab:'Operations &amp; border',f2:0.06,ins:0.0015,admin:15},
    calc:{build:7200,grant:0,om:110,revG:6,floor:0,cap:900,tax:25,exit:14,lev:6,rd:5,amort:3,hold:25},
    struct:{leftShore:'HONG KONG',rightShore:'ZHUHAI · MACAU',water:'P E A R L   R I V E R   E S T U A R Y',span:'458 m cable-stayed span · 6.7 km undersea tunnel · 2 islands',
      footer:'Bridge–island–tunnel · 55 km · world\'s longest sea crossing',
      segs:[{t:'causeway',f0:0,f1:0.22,deck:0.18},{t:'cableStay',f0:0.22,f1:0.4,deck:0.18,tower:0.5,pylons:[0.31],pylonStyle:'single'},{t:'island',f0:0.4,f1:0.46,deck:0.18},{t:'tunnel',f0:0.46,f1:0.64,deck:0.18},{t:'island',f0:0.64,f1:0.7,deck:0.18},{t:'cableStay',f0:0.7,f1:0.88,deck:0.18,tower:0.5,pylons:[0.79],pylonStyle:'single'},{t:'approach',f0:0.88,f1:1,deck:0.18}]}
  }
  };
  var ORDER=['oresund','gordie','rio','sydney','kingfahd','hzmb'];

  /* ===================================================================
     BRIDGE-ELEVATION RENDERER
  =================================================================== */
  var cv=document.getElementById('brcv'), ctx=cv?cv.getContext('2d'):null;
  var W=900,H=480,DPR=Math.max(2,Math.min(3,(window.devicePixelRatio||1)));
  var WL=Math.round(H*0.70), TOP=26, SHb=WL-TOP, SHORE=Math.round(W*0.075), XL=SHORE, XR=W-SHORE, BW=XR-XL, T=0;
  if(cv){ cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function yFor(f){ return WL - f*SHb; }
  function xAt(f){ return XL + f*BW; }
  function deckYInSeg(s,t){ var lvl=yFor(s.deck);
    if(s.t==='hump'){ return lvl + (yFor(s.peak)-lvl)*Math.sin(Math.PI*t); }
    if(s.t==='tunnel'){ var u=WL+0.13*SHb; if(t<0.16)return lvl+(u-lvl)*(t/0.16); if(t>0.84)return lvl+(u-lvl)*((1-t)/0.16); return u; }
    return lvl; }
  function buildProfile(segs){ var pts=[]; for(var i=0;i<segs.length;i++){ var s=segs[i],x0=xAt(s.f0),x1=xAt(s.f1),n=Math.max(2,Math.round((x1-x0)/7));
    for(var k=0;k<=n;k++){ var t=k/n; pts.push([x0+(x1-x0)*t, deckYInSeg(s,t)]); } } return pts; }
  function plen(p){ var L=[0],d=0; for(var i=1;i<p.length;i++){ d+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]); L.push(d);} return {L:L,total:d}; }
  function pat(p,m,f){ var d=f*m.total,i=1; while(i<m.L.length-1&&m.L[i]<d)i++; var a=p[i-1],b=p[i],sg=m.L[i]-m.L[i-1]||1,u=(d-m.L[i-1])/sg; return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]; }
  function yAtX(p,x){ for(var i=1;i<p.length;i++){ if(p[i][0]>=x){ var a=p[i-1],b=p[i],u=(x-a[0])/((b[0]-a[0])||1); return a[1]+(b[1]-a[1])*u; } } return p[p.length-1][1]; }
  function isTunnelX(segs,x){ for(var i=0;i<segs.length;i++){ if(segs[i].t==='tunnel' && x>=xAt(segs[i].f0)+6 && x<=xAt(segs[i].f1)-6) return true; } return false; }

  function pier(px,dy){ ctx.strokeStyle='#9aa4a0'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(px,dy); ctx.lineTo(px,WL+2); ctx.stroke(); }
  function pylon(px,dy,top,style){
    ctx.strokeStyle='#2b3a34'; ctx.lineWidth=5;
    if(style==='A'){ ctx.beginPath(); ctx.moveTo(px-10,dy); ctx.lineTo(px,top); ctx.lineTo(px+10,dy); ctx.stroke(); ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(px-5,(dy+top)/2); ctx.lineTo(px+5,(dy+top)/2); ctx.stroke(); }
    else if(style==='H'){ ctx.beginPath(); ctx.moveTo(px-5,dy); ctx.lineTo(px-5,top-6); ctx.moveTo(px+5,dy); ctx.lineTo(px+5,top-6); ctx.stroke(); ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(px-5,top); ctx.lineTo(px+5,top); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(px,dy); ctx.lineTo(px,top); ctx.stroke(); }
  }

  function draw(){
    if(!ctx||!A) return;
    var S=A.struct, segs=S.segs, prof=buildProfile(segs), meta=plen(prof);
    var traf=parseFloat(sTraf.value), av=parseFloat(sHeavy.value)/100;
    // sky
    var sky=ctx.createLinearGradient(0,0,0,WL); sky.addColorStop(0,'#e8f0f5'); sky.addColorStop(1,'#f3f6f6');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,WL);
    // water
    var sea=ctx.createLinearGradient(0,WL,0,H); sea.addColorStop(0,'#cadeea'); sea.addColorStop(1,'#aeccdf');
    ctx.fillStyle=sea; ctx.fillRect(0,WL,W,H-WL);
    ctx.strokeStyle='rgba(120,160,190,0.35)'; ctx.lineWidth=1;
    for(var wv=WL+14; wv<H; wv+=14){ ctx.beginPath(); ctx.moveTo(0,wv); ctx.lineTo(W,wv); ctx.stroke(); }
    // shores
    ctx.fillStyle='#d6e2d8'; ctx.fillRect(0,WL-26,SHORE,H-WL+26); ctx.fillRect(XR,WL-26,SHORE,H-WL+26);
    ctx.fillStyle='#bcd0bf'; ctx.fillRect(0,WL-26,SHORE,5); ctx.fillRect(XR,WL-26,SHORE,5);
    // islands & tunnel
    segs.forEach(function(s){ var x0=xAt(s.f0),x1=xAt(s.f1);
      if(s.t==='island'){ ctx.fillStyle='#e4dcc4'; ctx.fillRect(x0,WL-7,x1-x0,16); ctx.fillStyle='#cfc6a8'; ctx.fillRect(x0,WL-7,x1-x0,3); }
      if(s.t==='tunnel'){ ctx.strokeStyle='rgba(50,70,80,0.4)'; ctx.lineWidth=10; ctx.setLineDash([2,5]);
        ctx.beginPath(); ctx.moveTo(x0+4,WL+0.13*SHb); ctx.lineTo(x1-4,WL+0.13*SHb); ctx.stroke(); ctx.setLineDash([]); }
    });
    // piers
    segs.forEach(function(s){ var x0=xAt(s.f0),x1=xAt(s.f1);
      if(s.t==='approach'||s.t==='girder'||s.t==='causeway'){ var gap=s.t==='causeway'?30:70;
        for(var px=x0+gap*0.5;px<x1-2;px+=gap){ pier(px,yAtX(prof,px)); } }
      if(s.t==='hump'){ [x0+24,x1-24].forEach(function(px){ ctx.strokeStyle='#9aa4a0'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(px,yAtX(prof,px)); ctx.lineTo(px,WL+2); ctx.stroke(); }); }
    });
    // arch (drawn behind deck)
    segs.forEach(function(s){ if(s.t!=='arch')return; var x0=xAt(s.f0),x1=xAt(s.f1),crown=yFor(s.peak),spring=WL-4,span=x1-x0,steps=46;
      ctx.strokeStyle='#5d6a64'; ctx.lineWidth=5; ctx.beginPath();
      for(var a=0;a<=steps;a++){ var t=a/steps,ax=x0+span*t,ay=spring-(spring-crown)*Math.sin(Math.PI*t); a?ctx.lineTo(ax,ay):ctx.moveTo(ax,ay); } ctx.stroke();
      ctx.strokeStyle='rgba(93,106,100,0.7)'; ctx.lineWidth=1.4;
      for(var hg=1;hg<10;hg++){ var t=hg/10,hx=x0+span*t,ay=spring-(spring-crown)*Math.sin(Math.PI*t),dy=yAtX(prof,hx); ctx.beginPath(); ctx.moveTo(hx,ay); ctx.lineTo(hx,dy); ctx.stroke(); }
      // decorative end pylons
      [x0,x1].forEach(function(px){ ctx.fillStyle='#b9a98f'; ctx.fillRect(px-7,yAtX(prof,px)-22,14,40); });
    });
    // cable stays
    segs.forEach(function(s){ if(s.t!=='cableStay')return; var x0=xAt(s.f0),x1=xAt(s.f1),span=(x1-x0)*0.46;
      (s.pylons||[]).forEach(function(pf){ var px=xAt(pf),dy=yAtX(prof,px),top=dy-s.tower*SHb;
        ctx.strokeStyle='rgba(40,58,52,0.55)'; ctx.lineWidth=1.1;
        for(var j=1;j<=7;j++){ var off=span*j/7; [px-off,px+off].forEach(function(sx){ if(sx<XL||sx>XR)return; ctx.beginPath(); ctx.moveTo(px,top+4); ctx.lineTo(sx,yAtX(prof,sx)); ctx.stroke(); }); }
        pylon(px,dy,top,s.pylonStyle); }); });
    // deck (road)
    ctx.strokeStyle='#39463f'; ctx.lineWidth=5; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(prof[0][0],prof[0][1]); for(var i=1;i<prof.length;i++) ctx.lineTo(prof[i][0],prof[i][1]); ctx.stroke();
    ctx.strokeStyle='#c8a24a'; ctx.lineWidth=0.8; ctx.setLineDash([6,7]);
    ctx.beginPath(); ctx.moveTo(prof[0][0],prof[0][1]-0.2); for(var i2=1;i2<prof.length;i2++) ctx.lineTo(prof[i2][0],prof[i2][1]-0.2); ctx.stroke(); ctx.setLineDash([]);

    // traffic — two directions
    var nv=Math.max(6,Math.min(46,Math.round(traf/2500)));
    for(var d=0;d<2;d++){ var dir=d?1:-1, lane=d?-4.5:-9.5;
      for(var v=0;v<nv;v++){ var base=((T*0.0016*dir)+v/nv+(d?0.5:0))%1, f=base<0?base+1:base, p=pat(prof,meta,f);
        var heavy=((v*7+d*3)%100)/100 < av, tun=isTunnelX(segs,p[0]);
        ctx.globalAlpha=tun?0.28:1;
        ctx.fillStyle=heavy?'#bf5a39':'#f4f7f8'; ctx.strokeStyle=heavy?'#8f3f25':'#b9c4c2'; ctx.lineWidth=0.6;
        var w=heavy?9:6, h=heavy?5:4; ctx.fillRect(p[0]-w/2,p[1]+lane,w,h); ctx.strokeRect(p[0]-w/2,p[1]+lane,w,h);
      } }
    ctx.globalAlpha=1;

    // toll gantry near the left shore
    var gx=XL+BW*0.07, gy=yAtX(prof,gx);
    ctx.strokeStyle='#0c6b4f'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(gx-12,gy-22); ctx.lineTo(gx-12,gy-6); ctx.moveTo(gx+12,gy-22); ctx.lineTo(gx+12,gy-6); ctx.moveTo(gx-15,gy-22); ctx.lineTo(gx+15,gy-22); ctx.stroke();
    ctx.fillStyle='#0c6b4f'; ctx.font='700 7px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText('TOLL',gx,gy-25);

    // labels
    ctx.fillStyle='rgba(70,110,150,0.5)'; ctx.font='italic 600 12px "Source Serif 4",Georgia,serif'; ctx.textAlign='center';
    ctx.fillText(S.water, W/2, WL+0.34*(H-WL));
    ctx.fillStyle='rgba(60,90,70,0.7)'; ctx.font='700 10px Inter,sans-serif';
    ctx.textAlign='left'; ctx.fillText(S.leftShore, 8, WL-34);
    ctx.textAlign='right'; ctx.fillText(S.rightShore, W-8, WL-34);
    ctx.fillStyle='rgba(40,60,80,0.5)'; ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText(S.footer, W/2, H-9);

    // economics
    var toll=parseFloat(sToll.value), blended=toll*(1+av*1.5);
    var grossToll=traf*blended;                      // per day
    var grossRev = (A.econ.mode==='availability') ? A.econ.availPay*1e6 : grossToll*DAYS;
    var floor=(parseFloat(iFloor.value)||0)*1e6, capR=(parseFloat(iCap.value)||9e9)*1e6;
    var revenue=Math.max(floor,Math.min(capR,grossRev));
    capexGrossG=(parseFloat(iBuild.value)||0)*1e6; var grant=(parseFloat(iGrant.value)||0)*1e6; netCapexG=Math.max(0,capexGrossG-grant);
    var c_maint=(parseFloat(iOM.value)||0)*1e6, c_op=A.opex.f2*revenue, c_ins=A.opex.ins*capexGrossG, c_admin=A.opex.admin*1e6;
    var opex=c_maint+c_op+c_ins+c_admin, ebitda=revenue-opex;
    baseRevYr=revenue; baseEbYr=ebitda;

    set('brTrafV', Math.round(traf).toLocaleString()); set('brTollV', CUR+(toll>=10?Math.round(toll):toll.toFixed(toll<10?2:0))); set('brHeavyV', Math.round(av*100)+'%');
    set('brVeh', Math.round(traf).toLocaleString()+' /day'); set('brVehS', A.econ.mode==='availability'?'tolls go to the public owner':'paying crossings');
    set('brToll', CUR+blended.toFixed(blended<10?2:0));
    set('brTake', money(grossToll)+' /day');
    set('brYr', revenue<=0?CUR+'0':'≈ '+money(revenue));
    drawWaterfall(revenue, [[A.opex.maintLab,c_maint],[A.opex.opLab,c_op],['Insurance',c_ins],['Admin &amp; overhead',c_admin]], ebitda);
    set('wfMargin', revenue>0?Math.round(ebitda/revenue*100)+'%':'—');
  }

  /* ---------------- EBITDA waterfall ---------------- */
  function drawWaterfall(rev, costs, ebitda){
    var el=document.getElementById('brWaterfall'); if(!el) return;
    var Wd=600,Hd=200,padB=34,padT=22,h=Hd-padB-padT,max=Math.max(rev,1);
    var bars=costs.length+2, slot=Wd/bars, bw=Math.min(70,slot*0.62);
    function bx(i){ return slot*i+(slot-bw)/2; } function y(v){ return padT+h-(v/max)*h; }
    var s='',run=rev,i=0;
    function lbl(cx,topY,txt,val,col){ return '<text x="'+cx+'" y="'+(topY-6)+'" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="'+col+'">'+val+'</text>'+
      '<text x="'+cx+'" y="'+(Hd-padB+13)+'" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#6a7570">'+txt+'</text>'; }
    s+='<rect x="'+bx(0).toFixed(1)+'" y="'+y(rev).toFixed(1)+'" width="'+bw+'" height="'+(h*rev/max).toFixed(1)+'" rx="3" fill="#0c6b4f" opacity="0.92"/>';
    s+=lbl(bx(0)+bw/2,y(rev),'Revenue',money(rev),'#15201d'); i=1;
    costs.forEach(function(c){ var top=run,bot=run-c[1]; if(bot<0)bot=0; var yT=y(top),yB=y(bot);
      s+='<rect x="'+bx(i).toFixed(1)+'" y="'+yT.toFixed(1)+'" width="'+bw+'" height="'+Math.max(2,(yB-yT)).toFixed(1)+'" rx="3" fill="#ef8166" opacity="0.9"/>';
      s+='<line x1="'+(bx(i-1)+bw).toFixed(1)+'" y1="'+yT.toFixed(1)+'" x2="'+bx(i).toFixed(1)+'" y2="'+yT.toFixed(1)+'" stroke="#c9d2da" stroke-width="1" stroke-dasharray="2 2"/>';
      s+=lbl(bx(i)+bw/2,yT,c[0],'−'+money(c[1]),'#bc4733'); run=bot; i++; });
    s+='<line x1="'+(bx(i-1)+bw).toFixed(1)+'" y1="'+y(Math.max(0,run)).toFixed(1)+'" x2="'+bx(i).toFixed(1)+'" y2="'+y(Math.max(0,run)).toFixed(1)+'" stroke="#c9d2da" stroke-width="1" stroke-dasharray="2 2"/>';
    s+='<rect x="'+bx(i).toFixed(1)+'" y="'+y(Math.max(0,ebitda)).toFixed(1)+'" width="'+bw+'" height="'+Math.max(2,h*Math.max(0,ebitda)/max).toFixed(1)+'" rx="3" fill="#0a5a42"/>';
    s+=lbl(bx(i)+bw/2,y(Math.max(0,ebitda)),'EBITDA',money(ebitda),'#0a5a42');
    el.innerHTML=s;
  }

  /* ===================================================================
     DCF / LBO CALCULATOR  (shared with the interconnectors template)
  =================================================================== */
  function gv(id){ var v=parseFloat(document.getElementById(id).value); return isFinite(v)?v:0; }
  function irr(cf){ var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=3,flo=f(lo),fhi=f(hi); if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<140;k++){ var mid=(lo+hi)/2,fm=f(mid); if(flo*fm<=0){hi=mid;}else{lo=mid;flo=fm;} } return (lo+hi)/2; }
  function pctTxt(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }
  function computeModel(){
    var rev0=baseRevYr, eb0=baseEbYr, invest=netCapexG;
    if(eb0<=0 || rev0<=0 || invest<=0 || eb0/rev0<0.03) return null;
    var gR=gv('iRevG')/100, capexP=0.05, daP=0.04, tax=gv('iTax')/100;
    var xMul=gv('iExit'), N=Math.max(3,Math.min(40,Math.round(gv('iHold'))));
    var lev=gv('iLev'), rd=gv('iRd')/100, amort=gv('iAmort')/100;
    var debt0=Math.max(0,Math.min(lev*eb0, invest*0.9)), equity0=invest-debt0;
    var rows=[],uCF=[-invest],eCF=[-equity0],debtBal=debt0,amortAmt=amort*debt0,cum=-invest,payback=null;
    for(var t=1;t<=N;t++){ var rev=rev0*Math.pow(1+gR,t-1), eb=eb0*Math.pow(1+gR,t-1);
      var capex=capexP*rev, da=daP*rev, ebit=eb-da, fcff=eb-tax*Math.max(0,ebit)-capex;
      var interest=rd*debtBal, princ=Math.min(amortAmt,debtBal), ebt=ebit-interest, fcfe=eb-tax*Math.max(0,ebt)-capex-interest-princ;
      debtBal=Math.max(0,debtBal-princ); var uAdd=fcff,eAdd=fcfe;
      if(t===N){ var exitEV=xMul*eb; uAdd+=exitEV; eAdd+=(exitEV-debtBal); }
      if(payback===null){ cum+=fcff; if(cum>=0) payback=t; }
      uCF.push(uAdd); eCF.push(eAdd); rows.push({t:t,rev:rev,eb:eb,capex:capex,fcff:fcff,debt:debtBal,fcfe:fcfe}); }
    var exitEVf=xMul*rows[N-1].eb, distrib=eCF.slice(1).reduce(function(a,b){return a+b;},0), moic=equity0>0?distrib/equity0:NaN;
    return {invest:invest,debt0:debt0,equity0:equity0,N:N,rows:rows,uCF:uCF,eCF:eCF,uIRR:irr(uCF),lIRR:irr(eCF),exitEV:exitEVf,moic:moic,payback:payback};
  }
  function renderModel(){
    var m=computeModel();
    if(!m){ ['oUIRR','oLIRR','oMOIC','oPB'].forEach(function(id){ set(id,'—'); });
      var cs=document.getElementById('calcSum'); if(cs) cs.innerHTML='<span class="lbl">At this traffic the EBITDA is too thin to value — raise the traffic or toll. A lightly-used bridge can earn less than it costs to keep open.</span>'; return; }
    set('oUIRR',pctTxt(m.uIRR)); set('oLIRR',pctTxt(m.lIRR));
    set('oMOIC',isFinite(m.moic)?m.moic.toFixed(2)+'×':'—'); set('oPB',m.payback?m.payback+' yrs':'>'+m.N+' yrs');
    var ltv=Math.round(m.debt0/m.invest*100), cs2=document.getElementById('calcSum');
    if(cs2) cs2.innerHTML='<span><span class="lbl">Build / replacement cost</span> <b>'+money(capexGrossG)+'</b></span>'+
      '<span><span class="lbl">Net of grant</span> <b>'+money(netCapexG)+'</b></span>'+
      '<span><span class="lbl">Debt</span> <b>'+money(m.debt0)+'</b> ('+ltv+'% gearing)</span>'+
      '<span><span class="lbl">Equity in</span> <b>'+money(m.equity0)+'</b></span>'+
      '<span><span class="lbl">Exit EV</span> <b>'+money(m.exitEV)+'</b></span>';
    var maxAbs=Math.max.apply(null,m.eCF.map(Math.abs).concat([1])), step=m.N>14?3:(m.N>8?2:1), ch='<div class="jaxis"></div>';
    m.eCF.forEach(function(cf,i){ var hh=Math.max(2,Math.abs(cf)/maxAbs*60), cls=cf>=0?(i===m.N?'pos exit':'pos'):'neg';
      ch+='<div class="jcol"><div class="jbar '+cls+'" style="height:'+hh+'px" title="Year '+i+': '+money(cf)+'"></div><span class="jlbl">'+(i%step===0?i:'')+'</span></div>'; });
    var jc=document.getElementById('jchart'); if(jc) jc.innerHTML=ch;
    var ph=document.getElementById('ptHead'); if(ph) ph.innerHTML='<tr><th>Year</th><th>Revenue</th><th>EBITDA</th><th>Capex</th><th>Unlev. FCF</th><th>Net debt</th><th>Equity FCF</th></tr>';
    var pb=document.getElementById('ptBody'); if(pb) pb.innerHTML=m.rows.map(function(r){ return '<tr><td>'+r.t+'</td><td>'+m1(r.rev)+'</td><td>'+m1(r.eb)+'</td><td>'+m1(r.capex)+'</td><td>'+m1(r.fcff)+'</td><td>'+m1(r.debt)+'</td><td>'+m1(r.fcfe)+'</td></tr>'; }).join('');
  }

  /* ===================================================================
     RENDER an asset into the page
  =================================================================== */
  var sTraf=document.getElementById('brTraf'), sToll=document.getElementById('brToll_'), sHeavy=document.getElementById('brHeavy'),
      iBuild=document.getElementById('iBuild'), iGrant=document.getElementById('iGrant'), iOM=document.getElementById('iOM'),
      iFloor=document.getElementById('iFloor'), iCap=document.getElementById('iCap');

  function render(key){
    A=ASSETS[key]; CUR=A.cur;
    set('brAssetName',A.name); set('brAssetGeo',A.geo); set('brCont',A.continent); set('brBarName',A.name);
    html('brLede',A.lede);
    html('s1body',A.s1);
    html('brFacts',A.facts.map(function(f){ return '<div class="fact"><div class="n">'+f[0]+'</div><div class="l">'+f[1]+'</div><div class="d">'+f[2]+'</div></div>'; }).join(''));
    html('s2intro',A.s2);
    set('brTrafLab',A.trafLab); set('brTollLab',A.driverLab); set('brHeavyLab',A.heavyLab); set('brTakeK',A.hrK); set('brYrS',A.yrS);
    set('brPreset',A.preset); html('brTry',A.try);
    var E=A.econ;
    sTraf.min=E.trafMin; sTraf.max=E.trafMax; sTraf.step=E.trafStep; sTraf.value=E.trafDef;
    sToll.min=E.tollMin; sToll.max=E.tollMax; sToll.step=E.tollStep; sToll.value=E.tollDef;
    sHeavy.min=E.heavyMin; sHeavy.max=E.heavyMax; sHeavy.value=E.heavyDef;
    html('s3intro',A.s3); set('mbTag',A.mb.tag); set('mbTitle',A.mb.title); html('mbBody',A.mb.body);
    html('s4intro1',A.s4a); html('wfNote',A.wfNote); html('s4intro2',A.s4b);
    set('finStackH',A.stackH); html('finSplitL',A.splitL); html('finSplitR',A.splitR);
    html('finSplit',A.split.map(function(s){ return '<div class="seg '+s[0]+'" style="width:'+s[1]+'%">'+s[2]+'</div>'; }).join(''));
    html('finList',A.finList.map(function(r){ return '<li'+(r[0]?' class="'+r[0]+'"':'')+'><span class="fl">'+r[1]+'</span><span class="fa">'+r[2]+'</span></li>'; }).join(''));
    html('finNote',A.finNote);
    html('finTimeline',A.timeline.map(function(t){ return '<li><span class="yr">'+t[0]+'</span><span class="ev">'+t[1]+'</span></li>'; }).join(''));
    html('calcNote',A.calcNote);
    var c=A.calc; iBuild.value=c.build; iGrant.value=c.grant; iOM.value=c.om;
    document.getElementById('iRevG').value=c.revG; iFloor.value=c.floor; iCap.value=c.cap;
    document.getElementById('iTax').value=c.tax; document.getElementById('iExit').value=c.exit;
    document.getElementById('iLev').value=c.lev; document.getElementById('iRd').value=c.rd;
    document.getElementById('iAmort').value=c.amort; document.getElementById('iHold').value=c.hold;
    set('uBuild',CUR+'m'); set('uGrant',CUR+'m'); set('uOM',CUR+'m'); set('uFloor',CUR+'m'); set('uCap',CUR+'m');
    html('s6intro',A.s6); html('breakers',A.breakers.map(function(b){ return '<li>'+b+'</li>'; }).join(''));
    html('brSrc',A.src+' The interactive figures are illustrative — revenue uses a stylised traffic×toll model and the returns model is a simplified DCF; not a forecast, and not investment advice.');
    draw(); renderModel();
  }

  /* ===================================================================
     WIRING
  =================================================================== */
  if(cv){
    [sTraf,sToll,sHeavy].forEach(function(s){ s.addEventListener('input',function(){ draw(); renderModel(); }); });
    [iBuild,iGrant,iOM,iFloor,iCap].forEach(function(s){ s.addEventListener('input',function(){ draw(); renderModel(); }); });
    var preset=document.getElementById('brPreset');
    if(preset) preset.addEventListener('click',function(){ var E=A.econ; sTraf.value=E.trafDef; sToll.value=E.tollDef; sHeavy.value=E.heavyDef; draw(); renderModel(); });
    (function loop(){ T+=1; draw(); requestAnimationFrame(loop); })();
  }
  ['iRevG','iTax','iExit','iHold','iLev','iRd','iAmort'].forEach(function(id){ var e=document.getElementById(id); if(e) e.addEventListener('input',renderModel); });

  function revealStage(){
    var st=document.querySelector('.br-stage'); if(!st||!st.getBoundingClientRect||!window.scrollTo) return;
    var bar=document.querySelector('.ix-bar'), barH=(bar&&bar.getBoundingClientRect)?bar.getBoundingClientRect().height:0;
    var vh=window.innerHeight||800, r=st.getBoundingClientRect(), gap=barH+12;
    if(r.top>=gap-2 && r.top<=vh*0.5) return;
    window.scrollTo({top:Math.max(0,(window.pageYOffset||window.scrollY||0)+r.top-gap),behavior:'smooth'});
  }
  var sel=document.getElementById('brSelect');
  if(sel) sel.addEventListener('change',function(){ render(sel.value); revealStage(); });
  render(ORDER.indexOf(sel&&sel.value)>=0?sel.value:'oresund');

  /* scroll-spy */
  var links=[].slice.call(document.querySelectorAll('.ix-bar-nav a'));
  var secs=links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var i=secs.indexOf(e.target);
      links.forEach(function(l,j){ l.classList.toggle('on', j===i); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(b){ if(b) io.observe(b); });
  }
})();
