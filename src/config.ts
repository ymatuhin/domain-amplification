import { domain } from "shared/logger";

export const logger = domain("🌙 sdm");
export const chunkSize = 1;

export const host = location.hostname.replace("www.", "");
export const classRx = /sdm-\S*/gi;
export const rgbaRx =
  /rgba?\(\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*(,\s*\d+\.?\d*\s*)?\)/gi;
export const elementsSelector =
  ":not(head, head *, script, noscript, style, link, template, pre *, svg *, object *, embed *)";
export const mediaSelector =
  "img,video,object,embed,[role=image],[role=img],[style*='url(']";

export const locals = {
  enabled: "sdm-enabled",
  isLight: "sdm-is-light",
  styles: "sdm-styles",
};
