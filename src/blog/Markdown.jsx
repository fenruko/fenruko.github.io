import { memo } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { visit } from "unist-util-visit";
import { imageUrl } from "./config";

/* What posts can do beyond plain Markdown (raw HTML stays disabled):
     ||spoiler||                          click-to-reveal text
     :font[text]{family=serif size=lg color=cyan}
     :::center / :::right                 aligned blocks, closed with :::
     :::note / tip / warning / danger     callout boxes, closed with :::
     ![alt](rift-image:12)                an image uploaded through the editor
     a YouTube link on its own line, or ![](youtube-url), becomes a player
   Everything maps to fixed class names, so there's no style injection. */

export const FONT_FAMILIES = ["sans", "serif", "mono", "display", "hand"];
export const FONT_SIZES = ["sm", "lg", "xl", "xxl"];
export const FONT_COLORS = ["cyan", "blue", "purple", "pink", "red", "orange", "yellow", "green", "gray", "white"];
const ALIGNS = ["center", "right"];
const CALLOUTS = ["note", "tip", "warning", "danger"];

const classNames = {
  span: ["spoiler", ...FONT_FAMILIES.map((f) => `f-${f}`), ...FONT_SIZES.map((s) => `s-${s}`), ...FONT_COLORS.map((c) => `c-${c}`)],
  div: [...ALIGNS.map((a) => `align-${a}`), "callout", ...CALLOUTS.map((c) => `callout-${c}`)],
};

const schema = {
  ...defaultSchema,
  protocols: { ...defaultSchema.protocols, src: [...(defaultSchema.protocols?.src || ["http", "https"]), "rift-image"] },
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span || []), ["className", ...classNames.span]],
    div: [...(defaultSchema.attributes?.div || []), ["className", ...classNames.div]],
  },
};

function plainText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value;
  return (node.children || []).map(plainText).join("");
}

function remarkRift() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "textDirective" && node.name === "font") {
        const a = node.attributes || {};
        const cls = [];
        if (FONT_FAMILIES.includes(a.family)) cls.push(`f-${a.family}`);
        if (FONT_SIZES.includes(a.size)) cls.push(`s-${a.size}`);
        if (FONT_COLORS.includes(a.color)) cls.push(`c-${a.color}`);
        node.data = { hName: "span", hProperties: { className: cls } };
      } else if (node.type === "containerDirective") {
        let cls = [];
        if (ALIGNS.includes(node.name)) cls = [`align-${node.name}`];
        else if (CALLOUTS.includes(node.name)) cls = ["callout", `callout-${node.name}`];
        node.data = { hName: "div", hProperties: { className: cls } };
      } else if (node.type === "textDirective" || node.type === "leafDirective") {
        // Not one of ours (e.g. "Note:foo" or "10:30pm"): put the characters back.
        const inner = plainText(node);
        const prefix = node.type === "leafDirective" ? "::" : ":";
        node.type = "text";
        node.value = `${prefix}${node.name}${inner ? `[${inner}]` : ""}`;
        delete node.children;
      }
    });
    visit(tree, "text", (node, index, parent) => {
      if (!parent || !node.value.includes("||")) return undefined;
      const parts = [];
      let last = 0;
      for (const m of node.value.matchAll(/\|\|([^|\n]+?)\|\|/g)) {
        if (m.index > last) parts.push({ type: "text", value: node.value.slice(last, m.index) });
        parts.push({
          type: "spoiler",
          data: { hName: "span", hProperties: { className: ["spoiler"] } },
          children: [{ type: "text", value: m[1] }],
        });
        last = m.index + m[0].length;
      }
      if (!parts.length) return undefined;
      if (last < node.value.length) parts.push({ type: "text", value: node.value.slice(last) });
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}

export function youtubeId(url) {
  if (typeof url !== "string") return null;
  let u;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  let id = null;
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v");
    else {
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
      if (m) id = m[1];
    }
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

function VideoEmbed({ id }) {
  return (
    <div className="blog-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title="YouTube video"
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

function urlTransform(url) {
  return url.startsWith("rift-image:") ? url : defaultUrlTransform(url);
}

function Spoiler({ className, children }) {
  if (className !== "spoiler") return <span className={className}>{children}</span>;
  return (
    <span
      className="spoiler"
      role="button"
      tabIndex={0}
      onClick={(e) => e.currentTarget.classList.add("revealed")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") e.currentTarget.classList.add("revealed");
      }}
    >
      {children}
    </span>
  );
}

function buildComponents(embeds) {
  return {
    a({ href, children }) {
      const external = /^https?:\/\//i.test(href || "");
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow ugc" } : {})}>
          {children}
        </a>
      );
    },
    img({ src, alt }) {
      if (!src) return null;
      if (embeds) {
        const id = youtubeId(src);
        if (id) return <VideoEmbed id={id} />;
      }
      const resolved = src.startsWith("rift-image:") ? imageUrl(src.slice("rift-image:".length)) : src;
      return <img src={resolved} alt={alt || ""} loading="lazy" decoding="async" className="blog-img" />;
    },
    p({ node, children }) {
      // A paragraph that is only a YouTube link / image becomes a player, not a <p>.
      const kids = (node?.children || []).filter((c) => !(c.type === "text" && !c.value.trim()));
      if (embeds && kids.length === 1) {
        const only = kids[0];
        const target = only.tagName === "a" ? only.properties?.href : only.tagName === "img" ? only.properties?.src : null;
        const id = youtubeId(target);
        if (id) return <VideoEmbed id={id} />;
      }
      return <p>{children}</p>;
    },
    span({ className, children }) {
      const cls = Array.isArray(className) ? className.join(" ") : className;
      return <Spoiler className={cls}>{children}</Spoiler>;
    },
    table({ children }) {
      return (
        <div className="blog-table">
          <table>{children}</table>
        </div>
      );
    },
  };
}

const COMMENT_BLOCKED = ["img", "h1", "h2", "h3", "h4", "h5", "h6", "iframe", "table"];

function Markdown({ source, variant = "post" }) {
  const isPost = variant === "post";
  return (
    <div className={`blog-md${isPost ? "" : " blog-md-comment"}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkRift]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={buildComponents(isPost)}
        urlTransform={urlTransform}
        {...(isPost ? {} : { disallowedElements: COMMENT_BLOCKED, unwrapDisallowed: true })}
      >
        {source || ""}
      </ReactMarkdown>
    </div>
  );
}


export default memo(Markdown);
