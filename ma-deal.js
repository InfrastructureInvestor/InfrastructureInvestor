/* Infrastructure M&A — acquisition & returns model.
   Single-asset buyout, built to a deal-team standard: sources & uses, a year-by-year
   cash-flow waterfall that funds maintenance capex, cash tax (with an interest shield,
   straight-line tax depreciation and a loss carry-forward) and growth capex before
   debt service, drives debt paydown and distributions, and produces equity IRR/MOIC
   (nominal and real). Growth is split into inflation indexation and real growth, and
   real growth is paid for with growth capex. Debt is sized by leverage or to a minimum
   DSCR held across the whole tenor, with an optional index-linked tranche whose
   principal accretes with CPI. Exit is on an EV/EBITDA multiple or, for finite
   concessions, on the run-off of the remaining contracted cash flows to handback.
   A value-creation bridge reconciles exactly to proceeds; plus a sensitivity matrix,
   an equity-cash-flow (J-curve) chart, a goal-seek on the bid, and multi-currency
   display. Pulls base-case financials from the reference library (MA_ASSETS).
   Illustrative; not a forecast of any specific asset. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function checked(id){ var e=el(id); return !!(e && e.checked); }
  function clamp(v,lo,hi){ return Math.max(lo,Math.min(hi,v)); }

  /* ---------- currency ---------- */
  // 1 unit of currency = X USD (illustrative ~2026 rates)
  var FX={ 'US$':1,'$':1,'£':1.27,'€':1.08,'A$':0.66,'R$':0.18,'HK$':0.128,'₹':0.012 };
  function fx(from,to){ var a=FX[from]||1, b=FX[to]||1; return a/b; }
  var nativeCur='$', nativeEbitda=200, dispCur='$';
  var CUR='$';
  function money(v){
    var n=Math.round(v), neg=n<0; n=Math.abs(n);
    var s = n>=10000 ? CUR+(n/1000).toFixed(1)+'bn' : CUR+n.toLocaleString('en-US')+'m';
    return neg?'('+s+')':s;
  }
  function signed(v){ return (v<0?'−':'+')+money(Math.abs(v)); }
  function pctTxt(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }

  function irr(cf){
    var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi);
    if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<200;k++){ var mid=(lo+hi)/2,fm=f(mid); if(flo*fm<=0){hi=mid;}else{lo=mid;flo=fm;} }
    return (lo+hi)/2;
  }

  // generic, illustrative core-plus asset
  var GENERIC={ mEntry:12, mLev:6, mGrow:4, mExit:12, mEbitda:200, mHold:7, mFees:2,
    mInfl:2.5, mIdx:70, mFcf:100, mMaint:8, mGcap:5, mTax:25, mLife:30,
    mSweep:40, mRd:6, mDscr:1.8, mTenor:15, mConcEnd:30, mTVr:8,
    cur:'$', ev:null, im:null, cls:null };
  var LOADED=Object.assign({},GENERIC);
  var debtMode='lev', tvMode='mult';

  /* ============ the model (pure: reads params, no DOM writes) ============ */
  function params(ov){
    ov=ov||{};
    function p(id){ return (id in ov)?ov[id]:gv(id); }
    return {
      entryM:p('mEntry'), levX:p('mLev'), gNom:p('mGrow')/100, exitM:p('mExit'),
      eb0:Math.max(0,p('mEbitda')), H:Math.max(1,Math.min(40,Math.round(p('mHold')))),
      feeP:p('mFees')/100, infl:p('mInfl')/100, idx:clamp(p('mIdx')/100,0,1),
      conv:clamp(p('mFcf')/100,0,1.2), maintP:Math.max(0,p('mMaint')/100), gCap:Math.max(0,p('mGcap')),
      tax:clamp(p('mTax')/100,0,0.6), life:Math.max(3,Math.round(p('mLife'))),
      sweep:clamp(p('mSweep')/100,0,1), rd:p('mRd')/100, dscr:Math.max(1,p('mDscr')),
      tenor:Math.max(2,Math.round(p('mTenor'))), concEnd:Math.round(p('mConcEnd')), tvR:Math.max(0.005,p('mTVr')/100),
      ild:checked('mILD'), tvMode:tvMode, tangible:0.9,
      refi:checked('mRefi'), refiYr:Math.round(p('mRefiYr')), refiRd:p('mRefiRd')/100, regear:p('mRegear')
    };
  }
  function annuityFactor(rd,n){ return rd>0 ? (1-Math.pow(1+rd,-n))/rd : n; }

  // size senior debt either by a leverage multiple or to a target year-1 DSCR
  // (project-finance annuity sizing on pre-tax CFADS, capped at 85% of EV)
  function sizeDebt(P){
    var entryEV=P.entryM*P.eb0, cap=entryEV*0.85;
    if(debtMode==='dscr'){
      var af=annuityFactor(P.rd,P.tenor);
      var cfads1=Math.max(0,(P.conv-P.maintP))*P.eb0*(1+P.gNom);
      return clamp(cfads1*af/P.dscr,0,cap);
    }
    return clamp(P.levX*P.eb0,0,cap);
  }

  function simulate(P,debt0){
    var entryEV=P.entryM*P.eb0, fees=P.feeP*entryEV, equity0=entryEV+fees-debt0;
    // split nominal EBITDA growth into inflation indexation and real growth.
    // indexation is NOT capped at nominal growth: if EBITDA grows slower than the
    // indexed share would imply, real growth is genuinely negative (the asset is
    // shrinking in real terms, flattered by indexation) — a key infra insight.
    var gI=Math.max(0,P.idx*P.infl);                // indexation-driven growth p.a.
    var gR=(1+P.gNom)/(1+gI)-1;                      // residual real growth p.a. (can be <0)

    var depBase=entryEV*P.tangible, nol=0, debtBal=debt0;
    var ebitda=[P.eb0],maint=[0],gcap=[0],taxA=[0],interest=[0],paydown=[0],dist=[0],debt=[debt0];
    var sumDist=0, recapTot=0, drawTot=0, minDSCR=Infinity, dscr1=null;

    for(var t=1;t<=P.H;t++){
      var eb=P.eb0*Math.pow(1+P.gNom,t), ebPrev=P.eb0*Math.pow(1+P.gNom,t-1);
      ebitda[t]=eb;
      var mt=P.maintP*eb; maint[t]=mt;
      // growth capex funds the real (volume/efficiency) increment only — indexing prices costs nothing
      var realIncr=gR>0 ? ebPrev*(1+gI)*gR : 0;
      var gc=P.gCap*realIncr; gcap[t]=gc;
      var intr=P.rd*debtBal; interest[t]=intr;
      // cash tax with straight-line tax depreciation, the interest shield and a loss carry-forward
      var dep=depBase/P.life;
      var taxable=eb-dep-intr, tx=0, taxableAfter=taxable-nol;
      if(taxableAfter>0){ tx=P.tax*taxableAfter; nol=0; } else { tx=0; nol=-taxableAfter; }
      taxA[t]=tx;
      var cfads=P.conv*eb - mt - tx;                 // cash available for debt service (pre-interest, pre-growth-capex)
      // index-linked tranche: principal accretes with CPI (non-cash), cash coupon stays the real rate
      if(P.ild) debtBal+=P.infl*debtBal;
      var netCash=cfads - intr - gc, pd=0, di=0;
      if(netCash>=0){ pd=Math.min(P.sweep*netCash,debtBal); di=netCash-pd; debtBal=Math.max(0,debtBal-pd); }
      else { debtBal+=-netCash; drawTot+=-netCash; }  // shortfall drawn on a revolver (raises exit debt)
      // refinancing / dividend recap at the refi year
      if(P.refi && t===P.refiYr && P.regear>0){
        var target=Math.min(P.regear*eb, 0.85*P.exitM*eb);
        if(target>debtBal){ var recap=target-debtBal; di+=recap; debtBal=target; recapTot+=recap; }
      }
      paydown[t]=pd; dist[t]=di; debt[t]=debtBal; sumDist+=di;
      depBase=Math.max(0,depBase+gc-dep);
      var ds=intr+pd, dscr_t=ds>0?cfads/ds:Infinity;
      if(t===1) dscr1=dscr_t;
      if(isFinite(dscr_t)) minDSCR=Math.min(minDSCR,dscr_t);
    }
    var ebH=ebitda[P.H], debtH=debtBal;

    // terminal value: exit multiple, or the run-off of remaining contracted cash flows to handback
    var exitEV;
    if(P.tvMode==='conc'){
      var pv=0, yrs=Math.max(0,P.concEnd-P.H);
      for(var k=1;k<=yrs;k++){
        var EB=ebH*Math.pow(1+P.gNom,k);
        var ocfT=Math.max(0,(P.conv-P.maintP))*EB*(1-P.tax);
        pv+=ocfT/Math.pow(1+P.tvR,k);
      }
      exitEV=pv;
    } else { exitEV=P.exitM*ebH; }
    var exitEq=exitEV-debtH;

    var cf=[-equity0];
    for(var t2=1;t2<=P.H;t2++){ cf.push(dist[t2]+(t2===P.H?exitEq:0)); }
    var eqIRR=irr(cf);
    var totalProceeds=sumDist+exitEq, moic=equity0>0?totalProceeds/equity0:NaN;
    var realIRR=isFinite(eqIRR)?(1+eqIRR)/(1+P.infl)-1:NaN;
    var cum=-equity0, payback=null;
    for(var t3=1;t3<=P.H;t3++){ cum+=cf[t3]; if(payback===null && cum>=0) payback=t3; }

    // value-creation bridge — re-rating generalised to (exitEV − entry-multiple × exit EBITDA)
    // so it reconciles exactly for any terminal-value method
    var idxUplift=P.eb0*(Math.pow(1+gI,P.H)-1), realUplift=ebH-P.eb0*Math.pow(1+gI,P.H);
    return {
      entryM:P.entryM,exitM:P.exitM,entryEV:entryEV,exitEV:exitEV,debt0:debt0,debtH:debtH,fees:fees,
      equity0:equity0,exitEq:exitEq,sumDist:sumDist,totalProceeds:totalProceeds,
      dscr1:dscr1,minDSCR:isFinite(minDSCR)?minDSCR:null,recap:recapTot,draw:drawTot,
      eqIRR:eqIRR,realIRR:realIRR,moic:moic,H:P.H,eb0:P.eb0,ebH:ebH,cf:cf,payback:payback,gI:gI,gR:gR,
      tvMode:P.tvMode,ebitda:ebitda,maint:maint,gcap:gcap,tax:taxA,debt:debt,interest:interest,paydown:paydown,dist:dist,
      bridge:{ start:equity0, idx:P.entryM*idxUplift, real:P.entryM*realUplift,
               reRating:exitEV-P.entryM*ebH, deleveraging:debt0-debtH, distrib:sumDist, fees:-fees, end:totalProceeds }
    };
  }
  function model(P){ return simulate(P, sizeDebt(P)); }

  /* ============ render ============ */
  var CLASS_RANGE={ 'Energy & Utilities':[10,14],'Transport':[10,18],'Digital Infrastructure':[12,22],
    'Social Infrastructure':[11,14],'Energy Transition':[8,12],'Environmental & Waste':[7,10] };

  function render(m){
    el('oIRR').textContent=pctTxt(m.eqIRR);
    el('oMOIC').textContent=isFinite(m.moic)?m.moic.toFixed(2)+'×':'—';
    el('oEqIn').textContent=money(m.equity0);
    el('oGearing').textContent=m.entryEV>0?Math.round(m.debt0/m.entryEV*100)+'%':'—';
    var sub=el('oIRRsub'); if(sub) sub.innerHTML=(isFinite(m.realIRR)?'<b>'+pctTxt(m.realIRR)+'</b> real · ':'')+'gross of fund fees';

    var dscrTxt=m.minDSCR!=null?m.minDSCR.toFixed(2)+'×':'n/a';
    el('suUse').innerHTML=
      '<div class="ln"><span>Purchase enterprise value</span><b>'+money(m.entryEV)+'</b></div>'+
      '<div class="ln"><span>Transaction costs</span><b>'+money(m.fees)+'</b></div>'+
      '<div class="ln tot"><span>Total uses</span><b>'+money(m.entryEV+m.fees)+'</b></div>';
    el('suSrc').innerHTML=
      '<div class="ln"><span>New acquisition debt</span><b>'+money(m.debt0)+'</b></div>'+
      '<div class="ln"><span>Equity from the fund</span><b>'+money(m.equity0)+'</b></div>'+
      '<div class="ln"><span>Min DSCR over hold</span><b>'+dscrTxt+'</b></div>'+
      '<div class="ln tot"><span>Total sources</span><b>'+money(m.debt0+m.equity0)+'</b></div>';

    // valuation benchmark vs the reference model + asset-class range
    var cmp=el('maComps');
    if(cmp){
      var s='<b>Your bid:</b> '+gv('mEntry').toFixed(1)+'× ('+money(m.entryEV)+' EV)';
      if(LOADED.ev!=null && LOADED.im!=null){
        var refEV=LOADED.ev*fx(LOADED.cur,dispCur);
        s+=' &nbsp;·&nbsp; <b>Reference model:</b> ~'+LOADED.im.toFixed(1)+'× ('+money(refEV)+')';
      }
      if(LOADED.cls && CLASS_RANGE[LOADED.cls]){ var r=CLASS_RANGE[LOADED.cls];
        s+=' &nbsp;·&nbsp; <span class="mut">typical '+LOADED.cls+': '+r[0]+'–'+r[1]+'×</span>'; }
      cmp.innerHTML=s;
    }

    var bh=el('maBridgeH'); if(bh) bh.textContent='Equity value-creation bridge ('+CUR+'m)';
    renderBridge(m.bridge);
    var b=m.bridge;
    el('bridgeFoot').innerHTML='Over a <b>'+m.H+'-year</b> hold, a <b>'+money(b.start)+'</b> equity cheque returns <b>'+
      money(b.end)+'</b> — a <b>'+(isFinite(m.moic)?m.moic.toFixed(2):'—')+'×</b> multiple and <b>'+pctTxt(m.eqIRR)+
      '</b> IRR ('+(isFinite(m.realIRR)?pctTxt(m.realIRR)+' real':'—')+'). EBITDA growth adds '+money(b.idx+b.real)+
      ' — of which <b>'+money(b.idx)+'</b> is inflation indexation and <b>'+money(b.real)+'</b> real growth; '+
      (m.tvMode==='conc'?'concession run-off ':'multiple re-rating ')+(b.reRating>=0?'adds ':'subtracts ')+money(Math.abs(b.reRating))+
      ', debt paydown '+money(b.deleveraging)+' and cash distributions '+money(b.distrib)+
      (m.recap>0?' (incl. a '+money(m.recap)+' refinancing recap)':'')+'; transaction costs cost '+money(Math.abs(b.fees))+'.'+
      (m.gR<0?' <b>Note:</b> real growth is negative — EBITDA is not keeping pace with inflation, so value here is just indexation.':'');

    renderJ(m);

    el('gridH').textContent='Projection · key lines by year ('+CUR+'m)';
    var N=m.H, head='<tr><th class="rl">Line · '+CUR+'m</th><th>Entry</th>';
    for(var t=1;t<=N;t++) head+='<th>Yr '+t+'</th>';
    head+='</tr>';
    function row(lab,arr,entry){ var tr='<tr><td class="rl">'+lab+'</td><td>'+(entry==null?'—':money(entry))+'</td>';
      for(var t=1;t<=N;t++){ tr+='<td>'+(arr[t]==null?'—':money(arr[t]))+'</td>'; } return tr+'</tr>'; }
    var g=head;
    g+=row('EBITDA',m.ebitda,m.eb0);
    g+=row('− Maintenance capex',m.maint,null);
    g+=row('− Cash tax',m.tax,null);
    g+=row('− Growth capex',m.gcap,null);
    g+=row('− Cash interest',m.interest,null);
    g+=row('Debt repaid',m.paydown,null);
    g+=row('Distributions to equity',m.dist,null);
    g+=row('Net debt (year-end)',m.debt,m.debt0);
    el('maGrid').innerHTML=g;

    renderSens();
  }

  function renderBridge(b){
    var steps=[
      {lab:'Equity cheque',val:b.start,type:'start'},
      {lab:'Indexation',val:b.idx,type:'delta',cls2:'idx'},
      {lab:'Real growth',val:b.real,type:'delta'},
      {lab:'Re-rating',val:b.reRating,type:'delta'},
      {lab:'Debt paydown',val:b.deleveraging,type:'delta'},
      {lab:'Distributions',val:b.distrib,type:'delta'},
      {lab:'Costs',val:b.fees,type:'delta'},
      {lab:'Total proceeds',val:b.end,type:'end'}
    ];
    var maxTop=Math.max(b.start,b.end,1), cum=0;
    steps.forEach(function(s){
      if(s.type==='start'){ s.base=0; s.top=s.val; cum=s.val; }
      else if(s.type==='end'){ s.base=0; s.top=s.val; }
      else { if(s.val>=0){ s.base=cum; s.top=cum+s.val; } else { s.base=cum+s.val; s.top=cum; } cum+=s.val; }
      maxTop=Math.max(maxTop,s.top);
    });
    var H=176, html='';
    steps.forEach(function(s){
      var top=Math.max(0,s.top)/maxTop*H, base=Math.max(0,s.base)/maxTop*H, barH=Math.max(2,top-base);
      var cls=s.type==='start'?'start':(s.type==='end'?'end':(s.val>=0?(s.cls2||'pos'):'neg'));
      var label=(s.type==='delta')?signed(s.val):money(s.val);
      html+='<div class="bcol"><div class="bbar '+cls+'" style="height:'+barH+'px;margin-bottom:'+base+'px">'+
        '<span class="bval">'+label+'</span><span class="blbl">'+s.lab+'</span></div></div>';
    });
    el('maBridge').innerHTML=html;
  }

  /* equity cash-flow J-curve */
  function renderJ(m){
    var box=el('maJ'); if(!box) return;
    var cf=m.cf, N=m.H;
    var maxAbs=Math.max.apply(null,cf.map(Math.abs).concat([1]));
    var Hpx=120;
    var html='<div class="jaxis"></div>';
    for(var t=0;t<=N;t++){
      var v=cf[t], h=Math.max(2,Math.abs(v)/maxAbs*Hpx);
      var cls=v>=0?(t===N?'pos exit':'pos'):'neg';
      var lbl=(t===0||t===N||t%(N>12?3:2)===0)?('Yr '+t):'';
      html+='<div class="jcol"><div class="jwrapbar">'+
        '<div class="jbar '+cls+'" style="height:'+h+'px" title="Year '+t+': '+money(v)+'"></div></div>'+
        '<span class="jlbl">'+lbl+'</span></div>';
    }
    el('maJ').innerHTML=html;
    var pf=el('jFoot');
    if(pf) pf.innerHTML = m.payback ? 'Cumulative equity cash flow turns positive in <b>year '+m.payback+'</b> — the bottom of the J-curve. '+(m.recap>0?'The spike is the refinancing recap.':'')
      : 'Cumulative equity cash flow stays negative until exit — all the return is realised on sale.';
  }

  /* ============ sensitivity matrix ============ */
  function axisVals(idv, center){
    if(idv==='mGrow') return [center-3,center-1.5,center,center+1.5,center+3];
    if(idv==='mLev'){ var a=[]; for(var i=-2;i<=2;i++) a.push(Math.max(0,center+i)); return a; }
    return [center-2,center-1,center,center+1,center+2].map(function(v){ return Math.max(4,v); });
  }
  function axisLabel(idv,v){ return idv==='mGrow' ? v.toFixed(1)+'%' : v.toFixed(1)+'×'; }
  function axisName(idv){ return idv==='mGrow'?'EBITDA growth':(idv==='mLev'?'Leverage':(idv==='mEntry'?'Entry ×':'Exit ×')); }
  function renderSens(){
    var rowV=el('sensRow').value, colV=el('sensCol').value;
    var rc=gv(rowV), cc=gv(colV);
    var rows=axisVals(rowV,rc), cols=axisVals(colV,cc);
    var h='<tr><td class="corner">'+axisName(rowV)+' ↓ &nbsp; '+axisName(colV)+' →</td>';
    cols.forEach(function(c){ h+='<th>'+axisLabel(colV,c)+'</th>'; });
    h+='</tr>';
    rows.forEach(function(r){
      h+='<tr><td class="rh">'+axisLabel(rowV,r)+'</td>';
      cols.forEach(function(c){
        var ov={}; ov[rowV]=r; ov[colV]=c;
        var m=model(params(ov));
        var isBase=(Math.abs(r-rc)<1e-9 && Math.abs(c-cc)<1e-9);
        h+='<td class="cell'+(isBase?' base':'')+'">'+pctTxt(m.eqIRR)+'</td>';
      });
      h+='</tr>';
    });
    el('maSens').innerHTML=h;
  }

  /* ============ goal-seek: max entry multiple for a target IRR ============ */
  function goalSeek(){
    var target=gv('mTargetIRR')/100, out=el('gsOut');
    if(!isFinite(target)){ if(out) out.textContent='—'; return; }
    function irrAt(e){ return model(params({mEntry:e})).eqIRR; }
    var lo=4, hi=40;
    var fLo=irrAt(lo)-target, fHi=irrAt(hi)-target;   // IRR decreases as entry rises
    if(!isFinite(fLo) || fLo<0){ if(out) out.innerHTML='Even at <b>'+lo+'×</b> the return is below '+(target*100).toFixed(0)+'% — target not achievable here.'; return; }
    if(isFinite(fHi) && fHi>0){ if(out) out.innerHTML='Clears '+(target*100).toFixed(0)+'% even at <b>'+hi+'×</b> — you can pay up.'; var sol0=hi; applyEntry(sol0,target); return; }
    for(var k=0;k<80;k++){ var mid=(lo+hi)/2, fm=irrAt(mid)-target; if(fLo*fm<=0){ hi=mid; } else { lo=mid; fLo=fm; } }
    var sol=(lo+hi)/2;
    applyEntry(Math.round(sol*2)/2, target);
  }
  function applyEntry(e, target){
    var m=model(params({mEntry:e}));
    var out=el('gsOut');
    if(out) out.innerHTML='Max bid for <b>'+(target*100).toFixed(0)+'%</b> IRR ≈ <b>'+e.toFixed(1)+'×</b> ('+money(m.entryEV)+' EV). Applied to the model.';
    el('mEntry').value=e; clearScenarioHighlight(); run();
  }

  /* ============ controls ============ */
  function syncLabels(){
    el('mEntryV').textContent=gv('mEntry').toFixed(1)+'×';
    el('mLevV').textContent=gv('mLev').toFixed(2)+'×';
    el('mGrowV').textContent=gv('mGrow').toFixed(1)+'%';
    el('mExitV').textContent=gv('mExit').toFixed(1)+'×';
  }
  function run(){ syncLabels(); render(model(params())); }

  function setDebtMode(mode){
    debtMode=mode;
    el('mDebtMode').querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', b.dataset.mode===mode); });
    var dscrM=(mode==='dscr');
    el('mDscr').disabled=!dscrM; el('mTenor').disabled=!dscrM; el('mLev').disabled=dscrM;
    if(dscrM){ var m=model(params()); el('mLev').value=(m.debt0/Math.max(1,gv('mEbitda'))).toFixed(2); }
    run();
  }

  function setTvMode(mode){
    tvMode=mode;
    var grp=el('mTvMode'); if(grp) grp.querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', b.dataset.tv===mode); });
    var conc=(mode==='conc');
    if(el('mConcEnd')) el('mConcEnd').disabled=!conc;
    if(el('mTVr')) el('mTVr').disabled=!conc;
    var ex=el('mExit'); if(ex) ex.disabled=conc;
    run();
  }

  // write all inputs from a base (native EBITDA converted into the display currency)
  function applyInputs(base){
    Object.keys(GENERIC).forEach(function(id){
      if(['cur','ev','im','cls'].indexOf(id)>=0) return;
      var e=el(id);
      if(!e || base[id]==null) return;
      if(id==='mEbitda') e.value=Math.round(base.mEbitda*fx(base.cur||'$',dispCur)*100)/100;
      else e.value=base[id];
    });
    CUR=dispCur; el('uEbitda').textContent=CUR+'m';
    if(debtMode==='dscr'){ var m=model(params()); el('mLev').value=(m.debt0/Math.max(1,gv('mEbitda'))).toFixed(2); }
    run();
  }

  function setScenario(s){
    var b=LOADED, over={};
    if(s==='down'){ over.mGrow=b.mGrow-2; over.mExit=Math.max(4,b.mExit-1.5); over.mMaint=b.mMaint+3; over.mFcf=Math.max(80,b.mFcf-5); }
    else if(s==='up'){ over.mGrow=b.mGrow+2; over.mExit=b.mExit+1.5; over.mMaint=Math.max(0,b.mMaint-3); over.mFcf=Math.min(105,b.mFcf+2); }
    applyInputs(Object.assign({},b,over));
    el('scenNote').textContent = s==='base'
      ? 'growth, exit, maintenance capex and cash conversion flexed around the loaded case.'
      : (s==='down' ? 'downside: slower growth, a lower exit, heavier maintenance capex and weaker cash conversion.'
                    : 'upside: faster growth, a higher exit, lighter maintenance capex and stronger cash conversion.');
    document.querySelectorAll('.scen button').forEach(function(btn){ btn.classList.toggle('on', btn.dataset.scen===s); });
  }
  function clearScenarioHighlight(){ document.querySelectorAll('.scen button').forEach(function(b){ b.classList.remove('on'); }); }

  /* ============ asset picker (pull from MA_ASSETS) ============ */
  var DB=(typeof window!=='undefined' && window.MA_ASSETS) ? window.MA_ASSETS : null;
  // illustrative operating assumptions by asset class
  var MAINT_BY_CLASS={ 'Energy & Utilities':12,'Transport':8,'Digital Infrastructure':10,'Social Infrastructure':4,'Energy Transition':6,'Environmental & Waste':9 };
  var GCAP_BY_CLASS ={ 'Energy & Utilities':6,'Transport':7,'Digital Infrastructure':6,'Social Infrastructure':5,'Energy Transition':5,'Environmental & Waste':5 };
  var IDX_BY_CLASS  ={ 'Energy & Utilities':85,'Transport':70,'Digital Infrastructure':50,'Social Infrastructure':90,'Energy Transition':60,'Environmental & Waste':55 };
  var LIFE_BY_CLASS ={ 'Energy & Utilities':40,'Transport':30,'Digital Infrastructure':15,'Social Infrastructure':30,'Energy Transition':20,'Environmental & Waste':20 };
  var ACQ_HOLD=12;

  function loadAsset(secIdx, astIdx){
    if(secIdx<0 || !DB){
      LOADED=Object.assign({},GENERIC); nativeCur='$'; nativeEbitda=GENERIC.mEbitda; dispCur='$';
      setCurSelect('native'); setTvMode('mult'); if(el('mILD')) el('mILD').checked=false;
      applyInputs(LOADED); setScenario('base');
      el('maLoaded').innerHTML='Generic, illustrative asset. Pick a sub-sector above to pull a real worked asset’s financials into the model.';
      return;
    }
    var sec=DB.sectors[secIdx], a=sec.assets[astIdx]; if(!a) return;
    var hold=Math.min(a.hold||ACQ_HOLD, ACQ_HOLD);
    // default entry = the reference model's implied multiple; exit flat at the same
    // multiple (the neutral, no-re-rating assumption) — the user flexes the exit.
    var entry=a.entry||a.exit, exitM=entry;
    var lev=Math.min(a.lev, 0.7*entry);
    var im=(a.ev&&a.ebitda>0)?a.ev/a.ebitda:null;
    LOADED={ mEntry:entry, mExit:exitM, mLev:lev, mGrow:a.growth, mEbitda:a.ebitda,
      mHold:hold, mRd:a.rd, mFees:2, mInfl:2.5, mIdx:IDX_BY_CLASS[sec.cls]||60, mFcf:100,
      mMaint:MAINT_BY_CLASS[sec.cls]||8, mGcap:GCAP_BY_CLASS[sec.cls]||5, mTax:25, mLife:LIFE_BY_CLASS[sec.cls]||30,
      mSweep:40, mDscr:1.8, mTenor:Math.max(5,Math.min(15,Math.round(hold*0.9))),
      mConcEnd:Math.max(hold+5, Math.round(a.hold||30)), mTVr:8, cur:a.cur,
      ev:a.ev||null, im:im, cls:sec.cls };
    nativeCur=a.cur; nativeEbitda=a.ebitda; dispCur=a.cur;
    setCurSelect('native'); setTvMode('mult'); if(el('mILD')) el('mILD').checked=false;
    applyInputs(LOADED); setScenario('base');
    var refLine = (a.ev!=null && im!=null)
      ? ' The reference model implies an entry EV of <b>'+a.cur+Math.round(a.ev).toLocaleString()+'m</b> (~<b>'+im.toFixed(1)+'×</b> EBITDA); the default bid is set to that.'
      : '';
    el('maLoaded').innerHTML=
      'Loaded <b>'+a.name+'</b>'+(a.geo?' ('+a.geo+')':'')+' from <a href="'+sec.url+'">'+sec.name+'</a> — '+
      '<b>'+a.cur+a.ebitda+'m</b> EBITDA.'+refLine+
      ' <span class="ref"><span>As modelled on the reference page: unlevered IRR <b>'+a.uirr+'</b>, levered <b>'+a.lirr+'</b>, MOIC <b>'+a.moic+'</b>.</span></span>'+
      ' Figures are illustrative and in the asset’s native currency.';
  }

  function setCurSelect(v){ var s=el('maCur'); if(s) s.value=v; }
  function curSymForSelect(){ var s=el('maCur'); var v=s?s.value:'native'; return v==='native'?nativeCur:v; }
  function onCurChange(){
    // convert the current native EBITDA into the chosen display currency
    var newDisp=curSymForSelect();
    dispCur=newDisp; CUR=dispCur;
    el('mEbitda').value=Math.round(nativeEbitda*fx(nativeCur,dispCur)*100)/100;
    el('uEbitda').textContent=CUR+'m';
    run();
  }

  function buildPicker(){
    var secSel=el('maSector'), astSel=el('maAssetPick');
    if(!secSel) return;
    if(!DB){ secSel.style.display='none'; if(astSel) astSel.style.display='none'; return; }
    var h='<option value="custom">Custom (illustrative)</option>';
    DB.classOrder.forEach(function(cls){
      var inClass=DB.sectors.map(function(s,i){ return {s:s,i:i}; }).filter(function(x){ return x.s.cls===cls; });
      if(!inClass.length) return;
      h+='<optgroup label="'+cls+'">';
      inClass.forEach(function(x){ h+='<option value="'+x.i+'">'+x.s.name+'</option>'; });
      h+='</optgroup>';
    });
    secSel.innerHTML=h;
    function fillAssets(secIdx){
      if(secIdx<0){ astSel.innerHTML='<option>—</option>'; astSel.disabled=true; return; }
      astSel.disabled=false;
      astSel.innerHTML=DB.sectors[secIdx].assets.map(function(a,i){
        return '<option value="'+i+'">'+a.name+(a.geo?' · '+a.geo:'')+'</option>'; }).join('');
    }
    secSel.addEventListener('change',function(){
      if(secSel.value==='custom'){ fillAssets(-1); loadAsset(-1); }
      else { var si=+secSel.value; fillAssets(si); loadAsset(si,0); }
    });
    astSel.addEventListener('change',function(){ if(secSel.value!=='custom') loadAsset(+secSel.value, +astSel.value); });
    fillAssets(-1);
  }

  /* ============ wiring ============ */
  ['mEntry','mLev','mGrow','mExit','mHold','mFees','mInfl','mIdx','mFcf','mMaint','mGcap','mTax','mLife',
   'mSweep','mRd','mDscr','mTenor','mConcEnd','mTVr','mRefiYr','mRefiRd','mRegear'].forEach(function(id){
    var e=el(id); if(e) e.addEventListener('input',function(){ clearScenarioHighlight(); run(); });
  });
  // EBITDA edits update the stored native value (so currency switches stay correct)
  (function(){ var e=el('mEbitda'); if(e) e.addEventListener('input',function(){
    nativeEbitda=gv('mEbitda')*fx(dispCur,nativeCur); clearScenarioHighlight(); run(); }); })();
  var refi=el('mRefi'); if(refi) refi.addEventListener('change',function(){ clearScenarioHighlight(); run(); });
  var ild=el('mILD'); if(ild) ild.addEventListener('change',function(){ clearScenarioHighlight(); run(); });
  var cur=el('maCur'); if(cur) cur.addEventListener('change',onCurChange);
  ['sensRow','sensCol'].forEach(function(id){ var e=el(id); if(e) e.addEventListener('change',renderSens); });
  var dm=el('mDebtMode'); if(dm) dm.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){ setDebtMode(b.dataset.mode); }); });
  var tm=el('mTvMode'); if(tm) tm.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){ setTvMode(b.dataset.tv); }); });
  document.querySelectorAll('.scen button').forEach(function(b){ b.addEventListener('click',function(){ setScenario(b.dataset.scen); }); });
  var gs=el('gsBtn'); if(gs) gs.addEventListener('click',goalSeek);
  var ti=el('mTargetIRR'); if(ti) ti.addEventListener('keydown',function(e){ if(e.key==='Enter') goalSeek(); });
  var reset=el('maReset'); if(reset) reset.addEventListener('click',function(){ setTvMode('mult'); if(el('mILD')) el('mILD').checked=false; setScenario('base'); });

  if(el('mEntry')){
    buildPicker();
    // hand-off from the fibre comparator (or any tool): ?eb=&entry=&exit=&lev=&hold=&cur=
    var q=(typeof URLSearchParams!=='undefined') ? new URLSearchParams(location.search) : null;
    if(q && q.get('eb')){
      var cur=q.get('cur')||'$';
      nativeCur=cur; nativeEbitda=parseFloat(q.get('eb'))||200; dispCur=cur;
      LOADED={ mEntry:parseFloat(q.get('entry'))||12, mExit:parseFloat(q.get('exit'))||12,
        mLev:parseFloat(q.get('lev'))||6, mGrow:4, mEbitda:nativeEbitda, mHold:Math.round(parseFloat(q.get('hold'))||10),
        mRd:6, mFees:2, mInfl:2.5, mIdx:50, mFcf:100, mMaint:10, mGcap:6, mTax:25, mLife:15,
        mSweep:40, mDscr:1.8, mTenor:12, mConcEnd:25, mTVr:8, cur:cur, ev:null, im:null, cls:'Digital Infrastructure' };
      setCurSelect('native'); setTvMode('mult'); if(el('mILD')) el('mILD').checked=false;
      applyInputs(LOADED); setScenario('base');
      el('maLoaded').innerHTML='Loaded from the <a href="ma-in-action-fibre.html">fibre market-entry comparator</a> — the <b>buy case</b>: '+
        cur+nativeEbitda+'m EBITDA at '+LOADED.mEntry+'×, '+LOADED.mLev+'× leverage, '+LOADED.mHold+'-year hold. Adjust freely, or pick another asset above.';
    } else { loadAsset(-1); }
  }

  /* ====================== on-page deals table (from MA_DEALS) ====================== */
  var DEALS=(typeof window!=='undefined' && window.MA_DEALS) ? window.MA_DEALS : [];
  var CLS={ 'Energy & Utilities':'#0c6b4f','Transport':'#b07d24','Digital Infrastructure':'#2f5fb0',
    'Social Infrastructure':'#bc4733','Energy Transition':'#37934f','Environmental & Waste':'#6a6b3a','Platform / GP':'#6b5b95' };
  var COLS=[ {k:'t',label:'Target'},{k:'cls',label:'Sector'},{k:'y',label:'Year',r:true},{k:'val',label:'Deal value',r:true},{k:'why',label:'Why it matters'} ];

  var dHead=el('dealHead'), dBody=el('dealBody'), dFilters=el('dealFilters');
  if(dHead && dBody && DEALS.length){
    var filter='All', sortK='y', sortDir=-1;
    COLS.forEach(function(c){
      var th=document.createElement('th'); if(c.r) th.className='r';
      th.innerHTML=c.label+'<span class="arr"></span>'; th.dataset.k=c.k;
      th.addEventListener('click',function(){ if(sortK===c.k) sortDir=-sortDir; else { sortK=c.k; sortDir=(c.k==='y')?-1:1; } paint(); });
      dHead.appendChild(th);
    });
    ['All'].concat(Object.keys(CLS)).forEach(function(f){
      var b=document.createElement('button'); b.className='chip-f'+(f==='All'?' on':''); b.textContent=f;
      b.addEventListener('click',function(){ filter=f; dFilters.querySelectorAll('.chip-f').forEach(function(x){ x.classList.toggle('on',x===b); }); paint(); });
      dFilters.appendChild(b);
    });
    function sortVal(d){ if(sortK==='y') return d.y; if(sortK==='val') return d.usd||0; return String(d[sortK]).toLowerCase(); }
    function paint(){
      var rows=DEALS.filter(function(d){ return filter==='All'||d.cls===filter; });
      rows.sort(function(a,b){ var va=sortVal(a),vb=sortVal(b); if(va<vb) return -sortDir; if(va>vb) return sortDir; return 0; });
      dHead.querySelectorAll('th').forEach(function(th){ var on=th.dataset.k===sortK; th.classList.toggle('sort',on); th.querySelector('.arr').textContent=on?(sortDir<0?'▾':'▴'):''; });
      dBody.innerHTML=rows.map(function(d){
        var tgt=d.url ? '<a href="'+d.url+'" style="color:inherit;text-decoration:none;border-bottom:1px dotted var(--border-strong)">'+d.t+'</a>' : d.t;
        return '<tr>'+
          '<td class="tgt">'+tgt+'<div class="acq">'+d.a+'</div></td>'+
          '<td><span class="cls-tag"><span class="cls-dot" style="background:'+(CLS[d.cls]||'#889390')+'"></span>'+d.cls+'</span></td>'+
          '<td class="r">'+d.y+'</td>'+
          '<td class="r">'+d.val+'</td>'+
          '<td><div class="why">'+d.why+'</div></td>'+
        '</tr>';
      }).join('');
    }
    paint();
  }
})();
