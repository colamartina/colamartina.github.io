/* =========================================================
   PROJECTS (the campaigns and the brand collabs) and EVENTS, in this order:
   the groups of the home page, the crumbs and the pager of a project page.
   A project is in one group only: the one it is listed in here, or else the
   one of its data file (projects: data/campaigns.js and collabs.js; events:
   data/events.js), after the listed ones, in the order of work/. On the home
   page each is a card (its cover of work/): the first ones are on show (six
   projects, three events), the others open under them with "See more". A card
   opens the project's own page, project.html?p=<slug>, told like a project
   page of work/: the pictures for the vibe, the title and the short text, then
   a folder for each kind of work it holds. Its group sets the look (projects
   on cream paper, events on the burgundy stage).

   The files, covers and texts come from work/projects.js (the same picks as
   work/) and data/*.js; here only what the home page and the project pages
   take of them:
     vibe     the pictures before the text (an event: beside it), by file name, any file of
              the project (without vibe: the photos and videos of the project on work/; an
              event: its first photo and its first video). The ones it leaves go to their folder
     row      the most pictures in one row of the vibe, e.g. 3 (without row: as many
              as fit at a good height)
     title, kicker, brand, partner   to replace the ones in data/*.js
     focus, zoom   its cover on its card: the part that stays, e.g. "50% 40%", and a closer cut
              around it, e.g. 1.15 (without: as on work/)
     card     the picture on its card instead of its cover, { src, widths, ratio } (files
              <src>-<width>.webp): the events' covers with their midtones lifted, or a photo
              the card alone holds, kept off the project page
     place    where it took place (an event: on its card, beside the name)
     by       the brand under the name on an event card, when brand is too long for it
     role     what she did on it, a few short lines: the Role row of the page's info, one line each
              (replaces the role in data/*.js; without: that one, if any)
     results  big numbers under the text: { value, label }
     folders  the folders to put first, in this order: { id, label, note, pick, beside }.
              A project page shows every folder of the project that holds a file, as many
              as it has: the ones not listed follow in the order of js/projects.js (ORDER:
              the idea and the look, the campaign or event itself, paid media, social media,
              UGC, e-commerce…), behind the scenes always last. Nothing listed here hides a file
               id      the folder on work/ (paid-ads, social, ugc, ecom, bts…),
                       or "photos" / "videos": the photos / videos of the project on work/
               label   its name here
               note    its note here; null: none (without note: the one in data/*.js)
               pick    the files it shows first, in this order (the others follow)
               beside  true: on a wide screen it shares a line with the folder
                       before it, when both fit at a good height
     show     files work/ hides that this page shows, by file name
   The files of a project's sticker folders (graphics, stickers, badges) are no folder:
   they lie around its page as stickers, to move around (js/projects.js, stickers()).
   ========================================================= */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.selection = {
  projects: [
    {
      slug: "rebranding-2026",
      // the packaging and the colours of the new identity were not hers: the shoot and the content of its launch were
      role: [
        "Art direction of the launch campaign shoot",
        "Photography moodboard, model and team management",
        "Paid ads content strategy",
        "Social media content creation",
        "UGC management"
      ],
      folders: [
        { id: "paid-ads", label: "Paid media" },
        { id: "social", label: "Social media", pick: ["cherry-pop-on-the-go-train.mp4", "whats-inside-cherry-pop.webp", "cherry-pop-on-the-go-trend.mp4", "new-rechargeable-lamp.webp", "post-15.webp", "post-16.webp", "post-17.webp"] },
        { id: "ugc", label: "UGC" },
        { id: "ecom", label: "E-commerce" },
        { id: "bts", label: "Behind the scenes", pick: ["bts-02.webp", "bts-03.webp", "bts-04.webp", "bts-01.webp"] }
      ]
    },
    {
      slug: "summer-2026",
      role: [
        "Campaign creative direction",
        "Photoshoot production",
        "Social media and paid ads content management"
      ],
      folders: [
        { id: "paid-ads", label: "Paid media" },
        { id: "social", label: "Social media", beside: true },
        { id: "ecom", label: "E-commerce" }
      ]
    },
    {
      slug: "ooh-italy",
      title: "OOH",
      kicker: "Italy, Spain & the US",
      role: [
        "End-to-end project management",
        "Communication strategy",
        "Creative direction"
      ],
      // the six videos open the project, in one row on a wide screen; the photos follow the text, Italy, Spain and the US mixed
      vibe: [
        "milan-duomo-metro-3.mp4", "bologna-2.mp4", "milan-duomo-metro-2.mp4",
        "bologna-1.mp4", "street-screens-dec-2023.mp4", "bologna-5.mp4"
      ],
      results: [
        { value: "€60K", label: "media value, secured at no media cost" },
        { value: "450+", label: "placements" },
        { value: "+70%", label: "website traffic in key cities" },
        { value: "+144%", label: "sales growth" }
      ],
      folders: [
        { id: "photos", label: "Placements" }
      ]
    },
    // then the brand collabs and Garden Daydream: six on show
    {
      // her card a little closer, on the face and the two bottles
      slug: "fazit-2025",
      focus: "50% 42%",
      zoom: 1.15,
      role: [
        "Support on campaign execution and photoshoot",
        "Influencer and social media strategy"
      ]
    },
    {
      slug: "daise-2025",
      role: [
        "Support on campaign execution",
        "Project management",
        "Influencer and social media strategy"
      ]
    },
    {
      slug: "fall-2026",
      role: [
        "Campaign creative direction",
        "Photoshoot production",
        "Content management and editing for social media and paid ads"
      ]
    },
    // behind "See more", in the order of work/
    {
      // her folders as they are: the shoot (photos and two videos) for the vibe, then the teaser, the influencer
      // seeding, the website and the behind the scenes (the stickers lie around the page)
      slug: "cat-eye-2025",
      role: [
        "Support on art direction",
        "Social media strategy",
        "Supervision of influencer strategy and PR"
      ],
      vibe: [
        "01-cat-eye-carousel.webp", "03-mini-kit-shades-product-shot.webp", "three-hands.webp",
        "05-cosmopolitan-lavender-haze-drink.webp", "hands-flash.webp", "bottles-drip.mp4", "02-moodboard-all-shades.mp4"
      ]
    },
    {
      slug: "spring-2026",
      role: [
        "Campaign creative direction",
        "Photoshoot production",
        "Social media and paid ads content management"
      ]
    },
    {
      // the posters for the vibe; the two videos from the street (up on the walls, taken home) follow the text
      slug: "black-friday-2025",
      role: ["Art direction", "Content creation"],
      vibe: ["flash-sales.webp", "poster-45-off-sitewide.webp", "posters-30-off-sitewide.webp"]
    }
  ],
  // the event cards show their covers a little brighter, like the project covers (asked 2026-09-18): a copy of each with
  // its midtones lifted (one gamma curve per photo, 0.8–0.92, black and white kept, so nothing clips), made from the
  // largest copy with ffmpeg (lutrgb gammaval, lanczos) and cwebp -q 90; the project pages keep the photos as they are.
  // A card may hold a photo of its own instead (Fuorisalone): already as bright as the lifted ones, so it is untouched
  events: [
    {
      slug: "retail-milan",
      title: "Collanine Colorate",
      kicker: "Retail event",
      place: "Milan",
      brand: "Le Mini Macaron × Collanine Colorate",
      by: "Le Mini Macaron",
      role: ["End-to-end event management"],
      card: { src: "content/events/retail-milan/bead-table-photo-bright", widths: [640, 1159], ratio: 0.75 }
    },
    {
      // its card holds a photo of its own, the pizza workshop (it is not on the project page)
      slug: "fuorisalone-hotpoint",
      kicker: "Milan Design Week",
      place: "Milan",
      role: ["Support on event management"],
      card: { src: "content/events/fuorisalone-hotpoint/card-pizza-workshop", widths: [640, 1280, 1920], ratio: 0.8 }
    },
    {
      // the Manis & Coffee pop-up in Barcelona (its text on work/), from data/collabs.js. On the stage the white "good
      // coffee good nails" reads, so it is one of its stickers here (work/ hides it: its page is white); the note of
      // the newsletter in data/collabs.js is a working note
      slug: "goodnews-2023",
      place: "Barcelona",
      role: ["Project management", "Event management", "Support on art direction"],
      show: ["good-coffee-good-nails.webp"],
      folders: [
        { id: "popup" },
        { id: "newsletter", note: null }
      ],
      card: { src: "content/collabs/goodnews-2023/gallery/popup-01-bright", widths: [640, 1280, 1920], ratio: 0.75 }
    },
    // behind "See more"
    {
      // the launch of the spring collection (she set it right on 2026-11-07: it had been called the summer one); the
      // slug and the folder keep the old name
      slug: "pr-summer-collection",
      role: ["End-to-end event management"],
      card: { src: "content/events/pr-summer-collection/video-poster-bright", widths: [720], ratio: 0.5625 }
    },
    {
      // the gift with purchase in Tezenis stores across Spain (its text on work/); kicker: its type in data/collabs.js
      slug: "tezenis-2026",
      kicker: "Retail promotion",
      place: "Spain",
      role: ["Project management"],
      card: { src: "content/collabs/tezenis-2026/in-store/in-store-03-bright", widths: [640, 1280, 1920], ratio: 0.75 }
    },
    {
      // the presentation of Le Sweet Line (she named it on 2026-11-07); the slug and the folder keep the old name
      slug: "pr-brand-presentation",
      role: ["Event management"],
      card: { src: "content/events/pr-brand-presentation/window-display-bright", widths: [640, 1280, 1920], ratio: 0.75 }
    },
    {
      // data/events.js has Torino as its kicker and its place: the kicker from its text on work/
      slug: "retail-torino",
      kicker: "Holiday pop-up",
      place: "Turin",
      role: ["Event management"],
      card: { src: "content/events/retail-torino/mirror-selfie-bright", widths: [640, 1280, 1920], ratio: 0.75 }
    }
  ]
};
