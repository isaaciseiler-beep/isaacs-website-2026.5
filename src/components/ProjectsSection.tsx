import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects = [
  {
    id: 1,
    title: "Urban Canvas",
    category: "Branding",
    year: "2024",
    description: "Visual identity for an independent gallery merging street culture with contemporary art.",
    image: project1,
  },
  {
    id: 2,
    title: "Concrete Dreams",
    category: "Architecture",
    year: "2024",
    description: "Brutalist photography and editorial design for a new-wave construction collective.",
    image: project2,
  },
  {
    id: 3,
    title: "Neon Nights",
    category: "Photography",
    year: "2023",
    description: "Capturing the electric pulse of urban nightlife through long exposure and color.",
    image: project3,
  },
  {
    id: 4,
    title: "Raw Type",
    category: "Typography",
    year: "2023",
    description: "A custom typeface born from industrial signage, designed for maximum impact at scale.",
    image: project4,
  },
];

const GAP = 3;
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ProjectsSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-12">
      <div className="px-6 mb-6">
        <SectionHeading className="mb-0">Projects</SectionHeading>
      </div>

      <div
        className="flex px-6"
        style={{ gap: GAP, height: "55vh", minHeight: 360 }}
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
              transition={{ duration: 0.7, ease }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {/* Image with ken burns */}
              <motion.img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                animate={{
                  filter: isActive ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.7)",
                  scale: isActive ? 1.0 : 1.2,
                }}
                transition={{ duration: 0.8, ease }}
              />

              {/* Collapsed: vertical label + line */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-end pb-5"
                animate={{ opacity: isActive ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Thin vertical line */}
                <motion.div
                  className="w-px bg-foreground/20 mb-3"
                  animate={{ height: hasActive && !isActive ? 40 : 24 }}
                  transition={{ duration: 0.5, ease }}
                />
                <span
                  className="text-[10px] font-mono tracking-[0.3em] text-foreground/50 uppercase whitespace-nowrap"
                  style={{
                    writingMode: "vertical-lr",
                    transform: "rotate(180deg)",
                  }}
                >
                  {project.title}
                </span>
              </motion.div>

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
                    {/* Gradient */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, transparent 70%)",
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-5 md:p-7">
                      {/* Meta row */}
                      <motion.div
                        className="flex items-center gap-2 mb-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: 0.1 }}
                      >
                        <span className="text-[10px] font-mono tracking-[0.3em] text-foreground/30">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="w-4 h-px bg-foreground/20" />
                        <span className="text-[10px] font-mono tracking-[0.2em] text-foreground/40 uppercase">
                          {project.category}
                        </span>
                        <span className="text-[10px] font-mono tracking-[0.2em] text-foreground/20 uppercase ml-auto">
                          {project.year}
                        </span>
                      </motion.div>

                      {/* Title with stagger per character */}
                      <motion.h3
                        className="text-2xl md:text-4xl font-semibold tracking-tighter text-foreground leading-[0.92] mb-2"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: 0.15 }}
                      >
                        {project.title}
                      </motion.h3>

                      {/* Description */}
                      <motion.p
                        className="text-[13px] text-foreground/45 leading-relaxed max-w-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease, delay: 0.22 }}
                      >
                        {project.description}
                      </motion.p>

                      {/* Underline accent */}
                      <motion.div
                        className="h-px bg-foreground/15 mt-4"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, ease, delay: 0.3 }}
                        style={{ transformOrigin: "left" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection;
