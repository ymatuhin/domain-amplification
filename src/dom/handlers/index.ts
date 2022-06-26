import { invert } from "./invert";
import { rootInvert } from "./root-invert";

export type HTMLElementExtended = HTMLElement & {
  inverted: boolean;
};

const handlers = [rootInvert, invert];

export const runHandlers = (item: HTMLElementExtended) => {
  handlers.forEach((handler) => handler(item));
};
