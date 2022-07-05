import { chunkSize, logger } from "../config";

const log = logger("queue");

type Handler = (element: HTMLElement) => void;
export function createQueue(handler: Handler, firstTime: boolean) {
  log("init", { handler });
  let isRunning = false;
  let isHandling = false;
  const queue = new Set<HTMLElement>();

  const addElements = (elements: HTMLElement[]) => {
    log("addElements", { elements });
    elements.forEach((element) => queue.add(element));
    handleQueues();
  };

  function getChunk() {
    const elements = [...queue].slice(0, chunkSize);
    elements.forEach((element) => queue.delete(element));
    return elements;
  }

  function handleQueues() {
    if (isHandling || !isRunning || queue.size === 0) return;
    isHandling = true;
    const chunk = getChunk();
    chunk.forEach(handler);
    isHandling = false;
    const method = firstTime ? requestAnimationFrame : requestIdleCallback;
    method(handleQueues);
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
    queue.clear();
  };

  return { start, stop, addElements };
}
