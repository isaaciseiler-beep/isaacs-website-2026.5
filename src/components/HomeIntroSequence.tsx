import { useEffect, useId, useLayoutEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const INTRO_DURATION_MS = 2940;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_REVEAL: [number, number, number, number] = [0.19, 1, 0.22, 1];
const FRAME_REVEAL_DELAY = 1.24;
const FRAME_REVEAL_DURATION = 1.34;
const OVERLAY_COLOR = "#f2ff9e";
const CLOSED_FRAME_RADIUS = 8;
const OPEN_FRAME_RADIUS = 0;

const getViewportSize = () => ({
  width: Math.max(window.innerWidth, 1),
  height: Math.max(window.innerHeight, 1),
});

interface HomeIntroSequenceProps {
  play: boolean;
  onComplete: () => void;
}

const IntroLogoText = ({ opening }: { opening: boolean }) => (
  <div className="flex items-center justify-center whitespace-nowrap font-mono text-[13px] font-normal uppercase leading-none tracking-[0.05em] text-[#15170c] md:text-[14px]">
    <span>I</span>
    <motion.span
      className="inline-block overflow-hidden will-change-[width,opacity]"
      initial={{ width: "0em", opacity: 0 }}
      animate={{ width: opening ? "3.2em" : "0em", opacity: opening ? 1 : 0 }}
      transition={{ duration: 0.72, delay: 0.18, ease: EASE_OUT }}
    >
      SAAC
    </motion.span>
    <motion.span
      className="inline-block overflow-hidden will-change-[width]"
      initial={{ width: "0em" }}
      animate={{ width: opening ? "0.35em" : "0em" }}
      transition={{ duration: 0.64, delay: 0.24, ease: EASE_OUT }}
    />
    <motion.span
      className="inline-block overflow-hidden will-change-[width,opacity]"
      initial={{ width: "0.76em", opacity: 1 }}
      animate={{ width: opening ? "0em" : "0.76em", opacity: opening ? 0 : 1 }}
      transition={{ duration: 0.52, delay: opening ? 0.18 : 0, ease: EASE_OUT }}
    >
      I
    </motion.span>
    <span>S</span>
    <motion.span
      className="inline-block overflow-hidden will-change-[width,opacity]"
      initial={{ width: "0em", opacity: 0 }}
      animate={{ width: opening ? "3.5em" : "0em", opacity: opening ? 1 : 0 }}
      transition={{ duration: 0.74, delay: 0.31, ease: EASE_OUT }}
    >
      EILER
    </motion.span>
  </div>
);

const HomeIntroSequence = ({ play, onComplete }: HomeIntroSequenceProps) => {
  const rawMaskId = useId();
  const maskId = `home-intro-mask-${rawMaskId.replace(/:/g, "")}`;
  const [opening, setOpening] = useState(false);
  const [viewport, setViewport] = useState(() => {
    if (typeof window === "undefined") return { width: 1, height: 1 };
    return getViewportSize();
  });
  const isMobileViewport = viewport.width < 768;
  const introDurationMs = INTRO_DURATION_MS;
  const frameRevealDelay = FRAME_REVEAL_DELAY;
  const frameRevealDuration = FRAME_REVEAL_DURATION;

  useLayoutEffect(() => {
    (window as Window & { __homeIntroPreboot?: boolean }).__homeIntroPreboot = false;
    document.documentElement.classList.remove("home-intro-preboot");
  }, []);

  const closedFrame = useMemo(
    () => ({
      x: viewport.width / 2 - 0.5,
      y: viewport.height / 2 - 0.5,
      width: 1,
      height: 1,
    }),
    [viewport.height, viewport.width],
  );

  const openFrame = useMemo(
    () => ({
      x: -56,
      y: -56,
      width: viewport.width + 112,
      height: viewport.height + 112,
    }),
    [viewport.height, viewport.width],
  );

  const closedAperture = useMemo(
    () => ({ ...closedFrame, rx: CLOSED_FRAME_RADIUS, ry: CLOSED_FRAME_RADIUS }),
    [closedFrame],
  );

  const openAperture = useMemo(
    () => ({ ...openFrame, rx: OPEN_FRAME_RADIUS, ry: OPEN_FRAME_RADIUS }),
    [openFrame],
  );

  useEffect(() => {
    if (!play) {
      onComplete();
      return;
    }

    let openTimer = 0;
    let doneTimer = 0;
    let firstFrame = 0;
    let secondFrame = 0;
    const openingDelayMs = 160;
    const completionDelayMs = Math.max(400, introDurationMs - openingDelayMs);

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        openTimer = window.setTimeout(() => {
          setOpening(true);
          doneTimer = window.setTimeout(onComplete, completionDelayMs);
        }, openingDelayMs);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(openTimer);
      window.clearTimeout(doneTimer);
    };
  }, [introDurationMs, isMobileViewport, onComplete, play]);

  useEffect(() => {
    if (!play) return;

    let frame = 0;
    const handleResize = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setViewport(getViewportSize());
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [play]);

  return (
    <AnimatePresence>
      {play && (
        <motion.div
          className="home-intro-overlay fixed inset-0 z-[90]"
          aria-hidden="true"
          data-opening={opening ? "true" : "false"}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <svg
            className="home-intro-mask pointer-events-none fixed inset-0 z-[1]"
            aria-hidden="true"
            width={viewport.width}
            height={viewport.height}
            viewBox={`0 0 ${viewport.width} ${viewport.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <rect width={viewport.width} height={viewport.height} fill="white" />
                <motion.rect
                  fill="black"
                  initial={closedAperture}
                  animate={opening ? openAperture : closedAperture}
                  transition={{ duration: frameRevealDuration, delay: frameRevealDelay, ease: EASE_REVEAL }}
                />
              </mask>
            </defs>

            <rect width={viewport.width} height={viewport.height} fill={OVERLAY_COLOR} mask={`url(#${maskId})`} />
          </svg>

          <div className="pointer-events-none fixed inset-0 z-[2] grid place-items-center">
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: opening ? 0 : 1,
                scale: opening ? [1, 1.025, 1.08] : 1,
              }}
              transition={{
                opacity: { duration: 0.5, delay: frameRevealDelay - 0.02, ease: EASE_REVEAL },
                scale: { duration: isMobileViewport ? 0.92 : 1.06, delay: isMobileViewport ? 0.48 : 0.62, times: [0, 0.42, 1], ease: EASE_REVEAL },
              }}
            >
              <IntroLogoText opening={opening} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeIntroSequence;
