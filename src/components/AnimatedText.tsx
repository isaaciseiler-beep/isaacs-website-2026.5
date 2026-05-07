import type { CSSProperties } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  as?: "span" | "p";
  className?: string;
  style?: CSSProperties;
  delay?: number;
  once?: boolean;
  margin?: string;
}

const AnimatedText = ({
  text,
  as = "span",
  className = "",
  style,
  delay = 0,
  once = true,
  margin = "-50px",
}: AnimatedTextProps) => {
  const MotionTag = as === "p" ? motion.p : motion.span;

  return (
    <MotionTag className={className} style={style}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${text}-${index}`}
          className="inline-block will-change-transform"
          style={{
            whiteSpace: char === " " ? "pre" : undefined,
            paddingLeft: index === 0 ? "0.04em" : undefined,
            marginLeft: index === 0 ? "-0.04em" : undefined,
          }}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once, margin }}
          transition={{
            delay: delay + index * 0.025,
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </MotionTag>
  );
};

export default AnimatedText;
