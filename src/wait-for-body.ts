export function waitForBody(callback: Function) {
  const observerParams = { subtree: false, childList: true, attributes: false };
  const observer = new MutationObserver((mutations_list) => {
    mutations_list.forEach((mutation) => {
      mutation.addedNodes.forEach((addedNode: any) => {
        if (addedNode?.tagName !== "BODY") return;
        callback();
        observer.disconnect();
      });
    });
  });
  observer.observe(document.documentElement, observerParams);
}
