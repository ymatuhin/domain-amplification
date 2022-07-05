export function checkIsScrollable(element: HTMLElement) {
  const { overflow } = getComputedStyle(element);
  return overflow.includes("auto") || overflow.includes("scroll");
}
