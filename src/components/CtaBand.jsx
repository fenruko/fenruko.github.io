import { BOT_INVITE_URL, SUPPORT_SERVER_URL } from "../links";

export default function CtaBand() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta">
          <div className="beams" aria-hidden="true"><span /><span /><span /></div>
          <p className="eyebrow">Ready when you are</p>
          <h2 className="h2">Add Rift to your server.</h2>
          <p className="lead lead-center">
            Free, 75+ modules, no strings attached. Defaults work out of the box.
          </p>
          <div className="actions actions-center">
            <a href={BOT_INVITE_URL} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Add to Discord
            </a>
            <a href={SUPPORT_SERVER_URL} className="btn btn-glass" target="_blank" rel="noopener noreferrer">
              Join the support server
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
