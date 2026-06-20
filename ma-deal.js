/* Infrastructure M&A — acquisition & returns model.
   Single-asset buyout: sources & uses, a year-by-year cash-flow waterfall driving
   debt paydown and distributions, equity IRR/MOIC, a value-creation bridge that
   reconciles exactly to proceeds, a sensitivity matrix, DSCR debt-sizing, an
   optional refinancing/recap, an equity-cash-flow (J-curve) chart, a goal-seek on
   the bid, multi-currency display, and a comparison to the reference model's
   implied entry EV. Pulls base-case financials from the reference library
   (MA_ASSETS). Illustrative; not a forecast of any specific asset. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function checked(id){ var e=el(id); return !!(e && e.checked); }

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

  var GENERIC={ mEntry:12, mLev:6, mGrow:4, mExit:12, mEbitda:200, mHold:7, mFees:2, mFcf:55, mSweep:40, mRd:6, mDscr:1.8, mTenor:15, cur:'$', ev:null, im:null, cls:null };
  var LOADED=Object.assign({},GENERIC);
  var debtMode='lev';

  /* ============ the model (pure: reads params, no DOM writes) ============ */
  function params(ov){
    ov=ov||{};
    function p(id){ return (id in ov)?ov[id]:gv(id); }
    return {
      entryM:p('mEntry'), levX:p('mLev'), g:p('mGrow')/100, exitM:p('mExit'),
      eb0:Math.max(0,p('mEbitda')), H:Math.max(1,Math.min(40,Math.round(p('mHold')))),
      feeP:p('mFees')/100, fcfP:p('mFcf')/100, sweep:Math.max(0,Math.min(1,p('mSweep')/100)),
      rd:p('mRd')/100, dscr:Math.max(1,p('mDscr')), tenor:Math.max(2,Math.round(p('mTenor'))),
      refi:checked('mRefi'), refiYr:Math.round(p('mRefiYr')), refiRd:p('mRefiRd')/100, regear:p('mRegear')
    };
  }
  function annuityFactor(rd,n){ return rd>0 ? (1-Math.pow(1+rd,-n))/rd : n; }

  function model(P){
    var entryEV=P.entryM*P.eb0;
    var af=annuityFactor(P.rd,P.tenor);
    var cfads1=P.fcfP*P.eb0*(1+P.g);
    var debt0 = debtMode==='dscr' ? Math.min(cfads1*af/P.dscr, entryEV*0.85) : Math.min(P.levX*P.eb0, entryEV*0.85);
    debt0=Math.max(0,debt0);
    var fees=P.feeP*entryEV;
    var equity0=entryEV+fees-debt0;
    var dscr1=debt0>0 ? cfads1*af/debt0 : Infinity;

    var ebitda=[P.eb0], debt=[debt0], interest=[0], opcf=[0], paydown=[0], dist=[0], recapTot=0;
    var debtBal=debt0, sumDist=0;
    for(var t=1;t<=P.H;t++){
      var eb=P.eb0*Math.pow(1+P.g,t); ebitda[t]=eb;
      var rate=(P.refi && t>P.refiYr) ? P.refiRd : P.rd;
      var intr=rate*debtBal; interest[t]=intr;
      var ocf=P.fcfP*eb; opcf[t]=ocf;
      var surplus=ocf-intr, pd=0, di=0;
      if(surplus>0){ pd=Math.min(P.sweep*surplus, debtBal); di=surplus-pd; }
      debtBal=Math.max(0,debtBal-pd);
      // refinancing / dividend recap at the refi year
      if(P.refi && t===P.refiYr && P.regear>0){
        var target=Math.min(P.regear*eb, 0.85*P.exitM*eb);
        if(target>debtBal){ var recap=target-debtBal; di+=recap; debtBal=target; recapTot+=recap; }
      }
      paydown[t]=pd; dist[t]=di; debt[t]=debtBal; sumDist+=di;
    }
    var ebH=ebitda[P.H], debtH=debtBal;
    var exitEV=P.exitM*ebH, exitEq=exitEV-debtH;
    var cf=[-equity0];
    for(var t2=1;t2<=P.H;t2++){ cf.push(dist[t2]+(t2===P.H?exitEq:0)); }
    var eqIRR=irr(cf);
    var totalProceeds=sumDist+exitEq, moic=equity0>0?totalProceeds/equity0:NaN;
    // payback (year cumulative equity CF first turns >= 0)
    var cum=-equity0, payback=null;
    for(var t3=1;t3<=P.H;t3++){ cum+=cf[t3]; if(payback===null && cum>=0) payback=t3; }

    return {
      entryM:P.entryM,exitM:P.exitM,entryEV:entryEV,exitEV:exitEV,debt0:debt0,debtH:debtH,fees:fees,
      equity0:equity0,exitEq:exitEq,sumDist:sumDist,totalProceeds:totalProceeds,dscr1:dscr1,recap:recapTot,
      eqIRR:eqIRR,moic:moic,H:P.H,eb0:P.eb0,ebH:ebH,cf:cf,payback:payback,
      ebitda:ebitda,debt:debt,interest:interest,opcf:opcf,paydown:paydown,dist:dist,
      bridge:{start:equity0,growth:P.entryM*(ebH-P.eb0),multiple:ebH*(P.exitM-P.entryM),
              deleveraging:debt0-debtH,distrib:sumDist,fees:-fees,end:totalProceeds}
    };
  }

  /* ============ render ============ */
  var CLASS_RANGE={ 'Energy & Utilities':[10,14],'Transport':[10,18],'Digital Infrastructure':[12,22],
    'Social Infrastructure':[11,14],'Energy Transition':[8,12],'Environmental & Waste':[7,10] };

  function render(m){
    el('oIRR').textContent=pctTxt(m.eqIRR);
    el('oMOIC').textContent=isFinite(m.moic)?m.moic.toFixed(2)+'×':'—';
    el('oEqIn').textContent=money(m.equity0);
    el('oGearing').textContent=m.entryEV>0?Math.round(m.debt0/m.entryEV*100)+'%':'—';

    var dscrTxt=isFinite(m.dscr1)?m.dscr1.toFixed(2)+'×':'n/a';
    el('suUse').innerHTML=
      '<div class="ln"><span>Purchase enterprise value</span><b>'+money(m.entryEV)+'</b></div>'+
      '<div class="ln"><span>Transaction costs</span><b>'+money(m.fees)+'</b></div>'+
      '<div class="ln tot"><span>Total uses</span><b>'+money(m.entryEV+m.fees)+'</b></div>';
    el('suSrc').innerHTML=
      '<div class="ln"><span>New acquisition debt</span><b>'+money(m.debt0)+'</b></div>'+
      '<div class="ln"><span>Equity from the fund</span><b>'+money(m.equity0)+'</b></div>'+
      '<div class="ln"><span>Implied year-1 DSCR</span><b>'+dscrTxt+'</b></div>'+
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

    renderBridge(m.bridge);
    var b=m.bridge;
    el('bridgeFoot').innerHTML='Over a <b>'+m.H+'-year</b> hold, a <b>'+money(b.start)+'</b> equity cheque returns <b>'+
      money(b.end)+'</b> — a <b>'+(isFinite(m.moic)?m.moic.toFixed(2):'—')+'×</b> multiple and <b>'+pctTxt(m.eqIRR)+
      '</b> IRR. EBITDA growth adds '+money(b.growth)+', re-rating '+(b.multiple>=0?'adds ':'subtracts ')+money(Math.abs(b.multiple))+
      ', debt paydown '+money(b.deleveraging)+' and cash distributions '+money(b.distrib)+
      (m.recap>0?' (incl. a '+money(m.recap)+' refinancing recap)':'')+'; transaction costs cost '+money(Math.abs(b.fees))+'.';

    renderJ(m);

    el('gridH').textContent='Projection · key lines by year ('+CUR+'m)';
    var N=m.H, head='<tr><th class="rl">Line · '+CUR+'m</th><th>Entry</th>';
    for(var t=1;t<=N;t++) head+='<th>Yr '+t+'</th>';
    head+='</tr>';
    function row(lab,arr,entry){ var tr='<tr><td class="rl">'+lab+'</td><td>'+(entry==null?'—':money(entry))+'</td>';
      for(var t=1;t<=N;t++){ tr+='<td>'+(arr[t]==null?'—':money(arr[t]))+'</td>'; } return tr+'</tr>'; }
    var g=head;
    g+=row('EBITDA',m.ebitda,m.eb0);
    g+=row('Cash interest',m.interest,null);
    g+=row('Debt repaid',m.paydown,null);
    g+=row('Distributions',m.dist,null);
    g+=row('Net debt (year-end)',m.debt,m.debt0);
    el('maGrid').innerHTML=g;

    renderSens();
  }

  function renderBridge(b){
    var steps=[
      {lab:'Equity cheque',val:b.start,type:'start'},{lab:'EBITDA growth',val:b.growth,type:'delta'},
      {lab:'Multiple',val:b.multiple,type:'delta'},{lab:'Debt paydown',val:b.deleveraging,type:'delta'},
      {lab:'Distributions',val:b.distrib,type:'delta'},{lab:'Costs',val:b.fees,type:'delta'},
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
      var cls=s.type==='start'?'start':(s.type==='end'?'end':(s.val>=0?'pos':'neg'));
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
    if(s==='down'){ over.mGrow=b.mGrow-2; over.mExit=Math.max(4,b.mExit-1.5); over.mFcf=Math.max(10,b.mFcf-7); }
    else if(s==='up'){ over.mGrow=b.mGrow+2; over.mExit=b.mExit+1.5; over.mFcf=Math.min(100,b.mFcf+7); }
    applyInputs(Object.assign({},b,over));
    el('scenNote').textContent = s==='base'
      ? 'growth, exit multiple and cash conversion flexed around the loaded case.'
      : (s==='down' ? 'downside: slower growth, a lower exit multiple and weaker cash conversion.'
                    : 'upside: faster growth, a higher exit multiple and stronger cash conversion.');
    document.querySelectorAll('.scen button').forEach(function(btn){ btn.classList.toggle('on', btn.dataset.scen===s); });
  }
  function clearScenarioHighlight(){ document.querySelectorAll('.scen button').forEach(function(b){ b.classList.remove('on'); }); }

  /* ============ asset picker (pull from MA_ASSETS) ============ */
  var DB=(typeof window!=='undefined' && window.MA_ASSETS) ? window.MA_ASSETS : null;
  var FCF_BY_CLASS={ 'Energy & Utilities':50, 'Transport':55, 'Digital Infrastructure':58,
    'Social Infrastructure':70, 'Energy Transition':62, 'Environmental & Waste':52 };
  var ACQ_HOLD=12;

  function loadAsset(secIdx, astIdx){
    if(secIdx<0 || !DB){
      LOADED=Object.assign({},GENERIC); nativeCur='$'; nativeEbitda=GENERIC.mEbitda; dispCur='$';
      setCurSelect('native');
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
      mHold:hold, mRd:a.rd, mFees:2, mFcf:FCF_BY_CLASS[sec.cls]||55, mSweep:40,
      mDscr:1.8, mTenor:Math.max(5,Math.min(15,Math.round(hold*0.9))), cur:a.cur,
      ev:a.ev||null, im:im, cls:sec.cls };
    nativeCur=a.cur; nativeEbitda=a.ebitda; dispCur=a.cur; setCurSelect('native');
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
  ['mEntry','mLev','mGrow','mExit','mHold','mFees','mFcf','mSweep','mRd','mDscr','mTenor','mRefiYr','mRefiRd','mRegear'].forEach(function(id){
    var e=el(id); if(e) e.addEventListener('input',function(){ clearScenarioHighlight(); run(); });
  });
  // EBITDA edits update the stored native value (so currency switches stay correct)
  (function(){ var e=el('mEbitda'); if(e) e.addEventListener('input',function(){
    nativeEbitda=gv('mEbitda')*fx(dispCur,nativeCur); clearScenarioHighlight(); run(); }); })();
  var refi=el('mRefi'); if(refi) refi.addEventListener('change',function(){ clearScenarioHighlight(); run(); });
  var cur=el('maCur'); if(cur) cur.addEventListener('change',onCurChange);
  ['sensRow','sensCol'].forEach(function(id){ var e=el(id); if(e) e.addEventListener('change',renderSens); });
  var dm=el('mDebtMode'); if(dm) dm.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){ setDebtMode(b.dataset.mode); }); });
  document.querySelectorAll('.scen button').forEach(function(b){ b.addEventListener('click',function(){ setScenario(b.dataset.scen); }); });
  var gs=el('gsBtn'); if(gs) gs.addEventListener('click',goalSeek);
  var ti=el('mTargetIRR'); if(ti) ti.addEventListener('keydown',function(e){ if(e.key==='Enter') goalSeek(); });
  var reset=el('maReset'); if(reset) reset.addEventListener('click',function(){ setScenario('base'); });

  if(el('mEntry')){
    buildPicker();
    // hand-off from the fibre comparator (or any tool): ?eb=&entry=&exit=&lev=&hold=&cur=
    var q=(typeof URLSearchParams!=='undefined') ? new URLSearchParams(location.search) : null;
    if(q && q.get('eb')){
      var cur=q.get('cur')||'$';
      nativeCur=cur; nativeEbitda=parseFloat(q.get('eb'))||200; dispCur=cur;
      LOADED={ mEntry:parseFloat(q.get('entry'))||12, mExit:parseFloat(q.get('exit'))||12,
        mLev:parseFloat(q.get('lev'))||6, mGrow:4, mEbitda:nativeEbitda, mHold:Math.round(parseFloat(q.get('hold'))||10),
        mRd:6, mFees:2, mFcf:58, mSweep:40, mDscr:1.8, mTenor:12, cur:cur, ev:null, im:null, cls:'Digital Infrastructure' };
      setCurSelect('native'); applyInputs(LOADED); setScenario('base');
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
