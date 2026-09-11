/* =========================================================
   CV — the content of the current CV page and of the PDF, nothing added.
   Rendered as the Curriculum section of the home page (#cv).
   The three new skills asked for in the brief are marked isNew: true.
   ========================================================= */
window.PORTFOLIO = window.PORTFOLIO || {};

window.PORTFOLIO.cv = {
  name: "Martina Cola",
  role: "Global Brand & Creative Marketing Manager",
  sub: "Multimarket EU & US experience · Paid media and content strategy",
  location: "Barcelona, Spain",
  email: "colamartina@gmail.com",
  linkedin: { label: "LinkedIn", url: "https://www.linkedin.com/in/martina-cola-/" },
  site: null, // [TODO] which address? colamartina.github.io
  pdf: "assets/Martina-Cola-CV.pdf",

  profile: [
    "Creative marketing professional leading global campaigns, content productions and brand activations within the beauty & FMCG industry.",
    "Passionate about branding, visual storytelling and digital culture — with strong experience translating creative ideas into high-impact campaigns across social media, retail, e-commerce and PR.",
    "Experienced in managing photoshoots, creator collaborations and cross-functional projects across Europe and the US — coordinating internal teams, agencies and external production partners from concept to execution."
  ],

  experience: [
    {
      company: "Le Mini Macaron",
      role: "Global Marketing & Content Manager",
      note: "Global nail beauty brand at ULTA, Sephora & Douglas",
      city: "Barcelona",
      dates: "Oct 2022 — Present",
      bullets: [
        "Lead global social media, influencer marketing and creative campaigns across Europe and the US — managing a team of three and ensuring consistent brand execution across markets.",
        "Manage paid and organic media strategies across Europe (IT, FR & ES) and the US — achieving +50% ROAS and improving conversion performance.",
        "Lead the creative development and production of photoshoots — concept creation, briefing, styling direction, asset planning and execution across social media, e-commerce, newsletters, retailer assets and product launches.",
        "Lead brand activations and events — generating strong media coverage and a +200% increase in retailer orders post-event.",
        "Support brand development initiatives, including rebranding projects and go-to-market strategies — contributing to +15% MoM growth in social reach.",
        "Coordinate external partners — agencies, influencers and retailers — managing timelines, budgets and deliverables across multiple markets."
      ]
    },
    {
      company: "TandEM",
      role: "Event Management Assistant",
      note: "Travel & Event Management",
      city: "Fabriano, Italy",
      dates: "Jan 2019 — Jul 2019",
      bullets: [
        "Supported the planning and execution of multiple B2B and B2C events — ensuring smooth coordination and client satisfaction.",
        "Managed on-site operations during an international UNESCO event, leading a team of 15 to serve delegates from around the world.",
        "Assisted with logistics, vendor coordination and client communication to guarantee seamless event experiences."
      ]
    }
  ],

  education: [
    {
      school: "EAE Business School",
      title: "Master in Digital Marketing & E-Commerce",
      note: "with a minor in Adobe InDesign",
      city: "Barcelona",
      dates: "2022"
    },
    {
      school: "Università degli Studi di Urbino",
      title: "Bachelor's in Business & Foreign Languages",
      note: null,
      city: "Urbino, Italy",
      dates: "2021"
    }
  ],

  languages: [
    { name: "Italian", level: "Native" },
    { name: "Spanish", level: "C2" },
    { name: "English", level: "C2" },
    { name: "French", level: "B2" },
    { name: "Catalan", level: "A2" },
    { name: "German", level: "A2" }
  ],

  /* skills become the draggable stickers — size: lg / md / sm */
  skills: [
    { label: "Brand Management", size: "lg", colour: "cobalt" },
    { label: "Social Media", size: "lg", colour: "pink" },
    { label: "Performance Marketing", size: "md", colour: "lemon" },
    { label: "Influencer & PR", size: "lg", colour: "lilac" },
    { label: "E-commerce", size: "md", colour: "tomato" },
    { label: "Paid Media Strategy", size: "lg", colour: "lemon" },
    { label: "Copywriting & SEO", size: "md", colour: "cobalt" },
    { label: "Short-form content strategy", size: "lg", colour: "pink", isNew: true },
    { label: "Go-to-market strategy", size: "lg", colour: "lemon", isNew: true },
    { label: "AI workflow design", size: "lg", colour: "lilac", isNew: true },
    { label: "Shopify", size: "sm", colour: "lilac" },
    { label: "Google Ads", size: "sm", colour: "cobalt" },
    { label: "Meta", size: "sm", colour: "pink" },
    { label: "TikTok Shop", size: "sm", colour: "lemon" },
    { label: "GA4", size: "sm", colour: "tomato" },
    { label: "Figma", size: "sm", colour: "cobalt" },
    { label: "Adobe InDesign", size: "sm", colour: "lilac" },
    { label: "Photoshop", size: "sm", colour: "pink" },
    { label: "Canva", size: "sm", colour: "lemon" },
    { label: "WordPress", size: "sm", colour: "tomato" },
    { label: "AI Tools", size: "sm", colour: "cobalt" },
    { label: "Notion", size: "sm", colour: "lilac" },
    { label: "Microsoft Office", size: "sm", colour: "pink" },
    { label: "Communication", size: "md", colour: "tomato" },
    { label: "Creativity & Innovation", size: "md", colour: "lemon" },
    { label: "Collaborative Leadership", size: "md", colour: "cobalt" },
    { label: "Attention to Detail", size: "md", colour: "pink" },
    { label: "Analytical Thinking", size: "md", colour: "lilac" }
  ],

  todo: [
    "Indirizzo del sito da mostrare nei contatti: colamartina.github.io?",
    "Telefono e foto: per ora lasciati fuori, come mi hai detto.",
    "Il PDF scaricabile è quello vecchio: non contiene ancora le 3 nuove skill."
  ]
};
