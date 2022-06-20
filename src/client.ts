import { decorator, logger } from "debug";
import { handlers } from "./handlers";
import { Status } from "./status";
import { changeObserver } from "./utils/change-observer";
import { checkDocumentIsLight } from "./utils/check-document-is-light";
import { checkIsInViewport } from "./utils/check-is-in-viewport";
import { checkIsVisible } from "./utils/check-is-visible";
import * as chromeStore from "./utils/chrome-store";
import { getRootBackColorStatus } from "./utils/get-root-back-color-status";
import { getRootTextColorStatus } from "./utils/get-root-text-color-status";
import { waitForBody } from "./utils/wait-for-body";

// magic number, seems not laggy
const log = logger("sdm");
const logMethod = decorator(log);

const CHUNK_SIZE = 32;
export const SELECTOR =
  "body *:not(svg *,script,style,link,template,pre *,[contenteditable] > *)";

const promises = [chromeStore.get<boolean | null>(), waitForBody()];
Promise.all(promises).then(([storedStatus]) => {
  log(`promise`, { storedStatus, hasBody: Boolean(document.body) });
  new App(storedStatus as boolean | null);
});

class App {
  status: Status;
  observer: ReturnType<typeof changeObserver>;
  viewportQueue: Set<HTMLElement> = new Set();
  regularQueue: Set<HTMLElement> = new Set();

  constructor(storedStatus: boolean | null) {
    const isLightChecker = () => checkDocumentIsLight(document.body);
    this.status = new Status(storedStatus, isLightChecker);
    this.observer = changeObserver(this.observerHandler.bind(this));
    log(`status`, this.status);
    log(`status value`, this.status.value);

    // for unsubscribe
    this.handleDomReady = this.handleDomReady.bind(this);
    this.init();
  }

  @logMethod
  init() {
    const { value } = this.status;
    log(`send message to background`, value);
    chrome.runtime.sendMessage({ type: "status", value });
    chrome.runtime.onMessage.addListener((message) => {
      log(`onMessage from background`, message);
      if (message === "toggle") this.handleToggle();
    });
    chrome.storage.sync.get(["darkScroll"], ({ darkScroll }) =>
      this.initDarkScroll(darkScroll),
    );

    this.setInitialRootAttributes();
    this.setRootAttributes();
    if (value) this.on();
  }

  @logMethod
  initDarkScroll(isActive: boolean) {
    const { documentElement: html } = document;
    html.dataset.sdmDarkScroll = isActive ? "on" : "off";
  }

  @logMethod
  applyStatus() {
    const { value } = this.status;
    log("status value", value);
    if (value) this.on();
    else this.off();
  }

  @logMethod
  on() {
    this.addListeners();
    this.setRootAttributes();
    this.run();
  }

  @logMethod
  off() {
    this.setRootAttributes();
    this.removeListeners();
  }

  @logMethod
  addListeners() {
    log(`readyState`, document.readyState);
    if (document.readyState !== "loading") {
      this.observer.start();
    } else {
      document.addEventListener("DOMContentLoaded", this.handleDomReady);
    }
  }

  @logMethod
  handleDomReady() {
    this.observer.start();
    this.applyStatus();
  }

  @logMethod
  removeListeners() {
    this.observer.stop();
    document.removeEventListener("DOMContentLoaded", this.handleDomReady);
  }

  @logMethod
  observerHandler(elements: HTMLElement[]) {
    elements.forEach((item) => this.viewportQueue.add(item));
    this.handleQueues();
  }

  @logMethod
  handleToggle() {
    const value = this.status.toggle();
    chromeStore.set(value);
    chrome.runtime.sendMessage({ type: "status", value });
    this.applyStatus();
  }

  @logMethod
  setInitialRootAttributes() {
    const { colorScheme } = getComputedStyle(document.documentElement);
    document.documentElement.dataset.sdmColorScheme = colorScheme;
  }

  @logMethod
  setRootAttributes() {
    const { documentElement: html } = document;
    html.dataset.sdm = this.status.value ? "on" : "off";

    delete html.dataset.sdmTextColor;
    delete html.dataset.sdmBackColor;

    html.dataset.sdmTextColor = getRootTextColorStatus();
    html.dataset.sdmBackColor = getRootBackColorStatus();
  }

  @logMethod
  run() {
    const htmlElements = Array.from(document.querySelectorAll(SELECTOR)).filter(
      ($element) => $element instanceof HTMLElement,
    ) as HTMLElement[];
    htmlElements.forEach((item) => {
      if (!checkIsVisible(item)) return;

      if (checkIsInViewport(item)) {
        this.viewportQueue.add(item);
        this.regularQueue.delete(item);
      } else {
        if (this.viewportQueue.has(item)) return;
        this.regularQueue.add(item);
      }
    });
    setTimeout(() => this.handleQueues());
  }

  getChunk(queue: Set<HTMLElement>) {
    const regularHtmlElements = [...queue].slice(0, CHUNK_SIZE);
    regularHtmlElements.forEach((element) => queue.delete(element));
    return regularHtmlElements;
  }

  @logMethod
  handleQueues(): void {
    const { viewportQueue, regularQueue } = this;
    const isComplete = document.readyState === "complete";

    log(`queues`, {
      isComplete,
      viewportQueue: this.viewportQueue.size,
      regularQueue: this.regularQueue.size,
    });

    // first priority
    setTimeout(() => {
      if (viewportQueue.size > 0) {
        this.handleViewportQueue();
      }
    });

    requestIdleCallback(() => {
      if (isComplete && regularQueue.size > 0) {
        this.handleRegularQueue();
      }
    });
  }

  @logMethod
  handleViewportQueue() {
    const viewportChunk = this.getChunk(this.viewportQueue);
    viewportChunk.forEach(this.handleElement.bind(this));
    this.handleQueues();
  }

  @logMethod
  handleRegularQueue() {
    const regularChunk = this.getChunk(this.regularQueue);
    regularChunk.forEach(this.handleElement.bind(this));
    this.handleQueues();
  }

  handleElement(htmlElement: HTMLElement) {
    handlers.forEach((handle) => handle(htmlElement));
  }
}
