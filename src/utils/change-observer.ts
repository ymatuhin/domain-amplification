import { SELECTOR } from "../client";

const htmlElementFilter = (htmlElement: HTMLElement): boolean =>
  htmlElement instanceof HTMLElement;
const selectorFilter = (htmlElement: HTMLElement) =>
  htmlElement.matches(SELECTOR);
const visibleFilter = (htmlElement: HTMLElement) =>
  htmlElement.offsetHeight > 0;
const toHtmlElement = (target: Node) =>
  target instanceof Text ? target.parentElement : target;

export function changeObserver(callback: (elements: HTMLElement[]) => void) {
  const observerParams = { subtree: true, childList: true, attributes: true };
  const observer = new MutationObserver((mutations_list) => {
    mutations_list.forEach((mutation) => {
      const targets = Array.from(getTargets(mutation));
      const htmlElements = targets.map(toHtmlElement) as HTMLElement[];
      if (!htmlElements) return;

      const filtered = htmlElements
        .filter(htmlElementFilter)
        .filter(selectorFilter)
        .filter(visibleFilter);
      if (filtered.length) callback(filtered);
    });
  });
  return {
    start: () => observer.observe(document.documentElement, observerParams),
    stop: () => observer.disconnect(),
  };
}

function getTargets(mutation: MutationRecord) {
  if (mutation.removedNodes.length) return [];
  const isMyAttribute =
    mutation.type === "attributes" &&
    mutation.attributeName?.includes("data-da-");
  if (isMyAttribute) return [];

  return mutation.addedNodes.length ? mutation.addedNodes : [mutation.target];
}
