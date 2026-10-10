import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Background from "./components/Background";
import Splash from "./components/Splash";
import RouteFlash from "./components/RouteFlash";

// Wraps React.lazy so that a failed dynamic import (e.g. a stale chunk
// hash from before the latest deploy) triggers a single automatic
// reload to fetch the current index.html, instead of a dead white screen.
function lazyWithReload(factory) {
  return React.lazy(() =>
    factory().catch((err) => {
      const key = "chunk-reload-" + factory.toString();
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
        // Never resolves; the reload takes over.
        return new Promise(() => {});
      }
      throw err;
    })
  );
}

// Eager loaded pages
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
// Lazy loaded pages
const CommandsPage = lazyWithReload(() => import("./pages/CommandsPage"));
const TeamPage = lazyWithReload(() => import("./pages/TeamPage"));

const routes = [
  { path: "/", component: HomePage },
  { path: "/commands", component: CommandsPage },
  { path: "/team", component: TeamPage },
];

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 rounded-full border border-white/10 bg-[#0a0c12]/80 p-3.5 backdrop-blur-xl transition-all duration-500 ease-out hover:border-[#8a7dff]/50 hover:bg-[#8a7dff]/15 active:scale-95 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
};

// Runs once per page mount (after the previous page has finished leaving):
// jump to top, or to the #hash target if there is one.
const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname, location.hash]);

  return null;
};

const ease = [0.22, 1, 0.36, 1];

const Layout = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <Splash />
      <RouteFlash />
      <Background />
      <Navbar />

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="relative"
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease, delay: 0.12 } }}
          exit={{ opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: 0.22, ease: "easeIn" } }}
        >
          <ScrollManager />
          <Suspense>
            <Routes location={location}>
              {routes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
