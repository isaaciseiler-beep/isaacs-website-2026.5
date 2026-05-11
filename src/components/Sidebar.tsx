import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Mail, Sun } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { CONTACT_MAILTO, GITHUB_URL, LINKEDIN_URL, SUBSTACK_URL } from "@/lib/site";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_TEXT: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const SlimMoon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const themeOptions = [
  { value: "dark" as const, label: "Dark", icon: SlimMoon },
  { value: "light" as const, label: "Light", icon: Sun },
];

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      {themeOptions.map((opt) => {
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => {
              if (opt.value === "dark") {
                toast("Dark Mode coming soon");
                return;
              }
              setTheme(opt.value);
            }}
            className={`w-10 h-10 flex items-center justify-center transition-colors duration-300 ${
              active ? "bg-foreground text-background" : "bg-foreground/10 text-foreground hover:bg-foreground/20"
            }`}
            aria-label={opt.label}
          >
            <opt.icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};

interface SitemapItem {
  id: string;
  label: string;
  scrollTo?: string;
  href?: string;
  children?: { id: string; label: string; href: string }[];
}

export const sitemapItems: SitemapItem[] = [
  { id: "hero", label: "Home", scrollTo: "hero" },
  { id: "projects", label: "Work", scrollTo: "projects", children: [
    { id: "project-archive", label: "Projects", href: "/projects" },
  ]},
  { id: "about", label: "About", scrollTo: "about" },
  { id: "news", label: "News", scrollTo: "news" },
  { id: "photos", label: "Photos", scrollTo: "photos", children: [
    { id: "portfolio", label: "Portfolio", href: "/photos" },
  ]},
  { id: "inspiration", label: "Inspiration", scrollTo: "inspiration" },
];

const socialLinks = [
  {
    id: "linkedin", label: "LinkedIn", href: LINKEDIN_URL,
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    id: "github", label: "GitHub", href: GITHUB_URL,
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
  },
  {
    id: "substack", label: "Substack", href: SUBSTACK_URL,
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22.539 8.242H1.461V5.406h21.078v2.836zM1.461 10.812V24L12 18.11 22.539 24V10.812H1.461zM22.539 0H1.461v2.836h21.078V0z"/></svg>,
  },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  activeSection?: string;
}

const Sidebar = ({ open, onToggle, activeSection }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnPhotos = location.pathname === "/photos";
  const isOnProjects = location.pathname.startsWith("/projects");

  const handleItemClick = (item: SitemapItem) => {
    if (item.scrollTo) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(item.scrollTo!);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.getElementById(item.scrollTo);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (item.href) navigate(item.href);
  };

  const handleChildClick = (child: { href: string }) => {
    navigate(child.href);
  };

  const handleSocialClick = (href: string) => {
    if (href.startsWith("http")) window.open(href, "_blank", "noopener");
    else window.location.href = href;
  };

  const isItemActive = (item: SitemapItem) => {
    if (isOnPhotos && item.id === "photos") return true;
    if (isOnProjects && item.id === "projects") return true;
    if (activeSection && activeSection === item.id) return true;
    return false;
  };

  const isChildActive = (child: { id: string; href: string }) => {
    if (isOnPhotos && child.id === "portfolio") return true;
    if (isOnProjects && child.id === "project-archive") return true;
    return location.pathname === child.href;
  };

  let flatIndex = 0;

  return (
    <>
      <motion.button
        onClick={onToggle}
        className="w-5 h-5 flex items-center justify-center text-foreground hover:text-foreground/60 transition-colors duration-200 relative z-[60]"
        aria-label="Toggle menu"
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3, ease: EASE_TEXT }}
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </motion.button>

      <motion.nav
        className="fixed left-0 top-0 h-screen w-[240px] bg-background z-[45] flex flex-col justify-between px-6 py-20 overflow-y-auto"
        animate={{ x: open ? 0 : -240 }}
        transition={{ duration: 0.4, ease: EASE_TEXT }}
      >
        <AnimatePresence>
          {open && (
            <div className="mt-4">
              <div className="flex flex-col gap-0.5 relative">
                {sitemapItems.map((item) => {
                  const idx = flatIndex++;
                  const active = isItemActive(item);
                  return (
                    <div key={item.id}>
                      <motion.button
                        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                        transition={{ delay: 0.08 + idx * 0.05, duration: 0.5, ease: EASE }}
                        onClick={() => handleItemClick(item)}
                        className={`text-left py-1.5 text-sm font-medium transition-colors duration-300 origin-left ${
                          active ? "text-foreground" : "text-foreground/30 hover:text-foreground/60"
                        }`}
                      >
                        {item.label}
                      </motion.button>

                      {item.children?.map((child) => {
                        const childIdx = flatIndex++;
                        const childActive = isChildActive(child);
                        return (
                          <motion.button
                            key={child.id}
                            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                            transition={{ delay: 0.08 + childIdx * 0.05, duration: 0.5, ease: EASE }}
                            onClick={() => handleChildClick(child)}
                            className={`text-left py-1.5 pl-4 text-sm font-medium transition-colors duration-300 origin-left block ${
                              childActive ? "text-foreground" : "text-foreground/30 hover:text-foreground/60"
                            }`}
                          >
                            {child.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(4px)" }}
              transition={{ delay: 0.25, duration: 0.5, ease: EASE, filter: { duration: 0.6, delay: 0.3 } }}
            >
              <p className="mono-text mb-3">Get in Touch</p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => { window.location.href = CONTACT_MAILTO; }}
                  className="w-10 h-10 bg-foreground/10 hover:bg-foreground/20 text-foreground flex items-center justify-center transition-colors duration-300"
                  aria-label="Contact"
                >
                  <Mail className="w-4 h-4" />
                </button>
                {socialLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleSocialClick(link.href)}
                    className="w-10 h-10 bg-foreground/10 hover:bg-foreground/20 text-foreground flex items-center justify-center transition-colors duration-300"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </button>
                ))}
              </div>
              <p className="mono-text mb-3 mt-6">Appearance</p>
              <ThemeSwitch />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Sidebar;
export type { SitemapItem };
