const invertElement: HTMLInputElement = document.querySelector(".invert-icon")!;

chrome.storage.sync.get(["invertedIcon"], (store) => {
  invertElement.checked = Boolean(store.invertedIcon);
});

invertElement.addEventListener(
  "input",
  () => {
    chrome.storage.sync.set({ invertedIcon: invertElement.checked });
    chrome.runtime.sendMessage({ type: "icon", value: invertElement.checked });
  },
  { passive: true },
);
