import background from "./background";
import documentColors from "./document-colors";
import documentLightness from "./document-lightness";
import emoji from "./emoji";
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
  domComplete?: () => void;
  handleElement?: (element: HTMLElementExtended) => void;
  handleHtmlBody?: () => void;
};

export const extensions = [
  // styleSync before everything
  styleSync,
  media,
  scroll,
  documentColors,
  documentLightness,
  fullscreen,
  background,
  emoji,
];
