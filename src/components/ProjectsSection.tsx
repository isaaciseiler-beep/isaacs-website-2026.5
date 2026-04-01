import { motion } from "framer-motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects = [
  { id: 1, title: "Urban Canvas", category: "Branding", image: project1, height: "h-[55vh]", mt: "mt-0" },
  { id: 2, title: "Concrete Dreams", category: "Architecture", image: project2, height: "h-[35vh]", mt: "mt-[20vh]" },
  { id: 3, title: "Neon Nights", category: "Photography", image: project3, height: "h-[50vh]", mt: "mt-[5vh]" },
  { id: 4, title: "Raw Type", category: "Typography", image: project4, height: "h-[40vh]", mt: "mt-[15vh]" },
];

const ProjectsSection = () => {
  return (
    <section className="snap-section relative flex items-start min-w-[200vw] overflow-visible">
      {/* Section label */}
      <div className="absolute top-12 left-16 z-10">
        <motion.p
          className="mono-text mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          01 — Selected Work
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Projects
        </motion.h2>
      </div>

      {/* Pinterest-style grid */}
      <div className="flex items-start gap-4 pt-[28vh] px-16 pb-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className={`grid-item w-[22vw] ${project.height} ${project.mt} flex-shrink-0`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="grid-item-overlay">
              <p className="mono-text mb-1">{project.category}</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground font-display">
                {project.title}
              </h3>
            </div>
          </motion.div>
        ))}

        {/* Spacer for scroll continuation */}
        <div className="flex-shrink-0 w-[10vw]" />
      </div>
    </section>
  );
};

export default ProjectsSection;
