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

  /* ---------- Custom cursor + work-list image previews ---------- */
  (function () {
    var fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || reduceMotion) return;

    document.body.classList.add("has-cursor");
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.innerHTML = "<span></span>";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    // floating preview for the case-study index
    var pv = null, pvOn = false;
    var rows = document.querySelectorAll(".cs-item a[data-preview]");
    if (rows.length) {
      pv = document.createElement("img");
      pv.className = "cs-preview";
      pv.alt = "";
      pv.setAttribute("aria-hidden", "true");
      document.body.appendChild(pv);
      rows.forEach(function (a, i) {
        a.addEventListener("mouseenter", function () {
          pv.src = a.getAttribute("data-preview");
          pv.style.setProperty("--pr", (i % 2 ? 4 : -4) + "deg");
          pvOn = true;
          pv.classList.add("is-on");
        });
        a.addEventListener("mouseleave", function () {
          pvOn = false;
          pv.classList.remove("is-on");
        });
      });
    }

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my, px = mx, py = my;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!e.target || !e.target.closest) return;
      // palette-aware: blue cursor on light sections, white on dark/blue
      var sec = e.target.closest("[data-navtheme]");
      var ink = !!(sec && sec.getAttribute("data-navtheme") === "dark");
      dot.classList.toggle("is-ink", ink);
      ring.classList.toggle("is-ink", ink);
      // grow over interactive elements
      var hot = !!e.target.closest("a, button");
      ring.classList.toggle("is-hot", hot);
      dot.classList.toggle("is-hot", hot);
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", function () {
      dot.style.opacity = "0"; ring.style.opacity = "0";
    });
    document.documentElement.addEventListener("mouseenter", function () {
      dot.style.opacity = "1"; ring.style.opacity = "1";
    });

    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      if (pv) {
        px += (mx - px) * 0.12; py += (my - py) * 0.12;
        if (pvOn) pv.style.transform = "translate(" + (px + 28) + "px," + (py - 110) + "px) rotate(var(--pr))";
      }
      requestAnimationFrame(loop);
    })();
  })();

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
