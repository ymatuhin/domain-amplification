import { subscribeOnChange } from "shared/utils/subscribe-on-change";
import "./client.scss";
import { checkDocumentIsLight } from "./color";
import { elementsSelector, logger } from "./config";
import { waitForBody, waitForDom } from "./dom";
import { observeChanges } from "./dom/observe-changes";
import { createQueue } from "./dom/queue";
import { watchHtmlBody } from "./dom/watch-html-body";
import { extensions } from "./extensions";
import { $isEnabled, $isLight } from "./state";

const log = logger("client");
const queue = createQueue(changeHandler);
const observer = observeChanges(queue.addElements);

init();

async function init() {
  log("init");
  subscribeOnChange($isEnabled, (value) => (value ? start() : stop()));

  await waitForBody();
  syncLightness();
  watchHtmlBody(syncLightness);
}

function changeHandler(element: HTMLElement) {
  extensions.forEach((ext) => ext.handle({ element }));
}

async function start() {
  log("start");
  await waitForDom();
  const nodeList = document.querySelectorAll(elementsSelector);
  const elements = Array.from(nodeList) as HTMLElement[];
  queue.start();
  queue.addElements(elements);
  observer.start();
}

function stop() {
  log("stop");
  queue.stop();
  observer.stop();
  extensions.forEach((ext) => ext.stop());
}

function syncLightness() {
  const isLight = checkDocumentIsLight();
  log("syncLightness", { isLight });
  $isLight.set(isLight);
}
