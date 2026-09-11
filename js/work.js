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

  /* ---------- Events: a slide per event — vertical video, text beside it ---------- */
  (function () {
    var host = document.querySelector("#events .sec__body");
    var list = P.events || [];
    if (!host || !list.length) return;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var slides = el("ol.events", { role: "list" });
    var rail = el("nav.events__rail", { "aria-label": "Events" });

    list.forEach(function (ev, i) {
      var v = el("video", {
        poster: ev.video.poster, loop: "", playsinline: "", preload: "none",
        width: "720", height: "1280", "data-src": ev.video.src,
        "aria-label": ev.title + (ev.kicker ? " — " + ev.kicker : "")
      });
      v.muted = true;                                   // property, not just the attribute: needed for autoplay
      if (reduceMotion) v.setAttribute("controls", ""); // no autoplay: the visitor presses play

      var place = [ev.place, ev.date].filter(Boolean).join(" · ");
      var text = el("div.event__text", {}, [
        el("p.event__idx", { text: pad(i + 1) + " / " + pad(list.length) }),
        el("h3.event__title", {}, [ev.title, ev.kicker ? el("span.event__kicker", { text: ev.kicker }) : null]),
        el("p.meta.event__meta", {}, [el("span", { text: ev.brand }), place ? el("span", { text: place }) : null]),
        el("p.event__body", {}, [ev.text || M.todo("cosa hai fatto, 2–3 righe")]),
        M.isLocal && ev.todo ? el("div.event__todo", {}, ev.todo.map(function (t) { return el("span.todo", { text: t }); })) : null
      ]);

      slides.appendChild(el("li.event", { id: "event-" + ev.slug }, [
        el("figure.event__media", {}, [v, el("figcaption.file", { text: ev.video.name + " · " + M.duration(ev.video.duration) })]),
        text
      ]));
      rail.appendChild(el("a", { href: "#event-" + ev.slug, "aria-label": "Event " + (i + 1) + ": " + ev.title + " " + ev.kicker }, [el("span")]));
    });

    host.replaceChildren(el("div.events__wrap", {}, [slides, rail]));
    var count = document.querySelector("#events .sec-head__count");
    if (count) count.textContent = list.length + " events";

    // load and play only the slide on screen; pause the others
    var items = slides.querySelectorAll(".event");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var v = e.target.querySelector("video");
          var dot = rail.children[[].indexOf.call(items, e.target)];
          if (e.isIntersecting) {
            if (!v.src && v.dataset.src) v.src = v.dataset.src;
            if (!reduceMotion) v.play().catch(function () {});
            if (dot) dot.classList.add("is-active");
          } else {
            if (!v.paused) v.pause();
            if (dot) dot.classList.remove("is-active");
          }
        });
      }, { threshold: 0.55 });
      items.forEach(function (s) { io.observe(s); });
    } else {
      items.forEach(function (s) { var v = s.querySelector("video"); v.src = v.dataset.src; });
    }
  })();
})();
