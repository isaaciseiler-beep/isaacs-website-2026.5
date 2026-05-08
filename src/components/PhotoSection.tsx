import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import PhotoPreview from "@/components/PhotoPreview";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";

const photos = [
  { id: 1, title: "Christchurch, New Zealand", location: "Christchurch, New Zealand", image: photo1 },
  { id: 2, title: "Banli, Taiwan", location: "Banli, Taiwan", image: photo2 },
  { id: 3, title: "Aoraki National Park", location: "Aoraki National Park", image: photo3 },
  { id: 4, title: "Las Palmas de Gran Canaria, Spain", location: "Las Palmas de Gran Canaria, Spain", image: photo4 },
  { id: 5, title: "Djupivogur, Iceland", location: "Djupivogur, Iceland", image: photo1 },
  { id: 6, title: "Qiaozi Village, Taiwan", location: "Qiaozi Village, Taiwan", image: photo2 },
];

photos.forEach((p) => { const img = new Image(); img.src = p.image; });

const PhotoSection = () => {
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hovering) {
      let i = activeIdx;
      intervalRef.current = setInterval(() => {
        i = (i + 1) % photos.length;
        setActiveIdx(i);
      }, 220);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovering]);

  const activePhoto = photos[activeIdx];

  return (
    <section className="py-12">
      <div className="px-6 mb-6 flex items-end justify-between">
        <SectionHeading className="mb-0">Photos</SectionHeading>
      </div>

      <div className="px-6">
        <div
          className="relative w-full overflow-hidden cursor-pointer group"
          style={{ aspectRatio: "3/1.05" }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => setPreviewIdx(activeIdx)}
        >
          {photos.map((photo, idx) => (
            <img
              key={photo.id}
              src={photo.image}
              alt={photo.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: idx === activeIdx ? 1 : 0,
                filter: hovering ? "grayscale(0%)" : "grayscale(100%)",
                transform: hovering ? "scale(1.02)" : "scale(1)",
                transition: "opacity 140ms ease-out, filter 600ms ease-out, transform 900ms cubic-bezier(0.16,1,0.3,1)",
              }}
              loading="eager"
            />
          ))}

          {/* Bottom gradient + caption */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}
          />
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4 pointer-events-none">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/80">
              {activePhoto.location}
            </p>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 tabular-nums">
              {String(activeIdx + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </p>
          </div>

          {/* Progress ticks */}
          <div className="absolute top-4 left-5 right-5 flex gap-1 pointer-events-none">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 h-[2px] transition-colors duration-200"
                style={{ background: idx === activeIdx ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.18)" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <Link to="/photos" className="block">
          <motion.div className="group relative w-full py-2.5 text-sm font-mono tracking-[0.2em] uppercase rounded-full bg-foreground overflow-hidden flex items-center justify-center cursor-pointer" whileTap={{ scale: 0.995 }}>
            <span
              className="absolute inset-0 bg-[hsl(var(--highlight))] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            />
            <span className="relative z-10 text-background flex items-center justify-center">
              View my Portfolio
              <span className="inline-flex overflow-hidden max-w-0 group-hover:max-w-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" strokeWidth={1.5} />
              </span>
            </span>
          </motion.div>
        </Link>
      </div>

      <PhotoPreview
        images={photos.map(p => p.image)}
        currentIndex={previewIdx}
        onClose={() => setPreviewIdx(null)}
        onNavigate={setPreviewIdx}
      />
    </section>
  );
};

export default PhotoSection;
