import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projectItems = [
  { id: 1, title: "Urban Canvas", subtitle: "Redefining street identity through design", image: project1 },
  { id: 2, title: "Concrete Dreams", subtitle: "Architectural storytelling in concrete", image: project2 },
  { id: 3, title: "Neon Nights", subtitle: "A photographic exploration of city light", image: project3 },
];

const FeaturedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="py-16 px-6 md:px-6">
      <h2 className="section-heading">Featured</h2>

      {/* Hero feature card — no gradient overlay */}
      <div className="relative overflow-hidden group cursor-pointer">
        <motion.div className="aspect-[16/7] md:aspect-[21/9] overflow-hidden">
          <motion.img
            src={projectItems[0].image}
            alt={projectItems[0].title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105"
            style={{ y: imgY }}
          />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h3 className="text-2xl md:text-4xl font-semibold tracking-tighter text-foreground leading-tight">
            {projectItems[0].title}
          </h3>
          <p className="text-sm text-foreground/60 mt-1 max-w-md">
            {projectItems[0].subtitle}
          </p>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-foreground text-lg">↗</span>
        </div>
      </div>

      {/* Thumbnail strip with titles and subtitles */}
      <div className="grid grid-cols-2 gap-[3px] mt-[3px]">
        {projectItems.slice(1).map((t) => (
          <div key={t.id} className="grid-item aspect-[16/9] cursor-pointer">
            <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
            <div className="grid-item-overlay">
              <p className="text-xs font-medium text-foreground">{t.title}</p>
              <p className="text-[10px] text-foreground/60 mt-0.5">{t.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
