import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="border-t border-border px-3 md:px-6 py-12 overflow-hidden">
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

      {/* Large bottom name */}
      <motion.div
        className="mt-16 -mb-4 -mx-3 md:-mx-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p
          className="text-[12vw] md:text-[10vw] font-semibold tracking-tighter leading-none text-center select-none"
          style={{ color: "hsl(50 33% 5%)" }}
        >
          ISAAC SEILER
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
