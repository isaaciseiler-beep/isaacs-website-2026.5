import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const gradientOpacity = useTransform(scrollY, [200, 600], [0, 1]);

  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Sandstorm gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 30% 40%, hsl(35 40% 18% / 0.8) 0%, transparent 60%),
              radial-gradient(ellipse 100% 60% at 70% 30%, hsl(30 30% 14% / 0.6) 0%, transparent 50%),
              radial-gradient(ellipse 80% 100% at 50% 80%, hsl(40 25% 10% / 0.5) 0%, transparent 60%),
              radial-gradient(ellipse 150% 80% at 80% 60%, hsl(25 35% 16% / 0.4) 0%, transparent 50%),
              hsl(var(--background))
            `,
          }}
        />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }} />
      </div>

      {/* Fade-out gradient into next section */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, hsl(var(--background)))`,
        }}
      />

      <motion.div
        className="relative z-10 px-6 md:px-8 pb-10 md:pb-12 max-w-3xl"
        style={{ opacity: textOpacity }}
      >
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-foreground"
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
