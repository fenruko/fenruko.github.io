import ScrollReveal from "../ScrollReveal";

// The three real screenshots, in the order they were provided.
// Each image fades in (rise + defocus -> focus) as it scrolls into view.
const ROWS = [
  {
    img: "/screenshots/fmnow.png",
    alt: "Rift answering /fm now with a last.fm embed: track, artist, album art and total scrobbles",
    cmd: "/fm now",
    title: "last.fm",
    body:
      "A full suite of last.fm commands — now-playing cards, graphs, recommendations, and friendship matching by taste. Link your account with /fm login.",
  },
  {
    img: "/screenshots/musicplay.png",
    alt: "Rift music player embed for /music play with previous, pause, skip, stop, loop, shuffle, volume and lyrics buttons",
    cmd: "/music play",
    title: "Music",
    body:
      "A radio system that surfaces top tracks globally, lightning-fast lyrics, 24/7 playback, and unlimited playlists — imported with plain links from Spotify, YouTube, or anywhere else.",
  },
  {
    img: "/screenshots/gambling.png",
    alt: "Rift blackjack game embed: dealer showing 7, player hand of 20, bet of $50,000, hit/stand/double down/split/surrender buttons",
    cmd: "/game blackjack",
    title: "Casino",
    body: "A virtual gambling system: blackjack, crash, horse racing, and slots.",
  },
];

function Screenshot({ img, alt }) {
  return (
    <div className="group relative">
      <div
        aria-hidden="true"
        className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-[#5865f2]/25 via-transparent to-[#00b8ff]/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100"
      />
      <img
        src={img}
        alt={alt}
        loading="lazy"
        className="w-full rounded-xl border border-white/10 bg-[#0b0d13] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
      />
    </div>
  );
}

export default function Showcase() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-16 md:mb-24">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-white/25" />
            <span className="cmd text-xs tracking-[0.2em] text-white/40">in action</span>
          </div>
          <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Screenshots from a live server.
          </h2>
        </ScrollReveal>

        <div className="space-y-24 md:space-y-32">
          {ROWS.map((row, i) => (
            <div key={row.cmd} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <ScrollReveal y={48} blur={12} scale={0.96} duration={0.9} className={i % 2 === 1 ? "md:order-2" : ""}>
                <Screenshot img={row.img} alt={row.alt} />
              </ScrollReveal>

              <ScrollReveal delay={0.15} className={i % 2 === 1 ? "md:order-1" : ""}>
                <span className="cmd inline-block rounded-md border border-[#5865f2]/30 bg-[#5865f2]/10 px-2.5 py-1 text-[12px] text-[#9aa4ff]">
                  {row.cmd}
                </span>
                <h3 className="mb-4 mt-4 text-2xl font-semibold text-white sm:text-3xl">{row.title}</h3>
                <p className="max-w-md leading-relaxed text-white/50">{row.body}</p>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
