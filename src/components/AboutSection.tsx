import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import headshotUrl from "@/assets/headshot.jpg";
import { bioLines } from "@/lib/siteContent";
import { CONTACT_MAILTO } from "@/lib/site";

const popdownTextVariants = {
  closed: { opacity: 0, y: -4 },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.46,
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

interface AboutSectionProps {
  revealEnabled?: boolean;
}

const AboutSection = ({ revealEnabled = true }: AboutSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [hasDeployedPopdown, setHasDeployedPopdown] = useState(false);
  const headshotRotX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: 0.6 });
  const headshotRotY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: 0.6 });
  const photoSize = "clamp(320px, 34vw, 520px)";
  const popdownVariants = {
    closed: { height: 0, y: -18 },
    open: {
      height: 44,
      y: 0,
      transition: {
        duration: 0.58,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // Auto-fit the bio text inside a fixed-height box matching the headshot.
  const bioBoxRef = useRef<HTMLDivElement>(null);
  const bioMeasureRef = useRef<HTMLDivElement>(null);
  const [bioFontPx, setBioFontPx] = useState<number>(28);

  useLayoutEffect(() => {
    const fit = () => {
      const box = bioBoxRef.current;
      const measure = bioMeasureRef.current;
      if (!box || !measure) return;
      const targetH = box.clientHeight;
      const targetW = box.clientWidth;
      if (targetH <= 0 || targetW <= 0) return;
      // Binary search for the largest font-size that fits both height and width.
      let lo = 12;
      let hi = 96;
      let best = lo;
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        measure.style.fontSize = `${mid}px`;
        const fits = measure.scrollHeight <= targetH && measure.scrollWidth <= targetW;
        if (fits) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
        if (hi - lo < 0.5) break;
      }
      setBioFontPx(best);
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (bioBoxRef.current) ro.observe(bioBoxRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    if (!revealEnabled || hasDeployedPopdown) return;

    const handleScrollTrigger = () => {
      const pill = pillRef.current;
      if (!pill) return;

      const rect = pill.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isVisible = rect.top < viewportHeight && rect.bottom > 0;
      const hasBufferBelow = rect.bottom <= viewportHeight * 0.8;

      if (isVisible && hasBufferBelow) {
        setHasDeployedPopdown(true);
      }
    };

    handleScrollTrigger();
    window.addEventListener("scroll", handleScrollTrigger, { passive: true });
    window.addEventListener("resize", handleScrollTrigger);

    return () => {
      window.removeEventListener("scroll", handleScrollTrigger);
      window.removeEventListener("resize", handleScrollTrigger);
    };
  }, [hasDeployedPopdown, revealEnabled]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const headshotFilter = useTransform(
    scrollYProgress,
    [0.08, 0.28, 0.66, 0.9],
    ["grayscale(1)", "grayscale(0)", "grayscale(0)", "grayscale(1)"],
  );

  const handleHeadshotMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    const hoveringCorner = Math.abs(nx) > 0.62 && Math.abs(ny) > 0.62;

    headshotRotY.set(hoveringCorner ? nx * 5 : 0);
    headshotRotX.set(hoveringCorner ? -ny * 5 : 0);
  };

  const handleHeadshotLeave = () => {
    headshotRotX.set(0);
    headshotRotY.set(0);
  };

  return (
    <section ref={sectionRef} className="px-6 py-0">
      <SectionHeading>About</SectionHeading>

      <div className="w-full">
        <div className="flex flex-col-reverse items-center gap-10 md:grid md:grid-cols-[minmax(0,1fr)_clamp(320px,34vw,520px)] md:items-center md:gap-12">
          <div className="min-w-0 w-full self-center pr-0 md:pr-4 md:flex md:items-center">
            <div
              ref={bioBoxRef}
              className="relative w-full overflow-hidden"
              style={{ height: `calc(${photoSize} * 0.9)` }}
            >
              {/* Hidden measuring layer — same content, off-screen, used to compute the fitting font-size */}
              <div
                ref={bioMeasureRef}
                aria-hidden
                className="font-light tracking-tight leading-[1.18] text-foreground"
                style={{
                  position: "absolute",
                  visibility: "hidden",
                  pointerEvents: "none",
                  top: 0,
                  left: 0,
                  width: "100%",
                  whiteSpace: "normal",
                  wordBreak: "normal",
                  overflowWrap: "break-word",
                }}
              >
                {bioLines.map((line, i) => (
                  <p key={i} style={{ marginBottom: i === bioLines.length - 1 ? 0 : "0.7em" }}>
                    {line}
                  </p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={revealEnabled ? undefined : { opacity: 0, y: 12, filter: "blur(6px)" }}
                whileInView={revealEnabled ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
                viewport={revealEnabled ? { once: true, margin: "-60px" } : undefined}
                transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-light tracking-tight leading-[1.18] text-foreground"
                style={{ fontSize: `${bioFontPx}px` }}
              >
                {bioLines.map((line, i) => (
                  <p
                    key={i}
                    style={{ marginBottom: i === bioLines.length - 1 ? 0 : "0.7em" }}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div
            className="group/headshot relative w-full justify-self-end self-center"
            style={{ width: photoSize, perspective: 900 }}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={revealEnabled ? undefined : { opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            whileInView={revealEnabled ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined}
            viewport={revealEnabled ? { once: true, margin: "-60px" } : undefined}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onPointerMove={handleHeadshotMove}
            onPointerLeave={handleHeadshotLeave}
          >
            <motion.div
              className="site-corner aspect-square overflow-hidden shadow-sm transition-shadow duration-300 group-hover/headshot:shadow-md"
              style={{
                y: imgY,
                rotateX: headshotRotX,
                rotateY: headshotRotY,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.img
                src={headshotUrl}
                alt="Portrait"
                className="h-full w-full object-cover"
                style={{ filter: headshotFilter }}
                loading="lazy"
                decoding="async"
                fetchpriority="auto"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Status pill + pop-down CTA */}
        <div className="mt-8 md:mt-10 relative group/pill">
          <div
            ref={pillRef}
            className={`relative z-10 flex w-full items-center gap-3 border-2 border-foreground bg-background px-6 py-3.5 transition-colors duration-300 group-hover/pill:border-foreground/85 ${hasDeployedPopdown ? "border-b-0" : ""}`}
            style={{
              borderRadius: hasDeployedPopdown
                ? "var(--site-corner-radius) var(--site-corner-radius) 0 0"
                : "var(--site-corner-radius)",
            }}
          >
            <motion.span
              className="rounded-full w-2.5 h-2.5 bg-foreground transition-colors duration-300 shrink-0"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-base md:text-lg font-light tracking-[0.02em] text-foreground transition-colors duration-300">
              Currently in the market for tech roles starting Summer 2026
            </span>
          </div>

          <div className="absolute left-0 right-0 z-0 pointer-events-none" style={{ top: "100%" }}>
            <motion.div
              initial="closed"
              animate={hasDeployedPopdown ? "open" : "closed"}
              variants={popdownVariants}
              className="overflow-hidden"
            >
              <button
                className="get-in-touch-cta homepage-cta relative pointer-events-auto h-full w-full cursor-pointer overflow-hidden bg-primary transition-colors duration-300 group-hover/pill:bg-accent"
                style={{ borderRadius: "0 0 var(--site-corner-radius) var(--site-corner-radius)" }}
                onClick={() => window.location.href = CONTACT_MAILTO}
              >
                <motion.span
                  variants={popdownTextVariants}
                  initial="closed"
                  animate={hasDeployedPopdown ? "open" : "closed"}
                  className="relative z-10 flex h-full items-center justify-center px-6 text-sm font-mono tracking-[0.2em] uppercase transition-colors duration-300"
                >
                  Get in touch
                  <span className="inline-flex overflow-hidden max-w-0 opacity-0 transition-all duration-300 ease-out group-hover/pill:max-w-[2rem] group-hover/pill:opacity-100">
                    <ArrowUpRight className="w-4 h-4 ml-2 shrink-0" strokeWidth={1.5} />
                  </span>
                </motion.span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
