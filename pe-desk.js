/* Infrastructure private equity, the investor's seat. Two interactive pieces:
   1) THE SCREEN, a weighted scorecard that turns seven judgement calls into the
      triage verdict a deal team actually gives (decline / watch / pursue) and
      the fund bucket + target return the opportunity would have to clear.
   2) THE IC PAPER, a generated investment-committee memo for any of the 200+
      worked assets (window.MA_ASSETS): thesis, sources & uses, a compact
      base-case underwrite (EBITDA growth, cash conversion by asset class, a
      50% cash-sweep debt paydown, exit at the reference multiple), risks &
      mitigants, an IRR sensitivity grid and the exit map. Illustrative only. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function pct(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }
  function irr(cf){ var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi); if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<160;k++){ var mid=(lo+hi)/2,fm=f(mid); if(flo*fm<=0){hi=mid;}else{lo=mid;flo=fm;} } return (lo+hi)/2; }
  function money(cur,v){ var n=v<0; v=Math.abs(v);
    var o=v>=1000?(v/1000).toFixed(2)+'bn':Math.round(v).toLocaleString('en-US')+'m';
    return (n?'−':'')+cur+o; }

  /* ================================================================
     1 · THE SCREEN
  ================================================================ */
  var CRIT=[
    {k:'contract', q:'How contracted is the revenue?',
     o:['Merchant / market price','Mostly merchant, some contract','Balanced contract + market','Long contracts or regulation, some volume risk','Regulated / availability, fully decoupled']},
    {k:'moat', q:'Market position',
     o:['One of many competitors','Strong share, contestable','Leading platform, some competition','Dominant regional position','Natural monopoly']},
    {k:'jur', q:'Jurisdiction & regulatory maturity',
     o:['Frontier, untested regime','Emerging, improving track record','Established EM or new framework','Mature OECD, some political noise','Mature OECD, decades of precedent']},
    {k:'capex', q:'Capex & growth profile',
     o:['Heavy build risk, uncontracted demand','Large development pipeline','Balanced operating + growth capex','Mostly operating, funded growth','Fully built, maintenance only']},
    {k:'down', q:'Downside resilience',
     o:['Equity at risk in a mild downside','Covenants tight in downside','Base case robust, downside strained','Downside still covers debt comfortably','Contract floor protects equity']},
    {k:'plat', q:'Platform & bolt-on potential',
     o:['Single static asset','Limited adjacencies','Some bolt-on pipeline','Clear buy-and-build thesis','Category-defining platform play']},
    {k:'exit', q:'Exit visibility',
     o:['Unclear buyer universe','Niche buyers only','Sponsors would buy at the right price','Core funds + strategics both bid','Queue of natural owners']}
  ];
  function buildScreen(){
    var mount=el('peScreen'); if(!mount) return;
    mount.innerHTML=CRIT.map(function(c,i){
      return '<div class="scr-row"><label for="scr'+i+'">'+esc(c.q)+'</label>'+
        '<select id="scr'+i+'">'+c.o.map(function(o,j){
          return '<option value="'+(j+1)+'"'+(j===2?' selected':'')+'>'+(j+1)+' · '+esc(o)+'</option>'; }).join('')+
        '</select></div>';
    }).join('');
    CRIT.forEach(function(c,i){ el('scr'+i).addEventListener('input',scoreScreen); });
    scoreScreen();
  }
  function scoreScreen(){
    var s=0; CRIT.forEach(function(c,i){ s+=gv('scr'+i); });
    var avg=s/CRIT.length;
    var verdict,cls,bucket,band,note;
    if(avg<2.2){ verdict='Decline'; cls='no';
      bucket='Outside mandate'; band='—';
      note='Too much uncontracted risk for infrastructure capital, this is a private-equity or development-capital deal wearing a hard hat. Politely pass and protect the team’s time.'; }
    else if(avg<3){ verdict='Watch'; cls='watch';
      bucket='Revisit on process terms'; band='—';
      note='Interesting but not compelling at a competitive price. Track it, ask for the information memorandum, and re-engage if the process breaks or the price expectation resets.'; }
    else if(avg<3.9){ verdict='Pursue'; cls='go';
      bucket='Core-plus / value-add'; band='11–15% gross IRR target';
      note='Worth resourcing: request the data room, staff two on the model, and start diligence scoping. The return has to come from the plan, growth, contracting, platform, not from the entry price.'; }
    else { verdict='Pursue'; cls='go';
      bucket='Core';  band='8–11% gross IRR target';
      note='A quality asset the whole market will see. Winning it is a price decision, expect core funds and strategics in the final round, so the edge must be conviction on growth, financing or partnership, not model tricks.'; }
    el('scrVerdict').textContent=verdict;
    el('scrVerdict').className='scr-verdict '+cls;
    el('scrBucket').textContent=bucket;
    el('scrBand').textContent=band;
    el('scrScore').textContent=s+' / '+(CRIT.length*5);
    el('scrNote').textContent=note;
  }

  /* ================================================================
     2 · THE IC PAPER
  ================================================================ */
  var A=null;                                    // current asset
  var CODE=['Alder','Basalt','Cairn','Drummond','Ember','Falcon','Granite','Harbour','Ivory','Juniper',
            'Keel','Lantern','Meridian','Nimbus','Osprey','Pembroke','Quarry','Rockfall','Sterling','Tundra'];
  function codename(key){ var h=0; for(var i=0;i<key.length;i++) h=(h*31+key.charCodeAt(i))>>>0; return CODE[h%CODE.length]; }

  var CONV={ 'Energy & Utilities':0.52,'Transport':0.55,'Digital Infrastructure':0.45,
             'Social Infrastructure':0.60,'Energy Transition':0.55,'Environmental & Waste':0.50 };
  function bucketOf(a){
    if(a.cls==='Energy & Utilities'||a.cls==='Social Infrastructure') return {n:'Core',lo:8,hi:11};
    if(a.cls==='Digital Infrastructure'||a.cls==='Energy Transition')
      return (a.growth>5? {n:'Value-add',lo:13,hi:16} : {n:'Core-plus',lo:11,hi:13});
    return {n:'Core-plus',lo:11,hi:13};
  }
  var RISKS={
    'Energy & Utilities':[
      ['Regulatory reset','Allowed returns are re-struck each price control; a tougher determination directly reprices the equity.','Underwrite the next reset at the regulator’s draft numbers, not today’s; hold gearing inside notional.'],
      ['Rates & inflation basis','A geared, inflation-linked asset base is exposed to real-rate moves and index mismatch (CPI vs RPI).','Ladder the refinancing profile; match index-linked debt to indexed revenue.']],
    'Transport':[
      ['Volume & GDP linkage','Traffic and throughput track the economy; a recession lands directly in EBITDA.','Underwrite P90 volumes; size debt off the downside case with covenant headroom.'],
      ['Concession & political risk','Tariff formulas and concession terms can be reopened under public pressure.','Stress a tariff freeze; keep sovereign relationships and community licence invested.']],
    'Digital Infrastructure':[
      ['Contract renewal & churn','Tenancy and colocation contracts reprice; anchor-tenant loss is the tail risk.','Weight the underwrite to contracted years; diligence counterparty renewal economics.'],
      ['Technology & obsolescence','Demand curves are strong but the asset can be leapfrogged (routes, cooling density, spectrum).','Confirm the capex plan holds the asset current; avoid single-technology bets at full price.']],
    'Social Infrastructure':[
      ['Deduction & performance regime','Availability payments are docked for service failures; FM cost inflation eats the margin.','Diligence the payment mechanism deduction history; fixed-price or indexed FM subcontracts.'],
      ['Handback & residual','Concessions end; lifecycle underfunding surfaces at handback.','Fund the lifecycle reserve to the independent surveyor’s number, not management’s.']],
    'Energy Transition':[
      ['Merchant tail & capture price','Beyond the contracted period revenue is a power-price view, with cannibalisation risk.','Value the merchant tail at bank-case curves; extend contract cover where the market pays for it.'],
      ['Resource & availability','Wind, sun and outage statistics decide output; a P50 underwrite is half a coin-flip.','Underwrite P90 energy yield; contract availability with the OEM.']],
    'Environmental & Waste':[
      ['Commodity & offtake exposure','Gate fees are contracted but power and recyclate prices are not.','Hedge or contract output where liquid; underwrite recyclate at trough pricing.'],
      ['Feedstock & policy','Waste volumes and composition shift with policy (recycling targets, EPR).','Long municipal contracts with composition bands; diversify feedstock catchment.']]
  };
  var EM=/Brazil|China|Gulf|Saudi|UAE|NEOM|Egypt|Chile|Peru|LatAm|Africa|Turkey|Mozambique/i;
  var EXITS={
    'Energy & Utilities':'core open-ended funds, sovereign wealth and pension direct programmes, listed utilities',
    'Transport':'core infrastructure funds, strategic operators (port, airport and road groups), sovereign funds',
    'Digital Infrastructure':'digital-specialist funds, towercos and data-centre platforms, hyperscaler-adjacent capital',
    'Social Infrastructure':'listed and unlisted PPP secondary funds, pension direct programmes',
    'Energy Transition':'utilities and oil majors building renewable platforms, core-plus funds, listed green vehicles',
    'Environmental & Waste':'strategic waste groups, core-plus funds, energy-from-waste consolidators'
  };

  function fillSelect(){
    var sel=el('peAsset'); if(!sel||!window.MA_ASSETS) return;
    var html='';
    (MA_ASSETS.sectors||[]).forEach(function(s){
      html+='<optgroup label="'+esc(s.cls+' · '+s.name)+'">';
      s.assets.forEach(function(a){ html+='<option value="'+esc(s.url+'|'+a.key)+'">'+esc(a.name+' · '+a.geo)+'</option>'; });
      html+='</optgroup>';
    });
    sel.innerHTML=html;
    sel.addEventListener('change',function(){ loadAsset(); });
  }
  function findAsset(){
    var v=(el('peAsset').value||'').split('|');
    var out=null;
    (MA_ASSETS.sectors||[]).forEach(function(s){
      if(s.url!==v[0]) return;
      s.assets.forEach(function(a){ if(a.key===v[1]) out={cls:s.cls,sector:s.name,url:s.url,a:a}; });
    });
    return out;
  }
  function loadAsset(){
    var f=findAsset(); if(!f) return;
    A={cls:f.cls,sector:f.sector,url:f.url};
    for(var k in f.a) A[k]=f.a[k];
    el('peBid').value=0; el('peLev').value=A.lev;
    el('peHold').value=Math.min(10,A.hold||10);
    memo();
  }

  /* compact underwrite: EBITDA grows, cash conversion by class, 50% sweep, exit at reference multiple */
  function underwrite(bidPrem,lev,hold,exitAdj){
    var E0=A.ebitda, g=(A.growth||3)/100, rd=(A.rd||5)/100;
    var conv=CONV[A.cls]||0.52;
    var entryM=A.entry*(1+bidPrem/100);
    var EV=entryM*E0;
    var D=Math.min(lev*E0, 0.85*EV);
    var Eq=EV*1.02-D;                       // 2% transaction costs
    if(Eq<=0) return null;
    var cf=[-Eq], Dt=D, Et=E0;
    for(var t=1;t<=hold;t++){
      Et=E0*Math.pow(1+g,t);
      var free=Et*conv - rd*Dt;
      var sweep=Math.max(0,free)*0.5;
      sweep=Math.min(sweep,Dt);
      Dt-=sweep;
      cf.push(free-sweep);
    }
    var exitM=Math.max(1,(A.exit||A.entry)+exitAdj);
    var exitEq=exitM*Et-Dt;
    cf[hold]+=exitEq;
    var dist=0; for(var i=1;i<=hold;i++) dist+=cf[i];
    return {EV:EV,D:D,Eq:Eq,entryM:entryM,exitM:exitM,exitEq:exitEq,Dend:Dt,
            irr:irr(cf),moic:dist/Eq,ebN:Et,gear:D/EV};
  }

  function thesis(){
    var t=[];
    if(A.cls==='Energy & Utilities') t.push('A regulated, inflation-linked monopoly cash flow, revenue set on the asset base, decoupled from volume, the lowest-risk earnings stream in private markets.');
    if(A.cls==='Social Infrastructure') t.push('Availability-based, government-backed revenue with deductions as the only volume risk, an annuity with an operating standard attached.');
    if(A.cls==='Transport') t.push('An irreplaceable network position monetising movement of people and goods, with pricing power through the cycle.');
    if(A.cls==='Digital Infrastructure') t.push('Contracted digital demand growth, capacity sold on long escalator-linked terms into a structurally rising market.');
    if(A.cls==='Energy Transition') t.push('Contracted clean generation with a policy tailwind, the buildout the grid and the treaty commitments both require.');
    if(A.cls==='Environmental & Waste') t.push('Essential-service waste volumes under long municipal contracts, gate-fee cash flow with commodity upside.');
    if((A.growth||0)>=5) t.push('Above-sector EBITDA growth ('+A.growth+'% p.a. modelled) gives the underwrite a genuine compounding engine rather than multiple-dependence.');
    else t.push('Modest growth ('+(A.growth||0)+'% p.a. modelled) means the return is carried by yield and deleveraging, price discipline at entry is the whole game.');
    t.push('Exit optionality is real: '+EXITS[A.cls]+' are all natural owners at the right point in the cycle.');
    return t;
  }

  function memo(){
    if(!A) return;
    var bid=gv('peBid'), lev=gv('peLev'), hold=Math.max(3,Math.min(15,Math.round(gv('peHold'))));
    var u=underwrite(bid,lev,hold,0);
    var mount=el('peMemo');
    if(!u){ mount.innerHTML='<p class="pm-warn">The structure does not fund, at this bid and leverage the equity cheque is negative. Reduce leverage or the premium.</p>'; return; }
    var b=bucketOf(A), cur=A.cur;
    var lirr=u.irr*100;
    var meets = lirr>=b.lo;
    var strong= lirr>=b.hi;
    var rec = strong? 'Approve, submit a binding offer at this level'
            : meets? 'Approve to proceed, with price discipline at the top of this range'
            : 'Do not proceed at this price, revisit if the process resets';
    var recCls = strong?'go':(meets?'watch':'no');
    var risks=(RISKS[A.cls]||[]).slice();
    if(EM.test(A.geo)) risks.push(['Currency & political','Returns are earned in local currency under an emerging-market regime; FX and policy can dominate the outcome.','Match local-currency debt to revenue; price country risk into the discount rate, not the exit multiple.']);
    risks.push(['Financing & refinancing','The underwrite assumes debt at '+(A.rd||5)+'% remains available through the hold; a shut market at refinancing is the classic infra failure mode.','Long initial tenors, hedged base rates, and covenant headroom sized on the downside case.']);

    /* sensitivity grid: exit multiple × leverage */
    var sens='<table class="pm-sens"><thead><tr><th>Levered IRR</th>';
    [-1,0,1].forEach(function(dx){ sens+='<th>Exit '+(u.exitM+dx).toFixed(1)+'×</th>'; });
    sens+='</tr></thead><tbody>';
    [-1,0,1].forEach(function(dl){
      var lv=Math.max(0,lev+dl);
      sens+='<tr><td>'+lv.toFixed(1)+'× levered</td>';
      [-1,0,1].forEach(function(dx){
        var s=underwrite(bid,lv,hold,dx);
        var v=s? s.irr*100 : NaN;
        var cls=!isFinite(v)?'':(v>=b.hi?'hi':(v>=b.lo?'mid':'lo'));
        sens+='<td class="'+cls+'">'+(isFinite(v)?v.toFixed(1)+'%':'—')+(dl===0&&dx===0?' •':'')+'</td>';
      });
      sens+='</tr>';
    });
    sens+='</tbody></table>';

    mount.innerHTML=
      '<div class="pm-head">'+
        '<div><div class="pm-code">PROJECT '+codename(A.key).toUpperCase()+'</div>'+
        '<div class="pm-sub">Investment Committee paper · first-round approval · strictly private &amp; confidential</div></div>'+
        '<div class="pm-meta"><span>Deal team: Infrastructure Fund V</span><span>Sector: '+esc(A.sector)+'</span><span>Bucket: '+b.n+' ('+b.lo+'–'+b.hi+'% target)</span></div>'+
      '</div>'+

      '<div class="pm-rec '+recCls+'"><div class="k">1 · Recommendation</div><p><b>'+rec+'.</b> '+
        'The base case underwrites a <b>'+pct(u.irr)+' levered IRR</b> and <b>'+u.moic.toFixed(2)+'× MOIC</b> over a '+hold+'-year hold against the fund’s '+b.lo+'–'+b.hi+'% '+b.n.toLowerCase()+' target. '+
        'Equity cheque <b>'+money(cur,u.Eq)+'</b> at a <b>'+u.entryM.toFixed(1)+'× EV/EBITDA</b> entry ('+(bid>=0?'+':'')+bid+'% vs the reference value).</p></div>'+

      '<div class="pm-sec"><div class="k">2 · Investment thesis</div><ul>'+
        thesis().map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul></div>'+

      '<div class="pm-grid">'+
      '<div class="pm-sec"><div class="k">3 · The asset</div><table class="pm-tab">'+
        '<tr><td>Target</td><td><b>'+esc(A.name)+'</b> · '+esc(A.geo)+'</td></tr>'+
        '<tr><td>Sector</td><td><a href="'+A.url+'">'+esc(A.sector)+'</a> · '+esc(A.cls)+'</td></tr>'+
        '<tr><td>EBITDA (yr 1)</td><td>'+money(cur,A.ebitda)+' · growing '+A.growth+'% p.a.</td></tr>'+
        '<tr><td>Cash conversion</td><td>'+Math.round((CONV[A.cls]||0.52)*100)+'% of EBITDA (class assumption)</td></tr>'+
        '<tr><td>Reference returns</td><td>'+esc(A.uirr)+' unlevered · '+esc(A.lirr)+' levered (reference model)</td></tr>'+
      '</table></div>'+
      '<div class="pm-sec"><div class="k">4 · Deal &amp; structure</div><table class="pm-tab">'+
        '<tr><td>Enterprise value</td><td><b>'+money(cur,u.EV)+'</b> ('+u.entryM.toFixed(1)+'× EBITDA)</td></tr>'+
        '<tr><td>Senior debt</td><td>'+money(cur,u.D)+' ('+Math.round(u.gear*100)+'% LTV, '+lev.toFixed(1)+'× EBITDA, '+(A.rd||5)+'% all-in)</td></tr>'+
        '<tr><td>Equity + costs</td><td>'+money(cur,u.Eq)+' (incl. 2% transaction costs)</td></tr>'+
        '<tr><td>Debt at exit</td><td>'+money(cur,u.Dend)+' after a 50% cash sweep</td></tr>'+
        '<tr><td>Exit assumption</td><td>'+u.exitM.toFixed(1)+'× on '+money(cur,u.ebN)+' yr-'+hold+' EBITDA → '+money(cur,u.exitEq)+' to equity</td></tr>'+
      '</table></div>'+
      '</div>'+

      '<div class="pm-sec"><div class="k">5 · Risks &amp; mitigants</div><table class="pm-risk"><thead><tr><th>Risk</th><th>Why it matters</th><th>Mitigant</th></tr></thead><tbody>'+
        risks.map(function(r){ return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>'; }).join('')+
      '</tbody></table></div>'+

      '<div class="pm-grid">'+
      '<div class="pm-sec"><div class="k">6 · Sensitivities</div>'+sens+
        '<p class="pm-note">• = base case. Green clears the '+b.hi+'% stretch target, amber clears the '+b.lo+'% floor, red misses the bucket.</p></div>'+
      '<div class="pm-sec"><div class="k">7 · Exit</div><p class="pm-body">Hold '+hold+' years, exit to <b>'+EXITS[A.cls]+'</b>. '+
        'The value-creation plan (deleveraging, contracted growth'+((A.growth||0)>=5?', platform expansion':'')+') is what a core buyer pays forward for at exit, sell the asset de-risked, not the work still to do. '+
        'Full mechanics in the <a href="infrastructure-ma.html">M&amp;A module</a>; what the LPs keep net of fees and carry in <a href="fund-economics.html">fund economics</a>.</p></div>'+
      '</div>';
  }

  /* wiring */
  buildScreen();
  fillSelect();
  ['peBid','peLev','peHold'].forEach(function(id){ var e=el(id); if(e) e.addEventListener('input',memo); });
  var pr=el('pePrint'); if(pr) pr.addEventListener('click',function(){ window.print(); });
  if(el('peAsset')&&el('peAsset').options.length){ loadAsset(); }
})();
