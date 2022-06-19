import { logger } from "debug";
import * as chromeStore from "./chrome-store";
import { handlers } from "./handlers";
import { observeChanges } from "./observer";
import { Status } from "./status";
import { checkDocumentIsLight } from "./utils/check-document-is-light";
import { checkIsInViewport } from "./utils/check-is-in-viewport";
import { checkIsVisible } from "./utils/check-is-visible";
import { getRootBackColorStatus } from "./utils/get-root-back-color-status";
import { getRootTextColorStatus } from "./utils/get-root-text-color-status";
import { waitForBody } from "./utils/wait-for-body";

// magic number, seems not laggy
const log = logger("💡 smart-dark-mode");
const CHUNK_SIZE = 24;
export const SELECTOR =
  "body *:not(svg *,script,style,link,template,pre *,[contenteditable] > *)";

const promises = [chromeStore.get<boolean | null>(), waitForBody()];
Promise.all(promises).then(([storedStatus]) => {
  log(`promise`, { storedStatus, hasBody: Boolean(document.body) });
  new App(storedStatus as boolean | null);
});

class App {
  status: Status;
  viewportQueue: Set<HTMLElement> = new Set();
  regularQueue: Set<HTMLElement> = new Set();

  constructor(storedStatus: boolean | null) {
    const isLight = checkDocumentIsLight(document.body);
    log(`isLight`, isLight);
    this.status = new Status(storedStatus, isLight);
    log(`status`, this.status);
    this.init();
  }

  init() {
    log(`send message to background`, this.status.value);
    chrome.runtime.sendMessage({ type: "status", value: this.status.value });
    this.addListeners();
    this.setRootAttributes();
    this.run();
  }

  addListeners() {
    log(`addListeners`, { readyState: document.readyState });
    if (document.readyState === "complete") this.runObserver();
    if (document.readyState !== "complete") {
      document.addEventListener("readystatechange", () => {
        log(`readystatechange`, { readyState: document.readyState });
        this.run();
        if (document.readyState === "complete") this.runObserver();
      });
    }
    chrome.runtime.onMessage.addListener((message) => {
      log(`onMessage from background`, message);
      if (message === "toggle") this.handleToggle();
    });
  }

  runObserver() {
    log(`runObserver`);
    observeChanges((elements) => {
      log(`observeChanges`, elements);
      elements.forEach(this.viewportQueue.add, this.viewportQueue);
      this.handleQueues();
    });
  }

  handleToggle() {
    log(`handleToggle`);
    this.status.toggle();
    chromeStore.set(this.status.value);
    chrome.runtime.sendMessage({ type: "status", value: this.status.value });
    this.setRootAttributes();
    this.run();
  }

  setRootAttributes() {
    log(`setRootAttributes`);
    const { documentElement: html } = document;
    html.dataset.da = this.status.value ? "on" : "off";

    delete html.dataset.daTextColor;
    delete html.dataset.daBackColor;

    html.dataset.daTextColor = getRootTextColorStatus();
    html.dataset.daBackColor = getRootBackColorStatus();
  }

  run() {
    log(`run`);
    const htmlElements = Array.from(document.querySelectorAll(SELECTOR)).filter(
      ($element) => $element instanceof HTMLElement,
    ) as HTMLElement[];
    htmlElements.forEach((item) => {
      if (!checkIsVisible(item)) return;
      if (checkIsInViewport(item)) {
        this.viewportQueue.add(item);
        this.regularQueue.delete(item);
      } else {
        this.regularQueue.add(item);
        this.viewportQueue.delete(item);
      }
    });
    log(`run:end`);

    this.handleQueues();
  }

  getChunk(queue: Set<HTMLElement>) {
    const regularHtmlElements = [...queue].slice(0, CHUNK_SIZE);
    regularHtmlElements.forEach(queue.delete, queue);
    return regularHtmlElements;
  }

  handleQueues(): void {
    log(`handleQueues`, {
      viewportQueue: this.viewportQueue,
      regularQueue: this.regularQueue,
    });
    // first priority
    this.handleViewportQueue();

    // only after full load and no more viewport items to handle
    if (document.readyState !== "complete") return;
    if (this.viewportQueue.size > 0) return;
    this.handleRegularQueue();
  }

  handleViewportQueue() {
    if (this.viewportQueue.size === 0) return;
    log(`handleViewportQueue`, this.viewportQueue);

    const viewportChunk = this.getChunk(this.viewportQueue);
    viewportChunk.forEach(this.handleElement, this);
    setTimeout(() => this.handleQueues(), 10);
  }

  handleRegularQueue() {
    if (this.regularQueue.size === 0) return;
    log(`handleRegularQueue`, this.regularQueue);

    const regularChunk = this.getChunk(this.regularQueue);
    regularChunk.forEach(this.handleElement, this);
    requestIdleCallback(() => this.handleQueues());
  }

  handleElement(htmlElement: HTMLElement) {
    handlers.forEach((handle) => handle(htmlElement));
  }
}
