import { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import headshotUrl from "@/assets/headshot.jpg";
import { bioLines } from "@/lib/siteContent";

interface AboutSectionProps {
  revealEnabled?: boolean;
}

const AboutSection = ({ revealEnabled = true }: AboutSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headshotRotX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: 0.6 });
  const headshotRotY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18, mass: 0.6 });
  const photoSize = "clamp(320px, 34vw, 520px)";

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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={revealEnabled ? undefined : { opacity: 0, scale: 0.98 }}
            whileInView={revealEnabled ? { opacity: 1, scale: 1 } : undefined}
            viewport={revealEnabled ? { once: true, margin: "-60px" } : undefined}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
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
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
