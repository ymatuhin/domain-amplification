import { writable, get, derived } from "svelte/store";
import { chromeStoreLense } from "./chrome-store-lense";
import { whitelist } from "./whitelist";

const host = location.hostname.replace("www.", "");
const isExcluded = whitelist.includes(host);
const isMaybeExcluded = whitelist.some((item) => host.endsWith(item));
const chromeStore = chromeStoreLense(host);

// chrome.storage.sync.clear();

type Enabled = null | boolean;
const stored = writable<Enabled>(null);
export const documentLight = writable<Enabled>(null);
const enabled = derived([stored, documentLight], ([stored, documentLight]) => {
  console.info(`🔥 stored`, stored);
  if (stored !== null) return stored;
  if (isExcluded) return false;
  if (documentLight !== null) return documentLight;
  return isMaybeExcluded ? false : true;
});
export const status = derived(enabled, (value) => {
  if (value === null) return "initial";
  return value ? "on" : "off";
});

chromeStore.get().then((value: any) => {
  if (value !== null) stored.set(value);
});

chrome.runtime.onMessage.addListener(async (message, _, respond) => {
  if (message !== "toggle") return;
  const prev = get(enabled);
  stored.set(!prev);
  respond(!prev);
});

stored.subscribe((newValue) => {
  if (newValue === null) return;
  chrome.runtime.sendMessage(newValue);
  chromeStore.set(newValue);
});
