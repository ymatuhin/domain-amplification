import { writable, get, derived } from "svelte/store";
import { chromeStoreLense } from "./chrome-store-lense";
import { whitelist } from "./whitelist";

type Enabled = null | boolean;
const enabled = writable<Enabled>(null);
export const status = derived(enabled, (value) => {
  if (value === null) return "initial";
  return value ? "on" : "off";
});

const host = location.hostname.replace("www.", "");
const chromeStore = chromeStoreLense(host);

chromeStore.get().then((value: any) => {
  const isExcluded = !whitelist.includes(host);
  enabled.set(value ?? isExcluded ?? true);
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message !== "toggle") return;
  const prev = get(enabled);
  enabled.set(!prev);
});

enabled.subscribe((newValue) => {
  chrome.runtime.sendMessage(newValue);
  chromeStore.set(newValue);
});
