import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const featured = {
  title: "Urban Canvas",
  subtitle: "Redefining street identity through design",
  category: "Branding / Art Direction",
  year: "2026",
  image: project1,
};

const thumbs = [
  { id: 1, image: project2, label: "Concrete Dreams" },
  { id: 2, image: project3, label: "Neon Nights" },
];

const FeaturedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -10]);

  return (
    <section ref={sectionRef} className="py-16 px-3 md:px-3">
      <div className="flex items-end justify-between mb-4">
        <h2 className="section-heading mb-0">Featured</h2>
        <span className="mono-text">{featured.year}</span>
      </div>

      {/* Hero feature card */}
      <div className="relative overflow-hidden group cursor-pointer">
        <motion.div className="aspect-[16/7] md:aspect-[21/9] overflow-hidden">
          <motion.img
            src={featured.image}
            alt={featured.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105"
            style={{ y: imgY }}
          />
        </motion.div>

        {/* Text overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
          style={{
            background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.7) 40%, transparent 100%)",
            y: textY,
          }}
        >
          <p className="mono-text mb-1">{featured.category}</p>
          <h3 className="text-2xl md:text-4xl font-semibold tracking-tighter text-foreground leading-tight">
            {featured.title}
          </h3>
          <p className="text-sm text-foreground/60 mt-1 max-w-md">
            {featured.subtitle}
          </p>
        </motion.div>

        {/* Corner arrow */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-foreground text-lg">↗</span>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="grid grid-cols-2 gap-[3px] mt-[3px]">
        {thumbs.map((t, i) => (
          <motion.div
            key={t.id}
            className="grid-item aspect-[16/9] cursor-pointer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <img
              src={t.image}
              alt={t.label}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="grid-item-overlay">
              <p className="text-xs font-medium text-foreground">{t.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
