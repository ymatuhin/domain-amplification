import { chunkSize, logger } from "../config";
import { checkIsInViewport } from "./check-is-in-viewport";

const log = logger("queue");

type Handler = (element: HTMLElement) => void;
export function createQueue(handler: Handler, firstTime: boolean) {
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
    if (checkIsInViewport(element)) addToViewport(element);
    else addToRegular(element);
  };

  const addElements = (elements: HTMLElement[]) => {
    log("addElements", { elements });
    elements.forEach(addElement);
    handleQueues();
  };

  function getChunk(queue: Set<HTMLElement>) {
    const elements = [...queue].slice(0, chunkSize);
    log("getChunk", elements);
    elements.forEach((element) => queue.delete(element));
    return elements;
  }

  function handleQueues() {
    if (isHandling || !isRunning) return;

    // first priority
    if (viewportQueue.size > 0) {
      isHandling = true;
      const viewportChunk = getChunk(viewportQueue);
      viewportChunk.forEach(handler);
      isHandling = false;

      const method = firstTime ? setTimeout : requestIdleCallback;
      method(handleQueues);
      return;
    }

    if (regularQueue.size > 0) {
      isHandling = true;
      const regularChunk = getChunk(regularQueue);
      regularChunk.forEach(handler);
      isHandling = false;
      requestIdleCallback(handleQueues);
      return;
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
