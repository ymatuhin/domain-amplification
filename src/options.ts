const invertCheck: HTMLInputElement = document.querySelector(".js-invert")!;
const darkScrollCheck: HTMLInputElement =
  document.querySelector(".js-dark-scroll")!;
const darkScrollByDefaultCheck: HTMLInputElement = document.querySelector(
  ".js-default-dark-scroll",
)!;

chrome.storage.sync.get(
  ["invertedIcon", "darkScroll", "darkScrollByDefault"],
  ({ invertedIcon, darkScroll, darkScrollByDefault }) => {
    invertCheck.checked = Boolean(invertedIcon);
    darkScrollCheck.checked = darkScroll ?? true;
    darkScrollByDefaultCheck.disabled = !darkScrollCheck.checked;
    darkScrollByDefaultCheck.checked = darkScrollByDefault ?? true;
  },
);

invertCheck.addEventListener("input", handleInvert, { passive: true });
darkScrollCheck.addEventListener("click", handleDarkScroll, {
  passive: true,
});
darkScrollByDefaultCheck.addEventListener("click", handleDarkScrollByDefault, {
  passive: true,
});

function handleInvert() {
  chrome.storage.sync.set({ invertedIcon: invertCheck.checked });
  chrome.runtime.sendMessage({ type: "icon", value: invertCheck.checked });
}

function handleDarkScroll() {
  darkScrollByDefaultCheck.disabled = !darkScrollCheck.checked;

  chrome.storage.sync.set({ darkScroll: darkScrollCheck.checked });
  chrome.runtime.sendMessage({
    type: "dark-scroll",
    value: darkScrollCheck.checked,
  });
}

function handleDarkScrollByDefault() {
  chrome.storage.sync.set({
    darkScrollByDefault: darkScrollByDefaultCheck.checked,
  });
  chrome.runtime.sendMessage({
    type: "default-dark-scroll",
    value: darkScrollByDefaultCheck.checked,
  });
}
