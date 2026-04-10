import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    description:
      "A complete visual identity system for an independent gallery space, merging street culture with contemporary art direction.",
    tags: ["Identity", "Print", "Digital"],
    image: project1,
  },
  {
    id: 2,
    title: "Concrete Dreams",
    category: "Architecture",
    year: "2024",
    description:
      "Architectural storytelling through brutalist photography and editorial design for a new-wave construction collective.",
    tags: ["Photography", "Editorial", "Art Direction"],
    image: project2,
  },
  {
    id: 3,
    title: "Neon Nights",
    category: "Photography",
    year: "2023",
    description:
      "A photographic exploration of city light — capturing the electric pulse of urban nightlife through long exposure and color theory.",
    tags: ["Photography", "Color", "Exhibition"],
    image: project3,
  },
  {
    id: 4,
    title: "Raw Type",
    category: "Typography",
    year: "2023",
    description:
      "A custom typeface born from industrial signage and warehouse lettering, designed for maximum impact at any scale.",
    tags: ["Type Design", "Branding", "Digital"],
    image: project4,
  },
];

const ProjectCard = ({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity }}
      className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-start ${
        index > 0 ? "mt-16 md:mt-24" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`md:col-span-7 overflow-hidden cursor-pointer group ${
          isEven ? "md:order-1" : "md:order-2"
        }`}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover grayscale transition-[filter] duration-700 ease-out group-hover:grayscale-0"
            style={{ y: imgY, scale: 1.16 }}
          />
        </div>
      </div>

      {/* Text */}
      <div
        className={`md:col-span-5 flex flex-col justify-between py-2 md:py-4 ${
          isEven ? "md:order-2 md:pl-6" : "md:order-1 md:pr-6"
        }`}
      >
        {/* Top: number + category */}
        <div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-foreground/30 uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-foreground/40 uppercase">
              {project.category}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-foreground/25 uppercase ml-auto">
              {project.year}
            </span>
          </div>

          <h3 className="text-3xl md:text-5xl font-semibold tracking-tighter text-foreground leading-[0.95] mb-4">
            {project.title}
          </h3>

          <p className="text-sm text-foreground/50 leading-relaxed max-w-sm">
            {project.description}
          </p>
        </div>

        {/* Bottom: tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono tracking-wider text-foreground/30 border border-foreground/10 px-2 py-1 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="px-6 mb-10 md:mb-16">
        <SectionHeading className="mb-0">Projects</SectionHeading>
      </div>

      <div className="px-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
