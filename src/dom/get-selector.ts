export function getSelector(
  element: HTMLElement,
  selectors: string[] = [],
): string {
  const tag = element.tagName.toLowerCase();
  if (tag === "body") return selectors.join(" > ");

  let selector = tag;
  if (element.id) {
    selector = `#${element.id}`;
    return [selector, ...selectors].join(" > ");
  }
  Array.from(element.attributes)
    .filter(
      (attr) =>
        attr.nodeName !== "class" &&
        attr.nodeName !== "style" &&
        attr.nodeName !== "src",
    )
    .forEach((attr) => (selector += `[${attr.nodeName}="${attr.nodeValue}"]`));
  const index = getElementIndex(element, selector);
  if (index > 1) selector += `:nth-of-type(${index})`;

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
