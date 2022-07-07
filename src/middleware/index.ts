import { invertedPropName, rulesPropName } from "../config";
import { $isEnabled, $isLight } from "../state";
import { createMiddleware } from "../utils";
import backColor from "./back-color";
import cleanElementState from "./clean-element-state";
import defaultScroll from "./default-scroll";
import documentColors from "./document-colors";
import embed from "./embed";
import fullScreen from "./full-screen";
import image from "./image";
import isDocument from "./is-document";
import isEmbedded from "./is-embedded";
import isLight from "./is-light";
import root from "./root";
import store from "./store";

export type HTMLElementExtended = HTMLElement & {
  [invertedPropName]?: boolean;
  [rulesPropName]?: string[];
};

type Common = {
  $isLight: typeof $isLight;
  $isEnabled: typeof $isEnabled;
  isDocument?: boolean;
  isEmbedded?: boolean;
  isInverted?: boolean;
};

type Update = Common & {
  status: "update";
  element: HTMLElementExtended;
};

type LifeCycle = Common & {
  status: "init" | "start" | "stop";
  element: void;
};

export type MiddlewareParams = Update | LifeCycle;

export const runMiddleware = createMiddleware([
  store,
  isDocument,
  isEmbedded,
  isLight,
  root,
  fullScreen,
  defaultScroll,
  documentColors,
  // element handlers
  cleanElementState,
  backColor, // backColor before embed/image
  embed,
  image,
  // scroll,
  // emoji,
]);
