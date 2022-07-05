import type { MiddlewareParams } from ".";
import { logger } from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getSelector } from "../dom/get-selector";
import { addRule, makeRule, mediaFilter } from "../styles";
const emojiRx = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

const log = logger("ext:emoji");
let idCount = 0;

export default async function (params: MiddlewareParams) {
  const { status, element, isDocument, isIgnored, inverted } = params;

  if (status === "stop") return params;
  if (inverted) return params;
  if (!element || !element.isConnected) return params;
  if (isDocument || isIgnored) return params;
  if (checkInsideInverted(element)) return params;

  const nodes = Array.from(element.childNodes);
  let newInverted = false;
  nodes.forEach((node) => {
    if (!(node instanceof Text)) return;

    const match = node.textContent?.match(emojiRx) ?? [];
    const hasEmoji = match.length > 0;
    if (!hasEmoji || !element.textContent) return;

    const parentHasOnlyEmoji =
      element.textContent.replaceAll(emojiRx, "").replaceAll(/\W|\D/g, "")
        .length <= 1;

    if (parentHasOnlyEmoji) {
      log("has only emoji", { node });
      newInverted = true;
      const selector = getSelector(element);
      const rule = makeRule(`${selector} { ${mediaFilter} }`);
      addRule(rule);
    } else {
      log("has not only emoji", { node });
      let html = element.innerHTML;
      [...new Set(match)].forEach((emoji) => {
        const id = `sdm-${++idCount}`;
        html = html.replaceAll(emoji, `<span id="${id}">${emoji}</span>`);
      });
      element.innerHTML = html;
    }
  });

  return { ...params, inverted: newInverted };
}
