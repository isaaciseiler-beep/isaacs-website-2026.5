import { motion, useScroll, useTransform } from "framer-motion";

const Logo = () => {
  const { scrollY } = useScroll();
  
  const foldProgress = useTransform(scrollY, [0, 300], [0, 1]);
  
  const isaacRestWidth = useTransform(foldProgress, [0, 1], ["3.4em", "0em"]);
  const dotWidth = useTransform(foldProgress, [0, 0.8, 1], ["0em", "0em", "0.18em"]);
  const spaceWidth = useTransform(foldProgress, [0, 1], ["0.25em", "0.06em"]);
  const seilerRestWidth = useTransform(foldProgress, [0, 1], ["3em", "0em"]);
  const collapseOpacity = useTransform(foldProgress, [0, 0.6], [1, 0]);
  const dotOpacity = useTransform(foldProgress, [0.6, 1], [0, 1]);

  return (
    <div className="flex items-center select-none">
      <span className="logo-font text-[15px] tracking-[0.04em] text-foreground flex overflow-hidden whitespace-nowrap">
        <span>I</span>
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: isaacRestWidth, opacity: collapseOpacity }}
        >
          SAAC
        </motion.span>
        <motion.span className="inline-block will-change-[width]" style={{ width: spaceWidth }} />
        <span>I</span>
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: dotWidth, opacity: dotOpacity }}
        >
          .
        </motion.span>
        <motion.span className="inline-block will-change-[width]" style={{ width: spaceWidth }} />
        <span>S</span>
        <motion.span
          className="inline-block overflow-hidden will-change-[width,opacity]"
          style={{ width: seilerRestWidth, opacity: collapseOpacity }}
        >
          EILER
        </motion.span>
      </span>
    </div>
  );
};

export default Logo;
