export function rgbaToObject(rgbString: string) {
  const [r, g, b, a = 1] = rgbString
    .replace(/ /g, "")
    .replace(/rgba?/g, "")
    .replace(/[()]/g, "")
    .split(",")
    .map((i) => +i);
  return { r, g, b, a };
}
