import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import headshot1 from "@/assets/headshot.jpg";
import { bioLines } from "@/lib/siteContent";
import { CONTACT_MAILTO } from "@/lib/site";

const popdownVariants = {
  closed: { height: 0, y: -18 },
  open: {
    height: 68,
    y: 0,
    transition: {
      duration: 0.58,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

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

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [hasDeployedPopdown, setHasDeployedPopdown] = useState(false);
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

  useEffect(() => {
    if (hasDeployedPopdown) return;

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
  }, [hasDeployedPopdown]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="py-12 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="w-full max-w-[1600px]">
        <div className="flex flex-col-reverse items-center gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(320px,34vw,520px)] lg:items-center lg:gap-12">
          <div className="min-w-0 w-full self-center pr-0 lg:pr-4 lg:flex lg:items-center">
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
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
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
            className="relative w-full overflow-hidden justify-self-end self-center"
            style={{ width: photoSize }}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="aspect-square overflow-hidden" style={{ y: imgY }}>
              <img
                src={headshot1}
                alt="Portrait"
                className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Status pill + pop-down CTA */}
        <div className="mt-8 md:mt-10 relative group/pill">
          <div
            ref={pillRef}
            className="relative flex items-center gap-3 px-6 py-3.5 border-2 border-foreground bg-background w-full z-10"
            style={{ borderRadius: "9999px" }}
          >
            {/* Highlight border overlay — clip-path reveal left-to-right on hover */}
            <span
              className="absolute inset-[-2px] border-2 border-[hsl(var(--highlight))] pointer-events-none transition-[clip-path] duration-500 [clip-path:inset(0_100%_0_0)] group-hover/pill:[clip-path:inset(0_0%_0_0)]"
              style={{ borderRadius: "9999px", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            />
            <motion.span
              className="rounded-full w-2.5 h-2.5 bg-foreground shrink-0"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-base md:text-lg font-light tracking-[0.02em] text-foreground">
              Currently in the market for tech roles starting Summer 2026
            </span>
          </div>

          <div className="absolute left-0 right-0 z-0 pointer-events-none" style={{ top: "50%" }}>
            <motion.div
              initial="closed"
              animate={hasDeployedPopdown ? "open" : "closed"}
              variants={popdownVariants}
              className="overflow-hidden rounded-b-[26px]"
            >
              <button
                className="relative pointer-events-auto h-[68px] w-full rounded-b-[26px] bg-foreground overflow-hidden cursor-pointer"
                onClick={() => window.location.href = CONTACT_MAILTO}
              >
                <span
                  className="absolute inset-0 bg-[hsl(var(--highlight))] origin-left scale-x-0 group-hover/pill:scale-x-100 transition-transform duration-500"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                />
                <motion.span
                  variants={popdownTextVariants}
                  initial="closed"
                  animate={hasDeployedPopdown ? "open" : "closed"}
                  className="relative z-10 flex h-full items-center justify-center px-6 pt-[26px] text-sm font-mono tracking-[0.2em] uppercase text-background"
                >
                  Get in touch
                  <span className="inline-flex overflow-hidden max-w-0 opacity-0 transition-all duration-300 ease-out group-hover/pill:max-w-[2rem] group-hover/pill:opacity-100">
                    <ArrowRight className="w-4 h-4 ml-2 shrink-0" strokeWidth={1.5} />
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
