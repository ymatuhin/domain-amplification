import { chunkSize, elementsSelector, log } from "../config";
import { checkIsInViewport } from "./check-is-in-viewport";
import { runHandlers } from "./handlers";
import { observeChanges } from "./observe-changes";

const viewportQueue = new Set<HTMLElement>();
const regularQueue = new Set<HTMLElement>();
const observer = observeChanges(observerHandler);

function observerHandler(elements: HTMLElement[]) {
  elements.forEach(addElementToQueue);
  handleQueues();
}

export const start = observer.start;
export const stop = observer.stop;

export function run() {
  const elements = document.querySelectorAll(elementsSelector);
  log("dom run", elements);
  // for cycle is here for performance reasons
  for (let a = elements.length - 1; a >= 0; --a) {
    const element = elements[a] as HTMLElement;
    addElementToQueue(element);
  }
  setTimeout(() => handleQueues());
}

function addElementToQueue(element: HTMLElement) {
  if (checkIsInViewport(element)) {
    viewportQueue.add(element);
    regularQueue.delete(element);
  } else {
    if (viewportQueue.has(element)) return;
    regularQueue.add(element);
  }
}

let handling = false;
function handleQueues() {
  if (handling) return;
  if (viewportQueue.size === 0 && regularQueue.size === 0) return;

  log("dom handleQueues", {
    viewportQueue: viewportQueue.size,
    regularQueue: regularQueue.size,
  });

  // first priority
  if (viewportQueue.size > 0) {
    handling = true;
    const viewportChunk = getChunk(viewportQueue);
    viewportChunk.forEach(runHandlers);
    handling = false;
    setTimeout(handleQueues);
    return;
  }

  if (regularQueue.size > 0) {
    handling = true;
    const regularChunk = getChunk(regularQueue);
    regularChunk.forEach(runHandlers);
    handling = false;
    requestIdleCallback(handleQueues);
  }
}

function getChunk(queue: Set<HTMLElement>) {
  const elements = [...queue].slice(0, chunkSize);
  log("dom getChunk", elements);
  elements.forEach((element) => queue.delete(element));
  return elements;
}
