import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

const SAFE_EDGE = 56;
const HEADER_CLEARANCE = 104;
const MIN_WORD_GAP = 28;

type VerticalLane = "top" | "middle" | "bottom";

type WordOffset = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const viewportEdge = () => {
  if (window.innerWidth < 390) return 18;
  if (window.innerWidth < 768) return 24;
  return SAFE_EDGE;
};

const viewportHeight = () => window.visualViewport?.height ?? window.innerHeight;

const targetLeftsForRow = (widths: number[]) => {
  const edge = viewportEdge();

  if (widths.length === 1) {
    return [(window.innerWidth - widths[0]) / 2];
  }

  if (widths.length === 2) {
    return [edge, window.innerWidth - widths[1] - edge];
  }

  const left = edge;
  const right = window.innerWidth - widths[2] - edge;
  const leftWordEnd = left + widths[0];
  const gap = window.innerWidth < 390 ? 8 : window.innerWidth < 768 ? 12 : MIN_WORD_GAP;
  const centeredMiddle = (window.innerWidth - widths[1]) / 2;
  const minMiddle = leftWordEnd + gap;
  const maxMiddle = right - widths[1] - gap;
  const middle =
    minMiddle <= maxMiddle
      ? centeredMiddle >= minMiddle && centeredMiddle <= maxMiddle
        ? centeredMiddle
        : (minMiddle + maxMiddle) / 2
      : clamp(centeredMiddle, edge, window.innerWidth - widths[1] - edge);

  return [left, middle, right];
};

const targetTopFor = (lane: VerticalLane, height: number) => {
  const headerClearance = window.innerWidth < 768 ? 92 : HEADER_CLEARANCE;
  if (lane === "top") return headerClearance;
  if (lane === "bottom") return viewportHeight() - height - viewportEdge();
  return (viewportHeight() - height) / 2;
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [wordOffsets, setWordOffsets] = useState<WordOffset[]>([]);
  let order = 0;

  useLayoutEffect(() => {
    const measure = () => {
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
        const targetLefts = targetLeftsForRow(lineRects.map((rect) => rect?.width ?? 0));

        line.forEach((word, lineWordIndex) => {
          const element = wordRefs.current[wordIndex];
          if (element) {
            const rect = lineRects[lineWordIndex] ?? element.getBoundingClientRect();
            const edge = viewportEdge();
            const targetLeft = clamp(
              targetLefts[lineWordIndex],
              edge,
              window.innerWidth - rect.width - edge,
            );
            const headerClearance = window.innerWidth < 768 ? 92 : HEADER_CLEARANCE;
            const targetTop = clamp(
              targetTopFor(word.y, rect.height),
              headerClearance,
              viewportHeight() - rect.height - edge,
            );

            nextOffsets[wordIndex] = {
              x: targetLeft - rect.left,
              y: targetTop - rect.top,
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

      setWordOffsets(nextOffsets);
    };

    let disposed = false;
    const measureWhenReady = () => {
      if (!disposed) measure();
    };

    if (document.fonts) {
      document.fonts.ready.then(measureWhenReady);
    } else {
      measure();
    }
    const fallbackTimers = [80, 240, 520].map((delay) => window.setTimeout(measureWhenReady, delay));

    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      disposed = true;
      fallbackTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="relative flex h-[100svh] min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="absolute inset-x-0 bottom-0 top-20 z-10 flex items-end overflow-hidden px-6 pb-[calc(env(safe-area-inset-bottom)+3.5rem)] md:top-24 md:pb-6"
        style={{ opacity: textOpacity }}
      >
        <h1
          className="max-w-6xl text-[clamp(2.2rem,10.8vw,3rem)] font-semibold leading-[0.85] tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
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
