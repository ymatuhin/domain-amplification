import { elementsSelector, locals, logger } from "./config";
import { waitForDom } from "./dom";
import { observeChanges } from "./dom/observe-changes";
import { createQueue } from "./dom/queue";
import { runMiddleware } from "./middleware";
import { $isEnabled } from "./state";

const log = logger("client");
const noSavedStyles = localStorage.getItem(locals.styles) === null;
const queue = createQueue(changeHandler, noSavedStyles);
const observer = observeChanges(queue.addElements);

log("init");
runMiddleware({ status: "init" });

$isEnabled.subscribe((value) => {
  log("$isEnabled", value);
  if (value === null) return;
  value ? start() : stop();
});

function changeHandler(element: HTMLElement) {
  runMiddleware({ status: "update", element });
}

async function start() {
  log("start");
  runMiddleware({ status: "start" });

  await waitForDom();
  observer.start();
  const nodeList = document.querySelectorAll(elementsSelector);
  const elements = Array.from(nodeList) as HTMLElement[];
  queue.start();
  queue.addElements(elements);
}

function stop() {
  log("stop");
  runMiddleware({ status: "stop" });
  queue.stop();
  observer.stop();
}
