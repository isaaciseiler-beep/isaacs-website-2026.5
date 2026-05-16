import { useRef, ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  id?: string;
  clip?: boolean;
}

const ParallaxSection = ({ children, offset = 60, className, id, clip = true }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [offset, offset * 0.05, -offset * 0.05, -offset]);

  return (
    <div ref={ref} id={id} className={`relative ${className ?? ""}`} style={clip ? { overflow: "hidden" } : undefined}>
      <motion.div style={prefersReducedMotion ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;
