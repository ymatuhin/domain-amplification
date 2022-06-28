// @ts-ignore
import rafThrottle from "raf-throttle";
import { locals, logger } from "../config";
import { getRules } from "../styles";
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
  },
  stop() {
    log("stop");
    // @ts-ignore
    sheet.replaceSync("");
  },
  domReady() {
    log("domReady");
    // @ts-ignore
    sheet.replaceSync("");
  },
  handle: rafThrottle(() => {
    const rules = getRules();
    log("handle throttled", { rules });
    localStorage.setItem(locals.styles, rules);
  }),
} as Extension;
