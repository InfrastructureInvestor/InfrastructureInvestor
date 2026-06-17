/* Per-asset facility configuration for data-centres.html. The facility plan
   (building, substation, generators, chillers, meet-me room, value-flow paths)
   is drawn in scene coordinates (720 x 520) by dc-centres.js; this file only
   carries the per-asset flavour: power source, cooling type, interconnection
   density and an AI/high-density flag. */
var GEO={
  equinix:{ power:'grid', cooling:'air',  dense:true,  ai:false },   /* retail colo + dense interconnection */
  nova:   { power:'grid', cooling:'air',  dense:false, ai:true  },   /* hyperscale wholesale, AI density */
  ascenty:{ power:'hydro',cooling:'air',  dense:false, ai:false },   /* Brazil — clean/hydro grid */
  airtrunk:{power:'grid', cooling:'liquid',dense:false,ai:true  },   /* hyperscale, liquid-cooled AI */
  khazna: { power:'solar',cooling:'liquid',dense:false,ai:true  },   /* desert heat, nuclear+solar, AI */
  gds:    { power:'mixed',cooling:'free', dense:true,  ai:false }    /* China, western free-cooling */
};
