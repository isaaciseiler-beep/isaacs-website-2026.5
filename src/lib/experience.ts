export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  period: string;
  paragraphs: string[];
  focus: string[];
  projectIds: string[];
  newsIds: number[];
}

export const experienceIntro = {
  title: "The work that motivates me",
  paragraphs: [
    "I'm most interested in work that sits at the intersection of AI, emerging tech, communications, operations, and the systems people use every day.",
    "For me, that has meant building programs around AI literacy, supporting early product feedback, researching how technology changes society, designing digital and IRL communications systems, and helping teams leverage communication tools to achieve their goals.",
    "I do not come from a traditional technical background. A lot of my growth has come from learning quickly, figuring out new tools, and using AI to build systems I would not have been able to build a few years ago.",
    "That is the part I'm most excited by: not just what new technology can do, but the ways it can enable people to do good.",
  ],
};

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "fulbright-taiwan",
    organization: "Fulbright Taiwan",
    role: "Fulbright Scholar",
    period: "2025-Present",
    paragraphs: [
      "I created and led an OpenAI-supported AI literacy program for educators in Taiwan, focused on helping non-technical users understand and apply AI in real classroom workflows.",
      "I designed six applied sessions on AI use cases, prompt design, LLM basics, and safe adoption. I also led an LLM fundamentals and alignment workshop at a 250+ person international education conference.",
      "I published a Substack with OpenAI highlighting nine high-impact education use cases for ChatGPT.",
    ],
    focus: ["AI enablement", "user education", "community comms", "curriculum design"],
    projectIds: ["fulbright-focus-group-sponsored-by-openai"],
    newsIds: [1, 7, 8, 9],
  },
  {
    id: "csg-ai-index",
    organization: "Council of State Governments",
    role: "State AI Adoption Index",
    period: "2025",
    paragraphs: [
      "I built a 900-input index measuring AI adoption and preparedness across 56 U.S. states and territories.",
      "I created a normalized scoring rubric, collected and cleaned data, and helped turn a messy policy landscape into something easier to compare and act on.",
      "I also supported planning for an AI policy summit by mapping 50+ technology partners and structuring outreach.",
    ],
    focus: ["AI policy research", "data systems", "partner mapping", "strategy support"],
    projectIds: ["artificial-intelligence-in-state-government-index"],
    newsIds: [],
  },
  {
    id: "openai-chatgpt-lab",
    organization: "OpenAI",
    role: "ChatGPT Lab",
    period: "2025-Present",
    paragraphs: [
      "I'm part of the first cohort of OpenAI's ChatGPT Lab, where I test new ChatGPT products and share structured feedback with product and go-to-market teams.",
      "I co-authored a book featuring 100 uses for ChatGPT, with a focus on practical workflows and real user behavior.",
      "This work has shaped how I think about technology: the best products do not just feel powerful. They are easy to understand, easy to adopt, and useful in the moments people actually need them.",
    ],
    focus: ["product feedback", "GTM insight", "AI education", "user behavior", "early testing"],
    projectIds: ["fulbright-focus-group-sponsored-by-openai"],
    newsIds: [5, 3, 10, 9],
  },
  {
    id: "boehringer-ingelheim",
    organization: "Boehringer Ingelheim",
    role: "Communications and Operations",
    period: "2024-2025",
    paragraphs: [
      "I worked across communications, operations, internal strategy, and employee engagement for two internal functions.",
      "I managed rebrand and strategy work, built a company-wide newsletter system with an 80% open rate, and shipped dozens of major cross-functional communications assets.",
      "I redesigned internal messaging and UX around employee volunteering, helping increase annual participation by 25%.",
    ],
    focus: ["internal operations", "cross-functional execution", "systems design", "stakeholder communications"],
    projectIds: ["boehringer-cares-foundation-rebrand-strategy-shift", "sustainable-development-health-access-report"],
    newsIds: [],
  },
  {
    id: "washu-ai-journalism",
    organization: "Washington University in St. Louis",
    role: "AI and Journalism Research",
    period: "2024-2025",
    paragraphs: [
      "I authored a 100+ page honors thesis on AI, digital platforms, and local journalism.",
      "I conducted 17 in-depth interviews with Australian journalists, editors, owners, and policy experts. The project explored journalism as a public good, platform incentives, economic decline, and the uncertainty surrounding generative AI.",
    ],
    focus: ["user research", "qualitative analysis", "platform strategy", "longform synthesis"],
    projectIds: ["senior-thesis-local-journalism", "political-reporting-at-washu"],
    newsIds: [12, 6, 11],
  },
  {
    id: "us-house",
    organization: "United States House of Representatives",
    role: "Communications Director and Transition Lead",
    period: "2022-2023",
    paragraphs: [
      "I helped build the communications function for a new congressional office from the ground up.",
      "I created workflows, managed press outreach, organized events and official travel, and helped the office reach 350,000 people weekly.",
      "I secured 34+ interviews with national outlets including The New York Times, CNN, and MSNBC.",
    ],
    focus: ["operational setup", "communications strategy", "rapid execution", "stakeholder management"],
    projectIds: ["congressional-office-setup-100-day-report"],
    newsIds: [12],
  },
  {
    id: "scholten-campaign",
    organization: "Scholten for Congress",
    role: "Digital Communications and Operations",
    period: "2022",
    paragraphs: [
      "I worked across digital communications, content, events, and logistics on a competitive congressional campaign.",
      "I helped run a cross-platform digital program generating 1M+ weekly impressions and $30k+ in organic fundraising. I also supported logistics for 100+ events with elected officials, cabinet secretaries, senators, and community leaders.",
    ],
    focus: ["digital strategy", "campaign operations", "audience growth", "event logistics"],
    projectIds: ["communications-consultancy-supporting-local-candidates"],
    newsIds: [],
  },
  {
    id: "institute-for-nonprofit-news",
    organization: "Institute for Nonprofit News",
    role: "Digital Ecosystems Research",
    period: "2021-2022",
    paragraphs: [
      "I contributed to research on nonprofit newsrooms and digital ecosystems for the 2022 INN Index.",
      "I cleaned, synthesized, and organized complex data from 100+ editors, helping make newsroom trends easier to understand and compare.",
    ],
    focus: ["data cleaning", "research synthesis", "ecosystem analysis", "editorial operations"],
    projectIds: ["2022-institute-for-nonprofit-news-index-survey"],
    newsIds: [],
  },
];
