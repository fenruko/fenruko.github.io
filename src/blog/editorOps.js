/* Pure text operations behind the editor toolbar. Each takes the textarea's
   value plus selection and returns { value, start, end } (the new value and
   the selection to restore). Kept free of React/DOM so they're easy to test. */

export function wrap(value, start, end, before, after = before, placeholder = "text") {
  const selected = value.slice(start, end);
  const outside = value.slice(start - before.length, start) === before && value.slice(end, end + after.length) === after;
  if (outside) {
    return {
      value: value.slice(0, start - before.length) + selected + value.slice(end + after.length),
      start: start - before.length,
      end: end - before.length,
    };
  }
  const inner = selected || placeholder;
  return {
    value: value.slice(0, start) + before + inner + after + value.slice(end),
    start: start + before.length,
    end: start + before.length + inner.length,
  };
}

function lineRange(value, start, end) {
  const from = value.lastIndexOf("\n", start - 1) + 1;
  // A selection that ends right after a newline shouldn't drag in the next line.
  const stop = end > start && value[end - 1] === "\n" ? end - 1 : end;
  let to = value.indexOf("\n", stop);
  if (to === -1) to = value.length;
  return [from, to];
}

function mapLines(value, start, end, fn) {
  const [from, to] = lineRange(value, start, end);
  const lines = value.slice(from, to).split("\n").map(fn);
  const block = lines.join("\n");
  return { value: value.slice(0, from) + block + value.slice(to), start: from, end: from + block.length };
}

export function heading(value, start, end, level) {
  const mark = "#".repeat(level) + " ";
  const [from, to] = lineRange(value, start, end);
  const lines = value.slice(from, to).split("\n");
  const allSame = lines.every((l) => l.startsWith(mark));
  return mapLines(value, start, end, (line) => {
    const bare = line.replace(/^#{1,6}\s+/, "");
    return allSame ? bare : mark + bare;
  });
}

const PREFIXES = { ul: /^[-*+]\s+/, ol: /^\d+\.\s+/, quote: /^>\s?/ };

export function prefixLines(value, start, end, kind) {
  const [from, to] = lineRange(value, start, end);
  const lines = value.slice(from, to).split("\n");
  const pattern = PREFIXES[kind];
  const allHave = lines.every((l) => pattern.test(l));
  let n = 0;
  return mapLines(value, start, end, (line) => {
    if (allHave) return line.replace(pattern, "");
    n += 1;
    const bare = line.replace(pattern, "");
    if (kind === "ul") return `- ${bare}`;
    if (kind === "ol") return `${n}. ${bare}`;
    return `> ${bare}`;
  });
}

export function insertText(value, start, end, text) {
  return { value: value.slice(0, start) + text + value.slice(end), start: start + text.length, end: start + text.length };
}

/** Insert a block (callout, divider...) on its own lines. */
export function insertBlock(value, start, end, block, selectFrom, selectTo) {
  const before = value.slice(0, start);
  const after = value.slice(end);
  const lead = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
  const tail = after && !after.startsWith("\n") ? "\n\n" : after ? "\n" : "";
  const text = lead + block + tail;
  const base = start + lead.length;
  return {
    value: before + text + after,
    start: selectFrom == null ? base + block.length : base + selectFrom,
    end: selectTo == null ? base + block.length : base + selectTo,
  };
}

export function link(value, start, end, url) {
  const label = value.slice(start, end) || "link text";
  const text = `[${label}](${url})`;
  return {
    value: value.slice(0, start) + text + value.slice(end),
    start: start + 1,
    end: start + 1 + label.length,
  };
}

/** Enter inside a list: continue it, or end it when the item is empty. Returns null when not in a list. */
export function continueList(value, start, end) {
  if (start !== end) return null;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const m = /^(\s*)(?:([-*+])|(\d+)\.)\s(.*)$/.exec(value.slice(lineStart, start));
  if (!m) return null;
  const [, indent, bullet, num, rest] = m;
  if (rest === "") {
    return { value: value.slice(0, lineStart) + value.slice(start), start: lineStart, end: lineStart };
  }
  const marker = bullet ? `${bullet} ` : `${Number(num) + 1}. `;
  const text = `\n${indent}${marker}`;
  return { value: value.slice(0, start) + text + value.slice(end), start: start + text.length, end: start + text.length };
}
