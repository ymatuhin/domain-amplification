export const waitForBodyCallback = (callback: Function) => {
  if (document.body) requestAnimationFrame(() => callback());
  else requestAnimationFrame(() => waitForBodyCallback(callback));
};

export const waitForBody = () => new Promise(waitForBodyCallback);
