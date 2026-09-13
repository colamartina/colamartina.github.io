/* =========================================================
   MARTINA COLA — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Working copy (localhost / file://) vs published site: [TODO] notes are shown
  // only while editing. Add ?live to the address to preview the published look.
  var isLocal = (location.protocol === "file:" ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) &&
    !/[?&]live(&|=|$)/.test(location.search);
  if (isLocal) document.documentElement.classList.add("is-dev");

  // Hero photo pool from data/hero.js (retina files on high-density screens);
  // falls back to the original trail images if the data file is missing.
  function heroPool() {
    var hi = (window.devicePixelRatio || 1) > 1.5;
    var list = (window.PORTFOLIO && window.PORTFOLIO.hero) || [];
    var pool = list.map(function (p) {
      return typeof p === "string" ? p : (hi && p.srcHi) || p.src;
    });
    return pool.length ? pool : [
      "assets/trail/t1.jpg", "assets/trail/t2.jpg", "assets/trail/t3.jpg",
      "assets/trail/t4.jpg", "assets/trail/t5.jpg", "assets/trail/t6.jpg",
      "assets/trail/t7.jpg"
    ];
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // small stagger for siblings entering together
            el.style.transitionDelay = Math.min(i * 60, 240) + "ms";
            el.classList.add("is-in");
            revealObs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Nav: adaptive color per section ---------- */
  var navEl = document.querySelector(".nav");
  var themed = document.querySelectorAll("[data-navtheme]");
  if ("IntersectionObserver" in window) {
    var themeObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) { entry.target._navOn = entry.isIntersecting; });
        // the innermost surface under the nav wins: the CV paper inside its blue section
        var pick = null;
        themed.forEach(function (s) { if (s._navOn && (!pick || pick.contains(s))) pick = s; });
        if (pick) navEl.setAttribute("data-theme", pick.getAttribute("data-navtheme"));
      },
      { rootMargin: "-7% 0px -93% 0px", threshold: 0 }
    );
    themed.forEach(function (s) { themeObs.observe(s); });
  }

  /* ---------- Scroll progress bar ---------- */
  var progress = document.createElement("div");
  progress.className = "progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  /* ---------- Nav: hide on scroll down, show on up ---------- */
  var nav = navEl;
  var lastY = window.scrollY;
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (y > lastY && y > 220) {
        nav.classList.add("is-hidden");
      } else {
        nav.classList.remove("is-hidden");
      }
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  /* ---------- Active section in nav (underline follows scroll) ---------- */
  if ("IntersectionObserver" in window) {
    var navMap = [];
    document.querySelectorAll(".nav__links a[href^='#']").forEach(function (a) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) navMap.push([target, a]);
    });
    if (navMap.length) {
      var activeObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var link = null;
            navMap.forEach(function (p) { if (p[0] === entry.target) link = p[1]; });
            if (!link) return;
            if (entry.isIntersecting) {
              navMap.forEach(function (p) { p[1].classList.remove("is-active"); });
              link.classList.add("is-active");
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      navMap.forEach(function (p) { activeObs.observe(p[0]); });
    }
  }

  /* ---------- Custom cursor ----------
     The site's cursor is a plain white arrow (styles.css). On the home page
     (data-cursor="flower") the little drawn flower takes its place over the hero:
     it sits on the pointer, tilts as you move and sways, just barely, while the
     pointer rests. Below the hero the arrow comes back. */
  (function () {
    var fine = window.matchMedia("(pointer: fine)").matches;
    var hero = document.querySelector(".hero");
    if (!fine || reduceMotion || !hero ||
        document.documentElement.getAttribute("data-cursor") !== "flower") return;

    var wrap = document.createElement("div");
    wrap.className = "cursor-flower";
    wrap.innerHTML =
      '<div class="cursor-flower__in">' +
      '<img src="assets/cursor-flower-white.webp" alt="" width="256" height="256">' +
      "</div>";
    var inner = wrap.firstChild;
    document.body.appendChild(wrap);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var lastX = mx, tilt = 0, sway = 0, lastMove = 0;
    var moved = false, inside = true;

    // flower while the hero is under the pointer, arrow below it. The flower waits
    // for the first move, so it never shows up where the pointer is not.
    function update() {
      var onHero = my < hero.getBoundingClientRect().bottom;
      document.body.classList.toggle("has-cursor", onHero);
      wrap.classList.toggle("is-on", onHero && moved && inside);
    }
    update();

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      moved = true;
      lastMove = performance.now();
      update();
      // grow over anything clickable
      if (e.target && e.target.closest) inner.classList.toggle("is-hot", !!e.target.closest("a, button"));
    }, { passive: true });
    // scrolling carries the hero away from a pointer that stands still
    window.addEventListener("scroll", update, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () { inside = false; update(); });
    document.documentElement.addEventListener("mouseenter", function () { inside = true; update(); });

    (function loop(now) {
      // a little tilt in the direction you are moving, then back to rest...
      tilt += ((mx - lastX) * 0.6 - tilt) * 0.12;
      tilt = Math.max(-16, Math.min(16, tilt));
      lastX = mx;
      // ...where it sways, just barely: ±4° every 3 seconds, easing in once the pointer stops
      var still = now - lastMove > 200;
      sway += ((still ? 1 : 0) - sway) * (still ? 0.02 : 0.2);
      var angle = tilt + sway * 4 * Math.sin(now / 480);
      wrap.style.transform = "translate3d(" + mx + "px," + my + "px,0) rotate(" + angle.toFixed(2) + "deg)";
      requestAnimationFrame(loop);
    })(performance.now());
  })();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open; // closed menu: links are not focusable
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) navEl.setAttribute("data-theme", "light");
  }
  if (toggle && menu) {
    menu.inert = true;
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Hero image trail (follows the cursor) ---------- */
  (function () {
    var heroEl = document.querySelector(".hero");
    var trail = document.querySelector(".trail");
    var fine = window.matchMedia("(pointer: fine)").matches;
    if (!heroEl || !trail || !fine || reduceMotion) return;

    heroEl.classList.add("is-trail");   // lets the "move your mouse" hint appear
    var IMGS = heroPool();
    // preload during idle time so the initial page load stays light
    var preload = function () { IMGS.forEach(function (s) { var im = new Image(); im.src = s; }); };
    if ("requestIdleCallback" in window) requestIdleCallback(preload);
    else setTimeout(preload, 1200);

    var i = 0, lx = null, ly = null, MIN = 95;

    heroEl.addEventListener("pointermove", function (e) {
      if (lx === null) { lx = e.clientX; ly = e.clientY; return; }
      var dx = e.clientX - lx, dy = e.clientY - ly;
      if (dx * dx + dy * dy < MIN * MIN) return;
      lx = e.clientX; ly = e.clientY;
      heroEl.classList.add("hint-gone");  // they got it: fade the hint out
      spawn(e.clientX, e.clientY);
    });
    heroEl.addEventListener("pointerleave", function () { lx = null; ly = null; });

    window.addEventListener("scroll", function () {
      if (window.scrollY > 120) heroEl.classList.add("hint-gone");
    }, { passive: true });

    function spawn(cx, cy) {
      var r = trail.getBoundingClientRect();
      var img = document.createElement("img");
      img.src = IMGS[i % IMGS.length]; i++;
      img.className = "trail__img";
      img.alt = "";
      img.style.left = (cx - r.left) + "px";
      img.style.top = (cy - r.top) + "px";
      img.style.setProperty("--rot", (Math.random() * 20 - 10).toFixed(1) + "deg");
      trail.appendChild(img);
      requestAnimationFrame(function () { img.classList.add("is-live"); });
      setTimeout(function () { img.classList.add("is-out"); }, 450);
      setTimeout(function () { if (img.parentNode) img.remove(); }, 1050);
      while (trail.children.length > 8) trail.firstElementChild.remove();
    }
  })();

  /* ---------- Hero photo stack (touch screens, reduced motion) ----------
     The trail needs a mouse; phones and tablets get a small stack of the same
     photos in the empty space of the hero. It changes on its own and on tap —
     with reduced motion it only changes on tap, without animation. */
  (function () {
    var heroEl = document.querySelector(".hero");
    var intro = heroEl && heroEl.querySelector(".hero__intro");
    var fine = window.matchMedia("(pointer: fine)").matches;
    if (!heroEl || !intro || (fine && !reduceMotion)) return;

    var pool = heroPool();
    var stack = document.createElement("div");
    stack.className = "hero__stack";
    stack.setAttribute("aria-hidden", "true");
    heroEl.appendChild(stack);
    var i = 1, timer = null, visible = true;

    // the greeting sits at the bottom, so the free room is above it: centre the
    // stack between the nav and the top of the greeting
    function place() {
      var h = heroEl.getBoundingClientRect();
      var top = parseFloat(getComputedStyle(heroEl).paddingTop) || 0;
      var free = intro.getBoundingClientRect().top - h.top - top;
      var w = Math.min((free - 40) / 1.25, heroEl.clientWidth * 0.62, 300);
      stack.hidden = w < 96;
      stack.style.width = w + "px";
      stack.style.height = w * 1.25 + "px";
      stack.style.top = top + (free - w * 1.25) / 2 + "px";
    }

    // a pile of two photos: the next one always waits, slightly rotated, behind the top one
    function addToBack() {
      var img = document.createElement("img");
      img.src = pool[i % pool.length]; i++;
      img.alt = "";
      img.decoding = "async";
      img.style.setProperty("--rot", (Math.random() * 14 - 7).toFixed(1) + "deg");
      stack.insertBefore(img, stack.firstChild);
    }
    function topCard() {
      var c = stack.lastElementChild;
      while (c && c.classList.contains("is-leaving")) c = c.previousElementSibling;
      return c;
    }
    function next() {
      addToBack();
      var top = topCard();
      top.classList.add("is-leaving");
      setTimeout(function () { top.remove(); }, reduceMotion ? 0 : 650);
    }

    function restart() {
      clearInterval(timer);
      if (!reduceMotion && visible && !document.hidden) timer = setInterval(next, 2400);
    }

    place();
    addToBack();
    addToBack();
    window.addEventListener("resize", place, { passive: true });
    stack.addEventListener("click", function () { next(); restart(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        restart();
      }).observe(heroEl);
    }
    document.addEventListener("visibilitychange", restart);
    restart();
  })();

  /* ---------- Smooth anchor scroll with nav offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
})();
