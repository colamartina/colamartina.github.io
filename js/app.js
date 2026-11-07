/* =========================================================
   APP — the tabs of the phone version (html.is-app, set by the gate in <head>; app.css).
   Home page: Home, Works, CV and Contact are screens of the one page, one shown at a
   time. The address carries the tab (#home, #works, #cv, #contact), so the phone's back
   button and shared links work. Each tab keeps where it was scrolled to, for the whole
   visit (back from a project too); tapping the tab you are on scrolls it to the top.
   Project page: the same bar, Works lit, and the back button at the top.
   Turning a phone or a small tablet past the gate's size switches between the two
   versions without reloading.
   ========================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var bar = document.querySelector(".tabbar");
  if (!bar || !window.matchMedia) return;

  var phone = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse) and (max-height: 500px)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var home = document.getElementById("hero") !== null;     // the home page, or a project page
  var links = [].slice.call(bar.querySelectorAll("[data-tab]"));
  // the old anchors of the one-page site lead to the tab that holds them now
  var TAB = { "": "home", home: "home", top: "home", hero: "home", about: "home",
              works: "works", work: "works", projects: "works", events: "works", cv: "cv", contact: "contact" };
  var TITLE = { works: "Works", cv: "CV", contact: "Contact" };
  // the browser's own bar takes the colour of the screen under it
  var TINT = { home: "#451d20", works: "#f7f3ea", cv: "#2a62e0", contact: "#451d20" };
  var tint = document.querySelector('meta[name="theme-color"]');
  var tint0 = tint && tint.getAttribute("content");

  function on() { return root.classList.contains("is-app"); }
  function tabOf(hash) {
    var h = String(hash || "").replace(/^#/, "");
    return Object.prototype.hasOwnProperty.call(TAB, h) ? TAB[h] : null;
  }
  function mark(tab) {
    links.forEach(function (a) {
      if (a.getAttribute("data-tab") === tab) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- a project page ---------- */
  if (!home) {
    if (on()) mark("works");
    phone.addEventListener("change", function () {
      root.classList.toggle("is-app", phone.matches);
      if (phone.matches) { root.setAttribute("data-tab", "works"); mark("works"); }
    });
    // back: to Works as it was left (the same history entry, its scroll kept) when the visitor came
    // from it; from anywhere else (a shared link, the next project) the link opens Works
    var back = document.querySelector(".app-back");
    if (back) back.addEventListener("click", function (e) {
      var from = null;
      try { from = new URL(document.referrer); } catch (err) { return; }
      if (from.origin === location.origin && /(^|\/)(index\.html)?$/.test(from.pathname) && history.length > 1) {
        e.preventDefault();
        history.back();
      }
    });
    pageTransitions();
    return;
  }

  /* ---------- the home page: a screen per tab ---------- */
  var main = document.getElementById("main");
  var title0 = document.title;
  var KEY = "mc-app-scroll";
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }
  function keep() { try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* private mode: in memory only */ } }
  var current = root.getAttribute("data-tab") || "home";

  function jump(y) { window.scrollTo({ top: y, left: 0, behavior: "instant" }); }

  function show(tab, opts) {
    opts = opts || {};
    if (!opts.first) saved[current] = window.scrollY;
    current = tab;
    root.setAttribute("data-tab", tab);
    mark(tab);
    document.title = TITLE[tab] ? TITLE[tab] + " · Martina Cola" : title0;
    if (tint) tint.setAttribute("content", TINT[tab]);
    jump(opts.top !== undefined ? opts.top : saved[tab] || 0);
    keep();
    if (!opts.first && !reduce) {
      main.classList.remove("is-entering");
      void main.offsetWidth;                 // start the entrance again
      main.classList.add("is-entering");
    }
  }
  main.addEventListener("animationend", function (e) { if (e.target === main) main.classList.remove("is-entering"); });

  function go(tab, hash) {
    if (tab === current) {
      // the tab you are on: back to its top (#about: to About)
      var about = hash === "#about" ? document.getElementById("about") : null;
      window.scrollTo({ top: about ? about.offsetTop : 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    history.pushState({ tab: tab }, "", "#" + tab);
    show(tab, hash === "#about" ? { top: document.getElementById("about").offsetTop } : {});
  }

  // links to a tab — the bar's, and the old anchors — change screen instead of scrolling; this runs before
  // script.js's own smooth scrolling, which then never sees the click
  document.addEventListener("click", function (e) {
    if (!on() || e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    var tab = a && tabOf(a.getAttribute("href"));
    if (!tab) return;
    e.preventDefault();
    e.stopPropagation();
    go(tab, a.getAttribute("href"));
  }, true);

  // the phone's back and forward buttons, and a hash typed in
  function follow() {
    if (!on()) return;
    var tab = tabOf(location.hash) || "home";
    if (tab !== current) show(tab);
  }
  window.addEventListener("popstate", follow);
  window.addEventListener("hashchange", follow);
  // leaving for a project: remember where this tab was
  window.addEventListener("pagehide", function () { if (on()) { saved[current] = window.scrollY; keep(); } });

  function start() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var tab = tabOf(location.hash) || "home";
    var about = location.hash === "#about" ? document.getElementById("about") : null;
    show(tab, { first: true, top: about ? about.offsetTop : undefined });
  }
  function stop() {
    if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    main.classList.remove("is-entering");
    if (tint) tint.setAttribute("content", tint0);
  }
  phone.addEventListener("change", function () {
    root.classList.toggle("is-app", phone.matches);
    if (phone.matches) start(); else stop();
  });

  /* ---------- the greeting: the name comes in letter by letter (app.css) ---------- */
  function split() {
    var name = document.querySelector(".hero__name");
    if (!name || name.classList.contains("is-split")) return;
    var text = name.textContent;
    var shown = document.createElement("span");
    shown.setAttribute("aria-hidden", "true");
    text.split("").forEach(function (c, i) {
      var ch = document.createElement("span");
      ch.className = "hero__ch";
      ch.style.setProperty("--i", i);
      ch.textContent = c === " " ? " " : c;
      shown.appendChild(ch);
    });
    var said = document.createElement("span");          // what a screen reader reads: the name, whole
    said.className = "visually-hidden";
    said.textContent = text;
    name.replaceChildren(said, shown);
    name.classList.add("is-split");
  }

  /* ---------- Contact: copy the address, and say so ---------- */
  var copy = document.querySelector(".contact__copy");
  if (copy) {
    var label = copy.querySelector(".contact__copy-label");
    var label0 = label.textContent;
    var live = null, timer = 0;
    copy.addEventListener("click", function () {
      var mail = copy.getAttribute("data-copy");
      if (!live) {                                         // what a screen reader is told
        live = document.createElement("span");
        live.className = "visually-hidden";
        live.setAttribute("aria-live", "polite");
        copy.parentNode.insertBefore(live, copy.nextSibling);
      }
      function said(ok) {
        copy.classList.toggle("is-done", ok);
        label.textContent = ok ? "Email copied" : mail;     // if the phone refuses, the address shows to copy by hand
        live.textContent = ok ? "Email copied" : "";
        clearTimeout(timer);
        timer = setTimeout(function () {
          copy.classList.remove("is-done");
          label.textContent = label0;
          live.textContent = "";
        }, 2400);
      }
      function byHand() {
        var t = document.createElement("textarea");
        t.value = mail;
        t.setAttribute("readonly", "");
        t.style.cssText = "position:fixed;top:0;left:0;opacity:0";
        document.body.appendChild(t);
        t.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        t.remove();
        said(ok);
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(mail).then(function () { said(true); }, byHand);
      else byHand();
    });
  }

  if (on()) { split(); start(); }
  else phone.addEventListener("change", function () { if (phone.matches) split(); });
  pageTransitions();

  /* ---------- from a card to its page and back: which way the page slides (app.css) ---------- */
  function pageTransitions() {
    window.addEventListener("pagereveal", function (e) {
      if (!e.viewTransition || !window.navigation || !navigation.activation) return;
      var act = navigation.activation;
      var backwards = act.navigationType === "traverse" && act.from && act.entry && act.from.index > act.entry.index;
      if (backwards && e.viewTransition.types) e.viewTransition.types.add("back");
    });
  }
})();
