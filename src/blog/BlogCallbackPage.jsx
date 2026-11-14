import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../useTitle";
import { completeLogin, startLogin, useAuth } from "./auth";

/* Discord sends people back here with the token in the URL fragment. */
export default function BlogCallbackPage() {
  useTitle("Signing in · Rift");
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const ran = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const result = completeLogin(window.location.hash);
    // Drop the token from the address bar and history straight away.
    window.history.replaceState(null, "", window.location.pathname);
    if (result.ok) {
      refresh();
      navigate(result.returnTo, { replace: true });
    } else if (result.retryWithConsent) {
      startLogin({ returnTo: result.returnTo, prompt: "consent" });
    } else {
      setError(result.message);
    }
  }, [navigate, refresh]);

  return (
    <section className="page">
      <div className="wrap narrow blog-center">
        {error ? (
          <>
            <h1 className="h2">Couldn&apos;t log you in</h1>
            <p className="muted">{error}</p>
            <p><Link to="/blog" className="btn btn-glass">Back to the blog</Link></p>
          </>
        ) : (
          <p className="muted">Signing you in…</p>
        )}
      </div>
    </section>
  );
}
