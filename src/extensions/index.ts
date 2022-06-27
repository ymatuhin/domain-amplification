import background from "./background";
import baseColors from "./base-colors";
import fullscreen from "./full-screen";
import media from "./media";
import scroll from "./scroll";

export type HTMLElementExtended = HTMLElement & {
  inverted: boolean;
};

export type Extension = {
  start?: () => void;
  stop?: () => void;
  handle?: (element: HTMLElementExtended) => void;
};

export const extensions = [media, scroll, baseColors, fullscreen, background];
