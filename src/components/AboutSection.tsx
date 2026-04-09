import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const statement = "A multidisciplinary creative working at the intersection of design, photography, and technology. Focused on building experiences that feel both intentional and alive.";
const words = statement.split(" ");

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.04,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const AboutSection = () => {
  return (
    <section className="py-12 px-6 md:px-6">
      <SectionHeading>About</SectionHeading>

      <div>
        <p className="text-2xl md:text-3xl leading-snug font-light tracking-tight text-foreground">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.3em]"
              variants={wordVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={i}
            >
              {word}
            </motion.span>
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
