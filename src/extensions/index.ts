import background from "./background";
import documentColors from "./document-colors";
import documentLightness from "./document-lightness";
import fullscreen from "./full-screen";
import media from "./media";
import scroll from "./scroll";
import styleSync from "./style-sync";

export type HTMLElementExtended = HTMLElement & {
  inverted: boolean;
};

export type Extension = {
  init?: () => void;
  start?: () => void;
  stop?: () => void;
  domReady?: () => void;
  handleElement?: (element: HTMLElementExtended) => void;
  handleHtmlBody?: () => void;
};

export const extensions = [
  media,
  scroll,
  documentColors,
  documentLightness,
  fullscreen,
  background,
  styleSync,
];
