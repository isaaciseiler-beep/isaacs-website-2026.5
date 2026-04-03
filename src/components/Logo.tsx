import { motion, useScroll, useTransform } from "framer-motion";

const Logo = () => {
  const { scrollY } = useScroll();
  
  const progress = useTransform(scrollY, [0, 300], [0, 1]);
  
  // "ISAAC" collapses to "I", hide "SAAC"
  const saacWidth = useTransform(progress, [0, 0.7], ["3.2em", "0em"]);
  const saacOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  
  // Space between first and last name shrinks
  const nameSpace = useTransform(progress, [0, 0.7], ["0.35em", "0.12em"]);
  
  // "SEILER" collapses to "S", hide "EILER"  
  const eilerWidth = useTransform(progress, [0, 0.7], ["2.9em", "0em"]);
  const eilerOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  
  // Middle initial "I" fades in between
  const middleWidth = useTransform(progress, [0.3, 0.8], ["0em", "0.9em"]);
  const middleOpacity = useTransform(progress, [0.4, 0.8], [0, 1]);
  
  // Dots fade in
  const dotOpacity = useTransform(progress, [0.5, 0.9], [0, 1]);
  const dot1Width = useTransform(progress, [0.5, 0.9], ["0em", "0.35em"]);
  const dot2Width = useTransform(progress, [0.5, 0.9], ["0em", "0.35em"]);
  const dot3Width = useTransform(progress, [0.5, 0.9], ["0em", "0.35em"]);

  return (
    <div className="flex items-center select-none">
      <span className="font-sans text-[14px] font-semibold tracking-[0.06em] uppercase text-foreground flex overflow-hidden whitespace-nowrap leading-none">
        {/* I */}
        <span>I</span>
        {/* SAAC */}
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: saacWidth, opacity: saacOpacity }}
        >
          SAAC
        </motion.span>
        {/* Dot after I */}
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: dot1Width, opacity: dotOpacity }}
        >
          .
        </motion.span>
        
        {/* Space */}
        <motion.span className="inline-block will-change-[width]" style={{ width: nameSpace }} />
        
        {/* Middle I (appears on collapse) */}
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: middleWidth, opacity: middleOpacity }}
        >
          I.
        </motion.span>
        
        {/* S */}
        <span>S</span>
        {/* EILER */}
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: eilerWidth, opacity: eilerOpacity }}
        >
          EILER
        </motion.span>
        {/* Dot after S */}
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: dot3Width, opacity: dotOpacity }}
        >
          .
        </motion.span>
      </span>
    </div>
  );
};

export default Logo;
