import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const allProjects = [
  { id: 1, title: "Urban Canvas", category: "Branding", image: project1, span: "col-span-3 row-span-2" },
  { id: 2, title: "Concrete Dreams", category: "Architecture", image: project2, span: "col-span-3 row-span-1" },
  { id: 3, title: "Neon Nights", category: "Photography", image: project3, span: "col-span-2 row-span-1" },
  { id: 4, title: "Raw Type", category: "Typography", image: project4, span: "col-span-4 row-span-2" },
  { id: 5, title: "Signal", category: "Identity", image: project1, span: "col-span-2 row-span-1" },
  { id: 6, title: "Monolith", category: "Web Design", image: project2, span: "col-span-4 row-span-1" },
  { id: 7, title: "Fracture", category: "Art Direction", image: project3, span: "col-span-3 row-span-2" },
  { id: 8, title: "Drift", category: "Photography", image: project4, span: "col-span-3 row-span-1" },
  { id: 9, title: "Oxide", category: "Branding", image: project1, span: "col-span-2 row-span-1" },
  { id: 10, title: "Lattice", category: "Architecture", image: project2, span: "col-span-4 row-span-2" },
  { id: 11, title: "Flux", category: "Web Design", image: project3, span: "col-span-2 row-span-1" },
  { id: 12, title: "Void", category: "Identity", image: project4, span: "col-span-2 row-span-1" },
];

const ParallaxItem = ({ project, index }: { project: typeof allProjects[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [12, -12]);

  return (
    <motion.div
      ref={ref}
      className={`grid-item ${project.span} min-h-[160px]`}
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
      <div className="grid-item-overlay">
        <p className="mono-text mb-0.5">{project.category}</p>
        <h3 className="text-xs font-medium tracking-tight text-foreground">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [expanded, setExpanded] = useState(false);
  const visibleProjects = expanded ? allProjects : allProjects.slice(0, 4);

  return (
    <section className="py-12 px-5 md:px-6">
      <div className="flex items-end justify-between mb-6">
        <h2 className="section-heading mb-0">Projects</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mono-text hover:text-foreground transition-colors duration-200 pb-0.5"
        >
          {expanded ? "Show less" : "View all"}
        </button>
      </div>

      <div className="grid grid-cols-6 auto-rows-[140px] md:auto-rows-[200px] gap-[3px]">
        {visibleProjects.map((project, index) => (
          <ParallaxItem key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
