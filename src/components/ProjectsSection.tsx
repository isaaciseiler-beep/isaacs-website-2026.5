import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectModal from "@/components/ProjectModal";
import SectionHeading from "@/components/SectionHeading";
import { featuredProjectIds, projectItems, type ProjectItem } from "@/lib/siteContent";

const GAP = 3;
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

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
      className="group relative overflow-hidden cursor-pointer aspect-[4/3] md:aspect-auto md:flex-[1_1_0%]"
      style={{ minWidth: 0 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      animate={isDesktop ? { flex: isActive ? 6 : hasActive ? 0.8 : 1 } : {}}
      transition={{
        opacity: { duration: 0.55, ease, delay: index * 0.12 },
        flex: { duration: 0.85, ease },
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

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, transparent 70%)",
              }}
            />

            <div className="relative z-10 p-5 md:p-7">
              <motion.h3
                className="text-xl md:text-3xl font-semibold tracking-tighter text-white leading-[0.95] mb-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.15 }}
              >
                {project.title}
              </motion.h3>

              {isDesktop ? (
                <motion.p
                  className="text-[13px] text-white/65 leading-relaxed max-w-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.22 }}
                >
                  {project.summary}
                </motion.p>
              ) : (
                <motion.span
                  className="inline-flex items-center text-base font-normal tracking-tight text-white/80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.22 }}
                >
                  Read more
                  <motion.span
                    className="inline-flex overflow-hidden"
                    animate={{
                      maxWidth: isImageActive ? "2rem" : "0rem",
                      opacity: isImageActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.35, ease }}
                  >
                    <ArrowUpRight className="w-4 h-4 ml-2 shrink-0" strokeWidth={1.5} />
                  </motion.span>
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (!isDesktop) {
    return (
      <Link to={`/projects/${project.id}`} className="block">
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
    <section className="py-12">
      <div className="px-6 mb-6">
        <SectionHeading className="mb-0">Work</SectionHeading>
      </div>

      <div
        className="site-corner mx-6 flex h-auto flex-col overflow-hidden md:h-[66vh] md:min-h-[408px] md:flex-row"
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

      <div className="px-6 mt-6">
        <div className="flex w-full gap-[3px] md:w-1/2">
          {[
            { label: "Experience", href: "/experience" },
            { label: "Projects", href: "/projects" },
          ].map((item) => (
            <Link key={item.href} to={item.href} className="block min-w-0 flex-1">
              <div className="site-corner homepage-cta group relative flex w-full cursor-pointer items-center justify-center bg-primary py-3 font-mono text-sm uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-accent">
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
