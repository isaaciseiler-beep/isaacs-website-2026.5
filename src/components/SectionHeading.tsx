import AnimatedText from "@/components/AnimatedText";

interface SectionHeadingProps {
  children: string;
  className?: string;
}

const SectionHeading = ({ children, className = "" }: SectionHeadingProps) => {
  return (
    <AnimatedText text={children} as="p" className={`section-heading overflow-visible ${className}`} />
  );
};

export default SectionHeading;
