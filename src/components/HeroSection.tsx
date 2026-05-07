import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedText from "@/components/AnimatedText";

const words = ["Crafting visual", "experiences that", "resonate."];

const HeroSection = () => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative h-screen flex items-end overflow-hidden mb-16 md:mb-24">
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="relative z-10 px-6 pb-6"
        style={{ opacity: textOpacity }}
      >
        <div className="max-w-6xl">
          {words.map((line, index) => (
            <AnimatedText
              key={line}
              text={line}
              as="p"
              className="text-5xl font-semibold leading-[0.85] tracking-tighter text-foreground md:text-7xl lg:text-8xl"
              delay={0.3 + index * 0.08}
              once={false}
              margin="-80px"
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
