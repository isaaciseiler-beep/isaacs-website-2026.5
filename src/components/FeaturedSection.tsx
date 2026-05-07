import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { featuredProjectIds, projectItems } from "@/lib/siteContent";

const featuredProjects = featuredProjectIds
  .slice(0, 3)
  .map((id) => projectItems.find((project) => project.id === id))
  .filter(Boolean);

const BUFFER = 24;
const GAP = 3;

const FeaturedTile = ({
  image,
  alt,
  filter,
  canHover,
  children,
  className = "",
}: {
  image: string;
  alt: string;
  filter: ReturnType<typeof useTransform>;
  canHover: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const showColor = canHover && hovered;

  return (
    <div
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-full h-full overflow-hidden">
        <motion.img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
          style={{
            filter: showColor ? "grayscale(0%)" : filter,
            transition: showColor ? "filter 0.4s ease-out" : undefined,
          }}
        />
      </div>
      {children}
    </div>
  );
};

const FeaturedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isOutPhase, setIsOutPhase] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track when we've entered the out phase (past midpoint)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsOutPhase(v > 0.50);
  });

  const padding = useTransform(
    scrollYProgress,
    [0, 0.10, 0.30, 0.46, 0.78, 0.92, 1],
    [BUFFER, BUFFER, 0, 0, 0, BUFFER, BUFFER]
  );

  const topGrayscale = useTransform(scrollYProgress, [0.20, 0.30, 0.70, 0.78], [1, 0, 0, 1]);
  const blGrayscale = useTransform(scrollYProgress, [0.30, 0.38, 0.62, 0.70], [1, 0, 0, 1]);
  const brGrayscale = useTransform(scrollYProgress, [0.38, 0.46, 0.54, 0.62], [1, 0, 0, 1]);

  const topFilter = useTransform(topGrayscale, (v) => `grayscale(${v * 100}%)`);
  const blFilter = useTransform(blGrayscale, (v) => `grayscale(${v * 100}%)`);
  const brFilter = useTransform(brGrayscale, (v) => `grayscale(${v * 100}%)`);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <div className="px-6 pt-[68px] pb-4">
          <SectionHeading className="mb-0">Featured</SectionHeading>
        </div>

        <motion.div
          className="flex flex-col flex-1 min-h-0"
          style={{
            paddingLeft: padding,
            paddingRight: padding,
            paddingBottom: padding,
            gap: GAP,
          }}
        >
          {/* Hero card */}
          <FeaturedTile
            image={featuredProjects[0]!.image}
            alt={featuredProjects[0]!.title}
            filter={topFilter}
            canHover={isOutPhase}
            className="flex-1 min-h-0"
          >
            <div
              className="absolute bottom-0 left-0 right-0 p-3"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
              }}
            >
              <h3 className="text-[2rem] md:text-[3.25rem] font-semibold tracking-tighter text-[hsl(200,20%,85%)] leading-tight">
                {featuredProjects[0]!.title}
              </h3>
            </div>
          </FeaturedTile>

          {/* Bottom thumbnails */}
          <div className="grid grid-cols-2 shrink-0" style={{ gap: GAP, height: "28vh" }}>
            <FeaturedTile
              image={featuredProjects[1]!.image}
              alt={featuredProjects[1]!.title}
              filter={blFilter}
              canHover={isOutPhase}
            >
              <div
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
                }}
              >
                <h3 className="text-base md:text-[1.625rem] font-semibold tracking-tighter text-[hsl(200,20%,85%)] leading-tight">
                  Projects archive
                </h3>
              </div>
            </FeaturedTile>

            <FeaturedTile
              image={featuredProjects[2]!.image}
              alt={featuredProjects[2]!.title}
              filter={brFilter}
              canHover={isOutPhase}
            >
              <div
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
                }}
              >
                <h3 className="text-base md:text-[1.625rem] font-semibold tracking-tighter text-[hsl(200,20%,85%)] leading-tight">
                  Photo portfolio
                </h3>
              </div>
            </FeaturedTile>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;
