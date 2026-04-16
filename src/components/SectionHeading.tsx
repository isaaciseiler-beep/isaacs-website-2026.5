import { motion } from "framer-motion";

interface SectionHeadingProps {
  children: string;
  className?: string;
}

const SectionHeading = ({ children, className = "" }: SectionHeadingProps) => {
  return (
    <h2 className={`section-heading overflow-visible pl-10 md:pl-12 ${className}`}>
      {children.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            delay: i * 0.025,
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </h2>
  );
};

export default SectionHeading;
