/* =========================================================
   CV — the Curriculum section of the home page, laid out like a real
   resume sheet. The skills are stickers you can drag around (mouse and
   touch, with a little inertia); everything reads fine without moving them.
   ========================================================= */
(function () {
  "use strict";

  var P = window.PORTFOLIO || {};
  var M = window.Media;
  var host = document.querySelector("#cv .sec__body");
  var cv = P.cv;
  if (!host || !cv || !M) return;
  var el = M.el;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header ---------- */
  var contacts = el("ul.cv__contacts", { role: "list" }, [
    el("li", {}, [el("a", { href: "mailto:" + cv.email, text: cv.email })]),
    cv.linkedin ? el("li", {}, [el("a", { href: cv.linkedin.url, target: "_blank", rel: "noopener" }, [cv.linkedin.label, el("span", { "aria-hidden": "true", text: " ↗" })])]) : null,
    cv.site ? el("li", {}, [el("a", { href: "https://" + cv.site, text: cv.site })]) : el("li", {}, [M.todo("indirizzo del sito")]),
    el("li", { text: cv.location })
  ]);
  contacts.querySelectorAll("li").forEach(function (li) { if (!li.childNodes.length) li.remove(); });

  var head = el("header.cv__head", {}, [
    el("div", {}, [
      el("h3.cv__name", { text: cv.name }),
      el("p.cv__role", { text: cv.role }),
      el("p.cv__sub", { text: cv.sub })
    ]),
    contacts
  ]);

  /* ---------- blocks ---------- */
  // label on the left, everything else in one column on the right — the wrapper
  // matters: loose children would flow back into the label column, one row down
  function block(title, children, extraClass) {
    return el("section.cv__block" + (extraClass || ""), {}, [
      el("h4.cv__h", { text: title }),
      el("div.cv__col", {}, children)
    ]);
  }

  var profile = block("Profile", [el("div.cv__profile", {}, cv.profile.map(function (p) { return el("p", { text: p }); }))]);

  function entry(e) {
    return el("article.cv__entry", {}, [
      el("div.cv__entry-top", {}, [
        el("div", {}, [
          el("p.cv__org", { text: e.company || e.school }),
          el("p.cv__title", { text: e.role || e.title }),
          e.note ? el("p.cv__note", { text: e.note }) : null
        ]),
        el("div.cv__when", {}, [
          e.city ? el("p", { text: e.city }) : null,
          el("p.cv__dates", { text: e.dates })
        ])
      ]),
      e.bullets ? el("ul.cv__bullets", {}, e.bullets.map(function (b) { return el("li", { text: b }); })) : null
    ]);
  }

  var experience = block("Experience", cv.experience.map(entry));
  var education = block("Education", cv.education.map(entry));
  var languages = block("Languages", [
    el("ul.cv__langs", { role: "list" }, cv.languages.map(function (l) {
      return el("li", {}, [el("span", { text: l.name }), el("em", { text: l.level })]);
    }))
  ]);

  /* ---------- skills: the draggable stickers ---------- */
  var board = el("div.skills", { id: "skills" });
  var stickers = cv.skills.map(function (s, i) {
    var cls = "span.sticker.skill.sticker--" + s.colour + (s.size === "lg" ? ".sticker--lg" : s.size === "sm" ? ".sticker--sm" : "");
    return el(cls, { "data-i": String(i), text: s.label });
  });
  stickers.forEach(function (s) { board.appendChild(s); });

  var skills = block("Skills", [
    el("p.cv__hint", {}, ["Drag them around ", el("span", { "aria-hidden": "true", text: "✱" })]),
    board
  ], ".cv__block--skills");

  var actions = el("div.cv__actions", {}, [
    el("a.btn.btn--solid", { href: cv.pdf, download: "" }, ["Download the PDF ", el("span.btn__ic", { "aria-hidden": "true", text: "↓" })])
  ]);

  var devNotes = M.isLocal && cv.todo && cv.todo.length
    ? el("div.cv__todo", {}, cv.todo.map(function (t) { return el("span.todo", { text: t }); }))
    : null;

  host.replaceChildren(el("div.cv", {}, [head, profile, experience, education, languages, skills, actions, devNotes].filter(Boolean)));

  /* ---------- sticker layout: measured from a normal flow, then scattered ---------- */
  function rnd(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); } // stable per index

  var placed = false;
  function layout() {
    board.classList.add("is-flow");
    stickers.forEach(function (s) { s.style.left = s.style.top = ""; s.style.removeProperty("--rot"); });
    var b = board.getBoundingClientRect();
    var spots = stickers.map(function (s) { return s.getBoundingClientRect(); });
    var flowHeight = board.scrollHeight;
    board.classList.remove("is-flow");

    stickers.forEach(function (s, i) {
      var r = spots[i];
      var jx = (rnd(i) - 0.5) * 26;
      var jy = (rnd(i + 100) - 0.5) * 18;
      var maxX = Math.max(0, b.width - r.width);
      s.style.left = Math.min(Math.max(r.left - b.left + jx, 0), maxX) + "px";
      s.style.top = Math.max(r.top - b.top + jy, 0) + "px";
      s.style.setProperty("--rot", ((rnd(i + 7) - 0.5) * 9).toFixed(1) + "deg");
    });
    board.style.height = flowHeight + 26 + "px";
    placed = true;
  }

  layout();
  // the sticker widths change once the real font is in: measure again
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout).catch(function () {});
  window.addEventListener("load", layout, { once: true });
  var lastW = board.clientWidth;
  window.addEventListener("resize", function () {
    if (Math.abs(board.clientWidth - lastW) < 40) return; // ignore mobile toolbar resizes
    lastW = board.clientWidth;
    layout();
  }, { passive: true });

  /* ---------- drag with a little inertia ---------- */
  var zTop = 5; // the last sticker grabbed stays on top of the others
  stickers.forEach(function (s) {
    var dragging = false, pid = null, startX = 0, startY = 0, baseX = 0, baseY = 0;
    var vx = 0, vy = 0, lastX = 0, lastY = 0, lastT = 0, raf = 0;

    function bounds() {
      return { maxX: board.clientWidth - s.offsetWidth, maxY: board.clientHeight - s.offsetHeight };
    }
    function put(x, y) {
      var b = bounds();
      s.style.left = Math.min(Math.max(x, -8), b.maxX + 8) + "px";
      s.style.top = Math.min(Math.max(y, -8), b.maxY + 8) + "px";
    }

    function onMove(e) {
      if (!dragging || e.pointerId !== pid) return;
      var now = performance.now(), dt = Math.max(now - lastT, 8);
      vx = ((e.clientX - lastX) / dt) * 16;
      vy = ((e.clientY - lastY) / dt) * 16;
      lastX = e.clientX; lastY = e.clientY; lastT = now;
      put(baseX + (e.clientX - startX), baseY + (e.clientY - startY));
      e.preventDefault();
    }

    function release(e) {
      if (!dragging || (e && e.pointerId !== pid)) return;
      dragging = false; pid = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      s.classList.remove("is-dragging");
      if (reduceMotion) return;                       // no inertia with reduced motion
      var glide = function () {
        vx *= 0.92; vy *= 0.92;
        if (Math.abs(vx) < 0.25 && Math.abs(vy) < 0.25) return;
        put((parseFloat(s.style.left) || 0) + vx, (parseFloat(s.style.top) || 0) + vy);
        raf = requestAnimationFrame(glide);
      };
      raf = requestAnimationFrame(glide);
    }

    s.addEventListener("pointerdown", function (e) {
      if (!placed || dragging) return;
      dragging = true; pid = e.pointerId;
      s.classList.add("is-dragging");
      s.style.zIndex = ++zTop; // comes to the front — without moving it in the DOM,
                               // which would drop the pointer capture mid-drag
      startX = e.clientX; startY = e.clientY;
      baseX = parseFloat(s.style.left) || 0; baseY = parseFloat(s.style.top) || 0;
      lastX = e.clientX; lastY = e.clientY; lastT = performance.now();
      vx = vy = 0;
      cancelAnimationFrame(raf);
      // on window, so the sticker keeps following even when the pointer runs ahead of it
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
      e.preventDefault();
    });
  });
})();
