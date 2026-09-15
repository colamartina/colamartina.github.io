/* =========================================================
   HERO PHOTOS
   - hero:  the pool used by the photos that follow the mouse (desktop)
            and by the photo stack on touch screens. Order = display order.
            src = normal screens, srcHi = retina screens (optional).
   - intro: the photos flashed inside the intro window (first visit only).
   Add, remove or reorder entries here — no HTML or JS changes needed.
   ========================================================= */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.hero = [
  { src: "content/hero/hero-01-400.webp", srcHi: "content/hero/hero-01-800.webp" },
  { src: "content/hero/hero-07-400.webp", srcHi: "content/hero/hero-07-800.webp" },
  { src: "assets/trail/t1-400.webp", srcHi: "assets/trail/t1-700.webp" },
  { src: "content/hero/hero-10-400.webp", srcHi: "content/hero/hero-10-800.webp" },
  { src: "assets/trail/t5-400.webp", srcHi: "assets/trail/t5-525.webp" },
  { src: "content/hero/hero-03-400.webp", srcHi: "content/hero/hero-03-800.webp" },
  { src: "content/hero/hero-06-400.webp", srcHi: "content/hero/hero-06-800.webp" },
  { src: "assets/trail/t7-400.webp", srcHi: "assets/trail/t7-525.webp" },
  { src: "content/hero/hero-05-400.webp", srcHi: "content/hero/hero-05-800.webp" },
  { src: "assets/trail/t4-400.webp", srcHi: "assets/trail/t4-700.webp" },
  { src: "content/hero/hero-08-400.webp", srcHi: "content/hero/hero-08-800.webp" },
  { src: "assets/trail/t3-400.webp", srcHi: "assets/trail/t3-700.webp" }
];

/* Twelve, ordered so neighbours differ (people, products, places, colours). Kept
   out for now — move any of these into the list above to bring it back:
     content/hero/hero-02, hero-04, hero-09
     assets/trail/t2, t6
   Keep the count off multiples of five, so the trail's five sizes keep rotating. */

window.PORTFOLIO.intro = [
  "content/hero/hero-01-800.webp",
  "content/hero/hero-03-800.webp",
  "content/hero/hero-06-800.webp",
  "content/hero/hero-08-800.webp"
];
