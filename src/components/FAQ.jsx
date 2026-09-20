import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const FAQ_ITEMS = [
  {
    question: "Is Rift free?",
    answer: "Yes. Every module — moderation, music, tickets, leveling, casino — is free on every server.",
  },
  {
    question: "What permissions does it need?",
    answer:
      "Only what each enabled feature requires: managing roles for moderation, connecting to voice for music, and so on. Unused features request nothing.",
  },
  {
    question: "Are all commands slash commands?",
    answer: "Yes. The full command list works as slash commands inside Discord.",
  },
  {
    question: "How do I add it to my server?",
    answer:
      "Click Add to Discord, pick a server, accept the permissions. Defaults work out of the box; finer config lives in the dashboard.",
  },
  {
    question: "What happens to my server's data?",
    answer:
      "Only what enabled features need is stored. Message content is not logged. Removing the bot wipes your server's data.",
  },
  {
    question: "Where do I get help?",
    answer: "The support Discord. The team answers there directly.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative px-4 py-24">
      <div className="relative mx-auto max-w-3xl">
        <ScrollReveal className="mb-10">
          <h2 className="text-3xl font-semibold leading-snug text-white md:text-4xl">Questions.</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="space-y-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={i > 0 ? "border-t border-white/[0.06]" : ""}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="group flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="cmd w-5 flex-shrink-0 text-[12px] text-white/25">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[14px] font-medium text-white/70 transition-colors group-hover:text-white/90">
                  {item.question}
                </span>
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03]">
                  {openIndex === i ? <Minus className="h-3 w-3 text-white/40" /> : <Plus className="h-3 w-3 text-white/30" />}
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${openIndex === i ? "max-h-48" : "max-h-0"}`}>
                <div className="px-6 pb-4 pl-[52px] text-[13px] leading-relaxed text-white/40">{item.answer}</div>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
