import { rgbaToObject } from "../color";
import { logger } from "../config";
import { waitForBody } from "../dom";
import { addRule, removeRule } from "../styles";
import type { Extension } from "./index";

const log = logger("document-colors");
const ruleHtmlBg = "html { background: white; }";
const ruleHtmlColor = "html { color: black; }";

let ruleHtmlBgAsBody = "";

export default {
  async start() {
    log("start");
    await waitForBody();
    reApply();
  },
  stop() {
    removeRule(ruleHtmlBg);
    removeRule(ruleHtmlColor);
    if (ruleHtmlBgAsBody) removeRule(ruleHtmlBgAsBody);
  },
  domReady() {
    reApply();
  },
  handleHtmlBody() {
    this.stop!();
    this.start!();
  },
} as Extension;

function reApply() {
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(document.body);
  const htmlHasBgColor = rgbaToObject(htmlStyles.backgroundColor).a > 0;
  const bodyHasBgColor = rgbaToObject(bodyStyles.backgroundColor).a > 0;

  if (!htmlHasBgColor) {
    if (bodyHasBgColor) {
      ruleHtmlBgAsBody = `html { background: ${bodyStyles.backgroundColor}; }`;
      addRule(ruleHtmlBgAsBody);
    } else {
      addRule(ruleHtmlBg);
    }
  }

  const htmlSystemColor =
    htmlStyles.color === "rgb(0, 0, 0)" ||
    htmlStyles.color === "rgb(255, 255, 255)";
  if (htmlSystemColor) addRule(ruleHtmlColor);
}
