/* Scene configuration for student-accommodation.html, a top-down / elevation view
   of a PURPOSE-BUILT STUDENT ACCOMMODATION (PBSA) scheme, drawn in 720x520 scene
   coordinates: a multi-storey accommodation block (or two) with a grid of room
   windows, a ground-floor common room / reception / gym amenity, a courtyard, and
   a few students and bikes outside. OCCUPIED rooms are lit (a warm desk lamp);
   empty rooms are dark, the lit fraction = occupancy. Each scheme carries its own
   signature: the tier (prime / value / amenity-rich), the university market it
   serves (global / regional), whether it is leasing up (growing), and the area.
   tier the renderer understands:  prime · value · amenity-rich */
var GEO={

  /* ---------- Unite Students (Europe) · listed UK PBSA REIT ---------- */
  "unite":{ tier:'prime', university:'global', growing:true,
    area:'UNITED KINGDOM CITIES',
    footer:'Listed UK PBSA REIT · nomination agreements + direct-let · prime city locations' },

  /* ---------- American Campus Communities (North America) · US PBSA leader ---------- */
  "acc":{ tier:'value', university:'global', growing:false,
    area:'ON & NEAR-CAMPUS, USA',
    footer:'US PBSA leader (Blackstone-owned) · on/near-campus · annual academic-year leasing' },

  /* ---------- Uliving / Brazil (South America) · emerging PBSA ---------- */
  "uliving":{ tier:'value', university:'regional', growing:true,
    area:'BRAZIL · SÃO PAULO & STATES',
    footer:'Emerging LatAm PBSA · structural under-supply · growth + emerging-market rates' },

  /* ---------- Scape / Australia (Oceania) · prime amenity-rich ---------- */
  "scape":{ tier:'amenity-rich', university:'global', growing:true,
    area:'AUSTRALIAN CAPITAL CITIES',
    footer:'Prime amenity-rich PBSA · international-student demand · direct-let premium' },

  /* ---------- Gulf student housing (Middle East) · emerging ---------- */
  "gulf":{ tier:'value', university:'regional', growing:true,
    area:'GULF · UAE & SAUDI ARABIA',
    footer:'Emerging Gulf student housing · university partnerships · build-ahead-of-demand' },

  /* ---------- Chinese student / co-living (China) · illustrative scale ---------- */
  "china":{ tier:'value', university:'regional', growing:true,
    area:'CHINESE UNIVERSITY CITIES',
    footer:'Student / co-living at scale · mass demand · thin rents, vast occupancy base' }
};
