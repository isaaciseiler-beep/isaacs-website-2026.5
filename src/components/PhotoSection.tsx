import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";
import PhotoPreview from "@/components/PhotoPreview";
import { albums, coverFor } from "@/lib/photoAlbums";

const photos = albums.map((a, i) => ({
  id: i + 1,
  title: a.location,
  image: coverFor(a),
}));

photos.forEach((p) => { const img = new Image(); img.src = p.image; });

const PhotoSection = () => {
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hovering) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    let tick = 0;
    let i = activeIdx;
    const schedule = () => {
      // staggered cadence: slow start, accelerate, then ease out
      const cadence = [520, 380, 260, 200, 170, 160, 170, 200, 260, 340, 420, 500];
      const delay = cadence[tick % cadence.length];
      timeoutRef.current = setTimeout(() => {
        i = (i + 1) % photos.length;
        setActiveIdx(i);
        tick++;
        schedule();
      }, delay);
    };
    schedule();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovering]);

  return (
    <section className="py-12">
      <div className="px-6 mb-6 flex items-end justify-between">
        <SectionHeading className="mb-0">Photos</SectionHeading>
      </div>

      <div className="px-6">
        <div
          className="relative w-full overflow-hidden cursor-pointer group"
          style={{ aspectRatio: "3/1.365" }}
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
