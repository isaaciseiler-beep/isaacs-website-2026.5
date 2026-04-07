import { motion, useScroll, useTransform } from "framer-motion";

const words = ["Crafting visual", "experiences that", "resonate."];

const letterVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.3 + i * 0.02,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  let globalIndex = 0;

  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="relative z-10 px-6 md:px-6 pb-8 md:pb-10 max-w-3xl"
        style={{ opacity: textOpacity }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-[0.92] text-foreground">
          {words.map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.split("").map((char) => {
                const i = globalIndex++;
                return (
                  <motion.span
                    key={`${lineIdx}-${i}`}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : undefined }}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>
      </motion.div>
    </section>
  );
};

export default HeroSection;
