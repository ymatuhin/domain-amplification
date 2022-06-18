import { rgbaToObject } from "./rgba-to-object";

export function hasBackColor({ backgroundColor }: CSSStyleDeclaration) {
  const { a } = rgbaToObject(backgroundColor);
  return backgroundColor && a > 0;
}
