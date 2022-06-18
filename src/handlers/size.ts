import { hasBackColor } from "../utils/has-back-color";

export default (htmlElement: HTMLElement) => {
  const styles = getComputedStyle(htmlElement);
  if (!hasBackColor(styles)) return;

  const rect = htmlElement.getBoundingClientRect();
  const area = rect.width * rect.height;
  if (!area) return;
  const windowArea = window.outerHeight * window.outerHeight;
  const spacePercent = Math.round((area / windowArea) * 100);

  if (spacePercent < 2) htmlElement.dataset.daSize = "xs";
  else if (spacePercent < 4) htmlElement.dataset.daSize = "sm";
  else if (spacePercent < 12) htmlElement.dataset.daSize = "md";
  else htmlElement.dataset.daSize = "lg";
};
