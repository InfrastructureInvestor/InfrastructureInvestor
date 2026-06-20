/* "M&A in action — buying a distressed altnet": a turnaround / consolidation
   model. Buy a sub-scale, over-levered network cheap on EV/home, fund the
   remaining build, lift penetration and cut opex, and re-rate it on a mature
   EBITDA multiple. Yearly funding waterfall + equity IRR/MOIC + an EV-level
   value bridge (entry price -> re-rating -> turnaround -> exit). Illustrative. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function clamp(x,a,b){ return Math.max(a,Math.min(b,x)); }
  function fM(v){ var neg=v<0; v=Math.abs(v); var s;
    if(v>=1e9)s='£'+(v/1e9).toFixed(2)+'bn'; else if(v>=1e6)s='£'+(v/1e6).toFixed(0)+'m';
    else if(v>=1e3)s='£'+(v/1e3).toFixed(0)+'k'; else s='£'+Math.round(v); return neg?'('+s+')':s; }
  function f0(v){ return Math.round(v).toLocaleString('en-US'); }
  function pct(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }
  function signed(v){ return (v<0?'−':'+')+fM(Math.abs(v)); }
  function irr(cf){ var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi); if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<160;k++){ var m=(lo+hi)/2,fm=f(m); if(flo*fm<=0){hi=m;}else{lo=m;flo=fm;} } return (lo+hi)/2; }

  function model(){
    var homes=Math.max(1,gv('dHomes'))*1000;
    var entryPerHome=gv('dEntryPerHome'), entryPen=clamp(gv('dEntryPen'),1,95)/100;
    var fixCapex=gv('dFixCapex'), targetPen=clamp(gv('dTargetPen'),1,95)/100;
    var arpu=gv('dArpu'), entryOpex=clamp(gv('dEntryOpex'),5,95)/100, targetOpex=clamp(gv('dTargetOpex'),5,95)/100;
    var fixYrs=Math.max(1,Math.round(gv('dFixYrs'))), lev=gv('dLev'), rd=gv('dRd')/100;
    var exit=gv('dExit'), H=Math.max(4,Math.min(15,Math.round(gv('dHold'))));

    var eb0=homes*entryPen*arpu*12*(1-entryOpex);
    var ebStab=homes*targetPen*arpu*12*(1-targetOpex);
    var entryEV=homes*entryPerHome;
    var debtCap=Math.max(0,lev*ebStab);
    var debt0=Math.max(0,Math.min(entryEV*0.55, debtCap));   // distressed: cautious entry leverage
    var equity0=entryEV-debt0;
    var capexTotal=homes*fixCapex;

    var eb=[eb0], eqCF=[-equity0], debtBal=debt0, inject=equity0, distrib=0, peakDebt=debt0;
    for(var t=1;t<=H;t++){
      var ebt = t<=fixYrs ? eb0+(ebStab-eb0)*(t/fixYrs) : ebStab*Math.pow(1.02,t-fixYrs);
      eb[t]=ebt;
      var capex = t<=fixYrs ? capexTotal/fixYrs : 0.04*ebt;
      var interest=rd*debtBal, tax=0.25*Math.max(0,ebt-capexTotal/15);
      var before=ebt-tax-interest-capex, di=0;
      if(before<0){ var gap=-before, room=Math.max(0,debtCap-debtBal), draw=Math.min(gap,room); debtBal+=draw; inject+=gap-draw; di=-(gap-draw); }
      else { var rep=Math.min(before,debtBal); debtBal-=rep; di=before-rep; distrib+=di; }
      peakDebt=Math.max(peakDebt,debtBal);
      var cf=di; if(t===H){ var exq=Math.max(0,exit*ebt)-debtBal; cf+=exq; distrib+=exq; }
      eqCF.push(cf);
    }
    var ebH=eb[H], exitEV=exit*ebH, exitEq=exitEV-debtBal;
    var A=exit*(ebH-eb0);              // turnaround: EBITDA build, at exit mult
    var B=exit*eb0-entryEV;            // re-rating: bought the entry book below its mature value
    return { irr:irr(eqCF), moic: inject>0?distrib/inject:NaN, equityIn:inject, entryEV:entryEV, entryPerHome:entryPerHome,
      exitEV:exitEV, exitEq:exitEq, ebStab:ebStab, eb0:eb0, ebH:ebH, eqCF:eqCF, peakDebt:peakDebt,
      bridge:{start:entryEV, rerate:B, turn:A, end:exitEV}, capexTotal:capexTotal, debt0:debt0 };
  }

  function bar(eqCF){ var maxAbs=Math.max.apply(null,eqCF.map(Math.abs).concat([1])), h='<div class="rs-axis"></div>';
    eqCF.forEach(function(v,t){ var bh=Math.max(2,Math.abs(v)/maxAbs*34), cls=v>=0?(t===eqCF.length-1?'pos exit':'pos'):'neg';
      h+='<div class="rs-col"><div class="rs-bar '+cls+'" style="height:'+bh+'px" title="Yr '+t+': '+fM(v)+'"></div></div>'; }); return h; }

  function renderBridge(b){
    var steps=[{l:'Entry EV',v:b.start,t:'start'},{l:'Re-rating',v:b.rerate,t:'d'},{l:'Turnaround',v:b.turn,t:'d'},{l:'Exit EV',v:b.end,t:'end'}];
    var maxTop=Math.max(b.start,b.end,1),cum=0;
    steps.forEach(function(s){ if(s.t==='start'){s.base=0;s.top=s.v;cum=s.v;} else if(s.t==='end'){s.base=0;s.top=s.v;}
      else { if(s.v>=0){s.base=cum;s.top=cum+s.v;}else{s.base=cum+s.v;s.top=cum;} cum+=s.v; } maxTop=Math.max(maxTop,s.top); });
    var H=170,html='';
    steps.forEach(function(s){ var top=Math.max(0,s.top)/maxTop*H,base=Math.max(0,s.base)/maxTop*H,bh=Math.max(2,top-base);
      var cls=s.t==='start'||s.t==='end'?'start':(s.v>=0?'pos':'neg');
      var lab=s.t==='d'?signed(s.v):fM(s.v);
      html+='<div class="bcol"><div class="bbar '+cls+'" style="height:'+bh+'px;margin-bottom:'+base+'px"><span class="bval">'+lab+'</span><span class="blbl">'+s.l+'</span></div></div>'; });
    el('dBridge').innerHTML=html;
  }

  function run(){
    var m=model();
    el('dIRR').textContent=pct(m.irr);
    el('dMOIC').textContent=isFinite(m.moic)?m.moic.toFixed(2)+'×':'—';
    el('dEqIn').textContent=fM(m.equityIn);
    el('dPerHome').textContent='£'+f0(m.entryPerHome);
    el('dStab').textContent=fM(m.ebStab);
    el('dExitEV').textContent=fM(m.exitEV);
    renderBridge(m.bridge);
    el('dJ').innerHTML=bar(m.eqCF);
    el('dFoot').innerHTML='Bought for <b>'+fM(m.entryEV)+'</b> (<b>£'+f0(m.entryPerHome)+'/home</b>) with the network at a depressed entry EBITDA of '+fM(m.eb0)+
      '. Finishing the build and lifting penetration takes it to <b>'+fM(m.ebStab)+'</b> of stabilised EBITDA; exiting at '+gv('dExit')+'× values it at <b>'+fM(m.exitEV)+
      '</b>. The equity return is <b>'+pct(m.irr)+'</b> IRR / <b>'+(isFinite(m.moic)?m.moic.toFixed(2):'—')+'×</b> — most of it from the <b>re-rating</b> (buying below the mature multiple) plus the <b>turnaround</b> EBITDA you build.';
  }

  var IDS=['dHomes','dEntryPerHome','dEntryPen','dFixCapex','dTargetPen','dArpu','dEntryOpex','dTargetOpex','dFixYrs','dLev','dRd','dExit','dHold'];
  IDS.forEach(function(id){ var e=el(id); if(e) e.addEventListener('input',run); });
  var DEF={dHomes:120,dEntryPerHome:280,dEntryPen:14,dFixCapex:120,dTargetPen:40,dArpu:16,dEntryOpex:62,dTargetOpex:34,dFixYrs:3,dLev:4.5,dRd:8,dExit:13,dHold:7};
  var reset=el('dReset'); if(reset) reset.addEventListener('click',function(){ Object.keys(DEF).forEach(function(id){ var e=el(id); if(e) e.value=DEF[id]; }); run(); });
  if(el('dHomes')) run();
})();
