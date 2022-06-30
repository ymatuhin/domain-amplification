import { makeRule } from "./sheet";

export const rootRule = makeRule(
  `:root { filter: invert(0.9) hue-rotate(180deg) !important; }`,
);
export const mediaFilter = `filter: invert(1) hue-rotate(180deg) brightness(1.1) !important;`;
export const resetFilter = `filter: initial !important;`;
