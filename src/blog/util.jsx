import { imageUrl } from "./config";

export function formatDate(seconds) {
  if (!seconds) return "";
  return new Date(seconds * 1000).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export function timeAgo(seconds) {
  if (!seconds) return "";
  const diff = Math.round(seconds - Date.now() / 1000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(diff) >= size) return rtf.format(Math.round(diff / size), unit);
  }
  return "just now";
}

export function Avatar({ src, name, size = 28 }) {
  if (src) return <img className="blog-avatar" src={src} width={size} height={size} alt="" loading="lazy" />;
  return (
    <span className="blog-avatar blog-avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.45 }} aria-hidden="true">
      {(name || "?").slice(0, 1).toUpperCase()}
    </span>
  );
}

export function Banner({ post, className = "" }) {
  if (post.banner_id) {
    return <img className={`blog-banner ${className}`} src={imageUrl(post.banner_id)} alt="" loading="lazy" decoding="async" />;
  }
  return (
    <div className={`blog-banner blog-banner-empty ${className}`} aria-hidden="true">
      <span>{(post.title || "R").slice(0, 1).toUpperCase()}</span>
    </div>
  );
}
