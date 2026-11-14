import { useAuth } from "./auth";
import { Avatar } from "./util";

/* "Log in with Discord" / signed-in chip shown at the top of blog pages. */
export default function AccountChip() {
  const { user, loading, blocked, login, logout } = useAuth();
  if (loading) return <span className="muted small">Checking login…</span>;
  if (blocked) return <span className="muted small" title={blocked}>Your account can&apos;t use the blog</span>;
  if (!user) {
    return (
      <button type="button" className="btn btn-primary btn-sm" onClick={() => login()}>
        Log in with Discord
      </button>
    );
  }
  return (
    <span className="blog-account">
      <Avatar src={user.avatar} name={user.name} size={26} />
      <span className="blog-account-name">{user.name}</span>
      <button type="button" className="btn btn-glass btn-sm" onClick={logout}>Log out</button>
    </span>
  );
}
