import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
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
  title: string;
  href: string;
  image?: string;
  external: boolean;
}

interface ExperienceGroup {
  id: string;
  organization: string;
  organizationUrl?: string;
  period: string;
  image: string;
  entries: ExperienceEntry[];
}

const EMPLOYER_PERIODS: Record<string, string> = {
  "Boehringer Ingelheim": "May 2024-Aug 2025",
  "Washington University in St. Louis": "Sep 2023-May 2025",
};

const groupExperienceEntries = (entries: ExperienceEntry[]): ExperienceGroup[] => {
  const groups = new Map<string, ExperienceGroup>();

  entries.forEach((entry) => {
    const existing = groups.get(entry.organization);
    if (existing) {
      existing.entries.push(entry);
      return;
    }

    groups.set(entry.organization, {
      id: entry.id,
      organization: entry.organization,
      organizationUrl: entry.organizationUrl,
      period: EMPLOYER_PERIODS[entry.organization] ?? entry.period,
      image: entry.image,
      entries: [entry],
    });
  });

  return Array.from(groups.values());
};

const relatedFor = (entry: ExperienceEntry): RelatedItem[] => {
  const projects = entry.projectIds
    .map((id) => projectItems.find((project) => project.id === id))
    .filter((project): project is (typeof projectItems)[number] => Boolean(project))
    .map((project) => ({
      id: `project-${project.id}`,
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
      title: item.title,
      href: item.href,
      image: item.imageUrl,
      external: true,
    }));

  return [...projects, ...stories];
};

const relatedForGroup = (group: ExperienceGroup): RelatedItem[] => {
  const related = group.entries.flatMap((entry) => relatedFor(entry));
  return related.filter((item, index) => related.findIndex((candidate) => candidate.id === item.id) === index);
};

