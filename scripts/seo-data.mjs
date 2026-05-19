export const SITE_URL = "https://isaacseiler.xyz";
export const SITE_NAME = "Isaac Seiler";
export const SITE_DESCRIPTION =
  "Isaac Seiler is a Fulbright Scholar, Truman Scholar, and OpenAI ChatGPT Lab member working across AI education, public technology, journalism, communications, and research.";
export const CONTACT_EMAIL = "isaaciseiler@gmail.com";
export const PREVIEW_IMAGE = {
  url: "/webpreview-linkedin.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Isaac Seiler portfolio preview image",
};

const PROJECT_IMG_BASE = "https://pub-fa8ebd83ba8d4bf99e2e7f12e394fc2f.r2.dev";
const projectCardImages = {
  aiIndex: `${PROJECT_IMG_BASE}/aiindex.png`,
  aiNews: `${PROJECT_IMG_BASE}/ainews.png`,
  charging: `${PROJECT_IMG_BASE}/charging.png`,
  chatLab: `${PROJECT_IMG_BASE}/chatlab.jpeg`,
  capHill: "/experience/potus.jpeg",
};

export const SAME_AS = [
  "https://www.linkedin.com/in/isaacseiler/",
  "https://substack.com/@isaacseiler",
  "https://github.com/isaaciseiler-beep",
  "https://chatgpt.com/100chats-project",
  "https://edunewsletter.openai.com/p/top-chats-from-the-fulbright-taiwan",
];

export const topLevelPages = [
  {
    path: "/",
    navTitle: "Home",
    title: "Isaac Seiler | AI, Public Technology, Communications, and Fulbright Work",
    description: SITE_DESCRIPTION,
    priority: "1.0",
    changefreq: "weekly",
    image: PREVIEW_IMAGE,
    keywords: [
      "Isaac Seiler",
      "OpenAI ChatGPT Lab",
      "Fulbright Scholar",
      "Truman Scholar",
      "AI education",
      "public technology",
      "AI communications",
    ],
  },
  {
    path: "/projects",
    navTitle: "Projects",
    title: "Projects | Isaac Seiler",
    description:
      "Research, AI education, public policy, journalism, campaign communications, and strategy projects by Isaac Seiler.",
    priority: "0.95",
    changefreq: "weekly",
    image: { url: projectCardImages.chatLab },
    keywords: [
      "Isaac Seiler projects",
      "ChatGPT Lab",
      "OpenAI for Education",
      "AI state government index",
      "AI journalism research",
      "Fulbright Taiwan",
    ],
  },
  {
    path: "/experience",
    navTitle: "Experience",
    title: "Experience | Isaac Seiler",
    description:
      "Isaac Seiler's experience across OpenAI's ChatGPT Lab, Fulbright Taiwan, the Council of State Governments, Boehringer Ingelheim, Congress, campaigns, and journalism.",
    priority: "0.86",
    changefreq: "monthly",
    image: { url: "/experience/oai.jpg" },
    keywords: [
      "Isaac Seiler resume",
      "OpenAI ChatGPT Lab",
      "Fulbright Taiwan",
      "Council of State Governments",
      "Boehringer Ingelheim",
      "U.S. House of Representatives",
    ],
  },
  {
    path: "/credentials",
    navTitle: "Credentials",
    title: "Credentials | Isaac Seiler",
    description:
      "A concise profile of Isaac Seiler's AI, public service, communications, research, Fulbright, Truman, and OpenAI credentials.",
    priority: "0.84",
    changefreq: "monthly",
    image: PREVIEW_IMAGE,
    keywords: [
      "Isaac Seiler credentials",
      "Fulbright Scholar",
      "Truman Scholar",
      "Rhodes finalist",
      "OpenAI ChatGPT Lab",
    ],
  },
  {
    path: "/photos",
    navTitle: "Photos",
    title: "Photos | Isaac Seiler",
    description:
      "Travel photography by Isaac Seiler, with albums from Taiwan, Japan, Hong Kong, Iceland, Australia, New Zealand, Portugal, Thailand, Vietnam, Korea, and more.",
    priority: "0.82",
    changefreq: "weekly",
    image: {
      url: "https://pub-9c24f6ce599b4e09bac5241fc8f8beb0.r2.dev/Taiwan/14BC8F70-A1CE-4D79-8FBE-665B57EB131F_1_105_c.jpeg",
      alt: "Taiwan travel photography by Isaac Seiler",
    },
    keywords: [
      "Isaac Seiler photos",
      "travel photography",
      "Taiwan photography",
      "Asia travel photos",
      "photo portfolio",
    ],
  },
  {
    path: "/photos/map",
    navTitle: "Photo Map",
    title: "Photo Map | Isaac Seiler",
    description:
      "An interactive map for browsing Isaac Seiler's travel photography by place, album, and geography.",
    priority: "0.68",
    changefreq: "monthly",
    image: {
      url: "https://pub-9c24f6ce599b4e09bac5241fc8f8beb0.r2.dev/HongKong/0DB78A6E-A136-4224-8880-E388B1210176_1_105_c.jpeg",
      alt: "Mapped travel photography by Isaac Seiler",
    },
    keywords: [
      "Isaac Seiler photo map",
      "mapped photography",
      "travel photo map",
      "photo locations",
    ],
  },
];

