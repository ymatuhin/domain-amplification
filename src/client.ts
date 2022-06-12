import { status, documentLight } from "./status";
import { getBgLightnessStatus, rgbaAsArray } from "./colors";
import { observeChanges } from "./observe-changes";
import { waitForBody } from "./wait-for-body";

waitForBody(() => {
  setBgAttribute();
  passDocumentLightnessToStatus();
});
observeChanges(setElementAttributes);

status.subscribe((currentStatus) => {
  document.documentElement.dataset.da = currentStatus;
});

function setBgAttribute() {
  const htmlStyle = getComputedStyle(document.documentElement);
  const bodyStyle = getComputedStyle(document.body);

  const htmlBg = rgbaAsArray(htmlStyle.backgroundColor);
  const bodyBg = rgbaAsArray(bodyStyle.backgroundColor);

  let bgStatus = "none";
  if (htmlBg.a > 0.8 && bodyBg.a > 0.8) bgStatus = "both";
  else if (htmlBg.a > 0.8) bgStatus = "html";
  else if (bodyBg.a > 0.8) bgStatus = "body";
  document.documentElement.dataset.daBackground = bgStatus;
}

function passDocumentLightnessToStatus() {
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(document.body);

  const htmlLightness = getBgLightnessStatus(htmlStyles);
  const bodyLightness = getBgLightnessStatus(bodyStyles);

  if (bodyLightness) documentLight.set(bodyLightness === "light");
  else if (htmlLightness) documentLight.set(htmlLightness === "light");
}

function setElementAttributes($element: HTMLElement) {
  const styles = getComputedStyle($element);
  const hasBgImage = styles.backgroundImage.startsWith("url(");
  const hasBgColor =
    styles.backgroundColor && rgbaAsArray(styles.backgroundColor).a > 0.8;

  if (!hasBgImage && !hasBgColor) return;

  setSizeAttribute($element);
  if (hasBgColor) setColorAttribute($element, styles);
  if (hasBgImage) $element.dataset.daBgImage = "";
}

function setColorAttribute(
  $element: HTMLElement,
  styles = getComputedStyle($element),
) {
  const status = getBgLightnessStatus(styles);
  if (status) $element.dataset.daBgColor = status;
}

function setSizeAttribute($element: HTMLElement) {
  const rectangle = $element.getBoundingClientRect();
  const area = rectangle.width * rectangle.height;
  if (!area) return;
  const windowArea = window.outerHeight * window.outerHeight;
  const spacePercent = Math.round((area / windowArea) * 100);

  if (spacePercent < 2) $element.dataset.daSize = "xs";
  else if (spacePercent < 4) $element.dataset.daSize = "sm";
  else if (spacePercent < 12) $element.dataset.daSize = "md";
  else $element.dataset.daSize = "lg";
}
