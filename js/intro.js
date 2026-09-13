/* =========================================================
   INTRO — the name full-screen; the two words part to flash a few photos,
   then the burgundy curtain lifts onto the hero (~2s in total).
   Runs only when the gate script in <head> added .intro-on
   (first visit of the session, no prefers-reduced-motion).
   Skip: click / tap, wheel or scroll, any key.
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var intro = document.getElementById("intro");
  if (!intro) return;
  if (!root.classList.contains("intro-on")) { intro.remove(); return; }

  var win = intro.querySelector(".intro__window");
  var photos = (window.PORTFOLIO && window.PORTFOLIO.intro) || [];
  var imgs = photos.map(function (src) {
    var im = new Image();
    im.src = src;
    im.alt = "";
    im.decoding = "async";
    return im;
  });
  var timers = [];
  var done = false;
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

  // only flash photos that are already loaded, so nothing pops in half-drawn
  function show(i) {
    var im = imgs[i];
    if (im && im.complete && im.naturalWidth) win.replaceChildren(im);
  }

  at(600, function () { intro.classList.add("is-open"); show(0); });
  at(770, function () { show(1); });
  at(930, function () { show(2); });
  at(1090, function () { show(3); });
  at(1250, function () { finish(false); });

  function finish(fast) {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    stopListening();
    if (fast) intro.classList.add("is-fast");
    intro.classList.add("is-out");
    root.classList.remove("hero-hold"); // the hero title rises while the curtain lifts
    setTimeout(function () {
      root.classList.remove("intro-on");
      intro.remove();
    }, fast ? 460 : 780);
  }

  function skip() { finish(true); }
  var events = ["pointerdown", "wheel", "touchmove", "keydown", "scroll"];
  events.forEach(function (ev) { window.addEventListener(ev, skip, { passive: true }); });
  function stopListening() {
    events.forEach(function (ev) { window.removeEventListener(ev, skip); });
  }
})();
