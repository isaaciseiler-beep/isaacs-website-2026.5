import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const headlineLines = [
  [
    { text: "Building", x: 0, y: "top", delay: 0 },
    { text: "at", x: 1, y: "top", delay: 0.15 },
    { text: "the", x: 2, y: "top", delay: 0.28 },
  ],
  [
    { text: "intersection", x: 0, y: "middle", delay: 0.05 },
    { text: "of", x: 1, y: "middle", delay: 0.18 },
    { text: "AI", x: 2, y: "middle", delay: 0.25 },
  ],
  [
    { text: "and", x: 0, y: "bottom", delay: 0.1 },
    { text: "society.", x: 2, y: "bottom", delay: 0.22 },
  ],
] as const;

const mobileLaneClasses = [
  "mobile-hero-lane mobile-hero-lane-top",
  "mobile-hero-lane mobile-hero-lane-middle",
  "mobile-hero-lane mobile-hero-lane-bottom",
] as const;

const SAFE_EDGE = 56;
const HEADER_CLEARANCE = 104;
const MIN_WORD_GAP = 28;

type VerticalLane = "top" | "middle" | "bottom";

type WordOffset = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const viewportEdge = (width = window.innerWidth) => {
  if (width < 390) return 18;
  if (width < 768) return 24;
  return SAFE_EDGE;
};

const targetLeftsForRow = (widths: number[], boundsWidth: number) => {
  const edge = viewportEdge(boundsWidth);

  if (widths.length === 1) {
    return [(boundsWidth - widths[0]) / 2];
  }

  if (widths.length === 2) {
    return [edge, boundsWidth - widths[1] - edge];
  }

  const left = edge;
  const right = boundsWidth - widths[2] - edge;
  const leftWordEnd = left + widths[0];
  const gap = boundsWidth < 390 ? 8 : boundsWidth < 768 ? 12 : MIN_WORD_GAP;
  const centeredMiddle = (boundsWidth - widths[1]) / 2;
  const minMiddle = leftWordEnd + gap;
  const maxMiddle = right - widths[1] - gap;
  const middle =
    minMiddle <= maxMiddle
      ? centeredMiddle >= minMiddle && centeredMiddle <= maxMiddle
        ? centeredMiddle
        : (minMiddle + maxMiddle) / 2
      : clamp(centeredMiddle, edge, boundsWidth - widths[1] - edge);

  return [left, middle, right];
};

const targetTopFor = (lane: VerticalLane, height: number, boundsWidth: number, boundsHeight: number) => {
  const headerClearance = boundsWidth < 768 ? 92 : HEADER_CLEARANCE;
  if (lane === "top") return headerClearance;
  if (lane === "bottom") return boundsHeight - height - viewportEdge(boundsWidth);
  return (boundsHeight - height) / 2;
};

const offsetsAreEqual = (a: WordOffset[], b: WordOffset[]) =>
  a.length === b.length && a.every((offset, index) => {
    const next = b[index];
    return next && Math.abs(offset.x - next.x) < 0.5 && Math.abs(offset.y - next.y) < 0.5;
  });

const afterLayoutSettles = (callback: () => void) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(callback);
  });
};

