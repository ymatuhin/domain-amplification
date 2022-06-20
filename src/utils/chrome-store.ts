const host = location.hostname.replace("www.", "");

export const get = <R>() => {
  return new Promise<R>((res) =>
    chrome.storage.sync.get([host], (store) => res(store[host])),
  );
};
export const set = <R>(value: any) => {
  return new Promise<R>((res) =>
    chrome.storage.sync.set({ [host]: value }, () => res(value)),
  );
};
