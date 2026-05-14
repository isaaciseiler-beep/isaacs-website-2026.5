import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Brain,
  Briefcase,
  Database,
  FileText,
  LineChart,
  Megaphone,
  Network,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const RESUME_HREF = "/isaac-seiler-resume.pdf";

const metrics = [
  { value: "56", label: "states and territories scored for AI adoption" },
  { value: "900", label: "inputs in a public GenAI preparedness index" },
  { value: "250+", label: "educators reached in AI fundamentals workshop" },
  { value: "100+", label: "page honors thesis on AI, platforms, and news" },
  { value: "350K", label: "weekly reach helped build for a new House office" },
  { value: "80%", label: "open rate on a company-wide newsletter system" },
];

const mobileMetrics = [
  { value: "56", label: "AI map" },
  { value: "900", label: "inputs" },
  { value: "250+", label: "educators" },
  { value: "100+", label: "thesis pages" },
  { value: "350K", label: "weekly reach" },
  { value: "80%", label: "open rate" },
];

const signalCards: {
  title: string;
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    title: "AI adoption",
    label: "Research, rubrics, literacy programs, product feedback",
    icon: Brain,
    color: "text-[#bfff5a]",
  },
  {
    title: "GTM judgment",
    label: "Launch feedback, audience signals, campaign narrative",
    icon: Megaphone,
    color: "text-[#ff7a59]",
  },
  {
    title: "Ops systems",
    label: "Benchmarks, workflows, internal comms, execution loops",
    icon: Network,
    color: "text-[#7dd3fc]",
  },
  {
    title: "Public context",
    label: "Policy, journalism, institutions, high-pressure comms",
    icon: Briefcase,
    color: "text-[#f9a8d4]",
  },
];

const lanes = [
  {
    title: "Tech",
    text: "AI adoption research, product feedback, user education, and the habit of making ambiguous systems legible.",
    icon: Database,
  },
  {
    title: "GTM",
    text: "Narrative, launch context, stakeholder translation, and close reading of real user workflows.",
    icon: LineChart,
  },
  {
    title: "Ops",
    text: "Workflow design, team coordination, benchmarks, reporting, and practical follow-through.",
    icon: Users,
  },
];

const proofStack = [
  {
    eyebrow: "OpenAI",
    title: "ChatGPT Lab",
    detail: "First cohort member sharing structured feedback with product and go-to-market teams.",
    image: "/experience/oai.jpg",
  },
  {
    eyebrow: "Fulbright Taiwan",
    title: "AI literacy lab",
    detail: "Six applied sessions for educators plus an LLM fundamentals conference workshop.",
    image: "/experience/fb.jpeg",
  },
  {
    eyebrow: "Council of State Governments",
    title: "State AI index",
    detail: "Built a normalized GenAI preparedness benchmark across U.S. states and territories.",
    image: "/experience/csg.jpeg",
  },
];

const timeline = [
  { year: "2021", label: "Nonprofit newsroom research" },
  { year: "2022", label: "Congressional campaign digital ops" },
  { year: "2023", label: "New House office communications buildout" },
  { year: "2024", label: "Truman Scholar, BI strategy, AI/journalism research" },
  { year: "2025", label: "OpenAI Lab, CSG AI index, Fulbright Taiwan" },
  { year: "2026", label: "Seeking tech roles starting Summer 2026" },
];

const badgeLinks = [
  { label: "Truman Scholar", icon: Award },
  { label: "Fulbright Scholar", icon: Award },
  { label: "Rhodes Finalist", icon: Award },
  { label: "OpenAI contributor", icon: FileText },
];

const Panel = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <section className={`site-corner relative min-h-0 overflow-hidden border border-foreground/10 bg-background/74 shadow-[0_18px_70px_rgb(0_0_0_/_0.18)] backdrop-blur-xl ${className}`}>
    {children}
  </section>
);

