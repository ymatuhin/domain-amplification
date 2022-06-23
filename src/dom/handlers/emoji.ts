import { attrs } from "../../config";

const emojiRx = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

export default function handleEmoji(htmlElement: HTMLElement) {
  const nodes = Array.from(htmlElement.childNodes);
  nodes.forEach((node) => {
    if (node instanceof HTMLElement) return handleEmoji(node);
    if (!(node instanceof Text)) return;
    if (!htmlElement || htmlElement.hasAttribute("data-sdm-emoji")) return;

    const match = (node.textContent ?? "").match(emojiRx) ?? [];
    const hasEmoji = match.length > 0;
    if (!hasEmoji) return;

    const parentHasOnlyOneEmoji =
      match.length === 1 && htmlElement.textContent === match[0];

    if (parentHasOnlyOneEmoji) {
      htmlElement.setAttribute(attrs.emoji, "");
    } else {
      let html = htmlElement.innerHTML;
      [...new Set(match)].forEach((emoji) => {
        html = html.replaceAll(
          emoji,
          `<span ${attrs.emoji}="">${emoji}</span>`,
        );
      });
      htmlElement.innerHTML = html;
    }
  });
}
