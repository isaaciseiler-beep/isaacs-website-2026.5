import { motion, useScroll, useTransform } from "framer-motion";

const Logo = () => {
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, 300], [0, 1]);

  // "SAAC" collapses
  const saacWidth = useTransform(progress, [0, 0.7], ["3.2em", "0em"]);
  const saacOpacity = useTransform(progress, [0, 0.5], [1, 0]);

  // Space between names shrinks to 0
  const nameSpace = useTransform(progress, [0, 0.7], ["0.35em", "0em"]);

  // "EILER" collapses
  const eilerWidth = useTransform(progress, [0, 0.7], ["3.5em", "0em"]);
  const eilerOpacity = useTransform(progress, [0, 0.5], [1, 0]);

  // Middle "I" appears
  const middleWidth = useTransform(progress, [0.3, 0.8], ["0em", "0.75em"]);
  const middleOpacity = useTransform(progress, [0.4, 0.8], [0, 1]);

  return (
    <div className="flex items-center select-none mr-2">
      <span className="font-mono text-[13px] font-normal tracking-[0.05em] uppercase text-foreground flex overflow-visible whitespace-nowrap leading-none">
        {/* I */}
        <span>I</span>
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: saacWidth, opacity: saacOpacity }}
        >
          SAAC
        </motion.span>

        {/* Space */}
        <motion.span className="inline-block will-change-[width]" style={{ width: nameSpace }} />

        {/* Middle I (appears on collapse) */}
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: middleWidth, opacity: middleOpacity }}
        >
          I
        </motion.span>

        {/* S */}
        <span>S</span>
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: eilerWidth, opacity: eilerOpacity }}
        >
          EILER
        </motion.span>
      </span>
    </div>
  );
};

export default Logo;
