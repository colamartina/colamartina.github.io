/* =========================================================
   HOME — work sections rendered from data/*.js
   Fun Stuff: small tilted cards
   (Projects — campaigns and brand collabs — and Events: their cards and project pages, js/projects.js)
   ========================================================= */
(function () {
  "use strict";

  var P = window.PORTFOLIO || {};
  var M = window.Media;
  if (!M) return;
  var el = M.el;

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
})();
