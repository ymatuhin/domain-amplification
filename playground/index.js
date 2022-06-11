// ==UserScript==
// @name            Document data url
// @match           <all_urls>
// @run-at          document-start
// @resource        styles index.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// ==/UserScript==

// var elements = [...document.querySelectorAll('body *')]
// var getArea = function(element){
//   var rectangle = element.getBoundingClientRect();
//   return rectangle.width * rectangle.height;
// }
// elements.sort((a, b) => getArea(b) - getArea(a))

function init() {
  const myStyles = GM_getResourceText("styles");
  GM_addStyle(myStyles);

  waitForBody(() => {
    sync();
    window.addEventListener("DOMContentLoaded", sync);
    window.addEventListener("load", sync);
  });
}

function sync() {
  syncDataAttributes(shouldApply());
}

function shouldApply() {
  if (!document.body) return false;

  const html = document.documentElement;
  const htmlStyles = window.getComputedStyle(html);
  const bodyStyles = window.getComputedStyle(document.body);

  const bgLight =
    getLightnessOfRgba(bodyStyles.backgroundColor) ??
    getLightnessOfRgba(htmlStyles.backgroundColor) ??
    1;
  const colorLight =
    getLightnessOfRgba(bodyStyles.color) ??
    getLightnessOfRgba(htmlStyles.color) ??
    0;

  console.info(`🔥 info`, {
    htmlBg: htmlStyles.backgroundColor,
    bodyBg: bodyStyles.backgroundColor,
    htmlColor: htmlStyles.color,
    bodyColor: bodyStyles.color,
    bgLight,
    colorLight,
  });

  return bgLight > 0.55 && colorLight < 0.45;
}

function syncDataAttributes(shouldApply) {
  document.documentElement.dataset.pathname = location.pathname;
  document.documentElement.dataset.url = location.href;
  document.documentElement.dataset.host = location.hostname;
  document.documentElement.dataset[
    shouldApply ? "darkModeOn" : "darkModeOff"
  ] = "";
}

function getLightnessOfRgba(rgbString) {
  const rgbIntArray = rgbString
    .replace(/ /g, "")
    .replace(/rgba?/g, "")
    .replace(/[()]/g, "")
    .split(",")
    .map((e) => parseInt(e));

  const rgb = rgbIntArray.slice(0, 3);
  const a = rgbIntArray[3] ?? 1;

  if (a === 0) return null;

  // Get the highest and lowest out of red green and blue
  const highest = Math.max(...rgb);
  const lowest = Math.min(...rgb);
  const avg = (highest + lowest) / 2 / 255;
  const rounded = Math.round(avg * a * 100) / 100;

  // Return the average divided by 255
  return rounded;
}

function waitForBody(callback) {
  if (document.body) callback();
  else setTimeout(() => waitForBody(callback), 0);
}

init();
