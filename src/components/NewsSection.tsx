import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { newsItems, type NewsItem } from "@/lib/siteContent";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const storyDetails: Record<
  number,
  {
    eyebrow: string;
    dek: string;
    proof: string;
  }
> = {
  1: {
    eyebrow: "OpenAI x Fulbright",
    dek: "An education-focused feature connecting Isaac's Fulbright Taiwan work with OpenAI-supported classroom experimentation.",
    proof: "Featured education use case",
  },
  2: {
    eyebrow: "National Recognition",
    dek: "A national announcement placing Isaac among the 2024 Truman Scholars recognized for public service leadership.",
    proof: "Forbes feature",
  },
  3: {
    eyebrow: "Product Feedback",
    dek: "Early product feedback work with OpenAI, translating everyday learning workflows into sharper AI product signals.",
    proof: "OpenAI feedback loop",
  },
  4: {
    eyebrow: "Public Service",
    dek: "WashU's announcement of Isaac's Truman Scholarship, awarded for leadership and commitment to public service.",
    proof: "Truman Scholar",
  },
  5: {
    eyebrow: "AI Learning",
    dek: "A ChatGPT Lab contribution documenting how people use AI across learning, work, and creative exploration.",
    proof: "100 Chats Project",
  },
  6: {
    eyebrow: "Global Fellowship",
    dek: "Recognition as a Rhodes Scholarship finalist following civic, research, and communications work.",
    proof: "Rhodes finalist",
  },
  7: {
    eyebrow: "Taiwan Research",
    dek: "A Fulbright award supporting research, teaching, and cross-cultural work in Taiwan.",
    proof: "Fulbright award",
  },
  8: {
    eyebrow: "Study Mode",
    dek: "A public OpenAI spotlight on how Isaac uses ChatGPT Study Mode while working and learning in Taiwan.",
    proof: "ChatGPT spotlight",
  },
  9: {
    eyebrow: "Product Launch",
    dek: "A launch testimonial for ChatGPT Pulse, grounded in travel, planning, and personalized updates.",
    proof: "Launch testimonial",
  },
  10: {
    eyebrow: "Browser Feedback",
    dek: "Early feedback on browser-centered AI workflows and how people move between research, reading, and action.",
    proof: "OpenAI feedback loop",
  },
  11: {
    eyebrow: "Photojournalism",
    dek: "Recognition for newspaper photography through Missouri College Media Awards and Student Life.",
    proof: "Photography award",
  },
  12: {
    eyebrow: "Profile",
    dek: "A university profile on Isaac's research, public service, and long-range ambitions.",
    proof: "University profile",
  },
};

const proofPoints = [
  { stat: "OpenAI", label: "Education features, launch quotes, and product feedback" },
  { stat: "Truman", label: "National public service scholarship recognition" },
  { stat: "Fulbright", label: "Taiwan research and teaching award" },
  { stat: "Forbes", label: "National scholar announcement coverage" },
];

const featuredIds = [1, 2, 7];

const getDetails = (item: NewsItem) =>
  storyDetails[item.id] ?? {
    eyebrow: item.source,
    dek: "A public mention connected to Isaac's research, communications, and civic technology work.",
    proof: item.source,
  };

const isRealLink = (item: NewsItem) => item.href && item.href !== "#";

const MotionLink = ({
  item,
  className,
  children,
}: {
  item: NewsItem;
  className: string;
  children: ReactNode;
}) => {
  const sharedProps = {
    className,
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.55, ease },
  };

  if (!isRealLink(item)) {
    return (
      <motion.div {...sharedProps} aria-label={item.title}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.a {...sharedProps} href={item.href} target="_blank" rel="noopener noreferrer">
      {children}
    </motion.a>
  );
};

const Logo = ({ item, className = "" }: { item: NewsItem; className?: string }) => (
  <img
    src={item.logoUrl}
    alt={item.logoAlt}
    className={`h-6 w-auto max-w-[132px] object-contain ${className}`}
    loading="eager"
    decoding="async"
  />
);

const LeadStory = ({ item }: { item: NewsItem }) => {
  const details = getDetails(item);

  return (
    <MotionLink
      item={item}
      className="news-feature group relative isolate min-h-[560px] overflow-hidden bg-background text-white md:min-h-[660px] lg:col-span-7"
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.025] group-hover:grayscale-0"
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,hsl(var(--image-scrim)/0.96)_0%,hsl(var(--image-scrim)/0.74)_36%,hsl(var(--image-scrim)/0.22)_72%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-5 p-5 md:p-7">
        <span className="rounded-full bg-black/18 px-3 py-2 backdrop-blur-md">
          <Logo item={item} className="h-5 brightness-0 invert" />
        </span>
        <span className="mono-text rounded-full bg-white/12 px-3 py-2 text-white/75 backdrop-blur-md">
          Lead Story
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 pb-24 md:p-7">
        <p className="mono-text mb-4 text-white/68">{details.eyebrow}</p>
        <h3 className="max-w-3xl text-[2.35rem] font-semibold leading-[0.92] tracking-tighter text-white md:text-[4.75rem]">
          {item.title}
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
          {details.dek}
        </p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium tracking-tight text-white/78 transition-colors duration-300 group-hover:text-highlight">
          Read the feature
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
        </span>
      </div>
    </MotionLink>
  );
};

