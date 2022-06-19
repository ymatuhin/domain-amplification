import { getLightnessStatus } from "./lightness";

export function checkDocumentIsLight(body: HTMLElement) {
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(body);
  const htmlLightness = getLightnessStatus(htmlStyles.background);
  const bodyLightness = getLightnessStatus(bodyStyles.background);
  if (bodyLightness) return bodyLightness === "light";
  else if (htmlLightness) return htmlLightness === "light";
  return true;
}
