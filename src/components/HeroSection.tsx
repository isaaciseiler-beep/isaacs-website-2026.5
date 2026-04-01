import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="snap-section relative w-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <img
          src={heroBg}
          alt="Urban concrete with street art"
          className="w-full h-full object-cover opacity-30"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </motion.div>

      <div className="relative z-10 px-16 md:px-32 max-w-[80vw]">
        <motion.p
          className="mono-text mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Creative Portfolio — 2026
        </motion.p>

        <motion.h1
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.85] text-foreground uppercase"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        >
          Design
          <br />
          <span className="text-accent" style={{ WebkitTextStroke: "2px hsl(200 20% 85%)", color: "transparent" }}>
            &amp; Build
          </span>
        </motion.h1>

        <motion.div
          className="mt-12 flex items-center gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="w-24 h-px bg-accent" />
          <p className="mono-text">Scroll to explore →</p>
        </motion.div>
      </div>

      {/* Decorative line elements */}
      <motion.div
        className="absolute bottom-0 left-0 w-px h-full bg-border"
        style={{ left: "10%" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-px h-full bg-border"
        style={{ left: "90%" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
      />
    </section>
  );
};

export default HeroSection;
