const PROJECT_IMG_BASE = "https://pub-fa8ebd83ba8d4bf99e2e7f12e394fc2f.r2.dev";
const projectImg = {
  aiIndex: `${PROJECT_IMG_BASE}/aiindex.png`,
  aiNews: `${PROJECT_IMG_BASE}/ainews.png`,
  biCares: `${PROJECT_IMG_BASE}/bicares.png`,
  boehStrategy: `${PROJECT_IMG_BASE}/boehstrategy.png`,
  capHill: `${PROJECT_IMG_BASE}/caphill.png`,
  charging: `${PROJECT_IMG_BASE}/charging.png`,
  chatLab: `${PROJECT_IMG_BASE}/chatlab.jpeg`,
  congressInterview: `${PROJECT_IMG_BASE}/congressinterview.png`,
  nonprofitNews: `${PROJECT_IMG_BASE}/nonprofitnews.png`,
  politicalConsult: `${PROJECT_IMG_BASE}/politicalconsult.png`,
  reporting: `${PROJECT_IMG_BASE}/reporting.png`,
};

export interface NewsItem {
  id: number;
  source: string;
  title: string;
  href: string;
  logoUrl: string;
  logoAlt: string;
  imageUrl?: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: ProjectLink[];
}

export interface ProjectItem {
  id: string;
  title: string;
  source: "RESEARCH" | "WORK" | "REPORTING" | "PROJECT";
  year: string;
  summary: string;
  image: string;
  sections: ProjectSection[];
}

export const personName = "Isaac Seiler";

export const bioLines = [
  "I'm Isaac, a recent WashU graduate, Fulbright and Truman Scholar, and a member of OpenAI's ChatGPT Lab.",
  "I've managed the communications program for a Member of Congress, published work with OpenAI, built a congressional office, founded my own consultancy, and conducted international research on the social and material impacts of AI and the Internet.",
  "I'm currently in the market for tech roles starting Summer 2026.",
];

const NEWS_IMG_BASE = "https://pub-0f2ac8ec0d4e41b885a39ae5fd004706.r2.dev";

export const newsItems: NewsItem[] = [
  {
    id: 1,
    source: "ChatGPT for Education",
    title: "Conducted OpenAI-supported Education Focus Group",
    href: "https://edunewsletter.openai.com/p/top-chats-from-the-fulbright-taiwan",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/openai-text.png",
    logoAlt: "OpenAI",
    imageUrl: `${NEWS_IMG_BASE}/chatgptlab.png`,
  },
  {
    id: 2,
    source: "Forbes",
    title: "Featured 2024 Truman Scholars",
    href: "https://www.forbes.com/sites/michaeltnietzel/2024/04/13/the-truman-scholars-for-2024-are-announced/",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/Forbes.png",
    logoAlt: "Forbes",
    imageUrl: `${NEWS_IMG_BASE}/truman.png`,
  },
  {
    id: 3,
    source: "OpenAI",
    title: "Selected as Early Tester for GPT 5.5 Instant",
    href: "#",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/openai-text.png",
    logoAlt: "OpenAI",
    imageUrl: `${NEWS_IMG_BASE}/55.png`,
  },
  {
    id: 4,
    source: "Washington University in St. Louis",
    title: "Won 2024 Truman Scholarship",
    href: "https://source.washu.edu/2024/04/junior-seiler-awarded-truman-scholarship/",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/WashU.png",
    logoAlt: "WashU",
    imageUrl: `${NEWS_IMG_BASE}/trumanII.png`,
  },
  {
    id: 5,
    source: "OpenAI",
    title: "Co-Authored 100 Chats Project with the ChatGPT Lab",
    href: "https://chatgpt.com/100chats-project",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/openai-text.png",
    logoAlt: "OpenAI",
    imageUrl: `${NEWS_IMG_BASE}/100chats.png`,
  },
  {
    id: 6,
    source: "Washington University in St. Louis",
    title: "Named 2024 Rhodes Scholarship Finalist",
    href: "https://source.washu.edu/2024/11/seniors-darden-seiler-were-rhodes-scholars-finalists/",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/WashU.png",
    logoAlt: "WashU",
    imageUrl: `${NEWS_IMG_BASE}/rhodes.png`,
  },
  {
    id: 7,
    source: "Washington University in St. Louis",
    title: "Won Fulbright Award to Taiwan",
    href: "https://source.wustl.edu/2025/06/several-alumni-earn-fulbright-awards/",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/Fulbright.png",
    logoAlt: "Fulbright",
    imageUrl: `${NEWS_IMG_BASE}/taipei.png`,
  },
  {
    id: 8,
    source: "OpenAI",
    title: "Study Mode Spotlight on ChatGPT's Instagram",
    href: "https://www.instagram.com/chatgpt/reel/DNyG5VvXEZM/",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/openai-text.png",
    logoAlt: "OpenAI",
    imageUrl: `${NEWS_IMG_BASE}/study.png`,
  },
  {
    id: 9,
    source: "OpenAI",
    title: "Testimonial Featured in ChatGPT Pulse Launch",
    href: "https://openai.com/index/introducing-chatgpt-pulse/",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/openai-text.png",
    logoAlt: "OpenAI",
    imageUrl: `${NEWS_IMG_BASE}/pulse.png`,
  },
  {
    id: 10,
    source: "OpenAI",
    title: "Served in Early Testing Group for ChatGPT Atlas",
    href: "#",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/openai-text.png",
    logoAlt: "OpenAI",
    imageUrl: `${NEWS_IMG_BASE}/atlas.png`,
  },
  {
    id: 11,
    source: "Missouri College Media Awards",
    title: "Won Award for Best College Newspaper Photography",
    href: "https://source.washu.edu/2025/05/student-life-wins-best-newspaper-honor-at-missouri-college-media-awards/",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/WashU.png",
    logoAlt: "WashU",
    imageUrl: `${NEWS_IMG_BASE}/washuII.png`,
  },
  {
    id: 12,
    source: "Washington University in St. Louis",
    title: "University Profile",
    href: "https://artsci.washu.edu/ampersand/isaac-seiler-setting-his-sights-high",
    logoUrl: "https://pub-e466b845a9ef4344b05811b344fb11e1.r2.dev/WashU.png",
    logoAlt: "WashU",
    imageUrl: `${NEWS_IMG_BASE}/washu.png`,
  },
];

