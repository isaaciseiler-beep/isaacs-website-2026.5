import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

// Preload project images
allProjects.forEach((p) => {
  const img = new Image();
  img.src = p.image;
});

const chevronVariants = {
  initial: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "left" ? -20 : 20,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: (dir: "left" | "right") => ({
    opacity: 0,
    x: dir === "left" ? -20 : 20,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  }),
};

const ProjectsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-6">
      <div className="px-6 md:px-6 mb-4">
        <h2 className="section-heading mb-0">Projects</h2>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: 24 }}
        >
          <div
            className="grid grid-rows-2 grid-flow-col gap-[3px] px-6"
            style={{ width: "max-content" }}
          >
            {allProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="grid-item"
                style={{
                  width: "calc(33vw - 12px)",
                  aspectRatio: "4/3",
                  scrollSnapAlign: index % 2 === 0 ? "start" : undefined,
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="grid-item-overlay">
                  <p className="mono-text mb-0.5">{project.category}</p>
                  <h3 className="text-xs font-medium tracking-tight text-foreground">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              key="scroll-left"
              custom="left"
              variants={chevronVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => scroll("left")}
              className="absolute left-8 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-foreground transition-colors"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.85 }}
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              key="scroll-right"
              custom="right"
              variants={chevronVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => scroll("right")}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-foreground transition-colors"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.85 }}
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;
