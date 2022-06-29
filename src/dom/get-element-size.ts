export function getElementSize(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const area = rect.width * rect.height;
  const windowArea = window.outerHeight * window.outerHeight;
  const spacePercent = Math.round((area / windowArea) * 100);
  return spacePercent;
}
