import { domain } from "shared/logger";

export const logger = domain("🌙 sdm");
export const chunkSize = 32;
export const host = location.hostname.replace("www.", "");
export const classRx = /sdm-\S*/gi;
export const rgbaRx =
  /rgba?\(\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*(,\s*\d+\.?\d*\s*)?\)/gi;
export const elementsSelector =
  ":not(head,meta,title,base,script,noscript,style,link,template,pre *,svg *,[contenteditable] > *, picture > *, object > *, embed > *, head > *)";
export const mediaSelector =
  "picture,img,video,object,embed,iframe,[role=image],[role=img],[style*='url(']";

export const locals = {
  enabled: "sdm-enabled",
  isLight: "sdm-is-light",
  styles: "sdm-styles",
};
