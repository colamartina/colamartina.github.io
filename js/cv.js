/* =========================================================
   CV — the Curriculum section of the home page: a printed resume lying on the
   blue desk, set small and tight, the portrait held on it by a yellow binder clip,
   the skills as coloured stickers, and "Download full CV" underneath.
   A snapshot only — the PDF has the rest.
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

  /* ---------- portrait: a small print, held on the sheet by the binder clip ---------- */
  var photo = null;
  if (cv.photo) {
    photo = el("div.cv-photo", {}, [
      cv.clip ? el("img.cv-clip", { src: cv.clip.src, width: String(cv.clip.width), height: String(cv.clip.height), alt: "", decoding: "async" }) : null,
      el("figure.cv-photo__print", {}, [
        M.img(Object.assign({ type: "image" }, cv.photo), "(max-width: 640px) 104px, 168px", { alt: cv.name }),
        cv.photo.caption ? el("figcaption.cv-photo__cap", { text: cv.photo.caption }) : null
      ])
    ]);
  }

  /* ---------- the sheet ---------- */
  var contacts = list("ul.cv-sheet__contacts", [
    el("a", { href: "mailto:" + cv.email, text: cv.email }),
    cv.linkedin ? el("a", { href: cv.linkedin.url, target: "_blank", rel: "noopener" }, [cv.linkedin.label, el("span", { "aria-hidden": "true", text: " ↗" })]) : null,
    cv.site ? el("a", { href: "https://" + cv.site, text: cv.site }) : M.todo("sito (dominio in arrivo)"),
    el("span", { text: cv.location })
  ].filter(Boolean), function (c) { return el("li", {}, [c]); });

  var id = el("header.cv-sheet__id", {}, [
    contacts,
    el("div.cv-sheet__who", {}, [
      el("h3.cv-sheet__name", { text: cv.name }),
      el("p.cv-sheet__role", { text: cv.role }),
      el("p.cv-sheet__sub", { text: cv.sub })
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

  // the skills are stickers: a colour each and a small, steady tilt
  var TILT = [-2.5, 1.5, -1, 2, -1.5, 2.5, -2, 1];
  var skills = block("Skills", [
    list("ul.cv-badges", cv.skills, function (s, i) {
      return el("li.sticker.cv-badge.sticker--" + s.colour, { style: "--rot: " + TILT[i % TILT.length] + "deg", text: s.label });
    }),
    el("p.cv-sheet__label", { text: "Tools" }),
    list("ul.cv-badges.cv-badges--tools", cv.tools, function (t) { return el("li.cv-tool", { text: t }); })
  ]);

  var languages = block("Languages", [
    list("ul.cv-langs", cv.languages, function (l) {
      return el("li", {}, [l.name + " ", el("span", { text: l.level })]);
    })
  ]);

  var foot = el("footer.cv-sheet__foot", {}, [
    el("span", { text: "martina-cola-cv.pdf" }),
    el("span", { text: "Snapshot — full version below" }),
    el("span", { text: "1 / 1" })
  ]);

  // the sheet is a paper surface inside the blue section: the nav reads it as "dark"
  var sheet = el("div.cv-sheet", { "data-reveal": "" }, [
    el("article.cv-sheet__paper", { "data-navtheme": "dark", "aria-label": "CV snapshot" }, [
      id,
      block("Experience", cv.experience.map(job)),
      el("div.cv-sheet__cols", {}, [
        el("div.cv-sheet__col", {}, [block("Education", cv.education.map(school)), languages]),
        el("div.cv-sheet__col", {}, [skills])
      ]),
      foot
    ]),
    photo
  ]);

  var cta = el("div.cv-cta__wrap", {}, [
    el("a.btn.btn--light.cv-cta", { href: cv.pdf, download: "Martina-Cola-CV.pdf" },
      ["Download full CV ", el("span.btn__ic", { "aria-hidden": "true", text: "↓" })])
  ]);

  var devNotes = M.isLocal && cv.todo && cv.todo.length
    ? el("div.cv-todo", {}, cv.todo.map(function (t) { return el("span.todo", { text: t }); }))
    : null;

  host.replaceChildren.apply(host, [sheet, cta, devNotes].filter(Boolean));
})();
