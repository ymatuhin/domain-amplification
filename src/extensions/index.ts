import logger from "./logger";

export type ExtensionParams = {
  element: HTMLElement;
};
export type Extension = {
  init: () => void;
  handle: (params: ExtensionParams) => void;
  stop: () => void;
};

export const extensions = [logger];
