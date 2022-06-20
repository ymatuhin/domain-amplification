import { whitelist } from "./whitelist";

export class Status {
  host = location.hostname.replace("www.", "");
  isExcluded = whitelist.includes(this.host);
  isMaybeExcluded = whitelist.some((item) => this.host.endsWith(item));
  stored: boolean | null = null;
  isLight: boolean | null = null;

  constructor(stored: boolean | null, isLight: boolean) {
    this.stored = stored;
    this.isLight = isLight;
  }

  get value() {
    if (typeof this.stored === "boolean") return this.stored;
    if (this.isExcluded) return false;
    const { colorScheme } = getComputedStyle(document.documentElement);
    if (colorScheme === "dark") return false;
    if (typeof this.isLight === "boolean") return this.isLight;
    return this.isMaybeExcluded ? false : true;
  }

  toggle() {
    this.stored = !this.value;
  }
}
