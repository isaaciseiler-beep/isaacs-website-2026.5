import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import SearchTrigger from "@/components/SearchOverlay";

const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface SiteHeaderProps {
  open: boolean;
  onToggle: () => void;
}

const parseRgb = (value: string) => {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;

  const [r, g, b, a = "1"] = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
  if ([r, g, b, a].some((channel) => Number.isNaN(channel))) return null;
  if (a === 0) return null;
  return { r, g, b };
};

const luminanceFor = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const backgroundAtPoint = (x: number, y: number, header: HTMLElement | null) => {
  const elements = document.elementsFromPoint(x, y);

  for (const element of elements) {
    if (!(element instanceof HTMLElement)) continue;
    if (header?.contains(element)) continue;

    let current: HTMLElement | null = element;
    while (current) {
      const color = parseRgb(window.getComputedStyle(current).backgroundColor);
      if (color) return color;
      current = current.parentElement;
    }
  }

  return parseRgb(window.getComputedStyle(document.body).backgroundColor) ?? { r: 0, g: 0, b: 0 };
};

const SiteHeader = ({ open, onToggle }: SiteHeaderProps) => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [ink, setInk] = useState("rgb(255 255 255)");

  useEffect(() => {
    let frame = 0;

    const updateInk = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;

      const rect = header.getBoundingClientRect();
      const samples = [
        backgroundAtPoint(rect.left + 16, rect.top + rect.height / 2, header),
        backgroundAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, header),
        backgroundAtPoint(rect.right - 16, rect.top + rect.height / 2, header),
      ];
      const averageLuminance =
        samples.reduce((total, color) => total + luminanceFor(color), 0) / samples.length;

      setInk(averageLuminance > 0.42 ? "rgb(12 12 10)" : "rgb(255 255 255)");
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateInk);
    };

    updateInk();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div
      ref={headerRef}
      className="site-header-xray fixed left-0 top-0 z-[60] flex items-center gap-1 px-6 py-4"
      style={{ color: ink }}
    >
      <Link to="/" className="contents">
        <Logo />
      </Link>
      <motion.button
        onClick={onToggle}
        className="site-nav-toggle-xray flex h-5 w-5 items-center justify-center transition-opacity duration-200 hover:opacity-70"
        aria-label="Toggle menu"
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3, ease: EASE_TEXT }}
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </motion.button>
      <SearchTrigger style={{ color: ink }} />
    </div>
  );
};

export default SiteHeader;
