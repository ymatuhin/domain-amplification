export function observeChanges(callback: Function) {
  let queue: HTMLElement[] = [];
  const observerParams = { subtree: true, childList: true, attributes: true };
  const observer = new MutationObserver((mutations_list) => {
    mutations_list.forEach((mutation) => {
      const targets = Array.from(getTargets(mutation));
      targets.forEach((target) => {
        if (!(target instanceof HTMLElement)) return;
        if (target.matches("head, head *, pre *, [contenteditable] *")) return;
        if (queue.includes(target)) return;
        queue.push(target);
      });
    });
  });

  runQueue();

  function runQueue() {
    // const
    const now = queue.slice(0, 10);
    if (now.length) {
      queue = queue.slice(10);
      now.forEach(($item) => callback($item));
    }
    return requestAnimationFrame(runQueue);
  }

  function getTargets(mutation: MutationRecord) {
    if (
      mutation.type === "attributes" &&
      mutation.attributeName?.includes("data-da-")
    ) {
      return [mutation.target];
    } else {
      return mutation.addedNodes;
    }
  }
  observer.observe(document.documentElement, observerParams);
}
