/* Scene configuration for water-wastewater.html, a top-down water cycle drawn
   in 720x520: a source (reservoir / river / desalination from the sea) feeds a
   water treatment works, clean water flows to the town, wastewater drains via
   sewers to a wastewater treatment works, and treated effluent is discharged to
   a river or the sea. Each utility's signature: the source type, whether it also
   does wastewater (a WaSC), how much it leaks, and the area it serves.
   Source types the renderer understands:  reservoir · river · desal */
var GEO={
  "unitedutils":{ source:'reservoir', waste:true, leakage:0.22, area:'NORTH-WEST ENGLAND',
    footer:'Listed water & sewerage company · Ofwat PR24 RAB · record capex' },
  "amwater":{     source:'river',     waste:true, leakage:0.18, area:'US · MULTI-STATE',
    footer:'Investor-owned utility · state PUC rate base + ROE · municipal roll-up' },
  "sabesp":{      source:'reservoir', waste:true, leakage:0.28, area:'SÃO PAULO',
    footer:'Recently privatised concession · universal-access + sewerage targets' },
  "sydneywater":{ source:'reservoir', waste:true, leakage:0.10, area:'SYDNEY',
    footer:'State-owned corporation · IPART price regulation · desalination backup' },
  "nwc":{         source:'desal',     waste:true, leakage:0.20, area:'SAUDI ARABIA',
    footer:'State utility · desalination-fed · fast network investment' },
  "bewg":{        source:'river',     waste:true, leakage:0.15, area:'CHINA',
    footer:'Listed water & wastewater · BOT / concession · growth' }
};
