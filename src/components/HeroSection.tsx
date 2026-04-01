import { motion, useScroll, useTransform } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 300]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-20"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      </motion.div>

      <motion.div
        className="relative z-10 px-6 md:px-12 pb-12 md:pb-16 max-w-3xl"
        style={{ opacity: textOpacity }}
      >
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-[0.9] text-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Design
          <br />
          <span className="text-muted-foreground">&amp; Build</span>
        </motion.h1>
      </motion.div>
    </section>
  );
};

export default HeroSection;
