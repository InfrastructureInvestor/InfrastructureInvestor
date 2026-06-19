/* Infrastructure M&A — acquisition & returns model + historical deals table.
   A simplified single-asset buyout: sources & uses, a year-by-year cash-flow
   waterfall driving debt paydown and distributions, the equity IRR/MOIC, and a
   value-creation bridge that reconciles exactly to total proceeds.
   All figures illustrative ($m); not a forecast of any specific asset. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }

  /* ---- formatting ---- */
  function money(v){ // $m, with bn rollover for big numbers
    var n=Math.round(v), neg=n<0; n=Math.abs(n);
    var s;
    if(n>=10000){ s='$'+(n/1000).toFixed(1)+'bn'; }
    else { s='$'+n.toLocaleString('en-US')+'m'; }
    return neg?'('+s+')':s;
  }
  function signed(v){ var s=money(Math.abs(v)); return (v<0?'−':'+')+s; }
  function pctTxt(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }

  /* ---- IRR via bisection ---- */
  function irr(cf){
    var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi);
    if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<200;k++){ var mid=(lo+hi)/2,fm=f(mid); if(flo*fm<=0){hi=mid;}else{lo=mid;flo=fm;} }
    return (lo+hi)/2;
  }

  var BASE={ mEntry:12, mLev:6, mGrow:4, mExit:12, mEbitda:200, mHold:7, mFees:2, mFcf:55, mSweep:40, mRd:6 };

  /* ====================== the model ====================== */
  function compute(){
    var entryM=gv('mEntry'), levX=gv('mLev'), g=gv('mGrow')/100, exitM=gv('mExit');
    var eb0=Math.max(0,gv('mEbitda')), H=Math.max(1,Math.min(25,Math.round(gv('mHold'))));
    var feeP=gv('mFees')/100, fcfP=gv('mFcf')/100, sweep=Math.max(0,Math.min(1,gv('mSweep')/100)), rd=gv('mRd')/100;

    var entryEV=entryM*eb0;
    var debt0=Math.min(levX*eb0, entryEV*0.85);   // sized to leverage, capped at 85% of EV
    var fees=feeP*entryEV;
    var equity0=entryEV+fees-debt0;                // the equity cheque

    // year-by-year
    var ebitda=[eb0], debt=[debt0], interest=[0], opcf=[0], paydown=[0], dist=[0];
    var debtBal=debt0, sumDist=0;
    for(var t=1;t<=H;t++){
      var eb=eb0*Math.pow(1+g,t); ebitda[t]=eb;
      var intr=rd*debtBal; interest[t]=intr;
      var ocf=fcfP*eb; opcf[t]=ocf;
      var surplus=ocf-intr;                         // cash after interest
      var pd=0,di=0;
      if(surplus>0){ pd=Math.min(sweep*surplus, debtBal); di=surplus-pd; }
      else { di=0; pd=0; }                          // shortfall absorbed by revolver (ignored)
      debtBal=Math.max(0,debtBal-pd);
      paydown[t]=pd; dist[t]=di; debt[t]=debtBal; sumDist+=di;
    }

    var ebH=ebitda[H], debtH=debtBal;
    var exitEV=exitM*ebH, exitEq=exitEV-debtH;

    // equity cash flows for IRR: -cheque at t0, distributions t1..H, +exit at H
    var cf=[-equity0];
    for(var t2=1;t2<=H;t2++){ cf.push(dist[t2]+(t2===H?exitEq:0)); }
    var eqIRR=irr(cf);
    var totalProceeds=sumDist+exitEq;
    var moic=equity0>0?totalProceeds/equity0:NaN;

    // value-creation bridge (reconciles exactly to total proceeds):
    // equity0 + growth + multiple + paydown + distributions − fees = totalProceeds
    var growth=entryM*(ebH-eb0);          // EBITDA growth at the entry multiple
    var multiple=ebH*(exitM-entryM);      // re-rating on exit EBITDA
    var deleveraging=debt0-debtH;         // net debt repaid over the hold
    var distrib=sumDist;                  // cash returned during the hold
    var feeDrag=-fees;

    return {
      entryM:entryM,exitM:exitM,entryEV:entryEV,exitEV:exitEV,debt0:debt0,debtH:debtH,fees:fees,
      equity0:equity0,exitEq:exitEq,sumDist:sumDist,totalProceeds:totalProceeds,
      eqIRR:eqIRR,moic:moic,H:H,eb0:eb0,ebH:ebH,
      ebitda:ebitda,debt:debt,interest:interest,opcf:opcf,paydown:paydown,dist:dist,
      bridge:{start:equity0,growth:growth,multiple:multiple,deleveraging:deleveraging,distrib:distrib,fees:feeDrag,end:totalProceeds}
    };
  }

  /* ====================== render ====================== */
  function render(m){
    el('oIRR').textContent=pctTxt(m.eqIRR);
    el('oMOIC').textContent=isFinite(m.moic)?m.moic.toFixed(2)+'×':'—';
    el('oEqIn').textContent=money(m.equity0);
    el('oGearing').textContent=m.entryEV>0?Math.round(m.debt0/m.entryEV*100)+'%':'—';

    // sources & uses
    el('suUse').innerHTML=
      '<div class="ln"><span>Purchase enterprise value</span><b>'+money(m.entryEV)+'</b></div>'+
      '<div class="ln"><span>Transaction costs</span><b>'+money(m.fees)+'</b></div>'+
      '<div class="ln tot"><span>Total uses</span><b>'+money(m.entryEV+m.fees)+'</b></div>';
    el('suSrc').innerHTML=
      '<div class="ln"><span>New acquisition debt</span><b>'+money(m.debt0)+'</b></div>'+
      '<div class="ln"><span>Equity from the fund</span><b>'+money(m.equity0)+'</b></div>'+
      '<div class="ln tot"><span>Total sources</span><b>'+money(m.debt0+m.equity0)+'</b></div>';

    renderBridge(m.bridge);

    // bridge narrative
    var b=m.bridge;
    el('bridgeFoot').innerHTML='Over a <b>'+m.H+'-year</b> hold, a <b>'+money(b.start)+'</b> equity cheque returns <b>'+
      money(b.end)+'</b> — a <b>'+(isFinite(m.moic)?m.moic.toFixed(2):'—')+'×</b> multiple and <b>'+pctTxt(m.eqIRR)+
      '</b> IRR. EBITDA growth adds '+money(b.growth)+', re-rating '+(b.multiple>=0?'adds ':'subtracts ')+money(Math.abs(b.multiple))+
      ', debt paydown '+money(b.deleveraging)+' and cash distributions '+money(b.distrib)+'; transaction costs cost '+money(Math.abs(b.fees))+'.';

    // projection grid
    var N=m.H;
    var head='<tr><th class="rl">Line · $m</th><th>Entry</th>';
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
  }

  function renderBridge(b){
    // ordered waterfall: start (equity), +growth, ±multiple, +paydown, +distrib, −fees, end (proceeds)
    var steps=[
      {lab:'Equity cheque',val:b.start,type:'start'},
      {lab:'EBITDA growth',val:b.growth,type:'delta'},
      {lab:'Multiple',val:b.multiple,type:'delta'},
      {lab:'Debt paydown',val:b.deleveraging,type:'delta'},
      {lab:'Distributions',val:b.distrib,type:'delta'},
      {lab:'Costs',val:b.fees,type:'delta'},
      {lab:'Total proceeds',val:b.end,type:'end'}
    ];
    // compute running tops; scale to max cumulative value
    var maxTop=Math.max(b.start,b.end,1), cum=0;
    var floors=[]; // running base for delta bars
    steps.forEach(function(s){
      if(s.type==='start'){ s.base=0; s.top=s.val; cum=s.val; }
      else if(s.type==='end'){ s.base=0; s.top=s.val; }
      else { if(s.val>=0){ s.base=cum; s.top=cum+s.val; } else { s.base=cum+s.val; s.top=cum; } cum+=s.val; }
      maxTop=Math.max(maxTop,s.top);
    });
    var H=176; // px usable height
    var html='';
    steps.forEach(function(s){
      var top=Math.max(0,s.top)/maxTop*H, base=Math.max(0,s.base)/maxTop*H;
      var barH=Math.max(2,top-base);
      var cls=s.type==='start'?'start':(s.type==='end'?'end':(s.val>=0?'pos':'neg'));
      var label=(s.val>=0||s.type!=='delta')?money(s.val):'−'+money(Math.abs(s.val));
      if(s.type==='delta') label=signed(s.val);
      html+='<div class="bcol"><div class="bbar '+cls+'" style="height:'+barH+'px;margin-bottom:'+base+'px">'+
        '<span class="bval">'+label+'</span><span class="blbl">'+s.lab+'</span></div></div>';
    });
    el('maBridge').innerHTML=html;
  }

  function syncLabels(){
    el('mEntryV').textContent=gv('mEntry').toFixed(1)+'×';
    el('mLevV').textContent=gv('mLev').toFixed(2)+'×';
    el('mGrowV').textContent=gv('mGrow').toFixed(1)+'%';
    el('mExitV').textContent=gv('mExit').toFixed(1)+'×';
  }
  function run(){ syncLabels(); var m=compute(); if(m) render(m); }

  // wire inputs
  ['mEntry','mLev','mGrow','mExit','mEbitda','mHold','mFees','mFcf','mSweep','mRd'].forEach(function(id){
    var e=el(id); if(e) e.addEventListener('input',run);
  });
  var reset=el('maReset');
  if(reset) reset.addEventListener('click',function(){
    Object.keys(BASE).forEach(function(id){ var e=el(id); if(e) e.value=BASE[id]; }); run();
  });
  if(el('mEntry')) run();

  /* ====================== historical deals table ====================== */
  var CLS={
    'Energy & Utilities':'#0c6b4f','Transport':'#b07d24','Digital Infrastructure':'#2f5fb0',
    'Social Infrastructure':'#bc4733','Energy Transition':'#37934f','Environmental & Waste':'#6a6b3a','Platform / GP':'#6b5b95'
  };
  // [target, acquirer, year, sector, value text, value(US$bn sort), why]
  var DEALS=[
    ['Thames Water','Macquarie-led consortium','2006','Energy & Utilities','EV £8.5bn',15.0,'UK water utility bought from RWE; c.£6.5bn RAB. The archetypal regulated-utility buyout — and a cautionary tale on leverage.'],
    ['BAA (Heathrow + UK airports)','Ferrovial-led consortium (GIC, CDPQ)','2006','Transport','£10.3bn equity',19.0,'One of Europe\'s largest LBOs; took a listed UK airports group private under majority foreign ownership.'],
    ['P&O Ports','DP World','2006','Transport','£3.9bn',6.8,'State-owned operator buys the world\'s #4 ports group; US terminals later divested after political backlash — classic FDI/political risk.'],
    ['Gatwick Airport','Global Infrastructure Partners','2009','Transport','£1.51bn',2.5,'BAA forced to divest by the UK competition authority; GIP\'s carve-out became a model infra-fund single-asset deal.'],
    ['UK Power Networks','CKI / HK Electric (Li Ka-shing)','2010','Energy & Utilities','£5.78bn',9.1,'Three UK electricity distribution networks bought from EDF; a long-hold strategic acquirer of regulated grids.'],
    ['Nat. Grid Gas Distribution (Cadent)','Macquarie-led consortium (Allianz, QIA, CIC)','2017','Energy & Utilities','EV £13.8bn',17.5,'61% of the UK\'s largest gas distribution network carved out of National Grid; consortium of infra managers and sovereign funds.'],
    ['Abertis','Atlantia + ACS / Hochtief','2018','Transport','€16.5bn',19.0,'Created the world\'s largest toll-road group; a contested takeover battle resolved by a joint bid.'],
    ['CK Hutchison European towers','Cellnex','2020','Digital Infrastructure','€10bn',11.8,'24,600 towers across six countries; the towerco roll-up model — buy passive infrastructure, lease to multiple operators.'],
    ['Inter Pipeline','Brookfield Infrastructure','2021','Energy & Utilities','C$16.50 / share',13.5,'Canadian midstream platform taken private after a contested bid — a buyer converting a stake into full control.'],
    ['CyrusOne','KKR + Global Infrastructure Partners','2021','Digital Infrastructure','$15bn',15.0,'Take-private of a data-centre REIT; digital infrastructure firmly inside the infra-fund mandate.'],
    ['CoreSite','American Tower','2021','Digital Infrastructure','$10.1bn',10.1,'A towerco buys an interconnection-rich data-centre platform — convergence of wireless and wireline infrastructure.'],
    ['Sydney Airport','Sydney Aviation Alliance (IFM, AustralianSuper, ART, GIP)','2022','Transport','A$23.6bn equity',17.0,'Australia\'s largest take-private; domestic pension capital and infra funds buying a monopoly gateway airport.'],
    ['ContourGlobal','KKR','2022','Energy Transition','£1.75bn',2.2,'Take-private of a listed global power producer (thermal + renewables) to accelerate its energy-transition build-out.'],
    ['Telecom Italia NetCo','KKR-led consortium (ADIA, CPPIB, F2i)','2024','Digital Infrastructure','EV up to €22bn',23.6,'Europe\'s largest-ever carve-out of a national fixed telecoms network into a stand-alone infrastructure asset.'],
    ['Global Infrastructure Partners','BlackRock','2024','Platform / GP','$12.5bn',12.5,'The asset manager buys the largest independent infra GP — consolidation at the platform level, not the asset level.'],
    ['Neoen','Brookfield + co-investors','2024','Energy Transition','€6.1bn',6.6,'Take-private of a French renewables and battery-storage developer; scaling a clean-energy platform across markets.'],
    ['CK Hutchison ports portfolio','BlackRock / TiL (MSC) consortium','2025','Transport','EV $22.8bn',22.8,'80% of 43 global ports incl. Panama Canal terminals; agreed 2025, then contested in Panama — geopolitics meets infrastructure.']
  ];
  var COLS=[
    {k:0,label:'Target',cls:'tgt'},
    {k:3,label:'Sector'},
    {k:2,label:'Year',r:true},
    {k:4,label:'Deal value',r:true},
    {k:6,label:'Why it matters'}
  ];

  var dHead=el('dealHead'), dBody=el('dealBody'), dFilters=el('dealFilters');
  if(dHead && dBody){
    var filter='All', sortK=2, sortDir=-1;  // default: year desc
    COLS.forEach(function(c){
      var th=document.createElement('th'); if(c.r) th.className='r';
      th.innerHTML=c.label+'<span class="arr"></span>';
      th.dataset.k=c.k;
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
      var textCol=(sortK===0||sortK===3||sortK===6);
      rows.sort(function(a,b){ var va=sortVal(a),vb=sortVal(b); if(va<vb) return -sortDir; if(va>vb) return sortDir; return 0; });
      dHead.querySelectorAll('th').forEach(function(th){ var on=+th.dataset.k===sortK; th.classList.toggle('sort',on); th.querySelector('.arr').textContent=on?(sortDir<0?'▾':'▴'):''; });
      dBody.innerHTML=rows.map(function(r){
        return '<tr>'+
          '<td class="tgt">'+r[0]+'<div class="acq">'+r[1]+'</div></td>'+
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
