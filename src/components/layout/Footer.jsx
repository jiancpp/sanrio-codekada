import logo from '../../assets/logo-olive-light.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-midnight py-12 px-6 border-t border-white/5">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="TalaCare Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-110"
          />
          <span className="text-egg font-display font-black text-2xl">TalaCare</span>
          <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
        </div>

        {/* Copyright */}
        <div className="text-sage/60 text-[10px] font-medium tracking-wider uppercase">
          © {currentYear} TalaCare. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;