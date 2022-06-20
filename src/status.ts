import { decorator, logger } from "debug";
import { whitelist } from "./whitelist";

const log = logger("store");
const logMethod = decorator(log);

export class Status {
  host = location.hostname.replace("www.", "");
  isExcluded = whitelist.includes(this.host);
  isMaybeExcluded = whitelist.some((item) => this.host.endsWith(item));
  stored: boolean | null = null;
  checkIsLight: () => boolean;

  constructor(storedStatus: boolean | null, checkIsLight: () => boolean) {
    log("stored", storedStatus);
    this.stored = storedStatus;
    this.checkIsLight = checkIsLight;
  }

  get value() {
    if (typeof this.stored === "boolean") return this.stored;
    if (this.isExcluded) return false;
    const colorScheme = document.documentElement.dataset.sdmColorScheme;
    log("colorScheme", colorScheme);
    if (colorScheme === "dark") return false;
    const isLight = this.checkIsLight();
    log("isLight", isLight);
    if (typeof isLight === "boolean") return isLight;
    return this.isMaybeExcluded ? false : true;
  }

  @logMethod
  toggle() {
    log("toggle");
    this.stored = !this.value;
    return this.stored;
  }
}
