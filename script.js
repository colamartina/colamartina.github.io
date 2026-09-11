/* =========================================================
   MARTINA COLA — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Working copy (localhost / file://) vs published site: [TODO] notes and empty
  // media slots are shown only while editing.
  var isLocal = location.protocol === "file:" ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (isLocal) document.documentElement.classList.add("is-dev");

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

  /* ---------- Custom cursor ---------- */
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

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

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
      requestAnimationFrame(loop);
    })();
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

  /* ---------- Project gallery slots ----------
     Each slot ships as `is-empty` (dashed placeholder). As soon as the real
     file exists at data-path, it loads and the placeholder is removed —
     so adding media is just dropping a correctly-named file in the folder. */
  (function () {
    // Placeholders are a working tool: shown while editing locally, hidden from
    // visitors on the published site so empty slots never look unfinished.
    var slots = document.querySelectorAll(".slot");

    slots.forEach(function (slot) {
      var media = slot.querySelector("img, video");
      if (!media) return;
      var fill = function () { slot.classList.remove("is-empty"); };
      if (media.tagName === "IMG") {
        if (media.complete && media.naturalWidth > 0) fill();
        else media.addEventListener("load", fill);
      } else {
        media.addEventListener("loadeddata", fill);
      }
    });

    if (isLocal) return;

    // Live: drop still-empty slots, and the whole gallery if nothing was added.
    setTimeout(function () {
      document.querySelectorAll(".cs-gallery").forEach(function (gal) {
        gal.querySelectorAll(".slot.is-empty").forEach(function (s) { s.remove(); });
        if (!gal.querySelector(".slot")) gal.remove();
      });
    }, 400);
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
