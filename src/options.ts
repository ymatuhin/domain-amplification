const invertCheck: HTMLInputElement = document.querySelector(".js-invert")!;
const darkScrollCheck: HTMLInputElement =
  document.querySelector(".js-dark-scroll")!;

chrome.storage.sync.get(
  ["invertedIcon", "darkScroll"],
  ({ invertedIcon, darkScroll }) => {
    invertCheck.checked = Boolean(invertedIcon);
    darkScrollCheck.checked = darkScroll ?? true;
  },
);

invertCheck.addEventListener("input", handleInvert, { passive: true });
darkScrollCheck.addEventListener("click", handleDarkScroll, {
  passive: true,
});

function handleInvert() {
  chrome.storage.sync.set({ invertedIcon: invertCheck.checked });
  chrome.runtime.sendMessage({ type: "icon", value: invertCheck.checked });
}

function handleDarkScroll() {
  chrome.storage.sync.set({ darkScroll: darkScrollCheck.checked });
  chrome.runtime.sendMessage({
    type: "dark-scroll",
    value: darkScrollCheck.checked,
  });
}
