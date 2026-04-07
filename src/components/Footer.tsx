import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Github } from "lucide-react";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const nameScale = useTransform(scrollYProgress, [0.3, 1], [0.8, 1]);
  const nameOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const nameY = useTransform(scrollYProgress, [0.3, 1], [60, 0]);

  return (
    <footer ref={footerRef} id="footer" className="border-t border-border overflow-hidden">
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

      {/* Large name with parallax reveal */}
      <motion.div
        className="relative w-full mt-8 pb-4 px-2"
        style={{ scale: nameScale, opacity: nameOpacity, y: nameY }}
      >
        <h2
          className="text-[12vw] md:text-[10vw] font-semibold tracking-tighter leading-none text-foreground text-center whitespace-nowrap overflow-hidden"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          ISAAC SEILER
        </h2>
      </motion.div>
    </footer>
  );
};

export default Footer;
