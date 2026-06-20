/* "M&A in action — a data-centre platform": develop vs buy-stabilised, over the
   same capacity. Powered land built to a pre-let then leased up, vs acquiring a
   fully-let asset at a cap rate. Yearly funding waterfall + equity IRR/MOIC, and
   the development spread (build yield vs exit cap rate). Illustrative ($). */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function clamp(x,a,b){ return Math.max(a,Math.min(b,x)); }
  function fM(v){ var neg=v<0; v=Math.abs(v); var s = v>=1e9?'$'+(v/1e9).toFixed(2)+'bn':(v>=1e6?'$'+(v/1e6).toFixed(0)+'m':'$'+Math.round(v/1e3)+'k'); return neg?'('+s+')':s; }
  function pct(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }
  function irr(cf){ var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi); if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<160;k++){ var m=(lo+hi)/2,fm=f(m); if(flo*fm<=0){hi=m;}else{lo=m;flo=fm;} } return (lo+hi)/2; }

  function inputs(){
    var mw=Math.max(1,gv('cMW'));
    var rate=gv('cRate'), opex=clamp(gv('cOpex'),5,80)/100;
    return {
      mw:mw, buildCost:gv('cBuildCost')*1e6,                 // $/MW
      prelet:clamp(gv('cPrelet'),0,100)/100, target:clamp(gv('cTargetLet'),10,100)/100,
      luYrs:Math.max(1,Math.round(gv('cLeaseupYrs'))),
      rate:rate, opex:opex, lev:gv('cLev'), rd:gv('cRd')/100,
      exit:gv('cExit'), entryMult:gv('cEntryMult'), H:Math.max(4,Math.min(15,Math.round(gv('cHold')))),
      ebAt:function(util){ return mw*1000*util*rate*12*(1-opex); }   // EBITDA at a utilisation
    };
  }

  // route: 'dev' (build to pre-let, lease up) or 'buy' (acquire fully let)
  function routeModel(I, route){
    var stab=I.ebAt(I.target), buildTotal=I.mw*I.buildCost, debtCap=I.lev*stab;
    var LTC=0.60;                                          // loan-to-cost cap on construction/entry debt
    var H=I.H, eb0, entryEV, debt0, eqCF, debtBal, inject, distrib, peakDebt, eb=[], cumCost;
    if(route==='buy'){
      eb0=stab; entryEV=I.entryMult*stab; debt0=Math.min(entryEV*LTC, debtCap); cumCost=entryEV; }
    else { eb0=I.ebAt(I.prelet); entryEV=0; debt0=0; cumCost=0; }      // develop: spend over build
    var equity0=Math.max(0, entryEV-debt0);
    debtBal=debt0; inject=equity0; distrib=0; peakDebt=debt0; eqCF=[-equity0];
    var ramp=Math.max(1, I.luYrs*(1-0.4*I.prelet));        // a pre-let shortens the lease-up
    for(var t=1;t<=H;t++){
      var built = route==='buy' ? 1 : clamp(t/I.luYrs,0,1);            // capacity online
      var util  = route==='buy' ? I.target : I.target*clamp(t/ramp,0,1);
      var ebt=I.ebAt(util)*Math.pow(1.02,Math.max(0,t-I.luYrs)); eb[t]=ebt;
      var buildCapex = route==='dev' && t<=I.luYrs ? buildTotal/I.luYrs : 0;   // construction
      var maintCapex = 0.04*ebt;
      var interest=I.rd*debtBal, tax=0.21*Math.max(0,ebt-buildTotal/15);
      // construction is funded by debt to loan-to-cost, with equity funding the rest
      var thisInj=0, di=0;
      if(buildCapex>0){ cumCost+=buildCapex; var room=Math.max(0,Math.min(debtCap,LTC*cumCost)-debtBal);
        var draw=Math.min(LTC*buildCapex, room); debtBal+=draw; thisInj+=buildCapex-draw; }
      // operations fund interest, tax and maintenance; surplus sweeps debt then distributes
      var opCash=ebt-tax-interest-maintCapex;
      if(opCash<0){ thisInj+=-opCash; }
      else { var rep=Math.min(opCash,debtBal); debtBal-=rep; di=opCash-rep; }
      inject+=thisInj; distrib+=di; peakDebt=Math.max(peakDebt,debtBal);
      var cf=di-thisInj; if(t===H){ var exq=Math.max(0,I.exit*ebt)-debtBal; cf+=exq; distrib+=exq; }
      eqCF.push(cf);
    }
    return { irr:irr(eqCF), moic: inject>0?distrib/inject:NaN, equityIn:inject, ebH:eb[H], eqCF:eqCF,
      buildYield: route==='dev'? stab/buildTotal : null, entryEV:entryEV, stab:stab, buildTotal:buildTotal, peakDebt:peakDebt };
  }

  function bar(eqCF){ var maxAbs=Math.max.apply(null,eqCF.map(Math.abs).concat([1])), h='<div class="rs-axis"></div>';
    eqCF.forEach(function(v,t){ var bh=Math.max(2,Math.abs(v)/maxAbs*26), cls=v>=0?(t===eqCF.length-1?'pos exit':'pos'):'neg';
      h+='<div class="rs-col"><div class="rs-bar '+cls+'" style="height:'+bh+'px" title="Yr '+t+': '+fM(v)+'"></div></div>'; }); return h; }

  var R=[{k:'dev',name:'Develop',tag:'Build to a pre-let',desc:'Secure powered land, build to a contracted pre-let, then lease up the balance. You capture the spread between the yield you build at and the cap rate you exit on — but take construction and lease-up risk.'},
         {k:'buy',name:'Buy stabilised',tag:'Acquire fully let',desc:'Acquire a fully-leased, cash-generating campus at a market cap rate. Instant, contracted income and low execution risk, but you pay the developer’s margin away and the return is capped.'}];

  function run(){
    var I=inputs();
    var res=R.map(function(r){ return {r:r, m:routeModel(I,r.k)}; });
    var best=Math.max.apply(null,res.map(function(x){return isFinite(x.m.irr)?x.m.irr:-9;}));
    el('cRoutes').innerHTML=res.map(function(x){ var m=x.m, isB=Math.abs(m.irr-best)<1e-9;
      return '<div class="route'+(isB?' best':'')+'">'+(isB?'<div class="route-flag">Higher IRR</div>':'')+
        '<div class="route-tag">'+x.r.tag+'</div><div class="route-name">'+x.r.name+'</div>'+
        '<p class="route-desc">'+x.r.desc+'</p>'+
        '<div class="route-kpis">'+
          '<div class="kpi big"><div class="k">Equity IRR</div><div class="v">'+pct(m.irr)+'</div></div>'+
          '<div class="kpi big"><div class="k">MOIC</div><div class="v">'+(isFinite(m.moic)?m.moic.toFixed(2)+'×':'—')+'</div></div>'+
          '<div class="kpi"><div class="k">Equity in</div><div class="v">'+fM(m.equityIn)+'</div></div>'+
          '<div class="kpi"><div class="k">'+(x.r.k==='dev'?'Build yield':'Entry EV')+'</div><div class="v">'+(x.r.k==='dev'?pct(m.buildYield):fM(m.entryEV))+'</div></div>'+
        '</div>'+
        '<div class="route-spark-h">Equity cash flow by year</div><div class="rs-chart">'+bar(m.eqCF)+'</div></div>';
    }).join('');
    var dev=res[0].m, capRate=1/I.exit, spread=dev.buildYield-capRate;
    el('cFoot').innerHTML='Stabilised EBITDA <b>'+fM(dev.stab)+'</b> on a <b>'+fM(dev.buildTotal)+'</b> build = a <b>'+pct(dev.buildYield)+
      ' yield-on-cost</b>, against an exit <b>cap rate of '+pct(capRate)+'</b> ('+gv('cExit').toFixed(1)+'×) — a <b>development spread of '+(spread>=0?'+':'')+(spread*100).toFixed(1)+'pts</b>. '+
      'That spread is the developer’s margin: it is why developing out-returns buying stabilised when you can secure power and a pre-let — and it collapses if build cost rises, lease-up stalls or cap rates widen.';
  }

  var IDS=['cMW','cBuildCost','cPrelet','cTargetLet','cLeaseupYrs','cRate','cOpex','cLev','cRd','cExit','cEntryMult','cHold'];
  IDS.forEach(function(id){ var e=el(id); if(e) e.addEventListener('input',run); });
  var DEF={cMW:100,cBuildCost:9,cPrelet:60,cTargetLet:90,cLeaseupYrs:3,cRate:130,cOpex:25,cLev:6,cRd:6,cExit:18,cEntryMult:16,cHold:8};
  var reset=el('cReset'); if(reset) reset.addEventListener('click',function(){ Object.keys(DEF).forEach(function(id){ var e=el(id); if(e) e.value=DEF[id]; }); run(); });
  if(el('cMW')) run();
})();
