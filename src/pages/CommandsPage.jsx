import useTitle from "../useTitle";

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
  useTitle("Commands - Rift");

  return (
    <section className="page">
      <div className="wrap">
        <h1 className="h1 h1-page">Commands</h1>
        <p className="lead">75+ modules, every one a slash command.</p>

        <div className="grid grid-2">
          {CATEGORIES.map((cat) => (
            <section key={cat.title} className="glass card">
              <h2 className="h3">{cat.title}</h2>
              <ul className="chips">
                {cat.items.map((item) => (
                  <li key={item} className="chip">{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
