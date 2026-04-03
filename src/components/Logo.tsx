import { motion, useScroll, useTransform } from "framer-motion";

const Logo = () => {
  const { scrollY } = useScroll();
  
  const foldProgress = useTransform(scrollY, [0, 250], [0, 1]);
  
  const isaacRestWidth = useTransform(foldProgress, [0, 1], ["3.1em", "0em"]);
  const dotWidth = useTransform(foldProgress, [0, 1], ["0em", "0.15em"]);
  const spaceWidth = useTransform(foldProgress, [0, 1], ["0.3em", "0.08em"]);
  const seilerRestWidth = useTransform(foldProgress, [0, 1], ["2.8em", "0em"]);
  const collapseOpacity = useTransform(foldProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex items-center select-none">
      <span className="logo-font text-base tracking-normal text-foreground flex overflow-hidden whitespace-nowrap">
        <span>I</span>
        <motion.span
          className="inline-block overflow-hidden"
          style={{ width: isaacRestWidth, opacity: collapseOpacity }}
        >
          saac
        </motion.span>
        <motion.span className="inline-block" style={{ width: spaceWidth }} />
        <span>I</span>
        <motion.span
          className="inline-block overflow-hidden"
          style={{ width: dotWidth, opacity: foldProgress }}
        >
          .
        </motion.span>
        <motion.span className="inline-block" style={{ width: spaceWidth }} />
        <span>S</span>
        <motion.span
          className="inline-block overflow-hidden"
          style={{ width: seilerRestWidth, opacity: collapseOpacity }}
        >
          eiler
        </motion.span>
      </span>
    </div>
  );
};

export default Logo;
