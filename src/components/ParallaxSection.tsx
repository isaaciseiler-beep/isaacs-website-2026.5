import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  id?: string;
}

const ParallaxSection = ({ children, offset = 60, className, id }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Non-linear curve: strong at edges (0–0.12, 0.88–1), gentle in middle
  const y = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [offset, offset * 0.08, -offset * 0.08, -offset]);

  return (
    <div ref={ref} id={id} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;
