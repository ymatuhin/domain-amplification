import backColorHandler from "./back-color";
import emojiHandler from "./emoji";
import sizeHandler from "./size";

const handlers = [backColorHandler, emojiHandler, sizeHandler];

export const runHandlers = (item: HTMLElement) => {
  const styles = getComputedStyle(item);
  handlers.forEach((handler) => handler(item, styles));
};
