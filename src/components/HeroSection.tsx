import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const headlineLines = [
  [
    { text: "Building", xRatio: 0.34, xMax: 500, yRatio: 0.42, yMax: 360, rotate: -7 },
    { text: "at", xRatio: 0.12, xMax: 170, yRatio: 0.3, yMax: 260, rotate: 6 },
    { text: "the", xRatio: 0.09, xMax: 140, yRatio: 0.45, yMax: 400, rotate: -4 },
  ],
  [
    { text: "intersection", xRatio: 0.08, xMax: 130, yRatio: 0.5, yMax: 430, rotate: 5 },
    { text: "of", xRatio: 0.3, xMax: 430, yRatio: 0.36, yMax: 320, rotate: -8 },
    { text: "AI", xRatio: -0.28, xMax: 300, yRatio: 0.43, yMax: 360, rotate: 7 },
  ],
  [
    { text: "and", xRatio: 0.45, xMax: 540, yRatio: 0.33, yMax: 280, rotate: -6 },
    { text: "society.", xRatio: 0.23, xMax: 320, yRatio: 0.48, yMax: 410, rotate: 4 },
  ],
];

const getViewportSize = () => ({
  width: typeof window === "undefined" ? 1024 : window.innerWidth,
  height: typeof window === "undefined" ? 768 : window.innerHeight,
});

const HeroSection = () => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [viewport, setViewport] = useState(getViewportSize);
  const assembledLines = useMemo(
    () =>
      headlineLines.map((line) =>
        line.map((word) => ({
          ...word,
          x:
            word.xRatio < 0
              ? -Math.min(viewport.width * Math.abs(word.xRatio), word.xMax)
              : Math.min(viewport.width * word.xRatio, word.xMax),
          y: -Math.min(viewport.height * word.yRatio, word.yMax),
        })),
      ),
    [viewport],
  );
  let order = 0;

  useEffect(() => {
    const handleResize = () => setViewport(getViewportSize());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative flex h-[100svh] min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <motion.div
        className="absolute inset-x-0 bottom-0 top-20 z-10 flex items-end overflow-hidden px-6 pb-[calc(env(safe-area-inset-bottom)+3.5rem)] md:top-24 md:pb-6"
        style={{ opacity: textOpacity }}
      >
        <h1
          className="max-w-6xl text-5xl font-semibold leading-[0.85] tracking-tighter text-foreground md:text-7xl lg:text-8xl"
          aria-label="Building at the intersection of AI and society."
        >
          {assembledLines.map((line, lineIndex) => (
            <span
              key={`hero-line-${lineIndex}`}
              className="block overflow-visible whitespace-nowrap"
              aria-hidden="true"
            >
              {line.map((word, wordIndex) => {
                const animatedWord = { ...word, order: order++ };
                const wordStyle = {
                  "--hero-x": `${animatedWord.x}px`,
                  "--hero-y": `${animatedWord.y}px`,
                  "--hero-r": `${animatedWord.rotate}deg`,
                  "--hero-delay": `${0.18 + animatedWord.order * 0.095}s`,
                  marginRight: wordIndex === line.length - 1 ? 0 : "0.25em",
                } as CSSProperties;

                return (
                  <span
                    key={word.text}
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
