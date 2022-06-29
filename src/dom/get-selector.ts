export function getSelector(
  element: HTMLElement,
  selectors: string[] = [],
): string {
  if (!element) return selectors.join(" > ");
  const tag = element.tagName.toLowerCase();
  if (tag === "body") return selectors.join(" > ");

  let selector = tag;
  if (element.id) {
    // special for invalid number id, like id="444"
    selector = `[id="${element.id}"]`;
    return [selector, ...selectors].join(" > ");
  }
  const index = getElementIndex(element, selector);
  selector += `:nth-of-type(${index})`;

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
