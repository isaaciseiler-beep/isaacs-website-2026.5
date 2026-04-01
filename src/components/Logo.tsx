import { motion, useScroll, useTransform } from "framer-motion";

const Logo = () => {
  const { scrollY } = useScroll();
  
  const foldProgress = useTransform(scrollY, [0, 200], [0, 1]);
  
  const isaacRestWidth = useTransform(foldProgress, [0, 1], ["2.6em", "0em"]);
  const dotWidth = useTransform(foldProgress, [0, 1], ["0em", "0.1em"]);
  const spaceWidth = useTransform(foldProgress, [0, 1], ["0.35em", "0.1em"]);
  const seilerRestWidth = useTransform(foldProgress, [0, 1], ["2.6em", "0em"]);
  const collapseOpacity = useTransform(foldProgress, [0, 0.6], [1, 0]);

  return (
    <div className="flex items-center select-none">
      <span className="text-lg font-bold tracking-tight text-foreground flex overflow-hidden whitespace-nowrap">
        {/* I */}
        <span>I</span>
        {/* saac */}
        <motion.span
          className="inline-block overflow-hidden"
          style={{ width: isaacRestWidth, opacity: collapseOpacity }}
        >
          saac
        </motion.span>
        {/* space */}
        <motion.span className="inline-block" style={{ width: spaceWidth }} />
        {/* I. (middle initial, always visible but dot appears on fold) */}
        <span>I</span>
        <motion.span
          className="inline-block overflow-hidden"
          style={{ width: dotWidth, opacity: foldProgress }}
        >
          .
        </motion.span>
        {/* space */}
        <motion.span className="inline-block" style={{ width: spaceWidth }} />
        {/* S */}
        <span>S</span>
        {/* eiler */}
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
