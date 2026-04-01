import { motion } from "framer-motion";
import { Camera, FolderOpen, User, Home } from "lucide-react";

interface PortfolioSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "hero", icon: Home, label: "Home" },
  { id: "projects", icon: FolderOpen, label: "Projects" },
  { id: "photos", icon: Camera, label: "Photos" },
  { id: "about", icon: User, label: "About" },
];

const PortfolioSidebar = ({ activeSection, onNavigate }: PortfolioSidebarProps) => {
  return (
    <motion.nav
      className="fixed left-0 top-0 h-screen w-16 bg-sidebar border-r border-sidebar-border z-50 flex flex-col items-center justify-between py-8"
      initial={{ x: -64 }}
      animate={{ x: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
    >
      {/* Logo mark */}
      <div className="w-8 h-8 border border-sidebar-foreground flex items-center justify-center">
        <span className="text-sidebar-primary text-xs font-bold font-display">S</span>
      </div>

      {/* Nav items */}
      <div className="flex flex-col items-center gap-6">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group relative w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
              }`}
              aria-label={item.label}
            >
              <item.icon
                className={`w-4 h-4 transition-colors duration-300 ${
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-primary"
                }`}
              />
              {/* Tooltip */}
              <span className="absolute left-14 bg-card text-foreground text-xs px-3 py-1.5 font-mono tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {item.label}
              </span>
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 w-px h-full bg-sidebar-primary"
                  layoutId="sidebar-indicator"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom year */}
      <p className="text-sidebar-foreground text-[10px] font-mono tracking-widest" style={{ writingMode: "vertical-rl" }}>
        © 2026
      </p>
    </motion.nav>
  );
};

export default PortfolioSidebar;
