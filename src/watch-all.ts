export function watchAll(callback: (node: Node) => void) {
  const observerParams = { subtree: true, childList: true, attributes: true };
  const observer = new MutationObserver((mutations_list) => {
    mutations_list.forEach((mutation) => {
      const targets = Array.from(getTargets(mutation));
      targets.forEach(callback);
    });
  });
  observer.observe(document.documentElement, observerParams);
}

const ignoreTags = [
  "TITLE",
  "HEAD",
  "LINK",
  "META",
  "SCRIPT",
  "NOSCRIPT",
  "STYLE",
  "BR",
];

export function isOkElement(target: Node) {
  if (!(target instanceof HTMLElement)) return;
  if (ignoreTags.includes(target.tagName)) return;
  if (target.matches("pre *, [contenteditable] *")) return;
  return true;
}

function getTargets(mutation: MutationRecord) {
  const { addedNodes, type, attributeName, target } = mutation;
  if (addedNodes.length) return addedNodes;
  const isMyMutation = attributeName?.includes("data-da-");
  if (type === "attributes" && !isMyMutation) return [target];
  return [];
}
