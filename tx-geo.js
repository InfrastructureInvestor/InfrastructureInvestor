/* Scene configuration for electricity-transmission.html, a side-elevation grid
   landscape drawn in 720x520 scene coordinates: generation (left) → step-up
   substation → a corridor of pylons carrying HV/HVDC lines → step-down
   substation → the demand city (right), with animated power flow and a
   RAB value-flow. Each network carries its real signature: the generation mix
   feeding it, the headline voltage, whether it runs HVDC, and the load city.
   Generation types the renderer understands:
     offshore · wind · solar · nuclear · coal · gas · hydro
*/
var GEO={

  /* ---------- National Grid ET (UK) · RAB-regulated, offshore-wind heavy ---------- */
  "nationalgrid":{
    gen:['offshore','offshore','nuclear','gas'],
    volt:'400 kV', hvdc:true, circuits:2, pylons:5,
    city:'LONDON', cityH:1.0,
    footer:'RAB-regulated transmission owner · 400 kV backbone + HVDC · GB grid' },

  /* ---------- ITC Holdings (USA) · FERC formula-rate, Midwest ---------- */
  "itc":{
    gen:['wind','gas','coal'],
    volt:'345 / 765 kV', hvdc:false, circuits:2, pylons:5,
    city:'DETROIT', cityH:0.92,
    footer:'FERC formula-rate independent transmission · 345 / 765 kV AC · US Midwest' },

  /* ---------- ISA CTEEP (Brazil) · ANEEL availability concession (RAP), hydro ---------- */
  "cteep":{
    gen:['hydro','hydro','wind'],
    volt:'500 kV', hvdc:true, circuits:2, pylons:6,
    city:'SÃO PAULO', cityH:0.96,
    footer:'ANEEL availability concession (RAP) · 500 kV AC + ±600 kV HVDC · Brazil' },

  /* ---------- TransGrid (Australia) · AER revenue-cap, privatised, REZ buildout ---------- */
  "transgrid":{
    gen:['wind','solar','coal'],
    volt:'330 / 500 kV', hvdc:false, circuits:2, pylons:5,
    city:'SYDNEY', cityH:0.9,
    footer:'Privatised, AER revenue-cap regulated · 330 / 500 kV AC · NSW renewable-zone buildout' },

  /* ---------- National Grid SA (Saudi Arabia) · state-owned, solar + HVDC ---------- */
  "saudi":{
    gen:['solar','solar','gas'],
    volt:'380 kV', hvdc:true, circuits:2, pylons:5,
    city:'RIYADH', cityH:0.94,
    footer:'State-owned transmission · 380 kV AC + HVDC links · Vision 2030 solar buildout' },

  /* ---------- State Grid (China) · state-owned UHV, west-to-east ---------- */
  "stategrid":{
    gen:['hydro','coal','wind'],
    volt:'±1100 kV UHV', hvdc:true, circuits:2, pylons:6,
    city:'SHANGHAI', cityH:1.0,
    footer:'State-owned · ±1100 kV UHV DC + 1000 kV UHV AC · west-to-east mega-transfer' }
};
