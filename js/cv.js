/* =========================================================
   CV — the Curriculum section of the home page: a printed resume, the top sheet of
   a small stack of pages on the blue desk, the portrait tucked under a yellow binder
   clip on its top edge, the skills as coloured stickers, and "Download full CV"
   underneath. A snapshot only — the PDF has the rest.
   ========================================================= */
(function () {
  "use strict";

  var P = window.PORTFOLIO || {};
  var M = window.Media;
  var host = document.querySelector("#cv .sec__body");
  var cv = P.cv;
  if (!host || !cv || !M) return;
  var el = M.el;

  function list(tag, items, render) {
    return el(tag, { role: "list" }, items.map(render));
  }

  // "achieving **+50% ROAS**" → the figure in bold, the rest as plain text
  function rich(text) {
    return text.split("**").map(function (part, i) {
      return i % 2 ? el("b", { text: part }) : part;
    }).filter(function (part) { return part !== ""; });
  }

  /* ---------- portrait: a small print tucked under the binder clip ---------- */
  var photo = null;
  if (cv.photo) {
    photo = el("div.cv-photo", {}, [
      // --clip: the clip's own shape, which masks its highlight (styles.css)
      cv.clip ? el("span.cv-clip", { style: "--clip: url(" + cv.clip.src + ")" }, [
        el("img", { src: cv.clip.src, width: String(cv.clip.width), height: String(cv.clip.height), alt: "", decoding: "async" })
      ]) : null,
      el("figure.cv-photo__print", {}, [
        M.img(Object.assign({ type: "image" }, cv.photo), "(max-width: 640px) 104px, (min-width: 901px) 120px, 168px", { alt: cv.name })
      ])
    ]);
  }

  /* ---------- the sheet ---------- */
  var id = el("header.cv-sheet__id", {}, [
    el("div.cv-sheet__who", {}, [
      el("h3.cv-sheet__name", { text: cv.name }),
      el("p.cv-sheet__role", { text: cv.role })
    ])
  ]);

  function block(title, children) {
    return el("section.cv-sheet__sec", {}, [el("h4.cv-sheet__h", { text: title })].concat(children));
  }

  // like a printed resume: dates and city on top, role and company below
  function job(j) {
    return el("article.cv-entry", {}, [
      el("p.cv-entry__meta", {}, [el("span", { text: j.dates }), el("span", { text: j.city })]),
      el("p.cv-entry__head", {}, [el("span.cv-entry__role", { text: j.role }), el("span.cv-entry__org", { text: j.company })]),
      j.note ? el("p.cv-entry__note", { text: j.note }) : null,
      list("ul.cv-entry__points", j.points, function (p) { return el("li", {}, rich(p)); })
    ]);
  }

  function school(e) {
    return el("article.cv-entry.cv-entry--edu", {}, [
      el("p.cv-entry__meta", {}, [el("span", { text: e.dates }), el("span", { text: e.city })]),
      el("p.cv-entry__role", { text: e.title }),
      el("p.cv-entry__note", { text: e.school })
    ]);
  }

  // the skills are stickers: a colour each, a small tilt, and a place in the sway
  // (--i staggers it, styles.css) so they never move in step
  var TILT = [-2.5, 1.5, -1, 2, -1.5, 2.5, -2, 1];
  var skills = block("Skills", [
    list("ul.cv-badges", cv.skills, function (s, i) {
      return el("li.sticker.cv-badge.sticker--" + s.colour, { style: "--rot: " + TILT[i % TILT.length] + "deg; --i: " + i, text: s.label });
    }),
    el("p.cv-sheet__label", { text: "Tools" }),
    list("ul.cv-badges.cv-badges--tools", cv.tools, function (t) { return el("li.cv-tool", { text: t }); })
  ]);

  var languages = block("Languages", [
    list("ul.cv-langs", cv.languages, function (l) {
      return el("li", {}, [l.name + " ", el("span", { text: l.level })]);
    })
  ]);

  // the pages under the top sheet: only their edges peek out (styles.css)
  var under = [1, 2, 3].map(function () { return el("div.cv-sheet__under", { "aria-hidden": "true" }); });

  // the sheet is a paper surface inside the blue section: the nav reads it as "dark"
  var sheet = el("div.cv-sheet", { "data-reveal": "" }, under.concat([
    el("article.cv-sheet__paper", { "data-navtheme": "dark", "aria-label": "CV snapshot" }, [
      id,
      block("Experience", cv.experience.map(job)),
      el("div.cv-sheet__cols", {}, [
        el("div.cv-sheet__col", {}, [block("Education", cv.education.map(school)), languages]),
        el("div.cv-sheet__col", {}, [skills])
      ])
    ]),
    photo
  ]));

  var cta = el("div.cv-cta__wrap", {}, [
    el("a.btn.btn--light.cv-cta", { href: cv.pdf, download: "Martina-Cola-CV.pdf" },
      ["Download full CV ", el("span.btn__ic", { "aria-hidden": "true", text: "↓" })])
  ]);

  var devNotes = M.isLocal && cv.todo && cv.todo.length
    ? el("div.cv-todo", {}, cv.todo.map(function (t) { return el("span.todo", { text: t }); }))
    : null;

  host.replaceChildren.apply(host, [sheet, cta, devNotes].filter(Boolean));

  /* ---------- on a desktop the whole sheet fits the screen ----------
     the section opens on the note and the stack (styles.css); on a screen too short for
     them the sheet is scaled down (zoom) just enough to fit — never up, and never below
     75% (its type, set 6% larger on a desktop, then no smaller than 10px) */
  var desk = window.matchMedia("(min-width: 901px)");
  var section = host.closest("section");
  function fit() {
    sheet.style.zoom = "";
    if (!desk.matches) return;
    var top = host.getBoundingClientRect().top - section.getBoundingClientRect().top;
    var room = window.innerHeight - top - 14;                // a little blue under the stack
    var box = sheet.getBoundingClientRect();                 // the tilt included
    var low = box.bottom;                                    // the lowest page edge peeking out
    under.forEach(function (u) { low = Math.max(low, u.getBoundingClientRect().bottom); });
    var z = room / (box.height + low - box.bottom);
    if (z < 1) sheet.style.zoom = Math.max(z, 0.75).toFixed(3);
  }
  fit();
  window.addEventListener("resize", fit, { passive: true });
  window.addEventListener("load", fit);                      // the bar's height is known by then
  if (document.fonts) document.fonts.ready.then(fit);
})();
