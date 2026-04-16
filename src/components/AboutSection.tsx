import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import headshot1 from "@/assets/headshot.jpg";
import { bioLines } from "@/lib/siteContent";
import { CONTACT_MAILTO } from "@/lib/site";

const wordVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const popdownVariants = {
  closed: { height: 0, y: -18 },
  open: {
    height: 68,
    y: 0,
    transition: {
      duration: 0.58,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const popdownTextVariants = {
  closed: { opacity: 0, y: -4 },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.46,
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [hasDeployedPopdown, setHasDeployedPopdown] = useState(false);

  useEffect(() => {
    if (hasDeployedPopdown) return;

    const handleScrollTrigger = () => {
      const pill = pillRef.current;
      if (!pill) return;

      const rect = pill.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isVisible = rect.top < viewportHeight && rect.bottom > 0;
      const hasBufferBelow = rect.bottom <= viewportHeight * 0.8;

      if (isVisible && hasBufferBelow) {
        setHasDeployedPopdown(true);
      }
    };

    handleScrollTrigger();
    window.addEventListener("scroll", handleScrollTrigger, { passive: true });
    window.addEventListener("resize", handleScrollTrigger);

    return () => {
      window.removeEventListener("scroll", handleScrollTrigger);
      window.removeEventListener("resize", handleScrollTrigger);
    };
  }, [hasDeployedPopdown]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="py-12 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="w-full max-w-[1600px]">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_clamp(320px,34vw,520px)] lg:gap-12">
          <div className="min-w-0 self-stretch pr-4">
            <div className="space-y-4">
              {bioLines.map((line, index) => (
                <motion.p
                  key={line}
                  className="font-light tracking-tight text-foreground"
                  style={{ fontSize: "clamp(1.65rem, 2.6vw, 2.9rem)", lineHeight: 1.02 }}
                  variants={wordVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={index}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>

          <motion.div
            className="relative w-full overflow-hidden justify-self-end"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="aspect-square overflow-hidden" style={{ y: imgY }}>
              <img
                src={headshot1}
                alt="Portrait"
                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Status pill + pop-down CTA */}
        <div className="mt-8 md:mt-10 relative group/pill">
          <div
            ref={pillRef}
            className="relative flex items-center gap-3 px-6 py-3.5 border-2 border-foreground bg-background w-full z-10"
            style={{ borderRadius: "9999px" }}
          >
            {/* Highlight border overlay — clip-path reveal left-to-right on hover */}
            <span
              className="absolute inset-[-2px] border-2 border-[hsl(var(--highlight))] pointer-events-none transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover/pill:[clip-path:inset(0_0%_0_0)]"
              style={{ borderRadius: "9999px", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            />
            <motion.span
              className="rounded-full w-2.5 h-2.5 bg-foreground shrink-0"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-base md:text-lg tracking-[0.02em] text-foreground">
              Currently in the market for tech roles starting Summer 2026
            </span>
          </div>

          <div className="absolute left-0 right-0 z-0 pointer-events-none" style={{ top: "50%" }}>
            <motion.div
              initial="closed"
              animate={hasDeployedPopdown ? "open" : "closed"}
              variants={popdownVariants}
              className="overflow-hidden rounded-b-[26px]"
            >
              <button
                className="relative pointer-events-auto h-[68px] w-full rounded-b-[26px] bg-foreground overflow-hidden cursor-pointer"
                onClick={() => window.location.href = CONTACT_MAILTO}
              >
                <span
                  className="absolute inset-0 bg-[hsl(var(--highlight))] origin-left scale-x-0 group-hover/pill:scale-x-100 transition-transform duration-500"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                />
                <motion.span
                  variants={popdownTextVariants}
                  initial="closed"
                  animate={hasDeployedPopdown ? "open" : "closed"}
                  className="relative z-10 flex h-full items-center justify-center px-6 pt-[26px] text-sm font-mono tracking-[0.2em] uppercase text-background"
                >
                  Get in touch
                  <span className="inline-flex overflow-hidden max-w-0 opacity-0 transition-all duration-300 ease-out group-hover/pill:max-w-[2rem] group-hover/pill:opacity-100">
                    <ArrowRight className="w-4 h-4 ml-2 shrink-0" strokeWidth={1.5} />
                  </span>
                </motion.span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
