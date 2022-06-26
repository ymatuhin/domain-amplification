import { addRule, invertFilter, removeRule } from "../../styles";
import { checkInsideInverted } from "../check-inside-inverted";
import { getSelector } from "../get-selector";
import type { HTMLElementExtended } from "./index";

const invertSelector = `img,video,object,embed,iframe,[role=image],[role=img]`;

export function invert(element: HTMLElementExtended) {
  if (!element.matches(invertSelector)) return;
  if (checkInsideInverted(element)) return;

  const selector = getSelector(element);
  if (element.isConnected) {
    addRule(selector, invertFilter + "color-scheme: light");
    element.inverted = true;
  } else {
    removeRule(selector);
  }
}
