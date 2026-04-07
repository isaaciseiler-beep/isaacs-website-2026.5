import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState("10vw");

  useEffect(() => {
    const resize = () => {
      const el = textRef.current;
      if (!el) return;
      const containerWidth = window.innerWidth;
      const span = el.querySelector("span") as HTMLSpanElement;
      if (!span) return;
      let lo = 10, hi = 500, best = 10;
      for (let i = 0; i < 25; i++) {
        const mid = (lo + hi) / 2;
        span.style.fontSize = `${mid}px`;
        if (span.scrollWidth <= containerWidth) {
          best = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      span.style.fontSize = `${best}px`;
      setFontSize(`${best}px`);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
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

      {/* Large bottom name — flush to all edges, no padding/margin below */}
      <motion.div
        ref={textRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ lineHeight: 0, marginBottom: 0, paddingBottom: 0 }}
      >
        <span
          className="block font-semibold select-none whitespace-nowrap"
          style={{
            color: "hsl(50 33% 5%)",
            fontSize,
            letterSpacing: "-0.04em",
            lineHeight: 0.78,
            display: "block",
            marginBottom: 0,
            paddingBottom: 0,
          }}
        >
          ISAAC SEILER
        </span>
      </motion.div>
    </footer>
  );
};

export default Footer;
