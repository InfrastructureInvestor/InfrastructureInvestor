/* Map geometry for rail-infrastructure.html — intercity high-speed corridors drawn at
   "covers a large distance" grade: a long rail line crossing a region, with the coast/sea
   alongside for orientation. [lng,lat] rings + route, projected in-page. Not survey-grade:
   simplified to read clearly at small size, faithful in orientation, alignment and the
   cities the line links. `sea` rings are water (drawn blue); `land` rings are optional
   terrain regions for shading. */
var GEO={

  /* ---------- 1 · HS2 · London ⇄ Birmingham (Phase 1, inland) ---------- */
  "hs2":{"bb":[-2.20,51.36,0.10,52.66],
    "sea":[
      ["North Sea",[[0.10,52.66],[0.10,51.36],[-0.10,51.42],[-0.18,51.55],[-0.05,51.72],[0.02,51.95],[-0.04,52.20],[0.04,52.45],[0.00,52.66]]]
    ],
    "land":[
      ["Chilterns",[[-1.10,51.66],[-0.55,51.84],[-0.62,52.00],[-1.18,51.98],[-1.42,51.82],[-1.30,51.66]]]
    ]},

  /* ---------- 2 · TGV · Paris ⇄ Lyon ⇄ Marseille (LGV Sud-Est + Méditerranée) ---------- */
  "tgv":{"bb":[-0.40,42.90,6.30,49.30],
    "sea":[
      ["Mediterranean",[[6.30,42.90],[3.90,42.90],[4.30,43.18],[4.95,43.32],[5.20,43.20],[5.40,43.30],[5.70,43.22],[6.10,43.05],[6.30,43.10]]],
      ["Atlantic",[[-0.40,49.30],[-0.40,46.30],[-0.22,46.70],[-0.30,47.40],[-0.20,48.20],[-0.34,48.90],[-0.20,49.30]]]
    ],
    "land":[]},

  /* ---------- 3 · TŌKAIDŌ SHINKANSEN · Tokyo ⇄ Nagoya ⇄ Osaka ---------- */
  "tokaido":{"bb":[134.85,33.85,140.55,36.30],
    "sea":[
      ["Pacific Ocean",[[134.85,33.85],[140.55,33.85],[140.55,35.05],[139.85,34.92],[139.10,34.58],[138.30,34.60],[137.45,34.62],[136.85,34.74],[136.05,34.40],[135.45,34.52],[134.85,34.55]]],
      ["Sea of Japan",[[134.85,36.30],[140.55,36.30],[140.10,36.00],[139.10,36.05],[138.10,36.10],[137.00,36.02],[136.00,35.78],[135.10,35.62],[134.85,35.60]]]
    ],
    "land":[]},

  /* ---------- 4 · BRIGHTLINE · Miami ⇄ West Palm Beach ⇄ Orlando ---------- */
  "brightline":{"bb":[-81.75,25.50,-79.90,28.70],
    "sea":[
      ["Atlantic Ocean",[[-79.90,28.70],[-79.90,25.50],[-80.18,25.55],[-80.12,26.10],[-80.04,26.70],[-80.03,27.25],[-80.10,27.95],[-80.32,28.45],[-80.55,28.70]]],
      ["Gulf",[[-81.75,25.50],[-81.75,27.30],[-81.62,26.90],[-81.55,26.30],[-81.62,25.85],[-81.55,25.50]]]
    ],
    "land":[]},

  /* ---------- 5 · HARAMAIN · Mecca ⇄ Jeddah/KAEC ⇄ Medina (Red Sea coast) ---------- */
  "haramain":{"bb":[38.55,21.00,40.85,24.70],
    "sea":[
      ["Red Sea",[[38.55,21.00],[38.55,24.70],[39.06,24.55],[39.12,23.70],[38.98,22.85],[39.04,22.00],[39.14,21.45],[39.22,21.00]]]
    ],
    "land":[]},

  /* ---------- 6 · BEIJING–SHANGHAI HSR · the North China trunk line ---------- */
  "beijingshanghai":{"bb":[114.90,30.30,122.90,40.40],
    "sea":[
      ["Bohai / Yellow Sea",[[122.90,40.40],[122.90,30.30],[121.55,30.55],[121.05,31.90],[120.55,33.40],[120.95,35.00],[119.45,37.10],[118.95,38.30],[119.40,39.20],[122.10,40.05]]]
    ],
    "land":[]}
};
