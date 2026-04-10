import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import headshot1 from "@/assets/headshot.jpg";

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

const statement =
  "A multidisciplinary creative working at the intersection of design, photography, and technology — building experiences that feel intentional and alive.";

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: pageProgress } = useScroll();
  const [hasDeployedPopdown, setHasDeployedPopdown] = useState(false);

  useMotionValueEvent(pageProgress, "change", (v) => {
    if (!hasDeployedPopdown && v >= 0.2) {
      setHasDeployedPopdown(true);
    }
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const words = statement.split(" ");
  let idx = 0;

  return (
    <section ref={sectionRef} className="py-12 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="max-w-5xl">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          <div className="flex-1 min-w-0">
            <p className="text-[1.65rem] md:text-[2.1rem] lg:text-[2.65rem] leading-[1.38] font-light tracking-tight text-foreground">
              {words.map((word) => {
                const ci = idx++;
                return (
                  <motion.span
                    key={`w-${ci}`}
                    className="inline-block mr-[0.28em]"
                    variants={wordVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={ci}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </p>
          </div>

          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="overflow-hidden" style={{ y: imgY }}>
              <img
                src={headshot1}
                alt="Portrait"
                className="w-[180px] h-[180px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Status pill + pop-down CTA */}
        <div className="mt-8 md:mt-10 relative group/pill">
          <div
            ref={pillRef}
            className="relative flex items-center gap-3 px-6 py-3.5 rounded-full border-2 border-foreground bg-background w-full z-10"
          >
            {/* Highlight border overlay — clip-path reveal left-to-right on hover */}
            <span
              className="absolute inset-[-2px] rounded-full border-2 border-[hsl(var(--highlight))] pointer-events-none transition-[clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:inset(0_100%_0_0)] group-hover/pill:[clip-path:inset(0_0%_0_0)]"
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
              Based in Taipei — open to tech communications, GTM & marketing roles
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
                onClick={() => window.location.href = "/contact"}
              >
                <span
                  className="absolute inset-0 bg-[hsl(var(--highlight))] origin-left scale-x-0 group-hover/pill:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
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

