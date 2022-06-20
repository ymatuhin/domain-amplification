const invertCheck: HTMLInputElement = document.querySelector(".js-invert")!;
const darkScrollCheck: HTMLInputElement =
  document.querySelector(".js-dark-scroll")!;
const clearButton: HTMLInputElement = document.querySelector(".js-clear")!;

chrome.storage.sync.get(["invertedIcon"], (store) => {
  invertCheck.checked = Boolean(store.invertedIcon);
});
chrome.storage.sync.get(["darkScroll"], (store) => {
  darkScrollCheck.checked = store.darkScroll ?? true;
});

invertCheck.addEventListener("input", handleInvert, { passive: true });
clearButton.addEventListener("click", handleClear, { passive: true });
darkScrollCheck.addEventListener("click", handleDarkScroll, { passive: true });

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
function handleDarkScroll() {
  chrome.storage.sync.set({ darkScroll: darkScrollCheck.checked });
  chrome.runtime.sendMessage({ type: "dark-scroll", value: darkScrollCheck });
}
