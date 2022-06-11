chrome.runtime.onMessage.addListener(
  (status, { tab }) => tab?.id && setBadge(tab.id, status),
);

chrome.action.onClicked.addListener(
  ({ id }) => id && chrome.tabs.sendMessage(id, "toggle"),
);

function setBadge(tabId: number, enabled: boolean) {
  chrome.action.setBadgeBackgroundColor({
    color: enabled ? "#46c365" : "#f7768e",
  });
  chrome.action.setBadgeText({
    tabId,
    text: enabled ? "On" : "Off",
  });
}
