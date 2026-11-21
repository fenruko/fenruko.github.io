import { Link } from "react-router-dom";
import Bento from "../components/Bento";
import CtaBand from "../components/CtaBand";
import DiscordDemo from "../components/DiscordDemo";
import FAQ from "../components/FAQ";
import useTitle from "../useTitle";
import { BOT_INVITE_URL } from "../links";
import "../home.css";

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
        <div className="hero-bg beams" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="wrap hero-center">
          <Link to="/commands" className="hero-badge">
            <b>Free</b>
            <span>75+ modules, no strings attached</span>
            <i aria-hidden="true">&rarr;</i>
          </Link>
          <h1 className="h1">Rift</h1>
          <p className="lead lead-center">
            Moderation, music, economy, tickets, last.fm, and a casino. Everything works cleanly with your stuff, no strings attached.
          </p>
          <div className="actions actions-center">
            <a href={BOT_INVITE_URL} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Add to Discord
            </a>
            <Link to="/commands" className="btn btn-glass">
              Browse commands
            </Link>
          </div>
        </div>

        <div className="wrap demo-wrap">
          <DiscordDemo />
        </div>

        <div className="wrap">
          <ul className="stat-strip">
            <li><strong>75+</strong><span>modules</span></li>
            <li><strong>100%</strong><span>slash commands</span></li>
            <li><strong>Free</strong><span>always</span></li>
          </ul>
          <p className="support-note muted small">
            Want to support the project? <a href="https://ko-fi.com/fenruko" target="_blank" rel="noopener noreferrer">ko-fi.com/fenruko</a>
          </p>
        </div>
      </section>

      <section className="section deferred">
        <div className="wrap">
          <p className="eyebrow">All-in-one</p>
          <h2 className="h2">What it does</h2>
          <Bento />
        </div>
      </section>

      <section className="section deferred">
        <div className="wrap">
          <p className="eyebrow">Screenshots</p>
          <h2 className="h2">In action</h2>
          <div className="shots">
            {SHOTS.map((s, i) => (
              <div key={s.cmd} className={`shot${i % 2 ? " flip" : ""}`}>
                <div className="shot-img">
                  <div className="frame-bar" aria-hidden="true"><i /><i /><i /></div>
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

      <div className="deferred">
        <CtaBand />
      </div>
    </>
  );
}
