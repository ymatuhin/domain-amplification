import { logger } from "../config";
// @ts-ignore
import rafThrottle from "raf-throttle";
import { checkInsideIframe } from "shared/utils/check-inside-iframe";

type Queue = { type: "add" | "remove"; rule: string };

export class Sheet {
  log: ReturnType<typeof logger>;
  #name: string;
  #sync: boolean = false;
  #sheet = new CSSStyleSheet();
  #queue: Queue[] = [];

  constructor(name: string, sync?: boolean) {
    this.log = logger(`sheet:${name}`);
    this.#name = name;
    this.#sync = sync ?? !checkInsideIframe();
    this.start();
    this.handleQueue = rafThrottle(this.handleQueue.bind(this));
    if (this.#sync) this.#load();
  }

  makeRule(initialRule: string) {
    const sheet = new CSSStyleSheet();
    sheet.insertRule(initialRule);
    return sheet.cssRules[0].cssText;
  }

  addRule(rule: string, instant: boolean = false) {
    this.log("addRule", { rule, instant });
    if (instant) {
      this.#insertRule(rule);
      requestIdleCallback(() => this.#save());
    } else {
      this.#queue.push({ type: "add", rule });
      requestAnimationFrame(() => this.handleQueue());
    }
  }

  removeRule(rule: string, instant: boolean = false) {
    this.log("removeRule", { rule, instant });
    if (instant) {
      this.#deleteRule(rule);
      requestIdleCallback(() => this.#save());
    } else {
      this.#queue.push({ type: "remove", rule });
      requestAnimationFrame(this.handleQueue.bind(this));
    }
  }

  start() {
    this.log("start");
    const { adoptedStyleSheets } = document as any;
    if (adoptedStyleSheets.includes(this.#sheet)) return;
    adoptedStyleSheets.push(this.#sheet);
  }

  pause() {
    this.log("pause");
    const { adoptedStyleSheets } = document as any;
    const index = adoptedStyleSheets.indexOf(this.#sheet);
    adoptedStyleSheets.splice(index, 1);
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
      if (type === "add") this.#insertRule(rule);
      if (type === "remove") this.#deleteRule(rule);
    });
    this.#queue = [];

    if (!this.#sync) return;
    requestIdleCallback(() => this.#save());
  }

  #insertRule(rule: string) {
    const rulesArr = Array.from(this.#sheet.cssRules);
    if (rulesArr.some(({ cssText }) => cssText === rule)) return;
    this.log("insertRule", rule);
    this.#sheet.insertRule(rule);
  }

  #deleteRule(rule: string) {
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
    this.log("save", text);
    localStorage.setItem(`sdm-sheet-${this.#name}`, text);
  }

  #load() {
    const saved = localStorage.getItem(`sdm-sheet-${this.#name}`);
    this.log("load", saved);
    // @ts-ignore
    if (saved) this.#sheet.replaceSync(saved);
  }
}
