import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const RESUME_HREF = "/isaac-seiler-resume.pdf";

const metrics = [
  { value: "56", label: "states and territories in an AI adoption index" },
  { value: "900", label: "inputs cleaned, scored, and normalized" },
  { value: "250+", label: "educators reached in an LLM fundamentals workshop" },
  { value: "100+", label: "pages of honors research on AI and local news" },
  { value: "350K", label: "weekly reach supported for a new House office" },
  { value: "80%", label: "open rate for an internal newsletter system" },
];

const strengths = [
  {
    title: "Translation",
    text: "Moving between technical ideas, public institutions, and ordinary users without losing the human stakes.",
  },
  {
    title: "Writing judgment",
    text: "Writing for voters, reporters, executives, educators, students, and product teams with the same standard for clarity.",
  },
  {
    title: "Operating rhythm",
    text: "Turning loose goals into workflows, benchmarks, partner lists, launch feedback, newsletters, and shipped work.",
  },
  {
    title: "Fast learning",
    text: "Learning quickly, testing honestly, and making new tools useful without pretending to be finished.",
  },
];

const evidence = [
  {
    org: "OpenAI",
    role: "ChatGPT Lab",
    proof: "Test new ChatGPT products and give structured feedback to product and go-to-market teams; contributed to 100 Chats.",
  },
  {
    org: "Fulbright Taiwan",
    role: "AI literacy and education",
    proof: "Created an OpenAI-supported educator lab, designed six applied sessions, and led an LLM fundamentals workshop for 250+ educators.",
  },
  {
    org: "Council of State Governments",
    role: "AI adoption research",
    proof: "Built a 900-input public benchmark comparing generative AI adoption signals across 56 states and territories.",
  },
  {
    org: "Boehringer Ingelheim",
    role: "Communications and operations",
    proof: "Supported rebrand and strategy work, built an 80% open-rate newsletter system, and improved employee volunteering communications.",
  },
  {
    org: "U.S. House and campaigns",
    role: "High-pressure public comms",
    proof: "Helped stand up a new congressional office, supported 350K weekly reach, and ran campaign digital and events work.",
  },
  {
    org: "WashU and journalism",
    role: "Research and public-interest writing",
    proof: "Wrote a 100+ page honors thesis on AI, platforms, and local journalism; reported on politics, protest, and governance.",
  },
];

const fit = [
  "AI product, education, policy, or adoption work",
  "GTM, comms, or launch work that needs judgment",
  "Ops or strategy roles that reward writing and follow-through",
];

const recognitions = ["Fulbright Scholar", "Truman Scholar", "Rhodes finalist", "OpenAI ChatGPT Lab"];
const mobileEvidence = [
  "OpenAI product and GTM feedback.",
  "Fulbright AI literacy in Taiwan.",
  "CSG state AI adoption benchmark.",
  "House, campaign, and internal comms systems.",
];

