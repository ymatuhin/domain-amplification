import { status } from "./status";
import { rgbaAsArray, rgbToHsl } from "./colors";
import { observeChanges } from "./observe-changes";
import { waitForBody } from "./wait-for-body";

waitForBody(setBgAttribute);
observeChanges(($element: HTMLElement) => {
  setElementAttributes($element);
  // setRootAttributes($element);
});

status.subscribe((currentStatus) => {
  document.documentElement.dataset.da = currentStatus;
});

// function setRootAttributes($element: HTMLElement) {
//   if (!document.body) return;
//   const height = document.body.scrollHeight;

//   const isContainer = $element.clientHeight > height * 0.96;
//   const parentContainer = $element.closest("[data-da-root]") as HTMLElement;

//   if (parentContainer && isContainer) {
//     delete parentContainer.dataset.daRoot;
//   }

//   if (isContainer) {
//     $element.dataset.daRoot = "";
//   }
// }

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
  const { r, g, b } = rgbaAsArray(styles.backgroundColor);
  const { l } = rgbToHsl(r, g, b);
  const type = l > 55 ? "light" : l < 35 ? "dark" : "medium";
  $element.dataset.daBgColor = type;
}

function setSizeAttribute($element: HTMLElement) {
  const rectangle = $element.getBoundingClientRect();
  const area = rectangle.width * rectangle.height;
  if (!area) return;
  const windowArea = window.outerHeight * window.outerHeight;
  const spacePercent = Math.round((area / windowArea) * 100);

  if (spacePercent < 3) $element.dataset.daSize = "xs";
  else if (spacePercent < 9) $element.dataset.daSize = "sm";
  else if (spacePercent < 18) $element.dataset.daSize = "md";
  else $element.dataset.daSize = "lg";
}
