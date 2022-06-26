import { addRule, rootFilter } from "../../styles";
import type { HTMLElementExtended } from "./index";

export function rootInvert(element: HTMLElementExtended) {
  if (!(element instanceof HTMLHtmlElement)) return;

  addRule(":root", rootFilter);
  element.inverted = true;
}
