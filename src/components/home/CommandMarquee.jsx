
const COMMAND_ROWS = [
  {
    duration: "26s",
    reverse: false,
    commands: ["/ban", "/kick", "/timeout", "/warn", "/warnings", "/clear", "/lock", "/unlock", "/mute", "/automod", "/verify", "/case", "/modlog"],
  },
  {
    duration: "31s",
    reverse: true,
    commands: ["/play", "/skip", "/queue", "/pause", "/resume", "/lyrics", "/ticket open", "/ticket close", "/voice lock", "/voice limit", "/fm", "/stock"],
  },
  {
    duration: "36s",
    reverse: false,
    commands: ["/help", "/rank", "/leaderboard", "/balance", "/daily", "/giveaway", "/poll", "/remind", "/birthday", "/welcome", "/ai ask", "/tag"],
  },
];

function CommandPill({ children }) {
  return (
    <span className="cmd whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[13px] text-white/45">
      {children}
    </span>
  );
}

function MarqueeRow({ commands, duration, reverse }) {
  return (
    <div className="flex gap-4 overflow-hidden p-2" style={{ "--duration": duration }}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={
            "flex shrink-0 flex-row justify-around gap-4 animate-marquee" +
            (reverse ? " [animation-direction:reverse]" : "")
          }
        >
          {commands.map((cmd) => (
            <CommandPill key={cmd}>{cmd}</CommandPill>
          ))}
        </div>
      ))}
    </div>
  );
}

// Three scrolling strips of real Rift commands, straight under the hero.
export default function CommandMarquee() {
  return (
    <div
      aria-hidden="true"
      className="relative border-y border-white/[0.06] bg-white/[0.015] py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      {COMMAND_ROWS.map((row, i) => (
        <MarqueeRow key={i} {...row} />
      ))}
    </div>
  );
}
