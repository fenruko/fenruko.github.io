import { useCallback, useEffect, useRef, useState } from "react";
import Markdown, { FONT_COLORS, FONT_FAMILIES, FONT_SIZES, youtubeId } from "./Markdown";
import { continueList, heading, insertBlock, insertText, link, prefixLines, wrap } from "./editorOps";

/* A Markdown editor laid out like Modrinth's description editor: a toolbar of
   small icon buttons above a monospace textarea, a Preview switch at the right
   and a one-line hint underneath. `onUploadImage(file)` should resolve to an
   image id; images are written into the text as ![](rift-image:ID). */

const ICONS = {
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  spoiler: <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />,
  ul: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  ol: <path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />,
  quote: <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .76-2 2v6c0 1.25.76 2 2 2h4M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .76-2 2v6c0 1.25.76 2 2 2h4" />,
  link: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
    </>
  ),
  video: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  font: <path d="M4 7V4h16v3M9 20h6M12 4v16" />,
  color: <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.9 1.2-1.7-.4-1 .3-2.3 1.5-2.3H17a4 4 0 0 0 4-4c0-5-4-10-9-10z" />,
  align: <path d="M3 6h18M7 12h10M5 18h14" />,
  callout: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-4M12 8h.01" />
    </>
  ),
  divider: <path d="M4 12h16" />,
};

