/* =========================================================
   HERO ON A TOUCH PHONE — "the table" (app version, no mouse: on a desktop the photos
   follow the pointer, script.js). The photos of data/hero.js fall in one after another
   and lie around the name and under it, straight and in close sizes like the desktop
   trail; now and then a new one lands and the oldest fades. A tap drops one where the
   finger touched. Scrolling on to About lifts them, each at its own speed. It never
   holds the page: taps only, nothing to drag. The greeting comes in after the first
   photos (app.css, .has-table). With reduced motion the photos simply lie there.
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var hero = document.querySelector(".hero");
  var layer = hero && hero.querySelector(".trail");
  if (!hero || !layer || !root.classList.contains("is-app") ||
      !window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

  var hi = (window.devicePixelRatio || 1) > 1.5;
  var pool = ((window.PORTFOLIO && window.PORTFOLIO.hero) || []).map(function (p) {
    return typeof p === "string" ? p : (hi && p.srcHi) || p.src;
  });
  if (!pool.length) return;

  root.classList.add("has-table");        // script.js leaves out its photo stack
  hero.classList.add("is-table");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SIZES = [1, 0.8, 1.25, 0.9, 1.15];                       // the desktop trail's sizes (--s)
  var DEPTH = [0.55, 0.25, 0.42, 0.18, 0.5, 0.3, 0.62];        // how fast each rises while scrolling
  // the first seven, in percent of the hero: two high, one on each end of the name, three low
  var SLOTS = [[0.24, 0.17], [0.74, 0.13], [0.88, 0.44], [0.12, 0.6], [0.5, 0.24], [0.33, 0.79], [0.76, 0.75]];
  var MAX = 7, EVERY = 2600;
  var n = 0, alive = [], loop = 0, visible = true, tapped = false;

  // the first photos load at once, the others when the phone is idle
  var cache = [];
  function load(k) {
    if (!cache[k]) { cache[k] = new Image(); cache[k].decoding = "async"; cache[k].src = pool[k]; }
    return cache[k];
  }
  for (var k = 0; k < Math.min(SLOTS.length, pool.length); k++) load(k);
  (window.requestIdleCallback || function (f) { setTimeout(f, 1500); })(function () { pool.forEach(function (_, i) { load(i); }); });

  function W() { return hero.clientWidth; }
  function H() { return hero.clientHeight; }
  function lift(img, y) { if (!reduce) img.style.translate = "0 " + (-y * img._d).toFixed(1) + "px"; }

  function drop(x, y, kind) {
    var i = n++ % pool.length;
    var src = load(i);
    var img = document.createElement("img");
    img.className = "table__img" + (reduce ? "" : " is-" + kind);
    img.alt = "";
    img.decoding = "async";
    img.src = pool[i];
    img._d = DEPTH[(n - 1) % DEPTH.length];
    img.style.setProperty("--s", SIZES[(n - 1) % SIZES.length]);
    var scrolled = window.scrollY;
    img.style.left = x + "px";
    img.style.top = (y + (reduce ? 0 : scrolled * img._d)) + "px";   // where the finger is, whatever the lift
    lift(img, scrolled);
    // only once the picture is there, so it never lands half drawn
    function place() {
      layer.appendChild(img);
      alive.push(img);
      while (alive.length > MAX) leave(alive.shift());
    }
    if (src.complete && src.naturalWidth) place();
    else src.addEventListener("load", place, { once: true });
  }
  function leave(img) {
    if (img._out) return;
    img._out = true;
    if (reduce) { img.remove(); return; }
    img.classList.add("is-out");
    setTimeout(function () { img.remove(); }, 700);
  }

  // now and then a new one: above or below the name, sometimes at one of its ends
  function more() {
    if (visible && !document.hidden && root.getAttribute("data-tab") === "home") {
      var band = Math.random();
      var y = band < 0.45 ? 0.08 + Math.random() * 0.2 : band < 0.9 ? 0.68 + Math.random() * 0.12 : 0.4 + Math.random() * 0.2;
      var x = band >= 0.9 ? (Math.random() < 0.5 ? 0.1 : 0.9) : 0.14 + Math.random() * 0.72;
      drop(x * W(), y * H(), "drop");
    }
    loop = setTimeout(more, EVERY);
  }

  // a tap: a photo where the finger was
  hero.addEventListener("click", function (e) {
    var r = hero.getBoundingClientRect();
    drop(e.clientX - r.left, e.clientY - r.top, "tap");
    if (!tapped) { tapped = true; hero.classList.add("hint-gone"); }
    if (!reduce) { clearTimeout(loop); loop = setTimeout(more, EVERY + 600); }
  });

  // scrolling on to About: each photo rises at its own speed
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking || reduce) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (root.getAttribute("data-tab") !== "home") return;
      var y = window.scrollY;
      alive.forEach(function (img) { lift(img, y); });
      if (y > 120 && !tapped) hero.classList.add("hint-gone");
    });
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(hero);
  }

  // the hint, in the place of the desktop's "Move your mouse"
  var hint = hero.querySelector(".hero__hint");
  if (hint && hint.firstChild && hint.firstChild.nodeType === 3) hint.firstChild.nodeValue = "Tap ";

  SLOTS.forEach(function (s, k) {
    if (reduce) drop(s[0] * W(), s[1] * H(), "drop");
    else setTimeout(function () { drop(s[0] * W(), s[1] * H(), "drop"); }, 150 + k * 190);
  });
  if (!reduce) {
    setTimeout(function () { if (!tapped) hero.classList.add("hint-on"); }, 2600);
    loop = setTimeout(more, 4300);
  } else hero.classList.add("hint-on");
})();