export const projectItems: ProjectItem[] = [
  {
    id: "artificial-intelligence-in-state-government-index",
    title: "Artificial Intelligence in State Government Index",
    source: "RESEARCH",
    year: "2025",
    summary:
      "A public-information benchmark measuring how state and territory governments are actually responding to generative AI.",
    image: projectImg.aiIndex,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "This work, published with the Council of State Governments, translates the GenAI hype cycle into a measurable picture of how state and territory governments are actually responding.",
          "I built a public-information benchmark that scores all states and territories on concrete adoption signals including employee guidance, training, sandboxes, pilots, governance structures, and transparency, then paired the index with a policy roadmap for what leaders should do next.",
          "The headline result was stark: most states scored below 50/100, and only a small handful cleared 80, suggesting the U.S. state landscape is early, uneven, and often opaque.",
        ],
      },
      {
        heading: "What I Built",
        bullets: [
          "GenAI Preparedness Score: a 15-criteria scoring framework grounded in publicly verifiable evidence.",
          "Composite scoring: a weighted model combining preparedness with an efficiency adjustment.",
          "State-by-state analysis and rankings with concise synopses explaining each placement.",
          "A practitioner roadmap tied directly to observed policy, training, pilot, and transparency gaps.",
        ],
      },
      {
        heading: "Final Products",
        links: [
          { label: "The GenAI Benchmark", href: "https://docs.google.com/spreadsheets/d/1BhOYYJF75hnKdcfi5IejWD8tHovsdnay/edit?usp=sharing&ouid=107923489516143255873&rtpof=true&sd=true" },
          { label: "Study Methodology and Background", href: "https://docs.google.com/document/d/1jvnT2yJo47LchswQmj4DRZGEHYOoMGZB/edit" },
          { label: "Recommendations to State Lawmakers", href: "https://docs.google.com/document/d/1z1hLEEtHXN6JlZp3XSpEGSV2wMdmoTHD/edit" },
          { label: "Executive Summary Presentation", href: "https://docs.google.com/presentation/d/1jAaItGFd-F7s-wUSZRsxjfbmZnqmAT5V/edit?slide=id.p1#slide=id.p1" },
        ],
      },
    ],
  },
  {
    id: "congressional-office-setup-100-day-report",
    title: "Congressional Office Setup and 100 Day Report",
    source: "WORK",
    year: "2025",
    summary:
      "A report capturing the systems, staffing, and benchmarks used to stand up a brand-new congressional office from zero.",
    image: projectImg.capHill,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "This report captures the work I led to stand up a brand-new congressional office from zero and benchmark its first 100 days of operation.",
          "I helped design the office's internal systems, set early priorities, and define what success would look like before we opened the doors.",
          "I led the collection and verification of office-wide metrics, identified and summarized qualitative and quantitative wins, designed the final report, and coordinated its release to media and stakeholders.",
        ],
      },
      {
        heading: "My Contributions",
        bullets: [
          "Building core office infrastructure and workflows.",
          "Hiring a core team and directing recruiting processes.",
          "Tracking early performance benchmarks.",
          "Managing schedule and logistics for a new member of Congress.",
        ],
      },
      {
        heading: "Final Products",
        links: [
          { label: "100 Day Report Executive Summary", href: "https://drive.google.com/file/d/1gdSr7RjjmidqJkLTWkyIbesVPIkECizn/view" },
        ],
      },
    ],
  },
  {
    id: "senior-thesis-local-journalism",
    title: "AI, Digital Platforms, and Journalism Research",
    source: "RESEARCH",
    year: "2025",
    summary:
      "A qualitative honors thesis on the structural decline of local journalism in Australia and its implications for democracy, labor, and media policy.",
    image: projectImg.aiNews,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "My senior thesis is a qualitative honors project analyzing the structural decline of local journalism in Australia and its implications for democratic accountability, labor, and media policy.",
          "Drawing on 17 in-depth interviews with current and former journalists, editors, newsroom owners, and industry experts, the study examines how economic contraction, platform dominance, newsroom consolidation, and emerging technologies are reshaping local and regional news ecosystems.",
          "I designed and executed the research end-to-end, including literature review, interview recruitment, transcription verification, qualitative coding, and thematic analysis.",
        ],
      },
      {
        heading: "Core Outputs",
        bullets: [
          "An original qualitative dataset with 17 semi-structured interviews and verified transcripts.",
          "Flexible coding and thematic synthesis on labor precarity, newsroom contraction, and platform dependence.",
          "Comparative evaluation of print, digital, hybrid, nonprofit, and subscription-based business models.",
          "Policy and platform assessment spanning bargaining codes, broadcasting, subsidies, and digital training programs.",
        ],
      },
      {
        heading: "Final Products",
        links: [
          { label: "Final Thesis Draft", href: "https://drive.google.com/file/d/1Z6-RR1Zw7z2RieJwVHdk0yOtycRIN1ia/view?usp=sharing" },
        ],
      },
    ],
  },
  {
    id: "electric-vehicle-access-analysis",
    title: "Electric Vehicle Charging Access Analysis",
    source: "RESEARCH",
    year: "2024",
    summary:
      "A GIS and quantitative analysis project examining EV infrastructure access and where structural charger gaps remain.",
    image: projectImg.charging,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "This project used geographic information systems and quantitative analysis to examine electric vehicle access, infrastructure, and adoption.",
          "I worked with spatial datasets covering population, infrastructure, and policy variables to identify where EV adoption is accelerating, and where structural gaps remain.",
          "My role focused on data cleaning, spatial joins, and statistical interpretation, translating raw geographic data into interpretable findings through maps, charts, and written analysis.",
        ],
      },
      {
        heading: "Key Takeaways",
        bullets: [
          "Regression results indicated very weak relationships between charger proximity and both income and race in the studied geographies.",
          "Charger gaps appeared regional and urban-rural, with higher density in states that prioritize EV policy.",
          "Future work should examine tract-level national data and rural access over time.",
        ],
      },
      {
        heading: "Final Products",
        links: [
          { label: "Initial Report", href: "https://drive.google.com/file/d/11lfGLY0n4XqNRCgFE3Yk_ph7zb2OlH3d/view?usp=sharing" },
          { label: "Presentation Poster with Spatial Analysis", href: "https://drive.google.com/file/d/1a8RYeorbJRYYcGRrFKe6x2rKmQMft95j/view?usp=sharing" },
        ],
      },
    ],
  },
  {
    id: "communications-consultancy-supporting-local-candidates",
    title: "Communications Consultancy and Supporting Local Candidates",
    source: "WORK",
    year: "2024",
    summary:
      "An independent consultancy effort supporting local candidates through campaign websites, digital strategy, and rapid-response communications.",
    image: projectImg.politicalConsult,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "In 2024, I decided I wanted to build my own consultancy, supporting local and federal candidates that I believed in by delivering digital and communications assets.",
          "One of the campaigns I supported was Allyson Damikolas for Tustin Unified School Board in California. I led the campaign's digital and communications strategy, with the website functioning as the central hub for messaging, organizing, and voter-facing information.",
          "In addition to building the site, I managed social media messaging and supported rapid-response and crisis communications during high-pressure moments in the race.",
        ],
      },
      {
        heading: "Scope of Work",
        bullets: [
          "Website strategy, design, and execution.",
          "Social media messaging and content design.",
          "Rapid-response and crisis communications support.",
          "Strategic advising on campaign narrative and positioning.",
        ],
      },
      {
        heading: "Final Products",
        links: [
          { label: "Allyson's Campaign Website", href: "https://www.allysonfortustin.com/" },
        ],
      },
    ],
  },
  {
    id: "fulbright-focus-group-sponsored-by-openai",
    title: "Fulbright Focus Group Sponsored by OpenAI",
    source: "PROJECT",
    year: "2025",
    summary:
      "A six-session educator lab, sponsored by OpenAI, focused on practical and responsible uses of ChatGPT in education.",
    image: projectImg.chatLab,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "I founded and led the Fulbright Taiwan ChatGPT Lab, the first educator-focused lab of its kind supported by OpenAI.",
          "The Lab brought together Fulbright educators to explore practical, responsible uses of ChatGPT in education. Over six structured sessions, I designed the curriculum, facilitated discussions, and guided participants toward concrete classroom use cases.",
          "The Lab culminated in a published Substack with specific, lightweight use cases of ChatGPT that educators of all kinds can utilize in their daily workflows.",
        ],
      },
      {
        heading: "Key Components of the Lab",
        bullets: [
          "Co-developed the Lab's structure with OpenAI staff.",
          "Independently facilitated six stakeholder sessions.",
          "Produced nine specific uses of ChatGPT for educators, summarized in a Substack post authored by me.",
        ],
      },
      {
        heading: "Final Products",
        links: [
          { label: "Substack Post", href: "https://edunewsletter.openai.com/p/top-chats-from-the-fulbright-taiwan" },
          { label: "Fulbright Taiwan ChatGPT Lab Notion Page", href: "https://notion.so/ChatGPT-Lab-x-Fulbright-Taiwan-261aaef174d680579138e8c1c658ab41" },
          { label: "PowerPoint Introduction to the Lab", href: "https://docs.google.com/presentation/d/1ZqOp_1KQte52BNBR5OBmOJThCufkNnBtVLBhNW_rkps/edit?slide=id.g38cd4d0aa4c_0_33#slide=id.g38cd4d0aa4c_0_33" },
        ],
      },
    ],
  },
  {
    id: "political-reporting-at-washu",
    title: "Political Reporting at WashU",
    source: "REPORTING",
    year: "2024",
    summary:
      "Student political reporting at WashU focused on protest, campus governance, elections, and institutional accountability.",
    image: projectImg.reporting,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "As a student journalist, I covered politics and power on campus, reporting on issues where institutional authority, student activism, and national politics intersected.",
          "My reporting focused on moments of controversy and transition, pairing on-the-ground student perspectives with analysis of how the university responded through policy, governance, and public messaging.",
        ],
      },
      {
        heading: "Selected Stories",
        links: [
          { label: "Suspended student protesters speak out", href: "https://www.studlife.com/news/2024/09/18/disorienting-suspended-student-protesters-speak-out" },
          { label: "WashU ABS respond to racist text messages after election", href: "https://www.studlife.com/news/2024/12/04/washu-abs-respond-to-racist-text-messages-after-election-discuss-combating-hate" },
          { label: "Panel on free speech, protest, and democracy", href: "https://www.studlife.com/news/2024/09/11/disagree-without-being-disagreeable-chancellor-martin-hosts-panel-on-free-speech-protest-and-democracy" },
          { label: "Anxiety and hope among WashU students, staff, and faculty", href: "https://www.studlife.com/news/2024/04/30/its-getting-hotter-anxiety-and-hope-among-washu-students-staff-and-faculty" },
          { label: "Students reflect on candidates and civic engagement", href: "https://www.studlife.com/news/2024/10/31/before-election-day-washu-students-reflect-on-candidates-and-civic-engagement-2" },
          { label: "University forms naming review board", href: "https://www.studlife.com/news/2024/02/14/university-forms-naming-review-board" },
        ],
      },
    ],
  },
  {
    id: "boehringer-cares-foundation-rebrand-strategy-shift",
    title: "Boehringer Cares Foundation Rebrand and Strategy Shift",
    source: "WORK",
    year: "2025",
    summary:
      "A full rebrand and strategic redirect for Boehringer Cares, spanning narrative, UX, visual identity, and internal communications.",
    image: projectImg.biCares,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "At Boehringer Cares, I helped lead a full rebrand including visual design and a broader strategic redirect.",
          "I played a central role in redefining how the organization presented its mission, priorities, and impact, both internally and externally.",
          "I led data collection and synthesis to inform the rebrand, then translated those insights into a new website and visual identity in collaboration with UX and brand strategy teams.",
        ],
      },
      {
        heading: "Major Contributions",
        bullets: [
          "Led research that clarified BICF's direction and narrative.",
          "Designed and launched a new website that helped increase employee volunteering by 25% in 2025.",
          "Shipped more than 25 assets and built a company-wide newsletter system that reached an 80% open rate.",
        ],
      },
      {
        heading: "Final Products",
        links: [
          { label: "Revamped Boehringer Cares Website", href: "https://www.boehringer-ingelheim.com/us/boehringer-ingelheim-cares-foundation" },
        ],
      },
    ],
  },
  {
    id: "2022-institute-for-nonprofit-news-index-survey",
    title: "The 2022 Institute for Nonprofit News Index Survey",
    source: "RESEARCH",
    year: "2022",
    summary:
      "A large-scale nonprofit news research project involving data collection, survey synthesis, and direct stakeholder outreach.",
    image: projectImg.nonprofitNews,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "As a research assistant on the INN Index, I contributed to both the qualitative and quantitative components of a large-scale research project measuring nonprofit news organizations.",
          "I collected and cleaned data, synthesized survey responses, and conducted individual outreach to a significant subset of respondents.",
        ],
      },
      {
        heading: "Key Contributions",
        bullets: [
          "Data collection and database management.",
          "Direct stakeholder engagement.",
        ],
      },
      {
        heading: "Final Products",
        links: [
          { label: "2022 INN Index Report", href: "https://inn.org/research/inn-index/inn-index-2022/about-the-index/" },
        ],
      },
    ],
  },
  {
    id: "exclusive-interview-with-high-visibility-congressperson",
    title: "Exclusive Interview with High-Visibility Congressperson",
    source: "REPORTING",
    year: "2021",
    summary:
      "Early access-driven political reporting on then-Congressman Peter Meijer during a volatile post-impeachment period.",
    image: projectImg.congressInterview,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "My reporting for The Calvin Chimes focused on then-Congressman Peter Meijer during a volatile period early in his tenure, following his vote to impeach President Trump.",
          "As a college freshman, I conducted direct interviews and covered intra-party backlash, policy positions, and the political risks facing a first-term member of Congress.",
        ],
      },
      {
        heading: "Selected Stories",
        links: [
          { label: "Rep. Meijer defends filibuster, merit-based immigration, vote for impeachment", href: "https://calvinchimes.org/2021/04/08/rep-meijer-defends-filibuster-merit-based-immigration-vote-for-impeachment/" },
          { label: "Rep. Meijer faces censures, primary challenge over impeachment vote", href: "https://calvinchimes.org/2021/02/24/rep-meijer-faces-censures-primary-challenge-over-impeachment-vote/" },
        ],
      },
    ],
  },
  {
    id: "sustainable-development-health-access-report",
    title: "Sustainable Development and Health Access Report",
    source: "PROJECT",
    year: "2024",
    summary:
      "Strategy and communications work around health access policy at Boehringer Ingelheim, including an internal report and SDX partnership support.",
    image: projectImg.boehStrategy,
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "While working at Boehringer Ingelheim, part of my work was to shape the strategy and narrative around the company's health access policies.",
          "My work sat at the intersection of research, communications, and operations: clarifying what the company stood for, how it communicated that stance, and how it operationalized those commitments.",
          "At the end of my rotation with the sustainable development team, I authored an internal report summarizing the state of health access within the company and supported operations around the Sustainable Development Excellence program.",
        ],
      },
      {
        heading: "More Information",
        links: [
          { label: "SDX Brandon Hall Group Award Announcement", href: "https://www.boehringer-ingelheim.com/us/about-us/sustainable-development/more-potential/boehringer-wins-10-brandon-hall-group-awards" },
          { label: "Boehringer's Sustainable Development Strategy", href: "https://www.boehringer-ingelheim.com/us/about-us/sustainable-development" },
        ],
      },
    ],
  },
];

export const featuredProjectIds = projectItems.slice(0, 4).map((project) => project.id);
