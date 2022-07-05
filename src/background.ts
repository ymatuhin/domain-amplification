let invertedIcons = false;

chrome.storage.sync.get(["invertedIcon"], (store) => {
  console.info(`🔥 invertedIcons store`, store.invertedIcon);
  invertedIcons = Boolean(store.invertedIcon);
});

chrome.storage.sync.get(["darkScroll"], ({ darkScroll }) => {
  if (darkScroll === undefined) {
    chrome.storage.sync.set({ darkScroll: true });
  }
});

chrome.runtime.onMessage.addListener((message, { tab }) => {
  console.log("onMessage", { message, tab });
  if (message.type === "status" && tab?.id) changeIcon(message.value, tab.id);
  if (message.type === "icon") {
    invertedIcons = message.value;
    changeIcon();
  }
});

chrome.action.onClicked.addListener(({ id }) => {
  if (!id) return;
  console.log("onClicked", { id });
  chrome.tabs.sendMessage(id, "toggle");
});

function changeIcon(enabled: boolean = false, tabId?: number) {
  console.log("setBadge", { tabId, enabled });
  const iconFolder = enabled ? "on" : "off";
  const colorPrefix = invertedIcons ? "black" : "white";

  chrome.action.setIcon({
    tabId,
    path: {
      16: `${iconFolder}/${colorPrefix}-16.png`,
      24: `${iconFolder}/${colorPrefix}-24.png`,
      32: `${iconFolder}/${colorPrefix}-32.png`,
      48: `${iconFolder}/${colorPrefix}-48.png`,
      64: `${iconFolder}/${colorPrefix}-64.png`,
      128: `${iconFolder}/${colorPrefix}-128.png`,
    },
  });
}
