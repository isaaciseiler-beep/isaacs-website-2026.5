import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, Download, FileText, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import ChatOrb from "@/components/ChatOrb";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import SiteHeader from "@/components/SiteHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { experienceEntries, experienceIntro, type ExperienceEntry } from "@/lib/experience";
import { newsItems, projectItems } from "@/lib/siteContent";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const RESUME_HREF = "/isaac-seiler-resume.pdf";

interface RelatedItem {
  id: string;
  kind: string;
  title: string;
  href: string;
  image?: string;
  external: boolean;
}

const relatedFor = (entry: ExperienceEntry): RelatedItem[] => {
  const projects = entry.projectIds
    .map((id) => projectItems.find((project) => project.id === id))
    .filter((project): project is (typeof projectItems)[number] => Boolean(project))
    .map((project) => ({
      id: `project-${project.id}`,
      kind: "Project",
      title: project.title,
      href: `/projects/${project.id}`,
      image: project.image,
      external: false,
    }));

  const stories = entry.newsIds
    .map((id) => newsItems.find((item) => item.id === id))
    .filter((item): item is (typeof newsItems)[number] => Boolean(item))
    .filter((item) => item.href !== "#")
    .map((item) => ({
      id: `news-${item.id}`,
      kind: item.source,
      title: item.title,
      href: item.href,
      image: item.imageUrl,
      external: true,
    }));

  return [...projects, ...stories];
};

const RelatedLink = ({ item }: { item: RelatedItem }) => {
  const content = (
    <>
      <span className="relative h-14 w-20 shrink-0 overflow-hidden bg-foreground/5 md:h-16 md:w-24">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-foreground/35">
            <FileText className="h-4 w-4" strokeWidth={1.5} />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/42">
          {item.kind}
        </span>
        <span className="block text-sm font-medium leading-tight tracking-tight text-foreground/78 transition-colors group-hover:text-foreground md:text-[15px]">
          {item.title}
        </span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/32 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground/80" />
    </>
  );

  const className =
    "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-foreground/10 py-3 transition-colors hover:border-foreground/24 md:gap-4";

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={item.href} className={className}>
      {content}
    </Link>
  );
};