export const projectSeo = {
  "fulbright-focus-group-sponsored-by-openai": {
    title: "Fulbright Taiwan ChatGPT Lab with OpenAI Support | Isaac Seiler",
    description:
      "Isaac Seiler founded and led the Fulbright Taiwan ChatGPT Lab, an OpenAI-supported educator lab focused on practical, responsible ChatGPT use cases in education.",
    image: {
      url: "/seo/projects/fulbright-focus-group-sponsored-by-openai.jpg",
      alt: "Fulbright Taiwan ChatGPT Lab and OpenAI education project preview",
    },
    keywords: [
      "ChatGPT Lab",
      "OpenAI for Education",
      "ChatGPT for Education",
      "Fulbright Taiwan",
      "Fulbright ChatGPT Lab",
      "OpenAI education newsletter",
      "AI in education",
      "teacher AI training",
      "100 Chats Project",
    ],
    about: ["OpenAI", "ChatGPT", "Fulbright Taiwan", "AI education", "teacher training"],
    sameAs: ["https://edunewsletter.openai.com/p/top-chats-from-the-fulbright-taiwan"],
  },
  "artificial-intelligence-in-state-government-index": {
    title: "Artificial Intelligence in State Government Index | Isaac Seiler",
    description:
      "A public benchmark by Isaac Seiler measuring generative AI adoption, training, governance, pilots, transparency, and preparedness across U.S. states and territories.",
    image: {
      url: "/seo/projects/artificial-intelligence-in-state-government-index.jpg",
      alt: "Artificial Intelligence in State Government Index project preview",
    },
    keywords: [
      "AI state government index",
      "generative AI government",
      "state AI governance",
      "Council of State Governments",
      "GenAI preparedness",
      "public sector AI",
      "AI policy benchmark",
    ],
    about: ["generative AI", "state government", "AI governance", "public policy"],
  },
  "congressional-office-setup-100-day-report": {
    title: "Congressional Office Setup and 100 Day Report | Isaac Seiler",
    description:
      "Isaac Seiler helped stand up a new congressional office and produced early systems, staffing, metrics, communications, and first-100-day reporting.",
    image: {
      url: "/seo/projects/congressional-office-setup-100-day-report.jpg",
      alt: "Congressional Office Setup and 100 Day Report project preview",
    },
    keywords: [
      "congressional office setup",
      "100 day report",
      "Capitol Hill communications",
      "House office operations",
      "public service communications",
    ],
    about: ["Congress", "communications", "public service", "operations"],
  },
  "senior-thesis-local-journalism": {
    title: "AI Platforms and Journalism Research | Isaac Seiler",
    description:
      "Isaac Seiler's honors thesis analyzed AI, digital platforms, local journalism, democratic accountability, media policy, and newsroom labor through qualitative interviews.",
    image: {
      url: "/seo/projects/senior-thesis-local-journalism.jpg",
      alt: "AI platforms and local journalism honors thesis project preview",
    },
    keywords: [
      "AI journalism research",
      "AI platforms journalism",
      "local journalism thesis",
      "digital platforms",
      "media policy",
      "Australia journalism",
      "qualitative interviews",
    ],
    about: ["AI", "journalism", "digital platforms", "local news", "media policy"],
  },
  "electric-vehicle-access-analysis": {
    title: "Electric Vehicle Charging Access Analysis | Isaac Seiler",
    description:
      "A GIS and quantitative analysis project by Isaac Seiler examining EV charging infrastructure access, charger density, income, race, and transportation equity.",
    image: {
      url: "/seo/projects/electric-vehicle-access-analysis.jpg",
      alt: "Electric Vehicle Charging Access Analysis project preview",
    },
    keywords: [
      "EV charging access",
      "electric vehicle infrastructure",
      "GIS EV charging",
      "transportation equity",
      "charger density",
      "spatial analysis",
    ],
    about: ["electric vehicles", "GIS", "transportation infrastructure", "equity analysis"],
  },
  "boehringer-cares-foundation-rebrand-strategy-shift": {
    image: {
      url: "/seo/projects/boehringer-cares-foundation-rebrand-strategy-shift.jpg",
      alt: "Boehringer Cares Foundation rebrand and strategy project preview",
    },
    keywords: [
      "Boehringer Cares Foundation",
      "foundation rebrand",
      "CSR communications",
      "employee volunteering",
      "communications strategy",
    ],
    about: ["brand strategy", "foundation communications", "CSR", "UX"],
  },
  "political-reporting-at-washu": {
    image: {
      url: "/seo/projects/political-reporting-at-washu.jpg",
      alt: "Political Reporting at WashU project preview",
    },
    keywords: [
      "WashU political reporting",
      "student journalism",
      "campus politics",
      "free speech",
      "student protest reporting",
    ],
    about: ["journalism", "campus politics", "WashU", "student media"],
  },
  "communications-consultancy-supporting-local-candidates": {
    image: {
      url: "/seo/projects/communications-consultancy-supporting-local-candidates.jpg",
      alt: "Campaign communications consultancy project preview",
    },
    keywords: [
      "campaign communications",
      "local candidate website",
      "digital strategy",
      "rapid response communications",
      "Tustin school board campaign",
    ],
    about: ["campaigns", "communications", "local elections", "digital strategy"],
  },
  "2022-institute-for-nonprofit-news-index-survey": {
    image: {
      url: "/seo/projects/2022-institute-for-nonprofit-news-index-survey.jpg",
      alt: "Institute for Nonprofit News Index Survey project preview",
    },
    keywords: [
      "Institute for Nonprofit News",
      "INN Index",
      "nonprofit news research",
      "survey synthesis",
      "journalism data",
    ],
    about: ["nonprofit journalism", "survey research", "newsrooms", "media economics"],
  },
  "exclusive-interview-with-high-visibility-congressperson": {
    image: {
      url: "/seo/projects/exclusive-interview-with-high-visibility-congressperson.jpg",
      alt: "Exclusive political interview reporting project preview",
    },
    keywords: [
      "Peter Meijer interview",
      "political reporting",
      "Congress interview",
      "impeachment vote",
      "Calvin Chimes",
    ],
    about: ["political reporting", "Congress", "interview journalism"],
  },
  "sustainable-development-health-access-report": {
    image: {
      url: "/seo/projects/sustainable-development-health-access-report.jpg",
      alt: "Sustainable Development and Health Access Report project preview",
    },
    keywords: [
      "health access report",
      "sustainable development communications",
      "Boehringer Ingelheim",
      "SDX",
      "corporate sustainability strategy",
    ],
    about: ["health access", "sustainable development", "communications strategy"],
  },
  "ai-literacy-workshop-for-educators": {
    title: "AI Literacy Workshop for Educators | Isaac Seiler",
    description:
      "A conference-style educator workshop by Isaac Seiler translating AI, LLMs, prompt design, classroom use cases, and verification habits into practical teaching workflows.",
    keywords: [
      "AI literacy workshop",
      "AI for educators",
      "teacher AI training",
      "ChatGPT classroom",
      "LLM fundamentals",
      "AI presentation",
    ],
    about: ["AI education", "teacher training", "large language models", "classroom AI"],
  },
  "stl-immigrant-refugee-support-grant-process": {
    title: "St. Louis Immigrant and Refugee Support Grant Process | Isaac Seiler",
    description:
      "A student-led philanthropy process by Isaac Seiler's WashU team evaluating and supporting St. Louis immigrant and refugee-serving nonprofits.",
    keywords: [
      "St. Louis immigrant refugee support",
      "Philanthropy Lab",
      "Casa de Salud",
      "WashU philanthropy",
      "student grantmaking",
    ],
    about: ["philanthropy", "St. Louis", "immigrant support", "nonprofits"],
  },
  "first-personal-website": {
    title: "First Personal Website | Isaac Seiler",
    description:
      "Isaac Seiler's first hand-built personal portfolio project, created to learn Git, frontend development, content modeling, databases, and deployment.",
    keywords: [
      "Isaac Seiler first website",
      "portfolio website",
      "frontend development",
      "personal website",
      "Git learning project",
    ],
    about: ["web development", "portfolio design", "frontend development"],
  },
};