const Panel = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <section className={`site-corner min-h-0 overflow-hidden border border-foreground/10 bg-background ${className}`}>
    {children}
  </section>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/42">{children}</p>
);

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
        <main className="h-full overflow-hidden px-4 pb-4 pt-20 sm:px-5 sm:pb-5 sm:pt-24 lg:px-6 lg:pb-6">
          <motion.div
            className="grid h-full min-h-0 grid-rows-[minmax(0,0.35fr)_minmax(0,0.18fr)_minmax(0,0.24fr)_minmax(0,0.23fr)] gap-3 lg:hidden"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
          >
            <Panel className="p-4">
              <div>
                <Label>Credentials</Label>
                <h1 className="mt-3 text-[2rem] font-semibold leading-[0.94] tracking-tight text-foreground">
                  I help new technology make sense to real people.
                </h1>
                <p className="mt-3 text-[12px] leading-snug text-foreground/64">
                  Research, communication, and operations for AI and public-facing work.
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Fulbright", "Truman", "Rhodes finalist", "OpenAI Lab"].map((item) => (
                  <span key={item} className="site-corner border border-foreground/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-foreground/58">
                    {item}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel className="p-3">
              <div className="grid h-full grid-cols-3 gap-2">
                {metrics.slice(0, 6).map((metric) => (
                  <div key={metric.label} className="min-w-0">
                    <div className="font-mono text-[1.45rem] font-medium leading-none text-foreground">{metric.value}</div>
                    <p className="mt-1 text-[8px] uppercase leading-tight tracking-[0.08em] text-foreground/54">
                      {metric.label.split(" ").slice(0, 3).join(" ")}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-4">
              <Label>Proof</Label>
              <div className="mt-2 divide-y divide-foreground/10">
                {mobileEvidence.map((item) => (
                  <p key={item} className="py-2 text-[11px] font-medium leading-tight text-foreground/70 first:pt-0 last:pb-0">
                    {item}
                  </p>
                ))}
              </div>
            </Panel>

            <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_5.8rem_5.8rem] gap-3">
              <Panel className="p-3">
                <Label>Best fit</Label>
                <p className="mt-2 text-[12px] font-medium leading-tight text-foreground/76">
                  AI adoption, product/GTM feedback, strategy, comms, and ops roles.
                </p>
              </Panel>
              <a
                href={RESUME_HREF}
                download
                className="site-corner flex min-h-0 flex-col justify-between bg-primary p-3 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <FileText className="h-4 w-4" strokeWidth={1.6} />
                <span className="font-mono text-[9px] uppercase tracking-[0.14em]">Resume</span>
              </a>
              <Link
                to="/experience"
                className="site-corner flex min-h-0 flex-col justify-between border border-foreground/10 bg-foreground/[0.035] p-3 text-foreground transition-colors hover:bg-foreground/10"
              >
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                <span className="font-mono text-[9px] uppercase tracking-[0.14em]">History</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hidden h-full min-h-0 gap-4 lg:grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
          >
            <Panel className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-4 p-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <Label>Credentials</Label>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/42">
                    Summer 2026
                  </span>
                </div>

                <h1 className="mt-3 max-w-3xl text-[clamp(2.25rem,4.65vw,5.05rem)] font-semibold leading-[0.94] tracking-tight text-foreground">
                  I help new technology make sense to real people.
                </h1>

                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/66">
                  My work sits between research, communication, and operations. I am strongest when something is vague, technical, or publicly sensitive and needs to become clear enough for people to use.
                </p>
              </div>

              <div className="min-h-0">
                <Label>Strengths</Label>
                <div className="mt-2 divide-y divide-foreground/10">
                  {strengths.map((item) => (
                    <div key={item.title} className="grid gap-4 py-2.5 first:pt-0 md:grid-cols-[7.5rem_minmax(0,1fr)]">
                      <h2 className="text-sm font-semibold tracking-tight text-foreground">{item.title}</h2>
                      <p className="text-[12px] leading-snug text-foreground/60">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                <div className="flex flex-wrap gap-2">
                  {recognitions.map((item) => (
                    <span key={item} className="site-corner border border-foreground/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/60">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={RESUME_HREF}
                    download
                    className="site-corner flex h-16 w-28 flex-col justify-between bg-primary p-3 text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <FileText className="h-4 w-4" strokeWidth={1.6} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em]">Resume</span>
                  </a>
                  <Link
                    to="/experience"
                    className="site-corner flex h-16 w-28 flex-col justify-between border border-foreground/10 bg-foreground/[0.035] p-3 text-foreground transition-colors hover:bg-foreground/10"
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em]">History</span>
                  </Link>
                </div>
              </div>
            </Panel>

            <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-4">
              <Panel className="p-4">
                <div className="grid grid-cols-3 gap-x-5 gap-y-3 lg:grid-cols-6">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="min-w-0">
                      <div className="font-mono text-[clamp(1.35rem,2.1vw,2.5rem)] font-medium leading-none text-foreground">
                        {metric.value}
                      </div>
                      <p className="mt-1.5 text-[10px] leading-snug text-foreground/56">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="min-h-0 overflow-hidden p-0">
                <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)]">
                  <div className="border-b border-foreground/10 p-4">
                    <Label>Evidence</Label>
                  </div>

                  <div className="min-h-0 divide-y divide-foreground/10 overflow-hidden">
                    {evidence.map((item) => (
                      <article key={`${item.org}-${item.role}`} className="grid min-h-0 gap-2 px-4 py-3 md:grid-cols-[8.25rem_8.5rem_minmax(0,1fr)] md:gap-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/44">{item.org}</p>
                        <h2 className="text-sm font-semibold leading-tight tracking-tight text-foreground">{item.role}</h2>
                        <p className="text-[12px] leading-snug text-foreground/62 md:text-[13px]">{item.proof}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="grid gap-3 md:grid-cols-[8rem_minmax(0,1fr)] md:items-start">
                  <Label>Best fit</Label>
                  <div className="grid gap-2 md:grid-cols-3">
                    {fit.map((item) => (
                      <p key={item} className="text-[12px] font-medium leading-snug text-foreground/72">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </Panel>
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
