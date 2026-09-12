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

  /* ---------- Campaigns: four cards of the same size, then "check out more" ---------- */
  (function () {
    var host = document.querySelector("#campaigns .sec__body");
    var list = P.campaigns || [];
    if (!host || !list.length) return;
    var SHOWN = 4;

    var grid = el("ul.c-grid", { role: "list" });
    var extra = [];
    list.forEach(function (c, i) {
      var sizes = "(max-width: 640px) 46vw, (max-width: 1000px) 44vw, 23vw";
      var img = M.img(c.cover, sizes, { alt: c.title + ", " + c.brand });
      if (c.cover.zoom) img.style.setProperty("--zoom", c.cover.zoom);
      var cap = el("div.c-card__cap", {}, [
        el("span.c-card__t", { text: c.title }),
        el("span.c-card__y", { text: c.year || "" }),
        c.kicker ? el("span.c-card__k", { text: c.kicker }) : null,
        c.type && c.type.toLowerCase() !== c.title.toLowerCase() ? el("span.c-card__m", { text: c.type }) : null
      ]);
      var card = el("li.c-card", { "data-reveal": "" }, [
        el("a.c-card__link", { href: "case.html?p=" + encodeURIComponent(c.slug) }, [
          el("div.c-card__media", {}, [img, el("span.c-card__go", { "aria-hidden": "true", text: "↗" })]),
          cap
        ])
      ]);
      if (i >= SHOWN) { card.hidden = true; extra.push(card); }
      grid.appendChild(card);
    });

    var children = [grid];
    if (extra.length) {
      var btn = el("button.btn.btn--ghost.c-more", { type: "button", "aria-expanded": "false" },
        ["Check out more ", el("span", { "aria-hidden": "true", text: "(" + extra.length + ")" })]);
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        extra.forEach(function (card) { card.hidden = open; });
        btn.setAttribute("aria-expanded", String(!open));
        btn.replaceChildren(document.createTextNode(open ? "Check out more " : "Show less "),
          el("span", { "aria-hidden": "true", text: open ? "(" + extra.length + ")" : "↑" }));
        if (!open) extra[0].querySelector("a").focus({ preventScroll: true });
      });
      children.push(el("div.c-more__wrap", {}, [btn]));
    }
    host.replaceChildren.apply(host, children);

    var count = document.querySelector("#campaigns .sec-head__count");
    if (count) count.textContent = list.length + " projects";
  })();

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

  /* ---------- Events: a slide per event — vertical video, text beside it ---------- */
  (function () {
    var host = document.querySelector("#events .sec__body");
    var list = P.events || [];
    if (!host || !list.length) return;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var slides = el("ol.events", { role: "list" });
    var rail = el("nav.events__rail", { "aria-label": "Events" });

    list.forEach(function (ev, i) {
      // poster and video both wait for the slide to come near: a <video> fetches
      // its poster straight away, wherever it sits on the page
      var v = el("video", {
        loop: "", playsinline: "", preload: "none",
        width: "720", height: "1280", "data-src": ev.video.src, "data-poster": ev.video.poster,
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
    function load(v) {
      if (!v.poster && v.dataset.poster) v.poster = v.dataset.poster;
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
    }
    if ("IntersectionObserver" in window) {
      // a screen ahead of time: the slide is ready before you get to it
      var prep = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { load(e.target.querySelector("video")); prep.unobserve(e.target); } });
      }, { rootMargin: "100% 0px" });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var v = e.target.querySelector("video");
          var dot = rail.children[[].indexOf.call(items, e.target)];
          if (e.isIntersecting) {
            load(v);
            if (!reduceMotion) v.play().catch(function () {});
            if (dot) dot.classList.add("is-active");
          } else {
            if (!v.paused) v.pause();
            if (dot) dot.classList.remove("is-active");
          }
        });
      }, { threshold: 0.55 });
      items.forEach(function (s) { prep.observe(s); io.observe(s); });
    } else {
      items.forEach(function (s) { load(s.querySelector("video")); });
    }
  })();
})();
