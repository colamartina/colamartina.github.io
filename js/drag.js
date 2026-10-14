/* =========================================================
   DRAG — the one way things are picked up on this site.

   Written for the project badges (js/projects.js) and reused, unchanged, by
   the hobby objects in Fun Stuff (js/hobbies.js). A pointer (mouse or finger)
   takes hold of a thing, carries it anywhere its owner allows, and lets it go
   with the speed it was thrown at: it glides on and settles, and gives a
   little, like rubber, when pulled past an edge. Nothing is selected on the
   way, no picture is dragged off to another window, and the click that ends
   the drag opens nothing.
   Held near the top or the bottom of the window, the page scrolls along.

   Everything that differs between the two — what can be picked up, where a
   thing is, how far it may go and how it is moved — is passed in, so this
   file knows nothing about either of them:

     attach(layer, {
       find(target)    -> the node to pick up, or null
       at(node)        -> { x, y }  where it is now, in page pixels
       limits(node)    -> { minX, minY, maxX, maxY } how far it may go
       move(node, x, y)            put it there
       grab(node) / drop(node)     (optional) it has been picked up / has come to rest
       lift(on)                    (optional) something is / is no longer in hand
     })
   ========================================================= */
(function () {
  "use strict";

  function within(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // past an edge it follows less and less, the further it goes: it gives, it doesn't stop dead
  function give(over, size) { return (over * size * 0.55) / (size + 0.55 * Math.abs(over)); }
  function soft(v, lo, hi, size) { return v < lo ? lo - give(lo - v, size) : v > hi ? hi + give(v - hi, size) : v; }

  // where a throw at v px/s comes to rest, as a scroll does (Apple's projection, decelerationRate 0.995)
  function project(v) { return (v / 1000) * 0.995 / (1 - 0.995); }

  // a spring, set the way Apple sets them: damping (1 = no overshoot) and response (seconds to get there)
  function spring(from, to, v, damping, response) {
    var k = Math.pow(2 * Math.PI / response, 2), c = 4 * Math.PI * damping / response;
    return { x: from, v: v, to: to, k: k, c: c, step: function (dt) {
      this.v += (-this.k * (this.x - this.to) - this.c * this.v) * dt;
      this.x += this.v * dt;
      return Math.abs(this.x - this.to) < 0.5 && Math.abs(this.v) < 8;
    } };
  }

  function attach(layer, o) {
    var held = null, stack = 0, rolling = 0, dragged = false, flying = [];

    function follow() {
      var l = held.lim, x = held.x + window.scrollX, y = held.y + window.scrollY, now = performance.now();
      o.move(held.node,
        soft(x - held.ox, l.minX, l.maxX, window.innerWidth),
        soft(y - held.oy, l.minY, l.maxY, window.innerHeight));
      // the last tenth of a second of the way, for the speed it is let go at
      held.trace.push([now, x, y]);
      while (held.trace.length > 2 && now - held.trace[0][0] > 100) held.trace.shift();
    }

    // its speed in px/s as it leaves the hand; none if the hand had already stopped
    function speed() {
      var t = held.trace, a = t[0], b = t[t.length - 1];
      if (!a || b === a || performance.now() - b[0] > 60) return [0, 0];
      var dt = (b[0] - a[0]) / 1000 || 0.016;
      return [(b[1] - a[1]) / dt, (b[2] - a[2]) / dt];
    }

    // let go, it carries on the way it was thrown and settles where the throw takes it, within its limits; back
    // over the edge if it was pulled past one. X and Y each have their own spring
    function fly(node, lim, v) {
      var now = o.at(node);
      var tx = within(now.x + project(v[0]), lim.minX, lim.maxX), ty = within(now.y + project(v[1]), lim.minY, lim.maxY);
      if (still) { o.move(node, within(now.x, lim.minX, lim.maxX), within(now.y, lim.minY, lim.maxY)); return land(node); }
      // a little bounce only when it was thrown; put down gently, it just settles
      var damp = Math.hypot(v[0], v[1]) > 300 ? 0.8 : 1;
      var f = { node: node, sx: spring(now.x, tx, v[0], damp, 0.4), sy: spring(now.y, ty, v[1], damp, 0.4) };
      flying.push(f);
      var last = performance.now();
      (function tick(t) {
        if (flying.indexOf(f) < 0) return;               // picked up again in flight
        var dt = Math.min((t - last) / 1000, 0.05), done = true;
        last = t;
        for (var i = 0; i < 4; i++) { var a = f.sx.step(dt / 4), b = f.sy.step(dt / 4); done = a && b; }
        if (done) { f.sx.x = tx; f.sy.x = ty; }
        o.move(node, f.sx.x, f.sy.x);
        if (done) { flying.splice(flying.indexOf(f), 1); land(node); }
        else requestAnimationFrame(tick);
      })(last);
    }
    function land(node) { if (o.drop) o.drop(node); }

    // anything still in flight stops where it is and is put down there
    function catchAll() {
      flying.splice(0).forEach(function (f) { land(f.node); });
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
      catchAll();                                         // caught in flight: it is taken from where it is now
      var now = o.at(node);
      held = {
        node: node, id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, far: false,
        ox: e.clientX + window.scrollX - now.x, oy: e.clientY + window.scrollY - now.y,   // keeps the grip: no jump
        lim: o.limits(node), trace: [[performance.now(), e.clientX + window.scrollX, e.clientY + window.scrollY]]
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
      var node = held.node, lim = held.lim, v = e.type === "pointerup" ? speed() : [0, 0];
      held = null;
      cancelAnimationFrame(rolling);
      rolling = 0;
      node.classList.remove("is-held");
      node.style.zIndex = ++stack;                        // put down on top of the others
      if (o.lift) o.lift(false);
      document.documentElement.classList.remove("is-grabbing");
      fly(node, lim, v);
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
