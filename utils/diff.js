import { JSDOM } from "jsdom";

export function diffHTML(oldHTML, newHTML) {
  const oldDom = new JSDOM(oldHTML);
  const newDom = new JSDOM(newHTML);

  const oldText = oldDom.window.document.body.textContent || "";
  const newText = newDom.window.document.body.textContent || "";

  if (oldText === newText) return [];

  // Simple diff example
  return [`Content changed: old length ${oldText.length}, new length ${newText.length}`];
}
