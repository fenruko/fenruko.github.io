import React from "react";
import { Helmet } from "react-helmet";
import ScrollReveal from "../components/ScrollReveal";

const CATEGORIES = [
  {
    title: "Moderation & Security",
    items: ["Moderation", "Auto-Mod", "Verification", "Logging", "Reports", "VirusTotal", "Command Disable"],
  },
  {
    title: "Music & Audio",
    items: ["Music", "Audio Effects", "Last.fm", "Soundboard", "Text-to-Speech", "Recording"],
  },
  {
    title: "Server Tools",
    items: ["Tickets", "Modmail", "Giveaways", "Polls", "Reaction Roles", "Welcome", "Sticky Messages", "Autoresponder", "Threads", "Counter Channels", "Counting", "Starboard", "Confessions", "Bump Reminder", "Vanity URL"],
  },
  {
    title: "Economy & Leveling",
    items: ["Economy", "Leveling", "Shop", "Gambling", "Poker", "Crowns", "Marriage", "Birthdays", "Shipping", "Booster Roles"],
  },
  {
    title: "Voice",
    items: ["VoiceMaster", "Voice XP", "Voice Calls"],
  },
  {
    title: "Utility",
    items: ["Tags", "Aliases", "Quotes", "Reminders", "Search", "Urban Dictionary", "Charts", "Server Stats", "Invites", "Profile", "Highlight", "AFK", "Help", "Settings", "Setup Wizard"],
  },
  {
    title: "Fun & Social",
    items: ["Fun", "Socials", "Instagram", "Media", "Image Generation", "Collage", "Say", "Fortnite Stats", "Rainbow Six Stats", "Voting"],
  },
  {
    title: "AI & Data",
    items: ["AI Assistant", "Stock Lookup"],
  },
];

export default function CommandsPage() {
  return (
    <div className="min-h-screen bg-[#08090c] pt-32 pb-24 px-4">
      <Helmet>
        <title>Commands - Rift</title>
      </Helmet>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 0%, transparent 75%)",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">Commands</h1>
          <p className="text-white/40 text-[15px] max-w-xl mx-auto leading-relaxed">
            75+ modules covering everything from moderation to music. Every command works as a slash command.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat, i) => (
            <ScrollReveal
              key={cat.title}
              delay={i * 0.05}
              className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">{cat.title}</h2>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-[13px] text-gray-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
