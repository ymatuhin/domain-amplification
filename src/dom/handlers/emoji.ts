import { attrs } from "../../config";

const emojiRx = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

export default function handleEmoji(element: HTMLElement) {
  if (element.tagName === "HTML" || element.tagName === "BODY") return;
  const nodes = Array.from(element.childNodes);
  nodes.forEach((node) => {
    if (node instanceof HTMLElement) return handleEmoji(node);
    if (!(node instanceof Text)) return;
    if (!element || element.hasAttribute("data-sdm-emoji")) return;

    const match = (node.textContent ?? "").match(emojiRx) ?? [];
    const hasEmoji = match.length > 0;
    if (!hasEmoji) return;

    const parentHasOnlyOneEmoji =
      match.length === 1 && element.textContent === match[0];

    if (parentHasOnlyOneEmoji) {
      element.setAttribute(attrs.emoji, "");
    } else {
      let html = element.innerHTML;
      [...new Set(match)].forEach((emoji) => {
        html = html.replaceAll(
          emoji,
          `<span ${attrs.emoji}="">${emoji}</span>`,
        );
      });
      element.innerHTML = html;
    }
  });
}