export const priorityImages = [
  {
    id: "isaac-seiler-home-preview",
    url: "/webpreview-linkedin.png",
    page: "/",
    title: "Isaac Seiler",
    alt: "Isaac Seiler portfolio preview image",
    caption:
      "Primary image for Isaac Seiler, Fulbright Scholar, Truman Scholar, and OpenAI ChatGPT Lab member.",
  },
  {
    id: "fulbright-chatgpt-lab-openai",
    url: projectCardImages.chatLab,
    page: "/projects/fulbright-focus-group-sponsored-by-openai",
    title: "Fulbright Taiwan ChatGPT Lab with OpenAI Support",
    alt: "Fulbright Taiwan ChatGPT Lab and OpenAI education project preview",
    caption:
      "Isaac Seiler founded and led an OpenAI-supported Fulbright Taiwan ChatGPT Lab for educators.",
  },
  {
    id: "ai-state-government-index",
    url: projectCardImages.aiIndex,
    page: "/projects/artificial-intelligence-in-state-government-index",
    title: "Artificial Intelligence in State Government Index",
    alt: "Artificial Intelligence in State Government Index project preview",
    caption:
      "A public benchmark measuring generative AI adoption across U.S. states and territories.",
  },
  {
    id: "congressional-office-100-day-report",
    url: projectCardImages.capHill,
    page: "/projects/congressional-office-setup-100-day-report",
    title: "Congressional Office Setup and 100 Day Report",
    alt: "Congressional Office Setup and 100 Day Report project preview",
    caption:
      "Systems, staffing, communications, and metrics used to launch a new congressional office.",
  },
  {
    id: "ai-platforms-journalism-research",
    url: projectCardImages.aiNews,
    page: "/projects/senior-thesis-local-journalism",
    title: "AI Platforms and Journalism Research",
    alt: "AI platforms and local journalism honors thesis project preview",
    caption:
      "Honors research on AI, digital platforms, local journalism, democracy, and media policy.",
  },
  {
    id: "electric-vehicle-charging-access",
    url: projectCardImages.charging,
    page: "/projects/electric-vehicle-access-analysis",
    title: "Electric Vehicle Charging Access Analysis",
    alt: "Electric Vehicle Charging Access Analysis project preview",
    caption:
      "GIS analysis of electric vehicle charging access, infrastructure, and transportation equity.",
  },
];

