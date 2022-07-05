import { MiddlewareParams } from ".";
import { rgbaToObject } from "../color";
import { logger } from "../config";
import { waitForBody } from "../dom";
import { addRule, makeRule, removeRule } from "../styles";
import { pause } from "./load-styles";

const log = logger("ext:document-colors");
const ruleHtmlBg = makeRule("html { background: white; }");
const ruleHtmlColor = makeRule("html { color: black; }");
let ruleHtmlBgAsBody = "";

export default function (params: MiddlewareParams) {
  const { status, isDocument } = params;

  if (status === "start" || isDocument) apply();

  return params;
}

async function apply() {
  log("apply");
  if (!document.body) await waitForBody();

  cleanUp();
  const resume = pause();
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(document.body);
  const htmlHasBgColor = rgbaToObject(htmlStyles.backgroundColor).a > 0;
  const bodyHasBgColor = rgbaToObject(bodyStyles.backgroundColor).a > 0;

  if (!htmlHasBgColor) {
    if (bodyHasBgColor) {
      const ruleTemplate = `html { background: ${bodyStyles.backgroundColor}; }`;
      ruleHtmlBgAsBody = makeRule(ruleTemplate);
      addRule(ruleHtmlBgAsBody);
    } else {
      addRule(ruleHtmlBg);
    }
  }

  const htmlSystemColor =
    htmlStyles.color === "rgb(0, 0, 0)" ||
    htmlStyles.color === "rgb(255, 255, 255)";
  if (htmlSystemColor) addRule(ruleHtmlColor);
  resume();
}

function cleanUp() {
  removeRule(ruleHtmlBg);
  removeRule(ruleHtmlColor);
  if (ruleHtmlBgAsBody) removeRule(ruleHtmlBgAsBody);
}
