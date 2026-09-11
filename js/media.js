/* =========================================================
   MEDIA HELPERS — shared by the home sections and the case-study page.
   Items come from data/*.js:
     image: { src, widths, ratio, name }  → files <src>-<width>.webp
     video: { src, poster, ratio, duration, audio, name }
   ========================================================= */
(function () {
  "use strict";

  // same rule as script.js: [TODO] notes only on the working copy (?live previews the published look)
  var isLocal = (location.protocol === "file:" ||
    /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) &&
    !/[?&]live(&|=|$)/.test(location.search);

  function srcset(it) {
    return it.widths.map(function (w) { return it.src + "-" + w + ".webp " + w + "w"; }).join(", ");
  }

  // <img> with srcset/sizes and an intrinsic ratio (no layout shift while loading)
  function img(it, sizes, opts) {
    opts = opts || {};
    var el = document.createElement("img");
    if (it.type === "image" && it.file) {
      el.src = it.file;                    // single file (no responsive versions)
    } else if (it.type === "image") {
      el.src = it.src + "-" + it.widths[0] + ".webp";
      el.srcset = srcset(it);
      el.sizes = sizes || "100vw";
    } else {
      el.src = it.poster;
    }
    el.width = 1000;
    el.height = Math.round(1000 / it.ratio);
    el.alt = opts.alt || "";
    el.loading = opts.eager ? "eager" : "lazy";
    el.decoding = "async";
    if (it.focus) el.style.objectPosition = it.focus;
    return el;
  }

  function duration(s) {
    var m = Math.floor(s / 60), r = Math.round(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  // tiny DOM builder: el("p.class", { href: "#" }, [children | "text"])
  function el(tag, attrs, children) {
    var parts = tag.split(".");
    var node = document.createElement(parts[0] || "div");
    if (parts.length > 1) node.className = parts.slice(1).join(" ");
    Object.keys(attrs || {}).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
      if (k === "text") node.textContent = attrs[k];
      else if (k === "style") node.setAttribute("style", attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  // [TODO] note for missing content — only rendered on the working copy
  function todo(text) {
    return isLocal ? el("span.todo", { text: text }) : null;
  }

  window.Media = { img: img, srcset: srcset, duration: duration, el: el, todo: todo, isLocal: isLocal };
})();
