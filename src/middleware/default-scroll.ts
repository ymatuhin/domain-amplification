import { get } from "svelte/store";
import { logger } from "../config";
import { Sheet } from "../utils";
import type { MiddlewareParams } from "./index";

const log = logger("middleware:default-scroll");
const sheet = new Sheet("default-scroll");
const rule = sheet.makeRule(`@layer sdm {
  :root { color-scheme: dark; }
  input, button, textarea, select { color-scheme: light; }
}`);

export default async function (params: MiddlewareParams) {
  const { status, $isLight } = params;

  switch (status) {
    case "stop":
      log(status);
      const isEnabled = await isDefaultScrollEnabled();
      const isLight = get($isLight);
      if (isEnabled && !isLight) sheet.addRule(rule);
      break;
    case "start":
      log("clear");
      sheet.clear();
      break;
  }
  return params;
}

function isDefaultScrollEnabled() {
  return new Promise((res) => {
    chrome.storage.sync.get(["darkScroll"], ({ darkScroll }) => {
      res(darkScroll);
    });
  });
}
