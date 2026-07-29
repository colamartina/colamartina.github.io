/* =========================================================
   MARTINA COLA — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---------- Count-up stats ---------- */
  var counts = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var countObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counts.forEach(function (el) { countObs.observe(el); });
  }

  function animateCount(el) {
    var raw = el.getAttribute("data-count"); // e.g. "+250%", "$400K+"
    var match = raw.match(/^(\D*)(\d+)(.*)$/);
    if (!match) return;
    var prefix = match[1], target = parseInt(match[2], 10), suffix = match[3];
    var dur = 1300, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      // easeOutExpo
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      var val = Math.round(eased * target);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = prefix + "0" + suffix;
    requestAnimationFrame(step);
  }

  /* ---------- Nav: adaptive color per section ---------- */
  var navEl = document.querySelector(".nav");
  var themed = document.querySelectorAll("[data-navtheme]");
  if ("IntersectionObserver" in window) {
    var themeObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navEl.setAttribute("data-theme", entry.target.getAttribute("data-navtheme"));
          }
        });
      },
      { rootMargin: "-7% 0px -93% 0px", threshold: 0 }
    );
    themed.forEach(function (s) { themeObs.observe(s); });
  }

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
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) navEl.setAttribute("data-theme", "light");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }

  /* ---------- Hero image trail (follows the cursor) ---------- */
  (function () {
    var heroEl = document.querySelector(".hero");
    var trail = document.querySelector(".trail");
    var fine = window.matchMedia("(pointer: fine)").matches;
    if (!heroEl || !trail || !fine || reduceMotion) return;

    var IMGS = [
      "assets/trail/t1.jpg", "assets/trail/t2.jpg", "assets/trail/t3.jpg",
      "assets/trail/t4.jpg", "assets/trail/t5.jpg", "assets/trail/t6.jpg",
      "assets/trail/t7.jpg"
    ];
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
      spawn(e.clientX, e.clientY);
    });
    heroEl.addEventListener("pointerleave", function () { lx = null; ly = null; });

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
