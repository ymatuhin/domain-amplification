export function rgbaAsArrayOfString(rgbString: string) {
  const [r, g, b, a = "1"] = rgbString
    .replace(/ /g, "")
    .replace(/rgba?/g, "")
    .replace(/[()]/g, "")
    .split(",");
  return { r, g, b, a };
}
