/* =========================================================
   BRAND COLLABS — one entry per collaboration. Same shape as
   campaigns, plus `partner` (the other brand) and `pair` (the two
   images shown side by side on the home page).
   Rendered on the home page (#collabs) and on case.html?p=<slug>.

   Texts: null = still to write ([TODO] on the working copy only).
   Quotes come from the collab materials. Internal slides are left out.
   accent: "blue", "yellow" or "orange": the colour of the project page's kicker and quotes.
   ========================================================= */
window.PORTFOLIO = window.PORTFOLIO || {};
window.PORTFOLIO.collabs = [
  {
    "slug": "goodnews-2023",
    "title": "GoodNews",
    "partner": "GoodNews",
    "kicker": "Manis & Coffee",
    "brand": "Le Mini Macaron",
    "year": "2023",
    "type": "Pop-up",
    "accent": "yellow",
    "line": null,
    "role": null,
    "context": null,
    "whatIDid": null,
    "results": null,
    "quotes": [
      {
        "text": "Manis & Coffee",
        "source": "Newsletter (ES)"
      },
      {
        "text": "¡Sólo mañana! Ven a vernos en nuestra pop up con GoodNews — 15 de junio, 10 AM – 6.30PM, Francesc Macià 3, Barcelona",
        "source": "Newsletter (ES)"
      },
      {
        "text": "Good coffee good nails",
        "source": "Pop-up graphics"
      }
    ],
    "cover": {
      "type": "image",
      "src": "content/collabs/goodnews-2023/gallery/popup-03",
      "widths": [
        640,
        1280,
        1920
      ],
      "ratio": 0.5626,
      "name": "popup-03.webp"
    },
    "pair": [
      {
        "type": "image",
        "src": "content/collabs/goodnews-2023/gallery/popup-01",
        "widths": [
          640,
          1280,
          1920
        ],
        "ratio": 0.75,
        "name": "popup-01.webp"
      },
      {
        "type": "image",
        "src": "content/collabs/goodnews-2023/gallery/popup-05",
        "widths": [
          640,
          1280,
          1920
        ],
        "ratio": 0.75,
        "name": "popup-05.webp"
      }
    ],
    "sections": [
      {
        "id": "popup",
        "label": "Pop-up",
        "mode": "gallery",
        "path": "goodnews-2023 / gallery",
        "note": null,
        "items": [
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/gallery/popup-03",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.5626,
            "name": "popup-03.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/gallery/popup-01",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.75,
            "name": "popup-01.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/gallery/popup-05",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.75,
            "name": "popup-05.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/gallery/popup-02",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.75,
            "name": "popup-02.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/gallery/popup-04",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 1.0,
            "name": "popup-04.webp"
          }
        ]
      },
      {
        "id": "reel",
        "label": "Reel",
        "mode": "gallery",
        "path": "goodnews-2023 / video",
        "note": null,
        "items": [
          {
            "type": "video",
            "src": "content/collabs/goodnews-2023/video/reel.mp4",
            "poster": "content/collabs/goodnews-2023/video/reel-poster.webp",
            "ratio": 0.5625,
            "duration": 13.76,
            "audio": true,
            "name": "reel.mp4"
          }
        ]
      },
      {
        "id": "newsletter",
        "label": "Newsletter",
        "mode": "gallery",
        "path": "goodnews-2023 / newsletter",
        "note": "GIF animata della newsletter, convertita in video",
        "items": [
          {
            "type": "video",
            "src": "content/collabs/goodnews-2023/newsletter/newsletter-es.mp4",
            "poster": "content/collabs/goodnews-2023/newsletter/newsletter-es-poster.webp",
            "ratio": 0.603,
            "duration": 2.8,
            "audio": false,
            "name": "newsletter-es.mp4"
          }
        ]
      },
      {
        "id": "bts",
        "label": "Behind the scenes",
        "mode": "gallery",
        "path": "goodnews-2023 / bts",
        "note": null,
        "items": [
          {
            "type": "video",
            "src": "content/collabs/goodnews-2023/bts/filming-manicure.mp4",
            "poster": "content/collabs/goodnews-2023/bts/filming-manicure-poster.webp",
            "ratio": 0.5625,
            "duration": 2.27,
            "audio": true,
            "name": "filming-manicure.mp4"
          },
          {
            "type": "video",
            "src": "content/collabs/goodnews-2023/bts/stickers-on-cups.mp4",
            "poster": "content/collabs/goodnews-2023/bts/stickers-on-cups-poster.webp",
            "ratio": 0.5625,
            "duration": 5.31,
            "audio": true,
            "name": "stickers-on-cups.mp4"
          }
        ]
      },
      {
        "id": "graphics",
        "label": "Graphics",
        "mode": "files",
        "path": "goodnews-2023 / badges",
        "note": null,
        "items": [
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/badges/badge-smiley",
            "widths": [
              206
            ],
            "ratio": 0.9904,
            "name": "badge-smiley.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/badges/badge-ohlala",
            "widths": [
              320,
              374
            ],
            "ratio": 1.5847,
            "name": "badge-ohlala.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/badges/good-coffee-good-nails",
            "widths": [
              320,
              640
            ],
            "ratio": 3.6782,
            "name": "good-coffee-good-nails.webp",
            "bg": "blue"
          },
          {
            "type": "image",
            "src": "content/collabs/goodnews-2023/badges/badge-macaron-2026",
            "widths": [
              260
            ],
            "ratio": 0.9665,
            "name": "badge-macaron-2026.webp"
          }
        ]
      }
    ],
    "todo": [
      "Il badge 'badge-macaron-2026' è il macaron rosa del rebranding 2026: nel 2023 era rosso. Lo tengo qui su tua indicazione."
    ]
  },
  {
    "slug": "fazit-2025",
    "title": "Fazit",
    "partner": "Fazit",
    "kicker": "All Dolled Up!",
    "brand": "Le Mini Macaron",
    "year": "2025",
    "type": "Co-branded collection",
    "accent": "blue",
    "line": null,
    "role": null,
    "context": null,
    "whatIDid": null,
    "results": null,
    "quotes": [
      {
        "text": "All Dolled Up! — The GRWM night out ritual",
        "source": "Collab flyer"
      },
      {
        "text": "We're teaming up for the first time to launch a nostalgic, expressive, and unapologetically fun collection designed to celebrate the ritual of the group get-ready!",
        "source": "Collab flyer"
      },
      {
        "text": "4 exclusive colors · 3D nail stickers · exclusive freckles",
        "source": "Product sheet"
      },
      {
        "text": "The collection is available from August 14, 2025",
        "source": "Collab flyer"
      }
    ],
    "cover": {
      "type": "image",
      "src": "content/collabs/fazit-2025/kv-flyer",
      "widths": [
        640,
        1280,
        1658
      ],
      "ratio": 1.2953,
      "name": "kv-flyer.webp"
    },
    "pair": [
      {
        "type": "image",
        "src": "content/collabs/fazit-2025/assets/model-dollhouse-bottles",
        "widths": [
          640,
          1280,
          1920
        ],
        "ratio": 0.8023,
        "name": "model-dollhouse-bottles.webp"
      },
      {
        "type": "image",
        "src": "content/collabs/fazit-2025/assets/bundle-lifestyle-models",
        "widths": [
          640,
          1280,
          1581
        ],
        "ratio": 0.772,
        "name": "bundle-lifestyle-models.webp"
      }
    ],
    "sections": [
      {
        "id": "key-visuals",
        "label": "Key visuals",
        "mode": "gallery",
        "path": "fazit-2025",
        "note": null,
        "items": [
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/kv-flyer",
            "widths": [
              640,
              1280,
              1658
            ],
            "ratio": 1.2953,
            "name": "kv-flyer.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/assets/model-dollhouse-bottles",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.8023,
            "name": "model-dollhouse-bottles.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/assets/model-bottle-confetti-crush",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.6667,
            "name": "model-bottle-confetti-crush.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/assets/bundle-lifestyle-models",
            "widths": [
              640,
              1280,
              1581
            ],
            "ratio": 0.772,
            "name": "bundle-lifestyle-models.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/banner-desktop",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 3.4532,
            "name": "banner-desktop.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/assets/landing-page-models-desktop",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 3.4532,
            "name": "landing-page-models-desktop.webp"
          }
        ]
      },
      {
        "id": "product",
        "label": "Product",
        "mode": "files",
        "path": "fazit-2025 / product",
        "note": null,
        "items": [
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/product/ads-carousel",
            "widths": [
              640,
              1080
            ],
            "ratio": 1.0,
            "name": "ads-carousel.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/product/product-collab",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 2.7195,
            "name": "product-collab.webp"
          }
        ]
      },
      {
        "id": "moodboards",
        "label": "Moodboards",
        "mode": "files",
        "path": "fazit-2025 / asset",
        "note": null,
        "items": [
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/moodboards",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 2.2967,
            "name": "moodboards.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/assets/moodboard-grid",
            "widths": [
              640,
              1080
            ],
            "ratio": 0.8,
            "name": "moodboard-grid.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/assets/asset-moodboard",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 2.3216,
            "name": "asset-moodboard.webp"
          }
        ]
      },
      {
        "id": "social",
        "label": "Social",
        "mode": "gallery",
        "path": "fazit-2025 / social media",
        "note": null,
        "items": [
          {
            "type": "video",
            "src": "content/collabs/fazit-2025/social/out-in-2-days.mp4",
            "poster": "content/collabs/fazit-2025/social/out-in-2-days-poster.webp",
            "ratio": 0.5625,
            "duration": 4.6,
            "audio": true,
            "name": "out-in-2-days.mp4"
          },
          {
            "type": "video",
            "src": "content/collabs/fazit-2025/social/i-dont-think-we-should-be-together.mp4",
            "poster": "content/collabs/fazit-2025/social/i-dont-think-we-should-be-together-poster.webp",
            "ratio": 0.5625,
            "duration": 11.27,
            "audio": true,
            "name": "i-dont-think-we-should-be-together.mp4"
          },
          {
            "type": "video",
            "src": "content/collabs/fazit-2025/social/video-collage-all-models.mp4",
            "poster": "content/collabs/fazit-2025/social/video-collage-all-models-poster.webp",
            "ratio": 0.5625,
            "duration": 19.37,
            "audio": false,
            "name": "video-collage-all-models.mp4"
          },
          {
            "type": "image",
            "src": "content/collabs/fazit-2025/social/social-grid",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 1.1643,
            "name": "social-grid.webp"
          }
        ]
      }
    ],
    "todo": [
      "Le moodboard contengono immagini di altri brand usate come ispirazione: ok mostrarle?"
    ]
  },
  {
    "slug": "daise-2025",
    "title": "DAISE",
    "partner": "DAISE",
    "kicker": "Free DAISE Gift",
    "brand": "Le Mini Macaron",
    "year": "2026",
    "type": "Giveaway & gift",
    "accent": "blue",
    "line": null,
    "role": null,
    "context": null,
    "whatIDid": null,
    "results": null,
    "quotes": [
      {
        "text": "@daisebeauty x @leminimacaron are giving 10 of you a head-to-toe routine, on us",
        "source": "Instagram giveaway"
      },
      {
        "text": "Free DAISE Gift on $65+ Orders — A fun little extra, just because",
        "source": "Site banner"
      },
      {
        "text": "Brand activation with a playful brand DAISE. A collaboration that make sense.",
        "source": "Brand book 2026"
      }
    ],
    "cover": {
      "type": "image",
      "src": "content/collabs/daise-2025/kv-post",
      "widths": [
        640,
        1280,
        1920
      ],
      "ratio": 0.8,
      "name": "kv-post.webp"
    },
    "pair": [
      {
        "type": "image",
        "src": "content/collabs/daise-2025/kv-post",
        "widths": [
          640,
          1280,
          1920
        ],
        "ratio": 0.8,
        "name": "kv-post.webp"
      },
      {
        "type": "image",
        "src": "content/collabs/daise-2025/instagram-post-mockup",
        "widths": [
          640,
          740
        ],
        "ratio": 1.0,
        "name": "instagram-post-mockup.webp"
      }
    ],
    "sections": [
      {
        "id": "key-visuals",
        "label": "Key visuals",
        "mode": "gallery",
        "path": "daise-2025",
        "note": null,
        "items": [
          {
            "type": "image",
            "src": "content/collabs/daise-2025/kv-post",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.8,
            "name": "kv-post.webp"
          },
          {
            "type": "video",
            "src": "content/collabs/daise-2025/nail-art-video.mp4",
            "poster": "content/collabs/daise-2025/nail-art-video-poster.webp",
            "ratio": 0.5625,
            "duration": 13.9,
            "audio": true,
            "name": "nail-art-video.mp4"
          },
          {
            "type": "image",
            "src": "content/collabs/daise-2025/instagram-post-mockup",
            "widths": [
              640,
              740
            ],
            "ratio": 1.0,
            "name": "instagram-post-mockup.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/daise-2025/homepage-mockup",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 1.5,
            "name": "homepage-mockup.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/daise-2025/banner",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 3.787,
            "name": "banner.webp"
          }
        ]
      }
    ],
    "todo": null
  },
  {
    "slug": "tezenis-2026",
    "title": "Tezenis",
    "partner": "Tezenis",
    "kicker": null,
    "brand": "Le Mini Macaron",
    "year": "2026",
    "type": "Retail promotion",
    "accent": "yellow",
    "line": null,
    "role": null,
    "context": null,
    "whatIDid": null,
    "results": null,
    "quotes": [
      {
        "text": "Kit Manicura Semipermanente de REGALO! por la compra de 2 sujetadores Natural Lifting Bra",
        "source": "In-store visual (ES)"
      },
      {
        "text": "Exclusivo en tiendas del 19–21 de marzo",
        "source": "In-store visual (ES)"
      }
    ],
    "cover": {
      "type": "image",
      "src": "content/collabs/tezenis-2026/assets-overview",
      "widths": [
        640,
        1280,
        1920
      ],
      "ratio": 1.8303,
      "name": "assets-overview.webp"
    },
    "pair": [
      {
        "type": "image",
        "src": "content/collabs/tezenis-2026/in-store/in-store-04",
        "widths": [
          640,
          1280,
          1920
        ],
        "ratio": 0.75,
        "name": "in-store-04.webp"
      },
      {
        "type": "image",
        "src": "content/collabs/tezenis-2026/in-store/in-store-03",
        "widths": [
          640,
          1280,
          1920
        ],
        "ratio": 0.75,
        "name": "in-store-03.webp"
      }
    ],
    "sections": [
      {
        "id": "key-visuals",
        "label": "Key visuals",
        "mode": "files",
        "path": "tezenis-2026",
        "note": null,
        "items": [
          {
            "type": "image",
            "src": "content/collabs/tezenis-2026/assets-overview",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 1.8303,
            "name": "assets-overview.webp"
          }
        ]
      },
      {
        "id": "in-store",
        "label": "In store",
        "mode": "gallery",
        "path": "tezenis-2026 / in store pics",
        "note": null,
        "items": [
          {
            "type": "image",
            "src": "content/collabs/tezenis-2026/in-store/in-store-04",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.75,
            "name": "in-store-04.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/tezenis-2026/in-store/in-store-03",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 0.75,
            "name": "in-store-03.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/tezenis-2026/in-store/in-store-01",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 1.3333,
            "name": "in-store-01.webp"
          },
          {
            "type": "image",
            "src": "content/collabs/tezenis-2026/in-store/in-store-02",
            "widths": [
              640,
              1280,
              1920
            ],
            "ratio": 1.3333,
            "name": "in-store-02.webp"
          }
        ]
      }
    ],
    "todo": [
      "Slide del deck (meccaniche e piano di comunicazione) escluse finché non dai l'ok a pubblicarle.",
      "Confermato da Martina: in tutti gli store Tezenis in Spagna, 9–22 marzo, senza numero preciso di kit."
    ]
  }
];
