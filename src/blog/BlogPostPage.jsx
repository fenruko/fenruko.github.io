import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useTitle from "../useTitle";
import { api } from "./api";
import { useAuth } from "./auth";
import AccountChip from "./AccountChip";
import Markdown from "./Markdown";
import { Avatar, Banner, formatDate, timeAgo } from "./util";

const COMMENT_MAX = 2000;

function CommentBox({ onSubmit, placeholder, autoFocus, onCancel, submitLabel = "Comment" }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      await onSubmit(text.trim());
      setText("");
      onCancel?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="comment-box" onSubmit={submit}>
      <textarea
        className="md-textarea comment-input"
        value={text}
        autoFocus={autoFocus}
        maxLength={COMMENT_MAX}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submit(e);
        }}
      />
      {error && <p className="md-error" role="alert">{error}</p>}
      <div className="comment-box-foot">
        <span className="muted small">Markdown works. {text.length}/{COMMENT_MAX}</span>
        <span className="comment-actions">
          {onCancel && <button type="button" className="btn btn-glass btn-sm" onClick={onCancel}>Cancel</button>}
          <button type="submit" className="btn btn-primary btn-sm" disabled={busy || !text.trim()}>
            {busy ? "Posting…" : submitLabel}
          </button>
        </span>
      </div>
    </form>
  );
}

function Comment({ comment, replies = [], user, canManage, onReply, onDelete, isReply }) {
  const [replying, setReplying] = useState(false);
  const mine = user && user.id === comment.user.id;
  return (
    <li className={`comment${isReply ? " comment-reply" : ""}`} id={`comment-${comment.id}`}>
      <Avatar src={comment.user.avatar} name={comment.user.name} size={32} />
      <div className="comment-main">
        <div className="comment-head">
          {comment.deleted ? <em className="muted">deleted</em> : <strong>{comment.user.name}</strong>}
          <span className="muted small" title={new Date(comment.created_at * 1000).toLocaleString()}>{timeAgo(comment.created_at)}</span>
        </div>
        {comment.deleted ? (
          <p className="muted small">This comment was removed.</p>
        ) : (
          <>
            <Markdown source={comment.body} variant="comment" />
            <div className="comment-tools">
              {user && <button type="button" className="link-btn" onClick={() => setReplying((v) => !v)}>Reply</button>}
              {(mine || canManage) && (
                <button type="button" className="link-btn link-btn-danger" onClick={() => onDelete(comment)}>Delete</button>
              )}
            </div>
          </>
        )}
        {replying && (
          <CommentBox
            autoFocus
            placeholder={`Reply to ${comment.user.name}`}
            submitLabel="Reply"
            onCancel={() => setReplying(false)}
            onSubmit={(body) => onReply(comment, body)}
          />
        )}
        {replies.length > 0 && (
          <ul className="comment-list">
            {replies.map((r) => (
              <Comment key={r.id} comment={r} user={user} canManage={canManage} onReply={onReply} onDelete={onDelete} isReply />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, user, canManage, loading: authLoading, login } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useTitle(data ? `${data.post.title} · Rift Blog` : "Blog · Rift");

  useEffect(() => {
    if (authLoading) return undefined;
    const controller = new AbortController();
    setData(null);
    setError("");
    setNotFound(false);
    api(`/blog/posts/${encodeURIComponent(slug)}`, { token, signal: controller.signal })
      .then(setData)
      .catch((err) => {
        if (err.name === "AbortError") return;
        if (err.status === 404) setNotFound(true);
        else setError(err.message);
      });
    return () => controller.abort();
  }, [slug, token, authLoading]);

  const { top, repliesByParent } = useMemo(() => {
    const comments = data?.comments || [];
    const byParent = {};
    for (const c of comments) if (c.parent_id) (byParent[c.parent_id] ||= []).push(c);
    return { top: comments.filter((c) => !c.parent_id), repliesByParent: byParent };
  }, [data]);

  if (notFound) {
    return (
      <section className="page">
        <div className="wrap narrow blog-center">
          <h1 className="h2">Post not found</h1>
          <p className="muted">It may have been removed, or it&apos;s still a draft.</p>
          <p><Link to="/blog" className="btn btn-glass">Back to the blog</Link></p>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="page">
        <div className="wrap narrow blog-center"><p className="blog-error" role="alert">{error}</p></div>
      </section>
    );
  }
  if (!data) {
    return (
      <section className="page">
        <div className="wrap narrow blog-center"><p className="muted">Loading…</p></div>
      </section>
    );
  }

  const { post } = data;
  const canEdit = Boolean(user && (canManage || (user.can_post && user.id === post.author.id)));
  const visibleCount = data.comments.filter((c) => !c.deleted).length;

  const addComment = async (body, parent) => {
    const res = await api(`/blog/posts/${post.id}/comments`, {
      method: "POST",
      token,
      body: { body, parent_id: parent?.id ?? null },
    });
    setData((d) => ({ ...d, comments: [...d.comments, res.comment] }));
  };

  const removeComment = async (comment) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api(`/blog/comments/${comment.id}`, { method: "DELETE", token });
      setData((d) => ({ ...d, comments: d.comments.map((c) => (c.id === comment.id ? { ...c, deleted: true, body: "" } : c)) }));
    } catch (err) {
      window.alert(err.message);
    }
  };

  const removePost = async () => {
    if (!window.confirm("Delete this post and all its comments? This can't be undone.")) return;
    try {
      await api(`/blog/posts/${post.id}`, { method: "DELETE", token });
      navigate("/blog", { replace: true });
    } catch (err) {
      window.alert(err.message);
    }
  };

  return (
    <article className="page">
      <div className="wrap blog-article">
        <div className="blog-article-top">
          <Link to="/blog" className="blog-back">← All posts</Link>
          <AccountChip />
        </div>

        <Banner post={post} className="blog-hero" />
        <header className="blog-article-head">
          {post.status === "draft" && <p className="pill blog-draft">Draft · only staff can see this</p>}
          <h1 className="h1-page">{post.title}</h1>
          <div className="blog-byline">
            <Avatar src={post.author.avatar} name={post.author.name} size={30} />
            <span>
              <strong>{post.author.name}</strong>
              <span className="muted small">
                {" · "}{formatDate(post.published_at || post.created_at)}
                {post.updated_at - (post.published_at || post.created_at) > 60 ? " · edited" : ""}
              </span>
            </span>
            {canEdit && (
              <span className="blog-owner-tools">
                <Link to={`/blog/edit/${post.slug}`} className="btn btn-glass btn-sm">Edit</Link>
                <button type="button" className="btn btn-glass btn-sm blog-danger" onClick={removePost}>Delete</button>
              </span>
            )}
          </div>
        </header>

        <Markdown source={post.body} />

        <section className="comments" aria-labelledby="comments-title">
          <h2 className="h3" id="comments-title">{visibleCount} {visibleCount === 1 ? "comment" : "comments"}</h2>
          {post.status !== "published" ? (
            <p className="muted">Comments open once the post is published.</p>
          ) : user ? (
            <CommentBox placeholder="Join the conversation" onSubmit={(body) => addComment(body, null)} />
          ) : (
            <div className="glass card comment-login">
              <p>Log in with Discord to comment. You can read everything without an account.</p>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => login()}>Log in with Discord</button>
            </div>
          )}
          {top.length > 0 && (
            <ul className="comment-list">
              {top.map((c) => (
                <Comment
                  key={c.id}
                  comment={c}
                  replies={repliesByParent[c.id]}
                  user={user}
                  canManage={canManage}
                  onReply={(parent, body) => addComment(body, parent)}
                  onDelete={removeComment}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
}
