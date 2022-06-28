import { chunkSize, logger } from "../config";
import { checkIsInViewport } from "./check-is-in-viewport";
import { checkIsVisible } from "./check-is-visible";

const log = logger("queue");

type Handler = (element: HTMLElement) => void;
export function createQueue(handler: Handler) {
  log("init", { handler });
  let isRunning = false;
  let isHandling = false;
  const viewportQueue = new Set<HTMLElement>();
  const regularQueue = new Set<HTMLElement>();

  const addToViewport = (element: HTMLElement) => {
    viewportQueue.add(element);
    regularQueue.delete(element);
  };

  const addToRegular = (element: HTMLElement) => {
    if (viewportQueue.has(element)) return;
    regularQueue.add(element);
  };

  const addElement = (element: HTMLElement) => {
    if (!checkIsVisible(element)) addToRegular(element);
    else if (checkIsInViewport(element)) addToViewport(element);
    else addToRegular(element);
  };

  const addElements = (elements: HTMLElement[]) => {
    log("addElements", { elements });
    for (let a = elements.length - 1; a >= 0; --a) {
      addElement(elements[a]);
    }
    handleQueues();
  };

  function getChunk(queue: Set<HTMLElement>, increased: boolean) {
    const size = increased ? chunkSize * 2 : chunkSize;
    const elements = [...queue].slice(0, size);
    log("getChunk", elements);
    elements.forEach((element) => queue.delete(element));
    return elements;
  }

  function handleQueues() {
    if (isHandling || !isRunning) return;
    if (viewportQueue.size === 0 && regularQueue.size === 0) return;

    // first priority
    if (viewportQueue.size > 0) {
      isHandling = true;
      const viewportChunk = getChunk(viewportQueue, true);
      viewportChunk.forEach(handler);
      isHandling = false;
      requestAnimationFrame(handleQueues);
      return;
    }

    if (regularQueue.size > 0) {
      isHandling = true;
      const regularChunk = getChunk(regularQueue, false);
      regularChunk.forEach(handler);
      isHandling = false;
      requestIdleCallback(handleQueues);
    }
  }

  const start = () => {
    log("start");
    if (isRunning) return;
    isRunning = true;
  };

  const stop = () => {
    log("stop");
    if (!isRunning) return;
    isRunning = false;
    viewportQueue.clear();
    regularQueue.clear();
  };

  return { start, stop, addElements };
}
