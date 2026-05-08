import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectModal from "@/components/ProjectModal";
import SectionHeading from "@/components/SectionHeading";
import { featuredProjectIds, projectItems, type ProjectItem } from "@/lib/siteContent";

const GAP = 3;
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

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
  const projects: ProjectItem[] = featuredProjectIds
    .map((id) => projectItems.find((project) => project.id === id))
    .filter((project): project is ProjectItem => Boolean(project));

  return (
    <section className="py-12">
      <div className="px-6 mb-6">
        <SectionHeading className="mb-0">Projects</SectionHeading>
      </div>

      <div
        className="flex flex-col md:flex-row px-6 h-auto md:h-[66vh] md:min-h-[408px]"
        style={{ gap: GAP }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {projects.map((project, i) => {
          const isActive = !isDesktop || activeIndex === i;
          const hasActive = activeIndex !== null;

          return (
            <motion.div
              key={project.id}
              className="relative overflow-hidden cursor-pointer aspect-[4/3] md:aspect-auto md:flex-[1_1_0%]"
              style={{ minWidth: 0 }}
              animate={isDesktop ? { flex: isActive ? 6 : hasActive ? 0.8 : 1 } : {}}
              transition={{ duration: 0.85, ease }}
              onMouseEnter={() => isDesktop && setActiveIndex(i)}
              onClick={() => setOpenProjectIndex(i)}
            >
              {/* Image */}
              <motion.img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                animate={{
                  filter: isActive ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.7)",
                  scale: isActive ? 1.0 : 1.2,
                }}
                transition={{ duration: 0.85, ease }}
              />

              {/* Collapsed: no label, just the photo */}

              {/* Expanded overlay */}
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
                      <motion.div
                        className="flex items-center gap-2 mb-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: 0.1 }}
                      >
                        <span className="text-[10px] font-mono tracking-[0.3em] text-[#f3f6ff]/50">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="w-4 h-px bg-[#f3f6ff]/30" />
                        <span className="text-[10px] font-mono tracking-[0.2em] text-[#f3f6ff]/60 uppercase">
                          {project.source}
                        </span>
                        <span className="text-[10px] font-mono tracking-[0.2em] text-[#f3f6ff]/40 uppercase ml-auto">
                          {project.year}
                        </span>
                      </motion.div>

                      <motion.h3
                        className="text-xl md:text-3xl font-semibold tracking-tighter text-white leading-[0.95] mb-2"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: 0.15 }}
                      >
                        {project.title}
                      </motion.h3>

                      <motion.p
                        className="text-[13px] text-white/65 leading-relaxed max-w-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: 0.22 }}
                      >
                        {project.summary}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Explore button */}
      <div className="px-6 mt-6">
        <Link to="/projects" className="block w-full md:w-1/2">
          <div className="group relative w-full py-3 text-sm font-mono tracking-[0.2em] uppercase bg-[hsl(50_33%_7%)] text-[hsl(200_25%_83%)] hover:text-[hsl(var(--highlight))] transition-colors duration-300 flex items-center justify-center cursor-pointer">
            <span className="flex items-center justify-center">
              My Work
              <span className="inline-flex overflow-hidden max-w-0 group-hover:max-w-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <ArrowUpRight className="w-4 h-4 ml-2 shrink-0" strokeWidth={1.5} />
              </span>
            </span>
          </div>
        </Link>
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
