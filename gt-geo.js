/* Scene configuration for gas-transmission.html — a top-down high-pressure gas
   network drawn in 720x520 scene coordinates: entry points on the left (an LNG
   import terminal, a gas field, a cross-border interconnector) feed a trunk
   pipeline that runs across the scene through compressor stations, with offtakes
   to a power station, industry, a city gate (to distribution) and storage.
   Each network carries its real signature: the entry mix, how many compressor
   stations, whether it has large storage, and the area it serves.
   Entry types the renderer understands:  lng · field · interconnector */
var GEO={

  /* ---------- Snam (Europe) · listed RAB-regulated TSO, Italy ---------- */
  "snam":{
    entries:['lng','interconnector','field'], compressors:3, storage:true, offtakes:['power','industry','citygate'],
    press:'75 bar', area:'ITALY · SOUTHERN EUROPE',
    footer:'Listed RAB-regulated TSO · import + transit hub · hydrogen-ready' },

  /* ---------- Williams / Transco (North America) · FERC contracted pipeline ---------- */
  "williams":{
    entries:['field','field'], compressors:4, storage:true, offtakes:['power','citygate','industry'],
    press:'1,000 psi', area:'US GULF → NORTH-EAST',
    footer:'FERC-regulated · long-term contracted capacity · shale gas to demand' },

  /* ---------- TGS (South America) · privatised pipeline, Vaca Muerta ---------- */
  "tgs":{
    entries:['field','field'], compressors:3, storage:false, offtakes:['citygate','power'],
    press:'70 bar', area:'ARGENTINA · VACA MUERTA',
    footer:'Privatised, ENARGAS-regulated · Vaca Muerta shale takeaway' },

  /* ---------- APA Group (Oceania) · listed, contracted / light-handed ---------- */
  "apa":{
    entries:['field','field'], compressors:3, storage:false, offtakes:['power','industry','citygate'],
    press:'15 MPa', area:'EAST-COAST AUSTRALIA',
    footer:'Listed pipeline owner · mostly contracted / light-handed regulation' },

  /* ---------- Aramco Gas Pipelines (Middle East) · state asset leased to a consortium ---------- */
  "aramco":{
    entries:['field','field'], compressors:4, storage:true, offtakes:['industry','power'],
    press:'100 bar', area:'SAUDI ARABIA',
    footer:'State network · usage rights leased to a consortium · take-or-pay' },

  /* ---------- PipeChina (China) · state national pipeline network ---------- */
  "pipechina":{
    entries:['lng','field','interconnector'], compressors:4, storage:true, offtakes:['citygate','power','industry'],
    press:'10 MPa', area:'CHINA · WEST–EAST',
    footer:'State-owned national network · LNG + imports + domestic · west-to-east' }
};
