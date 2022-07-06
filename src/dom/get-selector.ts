export function getSelector(
  element: HTMLElement,
  selectors: string[] = [],
): string {
  if (!element) return selectors.join(" > ");
  if (element instanceof HTMLHtmlElement && selectors.length)
    return selectors.join(" > ");

  const tag = element.tagName.toLowerCase();
  let selector = tag;

  if (isValidId(element.id)) {
    // special for invalid numeric id, like id="444"
    return [`#${element.id}`, ...selectors].join(" > ");
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

function isValidId(id: string) {
  if (!id) return false;
  try {
    const items = document.querySelectorAll(`#${id}`);
    if (items.length === 1) return true;
  } catch (e) {}
  return false;
}
