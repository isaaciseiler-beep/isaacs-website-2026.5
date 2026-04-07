import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FOOTER_TEXT = "ISAAC SEILER";
const BASE_FONT_SIZE = 200;
const FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif";

type FooterTextMetrics = {
  viewBoxWidth: number;
  viewBoxHeight: number;
  textX: number;
  textY: number;
};

const Footer = () => {
  const [metrics, setMetrics] = useState<FooterTextMetrics | null>(null);

  useEffect(() => {
    const measure = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return;

      context.font = `600 ${BASE_FONT_SIZE}px ${FONT_FAMILY}`;
      const textMetrics = context.measureText(FOOTER_TEXT);

      const left = textMetrics.actualBoundingBoxLeft ?? 0;
      const right = textMetrics.actualBoundingBoxRight ?? textMetrics.width;
      const ascent = textMetrics.actualBoundingBoxAscent ?? BASE_FONT_SIZE * 0.72;
      const descent = textMetrics.actualBoundingBoxDescent ?? BASE_FONT_SIZE * 0.08;

      setMetrics({
        viewBoxWidth: Math.max(1, left + right),
        viewBoxHeight: Math.max(1, ascent + descent),
        textX: left,
        textY: ascent,
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    } else {
      measure();
    }
  }, []);

  return (
    <footer className="border-t border-border overflow-visible">
      <div className="px-6 md:px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="mono-text mb-2">Expertise</p>
            <p className="text-foreground text-sm leading-relaxed">
              Brand Identity / Web Design / Photography / Art Direction
            </p>
          </div>
          <div>
            <p className="mono-text mb-2">Contact</p>
            <p className="text-foreground text-sm">hello@studio.com</p>
          </div>
          <div>
            <p className="mono-text mb-2">Social</p>
            <div className="flex gap-6 text-foreground text-sm">
              <a href="#" className="hover:text-foreground/60 transition-colors duration-200">Instagram</a>
              <a href="#" className="hover:text-foreground/60 transition-colors duration-200">Behance</a>
              <a href="#" className="hover:text-foreground/60 transition-colors duration-200">Twitter</a>
            </div>
          </div>
        </div>
        <p className="mono-text mt-10">© 2026</p>
      </div>

      <motion.div
        className="relative left-1/2 mt-16 w-[calc(100vw+6px)] -translate-x-1/2 overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {metrics && (
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${metrics.viewBoxWidth} ${metrics.viewBoxHeight}`}
            style={{ display: "block", width: "100%", height: "auto", color: "hsl(50 33% 5%)" }}
          >
            <text
              x={metrics.textX}
              y={metrics.textY}
              fill="currentColor"
              fontSize={BASE_FONT_SIZE}
              fontWeight="600"
              style={{ fontFamily: FONT_FAMILY }}
            >
              {FOOTER_TEXT}
            </text>
          </svg>
        )}
      </motion.div>
    </footer>
  );
};

export default Footer;
