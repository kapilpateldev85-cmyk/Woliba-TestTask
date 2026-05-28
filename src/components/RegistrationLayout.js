import backgroundArt from "../assests/Background.png";
import logo from "../assests/woliba Logo.png";
import LanguageSelector from "./LanguageSelector";

function RegistrationLayout({ children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-woliba-navy">
      <img
        src={backgroundArt}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90"
      />

      <header className="relative z-10 flex items-start justify-between px-8 pt-8 sm:px-12">
        <img src={logo} alt="Woliba" className="h-12 w-auto object-contain" />
        <LanguageSelector />
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-150px)] items-center justify-center px-5 py-8">
        {children}
      </section>

      <footer className="relative z-10 flex justify-center gap-5 pb-7 text-xs text-woliba-coral">
        <a href="/terms" className="hover:underline">
          Terms of Use
        </a>
        <a href="/contact" className="hover:underline">
          Contact Us
        </a>
      </footer>
    </main>
  );
}

export default RegistrationLayout;
