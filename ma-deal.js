/* Infrastructure M&A — acquisition & returns model + historical deals table.
   A simplified single-asset buyout: sources & uses, a year-by-year cash-flow
   waterfall driving debt paydown and distributions, the equity IRR/MOIC, a
   value-creation bridge that reconciles exactly to total proceeds, a sensitivity
   matrix, and a DSCR-based debt-sizing option. It can pull the base-case
   financials of any of the worked assets from the reference library (MA_ASSETS).
   All figures illustrative; not a forecast of any specific asset. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }

  var CUR='$';                         // active currency symbol (set by the loaded asset)
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

  /* generic illustrative base case */
  var GENERIC={ mEntry:12, mLev:6, mGrow:4, mExit:12, mEbitda:200, mHold:7, mFees:2, mFcf:55, mSweep:40, mRd:6, mDscr:1.8, mTenor:15, cur:'$' };
  var LOADED=Object.assign({},GENERIC);   // the currently-loaded base case
  var debtMode='lev';                     // 'lev' | 'dscr'

  /* ============ the model (pure: reads params, no DOM) ============ */
  function params(ov){
    ov=ov||{};
    function p(id){ return (id in ov)?ov[id]:gv(id); }
    return {
      entryM:p('mEntry'), levX:p('mLev'), g:p('mGrow')/100, exitM:p('mExit'),
      eb0:Math.max(0,p('mEbitda')), H:Math.max(1,Math.min(40,Math.round(p('mHold')))),
      feeP:p('mFees')/100, fcfP:p('mFcf')/100, sweep:Math.max(0,Math.min(1,p('mSweep')/100)),
      rd:p('mRd')/100, dscr:Math.max(1,p('mDscr')), tenor:Math.max(2,Math.round(p('mTenor')))
    };
  }
  function annuityFactor(rd,n){ return rd>0 ? (1-Math.pow(1+rd,-n))/rd : n; }

  function model(P){
    var entryEV=P.entryM*P.eb0;
    var af=annuityFactor(P.rd,P.tenor);
    var cfads1=P.fcfP*P.eb0*(1+P.g);          // year-1 cash available for debt service
    var debt0;
    if(debtMode==='dscr'){ debt0=Math.min(cfads1*af/P.dscr, entryEV*0.85); }
    else { debt0=Math.min(P.levX*P.eb0, entryEV*0.85); }
    debt0=Math.max(0,debt0);
    var fees=P.feeP*entryEV;
    var equity0=entryEV+fees-debt0;
    var dscr1=debt0>0 ? cfads1*af/debt0 : Infinity;   // implied year-1 DSCR

    var ebitda=[P.eb0], debt=[debt0], interest=[0], opcf=[0], paydown=[0], dist=[0];
    var debtBal=debt0, sumDist=0;
    for(var t=1;t<=P.H;t++){
      var eb=P.eb0*Math.pow(1+P.g,t); ebitda[t]=eb;
      var intr=P.rd*debtBal; interest[t]=intr;
      var ocf=P.fcfP*eb; opcf[t]=ocf;
      var surplus=ocf-intr, pd=0, di=0;
      if(surplus>0){ pd=Math.min(P.sweep*surplus, debtBal); di=surplus-pd; }
      debtBal=Math.max(0,debtBal-pd);
      paydown[t]=pd; dist[t]=di; debt[t]=debtBal; sumDist+=di;
    }
    var ebH=ebitda[P.H], debtH=debtBal;
    var exitEV=P.exitM*ebH, exitEq=exitEV-debtH;
    var cf=[-equity0];
    for(var t2=1;t2<=P.H;t2++){ cf.push(dist[t2]+(t2===P.H?exitEq:0)); }
    var eqIRR=irr(cf);
    var totalProceeds=sumDist+exitEq, moic=equity0>0?totalProceeds/equity0:NaN;

    return {
      entryM:P.entryM,exitM:P.exitM,entryEV:entryEV,exitEV:exitEV,debt0:debt0,debtH:debtH,fees:fees,
      equity0:equity0,exitEq:exitEq,sumDist:sumDist,totalProceeds:totalProceeds,dscr1:dscr1,
      eqIRR:eqIRR,moic:moic,H:P.H,eb0:P.eb0,ebH:ebH,
      ebitda:ebitda,debt:debt,interest:interest,opcf:opcf,paydown:paydown,dist:dist,
      bridge:{start:equity0,growth:P.entryM*(ebH-P.eb0),multiple:ebH*(P.exitM-P.entryM),
              deleveraging:debt0-debtH,distrib:sumDist,fees:-fees,end:totalProceeds}
    };
  }

  /* ============ render ============ */
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

    renderBridge(m.bridge);
    var b=m.bridge;
    el('bridgeFoot').innerHTML='Over a <b>'+m.H+'-year</b> hold, a <b>'+money(b.start)+'</b> equity cheque returns <b>'+
      money(b.end)+'</b> — a <b>'+(isFinite(m.moic)?m.moic.toFixed(2):'—')+'×</b> multiple and <b>'+pctTxt(m.eqIRR)+
      '</b> IRR. EBITDA growth adds '+money(b.growth)+', re-rating '+(b.multiple>=0?'adds ':'subtracts ')+money(Math.abs(b.multiple))+
      ', debt paydown '+money(b.deleveraging)+' and cash distributions '+money(b.distrib)+'; transaction costs cost '+money(Math.abs(b.fees))+'.';

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
      {lab:'Equity cheque',val:b.start,type:'start'},
      {lab:'EBITDA growth',val:b.growth,type:'delta'},
      {lab:'Multiple',val:b.multiple,type:'delta'},
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
      var cls=s.type==='start'?'start':(s.type==='end'?'end':(s.val>=0?'pos':'neg'));
      var label=(s.type==='delta')?signed(s.val):money(s.val);
      html+='<div class="bcol"><div class="bbar '+cls+'" style="height:'+barH+'px;margin-bottom:'+base+'px">'+
        '<span class="bval">'+label+'</span><span class="blbl">'+s.lab+'</span></div></div>';
    });
    el('maBridge').innerHTML=html;
  }

  /* ============ sensitivity matrix ============ */
  function axisVals(idv, center){
    if(idv==='mGrow') return [center-3,center-1.5,center,center+1.5,center+3];
    if(idv==='mLev'){ var a=[]; for(var i=-2;i<=2;i++) a.push(Math.max(0,center+i)); return a; }
    return [center-2,center-1,center,center+1,center+2].map(function(v){ return Math.max(4,v); }); // multiples
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
    var btns=el('mDebtMode').querySelectorAll('button');
    btns.forEach(function(b){ b.classList.toggle('on', b.dataset.mode===mode); });
    var dscr=el('mDscr'), tenor=el('mTenor'), lev=el('mLev');
    var dscrM=(mode==='dscr');
    dscr.disabled=!dscrM; tenor.disabled=!dscrM; lev.disabled=dscrM;
    if(dscrM){ // reflect the computed leverage on the (disabled) slider
      var m=model(params()); lev.value=(m.debt0/Math.max(1,gv('mEbitda'))).toFixed(2);
    }
    run();
  }

  function applyBase(base){
    Object.keys(GENERIC).forEach(function(id){
      if(id==='cur') return;
      var e=el(id); if(e && base[id]!=null) e.value=base[id];
    });
    CUR=base.cur||'$';
    el('uEbitda').textContent=CUR+'m';
    if(debtMode==='dscr'){ var m=model(params()); el('mLev').value=(m.debt0/Math.max(1,gv('mEbitda'))).toFixed(2); }
    run();
  }
  function setScenario(s){
    var b=LOADED;
    var over={};
    if(s==='down'){ over.mGrow=b.mGrow-2; over.mExit=Math.max(4,b.mExit-1.5); over.mFcf=Math.max(10,b.mFcf-7); }
    else if(s==='up'){ over.mGrow=b.mGrow+2; over.mExit=b.mExit+1.5; over.mFcf=Math.min(100,b.mFcf+7); }
    applyBase(Object.assign({},b,over));
    el('scenNote').textContent = s==='base'
      ? 'growth, exit multiple and cash conversion flexed around the loaded case.'
      : (s==='down' ? 'downside: slower growth, a lower exit multiple and weaker cash conversion.'
                    : 'upside: faster growth, a higher exit multiple and stronger cash conversion.');
    document.querySelectorAll('.scen button').forEach(function(btn){ btn.classList.toggle('on', btn.dataset.scen===s); });
  }
  function clearScenarioHighlight(){ document.querySelectorAll('.scen button').forEach(function(b){ b.classList.remove('on'); }); }

  /* ============ asset picker (pull from MA_ASSETS database) ============ */
  var DB=(typeof window!=='undefined' && window.MA_ASSETS) ? window.MA_ASSETS : null;
  // cash-flow / EBITDA conversion after tax & maintenance capex — capital-heavy
  // regulated networks convert least; light-capex availability assets convert most.
  var FCF_BY_CLASS={ 'Energy & Utilities':50, 'Transport':55, 'Digital Infrastructure':58,
    'Social Infrastructure':70, 'Energy Transition':62, 'Environmental & Waste':52 };
  var ACQ_HOLD=12;   // a realistic infra-fund hold; the reference pages run the full asset life

  function loadAsset(secIdx, astIdx){
    if(secIdx<0 || !DB){ LOADED=Object.assign({},GENERIC); applyBase(LOADED);
      el('maLoaded').innerHTML='Generic, illustrative asset. Pick a sub-sector above to pull a real worked asset’s financials into the model.';
      setScenario('base'); return; }
    var sec=DB.sectors[secIdx], a=sec.assets[astIdx]; if(!a) return;
    var hold=Math.min(a.hold||ACQ_HOLD, ACQ_HOLD);   // cap at a realistic acquisition hold
    // cap leverage so gearing stays ≤ ~70% of the purchase EV (you can't borrow more
    // ×EBITDA than you pay) — the reference leverage was sized against build cost, not an EV multiple
    var lev=Math.min(a.lev, 0.7*a.mult);
    LOADED={ mEntry:a.mult, mExit:a.mult, mLev:lev, mGrow:a.growth, mEbitda:a.ebitda,
      mHold:hold, mRd:a.rd, mFees:2, mFcf:FCF_BY_CLASS[sec.cls]||55, mSweep:40,
      mDscr:1.8, mTenor:Math.max(5,Math.min(15,Math.round(hold*0.9))), cur:a.cur };
    applyBase(LOADED);
    setScenario('base');
    el('maLoaded').innerHTML=
      'Loaded <b>'+a.name+'</b>'+(a.geo?' ('+a.geo+')':'')+' from <a href="'+sec.url+'">'+sec.name+'</a> — '+
      '<b>'+a.cur+a.ebitda+'m</b> EBITDA, modelled at <b>'+a.mult+'×</b> and <b>'+a.lev+'×</b> leverage. '+
      '<span class="ref"><span>As modelled on the reference page: unlevered IRR <b>'+a.uirr+'</b>, levered <b>'+a.lirr+'</b>, MOIC <b>'+a.moic+'</b>.</span></span> '+
      'Figures are illustrative and in the asset’s native currency.';
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
    astSel.addEventListener('change',function(){
      if(secSel.value!=='custom') loadAsset(+secSel.value, +astSel.value);
    });
    fillAssets(-1);
  }

  /* ============ wiring ============ */
  ['mEntry','mLev','mGrow','mExit','mEbitda','mHold','mFees','mFcf','mSweep','mRd','mDscr','mTenor'].forEach(function(id){
    var e=el(id); if(e) e.addEventListener('input',function(){ clearScenarioHighlight(); run(); });
  });
  ['sensRow','sensCol'].forEach(function(id){ var e=el(id); if(e) e.addEventListener('change',renderSens); });
  var dm=el('mDebtMode');
  if(dm) dm.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){ setDebtMode(b.dataset.mode); }); });
  document.querySelectorAll('.scen button').forEach(function(b){ b.addEventListener('click',function(){ setScenario(b.dataset.scen); }); });
  var reset=el('maReset'); if(reset) reset.addEventListener('click',function(){ setScenario('base'); });

  if(el('mEntry')){ buildPicker(); applyBase(LOADED); }

  /* ====================== historical deals table ====================== */
  var CLS={
    'Energy & Utilities':'#0c6b4f','Transport':'#b07d24','Digital Infrastructure':'#2f5fb0',
    'Social Infrastructure':'#bc4733','Energy Transition':'#37934f','Environmental & Waste':'#6a6b3a','Platform / GP':'#6b5b95'
  };
  // [target, acquirer, year, sector, value text, value(US$bn sort), why, refUrl]
  var DEALS=[
    ['Thames Water','Macquarie-led consortium','2006','Energy & Utilities','EV £8.5bn',15.0,'UK water utility bought from RWE; c.£6.5bn RAB. The archetypal regulated-utility buyout — and a cautionary tale on leverage.','water-wastewater.html'],
    ['BAA (Heathrow + UK airports)','Ferrovial-led consortium (GIC, CDPQ)','2006','Transport','£10.3bn equity',19.0,'One of Europe\'s largest LBOs; took a listed UK airports group private under majority foreign ownership.','airports.html'],
    ['P&O Ports','DP World','2006','Transport','£3.9bn',6.8,'State-owned operator buys the world\'s #4 ports group; US terminals later divested after political backlash — classic FDI/political risk.','ports.html'],
    ['Gatwick Airport','Global Infrastructure Partners','2009','Transport','£1.51bn',2.5,'BAA forced to divest by the UK competition authority; GIP\'s carve-out became a model infra-fund single-asset deal.','airports.html'],
    ['UK Power Networks','CKI / HK Electric (Li Ka-shing)','2010','Energy & Utilities','£5.78bn',9.1,'Three UK electricity distribution networks bought from EDF; a long-hold strategic acquirer of regulated grids.','electricity-distribution.html'],
    ['Nat. Grid Gas Distribution (Cadent)','Macquarie-led consortium (Allianz, QIA, CIC)','2017','Energy & Utilities','EV £13.8bn',17.5,'61% of the UK\'s largest gas distribution network carved out of National Grid; consortium of infra managers and sovereign funds.','gas-distribution.html'],
    ['Abertis','Atlantia + ACS / Hochtief','2018','Transport','€16.5bn',19.0,'Created the world\'s largest toll-road group; a contested takeover battle resolved by a joint bid.','roads.html'],
    ['CK Hutchison European towers','Cellnex','2020','Digital Infrastructure','€10bn',11.8,'24,600 towers across six countries; the towerco roll-up model — buy passive infrastructure, lease to multiple operators.','mobile-towers.html'],
    ['Inter Pipeline','Brookfield Infrastructure','2021','Energy & Utilities','C$16.50 / share',13.5,'Canadian midstream platform taken private after a contested bid — a buyer converting a stake into full control.','gas-transmission.html'],
    ['CyrusOne','KKR + Global Infrastructure Partners','2021','Digital Infrastructure','$15bn',15.0,'Take-private of a data-centre REIT; digital infrastructure firmly inside the infra-fund mandate.','data-centres.html'],
    ['CoreSite','American Tower','2021','Digital Infrastructure','$10.1bn',10.1,'A towerco buys an interconnection-rich data-centre platform — convergence of wireless and wireline infrastructure.','data-centres.html'],
    ['Sydney Airport','Sydney Aviation Alliance (IFM, AustralianSuper, ART, GIP)','2022','Transport','A$23.6bn equity',17.0,'Australia\'s largest take-private; domestic pension capital and infra funds buying a monopoly gateway airport.','airports.html'],
    ['ContourGlobal','KKR','2022','Energy Transition','£1.75bn',2.2,'Take-private of a listed global power producer (thermal + renewables) to accelerate its energy-transition build-out.','onshore-wind.html'],
    ['Telecom Italia NetCo','KKR-led consortium (ADIA, CPPIB, F2i)','2024','Digital Infrastructure','EV up to €22bn',23.6,'Europe\'s largest-ever carve-out of a national fixed telecoms network into a stand-alone infrastructure asset.','fibre-networks.html'],
    ['Global Infrastructure Partners','BlackRock','2024','Platform / GP','$12.5bn',12.5,'The asset manager buys the largest independent infra GP — consolidation at the platform level, not the asset level.',''],
    ['Neoen','Brookfield + co-investors','2024','Energy Transition','€6.1bn',6.6,'Take-private of a French renewables and battery-storage developer; scaling a clean-energy platform across markets.','solar.html'],
    ['CK Hutchison ports portfolio','BlackRock / TiL (MSC) consortium','2025','Transport','EV $22.8bn',22.8,'80% of 43 global ports incl. Panama Canal terminals; agreed 2025, then contested in Panama — geopolitics meets infrastructure.','ports.html']
  ];
  var COLS=[
    {k:0,label:'Target'},{k:3,label:'Sector'},{k:2,label:'Year',r:true},{k:4,label:'Deal value',r:true},{k:6,label:'Why it matters'}
  ];

  var dHead=el('dealHead'), dBody=el('dealBody'), dFilters=el('dealFilters');
  if(dHead && dBody){
    var filter='All', sortK=2, sortDir=-1;
    COLS.forEach(function(c){
      var th=document.createElement('th'); if(c.r) th.className='r';
      th.innerHTML=c.label+'<span class="arr"></span>'; th.dataset.k=c.k;
      th.addEventListener('click',function(){ if(sortK===c.k) sortDir=-sortDir; else { sortK=c.k; sortDir=(c.k===0||c.k===3||c.k===6)?1:-1; } paint(); });
      dHead.appendChild(th);
    });
    ['All'].concat(Object.keys(CLS)).forEach(function(f){
      var b=document.createElement('button'); b.className='chip-f'+(f==='All'?' on':''); b.textContent=f;
      b.addEventListener('click',function(){ filter=f; dFilters.querySelectorAll('.chip-f').forEach(function(x){ x.classList.toggle('on',x===b); }); paint(); });
      dFilters.appendChild(b);
    });
    function sortVal(r){ if(sortK===2) return parseFloat(r[2]); if(sortK===4) return r[5]; return String(r[sortK]).toLowerCase(); }
    function paint(){
      var rows=DEALS.filter(function(r){ return filter==='All'||r[3]===filter; });
      rows.sort(function(a,b){ var va=sortVal(a),vb=sortVal(b); if(va<vb) return -sortDir; if(va>vb) return sortDir; return 0; });
      dHead.querySelectorAll('th').forEach(function(th){ var on=+th.dataset.k===sortK; th.classList.toggle('sort',on); th.querySelector('.arr').textContent=on?(sortDir<0?'▾':'▴'):''; });
      dBody.innerHTML=rows.map(function(r){
        var tgt=r[7] ? '<a href="'+r[7]+'" style="color:inherit;text-decoration:none;border-bottom:1px dotted var(--border-strong)">'+r[0]+'</a>' : r[0];
        return '<tr>'+
          '<td class="tgt">'+tgt+'<div class="acq">'+r[1]+'</div></td>'+
          '<td><span class="cls-tag"><span class="cls-dot" style="background:'+(CLS[r[3]]||'#889390')+'"></span>'+r[3]+'</span></td>'+
          '<td class="r">'+r[2]+'</td>'+
          '<td class="r">'+r[4]+'</td>'+
          '<td><div class="why">'+r[6]+'</div></td>'+
        '</tr>';
      }).join('');
    }
    paint();
  }
})();
