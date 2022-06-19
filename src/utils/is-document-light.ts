import { getLightnessStatus } from "./get-lightness-status";

export function checkIsDocumentLight(body: HTMLElement) {
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(body);
  const htmlLightness = getLightnessStatus(htmlStyles);
  const bodyLightness = getLightnessStatus(bodyStyles);
  if (bodyLightness) return bodyLightness === "light";
  else if (htmlLightness) return htmlLightness === "light";
  return true;
}
