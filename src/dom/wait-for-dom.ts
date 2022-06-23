export const waitForDomCallback = (callback: Function) => {
  if (document.readyState !== "loading")
    requestAnimationFrame(() => callback());
  else requestAnimationFrame(() => waitForDomCallback(callback));
};

export const waitForDomCompleteCallback = (callback: Function) => {
  if (document.readyState === "complete")
    requestAnimationFrame(() => callback());
  else requestAnimationFrame(() => waitForDomCompleteCallback(callback));
};

export const waitForDom = () => new Promise(waitForDomCallback);
export const waitForDomComplete = () => new Promise(waitForDomCompleteCallback);
