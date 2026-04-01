import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const words = "A multidisciplinary creative working at the intersection of design, photography, and technology. Focused on building experiences that feel both intentional and alive.".split(" ");

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.2"],
  });

  return (
    <section className="py-24 px-12 md:px-24">
      <p className="section-label">04 — About</p>
      <h2 className="section-heading">About</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div ref={containerRef}>
          <p className="text-2xl md:text-3xl leading-relaxed font-light tracking-tight">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
            })}
          </p>

          <motion.p
            className="text-base text-muted-foreground mt-8 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Currently available for freelance projects and collaborations.
            Based nowhere specific — working everywhere.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-8">
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
                <a href="#" className="hover:text-muted-foreground transition-colors duration-200">Instagram</a>
                <a href="#" className="hover:text-muted-foreground transition-colors duration-200">Behance</a>
                <a href="#" className="hover:text-muted-foreground transition-colors duration-200">Twitter</a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Word = ({ children, progress, range }: { children: string; progress: any; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <span className="inline-block mr-[0.3em]">
      <motion.span style={{ opacity }} className="inline-block text-foreground">
        {children}
      </motion.span>
    </span>
  );
};

export default AboutSection;
