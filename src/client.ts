import { Status } from "./status";
import { getBgLightnessStatus, rgbaAsArray } from "./colors";
import { bodyWaiter } from "./body-waiter";
import { get, set } from "./chrome-store";
import { isInViewport } from "./in-viewport";
import { isVisible } from "./is-visible";

const CHUNK_SIZE = 32;

Promise.all([get<boolean | null>(), bodyWaiter()]).then(init);

function init([storedStatus]: [boolean | null, void]) {
  const isLight = checkIsDocumentLight(document.body);
  const status = new Status(storedStatus, isLight);

  if (status.value) {
    runExtension(status);
    chrome.runtime.sendMessage(status.value);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message !== "toggle") return;
    status.toggle();
    set(status.value);
    chrome.runtime.sendMessage(status.value);
    runExtension(status);
  });
}

function runExtension(status: Status) {
  document.documentElement.dataset.da = status.value ? "on" : "off";
  setBgAttribute(document.body);

  if (document.readyState !== "loading") handleElements();
  document.addEventListener("readystatechange", handleElements);
}

function handleElements() {
  const selector =
    "body *:not(svg *,script,style,link,template,pre *,[contenteditable] > *)";
  const $all = Array.from(document.querySelectorAll(selector)).filter(
    ($element) => $element instanceof HTMLElement,
  ) as HTMLElement[];
  const $visible = $all.filter(isVisible);
  const $critical = [document.body, ...$visible.filter(isInViewport)];
  const $rest = $visible.filter(($element) => !$critical.includes($element));

  handleElementsQueue($critical, true);
  requestIdleCallback(() => handleElementsQueue($rest, false));
}

function handleElementsQueue($elements: HTMLElement[], critical: boolean) {
  const $current = $elements.splice(0, CHUNK_SIZE);
  if ($current.length === 0) return;

  $current.forEach(handleElement);

  if (critical) handleElementsQueue($elements, critical);
  else requestIdleCallback(() => handleElementsQueue($elements, critical));
}

function handleElement($element: HTMLElement) {
  setElementAttributes($element);
}

// const emojiRx = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
// function wrapEmoji($item: Node) {
//   const found = $item.textContent && emojiRx.test($item.textContent);
//   if (!found) return;

//   const parent = $item.parentElement as HTMLElement;
//   if (!parent || parent.hasAttribute("data-da-emoji")) return;

//   const parentHasSameText = parent.textContent === $item.textContent;
//   if (parentHasSameText) {
//     parent.dataset.daEmoji = "";
//   } else {
//     let html = parent.innerHTML;
//     const emojis = [...new Set(html.match(emojiRx) ?? [])];
//     emojis.forEach((emoji) => {
//       html = html.replaceAll(emoji, `<span data-da-emoji>${emoji}</span>`);
//     });
//     parent.innerHTML = html;
//   }
// }

function checkIsDocumentLight(body: HTMLElement) {
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(body);
  const htmlLightness = getBgLightnessStatus(htmlStyles);
  const bodyLightness = getBgLightnessStatus(bodyStyles);
  if (bodyLightness) return bodyLightness === "light";
  else if (htmlLightness) return htmlLightness === "light";
  return true;
}

function setElementAttributes($element: HTMLElement) {
  const styles = getComputedStyle($element);
  const hasBgColor =
    styles.backgroundColor && rgbaAsArray(styles.backgroundColor).a > 0.8;

  if (!hasBgColor) return;
  setSizeAttribute($element);
  setColorAttribute($element, styles);
}

function setColorAttribute(
  $element: HTMLElement,
  styles = getComputedStyle($element),
) {
  const status = getBgLightnessStatus(styles);
  if (status) $element.dataset.daBgColor = status;
}

function setBgAttribute(body: HTMLElement) {
  const html = document.documentElement;

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

function setSizeAttribute($element: HTMLElement) {
  const rect = $element.getBoundingClientRect();
  const area = rect.width * rect.height;
  if (!area) return;
  const windowArea = window.outerHeight * window.outerHeight;
  const spacePercent = Math.round((area / windowArea) * 100);

  if (spacePercent < 2) $element.dataset.daSize = "xs";
  else if (spacePercent < 4) $element.dataset.daSize = "sm";
  else if (spacePercent < 12) $element.dataset.daSize = "md";
  else $element.dataset.daSize = "lg";
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