export const projectPriorityOrder = [
  "fulbright-focus-group-sponsored-by-openai",
  "artificial-intelligence-in-state-government-index",
  "ai-literacy-workshop-for-educators",
  "senior-thesis-local-journalism",
  "congressional-office-setup-100-day-report",
  "electric-vehicle-access-analysis",
  "boehringer-cares-foundation-rebrand-strategy-shift",
  "communications-consultancy-supporting-local-candidates",
  "political-reporting-at-washu",
  "2022-institute-for-nonprofit-news-index-survey",
  "sustainable-development-health-access-report",
  "stl-immigrant-refugee-support-grant-process",
  "exclusive-interview-with-high-visibility-congressperson",
  "first-personal-website",
];

export const redirectTargets = [
  {
    source: "/chatgpt-lab",
    destination: "/projects/fulbright-focus-group-sponsored-by-openai",
  },
  {
    source: "/fulbright-chatgpt-lab",
    destination: "/projects/fulbright-focus-group-sponsored-by-openai",
  },
  {
    source: "/openai-education",
    destination: "/projects/fulbright-focus-group-sponsored-by-openai",
  },
  {
    source: "/chatgpt-for-education",
    destination: "/projects/fulbright-focus-group-sponsored-by-openai",
  },
  {
    source: "/ai-state-government-index",
    destination: "/projects/artificial-intelligence-in-state-government-index",
  },
  {
    source: "/ai-government-index",
    destination: "/projects/artificial-intelligence-in-state-government-index",
  },
  {
    source: "/ai-journalism-research",
    destination: "/projects/senior-thesis-local-journalism",
  },
  {
    source: "/resume",
    destination: "/experience",
  },
  {
    source: "/work",
    destination: "/projects",
  },
];

export const aiCrawlerAgents = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "GoogleOther",
  "GoogleOther-Image",
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "Applebot-Extended",
];
