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
  { src: "assets/trail/t1-400.webp", srcHi: "assets/trail/t1-700.webp" },
  { src: "content/hero/hero-03-400.webp", srcHi: "content/hero/hero-03-800.webp" },
  { src: "content/hero/hero-06-400.webp", srcHi: "content/hero/hero-06-800.webp" },
  { src: "assets/trail/t3-400.webp", srcHi: "assets/trail/t3-700.webp" },
  { src: "content/hero/hero-08-400.webp", srcHi: "content/hero/hero-08-800.webp" }
];

/* Kept out of the trail for now (fewer photos, less variety) — move any of
   these back into the list above to bring it back:
     content/hero/hero-02, hero-04, hero-05, hero-07, hero-09, hero-10
     assets/trail/t2, t4, t5, t6, t7  */

window.PORTFOLIO.intro = [
  "content/hero/hero-01-800.webp",
  "content/hero/hero-03-800.webp",
  "content/hero/hero-06-800.webp",
  "content/hero/hero-08-800.webp"
];
