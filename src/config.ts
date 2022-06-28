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
  "picture,img,video,object,embed,iframe,[role=image],[role=img]";

// svg image (?)

const base = "sdm";
export const classes = {
  init: `${base}-init`,
  schemeLight: `${base}-scheme-light`,
  schemeDark: `${base}-scheme-dark`,
  powerOn: `${base}-power-on`,
  customScrollOn: `${base}-custom-scroll-on`,
  defaultCustomScrollOn: `${base}-default-custom-scroll-on`,
  htmlSystemBack: `${base}-html-system-background`,
  htmlSystemText: `${base}-html-system-text`,
  bodySystemBack: `${base}-body-system-background`,
  bodySystemText: `${base}-body-system-text`,
};

export const locals = {
  enabled: "sdm-enabled",
  isLight: "sdm-is-light",
  styles: "sdm-styles",
};

export const attrs = {
  emoji: `data-${base}-emoji`,
  image: `data-${base}-image`,
  back: `data-${base}-back`,
  size: `data-${base}-size`,
};
