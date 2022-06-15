chrome.runtime.onMessage.addListener((status, { tab }) => {
  tab?.id && setBadge(tab.id, status);
});

chrome.action.onClicked.addListener(({ id }) => {
  if (!id) return;
  chrome.tabs.sendMessage(id, "toggle", (enabled) => setBadge(id, enabled));
});

function setBadge(tabId: number, enabled: boolean) {
  chrome.action.setIcon({
    tabId,
    path: {
      16: enabled ? "dark/16.png" : "light/16.png",
      48: enabled ? "dark/48.png" : "light/48.png",
      128: enabled ? "dark/128.png" : "light/128.png",
    },
  });
}
