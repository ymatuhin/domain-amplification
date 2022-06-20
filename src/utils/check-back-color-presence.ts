import { rgbaToObject } from "./rgba-to-object";

export const rgbaRx =
  /rgba?\(\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*,\s*\d+\.?\d*\s*(,\s*\d+\.?\d*\s*)?\)/gi;

export function checkBackColorPresence({ background }: CSSStyleDeclaration) {
  const colors = background.match(rgbaRx) ?? [];
  const noTransparent = colors.filter((color) => {
    const { a } = rgbaToObject(color);
    return a !== 0;
  });
  return noTransparent.length > 0;
}
