import { motion } from "framer-motion";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";

const photos = [
  { id: 1, title: "Skyline", location: "Chicago", image: photo1 },
  { id: 2, title: "Process", location: "Brooklyn", image: photo2 },
  { id: 3, title: "Light & Ruin", location: "Detroit", image: photo3 },
  { id: 4, title: "Vanishing Point", location: "Brussels", image: photo4 },
];

const PhotoSection = () => {
  return (
    <section className="py-24 px-12 md:px-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="section-label">03 — Visual Journal</p>
          <h2 className="section-heading mb-0">Photos</h2>
        </div>
        <a href="#" className="mono-text hover:text-foreground transition-colors duration-200 pb-1">
          View all →
        </a>
      </div>

      {/* Asymmetric 4:3 grid — 2 rows, interesting layout */}
      <div className="grid grid-cols-12 gap-1">
        {/* Large feature left */}
        <motion.div
          className="grid-item col-span-7 aspect-[4/3]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
        >
          <img src={photos[0].image} alt={photos[0].title} loading="lazy" className="w-full h-full object-cover" />
          <div className="grid-item-overlay">
            <p className="mono-text mb-1">{photos[0].location}</p>
            <h3 className="text-sm font-medium text-foreground">{photos[0].title}</h3>
          </div>
        </motion.div>

        {/* Stacked right */}
        <div className="col-span-5 grid grid-rows-2 gap-1">
          <motion.div
            className="grid-item aspect-[4/3]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.05, duration: 0.4 }}
          >
            <img src={photos[1].image} alt={photos[1].title} loading="lazy" className="w-full h-full object-cover" />
            <div className="grid-item-overlay">
              <p className="mono-text mb-1">{photos[1].location}</p>
              <h3 className="text-sm font-medium text-foreground">{photos[1].title}</h3>
            </div>
          </motion.div>
          <motion.div
            className="grid-item aspect-[4/3]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <img src={photos[2].image} alt={photos[2].title} loading="lazy" className="w-full h-full object-cover" />
            <div className="grid-item-overlay">
              <p className="mono-text mb-1">{photos[2].location}</p>
              <h3 className="text-sm font-medium text-foreground">{photos[2].title}</h3>
            </div>
          </motion.div>
        </div>

        {/* Full width bottom */}
        <motion.div
          className="grid-item col-span-12 aspect-[4/3] max-h-[50vh]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <img src={photos[3].image} alt={photos[3].title} loading="lazy" className="w-full h-full object-cover" />
          <div className="grid-item-overlay">
            <p className="mono-text mb-1">{photos[3].location}</p>
            <h3 className="text-sm font-medium text-foreground">{photos[3].title}</h3>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhotoSection;
