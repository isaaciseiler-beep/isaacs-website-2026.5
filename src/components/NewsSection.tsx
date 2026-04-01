import { motion } from "framer-motion";

const newsItems = [
  { id: 1, date: "Mar 2026", title: "Selected for ADC Annual Awards", description: "Urban Canvas project recognized in the branding category." },
  { id: 2, date: "Feb 2026", title: "Speaking at Config 2026", description: "Presenting on the intersection of street culture and digital design." },
  { id: 3, date: "Jan 2026", title: "Studio Expansion — Brooklyn", description: "New workspace opening in Williamsburg, Q2 2026." },
  { id: 4, date: "Dec 2025", title: "Year in Review Published", description: "Reflecting on 14 projects shipped across 6 countries." },
];

const NewsSection = () => {
  return (
    <section className="py-16 px-6 md:px-12">
      <h2 className="section-heading">News</h2>

      <div className="border-t border-border">
        {newsItems.map((item, index) => (
          <motion.a
            key={item.id}
            href="#"
            className="group flex items-start md:items-center justify-between py-5 border-b border-border hover:bg-card/50 -mx-3 px-3 transition-colors duration-200"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <div className="flex-1">
              <p className="mono-text mb-1">{item.date}</p>
              <h3 className="text-lg font-medium text-foreground group-hover:text-muted-foreground transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 hidden md:block">{item.description}</p>
            </div>
            <span className="mono-text opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4">→</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
