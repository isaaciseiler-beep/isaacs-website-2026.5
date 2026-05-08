import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProjectModal from "@/components/ProjectModal";
import SectionHeading from "@/components/SectionHeading";
import { featuredProjectIds, projectItems, type ProjectItem } from "@/lib/siteContent";

const GAP = 3;
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ProjectsSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openProjectIndex, setOpenProjectIndex] = useState<number | null>(null);
  const projects: ProjectItem[] = featuredProjectIds
    .map((id) => projectItems.find((project) => project.id === id))
    .filter((project): project is ProjectItem => Boolean(project));

  return (
    <section className="py-12">
      <div className="px-6 mb-6">
        <SectionHeading className="mb-0">Projects</SectionHeading>
      </div>

      <div
        className="flex px-6"
        style={{ gap: GAP, height: "55vh", minHeight: 340 }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {projects.map((project, i) => {
          const isActive = activeIndex === i;
          const hasActive = activeIndex !== null;

          return (
            <motion.div
              key={project.id}
              className="relative overflow-hidden cursor-pointer"
              style={{ minWidth: 0 }}
              animate={{
                flex: isActive ? 6 : hasActive ? 0.8 : 1,
              }}
              transition={{ duration: 0.85, ease }}
              onMouseEnter={() => setActiveIndex(i)}
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
        <Link to="/projects" className="block">
          <motion.div
            className="group relative w-full py-2.5 text-sm font-mono tracking-[0.2em] uppercase rounded-full bg-foreground overflow-hidden flex items-center justify-center cursor-pointer"
            whileTap={{ scale: 0.995 }}
          >
            <span
              className="absolute inset-0 bg-[hsl(var(--highlight))] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            />
            <span className="relative z-10 text-background flex items-center justify-center">
              Explore my work
              <span className="inline-flex overflow-hidden max-w-0 group-hover:max-w-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" strokeWidth={1.5} />
              </span>
            </span>
          </motion.div>
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
