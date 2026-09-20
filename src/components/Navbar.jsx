import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaDiscord } from "react-icons/fa6";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";

const RIFT_LOGO = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";
const BOT_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1329184069426348052&scope=bot+applications.commands";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/commands", label: "Commands" },
  { href: "https://docs.rift.cool", label: "Docs" },
  { href: "/team", label: "Team" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? "px-3 pt-3 sm:px-4 sm:pt-4" : "px-0 pt-0"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled
              ? "h-14 rounded-2xl border border-white/10 bg-[#0a0c12]/80 backdrop-blur-xl"
              : "h-[60px] rounded-none border border-transparent bg-transparent"
          }`}
        >
          <div className="hidden items-center gap-7 md:flex">
            <Link to="/" aria-label="Rift home" className="transition-transform duration-200 hover:scale-105">
              <img src={RIFT_LOGO} className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" alt="Rift" />
            </Link>
            {NAV_LINKS.map((link) =>
              link.href.startsWith("http") ? (
                <a key={link.label} href={link.href} className="text-sm text-white/50 transition-colors hover:text-white">
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm transition-colors ${
                    location.pathname === link.href ? "text-white" : "text-white/50 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/" className="md:hidden" aria-label="Rift home">
              <img src={RIFT_LOGO} className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" alt="Rift" />
            </Link>
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
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0c12]/95 backdrop-blur-xl md:hidden">
          <div className="flex h-[60px] items-center justify-between border-b border-white/[0.06] px-6">
            <img src={RIFT_LOGO} className="h-9 w-9 rounded-full object-cover" alt="Rift" />
            <button onClick={() => setIsOpen(false)} className="p-2 text-white/50 transition-colors hover:text-white" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1 pt-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://dash.rift.cool"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                Dashboard
              </a>
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
