import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import headshot1 from "@/assets/headshot.jpg";

const wordVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

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

const statement =
  "A multidisciplinary creative working at the intersection of design, photography, and technology — building experiences that feel intentional and alive.";

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [hasDeployedPopdown, setHasDeployedPopdown] = useState(false);
  const [bioFontSize, setBioFontSize] = useState<number | null>(null);

  const fitBioText = useCallback(() => {
    const textEl = textRef.current;
    const imgEl = imgRef.current;
    if (!textEl || !imgEl) return;

    const imgHeight = imgEl.getBoundingClientRect().height;
    if (imgHeight <= 0) return;

    textEl.style.fontSize = "";
    let lo = 18, hi = 88, best = lo;

    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      textEl.style.fontSize = `${mid}px`;
      if (textEl.scrollHeight <= imgHeight) {
        best = mid;
        lo = mid + 0.5;
      } else {
        hi = mid - 0.5;
      }
    }

    textEl.style.fontSize = "";
    setBioFontSize(best);
  }, []);

  useEffect(() => {
    fitBioText();
    window.addEventListener("resize", fitBioText);
    return () => window.removeEventListener("resize", fitBioText);
  }, [fitBioText]);

  useEffect(() => {
    const textEl = textRef.current;
    const imgEl = imgRef.current;
    if (!textEl || !imgEl || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => fitBioText());
    observer.observe(textEl);
    observer.observe(imgEl);

    return () => observer.disconnect();
  }, [fitBioText]);

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

  const words = statement.split(" ");
  let idx = 0;

  return (
    <section ref={sectionRef} className="py-12 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="w-full max-w-[1600px]">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_clamp(320px,34vw,520px)] lg:gap-12">
          <div className="min-w-0 self-stretch">
            <p
              ref={textRef}
              className="leading-[1.38] font-light tracking-tight text-foreground"
              style={bioFontSize ? { fontSize: `${bioFontSize}px`, lineHeight: 1.04 } : { fontSize: "clamp(1.9rem, 3.8vw, 4.5rem)", lineHeight: 1.04 }}
            >
              {words.map((word) => {
                const ci = idx++;
                return (
                  <motion.span
                    key={`w-${ci}`}
                    className="inline-block mr-[0.28em] pl-[0.03em] -ml-[0.03em] will-change-transform"
                    variants={wordVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={ci}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </p>
          </div>

          <motion.div
            ref={imgRef}
            className="relative w-full overflow-hidden justify-self-end"
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
              className="absolute inset-[-2px] border-2 border-[hsl(var(--highlight))] pointer-events-none transition-[clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:inset(0_100%_0_0)] group-hover/pill:[clip-path:inset(0_0%_0_0)]"
              style={{ borderRadius: "9999px" }}
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
            <span className="text-base md:text-lg tracking-[0.02em] text-foreground">
              Based in Taipei — open to tech communications, GTM & marketing roles
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
                onClick={() => window.location.href = "/contact"}
              >
                <span
                  className="absolute inset-0 bg-[hsl(var(--highlight))] origin-left scale-x-0 group-hover/pill:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
