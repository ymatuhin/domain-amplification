import { status, documentLight } from "./status";
import { getBgLightnessStatus, rgbaAsArray } from "./colors";
import { watchAll, isOkElement } from "./watch-all";
import { Queue } from "./queue";

const queue = new Queue();

watchAll(($item: Node) => {
  if ($item instanceof HTMLElement && $item?.tagName === "BODY") {
    passDocumentLightnessToStatus($item);
    setBgAttribute($item);
  }
  if ($item instanceof HTMLElement) setElementAttributes($item as HTMLElement);
  if ($item instanceof Text) queue.addTask(() => wrapEmoji($item));
});

status.subscribe((currentStatus) => {
  document.documentElement.dataset.da = currentStatus;
});

const emojiRx = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
function wrapEmoji($item: Node) {
  const found = $item.textContent && emojiRx.test($item.textContent);
  if (!found) return;

  const parent = $item.parentElement as HTMLElement;
  if (!isOkElement(parent)) return;
  if (parent?.hasAttribute("data-da-emoji")) return;

  const parentHasSameText = parent.textContent === $item.textContent;
  if (parentHasSameText) {
    parent.dataset.daEmoji = "";
  } else {
    let html = parent.innerHTML;
    const emojis = [...new Set(html.match(emojiRx) ?? [])];
    emojis.forEach((emoji) => {
      html = html.replaceAll(emoji, `<span data-da-emoji>${emoji}</span>`);
    });
    parent.innerHTML = html;
  }
}

function setBgAttribute(body: HTMLElement) {
  const html = document.documentElement;

  // delete before adding so they won't
  // affect the final result
  delete html.dataset.daSystemColor;
  delete html.dataset.daSystemBg;

  const isSystemTextHtml = isSystemTextColor(html);
  const isSystemTextBody = isSystemTextColor(body);

  if (isSystemTextHtml && isSystemTextBody) html.dataset.daSystemColor = "both";
  else if (isSystemTextHtml) html.dataset.daSystemColor = "html";
  else if (isSystemTextBody) html.dataset.daSystemColor = "body";
  else html.dataset.daSystemColor = "none";

  const isSystemBgHtml = isSystemBgColor(html);
  const isSystemBgBody = isSystemBgColor(body);

  if (isSystemBgHtml && isSystemBgBody) html.dataset.daSystemBg = "both";
  else if (isSystemBgHtml) html.dataset.daSystemBg = "html";
  else if (isSystemBgBody) html.dataset.daSystemBg = "body";
  else html.dataset.daSystemBg = "none";
}

function passDocumentLightnessToStatus(body: HTMLElement) {
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(body);
  const htmlLightness = getBgLightnessStatus(htmlStyles);
  const bodyLightness = getBgLightnessStatus(bodyStyles);
  if (bodyLightness) documentLight.set(bodyLightness === "light");
  else if (htmlLightness) documentLight.set(htmlLightness === "light");
}

function setElementAttributes($element: HTMLElement) {
  // remove previously added attributes
  delete $element.dataset.daSize;
  delete $element.dataset.daBgColor;

  const styles = getComputedStyle($element);
  const hasBgColor =
    styles.backgroundColor && rgbaAsArray(styles.backgroundColor).a > 0.8;

  if (hasBgColor) {
    const rect = $element.getBoundingClientRect();
    const inViewport = isPartInViewport(rect);
    const method = inViewport ? "addMicroTask" : "addTask";

    queue[method](() => {
      setSizeAttribute($element, rect);
      setColorAttribute($element, styles);
    });
  }
}

function setColorAttribute(
  $element: HTMLElement,
  styles = getComputedStyle($element),
) {
  const status = getBgLightnessStatus(styles);
  if (status) $element.dataset.daBgColor = status;
}

function setSizeAttribute($element: HTMLElement, rect: DOMRect) {
  const area = rect.width * rect.height;
  if (!area) return;
  const windowArea = window.outerHeight * window.outerHeight;
  const spacePercent = Math.round((area / windowArea) * 100);

  if (spacePercent < 2) $element.dataset.daSize = "xs";
  else if (spacePercent < 4) $element.dataset.daSize = "sm";
  else if (spacePercent < 12) $element.dataset.daSize = "md";
  else $element.dataset.daSize = "lg";
}

function isPartInViewport(rect: DOMRect) {
  const vpHeight = window.innerHeight || document.documentElement.clientHeight;
  const vpWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -rect.height &&
    rect.left >= -rect.width &&
    rect.bottom <= vpHeight + rect.height &&
    rect.right <= vpWidth + rect.width
  );
}

function isSystemTextColor($element: HTMLElement) {
  document.documentElement.dataset.daScheme = "light";
  $element.dataset.daScheme = "light";
  const { color: prevColor } = getComputedStyle($element);

  document.documentElement.dataset.daScheme = "dark";
  $element.dataset.daScheme = "dark";
  const { color: nextColor } = getComputedStyle($element);

  delete document.documentElement.dataset.daScheme;
  delete $element.dataset.daScheme;

  return prevColor !== nextColor;
}

function isSystemBgColor($element: HTMLElement) {
  const { backgroundColor } = getComputedStyle($element);
  if (!backgroundColor) return true;
  const { r, g, b, a } = rgbaAsArray(backgroundColor);
  const isCustomColor = r >= 0 && g >= 0 && b >= 0 && a >= 0.8;
  return !isCustomColor;
}
