import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import AnimatedText from "@/components/AnimatedText";
import { useIsMobile } from "@/hooks/use-mobile";

const words = [
  "Building at the",
  "intersection of AI",
  "and society.",
];

const HeroSection = () => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const isMobile = useIsMobile();
  const textRef = useRef<HTMLDivElement | null>(null);
  const mobileTextInView = useInView(textRef, { amount: 0.85 });

  return (
    <section className="relative flex h-[100svh] min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="relative z-10 px-6 pb-[calc(env(safe-area-inset-bottom)+3.5rem)] md:pb-6"
        style={{ opacity: textOpacity }}
      >
        <div ref={textRef} className="max-w-6xl">
          {words.map((line, index) => (
            <AnimatedText
              key={line}
              text={line}
              as="p"
              className="text-5xl font-semibold leading-[0.85] tracking-tighter text-foreground md:text-7xl lg:text-8xl"
              delay={0.3 + index * 0.08}
              once={false}
              margin="-80px"
              controlledVisible={isMobile ? mobileTextInView : undefined}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
