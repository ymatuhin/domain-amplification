import { chunkSize, logger } from "../config";
import { checkIsInViewport } from "./check-is-in-viewport";

const log = logger("queue");

type Handler = (element: HTMLElement) => void;
export function createQueue(handler: Handler) {
  log("create", { handler });
  let isRunning = false;
  let isHandling = false;
  const viewportQueue = new Set<HTMLElement>();
  const regularQueue = new Set<HTMLElement>();

  const addElement = (element: HTMLElement) => {
    if (checkIsInViewport(element)) {
      viewportQueue.add(element);
      regularQueue.delete(element);
    } else {
      if (viewportQueue.has(element)) return;
      regularQueue.add(element);
    }
  };

  const addElements = (allElements: HTMLElement[], done = handleQueues) => {
    if (allElements.length === 0) return done();

    const elements = allElements.splice(0, chunkSize * 2);
    log("addElements", { elements });
    for (let a = elements.length - 1; a >= 0; --a) {
      addElement(elements[a]);
    }
    addElements(allElements, done);
  };

  function getChunk(queue: Set<HTMLElement>) {
    const elements = [...queue].slice(0, chunkSize);
    log("getChunk", elements);
    elements.forEach((element) => queue.delete(element));
    return elements;
  }

  function handleQueues() {
    if (isHandling || !isRunning) return;
    if (viewportQueue.size === 0 && regularQueue.size === 0) return;

    log("handleQueues", {
      viewportQueue: viewportQueue.size,
      regularQueue: regularQueue.size,
    });

    // first priority
    if (viewportQueue.size > 0) {
      isHandling = true;
      const viewportChunk = getChunk(viewportQueue);
      viewportChunk.forEach(handler);
      isHandling = false;
      setTimeout(handleQueues);
      return;
    }

    if (regularQueue.size > 0) {
      isHandling = true;
      const regularChunk = getChunk(regularQueue);
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
