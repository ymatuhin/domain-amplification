import { logger } from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getSelector } from "../dom/get-selector";
import { addRule, makeRule, mediaFilter } from "../styles";
import type { HTMLElementExtended, MiddlewareParams } from "./index";

const log = logger("ext:embed");

export default function (params: MiddlewareParams) {
  const { element, isDocument, inverted } = params;

  if (inverted) return params;
  if (!element || isDocument) return params;
  if (
    !(element instanceof HTMLVideoElement) &&
    !(element instanceof HTMLEmbedElement) &&
    !(element instanceof HTMLObjectElement)
  )
    return params;

  if (!element.isConnected) return params;
  if (checkInsideInverted(element)) return params;

  const newInverted = handleElement(element);

  return { ...params, inverted: newInverted };
}

function handleElement(element: HTMLElementExtended) {
  const selector = getSelector(element);
  const rule = makeRule(`${selector} { ${mediaFilter} }`);
  log("add rule", { element });
  addRule(rule);
  element.__sdm_inverted = true;
  element.__sdm_rule = rule;
  return true;
}
