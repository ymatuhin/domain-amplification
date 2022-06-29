export function checkIsScrollable(element: HTMLElement) {
  // Compare the height to see if the element has scrollable content
  // 10 is for falsy checks
  // TODO: check why it's falsy too often
  const hasScrollableContent = element.scrollHeight > element.clientHeight + 10;

  // It's not enough because the element's `overflow-y` style can be set as
  // * `hidden`
  // * `hidden !important`
  // In those cases, the scrollbar isn't shown
  const overflowYStyle = window.getComputedStyle(element).overflowY;
  const isOverflowHidden = overflowYStyle.indexOf("hidden") !== -1;

  return hasScrollableContent && !isOverflowHidden;
}
