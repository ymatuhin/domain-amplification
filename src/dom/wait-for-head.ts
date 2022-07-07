export const waitForHeadCallback = (callback: Function) => {
  if (document.head) requestAnimationFrame(() => callback());
  else requestAnimationFrame(() => waitForHeadCallback(callback));
};

export const waitForHead = () => new Promise(waitForHeadCallback);
