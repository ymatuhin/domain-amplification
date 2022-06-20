const invertCheck: HTMLInputElement = document.querySelector(".js-invert")!;
const clearButton: HTMLInputElement = document.querySelector(".js-clear")!;

chrome.storage.sync.get(["invertedIcon"], (store) => {
  invertCheck.checked = Boolean(store.invertedIcon);
});

invertCheck.addEventListener("input", handleInvert, { passive: true });
clearButton.addEventListener("click", handleClear, { passive: true });

function handleInvert() {
  chrome.storage.sync.set({ invertedIcon: invertCheck.checked });
  chrome.runtime.sendMessage({ type: "icon", value: invertCheck.checked });
}

function handleClear() {
  chrome.storage.sync.clear(() => {
    const { lastError } = chrome.runtime;
    alert(lastError ? `Something went wrong` : `Done`);
  });
}
