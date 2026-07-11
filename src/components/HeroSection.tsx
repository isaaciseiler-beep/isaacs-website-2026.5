import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { scheduleImagePreloads } from "@/lib/imagePreload";

const headlineLines = [
  [
    { text: "Bridging", x: 1, y: "top", delay: 0 },
  ],
  [
    { text: "the", x: 0, y: "middle", delay: 0.08 },
    { text: "gap", x: 1, y: "middle", delay: 0.18 },
    { text: "between", x: 2, y: "middle", delay: 0.28 },
  ],
  [
    { text: "humans", x: 0, y: "bottom", delay: 0.1 },
    { text: "and", x: 1, y: "bottom", delay: 0.22 },
    { text: "AI", x: 2, y: "bottom", delay: 0.32 },
  ],
] as const;

const SAFE_EDGE = 56;
const HEADER_CLEARANCE = 104;
const MIN_WORD_GAP = 28;
const HERO_TEXT_ANIMATION_MS = 2400;
const TRAIL_ENABLE_BUFFER_MS = 140;
const TRAIL_MAX_ITEMS = 10;
const TRAIL_LIFETIME_MS = 2100;
const TRAIL_SPAWN_DISTANCE = 92;
const TRAIL_SPAWN_INTERVAL_MS = 140;
const TRAIL_SIDE_GUTTER = 18;
const TRAIL_BOTTOM_GUTTER = 72;
const FALLBACK_IMAGE_ASPECT = 4 / 3;
const HEADLINE_WORD_COUNT = headlineLines.reduce((count, line) => count + line.length, 0);

type VerticalLane = "top" | "middle" | "bottom";

type WordOffset = {
  x: number;
  y: number;
};

