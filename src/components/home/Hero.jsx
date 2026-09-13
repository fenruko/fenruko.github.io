import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FaDiscord, FaCode } from "react-icons/fa6";

const blurFadeIn = {
  initial: { opacity: 0, filter: "blur(12px)", y: 16 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
};

const GRID_SIZE = 32;
const MASK_IMAGE = "radial-gradient(ellipse at center, black 0%, transparent 82%)";

// TODO: replace with Rift's actual bot invite (client ID + desired permissions integer)
const BOT_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1329184069426348052&scope=bot+applications.commands";

export default function Hero() {
  const beams = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => {
      const axis = Math.random() < 0.5 ? "x" : "y";
      const steps = axis === "x" ? 30 : 60;
      const line = Math.floor(Math.random() * steps) * GRID_SIZE;
      const duration = 2.5 + Math.random() * 4;
      const delay = Math.random() * 8;
      return { id: i, axis, line, duration, delay };
    });
  }, []);

  return (
    <section className="relative flex flex-col min-h-screen items-center justify-center text-center px-4 overflow-hidden bg-[#08090c]">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 1px, transparent 1px)",
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          maskImage: MASK_IMAGE,
          WebkitMaskImage: MASK_IMAGE,
        }}
      />

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="relative font-bold leading-[0.90] mb-5 text-4xl md:text-6xl">
          <span className="block text-white">
            One bot, every feature. <br />Built for your whole server.
          </span>
        </h1>
      </motion.div>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="relative max-w-3xl leading-relaxed font-thin mb-8 sm:mb-10 px-2" style={{ fontSize: "clamp(15px, 3.5vw, 20px)", color: "rgba(255,255,255,0.4)" }}>
          Rift is an all-in-one Discord bot with 75+ modules built in — moderation, music, tickets, economy, verification, and an AI assistant, all ready to go from the moment you add it.
        </p>
      </motion.div>

      <motion.div
        initial={blurFadeIn.initial}
        animate={blurFadeIn.animate}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6 sm:px-0">
          <a
            href={BOT_INVITE_URL}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-[#5865f2] hover:bg-[#5865f2]/70 text-white text-[16px] font-medium transition-colors duration-150 w-full sm:w-auto"
          >
            <FaDiscord className="w-5 h-5" />
            Add to Discord
          </a>
          <a
            href="/commands"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-[#0e0e0e] hover:bg-gray-400/70 border border-white/20 text-white text-[16px] font-medium transition-colors duration-150 w-full sm:w-auto"
          >
            <FaCode className="w-5 h-5" />
            See Commands
          </a>
        </div>
      </motion.div>
    </section>
  );
}
