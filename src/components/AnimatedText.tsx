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

  // Split into words to keep words intact while still animating per-character.
  const words = text.split(" ");
  let charCounter = 0;

  return (
    <MotionTag className={className} style={style}>
      {words.map((word, wIdx) => {
        const isLast = wIdx === words.length - 1;
        return (
          <span
            key={`${text}-w-${wIdx}`}
            className="inline-block whitespace-nowrap"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word.split("").map((char, cIdx) => {
              const i = charCounter++;
              return (
                <motion.span
                  key={`${text}-${wIdx}-${cIdx}`}
                  className="inline-block will-change-transform"
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once, margin }}
                  transition={{
                    delay: delay + i * 0.02,
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </MotionTag>
  );
};

export default AnimatedText;
