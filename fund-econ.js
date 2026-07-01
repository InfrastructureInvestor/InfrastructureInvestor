/* Fund economics, the LP/GP layer: commitments are drawn into deals over the
   investment period, deals yield and exit, and the proceeds run through fees
   and a European (whole-of-fund) distribution waterfall, return of capital,
   preferred return, GP catch-up, then the carry split. Outputs the gross-to-net
   bridge, LP net IRR/MOIC, GP economics and the J-curve. Illustrative $m. */
(function(){
  var el=function(id){ return document.getElementById(id); };
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function fmt(v){ var n=Math.round(v); var neg=n<0; n=Math.abs(n);
    var s=n.toLocaleString('en-US'); return neg?'('+s+')':s; }
  function pctTxt(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }
  function irr(cf){ var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi); if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<160;k++){ var mid=(lo+hi)/2,fm=f(mid); if(flo*fm<=0){hi=mid;}else{lo=mid;flo=fm;} } return (lo+hi)/2; }

  function compute(){
    var F   = gv('fSize');                             // committed capital, $m
    var IP  = Math.max(1, Math.round(gv('fIP')));      // investment period, yrs
    var H   = Math.max(1, Math.round(gv('fHold')));    // per-deal hold, yrs
    var feeI= gv('fFeeI')/100;                         // fee on committed, during IP
    var feeO= gv('fFeeO')/100;                         // fee on invested cost, after IP
    var exp = gv('fExp')/100;                          // fund expenses, on committed p.a.
    var y   = gv('fYield')/100;                        // deal cash yield on cost
    var xm  = gv('fExitM');                            // deal exit proceeds, × cost
    var c   = Math.max(0, Math.min(0.5, gv('fCarry')/100));   // carried interest
    var h   = gv('fHurdle')/100;                       // preferred return
    var s   = Math.max(0, Math.min(80, gv('fCoinv')))/100;    // co-invest share of exposure

    var T = IP + H;                                    // last vintage exits at IP+H

    /* --- solve for investable capital: commitments fund deals AND fees.
       phi[t] = invested cost outstanding in year t per $1 of deployable capital */
    var phi=[], post=0;
    for(var t=1;t<=T;t++){
      var frac=0;
      for(var v=1;v<=IP;v++){ if(t>=v && t<v+H) frac+=1/IP; }
      phi[t]=frac;
      if(t>IP) post+=frac;
    }
    var feesFixed = F*feeI*IP + F*exp*T;               // committed-based fees & expenses
    var I0 = Math.max(0,(F - feesFixed)/(1 + feeO*post));  // deployable into deals
    var tranche = I0/IP;

    /* --- yearly cash flows (t = 0..T) --- */
    var N=T, contrib=[], dealIn=[], fees=[];
    for(var t2=0;t2<=N;t2++){ contrib[t2]=0; dealIn[t2]=0; fees[t2]=0; }
    for(var v2=1;v2<=IP;v2++){
      contrib[v2]+=tranche;
      for(var k2=v2;k2<v2+H && k2<=N;k2++) dealIn[k2]+= (k2===v2+H-1? tranche*xm : 0) + tranche*y;
    }
    for(var t3=1;t3<=N;t3++){
      fees[t3] = (t3<=IP ? F*feeI : I0*phi[t3]*feeO) + F*exp;
      contrib[t3]+=fees[t3];                           // fees are drawn from commitments
    }

    /* --- European (whole-of-fund) waterfall on distributions --- */
    var unret=0, prefBal=0, profLP=0, profGP=0, cumFees=0;
    var lpCF=[], distLP=[], distGP=[];
    for(var t4=0;t4<=N;t4++){ lpCF[t4]=0; distLP[t4]=0; distGP[t4]=0; }
    for(var t5=1;t5<=N;t5++){
      unret+=contrib[t5]; cumFees+=fees[t5];
      var avail=dealIn[t5], toLP=0, toGP=0, x;
      x=Math.min(avail,unret); unret-=x; avail-=x; toLP+=x;                    // 1 return capital
      x=Math.min(avail,prefBal); prefBal-=x; avail-=x; toLP+=x; profLP+=x;     // 2 preferred return
      var need=c<1? Math.max(0, c/(1-c)*profLP - profGP) : 0;                  // 3 GP catch-up (100%)
      x=Math.min(avail,need); profGP+=x; avail-=x; toGP+=x;
      toLP+=avail*(1-c); toGP+=avail*c;                                        // 4 carry split
      profLP+=avail*(1-c); profGP+=avail*c;
      distLP[t5]=toLP; distGP[t5]=toGP;
      lpCF[t5]= toLP - contrib[t5];
      prefBal = prefBal*(1+h) + unret*h;               // pref accrues on capital outstanding
    }

    /* --- gross (deal-level) and net (LP) measures --- */
    var gCF=[0], nCF=[0];
    for(var t6=1;t6<=N;t6++){ gCF[t6]=dealIn[t6]-(t6<=IP?tranche:0); nCF[t6]=lpCF[t6]; }
    var grossIRR=irr(gCF), netIRR=irr(nCF);
    var grossIn=dealIn.reduce(function(a,b){return a+b;},0);
    var grossMOIC=I0>0? grossIn/I0 : NaN;
    var drawn=contrib.reduce(function(a,b){return a+b;},0);
    var lpBack=distLP.reduce(function(a,b){return a+b;},0);
    var carry=distGP.reduce(function(a,b){return a+b;},0);
    var netMOIC=drawn>0? lpBack/drawn : NaN;

    /* --- co-invest blend: s% of exposure at no fee / no carry (deal gross) --- */
    var bIRR=netIRR, bMOIC=netMOIC;
    if(s>0 && drawn>0 && I0>0){
      var bCF=[]; for(var t7=0;t7<=N;t7++) bCF[t7]=(1-s)*nCF[t7]/drawn + s*gCF[t7]/I0;
      bIRR=irr(bCF);
      bMOIC=(1-s)*netMOIC + s*grossMOIC;
    }

    render({F:F,I0:I0,N:N,drawn:drawn,cumFees:cumFees,carry:carry,
      grossIRR:grossIRR,grossMOIC:grossMOIC,netIRR:netIRR,netMOIC:netMOIC,
      bIRR:bIRR,bMOIC:bMOIC,s:s,nCF:nCF,lpBack:lpBack});
  }

  function render(m){
    el('foGIRR').textContent=pctTxt(m.grossIRR);
    el('foGM').textContent=isFinite(m.grossMOIC)?m.grossMOIC.toFixed(2)+'×':'—';
    el('foNIRR').textContent=pctTxt(m.netIRR);
    el('foNM').textContent=isFinite(m.netMOIC)?m.netMOIC.toFixed(2)+'×':'—';
    el('foFees').textContent='$'+fmt(m.cumFees)+'m';
    el('foCarry').textContent='$'+fmt(m.carry)+'m';
    el('foSum').innerHTML=
      '<span><span class="lbl">Committed</span> <b>$'+fmt(m.F)+'m</b></span>'+
      '<span><span class="lbl">Deployed into deals</span> <b>$'+fmt(m.I0)+'m</b> ('+Math.round(m.I0/Math.max(1,m.F)*100)+'% of commitments)</span>'+
      '<span><span class="lbl">Total drawn</span> <b>$'+fmt(m.drawn)+'m</b></span>'+
      '<span><span class="lbl">Returned to LPs</span> <b>$'+fmt(m.lpBack)+'m</b></span>'+
      '<span><span class="lbl">Gross-to-net drag</span> <b>'+(isFinite(m.grossIRR)&&isFinite(m.netIRR)?((m.grossIRR-m.netIRR)*100).toFixed(1)+'pt of IRR':'—')+'</b></span>'+
      (m.s>0?'<span><span class="lbl">Blended with '+Math.round(m.s*100)+'% co-invest</span> <b>'+pctTxt(m.bIRR)+' / '+(isFinite(m.bMOIC)?m.bMOIC.toFixed(2)+'×':'—')+'</b></span>':'');

    /* gross-to-net bridge, in multiples of drawn capital so it reconciles:
       net + fees + carry = total value created per $ the LPs actually funded */
    var feeDrag  = m.drawn>0? m.cumFees/m.drawn : 0;
    var carryDrag= m.drawn>0? m.carry/m.drawn : 0;
    drawBridge([
      ['Total value|per $ drawn', m.netMOIC+feeDrag+carryDrag, 'g'],
      ['Management fees|+ fund expenses', -feeDrag, 'r'],
      ['Carried|interest', -carryDrag, 'r'],
      ['Net to LPs|(net MOIC)', m.netMOIC, 'n']
    ]);

    /* J-curve: yearly LP net cash flow */
    var maxAbs=1; m.nCF.forEach(function(v){ maxAbs=Math.max(maxAbs,Math.abs(v)); });
    var ch='<div class="jaxis"></div>'; var step=m.N>14?3:(m.N>9?2:1);
    for(var t=0;t<=m.N;t++){ var cf=m.nCF[t]; var hpx=Math.max(2,Math.abs(cf)/maxAbs*64);
      ch+='<div class="jcol"><div class="jbar '+(cf>=0?'pos':'neg')+'" style="height:'+hpx+'px" title="Yr '+t+': $'+fmt(cf)+'m"></div><span class="jlbl">'+(t%step===0||t===m.N?t:'')+'</span></div>'; }
    el('foChart').innerHTML=ch;
  }

  /* svg waterfall for the gross-to-net bridge */
  function drawBridge(steps){
    var W=600,Hh=190,pad=34,gap=(W-pad*2)/steps.length,bw=gap*0.62;
    var maxV=Math.max.apply(null,steps.map(function(s){return Math.abs(s[1]);}).concat([1.2]));
    var scale=(Hh-64)/maxV, base=Hh-34, run=0, svg='';
    steps.forEach(function(s,i){
      var x=pad+gap*i+(gap-bw)/2, v=s[1];
      var isTotal=(s[2]==='g'||s[2]==='n');
      var y0=isTotal? base : base-run*scale;
      var y1=isTotal? base-v*scale : base-(run+v)*scale;
      var top=Math.min(y0,y1), hh=Math.max(2,Math.abs(y0-y1));
      var fill=s[2]==='g'?'#0c6b4f':(s[2]==='n'?'#094c38':'#bc4733');
      svg+='<rect x="'+x.toFixed(1)+'" y="'+top.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+hh.toFixed(1)+'" rx="3" fill="'+fill+'" opacity="'+(s[2]==='r'?0.85:1)+'"/>';
      svg+='<text x="'+(x+bw/2)+'" y="'+(top-7)+'" text-anchor="middle" font-size="11" font-weight="600" fill="#15201d">'+(v<0?'−':'')+Math.abs(v).toFixed(2)+'×</text>';
      s[0].split('|').forEach(function(ln,li){ svg+='<text x="'+(x+bw/2)+'" y="'+(base+14+li*11)+'" text-anchor="middle" font-size="9.5" fill="#889390">'+ln.trim()+'</text>'; });
      run = isTotal? v : run+v;
    });
    svg+='<line x1="'+pad+'" y1="'+base+'" x2="'+(W-pad)+'" y2="'+base+'" stroke="#d0d7d4" stroke-width="1"/>';
    el('foBridge').innerHTML=svg;
  }

  ['fSize','fIP','fHold','fFeeI','fFeeO','fExp','fYield','fExitM','fCarry','fHurdle','fCoinv'].forEach(function(id){
    var e=el(id); if(e) e.addEventListener('input',compute); });
  compute();
})();