const ExperienceBlock = ({
  entry,
  index,
  active,
}: {
  entry: ExperienceEntry;
  index: number;
  active: boolean;
}) => {
  const related = useMemo(() => relatedFor(entry), [entry]);
  const leadImage = related.find((item) => item.image)?.image;

  return (
    <motion.article
      id={entry.id}
      className="experience-entry grid scroll-mt-28 gap-5 border-t border-foreground/10 py-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 md:py-14"
      data-experience-id={entry.id}
      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.72, ease: EASE }}
    >
      <div className="md:sticky md:top-28 md:self-start">
        <div className="mb-3 flex items-center gap-3">
          <motion.span
            className="h-2.5 w-2.5 rounded-full border border-foreground/40"
            animate={{
              backgroundColor: active ? "hsl(var(--highlight))" : "transparent",
              borderColor: active ? "hsl(var(--highlight))" : "hsl(var(--foreground) / 0.4)",
              boxShadow: active ? "0 0 24px hsl(var(--highlight) / 0.35)" : "0 0 0 hsl(var(--highlight) / 0)",
            }}
            transition={{ duration: 0.35, ease: EASE_TEXT }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/42">
            {entry.period}
          </span>
        </div>
        <p className="max-w-[14rem] text-sm leading-snug text-foreground/55">{entry.role}</p>
      </div>

      <div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)] lg:gap-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              {entry.organization}
            </h2>
            <div className="mt-5 space-y-4">
              {entry.paragraphs.map((paragraph) => (
                <p key={paragraph} className="max-w-2xl text-[15px] leading-relaxed text-foreground/68 md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {leadImage ? (
            <motion.div
              className="relative hidden min-h-[220px] overflow-hidden bg-foreground/5 lg:block"
              animate={{ opacity: active ? 1 : 0.48, filter: active ? "grayscale(0%)" : "grayscale(100%)" }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <img src={leadImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background)/0.82)] via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.24em] text-white/68">
                Linked work
              </span>
            </motion.div>
          ) : null}
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {entry.focus.map((item) => (
            <span
              key={item}
              className="border border-foreground/12 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/54"
            >
              {item}
            </span>
          ))}
        </div>

        {related.length > 0 ? (
          <div className="mt-8">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/44">
              <Newspaper className="h-3.5 w-3.5" strokeWidth={1.5} />
              Stories and projects
            </div>
            <div>
              {related.map((item) => (
                <RelatedLink key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
};

const ExperiencePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeId, setActiveId] = useState(experienceEntries[0]?.id ?? "");
  const isMobile = useIsMobile();
  const timelineRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.35 });
  const activeEntry = experienceEntries.find((entry) => entry.id === activeId) ?? experienceEntries[0];

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-experience-id]"));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.getAttribute("data-experience-id");
        if (id) setActiveId(id);
      },
      { threshold: [0.2, 0.4, 0.65], rootMargin: "-18% 0px -45% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const scrollToEntry = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSidebarToggle = () => {
    setSearchOpen(false);
    setSidebarOpen((open) => !open);
  };

  const handleSearchOpen = () => {
    setSidebarOpen(false);
    setSearchOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
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
      >
        <motion.main
          className="pt-28"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: EASE_TEXT, delay: 0.1 }}
        >
          <section className="px-6 pb-10 md:pb-14">
            <div className="flex min-h-[58svh] flex-col justify-end gap-10 md:min-h-[62vh] md:flex-row md:items-end md:justify-between">
              <div className="max-w-5xl">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                  Resume / live timeline
                </p>
                <motion.h1
                  className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-8xl"
                  initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.72, ease: EASE_TEXT, delay: 0.18 }}
                >
                  Experience built where AI, communications, and operations meet.
                </motion.h1>
              </div>

              <motion.a
                href={RESUME_HREF}
                download
                className="group inline-flex h-11 w-fit shrink-0 items-center gap-3 bg-foreground px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-background transition hover:bg-[hsl(var(--highlight))]"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE_TEXT, delay: 0.32 }}
              >
                <Download className="h-4 w-4" strokeWidth={1.5} />
                Download resume
              </motion.a>
            </div>
          </section>

          <section className="px-6">
            <motion.div
              className="border-y border-foreground/12 py-7 md:grid md:grid-cols-[0.38fr_minmax(0,1fr)] md:gap-10 md:py-9"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="mb-5 flex items-center gap-3 md:mb-0">
                <span className="flex h-9 w-9 items-center justify-center bg-foreground text-background">
                  <BriefcaseBusiness className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {experienceIntro.title}
                </h2>
              </div>
              <div className="grid gap-4 text-[15px] leading-relaxed text-foreground/68 md:grid-cols-2 md:text-base">
                {experienceIntro.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </section>

          <section ref={timelineRef} className="px-6 py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                    Now viewing
                  </p>
                  <motion.p
                    key={activeEntry.id}
                    className="mb-8 text-2xl font-semibold leading-tight tracking-tight text-foreground"
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.35, ease: EASE_TEXT }}
                  >
                    {activeEntry.organization}
                  </motion.p>

                  <div className="relative">
                    <div className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-foreground/10" />
                    <motion.div
                      className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-[hsl(var(--highlight))]"
                      style={{ scaleY }}
                    />
                    <div className="space-y-2">
                      {experienceEntries.map((entry) => {
                        const active = entry.id === activeId;
                        return (
                          <button
                            key={entry.id}
                            onClick={() => scrollToEntry(entry.id)}
                            className="group relative flex w-full gap-4 py-1.5 text-left"
                          >
                            <span
                              className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border transition-colors ${
                                active ? "border-[hsl(var(--highlight))] bg-[hsl(var(--highlight))]" : "border-foreground/30 bg-background"
                              }`}
                            />
                            <span>
                              <span className={`block text-sm leading-tight transition-colors ${active ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/72"}`}>
                                {entry.organization}
                              </span>
                              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/32">
                                {entry.period}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              <div>
                {experienceEntries.map((entry, index) => (
                  <ExperienceBlock key={entry.id} entry={entry} index={index} active={entry.id === activeId} />
                ))}
              </div>
            </div>
          </section>
        </motion.main>

        <Footer />
      </motion.div>

      {!sidebarOpen && !searchOpen && <ChatOrb />}

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

export default ExperiencePage;
