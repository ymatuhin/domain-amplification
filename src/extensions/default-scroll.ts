import { logger } from "../config";
import { makeRule } from "../styles";
import type { MiddlewareParams } from "./index";

const log = logger("ext:default-scroll");
const rule = makeRule(`@layer sdm {
  :root { color-scheme: dark; }
  input, button, textarea, select { color-scheme: light; }
}`);

const sheet = new CSSStyleSheet();
// @ts-ignore
document.adoptedStyleSheets.push(sheet);

export default function (params: MiddlewareParams) {
  const { status, isLight } = params;

  if (isLight) return params;
  if (status === "start") turnOff();
  else if (status === "init" || status === "stop") {
    chrome.storage.sync.get(["darkScroll"], ({ darkScroll }) => {
      if (!darkScroll) return;
      turnOn();
    });
  }

  return params;
}

function turnOn() {
  log("turn on");
  sheet.insertRule(rule);
}

function turnOff() {
  log("turn off");
  // @ts-ignore
  sheet.replaceSync("");
}
