import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-20"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      </div>

      <div className="relative z-10 px-12 md:px-24 max-w-4xl">
        <motion.p
          className="mono-text mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Creative Portfolio — 2026
        </motion.p>

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

        <motion.div
          className="mt-16 flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="w-16 h-px bg-border" />
          <p className="mono-text">Scroll to explore</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
