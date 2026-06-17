/* Stylised harbour layouts for ports.html — drawn directly in scene coordinates
   (720 x 520), sea as the background and land/structures on top. Schematic, not
   geographic: each port keeps a recognisable signature (Jebel Ali's breakwater
   arms, Yangshan's offshore island + Donghai Bridge, LA's federal breakwater,
   Cartagena's sheltered bay) but the layout is a clean operator's-eye plan. */
var GEO={

  /* ---------- Rotterdam · Maasvlakte 2 at the North Sea mouth (base layout) ---------- */
  "rotterdam":{ quayX:348, quayTop:64, quayBot:456, channelY:300,
    land:[
      [[348,0],[720,0],[720,520],[348,520]],
      [[0,0],[348,0],[348,64],[210,50],[80,44],[0,50]],
      [[0,520],[348,520],[348,456],[200,470],[80,478],[0,472]]
    ],
    yard:{x:360,y:64,w:190,h:392},
    berths:[104,180,256,332,408] },

  /* ---------- Los Angeles · San Pedro Bay behind the federal breakwater ---------- */
  "la":{ quayX:356, quayTop:66, quayBot:454, channelY:280,
    land:[
      [[356,0],[720,0],[720,520],[356,520]],
      [[0,0],[356,0],[356,66],[220,52],[90,46],[0,52]],
      [[0,520],[356,520],[356,454],[230,468],[120,476],[0,470]]
    ],
    breakwaters:[[120,96,120,250,11],[120,316,120,432,11]],
    yard:{x:368,y:66,w:184,h:388},
    berths:[110,184,300,392,432] },

  /* ---------- Cartagena · sheltered Caribbean bay, two terminals ---------- */
  "cartagena":{ quayX:360, quayTop:70, quayBot:452, channelY:264,
    land:[
      [[360,0],[720,0],[720,520],[360,520]],
      [[0,0],[360,0],[360,70],[230,58],[120,52],[0,58]],
      [[0,520],[360,520],[360,452],[230,466],[110,474],[0,468]],
      [[44,86],[150,74],[166,182],[120,210],[52,196]],
      [[44,330],[140,322],[158,452],[120,470],[44,460]]
    ],
    yard:{x:372,y:70,w:178,h:382},
    berths:[126,206,300,392] },

  /* ---------- Melbourne · Port Phillip Bay at the Yarra mouth ---------- */
  "melbourne":{ quayX:352, quayTop:64, quayBot:456, channelY:300,
    land:[
      [[352,0],[720,0],[720,520],[352,520]],
      [[0,0],[352,0],[352,64],[470,52],[540,30],[560,64],[470,80],[352,96],[210,72],[80,66],[0,72]],
      [[0,520],[352,520],[352,456],[200,470],[80,478],[0,472]]
    ],
    yard:{x:364,y:104,w:190,h:352},
    berths:[150,232,318,404] },

  /* ---------- Jebel Ali · the world's largest man-made harbour ---------- */
  "jebelali":{ quayX:360, quayTop:60, quayBot:460, channelY:262,
    land:[
      [[360,0],[720,0],[720,520],[360,520]],
      [[0,0],[360,0],[360,60],[230,48],[100,42],[0,48]],
      [[0,520],[360,520],[360,460],[230,472],[100,478],[0,472]]
    ],
    breakwaters:[[44,86,250,72,12],[250,72,316,150,12],[44,440,250,452,12],[250,452,316,372,12]],
    yard:{x:372,y:60,w:186,h:400},
    berths:[104,180,256,332,408] },

  /* ---------- Shanghai · offshore Yangshan island + the Donghai Bridge ---------- */
  "shanghai":{ quayX:300, quayTop:64, quayBot:456, channelY:300,
    land:[
      [[300,64],[540,64],[540,456],[300,456]],
      [[690,0],[720,0],[720,520],[690,520]]
    ],
    bridge:[[540,300],[690,300]],
    roadEnd:534,
    yard:{x:312,y:64,w:168,h:392},
    berths:[104,180,256,332,408] }
};
