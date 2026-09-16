import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaDiscord } from "react-icons/fa6";
import { Menu, X } from "lucide-react";

const RIFT_LOGO = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";
// TODO: replace with Rift's actual bot invite (client ID + desired permissions integer)
const BOT_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1329184069426348052&scope=bot+applications.commands";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/commands", label: "Commands" },
  { href: "https://docs.rift.baby", label: "Docs" },
  { href: "/team", label: "Team" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled ? "px-3 sm:px-4 pt-3 sm:pt-4" : "px-0 pt-0"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled
              ? "max-w-7xl rounded-2xl border border-white/15 bg-[#0d0d0d] backdrop-blur-xl px-6 h-[56px]"
              : "max-w-7xl rounded-none border border-transparent bg-transparent px-6 h-[60px]"
          }`}
        >
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex text-blue-500 items-center group">
              <img src={RIFT_LOGO} className="w-10 h-10 rounded-full mr-1 object-cover" alt="Rift" />
            </Link>
            {NAV_LINKS.map((link) =>
              link.href.startsWith("http") ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex text-gray-200 text-sm font-thin mr-2 items-center group"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex text-gray-200 text-sm font-thin mr-2 items-center group"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <img src={RIFT_LOGO} className="md:hidden w-10 h-10 rounded-full object-cover" alt="Rift" />
            <a
              href="https://dash.rift.baby"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0e0e0e] hover:bg-white/10 border border-white/20 text-white text-[13px] font-medium transition-colors duration-150"
            >
              Dashboard
            </a>
            <a
              href={BOT_INVITE_URL}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#5865f2] hover:bg-[#5865f2]/70 text-white text-[13px] font-medium transition-colors duration-150"
            >
              <FaDiscord className="w-5 h-5" />
              Add to Discord
            </a>
            <button
              onClick={() => setIsOpen(true)}
              className="absolute right-5 md:hidden p-2 -ml-2 text-white/70 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden bg-[#0d0d0d]/95 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between px-6 h-[60px] border-b border-white/[0.06]">
            <img src={RIFT_LOGO} className="w-10 h-10 rounded-full object-cover" alt="Rift" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="pt-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.05]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://dash.rift.baby"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.05]"
              >
                Dashboard
              </a>
            </div>
          </div>

          <div className="p-4 border-t border-white/[0.06]">
            <a
              href={BOT_INVITE_URL}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#5865f2] hover:bg-[#5865f2]/70 text-white font-medium transition-colors"
            >
              <FaDiscord className="w-5 h-5" />
              Add to Discord
            </a>
          </div>
        </div>
      )}
    </>
  );
}