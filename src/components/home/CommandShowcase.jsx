import React from "react";
import { Music2, ShieldCheck, Mic2, Ticket, Coins, Radio } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const RIFT_LOGO = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";

// NOTE: these are stylized mockups, not real screenshots of Rift running in
// Discord (we didn't have any to work from). Swap <MockupFrame> below for
// real <img> screenshots of each command whenever you have them.
function MockupFrame({ icon: Icon, accent, children }) {
  return (
    <div className="w-full rounded-xl border border-white/10 shadow-2xl shadow-black/60 bg-[#0b0c10] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <img src={RIFT_LOGO} alt="Rift" className="w-8 h-8 rounded-full object-cover" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-white">Rift</span>
          <span className="text-[10px] text-white/30">Today</span>
        </div>
        <div
          className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}22`, border: `1px solid ${accent}55` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Bar({ w, opacity = 0.15 }) {
  return <div className={`h-1.5 rounded-full bg-white/[${opacity}]`} style={{ width: w }} />;
}

const ROWS = [
  {
    icon: Music2,
    accent: "#00b8ff",
    title: "Seamless Audio Streaming",
    description:
      "Control playback effortlessly with built-in interactive buttons. Stream high-fidelity music from Spotify, YouTube, and SoundCloud, with lyrics, queues, and volume control baked in.",
    render: (accent) => (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2 w-2/3 bg-white/20 rounded-full" />
            <div className="h-1.5 w-1/3 bg-white/10 rounded-full" />
          </div>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/2 rounded-full" style={{ backgroundColor: accent }} />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/30">
          <span>1:12</span>
          <span>3:04</span>
        </div>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    accent: "#f87171",
    title: "Advanced Server Security",
    description:
      "Keep your server safe and clean with a robust auto-mod engine. Real-time bans, customizable logging filters, and verification checks let your staff focus on what matters.",
    render: () => (
      <div className="space-y-2">
        {["Anti-Spam", "Anti-Raid", "Verification"].map((label) => (
          <div key={label} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.05]">
            <span className="text-xs text-white/60">{label}</span>
            <span className="flex items-center gap-1.5 text-[9px] tracking-wide text-green-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              ON
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Mic2,
    accent: "#a78bfa",
    title: "Automatic Voice Channels",
    description:
      "Give every member their own private voice channel the moment they join. VoiceMaster creates a category and join channel automatically, with a full control panel for members.",
    render: () => (
      <div className="grid grid-cols-3 gap-2">
        {["Lock", "Limit", "Rename"].map((label) => (
          <div key={label} className="flex flex-col items-center justify-center gap-1 bg-white/[0.03] rounded-lg py-3 border border-white/[0.05]">
            <div className="w-5 h-5 rounded-full bg-[#a78bfa]/30 border border-[#a78bfa]/50" />
            <span className="text-[10px] text-white/40">{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Ticket,
    accent: "#00b8ff",
    title: "Effortless Support Tickets",
    description:
      "Give members a direct line to your staff. One-click ticket creation with claim and close controls keeps requests organized, so nothing slips through the cracks.",
    render: () => (
      <div className="space-y-2">
        <div className="flex border-b border-white/[0.06]">
          <div className="px-3 py-1.5 text-[10px] font-mono text-[#00b8ff] border-b-2 border-[#00b8ff]/60">Open</div>
          <div className="px-3 py-1.5 text-[10px] font-mono text-white/30">Closed</div>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2 pt-1">
            <div className="w-6 h-6 rounded-md bg-blue-950/60 border border-[#00b8ff]/20 shrink-0" />
            <div className="flex-1 space-y-1">
              <Bar w="66%" />
              <Bar w="33%" opacity={0.1} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Coins,
    accent: "#fbbf24",
    title: "Built-In Economy System",
    description:
      "Let your community earn, bank, and compete with a fully featured virtual economy. Wallets, daily rewards, a shop, and a leaderboard, all built in and ready to go.",
    render: (accent) => (
      <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3 border border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4" style={{ color: accent }} />
          <span className="text-sm text-white/70 font-mono">12,480</span>
        </div>
        <span className="text-[10px] text-white/30">Rank #4</span>
      </div>
    ),
  },
  {
    icon: Radio,
    accent: "#fb7185",
    title: "Last.fm Integration",
    description:
      "Show off what you're listening to right inside Discord. Real-time scrobble tracking, artist play counts, and total scrobbles keep your music taste on display.",
    render: () => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-white/10" />
        <div className="flex-1 space-y-1.5">
          <Bar w="70%" />
          <Bar w="40%" opacity={0.1} />
        </div>
        <span className="text-[9px] font-mono text-white/30">312 plays</span>
      </div>
    ),
  },
];

export default function CommandShowcase() {
  return (
    <section className="relative bg-[#08090c] py-20 md:py-28 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00b8ff] to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 75%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-white/30" />
            <span className="text-xs tracking-[0.2em] text-white/40 font-semibold uppercase">
              See it in action
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl leading-[1.1]">
            <span className="block font-semibold text-white">Real commands.</span>
            <span className="block font-medium text-white/30">Real results.</span>
          </h2>
        </ScrollReveal>

        <div className="space-y-20 md:space-y-28">
          {ROWS.map((row, i) => {
            const image = (
              <ScrollReveal key="img">
                <MockupFrame icon={row.icon} accent={row.accent}>
                  {row.render(row.accent)}
                </MockupFrame>
              </ScrollReveal>
            );
            const text = (
              <ScrollReveal key="text" delay={0.1}>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
                  {row.title}
                </h3>
                <p className="text-white/50 leading-relaxed text-[15px] max-w-md">
                  {row.description}
                </p>
              </ScrollReveal>
            );

            return (
              <div key={row.title} className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                {i % 2 === 0 ? (
                  <>
                    {image}
                    {text}
                  </>
                ) : (
                  <>
                    <div className="md:order-2">{image}</div>
                    <div className="md:order-1">{text}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
