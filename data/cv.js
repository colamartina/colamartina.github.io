/* =========================================================
   CV — a snapshot of the PDF for the Curriculum section of the home page (#cv),
   set small and tight like a printed resume. The full text stays in the PDF
   (pdf, below), downloadable from the button under the sheet. Nothing here is
   new: every line is a shortened version of the PDF.
   In the points, **bold** marks the figures.
   ========================================================= */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.cv = {
  name: "Martina Cola",
  role: "Global Brand & Creative Marketing Manager",
  sub: "Multimarket EU & US · Paid media & content strategy",
  location: "Barcelona, Spain",
  email: "colamartina@gmail.com",
  linkedin: { label: "LinkedIn", url: "https://www.linkedin.com/in/martina-cola-/" },
  site: null, // [TODO] waiting for Martina's own domain
  pdf: "assets/Martina-Cola-CV.pdf",

  /* on the sheet: the portrait (content/cv/portrait-<width>.webp, from IMG_8414, 4:5 crop)
     held by Martina's red binder clip (redpin.jpg, cut out of its background) */
  photo: { src: "content/cv/portrait", widths: [480, 960], ratio: 4 / 5, caption: "hi, it’s me!" },
  clip: { src: "assets/binder-clip.webp", width: 320, height: 411 },

  experience: [
    {
      dates: "Oct 2022 — Present",
      city: "Barcelona",
      role: "Global Marketing & Content Manager",
      company: "Le Mini Macaron",
      note: "Global nail beauty brand at ULTA, Sephora & Douglas",
      points: [
        "Lead global social media, influencer marketing and creative campaigns across Europe and the US, managing a team of 3.",
        "Manage paid and organic media across Europe (IT, FR & ES) and the US, achieving **+50% ROAS** and improving conversion.",
        "Lead the creative production of photoshoots, from concept and briefing to styling direction and assets for social, e‑commerce and retail.",
        "Lead brand activations and events, generating strong media coverage and **+200% retailer orders** post‑event.",
        "Support rebranding projects and go‑to‑market strategies, contributing to **+15% MoM growth** in social reach."
      ]
    },
    {
      dates: "Jan — Jul 2019",
      city: "Fabriano, Italy",
      role: "Event Management Assistant",
      company: "TandEM",
      note: "Travel & Event Management",
      points: [
        "Supported the planning and execution of B2B and B2C events.",
        "Managed on‑site operations at an international UNESCO event, leading a team of 15."
      ]
    }
  ],

  education: [
    { dates: "2022", city: "Barcelona", title: "Master in Digital Marketing & E‑commerce", school: "EAE Business School · minor in Adobe InDesign" },
    { dates: "2021", city: "Urbino, Italy", title: "Bachelor’s in Business & Foreign Languages", school: "Università degli Studi di Urbino" }
  ],

  languages: [
    { name: "Italian", level: "Native" },
    { name: "Spanish", level: "C2" },
    { name: "English", level: "C2" },
    { name: "French", level: "B2" },
    { name: "Catalan", level: "A2" },
    { name: "German", level: "A2" }
  ],

  /* the skills are coloured stickers — colours from the sticker palette in styles.css:
     cobalt, electric, acid, orange, burgundy, white */
  skills: [
    { label: "Brand management", colour: "cobalt" },
    { label: "Social media", colour: "acid" },
    { label: "Influencer & PR", colour: "orange" },
    { label: "Paid media", colour: "white" },
    { label: "Performance marketing", colour: "burgundy" },
    { label: "Content production", colour: "electric" },
    { label: "E‑commerce", colour: "acid" },
    { label: "Go‑to‑market", colour: "cobalt" },
    { label: "Short‑form content", colour: "orange" },
    { label: "AI workflows", colour: "white" }
  ],
  tools: ["Meta", "Google Ads", "TikTok Shop", "Shopify", "GA4", "Figma", "InDesign", "Photoshop", "Canva", "Notion"],

  todo: [
    "Indirizzo del sito nei contatti: aspetto il tuo dominio, poi lo metto qui.",
    "Telefono: per ora lasciato fuori, come mi hai detto.",
    "Il PDF scaricabile è quello vecchio: non contiene ancora le 3 nuove skill (short-form content, go-to-market, AI workflow)."
  ]
};
