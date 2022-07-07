import type { HTMLElementExtended, MiddlewareParams } from ".";
import {
  invertedPropName,
  logger,
  mediaFilter,
  rulesPropName,
} from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getSelector } from "../dom/get-selector";
import { Sheet } from "../utils";

const log = logger("middleware:emoji");
const sheet = new Sheet("emoji");
const rule = sheet.makeRule(`.sdm-emoji { ${mediaFilter} }`);

export default function (params: MiddlewareParams) {
  const { status, element, isDocument, isEmbedded, isInverted } = params;

  switch (status) {
    case "start":
      log("start");
      sheet.addRule(rule);
      break;
    case "update":
      if (!element || isDocument || isEmbedded || isInverted) break;
      if (checkInsideInverted(element)) break;
      if (element.isConnected) {
        const ignored = handleElement(element);
        return { ...params, isIgnored: ignored };
      } else {
        element[invertedPropName] = undefined;
        element[rulesPropName]?.forEach((rule) => sheet.removeRule(rule));
      }
      break;
    case "stop":
      sheet.clear();
      break;
  }

  return params;
}

const emojiRx = /(\p{Emoji}|\p{Extended_Pictographic})/gu;
const allEmojiStuffRx =
  /(\p{Emoji}|\p{Emoji_Modifier}|\p{Emoji_Component}|\p{Extended_Pictographic})/gu;

function handleElement(element: HTMLElementExtended) {
  const nodes = Array.from(element.childNodes);
  let newInverted = false;
  nodes.forEach((node) => {
    if (!(node instanceof Text)) return;

    const match = node.textContent?.match(emojiRx) ?? [];
    const hasEmoji = match.length > 0;

    if (!hasEmoji || !element.textContent) return;
    const parentHasOnlyEmoji =
      element.textContent.replaceAll(allEmojiStuffRx, "").replaceAll(/\s/gu, "")
        .length === 0;

    if (parentHasOnlyEmoji) {
      log("has only emoji", { node });
      newInverted = true;
      const selector = getSelector(element);
      const rule = sheet.makeRule(`${selector} { ${mediaFilter} }`);
      sheet.addRule(rule);
      element[invertedPropName] = true;
      element[rulesPropName]?.push(rule);
    } else {
      log("has not only emoji", { node });
      let html = element.innerHTML;
      [...new Set(match)].forEach((emoji) => {
        html = html.replaceAll(
          emoji,
          `<span class="sdm-emoji">${emoji}</span>`,
        );
      });
      element.innerHTML = html;
    }
  });

  return newInverted;
}
