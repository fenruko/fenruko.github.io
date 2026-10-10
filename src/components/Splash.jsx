import { useEffect, useState } from "react";

const RIFT_LOGO = "/assets/riftlogo.jpg";

// Branded splash on first load: the logo fades in fast, then zooms through
// the viewer. Releases the body scroll lock (body:not(.loaded) in index.css).
export default function Splash() {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => {
      setHide(true);
      document.body.classList.add("loaded");
    }, reduce ? 50 : 950);
    const t2 = setTimeout(() => setGone(true), reduce ? 100 : 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.classList.add("loaded");
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`splash${hide ? " hide" : ""}`} aria-hidden="true">
      <img className="splash-logo logo-oct" src={RIFT_LOGO} alt="" />
    </div>
  );
}