const FeatureCard = ({ item, index }: { item: NewsItem; index: number }) => {
  const details = getDetails(item);

  return (
    <MotionLink
      item={item}
      className="news-feature group relative isolate min-h-[328px] overflow-hidden bg-background text-white md:min-h-0"
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={index === 0 ? "high" : "auto"}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,hsl(var(--image-scrim)/0.95)_0%,hsl(var(--image-scrim)/0.6)_50%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-5">
        <span className="rounded-full bg-black/18 px-3 py-2 backdrop-blur-md">
          <Logo item={item} className="h-4 max-w-[104px] brightness-0 invert" />
        </span>
        <span className="mono-text text-white/58">0{index + 2}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="mono-text mb-3 text-white/58">{details.eyebrow}</p>
        <h3 className="max-w-md text-[1.55rem] font-semibold leading-[0.96] tracking-tighter text-white md:text-[2rem]">
          {item.title}
        </h3>
        <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-white/62">
          {details.dek}
        </p>
      </div>
    </MotionLink>
  );
};

const PressCard = ({ item, index }: { item: NewsItem; index: number }) => {
  const details = getDetails(item);

  return (
    <MotionLink
      item={item}
      className="group flex min-h-[184px] flex-col justify-between overflow-hidden bg-card p-4 ring-1 ring-border/70 transition duration-300 hover:bg-primary hover:text-primary-foreground hover:ring-primary/20 md:p-5"
    >
      <div>
        <div className="mb-7 flex items-start justify-between gap-4">
          <p className="mono-text transition-colors duration-300 group-hover:text-primary-foreground/50">
            {details.eyebrow}
          </p>
          {isRealLink(item) ? (
            <ExternalLink className="h-4 w-4 shrink-0 text-foreground/34 transition-colors duration-300 group-hover:text-highlight" strokeWidth={1.5} />
          ) : null}
        </div>
        <h3 className="text-[1.08rem] font-semibold leading-[1.02] tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary-foreground md:text-[1.22rem]">
          {item.title}
        </h3>
      </div>
      <div className="mt-7 flex items-end justify-between gap-4">
        <span className="text-sm leading-tight text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/62">
          {details.proof}
        </span>
        <span className="mono-text transition-colors duration-300 group-hover:text-highlight">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </MotionLink>
  );
};

const NewsSection = () => {
  const featuredStories = featuredIds
    .map((id) => newsItems.find((item) => item.id === id))
    .filter((item): item is NewsItem => Boolean(item));
  const secondaryStories = featuredStories.slice(1);
  const pressItems = newsItems.filter((item) => !featuredIds.includes(item.id));

  return (
    <section className="py-14 md:py-20">
      <div className="mb-6 flex flex-col gap-5 px-6 md:mb-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading className="mb-0">News</SectionHeading>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-right">
          Public proof from AI, public service, journalism, and university work, organized like a front page instead of a scrapbook.
        </p>
      </div>

      <div className="mx-6 mb-[3px] grid overflow-hidden site-corner bg-border/70 md:grid-cols-4" style={{ gap: 1 }}>
        {proofPoints.map((point, index) => (
          <motion.div
            key={point.stat}
            className="bg-card p-4 md:p-5"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.06, duration: 0.45, ease }}
          >
            <p className="text-2xl font-semibold leading-none tracking-tighter text-foreground md:text-3xl">
              {point.stat}
            </p>
            <p className="mt-3 max-w-[16rem] text-sm leading-snug text-muted-foreground">
              {point.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mx-6 grid overflow-hidden site-corner bg-border/70 lg:grid-cols-12" style={{ gap: 3 }}>
        <LeadStory item={featuredStories[0]} />
        <div className="grid bg-border/70 lg:col-span-5 lg:grid-rows-2" style={{ gap: 3 }}>
          {secondaryStories.map((item, index) => (
            <FeatureCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>

      <div className="mx-6 mt-[3px] grid overflow-hidden site-corner bg-border/70 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1 }}>
        {pressItems.map((item, index) => (
          <PressCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
