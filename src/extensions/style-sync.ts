import { locals, logger } from "../config";
import { subscribe } from "../styles";
import type { Extension } from "./index";

const log = logger("style-sync");

const sheet = new CSSStyleSheet();
// @ts-ignore
document.adoptedStyleSheets.push(sheet);

let inited = false;
let unsubscribe: Function;

export default {
  start() {
    if (inited) return;
    inited = true;
    const saved = localStorage.getItem(locals.styles) ?? "";
    log("init", { saved });
    // @ts-ignore
    sheet.replaceSync(saved);
    localStorage.removeItem(locals.styles);
    unsubscribe = subscribe((rules: string) => {
      log("subscribe", { rules });
      localStorage.setItem(locals.styles, rules);
    });
  },
  domComplete() {
    // @ts-ignore
    sheet.replaceSync("");
  },
  stop() {
    log("stop");
    // @ts-ignore
    sheet.replaceSync("");
    unsubscribe?.();
  },
} as Extension;

export const pause = () => {
  // @ts-ignore
  document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
    (item: any) => item !== sheet,
  );
};
export const resume = () => {
  // @ts-ignore
  document.adoptedStyleSheets.push(sheet);
};
