import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const tabs = [
  { id: "projects", label: "Projects" },
  { id: "news", label: "News" },
];

const projectItems = [
  { id: 1, title: "Urban Canvas", subtitle: "Redefining street identity through design", image: project1 },
  { id: 2, title: "Concrete Dreams", subtitle: "Architectural storytelling in concrete", image: project2 },
  { id: 3, title: "Neon Nights", subtitle: "A photographic exploration of city light", image: project3 },
];

const newsItems = [
  { id: 1, title: "Selected for ADC Annual Awards", subtitle: "Urban Canvas recognized in branding", date: "Mar 2026" },
  { id: 2, title: "Speaking at Config 2026", subtitle: "Street culture meets digital design", date: "Feb 2026" },
  { id: 3, title: "Studio Expansion — Brooklyn", subtitle: "New workspace opening Q2 2026", date: "Jan 2026" },
];

const FeaturedSection = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="py-16 px-6 md:px-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pill-button text-xs ${activeTab === tab.id ? "bg-foreground text-background" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero feature card */}
            <div className="relative overflow-hidden group cursor-pointer">
              <motion.div className="aspect-[16/7] md:aspect-[21/9] overflow-hidden">
                <motion.img
                  src={projectItems[0].image}
                  alt={projectItems[0].title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105"
                  style={{ y: imgY }}
                />
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
                style={{
                  background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.7) 40%, transparent 100%)",
                }}
              >
                <h3 className="text-2xl md:text-4xl font-semibold tracking-tighter text-foreground leading-tight">
                  {projectItems[0].title}
                </h3>
                <p className="text-sm text-foreground/60 mt-1 max-w-md">
                  {projectItems[0].subtitle}
                </p>
              </motion.div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-foreground text-lg">↗</span>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-2 gap-[3px] mt-[3px]">
              {projectItems.slice(1).map((t, i) => (
                <motion.div
                  key={t.id}
                  className="grid-item aspect-[16/9] cursor-pointer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <img src={t.image} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="grid-item-overlay">
                    <p className="text-xs font-medium text-foreground">{t.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "news" && (
          <motion.div
            key="news"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-[1px]"
          >
            {newsItems.map((item, index) => (
              <motion.a
                key={item.id}
                href="#"
                className="group block border border-border p-6 hover:bg-card/60 transition-colors duration-300 relative overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1 group-hover:text-foreground/80 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed mb-3">{item.subtitle}</p>
                <div className="flex items-center justify-between">
                  <p className="mono-text">{item.date}</p>
                  <span className="text-foreground text-sm opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300">→</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedSection;
