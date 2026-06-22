import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import { featuredProjectIds, projectItems, type ProjectItem } from "@/lib/siteContent";

const GAP = 3;
const EXPAND_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const useCenteredInFrame = <T extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<T | null>(null);
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsCentered(false);
      return;
    }

    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextCentered = Boolean(entry?.isIntersecting);
        setIsCentered((current) => (current === nextCentered ? current : nextCentered));
      },
      {
        rootMargin: "-38% 0px -38% 0px",
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  return [ref, isCentered] as const;
};

interface FeaturedProjectCardProps {
  project: ProjectItem;
  index: number;
  isDesktop: boolean;
  activeIndex: number | null;
  onActivate: (index: number) => void;
}

const FeaturedProjectCard = ({
  project,
  index,
  isDesktop,
  activeIndex,
  onActivate,
}: FeaturedProjectCardProps) => {
  const [mobileCardRef, isCenteredMobile] = useCenteredInFrame<HTMLAnchorElement>(!isDesktop);
  const isActive = isDesktop ? activeIndex === index : true;
  const isImageActive = isDesktop ? isActive : isCenteredMobile;
  const hasActive = activeIndex !== null;

  return (
    <Link
      ref={mobileCardRef}
      to={`/projects/${project.id}`}
      className="group relative block aspect-[4/3] h-auto cursor-pointer overflow-hidden bg-background transition-[flex] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:aspect-auto md:h-full md:min-h-0 md:flex-[1_1_0%]"
      style={{
        minWidth: 0,
        contain: "layout paint",
        flex: isDesktop ? (isActive ? "5.8 1 0%" : hasActive ? "0.9 1 0%" : "1 1 0%") : undefined,
      }}
      onMouseEnter={() => isDesktop && onActivate(index)}
      aria-label={`Read more about ${project.title}`}
    >
    <div className="relative h-full w-full bg-foreground/[0.04]">
      <img
        src={project.image}
        alt={project.title}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={index < 2 ? "high" : "low"}
        className={`absolute inset-0 h-full w-full object-cover transform-gpu transition-[filter,transform] duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-focus-within:grayscale-0 ${
          isImageActive ? "scale-[1.025] grayscale-0" : "scale-100 grayscale"
        }`}
      />

      <div
        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          isImageActive ? "opacity-0" : "opacity-35"
        }`}
      />

      <div
        className={`pointer-events-none absolute -inset-x-px -bottom-1 top-0 transition-opacity duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.76) 18%, rgba(0,0,0,0.34) 52%, transparent 76%)",
        }}
      />

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden p-5 transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] md:p-7 ${
          isActive ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        style={{
          transitionDelay: isActive ? "80ms" : "0ms",
        }}
      >
        <h3 className="mb-2 text-xl font-semibold leading-[0.95] tracking-tighter text-white md:text-3xl">
          {project.title}
        </h3>

        {isDesktop ? (
          <p className="max-w-sm text-[13px] leading-relaxed text-white/65">
            {project.summary}
          </p>
        ) : (
          <span className="inline-flex items-center text-base font-normal tracking-tight text-white/80">
            Read more
            <motion.span
              className="inline-flex overflow-hidden"
              animate={{
                width: isImageActive ? "1.5rem" : "0rem",
                opacity: isImageActive ? 1 : 0,
              }}
              transition={{ duration: 0.34, ease: EXPAND_EASE }}
            >
              <ArrowUpRight className="ml-2 h-4 w-4 shrink-0" strokeWidth={1.5} />
            </motion.span>
          </span>
        )}
      </div>
    </div>
    </Link>
  );
};

const ProjectsSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const projects: ProjectItem[] = useMemo(
    () =>
      featuredProjectIds
        .map((id) => projectItems.find((project) => project.id === id))
        .filter((project): project is ProjectItem => Boolean(project)),
    [],
  );

  return (
    <section data-work-scroll-content className="flex h-auto flex-col py-0 md:h-[calc(100svh-9.75rem)] md:min-h-[420px]">
      <div className="mb-5 shrink-0 px-6 md:mb-6">
        <SectionHeading className="mb-0">Work</SectionHeading>
      </div>

      <div
        className="site-corner mx-6 flex flex-col overflow-hidden md:h-auto md:min-h-0 md:flex-1 md:flex-row"
        style={{ gap: GAP }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {projects.map((project, i) => {
          return (
            <FeaturedProjectCard
              key={project.id}
              project={project}
              index={i}
              isDesktop={isDesktop}
              activeIndex={activeIndex}
              onActivate={setActiveIndex}
            />
          );
        })}
      </div>

      <div className="mt-5 shrink-0 px-6 md:mt-6">
        <div className="flex w-full gap-[3px] overflow-hidden site-corner">
          {[
            { label: "Experience", href: "/experience" },
            { label: "Projects", href: "/projects" },
          ].map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              className="work-cta-link group block min-w-0"
            >
              <div
                className={`homepage-cta relative flex w-full cursor-pointer items-center justify-center bg-primary py-3 font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-300 group-hover:bg-accent group-focus-visible:bg-accent ${
                  index === 0 ? "rounded-r-none" : "rounded-l-none"
                }`}
              >
                <span className="flex min-w-0 items-center justify-center">
                  <span className="truncate">{item.label}</span>
                  <span className="inline-flex max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-w-[2rem] group-hover:opacity-100">
                    <ArrowUpRight className="ml-2 h-4 w-4 shrink-0" strokeWidth={1.5} />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
};

export default ProjectsSection;
