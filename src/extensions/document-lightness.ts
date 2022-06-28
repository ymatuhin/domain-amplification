import { checkDocumentIsLight } from "../color";
import { logger } from "../config";
import { waitForBody } from "../dom";
import { $isLight } from "../state";
import type { Extension } from "./index";

const log = logger("document-lightness");

export default {
  async init() {
    log("init");
    await waitForBody();
    const isLight = checkDocumentIsLight();
    log("syncLightness", { isLight });
    $isLight.set(isLight);
  },
  async handleHtmlBody() {
    await waitForBody();
    const isLight = checkDocumentIsLight();
    log("handleHtmlBody", { isLight });
    $isLight.set(isLight);
  },
} as Extension;
