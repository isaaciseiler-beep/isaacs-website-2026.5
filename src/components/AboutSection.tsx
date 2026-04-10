import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import headshot1 from "@/assets/headshot.jpg";
import headshot2 from "@/assets/headshot-2.jpg";
import headshot3 from "@/assets/headshot-3.jpg";

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

  const y1 = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const y3 = useTransform(scrollYProgress, [0, 1], [15, -15]);

  const words = statement.split(" ");
  // Insert photos after specific word indices
  const photo1After = 8; // after "intersection"
  const photo2After = 14; // after "technology"

  let idx = 0;

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="max-w-5xl">
        {/* Large headshot — hero presence */}
        <div className="flex items-start gap-6 md:gap-10 mb-12 md:mb-16">
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="overflow-hidden" style={{ y: y1 }}>
              <img
                src={headshot1}
                alt="Portrait"
                className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Secondary photos stacked */}
          <motion.div
            className="flex flex-col gap-3 mt-6 md:mt-10"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="overflow-hidden rounded-full" style={{ y: y2 }}>
              <img
                src={headshot2}
                alt="Profile"
                className="w-[80px] h-[44px] md:w-[110px] md:h-[60px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </motion.div>
            <motion.div className="overflow-hidden rounded-full" style={{ y: y3 }}>
              <img
                src={headshot3}
                alt="At work"
                className="w-[72px] h-[40px] md:w-[100px] md:h-[54px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Statement */}
        <p className="text-[1.6rem] md:text-[2.1rem] lg:text-[2.6rem] leading-[1.38] font-light tracking-tight text-foreground max-w-4xl">
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

        {/* Status pill */}
        <motion.div
          className="mt-10 md:mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-foreground/10">
            {/* Breathing pulse circle */}
            <span className="relative flex items-center justify-center w-3 h-3 shrink-0">
              <motion.span
                className="absolute rounded-full bg-foreground"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.8, 0.2, 0.8],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ width: "100%", height: "100%" }}
              />
              <span className="relative rounded-full w-2 h-2 bg-foreground" />
            </span>
            <span className="text-sm tracking-[0.02em] text-background">
              Based in Taipei — open to tech communications, GTM & marketing roles
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
