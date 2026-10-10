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

// Floating glass pill, centered, that stays put while scrolling.
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

  const linkClass = (active) =>
    `rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors duration-200 ${
      active ? "bg-white/[0.09] text-white" : "text-white/55 hover:bg-white/[0.05] hover:text-white"
    }`;

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <div
          className={`glass mx-auto flex h-14 max-w-[740px] items-center justify-between rounded-full pl-2.5 pr-2 transition-all duration-500 ease-[cubic-bezier(0.22,0.8,0.32,1)] ${
            isScrolled ? "bg-[#0a0c12]/70" : ""
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Link to="/" aria-label="Rift home" className="mr-1.5 transition-transform duration-200 hover:scale-105">
              <img src={RIFT_LOGO} className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" alt="Rift" />
            </Link>
            <div className="hidden items-center gap-0.5 md:flex">
              {NAV_LINKS.map((link) =>
                link.href.startsWith("http") ? (
                  <a key={link.label} href={link.href} className={linkClass(false)}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} to={link.href} className={linkClass(location.pathname === link.href)}>
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button href="https://dash.rift.cool" external variant="secondary" size="sm" className="hidden md:inline-flex">
              Dashboard
            </Button>
            <Button href={BOT_INVITE_URL} external size="sm" className="hidden md:inline-flex">
              <FaDiscord className="h-4 w-4" />
              Add to Discord
            </Button>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2.5 text-white/70 transition-colors hover:text-white md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#07080c]/92 backdrop-blur-2xl md:hidden">
          <div className="flex h-[68px] items-center justify-between border-b border-white/[0.06] px-6">
            <img src={RIFT_LOGO} className="h-9 w-9 rounded-full object-cover" alt="Rift" />
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 transition-colors hover:text-white" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1 pt-3">
              {[...NAV_LINKS, { href: "https://dash.rift.cool", label: "Dashboard" }].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-4 py-3 text-[15px] text-white/65 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
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
