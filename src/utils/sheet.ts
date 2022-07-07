import { logger } from "../config";
// @ts-ignore
import rafThrottle from "raf-throttle";
import { checkInsideIframe } from "shared/utils/check-inside-iframe";

type Queue = { type: "add" | "remove"; rule: string };

export class Sheet {
  log: ReturnType<typeof logger>;
  #name: string;
  #sync: boolean;
  #style: HTMLStyleElement;
  #sheet: CSSStyleSheet;
  #queue: Queue[] = [];

  constructor(name: string, sync?: boolean) {
    this.log = logger(`sheet:${name}`);
    this.#name = name;
    this.#sync = sync ?? !checkInsideIframe();
    this.handleQueue = rafThrottle(this.handleQueue.bind(this));
    this.#style = this.createStyle(name);
    this.#sheet = this.#style.sheet!;
    if (this.#sync) this.#load();
  }

  createStyle(name: string) {
    const style = document.createElement("style");
    style.classList.add(`sdm-${name}`);
    document.documentElement.appendChild(style);
    return style;
  }

  makeRule(initialRule: string) {
    const sheet = new CSSStyleSheet();
    sheet.insertRule(initialRule);
    return sheet.cssRules[0].cssText;
  }

  addRule(rule: string, instant: boolean = false) {
    this.log("addRule", { rule, instant });
    if (instant) {
      this.insertRule(rule);
      requestIdleCallback(() => this.#save());
    } else {
      this.#queue.push({ type: "add", rule });
      requestAnimationFrame(() => this.handleQueue());
    }
  }

  removeRule(rule: string, instant: boolean = false) {
    this.log("removeRule", { rule, instant });
    if (instant) {
      this.deleteRule(rule);
      requestIdleCallback(() => this.#save());
    } else {
      this.#queue.push({ type: "remove", rule });
      requestAnimationFrame(this.handleQueue.bind(this));
    }
  }

  async start() {
    this.log("start");
    document.documentElement.appendChild(this.#style);
  }

  pause() {
    this.log("pause");
    this.#style.parentElement?.removeChild(this.#style);
  }

  clear() {
    this.log("clear");
    // @ts-ignore
    this.#sheet.replaceSync("");
  }

  handleQueue() {
    if (this.#queue.length === 0) return;
    this.log("handleQueue");
    this.#queue.forEach(({ rule, type }) => {
      if (type === "add") this.insertRule(rule);
      if (type === "remove") this.deleteRule(rule);
    });
    this.#queue = [];

    if (!this.#sync) return;
    requestIdleCallback(() => this.#save());
  }

  insertRule(rule: string) {
    const rulesArr = Array.from(this.#sheet.cssRules);
    if (rulesArr.some(({ cssText }) => cssText === rule)) return;
    this.log("insertRule", rule);
    var index = this.#sheet.cssRules.length;
    this.#sheet.insertRule(rule, index);
  }

  deleteRule(rule: string) {
    const rulesArr = Array.from(this.#sheet.cssRules);
    const index = rulesArr.findIndex(({ cssText }) => cssText === rule);
    if (index >= 0) {
      this.log("deleteRule", rule);
      this.#sheet.deleteRule(index);
    }
  }

  #save() {
    const rules = Array.from(this.#sheet.cssRules);
    const text = rules.map((rule) => rule.cssText).join("\n");
    this.log("save", { text });
    localStorage.setItem(`sdm-sheet-${this.#name}`, text);
  }

  #load() {
    const saved = localStorage.getItem(`sdm-sheet-${this.#name}`);
    this.log("load", { saved });
    // @ts-ignore
    console.info(`🔥 this.#sheet`, this.#sheet);
    if (saved) this.#sheet.replaceSync(saved);
  }
}