function Icon({ name }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function Btn({ label, onClick, children, active, disabled }) {
  return (
    <button type="button" className={`md-btn${active ? " is-active" : ""}`} aria-label={label} title={label} aria-pressed={active} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

const SEP = <span className="md-sep" role="separator" />;
const titleCase = (s) => s[0].toUpperCase() + s.slice(1);
const FONT_LABELS = { sans: "Sans (default)", serif: "Serif", mono: "Monospace", display: "Display", hand: "Handwriting" };
const SIZE_LABELS = { sm: "Small", lg: "Large", xl: "Extra large", xxl: "Huge" };
const CALLOUT_LABELS = { note: "Note", tip: "Tip", warning: "Warning", danger: "Danger" };

export default function Editor({ value, onChange, onUploadImage, maxLength = 100000, placeholder = "Write your post here…", minHeight = 420 }) {
  const ref = useRef(null);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [menu, setMenu] = useState(null);
  const [bar, setBar] = useState(null); // { kind: "link" | "image" | "video", value }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Close an open dropdown when clicking anywhere else.
  useEffect(() => {
    if (!menu) return undefined;
    const close = (e) => {
      if (!e.target.closest?.(".md-menu")) setMenu(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menu]);

  const apply = useCallback(
    (fn) => {
      const el = ref.current;
      if (!el) return;
      const result = fn(el.value, el.selectionStart, el.selectionEnd);
      if (!result || result.value.length > maxLength) return;
      onChange(result.value);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(result.start, result.end);
      });
    },
    [onChange, maxLength]
  );

  const inlineCode = () =>
    apply((v, s, e) => (v.slice(s, e).includes("\n") ? wrap(v, s, e, "```\n", "\n```", "code") : wrap(v, s, e, "`", "`", "code")));
  const directive = (name, attr) => {
    setMenu(null);
    apply((v, s, e) => {
      const label = v.slice(s, e) || "text";
      const text = `:font[${label}]{${attr}}`;
      return { value: v.slice(0, s) + text + v.slice(e), start: s + 6, end: s + 6 + label.length };
    });
  };
  const container = (name) => {
    setMenu(null);
    apply((v, s, e) => {
      const body = v.slice(s, e) || (name === "center" || name === "right" ? "Aligned text" : "Your note here");
      const open = `:::${name}\n`;
      return insertBlock(v, s, e, `${open}${body}\n:::`, open.length, open.length + body.length);
    });
  };

  const upload = async (file) => {
    if (!onUploadImage) return;
    setError("");
    setBusy(true);
    try {
      const id = await onUploadImage(file);
      const alt = (file.name || "image").replace(/\.[^.]+$/, "").replace(/[[\]]/g, "");
      apply((v, s, e) => insertText(v, s, e, `![${alt}](rift-image:${id})`));
      setBar(null);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const imageFrom = (files) => Array.from(files || []).find((f) => f.type.startsWith("image/"));

  const submitBar = (e) => {
    e.preventDefault();
    if (!bar) return;
    const url = bar.value.trim();
    if (!url) return;
    setError("");
    if (bar.kind === "video") {
      if (!youtubeId(url)) {
        setError("That doesn't look like a YouTube link.");
        return;
      }
      apply((v, s, en) => insertBlock(v, s, en, url));
    } else {
      const full = /^(https?:\/\/|\/|#|mailto:)/i.test(url) ? url : `https://${url}`;
      if (bar.kind === "image") apply((v, s, en) => insertText(v, s, en, `![](${full})`));
      else apply((v, s, en) => link(v, s, en, full));
    }
    setBar(null);
  };

  const onKeyDown = (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "b") {
      e.preventDefault();
      apply((v, s, en) => wrap(v, s, en, "**"));
    } else if (mod && e.key.toLowerCase() === "i") {
      e.preventDefault();
      apply((v, s, en) => wrap(v, s, en, "_"));
    } else if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setBar({ kind: "link", value: "" });
    } else if (e.key === "Enter" && !e.shiftKey && !mod && !e.nativeEvent.isComposing) {
      const el = e.currentTarget;
      const next = continueList(el.value, el.selectionStart, el.selectionEnd);
      if (next) {
        e.preventDefault();
        apply(() => next);
      }
    }
  };

  const open = (name) => setMenu((m) => (m === name ? null : name));

  return (
    <div className="md-editor">
      <div className="md-toolbar" role="toolbar" aria-label="Formatting">
        <Btn label="Heading 1" onClick={() => apply((v, s, e) => heading(v, s, e, 1))}>H<sub>1</sub></Btn>
        <Btn label="Heading 2" onClick={() => apply((v, s, e) => heading(v, s, e, 2))}>H<sub>2</sub></Btn>
        <Btn label="Heading 3" onClick={() => apply((v, s, e) => heading(v, s, e, 3))}>H<sub>3</sub></Btn>
        {SEP}
        <Btn label="Bold (Ctrl+B)" onClick={() => apply((v, s, e) => wrap(v, s, e, "**"))}><b>B</b></Btn>
        <Btn label="Italic (Ctrl+I)" onClick={() => apply((v, s, e) => wrap(v, s, e, "_"))}><i>I</i></Btn>
        <Btn label="Strikethrough" onClick={() => apply((v, s, e) => wrap(v, s, e, "~~"))}><s>S</s></Btn>
        <Btn label="Code" onClick={inlineCode}><Icon name="code" /></Btn>
        <Btn label="Spoiler" onClick={() => apply((v, s, e) => wrap(v, s, e, "||", "||", "spoiler"))}><Icon name="spoiler" /></Btn>
        {SEP}
        <Btn label="Bulleted list" onClick={() => apply((v, s, e) => prefixLines(v, s, e, "ul"))}><Icon name="ul" /></Btn>
        <Btn label="Numbered list" onClick={() => apply((v, s, e) => prefixLines(v, s, e, "ol"))}><Icon name="ol" /></Btn>
        <Btn label="Quote" onClick={() => apply((v, s, e) => prefixLines(v, s, e, "quote"))}><Icon name="quote" /></Btn>
        {SEP}
        <Btn label="Link (Ctrl+K)" active={bar?.kind === "link"} onClick={() => setBar(bar?.kind === "link" ? null : { kind: "link", value: "" })}><Icon name="link" /></Btn>
        <Btn label="Image" active={bar?.kind === "image"} onClick={() => setBar(bar?.kind === "image" ? null : { kind: "image", value: "" })}><Icon name="image" /></Btn>
        <Btn label="YouTube video" active={bar?.kind === "video"} onClick={() => setBar(bar?.kind === "video" ? null : { kind: "video", value: "" })}><Icon name="video" /></Btn>
        {SEP}
        <span className="md-menu">
          <Btn label="Font and size" active={menu === "font"} onClick={() => open("font")}><Icon name="font" /></Btn>
          {menu === "font" && (
            <div className="md-dropdown" role="menu">
              <p className="md-dropdown-title">Font</p>
              {FONT_FAMILIES.map((f) => (
                <button key={f} type="button" role="menuitem" className={`f-${f}`} onClick={() => directive("font", `family=${f}`)}>{FONT_LABELS[f]}</button>
              ))}
              <p className="md-dropdown-title">Size</p>
              {FONT_SIZES.map((s) => (
                <button key={s} type="button" role="menuitem" onClick={() => directive("font", `size=${s}`)}>{SIZE_LABELS[s]}</button>
              ))}
            </div>
          )}
        </span>
        <span className="md-menu">
          <Btn label="Text color" active={menu === "color"} onClick={() => open("color")}><Icon name="color" /></Btn>
          {menu === "color" && (
            <div className="md-dropdown md-swatches" role="menu">
              {FONT_COLORS.map((c) => (
                <button key={c} type="button" role="menuitem" aria-label={titleCase(c)} title={titleCase(c)} className={`md-swatch c-bg-${c}`} onClick={() => directive("font", `color=${c}`)} />
              ))}
            </div>
          )}
        </span>
        <span className="md-menu">
          <Btn label="Align" active={menu === "align"} onClick={() => open("align")}><Icon name="align" /></Btn>
          {menu === "align" && (
            <div className="md-dropdown" role="menu">
              <button type="button" role="menuitem" onClick={() => container("center")}>Center</button>
              <button type="button" role="menuitem" onClick={() => container("right")}>Right</button>
            </div>
          )}
        </span>
        <span className="md-menu">
          <Btn label="Callout box" active={menu === "callout"} onClick={() => open("callout")}><Icon name="callout" /></Btn>
          {menu === "callout" && (
            <div className="md-dropdown" role="menu">
              {Object.entries(CALLOUT_LABELS).map(([k, label]) => (
                <button key={k} type="button" role="menuitem" onClick={() => container(k)}>{label}</button>
              ))}
            </div>
          )}
        </span>
        <Btn label="Divider" onClick={() => apply((v, s, e) => insertBlock(v, s, e, "---"))}><Icon name="divider" /></Btn>

        <label className="md-preview-switch">
          <input type="checkbox" role="switch" checked={preview} onChange={(e) => setPreview(e.target.checked)} />
          <span className="md-switch-track" aria-hidden="true" />
          Preview
        </label>
      </div>

      {bar && !preview && (
        <form className="md-bar" onSubmit={submitBar}>
          {bar.kind === "image" && onUploadImage && (
            <>
              <button type="button" className="btn btn-glass btn-sm" disabled={busy} onClick={() => fileRef.current?.click()}>
                {busy ? "Uploading…" : "Upload image"}
              </button>
              <span className="md-bar-or">or</span>
            </>
          )}
          <input
            autoFocus
            className="md-input"
            type="text"
            value={bar.value}
            onChange={(e) => setBar({ ...bar, value: e.target.value })}
            placeholder={bar.kind === "video" ? "Paste a YouTube link" : bar.kind === "image" ? "Paste an image address" : "Paste a link address"}
            aria-label={bar.kind === "video" ? "YouTube link" : bar.kind === "image" ? "Image address" : "Link address"}
          />
          <button type="submit" className="btn btn-primary btn-sm">Insert</button>
          <button type="button" className="btn btn-glass btn-sm" onClick={() => setBar(null)}>Cancel</button>
        </form>
      )}
      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) upload(file);
        }}
      />
      {error && <p className="md-error" role="alert">{error}</p>}

      {preview ? (
        <div className="md-preview" style={{ minHeight }}>
          {value.trim() ? <Markdown source={value} /> : <p className="muted">Nothing to preview yet.</p>}
        </div>
      ) : (
        <textarea
          ref={ref}
          className="md-textarea"
          style={{ minHeight }}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          spellCheck
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={(e) => {
            const file = imageFrom(e.clipboardData?.files);
            if (file && onUploadImage) {
              e.preventDefault();
              upload(file);
            }
          }}
          onDrop={(e) => {
            const file = imageFrom(e.dataTransfer?.files);
            if (file && onUploadImage) {
              e.preventDefault();
              upload(file);
            }
          }}
        />
      )}

      <div className="md-footer">
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>{" "}
          This editor supports{" "}
          <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer">Markdown formatting</a>.
        </span>
        <span className="md-count">{value.length.toLocaleString()} / {maxLength.toLocaleString()}</span>
      </div>
      <details className="md-help">
        <summary>Rift extras</summary>
        <ul>
          <li><code>||spoiler||</code> hides text until clicked</li>
          <li><code>:font[text]&#123;family=serif size=lg color=cyan&#125;</code> fonts, sizes and colors</li>
          <li><code>:::center</code> … <code>:::</code> aligns a block; <code>:::note</code>, <code>:::tip</code>, <code>:::warning</code>, <code>:::danger</code> make callouts</li>
          <li>A YouTube link on its own line becomes a video player</li>
          <li>Paste or drop an image to upload it</li>
        </ul>
      </details>
    </div>
  );
}
