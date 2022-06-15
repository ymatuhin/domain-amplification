import { writable, derived, get } from "svelte/store";
import { chromeStoreLense } from "./chrome-store-lense";
import { whitelist } from "./whitelist";

const host = location.hostname.replace("www.", "");
const isExcluded = whitelist.includes(host);
const isMaybeExcluded = whitelist.some((item) => host.endsWith(item));
const chromeStore = chromeStoreLense(host);

export const stored = writable<null | boolean>(null);
export const documentLight = writable<null | boolean>(null);
export const enabled = derived(
  [stored, documentLight],
  ([stored, documentLight]) => {
    if (stored !== null) return stored;
    if (isExcluded) return false;
    if (documentLight !== null) return documentLight;
    return isMaybeExcluded ? false : true;
  },
);

export const status = derived(enabled, (value) => {
  if (value === null) return "initial";
  return value ? "on" : "off";
});

chromeStore.get().then((value: any) => {
  if (typeof value === "boolean") stored.set(value);
});

chrome.runtime.onMessage.addListener(async (message, _, respond) => {
  if (message !== "toggle") return;
  const prev = get(enabled);
  stored.set(!prev);
  respond(!prev);
});

enabled.subscribe((newValue) => {
  if (newValue === null) return;
  chrome.runtime.sendMessage(newValue);
});

stored.subscribe((newValue) => {
  if (newValue === null) return;
  chromeStore.set(newValue);
});
