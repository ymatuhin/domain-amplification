import { elementsSelector, logger } from "../config";

const log = logger("observer");

type Callback = (elements: HTMLElement[]) => void;
export function observeChanges(callback: Callback) {
  log("init", { callback });
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
  const start = () => {
    log("start");
    observer.observe(document.body, observerParams);
  };
  const stop = () => {
    log("stop");
    observer.disconnect();
  };
  return { start, stop };
}

function handleMutations(mutations: MutationRecord[], callback: Function) {
  log("handleMutations", mutations);
  const items = new Set<HTMLElement>();
  mutations.forEach((mutation) => {
    const targets = getTargets(mutation);
    targets.forEach((target) => {
      if (!target.matches(elementsSelector)) return;
      items.add(target);
    });
  });
  if (items.size) callback([...items]);
}

function getTargets(mutation: MutationRecord) {
  if (mutation.type === "attributes") {
    return [mutation.target] as HTMLElement[];
  }
  if (mutation.type === "characterData") {
    return [mutation.target.parentElement] as HTMLElement[];
  }
  if (mutation.type === "childList") {
    const added = Array.from(mutation.addedNodes)
      .concat(Array.from(mutation.removedNodes))
      .map((node) => (node instanceof HTMLElement ? node : node.parentElement))
      .flatMap((element) => {
        if (!element) return [];
        const children = element.querySelectorAll(elementsSelector);
        return [element, ...Array.from(children)];
      })
      .filter(Boolean);
    return added as HTMLElement[];
  }
  return [];
}
