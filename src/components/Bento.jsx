import { Link } from "react-router-dom";

// Small decorative previews for each feature card. Purely visual (aria-hidden
// by the wrapper); all names and numbers are invented placeholders.

function ModVisual() {
  return (
    <div className="mod-log">
      <div className="mod-row"><span className="mtag ban">ban</span><b>raid_bot</b><em>just now</em></div>
      <div className="mod-row"><span className="mtag timeout">timeout</span><b>spammer42</b><em>2m ago</em></div>
      <div className="mod-row"><span className="mtag warn">warn</span><b>newcomer</b><em>14m ago</em></div>
    </div>
  );
}

function MusicVisual() {
  return (
    <div className="eq">
      {Array.from({ length: 28 }, (_, i) => (
        <i key={i} style={{ "--i": i }} />
      ))}
    </div>
  );
}

function FmVisual() {
  const rows = [
    ["Paper Harbor", 92],
    ["Neon Orchard", 71],
    ["The Quiet Hours", 54],
    ["Static Bloom", 33],
  ];
  return (
    <div className="chart">
      {rows.map(([name, w]) => (
        <div key={name} className="chart-row">
          <span>{name}</span>
          <div className="chart-track"><i style={{ "--w": `${w}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

function CasinoVisual() {
  return (
    <div className="casino">
      <span className="pcard c1"><b>A</b><i>{"♠"}</i></span>
      <span className="pcard red c2"><b>K</b><i>{"♥"}</i></span>
      <span className="coins"><i /><i /><i /></span>
    </div>
  );
}

function TicketVisual() {
  return (
    <div className="tickets">
      <div className="ticket-row">
        <span>#0042</span><b>Role not showing up</b><em className="open">Open</em>
      </div>
      <div className="ticket-row dim">
        <span>#0041</span><b>Appeal question</b><em>Claimed</em>
      </div>
    </div>
  );
}

function VoiceVisual() {
  return (
    <div className="vc">
      <span className="vc-node">Server A</span>
      <span className="vc-line" />
      <span className="vc-node">Server B</span>
    </div>
  );
}

const FEATURES = [
  {
    key: "mod",
    span: "span-3",
    eyebrow: "/ban",
    title: "Moderation",
    body: "Bans, timeouts, warnings, case history, auto-mod, verification, and mod logs.",
    Visual: ModVisual,
  },
  {
    key: "music",
    span: "span-3",
    eyebrow: "/music play",
    title: "Music",
    body: "Playback from Spotify, YouTube and plain links, queues, lyrics, audio effects, and playlists.",
    Visual: MusicVisual,
  },
  {
    key: "fm",
    span: "span-2",
    eyebrow: "/fm now",
    title: "last.fm",
    body: "Now-playing cards, charts, recommendations, and taste matching between members.",
    Visual: FmVisual,
  },
  {
    key: "casino",
    span: "span-2",
    eyebrow: "/game blackjack",
    title: "Economy and casino",
    body: "Balances, a shop, daily rewards, blackjack, crash, horse racing, and slots.",
    Visual: CasinoVisual,
  },
  {
    key: "tickets",
    span: "span-2",
    eyebrow: "/ticket open",
    title: "Tickets",
    body: "Ticket panels, modmail, transcripts, and staff claim flow.",
    Visual: TicketVisual,
  },
  {
    key: "voice",
    span: "span-6 row",
    eyebrow: "VoiceMaster",
    title: "Voice",
    body: "VoiceMaster private channels, voice XP, and voice calls between servers.",
    Visual: VoiceVisual,
  },
];

// One pointermove handler for the whole grid: it feeds the hovered card its
// cursor position, which the CSS turns into a soft spotlight.
function trackSpotlight(e) {
  const card = e.target.closest?.(".bento-card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Bento() {
  return (
    <>
      <div className="bento" onPointerMove={trackSpotlight}>
        {FEATURES.map(({ key, span, eyebrow, title, body, Visual }) => (
          <article key={key} className={`bento-card ${span}`}>
            <div className="bento-vis" aria-hidden="true">
              <Visual />
            </div>
            <div className="bento-copy">
              <code className="eyebrow">{eyebrow}</code>
              <h3>{title}</h3>
              <p className="muted">{body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="more">
        <Link to="/commands">See every module &rarr;</Link>
      </p>
    </>
  );
}
