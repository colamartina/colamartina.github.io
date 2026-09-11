/* =========================================================
   EVENTS — one slide per event: the vertical video on one side,
   the text on the other. Scrolling moves from slide to slide.
   Order here = order on the site.

   Texts: null = still to write (shown as [TODO] on the working copy,
   hidden on the published site). Titles come from the original file
   names; the dates in "todo" are what the video files carry in their
   metadata — to be confirmed, not published.
   ========================================================= */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.events = [
  {
    slug: "pr-brand-presentation",
    title: "PR Event",
    kicker: "Brand presentation",
    brand: "Le Mini Macaron",
    place: null,
    date: null,
    text: null,
    video: {
      type: "video",
      src: "content/events/pr-brand-presentation/video.mp4",
      poster: "content/events/pr-brand-presentation/video-poster.webp",
      ratio: 0.5625,
      duration: 23.8,
      name: "pr-brand-presentation.mp4"
    },
    todo: ["Nome, luogo e data dell'evento?", "Cosa hai fatto (2–3 righe)?", "Metadati del video: 26/04/2024, da confermare."]
  },
  {
    slug: "pr-summer-collection",
    title: "PR Event",
    kicker: "Summer collection",
    brand: "Le Mini Macaron",
    place: null,
    date: null,
    text: null,
    video: {
      type: "video",
      src: "content/events/pr-summer-collection/video.mp4",
      poster: "content/events/pr-summer-collection/video-poster.webp",
      ratio: 0.5625,
      duration: 22.23,
      name: "pr-summer-collection.mp4"
    },
    todo: ["Nome, luogo e data dell'evento?", "Cosa hai fatto (2–3 righe)?", "Metadati del video: 14/05/2024, da confermare."]
  },
  {
    slug: "retail-milan",
    title: "Retail Event",
    kicker: "Milan",
    brand: "Le Mini Macaron",
    place: "Milan",
    date: null,
    text: null,
    video: {
      type: "video",
      src: "content/events/retail-milan/video.mp4",
      poster: "content/events/retail-milan/video-poster.webp",
      ratio: 0.5625,
      duration: 27.33,
      name: "retail-milan.mp4"
    },
    todo: ["In quale negozio?", "Cosa hai fatto (2–3 righe)?", "Metadati del video: 14/10/2024, da confermare.",
           "È questo l'evento 'Beauty × Jewelry' del vecchio sito (+250% visibility)? In quel caso ho già il testo da riusare."]
  },
  {
    slug: "retail-torino",
    title: "Retail Event",
    kicker: "Torino",
    brand: "Le Mini Macaron",
    place: "Torino",
    date: null,
    text: null,
    video: {
      type: "video",
      src: "content/events/retail-torino/video.mp4",
      poster: "content/events/retail-torino/video-poster.webp",
      ratio: 0.5625,
      duration: 21.93,
      name: "retail-torino.mp4"
    },
    todo: ["In quale negozio?", "Cosa hai fatto (2–3 righe)?", "Metadati del video: 12/12/2023, da confermare."]
  },
  {
    slug: "fuorisalone-beko",
    title: "Fuorisalone",
    kicker: "Beko",
    brand: "Beko",
    place: null,
    date: null,
    text: null,
    video: {
      type: "video",
      src: "content/events/fuorisalone-beko/video.mp4",
      poster: "content/events/fuorisalone-beko/video-poster.webp",
      ratio: 0.5625,
      duration: 32.1,
      name: "fuorisalone-beko.mp4"
    },
    todo: ["Non è un evento Le Mini Macaron: nel video compare il marchio Hotpoint.",
           "Qual è stato il tuo ruolo, e in che anno? Freelance con TandEM?",
           "Metadati del video: 30/04/2026, da confermare."]
  }
];
