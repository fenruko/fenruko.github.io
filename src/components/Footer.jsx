import React from "react";
import { Link } from "react-router-dom";
import { FaDiscord } from "react-icons/fa6";

const RIFT_LOGO = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";
// TODO: replace with Rift's actual support-server invite link
const SUPPORT_SERVER_URL = "https://discord.gg/kqTPMyeteG";

export default function Footer() {
  return (
    <footer className="bg-[#08090c] py-14 px-4 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00b8ff] to-transparent" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr,1fr,1fr,1fr] gap-10 mb-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Link to="/" className="flex items-center gap-2">
                <img src={RIFT_LOGO} alt="Rift" className="w-10 h-10 rounded-full object-cover" />
                <span className="text-xl font-bold text-white">Rift</span>
              </Link>
            </div>
            <p className="text-[13px] text-white/30 leading-relaxed max-w-[320px]">
              Rift is an all-in-one Discord bot, built to enhance your server. Manage it through our Dashboard or via commands. Customize it to your needs.
            </p>
          </div>

          <div></div>
          <div></div>

          <div>
            <h5 className="text-[10px] font-semibold tracking-[0.18em] text-white/25 uppercase mb-4">
              Navigation
            </h5>
            <div className="flex flex-col space-y-2 text-[13px] text-white/40">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/commands" className="hover:text-white transition-colors">Commands</Link>
              <a href="https://docs.rift.baby" className="hover:text-white transition-colors">Docs</a>
              <Link to="/team" className="hover:text-white transition-colors">Team</Link>
              <a href="/dashboard.html" className="hover:text-white transition-colors">Dashboard</a>
            </div>
                    </div>

          <div>
            <h5 className="text-[10px] font-semibold tracking-[0.18em] text-white/25 uppercase mb-4">
              Get Support
            </h5>
            <p className="text-[13px] text-white/30 leading-relaxed">
              Join our community for help, feedback, and updates.
            </p>
            <a
              href={SUPPORT_SERVER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] text-white text-[13px] font-medium transition-colors duration-150"
            >
              <FaDiscord className="text-lg" /> Join our Discord
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/40">
            <span>&copy; {new Date().getFullYear()} Rift. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}