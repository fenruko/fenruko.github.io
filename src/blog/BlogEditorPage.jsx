import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useTitle from "../useTitle";
import { api, uploadImage } from "./api";
import { useAuth } from "./auth";
import AccountChip from "./AccountChip";
import Editor from "./Editor";
import { imageUrl } from "./config";

const DRAFT_KEY = "rift_blog_unsaved_new_post";

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
  } catch {
    return null;
  }
}

export default function BlogEditorPage() {
  const { slug } = useParams();
  const editing = Boolean(slug);
  const navigate = useNavigate();
  const { token, user, canPost, canManage, loading: authLoading, login } = useAuth();
  useTitle(editing ? "Edit post · Rift Blog" : "New post · Rift Blog");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [bannerId, setBannerId] = useState(null);
  const [status, setStatus] = useState("published");
  const [postId, setPostId] = useState(null);
  const [loaded, setLoaded] = useState(!editing);
  const [restored, setRestored] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bannerBusy, setBannerBusy] = useState(false);
  const [error, setError] = useState("");
  const bannerRef = useRef(null);

  // Load the post when editing.
  useEffect(() => {
    if (!editing || authLoading || !token) return undefined;
    const controller = new AbortController();
    api(`/blog/posts/${encodeURIComponent(slug)}`, { token, signal: controller.signal })
      .then(({ post }) => {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setBody(post.body);
        setBannerId(post.banner_id);
        setStatus(post.status);
        setPostId(post.id);
        setLoaded(true);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      });
    return () => controller.abort();
  }, [editing, slug, token, authLoading]);

  // Bring back an unsaved new post after a refresh or a login round-trip.
  useEffect(() => {
    if (editing) return;
    const saved = readSaved();
    if (saved && (saved.title || saved.body)) {
      setTitle(saved.title || "");
      setExcerpt(saved.excerpt || "");
      setBody(saved.body || "");
      setBannerId(saved.bannerId || null);
      setRestored(true);
    }
  }, [editing]);

  useEffect(() => {
    if (editing) return undefined;
    const t = setTimeout(() => {
      try {
        if (title || body) localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, excerpt, body, bannerId }));
        else localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* storage unavailable: nothing to restore later */
      }
    }, 600);
    return () => clearTimeout(t);
  }, [editing, title, excerpt, body, bannerId]);

  const discardSaved = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setTitle("");
    setExcerpt("");
    setBody("");
    setBannerId(null);
    setRestored(false);
  };

  const pickBanner = async (file) => {
    setError("");
    setBannerBusy(true);
    try {
      setBannerId(await uploadImage(file, token));
    } catch (err) {
      setError(err.message);
    } finally {
      setBannerBusy(false);
    }
  };

  const save = async (nextStatus) => {
    setError("");
    if (title.trim().length < 3) return setError("Give the post a title first.");
    if (!body.trim()) return setError("The post body is empty.");
    setBusy(true);
    try {
      const payload = { title: title.trim(), excerpt: excerpt.trim(), body, banner_id: bannerId, status: nextStatus };
      const res = editing
        ? await api(`/blog/posts/${postId}`, { method: "PUT", token, body: payload })
        : await api("/blog/posts", { method: "POST", token, body: payload });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      navigate(`/blog/${res.post.slug}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const shell = (children) => (
    <section className="page">
      <div className="wrap narrow blog-center">{children}</div>
    </section>
  );

  if (authLoading) return shell(<p className="muted">Checking your login…</p>);
  if (!user) {
    return shell(
      <>
        <h1 className="h2">Log in to write a post</h1>
        <p className="muted">Posting is limited to Rift staff. Sign in with the Discord account linked to your staff profile.</p>
        <p><button type="button" className="btn btn-primary" onClick={() => login("/blog/new")}>Log in with Discord</button></p>
      </>
    );
  }
  if (!canPost && !(editing && canManage)) {
    return shell(
      <>
        <h1 className="h2">You can&apos;t post here</h1>
        <p className="muted">This Discord account isn&apos;t linked to a staff profile with posting access. Ask the founder to link it and grant &quot;Write &amp; publish blog posts&quot;.</p>
        <p><Link to="/blog" className="btn btn-glass">Back to the blog</Link></p>
      </>
    );
  }
  if (!loaded) return shell(error ? <p className="blog-error" role="alert">{error}</p> : <p className="muted">Loading post…</p>);

  const wasPublished = editing && status === "published";

  return (
    <section className="page">
      <div className="wrap blog-editor-page">
        <div className="blog-article-top">
          <Link to={editing ? `/blog/${slug}` : "/blog"} className="blog-back">← {editing ? "Back to post" : "All posts"}</Link>
          <AccountChip />
        </div>
        <h1 className="h1-page">{editing ? "Edit post" : "New post"}</h1>

        {restored && (
          <p className="blog-note">
            Restored your unsaved draft. <button type="button" className="link-btn" onClick={discardSaved}>Discard it</button>
          </p>
        )}

        <label className="field">
          <span className="field-label">Title</span>
          <input className="md-input blog-title-input" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="What's this post about?" />
        </label>

        <label className="field">
          <span className="field-label">Short summary <span className="muted">(shown on cards and in notifications; optional)</span></span>
          <textarea className="md-textarea" style={{ minHeight: 76 }} value={excerpt} maxLength={300} onChange={(e) => setExcerpt(e.target.value)} placeholder="One or two sentences. Leave empty to use the start of the post." />
        </label>

        <div className="field">
          <span className="field-label">Banner image</span>
          {bannerId ? (
            <div className="banner-picker">
              <img src={imageUrl(bannerId)} alt="Banner preview" />
              <span className="banner-picker-actions">
                <button type="button" className="btn btn-glass btn-sm" onClick={() => bannerRef.current?.click()} disabled={bannerBusy}>Replace</button>
                <button type="button" className="btn btn-glass btn-sm" onClick={() => setBannerId(null)}>Remove</button>
              </span>
            </div>
          ) : (
            <button type="button" className="banner-drop" onClick={() => bannerRef.current?.click()} disabled={bannerBusy}>
              {bannerBusy ? "Uploading…" : "Click to upload a banner (PNG, JPEG, GIF or WebP, up to 3 MB)"}
            </button>
          )}
          <input ref={bannerRef} type="file" hidden accept="image/png,image/jpeg,image/gif,image/webp" onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) pickBanner(file);
          }} />
        </div>

        <div className="field">
          <span className="field-label">Content</span>
          <Editor value={body} onChange={setBody} onUploadImage={(file) => uploadImage(file, token)} />
        </div>

        {error && <p className="blog-error" role="alert">{error}</p>}

        <div className="blog-editor-actions">
          {wasPublished ? (
            <>
              <button type="button" className="btn btn-primary" disabled={busy} onClick={() => save("published")}>{busy ? "Saving…" : "Save changes"}</button>
              <button type="button" className="btn btn-glass" disabled={busy} onClick={() => save("draft")}>Unpublish (back to draft)</button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-primary" disabled={busy} onClick={() => save("published")}>{busy ? "Publishing…" : "Publish"}</button>
              <button type="button" className="btn btn-glass" disabled={busy} onClick={() => save("draft")}>Save as draft</button>
            </>
          )}
          <span className="muted small">{wasPublished ? "Edits to a published post don't send a new notification." : "Publishing notifies the dashboard and staff panel."}</span>
        </div>
      </div>
    </section>
  );
}
