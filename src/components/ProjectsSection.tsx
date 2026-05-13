import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectModal from "@/components/ProjectModal";
import SectionHeading from "@/components/SectionHeading";
import { featuredProjectIds, projectItems, type ProjectItem } from "@/lib/siteContent";

const GAP = 3;
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const EXPAND_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const useCenteredInFrame = <T extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<T | null>(null);
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsCentered(false);
      return;
    }

    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const activeRange = Math.min(window.innerHeight * 0.18, rect.height * 0.45);
      setIsCentered(Math.abs(elementCenter - viewportCenter) <= activeRange);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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
  onOpen: (index: number) => void;
}

const FeaturedProjectCard = ({
  project,
  index,
  isDesktop,
  activeIndex,
  onActivate,
  onOpen,
}: FeaturedProjectCardProps) => {
  const [mobileCardRef, isCenteredMobile] = useCenteredInFrame<HTMLDivElement>(!isDesktop);
  const isActive = isDesktop ? activeIndex === index : true;
  const isImageActive = isDesktop ? isActive : isCenteredMobile;
  const hasActive = activeIndex !== null;

  const card = (
    <motion.div
      ref={mobileCardRef}
      className="group relative h-full min-h-0 flex-1 cursor-pointer overflow-hidden bg-background md:flex-[1_1_0%]"
      style={{ minWidth: 0 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      animate={isDesktop ? { flex: isActive ? 5.8 : hasActive ? 0.9 : 1 } : {}}
      transition={{
        opacity: { duration: 0.55, ease, delay: index * 0.12 },
        flex: { duration: 1.08, ease: EXPAND_EASE },
      }}
      onMouseEnter={() => isDesktop && onActivate(index)}
      onClick={() => isDesktop && onOpen(index)}
    >
      <motion.img
        src={project.image}
        alt={project.title}
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        animate={{
          filter: isImageActive ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.7)",
        }}
        transition={{ duration: 0.85, ease }}
      />

      <motion.div
        className="pointer-events-none absolute -inset-x-px -bottom-1 top-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.76) 18%, rgba(0,0,0,0.34) 52%, transparent 76%)",
        }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.72, ease: EXPAND_EASE }}
      />

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden p-5 md:p-7"
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 14,
          filter: isActive ? "blur(0px)" : "blur(3px)",
          clipPath: isActive ? "inset(0% 0% 0% 0%)" : "inset(18% 0% 0% 0%)",
        }}
        transition={{ duration: 0.64, ease: EXPAND_EASE, delay: isActive ? 0.08 : 0 }}
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
      </motion.div>
    </motion.div>
  );

  if (!isDesktop) {
    return (
      <Link to={`/projects/${project.id}`} className="block min-h-0 flex-1">
        {card}
      </Link>
    );
  }

  return card;
};

const ProjectsSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openProjectIndex, setOpenProjectIndex] = useState<number | null>(null);
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

  useEffect(() => {
    projects.forEach((project) => {
      const image = new Image();
      image.decoding = "async";
      image.src = project.image;
    });
  }, [projects]);

  return (
    <section data-work-scroll-content className="flex flex-col py-0 md:h-[calc(100svh-9.75rem)] md:min-h-[420px]">
      <div className="mb-5 shrink-0 px-6 md:mb-6">
        <SectionHeading className="mb-0">Work</SectionHeading>
      </div>

      <div
        className="site-corner mx-6 flex h-[540px] min-h-0 flex-col overflow-hidden md:h-auto md:flex-1 md:flex-row"
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
              onOpen={setOpenProjectIndex}
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

      <ProjectModal
        projects={projects}
        currentIndex={openProjectIndex}
        onClose={() => setOpenProjectIndex(null)}
        onNavigate={setOpenProjectIndex}
      />
    </section>
  );
};

export default ProjectsSection;
