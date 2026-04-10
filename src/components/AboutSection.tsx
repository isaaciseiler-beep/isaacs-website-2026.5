import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import headshot1 from "@/assets/headshot.jpg";
import headshot2 from "@/assets/headshot-2.jpg";
import headshot3 from "@/assets/headshot-3.jpg";

const fragmentVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.05,
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

// Three text fragments with photos woven between them
const frag1 = "A multidisciplinary creative at the intersection of";
const frag2 = "design, photography, and technology.";
const frag3 = "Building experiences that feel intentional";
const frag4 = "and alive.";

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
    className="inline-block align-middle mx-[0.15em] relative"
    variants={fragmentVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    custom={index}
  >
    <motion.span
      className={`inline-block overflow-hidden relative ${
        shape === "pill" ? "rounded-full" : ""
      }`}
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

  const y1 = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const y3 = useTransform(scrollYProgress, [0, 1], [18, -18]);

  const words1 = frag1.split(" ");
  const words2 = frag2.split(" ");
  const words3 = frag3.split(" ");
  const words4 = frag4.split(" ");

  let idx = 0;

  const renderWords = (words: string[]) =>
    words.map((word, i) => {
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
    <section ref={sectionRef} className="py-12 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="max-w-4xl">
        <p className="text-[1.65rem] md:text-[2rem] lg:text-[2.4rem] leading-[1.35] font-light tracking-tight text-foreground">
          {renderWords(words1)}

          {/* Photo 1 — pill shaped, profile shot */}
          <InlineImg
            src={headshot2}
            alt="Profile"
            shape="pill"
            index={idx++}
            y={y1}
            className="w-[60px] h-[36px] md:w-[80px] md:h-[48px] lg:w-[100px] lg:h-[60px]"
          />

          {renderWords(words2)}

          {" "}

          {renderWords(words3)}

          {/* Photo 2 — square, main headshot */}
          <InlineImg
            src={headshot1}
            alt="Portrait"
            shape="square"
            index={idx++}
            y={y2}
            className="w-[42px] h-[42px] md:w-[56px] md:h-[56px] lg:w-[68px] lg:h-[68px]"
          />

          {renderWords(words4)}

          {/* Photo 3 — pill, working shot */}
          <InlineImg
            src={headshot3}
            alt="At work"
            shape="pill"
            index={idx++}
            y={y3}
            className="w-[70px] h-[36px] md:w-[90px] md:h-[46px] lg:w-[110px] lg:h-[56px]"
          />
        </p>

        {/* Availability */}
        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
          <span className="text-sm font-mono tracking-[0.15em] text-foreground/40 uppercase">
            Available for select projects
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
