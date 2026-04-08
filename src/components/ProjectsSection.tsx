import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const allProjects = [
  { id: 1, title: "Urban Canvas", category: "Branding", image: project1 },
  { id: 2, title: "Concrete Dreams", category: "Architecture", image: project2 },
  { id: 3, title: "Neon Nights", category: "Photography", image: project3 },
  { id: 4, title: "Raw Type", category: "Typography", image: project4 },
  { id: 5, title: "Signal", category: "Identity", image: project1 },
  { id: 6, title: "Monolith", category: "Web Design", image: project2 },
  { id: 7, title: "Fracture", category: "Art Direction", image: project3 },
  { id: 8, title: "Drift", category: "Photography", image: project4 },
  { id: 9, title: "Oxide", category: "Branding", image: project1 },
  { id: 10, title: "Lattice", category: "Architecture", image: project2 },
  { id: 11, title: "Flux", category: "Web Design", image: project3 },
  { id: 12, title: "Void", category: "Identity", image: project4 },
];

const COLS = 2;
const GAP = 3;
const VISIBLE_ROWS = 2;

const ProjectItem = ({
  project,
  index,
  hoverEnabled = true,
}: {
  project: (typeof allProjects)[0];
  index: number;
  hoverEnabled?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [8, -8]);

  return (
    <motion.div
      ref={ref}
      className={`grid-item aspect-[4/3] ${!hoverEnabled ? "pointer-events-none" : ""}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
    >
      <motion.img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ y }}
      />
      {hoverEnabled && (
        <div className="grid-item-overlay">
          <p className="mono-text mb-0.5">{project.category}</p>
          <h3 className="text-xs font-medium tracking-tight text-foreground">
            {project.title}
          </h3>
        </div>
      )}
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [expanded, setExpanded] = useState(false);

  // 2 rows visible = 4 items, then peek row, then rest
  const visibleProjects = allProjects.slice(0, COLS * VISIBLE_ROWS);
  const remainingProjects = allProjects.slice(COLS * VISIBLE_ROWS);

  return (
    <section className="py-6 px-6 md:px-6">
      <h2 className="section-heading">Projects</h2>

      <div className="relative">
        <div
          className="grid grid-cols-2"
          style={{ gap: `${GAP}px` }}
        >
          {visibleProjects.map((project, index) => (
            <ProjectItem key={project.id} project={project} index={index} />
          ))}

          <AnimatePresence initial={false}>
            {expanded &&
              remainingProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <ProjectItem
                    project={project}
                    index={COLS * VISIBLE_ROWS + index}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Chevron toggle */}
        <div className="flex justify-center mt-4">
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label={expanded ? "Show less" : "See all"}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