const EmployerLink = ({
  group,
  className,
}: {
  group: Pick<ExperienceGroup, "organization" | "organizationUrl">;
  className?: string;
}) => {
  if (!group.organizationUrl) {
    return <span className={`${className ?? ""} font-sans normal-case tracking-tight`}>{group.organization}</span>;
  }

  return (
    <a
      href={group.organizationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className ?? ""} group/employer-link inline-flex items-center gap-1.5 font-sans normal-case tracking-tight transition-colors hover:text-[hsl(50_33%_18%)]`}
    >
      <span className="relative after:absolute after:bottom-[-0.12em] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out group-hover/employer-link:after:scale-x-100">
        {group.organization}
      </span>
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 opacity-45 transition duration-300 group-hover/employer-link:-translate-y-0.5 group-hover/employer-link:translate-x-0.5 group-hover/employer-link:opacity-100"
        strokeWidth={1.5}
      />
    </a>
  );
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

const ExperienceGroupSection = ({
  group,
  index,
}: {
  group: ExperienceGroup;
  index: number;
}) => {
  const related = useMemo(() => relatedForGroup(group), [group]);

  return (
    <motion.article
      id={group.id}
      className={`experience-entry scroll-mt-28 py-10 md:py-14 ${
        index === 0 ? "pt-0" : "border-t border-foreground/10"
      }`}
      data-experience-id={group.id}
      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.72, ease: EASE }}
    >
      <div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start xl:gap-10">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-foreground/54 lg:hidden">
              <EmployerLink group={group} />
            </div>
            {group.entries.map((entry, entryIndex) => (
              <section
                key={entry.id}
                className={entryIndex === 0 ? "" : "mt-9 border-t border-foreground/10 pt-8"}
              >
                <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {entry.role}
                </h2>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/38">
                  <span>{entry.period}</span>
                </div>
                <div className="mt-5 space-y-4">
                  {entry.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="max-w-2xl text-[15px] leading-relaxed text-foreground/68 md:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <motion.div
            className="group relative aspect-square w-full overflow-hidden bg-foreground/5"
            initial={{ opacity: 0.72 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <img
              src={group.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
            />
          </motion.div>
        </div>

        {related.length > 0 ? (
          <div className="mt-8">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/44">
              Associated work
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
  const experienceGroups = useMemo(() => groupExperienceEntries(experienceEntries), []);
  const [activeId, setActiveId] = useState(experienceGroups[0]?.id ?? "");
  const isMobile = useIsMobile();
  const timelineRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.35 });
  const activeGroup = experienceGroups.find((group) => group.id === activeId) ?? experienceGroups[0];

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
          paddingLeft: sidebarOpen && !isMobile ? 240 : 0,
          paddingRight: searchOpen && !isMobile ? 240 : 0,
        }}
        className="min-w-0"
        transition={{ duration: 0.56, ease: EASE_TEXT }}
      >
        <motion.main
          className="pt-28"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: EASE_TEXT, delay: 0.1 }}
        >
          <section className="px-6 pb-10 md:pb-14">
            <div className="grid min-h-[58svh] grid-cols-1 content-end gap-10 md:min-h-[62vh] md:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] md:items-end">
              <div className="min-w-0 max-w-5xl">
                <motion.h1
                  className="max-w-5xl text-[2.55rem] font-semibold leading-[0.98] tracking-tight text-foreground md:text-7xl md:leading-[0.95] lg:text-8xl"
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
                className="block w-full min-w-0 shrink-0"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE_TEXT, delay: 0.32 }}
              >
                <div className="homepage-cta group relative flex w-full cursor-pointer items-center justify-center bg-[hsl(50_33%_7%)] py-3 font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-[hsl(50_33%_12%)]">
                  <span className="flex items-center justify-center">
                    Download resume
                    <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-w-[2rem] group-hover:opacity-100">
                      <Download className="ml-2 h-4 w-4 shrink-0" strokeWidth={1.5} />
                    </span>
                  </span>
                </div>
              </motion.a>
            </div>
          </section>

          <section className="px-6">
            <motion.div
              className="border-t border-foreground/12 py-7 md:grid md:grid-cols-[minmax(14rem,0.32fr)_minmax(0,1fr)] md:gap-10 md:py-9"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="mb-5 md:mb-0">
                <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {experienceIntro.title}
                </h2>
              </div>
              <div className="grid max-w-4xl gap-4 text-[15px] leading-relaxed text-foreground/68 md:text-base">
                {experienceIntro.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </section>

          <section ref={timelineRef} className="px-6 py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(13rem,17rem)_minmax(0,1fr)] lg:gap-14">
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <motion.p
                    key={activeGroup.id}
                    className="mb-8 text-xl font-semibold leading-tight tracking-tight text-foreground"
                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.35, ease: EASE_TEXT }}
                  >
                    <EmployerLink group={activeGroup} />
                  </motion.p>

                  <div className="relative">
                    <div className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-foreground/10" />
                    <motion.div
                      className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-[hsl(var(--highlight))]"
                      style={{ scaleY }}
                    />
                    <div className="space-y-2">
                      {experienceGroups.map((group) => {
                        const active = group.id === activeId;
                        return (
                          <div
                            key={group.id}
                            className="group relative flex w-full items-start gap-4 py-1.5 text-left"
                          >
                            <button
                              type="button"
                              onClick={() => scrollToEntry(group.id)}
                              aria-label={`Scroll to ${group.organization}`}
                              className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border transition-colors ${
                                active ? "border-[hsl(var(--highlight))] bg-[hsl(var(--highlight))]" : "border-foreground/30 bg-background"
                              }`}
                            />
                            <span>
                              <span className={`block text-[13px] leading-tight transition-colors ${active ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/72"}`}>
                                <EmployerLink group={group} />
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              <div>
                {experienceGroups.map((group, index) => (
                  <ExperienceGroupSection key={group.id} group={group} index={index} />
                ))}
              </div>
            </div>
          </section>
        </motion.main>

        <Footer />
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

export default ExperiencePage;
