import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { getConfig } from "./config";

/* Discord OAuth2 (implicit grant), same approach as the dashboard: the bot's API
   trusts the Discord user token directly, so we only keep that token in
   localStorage. Only the `identify` scope is requested. */

const TOKEN_KEY = "rift_blog_token";
const EXPIRY_KEY = "rift_blog_token_expiry";
const STATE_KEY = "rift_blog_oauth_state";
const RETURN_KEY = "rift_blog_return";

let memoryToken = "";

export function readToken() {
  try {
    const expiry = Number(localStorage.getItem(EXPIRY_KEY)) || 0;
    if (expiry && Date.now() > expiry) {
      clearToken();
      return "";
    }
    return localStorage.getItem(TOKEN_KEY) || memoryToken;
  } catch {
    return memoryToken;
  }
}

export function writeToken(token, expiresInSeconds) {
  memoryToken = token;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (expiresInSeconds) localStorage.setItem(EXPIRY_KEY, String(Date.now() + expiresInSeconds * 1000));
  } catch {
    /* private mode: this tab still works from memory */
  }
}

export function clearToken() {
  memoryToken = "";
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  } catch {
    /* ignore */
  }
}

function randomState() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function redirectUri() {
  return `${window.location.origin}/blog/callback`;
}

/** Send the visitor to Discord, remembering where to come back to. */
export function startLogin({ returnTo, prompt = "none" } = {}) {
  const state = randomState();
  try {
    sessionStorage.setItem(STATE_KEY, state);
    sessionStorage.setItem(RETURN_KEY, returnTo || window.location.pathname + window.location.search);
  } catch {
    /* without sessionStorage we fall back to /blog afterwards */
  }
  const params = new URLSearchParams({
    client_id: getConfig().discordClientId,
    redirect_uri: redirectUri(),
    response_type: "token",
    scope: "identify",
    prompt,
    state,
  });
  window.location.assign(`https://discord.com/oauth2/authorize?${params}`);
}

/** Read the redirect hash. Returns { ok, returnTo } or { ok:false, retryWithConsent?, message }. */
export function completeLogin(hash) {
  const params = new URLSearchParams(String(hash || "").replace(/^#/, ""));
  let expected = "";
  let returnTo = "/blog";
  try {
    expected = sessionStorage.getItem(STATE_KEY) || "";
    returnTo = sessionStorage.getItem(RETURN_KEY) || "/blog";
    sessionStorage.removeItem(STATE_KEY);
    sessionStorage.removeItem(RETURN_KEY);
  } catch {
    /* ignore */
  }
  const error = params.get("error");
  if (error) {
    const needsConsent = ["interaction_required", "consent_required", "login_required"].includes(error);
    return { ok: false, retryWithConsent: needsConsent, returnTo, message: params.get("error_description") || "Discord login was cancelled." };
  }
  const token = params.get("access_token");
  if (!token) return { ok: false, returnTo, message: "Discord didn't send a login back." };
  if (!expected || params.get("state") !== expected) {
    return { ok: false, returnTo, message: "That login link didn't match this browser. Please try again." };
  }
  writeToken(token, Number(params.get("expires_in")) || 0);
  // Only ever return to a path on this site.
  return { ok: true, returnTo: returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/blog" };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(readToken()));
  const [blocked, setBlocked] = useState("");

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    api("/blog/me", { token, signal: controller.signal })
      .then((me) => {
        setUser(me);
        setBlocked("");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        if (err.status === 401) {
          clearToken();
          setToken("");
        } else if (err.status === 403) {
          setBlocked(err.message);
        }
        setUser(null);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [token]);

  const refresh = useCallback(() => setToken(readToken()), []);
  const logout = useCallback(() => {
    clearToken();
    setToken("");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      blocked,
      canPost: Boolean(user?.can_post),
      canManage: Boolean(user?.can_manage),
      login: (returnTo) => startLogin({ returnTo }),
      logout,
      refresh,
    }),
    [token, user, loading, blocked, logout, refresh]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
