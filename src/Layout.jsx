import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Eager loaded pages
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
// Lazy loaded pages
const CommandsPage = React.lazy(() => import("./pages/CommandsPage"));
const TeamPage = React.lazy(() => import("./pages/TeamPage"));

const routes = [
  { path: "/", component: HomePage },
  { path: "/commands", component: CommandsPage },
  { path: "/team", component: TeamPage },
];

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 group ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      } transition-all duration-500 ease-out`}
      aria-label="Scroll to top"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-[#0d0d0d]/90 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
          <ArrowUp className="w-6 h-6 text-blue-400 group-hover:-translate-y-1 transition-transform duration-300" />
        </div>
      </div>
    </button>
  );
};

const PageTransition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

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
    <div className="min-h-screen bg-[#0d0d0d] relative">
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
