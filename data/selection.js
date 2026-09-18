/* =========================================================
   PROJECTS — Campaign and Events, in this order. On the home page each is a
   card (its cover of work/): the first three are on show, the others open
   under them with "See more". A project of work/ not listed here comes after
   the listed ones, in the order of work/. A card opens the project's own
   page, project.html?p=<slug>, told like a project page of work/: the
   pictures for the vibe, the title and the short text, then the folders one
   after the other.

   The files, covers and texts come from work/projects.js (the same picks as
   work/) and data/*.js; here only what the home page and the project pages
   take of them:
     vibe     the pictures before the text, by file name (without vibe: the photos and
              videos of the project on work/)
     row      the most pictures in one row of the vibe, e.g. 3 (without row: as many
              as fit at a good height)
     title, kicker, brand   to replace the ones in data/*.js
     place    where it took place (an event: on its card, beside the name)
     by       the brand under the name on an event card, when brand is too long for it
     results  big numbers under the text: { value, label }
     folders  in this order: { id, label, note, pick, beside } (without folders: every
              folder of the project on work/, paid media first, behind the scenes last)
               id      the folder on work/ (paid-ads, social, ugc, ecom, bts),
                       or "photos": the photos of the project on work/
               label   its name here
               pick    the files it shows, in this order (without pick: all)
               beside  true: on a wide screen it shares a line with the folder
                       before it, when both fit at a good height
   ========================================================= */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.selection = {
  campaigns: [
    {
      slug: "rebranding-2026",
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
      // the six videos open the project, three a row, as on work/; the photos follow the text, Italy, Spain and the US mixed
      vibe: [
        "milan-duomo-metro-3.mp4", "bologna-2.mp4", "milan-duomo-metro-2.mp4",
        "bologna-1.mp4", "street-screens-dec-2023.mp4", "bologna-5.mp4"
      ],
      row: 3,
      results: [
        { value: "€60K", label: "media value, secured at no media cost" },
        { value: "450+", label: "placements" },
        { value: "+70%", label: "website traffic in key cities" },
        { value: "+144%", label: "sales growth" }
      ],
      folders: [
        { id: "photos", label: "Placements" }
      ]
    }
  ],
  events: [
    {
      slug: "retail-milan",
      title: "Collanine Colorate",
      kicker: "Retail event",
      place: "Milan",
      brand: "Le Mini Macaron × Collanine Colorate",
      by: "Le Mini Macaron"
    },
    {
      slug: "fuorisalone-beko",
      kicker: "Milan Design Week",
      place: "Milan"
    },
    {
      // named "PR Event — Spring Collection" in the brief: the files only hold this one, the summer collection
      slug: "pr-summer-collection"
    },
    // behind "See more", in the order of work/
    {
      slug: "pr-brand-presentation"
    },
    {
      // data/events.js has Torino as its kicker and its place: the kicker from its text on work/
      slug: "retail-torino",
      kicker: "Holiday pop-up",
      place: "Turin"
    }
  ]
};
