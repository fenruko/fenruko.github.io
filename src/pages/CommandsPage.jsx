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
    <div className="min-h-screen px-4 pb-24 pt-32">
      <Helmet>
        <title>Commands - Rift</title>
      </Helmet>
      <div className="relative mx-auto max-w-5xl">
        <ScrollReveal className="mb-14 text-center">
          <h1 className="mb-4 text-4xl font-semibold text-white md:text-5xl">Commands</h1>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/40">
            75+ modules, every one a slash command.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((cat, i) => (
            <ScrollReveal
              key={cat.title}
              delay={i * 0.05}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.16]"
            >
              <h2 className="mb-4 text-lg font-semibold text-white">{cat.title}</h2>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[13px] text-white/45">
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
