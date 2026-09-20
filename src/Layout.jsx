import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Background from "./components/Background";

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
      className={`fixed bottom-6 right-6 z-40 rounded-full border border-white/10 bg-[#0a0c12]/80 p-3.5 backdrop-blur-xl transition-all duration-500 ease-out hover:border-[#5865f2]/50 hover:bg-[#5865f2]/20 active:scale-95 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
};

const PageTransition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname, location.hash]);

  return <div>{children}</div>;
};

const Layout = () => {
  return (
    <div className="relative min-h-screen">
      <Background />
      <Navbar />

      <main className="relative">
        <Suspense>
          <Routes>
            {routes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PageTransition>
                    <Component />
                  </PageTransition>
                }
              />
            ))}
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
