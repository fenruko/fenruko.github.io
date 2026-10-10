import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa6";
import { Terminal } from "lucide-react";
import Button from "../ui/Button";

const RIFT_LOGO = "/assets/riftlogo.jpg";
const BOT_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1329184069426348052&scope=bot+applications.commands";

const blurFadeIn = {
  initial: { opacity: 0, filter: "blur(12px)", y: 16 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
};

const ease = [0.22, 1, 0.36, 1];

const STATS = [
  { value: "75+", label: "modules" },
  { value: "Slash", label: "commands only" },
  { value: "Free", label: "on every server" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[94vh] flex-col items-center justify-center px-4 pb-10 pt-28 text-center">
      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        className="glass mb-8 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#9ece6a] shadow-[0_0_10px_#9ece6a]" />
        <span className="cmd text-[11px] tracking-[0.14em] text-white/60">DISCORD BOT</span>
      </motion.div>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.2, ease }}
        className="relative mb-7"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 scale-150 rounded-full bg-[#7aa2f7]/20 blur-3xl" />
        <img
          src={RIFT_LOGO}
          alt="Rift logo"
          className="h-24 w-24 rounded-[28px] object-cover ring-1 ring-white/20 md:h-28 md:w-28"
        />
      </motion.div>

      <motion.h1
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.3, ease }}
        className="mb-6 max-w-3xl text-5xl font-semibold leading-[1.05] text-white md:text-7xl"
      >
        Rift,{" "}
        <span className="bg-gradient-to-b from-white to-[#7aa2f7]/70 bg-clip-text text-transparent">
          the all-in-one
        </span>{" "}
        Discord bot.
      </motion.h1>

      <motion.p
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.42, ease }}
        className="mb-10 max-w-2xl px-2 leading-relaxed text-white/50"
        style={{ fontSize: "clamp(15px, 3vw, 18px)" }}
      >
        Moderation, hi-fi music, economy, tickets, last.fm, and a casino.
        Everything runs as slash commands and is configured from one dashboard.
      </motion.p>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.55, ease }}
        className="flex w-full flex-col items-center gap-3 px-6 sm:w-auto sm:flex-row sm:px-0"
      >
        <Button href={BOT_INVITE_URL} external size="lg" className="w-full sm:w-auto">
          <FaDiscord className="h-4 w-4" />
          Add to Discord
        </Button>
        <Button to="/commands" variant="secondary" size="lg" className="w-full sm:w-auto">
          <Terminal className="h-4 w-4" />
          See Commands
        </Button>
      </motion.div>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.7, ease }}
        className="glass mt-16 grid w-full max-w-2xl grid-cols-3 divide-x divide-white/[0.07] rounded-2xl"
      >
        {STATS.map((s) => (
          <div key={s.label} className="px-3 py-5">
            <div className="font-heading text-2xl font-semibold text-white md:text-3xl">{s.value}</div>
            <div className="cmd mt-1 text-[10.5px] uppercase tracking-[0.14em] text-white/35">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
