chrome.runtime.onMessage.addListener((status, sender) =>
  setBadge(sender.tab.id, status),
);

chrome.action.onClicked.addListener(({ id }) =>
  chrome.tabs.sendMessage(id, "toggle"),
);

function setBadge(tabId, enabled) {
  chrome.action.setBadgeBackgroundColor({
    color: enabled ? "#46c365" : "#f7768e",
  });
  chrome.action.setBadgeText({
    tabId,
    text: enabled ? "On" : "Off",
  });
}
