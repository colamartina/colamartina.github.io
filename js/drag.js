/* =========================================================
   DRAG — the one way things are picked up on this site.

   Written for the project badges (js/projects.js) and reused, unchanged, by
   the hobby objects in Fun Stuff (js/hobbies.js). A pointer (mouse or finger)
   takes hold of a thing, carries it anywhere its owner allows, and leaves it
   where it is let go: nothing is selected on the way, no picture is dragged
   off to another window, and the click that ends the drag opens nothing.
   Held near the top or the bottom of the window, the page scrolls along.

   Everything that differs between the two — what can be picked up, where a
   thing is, how far it may go and how it is moved — is passed in, so this
   file knows nothing about either of them:

     attach(layer, {
       find(target)    -> the node to pick up, or null
       at(node)        -> { x, y }  where it is now, in page pixels
       limits(node)    -> { minX, minY, maxX, maxY } how far it may go
       move(node, x, y)            put it there
       grab(node) / drop(node)     (optional) it has been picked up / put down
       lift(on)                    (optional) something is / is no longer in hand
     })
   ========================================================= */
(function () {
  "use strict";

  function within(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function attach(layer, o) {
    var held = null, stack = 0, rolling = 0, dragged = false;

    function follow() {
      var l = held.lim;
      o.move(held.node,
        within(held.x + window.scrollX - held.ox, l.minX, l.maxX),
        within(held.y + window.scrollY - held.oy, l.minY, l.maxY));
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

    layer.addEventListener("pointerdown", function (e) {
      var node = o.find(e.target);
      if (!node || held || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();                                 // no text selected, no picture dragged away
      var now = o.at(node);
      held = {
        node: node, id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, far: false,
        ox: e.clientX + window.scrollX - now.x, oy: e.clientY + window.scrollY - now.y,   // keeps the grip: no jump
        lim: o.limits(node)
      };
      try { node.setPointerCapture(e.pointerId); } catch (err) {}
      node.style.zIndex = 1000;                           // the one in hand above the others,
      if (o.lift) o.lift(true);                           // and its layer above the page while it is held
      node.classList.add("is-held");
      document.documentElement.classList.add("is-grabbing");
      if (o.grab) o.grab(node);
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
      var node = held.node;
      held = null;
      cancelAnimationFrame(rolling);
      rolling = 0;
      node.classList.remove("is-held");
      node.style.zIndex = ++stack;                        // put down on top of the others
      if (o.lift) o.lift(false);
      document.documentElement.classList.remove("is-grabbing");
      if (o.drop) o.drop(node);
      if (e.type === "pointerup") { dragged = true; setTimeout(function () { dragged = false; }, 0); }
    }
    layer.addEventListener("pointerup", letGo);
    layer.addEventListener("pointercancel", letGo);
    layer.addEventListener("lostpointercapture", letGo);
    window.addEventListener("scroll", function () { if (held) follow(); }, { passive: true });
    // the click that follows a thing let go goes nowhere: no link under it opens
    window.addEventListener("click", function (e) { if (dragged) { dragged = false; e.preventDefault(); e.stopPropagation(); } }, true);
  }

  window.Drag = { attach: attach, within: within };
})();
