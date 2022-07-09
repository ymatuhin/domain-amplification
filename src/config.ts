import { domain } from "shared/logger";

export const logger = domain("🌙 sdm");
export const host = location.hostname.replace("www.", "");
export const chunkSize = 2;

export const rootRule = `:root { filter: invert(0.88) hue-rotate(180deg) !important; }`;
export const revertFilter = `filter: brightness(88%) contrast(120%) saturate(120%) invert(1) hue-rotate(180deg) !important`;
export const invertedPropName = "__sdm_inverted";
export const rulesPropName = "__sdm_rules";

export const classRx = /sdm-\S*/gi;
export const rgbaRx =
  /rgba?\(\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*(,\s*\d+\.?\d*\s*)?\)/gi;

export const elementsSelector =
  ":not(head, script, noscript, style, link, template, pre span, pre code, head *, svg *, object *, embed *)";
export const mediaSelector =
  "img,video,object,embed,[role=image],[role=img],[style*='url(']";

export const locals = {
  enabled: "sdm-enabled",
  isLight: "sdm-is-light",
  styles: "sdm-styles",
};
