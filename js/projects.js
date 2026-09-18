/* =========================================================
   PROJECTS (the campaigns and the brand collabs) and EVENTS.
   Home page: a card for every project (the covers of work/), in its group,
   the first ones on show (six Projects, three Events) and the others behind
   "See more" ("See less" closes them again). A project is in one group only:
   the one data/selection.js lists it in, or else the one of its data file.
   A card opens the project's own page, project.html?p=<slug>,
   told like a project page of work/: the pictures for the vibe, the title and
   the short text, then a folder for each kind of work the project holds, as
   many as it has (paid media, social media, UGC, e-commerce… behind the scenes
   last); the previous and the next project at the bottom. The group sets the
   look (a project on cream paper, an event on the burgundy stage, its first
   photo and video beside the text); the files set what the page holds: every
   one of them is on it, none is left out to make pages alike.
   What is shown: data/selection.js. The files, covers and texts: work/projects.js
   and data/*.js, read the same way work/work.js reads them.
   On a project page every file keeps its own shape: side by side in rows as
   wide as the page, each row one height (laid out here, again when the width
   changes).
   ========================================================= */
(function () {
  "use strict";

  var P = window.PORTFOLIO || {};
  var M = window.Media;
  var SEL = P.selection;
  if (!M || !SEL || !window.SELECTED) return;
  var el = M.el;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var phone = window.matchMedia("(max-width: 640px)");
  var WIDE = 2.2;                                          // a banner: at least this wide for its height, alone in its row
  var STICKERS = { graphics: true, stickers: true, badges: true };   // on work/ these become the badges; here too: stickers()
  var LEAD = 2;                                            // an event: the pictures beside its text (its photo, its video)
  // the groups: their names in the crumbs and the pager, the data files whose projects they take (data/campaigns.js,
  // collabs.js, events.js), and how many cards the home page shows before "See more"
  var GROUPS = {
    projects: { name: "Projects", noun: "projects", kinds: ["campaigns", "collabs"], shown: 6 },
    events: { name: "Events", noun: "events", kinds: ["events"], shown: 3 }
  };

  /* ---------- a project of work/, its files found as work/work.js finds them ---------- */
  var data = {};
  ["campaigns", "collabs", "events"].forEach(function (k) {
    (P[k] || []).forEach(function (p) { data[p.slug] = { p: p, kind: k }; });
  });
  var entries = {};
  window.SELECTED.forEach(function (e) { entries[e.slug] = e; });

  function resolve(slug, s) {
    var e = entries[slug], d = data[slug];
    if (!e || !d) return null;
    var p = d.p, sections = p.sections || [];
    // every file of the project: its folders, and an event's video
    var files = sections.reduce(function (all, s) { return all.concat(s.items); }, []);
    if (p.video && !files.some(function (f) { return f && f.name === p.video.name; })) files.push(p.video);
    // a pick is a file name, { name, focus }, or a file of its own from work/projects.js (PHOTOS, VIDEOS)
    function find(pick) {
      if (!pick) return null;
      if (pick.src) return { it: Object.assign({ type: "image" }, pick), focus: pick.focus || null };
      var name = typeof pick === "string" ? pick : pick.name;
      var it = files.filter(function (f) { return f && f.name === name; })[0];
      return it ? { it: it, focus: (pick && pick.focus) || null } : null;
    }
    var cover = find(e.cover);
    if (!cover) return null;
    var images = (e.images || []).map(find).filter(function (m) { return m && m.it.type === "image"; });
    var videos = (e.videos || []).map(find).filter(function (m) { return m && m.it.type === "video"; });
    // a photo taken only as the cover (an event's) is one of the project's photos too
    if (!images.concat(videos).some(function (m) { return m.it.name === cover.it.name; }))
      (cover.it.type === "video" ? videos : images).unshift({ it: cover.it, focus: null });

    // its folders, with every file but the ones hidden on work/, moved, added and ordered as on work/ (the photos
    // and videos above stay in their folders too: arrange() puts each file in one place)
    var shown = {}, show = (s && s.show) || [];
    (e.hide || []).forEach(function (name) { if (show.indexOf(name) < 0) shown[name] = true; });
    var moved = e.move || {};
    var folders = sections.map(function (s) {
      return { id: s.id, label: s.label, note: s.note, items: s.items.filter(function (it) { return !moved[it.name]; }) };
    });
    Object.keys(moved).forEach(function (name) {
      var it = files.filter(function (f) { return f && f.name === name; })[0];
      if (!it) return;
      var to = folders.filter(function (s) { return s.id === moved[name]; })[0];
      if (!to) folders.push(to = { id: moved[name], items: [] });
      to.items.push(it);
    });
    Object.keys(e.add || {}).forEach(function (id) {
      if (!folders.some(function (s) { return s.id === id; })) folders.push({ id: id, items: [] });
    });
    var rest = {};
    folders.forEach(function (s) {
      var extra = ((e.add || {})[s.id] || []).map(function (x) { return Object.assign({ type: "image" }, x); });
      var wanted = (e.order || {})[s.id] || [];
      rest[s.id] = {
        label: (e.labels || {})[s.id] || s.label,
        renamed: !!(e.labels || {})[s.id],                 // named on work/: that name wins over the usual one
        note: s.note,
        loose: !!STICKERS[s.id],                           // badges and stickers: loose around the project
        items: s.items.concat(extra)
          .map(function (it, k) { var w = wanted.indexOf(it.name); return { it: it, key: w < 0 ? wanted.length + k : w }; })
          .sort(function (a, b) { return a.key - b.key; })
          .map(function (x) { return { it: x.it, focus: null }; })
          .filter(function (m) { return !shown[m.it.name]; })
      };
    });

    // a banner made for computers and one for phones: only the one for this screen shows
    var formats = {}, present = {};
    images.concat(videos).forEach(function (m) { present[m.it.name] = true; });
    Object.keys(rest).forEach(function (id) { rest[id].items.forEach(function (m) { present[m.it.name] = true; }); });
    function twins(wide, narrow) {
      if (wide !== narrow && present[wide] && present[narrow]) { formats[wide] = "wide"; formats[narrow] = "narrow"; }
    }
    Object.keys(present).forEach(function (name) { if (/desktop/i.test(name)) twins(name, name.replace(/desktop/gi, "mobile")); });
    Object.keys(e.mobile || {}).forEach(function (name) { twins(name, e.mobile[name]); });

    return {
      p: p, text: e.text,
      cover: { it: cover.it, focus: e.focus || cover.focus || null, zoom: e.zoom || null },
      images: images, videos: videos, pool: images.concat(videos), rest: rest, formats: formats
    };
  }

  // the projects of a group: the ones data/selection.js lists in it, in its order, then every other one of work/
  // from the data files of the group that no group lists, in the order of work/; each with what data/selection.js
  // says about it
  function group(key) {
    var listed = SEL[key] || [], taken = {};
    Object.keys(GROUPS).forEach(function (k) { (SEL[k] || []).forEach(function (s) { taken[s.slug] = true; }); });
    var others = window.SELECTED
      .filter(function (e) { return !taken[e.slug] && data[e.slug] && GROUPS[key].kinds.indexOf(data[e.slug].kind) >= 0; })
      .map(function (e) { return { slug: e.slug }; });
    return listed.concat(others).map(function (s) {
      var r = resolve(s.slug, s);
      if (!r) return null;
      var p = r.p;
      var title = s.title || p.title, kicker = s.kicker !== undefined ? s.kicker : p.kicker;
      function other(v) { return v && [title, kicker].every(function (w) { return !w || w.toLowerCase() !== v.toLowerCase(); }); }
      return {
        key: key, s: s, r: r, slug: s.slug, title: title,
        kicker: kicker,
        brand: s.brand || p.brand,
        partner: s.partner !== undefined ? s.partner : p.partner || null,
        by: s.by || s.brand || p.brand,
        year: p.year || null,
        place: s.place || p.place || null,
        type: other(p.type) ? p.type : null
      };
    }).filter(Boolean);
  }
  function href(x) { return "project.html?p=" + encodeURIComponent(x.slug); }

  // files by name, in the order asked (a name not found is skipped); without names, all of them
  function take(list, names) {
    if (!names) return list.slice();
    return names.map(function (n) { return list.filter(function (m) { return m.it.name === n; })[0]; }).filter(Boolean);
  }
  // the files named first, in that order, then all the others, in theirs: a pick orders a folder, it hides nothing
  function first(list, names) {
    var picked = take(list, names);
    return picked.concat(list.filter(function (m) { return picked.indexOf(m) < 0; }));
  }
  function ofType(type) { return function (m) { return m.it.type === type; }; }

  // beside an event's text: its first photo and its first video; with more, they follow in folders
  function lead(pool) {
    if (pool.length <= LEAD) return pool.slice();
    var picked = [pool.filter(ofType("image"))[0], pool.filter(ofType("video"))[0]].filter(Boolean);
    pool.forEach(function (m) { if (picked.length < LEAD && picked.indexOf(m) < 0) picked.push(m); });
    return pool.filter(function (m) { return picked.indexOf(m) >= 0; });
  }

  // the folders of a project page, whatever kinds of work the project holds, in this order: the idea and the look,
  // what was made, the campaign or the event itself, then its channels as on work/ (paid media, social media, UGC,
  // e-commerce) and the rest; a folder not named here comes after them, behind the scenes always last. The group
  // puts its own kind of work first (LEADS): an event opens on the event itself
  var ORDER = [
    "brief", "concept", "moodboards", "graphics", "product", "key-visuals", "photos", "videos", "teaser",
    "posters", "placements", "on-site", "video", "event", "popup", "in-store", "reel", "pr",
    "paid-ads", "social", "influencer", "ugc", "ecom", "website", "newsletter",
    "stickers", "badges", "post-event"
  ];
  var LEADS = { events: ["event", "popup", "in-store", "on-site", "reel", "photos", "videos"] };
  var NAMES = {
    "key-visuals": "More visuals", photos: "Photos", videos: "Videos", "paid-ads": "Paid media",
    social: "Social media", ugc: "UGC", ecom: "E-commerce", bts: "Behind the scenes"
  };

  // what a project page shows, and where: every file of the project once, none left out (only what work/ hides).
  //   the vibe     the pictures picked in data/selection.js (any file of the project), or else the photos and
  //                videos of work/ (an event: its first photo and its first video, beside the text)
  //   the folders  the ones data/selection.js lists, in its order (a pick puts its files first), then every other
  //                folder that still holds a file, in the order above. "photos" / "videos": the photos / videos of
  //                work/ not in the vibe; one of them that belongs to a folder goes back to it, first, in the
  //                order of work/
  //   the stickers the files of its sticker folders (badges, graphics, stickers): loose around the project, stickers()
  function arrange(x) {
    var r = x.r, s = x.s, event = x.key === "events";
    var placed = {};
    function free(list) { return list.filter(function (m) { return !placed[m.it.name]; }); }
    function place(list) { list.forEach(function (m) { placed[m.it.name] = true; }); return list; }
    var inFolder = {};
    Object.keys(r.rest).forEach(function (id) { r.rest[id].items.forEach(function (m) { inFolder[m.it.name] = true; }); });

    var every = r.pool.concat(Object.keys(r.rest).reduce(function (all, id) { return all.concat(r.rest[id].items); }, []));
    var vibe = place(s.vibe ? take(every, s.vibe) : event ? lead(r.pool) : r.pool.slice());

    function source(id, listed) {
      if (id === "photos" || id === "videos") {
        return r.pool.filter(ofType(id === "photos" ? "image" : "video"))
          .filter(function (m) { return listed || !inFolder[m.it.name]; });
      }
      return r.rest[id] ? r.rest[id].items : [];
    }
    var listed = s.folders || [], ids = listed.map(function (f) { return f.id; }), leads = LEADS[x.key] || [];
    var others = Object.keys(r.rest).concat(["photos", "videos"])
      .filter(function (id) { return ids.indexOf(id) < 0; })
      .map(function (id, k) {
        var lead = leads.indexOf(id), at = ORDER.indexOf(id);
        return { f: { id: id }, key: id === "bts" ? 1e4 : lead >= 0 ? lead - 100 : at < 0 ? ORDER.length + k : at };
      })
      .sort(function (a, b) { return a.key - b.key; });
    var all = listed.map(function (f) { return { f: f, listed: true }; }).concat(others);
    all = all.filter(function (o) { return o.f.id !== "bts"; }).concat(all.filter(function (o) { return o.f.id === "bts"; }));

    var stickers = [], pool = r.pool.map(function (m) { return m.it.name; });
    function poolFirst(list) {                         // a photo or video of work/ back in its folder: first, in work/'s order
      return list.slice().sort(function (a, b) {
        var i = pool.indexOf(a.it.name), j = pool.indexOf(b.it.name);
        return (i < 0 ? 1e4 + list.indexOf(a) : i) - (j < 0 ? 1e4 + list.indexOf(b) : j);
      });
    }
    var folders = all.map(function (o) {
      var f = o.f, src = r.rest[f.id] || {};
      var items = place(first(poolFirst(free(source(f.id, o.listed))), f.pick));
      if (src.loose) { stickers = stickers.concat(items); return null; }
      return {
        f: f,
        label: f.label || (src.renamed && src.label) || NAMES[f.id] || src.label || f.id,
        note: f.note !== undefined ? f.note : src.note || null,      // null in data/selection.js: no note here
        items: items
      };
    }).filter(function (g) { return g && g.items.length; });
    return { vibe: vibe, folders: folders, stickers: stickers };
  }

  /* ---------- home: the cards ---------- */
  // a cover cut as on work/: its focus, and a closer frame around it when it has a zoom (data/selection.js can give
  // the card its own, and its own picture: card)
  function cover(x, sizes, alt) {
    var c = x.r.cover, it = x.s.card ? Object.assign({ type: "image" }, x.s.card) : c.it;
    var focus = x.s.focus || c.focus, zoom = x.s.zoom || c.zoom, img = M.img(it, sizes, { alt: alt });
    if (focus) img.style.objectPosition = focus;
    if (zoom) { img.style.setProperty("--zoom", zoom); img.style.transformOrigin = focus || "50% 50%"; }
    return img;
  }

  function cards(key) {
    var section = document.getElementById(key);
    var host = section && section.querySelector(".sec__body");
    var list = group(key);
    if (!host || !list.length) return;
    var event = key === "events";

    // the first cards are on show; the others wait under them, hidden, and "See more" brings them in (fold)
    var shown = GROUPS[key].shown;
    var items = list.map(function (x, i) {
      var aside = event ? x.place : x.year;               // beside the name: the year, or where the event was
      var under = event ? x.by : x.type;                  // on the right under it: the type, or the brand
      var later = i >= shown;
      return el("li.c-card", { "data-reveal": later ? null : "", hidden: later ? "" : null }, [
        el("a.c-card__link", { href: href(x) }, [
          el("div.c-card__media", {}, [
            cover(x, "(max-width: 640px) 92vw, (max-width: 1500px) 30vw, 440px", x.title + ", " + x.brand),
            el("span.c-card__go", { "aria-hidden": "true", text: "↗" })
          ]),
          el("div.c-card__cap", {}, [
            el("span.c-card__t", { text: x.title }),
            el("span.c-card__y", { text: aside || "" }),
            x.kicker ? el("span.c-card__k", { text: x.kicker }) : null,
            under ? el("span.c-card__m", { text: under }) : null
          ])
        ])
      ]);
    });
    var grid = el("ul.c-grid.c-grid--three", { role: "list", id: key + "-cards" }, items);
    var extra = items.slice(shown);
    if (!extra.length) { host.replaceChildren(grid); return; }

    var btn = el("button.btn.btn--ghost.c-more", { type: "button", "aria-controls": grid.id }, []);
    host.replaceChildren(grid, el("div.c-more__wrap", { "data-reveal": "" }, [btn]));
    fold(section, grid, extra, btn);
  }

  /* ---------- home: "See more" / "See less" ---------- */
  // "See more" opens the grid down over the other cards, and they come up as the first ones did (script.js's
  // reveal: from 26px lower, faded in, a little one after the other, as they reach the screen). "See less" fades
  // them and closes the grid again, and the page follows, so the button stays under the pointer and the first
  // cards come back above it (never higher than the top of the section). The grid's edge eases in and out: with
  // the site's quick ease a whole list moved a screen in two frames. Back from a project (history back), the list
  // is as it was left.
  var FOLD = { duration: 800, easing: "cubic-bezier(0.65, 0, 0.35, 1)" };

  function fold(section, grid, extra, btn) {
    var root = document.documentElement, mark = "open-" + section.id;
    var animate = !reduceMotion && !!grid.animate;
    var open = false, stop = null;
    var io = animate && "IntersectionObserver" in window ? new IntersectionObserver(function (list) {
      list.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" }) : null;

    function show(on) { extra.forEach(function (li) { li.hidden = !on; }); }
    function height() { return grid.getBoundingClientRect().height; }
    function label() {
      btn.textContent = open ? "See less" : "See more";
      btn.setAttribute("aria-expanded", String(open));
    }
    function arrive() {
      extra.forEach(function (li) {
        li.setAttribute("data-reveal", "");
        li.style.transitionDelay = "";
        li.classList.remove("is-in");
        if (io) io.observe(li); else li.classList.add("is-in");
      });
    }
    function leave() {
      extra.forEach(function (li) {
        if (io) io.unobserve(li);
        li.style.transitionDelay = "0s";
        li.classList.remove("is-in");
      });
    }

    function toggle(keyboard) {
      var from = height();                                 // still moving: the new move starts where the edge is
      if (stop) stop();
      open = !open;
      label();
      try { var st = Object.assign({}, history.state); st[mark] = open; history.replaceState(st, ""); } catch (e) {}

      var y = window.scrollY;
      show(false);
      var closed = height();                               // the grid with the first cards only
      show(true);
      var to = open ? height() : closed;
      // closing: the height the page loses above the screen comes off the scroll, so what is on screen stays
      var room = open ? 0 : Math.max(0, -section.getBoundingClientRect().top);
      function place(h) { if (room) window.scrollTo(0, y - Math.min(from - h, room)); }

      if (open) arrive(); else leave();
      // opened from the keyboard: on to the first new card (the cards come before the button)
      if (open && keyboard) extra[0].querySelector("a").focus({ preventScroll: true });

      if (!animate) {
        show(open);
        root.style.scrollBehavior = "auto";
        place(closed);
        root.style.scrollBehavior = "";
        return;
      }
      grid.classList.add("is-folding");
      root.style.overflowAnchor = "none";                  // the browser's own scroll anchoring stays out of it
      root.style.scrollBehavior = "auto";                  // html scrolls smoothly (styles.css): each step lands at once
      var anim = grid.animate([{ height: from + "px" }, { height: to + "px" }], Object.assign({ fill: "forwards" }, FOLD));
      var mine = false;                                    // the visitor scrolls: the page is theirs again
      function theirs() { mine = true; }
      function off() { ["wheel", "touchstart", "keydown"].forEach(function (t) { window.removeEventListener(t, theirs); }); }
      ["wheel", "touchstart", "keydown"].forEach(function (t) { window.addEventListener(t, theirs, { passive: true }); });
      function halt() { anim.cancel(); off(); stop = null; }
      stop = halt;
      (function follow() {
        if (stop !== halt || mine || !room) return;
        place(height());
        requestAnimationFrame(follow);
      })();
      anim.onfinish = function () {
        if (stop !== halt) return;
        stop = null;
        off();
        if (!open) show(false);
        anim.cancel();
        grid.classList.remove("is-folding");
        if (!mine) place(closed);
        root.style.overflowAnchor = "";
        root.style.scrollBehavior = "";
      };
    }

    btn.addEventListener("click", function (e) { toggle(e.detail === 0); });
    // the covers start loading when the pointer or the focus comes to the button, a moment before they are needed
    function warm() { extra.forEach(function (li) { li.querySelector("img").loading = "eager"; }); }
    btn.addEventListener("pointerenter", warm, { once: true });
    btn.addEventListener("focus", warm, { once: true });
    if (history.state && history.state[mark]) { open = true; show(true); arrive(); }
    label();
  }

  /* ---------- a project page: media ---------- */
  var sounds = [];                                         // one sound at a time on the whole page
  function video(it, label) {
    var v = el("video", {
      loop: "", muted: "", playsinline: "", preload: "none",
      "data-src": it.src, "data-poster": it.poster, "aria-label": label
    });
    v.muted = true;                                        // the property, not just the attribute: needed for autoplay
    if (reduceMotion) v.setAttribute("controls", "");      // nothing moves by itself: the visitor presses play
    var kids = [v];
    if (it.audio && !reduceMotion) {
      var btn = el("button.study__sound", { type: "button", "aria-pressed": "false" }, ["Sound off"]);
      btn.addEventListener("click", function () {
        var on = v.muted;
        sounds.forEach(function (s) { s.v.muted = true; s.btn.setAttribute("aria-pressed", "false"); s.btn.textContent = "Sound off"; });
        v.muted = !on;
        if (on && v.paused) v.play().catch(function () {});
        btn.setAttribute("aria-pressed", String(on));
        btn.textContent = on ? "Sound on" : "Sound off";
      });
      sounds.push({ v: v, btn: btn });
      kids.push(btn);
    }
    return kids;
  }

  function figure(m, alt, formats) {
    var it = m.it;
    var fig = el("figure.study__fig" + (it.type === "video" ? ".study__fig--video" : ""), { style: "--r: " + it.ratio },
      it.type === "video" ? video(it, alt) : [M.img(it, "33vw", { alt: alt })]);
    return { node: fig, r: it.ratio, format: formats[it.name] || null };
  }

  function mediaBox(list, alt, formats) {
    var box = el("div.study__media", {});
    box._items = list.map(function (m) { return figure(m, alt, formats); });
    return box;
  }

  /* ---------- rows: side by side, each row one height, as wide as the page ---------- */
  // the height a row aims for, from the width it has: tall on a phone (two to a row), lower on a wide screen
  function aim(W) {
    var k = W <= 400 ? 0.8 : W <= 700 ? 0.8 - 0.38 * (W - 400) / 300 : W <= 1300 ? 0.42 - 0.06 * (W - 700) / 600 : 0.36;
    return Math.min(W * k, 480);
  }
  function gapFor(W) { return W < 600 ? 8 : W < 1000 ? 10 : 14; }
  function sum(list) { return list.reduce(function (s, x) { return s + x.r; }, 0); }

  // the rows closest to the aimed height, all together (few files: every way of cutting them is tried).
  // A row too short to fill the width stays at the aimed height with room beside it: better at the end
  // than in the middle. No file gets narrower than a thumb (a video still has to be watched), and a row
  // holds no more than most files, when a project asks for it (row in data/selection.js)
  function rows(items, W, H, g, most) {
    var n = items.length, best = [0], cut = [0], narrowest = 130;
    for (var j = 1; j <= n; j++) {
      best[j] = Infinity;
      for (var i = j - 1; i >= 0; i--) {
        if (most && j - i > most) break;
        var row = items.slice(i, j);
        var wide = row.some(function (x) { return x.r >= WIDE; });
        if (wide && row.length > 1) break;
        var h = (W - (row.length - 1) * g) / sum(row), cost = 0;
        if (!wide) {
          if (h > H) cost = (1 - (sum(row) * H + (row.length - 1) * g) / W) * (j === n ? 0.5 : 1);
          else cost = Math.pow(Math.log(h / H), 2);
          if (row.some(function (x) { return Math.min(h, H) * x.r < narrowest; })) cost += 2;
        }
        if (best[i] + cost < best[j]) { best[j] = best[i] + cost; cut[j] = i; }
      }
    }
    var out = [];
    for (var k = n; k > 0; k = cut[k]) out.unshift(items.slice(cut[k], k));
    return out;
  }

  function size(row, h) {
    row.forEach(function (x) {
      var w = h * x.r;
      x.node.style.width = w.toFixed(2) + "px";
      x.node.style.height = h.toFixed(2) + "px";
      var img = x.node.querySelector("img");
      if (img) img.sizes = Math.ceil(w) + "px";
    });
  }

  // (re)fills a box with its rows; force: one row at that height (a folder sharing its line)
  function lay(box, W, force) {
    var H = aim(W), g = gapFor(W), kind = phone.matches ? "narrow" : "wide";
    var items = box._items.filter(function (x) { return !x.format || x.format === kind; });
    var list = force ? [items] : rows(items, W, H, g, box._most);
    var key = kind + "|" + list.map(function (r) { return r.map(function (x) { return box._items.indexOf(x); }).join(","); }).join("/");
    if (box._key !== key) {
      box._key = key;
      box.replaceChildren.apply(box, list.map(function (r) {
        return el("div.study__row", {}, r.map(function (x) { return x.node; }));
      }));
      replay(box);
    }
    box.style.setProperty("--gap", g + "px");
    list.forEach(function (r) {
      var h = force || (W - (r.length - 1) * g) / sum(r);
      if (!force) h = r.length === 1 && r[0].r >= WIDE ? Math.min(h, H * 1.25) : Math.min(h, H);
      size(r, h);
    });
  }

  // two folders on one line (beside in data/selection.js), when both fit at a good height; otherwise one under the other
  function layPair(pair, W) {
    var a = pair._boxes[0], b = pair._boxes[1], H = aim(W), g = gapFor(W), between = Math.round(g * 4);
    var kind = phone.matches ? "narrow" : "wide";
    function visible(box) { return box._items.filter(function (x) { return !x.format || x.format === kind; }); }
    var ia = visible(a), ib = visible(b);
    var h = (W - between - (ia.length - 1) * g - (ib.length - 1) * g) / (sum(ia) + sum(ib));
    var ok = W >= 700 && ia.length && ib.length && !ia.concat(ib).some(function (x) { return x.r >= WIDE; }) && h >= H * 0.68;
    pair.classList.toggle("is-beside", !!ok);
    pair.style.setProperty("--between", between + "px");
    if (ok) { h = Math.min(h, H); lay(a, W, h); lay(b, W, h); }
    else { lay(a, W); lay(b, W); }
  }

  /* ---------- videos: loaded a screen ahead, played while on screen ---------- */
  var near = null, seen = null;
  if ("IntersectionObserver" in window) {
    near = new IntersectionObserver(function (list) {
      list.forEach(function (e) { if (e.isIntersecting) { load(e.target); near.unobserve(e.target); } });
    }, { rootMargin: "100% 0px" });
    seen = new IntersectionObserver(function (list) {
      list.forEach(function (e) {
        var v = e.target;
        v._on = e.isIntersecting;
        if (e.isIntersecting) play(v);
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.5 });
  }
  function load(v) {
    if (v.getAttribute("src")) return;
    v.poster = v.getAttribute("data-poster");
    v.src = v.getAttribute("data-src");
  }
  function play(v) {
    load(v);
    // a browser can refuse to start it (an iPhone in Low Power Mode): the visitor then gets the controls
    if (!reduceMotion) v.play().catch(function (err) { if (err && err.name === "NotAllowedError") v.controls = true; });
  }
  function watch(v) {
    if (near) { near.observe(v); seen.observe(v); } else load(v);
  }
  // moved into new rows, a video stops: the ones on screen start again
  function replay(box) {
    box.querySelectorAll("video").forEach(function (v) { if (v._on) play(v); });
  }

  /* ---------- a project page: the project ---------- */
  function info(list) {
    return el("dl.info", {}, list.filter(function (r) { return r[1]; }).map(function (r) {
      return el("div", {}, [el("dt", { text: r[0] }), el("dd", { text: r[1] })]);
    }));
  }

  function study(x) {
    var r = x.r, event = x.key === "events";
    var boxes = [], pairs = [];
    var parts = arrange(x);

    // the vibe, before the text (an event: beside it)
    var vibe = mediaBox(parts.vibe, x.title, r.formats);
    vibe._most = x.s.row || 0;
    vibe.classList.add("study__vibe");
    vibe.setAttribute("data-reveal", "");
    if (event) {
      // one height for all, never wider than the page (--sum: their shapes added up)
      vibe.style.setProperty("--sum", sum(vibe._items).toFixed(4));
      vibe.style.setProperty("--gaps", (vibe._items.length - 1) * 12 + "px");
      vibe.replaceChildren.apply(vibe, vibe._items.map(function (i) { return i.node; }));
    } else {
      boxes.push(vibe);
    }

    // a folder for each kind of work the project holds (arrange): as many as it has, each with its name and a note
    var folders = parts.folders.map(function (g) {
      var box = mediaBox(g.items, x.title + ", " + g.label.toLowerCase(), r.formats);
      var node = el("section.study__folder", { "aria-label": g.label, "data-reveal": "" }, [
        el("h2.study__label", {}, [
          el("span", { text: g.label }),
          g.note ? el("span.study__note", { text: g.note }) : null
        ]),
        box
      ]);
      return { f: g.f, node: node, box: box, label: g.label };
    });

    var about = el("div.study__about", { "data-reveal": "" }, [
      el("div.study__intro", {}, [
        x.kicker ? el("p.study__kicker", { text: x.kicker }) : null,
        el("h1.study__title", { text: x.title }),
        r.text ? el("p.study__text", { text: r.text }) : null
      ]),
      info([
        ["Brand", x.brand],
        ["Partner", x.partner],
        event ? ["Place", x.place] : null,
        ["Year", x.year],
        ["Type", x.type],
        ["Role", x.s.role || r.p.role],
        ["Includes", folders.length > 1 ? folders.map(function (f) { return f.label; }).join(" · ") : null]
      ].filter(Boolean)),
      x.s.results ? el("div.results", {}, x.s.results.map(function (v) {
        return el("p.result", {}, [el("span.result__value", { text: v.value }), el("span.result__label", { text: v.label })]);
      })) : null
    ]);

    // folders that share a line on a wide screen go in pairs
    var flow = [];
    folders.forEach(function (f) {
      var prev = flow[flow.length - 1];
      if (f.f.beside && prev && !prev.pair) {
        var pair = el("div.study__pair", {}, [prev.node, f.node]);
        pair._boxes = [prev.box, f.box];
        pairs.push(pair);
        flow[flow.length - 1] = { node: pair, pair: true };
      } else {
        flow.push({ node: f.node, box: f.box });
      }
    });
    flow.forEach(function (i) { if (!i.pair) boxes.push(i.box); });

    // the project in its own words: the lines its files say (data/*.js quotes: taglines, the flyer, the newsletter…)
    var said = r.p.quotes || [], label = event ? "From the event" : "From the campaign";
    var words = said.length ? el("section.study__folder.study__words", { "aria-label": label, "data-reveal": "" }, [
      el("h2.study__label", {}, [el("span", { text: label })]),
      el("div.study__quotes", {}, said.map(function (q) {
        return el("figure.study__quote", {}, [el("blockquote", { text: "“" + q.text + "”" }), q.source ? el("figcaption", { text: q.source }) : null]);
      }))
    ]) : null;

    var body = event ? [el("div.study__spread", {}, [vibe, about])] : [vibe, about];
    var node = el("div.study" + (event ? ".study--event" : ""), { "data-accent": r.p.accent || null },
      body.concat([words], flow.map(function (i) { return i.node; })));
    node._boxes = boxes;
    node._pairs = pairs;
    node._stickers = parts.stickers;
    return node;
  }

  /* ---------- the stickers: a project's badges, loose around it ---------- */
  // The files of its sticker folders lie around the project: in the room its pictures and words leave, or stuck on
  // the edge or the corner of a picture (a part of the sticker at most, its middle never on the picture), never on a
  // word, spread down the page. Each sways a little, out of step with the others (the CV's cvSway). Picked up with a
  // mouse or a finger (pointer events) one follows the pointer anywhere on the page, above everything while in hand,
  // and stays where it is let go (no link under it opens): from then on it keeps its place in the part of the page
  // under it when the width changes. Their layer is the whole page, not the project's column. Around the first one a
  // ring of handwriting turns slowly and says they can be moved: once, then never again in this browser.
  var HINT = "portfolio:stickers-hint";
  function hinted(yes) {
    try {
      if (yes) localStorage.setItem(HINT, "1");
      else return localStorage.getItem(HINT) === "1";
    } catch (e) { return false; }
  }

  function stickers(root, list) {
    var EDGE = 6, GAP = 14, NEAR = 64, CELL = 8, STEP = 16;   // px: from the edges, from the words, "beside" something
    var COVER = 0.45, RING_COVER = 0.2;                      // the most of a sticker (of the ring around one) on pictures
    var TILT = [-7, 5, -3, 8, -5, 3];
    var WORDS = ".crumbs, .study__kicker, .study__title, .study__text, .info, .results, .study__label, .pager";
    var SAY = "you can move these around :)";
    var host = root.closest("main") || root;             // the page: the stickers can go anywhere on it
    var layer = el("div.study__stickers", { "aria-hidden": "true" });
    host.classList.add("has-stickers");
    host.appendChild(layer);

    var all = list.map(function (m, i) {
      var ratio = m.it.ratio || 1;
      var pic = M.img(m.it, "(max-width: 640px) 200px, 420px", { alt: "" });
      pic.draggable = false;
      var node = el("div.study__sticker", {
        style: "--ratio: " + ratio + "; --wide: " + Math.sqrt(ratio).toFixed(3) + "; --tilt: " + TILT[i % TILT.length] + "deg" +
          "; --sway: " + (2.9 + (i * 0.6) % 1.4).toFixed(2) + "s; --sway-delay: -" + (i * 0.7).toFixed(2) + "s"
      }, [pic]);
      layer.appendChild(node);
      return { node: node, moved: false, left: 0, top: 0, part: 0, x: 0, y: 0 };
    });
    var ring = hinted() ? null : el("div.study__ring", { hidden: "" });
    if (ring) layer.appendChild(ring);                   // in the page from the start: its type can be measured

    function within(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function put(s, l, t) {
      s.left = l;
      s.top = t;
      s.node.style.transform = "translate3d(" + l.toFixed(1) + "px, " + t.toFixed(1) + "px, 0)";
    }
    // a box as laid out, in the layer: offsets, so the reveal's slide doesn't count
    function box(n) {
      var l = 0, t = 0;
      for (var e = n; e && e !== host; e = e.offsetParent) { l += e.offsetLeft; t += e.offsetTop; }
      return { l: l, t: t, r: l + n.offsetWidth, b: t + n.offsetHeight };
    }
    // the parts of the page, top to bottom: a sticker put down belongs to one of them
    function parts() { return [].slice.call(root.querySelectorAll(".study > *, .pager")).map(box); }

    // which cells of the layer are taken (CELL px each): marked boxes, then counted through sums
    function cells(W, H) {
      var cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL), on = new Uint8Array(cols * rows), sums = null;
      function count(l, t, r, b) {
        if (!sums) {
          sums = new Int32Array((cols + 1) * (rows + 1));
          for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
            sums[(y + 1) * (cols + 1) + x + 1] = on[y * cols + x] + sums[y * (cols + 1) + x + 1] + sums[(y + 1) * (cols + 1) + x] - sums[y * (cols + 1) + x];
          }
        }
        var c0 = Math.max(0, Math.floor(l / CELL)), c1 = Math.min(cols, Math.ceil(r / CELL));
        var r0 = Math.max(0, Math.floor(t / CELL)), r1 = Math.min(rows, Math.ceil(b / CELL));
        return sums[r1 * (cols + 1) + c1] - sums[r0 * (cols + 1) + c1] - sums[r1 * (cols + 1) + c0] + sums[r0 * (cols + 1) + c0];
      }
      return {
        mark: function (q, pad) {
          var c0 = Math.max(0, Math.floor((q.l - pad) / CELL)), c1 = Math.min(cols - 1, Math.floor((q.r + pad) / CELL));
          var r0 = Math.max(0, Math.floor((q.t - pad) / CELL)), r1 = Math.min(rows - 1, Math.floor((q.b + pad) / CELL));
          for (var r = r0; r <= r1; r++) for (var c = c0; c <= c1; c++) on[r * cols + c] = 1;
          sums = null;
        },
        any: function (l, t, r, b) { return count(l, t, r, b) > 0; },
        share: function (l, t, r, b) { return count(l, t, r, b) / Math.max(1, Math.ceil((r - l) / CELL) * Math.ceil((b - t) / CELL)); }
      };
    }

    // the ring around a sticker: the words on a circle, as many times as go round it
    var measure = document.createElement("canvas").getContext("2d");
    function ringSize(w, h) { return Math.ceil(Math.max(w, h) + 2 * (10 + ring.font * 1.9)); }
    function draw(s) {
      var w = s.node.offsetWidth, h = s.node.offsetHeight, size = ringSize(w, h), c = size / 2;
      var r = Math.max(w, h) / 2 + 10, round = 2 * Math.PI * r;
      measure.font = ring.font + "px " + getComputedStyle(ring).fontFamily;
      var say = SAY + "  ·  ", times = Math.max(1, Math.round(round / Math.max(1, measure.measureText(say).width)));
      ring.style.width = ring.style.height = size + "px";
      ring.style.left = (w / 2 - c).toFixed(1) + "px";
      ring.style.top = (h / 2 - c).toFixed(1) + "px";
      ring.innerHTML = '<svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '">' +
        '<path id="study-ring" fill="none" d="M ' + (c - r) + " " + c + " a " + r + " " + r + " 0 1 1 " + 2 * r + " 0 a " + r + " " + r + " 0 1 1 " + -2 * r + ' 0"/>' +
        '<text font-size="' + ring.font + '"><textPath href="#study-ring" textLength="' + round.toFixed(1) + '" lengthAdjust="spacing"></textPath></text></svg>';
      ring.querySelector("textPath").textContent = new Array(times + 1).join(say);
      if (ring.parentNode !== s.node) s.node.appendChild(ring);
    }

    // each one not moved goes to the place closest to its share of the page (one after the other, top to bottom):
    // on no word and no other sticker, its middle on no picture, at most a part of it on pictures (stuck on their
    // edge or corner, which it likes) or else beside something rather than out in the open, and not near the others.
    // With no room at its size it tries smaller, and with none at all it waits out of sight until the page has some.
    // The ring, while it is still to be read, goes round the highest one with room for it; when none has, the first
    // one is placed again with the room of its ring
    function place() {
      if (!settle(null) && ring && !layer.classList.contains("is-known")) settle(all.filter(function (s) { return !s.moved; })[0]);
    }
    function settle(ringed) {
      var W = layer.clientWidth, H = layer.clientHeight;
      if (!W || !H) return true;
      var p = parts(), hard = cells(W, H), pics = cells(W, H), near = cells(W, H), words = cells(W, H), rects = [];
      [].slice.call(root.querySelectorAll(WORDS)).map(box).forEach(function (q) { hard.mark(q, GAP); words.mark(q, 6); near.mark(q, GAP + NEAR); });
      [].slice.call(root.querySelectorAll(".study__fig")).map(box).forEach(function (q) { pics.mark(q, 0); near.mark(q, NEAR); });
      // not above the crumbs (the bar lies there when the page opens), not under the pager
      var crumbs = root.querySelector(".crumbs"), pager = root.querySelector(".pager");
      if (crumbs) hard.mark({ l: 0, t: 0, r: W, b: box(crumbs).b }, GAP);
      if (pager) hard.mark({ l: 0, t: box(pager).b, r: W, b: H }, 0);
      var from = p.length ? p[0].t : 0, to = p.length > 1 ? p[p.length - 1].t : H;
      var free = all.filter(function (s) { return !s.moved; }), band = (to - from) / Math.max(free.length, 1), kept = [];
      if (ring) ring.font = parseFloat(getComputedStyle(ring).fontSize) || 10;

      all.forEach(function (s) {                         // the moved ones stay where they were put
        if (!s.moved || (held && held.s === s)) return;
        var q = p[Math.min(s.part, p.length - 1)], w = s.node.offsetWidth, h = s.node.offsetHeight;
        put(s, within(s.x * W - w / 2, EDGE, W - w - EDGE), within(q.t + s.y * (q.b - q.t) - h / 2, EDGE, H - h - EDGE));
        hard.mark({ l: s.left, t: s.top, r: s.left + w, b: s.top + h }, 8);
        rects.push({ s: s, l: s.left, t: s.top, r: s.left + w, b: s.top + h });
        kept.push({ x: s.left + w / 2, y: s.top + h / 2 });
      });
      free.forEach(function (s, i) {
        if (held && held.s === s) return;
        var aim = from + band * (i + 0.5), spot = null;
        s.node.hidden = false;                           // measured at its size, even when it had no room before
        [1, 0.8, 0.64].some(function (k) {
          s.node.style.setProperty("--k", k);
          var w = s.node.offsetWidth, h = s.node.offsetHeight, reach = 3.4 * Math.max(w, h);
          var fw = s === ringed ? ringSize(w, h) : w, fh = s === ringed ? ringSize(w, h) : h;   // its room
          var most = s === ringed ? RING_COVER : COVER;
          for (var t = EDGE; t + fh <= H - EDGE; t += STEP) {
            for (var l = EDGE; l + fw <= W - EDGE; l += STEP) {
              if (hard.any(l, t, l + fw, t + fh)) continue;
              var cx = l + fw / 2, cy = t + fh / 2;
              if (pics.any(cx - 4, cy - 4, cx + 4, cy + 4)) continue;
              var on = pics.share(l, t, l + fw, t + fh);
              if (on > most) continue;
              var score = Math.abs(cy - aim) / band + (on > 0.08 ? -0.25 : near.any(l, t, l + fw, t + fh) ? 0 : 0.5);
              kept.forEach(function (o) { var d = Math.sqrt((o.x - cx) * (o.x - cx) + (o.y - cy) * (o.y - cy)); if (d < reach) score += 1.5 * (1 - d / reach); });
              if (!spot || score < spot.score) spot = { l: l, t: t, fw: fw, fh: fh, w: w, h: h, score: score };
            }
          }
          return !!spot;
        });
        s.node.hidden = !spot;
        if (!spot) return;
        put(s, spot.l + (spot.fw - spot.w) / 2, spot.t + (spot.fh - spot.h) / 2);
        hard.mark({ l: spot.l, t: spot.t, r: spot.l + spot.fw, b: spot.t + spot.fh }, 8);
        rects.push({ s: s, l: spot.l, t: spot.t, r: spot.l + spot.fw, b: spot.t + spot.fh });
        kept.push({ x: spot.l + spot.fw / 2, y: spot.t + spot.fh / 2 });
      });

      if (!ring || layer.classList.contains("is-known")) return true;
      if (!ringed) {                                     // the highest one with room round it: on no word, no other sticker
        ringed = rects.slice().sort(function (a, b) { return a.t - b.t; }).map(function (q) {
          var w = q.s.node.offsetWidth, h = q.s.node.offsetHeight, size = ringSize(w, h);
          var l = q.s.left + w / 2 - size / 2, t = q.s.top + h / 2 - size / 2, r = l + size, b = t + size;
          var clear = l >= 0 && t >= 0 && r <= W && b <= H && !words.any(l, t, r, b) && pics.share(l, t, r, b) <= RING_COVER &&
            !rects.some(function (o) { return o.s !== q.s && o.l < r && o.r > l && o.t < b && o.b > t; });
          return clear ? q.s : null;
        }).filter(Boolean)[0] || null;
      }
      ring.hidden = !ringed || ringed.node.hidden;
      if (ring.hidden) return false;
      draw(ringed);
      return true;
    }

    // put down: it now belongs to the part of the page under its centre
    function pin(s) {
      var p = parts(), cx = s.left + s.node.offsetWidth / 2, cy = s.top + s.node.offsetHeight / 2, best = 0, d0 = Infinity;
      p.forEach(function (q, k) { var d = Math.max(q.t - cy, cy - q.b, 0); if (d < d0) { d0 = d; best = k; } });
      s.part = best;
      s.x = cx / layer.clientWidth;
      s.y = (cy - p[best].t) / Math.max(p[best].b - p[best].t, 1);
    }

    var held = null, stack = 0, rolling = 0, dragged = false;
    function follow() {
      put(held.s, within(held.x + window.scrollX - held.ox, EDGE, held.maxL), within(held.y + window.scrollY - held.oy, EDGE, held.maxT));
    }
    // held close to the top or the bottom of the window (after a first move), the page scrolls along, gently
    function roll() {
      rolling = 0;
      if (!held || !held.far) return;
      var zone = Math.min(80, window.innerHeight / 8), vh = window.innerHeight, speed = 0;
      if (held.y < zone) speed = (held.y - zone) / zone;
      else if (held.y > vh - zone) speed = (held.y - vh + zone) / zone;
      if (!speed) return;
      var before = window.scrollY;
      window.scrollBy(0, Math.round(within(speed, -1, 1) * 14));
      if (window.scrollY === before) return;
      follow();
      rolling = requestAnimationFrame(roll);
    }
    function known() {
      layer.classList.add("is-known");
      hinted(true);
    }
    layer.addEventListener("pointerdown", function (e) {
      var node = e.target.closest && e.target.closest(".study__sticker");
      if (!node || held || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();                                 // no text selected, no picture dragged away
      var s = all.filter(function (q) { return q.node === node; })[0];
      held = {
        s: s, id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, far: false,
        ox: e.clientX + window.scrollX - s.left, oy: e.clientY + window.scrollY - s.top,   // keeps the grip: no jump
        maxL: layer.clientWidth - node.offsetWidth - EDGE, maxT: layer.clientHeight - node.offsetHeight - EDGE
      };
      try { node.setPointerCapture(e.pointerId); } catch (err) {}
      node.style.zIndex = 1000;                           // the one in hand above the others,
      layer.classList.add("is-lifted");                   // and the layer above the bar while it is held
      node.classList.add("is-held");
      document.documentElement.classList.add("is-grabbing");
      known();
    });
    layer.addEventListener("pointermove", function (e) {
      if (!held || e.pointerId !== held.id) return;
      held.x = e.clientX;
      held.y = e.clientY;
      if (Math.abs(held.x - held.sx) + Math.abs(held.y - held.sy) > 10) held.far = true;
      follow();
      if (!rolling) roll();
    });
    function letGo(e) {
      if (!held || e.pointerId !== held.id) return;
      var s = held.s;
      held = null;
      cancelAnimationFrame(rolling);
      rolling = 0;
      s.node.classList.remove("is-held");
      s.node.style.zIndex = ++stack;                      // put down on top of the others
      layer.classList.remove("is-lifted");
      document.documentElement.classList.remove("is-grabbing");
      s.moved = true;
      pin(s);
      if (e.type === "pointerup") { dragged = true; setTimeout(function () { dragged = false; }, 0); }
    }
    layer.addEventListener("pointerup", letGo);
    layer.addEventListener("pointercancel", letGo);
    layer.addEventListener("lostpointercapture", letGo);
    window.addEventListener("scroll", function () { if (held) follow(); }, { passive: true });
    // the click that follows a sticker let go goes nowhere: no link under it opens
    window.addEventListener("click", function (e) { if (dragged) { dragged = false; e.preventDefault(); e.stopPropagation(); } }, true);

    // the ring counts as read once it has been on screen for a moment: it won't come back on the next pages
    if (ring && "IntersectionObserver" in window) {
      var timer = 0, io = new IntersectionObserver(function (list) {
        list.forEach(function (e) {
          clearTimeout(timer);
          if (e.isIntersecting) timer = setTimeout(function () { hinted(true); io.disconnect(); }, 1500);
        });
      }, { threshold: 0.9 });
      io.observe(ring);
    }
    return { place: place };
  }

  function page(root) {
    var slug = new URLSearchParams(location.search).get("p");
    var x = null, list = [];
    Object.keys(GROUPS).forEach(function (key) {
      if (x) return;
      var all = group(key), found = all.filter(function (y) { return y.slug === slug; })[0];
      if (found) { x = found; list = all; }
    });
    if (!x) {
      document.title = "Project not found · Martina Cola";
      root.replaceChildren(
        el("nav.crumbs", { "aria-label": "Breadcrumb" }, [el("a", { href: "index.html#work", text: "Projects" })]),
        el("h1.study__title", { text: "Not found" }),
        el("p.study__text", {}, ["This project isn't here. ", el("a", { href: "index.html#work", text: "Back to all projects →" })])
      );
      return;
    }
    var g = GROUPS[x.key];
    document.title = x.title + " — " + x.brand + " · Martina Cola";

    // an event is on the burgundy stage, like Events on the home page; a project on cream paper
    if (x.key === "events") {
      var main = root.closest("main"), bar = document.querySelector(".nav"), tint = document.querySelector('meta[name="theme-color"]');
      if (main) { main.classList.add("is-stage"); main.setAttribute("data-navtheme", "light"); }
      if (bar) bar.setAttribute("data-theme", "light");
      if (tint) tint.setAttribute("content", "#451d20");
    }

    // the crumbs: its group (Projects or Events) / the project
    var crumbs = el("nav.crumbs", { "aria-label": "Breadcrumb", "data-reveal": "" }, [
      el("a", { href: "index.html#" + x.key, text: g.name }), el("span", { "aria-hidden": "true", text: "/" }),
      el("span", { "aria-current": "page", text: x.title })
    ]);
    var st = study(x);
    var n = list.length, at = list.indexOf(x);
    var prev = list[(at - 1 + n) % n], next = list[(at + 1) % n];
    var pager = n > 1 ? el("nav.pager", { "aria-label": "More " + g.noun }, [
      el("a.pager__prev", { href: href(prev) }, [el("span.pager__label", { text: "← Previous" }), el("span.pager__title", { text: prev.title })]),
      el("a.pager__all", { href: "index.html#" + x.key, text: "All " + g.noun }),
      el("a.pager__next", { href: href(next) }, [el("span.pager__label", { text: "Next →" }), el("span.pager__title", { text: next.title })])
    ]) : null;
    root.replaceChildren.apply(root, [crumbs, st, pager].filter(Boolean));

    // the rows follow the width of the page
    var width = 0;
    function layout(force) {
      var cs = getComputedStyle(root);
      var W = root.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (!W || (W === width && !force)) return;
      width = W;
      st._boxes.forEach(function (box) { lay(box, W); });
      st._pairs.forEach(function (pair) { layPair(pair, W); });
    }
    layout();
    // the videos, watched once they are in their rows (a folder's files join the page when it is laid out)
    st.querySelectorAll("video").forEach(watch);
    // the stickers, around what is laid out: again each time the page changes, and once the type has loaded
    var loose = st._stickers.length ? stickers(root, st._stickers) : null;
    function spread() { if (loose) loose.place(); }
    spread();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(spread);
    var queued = 0;
    function later() { if (!queued) queued = requestAnimationFrame(function () { queued = 0; layout(); spread(); }); }
    if ("ResizeObserver" in window) new ResizeObserver(later).observe(root);
    else window.addEventListener("resize", later);
    // a phone turned sideways can cross the phone width without the page changing: the banners swap
    if (phone.addEventListener) phone.addEventListener("change", function () { layout(true); spread(); });
  }

  var root = document.getElementById("project-root");
  if (root) page(root);
  else { cards("projects"); cards("events"); }
})();
