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
      // as soon as it comes in: waiting for 12% of it kept a tall block (the CV sheet on a
      // phone) blank until 200px of it was on screen
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Nav: adaptive color per section ---------- */
  var navEl = document.querySelector(".nav");
  var themed = document.querySelectorAll("[data-navtheme]");
  function navTheme() {
    // the innermost surface under the nav wins: the CV paper inside its blue section
    var pick = null;
    themed.forEach(function (s) { if (s._navOn && (!pick || pick.contains(s))) pick = s; });
    if (pick) navEl.setAttribute("data-theme", pick.getAttribute("data-navtheme"));
  }
  if ("IntersectionObserver" in window) {
    var themeObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) { entry.target._navOn = entry.isIntersecting; });
        navTheme();
      },
      { rootMargin: "-7% 0px -93% 0px", threshold: 0 }
    );
    themed.forEach(function (s) { themeObs.observe(s); });
  }

  // the bar's height, for what has to stay clear of it: the case page's sticky tabs (styles.css)
  function navHeight() { document.documentElement.style.setProperty("--nav-h", navEl.offsetHeight + "px"); }
  navHeight();
  window.addEventListener("resize", navHeight, { passive: true });
  if (document.fonts) document.fonts.ready.then(navHeight);

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
     The site's cursor is a cream arrow (styles.css). On the home page
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
      '<img src="assets/cursor-flower-blue.webp" alt="" width="256" height="256">' +
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
    // over the burgundy menu the bar is light; once closed it takes the colours of the section
    // under it again (it stayed light, and on a cream section the name and the button vanished)
    if (open) navEl.setAttribute("data-theme", "light");
    else navTheme();
  }
  if (toggle && menu) {
    menu.inert = true;
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    // the menu's links, and the name in the bar, close it on their way
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    var brand = document.querySelector(".nav__brand");
    if (brand) brand.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) setMenu(false);
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

    var i = 0, lx = null, ly = null, MIN = 160;
    // a few sizes, never far apart (styles.css multiplies the width by --s). Five
    // steps: while the photo count is not a multiple of five, a photo changes size
    // on every pass.
    var SIZES = [1, 0.8, 1.25, 0.9, 1.15];
    // an editorial scatter rather than a line glued to the pointer: each photo lands
    // a little apart from it, a beat later, stays a moment, then fades. At most MAX
    // at once; FADE matches .trail__img.is-out in styles.css
    var HOLD = 1300, FADE = 700, MAX = 6;

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
      // the direction turns by the golden angle each time, so the photos spread
      // around the pointer's way instead of lining up on it
      var turn = i * 2.4, reach = 75 + Math.random() * 110;
      var x = Math.max(0, Math.min(r.width, cx - r.left + Math.cos(turn) * reach));
      var y = Math.max(0, Math.min(r.height, cy - r.top + Math.sin(turn) * reach));
      var img = document.createElement("img");
      img.src = IMGS[i % IMGS.length];
      img.style.setProperty("--s", SIZES[i % SIZES.length]);
      i++;
      img.className = "trail__img";
      img.alt = "";
      img.style.left = x + "px";
      img.style.top = y + "px";
      setTimeout(function () {
        trail.appendChild(img);
        requestAnimationFrame(function () { img.classList.add("is-live"); });
        setTimeout(function () { leave(img); }, HOLD);
        var shown = trail.querySelectorAll(".trail__img:not(.is-out)");
        for (var k = 0; k < shown.length - MAX; k++) leave(shown[k]);   // the oldest make room
      }, 80 + Math.random() * 120);
    }

    function leave(img) {
      if (img.classList.contains("is-out")) return;
      img.classList.add("is-out");
      setTimeout(function () { img.remove(); }, FADE);
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

    // the stack sits on top of the greeting and the two are centred together
    // between the nav and the foot: the greeting makes room with its top padding
    var foot = heroEl.querySelector(".hero__foot");
    function place() {
      intro.style.paddingTop = "";
      var h = heroEl.getBoundingClientRect();
      var top = parseFloat(getComputedStyle(heroEl).paddingTop) || 0;
      var bottom = foot ? foot.getBoundingClientRect().top : h.bottom;
      var free = bottom - h.top - top - intro.offsetHeight;
      var w = Math.min((free - 96) / 1.25, heroEl.clientWidth * 0.62, 300);
      stack.hidden = w < 96;
      if (stack.hidden) return;
      stack.style.width = w + "px";
      stack.style.height = w * 1.25 + "px";
      intro.style.paddingTop = w * 1.25 + 24 + "px";   // the photo, then a little gap
      stack.style.top = intro.getBoundingClientRect().top - h.top + "px";
    }

    // a pile of two photos: the next one always waits right behind the top one
    function addToBack() {
      var img = document.createElement("img");
      img.src = pool[i % pool.length]; i++;
      img.alt = "";
      img.decoding = "async";
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
    // the title's own font can wrap it differently from the fallback: measure again
    if (document.fonts) document.fonts.ready.then(place);
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
      var behavior = reduceMotion ? "auto" : "smooth";
      // #top is the bar itself, which is fixed and never scrolls into view: "Back to top" and
      // the name go to the top of the page
      if (getComputedStyle(target).position === "fixed") window.scrollTo({ top: 0, behavior: behavior });
      else target.scrollIntoView({ behavior: behavior, block: "start" });
      history.replaceState(null, "", id);
    });
  });
})();
