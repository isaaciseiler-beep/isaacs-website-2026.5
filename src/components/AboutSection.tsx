import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const statement = "A multidisciplinary creative working at the intersection of design, photography, and technology. Focused on building experiences that feel both intentional and alive.";
const words = statement.split(" ");

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.85"],
  });

  return (
    <section className="py-12 px-6 md:px-6">
      <h2 className="section-heading">About</h2>

      <div className="max-w-3xl" ref={containerRef}>
        <p className="text-2xl md:text-3xl leading-snug font-light tracking-tight">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
          })}
        </p>

        <motion.p
          className="text-sm text-foreground/50 mt-8 leading-relaxed max-w-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Currently available for select projects and collaborations.
        </motion.p>
      </div>
    </section>
  );
};

const Word = ({ children, progress, range }: { children: string; progress: any; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.08, 1]);

  return (
    <span className="inline-block mr-[0.25em]">
      <motion.span style={{ opacity }} className="inline-block text-foreground">
        {children}
      </motion.span>
    </span>
  );
};

export default AboutSection;
