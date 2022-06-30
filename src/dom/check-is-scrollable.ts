export function checkIsScrollable(element: HTMLElement) {
  const { overflow } = getComputedStyle(element);
  const canBeScrollable =
    overflow.includes("auto") || overflow.includes("scroll");

  return canBeScrollable && element.scrollHeight > element.clientHeight;
}
