import { createMiddleware } from "../utils";
import backColor from "./back-color";
import cleanElementState from "./clean-element-state";
import defaultScroll from "./default-scroll";
import documentColors from "./document-colors";
import documentLightness from "./document-lightness";
import embed from "./embed";
import emoji from "./emoji";
import fullScreen from "./full-screen";
import image from "./image";
import isDocument from "./is-document";
import isIgnored from "./is-ignored";
import loadStyles from "./load-styles";
import saveStyles from "./save-styles";
import scroll from "./scroll";

export type HTMLElementExtended = HTMLElement & {
  __sdm_inverted?: boolean;
  __sdm_rule?: string;
};

export type MiddlewareParams = {
  status: "init" | "start" | "stop" | "update";
  element?: HTMLElementExtended;
  isDocument?: boolean;
  isIgnored?: boolean;
  inverted?: boolean;
  isLight?: boolean;
};

export const runMiddleware = createMiddleware([
  documentLightness,
  defaultScroll, // should be after documentLightness first
  loadStyles, // load previous styles
  isDocument,
  isIgnored,
  documentColors,
  fullScreen,
  // element handlers
  cleanElementState,
  backColor, // backColor before embed/image
  embed,
  image,
  scroll,
  emoji,
  saveStyles, // save current styles
]);
