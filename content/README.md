# content/

Web-ready assets for the portfolio, organized by site section. Every file here is an **optimized copy**:
the originals stay untouched in `NEWPORTFOLIO/`, the read-only archive that is not tracked by git.

```text
content/
├── hero/          extra images for the hero cursor trail (alongside assets/trail/t1–t7)
├── campaigns/     one folder per campaign: rebranding-2026, cat-eye-2025, black-friday-2025,
│                  spring-2026, summer-2026, fall-2026, ooh-italy
├── events/        one folder per event: video.mp4 + video-poster.webp + copy.md
├── collabs/       goodnews-2023, fazit-2025, daise-2025, tezenis-2026
├── hobbies/       battesimo-penny, ceramica (empty), hey-gigi (empty)
├── manifest.json  every asset with its widths/heights/bytes → build srcset and width/height from here
└── SOURCES.md     copy → original path in NEWPORTFOLIO/, sizes before/after, what was excluded
```

The subfolders inside each project (`badges/`, `bts/`, `paid-ads/`, `social/`, `ugc/`, `influencer/`, `ecom/`…)
keep Martina's original categories, so each case study can tell every part of the project.

## Conventions
- **Images**: `name-640.webp`, `name-1280.webp`, `name-1920.webp`. The suffix is the pixel width; images are never
  upscaled, so small originals have fewer or narrower sizes. Badges use `-320/-640`, hero images `-400/-800`.
- **Videos**: `name.mp4` (H.264, ≤1280 px long side, ≤5 MB) + `name-poster.webp`. Event videos have no audio track.
- **PDFs**: original `name.pdf` + `name-pages/page-NN-800.webp` / `page-NN-1600.webp`.
- **copy.md**: texts found in the assets (verbatim, with source) and `[TODO]` for anything missing.
  Nothing in there is invented.
