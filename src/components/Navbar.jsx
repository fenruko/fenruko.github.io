import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaDiscord } from "react-icons/fa6";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";

const RIFT_LOGO = "/assets/riftlogo.jpg";
const BOT_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1329184069426348052&scope=bot+applications.commands";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/commands", label: "Commands" },
  { href: "https://docs.rift.cool", label: "Docs" },
  { href: "/team", label: "Team" },
];

// Slim full-width bar. The active tab gets a seam of light underneath.
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const Tab = ({ link }) => {
    const active = !link.href.startsWith("http") && location.pathname === link.href;
    const cls = `relative px-4 py-5 text-[13.5px] tracking-wide transition-colors duration-200 ${
      active ? "text-white" : "text-white/50 hover:text-white"
    }`;
    const seam = (
      <span
        aria-hidden="true"
        className={`absolute inset-x-3 bottom-3 h-px origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,0.8,0.32,1)] ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
        style={{ background: "var(--seam)", boxShadow: "0 0 10px rgba(138,125,255,0.8)" }}
      />
    );
    return link.href.startsWith("http") ? (
      <a href={link.href} className={cls}>
        {link.label}
        {seam}
      </a>
    ) : (
      <Link to={link.href} className={cls}>
        {link.label}
        {seam}
      </Link>
    );
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled ? "border-b border-white/[0.07] bg-[#06070b]/75 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Rift home" className="group flex items-center gap-2.5">
            <img
              src={RIFT_LOGO}
              className="logo-oct h-9 w-9 object-cover transition-transform duration-500 group-hover:rotate-[22deg]"
              alt="Rift"
            />
            <span className="font-heading text-lg font-semibold lowercase tracking-tight text-white">rift</span>
          </Link>

          <div className="hidden items-center md:flex">
            {NAV_LINKS.map((link) => (
              <Tab key={link.label} link={link} />
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Button href="https://dash.rift.cool" external variant="secondary" size="sm" className="hidden md:inline-flex">
              Dashboard
            </Button>
            <Button href={BOT_INVITE_URL} external size="sm" className="hidden md:inline-flex">
              <FaDiscord className="h-4 w-4" />
              Add to Discord
            </Button>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-white/70 transition-colors hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#06070b]/95 backdrop-blur-2xl md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-6">
            <img src={RIFT_LOGO} className="logo-oct h-9 w-9 object-cover" alt="Rift" />
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 transition-colors hover:text-white" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1 pt-3">
              {[...NAV_LINKS, { href: "https://dash.rift.cool", label: "Dashboard" }].map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 border-b border-white/[0.05] px-2 py-4 font-heading text-xl text-white/70 transition-colors hover:text-white"
                >
                  <span className="cmd text-[11px] text-[#8a7dff]">{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.06] p-4">
            <Button href={BOT_INVITE_URL} external className="w-full">
              <FaDiscord className="h-4 w-4" />
              Add to Discord
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
