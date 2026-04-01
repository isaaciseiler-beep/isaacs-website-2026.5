import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="snap-section w-screen flex items-center justify-center relative overflow-hidden">
      {/* Large decorative number */}
      <motion.span
        className="absolute -right-20 top-1/2 -translate-y-1/2 text-[40vh] font-bold text-border/30 leading-none select-none pointer-events-none font-display"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        03
      </motion.span>

      <div className="relative z-10 px-16 md:px-32 max-w-[70vw]">
        <motion.p
          className="mono-text mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          03 — About
        </motion.p>

        <motion.h2
          className="section-title-filled mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          About
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              A multidisciplinary creative working at the intersection of design, 
              photography, and technology. Focused on building experiences that feel 
              both intentional and alive.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Currently available for freelance projects and collaborations. 
              Based nowhere specific — working everywhere.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="space-y-6">
              <div>
                <p className="mono-text mb-2">Expertise</p>
                <p className="text-foreground">
                  Brand Identity / Web Design / Photography / Art Direction
                </p>
              </div>
              <div>
                <p className="mono-text mb-2">Contact</p>
                <p className="text-foreground">hello@studio.com</p>
              </div>
              <div>
                <p className="mono-text mb-2">Social</p>
                <div className="flex gap-6 text-foreground">
                  <span className="cursor-pointer hover:text-muted-foreground transition-colors duration-300">Instagram</span>
                  <span className="cursor-pointer hover:text-muted-foreground transition-colors duration-300">Behance</span>
                  <span className="cursor-pointer hover:text-muted-foreground transition-colors duration-300">Twitter</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
