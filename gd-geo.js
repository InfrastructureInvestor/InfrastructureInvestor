/* Scene configuration for gas-distribution.html, a top-down town gas network
   drawn in 720x520: a city gate (taking gas from the transmission grid) feeds
   medium-pressure gas mains along the streets to district governors (pressure
   reduction), then service connections to homes (gas boilers), commercial and
   industry. Each network's signature: hydrogen-readiness, whether it is still
   growing (connecting homes) or mature/declining, pressure tiers and area. */
var GEO={
  "cadent":{  h2:true,  growth:'mature', press:'7 bar → 2 bar → mbar', area:'CENTRAL & NORTH ENGLAND',
    footer:'Privatised GDN · RIIO-GD2 RAB · iron-mains replacement · hydrogen trials' },
  "socalgas":{ h2:false, growth:'mature', press:'high / medium / low', area:'SOUTHERN CALIFORNIA',
    footer:'Investor-owned utility · CPUC rate base + ROE · largest US gas distributor' },
  "comgas":{  h2:false, growth:'grow',   press:'17 bar → low', area:'SÃO PAULO',
    footer:'Privatised concession · ARSESP price cap · connecting a growing city' },
  "agig":{    h2:true,  growth:'mature', press:'7 bar → low', area:'SOUTH AUSTRALIA',
    footer:'Privatised · AER revenue cap · hydrogen-blending trials (HyP)' },
  "egypt":{   h2:false, growth:'grow',   press:'medium → low', area:'GREATER CAIRO',
    footer:'State programme · rapid household connection growth' },
  "enn":{     h2:false, growth:'grow',   press:'medium → low', area:'CHINA · CITY GAS',
    footer:'Listed city-gas distributor · connections + gas sales · fast growth' }
};
