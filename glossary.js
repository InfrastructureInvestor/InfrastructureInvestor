/* Hover glossary, attaches an accessible tooltip to any element with a
   [data-term] attribute. The definition is taken from the element's own
   data-tip, or looked up in GLOSSARY by the data-term key. Works on hover,
   keyboard focus and touch (tap to toggle). Reusable on any page that loads it. */
(function(){
  var GLOSSARY = {
    /* process & documents */
    'teaser':{t:'Teaser',d:'A short, often anonymised one-pager a seller circulates to gauge buyer interest before opening the process.'},
    'nda':{t:'NDA',d:'Non-disclosure agreement, signed before a buyer receives confidential information such as the Information Memorandum.'},
    'im':{t:'Information Memorandum (IM)',d:'The detailed sale document prepared by the sell-side adviser, setting out the business, financials and investment highlights.'},
    'vdd':{t:'Vendor due diligence (VDD)',d:'Diligence commissioned by the seller (financial, commercial, legal, technical) and shared with all bidders to speed a competitive process and level the field.'},
    'dataroom':{t:'Data room',d:'A secure virtual repository (under a project codename) where the seller discloses contracts, financials and technical records for buyer diligence.'},
    'processletter':{t:'Process letter',d:'The seller’s instructions to bidders, what to submit, in what form, by when, at each round of an auction.'},
    'nbo':{t:'Non-binding offer (NBO)',d:'An indicative first-round bid: a price range, structure, financing approach, conditions and timetable. Not legally committing.'},
    'binding':{t:'Binding offer',d:'A final, committed bid submitted with a marked-up SPA, committed financing and final Investment Committee approval.'},
    'spa':{t:'Sale & Purchase Agreement (SPA)',d:'The contract that transfers ownership, price and mechanism, warranties, indemnities, conditions precedent and completion mechanics.'},
    'staple':{t:'Stapled financing',d:'A pre-arranged debt package the seller’s bank offers to all bidders, to give price certainty and accelerate the process.'},
    'exclusivity':{t:'Exclusivity',d:'A period in which the seller negotiates with one preferred bidder only, usually granted just before signing.'},
    'lockedbox':{t:'Locked-box',d:'A price mechanism fixing equity value to a recent audited "locked-box" balance-sheet date, with no post-completion true-up but a covenant against "leakage" (value leaving the business) to the seller between that date and completion.'},
    'lockedboxdate':{t:'Locked-box date',d:'The historical balance-sheet date the fixed price is struck against. From this date the economic risk and reward pass to the buyer, even though completion is later, so the seller covenants not to extract value ("leakage") in between.'},
    'leakage':{t:'Leakage',d:'Value leaving the target to the seller (dividends, fees, related-party payments) between the locked-box date and completion, prohibited save for "permitted leakage" agreed in the SPA.'},
    'completionaccounts':{t:'Completion accounts',d:'The alternative to locked-box: the price is adjusted after closing for actual net debt and working capital measured at completion.'},
    'wi':{t:'Warranty & indemnity (W&I) insurance',d:'Insurance that backs the seller’s warranties, so the buyer claims against an insurer rather than the seller, giving the seller a clean exit and the buyer a solvent counterparty.'},
    'ecl':{t:'Equity commitment letter (ECL)',d:'A letter from the fund committing the equity cheque, given to the seller (and lenders) as proof of funds at signing.'},
    'cp':{t:'Conditions precedent (CP)',d:'Things that must be satisfied between signing and completion, merger control, regulatory and FDI consents, lender conditions, by a "long-stop" date or the deal can lapse.'},
    'interconditional':{t:'Interconditionality',d:'Linking the SPA and the debt documents so neither completes without the other, the equity and debt fund simultaneously at close.'},
    'fundsflow':{t:'Funds flow',d:'The completion-day statement directing every payment, debt drawn, equity funded, purchase price, fees and repayments, to the right account at the right time.'},
    'longstop':{t:'Long-stop date',d:'The deadline by which all conditions must be met; if they are not, either party may walk away.'},
    'fdi':{t:'Foreign-investment (FDI) screening',d:'Government review of acquisitions of strategic assets on national-security grounds, in the UK under the National Security and Investment Act (NSIA).'},
    'nsia':{t:'National Security and Investment Act',d:'The UK regime requiring mandatory notification and clearance for acquisitions in sensitive sectors, including communications infrastructure.'},
    /* financing */
    'capexfacility':{t:'Capex facility',d:'A committed debt line that can be drawn down in tranches to fund the build programme as homes are passed, alongside a term loan and revolver.'},
    'rcf':{t:'Revolving credit facility (RCF)',d:'A flexible facility that can be drawn, repaid and redrawn, used for working capital and liquidity.'},
    'tlb':{t:'Term Loan B (TLB)',d:'An institutional term loan, typically bullet-repaid and traded in the leveraged-loan market, a common refinancing step as an asset matures.'},
    'uspp':{t:'US private placement (USPP)',d:'Long-dated debt placed privately with US insurance investors, a staple of investment-grade infrastructure financing.'},
    'wbs':{t:'Whole-business securitisation (WBS)',d:'A highly-structured, ring-fenced financing secured on the whole operating business and its cash flows, used by mature, stable infrastructure at scale.'},
    'dscr':{t:'Debt-service-cover ratio (DSCR)',d:'Cash available for debt service ÷ debt service (interest + scheduled principal). Lenders size and covenant the debt to a minimum DSCR.'},
    'icr':{t:'Interest-cover ratio (ICR)',d:'Cash flow ÷ interest. A coverage covenant used where there is little scheduled amortisation.'},
    'gearing':{t:'Gearing / leverage',d:'How much debt the asset carries, measured as net debt ÷ EBITDA, or debt as a % of enterprise value (LTV).'},
    'ltv':{t:'Loan-to-value (LTV)',d:'Net debt as a percentage of enterprise (or asset) value, a sizing and covenant metric alongside DSCR.'},
    'dsra':{t:'Debt-service reserve account (DSRA)',d:'A cash reserve (often 6 months of debt service) the borrower must hold as a liquidity buffer for lenders.'},
    'cashsweep':{t:'Cash sweep',d:'A requirement to use a share of surplus cash to repay debt early before it can be distributed to equity.'},
    'marginratchet':{t:'Margin ratchet',d:'A debt margin that steps down as leverage falls (or a covenant improves), rewarding de-risking.'},
    'commitmentfee':{t:'Commitment fee',d:'A fee paid on the undrawn portion of a committed facility, a real cost of holding capex headroom during the build.'},
    'availabilityperiod':{t:'Availability period',d:'The window during which the capex facility can be drawn to fund the build, after which undrawn commitments are cancelled.'},
    'equitycure':{t:'Equity cure',d:'A contractual right for shareholders to inject equity to remedy a covenant breach, avoiding a default during the build.'},
    'pik':{t:'PIK (payment-in-kind)',d:'Debt whose interest accrues to principal rather than being paid in cash, used at holdco level to avoid straining opco cash during the build.'},
    'holdcoopco':{t:'Holdco / Opco',d:'A holding-company / operating-company structure: senior debt sits at the cash-generating Opco; structurally-subordinated holdco debt and the equity sit above.'},
    'negativecarry':{t:'Negative carry',d:'Paying interest on drawn debt before the asset generates enough cash to cover it, the financing cost of the J-curve.'},
    'hedging':{t:'Hedging',d:'Interest-rate (and any FX) swaps required by lenders to fix a minimum share of debt service against rate moves.'},
    'sourcesuses':{t:'Sources & uses',d:'The funding table at completion: uses (purchase price, fees, capex) on one side, sources (debt, equity) on the other; they must balance.'},
    'equitybridge':{t:'Equity bridge',d:'A short-term facility that funds the equity portion temporarily, repaid when LPs’ capital is drawn, smoothing the equity funding.'},
    /* valuation & returns */
    'ev':{t:'Enterprise value (EV)',d:'The value of the whole business, equity plus net debt. What the asset is worth before financing.'},
    'evebitda':{t:'EV / EBITDA',d:'The headline valuation multiple: enterprise value ÷ EBITDA. Mature fibre infrastructure has cleared in the low-to-high teens.'},
    'evhome':{t:'EV per home passed',d:'Enterprise value ÷ homes passed, the valuation metric for an early-stage network whose EBITDA is still negative or meaningless.'},
    'ebitda':{t:'EBITDA',d:'Earnings before interest, tax, depreciation and amortisation, the cash-operating profit a network throws off.'},
    'buildmultiple':{t:'Build multiple',d:'The total cost to build (and connect) ÷ the mature EBITDA it produces, the implied entry multiple a builder creates the asset at, versus the multiple it can exit on.'},
    'irr':{t:'IRR',d:'Internal rate of return, the time-weighted annual return that sets the net present value of the equity cash flows to zero.'},
    'moic':{t:'MOIC',d:'Multiple on invested capital, total equity proceeds ÷ equity invested (the "money multiple").'},
    'jcurve':{t:'J-curve',d:'The shape of cumulative equity cash flow: deeply negative through the build and lease-up, turning positive as penetration and the exit land.'},
    'dcf':{t:'DCF',d:'Discounted cash-flow valuation, the present value of projected free cash flows (and a terminal value) at the asset’s discount rate.'},
    'hurdle':{t:'Hurdle / preferred return',d:'The minimum IRR LPs must receive before the manager earns carried interest, typically ~8% for infrastructure.'},
    'carry':{t:'Carried interest',d:'The manager’s share (often ~20%) of profits above the hurdle.'},
    'coinvest':{t:'Co-investment',d:'Capital LPs commit alongside the fund into a single deal, used to manage concentration and reduce the fund’s own cheque.'},
    'coreplus':{t:'Core-plus / value-add',d:'Risk-return styles: core-plus takes some volume/build exposure (~9–12% target IRR); value-add takes build/repositioning risk (~12–16%).'},
    /* fibre / telecoms */
    'homespassed':{t:'Homes passed',d:'Premises the network runs past and can connect on demand, the footprint you spend to build.'},
    'homesconnected':{t:'Homes connected',d:'The subset of passed homes actually taking service, what you earn on.'},
    'penetration':{t:'Penetration (take-up)',d:'Homes connected ÷ homes passed. The single biggest driver of fibre returns; break-even is typically ~25–35%.'},
    'arpu':{t:'ARPU',d:'Average revenue per user, monthly revenue per connection. Wholesale ~£10–25; integrated retail higher.'},
    'churn':{t:'Churn',d:'The rate at which connected customers leave, erodes penetration and the value of each cohort.'},
    'wholesale':{t:'Wholesale / open access',d:'Selling capacity to ISPs who retail to consumers, capital-light and neutral, the model most infrastructure capital prefers.'},
    'altnet':{t:'Altnet',d:'An "alternative network" operator building fibre in competition with the incumbent, the fragmented, consolidating UK market.'},
    'overbuild':{t:'Overbuild',d:'A second or third network building the same streets, the core risk: it splits penetration and compresses ARPU.'},
    'pon':{t:'PON (GPON / XGS-PON)',d:'Passive optical network, the point-to-multipoint fibre architecture; XGS-PON is the 10Gbps-symmetric generation.'},
    'ont':{t:'ONT',d:'Optical network terminal, the unit installed in the home at connection, part of the per-activation cost.'},
    'pia':{t:'Physical Infrastructure Access (PIA)',d:'A regulated product letting altnets run fibre through the incumbent’s existing ducts and poles (Openreach PIA in the UK), cutting civils cost.'},
    'wayleave':{t:'Wayleave',d:'A legal right to install and keep equipment on third-party land, assembling the wayleave portfolio is a core legal-diligence item.'},
    'eccode':{t:'Electronic Communications Code',d:'The UK statutory regime governing operators’ rights to install apparatus on land, the basis for wayleaves.'},
    'darkfibre':{t:'Dark fibre',d:'Unlit fibre leased to a customer who provides their own electronics, a wholesale product line.'},
    'pstn':{t:'Copper switch-off (PSTN)',d:'Retirement of the legacy copper phone network (UK PSTN switch-off on 31 January 2027), accelerating migration onto fibre.'},
    'projectgigabit':{t:'Project Gigabit / BDUK',d:'The UK government’s ~£5bn subsidy programme (run by Building Digital UK) to extend gigabit coverage to hard-to-reach premises.'},
    'anchortenant':{t:'Anchor tenant',d:'A large ISP contracted to take wholesale capacity from day one, underpinning early penetration and lender confidence.'},
    'mfn':{t:'Most-favoured-nation (MFN)',d:'A clause guaranteeing a customer pricing no worse than any other, common in wholesale anchor agreements.'},
    /* tax */
    'cir':{t:'Corporate interest restriction',d:'A UK rule capping net interest deductions at ~30% of tax-EBITDA, a binding constraint on how much deductible debt an opco can carry.'},
    'capitalallowances':{t:'Capital allowances',d:'Tax depreciation on qualifying capex (including full expensing for plant) that shelters early taxable profits.'},
    'eurobond':{t:'Quoted Eurobond exemption',d:'A UK exemption removing withholding tax on interest paid on listed debt, routinely used so cross-border lenders are paid gross.'},
    'da':{t:'Depreciation & amortisation',d:'The non-cash write-down of the network’s capital cost over its life, large for fibre, and the main early tax shield.'},
    'qoe':{t:'Quality of earnings (QoE)',d:'Financial diligence testing whether reported EBITDA is real, recurring and clean of one-offs.'},
    'rab':{t:'RAB / RCV',d:'Regulated asset base, the capital a regulator allows a network to earn a return on (relevant to regulated, not greenfield, fibre).'},
    /* take-private & regulated */
    'takeprivate':{t:'Take-private',d:'Acquiring a listed company and de-listing it, taking it from public to private ownership.'},
    'scheme':{t:'Scheme of arrangement',d:'A court-sanctioned procedure (needing ~75% shareholder approval) commonly used to take a UK listed company private; the alternative is a contractual takeover offer.'},
    'irrevocable':{t:'Irrevocable undertakings',d:'Binding commitments from major shareholders to accept an offer, locking up support before a bid is launched.'},
    'breakfee':{t:'Break fee',d:'A fee payable if a deal fails for specified reasons, limited under the UK Takeover Code, more common in financing.'},
    'rabpremium':{t:'Premium / discount to RAB',d:'The price paid for a regulated network expressed against its regulated asset base, buyers routinely pay a premium to RAB for growth and outperformance, or a discount where the framework is under pressure.'},
    'allowedreturn':{t:'Allowed return (WACC)',d:'The cost of capital the regulator lets the network earn on its RAB each price control, the spine of allowed revenue.'},
    'totex':{t:'Totex',d:'Total expenditure (operating + capital) the regulator allows and incentivises efficiency against, sharing out- or under-performance with customers.'},
    'regreset':{t:'Regulatory reset / price control',d:'The periodic (typically 5-year) review at which the regulator re-sets the allowed return, RAB and incentives, the single biggest risk in a regulated buyout.'},
    'notionalgearing':{t:'Notional gearing',d:'The debt/RAB ratio the regulator assumes when setting allowed returns, a benchmark, not your actual leverage.'},
    'odi':{t:'Outcome-delivery incentives (ODIs)',d:'Rewards and penalties tied to service measures (leakage, reliability) that flex allowed revenue around the baseline.'},
    /* distressed */
    'distressed':{t:'Distressed / special situations',d:'Buying an asset under financial stress, over-levered, cash-short or insolvent, at a discount, to fix and consolidate.'},
    'administration':{t:'Administration / insolvency',d:'A formal process where an insolvent company is restructured or sold; buyers may acquire the business and assets out of it free of legacy debt.'},
    'turnaround':{t:'Turnaround',d:'The operational fix, finishing the build, lifting penetration, cutting cost, that re-rates a distressed asset to a normal multiple.'},
    'loantoown':{t:'Loan-to-own',d:'Buying a distressed company’s debt at a discount to convert it into ownership through a restructuring.'},
    /* data centres */
    'poweredland':{t:'Powered land / powered shell',d:'A site with secured grid power (and often a building shell) ready for fit-out, the scarce input in the data-centre boom; power, not land, is the constraint.'},
    'prelet':{t:'Pre-let / pre-lease',d:'Capacity contracted to a customer before (or during) construction, de-risks lease-up and underpins the financing.'},
    'hyperscale':{t:'Hyperscale',d:'Very large data centres built for a single cloud or AI tenant (e.g. the big cloud providers), typically on long leases.'},
    'colocation':{t:'Colocation (colo)',d:'Renting data-centre space and power to many customers, higher-margin and more granular than a single hyperscale lease, but less contracted.'},
    'pue':{t:'PUE',d:'Power usage effectiveness, total facility power ÷ IT power. Lower is more efficient; it drives the operating cost and the deliverable capacity.'},
    'leaseup':{t:'Lease-up',d:'Filling a newly-built data centre with contracted load over time, the data-centre equivalent of fibre’s penetration ramp.'},
    'stabyield':{t:'Stabilised yield-on-cost',d:'Stabilised EBITDA ÷ total development cost, the build yield. The spread over the exit cap rate is the development profit.'},
    'caprate':{t:'Cap rate',d:'The yield a buyer demands, EBITDA ÷ EV, the inverse of the EV/EBITDA multiple. A 6% cap rate ≈ a ~16.7× multiple.'},
    'devspread':{t:'Development spread',d:'The gap between the yield you build at and the yield (cap rate) you exit on, the value a developer creates over buying stabilised.'},
    'interconnection':{t:'Interconnection',d:'The cross-connects and cloud on-ramps linking tenants inside a data centre, sticky, high-margin recurring revenue.'}
  };

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }
  ready(function(){
    var nodes=[].slice.call(document.querySelectorAll('[data-term]'));
    if(!nodes.length) return;
    var tip=document.createElement('div'); tip.className='gtip'; tip.setAttribute('role','tooltip');
    tip.style.display='none'; document.body.appendChild(tip);
    var active=null;
    function defFor(elm){
      if(elm.getAttribute('data-tip')) return {t:elm.textContent, d:elm.getAttribute('data-tip')};
      var g=GLOSSARY[elm.getAttribute('data-term')];
      return g||null;
    }
    function show(elm){
      var d=defFor(elm); if(!d) return; active=elm;
      tip.innerHTML='<span class="gt-term">'+d.t+'</span>'+d.d;
      tip.style.display='block'; tip.style.visibility='hidden';
      var r=elm.getBoundingClientRect(), tw=tip.offsetWidth, th=tip.offsetHeight, pad=8;
      var left=r.left + r.width/2 - tw/2;
      left=Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
      var top=r.top - th - 10;                       // above by default
      tip.classList.remove('below');
      if(top < pad){ top=r.bottom + 10; tip.classList.add('below'); }   // flip below if no room
      tip.style.left=Math.round(left)+'px'; tip.style.top=Math.round(top)+'px';
      tip.style.visibility='visible';
    }
    function hide(){ tip.style.display='none'; active=null; }
    nodes.forEach(function(elm){
      elm.setAttribute('tabindex','0');
      elm.setAttribute('role','button');
      elm.setAttribute('aria-label', (defFor(elm)||{}).t || elm.textContent);
      elm.addEventListener('mouseenter',function(){ show(elm); });
      elm.addEventListener('mouseleave',function(){ if(active===elm) hide(); });
      elm.addEventListener('focus',function(){ show(elm); });
      elm.addEventListener('blur',function(){ if(active===elm) hide(); });
      elm.addEventListener('click',function(e){ e.preventDefault(); if(active===elm) hide(); else show(elm); });
    });
    window.addEventListener('scroll',function(){ if(active) hide(); }, true);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') hide(); });
  });
})();
