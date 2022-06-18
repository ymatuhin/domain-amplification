const emojiRx = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

export default (htmlElement: HTMLElement) => {
  const nodes = Array.from(htmlElement.childNodes);
  nodes.forEach((node) => {
    if (!(node instanceof Text)) return;

    const hasEmoji = emojiRx.test(node.textContent ?? "");
    if (!hasEmoji) return;

    if (!htmlElement || htmlElement.hasAttribute("data-da-emoji")) return;
    const parentHasSameText = htmlElement.textContent === node.textContent;

    if (parentHasSameText) {
      htmlElement.dataset.daEmoji = "";
    } else {
      let html = htmlElement.innerHTML;
      const emojis = [...new Set(html.match(emojiRx) ?? [])];
      emojis.forEach((emoji) => {
        html = html.replaceAll(emoji, `<span data-da-emoji>${emoji}</span>`);
      });
      htmlElement.innerHTML = html;
    }
  });
};
