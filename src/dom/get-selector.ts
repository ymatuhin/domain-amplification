export function getSelector(
  element: HTMLElement,
  selectors: string[] = [],
): string {
  if (!element) return selectors.join(" > ");
  if (element instanceof HTMLHtmlElement && selectors.length)
    return selectors.join(" > ");

  const tag = element.tagName.toLowerCase();
  let selector = tag;

  if (element.id) {
    return [`[id="${element.id}"]`, ...selectors].join(" > ");
  } else if (tag !== "html" && tag !== "body") {
    const index = getElementIndex(element, selector);
    selector += `:nth-of-type(${index})`;
  }

  return getSelector(element.parentElement!, [selector, ...selectors]);
}

function getElementIndex(
  element: HTMLElement,
  selector: string,
  count: number = 1,
): number {
  if (!element.previousElementSibling) return count;
  if (element.previousElementSibling.matches(selector)) count += 1;
  return getElementIndex(
    element.previousElementSibling as HTMLElement,
    selector,
    count,
  );
}
