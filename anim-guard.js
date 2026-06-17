/* Respect prefers-reduced-motion: let each simulation paint, then freeze it on a
   static frame instead of animating indefinitely. No-op for everyone else, so
   visitors without the preference get the full animation, unchanged. */
(function () {
  try {
    var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq || !mq.matches) return;                 // motion is fine — do nothing
    var native = window.requestAnimationFrame.bind(window);
    var frames = 0, WARMUP = 90;                    // ~1.5s: scene draws + KPIs/DCF settle
    window.requestAnimationFrame = function (cb) {
      if (frames++ < WARMUP) return native(cb);
      return 0;                                       // then stop re-scheduling the loop
    };
  } catch (e) { /* leave native behaviour intact on any error */ }
})();
