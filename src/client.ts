import { elementsSelector, logger } from "./config";
import { waitForDom, waitForDomComplete } from "./dom";
import { observeChanges } from "./dom/observe-changes";
import { createQueue } from "./dom/queue";
import { watchHtmlBody } from "./dom/watch-html-body";
import type { HTMLElementExtended } from "./extensions";
import { extensions } from "./extensions";
import { $isEnabled } from "./state";
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

  watchHtmlBody(() => {
    extensions.forEach((ext) => ext.handleHtmlBody?.());
  });
}

function changeHandler(element: HTMLElement) {
  extensions.forEach((ext) =>
    ext.handleElement?.(element as HTMLElementExtended),
  );
}

async function start() {
  log("start");
  addRule(rootRule);
  extensions.forEach((ext) => ext.start?.());

  await waitForDom();
  const nodeList = document.querySelectorAll(elementsSelector);
  const elements = Array.from(nodeList) as HTMLElement[];
  queue.start();
  queue.addElements(elements);
  observer.start();
  extensions.forEach((ext) => ext.domReady?.());

  await waitForDomComplete();
  extensions.forEach((ext) => ext.domComplete?.());
}

function stop() {
  log("stop");
  clearRules();
  queue.stop();
  observer.stop();
  extensions.forEach((ext) => ext.stop?.());
}
