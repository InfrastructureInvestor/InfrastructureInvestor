/* "M&A in action, a regulated take-private": a RAB-based returns model for
   acquiring a listed regulated utility. Entry at a premium/discount to RAB; the
   equity earns the allowed return on the RAB (plus outperformance) less interest,
   the RAB and debt grow with capex, a regulatory reset can cut the allowed
   return, and the exit is at a premium/discount to the grown RAB. Illustrative. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function fB(v){ var neg=v<0; v=Math.abs(v); var s = v>=1000?'£'+(v/1000).toFixed(2)+'bn':'£'+v.toFixed(0)+'m'; return neg?'('+s+')':s; }
  function pct(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }
  function irr(cf){ var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi); if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<160;k++){ var m=(lo+hi)/2,fm=f(m); if(flo*fm<=0){hi=m;}else{lo=m;flo=fm;} } return (lo+hi)/2; }

  function model(ov){
    ov=ov||{};
    var RAB0=Math.max(1,gv('rRAB'))*1000;             // £m
    var prem=('prem' in ov?ov.prem:gv('rPremium'))/100;
    var wacc0=gv('rWACC')/100, dep=gv('rDep')/100, perf=gv('rPerf')/100;
    var gearing=Math.max(0,Math.min(0.9,gv('rGearing')/100)), rd=gv('rRd')/100;
    var g=gv('rGrowth')/100, resetD=('reset' in ov?ov.reset:gv('rResetWACC'))/100, resetYr=Math.max(1,Math.round(gv('rResetYr')));
    var exitPrem=gv('rExitPremium')/100, H=Math.max(4,Math.min(20,Math.round(gv('rHold'))));

    var entryEV=RAB0*(1+prem), debt0=gearing*RAB0, equity0=entryEV-debt0;
    var eqCF=[-equity0], RAB=RAB0, debt=debt0, divSum=0;
    for(var t=1;t<=H;t++){
      var wacc=t>=resetYr?wacc0+resetD:wacc0;
      var RABnew=RAB0*Math.pow(1+g,t), dRAB=RABnew-RAB;
      var ret=(wacc+perf)*RABnew;                      // allowed return + outperformance
      var interest=rd*debt, tax=0.20*Math.max(0,ret-interest-dep*RABnew);
      var div=ret-interest-tax-dRAB*(1-gearing);       // equity funds the un-geared share of RAB growth
      RAB=RABnew; debt=gearing*RABnew;                 // re-lever to notional gearing as RAB grows
      divSum+=Math.max(-1e9,div);
      var cf=div; if(t===H){ var exq=RABnew*(1+exitPrem)-debt; cf+=exq; }
      eqCF.push(cf);
    }
    var RABh=RAB0*Math.pow(1+g,H), exitEq=RABh*(1+exitPrem)-gearing*RABh;
    var proceeds=divSum+exitEq;
    return { irr:irr(eqCF), moic: equity0>0?proceeds/equity0:NaN, entryEV:entryEV, equity0:equity0, exitEq:exitEq,
      debt0:debt0, RABh:RABh, allowed:wacc0, eqCF:eqCF, prem:prem };
  }

  function bar(eqCF){ var maxAbs=Math.max.apply(null,eqCF.map(Math.abs).concat([1])), h='<div class="rs-axis"></div>';
    eqCF.forEach(function(v,t){ var bh=Math.max(2,Math.abs(v)/maxAbs*34), cls=v>=0?(t===eqCF.length-1?'pos exit':'pos'):'neg';
      h+='<div class="rs-col"><div class="rs-bar '+cls+'" style="height:'+bh+'px" title="Yr '+t+': '+fB(v)+'"></div></div>'; }); return h; }

  function run(){
    var m=model();
    el('rIRR').textContent=pct(m.irr);
    el('rMOIC').textContent=isFinite(m.moic)?m.moic.toFixed(2)+'×':'—';
    el('rEntryEV').textContent=fB(m.entryEV);
    el('rEntryEq').textContent=fB(m.equity0);
    el('rExitEq').textContent=fB(m.exitEq);
    el('rAllowed').textContent=pct(m.allowed);
    el('rJ').innerHTML=bar(m.eqCF);
    // reset sensitivity: IRR with no reset vs a -50bps reset
    var noReset=model({reset:0}).irr, cut=model({reset:-0.5}).irr;
    var gearPct=Math.round(gv('rGearing'));
    el('rFoot').innerHTML='You pay a <b>'+(m.prem*100).toFixed(0)+'% premium to RAB</b>, '+fB(m.entryEV)+' for a '+fB(m.entryEV/(1+m.prem))+
      ' asset base. The allowed return on the RAB is <b>'+pct(m.allowed)+'</b>; gearing at <b>'+gearPct+'%</b> (with debt cheaper than the allowed return) lifts the equity return, while the <b>premium erodes it</b>, netting to a <b>'+pct(m.irr)+'</b> equity IRR. Pay too high a premium ("bought at a full price") and the equity return falls below the asset return. The <b>regulatory reset</b> is the swing factor: holding the premium, a flat allowed return returns <b>'+pct(noReset)+'</b>, while a 50bps cut at the next review takes it to <b>'+pct(cut)+'</b>.';
  }

  var IDS=['rRAB','rPremium','rWACC','rDep','rPerf','rGearing','rRd','rGrowth','rResetWACC','rResetYr','rExitPremium','rHold'];
  IDS.forEach(function(id){ var e=el(id); if(e) e.addEventListener('input',run); });
  var DEF={rRAB:10,rPremium:10,rWACC:7,rDep:4,rPerf:0.5,rGearing:60,rRd:5,rGrowth:4,rResetWACC:-0.5,rResetYr:5,rExitPremium:8,rHold:10};
  var reset=el('rResetBtn'); if(reset) reset.addEventListener('click',function(){ Object.keys(DEF).forEach(function(id){ var e=el(id); if(e) e.value=DEF[id]; }); run(); });
  if(el('rRAB')) run();
})();
