import test from "node:test";
import assert from "node:assert/strict";
import { wrap, heading, prefixLines, link, continueList, insertBlock } from "./editorOps.js";

test("wrap adds markers around the selection and keeps it selected", () => {
  const r = wrap("make this bold", 5, 9, "**");
  assert.equal(r.value, "make **this** bold");
  assert.equal(r.value.slice(r.start, r.end), "this");
});

test("wrap toggles off when the selection is already wrapped", () => {
  const r = wrap("make **this** bold", 7, 11, "**");
  assert.equal(r.value, "make this bold");
});

test("wrap with no selection inserts a selected placeholder", () => {
  const r = wrap("", 0, 0, "_", "_", "italic");
  assert.equal(r.value, "_italic_");
  assert.equal(r.value.slice(r.start, r.end), "italic");
});

test("heading sets, switches and removes levels", () => {
  assert.equal(heading("Title", 0, 0, 2).value, "## Title");
  assert.equal(heading("## Title", 0, 0, 3).value, "### Title");
  assert.equal(heading("## Title", 0, 0, 2).value, "Title");
});

test("lists number lines and toggle off", () => {
  const ol = prefixLines("a\nb\nc", 0, 5, "ol");
  assert.equal(ol.value, "1. a\n2. b\n3. c");
  assert.equal(prefixLines(ol.value, 0, ol.value.length, "ol").value, "a\nb\nc");
  assert.equal(prefixLines("a\nb", 0, 3, "quote").value, "> a\n> b");
});

test("only the selected lines change", () => {
  assert.equal(prefixLines("one\ntwo\nthree", 4, 7, "ul").value, "one\n- two\nthree");
});

test("link uses the selection as its label", () => {
  const r = link("see docs here", 4, 8, "https://rift.cool");
  assert.equal(r.value, "see [docs](https://rift.cool) here");
});

test("Enter continues bullets and numbers, and ends an empty item", () => {
  assert.equal(continueList("- one", 5, 5).value, "- one\n- ");
  assert.equal(continueList("2. two", 6, 6).value, "2. two\n3. ");
  assert.equal(continueList("- one\n- ", 8, 8).value, "- one\n");
  assert.equal(continueList("plain text", 10, 10), null);
});

test("insertBlock puts blocks on their own lines", () => {
  const r = insertBlock("intro", 5, 5, ":::note\ntext\n:::");
  assert.equal(r.value, "intro\n\n:::note\ntext\n:::");
});
