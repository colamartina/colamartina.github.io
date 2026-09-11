/* =========================================================
   HOME — work sections rendered from data/*.js
   Campaigns: editorial grid of cards → case.html?p=<slug>
   ========================================================= */
(function () {
  "use strict";

  var P = window.PORTFOLIO || {};
  var M = window.Media;
  if (!M) return;
  var el = M.el;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- Campaigns ---------- */
  (function () {
    var host = document.querySelector("#campaigns .sec__body");
    var list = P.campaigns || [];
    if (!host || !list.length) return;

    var grid = el("ul.c-grid", { role: "list" });
    list.forEach(function (c, i) {
      var sizes = "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 45vw";
      var media = el("div.c-card__media", {}, [M.img(c.cover, sizes, { alt: c.title + " — " + c.brand })]);
      var title = el("h3.c-card__title", {}, [c.title, c.kicker ? el("span.c-card__kicker", { text: c.kicker }) : null]);
      var meta = el("p.meta.c-card__meta", {}, [
        el("span", { text: c.brand }),
        c.year ? el("span", { text: c.year }) : null,
        el("span", { text: c.type })
      ]);
      var line = el("p.c-card__line", {}, [c.line || M.todo("descrizione di una riga")]);
      var link = el("a.c-card__link", { href: "case.html?p=" + encodeURIComponent(c.slug) }, [
        media,
        el("div.c-card__info", {}, [el("span.c-card__idx", { text: pad(i + 1) }), title, meta, line])
      ]);
      grid.appendChild(el("li.c-card", { "data-reveal": "" }, [link]));
    });
    host.replaceChildren(grid);

    var count = document.querySelector("#campaigns .sec-head__count");
    if (count) count.textContent = list.length + " projects";
  })();
})();
