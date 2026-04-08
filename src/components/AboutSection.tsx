import { motion } from "framer-motion";

const lines = [
  "A multidisciplinary creative",
  "working at the intersection of",
  "design, photography, and",
  "technology. Focused on building",
  "experiences that feel both",
  "intentional and alive.",
];

const letterVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.015,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const AboutSection = () => {
  let globalIndex = 0;

  return (
    <section className="py-12 px-6 md:px-6">
      <h2 className="section-heading">About</h2>

      <div className="max-w-3xl">
        <p className="text-2xl md:text-3xl leading-snug font-light tracking-tight text-foreground">
          {lines.map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.split("").map((char) => {
                const i = globalIndex++;
                return (
                  <motion.span
                    key={`${lineIdx}-${i}`}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : undefined }}
                    variants={letterVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    custom={i}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </p>

        <motion.p
          className="text-sm text-foreground/50 mt-8 leading-relaxed max-w-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Currently available for select projects and collaborations.
        </motion.p>
      </div>
    </section>
  );
};

export default AboutSection;
