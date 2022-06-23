import { isDefined, isUndefined } from "shared/is/defined";
import { derived, get, writable } from "svelte/store";
import "./client.scss";
import { checkDocumentIsLight } from "./color";
import { classes, host, log } from "./config";
import * as dom from "./dom";
import { waitForBody, waitForDom } from "./dom";
import { initCustomScroll } from "./scroll";
import { systemColorDetection } from "./system-colors";

const { documentElement: html } = document;
const $stored = writable<boolean>();
const $isDocLight = writable<boolean>();
const $enabled = derived([$stored, $isDocLight], ([stored, isDocLight]) => {
  if (isDefined(stored)) return stored;
  if (isDefined(isDocLight)) return isDocLight;
  return undefined;
});

init();

async function init() {
  log("init");
  html.classList.add(classes.init);
  initCustomScroll();

  chrome.runtime.onMessage.addListener((message) => {
    log(`onMessage from background`, message);
    if (message !== "toggle") return;
    $stored.set(!get($enabled));
  });

  chrome.storage.sync.get([host], (store) => {
    log("storage.sync.get", { stored: store[host] });
    $stored.set(store[host] as boolean);
    $stored.subscribe(onStoredChange);
    $enabled.subscribe(onEnabledChange);
  });

  document.addEventListener("readystatechange", syncDocumentLightness);
}

async function syncDocumentLightness() {
  await waitForBody();
  if (isDefined(get($stored))) return;
  const isLight = checkDocumentIsLight();
  log("syncDocumentLightness", { isLight });
  $isDocLight.set(isLight);
}

async function onStoredChange(stored: boolean) {
  log("onStoredChange", { stored });
  if (isUndefined(stored)) syncDocumentLightness();
  else chrome.storage.sync.set({ [host]: stored });
}

async function onEnabledChange(enabled?: boolean) {
  if (isUndefined(enabled)) return;
  log("onEnabledChange", { enabled });
  html.classList.remove(classes.init);
  if (enabled) html.classList.add(classes.powerOn);
  else html.classList.remove(classes.powerOn);
  chrome.runtime.sendMessage({ type: "status", value: enabled });

  if (enabled) {
    await waitForBody();
    systemColorDetection.run();
    await waitForDom();
    dom.run();
    dom.start();
  } else {
    systemColorDetection.clean();
    dom.stop();
    removeClasses();
  }
}

function removeClasses() {
  log("removeClasses");
  const classesArr = Object.values(classes);
  const selector = classesArr.map((className) => `.${className}`).join(",");
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => element.classList.remove(...classesArr));
}
