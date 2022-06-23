export function checkBackImagePresence({ background }: CSSStyleDeclaration) {
  return background.includes("url");
}
