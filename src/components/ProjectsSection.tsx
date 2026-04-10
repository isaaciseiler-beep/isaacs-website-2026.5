import { useState } from "react";
import { motion } from "framer-motion";
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

const COLLAPSED_WIDTH = "8vw";
const GAP = 3;

const ProjectsSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="py-12">
      <div className="px-6 mb-6">
        <SectionHeading className="mb-0">Projects</SectionHeading>
      </div>

      <div
        className="flex px-6"
        style={{ gap: GAP, height: "70vh" }}
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
                flex: isActive ? 5 : hasActive ? 1 : 1,
              }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {/* Image */}
              <motion.img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                animate={{
                  filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                  scale: isActive ? 1.03 : 1.15,
                }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              />

              {/* Dark overlay for collapsed */}
              <motion.div
                className="absolute inset-0 bg-background/40"
                animate={{ opacity: isActive ? 0 : 0.3 }}
                transition={{ duration: 0.4 }}
              />

              {/* Vertical title for collapsed state */}
              <motion.div
                className="absolute inset-0 flex items-end justify-center pb-6"
                animate={{ opacity: isActive ? 0 : 1 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className="text-[11px] font-mono tracking-[0.25em] text-foreground/70 uppercase whitespace-nowrap"
                  style={{
                    writingMode: "vertical-lr",
                    transform: "rotate(180deg)",
                  }}
                >
                  {project.title}
                </span>
              </motion.div>

              {/* Number badge — always visible */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-mono tracking-widest text-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Expanded content overlay */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
                }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 20,
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: isActive ? 0.15 : 0 }}
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[10px] font-mono tracking-widest text-foreground/40 uppercase">
                    {project.category}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-foreground/25 uppercase">
                    {project.year}
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-semibold tracking-tighter text-foreground leading-[0.95] mb-3">
                  {project.title}
                </h3>
                <p className="text-sm text-foreground/50 leading-relaxed max-w-md">
                  {project.description}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection;
