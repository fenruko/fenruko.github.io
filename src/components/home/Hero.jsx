import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa6";
import { Terminal } from "lucide-react";
import Button from "../ui/Button";

const BOT_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1329184069426348052&scope=bot+applications.commands";

const blurFadeIn = {
  initial: { opacity: 0, filter: "blur(12px)", y: 16 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#5865f2] shadow-[0_0_8px_2px_rgba(88,101,242,0.5)]" />
        <span className="cmd text-[11px] tracking-wide text-white/60">discord bot · slash commands · dashboard</span>
      </motion.div>

      <motion.h1
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
      >
        <span className="block text-white">75+ modules.</span>
        <span className="block bg-gradient-to-r from-[#8b96ff] via-[#00b8ff] to-[#8b96ff] bg-clip-text text-transparent">
          One bot.
        </span>
      </motion.h1>

      <motion.p
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 max-w-2xl px-2 leading-relaxed text-white/45"
        style={{ fontSize: "clamp(15px, 3vw, 18px)" }}
      >
        Moderation, hi-fi music, economy, tickets, last.fm, and a casino.
        Everything runs as slash commands and is configured from one dashboard.
      </motion.p>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
    </section>
  );
}
