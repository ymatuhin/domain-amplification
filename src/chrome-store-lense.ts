export const chromeStoreLense = (hostname: string) => ({
  get() {
    return new Promise((res) =>
      chrome.storage.sync.get([hostname], (store) => res(store[hostname])),
    );
  },
  set(value: any) {
    return new Promise((res) =>
      chrome.storage.sync.set({ [hostname]: value }, () => res(value)),
    );
  },
});
