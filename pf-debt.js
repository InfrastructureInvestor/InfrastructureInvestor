/* Project finance & debt sculpting. CFADS grows along the contract; debt is
   sized off a target DSCR either by SCULPTING (debt service follows CFADS, the
   project-finance default) or as a level ANNUITY (capacity set by the worst
   year). Outputs capacity, gearing, DSCR/LLCR, WAL and the refinancing release,
   and draws CFADS vs debt service and the balance rundown on a canvas. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function fmt(v){ var n=Math.round(v); var neg=n<0; n=Math.abs(n);
    var s=n.toLocaleString('en-US'); return neg?'('+s+')':s; }

  function compute(){
    var C1 = gv('pfCFADS');                          // year-1 CFADS $m
    var g  = gv('pfG')/100;                          // CFADS growth
    var T  = Math.max(3, Math.min(35, Math.round(gv('pfTenor'))));
    var r  = Math.max(0.1, gv('pfRate'))/100;        // all-in interest
    var K  = Math.max(1.01, gv('pfDSCR'));           // target DSCR
    var cost = Math.max(1, gv('pfCost'));            // project cost $m
    var shape = (el('pfShape')||{}).value || 'sculpt';
    var R  = Math.round(gv('pfRefiY'));              // refi year (0 = off)
    var r2 = Math.max(0.1, gv('pfRefiR'))/100;       // refi all-in rate

    var CF=[]; for(var t=1;t<=T;t++) CF[t]=C1*Math.pow(1+g,t-1);

    /* --- debt capacity --- */
    var D=0, DS=[];
    if(shape==='sculpt'){
      for(var t1=1;t1<=T;t1++){ DS[t1]=CF[t1]/K; D+=DS[t1]/Math.pow(1+r,t1); }
    } else {
      var worst=Infinity; for(var t2=1;t2<=T;t2++) worst=Math.min(worst,CF[t2]);
      var level=worst/K;
      for(var t3=1;t3<=T;t3++) DS[t3]=level;
      var af=(1-Math.pow(1+r,-T))/r; D=level*af;
    }

    /* --- amortisation schedule --- */
    var bal=[], intst=[], prin=[], wal=0;
    bal[0]=D;
    for(var t4=1;t4<=T;t4++){
      intst[t4]=r*bal[t4-1];
      prin[t4]=Math.min(Math.max(0,DS[t4]-intst[t4]), bal[t4-1]);
      bal[t4]=bal[t4-1]-prin[t4];
      wal+=t4*prin[t4];
    }
    wal=D>0? wal/D : 0;

    /* --- coverage stats --- */
    var minD=Infinity, sumD=0, pvCF=0;
    for(var t5=1;t5<=T;t5++){
      var d=DS[t5]>0? CF[t5]/DS[t5] : Infinity;
      minD=Math.min(minD,d); sumD+=d;
      pvCF+=CF[t5]/Math.pow(1+r,t5);
    }
    var llcr=D>0? pvCF/D : NaN;

    /* --- refinancing at year R: re-sculpt the remaining CFADS at the new rate --- */
    var refi=null;
    if(R>=1 && R<T){
      var D2=0; for(var t6=R+1;t6<=T;t6++) D2+=(CF[t6]/K)/Math.pow(1+r2,t6-R);
      refi={year:R, newDebt:D2, oldBal:bal[R], release:D2-bal[R]};
    }

    render({T:T,CF:CF,DS:DS,intst:intst,prin:prin,bal:bal,D:D,cost:cost,
      minD:minD,avgD:sumD/T,llcr:llcr,wal:wal,shape:shape,K:K,refi:refi,ds1:DS[1]});
  }

  function render(m){
    el('pfoDebt').textContent='$'+fmt(m.D)+'m';
    el('pfoGear').textContent=Math.round(m.D/m.cost*100)+'%';
    el('pfoDSCR').textContent=(isFinite(m.minD)?m.minD.toFixed(2):'—')+'×';
    el('pfoLLCR').textContent=(isFinite(m.llcr)?m.llcr.toFixed(2):'—')+'×';
    el('pfoWAL').textContent=m.wal.toFixed(1)+' yrs';
    el('pfoRefi').textContent=m.refi? (m.refi.release>=0?'+$':'−$')+fmt(Math.abs(m.refi.release))+'m' : 'off';
    el('pfoRefiS').textContent=m.refi? 'released at the year-'+m.refi.year+' refi' : 'set a refi year to size it';
    var eq=Math.max(0,m.cost-m.D);
    el('pfSum').innerHTML=
      '<span><span class="lbl">Project cost</span> <b>$'+fmt(m.cost)+'m</b></span>'+
      '<span><span class="lbl">Senior debt</span> <b>$'+fmt(m.D)+'m</b></span>'+
      '<span><span class="lbl">Equity cheque</span> <b>$'+fmt(eq)+'m</b></span>'+
      '<span><span class="lbl">Year-1 debt service</span> <b>$'+fmt(m.ds1)+'m</b></span>'+
      '<span><span class="lbl">Structure</span> <b>'+(m.shape==='sculpt'?'sculpted to '+m.K.toFixed(2)+'×':'level annuity at '+m.K.toFixed(2)+'× worst year')+'</b></span>'+
      (m.refi? '<span><span class="lbl">Refi</span> <b>$'+fmt(m.refi.newDebt)+'m new facility vs $'+fmt(m.refi.oldBal)+'m outstanding</b></span>':'');
    draw(m);
  }

  /* --- canvas: CFADS bars, stacked debt service, balance rundown --- */
  function draw(m){
    var cv=el('pfcv'); if(!cv) return;
    var dpr=window.devicePixelRatio||1;
    var W=cv.clientWidth||860, H=cv.clientHeight||300;
    cv.width=W*dpr; cv.height=H*dpr;
    var x0=46,x1=W-14,y0=26,y1=H-34;
    var ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,H);
    var T=m.T, maxV=1;
    for(var t=1;t<=T;t++) maxV=Math.max(maxV,m.CF[t]);
    maxV*=1.12;
    var maxB=Math.max(1,m.D);
    function X(t){ return x0+(t-0.5)*(x1-x0)/T; }
    function Y(v){ return y1-(v/maxV)*(y1-y0); }
    function YB(v){ return y1-(v/maxB)*(y1-y0)*0.92; }
    var bw=Math.max(3,(x1-x0)/T*0.56);

    /* gridlines + axis */
    ctx.strokeStyle='#e4e8e6'; ctx.lineWidth=1; ctx.fillStyle='#889390';
    ctx.font='10px Inter,sans-serif'; ctx.textAlign='right';
    for(var i=0;i<=4;i++){ var v=maxV/1.12*i/4; var y=Y(v);
      ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x1,y); ctx.stroke();
      ctx.fillText(Math.round(v),x0-6,y+3); }

    /* CFADS bars */
    for(var t2=1;t2<=T;t2++){
      ctx.fillStyle='rgba(12,107,79,0.18)';
      ctx.fillRect(X(t2)-bw/2, Y(m.CF[t2]), bw, y1-Y(m.CF[t2]));
    }
    /* debt service stacked: interest (dark) + principal (mid) */
    for(var t3=1;t3<=T;t3++){
      var xi=X(t3)-bw/2;
      var yInt=Y(m.intst[t3]);
      ctx.fillStyle='#0c4433';
      ctx.fillRect(xi,yInt,bw,y1-yInt);
      var yPr=Y(m.intst[t3]+m.prin[t3]);
      ctx.fillStyle='#0c6b4f';
      ctx.fillRect(xi,yPr,bw,yInt-yPr);
    }
    /* balance rundown line (scaled to debt) */
    ctx.strokeStyle='#bc4733'; ctx.lineWidth=2; ctx.beginPath();
    for(var t4=0;t4<=T;t4++){ var x=t4===0?x0:X(t4), y=YB(m.bal[t4]); t4===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }
    ctx.stroke();
    /* refi marker */
    if(m.refi){ var xr=X(m.refi.year);
      ctx.strokeStyle='#9a7b3f'; ctx.setLineDash([4,4]); ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(xr,y0-4); ctx.lineTo(xr,y1); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#9a7b3f'; ctx.textAlign='center'; ctx.font='600 10px Inter,sans-serif';
      ctx.fillText('REFI',xr,y0-8);
    }
    /* x labels */
    ctx.fillStyle='#889390'; ctx.textAlign='center'; ctx.font='10px Inter,sans-serif';
    var step=T>24?5:(T>12?4:2);
    for(var t5=1;t5<=T;t5++) if(t5===1||t5===T||t5%step===0) ctx.fillText(t5,X(t5),y1+14);
    ctx.textAlign='left';
    ctx.fillText('years',x1-32,y1+26);
  }

  ['pfCFADS','pfG','pfTenor','pfRate','pfDSCR','pfCost','pfRefiY','pfRefiR'].forEach(function(id){
    var e=el(id); if(e) e.addEventListener('input',compute); });
  var sh=el('pfShape'); if(sh) sh.addEventListener('change',compute);
  window.addEventListener('resize',function(){ compute(); });
  compute();
})();
