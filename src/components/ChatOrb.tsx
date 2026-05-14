import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToPageSection } from "@/lib/scroll";

const DOT_SIZE = 40;
const DOT_BOTTOM = 20;
const DOT_LEFT = 24;
const EXPANDED_WIDTH = 184;
const SIDEBAR_DEPLOY_MS = 560;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ChatOrb = () => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const disabled = location.pathname === "/photos" || location.pathname === "/photos/map";

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  useEffect(() => {
    const handleSidebarState = (event: Event) => {
      const nextOpen = Boolean((event as CustomEvent<{ open?: boolean }>).detail?.open);
      setSidebarOpen(nextOpen);
    };

    window.addEventListener("site-sidebar-state", handleSidebarState);
    return () => window.removeEventListener("site-sidebar-state", handleSidebarState);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) {
      setSidebarReady(false);
      return;
    }

    const timer = window.setTimeout(() => setSidebarReady(true), SIDEBAR_DEPLOY_MS);
    return () => window.clearTimeout(timer);
  }, [sidebarOpen]);

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

  const shouldRender = !disabled && (visible || sidebarOpen) && (!sidebarOpen || sidebarReady);

  return (
    <AnimatePresence>
      {shouldRender ? (
        <motion.button
          type="button"
          onClick={handleClick}
          className="chat-orb site-corner fixed z-[58] flex items-center justify-end overflow-hidden text-accent-foreground shadow-[0_10px_28px_rgba(0,0,0,0.22)]"
          style={{
            bottom: DOT_BOTTOM,
            left: DOT_LEFT,
            height: DOT_SIZE,
            transformOrigin: "left center",
          }}
          initial={{ width: DOT_SIZE, scale: 0.84, opacity: 0 }}
          animate={{ width: expanded ? EXPANDED_WIDTH : DOT_SIZE, scale: 1, opacity: 1 }}
          exit={{ width: DOT_SIZE, scale: 0.84, opacity: 0 }}
          transition={{ duration: 0.42, ease: EASE }}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.985 }}
          aria-label={expanded ? "Go to Isaac AI" : "Chat with Isaac AI"}
        >
          <motion.span
            className="relative z-10 min-w-0 flex-1 whitespace-nowrap pl-4 pr-2 text-left text-xs font-semibold leading-none"
            animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : 8 }}
            transition={{ duration: 0.24, ease: EASE }}
            aria-hidden={!expanded}
          >
            Chat with Isaac AI
          </motion.span>
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} />
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
};

export default ChatOrb;
