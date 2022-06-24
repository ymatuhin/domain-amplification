import { elementsSelector, logger } from "../config";
import { runHandlers } from "./handlers";
import { observeChanges } from "./observe-changes";
import { createQueue } from "./queue";

const log = logger("dom");
const queue = createQueue(runHandlers);
const observer = observeChanges(queue.addElements);

export const start = () => {
  const nodeList = document.querySelectorAll(elementsSelector);
  const elements = Array.from(nodeList) as HTMLElement[];
  log("start", elements);
  queue.start();
  queue.addElements(elements);
  observer.start();
};

export const stop = () => {
  log("stop");
  queue.stop();
  observer.stop();
};
