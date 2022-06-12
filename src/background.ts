// chrome.runtime.onMessage.addListener(
//   (status, { tab }) => tab?.id && setBadge(tab.id, status),
// );

chrome.action.onClicked.addListener(({ id }) => {
  if (!id) return;
  chrome.tabs.sendMessage(id, "toggle", (enabled) => setBadge(id, enabled));
});

function setBadge(tabId: number, enabled: boolean) {
  chrome.action.setBadgeBackgroundColor({
    color: enabled ? "#46c365" : "#f7768e",
  });
  chrome.action.setBadgeText({
    tabId,
    text: enabled ? "On" : "Off",
  });
}
