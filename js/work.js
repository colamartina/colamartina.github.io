/* =========================================================
   HOME — work sections rendered from data/*.js
   Fun Stuff: small tilted cards · Brand Collabs: wide rows → case.html?p=<slug>
   (Campaign and Events: their cards and project pages, js/projects.js)
   ========================================================= */
(function () {
  "use strict";

  var P = window.PORTFOLIO || {};
  var M = window.Media;
  if (!M) return;
  var el = M.el;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- Fun Stuff: three small, slightly tilted cards ---------- */
  (function () {
    var host = document.querySelector("#fun .sec__body");
    var list = P.hobbies || [];
    if (!host || !list.length) return;

    var grid = el("ul.fun", { role: "list" });
    list.forEach(function (h, i) {
      var media = h.cover
        ? el("div.fun__media", {}, [M.img(h.cover, "(max-width: 700px) 90vw, 30vw", { alt: h.title })])
        : el("div.fun__media.fun__media--empty", {}, [el("span", { text: h.title })]);
      grid.appendChild(el("li.fun__card", { "data-colour": h.colour, "data-reveal": "" }, [
        media,
        el("div.fun__text", {}, [
          el("p.fun__kicker", { text: h.kicker }),
          el("h3.fun__title", { text: h.title }),
          el("p.fun__line", {}, [h.line || M.todo("una riga su cosa è")]),
          h.text ? el("p.fun__body", { text: h.text }) : null,
          h.note ? el("p.meta", {}, [el("span", { text: h.note })]) : null,
          M.isLocal && h.todo ? el("div.fun__todo", {}, h.todo.map(function (t) { return el("span.todo", { text: t }); })) : null
        ])
      ]));
    });
    host.replaceChildren(grid);

    var count = document.querySelector("#fun .sec-head__count");
    if (count) count.textContent = list.length + " things";
  })();

  /* ---------- Brand Collabs: wide rows, the two brands locked up, images in pairs ---------- */
  (function () {
    var host = document.querySelector("#collabs .sec__body");
    var list = P.collabs || [];
    if (!host || !list.length) return;

    var rows = el("ol.collabs", { role: "list" });
    list.forEach(function (c, i) {
      var sizes = "(max-width: 640px) 46vw, (max-width: 1100px) 24vw, 20vw";
      var pair = el("div.collab__pair", {}, c.pair.map(function (p, n) {
        return M.img(p, sizes, { alt: c.brand + " × " + c.partner + (n ? "" : " — " + c.type) });
      }));
      var text = el("div.collab__text", {}, [
        el("p.collab__idx", { text: pad(i + 1) }),
        el("h3.collab__lockup", {}, [
          el("span.collab__brand", { text: c.brand }),
          el("span.collab__x", { text: "×" }),
          el("span.collab__partner", { text: c.partner })
        ]),
        c.kicker ? el("p.collab__kicker", { text: c.kicker }) : null,
        el("p.meta", {}, [c.year ? el("span", { text: c.year }) : null, el("span", { text: c.type })]),
        el("p.collab__line", {}, [c.line || M.todo("descrizione di una riga")]),
        el("span.collab__go", {}, ["View collab ", el("span", { "aria-hidden": "true", text: "↗" })])
      ]);
      rows.appendChild(el("li.collab", {}, [
        el("a.collab__link", { href: "case.html?p=" + encodeURIComponent(c.slug) }, [pair, text])
      ]));
    });
    host.replaceChildren(rows);

    var count = document.querySelector("#collabs .sec-head__count");
    if (count) count.textContent = list.length + " collabs";
  })();
})();
