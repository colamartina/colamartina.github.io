/* =========================================================
   CASE STUDY — case.html?p=<slug>, rendered from data/*.js.
   A cream, document-like page: breadcrumb, "get info" panel,
   section tabs that follow the scroll, overview, the project's
   folders as file grids, and a viewer for images and videos.
   ========================================================= */
(function () {
  "use strict";

  var P = window.PORTFOLIO || {};
  var M = window.Media;
  var root = document.getElementById("case-root");
  if (!root || !M) return;
  var el = M.el;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var kinds = [
    { key: "campaigns", label: "Campaigns", anchor: "campaigns" },
    { key: "collabs", label: "Brand Collabs", anchor: "collabs" }
  ];
  var slug = new URLSearchParams(location.search).get("p");
  var found = null;
  kinds.forEach(function (k) {
    (P[k.key] || []).forEach(function (c, i) {
      if (c.slug === slug) found = { c: c, i: i, list: P[k.key], kind: k };
    });
  });

  if (!found) {
    document.title = "Case study not found — Martina Cola";
    root.replaceChildren(
      el("p.crumbs", {}, [el("a", { href: "index.html#work", text: "Work" })]),
      el("h1.case__title", { text: "Not found" }),
      el("p.case__line", {}, ["This case study does not exist. ", el("a", { href: "index.html#work", text: "Back to all work →" })])
    );
    return;
  }

  var c = found.c, kind = found.kind;
  document.title = c.title + " — " + c.brand + " · Martina Cola";
  // the page stays cream; the project's accent (blue · yellow · orange) colours its kicker and quotes
  var page = root.closest(".case-page");
  if (page) page.setAttribute("data-accent", c.accent || "blue");

  // every media item in page order, for the viewer
  var flat = [];
  c.sections.forEach(function (s) {
    s.items.forEach(function (it) { flat.push({ it: it, section: s }); });
  });

  /* ---------- header ---------- */
  var crumbs = el("nav.crumbs", { "aria-label": "Breadcrumb" }, [
    el("a", { href: "index.html#work", text: "Work" }), el("span", { "aria-hidden": "true", text: "/" }),
    el("a", { href: "index.html#" + kind.anchor, text: kind.label }), el("span", { "aria-hidden": "true", text: "/" }),
    el("span", { "aria-current": "page", text: c.slug })
  ]);

  function infoRow(label, value, todoText) {
    return el("div", {}, [el("dt", { text: label }), el("dd", {}, [value || M.todo(todoText)])]);
  }
  var info = el("dl.info", {}, [
    infoRow("Brand", c.brand),
    infoRow("Year", c.year, "anno da confermare"),
    infoRow("Type", c.type),
    infoRow("Role", c.role, "il tuo ruolo"),
    infoRow("Includes", c.sections.map(function (s) { return s.label; }).join(" · ")),
    infoRow("Files", flat.length + " items")
  ]);
  info.querySelectorAll("div").forEach(function (row) {
    if (!row.querySelector("dd").childNodes.length) row.remove(); // published site: no empty rows
  });

  var head = el("header.case__head", {}, [
    el("div.case__intro", {}, [
      c.kicker ? el("p.case__kicker", { text: c.kicker }) : null,
      el("h1.case__title", { text: c.title }),
      el("p.case__line", {}, [c.line || M.todo("descrizione di una riga")])
    ]),
    info
  ]);

  var devNotes = M.isLocal && c.todo && c.todo.length
    ? el("div.case__todo", {}, c.todo.map(function (t) { return el("span.todo", { text: t }); }))
    : null;

  /* ---------- cover ---------- */
  var cover = el("figure.window.case__cover", {}, [
    el("div.window__bar", {}, [
      el("span.window__dots", { "aria-hidden": "true" }, [el("i"), el("i"), el("i")]),
      el("span.file", { text: c.cover.name })
    ]),
    el("div.window__body", {}, [M.img(c.cover, "(max-width: 1500px) 100vw, 1500px", { eager: true, alt: c.title + " — cover" })])
  ]);

  /* ---------- section tabs ---------- */
  var tabs = el("nav.case__tabs", { "aria-label": "Project sections" }, [
    el("a.tab", { href: "#overview" }, ["Overview"])
  ].concat(c.sections.map(function (s) {
    return el("a.tab", { href: "#" + s.id }, [s.label, el("span", { text: String(s.items.length) })]);
  })));

  /* ---------- overview ---------- */
  function block(title, content, todoText) {
    var b = el("div.case__block" + (content ? "" : ".needs-content"), {}, [
      el("h2.case__h", { text: title }),
      content || M.todo(todoText)
    ]);
    return b;
  }
  var whatIDid = c.whatIDid ? el("ul.case__list", {}, c.whatIDid.map(function (t) { return el("li", { text: t }); })) : null;
  var results = c.results ? el("div.results", {}, c.results.map(function (r) {
    return el("p.result", {}, [el("span.result__value", { text: r.value }), el("span.result__label", { text: r.label })]);
  })) : null;

  var overview = el("section.case__overview", { id: "overview", "aria-label": "Overview" }, [
    el("div.case__story", {}, [
      block("Context & objective", c.context ? el("p.case__text", { text: c.context }) : null, "contesto e obiettivo"),
      block("What I did", whatIDid, "cosa ho fatto"),
      block("Results", results, "risultati (numeri quando disponibili)")
    ]),
    c.quotes && c.quotes.length ? el("aside.quotes", { "aria-label": "From the campaign" }, [
      el("p.case__h", { text: "From the campaign" })
    ].concat(c.quotes.map(function (q) {
      return el("figure.quote", {}, [el("blockquote.quote__text", { text: "“" + q.text + "”" }), el("figcaption.quote__src", { text: q.source })]);
    }))) : null
  ]);

  /* ---------- media sections ---------- */
  var n = 0;
  var sections = c.sections.map(function (s) {
    var grid = el("ul." + (s.mode === "files" ? "files" : "gallery"), { role: "list" });
    s.items.forEach(function (it) {
      var i = n++;
      var sizes = s.mode === "files" ? "(max-width: 640px) 50vw, 240px" : "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw";
      var thumb = el("span.tile__thumb" + (it.bg === "blue" ? ".tile__thumb--blue" : ""), {}, [
        M.img(it, sizes, { alt: "" }),
        it.type === "video" ? el("span.tile__play", { text: M.duration(it.duration) }) : null
      ]);
      var name = el("span.tile__name", {}, [el("b", { text: it.name }), el("span", { text: it.type === "video" ? "video" : "" })]);
      var tile = el("button.tile", { type: "button", "aria-label": "Open " + it.name + (it.type === "video" ? " (video)" : ""), "data-i": String(i) }, [thumb, name]);
      grid.appendChild(el("li", {}, [tile]));
    });
    return el("section.case__sec", { id: s.id, "aria-labelledby": s.id + "-title" }, [
      el("header.case__sec-head", {}, [
        el("h2.case__sec-title", { id: s.id + "-title", text: s.label }),
        el("span.file.file--folder", { text: s.path }),
        s.note ? el("span.case__sec-note", { text: s.note }) : null,
        el("span.case__sec-count", { text: s.items.length + (s.items.length === 1 ? " file" : " files") })
      ]),
      grid
    ]);
  });

  /* ---------- pager ---------- */
  var list = found.list, len = list.length;
  var prev = list[(found.i - 1 + len) % len], next = list[(found.i + 1) % len];
  var pager = len > 1 ? el("nav.pager", { "aria-label": "More " + kind.label.toLowerCase() }, [
    el("a.pager__prev", { href: "case.html?p=" + encodeURIComponent(prev.slug) }, [el("span.pager__label", { text: "← Previous" }), el("span.pager__title", { text: prev.title })]),
    el("a.pager__all", { href: "index.html#" + kind.anchor, text: "All " + kind.label.toLowerCase() }),
    el("a.pager__next", { href: "case.html?p=" + encodeURIComponent(next.slug) }, [el("span.pager__label", { text: "Next →" }), el("span.pager__title", { text: next.title })])
  ]) : null;

  root.replaceChildren.apply(root, [crumbs, head, devNotes, cover, tabs, overview].concat(sections, [pager]).filter(Boolean));

  /* ---------- tabs follow the scroll ---------- */
  if ("IntersectionObserver" in window) {
    var tabLinks = tabs.querySelectorAll("a");
    var targets = [overview].concat(sections);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tabLinks.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + e.target.id;
          a.classList.toggle("is-active", on);
          if (on) {
            a.setAttribute("aria-current", "true");
            // keep the active tab visible in the scrollable bar (mobile)
            var bar = tabs.getBoundingClientRect(), r = a.getBoundingClientRect();
            if (r.left < bar.left || r.right > bar.right) tabs.scrollBy({ left: r.left - bar.left - 24, behavior: reduceMotion ? "auto" : "smooth" });
          } else {
            a.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---------- viewer ---------- */
  var dialog = document.getElementById("viewer");
  if (!dialog || typeof dialog.showModal !== "function") return;
  var stage = dialog.querySelector(".viewer__stage");
  var vTitle = dialog.querySelector(".viewer__title");
  var vPath = dialog.querySelector(".viewer__path");
  var vCount = dialog.querySelector(".viewer__count");
  var current = 0;

  function show(i) {
    current = (i + flat.length) % flat.length;
    var entry = flat[current], it = entry.it, media;
    if (it.type === "video") {
      media = el("video", { src: it.src, poster: it.poster, controls: "", playsinline: "", preload: "auto" });
      // start with sound (the user just clicked); if the browser refuses, start muted — controls can unmute
      media.addEventListener("loadeddata", function () {
        media.play().catch(function () { media.muted = true; media.play().catch(function () {}); });
      }, { once: true });
    } else {
      media = el("img", { src: it.src + "-" + it.widths[it.widths.length - 1] + ".webp", srcset: M.srcset(it), sizes: "100vw", alt: c.title + " — " + entry.section.label + ": " + it.name });
    }
    stage.replaceChildren(media);
    vTitle.textContent = it.name;
    vPath.textContent = entry.section.path;
    vCount.textContent = (current + 1) + " / " + flat.length;
  }

  var opener = null;
  root.addEventListener("click", function (e) {
    var tile = e.target.closest(".tile");
    if (!tile) return;
    opener = tile;
    show(+tile.getAttribute("data-i"));
    dialog.showModal();
  });
  dialog.querySelector("[data-prev]").addEventListener("click", function () { show(current - 1); });
  dialog.querySelector("[data-next]").addEventListener("click", function () { show(current + 1); });
  dialog.querySelector("[data-close]").addEventListener("click", function () { dialog.close(); });
  // keys work wherever the focus is while the viewer is open (explicit Escape: same result in every browser)
  document.addEventListener("keydown", function (e) {
    if (!dialog.open) return;
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "Escape") { e.preventDefault(); dialog.close(); }
  });
  // swipe on touch screens; a tap on the empty area around the media closes the viewer
  var sx = null, swiped = false;
  stage.addEventListener("pointerdown", function (e) { sx = e.clientX; swiped = false; });
  stage.addEventListener("pointerup", function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx;
    sx = null;
    if (Math.abs(dx) > 60) { swiped = true; show(current + (dx < 0 ? 1 : -1)); }
  });
  dialog.addEventListener("click", function (e) {
    if (swiped) { swiped = false; return; }
    if (e.target === dialog || e.target === stage) dialog.close();
  });
  dialog.addEventListener("close", function () {
    if (dialog.open) return;          // reopened before this event fired
    stage.replaceChildren();          // stops any playing video
    if (opener) opener.focus();       // keyboard users land back on the file they opened
  });
})();
