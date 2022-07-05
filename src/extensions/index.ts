import { createMiddleware } from "../utils";
import backColor from "./back-color";
import cleanElementState from "./clean-element-state";
import documentColors from "./document-colors";
import documentLightness from "./document-lightness";
import embed from "./embed";
import fullScreen from "./full-screen";
import image from "./image";
import isDocument from "./is-document";
import loadStyles from "./load-styles";
import saveStyles from "./save-styles";
import scroll from "./scroll";

export type HTMLElementExtended = HTMLElement & {
  __sdm_inverted?: boolean;
  __sdm_rule?: string;
  // __sdm_hadBackColor?: boolean;
  // __sdm_hadImage?: boolean;
};

export type MiddlewareParams = {
  status: "init" | "start" | "stop" | "update";
  element?: HTMLElementExtended;
  isDocument?: boolean;
  inverted?: boolean;
};

export const runMiddleware = createMiddleware([
  loadStyles, // load previous styles
  isDocument,
  documentLightness,
  documentColors,
  fullScreen,
  scroll,
  // element handlers
  cleanElementState,
  backColor, // backColor before embed/image
  embed,
  image,
  saveStyles, // save current styles
]);
