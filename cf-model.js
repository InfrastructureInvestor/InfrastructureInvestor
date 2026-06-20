/* Cash-flow & DCF model, a generic, asset-aware projection + DCF template.
   Pick an asset type; every major revenue and cost line is a slider. The model
   builds a year-by-year projection (line items down, years across) and a DCF:
   unlevered/levered IRR, NPV at the discount rate, equity multiple and payback.
   All figures are illustrative ($m), not a forecast of any specific asset. */
(function(){
  /* ===================================================================
     ASSET PRESETS, revenue lines, cost lines (Year-1 $m) + assumptions.
     Consistent format across types; line items chosen to suit each asset.
  =================================================================== */
  var ASSETS={
    airport:{ name:'Airport',
      rev:[['Aeronautical charges',640],['Retail concessions',260],['Car parking',180],['Property & other',90]],
      cost:[['Staff',210],['Security & screening',120],['Maintenance',90],['Utilities',70],['Admin & overhead',80]],
      a:{years:10,revG:4,costG:3,tax:25,capex:12,da:9,wacc:8,entry:14,exit:14,lev:5,rd:5,amort:0},
      note:'Dual-till airport: regulated aero charges plus higher-margin commercial income (retail, parking, property).' },

    port:{ name:'Container port',
      rev:[['Container handling',520],['Storage & demurrage',120],['Reefer & special',90],['Land lease & other',110]],
      cost:[['Labour',140],['Equipment & maintenance',110],['Concession fee',60],['Power',50],['Admin',40]],
      a:{years:10,revG:3,costG:3,tax:25,capex:8,da:7,wacc:8,entry:12,exit:12,lev:5,rd:5,amort:1},
      note:'Terminal operator: handling tariff per box plus storage, reefer premia and land rent; labour & equipment heavy.' },

    transmission:{ name:'Electricity transmission (RAB)',
      rev:[['Return on RAB',940],['Depreciation recovery',770],['Opex allowance',700],['Incentives',70]],
      cost:[['Network O&M',320],['Faults & outages',140],['System operation',110],['Admin',130]],
      a:{years:10,revG:4,costG:3,tax:25,capex:40,da:31,wacc:6,entry:10,exit:10,lev:6,rd:5,amort:1},
      note:'Regulated network: allowed revenue = return on RAB + depreciation + opex allowance + incentives. Capex is high (RAB grows).' },

    toll:{ name:'Toll road',
      rev:[['Light-vehicle tolls',320],['Heavy-vehicle tolls',150],['Services & other',30]],
      cost:[['Operations & tolling',60],['Routine maintenance',50],['Admin',30]],
      a:{years:10,revG:3,costG:3,tax:25,capex:6,da:8,wacc:8,entry:18,exit:18,lev:6,rd:5,amort:1},
      note:'Toll concession: traffic × tariff by vehicle class; very high margin, long life, light operating cost.' },

    datacentre:{ name:'Data centre',
      rev:[['Colocation & space rent',230],['Power pass-through',120],['Cross-connects',30],['Other services',20]],
      cost:[['Power',130],['Cooling & maintenance',50],['Staff',30],['Admin',20]],
      a:{years:10,revG:6,costG:4,tax:25,capex:15,da:10,wacc:8,entry:20,exit:18,lev:5,rd:6,amort:0},
      note:'Colocation: contracted rent per kW plus power pass-through and interconnection; power is the dominant cost.' },

    offshorewind:{ name:'Offshore wind farm',
      rev:[['Energy under CfD / PPA',460],['Merchant power',90],['ROCs & other',30]],
      cost:[['Operations & maintenance',90],['Seabed lease',30],['Insurance',25],['Admin',20]],
      a:{years:12,revG:2,costG:3,tax:25,capex:5,da:20,wacc:7,entry:11,exit:9,lev:6,rd:5,amort:3},
      note:'Generation: mostly contracted (CfD/PPA) revenue with some merchant exposure; no fuel, high depreciation.' },

    socialppp:{ name:'Social PPP (availability)',
      rev:[['Availability payment',190],['Volume / variable',20]],
      cost:[['Hard FM & lifecycle',60],['Soft FM & services',50],['Insurance',12],['Admin',18]],
      a:{years:12,revG:2.5,costG:2.5,tax:25,capex:2,da:5,wacc:7,entry:13,exit:12,lev:8,rd:5,amort:4},
      note:'Availability PPP (hospital/school): a fixed, indexed unitary charge for keeping the asset available; deductions for failures.' },

    water:{ name:'Water utility (RAB)',
      rev:[['Return on RAB',520],['Depreciation recovery',430],['Opex allowance',520],['Incentives (ODIs)',30]],
      cost:[['Treatment & network O&M',300],['Energy & chemicals',110],['Customer & admin',110]],
      a:{years:10,revG:4,costG:3,tax:25,capex:35,da:26,wacc:6,entry:11,exit:11,lev:6,rd:5,amort:1},
      note:'Regulated water: allowed revenue on the RAB; large capex (RAB grows) with outcome-delivery incentives (ODIs).' }
  };
  var ORDER=['airport','port','transmission','toll','datacentre','offshorewind','socialppp','water'];

  /* ---------------- helpers ---------------- */
  var el=function(id){ return document.getElementById(id); };
  function fmt(v){ if(v==null) return ''; var n=Math.round(v); var neg=n<0; n=Math.abs(n);
    var s=n.toLocaleString('en-US'); return neg?'('+s+')':s; }
  function gv(id){ var e=el(id); var v=e?parseFloat(e.value):0; return isFinite(v)?v:0; }
  function niceMax(b){ var t=b*2.5; var p=Math.pow(10,Math.floor(Math.log10(Math.max(1,t)))); return Math.ceil(t/p)*p; }
  function step(b){ return b<40?1:(b<200?5:(b<1000?10:25)); }

  var CUR=ASSETS, A=null, revN=0, costN=0;

  /* ---------------- build the line-item sliders for an asset ---------------- */
  function buildSliders(key){
    A=ASSETS[key]; revN=A.rev.length; costN=A.cost.length;
    var rh=''; A.rev.forEach(function(r,i){ var mx=niceMax(r[1]);
      rh+='<div class="cf-line"><span class="cf-l">'+r[0]+'</span><input type="range" id="rev'+i+'" min="0" max="'+mx+'" step="'+step(r[1])+'" value="'+r[1]+'"><span class="cf-v" id="rev'+i+'v">$'+r[1]+'m</span></div>'; });
    el('revLines').innerHTML=rh;
    var ch=''; A.cost.forEach(function(c,i){ var mx=niceMax(c[1]);
      ch+='<div class="cf-line"><span class="cf-l">'+c[0]+'</span><input type="range" id="cost'+i+'" min="0" max="'+mx+'" step="'+step(c[1])+'" value="'+c[1]+'"><span class="cf-v cost" id="cost'+i+'v">$'+c[1]+'m</span></div>'; });
    el('costLines').innerHTML=ch;
    var a=A.a;
    el('aYears').value=a.years; el('aRevG').value=a.revG; el('aCostG').value=a.costG; el('aTax').value=a.tax;
    el('aCapex').value=a.capex; el('aDA').value=a.da; el('aWacc').value=a.wacc; el('aEntry').value=a.entry;
    el('aExit').value=a.exit; el('aLev').value=a.lev; el('aRd').value=a.rd; el('aAmort').value=a.amort;
    el('cfNote').textContent=A.note;
    // wire the line sliders
    A.rev.forEach(function(r,i){ el('rev'+i).addEventListener('input',function(){ el('rev'+i+'v').textContent='$'+el('rev'+i).value+'m'; compute(); }); });
    A.cost.forEach(function(c,i){ el('cost'+i).addEventListener('input',function(){ el('cost'+i+'v').textContent='$'+el('cost'+i).value+'m'; compute(); }); });
  }

  /* ---------------- IRR / NPV ---------------- */
  function irr(cf){ var f=function(r){ return cf.reduce(function(s,c,i){ return s+c/Math.pow(1+r,i); },0); };
    var lo=-0.95,hi=4,flo=f(lo),fhi=f(hi); if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0) return NaN;
    for(var k=0;k<160;k++){ var mid=(lo+hi)/2,fm=f(mid); if(flo*fm<=0){hi=mid;}else{lo=mid;flo=fm;} } return (lo+hi)/2; }
  function pctTxt(x){ return isFinite(x)?(x*100).toFixed(1)+'%':'—'; }

  /* ---------------- compute the projection + DCF ---------------- */
  function compute(){
    if(!A) return;
    var N=Math.max(3,Math.min(20,Math.round(gv('aYears'))));
    var revG=gv('aRevG')/100, costG=gv('aCostG')/100, tax=gv('aTax')/100, capexP=gv('aCapex')/100, daP=gv('aDA')/100;
    var wacc=gv('aWacc')/100, entryM=gv('aEntry'), exitM=gv('aExit'), lev=gv('aLev'), rd=gv('aRd')/100, amort=gv('aAmort')/100;

    // line-item base values from sliders
    var revBase=[]; for(var i=0;i<revN;i++) revBase.push(gv('rev'+i));
    var costBase=[]; for(var j=0;j<costN;j++) costBase.push(gv('cost'+j));

    // per-year arrays (index 1..N)
    function grow(b,g,t){ return b*Math.pow(1+g,t-1); }
    var revV=revBase.map(function(){return [];}), costV=costBase.map(function(){return [];});
    var totRev=[],totOpex=[],ebitda=[],da=[],ebit=[],taxA=[],capexA=[],uCore=[],interest=[],princ=[],eCore=[],disc=[],pv=[];
    var eb1=0;
    for(var t=1;t<=N;t++){
      var tr=0; for(var r=0;r<revN;r++){ var v=grow(revBase[r],revG,t); revV[r][t]=v; tr+=v; }
      var to=0; for(var c=0;c<costN;c++){ var w=grow(costBase[c],costG,t); costV[c][t]=w; to+=w; }
      totRev[t]=tr; totOpex[t]=to; ebitda[t]=tr-to;
      da[t]=daP*tr; ebit[t]=ebitda[t]-da[t]; capexA[t]=capexP*tr;
      taxA[t]=tax*Math.max(0,ebit[t]);
      uCore[t]=ebitda[t]-taxA[t]-capexA[t];
      if(t===1) eb1=ebitda[1];
    }
    var entryEV=entryM*eb1, debt0=Math.max(0,Math.min(lev*eb1, entryEV*0.9)), equity0=entryEV-debt0;
    var debtBal=debt0, amortAmt=amort*debt0;
    for(var t2=1;t2<=N;t2++){
      interest[t2]=rd*debtBal; princ[t2]=Math.min(amortAmt,debtBal);
      var ebt=ebit[t2]-interest[t2], taxL=tax*Math.max(0,ebt);
      eCore[t2]=ebitda[t2]-taxL-capexA[t2]-interest[t2]-princ[t2];
      debtBal=Math.max(0,debtBal-princ[t2]);
      disc[t2]=1/Math.pow(1+wacc,t2);
    }
    var exitEV=exitM*ebitda[N], exitEq=exitEV-debtBal;
    // cash-flow vectors for IRR/NPV (entry at t0; exit added at N)
    var uCF=[-entryEV], eCF=[-equity0];
    for(var t3=1;t3<=N;t3++){ uCF.push(uCore[t3]+(t3===N?exitEV:0)); eCF.push(eCore[t3]+(t3===N?exitEq:0)); }
    // PV row (includes -entry at t0)
    pv[0]=-entryEV; var npv=-entryEV;
    for(var t4=1;t4<=N;t4++){ pv[t4]=(uCore[t4]+(t4===N?exitEV:0))*disc[t4]; npv+=pv[t4]; }
    var distrib=eCF.slice(1).reduce(function(a,b){return a+b;},0), moic=equity0>0?distrib/equity0:NaN;
    // payback (unlevered, undiscounted)
    var cum=-entryEV, pb=null; for(var t5=1;t5<=N;t5++){ cum+=uCF[t5]; if(pb===null&&cum>=0) pb=t5; }
    var avgM=0; for(var t6=1;t6<=N;t6++) avgM+=ebitda[t6]/Math.max(1,totRev[t6]); avgM/=N;

    render({N:N,revV:revV,costV:costV,totRev:totRev,totOpex:totOpex,ebitda:ebitda,da:da,ebit:ebit,tax:taxA,
      capex:capexA,uCore:uCore,interest:interest,princ:princ,eCore:eCore,disc:disc,pv:pv,
      entryEV:entryEV,debt0:debt0,equity0:equity0,exitEV:exitEV,exitEq:exitEq,
      uIRR:irr(uCF),eIRR:irr(eCF),npv:npv,moic:moic,pb:pb,avgM:avgM,uCF:uCF});
  }

  /* ---------------- render the grid, outputs and chart ---------------- */
  function render(m){
    var N=m.N;
    // ----- output cards -----
    el('oUIRR').textContent=pctTxt(m.uIRR); el('oLIRR').textContent=pctTxt(m.eIRR);
    el('oNPV').textContent='$'+fmt(m.npv)+'m'; el('oMOIC').textContent=isFinite(m.moic)?m.moic.toFixed(2)+'×':'—';
    el('oPB').textContent=m.pb?m.pb+' yrs':'>'+N+' yrs'; el('oMargin').textContent=Math.round(m.avgM*100)+'%';
    el('cfSum').innerHTML=
      '<span><span class="lbl">Entry EV</span> <b>$'+fmt(m.entryEV)+'m</b> ('+gv('aEntry')+'× Yr1 EBITDA)</span>'+
      '<span><span class="lbl">Debt</span> <b>$'+fmt(m.debt0)+'m</b> ('+Math.round(m.debt0/Math.max(1,m.entryEV)*100)+'% gearing)</span>'+
      '<span><span class="lbl">Equity</span> <b>$'+fmt(m.equity0)+'m</b></span>'+
      '<span><span class="lbl">Exit EV</span> <b>$'+fmt(m.exitEV)+'m</b></span>'+
      '<span><span class="lbl">Discount rate</span> <b>'+gv('aWacc')+'%</b></span>';

    // ----- projection grid (rows = line items, cols = years) -----
    function head(){ var h='<tr><th class="cf-rowlab">Line item · $m</th><th>Entry</th>'; for(var t=1;t<=N;t++) h+='<th>Yr '+t+'</th>'; return h+'</tr>'; }
    function row(label,arr,opt){ opt=opt||{};
      var tr='<tr class="'+(opt.cls||'')+'"><td class="cf-rowlab">'+label+'</td>';
      tr+='<td>'+(opt.entry!=null?cell(opt.entry,opt):'')+'</td>';
      for(var t=1;t<=N;t++){ var v=arr?arr[t]:null; tr+='<td>'+(v==null?(opt.blank?'':'—'):cell(v,opt))+'</td>'; }
      return tr+'</tr>'; }
    function cell(v,opt){ var neg=v<0||opt.neg; var cls=neg?'cf-neg':''; return '<span class="'+cls+'">'+fmt(opt.neg?-Math.abs(v):v)+'</span>'; }

    var g=head();
    g+='<tr class="cf-sec"><td class="cf-rowlab" colspan="'+(N+2)+'">REVENUE</td></tr>';
    A.rev.forEach(function(r,i){ g+=row(r[0],m.revV[i],{blank:true}); });
    g+=row('Total revenue',m.totRev,{cls:'cf-tot'});
    g+='<tr class="cf-sec"><td class="cf-rowlab" colspan="'+(N+2)+'">OPERATING COSTS</td></tr>';
    A.cost.forEach(function(c,i){ g+=row(c[0],m.costV[i],{neg:true,blank:true}); });
    g+=row('Total operating costs',m.totOpex,{cls:'cf-tot',neg:true});
    g+=row('EBITDA',m.ebitda,{cls:'cf-eb'});
    g+=row('Depreciation',m.da,{neg:true,blank:true});
    g+=row('EBIT',m.ebit,{});
    g+=row('Tax',m.tax,{neg:true,blank:true});
    g+=row('Maintenance capex',m.capex,{neg:true,blank:true});
    g+=row('Unlevered free cash flow',m.uCore,{cls:'cf-tot',entry:-m.entryEV});
    var exitRow=[]; exitRow[N]=m.exitEV; g+=row('Exit proceeds (EV)',exitRow,{blank:true});
    g+=row('Discount factor @ WACC',m.disc,{cls:'cf-mut',blank:true,dec:true});
    // discount factor needs decimals, handle specially
    g+=row('PV of unlevered FCF',m.pv,{cls:'cf-tot',entry:-m.entryEV});
    g+='<tr class="cf-sec"><td class="cf-rowlab" colspan="'+(N+2)+'">FINANCING</td></tr>';
    g+=row('Interest',m.interest,{neg:true,blank:true});
    g+=row('Debt repayment',m.princ,{neg:true,blank:true});
    g+=row('Levered (equity) cash flow',m.eCore,{cls:'cf-eq',entry:-m.equity0});
    el('cfGrid').innerHTML=g;
    // overwrite discount-factor row with 2dp values
    fixDisc(m);

    // ----- cash-flow chart (years on x) -----
    var maxAbs=Math.max.apply(null,m.uCF.map(Math.abs).concat([1]));
    var ch='<div class="jaxis"></div>'; var step=N>14?3:(N>9?2:1);
    m.uCF.forEach(function(cf,t){ var h=Math.max(2,Math.abs(cf)/maxAbs*64);
      var cls=cf>=0?(t===N?'pos exit':'pos'):'neg';
      ch+='<div class="jcol"><div class="jbar '+cls+'" style="height:'+h+'px" title="Yr '+t+': $'+fmt(cf)+'m"></div><span class="jlbl">'+(t%step===0||t===N?t:'')+'</span></div>'; });
    el('cfChart').innerHTML=ch;
  }
  function fixDisc(m){
    // the discount-factor row prints as integers by default; replace with 2dp
    var rows=el('cfGrid').querySelectorAll('tr');
    for(var i=0;i<rows.length;i++){ var lab=rows[i].querySelector('.cf-rowlab');
      if(lab && lab.textContent.indexOf('Discount factor')===0){ var tds=rows[i].querySelectorAll('td');
        for(var t=1;t<=m.N;t++){ if(tds[t+1]) tds[t+1].innerHTML='<span class="cf-mut">'+m.disc[t].toFixed(2)+'</span>'; }
        tds[1].innerHTML='<span class="cf-mut">1.00</span>'; break; } }
  }

  /* ---------------- wiring ---------------- */
  ['aYears','aRevG','aCostG','aTax','aCapex','aDA','aWacc','aEntry','aExit','aLev','aRd','aAmort'].forEach(function(id){
    var e=el(id); if(e) e.addEventListener('input',compute); });
  var sel=el('cfAsset');
  function load(key){ buildSliders(key); compute(); }
  if(sel) sel.addEventListener('change',function(){ load(sel.value); });
  var reset=el('cfReset'); if(reset) reset.addEventListener('click',function(){ load(sel?sel.value:'airport'); });
  load(sel&&ASSETS[sel.value]?sel.value:'airport');
})();
