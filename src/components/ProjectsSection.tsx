import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

const COLS = 3;
const GAP = 3;

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

  // Row 1: fully visible (3 items). Row 2: peek row, gradient covers bottom 70%.
  const visibleProjects = allProjects.slice(0, COLS); // row 1
  const peekProjects = allProjects.slice(COLS, COLS * 2); // row 2 (partially visible)
  const remainingProjects = allProjects.slice(COLS * 2); // rest

  return (
    <section className="py-12 px-6 md:px-6">
      <h2 className="section-heading">Projects</h2>

      <div className="relative">
        <div
          className="grid grid-cols-2 md:grid-cols-3"
          style={{ gap: `${GAP}px` }}
        >
          {/* Row 1 — fully interactive */}
          {visibleProjects.map((project, index) => (
            <ProjectItem key={project.id} project={project} index={index} />
          ))}

          {/* Row 2 — peek row, no hover until expanded */}
          {peekProjects.map((project, index) => (
            <ProjectItem
              key={project.id}
              project={project}
              index={COLS + index}
              hoverEnabled={expanded}
            />
          ))}

          {/* Remaining rows — only when expanded */}
          <AnimatePresence>
            {expanded &&
              remainingProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <ProjectItem
                    project={project}
                    index={COLS * 2 + index}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Fade overlay starting 30% down row 2 + pill button */}
        {!expanded && (
          <div
            className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-6 pointer-events-none"
            style={{
              height: "70%",
              background: `linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 55%)`,
              /* This div covers bottom 70% of the 2-row area, so gradient starts ~30% into row 2 */
            }}
          >
            <button
              onClick={() => setExpanded(true)}
              className="pill-button pointer-events-auto"
            >
              See all
            </button>
          </div>
        )}

        {expanded && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setExpanded(false)}
              className="pill-button"
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
