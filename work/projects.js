/* =========================================================
   SELECTED WORK — what work/ shows, in this order.
   One entry = one image on the page + one project page (work/?p=<slug>).
     title   the line under the image; on the project page the part after " | "
             becomes the title and the part before it the brand, in italics
     text    the short text on the project page
     cover   the image on the page, cut to 3:4
             focus: the part that stays in the cut, e.g. "50% 30%" = centre, upper part
     images  the photos at the top of the project page: upright ones cut to 4:5, landscape ones to 5:4
             (a name, { name: "…", focus: "…", upright: true } to cut a landscape image to 4:5 as well,
             or one of the PHOTOS below)
     videos  played muted and in loop while on screen
     hide    files of the project's folders to leave out; every other file (banners, ads, social,
             stickers, behind the scenes) is shown under the text, whole
   Files are picked by name from data/campaigns.js, collabs.js and events.js.
   Order: the projects with the most material first, the covers grouped by colour.
   ========================================================= */
(function () {
  // photos that are not in data/: web copies of Martina's originals, made for this page
  var PHOTOS = {
    collanine: { src: "content/events/retail-milan/bead-table", widths: [640, 720], ratio: 0.75, name: "bead-table.webp" },
    presentation: { src: "content/events/pr-brand-presentation/window-display", widths: [640, 1280, 1920], ratio: 0.75, name: "window-display.webp" },
    selfie: { src: "content/events/retail-torino/mirror-selfie", widths: [640, 1280, 1920], ratio: 0.75, name: "mirror-selfie.webp" },
    hotpoint: { src: "content/events/fuorisalone-beko/hotpoint-truck", widths: [640, 1280, 1920], ratio: 0.75, name: "hotpoint-truck.webp" }
  };

  window.SELECTED = [
    {
      slug: "rebranding-2026",
      title: "Le Mini Macaron | Rebranding",
      text: "Le Mini Macaron kicked off 2026 with a new tagline, Nail the Fun, and a new look built on one belief: nail beauty should feel easy, expressive and never too serious.",
      cover: "girls-cherry-pop-blue.webp",
      images: [
        "girls-cherry-pop-blue.webp", "cherry-pop-girl-mini-kit.webp", "girls-multiproduct.webp",
        "evergreen-kv-cassis.webp", "cherry-pop-lamp-face.webp", "evergreen-usage-cassis.webp",
        "evergreen-bottles-in-hands.webp", "bogo-bottles-kv.webp", "cat-eye-kit-pouch.webp"
      ],
      videos: ["cherry-pop-on-the-go-train.mp4", "testimonial-es-cassis.mp4", "cherry-pop-on-the-go-trend.mp4"]
    },
    {
      slug: "fazit-2025",
      title: "Le Mini Macaron x Fazit",
      text: "All Dolled Up! is the first collection by Le Mini Macaron and Fazit, made for getting ready together before a night out: four exclusive shades, 3D nail stickers and freckles, all in a lunch box.",
      cover: "model-dollhouse-bottles.webp",
      images: ["model-dollhouse-bottles.webp", "model-bottle-confetti-crush.webp", "bundle-lifestyle-models.webp"],
      videos: ["out-in-2-days.mp4", "i-dont-think-we-should-be-together.mp4", "video-collage-all-models.mp4"]
    },
    {
      slug: "ooh-italy",
      title: "Le Mini Macaron | OOH Italy",
      text: "Out-of-home across Italy, in metro stations, streets and on digital screens: 450+ placements worth €60K, secured at no media cost, driving +70% website traffic in key cities and +144% sales.",
      cover: "bologna-4.webp",
      images: [
        "bologna-4.webp", "milan-duomo-metro-1.webp", "napoli-3.webp",
        "milan-cordusio.webp", "bologna-2025.webp", "street-screen-aug-2023.webp"
      ],
      videos: ["milan-duomo-metro-3.mp4", "bologna-2.mp4", "street-screens-dec-2023.mp4"]
    },
    {
      slug: "fall-2026",
      title: "Le Mini Macaron | Garden Daydream",
      text: "Garden Daydream is the fall 2026 collection, from pumpkin spice to bordeaux, launched with the new Blush gel kit and a shoot among baskets of apples.",
      cover: "kv-top-view.webp",
      images: [
        "kv-top-view.webp", "nail-art-hand-apples.webp", "mini-kit-blush.webp",
        "mini-kit-cassis.webp", "items-hands-usage.webp", "chrome-pen-silver-packaging.webp",
        "kv-main.webp", "items-apples-skirt.webp", "items-shoes.webp"
      ]
    },
    {
      slug: "cat-eye-2025",
      title: "Le Mini Macaron | Cat Eye Collection",
      text: "The Cat Eye Collection arrived in June 2025 with Solstice Soirée: magnetic shades that shift with a wave of the magnet, sent to creators with a shaker, martini glasses and a Cosmopolitan recipe.",
      cover: "03-mini-kit-shades-product-shot.webp",
      images: [
        "01-cat-eye-carousel.webp", "03-mini-kit-shades-product-shot.webp", "three-hands.webp",
        "05-cosmopolitan-lavender-haze-drink.webp", "hands-flash.webp"
      ],
      videos: ["bottles-drip.mp4", "cosmopolitan-recipe.mp4"],
      hide: ["drive-folder-sm.webp"]
    },
    {
      slug: "summer-2026",
      title: "Le Mini Macaron | Tropical Heat",
      text: "Tropical Heat is the summer 2026 collection: eight bright shades, from Mango to Blue Vanilla, and an invitation to skip the salon, because this summer your manicure is DIY.",
      cover: "dragon-fruit-hand-face.webp",
      images: [
        "dragon-fruit-tropi-teal-lamp-face.webp", "dragon-fruit-hand-face.webp", "bottles-fruit-hands.webp",
        "dragon-fruit-painting-curing.webp", "dragon-fruit-tropi-teal-hand-bottles.webp", "dragon-fruit-tropi-teal-pedi.webp",
        "maxi-kit-lifestyle.webp", "maxi-kit-items-hand.webp"
      ]
    },
    {
      slug: "spring-2026",
      title: "Le Mini Macaron | Macaron-core",
      text: "Macaron-core is the spring 2026 collection: pastel shades with a rebellious touch, from sheer Coquette to shimmering Pastel Riot and Mint Royale.",
      cover: "shoot-0785.webp",
      images: [
        "shoot-0785.webp", "shoot-0626.webp", "shoot-0649.webp",
        "hp-banner-2.webp", "shoot-0662.webp", "newsletter-visual.webp",
        "shoot-0749.webp", "mint-royale-brush-texture.webp", "pastel-riot-brush-texture.webp"
      ]
    },
    {
      slug: "goodnews-2023",
      title: "Le Mini Macaron x GoodNews",
      text: "Manis & Coffee: for one day in June 2023, Le Mini Macaron and GoodNews opened a pop-up in Barcelona, with free manicures, stickers on the cups and one motto, good coffee, good nails.",
      cover: "popup-01.webp",
      images: ["popup-01.webp", "popup-05.webp", "popup-03.webp"],
      videos: ["reel.mp4", "newsletter-es.mp4", "stickers-on-cups.mp4"]
    },
    {
      slug: "daise-2025",
      title: "Le Mini Macaron x DAISE",
      text: "After living side by side in Ulta Beauty baskets, Le Mini Macaron and DAISE made it official: a giveaway of head-to-toe routines and a free DAISE gift on orders of $65 or more.",
      cover: "kv-post.webp",
      images: ["kv-post.webp", { name: "homepage-mockup.webp", upright: true }, "instagram-post-mockup.webp"],
      videos: ["nail-art-video.mp4"]
    },
    {
      slug: "pr-brand-presentation",
      title: "Le Mini Macaron | Brand presentation",
      text: "A brand presentation inside a cake shop, with polishes on a tiered cake stand, manicure stations and guests getting their nails done.",
      cover: PHOTOS.presentation,
      images: [PHOTOS.presentation],
      videos: ["pr-brand-presentation.mp4"]
    },
    {
      slug: "pr-summer-collection",
      title: "Le Mini Macaron | Summer PR event",
      text: "The summer collection, presented at a picnic in an orchard: gingham tables, hay bales, string lights and pink Le Mini Macaron gift bags for the guests.",
      cover: "pr-summer-collection.mp4",
      videos: ["pr-summer-collection.mp4"]
    },
    {
      slug: "black-friday-2025",
      title: "Le Mini Macaron | Black Friday",
      text: "For Black Friday 2025, Le Mini Macaron turned its deals into breaking news across Europe and the US, with newspaper-style posters that people ended up taking home.",
      cover: "flash-sales.webp", focus: "50% 40%",
      images: ["flash-sales.webp", "poster-45-off-sitewide.webp", "posters-30-off-sitewide.webp"],
      videos: ["putting-up-posters.mp4", "people-taking-posters-home.mp4"]
    },
    {
      slug: "retail-milan",
      title: "Le Mini Macaron x Collanine Colorate",
      text: "An in-store workshop in Milan with Collanine Colorate: tables of bead jars and Le Mini Macaron polishes, where guests made their own jewelry and nail art.",
      cover: PHOTOS.collanine,
      images: [PHOTOS.collanine],
      videos: ["retail-milan.mp4"]
    },
    {
      slug: "retail-torino",
      title: "Le Mini Macaron | Retail event, Turin",
      text: "A holiday pop-up inside a Turin department store: a Le Mini Macaron corner full of gift sets, shoppers trying the kits and manicures at the table.",
      cover: PHOTOS.selfie,
      images: [PHOTOS.selfie],
      videos: ["retail-torino.mp4"]
    },
    {
      slug: "tezenis-2026",
      title: "Le Mini Macaron x Tezenis",
      text: "In March 2026, Tezenis stores across Spain gave away a Le Mini Macaron gel manicure kit with every purchase of two Natural Lifting Bras.",
      cover: "in-store-03.webp",
      images: ["in-store-03.webp", "in-store-04.webp", "in-store-01.webp", "in-store-02.webp"]
    },
    {
      slug: "fuorisalone-beko",
      title: "Beko | Fuorisalone",
      text: "At Fuorisalone, during Milan Design Week: an open-air Hotpoint kitchen among the skyscrapers, with live cooking and a pizza workshop for kids.",
      cover: PHOTOS.hotpoint,
      images: [PHOTOS.hotpoint],
      videos: ["fuorisalone-beko.mp4"]
    }
  ];
})();
