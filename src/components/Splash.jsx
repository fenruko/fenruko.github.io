import { useEffect, useState } from "react";

const RIFT_LOGO = "/assets/riftlogo.jpg";

// Short branded splash on first load. Releases the body scroll lock
// (body:not(.loaded) in index.css) and zooms the logo out when done.
export default function Splash() {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => {
      setHide(true);
      document.body.classList.add("loaded");
    }, reduce ? 50 : 900);
    const t2 = setTimeout(() => setGone(true), reduce ? 100 : 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.classList.add("loaded");
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`splash${hide ? " hide" : ""}`} aria-hidden="true">
      <img className="splash-logo" src={RIFT_LOGO} alt="" />
    </div>
  );
}
