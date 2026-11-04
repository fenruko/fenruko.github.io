const FAQ_ITEMS = [
  {
    question: "Is Rift free?",
    answer: "Yes. Every module: moderation, music, tickets, leveling, casino, etc. is free on every server.",
  },
  {
    question: "What permissions does it need?",
    answer:
      "Permissions were selected to fit what the bot exactly needs, by default it doesn't have admin perms on, however it is recommended to enable admin perms after trusting the bot.",
  },
  {
    question: "Are all commands slash commands?",
    answer: "around 90% or more of the bots commands are both slash and prefix, because of the big amount of the commands the bot has it is simply not possible to make every single command slash",
  },
  {
    question: "How do I add it to my server?",
    answer:
      "Click Add to Discord, pick a server, accept the permissions. Defaults work out of the box.",
  },
  {
    question: "What happens to my server's data?",
    answer:
      "Only what enabled features need is stored. kicking the bot removes all data from our database ( we are not like Double Counter :D )",
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
