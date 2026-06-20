/* "In action — entering the fibre market": a build vs buy vs buy-and-build
   comparator. One greenfield-style infrastructure funding model, run three ways
   over the same end-state footprint, so the three routes are compared like-for-
   like. Cohort penetration ramp, a capex/acquisition funding waterfall (debt to a
   cap, equity fills the gap, surplus sweeps debt then distributes), equity IRR /
   MOIC, peak equity and time-to-scale. Illustrative; not a forecast. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function f0(v){ return Math.round(v).toLocaleString('en-US'); }
  // values are in absolute £ — render as £k / £m / £bn
  function fM(v){ var neg=v<0; v=Math.abs(v); var s;
    if(v>=1e9) s='£'+(v/1e9).toFixed(2)+'bn'; else if(v>=1e6) s='£'+(v/1e6).toFixed(0)+'m';
    else if(v>=1e3) s='£'+(v/1e3).toFixed(0)+'k'; else s='£'+Math.round(v);
    return neg?'('+s+')':s; }
  function pct(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }

  function irr(cf){
    var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi);
    if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<160;k++){ var mid=(lo+hi)/2,fm=f(mid); if(flo*fm<=0){hi=mid;}else{lo=mid;flo=fm;} }
    return (lo+hi)/2;
  }
  function clamp(x,a,b){ return Math.max(a,Math.min(b,x)); }

  /* scenario overlay (flexes penetration, build cost and exit multiple) */
  var scen='base';
  var SCEN={ down:{pen:-8,bc:1.15,exit:-1.5}, base:{pen:0,bc:1,exit:0}, up:{pen:5,bc:0.95,exit:1} };

  /* shared assumptions read from the inputs.
     ov overrides pen(%), buildCost(£), exit(×); applyScen toggles the scenario overlay. */
  function shared(ov, applyScen){
    ov=ov||{}; if(applyScen===undefined) applyScen=true;
    var s=applyScen?SCEN[scen]:SCEN.base;
    var penV=('pen' in ov)?ov.pen:gv('aPen')+s.pen;
    var bcV =('buildCost' in ov)?ov.buildCost:gv('aBuildCost')*s.bc;
    var exV =('exit' in ov)?ov.exit:gv('aExit')+s.exit;
    return {
      homes: Math.max(1, gv('aHomes'))*1000,
      buildCost: bcV, conn: gv('aConn'),
      pen: clamp(penV,1,95)/100, ramp: Math.max(1, gv('aRamp')),
      arpu: gv('aArpu'), opex: clamp(gv('aOpex'),5,90)/100,
      buildYrs: Math.max(1, Math.round(gv('aBuildYrs'))),
      lev: gv('aLev'), rd: gv('aRd')/100, exit: exV,
      H: Math.max(5, Math.min(20, Math.round(gv('aHorizon')))),
      tax: 0.25, life: 20, arpuG: 0.025,
      entryBuy: gv('aEntryBuy'),
      platShare: clamp(gv('aPlatShare'),0,90)/100, platMult: gv('aPlatMult')
    };
  }
  function buildIRR(penPct, exitX){ var S=shared({pen:penPct, exit:exitX}, false); return routeModel(S, cfgFor('build',S)).irr; }
  function breakEvenPen(hurdle){          // steady penetration at which the build route hits the hurdle
    var ex=gv('aExit');
    var f=function(p){ var v=buildIRR(p,ex); return (isFinite(v)?v:-1)-hurdle; };   // treat undefined (deep-loss) IRR as below hurdle
    var lo=10, hi=62, flo=f(lo), fhi=f(hi);   // well-behaved range (IRR search caps out beyond this)
    if(flo*fhi>0) return null;             // hurdle not crossed in range
    for(var k=0;k<50;k++){ var m=(lo+hi)/2, fm=f(m); if(flo*fm<=0){hi=m;}else{lo=m;flo=fm;} }
    return (lo+hi)/2;
  }

  /* one route. cfg: {acqHomes, buildHomes, acqMult} (acquired homes are mature/penetrated) */
  function routeModel(S, cfg){
    var H=S.H, ramp=S.ramp, by=S.buildYrs;
    var matureEB = S.homes*S.pen*S.arpu*12*(1-S.opex);   // end-state EBITDA (same footprint for all routes)
    var debtCap = Math.max(0, S.lev*matureEB);
    var da = (cfg.buildHomes*S.buildCost + cfg.buildHomes*S.pen*S.conn) / S.life; // rough straight-line shield

    // build schedule (homes passed added each year 1..by)
    function addBuild(t){ return (t>=1 && t<=by) ? cfg.buildHomes/by : 0; }
    function connected(t){
      var c = cfg.acqHomes*S.pen;                  // acquired block: already penetrated
      for(var y=1;y<=Math.min(t,by);y++){ c += addBuild(y)*S.pen*clamp((t-y)/ramp,0,1); }
      return c;
    }

    var eb=[0], conn=[connected(0)], cap=[0];
    // t0: acquisition
    var acqEB = cfg.acqHomes*S.pen*S.arpu*12*(1-S.opex);
    var acqEV = cfg.acqMult*acqEB;
    var debt0 = Math.min(acqEV, debtCap), eq0 = acqEV-debt0, debtBal=debt0;
    var eqCF=[-eq0], inject=eq0, distrib=0, peak=eq0, cumEq=eq0, exitEqV=0, peakDebt=debt0;
    var ttScale=null, prevConn=conn[0];

    for(var t=1;t<=H;t++){
      var cn=connected(t); conn[t]=cn;
      var rev=cn*S.arpu*Math.pow(1+S.arpuG,t-1)*12, ox=S.opex*rev, ebt=rev-ox; eb[t]=ebt;
      var newConn=Math.max(0, cn-prevConn); prevConn=cn;
      var capex=addBuild(t)*S.buildCost + newConn*S.conn; cap[t]=capex;
      var interest=S.rd*debtBal;
      var tax=S.tax*Math.max(0, ebt-da);
      var cfBefore = ebt - tax - interest - capex;
      var thisInject=0, thisDist=0;
      if(cfBefore<0){
        var gap=-cfBefore, room=Math.max(0,debtCap-debtBal);
        var draw=Math.min(gap,room); debtBal+=draw; thisInject=gap-draw;
      } else {
        var repay=Math.min(cfBefore,debtBal); debtBal-=repay; thisDist=cfBefore-repay;
      }
      inject+=thisInject; distrib+=thisDist; cumEq+=thisInject-thisDist; peak=Math.max(peak,cumEq); peakDebt=Math.max(peakDebt,debtBal);
      var cf=thisDist-thisInject;
      if(t===H){ exitEqV=Math.max(0,S.exit*ebt)-debtBal; cf+=exitEqV; distrib+=exitEqV; }
      eqCF.push(cf);
      // time to scale: first year homes passed >= 95% of target
      var hp=cfg.acqHomes; for(var z=1;z<=Math.min(t,by);z++) hp+=addBuild(z);
      if(ttScale===null && hp>=0.95*S.homes) ttScale=t;
    }
    var totalIn=inject, totalOut=distrib;
    var entryPerHome = cfg.acqHomes>0 ? acqEV/cfg.acqHomes : S.buildCost;
    return { irr:irr(eqCF), moic: totalIn>0? totalOut/totalIn : NaN, peak:peak, totalEq:totalIn,
      ebH:eb[H], exitEq:exitEqV, conn:conn, eb:eb, eqCF:eqCF, ttScale:ttScale, acqEV:acqEV, debtCap:debtCap,
      matureEB:matureEB, peakDebt:peakDebt, entryPerHome:entryPerHome, acqHomes:cfg.acqHomes };
  }

  var ROUTES=[
    {key:'build', name:'Build it yourself', tag:'Greenfield / organic',
      desc:'Stand up (or back) a platform and build the whole footprint at cost. Maximum control and value capture — you take construction, penetration and overbuild risk through the full J-curve.'},
    {key:'buy', name:'Buy a full network', tag:'M&A / take-private',
      desc:'Acquire a built, penetrated network. Instant scale and proven cash flow, but you pay a full multiple in a competitive process and inherit someone else’s build choices.'},
    {key:'bnb', name:'Buy small, then build', tag:'Buy-and-build platform',
      desc:'Acquire a sub-scale altnet as a platform — management, systems, footprint — then fund the organic build-out and bolt-ons. The classic value-add route; needs a real build machine.'}
  ];

  function cfgFor(key,S){
    if(key==='build') return {acqHomes:0, buildHomes:S.homes, acqMult:0};
    if(key==='buy')   return {acqHomes:S.homes, buildHomes:0, acqMult:S.entryBuy};
    return {acqHomes:S.homes*S.platShare, buildHomes:S.homes*(1-S.platShare), acqMult:S.platMult};
  }

  function spark(eqCF){
    var maxAbs=Math.max.apply(null,eqCF.map(Math.abs).concat([1]));
    var h='<div class="rs-axis"></div>';
    eqCF.forEach(function(v,t){ var bh=Math.max(2,Math.abs(v)/maxAbs*26);
      var cls=v>=0?(t===eqCF.length-1?'pos exit':'pos'):'neg';
      h+='<div class="rs-col"><div class="rs-bar '+cls+'" style="height:'+bh+'px" title="Yr '+t+': '+fM(v)+'"></div></div>'; });
    return h;
  }

  function heatColor(irr){
    if(!isFinite(irr)) return '#cfd6d2';
    var x=clamp((irr-0.04)/0.16,0,1), r,g,b;             // 4%→red, 12%→amber, 20%→green
    if(x<0.5){ var t=x/0.5; r=188+(176-188)*t; g=71+(125-71)*t; b=51+(36-51)*t; }
    else { var t2=(x-0.5)/0.5; r=176+(12-176)*t2; g=125+(107-125)*t2; b=36+(79-36)*t2; }
    return 'rgb('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+')';
  }
  function renderHeat(){
    var h=el('maHeat'); if(!h) return;
    var pc=gv('aPen'), ex=gv('aExit');
    var pens=[pc-10,pc-5,pc,pc+5,pc+10].map(function(p){return clamp(p,5,90);});
    var exits=[ex-2,ex-1,ex,ex+1,ex+2].map(function(e){return Math.max(6,e);});
    var html='<tr><td class="corner">Penetration ↓ · Exit × →</td>';
    exits.forEach(function(e){ html+='<th>'+e.toFixed(1)+'×</th>'; });
    html+='</tr>';
    pens.forEach(function(p){ html+='<tr><td class="rh">'+Math.round(p)+'%</td>';
      exits.forEach(function(e){ var irr=buildIRR(p,e), base=(Math.abs(p-pc)<1e-6&&Math.abs(e-ex)<1e-6);
        html+='<td class="cell'+(base?' base':'')+'" style="background:'+heatColor(irr)+';color:#fff">'+pct(irr)+'</td>'; });
      html+='</tr>'; });
    h.innerHTML=html;
  }

  function run(){
    var S=shared();
    var matureEB=S.homes*S.pen*S.arpu*12*(1-S.opex);
    var connSteady=S.homes*S.pen;
    el('rsFoot').innerHTML='End-state footprint (all three routes): <b>'+f0(S.homes/1000)+'k homes passed</b>, '+
      Math.round(S.pen*100)+'% penetration → <b>'+f0(connSteady/1000)+'k connected</b>, ARPU £'+S.arpu+
      '/mo → mature EBITDA <b>'+fM(matureEB)+'</b>. Senior debt capped at '+S.lev+'× that (<b>'+fM(S.lev*matureEB)+'</b>); exit at '+S.exit+'× EBITDA.';
    // wire the "buy case" into the acquisition model (toolkit hand-off)
    var tm=el('toModel');
    if(tm) tm.href='infrastructure-ma.html?eb='+Math.round(matureEB/1e6)+'&entry='+gv('aEntryBuy').toFixed(1)+
      '&exit='+gv('aExit').toFixed(1)+'&lev='+gv('aLev').toFixed(1)+'&hold='+Math.round(gv('aHorizon'))+'&cur='+encodeURIComponent('£');
    var results=ROUTES.map(function(r){ return {r:r, m:routeModel(S, cfgFor(r.key,S))}; });
    // best IRR for the verdict
    var bestIRR=Math.max.apply(null, results.map(function(x){ return isFinite(x.m.irr)?x.m.irr:-9; }));
    var html=results.map(function(x){
      var m=x.m, isBest=(isFinite(m.irr)&&Math.abs(m.irr-bestIRR)<1e-9);
      return '<div class="route'+(isBest?' best':'')+'">'+
        (isBest?'<div class="route-flag">Highest modelled IRR</div>':'')+
        '<div class="route-tag">'+x.r.tag+'</div>'+
        '<div class="route-name">'+x.r.name+'</div>'+
        '<p class="route-desc">'+x.r.desc+'</p>'+
        '<div class="route-kpis">'+
          '<div class="kpi big"><div class="k">Equity IRR</div><div class="v">'+pct(m.irr)+'</div></div>'+
          '<div class="kpi big"><div class="k">MOIC</div><div class="v">'+(isFinite(m.moic)?m.moic.toFixed(2)+'×':'—')+'</div></div>'+
          '<div class="kpi"><div class="k">Equity deployed</div><div class="v">'+fM(m.totalEq)+'</div></div>'+
          '<div class="kpi"><div class="k">Time to full scale</div><div class="v">'+(m.ttScale?m.ttScale+' yrs':'at entry')+'</div></div>'+
          '<div class="kpi"><div class="k">Exit EBITDA</div><div class="v">'+fM(m.ebH)+'</div></div>'+
          '<div class="kpi"><div class="k">Exit equity value</div><div class="v">'+fM(m.exitEq)+'</div></div>'+
        '</div>'+
        '<div class="route-basis">Entry basis <b>'+(m.acqHomes>0?'£'+f0(m.entryPerHome)+'/home':'£'+f0(m.entryPerHome)+'/home at cost')+'</b> · peak senior debt <b>'+fM(m.peakDebt)+'</b></div>'+
        '<div class="route-spark-h">Equity cash flow by year — the J-curve</div>'+
        '<div class="rs-chart">'+spark(m.eqCF)+'</div>'+
      '</div>';
    }).join('');
    el('routes').innerHTML=html;

    // verdict line
    var byIRR=results.slice().sort(function(a,b){ return (b.m.irr||-9)-(a.m.irr||-9); });
    var byEq=results.slice().sort(function(a,b){ return a.m.totalEq-b.m.totalEq; });
    var byTime=results.slice().sort(function(a,b){ return (a.m.ttScale||0)-(b.m.ttScale||0); });
    el('verdict').innerHTML='At these assumptions, <b>'+byIRR[0].r.name.toLowerCase()+'</b> shows the highest modelled equity IRR ('+pct(byIRR[0].m.irr)+
      '), <b>buy a full network</b> reaches full scale fastest (at entry), and <b>'+byEq[0].r.name.toLowerCase()+'</b> needs the least equity ('+fM(byEq[0].m.totalEq)+
      '). The point estimate flatters building, which carries the execution and penetration risk the IRR alone doesn’t show — read it with the process and risk notes below.';
    var be=breakEvenPen(0.12), beEl=el('beNote');
    if(beEl) beEl.innerHTML = be!=null
      ? 'Break-even: building clears a <b>12% equity IRR</b> at roughly <b>'+Math.round(be)+'% steady penetration</b> (at the current build cost and exit). Below that the greenfield route does not earn its hurdle — the heart of the overbuild risk.'
      : 'Building does not reach a 12% IRR across the penetration range at these settings.';
    renderHeat();
  }

  var IDS=['aHomes','aBuildCost','aConn','aPen','aRamp','aArpu','aOpex','aBuildYrs','aLev','aRd','aExit','aHorizon','aEntryBuy','aPlatShare','aPlatMult'];
  IDS.forEach(function(id){ var e=el(id); if(e) e.addEventListener('input',run); });
  // scenario toggle
  [].slice.call(document.querySelectorAll('.scen button')).forEach(function(b){
    b.addEventListener('click',function(){ scen=b.dataset.scen;
      document.querySelectorAll('.scen button').forEach(function(x){ x.classList.toggle('on', x===b); }); run(); });
  });
  var reset=el('rsReset');
  var DEF={aHomes:500,aBuildCost:500,aConn:275,aPen:42,aRamp:5,aArpu:17,aOpex:32,aBuildYrs:4,aLev:5,aRd:7,aExit:14,aHorizon:12,aEntryBuy:16,aPlatShare:25,aPlatMult:13};
  if(reset) reset.addEventListener('click',function(){ Object.keys(DEF).forEach(function(id){ var e=el(id); if(e) e.value=DEF[id]; });
    scen='base'; document.querySelectorAll('.scen button').forEach(function(x){ x.classList.toggle('on', x.dataset.scen==='base'); }); run(); });
  if(el('aHomes')) run();
})();
