/* =========================================================
   SELECTED WORK — work/index.html
   Without ?p: every project, one image each with its title under it.
   With ?p=<slug>: that project — its photos and videos, the title and the
   short text, then everything else from its folders (banners, ads, social,
   stickers, behind the scenes), then the previous and next project.
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
  var STICKERS = { graphics: true, stickers: true, badges: true };   // data sections shown as a sticker sheet
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

  // focus: which part of a photo stays in the cut; upright: true cuts a landscape photo to 4:5 too
  function asMedia(it, pick) {
    return { it: it, focus: (pick && pick.focus) || null, upright: (pick && pick.upright === true) || it.ratio < 1.1 };
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

    // the rest of the project's folders, in their order; the stickers and behind the scenes close the page
    var shown = {};
    images.concat(videos).forEach(function (m) { shown[m.it.name] = true; });
    (e.hide || []).forEach(function (name) { shown[name] = true; });
    function rank(s) { return s.id === "bts" ? 2 : STICKERS[s.id] ? 1 : 0; }
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
    var more = folders
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
      .filter(function (s) { return s.items.length; })
      .sort(function (a, b) { return rank(a) - rank(b); });

    return {
      slug: e.slug,
      title: e.title,
      text: e.text,
      cover: { it: cover.it, focus: e.focus || cover.focus, zoom: e.zoom || null },
      images: images,
      videos: videos,
      more: more
    };
  }).filter(Boolean);
  if (!projects.length) return;

  /* ---------- media ---------- */
  function img(m, sizes, eager) {
    var it = m.it, node = document.createElement("img");
    node.alt = "";
    node.decoding = "async";
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
    var nodes = gallery(p.images, p.title, true);
    if (p.videos.length) nodes.push(el("div.reels", {}, p.videos.map(video)));
    return nodes;
  }

  // how a file from the rest of the folders is shown: whole, except the photos behind the scenes
  function shape(section, it) {
    if (it.type === "video") return "reels";
    if (STICKERS[section.id]) return "stickers";
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
      } else if (r.shape === "stickers") {
        nodes.push(el("div.run.run--stickers", {}, r.items.map(function (m) { return img(m, "240px", false); })));
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
    return el("section.block", { "aria-label": s.label }, [el("h2.block__label", { text: s.label })].concat(nodes));
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

    main.replaceChildren.apply(main, [el("div.visuals", {}, visuals(p)), about]
      .concat(p.more.map(function (s) { return block(p, s); }), [pager]));

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

  var slug = new URLSearchParams(location.search).get("p");
  var index = -1;
  projects.forEach(function (p, i) { if (p.slug === slug) index = i; });
  if (index < 0) grid(); else project(index);
  playWhenSeen();
})();
