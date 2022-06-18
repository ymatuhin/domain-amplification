import * as chromeStore from "./chrome-store";
import { handlers } from "./handlers";
import { observeChanges } from "./observer";
import { Status } from "./status";
import { bodyWaiter } from "./utils/body-waiter";
import { getLightnessStatus } from "./utils/get-lightness-status";
import { getRootBackColorStatus } from "./utils/get-root-back-color-status";
import { getRootTextColorStatus } from "./utils/get-root-text-color-status";
import { isInViewport } from "./utils/in-viewport";
import { isVisible } from "./utils/is-visible";

const CHUNK_SIZE = 32;
export const SELECTOR =
  "body *:not(svg *,script,style,link,template,pre *,[contenteditable] > *)";

const promises = [chromeStore.get<boolean | null>(), bodyWaiter()];
Promise.all(promises).then(
  ([storedStatus]) => new App(storedStatus as boolean | null),
);

class App {
  status: Status;
  viewportQueue: Set<HTMLElement> = new Set();
  regularQueue: Set<HTMLElement> = new Set();

  constructor(storedStatus: boolean | null) {
    const isLight = checkIsDocumentLight(document.body);
    this.status = new Status(storedStatus, isLight);
    this.init();
  }

  init() {
    chrome.runtime.sendMessage(this.status.value);
    this.addListeners();
    this.setRootAttributes();
    this.run();
  }

  addListeners() {
    if (document.readyState === "complete") this.runObserver();
    if (document.readyState !== "complete") {
      document.addEventListener("readystatechange", () => {
        this.run();
        if (document.readyState === "complete") this.runObserver();
      });
    }
    chrome.runtime.onMessage.addListener(
      (message) => message === "toggle" && this.handleToggle(),
    );
  }

  runObserver() {
    observeChanges((elements) => {
      elements.forEach(this.viewportQueue.add, this.viewportQueue);
      this.handleQueues();
    });
  }

  handleToggle() {
    this.status.toggle();
    chromeStore.set(this.status.value);
    chrome.runtime.sendMessage(this.status.value);
    this.setRootAttributes();
    this.run();
  }

  setRootAttributes() {
    const { documentElement: html } = document;
    html.dataset.da = this.status.value ? "on" : "off";

    delete html.dataset.daTextColor;
    delete html.dataset.daBackColor;

    html.dataset.daTextColor = getRootTextColorStatus();
    html.dataset.daBackColor = getRootBackColorStatus();
  }

  run() {
    const elements = Array.from(document.querySelectorAll(SELECTOR));
    const htmlElements = elements.filter(
      ($element) => $element instanceof HTMLElement,
    ) as HTMLElement[];
    const visibleHtmlElements = htmlElements.filter(isVisible);
    const viewportHtmlElements = [
      document.body,
      ...visibleHtmlElements.filter(isInViewport),
    ];
    const regularHtmlElements = visibleHtmlElements.filter(
      (htmlElement) => !viewportHtmlElements.includes(htmlElement),
    );
    viewportHtmlElements.forEach(this.viewportQueue.add, this.viewportQueue);
    regularHtmlElements.forEach((htmlElement) => {
      if (this.viewportQueue.has(htmlElement)) return;
      this.regularQueue.add(htmlElement);
    }, this.regularQueue);

    this.handleQueues();
  }

  getRegularChunk(size: number) {
    const regularHtmlElements = [...this.regularQueue].slice(0, size);
    regularHtmlElements.forEach(this.regularQueue.delete, this.regularQueue);
    return regularHtmlElements;
  }

  handleQueues(): void {
    this.viewportQueue.forEach((htmlElement) => {
      this.handleElement(htmlElement);
      this.viewportQueue.delete(htmlElement);
      this.regularQueue.delete(htmlElement);
    }, this);

    if (this.viewportQueue.size < CHUNK_SIZE) {
      const chunk = this.getRegularChunk(CHUNK_SIZE - this.viewportQueue.size);
      if (!chunk.length) return;
      chunk.forEach(this.handleElement, this);
      requestIdleCallback(() => this.handleQueues());
    }
  }

  handleElement(htmlElement: HTMLElement) {
    handlers.forEach((handle) => handle(htmlElement));
  }
}

function checkIsDocumentLight(body: HTMLElement) {
  const htmlStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(body);
  const htmlLightness = getLightnessStatus(htmlStyles);
  const bodyLightness = getLightnessStatus(bodyStyles);
  if (bodyLightness) return bodyLightness === "light";
  else if (htmlLightness) return htmlLightness === "light";
  return true;
}
