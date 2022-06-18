export function isInViewport(element: Element) {
  const bounding = element.getBoundingClientRect();

  if (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <= window.innerWidth &&
    bounding.bottom <= window.innerHeight
  ) {
    return true;
  }

  return false;
}
