chrome.runtime.onMessage.addListener((status, { tab }) => {
  if (!tab?.id) return;
  console.info(`🔥 status`, status);
  setBadge(tab.id, status);
});

chrome.action.onClicked.addListener(({ id }) => {
  if (!id) return;
  chrome.tabs.sendMessage(id, "toggle");
});

function setBadge(tabId: number, enabled: boolean) {
  chrome.action.setIcon({
    tabId,
    path: {
      16: enabled ? "dark/16.png" : "light/16.png",
      32: enabled ? "dark/32.png" : "light/32.png",
      48: enabled ? "dark/48.png" : "light/48.png",
      64: enabled ? "dark/64.png" : "light/64.png",
      128: enabled ? "dark/128.png" : "light/128.png",
    },
  });
}
