import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa6";
import { Terminal } from "lucide-react";
import Button from "../ui/Button";

const RIFT_LOGO = "https://i.postimg.cc/qR4jqJdK/cropped_circle_image.png";
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
        className="relative mb-6"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 scale-150 rounded-full bg-[#5865f2]/25 blur-3xl"
        />
        <img
          src={RIFT_LOGO}
          alt="Rift logo"
          className="h-28 w-28 rounded-full object-cover ring-2 ring-white/15 md:h-36 md:w-36"
        />
      </motion.div>

      <motion.h1
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 font-marker text-6xl tracking-wide text-white md:text-8xl"
      >
        RIFT
      </motion.h1>

      <motion.p
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 max-w-2xl px-2 leading-relaxed text-white/45"
        style={{ fontSize: "clamp(15px, 3vw, 18px)" }}
      >
        Moderation, hi-fi music, economy, tickets, last.fm, and a casino.
        Everything runs as slash commands and is configured from one dashboard.
      </motion.p>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
