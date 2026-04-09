import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import SectionHeading from "@/components/SectionHeading";

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

  // Padding: starts at 24, shrinks to 0 when content is fully in view, grows back on exit
  const padding = useTransform(
    scrollYProgress,
    [0, 0.15, 0.28, 0.65, 0.78, 1],
    [24, 24, 0, 0, 24, 24]
  );

  const gap = useTransform(
    scrollYProgress,
    [0, 0.15, 0.28, 0.65, 0.78, 1],
    [3, 3, 0, 0, 3, 3]
  );

  // Sequential color reveal
  const topGrayscale = useTransform(scrollYProgress, [0.26, 0.38], [1, 0]);
  const bottomRightGrayscale = useTransform(scrollYProgress, [0.36, 0.48], [1, 0]);
  const bottomLeftGrayscale = useTransform(scrollYProgress, [0.46, 0.58], [1, 0]);

  const topFilter = useTransform(topGrayscale, (v) => `grayscale(${v * 100}%)`);
  const blFilter = useTransform(bottomLeftGrayscale, (v) => `grayscale(${v * 100}%)`);
  const brFilter = useTransform(bottomRightGrayscale, (v) => `grayscale(${v * 100}%)`);

  return (
    <section ref={sectionRef} className="relative -mt-4 md:-mt-6" style={{ minHeight: "140vh" }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Header — sits just below the header gradient */}
        <div className="px-6 pt-[68px] pb-4">
          <SectionHeading className="mb-0">Featured</SectionHeading>
        </div>

        {/* Content area fills remaining space with animated padding on all sides */}
        <motion.div
          className="flex flex-col flex-1 min-h-0"
          style={{
            paddingLeft: padding,
            paddingRight: padding,
            paddingBottom: padding,
            gap,
          }}
        >
          {/* Hero feature card — takes remaining space */}
          <div className="relative overflow-hidden cursor-pointer flex-1 min-h-0">
            <div className="w-full h-full overflow-hidden">
              <motion.img
                src={projectItems[0].image}
                alt={projectItems[0].title}
                className="w-full h-full object-cover"
                style={{ filter: topFilter }}
              />
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
              style={{
                background:
                  "linear-gradient(to top, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.4) 60%, transparent 100%)",
              }}
            >
              <h3 className="text-2xl md:text-4xl font-semibold tracking-tighter text-foreground leading-tight">
                {projectItems[0].title}
              </h3>
              <p className="text-sm text-foreground/60 mt-1 max-w-md">
                {projectItems[0].subtitle}
              </p>
            </div>
          </div>

          {/* Thumbnail strip — fixed height */}
          <motion.div className="grid grid-cols-2 shrink-0" style={{ gap, height: "28vh" }}>
            {/* Bottom left */}
            <div className="relative overflow-hidden cursor-pointer">
              <motion.img
                src={projectItems[1].image}
                alt={projectItems[1].title}
                className="w-full h-full object-cover"
                style={{ filter: blFilter }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{
                  background:
                    "linear-gradient(to top, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.3) 70%, transparent 100%)",
                }}
              >
                <p className="text-xs font-medium text-foreground">{projectItems[1].title}</p>
                <p className="text-[10px] text-foreground/60 mt-0.5">{projectItems[1].subtitle}</p>
              </div>
            </div>

            {/* Bottom right */}
            <div className="relative overflow-hidden cursor-pointer">
              <motion.img
                src={projectItems[2].image}
                alt={projectItems[2].title}
                className="w-full h-full object-cover"
                style={{ filter: brFilter }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{
                  background:
                    "linear-gradient(to top, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.3) 70%, transparent 100%)",
                }}
              >
                <p className="text-xs font-medium text-foreground">{projectItems[2].title}</p>
                <p className="text-[10px] text-foreground/60 mt-0.5">{projectItems[2].subtitle}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;
