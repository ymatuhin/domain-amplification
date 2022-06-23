import "./client.scss";
import { checkDocumentIsLight } from "./color";
import { classes, log } from "./config";
import { waitForDom, waitForDomComplete } from "./dom";
import { initCustomScroll } from "./scroll";
import { checkSystemColors } from "./system-colors";

const { documentElement: html } = document;
let isRunning: boolean | null = null;

init();

function init() {
  log("init");
  html.classList.add(classes.init);
  initCustomScroll();
  addUniversalListeners();
  const stored = localStorage.getItem("sdm-enabled");
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
    console.info(`🔥 isRunning`, isRunning);
    const wasRunning = isRunning;
    wasRunning ? stop() : start();
    localStorage.setItem("sdm-enabled", (!wasRunning).toString());
  });
}

function start() {
  if (isRunning === true) return;
  log("start");
  isRunning = true;
  checkSystemColors();
  console.info(`🔥 classes.init`, classes.init);
  html.classList.remove(classes.init);
  html.classList.add(classes.powerOn);
  chrome.runtime.sendMessage({ type: "status", value: isRunning });
}

function stop() {
  if (isRunning === false) return;
  log("stop");
  isRunning = false;
  chrome.runtime.sendMessage({ type: "status", value: isRunning });
  removeClasses();
}

async function handleNoStoredValue() {
  log("handleNoStoredValue");
  const isLightSaved = localStorage.getItem("sdm-is-light");
  log("handleNoStoredValue", { isLightSaved });
  if (isLightSaved === "true") start();

  checkDocumentLightness();
}

async function checkDocumentLightness() {
  await waitForDom();
  const isLightWhenDom = checkDocumentIsLight();
  log("handleNoStoredValue", { isLightWhenDom });
  localStorage.setItem("sdm-is-light", isLightWhenDom.toString());
  isLightWhenDom ? start() : stop();

  await waitForDomComplete();
  const isLightWhenComplete = checkDocumentIsLight();
  log("handleNoStoredValue", { isLightWhenComplete });
  localStorage.setItem("sdm-is-light", isLightWhenDom.toString());
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
