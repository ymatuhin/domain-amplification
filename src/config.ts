import { logger } from "shared/logger";
export const log = logger("🌙");

export const chunkSize = 32;
export const host = location.hostname.replace("www.", "");
export const classRx = /sdm-\S*/gi;
export const rgbaRx =
  /rgba?\(\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*(,\s*\d+\.?\d*\s*)?\)/gi;
export const elementsSelector =
  ":not(head,meta,title,base,script,noscript,style,link,template,pre *,svg *,[contenteditable] > *)";

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
  // should be attributes
  // lightnessLight: `${base}-lightness-light`,
  // lightnessMedium: `${base}-lightness-medium`,
  // lightnessDark: `${base}-lightness-dark`,
  // emoji: `${base}-emoji`,
  // image: `${base}-image`,
  // backColor: `${base}-background`,
  // sizeXs: `${base}-size-xs`,
  // sizeSm: `${base}-size-sm`,
  // sizeMd: `${base}-size-md`,
  // sizeLg: `${base}-size-lg`,
};

export const attrs = {
  emoji: `data-${base}-emoji`,
  image: `data-${base}-image`,
  back: `data-${base}-back`,
  size: `data-${base}-size`,
};
