import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import headshot from "@/assets/headshot.jpg";

const statement =
  "A multidisciplinary creative working at the intersection of design, photography, and technology. Focused on building experiences that feel both intentional and alive.";
const words = statement.split(" ");

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.04,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imgRotate = useTransform(scrollYProgress, [0, 1], [2, -1]);

  return (
    <section ref={sectionRef} className="py-12 px-6">
      <SectionHeading>About</SectionHeading>

      <div className="relative flex flex-col md:flex-row md:items-start gap-8 md:gap-0">
        {/* Text — wraps around the photo on desktop */}
        <div className="md:flex-1 md:pr-6">
          <p className="text-2xl md:text-3xl leading-snug font-light tracking-tight text-foreground">
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.3em]"
                variants={wordVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                custom={i}
              >
                {word}
              </motion.span>
            ))}
          </p>

          <motion.p
            className="text-sm text-foreground/50 mt-8 leading-relaxed max-w-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Currently available for select projects and collaborations.
          </motion.p>
        </div>

        {/* Headshot — overlapping, diagonal-clipped, parallax-driven */}
        <motion.div
          className="relative md:w-[220px] lg:w-[260px] shrink-0 self-start"
          style={{ y: imgY, rotate: imgRotate }}
        >
          <motion.div
            className="relative overflow-hidden"
            style={{
              clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
            initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={headshot}
              alt="Portrait"
              className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              loading="lazy"
              width={768}
              height={1024}
            />

            {/* Scan-line overlay for texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
              }}
            />
          </motion.div>

          {/* Floating label */}
          <motion.span
            className="absolute -bottom-3 -left-2 text-[10px] font-mono tracking-[0.3em] text-foreground/30 uppercase"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Est. 2019
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
