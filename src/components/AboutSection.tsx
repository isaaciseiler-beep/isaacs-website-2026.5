import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
        <div className="mt-8 md:mt-10 relative">
          {/* Pill outline */}
          <div className="flex items-center gap-3 px-6 py-3.5 rounded-full border-2 border-foreground/40 bg-background w-full relative z-10">
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

          {/* Pop-down CTA — grows from center of pill, triggered once on viewport entry */}
          <div className="absolute left-0 right-0 z-0" style={{ top: "50%" }}>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "auto" }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-b-3xl"
            >
              <button
                className="group relative w-full pt-6 pb-3 bg-foreground overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={() => window.location.href = "/contact"}
              >
                <span
                  className="absolute inset-0 bg-[hsl(var(--highlight))] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
                <motion.span
                  className="relative z-10 text-background flex items-center justify-center text-sm font-mono tracking-[0.2em] uppercase"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.65, duration: 0.35, ease: "easeOut" }}
                >
                  Get in touch
                  <span className="inline-flex overflow-hidden max-w-0 group-hover:max-w-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
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
