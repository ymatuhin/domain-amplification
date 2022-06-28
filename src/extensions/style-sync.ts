import { locals, logger } from "../config";
import { subscribe } from "../styles";
import type { Extension } from "./index";

const log = logger("style-sync");

const sheet = new CSSStyleSheet();
// @ts-ignore
document.adoptedStyleSheets.push(sheet);

let inited = false;

export default {
  start() {
    if (inited) return;
    const saved = localStorage.getItem(locals.styles) ?? "";
    log("init", { saved });
    // @ts-ignore
    sheet.replaceSync(saved);
    localStorage.removeItem(locals.styles);
    inited = true;
    subscribe((rules: string) => {
      log("subscribe", { rules });
      localStorage.setItem(locals.styles, rules);
    });
  },
  stop() {
    log("stop");
    // @ts-ignore
    sheet.replaceSync("");
  },
  domReady() {
    log("domComplete");
    // @ts-ignore
    sheet.replaceSync("");
  },
} as Extension;
