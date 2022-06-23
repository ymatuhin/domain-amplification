import { getLightnessStatus } from "./lightness";

export function checkDocumentIsLight() {
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(document.body);
  const htmlLightness = getLightnessStatus(htmlStyles.background);
  const bodyLightness = getLightnessStatus(bodyStyles.background);
  if (bodyLightness) return bodyLightness === "light";
  else if (htmlLightness) return htmlLightness === "light";
  return true;
}
