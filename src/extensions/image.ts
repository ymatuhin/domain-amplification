import type { HTMLElementExtended, MiddlewareParams } from ".";
import { checkBackImagePresence } from "../color/check-back-image-presence";
import { logger } from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getSelector } from "../dom/get-selector";
import { addRule, makeRule, mediaFilter } from "../styles";
import { createBitmap, createWorker } from "../worker";

const log = logger("ext:image");

export default async function (params: MiddlewareParams) {
  const { status, element, isDocument, isIgnored, inverted } = params;

  if (status === "stop") return params;
  if (inverted) return params;
  if (!element || !element.isConnected) return params;
  if (isDocument || isIgnored) return params;
  if (checkInsideInverted(element)) return params;

  const styles = getComputedStyle(element);
  const hasImage = checkBackImagePresence(styles);
  const isImg = element instanceof HTMLImageElement;
  if (!hasImage && !isImg) return params;

  const newInverted = await handleElement(element, styles);

  return { ...params, inverted: newInverted };
}

async function handleElement(
  element: HTMLElementExtended,
  styles: CSSStyleDeclaration,
) {
  const isImage = element instanceof HTMLImageElement;
  const src = isImage
    ? element.getAttribute("src")
    : styles.backgroundImage.slice(5, -2);

  let isColorful;

  try {
    const worker = createWorker();
    isColorful = await checkIsColorful(worker, src!);
  } catch (error) {
    log("error", { error });
  }

  if (isColorful === true || (isColorful === undefined && isImage)) {
    const selector = getSelector(element);
    const rule = makeRule(`${selector} { ${mediaFilter} }`);
    log("addRule", { isColorful, src, element, rule });
    addRule(rule);
    element.__sdm_inverted = true;
    element.__sdm_rule = rule;
  }

  return isColorful;
}

// simple cache
const map = new Map();
function checkIsColorful(worker: Worker, src: string) {
  if (map.has(src)) return Promise.resolve(map.get(src));

  return new Promise(async (res) => {
    try {
      const bitmap = await createBitmap(src);
      worker.postMessage({ bitmap, src });
      const onMessage = ({ data }: { data: any }) => {
        map.set(data.src, data.colorful);
        if (data.src === src) {
          res(data.colorful);
          worker.removeEventListener("message", onMessage);
        }
      };
      worker.addEventListener("message", onMessage);
    } catch (error) {
      log("error", { src, error });
      map.set(src, undefined);
      return res(undefined);
    }
  });
}
