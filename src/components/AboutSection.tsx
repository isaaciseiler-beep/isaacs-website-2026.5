import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import headshot1 from "@/assets/headshot.jpg";
import headshot2 from "@/assets/headshot-2.jpg";
import headshot3 from "@/assets/headshot-3.jpg";

const fragmentVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.045,
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const frag1 = "A multidisciplinary creative working at the intersection of";
const frag2 = "design, photography, and technology — building experiences that feel";
const frag3 = "intentional and alive.";

interface InlineImgProps {
  src: string;
  alt: string;
  shape: "square" | "pill";
  index: number;
  y: any;
  className?: string;
}

const InlineImg = ({ src, alt, shape, index, y, className = "" }: InlineImgProps) => (
  <motion.span
    className="inline-block align-middle mx-[0.12em] relative"
    variants={fragmentVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    custom={index}
  >
    <motion.span
      className={`inline-block overflow-hidden relative ${shape === "pill" ? "rounded-full" : ""}`}
      style={{ y }}
    >
      <img
        src={src}
        alt={alt}
        className={`object-cover grayscale hover:grayscale-0 transition-all duration-700 ${className}`}
        loading="lazy"
      />
    </motion.span>
  </motion.span>
);

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const y3 = useTransform(scrollYProgress, [0, 1], [16, -16]);

  const words1 = frag1.split(" ");
  const words2 = frag2.split(" ");
  const words3 = frag3.split(" ");

  let idx = 0;

  const renderWords = (words: string[]) =>
    words.map((word) => {
      const ci = idx++;
      return (
        <motion.span
          key={`w-${ci}`}
          className="inline-block mr-[0.28em]"
          variants={fragmentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          custom={ci}
        >
          {word}
        </motion.span>
      );
    });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="max-w-5xl">
        {/* Hero headshot — prominent */}
        <motion.div
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="overflow-hidden rounded-full w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px]"
            style={{ y: y1 }}
          >
            <img
              src={headshot1}
              alt="Portrait"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* Statement with inline photos */}
        <p className="text-[1.75rem] md:text-[2.25rem] lg:text-[2.8rem] leading-[1.4] font-light tracking-tight text-foreground">
          {renderWords(words1)}

          <InlineImg
            src={headshot2}
            alt="Profile"
            shape="pill"
            index={idx++}
            y={y2}
            className="w-[72px] h-[40px] md:w-[96px] md:h-[52px] lg:w-[120px] lg:h-[64px]"
          />

          {renderWords(words2)}

          <InlineImg
            src={headshot3}
            alt="At work"
            shape="pill"
            index={idx++}
            y={y3}
            className="w-[68px] h-[38px] md:w-[88px] md:h-[48px] lg:w-[108px] lg:h-[58px]"
          />

          {renderWords(words3)}
        </p>

        {/* Status bar */}
        <motion.div
          className="mt-12 md:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 rounded-full bg-[hsl(210,40%,16%)] border border-[hsl(210,30%,24%)]">
            {/* Pulsing status dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(200,80%,65%)] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(200,80%,65%)]" />
            </span>
            <span className="text-xs md:text-sm font-mono tracking-[0.08em] text-[hsl(210,20%,72%)]">
              Based in Taipei — open to tech communications, GTM & marketing roles
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
