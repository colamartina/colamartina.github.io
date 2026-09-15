/* =========================================================
   SELECTED WORK — work/index.html
   Without ?p: every project, one image each with its title under it.
   With ?p=<slug>: that project — its photos and videos, the title and the
   short text, then everything else from its folders (banners, ads, social,
   behind the scenes), then the previous and next project. The files of its
   sticker folders lie loose on the page as big badges, to pick up and move.
   A round × (or the header, or Esc) closes a project and goes back to the grid,
   scrolled where it was left.
   What is shown is set in work/projects.js; the files are described in
   data/campaigns.js, collabs.js and events.js.
   ========================================================= */
(function () {
  "use strict";

  var main = document.getElementById("main");
  var P = window.PORTFOLIO || {};
  if (!main) return;
  var ROOT = "../";                                   // paths in data/ start at the site root
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STICKERS = { graphics: true, stickers: true, badges: true };   // data sections whose files become the badges
  var LABELS = { "key-visuals": "More visuals" };                    // what's left of a section already shown above
  var FOLDERS = { ecom: "E-commerce", social: "Social", "paid-ads": "Paid ads", ugc: "UGC", bts: "Behind the scenes" };   // names for a folder a file is moved to (move)

  // tiny DOM builder: el("p.class", { href: "#" }, [children | "text"])
  function el(tag, attrs, children) {
    var parts = tag.split(".");
    var node = document.createElement(parts[0]);
    if (parts.length > 1) node.className = parts.slice(1).join(" ");
    Object.keys(attrs || {}).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  // the grid's scroll position, kept for the way back from a project;
  // sessionStorage can be missing or refuse to write (private windows): then nothing is kept
  function keep(key, value) {
    try {
      if (value === undefined) return sessionStorage.getItem("work:" + key);
      if (value === null) sessionStorage.removeItem("work:" + key);
      else sessionStorage.setItem("work:" + key, value);
    } catch (e) { return null; }
  }

  /* ---------- the list, matched to the files in data/ ---------- */
  var bySlug = {};
  ["campaigns", "collabs", "events"].forEach(function (k) {
    (P[k] || []).forEach(function (p) { bySlug[p.slug] = p; });
  });

  // focus: which part of a photo stays in the cut; upright: true cuts a landscape photo to 4:5 too;
  // whole: true keeps it uncut among the photos under the text (mosaic)
  function asMedia(it, pick) {
    return { it: it, focus: (pick && pick.focus) || null, upright: (pick && pick.upright === true) || it.ratio < 1.1, whole: !!(pick && pick.whole) };
  }

  var projects = (window.SELECTED || []).map(function (e) {
    var p = bySlug[e.slug];
    if (!p) return null;
    var sections = p.sections || [];
    var files = sections.length
      ? sections.reduce(function (all, s) { return all.concat(s.items); }, [])
      : (p.video ? [p.video] : []);
    // a pick is a file name, { name, focus, upright }, or a photo of its own: { src, widths, ratio, name }
    function find(pick) {
      if (!pick) return null;
      if (pick.src) return asMedia(Object.assign({ type: "image" }, pick), pick);
      var name = typeof pick === "string" ? pick : pick.name;
      var it = files.filter(function (f) { return f && f.name === name; })[0];
      return it ? asMedia(it, pick) : null;
    }
    var cover = find(e.cover);
    if (!cover) return null;
    var images = (e.images || []).map(find).filter(function (m) { return m && m.it.type === "image"; });
    var videos = (e.videos || []).map(find).filter(function (m) { return m && m.it.type === "video"; });

    // the rest of the project's folders, in their order, behind the scenes last;
    // the files of the sticker folders are not shown there: they become the badges
    var shown = {};
    images.concat(videos).forEach(function (m) { shown[m.it.name] = true; });
    (e.hide || []).forEach(function (name) { shown[name] = true; });
    // files moved to another folder in projects.js (move); a folder the project does not have is added after the others
    var moved = e.move || {};
    var folders = sections.map(function (s) {
      return { id: s.id, label: s.label, items: s.items.filter(function (it) { return !moved[it.name]; }) };
    });
    Object.keys(moved).forEach(function (name) {
      var it = files.filter(function (f) { return f && f.name === name; })[0];
      if (!it) return;
      var to = folders.filter(function (s) { return s.id === moved[name]; })[0];
      if (!to) folders.push(to = { id: moved[name], label: FOLDERS[moved[name]] || moved[name], items: [] });
      to.items.push(it);
    });
    var rest = folders
      .map(function (s) {
        // the files added in projects.js (add), in the order given there (order); the others follow in their own
        var extra = ((e.add || {})[s.id] || []).map(function (x) { return Object.assign({ type: "image" }, x); });
        var wanted = (e.order || {})[s.id] || [];
        var items = s.items.concat(extra)
          .map(function (it, k) { var w = wanted.indexOf(it.name); return { it: it, key: w < 0 ? wanted.length + k : w }; })
          .sort(function (a, b) { return a.key - b.key; })
          .map(function (x) { return x.it; });
        return { id: s.id, label: (e.labels || {})[s.id] || LABELS[s.id] || s.label, items: items.filter(function (it) { return !shown[it.name]; }) };
      })
      .filter(function (s) { return s.items.length; });
    var more = rest
      .filter(function (s) { return !STICKERS[s.id]; })
      .sort(function (a, b) { return (a.id === "bts") - (b.id === "bts"); });
    // a banner made twice, for computers and for phones, shows only on its own kind of screen: files named
    // …desktop… and …mobile… pair up by themselves, others are paired in projects.js (mobile)
    var formats = {}, present = {};
    images.concat(videos).forEach(function (m) { present[m.it.name] = true; });
    rest.forEach(function (s) { s.items.forEach(function (it) { present[it.name] = true; }); });
    function twins(wide, narrow) {
      if (wide !== narrow && present[wide] && present[narrow]) { formats[wide] = "wide"; formats[narrow] = "narrow"; }
    }
    Object.keys(present).forEach(function (name) { if (/desktop/i.test(name)) twins(name, name.replace(/desktop/gi, "mobile")); });
    Object.keys(e.mobile || {}).forEach(function (name) { twins(name, e.mobile[name]); });
    var spots = {};
    (e.badges || []).forEach(function (b) { spots[b.name] = b; });
    var badges = rest
      .filter(function (s) { return STICKERS[s.id]; })
      .reduce(function (all, s) { return all.concat(s.items); }, [])
      .filter(function (it) { return it.type === "image"; })
      .map(function (it) { return { it: it, spot: spots[it.name] || null }; });

    return {
      slug: e.slug,
      title: e.title,
      text: e.text,
      cover: { it: cover.it, focus: e.focus || cover.focus, zoom: e.zoom || null },
      images: images,
      videos: videos,
      more: more,
      badges: badges,
      formats: formats,
      first: e.first || null
    };
  }).filter(Boolean);
  if (!projects.length) return;

  /* ---------- media ---------- */
  function img(m, sizes, eager) {
    var it = m.it, node = document.createElement("img");
    node.alt = "";
    node.decoding = "async";
    node.setAttribute("data-file", it.name || "");
    node.loading = eager ? "eager" : "lazy";          // before src, or the file starts loading at once
    if (it.type === "video") {
      node.src = ROOT + it.poster;
    } else {
      node.sizes = sizes;
      node.srcset = it.widths.map(function (w) { return ROOT + it.src + "-" + w + ".webp " + w + "w"; }).join(", ");
      node.src = ROOT + it.src + "-" + it.widths[0] + ".webp";
    }
    if (m.focus) node.style.objectPosition = m.focus;
    if (m.zoom) {                                     // a closer cut: zoom in around the focus (the frame hides the rest)
      node.style.transform = "scale(" + m.zoom + ")";
      node.style.transformOrigin = m.focus || "50% 50%";
    }
    return node;
  }

  // photos cut to 4:5, three a row (four when there are exactly four); landscape photos in a 5:4 row of their own
  function gallery(list, alt, eager) {
    var groups = [
      { cls: "", items: list.filter(function (m) { return m.upright; }) },
      { cls: ".gallery--wide", items: list.filter(function (m) { return !m.upright; }) }
    ];
    return groups.filter(function (g) { return g.items.length; }).map(function (g) {
      var four = g.items.length === 4;
      return el("div.gallery" + g.cls + (four ? ".gallery--four" : ""), {}, g.items.map(function (m, i) {
        var node = img(m, four ? "(max-width: 700px) 50vw, 25vw" : "(max-width: 700px) 50vw, 33vw", eager && i < 3);
        node.alt = alt;
        return el("figure", {}, [node]);
      }));
    });
  }

  // the photos under the text of a project that opens with its videos (first: "videos"): side by side in the
  // order given, upright ones cut to 4:5, landscape ones to 5:4, a whole one in its own shape; each row one
  // height and as wide as the page, how many to a row set by the width of the screen (.mosaic in index.html)
  function mosaic(list, alt) {
    return el("div.mosaic", {}, list.map(function (m) {
      var r = m.whole ? m.it.ratio : m.upright ? 0.8 : 1.25;
      var node = img(m, "(max-width: 700px) " + (r > 1 ? "100vw" : "50vw") + ", " + Math.round(r * 41) + "vw", false);
      node.alt = alt;
      return el("figure", { style: "--r: " + r }, [node]);
    }));
  }

  // muted and in loop, played while on screen; a pill turns the sound on when the file has it
  function video(m) {
    var it = m.it;
    var v = el("video", { playsinline: "", loop: "", preload: "none", "data-src": ROOT + it.src, "data-poster": ROOT + it.poster });
    v.muted = true;                                   // the property, not just the attribute: needed for autoplay
    if (reduceMotion) v.controls = true;              // nothing moves by itself: the visitor presses play
    var fig = el("figure", { style: "aspect-ratio: " + it.ratio }, [v]);
    if (it.audio && !reduceMotion) {
      var btn = el("button.reel__sound", { type: "button", "aria-label": "Sound", "aria-pressed": "false", text: "Sound off" });
      btn.addEventListener("click", function () {
        var on = v.muted;
        main.querySelectorAll("video").forEach(function (o) { o.muted = true; });   // one sound at a time
        main.querySelectorAll(".reel__sound").forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
          b.textContent = "Sound off";
        });
        v.muted = !on;
        if (on && v.paused) v.play().catch(function () {});
        btn.setAttribute("aria-pressed", String(on));
        btn.textContent = on ? "Sound on" : "Sound off";
      });
      fig.appendChild(btn);
    }
    return fig;
  }

  // a file shown whole, in its own shape
  function natural(m, sizes, alt) {
    var node = img(m, sizes, false);
    node.alt = alt;
    return el("figure", { style: "aspect-ratio: " + m.it.ratio }, [node]);
  }

  function playWhenSeen() {
    var vids = [].slice.call(main.querySelectorAll("video"));
    if (!vids.length) return;
    function load(v) {
      if (v.getAttribute("src")) return;
      v.poster = v.getAttribute("data-poster");
      v.src = v.getAttribute("data-src");
    }
    if (!("IntersectionObserver" in window)) { vids.forEach(load); return; }
    // a screen ahead: the poster is there before the video scrolls in
    var near = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { load(e.target); near.unobserve(e.target); } });
    }, { rootMargin: "100% 0px" });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          load(v);
          // a browser can refuse to start it (iPhone in Low Power Mode): the visitor then gets the controls
          if (!reduceMotion) v.play().catch(function (err) { if (err && err.name === "NotAllowedError") v.controls = true; });
        } else if (!v.paused) v.pause();
      });
    }, { threshold: 0.5 });
    vids.forEach(function (v) { near.observe(v); seen.observe(v); });
  }

  /* ---------- all projects ---------- */
  function grid() {
    var sizes = "(max-width: 480px) 88vw, (max-width: 700px) 46vw, (max-width: 1000px) 31vw, 23vw";
    main.replaceChildren(el("ul.grid", {}, projects.map(function (p, i) {
      return el("li.tile", {}, [
        el("a", { href: "?p=" + encodeURIComponent(p.slug) }, [
          el("div.tile__img", {}, [img(p.cover, sizes, i < 8)]),
          el("h2.tile__title", { text: p.title })
        ])
      ]);
    })));

    // back from a project: open the grid where it was left (the tiles keep their shape while loading)
    if (keep("back") === "1") {
      keep("back", null);
      var y = +keep("gridY") || 0;
      if (y) window.scrollTo(0, y);
    }
    main.addEventListener("click", function (e) {
      if (e.target.closest(".tile a")) keep("gridY", String(Math.round(window.scrollY)));
    });
  }

  /* ---------- one project ---------- */
  // the photos and videos at the top; a small project (an event) gets its photo beside its video
  function visuals(p) {
    if (p.videos.length && p.images.length <= 2 && p.images.length + p.videos.length <= 3) {
      return [el("div.duo", {}, p.images.map(function (m) {
        var node = img(m, "(max-width: 700px) 60vw, 40vw", true);
        node.alt = p.title;
        return el("figure", { style: "aspect-ratio: " + (m.upright ? "4 / 5" : "5 / 4") }, [node]);
      }).concat(p.videos.map(video)))];
    }
    // a banner among them (twice as wide as tall, or more, or one made for one kind of screen) is not cut:
    // whole, across the page, after the photos
    var banners = p.images.filter(function (m) { return (!m.upright && m.it.ratio >= 2) || p.formats[m.it.name]; });
    var nodes = gallery(p.images.filter(function (m) { return banners.indexOf(m) < 0; }), p.title, true);
    if (banners.length) nodes.push(el("div.run.run--wide", {}, banners.map(function (m) { return natural(m, "(max-width: 1400px) 100vw, 1400px", p.title); })));
    if (p.videos.length) nodes.push(el("div.reels", {}, p.videos.map(video)));
    return nodes;
  }

  // a banner made for one kind of screen (formats) hides on the other; so does its run, and its folder when
  // nothing else is in it
  function formatsIn(node, formats) {
    function kind(n) { return n.classList.contains("for-wide") ? "wide" : n.classList.contains("for-narrow") ? "narrow" : ""; }
    function only(list) { var k = list.length ? kind(list[0]) : ""; return k && list.every(function (n) { return kind(n) === k; }) ? k : ""; }
    [].forEach.call(node.querySelectorAll("img[data-file]"), function (im) {
      var f = formats[im.getAttribute("data-file")];
      if (f && im.parentNode.tagName === "FIGURE") im.parentNode.classList.add("for-" + f);
    });
    [].forEach.call(node.querySelectorAll(".gallery, .run, .reels, .duo"), function (run) {
      var k = only([].slice.call(run.children));
      if (k) run.classList.add("for-" + k);
    });
    if (node.classList.contains("block")) {
      var k = only([].slice.call(node.children, 1));
      if (k) node.classList.add("for-" + k);
    }
  }

  // how a file from the rest of the folders is shown: whole, except the photos behind the scenes
  function shape(section, it) {
    if (it.type === "video") return "reels";
    if (section.id === "bts") return "photos";
    if (it.ratio >= 2) return "wide";                  // banners, moodboards, profile grids
    if (it.ratio >= 1.2) return "pair";                // slides, postcards, landscape visuals
    return "row";                                      // ads, screens, posts: side by side at one height
  }

  function block(p, s) {
    var runs = [];                                     // neighbouring files of the same shape
    s.items.forEach(function (it) {
      var sh = shape(s, it), last = runs[runs.length - 1];
      if (last && last.shape === sh) last.items.push(asMedia(it, null));
      else runs.push({ shape: sh, items: [asMedia(it, null)] });
    });
    var alt = p.title + ", " + s.label.toLowerCase();
    var nodes = [];
    runs.forEach(function (r) {
      var single = r.items.length === 1;
      if (r.shape === "reels") {
        nodes.push(el("div.run.reels", {}, r.items.map(video)));
      } else if (r.shape === "photos") {
        gallery(r.items, alt, false).forEach(function (g) { g.classList.add("run"); nodes.push(g); });
      } else if (r.shape === "wide") {
        nodes.push(el("div.run.run--wide", {}, r.items.map(function (m) { return natural(m, "(max-width: 1400px) 100vw, 1400px", alt); })));
      } else if (r.shape === "pair") {
        nodes.push(el("div.run.run--pair" + (single ? ".is-single" : ""), {}, r.items.map(function (m) {
          return natural(m, single ? "(max-width: 900px) 100vw, 900px" : "(max-width: 700px) 100vw, 50vw", alt);
        })));
      } else {
        nodes.push(el("div.run.run--row", {}, r.items.map(function (m) { return natural(m, "(max-width: 700px) 70vw, 36vw", alt); })));
      }
    });
    var section = el("section.block", { "aria-label": s.label, "data-section": s.id }, [el("h2.block__label", { text: s.label })].concat(nodes));
    formatsIn(section, p.formats);
    return section;
  }

  // small folders one after the other (paid ads and social, say) share a line on a wide screen instead of a
  // line each: their files at one height, the one that fits them all, never taller than a row (.side in
  // index.html). Only folders shown whole at one height count, and together their files are at most 4.2 times
  // as wide as they are tall (about five posts)
  function beside(blocks) {
    var line = [], sum = 0;
    function close() {
      if (line.length > 1) {
        var inner = line.reduce(function (n, b) { return n + b.files - 1; }, 0);
        var side = el("div.side", { style: "--sum: " + sum.toFixed(3) + "; --gaps: " + (40 * (line.length - 1) + 8 * inner + 2) + "px" });
        line[0].node.parentNode.insertBefore(side, line[0].node);
        line.forEach(function (b) { side.appendChild(b.node); });
      }
      line = [];
      sum = 0;
    }
    blocks.forEach(function (node) {
      var runs = [].slice.call(node.querySelectorAll(".run"));
      var whole = runs.length && runs.every(function (r) {
        return r.classList.contains("run--row") || r.classList.contains("reels") || r.classList.contains("is-single");
      });
      var figs = [].filter.call(node.querySelectorAll("figure"), function (f) { return !f.closest(".for-narrow"); });
      var width = whole ? figs.reduce(function (n, f) { return n + (parseFloat(f.style.aspectRatio) || 1); }, 0) : 0;
      if (!width) { close(); return; }
      if (sum + width > 4.2) close();
      line.push({ node: node, files: figs.length });
      sum += width;
    });
    close();
  }

  // "Le Mini Macaron | Rebranding" → the project in capitals, the brand in italics under it, like a job on the CV
  function titleParts(title) {
    var cut = title.indexOf(" | ");
    return cut < 0 ? { name: title, brand: null } : { name: title.slice(cut + 3), brand: title.slice(0, cut) };
  }

  function project(i) {
    var p = projects[i], n = projects.length;
    var prev = projects[(i - 1 + n) % n], next = projects[(i + 1) % n];
    document.title = p.title + " · Martina Cola";

    var t = titleParts(p.title);
    var about = el("header.about", {}, [
      el("h1.about__title", { text: t.name }),
      t.brand ? el("p.about__brand", { text: t.brand }) : null,
      p.text ? el("p.about__text", { text: p.text }) : null
    ]);

    function href(q) { return "?p=" + encodeURIComponent(q.slug); }
    var pager = el("nav.pager", { "aria-label": "More projects" }, [
      el("a.pager__prev", { href: href(prev) }, [
        el("span.pager__arrow", { "aria-hidden": "true", text: "←" }),
        el("span", {}, [el("small", { text: "Previous" }), el("span.pager__t", { text: prev.title })])
      ]),
      el("a.pager__next", { href: href(next) }, [
        el("span", {}, [el("small", { text: "Next" }), el("span.pager__t", { text: next.title })]),
        el("span.pager__arrow", { "aria-hidden": "true", text: "→" })
      ])
    ]);

    // first: "videos": the videos open the page, all in one row, and the photos follow the text
    var videosFirst = p.first === "videos" && p.videos.length > 0;
    var pictures = el("div.visuals", {}, videosFirst
      ? [el("div.reels.reels--first", {}, p.videos.map(function (m) { var fig = video(m); fig.style.setProperty("--r", m.it.ratio); return fig; }))]
      : visuals(p));
    formatsIn(pictures, p.formats);
    var photos = videosFirst && p.images.length ? mosaic(p.images, p.title) : null;
    if (photos) formatsIn(photos, p.formats);
    var blocks = p.more.map(function (s) { return block(p, s); });
    main.replaceChildren.apply(main, [pictures, about].concat(photos ? [photos] : [], blocks, [pager]));
    beside(blocks);
    if (p.badges.length) {
      var anchors = { top: pictures, text: about };     // the parts of the page a badge can belong to, top to bottom
      p.more.forEach(function (s, k) { anchors[s.id] = blocks[k]; });
      anchors.end = pager;
      scatter(p.badges, anchors);
    }

    // the × in the corner, the name and the line in the header all close the project
    document.body.classList.add("is-project");
    var top = document.querySelector(".top");
    var close = el("a.close", { href: "./", "aria-label": "Close the project, back to all projects" });
    close.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    if (top) top.appendChild(close);
    function closing() { keep("back", "1"); }
    [].slice.call(document.querySelectorAll(".top a")).forEach(function (a) { a.addEventListener("click", closing); });

    // ← → move between projects, Esc closes
    document.addEventListener("keydown", function (e) {
      var target = e.target;                           // the page itself when nothing has focus
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || (target && target.closest && target.closest("video"))) return;
      if (e.key === "ArrowLeft") location.href = href(prev);
      if (e.key === "ArrowRight") location.href = href(next);
      if (e.key === "Escape") { closing(); location.href = "./"; }
    });
  }

  /* ---------- the badges: big stickers lying loose on a project page ---------- */
  // Each starts where projects.js puts it and keeps clear of words and links. Picked up with the mouse or a
  // finger (pointer events), it follows the pointer from the point where it was taken, anywhere on the page,
  // and stays where it is let go: from then on it belongs to the part of the page under it, so it keeps its
  // place there when the window changes size. Only a badge in hand stops the page from scrolling.
  function scatter(list, anchors) {
    var EDGE = 4;                                      // px between a badge and the edges of the page
    var keys = Object.keys(anchors);
    var layer = el("div.badges", { "aria-hidden": "true" });
    main.classList.add("has-badges");
    main.appendChild(layer);

    function num(v, d) { return typeof v === "number" && isFinite(v) ? v : d; }
    function within(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function put(b, left, top) {
      b.left = left;
      b.top = top;
      b.node.style.transform = "translate3d(" + left.toFixed(1) + "px, " + top.toFixed(1) + "px, 0)";
    }

    // the parts of the page with two pictures or more: where a file without a spot goes, each in turn
    var roomy = keys.filter(function (k) { return anchors[k].querySelectorAll("figure").length > 1; });
    var badges = list.map(function (b, i) {
      var ratio = b.it.ratio || 1;
      var spot = b.spot || (roomy.length ? { at: roomy[i % roomy.length], pics: [1, 2] } : { at: "top", x: i % 2 ? 10 : 90, y: 30 });
      var pic = img({ it: b.it }, "(max-width: 700px) 160px, 320px", false);
      pic.draggable = false;
      var sway = 3.6 + (i * 0.7) % 1.8;                    // each sways at its own pace, out of step with the others
      var node = el("div.badge", {
        style: "--ratio: " + ratio + "; --wide: " + Math.sqrt(ratio).toFixed(3) + "; --k: " + num(spot.size, 1) + "; --tilt: " + num(spot.tilt, 0) + "deg" +
          "; --sway: " + sway.toFixed(2) + "s; --sway-delay: -" + ((i * 1.3) % sway).toFixed(2) + "s"
      }, [pic]);
      layer.appendChild(node);
      return {
        node: node, at: anchors[spot.at] ? spot.at : "top", pics: Array.isArray(spot.pics) ? spot.pics : null,
        x: num(spot.x, 50), y: num(spot.y, spot.pics ? 50 : 0), moved: false, left: 0, top: 0
      };
    });

    var held = null, stack = 0, rolling = 0, queued = 0;

    // where a badge's centre goes (box: the layer's rectangle). Across its pictures: in the space they share or
    // enclose, so on the seam between two, or on the corner where four meet, whatever the width of the window;
    // x and y slide it along that space (50 = the middle). Once moved, or without pictures: x across the page,
    // y down its part of the page. Only the pictures showing at this width are counted.
    function centre(b, box) {
      var part = anchors[b.at], figs = [].filter.call(part.querySelectorAll("figure"), function (f) { return f.getClientRects().length; });
      var rects = b.moved || !b.pics ? [] : b.pics
        .map(function (n) { return figs[n - 1]; })
        .filter(Boolean)
        .map(function (f) { return f.getBoundingClientRect(); });
      if (rects.length) {
        var edge = function (side, most) { return most.apply(Math, rects.map(function (q) { return q[side]; })); };
        var x1 = edge("left", Math.max), x2 = edge("right", Math.min), y1 = edge("top", Math.max), y2 = edge("bottom", Math.min);
        return {
          x: Math.min(x1, x2) + Math.abs(x2 - x1) * b.x / 100 - box.left,
          y: Math.min(y1, y2) + Math.abs(y2 - y1) * b.y / 100 - box.top
        };
      }
      var r = part.getBoundingClientRect();
      return { x: layer.clientWidth * b.x / 100, y: r.top - box.top + r.height * b.y / 100 };
    }

    // each at its centre; one not moved yet steps aside from words and links
    function place() {
      var box = layer.getBoundingClientRect(), W = layer.clientWidth, H = layer.clientHeight;
      var taken = [];
      function mark(r) { taken.push({ l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top }); }
      [].slice.call(main.querySelectorAll(".about__title, .about__brand, .about__text, .block__label, .pager a, .reel__sound")).forEach(function (n) {
        if (n.matches("a, button")) return mark(n.getBoundingClientRect());
        var range = document.createRange();               // the lines of text, not the whole width of the paragraph
        range.selectNodeContents(n);
        [].slice.call(range.getClientRects()).forEach(mark);
      });
      function free(l, t, w, h) {
        return !taken.some(function (q) { return l < q.r + 10 && l + w > q.l - 10 && t < q.b + 10 && t + h > q.t - 10; });
      }
      // the moved ones first: they stay exactly where they were put, the others keep clear of them
      badges.slice().sort(function (a, b) { return b.moved - a.moved; }).forEach(function (b) {
        if (held && held.b === b) return;
        var w = b.node.offsetWidth, h = b.node.offsetHeight, maxL = W - w - EDGE, maxT = H - h - EDGE;
        var c = centre(b, box), l = c.x - w / 2, t = c.y - h / 2;
        function aside() {                                // a little up or down; then the same against the nearer edge
          var side = l + w / 2 < W / 2 ? EDGE : maxL, steps = [0, .25, -.25, .5, -.5, .75, -.75, 1, -1, 1.25, -1.25, 1.5, -1.5];
          for (var k = 0; k < 2; k++) {
            for (var s = 0; s < steps.length; s++) {
              var cl = within(k ? side : l, EDGE, maxL), ct = within(t + steps[s] * h, EDGE, maxT);
              if (free(cl, ct, w, h)) return { l: cl, t: ct };
            }
          }
          return null;
        }
        var at = (!b.moved && aside()) || { l: within(l, EDGE, maxL), t: within(t, EDGE, maxT) };
        put(b, at.l, at.t);
        taken.push({ l: at.l, t: at.t, r: at.l + w, b: at.t + h });
      });
    }

    // put down: it now belongs to the part of the page under its centre
    function pin(b) {
      var box = layer.getBoundingClientRect(), best = null;
      var cx = b.left + b.node.offsetWidth / 2, cy = b.top + b.node.offsetHeight / 2;
      keys.forEach(function (k) {
        var r = anchors[k].getBoundingClientRect(), t = r.top - box.top;
        var d = Math.max(t - cy, cy - t - r.height, 0);
        if (!best || d < best.d) best = { k: k, t: t, h: r.height, d: d };
      });
      b.at = best.k;
      b.x = cx / layer.clientWidth * 100;
      b.y = best.h ? (cy - best.t) / best.h * 100 : 0;
    }

    function follow() {
      put(held.b, within(held.x + window.scrollX - held.ox, EDGE, held.maxL), within(held.y + window.scrollY - held.oy, EDGE, held.maxT));
    }

    // held close to the top or bottom of the window (after a first move), the page scrolls along, gently
    function roll() {
      rolling = 0;
      if (!held || !held.far) return;
      var zone = Math.min(80, window.innerHeight / 8), vh = window.innerHeight, speed = 0;
      if (held.y < zone) speed = (held.y - zone) / zone;
      else if (held.y > vh - zone) speed = (held.y - vh + zone) / zone;
      if (!speed) return;
      var before = window.scrollY;
      window.scrollBy(0, Math.round(within(speed, -1, 1) * 14));
      if (window.scrollY === before) return;              // the page ends here
      follow();                                           // in the same frame as the scroll: the badge never trails the pointer
      rolling = requestAnimationFrame(roll);
    }

    layer.addEventListener("pointerdown", function (e) {
      var node = e.target.closest && e.target.closest(".badge");
      if (!node || held || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();                                 // no text selected, no image dragged away
      var b = badges.filter(function (q) { return q.node === node; })[0];
      held = {
        b: b, id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, far: false,
        ox: e.clientX + window.scrollX - b.left, oy: e.clientY + window.scrollY - b.top,   // keeps the grip: no jump
        maxL: layer.clientWidth - node.offsetWidth - EDGE, maxT: layer.clientHeight - node.offsetHeight - EDGE
      };
      try { node.setPointerCapture(e.pointerId); } catch (err) {}
      node.style.zIndex = 1000;                           // the one in hand above everything else
      node.classList.add("is-held");
      document.documentElement.classList.add("is-grabbing");
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
      var b = held.b;
      held = null;
      cancelAnimationFrame(rolling);
      rolling = 0;
      b.node.classList.remove("is-held");
      b.node.style.zIndex = ++stack;                      // put down on top of the others
      document.documentElement.classList.remove("is-grabbing");
      b.moved = true;
      pin(b);
    }
    layer.addEventListener("pointerup", letGo);
    layer.addEventListener("pointercancel", letGo);
    layer.addEventListener("lostpointercapture", letGo);
    window.addEventListener("scroll", function () { if (held) follow(); }, { passive: true });

    function later() {
      if (!queued) queued = requestAnimationFrame(function () { queued = 0; place(); });
    }
    if ("ResizeObserver" in window) new ResizeObserver(later).observe(main);
    else window.addEventListener("resize", later);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
    place();
  }

  var slug = new URLSearchParams(location.search).get("p");
  var index = -1;
  projects.forEach(function (p, i) { if (p.slug === slug) index = i; });
  if (index < 0) grid(); else project(index);
  playWhenSeen();
})();
