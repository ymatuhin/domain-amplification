import { rgbaRx } from "../config";
import { rgbaToObject } from "./rgba-to-object";

export function checkBackColorPresence({ background }: CSSStyleDeclaration) {
  const colors = background.match(rgbaRx) ?? [];
  const noSemiTransparent = colors.filter((color) => {
    const { a } = rgbaToObject(color);
    return a > 0.5;
  });
  return noSemiTransparent.length > 0;
}
