import "./client.scss";
import { checkDocumentIsLight } from "./color";
import { classes, locals, logger } from "./config";
import * as dom from "./dom";
import { waitForDom, waitForDomComplete } from "./dom";
import { initCustomScroll } from "./scroll";
import { checkSystemColors } from "./system-colors";

const log = logger("client");
const { documentElement: html } = document;
let isRunning: boolean | null = null;

init();

function init() {
  log("init");
  html.classList.add(classes.init);
  initCustomScroll();
  addUniversalListeners();
  const stored = localStorage.getItem(locals.enabled);
  log("stored", { stored });
  if (stored === null) handleNoStoredValue();
  else if (stored === "true") start();
  else stop();
}

function addUniversalListeners() {
  log("addUniversalListeners");
  chrome.runtime.onMessage.addListener((message) => {
    log(`onMessage from background`, message);
    if (message !== "toggle") return;
    const wasRunning = isRunning;
    wasRunning ? stop() : start();
    localStorage.setItem(locals.enabled, (!wasRunning).toString());
  });
}

async function start() {
  if (isRunning === true) return;
  log("start");
  isRunning = true;
  checkSystemColors();
  html.classList.remove(classes.init);
  html.classList.add(classes.powerOn);
  chrome.runtime.sendMessage({ type: "status", value: isRunning });
  dom.start();
}

function stop() {
  if (isRunning === false) return;
  log("stop");
  isRunning = false;
  chrome.runtime.sendMessage({ type: "status", value: isRunning });
  removeClasses();
  dom.stop();
}

async function handleNoStoredValue() {
  log("handleNoStoredValue");
  const isLightSaved = localStorage.getItem(locals.isLight);
  log("handleNoStoredValue", { isLightSaved });
  if (isLightSaved === "true") start();
  checkDocumentLightness();
}

async function checkDocumentLightness() {
  await waitForDom();
  const isLightWhenDom = checkDocumentIsLight();
  log("handleNoStoredValue", { isLightWhenDom });
  localStorage.setItem(locals.isLight, isLightWhenDom.toString());
  isLightWhenDom ? start() : stop();

  await waitForDomComplete();
  const isLightWhenComplete = checkDocumentIsLight();
  log("handleNoStoredValue", { isLightWhenComplete });
  localStorage.setItem(locals.isLight, isLightWhenDom.toString());
  isLightWhenComplete ? start() : stop();
}

function removeClasses() {
  log("removeClasses");
  const classesArr = Object.values(classes).filter(
    (className) => className !== classes.defaultCustomScrollOn,
  );
  const selector = classesArr.map((className) => `.${className}`).join(",");
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => element.classList.remove(...classesArr));
}
