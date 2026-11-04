import { Link } from "react-router-dom";
import FAQ from "../components/FAQ";
import useTitle from "../useTitle";
import { BOT_INVITE_URL, LOGO_LARGE } from "../links";

const FEATURES = [
  { title: "Moderation", body: "Bans, timeouts, warnings, case history, auto-mod, verification, and mod logs." },
  { title: "Music", body: "Playback from Spotify, YouTube and plain links, queues, lyrics, audio effects, and playlists." },
  { title: "last.fm", body: "Now-playing cards, charts, recommendations, and taste matching between members." },
  { title: "Economy and casino", body: "Balances, a shop, daily rewards, blackjack, crash, horse racing, and slots." },
  { title: "Tickets", body: "Ticket panels, modmail, transcripts, and staff claim flow." },
  { title: "Voice", body: "VoiceMaster private channels, voice XP, and voice calls between servers." },
];

const SHOTS = [
  {
    img: "/screenshots/fmnow.webp",
    w: 533,
    h: 363,
    alt: "Rift answering /fm now with a last.fm embed: track, artist, album art and total scrobbles",
    cmd: "/fm now",
    title: "last.fm",
    body: "A full suite of last.fm commands: now-playing cards, graphs, recommendations, and friendship matching by taste. Link your account with /fm login.",
  },
  {
    img: "/screenshots/musicplay.webp",
    w: 721,
    h: 539,
    alt: "Rift music player embed for /music play with previous, pause, skip, stop, loop, shuffle, volume and lyrics buttons",
    cmd: "/music play",
    title: "Music",
    body: "Top tracks surfaced globally, fast lyrics, 24/7 playback, and unlimited playlists imported from Spotify, YouTube, or any other link.",
  },
  {
    img: "/screenshots/gambling.webp",
    w: 573,
    h: 365,
    alt: "Rift blackjack game embed: dealer showing 7, player hand of 20, bet of $50,000, hit/stand/double down/split/surrender buttons",
    cmd: "/game blackjack",
    title: "Casino",
    body: "A virtual gambling system with blackjack, crash, horse racing, and slots.",
  },
];

export default function HomePage() {
  useTitle("Rift");

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1 className="h1">Rift</h1>
            <p className="lead">
              Moderation, music, economy, tickets, last.fm, and a casino. Everything works cleanly with your stuff, no strings attached.
            </p>
            <div className="actions">
              <a href={BOT_INVITE_URL} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                Add to Discord
              </a>
              <Link to="/commands" className="btn btn-glass">
                Browse commands
              </Link>
            </div>
            <ul className="stats">
              <li><strong>75+</strong> modules</li>
              <li><strong>100%</strong> slash commands</li>
              <li><strong>Free</strong> always (unless you want to support me ko-fi.com/fenruko)</li>
            </ul>
          </div>

          <div className="glass hero-card" aria-hidden="true">
            <div className="hero-card-head">
              <img src={LOGO_LARGE} width="40" height="40" alt="" className="logo" />
              <div>
                <div className="hero-card-name">Rift</div>
                <div className="muted small">Bot</div>
              </div>
            </div>
            <ul className="cmd-list">
              <li><code>/ban</code><span>Ban a member</span></li>
              <li><code>/music play</code><span>Play a track or link</span></li>
              <li><code>/fm now</code><span>Show what you are playing</span></li>
              <li><code>/ticket open</code><span>Open a support ticket</span></li>
              <li><code>/daily</code><span>Claim your daily reward</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section deferred">
        <div className="wrap">
          <h2 className="h2">What it does</h2>
          <div className="grid grid-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="glass card">
                <h3>{f.title}</h3>
                <p className="muted">{f.body}</p>
              </article>
            ))}
          </div>
          <p className="more">
            <Link to="/commands">See every module &rarr;</Link>
          </p>
        </div>
      </section>

      <section className="section deferred">
        <div className="wrap">
          <h2 className="h2">In action</h2>
          <p className="muted sub">Screenshots</p>
          <div className="shots">
            {SHOTS.map((s, i) => (
              <div key={s.cmd} className={`shot${i % 2 ? " flip" : ""}`}>
                <div className="glass shot-img">
                  <img src={s.img} width={s.w} height={s.h} alt={s.alt} loading="lazy" decoding="async" />
                </div>
                <div>
                  <code className="pill">{s.cmd}</code>
                  <h3>{s.title}</h3>
                  <p className="muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="deferred">
        <FAQ />
      </div>
    </>
  );
}
