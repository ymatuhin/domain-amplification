import workerFn from "./worker";

export function createWorker() {
  const blobParams = { type: "application/javascript" };
  const blob = new Blob([`(${workerFn.toString()})()`], blobParams);
  return new Worker(URL.createObjectURL(blob));
}
