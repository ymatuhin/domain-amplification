import { subscribeOnChange } from "shared/utils/subscribe-on-change";
import { derived, writable } from "svelte/store";
import { locals, logger } from "./config";

const log = logger("state");

const defaultStored = JSON.parse(localStorage.getItem(locals.enabled)!);
export const $stored = writable<boolean | null>(defaultStored);

const defaultIsLight = JSON.parse(localStorage.getItem(locals.isLight)!);
export const $isLight = writable<boolean | null>(defaultIsLight);

export const $isEnabled = derived(
  [$stored, $isLight],
  ([stored, isLight]) => stored ?? isLight,
);

chrome.runtime.onMessage.addListener((message) => {
  log(`onMessage from background`, message);
  if (message !== "toggle") return;
  $stored.update((prev) => !prev);
});

subscribeOnChange($stored, (value) => {
  log("change stored", value);
  localStorage.setItem(locals.enabled, value!.toString());
});

subscribeOnChange($isLight, (value) => {
  log("change isLight", value);
  localStorage.setItem(locals.isLight, value!.toString());
});

subscribeOnChange($isEnabled, (value) => {
  log("change isEnabled", value);
  chrome.runtime.sendMessage({ type: "status", value });
});
