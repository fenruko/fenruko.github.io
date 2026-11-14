import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useTitle from "../useTitle";
import { api } from "./api";
import { useAuth } from "./auth";
import AccountChip from "./AccountChip";
import { Avatar, Banner, formatDate } from "./util";

function PostCard({ post, featured }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`glass card blog-card${featured ? " blog-card-featured" : ""}`}>
      <Banner post={post} />
      <div className="blog-card-body">
        <div className="blog-meta">
          {post.status === "draft" && <span className="pill blog-draft">Draft</span>}
          <span>{formatDate(post.published_at || post.created_at)}</span>
        </div>
        <h2 className="blog-card-title">{post.title}</h2>
        {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
        <div className="blog-card-foot">
          <span className="blog-author">
            <Avatar src={post.author.avatar} name={post.author.name} size={22} />
            {post.author.name}
          </span>
          <span className="muted small">{post.comment_count} {post.comment_count === 1 ? "comment" : "comments"}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  useTitle("Blog · Rift");
  const { token, canPost, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [drafts, setDrafts] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchPage = useCallback(
    (offset, signal) => {
      const params = new URLSearchParams({ limit: "12", offset: String(offset) });
      if (debounced) params.set("q", debounced);
      if (drafts && canPost) params.set("drafts", "1");
      return api(`/blog/posts?${params}`, { token, signal });
    },
    [debounced, drafts, canPost, token]
  );

  useEffect(() => {
    if (authLoading) return undefined;
    const controller = new AbortController();
    setState("loading");
    fetchPage(0, controller.signal)
      .then((data) => {
        setPosts(data.posts);
        setHasMore(data.has_more);
        setState("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setState("error");
      });
    return () => controller.abort();
  }, [fetchPage, authLoading]);

  const loadMore = async () => {
    try {
      const data = await fetchPage(posts.length);
      setPosts((p) => [...p, ...data.posts]);
      setHasMore(data.has_more);
    } catch (err) {
      setError(err.message);
    }
  };

  const showFeatured = !debounced && posts.length > 1;

  return (
    <section className="page">
      <div className="wrap">
        <div className="blog-head">
          <div>
            <p className="eyebrow">Blog</p>
            <h1 className="h1-page">News &amp; updates</h1>
            <p className="lead">What&apos;s new in Rift, how it&apos;s built, and what&apos;s coming next.</p>
          </div>
          <div className="blog-head-actions">
            <AccountChip />
            {canPost && <Link to="/blog/new" className="btn btn-primary btn-sm">New post</Link>}
          </div>
        </div>

        <div className="blog-tools">
          <input
            className="md-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts"
            aria-label="Search posts"
          />
          {canPost && (
            <label className="blog-check">
              <input type="checkbox" checked={drafts} onChange={(e) => setDrafts(e.target.checked)} /> Show drafts
            </label>
          )}
        </div>

        {state === "loading" && <p className="muted blog-status">Loading posts…</p>}
        {state === "error" && <p className="blog-status blog-error" role="alert">{error}</p>}
        {state === "ready" && posts.length === 0 && (
          <p className="muted blog-status">{debounced ? "No posts match that search." : "No posts yet. Check back soon."}</p>
        )}

        {state === "ready" && posts.length > 0 && (
          <div className="blog-grid">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} featured={showFeatured && i === 0} />
            ))}
          </div>
        )}
        {state === "ready" && hasMore && (
          <div className="blog-more">
            <button type="button" className="btn btn-glass" onClick={loadMore}>Load more</button>
          </div>
        )}
      </div>
    </section>
  );
}
