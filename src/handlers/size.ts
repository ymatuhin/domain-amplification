import { checkBackColorPresence } from "../utils/check-back-color-presence";

export default (htmlElement: HTMLElement) => {
  const styles = getComputedStyle(htmlElement);
  if (!checkBackColorPresence(styles)) return;

  const rect = htmlElement.getBoundingClientRect();
  const area = rect.width * rect.height;
  if (!area) return;
  const windowArea = window.outerHeight * window.outerHeight;
  const spacePercent = Math.round((area / windowArea) * 100);

  if (spacePercent < 2) htmlElement.dataset.sdmSize = "xs";
  else if (spacePercent < 4) htmlElement.dataset.sdmSize = "sm";
  else if (spacePercent < 12) htmlElement.dataset.sdmSize = "md";
  else htmlElement.dataset.sdmSize = "lg";
};
