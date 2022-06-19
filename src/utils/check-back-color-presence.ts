import { rgbaToObject } from "./rgba-to-object";

export const rgbaRx = /rgba?\(\d+\,\s?\d+\,\s?\d+(\,\s?\d+)?\)/gi;

export function checkBackColorPresence({ background }: CSSStyleDeclaration) {
  if (!rgbaRx.test(background)) return false;

  const colors = background.match(rgbaRx) ?? [];
  const noTransparent = colors.filter((color) => {
    const { a } = rgbaToObject(color);
    return a !== 0;
  });
  return noTransparent.length > 0;
}
