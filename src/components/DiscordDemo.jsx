import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { LOGO_LARGE } from "../links";

// A scripted, purely illustrative Discord window. All names, tracks and
// numbers below are invented placeholders; the embeds only mimic the shape
// of Rift's real replies.

const AUTO_MS = 7500;

function Icon({ name }) {
  const paths = {
    prev: "M6 6h2v12H6zM20 6v12L9.5 12z",
    pause: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z",
    next: "M16 6h2v12h-2zM4 6v12l10.5-6z",
  };
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function PlayingCard({ rank, suit, hidden }) {
  if (hidden) return <span className="pcard pcard-back" />;
  const red = suit === "♥" || suit === "♦";
  return (
    <span className={`pcard${red ? " red" : ""}`}>
      <b>{rank}</b>
      <i>{suit}</i>
    </span>
  );
}

const SCENES = [
  {
    id: "music",
    label: "Music",
    channel: "music",
    cmd: "/music play lofi study mix",
    reply: "/music play",
    body: (
      <div className="embed">
        <div className="embed-row">
          <span className="art art-a" aria-hidden="true" />
          <div className="embed-text">
            <div className="embed-kicker">Now playing</div>
            <div className="embed-title">Slow Lanterns</div>
            <div className="muted small">Paper Harbor &middot; Night Bus</div>
          </div>
        </div>
        <div className="progress" aria-hidden="true"><i /></div>
        <div className="progress-times"><span>1:12</span><span>3:40</span></div>
        <div className="dbtns">
          <span className="dbtn icon"><Icon name="prev" /></span>
          <span className="dbtn icon on"><Icon name="pause" /></span>
          <span className="dbtn icon"><Icon name="next" /></span>
          <span className="dbtn">Loop</span>
          <span className="dbtn">Shuffle</span>
          <span className="dbtn">Lyrics</span>
        </div>
      </div>
    ),
  },
  {
    id: "lastfm",
    label: "last.fm",
    channel: "general",
    cmd: "/fm now",
    reply: "/fm now",
    body: (
      <div className="embed">
        <div className="embed-row">
          <span className="art art-b" aria-hidden="true" />
          <div className="embed-text">
            <div className="embed-kicker">ava is listening to</div>
            <div className="embed-title">Glass Rivers</div>
            <div className="muted small">Neon Orchard &middot; Static Bloom</div>
          </div>
        </div>
        <div className="embed-stats">
          <div><strong>1,284</strong><span>scrobbles</span></div>
          <div><strong>212</strong><span>this week</span></div>
          <div><strong>38</strong><span>top-artist plays</span></div>
        </div>
      </div>
    ),
  },
  {
    id: "casino",
    label: "Casino",
    channel: "casino",
    cmd: "/game blackjack bet:50000",
    reply: "/game blackjack",
    body: (
      <div className="embed">
        <div className="embed-kicker">Blackjack &middot; bet $50,000</div>
        <div className="hands">
          <div>
            <div className="muted small">Dealer &middot; 7</div>
            <div className="hand"><PlayingCard rank="7" suit={"♠"} /><PlayingCard hidden /></div>
          </div>
          <div>
            <div className="muted small">You &middot; 20</div>
            <div className="hand"><PlayingCard rank="K" suit={"♥"} /><PlayingCard rank="10" suit={"♣"} /></div>
          </div>
        </div>
        <div className="dbtns">
          <span className="dbtn">Hit</span>
          <span className="dbtn on">Stand</span>
          <span className="dbtn">Double down</span>
          <span className="dbtn">Split</span>
        </div>
      </div>
    ),
  },
  {
    id: "mod",
    label: "Moderation",
    channel: "mod-log",
    cmd: "/ban user:@raid_bot reason:raid spam",
    reply: "/ban",
    body: (
      <div className="embed embed-warn">
        <div className="embed-kicker">Member banned &middot; Case #128</div>
        <dl className="kv">
          <div><dt>User</dt><dd>raid_bot</dd></div>
          <div><dt>Moderator</dt><dd>ava</dd></div>
          <div><dt>Reason</dt><dd>raid spam</dd></div>
          <div><dt>Logged</dt><dd>#mod-log</dd></div>
        </dl>
      </div>
    ),
  },
];

const CHANNELS = ["general", "music", "casino", "mod-log"];

export default function DiscordDemo() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(true);
  const prev = useRef(0);
  const dir = useRef(1);
  const rootRef = useRef(null);
  const tabRefs = useRef([]);
  const [thumb, setThumb] = useState({ x: 0, w: 0 });

  const select = useCallback((i, manual) => {
    if (i === prev.current) return;
    dir.current = i > prev.current ? 1 : -1;
    prev.current = i;
    setActive(i);
    if (manual) setAuto(false);
  }, []);

  // Slide the single "thumb" under the selected tab.
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[active];
      if (el) setThumb({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // Only animate while the demo is on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Auto-advance until the visitor picks a scene themselves.
  useEffect(() => {
    if (!auto || !inView) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setTimeout(() => select((active + 1) % SCENES.length, false), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, auto, inView, select]);

  const onKeyDown = (e) => {
    const last = SCENES.length - 1;
    let next = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
    tabRefs.current[next]?.focus();
  };

  const scene = SCENES[active];

  return (
    <div className="demo" ref={rootRef}>
      <div className="demo-glow" aria-hidden="true" />
      <div className="demo-window">
        <div className="demo-bar" aria-hidden="true">
          <span className="demo-dots"><i /><i /><i /></span>
          <span className="demo-title">#{scene.channel}</span>
          <span />
        </div>

        <div className="demo-body">
          <aside className="demo-side" aria-hidden="true">
            <div className="demo-server">My Server</div>
            {CHANNELS.map((c) => (
              <div key={c} className={`demo-chan${c === scene.channel ? " on" : ""}`}>{c}</div>
            ))}
          </aside>

          <div
            key={scene.id}
            id="demo-panel"
            role="tabpanel"
            aria-labelledby={`demo-tab-${scene.id}`}
            className="demo-main"
            style={{ "--dir": dir.current }}
          >
            <div className="demo-feed">
              <div className="dmsg" style={{ "--d": "1.25s" }}>
                <img className="dmsg-av logo" src={LOGO_LARGE} width="40" height="40" alt="" />
                <div className="dmsg-col">
                  <div className="dmsg-reply">
                    <span className="dmsg-mini" aria-hidden="true">a</span>
                    ava used <code>{scene.reply}</code>
                  </div>
                  <div className="dmsg-head">
                    <span className="dmsg-name">Rift</span>
                    <span className="dmsg-app">APP</span>
                  </div>
                  {scene.body}
                </div>
              </div>
            </div>

            <div className="demo-input" aria-hidden="true" style={{ "--n": scene.cmd.length }}>
              <span className="demo-typed">{scene.cmd}</span>
              <span className="demo-placeholder">Message #{scene.channel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-tabs-wrap">
        <div className="demo-tabs" role="tablist" aria-label="Rift in action" onKeyDown={onKeyDown}>
          <span className="demo-thumb" aria-hidden="true" style={{ "--x": `${thumb.x}px`, "--w": `${thumb.w}px` }} />
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              id={`demo-tab-${s.id}`}
              type="button"
              role="tab"
              className="demo-tab"
              aria-selected={i === active}
              aria-controls="demo-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i, true)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
