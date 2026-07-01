/* Infrastructure Reference, shared nav + command palette (progressive enhancement) */
(function () {
  var INDEX = [{"t":"Home","u":"index.html","g":"Page"},{"t":"Compare returns","u":"compare.html","g":"Page"},{"t":"Community","u":"community.html","g":"Page"},{"t":"Contact","u":"contact.html","g":"Page"},{"t":"Energy & Utilities","u":"energy-utilities.html","g":"Asset class"},{"t":"Electricity transmission","u":"electricity-transmission.html","g":"Energy & Utilities"},{"t":"Electricity distribution","u":"electricity-distribution.html","g":"Energy & Utilities"},{"t":"Last-mile electricity","u":"last-mile-electricity.html","g":"Energy & Utilities"},{"t":"Electricity interconnectors","u":"electricity-interconnectors.html","g":"Energy & Utilities"},{"t":"Gas transmission","u":"gas-transmission.html","g":"Energy & Utilities"},{"t":"Gas distribution","u":"gas-distribution.html","g":"Energy & Utilities"},{"t":"Water & wastewater","u":"water-wastewater.html","g":"Energy & Utilities"},{"t":"Last-mile water","u":"last-mile-water.html","g":"Energy & Utilities"},{"t":"Heat networks","u":"heat-networks.html","g":"Energy & Utilities"},{"t":"Transport","u":"transport.html","g":"Asset class"},{"t":"Roads","u":"roads.html","g":"Transport"},{"t":"Rail infrastructure","u":"rail-infrastructure.html","g":"Transport"},{"t":"Airports","u":"airports.html","g":"Transport"},{"t":"Ports","u":"ports.html","g":"Transport"},{"t":"Rolling stock","u":"rolling-stock.html","g":"Transport"},{"t":"EV charging","u":"ev-charging.html","g":"Transport"},{"t":"Bridges","u":"bridges.html","g":"Transport"},{"t":"Digital Infrastructure","u":"digital-infrastructure.html","g":"Asset class"},{"t":"Fibre networks","u":"fibre-networks.html","g":"Digital Infrastructure"},{"t":"Mobile towers","u":"mobile-towers.html","g":"Digital Infrastructure"},{"t":"Data centres","u":"data-centres.html","g":"Digital Infrastructure"},{"t":"Subsea cables","u":"subsea-cables.html","g":"Digital Infrastructure"},{"t":"Social Infrastructure","u":"social-infrastructure.html","g":"Asset class"},{"t":"Hospitals","u":"hospitals.html","g":"Social Infrastructure"},{"t":"Schools","u":"schools.html","g":"Social Infrastructure"},{"t":"Prisons","u":"prisons.html","g":"Social Infrastructure"},{"t":"Courts","u":"courts.html","g":"Social Infrastructure"},{"t":"Military","u":"military.html","g":"Social Infrastructure"},{"t":"Student accommodation","u":"student-accommodation.html","g":"Social Infrastructure"},{"t":"Energy Transition","u":"energy-transition.html","g":"Asset class"},{"t":"Onshore wind","u":"onshore-wind.html","g":"Energy Transition"},{"t":"Offshore wind","u":"offshore-wind.html","g":"Energy Transition"},{"t":"Solar","u":"solar.html","g":"Energy Transition"},{"t":"Battery storage","u":"battery-storage.html","g":"Energy Transition"},{"t":"Hydrogen","u":"hydrogen.html","g":"Energy Transition"},{"t":"Nuclear","u":"nuclear.html","g":"Energy Transition"},{"t":"Pumped hydro","u":"pumped-hydro.html","g":"Energy Transition"},{"t":"Environmental & Waste","u":"environmental-waste.html","g":"Asset class"},{"t":"Waste-to-energy","u":"waste-to-energy.html","g":"Environmental & Waste"},{"t":"Anaerobic digestion","u":"anaerobic-digestion.html","g":"Environmental & Waste"},{"t":"Recycling infrastructure","u":"recycling-infrastructure.html","g":"Environmental & Waste"},{"t":"RIIO-ED2 Revenue Calculator","u":"riio_ed2_calculator.html","g":"Tool"},{"t":"Investment Considerations","u":"heat_framework.html","g":"Tool"},{"t":"Regulatory Timeline","u":"heat_regulation_timeline.html","g":"Tool"},{"t":"HSA Cashflow Model","u":"heat_dcf.html","g":"Tool"},{"t":"Cash-flow & DCF model","u":"cashflow-model.html","g":"Tool"},{"t":"Infrastructure M&A","u":"infrastructure-ma.html","g":"Tool"},{"t":"Infrastructure deals database","u":"infrastructure-deals.html","g":"Tool"},{"t":"M&A in action","u":"ma-in-action.html","g":"Tool"},{"t":"In action: fibre market entry","u":"ma-in-action-fibre.html","g":"Tool"},{"t":"In action: distressed altnet","u":"ma-in-action-distressed.html","g":"Tool"},{"t":"In action: regulated take-private","u":"ma-in-action-regulated.html","g":"Tool"},{"t":"In action: data-centre platform","u":"ma-in-action-datacentre.html","g":"Tool"},{"t":"WACC Calculator","u":"wacc-calculator.html","g":"Tool"},{"t":"Macro Dashboard","u":"macro_dashboard.html","g":"Tool"},{"t":"Ofgem & Ofwat Tracker","u":"regulatory_tracker.html","g":"Tool"},{"t":"Multiples map","u":"multiples-map.html","g":"Tool"},{"t":"Fund economics","u":"fund-economics.html","g":"Tool"},{"t":"Project finance & debt","u":"project-finance.html","g":"Tool"},{"t":"Glossary A–Z","u":"glossary.html","g":"Page"},{"t":"Start here · guided tracks","u":"start-here.html","g":"Page"},{"t":"About & methodology","u":"about.html","g":"Page"}];

  /* Extra search keywords per page, so the ⌘K palette matches the language
     practitioners actually type (business models, jargon, regulators), not just
     page titles. Keyed by URL; matched case-insensitively in score(). */
  var KEYWORDS = {
    'roads.html': 'toll motorway highway concession availability shadow traffic',
    'rail-infrastructure.html': 'high speed hsr train track access charge farebox',
    'airports.html': 'aero pax passenger dual till single till slot terminal',
    'ports.html': 'container terminal teu berth quay concession landlord stevedore',
    'rolling-stock.html': 'rosco train leasing fleet availability lessor wagon',
    'ev-charging.html': 'charger utilisation rapid hub forecourt electric vehicle',
    'bridges.html': 'toll crossing tunnel estuary fixed link',
    'electricity-transmission.html': 'grid rab wacc allowed return pylon network riio ofgem wires',
    'electricity-distribution.html': 'dno riio-ed2 network rab feeder substation wires',
    'last-mile-electricity.html': 'idno connections adoption embedded network',
    'electricity-interconnectors.html': 'hvdc cable cap floor subsea link arbitrage',
    'gas-transmission.html': 'pipeline midstream compressor take or pay ship or pay',
    'gas-distribution.html': 'gdn mains governor hydrogen ready decline',
    'water-wastewater.html': 'ofwat pr24 rcv amp leakage odi sewer utility',
    'last-mile-water.html': 'nav inset appointment connections developer',
    'heat-networks.html': 'district heating cooling esco take or pay thermal',
    'fibre-networks.html': 'ftth fttp altnet broadband penetration arpu homes passed take-up',
    'mobile-towers.html': 'towerco colocation tenancy ratio mast bts sale leaseback',
    'data-centres.html': 'colocation hyperscale mw it load pue powered shell wholesale ai',
    'subsea-cables.html': 'submarine cable iru capacity landing station wavelength',
    'hospitals.html': 'pfi ppp availability unitary charge healthcare nhs',
    'schools.html': 'pfi bsf education availability unitary',
    'prisons.html': 'custodial per diem correctional ppp',
    'courts.html': 'justice courthouse p3 availability',
    'military.html': 'defence estate barracks accommodation fm',
    'student-accommodation.html': 'pbsa beds occupancy university nomination agreement',
    'onshore-wind.html': 'turbine ppa cfd merchant capacity factor renewable generation',
    'offshore-wind.html': 'cfd fixed bottom floating ofto renewable generation',
    'solar.html': 'pv photovoltaic ppa merchant capture price renewable generation',
    'battery-storage.html': 'bess arbitrage ancillary frequency tolling storage',
    'hydrogen.html': 'electrolyser green h2 offtake subsidy power-to-x',
    'nuclear.html': 'rab cfd baseload smr reactor',
    'pumped-hydro.html': 'storage reservoir penstock cap and floor',
    'waste-to-energy.html': 'efw gate fee incineration merchant power',
    'anaerobic-digestion.html': 'biogas biomethane rng feedstock gate fee',
    'recycling-infrastructure.html': 'mrf materials recovery gate fee commodity',
    'cashflow-model.html': 'dcf irr npv moic projection valuation model',
    'wacc-calculator.html': 'discount rate cost of capital capm risk premium',
    'infrastructure-ma.html': 'acquisition lbo deal auction dscr sources uses bridge sensitivity',
    'infrastructure-deals.html': 'transactions landmark comps takeover take-private database',
    'compare.html': 'benchmark irr side by side returns',
    'multiples-map.html': 'valuation ev ebitda rab premium benchmark trading ranges deal flow',
    'fund-economics.html': 'lp gp carry hurdle waterfall management fee net irr gross moic fund',
    'project-finance.html': 'debt sculpting dscr llcr cfads leverage bond bank private credit refinancing',
    'glossary.html': 'terms definitions jargon dictionary a-z',
    'start-here.html': 'learn learning path track new joiner beginner guide onboarding curriculum',
    'about.html': 'methodology sources calibration author who behind independent corrections',
    'macro_dashboard.html': 'rates swaps gilts inflation credit spreads market data',
    'regulatory_tracker.html': 'ofgem ofwat price control determination riio'
  };

  var classes = INDEX.filter(function (e) { return e.g === 'Asset class'; });
  var here = (location.pathname.split('/').pop() || 'index.html');

  /* Worked projects/assets inside the reference pages (HS2, Heathrow, …), searchable
     in the command palette and deep-linkable via <page>.html#ex=<key>, which auto-selects
     that asset. Regenerate with: node scripts/generate-search-index.js */
  /* PROJECTS:START */
  var PROJECTS = [
    {"t":"Beijing Capital (PEK)","u":"airports.html#ex=beijing","g":"Airports"},
    {"t":"Dubai International (DXB)","u":"airports.html#ex=dubai","g":"Airports"},
    {"t":"Hartsfield–Jackson Atlanta","u":"airports.html#ex=atlanta","g":"Airports"},
    {"t":"Lima Jorge Chávez","u":"airports.html#ex=lima","g":"Airports"},
    {"t":"London Heathrow","u":"airports.html#ex=heathrow","g":"Airports"},
    {"t":"Sydney Airport","u":"airports.html#ex=sydney","g":"Airports"},
    {"t":"Australian food-waste AD","u":"anaerobic-digestion.html#ex=ausfw","g":"Anaerobic digestion"},
    {"t":"Brazilian agri-biogas","u":"anaerobic-digestion.html#ex=brbio","g":"Anaerobic digestion"},
    {"t":"Chinese large-scale biogas","u":"anaerobic-digestion.html#ex=cnbio","g":"Anaerobic digestion"},
    {"t":"Gulf food-waste AD","u":"anaerobic-digestion.html#ex=gulffw","g":"Anaerobic digestion"},
    {"t":"UK biomethane-to-grid","u":"anaerobic-digestion.html#ex=ukbio","g":"Anaerobic digestion"},
    {"t":"US renewable natural gas","u":"anaerobic-digestion.html#ex=usrng","g":"Anaerobic digestion"},
    {"t":"Chilean solar-paired battery","u":"battery-storage.html#ex=chile","g":"Battery storage"},
    {"t":"Chinese grid-scale battery","u":"battery-storage.html#ex=china","g":"Battery storage"},
    {"t":"ERCOT / CAISO battery","u":"battery-storage.html#ex=ercot","g":"Battery storage"},
    {"t":"GB grid-scale battery","u":"battery-storage.html#ex=gbbess","g":"Battery storage"},
    {"t":"Hornsdale / Victorian Big Battery","u":"battery-storage.html#ex=australia","g":"Battery storage"},
    {"t":"Saudi / UAE utility battery","u":"battery-storage.html#ex=gulf","g":"Battery storage"},
    {"t":"Confederation Bridge","u":"bridges.html#ex=confed","g":"Bridges"},
    {"t":"Hong Kong–Zhuhai–Macau Bridge","u":"bridges.html#ex=hzmb","g":"Bridges"},
    {"t":"King Fahd Causeway","u":"bridges.html#ex=kingfahd","g":"Bridges"},
    {"t":"Øresund Bridge","u":"bridges.html#ex=oresund","g":"Bridges"},
    {"t":"Rio–Niterói","u":"bridges.html#ex=rioniteroi","g":"Bridges"},
    {"t":"Sydney Harbour Bridge","u":"bridges.html#ex=sydney","g":"Bridges"},
    {"t":"Australian court PPP","u":"courts.html#ex=australia","g":"Courts"},
    {"t":"Chilean justice facility","u":"courts.html#ex=chile","g":"Courts"},
    {"t":"Gulf justice complex","u":"courts.html#ex=gulf","g":"Courts"},
    {"t":"Ontario courthouse P3","u":"courts.html#ex=ontario","g":"Courts"},
    {"t":"Social-capital court complex","u":"courts.html#ex=china","g":"Courts"},
    {"t":"UK courts PFI","u":"courts.html#ex=uk","g":"Courts"},
    {"t":"AirTrunk","u":"data-centres.html#ex=airtrunk","g":"Data centres"},
    {"t":"Ascenty","u":"data-centres.html#ex=ascenty","g":"Data centres"},
    {"t":"Equinix","u":"data-centres.html#ex=equinix","g":"Data centres"},
    {"t":"GDS","u":"data-centres.html#ex=gds","g":"Data centres"},
    {"t":"Khazna","u":"data-centres.html#ex=khazna","g":"Data centres"},
    {"t":"Northern Virginia","u":"data-centres.html#ex=nova","g":"Data centres"},
    {"t":"Ausgrid","u":"electricity-distribution.html#ex=ausgrid","g":"Electricity distribution"},
    {"t":"China Southern Power Grid","u":"electricity-distribution.html#ex=csg","g":"Electricity distribution"},
    {"t":"Con Edison","u":"electricity-distribution.html#ex=coned","g":"Electricity distribution"},
    {"t":"DEWA","u":"electricity-distribution.html#ex=dewa","g":"Electricity distribution"},
    {"t":"Enel Distribución","u":"electricity-distribution.html#ex=enelbr","g":"Electricity distribution"},
    {"t":"UK Power Networks","u":"electricity-distribution.html#ex=ukpn","g":"Electricity distribution"},
    {"t":"Cahora Bassa","u":"electricity-interconnectors.html#ex=cahora","g":"Electricity interconnectors"},
    {"t":"Celtic Interconnector","u":"electricity-interconnectors.html#ex=celtic","g":"Electricity interconnectors"},
    {"t":"Champlain Hudson","u":"electricity-interconnectors.html#ex=chpe","g":"Electricity interconnectors"},
    {"t":"Garabi","u":"electricity-interconnectors.html#ex=garabi","g":"Electricity interconnectors"},
    {"t":"GCC Interconnection","u":"electricity-interconnectors.html#ex=gccia","g":"Electricity interconnectors"},
    {"t":"Marinus Link","u":"electricity-interconnectors.html#ex=marinus","g":"Electricity interconnectors"},
    {"t":"ISA CTEEP","u":"electricity-transmission.html#ex=cteep","g":"Electricity transmission"},
    {"t":"ITC Holdings","u":"electricity-transmission.html#ex=itc","g":"Electricity transmission"},
    {"t":"National Grid ET","u":"electricity-transmission.html#ex=nationalgrid","g":"Electricity transmission"},
    {"t":"National Grid SA","u":"electricity-transmission.html#ex=saudi","g":"Electricity transmission"},
    {"t":"State Grid (UHV)","u":"electricity-transmission.html#ex=stategrid","g":"Electricity transmission"},
    {"t":"TransGrid","u":"electricity-transmission.html#ex=transgrid","g":"Electricity transmission"},
    {"t":"Enel X Way","u":"ev-charging.html#ex=enelx","g":"EV charging"},
    {"t":"EVgo","u":"ev-charging.html#ex=evgo","g":"EV charging"},
    {"t":"Evie Networks","u":"ev-charging.html#ex=evie","g":"EV charging"},
    {"t":"EVIQ","u":"ev-charging.html#ex=eviq","g":"EV charging"},
    {"t":"Fastned","u":"ev-charging.html#ex=fastned","g":"EV charging"},
    {"t":"Star Charge","u":"ev-charging.html#ex=starcharge","g":"EV charging"},
    {"t":"China Telecom","u":"fibre-networks.html#ex=chinatel","g":"Fibre networks"},
    {"t":"Chorus","u":"fibre-networks.html#ex=chorus","g":"Fibre networks"},
    {"t":"CityFibre","u":"fibre-networks.html#ex=cityfibre","g":"Fibre networks"},
    {"t":"e& (Etisalat)","u":"fibre-networks.html#ex=etisalat","g":"Fibre networks"},
    {"t":"FiBrasil","u":"fibre-networks.html#ex=fibrasil","g":"Fibre networks"},
    {"t":"Frontier Communications","u":"fibre-networks.html#ex=frontier","g":"Fibre networks"},
    {"t":"Australian Gas Networks","u":"gas-distribution.html#ex=agig","g":"Gas distribution"},
    {"t":"Cadent","u":"gas-distribution.html#ex=cadent","g":"Gas distribution"},
    {"t":"Comgás","u":"gas-distribution.html#ex=comgas","g":"Gas distribution"},
    {"t":"ENN Energy","u":"gas-distribution.html#ex=enn","g":"Gas distribution"},
    {"t":"SoCalGas","u":"gas-distribution.html#ex=socalgas","g":"Gas distribution"},
    {"t":"Town Gas","u":"gas-distribution.html#ex=egypt","g":"Gas distribution"},
    {"t":"APA Group","u":"gas-transmission.html#ex=apa","g":"Gas transmission"},
    {"t":"Aramco Gas Pipelines","u":"gas-transmission.html#ex=aramco","g":"Gas transmission"},
    {"t":"PipeChina","u":"gas-transmission.html#ex=pipechina","g":"Gas transmission"},
    {"t":"Snam","u":"gas-transmission.html#ex=snam","g":"Gas transmission"},
    {"t":"TGS","u":"gas-transmission.html#ex=tgs","g":"Gas transmission"},
    {"t":"Williams (Transco)","u":"gas-transmission.html#ex=williams","g":"Gas transmission"},
    {"t":"Copenhagen district heating","u":"heat-networks.html#ex=copen","g":"Heat networks"},
    {"t":"Municipal district heating","u":"heat-networks.html#ex=chinadh","g":"Heat networks"},
    {"t":"Sydney precinct thermal","u":"heat-networks.html#ex=sydney","g":"Heat networks"},
    {"t":"Tabreed","u":"heat-networks.html#ex=tabreed","g":"Heat networks"},
    {"t":"Veolia district energy","u":"heat-networks.html#ex=veolia","g":"Heat networks"},
    {"t":"Vicinity Energy","u":"heat-networks.html#ex=vicinity","g":"Heat networks"},
    {"t":"Chilean hospital concession","u":"hospitals.html#ex=chile","g":"Hospitals"},
    {"t":"Humber River Hospital","u":"hospitals.html#ex=humber","g":"Hospitals"},
    {"t":"Northern Beaches Hospital","u":"hospitals.html#ex=northern","g":"Hospitals"},
    {"t":"Social-capital hospital","u":"hospitals.html#ex=china","g":"Hospitals"},
    {"t":"Turkish city hospital","u":"hospitals.html#ex=turkey","g":"Hospitals"},
    {"t":"UK NHS PFI hospital","u":"hospitals.html#ex=nhs","g":"Hospitals"},
    {"t":"Chinese green hydrogen","u":"hydrogen.html#ex=chinah2","g":"Hydrogen"},
    {"t":"European electrolyser","u":"hydrogen.html#ex=euroh2","g":"Hydrogen"},
    {"t":"HIF / Atacama","u":"hydrogen.html#ex=atacama","g":"Hydrogen"},
    {"t":"Murchison / CWP","u":"hydrogen.html#ex=murchison","g":"Hydrogen"},
    {"t":"NEOM Green Hydrogen","u":"hydrogen.html#ex=neom","g":"Hydrogen"},
    {"t":"US Gulf Coast green H2","u":"hydrogen.html#ex=gulfh2","g":"Hydrogen"},
    {"t":"Altogether Group","u":"last-mile-electricity.html#ex=altogether","g":"Last-mile electricity"},
    {"t":"ENOWA / NEOM","u":"last-mile-electricity.html#ex=enowa","g":"Last-mile electricity"},
    {"t":"Equatorial Energia","u":"last-mile-electricity.html#ex=equatorial","g":"Last-mile electricity"},
    {"t":"Florida Power & Light","u":"last-mile-electricity.html#ex=fpl","g":"Last-mile electricity"},
    {"t":"GTC","u":"last-mile-electricity.html#ex=gtc","g":"Last-mile electricity"},
    {"t":"State Grid","u":"last-mile-electricity.html#ex=stategrid","g":"Last-mile electricity"},
    {"t":"Aegea Saneamento","u":"last-mile-water.html#ex=aegea","g":"Last-mile water"},
    {"t":"China Water Affairs","u":"last-mile-water.html#ex=cwa","g":"Last-mile water"},
    {"t":"ENOWA / NEOM","u":"last-mile-water.html#ex=enowawater","g":"Last-mile water"},
    {"t":"Flow Systems","u":"last-mile-water.html#ex=flow","g":"Last-mile water"},
    {"t":"Global Water Resources","u":"last-mile-water.html#ex=gwr","g":"Last-mile water"},
    {"t":"Independent Water Networks","u":"last-mile-water.html#ex=iwnl","g":"Last-mile water"},
    {"t":"Defence estate PPP","u":"military.html#ex=latam","g":"Military"},
    {"t":"Defence estate PPP","u":"military.html#ex=gulf","g":"Military"},
    {"t":"Defence Housing Australia","u":"military.html#ex=dha","g":"Military"},
    {"t":"Military Housing Privatization (MHPI)","u":"military.html#ex=mhpi","g":"Military"},
    {"t":"Project Allenby/Connaught","u":"military.html#ex=allenby","g":"Military"},
    {"t":"State defence estate","u":"military.html#ex=china","g":"Military"},
    {"t":"American Tower","u":"mobile-towers.html#ex=amt","g":"Mobile towers"},
    {"t":"Amplitel","u":"mobile-towers.html#ex=amplitel","g":"Mobile towers"},
    {"t":"Cellnex","u":"mobile-towers.html#ex=cellnex","g":"Mobile towers"},
    {"t":"China Tower","u":"mobile-towers.html#ex=chinatower","g":"Mobile towers"},
    {"t":"Highline do Brasil","u":"mobile-towers.html#ex=highline","g":"Mobile towers"},
    {"t":"TASC Towers","u":"mobile-towers.html#ex=tasc","g":"Mobile towers"},
    {"t":"Angra (Eletronuclear)","u":"nuclear.html#ex=angra","g":"Nuclear"},
    {"t":"Barakah","u":"nuclear.html#ex=barakah","g":"Nuclear"},
    {"t":"CGN nuclear fleet","u":"nuclear.html#ex=cgn","g":"Nuclear"},
    {"t":"Hinkley Point C","u":"nuclear.html#ex=hinkley","g":"Nuclear"},
    {"t":"Small modular reactor","u":"nuclear.html#ex=smr","g":"Nuclear"},
    {"t":"Vogtle 3 & 4","u":"nuclear.html#ex=vogtle","g":"Nuclear"},
    {"t":"Brazil offshore","u":"offshore-wind.html#ex=brazil","g":"Offshore wind"},
    {"t":"China offshore","u":"offshore-wind.html#ex=china","g":"Offshore wind"},
    {"t":"Dogger Bank / Hornsea","u":"offshore-wind.html#ex=dogger","g":"Offshore wind"},
    {"t":"Greater Changhua","u":"offshore-wind.html#ex=changhua","g":"Offshore wind"},
    {"t":"Star of the South","u":"offshore-wind.html#ex=starsouth","g":"Offshore wind"},
    {"t":"Vineyard Wind / Revolution","u":"offshore-wind.html#ex=vineyard","g":"Offshore wind"},
    {"t":"Casa dos Ventos","u":"onshore-wind.html#ex=casadosventos","g":"Onshore wind"},
    {"t":"Dumat Al Jandal","u":"onshore-wind.html#ex=dumat","g":"Onshore wind"},
    {"t":"ERCOT wind","u":"onshore-wind.html#ex=ercot","g":"Onshore wind"},
    {"t":"Golden Plains / Macarthur","u":"onshore-wind.html#ex=goldenplains","g":"Onshore wind"},
    {"t":"Longyuan onshore","u":"onshore-wind.html#ex=longyuan","g":"Onshore wind"},
    {"t":"Markbygden / Nordic onshore","u":"onshore-wind.html#ex=markbygden","g":"Onshore wind"},
    {"t":"Jebel Ali","u":"ports.html#ex=jebelali","g":"Ports"},
    {"t":"Port of Cartagena","u":"ports.html#ex=cartagena","g":"Ports"},
    {"t":"Port of Los Angeles","u":"ports.html#ex=la","g":"Ports"},
    {"t":"Port of Melbourne","u":"ports.html#ex=melbourne","g":"Ports"},
    {"t":"Port of Rotterdam","u":"ports.html#ex=rotterdam","g":"Ports"},
    {"t":"Port of Shanghai","u":"ports.html#ex=shanghai","g":"Ports"},
    {"t":"Chilean prison concession","u":"prisons.html#ex=chile","g":"Prisons"},
    {"t":"Chinese state custodial","u":"prisons.html#ex=china","g":"Prisons"},
    {"t":"Clarence Correctional Centre","u":"prisons.html#ex=clarence","g":"Prisons"},
    {"t":"Gulf custodial PPP","u":"prisons.html#ex=gulf","g":"Prisons"},
    {"t":"UK custodial PFI/DBFO","u":"prisons.html#ex=ukdbfo","g":"Prisons"},
    {"t":"US private corrections","u":"prisons.html#ex=uscorr","g":"Prisons"},
    {"t":"Bath County","u":"pumped-hydro.html#ex=bathcounty","g":"Pumped hydro"},
    {"t":"Coire Glas / Cruachan","u":"pumped-hydro.html#ex=coireglas","g":"Pumped hydro"},
    {"t":"Espejo de Tarapacá","u":"pumped-hydro.html#ex=espejo","g":"Pumped hydro"},
    {"t":"Fengning","u":"pumped-hydro.html#ex=fengning","g":"Pumped hydro"},
    {"t":"Hatta","u":"pumped-hydro.html#ex=hatta","g":"Pumped hydro"},
    {"t":"Snowy 2.0","u":"pumped-hydro.html#ex=snowy","g":"Pumped hydro"},
    {"t":"Beijing–Shanghai HSR","u":"rail-infrastructure.html#ex=beijingshanghai","g":"Rail infrastructure"},
    {"t":"Brightline","u":"rail-infrastructure.html#ex=brightline","g":"Rail infrastructure"},
    {"t":"Haramain HSR","u":"rail-infrastructure.html#ex=haramain","g":"Rail infrastructure"},
    {"t":"HS2","u":"rail-infrastructure.html#ex=hs2","g":"Rail infrastructure"},
    {"t":"TGV","u":"rail-infrastructure.html#ex=tgv","g":"Rail infrastructure"},
    {"t":"Tōkaidō Shinkansen","u":"rail-infrastructure.html#ex=tokaido","g":"Rail infrastructure"},
    {"t":"Australian MRF","u":"recycling-infrastructure.html#ex=aumrf","g":"Recycling infrastructure"},
    {"t":"Bee'ah","u":"recycling-infrastructure.html#ex=beeah","g":"Recycling infrastructure"},
    {"t":"Brazilian recycling","u":"recycling-infrastructure.html#ex=brmrf","g":"Recycling infrastructure"},
    {"t":"Chinese recycling","u":"recycling-infrastructure.html#ex=cnmrf","g":"Recycling infrastructure"},
    {"t":"UK MRF","u":"recycling-infrastructure.html#ex=ukmrf","g":"Recycling infrastructure"},
    {"t":"US single-stream MRF","u":"recycling-infrastructure.html#ex=usmrf","g":"Recycling infrastructure"},
    {"t":"407 ETR","u":"roads.html#ex=etr407","g":"Roads"},
    {"t":"Autostrade per l'Italia","u":"roads.html#ex=autostrade","g":"Roads"},
    {"t":"CCR","u":"roads.html#ex=ccr","g":"Roads"},
    {"t":"Gulf Highway PPP","u":"roads.html#ex=gulfppp","g":"Roads"},
    {"t":"Jiangsu Expressway","u":"roads.html#ex=expressway","g":"Roads"},
    {"t":"Transurban","u":"roads.html#ex=transurban","g":"Roads"},
    {"t":"Angel Trains","u":"rolling-stock.html#ex=angel","g":"Rolling stock"},
    {"t":"CRRC Financial Leasing","u":"rolling-stock.html#ex=crrc","g":"Rolling stock"},
    {"t":"GATX","u":"rolling-stock.html#ex=gatx","g":"Rolling stock"},
    {"t":"Lima Metro Line 2","u":"rolling-stock.html#ex=lima","g":"Rolling stock"},
    {"t":"Riyadh Metro","u":"rolling-stock.html#ex=riyadh","g":"Rolling stock"},
    {"t":"Sydney Growth Trains","u":"rolling-stock.html#ex=sydney","g":"Rolling stock"},
    {"t":"Alberta Schools P3","u":"schools.html#ex=alberta","g":"Schools"},
    {"t":"Belo Horizonte schools PPP","u":"schools.html#ex=belo","g":"Schools"},
    {"t":"Chinese schools PPP","u":"schools.html#ex=china","g":"Schools"},
    {"t":"Egypt / Gulf schools PPP","u":"schools.html#ex=egypt","g":"Schools"},
    {"t":"NSW schools PPP","u":"schools.html#ex=nsw","g":"Schools"},
    {"t":"UK BSF / PF2 schools bundle","u":"schools.html#ex=ukbsf","g":"Schools"},
    {"t":"Al Dhafra / Sweihan","u":"solar.html#ex=aldhafra","g":"Solar"},
    {"t":"Atacama solar","u":"solar.html#ex=atacama","g":"Solar"},
    {"t":"Australian solar farm","u":"solar.html#ex=ausolar","g":"Solar"},
    {"t":"Desert mega-base","u":"solar.html#ex=chinapv","g":"Solar"},
    {"t":"Iberian solar","u":"solar.html#ex=iberia","g":"Solar"},
    {"t":"US utility-scale solar","u":"solar.html#ex=ussolar","g":"Solar"},
    {"t":"American Campus Communities","u":"student-accommodation.html#ex=acc","g":"Student accommodation"},
    {"t":"Gulf student housing","u":"student-accommodation.html#ex=gulf","g":"Student accommodation"},
    {"t":"Scape","u":"student-accommodation.html#ex=scape","g":"Student accommodation"},
    {"t":"Student / co-living","u":"student-accommodation.html#ex=china","g":"Student accommodation"},
    {"t":"Uliving","u":"student-accommodation.html#ex=uliving","g":"Student accommodation"},
    {"t":"Unite Students","u":"student-accommodation.html#ex=unite","g":"Student accommodation"},
    {"t":"2Africa / PEACE","u":"subsea-cables.html#ex=twoafrica","g":"Subsea cables"},
    {"t":"Aqua Comms","u":"subsea-cables.html#ex=aquacomms","g":"Subsea cables"},
    {"t":"Asia Direct Cable / SEA-ME-WE 6","u":"subsea-cables.html#ex=asiacable","g":"Subsea cables"},
    {"t":"EllaLink","u":"subsea-cables.html#ex=ellalink","g":"Subsea cables"},
    {"t":"Google subsea","u":"subsea-cables.html#ex=google","g":"Subsea cables"},
    {"t":"Southern Cross","u":"subsea-cables.html#ex=southerncross","g":"Subsea cables"},
    {"t":"Brazilian / LatAm WtE","u":"waste-to-energy.html#ex=brazilwte","g":"Waste-to-energy"},
    {"t":"China Everbright-style WtE","u":"waste-to-energy.html#ex=chinawte","g":"Waste-to-energy"},
    {"t":"Covanta","u":"waste-to-energy.html#ex=covanta","g":"Waste-to-energy"},
    {"t":"Kwinana / Avertas","u":"waste-to-energy.html#ex=kwinana","g":"Waste-to-energy"},
    {"t":"UK / European EfW","u":"waste-to-energy.html#ex=ukefw","g":"Waste-to-energy"},
    {"t":"Warsan","u":"waste-to-energy.html#ex=warsan","g":"Waste-to-energy"},
    {"t":"American Water","u":"water-wastewater.html#ex=amwater","g":"Water & wastewater"},
    {"t":"Beijing Enterprises Water","u":"water-wastewater.html#ex=bewg","g":"Water & wastewater"},
    {"t":"National Water","u":"water-wastewater.html#ex=nwc","g":"Water & wastewater"},
    {"t":"Sabesp","u":"water-wastewater.html#ex=sabesp","g":"Water & wastewater"},
    {"t":"Sydney Water","u":"water-wastewater.html#ex=sydneywater","g":"Water & wastewater"},
    {"t":"United Utilities","u":"water-wastewater.html#ex=unitedutils","g":"Water & wastewater"}
  ];
  /* PROJECTS:END */

  /* ---------------- Deep-link: pre-select a worked asset from the URL hash ---------------- */
  (function () {
    function selectFromHash() {
      var m = (location.hash || '').match(/^#ex=(.+)$/);
      if (!m) return;
      var sel = document.getElementById('ixSelect');
      if (!sel) return;
      var key = decodeURIComponent(m[1]);
      if (sel.value === key) return;
      var ok = false;
      for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === key) { ok = true; break; } }
      if (!ok) return;
      sel.value = key;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    selectFromHash();
    window.addEventListener('hashchange', selectFromHash);
  })();

  /* ---------------- Previous / Next pager ---------------- */
  (function () {
    /* a linear tour through the reference library: asset-class pages + their
       sub-sectors, in INDEX order (skip Home/Compare/Community and the tools) */
    var SEQ = INDEX.filter(function (e) { return e.g !== 'Page' && e.g !== 'Tool'; });
    var idx = -1;
    for (var k = 0; k < SEQ.length; k++) { if (SEQ[k].u === here) { idx = k; break; } }
    var footer = document.querySelector('footer');
    if (idx < 0 || !footer) return;          /* not a tour page -> no pager */
    var prev = idx > 0 ? SEQ[idx - 1] : null;
    var next = idx < SEQ.length - 1 ? SEQ[idx + 1] : null;
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function card(e, dir) {
      if (!e) return '<span class="pager-link empty" aria-hidden="true"></span>';
      var label = dir === 'prev' ? 'Previous' : 'Next';
      var arrow = '<span class="pager-arrow">' + (dir === 'prev' ? '←' : '→') + '</span>';
      return '<a class="pager-link ' + dir + '" href="' + e.u + '">'
        + '<span class="pager-eyebrow">' + (dir === 'prev' ? arrow + label : label + arrow) + '</span>'
        + '<span class="pager-name">' + esc(e.t) + '</span>'
        + '<span class="pager-group">' + esc(e.g === 'Asset class' ? 'Asset class' : e.g) + '</span></a>';
    }
    var pager = document.createElement('nav');
    pager.className = 'pager' + (document.getElementById('ix') ? ' narrow' : '');
    pager.setAttribute('aria-label', 'Previous and next page');
    pager.innerHTML = card(prev, 'prev') + card(next, 'next');
    footer.parentNode.insertBefore(pager, footer);
  })();

  /* ---------------- Premium site footer (rebuilds every page's <footer>) ---------------- */
  (function () {
    var footer = document.querySelector('footer');
    if (!footer || footer.classList.contains('site-footer')) return;

    var cols = [
      { h: 'Asset classes', links: [
        ['Energy & Utilities', 'energy-utilities.html'],
        ['Transport', 'transport.html'],
        ['Digital infrastructure', 'digital-infrastructure.html'],
        ['Social infrastructure', 'social-infrastructure.html'],
        ['Energy transition', 'energy-transition.html'],
        ['Environmental & waste', 'environmental-waste.html']
      ]},
      { h: 'Tools & analysis', links: [
        ['Cash-flow & DCF model', 'cashflow-model.html'],
        ['Project finance & debt', 'project-finance.html'],
        ['Fund economics', 'fund-economics.html'],
        ['WACC calculator', 'wacc-calculator.html'],
        ['Macro dashboard', 'macro_dashboard.html'],
        ['Compare returns', 'compare.html'],
        ['Glossary A–Z', 'glossary.html']
      ]},
      { h: 'M&A & deals', links: [
        ['Infrastructure M&A', 'infrastructure-ma.html'],
        ['Deals database', 'infrastructure-deals.html'],
        ['Multiples map', 'multiples-map.html'],
        ['M&A in action', 'ma-in-action.html'],
        ['Community', 'community.html'],
        ['Contact', 'contact.html']
      ]}
    ];

    function esc(s) { return s.replace(/&/g, '&amp;'); }
    var html = '<div class="wrap">';
    html += '<div class="sf-top">';
    html += '<div class="sf-brand">' +
              '<a class="sf-mark" href="index.html" style="text-decoration:none">' +
                '<span class="brand-mark"><span></span></span>' +
                '<span class="brand-name">Infrastructure Investor</span>' +
              '</a>' +
              '<p class="sf-blurb">A reference and analysis platform for infrastructure capital, how each asset class earns, what it is worth, and how it trades.</p>' +
            '</div>';
    cols.forEach(function (c) {
      html += '<div class="sf-col"><h4>' + esc(c.h) + '</h4>';
      c.links.forEach(function (l) {
        var cur = l[1] === here ? ' aria-current="page"' : '';
        html += '<a href="' + l[1] + '"' + cur + '>' + esc(l[0]) + '</a>';
      });
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="sf-bottom">' +
              '<div class="sf-copy">© ' + (new Date().getFullYear()) + ' Infrastructure Investor · theinfrastructureinvestor.com</div>' +
              '<div class="sf-meta">Educational reference, not investment advice · <a href="start-here.html">Start here</a> · <a href="about.html">About &amp; methodology</a> · <a href="contact.html">Contact</a></div>' +
            '</div>';
    html += '</div>';

    footer.className = 'site-footer';
    footer.innerHTML = html;
  })();

  /* ---------------- Contact form (Web3Forms), contact.html only ---------------- */
  (function () {
    /* The form lives on its own page; everywhere else "Contact" is just a link. */
    var mount = document.getElementById('contact-mount');
    if (!mount) return;

    /* Get a free access key at https://web3forms.com, it is safe to expose in
       client code, and it keeps your email address out of the page source.
       Submissions are emailed to the address linked to the key, with the
       visitor's email set as Reply-To so you can reply directly. */
    var ACCESS_KEY = '9e75f662-1d6a-429f-bac9-32ec7018c756';

    var topics = ['General enquiry', 'Feedback', 'Investment or advisory',
                  'Partnerships or collaboration', 'Media or speaking', 'Something else'];
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

    mount.innerHTML =
      '<div class="contact-card">' +
        '<form class="contact-form" novalidate>' +
          '<div class="contact-grid">' +
            '<div class="contact-field full"><label for="cf-topic">What’s this about?</label>' +
              '<select id="cf-topic" name="topic">' +
                topics.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') +
              '</select></div>' +
            '<div class="contact-field"><label for="cf-name">Name</label>' +
              '<input id="cf-name" name="name" type="text" autocomplete="name" placeholder="Your name"></div>' +
            '<div class="contact-field"><label for="cf-email">Email <span class="req">*</span></label>' +
              '<input id="cf-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com"></div>' +
            '<div class="contact-field full"><label for="cf-msg">Message <span class="req">*</span></label>' +
              '<textarea id="cf-msg" name="message" required placeholder="How can I help?"></textarea></div>' +
          '</div>' +
          /* honeypot, hidden from users, catches bots */
          '<input type="checkbox" name="botcheck" class="cf-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<div class="contact-foot">' +
            '<button type="submit" class="contact-btn">Send message</button>' +
            '<span class="contact-status" role="status" aria-live="polite"></span>' +
          '</div>' +
          '<p class="contact-note">Your email is used only to reply to you, no newsletter, no sharing.</p>' +
        '</form>' +
      '</div>';

    var form = mount.querySelector('form'),
        statusEl = mount.querySelector('.contact-status'),
        btn = mount.querySelector('.contact-btn'),
        emailEl = mount.querySelector('#cf-email'),
        msgEl = mount.querySelector('#cf-msg'),
        sec = mount;
    function setStatus(msg, kind) { statusEl.textContent = msg; statusEl.className = 'contact-status' + (kind ? ' ' + kind : ''); }
    function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [emailEl, msgEl].forEach(function (el) { el.classList.remove('invalid'); });
      if (!emailOk(emailEl.value.trim())) { emailEl.classList.add('invalid'); ok = false; }
      if (msgEl.value.trim().length < 5) { msgEl.classList.add('invalid'); ok = false; }
      if (!ok) { setStatus('Please add a valid email and a short message.', 'err'); return; }
      if (ACCESS_KEY.indexOf('YOUR-') === 0) { setStatus('The form isn’t configured yet (add a Web3Forms access key).', 'err'); return; }

      var topic = sec.querySelector('#cf-topic').value;
      var payload = {
        access_key: ACCESS_KEY,
        subject: 'Contact, ' + topic,
        from_name: 'theinfrastructureinvestor.com',
        name: (sec.querySelector('#cf-name').value || '').trim(),
        email: emailEl.value.trim(),
        topic: topic,
        message: msgEl.value.trim(),
        page: location.pathname,
        botcheck: form.botcheck.checked ? 'true' : ''
      };
      btn.disabled = true; setStatus('Sending…', '');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (data) {
        if (data && data.success) { form.reset(); setStatus('Thanks, your message has been sent. I’ll be in touch.', 'ok'); }
        else { setStatus((data && data.message) || 'Something went wrong. Please try again.', 'err'); }
      }).catch(function () {
        setStatus('Network error, please try again in a moment.', 'err');
      }).then(function () { btn.disabled = false; });
    });
  })();

  /* ---------------- Shareable scenarios ----------------
     Any page with a live model (sliders / calculator inputs) gets a floating
     "Share scenario" button: the full input state is encoded into the URL hash
     (#s=id:value,…) so a calibrated scenario can be sent as a plain link.
     Opening such a link restores every control and re-fires the engines. */
  (function () {
    function modelControls() {
      var els = document.querySelectorAll('select[id], input[type="number"][id], input[type="range"][id]');
      var list = [];
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.closest('nav') || el.closest('.cmdk') || el.closest('#contact-mount') || el.closest('footer')) continue;
        list.push(el);
      }
      return list;
    }
    function applyHash() {
      var m = (location.hash || '').match(/^#s=(.+)$/);
      if (!m) return;
      var state = {};
      m[1].split(',').forEach(function (p) {
        var i = p.indexOf(':'); if (i < 1) return;
        state[decodeURIComponent(p.slice(0, i))] = decodeURIComponent(p.slice(i + 1));
      });
      /* selects first: picking an asset resets everything else to its preset,
         so the shared values must land after the preset does */
      ['SELECT', 'INPUT'].forEach(function (tag) {
        Object.keys(state).forEach(function (id) {
          var el = document.getElementById(id);
          if (!el || el.tagName !== tag || el.value === state[id]) return;
          el.value = state[id];
          el.dispatchEvent(new Event(tag === 'SELECT' ? 'change' : 'input', { bubbles: true }));
          if (tag === 'INPUT') el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
    }
    applyHash();
    window.addEventListener('hashchange', applyHash);

    var numeric = modelControls().filter(function (el) { return el.tagName === 'INPUT'; });
    if (numeric.length < 3) return;   /* not a model page, no button */

    function buildHash() {
      var parts = [];
      modelControls().forEach(function (el) {
        if (el.value === '' || el.value == null) return;
        parts.push(encodeURIComponent(el.id) + ':' + encodeURIComponent(el.value));
      });
      return '#s=' + parts.join(',');
    }
    function copyText(text, done) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { legacy(); });
      } else legacy();
      function legacy() {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta); done();
      }
    }

    var fab = document.createElement('button');
    fab.type = 'button'; fab.className = 'share-fab';
    fab.setAttribute('aria-label', 'Copy a link to this exact scenario');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg><span>Share scenario</span>';
    var toast = document.createElement('div');
    toast.className = 'share-toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(fab); document.body.appendChild(toast);

    var toastT = null;
    fab.addEventListener('click', function () {
      var hash = buildHash();
      try { history.replaceState(null, '', hash); } catch (_) {}
      copyText(location.origin + location.pathname + hash, function () {
        toast.textContent = 'Link copied — it reopens this exact scenario.';
        toast.classList.add('show');
        clearTimeout(toastT);
        toastT = setTimeout(function () { toast.classList.remove('show'); }, 2600);
      });
    });
  })();

  /* ---------------- Macro stress tests ----------------
     Pages with the shared calculator get a one-click scenario bar that reprices
     the model under canned macro shocks (rates, inflation, credit), applied as
     deltas to the live inputs and fully reversible via "Base case". */
  (function () {
    var grid = document.querySelector('.calc-grid');
    if (!grid) return;
    var P = document.getElementById('iRd')
          ? { rd: 'iRd', revG: 'iRevG', exit: 'iExit', lev: 'iLev' }
          : document.getElementById('aRd')
          ? { rd: 'aRd', revG: 'aRevG', exit: 'aExit', lev: 'aLev', wacc: 'aWacc', costG: 'aCostG' }
          : null;
    if (!P) return;

    var SCEN = [
      { key: 'base', label: 'Base case', d: 'The model’s own assumptions, untouched.', delta: {} },
      { key: 'rates', label: 'Rates +200bp', d: 'Long rates 200bp higher: cost of debt +2.0pt, discount rates up, exit multiples compress about 1.5×.', delta: { rd: 2, wacc: 2, exit: -1.5 } },
      { key: 'inflation', label: 'Inflation shock', d: 'CPI runs hot: indexed revenue grows about 1.5pt faster, costs and debt about 1pt dearer, multiples ease 0.5×.', delta: { revG: 1.5, costG: 1, rd: 1, exit: -0.5 } },
      { key: 'crunch', label: 'Credit crunch', d: 'Financing markets shut: debt +250bp with 1.5× turns less leverage, exits 2× lower on forced-seller pricing.', delta: { rd: 2.5, lev: -1.5, exit: -2 } }
    ];

    function fields() {
      var o = {};
      Object.keys(P).forEach(function (k) { var el = document.getElementById(P[k]); if (el) o[k] = el; });
      return o;
    }
    var snap = null, active = 'base';

    var bar = document.createElement('div');
    bar.className = 'stress-bar';
    var chipsHtml = SCEN.map(function (s) {
      return '<button type="button" class="stress-chip' + (s.key === 'base' ? ' on' : '') + '" data-k="' + s.key + '">' + s.label + '</button>';
    }).join('');
    bar.innerHTML = '<div class="stress-row"><span class="stress-lab">Stress test</span>' + chipsHtml + '</div>' +
                    '<p class="stress-note">' + SCEN[0].d + '</p>';
    grid.parentNode.insertBefore(bar, grid);
    var note = bar.querySelector('.stress-note');

    function setVal(el, v) {
      el.value = Math.round(v * 100) / 100;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    function paint() {
      bar.querySelectorAll('.stress-chip').forEach(function (c) { c.classList.toggle('on', c.dataset.k === active); });
    }
    function apply(sc) {
      var f = fields();
      if (sc.key === 'base') {
        if (snap) Object.keys(f).forEach(function (k) { if (k in snap) setVal(f[k], snap[k]); });
        snap = null;
      } else {
        if (!snap) { snap = {}; Object.keys(f).forEach(function (k) { snap[k] = parseFloat(f[k].value) || 0; }); }
        Object.keys(f).forEach(function (k) {
          var v = snap[k] + (sc.delta[k] || 0);
          if (k === 'lev') v = Math.max(0, v);
          if (k === 'exit') v = Math.max(1, v);
          setVal(f[k], v);
        });
      }
      active = sc.key; paint(); note.textContent = sc.d;
    }
    bar.addEventListener('click', function (e) {
      var chip = e.target.closest('.stress-chip'); if (!chip) return;
      var sc = null; SCEN.forEach(function (s) { if (s.key === chip.dataset.k) sc = s; });
      if (sc) apply(sc);
    });
    /* switching asset resets the calculator to that asset's preset, so the
       stored baseline no longer applies */
    var sel = document.getElementById('ixSelect') || document.getElementById('cfAsset');
    if (sel) sel.addEventListener('change', function () {
      snap = null; active = 'base'; paint(); note.textContent = SCEN[0].d;
    });
  })();

  /* ---------------- CSV export ----------------
     Every projection table (reference-page schedules, the cash-flow model grid,
     the M&A model grid) gets a "Download CSV" button so the numbers can be taken
     straight into a spreadsheet. Exports the table exactly as rendered. */
  (function () {
    var tables = document.querySelectorAll('table.ptable, table.cf-table, table.ptab');
    if (!tables.length) return;
    function cellOut(s) {
      var t = s.replace(/ /g, ' ').trim();
      var bare = t.replace(/,/g, '');
      var m = bare.match(/^\((\d+(?:\.\d+)?)\)$/);
      if (m) return '-' + m[1];                       /* (1,234) -> -1234 */
      if (/^-?\d+(\.\d+)?$/.test(bare)) return bare;  /* plain number */
      return '"' + t.replace(/"/g, '""') + '"';
    }
    function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
    tables.forEach(function (tb) {
      var host = tb.closest('.tscroll, .cf-scroll, .pscroll') || tb;
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'csv-btn';
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>Download CSV';
      btn.addEventListener('click', function () {
        var lines = [];
        tb.querySelectorAll('tr').forEach(function (tr) {
          var cells = [];
          tr.querySelectorAll('th,td').forEach(function (c) {
            cells.push(cellOut(c.textContent || ''));
            var span = parseInt(c.getAttribute('colspan') || '1', 10);
            for (var s = 1; s < span; s++) cells.push('');
          });
          lines.push(cells.join(','));
        });
        var name = slug((document.title.split('|')[0] || 'projection'));
        var sel = document.getElementById('ixSelect') || document.getElementById('cfAsset') || document.getElementById('maAsset');
        if (sel && sel.value) name += '-' + slug(sel.value);
        var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name + '.csv';
        document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      });
      host.parentNode.insertBefore(btn, host.nextSibling);
    });
  })();

  /* ---------------- Top navigation ---------------- */
  var wrap = document.querySelector('nav .wrap');
  if (wrap) {
    var meta = wrap.querySelector('.nav-meta');
    if (meta) meta.classList.add('nav-meta-hide');

    /* Upgrade the brand lockup (logo) into a mark + wordmark + descriptor */
    var logo = wrap.querySelector('.nav-logo');
    if (logo) {
      logo.classList.add('brand-lockup');
      logo.innerHTML =
        '<span class="brand-mark"><span></span></span>' +
        '<span class="brand-text">' +
          '<span class="brand-name">Infrastructure Investor</span>' +
          '<span class="brand-tag">Reference &amp; Analysis</span>' +
        '</span>';
    }

    var actions = document.createElement('div');
    actions.className = 'nav-actions';

    var menuOpen = []; // track open dropdowns to close on outside click
    function makeDropdown(label, items) {
      var dd = document.createElement('div');
      dd.className = 'nav-dd';
      var btn = document.createElement('button');
      btn.className = 'nav-link nav-dd-btn'; btn.type = 'button';
      btn.innerHTML = label + ' <span class="caret">▾</span>';
      var menu = document.createElement('div');
      menu.className = 'nav-dd-menu';
      var active = false;
      items.forEach(function (it) {
        var a = document.createElement('a');
        a.href = it.u; a.textContent = it.t;
        if (it.u === here) { a.className = 'on'; active = true; }
        menu.appendChild(a);
      });
      if (active) btn.classList.add('on');
      dd.appendChild(btn); dd.appendChild(menu);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = dd.classList.contains('open');
        menuOpen.forEach(function (d) { d.classList.remove('open'); });
        if (!wasOpen) dd.classList.add('open');
      });
      menuOpen.push(dd);
      return dd;
    }

    var toolItems = [
      { t: 'Cash-flow & DCF model', u: 'cashflow-model.html' },
      { t: 'Project finance & debt', u: 'project-finance.html' },
      { t: 'Fund economics', u: 'fund-economics.html' },
      { t: 'WACC calculator', u: 'wacc-calculator.html' },
      { t: 'Macro dashboard', u: 'macro_dashboard.html' },
      { t: 'Regulatory tracker', u: 'regulatory_tracker.html' },
      { t: 'RIIO-ED2 calculator', u: 'riio_ed2_calculator.html' },
      { t: 'Compare returns', u: 'compare.html' },
      { t: 'Glossary A–Z', u: 'glossary.html' }
    ];
    var maItems = [
      { t: 'Infrastructure M&A', u: 'infrastructure-ma.html' },
      { t: 'Deals database', u: 'infrastructure-deals.html' },
      { t: 'Multiples map', u: 'multiples-map.html' },
      { t: 'M&A in action', u: 'ma-in-action.html' }
    ];

    actions.appendChild(makeDropdown('Asset classes', classes));
    actions.appendChild(makeDropdown('Tools', toolItems));
    actions.appendChild(makeDropdown('M&amp;A', maItems));

    // Contact link
    var contactTop = document.createElement('a');
    contactTop.className = 'nav-link'; contactTop.href = 'contact.html'; contactTop.textContent = 'Contact';
    if (here === 'contact.html') contactTop.classList.add('on');

    // Search trigger
    var search = document.createElement('button');
    search.className = 'nav-search'; search.type = 'button';
    search.setAttribute('aria-label', 'Search the site');
    search.innerHTML = '<span class="ns-ico">⌕</span><span class="ns-txt">Search</span><kbd class="ns-kbd">' +
      (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K') + '</kbd>';

    actions.appendChild(contactTop);
    actions.appendChild(search);
    wrap.appendChild(actions);

    document.addEventListener('click', function () {
      menuOpen.forEach(function (d) { d.classList.remove('open'); });
    });

    /* subtle nav elevation once the page is scrolled */
    var navEl = document.querySelector('nav');
    if (navEl) {
      var onScroll = function () { navEl.classList.toggle('scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ---------------- Command palette ---------------- */
    var overlay = document.createElement('div');
    overlay.className = 'cmdk';
    overlay.innerHTML =
      '<div class="cmdk-box" role="dialog" aria-modal="true" aria-label="Search">' +
        '<div class="cmdk-in"><span class="cmdk-ico">⌕</span>' +
        '<input type="search" id="cmdkInput" placeholder="Search asset classes, sub-sectors, tools…" autocomplete="off" spellcheck="false">' +
        '<kbd class="cmdk-esc">esc</kbd></div>' +
        '<div class="cmdk-results" id="cmdkResults"></div>' +
        '<div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('#cmdkInput');
    var results = overlay.querySelector('#cmdkResults');
    var flat = [], sel = 0;

    function score(q, e) {
      var t = e.t.toLowerCase(), g = e.g.toLowerCase();
      if (!q) return 1;
      var i = t.indexOf(q);
      if (i === 0) return 1000;
      if (i > 0) return 600 - i;
      if (g.indexOf(q) >= 0) return 200;
      var kw = KEYWORDS[e.u]; if (kw && kw.indexOf(q) >= 0) return 150;
      // subsequence (fuzzy)
      var qi = 0; for (var k = 0; k < t.length && qi < q.length; k++) if (t[k] === q[qi]) qi++;
      return qi === q.length ? 80 : -1;
    }
    /* glossary terms (from glossary.js, loaded after this script) join the pool
       once there's a query, each deep-links into the A–Z glossary page */
    var GLOSS_POOL = null;
    function glossPool() {
      if (GLOSS_POOL) return GLOSS_POOL;
      var g = window.GLOSSARY; if (!g) return [];
      GLOSS_POOL = Object.keys(g).map(function (k) { return { t: g[k].t, u: 'glossary.html#' + k, g: 'Glossary' }; });
      return GLOSS_POOL;
    }
    function render() {
      var q = input.value.trim().toLowerCase();
      /* projects (individual worked assets) are only searched once there's a query,
         so the empty palette stays a clean map of pages, asset classes and tools */
      var pool = q ? INDEX.concat(PROJECTS, glossPool()) : INDEX;
      var scored = pool.map(function (e) { return { e: e, s: score(q, e) }; })
                        .filter(function (x) { return x.s >= 0; })
                        .sort(function (a, b) { return b.s - a.s; });
      if (q) scored = scored.slice(0, 50);
      var order = ['Page', 'Asset class', 'Energy & Utilities', 'Transport', 'Digital Infrastructure',
                   'Social Infrastructure', 'Energy Transition', 'Environmental & Waste', 'Tool', 'Glossary'];
      var groups = {}; scored.forEach(function (x) { (groups[x.e.g] = groups[x.e.g] || []).push(x.e); });
      flat = []; var html = '';
      var keys = Object.keys(groups).sort(function (a, b) {
        var ia = order.indexOf(a), ib = order.indexOf(b);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
      keys.forEach(function (g) {
        html += '<div class="cmdk-grp">' + g + '</div>';
        groups[g].forEach(function (e) {
          var i = flat.length; flat.push(e);
          html += '<a class="cmdk-row" data-i="' + i + '" href="' + e.u + '">' +
                  '<span class="cmdk-t">' + e.t + '</span><span class="cmdk-g">' + g + '</span></a>';
        });
      });
      if (!flat.length) html = '<div class="cmdk-empty">No matches for “' + (input.value || '') + '”</div>';
      results.innerHTML = html;
      sel = 0; highlight();
    }
    function highlight() {
      var rows = results.querySelectorAll('.cmdk-row');
      rows.forEach(function (r, i) { r.classList.toggle('on', i === sel); });
      var cur = rows[sel]; if (cur) cur.scrollIntoView({ block: 'nearest' });
    }
    function go() { var e = flat[sel]; if (e) location.href = e.u; }
    function open() {
      overlay.classList.add('show'); document.body.style.overflow = 'hidden'; input.value = ''; render();
      // focus reliably: the overlay animates in, so try now, next frame, and shortly after
      var f = function () { try { input.focus({ preventScroll: true }); } catch (_) { input.focus(); } };
      f(); requestAnimationFrame(f); setTimeout(f, 60);
    }
    function close() { overlay.classList.remove('show'); document.body.style.overflow = ''; }

    search.addEventListener('click', open);
    input.addEventListener('input', render);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    results.addEventListener('mousemove', function (e) {
      var row = e.target.closest('.cmdk-row'); if (row) { sel = +row.dataset.i; highlight(); }
    });
    document.addEventListener('keydown', function (e) {
      var isOpen = overlay.classList.contains('show');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); isOpen ? close() : open(); return; }
      if (!isOpen) {
        if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) { e.preventDefault(); open(); }
        return;
      }
      // palette is open, drive navigation from the document so it works even if
      // focus hasn't landed in the input yet
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, flat.length - 1); highlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); highlight(); }
      else if (e.key === 'Enter') { e.preventDefault(); go(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
  }
})();
