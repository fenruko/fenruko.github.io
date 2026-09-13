import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const FAQ_ITEMS = [
  {
    question: "Is Rift free to use?",
    answer:
      "Yes. Every core feature, moderation, music, tickets, leveling, and more, is free on every server.",
  },
  {
    question: "What permissions does Rift need?",
    answer:
      "During setup you'll be prompted to grant the permissions each feature needs, things like managing roles for moderation or connecting to voice channels for music. Rift only requests what's required to run the features you actually use.",
  },
  {
    question: "Does Rift support slash commands?",
    answer:
      "Yes. Every command is available as a slash command, so they're easy to discover and use directly inside Discord.",
  },
  {
    question: "How do I add Rift to my server?",
    answer:
      "Click \"Add to Discord\", choose your server, and accept the requested permissions. Setup takes under a minute and most features work immediately with sensible defaults, no configuration required to get started.",
  },
  {
    question: "Is my server's data kept private?",
    answer:
      "Yes. We only store what's needed to power your enabled features, message content is never logged or read by staff, and you can wipe your server's data at any time by removing the bot.",
  },
  {
    question: "What if I need help?",
    answer:
      "Join our support Discord and our team will get back to you. Real people, real answers, no ticket queues or canned responses.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-[#08090c] relative py-24 px-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00b8ff] to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        <ScrollReveal className="mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white leading-snug">
            Everything You Need to Know.
          </h2>
        </ScrollReveal>

        <ScrollReveal
          delay={0.1}
          className="space-y-0 rounded-xl border border-white/[0.07] overflow-hidden"
        >
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`${i > 0 ? "border-t border-white/[0.06]" : ""}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors group"
              >
                <span className="text-[12px] font-mono text-white/20 w-5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[14px] text-white/70 group-hover:text-white/85 transition-colors font-medium">
                  {item.question}
                </span>
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03]">
                  {openIndex === i ? (
                    <Minus className="w-3 h-3 text-white/40" />
                  ) : (
                    <Plus className="w-3 h-3 text-white/30" />
                  )}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === i ? "max-h-48" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-4 pl-[52px] text-[13px] text-white/40 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00b8ff] to-transparent" />
    </section>
  );
}
