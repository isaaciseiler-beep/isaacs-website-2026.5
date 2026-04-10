import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import headshot from "@/assets/headshot.jpg";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fragmentVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

// Split statement into fragments with the photo inserted mid-flow
const before = "A multidisciplinary creative working at the intersection of";
const after = "design, photography, and technology. Focused on building experiences that feel both intentional and alive.";

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const beforeWords = before.split(" ");
  const afterWords = after.split(" ");
  const totalBefore = beforeWords.length;

  return (
    <section ref={sectionRef} className="py-12 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="max-w-4xl">
        {/* Statement with inline headshot */}
        <p className="text-2xl md:text-[2rem] lg:text-4xl leading-[1.3] font-light tracking-tight text-foreground">
          {beforeWords.map((word, i) => (
            <motion.span
              key={`b-${i}`}
              className="inline-block mr-[0.3em]"
              variants={fragmentVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={i}
            >
              {word}
            </motion.span>
          ))}

          {/* Inline headshot — sits in the text flow like a word */}
          <motion.span
            className="inline-block align-middle mr-[0.3em] relative"
            variants={fragmentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={totalBefore}
          >
            <motion.span
              className="inline-block overflow-hidden relative"
              style={{ y: imgY }}
            >
              <img
                src={headshot}
                alt="Portrait"
                className="w-[72px] h-[90px] md:w-[100px] md:h-[125px] lg:w-[120px] lg:h-[150px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                width={768}
                height={1024}
              />
              {/* Subtle noise overlay */}
              <span
                className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 1px, currentColor 1px, currentColor 2px)",
                }}
              />
            </motion.span>
          </motion.span>

          {afterWords.map((word, i) => (
            <motion.span
              key={`a-${i}`}
              className="inline-block mr-[0.3em]"
              variants={fragmentVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={totalBefore + 1 + i}
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* Availability note */}
        <motion.div
          className="mt-10 flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 bg-[hsl(68,100%,81%)] animate-pulse" />
          <span className="text-sm font-mono tracking-[0.15em] text-foreground/40 uppercase">
            Available for select projects
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
