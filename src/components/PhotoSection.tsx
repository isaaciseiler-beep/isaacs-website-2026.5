import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";

const photos = [
  { id: 1, title: "Skyline", location: "Chicago", image: photo1 },
  { id: 2, title: "Process", location: "Brooklyn", image: photo2 },
  { id: 3, title: "Light & Ruin", location: "Detroit", image: photo3 },
  { id: 4, title: "Vanishing Point", location: "Brussels", image: photo4 },
  { id: 5, title: "Underpass", location: "Tokyo", image: photo1 },
  { id: 6, title: "Grain", location: "Berlin", image: photo2 },
];

const PhotoItem = ({ photo, index }: { photo: typeof photos[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [10, -10]);

  // Stagger: odd items get a top offset
  const isOdd = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      className={`grid-item aspect-[4/3] ${isOdd ? "mt-8 md:mt-12" : ""}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
    >
      <motion.img
        src={photo.image}
        alt={photo.title}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ y }}
      />
      <div className="grid-item-overlay">
        <p className="mono-text mb-0.5">{photo.location}</p>
        <h3 className="text-xs font-medium text-foreground">{photo.title}</h3>
      </div>
    </motion.div>
  );
};

const PhotoSection = () => {
  return (
    <section className="py-12 px-5 md:px-6">
      <div className="flex items-end justify-between mb-6">
        <h2 className="section-heading mb-0">Photos</h2>
        <a href="#" className="mono-text hover:text-foreground transition-colors duration-200 pb-0.5">
          View all →
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-[3px]">
        {photos.map((photo, index) => (
          <PhotoItem key={photo.id} photo={photo} index={index} />
        ))}
      </div>
    </section>
  );
};

export default PhotoSection;
