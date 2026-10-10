import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const RIFT_LOGO = "/assets/riftlogo.jpg";
const TOTAL = 0.95; // seconds

// Plays on every tab switch: the screen dims, the Rift logo fades in fast,
// then zooms straight through the viewer and vanishes, revealing the new page.
export default function RouteFlash() {
  const { pathname } = useLocation();
  const prev = useRef(pathname);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setRun((n) => n + 1);
    const t = setTimeout(() => setRun(0), TOTAL * 1000 + 100);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {run > 0 && (
        <motion.div
          key={run}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[900] grid place-items-center"
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#06070b]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.94, 0.94, 0] }}
            transition={{ duration: TOTAL, times: [0, 0.2, 0.55, 1], ease: "easeInOut" }}
            style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          />
          <motion.img
            src={RIFT_LOGO}
            alt=""
            className="logo-oct relative h-20 w-20 object-cover"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.7, 1, 1.05, 28],
              filter: ["blur(0px)", "blur(0px)", "blur(0px)", "blur(16px)"],
            }}
            transition={{ duration: TOTAL, times: [0, 0.18, 0.4, 1], ease: ["easeOut", "linear", [0.55, 0, 0.9, 0.4]] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
