import { useEffect, useState } from "react";
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

const READOUT = ["75+ modules", "slash commands only", "free on every server"];

// "RIFT", cut along a diagonal. The halves drift apart once the page has
// settled, and drift further when you hover the word.
function Wordmark() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <h1 className={`rift-word${open ? " open" : ""}`} aria-label="Rift">
      <span className="rw-base" aria-hidden="true">RIFT</span>
      <span className="rw-top" aria-hidden="true">RIFT</span>
      <span className="rw-bot" aria-hidden="true">RIFT</span>
      <svg className="rw-seam" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="seamGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8a7dff" stopOpacity="0" />
            <stop offset="0.3" stopColor="#8a7dff" />
            <stop offset="0.7" stopColor="#35e0ff" />
            <stop offset="1" stopColor="#35e0ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1="-5"
          y1="58"
          x2="105"
          y2="40"
          stroke="url(#seamGrad)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </h1>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[94vh] flex-col items-center justify-center px-4 pb-10 pt-28 text-center">
      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.1, ease }}
        className="relative mb-4"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 scale-[1.9] rounded-full bg-[#8a7dff]/25 blur-3xl" />
        <img
          src={RIFT_LOGO}
          alt="Rift logo"
          className="logo-oct h-20 w-20 object-cover md:h-24 md:w-24"
        />
      </motion.div>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.9, delay: 0.25, ease }}
        className="mb-8"
      >
        <Wordmark />
      </motion.div>

      <motion.p
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.45, ease }}
        className="mb-10 max-w-2xl px-2 leading-relaxed text-white/50"
        style={{ fontSize: "clamp(15px, 3vw, 18px)" }}
      >
        Moderation, hi-fi music, economy, tickets, last.fm, and a casino.
        Everything runs as slash commands and is configured from one dashboard.
      </motion.p>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.58, ease }}
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

      <motion.ul
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.75, ease }}
        className="cmd mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-white/40"
      >
        {READOUT.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="text-[#35e0ff]">&gt;</span>
            {item}
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
