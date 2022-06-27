import media from "./media";

export type HTMLElementExtended = HTMLElement & {
  inverted: boolean;
};
export type ExtensionParams = {
  element: HTMLElementExtended;
};
export type Extension = {
  init?: () => void;
  handle?: (params: ExtensionParams) => void;
  stop?: () => void;
};

export const extensions = [media];
