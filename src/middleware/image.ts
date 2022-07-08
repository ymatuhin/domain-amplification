import type { Readable } from "svelte/store";
import { get } from "svelte/store";
import type { HTMLElementExtended, MiddlewareParams } from ".";
import { checkBackImagePresence } from "../color/check-back-image-presence";
import {
  invertedPropName,
  logger,
  revertFilter,
  rulesPropName,
} from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getSelector } from "../dom/get-selector";
import { Sheet } from "../utils";
import { createBitmap, createWorker } from "../worker";

const log = logger("middleware:image");
const sheet = new Sheet("image");
let worker: Worker | void;

try {
  worker = createWorker();
  log("worker", worker);
} catch (error) {
  log("worker error", { error });
}

export default async function (params: MiddlewareParams) {
  const { status, element, isDocument, isEmbedded, isInverted, $isEnabled } =
    params;

  switch (status) {
    case "update":
      if (!element || isDocument || isEmbedded || isInverted) break;
      if (element.isConnected) {
        if (checkInsideInverted(element)) break;
        const inverted = await handleElement(element, $isEnabled);
        return { ...params, inverted };
      } else {
        element[invertedPropName] = undefined;
        element[rulesPropName]?.forEach((rule) => sheet.removeRule(rule));
      }
      break;
    case "stop":
      sheet.clear();
      break;
  }

  return params;
}

async function handleElement(
  element: HTMLElementExtended,
  $isEnabled: Readable<boolean | null>,
) {
  const styles = getComputedStyle(element);
  const hasImage = checkBackImagePresence(styles);
  const isImg = element instanceof HTMLImageElement;
  if (!hasImage && !isImg) return false;

  const isImage = element instanceof HTMLImageElement;
  const src = isImage
    ? element.getAttribute("src")
    : styles.backgroundImage.slice(5, -2);

  let isColorful;
  if (worker) {
    try {
      isColorful = await checkIsColorful(src!);
      log("check is colorful", { isColorful, element });
    } catch (error) {
      log("check is colorful", { error, element });
    }
  }

  if (get($isEnabled) === false) return false;
  if (isColorful === false) return false;

  const selector = getSelector(element);
  const rule = sheet.makeRule(`${selector} { ${revertFilter} }`);
  log("addRule", { isColorful, src, element, rule });
  sheet.addRule(rule);
  element[invertedPropName] = true;
  element[rulesPropName]?.push(rule);

  return isColorful;
}

// simple cache
const map = new Map();
function checkIsColorful(src: string) {
  if (map.has(src)) return Promise.resolve(map.get(src));
  if (!worker) return Promise.resolve(undefined);

  return new Promise(async (res) => {
    try {
      const bitmap = await createBitmap(src);
      worker?.postMessage({ bitmap, src });
      const onMessage = ({ data }: { data: any }) => {
        map.set(data.src, data.colorful);
        if (data.src === src) {
          worker?.removeEventListener("message", onMessage);
          res(data.colorful);
        }
      };
      worker?.addEventListener("message", onMessage);
    } catch (error) {
      log("error", { src, error });
      map.set(src, undefined);
      res(undefined);
    }

    setTimeout(() => res(undefined), 10_000);
  });
}
