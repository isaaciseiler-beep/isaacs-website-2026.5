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
      {/* Subtle sandstorm gradient */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 30% 40%, hsl(45 20% 9% / 0.6) 0%, transparent 60%),
              radial-gradient(ellipse 100% 60% at 70% 30%, hsl(40 15% 8% / 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 80% 100% at 50% 80%, hsl(50 12% 8% / 0.3) 0%, transparent 60%),
              hsl(var(--background))
            `,
          }}
        />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }} />
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, hsl(var(--background)))`,
        }}
      />

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
