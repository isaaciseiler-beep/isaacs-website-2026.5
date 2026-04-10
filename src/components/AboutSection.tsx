import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

const statement =
  "A multidisciplinary creative working at the intersection of design, photography, and technology — building experiences that feel intentional and alive.";

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
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

          {/* Square headshot with its own parallax */}
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

        {/* Status pill — left-to-right reveal */}
        <motion.div
          className="mt-8 md:mt-10"
          initial={{ opacity: 0, x: -60, scaleX: 0.85 }}
          whileInView={{ opacity: 1, x: 0, scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
        >
          <div className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-foreground w-full">
            <motion.span
              className="rounded-full w-2.5 h-2.5 bg-background shrink-0"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-base md:text-lg tracking-[0.02em] text-background">
              Based in Taipei — open to tech communications, GTM & marketing roles
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
