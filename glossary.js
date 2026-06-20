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
    'evebitda':{t:'EV / EBITDA',d:'The headline valuation multiple: enterprise value ÷ EBITDA. Mature fibre infrastructure has cleared in the low-to-high teens.',a:['EV/EBITDA','EV / EBITDA']},
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
    'allowedreturn':{t:'Allowed return (WACC)',d:'The cost of capital the regulator lets the network earn on its RAB each price control, the spine of allowed revenue.',a:['allowed return']},
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
    'interconnection':{t:'Interconnection',d:'The cross-connects and cloud on-ramps linking tenants inside a data centre, sticky, high-margin recurring revenue.'},
    /* ===== general infrastructure finance & returns ===== */
    'wacc':{t:'WACC',d:'Weighted average cost of capital, the blended cost of debt and equity used to discount an asset’s cash flows.',a:['WACC','weighted average cost of capital']},
    'npv':{t:'Net present value (NPV)',d:'The value today of a stream of future cash flows discounted at the cost of capital, less the upfront cost.',a:['NPV','net present value']},
    'discountrate':{t:'Discount rate',d:'The rate used to convert future cash flows into present value, reflecting the time value of money and risk.',a:['discount rate']},
    'terminalvalue':{t:'Terminal value',d:'The assumed value of an asset at the end of an explicit forecast, often the largest single component of a DCF.',a:['terminal value']},
    'opex':{t:'Opex',d:'Operating expenditure, the day-to-day cost of running an asset (staff, maintenance, energy), as opposed to capital spend.',a:['opex','operating expenditure']},
    'capex':{t:'Capex',d:'Capital expenditure, money spent building or upgrading long-lived assets, the core of an infrastructure investment programme.',a:['capex','capital expenditure']},
    'offtake':{t:'Offtake / offtaker',d:'A contracted buyer of an asset’s output (power, gas, capacity); a strong offtake underpins revenue and financing.',a:['offtake','offtaker','offtake agreement']},
    'ppa':{t:'Power-purchase agreement (PPA)',d:'A long-term contract to sell electricity at an agreed price, the contracted revenue that de-risks a renewables project.',a:['PPA','power-purchase agreement','power purchase agreement']},
    'cfd':{t:'Contract for Difference (CfD)',d:'A UK support scheme paying generators the difference between a fixed “strike price” and the market price, giving stable revenue.',a:['CfD','CfDs','Contract for Difference','contracts for difference']},
    'roc':{t:'Renewables Obligation Certificate (ROC)',d:'A legacy UK green subsidy: tradable certificates issued per MWh of renewable generation.',a:['ROC','ROCs','Renewables Obligation']},
    'rego':{t:'REGO',d:'Renewable Energy Guarantees of Origin, certificates proving a unit of power came from renewable sources.',a:['REGO','REGOs']},
    'fit':{t:'Feed-in tariff',d:'A fixed per-unit payment for renewable generation, used to support early or small-scale projects.',a:['feed-in tariff','feed in tariff']},
    'lcoe':{t:'LCOE',d:'Levelised cost of energy, the lifetime cost of a project divided by lifetime output, the break-even price per MWh.',a:['LCOE','levelised cost of energy','levelized cost of energy']},
    'merchant':{t:'Merchant revenue',d:'Output sold at the open-market price with no fixed contract, higher upside but exposed to price risk.',a:['merchant','merchant power','merchant revenue']},
    'concession':{t:'Concession',d:'A long-term right granted (often by government) to build and/or operate an asset and collect its revenues for a set period.',a:['concession','concession agreement']},
    'ppp':{t:'Public-private partnership (PPP)',d:'A long-term contract where private capital finances, builds and operates public infrastructure for availability or usage payments.',a:['PPP','PPPs','public-private partnership']},
    'pfi':{t:'Private Finance Initiative (PFI)',d:'The UK’s PPP model: a private SPV designs, builds, finances and maintains a public asset for a unitary charge. PF2 is its successor.',a:['PFI','Private Finance Initiative','PF2']},
    'dbfo':{t:'DBFO',d:'Design-Build-Finance-Operate, a PPP structure where one party is responsible across the whole asset lifecycle.',a:['DBFO','design-build-finance-operate']},
    'spv':{t:'Special-purpose vehicle (SPV)',d:'A ring-fenced company set up to own a single project, isolating its assets, debt and cash flows.',a:['SPV','special-purpose vehicle','special purpose vehicle','ProjectCo']},
    'unitarycharge':{t:'Unitary charge',d:'The single periodic payment a public authority makes to a PFI/PPP provider, covering finance, maintenance and services, subject to deductions.',a:['unitary charge','unitary payment']},
    'availabilitypayment':{t:'Availability payment',d:'Revenue paid for keeping an asset available to a required standard, regardless of how much it is used, removing demand risk.',a:['availability payment','availability-based','availability based']},
    'demandrisk':{t:'Demand / volume risk',d:'The risk that usage (traffic, throughput, volumes) falls short of forecast, the key variable in user-pays infrastructure.',a:['demand risk','volume risk','traffic risk']},
    'shadowtoll':{t:'Shadow toll',d:'A per-user payment made by government (not the user) to the operator, linking revenue to usage without charging the public directly.',a:['shadow toll']},
    'rampup':{t:'Ramp-up',d:'The period after opening when usage and revenue build towards a mature run-rate, a high-risk phase for demand-based assets.',a:['ramp-up','ramp up']},
    'indexation':{t:'Inflation indexation',d:'Linking revenues (or the RAB) to an inflation index such as RPI or CPIH, a defining feature of infrastructure’s inflation protection.',a:['indexation','inflation-linked','index-linked','RPI','CPIH']},
    'brownfield':{t:'Brownfield',d:'An existing, operating asset with an established track record, lower risk and lower return than greenfield.',a:['brownfield']},
    'greenfield':{t:'Greenfield',d:'A new asset still to be built, carrying construction and ramp-up risk in exchange for higher return.',a:['greenfield']},
    'coreinfra':{t:'Core infrastructure',d:'Mature, monopolistic, contracted or regulated assets with stable, inflation-linked cash flows, the lowest-risk infrastructure style.',a:['core infrastructure','core asset']},
    'handback':{t:'Handback',d:'Returning a concession asset to the public authority at the end of the contract, in a contractually-specified condition.',a:['handback','hand-back']},
    'lifecycle':{t:'Lifecycle cost',d:'The cost of major periodic renewals (roofs, plant, track) over a concession, reserved so the asset meets handback standards.',a:['lifecycle','lifecycle cost','life-cycle']},
    'fm':{t:'Facilities management (FM)',d:'Operating services under a PPP: “hard FM” is building fabric and plant, “soft FM” is cleaning, catering and security.',a:['facilities management','hard FM','soft FM']},
    'costofequity':{t:'Cost of equity',d:'The return equity investors require for the risk they take, the more expensive component of WACC.',a:['cost of equity']},
    'costofdebt':{t:'Cost of debt',d:'The interest rate paid on borrowings, the cheaper, tax-deductible component of WACC.',a:['cost of debt']},
    'capitalrecycling':{t:'Capital recycling',d:'Selling mature, de-risked assets to fund new development, a core strategy for listed and fund infrastructure investors.',a:['capital recycling','asset recycling']},
    'gp':{t:'General partner (GP)',d:'The fund manager that raises and runs a closed-end fund, makes investment decisions and earns fees and carry.',a:['general partner']},
    'lp':{t:'Limited partner (LP)',d:'An investor (pension fund, insurer, sovereign fund) that commits capital to a fund but is not involved in day-to-day management.',a:['limited partner','LPs']},
    'aum':{t:'AUM',d:'Assets under management, the total capital a manager oversees, a headline measure of scale.',a:['AUM','assets under management']},
    'drypowder':{t:'Dry powder',d:'Capital that has been committed to a fund but not yet invested, available for new deals.',a:['dry powder']},
    'vintage':{t:'Vintage',d:'The year a fund starts investing; vintage shapes returns because it sets the entry environment and pricing.',a:['vintage']},
    'closedend':{t:'Closed-end fund',d:'A fund with a fixed life (often 10–12 years) that raises capital once, invests, then harvests and returns it.',a:['closed-end fund','closed-ended fund']},
    'openend':{t:'Open-end (evergreen) fund',d:'A perpetual fund that lets investors subscribe and redeem periodically, increasingly used for core infrastructure.',a:['open-end fund','open-ended fund','evergreen fund','evergreen']},
    'nav':{t:'Net asset value (NAV)',d:'The value of a fund or vehicle’s assets less its liabilities, the basis for unit prices and performance.',a:['NAV','net asset value']},
    'tvpi':{t:'TVPI',d:'Total value to paid-in, total value (distributions plus remaining NAV) divided by capital drawn, a money-multiple measure.',a:['TVPI']},
    'dpi':{t:'DPI',d:'Distributions to paid-in, cash actually returned to investors divided by capital drawn, the “realised” multiple.',a:['DPI']},
    'secondaries':{t:'Secondaries',d:'Buying existing fund stakes or assets from other investors, rather than primary commitments, for liquidity or portfolio management.',a:['secondaries','secondary market']},
    'managementfee':{t:'Management fee',d:'The annual fee a fund manager charges (often on committed or invested capital) to cover operations, separate from carry.',a:['management fee']},
    'continuationfund':{t:'Continuation fund',d:'A vehicle a GP uses to buy assets from one of its own maturing funds, giving existing investors liquidity and new ones entry.',a:['continuation fund','continuation vehicle']},
    /* ===== power & renewables ===== */
    'capacityfactor':{t:'Capacity factor',d:'Actual output over a period divided by the maximum if the asset ran at full nameplate the whole time, the key driver of generation revenue.',a:['capacity factor']},
    'loadfactor':{t:'Load factor',d:'How fully capacity is used, passenger seats filled for transport, or output versus nameplate for generation.',a:['load factor']},
    'nameplate':{t:'Nameplate capacity',d:'The maximum rated output of a plant (in MW), the denominator behind the capacity factor.',a:['nameplate','nameplate capacity','installed capacity']},
    'mw':{t:'MW / MWh / GW',d:'Power (MW, GW) is the rate of generation; energy (MWh, GWh) is power over time. Capacity is quoted in MW, output in MWh.',a:['MW','MWh','GW','GWh','MWp','kWh']},
    'curtailment':{t:'Curtailment',d:'Output a generator is forced to waste when the grid cannot take it, a growing drag on renewables revenue.',a:['curtailment','curtailed']},
    'cannibalisation':{t:'Price cannibalisation',d:'When generators of one type (e.g. solar) all produce at once, depressing the market price exactly when they sell, eroding capture prices.',a:['cannibalisation','cannibalization','price cannibalisation']},
    'captureprice':{t:'Capture price',d:'The average price a generator actually achieves, which can be below the market average if it produces at low-price times.',a:['capture price','capture rate']},
    'baseload':{t:'Baseload',d:'Generation that runs steadily around the clock (nuclear, some gas), as opposed to variable or peaking plant.',a:['baseload','base-load']},
    'dispatchable':{t:'Dispatchable',d:'Generation or storage that can be turned up or down on demand, increasingly valuable as variable renewables grow.',a:['dispatchable']},
    'intermittent':{t:'Intermittent / variable',d:'Generation that depends on weather (wind, solar) and cannot be controlled, creating the need for storage and flexibility.',a:['intermittent','intermittency']},
    'gridconnection':{t:'Grid connection',d:'The contracted right and physical link to export power to the network, often the scarce, rate-limiting asset for new projects.',a:['grid connection']},
    'substation':{t:'Substation',d:'Equipment that transforms voltage and connects generation or demand to the transmission or distribution network.',a:['substation']},
    'ancillary':{t:'Ancillary / balancing services',d:'Services that keep the grid stable (frequency, reserve, inertia), a revenue stream for batteries and flexible plant.',a:['ancillary services','balancing services','balancing mechanism']},
    'capacitymarket':{t:'Capacity market',d:'A scheme paying generators and storage to be available at peak, a contracted revenue stream separate from selling energy.',a:['capacity market']},
    'frequencyresponse':{t:'Frequency response',d:'Fast services that balance supply and demand second-by-second to hold grid frequency, a core battery revenue.',a:['frequency response','dynamic containment']},
    'interconnector':{t:'Interconnector',d:'A high-voltage link between two power markets, earning by moving electricity from the cheaper to the dearer side.',a:['interconnector']},
    'hvdc':{t:'HVDC',d:'High-voltage direct current, the technology used for long-distance and subsea power links such as interconnectors.',a:['HVDC','high-voltage direct current']},
    'bess':{t:'Battery storage (BESS)',d:'Battery energy storage systems that store cheap power and sell it, or provide grid services, when it is scarce.',a:['BESS','battery energy storage']},
    'roundtrip':{t:'Round-trip efficiency',d:'The share of stored energy a battery returns after charge/discharge losses, a key driver of storage economics.',a:['round-trip efficiency','round trip efficiency']},
    'arbitrage':{t:'Energy arbitrage',d:'Buying power when it is cheap and selling when it is expensive, the core merchant revenue for storage.',a:['arbitrage','energy arbitrage']},
    'electrolyser':{t:'Electrolyser',d:'Equipment that splits water into hydrogen and oxygen using electricity, the core kit of green-hydrogen projects.',a:['electrolyser','electrolyzer','electrolysis']},
    'hydrogencolour':{t:'Green / blue hydrogen',d:'Green hydrogen is made from renewable power via electrolysis; blue from natural gas with carbon capture; grey is unabated.',a:['green hydrogen','blue hydrogen','grey hydrogen']},
    'corporateppa':{t:'Corporate PPA',d:'A power-purchase agreement signed directly with a corporate buyer (often a tech or industrial firm) rather than a utility.',a:['corporate PPA']},
    /* ===== regulated utilities ===== */
    'riio':{t:'RIIO',d:'Ofgem’s framework (“Revenue = Incentives + Innovation + Outputs”) setting allowed revenues for UK energy networks.',a:['RIIO','RIIO-ED2','RIIO-T2','RIIO-GD2']},
    'ofgem':{t:'Ofgem',d:'Great Britain’s energy regulator, which sets allowed returns and price controls for electricity and gas networks.',a:['Ofgem']},
    'ofwat':{t:'Ofwat',d:'The economic regulator of water and wastewater companies in England and Wales, setting price controls each AMP.',a:['Ofwat']},
    'amp':{t:'Asset Management Period (AMP)',d:'Ofwat’s five-year price-control cycle for water companies (e.g. AMP7, AMP8) that sets allowed spend and revenue.',a:['AMP7','AMP8','Asset Management Period']},
    /* ===== transport ===== */
    'teu':{t:'TEU',d:'Twenty-foot equivalent unit, the standard container measure used to size and benchmark port throughput.',a:['TEU','TEUs','twenty-foot equivalent']},
    'throughput':{t:'Throughput',d:'The volume an asset handles over a period, containers at a port, passengers at an airport, the demand-side revenue driver.',a:['throughput']},
    'rosco':{t:'ROSCO',d:'Rolling-stock company, an owner that leases trains to operators, an availability-style infrastructure business.',a:['ROSCO','ROSCOs','rolling-stock company']},
    'franchise':{t:'Rail franchise / concession',d:'A contracted right to run train services for a period, either taking revenue risk (franchise) or a fee (concession).',a:['franchise','rail franchise']},
    /* ===== digital ===== */
    'tenancyratio':{t:'Tenancy ratio',d:'The average number of tenants (mobile operators) per tower, the single biggest driver of tower-company margins and returns.',a:['tenancy ratio','tenancy ratios','colocation ratio']},
    'latency':{t:'Latency',d:'The delay in moving data along a network, a key quality (and pricing) metric for fibre, subsea cable and data-centre routes.',a:['latency']},
    'mla':{t:'Master lease agreement (MLA)',d:'A single long-term lease framework (common in towers and data centres) under which many sites or units are contracted.',a:['master lease','MLA']},
    /* ===== environmental & waste ===== */
    'gatefee':{t:'Gate fee / tipping fee',d:'The charge a waste facility levies to accept a tonne of waste, the primary revenue for energy-from-waste and recycling plants.',a:['gate fee','tipping fee']},
    'feedstock':{t:'Feedstock',d:'The input material a plant processes, waste for energy-from-waste, food and farm waste for AD, the supply-side risk in these assets.',a:['feedstock']},
    'calorific':{t:'Calorific value',d:'The energy content of a fuel or waste stream, which sets how much power an energy-from-waste plant can generate per tonne.',a:['calorific value']},
    'biomethane':{t:'Biomethane / RNG',d:'Upgraded biogas (renewable natural gas) injected into the grid or used as fuel, the main output of many AD plants.',a:['biomethane','renewable natural gas','RNG']},
    'efw':{t:'Energy-from-waste (EfW)',d:'Burning residual waste to generate electricity and/or heat, earning a gate fee for the waste plus power revenue.',a:['EfW','energy-from-waste','energy from waste']},
    'wte':{t:'Waste-to-energy (WtE)',d:'The broad category of converting waste into usable energy, including incineration (EfW) and gasification.',a:['WtE','waste-to-energy','waste to energy']},
    'mrf':{t:'Materials recovery facility (MRF)',d:'A plant that sorts mixed recyclables into clean commodity streams (paper, plastics, metals) for sale.',a:['MRF','MRFs','materials recovery facility']},
    'recyclate':{t:'Recyclate',d:'The sorted, baled output of a recycling plant, sold as a commodity whose price drives plant revenue.',a:['recyclate']},
    'anaerobicd':{t:'Anaerobic digestion (AD)',d:'Breaking down organic matter without oxygen to produce biogas and digestate, the core process of an AD plant.',a:['anaerobic digestion']},
    'gasification':{t:'Gasification',d:'Converting waste or biomass into a synthetic gas at high temperature, an alternative to conventional incineration.',a:['gasification']},
    'nonrevwater':{t:'Non-revenue water',d:'Water that is produced but lost to leaks or theft before it can be billed, a key efficiency and capex driver for water utilities.',a:['non-revenue water']},
    'desalination':{t:'Desalination',d:'Removing salt from seawater to produce fresh water, an energy-intensive, often availability-contracted water asset.',a:['desalination','desalination plant']},
    /* ===== nuclear ===== */
    'smr':{t:'Small modular reactor (SMR)',d:'Factory-built nuclear reactors of ~50–300MW, intended to cut nuclear’s cost and build risk through standardisation.',a:['SMR','SMRs','small modular reactor']},
    'decommissioning':{t:'Decommissioning',d:'Safely retiring and dismantling an asset (e.g. a reactor or offshore platform) at end of life, a long-dated funded liability.',a:['decommissioning']}
  };

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }

  /* Inject the glossary styles so the feature is fully self-contained and works
     even on pages that do not load the site stylesheet (e.g. the simulators). */
  function injectCSS(){
    if(document.getElementById('gloss-style')) return;
    var s=document.createElement('style'); s.id='gloss-style';
    s.textContent=
      '.term{border-bottom:1px dashed var(--accent,#0c6b4f);cursor:help;color:inherit;font-weight:inherit;outline:none}'+
      '.term:hover,.term:focus{background:var(--accent-soft,rgba(12,107,79,.12));border-radius:3px}'+
      '.gtip{position:fixed;max-width:320px;background:#15201d;color:#eaf2ee;font-family:Inter,system-ui,sans-serif;font-size:.78rem;line-height:1.5;padding:.6rem .75rem;border-radius:9px;box-shadow:0 12px 34px rgba(8,20,14,.4);z-index:9000;pointer-events:none}'+
      '.gtip .gt-term{display:block;font-weight:700;color:#fff;margin-bottom:.22rem;font-size:.8rem}'+
      '.gtip::after{content:"";position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);border:6px solid transparent;border-top-color:#15201d}'+
      '.gtip.below::after{bottom:auto;top:-6px;border-top-color:transparent;border-bottom-color:#15201d}';
    (document.head||document.documentElement).appendChild(s);
  }

  /* ---- Build the match index from GLOSSARY ----
     Each entry can supply explicit aliases via `a`; otherwise aliases are derived
     from the title (parentheticals stripped, split on "/"). STOP filters out a few
     ambiguous two-letter tokens so they only resolve via manual data-term markup. */
  var STOP={'EV':1,'DA':1};
  function escRx(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  function buildIndex(){
    var map={}, list=[];
    Object.keys(GLOSSARY).forEach(function(key){
      var g=GLOSSARY[key]; if(g.skip) return;
      var al=g.a;
      if(!al){
        al=[];
        var pm=g.t.match(/\(([^)]*)\)/g);          // parenthetical acronyms / synonyms
        if(pm) pm.forEach(function(p){ p.slice(1,-1).split('/').forEach(function(tok){
          tok=tok.trim(); if(tok.length>=3 && !STOP[tok]) al.push(tok);
        }); });
        g.t.replace(/\([^)]*\)/g,' ').split('/').forEach(function(s){   // main phrase(s)
          s=s.replace(/\s+/g,' ').trim(); if(s.length>=3 && !STOP[s]) al.push(s);
        });
      }
      al.forEach(function(a){
        a=(a||'').trim(); if(a.length<3) return;
        var low=a.toLowerCase();
        if(map[low]!=null) return;            // first definition of an alias wins
        map[low]=key; list.push(a);
      });
    });
    list.sort(function(a,b){return b.length-a.length;});   // prefer the longest match
    return {map:map, rx:list.length?new RegExp('\\b(?:'+list.map(escRx).join('|')+')\\b','gi'):null};
  }

  /* Skip structural chrome, interactive controls, headings and anything already
     tagged, so auto-tagging only touches readable body prose. */
  var SKIP_SEL='a,button,select,option,textarea,input,label,code,pre,kbd,script,style,noscript,svg,h1,h2,h3,h4,h5,h6,nav,header,footer,.term,.gtip,.cmdk,.pager,.site-footer,[data-term],[data-no-gloss],[contenteditable]';
  function inSkip(node){
    for(var el=node.parentNode; el && el.nodeType===1; el=el.parentNode){
      if(el.matches && el.matches(SKIP_SEL)) return true;
    }
    return false;
  }

  /* Wrap the first occurrence of each known term in the page body. */
  function autoTag(ix){
    if(!ix.rx || !document.body) return;
    var done={};
    [].forEach.call(document.querySelectorAll('[data-term]'),function(el){ done[el.getAttribute('data-term')]=true; });
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false), nodes=[], n;
    while((n=walker.nextNode())){ if(n.nodeValue && /[A-Za-z]/.test(n.nodeValue) && !inSkip(n)) nodes.push(n); }
    var rx=ix.rx, cap=600, count=0, m, i;
    for(i=0;i<nodes.length && count<cap;i++){
      var node=nodes[i], text=node.nodeValue, last=0, frag=null; rx.lastIndex=0;
      while((m=rx.exec(text))){
        var key=ix.map[m[0].toLowerCase()];
        if(key && !done[key]){
          done[key]=true; count++;
          if(!frag) frag=document.createDocumentFragment();
          frag.appendChild(document.createTextNode(text.slice(last,m.index)));
          var sp=document.createElement('span'); sp.className='term'; sp.setAttribute('data-term',key); sp.textContent=m[0];
          frag.appendChild(sp); last=m.index+m[0].length;
          if(count>=cap) break;
        }
      }
      if(frag){ frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag,node); }
    }
  }

  ready(function(){
    if(window.__glossInit) return; window.__glossInit=true;
    injectCSS();
    autoTag(buildIndex());
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
