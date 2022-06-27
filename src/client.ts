import "./client.scss";
import { checkDocumentIsLight } from "./color";
import { elementsSelector, logger } from "./config";
import { waitForBody, waitForDom } from "./dom";
import { observeChanges } from "./dom/observe-changes";
import { createQueue } from "./dom/queue";
import { watchHtmlBody } from "./dom/watch-html-body";
import { extensions } from "./extensions";
import { $isEnabled, $isLight } from "./state";
import { addRule, clearRules, rootRule } from "./styles";

const log = logger("client");
const queue = createQueue(changeHandler);
const observer = observeChanges(queue.addElements);

init();

async function init() {
  log("init");
  extensions.forEach((ext) => ext.init?.());

  $isEnabled.subscribe((value) => {
    if (value === null) return;
    value ? start() : stop();
  });

  await waitForBody();
  syncLightness();
  watchHtmlBody(syncLightness);
}

function changeHandler(element: HTMLElement) {
  extensions.forEach((ext) => ext.handle?.({ element }));
}

async function start() {
  log("start");
  addRule(rootRule);
  await waitForDom();
  const nodeList = document.querySelectorAll(elementsSelector);
  const elements = Array.from(nodeList) as HTMLElement[];
  queue.start();
  queue.addElements(elements);
  observer.start();
}

function stop() {
  log("stop");
  clearRules();
  queue.stop();
  observer.stop();
  extensions.forEach((ext) => ext.stop?.());
}

function syncLightness() {
  const isLight = checkDocumentIsLight();
  log("syncLightness", { isLight });
  $isLight.set(isLight);
}
