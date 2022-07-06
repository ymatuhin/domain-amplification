import type { MiddlewareParams } from ".";
import { rgbaToObject } from "../color";
import { logger } from "../config";
import { waitForBody } from "../dom";
import { Sheet } from "../utils";

const log = logger("middleware:document-colors");
const sheet = new Sheet("document-colors");
const ruleHtmlBg = sheet.makeRule("html { background: white; }");
const ruleHtmlColor = sheet.makeRule("html { color: black; }");

export default function (params: MiddlewareParams) {
  const { status, isDocument } = params;

  switch (status) {
    case "start":
      log(status);
      apply();
      break;
    case "update":
      if (isDocument) {
        log(status);
        apply();
      }
      break;
    case "stop":
      log(status);
      sheet.clear();
      break;
  }

  return params;
}

async function apply() {
  if (!document.body) await waitForBody();

  sheet.pause();

  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(document.body);
  const htmlHasBgColor = rgbaToObject(htmlStyles.backgroundColor).a > 0;
  const bodyHasBgColor = rgbaToObject(bodyStyles.backgroundColor).a > 0;

  if (!htmlHasBgColor && !bodyHasBgColor) {
    sheet.addRule(ruleHtmlBg);
  } else if (!htmlHasBgColor && bodyHasBgColor) {
    const rule = sheet.makeRule(
      `html { background: ${bodyStyles.backgroundColor}; }`,
    );
    sheet.addRule(rule);
  }

  const htmlSystemColor =
    htmlStyles.color === "rgb(0, 0, 0)" ||
    htmlStyles.color === "rgb(255, 255, 255)";
  if (htmlSystemColor) sheet.addRule(ruleHtmlColor);

  sheet.start();
}
