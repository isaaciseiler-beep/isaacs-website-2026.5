import { useState } from "react";
import { motion } from "framer-motion";
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

const ProjectsSection = () => {
  const [expanded, setExpanded] = useState(false);
  const visibleProjects = expanded ? allProjects : allProjects.slice(0, 4);

  return (
    <section className="py-24 px-12 md:px-24">
      <p className="section-label">01 — Selected Work</p>
      <div className="flex items-end justify-between mb-12">
        <h2 className="section-heading mb-0">Projects</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mono-text hover:text-foreground transition-colors duration-200 pb-1"
        >
          {expanded ? "Show less" : "View all"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {visibleProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="grid-item aspect-square"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="grid-item-overlay">
              <p className="mono-text mb-1">{project.category}</p>
              <h3 className="text-sm font-medium tracking-tight text-foreground">
                {project.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
