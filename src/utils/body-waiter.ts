export function bodyWaiter() {
  return new Promise<void>((resolve) => {
    const observerParams = {
      subtree: false,
      childList: true,
      attributes: false,
    };
    const observer = new MutationObserver((mutations_list) => {
      mutations_list.forEach((mutation) => {
        const nodes = Array.from(mutation.addedNodes);
        const body = nodes.find((node) => node instanceof HTMLBodyElement);
        if (!body) return;
        setTimeout(resolve);
        observer.disconnect();
      });
    });
    observer.observe(document.documentElement, observerParams);
  });
}
