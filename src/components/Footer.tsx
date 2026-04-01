const Footer = () => {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="mono-text mb-2">Expertise</p>
          <p className="text-foreground text-sm leading-relaxed">
            Brand Identity / Web Design / Photography / Art Direction
          </p>
        </div>
        <div>
          <p className="mono-text mb-2">Contact</p>
          <p className="text-foreground text-sm">hello@studio.com</p>
        </div>
        <div>
          <p className="mono-text mb-2">Social</p>
          <div className="flex gap-6 text-foreground text-sm">
            <a href="#" className="hover:text-muted-foreground transition-colors duration-200">Instagram</a>
            <a href="#" className="hover:text-muted-foreground transition-colors duration-200">Behance</a>
            <a href="#" className="hover:text-muted-foreground transition-colors duration-200">Twitter</a>
          </div>
        </div>
      </div>
      <p className="mono-text mt-10">© 2026</p>
    </footer>
  );
};

export default Footer;
