import { elementsSelector } from "../config";

type Callback = (elements: HTMLElement[]) => void;
export function observeChanges(callback: Callback) {
  const observerParams = {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
    attributeOldValue: true,
  };
  // request
  const observer = new MutationObserver((mutations) => {
    handleMutations(mutations, callback);
  });

  const start = () => observer.observe(document.body, observerParams);
  const stop = () => observer.disconnect();

  return { start, stop };
}

function handleMutations(mutations: MutationRecord[], callback: Function) {
  const items = new Set<HTMLElement>();
  // for cycle is here for performance reasons
  for (let i = mutations.length - 1; i >= 0; --i) {
    const targets = getTargets(mutations[i]);
    for (let j = targets.length - 1; j >= 0; --j) {
      const target = targets[j];
      if (target.matches(elementsSelector)) {
        items.add(target);
      }
    }
  }
  callback([...items]);
}

function getTargets(mutation: MutationRecord) {
  if (mutation.type === "attributes") {
    if (mutation.attributeName?.startsWith("data-sdm-")) return [];
    return [mutation.target] as HTMLElement[];
  }
  if (mutation.type === "characterData") {
    return [mutation.target.parentElement] as HTMLElement[];
  }
  if (mutation.type === "childList") {
    const added = Array.from(mutation.addedNodes)
      .map((node) => node.parentElement)
      .filter(Boolean);
    return added as HTMLElement[];
  }
  return [];
}
