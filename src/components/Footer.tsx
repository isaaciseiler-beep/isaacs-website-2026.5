import { motion } from "framer-motion";

const socialLinks = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    id: "substack",
    label: "Substack",
    href: "https://substack.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.539 8.242H1.461V5.406h21.078v2.836zM1.461 10.812V24L12 18.11 22.539 24V10.812H1.461zM22.539 0H1.461v2.836h21.078V0z" />
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer id="footer" className="relative overflow-hidden bg-background">
      <motion.div
        aria-hidden
        className="absolute -inset-x-[4%] -top-[10%] -bottom-[6%] z-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)) 22%, hsl(var(--foreground) / 0.12) 62%, hsl(var(--foreground) / 0.92) 100%)",
        }}
        animate={{
          y: ["0%", "-1.5%", "0%"],
          scale: [1, 1.015, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 px-6 pt-20 pb-6">
        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex items-center gap-5 text-foreground/60">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-foreground"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <p className="font-mono text-[10px] tracking-widest uppercase text-foreground/45">
            © Isaac Irvin Seiler
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1000 122"
          preserveAspectRatio="none"
          className="block h-[clamp(88px,10.5vw,132px)] w-full"
          aria-hidden
        >
          <text
            x="0"
            y="104"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="hsl(var(--background) / 0.18)"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
            fontWeight="600"
            fontSize="124"
          >
            ISAAC SEILER
          </text>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
