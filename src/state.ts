import { logStore } from "shared/logger";
import { derived, get, writable } from "svelte/store";
import { locals, logger } from "./config";

const log = logger("state");

const defaultStored = JSON.parse(localStorage.getItem(locals.enabled)!);
export const $stored = writable<boolean | null>(defaultStored);
logStore("stored", log, $stored);

const defaultIsLight = JSON.parse(localStorage.getItem(locals.isLight)!);
export const $isLight = writable<boolean | null>(defaultIsLight);
logStore("isLight", log, $isLight);

export const $isEnabled = derived(
  [$stored, $isLight],
  ([stored, isLight]) => stored ?? isLight,
);
logStore("isEnabled", log, $isEnabled);

chrome.runtime.onMessage.addListener((message) => {
  log(`onMessage from background`, message);
  if (message !== "toggle") return;
  $stored.set(!get($isEnabled));
});

$stored.subscribe((value) => {
  if (value === null) return;
  localStorage.setItem(locals.enabled, value!.toString());
});

$isLight.subscribe((value) => {
  if (value === null) return;
  localStorage.setItem(locals.isLight, value!.toString());
});

$isEnabled.subscribe((value) => {
  log("send message to background", { isEnabled: value });
  chrome.runtime.sendMessage({ type: "status", value });
});
