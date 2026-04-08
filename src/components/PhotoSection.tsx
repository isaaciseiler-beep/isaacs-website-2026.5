import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

// Preload all photos
photos.forEach((p) => {
  const img = new Image();
  img.src = p.image;
});

const PhotoSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-12">
      <div className="px-6 md:px-6 mb-6">
        <h2 className="section-heading mb-0">Photos</h2>
      </div>

      <div className="relative group/photos">
        <div
          ref={scrollRef}
          className="flex gap-[3px] overflow-x-auto scrollbar-hide px-6 md:px-6"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="grid-item flex-shrink-0"
              style={{ width: "calc(66% - 2px)", scrollSnapAlign: "start", aspectRatio: "3/2" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="grid-item-overlay">
                <p className="mono-text mb-0.5">{photo.location}</p>
                <h3 className="text-xs font-medium text-foreground">{photo.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover/photos:opacity-100 transition-opacity duration-300 hover:bg-background"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground opacity-0 group-hover/photos:opacity-100 transition-opacity duration-300 hover:bg-background"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </section>
  );
};

export default PhotoSection;
