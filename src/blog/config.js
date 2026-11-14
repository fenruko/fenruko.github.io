// Runtime settings come from /config.js (window.RIFT_CONFIG) so the API host can
// change without a rebuild. These defaults match the dashboard's.
const DEFAULTS = {
  apiBase: "https://api.rift.cool/api",
  discordClientId: "1329184069426348052",
};

export function getConfig() {
  const runtime = (typeof window !== "undefined" && window.RIFT_CONFIG) || {};
  return { ...DEFAULTS, ...runtime };
}

export function apiBase() {
  return String(getConfig().apiBase).replace(/\/+$/, "");
}

/** Scheme + host of the API, used to turn "/api/blog/images/5" into a full URL. */
export function apiOrigin() {
  try {
    return new URL(apiBase()).origin;
  } catch {
    return "";
  }
}

/** Image ids are stored as `rift-image:<id>` in post bodies so they survive an API host change. */
export function imageUrl(id) {
  return `${apiBase()}/blog/images/${encodeURIComponent(id)}`;
}
