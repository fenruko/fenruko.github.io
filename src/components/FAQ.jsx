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

// Native <details>: no state, no JS, keyboard and screen reader friendly.
export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="wrap narrow">
        <h2 className="h2">Questions</h2>
        <div className="glass faq">
          {FAQ_ITEMS.map((item, i) => (
            <details key={item.question} open={i === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
