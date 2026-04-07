import { motion } from "framer-motion";

const newsItems = [
  { id: 1, date: "Mar 2026", title: "Selected for ADC Annual Awards", description: "Urban Canvas project recognized in the branding category.", tag: "Award" },
  { id: 2, date: "Feb 2026", title: "Speaking at Config 2026", description: "Presenting on the intersection of street culture and digital design.", tag: "Event" },
  { id: 3, date: "Jan 2026", title: "Studio Expansion — Brooklyn", description: "New workspace opening in Williamsburg, Q2 2026.", tag: "Studio" },
  { id: 4, date: "Dec 2025", title: "Year in Review Published", description: "Reflecting on 14 projects shipped across 6 countries.", tag: "Editorial" },
];

const NewsSection = () => {
  return (
    <section className="py-12 px-3 md:px-3">
      <h2 className="section-heading">News</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsItems.map((item, index) => (
          <motion.a
            key={item.id}
            href="#"
            className="group relative block border border-border p-6 hover:bg-card/60 transition-colors duration-300 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
          >
            {/* Tag pill */}
            <span className="inline-block mono-text px-2 py-0.5 border border-border mb-4 text-foreground">
              {item.tag}
            </span>

            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 group-hover:text-foreground/80 transition-colors duration-200">
              {item.title}
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed mb-4">
              {item.description}
            </p>

            <div className="flex items-center justify-between">
              <p className="mono-text">{item.date}</p>
              <span className="text-foreground text-sm opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300">
                →
              </span>
            </div>

            {/* Subtle bottom accent line on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
