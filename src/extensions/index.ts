import media from "./media";

export type HTMLElementExtended = HTMLElement & {
  inverted: boolean;
};
export type ExtensionParams = {
  element: HTMLElementExtended;
};
export type Extension = {
  start?: () => void;
  stop?: () => void;
  handle?: (params: ExtensionParams) => void;
};

export const extensions = [media];
