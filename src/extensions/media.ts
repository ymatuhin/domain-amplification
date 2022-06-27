import { mediaSelector } from "../config";
import { getSelector } from "../dom/get-selector";
import { addRule, mediaFilter } from "../styles";
import type { Extension } from "./index";

export default {
  handle({ element }) {
    if (element.matches(mediaSelector)) {
      const selector = getSelector(element);
      addRule(`${selector} { ${mediaFilter} }`);
      element.inverted = true;
    }
  },
} as Extension;
