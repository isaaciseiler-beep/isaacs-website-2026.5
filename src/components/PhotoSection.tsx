import { motion } from "framer-motion";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";

const photos = [
  { id: 1, title: "Skyline", location: "Chicago", image: photo1, height: "h-[60vh]", mt: "mt-[5vh]" },
  { id: 2, title: "Process", location: "Brooklyn", image: photo2, height: "h-[38vh]", mt: "mt-[25vh]" },
  { id: 3, title: "Light & Ruin", location: "Detroit", image: photo3, height: "h-[52vh]", mt: "mt-0" },
  { id: 4, title: "Vanishing Point", location: "Brussels", image: photo4, height: "h-[34vh]", mt: "mt-[18vh]" },
];

const PhotoSection = () => {
  return (
    <section className="snap-section relative flex items-start min-w-[200vw] overflow-visible">
      <div className="absolute top-12 left-16 z-10">
        <motion.p
          className="mono-text mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          02 — Visual Journal
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Photos
        </motion.h2>
      </div>

      <div className="flex items-start gap-4 pt-[28vh] px-16 pb-8">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className={`grid-item w-[22vw] ${photo.height} ${photo.mt} flex-shrink-0`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={photo.image}
              alt={photo.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="grid-item-overlay">
              <p className="mono-text mb-1">{photo.location}</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground font-display">
                {photo.title}
              </h3>
            </div>
          </motion.div>
        ))}

        <div className="flex-shrink-0 w-[10vw]" />
      </div>
    </section>
  );
};

export default PhotoSection;
