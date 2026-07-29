# Martina Cola — Portfolio

A fast, self-contained portfolio site. No build step, no framework, no external
dependencies — rebuilt from the original Framer site so you fully own it.

## Files

| File | What it holds |
|------|----------------|
| `index.html` | All the content — bio, projects, contact. **Edit text here.** |
| `styles.css` | All styling (colors, type, layout). Brand color is `--blue: #003399`. |
| `script.js` | Scroll reveals, adaptive nav, count-up stats, mobile menu. |
| `fonts.css` + `assets/fonts/` | Self-hosted Bebas Neue + Inter (no Google Fonts call). |
| `assets/` | Optimized OOH campaign photos + favicon. |

## View it

Just double-click `index.html` — it works straight from disk (everything is local).
Or serve it: `python3 -m http.server` then open http://localhost:8000.

## Publish it (free)

Any static host works. Easiest options:
- **Netlify** — drag this whole folder onto https://app.netlify.com/drop
- **Vercel** — `vercel` in this folder, or import it on vercel.com
- **GitHub Pages** — push to a repo, enable Pages on the `main` branch

You can point your own domain at any of them.

## To update

- **Edit copy / projects** → `index.html`
- **Swap the OOH photos** → replace files in `assets/`, keep the same names (or update `<img src>` in `index.html`)
- **Cursor image trail** → the images that follow your mouse in the hero live in `assets/trail/` (`t1.jpg`–`t7.jpg`). Swap them for any images (keep the names), or edit the `IMGS` list in `script.js`. It's mouse-only and auto-disables for reduced-motion / touch.
- **⚠️ LinkedIn link** → in `index.html`, the Contact section links to
  `https://www.linkedin.com/in/martinacola/` — a placeholder guess. Replace with your real profile URL.
