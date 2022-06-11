import { status } from "./status";
import { waitForBody } from "./wait-for-body";
import { rgbaAsArrayOfString } from "./colors";

const datasetName = "domainAmplification";
const attrName = "domain-amplification";

waitForBody(setBgAttribute);
document.addEventListener("DOMContentLoaded", setRootAttributes);

status.subscribe((currentStatus) => {
  document.documentElement.dataset[datasetName] = currentStatus;
});

function setRootAttributes() {
  const height = document.body.scrollHeight;

  const $items = Array.from(
    document.querySelectorAll(`
    body > *, 
    body > * > *, 
    body > * > * > *,
    body > * > * > * > *,
    body > * > * > * > * > *`),
  ).reverse() as HTMLElement[];

  const bigOnes = $items.filter(($item) => $item.clientHeight > height * 0.9);
  const safeBig = bigOnes.length ? bigOnes : [document.body];
  safeBig.forEach(($item) => {
    console.info(`🔥 $item`, $item);
    if ($item.querySelector(`[data-${attrName}-root`)) return;
    $item.dataset[datasetName + "Root"] = "";
  });
}

function setBgAttribute() {
  const htmlStyle = getComputedStyle(document.documentElement);
  const bodyStyle = getComputedStyle(document.body);

  const htmlBg = rgbaAsArrayOfString(htmlStyle.backgroundColor);
  const bodyBg = rgbaAsArrayOfString(bodyStyle.backgroundColor);

  let bgStatus = "none";
  if (+htmlBg.a > 0.8 && +bodyBg.a > 0.8) bgStatus = "both";
  else if (+htmlBg.a > 0.8) bgStatus = "html";
  else if (+bodyBg.a > 0.8) bgStatus = "body";
  document.documentElement.dataset[datasetName + "Background"] = bgStatus;

  console.info(`🔥 bgStatus`, bgStatus);
}
