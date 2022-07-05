import { checkInsideIframe } from "shared/utils/check-inside-iframe";
import { locals, logger } from "../config";
import type { MiddlewareParams } from "./index";

const log = logger("ext:load-styles");

const sheet = new CSSStyleSheet();
// @ts-ignore
document.adoptedStyleSheets.push(sheet);

export default function (params: MiddlewareParams) {
  const { status } = params;

  if (checkInsideIframe()) return params;

  if (status === "init") {
    const saved = localStorage.getItem(locals.styles) ?? "";
    log("init", { saved });
    // @ts-ignore
    sheet.replaceSync(saved);
    localStorage.removeItem(locals.styles);
  } else if (status === "stop") {
    // @ts-ignore
    sheet.replaceSync("");
  }

  return params;
}

export const pause = () => {
  // @ts-ignore
  document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
    (item: any) => item !== sheet,
  );

  return () => {
    // @ts-ignore
    document.adoptedStyleSheets.push(sheet);
  };
};