const MobileHeroText = () => {
  const reduceMotion = useReducedMotion();
  const [isAssembling, setIsAssembling] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setTimeout(() => setIsAssembling(true), 420);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <>
      <div
        className="mobile-hero-stage md:hidden"
        aria-hidden="true"
        data-assembling={isAssembling ? "true" : "false"}
        data-reduced-motion={reduceMotion ? "true" : "false"}
      >
        {headlineLines.map((line, lineIndex) => (
          <div key={`mobile-hero-lane-${lineIndex}`} className={mobileLaneClasses[lineIndex]}>
            <span>{line.map((word) => word.text).join(" ")}</span>
          </div>
        ))}
      </div>

      <h1
        className="mobile-hero-final md:hidden"
        aria-label="Building at the intersection of AI and society."
        data-assembling={isAssembling ? "true" : "false"}
        data-reduced-motion={reduceMotion ? "true" : "false"}
      >
        {headlineLines.map((line, lineIndex) => (
          <span key={`mobile-hero-final-line-${lineIndex}`} className="block whitespace-nowrap">
            {line.map((word, wordIndex) => (
              <span key={word.text} style={{ marginRight: wordIndex === line.length - 1 ? 0 : "0.25em" }}>
                {word.text}
              </span>
            ))}
          </span>
        ))}
      </h1>
    </>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const hasMeasuredRef = useRef(false);
  const lastWindowWidthRef = useRef(0);
  const [wordOffsets, setWordOffsets] = useState<WordOffset[]>([]);
  let order = 0;

  useLayoutEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionRect = section.getBoundingClientRect();
      const boundsWidth = sectionRect.width;
      const boundsHeight = sectionRect.height;
      if (!boundsWidth || !boundsHeight) return;

      const nextOffsets: WordOffset[] = [];
      let wordIndex = 0;
      const animatedElements = wordRefs.current.filter((element): element is HTMLSpanElement => Boolean(element));
      const restoredStyles = animatedElements.map((element) => ({
        element,
        animation: element.style.animation,
        filter: element.style.filter,
        opacity: element.style.opacity,
        transform: element.style.transform,
      }));

      animatedElements.forEach((element) => {
        element.style.animation = "none";
        element.style.filter = "none";
        element.style.opacity = "1";
        element.style.transform = "none";
      });

      headlineLines.forEach((line) => {
        const lineStartIndex = wordIndex;
        const lineRects = line.map((_, lineWordIndex) => {
          const element = wordRefs.current[lineStartIndex + lineWordIndex];
          return element?.getBoundingClientRect() ?? null;
        });
        const targetLefts = targetLeftsForRow(lineRects.map((rect) => rect?.width ?? 0), boundsWidth);

        line.forEach((word, lineWordIndex) => {
          const element = wordRefs.current[wordIndex];
          if (element) {
            const rect = lineRects[lineWordIndex] ?? element.getBoundingClientRect();
            const edge = viewportEdge(boundsWidth);
            const targetLeft = clamp(
              targetLefts[lineWordIndex],
              edge,
              boundsWidth - rect.width - edge,
            );
            const headerClearance = boundsWidth < 768 ? 92 : HEADER_CLEARANCE;
            const targetTop = clamp(
              targetTopFor(word.y, rect.height, boundsWidth, boundsHeight),
              headerClearance,
              boundsHeight - rect.height - edge,
            );

            nextOffsets[wordIndex] = {
              x: sectionRect.left + targetLeft - rect.left,
              y: sectionRect.top + targetTop - rect.top,
            };
          }
          wordIndex += 1;
        });
      });

      restoredStyles.forEach(({ element, animation, filter, opacity, transform }) => {
        element.style.animation = animation;
        element.style.filter = filter;
        element.style.opacity = opacity;
        element.style.transform = transform;
      });

      hasMeasuredRef.current = true;
      lastWindowWidthRef.current = window.innerWidth;
      setWordOffsets((current) => (offsetsAreEqual(current, nextOffsets) ? current : nextOffsets));
    };

    let disposed = false;
    let fallbackTimer = 0;
    const measureWhenReady = () => {
      if (!disposed) afterLayoutSettles(measure);
    };

    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (!hasMeasuredRef.current) measureWhenReady();
      });
      fallbackTimer = window.setTimeout(() => {
        if (!hasMeasuredRef.current) measureWhenReady();
      }, 1200);
    } else {
      measureWhenReady();
    }

    const handleResize = () => {
      if (Math.abs(window.innerWidth - lastWindowWidthRef.current) > 4) {
        measureWhenReady();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      disposed = true;
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative flex h-[100svh] min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="absolute inset-x-0 bottom-0 top-20 z-10 flex items-end overflow-hidden px-6 pb-[calc(env(safe-area-inset-bottom)+3.5rem)] md:top-24 md:pb-6"
        style={{ opacity: textOpacity }}
      >
        <MobileHeroText />

        <h1
          className="hidden max-w-6xl text-[clamp(2.2rem,10.8vw,3rem)] font-semibold leading-[0.85] tracking-tighter text-foreground md:block md:text-7xl lg:text-8xl"
          aria-label="Building at the intersection of AI and society."
          data-ready={wordOffsets.length > 0 ? "true" : "false"}
        >
          {headlineLines.map((line, lineIndex) => (
            <span
              key={`hero-line-${lineIndex}`}
              className="block overflow-visible whitespace-nowrap"
              aria-hidden="true"
            >
              {line.map((word, wordIndex) => {
                const animatedWord = { ...word, order: order++ };
                const offsets = wordOffsets[animatedWord.order] ?? { x: 0, y: 0 };
                const wordStyle = {
                  "--hero-x": `${offsets.x}px`,
                  "--hero-y": `${offsets.y}px`,
                  "--hero-correct-x": `${offsets.x < 0 ? 7 : -7}px`,
                  "--hero-delay": `${animatedWord.delay}s`,
                  marginRight: wordIndex === line.length - 1 ? 0 : "0.25em",
                } as CSSProperties;

                return (
                  <span
                    key={word.text}
                    ref={(element) => {
                      wordRefs.current[animatedWord.order] = element;
                    }}
                    className="hero-kinetic-word inline-block origin-center"
                    style={wordStyle}
                  >
                    {word.text}
                  </span>
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
