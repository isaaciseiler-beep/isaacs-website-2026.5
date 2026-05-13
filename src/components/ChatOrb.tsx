import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToPageSection } from "@/lib/scroll";

const DOT_SIZE = 36;
const DOT_BOTTOM = 20;
const DOT_RIGHT = 20;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ChatOrb = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(DOT_BOTTOM);
  const location = useLocation();
  const navigate = useNavigate();
  const disabled = location.pathname === "/photos" || location.pathname === "/photos/map";

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 10);

      const footer = document.getElementById("footer");
      if (!footer) {
        setBottomOffset(DOT_BOTTOM);
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      setBottomOffset(footerTop < windowHeight ? windowHeight - footerTop + DOT_BOTTOM : DOT_BOTTOM);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const collapse = () => setExpanded(false);
    window.addEventListener("scroll", collapse, { passive: true });
    return () => window.removeEventListener("scroll", collapse);
  }, [expanded]);

  useEffect(() => {
    if (disabled) setExpanded(false);
  }, [disabled]);

  const scrollToIsaacAI = () => {
    if (location.pathname === "/") {
      scrollToPageSection("isaac-ai");
      return;
    }

    navigate("/#isaac-ai");
  };

  const handleClick = () => {
    if (!expanded) {
      setExpanded(true);
      return;
    }

    scrollToIsaacAI();
  };

  return (
    <AnimatePresence>
      {visible && !disabled ? (
        <motion.button
          type="button"
          onClick={handleClick}
          className="site-corner fixed z-[58] flex items-center justify-end overflow-hidden bg-[hsl(var(--highlight))] text-accent-foreground shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
          style={{
            bottom: bottomOffset,
            right: DOT_RIGHT,
            height: DOT_SIZE,
            transformOrigin: "right center",
          }}
          initial={{ width: DOT_SIZE, scale: 0.84, opacity: 0 }}
          animate={{ width: expanded ? 188 : DOT_SIZE, scale: 1, opacity: 1 }}
          exit={{ width: DOT_SIZE, scale: 0.84, opacity: 0 }}
          transition={{ duration: 0.46, ease: EASE }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label={expanded ? "Go to Isaac AI" : "Chat with Isaac AI"}
        >
          <motion.span
            className="min-w-0 flex-1 whitespace-nowrap pl-4 pr-2 text-left text-xs font-semibold leading-none"
            animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : 8 }}
            transition={{ duration: 0.24, ease: EASE }}
            aria-hidden={!expanded}
          >
            Chat with Isaac AI
          </motion.span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} />
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
};

export default ChatOrb;
