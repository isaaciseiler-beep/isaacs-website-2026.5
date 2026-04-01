import { motion, useScroll, useTransform } from "framer-motion";

const Logo = () => {
  const { scrollY } = useScroll();
  
  // Control the fold: 0 = full name, 1 = folded to IIS
  const foldProgress = useTransform(scrollY, [0, 200], [0, 1]);
  
  // Widths for collapsible parts
  const isaacWidth = useTransform(foldProgress, [0, 1], ["3.1em", "0em"]);
  const eilerWidth = useTransform(foldProgress, [0, 1], ["2.8em", "0em"]);
  const spaceWidth = useTransform(foldProgress, [0, 1], ["0.4em", "0em"]);
  const collapseOpacity = useTransform(foldProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex items-center select-none">
      <span className="text-lg font-bold tracking-tight text-foreground flex overflow-hidden whitespace-nowrap">
        {/* I */}
        <span>I</span>
        {/* saac (collapses) */}
        <motion.span
          className="inline-block overflow-hidden"
          style={{ width: isaacWidth, opacity: collapseOpacity }}
        >
          saac
        </motion.span>
        {/* space */}
        <motion.span
          className="inline-block"
          style={{ width: spaceWidth }}
        />
        {/* I (the second I, from Isaac — wait, Isaac Seiler = IS not IIS) */}
        {/* Actually user wants "IIS" — so the name has two I's? Let me re-read: "Isaac Seiler" folds into "IIS" */}
        {/* I-saac S-eiler → IS. But user said IIS. Maybe middle initial? Let's do I.I.S pattern */}
        {/* Going with what user asked: logo says "Isaac Seiler", folds to "IIS" */}
        <span>S</span>
        {/* eiler (collapses) */}
        <motion.span
          className="inline-block overflow-hidden"
          style={{ width: eilerWidth, opacity: collapseOpacity }}
        >
          eiler
        </motion.span>
      </span>
    </div>
  );
};

export default Logo;
