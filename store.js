const store = (() => {
  const { storeLense } = helpers;
  const whitelist = [
    "gist.github.com",
    "github.com",
    "codepen.io",
    "tailwindcss.com",
    "typescriptlang.org",
    "google.com",
    "youtube.com",
    "twitch.tv",
    "pikabu.ru",
    "twitter.com",
    "vk.com",
    "developer.mozilla.org",
  ];

  const host = location.hostname.replace("www.", "");
  const store = storeLense(host);
  const whiteListed = whitelist.includes(host);

  let enabled = null;
  let callbacks = [];

  chrome.runtime.onMessage.addListener(async (message) => {
    if (message !== "toggle") return;
    const prev = await get();
    set(!prev);
  });

  async function get() {
    if (enabled) return enabled;
    enabled = (await store.get()) ?? !whiteListed ?? true;
    chrome.runtime.sendMessage(enabled);
    return enabled;
  }
  function set(newValue) {
    enabled = newValue;
    store.set(newValue);
    chrome.runtime.sendMessage(newValue);
    callbacks.forEach((fn) => fn(newValue));
  }
  function onChange(callback) {
    callbacks.push(callback);
  }
  return { get, set, onChange };
})();
