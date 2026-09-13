"use client";

import { Music2, ShieldCheck, TicketIcon } from "lucide-react";
import React from "react";
import { FaCode } from "react-icons/fa6";
import ScrollReveal from "../ScrollReveal";

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
    <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/[.04] px-4 py-1.5 text-sm text-gray-400">
      {children}
    </span>
  );
}

function MarqueeRow({ commands, duration, reverse }) {
  return (
    <div className="flex overflow-hidden p-2 gap-4" style={{ "--duration": duration }}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className={
            "flex shrink-0 justify-around gap-4 animate-marquee flex-row group-hover:[animation-play-state:paused]" +
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

const CARD_BASE_NO_OVERFLOW =
  "feat-card group relative bg-white/[0.02] rounded-2xl border border-white/[0.06] " +
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_0_0_40px_-18px_rgba(100,116,139,0.25)] " +
  "hover:border-[#64748b]/50 " +
  "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),inset_0_0_50px_-12px_rgba(100,116,139,0.65)] " +
  "transition-all duration-300";

const CARD_BASE = CARD_BASE_NO_OVERFLOW + " overflow-hidden";

const CARD = CARD_BASE + " p-6";

function CardGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full bg-[#64748b]/25 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#64748b] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="feature-section relative bg-[#08090c] py-16 md:py-24 border-t border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00b8ff] to-transparent"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Everything Your Server Needs
          </h2>
          <p className="text-white/40 text-[15px] max-w-xl mx-auto leading-relaxed">
            Rift brings moderation, music, tickets, and dozens of other tools together in one fast, reliable bot.
          </p>
        </div>

        <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <ScrollReveal className={CARD}>
            <CardGlow />
            <h3 className="text-xl text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="text-[#00b8ff] w-5 h-5" />
              Advanced Moderation
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Automatic spam, raid, and verification filtering keeps your server clean without lifting a finger.
            </p>
            <div className="space-y-2 mt-4">
              {["Anti-Spam", "Anti-Raid", "Auto-Mod Filters"].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between bg-[#08090c] rounded-lg px-3 py-2 border border-white/[0.04]"
                >
                  <span className="text-sm text-gray-300">{label}</span>
                  <span className="flex items-center gap-1.5 text-[10px] tracking-wide text-green-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.5)]" />
                    ON
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className={CARD} delay={0.1}>
            <CardGlow />
            <h3 className="text-xl text-white mb-3 flex items-center gap-2">
              <Music2 className="text-[#00b8ff] w-5 h-5" />
              24/7 Music
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              High-quality, uninterrupted music streaming from Spotify, YouTube, and SoundCloud.
            </p>
            <div className="bg-[#08090c] rounded-xl p-3 mt-4 border border-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00b8ff]/15 border border-[#00b8ff]/30 flex items-center justify-center shrink-0">
                  <Music2 className="text-[#00b8ff] w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-1.5 w-3/4 bg-white/15 rounded-full" />
                  <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-[#00b8ff] rounded-full" />
              </div>
              <div className="flex justify-between mt-1.5 text-[9px] font-mono text-gray-500">
                <span>1:42</span>
                <span>2:31</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className={CARD_BASE_NO_OVERFLOW + " p-6"} delay={0.2}>
            <CardGlow />
            <h3 className="text-xl text-white mb-3 flex items-center gap-2">
              <TicketIcon className="text-[#00b8ff] w-5 h-5" />
              Ticket System
            </h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Give members a direct line to your staff with a fully managed, one-click ticket panel.
            </p>
            <div className="bg-[#08090c] rounded-xl overflow-hidden mt-4 border border-white/[0.04]">
              <div className="flex border-b border-white/[0.06] bg-white/[0.02]">
                <div className="px-4 py-2 text-xs font-mono text-[#00b8ff] border-b-2 border-[#00b8ff]/60">
                  Open
                </div>
                <div className="px-4 py-2 text-xs font-mono text-gray-500">
                  Closed
                </div>
              </div>
              <div className="p-3 space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-950/60 border border-[#00b8ff]/20 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 w-2/3 bg-white/15 rounded-full" />
                      <div className="h-1.5 w-1/3 bg-white/10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal
          delay={0.1}
          className={CARD_BASE + " mt-8 flex h-[380px] flex-col justify-between backdrop-blur-xl"}
        >
          <CardGlow />

          <div>
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-4 [mask-image:linear-gradient(to_bottom,black_65%,transparent)]"
            >
              {COMMAND_ROWS.map((row, i) => (
                <MarqueeRow key={i} {...row} />
              ))}
            </div>
          </div>

          <div className="relative z-10 p-6">
            <div className="pointer-events-none flex flex-col gap-1.5 transition-all duration-300">
              <h3 className="text-xl text-white mb-3 flex items-center gap-2">
                <FaCode className="text-[#00b8ff] w-5 h-5" />
                75+ Modules, One Bot
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4 max-w-lg">
                From moderation to music to an AI assistant, Rift ships with a hefty list of commands, yet every one is designed to be simple to use, no matter how much power sits behind it.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
