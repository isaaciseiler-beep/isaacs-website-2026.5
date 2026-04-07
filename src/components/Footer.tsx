import { Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="border-t border-border overflow-hidden relative">
      <div className="px-6 md:px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="mono-text mb-2">Contact</p>
            <a href="/contact" className="text-foreground text-sm hover:text-foreground/60 transition-colors duration-200">
              Get in touch →
            </a>
          </div>
          <div>
            <p className="mono-text mb-2">Social</p>
            <div className="flex gap-4 text-foreground">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/60 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/60 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <p className="mono-text mb-2">© 2026</p>
          </div>
        </div>
      </div>

      {/* Fixed-style name anchored at bottom, edge to edge, slightly darker */}
      <div className="w-full overflow-hidden" style={{ lineHeight: 0.85 }}>
        <h2
          className="font-semibold tracking-tighter leading-none w-full text-center"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: "min(12vw, 220px)",
            color: "hsl(var(--foreground) / 0.06)",
          }}
        >
          ISAAC SEILER
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
