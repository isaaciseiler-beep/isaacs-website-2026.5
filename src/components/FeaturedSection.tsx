import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projectItems = [
  { id: 1, title: "Urban Canvas", subtitle: "Redefining street identity through design", image: project1 },
  { id: 2, title: "Concrete Dreams", subtitle: "Architectural storytelling in concrete", image: project2 },
  { id: 3, title: "Neon Nights", subtitle: "A photographic exploration of city light", image: project3 },
];

const FeaturedSection = () => {
  return (
    <section className="px-6 md:px-6 pb-12">
      {/* Hero feature card — no parallax, static image */}
      <div className="relative overflow-hidden group cursor-pointer">
        <div className="aspect-[16/7] md:aspect-[21/9] overflow-hidden">
          <img
            src={projectItems[0].image}
            alt={projectItems[0].title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <h3 className="text-2xl md:text-4xl font-semibold tracking-tighter text-foreground leading-tight">
            {projectItems[0].title}
          </h3>
          <p className="text-sm text-foreground/60 mt-1 max-w-md">
            {projectItems[0].subtitle}
          </p>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-foreground text-lg">↗</span>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="grid grid-cols-2 gap-[3px] mt-[3px]">
        {projectItems.slice(1).map((t) => (
          <div key={t.id} className="grid-item aspect-[16/9] cursor-pointer">
            <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
            <div className="grid-item-overlay">
              <p className="text-xs font-medium text-foreground">{t.title}</p>
              <p className="text-[10px] text-foreground/60 mt-0.5">{t.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
