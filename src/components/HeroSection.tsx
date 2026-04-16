import { motion, useScroll, useTransform } from "framer-motion";
import { bioLines } from "@/lib/siteContent";

const lineVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.25 + i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative h-screen flex items-end overflow-hidden mb-16 md:mb-24">
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="relative z-10 px-6 pb-6 pl-16 md:pl-20"
        style={{ opacity: textOpacity }}
      >
        <div className="max-w-6xl space-y-3">
          {bioLines.map((line, index) => (
            <motion.p
              key={line}
              className="text-2xl font-medium leading-[1.06] tracking-tight text-foreground md:text-4xl lg:text-5xl"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
