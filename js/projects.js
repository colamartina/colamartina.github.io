/* =========================================================
   PROJECTS — Campaign and Events.
   Home page: a card for every project (the covers of work/), the first three
   on show and the others behind "See more" ("See less" closes them again).
   A card opens the project's own page, project.html?p=<slug>,
   told like a project page of work/: the pictures for the vibe, the title and
   the short text, then the folders (paid media, social media, UGC, e-commerce,
   behind the scenes); the previous and the next project at the bottom.
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
  var STICKERS = { graphics: true, stickers: true, badges: true };   // on work/ these become the badges
  var GROUPS = {
    campaigns: { name: "Campaign", noun: "campaigns" },
    events: { name: "Events", noun: "events" }
  };
  var SHOWN = 3;                                           // home page: the cards on show, the others behind "See more"

  /* ---------- a project of work/, its files found as work/work.js finds them ---------- */
  var data = {};
  ["campaigns", "collabs", "events"].forEach(function (k) {
    (P[k] || []).forEach(function (p) { data[p.slug] = { p: p, kind: k }; });
  });
  var entries = {};
  window.SELECTED.forEach(function (e) { entries[e.slug] = e; });

  function resolve(slug) {
    var e = entries[slug], d = data[slug];
    if (!e || !d) return null;
    var p = d.p, sections = p.sections || [];
    var files = sections.length
      ? sections.reduce(function (all, s) { return all.concat(s.items); }, [])
      : (p.video ? [p.video] : []);
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

    // the rest of its folders: what the photos and videos above don't show, moved, added and ordered as on work/
    var shown = {};
    images.concat(videos).forEach(function (m) { shown[m.it.name] = true; });
    (e.hide || []).forEach(function (name) { shown[name] = true; });
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
      if (STICKERS[s.id]) return;
      var extra = ((e.add || {})[s.id] || []).map(function (x) { return Object.assign({ type: "image" }, x); });
      var wanted = (e.order || {})[s.id] || [];
      rest[s.id] = {
        label: (e.labels || {})[s.id] || s.label,
        note: s.note,
        items: s.items.concat(extra)
          .map(function (it, k) { var w = wanted.indexOf(it.name); return { it: it, key: w < 0 ? wanted.length + k : w }; })
          .sort(function (a, b) { return a.key - b.key; })
          .map(function (x) { return { it: x.it, focus: null }; })
          .filter(function (m) { return !shown[m.it.name]; })
      };
    });
    // the photos and videos above can be picked as folders too
    rest.photos = { items: images };
    rest.videos = { items: videos };

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
      images: images, videos: videos, rest: rest, formats: formats
    };
  }

  // the projects of a group: the ones in data/selection.js, in its order, then every other one of work/, in the
  // order of work/; each with what data/selection.js says about it
  function group(key) {
    var listed = SEL[key] || [], has = {};
    listed.forEach(function (s) { has[s.slug] = true; });
    var others = window.SELECTED
      .filter(function (e) { return !has[e.slug] && data[e.slug] && data[e.slug].kind === key; })
      .map(function (e) { return { slug: e.slug }; });
    return listed.concat(others).map(function (s) {
      var r = resolve(s.slug);
      if (!r) return null;
      var p = r.p;
      var title = s.title || p.title;
      return {
        key: key, s: s, r: r, slug: s.slug, title: title,
        kicker: s.kicker !== undefined ? s.kicker : p.kicker,
        brand: s.brand || p.brand,
        by: s.by || s.brand || p.brand,
        year: p.year || null,
        place: s.place || p.place || null,
        type: p.type && p.type.toLowerCase() !== title.toLowerCase() ? p.type : null
      };
    }).filter(Boolean);
  }
  function href(x) { return "project.html?p=" + encodeURIComponent(x.slug); }

  // files by name, in the order asked; without names, all of them
  function take(list, names) {
    if (!names) return list.slice();
    return names.map(function (n) { return list.filter(function (m) { return m.it.name === n; })[0]; }).filter(Boolean);
  }

  // a project without folders in data/selection.js: every folder of work/, in the order of a project page
  // (paid media, social media, UGC, e-commerce; the others after them, behind the scenes last)
  var ORDER = ["key-visuals", "paid-ads", "social", "influencer", "ugc", "ecom", "website"];
  var NAMES = { "key-visuals": "More visuals", "paid-ads": "Paid media", social: "Social media", ugc: "UGC", ecom: "E-commerce", bts: "Behind the scenes" };
  function allFolders(r) {
    return Object.keys(r.rest)
      .filter(function (id) { return id !== "photos" && id !== "videos"; })
      .map(function (id, k) { var at = ORDER.indexOf(id); return { id: id, key: id === "bts" ? 1000 : at < 0 ? ORDER.length + k : at }; })
      .sort(function (a, b) { return a.key - b.key; })
      .map(function (f) { return { id: f.id, label: NAMES[f.id] || r.rest[f.id].label || f.id }; });
  }

  /* ---------- home: the cards ---------- */
  // a cover cut as on work/: its focus, and a closer frame around it when it has a zoom
  function cover(x, sizes, alt) {
    var c = x.r.cover, img = M.img(c.it, sizes, { alt: alt });
    if (c.focus) img.style.objectPosition = c.focus;
    if (c.zoom) { img.style.setProperty("--zoom", c.zoom); img.style.transformOrigin = c.focus || "50% 50%"; }
    return img;
  }

  function cards(key) {
    var section = document.getElementById(key);
    var host = section && section.querySelector(".sec__body");
    var list = group(key);
    if (!host || !list.length) return;
    var event = key === "events";

    // the first cards are on show; the others wait under them, hidden, and "See more" brings them in (fold)
    var items = list.map(function (x, i) {
      var aside = event ? x.place : x.year;               // beside the name: the year, or where the event was
      var under = event ? x.by : x.type;                  // on the right under it: the type, or the brand
      var later = i >= SHOWN;
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
    var extra = items.slice(SHOWN);
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
      var three = height();
      show(true);
      var to = open ? height() : three;
      // closing: the height the page loses above the screen comes off the scroll, so what is on screen stays
      var room = open ? 0 : Math.max(0, -section.getBoundingClientRect().top);
      function place(h) { if (room) window.scrollTo(0, y - Math.min(from - h, room)); }

      if (open) arrive(); else leave();
      // opened from the keyboard: on to the first new card (the cards come before the button)
      if (open && keyboard) extra[0].querySelector("a").focus({ preventScroll: true });

      if (!animate) {
        show(open);
        root.style.scrollBehavior = "auto";
        place(three);
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
        if (!mine) place(three);
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

    // the vibe: the photos and videos of work/ (or the pictures picked), before the text; an event: its photo and its video
    var pool = r.images.concat(r.videos);
    var vibe = mediaBox(event || !x.s.vibe ? pool : take(pool, x.s.vibe), x.title, r.formats);
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

    // folders, in the order of data/selection.js (without folders there: all of work/); one without files isn't shown
    var folders = (x.s.folders || allFolders(r)).map(function (f) {
      var src = r.rest[f.id];
      var list = src ? take(src.items, f.pick) : [];
      if (!list.length) return null;
      var label = f.label || f.id;
      var box = mediaBox(list, x.title + ", " + label.toLowerCase(), r.formats);
      var node = el("section.study__folder", { "aria-label": label, "data-reveal": "" }, [
        el("h2.study__label", {}, [
          el("span", { text: label }),
          (f.note || src.note) ? el("span.study__note", { text: f.note || src.note }) : null
        ]),
        box
      ]);
      return { f: f, node: node, box: box, label: label };
    }).filter(Boolean);

    var about = el("div.study__about", { "data-reveal": "" }, [
      el("div.study__intro", {}, [
        x.kicker ? el("p.study__kicker", { text: x.kicker }) : null,
        el("h1.study__title", { text: x.title }),
        r.text ? el("p.study__text", { text: r.text }) : null
      ]),
      info(event ? [["Brand", x.brand], ["Place", x.place]] : [
        ["Brand", x.brand],
        ["Year", x.year],
        ["Type", x.type],
        ["Role", x.s.role || r.p.role],
        ["Includes", folders.length > 1 ? folders.map(function (f) { return f.label; }).join(" · ") : null]
      ]),
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

    var body = event ? [el("div.study__spread", {}, [vibe, about])] : [vibe, about];
    var node = el("div.study" + (event ? ".study--event" : ""), { "data-accent": r.p.accent || null },
      body.concat(flow.map(function (i) { return i.node; })));
    node._boxes = boxes;
    node._pairs = pairs;
    return node;
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

    // an event is on the burgundy stage, like Events on the home page; a campaign on cream paper
    if (x.key === "events") {
      var main = root.closest("main"), bar = document.querySelector(".nav"), tint = document.querySelector('meta[name="theme-color"]');
      if (main) { main.classList.add("is-stage"); main.setAttribute("data-navtheme", "light"); }
      if (bar) bar.setAttribute("data-theme", "light");
      if (tint) tint.setAttribute("content", "#451d20");
    }

    var crumbs = el("nav.crumbs", { "aria-label": "Breadcrumb", "data-reveal": "" }, [
      el("a", { href: "index.html#work", text: "Projects" }), el("span", { "aria-hidden": "true", text: "/" }),
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
    var queued = 0;
    function later() { if (!queued) queued = requestAnimationFrame(function () { queued = 0; layout(); }); }
    if ("ResizeObserver" in window) new ResizeObserver(later).observe(root);
    else window.addEventListener("resize", later);
    // a phone turned sideways can cross the phone width without the page changing: the banners swap
    if (phone.addEventListener) phone.addEventListener("change", function () { layout(true); });
  }

  var root = document.getElementById("project-root");
  if (root) page(root);
  else { cards("campaigns"); cards("events"); }
})();
