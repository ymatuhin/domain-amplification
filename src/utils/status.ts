import { whitelist } from "../whitelist";

export class Status {
  host = location.hostname.replace("www.", "");
  isExcluded = whitelist.includes(this.host);
  isMaybeExcluded = whitelist.some((item) => this.host.endsWith(item));
  stored: boolean | null = null;
  checkIsLight: () => boolean;

  constructor(stored: boolean | null, checkIsLight: () => boolean) {
    this.stored = stored;
    this.checkIsLight = checkIsLight;
  }

  get value() {
    if (typeof this.stored === "boolean") return this.stored;
    if (this.isExcluded) return false;
    const { colorScheme } = getComputedStyle(document.documentElement);
    if (colorScheme === "dark") return false;
    const isLight = this.checkIsLight();
    if (typeof isLight === "boolean") return isLight;
    return this.isMaybeExcluded ? false : true;
  }

  toggle() {
    this.stored = !this.value;
    return this.stored;
  }
}
