import { checkBackColorPresence } from "../../color";
import { checkBackImagePresence } from "../../color/check-back-image-presence";
import { attrs } from "../../config";

export default (element: HTMLElement, styles = getComputedStyle(element)) => {
  element.removeAttribute(attrs.size);

  if (!checkBackColorPresence(styles) && !checkBackImagePresence(styles))
    return;

  const rect = element.getBoundingClientRect();
  const area = rect.width * rect.height;
  if (!area) return;
  const windowArea = window.outerHeight * window.outerHeight;
  const spacePercent = Math.round((area / windowArea) * 100);

  if (spacePercent < 2) element.setAttribute(attrs.size, "xs");
  else if (spacePercent < 4) element.setAttribute(attrs.size, "sm");
  else if (spacePercent < 12) element.setAttribute(attrs.size, "md");
  else element.setAttribute(attrs.size, "lg");
};
