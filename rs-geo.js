/* Scene configuration for rolling-stock.html, a top-down TRAIN DEPOT and
   RUNNING LINE, drawn in 720x520 scene coordinates: a stabling depot on the left
   with parallel sidings and a maintenance shed (where the unavailable fleet sits),
   and a mainline running line across the canvas where in-service trains run and
   loop. Each ROSCO / lessor carries its own signature: the stock type (passenger
   EMU, freight railcars, metro set or locomotive), the livery colour, whether the
   lease is full-service (maintenance bundled), the area label and the footer.
   stock the renderer understands:  emu · freight · metro · loco */
var GEO={

  /* ---------- Angel Trains (Europe) · UK ROSCO, full-service EMU leasing ---------- */
  "angel":{ stock:'emu', livery:'#b5402f', fullService:true,
    area:'GREAT BRITAIN',
    footer:'ROSCO · full-service EMU/passenger leasing to TOCs · residual-value risk · infra-fund owned' },

  /* ---------- GATX (North America) · freight railcar leasing ---------- */
  "gatx":{ stock:'freight', livery:'#7d6a4f', fullService:false,
    area:'NORTH AMERICA',
    footer:'Railcar lessor · operating-lease freight fleet · cyclical · residual risk · NYSE-listed' },

  /* ---------- Lima Metro Line 2 (South America) · availability rolling-stock PPP ---------- */
  "lima":{ stock:'metro', livery:'#1f6f8b', fullService:true,
    area:'LIMA, PERU',
    footer:'Rolling-stock PPP · availability-based metro provision · transport concession · EM' },

  /* ---------- Sydney Growth Trains (Oceania) · availability-payment PPP ---------- */
  "sydney":{ stock:'emu', livery:'#1d6f4c', fullService:true,
    area:'NEW SOUTH WALES, AUSTRALIA',
    footer:'Availability-payment PPP · government pays for available trains · no demand risk' },

  /* ---------- Riyadh Metro (Middle East) · availability metro PPP ---------- */
  "riyadh":{ stock:'metro', livery:'#3a6ea5', fullService:true,
    area:'RIYADH, SAUDI ARABIA',
    footer:'Driverless-metro rolling stock · availability PPP · state-backed · maintenance bundled' },

  /* ---------- CRRC financial leasing (China) · finance leasing at scale ---------- */
  "crrc":{ stock:'loco', livery:'#c0392b', fullService:false,
    area:'CHINA',
    footer:'Financial leasing · CRRC-linked · finance leases at vast scale · low cost of capital' }
};