const MetricTile = ({ value, label, index }: { value: string; label: string; index: number }) => (
  <motion.div
    className="site-corner min-h-0 border border-foreground/10 bg-foreground/[0.035] p-3"
    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ delay: 0.12 + index * 0.035, duration: 0.48, ease: EASE_TEXT }}
  >
    <div className="font-mono text-[clamp(1.35rem,2.4rem,2.4rem)] font-medium leading-none tracking-tight text-foreground">
      {value}
    </div>
    <p className="mt-1.5 text-[10px] leading-snug text-foreground/55 sm:text-[11px]">{label}</p>
  </motion.div>
);

const SignalCard = ({ card, index }: { card: (typeof signalCards)[number]; index: number }) => {
  const Icon = card.icon;

  return (
    <motion.div
      className="site-corner relative min-h-0 overflow-hidden border border-foreground/10 bg-foreground/[0.035] p-3"
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.2 + index * 0.04, duration: 0.52, ease: EASE_TEXT }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <Icon className={`h-4 w-4 ${card.color}`} strokeWidth={1.7} />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/32">signal</span>
      </div>
      <h2 className="text-base font-semibold tracking-tight text-foreground">{card.title}</h2>
      <p className="mt-1 text-[11px] leading-snug text-foreground/56">{card.label}</p>
    </motion.div>
  );
};

const Lane = ({ lane, index }: { lane: (typeof lanes)[number]; index: number }) => {
  const Icon = lane.icon;

  return (
    <motion.div
      className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 border-t border-foreground/10 py-3 first:border-t-0 first:pt-0 last:pb-0"
      initial={{ opacity: 0, x: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.22 + index * 0.05, duration: 0.48, ease: EASE_TEXT }}
    >
      <div className="site-corner flex h-8 w-8 items-center justify-center bg-foreground/8 text-foreground">
        <Icon className="h-4 w-4" strokeWidth={1.6} />
      </div>
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{lane.title}</h3>
        <p className="mt-1 text-[12px] leading-snug text-foreground/58">{lane.text}</p>
      </div>
    </motion.div>
  );
};

const MiniMetric = ({ value, label }: { value: string; label: string }) => (
  <div className="site-corner min-h-0 border border-foreground/10 bg-foreground/[0.035] p-2">
    <div className="font-mono text-xl font-medium leading-none text-foreground">{value}</div>
    <p className="mt-1 text-[8px] uppercase leading-tight tracking-[0.08em] text-foreground/52">{label}</p>
  </div>
);

const MiniSignal = ({ card }: { card: (typeof signalCards)[number] }) => {
  const Icon = card.icon;

  return (
    <div className="site-corner min-h-0 border border-foreground/10 bg-foreground/[0.035] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Icon className={`h-4 w-4 ${card.color}`} strokeWidth={1.7} />
        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-foreground/32">signal</span>
      </div>
      <h2 className="text-[13px] font-semibold leading-tight tracking-tight text-foreground">{card.title}</h2>
      <p className="mt-1 hidden text-[10px] leading-tight text-foreground/56 sm:block">{card.label}</p>
    </div>
  );
};

const CredentialsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSidebarToggle = () => {
    setSearchOpen(false);
    setSidebarOpen((open) => !open);
  };

  const handleSearchOpen = () => {
    setSidebarOpen(false);
    setSearchOpen(true);
  };

  return (
    <div className="relative h-[100svh] overflow-hidden bg-background text-foreground">
      <Sidebar
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={handleSearchOpen}
        showToggle={false}
      />

      <motion.div
        animate={{
          marginLeft: sidebarOpen && !isMobile ? 240 : 0,
          marginRight: searchOpen && !isMobile ? 240 : 0,
          width:
            sidebarOpen && !isMobile
              ? "calc(100% - 240px)"
              : searchOpen && !isMobile
                ? "calc(100% - 240px)"
                : "100%",
        }}
        transition={{ duration: 0.56, ease: EASE_TEXT }}
        className="h-full min-w-0 overflow-hidden"
      >
        <main className="relative h-full overflow-hidden px-4 pb-4 pt-20 sm:px-5 sm:pb-5 sm:pt-24 lg:px-6 lg:pb-6">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-40"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(var(--highlight) / 0.36), transparent), linear-gradient(180deg, hsl(var(--background)), transparent)",
            }}
          />

          <motion.div
            className="relative z-10 grid h-full min-h-0 grid-rows-[minmax(0,0.35fr)_minmax(0,0.18fr)_minmax(0,0.27fr)_minmax(0,0.2fr)] gap-3 lg:hidden"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.62, ease: EASE, delay: 0.08 }}
          >
            <Panel className="p-4">
              <p className="mono-text">Recruiter dashboard</p>
              <h1 className="mt-2 text-[2rem] font-semibold leading-[0.93] tracking-tight text-foreground">
                Tech fluent operator with public-context judgment.
              </h1>
              <p className="mt-3 text-[12px] leading-snug text-foreground/64">
                AI adoption, GTM feedback, operations systems, and public-context communications.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Fulbright", "Truman", "OpenAI Lab", "Summer 2026"].map((item) => (
                  <span key={item} className="site-corner border border-foreground/10 bg-foreground/[0.04] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/62">
                    {item}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {mobileMetrics.map((metric) => (
                  <MiniMetric key={metric.label} {...metric} />
                ))}
              </div>
            </Panel>

            <div className="grid min-h-0 grid-cols-2 gap-3">
              {signalCards.map((card) => (
                <MiniSignal key={card.title} card={card} />
              ))}
            </div>

            <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_5.9rem_5.9rem] gap-3">
              <Panel className="p-3">
                <p className="mono-text">Best short read</p>
                <p className="mt-1 text-[12px] font-medium leading-tight text-foreground/78">
                  Product-aware AI operator, writer, researcher, and communications builder.
                </p>
              </Panel>
              <a
                href={RESUME_HREF}
                download
                className="site-corner flex min-h-0 flex-col justify-between border border-foreground/10 bg-primary p-3 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FileText className="h-4 w-4" strokeWidth={1.6} />
                <span className="font-mono text-[9px] uppercase leading-tight tracking-[0.14em]">Resume</span>
              </a>
              <Link
                to="/experience"
                className="site-corner flex min-h-0 flex-col justify-between border border-foreground/10 bg-foreground/[0.055] p-3 text-foreground transition-colors hover:bg-foreground/10"
              >
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                <span className="font-mono text-[9px] uppercase leading-tight tracking-[0.14em]">History</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative z-10 hidden h-full min-h-0 gap-3 lg:grid lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.96fr)] xl:gap-4"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.62, ease: EASE, delay: 0.08 }}
          >
            <div className="grid min-h-0 gap-3 lg:grid-rows-[auto_minmax(0,1fr)_auto] xl:gap-4">
              <Panel className="p-4 sm:p-5 lg:p-6">
                <div className="flex h-full min-h-0 flex-col justify-between gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="mono-text">Recruiter dashboard</p>
                      <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-[0.92] tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
                        Tech fluent operator with public-context judgment.
                      </h1>
                    </div>
                    <div className="site-corner hidden border border-foreground/10 bg-foreground/[0.035] px-3 py-2 text-right sm:block">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">status</div>
                      <div className="mt-1 text-sm font-medium">Open to Summer 2026 tech roles</div>
                    </div>
                  </div>
                  <p className="max-w-4xl text-sm leading-relaxed text-foreground/66 sm:text-[15px] lg:text-base">
                    Isaac works across AI, emerging technology, communications, operations, policy research, and the systems people use every day. The throughline: turn fuzzy institutional problems into usable programs, benchmarks, narratives, and feedback loops.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {badgeLinks.map((badge) => {
                      const Icon = badge.icon;
                      return (
                        <span key={badge.label} className="site-corner inline-flex items-center gap-2 border border-foreground/10 bg-foreground/[0.04] px-3 py-1.5 text-[11px] font-medium text-foreground/72">
                          <Icon className="h-3.5 w-3.5 text-[hsl(var(--highlight))]" strokeWidth={1.5} />
                          {badge.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Panel>

              <div className="grid min-h-0 grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
                {signalCards.map((card, index) => (
                  <SignalCard key={card.title} card={card} index={index} />
                ))}
              </div>

              <Panel className="hidden p-4 lg:block">
                <div className="grid h-full grid-cols-6 items-center gap-2">
                  {timeline.map((item, index) => (
                    <div key={item.year} className="relative min-w-0">
                      {index > 0 ? <div className="absolute right-[calc(100%-0.25rem)] top-3 h-px w-full bg-foreground/12" /> : null}
                      <div className="relative z-10 mb-2 h-2 w-2 rounded-full bg-[hsl(var(--highlight))]" />
                      <div className="font-mono text-[10px] text-foreground/48">{item.year}</div>
                      <div className="mt-1 text-[11px] leading-tight text-foreground/64">{item.label}</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="grid min-h-0 gap-3 lg:grid-rows-[auto_minmax(0,1fr)_auto] xl:gap-4">
              <Panel className="p-4 sm:p-5">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {metrics.map((metric, index) => (
                    <MetricTile key={metric.label} {...metric} index={index} />
                  ))}
                </div>
              </Panel>

              <div className="grid min-h-0 gap-3 lg:grid-cols-[0.95fr_1.05fr] xl:gap-4">
                <Panel className="p-4 sm:p-5">
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="mono-text">Role fit</p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight">Three useful lanes</h2>
                      </div>
                      <div className="site-corner flex h-9 w-9 items-center justify-center bg-[hsl(var(--highlight))] text-background">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                      </div>
                    </div>
                    <div className="min-h-0 flex-1">
                      {lanes.map((lane, index) => (
                        <Lane key={lane.title} lane={lane} index={index} />
                      ))}
                    </div>
                  </div>
                </Panel>

                <Panel className="hidden p-0 sm:block">
                  <div className="grid h-full min-h-0 grid-rows-3">
                    {proofStack.map((item) => (
                      <article key={item.title} className="group grid min-h-0 grid-cols-[5.6rem_minmax(0,1fr)] border-t border-foreground/10 first:border-t-0">
                        <div className="relative min-h-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt=""
                            className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
                            loading="eager"
                          />
                        </div>
                        <div className="min-h-0 p-3">
                          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/40">{item.eyebrow}</p>
                          <h3 className="mt-1 text-base font-semibold leading-tight tracking-tight">{item.title}</h3>
                          <p className="mt-1 text-[11px] leading-snug text-foreground/58">{item.detail}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_auto] gap-3 xl:gap-4">
                <Panel className="p-4">
                  <div className="flex h-full min-h-0 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="mono-text">Best short read</p>
                      <p className="mt-1 text-sm font-medium leading-tight text-foreground/78">
                        Unusual bridge profile: product-aware AI operator, writer, researcher, and communications builder.
                      </p>
                    </div>
                    <div className="hidden shrink-0 grid-cols-3 gap-1 sm:grid">
                      <span className="h-10 w-2 bg-[#bfff5a]" />
                      <span className="h-10 w-2 bg-[#7dd3fc]" />
                      <span className="h-10 w-2 bg-[#ff7a59]" />
                    </div>
                  </div>
                </Panel>

                <div className="grid min-h-0 grid-cols-2 gap-3">
                  <a
                    href={RESUME_HREF}
                    download
                    className="site-corner flex min-h-0 w-28 flex-col justify-between border border-foreground/10 bg-primary p-3 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:w-32"
                  >
                    <FileText className="h-4 w-4" strokeWidth={1.6} />
                    <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.16em]">Resume</span>
                  </a>
                  <Link
                    to="/experience"
                    className="site-corner flex min-h-0 w-28 flex-col justify-between border border-foreground/10 bg-foreground/[0.055] p-3 text-foreground transition-colors hover:bg-foreground/10 sm:w-32"
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.16em]">Full history</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </motion.div>

      <SiteHeader
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        searchOpen={searchOpen}
        onSearchOpen={handleSearchOpen}
        onSearchClose={() => setSearchOpen(false)}
      />
    </div>
  );
};

export default CredentialsPage;