type TrailItem = {
  id: number;
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type ImageMetric = {
  width: number;
  height: number;
  aspect: number;
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

const shuffleImages = (images: string[]) => {
  const shuffled = [...images];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

const distanceBetween = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.sqrt(x * x + y * y);
};

const loadImageMetric = (src: string, metrics: Map<string, ImageMetric>) => {
  if (metrics.has(src)) return;

  const image = new Image();
  image.decoding = "async";
  image.onload = () => {
    if (!image.naturalWidth || !image.naturalHeight) return;

    metrics.set(src, {
      width: image.naturalWidth,
      height: image.naturalHeight,
      aspect: image.naturalWidth / image.naturalHeight,
    });
  };
  image.src = src;
};

const CursorImageTrail = ({ enabled }: { enabled: boolean }) => {
  const [items, setItems] = useState<TrailItem[]>([]);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnAtRef = useRef(0);
  const nextIdRef = useRef(0);
  const imageIndexRef = useRef(0);
  const removalTimersRef = useRef<number[]>([]);
  const imageMetricsRef = useRef<Map<string, ImageMetric>>(new Map());
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let disposed = false;

    const loadTrailImages = async () => {
      const [
        headshotModule,
        { curatedPicks },
        { projectItems },
      ] = await Promise.all([
        import("@/assets/headshot.jpg"),
        import("@/lib/photoAlbums"),
        import("@/lib/siteContent"),
      ]);
      if (disposed) return;

      const images = [
        headshotModule.default,
        ...projectItems.slice(0, 8).map((project) => project.image),
        ...curatedPicks.map((pick) => pick.url),
      ].filter((src): src is string => Boolean(src));
      const nextImages = shuffleImages([...new Set(images)]);

      setShuffledImages(nextImages);
      scheduleImagePreloads(nextImages, {
        batchSize: 3,
        decode: false,
        fetchPriority: "low",
        idleTimeout: 1500,
      });
      nextImages.forEach((src) => loadImageMetric(src, imageMetricsRef.current));
    };

    void loadTrailImages();
    return () => {
      disposed = true;
    };
  }, [enabled]);

  useEffect(() => {
    return () => {
      removalTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      removalTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (enabled) return;

    lastPointRef.current = null;
    setItems([]);
  }, [enabled]);

  const spawnImage = (event: ReactPointerEvent<HTMLDivElement>, force = false) => {
    if (!enabled || !layerRef.current || shuffledImages.length === 0) return;

    const rect = layerRef.current.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      return;
    }

    const nextPoint = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const now = performance.now();
    const lastPoint = lastPointRef.current;
    const farEnough = !lastPoint || distanceBetween(nextPoint, lastPoint) >= TRAIL_SPAWN_DISTANCE;
    const restedEnough = now - lastSpawnAtRef.current >= TRAIL_SPAWN_INTERVAL_MS;

    if (!force && (!farEnough || !restedEnough)) return;

    const id = nextIdRef.current + 1;
    nextIdRef.current = id;
    let imageIndex = imageIndexRef.current % shuffledImages.length;
    let src = shuffledImages[imageIndex];
    let metric = imageMetricsRef.current.get(src);

    for (let attempt = 0; attempt < shuffledImages.length && !metric; attempt += 1) {
      imageIndexRef.current += 1;
      imageIndex = imageIndexRef.current % shuffledImages.length;
      src = shuffledImages[imageIndex];
      metric = imageMetricsRef.current.get(src);
    }

    imageIndexRef.current += 1;

    const isNarrow = rect.width < 768;
    const baseWidth = clamp(rect.width * (isNarrow ? 0.37 : 0.155), isNarrow ? 116 : 154, isNarrow ? 178 : 238);
    const width = baseWidth * (0.94 + ((id * 11) % 15) / 100);
    const aspect = metric?.aspect ?? FALLBACK_IMAGE_ASPECT;
    const height = width / aspect;
    const offsetX = ((id * 31) % 28) - 14;
    const offsetY = ((id * 43) % 22) - 11;
    const sideGutter = isNarrow ? 10 : TRAIL_SIDE_GUTTER;
    const bottomGutter = isNarrow ? 94 : TRAIL_BOTTOM_GUTTER;
    const topGutter = isNarrow ? 88 : 64;
    const maxLeft = Math.max(sideGutter, rect.width - width - sideGutter);
    const maxTop = Math.max(topGutter, rect.height - height - bottomGutter);
    const left = clamp(nextPoint.x - width / 2 + offsetX, sideGutter, maxLeft);
    const top = clamp(nextPoint.y - height / 2 + offsetY, topGutter, maxTop);
    const item: TrailItem = {
      id,
      src,
      left,
      top,
      width,
      height,
    };

    lastPointRef.current = nextPoint;
    lastSpawnAtRef.current = now;
    setItems((current) => [...current.slice(-TRAIL_MAX_ITEMS + 1), item]);

    const removalTimer = window.setTimeout(() => {
      setItems((current) => current.filter((currentItem) => currentItem.id !== id));
    }, TRAIL_LIFETIME_MS);
    removalTimersRef.current.push(removalTimer);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || event.button !== 0) return;

    spawnImage(event, true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    spawnImage(event);
  };

  return (
    <div
      ref={layerRef}
      className="hero-cursor-trail absolute inset-0 z-40"
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerCancel={() => {
        lastPointRef.current = null;
      }}
      onPointerLeave={() => {
        lastPointRef.current = null;
      }}
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="hero-cursor-trail-item"
            initial={{ opacity: 0, scale: 0.86, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.98, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              left: item.left,
              top: item.top,
              width: item.width,
              height: item.height,
              zIndex: item.id,
            }}
          >
            <img src={item.src} alt="" draggable={false} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface HeroSectionProps {
  playIntro?: boolean;
  introReady?: boolean;
}

const HeroSection = ({ playIntro = false, introReady = true }: HeroSectionProps) => {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const hasMeasuredRef = useRef(false);
  const lastWindowWidthRef = useRef(0);
  const [wordOffsets, setWordOffsets] = useState<WordOffset[]>([]);
  const [introMeasured, setIntroMeasured] = useState(false);
  const [trailEnabled, setTrailEnabled] = useState(() => !playIntro);
  const [supportsPointerTrail, setSupportsPointerTrail] = useState(false);
  let order = 0;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    const update = () => setSupportsPointerTrail(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!supportsPointerTrail) {
      setTrailEnabled(false);
      return;
    }

    if (!playIntro) {
      setTrailEnabled(true);
      return;
    }

    setTrailEnabled(false);
    if (!introReady) return;

    const timer = window.setTimeout(() => {
      setTrailEnabled(true);
    }, HERO_TEXT_ANIMATION_MS + TRAIL_ENABLE_BUFFER_MS);

    return () => window.clearTimeout(timer);
  }, [introReady, playIntro, supportsPointerTrail]);

  useLayoutEffect(() => {
    if (!playIntro) {
      hasMeasuredRef.current = false;
      setIntroMeasured(false);
      setWordOffsets([]);
      return;
    }

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
      setIntroMeasured(true);
    };

    let disposed = false;
    let fallbackTimer = 0;
    const measureWhenReady = () => {
      if (!disposed) afterLayoutSettles(measure);
    };

    measureWhenReady();

    if (document.fonts) {
      document.fonts.ready.then(() => {
        measureWhenReady();
      });
      fallbackTimer = window.setTimeout(() => {
        if (!hasMeasuredRef.current) measureWhenReady();
      }, 1200);
    } else {
      fallbackTimer = window.setTimeout(() => {
        if (!hasMeasuredRef.current) measureWhenReady();
      }, 180);
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
  }, [playIntro]);

  const heroIntroReady = !playIntro || (introReady && introMeasured && wordOffsets.length >= HEADLINE_WORD_COUNT);

  return (
    <section ref={sectionRef} className="relative flex h-[100svh] min-h-[100svh] items-end overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      {supportsPointerTrail ? <CursorImageTrail enabled={trailEnabled} /> : null}

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-20 z-30 flex items-end overflow-hidden px-6 pb-[calc(env(safe-area-inset-bottom)+3.5rem)] md:top-24 md:pb-6"
        style={{ opacity: textOpacity }}
      >
        <h1
          className="block w-full max-w-[34rem] text-[clamp(2rem,10vw,2.7rem)] font-semibold leading-[0.85] tracking-tighter text-foreground md:max-w-6xl md:text-7xl lg:text-8xl"
          aria-label="Bridging the gap between humans and AI"
          data-intro={playIntro ? "play" : "skip"}
          data-ready={heroIntroReady ? "true" : "false"}
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
